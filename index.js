var five = require("johnny-five");
var mqtt = require("mqtt");
var board = new five.Board({ port: "COM3" });




board.on("ready", function () {
    console.log("ready");

    var buttonPortao = new five.Button(2);
    var buttonLed = new five.Button(3);
    var led = new five.Led(9);
    var servo = new five.Servo({
        pin: 10,
        startAt: 10
    });
    var portaoAberto = false;
    var ledOn = false;

    function acendeApagaLed() {
        if (ledOn) {
            led.off();
            console.log("lampada apagada");
            ledOn = false;
        }
        else {
            led.on();
            console.log("lampada acesa");
            ledOn = true;
        }
    }

    function abrefechaportao() {

        if (portaoAberto) {
            servo.to(19, 1 * 1000);
            portaoAberto = false;
            console.log("Portao fechado");
        }

        else {
            servo.to(109, 1 * 1000);
            portaoAberto = true;
            console.log("Portao aberto");
        }
    }



    buttonPortao.on("down", function () {
        console.log("down");
        if (!ledOn && !portaoAberto){
            abrefechaportao();
            acendeApagaLed();        
        }     
        else{
            abrefechaportao();
        }
    });
    buttonLed.on("down", function () {
        acendeApagaLed();
    })

    var client = mqtt.connect("mqtt://localhost");

    client.on("connect", function () {

        console.log("conectado");
        client.subscribe("teste");

        function callback(topic, paylaod) {

            var msg = paylaod.toString();

            if (msg === "portao") {
                if (!ledOn && !portaoAberto){
                    abrefechaportao();
                    acendeApagaLed();        
                }     
                else{
                    abrefechaportao();
                }
            }
            else if (msg === "led") {
                acendeApagaLed();
            }
            else {
                console.log(topic);
                console.log(msg);
            }
        }
       
        client.on("message", callback);
    });

})

