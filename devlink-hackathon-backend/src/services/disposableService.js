'use strict';
const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');

const CACHE_FILE = path.join(__dirname,"../cache/disposable-domains.txt");

const BLOCKLIST_URL = "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf";

let disposableDomains = new Set();

function buildSet(text){
    return new Set(text.split("\n").map(x=>x.trim().toLowerCase()).filter(Boolean));

}


async function loadFromCache(){
    try{
        const data = await fs.readFile(CACHE_FILE,"utf8");
        disposableDomains = buildSet(data);

        return true;
    }catch{
        console.warn("No catch file found");
        return false;
    }
}

async function downloadLatest(){
    try{
        const { data } = await axios.get(
            BLOCKLIST_URL,
            {timeout: 15000}
        );
        await fs.mkdir(path.dirname(CACHE_FILE),{recursive: true});

        const tempFile = CACHE_FILE + ".tmp";

        await fs.writeFile(tempFile,data,"utf8");
        await fs.rename(tempFile,CACHE_FILE);

        disposableDomains = buildSet(data);

        console.log("DisposDomain download successful and cahced");
        return true;

    }catch(err){
        console.error("Disposable list update failed ",err.message);
        return false;
    }

}

function isDisposable(email){
    if(!email) return false;
    const parts = email.trim().toLowerCase().split("@");

    if(parts.length !== 2) return false;

    return disposableDomains.has(parts[1]);
}

module.exports = {loadFromCache , downloadLatest, isDisposable};