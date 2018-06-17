const fs = require('fs')
const path = require('path')

const txt = fs.readFileSync(
  path.join(__dirname, 'IANACHARSET.txt'),
  'utf-8')
const json = JSON.stringify(txt.trim().split('\n'))
console.log(json)
