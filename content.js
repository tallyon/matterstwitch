// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    var actualCode = ['var file = location.pathname.split( "/" ).pop();',
        'var link = document.createElement( "link" );',
        'link.href = "content.css";',
        'link.type = "text/css";',
        'link.rel = "stylesheet";',
        'link.media = "screen,print";',
        'document.getElementsByTagName( "head" )[0].appendChild( link );'].join('\n');

    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.remove();

    var sheet = window.document.styleSheets[0];
    var emoticonRule = null;
    for(var j = 0; j < window.document.styleSheets.length; j++) {
        var rules = document.styleSheets[j].cssRules;
        for(var i = 0; i < rules.length; i++) {
            if(rules[i].selectorText == undefined) continue;
            
            if(rules[i] != undefined && rules[i].selectorText.toLowerCase() == ".emoticon") {
                document.styleSheets[j].deleteRule(i);
            }
            else if(rules[i] != undefined && rules[i].selectorText.toLowerCase() == ".user-popover") {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                rules[i].style.cssText += "color: rgb(" + r + ", " + g + ", " + b + ");";
            }
        }
    }
    sheet.insertRule('.emoticon { height: 5em; width: 5em; }', 0);
    sheet.insertRule(' * { color: #b19dd8}');
    // sheet.insertRule('.post__header { color: red; }');

    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        sendResponse(document.all[0].outerHTML);
    }
});