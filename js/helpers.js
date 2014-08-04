'use strict';

/** Define some useful helpers that are used throughout the game.
 */
var Helpers = (function() {
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
 
  return {
    loadFile: loadFile,
    formatNumberPostfix: formatNumberPostfix
  };
})();
