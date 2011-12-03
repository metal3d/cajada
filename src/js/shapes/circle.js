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

cajada.Shapes.Circle = (function(){

   Circle.prototype = new cajada.Shapes.Base();
   Circle.prototype.constructor = Circle;
   function Circle (scene, options){
        options.size = [options.radius, options.radius];
        this.init(scene, options);
        cajada.merge({
            radius : 1
        }, options);
        this.radius = options.radius;
   }


    Circle.prototype.draw = function () {
        var ctx = this.scene.ctx;

        this.begin();
        ctx.moveTo(0,0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
        ctx.closePath();
        this.end();
        return this;
    };

    return Circle;

})();
