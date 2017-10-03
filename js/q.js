/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global console: false */
/*global prompt: false */
/*global chrome: false */
/*global MutationObserver: false */
/*jslint nomen: true */

/* Last JSLINT Check: 1/23/16 (No Changes Made) */

function initialize() {
	'use strict';
	var un, un_l, flag = true, doc = document, quotes = [];

	function hide(n, p) {
		var context = $(p).children('.message')[0];
		var a = doc.createElement('a');
		a.href = 'profile.php?do=ignorelist';
		a.target = '_blank';
		a.innerText = 'Ignore List';
		p.className += ' ignoreQuote';
		context.textContent = 'This message is hidden because ' + n + ' is on your ';
		context.appendChild(a);
	}

	function ctob(u_n, qi) {
		if (un.indexOf(u_n) > 0) {
			hide(u_n, qi);
			quotes.push(u_n);
		}
	}// end ctob(...)	

	function quote() {
		var qpl, qpl_l, qpn, qpn_l, u, f;

		function atob() {
			var i = 0;

			while (i < qpn_l) {		
				u = qpn[i].textContent;
				if (quotes.length && (quotes.indexOf(u) > -1)) {
					hide(u, qpl[i]);
				} else {
					// User Found
					if (un.indexOf(u) > 0) {
						// Hide Quoted Content
						hide(u, qpl[i]);
						
						// Add to storage
						quotes.push(u);
					}
				}
				i++;
			}
			$('#content')[0].className += " loaded";
		}// end atob()

		function q() {
			qpl = $('#posts li .message').parent();
			qpl_l = qpl.length;

			qpn = $(qpl).find('strong');
			qpn_l = qpn.length;

			if (!qpn_l || !qpl_l) { 
				$('#content')[0].className += " loaded";
				return;
			}

			chrome.runtime.sendMessage({type: '[HIDE_QUOTE]'});

			chrome.runtime.onMessage.addListener(function (response) {
				// console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');

				if (response.type == '[QUOTES]') {
					un = response.usernames;
					un_l = un.length;
					atob();
				}
			});
		}// end q()

		chrome.storage.sync.get(['ignr_pl', 'ignr_iq'], function (r) {
			if (r.ignr_pl && r.ignr_iq) { q(); } else { flag = false; }
		});
	}// end quote()

	function listen() {
		var fnCallback, observer, t, objConfig;

		fnCallback = function (mutations) {

			mutations.forEach(function (mutation) {
				var bq = [], bql, q_i, u_n, n = mutation.addedNodes;

				if (n.length === 1  && n[0].tagName === 'LI') {
					// Check for quotes
					bq = $(n[0]).find('.quote_container').toArray();

					if ((bql = bq.length) > 0) {
						while (bql) {
							q_i = bq.shift();
							u_n = $(q_i).find('strong')[0];
							u_n = u_n.innerText;
							if (quotes.indexOf(u_n) > -1) { hide(u_n, q_i); }
							else { ctob(u_n, q_i); }
						}
					}
				}// end if(...&&...)
			});//end forEach(...)
		};// end Callback Function

		observer = new MutationObserver(fnCallback);
		t = doc.querySelector('#posts');
		objConfig = {
			childList: true,
			subtree : true,
			attributes: false,
			characterData : false
		};

		observer.observe(t, objConfig);
	}// end listen()

	quote();
	if (flag) { listen(); }
}

initialize();