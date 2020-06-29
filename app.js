var MAX = 8;
var step = 0;

var canvas = document.querySelector('#zdog');
canvas.addEventListener('click', function(e){
  var col = Math.floor(e.offsetX * 8 / 480);
  var row = Math.floor(e.offsetY * 8 / 480);
  grid[row][col].on = !grid[row][col].on;
})

// create illo
let illo = new Zdog.Illustration({
  // set canvas with selector
  element: '#zdog',
  dragRotate: true,
  // zoom: 3
});

// add circles

var grid = [];
for (var row = 0; row < MAX; row++){
  var gridRow = [];
  for (var i = 0; i < MAX; i++){
    var stroke = 10;
    var green = '3'; // vs '8' for playing maybe
    var ellipse = new Zdog.Ellipse({
      addTo: illo,
      translate: {
        x: -240 + 30 + (i * 60),
        y: -240 + 30 + (row * 60),
        z: 0
      },
      diameter: 20,
    });
    ellipse.on = Math.random() < 0.5;
    gridRow.push(ellipse);
  }
  grid.push(gridRow);
}

function animate() {
  // rotate illo each frame
  // illo.rotate.z += 0.03;
  // illo.rotate.y += 0.03;
  // illo.rotate.x += 0.03;
  for (var row = 0; row < MAX; row++){
    for (var i = 0; i < MAX; i++){
      var ellipse = grid[row][i];
      var green = '7';
      ellipse.color = '#' + (row * 2).toString(16) + green + (i * 2).toString(16);
      var timeSinceOn = Zdog.modulo(window.step - i, 8);
      ellipse.rotate.y = (Zdog.TAU/4)/(timeSinceOn + 1);
      
      ellipse.stroke = ellipse.on ? 10 : 2;
    }
  }

  illo.updateRenderGraph();
  // animate next frame
  requestAnimationFrame( animate );
}
// start animation
animate();

var seq = new Tone.Sequence(function(time, note){
  Tone.Draw.schedule(function(){
    window.step = note;
  }, time);
}, [0,1,2,3,4,5,6,7], "8n").start(0);

Tone.Transport.start();