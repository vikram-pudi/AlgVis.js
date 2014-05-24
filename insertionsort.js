/*
  Author: Vikram Pudi, IIIT Hyderabad, India.
*/
/*$.when(
  $.getScript("arraybox.js"),
  $.getScript("algovis.js")
).then(function(){*/

$('#animation').show();

function init() {
  $('#result').empty();
}

function* Sort() {
  yield ['Enter array<br />\
<div style="color:yellow;text-align:left;display:inline-block;">\
<ul>\
<li>Enter = Add element</li>\
<li>Ctrl+Del = Delete element</li>\
<li>Ctrl-Left / Right to select</li>\
</ul>\
</div><br />\
Press <span style="color:blue">Play</span> or <span style="color:green">Next</span> when you are done.', input_array];
  yield ['Starting quicksort...', show_arraydivs];
  var i,j;
  for (i=0; i < list.length; i++) {
    yield ['i = '+i, mvpoint_vis, [(i==0)?null:i-1, 'black', i, 'blue']];
    for (j=i+1; j < list.length; j++) {
      if (list[i] > list[j])
      {
        yield ['j = '+j+'; less than "i"', 3000, mvpoint_vis, [(j==i+1)?null:j-1, 'black', j, 'green']];
        var temp=list[i];
        list[i]=list[j];
        list[j]=temp;
        yield ['Swapping', before_swap_vis, [i,j]];
        yield ['Swapping', swap_vis, [i,j]];
      }
      else {
        yield ['j = '+j, mvpoint_vis, [(j==i+1)?null:j-1, 'black', j, 'green']];
      }
    }
    yield ['Finished iterating j', point_vis, [j-1,(j-1==i)?'blue':'black']];
  }
  yield ['Finished iterating i', point_vis, [i-1,'black']];
}

var a = new ArrayBox($('#array'), [5,8,3,1,6]);
  /*ArrayBox is a fancy way to take an array as input
    It is available in the arraybox.js file in this directory
    It has 2 main methods: show() to show the input boxes to the user,
    and val() to get the array of values that the user has entered.
    The above constructor takes as arguments the div whereto show the
    input boxes, and the default value of the array.*/

function input_array() {
  a.show();
  if (viz.auto_next) viz.pause();
  $('#array').show();
  //$('#autofillArray').show();
}

function show_arraydivs() {
  list = a.val();
  divslist = [];
  var arraydiv = $('#result');
  arraydiv.empty();
  for (var i=0; i < list.length; i++) {
    var newdiv=$('<div>').attr({"class":"box"});
    var newdiv=$('<div class="box">'+list[i]+'</div>');
    arraydiv.append(newdiv);
    divslist.push(newdiv);
  }
  $('#array').hide();
  //$('#autofillArray').hide();
}

function before_swap_vis(i,j)
{
  divslist[i].css({'background-color':'lightgreen'});
  divslist[j].css({'background-color':'lightgreen'});
}

function swap_vis(i,j)
{
  var dist = divslist[j].position().left - divslist[i].position().left;
  $('#next').attr('disabled','disabled');
  divslist[i].animate({top:'+=50'}, 500)
             .animate({top:'-=50',left:'+='+dist}, 500, function() {
               divslist[i].css({'background-color':'yellow'});
             })
  divslist[j].animate({top:'+=50'}, 500)
             .animate({top:'-=50',left:'-='+dist}, 500, function() {
               divslist[i].html(list[i]).css({left:'-='+dist});
               divslist[j].html(list[j]).css({left:'+='+dist});
               divslist[j].css({'background-color':'yellow'});
               $('#next').removeAttr('disabled');
             })
}

function point_vis(i,color)
{
  divslist[i].css({'border-color':color,'border-width':((color=='black')? '2px':'4px')});
}

function mvpoint_vis(i,col1,j,col2)
{
  if (i!=null) divslist[i].css({'border-color':col1,'border-width':((col1=='black')? '2px':'4px')});
  if (j!=null) divslist[j].css({'border-color':col2,'border-width':((col2=='black')? '2px':'4px')});
}

var myviz = new Viz(init, Sort);
function playon() { $('#play').html('<span class="glyphicon glyphicon-play"></span>'); }
function playoff() { $('#play').html('<span class="glyphicon glyphicon-pause"></span>'); }
myviz.init_buttons($('#commentary')[0], $('#play')[0], $('#next')[0], $('#stop')[0], playon, playoff);

//});
