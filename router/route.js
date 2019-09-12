var express = require('express');
var router = express.Router();
var UserController = require('../controller/UserController');
var BookController = require('../controller/BookController');
var LoginController = require('../controller/LoginController');
const multer = require('multer');

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
    else
	    {
	    	let fname = 'book-'+Date.now()+'.'+ext;
	    	callback(null , fname);	
	  	}
    }
});
upload = multer({ storage: storage })



router.post('/user/insert',upload.single('userimage'),UserController.insert);
router.get('/user/userDetails/:id',UserController.getUserDetails);
router.get('/user/verifyEmail/:token',UserController.verifyEmail);
//router.get('/book/bookAllot/:bookid',BookController.bookAllot);

router.post('/book/addCategory',BookController.addCategory);
router.post('/book/addBook',CommonFunction.verifyToken,upload.single('image'),BookController.addBook);
router.get('/book/addBookView',CommonFunction.verifyToken,BookController.addBookView);
router.get('/book/bookList',CommonFunction.verifyToken,BookController.bookList);
router.get('/bookRequest/:book_id',CommonFunction.verifyToken,BookController.bookRequest);

router.get('/bookRequestDetails/:book_id',CommonFunction.verifyToken,BookController.bookRequestDetails);
router.get('/bookRequestApproveDetails/:issue_id',CommonFunction.verifyToken,BookController.bookRequestApproveDetails);
router.get('/book/bookIssue/:book_id/:user_id',BookController.bookIssue);

router.post('/login',LoginController.login);
router.get('/profile',CommonFunction.verifyToken,LoginController.profile);
router.get('/profileview',CommonFunction.verifyToken,LoginController.profile);
module.exports = router;