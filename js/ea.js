function initialize(){
	var doc = document, a, sa, d = "/images/tf_ideal/misc/avatar.png";

	console.log("REFERRER: ", doc.referrer);
	console.log("User Has Default Avatar: ", $('.singleavatar img')[0]);
	console.log("User Has Custom Avatar:", $('.primary img')[0]);
	console.log('Primary Block:', $('.primary')[0]);
	
	// User changed their avatar
	if (doc.referrer.match('(.*)editavatar')[0] === location.href) {
		if ((a = $('.primary')[0]) !== undefined) {
			a = a.getElementsByTagName('img')[0];
			
			if (a !== undefined) { d = a.src.match('/images\/(.*)')[0].trim(); }
		}
		
		if ((sa = $('.singleavatar img')[0]) !== undefined) {
			// User has a default avatar
			d = sa.src.match('/images\/(.*)')[0].trim();
		}
		
		console.log("DATA:", d);
		
		// Send to background here
		chrome.runtime.sendMessage({type: '[MENU_SET]', data: d});		
		
		console.log(d);
		console.log($('#menu'));
		console.log($('#m_avatar'));
		$('#m_avatar img')[0].src = "http://content.lipstickalley.net" + d;
	}
}

initialize();