// ==========================================================================
// MARIO VS SONIC - SCRIPT.JS (LÓGICA DO MINI-JOGO)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Selecionando os personagens e elementos do painel
    const mario = document.getElementById('player-mario');
    const sonic = document.getElementById('player-sonic');
    const statusText = document.getElementById('game-status');

    // Selecionando os botões de controle
    const btnMario = document.getElementById('btn-jump-mario');
    const btnSonic = document.getElementById('btn-dash-sonic');
    const btnReset = document.getElementById('btn-reset');

    // Variáveis de controle de estado
    let isMarioJumping = false;

    // Lógica do Mario: Pulo de física precisa e controlada
    btnMario.addEventListener('click', () => {
        if (isMarioJumping) return; // Impede duplo clique enquanto pula
        
        isMarioJumping = true;
        statusText.innerText = "MARIO: PULO DE FÍSICA PRECISA E CONTROLADA!";
        
        let jumpHeight = 0;
        
        // Intervalo de subida (simulando controle preciso no ar)
        const upInterval = setInterval(() => {
            if (jumpHeight >= 90) {
                clearInterval(upInterval);
                
                // Intervalo de descida (gravidade constante)
                const downInterval = setInterval(() => {
                    if (jumpHeight <= 0) {
                        clearInterval(downInterval);
                        isMarioJumping = false; // Aterrissagem milimétrica concluída
                    } else {
                        jumpHeight -= 6;
                        mario.style.bottom = `calc(25% + ${jumpHeight}px)`;
                    }
                }, 16);
            } else {
                jumpHeight += 6;
                mario.style.bottom = `calc(25% + ${jumpHeight}px)`;
            }
        }, 16); // ~60 frames por segundo
    });

    // Lógica do Sonic: Corrida rápida com aceleração e momentum
    btnSonic.addEventListener('click', () => {
        statusText.innerText = "SONIC: VELOCIDADE E INÉRCIA RETRÔ!";
        
        let currentLeft = parseInt(window.getComputedStyle(sonic).left);
        let speed = 0;
        
        // Intervalo de corrida acelerada
        const dashInterval = setInterval(() => {
            speed += 2; // Ganhando momentum a cada frame
            currentLeft += speed;
            sonic.style.left = `${currentLeft}px`;
            
            // Se passar do limite da tela, reseta a posição inicial do Sonic
            if (currentLeft > 750) {
                clearInterval(dashInterval);
                sonic.style.left = '180px';
            }
        }, 20);
    });

    // Resetar posições manualmente
    btnReset.addEventListener('click', () => {
        mario.style.bottom = '25%';
        mario.style.left = '80px';
        
        sonic.style.left = '180px';
        
        statusText.innerText = "POSIÇÕES RESETADAS! TESTE NOVAMENTE.";
    });
});
      

    
    
       
         
       
   
