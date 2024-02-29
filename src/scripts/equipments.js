window.addEventListener("DOMContentLoaded", ready)

async function ready() {

    // verificando se o player não existe
    if (!localStorage.getItem('jogador')) {
        window.location.href = "/index.html";
    }

    // variáveis gerais
    const status = {
        name: document.getElementById('player-name'),
        level: document.getElementById('player-level'),
        exp: document.getElementById('player-exp'),
        nextLevel: document.getElementById('next-level-exp'),
        health: document.getElementById('player-health'),
        mana: document.getElementById('player-mana'),
        atk: document.getElementById('player-attack'),
        def: document.getElementById('player-defense'),
        matk: document.getElementById('player-mattack'),
        mdef: document.getElementById('player-mdefense'),
        gold: document.getElementById('player-cash')
    }
    const playerBackpack = document.getElementById('player-items');
    const weaponEquipSlot = document.getElementById('weapon');
    const armorEquipSlot = document.getElementById('armor');
    const warningBox = document.getElementById('equips-warning');

    // variáveis de aúdio
    const healingSound = new Audio('/src/assets/audio/healing.wav');

    // recebendo informações atualizadas do localStorage
    const infoPlayer = JSON.parse(localStorage.getItem('jogador'));
    console.log(infoPlayer);

    // atribuindo valores na tela
    await refreshStatusValues();

    // carregando itens da mochila
    await loadBpItems();

    // carregando itens equipados
    await loadEquipedItems(infoPlayer[1]);

    // usando item de suporte
    playerBackpack.addEventListener('click', async (event) => {

        const button = event.target;
        const buttonID = parseInt(button.id);

        if (button.classList.contains('use-item')) {

            const index = infoPlayer[2].findIndex(item => item.id === buttonID);
            const healType = infoPlayer[2][index].nome.split("de ")[1];

            if (healType === "hp") {

                if (infoPlayer[0].health < infoPlayer[0].maxHealth) {

                    infoPlayer[2][index].quantidade--;
                    infoPlayer[0].health += infoPlayer[2][index].atributo;

                    if (infoPlayer[0].health >= infoPlayer[0].maxHealth) {

                        infoPlayer[0].health = infoPlayer[0].maxHealth;

                    }

                    healingSound.play();
                    await loadBpItems();
                    await refreshStatusValues();

                } else {

                    warningBox.style.visibility = "visible";
                    warningBox.innerHTML = `
                    
                        <div id="warning-message" class="rpgui-container framed-golden-2">
                            <p>Seus pontos de vida estão completos!</p>
                        </div>
                    
                    `;

                    setTimeout(() => { warningBox.style.visibility = "hidden" }, 1500);

                }

            } else if (healType === "mp") {

                if (infoPlayer[0].mana < infoPlayer[0].maxMana) {

                    infoPlayer[2][index].quantidade--
                    infoPlayer[0].mana += infoPlayer[2][index].atributo;

                    if (infoPlayer[0].mana > infoPlayer[0].maxMana) {
                        infoPlayer[0].mana = infoPlayer[0].maxMana;
                    }

                    healingSound.play();
                    await loadBpItems();
                    await refreshStatusValues();

                } else {

                    warningBox.style.visibility = "visible";
                    warningBox.innerHTML = `
                    
                        <div id="warning-message" class="rpgui-container framed-golden-2">
                            <p>Seus pontos de mana estão completos!</p>
                        </div>
                    
                    `;

                    setTimeout(() => { warningBox.style.visibility = "hidden" }, 1500);

                }

            }

        }

    })



    //funções
    async function refreshStatusValues() {

        status.name.innerHTML = `nome: ${infoPlayer[0].name}`;
        status.level.innerHTML = `level: ${infoPlayer[0].level}`;
        status.exp.innerHTML = `exp: ${infoPlayer[0].exp}`;
        status.nextLevel.innerHTML = `next: ${infoPlayer[0].next - infoPlayer[0].exp}`;
        status.health.innerHTML = `health: ${infoPlayer[0].health}/${infoPlayer[0].maxHealth}`;
        status.mana.innerHTML = `mana: ${infoPlayer[0].mana}/${infoPlayer[0].maxMana}`;
        status.atk.innerHTML = `attack: ${infoPlayer[0].attack} + ${infoPlayer[1][0].atributo}`;
        status.def.innerHTML = `defense: ${infoPlayer[0].defense} + ${infoPlayer[1][1].atributo}`;
        status.matk.innerHTML = `mattack: ${infoPlayer[0].magicAttack} + ${infoPlayer[1][0].atributoElemental}`;
        status.mdef.innerHTML = `mdefense: ${infoPlayer[0].magicDefense} + ${infoPlayer[1][1].atributoElemental}`;
        status.gold.innerHTML = `gold: ${infoPlayer[0].gold}`

    }

    async function loadBpItems() {

        playerBackpack.innerHTML = "";

        for (const item of infoPlayer[2]) {

            if (!item.equipavel && item.quantidade > 0) {
                playerBackpack.innerHTML += `
            
                    <li class="player-backpack-item">
                        <div class="player-bp-img-wrapper">
                            <img src="${item.icon}" alt="icon" class="bp-item-sup-icon">
                        </div>
                        <span class="bp-item-description">${item.nome} (${item.descricao})</span>
                        <span class="bp-item-quantity">x ${item.quantidade}</span>
                        <button id="${item.id}" class="use-item rpgui-button">usar</button>
                    </li>
            
                `;
            } else if (item.equipavel) {
                playerBackpack.innerHTML += `
                
                    <li class="player-backpack-item">
                        <div class="player-bp-img-wrapper">
                            <img src="${item.icon}" alt="icon" class="bp-item-icon">
                        </div>
                        <span class="bp-item-description">${item.nome}</span>
                        <span class="bp-item-attribute">+ ${item.atributo} ${item.tipo}</span>
                        <button id="${item.id}" class="equip rpgui-button">equipar</button>
                    </li>
                
                `;
            }


        }

    }

    async function loadEquipedItems(equipment) {

        weaponEquipSlot.innerHTML = `
        
            <div id="weapon-img">
                <img src="${equipment[0].icon}" alt="equipped-weapon">
            </div>
            <span id="weapon-description">${equipment[0].nome}</span>
        
        `;

        armorEquipSlot.innerHTML = `
        
            <div id="armor-img">
            <img src="${equipment[1].icon}" alt="">
            </div>
            <span id="armor-description">${equipment[1].nome}</span>
        
        `;

    }

}
