// verificando se o player não existe
if (!localStorage.getItem('jogador')) {
    window.location.href = "/index.html";
}

// recebendo informações atualizadas do localStorage
const infoPlayer = JSON.parse(localStorage.getItem('jogador'))
const concludedStages = infoPlayer[0].concluded;
console.log(infoPlayer, concludedStages);

// preenchendo título da página
document.querySelector('h1').innerHTML = `Mapa da aventura de ${infoPlayer[0].name}`

// liberando fases
let phase = 2;

for (let i = 0; i < concludedStages; i++) {
    const stageLock = document.getElementById(`p${phase}`).children[0]
    console.log(stageLock);
    if (!stageLock.classList.contains("hidden")) {
        stageLock.classList.add("hidden");
    }
    phase++
    
}

// botões de link (market e equipamentos)
document.getElementById('market').addEventListener('click', () => {

    window.location.href = "/market.html";

});

document.getElementById('equipment').addEventListener('click', () => {

    window.location.href = "/equipment.html";

})