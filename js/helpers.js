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
    { exp: 24, label: 'Y' },
    { exp: 21, label: 'Z' },
    { exp: 18, label: 'E' },
    { exp: 15, label: 'P' },
    { exp: 12, label: 'T' },
    { exp:  9, label: 'B' },
    { exp:  6, label: 'M' },
    { exp:  3, label: 'k' }
  ];

  // pre-compute SI prefix magnitudes
  for (var i = 0; i < SI_prefixes.length; i++) {
    var prefix = SI_prefixes[i];
    prefix.magnitude = Math.pow(10, prefix.exp);
  }

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
