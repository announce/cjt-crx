'use strict'

/**
 * https://developer.chrome.com/extensions/content_scripts
 * @param w
 * @param chrome
 */
const main = (w, chrome) => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('w.getSelection():', w.getSelection())
    return sendResponse({
      text: w.getSelection().toString()
    })
  })
}

main(window, chrome)
