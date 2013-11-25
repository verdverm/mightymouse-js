mightymouse-js
==============

mightymouse-js makes working with mouse traps a snap! just watch your tail.

Install
---------------

To install, include the mightymouse.js file in your website.
mightymouse-js depends on jquery.


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

you can only use one event and one button. 
scroll ignores buttons, rbtn ignores events.
you can have as many of the modifiers as you like,
mighty mouse tests that those you didn't include aren't down too.


Examples
--------------

```JavaScript
mightymouse.AddHandler("body", "lbtn clk", function(e) {
    console.log("someone help me!")
});
mightymouse.AddHandler("body", "lbtn clk ctrl", function(e) {
    console.log("mighty mouse to the rescue!")
});
mightymouse.AddHandler("body", "lbtn clk ctrl shift", function(e) {
    console.log("UP UP AND AWAY!");
});

// stop the context menu
mightymouse.AddHandler("body", "rbtn prevent", function(e) {
    console.log("right mouse prevented!");
});
```

Issues
--------------

If you find one, let me know... file a bug report.
