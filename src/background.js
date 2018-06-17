'use strict'
const _ = require('lodash')
const conv = require('./conv')

/**
 * https://developer.chrome.com/apps/declare_permissions#manifest
 * https://developer.chrome.com/extensions/background_pages
 * @param w
 * @param chrome
 */
const main = (w, chrome) => {
  const activeTab = (fn) => {
    chrome.tabs.query({
      active: true
    }, fn)
  }

  const selectedText = (tab) => {
    console.log('tab:', tab)
    chrome.tabs.sendMessage(tab.id, conv.scriptID, {}, (response) => {
      console.log('response:', response)
      if (_.isEmpty(response.text)) {
        throw new Error('response.text is empty.')
      }
      return conv.convert(response.text)
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

  chrome.runtime.onInstalled.addListener(() => {
    console.log('chrome.runtime.onInstalled')
    chrome.contextMenus.create({
      title: 'Convert the selected CSV text to Jira table format',
      contexts: ['selection'],
      id: conv.scriptID
    })
  })

  chrome.contextMenus.onClicked.addListener((info, _) => {
    console.log('chrome.contextMenus.onClicked')
    if (info.menuItemId === conv.scriptID) {
      hook(info)
    }
  })
}

main(window, chrome)
