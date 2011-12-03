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

cajada.Shapes.Image = (function(){

   IImage.prototype = new cajada.Shapes.Base();
   IImage.prototype.constructor = IImage;
   function IImage (scene, options){
        if (typeof(options.size) == "undefined")
            options.size = [0, 0]; 
        this.init(scene, options);
        cajada.merge({
            src: null,
            resample: false,
            size: [0,0]
        }, options);
        this.loaded = false;

        this.file = new Image();
        var self = this;
        this.file.addEventListener('load', function (){
             self.loaded = true;
             self.draw();
        });
        this.file.src = options.src;
        this.src = options.src;
        this.resample = options.resample;
   }


    IImage.prototype.draw = function () {
        if (!this.loaded) return this; //no source...
        var ctx = this.scene.ctx;
        this.begin();
        ctx.beginPath();
        ctx.drawImage(this.file, 0,0);
        ctx.closePath();
        this.end();
        return this;
    };

    return IImage;

})();
