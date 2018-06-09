'use strict'
const cjt = require('../src/cjt')
const _ = require('lodash')
const crypto = require('crypto')
const path = require('path')

/**
 * https://developer.chrome.com/apps/declare_permissions#manifest
 * https://developer.chrome.com/extensions/background_pages
 * @param w
 * @param chrome
 */
const main = (w, chrome) => {
  const SCRIPT_ID = 'cjt-converter'
  const doc = w.document
  const hash = crypto.createHash('sha256')

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

  const activeTab = (fn) => {
    chrome.tabs.query({
      active: true
    }, fn)
  }

  const selectedText = (tab) => {
    console.log('tab:', tab)
    chrome.tabs.sendMessage(tab.id, SCRIPT_ID, {}, (response) => {
      console.log('response:', response)
      if (_.isEmpty(response.text)) {
        throw new Error('response.text is empty.')
      }
      return convert(response.text)
    })
  }

  const hook = (info) => {
    // Need to fetch selected text via message from content-script because info.selectionText doesn't keep line breaks
    console.log('info.selectionText:', info.selectionText)
    if (info.selectionText.length > 1) {
      activeTab((tabs) => {
        _.map(tabs, selectedText)
      })
    }
  }

  const convert = (text) => {
    const messageId = hash.update(text).digest('hex')
    const converted = cjt.convert(text)
    const sec = Math.floor(Date.now() / 1000)
    console.log('text:', text)
    copy(converted, 'text/plain')
    notify(sec + messageId, 'Copied to clipboard', converted, 2000)
  }

  const notify = (notificationId, message, data, duration) => {
    chrome.notifications.create(notificationId, {
      type: 'basic',
      title: SCRIPT_ID,
      message: message,
      contextMessage: data,
      iconUrl: path.join('image', 'icon_128.png'),
      eventTime: Date.now() + duration
    })
  }

  chrome.runtime.onInstalled.addListener(() => {
    console.log('chrome.runtime.onInstalled')
    chrome.contextMenus.create({
      title: 'Convert the selected CSV text to Jira table format',
      contexts: ['selection'],
      id: SCRIPT_ID
    })
  })

  chrome.contextMenus.onClicked.addListener((info, _) => {
    console.log('chrome.contextMenus.onClicked')
    if (info.menuItemId === SCRIPT_ID) {
      hook(info)
    }
  })
}

main(window, chrome)
