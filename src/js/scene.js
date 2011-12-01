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

var cajada = cajada || {};

/**
* Cajada.Scene class
* Container object to handle canvas and shapes 
*/
cajada.Scene =  function (options) {
        
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
        var offset = {};
        if (typeof(evt.offsetX) != "undefined") {
            offset = {
                x : evt.offsetX, y: evt.offsetY
            };
        } else {
            offset = {
                x: evt.pageX - this.offsetLeft,
                y: evt.pageY - this.offsetTop
            };
        }

        this._scene.mousepos =offset;
        //a refresh is needed - some event may be used to change colors, positions...
        this._scene.refresh(); 
    });

    //events to handle on shapes
    var events = ['mousedown', 'mouseup', 'click', 'dblclick'];
    for (var j=0; j<events.length; j++) {
        var e = events[j];
        this.canvas.addEventListener(e, function (evt){
           //navigate shapes to fake an event on it
           var upperShape = null;
           for (var i=0; i<this._scene.shapes.length; i++){
                var shape = this._scene.shapes[i];
                if(shape.isMouseOver()){
                    upperShape = shape;
                }
           }
           if (upperShape !== null ) {
                upperShape._onEvent(evt);    
                evt.stopPropagation();
            }
        });
    }

};


/**
* Add Event on the scene
* only "refresh" is managed at this time
*/
cajada.Scene.prototype.addEventListener = function (name, func){
    if (name=="refresh") {
        this._beforeRefresh.push(func);
    }
};

/**
* Return the current canvas for this scene
*/
cajada.Scene.prototype.getCanvas = function() {
    return this.canvas;
};

/**
* Return the current canvas for this scene
*/
cajada.Scene.prototype.getContext = function() {
    return this.ctx;
};

/**
* Append a Shape object to the scene
*/
cajada.Scene.prototype.append = function (shape){
    this.shapes.push(shape);
};

/**
* Clear the canvas
*/
cajada.Scene.prototype.clear = function (){
    var ctx = this.ctx;
    ctx.moveTo(0,0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0,this.size[0], this.size[1]);
    return this;
};

/**
* Refresh the canvas, that means: redraw everything
*/
cajada.Scene.prototype.refresh = function (){
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


