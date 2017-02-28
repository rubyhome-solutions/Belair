<?php

namespace application\components\Amadeus;

/**
 * Description of MiniRules
 *
 * @author Tony
 */
class MiniRules {

    /**
     * • processIndicator: if codeset 'ASS' is returned then the category assumption applies. Assumption for
     * category 5 is that open segments including open returns are permitted.
     *
     * @var array
     */
    static $rulesCategories = [
//        5 => [
//            "ERD" => 'Earliest reservation date before departure',
//            "LRD" => 'Last reservation date before departure',
//            "ETD" => 'Earliest ticketing date before departure',
//            "LTD" => 'Last ticketing date before departure',
//            "LTR" => 'Last ticketing date after reservation',
//        ],
//        6 => ["MIS" => 'Minimum stay'],
//        7 => [
//            "MSP" => 'Travel must be completed before date',
//            "MSC" => 'Travel must commence before date',
//        ],
        31 => 'Reschedule/Reissue rules',
        33 => 'Refund rules',
    ];
    static $subCategory = [
        "ADC" => 'Maximum penalty amount for the ticket if revalidation in departure',
        "ADF" => 'Minimum penalty amount if reissue or refund after departure in fare filing currency',
        "ADG" => 'Maximum penalty amount if reissue or refund after departure in fare filing currency',
        "ADH" => 'Minimum Penalty amount if revalidation after departure in fare filing currency',
        "ADI" => 'Minimum Penalty amount if revalidation after departure in sale currency',
        "ADL" => 'Maximum penalty amount if revalidation after departure in fare filing currency',
        "ADM" => 'Minimum penalty amount if reissue or refund after departure in sale currency',
        "ADT" => 'Maximum penalty amount for the ticket if reissue or refund after departure',
        "ADU" => 'Maximum penalty amount if revalidation after departure in sale currency',
        "ADX" => 'Maximum penalty amount if reissue or refund after departure in sale currency',
        "ANC" => 'Maximum penalty amount for the ticket in case of revalidation after departure no show',
        "ANF" => 'Minimum penalty amount in case of reissue or refund with no show after departure in fare filing currency',
        "ANG" => 'Maximum penalty amount in case of reissue or refund with no show after departure in fare filing currency',
        "ANH" => 'Minimum Penalty amount in case of revalidation after departure no show in fare filing currency',
        "ANI" => 'Minimum Penalty amount in case of revalidation after departure no show in sale currency',
        "ANL" => 'Maximum penalty amount in case of revalidation after departure no show in fare filing currency',
        "ANM" => 'Minimum penalty amount in case of reissue or refund with no show after departure in sale currency',
        "ANT" => 'Maximum penalty amount for the ticket in case reissue or refund with of no show after departure',
        "ANU" => 'Maximum penalty amount in case of revalidation after departure no show in sale currency',
        "ANX" => 'Maximum penalty amount in reissue or refund with no show after departure in sale currency',
        "BDC" => 'Maximum penalty amount for the ticket if revalidation after departure',
        "BDF" => 'Minimum penalty amount in case of reissue or refund before departure in fare filing currency',
        "BDG" => 'Maximum penalty amount in case of reissue or refund before departure in fare filing currency',
        "BDH" => 'Minimum Penalty amount if revalidation before departure in fare filing currency',
        "BDI" => 'Minimum Penalty amount if revalidation before departure in sale currency',
        "BDL" => 'Maximum penalty amount if revalidation before departure in fare filing currency',
        "BDM" => 'Minimum penalty amount in case of reissue or refund before departure in sale currency',
        "BDT" => 'Maximum penalty amount for the ticket in case of reissue or refund before departure',
        "BDU" => 'Maximum penalty amount if revalidation before departure in sale currency',
        "BDX" => 'Maximum penalty amount in case of reissue or refund before departure in sale currency',
        "BNC" => 'Revalidation maximum penalty amount for the ticket in case of revalidation before departure no show',
        "BNF" => 'Minimum penalty amount in case of reissue or refund with no show before departure in fare filing currency',
        "BNG" => 'Maximum penalty amount in case of reissue or refund with no show before departure in fare filing currency',
        "BNH" => 'Minimum Penalty amount in case of revalidation before departure no show in fare filing currency',
        "BNI" => 'Minimum Penalty amount in case of revalidation before departure no show in sale currency',
        "BNL" => 'Maximum penalty amount in case of revalidation before departure no show in fare filing currency',
        "BNM" => 'Minimum penalty amount in case of reissue or refund with no show before departure in sale currency',
        "BNT" => 'Maximum penalty amount for the ticket in case of reissue or refund with no show before departure',
        "BNU" => 'Maximum penalty amount in case of revalidation before departure no show in sale currency',
        "BNX" => 'Maximum penalty amount in case of reissue or refund with no show before departure in sale currency',
    ];

    /**
     * @var \AirSource
     */
    private $airSource;

    /**
     * @var test_v2\AmadeusWebServices
     */
    private $api = null;
    public $pnrObject = false;
    private $nspace;
    private $localTest = false;
//    private $localTest = true;
    private $filename;

