var rec = false;
var side = false;
var stages = [{
    questions: [1, 2, 3],
    recommendations: [
        {
            name: 'GENI',
            desc: 'GENI (Global Environment for Network Innovations) provides a virtual laboratory for networking and distributed systems research and education. It is well suited for exploring networks at scale, thereby promoting innovations in network science, security, services and applications. GENI allows experimenters to (1) Obtain compute resources from locations around the United States; (2) Connect compute resources using Layer 2 networks in topologies best suited to their experiments; (3) Install custom software or even custom operating systems on these compute resources; (4) Control how network switches in their experiment handle traffic flows; (5) Run their own Layer 3 and above protocols by installing protocol software in their compute resources and by providing flow controllers for their switches.',
            url: 'GENI page: http://www.geni.net/',
            test: function () {
                return get(3) && test(get(1), [
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
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, architecto dolor? Quia quisquam blanditiis commodi obcaecati inventore praesentium, vero, aliquid consectetur dicta deserunt sed. Delectus itaque aliquid inventore sit reprehenderit.',
            test: function () {
                return get(3) && test(get(1), [
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
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias laboriosam enim dignissimos voluptates. Esse sunt incidunt amet ex voluptatibus doloremque eius illum vel fugiat, cumque autem consequuntur officiis quasi hic.',
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
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint ad tempore sed, neque doloremque, ab dolores et dicta, aliquam fuga aspernatur quasi. Excepturi corporis id sit quidem, repellendus nam vel.',
            test: function () {
                return (get(1) == null || get(1) == 'linux')
                    && !get(2)
                    && (get(5) == 'dedicated' || get(5) == 'virtualize');
            }
        },
        {
            name: 'Lind',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid in, autem perspiciatis magnam dicta! Quaerat rem tempora, soluta voluptates non quis commodi totam officiis suscipit voluptatibus accusantium obcaecati placeat corporis?',
            test: function () {
                return !get(2)
                    && !get(3)
                    && get(4);
            }
        },
        {
            name: 'contact',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid nobis molestias sequi beatae? Ipsa ut sed nisi odio, fugit, beatae neque quisquam tempora saepe animi enim iste similique consequuntur, eum.',
            test: function () {
                return get(2) || get(3) || get(4);
            }
        }
    ]
}, {
    questions: [6],
    recommendations: [
        {
            name: 'Seattle',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam dicta iusto necessitatibus accusamus, culpa quasi, consequuntur reprehenderit tempore commodi sed enim rem cupiditate, dolorum delectus explicabo numquam molestiae aut itaque.',
            test: function () {
                return get(6) == null;
            }
        }
    ]
}, {
    questions: [7, 8, 9, 10]
}];

function assess (stage) {
    if (!isComplete(stage)) {
        $('.build').prop('disabled', true);
        $('.numbers li:last-child').addClass('disabled');
        return;
    }

    $('.build').prop('disabled', false);
    $('.numbers li:last-child').removeClass('disabled');

    var recommendations = stages[stage].recommendations;
    for (var i in recommendations) {
        if (recommendations[i].test()) {
            recommend(recommendations[i]);
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
        recommend({
            name: 'RepyV2',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint fugiat sequi eos aperiam, a perspiciatis vero delectus, reiciendis ut voluptate adipisci facere velit corrupti ipsum. Animi explicabo, nam modi iste?',
            instructions: [
            {
                name: 'Custom installer builder',
                desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo eaque molestiae esse voluptates cupiditate mollitia eligendi amet fugit est, nostrum quos, quibusdam non deleniti. Aut odio esse molestiae architecto assumenda.',
                test: function () {
                    return test(get(6), 'other', 0) || get(8);
                }
            },
            {
                name: 'Lookup service',
                desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident officia vitae nisi ut iste, dolor pariatur quis quia accusantium consequatur perspiciatis nihil magni quasi expedita maxime, illum aliquam adipisci ducimus?',
                test: function () {
                    return get(7);
                }
            },
            {
                name: 'Clearinghouse',
                desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, delectus quos quas aut totam, voluptate minus sunt quaerat iure nesciunt nihil, molestiae voluptas, dolorum nisi vero doloribus similique magni minima!',
                test: function () {
                    return get(10);
                }
            }
            ]
        });
        break;
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
        var s = f + ':checked,' + f + '[type="checkbox"],' + f + '[type="text"]';
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
 * @param  {Boolean}            val  Whether to return the label value
 * 
 * @return {[String] or String}      The values of the selected inputs
 */
function get (name, val) {
    var $elem = $(fetch(name) + ':checked');
    if ($elem.length > 1) {
        return $elem.map(function (i, e) {
            return val ? $(e).next().text() : e.value;
        }).toArray();
    } else if ($elem.length == 1) {
        if (val) return $elem.next().text();
        if ($elem[0].value == "1") return true;
        else if ($elem[0].value == "0") return false;
        else return $elem[0].value;
    } else {
        var $text = $(fetch(name) + '[type="text"]');
        if ($text.length)
            return $text.val();
        return val ? "None" : null;
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
    if (!src) return true;
    if (src.constructor != Array)
        src = [src];
    if (ref.constructor != Array)
        ref = [ref];

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

stages.forEach(function (s, i) {
    s.questions.forEach(function (n) {
        $(fetch(n)).on('change', function () {
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

$('.build').on('click', function () {
    if (!rec)
        return;

    if ($('.recontainer').length) {
        $('.instructions').remove();
        $('.recontainer').show();
        $('.side').show();
        $('.numbers li.active').removeClass('active');
        $('.numbers li:nth-child(3)').addClass('active');
        return;
    }

    var $rec = $('<div>').addClass('recontainer');
    $rec.append($('<p>').text('We recommend:'));
    $rec.append($('<p>').addClass('rec').text(rec.name));
    $rec.append($('<p>').addClass('desc').text(rec.desc));
    $rec.append($('<p>').addClass('url').text(rec.url));

    if (rec.instructions) {
        var parts = [];
        for (var i in rec.instructions) {
            if (rec.instructions[i].test())
                parts.push(rec.instructions[i]);
        }

        if (parts.length) {
            var $button = $('<button>').text('Instructions').click(function () {
                $rec.hide();
                $side.hide();

                var $ins = $('<div>').addClass('instructions');
                for (var i in parts) {
                    $ins.append($('<h3>').text(parts[i].name));
                    $ins.append($('<p>').text(parts[i].desc));
                    $ins.append($('<p>').text(parts[i].url));
                }

                $('.content').append($ins);
                $('.numbers li.active').removeClass('active');
                $('.numbers li:last-child').addClass('active');
            });

            $rec.append($button);
            $('.numbers ul').append($('<li>').addClass('pointer').text('>'));
            $('.numbers ul').append($('<li>').text('Instructions').click(function () {
                $button.click();
            }));
        }
    }

    var $side = $('<div>').addClass('side');
    var $h2 = $('<h2>').text('Your responses:');
    var $ol = $('<ol>').addClass('input');

    $('.question:visible').each(function (i, e) {
        var ans = get('q' + (i + 1), true);
        var $q = $(e).find('p').clone();
        var $li = $('<li>').addClass('question');

        if (ans.constructor == Array)
            ans = ans.join(', ')

        $li.append($q);
        $li.append($('<p>').text(ans));

        $ol.append($li);
    });

    $side.append($h2);
    $side.append($ol);

    $('.content').children().hide();
    $('.content').append($rec);
    $('.content').append($side);

    $('.numbers li:first-child').removeClass('active');
    $('.numbers li:nth-child(3)').addClass('active');

    $(window).scrollTop(0);
});

$('.numbers li:first-child').click(function () {
    if ($(this).hasClass('active')) return;

    $('.side').remove();
    $('.recontainer').remove();
    $('.instructions').remove();
    $('.content').children().show();

    $('.numbers li:nth-child(4), .numbers li:nth-child(5)').remove();
    $('.numbers li.active').removeClass('active');
    $('.numbers li:first-child').addClass('active');
});

$('.numbers li:nth-child(3)').click(function () {
    if ($('.build').prop('disabled')) return;
    $('.build').click();
});

$(fetch(1)).change();