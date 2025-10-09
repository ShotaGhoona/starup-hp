```html
<div id='w'>
  <canvas id="space"></canvas>
<a href="#" id="warp">WARP SPEED</a>
</div>


<a href="https://twitter.com/nodws" id="btn-twtr" target="_b">Follow me on Twitter</a>
```
```css
html,body{height:100%;max-width:100%;margin:0;overflow:hidden;background:rgba(0,10,20,1) url(https://i.imgur.com/r838U7u.jpg) center no-repeat;background-size:cover;image-rendering: pixelated; font-family:sans-serif}
#space{width:100%}
#warp{position:absolute;z-index:9;bottom:0;left:0;right:0;margin:20px auto;color:rgba(209, 255, 255,1);border:2px solid;padding:1em;width:10em;text-align:center;font-weight:700;font-size:1.2em;display:inline-block;text-decoration:none;background:rgba(0,0,0,0.8);
transition:all 0.2s}
#warp:hover{
    box-shadow: 0 0 10px #eef, 0 0 12px #a0cdff inset;
    text-shadow: 0 0 12px #489cfa, 0 0 5px #fff;
}

/* follow me @nodws */
#btn-twtr{
  clear:both;
  color:#fff;
  border:2px solid;
  border-radius:3px;
  text-align:center;
  text-decoration:none;
  display:block;
  font-family:sans-serif;
  font-size:14px;
  width:13em;
  padding:5px 10px;
  font-weight:600;
  position:absolute;
  top:0;
  right:10%;
  margin:90vh 0;
  background:rgba(0,0,0,0.2);
  box-shadow:0 0 0px 3px rgba(0,0,0,0.2);
  opacity:0.3
}#btn-twtr:hover{color:#fff;opacity:1}
```
```js

//based on an Example by @curran
window.requestAnimFrame = (function(){   return  window.requestAnimationFrame})();
var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

var numStars = 1900;
var radius = '0.'+Math.floor(Math.random() * 9) + 1  ;
var focalLength = canvas.width *2;
var warp = 0;
var centerX, centerY;

var stars = [], star;
var i;

var animate = true;

initializeStars();

function executeFrame(){
  
  if(animate)
    requestAnimFrame(executeFrame);
  moveStars();
  drawStars();
}

function initializeStars(){
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  
  stars = [];
  for(i = 0; i < numStars; i++){
    star = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
      o: '0.'+Math.floor(Math.random() * 99) + 1
    };
    stars.push(star);
  }
}

function moveStars(){
  for(i = 0; i < numStars; i++){
    star = stars[i];
    star.z--;
    
    if(star.z <= 0){
      star.z = canvas.width;
    }
  }
}

function drawStars(){
  var pixelX, pixelY, pixelRadius;
  
  // Resize to the screen
  if(canvas.width != window.innerWidth || canvas.width != window.innerWidth){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeStars();
  }
  if(warp==0)
  {c.fillStyle = "rgba(0,10,20,1)";
  c.fillRect(0,0, canvas.width, canvas.height);}
  c.fillStyle = "rgba(209, 255, 255, "+radius+")";
  for(i = 0; i < numStars; i++){
    star = stars[i];
    
    pixelX = (star.x - centerX) * (focalLength / star.z);
    pixelX += centerX;
    pixelY = (star.y - centerY) * (focalLength / star.z);
    pixelY += centerY;
    pixelRadius = 1 * (focalLength / star.z);
    
    c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
    c.fillStyle = "rgba(209, 255, 255, "+star.o+")";
    //c.fill();
  }
}

document.getElementById('warp').addEventListener("click",function(e){
 window.warp = window.warp==1 ? 0 : 1;
window.c.clearRect(0, 0, window.canvas.width, window.canvas.height);
executeFrame();
});

executeFrame();

```