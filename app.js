// Main Application Orchestrator for Articulated Abinabot
class AbinabotApp {
    constructor() {
        this.scripts = [];
        this.currentScript = null;
        this.currentStepIndex = 0;
        this.rig = null;
        this.visualCards = null;
        this.voiceTriggerActive = false;
        this.voiceAudioActive = true;
        this.isDrawerOpen = false;
        this.autoAdvanceTimer = null;

        this.init();
    }

    init() {
        // Initialize Procedural Kinematic Skeletal Rig
        this.rig = new AbinabotRig('robot-container');
        // Initialize Illustrated Lyric Card Controller
        this.visualCards = new VisualCardController('visual-card-stage');

        // Load Scripts
        this.scripts = loadAllScripts();
        this.currentScript = this.scripts[0] || null;

        // Bind DOM Elements
        this.bindDOMElements();

        // Populate Settings Dropdowns
        this.populateScriptSelect();
        this.populateStepJumpSelect();
        this.populateVoiceDropdown();

        // Bind Events
        this.bindEvents();

        // Setup Hands-Free Voice Trigger
        this.setupVoiceTrigger();

        // Start at first step (without speaking before first user click/interaction)
        this.applyStep(0, false);
    }

    bindDOMElements() {
        this.elements = {
            viewport: document.getElementById('stage-viewport'),
            robotContainer: document.getElementById('robot-container'),
            visualCardStage: document.getElementById('visual-card-stage'),
            menuTriggerBtn: document.getElementById('menu-trigger-btn'),
            settingsDrawer: document.getElementById('settings-drawer'),
            drawerCloseBtn: document.getElementById('drawer-close-btn'),
            drawerBtnClose: document.getElementById('drawer-btn-close'),
            drawerScriptSelect: document.getElementById('drawer-script-select'),
            drawerStepJump: document.getElementById('drawer-step-jump'),
            drawerNaturalVoiceSelect: document.getElementById('drawer-natural-voice-select'),
            voicePitchSlider: document.getElementById('voice-pitch-slider'),
            pitchVal: document.getElementById('pitch-val'),
            voiceSpeedSlider: document.getElementById('voice-speed-slider'),
            speedVal: document.getElementById('speed-val'),
            btnTestVoice: document.getElementById('btn-test-voice'),
            btnRecordClip: document.getElementById('btn-record-clip'),
            fileUploadClip: document.getElementById('file-upload-clip'),
            btnPreviewClip: document.getElementById('btn-preview-clip'),
            recordingStatus: document.getElementById('recording-status'),
            btnDeleteClip: document.getElementById('btn-delete-clip'),
            btnToggleRobotize: document.getElementById('btn-toggle-robotize'),
            robotPresetSelect: document.getElementById('robot-preset-select'),
            drawerBtnVoice: document.getElementById('drawer-btn-voice'),
            drawerBtnTTS: document.getElementById('drawer-btn-tts'),
            drawerBtnPrev: document.getElementById('drawer-btn-prev'),
            drawerBtnNext: document.getElementById('drawer-btn-next'),
            drawerBtnRestart: document.getElementById('drawer-btn-restart'),
            drawerBtnFullscreen: document.getElementById('drawer-btn-fullscreen'),
            peekStepNum: document.getElementById('peek-step-num'),
            peekCurrentLine: document.getElementById('peek-current-line'),
            peekUpcomingLine: document.getElementById('peek-upcoming-line'),
            voiceLiveDot: document.getElementById('voice-live-dot'),
            voiceStatusText: document.getElementById('voice-status-text')
        };
    }

