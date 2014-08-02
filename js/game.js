'use strict';
(function () {
  var loadJsonFile = function(filename) {
    var res;
    $.ajax({
            async: false,
            url : filename,
            success : function(data) {
              res = data;
            }
    });
    return res;
  }


  var discoveries = loadJsonFile('json/discoveries.json');
  var workers = loadJsonFile('json/workers.json');

  console.log(discoveries);
  console.log(workers);

  var app = angular.module('particleClicker', []);
})();


