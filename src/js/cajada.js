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
(function (){

    /**
     * Load needed js scripts
     */
    function importJS(imports, i){
        var jsNode = document.createElement('script');
        jsNode.type="text/javascript";
        jsNode.src=jspath + imports[i]+".js" ;
        head.appendChild(jsNode);
        if (i >= imports.length -1 ) return;
        i++;

        //this is required to have last js namespace overloaded
        jsNode.onload = function() {
            importJS(imports,i);  
        };
    }

    var head = document.getElementsByTagName("head")[0];       

    /** Import assets **/
    var scripts = document.getElementsByTagName("script");
    src = scripts[scripts.length-1].src;
    var path = src.split('/');
    delete (path[path.length-1]);
    path = path.join('/').replace(/\/+$/,'/');
    path = (path[path.length - 1] !== '/' ) ? path+'/' : path;

    var jspath = path;
    var imports = ['namespace', 'scene', 'shapes','shapes/rect','shapes/roundedrect', 'shapes/circle'];
    //import js files
    importJS(imports, 0);

    //now CSS
    //jump one directory up
    path = path+"../";

    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.href = path+'asset/cajada.css';
    cssNode.media = 'screen';
    head.appendChild(cssNode);

})();
