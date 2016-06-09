var xhr = require('xhr')
var html = require('yo-yo')
var qs = require('querystring')

var color = '#ffffff'
var snake = [[0,0]]
var pixels = []
for (var y = 0; y < 5; y++) {
  pixels[y] = []
  for (var x = 0; x < 10; x++) {
    pixels[y][x] = {
      rgb: [0,0,0],
      href: 'http://192.168.16.'+(200+x+1+y*10)+'/'
    }
  }
}
var root = document.querySelector('#content')
update()

window.addEventListener('keydown', function (ev) {
  var pt = snake[snake.length-1]
  if (ev.keyCode === 37) { // left
    snake.push([(10+pt[0]-1)%10,pt[1]])
  } else if (ev.keyCode === 38) { // up
    snake.push([pt[0],(5+pt[1]-1)%5])
  } else if (ev.keyCode === 39) { // right
    snake.push([(10+pt[0]+1)%10,pt[1]])
  } else if (ev.keyCode === 40) { // down
    snake.push([pt[0],(5+pt[1]+1)%5])
  } else return
  var s = snake[snake.length-1]
  send(s[0],s[1],[255,0,0])
  if (snake.length >= 5) {
    var z = snake[0]
    send(z[0],z[1],[0,0,0])
    snake.splice(0,1)
  }
})

function update () {
  var buckets = []
  return html.update(root, html`<div>
    <div>
      ${pixels.map(function (row, y) {
        return html`<div>
          ${row.map(function (pixel, x) {
            var style = `background-color: rgb(${pixel.rgb.join(',')})`
            return html`<div class="pixel"
              onclick=${onclick} style=${style}></div>`
            function onclick () {
              pixel.rgb[0] = parseInt(color.slice(1,3),16)
              pixel.rgb[1] = parseInt(color.slice(3,5),16)
              pixel.rgb[2] = parseInt(color.slice(5,7),16)
              send(x,y,pixel.rgb)
            }
          })}
        </div>`
      })}
    </div>
    <input type="color" onchange=${onchange}>
  </div>`)
  function onchange (ev) {
    color = this.value
  }
}

function send (x, y, rgb) {
  var q = qs.stringify({r:rgb[0],g:rgb[1],b:rgb[2]})
  pixels[y][x].rgb = rgb
  update()
  xhr(pixels[y][x].href+'?'+q, function (err, res, body) {
    console.log(res.statusCode)
  })
}
