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

    function resizeLeftPanel(width) {
        $('#request-list').width(width);
        $('.split-view-resizer').css('left', width);
    }

    resizeLeftPanel(localStorage.sidePanelWidth || 200);

    function resizerDragMove(event) {
        resizeLeftPanel(event.pageX);
        event.preventDefault();
    }

    function resizerDragEnd(event) {
        resizeLeftPanel(event.pageX);
        localStorage.sidePanelWidth = event.pageX + 'px';

        $(document).off('mousemove', resizerDragMove);
        $(document).off('mouseup', resizerDragEnd);
    }

    $('.split-view-resizer').on('mousedown', function() {
        $(document).on('mousemove', resizerDragMove);
        $(document).on('mouseup', resizerDragEnd);
    });
});


function buildRequestEl(requestUrl, debugDataUrl) {
    var url = new URL(requestUrl);
    var path = url.pathname + url.search;

    return $('<div class="request"></div>')
        .text(path)
        .attr('title', requestURL)
        .on('click', function() {
            $('.selected').removeClass('selected');
            $(this).addClass('selected');

            $('#debug-toolbar-panel').attr('src', debugDataUrl);
        });
}

chrome.devtools.network.onRequestFinished.addListener(function(entry) {
    for (const header of entry.response.headers) {
        if (header.name.toLowerCase() === 'x-debug-data-url') {
            $('#request-list').append(buildRequestEl(entry.request.url, header.value));
            break;
        }
    }
});
