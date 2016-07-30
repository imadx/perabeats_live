var express = require('express');
var router = express.Router();
var sha256 = require('sha256');

// _______________________________________________________

// file uploads
var fs = require('fs');

var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, "bg" + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

var tinify = require("tinify");
tinify.key = "-LFSAk5bm6puvtphgDAg4FVVdVKOY4-W";

// _______________________________________________________

// database
var mongoose = require('mongoose');

var Game = require('../model/game_model.js');

// _______________________________________________________


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/control', function(req, res, next) {
  res.render('control');
});


router.post('/testToken', function(req, res, next) {
	console.log("received token test: " + sha256(req.body.password));
	var match = "" + sha256(req.body.password);

	if(match == ("5c972c40692353a6c53245e43c5edcf7e7f8688eeba18a9e33a214e67725078a")){
		res.send({'status':'success', 'value': req.body.password});
	}
	else
		res.send({'status':'failure', 'value': req.body.password});
});

router.post('/formData', function(req, res, next) {

	console.log("[formData] -----------------");

	console.log(req.body);
	var match = "" + sha256(req.body.password);

	if(match == ("5c972c40692353a6c53245e43c5edcf7e7f8688eeba18a9e33a214e67725078a")){

		var game_data = new Game({
			"game": req.body.form_game,
			"description": req.body.form_description,
			"location": req.body.form_location,
			"team1": req.body.form_team1,
			"team2": req.body.form_team2,
			"team1_score": req.body.score_team1,
			"team2_score": req.body.score_team2,
		});

		game_data.save(function(err) {
			if (err){
				res.send({'status':'db_failure'});
				throw err;	
			}
			console.log('Game saved successfully!');
			res.send({'status':'success'});
		});

		io.emit('live_update', control_clients.getAllLiveClients());

		var obj = JSON.parse(fs.readFileSync('model/highScores.js', 'utf8'));
		io.emit('score_list', obj);
		
		// sendList
		Game.find({}).sort({date: -1}).exec(function(err, games) {
			if (err) throw err;
			io.emit('init_list', games);
		});
	}
	else
		res.send({'status':'failure'});

	console.log("[formData] -----------------");
});

router.post('/liveData', function(req, res, next) {

	console.log("[liveData] -----------------");

	console.log(req.body);
	var match = "" + sha256(req.body.password);

	if(match == ("5c972c40692353a6c53245e43c5edcf7e7f8688eeba18a9e33a214e67725078a")){


		var _client_id = req.body.socket_id;


		var sendingData = {
			"form_game": req.body.form_game,
			"form_description": req.body.form_description,
			"form_location": req.body.form_location,
			"form_team1": req.body.form_team1,
			"form_team2": req.body.form_team2,

			"score_team1": req.body.score_team1,
			"score_team2": req.body.score_team2,

			"timer_hours": req.body.timer_hours,
			"timer_minutes": req.body.timer_minutes,
			"timer_seconds": req.body.timer_seconds,
			
			"timer_running": req.body.timer_running
		};

		control_clients.setInformation(_client_id, sendingData);

		io.emit('live_update', control_clients.getAllLiveClients());
		res.send({'status':'success'});
	}
	else
		res.send({'status':'failure'});

	console.log("[liveData] -----------------");
});

router.post('/liveScoreUpdate', function(req, res, next) {

	console.log("[liveScoreUpdate] -----------------");

	console.log(req.body);
	var match = "" + sha256(req.body.password);

	if(match == ("5c972c40692353a6c53245e43c5edcf7e7f8688eeba18a9e33a214e67725078a")){

		var _client_id = req.body.socket_id;

		var sendingData = {
			"score_team1": req.body.score_team1,
			"score_team2": req.body.score_team2
		};

		control_clients.setScores(_client_id, sendingData);

		io.emit('live_update_scores', {"card_id": _client_id, "scores": control_clients.getScores(_client_id)});
		res.send({'status':'success'});
	}
	else
		res.send({'status':'failure'});

	console.log("[liveScoreUpdate] -----------------");
});

router.post('/liveTimeUpdate', function(req, res, next) {

	console.log("[liveTimeUpdate] -----------------");

	console.log(req.body);
	var match = "" + sha256(req.body.password);

	if(match == ("5c972c40692353a6c53245e43c5edcf7e7f8688eeba18a9e33a214e67725078a")){

		var _client_id = req.body.socket_id;

		var sendingData = {
			"timer_hours": req.body.timer_hours,
			"timer_minutes": req.body.timer_minutes,
			"timer_seconds": req.body.timer_seconds,
			
			"timer_running": req.body.timer_running
		};

		control_clients.setTime(_client_id, sendingData);

		io.emit('live_update_time', {"card_id": _client_id, "times": control_clients.getTime(_client_id)});
		res.send({'status':'success'});
	}
	else
		res.send({'status':'failure'});

	console.log("[liveTimeUpdate] -----------------");
});

router.post('/leaderboard_update', function(req, res, next) {

	console.log("[leaderboard_update] -----------------");

	console.log(req.body);
	var match = "" + sha256(req.body.password);

	if(match == ("5c972c40692353a6c53245e43c5edcf7e7f8688eeba18a9e33a214e67725078a")){

		var _client_id = req.body.socket_id;

		var obj = JSON.parse(fs.readFileSync('model/highScores.js', 'utf8'));
		
		obj[1] = [req.body.team1, req.body.team1_score];
		obj[2] = [req.body.team2, req.body.team2_score];
		obj[3] = [req.body.team3, req.body.team3_score];

		fs.writeFileSync('model/highScores.js', JSON.stringify(obj));

		io.emit('score_list', obj);

		res.send({'status':'success'});
	}
	else
		res.send({'status':'failure'});

	console.log("[leaderboard_update] -----------------");
});

/*
	d888888b .88b  d88.  .d8b.   d888b  d88888b      db    db d8888b. db       .d88b.   .d8b.  d8888b.
	  `88'   88'YbdP`88 d8' `8b 88' Y8b 88'          88    88 88  `8D 88      .8P  Y8. d8' `8b 88  `8D
	   88    88  88  88 88ooo88 88      88ooooo      88    88 88oodD' 88      88    88 88ooo88 88   88
	   88    88  88  88 88~~~88 88  ooo 88~~~~~      88    88 88~~~   88      88    88 88~~~88 88   88
	  .88.   88  88  88 88   88 88. ~8~ 88.          88b  d88 88      88booo. `8b  d8' 88   88 88  .8D
	Y888888P YP  YP  YP YP   YP  Y888P  Y88888P      ~Y8888P' 88      Y88888P  `Y88P'  YP   YP Y8888D'
	
	
*/

router.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
    	// console.log(req);
        if(err) {
        	console.log(err);
            return res.send("Error uploading file.");
        }

    	var filename = req.file.path;

    	if(req.file.size > 100000){
	    	var source = tinify.fromFile(filename);
			source.toFile('public/uploads/bg.png', function(){
				console.log("successfully minified..");
				io.emit('live_photo_updated', true);
			});
    	} else {
    		fs.rename(filename, "public/uploads/bg.png", function(){
				console.log("successfully UNminified..");
				io.emit('live_photo_updated', true);
    		});
    	}

        res.send("File is uploaded");
    });
});


module.exports = router;