    /**
     *
     * @param int $airSourceId
     * @param object $api The API
     * @param object $pnrObject
     * @return boolean
     */
    public function __construct($airSourceId, $api = null, $pnrObject = false) {
        $this->airSource = \AirSource::model()->cache(120)->with('backend')->findByPk($airSourceId);
        if ($this->airSource === null) {
            return false;
        }
        if ($api === null) {
            $this->api = new $this->airSource->backend->api_source;
        } else {
            $this->api = $api;
        }

        // Check if the API support the mini rules feature
        if (!method_exists($this->api, 'MiniRule_GetFromPricingRec')) {
            $this->api = null;
            return false;
        }
        $this->pnrObject = $pnrObject;
        // Namespace construction patch
        $this->nspace = "\\application\\components\\Amadeus\\{$this->airSource->backend->wsdl_file}\\";
        $this->filename = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'amadeus_minirules.json';

        // No localtest option if the request is not local
        if (\Yii::app()->request->userHostAddress != '127.0.0.1') {
            $this->localTest = false;
        }
    }

    /**
     * Get the fare mini rules for specific PNR
     * @param string $pnr 6 symbols
     * @return test_v2\MiniRule_GetFromPricingRecReply
     */
    public function getInfo($pnr = null) {
        if ($this->api === null) {
            return "Not supported by the air source backend";
        }
        if ($this->localTest) {
            $res = \Utils::fileToObject($this->filename);
        } else {
            if (!$this->pnrObject) {
                $this->pnrObject = $this->api->getPnr($pnr, $this->airSource->id);
            }
            $class = $this->nspace . "MiniRule_GetFromPricingRec";
            $query = new $class;
            $class = $this->nspace . "ItemReferencesAndVersionsType";
            $query->recordId = new $class;
            $query->recordId->referenceType = 'TST';
            $query->recordId->uniqueReference = 'ALL';
            $res = $this->api->MiniRule_GetFromPricingRec($query);
            if (YII_DEBUG) {
                \Utils::objectToFile($this->filename, $res);
            }
        }

        if (isset($res->errorWarningGroup->errorWarningDescription->freeText)) {
            return 'MiniRule Error: ' . $res->errorWarningGroup->errorWarningDescription->freeText;
        }

        return self::parseRules($res) . self::parseBags($this->pnrObject);
    }

    /**
     * Close the session
     */
    function securitySignOut() {
        if ($this->api) {
            $this->api->Security_SignOut();
        }
    }

    /**
     *
     * @param test_v2\MiniRule_GetFromPricingRecReply $data
     */
    static function parseRules($data) {
        $out = '';
        foreach (\Utils::toArray($data->mnrByPricingRecord)[0]->mnrRulesInfoGrp as $rig) {
            $ruleCategory = $rig->mnrCatInfo->descriptionInfo->number;
            if (isset(self::$rulesCategories[$ruleCategory])) {
                $out .= self::$rulesCategories[$ruleCategory] . ":\n";
                if (isset($rig->mnrMonInfoGrp)) {
                    foreach (\Utils::toArray($rig->mnrMonInfoGrp) as $mig) {
                        foreach ($mig->monetaryInfo->monetaryDetails as $md) {
                            if ($md->amount != 0) {
                                $out .= "{$md->typeQualifier}|$md->amount|{$md->currency}" . PHP_EOL;
                            }
                        }
                    }
                }
            }
        }
        return $out;
    }

    /**
     * Format the rules in html table
     * @param string $content The field content
     */
    static function formatRules($content) {
        $rows = explode("\n", $content);
        if (empty($rows)) {
            return false;
        }
        $out = "<legend>{$rows[0]}</legend><table class='table table-condensed table-bordered' style='width:auto'>";
        array_shift($rows);
        foreach ($rows as $row) {
            if (strlen($row) < 3) {
                continue;
            }
            $fields = explode('|', $row);
            if (count($fields) == 1) {  // new table
                $out .= "</table><legend>{$fields[0]}</legend><table class='table table-condensed table-bordered' style='width:auto'>";
            } else {
                $out .= "<tr><td>" . implode('</td><td>', $fields) . '</td><td class="pull-left">' . (isset(self::$subCategory[$fields[0]]) ? self::$subCategory[$fields[0]] : '') . "</td></tr>";
            }
        }

        return $out . '</table>';
    }

    /**
     * Extract the bags info from PNR_Replay
     * @param test_v2\PNR_Reply $pnrObject
     * @return string Single row with the luggage allowance
     */
    static function parseBags($pnrObject) {
        $out = '';
        if (isset($pnrObject->tstData->fareBasisInfo->fareElement)) {
            $elements = \Utils::toArray($pnrObject->tstData->fareBasisInfo->fareElement);
            if (isset($elements[0]->baggageAllowance)) {
                $out = str_replace([
                    'K',
                    'L',
                    'PC',
                        ], [
                    'kg.',
                    'lb.',
                    ' x 23kg. bags',
                        ], $elements[0]->baggageAllowance);
            }
        }
        if (isset($out[0])) {
            if ($out[0] == '1') {
                $out = rtrim($out, 's');
            }
            return "\nLuggage: {$out}";
        }
        return '';
    }

}
