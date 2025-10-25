```html

.header
  h1 Reflective Photo Wall
  span by
  span Shawn Reisner
  .social
    a(target="_blank", href="https://twitter.com/ReisnerShawn")
      img(class="social", src="https://cdn1.iconfinder.com/data/icons/logotypes/32/twitter-128.png")
    a(target="_blank", href="https://codepen.io/sreisner")
      img(class="social", src="https://blog.codepen.io/wp-content/uploads/2012/06/Button-White-Large.png")
#wall
```


```css

@import url('https://fonts.googleapis.com/css?family=Raleway:100i,400');

$font-color: #CCC;
$background: #090909;
$whitespace: 10px;
$wall-rotation: 45deg;

@media(min-width: 0px) {
  body {
    perspective: 250px;
  }
}

@media(min-width: 700px) {
  body {
    perspective: 500px;
  }
}

@media(min-width: 1200px) {
  body {
    perspective: 1000px;
  }
}

@media(min-width: 1600px) {
  body {
    perspective: 2000px;
  }
}

body {
  background: $background;
  transform-style: preserve-3d;
  overflow: hidden;
}

.header {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: 0;
  top: 0;
  color: $font-color;
  padding: 2em;
  font-family: 'Raleway';
  z-index: 5;
  font-size: 20px;
  letter-spacing: 0.25em;
  text-align: center;
  
  h1 {
    font-weight: 400;
    font-size: 1em;
    margin: 0 0 5px 0;
    text-transform: uppercase;
  }
  
  span {
    padding: 0.25em;
    font-size: 0.75em;
    font-style: italic;
    text-transform: lowercase;
  }
}

.social {
  display: flex;
  margin-top: 0.5em;
  
  a {
    position: relative;
    width: 1.5em;
    height: 1.5em;
    margin: 0px 0.75em;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

#wall {
  position: relative;
  transform-origin: left center;
  transform: rotateY($wall-rotation);
  width: 100%;
  height: 100%;
  animation: 10s linear move;
  
  .row {
    position: relative;
    display: flex;
    height: 250px;
    margin-bottom: $whitespace;

    img {
      height: 100%;
      margin: $whitespace / 2;
    }
    
    .frame {
      position: relative;
      height: 100%;
      
      .reflection {
        position: absolute;
        height: 100%;
        transform: rotateX(180deg) translateY(-$whitespace);
        opacity: 0.25;
      }
      
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient($background 75%, transparent);
        transform-origin: bottom center;
        transform: rotateX(180deg) translateY(-$whitespace * 2);
      }
    }
  }
}

```


```js

const NUM_ROWS = 3;
const NUM_IMAGES = 100;
const IMAGES = [];
for(let i = 0; i < NUM_IMAGES; i++) {
  let width = (Math.floor(Math.random() * 3) + 2) * 100;
  let height = (Math.floor(Math.random() * 3) + 2) * 100;
  IMAGES.push(`http://unsplash.it/${width}/${height}`);
}

let rows = [];
for(let i = 0; i < NUM_ROWS; i++) {
  let row = document.createElement('div');
  row.classList.add('row');
  rows.push(row);
}

let wall = document.getElementById('wall');
for(let i = 0; i < IMAGES.length; i++) {
  let index = i % rows.length;
  let row = rows[index];
  let onBottomRow = index === rows.length - 1;
  if(onBottomRow) {
    let frame = document.createElement('div');
    frame.classList.add('frame');
    frame.innerHTML = `
      <img src="${IMAGES[i]}">
      <div class="reflection">
        <img src="${IMAGES[i]}">
      </div>
    `;
    row.appendChild(frame);
  } else {
    let img = document.createElement('img');
    img.src = IMAGES[i];
    row.appendChild(img);
  }
}

rows.forEach((row) => {
  wall.appendChild(row);
});

let debounce = (func, wait, immediate) => {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

let scrollPosition = 0;
let scrollWall = debounce((event) => {
  scrollPosition -= event.deltaY;
  wall.style.transform = `rotateY(45deg) translateX(${scrollPosition}px)`;
}, 10);

window.addEventListener('wheel', scrollWall);
```