// Abinabot Procedural 2D Skeletal Rig
// Features dynamic knee bending, lengthening, squatting, and side-to-side weight transfer kinematics.
// Boots remain firmly planted on the ground while knees physically flex and lengthen!

class AbinabotRig {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentGesture = 'idle';
        this.isTalking = false;
        this.talkingTimer = null;
        this.blinkTimer = null;
        this.glanceTimer = null;

        // Kinematic State
        this.squatY = 0;       // 0 (tall) to 35 (deep squat)
        this.swayX = 0;        // -30 (sway left) to +30 (sway right)
        this.targetSquat = 0;
        this.targetSway = 0;
        this.animTime = 0;
        this.lastFrameTime = null;
        this.idlePoseTimer = null;
        this.idlePoseIndex = 0;
        this.jumpY = 0;
        this.flipDeg = 0;
        this.jumpTimer = 0;

        this.render();
        this.initJoints();
        this.startLoops();
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
        <svg id="abinabot-rig-svg" class="abinabot-rig-svg" viewBox="0 0 600 860" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="robotTexture" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.12 0" />
                    <feComposite in="SourceGraphic" operator="over" />
                </filter>

                <radialGradient id="sphereGrad" cx="38%" cy="32%" r="68%">
                    <stop offset="0%" stop-color="#e0f4fc" />
                    <stop offset="50%" stop-color="#b6e0f3" />
                    <stop offset="90%" stop-color="#8bc7e3" />
                    <stop offset="100%" stop-color="#6eaecb" />
                </radialGradient>

                <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#d8effa" />
                    <stop offset="15%" stop-color="#bce3f5" />
                    <stop offset="85%" stop-color="#9acfe5" />
                    <stop offset="100%" stop-color="#7fb5cc" />
                </linearGradient>

                <linearGradient id="footGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#cdecf7" />
                    <stop offset="100%" stop-color="#91c8df" />
                </linearGradient>

                <radialGradient id="jointGrad" cx="35%" cy="35%" r="70%">
                    <stop offset="0%" stop-color="#3b5768" />
                    <stop offset="60%" stop-color="#1d3443" />
                    <stop offset="100%" stop-color="#0f202c" />
                </radialGradient>

                <!-- Ribbed Hose Pattern -->
                <pattern id="hoseRibs" width="20" height="9" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="20" height="4.5" fill="#cfdce4" />
                    <rect x="0" y="4.5" width="20" height="4.5" fill="#8498a4" />
                    <line x1="0" y1="0" x2="20" y2="0" stroke="#455560" stroke-width="0.8" />
                </pattern>

                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            <!-- Shadow underneath feet -->
            <ellipse id="ground-shadow" cx="300" cy="815" rx="140" ry="18" fill="rgba(15, 35, 20, 0.38)" />

            <!-- Master Root -->
            <g id="robot-master-root">

                <!-- FIXED FEET / BOOTS (Plant firmly on the ground) -->
                <g id="planted-feet-group">
                    <!-- Left Boot -->
                    <g id="left-foot" class="boot-group">
                        <path d="M 215 780 C 215 695, 230 682, 246 682 C 262 682, 277 695, 277 780 Z" fill="url(#footGrad)" stroke="#1a3344" stroke-width="3.5" />
                        <ellipse cx="230" cy="735" rx="6" ry="17" fill="#183244" opacity="0.85" />
                        <rect x="208" y="780" width="76" height="15" rx="5" fill="#183244" stroke="#0e202b" stroke-width="1.5" />
                    </g>

                    <!-- Right Boot -->
                    <g id="right-foot" class="boot-group">
                        <path d="M 323 780 C 323 695, 338 682, 354 682 C 370 682, 385 695, 385 780 Z" fill="url(#footGrad)" stroke="#1a3344" stroke-width="3.5" />
                        <ellipse cx="360" cy="735" rx="14" ry="16" fill="#183244" opacity="0.85" />
                        <rect x="315" y="780" width="86" height="15" rx="5" fill="#183244" stroke="#0e202b" stroke-width="1.5" />
                    </g>
                </g>

                <!-- DYNAMIC ARTICULATED LEGS (Lines stretch and bend with knees) -->
                <g id="dynamic-legs-group">
                    <!-- Left Shin (Knee -> Foot) -->
                    <line id="left-shin-bg" x1="246" y1="610" x2="246" y2="700" stroke="#183244" stroke-width="22" stroke-linecap="round" />
                    <line id="left-shin-hose" x1="246" y1="610" x2="246" y2="700" stroke="url(#hoseRibs)" stroke-width="18" stroke-linecap="round" />

