// Abinabot SVG Character & Animation Controller
class AbinabotRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.emotion = 'happy'; // 'happy', 'excited', 'singing', 'thinking', 'listening', 'cheer'
        this.isTalking = false;
        this.isListening = false;
        this.mouthInterval = null;
        this.blinkTimeout = null;
        this.chestScreenMode = 'music'; // 'music', 'heart', 'star', 'scripture'
        this.render();
        this.startBlinking();
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
        <div class="robot-stage">
            <!-- Floating musical notes or sparkles -->
            <div id="robot-sparkles" class="robot-sparkles"></div>

            <svg id="abinabot-svg" class="abinabot-svg emotion-${this.emotion}" viewBox="0 0 320 380" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#4fd1c5" />
                        <stop offset="50%" stop-color="#319795" />
                        <stop offset="100%" stop-color="#234e52" />
                    </linearGradient>
                    <linearGradient id="robotAccentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#fed7d7" />
                        <stop offset="100%" stop-color="#feb2b2" />
                    </linearGradient>
                    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#0f172a" />
                        <stop offset="100%" stop-color="#1e293b" />
                    </linearGradient>
                    <linearGradient id="bellyScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#090d16" />
                        <stop offset="100%" stop-color="#1e1b4b" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="bigGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <!-- Shadow under robot -->
                <ellipse class="robot-shadow" cx="160" cy="365" rx="70" ry="12" fill="rgba(0,0,0,0.22)" />

                <!-- Left Arm -->
                <g id="arm-left" class="robot-arm arm-left">
                    <rect x="52" y="195" width="22" height="70" rx="11" fill="#285e61" />
                    <circle cx="63" cy="272" r="14" fill="#38b2ac" />
                    <circle cx="63" cy="272" r="8" fill="#e6fffa" opacity="0.6" />
                </g>

                <!-- Right Arm -->
                <g id="arm-right" class="robot-arm arm-right">
                    <rect x="246" y="195" width="22" height="70" rx="11" fill="#285e61" />
                    <circle cx="257" cy="272" r="14" fill="#38b2ac" />
                    <circle cx="257" cy="272" r="8" fill="#e6fffa" opacity="0.6" />
                </g>

                <!-- Torso / Body -->
                <g class="robot-body-group">
                    <!-- Main Body Chassis -->
                    <rect x="75" y="180" width="170" height="150" rx="42" fill="url(#robotBodyGrad)" stroke="#234e52" stroke-width="4" />
                    
                    <!-- Neck Joint -->
                    <rect x="142" y="165" width="36" height="20" rx="5" fill="#1d4044" />
                    <line x1="145" y1="172" x2="175" y2="172" stroke="#4fd1c5" stroke-width="2" />
                    <line x1="145" y1="178" x2="175" y2="178" stroke="#4fd1c5" stroke-width="2" />

                    <!-- Chest Screen / Monitor -->
                    <rect x="105" y="205" width="110" height="85" rx="18" fill="url(#bellyScreenGrad)" stroke="#38b2ac" stroke-width="3" />
                    
                    <!-- Chest Visualizer / Music Note / Heart -->
                    <g id="chest-display" class="chest-content">
                        <!-- Default: Musical notes pulsating -->
                        <path id="chest-icon" d="M 145 260 L 145 228 C 145 228 160 220 178 226 L 178 255" fill="none" stroke="#38ef7d" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>
                        <circle cx="140" cy="260" r="8" fill="#38ef7d" filter="url(#glow)"/>
                        <circle cx="173" cy="255" r="8" fill="#38ef7d" filter="url(#glow)"/>
                        <!-- Audio Equalizer Bars on Chest Screen -->
                        <rect class="eq-bar bar-1" x="115" y="265" width="4" height="12" rx="2" fill="#38b2ac" />
                        <rect class="eq-bar bar-2" x="123" y="258" width="4" height="19" rx="2" fill="#4fd1c5" />
                        <rect class="eq-bar bar-3" x="193" y="258" width="4" height="19" rx="2" fill="#4fd1c5" />
                        <rect class="eq-bar bar-4" x="201" y="265" width="4" height="12" rx="2" fill="#38b2ac" />
                    </g>

                    <!-- Cute Buttons / Badges below chest screen -->
                    <circle cx="135" cy="307" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
                    <circle cx="160" cy="307" r="7" fill="#f43f5e" stroke="#be123c" stroke-width="2" />
                    <circle cx="185" cy="307" r="7" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
                </g>

                <!-- Head Group (can bob/tilt) -->
                <g id="robot-head" class="robot-head-group">
                    <!-- Antenna Stem -->
                    <line x1="160" y1="45" x2="160" y2="70" stroke="#285e61" stroke-width="6" stroke-linecap="round" />
                    <!-- Antenna Bulb (Glows!) -->
                    <circle id="antenna-bulb" class="antenna-bulb" cx="160" cy="40" r="14" fill="#fbbf24" filter="url(#bigGlow)" />
                    <!-- Antenna Core -->
                    <circle cx="160" cy="40" r="7" fill="#fffbeb" />

                    <!-- Ears / Audio Sensors -->
                    <rect x="52" y="98" width="14" height="34" rx="7" fill="#285e61" />
                    <circle id="ear-left" class="ear-ring" cx="59" cy="115" r="10" fill="#38b2ac" filter="url(#glow)" />
                    
                    <rect x="254" y="98" width="14" height="34" rx="7" fill="#285e61" />
                    <circle id="ear-right" class="ear-ring" cx="261" cy="115" r="10" fill="#38b2ac" filter="url(#glow)" />

                    <!-- Head Shape -->
                    <rect x="62" y="65" width="196" height="110" rx="36" fill="url(#robotBodyGrad)" stroke="#234e52" stroke-width="4" />
                    
                    <!-- Head Visor Screen -->
                    <rect x="80" y="80" width="160" height="82" rx="24" fill="url(#screenGrad)" stroke="#1e293b" stroke-width="2" />

                    <!-- Cheek Blushes (Cute kid-friendly touch!) -->
                    <ellipse cx="98" cy="142" rx="9" ry="5" fill="#f472b6" opacity="0.65" filter="url(#glow)" />
                    <ellipse cx="222" cy="142" rx="9" ry="5" fill="#f472b6" opacity="0.65" filter="url(#glow)" />

                    <!-- Eyes Container -->
                    <g id="robot-eyes" class="robot-eyes">
                        <!-- Left Eye Normal -->
                        <g id="eye-left-group" transform="translate(118, 112)">
                            <ellipse id="eye-left" class="eye-pupil" cx="0" cy="0" rx="14" ry="17" fill="#38ef7d" filter="url(#glow)" />
                            <circle class="eye-shine" cx="-4" cy="-5" r="4.5" fill="#ffffff" />
                        </g>

                        <!-- Right Eye Normal -->
                        <g id="eye-right-group" transform="translate(202, 112)">
                            <ellipse id="eye-right" class="eye-pupil" cx="0" cy="0" rx="14" ry="17" fill="#38ef7d" filter="url(#glow)" />
                            <circle class="eye-shine" cx="-4" cy="-5" r="4.5" fill="#ffffff" />
                        </g>
                    </g>

                    <!-- Mouth Container (Dynamically swapped for talking/emotions) -->
                    <g id="robot-mouth" class="robot-mouth" transform="translate(160, 142)">
                        <!-- Default smile curve -->
                        <path id="mouth-path" d="M -20 -3 Q 0 12 20 -3" fill="none" stroke="#38ef7d" stroke-width="4.5" stroke-linecap="round" filter="url(#glow)" />
                    </g>
                </g>
            </svg>
        </div>
        `;
    }

    startBlinking() {
        const scheduleNextBlink = () => {
            const delay = Math.random() * 3500 + 2500;
            this.blinkTimeout = setTimeout(() => {
                if (this.emotion !== 'thinking' && !this.isTalking) {
                    this.blink();
                }
                scheduleNextBlink();
            }, delay);
        };
        scheduleNextBlink();
    }

    blink() {
        const eyeL = document.getElementById('eye-left');
        const eyeR = document.getElementById('eye-right');
        if (!eyeL || !eyeR) return;

        eyeL.setAttribute('ry', '1.5');
        eyeR.setAttribute('ry', '1.5');

        setTimeout(() => {
            if (this.emotion === 'excited') {
                eyeL.setAttribute('ry', '19');
                eyeR.setAttribute('ry', '19');
            } else {
                eyeL.setAttribute('ry', '17');
                eyeR.setAttribute('ry', '17');
            }
        }, 160);
    }

    setEmotion(emotion) {
        this.emotion = emotion || 'happy';
        const svg = document.getElementById('abinabot-svg');
        if (svg) {
            svg.className.baseVal = `abinabot-svg emotion-${this.emotion} ${this.isTalking ? 'is-talking' : ''} ${this.isListening ? 'is-listening' : ''}`;
        }
        this.updateFace();
        this.updateChest();

        if (this.emotion === 'cheer' || this.emotion === 'singing') {
            this.spawnNotes();
        }
    }

    updateFace() {
        const eyeL = document.getElementById('eye-left');
        const eyeR = document.getElementById('eye-right');
        const mouthPath = document.getElementById('mouth-path');
        const bulb = document.getElementById('antenna-bulb');
        if (!eyeL || !eyeR || !mouthPath || !bulb) return;

        // Reset default glow & colors
        let eyeColor = '#38ef7d'; // Bright teal/green
        let bulbColor = '#fbbf24'; // Warm amber

        switch (this.emotion) {
            case 'excited':
                eyeL.setAttribute('rx', '16');
                eyeL.setAttribute('ry', '19');
                eyeR.setAttribute('rx', '16');
                eyeR.setAttribute('ry', '19');
                mouthPath.setAttribute('d', 'M -22 -6 Q 0 18 22 -6 Z');
                mouthPath.setAttribute('fill', '#38ef7d');
                eyeColor = '#00f2fe';
                bulbColor = '#f43f5e';
                break;

            case 'singing':
                // Happy arc eyes ^ ^
                eyeL.setAttribute('rx', '15');
                eyeL.setAttribute('ry', '8');
                eyeR.setAttribute('rx', '15');
                eyeR.setAttribute('ry', '8');
                // Singing O-mouth
                mouthPath.setAttribute('d', 'M -15 -2 C -15 15, 15 15, 15 -2 C 15 -12, -15 -12, -15 -2 Z');
                mouthPath.setAttribute('fill', '#38ef7d');
                eyeColor = '#38ef7d';
                bulbColor = '#8b5cf6';
                break;

            case 'thinking':
                // Curious glance
                eyeL.setAttribute('rx', '12');
                eyeL.setAttribute('ry', '14');
                eyeR.setAttribute('rx', '16');
                eyeR.setAttribute('ry', '16');
                mouthPath.setAttribute('d', 'M -14 4 Q 0 -4 14 2');
                mouthPath.setAttribute('fill', 'none');
                bulbColor = '#3b82f6';
                break;

            case 'listening':
                // Big attentive wide eyes
                eyeL.setAttribute('rx', '15');
                eyeL.setAttribute('ry', '18');
                eyeR.setAttribute('rx', '15');
                eyeR.setAttribute('ry', '18');
                mouthPath.setAttribute('d', 'M -18 0 Q 0 8 18 0');
                mouthPath.setAttribute('fill', 'none');
                eyeColor = '#22c55e';
                bulbColor = '#22c55e';
                break;

            case 'cheer':
                // Excited squint eyes
                eyeL.setAttribute('rx', '16');
                eyeL.setAttribute('ry', '10');
                eyeR.setAttribute('rx', '16');
                eyeR.setAttribute('ry', '10');
                mouthPath.setAttribute('d', 'M -24 -8 Q 0 20 24 -8 Z');
                mouthPath.setAttribute('fill', '#38ef7d');
                eyeColor = '#ec4899';
                bulbColor = '#ec4899';
                break;

            case 'happy':
            default:
                eyeL.setAttribute('rx', '14');
                eyeL.setAttribute('ry', '17');
                eyeR.setAttribute('rx', '14');
                eyeR.setAttribute('ry', '17');
                mouthPath.setAttribute('d', 'M -20 -3 Q 0 12 20 -3');
                mouthPath.setAttribute('fill', 'none');
                break;
        }

        eyeL.setAttribute('fill', eyeColor);
        eyeR.setAttribute('fill', eyeColor);
        bulb.setAttribute('fill', bulbColor);
    }

    updateChest() {
        const chestDisplay = document.getElementById('chest-display');
        if (!chestDisplay) return;

        if (this.emotion === 'singing') {
            chestDisplay.innerHTML = `
                <path d="M 140 258 L 140 225 C 140 225 158 218 178 224 L 178 253" fill="none" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>
                <circle cx="135" cy="258" r="8" fill="#f43f5e" filter="url(#glow)"/>
                <circle cx="173" cy="253" r="8" fill="#f43f5e" filter="url(#glow)"/>
                <line x1="140" y1="235" x2="178" y2="235" stroke="#f43f5e" stroke-width="3" />
            `;
        } else if (this.emotion === 'cheer') {
            // Golden Star
            chestDisplay.innerHTML = `
                <polygon points="160,222 166,238 183,238 169,249 174,265 160,254 146,265 151,249 137,238 154,238" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" filter="url(#glow)" />
            `;
        } else {
            // Heart or Music note
            chestDisplay.innerHTML = `
                <path d="M 160 262 C 160 262 135 242 135 230 C 135 220 144 216 152 221 C 157 225 160 230 160 230 C 160 230 163 225 168 221 C 176 216 185 220 185 230 C 185 242 160 262 160 262 Z" fill="#38ef7d" filter="url(#glow)"/>
                <rect class="eq-bar bar-1" x="115" y="265" width="4" height="12" rx="2" fill="#38b2ac" />
                <rect class="eq-bar bar-2" x="123" y="258" width="4" height="19" rx="2" fill="#4fd1c5" />
                <rect class="eq-bar bar-3" x="193" y="258" width="4" height="19" rx="2" fill="#4fd1c5" />
                <rect class="eq-bar bar-4" x="201" y="265" width="4" height="12" rx="2" fill="#38b2ac" />
            `;
        }
    }

    startTalking() {
        this.isTalking = true;
        const svg = document.getElementById('abinabot-svg');
        if (svg) svg.classList.add('is-talking');

        const mouthPath = document.getElementById('mouth-path');
        if (!mouthPath) return;

        // Animate digital mouth while speaking
        const mouthShapes = [
            'M -20 -3 Q 0 14 20 -3', // open smile
            'M -18 2 Q 0 -6 18 2',   // tight smile
            'M -14 -6 C -14 10, 14 10, 14 -6 Z', // round talk
            'M -22 -2 Q 0 16 22 -2 Z', // wide talk
            'M -16 0 Q 0 8 16 0'     // small talk
        ];

        let index = 0;
        clearInterval(this.mouthInterval);
        this.mouthInterval = setInterval(() => {
            if (!this.isTalking) return;
            index = (index + 1) % mouthShapes.length;
            mouthPath.setAttribute('d', mouthShapes[index]);
            mouthPath.setAttribute('fill', index % 2 === 0 ? '#38ef7d' : 'none');
        }, 120);
    }

    stopTalking() {
        this.isTalking = false;
        clearInterval(this.mouthInterval);
        const svg = document.getElementById('abinabot-svg');
        if (svg) svg.classList.remove('is-talking');
        this.updateFace();
    }

    setListening(listening) {
        this.isListening = listening;
        const svg = document.getElementById('abinabot-svg');
        if (svg) {
            if (listening) {
                svg.classList.add('is-listening');
            } else {
                svg.classList.remove('is-listening');
            }
        }
    }

    wave() {
        const armR = document.getElementById('arm-right');
        if (!armR) return;
        armR.classList.add('waving');
        setTimeout(() => {
            armR.classList.remove('waving');
        }, 1600);
    }

    spawnNotes() {
        const container = document.getElementById('robot-sparkles');
        if (!container) return;
        const symbols = ['🎵', '🎶', '⭐', '✨', '💛'];

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const note = document.createElement('div');
                note.className = 'floating-note';
                note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                note.style.left = `${120 + Math.random() * 80}px`;
                note.style.top = `${180 + Math.random() * 40}px`;
                note.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;
                container.appendChild(note);

                setTimeout(() => {
                    note.remove();
                }, 1800);
            }, i * 150);
        }
    }
}
