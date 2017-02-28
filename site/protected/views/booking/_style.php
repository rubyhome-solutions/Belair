<style type="text/css" media="screen">
	
	.wra-from {
	  max-width: 750px;
	  margin: auto
	}
	.wra-from.form-1 {
		max-width: 800px
    }	
	.wra-tab {
	  padding-left: 20px;
	  position: relative;
	  margin-bottom: -1px;
	  list-style:none;
	}
	.wra-tab li {
	  float: left;
	}
	.wra-tab li a{
	  background-color: #ddd;
	  color: #000;
	  padding: 8px 20px;
	  -webkit-border-radius: 5px 5px 0 0;
	  -moz-border-radius: 5px 5px 0 0;
	  border-radius: 5px 5px 0 0;
	  margin: 0 5px;
	  display: block;
	}
	.wra-tab li a:hover {text-decoration:none}
	.wra-tab li.active a {
	  background-color: #bfdaf8
	}
	.wra-content {
	  padding: 15px;
	  border: 2px solid #c0d8fa;
	  -moz-border-radius: 8px;
	  -webkit-border-radius: 8px;
	  border-radius: 8px;
	  background-color: #fff;
	  -moz-box-shadow: 3px 6px 8px #888;
	  -webkit-box-shadow: 3px 6px 8px #888;
	  box-shadow: 3px 6px 8px #888;
	}

	.wra-content h2.heading {
	  float: left;
	  font-weight: 700;
	  font-size: 15px;
	  color: #000;
	  margin: 0;
	  margin-right: 40px;
	  line-height: 26px;
	}

	.wra-content .save-up {
	  display: inline-block;
	  text-transform: uppercase;
	  font-size: 15px;
	  background-color: #f2621b;
	  color: #fff;
	  line-height: 20px;
	  padding-right: 10px;
	  box-shadow: 2px 2px 0 #bbb;
	  position: relative;
	  margin-left: 20px;
	  opacity: 0.3;
	  -ms-filter: "alpha(opacity=30)";
	}
	.wra-content .save-up.in {
	  opacity: 1;
	 -ms-filter: "alpha(opacity=100)"
	}
	.wra-content .save-up:before {
	  position: absolute;
	  content: "";
	  display: block;
	  border-right: 15px solid #f2621b;
	  border-top: 10px solid transparent;
	  border-bottom: 10px solid transparent;
	  top:0;
	  left: -15px;
	}
	.wra-content .radio-inline {
	  font-weight: 700;
	  font-size: 12px;
	  padding-top: 3px;
	  display: inline;
	  padding-left:20px;
	}
	.wra-content .radio-inline input[type="radio"] {
	  margin-top: 0
	}
	.wra-from .dropdown {
	  position: relative;
	}
	.wra-from .form-control {
	  height: 30px;
	  border-color: #7f9db9;
	  /*border-top-width: 2px;*/
	  color: #333;
	  font-size: 15px;
	  text-decoration: none;
	  border-radius:2px;
	  width: 90%
	}
	.wra-from  .fa-caret-down {
	  position: absolute;
	  right: 20px;
	  cursor:pointer;
	  font-size: 18px;
	  line-height: 39px;
	  color: #999;
	  margin-top:2px;
	  width:15px;
	}
	/*.wra-from .dropdown-menu {
	  width: 100%;
	  -webkit-border-radius: 0;
	  -moz-border-radius: 0;
	  border-radius: 0;
	  overflow-y: auto;
	  height: 165px;
	}*/
	.wra-from .dropdown-menu a {
	  padding: 3px 12px;
	}
	.wra-from .dropdown-menu a:hover {
	  background-color: #2762b0;
	  color: #fff
	}
	.form-1 .text-la {
		min-width: 1px;
		min-height: 20px;
	}
	.text-la {
	  font-size: 12px;
	  font-weight: 700;
	  padding: 12px 0 3px;
	  margin: 0
	}
	h5.hea-ti {
	  color: #f2621b;
	  font-weight: 700;
	  margin:8px 0
	}
	.fr-calen {
	  color: #333
	}
	.fr-calen:hover{text-decoration:none}
	.fr-calen span {
	  display: inline-block;
	}
	.fr-calen .thu{
	  display: table;
	  font-weight: 700;
	  font-size: 12px;
	  text-transform: uppercase;
	}
	.fr-calen .moth {
	  font-weight: 700;
	  font-size: 15px;
	  text-transform: uppercase;
	}
	.fr-calen .day {
	  font-size: 40px;
	  font-weight: 700;
	  text-transform: uppercase;
	  line-height: 37px
	}
	.fr-calen .fa-calendar {
	  font-size: 40px;
	  margin-left: 10px;
	}
	.fr-calen .text {
	  font-size: 12px;
	  font-weight: 700;
	}
	.box-space-1 {
	  border-top: 1px solid #cbcccb;
	  border-bottom: 1px solid #cbcccb;
	  padding: 15px 0 17px;
	  margin-top: 20px;
	  margin-left: 0px
	}
	.box-space-1 h6 {
	  font-size: 14px;
	  font-weight: 700;
	  margin: 0 0 7px
	}
	.box-space-1 h6 em {
	  font-style: normal;
	  font-weight: normal;
	  font-size: 12px
	}
	.box-space-1 .span2 {width:120px}
	.box-space-1 .adults {margin-left:0px;}
	.fr-button {
	  background: #ffffff; /* Old browsers */
	  background: -moz-linear-gradient(top, #ffffff 0%, #b0b0b0 100%); /* FF3.6+ */
	  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(100%,#b0b0b0)); /* Chrome,Safari4+ */
	  background: -webkit-linear-gradient(top, #ffffff 0%,#b0b0b0 100%); /* Chrome10+,Safari5.1+ */
	  background: -o-linear-gradient(top, #ffffff 0%,#b0b0b0 100%); /* Opera 11.10+ */
	  background: -ms-linear-gradient(top, #ffffff 0%,#b0b0b0 100%); /* IE10+ */
	  background: linear-gradient(to bottom, #ffffff 0%,#b0b0b0 100%); /* W3C */
	  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#b0b0b0',GradientType=0 ); /* IE6-9 */
	  -moz-border-radius: 4px;
	  -webkit-border-radius: 4px;
	  border-radius: 4px;
	  border: 1px solid #ccc;
	  display: table;
	  box-shadow: 0 0 1px #ccc
	}
	.fr-button .text {
	  font-size: 16px;
	  font-weight: 700;
	  line-height: 26px;
	  display: inline-block;
	  float: left;
	  padding: 0 10px;
	  border-left: 1px solid #ccc;
	  border-right:1px solid #ccc ;
	}
	.fr-button button {
	  font-size: 11px;
	  font-weight: 700;
	  border: none;
	  background: none;
	  height: 26px;
	  color: #555;
	  width: 35px;
	  padding: 0;
	  float: left;
	  outline: 0
	}
	.fr-button button:hover{
	  background: #b0b0b0; /* Old browsers */
	  background: -moz-linear-gradient(top, #b0b0b0 0%, #ffffff 100%); /* FF3.6+ */
	  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#b0b0b0), color-stop(100%,#ffffff)); /* Chrome,Safari4+ */
	  background: -webkit-linear-gradient(top, #b0b0b0 0%,#ffffff 100%); /* Chrome10+,Safari5.1+ */
	  background: -o-linear-gradient(top, #b0b0b0 0%,#ffffff 100%); /* Opera 11.10+ */
	  background: -ms-linear-gradient(top, #b0b0b0 0%,#ffffff 100%); /* IE10+ */
	  background: linear-gradient(to bottom, #b0b0b0 0%,#ffffff 100%); /* W3C */
	  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b0b0b0', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */
	}
	.box-space-1 .form-control {
	  height: 28px;
	  padding: 0 12px
	}
	.btn-sea {
	  display: table;
	  padding: 10px 20px;
	  color: #fff;
	  background-color: #2762b0;
	  -webkit-border-radius: 5px;
	  -moz-border-radius: 5px;
	  border-radius: 5px;
	  font-size: 18px;
	  margin-top: 17px;
	  margin-left: auto;
	}
	.btn-sea:hover {
	  color: #fff;
	  background-color: #0D4691
	}
	.typeahead {
		padding: 5px !important;
		width: 90%;
		border-radius: 2px !important;
		height: 25px !important;
		border-color: #7f9db9 !important;
	}
	.ui-autocomplete {
	    max-height: 220px;
	    overflow-y: auto;
	    overflow-x: hidden;
  	}
	  /* IE 6 doesn't support max-height
	   * we use height instead, but this forces the menu to always be this tall
	   */
	* html .ui-autocomplete {
	    height: 220px;
	}
</style>