                    <!-- Left Thigh (Hip -> Knee) -->
                    <line id="left-thigh-bg" x1="246" y1="515" x2="246" y2="610" stroke="#183244" stroke-width="22" stroke-linecap="round" />
                    <line id="left-thigh-hose" x1="246" y1="515" x2="246" y2="610" stroke="url(#hoseRibs)" stroke-width="18" stroke-linecap="round" />

                    <!-- Left Knee Joint Ball -->
                    <circle id="left-knee-ball" cx="246" cy="610" r="18" fill="url(#jointGrad)" stroke="#13242f" stroke-width="2.5" />

                    <!-- Right Shin (Knee -> Foot) -->
                    <line id="right-shin-bg" x1="354" y1="610" x2="354" y2="700" stroke="#183244" stroke-width="22" stroke-linecap="round" />
                    <line id="right-shin-hose" x1="354" y1="610" x2="354" y2="700" stroke="url(#hoseRibs)" stroke-width="18" stroke-linecap="round" />

                    <!-- Right Thigh (Hip -> Knee) -->
                    <line id="right-thigh-bg" x1="354" y1="515" x2="354" y2="610" stroke="#183244" stroke-width="22" stroke-linecap="round" />
                    <line id="right-thigh-hose" x1="354" y1="515" x2="354" y2="610" stroke="url(#hoseRibs)" stroke-width="18" stroke-linecap="round" />

                    <!-- Right Knee Joint Ball -->
                    <circle id="right-knee-ball" cx="354" cy="610" r="18" fill="url(#jointGrad)" stroke="#13242f" stroke-width="2.5" />
                </g>

                <!-- DYNAMIC PELVIS & BODY ROOT (Moves up/down and side-to-side with knees) -->
                <g id="pelvis-and-body-root" transform="translate(0, 0)">

                    <!-- Pelvis V-Bracket -->
                    <path id="pelvis-bracket" d="M 270 515 L 300 558 L 330 515 Z" fill="#183244" stroke="#0e202b" stroke-width="3.5" stroke-linejoin="round" />

                    <!-- TORSO MASTER GROUP -->
                    <g id="torso-master-group">

                        <!-- Big Spherical Body -->
                        <g id="body-sphere-group">
                            <circle cx="300" cy="385" r="130" fill="url(#sphereGrad)" stroke="#1a3344" stroke-width="3.5" filter="url(#robotTexture)" />
                            <path d="M 172 385 C 210 388, 390 388, 428 385" fill="none" stroke="#162e3d" stroke-width="3.5" />
                            <g fill="#162e3d">
                                <circle cx="195" cy="402" r="3.2" />
                                <circle cx="218" cy="402" r="3.2" />
                                <circle cx="242" cy="402" r="3.2" />
                                <circle cx="266" cy="402" r="3.2" />
                                <circle cx="290" cy="402" r="3.2" />
                                <circle cx="314" cy="402" r="3.2" />
                                <circle cx="338" cy="402" r="3.2" />
                                <circle cx="362" cy="402" r="3.2" />
                                <circle cx="385" cy="402" r="3.2" />
                                <circle cx="406" cy="402" r="3.2" />
                            </g>
                        </g>

                        <!-- NECK & HEAD HIERARCHY -->
                        <g id="neck-head-group" class="neck-head-group">
                            <!-- Corrugated Neck -->
                            <g id="neck-tube">
                                <rect x="290" y="215" width="20" height="46" rx="4" fill="url(#hoseRibs)" stroke="#455560" stroke-width="1.5" />
                            </g>

                            <!-- Head Assembly -->
                            <g id="head-assembly">
                                <!-- Left Antenna -->
                                <g id="antenna-left" class="antenna-left">
                                    <line x1="230" y1="120" x2="165" y2="48" stroke="#162e3d" stroke-width="4.5" stroke-linecap="round" />
                                    <circle cx="155" cy="38" r="12" fill="none" stroke="#162e3d" stroke-width="4" />
                                    <circle cx="155" cy="38" r="4" fill="#162e3d" />
                                    <circle cx="205" cy="92" r="16" fill="none" stroke="#162e3d" stroke-width="3.5" />
                                </g>

                                <!-- Right Antenna -->
                                <g id="antenna-right" class="antenna-right">
                                    <line x1="375" y1="120" x2="385" y2="45" stroke="#162e3d" stroke-width="4" stroke-linecap="round" />
                                    <circle cx="387" cy="40" r="10" fill="#162e3d" />
                                </g>

                                <!-- Head Casing -->
                                <rect x="200" y="80" width="200" height="135" rx="36" fill="url(#headGrad)" stroke="#183244" stroke-width="4" />

                                <!-- Visor Screen -->
                                <rect x="222" y="98" width="156" height="100" rx="20" fill="#142634" stroke="#0b1720" stroke-width="3" />

