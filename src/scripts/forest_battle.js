window.addEventListener("DOMContentLoaded", ready)

async function ready() {

    // verificando se o player não existe
    if (!localStorage.getItem('jogador')) {
        window.location.href = "/index.html";
    }

    // recebendo informações atualizadas do localStorage
    const infoPlayer = JSON.parse(localStorage.getItem('jogador'));

    //variáveis gerais
    

    // verificando o tipo da batalha
    let battleType;
    const currentPhase = JSON.parse(localStorage.getItem('fase'))
    currentPhase[0].name == "fase 1-4" ? battleType = "boss" : battleType = "normal";

    // escolhendo ação de acordo com o tipo de batalha
    let enemy;
    if (battleType == "normal") {
        await loadMonster();
    } else {
        await loadBoss();
    }

    document.getElementById('monster-name-container').textContent = enemy[0].name;


    // funções
    async function loadMonster(){

        try {
            const catchInfo = await fetch("/src/json/monsters/forest/forest-monsters.json");
            const response = await catchInfo.json();
            const monsters = response.monsters;
            const index = Math.floor(Math.random() * monsters.length)
            enemy = monsters[index];
        } catch (error) {
            console.error(error);
        }

    }

    async function loadBoss() {

        try {
            const catchInfo = await fetch("/src/json/monsters/forest/forest-monsters.json");
            const response = await catchInfo.json();
            const boss = response.boss[0];
            enemy = boss;
        } catch (error) {
            console.log(error);
        }

    }

}