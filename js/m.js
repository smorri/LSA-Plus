/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global chrome: false */
/*global console: false */
/*global prompt: false */

/*  JSLINT Check: 1/29/16 (No Changes Made) */

function initialize() {
	'use strict';
	var doc = document;

	function loadMenu(st_f, lock, suffix) {
		var styleID = doc.querySelector('option:checked').value, tl = doc.getElementById('toplinks'), isDark,
		    ab, n = doc.getElementById('notifications'), nn = doc.getElementById('nonotifications'), ni = [], ae,
		    mw, m, mb, nb, len, li, ul, u, l, c, d, i, a, s, e, x, y, p;
		ul = doc.createElement('ul');
		mw = doc.createElement('div');
		mw.id = 'm_pane';
		m = doc.createElement('nav');
		m.id = 'menu';
		m.className = "hide";
		mb = doc.createElement('div');
		nb = doc.createElement('div');
		mb.id = "m_mbutton";
		nb.id = "m_nbutton";

		if (styleID > 80) {
			ab = doc.getElementById('navbar_container');
			isDark = true;
		} else {
			ab = doc.getElementsByClassName('above_body')[0];
			isDark = false;
		}

		// -----------------------------------------------------------------------------------------
		//  Welcome Header
		// -----------------------------------------------------------------------------------------
		x = tl.getElementsByClassName('welcomelink')[0];
		l = doc.createElement('li');
		l.id = "_header";
		l.className = "dim";
		if (x === undefined) {
			s = doc.createElement('span');
			s.textContent = "Welcome _undefined_";
			ul.appendChild(li);
		} else {
			c = doc.createElement('div');
			// -----------------------------------------------------------------------
			// Avatar Container
			// -----------------------------------------------------------------------
			d = doc.createElement('div');
			i = doc.createElement('img');
			a = doc.createElement('a');
			d.id = "m_avatar";
			a.className = 'editBadge';
			a.href = "profile.php?do=editavatar";
			a.textContent = "Edit";
			i.src  = "http://content.lipstickalley.net" + suffix;
			d.appendChild(a);
			d.appendChild(i);
			c.appendChild(d);

			// ------------------------------------------------------------------------
			// Username Container
			// ------------------------------------------------------------------------
			s = doc.createElement('h1');
			s.textContent = x.children[0].textContent;
			c.appendChild(s);

			y = tl.getElementsByClassName("isuser")[0];
			if (y !== undefined) {
				// ------------------------------------------------------------------------
				// User Controls Container
				// ------------------------------------------------------------------------
				d = doc.createElement('div');
				d.id = "m_controls";
				u = doc.createElement('ul');

				// ---------------------------------------
				// User Profile
				// ---------------------------------------
				li = doc.createElement('li');
				a = doc.createElement('a');
				li.id = "m_profile";
				li.className = "inline";
				x = y.children[2];
				a.href = x.children[0].href;
				a.title = "User Profile";
				li.appendChild(a);
				u.appendChild(li);

				if (st_f === true) {
					// ---------------------------------------
					// Subscribed Threads
					// ---------------------------------------
					li = doc.createElement('li');
					a = doc.createElement('a');
					li.id = "m_subscribed";
					li.className = "inline";
					a.href = $('#vbqlink_threads')[0].children[0].href;
					a.title = "Subscribed Threads";
					li.appendChild(a);
					u.appendChild(li);
				}

				// ---------------------------------------
				// Settings
				// ---------------------------------------
				li = doc.createElement('li');
				a = doc.createElement('a');
				li.id = "m_settings";
				li.className = "inline";
				x = y.children[1];
				a.href = x.children[0].href;
				a.title = "Settings";
				li.appendChild(a);
				u.appendChild(li);
			}
			d.appendChild(u);
			c.appendChild(d);
			l.appendChild(c);
			ul.appendChild(l);
		}
		if (n !== null) {
			p = n.children[1];
			len = p.children.length;
			i = 0;

			// -----------------------------------------------------------------------------------------
			//  Collect Notifications
			// -----------------------------------------------------------------------------------------
			do {
				ae = {n: -1, h: null, t: ""};
				x = p.children[i].children[0];
				//console.log( x );
				ae.n = x.text.match(/\d+/)[0].trim();
				ae.h = x.href;
				ae.t = x.text.match(/\D+/)[0].trim();
				switch (ae.t) {
				case "Reputation Comment":
					ni[0] = ae;
					break;
				case "Reputation Comments":
					ni[0] = ae;
					break;
				case "Unread Private Messages":
					ni[1] = ae;
					break;
				case "Unread Visitor Messages":
					ni[2] = ae;
					break;
				case "New Mentions":
					ni[3] = ae;
					break;
				case "New Thread Tags":
					ni[4] = ae;
					break;
				case "Hash Tags":
					ni[5] = ae;
					break;					
				case "New Thanks / Groans":
					ni[6] = ae;
					break;
				case "New Post Quotes":
					ni[7] = ae;
					break;
				case "Incoming Friend Requests":
					ni[8] = ae;
					break;
				case "Group Invitations":
					ni[9] = ae;
					break;					
				case "Groups Join Requests":
					ni[10] = ae;
					break;
				default:
					break;
				}// end switch(...)
				//console.log( ni );
				i += 1;
			} while (i < len);
		}// end if(...)
		// -----------------------------------------------------------------------------------------
		//  Notifications Header
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		s = doc.createElement('h2');
		li.id = "m_header";
		li.className = "dim";
		//li.className = "dim s_" + styleID;
		s.textContent = "NOTIFICATIONS";

		li.appendChild(s);
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Reputation
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_reputation";
		s = doc.createElement('span');
		s.textContent = "Rep Comment";

		if (ni[0] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[0].h;
			e.textContent = ni[0].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Private Messages
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		s = doc.createElement('span');
		a = doc.createElement('a');
		e = doc.createElement('em');
		li.id = "m_privatemsg";
		s.textContent = "Private Messages";

		if (ni[1] === undefined) {
			li.className = "dim no_messages";
			a.href = doc.getElementById('vbflink_pms').children[0].href;
			e.textContent = "0";
		} else {
			li.className = "dim";
			a.href = ni[1].h;
			e.textContent = ni[1].n;
		}
		a.appendChild(s);
		a.appendChild(e);
		li.appendChild(a);
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Visitor Messages
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_visitormsg";
		s = doc.createElement('span');
		s.textContent = "Visitor Messages";

		if (ni[2] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[2].h;
			e.textContent = ni[2].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Mentions
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_mentions";
		s = doc.createElement('span');
		s.textContent = "Mentions";

		if (ni[3] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[3].h;
			e.textContent = ni[3].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Thread Tags
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_threadtags";
		s = doc.createElement('span');
		s.textContent = "Thread Tags";

		if (ni[4] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[4].h;
			e.textContent = ni[4].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Hash Tags
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_hashtags";
		s = doc.createElement('span');
		s.textContent = "Hash Tags";

		if (ni[5] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[5].h;
			e.textContent = ni[5].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Thanks, Groans & LOLs
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_thankgroan";
		s = doc.createElement('span');
		s.textContent = "Thanks | Groans";

		if (ni[6] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[6].h;
			e.textContent = ni[6].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Post Quotes
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_postquotes";
		s = doc.createElement('span');
		s.textContent = "Post Quotes";

		if (ni[7] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[7].h;
			e.textContent = ni[7].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);
		// -----------------------------------------------------------------------------------------
		//  Friend Requests
		// -----------------------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_friendreqs";
		s = doc.createElement('span');
		s.textContent = "Friend Requests";

		if (ni[8] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[8].h;
			e.textContent = ni[8].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);
		// -------------------------------------------------------------------------
		//  Group Invitations
		// -------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_groupinvite";
		s = doc.createElement('span');
		s.textContent = "Group Invitations";

		if (ni[9] === undefined) {
			li.className = "dim disabled";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim";
			a.href = ni[9].h;
			e.textContent = ni[9].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);

		m.appendChild(ul);
		mw.appendChild(m);
		// -------------------------------------------------------------------------
		//  Group Join Requests
		// -------------------------------------------------------------------------
		li = doc.createElement('li');
		li.id = "m_grouprequest";
		s = doc.createElement('span');
		s.textContent = "Join Requests";

		if (ni[10] === undefined) {
			li.className = "dim disabled lastItem";
			li.appendChild(s);
		} else {
			a = doc.createElement('a');
			e = doc.createElement('em');
			li.className = "dim lastItem";
			a.href = ni[10].h;
			e.textContent = ni[10].n;

			a.appendChild(s);
			a.appendChild(e);
			li.appendChild(a);
		}
		ul.appendChild(li);

		m.appendChild(ul);
		mw.appendChild(m);		
		
		// -----------------------------------------------------------------------------------------
		//  Insert Buttons
		// -----------------------------------------------------------------------------------------
		if (lock) {
			mb.id = "m_lbutton";
			mb.className = "active";
			m.className = "show";			
		} else {
			mb.id = "m_mbutton";
			mb.className = "inactive";			
			mb.onclick = function () {
				if (mb.className === "active") {
					m.className = "hide";
					mb.className = "inactive";
				} else {
					m.className = "show";
					mb.className = "active";
				}
			};		
		}
		
		mw.appendChild(mb);
		nb.id = "m_nbutton";
		nb.className = (nn === null) ? "active" : "inactive";
		mw.appendChild(nb);

		doc.body.insertBefore(mw, ab);
	}

	chrome.storage.sync.get(["menu_pl", "menu_st", "menu_lm"], function (r) {
		if (r.menu_pl) {
			chrome.runtime.sendMessage({type: '[MENU_AVATAR]', url: $('.welcomelink a')[0].href}, function (response) {
				loadMenu(r.menu_st, r.menu_lm, response.message);
			});
		}
	});
}

initialize();