function getVideo() {
  if (!window.$video) {
    window.$video = document.body.querySelector('video')
    if (location.origin != 'http://www.bilibili.com') {
      window.$video = $('.bilibiliHtml5Player').contents()[0].body.querySelector('video')
    }
  }
  return window.$video
}

function ready() {
  var deferred = $.Deferred()
  var timer = setInterval(function () {
    if (document.querySelector('.bilibiliHtml5Player')) {
      clearInterval(timer)
      deferred.resolve()
    }
  }, 200)
  return deferred
}

ready().then(function () {
  console.log($('.bilibiliHtml5Player'))
  console.log(window)
})

// $.when(
//   $.getScript('//localhost:8000/utils.js'),
//   $.getScript('//cdn.bootcss.com/Chart.js/2.4.0/Chart.min.js')).then(function () {
// $(document).ready(function () {
//   getLatestBarrages().then(function (barrages) {
//     var groupSize = Math.round($video.duration / 100)
//     var groupNums = Math.ceil($video.duration / groupSize)
//     var distribution = new Array(groupNums).fill(0)
//     barrages.forEach(function (barrage) {
//       distribution[Math.round(barrage.startTime / groupSize)] += 1
//     })
//
//     var canvas = document.createElement('canvas')
//     canvas.width = 1160
//     canvas.height = 100
//     $('.player-wrapper').append('' +
//       '<div class="distribution" style="width: 1160px; margin: auto">')
//     $('.distribution').append(canvas)
//
//     var chart = new Chart(canvas, {
//       type: 'line',
//       data: {
//         labels: Object.keys(distribution).map(function (second) {
//           return secondToString(second * groupSize)
//         }),
//         datasets: [{
//           data: distribution,
//           label: '弹幕数',
//           borderColor: '#00a1d6',
//           backgroundColor: 'rgba(0,161,214,.2)'
//         }]
//       },
//       options: {
//         scales: {
//           xAxes: [{
//             gridLines: {
//               display: false
//             },
//             ticks: {
//               autoSkipPadding: groupNums / 10
//             }
//           }],
//           yAxes: [{
//             display: false
//           }]
//         },
//         legend: {
//           display: false
//         }
//       }
//     })
//
//     canvas.addEventListener('click', function () {
//       if (chart.lastActive[0]) {
//         getVideo().currentTime = chart.lastActive[0]._index * groupSize
//       }
//     })
//   })
// })
