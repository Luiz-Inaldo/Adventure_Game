const playerInitStatus = [
    /* índice [0] informações gerais*/
    {
        name: "",
        attack: 5,
        magicAttack: 0,
        defense: 5,
        magicDefense: 0,
        health: 100,
        mana: 10,
        level: 1,
        exp: 0,
        gold: 0
    },

    /* índice [1] equipamentos*/
    [
        {
            nome: "armadura simples",
            descricao: "armadura de metal simples",
            tipo: "defesa",
            elemento: "fisico",
            atributo: 3,
            icon: "/src/assets/img/icons/armors/basic-armor.png"
        },
        {
            nome: "espada dupla simples",
            descricao: "espada dupla pesada e frágil",
            tipo: "ataque",
            elemento: "fisico",
            atributo: 5,
            icon: "/src/assets/img/icons/weapons/cheap-longsword.png"
        }
    ],

    /* índice [2] Itens da bolsa (sobrevivência)*/
    [
        {
            nome: "poção de hp",
            tipo: "poção",
            descricao: "cura 100 hp",
            quantidade: 3,
            icon: "/src/assets/img/icons/hp-potion-icon.png"
        }
    ],
    /* índice [3] informações de conclusão de fase*/
    {
        concluded: 0
    }

];

export default playerInitStatus;