const playerInitStatus = [
    /* índice [0]*/
    general = {
        name: "",
        attack: 10,
        defense: 10,
        health: 100,
        mana: 10
    },
    /* índice [1]*/
    equipment = [
        { nome: "armadura simples", descricao: "armadura de metal simples", tipo: "defesa", atributo: 3, icon: "" },
        { nome: "espada dupla simples", descricao: "espada dupla pesada de metal", tipo: "ataque", atributo: 5, icon: "" }
    ],
    /* índice [2]*/
    items = [
        { nome: "poção de hp", descricao: "cura 100 hp", quantidade: 3, icon: "" }
    ]

];

// verificando a existência de um player
if (localStorage.getItem('jogador')) {
    window.location.href = "/src/stages/forest_battle.html";
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
        setTimeout(() => { warningDiv.style.visibility = 'hidden' }, 2000);
    }

})