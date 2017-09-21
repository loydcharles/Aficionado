var db = require("../models");
var request = require('request');

module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("index", {});
    });
    app.get("/api/:query", function(req, res) {
        var queryURL = "https://www.rijksmuseum.nl/api/en/collection/" + 
            "?key=nRpUKIg0&format=json&ps=10&imgonly=True&q=" + req.params.query;
        console.log(req.params.query);
        if(req.params.query != "default") {
            request(queryURL, function(err, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });
        } else {
            queryURL = "https://www.rijksmuseum.nl/api/en/collection/" + 
            "?key=nRpUKIg0&format=json&ps=10&imgonly=True&q=van%20gogh";
            request(queryURL, function(err, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });
        }
        
    });
    app.post("/", function(req, res) {
        var dup = false;
        var temp = req.body.name.toLowerCase().trim();
        temp = temp.replace(/\b[a-z]/g, function(str){
            return str.toUpperCase();
        });
        db.user.findAll({}).then(function(data) {
            data.forEach(function(itm, idx, arr) {
                if(itm.name == temp){
                    dup = true;
                }
            });
            if(!dup) {
                db.user.create({
                    name: temp,
                }).then(function(data) {
                    res.json(data);
                });
            } else {
                console.log(temp);
                db.user.findOne({
                    where: {
                        name: temp
                    }
                }).then(function(data) {
                    res.json(data);
                });
            }
        });
    });
}








// https://www.rijksmuseum.nl/api/en/collection/?key=nRpUKIg0&format=json&ps=10&imgonly=True&q=