                                <!-- EYES GROUP -->
                                <g id="eyes-group">
                                    <g id="eye-left-container" transform="translate(262, 142)">
                                        <line x1="-14" y1="-26" x2="14" y2="-26" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6" />
                                        <circle cx="0" cy="0" r="22" fill="#ffffff" />
                                        <g id="pupil-left-group" class="pupil-group">
                                            <circle cx="0" cy="0" r="14" fill="#38bdf8" />
                                            <circle cx="0" cy="0" r="8" fill="#0f172a" />
                                            <circle cx="-3" cy="-3" r="3.5" fill="#ffffff" />
                                        </g>
                                        <rect id="eyelid-left" x="-25" y="-25" width="50" height="0" fill="#142634" />
                                    </g>

                                    <g id="eye-right-container" transform="translate(338, 142)">
                                        <line x1="-14" y1="-26" x2="14" y2="-26" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6" />
                                        <circle cx="0" cy="0" r="22" fill="#ffffff" />
                                        <g id="pupil-right-group" class="pupil-group">
                                            <circle cx="0" cy="0" r="14" fill="#38bdf8" />
                                            <circle cx="0" cy="0" r="8" fill="#0f172a" />
                                            <circle cx="-3" cy="-3" r="3.5" fill="#ffffff" />
                                        </g>
                                        <rect id="eyelid-right" x="-25" y="-25" width="50" height="0" fill="#142634" />
                                    </g>
                                </g>

                                <!-- EXPRESSIVE MOUTH -->
                                <g id="mouth-master-group">
                                    <path id="mouth-cavity" d="M 282 178 Q 300 178 318 178 Q 300 178 282 178 Z" fill="#09141c" opacity="0" />
                                    <path id="mouth-shape" class="mouth-shape" d="M 284 179 Q 300 186 316 179" fill="none" stroke="#a3e635" stroke-width="4.5" stroke-linecap="round" filter="url(#softGlow)" />
                                    <g id="mouth-teeth" class="mouth-teeth" style="opacity: 0;">
                                        <rect id="mouth-bar-1" x="288" y="176" width="3.5" height="10" rx="1.5" fill="#ffffff" />
                                        <rect id="mouth-bar-2" x="294" y="174" width="3.5" height="14" rx="1.5" fill="#a3e635" />
                                        <rect id="mouth-bar-3" x="300" y="173" width="3.5" height="16" rx="1.5" fill="#ffffff" />
                                        <rect id="mouth-bar-4" x="306" y="174" width="3.5" height="14" rx="1.5" fill="#a3e635" />
                                        <rect id="mouth-bar-5" x="312" y="176" width="3.5" height="10" rx="1.5" fill="#ffffff" />
                                    </g>
                                </g>
                            </g>
                        </g>

                        <!-- LEFT ARM ASSEMBLY -->
                        <g id="arm-left-rig" class="arm-left-rig">
                            <circle id="left-shoulder" cx="195" cy="300" r="34" fill="url(#jointGrad)" stroke="#13242f" stroke-width="3" filter="url(#robotTexture)" />
                            <g id="left-upper-arm" class="left-upper-arm">
                                <rect x="168" y="330" width="18" height="75" rx="5" fill="url(#hoseRibs)" stroke="#455560" stroke-width="1.5" />
                                <circle id="left-elbow" cx="177" cy="415" r="20" fill="url(#jointGrad)" stroke="#13242f" stroke-width="2.5" />
                                <g id="left-forearm" class="left-forearm">
                                    <rect x="168" y="430" width="18" height="75" rx="5" fill="url(#hoseRibs)" stroke="#455560" stroke-width="1.5" />
                                    <circle id="left-wrist" cx="177" cy="515" r="28" fill="url(#sphereGrad)" stroke="#183244" stroke-width="2.5" />
                                    <g id="left-hand-claws" class="left-hand-claws">
                                        <g id="left-claw-outer" class="claw-prong">
                                            <path d="M 160 535 L 140 560 L 140 600 L 165 625 L 175 625 L 155 600 L 155 565 Z" fill="#183244" stroke="#0e202b" stroke-width="2" />
                                            <circle cx="145" cy="565" r="2.5" fill="#cfdce4" />
                                            <circle cx="145" cy="595" r="2.5" fill="#cfdce4" />
                                        </g>
                                        <g id="left-claw-inner" class="claw-prong">
                                            <path d="M 185 535 L 205 560 L 205 600 L 180 625 L 170 625 L 190 600 L 190 565 Z" fill="#183244" stroke="#0e202b" stroke-width="2" />
                                            <circle cx="200" cy="565" r="2.5" fill="#cfdce4" />
                                            <circle cx="200" cy="595" r="2.5" fill="#cfdce4" />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>

