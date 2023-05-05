/**
 * WebComponent to Handle Sending xAPI Event Data
 * @author Jim Goodell
 */
// Include dependent scripts
var script = document.createElement('script');
script.src =
"./js/jimsxapiwrapper.js";
document.head.appendChild(script);
script = document.createElement('script');
script.src =
"./js/cryptojs_v3.1.2.js";
document.head.appendChild(script);
script = document.createElement('script');
script.src =
"./js/xapiwrapper.js";
document.head.appendChild(script);

function send_xapi_statement(xapiStatementObject){
    var conf = {
         "endpoint" : "https://lrs.adlnet.gov/xapi/",
         "auth" : "Basic " + toBase64("xapi-tools:xapi-tools")
         };
    ADL.XAPIWrapper.changeConfig(conf);

    // Set values and set up xAPI Statement in the right format
    var actorName = "Your Name Here..."; // Change this to your name or alias
    var actorMail = "mailto:Tester@example.com";
    var verbId = "http://example.com/xapi/interacted";
    var verbDisplay =  "interacted";
    var objectId = "http://example.com/button_example";
    var objectName =  " Button";
   // We’ll fill in other defaults behind the scenes...
    var statement = setupSimpleXAPI(actorName, actorMail, verbId, verbDisplay, objectId, objectName);

    // Dispatch the statement to the LRS
    var result = ADL.XAPIWrapper.sendStatement(statement);
}