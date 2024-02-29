window.addEventListener("DOMContentLoaded", ready)

async function ready() {

    // verificando se o player não existe
    if (!localStorage.getItem('jogador')) {
        window.location.href = "/index.html";
    }
    
    // variáveis gerais
    const status = {
        name: document.getElementById('player-name'),
        level: document.getElementById('player-level'),
        exp: document.getElementById('player-exp'),
        nextLevel: document.getElementById('next-level-exp'),
        health: document.getElementById('player-health'),
        mana: document.getElementById('player-mana'),
        atk: document.getElementById('player-attack'),
        def: document.getElementById('player-defense'),
        matk: document.getElementById('player-mattack'),
        mdef: document.getElementById('player-mdefense'),
        gold: document.getElementById('player-cash')
    }
    
    // recebendo informações atualizadas do localStorage
    const infoPlayer = JSON.parse(localStorage.getItem('jogador'));
    console.log(infoPlayer);
    
    // atribuindo valores na tela
    await refreshStatusValues();

    async function refreshStatusValues() {

        status.name.innerHTML = `nome: ${infoPlayer[0].name}`;
        status.level.innerHTML = `level: ${infoPlayer[0].level}`;
        status.exp.innerHTML = `exp: ${infoPlayer[0].exp}`;
        status.nextLevel.innerHTML = `next: ${infoPlayer[0].next - infoPlayer[0].exp}`;
        status.health.innerHTML = `health: ${infoPlayer[0].health}`;
        status.mana.innerHTML = `health: ${infoPlayer[0].mana}`;
        status.atk.innerHTML = `attack: ${infoPlayer[0].attack} + ${infoPlayer[1][0].atributo}`;
        status.def.innerHTML = `defense: ${infoPlayer[0].defense} + ${infoPlayer[1][1].atributo}`;
        status.matk.innerHTML = `mattack: ${infoPlayer[0].magicAttack}`;
        status.mdef.innerHTML = `mdefense: ${infoPlayer[0].magicDefense}`;
        status.gold.innerHTML = `gold: ${infoPlayer[0].gold}`

    }

}
