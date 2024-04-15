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
        formula: (a, b, i, e) => {
            let damage = (a.attack + 10) * i
            b.health -= damage
            let message = `Desferido ${damage} de dano físico.`;
            if (e) {
                message += ` Desferido ${e} de dano elemental`
            }
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

console.log(skills[0].formula(player, enemy, 1));
