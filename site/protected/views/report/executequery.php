<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
?>
<form name="execute_query" method="post" action="/report/executeQuery" style="background-color: lightcyan; width: 70%" id="execute_query">

    <table class="table table-bordered table-condensed">
        <colgroup><col width="150"><col></colgroup>
        <tbody><tr>
                <th>Database Query</th>
                <td style="width: 307px;">
                    <textarea id='qry' name='qry' rows='15' cols='40'><?php echo $qry;?></textarea>
                </td>
            </tr>
        </tbody></table>
    <br>
    <button class="btn btn-info" id="xlsFile" name="xlsFile" type="submit" value="1">Execute</button>
    <br>
</form>
<?php
if (!empty($error)) {
    ?>
    <h4><?php echo $error; ?></h3>
<?php } ?>
<style>
    textarea {width:95%; height: 95%;}
    th {background-color: lightgoldenrodyellow;}
    .table {margin-bottom: auto;}
    table {border: 1px solid #dddddd;}
    .table td {
        text-align: center;
        vertical-align: middle;
    }
    .table th {
        vertical-align: middle;
        text-align: center;
    }
</style>