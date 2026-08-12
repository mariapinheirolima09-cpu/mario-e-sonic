/**
 * MARIO VS SONIC - 16-BIT RETRO COMPARISON
 * Arquivo: script.js
 */

document.addEventListener('DOMContentLoaded', () => {
    initRetroPage();
});

function initRetroPage() {
    injectRetroStyles();
    renderPageContent();
    setupAudioContext();
    setupInteractions();
    createPixelParticles();
}

/* ==========================================================================
   1. INJEÇÃO DE ESTILOS RETRÔ (CSS)
   ========================================================================== */
function injectRetroStyles() {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            image-rendering: pixelated;
        }

        :root {
            --bg-dark: #0a0814;
            --mario-red: #e52521;
            --mario-blue: #00247d;
            --mario-yellow: #fbd000;
            --mario-brown: #a84000;
            --sonic-blue: #0000f5;
            --sonic-gold: #ffbe00;
            --card-bg: #161226;
            --text-white: #f8f8f8;
            --border-width: 4px;
        }

        body {
            background-color: var(--bg-dark);
            background-image: 
                linear-gradient(rgba(18, 16, 38, 0.9), rgba(10, 8, 20, 0.95)),
                radial-gradient(#2a2050 1px, transparent 0);
            background-size: 100% 100%, 16px 16px;
            color: var(--text-white);
            font-family: 'Press Start 2P', monospace;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px 15px;
            overflow-x: hidden;
            position: relative;
        }

        /* BANNER CRTs / SCANLINES */
        body::after {
            content: " ";
            display: block;
            position: fixed;
            top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
            background-size: 100% 4px;
            z-index: 100;
            pointer-events: none;
            opacity: 0.6;
        }

        header {
            text-align: center;
            margin-bottom: 30px;
            max-width: 900px;
        }

        h1 {
            font-size: clamp(1.2rem, 3.5vw, 2.2rem);
            line-height: 1.4;
            color: #fff;
            text-shadow: 
                4px 4px 0px var(--mario-red),
                -4px -4px 0px var(--sonic-blue);
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 0.65rem;
            color: var(--mario-yellow);
            letter-spacing: 1px;
            line-height: 1.8;
            text-shadow: 2px 2px 0px #000;
        }

        .coin-prompt {
            margin-top: 20px;
            font-size: 0.55rem;
            color: #888;
            animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        /* ESTRUTURA DOS CARDS */
        .story-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 35px;
            max-width: 1050px;
            width: 100%;
            margin-bottom: 40px;
            z-index: 10;
        }

        @media (min-width: 850px) {
            .story-container {
                grid-template-columns: 1fr 1fr;
            }
        }

        .character-card {
            background-color: var(--card-bg);
            border: var(--border-width) solid #000;
            box-shadow: 
                0 0 0 var(--border-width) #382d5c,
                8px 8px 0px #000;
            padding: 25px;
            position: relative;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
        }

        .character-card.mario-theme {
            border-color: var(--mario-red);
        }

        .character-card.sonic-theme {
            border-color: var(--sonic-blue);
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 4px dashed #2d244c;
        }

        .card-title {
            font-size: 1.1rem;
        }

        .mario-theme .card-title {
            color: var(--mario-red);
            text-shadow: 2px 2px 0px #000;
        }

        .sonic-theme .card-title {
            color: var(--sonic-blue);
            text-shadow: 2px 2px 0px #000;
        }

        .card-badge {
            font-size: 0.45rem;
            padding: 6px 8px;
            background: #000;
            border: 2px solid #fff;
        }

        /* PIXEL ART CSS */
        .pixel-art-wrapper {
            height: 65px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            background-color: #000;
            border: 2px solid #382d5c;
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        .question-block {
            width: 32px;
            height: 32px;
            background-color: var(--mario-yellow);
            border: 3px solid var(--mario-brown);
            box-shadow: 
                inset -3px -3px 0px 0px #804000,
                inset 3px 3px 0px 0px #ffe066;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: var(--mario-brown);
            font-weight: bold;
            animation: floatBlock 2s infinite ease-in-out;
        }

        @keyframes floatBlock {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }

        .sonic-ring {
            width: 24px;
            height: 30px;
            border: 4px solid var(--sonic-gold);
            border-radius: 40%;
            box-shadow: 0 0 10px var(--sonic-gold);
            animation: spinRing 0.8s infinite linear;
        }

        @keyframes spinRing {
            0% { transform: scaleX(1); }
            50% { transform: scaleX(0.2); }
            100% { transform: scaleX(1); }
        }

        /* TEXTO FLUIDO E NARRATIVO */
        .story-text {
            font-size: 0.62rem;
            line-height: 2.2;
            color: #d0cce0;
            text-align: justify;
        }

        .story-text p {
            margin-bottom: 16px;
        }

        .story-text p:last-child {
            margin-bottom: 0;
        }

        .highlight-mario {
            color: var(--mario-yellow);
        }

        .highlight-sonic {
            color: var(--sonic-gold);
        }

        /* PAINEL DE CONTROLE RETRÔ */
        .control-panel {
            background-color: #000;
            border: 4px solid #fff;
            padding: 20px;
            max-width: 650px;
            width: 100%;
            text-align: center;
            box-shadow: 6px 6px 0px #382d5c;
            margin-bottom: 30px;
            z-index: 10;
        }

        .panel-desc {
            font-size: 0.55rem;
            color: #aaa;
            margin-bottom: 15px;
            line-height: 1.6;
        }

        .btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .arcade-btn {
            background-color: #222;
            color: #fff;
            border: 3px solid #fff;
            padding: 10px 14px;
            font-size: 0.5rem;
            font-family: 'Press Start 2P', monospace;
            cursor: pointer;
            box-shadow: 3px 3px 0px #555;
            transition: all 0.1s;
        }

        .arcade-btn:hover {
            background-color: #333;
            transform: translate(-1px, -1px);
            box-shadow: 4px 4px 0px #777;
        }

        .arcade-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 1px 1px 0px #333;
        }

        .arcade-btn.btn-mario {
            border-color: var(--mario-red);
            color: var(--mario-yellow);
        }

        .arcade-btn.btn-sonic {
            border-color: var(--sonic-blue);
            color: #88aaff;
        }

        footer {
            font-size: 0.5rem;
            color: #665c84;
            text-align: center;
            margin-top: auto;
            line-height: 1.8;
            z-index: 10;
        }

        /* EFEITO DE PARTÍCULAS EM PIXEL */
        .pixel-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            pointer-events: none;
            opacity: 0.6;
            animation: floatParticle linear infinite;
        }

        @keyframes floatParticle {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            20% { opacity: 0.6; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(styleTag);
}

/* ==========================================================================
   2. RENDERIZAÇÃO ESTRUTURAL DA PÁGINA (DOM)
   ========================================================================== */
function renderPageContent() {
    const root = document.body;

    root.innerHTML = `
        <header>
            <h1>MARIO VS SONIC</h1>
            <div class="subtitle">A FILOSOFIA DOS PULOS E RAMPAS NA ERA 16-BIT</div>
            <div class="coin-prompt">INSERT COIN TO ANALYZE</div>
        </header>

        <main class="story-container">
            <!-- CARTÃO SUPER MARIO -->
            <article class="character-card mario-theme" id="mario-card">
                <div class="card-header">
                    <h2 class="card-title">SUPER MARIO</h2>
                    <span class="card-badge" style="color: var(--mario-yellow);">NINTENDO</span>
                </div>

                <div class="pixel-art-wrapper" id="mario-interactive">
                    <div class="question-block">?</div>
                </div>

                <div class="story-text">
                    <p>
                        O amor duradouro que atravessa gerações pelo universo de <span class="highlight-mario">Super Mario</span> não nasce por mero acaso ou apelo nostálgico. Ele é o resultado direto de uma das mais elegantes obras-primas de engenharia de game design da história: a criação de um ecossistema fundado no conforto, na previsibilidade e na física extremamente precisa.
                    </p>
                    <p>
                        Diferente de mundos caóticos e imprevisíveis, o Reino dos Cogumelos opera sob uma física impecável onde cada salto é estritamente calculado e totalmente confiável. O tempo em que o jogador segura o botão de pulo se traduz instantaneamente na altura exata da trajetória, e a aceleração responde com uma matemática confortável e justa. Não existem surpresas desleais; existe controle absoluto.
                    </p>
                    <p>
                        Essa resposta física perfeita gera uma sensação profundamente relaxante e satisfatória de domínio. Jogar Mario é entrar em um estado de fluxo ritmado, no qual a mente antecipa os obstáculos, calcula a distância dos blocos e pousa com precisão cirúrgica. É a arte do movimento transformada em uma experiência reconfortante, previsível e eternamente recompensadora.
                    </p>
                </div>
            </article>

            <!-- CARTÃO SONIC THE HEDGEHOG -->
            <article class="character-card sonic-theme" id="sonic-card">
                <div class="card-header">
                    <h2 class="card-title">SONIC</h2>
                    <span class="card-badge" style="color: var(--sonic-gold);">SEGA</span>
                </div>

                <div class="pixel-art-wrapper" id="sonic-interactive">
                    <div class="sonic-ring"></div>
                </div>

                <div class="story-text">
                    <p>
                        No polo oposto da filosofia de design dos anos 90, <span class="highlight-sonic">Sonic The Hedgehog</span> foi concebido como um manifesto de atitude, impulso e velocidade vertiginosa. A proposta da SEGA não focava na cadência metódica, mas sim na quebra de barreiras e no fluxo ininterrupto através de cenários vibrantes.
                    </p>
                    <p>
                        Substituindo a precisão previsível por uma física baseada na inércia e no momentum, o jogo desafia o jogador a dominar rampas, loops e molares em frações de segundo. O controle absoluto dá lugar à velocidade calculada, transformando a navegação em um teste de reflexo instantâneo e adrenalina pura.
                    </p>
                    <p>
                        Onde o encanador entrega o conforto da estabilidade calculada, o ouriço azul oferece a empolgação do risco e da reação imediata. São duas visões revolucionárias do gênero de plataforma que definiram a cultura dos videogames.
                    </p>
                </div>
            </article>
        </main>

        <!-- PAINEL INTERATIVO DE COMPARAÇÃO -->
        <section class="control-panel">
            <p class="panel-desc" id="panel-status">
                CLIQUE NOS BOTÕES PARA ALTERNAR O FOCO DE ANÁLISE DOS JOGOS
            </p>
            <div class="btn-group">
                <button class="arcade-btn btn-mario" id="btn-mario-focus">FOCO: PRECISÃO (MARIO)</button>
                <button class="arcade-btn btn-sonic" id="btn-sonic-focus">FOCO: VELOCIDADE (SONIC)</button>
                <button class="arcade-btn" id="btn-both-focus">VER AMBOS</button>
            </div>
        </section>

        <footer>
            <p>SUPER MARIO & SONIC ARE TRADEMARKS OF NINTENDO & SEGA</p>
            <p style="margin-top: 5px;">RETRO 8-BIT / 16-BIT EXPERIENCE • JAVASCRIPT EDITION</p>
        </footer>
    `;
}

/* ==========================================================================
   3. SINTETIZADOR DE SOM RETRÔ (SND CHIPTUNE VIA WEB AUDIO API)
   ========================================================================== */
let audioCtx = null;

function setupAudioContext() {
    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    };
    window.addEventListener('click', initAudio, { once: true });
}

