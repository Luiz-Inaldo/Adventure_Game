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
        next: 10,
        gold: 1000,
        concluded: 0
    },

    /* índice [1] equipamentos*/
    [
        {
            id: 9,
            nome: "espada longa simples",
            descricao: "espada pesada e frágil",
            tipo: "ataque",
            elemento: "fisico",
            atributo: 5,
            atributoElemental: 0,
            valor: 50,
            acumulavel: false,
            icon: "/src/assets/img/icons/weapons/cheap-longsword.png",
            equipavel: true
        },
        {
            id: 0,
            nome: "armadura básica",
            descricao: "armadura básica com placas de ferro",
            tipo: "proteção",
            elemento: "fisico",
            atributo: 3,
            atributoElemental: 0,
            valor: 100,
            acumulavel: false,
            icon: "/src/assets/img/icons/armors/basic-armor.png",
            equipavel: true
        }
    ],

    /* índice [2] Itens da bolsa (sobrevivência)*/
    [
        {
            id: 20,
            nome: "poção de hp",
            tipo: "suporte",
            descricao: "+ 100 hp",
            atributo: 100,
            valor: 20,
            acumulavel: true,
            quantidade: 3,
            icon: "/src/assets/img/icons/potions/hp-potion.png",
            equipavel: false
        }
    ],

    /* índice [3] habilidades */
    [
        {
            nome: "golpe poderoso",
            tipo: "ataque",
            descricao: "ataque base + 5 dano adicional",
            dano: 5,
            mp: 5,
            incapacitacao: false,
            icon: ""
        },
        {
            nome: "batida pesada",
            tipo: "ataque",
            descricao: "ataque base + 5 dano adicional e incapacita o alvo",
            dano: 5,
            mp: 15,
            incapacitacao: true,
            icon: ""
        }
    ]

];

export default playerInitStatus;