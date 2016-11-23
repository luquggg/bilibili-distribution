function inject(url) {
  let script = document.createElement('script')
  script.src = url
  document.body.appendChild(script)
}

inject(chrome.extension.getURL('chart.js'))
inject(chrome.extension.getURL('inject.js'))
