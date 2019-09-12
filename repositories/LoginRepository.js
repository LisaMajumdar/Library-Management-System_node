const async=require('async');
const Sequelize = require('sequelize');
const sequelize = require('../config/database').sequelize;
var   DataTypes = require('sequelize/lib/data-types');
const bcrypt=require('bcrypt-nodejs');

/***********************  Connection with model ************************************/

var User = require('../models/user')(sequelize,DataTypes);
var CommonFunction = require('../middlewares/CommonFunction')
/**********************************************************************************/

module.exports.login = (data,callback) => {	
	let email = data.email;
	let type = data.type;  console.log(type);
	let password  = data.password; 
	User.findOne({
		where : {
			email : email,
			status : 'A',
			type   : type
		},
		attributes : ['id','password']
	}).then(result => {
		//console.log(result);
		hash = result.dataValues.password;	
		let userId = result.dataValues.id;	
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