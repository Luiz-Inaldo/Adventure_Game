const player = {
    attack: 10,
    defense: 11,
    for: 5,
    agi: 4
}

const enemy = {
    name: "teste",
    health: 40,
    defense: 10
}

let battleText = `Usou habilidade.`

const skills = [
    {
        name: "teste2",
        description: "ataca o inimigo e diminui 1 na rolagem até errar",
        type: "ataque",
        formula: (a, b, i) => {
            let damage = (a.attack + 10) * i
            b.health -= damage
            let message = `Desferido ${damage} de dano.`;
            return message;
        },
    }
]

// for (const skill of skills) {

//     skill.formula(player, enemy);

//     if (enemy.health <= 0) {
//         console.log("inimigo morreu");
//     }

// }

const str = "function legal() { return console.log('olá')}"

console.log(JSON.parse(str))
