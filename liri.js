require("dotenv").config();
var keys = require('./keys.js');

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var request = require('request');

var fs = require('fs')

// var spotify = new Spotify(keys.spotify);
var tweetThis = function(){
    var client = new Twitter(keys.twitter);

    var params = {
        screen_name: 'realDonaldTrunp', 
        count: 20};
    client.get("statuses/user_timeline", params, function (error,tweets,response) {
        if(!error){
            // console.log(tweets);
            for(var i=0; i<tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(' ');
                console.log(tweets[i].text);
            }
        }
    });
};

var spotifyThis = function(songName) {
    var spotifyMe = new Spotify(keys.spotify);
    spotifyMe.search({ type: "track", query: songName },function(err, data){
        if (err){
            console.log("Error: " + err);
            return;
        }
        var songs = data.tracks.items;
        for(var i=0; i<songs.length; i++) {
            console.log(i + 1);
            console.log("Artist: " + songs[i].album.artists[0].name);
            console.log("Song Name: " + songs[i].name);
            console.log("Song url: " + songs[i].preview_url);
            console.log("Album: " + songs[i].album.name);
            console.log("---------------------------");
        }
    
    });
}

var movieThis = function(movieName){
    // http://www.omdbapi.com/?i=tt3896198&apikey=6c871bf5
    request("http://www.omdbapi.com/?t=" + movieName + "&apikey=6c871bf5", function (error, response, body) {
        if(!error && response.statusCode === 200){
            // console.log(body)
            var jsonRead = JSON.parse(body);
            console.log("Title: " + jsonRead.Title);
            console.log("Year: " + jsonRead.Year); 
            console.log("IMDB Rating: " + jsonRead.imdbRating); 
            if (jsonRead.Ratings[1].Source === "Rotten Tomatoes"){
                console.log("Rotten Tomatoes Rating: " + jsonRead.Ratings[1].Value);
            }
            console.log("Country: " + jsonRead.Country); 
            console.log("Language: " + jsonRead.Language); 
            console.log("Plot: " + jsonRead.Plot); 
            console.log("Actors: " + jsonRead.Actors);  

        }
    });
}

var doThis = function (){
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) throw err;
        console.log(data);

        var fileData = data.split(",");

        if (fileData.length === 2){
            options(fileData[0], fileData[1]);
        }
        else if (fileData.length === 1){
            options(fileData[0]);
        }
    });

}

var options = function (caseData, functionData) {
    switch(caseData) {
        case "myTweets" : 
          tweetThis();
          break;
        case "spotifyFind" :
        if (functionData === undefined){
            functionData = "Deadpool Rap"
          }
          spotifyThis(functionData);
          break;
        case "movieFind" :
          if (functionData === undefined){
            functionData = "Deadpool"
          }
          // console.log(functionData);
          movieThis(functionData);
          break;
        case "do-what-it-says" :
          doThis();
          break;
        default : 
          console.log("LIRI does not know that bruh use: \nmy-tweets \nspotifyFind \nmovieFind \ndo-what-it-says");
    }
}

var runIt = function(argOne,argTwo) {
    options(argOne, argTwo);
}

runIt(process.argv[2], process.argv[3]);

