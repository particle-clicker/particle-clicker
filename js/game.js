'use strict';
(function() {
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
  }

  var showModal = function(title, text) {
    var $modal = $('#infoBox');
    $modal.find('#infoBoxLabel').html(title);
    $modal.find('.modal-body').html(text);
    $modal.modal({show: true});
  };

  var lab = {
    name: 'My Awesome Lab',
    detector: {
      rate: 1
    },
    factor: {
      rate: 5
    },
    data: 0,
    reputation: 0,
    money: 0,
    getGrant: function () {
      var addition = this.reputation * this.factor.rate;  // TODO: adjust factor
      this.money += addition;
      achievements.update('count', 'money', addition);
    },
    acquire: function(amount) {
      this.data += amount;
      achievements.update('count', 'data', amount);
    },
    research: function(cost, reputation) {
      if (this.data >= cost) {
        this.data -= cost;
        this.reputation += reputation;
        achievements.update('count', 'reputation', reputation);
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

  var research = loadFile('json/research.json');
  achievements.addResearch(research);
  research.map(function(item) {
    item.level = 0;
    item.is_visible = function() {
      return this.level > 0 || lab.data >= this.cost * .7;
    };
    item.is_available = function() {
      return lab.data >= this.cost;
    };
    item.research = function() {
      if (lab.research(this.cost, this.reputation)) {
        achievements.update('count', 'dataSpent', this.cost);
        this.level++;
        this.cost = Math.round(this.cost * this.cost_increase);
        achievements.update('research', this.name, 1);
      }
    };
    item.getInfo = function() {
      if (!this._info) {
        this._info = loadFile(this.info);
      }
      return this._info;
    },
    item.showInfo = function() {
      showModal(this.name, this.getInfo());
    };
  });

  var workers = loadFile('json/workers.json');
  achievements.addWorkers(workers);
  workers.map(function(worker) {
    worker.hired = 0;
    worker.is_visible = function() {
      return this.hired > 0 || lab.money >= this.cost * .7;
    };
    worker.is_available = function() {
      return lab.money >= this.cost;
    };
    worker.hire = function() {
      if (lab.buy(this.cost)) {
        achievements.update('count', 'moneyWorkers', this.cost);
        this.hired++;
        this.cost = Math.round(this.cost * this.cost_increase);
        achievements.update('workers', this.name, 1);
        achievements.update('count', 'workers', 1);
      }
    };
  });

  var upgrades = loadFile('json/upgrades.json');
  upgrades.map(function(upgrade) {
    upgrade.getReceiver = function() {
      if (this.type === "detector") {
        return lab.detector;
      } else if (this.type === "reputation"){
        return lab.factor;
      }
      else {
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
    upgrade.hasReceiver = function() {
      if (this.type === "detector") {
        return true;
      }
      if (this.type === "reputation") {
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
    upgrade.is_visible = function() {
      return !this.used && this.hasReceiver() && lab.money >= this.cost * .7;
    };
    upgrade.is_available = function() {
      return !this.used && this.hasReceiver() && lab.money >= this.cost;
    };
    upgrade.buy = function() {
      if (!this.used && lab.buy(this.cost)) {
        achievements.update('count', 'moneyUpgrades', this.cost);
        this.used = true;
        var rec = this.getReceiver();
        if (rec) {
          rec[this.property] = rec[this.property] * this.factor + this.constant;
        }
      }
    };
  });

  var app = angular.module('particleClicker', []);

  app.filter('currency', ['$filter', function($filter) {
    return function(input) {
      return 'JTN ' + $filter('niceNumber')(input);
    };
  }]);

  app.filter('niceNumber', ['$filter', function($filter) {
    return function(number) {
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
    };
  }]);

  app.controller('DetectorController', function() {
    this.click = function() {
      lab.acquire(lab.detector.rate);
      detector.addEvent();
      achievements.update('count', 'clicks', 1);
      return false;
    };
  });

  app.controller('LabController', ['$interval', function($interval) {
    this.lab = lab;
    this.showDetectorInfo = function() {
      if (!this._detectorInfo) {
        this._detectorInfo = loadFile('html/detector.html');
      }
      showModal('Detector', this._detectorInfo);
    };
    $interval(function() {  // one tick
      lab.getGrant();
      var sum = 0;
      for (var i = 0; i < workers.length; i++) {
        sum += workers[i].hired * workers[i].rate;
      }
      lab.acquire(sum);
    }, 1000);
  }]);

  app.controller('ResearchController', function() {
    this.research = research;
  });

  app.controller('HRController', function() {
    this.workers = workers;
  });

  app.controller('UpgradesController', function() {
    this.upgrades = upgrades;
  });

  app.controller('AchievementsController', function ($scope) {
    scope.achievements = achievements.list;
  });

  achievements.setList(loadFile('json/achievements.json'));
})();
