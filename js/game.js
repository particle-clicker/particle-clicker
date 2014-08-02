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


  var lab = {
    name: 'My Awesome Lab',
    data: 0,
    reputation: 0,
    money: 0,
    researchHistogram: new Histogram('#ResearchHist'),
    getGrant: function () {
      this.money += this.reputation * 10;  // TODO: adjust factor
    },
    acquire: function (amount) {
      this.data += amount;
      this.researchHistogram.add_events(amount);
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
    item.is_visible = function () {
      return this.level > 0 || lab.data >= this.cost * .9;
    };
    item.is_available = function () {
      return lab.data >= this.cost;
    };
    item.research = function () {
      if (lab.research(this.cost, this.reputation)) {
        this.level++;
        this.cost = Math.round(this.cost * this.cost_increase);
      }
    };
  });

  var workers = loadJsonFile('json/workers.json');
  workers.map(function (worker) {
    worker.hired = 0;
    worker.is_visible = function () {
      return this.hired > 0 || lab.money >= this.cost * .9;
    };
    worker.is_available = function () {
      return lab.money >= this.cost;
    };
    worker.hire = function() {
      if (lab.buy(this.cost)) {
        this.hired++;
        this.cost = Math.round(this.cost * this.cost_increase);
      }
    };
  });


  var app = angular.module('particleClicker', []);

  app.filter("currency", ["$filter", function($filter) {
    return function(input) {
      input = Math.round(input) + ".";
      input = input.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
      return "JTN " + input.substring(0, input.length-1);
    };
  }]);

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


