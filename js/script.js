var rec = false;
var stages = [{
    questions: [1, 2, 3],
    recommendations: [
        {
            name: 'GENI',
            test: function () {
                return get(3) && get(1) && test(get(1), [
                    'android',
                    'ios',
                    'nokia',
                    'openwrt',
                    'pi',
                    'olpc'
                ], 1);
            }
        },
        {
            name: 'ToMaTo',
            test: function () {
                return get(3) && get(1) && test(get(1), [
                    'ios',
                    'nokia',
                    'openwrt',
                    'pi',
                    'olpc'
                ], 1);
            }
        },
        {
            name: 'contact',
            test: function () {
                return get(3);
            }
        }
    ]
}, {
    questions: [4, 5],
    recommendations: [
        {
            name: 'Planetlab',
            test: function () {
                return (get(1) == null || get(1) == 'linux')
                    && !get(2)
                    && (get(5) == 'dedicated' || get(5) == 'virtualize');
            }
        },
        {
            name: 'Lind',
            test: function () {
                return !get(2)
                    && !get(3)
                    && get(4);
            }
        },
        {
            name: 'contact',
            test: function () {
                return get(2) || get(3) || get(4);
            }
        }
    ]
}, {
    questions: [6, 7, 8, 9, 10]
}];

stages.forEach(function (s, i) {
    s.questions.forEach(function (n) {
        $(fetch(n)).on('change', function () {
            console.log('change');
            var after = [];
            stages.slice(i + 1).forEach(function (a) {
                after = after.concat(a.questions);
            });
            show(after, true);
            rec = false;
            assess(i);
        });
    });
});

$(fetch(1)).change();

function assess (stage) {
    if (!isComplete(stage)) return;

    var recommendations = stages[stage].recommendations;
    for (var i in recommendations) {
        if (recommendations[i].test()) {
            recommend(recommendations[i].name)
            break;
        }
    }

    advance(stage);
}

function advance (stage) {
    if (rec) return;
    switch (stage) {
        case -1:
        return;
        case stages.length - 1:
        return;
        default:
        show(stages[stage + 1].questions);
        assess(stage + 1);
        break;
    }
}

function recommend (testbed) {
    rec = testbed;
}

/**
 * Determines whether stage is complete
 * 
 * @param  {Number}  stage The stage number to check
 * @return {Boolean}       Whether the stage is complete
 */
function isComplete (stage) {
    var names = stages[stage].questions;
    return names.filter(function (n) {
        var f = fetch(n);
        var s = f + ':checked,' + f + '[type="checkbox"]';
        return $(s).length;
    }).length == names.length;
}

/**
 * Show/hide the inputs with given name
 * 
 * @param  {[String] or String} name The name(s) or input(s) to
 *                                   show/hide
 * @param  {Boolean}            hide Whether to hide instead of show
 */
function show (name, hide) {
    var $e = $(fetch(name)).parent('li');
    hide ? $e.hide() : $e.show();
}

/**
 * Gets the value(s) of input(s) with given name
 * 
 * @param  {[String] or String} name The name(s) of inputs to get value
 *                                   from
 * @return {[String] or String}      The values of the selected inputs
 */
function get (name) {
    var $elem = $(fetch(name) + ':checked');
    if ($elem.length > 1) {
        return $elem.map(function (i, e) {
            return e.value;
        }).toArray();
    } else if ($elem.length == 1) {
        if ($elem[0].value == "1") return true;
        else if ($elem[0].value == "0") return false;
        else return $elem[0].value;
    } else {
        return null;
    }
}

/**
 * Returns the jQuery selector for a name or an array of names
 * @param  {[String], String, Number} name The name(s) to select
 * @return {String}                        A jQuery selector
 *                                         string that would select
 *                                         the inputs with given
 *                                         name(s)
 */
function fetch (name) {
    if (name.constructor == String)
        return '[name="' + name + '"]';
    else if (typeof(name) == 'number')
        return '[name="q' + name + '"]';
    
    var s = '';
    name.forEach(function (n) {
        s += fetch(n) + ',';
    });

    return s.substr(0, s.length - 1);
}

/**
 * Tests for items in ref against items in src
 * 
 * @param  {[any]}  src  The source array - containing all
 *                       items actually selected
 * @param  {[any]}  ref  The reference array - containing all
 *                       items that should [not] be selected
 * @param  {Number} type The rule of testing:
 *                        - 0 for all items in ref must be in src
 *                        - 1 for no items in ref must be in src
 *                        - 2 for at least one item in ref must be in
 *                            src
 *                        - 3 for not all items in ref must be in src
 * 
 * @return {Boolean}     The test result
 */
function test (src, ref, type) {
    if (src.constructor != Array || ref.constructor != Array)
        return;
    switch (type) {
        case 0:
        return ref.filter(function (d) {
            return src.indexOf(d) > -1;
        }).length == ref.length;
        break;
        case 1:
        return ref.filter(function (d) {
            return src.indexOf(d) > -1;
        }).length == 0;
        break;
        case 2:
        return !test(src, ref, 1);
        break;
        case 3:
        return !test(src, ref, 0);
        break;
    }
}