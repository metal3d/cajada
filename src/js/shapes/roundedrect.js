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
cajada.Shapes.RoundedRect = (function (){
    /**
    * Rounded corner Rectangle shape
    */
    RoundedRect.prototype = new cajada.Shapes.Base();
    RoundedRect.prototype.constructor = RoundedRect;
    function RoundedRect (scene, options){
        if(!scene || !options) return;
        this.init(scene, options);
        cajada.merge({
            radius: 8
        }, options);

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
        this.end();
        return this;
    };
    return RoundedRect;
})();
