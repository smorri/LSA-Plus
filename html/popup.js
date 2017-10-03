/* Last JSLINT Check: 1/29/16 (No Changes Made) */

(function () {
	'use strict';
	document.querySelector('#prefs').addEventListener('click', function () {
		if (chrome.runtime.openOptionsPage) { chrome.runtime.openOptionsPage(); }
		else { window.open(chrome.runtime.getURL('/html/options.html')); }
	});

	chrome.storage.local.get('synced', function (r) {
		document.querySelector('#date').innerText = r.synced;
	});
}());