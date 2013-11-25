// mightymouse.js

var mightymouse = {}

// $({
var b_buttn = ["lbtn", "mbtn", "rbtn"];
var b_event = ["clk", "dbl", "down", "up", "scroll"];
var b_extra = ["alt", "ctrl", "shift", "meta"];

mightymouse.AddHandler = function(jqry_sel, event_str, handler) {
    $(jqry_sel).addClass("mm_click");
    var mm_handle = parseEvent(event_str, handler);
    $(jqry_sel).on(mm_handle.type, mm_handle.handler);
}

function parseEvent(str, hdl) {

    // first parse the string
    var params = {
        prevent: false,
        btn: "",
        evt: "",
        xtrs: [],
    }

    var flds = str.split(" ")
    var empty = true;
    for (var i = 0; i < flds.length; i++) {
        var f = flds[i];
        if (f.length < 1) {
            continue;
        }
        if (empty) {
            empty = false;
        }
        switch (f) {
            case "prevent":
                params.prevent = true;
                break;
            case "lbtn":
            case "mbtn":
            case "rbtn":
                if (params.btn != "") {
                    console.log("error parsing'" + str + "': more than one button specified");
                    return null;
                }
                params.btn = f;
                break;

            case "clk":
            case "dbl":
            case "down":
            case "up":
            case "scroll":
                if (params.evt != "") {
                    console.log("error parsing'" + str + "': more than one event specified");
                    return null;
                }
                params.evt = f;
                break;

            case "alt":
            case "ctrl":
            case "shift":
            case "meta":
                params.xtrs.push(f);
                break;

            default:
                console.log("error parsing'" + str + "': unknown input'" + f + "'");
                return null;
        }
    }

    if (empty) {
        console.log("error parsing'" + str + "': empty input'");
        return null
    }


    // then build the handler
    var type_str = "";
    var handle = hdl;
    var handleB = function(e) {
        console.log("handleB")
    };
    var handleP = function(e) {
        console.log("handleP")
    };
    var handleX = function(e) {
        console.log("handleX")
    };


    // special case for rbtn, which ignores the event field (why is the right button being discriminated against)
    if (params.btn == "rbtn") {
        type_str = "contextmenu";
        handleB = handle;
    }
    // special case for scroll, which ignores the button field
    else if (params.evt == "scroll") {
        type_str = "scroll";
        handleB = handle;
    }
    // default case needs to wrap the current handler for button number
    else {
        // type str
        switch (params.evt) {
            case "clk":
                type_str = "click";
                break;
            case "dbl":
                type_str = "dblclick";
                break;
            case "down":
                type_str = "mousedown";
                break;
            case "up":
                type_str = "mouseup";
                break;
            default:
                console.log("Shouldn't get here (params.evt)")
                return null;
        }
        // btn determination
        switch (params.btn) {
            case "lbtn":
                handleB = function(e) {
                    if (e.button == 0) {
                        return handle(e)
                    }
                }
                break;
            case "mbtn":
                handleB = function(e) {
                    if (e.button == 1) {
                        return handle(e)
                    }
                }
                break;
            default:
                console.log("Shouldn't get here (params.btn)")
                return null;
        }



    }
    var bitvec = [false, false, false, false];
    // add meta key handler
    if (params.xtrs.length > 0) {
        var does = params.xtrs;
        for (var i = 0; i < does.length; i++) {
            switch (does[i]) {
                case "alt":
                    bitvec[0] = true;
                    break;
                case "ctrl":
                    bitvec[1] = true;
                    break;
                case "meta":
                    bitvec[2] = true;
                    break;
                case "shift":
                    bitvec[3] = true;
                    break;
                default:
                    console.log("Shouldn't get here (params.xtrs)")
                    return null;
            }
        }

        console.log(bitvec);
        handleX = function(e) {
            var m = e.originalEvent;
            var pass = true;

            pass = (pass && (bitvec[0] == e.altKey));
            pass = (pass && (bitvec[1] == e.ctrlKey));
            pass = (pass && (bitvec[2] == e.metaKey));
            pass = (pass && (bitvec[3] == e.shiftKey));

            if (pass) {
                return handleB(e);
            }
        }

    } else {
        handleX = handleB;
    }

    if (params.prevent == true) {
        console.log("prevent registered");
        handleP = function(e) {
            e.preventDefault();
            return handleX(e);
        }
    } else {
        handleP = handleX;
    }



    return {
        type: type_str,
        handler: handleP
    };
}

function setHandles(jqry_sel, mm_handles) {

}


var pass_test_strs = [
    "clk lbtn",
    "dbl lbtn",
    "clk mbtn",
    "dbl mbtn",
    "clk rbtn",
    "dbl rbtn",

    // space test
    " dbl  rbtn ",

];
var fail_test_strs = [

    // invalid input
    "xxx clk rbtn",
    "clk xxx rbtn",
    "clk rbtn xxx",

    // too many events
    "clk dbl rbtn",
    "clk rbtn dbl",
    "rbtn clk dbl",

    // too many buttons
    "dbl lbtn rbtn",
    "lbtn dbl rbtn",
    "lbtn rbtn dbl",

    // and last but not least... the empty test!
    "" // <- note the empty string
];

mightymouse.Test = function() {
    console.log("Passing input:");
    for (var i = 0; i < pass_test_strs.length; i++) {
        console.log("test: " + i + "  " + pass_test_strs[i]);
        var e = parseEvent(pass_test_strs[i], function() {});
        if (e == null) {
            console.log("[FAIL] ", e);
        }
    }
    console.log("Failing input:");
    for (var i = 0; i < fail_test_strs.length; i++) {
        console.log("test: " + i + "  " + fail_test_strs[i]);
        var e = parseEvent(fail_test_strs[i], function() {});
        if (e != null) {
            console.log("[FAIL] ", e);
        }
    }
}


function TestMices() {
    mightymouse.AddHandler("body", "rbtn prevent", function(e) {
        console.log("right mouse prevented!");
    });

    mightymouse.AddHandler("body", "lbtn clk ctrl", function(e) {
        console.log("mighty mouse to the rescue!")
    });
    mightymouse.AddHandler("body", "lbtn clk shift", function(e) {
        console.log("mighty mouse to the rescue2!")
    });
    mightymouse.AddHandler("body", "lbtn clk ctrl shift", function(e) {
        console.log("UP UP AND AWAY!");
    });

}