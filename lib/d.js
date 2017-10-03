var dbName = "ignorelistDB";
var ver = 6.0;
var il_DB = {};
var indexedDB = window.indexedDB ||
				window.webkitIndexedDB ||
                window.mozIndexedDB;

// -----------------------------------------------------------------------------
// Determine if the indexedDB exists in the window object
// -----------------------------------------------------------------------------
if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.IDBTransaction ||
							window.webkitIDBTransaction ||
							window.mozIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange ||
						 window.webkitIDBKeyRange ||
						window.mozIDBKeyRange;
}//end if(...)
il_DB.indexedDB = {};
il_DB.indexedDB.db = null;
il_DB.indexedDB.onerror = function (e) { console.dir(e); }

function sendResponse(x) {
	console.log("SENDING: ", x);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, x, function(response) {});  
	});
}

/*
 * Open the indexedDB; Apply upgrades when necessary - DONE
 */
il_DB.indexedDB.open = function () {
    "use strict";
	var open = indexedDB.open(dbName, ver);

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++ generateDB: ON UPGRADE NEEDED ++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onupgradeneeded = function (e) {
		console.log("--- Begin onUpgradeNeeded ---");
		var store, db = il_DB.indexedDB.db = e.target.result;
		if (db.objectStoreNames.contains("USERLIST")) {
		    db.deleteObjectStore("USERLIST");
		}
		store = db.createObjectStore("USERLIST", {keyPath: "userID"});
	    store.createIndex("userID", "userID", { unique: true });
		store.createIndex("name", "name", { unique: true });
		console.info("---  End onUpgradeNeeded  ---");
		db.close();
	};// end onupgradeneeded function () {...}

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++ generateDB: ON SUCCESS +++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onsuccess = function (e) {
        console.info("[---> Success for : " + dbName + " <---]");
	    var db = il_DB.indexedDB.db = e.target.result;
	    db.close();
	};
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++ generateDB: ON ERROR +++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onerror = il_DB.indexedDB.onerror;
};// end open {...}

il_DB.indexedDB.clear = function () {
	console.log("INDEXEDDB clear()");
	var req = indexedDB.open(dbName, ver);	

	req.onsuccess = function (e) {
		var db = il_DB.indexedDB.db = e.target.result, trans = db.transaction(['USERLIST'], 'readwrite'),
		store = trans.objectStore("USERLIST").clear();

		store.onsuccess = function(e) { console.info('Database Object Store Cleared: ', e); }
	};
};

il_DB.indexedDB.size = function (s) {
    "use strict";
	// console.log("INDEXEDDB size()");
	var req = indexedDB.open(dbName, ver);	
 
	// console.log(req);
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++ size: ON SUCCESS +++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	req.onsuccess = function (e) {
		var db = il_DB.indexedDB.db = e.target.result, trans = db.transaction(['USERLIST']),
		store = trans.objectStore("USERLIST"), size = store.count();
	
		size.onsuccess = function () { s.innerText = size.result; };
	};
};

//---------------------------------------------------------------------------------
/*
 * Adds a user to the indexedDB - DONE
 *
 * @param  id       the id of a user
 * @param  r		the reason for ignoring a user
 */
il_DB.indexedDB.add = function (id, un, r) {
    "use strict";
	var open = indexedDB.open(dbName, ver);
	// console.log("INDEXEDDB add()");

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++ add: ON SUCCESS +++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onsuccess = function (e) {
		var db = il_DB.indexedDB.db = e.target.result;
		var trans = db.transaction(['USERLIST'], "readwrite");
		var store = trans.objectStore("USERLIST");
		var user = {"userID": id, "name": un, "reason": r};
		console.log("THIS IS A USER! ", user);
		var req = store.put(user);
		var data;
	    
		req.onsuccess = function (e) { 
			chrome.storage.local.get('users', function (r) {
				data = r.users;
				// console.log("UPDATING LOOKUP OBJECT!");
				console.log(data); 
				data[id] = [];
				data[id].push(un);
				// Search by Username -> data[un] = id;
				chrome.storage.local.set({users: data});
			});
			console.info("---> Success: ", e);
			db.close();
		};
		req.onerror = function (e) { console.error("---> add(): Error Adding Data ", e); };
	};

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++++++ add: ON ERROR ++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onerror = il_DB.indexedDB.onerror;
};// end add {...}

