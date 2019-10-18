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
	
	User.findOne({
    	where :{id :data.user.dataValues.id },
    	attributes : ['name','email','mobile','image','type']
	}).then((result)=> {		    		
		 callback(null,result);
	}).catch((error)=> {
		 callback(error, null);
	}); 	
}

module.exports.editProfile = (data, callback) => {
	var userId = data.user.dataValues.id;
	var filedata = data.file;
	if(filedata != undefined)
	{
		var userdtls = {
			name 	: data.body.name,
			email 	: data.body.email,
			mobile 	: data.body.mobile,
			image  	: filedata.filename
		}
	}else{

		var userdtls = {
			name 	: data.body.name,
			email 	: data.body.email,
			mobile 	: data.body.mobile
		}
	}	
	

	User.update(userdtls,{where : {id : userId}}).then(result => {
		this.profile(data,function(err,res){
			if(res)
				callback(null,res);
			else
				callback(err,null);
		});		
	}).catch(error => {
		callback(error,null);
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


// New Section 

module.exports.chkOldPass = (data,callback) => {
	var oldPass 	= data.body.oldPass;
    var userId 		= data.user.id;
    User.findOne({
    	where : {
    		id : userId,
    		status : 'A'
    	},
    	attributes : ['password']
    }).then(result => {
    	password = result.dataValues.password;
    	if(bcrypt.compareSync(oldPass , password) == true)
		 {	
		 	callback(null,1);
		 }
		 else
		 {
		 	callback(null,0);
		 }	    		
    }).catch(err => {
    	callback(err,null);
    });
}

module.exports.changePasswordProcess = (data,callback) => {
	var newPass 	= data.body.newPass; console.log(newPass);
    var userId 		= data.user.id;
    let saltRounds  = global.constant.saltRounds;			
	var salt 		= bcrypt.genSaltSync(saltRounds);
    var password 	= bcrypt.hashSync(newPass, salt);  console.log(password);
    User.update(
    	{
    		password : password
    	}, 
    	{
    		where : {id : userId}
    }).then(result => {
    	callback(null, 1);
    	//console.log(result);
    }).catch(err => {
    	//console.log(err);
    	callback(err, 0);
    });
}
