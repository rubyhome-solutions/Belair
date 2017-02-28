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
    
    
    .amendAddmodalDialog {
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
.amendAddmodalDialog:target {
    opacity:1;
    pointer-events: auto;
}
.amendAddmodalDialog > div {
    width: 400px;
    position: relative;
    margin: 10% auto;
    padding: 5px 20px 13px 20px;
    border-radius: 10px;
    background: #ececec;
   
}
.amendAddclose {
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
.amendAddclose:hover {
    background: #00d9ff;
}
#amendAddTable table tr td input{padding:0 5px;}
#amendAddTable table tr td {padding:5px 10px 5px 0;}
#amendAddTable table  {margin-bottom:10px;}
</style>


<div id="amendAddModal" class="amendAddmodalDialog">
    <div>	<a href="#close" title="Close" class="amendAddclose">X</a>

        	<h4>Add Passenger</h4>

      

<div id='amendAddTable'>
     <form method="POST" id='formAdd' style="" >
    <table  >
        <tbody>
             <?php $this->renderPartial('_amendpaxcreate');?>
            <tr>
                <td>Fare </td>
                <td><input name='fare' id="fare" value='0' /> </td>
            </tr>
            <tr style="display:none">
                <td>Reason</td>
                <td><input type='hidden' name='reasonaddpax' id="reasonaddpax" value='Add Pax' /> </td>
            </tr>
            
           <input type='hidden' name='cartid' id="cartid" value='<?php echo $model->id;?>' />
        </tbody>
       
    </table>
     </form> 
   <button class="btn btn-small btn-primary" type="button" id='addamend' onclick="amendAddPax(this)">Submit</button>
  
</div>
 <h4 id='adddone' style="display: none">Successfully Done!!</h4>
    </div>
</div>





<script>
   
   var url=window.location.href;
    function amendAddPax(element){
         $(element).prop('disabled', true);
         $.post('/airCart/amendAddPax/', $('#formAdd').serialize(), function (data) {
            if (typeof data.result !== 'undefined') {
            //alert(data.error+' refresing page');
            $('#amendAddTable').hide();
            $('#adddone').show();
            window.location.href = url;
            //window.location.reload();
        }
        else{
            alert('Some Error Occured');
             $(element).prop('disabled', false);
            //window.location.reload(); //relative to domain
        }
        
        
        }, 'json')
                .done(function () {
                    
        });
    }
    
    $("#doessendmail").change(function(){
    //alert("checked");
    if($(this).is(":checked")){
        $(this).val("yes");
        //alert($(this).val());
    } else {
        $(this).val("no");;
    }
});

</script>
