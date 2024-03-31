const playerInitStatus = [
    /* índice [0] informações gerais*/
    {
        name: "",
        for: 5,
        agi: 4,
        int: 3,
        von: 3,
        attack: 0,
        magicAttack: 0,
        defense: 0,
        magicDefense: 0,
        health: 50,
        maxHealth: 50,
        mana: 50,
        maxMana: 50,
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
            attribute: 8,
            elementalAttribute: 0,
            value: 50,
            weight: 2,
            cumulative: false,
            icon: "/src/assets/img/icons/weapons/cheap-longsword.png",
            equippable: true
        },
        {
            id: 0,
            name: "armadura de couro",
            description: "armadura de couro simples",
            type: "proteção",
            element: "fisico",
            attribute: 2,
            elementalAttribute: 0,
            value: 100,
            weight: 1,
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
            description: "+ 30 hp",
            attribute: 30,
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