"use strict"

var hours;
var minutes;
var seconds;

var timerInterval;
var _timer_running;

var stats_live;
var shownAlert;

var _password;
var _password_authenticated = false;

// var liveURL = "http://localhost:3000/";
var liveURL = "/";

/*
	db      d88888b  .d8b.  d8888b. d88888b d8888b. d8888b.  .d88b.   .d8b.  d8888b. d8888b.
	88      88'     d8' `8b 88  `8D 88'     88  `8D 88  `8D .8P  Y8. d8' `8b 88  `8D 88  `8D
	88      88ooooo 88ooo88 88   88 88ooooo 88oobY' 88oooY' 88    88 88ooo88 88oobY' 88   88
	88      88~~~~~ 88~~~88 88   88 88~~~~~ 88`8b   88~~~b. 88    88 88~~~88 88`8b   88   88
	88booo. 88.     88   88 88  .8D 88.     88 `88. 88   8D `8b  d8' 88   88 88 `88. 88  .8D
	Y88888P Y88888P YP   YP Y8888D' Y88888P 88   YD Y8888P'  `Y88P'  YP   YP 88   YD Y8888D'
	
	
*/

function init_updateLeaderboard(){
	
	$$('.confirm-update-scoreboard').on('click', function () {
		myApp.confirm('This will update the scores on live site. Continue?', 'Update Leaderboard', function () {
			updateLeaderboard();
		});
	});
}
function updateLeaderboard(){

	myApp.prompt('Enter perabeats Access Token to continue!', 'Authentication', function (value) {
		var sendingData = {"password": value};
		$.post(liveURL + "testToken", sendingData, function(data){
			if(data.status == "success"){
				_password = data.value;
				myApp.alert('Successfully authenticated!', 'Good to Go!');
				_password_authenticated = true;

				var teamName_1 = $("#team_name_1").val();
				var teamName_2 = $("#team_name_2").val();
				var teamName_3 = $("#team_name_3").val();

				var teamScore_1 = $("#points_1").val();
				var teamScore_2 = $("#points_2").val();
				var teamScore_3 = $("#points_3").val();

				var sendingData_inner = {
					"password": _password,
					"team1": teamName_1,
					"team2": teamName_2,
					"team3": teamName_3,
					"team1_score": teamScore_1,
					"team2_score": teamScore_2,
					"team3_score": teamScore_3
				};


				$$.post(liveURL + "leaderboard_update", sendingData_inner, function(data){
					var jsonData = JSON.parse(data);
					if(jsonData.status == "success"){
						console.log("[updateLeaderboard] success");
						myApp.alert('Leaderboard successfully updated, live.', 'Success');
					} else {
						myApp.alert('Failed to update leaderboard', 'Failure');
					}
				});


			} else {
				myApp.alert('Authentication unsuccessful!', 'Bad Token!');
				_password_authenticated = false;
				mainView.router.back();
			}
		})
	});
}


/*
	.88b  d88.  .d8b.  d888888b  .o88b. db   db d88888b .d8888.
	88'YbdP`88 d8' `8b `~~88~~' d8P  Y8 88   88 88'     88'  YP
	88  88  88 88ooo88    88    8P      88ooo88 88ooooo `8bo.
	88  88  88 88~~~88    88    8b      88~~~88 88~~~~~   `Y8b.
	88  88  88 88   88    88    Y8b  d8 88   88 88.     db   8D
	YP  YP  YP YP   YP    YP     `Y88P' YP   YP Y88888P `8888Y'
	
	
*/

