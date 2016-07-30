var socket = io();

socket.on('init_list', function (data) {
	// console.log(data);

	$("#_recentScores_appendPoint").empty();
	$("#_timline_label_appendPoint").empty();
	var noScores = true;
	for(var i in data){

		if($.isEmptyObject(data[i])){
			// noLives = true;
			continue;
		}
		noScores = false;

		// console.log(data[i]); // one scorecard
		var _card = (data[i]); // one scorecard

		var newRecentScoresPanel = $("#timeline_template_recent").clone();

		var _card_id = String(i).replace("/#", "");

		// cursor display
		var newCursor = $("#timeline_link_template").clone();
		newCursor.prop('id', 'timeline_link_recent_' + _card_id);
		newCursor.addClass('added');
		newCursor.text(moment(_card["date"]).format("MMM D"));
		newCursor.show();
		$("#_timline_label_appendPoint").append(newCursor);

		// card display
		newRecentScoresPanel.prop('id', 'timeline_link_recent_' + _card_id + "_a");
		newRecentScoresPanel.find(".score_header .sport").text(_card["game"]);
		newRecentScoresPanel.find(".score_header .game_level").text(_card["description"]);
		newRecentScoresPanel.find(".score_body .score_team1").text(_card["team1"]);
		newRecentScoresPanel.find(".score_body .score_team2").text(_card["team2"]);
		newRecentScoresPanel.find(".score_footer .score_location").text(_card["location"]);
		newRecentScoresPanel.find(".score_display .score_team1_score").text(_card["team1_score"]);
		newRecentScoresPanel.find(".score_display .score_team2_score").text(_card["team2_score"]);

		newRecentScoresPanel.find(".score_timer .t_hours").text(returnTwoDigits(_card["timer_hours"]));
		newRecentScoresPanel.find(".score_timer .t_minutes").text(returnTwoDigits(_card["timer_minutes"]));
		newRecentScoresPanel.find(".score_timer .t_seconds").text(returnTwoDigits(_card["timer_seconds"]));

		newRecentScoresPanel.find(".score_footer .score_timer").text("ended " + moment(_card["date"]).fromNow());
		newRecentScoresPanel.show();

		$("#_recentScores_appendPoint").append(newRecentScoresPanel);
	}

	if(noScores){
		$("#recentScoreAvailable").slideUp();
	} else {
		$("#recentScoreAvailable").slideDown();
	}



});

socket.on('live_update', function(data){

	var noLives = true;

	$("#_liveScores_appendPoint").empty();

	for(var i in data){
		if($.isEmptyObject(data[i])){
			// noLives = true;
			continue;
		}
		noLives = false;
		console.log(data[i]); // one scorecard
		var _card = (data[i]); // one scorecard

		var newLiveScoreBoard = $("#timeline_template_live").clone();

		var _card_id = String(i).replace("/#", "");

		live_timers_list[_card_id] = {
			"hours":_card["timer_hours"],
			"minutes":_card["timer_minutes"],
			"seconds":_card["timer_seconds"],
			"running":_card["timer_running"]
		}

		newLiveScoreBoard.prop('id', 'live_' + _card_id);
		newLiveScoreBoard.find(".score_header .sport").text(_card["game"]);
		newLiveScoreBoard.find(".score_header .game_level").text(_card["description"]);
		newLiveScoreBoard.find(".score_body .score_team1").text(_card["team1"]);
		newLiveScoreBoard.find(".score_body .score_team2").text(_card["team2"]);
		newLiveScoreBoard.find(".score_footer .score_location").text(_card["location"]);
		newLiveScoreBoard.find(".score_display .score_team1_score").text(_card["score_team1"]);
		newLiveScoreBoard.find(".score_display .score_team2_score").text(_card["score_team2"]);

		newLiveScoreBoard.find(".score_timer .t_hours").text(returnTwoDigits(_card["timer_hours"]));
		newLiveScoreBoard.find(".score_timer .t_minutes").text(returnTwoDigits(_card["timer_minutes"]));
		newLiveScoreBoard.find(".score_timer .t_seconds").text(returnTwoDigits(_card["timer_seconds"]));
		newLiveScoreBoard.show();

		$("#_liveScores_appendPoint").append(newLiveScoreBoard);
	}

	if(noLives){
		stopTimer();
		$("#scorecard_noLive").slideDown();
	} else {
		stopTimer();
		startTimer();
		$("#scorecard_noLive").slideUp();
	}
});

socket.on('live_update_scores', function(data){
	var _card_id = String(data.card_id).replace("/#", "");

	$('#live_' + _card_id).find(".score_display .score_team1_score").text(data.scores[0]);
	$('#live_' + _card_id).find(".score_display .score_team2_score").text(data.scores[1]);

});

socket.on('live_update_time', function(data){
	var _card_id = String(data.card_id).replace("/#", "");

	live_timers_list[_card_id] = {
		"hours":data.times["timer_hours"],
		"minutes":data.times["timer_minutes"],
		"seconds":data.times["timer_seconds"],
		"running":data.times["timer_running"]
	}

	// console.log(live_timers_list[_card_id]);
	$('#live_' + _card_id).find(".score_timer .t_hours").text(returnTwoDigits(data.times["timer_hours"]));
	$('#live_' + _card_id).find(".score_timer .t_minutes").text(returnTwoDigits(data.times["timer_minutes"]));
	$('#live_' + _card_id).find(".score_timer .t_seconds").text(returnTwoDigits(data.times["timer_seconds"]));

});

socket.on('live_photo_updated', function(msg){
	console.log("[live_photo_updated]");

	changeBackground();
})

socket.on('score_list', function(msg){
	console.log("[score_list]");
	console.log(msg);
	var scores = msg;
	$("#title4 .placed_1").find(".name").text(getFullName(scores[1][0]));
	$("#title4 .placed_2").find(".name").text(getFullName(scores[2][0]));
	$("#title4 .placed_3").find(".name").text(getFullName(scores[3][0]));

	$("#title4 .placed_1").find(".points").text(scores[1][1] + "pts");
	$("#title4 .placed_2").find(".points").text(scores[2][1] + "pts");
	$("#title4 .placed_3").find(".points").text(scores[3][1] + "pts");

	$("#title4 .placed_1").find(".logo").attr("src", "img/uni_logo/" + scores[1][0] + ".png" );
	$("#title4 .placed_2").find(".logo").attr("src", "img/uni_logo/" + scores[2][0] + ".png" );
	$("#title4 .placed_3").find(".logo").attr("src", "img/uni_logo/" + scores[3][0] + ".png" );
})

var uniList = {
	"PER": "University of Peradeniya",
	"COL": "University of Colombo",
	"KEL": "University of Kelaniya",
	"SJP": "University of Sri Jayewardenepura",
	"MOR": "University of Moratuwa",
	"RUH": "University of Ruhuna",
	"JAF": "University of Jaffna",
	"EST": "Eastern University of Sri Lanka",
	"RAJ": "Rajarata University of Sri Lanka",
	"SAB": "Sabaragamuwa University of Sri Lanka",
	"WAY": "Wayamba University of Sri Lanka",
	"SEA": "South Eastern University of Sri Lanka",
	"VPA": "University of the Visual & Performing Arts",
	"UVA": "Uva Wellassa University",
}

function getFullName(shortName){
	return uniList[shortName];
}
