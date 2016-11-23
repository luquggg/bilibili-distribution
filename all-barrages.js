var Barrage = function (selector) {
  this.$root = document.querySelector(selector)
  this.speed = 100
}

Barrage.prototype.append = function (barrage) {
  var $barrage = document.createElement('div')
  $barrage.style.position = 'absolute'
  $barrage.textContent = barrage.content
  $barrage.style.color = '#' + barrage.color
  $barrage.style.fontSize = barrage.size + 'px'
  $barrage.style.textShadow = 'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px'

  if (barrage.mode == 1) {
    $barrage.style.top = this.$root.clientHeight * Math.random() + 'px'
    $barrage.style.left = this.$root.clientWidth + 'px'
    $barrage.style.transition = 'transform ' + this.$root.clientWidth / this.speed + 's linear'
    $barrage.addEventListener('webkitTransitionEnd', function () {
      this.parentNode.removeChild(this)
    })
    this.$root.appendChild($barrage)
    $barrage.style.transform = 'translateX(' + -(this.$root.clientWidth + $barrage.clientWidth) + 'px)'
  }
}

$.getScript('//localhost:8000/utils.js').then(function () {
  getLatestBarrages().then(function (barrages) {
    barrages.sort(function (a, b) {
      return a.startTime - b.startTime
    })

    var barrage = new Barrage('.bilibili-player-video-danmaku')
    barrages.slice(0, 100).forEach(function (item) {
      setTimeout(function () {
        barrage.append(item)
      }, 10000 * Math.random())
    })
  })
})
