var STEPS = 8;
var ROWS = 8;
var SPINTIME = 0.6;
var WIDTH = 480;
var HEIGHT = 480;

var step = 0;

var instruments = ["Kick", "Snare", "Rim", "Clap", "Clav", "Clap", "Mcng", "Lcng"].map(function(name){
    return {name: name, mute: false, player: new Tone.Player("sounds/" + name + ".WAV").toMaster()};
});
for(instrument of instruments){
  instrument.player.volume.value = -6;
}

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
    var green = 'BB';
    // ellipse.color = '#' + (row * 2).toString(16) + green + (i * 2).toString(16);
    ellipse.color = '#' + (Math.floor(0x88 + row * 0x77 / ROWS)).toString(16) + green + (Math.floor(0x33 + i * 0xCC / STEPS)).toString(16);
    console.log(ellipse.color);
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
      instruments[row].player.start(time);
    }
  }
  window.step = note;
  for(row of grid){
    row[note].noteTime = time;
  }
}, range(0, STEPS - 1), "8n").start(0);

canvas.addEventListener('click', function(e){
  var col = Math.floor(e.offsetX * STEPS / WIDTH);
  var row = Math.floor(e.offsetY * ROWS / HEIGHT);
  grid[row][col].on = !grid[row][col].on;
})

function range(min, max){
  var arr = [];
  for(var i = min; i <= max; i++){
    arr.push(i);
  }
  return arr;
}

animate();
Tone.Transport.start();