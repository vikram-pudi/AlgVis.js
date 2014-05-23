AlgVis.js
=========

**Build Algorithm Visualizations Easily!**

Demos
-----
These demos are just proof of concept. Their look and feel can be changed / improved to suit your taste by simply modifying the CSS files. AlgVis.js does not impose any restrictions.

1. [Insertion Sort Visualization](http://faculty.iiit.ac.in/~vikram/algvis/insertionsort.html)
2. [Quick Sort Visualization](http://faculty.iiit.ac.in/~vikram/algvis/quicksort.html)

Introduction
------------
A google research reveals many javascript libraries for visualization. But most of these are specific for enabling particular visualization techniques (like bar graphs, etc.). Even the general libraries (like D3 and processing.js) are for visualizing and interpreting _data_. None of these libraries feel "just right" for _algorithm_ visualization -- and moreover, they have steep learning curves.

Most animations can simply be implemented as a sequence of changes of the CSS style of HTML divs on screen. These divs show the state of the algorithm and its data at any point in time. The main complexity arises because we cannot just keep a sequence of changes of CSS style _in a loop_. All of them will happen almost instantaneously and only the _last change_ will be seen. Keeping a delay between the changes is not simple because javascript has no simple way of doing it. The simple ways (like implementing a sleep function that wastes time) do not work because it interferes with the native optimizations that javascript does causing hard-to-debug programs.

AlgVis.js is a small module that implements the complicated logic of adding delays between statements. The algorithm code remains _readable_. In fact using AlgVis.js can make your code even more legible because you need to output a 'commentary' of the algorithm while executing it. This is done by adding a few lines in between your code where you yield the commentary. For example:

``` javascript
yield ['Finished iterating i', point_vis, [i-1,'black']];
```

This means that at that point in your code, you want to output to the user saying 'Finished iterating i'. To do the animation representing that event (e.g. visually remove the pointer i), you need to put that animation in a function, which you call as `point_vis` and  `[i-1,'black']` are the arguments to that function. You can implement this function using e.g. jquery .animate or .css, or any other library of your choice.

You can also call a sequence of such functions representing different animation effects:

``` javascript
yield ['Swapping '+i+' and '+j, swap_vis, [i,j], move_pointer_vis, [i,'black',j,'red']];
```

Usage
-----

All you need to download is the algvis.js file from the sources. Then:

Include in HTML:

``` html
<script src="algvis.js"></script>
```

In your javascript:

Create your algorithm as a generator. To do this, define it as a function\* (notice the \*) and include `yield` statements inside it as mentioned above. The only additional complication is if you need to call another function that **also needs to be visualized**, or if you need to call the same function recursively. Then, you need to convert these statements as follows:

What you want:

``` javascript
function* quicksort(l, u){
   yield ['Sorting from index '+l+' to '+u, 3000, range_vis, [l,u,'lightcyan']];
     //3000 here is an optional delay in milliseconds for how long to display this commentary; default is 2000

   //all the code for quicksort algorithm here
   
   //now recursively call quicksort again
   quicksort(l, m-1);
   quicksort(m+1, u);
}
```

What you should write:

``` javascript
function* quicksort(l, u){
   yield ['Sorting from index '+l+' to '+u, 3000, range_vis, [l,u,'lightcyan']];

   //all the code for quicksort algorithm here
   
   //now recursively call quicksort again
   for (var n of quicksort(l, m-1)) yield n;
   for (var n of quicksort(m+1, u)) yield n;
}
```

Additionally, you should create a function (say `init()`) that does any initializing required for quicksort -- e.g. creating an array, etc. This function may be called multiple times, e.g. if the user restarts the animation. This function should return an array of arguments needed as input to quicksort, e.g. `[0, A.length]`.

Finally, you need to instantiate a `Viz` object, specify which are the buttons for 'Play', 'Pause', etc. and the `commentary` div. You may provide optional additional functions that should be executed when the 'Play' button is pressed. These are done simply:

``` javascript
var myviz = new Viz(init, quicksort);
function playon() { $('#play').html('<span class="glyphicon glyphicon-play"></span>'); }
function playoff() { $('#play').html('<span class="glyphicon glyphicon-pause"></span>'); }
myviz.init_buttons($('#commentary')[0], $('#play')[0], $('#next')[0], $('#stop')[0], playon, playoff);
```

The example programs provided show how easy it is to build algorithm animations using AlgVis.
