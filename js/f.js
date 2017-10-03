/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global console: false */
/*global chrome: false */

/* CHANGE LOG
 * - Last JSLINT Check: 1/29/16 (No Changes Made) 
 * 
 * - [BUG] 'New Topics' Not Being Filtered Properly (ver. 2.1.2 ; 3/3/16)
 * 	   ->  Fixed if(...&&...) clause
 */

function p(doc, v, path) {
    "use strict";
    var z = 0, d = [], b = [], sb, c, a, u, t, s, x, tid, c_l, a_l;

	function isNSFW(i, str) {
	    if (str.match("Celebrity Dark Room") || str.match("XES Club")) {
	        c[i].className += " nsfw";
			return true;
	    }
	    return false;
	}
	function ajaxCall(i) {
	    u = a[i].href;
		tid = u.match("/\\d+-")[0];
		tid = tid.replace(/[\-\/]/g, '');

		if ((x = d.indexOf(tid)) > -1) {
			if (b[x]) { c[i].className += "nsfw"; console.log("NSFW!"); }
			if (i < v) { ajaxCall(i + 1); } else { s.innerText = "Check Complete!"; }
		} else {
			d[i] = tid;
			$.ajax({type: "GET", url: u, cache: false}).done(function (r) {
				t = $(r).find(path).text().trim();
				b[i] = isNSFW(i, t);
				if (i < v) { ajaxCall(i + 1); } else { s.innerText = "Check Complete!"; }
			});
		}
	}

    if ((sb = doc.getElementById('block_newposts_2')) === null) { return; }
	c = sb.getElementsByTagName('li');
	s = document.createElement('span');
	s.className = "nsfwCheck";
	$(sb.parentNode).prepend(s);

	a = $(c).find('h5 > a');
	c_l = c.length;
	a_l = a.length;

    if ((c_l === 0) || (a_l === 0) || (c_l !== a_l)) { return; }

	sb.className += " loaded";
	while (z < v) {
		c[z].style.display = "inherit";
		z++;
	}
    s.innerText = "Checking Posts for NSFW Content . . .";
	ajaxCall(0);
}

function t(doc, x, y) {
	'use strict';
	var p1 = '.meta > a[href$="XES-Club"]', p2 = '.meta > a[href$="Celebrity-Dark-Room"]', sb_a, sb_b, a = {x: {x: null, z: null}, y: {y: null, z: null}}, b = {x: {x: null, z: null}, y: {y: null, z: null}};
	// x: XES ALLEY
	// y: CELEBRITY DR

	function store(i, j) {
		i.x.x = $(j).find(p1);
		i.x.z = i.x.x.length;
		i.y.y = $(j).find(p2);
		i.y.z = i.y.y.length;
	}
	function tag(obj) {
		var i = 0, j = 0;

		if ((obj.x.z + obj.y.z) !== 0) {
			if (obj.x.z > 0) {
				// console.info("XES ALLEY CONTENT");
				while (i < obj.x.z) { $(obj.x.x[i]).parents('li.widget_post_bit')[0].className += " nsfw"; i++; }
			}
			if (obj.y.z > 0) {
				// console.info("CELEB DR CONTENT");
				while (j < obj.y.z) { $(obj.y.y[j]).parents('li.widget_post_bit')[0].className += " nsfw"; j++; }
			}
		}
		i = 0;
		j = 0;
	}

	if ((sb_a = doc.getElementById('block_newthreads_16')) === null ||
	    (sb_b = doc.getElementById('block_newthreads_17')) === null) { return; }

	if (y) {
		store(a, sb_a);
		tag(a);
	}
	if (x) {
		store(b, sb_b);
		tag(b);
	}
}

$(document).ready(function () {
    "use strict";

	chrome.storage.sync.get(["nsfw_pl", "nsfw_ht", "nsfw_nt", "nsfw_lp"], function (r) {
		if (r.nsfw_pl) {
			var f = document.getElementById('footer_select'), sID = f.querySelector('option:checked').value,
			    k = document.getElementById('block_newposts_2'), sb = document.getElementById('sidebar_container'),
			    path;

			if (sID > 80) {
				path = ".main_wrap li.navbit";
				sb.className += " dark";
			} else {
				path = "#breadcrumb a";
			}

			k.className += " enabled";
			t(document, r.nsfw_nt, r.nsfw_ht);
			p(document, r.nsfw_lp, path);
		}
	});
});
