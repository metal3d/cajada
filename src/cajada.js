var cajada = (function (){

//function to merge options
function merge (defaultObject, toObject) {
    for (var attr in defaultObject) {
        if(typeof(toObject[attr])=="undefined")
            toObject[attr] = defaultObject[attr];
    }
}

//scene class
var Scene = function (options) {
        
    var canvas = null;
    var size = [];
    var ctx = null;

    try {
        if (options.canvas) {
            if (!options.canvas.tagName.toUpperCase() == "CANVAS") 
                throw( "You must give a canvas elements in options.canvas" );
            canvas = options.canvas;
            size = [canvas.width, canvas.height];
            ctx = canvas.getContext('2d');
        }
    } catch(e){
        console.log(e.message);
    }
    this.ctx = ctx;
    this.size = size;
    this.canvas = canvas;
    this.canvas._scene = this; //backreference
    this.shapes = [];
    this.canvas.mousepos = {x:null, y:null};
    this.mousepos = {};
    this.refreshing = false;


    //record mouse position...
    this.canvas.addEventListener('mousemove',function(evt){
       this._scene.mousepos ={x: evt.offsetX, y:evt.offsetY};
       this._scene.refresh();
    });

    var events = ['mousedown', 'mouseup', 'click', 'dblclick'];
    var j = 0;
    var e;
    for (j in events) {
        e = events[j];
        this.canvas.addEventListener(e, function (evt){
           //navigate shapes to fake a mouseup event on it
           for (var i=0; i<this._scene.shapes.length; i++){
                var shape = this._scene.shapes[i];
                if(shape.isMouseOver()){
                    shape._onEvent(evt.type);    
                }
           } 
        });
    }
};

//append a shape to scene
Scene.prototype.append = function (shape){
    this.shapes.push(shape);
};

//clear canvas
Scene.prototype.clear = function (){
    var ctx = this.ctx;
    ctx.moveTo(0,0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0,this.size[0], this.size[1]);
    //console.log("ctx.clearRect(0,0,"+this.size[0]+","+this.size[1]+")")
    return this;
};

//refresh canvas (redraw every shapes)
Scene.prototype.refresh = function (){
    if (this.refreshing) return this;//this prevent a very hight CPU usage...

    this.refreshing=true;
    this.clear();
    for (var i=0; i < this.shapes.length; i++) {
        this.shapes[i].draw();
    }
    this.refreshing=false;
    return this;
};
//end Scene Class


//Shapes NameSpace
var Shapes = (function (){
    //Shape interface that allows:
    // move, fill, stroke, styles...
    var shape = function () {
        this._eventListeners = [];
        this._mouse_over = false;
    };

    shape.prototype.isMouseOver = function (){
        return this._mouse_over;    
    };

    shape.prototype.init = function(c, options) {
        this.scene = c;
        this.scene.append(this);

        merge ({
            at: [0,0],
            rotation: 0.0,
            width:0,
            height:0,
            fillStyle: "#EEE",
            strokeStyle: "#000",
            lineWidth:2,
            stroke: true,
            fill: true
        }, options);
        options.rotation/=360;
        this.options = options;
        this.rotation = options.rotation;
    };
    
    //faked events...
    shape.prototype.addEventListener = function (name, f){
        this._eventListeners.push({
            name: name,
            func: f
        });
        return this;
    };

    //when a event is fired, this tries to call functions
    //defined with listeners
    shape.prototype._onEvent = function (name){
        for (var i=0; i<this._eventListeners.length; i++){
            var e = this._eventListeners[i];
            if(e.name == name) {
                e.func(this);
            }
        }     
    };

    //begin a path to draw
    shape.prototype.begin = function (){
        this.scene.ctx.strokeStyle = this.options.strokeStyle;
        this.scene.ctx.fillStyle = this.options.fillStyle;
        this.scene.ctx.lineWidth = this.options.lineWidth;
        this.scene.ctx.save();
        this.scene.ctx.translate(this.x,this.y);
        this.scene.ctx.moveTo(0, 0);
        this.scene.ctx.rotate(this.rotation);
    };

    //end path (restore context)
    shape.prototype.end = function (){

        if(this.options.fill) this.scene.ctx.fill();
        if(this.options.stroke) this.scene.ctx.stroke();
        var pos = this.scene.mousepos;

        if (this.scene.ctx.isPointInPath(pos.x,pos.y)) {
            if (!this.isMouseOver())
                this._onEvent('mouseover');
            this._mouse_over = true;
        } else {
            if (this.isMouseOver()) {
                //this.onmouseout();
                this._onEvent('mouseout');
                this._mouse_over=false;
            }
        }
        this.scene.ctx.restore();
    };
    
    shape.prototype.move = function (x,y){
        this.x+=x;
        this.y+=y;
        return this;
    };

    shape.prototype.fill = function() {
        this.scene.ctx.fill();
        return this;
    };

    shape.prototype.stroke = function() {
        this.scene.ctx.stroke();
        return this;
    };

    var Circle = function (scene, options){
    //TODO: set circle function    
    };


    //Rect shape
    Rect.prototype = new shape();
    Rect.prototype.constructor = Rect;
    function Rect (scene, options){
        this.init(scene, options);
        this.x = options.at[0];
        this.y = options.at[1];
        this.width = options.size[0];
        this.height = options.size[1];
    }

    Rect.prototype.draw = function (){
        var ctx = this.scene.ctx;
        var width = this.width;
        var height = this.height;
    
        this.begin();
        ctx.translate(-width/2, -height/2);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(width,0);
        ctx.lineTo(width,height);
        ctx.lineTo(0,height);
        ctx.closePath();
        ctx.restore();
        this.end();
        return this;
    };


    //Rounded Rect shape
    RoundedRect.prototype = new shape();
    RoundedRect.prototype.constructor = RoundedRect;
    function RoundedRect (scene, options){
        this.init(scene, options);
        merge({
            radius: 8
        }, options);

        this.x  = options.at[0];
        this.y  = options.at[1];
        this.width = options.size[0];
        this.height = options.size[1];
        this.radius = options.radius;
    }


    RoundedRect.prototype.draw = function (){
        var ctx = this.scene.ctx;
        var width = this.width;
        var height = this.height;
        var radius = this.radius;

        this.begin();
        ctx.translate(-width/2, -height/2);
        ctx.moveTo(0,0);
        
        ctx.beginPath();
        ctx.moveTo(0,radius);
        ctx.lineTo(0,height-radius);
        ctx.quadraticCurveTo(0,height,radius,height);
        ctx.lineTo(width-radius,height);
        ctx.quadraticCurveTo(width,height,width,height-radius);
        ctx.lineTo(width,radius);
        ctx.quadraticCurveTo(width,0,width-radius,0);
        ctx.lineTo(radius,0);
        ctx.quadraticCurveTo(0,0,0,radius);
        ctx.restore();
        this.end();
        return this;
    };
    
    return {
        Circle : Circle,    
        Rect   : Rect,
        RoundedRect : RoundedRect
    };
})(); //End Shapes NameSpace



//return the full Package
return {
    Scene: Scene,
    Shapes: Shapes
};

//End of anonymous call
})();

