var STEPS = 8;
var ROWS = 8;
var SPINTIME = 0.6;
var WIDTH = 480;
var HEIGHT = 480;

var step = 0;

// var instruments = ["Kick", "Snare", "Rim", "Clap", "Clav", "Cowb", "Mcng", "Lcng"].map(function(name){
//     return {name: name, mute: false, player: new Tone.Player("sounds/" + name + ".WAV").toMaster()};
// });
// for(instrument of instruments){
// }

var drumNames = ["Kick", "Snare", "Rim", "Clap", "Clav", "Cowb", "Mcng", "Lcng"];
var playersIndex = {};
for (name of drumNames){
  playersIndex[name] = "sounds/" + name + ".WAV";
}

var players = new Tone.Players(
  playersIndex, 
  start
).toMaster();
players.volume.value = -6;

var canvas = document.querySelector('#zdog');

let illo = new Zdog.Illustration({
  element: '#zdog',
  // dragRotate: true,
  zoom: 1
});

var grid = [];
for (var row = 0; row < ROWS; row++){
  var gridRow = [];
  for (var i = 0; i < STEPS; i++){
    var cellWidth = WIDTH / STEPS;
    var cellHeight = HEIGHT / ROWS;
    var ellipse = new Zdog.Ellipse({
      addTo: illo,
      translate: {
        x: WIDTH / -2 + cellWidth / 2 + (i * cellWidth),
        y: HEIGHT / -2 + cellHeight / 2 + (row * cellHeight),
        z: 0
      },
      width: cellWidth * 2 / 3,
      height: cellHeight * 2/ 3,
    });
    var green = (Math.floor(0x90 - row * 0x40 / ROWS)).toString(16);
    // var green = 'FF';
    // ellipse.color = '#' + (row * 2).toString(16) + green + (i * 2).toString(16);
    ellipse.color = '#' + (Math.floor(0x22 + row * 0xBB / ROWS)).toString(16) + green + (Math.floor(0xCC - i * 0xCC / STEPS)).toString(16);
    ellipse.on = false;// Math.random() < 0.5;
    gridRow.push(ellipse);
  }
  grid.push(gridRow);
}
// initalise a beat
grid[0][0].on = true;
grid[0][3].on = true;
grid[0][4].on = true;
grid[4][0].on = true;
grid[4][5].on = true;
grid[7][6].on = true;
grid[7][7].on = true;

function animate() {
  for (var row = 0; row < ROWS; row++){
    for (var i = 0; i < STEPS; i++){
      var ellipse = grid[row][i];
      var time = Tone.Transport.getSecondsAtTime();
      var timeSinceOn = time - ellipse.noteTime;
      if (timeSinceOn >= 0 
        && timeSinceOn < SPINTIME
        ) {
        ellipse.rotate.y = (Zdog.TAU/4) * Zdog.easeInOut((timeSinceOn / SPINTIME), 2);
        // ellipse.rotate.y = 0;
      } else {
        ellipse.rotate.y = Zdog.TAU/4;
      }
      ellipse.stroke = ellipse.on ? 10 : 2;
      ellipse.fill = ellipse.on;
    }
  }
  illo.updateRenderGraph();
  // animate next frame
  requestAnimationFrame( animate );
}
// start animation

var seq = new Tone.Sequence(function(time, note){
  for(row in grid){
    if (grid[row][note].on == true) {
      // instruments[row].player.start(time);
      players.get(drumNames[row]).start(time);
    }
  }
  window.step = note;
  Tone.Draw.schedule(function(){
    for(row of grid){
      row[note].noteTime = Tone.Transport.getSecondsAtTime(time);
    }
  })
}, range(0, STEPS - 1), "8n");

canvas.addEventListener('click', function(e){
  var col = Math.floor(e.offsetX * STEPS / WIDTH);
  var row = Math.floor(e.offsetY * ROWS / HEIGHT);
  grid[row][col].on = !grid[row][col].on;
})

function start(){
  console.log('loaded');
  seq.start(0);
  Tone.Transport.start();
}

function range(min, max){
  var arr = [];
  for(var i = min; i <= max; i++){
    arr.push(i);
  }
  return arr;
}

animate();