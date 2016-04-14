chrome.runtime.onConnect.addListener(function(connectionPort) {
    var tabId;

    var messageListener = function(message, sender, sendResponse) {
        tabId = message.tabId;
        if (tabId !== undefined) {
            connectionPort.onMessage.removeListener(messageListener);

            var headersListener = function(details) {
                if (details.tabId == tabId) {
                    details.requestHeaders.push({
                        name: 'X-Django-Debug-Panel',
                        value: '1'
                    });
                }
                return {requestHeaders: details.requestHeaders};
            };

            chrome.webRequest.onBeforeSendHeaders.addListener(
                headersListener,
                {urls: ["<all_urls>"]},
                ["blocking", "requestHeaders"]
            );

            connectionPort.onDisconnect.addListener(function() {
                chrome.webRequest.onBeforeSendHeaders.removeListener(
                    headersListener
                );
            });
        }
    };

    connectionPort.onMessage.addListener(messageListener);
});
