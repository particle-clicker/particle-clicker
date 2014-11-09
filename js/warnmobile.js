(function() {
  'use strict';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent)) {
    $('#MobileWarning').modal('show');
  }
})();
