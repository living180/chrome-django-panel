$(function() {
    var localStorage;
    // The "Block sites from setting any data" option prevents the extension
    // from accessing the localStorage. Any attempt to access window.localStorage
    // will raise a security exception.
    try {
        localStorage = window.localStorage;
    }
    catch (e) {
        localStorage = {};
    }

    var requestList = document.getElementById('request-list');
    var debugToolbarPanel = document.getElementById('debug-toolbar-panel');

    function resizeLeftPanel(width) {
        requestList.style.width = width;
        $('.split-view-resizer').css('left', width);
    }

    resizeLeftPanel(localStorage.sidePanelWidth || 200);

    function resizerDragMove(event) {
        resizeLeftPanel(event.pageX + 'px');
    }

    function resizerDragEnd(event) {
        localStorage.sidePanelWidth = event.pageX + 'px';

        $(document).off('mousemove', resizerDragMove);
        $(document).off('mouseup', resizerDragEnd);
        debugToolbarPanel.classList.remove('blocked');
    }

    $('.split-view-resizer').on('mousedown', function() {
        debugToolbarPanel.classList.add('blocked');
        $(document).on('mousemove', resizerDragMove);
        $(document).on('mouseup', resizerDragEnd);
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
