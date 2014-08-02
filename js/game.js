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
    detector: {
      rate: 1
    },
    data: 0,
    reputation: 0,
    money: 0,
    researchHistogram: new Histogram('#ResearchHist'),
    getGrant: function () {
      this.money += this.reputation * 5;  // TODO: adjust factor, 5
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

  var research = loadJsonFile('json/research.json');
  research.map(function (item) {  // define additional stuff on the objects
    item.level = 0;
    item.is_visible = function () {
      return this.level > 0 || lab.data >= this.cost * .7;
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
      return this.hired > 0 || lab.money >= this.cost * .7;
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

  var upgrades = loadJsonFile('json/upgrades.json');
  upgrades.map(function (upgrade) {
    upgrade.getReceiver = function() {
      if (this.type === "detector") {
        return lab.detector;
      } else {
        var context;
        if (this.type === "research") { context = research; }
        else if (this.type === "hr") { context = workers; }
        else { return null; }
        for (var i = 0; i < context.length; i++) {
          if (context[i].name === this.receiver) {
            return context[i];
          }
        }
        return null;
      }
    };
    upgrade.hasReceiver = function () {
      if (this.type === "detector") {
        return true;
      }
      var rec = this.getReceiver();
      if (this.type === "research") {
        return rec.level > 0;
      } else if (this.type === "hr") {
        return rec.hired > 0;
      }
      return false;
    };
    upgrade.is_visible = function () {
      return !this.used && this.hasReceiver() && lab.money >= this.cost * .7;
    };
    upgrade.is_available = function () {
      return !this.used && this.hasReceiver() && lab.money >= this.cost;
    };
    upgrade.buy = function () {
      if (!this.used && lab.buy(this.cost)) {
        this.used = true;
        var rec = this.getReceiver();
        if (rec) {
          rec[this.property] = rec[this.property] * this.factor + this.constant;
        }
      }
    };
  });


  var app = angular.module('particleClicker', []);

  app.filter('currency', ['$filter', function ($filter) {
    return function (input) {
      return 'JTN ' + $filter('niceNumber')(input);
    };
  }]);

  app.filter('niceNumber', ['$filter', function ($filter) {
    return function (number) {
      var abs = Math.abs(number);
      if (abs >= Math.pow(10, 12)) {
        number = (number / Math.pow(10, 12)).toFixed(3) + "T";
      } else if (abs >= Math.pow(10, 9)) {
        number = (number / Math.pow(10, 9)).toFixed(3) + "B";
      } else if (abs >= Math.pow(10, 6)) {
        number = (number / Math.pow(10, 6)).toFixed(3) + "M";
      } else if (abs >= Math.pow(10, 3)) {
        number = (number / Math.pow(10, 3)).toFixed(3) + "k";
      } else {
        number = number.toFixed(0);
      }
      return number; 
    };
  }]);

  app.controller('DetectorController', function () {
    this.click = function () {
      lab.acquire(lab.detector.rate);
      detector.addEvent();
      return false;
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

  app.controller('UpgradesController', function () {
    this.upgrades = upgrades;
  });
})();


