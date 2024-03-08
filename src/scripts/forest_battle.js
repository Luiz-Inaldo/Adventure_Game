window.addEventListener("DOMContentLoaded", ready)

async function ready() {

    // verificando se o player não existe
    if (!localStorage.getItem('jogador')) {
        window.location.href = "/index.html";
    }

    // recebendo informações atualizadas do localStorage
    const infoPlayer = JSON.parse(localStorage.getItem('jogador'));

    //variáveis gerais
    const player = {
        name: document.getElementById('player-name-container'),
        img: document.getElementById('player-img'),
        health: document.getElementById('player-hp-points'),
        mana: document.getElementById('player-mp-points'),
        attack: document.getElementById('player-atk-points'),
        defense: document.getElementById('player-def-points'),
        level: document.querySelector('.player-level'),
        exp: document.querySelector('.player-exp'),
        gold: document.querySelector('.player-gold'),
        totalAttack: infoPlayer[0].attack + infoPlayer[1][0].attribute,
        totalMagicAttack: infoPlayer[0].attack + infoPlayer[1][0].attribute + infoPlayer[1][0].elementalAttribute,
        totalDefense: infoPlayer[0].defense + infoPlayer[1][1].attribute,
        totalMagicDefense: infoPlayer[0].defense + infoPlayer[1][1].attribute + infoPlayer[1][1].elementalAttribute,
    }
    const monster = {
        name: document.getElementById('monster-name-container'),
        img: document.getElementById('monster-img'),
        health: document.getElementById('monster-hp-points'),
        attack: document.getElementById('monster-atk-points'),
        defense: document.getElementById('monster-def-points')
    }
    const battleTexts = document.getElementById('battle-text');
    const playerBackpack = document.querySelector('.survival-itens');
    const playerSkills = document.querySelector('.skills');
    const attackButton = document.getElementById('atk-btn');

    // variáveis de som
    const sound = {
        battleSound: new Audio('/src/assets/audio/bgm/battle_theme.wav'),
        swordStab: new Audio('/src/assets/audio/sword_stab.wav'),
        enemyHit: new Audio('/src/assets/audio/enemy_hit.wav'),
        criticalHit: new Audio('/src/assets/audio/critical_hit.mp3'),
        drawSound: new Audio('/src/assets/audio/swords_draw.wav'),
        healing: new Audio('/src/assets/audio/healing.wav'),
        winSound: new Audio('/src/assets/audio/win.wav'),
        loseSound: new Audio('/src/assets/audio/lose.wav')
    }

    // verificando o tipo da batalha
    let battleType;
    const currentPhase = JSON.parse(localStorage.getItem('fase'))
    currentPhase[0].name == "fase 1-4" ? battleType = "boss" : battleType = "normal";

    // escolhendo ação de acordo com o tipo de batalha
    let enemy;
    if (battleType == "normal") {
        await loadMonster();
        document.querySelector('.encounter_text').innerHTML = `
            <p>Caminhando pela floresta, você encontrou um monstro. Derrote-o para prosseguir!</p>
        `
        sound.battleSound.play();
        sound.battleSound.loop = true;
    } else {
        await loadBoss();
        document.querySelector('.encounter_text').innerHTML = `
            <p>Depois de muito andar pela floresta (e de matar muitos monstros), você encontrou quem comandava o acampamento na floresta!</p>
        `
    }

    console.log(enemy, infoPlayer);

    // carregando informações visuais na tela
    Promise.all([
        await updateInfoPlayer(),
        await updateInfoEnemy(),
        await uploadPlayerItems(infoPlayer[2]),
        await uploadPlayerSkills(infoPlayer[3])
    ]);

    // funções de clique nos arrows (mochila e habilidades)
    document.querySelector(".bp-title").addEventListener('click', () => {
        document.querySelector(".survival-itens").classList.toggle("show")
        document.getElementById('arrow-icon-1').classList.toggle("clicked")
    });

    document.querySelector(".skills-title").addEventListener('click', () => {
        document.querySelector(".skills").classList.toggle("show")
        document.getElementById('arrow-icon-2').classList.toggle("clicked")

    });

    // capturando o tipo do ataque do player (elemental)
    const playerAttackType = infoPlayer[1][0].element;

    // definindo o ataque total do player mediante fraqueza/resistência do monstro
    if (playerAttackType == "fisico") {
        if (playerAttackType == enemy[0].weakTo) {
            player.totalAttack *= 2;
        } else if (playerAttackType == enemy[0].strongTo) {
            player.totalAttack /= 2;
        } else if (playerAttackType == enemy[0].immuneTo) {
            player.totalAttack = 1;
        }
    } else {
        if (playerAttackType == enemy[0].weakTo) {
            player.totalMagicAttack *= 2;
        } else if (playerAttackType == enemy[0].strongTo) {
            player.totalMagicAttack /= 2;
        } else if (playerAttackType == enemy[0].immuneTo) {
            player.totalMagicAttack = 1;
        }
    }

    // evento de clique no botão de ataque
    attackButton.addEventListener('click', initiateTurn);






    // funções
    async function loadMonster() {

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

    async function updateInfoPlayer() {

        player.name.textContent = infoPlayer[0].name;
        player.img.innerHTML = `
            <img src="/src/assets/img/player/player.png">
        `;
        player.health.textContent = infoPlayer[0].health;
        player.mana.textContent = infoPlayer[0].mana;
        player.attack.textContent = parseInt(infoPlayer[0].attack + infoPlayer[1][0].attribute);
        player.defense.textContent = parseInt(infoPlayer[0].defense + infoPlayer[1][1].attribute);
        player.level.textContent = `Level: ${infoPlayer[0].level}`;
        player.exp.textContent = `Exp: ${infoPlayer[0].exp}`;
        player.gold.textContent = `Gold: ${infoPlayer[0].gold}`;

    }

    async function updateInfoEnemy() {

        monster.name.textContent = enemy[0].name;
        monster.img.innerHTML = `
            <img src="${enemy[0].sprite}">
        `;
        monster.health.textContent = enemy[0].health;
        monster.attack.textContent = enemy[0].attack;
        monster.defense.textContent = enemy[0].defense;

    }

    async function uploadPlayerItems(items) {

        for (const item of items) {
            if (item.type === "suporte") {

                playerBackpack.innerHTML += `
                
                    <div class="item">
                        <img src="${item.icon}" alt="potion" class="item-icon">
                        <span class="item-description">${item.name} (+${item.attribute})</span>
                        <span class="item-quantity">x ${item.quantity}</span>
                    </div>
    
                `

            }
        }

    }

    async function uploadPlayerSkills(skills) {

        for (const skill of skills) {

            if (skill.status == "normal") {
                playerSkills.innerHTML += `
                
                    <div class="skill">
                        <img src="${skill.icon}" alt="atk-skill" class="skill-icon">
                        <span class="skill-description">${skill.name} | + ${skill.damage}</span>
                        <span class="skill-mana-requer">mp ${skill.mpCost}</span>
                    </div>
                
                `
            } else {
                playerSkills.innerHTML += `
                
                    <div class="skill">
                        <img src="${skill.icon}" alt="atk-skill" class="skill-icon">
                        <span class="skill-description">${skill.name} | + ${skill.damage} (${skill.status})</span>
                        <span class="skill-mana-requer">mp ${skill.mpCost}</span>
                    </div>
                
                `
            }

        }

    }

    async function initiateTurn() {

        attackButton.style.visibility = 'hidden';

        // variáveis das provavéis ações
        const playerCritNumber = Math.floor(Math.random() * 5);
        const enemyEvadeNumber = Math.floor(Math.random() * 6);
        console.log(playerCritNumber, enemyEvadeNumber);
        battleTexts.innerHTML = `Você atacou!`;

        // variáveis de fórmulas
        const normalAttackFormula = infoPlayer[0].level + ((player.totalAttack * 2) - (enemy[0].defense * 2));
        const magicAttackFormula = infoPlayer[0].level + player.totalAttack + ((player.totalMagicAttack * 2) - (enemy[0].magicDefense * 2));
        const criticalAttackFormula = Math.round(normalAttackFormula * 1.5);
        const criticalMagicFormula = Math.round(magicAttackFormula * 1.5);

        if (enemyEvadeNumber === 3 && playerCritNumber !== 3) {
            battleTexts.innerHTML += ` O inimigo se esquivou do ataque!`;
            setTimeout(enemyTurn, 1000);
        } else if (playerCritNumber === 3 && enemyEvadeNumber !== 3) {

            sound.criticalHit.play();

            if (playerAttackType == "fisico") {
                enemy[0].health -= criticalAttackFormula;
                battleTexts.innerHTML += ` O seu dano foi crítico! você desferiu ${criticalAttackFormula} de dano!`;
            } else {
                enemy[0].health -= criticalMagicFormula;
                battleTexts.innerHTML += ` O seu dano foi crítico! você desferiu ${criticalMagicFormula} de dano!`;
            }

            monster.health.classList.add('damaged');
            setTimeout(() => { monster.health.classList.remove('damaged') }, 300);
            await updateInfoEnemy();

            if (enemy[0].health <= 0) {
                monster.health.textContent = "0";
                // await winBattle();
            }

            setTimeout(enemyTurn, 1000);

        } else {

            sound.swordStab.play();

            if (playerAttackType == "fisico") {
                enemy[0].health -= normalAttackFormula;
                battleTexts.innerHTML += ` Você desferiu ${normalAttackFormula} de dano!`;
            } else {
                enemy[0].health -= magicAttackFormulaAttackFormula;
                battleTexts.innerHTML += ` Você desferiu ${magicAttackFormula} de dano!`;
            }

            monster.health.classList.add('damaged');
            setTimeout(() => { monster.health.classList.remove('damaged') }, 300);
            await updateInfoEnemy();

            if (enemy[0].health <= 0) {
                monster.health.textContent = "0";
                // await winBattle();
            }

            setTimeout(enemyTurn, 1000);

        }

        setTimeout(() => { attackButton.style.visibility = 'visible' }, 2000)

    }

    async function enemyTurn() {

        // variáveis de prováveis chances (ataque ou habilidade)
        let enemyAttackType;
        const enemyRandomNumber = Math.floor(Math.random() * 10);
        enemyRandomNumber >= 0 && enemyRandomNumber <= 7
            ? enemyAttackType = "normal" : enemyAttackType = "skill";

        if (enemyAttackType == "normal") {

            // variáveis das provavéis chances
            const enemyCritNumber = Math.floor(Math.random() * 5);
            const playerEvadeNumber = Math.floor(Math.random() * 6);
            console.log(enemyCritNumber, playerEvadeNumber);
            battleTexts.innerHTML = `O inimigo atacou!`;

            // variáveis de fórmulas
            const normalAttackFormula = (enemy[0].attack * 2) - (player.totalDefense * 2);
            const criticalAttackFormula = Math.round(normalAttackFormula * 1.5);

            if (playerEvadeNumber === 3 && enemyCritNumber !== 3) {
                battleTexts.innerHTML += ` Você desviou do ataque!`;
            } else if (enemyCritNumber === 3 && playerEvadeNumber !== 3) {

                sound.enemyHit.play();
                infoPlayer[0].health -= criticalAttackFormula;
                battleTexts.innerHTML += ` Você recebeu ${normalAttackFormula} de dano!`;
                player.health.classList.add('damaged');
                setTimeout(() => { player.health.classList.remove('damaged') }, 300);
                await updateInfoPlayer();

            }

        } else {

        }



    }

}