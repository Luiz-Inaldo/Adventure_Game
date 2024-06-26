const game = {
    player: {
        visual: {
            avatar: document.getElementById('player')
        },
        value: {
            maxHealth: 100,
            health: 100,
            attack: 10
        },
        status: {
            health: document.getElementById('player-hp-points'),
            attack: document.getElementById('player-atk-points')
        }
    },
    enemy: {
        visual: {
            avatar: document.getElementById('monster'),
        },
        value: {
            health: 200,
            attack: 10
        },
        status: {
            health: document.getElementById('monster-hp-points'),
            attack: document.getElementById('monster-atk-points')
        }
    },
    action: {
        button: document.getElementById('next-battle'),
        attack: document.getElementById('sort-number'),
        playerNumber: document.getElementById('player-number'),
        enemyNumber: document.getElementById('monster-number'),
        damage: document.getElementById('damage'),
        playerHP: document.getElementById('player-hp'),
        enemyHP: document.getElementById('monster-hp'),
        heal: document.getElementById('player-hp'),
    },
    screen: {
        gameOver: document.querySelector('.game-over')
    }
};

let playerInfoContainer;
playerInfoContainer = JSON.parse(localStorage.getItem('jogador'))
console.log(playerInfoContainer);

const itemSpanNumber = [0, 1, 2, 3, 4];

const swordStab = new Audio('/src/assets/audio/sword_stab.wav');
const enemyHit = new Audio('/src/assets/audio/enemy_hit.wav');
const criticalHit = new Audio('/src/assets/audio/critical_hit.mp3');
const drawSound = new Audio('/src/assets/audio/swords_draw.wav');
const healing = new Audio('/src/assets/audio/healing.wav');
const winSound = new Audio('/src/assets/audio/win.wav');
const loseSound = new Audio('/src/assets/audio/lose.wav');

async function showSprites() {
    // game.player.visual.avatar.src = "/src/assets/img/player/Warrior.png";
    game.enemy.visual.avatar.src = "/src/assets/img/monsters/ormruc.png";
}

async function showStatus() {
    game.player.status.health.innerHTML = game.player.value.health;
    game.player.status.attack.innerHTML = game.player.value.attack;

    game.enemy.status.health.innerHTML = game.enemy.value.health;
    game.enemy.status.attack.innerHTML = game.enemy.value.attack;
}

async function showSupplies(supNumber) {
    for (let i = 0; i < supNumber; i++) {

        const itemSpan = document.createElement('span');
        itemSpan.classList.add(`item-slot${itemSpanNumber[i]}`);
        itemSpan.setAttribute('id', 'slot');

        const icon = document.createElement('img');
        icon.setAttribute('src', '../assets/img/pocao.png');
        icon.classList.add('item-img');

        const description = document.createElement('span');
        description.classList.add('item-description');
        description.innerHTML = "Poção: Cura 100% HP";

        document.querySelector('.survival-itens').appendChild(itemSpan);
        document.querySelector(`.item-slot${itemSpanNumber[i]}`).appendChild(icon);
        document.querySelector(`.item-slot${itemSpanNumber[i]}`).appendChild(description);

    }
}

async function clickAttack() {

    game.action.attack.addEventListener('click', () => {

        setTimeout(turnPlayer, 500);

        setTimeout(turnEnemy, 2000);

        setTimeout(() => { game.action.attack.disabled = false; }, 4000);

    })
}

function turnPlayer() {

    // refreshMessageLog();
    game.action.attack.disabled = true;

    const criticalNumberPlayer = Math.floor(Math.random() * 5);
    const evadeNumberEnemy = Math.floor(Math.random() * 5);
    game.action.playerNumber.innerText = 'Você atacou!';
    console.log('player number recebeu um texto!')

    if (evadeNumberEnemy === 3) {

        drawSound.play();
        game.action.enemyNumber.innerText = 'O inimigo se esquivou do seu ataque';
        game.action.damage.style.display = 'none';

    } else if (criticalNumberPlayer === 3) {

        criticalHit.play();
        game.action.enemyNumber.style.display = 'block';
        game.action.enemyNumber.innerText = `Você desferiu ${game.player.value.attack * 2} de dano!`;
        game.action.damage.style.display = 'block';
        game.action.damage.innerHTML = 'Golpe Crítico!';
        game.action.enemyHP.classList.add('damaged');
        game.enemy.value.health -= game.player.value.attack * 2;
        game.enemy.status.health.textContent = game.enemy.value.health;

        if (game.enemy.value.health <= 0) {

            game.enemy.status.health.textContent = '0';
            game.action.attack.style.display = "none";
            game.action.playerNumber.style.display = "none";
            game.action.enemyNumber.innerText = "Você venceu! E ficou um pouco mais forte!";
            game.action.damage.innerText = "Hp + 50 | Atk + 5";
            winSound.play();
            setTimeout(displayNextButton, 6000);

        }
        setTimeout(() => { game.action.enemyHP.classList.remove('damaged'); }, 300);
    } else {

        swordStab.play();
        game.action.enemyNumber.style.display = 'block';
        game.action.enemyNumber.innerText = `Você desferiu ${game.player.value.attack} de dano!`;
        game.action.damage.style.display = 'none';
        game.action.enemyHP.classList.add('damaged');
        game.enemy.value.health -= game.player.value.attack;
        game.enemy.status.health.textContent = game.enemy.value.health;

        if (game.enemy.value.health <= 0) {

            game.enemy.status.health.textContent = '0';
            game.action.attack.style.display = "none";
            game.action.playerNumber.style.display = "none";
            game.action.enemyNumber.innerText = "Você venceu! E ficou um pouco mais forte!";
            game.action.damage.innerText = "Hp + 50 | Atk + 5";
            winSound.play();
            setTimeout(displayNextButton, 6000);

        }

    }


    setTimeout(() => { game.action.enemyHP.classList.remove('damaged'); }, 300);

}

