var STEPS = 8;
var ROWS = 8;
var SPINTIME = 0.6;
var WIDTH = 480;
var HEIGHT = 480;

var step = 0;

var canvas = document.querySelector('#zdog');

let illo = new Zdog.Illustration({
  element: '#zdog',
  dragRotate: true,
  zoom: 1
});

var grid = [];
for (var row = 0; row < ROWS; row++){
  var gridRow = [];
  for (var i = 0; i < STEPS; i++){
    var ellipse = new Zdog.Ellipse({
      addTo: illo,
      translate: {
        x: -240 + 30 + (i * 60),
        y: -240 + 30 + (row * 60),
        z: 0
      },
      diameter: 40,
    });
    ellipse.on = Math.random() < 0.5;
    gridRow.push(ellipse);
  }
  grid.push(gridRow);
}

function animate() {
  // illo.rotate.x += 0.03;
  for (var row = 0; row < ROWS; row++){
    for (var i = 0; i < STEPS; i++){
      var ellipse = grid[row][i];
      var green = 'A';
      ellipse.color = '#' + (row * 2).toString(16) + green + (i * 2).toString(16);
      var time = Tone.Transport.getSecondsAtTime();
      var timeSinceOn = time - ellipse.noteTime;
      if (timeSinceOn > 0 
        && timeSinceOn < SPINTIME
        ) {
        ellipse.rotate.y = (Zdog.TAU/4) * Zdog.easeInOut((timeSinceOn / SPINTIME), 2);
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
  Tone.Draw.schedule(function(){
    if (window.step != note) {
      window.step = note;
      for(row of grid){
        row[note].noteTime = time;
      }
    }
  }, time);
}, range(0,7), "8n").start(0);

canvas.addEventListener('click', function(e){
  var col = Math.floor(e.offsetX * 8 / 480);
  var row = Math.floor(e.offsetY * 8 / 480);
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