/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global chrome: false */
/*global il_DB: false */
/*global console: false */
/*global prompt: false */

/* Last JSLINT Check: 1/23/16 (No Changes Made) */

function initialize() {
	'use strict';
	var si, ei, uid, un, t, doc = document, loc = location, yes = doc.querySelector('input[value=Yes]');

	function remove() {
		si = loc.search.lastIndexOf('=');
		ei = loc.search.length;
		uid = loc.search.slice(si + 1, ei);

		yes.addEventListener('click', function () {
			chrome.runtime.sendMessage({type: '[REMOVE_USER]', data: uid, flag: true});
		});
	}// end remove()

	function add() {
		si = loc.search.lastIndexOf('=');
		ei = loc.search.length;
		uid = loc.search.slice(si + 1, ei);
		t = doc.getElementById('usercp_content').getElementsByClassName('blocksubhead')[0].innerText;

		un = t.match('add(.*)to')[1].trim();

		yes.addEventListener('click', function () {
			chrome.runtime.sendMessage({type: '[ADD_USER]', data: {id: uid, name: un, message: 'VOID'}});
		});
	}// end add()

	if (location.href.indexOf('addlist') > 0) { add(); }
	if (location.href.indexOf('removelist') > 0) { remove(); }
}

initialize();