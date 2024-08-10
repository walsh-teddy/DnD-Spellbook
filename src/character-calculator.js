import * as storage from "./local-storage.js";

// Set up all of the references as empty variables to be filled in init
let classField;
let levelField;
let modifierField;
let calculateButton;
let clearButton;
let outputResult;
let outputStatus;

let baseStatus;

// Reference for converting level number to level text ()
const playerLevelText = [
    "Doesn't have a level because they're a NOOB",
    "1st level",
    "2nd level",
    "3rd level",
    "4th level",
    "5th level",
    "6th level",
    "7th level",
    "8th level",
    "9th level",
    "10th level",
    "11th level",
    "12th level",
    "13th level",
    "14th level",
    "15th level",
    "16th level",
    "17th level",
    "18th level",
    "19th level",
    "20th level"
];
const spellLevelText = [
    "cantrip",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th"
];

function calculate() {
    // Update the status text
    outputStatus.innerHTML = "Calculating...";
    calculateButton.classList.add("is-loading");

    // Store the selected info
    let selectedClass = classField.value;
    let selectedLevel = parseInt(levelField.value);
    let selectedModifier = parseInt(modifierField.value);

    let callback;

    // Run the different calculations based on the selected class
    switch (selectedClass) {
        case "bard":
            callback = calcBard;
            break;
        case "cleric":
            callback = calcCleric;
            break;
        case "druid":
            callback = clacDruid;
            break;
        case "paladin":
            callback = calcPaladin;
            break;
        case "ranger":
            callback = calcRanger;
            break;
        case "sorcerer":
            callback = calcSorcerer;
            break;
        case "warlock":
            callback = calcWarlock;
            break;
        case "wizard":
            callback = calcWizard;
            break;
    }

    callback(selectedLevel, selectedModifier);
}

