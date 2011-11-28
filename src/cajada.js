/*
    Cajada - Canvas Javascript Draw and Animation library

    Copyright Patrice Ferlet <metal3d@gmail.com>

    License: LGPL v3

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


/**
* Cajada NameSpace
* Working with cajada must be:
    var scene = new cajada.Scene({
        canvas : document.getElementById('canvas_element')
    });
    var rectangle = new cajada.Shapes.Rectangle(scene, options);
    scene.refreh();
* ...
*/
var cajada = (function (){

//local function to merge options
function merge (defaultObject, toObject) {
    for (var attr in defaultObject) {
        if(typeof(toObject[attr])=="undefined")
            toObject[attr] = defaultObject[attr];
    }
}

/**
* Cajada.Scene class
* Container object to handle canvas and shapes 
*/
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

    //a collection of functions to call BEFORE refreshing
    //append function with "addEventListener('refresh',func)"
    this._beforeRefresh = [];

    //record mouse position...
    this.canvas.addEventListener('mousemove',function(evt){
        this._scene.mousepos ={x: evt.offsetX, y:evt.offsetY};
        //a refresh is needed - some event may be used to change colors, positions...
        this._scene.refresh(); 
    });

    //events to handle on shapes
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
                    shape._onEvent(evt);    
                }
           } 
        });
    }
};

/**
* Add Event on the scene
* only "refresh" is managed at this time
*/
Scene.prototype.addEventListener = function (name, func){
    if (name=="refresh") {
        this._beforeRefresh.push(func);
    }
};

/**
* Return the current canvas for this scene
*/
Scene.prototype.getCanvas = function() {
    return this.canvas;
};


/**
* Append a Shape object to the scene
*/
Scene.prototype.append = function (shape){
    this.shapes.push(shape);
};

/**
* Clear the canvas
*/
Scene.prototype.clear = function (){
    var ctx = this.ctx;
    ctx.moveTo(0,0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0,this.size[0], this.size[1]);
    return this;
};

/**
* Refresh the canvas, that means: redraw everything
*/
Scene.prototype.refresh = function (){
    if (this.refreshing) return this;//this prevent a very hight CPU usage...


    this.refreshing=true;
    this.clear();
    //call function from eventListeners
    for(var i=0; i<this._beforeRefresh.length; i++) {
        var func = this._beforeRefresh[i];
        func();
    }
    for (i=0; i < this.shapes.length; i++) {
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


    /**
    * Shape class - Parent of every shapes
    * @scope private
    */
    var shape = function () {
        this._eventListeners = [];
        this._mouse_over = false;
        this._draggable = null;
    };

    /**
    * Set the shape to be draggable
    */
    shape.prototype.setDraggable = function (state){
        if (typeof(state)!="undefined" && state === false) {
            this._draggable=false;
            return;
        } 
        
        var addevent = false;
        if (this._draggable === null) addevent=true;
        this._draggable = true;
        
        if (!addevent) return;

        var _shape = this;

        this.addEventListener('mousedown', function (){
            if (!_shape._draggable) return;
            _shape._mouse_origin = _shape.scene.mousepos;
            _shape._origin = [_shape.x, _shape.y];
            _shape.dragging = true;    
        });

        var c = this.scene.getCanvas();

        c.addEventListener('mousemove', function(){
            if (!_shape._draggable) return;
            if (!_shape.dragging) return;
            _shape.x = _shape._origin[0] + c._scene.mousepos.x - _shape._mouse_origin.x;
            _shape.y = _shape._origin[1] + c._scene.mousepos.y - _shape._mouse_origin.y;
            c._scene.refresh();
        });

        this.addEventListener('mouseup', function (){
            if (!_shape._draggable) return;
            _shape.dragging = false;    
        });
    };

    /**
    * Return true if mouse is over the shape
    */
    shape.prototype.isMouseOver = function (){
        return this._mouse_over;    
    };

    /**
    * Shape constructor
    * @param scene
    * @param options
    */
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
    
    /**
    * Fake an event
    */
    shape.prototype.addEventListener = function (name, f){
        this._eventListeners.push({
            name: name,
            func: f
        });
        return this;
    };

    /**
    * Called when an event is grabbed
    * when a event is fired, this tries to call functions
    * defined with listeners
    */
    shape.prototype._onEvent = function (evt){
        var name = evt.type;
        for (var i=0; i<this._eventListeners.length; i++){
            var e = this._eventListeners[i];
            if(e.name == name) {
                e.func(this);
            }
        }     
    };

    /**
    * Begin a path
    */
    shape.prototype.begin = function (){
        this.scene.ctx.strokeStyle = this.options.strokeStyle;
        this.scene.ctx.fillStyle = this.options.fillStyle;
        this.scene.ctx.lineWidth = this.options.lineWidth;
        this.scene.ctx.save();
        this.scene.ctx.translate(this.x,this.y);
        this.scene.ctx.moveTo(0, 0);
        this.scene.ctx.rotate(this.rotation);
    };


    /**
    * End a path, restore context etc...
    */
    shape.prototype.end = function (){

        if(this.options.fill) this.scene.ctx.fill();
        if(this.options.stroke) this.scene.ctx.stroke();
        var pos = this.scene.mousepos;
        var evt = {}; //a faked event
        evt.target = this;
        if (this.scene.ctx.isPointInPath(pos.x,pos.y)) {
            if (!this.isMouseOver()){
                evt.x = pos.x;
                evt.y = pos.y;
                evt.type="mouseover";
                this._mouse_over = true;
                this._onEvent(evt);
            }
        } else {
            if (this.isMouseOver()) {
                evt.type="mouseout";
                this._mouse_over=false;
                this._onEvent(evt);
            }
        }
        this.scene.ctx.restore();
    };
    
    /**
    * Move a shape by offset
    * param: xoffset
    * param: yoffset
    */
    shape.prototype.move = function (x,y){
        this.x+=x;
        this.y+=y;
        return this;
    };

    /**
    * Fill shape with options.fillStyle
    */
    shape.prototype.fill = function() {
        this.scene.ctx.fill();
        return this;
    };

    /**
    * Stroke a path with options.strokeStyle
    */
    shape.prototype.stroke = function() {
        this.scene.ctx.stroke();
        return this;
    };

    /**
    * Circle Shape
    */
    var Circle = function (scene, options){
    //TODO: set circle function    
    };


    /**
    * Rectangle Shape
    */
    Rect.prototype = new shape();
    Rect.prototype.constructor = Rect;
    function Rect (scene, options){
        this.init(scene, options);
        this.x = options.at[0];
        this.y = options.at[1];
        this.width = options.size[0];
        this.height = options.size[1];
    }

    /**
    * Draw the rectangle
    */
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


    /**
    * Rounded corner Rectangle shape
    */
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

    /**
    * Draw Rounded Rectangle shape
    */
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
    

    /**
    * Return the namespace Shape.Circle, Shape.Rect...
    * As Shapes is in cajada namespace, call with
    * cajada.Shape.XYZ
    */
    return {
        Circle : Circle,    
        Rect   : Rect,
        RoundedRect : RoundedRect
    };
})(); //End Shapes NameSpace



/**
* Return cajada namespace cajada.Scene, cajada.Shapes...
*/
return {
    Scene: Scene,
    Shapes: Shapes
};

//End of anonymous call
})();

