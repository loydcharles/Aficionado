var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.user.findAll({}).then(function(data) {
            res.render("index", { users: data });
        });
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