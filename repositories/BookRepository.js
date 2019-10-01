const async=require('async');
const sequelize = require('../config/database').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const bcrypt=require('bcrypt-nodejs');
const Q = require("q");
var deferred = Q.defer();
var moment = require('moment');
const date = require('date-and-time');
const now = new Date();
//const Op = Sequelize.Op;
//moment().format();
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
Issue.belongsTo(Book,{foreignKey: 'book_id' , targetKey: 'id' });
/***********************************************************************************/
// Add Category From Admin

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

// Add new book details

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

// show book details with Issue & user details

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

// Book request detail for admin

module.exports.bookRequestDetails = (data,callback) => {
	book_id = data.params.book_id;
	Book.findAll({
		where: { status: 'A' , id : book_id},
		attributes: ['id', 'bookname', 'author', 'quantity','image'],	  
		include :  [
			{
				model : Issue,
				attributes:['id','createdAt','issueDate','user_id','status'],
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

// Book List show For user

module.exports.bookListForUser = (data,callback) => {
	Book.findAll({
		where: { status: 'A'},
		attributes: ['id', 'bookname', 'author', 'quantity','image']
	}).then(result =>{
		var res = {
			result : result,
			searchval : ''
		}
		callback(null,res);
	}).catch(error =>{
		callback(error,null);
	});
}


module.exports.search = (data,callback) => {
	Book.findAll({
		where: { status: 'A', catId : data.categoryId},
		attributes: ['id', 'bookname', 'author', 'quantity','image']
	}).then(result =>{
		var res = {
			result : result,
			searchval : data.categoryId
		}
		callback(null,res);
	}).catch(error =>{
		callback(error,null);
	});
}






//  book Request submit from user end 

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
		if(result.dataValues.quantity > 1)
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
							status  : 'R',
							issueDate  : date.format(now, 'YYYY-MM-DD HH:mm:ss')				
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
						status  : 'R',
						issueDate  : date.format(now, 'YYYY-MM-DD HH:mm:ss')				
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
			let msg = 'Only one copy is available now . It will be not allotted to anybody.';
			callback(null,msg);
		}
		
	}).catch(error =>{
		callback(error,null);
	});
}

// Return book record depends on book id whioch is not alloted to any one 

module.exports.bookAllot = (bookid)=>{
	return new Promise((resolve,reject)=>{
		Booklist.findAll({
		where : {
			book_id : bookid,
			status : 'NA'
		},
		attributes : ['id','name']
		}).then(result => {		
			resolve(result[0])
		}).catch(error => {
			reject(error);
		});
	});	
	
}

// how much book quantity have in BookList table in library depends on bookid

module.exports.books = (bookid)=>{	
	//console.log('id ************************ ',bookid);
	return new Promise(function(resolve,reject){
		Booklist.count({
			where : {
				book_id : bookid			
			},
		}).then(res => {	
			//console.log('resuly =============   ', res);	
			resolve(res);
		}).catch(error => {
			reject(error);
		});
	})
	
}

// Find Bookname & quantity in Books table

module.exports.bookDetails = (bookid)=>{
	return new Promise((resolve,reject) => {
		Book.findOne({
			where : {
				id : bookid
			},
			attributes : ['bookname','quantity','author']
		}).then(result => {			
			resolve(result)
		}).catch(error => {
			reject(error);
		});
	});	
}

// After return Book quantity will be increased

module.exports.updateBookQuantity = (bookid,bookQuantity,booklistId)=>{
	return new Promise((resolve,reject) => {
		Book.findOne({
			where : {
				id : bookid
			},
			attributes : ['quantity']
		}).then(result => {		
			let quantity = result.dataValues.quantity + bookQuantity;
			Book.update({quantity  : quantity},{where : {id : bookid}}).then(res => {
				Booklist.update({status : 'NA'} , {where : {id : booklistId}}).then(res1 => {
					resolve(res1);
				}).catch(err1 => {
					resolve(err1);
				});			
			}).catch(err => {
				reject(err);
			});
			
		}).catch(error => {
			reject(error);
		});
	});
}

// Book Request approval details from admin

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
				  booklistId : bookIds.dataValues.id,
				  issueDate  : date.format(now, 'YYYY-MM-DD HH:mm:ss')
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

// Book Request Confirmed from admin

module.exports.bookRequestConfirmedDetails = (data,callback)=>{
	Issue.findOne({
		where : {
			id : data.issue_id,
			status : 'A'
		},
		attributes : ['book_id','user_id','booklistId']
	}).then(result => {
		let book_id 	= result.dataValues.book_id;
		let booklistId 	= result.dataValues.booklistId;
		let user_id 	= result.dataValues.user_id;		
		Promise.all([	
			UserRepository.userDetails(user_id),	 	
		 	this.bookDetails(book_id)		 	
		 ]).then(([userDtls,bookDtls]) => {
		 	console.log(userDtls);
		 	console.log(bookDtls);
		 	let details = {
				name  		: userDtls.dataValues.name,
				email 		: userDtls.dataValues.email,
				bookname 	: bookDtls.dataValues.bookname
			}
			Issue.update(
				{ 
					status     : 'C',				  
				  	issueDate  : date.format(now, 'YYYY-MM-DD HH:mm:ss')
				},
				{
					where : {id : data.issue_id}
				}).then(res1 => {
				Booklist.update({ status: 'C' },{ where: { id: booklistId }
				}).then(res=>{
					let bookQuantity = bookDtls.dataValues.quantity - 1;
					//console.log('BOOK QUANTITYYYYYYYYYYYYYYYYYYYYY', bookQuantity);
					Book.update({ quantity: bookQuantity},{where:{	id: book_id}}).then(res2=>{
						global.eventemitter.emit('BookConfermation',details);							
						callback(null,'Confirmed');
					}).catch(err3=>{
						callback(err3,null);
					});					
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

// Book Request reject from admin

module.exports.bookRequestReject = (data,callback)=>{
	Issue.findOne({
		where : {
			id : data.issue_id,
			status : 'R'
		},
		attributes : ['user_id']
	}).then(result => {
		let user_id = result.dataValues.user_id;		
		Promise.all([	
			UserRepository.userDetails(user_id)
		 ]).then(([userDtls]) => {
		 	let details = {
				name  		: userDtls.dataValues.name,
				email 		: userDtls.dataValues.email				
			}
			Issue.update(
				{ 
					status      : 'I',				  
				  	issueDate   : date.format(now, 'YYYY-MM-DD HH:mm:ss')
				},
				{
					where : {id : data.issue_id}
			}).then(res1 => {
				global.eventemitter.emit('BookRequestReject',details);
				//let msg = 'Request has been Rejected'.
				callback(null,'Rejected');
			}).catch(err => {
				callback(err,null);
			});	
			
		}).catch(([err1])=>{
			callback('Failed',null);
		});
	}).catch(error => {
		callback(error,null);
	});
}

// Book Return Confirmation from admin

module.exports.bookReturn = (data,callback)=>{
	Issue.findOne({
		where : {
			id : data.issue_id,
			status : 'C'
		},
		attributes : ['book_id','user_id','booklistId']
	}).then(result => {
		let book_id 	= result.dataValues.book_id;
		let booklistId 	= result.dataValues.booklistId;
		let user_id 	= result.dataValues.user_id;		
		Promise.all([	
			UserRepository.userDetails(user_id),
			this.updateBookQuantity(book_id,1,booklistId)
		 ]).then(([userDtls,books]) => {
		 	let details = {
				name  		: userDtls.dataValues.name,
				email 		: userDtls.dataValues.email				
			}
			Issue.update(
				{ 
					status      : 'D',				  
				  	issueDate  : date.format(now, 'YYYY-MM-DD HH:mm:ss')
				},
				{
					where : {id : data.issue_id}
			}).then(res1 => {
				global.eventemitter.emit('BookReturn',details);
				callback(null,'Success');
			}).catch(err => {
				callback(err,null);
			});	
			
		}).catch(([err1,err2])=>{
			callback('Failed',null);
		});
	}).catch(error => {
		callback(error,null);
	});
}


module.exports.userBookList = (userid,type,callback)=>{
	let userId = userid;
	if(type == 'user')
	{
		var condition = {
			user_id : userId
		}
	}
	else{
		var condition = {
			user_id : userId,
			status  : 'C'
		}
	}
	Issue.findAll({
		where : condition,
		attributes : ['book_id','BookAllotId','fineAmt','issueDate','status'],
		include    : [
				{
					model : Book,
					attributes : ['bookname','author']
				} 
			]
	}).then(result => {
		callback(null,result);		
	}).catch(error => {
		callback(error,null);
	});
}

// Seven days warning mail by corn

module.exports.cornEmailset = (data)=>{
	return new Promise((resolve,reject)=>{
		Issue.findAll({
		where : {
			status : 'C'
		},
		attributes : ['id','book_id','user_id','booklistId','BookAllotId','issueDate'],		
		}).then(result => {
			resolve(result);
		}).catch(error => {	
			reject(error);
		});
	})	
	
}

// Update Late fine 
module.exports.fineUpdate = (amount,issueId,callback) =>{
	console.log(issueId);
	Issue.update({fineAmt : amount},{where : {id : issueId}}).then(result => {
		callback(null,result);
	}).catch(err => {
		callback(err,null);
	});
}

// Update Book Quantity For admin

module.exports.UpdateBookQuantityFrmAdmin = (data,callback) => {
	let qty 		= parseInt(data.qty);
	let bookId 		= data.bookId; console.log('bookId ===  ',bookId);
	Book.findOne({
		where : {
			id : bookId
		},
		attributes : ['bookname','quantity']
	}).then(recordval => {
		var bookname = recordval.dataValues.bookname ;
		var prvQty	 = recordval.dataValues.quantity ;
		var preQty   = parseInt(prvQty) + qty;
		this.books(bookId).then(val => {
			var array = [];
			for (var i = parseInt(val) + 1 ; i <= parseInt(val) + qty ; i++) {
				name = bookname +' - 00'+bookId+i;
			  	booklist = {
			  	 	name 	: name,
			  	 	book_id : bookId
			  	}
			  	Booklist.create(booklist)
			  	.then(res => {
			  	 	array.push(res);
			  	}).catch(error => {
			  	 	array.push(error);
			  	});
			}
			Book.update({ quantity : preQty} , {where : {id : bookId}}).then(res => {
				callback(null,res)
			}).then(err => {
				callback(err,null);
			});
		}).catch(error => {
			callback(error,null);
		});
		
		
	}).catch(err1 => {
		callback(err1,null);
	});
}
