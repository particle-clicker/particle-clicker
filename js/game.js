'use strict';

var DEBUG = true;

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

  var lab = {
    name: 'My Awesome Lab',
    data: 0,
    reputation: 0,
    money: 0,
    getGrant: function () {
      this.money += this.reputation * 10;  // TODO: adjust factor
    },
    acquire: function (amount) {
      this.data += amount;
    },
    research: function (cost, reputation) {
      if (this.data >= cost) {
        this.data -= cost;
        this.reputation += reputation;
        return true;
      }
      return false;
    },
    buy: function(cost) {
      if (this.money >= cost) {
        this.money -= cost;
        return true;
      }
      return false;
    },
    sell: function(cost) {
      this.money += cost;
    }
  };

  /* Construct research object from json file.
   * Additional attribute level keeps track of the current upgrade status.
   * Also add functionality to research each item.
   */
  var research = loadJsonFile('json/research.json');
  research.map(function (item) {  // define additional stuff on the objects
    item.level = 0;
    item.is_available = function () {
      return this.level > 0 || lab.data > item.cost * .9;
    };
    item.research = function () {
      if (lab.research(this.cost, this.reputation)) {
        this.level++;
      }
    }
  });
  if (DEBUG) console.log(research);

  var workers = loadJsonFile('json/workers.json');
  workers.map(function (worker) {
    worker.hired = 0;
    worker.hire = function() {
      if (lab.buy(this.cost)) {
        this.hired++;
      }
    };
  });

  var app = angular.module('particleClicker', []);

  app.controller('DetectorController', function () {
    this.click = function () {
      lab.acquire(1);
    };
  });

  app.controller('LabController', ['$interval', function ($interval) {
    this.lab = lab;
    $interval(function () {  // one tick
      lab.getGrant();
      var sum = 0;
      for (var i = 0; i < workers.length; i++) {
        sum += workers[i].hired * workers[i].rate;
      }
      lab.acquire(sum);
    }, 1000);
  }]);

  app.controller('ResearchController', function () {
    this.research = research;
  });

  app.controller('HRController', function () {
    this.workers = workers;
  });
})();


