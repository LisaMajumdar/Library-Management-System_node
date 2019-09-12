
var UserRepository = require('../repositories/UserRepository');

module.exports.insert = (req,res,callback) =>{	
	UserRepository.insert(req,function(err,result){
		if(err)
			callback(err);
		else
			res.json(result);
	});
}

module.exports.getUserDetails = (req,res,callback) =>{
	UserRepository.getUserDetails(req.params,function(err,result){
		if(err)
			callback(err);
		else
			res.json(result);
	});
}

module.exports.verifyEmail = (req,res,callback) =>{
	UserRepository.verifyEmail(req.params,function(err,result){
		if(err)
			callback(err);
		else			
			res.redirect('http://127.0.0.1:8000/login');			
	});
}

