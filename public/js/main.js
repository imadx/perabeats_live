/*
	db    db d888888b
	88    88   `88'
	88    88    88
	88    88    88
	88b  d88   .88.
	~Y8888P' Y888888P
	
	
*/


$(document).ready(function(){
	setMainTitle();
});

$(window).resize(function(){
	setMainTitle();
});

function setMainTitle(){
	$("#_mainTitle_wrapper").fadeIn();
	var main_height = $("#_mainTitle").height();
	var window_height = $(window).height();

	$("#_mainTitle_wrapper").width($(window).innerWidth() - 640);
	$("#timeline_length").height($(window).innerHeight() - 20);
	$("#timeline_length").fadeIn();
	$("#timeline_labels").height($(window).innerHeight() - 40);
	$("#timeline_labels").fadeIn();

	$("#scroll_padder").height($(window).innerHeight()- 300);


	if(window_height < main_height){
		$("#_mainTitle #title4_side_rankingTitle").hide();
		$("#_mainTitle #title4").hide();
		main_height = $("#_mainTitle").height();
		window_height = $(window).height();
		$("#_mainTitle").css("margin-top", (window_height - main_height + 41)/2 + "px");
	} else {
		$("#_mainTitle #title4_side_rankingTitle").show();
		$("#_mainTitle #title4").show();
		$("#_mainTitle").css("margin-top", (window_height - main_height + 41)/2 + "px");
	}
}

$(function(){
	var innerWidth = window.innerWidth;
	var innerHeight = window.innerHeight;

	var rotationDeg = 30;
	// var rotationDeg = 170;

	$(window).resize(function(){
		innerWidth = window.innerWidth;
		innerHeight = window.innerHeight;
	});

	$(document).mousemove(function(e){
		var rotationY = -(e.screenX/innerWidth - 0.5) * rotationDeg;
		var rotationX = (e.screenY/innerHeight - 0.5) * rotationDeg;

		$("#_mainTitle").css("transform", "rotateY(" + rotationY + "deg) rotateX(" + rotationX + "deg)")
	});

});

/*
	  d888888b d888888b .88b  d88. d88888b db      d888888b d8b   db d88888b
	  `~~88~~'   `88'   88'YbdP`88 88'     88        `88'   888o  88 88'
		 88       88    88  88  88 88ooooo 88         88    88V8o 88 88ooooo
		 88       88    88  88  88 88~~~~~ 88         88    88 V8o88 88~~~~~
		 88      .88.   88  88  88 88.     88booo.   .88.   88  V888 88.
		 YP    Y888888P YP  YP  YP Y88888P Y88888P Y888888P VP   V8P Y88888P
	
	
*/

$(document).on("click", ".currentCursor", function(){
	$(".currentCursor").removeClass("active");
	$(this).addClass("active");
	var id=$(this).attr('id') + '_a';

	$("html, body").animate({ scrollTop: $("#" + id).offset().top - 100 + "px" }, 300, "easeInOutCirc");
});


var cursorUpdateTimeout;
$(window).on('scroll', function() {
    var y_scroll_pos = window.pageYOffset + 300;
    

	$(".currentCursor.added").each(function(){
		var id = $(this).attr('id');

		if($("#" + id  + "_a").offset().top < y_scroll_pos){
			clearTimeout(cursorUpdateTimeout);

			cursorUpdateTimeout = setTimeout(function(){
				$(".currentCursor").removeClass("active");
				$("#" + id).addClass("active");	
			}, 40);

			return true;
		}
		// console.log();
	});

});

/*
	db      d888888b db    db d88888b      d888888b d888888b .88b  d88. d88888b d8888b.
	88        `88'   88    88 88'          `~~88~~'   `88'   88'YbdP`88 88'     88  `8D
	88         88    Y8    8P 88ooooo         88       88    88  88  88 88ooooo 88oobY'
	88         88    `8b  d8' 88~~~~~         88       88    88  88  88 88~~~~~ 88`8b
	88booo.   .88.    `8bd8'  88.             88      .88.   88  88  88 88.     88 `88.
	Y88888P Y888888P    YP    Y88888P         YP    Y888888P YP  YP  YP Y88888P 88   YD
	
	
*/

var timerInterval;
var live_timers_list = {};

function startTimer(){
	timerInterval = setInterval(propogateTime, 1000);
}
function stopTimer(){
	clearInterval(timerInterval);
}
function propogateTime(){
	// console.log(hours);
	// console.log(live_timers_list);
	for(var i in live_timers_list){
		var _t_timer = live_timers_list[i];

		if(_t_timer.running !== "true") continue;
		// console.log(live_timers_list[i]);

		var _t_hours = _t_timer.hours;
		var _t_minutes = _t_timer.minutes;
		var _t_seconds = _t_timer.seconds;

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
			_t_timer.running = false;
		}
		// console.log(_t_hours + ":" + _t_minutes + ":" + _t_seconds);

		_t_timer.hours = _t_hours;
		_t_timer.minutes = _t_minutes;
		_t_timer.seconds = _t_seconds;

		setUI_liveTimer(i, _t_timer);

	}
}

function setUI_liveTimer(i, timer){
	// console.log(i);
	$("#live_" + i).find(".score_timer .t_hours").text(returnTwoDigits(timer.hours));
	$("#live_" + i).find(".score_timer .t_minutes").text(returnTwoDigits(timer.minutes));
	$("#live_" + i).find(".score_timer .t_seconds").text(returnTwoDigits(timer.seconds));
}

function returnTwoDigits(i){
	var i = Number(i);
	return i<10 ? "0" + i : i;
}

/*
	d8888b.  .d8b.   .o88b. db   dD  d888b  d8888b.  .d88b.  db    db d8b   db d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b
	88  `8D d8' `8b d8P  Y8 88 ,8P' 88' Y8b 88  `8D .8P  Y8. 88    88 888o  88 88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'
	88oooY' 88ooo88 8P      88,8P   88      88oobY' 88    88 88    88 88V8o 88 88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo
	88~~~b. 88~~~88 8b      88`8b   88  ooo 88`8b   88    88 88    88 88 V8o88 88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~
	88   8D 88   88 Y8b  d8 88 `88. 88. ~8~ 88 `88. `8b  d8' 88b  d88 88  V888 88  .8D      88b  d88 88      88  .8D 88   88    88    88.
	Y8888P' YP   YP  `Y88P' YP   YD  Y888P  88   YD  `Y88P'  ~Y8888P' VP   V8P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P
	
	
*/

function changeBackground(){
	console.log("[changeBackground]");
	$("#_background #overlay_image").animate({"opacity": 0}, 300);
	$("#_background #overlay_image").css("background-image", "url('/uploads/bg.png?s=" + Math.random() + "')");
	setTimeout(function(){
		$("#_background #overlay_image").animate({"opacity": 1}, 300);
	}, 300);
}