const game = {
    player: {
        visual: {
            avatar: document.getElementById('player')
        },
        value: {
            health: 50,
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
        button: document.getElementById('sort-number')
    }
};

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
        const supplies = document.createElement('span');
        supplies.classList.add('item');
        
    }
}

async function showAllElements(){
    // player & enemy sprites
    await showSprites();

    // player & enemy hp/atk
    await showStatus();

    // bag itens
    // await showSupplies(5);
    // setTimeout(showSprites, 3000);
}

function init(){
    showAllElements();
}

init();