function calcBard(level, mod) {
    // Calculate the spellsKnown and cantrip count
    const levelBreakdown = [
        {}, // 0
        {cantripCount: 2, spellsKnownCount: 4}, // 1
        {cantripCount: 2, spellsKnownCount: 5}, // 2
        {cantripCount: 2, spellsKnownCount: 6}, // 3
        {cantripCount: 3, spellsKnownCount: 7}, // 4
        {cantripCount: 3, spellsKnownCount: 8}, // 5
        {cantripCount: 3, spellsKnownCount: 9}, // 6
        {cantripCount: 3, spellsKnownCount: 10}, // 7
        {cantripCount: 3, spellsKnownCount: 11}, // 8
        {cantripCount: 3, spellsKnownCount: 12}, // 9
        {cantripCount: 4, spellsKnownCount: 14}, // 10
        {cantripCount: 4, spellsKnownCount: 15}, // 11
        {cantripCount: 4, spellsKnownCount: 15}, // 12
        {cantripCount: 4, spellsKnownCount: 16}, // 13
        {cantripCount: 4, spellsKnownCount: 18}, // 14
        {cantripCount: 4, spellsKnownCount: 19}, // 15
        {cantripCount: 4, spellsKnownCount: 19}, // 16
        {cantripCount: 4, spellsKnownCount: 20}, // 17
        {cantripCount: 4, spellsKnownCount: 22}, // 18
        {cantripCount: 4, spellsKnownCount: 22}, // 19 
        {cantripCount: 4, spellsKnownCount: 22} // 20
    ];

    // Format the text
    let cantripText = `They have ${levelBreakdown[level].cantripCount} cantrips. 
        These cannot be switched out ever so be carful!`;
    let spellsKnownText = `They know ${levelBreakdown[level].spellsKnownCount} spells. 
        1 spell can be switched out when they level up, which isn't a lot so be carful!`;
    let spellsPreparedText = `They have all their kown spells prepared.`;

    display("Bard", level, mod, "charisma", cantripText, spellsKnownText, spellsPreparedText);

}
function calcCleric(level, mod) {
    // Calculate cantrip count
    const levelBreakdown = [
        {}, // 0
        {cantripCount: 3}, // 1
        {cantripCount: 3}, // 2
        {cantripCount: 3}, // 3
        {cantripCount: 4}, // 4
        {cantripCount: 4}, // 5
        {cantripCount: 4}, // 6
        {cantripCount: 4}, // 7
        {cantripCount: 4}, // 8
        {cantripCount: 4}, // 9
        {cantripCount: 5}, // 10
        {cantripCount: 5}, // 11
        {cantripCount: 5}, // 12
        {cantripCount: 5}, // 13
        {cantripCount: 5}, // 14
        {cantripCount: 5}, // 15
        {cantripCount: 5}, // 16
        {cantripCount: 5}, // 17
        {cantripCount: 5}, // 18
        {cantripCount: 5}, // 19 
        {cantripCount: 5} // 20
    ];

    // Calculate prepared spells (wis modifier + cleric level (min of 1))
    let preparedSpells = mod + level;
    if (preparedSpells < 1) {
        preparedSpells = 1;
    }

    // Format the text
    let cantripText = `They have ${levelBreakdown[level].cantripCount} cantrips.
        These cannot be switched out ever so be carful!`;
    let spellsKnownText = `They know every spell in the cleric spell list and are instead limited by what they prepare each day.
        This is a very strong ability!`;
    let spellsPreparedText = `They can prepare ${preparedSpells} spells after a long rest.`;

    display("Cleric", level, mod, "wisdom", cantripText, spellsKnownText, spellsPreparedText);

}
function clacDruid(level, mod) {
    // Calculate the cantrip count
    const levelBreakdown = [
        {}, // 0
        {cantripCount: 2}, // 1
        {cantripCount: 2}, // 2
        {cantripCount: 2}, // 3
        {cantripCount: 3}, // 4
        {cantripCount: 3}, // 5
        {cantripCount: 3}, // 6
        {cantripCount: 3}, // 7
        {cantripCount: 3}, // 8
        {cantripCount: 3}, // 9
        {cantripCount: 4}, // 10
        {cantripCount: 4}, // 11
        {cantripCount: 4}, // 12
        {cantripCount: 4}, // 13
        {cantripCount: 4}, // 14
        {cantripCount: 4}, // 15
        {cantripCount: 4}, // 16
        {cantripCount: 4}, // 17
        {cantripCount: 4}, // 18
        {cantripCount: 4}, // 19 
        {cantripCount: 4} // 20
    ];

    // Calculate prepared spells (wis modifier + druid level (min of 1))
    let preparedSpells = mod + level;
    if (preparedSpells < 1) {
        preparedSpells = 1;
    }

    // Format the text
    let cantripText = `They have ${levelBreakdown[level].cantripCount} cantrips.
        These cannot be switched out ever so be carful!`;
    let spellsKnownText = `They know every spell in the druid spell list and are instead limited by what they prepare each day.
        This is a very strong ability!`;
    let spellsPreparedText = `They can prepare ${preparedSpells} spells after a long rest.`;

    display("Druid", level, mod, "wisdom", cantripText, spellsKnownText, spellsPreparedText);

}
function calcPaladin(level, mod) {
    // Calculate prepared spells (cha modifier + paladin level / 2 (rounded down) (min of 1))
    let preparedSpells = mod + parseInt(level / 2);
    if (preparedSpells < 1) {
        preparedSpells = 1;
    }

    // Format the text
    let cantripText;
    let spellsKnownText;
    let spellsPreparedText;
    // Paladins don't have spellcasting until 2nd level
    if (level > 1) { // They have spellcasting
        cantripText = `Paladins don't have cantrips.`;
        spellsKnownText = `They know every spell in the paladin spell list and are instead limited by what they prepare each day.
            This is a very strong ability!`;
        spellsPreparedText = `They can prepare ${preparedSpells} spells after a long rest.`;
    }
    else { // They don't yet have spellcasting
        cantripText = spellsKnownText = spellsPreparedText = `Paladins don't get spellcasting until 2nd level!`;
    }
    display("Paladin", level, mod, "charisma", cantripText, spellsKnownText, spellsPreparedText);
}
function calcRanger(level, mod) {
    // Calculate the spellsKnown and cantrip count
    const levelBreakdown = [
        {}, // 0
        {spellsKnownCount: 0}, // 1
        {spellsKnownCount: 2}, // 2
        {spellsKnownCount: 3}, // 3
        {spellsKnownCount: 3}, // 4
        {spellsKnownCount: 4}, // 5
        {spellsKnownCount: 4}, // 6
        {spellsKnownCount: 5}, // 7
        {spellsKnownCount: 5}, // 8
        {spellsKnownCount: 6}, // 9
        {spellsKnownCount: 6}, // 10
        {spellsKnownCount: 7}, // 11
        {spellsKnownCount: 7}, // 12
        {spellsKnownCount: 8}, // 13
        {spellsKnownCount: 8}, // 14
        {spellsKnownCount: 9}, // 15
        {spellsKnownCount: 9}, // 16
        {spellsKnownCount: 10}, // 17
        {spellsKnownCount: 10}, // 18
        {spellsKnownCount: 11}, // 19 
        {spellsKnownCount: 11} // 20
    ];

    // Format the text

    let cantripText;
    let spellsKnownText;
    let spellsPreparedText;
    // Paladins don't have spellcasting until 2nd level
    if (level > 1) { // They have spellcasting
        cantripText = `Rangers don't have cantrips.`;
        spellsKnownText = `They know ${levelBreakdown[level].spellsKnownCount} spells. 
            1 spell can be switched out when they level up, which isn't a lot so be carful!`;
        spellsPreparedText = `They have all their kown spells prepared.`;
    }
    else { // They don't yet have spellcasting
        cantripText = spellsKnownText = spellsPreparedText = `Rangers don't get spellcasting until 2nd level!`;
    }
    display("Ranger", level, mod, "wisdom", cantripText, spellsKnownText, spellsPreparedText);
}
function calcSorcerer(level, mod) {
    // Calculate the spellsKnown and cantrip count
    const levelBreakdown = [
        {}, // 0
        {cantripCount: 4, spellsKnownCount: 2}, // 1
        {cantripCount: 4, spellsKnownCount: 3}, // 2
        {cantripCount: 4, spellsKnownCount: 4}, // 3
        {cantripCount: 5, spellsKnownCount: 5}, // 4
        {cantripCount: 5, spellsKnownCount: 6}, // 5
        {cantripCount: 5, spellsKnownCount: 7}, // 6
        {cantripCount: 5, spellsKnownCount: 8}, // 7
        {cantripCount: 5, spellsKnownCount: 9}, // 8
        {cantripCount: 5, spellsKnownCount: 10}, // 9
        {cantripCount: 6, spellsKnownCount: 11}, // 10
        {cantripCount: 6, spellsKnownCount: 12}, // 11
        {cantripCount: 6, spellsKnownCount: 12}, // 12
        {cantripCount: 6, spellsKnownCount: 13}, // 13
        {cantripCount: 6, spellsKnownCount: 13}, // 14
        {cantripCount: 6, spellsKnownCount: 14}, // 15
        {cantripCount: 6, spellsKnownCount: 14}, // 16
        {cantripCount: 6, spellsKnownCount: 15}, // 17
        {cantripCount: 6, spellsKnownCount: 15}, // 18
        {cantripCount: 6, spellsKnownCount: 15}, // 19 
        {cantripCount: 6, spellsKnownCount: 15} // 20
    ];

    // Format the text
    let cantripText = `They have ${levelBreakdown[level].cantripCount} cantrips. 
        These cannot be switched out ever so be carful!`;
    let spellsKnownText = `They know ${levelBreakdown[level].spellsKnownCount} spells. 
        1 spell can be switched out when they level up, which isn't a lot so be carful!`;
    let spellsPreparedText = `They have all their kown spells prepared.`;

    display("Sorcerer", level, mod, "charisma", cantripText, spellsKnownText, spellsPreparedText);
}
function calcWarlock(level, mod) {
    const levelBreakdown = [
        {}, // 0
        {cantripCount: 2, spellsKnownCount: 2, mysticArcanum:[]}, // 1
        {cantripCount: 2, spellsKnownCount: 3, mysticArcanum:[]}, // 2
        {cantripCount: 2, spellsKnownCount: 4, mysticArcanum:[]}, // 3
        {cantripCount: 3, spellsKnownCount: 5, mysticArcanum:[]}, // 4
        {cantripCount: 3, spellsKnownCount: 6, mysticArcanum:[]}, // 5
        {cantripCount: 3, spellsKnownCount: 7, mysticArcanum:[]}, // 6
        {cantripCount: 3, spellsKnownCount: 8, mysticArcanum:[]}, // 7
        {cantripCount: 3, spellsKnownCount: 9, mysticArcanum:[]}, // 8
        {cantripCount: 3, spellsKnownCount: 10, mysticArcanum:[]}, // 9
        {cantripCount: 4, spellsKnownCount: 10, mysticArcanum:[]}, // 10
        {cantripCount: 4, spellsKnownCount: 11, mysticArcanum:[6]}, // 11
        {cantripCount: 4, spellsKnownCount: 11, mysticArcanum:[6]}, // 12
        {cantripCount: 4, spellsKnownCount: 12, mysticArcanum:[6, 7]}, // 13
        {cantripCount: 4, spellsKnownCount: 12, mysticArcanum:[6, 7]}, // 14
        {cantripCount: 4, spellsKnownCount: 13, mysticArcanum:[6, 7, 8]}, // 15
        {cantripCount: 4, spellsKnownCount: 13, mysticArcanum:[6, 7, 8]}, // 16
        {cantripCount: 4, spellsKnownCount: 14, mysticArcanum:[6, 7, 8, 9]}, // 17
        {cantripCount: 4, spellsKnownCount: 14, mysticArcanum:[6, 7, 8, 9]}, // 18
        {cantripCount: 4, spellsKnownCount: 15, mysticArcanum:[6, 7, 8, 9]}, // 19 
        {cantripCount: 4, spellsKnownCount: 15, mysticArcanum:[6, 7, 8, 9]} // 20
    ];

    // Warlocks are WEIRD
    // Format the text
    let mysticArcanum = levelBreakdown[level].mysticArcanum;
    let cantripText = `They have ${levelBreakdown[level].cantripCount} cantrips. 
        These cannot be switched out ever so be carful!`;
    // Have different text if they have mystic arcanum
    let spellsKnownText;
    if (mysticArcanum[0]) { // They have mystic arcanum
        spellsKnownText = `Warlocks are very strange. They know ${levelBreakdown[level].spellsKnownCount} spells of 5th level or lower,
            but also they can have 1 spell of each of the following levels: `;
        for (let index in mysticArcanum) {
            // Using for...in intentionally so I can use the indexes
            spellsKnownText += spellLevelText[mysticArcanum[index]];
            if (index != mysticArcanum.length - 1 && mysticArcanum.length > 2) { // Its not the last index and the list is long enough to use a ,
                spellsKnownText += ", ";
            }
            if (index == mysticArcanum.length - 2) { // its the 2nd to last index
                spellsKnownText += "and ";
            }
        }
    }
    else { // They don't yet have mystic arcanum
        spellsKnownText = `They know ${levelBreakdown[level].spellsKnownCount} spells. 
            1 spell can be switched out when they level up, which isn't a lot so be carful!`;
    }
    let spellsPreparedText = `They have all their kown spells prepared.`;

    display("Warlock", level, mod, "charisma", cantripText, spellsKnownText, spellsPreparedText);
}
function calcWizard(level, mod) {
    // Calculate cantrip count
    const levelBreakdown = [
        {}, // 0
        {cantripCount: 3}, // 1
        {cantripCount: 3}, // 2
        {cantripCount: 3}, // 3
        {cantripCount: 4}, // 4
        {cantripCount: 4}, // 5
        {cantripCount: 4}, // 6
        {cantripCount: 4}, // 7
        {cantripCount: 4}, // 8
        {cantripCount: 4}, // 9
        {cantripCount: 5}, // 10
        {cantripCount: 5}, // 11
        {cantripCount: 5}, // 12
        {cantripCount: 5}, // 13
        {cantripCount: 5}, // 14
        {cantripCount: 5}, // 15
        {cantripCount: 5}, // 16
        {cantripCount: 5}, // 17
        {cantripCount: 5}, // 18
        {cantripCount: 5}, // 19 
        {cantripCount: 5} // 20
    ];

    // Calculate spells prepared (wizard level + intelligence modifier (minimum of 1))
    let preparedSpells = level + mod;
    if (preparedSpells < 1) {
        preparedSpells = 1;
    }

    // Calculate known spells (starts at 6 at 1st level and gets 2 more each level)
    let knownSpells = 6 + ((level - 1) * 2);

    // Format the text
    let cantripText = `They have ${levelBreakdown[level].cantripCount} cantrips. 
        These cannot be switched out ever so be carful!`;
    let spellsKnownText = `They have ${knownSpells} spells in their spellbook 
        and can copy more in if they find other wizard spells, such as spell scrolls.`;
    let spellsPreparedText = `They can prepare ${preparedSpells} spells from their spellbook every day.`;

    display("Wizard", level, mod, "intelligence", cantripText, spellsKnownText, spellsPreparedText);
}

