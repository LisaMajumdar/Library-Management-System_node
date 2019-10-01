var email = require('../config/mailFunction')
var events = require('events');
global.eventemitter = new events.EventEmitter();

global.eventemitter.on('SendverificationLink', function (data) {    
		//console.log('gghjkklkfddiusdjrf');
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

global.eventemitter.on('BookConfermation', function (data) {         
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Book Submitted Successfully";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>&nbsp;&nbsp;Your Book "+data.bookname+" has been recived Successfully from us . Please Submit or renew the book in between seven days.";   
     email.Mail(senderemail,reciveremail,subject,'',msg);  
});

global.eventemitter.on('BookRequestReject', function (data) {         
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Book Request Rejected";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>&nbsp;&nbsp;Your Book request has been Rejected by us due to some inconvenient problem. we will contact with You as soon as possible.";   
     email.Mail(senderemail,reciveremail,subject,'',msg);  
});

global.eventemitter.on('BookReturn', function (data) {         
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Book Return";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>&nbsp;&nbsp;Your Book had been returned successfully to us.";   
     email.Mail(senderemail,reciveremail,subject,'',msg);  
});

global.eventemitter.on('BookReturnWarrning', function (data) {   
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Book Return Warring Mail";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>&nbsp;&nbsp;Your Book ("+data.bookId+")Issue time is over . Please return or renew your book as soon as possible . Otherwise you shall be pay an extra fees as a penality. your fine amount is <b>"+data.amount+"</b> .";   
     email.Mail(senderemail,reciveremail,subject,'',msg);  
});

global.eventemitter.on('forgetPassword', function (data) {
     let url = 'http://127.0.0.1:8000/fpass/'+data.token; 
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Forget Password Link";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>&nbsp;&nbsp;Reset Your profile password by click the below Link . It will be validate for 24 hours. <br> <a href = "+url+"> click here </a>";   
     email.Mail(senderemail,reciveremail,subject,'',msg);
})


global.eventemitter.on('NotificationEmail', function (data) {
     console.log(123);
    // let url = 'http://127.0.0.1:8000/fpass/'+data.token; 
     let senderemail = '<foo@example.com>'; 
     let reciveremail = data.email;                                    
     let subject = "Notification For Subscription";  
     let textmsg = "Hello world?";                              
     let msg =  "<b>Dear "+data.name+",<br>Please subscribe our website for getting the pdf of each book.";   
     email.Mail(senderemail,reciveremail,subject,'',msg);
})
