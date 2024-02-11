const playerInitStatus = {
        name: "",
        attack: 10,
        defense: 10,
        health: 100,
        mana: 10,
};

//reiniciando o localStorage
localStorage.clear();


// capturando informações do jogador
const playerNameInput = document.getElementById('player-name');
playerNameInput.addEventListener('blur', () => {
    playerInitStatus.name = playerNameInput.value;
    console.log(playerInitStatus.name);
})


//enviando informações para o localStorage
const initButton = document.getElementById('init-btn');
initButton.addEventListener('click', () => {

    if (playerNameInput.value.trim() !== "" && playerInitStatus.name !== ""){

        localStorage.setItem('jogador', JSON.stringify(playerInitStatus));
        window.location.href = "/src/stages/forest_battle.html";

    } else {
        const warningDiv = document.getElementById('error-warning');
        warningDiv.style.visibility = 'visible';
        warningDiv.innerHTML = `
            <div id="name-fault-error" class="rpgui-container framed-golden-2">
                <i class="far fa-hand-paper"></i>
                <p>Nobre guerreiro, antes de continuar precisamos saber seu nome!</p>
            </div>
        `;
        setTimeout(() => {warningDiv.style.visibility = 'hidden'}, 2000);
    }

})