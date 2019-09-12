const async=require('async');
const Sequelize = require('sequelize');
const sequelize = require('../config/database').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const bcrypt=require('bcrypt-nodejs');
const Q = require("q");
var deferred = Q.defer()
/***********************  Connection with model ************************************/

var Book = require('../models/book')(sequelize,DataTypes);
var Issue = require('../models/issue')(sequelize,DataTypes);
var User = require('../models/user')(sequelize,DataTypes);
var Booklist = require('../models/booklist')(sequelize,DataTypes);
var Category = require('../models/category')(sequelize,DataTypes);
var UserRepository = require('../repositories/UserRepository');

//Issue.hasMany(User,{sourceKey: 'user_id' , foreignKey: 'id'} );
Book.hasMany(Issue,{foreignKey: 'book_id' , sourceKey: 'id'} );
Issue.belongsTo(User,{foreignKey: 'user_id' , sourceKey: 'id'} );
/***********************************************************************************/

module.exports.addCategory = (data,callback)=>{		
	var CatData = {
		name : data.name,				
	}	
	Category.create(CatData)
	.then(result => {
		callback(null,result);
	}).catch(err => {
		callback(err,null);
	});
}

module.exports.addBook = (record,callback)=>{	
	var data = record.body;	
	let quantity = data.quantity;
	let bookname = data.bookname;
	var filedata = record.file;	
	var bookData = {
		bookname : bookname,
		author 	 : data.author,
		quantity : quantity,
		catId	 : data.categoryId,
		image    : filedata.filename		
	}
	Book.create(bookData)
	.then(result => {		
	  let bookid  = result.dataValues.id;
	  var array = [];
	  for(var i = 1 ; i <= quantity ; i++)
	  {
	  	 name = bookname +' - 00'+bookid+i;
	  	 booklist = {
	  	 	name 	: name,
	  	 	book_id : bookid
	  	 }
	  	 Booklist.create(booklist)
	  	 .then(res => {
	  	 	array.push(res);
	  	 }).catch(error => {
	  	 	array.push(error);
	  	 });

	  }
		callback(null,array);
	}).catch(err => {
		callback(err,null);
	});
}

module.exports.bookList = (data,callback) => {
	Book.findAll({
		where: { status: 'A'},
		attributes: ['id', 'bookname', 'author', 'quantity','image'],	  
		include :  [
			{
				model : Issue,
				attributes:['createdAt','user_id'],
				include:[
					{
						model : User,
						attributes:['name','email','mobile','image']
					}
				]
			}
			
		]		
	}).then(result =>{
		callback(null,result);
	}).catch(error =>{
		callback(error,null);
	});
}


module.exports.bookRequestDetails = (data,callback) => {
	book_id = data.params.book_id;
	Book.findAll({
		where: { status: 'A' , id : book_id},
		attributes: ['id', 'bookname', 'author', 'quantity','image'],	  
		include :  [
			{
				model : Issue,
				attributes:['id','createdAt','updatedAt','user_id','status'],
				include:[
					{
						model : User,
						attributes:['name','email','mobile','image']
					}
				]
			}
			
		]		
	}).then(result =>{
		callback(null,result);
	}).catch(error =>{
		callback(error,null);
	});
}


module.exports.bookListForUser = (data,callback) => {
	Book.findAll({
		where: { status: 'A'},
		attributes: ['id', 'bookname', 'author', 'quantity','image']
	}).then(result =>{
		callback(null,result);
	}).catch(error =>{
		callback(error,null);
	});
}

//  book assign for user Request
module.exports.bookRequest = (request,callback)=>{
	book_id = request.params.book_id;
	user_id = request.user.dataValues.id;
	Book.findOne({
		where: 
		{
			status: 'A',
			id: book_id
		},
		attributes: ['quantity']
	}).then(result =>{			
		if(result.dataValues.quantity > 0)
		{
			Issue.findOne({
				where: 
				{
					//status  : 'C',
					book_id : book_id,
					user_id : user_id
				},
				attributes : ['status']
			}).then(record=>{					
				if(record != null)	
				{
					let status = record.dataValues.status;		
					if(status == 'D' || status == 'I' || status == 'F')
					{
						IssueData = {
							book_id : book_id,
							user_id : user_id,
							status  : 'R'				
						};
						Issue.create(IssueData)
						.then(issueres => {
						/*	bookQuantity = result.dataValues.quantity -1;
							Book.update({ quantity: bookQuantity},{where:{	id: book_id}}).then(res=>{
								let msg = 'Book assign to the member successfully.';
								callback(null,msg);
							}).catch(err=>{
								callback(err,null);
							});*/
							let msg = 'Request has been submitted.';
							callback(null,msg);
						}).catch(issueerr=>{
							let msg = 'Request has not been submitted due to some error.';
							callback(null,msg);
						});
					}
					else if(status == 'R')
					{
						let msg = 'Request already submitted with us.';
					    callback(null,msg);
					}
					else
					{
						let msg = 'Book had already issued for the member.';
					    callback(null,msg);
					}
				}
				else
				{
					IssueData = {
						book_id : book_id,
						user_id : user_id,
						status  : 'R'				
					};
					Issue.create(IssueData)
					.then(issueres => {					
						let msg = 'Request has been submitted.';
						callback(null,msg);
					}).catch(issueerr=>{
						let msg = 'Request has not been submitted due to some error.';
						callback(null,msg);
					});
				}
				
			}).catch(errRecord =>{
				callback(errRecord,null);
			});			
		}
		else
		{
			let msg = 'Book is not available now.';
			callback(null,msg);
		}
		
	}).catch(error =>{
		callback(error,null);
	});
}

module.exports.bookAllot = (bookid)=>{
	Booklist.findAll({
		where : {
			book_id : bookid,
			status : 'NA'
		},
		attributes : ['id','name']
	}).then(result => {
		deferred.resolve(result[0])
	}).catch(error => {
		deferred.reject(error);
	});

	return deferred.promise;
}

module.exports.bookRequestApproveDetails = (data,callback)=>{
	Issue.findOne({
		where : {
			id : data.issue_id,
			status : 'R'
		},
		attributes : ['book_id','user_id']
	}).then(result => {
		let book_id = result.dataValues.book_id;
		let user_id = result.dataValues.user_id;		
		Promise.all([	
			UserRepository.userDetails(user_id),	 	
		 	this.bookAllot(book_id)		 	
		 ]).then(([userDtls,bookIds]) => {
		 		let details = {
				name  	: userDtls.dataValues.name,
				email 	: userDtls.dataValues.email,
				bookId 	: bookIds.dataValues.name
			}
			Issue.update(
				{ status      : 'A',
				  BookAllotId : bookIds.dataValues.name, 
				  updatedAt   : Date.now()
				},
				{
					where : {id : data.issue_id}
				}).then(res1 => {
				Booklist.update({ status: 'A'},{where:{	id: bookIds.dataValues.id}}).then(res=>{
					global.eventemitter.emit('BookApprove',details);
					callback(null,'Approved');
				}).catch(err => {
					callback(err,null);
				});
			}).catch(error1 => {
				callback(error1,null);
			});	
		}).catch(([err1,err2])=>{
			callback('Failed',null);
		});
	}).catch(error => {
		callback(error,null);
	});

}