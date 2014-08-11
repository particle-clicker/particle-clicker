'use strict';

/** Define all objects used in the game.
 * They can be either loaded from localStorage or from JSON in case nothing is
 * found in the localStorage.
 */
var GameObjects = (function() {
  var allObjects = {
    push: function(key_property, list) {
      for (var i = 0; i < list.length; i++) {
        this[list[i][key_property]] = list[i];
      }
    }
  };

  /** Lab
   */
  var labPrototype = {
    version: '0.2',
    name: 'Click here to give your lab a catchy name',
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
  allObjects['lab'] = lab;

  /** Research
   */
  var researchPrototype = {
    level: 0,
    interesting: false,
    is_visible: function() {
      return this.level > 0 || lab.data >= this.cost * .7;
    },
    is_available: function() {
      return lab.data >= this.cost;
    },
    research: function() {
      if (lab.research(this.cost, this.reputation)) {
        this.level++;
        if (this.info_levels.length > 0 && this.level === this.info_levels[0]) {
          this.interesting = true;
          this.info_levels.splice(0, 1);
        }
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
      this.interesting = false;
      return this._info;
    },
  };
  var research = $.extend([], Helpers.loadFile('json/research.json'),
                          ObjectStorage.load('research'));
  research = research.map(function(item) {
    return $.extend({}, researchPrototype, item);
  });
  allObjects.push('name', research);


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
        analytics.sendEvent(analytics.events.categoryHR, analytics.events.actionHire, this.name, this.hired);
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
  allObjects.push('name', workers);


  /** Upgrades
   */
  var upgradesPrototype = {
    _visible: false,
    _used: false,
    meetsRequirements: function() {
      for (var i = 0; i < this.requirements.length; i++) {
        var req = this.requirements[i];
        if (allObjects[req.key][req.property] < req.threshold) {
          return false;
        }
      }
      return true;
    },
    isAvailable: function() {
      if (!this._used && lab.money >= this.cost && this.meetsRequirements()) {
        return true;
      }
      return false;
    },
    isVisible: function() {
      if (!this._used && (this._visible || lab.money >= this.cost * .7 && this.meetsRequirements())) {
        this._visible = true;
        return true;
      }
      return false;
    },
    buy: function() {
      if (!this._used && lab.buy(this.cost)) {
        for (var i = 0; i < this.targets.length; i++) {
          var t = this.targets[i];
          allObjects[t.key][t.property] *= this.factor || 1;
          allObjects[t.key][t.property] += this.constant || 0;
        }
        this._used = true;
        this._visible = false;
      }
    }
  };
  var upgrades = $.extend([], Helpers.loadFile('json/upgrades.json'),
                         ObjectStorage.load('upgrades'));
  upgrades = upgrades.map(function(upgrade) {
    return $.extend({}, upgradesPrototype, upgrade);
  });
  allObjects.push('name', upgrades);


  /** Save all the game objects at once.
   */
  var saveAll = function() {
    ObjectStorage.save('lab', lab);
    ObjectStorage.save('research', research);
    ObjectStorage.save('workers', workers);
    ObjectStorage.save('upgrades', upgrades);
    ObjectStorage.save('achievements', achievements);
  };

  return {
    lab: lab,
    research: research,
    workers: workers,
    upgrades: upgrades,
    saveAll: saveAll,
  }
})();
