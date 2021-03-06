function request(url, type) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = type
    xhr.addEventListener('load', () => {
      resolve(xhr.response)
    })
    xhr.open('GET', url)
    xhr.send()
  })
}

function parseBarrages($barrages) {
  return Array.prototype.map.call($barrages.querySelectorAll('d'), ($barrage) => {
    const data = $barrage.getAttribute('p').split(',')
    return {
      mode: parseInt(data[1]),
      size: parseInt(data[2]),
      color: parseInt(data[3]).toString(16),
      content: $barrage.textContent,
      startTime: parseFloat(data[0])
    }
  })
}

function getLatestBarrages() {
  return request(
    `http://comment.bilibili.com/${window['cid']}.xml`, 'document')
    .then(($barrages) => {
      return parseBarrages($barrages)
    })
}

function getDuration() {
  return request(
    `http://interface.bilibili.com/player?id=cid:${window['cid']}&aid=${window['aid']}`)
    .then((data) => {
      const match = data.match(/<duration>(\d+):(\d+)/)
      return match[1] * 60 + parseInt(match[2])
    })
}

function secondToString(second) {
  const minute = parseInt(second / 60)
  second = second % 60
  return minute + ':' + (second < 10 ? '0' + second : second)
}

window.addEventListener('load', () => {
  Promise.all([getDuration(), getLatestBarrages()]).then((data) => {
    const groupSize = Math.round(data[0] / 100)
    const groupNumbers = parseInt(data[0] / groupSize) + 1
    const distribution = new Array(groupNumbers).fill(0)
    data[1].forEach((barrage) => {
      // 很诡异的是，弹幕开始时间可能比视频时间还要长
      const index = Math.round(barrage.startTime / groupSize)
      if (index < groupNumbers) {
        distribution[Math.round(barrage.startTime / groupSize)] += 1
      }
    })

    const width = document.querySelector('#bofqi').clientWidth
    const $canvas = document.createElement('canvas')
    $canvas.width = width
    $canvas.height = 100

    const $distribution = document.createElement('div')
    $distribution.style.width = width + 'px'
    $distribution.style.margin = 'auto'
    $distribution.appendChild($canvas)
    document.querySelector('.player-wrapper').appendChild($distribution)

    const chart = new Chart($canvas, {
      type: 'line',
      data: {
        labels: Object.keys(distribution).map(function (second) {
          return secondToString(second * groupSize)
        }),
        datasets: [{
          data: distribution,
          label: '弹幕数',
          borderColor: 'rgb(0,161,214)',
          backgroundColor: 'rgba(0,161,214,.2)'
        }]
      },
      options: {
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              autoSkipPadding: groupNumbers / 10
            }
          }],
          yAxes: [{
            display: false
          }]
        },
        legend: {
          display: false
        }
      }
    })

    $canvas.addEventListener('click', () => {
      if (window['player'] && chart.lastActive[0]) {
        window['player'].seek(chart.lastActive[0]._index * groupSize)
      }
    })
  })
})
