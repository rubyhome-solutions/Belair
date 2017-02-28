<?php

/**
 * Generating Pdf docs
 *
 * @author Boxx
 */
class Pdf extends CApplicationComponent {

    private $pdf;

//    public function __construct() {
//        $this->pdf->setPageOptions([
//            'print-media-type',
//        ]);
//    }

    /**
     * Send the $content as pdf to file or inline to the browser
     * @param type $url The URL that generates the HTML content of the pdf
     * @param type $filename The name of the file to be downloaded. If empty the content is streamed
     */
    public function send($url, $filename = null) {
        Yii::import('application.vendor.PhpWkhtmltoPdf.WkHtmlToPdf');
        $this->pdf = new WkHtmlToPdf([
            'binPath' => strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? 'd:/Programs/wkhtmltopdf/bin/wkhtmltopdf' : '/usr/bin/wkhtmltopdf'
        ]);
//        Yii::log((Yii::app()->session->sessionName . '=>' . Yii::app()->session->sessionID));
        $this->pdf->addPage($url, array(
            'cookie' => array(Yii::app()->session->sessionName => Yii::app()->session->sessionID),
            'post' => array('pdf' => 1)
                )
        );
        // avoid locking of the sessions variable.
        session_write_close();
        $this->pdf->send($filename) || Yii::log($this->pdf->getError());
    }

    /**
     * Save the $content as pdf to file
     * @param type $url The URL that generates the HTML content of the pdf
     * @param type $filename The name of the file to be saved.
     */
    public function save($url, $filename) {
        Yii::import('application.vendor.PhpWkhtmltoPdf.WkHtmlToPdf');
        $this->pdf = new WkHtmlToPdf([
            'binPath' => strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? 'd:/Programs/wkhtmltopdf/bin/wkhtmltopdf' : '/usr/bin/wkhtmltopdf'
        ]);
//        Yii::log((Yii::app()->session->sessionName . '=>' . Yii::app()->session->sessionID));
        $this->pdf->addPage($url, array(
            'cookie' => array(Yii::app()->session->sessionName => Yii::app()->session->sessionID),
            'post' => array('pdf' => 1)
                )
        );
        // avoid locking of the sessions variable.
        session_write_close();
        // Save the PDF
        //$this->pdf->createPdf($filename);
        return $this->pdf->getPdfFilename();
    }

}

?>
