/** @module Helpers
 * Define some useful helpers that are used throughout the game.
 */
var Helpers = (function() {
  'use strict';
  /** Load a file (usually JSON).
   */
  var loadFile = function(filename) {
    var res;
    $.ajax({
      async: false,
      url : filename,
      success : function(data) {
        res = data;
      }
    });
    return res;
  };

  /** Format a number with proper postfix.
   */
  var formatNumberPostfix = function(number) {
    if (typeof number !== "number") {
      return 0;
    }
    var abs = Math.abs(number);
    if (abs >= Math.pow(10, 12)) {
      number = (number / Math.pow(10, 12)).toFixed(1) + "T";
    } else if (abs >= Math.pow(10, 9)) {
      number = (number / Math.pow(10, 9)).toFixed(1) + "B";
    } else if (abs >= Math.pow(10, 6)) {
      number = (number / Math.pow(10, 6)).toFixed(1) + "M";
    } else if (abs >= Math.pow(10, 3)) {
      number = (number / Math.pow(10, 3)).toFixed(1) + "k";
    } else {
      number = number.toFixed(0);
    }
    return number; 
  }

  var formatTime = function(msec) {
    var totals = Math.ceil(msec / 1000);
    var days = Math.floor(totals / (24 * 60 * 60));
    var hours = Math.floor((totals % (24 * 60 * 60)) / (60 * 60));
    var totalmin = (totals % (24 * 60 * 60)) % (60 * 60);
    var mins = Math.floor(totalmin / 60);
    var secs = totalmin % 60;

    var str = [];
    if (days > 0) {
      str.push(days + ' day' + (days % 100 == 1 ? '' : 's'));
    }
    if (hours > 0) {
      str.push(hours + ' h');
    }
    if (mins > 0) {
      str.push(mins + ' min');
    }
    if (secs > 0) {
      str.push(secs + ' s');
    }

    return str.join(', ');
  }
 
  return {
    loadFile: loadFile,
    formatNumberPostfix: formatNumberPostfix,
    formatTime: formatTime,
    version: '0.4',
    analytics: ''
  };
})();