                        <!-- RIGHT ARM ASSEMBLY -->
                        <g id="arm-right-rig" class="arm-right-rig">
                            <circle id="right-shoulder" cx="405" cy="300" r="34" fill="url(#jointGrad)" stroke="#13242f" stroke-width="3" filter="url(#robotTexture)" />
                            <g id="right-upper-arm" class="right-upper-arm">
                                <rect x="414" y="330" width="18" height="75" rx="5" fill="url(#hoseRibs)" stroke="#455560" stroke-width="1.5" />
                                <circle id="right-elbow" cx="423" cy="415" r="20" fill="url(#jointGrad)" stroke="#13242f" stroke-width="2.5" />
                                <g id="right-forearm" class="right-forearm">
                                    <rect x="414" y="430" width="18" height="75" rx="5" fill="url(#hoseRibs)" stroke="#455560" stroke-width="1.5" />
                                    <circle id="right-wrist" cx="423" cy="515" r="28" fill="url(#sphereGrad)" stroke="#183244" stroke-width="2.5" />
                                    <g id="right-hand-claws" class="right-hand-claws">
                                        <g id="right-claw-inner" class="claw-prong">
                                            <path d="M 405 535 L 385 560 L 385 600 L 410 625 L 420 625 L 400 600 L 400 565 Z" fill="#183244" stroke="#0e202b" stroke-width="2" />
                                            <circle cx="390" cy="565" r="2.5" fill="#cfdce4" />
                                            <circle cx="390" cy="595" r="2.5" fill="#cfdce4" />
                                        </g>
                                        <g id="right-claw-outer" class="claw-prong">
                                            <path d="M 435 535 L 455 560 L 455 600 L 430 625 L 420 625 L 440 600 L 440 565 Z" fill="#183244" stroke="#0e202b" stroke-width="2" />
                                            <circle cx="450" cy="565" r="2.5" fill="#cfdce4" />
                                            <circle cx="450" cy="595" r="2.5" fill="#cfdce4" />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>

                    </g> <!-- End torso-master-group -->
                </g> <!-- End pelvis-and-body-root -->

