$(function() {
  var h = $(window).height();
  $('.scrollable').height(h + 'px');

  $(window).resize(function() {
    var h = $(window).height();
    $('.scrollable').height(h + 'px');
  });
});
