

var MouseDownX = null;
var MouseDownY = null;
var MouseUpX = null;
var MouseUpY = null;
var allCanvasElements = new Array();
var undoElement = null;
var strokeColorSameAsFillColor = true;

function onCanvasMouseDown(event)
{
	var objectPosition = $('#canvas').offset();	
	var cursor = getCursorPosition(event);
	MouseDownX = Math.min(Math.max(cursor.x - objectPosition.left - 2,0), objectPosition.left + $('#canvas').width() - 4);
	MouseDownY = Math.min(Math.max(cursor.y - objectPosition.top - 2,0), objectPosition.top + $('#canvas').height() - 4);

	MouseUpX = null;
	MouseUpY = null;
	$('#potentialCanvasBox').css('display', "block")
}

function onDocumentMouseUp(event){	
	clearPotentialCanvasBox();

	if(MouseDownX != null && MouseDownY != null)
	{
		var objectPosition = $('#canvas').offset();	
		
		var cursor = getCursorPosition(event);
		x2 = Math.min(Math.max(cursor.x - objectPosition.left - 2,0),$('#canvas').width()-3);
		y2 = Math.min(Math.max(cursor.y - objectPosition.top - 2,0),$('#canvas').height()-3);
		MouseUpX = x2;
		MouseUpY = y2;

		if(MouseUpX != null && MouseUpY != null)
		{
			var thisBox = new Object;
			thisBox.fromX = MouseDownX;
			thisBox.fromY = MouseDownY;
			thisBox.toX = MouseUpX;
			thisBox.toY = MouseUpY;
			thisBox.fillColor = $('#currentFillColor').css('backgroundColor');
			if(strokeColorSameAsFillColor)
				thisBox.strokeColor = thisBox.fillColor;
			else
				thisBox.strokeColor = $('#currentStrokeColor').css('backgroundColor');
			allCanvasElements.push(thisBox);
			undoElement = null;
			redrawBoxes();
		}
	}

	MouseDownX = null;
	MouseDownY = null;
	MouseUpX = null;
	MouseUpY = null;

}

function onDocumentMouseMove(event)
{
	if(MouseDownX != null && MouseDownY != null)
	{
		var x1 = MouseDownX;
		var y1 = MouseDownY;
		
		var objectPosition = $('#canvas').offset();
		
		var cursor = getCursorPosition(event);
		x2 = Math.min(Math.max(cursor.x - objectPosition.left - 2,0), $('#canvas').width()-3);
		y2 = Math.min(Math.max(cursor.y - objectPosition.top - 2,0), $('#canvas').height()-3);
		
		if(x2 != null && y2 != null)
		{
			if (x1>x2) 
			{ 
				swap=x1; 
				x1=x2; 
				x2=swap;
			} 
			if (y1>y2) 
			{ 
				swap=y1; 
				y1=y2; 
				y2=swap;
			} 

			var thisBox = $('#potentialCanvasBox');
			if(thisBox.length == 0)
			{
				thisBox = $('<div id="potentialCanvasBox"></div>)');
				$('#canvas').append(thisBox);
			}

			thisBox.css('display', "block");
			thisBox.css('left', x1 + "px");
			thisBox.css('top', y1 + "px");
			thisBox.css('width', Math.max((x2 - x1 - 1),0) + "px");
			thisBox.css('height', Math.max((y2 - y1 - 1),0) + "px");
		}
	}
}