//---------------------------------------------------------------------------------
/*
 * Removes a user from the indexedDB - DONE
 *
 * @param  id        the id of a user
 */
il_DB.indexedDB.remove = function (id, flag) {
    "use strict";
	var open = indexedDB.open(dbName, ver);

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++ remove: ON SUCCESS ++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onsuccess = function (e) {
		var db = il_DB.indexedDB.db = e.target.result, trans = db.transaction(['USERLIST'], "readwrite"),
		store = trans.objectStore("USERLIST"), req = store.delete(id), data;

		req.onsuccess = function (e) {
			console.info("---> Removed: ", e);
			chrome.storage.local.get('users', function (r) {
				data = r.users;
				// console.log("UPDATING LOOKUP OBJECT!");
				console.log(data); 
				delete data[id];
				
				chrome.storage.local.set({users: data});			
			});
			
			if (flag) { sendResponse({type: "[REMOVED]"});  }
			db.close();
		};
		req.onerror = function (e) { console.error("---> remove(): Error Removing ", e); };
	};

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++++ remove: ON ERROR +++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onerror = il_DB.indexedDB.onerror;
};// end remove {...}

//---------------------------------------------------------------------------------
/* INCLUDED 1/5/16 -
 * Updated in case of username changes. If username change is found, update the record in the database. --- NEW
 *
 * @param  id         the id of a user
 * @param  n		  the username (associated with the id) that appears on the Ignore List page
 */
il_DB.indexedDB.update = function(id, un) {
	"use strict";
	var open = indexedDB.open(dbName, ver);

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++ update: ON SUCCESS ++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onsuccess = function (e) {
		var db = il_DB.indexedDB.db = e.target.result, 
		trans = db.transaction(['USERLIST'], "readwrite"), 
		store = trans.objectStore("USERLIST"), index = store.index("userID"), 
		req = index.get(id);
	
		req.onsuccess = function (e) {
			// User was never added to the database
			if ( e.target.result.name === undefined ) {
				il_DB.indexedDB.add(id, name, "VOID");
			} else {
				e.target.result.name = un;
				store.put(e.target.result);
				db.close();
			}
		};
		
		req.onerror = function (e) { console.error("---> update(): Error While Updating ", e); };
	};

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++++ update: ON ERROR +++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	open.onerror = il_DB.indexedDB.onerror;	
};

//--------------------------------------------------------------------------------- 
/* UPDATED - 1/9/2016 
*/
il_DB.indexedDB.usernames = function() {
	"use strict";
	var x, l, lookup, i = 0, un = [];
	
	chrome.storage.local.get('users', function (r) {
		lookup = Object.keys(r.users);
		l = lookup.length;
		// console.log(lookup);
		
		while (i < l) {
			// console.log(lookup[i]);
			x = r.users[lookup[i]];
			
			un.push.apply(un, x);
			console.log(un);
			i++;
		}
	});
		
	sendResponse({type: "[QUOTES]", usernames: un}); 
}

//--------------------------------------------------------------------------------- 
/* UPDATED - 3/7/16
 */
il_DB.indexedDB.ids = function() {
	"use strict";
	var x, l, lookup;
	
	chrome.storage.local.get('users', function (r) {
		lookup = Object.keys(r.users);
		sendResponse({type: '[THREADS]', ids: lookup}); 
	});
};


