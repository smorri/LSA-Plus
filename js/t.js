/* COMPLETED 12-26-15 --- REDONE 1/7/2016 */
/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global chrome: false */
/*global console: false */
/*global prompt: false */

/* Last JSLINT Check: 1/29/16 (No Changes Made) */

function initialize() {
	"use strict";

	function t(a) {
		var tl, l, uid, i = 0;

		function atob() {
			// Number of Blocked Users is <= the total number of threads on
			// the page
			console.log("FUNCTION atob()");
			var x, f, u, f_l, u_l = uid.length;

			while (u_l) {
				u = uid.pop();
				f = $(tl).find("a[href^=\"member.php/" + u + "\"]");

				// Found 1 or more threads by a user on ignore
				if ((f_l = f.length) > 0) {
					do {
						x = $(f[i]).parents('li')[0];
						x.className += " thread_ignore";
						i++;
					} while (i < f_l);
					i = 0;
				}
				u_l -= 1;
			}
		}

		function btoa() {
			// Number of Blocked Users is > the total number of threads on
			// the page
			var u, x, i = l - 1;
			console.log("FUNCTION btoa()");
			do {
				u = $(tl[i]).children('a')[0];
				u = u.href.match('/([0-9]+)-')[1];
				console.log("THREAD USER ID: ", u);

				if (uid.indexOf(u) >= 0) {
					x = $(tl[i]).parents('li')[0];
					console.log('BLOCKED = ', x);
					x.className += " thread_ignore";
				}
				i--;
			} while (i >= 0);
		}

		if (a) {
			tl = $('#threads span.label');

			if ((l = tl.length) < 1) { return; }

			chrome.runtime.sendMessage({type: '[HIDE_THREAD]'});

			chrome.runtime.onMessage.addListener(function (response) {
				//console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
				if (response.type == '[THREADS]') {
					uid = response.ids;
					console.log(uid);
					console.log(l);
					if (uid.length <= l) { atob(); } else { btoa(); }

					$('#threadlist')[0].className += " loaded";
				}
			});
		}
	}

	if (location.href.indexOf('forumdisplay') > 0) {
		chrome.storage.sync.get(["ignr_pl", "ignr_it"], function (r) {
			if (r.ignr_pl) { t(r.ignr_it); }
		});
	}
}

initialize();