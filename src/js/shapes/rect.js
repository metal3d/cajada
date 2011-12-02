
cajada.Shapes.Rect = (function (){

    /**
    * Rectangle Shape
    */
    Rect.prototype = new cajada.Shapes.Base();
    Rect.prototype.constructor = Rect;
    function Rect (scene, options){
        if(!scene || !options) return;
        this.init(scene, options);

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
        this.end();
        return this;
    };

    return Rect;
})();
