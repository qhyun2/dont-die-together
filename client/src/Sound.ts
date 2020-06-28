import { Howl, Howler } from "howler";


var start = document.getElementById("start")!;

var sound1 = new Howl({
    src: [require("../res/audio/sound1.webm").default, require('../res/audio/sound1.mp3').default],
    volume: 0.1
  });

  var sound2 = new Howl({
    src: [require('../res/audio/sound2.webm').default, require('../res/audio/sound2.mp3').default],
    sprite: {
      one: [0, 450],
      two: [2000, 250],
      three: [4000, 350],
      four: [6000, 380],
      five: [8000, 340],
      beat: [10000, 11163]
    }
  });

  sound1.once('load', function() {
    start.removeAttribute('disabled');
    start.innerHTML = 'BEGIN SPATIAL TESTS';
  });


  // Define the tests to run.
  var id;
  var tests = [
    function (fn: any) {
      sound1.once("play", function () {
        setTimeout(fn, 2000);
      });

      id = sound1.play();
    },

    function (fn) {
      sound1.stereo(-1, id);
      setTimeout(fn, 2000);
    },

    function (fn) {
      sound1.stereo(1, id);
      setTimeout(function () {
        fn();
      }, 2000);
    },

    function (fn) {
      sound1.pos(-2, 0, -0.5, id);
      setTimeout(fn, 2000);
    },

    function (fn) {
      sound1.pos(2, 0, -0.5, id);
      setTimeout(function () {
        sound1.stop();
        fn();
      }, 2000);
    },

    function (fn) {
      sound2.pos(-3, 0, -0.5, sound2.play("one"));
      sound2.once("end", function () {
        sound2.pos(0, 3, -0.5, sound2.play("two"));
        sound2.once("end", function () {
          sound2.pos(3, 0, -0.5, sound2.play("three"));
          sound2.once("end", function () {
            sound2.pos(0, -3, -0.5, sound2.play("four"));
            sound2.once("end", function () {
              sound2.stop();
              fn();
            });
          });
        });
      });
    },
  ];

  // Create a method that will call the next in the series.
  var chain = function (i) {
    return function () {
      if (tests[i]) {
        tests[i](chain(++i));
      }
    };
  };

  start.addEventListener(
    "click",
    function () {
      tests[0](chain(1));
      start.style.display = "none";
    },
    false
  );
