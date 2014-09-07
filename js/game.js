var Game = (function() {
  'use strict';

  var Game = function() {
    this.lab = new GameObjects.Lab();
    this.research = null;
    this.workers = null;
    this.upgrades = null;
    this.achivements = null;
    this.allObjects = {lab : this.lab};
    this.loaded = false;
  };

  Game.prototype.load = function() {
    if (this.loaded) {
      return;
    }
    var _this = this;
    $.when($.get('json/research.json', function(jR) { _this.research = jR; }),
           $.get('json/workers.json', function(jW) { _this.workers = jW; }),
           $.get('json/upgrades.json', function(jU) { _this.upgrades = jU; }),
           $.get('json/achievements.json',
                 function(jA) { _this.achivements = jA; })).then(function() {
      // Turn JSON files into actual game objects and fill map of all objects
      var makeGameObject = function(type, object) {
        // It's okay to define this function here since load is only called
        // once anyway...
        var o = new type(object);
        _this.allObjects[o.key] = o;
        return o;
      };
      _this.research = _this.research.map(
          function(r) { return makeGameObject(GameObjects.Research, r); });
      _this.workers = _this.workers.map(
          function(w) { return makeGameObject(GameObjects.Worker, w); });
      _this.upgrades = _this.upgrades.map(
          function(u) { return makeGameObject(GameObjects.Upgrade, u); });
      _this.achivements = _this.achivements.map(function(a) {
        var _a = makeGameObject(GameObjects.Achievement, a);
        _a.setRefAllGameObjects(_this.allObjects);
        return _a;
      });
      // Load states from local store
      for (var i = 0; i < _this.allObjects.length; i++) {
        var o = _this.allObjects[i];
        o.loadState(ObjectStorage.load(o.key));
      }
      _this.loaded = true;
    });
  };

  Game.prototype.save = function() {
    // Save every object's state to local storage
    for (var i = 0; i < this.allObjects.length; i++) {
      ObjectStorage.save(this.allObjects[i].state);
    }
  };

  return {Game : Game};
}());
