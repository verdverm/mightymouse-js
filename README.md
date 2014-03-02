mightymouse-js
==============

![Here I come to save the daaaaay!](https://raw.github.com/verdverm/mightymouse-js/master/MightyMouseandGirl.gif)

mightymouse-js makes working with mouse traps a snap! Just watch that tail!

```JavaScript
mightymouse.AddHandler("body", "lbtn click", function(e) {
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
events    = ["click", "double", "down", "up", "move", "scroll"];
modifiers = ["alt", "ctrl", "shift", "meta"];
prevent?  = ["prevent"];

mightmouse.AddHandler(JQuerySelector, MouseString, Handler, Limit);
```

You can use one event, one button, and as many modifiers as you like. 
mightymouse-js checks that those modifiers you didn't include, are not pressed down.
Limit is optional and specifies how often the handler can be invoked.

caveats:

- `move` does not require buttons
- `scroll` ignores buttons.
- `rbtn` ignores events (oncontextmenu).
- `prevent` inserts a call to `preventDefault()` 


Examples
--------------

Call `mightmouse.TestMices() to run the tests and add sample handlers

```JavaScript
mightymouse.AddHandler("body", "rbtn prevent", function(e) {
    console.log("right mouse prevented!");
});
mightymouse.AddHandler("body", "lbtn click ctrl", function(e) {
    console.log("mighty mouse to the rescue!")
});
mightymouse.AddHandler("body", "lbtn click shift", function(e) {
    console.log("mighty mouse to the rescue2!")
});
mightymouse.AddHandler("body", "lbtn click ctrl shift", function(e) {
    console.log("UP UP AND AWAY!");
});

var rateLimit = 200;
mightymouse.AddHandler("body", "move", function(e) {
     console.log("MM is @: " + e.clientX + "," + e.clientY)
}, rateLimit);
```

Issues
--------------

The right mouse button is discriminated against by browser vendors.

If you find one, let me know... file a bug report.
