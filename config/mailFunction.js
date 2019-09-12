const nodemailer = require("nodemailer");
const Q = require("q");

module.exports.Mail = (from, to, subject, textBody, htmlBody) => {
	
	let deferred = Q.defer();
	let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT, 
        secure: true,                             
        auth: {
          user: process.env.smtp_user, 
          pass: process.env.SMTP_PASS 
        }
      });
    
    let mailParams = {
            from: from, 
            to: to, 
            subject: subject 
      };

     if(textBody)
     {
     	mailParams.text = textBody; // insert text of mail body 
     }
     else if(htmlBody)
     {
     	mailParams.html = htmlBody; // insert html of mail body 
     }  

    // console.log(mailParams);   

    transporter.sendMail(mailParams,(err,result) =>{
    	if(err)
    	{
    		//console.error(err);
    		deferred.reject(err);
    	}
    	else {
	      console.log('Message sent: %s', result.messageId)
	      // Preview only available when sending through an Ethereal account
	      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result))

	      deferred.resolve(result)
	    }
    });  

    return deferred.promise;
}