const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
<div class="card">
    <div class="card-content">
        <div class="content is-size-7">
        </div>
    <div class="mb-0 mt-0" id="pick-count-container">
    </div>
    <div class="card-content">
        <button
            id="add-btn"
            class="button is-primary is-medium"
            title="Add this spell to your spellbook"
        >
            Add to spellbook
        </button>
    </div>
</div>
`;

// YOUR CODE GOES HERE
class SpellCard extends HTMLElement{
    constructor(){
        super();

        // Attatch a shadow DOM tree to this instance. This creates a shadow root for us
        this.attachShadow({mode: "open"});

        // Create the span element and add it to the shadow dom
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Watch the 2 data attributes
    static get observedAttributes()
    {
        return ["data-src"];
    }

    attributeChangedCallback(attributeName, oldVal, newVal)
    {
        this.src = this.getAttribute("data-src");
        this.loadJsonFetch();
    }

    // Called when the component is added to the page
    connectedCallback()
    {
        // Create easy shorthand variables to reference
        this.content = this.shadowRoot.querySelector(".content");
        this.pickCountContainer = this.shadowRoot.querySelector("#pick-count-container");
        this.button = this.shadowRoot.querySelector("#add-btn");
        this.src = this.getAttribute("data-src");

        // Set up events to functions
        this.button.onclick = e => this.buttonClicked(this);

        // Reference for converting level number to level text (0 to "cantrip", 1 to "1st level", ect)
        this.levelText = [
            "cantrip",
            "1st level",
            "2nd level",
            "3rd level",
            "4th level",
            "5th level",
            "6th level",
            "7th level",
            "8th level",
            "9th level"
        ];
        
        this.content.innerHTML = "Loading...";
    }

    disconnectedCallback() {
        this.button.onclick = null;
    }

    // Parse JSON from the fetched XHR (NOT USED ANYMORE)
    loadJsonXHR() {
		const xhr = new XMLHttpRequest();
		xhr.onload = (e) => {
			console.log(`In onload - HTTP Status Code = ${e.target.status}`);
			try{
				this.json = JSON.parse(e.target.responseText);
			}catch{
				return;
			}

            // Save the spell's ID
            this.spellID = this.json._id;

            this.render();
            this.setOnValueCallback(this.pickCountContainer ,this.spellID);
		}
		xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
		xhr.open("GET", this.src);
		xhr.send();
    }

    // Fetch the JSON from the API
    loadJsonFetch(){
        const fetchPromise = async () => {
            // Get a response from the API
            let response = await fetch(this.src);

            // Test if theres an error
            if (!response.ok) {
                throw new Error(`HTTP error! Status ${response.status}`);
            }

            this.json = await response.json();

            // Save the spell's ID
            this.spellID = this.json._id;

            this.render();
            this.setOnValueCallback(this.pickCountContainer ,this.spellID, this.src);
        }
        fetchPromise()
        .catch(e => {
            console.log(`In catch with e = ${e}`);
            output.innerHTML = "Failure :( Check the console";
        });
    }

    // Update the text and style on the button (if it should say add or remove from spellbook)
    updateButtonCSS() {
        // Test if it should say "add" or "remove"
        if (this.checkCallbackStorage(this.src)) { // It is in the spellbook and should therefor say "remove" and be red
            this.button.classList.remove("is-primary");
            this.button.classList.add("is-danger");
            this.button.innerHTML = "Remove from spellbook";
        }
        else { // It is not yet in the spellbook and should therefor say "add" and be green
            this.button.classList.remove("is-danger");
            this.button.classList.add("is-primary");
            this.button.innerHTML = "Add to spellbook";
        }
    }

    // Add or remove the spell from the spellbook when the button is clicked
    buttonClicked(card) {
        // Check if it should be adding or removing
        if (card.checkCallbackStorage(card.src)) { // Its in the book and should be removed
            // Do this first since removeCallbackStorage() removes the component in spellbook.js
            card.removeCallbackFirebase(card.spellID, card.src);
            card.removeCallbackStorage(card.src); 
        }
        else { // It is not yet in the book and should be added
            card.addCallbackFirebase(card.spellID, card.src);
            card.addCallbackStorage(card.src);
        }

        // After that info is recorded, update the CSS to match the new state
        card.updateButtonCSS();
    }

    // A helper method to display the values of the attributes
    render() {
        // Get shorthands for the json to make typing faster
        let json = this.json

        // Set up the string to create
        let html = "";

        // Add the spell name
        html += `<div class="title has-text-weight-bold is-size-5">${json.name}</div>`;

        // Add level and school (and ritual if it has one)
        html += `<div class="subtitle is-italic is-size-7 mb-2">${this.levelText[json.level]} ${json.school.name.toLowerCase()}`
        if (json.ritual) { // It is a ritual and needs that marked
            html += ` (ritual)`;
        }
        html += `</div>`

        // Add casting time
        html += `<div><span class="has-text-weight-bold">Casting Time: </span>${json.casting_time}</div>`;

        // Add range
        html += `<div><span class="has-text-weight-bold">Range: </span>${json.range}</div>`;

        // Add components
        html += `<div><span class="has-text-weight-bold">Components: </span>`;
        // Loop through each component and add it with a space afterwards
        for (let index in json.components) {
            html += `${json.components[index]}`;
            // Add a comma if its not the last
            if (index < json.components.length - 1) { // It is not the last
                html += `, `;
            }
        }
        // Add material components if it has any (with a space before it)
        if (json.material) { // There are material components
            html += ` (${json.material})`;
        }
        html += `</div>`;

        // Add the duration
        html += `<div><span class="has-text-weight-bold">Duration: </span> `;
        // Add the concentration if there is one
        if (json.concentration) { // It is concentration
            html += `Concentration, `
        }
        html += `${json.duration}</div>`

        // Add the description
        html += `<div>`;
        // Loop through each paragraph and indent them
        for (let index in json.desc) {
            // Start the p (it is closed off before the text is added)
            html += `<p class="mb-0"`;
            // Indent it if its not the first
            if (index != 0) { // It is not the first paragraph
                html += ` style="text-indent: 25px"`;
            }
            // Close off the first <p> tag
            html += `>`;
            // Add the actual paragraph (closing off the first <p> tag and then closing it and the end also)
            html += `${json.desc[index]}</p>`;
        }
        html += `</div>`;

        // Add the higher level effect (if any)
        if (json.higher_level) { // There was a higher level effect found
            html += `<div>`;
            // Loop through each paragraph and indent them
            for (let index in json.higher_level) {
                // Start the p (it is closed off before the text is added)
                html += `<p class="mb-0"`;
                // Indent it if its not the first
                if (index != 0) { // It is not the first paragraph
                    // Indent this paragraph
                    html += ` style="text-indent: 25px">`;
                }
                else { // It is the first paragraph
                    // Close off the first <p> tag and write "At Higher Levels" in bold
                    html += `><span class="has-text-weight-bold">At Higher Levels: </span>`;
                }
                // Add the actual paragraph
                html += `${json.higher_level[index]}</p>`;
            }
            html += `</div>`;
        }

        // Update the actual HTML
        this.content.innerHTML = html;

        // Update the button CSS to match
        this.updateButtonCSS();
    }
} 

customElements.define('spell-card', SpellCard);