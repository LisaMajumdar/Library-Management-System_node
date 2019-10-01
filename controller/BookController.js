

var BookRepository = require('../repositories/BookRepository');
var UserRepository = require('../repositories/UserRepository');
var CommonFunction = require('../middlewares/CommonFunction')
// Add Category From Admin

module.exports.addCategory = (req, res, callback) => {	
	if(req.user.dataValues.type == 'admin')
	{
		BookRepository.addCategory(req.body,function(err,result){
			if(err)
				callback(err);
			else
				res.redirect('/book/bookList');
		});
	}
	else{
		res.json('Not Found');
	}
}

// Add new book details

module.exports.addBook = (req, res, callback) => {	
	if(req.user.dataValues.type == 'admin')
	{
		BookRepository.addBook(req,function(err,result){
			if(err)
				callback(err);
			else
				res.redirect('/book/bookList');
		});
	}
	else{
		res.json('Not Found');
	}
}

// Add new book details view page 

module.exports.addBookView = (req,res,callback)=>{	
	if(req.user.dataValues.type == 'admin')
	{
		res.render('addBook');
	}
}

// show book details with Issue & user details

module.exports.bookList = (req,res,callback)=>{
	if(req.user.dataValues.type == 'admin')
	{
		BookRepository.bookList(req.params,function(err,result){
			if(err)
				callback(err);
			else				
				res.render('BookList',{'data':result});
		});
	}
	else
	{
		BookRepository.bookListForUser(req.params,function(err,result){
			if(err)
				callback(err);
			else
				//res.json(result);				
				res.render('UserBookList',{'data':result.result, 'searchval':result.searchval});
		});
	}
}


//BOOK Search 

module.exports.search = (req,res,callback) => {
	BookRepository.search(req.body,function(err,result){
		if(err)
			callback(err);
		else
			res.render('UserBookList',{'data':result.result, 'searchval':result.searchval});
	});
}


//  book Request submit from user end 

module.exports.bookRequest = (req, res, callback) => {
	if(req.user.dataValues.type == 'user')
	{
		BookRepository.bookRequest(req,function(err,result){
			if(err)
				callback(err);
			else
				res.json(result);
		});
	}
	else{
		res.json('Not Authorized');
	}	
}

// Book request detail for admin

module.exports.bookRequestDetails = (req, res, callback) => {	
	if(req.user.dataValues.type == 'admin')
	{
		BookRepository.bookRequestDetails(req,function(err,result){
			if(err)
				callback(err);
			else
				res.render('RequestList',{'data':result});
		});
	}
	else{
		res.json('Not Authorized');
	}	
}

// Book Request approval details from admin

module.exports.bookRequestApproveDetails = (req, res, callback) => {
	//console.log(req.user);
	if(req.user.dataValues.type == 'admin')
	{
		BookRepository.bookRequestApproveDetails(req.params,function(err,result){
			if(err)
				callback(err);
			else
				res.json(result);
		});
	}
}

// Book Request Confirmed from admin

module.exports.bookRequestConfirmedDetails = (req, res, callback) => {	
	if(req.user.dataValues.type == 'admin')
	{
		BookRepository.bookRequestConfirmedDetails(req.params,function(err,result){
			if(err)
				callback(err);
			else
				res.json(result);
		});
	}
}

// Book Request reject from admin

module.exports.bookRequestReject = (req, res, callback) => {	
	if(req.user.dataValues.type == 'admin')
	{
		BookRepository.bookRequestReject(req.params,function(err,result){
			if(err)
				callback(err);
			else
				res.json(result);
		});
	}
}

// Book Return Confirmation from admin

module.exports.bookReturn = (req, res, callback) => {	
	if(req.user.dataValues.type == 'admin')
	{
		BookRepository.bookReturn(req.params,function(err,result){
			if(err)
				callback(err);
			else
				res.json(result);
		});
	}
}

// Update Book Quantity For admin

module.exports.UpdateBookQuantity = (req, res, callback) => {	
	if(req.user.dataValues.type == 'admin')
	{
		//console.log(req.body);
		BookRepository.UpdateBookQuantityFrmAdmin(req.body,function(err,result){
			if(err)
				callback(err);
			else
				res.json(result);
		});
	}
}

// Update Book Quantity Page view

module.exports.bookQuantity = (req, res, callback) => {	
	if(req.user.dataValues.type == 'admin')
	{
		res.render('UpdateBookQuantity',{'bookId':req.params.book_id});
	}		
}


module.exports.userBookList = (req,res,callback)=>{
	if(req.user.dataValues.type == 'user')
	{
		userid = req.user.dataValues.id;		
	}
	else
	{
		userid = req.params.is_active;
	}
	type   = req.user.dataValues.type;
	BookRepository.userBookList(userid,type,function(err,result){
			if(err)
				callback(err);
			else
				res.render('MyBooks',{'data' : result});
		});

}

// Seven days warning mail by corn

module.exports.cornEmailset = (req,res,callback) => {
	BookRepository.cornEmailset(req).then((result)=>{		
		result.forEach((item)=>{			
			var user_id = 	item.dataValues.user_id;
			var book_alloted_id = item.dataValues.BookAllotId;
			var issueId = item.dataValues.id;
			var diff = CommonFunction.dateDifference(item.dataValues.issueDate);			
			//console.log(diff);
			var details =   {};
			if(diff < 6){
				let count = (diff - 1);
				let amount = CommonFunction.lateFine(count);
				if(amount != 0 || amount != null)
				{
					UserRepository.userDetails(user_id).then((userDetails)=>{
						details.name = userDetails.dataValues.name;
						details.email = userDetails.dataValues.email;
						details.bookId = book_alloted_id;
						details.amount = amount;
						//console.log(details)
						BookRepository.fineUpdate(amount,issueId,function(err,result1){
							if(result1)
								global.eventemitter.emit('BookReturnWarrning',details);
							else
								console.log(err);
						})
						
					}).catch((error)=>{
						console.log(error);
					});

				}				
			}else{

			}
		});		
	}).catch((error)=>{
		console.log(error);
	})
}