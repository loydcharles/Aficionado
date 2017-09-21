const pi = Math.PI;
var circles = [];
mouse = {
    x: undefined,
    y: undefined
}
var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}
function Circle() {
    this.x = Math.floor(Math.random() * window.innerWidth);
    this.y = Math.floor(Math.random() * window.innerHeight);
    this.op = Math.random();
    this.radius = Math.floor(Math.random() * 2 + 1);
    this.random = Math.floor(Math.random() * 12);
    if(this.random === 0) {
        this.colorStr = "rgba(255, 0, 0, ";
    } else if (this.random === 1) {
        this.colorStr = "rgba(0, 0, 255, ";
    } else if (this.random === 2) {
        this.colorStr = "rgba(255, 204, 102, ";
    } else {
        this.colorStr = "rgba(255, 255, 255, ";
    }
    this.alive = false;
    this.life = Math.random() * 2000 - 1700;
    if(this.op) {
        this.in = true;
    } else {
        this.in = false;
    }
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, pi * 2, false);
        c.fillStyle = this.colorStr + this.op + ")";
        c.fill();
    }
    this.update = function() {
        if(this.op < 1 && this.in) {
            this.op += 0.005;
        } else {
            if(this.op >= 1) {
                this.in = false;
            }
            if(!this.in) {
                this.op -= 0.015;
                if(this.op <= 0) {
                    this.in = true;
                }
            }
        }
        this.life -= 1;
        if(this.life <= 0) {
            this.alive = false;
        }
        if(this.life <= -1700 && this.op <= 0.02) {
            this.life = 275;
            this.alive = true;
        }
        // if(mouse.x - this.x < 25 && mouse.x - this.x > -25 
        // && mouse.y - this.y < 25 && mouse.y - this.y > -25
        // && this.radius <= 25) {
        // 	this.alive = true;
        // }
        if(this.alive) {
            this.draw();
        }
    }
}
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    circles = [];
    for(var i = 0; i < 200; i ++) {
        var circle = new Circle();
        circles.push(circle);
    }
}
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for(var i = 0; i < circles.length; i ++) {
        circles[i].update();
    }
}
init();
animate();