function drawVectorCoordinates()
{
	var canvas = $('#stats');
	var coords = "<font face=\"courier\">";
	for(var counter = 0; counter < allCanvasElements.length;counter++)
	{
		var thisVector = allCanvasElements[counter];
		if(thisVector.fromX != null && thisVector.fromY != null)
			coords = coords + thisVector.fromX + "," + thisVector.fromY;
		if(thisVector.toX != null && thisVector.toY != null)
			coords = coords + " to " + thisVector.toX + "," + thisVector.toY;
	coords = coords + "<br />";
	}
	coords = coords + "</font>";
	canvas.innerHTML = coords;

}
function redrawBoxes()
{
	var canvas = $('#canvas');
	canvas.html("");
	for(var counter = 0; counter < allCanvasElements.length;counter++)
	{
		var thisBox = allCanvasElements[counter];
		if(thisBox.fromX != null && thisBox.fromY != null)
			if(thisBox.toX != null && thisBox.toY != null)
				if(thisBox.fillColor != null)
					drawBox(canvas,thisBox.fromX, thisBox.fromY, thisBox.toX, thisBox.toY, thisBox.fillColor, thisBox.strokeColor);
	}
}

function clearPotentialCanvasBox()
{
	$('#potentialCanvasBox').css('display', "none");
}
function drawPixel(parent, x, y)
{
	parent.innerHTML = parent.innerHTML + "<div class=\"element_pixel\" style=\"top:" + y + "px;left:" + x + "px\"></div>";
}

function drawBox(parent, x1, y1, x2, y2, fillColor, strokeColor)
{
	if (x1>x2) 
		{ 
			swap=x1; 
			x1=x2; 
			x2=swap; 
		} 
	if (y1>y2) 
		{ 
			swap=y1; 
			y1=y2; 
			y2=swap;
		} 

	parent.append($("<div class=\"element_box\" style=\"top:" + y1 + "px;left:" + x1 + "px;width:" + (x2 - x1 - 1) + "px;height:" + (y2 - y1 - 1) + "px;background-color:" + fillColor + ";border: 1px solid " + strokeColor + "\"></div>"));
}
function switchFillColor(newColorPaletteCell)
{
	$('#currentFillColor').css('backgroundColor', newColorPaletteCell.style.backgroundColor);
	if(strokeColorSameAsFillColor) {
		$('#currentStrokeColor').css('backgroundColor', newColorPaletteCell.style.backgroundColor);
	}

}

function switchStrokeColor(newColorPaletteCell)
{
	$('#currentStrokeColor').css('backgroundColor', newColorPaletteCell.style.backgroundColor);
	$('#currentStrokeColor').innerHTML = "&nbsp;";
	strokeColorSameAsFillColor = false;
}

function switchStrokeColorSameAsFillColor()
{
	$('#currentStrokeColor').css('backgroundColor', $('#currentFillColor').css('backgroundColor'));
	$('#currentStrokeColor').html("Same as fill color");
	strokeColorSameAsFillColor = true;
}

function undoLastElement()
{
	if(undoElement == null)
		undoElement = allCanvasElements.pop();
	else
	{
		allCanvasElements.push(undoElement);
		undoElement = null;
	}

	redrawBoxes();
	
}

function saveToCookie()
{
	var myCookieString = allCanvasElements.toJSONString();
	createCookie('drawing',myCookieString,7);
}
function loadFromCookie()
{
	var myCookieString = readCookie('drawing');
	if(myCookieString != null)
	{
		allCanvasElements = myCookieString.parseJSON();
		redrawBoxes();
	}
}

function clearCanvasElements()
{
	allCanvasElements = [];
	redrawBoxes();
}
function PaintInit()
{
	$('body').keypress(function(event)
		{
			var key = (event.which) ? event.which - 32 : event.keyCode;
			if(key == 90) undoLastElement(); 
			if(key == 83) saveToCookie(); 
			if(key == 76) loadFromCookie(); 
			if(key == 82) clearCanvasElements();
			console.log(key); 
		}
	);

	$('body').mousemove(onDocumentMouseMove);
	$('#canvas').mousedown(onCanvasMouseDown);	
	$('body').mouseup(onDocumentMouseUp);	

	switchStrokeColorSameAsFillColor();
}
/* Functions */
function getCursorPosition(e) {
    e = e || window.event;
    var cursor = {x:0, y:0};
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    } 
    else {
        var de = document.documentElement;
        var b = document.body;
        cursor.x = e.clientX + 
            (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY + 
            (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    return cursor;
}

$('document').ready(function(){
	PaintInit();
});