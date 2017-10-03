/*jslint browser:true */
/*jslint plusplus: true */
/*global $: false */
/*global chrome: false */
/*global il_DB: false */
/*global console: false */
/*global prompt: false */

/* Last JSLINT Check: 1/23/16 (Minor Changes Made) */

function initialize() {
	'use strict';

	var doc = document, del = {status: false, array: []};

	chrome.runtime.onMessage.addListener(function (response) {
		var r;
		// console.info(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
		if (response.type === '[RESTORED]') {
			r = doc.getElementById(response.cell);
			r.children[2].innerText = response.message;
			if (response.status === '[ADD]') {
				r.children[2].className = 'voidReason';
				r.children[3].children[0].className = 't-button button-small button-success';
				r.children[3].children[0].innerText = 'Add';
			} else {
				r.children[3].children[0].className = 't-button button-small button-danger';
				r.children[3].children[0].innerText = 'Edit';
			}
//		} else if (response.type === '[ADDED]') {
//			console.info('---> [ADDED REASON FOR USER]');
		} else if (response.type === '[REMOVED]') {
			// console.info('---> [REMOVED USER(s)]');
			doc.getElementById('ignorelist_change_form').submit();
		}
	});

	function update() {
		var d = doc.getElementsByClassName('singledescription')[0];
		if (d === undefined) { return; }

		d.innerHTML = 'To remove a user from your ignore list,' +
			' un-check the box associated with their name and click ' +
			' the \'Save Changes\' button.' +
			'<br><br>' +
			'To add a user to the list, enter their ' +
			'name into the empty text box and click \'Okay\'.' +
			'<br><br>' +
			'To include a reason as to why a user has ' +
			'been placed on ignore, click the \'Add/Edit Reason\' ' +
			'button and type the reason into the prompt.';
	}

	function submitData() {
		var save = doc.getElementById('submit_save'), add = doc.querySelector('input[value=Okay]');

		function change_d(b) {
			var i, f = false;

			b.addEventListener('click', function () {
				if (del.status === false) {
					for (i = 0; i < del.array.length; i++) {
						// Flag lets us know when we are at the last element in the remove array. 
						//If we are, then the background should send a message back so we can submit the form.
						if (i === (del.array.length - 1)) { f = true; }
						chrome.runtime.sendMessage({type: '[REMOVE_USER]', data: del.array[i], flag: f});
					}
				}
			});
		}// end change_d(...)

		function add_d(b) {
			b.addEventListener('click', function () { doc.getElementById('ignorelist_add_form').submit(); });
		}// end add_d(...)

		change_d(save);
		add_d(add);
	}// end submitData()

	function generateTable() {
		var f = doc.getElementById('footer_select'), sID = f.querySelector('option:checked').value, il = doc.getElementById('ignorelist'), ila = il.getElementsByTagName('li'), ila_l = ila.length - 1, ilp = il.parentElement, data = [], li, tb, hr, th, sc, ulc, rc, aec, cbs, c_li, rs, uns, bs, row, i;

		function add(d) {
			chrome.runtime.sendMessage({type: '[ADD_USER]', data: d});
		}// end add(...)

		function restore(d) {
			chrome.runtime.sendMessage({type: '[RESTORE_USER]', data: d});
		}// end restore(...)

		function restore_u(id) {
			del.status = false;
			var i = del.array.indexOf(id);
			if (i === -1) { return; }
			del.array.splice(i, 1);
		}// end restore_u(...)

		function restore_a() {
			del.status = false;
		}

		function delete_u(id) {
			del.status = false;
			del.array.push(id);
		}// end remove_u(...)

		function delete_a() {
			del.status = true;
			del.array = [];
		}// end delete_a()

		function check_a(c_s) {
			var cba = $(ilp).find('input[type=checkbox]'), l, cba_l = cba.length, j = 0, n_cb;

			n_cb = doc.createElement('input');
			n_cb.type = 'checkbox';
			n_cb.id = 'tableCheck';
			n_cb.checked = true;
			n_cb.addEventListener('click', function () {
				if (n_cb.checked) {
					//c_a.checked = true;
					restore_a();
					while (j < cba_l) { cba[j].checked = true; j++; }
					j = 0;
				} else {
					//c_a.checked = false;
					delete_a();
					while (j < cba_l) { cba[j].checked = false; j++;  }
					j = 0;
				}
			});

			// ----------------------------------------------------
			// Create a label and add checkbox to header
			l = doc.createElement('label');
			l.setAttribute('for', 'tableCheck');
			c_s.appendChild(n_cb);
			c_s.appendChild(l);
		}// end check_a(...)

		function copy(li, c) {
			var d, n_cb, n_l, n_a, n_lb;

			// Create container
			d = doc.createElement('div');

			// ----------------------------------------------------
			// Create a deep copy of the Checkbox Element
			n_cb = doc.createElement('input');
			n_cb.type = li.children[0].type;
			n_cb.name = li.children[0].name;
			n_cb.id = 'usercheckbox_' + li.children[0].value;
			n_cb.value = li.children[0].value;
			n_cb.checked = true;
			n_cb.addEventListener('click', function () {
				if (n_cb.checked) {
					li.children[0].checked = true;
					restore_u(li.children[0].value);
				} else {
					li.children[0].checked = false;
					delete_u(li.children[0].value);
				}
			});

			n_l = doc.createElement('label');
			n_l.setAttribute('for', n_cb.id);

			// ----------------------------------------------------
			// Create a deep copy of the Hyperlink Element
			n_a = doc.createElement('a');
			n_a.href = li.children[1].href;
			n_a.innerText = li.children[1].innerText;

			// ----------------------------------------------------
			// Create a deep copy of the ListBits Input Element
			n_lb = document.createElement('input');
			n_lb.type = li.children[2].type;
			n_lb.name = li.children[2].name;
			n_lb.value = li.children[2].value;

			c.appendChild(n_cb);
			c.appendChild(n_l);
			d.appendChild(n_a);
			d.appendChild(n_lb);

			data.push({id: n_cb.value, name: n_a.innerText});

			return {x: d, y: n_a.innerText, z: n_cb.value};
		}// end copy(...)

		function createButton(b_s, r_s, un, id) {
			var r, b;
			b = doc.createElement('div');
			b.className = 't-button button-small';
			b.addEventListener('click', function () {
				r = prompt('Why are you ignoring ' + un + ' ?').trim();

				if (r === '') { r = null; }
				if (r != null) {
					r_s.innerText = r;
					r_s.className = '';
					b.className += ' button-danger';
					b.innerText = 'Edit';
					add({id: id, name: un, message: r});
				}
			});

			b_s.appendChild(b);
		}// end createButton(...)

		tb = doc.createElement('table');
		tb.id = 'UserListTable';
		tb.className = 's_' + sID;

		th = doc.createElement('thead');
		hr = doc.createElement('tr');
		sc = doc.createElement('th');
		ulc = doc.createElement('th');
		ulc.innerText = 'USER';
		rc = doc.createElement('th');
		rc.innerText = 'REASON';
		aec = doc.createElement('th');
		hr.appendChild(sc);
		hr.appendChild(ulc);
		hr.appendChild(rc);
		hr.appendChild(aec);
		th.appendChild(hr);
		tb.appendChild(th);
		$(ilp).prepend(tb);

		if (ila_l > 1) {
			for (i = 0; i < ila_l; i++) {
				li = ila[i];

				// Create a new row.
				row = doc.createElement('tr');

				// Create a copy of the list item that appears in the original div.
				cbs = doc.createElement('td');
				c_li = copy(li, cbs);
				row.id = 'user_' + c_li.z;

				// Create a cell to hold the user's username.
				uns = doc.createElement('td');
				uns.appendChild(c_li.x);

				// Create a cell that will hold the reason for blocking a user.
				rs = doc.createElement('td');

				// Create a cell that will hold the button that the user can interact with to add a reason to the previous cell.
				bs = doc.createElement('td');
				createButton(bs, rs, c_li.y, c_li.z);
				restore(data[i]);

				row.appendChild(cbs);
				row.appendChild(uns);
				row.appendChild(rs);
				row.appendChild(bs);
				tb.appendChild(row);
			}// end for(...)
			check_a(sc);
		}// end if(...)
	}// end generateTable()

	chrome.storage.sync.get('ignr_pl', function (r) {
		if (r.ignr_pl) {
			generateTable();
			submitData();
			update();
		}
	});
}

initialize();