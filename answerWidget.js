/**
 * Ratio Problem Template WebComponent
 * @author Jim Goodell
 */
 customElements.define('answer-widget', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
  
    <input type="text">
    <input type="button">`;
    
  }
});
/**
 * EXAMPLE HTML:
 * <answer-widget>
 */