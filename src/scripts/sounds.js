const path = '/src/assets/audio';

export const sound = {
    battleSound: new Audio(`${path}/bgm/battle_theme.wav`),
    bossbattleSound: new Audio(`${path}/bgm/boss-theme.mp3`),
    hit1: new Audio(`${path}/hit1.wav`),
    hit2: new Audio(`${path}/hit2.wav`),
    sword2: new Audio(`${path}/sword2.wav`),
    sword3: new Audio(`${path}/sword3.wav`),
    swordCombo: new Audio(`${path}/sword_combo.wav`),
    criticalHit: new Audio(`${path}/critical_hit.mp3`),
    miss: new Audio(`${path}/miss.wav`),
    healing: new Audio(`${path}/healing.wav`),
    winSound: new Audio(`${path}/win.wav`),
    loseSound: new Audio(`${path}/lose.wav`),
    error: new Audio(`${path}/error.wav`),
    warcry: new Audio(`${path}/warcry.wav`),
    stomp: new Audio(`${path}/stomp.wav`)
}