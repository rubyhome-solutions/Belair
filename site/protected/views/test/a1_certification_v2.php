<?php
\Yii::app()->getClientScript()->registerScriptFile('https://cdn.rawgit.com/google/code-prettify/master/loader/prettify.js', \CClientScript::POS_END);
\Yii::app()->getClientScript()->registerCssFile('https://cdn.rawgit.com/google/code-prettify/master/styles/sunburst.css');
?>
<h2>Amadeus certification</h2>
<pre>WSDL Build Key:
1F8B0800000000000000258DC10AC2301005EFFD8A3D2AD2B249A187BDB52A41A82054C879B17B0834694882E0DF1B14DE6960E6190992B8B83D40715E72611F0934AAA145DD2A042B6B90BCF2077020ADA8EFC1DC9F2744426CEC7299C1FC137B82B7A45C4B04AAC30E9BF3E62400C7B8B9D7EF8260928D5D82C3749D8FD51E1F10D84B15C6E5662BACFB020B6F476A92000000
</pre>
<table class="table table-hover table-bordered" style="width: auto;margin-left: 10%;">
    <tr>
        <th>Live test</th>
        <th>Workflow</th>
    </tr>
    <tr>
        <td>
            <fieldset class="text-center" style="border: 1pt gray solid;border-radius: 10px;padding: 10px;margin-right: 20px;margin-top: 45%">
                <label for="pnr" class="" style="margin-top: 5px">PNR identification</label>
                <input type="text" value="25P4YT" maxlength="6" id="pnr" class="input-small text-center" name="pnr" />
                <button style="margin-left: 20px; margin-bottom: 10px;" class="btn btn-warning" onclick="execute('miniRule');
                        $(this).blur();">Execute</button>
            </fieldset>
        </td>
        <td><img src="/img/a1/A1_MiniRule_GetFromPricingRec.jpg" /></td>
    </tr>
    <tr>
        <td>
            <fieldset class="pull-left text-center" style="border: 1pt gray solid;border-radius: 10px;padding: 10px;margin-right: 20px; margin-top: 35%">
                <label for="source" class="" style="margin-top: 5px">Source OID:&nbsp;&nbsp;&nbsp;</label>
                <select name="source" id="source" style="width: 140px;">
                    <option value="46" selected>DELVS318W</option>
                    <option value="47">DELWI2155</option>
                </select>
            </fieldset>
            <fieldset class="text-center" style="border: 1pt gray solid;border-radius: 10px;padding: 10px;margin-right: 20px;margin-top: 35%">
                <label for="destination" class="" style="margin-top: 5px">Destination OID:&nbsp;&nbsp;&nbsp;</label>
                <select name="destination" id="destination" style="width: 140px;">
                    <option value="46">DELVS318W</option>
                    <option value="47" selected>DELWI2155</option>
                </select>
            </fieldset>
            <fieldset class="text-center" style="border: 1pt gray solid;border-radius: 10px;padding: 10px;margin-right: 20px;margin-top: 20px;">
                <label for="pnr2" class="" style="margin-top: 5px">PNR id:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Queue No:</label>
                <input type="text" value="25P4YT" maxlength="6" id="pnr2" class="input-small text-center" name="pnr2" />
                <input type="text" value="0" maxlength="2" id="queueNum" class="input-mini text-center" name="queueNum" style="margin-left: 20px;"/>
            </fieldset>
            <button style="margin-left: 35%; margin-top: 20px;" class="btn btn-warning" onclick="execute('placePNR');
                    $(this).blur();">Execute</button>
        </td>
        <td><img src="/img/a1/A1_Queue_PlacePNR.jpg" /></td>
    </tr>
    <tr>
        <td>
            <fieldset class="pull-left text-center" style="border: 1pt gray solid;border-radius: 10px;padding: 10px;margin-right: 20px; margin-top: 35%">
                <label for="source2" class="" style="margin-top: 5px">Office ID:&nbsp;&nbsp;&nbsp;</label>
                <select name="source2" id="source2" style="width: 140px;">
                    <option value="46" selected>DELVS318W</option>
                    <option value="47">DELWI2155</option>
                </select>
            </fieldset>
            <fieldset class="text-center" style="border: 1pt gray solid;border-radius: 10px;padding: 10px;margin-right: 20px;margin-top: 35%">
                <label for="queueNum2" class="" style="margin-top: 5px">Queue Number:</label>
                <select name="queueNum2" id="queueNum2" style="width: 60px;">
                    <option value="0" selected>0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </fieldset>
            <button style="margin-left: 35%; margin-top: 20px;" class="btn btn-warning" onclick="execute('queueList');
                    $(this).blur();">Execute</button>
        </td>
        <td><img src="/img/a1/A1_Queue_List.jpg" /></td>
    </tr>
</table>
<button style="margin-bottom: 10px;" class="btn btn-primary" onclick="$('#log').toggle();
        $(this).blur();">Show/Hide the log</button>
<!--?prettify lang=xml ?-->
<pre class="prettyprint" id="log" style="overflow: scroll; width: 1200px; max-height: 700px;">
    <p style="background-color: pink;font-weight: bold;">No function is executed yet</p>
</pre>
<style>
    .table th {text-align: center;}
</style>
<script>
    function execute(action) {
        $.post('', {
            action: action,
            pnr: $('#pnr').val(),
            pnr2: $('#pnr2').val(),
            source: $('#source').val(),
            source2: $('#source2').val(),
            destination: $('#destination').val(),
            queueNum: $('#queueNum').val(),
            queueNum2: $('#queueNum2').val()
        }).success(function (data) {
            $('#log').html(data);
            $('#log').removeClass('prettyprinted');
            prettyPrint();
            $('html, body').animate({scrollTop: $("#log").offset().top}, 1000);
        });
    }
</script>

