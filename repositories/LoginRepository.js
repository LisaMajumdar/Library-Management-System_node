const async=require('async');
const sequelize = require('../config/database').sequelize;
var   DataTypes = require('sequelize/lib/data-types');
const bcrypt=require('bcrypt-nodejs');

/***********************  Connection with model ************************************/

var User = require('../models/user')(sequelize,DataTypes);
var CommonFunction = require('../middlewares/CommonFunction')
/**********************************************************************************/

module.exports.login = (data,callback) => {	
	let email = data.email;
	let type = data.type;  
	let password  = data.password; 
	User.findOne({
		where : {
			email : email,
			status : 'A',
			type   : type
		},
		attributes : ['id','password']
	}).then(result => {		
		hash = result.dataValues.password;	
		let userId = result.dataValues.id;	
	//	console.log(bcrypt.compareSync(password , hash));
		if(bcrypt.compareSync(password , hash) == true)
		 {		 	
			let playload = {					
				 "sub": "1234567890",
				 "userId": userId,	
				 "usertype": type,			 
				 "admin" : true,
				 "jti"	 : "d148019c-04c2-4e38-bd4c-982977145618",
				 "iat"   : 1565249716,
				 "exp"   : 60 * 120
			};	
			CommonFunction.generateRefreshTokenWithAccessToken('User',userId,playload,function(err,result){
				if (err) 
					callback(err,null);
				else
					callback(null,result);
			});		 		
		 }
		 else
		 {
		 	callback(null,'Not Match');
		 }
	}).catch(error => {
		callback(error,null);
	});
}


module.exports.profile = (data,callback) => {
	//console.log('Record Found');
	console.log(data.user.dataValues);
	User.findOne({
    	where :{id :data.user.dataValues.id },
    	attributes : ['name','email','mobile','image','type']
	}).then((result)=> {		    		
		 callback(null,result);
	}).catch((error)=> {
		 callback(error, null);
	}); 	
}


module.exports.forgetPasswordSendLink = (data,callback) => {	
	let email = data.email;
	let type = data.type;  
	User.findOne({
		where : {
			email : email,
			status : 'A',
			type   : type
		},
		attributes : ['token','name']
	}).then(result => {
		let details = {
			name  : result.dataValues.name,
			email : email,
			token : result.dataValues.token
		}
		global.eventemitter.emit('forgetPassword',details);		
		let msg = 1;
		callback(null,msg);
	}).catch(err => {
		let msg = 0;		
		callback(msg,null);
	});
}


module.exports.updatefpass = (data,callback) => {
	let token  	  	= data.uniqueval; 
	let saltRounds 	= global.constant.saltRounds;			
	var salt 		= bcrypt.genSaltSync(saltRounds);			
	var password 	= bcrypt.hashSync(data.password, salt);
	User.update({password : password},{where : {token : token}}).then(result => {
		let msg = 1;
		callback(null,msg);
	}).catch(err => {
		let msg = 2;
		callback(msg,null);
	});
}
