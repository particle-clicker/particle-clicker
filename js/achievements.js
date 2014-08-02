var achievements =
{
    list: [],

    count:
    {
        clicks: 0,
        data: 0,
        money: 0
    },

    workers: {},
    research: {},

    setList: function(list)
    {
        achievements.list = list;
        achievements.list.map(function (item) {  // define additional stuff on the objects
            item.completed = false;
            item.is_visible = function() {
                return this.completed;
            };
        });
    },

    addWorkers: function(list)
    {
        for (var i = 0; i < list.length; i++) {
            achievements.workers[list[i].name] = 0;
        }
    },

    addResearch: function(list)
    {
        for (var i = 0; i < list.length; i++) {
            achievements.research[list[i].name] = 0;
        }
    },

    update: function(type, subtype, val)
    {
        achievements[type][subtype] += val;

        for (var i = 0; i < achievements.list.length; i++) {
            if (achievements.list[i].type == type &&
                achievements.list[i].target == subtype &&
                achievements.list[i].threshold >= achievements[type][subtype]
               )
            {
                achievements.list[i].completed = true;
            }
        }
    }
};

