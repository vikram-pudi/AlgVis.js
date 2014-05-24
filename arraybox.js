/*
  ArrayBox is a fancy way to take an array as input.

  It has 2 main methods:

  1. show() to show the input boxes to the user, and
  2. val() to get the array of values that the user has entered.

  The constructor takes as arguments the div whereto show the
  input boxes, and the default value of the array.
  
  E.g.:

  var a = new ArrayBox($('#array'), [5,8,3,1,6]);
  a.show();
  var list = a.val();

  Author: Vikram Pudi, IIIT Hyderabad, India.
*/

function ArrayBox(inputdiv, defaultval) {
  this.inputdiv = inputdiv;
  this.list = (defaultval == null)? [] : defaultval;
  this.boxes = [];
}

ArrayBox.prototype.show = function() {
  var a = this;
  a.boxes = [];

  a.inputdiv.empty();
  a.boxesdiv = $('<div style="display:inline-block;margin-left:10px"></div>');
  a.inputdiv.append(a.boxesdiv);

  a.addboxbtn = $('<button type="button" class="btn btn-success">+</button>');
  a.addboxbtn.on('click', function() {a.add().focus();});
  a.addboxbtn.appendTo(a.inputdiv).focus();

  var firstbox = null;
  for (var i = 0; i < a.list.length; i++) {
    if (firstbox == null) firstbox = a.add();
    else a.add(false);
  }
}

ArrayBox.prototype.add = function(setfocus) {
  var a = this;
	var newbox = $('<input placeholder="'+(a.list[a.boxes.length]|0)+'" type="number" min="0" step="1" class="inelement" autofocus>');
  newbox.on("keypress", function(e) {
    if (e.keyCode == 13) { //Enter pressed
      a.add().focus();
      return false;
    }
  }).on('keyup', function(e) {
    if (e.keyCode == 46 && e.ctrlKey) { //Ctrl-Del pressed
      var pos = a.boxes.indexOf(this);
      a.boxes.splice(pos, 1);
      var next = $(this).next();
      if ($.isEmptyObject(next)) {
        var prev = $(this).prev();
        if ($.isEmptyObject(prev)) a.addboxbtn.focus()
        else prev.focus();
      } else next.focus()
      $(this).remove();
    } else if (e.keyCode == 37 && e.ctrlKey) { //Ctrl-Left pressed
      var prev = $(this).prev();
      if (! $.isEmptyObject(prev)) prev.focus()
    } else if (e.keyCode == 39 && e.ctrlKey) { //Ctrl-Right pressed
      var next = $(this).next();
      if (! $.isEmptyObject(next)) next.focus();
    }
  });
  if (setfocus !== false) newbox.appendTo(a.boxesdiv).focus();
  else newbox.appendTo(a.boxesdiv);
  a.boxes.push(newbox);
  return newbox;
}

ArrayBox.prototype.val = function() {
  var listcp = []; //this.list.slice();
  for (var i=0; i < this.boxes.length; i++) {
    var textvalue = this.boxes[i].val();
    if (textvalue != null) textvalue = parseInt(textvalue);
    if (! textvalue && textvalue != 0) textvalue = this.list[i];
    if (textvalue == null) textvalue = 0;
    listcp.push(textvalue);
  }
  this.list = listcp.slice();
  return listcp;
}
