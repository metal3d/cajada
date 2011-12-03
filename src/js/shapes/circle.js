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
