// informações básicas do jogador
import playerInitStatus from "./playerInitConfig.js";

// verificando a existência de um player
if (localStorage.getItem('jogador')) {
    window.location.href = "/roadmap.html";
}


// capturando informações do jogador
const playerNameInput = document.getElementById('player-name');
playerNameInput.addEventListener('blur', () => {
    playerInitStatus[0].name = playerNameInput.value;
    console.log(playerInitStatus[0].name);
})


//enviando informações para o localStorage
const initButton = document.getElementById('init-btn');
initButton.addEventListener('click', () => {

    if (playerNameInput.value.trim() !== "" && playerInitStatus.name !== "") {

        localStorage.setItem('jogador', JSON.stringify(playerInitStatus));
        window.location.href = "/roadmap.html";

    } else {
        const warningDiv = document.getElementById('error-warning');
        warningDiv.style.visibility = 'visible';
        warningDiv.innerHTML = `
            <div id="name-fault-error" class="rpgui-container framed-golden-2">
                <i class="far fa-hand-paper"></i>
                <p>Nobre guerreiro, antes de continuar precisamos saber seu nome!</p>
            </div>
        `;
        setTimeout(() => { warningDiv.style.visibility = 'hidden' }, 2000);
    }

})