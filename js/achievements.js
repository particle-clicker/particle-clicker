var achievements =
{
    list: [],
    listSpecial: [],
    listSummary: [],

    startTime: new Date(),

    count:
    {
        clicks: 0,
        data: 0,
        money: 0,
        reputation: 0,
        workers: 0,
        dataSpent: 0,
        moneyWorkers: 0,
        moneyUpgrades: 0
    },

    workers: {},
    research: {},

    setList: function(list)
    {
        for (var i = 0; i < list.length; i++) {
            if (list[i].type == list[i].target) {
                achievements.listSpecial.push(list[i]);
                for (var item in achievements[list[i].type]) {
                    var a = $.extend(true, {}, list[i]);
                    a.target = item;
                    if (list[i].type == 'workers' && list[i].threshold == 1) {
                        a.description = a.description.replace('${name}', item.substring(0, item.length - 1));
                    } else {
                        a.description = a.description.replace('${name}', item);
                    }
                    achievements.list.push(a);
                }
            } else {
                achievements.list.push(list[i]);
            }
        }

        achievements.list.map(function(item) {
            item.completed = false;
            item.alerted = false;
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
                achievements[type][subtype] >= achievements.list[i].threshold
               )
            {
                //console.log(achievements.list[i].threshold, achievements[type][subtype]);

                achievements.list[i].completed = true;
                achievements.displayAchievement(i);
            }
        }
    },

    displayAchievement: function(i)
    {
        var alert = '<div class="alert alert-success alert-dismissible" role="alert">';
        alert += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        alert += '<span class="glyphicon ' + achievements.list[i].icon + ' alert-glyph"></span> <span class="alert-text">' + achievements.list[i].description + '</span>';
        alert += '</div>';

        alert = $(alert);

        if (achievements.list[i].completed && !achievements.list[i].alerted) {
            $('#achievements-container').prepend(alert);

            var remove = function(a)
            {
                return function()
                {
                    a.slideUp(300);
                };
            };

            window.setTimeout(remove(alert), 2000);
            achievements.list[i].alerted = true;

            var a = $.extend(true, {}, achievements.list[i]);
            a.time = achievements.timeFormatter(new Date().getTime() - achievements.startTime.getTime());
            achievements.listSummary.push(a);
        }
    },

    timeFormatter: function(msec)
    {
        var totals = Math.ceil(msec / 1000);
        var days = Math.floor(totals / (24 * 60 * 60));
        var hours = Math.floor((totals % (24 * 60 * 60)) / (60 * 60));
        var totalmin = (totals % (24 * 60 * 60)) % (60 * 60);
        var mins = Math.floor(totalmin / 60);
        var secs = totalmin % 60;

        var str = [];
        if (days > 0) {
            str.push(days + ' day' + (days % 100 == 1 ? '' : 's'));
        }
        if (hours > 0) {
            str.push(hours + ' h');
        }
        if (mins > 0) {
            str.push(mins + ' min');
        }
        if (secs > 0) {
            str.push(secs + ' s');
        }

        return str.join(', ');
    }
};

