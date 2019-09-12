var BookRepository = require('../repositories/BookRepository');

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

module.exports.addBookView = (req,res,callback)=>{	
	if(req.user.dataValues.type == 'admin')
	{
		res.render('addBook');
	}
}

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
				res.render('UserBookList',{'data':result});
		});
	}
}

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

module.exports.bookIssue = (req, res, callback) => {	
	BookRepository.bookIssue(req.params,function(err,result){
		if(err)
			callback(err);
		else
			res.json(result);
	});
}


/*module.exports.bookAllot = (req,res,callback)=>{
	console.log(req.params.bookid);
	BookRepository.bookAllot(req.params.bookid,function(err,result){
		if(err)
			callback(err);
		else
			console.log(result[0]);
			res.json(result);
	});
}*/