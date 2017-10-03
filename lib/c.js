( function () {
	var a = [], doc = document, s, t;
	
	function b(x){
		var s = doc.createElement('style'), t;
	    s.type = "text/css";
		if (x < 0) { /* Ignore List Plugin Disabled */
			console.log("Ignore List Plugin Disabled");
			t = doc.createTextNode("ul#ignorelist, .floatcontainer .check_all_ctrl.shade { display: initial; }");
			s.appendChild(t);		
		} else { return; }
		
		doc.documentElement.appendChild(s);	
		a.push(s);
	};

	chrome.storage.sync.get(null, function(r) {
		/* Modified Menu Disabled */
	    if (!r.menu_pl) { 
			console.info("---x Modified Menu Disabled");
			s = doc.createElement('style');
			s.type = "text/css";
			t = doc.createTextNode("#nonotifications, #notifications, #toplinks  ul.isuser li:nth-child(2), #toplinks  ul.isuser li:nth-child(3), #toplinks  ul.isuser li:nth-child(5), #toplinks  ul.isuser li:last-child { display:inherit !important; }");
			s.appendChild(t);
			
			doc.documentElement.appendChild(s);	
			a.push(s);			
		}
		/* Not Safe For Work Plugin Disabled */
		if (!r.nsfw_pl) {
			console.info("---x Not Safe For Work Plugin Disabled");			
			s = doc.createElement('style');
			s.type = "text/css";
			t = doc.createTextNode("#block_newposts_2:before { content:\"\" !important; background-color:inherit !important; color:inherit; margin:0; padding:0; } #block_newposts_2 > li { display:inherit !important; }");
			s.appendChild(t);

			doc.documentElement.appendChild(s);	
			a.push(s);				
		}
		/* Ignore List Plugin Disabled */
		if (!r.ignr_pl) {
			console.info("---x Ignore List Plugin Disabled");			
			s = doc.createElement('style');
			s.type = "text/css";
			t = doc.createTextNode("ul#ignorelist, .floatcontainer .check_all_ctrl.shade { display: inherit !important; } #threads { display: inherit !important; } #threadlist:after { content:\"\" !important; font-size: 0 !important;  text-align: inherit !important; display:none !important; } div#content > #thread_controls, div#content > #postlist, div#content > #above_postlist, div#content > #qr_defaultcontainer, div#content > #thread_info, div#content #newreplylink_bottom, div#content #pagination_bottom { visibility: visible !important; } div#content > #postlist { height: inherit !important; overflow: none !important; } div#content > #below_postlist:before { content:\"\" !important; }");
			s.appendChild(t);

			doc.documentElement.appendChild(s);	
			a.push(s);				
		}
		/* Ignore List Plugin : Threads Disabled */
		if (r.ignr_pl && !r.ignr_it) {
			console.info("---x Ignore List : Threads Disabled");			
			s = doc.createElement('style');
			s.type = "text/css";
			t = doc.createTextNode("#threads { display: inherit !important; } #threadlist:after { content:\"\" !important; font-size: 0 !important;  text-align: inherit !important; display:none !important; }");
			s.appendChild(t);

			doc.documentElement.appendChild(s);	
			a.push(s);	
		}
		/* Ignore List Plugin : Quotes Disabled */		
		if (r.ignr_pl && !r.ignr_iq) {
			console.info("---x Ignore List : Quotes Disabled");			
			s = doc.createElement('style');
			s.type = "text/css";		

			 t = doc.createTextNode("div#content > #thread_controls, div#content > #postlist, div#content > #above_postlist, div#content > #qr_defaultcontainer, div#content > #thread_info, div#content #newreplylink_bottom, div#content #pagination_bottom { visibility: visible !important; } div#content > #postlist { height: inherit !important; overflow: none !important; } div#content > #below_postlist:before { content:\"\" !important; }");
			 s.appendChild(t);

			 doc.documentElement.appendChild(s);	
			 a.push(s);				
		}
	});
	
	$(doc).ready( function(){
		var i = 0, l = a.length, h = doc.head;
		while (i < l) { h.appendChild(a[i++]); }
	});
	
}());