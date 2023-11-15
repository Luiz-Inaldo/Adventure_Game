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
    },
    screen: {
        gameOver: document.querySelector('.game-over')
    }
};

const itemSpanNumber = [0, 1, 2, 3, 4];

async function showSprites(){
    game.player.visual.avatar.src = "../assets/img/guerreiro.png";
    game.enemy.visual.avatar.src = "../assets/img/orc.png";
}

async function showStatus(){
    game.player.status.health.innerHTML = game.player.value.health;
    game.player.status.attack.innerHTML = game.player.value.attack;

    game.enemy.status.health.innerHTML = game.enemy.value.health;
    game.enemy.status.attack.innerHTML = game.enemy.value.attack;
}

async function showSupplies(supNumber){
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

async function clickAttack(){
    game.action.attack.addEventListener('click', () => {
        const randomPlayerNumber = Math.floor(Math.random()*11);
        const randomEnemyNumber = Math.floor(Math.random()*11);

        game.action.playerNumber.innerText = `Seu número foi ${randomPlayerNumber}!`;
        game.action.enemyNumber.innerText = `O número do oponente foi ${randomEnemyNumber}!`;

        if (randomPlayerNumber > randomEnemyNumber){
            game.action.damage.innerHTML = `Você desferiu ${game.player.value.attack} de dano!`;
            game.enemy.value.health -= game.player.value.attack;
            game.enemy.status.health.textContent = game.enemy.value.health;
            if (game.enemy.value.health <= 0){
                game.action.attack.style.display = "none";
                game.action.playerNumber.style.display = "none";
                game.action.enemyNumber.innerText = "Você venceu! E ficou um pouco mais forte!";
                game.action.damage.innerText = "Hp + 50 | Atk + 5";
                setTimeout(displayNextButton, 1000);
            }
            console.log(game.enemy.value.health);
        } else if (randomPlayerNumber < randomEnemyNumber){
            game.action.damage.innerHTML = `Você recebeu ${game.enemy.value.attack} de dano!`;
            game.player.value.health -= game.enemy.value.attack;
            game.player.status.health.textContent = game.player.value.health;
            if (game.player.value.health <= 0){
                game.action.attack.style.display = "none";
                game.action.playerNumber.style.display = "none";
                game.action.enemyNumber.innerText = "Oh Não! Você MORREU!";
                game.action.damage.style.display = "none";
                setTimeout(displayGameOver, 2000);
            }
        } else {
            game.action.damage.innerHTML = `Suas armas se batem! Não houve dano!`;
        }
    })
}

async function recoverHealthPoints(potions){

    for (let i = 0; i < potions; i++) {
        const slotBox = document.querySelector(`.item-slot${itemSpanNumber[i]}`);
        slotBox.addEventListener('click', () => {
            game.player.value.health = game.player.value.maxHealth;
            game.player.status.health.innerHTML = game.player.value.health;
            slotBox.remove();
        });
    }
}

function displayNextButton(){
    game.action.button.style.display = "block";
}

function displayGameOver(){
    game.screen.gameOver.style.display = "flex";
}

async function engageAllElements(){
    // player & enemy sprites
    await showSprites();

    // player & enemy hp/atk
    await showStatus();

    // bag itens
    await showSupplies(5);
    
    // attack
    await clickAttack();

    // recoverHP
    await recoverHealthPoints(5);

    // results
    await fightResult();
}

function init(){
    engageAllElements();
}

init();