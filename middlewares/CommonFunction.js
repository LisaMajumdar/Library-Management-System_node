const Sequelize = require('sequelize');
const sequelize = require('../config/database').sequelize;
var   DataTypes = require('sequelize/lib/data-types');
var moment = require('moment');
const Q = require("q");
const fs =require('fs');
const nJwt = require('njwt');
const crypto = require('crypto');

/***********************  Connection with model ************************************/

var User = require('../models/user')(sequelize,DataTypes);
var RefreshToken = require('../models/refreshtoken')(sequelize,DataTypes);
/**********************************************************************************/

// Check Email Availability

module.exports.getRandomString = function(email){
	User.findAll({
		where : {
			email : email
		},
		attributes : ['status']
	}).then(result => {
		var status = result.dataValues.status;
		if(status == 'A' || status == 'I')
		{
			return 1;
		}
		else
		{
			return 0; 
		}
	}).catch(err => {
		return err ;
	});
}


// generate for refresh token 

module.exports.getRandomString = function (howMany, callback) {
  const deferred = Q.defer();
  howMany = howMany || 10;
  chars = "lbubbybyjjykybybcxxz78945661230$&uug5WQKDRTYv5642FWYTWTOIGJGVBV88774";

  let rnd = crypto.randomBytes(howMany)
    , value = new Array(howMany)
    , len = chars.length;

  for (let i = 0; i < howMany; i++) {
    value[i] = chars[rnd[i] % len]
  }

  let randomString = value.join('');
  deferred.resolve(randomString);
  deferred.promise.nodeify(callback);
  return deferred.promise;
};


module.exports.dateDifference = date => {
	var current = 	Date.now();
	var dateB 	= 	moment(date);
	var dateC 	= 	moment(current);
	var diff 	=  	dateC.diff(dateB, 'days');	
	//console.log(diff);
	return diff;
}

module.exports.lateFine = days => {
	let fine = global.constant.fine;
	let value = fine * days;
	return value;
}

module.exports.publicKey = () => {
	let file = global.constant.jwt.public_key;
	let filePath = global.apppath+'/'+file;
	let secret = fs.readFileSync(filePath,'utf-8');	
	return file;
}


module.exports.readFile = (file) => {
	//let file = global.constant.jwt.public_key;
	let filePath = global.apppath+'/'+file;
	//let secret = fs.readFileSync(filePath,'utf-8');	
	return filePath;
}


// GENERATE ACCESS TOKEN 

module.exports.generateAccessToken = (payload) => {
	let file = global.constant.jwt.public_key;
	let filePath = global.apppath+'/'+file;
	let secret = fs.readFileSync(filePath,'utf-8');	
	let option = global.constant.jwt.algorithm;
	var jwt = nJwt.create(payload,secret,option);  
	var accessToken = jwt.compact();	
	return accessToken;
}

// verify Token 
module.exports.verifyToken = (req,res,callback) => {	
	if(req.session.header == null)
	{
		res.redirect('/Login');
	}
	else{
		let Token = req.session.header.accessToken;	
		let file  = global.constant.jwt.public_key;
		let filePath = global.apppath+'/'+file;
		let secret = fs.readFileSync(filePath,'utf-8');	
		let option = global.constant.jwt.algorithm;
		nJwt.verify(Token,secret,option,function(err,result){
			if(err)
			{
				let msg = "Something went wrong";
				return callback(msg,null);
			}
			else
			{
				User.findOne({
			    	where :{id :result.body.userId , type : result.body.usertype},
			    	attributes : ['id','type']
		    	}).then((result1)=> {		    		
		    		 req.user = result1;  	
		    		 //console.log('user record ============== ',req.user);	
		    		 return callback();
		    	}).catch((error)=> {
		    		 return  callback(error, null);
		    	}); 
			}
		}); 
	}
		
}

// GENERATE REFRESH TOKEN WITH ACCESS TOKEN 

module.exports.generateRefreshTokenWithAccessToken = (schemeName , id , payload , callback) => {
	Promise.all([
		this.generateAccessToken(payload),
		this.getRandomString(50)
		]).then(([accessToken,refreshToken])=>{
			//console.log('Refresh Token ============  ',refreshToken);
			if(refreshToken)
				{
					let refreshTkn = {
						schemeName : schemeName,
						itemId : id,
						refreshtoken : refreshToken,
						is_active    : '0'
					}
					RefreshToken.create(refreshTkn).then(res => {
						let result = {
							accessToken: accessToken,
							refreshToken:refreshToken
						}						
						callback(null,result);
					}).catch(error =>{
						callback(error,null);
					});
				}
				else
				{
					let msg = "Something went wrong.";
					callback(null,msg);
				}		
		}).catch(err => {
			callback(err,null);
		});
}