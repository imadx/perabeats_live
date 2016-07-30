// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var GameSchema = new Schema({

  game: String,
  description: String,
  location: String,
  team1: String,
  team2: String,
  team1_score: Number,
  team2_score: Number,
  date: Date

});

GameSchema.pre('save', function(next) {

  var currentDate = new Date();
  
  if (!this.date)
    this.date = currentDate;

  next();
  
});

// the schema is useless so far
// we need to create a model using it
var Game = mongoose.model('Game', GameSchema);

// make this available to our users in our Node applications
module.exports = Game;
