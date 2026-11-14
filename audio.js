// Abinabot Sound FX and DSP Audio Engine
// Includes real-time Web Audio API "Robot-izer" (Ring Modulation + Resonant Formant Filtering)

class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playBoop(freq = 440, type = 'sine', duration = 0.08) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn('Audio play error', e);
        }
    }

    playRobotGreeting() {
        if (!this.enabled) return;
        this.init();
        const notes = [330, 440, 550, 660];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playBoop(freq, 'sine', 0.08);
            }, idx * 60);
        });
    }

    playAdvance() {
        if (!this.enabled) return;
        this.init();
        this.playBoop(523.25, 'sine', 0.06);
        setTimeout(() => this.playBoop(659.25, 'sine', 0.08), 50);
    }

    playBack() {
        if (!this.enabled) return;
        this.init();
        this.playBoop(440, 'sine', 0.07);
        setTimeout(() => this.playBoop(349.23, 'sine', 0.09), 60);
    }

    playVoiceDetected() {
        if (!this.enabled) return;
        this.init();
        this.playBoop(659.25, 'sine', 0.06);
        setTimeout(() => this.playBoop(880, 'sine', 0.1), 60);
    }

    playCheer() {
        if (!this.enabled) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((n, i) => {
            setTimeout(() => this.playBoop(n, 'sine', 0.12), i * 80);
        });
    }
}

// Voice Engine with DSP Robot-izer Effects
class RobotVoice {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.enabled = true;
        this.isSpeaking = false;
        this.voices = [];
        this.selectedVoiceURI = '';
        this.pitch = 1.05;
        this.rate = 1.0;
        this.recordedClips = {};
        this.mediaRecorder = null;
        this.recordingChunks = [];
        this.isRecording = false;

        // Robot-izer DSP Settings
        this.robotizeRecordedVoice = true; // Apply robot DSP effect to recorded speech
        this.robotEffectPreset = 'friendly'; // 'friendly', 'metallic', 'intercom', 'none'
        this.robotIntensity = 0.55; // Blend 0 (natural) to 1.0 (heavy robot)

        this.audioCtx = null;
        this.activeSourceNode = null;

