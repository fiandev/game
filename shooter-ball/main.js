const canvas = document.querySelector("#canvas"),
c = canvas.getContext("2d"),
score_result = document.querySelector("#score")
bigScore = document.querySelector("#bigScore"),
popUp = document.querySelector(".popUp"),
lastScore = localStorage.getItem("lastScore", score)
scoreboard = document.querySelector(".scoreboard");
canvas.width = innerWidth;
canvas.height = innerHeight;
var bg_audio = new Audio()
bg_audio.src = "bg.wav";
//bg_audio.loop = true;
class Player {
  constructor(x,y,radius,color) {
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.color = color
  }
  
  draw() {
    c.beginPath()
    c.arc(this.x , this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}
const friction = 0.99
class Projectile {
  constructor(x , y, radius, color, velocity) {
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.color = color,
    this.velocity = velocity
  }
  draw() {
    c.beginPath()
    c.arc(this.x , this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
  
  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}
class Particel {
  constructor(x , y, radius, color, velocity) {
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.color = color,
    this.velocity = velocity,
    this.alpha = 1
  }
  draw() {
    c.save()
    c.globalAlpha = 0.1
    c.beginPath()
    c.arc(this.x , this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }
  
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

class Enemy {
  constructor(x , y, radius, color, velocity, point) {
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.color = color,
    this.velocity = velocity,
    this.point = point
  }
  draw() {
    c.beginPath()
    c.arc(this.x , this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
  
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

const x = canvas.width / 2
const y = canvas.height / 2
let player = new Player(999,999,10,"white")
let projectiles = []
let enemies = []
let particels = []
var animationId;
var score = 0;
let opening, spawning
if (lastScore) {
  score = parseInt(lastScore)
  bigScore.innerHTML = lastScore
}


function spawnEnemies() {
  //console.log(cdSpawn)
  spawning = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    let x,y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
    const angle = Math.atan2(
    canvas.height / 2 - y,
    canvas.width / 2 - x
    )
    //const speed = Math.floor(Math.random() * (5 - 3) + 3)
    const speed = 1
    const velocity = {
     x: Math.cos(angle) * speed,
     y: Math.sin(angle) * speed
    }
    const point = Math.floor(Math.random() * (150 - 100) + 100)
    enemies.push(new Enemy(x,y,radius,color,velocity, point))
  },1000)
}
function animate(){
  score_result.innerHTML = score;
  bigScore.innerHTML = score;
 // bg_audio.play();
  animationId = requestAnimationFrame(animate)
  c.fillStyle = "rgba(0, 0, 0, 0.1)"
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()
  particels.forEach((particel, index) => {
    if (particel.alpha <= 0) {
      particels.splice(index, 1)
    }
    particel.update()
  })
  projectiles.forEach((projectile,index) => {
    projectile.update()
    /* clear projectiles edges screen */
    if (
    projectile.x + projectile.radius < 0 ||
    projectile.x - projectile.radius > canvas.width ||
    projectile.y + projectile.radius < 0 ||
    projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
         projectiles.splice(index, 1)
        },0)
    }
  })
  enemies.forEach((enemy, index) => {
    enemy.update()
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    /* game over */
    if (dist - enemy.radius - player.radius < 1) {
      //console.log(`game over !`);
      scoreboard.style.display="none"
      bg_audio.pause()
      var audio = new Audio()
          audio.src = "dead.wav"
          audio.play()
          
      cancelAnimationFrame(animationId)
      score_result.innerHTML = `Game Over!`;
      localStorage.setItem("lastScore", score)
      clearInterval(spawning)
      popUp.style.display="block";
    }
    projectiles.forEach((projectile, projectileIndex) => {
    const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
    /* object touch */
      if (dist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius; i++) {
          particels.push(new Particel(projectile.x, projectile.y, 3 , enemy.color , {
          x: (Math.random() - 0.5) * (Math.random() * 5),
          y: (Math.random() - 0.5) * (Math.random() * 5)
        }))
        }
        var audio = new Audio()
        audio.src = "earn-point.wav"
        audio.play()
        if (enemy.radius - 10 > 10) {
          projectiles.splice(projectileIndex, 1)
          enemy.radius -= 10
          score += 50
        } else {
          enemies.splice(index, 1)
          projectiles.splice(projectileIndex, 1)
          setTimeout(() => {
            score += enemy.point
            console.log(projectiles.length)
           // console.log(enemies.length)
            //console.log(`(+) = ${enemy.point} score`)
          },0)
        }
      }
    });
  })
}
function yes(){
  popUp.style.display="none"
  scoreboard.style.display="block"
  //clearInterval(ending)
  clearInterval(opening)
  init()
}
opening = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    let x,y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
    const angle = Math.atan2(
    canvas.height / 2 - y,
    canvas.width / 2 - x
    )
    //const speed = Math.floor(Math.random() * (5 - 3) + 3)
    const speed = 1
    const velocity = {
     x: Math.cos(angle) * speed,
     y: Math.sin(angle) * speed
    }
    const point = Math.floor(Math.random() * (150 - 100) + 100)
    enemies.push(new Enemy(x,y,radius,color,velocity, point))
  },100)
function init(argument) {
  addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
    )
  //const speed = Math.floor(Math.random() * (6 - 4) + 4)
  const speed = 5
  const rad = 5
  const velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed
  }
  //const color = `hsl(${Math.random() * 360}, 50%, 50%)`
  const color = "#fff"
  projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, rad, color, velocity)
  )
  
})
  player = new Player(x,y,10,"white")
  projectiles = []
  enemies = []
  particels = []
  animate()
  spawnEnemies(1000)
}
enemies = []
animate()