    populateScriptSelect() {
        if (!this.elements.drawerScriptSelect) return;
        this.elements.drawerScriptSelect.innerHTML = '';
        this.scripts.forEach((s) => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.title;
            this.elements.drawerScriptSelect.appendChild(opt);
        });
    }

    populateStepJumpSelect() {
        if (!this.elements.drawerStepJump || !this.currentScript) return;
        this.elements.drawerStepJump.innerHTML = '';
        this.currentScript.steps.forEach((step, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            const role = step.speaker === 'robot' ? '🤖' : '👤';
            const preview = step.text.length > 36 ? step.text.slice(0, 36) + '...' : step.text;
            opt.textContent = `${idx + 1}. ${role} ${preview}`;
            this.elements.drawerStepJump.appendChild(opt);
        });
        this.elements.drawerStepJump.value = this.currentStepIndex;
    }

    populateVoiceDropdown() {
        if (!this.elements.drawerNaturalVoiceSelect) return;
        const voices = window.robotVoice.getVoiceList();
        if (!voices || !voices.length) return;

        this.elements.drawerNaturalVoiceSelect.innerHTML = '';
        voices.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.voiceURI;
            opt.textContent = `${v.name} (${v.lang})`;
            if (v.voiceURI === window.robotVoice.selectedVoiceURI) {
                opt.selected = true;
            }
            this.elements.drawerNaturalVoiceSelect.appendChild(opt);
        });
    }

    bindEvents() {
        // Tap/Click anywhere on the stage viewport advances to next line
        this.elements.viewport.addEventListener('click', (e) => {
            if (e.target.closest('#menu-trigger-btn') || this.isDrawerOpen) return;
            this.nextStep();
        });

        // Settings Drawer open/close
        this.elements.menuTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDrawer();
        });

        this.elements.drawerCloseBtn.addEventListener('click', () => this.closeDrawer());
        this.elements.drawerBtnClose.addEventListener('click', () => this.closeDrawer());

        this.elements.settingsDrawer.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsDrawer) {
                this.closeDrawer();
            }
        });

        // Song switch
        this.elements.drawerScriptSelect.addEventListener('change', (e) => {
            const found = this.scripts.find(s => s.id === e.target.value);
            if (found) {
                this.currentScript = found;
                this.currentStepIndex = 0;
                this.populateStepJumpSelect();
                window.soundFX.playRobotGreeting();
                this.rig.setGesture('wave');
                this.applyStep(0);
            }
        });

        // Step jump dropdown
        if (this.elements.drawerStepJump) {
            this.elements.drawerStepJump.addEventListener('change', (e) => {
                const idx = parseInt(e.target.value, 10);
                if (!isNaN(idx)) {
                    this.applyStep(idx, true);
                }
            });
        }

        // Voice Selector change
        if (this.elements.drawerNaturalVoiceSelect) {
            this.elements.drawerNaturalVoiceSelect.addEventListener('change', (e) => {
                window.robotVoice.setVoiceByURI(e.target.value);
            });
        }

        // Pitch & Speed sliders
        if (this.elements.voicePitchSlider) {
            this.elements.voicePitchSlider.addEventListener('input', (e) => {
                window.robotVoice.setPitch(e.target.value);
                if (this.elements.pitchVal) this.elements.pitchVal.textContent = e.target.value;
            });
        }

        if (this.elements.voiceSpeedSlider) {
            this.elements.voiceSpeedSlider.addEventListener('input', (e) => {
                window.robotVoice.setRate(e.target.value);
                if (this.elements.speedVal) this.elements.speedVal.textContent = e.target.value;
            });
        }

        // Test Voice Button
        if (this.elements.btnTestVoice) {
            this.elements.btnTestVoice.addEventListener('click', () => {
                this.rig.setGesture('wave');
                window.robotVoice.speak(
                    "Hello Primary! I am Abinabot, and I am excited to sing with you today!",
                    () => this.rig.startTalking(),
                    () => this.rig.stopTalking()
                );
            });
        }

        // Robot-izer toggle switch
        if (this.elements.btnToggleRobotize) {
            this.elements.btnToggleRobotize.addEventListener('click', () => {
                const nextState = !window.robotVoice.robotizeRecordedVoice;
                window.robotVoice.setRobotize(nextState);
                this.elements.btnToggleRobotize.classList.toggle('active', nextState);
                this.elements.btnToggleRobotize.textContent = nextState ? 'ON' : 'OFF';
            });
        }

        // Robot-izer Preset selector
        if (this.elements.robotPresetSelect) {
            this.elements.robotPresetSelect.addEventListener('change', (e) => {
                window.robotVoice.setRobotPreset(e.target.value);
            });
        }

        // Custom Voice Recording for the current line
        if (this.elements.btnRecordClip) {
            this.elements.btnRecordClip.addEventListener('click', () => {
                const stepKey = this.getCurrentStepKey();
                if (window.robotVoice.isRecording) {
                    window.robotVoice.stopRecording();
                    this.elements.btnRecordClip.classList.remove('recording');
                    this.elements.btnRecordClip.textContent = '🎙️ Record Line';
                } else {
                    this.elements.btnRecordClip.classList.add('recording');
                    this.elements.btnRecordClip.textContent = '⏹️ Stop Recording';
                    this.elements.recordingStatus.textContent = 'Recording now... Speak into microphone!';
                    window.robotVoice.startRecording(stepKey, () => {
                        this.elements.btnRecordClip.classList.remove('recording');
                        this.elements.btnRecordClip.textContent = '🎙️ Re-Record';
                        this.updateDrawerPrompterPeek();
                    });
                }
            });
        }

        // File upload for recorded audio
        if (this.elements.fileUploadClip) {
            this.elements.fileUploadClip.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                    const stepKey = this.getCurrentStepKey();
                    window.robotVoice.recordedClips[stepKey] = reader.result;
                    window.robotVoice.saveRecordingsToStorage();
                    this.updateDrawerPrompterPeek();
                };
                reader.readAsDataURL(file);
            });
        }

        // Preview recorded clip button
        if (this.elements.btnPreviewClip) {
            this.elements.btnPreviewClip.addEventListener('click', () => {
                const stepKey = this.getCurrentStepKey();
                const step = this.currentScript.steps[this.currentStepIndex];
                if (window.robotVoice.hasRecording(stepKey)) {
                    window.robotVoice.playCustomRecording(
                        window.robotVoice.recordedClips[stepKey],
                        () => this.rig.startTalking(),
                        () => this.rig.stopTalking()
                    );
                } else if (step && step.audioFile) {
                    window.robotVoice.playCustomRecording(
                        step.audioFile,
                        () => this.rig.startTalking(),
                        () => this.rig.stopTalking()
                    );
                }
            });
        }

        if (this.elements.btnDeleteClip) {
            this.elements.btnDeleteClip.addEventListener('click', () => {
                const stepKey = this.getCurrentStepKey();
                window.robotVoice.deleteRecording(stepKey);
                this.updateDrawerPrompterPeek();
            });
        }

        // Navigation inside drawer
        this.elements.drawerBtnNext.addEventListener('click', () => this.nextStep());
        this.elements.drawerBtnPrev.addEventListener('click', () => this.prevStep());
        this.elements.drawerBtnRestart.addEventListener('click', () => this.restartScript());

        // Voice Ear toggle
        this.elements.drawerBtnVoice.addEventListener('click', () => {
            this.toggleVoiceRecognition();
        });

        // TTS voice toggle
        this.elements.drawerBtnTTS.addEventListener('click', () => {
            this.toggleTTS();
        });

        // Fullscreen toggle
        this.elements.drawerBtnFullscreen.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Test Articulated Gesture buttons in drawer
        const gestureBtns = document.querySelectorAll('.btn-gesture');
        gestureBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const gesture = btn.getAttribute('data-gesture');
                if (gesture && this.rig) {
                    this.rig.setGesture(gesture);
                    window.soundFX.playAdvance();
                }
            });
        });

        // Global Keyboard Controls (Space, Arrows, Clicker!)
        window.addEventListener('keydown', (e) => {
            if (e.key === 's' || e.key === 'S' || e.key === 'Escape') {
                if (e.key === 'Escape' && this.isDrawerOpen) {
                    this.closeDrawer();
                    return;
                }
                if (e.key === 's' || e.key === 'S') {
                    this.toggleDrawer();
                    return;
                }
            }

            switch (e.code) {
                case 'Space':
                case 'ArrowRight':
                case 'PageDown':
                    e.preventDefault();
                    this.nextStep();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                case 'Backspace':
                    e.preventDefault();
                    this.prevStep();
                    break;
                case 'KeyR':
                    this.restartScript();
                    break;
                case 'KeyV':
                    this.toggleVoiceRecognition();
                    break;
                case 'KeyM':
                    this.toggleTTS();
                    break;
                case 'KeyF':
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    getCurrentStepKey() {
        if (!this.currentScript) return 'clip-0';
        return `${this.currentScript.id}-step-${this.currentStepIndex}`;
    }

    toggleDrawer() {
        if (this.isDrawerOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    openDrawer() {
        this.isDrawerOpen = true;
        this.elements.settingsDrawer.classList.add('open');
        this.populateVoiceDropdown();
        this.updateDrawerPrompterPeek();
    }

    closeDrawer() {
        this.isDrawerOpen = false;
        this.elements.settingsDrawer.classList.remove('open');
    }

    setupVoiceTrigger() {
        if (!window.voiceTrigger.supported) {
            this.elements.drawerBtnVoice.title = 'Speech Recognition not supported in this browser.';
            return;
        }

        window.voiceTrigger.onKeywordMatch = (keyword, heardText) => {
            console.log(`Matched voice cue "${keyword}" in "${heardText}"`);
            window.soundFX.playVoiceDetected();
            this.nextStep();
        };

        window.voiceTrigger.onSpeechDetected = (heardText) => {
            if (this.elements.voiceStatusText) {
                this.elements.voiceStatusText.textContent = `"${heardText.slice(-18)}"`;
            }
        };

        window.voiceTrigger.onStatusChange = (status) => {
            if (status === 'listening') {
                this.elements.drawerBtnVoice.classList.add('active');
                this.elements.drawerBtnVoice.textContent = 'ON';
                this.elements.voiceLiveDot.style.display = 'inline-flex';
                this.elements.voiceStatusText.textContent = 'Listening...';
            } else {
                this.elements.drawerBtnVoice.classList.remove('active');
                this.elements.drawerBtnVoice.textContent = 'OFF';
                this.elements.voiceLiveDot.style.display = 'none';
            }
        };
    }

    toggleVoiceRecognition() {
        if (!window.voiceTrigger.supported) {
            alert("Speech recognition isn't supported in this browser. Please use Chrome, Edge, or Safari!");
            return;
        }

        const active = window.voiceTrigger.toggle();
        this.voiceTriggerActive = active;
        if (active) {
            window.soundFX.playAdvance();
            this.updateCurrentKeywordTrigger();
        } else {
            window.soundFX.playBack();
        }
    }

    toggleTTS() {
        this.voiceAudioActive = !this.voiceAudioActive;
        window.robotVoice.enabled = this.voiceAudioActive;
        if (this.voiceAudioActive) {
            this.elements.drawerBtnTTS.classList.add('active');
            this.elements.drawerBtnTTS.textContent = 'ON';
            window.soundFX.playBoop(580, 'sine', 0.1);
        } else {
            this.elements.drawerBtnTTS.classList.remove('active');
            this.elements.drawerBtnTTS.textContent = 'OFF (Muted)';
            window.robotVoice.stop();
            this.rig.stopTalking();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
            this.elements.drawerBtnFullscreen.textContent = 'Exit Fullscreen';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            this.elements.drawerBtnFullscreen.textContent = '⛶ Fullscreen';
        }
    }

    applyStep(index, playAudio = true) {
        if (!this.currentScript || !this.currentScript.steps.length) return;

        // Cancel any pending auto-advance from a previous step
        clearTimeout(this.autoAdvanceTimer);

        if (index < 0) index = 0;
        if (index >= this.currentScript.steps.length) {
            index = this.currentScript.steps.length - 1;
        }
        this.currentStepIndex = index;

        const step = this.currentScript.steps[this.currentStepIndex];
        const isRobot = step.speaker === 'robot';

        window.robotVoice.stop();
        this.rig.stopTalking();

        // Update Visual Lyric Cards (Shown ONLY when step.visualCard is defined!)
        if (step.visualCard) {
            if (step.visualCard.type === 'single') {
                this.visualCards.showSingle(step.visualCard.id, step.visualCard.badge);
            } else if (step.visualCard.type === 'grid') {
                this.visualCards.showVerseGrid(step.visualCard.ids, step.visualCard.title);
            }
        } else {
            this.visualCards.hide();
        }

        // Apply Robot Gesture
        if (step.gesture) {
            this.rig.setGesture(step.gesture);
        } else {
            this.rig.setGesture(isRobot ? 'idle' : 'listen');
        }

        // Robot Speaks Line
        if (isRobot && playAudio) {
            const stepKey = this.getCurrentStepKey();
            const expectedStepIndex = this.currentStepIndex;

            window.robotVoice.speak(
                step.text,
                () => this.rig.startTalking(),
                () => {
                    this.rig.stopTalking();
                    if (step.gesture !== 'singing' && step.gesture !== 'conduct' && step.gesture !== 'point' && step.gesture !== 'facepalm') {
                        setTimeout(() => {
                            if (this.currentStepIndex === expectedStepIndex) {
                                this.rig.setGesture('idle');
                            }
                        }, 600);
                    }

                    // Auto-advance if configured for this step (e.g. Christmas Bells 4-line pass)
                    if (step.autoAdvanceOnAudioEnd && this.currentStepIndex === expectedStepIndex) {
                        this.autoAdvanceTimer = setTimeout(() => {
                            if (this.currentStepIndex === expectedStepIndex) {
                                this.nextStep();
                            }
                        }, 650);
                    }
                },
                stepKey,
                step.audioFile || null
            );
        }

        if (this.elements.drawerStepJump) {
            this.elements.drawerStepJump.value = this.currentStepIndex;
        }

        this.updateCurrentKeywordTrigger();
        this.updateDrawerPrompterPeek();
    }

    updateCurrentKeywordTrigger() {
        const step = this.currentScript.steps[this.currentStepIndex];
        let targetKw = '';

        if (step.speaker === 'teacher' && step.keyword) {
            targetKw = step.keyword;
        } else {
            targetKw = 'next, continue, sing, ready, go';
        }

        window.voiceTrigger.setTargetKeyword(targetKw);
    }

    updateDrawerPrompterPeek() {
        if (!this.currentScript) return;
        const total = this.currentScript.steps.length;
        const step = this.currentScript.steps[this.currentStepIndex];
        const nextStep = this.currentScript.steps[this.currentStepIndex + 1];

        if (this.elements.peekStepNum) {
            this.elements.peekStepNum.textContent = `Step ${this.currentStepIndex + 1} of ${total} (${step.speaker.toUpperCase()})`;
        }

        if (this.elements.peekCurrentLine) {
            const prefix = step.speaker === 'robot' ? '🤖 Abinabot: ' : '👤 You: ';
            this.elements.peekCurrentLine.textContent = prefix + `"${step.text}"`;
        }

        if (this.elements.peekUpcomingLine) {
            if (nextStep) {
                const prefix = nextStep.speaker === 'robot' ? '🤖 Next: ' : '👤 Next: ';
                const kwHint = nextStep.keyword ? ` [Voice: ${nextStep.keyword}]` : '';
                this.elements.peekUpcomingLine.textContent = prefix + `"${nextStep.text}"${kwHint}`;
            } else {
                this.elements.peekUpcomingLine.textContent = '🎉 End of script!';
            }
        }

        const stepKey = this.getCurrentStepKey();
        const hasRecorded = window.robotVoice.hasRecording(stepKey);
        const hasAudioFile = !!(step && step.audioFile);

        if (this.elements.recordingStatus) {
            if (hasRecorded) {
                this.elements.recordingStatus.textContent = '✅ Custom Recorded/Uploaded Audio';
            } else if (hasAudioFile) {
                this.elements.recordingStatus.textContent = `🎵 File: ${step.audioFile} (falls back to TTS if missing)`;
            } else {
                this.elements.recordingStatus.textContent = 'Using System Voice';
            }
        }
        if (this.elements.btnPreviewClip) {
            this.elements.btnPreviewClip.style.display = hasRecorded ? 'inline-flex' : 'none';
        }
        if (this.elements.btnDeleteClip) {
            this.elements.btnDeleteClip.style.display = hasRecorded ? 'inline-flex' : 'none';
        }
    }

    nextStep() {
        if (!this.currentScript) return;
        clearTimeout(this.autoAdvanceTimer);
        if (this.currentStepIndex < this.currentScript.steps.length - 1) {
            window.soundFX.playAdvance();
            this.applyStep(this.currentStepIndex + 1);
        } else {
            window.soundFX.playCheer();
            this.rig.setGesture('both-arms-up');
        }
    }

    prevStep() {
        if (!this.currentScript) return;
        clearTimeout(this.autoAdvanceTimer);
        if (this.currentStepIndex > 0) {
            window.soundFX.playBack();
            this.applyStep(this.currentStepIndex - 1);
        }
    }

    restartScript() {
        clearTimeout(this.autoAdvanceTimer);
        window.soundFX.playRobotGreeting();
        this.rig.setGesture('wave');
        this.applyStep(0);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new AbinabotApp();
});
