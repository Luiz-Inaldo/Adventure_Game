/* 
    script para calcular a fórmula de dano em batalha.
    feito somente para importação.
*/

const infoPlayer = JSON.parse(localStorage.getItem('jogador'));
let enemy;
await reqMonsterTable();
console.log(enemy);

// const playerAttackFormulas = {
//     normalAttack: infoPlayer[0].level + ((infoPlayer[0].attack*3) - (enemy[0][0].defense *2)),
// }




async function reqMonsterTable() {

    try {
        let req = await fetch('/src/json/monsters/forest/forest-monsters.json');
        let resp = await req.json();
        enemy = req.monsters;
    } catch (error) {
        console.error(error);
    }

}

// export default playerAttackFormulas;