function display(className, level, modifierNum, modifierName, cantrips, spellsKnown, spellsPrepared) {
    // Format the string
    let modifierNumDisplay;
    // Give the modifier a + if nescesary
    if (modifierNum >= 0) { // Give it a +
        modifierNumDisplay = `+${modifierNum}`;
    }
    else { // Don't give it a +
        modifierNumDisplay = modifierNum;
    }

    let HTML = `
    <div class="box has-background-light" id="calc-chr">
        <h2 class="subtitle has-text-weight-bold mb-1">A ${className} at ${playerLevelText[level]} with a ${modifierNumDisplay} ${modifierName} has...</h2>
        <div><strong>Cantrips:</strong> ${cantrips}</div>
        <div><strong>Spells Known:</strong> ${spellsKnown}</div>
        <div><strong>Spells Prepared:</strong> ${spellsPrepared}</div>
    </div>
    `;

    // Put the string on the page
    outputResult.innerHTML = HTML;

    // Save the calculated character
    saveCalculatedCharacter();

    // Update the status
    outputStatus.innerHTML = "Calculations complete!";
    calculateButton.classList.remove("is-loading");
}

function clear() {
    outputStatus.innerHTML = baseStatus;
    outputResult.innerHTML = "";
}

// Load the saved calculate settings from localStorage
function loadCalculateSettings() {
    // Pull the currently saved settings (or just nothing if its blank)
    let savedCalculateSettings = storage.getCalculateSettings();

    // Load classes (they're radio buttons so checking 1 will un-check the others)
    document.querySelector("#"+savedCalculateSettings.class).selected = true;

    // Load level
    document.querySelector("#"+savedCalculateSettings.level).selected = true;

    // Load modifier
    document.querySelector("#"+savedCalculateSettings.modifier).selected = true;
}

