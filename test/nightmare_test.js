"use strict";

var Nightmare = require("nightmare");
var expect = require("chai").expect;


describe("Aficionado", function() {
  // The default tests in mocha is 2 seconds.
  // Extending it to 30 seconds to have time to load the pages
  var login = "#username";
  var logout = "#logOut"
  var search = "#artSearch";
  var password = "#password";
  var art = "#artQuery";
  var magnifyingGlass = "#mag";
  var avatar = "#avatar";

  this.timeout(30000);
  it("should require me to login", function(done) {
    // ID for the login button.
    Nightmare({ show: true })
      .goto("http://localhost:3000/")
      // Just to be safe.
      .wait(login)
      .type(login, "Joe")
      .type(password, "joe")
      .click(".submit")
      .wait(3000)
      // Evaluate the title
      .evaluate(function() {
        return document.title;
      })
      // Asset the title is as expected
      .then(function(title) {
        expect(title).to.equal("aficionado");
        done();
      });
  });

  this.timeout(30000);
  it("should present a link to search for art after login, make two searches and logout", function(done) {
    Nightmare({ show: true })
      .goto("http://localhost:3000/")
      // Just to be safe.
      .wait(login)
      // Actually log in
      .type(login, "Joe")
      .type(password, "joe")
      .click(".submit")
      // Evaluate the following selector
      .wait(search)
      .type(art, "Descartes")
      .click(search)
      .wait(3000)
      .screenshot("descartes.png")
      .click(magnifyingGlass)
      .wait(3000)
      .type(art, "Renoir")
      .click(search)
      .wait(3000)
      .screenshot("renoir.png")
      .click(avatar)
      .wait(2000)
      .click(logout)
      .wait(3000)
      .then(function() {
        console.log("Done!");
        done();
      })
      // Catch errors
      .catch(function(err) {
        console.log(err);
      });
  });
});