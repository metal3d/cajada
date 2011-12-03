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
            options.size = [null, null]; 
        this.init(scene, options);
        cajada.merge({
            src: null,
            resample: false,
            crop: false,
            originalSize : []
        }, options);
        this.loaded = false;

        this.file = new Image();
        var self = this;
        this.file.addEventListener('load', function (){
             self.width  = self.file.width;
             self.height = self.file.height;
             self.originalSize = [self.width, self.height];
             
             //if crop, reset size
             if (self.options.crop.length == 4) {
                    //crop is [sx, sy, swidth, sheight] so we've got final size
                    self.width = self.options.crop[2];
                    self.height = self.options.crop[3];
             }
             //crop size isn't given, we must get the final size
             if (self.options.crop.length == 2) {
                    //crop is [sx, sy]
                    self.options.crop[2] = self.width  - self.options.crop[0];
                    self.options.crop[3] = self.height - self.options.crop[1];
             }

             //resize image is needed - e.g width XOR height (one must be null) is given in options 
             if (self.options.size[0] === null && self.options.size[1] !== null) {
                if(self.options.crop) 
                    self.options.size[0] = self.options.crop[2];
                else
                    self.options.size[0] = parseInt(self.width * self.options.size[1] / self.height, 10);
                 
             }
             if (self.options.size[1] === null) {
                if(self.options.crop) 
                    self.options.size[1] = self.options.crop[3];
                else
                    self.options.size[1] = parseInt(self.height * self.options.size[0]  / self.width, 10);
                 
             }
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
        ctx.translate(-this.width/2, -this.height/2);
        ctx.beginPath();
        var size = this.options.size;
        if (this.options.crop){
            //use a crop method with size, size is set to given or founded size
            var crop = this.options.crop;
            ctx.drawImage(this.file, crop[0], crop[1], crop[2], crop[3], 0,0, size[0] , size[1] );
        } else {
            ctx.drawImage(this.file, 0,0, size[0], size[1]);
        }
        ctx.closePath();
        this.end();
        return this;
    };

    return IImage;

})();