function init(){

	console.log("starting timer module..");


	hours = $("#timer_hours");
	minutes = $("#timer_minutes");
	seconds = $("#timer_seconds");

	stats_live = false;
	shownAlert = false;

	$("#_start_timer").click(function(){
		_timer_running = true;
		startTimer();
	});

	$("#_stop_timer").click(function(){
		_timer_running = false;
		stopTimer();
	});


	$("#_team_1_inc").click(function(){
		inc_team1();
	});
	$("#_team_1_dec").click(function(){
		dec_team1();
	});
	$("#_team_2_inc").click(function(){
		inc_team2();
	});
	$("#_team_2_dec").click(function(){
		dec_team2();
	});

	$("#form_live").click(function() {
		stats_live = !stats_live;
		updateLiveStatus();
	}); 

	$("#form_team1").change(function(){
		$("#team_disp_logo_1").attr("src", "img/uni_logo/" + $(this).val() + ".png")

	});
	$("#form_team2").change(function(){
		$("#team_disp_logo_2").attr("src", "img/uni_logo/" + $(this).val() + ".png")
	});

	/*
		d8888b. d888888b  .d8b.  db       .d88b.   d888b  .d8888.
		88  `8D   `88'   d8' `8b 88      .8P  Y8. 88' Y8b 88'  YP
		88   88    88    88ooo88 88      88    88 88      `8bo.
		88   88    88    88~~~88 88      88    88 88  ooo   `Y8b.
		88  .8D   .88.   88   88 88booo. `8b  d8' 88. ~8~ db   8D
		Y8888D' Y888888P YP   YP Y88888P  `Y88P'   Y888P  `8888Y'
		
		
	*/

	$$('.confirm-reset').on('click', function () {
		myApp.confirm('This will discard current game status', 'Reset Game Data?', function () {
			resetForm();
			myApp.alert('Game Data reset to defaults', 'Success');
		});
	});
	$$('.confirm-end-game').on('click', function () {
		myApp.confirm('Game data will be archived on the live site', 'Upload data?', function () {
			uploadForm();
		});
	});
	$$('.confirm-update-stats').on('click', function () {
		myApp.confirm('Game data will be updated on the live scorecard', 'Update current game', function () {
			if(stats_live == true){
				updateCurrentGameLive();
			} else {
				myApp.alert('Not set to go live! Go Live first.', 'Update current game')
			}
		});
	});
	$$('.confirm-update-photo').on('click', function () {
		myApp.confirm('Background image will be updated on the live scorecard', 'Update current live photo', function () {
			updateBackgroundImage();
		});
	});



};


/*
	d888888b d888888b .88b  d88. d88888b d8888b.
	`~~88~~'   `88'   88'YbdP`88 88'     88  `8D
	   88       88    88  88  88 88ooooo 88oobY'
	   88       88    88  88  88 88~~~~~ 88`8b
	   88      .88.   88  88  88 88.     88 `88.
	   YP    Y888888P YP  YP  YP Y88888P 88   YD
	
	
*/
var regularTimerInterval;

function startTimer(){
	timerInterval = setInterval(propogateTime, 1000);
	regularTimerInterval = setInterval(regularTimer, 10000);
	updateTimer();
}
function stopTimer(){
	clearInterval(timerInterval);
	clearInterval(regularTimerInterval);
	updateTimer();
}
function propogateTime(){
	// console.log(hours);
	var _t_hours = Number(hours.val());
	var _t_minutes = Number(minutes.val());
	var _t_seconds = Number(seconds.val());

	_t_seconds++;

	if(_t_seconds == 60){
		_t_minutes++;
		_t_seconds = 0;
	}
	if(_t_minutes == 60){
		_t_hours++;	
		_t_minutes = 0;
	}
	if(_t_hours == 60){
		stopTimer();
	}


	// console.log(_t_hours + ":" + _t_minutes + ":" + _t_seconds);

	hours.val((_t_hours<10)?"0" + _t_hours : _t_hours);
	minutes.val((_t_minutes<10)?"0" + _t_minutes : _t_minutes);
	seconds.val((_t_seconds<10)?"0" + _t_seconds : _t_seconds);

}

/*
	.d8888.  .o88b.  .d88b.  d8888b. d88888b .d8888.
	88'  YP d8P  Y8 .8P  Y8. 88  `8D 88'     88'  YP
	`8bo.   8P      88    88 88oobY' 88ooooo `8bo.
	  `Y8b. 8b      88    88 88`8b   88~~~~~   `Y8b.
	db   8D Y8b  d8 `8b  d8' 88 `88. 88.     db   8D
	`8888Y'  `Y88P'  `Y88P'  88   YD Y88888P `8888Y'
	
	
*/

