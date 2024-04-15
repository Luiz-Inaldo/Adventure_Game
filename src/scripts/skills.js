import { sound } from "./sounds.js";

export const skills = [

    {
        name: "força de combate",
        level: 1,
        type: "passiva",
        element: "none",
        description: "+ 1 de ataque físico para cada ponto de força",
        formula: (a) => {
            let buff = a.for / 2
            a.attack += Math.floor(buff)
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "pele de pedra",
        level: 1,
        type: "passiva",
        element: "none",
        description: "+ 1 de defesa permanentemente",
        formula: (a) => {
            a.defense += 1;
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
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
    },
    {
        name: "investida mortal",
        level: 1,
        type: "ataque",
        element: "fisico",
        description: "ataque base + 10 dano adicional",
        formula: (a, b, inc, elDmg) => {
            let damage = (a.attack + 10) * inc
            b.health -= damage
            let message = `Desferido ${damage} de dano.`;
            if (elDmg) {
                b.health -= elDmg
                message += ` Desferido ${elDmg} de dano elemental.`
            }
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
        formula: (a, b, inc, elDmg) => {
            let damage = (a.attack * 2) * inc
            b.health -= damage;
            let message = `Desferido ${damage} de dano. O inimigo ficou incapacitado.`;
            if (elDmg) {
                b.health -= elDmg
                message += ` Desferido ${elDmg} de dano elemental.`
            }
            sound.stomp.play();
            return message;
        },
        mpCost: 30,
        status: "stun",
        icon: "/src/assets/img/icons/skills/skill-stun-1.png",
    },
    {
        name: "ataque simultâneo",
        level: 1,
        type: "ataque",
        element: "fisico",
        description: "ataca o alvo duas vezes",
        formula: (a, b, inc, elDmg) => {
            let damage = (a.attack * 2) * inc
            b.health -= damage
            let message = `Desferido ${damage} de dano.`;
            if (elDmg) {
                b.health -= elDmg
                message += ` Desferido ${elDmg} de dano elemental.`
            }
            sound.sword2.play();
            return message;
        },
        mpCost: 20,
        status: "normal",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "tempestade de lâminas",
        level: 1,
        type: "ataque",
        element: "fisico",
        description: "ataca o alvo até errar o primeiro ataque",
        formula: (a, b, inc, elDmg) => {
            let rollNumber = Math.round(Math.random() * 12)
            if (rollNumber + a.for > b.defense) {
                let hits = 0;
                while (rollNumber + a.for > b.defense && b.health > 0) {
                    b.health -= (a.attack) * inc
                    if (elDmg) {
                        b.health -= elDmg
                    }
                    rollNumber--
                    hits++
                }
                sound.swordCombo.play();
                let message = `Foram desferidos ${hits} golpes. Dano total: ${(a.attack * i) * hits}`;
                if (elDmg) {
                    message += ` e ${elDmg * hits} de dano elemental.`
                }
                return message
            }
        },
        mpCost: 40,
        status: "normal",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "defesa reforçada",
        level: 5,
        type: "passiva",
        element: "none",
        description: "+ 1 de defesa para cada ponto de agilidade",
        formula: (a) => {
            let buff = a.agi / 2
            a.defense += Math.floor(buff)
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png"
    },
    {
        name: "grito de guerra II",
        level: 5,
        type: "suporte",
        element: "fisico",
        description: "+ 2 de ataque físico por toda a batalha",
        formula: (a) => {
            a.attack += 2
            let message = `Ataque aumentou em 2.`;
            sound.warcry.play();
            return message;
        },
        mpCost: 30,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png"
    },
    {
        name: "golpe devastador II",
        level: 5,
        type: "ataque",
        element: "fisico",
        description: "ataque 3x e incapacita o alvo",
        formula: (a, b, inc, elDmg) => {
            let damage = (a.attack * 3) * inc
            b.health -= damage
            let message = `Desferido ${damage} de dano. O inimigo ficou incapacitado.`;
            if (elDmg) {
                b.health -= elDmg
                message += ` Desferido ${elDmg} de dano elemental.`
            }
            sound.stomp.play();
            return message;
        },
        mpCost: 60,
        status: "stun",
        icon: "/src/assets/img/icons/skills/skill-stun-1.png",
    },
    {
        name: "força heróica",
        level: 5,
        type: "passiva",
        element: "none",
        description: "+ 1 de força",
        formula: (a) => {
            a.for += 1
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "agilidade heróica",
        level: 5,
        type: "passiva",
        element: "none",
        description: "+ 1 de agilidade",
        formula: (a) => {
            a.agi += 1
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "inteligência heróica",
        level: 5,
        type: "passiva",
        element: "none",
        description: "+ 1 de inteligência",
        formula: (a) => {
            a.int += 1
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "vontade heróica",
        level: 5,
        type: "passiva",
        element: "none",
        description: "+ 1 de vontade",
        formula: (a) => {
            a.von += 1
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "duro de matar",
        level: 5,
        type: "passiva",
        element: "none",
        description: "+ 20 de vida",
        formula: (a) => {
            a.maxHealth += 20
            a.health = a.maxHealth
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "energia expandida",
        level: 5,
        type: "passiva",
        element: "none",
        description: "+ 20 de mana",
        formula: (a) => {
            a.maxMana += 20
            a.mana = a.maxMana
        },
        mpCost: 0,
        status: "none",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png",
    },
    {
        name: "ataque da hidra",
        level: 5,
        type: "ataque",
        element: "fisico",
        description: "um número será lançado e o seu dano multiplicado",
        formula: (a, b, inc, elDmg) => {
            const randomNumber = Math.floor(Math.random() * 12)
            const damage = (a.attack * inc) * randomNumber;
            b.health -= damage;
            let message = `Desferido ${damage} de dano.`;
            if (elDmg) {
                b.health -= elDmg * randomNumber
                message += ` Desferido ${elDmg * randomNumber} de dano elemental.`
            }
            sound.hit2.play();
            return message;
        },
        mpCost: 30,
        status: "stun",
        icon: "/src/assets/img/icons/skills/skill-stun-1.png"
    },
    {
        name: "matador de dragões",
        level: 10,
        type: "ataque",
        element: "fisico",
        description: "o hp do alvo cai em 50%",
        formula: (a, b, i) => {
            const damage = b.health / 2
            b.health -= damage
            let message = `Desferido ${damage} de dano.`;
            sound.hit1.play()
        },
        mpCost: 50,
        status: "normal",
        icon: "/src/assets/img/icons/skills/skill-sword-1.png"
    },

]
