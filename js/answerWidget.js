/**
 * Answer Widget WebComponent
 * @author Aaron Goodell
 */
 customElements.define('answer-widget', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
    <input type="text" value='testing'>
    <input type="button" value="Submit">`;

      this.setAttribute('value','setattr');
      this['value'] = 'changedit';

    this.shadowRoot.lastElementChild.onclick = this.setAttribute('value',this.shadowRoot.firstElementChild.value);
    
    //this['value'] = this.shadowRoot.firstElementChild.value;
    
 
    //this.addEventListener('click', this._onClick);
    //e => alert("Inner target: " + this.shadowRoot.firstElementChild.value);

  }

  //Remove stuff so nothing breaks if the object is removed
  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
  }
});

/**
 * EXAMPLE HTML:
 * <answer-widget>
 */