function playRetroSound(type) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'mario-jump') {
        // Pulo estilo 8-bits
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === 'sonic-ring') {
        // Som de anel do Sonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'btn-click') {
        // Efeito de clique de botão arcade
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
    }
}

/* ==========================================================================
   4. INTERATIVIDADE E ALTERNÂNCIA DE FOCO
   ========================================================================== */
function setupInteractions() {
    const marioCard = document.getElementById('mario-card');
    const sonicCard = document.getElementById('sonic-card');
    const statusText = document.getElementById('panel-status');

    const btnMario = document.getElementById('btn-mario-focus');
    const btnSonic = document.getElementById('btn-sonic-focus');
    const btnBoth = document.getElementById('btn-both-focus');

    const marioBlock = document.getElementById('mario-interactive');
    const sonicRing = document.getElementById('sonic-interactive');

    // Foco Mario
    btnMario.addEventListener('click', () => {
        playRetroSound('mario-jump');
        marioCard.style.opacity = '1';
        marioCard.style.transform = 'scale(1.03)';
        sonicCard.style.opacity = '0.3';
        sonicCard.style.transform = 'scale(0.97)';
        statusText.innerText = 'MODO MARIO: FISICA PRECISA, PREVISIBILIDADE E DOMÍNIO CONFORTÁVEL.';
        statusText.style.color = 'var(--mario-yellow)';
    });

    // Foco Sonic
    btnSonic.addEventListener('click', () => {
        playRetroSound('sonic-ring');
        sonicCard.style.opacity = '1';
        sonicCard.style.transform = 'scale(1.03)';
        marioCard.style.opacity = '0.3';
        marioCard.style.transform = 'scale(0.97)';
        statusText.innerText = 'MODO SONIC: VELOCIDADE, INÉRCIA, MOMENTUM E REFLEXOS RÁPIDOS.';
        statusText.style.color = 'var(--sonic-gold)';
    });

    // Exibir Ambos
    btnBoth.addEventListener('click', () => {
        playRetroSound('btn-click');
        marioCard.style.opacity = '1';
        marioCard.style.transform = 'scale(1)';
        sonicCard.style.opacity = '1';
        sonicCard.style.transform = 'scale(1)';
        statusText.innerText = 'CLIQUE NOS BOTÕES PARA ALTERNAR O FOCO DE ANÁLISE DOS JOGOS';
        statusText.style.color = '#aaa';
    });

    // Cliques diretos nos ícones
    marioBlock.addEventListener('click', () => playRetroSound('mario-jump'));
    sonicRing.addEventListener('click', () => playRetroSound('sonic-ring'));
}

/* ==========================================================================
   5. PARTÍCULAS EM PIXEL EM SEGUNDO PLANO
   ========================================================================== */
function createPixelParticles() {
    const colors = ['#e52521', '#0000f5', '#fbd000', '#ffbe00', '#ffffff'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'pixel-particle';
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = `${5 + Math.random() * 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(particle);
    }
}
