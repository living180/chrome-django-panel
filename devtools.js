chrome.devtools.panels.create("Django Debug", "icon.png", "panel.html");

var connectionPort = chrome.runtime.connect();
connectionPort.postMessage({tabId: chrome.devtools.inspectedWindow.tabId});