            </g> <!-- End robot-master-root -->
        </svg>
        `;
    }

    initJoints() {
        this.dom = {
            svg: document.getElementById('abinabot-rig-svg'),
            masterRoot: document.getElementById('robot-master-root'),
            bodyRoot: document.getElementById('pelvis-and-body-root'),
            groundShadow: document.getElementById('ground-shadow'),
            // Left leg
            leftShinBg: document.getElementById('left-shin-bg'),
            leftShinHose: document.getElementById('left-shin-hose'),
            leftThighBg: document.getElementById('left-thigh-bg'),
            leftThighHose: document.getElementById('left-thigh-hose'),
            leftKneeBall: document.getElementById('left-knee-ball'),
            // Right leg
            rightShinBg: document.getElementById('right-shin-bg'),
            rightShinHose: document.getElementById('right-shin-hose'),
            rightThighBg: document.getElementById('right-thigh-bg'),
            rightThighHose: document.getElementById('right-thigh-hose'),
            rightKneeBall: document.getElementById('right-knee-ball'),
            // Head & Face
            mouthShape: document.getElementById('mouth-shape'),
            mouthCavity: document.getElementById('mouth-cavity'),
            mouthTeeth: document.getElementById('mouth-teeth'),
            eyelidLeft: document.getElementById('eyelid-left'),
            eyelidRight: document.getElementById('eyelid-right'),
            pupilLeft: document.getElementById('pupil-left-group'),
            pupilRight: document.getElementById('pupil-right-group'),
            // Arms
            leftUpperArm: document.getElementById('left-upper-arm'),
            leftForearm: document.getElementById('left-forearm'),
            rightUpperArm: document.getElementById('right-upper-arm'),
            rightForearm: document.getElementById('right-forearm'),
            leftClawOuter: document.getElementById('left-claw-outer'),
            leftClawInner: document.getElementById('left-claw-inner'),
            rightClawOuter: document.getElementById('right-claw-outer'),
            rightClawInner: document.getElementById('right-claw-inner'),
            antennaLeft: document.getElementById('antenna-left'),
            antennaRight: document.getElementById('antenna-right')
        };
    }

    startLoops() {
        // Blinking
        const scheduleBlink = () => {
            const delay = Math.random() * 3000 + 2200;
            this.blinkTimer = setTimeout(() => {
                this.blink();
                scheduleBlink();
            }, delay);
        };
        scheduleBlink();

        // Eye glance
        const scheduleGlance = () => {
            const delay = Math.random() * 3800 + 2600;
            this.glanceTimer = setTimeout(() => {
                this.glanceRandom();
                scheduleGlance();
            }, delay);
        };
        scheduleGlance();

        // Calm Idle Pose Variations (gradual arm-on-hip & slight neck tilts)
        const idlePoses = [
            'idle-pose-neutral',
            'idle-pose-hip-left',
            'idle-pose-tilt-right',
            'idle-pose-neutral',
            'idle-pose-hip-right',
            'idle-pose-tilt-left'
        ];
        const scheduleIdlePose = () => {
            const delay = Math.random() * 2000 + 4200; // Every 4.2 - 6.2 seconds
            this.idlePoseTimer = setTimeout(() => {
                if (this.currentGesture === 'idle') {
                    this.idlePoseIndex = (this.idlePoseIndex + 1) % idlePoses.length;
                    this.applyIdlePose(idlePoses[this.idlePoseIndex]);
                } else if (this.currentGesture === 'listen') {
                    // In listen mode, only do subtle neck tilts occasionally
                    const listenPoses = ['idle-pose-neutral', 'idle-pose-tilt-left', 'idle-pose-neutral', 'idle-pose-tilt-right'];
                    this.idlePoseIndex = (this.idlePoseIndex + 1) % listenPoses.length;
                    this.applyIdlePose(listenPoses[this.idlePoseIndex]);
                }
                scheduleIdlePose();
            }, delay);
        };
        scheduleIdlePose();

        // Procedural Kinematic Animation Loop (Gradual weight shifting, breathing, & leg flexion)
        const updateKinematics = (now) => {
            const dt = this.lastFrameTime ? Math.min((now - this.lastFrameTime) / 1000, 0.05) : 1 / 60;
            this.lastFrameTime = now;
            this.animTime += dt;

            // Compute target motion based on current active gesture
            if (this.currentGesture === 'idle') {
                // Calm, gradual side-to-side weight shift & subtle breathing (+30% over initial calm)
                this.targetSquat = 6 + Math.sin(this.animTime * 1.15) * 4;
                this.targetSway = Math.sin(this.animTime * 0.85) * 13;
            } else if (this.currentGesture === 'singing') {
                // Wide side-to-side sway: left knee bends, right leg lengthens, then alternates!
                this.targetSquat = 12 + Math.abs(Math.sin(this.animTime * 4.6)) * 14;
                this.targetSway = Math.sin(this.animTime * 4.6) * 26;
            } else if (this.currentGesture === 'conduct') {
                // Match calm idle lower-body stance while arms conduct
                this.targetSquat = 6 + Math.sin(this.animTime * 1.15) * 4;
                this.targetSway = Math.sin(this.animTime * 0.85) * 13;
            } else if (this.currentGesture === 'jump') {
                // Excited jump into the air with a 360-degree mid-air flip!
                this.jumpTimer += dt;
                const cycle = this.jumpTimer % 1.9;
                if (cycle < 0.22) {
                    // Crouch wind-up
                    this.targetSquat = 24;
                    this.targetSway = 0;
                    this.jumpY = 0;
                    this.flipDeg = 0;
                } else if (cycle < 0.95) {
                    // Airborne arc + 360 flip
                    const p = (cycle - 0.22) / 0.73;
                    this.targetSquat = 0;
                    this.targetSway = 0;
                    this.jumpY = Math.sin(p * Math.PI) * 105;
                    this.flipDeg = p * 360;
                } else if (cycle < 1.2) {
                    // Landing knee absorb
                    const p = (cycle - 0.95) / 0.25;
                    this.targetSquat = 18 * (1 - p) + 6 * p;
                    this.targetSway = 0;
                    this.jumpY = 0;
                    this.flipDeg = 0;
                } else {
                    // Brief excited pause before next jump
                    this.targetSquat = 6;
                    this.targetSway = 0;
                    this.jumpY = 0;
                    this.flipDeg = 0;
                }
            } else if (this.currentGesture === 'both-arms-up' || this.currentGesture === 'cheer') {
                // Excited deep knee squat then spring straight!
                this.targetSquat = 16 + Math.sin(this.animTime * 9.45) * 18;
                this.targetSway = Math.sin(this.animTime * 4.2) * 8;
            } else if (this.currentGesture === 'wave') {
                // Confident slight weight shift to left leg while waving
                this.targetSquat = 6 + Math.sin(this.animTime * 1.4) * 3;
                this.targetSway = -10;
            } else if (this.currentGesture === 'think') {
                // Weight shift to right leg, knees slightly bent
                this.targetSquat = 10 + Math.sin(this.animTime * 0.9) * 2;
                this.targetSway = 10;
            } else if (this.currentGesture === 'point') {
                // Slight lean toward the lyric visual card on the right
                this.targetSquat = 6 + Math.sin(this.animTime * 1.1) * 2;
                this.targetSway = 8;
            } else if (this.currentGesture === 'facepalm') {
                // Sinks down slightly in comical embarrassment
                this.targetSquat = 18;
                this.targetSway = Math.sin(this.animTime * 5.0) * 3;
            } else if (this.currentGesture === 'listen') {
                // Attentive stance with subtle breathing & gentle weight shift
                this.targetSquat = 8 + Math.sin(this.animTime * 0.8) * 2;
                this.targetSway = Math.sin(this.animTime * 0.5) * 4;
            } else {
                this.targetSquat = 6 + Math.sin(this.animTime * 1.0) * 3;
                this.targetSway = Math.sin(this.animTime * 0.6) * 5;
            }

            if (this.currentGesture !== 'jump') {
                this.jumpY = 0;
                this.flipDeg = 0;
            }

            if (this.dom.masterRoot) {
                if (this.jumpY > 0.1 || this.flipDeg !== 0) {
                    this.dom.masterRoot.setAttribute(
                        'transform',
                        `translate(0, ${(-this.jumpY).toFixed(1)}) rotate(${this.flipDeg.toFixed(1)}, 300, 440)`
                    );
                } else {
                    this.dom.masterRoot.removeAttribute('transform');
                }
            }

            // Frame-rate independent smooth interpolation (lerp)
            const lerpFactor = 1 - Math.exp(-5 * dt);
            this.squatY += (this.targetSquat - this.squatY) * lerpFactor;
            this.swayX += (this.targetSway - this.swayX) * lerpFactor;

            this.updateLegsAndBody(this.squatY, this.swayX);
            requestAnimationFrame(updateKinematics);
        };

        requestAnimationFrame(updateKinematics);
    }

    // Kinematic Geometry Solver:
    // Moves pelvis & body, and recalculates knee positions & hose lines
    updateLegsAndBody(squatY, swayX) {
        const leftFootAnchor = { x: 246, y: 700 };
        const rightFootAnchor = { x: 354, y: 700 };

        // Pelvis moves down by squatY and side-to-side by swayX
        const pelvisPos = { x: 300 + swayX, y: 515 + squatY };
        const leftHip = { x: pelvisPos.x - 54, y: pelvisPos.y };
        const rightHip = { x: pelvisPos.x + 54, y: pelvisPos.y };

        // Knees bend outward as body lowers; when body sways, the side moving inward bends more
        const leftBend = Math.max(0, squatY * 0.85 - swayX * 0.45);
        const rightBend = Math.max(0, squatY * 0.85 + swayX * 0.45);

        const leftKnee = {
            x: 246 - leftBend + swayX * 0.25,
            y: (leftHip.y + leftFootAnchor.y) / 2 + leftBend * 0.18
        };

        const rightKnee = {
            x: 354 + rightBend + swayX * 0.25,
            y: (rightHip.y + rightFootAnchor.y) / 2 + rightBend * 0.18
        };

        // Update Pelvis & Body Translation
        if (this.dom.bodyRoot) {
            this.dom.bodyRoot.setAttribute('transform', `translate(${swayX}, ${squatY})`);
        }

        // Update Left Thigh (Hip -> Knee)
        this.setLine(this.dom.leftThighBg, leftHip.x, leftHip.y, leftKnee.x, leftKnee.y);
        this.setLine(this.dom.leftThighHose, leftHip.x, leftHip.y, leftKnee.x, leftKnee.y);

        // Update Left Shin (Knee -> Foot)
        this.setLine(this.dom.leftShinBg, leftKnee.x, leftKnee.y, leftFootAnchor.x, leftFootAnchor.y);
        this.setLine(this.dom.leftShinHose, leftKnee.x, leftKnee.y, leftFootAnchor.x, leftFootAnchor.y);

        // Update Left Knee Ball
        if (this.dom.leftKneeBall) {
            this.dom.leftKneeBall.setAttribute('cx', leftKnee.x.toString());
            this.dom.leftKneeBall.setAttribute('cy', leftKnee.y.toString());
        }

        // Update Right Thigh (Hip -> Knee)
        this.setLine(this.dom.rightThighBg, rightHip.x, rightHip.y, rightKnee.x, rightKnee.y);
        this.setLine(this.dom.rightThighHose, rightHip.x, rightHip.y, rightKnee.x, rightKnee.y);

        // Update Right Shin (Knee -> Foot)
        this.setLine(this.dom.rightShinBg, rightKnee.x, rightKnee.y, rightFootAnchor.x, rightFootAnchor.y);
        this.setLine(this.dom.rightShinHose, rightKnee.x, rightKnee.y, rightFootAnchor.x, rightFootAnchor.y);

        // Update Right Knee Ball
        if (this.dom.rightKneeBall) {
            this.dom.rightKneeBall.setAttribute('cx', rightKnee.x.toString());
            this.dom.rightKneeBall.setAttribute('cy', rightKnee.y.toString());
        }

        // Shadow expands slightly when squatting low, and shrinks when jumping in the air
        if (this.dom.groundShadow) {
            const shadowScale = Math.max(0.45, 1 + (squatY / 120) - (this.jumpY / 260));
            this.dom.groundShadow.setAttribute('transform', `scale(${shadowScale.toFixed(3)})`);
            this.dom.groundShadow.setAttribute('transform-origin', '300px 815px');
        }
    }

    setLine(elem, x1, y1, x2, y2) {
        if (!elem) return;
        elem.setAttribute('x1', x1.toFixed(1));
        elem.setAttribute('y1', y1.toFixed(1));
        elem.setAttribute('x2', x2.toFixed(1));
        elem.setAttribute('y2', y2.toFixed(1));
    }

    blink() {
        if (!this.dom.eyelidLeft || !this.dom.eyelidRight) return;
        this.dom.eyelidLeft.setAttribute('height', '50');
        this.dom.eyelidRight.setAttribute('height', '50');

        setTimeout(() => {
            this.dom.eyelidLeft.setAttribute('height', '0');
            this.dom.eyelidRight.setAttribute('height', '0');
        }, 150);
    }

    glanceRandom() {
        if (this.currentGesture === 'singing') return;
        const xOffsets = [-5, 0, 5, 0, 4, -4];
        const yOffsets = [-3, 0, 3, 0, 2];
        const randX = xOffsets[Math.floor(Math.random() * xOffsets.length)];
        const randY = yOffsets[Math.floor(Math.random() * yOffsets.length)];

        if (this.dom.pupilLeft && this.dom.pupilRight) {
            this.dom.pupilLeft.style.transform = `translate(${randX}px, ${randY}px)`;
            this.dom.pupilRight.style.transform = `translate(${randX}px, ${randY}px)`;
        }
    }

    lookAtTeacher() {
        if (this.dom.pupilLeft && this.dom.pupilRight) {
            this.dom.pupilLeft.style.transform = `translate(0px, 4px)`;
            this.dom.pupilRight.style.transform = `translate(0px, 4px)`;
        }
    }

    // Dynamic talking mouth animation
    startTalking() {
        this.isTalking = true;
        if (this.dom.svg) this.dom.svg.classList.add('is-talking');
        if (this.dom.mouthTeeth) this.dom.mouthTeeth.style.opacity = '1';
        if (this.dom.mouthCavity) this.dom.mouthCavity.style.opacity = '0.9';

        clearInterval(this.talkingTimer);
        let toggle = 0;

        const mouthVisemes = [
            { shape: 'M 280 174 Q 300 172 320 174 Q 320 196 300 198 Q 280 196 280 174 Z', cavity: 'M 282 176 Q 300 174 318 176 Q 318 194 300 196 Q 282 194 282 176 Z', fill: '#142634', stroke: '#a3e635' },
            { shape: 'M 282 176 Q 300 174 318 176 Q 316 190 300 192 Q 284 190 282 176 Z', cavity: 'M 284 177 Q 300 175 316 177 Q 314 188 300 190 Q 286 188 284 177 Z', fill: '#142634', stroke: '#a3e635' },
            { shape: 'M 292 172 C 282 172 282 198 292 198 C 308 198 308 172 292 172 Z', cavity: 'M 293 174 C 285 174 285 196 293 196 C 307 196 307 174 293 174 Z', fill: '#142634', stroke: '#a3e635' },
            { shape: 'M 278 176 Q 300 173 322 176 Q 318 194 300 196 Q 282 194 278 176 Z', cavity: 'M 280 177 Q 300 175 320 177 Q 316 192 300 194 Q 284 192 280 177 Z', fill: '#142634', stroke: '#a3e635' },
            { shape: 'M 286 177 Q 300 175 314 177 Q 312 187 300 188 Q 288 187 286 177 Z', cavity: 'M 287 178 Q 300 176 313 178 Q 311 185 300 186 Q 289 185 287 178 Z', fill: '#142634', stroke: '#a3e635' }
        ];

        this.talkingTimer = setInterval(() => {
            if (!this.isTalking) return;
            toggle++;
            const viseme = mouthVisemes[toggle % mouthVisemes.length];

            if (this.dom.mouthShape && this.dom.mouthCavity) {
                this.dom.mouthShape.setAttribute('d', viseme.shape);
                this.dom.mouthShape.setAttribute('fill', viseme.fill);
                this.dom.mouthShape.setAttribute('stroke', viseme.stroke);
                this.dom.mouthCavity.setAttribute('d', viseme.cavity);
            }

            for (let i = 1; i <= 5; i++) {
                const bar = document.getElementById(`mouth-bar-${i}`);
                if (bar) {
                    const h = 6 + Math.random() * 12;
                    bar.setAttribute('height', h.toString());
                    bar.setAttribute('y', (185 - h / 2).toString());
                }
            }

            if (toggle % 4 === 0) {
                this.pinchClaws('right', true);
            } else if (toggle % 4 === 2) {
                this.pinchClaws('right', false);
            }
        }, 110);
    }

    stopTalking() {
        this.isTalking = false;
        clearInterval(this.talkingTimer);
        if (this.dom.svg) this.dom.svg.classList.remove('is-talking');

        if (this.dom.mouthShape) {
            this.dom.mouthShape.setAttribute('d', 'M 284 179 Q 300 186 316 179');
            this.dom.mouthShape.setAttribute('fill', 'none');
            this.dom.mouthShape.setAttribute('stroke', '#a3e635');
            this.dom.mouthShape.setAttribute('stroke-width', '4.5');
        }
        if (this.dom.mouthCavity) this.dom.mouthCavity.style.opacity = '0';
        if (this.dom.mouthTeeth) this.dom.mouthTeeth.style.opacity = '0';

        this.pinchClaws('right', false);
        this.pinchClaws('left', false);
    }

    pinchClaws(hand = 'right', closed = true) {
        if (hand === 'right') {
            if (this.dom.rightClawOuter && this.dom.rightClawInner) {
                this.dom.rightClawOuter.style.transform = closed ? 'rotate(-10deg)' : 'rotate(0deg)';
                this.dom.rightClawInner.style.transform = closed ? 'rotate(10deg)' : 'rotate(0deg)';
            }
        } else {
            if (this.dom.leftClawOuter && this.dom.leftClawInner) {
                this.dom.leftClawOuter.style.transform = closed ? 'rotate(10deg)' : 'rotate(0deg)';
                this.dom.leftClawInner.style.transform = closed ? 'rotate(-10deg)' : 'rotate(0deg)';
            }
        }
    }

    applyIdlePose(poseClass) {
        const svg = this.dom.svg;
        if (!svg) return;
        svg.classList.remove(
            'idle-pose-neutral',
            'idle-pose-hip-left',
            'idle-pose-hip-right',
            'idle-pose-tilt-left',
            'idle-pose-tilt-right'
        );
        if (poseClass) {
            svg.classList.add(poseClass);
        }
    }

    setGesture(gesture) {
        this.currentGesture = gesture;
        const svg = this.dom.svg;
        if (!svg) return;

        if (gesture !== 'idle' && gesture !== 'listen') {
            this.applyIdlePose(null);
        } else if (gesture === 'listen') {
            this.applyIdlePose('idle-pose-neutral');
        }

        svg.classList.remove(
            'gesture-idle',
            'gesture-wave',
            'gesture-raise-right',
            'gesture-raise-left',
            'gesture-both-arms-up',
            'gesture-conduct',
            'gesture-think',
            'gesture-listen',
            'gesture-singing',
            'gesture-cheer',
            'gesture-point',
            'gesture-facepalm',
            'gesture-jump'
        );

        svg.classList.add(`gesture-${gesture}`);

        if (gesture === 'wave') {
            this.pinchClaws('right', false);
            this.wobbleAntennae();
        } else if (gesture === 'both-arms-up' || gesture === 'cheer') {
            this.pinchClaws('left', false);
            this.pinchClaws('right', false);
            this.wobbleAntennae();
        } else if (gesture === 'jump') {
            this.jumpTimer = 0;
            this.pinchClaws('left', false);
            this.pinchClaws('right', false);
            this.wobbleAntennae();
        } else if (gesture === 'listen') {
            this.lookAtTeacher();
        } else if (gesture === 'point') {
            this.pinchClaws('right', true);
            if (this.dom.pupilLeft && this.dom.pupilRight) {
                this.dom.pupilLeft.style.transform = `translate(6px, 0px)`;
                this.dom.pupilRight.style.transform = `translate(6px, 0px)`;
            }
        } else if (gesture === 'facepalm') {
            this.pinchClaws('left', true);
            this.pinchClaws('right', true);
            this.wobbleAntennae();
        }
    }

    wobbleAntennae() {
        if (this.dom.antennaLeft && this.dom.antennaRight) {
            this.dom.antennaLeft.classList.add('wobble');
            this.dom.antennaRight.classList.add('wobble');
            setTimeout(() => {
                this.dom.antennaLeft.classList.remove('wobble');
                this.dom.antennaRight.classList.remove('wobble');
            }, 1200);
        }
    }
}

window.AbinabotRig = AbinabotRig;
