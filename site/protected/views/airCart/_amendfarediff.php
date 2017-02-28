<style>
    #newspaper-b {
        border-collapse: collapse;
        border-color: #B7DDF2;
        border-style: solid;
        border-width: 1px;
        font-family: Arial,Helvetica,sans-serif;
        font-size: 11px;
        margin: 0 0 20px;
        text-align: left;
        width: 400px;
    }
    #newspaper-b th {
        background: none repeat scroll 0 0 #EBF4FB;
        border-color: lightgray;
        font-size: 11px;
        font-weight: bold;
        padding: 15px 10px 10px;
    }
    #newspaper-b tbody tr td {
        background: none repeat scroll 0 0 #FFFFFF;
    }
    #newspaper-b td {
        border-top: 1px dashed #FFFFFF;
        color: #000000;
        padding: 10px;
    }
    /*    #newspaper-b tbody tr:hover td {
            background: none repeat scroll 0 0 #FFCF8B;
            color: #000000;
        }*/
    #newspaper-b tbody tr.selected td {
        background: none repeat scroll 0 0 #FFCF8B;
        color: #000000;
    }


    .amendFareDiffmodalDialog {
        position: fixed;
        font-family: Arial, Helvetica, sans-serif;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 99999;
        opacity:0;
        -webkit-transition: opacity 400ms ease-in;
        -moz-transition: opacity 400ms ease-in;
        transition: opacity 400ms ease-in;
        pointer-events: none;
    }
    .amendFareDiffmodalDialog:target {
        opacity:1;
        pointer-events: auto;
    }
    .amendFareDiffmodalDialog > div {
        width: 400px;
        position: relative;
        margin: 10% auto;
        padding: 5px 20px 13px 20px;
        border-radius: 10px;
        background: #ececec;

    }
    .amendFareDiffclose {
        background: #606061;
        color: #FFFFFF;
        line-height: 25px;
        position: absolute;
        right: -12px;
        text-align: center;
        top: -10px;
        width: 24px;
        text-decoration: none;
        font-weight: bold;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
        -moz-box-shadow: 1px 1px 3px #000;
        -webkit-box-shadow: 1px 1px 3px #000;
        box-shadow: 1px 1px 3px #000;
    }
    .amendFareDiffclose:hover {
        background: #00d9ff;
    }
    #amendFareTable table tr td input{padding:0 5px;}
    #amendFareTable table tr td {padding:5px 10px 5px 0;}
    #amendFareTable table  {margin-bottom:10px;}
</style>


<div id="amendFareDiffModal" class="amendFareDiffmodalDialog">
    <div>	<a href="#close" title="Close" class="amendFareDiffclose">X</a>

        <h4>Payment Request</h4>



        <div id='amendFareTable'>
            <table  >
                <form method="POST" style="float: left; margin-right:5px;margin-bottom:0px;" >
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td><input id="pay_req_emailid" name="pay_req_emailid" value="<?php echo $model->user->email; ?>"/> </td>
                        </tr>
                        <tr>
                            <td>Amount</td>
                            <td><input name='farediff' id="farediff" value='0' /> </td>
                        </tr>
                        <tr>
                            <td>Service Fee</td>
                            <td><input name='fddservicefee' id="fddservicefee" value='0' /> </td>
                        </tr>
                        <tr>
                            <td>Reason</td>
                            <td>
                                <select name="reasonfarediff" id="reasonfarediff">
                                    <option value="1">Fare Difference</option>
                                    <option value="2">Reschedule</option>
                                    <option value="3">Other</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td><textarea name='otherreasonfarediff' id="otherreasonfarediff"></textarea> </td>
                        </tr>
                        <tr>
                            <td>Send Mail</td>
                            <td><input type="checkbox" name='doessendmail' id="doessendmail" checked='checked' value='yes'/></td>
                        </tr>
                        <tr>
                            <td>Add Fee in Total?</td>
                            <td><input type="checkbox" name='addfee' id="addfee" checked='checked' value='yes'/></td>
                        </tr>

                    </tbody>
                </form> 
            </table>

            <button class="btn btn-small btn-primary" type="button" id='farediffamend' onclick="amendFareDiff(this)">Submit</button>

        </div>
        <h4 id='farediffdone' style="display: none">Successfully Done!!</h4>
    </div>
</div>





<script>

    var url = window.location.href;
    function amendFareDiff(element) {
        $(element).prop('disabled', true);
        $.post('/airCart/amendFareDiff/', {cartid:<?php echo $model->id ?>, farediff: $('#farediff').val(), fddservicefee: $('#fddservicefee').val(), doessendmail: $('#doessendmail').val(), addfee: $('#addfee').val(), reasonfarediff: $('#reasonfarediff').val(), otherreasonfarediff: $('#otherreasonfarediff').val(), pay_req_emailid: $('#pay_req_emailid').val()}, function (data) {
            if (typeof data.result !== 'undefined') {
                //alert(data.error+' refresing page');
                $('#amendFareTable').hide();
                $('#farediffdone').show();
                window.location.href = url;
                //window.location.reload();
            } else {
                alert('Some Error Occured');
                $(element).prop('disabled', false);
                //window.location.reload(); //relative to domain
            }


        }, 'json')
                .done(function () {
                    window.location.href = url;
                });
    }

    $("#doessendmail").change(function () {
        //alert("checked");
        if ($(this).is(":checked")) {
            $(this).val("yes");
            //alert($(this).val());
        } else {
            $(this).val("no");
            ;
        }
    });

    $("#addfee").change(function () {
        //alert("checked");
        if ($(this).is(":checked")) {
            $(this).val("yes");
            //alert($(this).val());
        } else {
            $(this).val("no");
            ;
        }
    });
    $('#otherreasonfarediff').attr('disabled', true);
    $("#reasonfarediff").change(function () {
        if ($(this).val() == 3) {
            $('#otherreasonfarediff').attr('disabled', false);
        } else {
            $('#otherreasonfarediff').attr('disabled', true);
            $('#otherreasonfarediff').val('');
        }
    });

</script>