var __score_team1 = 0;
var __score_team2 = 0;

function inc_team1(){
	__score_team1++;
	updateScores();
}

function dec_team1(){
	__score_team1--;
	updateScores();
}

function inc_team2(){
	__score_team2++;
	updateScores();
}
function dec_team2(){
	__score_team2--;
	updateScores();
}


/*
	db    db d8888b. d8888b.  .d8b.  d888888b d88888b .d8888.
	88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     88'  YP
	88    88 88oodD' 88   88 88ooo88    88    88ooooo `8bo.
	88    88 88~~~   88   88 88~~~88    88    88~~~~~   `Y8b.
	88b  d88 88      88  .8D 88   88    88    88.     db   8D
	~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P `8888Y'
	
	
*/

function updateScores(){

	if(__score_team1 < 0) __score_team1 = 0;
	if(__score_team2 < 0) __score_team2 = 0;

	$("#team_score_1").text(__score_team1);
	$("#team_score_2").text(__score_team2);


	if(stats_live == false) {
		if(!shownAlert) myApp.alert('These stats will not be displayed online until you go live.', 'Not Live!');
		shownAlert = true;
		return;
	}
	shownAlert = false;
	// postScores


	if(_password_authenticated == false){
		myApp.alert('You need to go live, before archiving game stats!', 'Failure');
		return;
	} else {

		var sendingData = {
			"socket_id": socket_id,
			"password": "" + _password,
			"score_team1": __score_team1,
			"score_team2": __score_team2,
		};

		$$.post(liveURL + "liveScoreUpdate", sendingData, function(data){
			var jsonData = JSON.parse(data);
			if(jsonData.status == "success"){
				console.log("[updateScores] success");
			} else {
				console.log("[updateScores] failed");

			}
		})
	}


	updateTimer();
}

function updateTimer(){
	if(stats_live == false) return;


	if(_password_authenticated == false){
		myApp.alert('You need to go live, to show stats!', 'Failure');
		return;
	} else {

		var sendingData = {
			"socket_id": socket_id,
			"password": "" + _password,
			"timer_hours": Number(hours.val()),
			"timer_minutes": Number(minutes.val()),
			"timer_seconds": Number(seconds.val()),
			"timer_running": _timer_running,
		};

		$$.post(liveURL + "liveTimeUpdate", sendingData, function(data){
			var jsonData = JSON.parse(data);
			if(jsonData.status == "success"){
				console.log("[updateTimer] success");
			} else {
				console.log("[updateTimer] failed");

			}
		})
	}

}

function updateLiveStatus(){
	if(stats_live == true){
		myApp.prompt('Enter perabeats Access Token, will reset data if wrong!', 'Authentication', function (value) {
			var sendingData = {"password": value};
			$.post(liveURL + "testToken", sendingData, function(data){
				if(data.status == "success"){
					_password = data.value;
					myApp.alert('Successfully authenticated!', 'Good to Go!');
					_password_authenticated = true;
					updateScores();
				} else {
					myApp.alert('Authentication unsuccessful!', 'Bad Token!');
					_password_authenticated = false;
					mainView.router.back();
				}
			})
		});
		// console.log("updating live.." + stats_live);
	}
}

/*
	d888888b .88b  d88.  .d8b.   d888b  d88888b
	  `88'   88'YbdP`88 d8' `8b 88' Y8b 88'
	   88    88  88  88 88ooo88 88      88ooooo
	   88    88  88  88 88~~~88 88  ooo 88~~~~~
	  .88.   88  88  88 88   88 88. ~8~ 88.
	Y888888P YP  YP  YP YP   YP  Y888P  Y88888P
	
	
*/

