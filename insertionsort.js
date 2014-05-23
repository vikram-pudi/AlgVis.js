
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
}

function* Sort() {
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