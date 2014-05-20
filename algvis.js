
function addEvent(element, evnt, funct){
  if (element.attachEvent)
   return element.attachEvent('on'+evnt, funct);
  else
   return element.addEventListener(evnt, funct, false);
}

function Viz(init, algo) {
  this.init = init; //function to initialize algorithm state each time it is run
  this.algo = algo; //generator to run the algorithm
  this.commentary = null; //div where commentary text is to be displayed
  this.playon = null; //function to visually on the play button
  this.playoff = null; //function to visually off the play button (and show pause)
  this.process = null;
  this.auto_next = false;
  this.timer = null;
  this.initialized = false;
}

Viz.prototype.initialize = function() {
  viz.process = viz.algo.apply(null, viz.init());
  if (viz.commentary) viz.commentary.innerHTML = 'Ready to start.';
  viz.initialized = true;
}

Viz.prototype.run = function() {
  var viz = this;
  if ((!viz.initialized) && viz.init && viz.algo) {
    viz.initialize();
    if (viz.auto_next)
      viz.timer = setTimeout(function() {viz.run();}, 2000);
    return;
  }
  var n = viz.process.next();
  if (n) {
    var f = n.value;
    if (f) {
      if (f[0] && viz.commentary) viz.commentary.innerHTML = f[0];
      var delay = 2000;
      var start_index = 1;
      if (typeof f[1] == 'number') {      
        delay = f[1];
        start_index = 2;
      }
      for (var i = start_index; i < f.length; i+=2)
        f[i].apply(null, f[i+1]);
      if (viz.auto_next)
        viz.timer = setTimeout(function() {viz.run();}, delay);
    } else {
      viz.pause(); viz.initialized = false;
      if (viz.commentary) viz.commentary.innerHTML = 'Finished!';
    }
  }
}

Viz.prototype.init_buttons = function(commentary, playbtn, nextbtn, stopbtn, playon, playoff) {
  viz = this;
  viz.commentary = commentary;
  viz.playon = playon;
  viz.playoff = playoff;
  if (playbtn)
    addEvent(playbtn, 'click', function(){
      if (viz.auto_next) viz.pause()
      else viz.play();
    });
  if (nextbtn)
    addEvent(nextbtn, 'click', function(){viz.pause(); viz.run();});
  if (stopbtn)
    addEvent(stopbtn, 'click', function(){viz.pause(); viz.initialize();});
}

Viz.prototype.play = function() {
  viz = this;
  if (viz.playoff) viz.playoff();
  viz.auto_next = true;
  viz.run();
}

Viz.prototype.pause = function() {
  viz = this;
  if (viz.playon) viz.playon();
  if (viz.timer) clearTimeout(viz.timer);
  viz.auto_next = false;
}
