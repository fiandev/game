const canvas = document.querySelector("#canvas"),
c = canvas.getContext("2d");
canvas.width = innerWidth
canvas.height = innerHeight
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
const colors = ["#2fd5ff", "#00ff9f", "#ff4d33", "#f6ff3b", "#8919ff", "#ff35c6", "#7b62ff", "#3442f3", "#4aff05"]
addEventListener("resize", () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
  init()
})

class Particle {
  constructor(x, y, radius, color){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }
  draw(){
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.shadowColor = this.color
    c.shadowBlur = 15
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }
  update(){
    this.draw()
  }
}

let particles
function init(){
  particles = []
  for (var i = 0; i < 400; i++) {
    let canvasWidth = canvas.width + 300
    let canvasHeight = canvas.height + 300
    let x = Math.random() * canvasWidth - canvasWidth / 2
    let y = Math.random() * canvasHeight - canvasHeight / 2
    let radius = Math.random() * 2
    let color =  colors[Math.floor(Math.random() * colors.length)]
    // color = `hsl(${Math.random() * 180}, 50%, 50%)`
    particles.push(new Particle(x, y, radius, color))
  }
}
var ignoreClickOnMeElement = document.querySelector('#canvas');
let mouseover = false;
document.addEventListener('mouseover', function(event) {
    var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
      mouseover = true
    if (!isClickInsideElement) {
      mouseover = false
    }
});
let radians = 0
let alpha = 1
function animate(){
  requestAnimationFrame(animate)
  c.fillStyle = `rgba(10, 10, 10, ${alpha})`
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.save()
  c.translate(canvas.width / 2, canvas.height / 2)
  c.rotate(radians)
  particles.forEach(particle => {
    particle.update()
  })
  c.restore()
  radians += 0.01
  if (mouseover) {
    if(alpha >= 0.1){
      alpha -= 0.03
    }
  } else {
    if(alpha < 1) {
    alpha += 0.2
    }
  }
  
}
init()
animate()