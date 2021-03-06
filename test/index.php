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
        }
        body > div {
            display: table
        }
        section {
            display: table-cell;
            vertical-align: top
        }
        pre,
        section p {
            padding: 0 5px;
        }
<?php
echo `pygmentize -S default -f html`;
?>
    </style>
</head>
    <body>
        <div style="display: table">
            <section>
                <canvas id="board" width="650" height="450" style="border: 1px solid red">
                    Your browser doesn't support canvas tag, please use Firefox, Chromium, Google Chrome, Safari... to see this page working
                </canvas>
            </section>
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
                <p>
                    3 Last development logs:
                    <pre>
<?php echo `git log -n3`; ?>
                    </pre>
                </p>
                </article>
            </section>
        </div>
<p>
This is the example code to create above canvas:
</p>
<pre><code>

<?php
    echo `pygmentize -f html init.js`;
?>

</code></pre>
    </body>
</html>
