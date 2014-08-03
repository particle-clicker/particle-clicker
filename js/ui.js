$(function() {
  var h = $(window).height();
  $('.scrollable').height(h - 50 + 'px');

  $(window).resize(function() {
    var h = $(window).height();
    $('.scrollable').height(h - 50 + 'px');
  });
});

(function() {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide 
            = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = { 
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h 
            };

        evt = evt || window.event;
        if (evt.type in evtMap)
            detector.visible = evtMap[evt.type] == 'visible';
        else        
            detector.visible = !this[hidden];
    }
})();

function showUpdateValue(ident, num) {
    if (num != 0) {
        if (num > 0) {
            insert = $("<div></div>")
                .attr("class", "update-plus")
                .html("+" + num);
        } else {
            insert = $("<div></div>")
                .attr("class", "update-minus")
                .html(num);
        }
        showUpdate(ident, insert);
    }
}

function showUpdate(ident, insert) {
    elem = $(ident);
    elem.append(insert);
    insert.animate({
        "bottom":"+=30px",
        "opacity": 0
    }, { duration: 500, complete: function() {
        $(this).remove();
    }});
}