function turnEnemy() {

    const criticalNumberEnemy = Math.floor(Math.random() * 5);
    const evadeNumberPlayer = Math.floor(Math.random() * 5);
    game.action.playerNumber.innerText = 'Você recebeu um ataque!';

    if (evadeNumberPlayer === 3) {

        drawSound.play();
        game.action.enemyNumber.innerText = 'Você se esquivou do ataque!';
        game.action.damage.style.display = 'none';

    } else if (criticalNumberEnemy === 3) {

        criticalHit.play();
        game.action.enemyNumber.style.display = 'block';
        game.action.enemyNumber.innerText = `Você recebeu ${game.enemy.value.attack * 2} de dano!`;
        game.action.damage.style.display = 'block';
        game.action.damage.innerHTML = 'Golpe Crítico!';
        game.action.playerHP.classList.add('damaged');
        game.player.value.health -= game.enemy.value.attack * 2;
        game.player.status.health.textContent = game.player.value.health;

        if (game.player.value.health <= 0) {

            game.player.status.health.textContent = '0';
            game.action.attack.style.display = "none";
            game.action.playerNumber.style.display = "none";
            game.action.enemyNumber.innerText = "Oh Não! Você MORREU!";
            game.action.damage.style.display = "none";
            loseSound.play();
            setTimeout(displayGameOver, 2000);

        }

        setTimeout(() => { game.action.playerHP.classList.remove('damaged'); }, 300);
    } else {

        enemyHit.play();
        game.action.enemyNumber.style.display = 'block';
        game.action.enemyNumber.innerHTML = `Você recebeu ${game.enemy.value.attack} de dano!`;
        game.action.damage.style.display = 'none';
        game.action.playerHP.classList.add('damaged');
        game.player.value.health -= game.enemy.value.attack;
        game.player.status.health.textContent = game.player.value.health;

        if (game.player.value.health <= 0) {

            game.player.status.health.textContent = '0';
            game.action.attack.style.display = "none";
            game.action.playerNumber.style.display = "none";
            game.action.enemyNumber.innerText = "Oh Não! Você MORREU!";
            game.action.damage.style.display = "none";
            loseSound.play();
            setTimeout(displayGameOver, 2000);

        }

    }


    setTimeout(() => { game.action.playerHP.classList.remove('damaged'); }, 300);

}

async function recoverHealthPoints(potions) {

    for (let i = 0; i < potions; i++) {
        const slotBox = document.querySelector(`.item-slot${itemSpanNumber[i]}`);
        slotBox.addEventListener('click', () => {

            if (game.player.value.health < game.player.value.maxHealth) {

                healing.play();
                game.action.heal.classList.add('healed');
                game.player.value.health = game.player.value.maxHealth;
                game.player.status.health.innerHTML = game.player.value.health;
                game.action.playerNumber.innerText = "Você usou uma poção!";
                game.action.enemyNumber.style.display = "none";
                game.action.damage.style.display = 'none';
                setTimeout(() => { game.action.heal.classList.remove('healed'); }, 300);

                slotBox.remove();

            }
        });
    }
}

function refreshMessageLog() {
    game.action.enemyNumber.style.display = 'block';
    game.action.damage.style.display = 'block';
    game.action.playerNumber.innerText = "Pressione o botão ATACAR.";
    game.action.enemyNumber.innerText = "Compare os números.";
    game.action.damage.innerText = "Ataque ou seja atacado!";
}

function displayNextButton() {
    game.action.button.style.display = "block";
}

function displayGameOver() {
    game.screen.gameOver.style.display = "flex";
}

async function engageAllElements() {
    // player & enemy sprites
    await showSprites();

    // player & enemy hp/atk
    await showStatus();

    // bag itens
    // await showSupplies(5);

    // attack
    await clickAttack();

    // recoverHP
    await recoverHealthPoints(5);

}

function init() {

    engageAllElements();
}

init();

// teste de div
document.querySelector(".bp-title").addEventListener('click', () => {
    document.querySelector(".survival-itens").classList.toggle("show")
    document.getElementById('arrow-icon-1').classList.toggle("clicked")
})

document.querySelector(".skills-title").addEventListener('click', () => {
    document.querySelector(".skills").classList.toggle("show")
    document.getElementById('arrow-icon-2').classList.toggle("clicked")

})
