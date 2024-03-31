const player = {
    attack: 10
}

const skill = {
    name: "teste",
    description: "ataque base + 30% adicional",
    formula: (player, enemy) => {
        let damage = player.attack + (player.attack * 0.3)
        return damage
    }
}

console.log(skill.formula(player));