import * as storage from "./local-storage.js";
import * as firebase from "./firebase.js";

// Set up all of the references as empty variables to be filled in init
let classField;
let levelField;
let schoolField;
let searchButton;
let clearButton;
let outputResult;
let outputStatus;

// Make 2 empty objects that can store 2 seperate json lists to compare
// The API doesn't let you filter by level and school in a class spell list, so you have to look at both the class spell list and
// every spell that matches your parameters and then get a list of the overlap
let firstJSON;

let dataReady;

const URL_BASE = "https://www.dnd5eapi.co/api/";

let baseStatus;

// Create the URL, search for the result, and display the data
function search() {
    // Update the status text
    outputStatus.innerHTML = "Searching...";
    searchButton.classList.add("is-loading");

    // Reset dataReady
    dataReady = false;

    // Initialize both URLS and a bool to keep track of if they are needed or not
    let classURL = URL_BASE + "classes/";
    let otherURL = URL_BASE + "spells?";
    let classURLNeeded = false;
    let otherURLNeeded = false;

    // Fill in the class URL if its needed
    for (let field of classField) {
        if (field.checked && field.value) { // It was checked and isn't any (which has a value of "")
            classURL += field.value + "/spells";
            classURLNeeded = true;
        }
    }

    // Spell level
    for (let field of levelField) {
        if (field.checked) { // The field is checked true (so it should be included in the search)
            otherURL += `&level=${field.value}`;
            otherURLNeeded = true;
        }
    }

    // School of magic
    for (let field of schoolField) {
        if (field.checked) { // The field is checked true (so it should be included in the search)
            otherURL += `&school=${field.value}`;
            otherURLNeeded = true;
        }
    }

    // Decide if its going to need both URLs or not
    let callback;
    if (classURLNeeded && otherURLNeeded) { // Both the classURL and the otherURL will be nescesary
        console.log("Two URLs needed");
        callback = twoFactorDisplay;
    }
    else { // Only 1 of classURL and otherURL will be nesesary
        console.log("One URL needed");
        callback = oneFactorDisplay;
    }

    // Send both the fetch requests (or only 1 if only 1 json is needed)
    if (classURLNeeded) { // The classURL json will be nescesary
        loadJsonFetch(classURL, callback);
    }
    if (otherURLNeeded) { // The otherURL json will be nescesary
        loadJsonFetch(otherURL, callback);
    }
    else if (!classURLNeeded && !otherURLNeeded) { // No data was entered
        // Send a basic request for all spells
        loadJsonFetch(URL_BASE + "spells", oneFactorDisplay);
    }
}

// Send the XHR request to the API (NOT USED ANYMORE)
function sendXHRRequest(URL, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = callback;
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET",URL);
    xhr.send();

    console.log("Request sent using : ", URL);
}

// Fetch the JSON from the API
function loadJsonFetch(URL, callback){
    const fetchPromise = async () => {
        // Get a response from the API
        let response = await fetch(URL);

        // Test if theres an error
        if (!response.ok) {
            throw new Error(`HTTP error! Status ${response.status}`);
        }

        let json = await response.json();

        callback(json);
    }
    fetchPromise()
    .catch(e => {
        console.log(`In catch with e = ${e}`);
        output.innerHTML = "Failure :( Check the console";
    });
}


function twoFactorDisplay(json)
{
    // Parse data into JSON
    console.log("twoFactorDisplay Called");
    
    if (!dataReady) { // This is the 1st json to be ready

        console.log("First response gotten");

        // Mark that the first piece of data has been saved
        dataReady = true;

        // Store this as the first piece of data
        firstJSON = json;
    }
    else { // This is the 2nd json to be ready and it can now display

        console.log("Second response gotten");

        // Create a list of just the items that exist in both JSONs
        // firstJSON refers to the other piece of JSON that is already stored

        // Create new empty JSON
        let newJSON = {results:[]};

        // Loop through each spell in firstJSON
        for (let spell of firstJSON.results) {
            // Test if its in the list
            if (overlappingSpell(spell, json)) { // It is in the list
                newJSON.results.push(spell);
            }
        }

        // Display the new JSON
        display(newJSON);
    }
}

