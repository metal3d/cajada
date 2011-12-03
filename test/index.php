<!DOCTYPE html>
<html lang="en">
<head>
    <title>Test Canvas</title>
    <script type="text/javascript" src="../src/js/cajada.js"></script>
    <script type="text/javascript" src="init.js"></script>
    <style type="">
        body {
            font-family: Sans;
            font-size: 0.85em;
            background: #AAA
        }
        body > div {
            margin: 0 auto;
            width: 700px;
            padding: 1em 0 0 0;
            background: #EFEFEF;
        }
        section {
            background: white;
            width: 640px;
            margin: 1em auto;
            padding: 5px;
            -webkit-border-radius: 0.5em;
            -webkit-box-shadow: 0 0 8px rgba(0,0,0,0.3);
            -moz-border-radius: 0.5em;
            -moz-box-shadow: 0 0 8px rgba(0,0,0,0.3);
        }
        section#explanation {
                
        }

        pre,
        section p {
            padding: 0 5px;
        }
        div.highlight {
            background: rgb(239, 239, 239);
            width: 600px;
            padding: 0.3em;
        }
<?php
echo `pygmentize -S default -f html`;
?>
    </style>
</head>
    <body>
        <div>
            <section id="explanation">
                <img src="../logo.png" />
                <article>
                <p>
                CaJaDa allows you to set object in a canvas tag and add some events as "mouse move, click, mouse over...". The library is pretty simple to use.
                </p>
                <p>
                Try to pass mouse over rounded corner shape, try to grab and move objects... Everythin is made by object programming.
                </p>
                <p>
                Take a look on the github repository : <a href="https://github.com/metal3d/cajada">https://github.com/metal3d/cajada</a> (see developement branch);
                </p>
                </article>
            </section>
            <section>
                <p>A simple example</p>
                <canvas id="board" width="650" height="450" >
                    Your browser doesn't support canvas tag, please use Firefox, Chromium, Google Chrome, Safari... to see this page working
                </canvas>
            </section>
            <section>
<p>
This is the example code to create above canvas:
</p>
<pre><code>

<?php
    echo `pygmentize -f html init.js`;
?>

</code></pre>
</section>
<section>
                <p>
                    3 Last development logs:
                    <pre>
<?php echo `git log -n3`; ?>
                    </pre>
                </p>
</section>
</div>
    </body>
</html>
