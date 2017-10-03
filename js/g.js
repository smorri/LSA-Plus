/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global console: false */
/*global prompt: false */

/* Last JSLINT Check: 1/29/16 (No Changes Made) */

var doc = document;

function loadFonts() {
    "use strict";
    var l = doc.createElement('link');
    l.rel = "stylesheet";
    l.type = "text/css";
    l.href = "https://fonts.googleapis.com/css?family=PT+Sans|Quicksand";
    doc.head.appendChild(l);
}

function updateScript() {
    "use strict";
    var l, u, f = doc.getElementById('footer_select'), si = f.querySelector('option:checked').value, s = doc.querySelector('link[href*="font-awesome"]');
    if (s !== undefined && si === "79") {
        u = s.href;
        s.href = u.replace("4.1.0", "4.4.0");
    } else if (s === null) {
        l = doc.createElement('link');
        l.rel = "stylesheet";
        l.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css";
        doc.head.appendChild(l);
    } else { return; }
}

$(doc).ready(function () {
    "use strict";
	loadFonts();
	updateScript();
});



