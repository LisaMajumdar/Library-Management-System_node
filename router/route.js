var express = require('express');
const http = require('http');
var router = express.Router();
var UserController = require('../controller/UserController');
var BookController = require('../controller/BookController');
var LoginController = require('../controller/LoginController');
const multer = require('multer');
var cron = require('node-cron');
var CommonFunction = require('../middlewares/CommonFunction')

/*const passport = require('passport');
var ExtractJwt = require('passport-jwt').ExtractJwt;*/


var storage = multer.diskStorage({
  destination: function (req, res, callback) {
    callback(null, global.filepath+'/'+res.fieldname);
  },
  filename: function (req, res, callback) {
  	let orgfile =  res.originalname; 
  	var arr = orgfile.split(".");
  	let ext = arr[1];  
  	if(res.fieldname == 'userimage')
  		{
	  		let	fname = 'member-'+Date.now()+'.'+ext;   
	  		callback(null , fname);
  		}
    else if(res.fieldname == 'bookPdf'){
        let fname = Date.now()+'.'+ext;   
        callback(null , fname);
     }  		 	
    else
	    {
	    	let fname = 'book-'+Date.now()+'.'+ext;
	    	callback(null , fname);	
	  	}
    }
});
upload = multer({ storage: storage })


router.get('/Registration',UserController.registration);
router.get('/Login',UserController.loginView);
router.get('/Logout',CommonFunction.verifyToken,UserController.logout);
router.post('/user/insert',upload.single('userimage'),UserController.insert);
router.get('/user/userDetails/:id',UserController.getUserDetails);
router.get('/user/verifyEmail/:token',UserController.verifyEmail);

router.get('/ForgetPassword/:is_active?',LoginController.forgetPassword);
router.post('/forgetPasswordSendLink',LoginController.forgetPasswordSendLink);
router.get('/fpass/:uniqueId',LoginController.fpass);
router.post('/updatefpass',LoginController.updatefpass);

router.get('/changePassword/:is_active?',CommonFunction.verifyToken,LoginController.changePassword);
router.post('/chkOldPass',CommonFunction.verifyToken,LoginController.chkOldPass);
router.post('/changePasswordProcess',CommonFunction.verifyToken,LoginController.changePasswordProcess);

//router.get('/book/bookAllot/:bookid',BookController.bookAllot);
router.get('/user/memberList',CommonFunction.verifyToken,UserController.memberList);
router.post('/book/addCategory',BookController.addCategory);
router.post('/book/addBook',CommonFunction.verifyToken,upload.single('image'),BookController.addBook);
router.get('/book/addBookView',CommonFunction.verifyToken,BookController.addBookView);
router.get('/book/bookList',CommonFunction.verifyToken,BookController.bookList);
router.get('/bookRequest/:book_id',CommonFunction.verifyToken,BookController.bookRequest);
router.post('/book/search',CommonFunction.verifyToken,BookController.search);


router.get('/bookRequestDetails/:book_id',CommonFunction.verifyToken,BookController.bookRequestDetails);
router.get('/bookRequestApproveDetails/:issue_id',CommonFunction.verifyToken,BookController.bookRequestApproveDetails);
router.get('/bookRequestConfirmedDetails/:issue_id',CommonFunction.verifyToken,BookController.bookRequestConfirmedDetails);
router.get('/bookRequestReject/:issue_id',CommonFunction.verifyToken,BookController.bookRequestReject);
router.get('/bookReturn/:issue_id',CommonFunction.verifyToken,BookController.bookReturn);
router.get('/book/userBookList/:is_active?',CommonFunction.verifyToken,BookController.userBookList);
router.get('/bookQuantity/:book_id',CommonFunction.verifyToken,BookController.bookQuantity);
router.post('/UpdateBookQuantity',CommonFunction.verifyToken,BookController.UpdateBookQuantity);


router.post('/loginsec',LoginController.login);
router.get('/Dashboard',CommonFunction.verifyToken,LoginController.dashboard);
router.get('/Issues',CommonFunction.verifyToken,BookController.Issues);
router.get('/profile/:is_active?',CommonFunction.verifyToken,LoginController.profile);
router.post('/editProfile',CommonFunction.verifyToken,upload.single('userimage'),LoginController.editProfile);
router.get('/profileview',CommonFunction.verifyToken,LoginController.profile);


router.post('/createPDF',CommonFunction.verifyToken,UserController.createPDF);
router.post('/notification',CommonFunction.verifyToken,UserController.notification);

var cornset = cron.schedule('54 15 * * *', () => {
  console.log('running a task every minute');
  http.get('http://127.0.0.1:8000/cornEmailset',BookController.cornEmailset);
});

cornset.start();

module.exports = router;