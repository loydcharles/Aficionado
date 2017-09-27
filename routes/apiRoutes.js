var db = require("../models");
var request = require('request');
var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});

module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("index", {});
    });
    app.get("/api/:query", function(req, res) {
        var queryURL = "https://www.rijksmuseum.nl/api/en/collection/" + 
            "?key=nRpUKIg0&format=json&ps=100&imgonly=True&q=" + req.params.query;
        console.log(req.params.query);
        if(req.params.query != "default") {
            request(queryURL, function(err, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });
        } else {
            queryURL = "https://www.rijksmuseum.nl/api/en/collection/" + 
            "?key=nRpUKIg0&format=json&ps=100&imgonly=True&q=van%20gogh";
            request(queryURL, function(err, response, body) {
                var data = JSON.parse(body);
                res.json(data);
            });
        }
        
    });
    app.post("/", function(req, res) {
        var dup = false,
        validated = false,
        userId = 0;
        var temp = req.body.name.toLowerCase().trim();
        temp = temp.replace(/\b[a-z]/g, function(str){
            return str.toUpperCase();
        });
        db.user.findOne({
            where: {
                name: temp
            },
            include: [db.password]
        }).then(function(data) {
            // console.log(data);
            if(data) {
                if(data.name == temp){
                    dup = true;
                    if(key.decrypt(data.password.password, 'utf8') == req.body.pwd) {
                        console.log("validated!");
                        validated = true;
                    }
                }
            }
            if(!dup) {
                db.user.create({
                    name: temp,
                }).then(function(userData) {
                    console.log(userData.dataValues.id);
                    db.password.create({
                        password: key.encrypt(req.body.pwd, 'base64'),
                        userId: userData.dataValues.id
                    }).then(function(data) {
                        res.json(userData);
                    });
                });
            } else if(validated) {
                console.log("ding!");
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







//     var text = 'Hello RSA!';
//     var encrypted = key.encrypt(text, 'base64');
//     console.log('encrypted: ', encrypted);
//     var decrypted = key.decrypt(encrypted, 'utf8');
//     console.log('decrypted: ', decrypted);

// https://www.rijksmuseum.nl/api/en/collection/?key=nRpUKIg0&format=json&ps=10&imgonly=True&q=