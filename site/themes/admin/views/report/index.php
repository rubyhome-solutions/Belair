<?php
/* @var $this \ReportController */
/* @var $reports array */

$this->breadcrumbs = ['Reports'];
?>
<div class="ibox-content m_top1">
<form name="report_criterion" method="post" action="/report/getScreenData" style="background-color: lightcyan; width: 100%" id="reportsForm">
    <div>
        <table class="table table-bordered table-condensed">
            <colgroup><col width="150"><col></colgroup>
            <tbody><tr>
                    <th>Report Type</th>
                    <td>
                        <select id="reportType" name="reportType" onchange="reportChanged($(this).val())" style="width: 50%;">
                            <option selected value="">-- SELECT --</option>
                            <option value="2">Detailed Air Report</option>
                            <option value="1">Air Sales Report</option>
                            <option value="25">Daily Sales Report</option>
                            <option value="5">Air Routes Report</option>
                            <option value="8">Reseller Sales Report</option>
                            <option value="18">Employee Productivity Report</option>
                            <option value="6">Air Scrappers Sales Report</option>
                            <option value="4">Planned Trips Report</option>
                            <option value="11">Look to Book Ratio Report</option>
                            <option value="9">Amendments Detailed Report</option>
                            <option value="7">Sales Chart Report</option>
                            <option value="34">Search Report</option>
                            <!--<option value="32">Advanced Purchase</option>-->
                        </select>
                    </td>
                </tr>
            </tbody></table>

        <div id="1_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>X-Axis</th>
                        <td colspan="8">
                            <select name="chart_xaxis">
                                <option value="Channels">Channels</option><option value="Products">Products</option><option value="Airlines">Airlines</option></select>
                        </td>
                    </tr>
                    <tr>
                        <th>Y-Axis</th>
                        <td colspan="8">
                            <select name="chart_yaxis">
                                <option value="Price">Price</option><option value="Segments">Segments</option></select>
                        </td>
                    </tr>
                    <tr>
                        <th>Gross/Range</th>
                        <td colspan="8">
                            <label><input type="checkbox" name="chart_date_range">&nbsp; Show values by time period/s</label>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="2_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Period</th>
                        <td>
                            <select name="reseller_sales_period">
                                <option value="A">Aggregate</option>
                                <option value="Q">Quarterly</option>
                                <option value="Y">Yearly</option>
                                <option value="M">Monthly</option>
                            </select>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="3_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Products</th>
                        <td>
                            <select name="product">
                                <option value="A" selected="selected">Air</option><option value="H">Hotel</option><option value="I">Insurance</option></select>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="4_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Air Filters</th>
                        <td>
                            <?php echo TbHtml::dropDownList('serviceType', '', $serviceTypes, ['prompt' => '- Service type -']) ?>
                        </td>
                        <td>
                            <?php echo TbHtml::dropDownList('cabinType', '', $cabinTypes, ['prompt' => '- Cabin type -', 'style' => 'width: 95%;']) ?>
                        </td>
                        <td style="width: 43%;">
                            <?php echo TbHtml::dropDownList('carrier', '', $carriers, ['prompt' => '-- Airline --']) ?>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="5_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Air Route Filter</th>
                        <td>
                            <input type="text" name="airport1" value="" size="5" maxlength="3" placeholder="IATA code" class="input-small">
                            &nbsp; &nbsp;
                            <input type="text" name="airport2" value="" size="5" maxlength="3" placeholder="IATA code" class="input-small">
                            &nbsp; &nbsp;
                            <input type="text" name="airport3" value="" size="5" maxlength="3" placeholder="IATA code" class="input-small">
                            &nbsp; &nbsp;
                            <input type="text" name="airport4" value="" size="5" maxlength="3" placeholder="IATA code" class="input-small">
                            &nbsp; &nbsp;
                            <input type="text" name="airport5" value="" size="5" maxlength="3" placeholder="IATA code" class="input-small">
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="17_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Hotel Filters</th>
                        <td>
                            <select name="hotel_type">
                                <option value="both">-- Type --</option>
                                <option value="domestic">Domestic</option>
                                <option value="international">International</option>
                            </select>
                        </td>
                        <td>
                            <select name="hotel_ratings">
                                <option value="-">-- Ratings --</option>
                                <option value="1">One Star</option>
                                <option value="2">Two Star</option>
                                <option value="3">Three Star</option>
                                <option value="4">Four Star</option>
                                <option value="5">Five Star</option>
                            </select>
                        </td>
                        <td>
                        </td>
                    </tr>
                </tbody></table>
        </div>
        <div id="18_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Hotel Cities Filter</th>
                        <td>
                            <div class="yui_ac_wrap yui-ac" style="z-index:24">
                                <input type="hidden" name="cities_location_id" value="" size="5" maxlength="10">
                                <input type="text" name="cities_location_idL" value="" size="25" maxlength="90" class="yui-ac-input" autocomplete="off">
                                <span id="yui_ac_wait_7" class="yui_ac_wait"></span>
                                <br><div id="yui_ac_div_7" class="yui_ac_div yui-ac-container"><div class="yui-ac-content" style="display: none;"><div class="yui-ac-hd" style="display: none;"></div><div class="yui-ac-bd"><ul><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li></ul></div><div class="yui-ac-ft" style="display: none;"></div></div></div>
                            </div>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="24_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Custom Product Filters</th>
                        <td>
                            <select name="custom_product_type" style="width: 100px;">
                                <option value="">- Item Type -</option>
                                <option value="H">Hotel</option>
                                <option value="V">Visa</option>
                                <option value="R">Rail</option>
                                <option value="C">Car</option>
                                <option value="O">Holiday</option>
                                <option value="I">Insurance</option>
                                <option value="B">Bus</option>
                                <option value="E">Cruise</option>
                                <option value="M">Miscellaneous</option>
                            </select>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="23_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Insurance Filters</th>
                        <td>
                            <select name="insurance_type" style="width: 100px;">
                                <option value="">- Type -</option>
                                <option value="domestic">Domestic</option>
                                <option value="international">International</option>
                            </select>
                        </td>
                    </tr>
                </tbody></table>
        </div>
        <div id="26_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Visa Country</th>
                        <td>
                            <select name="visa_country" style="width: 100px;">
                                <option value="">--</option>
                                <option value="AF">Afghanistan</option><option value="AX">Aland Islands</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antartica</option><option value="AG">Antigua And Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia Herzegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet Island</option><option value="BR">Brazil</option><option value="IO">British Indian Ocean Territory</option><option value="VG">British Virgin Islands</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CC">Cocos Islands</option><option value="CO">Colombia</option><option value="KM">Comoros</option><option value="CG">Congo</option><option value="CD">Congo Democratic Republic Of</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Cote d`Ivoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FO">Faeroe Islands</option><option value="FK">Falkland Islands</option><option value="FJ">Fiji Islands</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GG">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard Island and McDonald Islands</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran</option><option value="IQ">Iraq</option><option value="IE">Ireland</option><option value="IM">Isle Of Man</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JE">Jersey Island</option><option value="JO">Jordan</option><option value="KZ">Kazakstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KP">Korea, Democratic Peoples Republic</option><option value="KR">Korea, Republic Of</option><option value="XK">Kosovo</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libyan Arab Jamahiriya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macau</option><option value="MK">Macedonia</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MP">Mariana Islands</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia</option><option value="MD">Moldova</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="AN">Netherland Antilles</option><option value="NL">Netherlands</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestinian Territories</option><option value="PA">Panama</option><option value="PG">Papua New Guinea (Niugini)</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Reunion</option><option value="RO">Romania</option><option value="RU">Russia</option><option value="RW">Rwanda</option><option value="BL">Saint Barthelemy</option><option value="SH">Saint Helena</option><option value="KN">Saint Kitts and Nevis</option><option value="LC">Saint Lucia</option><option value="MF">Saint Martin</option><option value="PM">Saint Pierre and Miquelon</option><option value="VC">Saint Vincent And The Grenadines</option><option value="AS">Samoa, American</option><option value="WS">Samoa, Independent State Of</option><option value="SM">San Marino</option><option value="ST">Sao Tome and Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychelles Islands</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="GS">South Georgia And S Sandwich Island</option><option value="SS">South Sudan</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SJ">Svalbard And Jan Mayen Is</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="SY">Syrian Arab Rep.</option><option value="TW">Taiwan</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania</option><option value="TH">Thailand</option><option value="TL">Timor Leste</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad and Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks And Caicos Islands</option><option value="TV">Tuvalu</option><option value="VI">US Virgin Islands</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB">United Kingdom</option><option value="US">United States</option><option value="UM">United States Minor Outlying Islnds</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan Sum</option><option value="VU">Vanuatu</option><option value="VA">Vatican City State</option><option value="VE">Venezuela</option><option value="VN">Vietnam</option><option value="WF">Wallis and Futuna Islands</option><option value="EH">Western Sahara</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="30_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th rowspan="2">Visa Filters</th>
                        <td><select name="creation_branch" style="width: 150px;">
                                <option value="">--Visa Creation Branch--</option>
                                <option value="7_0">null ( All ) </option>
                                <option value="3_0">null ( All ) </option>
                                <option value="8_0">null ( All ) </option>
                                <option value="9_0">null ( All ) </option>
                                <option value="6_0">null ( All ) </option>
                                <option value="4_0">null ( All ) </option>
                                <option value="5_0">null ( All ) </option>
                                <option value="1_0">null ( All ) </option>
                                <option value="2_0">null ( All ) </option>
                            </select>
                        </td>
                        <td>
                            <select name="visa_processing_status" style="width: 150px;">
                                <option value="">--Visa Status--</option>
                                <option value="0">New</option><option value="1">Documents Received</option><option value="2">Submitted</option><option value="3">Application Collected</option><option value="4">Passport Dispatched</option></select>
                        </td>
                        <td><select name="processing_branch" style="width: 150px;">
                                <option value="">--Processing Branch--</option>
                                <option value="7_0">null ( All ) </option>
                                <option value="3_0">null ( All ) </option>
                                <option value="8_0">null ( All ) </option>
                                <option value="9_0">null ( All ) </option>
                                <option value="6_0">null ( All ) </option>
                                <option value="4_0">null ( All ) </option>
                                <option value="5_0">null ( All ) </option>
                                <option value="1_0">null ( All ) </option>
                                <option value="2_0">null ( All ) </option>
                            </select>
                        </td>
                        <td colspan="2">
                            <select name="application_handling_staff" style="width: 182px;">
                                <option value="">-- Application Handling Staff --</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Show OK to bill? <input type="checkbox" name="visa_ok_to_bill">
                        </td>
                        <td>
                            Show unprocessed? <input type="checkbox" name="visa_unprocessed" checked="checked">
                        </td>
                        <td>
                            Show from all websites? <input type="checkbox" name="visa_all_websites">
                        </td>
                        <td>
                            Show concise report? <input type="checkbox" name="visa_concise">
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="25_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Topup Filters</th>
                        <td>
                            <select name="operator_name" style="width: 100px;">
                                <option value="">- Operators -</option>
                                <option value="PostPaid Vodafone">PostPaid Vodafone</option>
                                <option value="PostPaid Idea">PostPaid Idea</option>
                                <option value="Vodafone">Vodafone</option>
                                <option value="VIDEOCON D2H">VIDEOCON D2H</option>
                                <option value="TATA_WALKY">TATA_WALKY</option>
                                <option value="BIG TV">BIG TV</option>
                                <option value="Vodafone 4 2 k 1">Vodafone 4 2 k 1</option>
                                <option value="Idea">Idea</option>
                                <option value="VIDEOCON">VIDEOCON</option>
                                <option value="MTNL">MTNL</option>
                                <option value="AIRTEL DIGITAL TV">AIRTEL DIGITAL TV</option>
                                <option value="Idea 4 2 k 1">Idea 4 2 k 1</option>
                                <option value="T24">T24</option>
                                <option value="TATA DOCOMO">TATA DOCOMO</option>
                                <option value="Dish TV">Dish TV</option>
                                <option value="SUN TV">SUN TV</option>
                                <option value="PostPaid Tata Indicom">PostPaid Tata Indicom</option>
                                <option value="TATA SKY">TATA SKY</option>
                                <option value="UNINOR">UNINOR</option>
                                <option value="PostPaid Reliance GSM">PostPaid Reliance GSM</option>
                                <option value="MTS">MTS</option>
                                <option value="TATA_TTSL">TATA_TTSL</option>
                                <option value="RELIANCE GSM">RELIANCE GSM</option>
                                <option value="AIRCEL">AIRCEL</option>
                                <option value="Airtel">Airtel</option>
                                <option value="BSNL">BSNL</option>
                                <option value="VIRGIN GSM">VIRGIN GSM</option>
                                <option value="PostPaid Airtel">PostPaid Airtel</option>
                                <option value="LOOP Mobile">LOOP Mobile</option>
                                <option value="PostPaid Reliance CDMA">PostPaid Reliance CDMA</option>
                                <option value="Reliance">Reliance</option>
                                <option value="VIRGIN">VIRGIN</option>
                            </select>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="7_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Client Filter</th>
                        <td>
                            <?php
                            echo TbHtml::hiddenField('user_id', null, ['id' => 'user_id']);
                            $this->widget('zii.widgets.jui.CJuiAutoComplete', [
                                'id' => 'searchbox_user',
                                'name' => '',
                                'value' => '',
                                'source' => '/users/search',
                                'options' => [
                                    'showAnim' => 'fold',
                                    'minLength' => '4',
                                    'select' => 'js:function( event, ui ) {
                                $("#searchbox_user").val( ui.item.label );
                                $("#searchbox_user").blur();
                                $("#user_id").val( ui.item.value );
                                return false;
                          }',
                                ],
                                'htmlOptions' => array(
                                    'onfocus' => 'js: this.value = null; $("#searchbox_user").val(null); $("#user_id").val(null);',
                                    'class' => 'search-query',
                                    'placeholder' => "Start typing any atribute (ID,name,email,mobile...) about the user or the company here",
                                    'style' => 'max-width:600px;width:100%;',
                                ),
                            ]);
                            ?>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="6_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Client Type</th>
                        <td>
                            <?php echo TbHtml::dropDownList('clientType', '', $clientTypes, ['prompt' => '-- Select the client type --', 'style' => 'width:70%']) ?>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="8_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Region Filter</th>
                        <td>
                            <div class="yui_ac_wrap yui-ac" style="z-index:22">
                                <input type="hidden" name="reseller_location_id" value="" size="5" maxlength="10">
                                <input type="text" name="reseller_location_idL" value="" size="25" maxlength="90" class="yui-ac-input" autocomplete="off">
                                <span id="yui_ac_wait_3" class="yui_ac_wait"></span>
                                <br><div id="yui_ac_div_3" class="yui_ac_div yui-ac-container"><div class="yui-ac-content" style="display: none;"><div class="yui-ac-hd" style="display: none;"></div><div class="yui-ac-bd"><ul><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li></ul></div><div class="yui-ac-ft" style="display: none;"></div></div></div>
                            </div>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="20_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Client Source</th>
                        <td>
                            <?php echo TbHtml::dropDownList('clientSource', '', $clientSources, ['prompt' => '-- Select the client source --', 'style' => 'width:70%']) ?>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="9_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr style="display:true">
                        <th>Sales Filter</th>
                        <td>
                            <div class="yui_ac_wrap yui-ac" style="z-index:18">
                                <input type="text" name="sales_idL" value="" size="25" maxlength="90" class="yui-ac-input" autocomplete="off">
                                &nbsp; ID: <input type="text" name="sales_id" value="" size="15" maxlength="15">
                                <span id="yui_ac_wait_4" class="yui_ac_wait"></span>
                                <br><div id="yui_ac_div_4" class="yui_ac_div yui-ac-container"><div class="yui-ac-content" style="display: none;"><div class="yui-ac-hd" style="display: none;"></div><div class="yui-ac-bd"><ul><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li></ul></div><div class="yui-ac-ft" style="display: none;"></div></div></div>
                            </div>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="10_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Distributor Filter</th>
                        <td>
                            <?php echo TbHtml::dropDownList('distributorId', '', $distributors, ['prompt' => '-- Select the distributor --', 'style' => 'width:70%']) ?>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="11_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Date Filter</th>
                        <td style="width: 307px;">
                            <?php
                            $this->widget('zii.widgets.jui.CJuiDatePicker', [
                                'name' => "dateFrom",
                                'options' => [
                                    'dateFormat' => 'yy-mm-dd',
                                    'changeMonth' => true,
                                    'changeYear' => true,
                                    'firstDay' => 1,
                                ],
                                'htmlOptions' => [
                                    'placeholder' => 'From date',
                                    'style' => 'max-width:115px;',
                                ]
                            ]);
                            ?>
                            &nbsp;<a href='' onclick="this.previousElementSibling.focus();
                                    return false;"><i class="fa fa-calendar fa-2x" style="vertical-align: middle;"></i></a>
                        </td>
                        <td>
                            <?php
                            $this->widget('zii.widgets.jui.CJuiDatePicker', [
                                'name' => "dateTo",
                                'options' => [
                                    'dateFormat' => 'yy-mm-dd',
                                    'changeMonth' => true,
                                    'changeYear' => true,
                                    'firstDay' => 1,
                                ],
                                'htmlOptions' => [
                                    'placeholder' => 'To date',
                                    'style' => 'max-width:115px;',
                                ]
                            ]);
                            ?>
                            &nbsp;<a href='' onclick="this.previousElementSibling.focus();
                                    return false;"><i class="fa fa-calendar fa-2x" style="vertical-align: middle;"></i></a>
                            <div id="date_type_G" style="display:none;">
                                &nbsp; &nbsp; &nbsp;<label><input type="radio" value="G" name="date_type">
                                    Generation Date</label>
                            </div>
                            <div id="date_type_B" style="display:none;">
                                &nbsp; &nbsp; &nbsp;<label><input type="radio" value="B" name="date_type" checked="">
                                    Booking/Process Date</label>
                            </div>
                            <div id="date_type_T" style="display: none;">
                                &nbsp; &nbsp; &nbsp;<label><input type="radio" value="T" name="date_type">
                                    Travel Date</label>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="29_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Show by Processing Date</th>
                        <td colspan="8">
                            <input type="checkbox" name="show_by_processing_date">
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="31_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Show by OK To Bill Date</th>
                        <td colspan="8">
                            <input type="checkbox" name="show_by_ok_to_bill_date">
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="33_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Amendments</th>
                        <td style="width: 307px;">
                            <label>Include Amendments: <input type="checkbox" name="include_amendments"></label>
                        </td>
                        <td>
                            <div id="only_amendments" style="display: block;"><label>Only Amendments: <input type="checkbox" name="only_amendments"></label></div>
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="19_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Summary</th>
                        <td>
                            <label>Generate only the report summary: <input id="onlySummary" type="checkbox" name="onlySummary"></label>
                        </td>
                    </tr>
                </tbody></table>
        </div>
        <div id="34_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Origin</th>
                        <td>
                            <?php echo TbHtml::dropDownList('origin', '', $airports, ['prompt' => '-- Select the origin --', 'style' => 'width:70%']) ?>
                        </td>
                        <th>Destination</th>
                        <td>
                            <?php echo TbHtml::dropDownList('destination', '', $airports, ['prompt' => '-- Select the destination --', 'style' => 'width:70%']) ?>
                        </td>
                    </tr>
                    <tr>
                        <th>Waytype</th>
                        <td>
                            <select name="waytype" id="waytype">
                                <option value="">Select Type</option>
                                <option value="1" >One Way</option>
                                <option value="2" >Return</option>
                            </select>
                            <input type="hidden" id="duration" value="<?php echo date('Y-m-d', strtotime('-7 days')); ?>" name="duration" />
                        </td>
                        <th>Is Domestic</th>
                        <td>
                            <select name="isdomestic" id="isdomestic">
                                <option value="">Select Type</option>
                                <option value="1" >Domestic</option>
                                <option value="0" >International</option>
                            </select>
                            <input type="hidden" id="duration" value="<?php echo date('Y-m-d', strtotime('-7 days')); ?>" name="duration" />
                        </td>
                    </tr>
                </tbody></table>
        </div>

        <div id="action_param_div" class="filters" style="display: none;">
            <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Actions</th>
                        <td style="width: 307px;">
                            <div id="12_param_div" class="filters" style="display: none;">
                                <?php
                                echo TbHtml::ajaxButton('View Report', '/report/getScreenData', [
                                    'type' => 'POST',
                                    'data' => 'js: getFormData($("#reportsForm"))',
//                                    'update' => '#screenReport',
                                    'success' => 'js:function(html){
                                            $("#screenReport").html(html);
                                            $("#btnViewReports").blur();
                                            $("#screenReport td:contains(\'-\')").each(function() {
                                                var content = $(this).text();
                                                if (content[0] === \'-\' ) {
                                                    $(this).css({backgroundColor: \'lightpink\'});
                                                }
                                            });
                                        }',
                                        ], ['class' => 'btn btn-info', 'id' => 'btnViewReports']);
                                ?>
                            </div>
                            <div id="39_param_div" class="filters" style="display: none;">
                                <?php
                                echo TbHtml::ajaxButton('View Charts', '/report/getScreenData', [
                                    'type' => 'POST',
                                    'data' => 'js: getFormData($("#reportsForm"))',
                                    'success' => "js: function(data){
                                            for (key in data) {
                                                if (data[key]['data'].length>1) {
                                                    var chart = new google.charts.Bar(document.getElementById(data[key]['report']));
                                                    var chartData = google.visualization.arrayToDataTable(data[key]['data']);
                                                    $('#' + data[key]['report']).html('');
                                                    document.getElementById(data[key]['report']).style.display = 'block';
                                                    chart.draw(chartData, google.charts.Bar.convertOptions(data[key]['options']));
                                                } else {
                                                    document.getElementById(data[key]['report']).style.display = 'none';
                                                    //$('#' + data[key]['report']).html('<div style=\"max-width:500px;\" class=\"well alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>There is no data for this graph</div>');
                                                }
                                            }
                                            $('#btnViewCharts').blur();
                                            //$('#screenCharts div').show();
                                        }"
                                        ], [
                                    'class' => 'btn btn-info',
                                    'id' => 'btnViewCharts',
                                    'disabled' => true
                                ]);
                                ?>
                            </div>
                        </td>
                        <td><div id="13_param_div" class="filters" style="display: none;">
                                <button type="submit" class="btn btn-info" name="xlsFile" value="on">Download Excel</button>
                            </div>
                        </td>
                    </tr>
                </tbody></table>
        </div>

    </div>
