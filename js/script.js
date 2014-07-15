var rec = false;
var stages = [['i1', 'i2', 'i3'], ['i4', 'i5']];

show(['i4', 'i5'], true);

stages.forEach(function (s, i) {
    s.forEach(function (n) {
        $(fetch(n)).on('change', function () {
            var after = [];
            stages.slice(i + 1).forEach(function (a) {
                after = after.concat(a);
            });
            show(after, true);
            rec = false;
            assess(i);
        });
    });
});

function assess (stage) {
    if (!isComplete(stage)) return;

    switch (stage) {
        case 0:
        if ($('#i30').is(':checked')) {
            var os = get('i1');
            if (test(os, ['android', 'ios', 'nokia', 'openwrt', 'pi', 'olpc']))
                recommend('GENI');
            else if (test(os, ['ios', 'nokia', 'openwrt', 'pi', 'olpc'], 1))
                recommend('ToMaTo');
            else
                recommend('contact');
        }
        break;
    }

    advance(stage);
}

function advance (stage) {
    if (rec) return;
    switch (stage) {
        case -1:
        return;
        case 0:
        show(['i4', 'i5']);
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
    var names = stages[stage];
    return names.filter(function (n) {
        return $(fetch(n) + ':checked').length;
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
        return $elem[0].value;
    }
}

/**
 * Returns the jQuery selector for a name or an array of names
 * @param  {[String] or String} name The name(s) to select
 * @return {String}                  A jQuery selector string that
 *                                   would select the inputs with given
 *                                   name(s)
 */
function fetch (name) {
    if (name.constructor == String)
        return '[name="' + name + '"]';
    
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