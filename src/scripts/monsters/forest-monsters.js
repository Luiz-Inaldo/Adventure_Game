import { sound } from "../sounds.js";


export const enemies = {

    monsters: [

        [
            {
                name: "goblin",
                health: 20,
                maxHealth: 20,
                for: 2,
                agi: 4,
                int: 3,
                von: 2,
                attack: 6,
                defense: 9,
                magicAttack: 0,
                magicDefense: 0,
                exp: 4,
                weakTo: "fogo",
                strongTo: "terra",
                immuneTo: "none",
                sprite: "/src/assets/img/monsters/goblin-battler.png"
            },
            [
                {
                    id: 20,
                    name: "poção de hp",
                    type: "suporte",
                    description: "+ 30 hp",
                    attribute: 30,
                    value: 50,
                    cumulative: true,
                    quantity: 1,
                    icon: "/src/assets/img/icons/potions/hp-potion.png",
                    avaliable: true,
                    equippable: false,
                    chance: [0, 10]
                }
            ],
            [
                {
                    name: "investida mortal",
                    level: 1,
                    type: "ataque",
                    element: "fisico",
                    description: "ataque base + 10 dano adicional",
                    formula: (a, b, i) => {
                        let damage = (a.attack + 10) * i
                        b.health -= damage
                        let message = `Desferido ${damage} de dano.`;
                        sound.hit1.play();
                        return message;
                    },
                    mpCost: 10,
                    status: "normal",
                    icon: "/src/assets/img/icons/skills/skill-sword-1.png",
                }
            ]
        ],

        [
            {
                name: "goblin guerr.",
                health: 30,
                maxHealth: 30,
                for: 3,
                agi: 4,
                int: 3,
                von: 2,
                attack: 8,
                defense: 10,
                magicAttack: 0,
                magicDefense: 0,
                exp: 6,
                weakTo: "fogo",
                strongTo: "terra",
                immuneTo: "none",
                sprite: "/src/assets/img/monsters/goblin-warrior-battler.png"
            },
            [
                {
                    id: 20,
                    name: "poção de hp",
                    type: "suporte",
                    description: "+ 30 hp",
                    attribute: 30,
                    value: 50,
                    cumulative: true,
                    quantity: 1,
                    icon: "/src/assets/img/icons/potions/hp-potion.png",
                    avaliable: true,
                    equippable: false,
                    chance: [0, 10]
                },
                {
                    id: 9,
                    name: "espada longa simples",
                    description: "espada simples e frágil",
                    type: "ataque",
                    element: "fisico",
                    attribute: 8,
                    elementalAttribute: 0,
                    value: 50,
                    weight: 2,
                    cumulative: false,
                    icon: "/src/assets/img/icons/weapons/cheap-longsword.png",
                    avaliable: true,
                    equippable: true,
                    chance: [11, 19]
                }
            ],
            [
                {
                    name: "investida mortal",
                    level: 1,
                    type: "ataque",
                    element: "fisico",
                    description: "ataque base + 10 dano adicional",
                    formula: (a, b, i) => {
                        let damage = (a.attack + 10) * i
                        b.health -= damage
                        let message = `Desferido ${damage} de dano.`;
                        sound.hit1.play();
                        return message;
                    },
                    mpCost: 10,
                    status: "normal",
                    icon: "/src/assets/img/icons/skills/skill-sword-1.png",
                }
            ]
        ],

        [
            {
                name: "goblin sold.",
                health: 40,
                maxHealth: 40,
                for: 4,
                agi: 5,
                int: 3,
                von: 3,
                attack: 10,
                defense: 10,
                magicAttack: 0,
                magicDefense: 0,
                exp: 8,
                weakTo: "fogo",
                strongTo: "terra",
                immuneTo: "none",
                sprite: "/src/assets/img/monsters/goblin-soldier-battler.png"
            },
            [
                {
                    id: 20,
                    name: "poção de hp",
                    type: "suporte",
                    description: "+ 30 hp",
                    attribute: 30,
                    value: 50,
                    cumulative: true,
                    quantity: 1,
                    icon: "/src/assets/img/icons/potions/hp-potion.png",
                    avaliable: true,
                    equippable: false,
                    chance: [0, 10]
                },
                {
                    id: 21,
                    name: "poção de mp",
                    type: "suporte",
                    description: "+ 30 mp",
                    attribute: 30,
                    value: 50,
                    cumulative: true,
                    quantity: 1,
                    icon: "/src/assets/img/icons/potions/mp-potion.png",
                    avaliable: true,
                    equippable: false,
                    chance: [15, 25]
                },
                {
                    id: 9,
                    name: "espada longa simples",
                    description: "espada simples frágil",
                    type: "ataque",
                    element: "fisico",
                    attribute: 8,
                    elementalAttribute: 0,
                    value: 50,
                    weight: 2,
                    cumulative: false,
                    icon: "/src/assets/img/icons/weapons/cheap-longsword.png",
                    avaliable: true,
                    equippable: true,
                    chance: [86, 100]
                }
            ],
            [
                {
                    name: "grito de guerra",
                    level: 1,
                    type: "suporte",
                    element: "fisico",
                    description: "+ 1 de ataque físico por toda a batalha",
                    formula: (a) => { 
                        a.attack += 1
                        let message = `O ataque aumentou em 1`;
                        sound.warcry.play();
                        return message
                    },
                    mpCost: 20,
                    status: "none",
                    icon: "/src/assets/img/icons/skills/skill-sword-1.png",
                }
            ]
        ],

        [
            {
                name: "goblin rider",
                health: 30,
                maxHealth: 30,
                for: 3,
                agi: 6,
                int: 3,
                von: 2,
                attack: 12,
                defense: 9,
                magicAttack: 0,
                magicDefense: 0,
                exp: 6,
                weakTo: "fogo",
                strongTo: "terra",
                immuneTo: "none",
                sprite: "/src/assets/img/monsters/goblin-rider-battler.png"
            },
            [
                {
                    id: 20,
                    name: "poção de hp",
                    type: "suporte",
                    description: "+ 30 hp",
                    attribute: 30,
                    value: 50,
                    cumulative: true,
                    quantity: 1,
                    icon: "/src/assets/img/icons/potions/hp-potion.png",
                    avaliable: true,
                    equippable: false,
                    chance: [1, 5]
                },
                {
                    id: 21,
                    name: "poção de mp",
                    type: "suporte",
                    description: "+ 30 mp",
                    attribute: 30,
                    value: 50,
                    cumulative: true,
                    quantity: 1,
                    icon: "/src/assets/img/icons/potions/mp-potion.png",
                    avaliable: true,
                    equippable: false,
                    chance: [12, 25]
                },
                {
                    id: 10,
                    name: "espada longa de ferro",
                    description: "espada pesada de ferro",
                    type: "ataque",
                    element: "fisico",
                    attribute: 10,
                    elementalAttribute: 0,
                    value: 150,
                    cumulative: false,
                    icon: "/src/assets/img/icons/weapons/iron-longsword.png",
                    avaliable: true,
                    equippable: true,
                    chance: [87, 100]
                }
            ],
            [
                {
                    name: "investida mortal",
                    level: 1,
                    type: "ataque",
                    element: "fisico",
                    description: "ataque base + 10 dano adicional",
                    formula: (a, b, i) => {
                        let damage = (a.attack + 10) * i
                        b.health -= damage
                        let message = `Desferido ${damage} de dano.`;
                        sound.hit1.play();
                        return message;
                    },
                    mpCost: 10,
                    status: "normal",
                    icon: "/src/assets/img/icons/skills/skill-sword-1.png",
                }
            ]
        ]

    ],

    boss: [
        [
            {
                name: "Ormruc",
                health: 120,
                maxHealth: 120,
                for: 7,
                agi: 4,
                int: 3,
                von: 3,
                attack: 15,
                defense: 12,
                magicAttack: 0,
                magicDefense: 10,
                exp: 24,
                weakTo: "fogo",
                strongTo: "terra",
                immuneTo: "none",
                sprite: "/src/assets/img/monsters/ormruc.png"
            },
            [
                {
                    id: 20,
                    name: "poção de hp",
                    type: "suporte",
                    description: "+ 30 hp",
                    attribute: 30,
                    value: 50,
                    cumulative: true,
                    quantity: 1,
                    icon: "/src/assets/img/icons/potions/hp-potion.png",
                    avaliable: true,
                    equippable: false,
                    chance: [0, 13]
                },
                {
                    id: 21,
                    name: "poção de mp",
                    type: "suporte",
                    description: "+ 30 mp",
                    attribute: 30,
                    value: 50,
                    cumulative: true,
                    quantity: 1,
                    icon: "/src/assets/img/icons/potions/mp-potion.png",
                    avaliable: true,
                    equippable: false,
                    chance: [21, 35]
                },
                {
                    id: 10,
                    name: "espada longa de ferro",
                    description: "espada pesada de ferro",
                    type: "ataque",
                    element: "fisico",
                    attribute: 10,
                    elementalAttribute: 0,
                    value: 150,
                    weight: 3,
                    cumulative: false,
                    icon: "/src/assets/img/icons/weapons/iron-longsword.png",
                    avaliable: true,
                    equippable: true,
                    chance: [61, 75]
                },
                {
                    id: 11,
                    name: "espada longa de aço",
                    description: "espada leve e resistente",
                    type: "ataque",
                    element: "fisico",
                    attribute: 12,
                    elementalAttribute: 0,
                    value: 300,
                    weight: 5,
                    cumulative: false,
                    icon: "/src/assets/img/icons/weapons/steel-longsword.png",
                    avaliable: true,
                    equippable: true,
                    chance: [81, 90]
                }
            ],
            [
                {
                    name: "investida mortal",
                    level: 1,
                    type: "ataque",
                    element: "fisico",
                    description: "ataque base + 10 dano adicional",
                    formula: (a, b, i) => {
                        let damage = (a.attack + 10) * i
                        b.health -= damage
                        let message = `Desferido ${damage} de dano.`;
                        sound.hit1.play();
                        return message;
                    },
                    mpCost: 10,
                    status: "normal",
                    icon: "/src/assets/img/icons/skills/skill-sword-1.png",
                },
                {
                    name: "golpe devastador",
                    level: 1,
                    type: "ataque",
                    element: "fisico",
                    description: "ataque 2x e incapacita o alvo",
                    formula: (a, b, i) => {
                        let damage = (a.attack * 2) * i
                        b.health -= damage;
                        let message = `Desferido ${damage} de dano. O inimigo ficou incapacitado.`;
                        sound.stomp.play();
                        return message;
                    },
                    mpCost: 30,
                    status: "stun",
                    icon: "/src/assets/img/icons/skills/skill-stun-1.png",
                }
            ]
        ]
    ]

}
