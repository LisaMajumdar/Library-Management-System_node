const Sequelize = require('sequelize');
const sequelize = require('../config/database').sequelize;
var DataTypes = require('sequelize/lib/data-types');
const User = require('../models/user')(sequelize, DataTypes);
const passport = require('passport');
//const auth = require('../config/function');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

	var opts = {};

	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');	
	opts.secretOrKey = 'Loginsec';		
	
	passport.use(new JwtStrategy(opts,function(payload, next){			  	
		    User.findOne({
		    	where :{id :payload.userId }
	    	}).then((result)=> {	    		
	    		 return next(null, result);
	    	}).catch((err)=> {
	    		 return  next(err, null);
	    	});    
		})
	);


	module.exports = passport