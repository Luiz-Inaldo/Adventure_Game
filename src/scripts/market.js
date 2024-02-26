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

// variáveis de audio
const purchaseSound = new Audio('/src/assets/audio/purchase.wav');

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
            const { allItems } = itemList;
            const armaduras = allItems.filter(element => { return element.tipo === "proteção" })
            const armas = allItems.filter(element => { return element.tipo === "ataque" })
            const suporte = allItems.filter(element => { return element.tipo === "suporte" })

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
                            <span class="mkt-item-attribute">+ ${armadura.atributo} ${armadura.tipo}</span>
                            <span class="mkt-item-value">${armadura.valor}G</span>
                            <button id="${armadura.id}" class="buy-item rpgui-button">comprar</button>
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
                            <span class="mkt-item-attribute">+ ${arma.atributo} ${arma.tipo}</span>
                            <span class="mkt-item-value">${arma.valor}G</span>
                            <button id="${arma.id}" class="buy-item rpgui-button">comprar</button>
                        </li>
                 
                    `

                }

            }

            for (const supplie of suporte) {

                if (supplie.disponivel) {

                    showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${supplie.icon}" alt="armor-icon" class="mkt-item-potion-icon">
                            <span class="mkt-item-description">${supplie.nome}</span>
                            <span class="mkt-item-attribute">${supplie.descricao}</span>
                            <span class="mkt-item-value">${supplie.valor}G</span>
                            <button id="${supplie.id}" class="buy-item rpgui-button">comprar</button>
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
    const sellableItems = backpack.filter(item => { return item.tipo !== "suporte" });

    if (sellableItems.length > 0) {

        for (const item of sellableItems) {

            showcase.innerHTML += `
                            
                    <li class="mkt-item">
                        <img src="${item.icon}" alt="armor-icon" class="mkt-item-icon">
                        <span class="mkt-item-description">${item.nome}</span>
                        <span class="mkt-item-attribute">+ ${item.atributo} ${item.tipo}</span>
                        <span class="mkt-item-value">${item.valor / 2}G</span>
                        <button class="sell-item rpgui-button">vender</button>
                    </li>
                            
            `

        }

    } else {
        showcase.innerHTML += `
        
        <p>Você não tem itens para vender</p>

        `;
    }

}

function refreshMarket() {

    showcase.innerHTML = "";

}

// funções de compra e venda
showcase.addEventListener('click', async (button) => {

    if (button.target.classList.contains('buy-item')) {

        const buttonID = parseInt(button.target.id);
        const itemToBuy = itemList.allItems.filter(element => { return element.id === buttonID });
        const itemValue = itemToBuy[0].valor;

        if (infoPlayer[0].gold >= itemValue && itemToBuy[0].tipo !== "suporte") {

            purchaseSound.play();
            infoPlayer[0].gold -= itemValue;
            infoPlayer[2].push(itemToBuy[0]);
            await updateDisplayedPlayerGold();

        } else if (infoPlayer[0].gold >= itemValue && itemToBuy[0].tipo === "suporte") {

            let checkItemMatch = false;

            for (let i = 0; i < infoPlayer[2].length; i++) {
                if (infoPlayer[2][i].nome === itemToBuy[0].nome) {
                    infoPlayer[2][i].quantidade++
                    purchaseSound.play();
                    infoPlayer[0].gold -= itemValue;
                    checkItemMatch = true;
                    await updateDisplayedPlayerGold();
                    console.log(infoPlayer[2]);
                    return
                }
            }
            if (!checkItemMatch) {

                purchaseSound.play();
                infoPlayer[0].gold -= itemValue;
                infoPlayer[2].push(itemToBuy[0]);
                await updateDisplayedPlayerGold();

            }

            console.log(infoPlayer[2]);

        } else {

            document.getElementById('market-warning').style.visibility = "visible";
            document.getElementById('market-warning').innerHTML = `
            
                <div id="no-money-warning" class="rpgui-container framed-golden-2">
                    <p>Opa! parece que você não tem dinheiro suficiente, viajante!</p>
                </div>
            
            `;

            setTimeout(() => { document.getElementById('market-warning').style.visibility = "hidden" }, 1500);

        }

    } else if (button.target.classList.contains('sell-item')) {
        const itemName = button.target.parentElement
            .querySelector('.mkt-item-description').textContent;

        purchaseSound.play();
        const index = infoPlayer[2].findIndex(item => item.nome === itemName);
        const itemToSell = infoPlayer[2][index];
        infoPlayer[0].gold += itemToSell.valor / 2;
        button.target.parentElement.remove();
        infoPlayer[2].splice(index, 1);
        await updateDisplayedPlayerGold();
        await displaySellableItems(infoPlayer[2]);
    }

})

async function updateDisplayedPlayerGold() {

    playerCurrentGold.textContent = infoPlayer[0].gold;

}