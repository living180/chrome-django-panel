window.addEventListener('DOMContentLoaded', function(e) {
    var requestList = document.getElementById('request-list');
    var resizer = document.getElementById('resizer');
    var debugToolbarPanel = document.getElementById('debug-toolbar-panel');

    function setRequestListWidth(width) {
        requestList.style.width = Math.max(60, width) + "px";
    }

    chrome.storage.local.get({requestListWidth: 300}, function(result) {
        setRequestListWidth(result.requestListWidth);
    });

    function resizerDragMove(event) {
        setRequestListWidth(event.pageX);
    }

    function resizerDragEnd(event) {
        chrome.storage.local.set({
            "requestListWidth": parseInt(requestList.style.width)
        });

        document.removeEventListener('mousemove', resizerDragMove);
        document.removeEventListener('mouseup', resizerDragEnd);
        debugToolbarPanel.classList.remove('blocked');
    }

    resizer.addEventListener('mousedown', function() {
        debugToolbarPanel.classList.add('blocked');
        document.addEventListener('mousemove', resizerDragMove);
        document.addEventListener('mouseup', resizerDragEnd);
    });

    function buildRequestEl(requestUrl, debugDataUrl) {
        var url = new URL(requestUrl);
        var path = url.pathname + url.search;

        var el = document.createElement('div');
        el.classList.add('request');
        el.setAttribute('title', requestUrl);
        el.appendChild(document.createTextNode(path));
        el.addEventListener('click', function(e) {
            var selected = document.querySelector('.selected');
            if (selected !== this) {
                if (selected) {
                    selected.classList.remove('selected');
                }
                this.classList.add('selected');
                debugToolbarPanel.setAttribute('src', debugDataUrl);
            }
        });
        return el;
    }

    chrome.devtools.network.onRequestFinished.addListener(function(entry) {
        for (const header of entry.response.headers) {
            if (header.name.toLowerCase() === 'x-debug-data-url') {
                requestList.appendChild(
                    buildRequestEl(entry.request.url, header.value)
                );
                break;
            }
        }
    });
});