function updateBackgroundImage(){
	
	if($("#form_photo").val().length == 0){
		myApp.alert('Select an image first!', 'No Image Selected');
		return;
	}

	myApp.showPreloader('Uploading Data');
	$("#image_uploadForm").ajaxSubmit({
		error: function(xhr) {
	        myApp.hidePreloader();
			status('[uploadImage]: ' + xhr.status);
		},
		success: function(response) {
	        myApp.hidePreloader();
			console.log("[uploadImage] .." + response)
		}
	});
}

/*
	d88888b  .d88b.  d8888b. .88b  d88.
	88'     .8P  Y8. 88  `8D 88'YbdP`88
	88ooo   88    88 88oobY' 88  88  88
	88~~~   88    88 88`8b   88  88  88
	88      `8b  d8' 88 `88. 88  88  88
	YP       `Y88P'  88   YD YP  YP  YP
	
	
*/
function resetForm(){
	$("#form_game").val('');
	$("#form_description").val('');
	$("#form_location").val('');
	$("#form_photo").val('');
	$("#form_team1").val('');
	$("#form_team2").val('');
	hours.val()
	minutes.val()
	seconds.val()

	$("#form_game").focus();
}
function uploadForm(){
	if(_password_authenticated == false){
		myApp.alert('You need to go live, before archiving game stats!', 'Failure');
		return;
	} else {

		if(hasEmptyFields()) {
			myApp.alert('Please fill out all information!', 'Empty fields found!');
			return;
		}

		var sendingData = {
			"socket_id": socket_id,
			"password": "" + _password,
			"form_game": "" + $("#form_game").val(),
			"form_description": "" + $("#form_description").val(),
			"form_location": "" + $("#form_location").val(),
			// "form_photo":  $("#form_photo").val(),
			"form_team1": "" + $("#form_team1").val(),
			"form_team2": "" + $("#form_team2").val(),

			"score_team1": __score_team1,
			"score_team2": __score_team2,
		};
		myApp.showPreloader('Uploading Data');

		$$.post(liveURL + "formData", sendingData, function(data){

	        myApp.hidePreloader();

			var jsonData = JSON.parse(data);
			if(jsonData.status == "success"){
				console.log("[uploadForm] success");
				myApp.alert('Game data successfully archived', 'Success');
				resetForm();
				stopTimer();
				mainView.router.back();
			} else {
				myApp.alert('Failed to archive game data', 'Failure');

			}
		})
	}
}

function updateCurrentGameLive(){

	if(_password_authenticated == false){
		myApp.alert('You need to go live, before archiving game stats!', 'Failure');
		return;
	} else {


		if(hasEmptyFields()) {
			myApp.alert('Please fill out all information!', 'Empty fields found!');
			return;
		}

		var sendingData = {
			"socket_id": socket_id,
			"password": "" + _password,
			"form_game": "" + $("#form_game").val(),
			"form_description": "" + $("#form_description").val(),
			"form_location": "" + $("#form_location").val(),
			// "form_photo":  $("#form_photo").val(),
			"form_team1": "" + $("#form_team1").val(),
			"form_team2": "" + $("#form_team2").val(),
			"score_team1": __score_team1,
			"score_team2": __score_team2,
			"timer_hours": hours.val(),
			"timer_minutes": minutes.val(),
			"timer_seconds": seconds.val(),
			"timer_running": _timer_running
		};

		myApp.showPreloader('Uploading Data');

		$$.post(liveURL + "liveData", sendingData, function(data){
	        myApp.hidePreloader();
			var jsonData = JSON.parse(data);
			if(jsonData.status == "success"){
				console.log("[updateCurrentGameLive] success");
				myApp.alert('Game data successfully updated, live.', 'Success');
			} else {
				myApp.alert('Failed to update game data', 'Failure');

			}
		})
	}

}


function hasEmptyFields(){
	if($("#form_game").val().length == 0) return true;
	if($("#form_description").val().length == 0) return true;
	if($("#form_location").val().length == 0) return true;
	if($("#form_team1").val().length == 0) return true;
	if($("#form_team2").val().length == 0) return true;

	return false;
}

function regularTimer(){
	if(stats_live==true && _password_authenticated==true){
		updateTimer();
	}
}