// Return true or false if a spell exists in a json list
function overlappingSpell(firstSpell, secondJSON) {
    // Loop through the list of spells
    for (let spell of secondJSON.results) {
        // Test if its the same
        if (spell.index == firstSpell.index) { // It matches
            return true;
        }
    }

    // If it got to this part in the code without ever returning true, then the spell is not in the list 
    return false;
}

function oneFactorDisplay(json) {
    console.log("oneFactorDisplay Called");

    console.log("Only response gotten");

    display(json);
}

function display(data) {
    // Clear previous searches
    clear();
    
    // Loop through each spell result and add it
    for (let spell of data.results) {
        // Create the card
        const card = document.createElement("spell-card");
        let spellURL = `https://www.dnd5eapi.co${spell.url}`;

        // Input data
        card.dataset.src = spellURL;
        card.addCallbackStorage = storage.addSpell;
        card.addCallbackFirebase = firebase.addSpell;
        card.removeCallbackStorage = storage.removeSpell;
        card.removeCallbackFirebase = firebase.removeSpell;
        card.checkCallbackStorage = storage.spellInBook;
        card.checkCallbackFirebase = firebase.getPickCount;
        card.setOnValueCallback = firebase.setOnValue;

        // Add the card to the page
        outputResult.appendChild(card);
    }
    outputStatus.innerHTML = "Results found!";

    // Display text if there were no results
    if (data.results.length == 0) { // No results
        outputStatus.innerHTML = "No results found :(";
    }

    // Update the status
    searchButton.classList.remove("is-loading");
}

// Clear the output field
function clear()
{
    outputStatus.innerHTML = baseStatus;
    outputResult.innerHTML = "";
}

// Load the saved search settings from localStorage
function loadSearchSettings() {
    // Pull the currently saved settings (or just nothing if its blank)
    let savedSearchSettings = storage.getSearchSettings();

    // Load classes (they're radio buttons so checking 1 will un-check the others)
    document.querySelector("#"+savedSearchSettings.class).checked = true;

    // Load levels
    // Uncheck all at first
    for (let field of levelField) {
        field.checked = false;
    }
    // Then go through the saved list and re-check everything (the saved data is the id of the fields)
    for (let field of savedSearchSettings.levels) {
        document.querySelector("#"+field).checked = true;
    }

    // Load schools of magic
    // Uncheck them all at first
    for (let field of schoolField) {
        field.checked = false;
    }
    // Then go through the saved list and re-check everything (the saved data is the id of the fields)
    for (let field of savedSearchSettings.schools) {
        document.querySelector("#"+field).checked = true;
    }
}

// Save the current search settings to local storage
function saveSearchSettings() {
    // Create an empty JSON object to store everything to
    let searchSettings = storage.getDefaultSearchSettings();

    // Save the class selected
    for (let field of classField) {
        if (field.checked) { // This field was selected
            searchSettings.class = field.id;
        }
    }

    // Save the levels selected if any
    for (let field of levelField) {
        if (field.checked) { // This field was selected
            searchSettings.levels.push(field.id);
        }
    }

    // Save the schools selected if any
    for (let field of schoolField) {
        if (field.checked) { // This field was selected
            searchSettings.schools.push(field.id);
        }
    }

    // Save the formatted search settings
    storage.writeSearchSettings(searchSettings);
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

// Compile all the buttons and data
function init()
{
    // Get references to everything
    classField = document.querySelectorAll(".input-class");
    levelField = document.querySelectorAll(".input-level");
    schoolField = document.querySelectorAll(".input-school");
    searchButton = document.querySelector("#btn-search");
    clearButton = document.querySelector("#btn-clear-all");
    outputResult = document.querySelector("#output");
    outputStatus = document.querySelector("#element-status");

    // Hook up the buttons to the propper functions
    searchButton.onclick = search;
    clearButton.onclick = clear;

    // Save whatever the basic HTML entered was as the default text for the status to return to
    baseStatus = outputStatus.innerHTML;

    // Load the search settings if there are any saved
    loadSearchSettings();

    // Load the calculated character if there is one
    loadCalculatedCharacter();

    // Set up every button to save to local storage whenever they change
    for (let field of classField) {
        field.onchange = saveSearchSettings;
    }
    for (let field of levelField) {
        field.onchange = saveSearchSettings;
    }
    for (let field of schoolField) {
        field.onchange = saveSearchSettings;
    }
}

window.onload = init;