---
name: generate-abinabot-audio
description: >-
  Generate voice audio clips for Abinabot Primary Music scripts using Adobe Firefly
  Speech (https://firefly.adobe.com/generate/speech) via Chrome DevTools / browser
  automation, collect the downloaded .wav files into the workspace audio/ folder,
  and verify playback through Abinabot's Web Audio Robot-izer DSP. Use whenever
  the user asks to generate or regenerate Abinabot's script voice clips.
---

# Generate Abinabot Audio Clips via Adobe Firefly Speech

Use this repeatable workflow whenever preparing a new Sunday script for Abinabot and generating voice audio clips in Adobe Firefly Speech (`https://firefly.adobe.com/generate/speech`).

## Step 1: Extract the Robot Lines & Target Filenames
1. Read `scripts-data.js` in the workspace root.
2. Locate the active script object (e.g., `sunday-review-special`).
3. Collect all steps where `speaker === "robot"` and record:
   - Step ID / index
   - Exact `text` to synthesize
   - Target `audioFile` path (e.g., `audio/clip-01-hello.wav`).
4. Ensure `audio/` exists in the workspace (`mkdir -p audio`).

## Step 2: Open Adobe Firefly Speech & Authenticate
1. Prefer **Chrome DevTools MCP** (`new_page` / `list_pages`, `take_snapshot`, `fill`, `click`) if available so downloads land directly in `~/Downloads/`. (Note: the sandboxed `browser` subagent can generate clips into Firefly's **Generation History**, though sandboxed `blob:` downloads are blocked from writing directly to disk.)
2. Navigate to `https://firefly.adobe.com/generate/speech`.
3. If redirected to `auth.services.adobe.com`, pause and ask the user to sign in.
4. Confirm the selected voice matches the user's choice (e.g., **John — Young Adult • Male**).

## Step 3: Firefly Speech UI Quirks & Generation Loop
1. **Avoid Consecutive Periods (`...`)**: Firefly's backend rejects `...` with HTTP 422 (*"One or more characters in your input are not accepted"*). Replace ellipses with a single period `.` before submitting.
2. **Language Reset on Text Edit**: Clearing/refilling the `"Script editor"` resets the language selector to `(Auto detect)`, which triggers a *"No language selected"* alert if you click Generate immediately. Explicitly select `"English (US)"` from the `"Select a language"` combobox after filling text, then click Generate / Generate Again.
3. **Wait for Processing**: Wait for the `"We are processing your audio"` modal (`progressbar "Processing..."`) to disappear (~3–5 seconds per clip).
4. **Download Naming**: Firefly names each downloaded `.wav` using the first ~15 characters of the prompt text (e.g., `Hello kids! How.wav`).

## Step 4: Move & Rename Downloads into `audio/`
Match the downloaded `.wav` files in `~/Downloads/` to each `audioFile` target in `scripts-data.js` (by prompt prefix or timestamp order) and move/rename them into `<workspace>/audio/clip-XX-*.wav`.

## Step 5: Verify Files & DSP Playback
1. Verify every `audioFile` referenced in `scripts-data.js` exists in `audio/` and is non-empty (`ls -lh audio/`).
2. Serve the workspace over local HTTP (`python3 -m http.server 8000`) and verify playback through Abinabot's Web Audio Robot-izer DSP (`audio.js`).
