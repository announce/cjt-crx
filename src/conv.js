const path = require('path')
const crypto = require('crypto')
const hash = crypto.createHash('sha256')
const cjt = require('cjt')
const doc = window.document
const scriptName = 'cjt-converter'

const copy = (str, mimeType) => {
  const fn = doc.oncopy
  console.log('oncopy:', fn)
  doc.oncopy = (event) => {
    event.clipboardData.setData(mimeType, str)
    event.preventDefault()
  }
  doc.execCommand('copy', false, null)
  doc.oncopy = fn
}

const convert = (text) => {
  const messageId = hash.update(text).digest('hex')
  const converted = cjt.convert(text)
  const sec = Math.floor(Date.now() / 1000)
  // console.log('text:', text)
  copy(converted, 'text/plain')
  notify(sec + messageId, 'Copied to clipboard', converted, 2000)
}

const notify = (notificationId, message, data, duration) => {
  chrome.notifications.create(notificationId, {
    type: 'basic',
    title: scriptName,
    message: message,
    contextMessage: data,
    iconUrl: path.join('image', 'icon_128.png'),
    eventTime: Date.now() + duration
  })
}

module.exports = {
  scriptID: scriptName,
  convert: convert
}
