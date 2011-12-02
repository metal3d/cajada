

//simple getElement
function $(element) {
    return document.getElementById(element);
}


//called on load, see last line

function letsGo() {
    
    //create a scene from canvas with 'board' id
    var c = new cajada.Scene({
        canvas: $('board')
    });



    //A simple rectangle
    var r1 = new cajada.Shapes.Rect(c, {
        at : [90,30],
        size: [150,80],
        strokeStyle:"blue",
        shadow: {
            x: 4,
            y: 4,
            blur: 8,
            color: "rgba(0,0,0,0.5)"
        }
    });
    
    //a rounded rectangle
    var r2 = new cajada.Shapes.RoundedRect(c, {
        at: [120,90],
        size: [70,100],
        radius: 10,
        strokeStyle: "red",
        rotation: 90
    });

    //on rounder rectangle, add text by this custrom method
    r2.addCustomDraw(function (){
        var ctx = r2.scene.ctx;
        ctx.font="10pt Sans";
        ctx.textAlign="center";
        ctx.fillStyle="black";
        ctx.fillText('Youpi', 0, 0); // 0,0 coord because context is translate to the center of shape
    });

    //when canvas is refreshed, draw a line beetween r1 and r2
    c.addEventListener('refresh', function (){
        var ctx = c.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.moveTo(r1.x, r1.y);
        ctx.lineTo(r2.x,r2.y);
        ctx.stroke();
        ctx.restore();
    });

    //A nice view, if mouse is over r2, fill it with a
    //semi transparent green color
    r2.addEventListener('mouseover', function (){
        r2.lastFill = r2.options.fillStyle;
        r2.options.fillStyle = "rgba(0,255,0,0.9)";
        c.refresh();
    });
    r2.addEventListener('mouseout', function (){
        r2.options.fillStyle = r2.lastFill;
        c.refresh();
    });


    //change index on mouse down
    r1.addEventListener('mousedown', function (){
        r1.zindex('up');
    });

    r2.addEventListener('mousedown', function (){
        r2.zindex('up');
    });

    //set rectangles draggables
    r1.setDraggable(true);
    r2.setDraggable();



    //maybe nested
    c.refresh();

}

window.onload = letsGo;

