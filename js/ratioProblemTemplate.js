/**
 * Ratio Problem Template WebComponent
 * @author Jim Goodell
 */
 customElements.define('ratio-problem-002', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
    <!-- METADATA FOR THE PROBLEM TEMPLATE -- Perhaps this could all be just a link to a separate metadata file ???-->
    <!-- The xAPI profile should be defined here so the other components know how to handle events. -->
    <meta itemprop="xapiprofile" content="http://profiles.usalearning.net/xapi/043b24b4-4389-435f-b052-805fd5563166/v/1"/>
    <!-- END METADATA -->
    
    <!-- STYLES FOR THIS PROBLEM TYPE -->
    <style>
      i, #variable {color: blue;}
      span.frac {display: inline-block; text-align: center; vertical-align: middle;}
      span.frac > sup, span.frac > sub {display: block; font: inherit; padding: 0 0.3em;}
      span.frac > sup {border-bottom: 0.08em solid;}
      span.frac > span {display: none;}
      #hintTable {border: 1px solid black; font: 12px Arial, sans-serif; width: 300px;}
      #hintCell, #hintLabel {padding: 8px;}
      #hintLabel {padding: 8px; width: 20px; background-color: #dddddd; text-align:center;}
      #hint1, #hint2, #hint3, #hint4, #hint5, #hint6, #div-correct-feedback, #div-decimal-feedback {visibility: hidden;}
      #feedback {color: blue; backgroung-color: white; text-align: left; padding: 8px;}
    </style>
    <!-- END STYLES -->
    
    <!-- The problem template -->
    <div id="stimulus"><p>Solve for <i>
    ${this.getAttribute('variable-letter')}</i>.</p><p><span class="frac"><sup>
    ${this.getAttribute('numerator-left')}</sup><span>&frasl;</span><sub><i>
    ${this.getAttribute('variable-letter')}</i></sub></span>&nbsp;=&nbsp;<span class="frac"><sup>
    ${this.getAttribute('numerator-right')}</sup><span>&frasl;</span><sub>
    ${this.getAttribute('denominator-right')}</sub></span></p></p><p><i>r</i>&nbsp;=&nbsp;
    <input id="response" type="text"></input></p></div>`;
  }
});
/**
 * EXAMPLE HTML:
 * <ratio-problem-002 id="myRationProblem" variable-letter="y" numerator-left="4"  numerator-right="5" denominator-right="10"></ratio-problem-001>
 */

/**
 * @TODO Add code to calculate correct answer.
 * @TODO Add available hints with calculated content using generic hint webComponent.
 * @TODO Add formative responses to learner based on certain incorrect answers.
 */
 
