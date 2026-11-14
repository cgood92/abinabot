// Speech Recognition for Hands-Free Progression
// Primary music leaders often have their hands full conducting or holding props!
class VoiceTriggerSystem {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.enabled = false;
        this.targetKeyword = '';
        this.onKeywordMatch = null;
        this.onSpeechDetected = null;
        this.onStatusChange = null;
        this.lastTranscript = '';
        this.lastMatchTime = 0;
        this.supported = false;

        this.initRecognition();
    }

    initRecognition() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            console.log('Web Speech Recognition API not supported in this browser.');
            this.supported = false;
            return;
        }

        this.supported = true;
        try {
            this.recognition = new SpeechRec();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                if (this.onStatusChange) this.onStatusChange('listening');
            };

            this.recognition.onresult = (event) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript;
                    } else {
                        interim += transcript;
                    }
                }

                const currentText = (final || interim).trim().toLowerCase();
                this.lastTranscript = currentText;

                if (this.onSpeechDetected) {
                    this.onSpeechDetected(currentText);
                }

                this.checkKeyword(currentText);
            };

            this.recognition.onerror = (event) => {
                console.warn('Speech recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    this.enabled = false;
                    this.isListening = false;
                    if (this.onStatusChange) this.onStatusChange('denied');
                }
            };

            this.recognition.onend = () => {
                // If enabled, automatically restart recognition so it remains active during the session
                if (this.enabled) {
                    try {
                        this.recognition.start();
                    } catch (e) {
                        // ignore if already started
                    }
                } else {
                    this.isListening = false;
                    if (this.onStatusChange) this.onStatusChange('stopped');
                }
            };
        } catch (e) {
            console.warn('Failed to initialize speech recognition', e);
            this.supported = false;
        }
    }

    setTargetKeyword(keyword) {
        this.targetKeyword = (keyword || '').trim().toLowerCase();
    }

    checkKeyword(heardText) {
        if (!this.enabled || !heardText) return;

        const now = Date.now();
        if (now - this.lastMatchTime < 1600) return; // Prevent double trigger

        // If targetKeyword is set, check if heardText contains it
        if (this.targetKeyword) {
            const keywords = this.targetKeyword.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
            const matched = keywords.some(kw => heardText.includes(kw));

            if (matched) {
                this.lastMatchTime = now;
                if (this.onKeywordMatch) {
                    this.onKeywordMatch(this.targetKeyword, heardText);
                }
            }
        }
    }

    start() {
        if (!this.supported || !this.recognition) return false;
        this.enabled = true;
        try {
            this.recognition.start();
            return true;
        } catch (e) {
            console.warn('Recognition already started or error', e);
            return true;
        }
    }

    stop() {
        this.enabled = false;
        this.isListening = false;
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (e) {
                // ignore
            }
        }
        if (this.onStatusChange) this.onStatusChange('stopped');
    }

    toggle() {
        if (this.enabled) {
            this.stop();
            return false;
        } else {
            return this.start();
        }
    }
}

window.voiceTrigger = new VoiceTriggerSystem();