</form>
</div>
<div id="screenReport"></div>
<div id="screenCharts" style="display: none;">
    <?php
    foreach (application\components\Reporting\Report::$REPORT_GROUP[7]['reports'] as $repName => $value) {
        echo "<div class='chart' id='" . str_replace(' ', '', $repName) . "'></div><br>";
    }
    $cs = Yii::app()->getClientScript();
    $cs->registerScriptFile('https://www.google.com/jsapi');
    ?>
</div>
<script type="text/javascript">
    var MAX_PARAM_NO = 40;
    var PARAM_MAP = {
        '1_4': 't', '1_5': 't', '1_6': 't', '1_7': 't', '1_20': 't', '1_11': 't', '1_12': 't', '1_13': 't', '1_9': 'f', '1_10': 't', '1_15': 't', '1_21': 't', '1_33': 'f', '1_40': 't',
        '2_7': 't', '2_20': 'f', '2_4': 't', '2_11': 't', '2_19': 't', '2_12': 't', '2_13': 't', '2_15': 't', '2_21': 't', '2_33': 'f', '2_40': 't',
        '4_4': 't', '4_6': 't', '4_7': 't', '4_11': 't', '4_12': 't', '4_13': 't', '4_15': 't', '4_21': 't', '4_20': 't', '4_40': 't',
        '5_4': 't', '5_6': 't', '5_7': 't', '5_11': 't', '5_12': 't', '5_13': 't', '5_20': 't', '5_10': 't', '5_15': 't', '5_21': 't', '5_5': 't', '5_40': 't',
        '6_4': 't', '6_6': 't', '6_20': 't', '6_5': 't', '6_7': 't', '6_11': 't', '6_12': 't', '6_13': 't', '6_15': 't', '6_21': 't', '6_33': 't', '6_40': 't',
        '7_1': 'f', '7_4': 't', '7_6': 't', '7_7': 't', '7_11': 't', '7_39': 't', '7_15': 't', '7_21': 't', '7_20': 't', '7_40': 't',
        '8_2': 'f', '8_12': 't', '8_4': 'f', '8_17': 'f', '8_6': 't', '8_20': 'f', '8_7': 't', '8_11': 't', '8_13': 't', '8_9': 'f', '8_10': 't', '8_15': 't', '8_21': 't', '8_33': 'f', '8_40': 't',
        '9_6': 't', '9_7': 't', '9_11': 't', '9_12': 't', '9_13': 't', '9_20': 't', '9_24': 'f', '9_10': 'f', '9_15': 't', '9_21': 't', '9_33': 'f', '9_40': 't',
        '11_11': 't', '11_7': 'f', '11_6': 'f', '11_20': 'f', '11_12': 't', '11_13': 't', '11_15': 't', '11_40': 't',
        '18_7': 't', '18_11': 't', '18_12': 't', '18_20': 'f', '18_13': 't', '18_15': 't', '18_21': 't', '18_40': 't',
        '25_7': 't', '25_9': 'f', '25_10': 't', '25_11': 't', '25_12': 't', '25_13': 't', '25_21': 't', '25_40': 't',
        '34_6': 'f', '34_7': 'f', '34_11': 'f', '34_12': 't', '34_13': 'f', '34_9': 'f', '34_10': 'f', '34_15': 'f', '34_21': 'f', '34_33': 'f', '34_20': 't', '34_34': 't', '34_40': 'f'
    };

    function reportChanged(val) {
//        var val = $('#report_type').val();
        document.getElementById("action_param_div").style.display = (val === "") ? "none" : "block";
        document.getElementById("screenReport").innerHTML = "";

        if (val !== "") {
            if (val === '2') {
                document.getElementById("only_amendments").style.display = "block";
            } else {
                document.getElementById("only_amendments").style.display = "none";
                document.getElementById("onlySummary").checked = false;
            }
            if (val === '7') {
                document.getElementById("screenCharts").style.display = "block";
            } else {
                document.getElementById("screenCharts").style.display = "none";
            }
            if ((val === '4')) {
                document.getElementById("dateFrom").value = "today";
//                document.report_criterion.date_type[2].checked = "checked";
            } else {
                document.getElementById("dateFrom").value = "";
//                document.getElementById("date_type_T").style.display = "none";
//                if (EPLAT_JS.getSelectedRadioBoxValue(document.report_criterion.date_type) === 'T') {
//                    document.report_criterion.date_type[1].checked = "checked";
//                }
            }
        }
        val = val + "_";
        for (var i = 1; i <= MAX_PARAM_NO; i++) {
            var elem = document.getElementById(i + "_param_div");
            if (elem) {
                elem.style.display = (PARAM_MAP[val + i] === 't') ? "block" : "none";
            }
        }
        // Empty and hide the graph divs
        $('#screenCharts').children('div').html('');
        $('#screenCharts div').hide();
    }
    //reportChanged('8'); // Default report to show
    function getFormData(form) {
        var unindexed_array = form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }
    google.load("visualization", "1.1", {packages: ["bar"]});
    $(function () {
        document.getElementById("btnViewCharts").disabled = false;
        document.getElementById("btnViewCharts").classList.remove("disabled");
    });
</script>
<style>
    select {
        margin-bottom: auto;
        width: auto;
    }
    input[type="text"] {margin-bottom: auto;}
    input[type="checkbox"] {margin: 0}
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
    .chart {
        border: 1pt solid;
        border-radius: 25px;
        padding: 10px;
        display: none;
    }
    /*    .ui-widget {
            font-family: "Open Sans";
            font-size: .9em;
        }*/
</style>