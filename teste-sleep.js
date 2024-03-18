async function sleep(miliseconds) {
    return new Promise(res => setTimeout(res, miliseconds))
}

async function main() {
    console.log("hit (10)");
    await sleep(2000);
    console.log("take damage (10)");
}

main()