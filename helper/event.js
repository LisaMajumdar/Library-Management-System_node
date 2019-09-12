var email = require('../config/mailFunction')
var events = require('events');
global.eventemitter = new events.EventEmitter();

global.eventemitter.on('SendverificationLink', function (data) {    
		console.log('gghjkklkfddiusdjrf');
     let url = 'http://127.0.0.1:8000/user/verifyEmail/'+data.token; 
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Verify Email";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>&nbsp;&nbsp;Your Profile has been created.<a href = "+url+"> click here </a> for verify your mail id.</b>";   
     email.Mail(senderemail,reciveremail,subject,'',msg);  
});

global.eventemitter.on('BookRequest', function (data) {    
     let url = 'http://127.0.0.1:8081/teuser/verifyEmail/'+data.token; 
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Verify Email";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>&nbsp;&nbsp;Your Profile has been created.<a href = "+url+"> click here </a> for verify your mail id.</b>";   
     email.Mail(senderemail,reciveremail,subject,'',msg);  
});

global.eventemitter.on('BookApprove', function (data) {         
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Book Approval";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>&nbsp;&nbsp;Your Book Request has been approved by us . Please collect your requested book form our book store in between three days , otherwise your request has been cancled autometically. Your BookId is <b>"+data.bookId+"</b>";   
     email.Mail(senderemail,reciveremail,subject,'',msg);  
});