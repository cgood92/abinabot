#!/usr/bin/env python3
"""Match Adobe Firefly downloaded .wav clips in ~/Downloads to Abinabot's audio/ folder."""

import glob
import os
import re
import shutil
import sys

WORKSPACE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
SCRIPTS_FILE = os.path.join(WORKSPACE, "scripts-data.js")
AUDIO_DIR = os.path.join(WORKSPACE, "audio")
DOWNLOADS_DIR = os.path.expanduser("~/Downloads")


def normalize(s: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-zA-Z0-9 ]", "", s)).strip().lower()


def extract_clips():
    with open(SCRIPTS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(
        r'speaker:\s*"robot"[\s\S]*?text:\s*(".*?"|\'.*?\')[\s\S]*?audioFile:\s*"(audio/[^"]+)"',
        re.MULTILINE,
    )
    clips = []
    for m in pattern.finditer(content):
        text = m.group(1)[1:-1]
        audio_file = m.group(2)
        clips.append((text, audio_file))
    return clips


def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    clips = extract_clips()
    wav_files = sorted(
        glob.glob(os.path.join(DOWNLOADS_DIR, "*.wav")),
        key=os.path.getmtime,
        reverse=True,
    )

    matched = 0
    missing = []

    for text, audio_rel in clips:
        dest = os.path.join(WORKSPACE, audio_rel)
        norm_text = normalize(text)

        # Aliases for phonetic/pronunciation variations
        aliases = [norm_text]
        if "heavnly" in norm_text:
            aliases.append(norm_text.replace("heavnly", "heavenly"))
        if "abinadi" in norm_text:
            aliases.append(norm_text.replace("abinadi", "uh bin uh die"))
            aliases.append(norm_text.replace("abinadi", "uhbinuhdie"))

        candidates = []
        for wf in wav_files:
            stem = os.path.splitext(os.path.basename(wf))[0]
            stem_clean = re.sub(r"\s*\(\d+\)$", "", stem).strip()
            norm_stem = normalize(stem_clean)
            if not norm_stem:
                continue
            for a in aliases:
                if a.startswith(norm_stem):
                    candidates.append((len(norm_stem), os.path.getmtime(wf), wf))
                    break

        # Prefer longest stem match, then newest file
        candidates.sort(key=lambda x: (x[0], x[1]), reverse=True)

        if candidates:
            best_file = candidates[0][2]
            shutil.copy2(best_file, dest)
            print(f"[OK] {os.path.basename(best_file)} -> {audio_rel}")
            matched += 1
        else:
            missing.append((audio_rel, text))

    print(f"\nMatched {matched}/{len(clips)} clips into {AUDIO_DIR}")
    if missing:
        print("Missing clips:")
        for audio_rel, text in missing:
            print(f"  - {audio_rel}: {text[:50]}...")
        sys.exit(1)


if __name__ == "__main__":
    main()
