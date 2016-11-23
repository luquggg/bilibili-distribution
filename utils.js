function request(url, dataType) {
  return $.ajax({
    url: url,
    data: {
      html5: 1
    },
    dataType: dataType
  })
}

function getChatId() {
  return window.cid || location.search.match(/cid=(\d+)/)[1]
}

function getBarragesList(cid) {
  return request('http://comment.bilibili.com/rolldate,' + cid, 'json')
}

function getBarrages(cid, timestamp) {
  return request('http://comment.bilibili.com/dmroll,' + timestamp + ',' + cid, 'xml').pipe(function ($barrages) {
    return parseBarrages($barrages)
  })
}

function parseBarrages($barrages) {
  return Array.prototype.map.call($('d', $barrages), function ($barrage) {
    var data = $barrage.getAttribute('p').split(',')
    return {
      mode: parseInt(data[1]),
      size: parseInt(data[2]),
      color: parseInt(data[3]).toString(16),
      content: $barrage.textContent,
      startTime: parseFloat(data[0])
    }
  })
}

function getAllBarrages() {
  var cid = getChatId()
  return getBarragesList(cid).pipe(function (history) {
    return $.when.apply($.when, history.map(function (item) {
      return getBarrages(cid, item.timestamp)
    })).pipe(function () {
      return (Array.prototype.reduce.call(arguments, function (barrages, $barrages) {
        barrages = barrages.concat($barrages)
        return barrages
      }, []))
    })
  })
}

function getLatestBarrages() {
  return request('http://comment.bilibili.com/' + getChatId() + '.xml').pipe(function ($barrages) {
    return parseBarrages($barrages)
  })
}

function secondToString(second) {
  var minute = parseInt(second / 60)
  second = second % 60
  return minute + ':' + (second < 10 ? '0' + second : second)
}
