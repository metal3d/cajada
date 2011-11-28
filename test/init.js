function $(element) {
    return document.getElementById(element);
}

function letsGo() {
    var c = new cajada.Scene({
        canvas: $('board')
    });



    var r1 = new cajada.Shapes.Rect(c, {
        at : [90,30],
        size: [150,80],
        strokeStyle:"blue"
    });
    var r2 = new cajada.Shapes.RoundedRect(c, {
        at: [120,90],
        size: [70,100],
        radius: 10,
        strokeStyle: "red",
        rotation: 90
    });
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

    /*
    r2.addEventListener('click', function (){
        console.log('event click captured');    
    });
    */
    r2.addEventListener('mouseover', function (){
        r2.lastFill = r2.options.fillStyle;
        r2.options.fillStyle = "rgba(0,255,0,0.9)";
        c.refresh();
        c.getCanvas().style.cursor = 'move';
    });
    r2.addEventListener('mouseout', function (){
        r2.options.fillStyle = r2.lastFill;
        c.refresh();
        c.getCanvas().style.cursor = 'auto';
    });

    r1.setDraggable(true);
    r2.setDraggable();

    c.refresh();
    console.log(r2);
    //d(c,r1,0,0,0,r2);
}
   
function d (c,r1,t,X,Y,r2) {
    if (t === 0 ) {
        X = r1.x;
        Y = r1.y;
    }
    c.refresh();
    x = 80*Math.sin(t*Math.PI/2);
    y = 4*Math.sin(t*Math.PI/2);
    t += (t==1) ? -t : 0.01;
    r1.x = X+x;
    r1.y = Y+y;
    r1.rotation+=0.1;
    r2.rotation-=0.1; 
    setTimeout( function () { d(c,r1,t,X,Y,r2); }, 1000/25);
}

window.onload = letsGo;

