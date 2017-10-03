/*global chrome: false */
/*global console: false */

/* Last JSLINT Check: 1/23/16 (No Changes Made) */

(function () {
    'use strict';

	function ajax(f, prev) {
		console.log('AJAX()');
		var d, s, a_i, x, y, z, l, c_f = false, i = 0, u = 'http://www.lipstickalley.com/profile.php?do=ignorelist', a = [], n = {};

		$.ajax({type: 'GET', url: u}).done(function (r) {
			console.log('----- AJAX().done');
			l = $(r).find('#ignorelist li');
			console.log(l);

			while (i < l.length - 1) {
				x = l[i];
				y = x.id.replace('user', '');
				z = x.innerText;
				z = z.replace(/[\u21b5]/g, '').trim();

				if (f) { a.push({id: y, n: z}); }
				// Search by ID
				n[y] = [];
				n[y].push(z);

				// Search by Username: n[z] = y;
				//console.log(a);
				//console.log(n);

				i++;
			}
		}).always(function () {
			if (!f) {
				console.log('----- AJAX().always ----- f = False');
				console.log('RESULT: ', n);
				chrome.storage.local.set({users: n});
			} else {
				console.log('----- AJAX().always ----- f = true');
				i = 0;

				console.log('PREVIOUS LOOKUP : ', prev);

				while (a.length > 0) {
					a_i = a.shift();
					console.log('ARRAY ITEM : ', a_i);

					// Search by ID
					console.log(a_i.id);

					// User not found or Name has changed
					if (prev[a_i.id] === undefined) {
						c_f = true;
						prev[a_i.id] = [];
						prev[a_i.id].push(a_i.n);
						chrome.storage.local.set({users: prev});
					} else if (prev[a_i.id].indexOf(a_i.n) === -1) {
						c_f = true;
						console.log('NAME CHANGED!');
						il_DB.indexedDB.update(a_i.id, a_i.n);

						// Add changed username to group
						prev[a_i.id].push(a_i.n);
						chrome.storage.local.set({users: prev});
					}

					// Search by Username
					// Name Has Changed
					// console.log(a_i.n);
					// if (prev[a_i.n] === undefined) {
					//	console.log("NAME CHANGED");
					//	c_f = true;
					//	il_DB.indexedDB.update(a_i.id, a_i.n);
					//
					//	// Add changed username to list of usernames
					//	prev[a_i.n] = a_i.id;
					//	chrome.storage.local.set({users: prev});
					//}

					console.log('ARRAY LENGTH = ', a.length);
					console.log('-----------------------------------');
				}// end while(...)
			}// end else {..}
			console.log('CHANGED FLAG: ', c_f);
			console.log('LOOKUP FINAL: ', prev);

			console.log('DONE AJAX()');
		});// end always(...)
		d = new Date();
		s = d.toDateString() + " at " + d.toLocaleTimeString();
		chrome.storage.local.set({lastChecked: d.getTime(), synced: s});
	}

	console.log('Created an Alarm!');
	chrome.alarms.create('update', {delayInMinutes: 10, periodInMinutes: 10});

	chrome.storage.local.get(['lastChecked', 'users'], function (data) {
		if (data.lastChecked === undefined) {
			console.log("WAS EMPTY!");
			if ($.isEmptyObject(data.users)) { ajax(false, null); } else { ajax(true, data.users); }
		} else if ((Date.now() - data.lastChecked) > 600000) {
			console.log('MORE THAN 10 MINUTES SINCE LAST SYNC');
			console.log(Date.now());
			console.log(data.lastChecked);

			if ($.isEmptyObject(data.users)) { ajax(false, null); } else { ajax(true, data.users); }
			console.log('UPDATED BEFORE ALARM TRIGGER');
		}
	});

	chrome.alarms.onAlarm.addListener(function (alarm) {
		'use strict';
		console.log('Got an alarm!', alarm);
		console.log('[Update User]');

		chrome.storage.local.get('users', function (data) {
			console.log('FLAGS : ', data);
			if ($.isEmptyObject(data.users)) { ajax(false, null); } else { ajax(true, data.users); }
		});
	});
}());