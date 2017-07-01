var request = require('request');
var cheerio = require('cheerio');
var str = require('string');

exports.get_claw = (link) => {	
	var strList = [];

	return new Promise((resolve, reject) => {	
		request(link, function (error, response, body) {
			if (!error) {
				var $ = cheerio.load(body);
				var quoteCont = $('body').find('.quoteText');

				if(quoteCont.length){
					for(var i=0, total = quoteCont.length ;i< total; i++){

						var author = $(quoteCont[i]).find('.authorOrTitle').first().text(),
							quote = $(quoteCont[i]).html().split('<br>')[0];
						
						quote = str(quote).decodeHTMLEntities().s;
						
						strList.push({
							quote: quote.replace(/\r?\n|\r/g, '').trim(),
							author: author.replace(/\r?\n|\r/g, '').trim()
						});	
					}				
				}
				resolve( strList);

			} else {				
				console.log("We’ve encountered an error: " + error);
				reject(error);
			}			
		});
	});
}