// Save the current search settings to local storage
function saveCalculateSettings() {
    // Create an empty JSON object to store everything to
    let calculateSettings = storage.getDefaultCalculateSettings();

    // Save the class selected
    calculateSettings.class = classField.selectedOptions[0].id;

    // Save the level selected
    calculateSettings.level = levelField.selectedOptions[0].id;

    // Save the modifier selected
    calculateSettings.modifier = modifierField.selectedOptions[0].id;

    // Save the formatted search settings
    storage.writeCalculateSettings(calculateSettings);
}

function saveCalculatedCharacter() {
    storage.writeCalculatedCharacter(document.querySelector("#calc-chr").innerHTML);
}

// Compile everything
function init()
{
    // Get references to everything
    classField = document.querySelector("#field-class");
    levelField = document.querySelector("#field-level");
    modifierField = document.querySelector("#field-modifier");
    calculateButton = document.querySelector("#btn-calculate");
    clearButton = document.querySelector("#btn-clear-all");
    outputResult = document.querySelector("#output");
    outputStatus = document.querySelector("#element-status");

    // Hook up the buttons to the propper functions
    calculateButton.onclick = calculate;
    clearButton.onclick = clear;

    // Save whatever the basic HTML entered was as the default text for the status to return to
    baseStatus = outputStatus.innerHTML;

    // Load the search settings if there are any saved
    loadCalculateSettings();

    // Set up every field to save to local storage whenever they change
    classField.onchange = saveCalculateSettings;
    levelField.onchange = saveCalculateSettings;
    modifierField.onchange = saveCalculateSettings;
}

window.onload = init;