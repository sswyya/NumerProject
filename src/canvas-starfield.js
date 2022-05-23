(function(window, sf) {

    if (typeof module !== 'undefined') module.exports = sf()
    else window.Starfield = sf()
  
  })(this, function() {



  function Starfield(config) {
    config = config || {}
  
    this.canvas = typeof config.canvas === 'string' ?
      document.querySelector(config.canvas) :
      config.canvas
    this.ctx = this.canvas.getContext('2d')
    this.style = getComputedStyle(this.canvas)
  
    this.vx = config.vx || 0.05
    this.vy = config.vy || 0.05
  
    this.maxStars = config.numStars || 500
    this.maxRadius = config.maxRadius || 1.5
  
    this.shootingStarInterval = config.shootingStarInterval
    this.lastShootingStar = this.shootingStarInterval ? performance.now() : undefined
    //this.shootingStar
  
    this.onResize()
  
    window.addEventListener('resize', this.onResize.bind(this))
  }
  
  Starfield.prototype.star = function() {
    return {
      x: Math.round(Math.random() * this.canvas.width),
      y: Math.round(Math.random() * this.canvas.height),
      r: 0.5 + (Math.random() * this.maxRadius),
      l: Math.random(),
      bl: 0.1 * (Math.random() * 6 + 2),
      dl: Math.round(Math.random()) === 1? 0.01: -0.01
    }
  }
  
  Starfield.prototype.loadStars = function() {
    this.stars = new Array(this.numStars)
  
    var i = this.numStars
    while (i-- > 0) this.stars[i] = this.star()
  }
  
  Starfield.prototype.onResize = function() {
    var ratio = window.devicePixelRatio || 1
  
    this.canvas.width = this.style.width.replace('px', '') | 0 * ratio
    this.canvas.height = this.style.height.replace('px', '') | 0 * ratio
  
    if (this.canvas.width / ratio < 500) this.numStars = 100
    else this.numStars = this.maxStars
  
    this.loadStars()
  }
  
  Starfield.prototype.draw = function(star) {
    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(255,255,255,' + star.l + ')' 
    this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI, false)
    this.ctx.fill()
  }
  
  Starfield.prototype.start = function() {
    var tick = function(timeStamp) {
  
      this.ctx.fillStyle = 'black' 
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  
      var i = this.stars.length
      while (i-- > 0) {
        var star = this.stars[i]
  
        this.draw(star)
        
        star.y += this.vy
        star.x += this.vx
        star.l += star.dl
  
        if (Math.abs(star.l - star.bl) >= 0.25) star.dl = -star.dl
        if (star.x > this.canvas.width) star.x = this.vx > 0? -1: this.canvas.width + 1
        if (star.y > this.canvas.height) star.y = this.vy > 0? -1: this.canvas.height + 1
      }
  
      if (this.shootingStar) {
        star = this.shootingStar
  
        this.draw(star)
        
        star.y += 3
        star.x += 7
        star.l += star.dl
        star.r -= 0.06
  
        if (star.r <= 0) this.shootingStar = undefined
  
      } else if (this.shootingStarInterval) {
  
        if (timeStamp - this.lastShootingStar >= this.shootingStarInterval) {
          this.shootingStar = this.star()
          this.lastShootingStar = timeStamp
          this.shootingStar.r = 3
        }
      }
  
      this.frameId = window.requestAnimationFrame(tick)
  
    }.bind(this)
    
    this.frameId = window.requestAnimationFrame(tick)
  }
  
  return Starfield
  
  })
