/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global chrome: false */
/*global il_DB: false */
/*global console: false */
/*global prompt: false */

/* Last JSLINT Check: 1/23/16 (No Changes Made) */

chrome.runtime.onInstalled.addListener(function (details) {
	'use strict';
	if (details.reason == 'install') {
		console.log('BACKGROUND --- onInstalled()');
		chrome.storage.sync.set({
			// -----------------------------------------------------------
			// Default Ignore List Plugin Settings
			// -----------------------------------------------------------
			ignr_pl: true,
			ignr_iq: false,
			ignr_it: false,
			// -----------------------------------------------------------
			// Default NSFW Filter Plugin Settings
			// -----------------------------------------------------------
			nsfw_pl: true,
			nsfw_ht: false,
			nsfw_nt: false,
			nsfw_lp: 7,
			// -----------------------------------------------------------
			// Default Menu Bar Plugin Settings
			// -----------------------------------------------------------
			menu_pl:  true,
			menu_st: false
		});
	} else if (details.reason == 'update') {
		chrome.storage.local.remove('u_avatar');	// Reset Avatar for v 2.2.1
	}
});

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
	'use strict';
	function remove(data, flag) {
		console.log('BACKGROUND --- remove()');
		il_DB.indexedDB.open();
		il_DB.indexedDB.remove(data, flag);
	}

	function add(data) {
		console.log('BACKGROUND --- add()');
		il_DB.indexedDB.open();
		il_DB.indexedDB.add(data.id, data.name, data.message);
	}

	function get(data) {
		console.log('BACKGROUND --- get()');
		il_DB.indexedDB.open();
		il_DB.indexedDB.get(data);
	}

	function userids() {
		console.log('BACKGROUND --- userids()');
		il_DB.indexedDB.ids();
	}

	function usernames() {
		console.log('BACKGROUND --- quotes()');
		il_DB.indexedDB.usernames();
	}

	function avatar(u) {
		console.log('BACKGROUND --- avatar()');
		var c;
		chrome.storage.local.get('u_avatar', function (data) {
			if ($.isEmptyObject(data.u_avatar)) {
				console.log('---- Fetching Avatar URL ----');
				$.ajax({type: 'GET', url: u}).done(function (r) {
					c = $(r).find('#user_avatar')[0];
					if (c === undefined) {
						c = '/images/tf_ideal/misc/avatar.png';
					} else {
						c = c.src;
						c = c.match('/images\/(.*)')[0].trim();
					}
					chrome.storage.local.set({u_avatar: c});
					sendResponse({message: c});
				});
			} else { sendResponse({message: data.u_avatar}); }
		});
	}
	
	function set(data) {
		chrome.storage.local.set({u_avatar: data});
	}

	console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');

	if (response.type == '[RESTORE_USER]') {
		get(response.data);
	} else if (response.type == '[ADD_USER]') {
		add(response.data);
	} else if (response.type == '[REMOVE_USER]') {
		remove(response.data, response.flag);
	} else if (response.type == '[HIDE_THREAD]') {
		userids('[THREADS]');
	} else if (response.type == '[HIDE_QUOTE]') {
		usernames();
	} else if (response.type == '[MENU_AVATAR]') {
		avatar(response.url);
		return true;
	} else if (response.type == '[MENU_SET]') {
		set(response.data);
	}
});