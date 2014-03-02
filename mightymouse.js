// mightymouse.js
// copyright 2014
// Tony Worm  verdverm@gmail.com


var mightymouse = (function($) {

    var MM = {};

    var b_buttn = ["lbtn", "mbtn", "rbtn"];
    var b_event = ["click", "double", "down", "up", "move", "scroll"];
    var b_extra = ["alt", "ctrl", "shift", "meta"];


    MM.AddHandler = function(jqry_sel, event_str, handler, limit) {
        $(jqry_sel).addClass("mm_click");
        var mm_handle = parseEvent(event_str, handler, limit);
        if (mm_handle == null) {
            console.log("mightmouse-js: Error adding handler")
        }

        $(jqry_sel).on(mm_handle.type, mm_handle.handler);
    }

    function parseEvent(str, hdl, lmt) {

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

                case "click":
                case "double":
                case "down":
                case "up":
                case "move":
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
                case "click":
                    type_str = "click";
                    break;
                case "double":
                    type_str = "dblclick";
                    break;
                case "down":
                    type_str = "mousedown";
                    break;
                case "up":
                    type_str = "mouseup";
                    break;
                case "move":
                    type_str = "mousemove";
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
                    // we can ignore buttons for the 'mousemove' event
                    if (params.evt !== "move") {
                        console.log("Shouldn't get here (params.btn)")
                        return null;
                    }
                    handleB = handle
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
            handleP = function(e) {
                e.preventDefault();
                return handleX(e);
            }
        } else {
            handleP = handleX;
        }

        var handleT = handleP
        var canCall = true;
        var limit = lmt;

        if (lmt != undefined) {
            handleT = function(e) {
                if (!canCall)
                    return;
                canCall = false;
                setTimeout(function() {
                    canCall = true;
                }, limit);
                // call the actual handler
                handleP(e);
            }
        }
        return {
            type: type_str,
            handler: handleT,
        };
    }

    var pass_test_strs = [
        "click lbtn",
        "double lbtn",
        "click mbtn",
        "double mbtn",
        "click rbtn",
        "double rbtn",
        "move",
        "move lbtn",
        "move ctrl",

        // space test
        " double  rbtn ",

    ];
    var fail_test_strs = [

        // invalid input
        "xxx click rbtn",
        "click xxx rbtn",
        "click rbtn xxx",

        // too many events
        "click double rbtn",
        "click rbtn double",
        "rbtn click double",

        // too many buttons
        "double lbtn rbtn",
        "lbtn double rbtn",
        "lbtn rbtn double",

        // and last but not least... the empty test!
        "" // <- note the empty string
    ];

    function testParsing() {
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


    MM.TestMices = function() {
        testParsing();

        MM.AddHandler("body", "rbtn prevent", function(e) {
            console.log("right mouse prevented!");
        });
        MM.AddHandler("body", "lbtn click ctrl", function(e) {
            console.log("mighty mouse to the rescue!")
        });
        MM.AddHandler("body", "lbtn click shift", function(e) {
            console.log("mighty mouse to the rescue2!")
        });
        MM.AddHandler("body", "lbtn click ctrl shift", function(e) {
            console.log("UP UP AND AWAY!");
        });

        var rateLimit = 200;
        MM.AddHandler("body", "move", function(e) {
            console.log("MM pos: " + e.clientX + "," + e.clientY + " @ " + new(Date))
        }, rateLimit);
    }


    return MM;

}(jQuery));