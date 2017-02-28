
<?php
/* @var $this \SiteController */
/* @var $model Users */
/* @var $form CActiveForm  */

$this->pageTitle = \Yii::app()->name . ' - Session Expire';
?>
<style>
	/* The Modal (background) */
	.modal {
		display: none; /* Hidden by default */
		position: fixed; /* Stay in place */
		z-index: 1; /* Sit on top */
		left: 0;
		top: 0;
		width: 100%; /* Full width */
		height: 380px; /* Full height */
		background-color: rgb(247, 247, 247); /* Black w/ opacity */
	}

	/* Modal Content/Box */
	.modal-content {

		margin: 15% auto; /* 15% from the top and centered */
		padding: 20px;
		width: 30%; /* Could be more or less, depending on screen size */
	}

	.close {
		color: #aaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
	}

	.close:hover,
	.close:focus {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}
</style>
<div class="ui basic segment" style="max-width: 800px; margin: 20px auto;">
	<div class="ui negative message">

		<p><?php echo CHtml::encode($message); ?></p>
		<p><?php echo CHtml::encode($msg); ?></p>
		<p><?php echo CHtml::encode($m); ?></p>
	</div>
</div>
<div class="ui basic segment" style="max-width: 300px; margin: auto; text-align: left;">
	<!-- <a href="javascript:;" class="forgot-password" on-click="set('forgottenpass', 1)">Forgot Password?</a> -->
	<button type="button" id="reset" class="ui massive fluid blue button uppercase">Reset Password</button> 
	<div id="myModal" class="modal">
		<div class="modal-content">
			<div class="ui login small modal transition visible active" style="margin-top: -138.5px;">
				<i class="close icon"></i> 
				<div class="header">  Reset password<span style="float:right;cursor:default;" id="close_model">X</span></div> 
				<div class="content">
					<form action="forgottenpass" class="ui basic segment form " id="my_reset_form" style="position: relative;"> 
						<div class="ui basic segment " style="max-width: 300px; margin: auto; text-align: left;">
							<div class="ui input fluid  "> 
								<input autocomplete="email" class="fluid" type="text" name="email" id="user_recovery_email" placeholder="Email"> 
							</div><br> 
							<button type="button" class="ui massive fluid blue button uppercase" id="my_btn">RESET</button><br><br>
							<div class="ui error message"> <p id="message"></p></div> 
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	</div>
	<script type="text/javascript" src="/themes/B2C/assets/js/common.js?1470134169"></script>
	<script type="text/javascript" src="/themes/B2C/assets/js/flights.js?1470134169"></script>
	<script src='http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>
	<script>

		$(function()
		{
			$('#close_model').click(function()
			{
				$('#myModal').hide();

			});
			$('#reset').click(function()
			{
				$('#myModal').show();
			});

			$('#my_btn').click(function()
			{
				$('.error.message').show();
				if($('#user_recovery_email').val() == '')
				{
					$('#message').html("Email can't be blank. Please provide your Email-Id");
					return;
				}
				$.ajax(
				{
					type:'POST',
					data:$('#my_reset_form').serialize(),
					url:"/b2c/auth/forgottenpass",
					success:function(res)
					{
						$('#message').html("Instructions how to revive your password has been sent to your email. Please check your email.");
					},
					error:function(res)
					{
						$('#message').html("Sorry please try again");
					}
				});
			});
		});
	</script>