        this.initVoices();
        this.loadRecordingsFromStorage();
    }

    initAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    initVoices() {
        if (!this.synth) return;
        const load = () => {
            const allVoices = this.synth.getVoices();
            this.voices = allVoices.filter(v => v.lang.startsWith('en'));
            if (!this.voices.length) this.voices = allVoices;

            if (!this.selectedVoiceURI) {
                const preferred = this.voices.find(v => 
                    v.name.includes('Samantha') || 
                    v.name.includes('Karen') || 
                    v.name.includes('Daniel') || 
                    v.name.includes('Natural') || 
                    v.name.includes('Google') || 
                    v.name.includes('Ava')
                ) || this.voices[0];

                if (preferred) {
                    this.selectedVoiceURI = preferred.voiceURI;
                }
            }

            if (window.app && typeof window.app.populateVoiceDropdown === 'function') {
                window.app.populateVoiceDropdown();
            }
        };

        load();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = load;
        }
    }

    getVoiceList() {
        return this.voices;
    }

    setVoiceByURI(uri) {
        this.selectedVoiceURI = uri;
    }

    setPitch(val) {
        this.pitch = parseFloat(val) || 1.0;
    }

    setRate(val) {
        this.rate = parseFloat(val) || 1.0;
    }

    setRobotize(enabled) {
        this.robotizeRecordedVoice = !!enabled;
    }

    setRobotPreset(preset) {
        this.robotEffectPreset = preset;
    }

    speak(text, onStart, onEnd, stepKey = null, audioFile = null) {
        if (!this.enabled) {
            if (onStart) onStart();
            const words = text.split(/\s+/).length;
            const duration = Math.min(Math.max(words * 260, 1000), 4000);
            setTimeout(() => {
                if (onEnd) onEnd();
            }, duration);
            return;
        }

        // 1. Play user-recorded audio clip with DSP Robot-izer if present
        if (stepKey && this.recordedClips[stepKey]) {
            this.playCustomRecording(this.recordedClips[stepKey], onStart, onEnd);
            return;
        }

        // 2. Play pre-generated audioFile (e.g. from Adobe) with DSP Robot-izer, falling back to TTS if missing
        if (audioFile) {
            this.playCustomRecording(audioFile, onStart, onEnd, () => {
                this.speakSystemTTS(text, onStart, onEnd);
            });
            return;
        }

        // 3. Fallback to Clear System Voice
        this.speakSystemTTS(text, onStart, onEnd);
    }

    speakSystemTTS(text, onStart, onEnd) {
        if (!this.synth) {
            if (onEnd) onEnd();
            return;
        }

        const cleanText = text.replace(/\[.*?\]/g, '').replace(/🎵/g, '').trim();
        if (!cleanText) {
            if (onEnd) onEnd();
            return;
        }

        this.stop();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voice = this.voices.find(v => v.voiceURI === this.selectedVoiceURI);
        if (voice) {
            utterance.voice = voice;
        }
        utterance.pitch = this.pitch;
        utterance.rate = this.rate;

        utterance.onstart = () => {
            this.isSpeaking = true;
            if (onStart) onStart();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            if (onEnd) onEnd();
        };

        utterance.onerror = () => {
            this.isSpeaking = false;
            if (onEnd) onEnd();
        };

        this.synth.speak(utterance);
    }

    // Play recorded/generated audio with real-time DSP Robot-izer
    async playCustomRecording(urlOrDataUrl, onStart, onEnd, onFallback = null) {
        this.stop();
        this.initAudioContext();
        if (!this.audioCtx) {
            const audio = new Audio(urlOrDataUrl);
            audio.onplay = onStart;
            audio.onended = onEnd;
            audio.onerror = () => { if (onFallback) onFallback(); else if (onEnd) onEnd(); };
            audio.play().catch(() => { if (onFallback) onFallback(); else if (onEnd) onEnd(); });
            return;
        }

        try {
            const res = await fetch(urlOrDataUrl, { cache: 'no-store' });
            if (!res.ok) throw new Error('Audio file not found');
            const arrayBuf = await res.arrayBuffer();
            const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuf);

            this.activeSourceNode = this.audioCtx.createBufferSource();
            this.activeSourceNode.buffer = audioBuffer;

            if (this.robotizeRecordedVoice && this.robotEffectPreset !== 'none') {
                this.applyRobotizerDSP(this.activeSourceNode, onStart, onEnd);
            } else {
                this.activeSourceNode.connect(this.audioCtx.destination);
                this.activeSourceNode.onended = () => {
                    this.isSpeaking = false;
                    if (onEnd) onEnd();
                };
                this.isSpeaking = true;
                if (onStart) onStart();
                this.activeSourceNode.start(0);
            }
        } catch (e) {
            if (onFallback) {
                onFallback();
            } else {
                console.warn('Error playing audio', e);
                if (onEnd) onEnd();
            }
        }
    }

    // DSP ROBOT-IZER AUDIO GRAPH:
    // Uses Ring Modulation (Oscillator x Audio) + Resonant Formant Bandpass + Metallic Delay
    applyRobotizerDSP(sourceNode, onStart, onEnd) {
        const ctx = this.audioCtx;

        // 1. Dry path (preserves natural intelligibility for kids!)
        const dryGain = ctx.createGain();
        dryGain.gain.value = 0.45; // 45% dry voice ensures kids understand every word

        // 2. Wet path (robot harmonics)
        const wetGain = ctx.createGain();
        wetGain.gain.value = 0.65;

        // 3. Ring Modulator Node (Multiplies audio by a 45-55Hz carrier tone for metallic timbre)
        const ringModOsc = ctx.createOscillator();
        const ringModGain = ctx.createGain();

        // 4. Formant / Resonant Filter (Speaker grill / intercom box timbre)
        const formantFilter = ctx.createBiquadFilter();

        if (this.robotEffectPreset === 'metallic') {
            // Classic Sci-Fi Dalek / Cyber robot ring modulation
            ringModOsc.type = 'sine';
            ringModOsc.frequency.value = 50; // 50Hz carrier wave
            formantFilter.type = 'bandpass';
            formantFilter.frequency.value = 1800;
            formantFilter.Q.value = 3.5;
            sourceNode.playbackRate.value = 1.0;
        } else if (this.robotEffectPreset === 'intercom') {
            // Walkie-talkie / chest speaker grill
            ringModOsc.type = 'triangle';
            ringModOsc.frequency.value = 35;
            formantFilter.type = 'bandpass';
            formantFilter.frequency.value = 2200;
            formantFilter.Q.value = 4.0;
            sourceNode.playbackRate.value = 1.02;
        } else {
            // 'friendly': Disney / Pixar style friendly robot (slight pitch lift, pleasant warm ring)
            ringModOsc.type = 'sine';
            ringModOsc.frequency.value = 38;
            formantFilter.type = 'peaking';
            formantFilter.frequency.value = 1500;
            formantFilter.gain.value = 6;
            formantFilter.Q.value = 2.0;
            sourceNode.playbackRate.value = 1.08; // slightly perky & friendly!
        }

        // Wire Ring Modulator: Source -> ringModGain -> formantFilter -> wetGain
        ringModGain.gain.value = 0.0;
        ringModOsc.connect(ringModGain.gain); // Carrier wave modulates gain amplitude!

        sourceNode.connect(ringModGain);
        ringModGain.connect(formantFilter);
        formantFilter.connect(wetGain);

        // Wire Dry Path: Source -> dryGain
        sourceNode.connect(dryGain);

        // Combine Dry + Wet at Master Output
        dryGain.connect(ctx.destination);
        wetGain.connect(ctx.destination);

        // Start Oscillator & Source
        ringModOsc.start(0);

        sourceNode.onended = () => {
            this.isSpeaking = false;
            try { ringModOsc.stop(0); } catch (e) {}
            if (onEnd) onEnd();
        };

        this.isSpeaking = true;
        if (onStart) onStart();
        sourceNode.start(0);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        if (this.activeSourceNode) {
            try { this.activeSourceNode.stop(0); } catch (e) {}
            this.activeSourceNode = null;
        }
        this.isSpeaking = false;
    }

    // In-Browser Audio Recording System
    startRecording(stepKey, onRecordingDone) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Audio recording is not supported in this browser.');
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            this.recordingChunks = [];
            this.mediaRecorder = new MediaRecorder(stream);
            this.isRecording = true;

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordingChunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.isRecording = false;
                const blob = new Blob(this.recordingChunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    this.recordedClips[stepKey] = base64data;
                    this.saveRecordingsToStorage();
                    if (onRecordingDone) onRecordingDone(true);
                };
                reader.readAsDataURL(blob);

                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
        }).catch((err) => {
            console.warn('Microphone recording error', err);
            alert('Microphone access denied or unavailable.');
        });
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
        }
    }

    hasRecording(stepKey) {
        return !!this.recordedClips[stepKey];
    }

    deleteRecording(stepKey) {
        delete this.recordedClips[stepKey];
        this.saveRecordingsToStorage();
    }

    saveRecordingsToStorage() {
        try {
            localStorage.setItem('abinabot_recorded_clips', JSON.stringify(this.recordedClips));
        } catch (e) {
            console.warn('Could not save recordings', e);
        }
    }

    loadRecordingsFromStorage() {
        try {
            const data = localStorage.getItem('abinabot_recorded_clips');
            if (data) {
                this.recordedClips = JSON.parse(data);
            }
        } catch (e) {
            console.warn('Could not load recordings', e);
        }
    }
}

window.soundFX = new SoundFX();
window.robotVoice = new RobotVoice();
