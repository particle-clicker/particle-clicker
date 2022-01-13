/*
  Cheat code for http://particle-clicker.web.cern.ch/particle-clicker/
 */

(function(angular) {
  var e = angular.element;

  function c() {
    e('#detector').scope().dc.click();
  }

  function u() {
    var rcScope = e('#researchContent').scope().rc;
    rcScope.research.forEach(function(r) {
      if (rcScope.isAvailable(r)) {
        rcScope.doResearch(r);
      }
    });

    var hrScope = e('#hrContent').scope().hrc;
    hrScope.workers.forEach(function(w) {
      if (hrScope.isAvailable(w)) {
        hrScope.hire(w);
      }
    });

    var ucScope = e('#upgradesContent').scope().uc;
    ucScope.upgrades.forEach(function(u) {
      if (ucScope.isAvailable(u)) {
        ucScope.upgrade(u);
      }
    });
  }

  setInterval(c, 10);
  setInterval(u, 100);
})(angular);
