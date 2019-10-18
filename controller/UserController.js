var fs = require('fs');
var pdf = require('html-pdf');
const PDFDocument = require('pdfkit');
var download = require('download-pdf');
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


module.exports.memberList = (req,res,callback) =>{
	UserRepository.memberList(req.params,function(err,result){
		if(err)
			callback(err);
		else
			res.render('MemberList',{'data':result});
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

module.exports.registration = (req,res,callback) => {
	res.render('Registration')
}

module.exports.loginView = (req,res,callback) => {
	res.render('login')
}

module.exports.logout = (req,res,callback) => {
	req.session.header = {};
	res.redirect('/Login');
}


module.exports.createPDF = (req,res,callback) => {
	
	UserRepository.memberList(req.params,function(err,result){
		if(err)
			callback(err);
		else

			var text = [];
			var sl = 0;
			result.forEach(item => {	
			sl++;	  
			//  var text1 = `id :: ${item.id}       Name :: ${item.name}     Email :: ${item.email}`; 
			  var text1 = "<tr width='100px'><td>"+sl+"</td><td>"+`${item.name}`+"</td><td>"+`${item.email}`+"</td><td>"+`${item.mobile}`+"</td><td>"+`${item.dataValues.issuesCount}`+"</td><td>"+`${item.mobile}`+"</td><td>"+`${item.subscribe}`+"</td></tr>";
			  text.push(text1);
			});

			var html = "<div> <h1 align='center' style='color: #c11926;'><u>Member List</u></h1>";
			html += "<table>";
			html += "<thead >";
			html += "<tr width='100px'>";
			html += "<th>Sl No</th>";
			html += "<th>Member Name</th>";
			html += "<th>Email</th>";
			html += "<th>Mobile</th>";
			html += "<th>issues</th>";
			html += "<th>Image</th>";
			html += "<th>Status</th></tr>";
			html += "</thead>";
			html += "<tbody>";			
			html += text;
			html +=	"</tbody>";
			html +=	"</table></div>";
		  	var options = { format: 'Letter' };
		  	var timestamp = Math.round(new Date().getTime()/1000);
		  	var filename = timestamp+'.pdf';
		  	var path  = './downloads/'+filename;
			pdf.create(html, options).toFile(path, function(err, res) {
			  if (err) 
			  	return console.log(err);
			  else		
			  	return console.log(result);	  	
			  	/*var options1 = {				    
				    directory : __dirname,
				    filename: filename
				}
				 
				download(global.apppath+'/downloads/'+filename, options, function(err){
				    if (err) 
				    console.log(err);
				});*/
			  	
			});
			res.render('MemberList',{'data':result});


	/*
		
		-----------------   Using for create pdf of text file ---------------------------------

		let doc = new PDFDocument();
		doc.pipe(fs.createWriteStream(`abc3.pdf`))
		doc.fontSize(25).text(html,100, 100)
	  	doc.end();
		
		-----------------   Using for read html file & convert to pdf ---------------------------------

	  	var path = global.apppath+'/view/MemberList.ejs';
		console.log(path);
		var html = fs.readFileSync(res.render('MemberList',{'data':result}), 'utf8');
		var options = { format: 'Letter' };

		pdf.create(html, options).toFile('./abc1.pdf', function(err, res) {
		  if (err) 
		  	return console.log(err);
		  else
		  	console.log(res); 
		});*/


	});
}


module.exports.notification = (req,res,callback) => {

	Userid  =  req.body.id;
	UserRepository.userDetails(Userid).then(result => {
		details = {
			name : result.dataValues.name,
			email : result.dataValues.email
		}
		console.log(details);
		global.eventemitter.emit('NotificationEmail',details);		
	}).catch(err => {
		console.log(err);
	});
}


