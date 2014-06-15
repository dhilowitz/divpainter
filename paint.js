var MouseDownX = null;
var MouseDownY = null;
var MouseUpX = null;
var MouseUpY = null;
var allCanvasElements = new Array();
var undoElement = null;
var strokeColorSameAsFillColor = true;

function onCanvasMouseDown(event)
{
	var objectDimensions = Element.getDimensions($('canvas'));
	var objectPosition = Position.cumulativeOffset($('canvas'));	
	var cursor = getCursorPosition(event);
	MouseDownX = Math.min(Math.max(cursor.x - objectPosition[0] - 2,0), objectPosition[0] + objectDimensions.width - 4);
	MouseDownY = Math.min(Math.max(cursor.y - objectPosition[1] - 2,0), objectPosition[1] + objectDimensions.height - 4);

	MouseUpX = null;
	MouseUpY = null;
}

function onDocumentMouseUp(event){	
	clearPotentialCanvasBox();

	if(MouseDownX != null && MouseDownY != null)
	{
		var objectPosition = Position.cumulativeOffset($('canvas'));
		var objectDimensions = Element.getDimensions($('canvas'));
		var cursor = getCursorPosition(event);
		x2 = Math.min(Math.max(cursor.x - objectPosition[0] - 2,0),objectDimensions.width-3);
		y2 = Math.min(Math.max(cursor.y - objectPosition[1] - 2,0),objectDimensions.height-3);
		MouseUpX = x2;
		MouseUpY = y2;

		if(MouseUpX != null && MouseUpY != null)
		{
			var thisBox = new Object;
			thisBox.fromX = MouseDownX;
			thisBox.fromY = MouseDownY;
			thisBox.toX = MouseUpX;
			thisBox.toY = MouseUpY;
			thisBox.fillColor = $('currentFillColor').style.backgroundColor;
			if(strokeColorSameAsFillColor)
				thisBox.strokeColor = thisBox.fillColor;
			else
				thisBox.strokeColor = $('currentStrokeColor').style.backgroundColor;
			allCanvasElements.push(thisBox);
			undoElement = null;
			drawBoxes();
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
		
		var objectPosition = Position.cumulativeOffset($('canvas'));
		var objectDimensions = Element.getDimensions($('canvas'));
		var cursor = getCursorPosition(event);
		x2 = Math.min(Math.max(cursor.x - objectPosition[0] - 2,0),objectDimensions.width-3);
		y2 = Math.min(Math.max(cursor.y - objectPosition[1] - 2,0),objectDimensions.height-3);
		
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

			var thisBox = $('potentialCanvasBox');
			if(thisBox == null)
			{
				thisBox = document.createElement('div');
				thisBox.id = 'potentialCanvasBox';
				$('canvas').appendChild(thisBox);
			}

			thisBox.style.display = "block";
			thisBox.style.left = x1 + "px";
			thisBox.style.top = y1 + "px";
			thisBox.style.width = Math.max((x2 - x1 - 1),0) + "px";
			thisBox.style.height = Math.max((y2 - y1 - 1),0) + "px";
		}
	}
}

function drawVectorCoordinates()
{
	var canvas = $('stats');
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
function drawBoxes()
{
	var canvas = $('canvas');
	clearCanvas(canvas);
	for(var counter = 0; counter < allCanvasElements.length;counter++)
	{
		var thisBox = allCanvasElements[counter];
		if(thisBox.fromX != null && thisBox.fromY != null)
			if(thisBox.toX != null && thisBox.toY != null)
				if(thisBox.fillColor != null)
					drawBox(canvas,thisBox.fromX, thisBox.fromY, thisBox.toX, thisBox.toY, thisBox.fillColor, thisBox.strokeColor);
	}
}
function clearCanvas(parent)
{
	parent.innerHTML = "";
}
function clearPotentialCanvasBox()
{
	var thisBox = $('potentialCanvasBox');
	if(thisBox != null)
	{
		thisBox.style.display = "none";
	}
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

	parent.innerHTML = parent.innerHTML + "<div class=\"element_box\" style=\"top:" + y1 + "px;left:" + x1 + "px;width:" + (x2 - x1 - 1) + "px;height:" + (y2 - y1 - 1) + "px;background-color:" + fillColor + ";border: 1px solid " + strokeColor + "\"></div>";
}
function switchFillColor(newColorPaletteCell)
{
	$('currentFillColor').style.backgroundColor = newColorPaletteCell.style.backgroundColor;
	if(strokeColorSameAsFillColor)
		$('currentStrokeColor').style.backgroundColor = newColorPaletteCell.style.backgroundColor;

}

function switchStrokeColor(newColorPaletteCell)
{
	$('currentStrokeColor').style.backgroundColor = newColorPaletteCell.style.backgroundColor;
	$('currentStrokeColor').innerHTML = "&nbsp;";
	strokeColorSameAsFillColor = false;
}

function switchStrokeColorSameAsFillColor()
{
	$('currentStrokeColor').style.backgroundColor = $('currentFillColor').style.backgroundColor;
	$('currentStrokeColor').innerHTML = "Same as fill color";
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

	drawBoxes();
	
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
		drawBoxes();
	}
}

function clearCanvasElements()
{
	allCanvasElements.clear();
	drawBoxes();
}
function PaintInit()
{

	Event.observe(document, 'keypress', function(event){
		var key = (event.which) ? event.which - 32 : event.keyCode;
		if(key == 90) undoLastElement(); 
		if(key == 83) saveToCookie(); 
		if(key == 76) loadFromCookie(); 
		if(key == 82) clearCanvasElements();
		//alert(key); 
		});		
	Event.observe(document, 'mousemove', onDocumentMouseMove);
	Event.observe($('canvas'), 'mousedown', onCanvasMouseDown);
//	Event.observe($('canvas'), 'mouseup', onCanvasMouseUp);

	Event.observe(document,'mouseup', onDocumentMouseUp);
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