
const manifest = require('../src/manifest.json')
manifest.version = process.env.npm_package_version
console.log(JSON.stringify(manifest))
