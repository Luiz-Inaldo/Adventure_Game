// verificando se o player não existe
if (!localStorage.getItem('jogador')) {
    window.location.href = "/index.html";
}

// variáveis gerais
const playerCurrentGold = document.querySelector('#player-gold-coins p');
const openMarketBuyButton = document.getElementById('buy-btn');
const openMarketSellButton = document.getElementById('sell-btn');
const showcase = document.getElementById('items-showcase');
const itemListEndpoint = "/src/json/items.json"; 

// recebendo informações atualizadas do localStorage
const infoPlayer = JSON.parse(localStorage.getItem('jogador'))

// atribuindo valor do dinheiro atual a loja
playerCurrentGold.textContent = infoPlayer[0].gold;
console.log(infoPlayer[2]);

// eventos de clique
openMarketBuyButton.addEventListener('click', async () => {

    await displayBuyableItems(itemListEndpoint);

});

openMarketSellButton.addEventListener('click', async () => {

    await displaySellableItems(infoPlayer[2]);

});


// funções de aparição da loja
async function displayBuyableItems(endpoint) {

    fetch(endpoint)
        .then(res => res.json())
        .then(items => {
            
            const {armaduras, armas, sobrevivencia} = items;
            refreshMarket()
            showcase.innerHTML = `
                <h2 id="showcase-title">Comprar</h2>
            `
            
            for (const armadura of armaduras) {
                
                if (armadura.disponivel) {
                    showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${armadura.icon}" alt="armor-icon" class="mkt-item-icon">
                            <span class="mkt-item-description">${armadura.nome}</span>
                            <span class="mkt-item-attribute">+ ${armadura.atributo} def</span>
                            <span class="mkt-item-value">${armadura.valor}G</span>
                        </li>
                    
                    `
                }
                
            }

            for (const arma of armas) {
                
                if (arma.disponivel) {
                    showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${arma.icon}" alt="armor-icon" class="mkt-item-icon">
                            <span class="mkt-item-description">${arma.nome}</span>
                            <span class="mkt-item-attribute">+ ${arma.atributo} atk</span>
                            <span class="mkt-item-value">${arma.valor}G</span>
                        </li>
                    
                    `
                }

            }

            for (const suprimento of sobrevivencia) {
                
                if (suprimento.disponivel) {
                    showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${suprimento.icon}" alt="armor-icon" class="mkt-item-potion-icon">
                            <span class="mkt-item-description">${suprimento.nome}</span>
                            <span class="mkt-item-attribute">${suprimento.descricao}</span>
                            <span class="mkt-item-value">${suprimento.valor}G</span>
                        </li>
                    
                    `
                }

            }

        })
        .catch(error => console.error(`erro: ${error}`))

}

async function displaySellableItems(backpack) {

    refreshMarket()
    showcase.innerHTML = `
        <h2 id="showcase-title">Comprar</h2>
    `

    for (const item of backpack) {
        
        showcase.innerHTML += `
                    
            <li class="mkt-item">
                <img src="${armadura.icon}" alt="armor-icon" class="mkt-item-icon">
                <span class="mkt-item-description">${armadura.nome}</span>
                <span class="mkt-item-attribute">+ ${armadura.atributo} def</span>
                <span class="mkt-item-value">${armadura.valor}G</span>
            </li>
                    
        `

    }

}


function refreshMarket() {

    showcase.innerHTML = "";

}