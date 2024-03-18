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
        totalMagicAttack: infoPlayer[0].magicAttack + infoPlayer[1][0].elementalAttribute,
        totalDefense: infoPlayer[0].defense + infoPlayer[1][1].attribute,
        totalMagicDefense: infoPlayer[0].magicDefense + infoPlayer[1][1].elementalAttribute,
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
    const endBattleButton = document.getElementById('end-battle');
    const battleContainer = document.querySelector('.container-battle');

    // variáveis de som
    const sound = {
        battleSound: new Audio('/src/assets/audio/bgm/battle_theme.wav'),
        bossbattleSound: new Audio('/src/assets/audio/bgm/boss-theme.mp3'),
        swordStab: new Audio('/src/assets/audio/sword_stab.wav'),
        enemyHit: new Audio('/src/assets/audio/enemy_hit.wav'),
        criticalHit: new Audio('/src/assets/audio/critical_hit.mp3'),
        miss: new Audio('/src/assets/audio/miss.wav'),
        healing: new Audio('/src/assets/audio/healing.wav'),
        winSound: new Audio('/src/assets/audio/win.wav'),
        loseSound: new Audio('/src/assets/audio/lose.wav'),
        error: new Audio('/src/assets/audio/error.wav')
    }

    // verificando o tipo da batalha
    let battleType;
    const currentPhase = JSON.parse(localStorage.getItem('fase'))
    currentPhase[0].name == "fase 1-4" ? battleType = "boss" : battleType = "normal";

    // escolhendo ação de acordo com o tipo de batalha
    let enemy;
    let freezeLock = false;
    let enemyAlive = true;
    let playerAlive = true;
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
        sound.bossbattleSound.play();
        sound.bossbattleSound.loop = true;
    }

    console.log(enemy, infoPlayer, currentPhase[0].name);

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

    // evento de clique no botão de voltar ao mapa (final da batalha)
    endBattleButton.addEventListener('click', () => {
        localStorage.setItem('jogador', JSON.stringify(infoPlayer));
        window.location.href = '/roadmap.html';
    })

    // evento de clique no botão de suprimentos
    playerBackpack.addEventListener('click', async (e) => {
        const button = e.target;
        if (button.classList.contains('use-supply')) {
            const itemId = parseInt(button.id);
            await useSupply(itemId);
        }
    });

    // evento de clique de habilidade
    const skill = document.querySelectorAll('.skill');
    skill.forEach(sk => {
        sk.addEventListener('click', async () => {
            const separator = sk.querySelector('.skill-description').textContent
                .split("+")[0]
            const skillName = separator.slice(0, separator.length - 1);
            const skillToUse = infoPlayer[3].find(skill => skill.name === skillName);
            console.log(skillToUse);
            await useSkill(skillToUse);
        })
    });






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
        player.exp.textContent = `Exp: ${infoPlayer[0].exp}/${infoPlayer[0].next}`;
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

        playerBackpack.innerHTML = "";

        for (const item of items) {
            if (item.type === "suporte" && item.quantity > 0) {

                playerBackpack.innerHTML += `
                
                    <div class="item">
                        <img src="${item.icon}" alt="potion" class="item-icon">
                        <span class="item-description">${item.name} (+${item.attribute})</span>
                        <span class="item-quantity">x ${item.quantity}</span>
                        <button id="${item.id}" class="use-supply rpgui-button">usar</button>
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
                        <span class="skill-description">${skill.name} + ${skill.damage * 100}%</span>
                        <span class="skill-mana-requer">mp ${skill.mpCost}</span>
                    </div>
                
                `
            } else {
                playerSkills.innerHTML += `
                
                    <div class="skill">
                        <img src="${skill.icon}" alt="atk-skill" class="skill-icon">
                        <span class="skill-description">${skill.name} + ${skill.damage * 100}% (${skill.status})</span>
                        <span class="skill-mana-requer">mp ${skill.mpCost}</span>
                    </div>
                
                `
            }

        }

    }

    async function initiateTurn() {

        freezeLock = true;
        attackButton.style.visibility = 'hidden';

        // variáveis das provavéis ações
        const playerCritNumber = Math.floor(Math.random() * 5);
        const enemyEvadeNumber = Math.floor(Math.random() * 6);

        battleTexts.innerHTML = `Você atacou!`;

        // variáveis de fórmulas
        const normalAttackFormula = Math.round(infoPlayer[0].level + ((player.totalAttack * 1.5) - enemy[0].defense));
        const magicAttackFormula = Math.round(infoPlayer[0].level + infoPlayer[0].attack + ((player.totalMagicAttack * 1.5) - enemy[0].magicDefense));
        const criticalAttackFormula = Math.round(normalAttackFormula * 1.5);
        const criticalMagicFormula = Math.round(magicAttackFormula * 1.5);

        if (enemyEvadeNumber === 3 && playerCritNumber !== 3 || normalAttackFormula <= 0) {
            battleTexts.innerHTML += ` O inimigo se esquivou do ataque!`;
            sound.miss.play();
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
                enemyAlive = false;
                await winBattle();
            }

            if (enemyAlive) {
                setTimeout(enemyTurn, 1000);
            }

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
                enemyAlive = false;
                await winBattle();
            }

            if (enemyAlive) {
                setTimeout(enemyTurn, 1000);
            }

        }

        if (enemyAlive && playerAlive) {
            setTimeout(() => { attackButton.style.visibility = 'visible'; freezeLock = false; }, 2000);
            console.log("passou");
        }

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

            battleTexts.innerHTML = `O inimigo atacou!`;

            // variáveis de fórmulas
            const normalAttackFormula = Math.round((enemy[0].attack * 1.5) - player.totalDefense);
            const criticalAttackFormula = Math.round(normalAttackFormula * 1.5);

            if (playerEvadeNumber === 3 && enemyCritNumber !== 3 || normalAttackFormula <= 0) {
                battleTexts.innerHTML += ` Você desviou do ataque!`;
                sound.miss.play();
            } else if (enemyCritNumber === 3 && playerEvadeNumber !== 3) {

                sound.criticalHit.play();
                infoPlayer[0].health -= criticalAttackFormula;
                battleTexts.innerHTML += ` Golpe crítico! Você recebeu ${criticalAttackFormula} de dano!`;
                player.health.classList.add('damaged');
                setTimeout(() => { player.health.classList.remove('damaged') }, 300);
                await updateInfoPlayer();

                if (infoPlayer[0].health <= 0) {
                    player.health.textContent = "0";
                    infoPlayer[0].health = 0;
                    playerAlive = false;
                    await loseBattle();
                }

            } else {

                sound.enemyHit.play();
                infoPlayer[0].health -= normalAttackFormula;
                battleTexts.innerHTML += ` Você recebeu ${normalAttackFormula} de dano!`;
                player.health.classList.add('damaged');
                setTimeout(() => { player.health.classList.remove('damaged') }, 300);
                await updateInfoPlayer();

                if (infoPlayer[0].health <= 0) {
                    player.health.textContent = "0";
                    infoPlayer[0].health = 0;
                    playerAlive = false;
                    await loseBattle();
                }

            }

        } else {

            // variáveis para escolher uma habilidade aleatória
            const randomSkillIndex = Math.floor(Math.random() * enemy[2].length);
            const skillSpelled = enemy[2][randomSkillIndex];

            // variáveis de fórmula
            const normalSkillFormula = Math.round((enemy[0].attack * 1.5) + (enemy[0].attack * skillSpelled.damage) - player.totalDefense);
            const magicSkillFormula = Math.round((enemy[0].magicAttack * 1.5) + (enemy[0].magicAttack * skillSpelled.damage) - player.totalMagicDefense);
            const critNormalSkillFormula = Math.round(normalSkillFormula * 1.5);
            const critMagicSkillFormula = Math.round(magicSkillFormula * 1.5);
            console.log(`normalskdamage: ${normalSkillFormula}`, `magicskformula: ${magicSkillFormula}`);


            // variáveis de prováveis chances de crítico
            const enemySkillCriticalChance = Math.floor(Math.random() * 8);

            battleTexts.innerHTML = `O inimigo usou a habilidade ${skillSpelled.name}!`;

            if (enemySkillCriticalChance === 4 && critNormalSkillFormula > 0 || enemySkillCriticalChance === 4 && critMagicSkillFormula > 0) {

                sound.criticalHit.play();
                if (skillSpelled.element == "fisico") {
                    infoPlayer[0].health -= critNormalSkillFormula;
                    battleTexts.innerHTML += ` Dano critico! Você recebeu ${critNormalSkillFormula} de dano!`;
                } else {
                    infoPlayer[0].health -= critMagicSkillFormula;
                    battleTexts.innerHTML += ` Dano critico! Você recebeu ${critMagicSkillFormula} de dano!`;
                }
                player.health.classList.add('damaged');
                setTimeout(() => { player.health.classList.remove('damaged') }, 300);
                await updateInfoPlayer();

                if (infoPlayer[0].health <= 0) {
                    player.health.textContent = "0";
                    infoPlayer[0].health = 0;
                    playerAlive = false;
                    await loseBattle();
                }

                if (skillSpelled.status == 'stun') {
                    await enemyTurn();
                }


            } else if (normalSkillFormula > 0 || magicSkillFormula > 0) {

                sound.enemyHit.play();
                if (skillSpelled.element == "fisico") {
                    infoPlayer[0].health -= normalSkillFormula;
                    battleTexts.innerHTML += ` Você recebeu ${normalSkillFormula} de dano!`;
                } else {
                    infoPlayer[0].health -= magicSkillFormula;
                    battleTexts.innerHTML += ` Você recebeu ${magicSkillFormula} de dano!`;
                }
                player.health.classList.add('damaged');
                setTimeout(() => { player.health.classList.remove('damaged') }, 300);
                await updateInfoPlayer();

                if (infoPlayer[0].health <= 0) {
                    player.health.textContent = "0";
                    infoPlayer[0].health = 0;
                    playerAlive = false;
                    await loseBattle();
                }

                if (skillSpelled.status == 'stun') {
                    await enemyTurn();
                }

            } else {
                sound.miss.play();
                battleTexts.innerHTML += ` Você desviou da habilidade!`;
            }

        }

    }

    async function useSupply(itemId) {

        if (!freezeLock) {

            freezeLock = true;
            attackButton.style.visibility = 'hidden';
            const index = infoPlayer[2].findIndex(item => item.id === itemId);
            const healType = infoPlayer[2][index].name.split("de ")[1];

            if (healType === "hp") {

                if (infoPlayer[0].health < infoPlayer[0].maxHealth) {

                    infoPlayer[2][index].quantity--;
                    infoPlayer[0].health += infoPlayer[2][index].attribute;

                    if (infoPlayer[0].health >= infoPlayer[0].maxHealth) {

                        infoPlayer[0].health = infoPlayer[0].maxHealth;

                    }

                    sound.healing.play();
                    player.health.classList.add('healed');
                    setTimeout(() => { player.health.classList.remove('healed') }, 300);
                    await uploadPlayerItems(infoPlayer[2]);
                    await updateInfoPlayer();
                    setTimeout(enemyTurn, 1000);

                }

            } else if (healType === "mp") {

                if (infoPlayer[0].mana < infoPlayer[0].maxMana) {

                    infoPlayer[2][index].quantity--
                    infoPlayer[0].mana += infoPlayer[2][index].attribute;

                    if (infoPlayer[0].mana > infoPlayer[0].maxMana) {
                        infoPlayer[0].mana = infoPlayer[0].maxMana;
                    }

                    sound.healing.play();
                    player.mana.classList.add('healed');
                    setTimeout(() => { player.mana.classList.remove('healed') }, 300);
                    await uploadPlayerItems(infoPlayer[2]);
                    await updateInfoPlayer();
                    setTimeout(enemyTurn, 1000);

                }

            }
            setTimeout(() => {
                freezeLock = false;
                attackButton.style.visibility = 'visible';
            }, 1000);

        }

    }

    async function useSkill(skill) {

        if (!freezeLock) {

            freezeLock = true;
            attackButton.style.visibility = 'hidden';

            // variáveis de possíveis ações
            const skillCriticalNumber = Math.floor(Math.random() * 8);

            // variáveis de fórmulas
            const normalSkillFormula = Math.round(infoPlayer[0].level + (player.totalAttack * 1.5) + (player.totalAttack * skill.damage) - enemy[0].defense);
            const criticalSkillFormula = Math.round(normalSkillFormula * 1.5);
            const magicSkillFormula = Math.round(infoPlayer[0].level + (player.totalMagicAttack * 1.5) + (player.totalMagicAttack * skill.damage) - enemy[0].magicDefense);
            const critMagicSkillFormula = Math.round(magicSkillFormula * 1.5);
            console.log(normalSkillFormula, criticalSkillFormula);

            if (infoPlayer[0].mana >= skill.mpCost) {

                battleTexts.innerHTML = `Você usou a habilidade ${skill.name}!`

                skill.element = playerAttackType;

                if (skill.element == "fisico") {

                    if (skillCriticalNumber === 4) {

                        sound.criticalHit.play();
                        enemy[0].health -= criticalSkillFormula;
                        infoPlayer[0].mana -= skill.mpCost;
                        battleTexts.innerHTML += ` Você desferiu ${criticalSkillFormula} de dano!`
                        monster.health.classList.add('damaged');
                        setTimeout(() => { monster.health.classList.remove('damaged') }, 300);
                        await updateInfoEnemy();
                        await updateInfoPlayer();
                        if (enemy[0].health <= 0) {
                            monster.health.textContent = "0";
                            await winBattle();
                            enemyAlive = false;
                        }

                        if (enemyAlive && skill.status != "stun") {
                            setTimeout(enemyTurn, 1000);
                        }

                    } else {

                        sound.swordStab.play();
                        enemy[0].health -= normalSkillFormula;
                        infoPlayer[0].mana -= skill.mpCost;
                        battleTexts.innerHTML += ` Você desferiu ${normalSkillFormula} de dano!`
                        monster.health.classList.add('damaged');
                        setTimeout(() => { monster.health.classList.remove('damaged') }, 300);
                        await updateInfoEnemy();
                        await updateInfoPlayer();
                        if (enemy[0].health <= 0) {
                            monster.health.textContent = "0";
                            await winBattle();
                            enemyAlive = false;
                        }

                        if (enemyAlive && skill.status != "stun") {
                            setTimeout(enemyTurn, 1000);
                        }

                    }

                } else {

                    if (skillCriticalNumber === 4) {

                        sound.criticalHit.play();
                        enemy[0].health -= critMagicSkillFormula;
                        infoPlayer[0].mana -= skill.mpCost;
                        battleTexts.innerHTML += ` Você desferiu ${critMagicSkillFormula} de dano! (${skill.element})`
                        monster.health.classList.add('damaged');
                        setTimeout(() => { monster.health.classList.remove('damaged') }, 300);
                        await updateInfoEnemy();
                        await updateInfoPlayer();
                        if (enemy[0].health <= 0) {
                            monster.health.textContent = "0";
                            await winBattle();
                            enemyAlive = false;
                        }

                        if (enemyAlive && skill.status != "stun") {
                            setTimeout(enemyTurn, 1000);
                        }

                    } else {

                        sound.swordStab.play();
                        enemy[0].health -= magicSkillFormula;
                        infoPlayer[0].mana -= skill.mpCost;
                        battleTexts.innerHTML += ` Você desferiu ${magicSkillFormula} de dano! (${skill.element})`
                        monster.health.classList.add('damaged');
                        setTimeout(() => { monster.health.classList.remove('damaged') }, 300);
                        await updateInfoEnemy();
                        await updateInfoPlayer();
                        if (enemy[0].health <= 0) {
                            monster.health.textContent = "0";
                            await winBattle();
                            enemyAlive = false;
                        }

                        if (enemyAlive && skill.status != "stun") {
                            setTimeout(enemyTurn, 1000);
                        }

                    }

                }

                if (enemyAlive) {
                    setTimeout(() => { attackButton.style.visibility = 'visible' }, 2000);
                }

            } else {

                battleTexts.innerHTML = `Você não tem mana suficiente!`
                sound.error.play();

            }
            setTimeout(() => freezeLock = false, 1000);

        }


    }

    async function loseBattle() {
        
        freezeLock = true;
        sound.loseSound.play();
        if (battleType == 'normal') {
            sound.battleSound.pause();  
        } else {
            sound.bossbattleSound.pause();
        }
        setTimeout(() => {
            battleTexts.innerHTML = `Essa não! Você morreu...`;
            attackButton.style.visibility = 'hidden';
        }, 2000);

        setTimeout(() => {
            battleContainer.innerHTML += `
            
                <div class="game-over rpgui-container framed">
                    <span class="game-over-title">☠️GAME OVER☠️</span>
                    <div class="game-over-paragraph rpgui-container framed-grey">
                        <p>A esperança do reino foi perdida!
                        O jogo será reiniciado em breve...</p>
                    </div>
                </div>
            
            `
        }, 6000);

        setTimeout(() => {
            window.location.href = "/index.html"
        }, 10000);

        /* apenas para versão beta */
        localStorage.clear();

    }

    async function winBattle() {

        freezeLock = true;
        if (battleType == "normal") {
            sound.battleSound.pause();
        } else {
            sound.bossbattleSound.pause();
        }
        attackButton.style.visibility = 'hidden';
        sound.winSound.play();
        const goldReceived = Math.round(Math.random() * 30);
        infoPlayer[0].gold += goldReceived;
        battleTexts.innerHTML = `Você derrotou o monstro! E recebeu ${goldReceived} de dinheiro.`
        await calculateExp();
        await getLoot(enemy[1]);
        await setConcluded();
        setTimeout(() => endBattleButton.style.visibility = 'visible', 6000)

    }

    async function calculateExp() {
        battleTexts.innerHTML += `Você ganhou ${enemy[0].exp} de experiência!`;
        infoPlayer[0].exp += enemy[0].exp;
        while (infoPlayer[0].exp > infoPlayer[0].next) {

            infoPlayer[0].level++;
            await levelUp(infoPlayer[0]);
            battleTexts.innerHTML += `Você subiu para o nível ${infoPlayer[0].level}!`;
            infoPlayer[0].next += Math.round(infoPlayer[0].next * 2);
            // await addPlayerSkill();

        }
        await updateInfoPlayer();
    }

    async function levelUp(player) {

        player.maxHealth += 10;
        player.health = player.maxHealth;
        player.maxMana += 2;
        player.mana = player.maxMana;
        player.attack++;
        player.defense++;
        player.magicAttack++;
        player.magicDefense++;

    }

    async function getLoot(loots) {

        const lootNumber = Math.floor(Math.random() * 100);
        let looted = false;
        let itemLooted;

        loots.forEach(item => {
            if (lootNumber >= item.chance[0] && lootNumber <= item.chance[1]) {
                setTimeout(() => battleTexts.innerHTML += ` Obteve ${item.name}.`, 1000);
                itemLooted = item;
                looted = true;
            }
        });

        let checkItemMatch = false;

        if (looted) {
            for (const item of infoPlayer[2]) {
                if (item.name === itemLooted.name && item.type === 'suporte') {
                    item.quantity++
                    checkItemMatch = true;
                    return
                }
            }

            if (!checkItemMatch) {
                infoPlayer[2].push(itemLooted);
            }
        }


    }

    async function setConcluded() {

        const faseName = currentPhase[0].name;

        if (faseName == "fase 1-1" && infoPlayer[0].concluded == 0) {
            infoPlayer[0].concluded++;
        } else if (faseName == "fase 1-2" && infoPlayer[0].concluded == 1) {
            infoPlayer[0].concluded++;
        } else if (faseName == "fase 1-3" && infoPlayer[0].concluded == 2) {
            infoPlayer[0].concluded++;
        } else if (faseName == "fase 1-4" && infoPlayer[0].concluded == 3) {
            infoPlayer[0].concluded++;
        }
        console.log(faseName, infoPlayer[0].concluded);

    }

}