var LoginRepository = require('../repositories/LoginRepository');

module.exports.login = (req,res,callback) =>  {
	//console.log(req.body);
	LoginRepository.login(req.body,function(err,result){
		if(err)
			callback(err);
		else
			var Token = {
				'Content-Type' : 'application/json',
				//Authorization:'JWT '+result.accessToken,
				accessToken	  : result.accessToken,
				refreshToken  : result.refreshToken
			}
			//console.log(header);		
      		req.session.header = Token;			
			res.redirect('/profile');
	});
} 

module.exports.profile = function(req, res, callback) { 	
    LoginRepository.profile(req, function (err, result) {
      if (err) 
      	return callback(err);
  	  else
      	res.render('profile',{'data': result});  
     
    });
};

module.exports.forgetPassword = function(req, res, callback) { 	   
      res.render('ForgetPassword',{'msg': req.params.is_active});      
};

module.exports.forgetPasswordSendLink = function(req, res, callback) { 	
    LoginRepository.forgetPasswordSendLink(req.body, function (err, result) {
      if (err) 
        res.redirect('/ForgetPassword/'+err);
      else  
       	res.redirect('/ForgetPassword/'+result);        
    });
};

module.exports.fpass = function(req, res, callback) { 	   
      res.render('Password',{'uniqueval': req.params.uniqueId});      
};

module.exports.updatefpass = function(req, res, callback) { 	
    LoginRepository.updatefpass(req.body, function (err, result) {
      if (err) 
      //	res.json(err);
        res.redirect('/fpass/'+err);
      else  
      //	res.json(result);
       	res.redirect('/fpass/'+result);        
    });
};