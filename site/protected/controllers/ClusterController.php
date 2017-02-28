<?php

use application\components\Cluster;

class ClusterController extends Controller {

    public $layout = '//layouts/column1';

    /**
     * @return array action filters
     */
    public function filters() {
        return ['accessControl'];
    }

    public function accessRules() {
        return [
            ['allow',
                'ips' => [\Controller::ALLOWED_IP, Cluster::PRIVATE_NETWORK_WITH_MASK],
            ],
            ['allow', 
                'actions' => ['deactivateAllSlaves'],
                'expression' => 'Authorization::getIsSuperAdminLogged()',
            ],
            ['deny']
        ];
    }

    /**
     * Mark the slave as alive in case the slave is already registered
     */
    public function actionPing() {
        if (!Cluster::getIsSlave()) {
            Cluster::activateSlave(\Yii::app()->request->userHostAddress);
        }
        echo "Pong";
    }

    /**
     * Register new slave node
     */
    public function actionRegisterSlave() {
        \Utils::jsonHeader();
        if (!Cluster::getIsSlave()) {
            echo Cluster::addSlave();
        } else {
            echo json_encode(['error' => 'I am slave']);
        }
    }

    /**
     * Mark a slave as inactive
     */
    public function actionDeactivateSlave() {
        \Utils::jsonHeader();
        if (!Cluster::getIsSlave()) {
            Cluster::deactivateSlave(\Yii::app()->request->userHostAddress);
            echo json_encode(['result' => 'Slave deactivated']);
        } else {
            echo json_encode(['error' => 'I am slave']);
        }
    }

    /**
     * Mark a slave as inactive
     */
    public function actionDeactivateAllSlaves() {
        \Utils::jsonHeader();
        if (!Cluster::getIsSlave()) {            
            echo json_encode(['result' => Cluster::deactivateAllSlaves()]);
        } else {
            echo json_encode(['error' => 'I am slave']);
        }
    }

}
