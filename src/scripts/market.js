// verificando se o player não existe
if (!localStorage.getItem('jogador')) {
    window.location.href = "/index.html";
}

// variáveis gerais
const playerCurrentGold = document.querySelector('#player-gold-coins p');
const openMarketBuyButton = document.getElementById('buy-btn');
const openMarketSellButton = document.getElementById('sell-btn');
const showcase = document.getElementById('items-showcase');
const itemJsonListEndpoint = "/src/json/items.json";
let itemList;

/*Recebendo informações atualizadas do localStorage*/
const infoPlayer = JSON.parse(localStorage.getItem('jogador'))

// atribuindo valor do dinheiro atual a loja
playerCurrentGold.textContent = infoPlayer[0].gold;

// eventos de clique
openMarketBuyButton.addEventListener('click', async () => {

    await displayBuyableItems(itemJsonListEndpoint);

});

openMarketSellButton.addEventListener('click', async () => {

    await displaySellableItems(infoPlayer[2]);

});


// funções de aparição da loja
async function displayBuyableItems(endpoint) {

    fetch(endpoint)
        .then(res => res.json())
        .then(items => {
            itemList = items;
            const {allItems} = itemList;
            refreshMarket()
            showcase.innerHTML = `
                <h2 id="showcase-title">Comprar</h2>
            `
            
            for (const item of allItems) {
                
                if (item.disponivel && item.tipo !== "suporte") {
                    showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${item.icon}" alt="armor-icon" class="mkt-item-icon">
                            <span class="mkt-item-description">${item.nome}</span>
                            <span class="mkt-item-attribute">+ ${item.atributo} ${item.tipo}</span>
                            <span class="mkt-item-value">${item.valor}G</span>
                            <button class="buy-item rpgui-button">comprar</button>
                        </li>
                    
                    `
                } else if (item.disponivel && item.tipo === "suporte") {

                    showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${item.icon}" alt="armor-icon" class="mkt-item-potion-icon">
                            <span class="mkt-item-description">${item.nome}</span>
                            <span class="mkt-item-attribute">${item.descricao}</span>
                            <span class="mkt-item-value">${item.valor}G</span>
                            <button class="buy-item rpgui-button">comprar</button>
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
        <h2 id="showcase-title">Vender</h2>
    `

    for (const item of backpack) {

        if (item.tipo !== "suporte") {
            
            showcase.innerHTML += `
                        
                <li class="mkt-item">
                    <img src="${item.icon}" alt="armor-icon" class="mkt-item-icon">
                    <span class="mkt-item-description">${item.nome}</span>
                    <span class="mkt-item-attribute">+ ${item.atributo} ${item.tipo}</span>
                    <span class="mkt-item-value">${item.valor / 2}G</span>
                    <button class="sell-item rpgui-button">vender</button>
                </li>
                        
            `

        } else {

                       
            showcase.innerHTML += `
            
                <p>Você não tem itens para vender</P>

            `

        }
        

    }

    return displayedItems = "sellable"

}

function refreshMarket() {

    showcase.innerHTML = "";

}

// funções de compra e venda
showcase.addEventListener('click', async (click) => {
    console.log(itemList);
    const button = click.target;

    if (button.classList.contains('buy-item')) {
        const elementName = button.parentElement
        .querySelector('.mkt-item-description').textContent;
        
        
        
    }

})