const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" 
  integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" 
  crossorigin="anonymous" referrerpolicy="no-referrer"
/>
<div class="hero is-primary p-3">
    <div class="hero-body p-4 is-size-3 columns" id="body">
    </div>
</div>
`;

// YOUR CODE GOES HERE
class CustomHeader extends HTMLElement{
    constructor(){
        super();

        // Attatch a shadow DOM tree to this instance. This creates a shadow root for us
        this.attachShadow({mode: "open"});

        // Create the span element and add it to the shadow dom
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // This line of code will create an property named `span` for us, so that we don't have to keep calling this.shadowRoot.querySelector("span");
        this.body = this.shadowRoot.querySelector("#body");
    }

    // Watch the 2 data attributes
    static get observedAttributes()
    {
        return ["data-title"];
    }

    attributeChangedCallback(attributeName, oldVal, newVal)
    {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    // Called when the component is added to the page
    connectedCallback()
    {
        this.render();
    }

    disconnectedCallback(){}

    // A helper method to display the values of the attributes
    render()
    {
        const title = this.getAttribute('data-title') ? this.getAttribute('data-name') : "D&D Spellbook";

        this.body.innerHTML = `
        <a class="navbar-item" href="index.html">
            <i class="fas fa-book"></i>
        </a>
        <strong>
            ${title}
        </strong>
        `;
    }
} 

customElements.define('custom-header', CustomHeader);