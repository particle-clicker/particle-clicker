$(function () {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert('lol');
    $('#MobileWarning').modal('show');
  } else {
    Console.log(navigator.userAgent);
  }
});
