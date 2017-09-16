var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.user.findAll({}).then(function(data) {
            res.render("index", { users: data });
        });
     });
     app.post("/", function(req, res) {
        db.user.create({
            name: req.body.name,
        }).then(function(data) {
            res.redirect("/");
        });
    });
}