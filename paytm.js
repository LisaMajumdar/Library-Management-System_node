const https = require('https');

/**
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const checksum_lib = require('./checksum');

https.createServer(function (req, res) {
	/* initialize an object with request parameters */
	var paytmParams = {
		"MID" : "YOUR_MID_HERE",
		"WEBSITE" : "YOUR_WEBSITE_HERE",
		"INDUSTRY_TYPE_ID" : "YOUR_INDUSTRY_TYPE_ID_HERE",
		"CHANNEL_ID" : "YOUR_CHANNEL_ID",
		"ORDER_ID" : "YOUR_ORDER_ID",
		"CUST_ID" : "CUSTOMER_ID",
		"MOBILE_NO" : "CUSTOMER_MOBILE_NUMBER",
		"EMAIL" : "CUSTOMER_EMAIL",
		"TXN_AMOUNT" : "ORDER_TRANSACTION_AMOUNT",
		"CALLBACK_URL" : "YOUR_CALLBACK_URL",
	};
	
	checksum_lib.genchecksum(paytmParams, "YOUR_KEY_HERE", function(err, checksum){

		/* for Staging */
		var url = "https://securegw-stage.paytm.in/order/process";

		/* for Production */
		// var url = "https://securegw.paytm.in/order/process";

		/* Prepare HTML Form and Submit to Paytm */
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html>');
		res.write('<head>');
		res.write('<title>Merchant Checkout Page</title>');
		res.write('</head>');
		res.write('<body>');
		res.write('<center><h1>Please do not refresh this page...</h1></center>');
		res.write('<form method="post" action="' + url + '" name="paytm_form">');
		for(var x in paytmParams){
			res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
		}
		res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
		res.write('</form>');
		res.write('<script type="text/javascript">');
		res.write('document.paytm_form.submit();');
		res.write('</script>');
		res.write('</body>');
		res.write('</html>');
		res.end();
	});
}).listen(3000);













/**
* import checksum generation utility
*/
const checksum_lib = require('./checksum');

var paytmChecksum = "";

/**
* Create an Object from the parameters received in POST
* received_data should contains all data received in POST
*/
var paytmParams = {};
for(var key in received_data){
	if(key == "CHECKSUMHASH") {
		paytmChecksum = received_data[key];
	} else {
		paytmParams[key] = received_data[key];
	}
}