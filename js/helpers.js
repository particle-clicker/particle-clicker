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

  var SI_prefixes = [
    { magnitude: 1e24, label: 'Y' },
    { magnitude: 1e21, label: 'Z' },
    { magnitude: 1e18, label: 'E' },
    { magnitude: 1e15, label: 'P' },
    { magnitude: 1e12, label: 'T' },
    { magnitude:  1e9, label: 'G' },
    { magnitude:  1e6, label: 'M' },
    { magnitude:  1e3, label: 'k' }
  ];

  /** Format a number with proper postfix.
   */
  var formatNumberPostfix = function(number) {
    var abs = Math.abs(number);
    var truncated = false;
    for (var i = 0; i < SI_prefixes.length; i++) {
      var prefix = SI_prefixes[i];
      if (abs >= prefix.magnitude) {
        number = (number / prefix.magnitude).toFixed(1) + prefix.label;
        truncated = true;
        break;
      }
    }
    if (!truncated) {
      number = number.toFixed(0);
    }
    return number; 
  }
 
  return {
    loadFile: loadFile,
    formatNumberPostfix: formatNumberPostfix,
    version: '0.2',
    analytics: ''
  };
})();
