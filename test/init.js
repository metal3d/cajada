//Custom shape, extends a shape
/*
(function (){
    myShape.prototype = new cajada.Shapes.Base();
    myShape.prototype.constructor = function (c, options){
        cajada.Shapes.Rect(c, options);
    };

    myShape.prototype.draw = function () {
        cajada.Shapes.RoundRect.draw();
        this.begin();
        this.scene.ctx.fillStyle = "bkack";
        this.scene.ctx.filleText(this.x, this.y);
        this.end();
        return this;
    };

    var m = new myShape(c, {
        at: [150,200]
    });
    console.log(myShape);
})();
*/
  
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

    r2.addCustomDraw(function (){
        var ctx = r2.scene.ctx;
        ctx.font="10pt Sans";
        ctx.textAlign="center";
        ctx.fillStyle="black";
        ctx.fillText('Youpi', 0, 0);
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
    });
    r2.addEventListener('mouseout', function (){
        r2.options.fillStyle = r2.lastFill;
        c.refresh();
    });


    r1.addEventListener('mousedown', function (){
        r1.zindex('up');
    });

    r2.addEventListener('mousedown', function (){
        r2.zindex('up');
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

