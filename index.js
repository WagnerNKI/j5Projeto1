var five = require("johnny-five");
var board = new five.Board({port: "COM3"});

board.on("ready", function() {
 
    var button = new five.Button(2);
    var led = new five.Led(9);
    var servo = new five.Servo({    
        pin: 10, 
        startAt: 10 
    });
    var portaoAberto = false;

    button.on ("down",function(){
        console.log("down");
        if (portaoAberto){
            servo.to(19,1*1000);
            portaoAberto = false;
            console.log("Portao fechado");
            led.off();
        }
        else{
            servo.to(90,1*1000);
            portaoAberto = true;
            console.log("Portao aberto");
            led.on();
        }
    });

    button.on ("hold",function(){
        console.log("hold");
    });

    button.on ("up",function(){
        console.log("up");
    });

});
