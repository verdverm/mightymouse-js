mightymouse-js
==============

mightymouse-js makes working with mouse traps a snap! just watch your tail.

```JavaScript
mightymouse.AddHandler("body", "lbtn clk", function(e) {
    console.log("left button clicked!")
});
```

Install
---------------

To install, include the mightymouse.js file in your website.

mightymouse-js depends on JQuery.


Usage
---------------

the API is as follows

```JavaScript
buttons   = ["lbtn", "mbtn", "rbtn"];
events    = ["clk", "dbl", "down", "up", "scroll"];
modifiers = ["alt", "ctrl", "shift", "meta"];
prevent?  = ["prevent"];

mightmouse.AddHandler(JQuerySelector, MouseString, Handler);
```

- You can only use one event and one button. 
- 'scroll' ignores buttons.
- 'rbtn' ignores events (oncontextmenu).
- You can use as many modifiers as you like, but mightymouse tests that those you didn't include, aren't pressed down as well.


Examples
--------------

```JavaScript
mightymouse.AddHandler("body", "lbtn clk", function(e) {
    console.log("someone help me!")
});
mightymouse.AddHandler("body", "lbtn clk ctrl", function(e) {
    console.log("mighty mouse to the rescue!")
});
mightymouse.AddHandler(".cat", "lbtn clk ctrl shift", function(e) {
    console.log("UP UP AND AWAY!");
});

// stop the context menu
mightymouse.AddHandler("#mydiv", "rbtn prevent", function(e) {
    console.log("right mouse prevented!");
});
```

Issues
--------------

The right mouse button is discriminated against by browser vendors.

If you find one, let me know... file a bug report.
