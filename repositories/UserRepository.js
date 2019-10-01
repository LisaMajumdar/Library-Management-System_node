const async=require('async');
const sequelize = require('../config/database').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const bcrypt=require('bcrypt-nodejs');
const Q = require("q");
var deferred = Q.defer()
/***********************  Connection with model ************************************/
var Book = require('../models/book')(sequelize,DataTypes);
var User = require('../models/user')(sequelize,DataTypes);
var Issue = require('../models/issue')(sequelize,DataTypes);

Issue.hasMany(Book , {foreignKey : 'id' , sourceKey : 'book_id'});
User.hasMany(Issue , {foreignKey : 'user_id' , sourceKey : 'id'});
Issue.belongsTo(User,{foreignKey : 'user_id' , sourceKey : 'id'})

/***********************************************************************************/

module.exports.insert = (record,callback)=>{	
	var data = record.body;	
	var filedata = record.file;			
	this.checkEmail(data.email,function(err,result){
		if(result < 1)
		{
			let saltRounds = global.constant.saltRounds;			
			var salt = bcrypt.genSaltSync(saltRounds);
			var tokenval = Math.random(11111,99999);
			var password = bcrypt.hashSync(data.password, salt);
			var userData = {
				name 	 : data.name,
				email 	 : data.email,
				password : password,
				mobile   : data.mobile,
				type     : 'user',
				token    : tokenval,
				image    : filedata.filename
			}
			User.create(userData)
			.then(result => {
				let token = 
				global.eventemitter.emit('SendverificationLink',userData);
				callback(null,result);
			}).catch(err => {
				callback(err,null);
			});
		}
		else
		{
			let msg = 'This mail is already registered with us';
			callback(null,msg)
		}
	});	
}

module.exports.checkEmail=(email,next)=>{	
	User.count({ 
		where: { email: email}
	}).then(result=>{		
		next(null,result);
	}).catch(err=>{
		next(err,null);
	});
}



module.exports.getUserDetails = (data,callback) => {
	User.findOne({
		where : {
			id : data.id
		},
		attributes : ['memberid','name','email','mobile'],
		include: [
			{
				model : Issue,
				attributes:['createdAt','book_id'],
				include:[
					{
						model : Book,
						attributes:['bookname','author']
					}
				]
			}
		]
	}).then(res=>{
		callback(null,res);
	}).catch(err=>{
		callback(err,null);
	});
}


module.exports.memberList = (data,callback) => {
	User.findAll({
		where : {
			status : 'A'
		},
		attributes:['id','memberid','name','email','mobile','image','subscribe',[sequelize.fn("COUNT", sequelize.col("issues.id")), "issuesCount"]],	
		include : [
			{
				model : Issue,
				where : {
					status : 'C'
				},
				attributes : []						
				
			}		
		],
		group : ['issues.user_id']		
		
	}).then(res=>{
		callback(null,res);
	}).catch(err=>{
		callback(err,null);
	});
}



module.exports.verifyEmail = (data,callback) => {	
	User.findOne({
		where : {
			token : data.token,
			status : 'I'
		},
		attributes : ['id']
	}).then(result => {		
		if(result != null)
        { 
        	var memberid = 'M-E00'+result.dataValues.id;
			let record = {
				memberid : memberid,
				status : 'A'
			}; 
			User.update(record,{ where: {id : result.dataValues.id}}).then(res1 => {
				callback(null,res1);
			}).catch(err => {
				callback(err,null);
			});
		}
		else
    	{
    		let msg = 'Done'; 
    		callback(null, msg);
    	}
	}).catch(error => {
		callback(error,null);
	});
}

module.exports.users = (userid,callback)=>{
	User.findOne({
		where : {
			id : userid,
			status : 'A'
		},
		attributes : ['name','email','mobile']
	}).then(result => {
		callback(null,result)
	}).catch(error => {
		callback(error,null);
	});

	return deferred.promise;
}


module.exports.userDetails = (userid)=>{
	return new Promise(function(resolve,reject){
		User.findOne({
			where : {
				id : userid,
				status : 'A'
			},
			attributes : ['name','email','mobile']
		}).then(result => {
			resolve(result)
		}).catch(error => {
			reject(error);
		});
	});	
}