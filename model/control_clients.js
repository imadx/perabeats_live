var control_clients = {};
module.exports = {

	createClient: function(clientName) {
		var clientName = String(clientName);

		control_clients[clientName] = {};

		console.log("clients --------- ");
		console.log(control_clients);

	},

	removeClient: function(clientName) {
		var clientName = String(clientName);
		delete control_clients[clientName];
	},

	setInformation: function(clientName, data){
		var clientName = String(clientName);
		control_clients[clientName].game = data.form_game;
		control_clients[clientName].description = data.form_description;
		control_clients[clientName].location = data.form_location;
		control_clients[clientName].team1 = data.form_team1;
		control_clients[clientName].team2 = data.form_team2;

		control_clients[clientName].score_team1 = (data.score_team1 | 0);
		control_clients[clientName].score_team2 = (data.score_team2 | 0);

		control_clients[clientName].timer_hours = (data.timer_hours | 0);
		control_clients[clientName].timer_minutes = (data.timer_minutes | 0);
		control_clients[clientName].timer_seconds = (data.timer_seconds | 0);
		
		control_clients[clientName].timer_running = data.timer_running;

	},

	getInformation: function(clientName){
		var clientName = String(clientName);
		return control_clients[clientName];
	},

	setScores: function(clientName, scores){
		var clientName = String(clientName);

		control_clients[clientName].score_team1 = scores.score_team1;
		control_clients[clientName].score_team2 = scores.score_team2;
	},
	
	getScores: function(clientName){
		var clientName = String(clientName);
		return [control_clients[clientName].score_team1, control_clients[clientName].score_team2];
	},

	setTime: function(clientName, data){
		var clientName = String(clientName);

		control_clients[clientName].timer_hours = (data.timer_hours | 0);
		control_clients[clientName].timer_minutes = (data.timer_minutes | 0);
		control_clients[clientName].timer_seconds = (data.timer_seconds | 0);
		
		control_clients[clientName].timer_running = data.timer_running;
	},
	
	getTime: function(clientName){
		var clientName = String(clientName);

		var sendingData = {
			"timer_hours":control_clients[clientName].timer_hours,
			"timer_minutes":control_clients[clientName].timer_minutes,
			"timer_seconds":control_clients[clientName].timer_seconds,
			"timer_running":control_clients[clientName].timer_running
		}
		
		return sendingData;
	},

	getAllLiveClients: function(){
		return control_clients;
	}
};