import { enemies } from "./monsters/forest-monsters.js";
import { skills } from "./skills.js";
import { sound } from "./sounds.js";

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
        totalAttack: infoPlayer[1][0].attribute,
        totalMagicAttack: infoPlayer[1][0].elementalAttribute,
        totalDefense: infoPlayer[0].for + infoPlayer[0].agi + infoPlayer[1][1].attribute,
        totalMagicDefense: infoPlayer[0].int + infoPlayer[0].agi + infoPlayer[1][1].elementalAttribute,
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

    // verificando o tipo da batalha
    let battleType;
    const currentPhase = JSON.parse(localStorage.getItem('fase'))
    currentPhase[0].name == "fase 1-4" ? battleType = "boss" : battleType = "normal";

    let enemy;
    let freezeLock = false;
    let enemyAlive = true;
    let playerAlive = true;
    let leveled;
    infoPlayer[0].attack = player.totalAttack

    // escolhendo ação de acordo com o tipo de batalha
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
        console.log(leveled);
        if (leveled) {
            window.location.href = '/market.html';
        } else {
            window.location.href = '/roadmap.html';
        }

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
            const skillName = sk.querySelector('.skill-description').textContent
            const skillToUse = skills.find(skill => skill.name === skillName);
            console.log(skillToUse);
            await useSkill(skillToUse);
        })
    });






    // funções
    async function loadMonster() {

        const monsters = enemies.monsters;
        const index = Math.floor(Math.random() * monsters.length)
        enemy = monsters[index];

    }

    async function loadBoss() {

        const boss = enemies.boss[0];
        enemy = boss;

    }

    async function updateInfoPlayer() {

        player.name.textContent = infoPlayer[0].name;
        player.img.innerHTML = `
            <img src="/src/assets/img/player/player.png">
        `;
        player.health.textContent = infoPlayer[0].health;
        player.mana.textContent = infoPlayer[0].mana;
        player.attack.textContent = parseInt(infoPlayer[1][0].attribute);
        player.defense.textContent = parseInt(infoPlayer[0].for + infoPlayer[0].agi + infoPlayer[1][1].attribute);
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

            playerSkills.innerHTML += `
                
                    <div class="skill">
                        <img src="${skill.icon}" alt="atk-skill" class="skill-icon">
                        <span class="skill-description">${skill.name}</span>
                        <span class="skill-mana-requer">mp ${skill.mpCost}</span>
                    </div>
                
                `

        }

    }

    async function animatedDamage(target) {

        if (target == monster) {

            target.health.classList.add('damaged');
            await updateInfoEnemy();
            await sleep(300);
            target.health.classList.remove('damaged');
            clearTimeout(sleep);

        } else {

            target.health.classList.add('damaged');
            await updateInfoPlayer();
            await sleep(300)
            target.health.classList.remove('damaged');
            clearTimeout(sleep);

        }


    }

    async function animatedHealing(target) {



    }

    async function initiateTurn() {

        freezeLock = true;
        attackButton.style.visibility = 'hidden';

        // variáveis do "rolamento do dado" e do dano
        const randomNumber = Math.floor(Math.random() * 12);
        const damage = player.totalAttack;
        const elementalDamage = player.totalMagicAttack;

        battleTexts.innerHTML = `Você atacou!`;

        if (randomNumber == 12) {

            sound.criticalHit.play();

            if (playerAttackType == "fisico") {
                enemy[0].health -= damage * 2
                battleTexts.innerHTML += ` O seu dano foi crítico! você desferiu ${damage * 2} de dano!`;
            } else {
                enemy[0].health -= (damage * 2) + (elementalDamage * 2);
                battleTexts.innerHTML += ` O seu dano foi crítico! você desferiu ${damage * 2} de dano físico e ${elementalDamage * 2} de dano mágico!`;
            }

            await animatedDamage(monster)

            if (enemy[0].health <= 0) {
                monster.health.textContent = "0";
                enemyAlive = false;
                await winBattle();
            }

            if (enemyAlive) {
                await sleep(1000)
                await enemyTurn();
                clearTimeout(sleep);
            }

        } else if (randomNumber + infoPlayer[0].for > enemy[0].defense) {

            sound.hit1.play();

            if (playerAttackType == "fisico") {
                enemy[0].health -= damage;
                battleTexts.innerHTML += ` Você desferiu ${damage} de dano!`;
            } else {
                enemy[0].health -= damage + elementalDamage;
                battleTexts.innerHTML += ` Você desferiu ${damage} de dano físico e ${elementalDamage} de dano mágico!`;
            }

            await animatedDamage(monster)

            if (enemy[0].health <= 0) {
                monster.health.textContent = "0";
                enemyAlive = false;
                await winBattle();
            }

            if (enemyAlive) {
                await sleep(1000)
                await enemyTurn();
                clearTimeout(sleep);
            }

        } else {
            battleTexts.innerHTML += ` O inimigo se esquivou do ataque!`;
            sound.miss.play();
            await sleep(1000);
            await enemyTurn();
            clearTimeout(sleep);
        }

        await sleep(1000);
        if (enemyAlive && playerAlive) {
            attackButton.style.visibility = 'visible';
            freezeLock = false;
        }
        clearTimeout(sleep);

    }

    async function enemyTurn() {

        // variáveis de prováveis chances (ataque ou habilidade)
        let enemyAttackType;
        const randomNumber = Math.floor(Math.random() * 12)
        const enemyActionNumber = Math.floor(Math.random() * 10);
        enemyActionNumber >= 0 && enemyActionNumber <= 7
            ? enemyAttackType = "normal" : enemyAttackType = "skill";

        if (enemyAttackType == "normal") {

            const damage = enemy[0].attack;
            battleTexts.innerHTML = `O inimigo atacou!`;

            if (randomNumber == 12) {

                sound.criticalHit.play();
                infoPlayer[0].health -= damage * 2;
                battleTexts.innerHTML += ` Golpe crítico! Você recebeu ${damage * 2} de dano!`;

                await animatedDamage(player)

                if (infoPlayer[0].health <= 0) {
                    player.health.textContent = "0";
                    infoPlayer[0].health = 0;
                    playerAlive = false;
                    await loseBattle();
                }

            } else if (randomNumber + enemy[0].for > player.totalDefense) {

                sound.hit2.play();
                infoPlayer[0].health -= damage;
                battleTexts.innerHTML += ` Você recebeu ${damage} de dano!`;

                await animatedDamage(player)

                if (infoPlayer[0].health <= 0) {
                    player.health.textContent = "0";
                    infoPlayer[0].health = 0;
                    playerAlive = false;
                    await loseBattle();
                }

            } else {
                battleTexts.innerHTML += ` Você desviou do ataque!`;
                sound.miss.play();
            }

        } else {

            // variáveis para escolher uma habilidade aleatória
            const randomSkillIndex = Math.floor(Math.random() * enemy[2].length);
            const skill = enemy[2][randomSkillIndex];

            battleTexts.innerHTML = `O inimigo usou a habilidade ${skill.name}!`;

            if (randomNumber > 2) {

                let increase = 1;

                if (skill.element == "fisico") {
                    if (randomNumber == 12 && skill.type != 'suporte') {
                        increase = 2;
                        let result = skill.formula(enemy[0], infoPlayer[0], increase);
                        battleTexts.innerHTML += ` ${result}. Golpe critico!`;
                        sound.criticalHit.play();
                    } else if (randomNumber + enemy[0].for > player.totalDefense) {
                        let result = skill.formula(enemy[0], infoPlayer[0], increase);
                        battleTexts.innerHTML += ` ${result}`;
                        if (skill.type == 'suporte') {
                            await updateInfoEnemy();
                            return
                        }
                    } else {
                        battleTexts.innerHTML += ` O inimigo errou a habilidade.`
                        sound.miss.play();
                        return
                    }
                } else if (skill.element == infoPlayer[1][1].strongTo) {
                    if (randomNumber == 12 && skill.type != suporte) {
                        let result = skill.formula(enemy[0], infoPlayer[0], increase);
                        battleTexts.innerHTML += ` ${result}. Golpe critico!`;
                        sound.criticalHit.play();
                    } else if (randomNumber + enemy[0].for > player.totalMagicDefense) {
                        increase = 0.5;
                        let result = skill.formula(enemy[0], infoPlayer[0], increase);
                        battleTexts.innerHTML += ` ${result}`;
                        if (skill.type == 'suporte') {
                            await updateInfoEnemy();
                            return
                        }
                    } else {
                        battleTexts.innerHTML += ` O inimigo errou a habilidade.`
                        sound.miss.play();
                        return
                    }
                } else if (skill.element == infoPlayer[1][1].weakTo) {
                    if (randomNumber == 12 && skill.type != suporte) {
                        increase = 4
                        let result = skill.formula(enemy[0], infoPlayer[0], increase);
                        battleTexts.innerHTML += ` ${result}. Golpe critico!`;
                        sound.criticalHit.play();
                    } else if (randomNumber + enemy[0].for > player.totalMagicDefense) {
                        increase = 2;
                        let result = skill.formula(enemy[0], infoPlayer[0], increase);
                        battleTexts.innerHTML += ` ${result}`;
                        if (skill.type == 'suporte') {
                            await updateInfoEnemy();
                            return
                        }
                    } else {
                        battleTexts.innerHTML += ` O inimigo errou a habilidade.`
                        sound.miss.play();
                        return
                    }
                }

                await animatedDamage(player)

                if (infoPlayer[0].health <= 0) {
                    player.health.textContent = "0";
                    infoPlayer[0].health = 0;
                    playerAlive = false;
                    await loseBattle();
                }

                if (skill.status == 'stun' && playerAlive) {
                    await sleep(500)
                    await enemyTurn();
                    clearTimeout(sleep);
                }


            } else {
                sound.miss.play();
                battleTexts.innerHTML += ` Inimigo errou a habilidade!`;
            }

        }

    }

    async function useSupply(itemId) {

        if (!freezeLock) {

            freezeLock = true;
            const index = infoPlayer[2].findIndex(item => item.id === itemId);
            const healType = infoPlayer[2][index].name.split("de ")[1];

            if (healType === "hp") {

                if (infoPlayer[0].health < infoPlayer[0].maxHealth) {

                    attackButton.style.visibility = 'hidden';
                    infoPlayer[2][index].quantity--;
                    infoPlayer[0].health += infoPlayer[2][index].attribute;

                    if (infoPlayer[0].health >= infoPlayer[0].maxHealth) {

                        infoPlayer[0].health = infoPlayer[0].maxHealth;

                    }

                    sound.healing.play();
                    player.health.classList.add('healed');
                    await uploadPlayerItems(infoPlayer[2]);
                    await updateInfoPlayer();
                    await sleep(300);
                    player.health.classList.remove('healed');
                    await sleep(1000);
                    await enemyTurn();
                    clearTimeout(sleep);

                }

            } else if (healType === "mp") {

                if (infoPlayer[0].mana < infoPlayer[0].maxMana) {

                    attackButton.style.visibility = 'hidden';
                    infoPlayer[2][index].quantity--
                    infoPlayer[0].mana += infoPlayer[2][index].attribute;

                    if (infoPlayer[0].mana > infoPlayer[0].maxMana) {
                        infoPlayer[0].mana = infoPlayer[0].maxMana;
                    }

                    sound.healing.play();
                    player.mana.classList.add('healed');
                    await uploadPlayerItems(infoPlayer[2]);
                    await updateInfoPlayer();
                    await sleep(300);
                    player.mana.classList.remove('healed');
                    await sleep(1000);
                    await enemyTurn();
                    clearTimeout(sleep);

                }

            }
            await sleep(1000);
            freezeLock = false;
            attackButton.style.visibility = 'visible';
            clearTimeout(sleep);

        }

    }

    async function useSkill(skill) {

        if (!freezeLock) {

            freezeLock = true;
            let skillStrike;
            attackButton.style.visibility = 'hidden';

            // variáveis de "rolamento de dado"
            const randomNumber = Math.floor(Math.random() * 12);
            let increase = 1;

            // verificando se o player tem mana suficiente pra usar a habilidade
            if (infoPlayer[0].mana >= skill.mpCost) {

                battleTexts.innerHTML = `Você usou a habilidade ${skill.name}!`

                if (skill.type == 'suporte') {

                    let result = skill.formula(infoPlayer[0], enemy[0], increase);
                    battleTexts.innerHTML += ` ${result}`
                    infoPlayer[0].mana -= skill.mpCost;
                    await updateInfoPlayer();

                } else if (playerAttackType == "fisico") {

                    if (randomNumber == 12) {
                        increase = 2;
                        let result = skill.formula(infoPlayer[0], enemy[0], increase);
                        battleTexts.innerHTML += ` ${result}. Dano crítico.`
                        sound.criticalHit.play();
                        infoPlayer[0].mana -= skill.mpCost;
                        skillStrike = true;
                        await animatedDamage(monster)
                    } else if (randomNumber + infoPlayer[0].for > enemy[0].defense) {
                        let result = skill.formula(infoPlayer[0], enemy[0], increase);
                        battleTexts.innerHTML += ` ${result}`
                        infoPlayer[0].mana -= skill.mpCost;
                        skillStrike = true;
                        await animatedDamage(monster)
                    } else {
                        battleTexts.innerHTML += ` Você errou a habilidade.`
                        sound.miss.play();
                    }

                } else if (playerAttackType == enemy[0].weakTo) {
                    if (randomNumber == 12) {
                        increase = 2;
                        let result = skill.formula(infoPlayer[0], enemy[0], increase, (player.totalMagicAttack * 2))
                        battleTexts.innerHTML += ` ${result}. Dano crítico.`
                        sound.criticalHit.play();
                        infoPlayer[0].mana -= skill.mpCost;
                        skillStrike = true;
                        await animatedDamage(monster)
                    } else if (randomNumber + infoPlayer[0].for > enemy[0].defense) {
                        let result = skill.formula(infoPlayer[0], enemy[0], increase, player.totalMagicAttack)
                        battleTexts.innerHTML += ` ${result}`
                        infoPlayer[0].mana -= skill.mpCost;
                        skillStrike = true;
                        await animatedDamage(monster)
                    } else {
                        battleTexts.innerHTML += ` Você errou a habilidade.`
                        sound.miss.play();
                    }

                } else {
                    if (randomNumber == 12) {
                        increase = 2;
                        let result = skill.formula(infoPlayer[0], enemy[0], increase, (player.totalMagicAttack * 2))
                        battleTexts.innerHTML += ` ${result}. Dano crítico.`
                        sound.criticalHit.play();
                        infoPlayer[0].mana -= skill.mpCost;
                        skillStrike = true;
                        await animatedDamage(monster)
                    } else if (randomNumber + infoPlayer[0].for > enemy[0].defense) {
                        let result = skill.formula(infoPlayer[0], enemy[0], increase, player.totalMagicAttack)
                        battleTexts.innerHTML += ` ${result}`
                        infoPlayer[0].mana -= skill.mpCost;
                        skillStrike = true;
                        await animatedDamage(monster)
                    } else {
                        battleTexts.innerHTML += ` Você errou a habilidade.`
                        sound.miss.play();
                    }

                }

                // verificando se a skill possui algum efeito de incapacitação
                let incapacitate;
                if (skillStrike && skill.status == 'stun') {
                    incapacitate = true;
                }

                // atualizando as informações visuais do player
                await updateInfoPlayer();

                if (enemy[0].health <= 0) {
                    monster.health.textContent = "0";
                    await winBattle();
                    enemyAlive = false;
                }

                if (enemyAlive && !incapacitate) {
                    await sleep(2000)
                    await enemyTurn();
                    clearTimeout(sleep);
                }

                if (enemyAlive) {
                    await sleep(1000);
                    attackButton.style.visibility = 'visible';
                    clearTimeout(sleep);
                }

            } else {

                battleTexts.innerHTML = `Você não tem mana suficiente!`
                sound.error.play();
                await sleep(1000);
                attackButton.style.visibility = 'visible';
                clearTimeout(sleep);

            }

            await sleep(1000);
            freezeLock = false;
            clearTimeout(sleep);

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
            leveled = true;
            battleTexts.innerHTML += `Você subiu para o nível ${infoPlayer[0].level}!`;
            infoPlayer[0].next += Math.round(infoPlayer[0].next * 2);

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

    //função responsável por esperar um tempo até uma ação ocorrer
    async function sleep(miliseconds) {
        return new Promise(res => setTimeout(res, miliseconds))
    }

}