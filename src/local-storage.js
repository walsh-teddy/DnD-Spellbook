// Empty spellbook
const defaultData = {
    // The spellbook will hold a list of links to spells, which will be put into the cards
    "spellbook": [],
    "searchSettings": {
        "class": "btn-class-any",
        "levels": [],
        "schools": []
    },
    "calculateSettings": {
        "class":"class-bar",
        "level":"level-1",
        "modifier":"modifier-plu-0"
    },
    "calculatedCharacter": ""
}
// Key used to find this local data
const storeName = "tjw6911-330-p1";

// Gets the up-to-date data from local storage
const readLocalStorage = () => {
    let allValues = null;

    try {
        allValues = JSON.parse(localStorage.getItem(storeName)) || defaultData;
    }
    catch(error) {
        console.log(`Problem with JSON.parse() and ${storeName} !`);
        throw error;
    }

    return allValues;
};

// Overwrites local storage with a new value
const writeLocalStorage = (allValues) => {
    localStorage.setItem(storeName, JSON.stringify(allValues));
};

export const clearLocalStorage = () => writeLocalStorage(defaultData);

// Return the list of spell SRCs
export const getSpellbook = () => {
    return (readLocalStorage().spellbook);
}

// Overwrite the current spellbook
export const writeSpellbook = (newSpellbook) => {
    let newData = readLocalStorage();
    newData.spellbook = newSpellbook;
    writeLocalStorage(newData);
}

export const spellInBook = (spellSRC) => {
    // Loop through the spellbook
    for (let spell of getSpellbook()) {
        if (spell == spellSRC) { // It is in the book
            return true;
        }
    }

    // If it got here without ever returning true, that means its not in the book
    return false;
}

// Add a spell to the spellbook
export const addSpell = (spellSRC) => {
    console.log("Adding ", spellSRC);
    // Make sure its not there already
    if (spellInBook(spellSRC)) { // It is in the book already
        console.log(`Already in book: ${spellSRC}`);
    }
    else { // Its not yet in the book and should be added
        // Add the spell
        let newSpellbook = getSpellbook();
        newSpellbook.push(spellSRC);
        writeSpellbook(newSpellbook);
    }
}

// Remove a spell from the spellbook
export const removeSpell = (spellSRC) => {
    console.log("Removing ", spellSRC);
    // Make sure its in there
    if (!spellInBook(spellSRC)) {// It is already not in there
        console.log(`Already not in book: ${spellSRC}`);
    }
    else { // It is in the book and should be removed
        // Remove the spell
        let newSpellbook = getSpellbook();
        newSpellbook.splice(newSpellbook.indexOf(spellSRC), 1);
        writeSpellbook(newSpellbook);
    }
}

export const clearSpellbook = () => {
    writeSpellbook(getDefaultSpellbook());
}

// Return the saved search settings
export const getSearchSettings = () => {
    return readLocalStorage().searchSettings;
}

export const writeSearchSettings = (newSearchSettings) => {
    let newData = readLocalStorage();
    newData.searchSettings = newSearchSettings;
    writeLocalStorage(newData);
}

export const clearSearchSettings = () => {
    writeSearchSettings(getDefaultSearchSettings());
}

export const getCalculateSettings = () => {
    return readLocalStorage().calculateSettings;
}

export const writeCalculateSettings = (newCalculateSettings) => {
    let newData = readLocalStorage();
    newData.calculateSettings = newCalculateSettings;
    writeLocalStorage(newData);
}

export const clearCalculateSettings = () => {
    writeCalculateSettings(getDefaultCalculateSettings());
}

export const getCalculatedCharacter = () => {
    return readLocalStorage().calculatedCharacter;
}

export const writeCalculatedCharacter = (newCalculatedCharacter) => {
    let newData = readLocalStorage();
    newData.calculatedCharacter = newCalculatedCharacter;
    writeLocalStorage(newData);
}

const getDefault = () => {
    return defaultData;
}

export const getDefaultSpellbook = () => {
    return getDefault().spellbook;
}

export const getDefaultSearchSettings = () => {
    return getDefault().searchSettings;
}

export const getDefaultCalculateSettings = () => {
    return getDefault().calculateSettings;
}