
var p = [5,8,3,1,6]; //default array
$('#arraysize').attr({placeholder: p.length+''});

var textlist = [];
function inputboxes()
{
  $('#sizeSubmit').removeClass('btn-primary');
  textlist = [];
  $("#getboxes").empty();
  var x = $('#arraysize').val() || p.length;
  for(var i=0;i<x;i++)
  {  
    var newbox = $('<input placeholder="'+(p[i]|0)+'"/>').attr({ type: 'text', name:'text', value:'', class:'inelement'});
    $("#getboxes").append(newbox);
    textlist.push(newbox);
  }
  $('#autofillArray').show();
  $('#animation').show();
}

function swap(x, i, j) { var temp = x[i]; x[i] = x[j]; x[j] = temp; }

function init() {
  list = [];
  divslist = [];
  var arraydiv = $('#result');
  arraydiv.empty();
  for (var i=0; i < textlist.length; i++) {
    var newdiv=$('<div>').attr({"class":"box"});
    var textvalue = parseInt(textlist[i].val()) | p[i];
    list.push(textvalue);
    arraydiv.append(newdiv);
    newdiv.html(textvalue);
    divslist.push(newdiv);
  }
  return [0,list.length-1]; //arguments to quicksort
}

function* quicksort(l, u){
  if (l > u) { yield ['Nothing to sort.']; return; }
  else if (l > u) { yield ['Nothing to sort.', 3000, element_vis, [l,'lightyellow']]; return; }
  yield ['Sorting from index '+l+' to '+u, 3000, range_vis, [l,u,'lightcyan']];
  var m = l;  yield ['Pivot position = '+l, point_vis, [l,'red']];
  for (var i = l+1; i <= u; i++) {
    if (list[i] < list[l]) {
      yield ['i = '+i+'; less than pivot', 3000, mvpoint_vis, [(i==l+1)?null:i-1, 'black', i, 'green']];
      m++;
      if (m != i) {
        swap(list, m, i);
        yield ['Moving to small elements area.', before_swap_vis, [m,i]];
        yield ['Moving to small elements area.', swap_vis, [m,i]];
      }
      yield ['Re-marking small elements area.', 3000, mvpoint_vis, [m-1, (m-1==l)?'red':'black', m, 'blue']];
    }
    else
      yield ['i = '+i, mvpoint_vis, [(i==l+1)?null:i-1, 'black', i, 'green']];
  }
  yield ['Finished iterating', point_vis, [u,(u==l)?'red':(u==m)?'blue':'black']];
  if (l != m) {
    yield ['Finally, move pivot to correct position.', 4000, before_swap_vis, [l,m]];
    swap(list, l, m);
    yield ['Moving pivot to correct position.', swap_vis, [l,m], mvpoint_vis, [l,'black',m,'red']];
  }
  yield ['Pivot in sorted position', element_vis, [m,'lightyellow'], point_vis, [m,'black']];
  yield ['Now recursively sort partitions, if any.', range_vis, [l,m-1,'yellow'], range_vis, [m+1,u,'yellow']];
  for (var n of quicksort(l, m-1)) yield n;
  for (var n of quicksort(m+1, u)) yield n;
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
               divslist[i].css({'background-color':'lightcyan'});
             })
  divslist[j].animate({top:'+=50'}, 500)
             .animate({top:'-=50',left:'-='+dist}, 500, function() {
               divslist[i].html(list[i]).css({left:'-='+dist});
               divslist[j].html(list[j]).css({left:'+='+dist});
               divslist[j].css({'background-color':'lightcyan'});
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

function element_vis(i,color)
{
  divslist[i].css({'background-color':color});
}

function range_vis(i,j,color)
{
  for (var k=i; k<=j; k++) divslist[k].css({'background-color':color});
}

var myviz = new Viz(init, quicksort);
function playon() { $('#play').html('<span class="glyphicon glyphicon-play">Play</span>'); }
function playoff() { $('#play').html('<span class="glyphicon glyphicon-pause">Pause</span>'); }
myviz.init_buttons($('#commentary')[0], $('#play')[0], $('#next')[0], $('#stop')[0], playon, playoff);
