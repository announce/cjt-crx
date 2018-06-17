const _ = require('lodash')
const $ = require('jquery')
const conv = require('./conv')
const charset = require('./var/charset')
const reader = new window.FileReader()

$(() => {
  const $file = $('#file')
  const $charset = $('#charset')
  const $candidates = $('#charset-candidates')
  const $list = $('#available-charset')
  const fileChanged = (event) => {
    console.log('fileChanged:', event)
    const files = event.target.files
    readFirstFile(files, resetCharset())
  }
  const charsetChanged = () => {
    console.log('charsetChanged $file:', $file)
    if ($file.length > 0) {
      readFirstFile($file[0].files, resetCharset())
    }
  }
  const readFirstFile = (files, encoding) => {
    if (files.length > 0 && files[0].size > 0) {
      reader.readAsText(files[0], encoding)
    }
  }
  const resetCharset = () => {
    const encoding = $charset.val()
    const value = (_.isEmpty(encoding) || !_.includes(charset, encoding)) ? 'UTF-8' : encoding
    console.log(`encoding: ${encoding} to ${value}`)
    $charset.val(value)
    return value
  }

  _.forEach(charset, (opt) => {
    const $opt = $('<option>').val(opt)
    const $li = $('<li>').text(opt)
    $candidates.append($opt)
    $list.append($li)
  })
  reader.onload = () => { conv.convert(reader.result) }
  $charset.on('change', charsetChanged)
  $file.on('change', fileChanged)
})
