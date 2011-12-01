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

    var inherit = function(Base,func){
        return (function (){
            func.prototype = new Base();
            func.prototype.constructor = func;
            return func;
        })();
    };

    /**
    * Return cajada namespace cajada.Scene, cajada.Shapes...
    */
    return {
        merge: merge,
        Extends: inherit
    };

//End of anonymous call
})();

