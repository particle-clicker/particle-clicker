'use strict';

/** Define all objects used in the game.
 * They can be either loaded from localStorage or from JSON in case nothing is
 * found in the localStorage.
 */
var GameObjects = (function() {
  /** Lab
   */
  var labPrototype = {
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
      var addition = this.reputation * this.factor.rate;
      this.money += addition;
      return addition;
    },
    acquire: function(amount) {
      this.data += amount;
    },
    research: function(cost, reputation) {
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
  var lab = $.extend({}, labPrototype, ObjectStorage.load('lab'));

  /** Research
   */
  var researchPrototype = {
    level: 0,
    is_visible: function() {
      return this.level > 0 || lab.data >= this.cost * .7;
    },
    is_available: function() {
      return lab.data >= this.cost;
    },
    research: function() {
      if (lab.research(this.cost, this.reputation)) {
        this.level++;
        var oldCost = this.cost;
        this.cost = Math.round(this.cost * this.cost_increase);
        return oldCost;
      }
      return -1;
    },
    getInfo: function() {
      if (!this._info) {
        this._info = Helpers.loadFile(this.info);
      }
      return this._info;
    },
    showInfo: function() {
      Helpers.showModal(this.name, this.getInfo());
    }
  };
  var research = $.extend([], Helpers.loadFile('json/research.json'),
                          ObjectStorage.load('research'));
  research = research.map(function(item) {
    return $.extend({}, researchPrototype, item);
  });


  /** Workers
   */
  var workersPrototype = {
    hired: 0,
    is_visible: function() {
      return this.hired > 0 || lab.money >= this.cost * .7;
    },
    is_available: function() {
      return lab.money >= this.cost;
    },
    hire: function() {
      if (lab.buy(this.cost)) {
        this.hired++;
        var cost = this.cost;
        this.cost = Math.round(this.cost * this.cost_increase);
        return cost;
      }
      return -1;
    }
  };
  var workers = $.extend([], Helpers.loadFile('json/workers.json'),
                         ObjectStorage.load('workers'));
  workers = workers.map(function(worker) {
    return $.extend({}, workersPrototype, worker);
  });


  /** Upgrades
   */
  var upgradesPrototype = {
    getReceiver: function() {
      if (this.type === "detector") {
        return lab.detector;
      } else if (this.type === "reputation"){
        return lab.factor;
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
    },
    hasReceiver: function() {
      if (this.type === "detector" || this.type === "reputation") {
        return true;
      }
      var rec = this.getReceiver();
      if (this.type === "research") {
        return rec.level > 0;
      } else if (this.type === "hr") {
        return rec.hired > 0;
      }
      return false;
    },
    is_visible: function() {
      return !this.used && this.hasReceiver() && lab.money >= this.cost * .7;
    },
    is_available: function() {
      return !this.used && this.hasReceiver() && lab.money >= this.cost;
    },
    buy: function() {
      if (!this.used && lab.buy(this.cost)) {
        this.used = true;
        var rec = this.getReceiver();
        if (rec) {
          rec[this.property] = rec[this.property] * this.factor + this.constant;
        }
        return true;
      }
      return false;
    }
  };
  var upgrades = $.extend([], Helpers.loadFile('json/upgrades.json'),
                         ObjectStorage.load('upgrades'));
  upgrades = upgrades.map(function(upgrade) {
    return $.extend({}, upgradesPrototype, upgrade);
  });


  /** Save all the game objects at once.
   */
  var saveAll = function() {
    ObjectStorage.save('lab', lab);
    ObjectStorage.save('research', research);
    ObjectStorage.save('workers', workers);
    ObjectStorage.save('upgrades', upgrades);
  };

  return {
    lab: lab,
    research: research,
    workers: workers,
    upgrades: upgrades,
    saveAll: saveAll
  }
})();
