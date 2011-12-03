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

cajada.Shapes =  (function (){
    //Shape interface that allows:
    // move, fill, stroke, styles...
    var merge = cajada.merge;

    /**
    * index sorting function
    */
    function index_sorting(s1, s2) {
        return s2._zindex<s1._zindex;
    }

    /**
    * Shape class - Parent of every shapes
    * @scope private
    */
    var shape = function () {
    };

    /**
    * Move up/down shape on collection - that allows to set z-index simulation
    */
    shape.prototype.zindex = function (direction) {
        var index = (direction == 'up') ? 0 : 1;
        for (var i=0; i<this.scene.shapes.length; i++) {
            if (this.scene.shapes[i]._id !== this._id) {
                this.scene.shapes[i]._zindex=index;
                index++;
            }
        }
        this._zindex = (direction == 'up' ) ? index : 0;
        this.scene.shapes.sort(index_sorting);
    };

    /**
    * Set the shape to be draggable
    */
    shape.prototype.setDraggable = function (state){
        if ((typeof(state)!="undefined" && state !==true ) || state === false) {
            this._draggable=false;
            return;
        } 
        
        var addevent = false;
        if (this._draggable === null) {
            addevent=true;
            this._draggable = true;
        }
        
        if (!addevent) return;

        var _shape = this;


        var setDragStyle = function (state){
            var c = _shape.scene.getCanvas();
            var cl = c.getAttribute('class');
            var r = /\s*cajada-grab\s*/;
            if (cl===null) cl='';

            if (state && cl.search(r)<0) {
                cl = ( cl==='' ) ? "cajada-grab" : cl+" cajada-grab";
            } else if(!state) {
                cl = cl.replace(r,'');
            }
            if (cl === '') c.removeAttribute('class');
            else c.setAttribute('class', cl);
            
        };

        this.addEventListener('mousedown', function (){
            if (!_shape._draggable) return;
            _shape._mouse_origin = _shape.scene.mousepos;
            _shape._origin = [_shape.x, _shape.y];
            _shape.dragging = true;
            setDragStyle(true);
        });

        this.addEventListener('mouseover', function(){
            if (!_shape._draggable) return;
            setDragStyle(true);

        });
        var c = this.scene.getCanvas();

        c.addEventListener('mousemove', function(){
            if (!_shape._draggable) return;
            if (!_shape.dragging) return;
            _shape.x = _shape._origin[0] + c._scene.mousepos.x - _shape._mouse_origin.x;
            _shape.y = _shape._origin[1] + c._scene.mousepos.y - _shape._mouse_origin.y;
        },true);

        this.addEventListener('mouseup', function (){
            if (!_shape._draggable) return;
            _shape.dragging = false;    
            setDragStyle(true);
        });

        this.addEventListener('mouseout', function (){
            if (!_shape._draggable) return;
            setDragStyle(false);
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
        this._eventListeners = [];
        this._mouse_over = false;
        this._draggable = null;
        this._zindex = 0;
        this._custromDraw = [];
        this._id = "cajada-shape-" + Date.now() + "-" + parseInt(Math.random(Date.now())*1000,10);
        this.scene.append(this);

        if (typeof(options.shadow)!="undefined") {
            merge({
                shadow: {
                    x: 0,
                    y: 0,
                    color: "rgba(0,0,0,0.8)",
                    blur: 8
                }
                
            }, options);
        }
        else {
            options.shadow = false;
        }

        merge ({
            at: [0,0],
            rotation: 0.0,
            width:0,
            height:0,
            fillStyle: "#FFF",
            strokeStyle: "#000",
            lineWidth:2,
            stroke: true,
            fill: true
        }, options);

        options.rotation*=(Math.PI/180);
        this.options = options;
        this.rotation = options.rotation;
        this.x = options.at[0];
        this.y = options.at[1];
        this.width = options.size[0];
        this.height = options.size[1];
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
                this.scene.refresh();
            }
        }     
    };

    /**
    * Append custom draw methods
    */
    shape.prototype.addCustomDraw = function (func){
        this._custromDraw.push(func);
    };

    /**
    * Call custom draw methods
    */
    shape.prototype._customDraw = function (func){
        var f;
        for (var i=0; i < this._custromDraw.length; i++) {
            this.scene.ctx.save();
            this.scene.ctx.translate(this.x,this.y);
            this.scene.ctx.moveTo(0, 0);
            this.scene.ctx.rotate(this.rotation);
            f = this._custromDraw[i];
            f();
            this.scene.ctx.restore();
        }
    };


    /**
    * Begin a path
    */
    shape.prototype.begin = function (){
        var ctx = this.scene.getContext();

        ctx.save();
        ctx.strokeStyle = this.options.strokeStyle;
        ctx.fillStyle = this.options.fillStyle;
        ctx.lineWidth = this.options.lineWidth;
        if ( this.options.shadow !== false ) {
            ctx.shadowOffsetX = this.options.shadow.x;
            ctx.shadowOffsetY = this.options.shadow.Y;
            ctx.shadowBlur = this.options.shadow.blur;
            ctx.shadowColor = this.options.shadow.color;
        }
        ctx.translate(this.x,this.y);
        ctx.moveTo(0, 0);
        ctx.rotate(this.rotation);
    };


    /**
    * End a path, restore context etc...
    */
    shape.prototype.end = function (){


        var ctx = this.scene.getContext();
        if(this.options.stroke) ctx.stroke();
        if(this.options.fill) ctx.fill();
        ctx.shadowOffsetX = null;
        ctx.shadowOffsetY =null;
        ctx.shadowBlur = null;
        ctx.shadowColor = null;
        //now, append custom draws
        ctx.restore();
        ctx.save();
        this._customDraw();

        var pos = this.scene.mousepos;
        var evt = {}; //a faked event
        evt.target = this;
        if (ctx.isPointInPath(pos.x,pos.y) ) {
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
        ctx.restore();
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
    * Return the namespace Shape.Circle, Shape.Rect...
    * As Shapes is in cajada namespace, call with
    * cajada.Shape.XYZ
    */
    return {
        Base: shape
    };
})(); //End Shapes NameSpace

