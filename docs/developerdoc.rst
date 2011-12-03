==================
Developing CaJaDa
==================

This document is made for developes who want to help CaJaDa development. Here you will get concepts, tools to use and rules to be easilly integrated into project.

Fork is the way
---------------

Git is a powerfull development tool that uses forks and branches. The better way to request path is to fork the project on GitHub and use "pull request" system. It's important to use "development" branch to purpose some patches and "feature-name" branch for new features. A feature branch should be named with the name to be nicelly undestood by other. For example a branch that implement animation should be named "feature-animation" or "animation-feature".

We ask to respect this way to pull request to be easy to merge.

Tools to develop
----------------

I'm a Vim user. You do not have to follow my path, but vim is the ideal tool to code properly.

Every files *must* pass "jsl" with no warning. I have set this "ftplugin" to put into ~/.vim/ftplugin/javascript.vim:

::
    
    "save javascript then jslint code with jsl command
    
    au! BufWriteCmd *.js call JSLint()
    setl makeprg=jsl\ -nofilelisting\ -nologo\ -nocontext\ -nosummary\ -process\ %
    setl errorformat=%f(%l):\ %m

    function! JSLint()
        w
        silent make
        TlistClose
        cw
        Tlist
        TlistUpdate
    endfunction

If you don't use "Tlist" plugin, remove lines that call TlistXXX. This will open an error window if something is wrong.

Other tools can be used, but I will push your code only if "jsl" is ok. To install "jsl" on Fedora:

::
    
    su -c "yum install jsl"

This tool is needed for my Vim plugin. But you can invoke script like this:

::
   
   jsl path/to/your/script(s)

Path can be a file or directory.

Implementing a Shape
--------------------

For now, I don't find a nice way to extends an existing shape. You should extend cajada.Shapes.Base.

Example, create a shape named "MyShape". 

- create a file into src/js/shapes/myshape.js
- append 'shapes/myshape' into src/js/shapes.js inside the "imports" list
- develop myshape.js

::

   cajada.Shapes.MyShape = (function(){

        //extends Base Shape and set constructor
        MyShape.prototype = new cajada.Shapes.Base();
        MyShape.prototype.constructor = MyShape;

        //Constructor
        function MyShape (scene, options){
            this.init(scene, options);
            cajada.merge({
                //here, you can merge some options
            }, options);
        }


        MyShape.prototype.draw = function () {
            var ctx = this.scene.ctx;

            this.begin();
            //here, draw shape with ctx.CanvasMethods...
            this.end(); //should be called here
            return this; //return object
        };

        return MyShape; //the class to set to cajada.Shapes.MyShape
        
    })();


This is the "closure" implementation that is prefered to others. I know that performances are worst that others, but this is the more secure way to implement a class without overload globals vars.


License to set
--------------

CaJaDa is LGPL v3 licensed. Please, accept to code on this license and use the same header as mine (you can add your name on mine if you modified my code, set yours on your own code, dont add mine - I will add my name if I modify your code). LGPL v3 is probably the better choice for me to protect our development and let other to use it without restriction. If you want discuss this, I'm open to speak about.

If you're (as myself) a vim user, you can append header at top of your file whith this command:

::
   
   :0r docs/header.template

This will read docs/header.template and append it at line "0"
