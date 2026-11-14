// Illustrated Picture & Lyric Cards for Primary Review Sunday
// Shown ONLY during song lyric teaching and sing-along steps.
// Keeps the stage 100% text-free during normal banter!

const LYRIC_ILLUSTRATIONS = {
    // ====================================================
    // I LIVED IN HEAVEN - VERSE 1
    // ====================================================
    'heaven-v1-1': {
        text: 'I lived in heaven a long time ago, it is true;',
        bg: '#e0f2fe',
        border: '#38bdf8',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Sunbeams / Heavenly Glow -->
                <circle cx="100" cy="52" r="34" fill="#fde047" opacity="0.9" />
                <circle cx="100" cy="52" r="46" fill="#fef08a" opacity="0.4" />
                <!-- Fluffy Clouds -->
                <path d="M40 105 Q30 105 30 92 Q30 78 46 78 Q54 64 72 68 Q85 62 98 72 Q114 68 122 82 Q138 82 138 95 Q138 105 124 105 Z" fill="#ffffff" stroke="#7dd3fc" stroke-width="3"/>
                <path d="M90 116 Q82 116 82 106 Q82 95 96 95 Q104 84 118 88 Q130 82 140 90 Q154 88 160 98 Q170 98 170 108 Q170 116 158 116 Z" fill="#ffffff" stroke="#7dd3fc" stroke-width="3"/>
                <!-- Sparkle Stars -->
                <text x="36" y="42" font-size="20">✨</text>
                <text x="148" y="46" font-size="22">⭐</text>
            </svg>
        `
    },
    'heaven-v1-2': {
        text: 'Lived there and loved there with people I know. So did you.',
        bg: '#fef3c7',
        border: '#f59e0b',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Big Warm Heart -->
                <path d="M100 45 C90 25, 62 28, 62 50 C62 72, 100 94, 100 94 C100 94, 138 72, 138 50 C138 28, 110 25, 100 45 Z" fill="#fb7185" opacity="0.25" />
                <!-- Three Happy Little Friends / Spirits -->
                <circle cx="62" cy="64" r="14" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
                <path d="M44 112 C44 88, 80 88, 80 112 Z" fill="#60a5fa" stroke="#1d4ed8" stroke-width="3"/>
                <circle cx="138" cy="64" r="14" fill="#fed7aa" stroke="#d97706" stroke-width="3"/>
                <path d="M120 112 C120 88, 156 88, 156 112 Z" fill="#34d399" stroke="#047857" stroke-width="3"/>
                <circle cx="100" cy="56" r="16" fill="#fef08a" stroke="#d97706" stroke-width="3"/>
                <path d="M80 115 C80 86, 120 86, 120 115 Z" fill="#f472b6" stroke="#be185d" stroke-width="3"/>
                <!-- Smiles -->
                <path d="M94 60 Q100 66 106 60" fill="none" stroke="#92400e" stroke-width="2.5" stroke-linecap="round"/>
                <text x="89" y="34" font-size="22">💛</text>
            </svg>
        `
    },
    'heaven-v1-3': {
        text: "Then Heav'nly Father presented a beautiful plan,",
        bg: '#ede9fe',
        border: '#8b5cf6',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Blueprint / Plan Scroll -->
                <rect x="44" y="26" width="112" height="88" rx="10" fill="#fffbeb" stroke="#8b5cf6" stroke-width="3.5"/>
                <!-- Roll edges -->
                <rect x="38" y="20" width="124" height="14" rx="7" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2.5"/>
                <rect x="38" y="106" width="124" height="14" rx="7" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2.5"/>
                <!-- Plan Path Diagram inside Scroll -->
                <circle cx="68" cy="56" r="10" fill="#fde047" stroke="#eab308" stroke-width="2"/>
                <path d="M78 56 Q100 40 100 72 T128 84" fill="none" stroke="#7c3aed" stroke-width="3" stroke-dasharray="5,4"/>
                <circle cx="134" cy="84" r="11" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
                <text x="90" y="96" font-size="14" font-weight="bold" fill="#6d28d9">PLAN</text>
            </svg>
        `
    },
    'heaven-v1-4': {
        text: 'All about earth and eternal salvation for man.',
        bg: '#dcfce7',
        border: '#22c55e',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Planet Earth -->
                <circle cx="100" cy="70" r="44" fill="#38bdf8" stroke="#0369a1" stroke-width="3.5"/>
                <!-- Continents -->
                <path d="M72 48 Q88 40 96 54 Q102 68 85 78 Q72 82 68 66 Z" fill="#4ade80" stroke="#15803d" stroke-width="2"/>
                <path d="M110 46 Q128 48 134 64 Q132 82 118 86 Q106 76 110 46 Z" fill="#4ade80" stroke="#15803d" stroke-width="2"/>
                <path d="M88 92 Q100 88 112 96 Q106 108 90 104 Z" fill="#4ade80" stroke="#15803d" stroke-width="2"/>
                <!-- Orbiting Stars / Light -->
                <text x="34" y="45" font-size="20">✨</text>
                <text x="150" y="95" font-size="20">🌟</text>
            </svg>
        `
    },

    // ====================================================
    // I LIVED IN HEAVEN - VERSE 2
    // ====================================================
    'heaven-v2-1': {
        text: 'Father said he needed someone who had enough love',
        bg: '#ffe4e6',
        border: '#f43f5e',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Radiant Heart -->
                <circle cx="100" cy="70" r="50" fill="#fecdd3" opacity="0.5"/>
                <path d="M100 50 C86 24, 48 28, 48 58 C48 88, 100 116, 100 116 C100 116, 152 88, 152 58 C152 28, 114 24, 100 50 Z" fill="#f43f5e" stroke="#be123c" stroke-width="3.5"/>
                <path d="M68 48 Q75 40 84 44" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
                <text x="36" y="40" font-size="18">✨</text>
                <text x="148" y="40" font-size="18">✨</text>
            </svg>
        `
    },
    'heaven-v2-2': {
        text: 'To give his life so we all could return there above.',
        bg: '#e0f2fe',
        border: '#0ea5e9',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Earth at bottom, Cloud Heaven at top, Golden Path Up -->
                <path d="M55 120 Q100 100 145 120 Z" fill="#4ade80" stroke="#15803d" stroke-width="2.5"/>
                <!-- Golden Arrow Path Upward -->
                <path d="M100 106 L100 44" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
                <path d="M84 58 L100 38 L116 58" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Top Heavenly Clouds -->
                <path d="M55 38 Q48 38 48 30 Q48 20 60 20 Q68 10 82 14 Q96 8 108 16 Q124 12 130 22 Q144 22 144 32 Q144 38 134 38 Z" fill="#ffffff" stroke="#38bdf8" stroke-width="2.5"/>
            </svg>
        `
    },
    'heaven-v2-3': {
        text: 'There was another who sought for the honor divine.',
        bg: '#f1f5f9',
        border: '#64748b',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Two Diverging Arrows / Choice Crossroads -->
                <path d="M100 116 L100 76" stroke="#475569" stroke-width="7" stroke-linecap="round"/>
                <!-- Left path (gray / self) -->
                <path d="M100 76 Q74 56 54 44" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>
                <path d="M54 58 L48 40 L66 38" fill="none" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Right path (bright golden / Father's plan) -->
                <path d="M100 76 Q126 56 146 44" fill="none" stroke="#f59e0b" stroke-width="7" stroke-linecap="round"/>
                <path d="M134 38 L152 40 L146 58" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                <text x="148" y="32" font-size="22">⭐</text>
            </svg>
        `
    },
    'heaven-v2-4': {
        text: 'Jesus said, "Father, send me, and the glory be thine."',
        bg: '#fef9c3',
        border: '#eab308',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Radiant Sunburst & Raised Loving Arms -->
                <circle cx="100" cy="48" r="28" fill="#fde047" stroke="#eab308" stroke-width="2.5"/>
                <!-- Robed Silhouette / Loving Savior figure -->
                <circle cx="100" cy="52" r="14" fill="#fffbeb" stroke="#ca8a04" stroke-width="3"/>
                <path d="M74 118 L86 72 L114 72 L126 118 Z" fill="#ffffff" stroke="#ca8a04" stroke-width="3"/>
                <!-- Open welcoming arms -->
                <path d="M86 76 L58 58" stroke="#ca8a04" stroke-width="5" stroke-linecap="round"/>
                <path d="M114 76 L142 58" stroke="#ca8a04" stroke-width="5" stroke-linecap="round"/>
                <text x="38" y="45" font-size="20">🌟</text>
                <text x="142" y="45" font-size="20">🌟</text>
            </svg>
        `
    },

    // ====================================================
    // CHRISTMAS BELLS ARE RINGING (Page 54)
    // ====================================================
    'bells-1': {
        text: 'Christmas bells are ringing,',
        bg: '#fef3c7',
        border: '#f59e0b',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Two Golden Ringing Christmas Bells -->
                <g transform="translate(80, 65) rotate(-18)">
                    <path d="M-24 22 Q-20 -18 0 -22 Q20 -18 24 22 Z" fill="#fbbf24" stroke="#b45309" stroke-width="3"/>
                    <circle cx="0" cy="24" r="6" fill="#b45309"/>
                </g>
                <g transform="translate(122, 65) rotate(18)">
                    <path d="M-24 22 Q-20 -18 0 -22 Q20 -18 24 22 Z" fill="#fcd34d" stroke="#b45309" stroke-width="3"/>
                    <circle cx="0" cy="24" r="6" fill="#b45309"/>
                </g>
                <!-- Red Holiday Ribbon Bow -->
                <circle cx="100" cy="34" r="9" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>
                <path d="M92 34 L74 24 L78 42 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
                <path d="M108 34 L126 24 L122 42 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
                <!-- Ringing Sound Waves & Music Notes -->
                <text x="32" y="55" font-size="24">🎵</text>
                <text x="148" y="55" font-size="24">🎶</text>
            </svg>
        `
    },
    'bells-2': {
        text: 'Hear what they say to you:',
        bg: '#dcfce7',
        border: '#10b981',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Musical Soundwaves & Listening Smile -->
                <path d="M55 70 Q70 45 55 20" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
                <path d="M40 80 Q62 45 40 10" fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round"/>
                <circle cx="105" cy="70" r="32" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
                <circle cx="95" cy="64" r="4" fill="#1e293b"/>
                <circle cx="115" cy="64" r="4" fill="#1e293b"/>
                <path d="M95 80 Q105 90 115 80" fill="none" stroke="#92400e" stroke-width="3" stroke-linecap="round"/>
                <text x="142" y="50" font-size="28">🔔</text>
                <text x="135" y="102" font-size="22">🎵</text>
            </svg>
        `
    },
    'bells-3': {
        text: 'Jesus is born in Bethlehem,',
        bg: '#e0e7ff',
        border: '#6366f1',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Star of Bethlehem over Manger/Stable -->
                <polygon points="100,12 106,30 124,30 110,41 115,58 100,48 85,58 90,41 76,30 94,30" fill="#fde047" stroke="#eab308" stroke-width="2"/>
                <!-- Stable Roof -->
                <path d="M55 88 L100 58 L145 88" fill="none" stroke="#78350f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Warm Manger Crib -->
                <path d="M80 116 L86 96 L114 96 L120 116 Z" fill="#d97706" stroke="#78350f" stroke-width="2.5"/>
                <circle cx="100" cy="92" r="9" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
                <path d="M88 96 Q100 104 112 96" fill="#fef08a"/>
            </svg>
        `
    },
    'bells-4': {
        text: 'In Bethlehem.',
        bg: '#1e1b4b',
        border: '#818cf8',
        textColor: '#ffffff',
        svg: `
            <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                <!-- Peaceful Bethlehem Night Sky & Town Silhouette -->
                <path d="M100 18 L104 34 L120 38 L104 42 L100 58 L96 42 L80 38 L96 34 Z" fill="#fef08a"/>
                <!-- Gentle Rolling Hills & Little Town Houses -->
                <path d="M20 120 Q70 90 120 106 Q160 118 185 102 L185 128 L20 128 Z" fill="#312e81"/>
                <rect x="64" y="84" width="22" height="24" fill="#4338ca" stroke="#6366f1" stroke-width="2"/>
                <rect x="92" y="76" width="28" height="32" fill="#4338ca" stroke="#6366f1" stroke-width="2"/>
                <path d="M90 76 Q106 62 122 76 Z" fill="#4f46e5" stroke="#6366f1" stroke-width="2"/>
                <circle cx="106" cy="94" r="4" fill="#fde047"/>
                <text x="38" y="42" font-size="16">✨</text>
                <text x="148" y="48" font-size="16">✨</text>
            </svg>
        `
    }
};

class VisualCardController {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    hide() {
        if (!this.container) return;
        this.container.classList.remove('visible');
        this.container.innerHTML = '';
        document.body.classList.remove('has-visual-card');
    }

    // Show a single big illustrated card (for line-by-line teaching)
    showSingle(cardId, badgeText = '') {
        if (!this.container) return;
        const card = LYRIC_ILLUSTRATIONS[cardId];
        if (!card) {
            this.hide();
            return;
        }

        document.body.classList.add('has-visual-card');
        this.container.classList.add('visible');

        this.container.innerHTML = `
            <div class="visual-card-single" style="background: ${card.bg}; border-color: ${card.border};">
                ${badgeText ? `<div class="visual-card-badge" style="background: ${card.border};">${badgeText}</div>` : ''}
                <div class="visual-card-art">
                    ${card.svg}
                </div>
                <div class="visual-card-text" style="${card.textColor ? `color: ${card.textColor};` : ''}">
                    ${card.text}
                </div>
            </div>
        `;
    }

    // Show all 4 cards of a verse in a clean 2x2 sing-along grid
    showVerseGrid(cardIds, titleText = '') {
        if (!this.container) return;
        const cards = cardIds.map(id => LYRIC_ILLUSTRATIONS[id]).filter(Boolean);
        if (!cards.length) {
            this.hide();
            return;
        }

        document.body.classList.add('has-visual-card');
        this.container.classList.add('visible');

        const itemsHtml = cards.map((card, i) => `
            <div class="visual-grid-item" style="background: ${card.bg}; border-color: ${card.border};">
                <div class="visual-grid-art">${card.svg}</div>
                <div class="visual-grid-text" style="${card.textColor ? `color: ${card.textColor};` : (card.bg === '#1e1b4b' ? 'color: #ffffff;' : '')}">${card.text}</div>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="visual-card-grid-wrap">
                ${titleText ? `<div class="visual-grid-title">${titleText}</div>` : ''}
                <div class="visual-card-grid">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }
}

window.VisualCardController = VisualCardController;
window.LYRIC_ILLUSTRATIONS = LYRIC_ILLUSTRATIONS;
