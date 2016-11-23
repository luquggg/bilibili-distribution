function inject(url) {
  let script = document.createElement('script')
  script.src = url
  document.body.appendChild(script)
}

inject('//cdn.bootcss.com/Chart.js/2.4.0/Chart.min.js')
inject(chrome.extension.getURL('inject.js'))
