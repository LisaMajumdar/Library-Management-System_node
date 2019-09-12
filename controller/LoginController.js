var LoginRepository = require('../repositories/LoginRepository');

module.exports.login = (req,res,callback) =>  {
	//console.log(req.body);
	LoginRepository.login(req.body,function(err,result){
		if(err)
			callback(err);
		else
			var header = {
				'Content-Type' : 'application/json',
				//Authorization:'JWT '+result.accessToken,
				Authorization:result.accessToken
			}
			//console.log(header);		
      		req.session.header = header;			
			res.redirect('/profile');
	});
} 

module.exports.profile = function(req, res, next) { 	
    LoginRepository.profile(req, function (err, result) {
      if (err) return next(err);
     // res.json(result); 
      res.render('profile',{'data': result});  
      //res.send({ data: result })      
    });
};