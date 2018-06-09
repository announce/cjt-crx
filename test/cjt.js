'use strict'

const assert = require('assert')
const cjt = require('../src/cjt')

describe('Conversion', () => {
  let csv, jiraTable
  beforeEach(() => {
    csv = `
      heading 1,heading 2,heading 3
      col A1,col A2,col A3
      col B1,col B2,col B3
    `
    jiraTable =
      '||heading 1||heading 2||heading 3||' +
      '\n|col A1|col A2|col A3|' +
      '\n|col B1|col B2|col B3|'
  })
  describe('Convert CSV string to Jira\'s table notation', () => {
    it('should return index when the value is present', () => {
      assert.equal(cjt.convert(csv), jiraTable)
    })
    it('should trim the redundant break lines', () => {
      assert.equal(cjt.convert(`\n\n${csv}\n\n`), jiraTable)
    })
    it('should return zero-length string when the input is empty', () => {
      assert.equal(cjt.convert(''), '')
    })
  })
})
