window.addEventListener('DOMContentLoaded', ready);

async function ready() {

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
    const selectSound = new Audio('/src/assets/audio/select.wav');
    selectSound.volume = 0.2;

    /*Recebendo informações atualizadas do localStorage*/
    const infoPlayer = JSON.parse(localStorage.getItem('jogador'))

    // atribuindo valor do dinheiro atual a loja
    playerCurrentGold.textContent = infoPlayer[0].gold;

    // eventos de clique
    openMarketBuyButton.addEventListener('click', async () => {

        selectSound.play();
        await displayBuyableItems(itemJsonListEndpoint);

    });

    openMarketSellButton.addEventListener('click', async () => {

        selectSound.play();
        await displaySellableItems(infoPlayer[2]);

    });


    // funções de aparição da loja
    async function displayBuyableItems(endpoint) {

        fetch(endpoint)
            .then(res => res.json())
            .then(items => {
                itemList = items;
                const { allItems } = itemList;
                const armaduras = allItems.filter(element => { return element.type === "proteção" })
                const armas = allItems.filter(element => { return element.type === "ataque" })
                const suporte = allItems.filter(element => { return element.type === "suporte" })

                refreshMarket()

                showcase.style.padding = "20px";
                showcase.innerHTML = `
                <h2 id="showcase-title">Comprar</h2>
            `

                for (const armadura of armaduras) {

                    if (armadura.avaliable) {

                        showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${armadura.icon}" alt="armor-icon" class="mkt-item-icon">
                            <span class="mkt-item-description">${armadura.name} <br> (peso: ${armadura.weight})</span>
                            <span class="mkt-item-attribute">+ ${armadura.attribute} ${armadura.type}</span>
                            <span class="mkt-item-value">${armadura.value}G</span>
                            <button id="${armadura.id}" class="buy-item rpgui-button">comprar</button>
                        </li>
                 
                    `

                    }

                }

                for (const arma of armas) {

                    if (arma.avaliable) {

                        showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${arma.icon}" alt="armor-icon" class="mkt-item-icon">
                            <span class="mkt-item-description">${arma.name} <br> (peso: ${arma.weight})</span>
                            <span class="mkt-item-attribute">${arma.attribute} ${arma.type}</span>
                            <span class="mkt-item-value">${arma.value}G</span>
                            <button id="${arma.id}" class="buy-item rpgui-button">comprar</button>
                        </li>
                 
                    `

                    }

                }

                for (const supplie of suporte) {

                    if (supplie.avaliable) {

                        showcase.innerHTML += `
                    
                        <li class="mkt-item">
                            <img src="${supplie.icon}" alt="armor-icon" class="mkt-item-potion-icon">
                            <span class="mkt-item-description">${supplie.name}</span>
                            <span class="mkt-item-attribute">${supplie.description}</span>
                            <span class="mkt-item-value">${supplie.value}G</span>
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
        showcase.style.padding = "20px";
        showcase.innerHTML = `
        <h2 id="showcase-title">Vender</h2>
    `
        const sellableItems = backpack.filter(item => { return item.type !== "suporte" });

        if (sellableItems.length > 0) {

            for (const item of sellableItems) {

                showcase.innerHTML += `
                            
                    <li class="mkt-item">
                        <img src="${item.icon}" alt="armor-icon" class="mkt-item-icon">
                        <span class="mkt-item-description">${item.name} <br> (peso: ${item.weight})</span>
                        <span class="mkt-item-attribute">+ ${item.attribute} ${item.type}</span>
                        <span class="mkt-item-value">${item.value / 2}G</span>
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
            const itemToBuy = itemList.allItems.find(element => { return element.id === buttonID });
            console.log(itemToBuy);
            const itemValue = itemToBuy.value;

            if (infoPlayer[0].gold >= itemValue && itemToBuy.type !== "suporte") {

                purchaseSound.play();
                infoPlayer[0].gold -= itemValue;
                infoPlayer[2].push(itemToBuy);
                await updateDisplayedPlayerGold();

            } else if (infoPlayer[0].gold >= itemValue && itemToBuy.type === "suporte") {

                let checkItemMatch = false;

                for (let i = 0; i < infoPlayer[2].length; i++) {
                    if (infoPlayer[2][i].name === itemToBuy.name) {
                        infoPlayer[2][i].quantity++
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
                    infoPlayer[2].push(itemToBuy);
                    await updateDisplayedPlayerGold();

                }

                console.log(infoPlayer[2]);

            } else {

                document.getElementById('market-warning').style.visibility = "visible";
                document.getElementById('market-warning').innerHTML = `
            
                <div id="warning-message" class="rpgui-container framed-golden-2">
                    <p>Opa! parece que você não tem dinheiro suficiente, viajante!</p>
                </div>
            
            `;

                setTimeout(() => { document.getElementById('market-warning').style.visibility = "hidden" }, 1500);

            }

        } else if (button.target.classList.contains('sell-item')) {
            const itemName = button.target.parentElement
                .querySelector('.mkt-item-description').textContent;

            purchaseSound.play();
            const index = infoPlayer[2].findIndex(item => item.name === itemName);
            const itemToSell = infoPlayer[2][index];
            infoPlayer[0].gold += itemToSell.value / 2;
            button.target.parentElement.remove();
            infoPlayer[2].splice(index, 1);
            await updateDisplayedPlayerGold();
            await displaySellableItems(infoPlayer[2]);
        }

    })

    async function updateDisplayedPlayerGold() {

        playerCurrentGold.textContent = infoPlayer[0].gold;

    }

    // função de atualização do localStorage
    document.getElementById('back-to-map').addEventListener('click', () => {

        localStorage.setItem('jogador', JSON.stringify(infoPlayer));
        window.location.href = "/roadmap.html";

    })

}
