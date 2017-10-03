/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global console: false */
/*global prompt: false */
/*global chrome: false */
/*global il_DB: false */

/* Last JSLINT Check: 1/29/16 (No Changes Made) */

function initialize() {
	'use strict';
	var doc = document, w = doc.getElementById('modal-w');

	function save() {
		var ignore_plugin = { status: doc.getElementById('ignoreSwitch').checked,
							  iq_val: doc.getElementById('ignore-q-v').checked,
							  it_val: doc.getElementById('ignore-t-v').checked },
		    menu_plugin = { status: doc.getElementById('notifSwitch').checked,
				    		st_val: doc.getElementById('mb-st-v').checked,
							lm_val: doc.getElementById('mb-lm-v').checked},
		    nsfw_plugin = { status: doc.getElementById('nsfwSwitch').checked,
		    				ht_val: doc.getElementById('nsfw-tht-v').checked,
			    			nt_val: doc.getElementById('nsfw-nt-v').checked,
				    		lp_val: doc.getElementById('nsfw-lp-v').value };
		chrome.storage.sync.set({
			// -----------------------------------------------------------
			// Save Ignore List Plugin Settings
			// -----------------------------------------------------------
			ignr_pl: ignore_plugin.status,
			ignr_iq: ignore_plugin.iq_val,
			ignr_it: ignore_plugin.it_val,
			// -----------------------------------------------------------
			// Save NSFW Filter Plugin Settings
			// -----------------------------------------------------------
			nsfw_pl: nsfw_plugin.status,
			nsfw_ht: nsfw_plugin.ht_val,
			nsfw_nt: nsfw_plugin.nt_val,
			nsfw_lp: nsfw_plugin.lp_val,
			// -----------------------------------------------------------
			// Save Menu Bar Plugin Settings
			// -----------------------------------------------------------
			menu_pl: menu_plugin.status,
			menu_st: menu_plugin.st_val,
			menu_lm: menu_plugin.lm_val
		}, function () {
			var s = $('#status');
			s.fadeIn(550);
			s[0].textContent = 'Saved';
			setTimeout(function () { s.fadeOut('slow'); }, 2500);
		});
	}

	function restore() {
		chrome.storage.sync.get(null, function (r) {
			// -----------------------------------------------------------
			// Restore Ignore List Plugin Settings
			// -----------------------------------------------------------
			doc.getElementById('ignoreSwitch').checked = r.ignr_pl;
			doc.getElementById('ignore-q-v').checked = r.ignr_iq;
			doc.getElementById('ignore-t-v').checked = r.ignr_it;

			// ----------------------------------------------------------
			// Restore NSFW Filter Plugin Settings
			// -----------------------------------------------------------
			doc.getElementById('nsfwSwitch').checked = r.nsfw_pl;
			doc.getElementById('nsfw-tht-v').checked = r.nsfw_ht;
			doc.getElementById('nsfw-nt-v').checked = r.nsfw_nt;
			doc.getElementById('nsfw-lp-v').value = r.nsfw_lp;
			// -----------------------------------------------------------
			// Restore Menu Bar Plugin Settings
			// -----------------------------------------------------------
			doc.getElementById('notifSwitch').checked = r.menu_pl;
			doc.getElementById('mb-st-v').checked = r.menu_st;
			doc.getElementById('mb-lm-v').checked = r.menu_lm;
			//console.log(r);
		});
	}

	function modal1() {
		var b = { m1: doc.getElementById('export-d'),
				  close: doc.getElementById('export-d-x'),
				  clear: doc.getElementById('export-clear'),
				  cancel: doc.getElementById('export-d-cancel'),
				  confirm: doc.getElementById('export-confirm')},
			bar = b.m1.getElementsByClassName('progress')[0].firstElementChild,
		    textarea = b.m1.getElementsByTagName('textarea')[0];

		w.className = 'modal-show';
		b.m1.className = b.m1.className.replace("modal-target-hide", "modal-target-show");

		b.close.addEventListener('click', function () {
			textarea.value = '';
			bar.className = "val_0";
			w.className = 'modal-hide';
			b.m1.className = b.m1.className.replace("modal-target-show", "modal-target-hide");
		});

		b.clear.addEventListener('click', function () {
			textarea.value = '';
			bar.className = "val_0";
		});

		b.cancel.addEventListener('click', function () {
			textarea.value = '';
			bar.className = "val_0";
			w.className = 'modal-hide';
			b.m1.className = b.m1.className.replace("modal-target-show", "modal-target-hide");
		});

		//console.log(textarea);
		//console.log(bar);
		b.confirm.addEventListener('click', function () {
			il_DB.indexedDB.open();
			il_DB.indexedDB.exportData(textarea, bar);
		});
	}

	function modal3() {
		var b = { m3: doc.getElementById('delete-d'),
				  close: doc.getElementById('delete-d-x'),
				  cancel: doc.getElementById('delete-d-cancel'),
				  confirm: doc.getElementById('delete-confirm')};

		w.className = 'modal-show';
		b.m3.className = b.m3.className.replace("modal-target-hide", "modal-target-show");

		b.close.addEventListener('click', function () {
			w.className = 'modal-hide';
			b.m3.className = b.m3.className.replace("modal-target-show", "modal-target-hide");
		});

		b.cancel.addEventListener('click', function () {
			w.className = 'modal-hide';
			b.m3.className = b.m3.className.replace("modal-target-show", "modal-target-hide");
		});

		b.confirm.addEventListener('click', function () {
			il_DB.indexedDB.open();
			il_DB.indexedDB.clear();
			w.className = 'modal-hide';
			b.m3.className = b.m3.className.replace("modal-target-show", "modal-target-hide");
		});
	}

	w.className = 'modal-hide';

	doc.addEventListener('DOMContentLoaded', restore);
	doc.getElementById('save-b').addEventListener('click', save);
	doc.getElementById('export-btn').addEventListener('click', modal1);
	doc.getElementById('delete-btn').addEventListener('click', modal3);
}

initialize();