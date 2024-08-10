import * as storage from "./local-storage.js";
import * as firebase from "./firebase.js";

let outputStatus;
let outputResults;
let clearButton;

function init() {
    // Get references to different parts of the HTML
    outputStatus = document.querySelector("#element-status");
    outputResults = document.querySelector("#output");
    clearButton = document.querySelector("#btn-clear-all");

    clearButton.onclick = (e) => {
        storage.clearSpellbook();
        display();
    }

    // Load in the spellcards
    display();
    loadCalculatedCharacter();
}

// Load the spellcards
function display() {
    // Clear the old cards
    outputResults.innerHTML = "";
    
    // Remember the amount of spells in favorites
    let spellCount = 0;

    // Loop through each spell result and add it
    for (let spell of storage.getSpellbook()) {
        console.log(spell);
        // Create the card
        const card = document.createElement("spell-card");

        // Input data
        card.dataset.src = spell;
        card.addCallbackStorage = storage.addSpell;
        card.addCallbackFirebase = firebase.addSpell;
        card.removeCallbackStorage = (data) => {
            storage.removeSpell(data);
            outputResults.removeChild(card);
        }
        card.removeCallbackFirebase = firebase.removeSpell;
        card.checkCallbackStorage = storage.spellInBook;
        card.checkCallbackFirebase = firebase.getPickCount;
        card.setOnValueCallback = firebase.setOnValue;

        // Add the card to the page
        outputResults.appendChild(card);

        // Increment the spell count
        spellCount += 1;
    }

    if (spellCount == 0) { // There are no spells in the spellbook
        outputStatus.innerHTML = "No results found :(";
    }
    else { // There are spells in the spellbook
        outputStatus.innerHTML = `Found ${spellCount} results!`;
    }
}

// Load the calculated character from local storage and display it
function loadCalculatedCharacter() {
    let calculatedCharacter = storage.getCalculatedCharacter();
    let div = document.querySelector("#calc-chr");

    // If there is one
    if (calculatedCharacter) { // There is one saved
        div.innerHTML = `<div class="box has-background-light">${calculatedCharacter}</div>`;
        div.innerHTML = calculatedCharacter;
    }
}

init();