//---------------------------------------------------------------------------------
/* UPDATED 1/3/16 -
 *  Restores ignored users in the table.
 * Applies update to the button element.
 *
 */
 il_DB.indexedDB.get = function(data){
    "use strict";
	console.log("INDEXEDDB get()");
	var req = indexedDB.open(dbName, ver);	
 
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++ get: ON SUCCESS +++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	req.onsuccess = function (e) {
		var db = il_DB.indexedDB.db = e.target.result, trans = db.transaction(['USERLIST'], "readonly"),
		store = trans.objectStore("USERLIST"), index = store.index("userID"), req = index.get(data.id), reason, st;

		req.onsuccess = function (e) {
			// User Not Found
			console.log(data);
			if (e.target.result === undefined) {
				//console.log("USER NOT FOUND");
			    il_DB.indexedDB.add(data.id, data.name, "VOID");
				reason = "No Reason";
				st = "[ADD]";
			}
			
			// User Found, No Reason Entered
			else if (e.target.result.reason === "VOID" ) {
				//console.log("USER FOUND --- NO REASON");
				reason = "No Reason";
				st = "[ADD]";
			}
			
			// User Found, Reason Entered
			else {
				//console.log("USER FOUND --- VALID REASON");
				reason = e.target.result.reason;
				st = "[EDIT]";
			}
			
			// Username Needs Update
			if (e.target.result !== undefined &&
			    e.target.result.name !== data.name) {
				il_DB.indexedDB.update(data.id, data.name);
			}
			
			sendResponse({type: "[RESTORED]", status: st, cell: "user_" + data.id, message: reason});
			//console.info("---> Restored User: ", e);			
			db.close();
		};		
		
		req.onerror = function (e) { console.error("---> Error Restoring: ", e); };
	};
	
};

//--------------------------------------------------------------------------------- 
/* INCLUDED 1/6/16 */
il_DB.indexedDB.exportData = function(ta, b) {
	"use strict";
	var open = indexedDB.open(dbName, ver);
		
	open.onsuccess = function(e) {
		var cursor, string = "id, username, reason\n", i = 1, db = il_DB.indexedDB.db = e.target.result, percent, trans = db.transaction(['USERLIST'], "readonly"), store = trans.objectStore("USERLIST"), count = store.count();
		
		count.onsuccess = function () {
			if (count.result > 0) {
				store.openCursor().onsuccess = function(e){
					cursor = e.target.result;
					if (cursor) {
						percent = Math.round((i / count.result)*100);
						// console.log("PERCENT = ", percent);
						if (percent <= 10) { b.className = "val_5"; }
						if ((percent > 11) && (percent <= 20)) { b.className = "val_10"; }
						if ((percent > 21) && (percent <= 30)) { b.className = "val_20"; }						
						if ((percent > 31) && (percent <= 40)) { b.className = "val_30"; }		
						if ((percent > 41) && (percent <= 50)) { b.className = "val_40"; }		
						if ((percent > 51) && (percent <= 60)) { b.className = "val_50"; }		
						if ((percent > 61) && (percent <= 70)) { b.className = "val_60"; }
						if ((percent > 71) && (percent <= 80)) { b.className = "val_70"; }	
						if ((percent > 81) && (percent <= 90)) { b.className = "val_80"; }
						if ((percent > 91) && (percent < 100)) { b.className = "val_90"; }		
						else { b.className = "val_100"; }						
						string = string + cursor.value.userID + ", "
									    + cursor.value.name + ", "
									    + cursor.value.reason + "\n";
						i++;
						cursor.continue();
					} else { ta.value = string; }
					
					ta.value = string;
				};
				
				store.openCursor().onerror = function (e){ console.error("CURSOR ERROR"); };
			} else { ta.value = "No notes are stored in your database!"; }
			count.onerror = function (e){  console.error("----> exportData() : Count Error ", e); };
		};
		db.close();
	};

	open.onerror = il_DB.indexedDB.onerror;	
};
