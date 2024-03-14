const playerInitStatus = [
    /* índice [0] informações gerais*/
    {
        name: "",
        attack: 5,
        magicAttack: 0,
        defense: 5,
        magicDefense: 0,
        health: 100,
        maxHealth: 100,
        mana: 10,
        maxMana: 10,
        level: 1,
        exp: 0,
        next: 20,
        gold: 1000,
        concluded: 0
    },

    /* índice [1] equipamentos*/
    [
        {
            id: 9,
            name: "espada longa simples",
            description: "espada pesada e frágil",
            type: "ataque",
            element: "fisico",
            attribute: 5,
            elementalAttribute: 0,
            value: 50,
            cumulative: false,
            icon: "/src/assets/img/icons/weapons/cheap-longsword.png",
            equippable: true
        },
        {
            id: 0,
            name: "armadura básica",
            description: "armadura básica com placas de ferro",
            type: "proteção",
            element: "fisico",
            attribute: 3,
            elementalAttribute: 0,
            value: 100,
            cumulative: false,
            icon: "/src/assets/img/icons/armors/basic-armor.png",
            equippable: true
        }
    ],

    /* índice [2] Itens da bolsa (sobrevivência)*/
    [
        {
            id: 20,
            name: "poção de hp",
            type: "suporte",
            description: "+ 100 hp",
            attribute: 100,
            value: 20,
            cumulative: true,
            quantity: 3,
            icon: "/src/assets/img/icons/potions/hp-potion.png",
            equippable: false
        }
    ],

    /* índice [3] habilidades */
    [
        {
            name: "golpe poderoso",
            type: "ataque",
            element: "fisico",
            description: "ataque base + 30% dano adicional",
            damage: 0.3,
            mpCost: 5,
            status: "normal",
            icon: "/src/assets/img/icons/skills/skill-sword-1.png"
        },
        {
            name: "batida pesada",
            type: "ataque",
            element: "fisico",
            description: "ataque base + 30% dano adicional e incapacita o alvo",
            damage: 0.3,
            mpCost: 15,
            status: "stun",
            icon: "/src/assets/img/icons/skills/skill-stun-1.png"
        }
    ]

];

export default playerInitStatus;