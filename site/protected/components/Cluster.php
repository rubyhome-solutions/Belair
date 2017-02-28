<?php

namespace application\components;

/**
 * Cluster class
 *
 * @author Tony
 */
class Cluster {

    const MAIN_NODE_IP = '10.130.48.217';

    static $registerSlaveUrl = 'http://' . self::MAIN_NODE_IP . '/cluster/registerSlave';

    const MAIN_NODE_CORES = 7;
    const MAIN_NODE_HOSTNAME = 'air.belair.in';
    const MAIN_NODE_LOCAL_HOSTNAME = 'web1.local';
    const SLAVE_NODES = 'SLAVE_NODES_ARRAY';
    const SLAVE_ID = 'AM_I_SLAVE';
    const CPU_CORES = 'MY_CPU_CORES_COUNT';
    const MAX_RUNNING_PROCESSES_PER_CORE = 25;
    const PRIVATE_NETWORK_WITH_MASK = '10.130.*';
    const PRIVATE_KEY = '38de08512d0d1b23ecc051ae5f254d79b6f2d2dbbd17cf310c1861c6a5cc5abc';
    const GIT_DEPLOY_URL = '/git_deploy_lskjdhflksjdhf7634219hfgb.php';

    /**
     * Is this slave node
     */
    static function getIsSlave() {
        if (\Yii::app()->cache->get(self::MAIN_NODE_LOCAL_HOSTNAME) === false) {
            self::decideSlaveOrMaster();
        }
        return \Yii::app()->cache->get(self::SLAVE_ID) !== false;
    }

    /**
     * Get the slave ID
     * @return int|bool Slave ID ir false
     */
    static function getSlaveId() {
        return \Yii::app()->cache->get(self::SLAVE_ID);
    }

    /**
     * Decide if the machine is slave or master
     * All developers machines are treated like master
     * @return boolean
     */
    static function decideSlaveOrMaster() {
        if (YII_DEBUG || trim(`hostname`) == self::MAIN_NODE_HOSTNAME) {
            \Yii::app()->cache->set(self::MAIN_NODE_LOCAL_HOSTNAME, 1);
            \Yii::app()->cache->delete(self::SLAVE_ID);

            // Init the slaves array if needed
            if (\Yii::app()->cache->get(self::SLAVE_NODES) === false) {
                \Yii::app()->cache->set(self::SLAVE_NODES, []);
            }

            return true;
        }

        return self::registerAsSlave();
    }

    /**
     * Register the machine as slave
     */
    static function registerAsSlave() {
        $time = time();
        $params = [
            'cpuCores' => self::cpuCores(),
            'ts' => $time,
            'key' => sha1($time . self::PRIVATE_KEY)
        ];
        $res = \Utils::curl(self::$registerSlaveUrl, $params);
        if ($res['error']) {
            \Utils::dbgYiiLog([__METHOD__ => $res]);
            \Yii::app()->end();
//            return $res['error'];
        }

        // Checks
        $result = json_decode($res['result']);
        if (isset($result->error)) {
            \Utils::dbgYiiLog([__METHOD__ => $result->error]);
            \Yii::app()->end();
        }
        if (!isset($result->slaveId)) {
            \Utils::dbgYiiLog([__METHOD__ => $res['result']]);
            \Yii::app()->end();
        }

        // Register as slave
        \Yii::app()->cache->set(self::SLAVE_ID, (int) $result->slaveId);
        \Yii::app()->cache->set(self::MAIN_NODE_LOCAL_HOSTNAME, 0);

        return true;
    }

    /**
     * Add new slave node
     * If the node is already present - update it and make it active.
     * @return int|string True or error message
     */
    static function addSlave($ip = null) {
        $checkKey = self::checkKey();
        if ($checkKey !== true) {
            return json_encode(['error' => $checkKey]);
        }
        $allSlaves = \Yii::app()->cache->get(self::SLAVE_NODES);
        if ($allSlaves === false) {
            $allSlaves = [];
        }
        $slave = new Slave();
        $slave->ip = $ip ? : \Yii::app()->request->userHostAddress;
        if (in_array($slave->ip, ['127.0.0.1', self::MAIN_NODE_IP, gethostbyname(self::MAIN_NODE_HOSTNAME)])) {
            return json_encode(['error' => 'Can not add yourself as slave!']);
        }
        $slave->cpuCores = \Yii::app()->request->getPost('cpuCores', 2);
        $slave->active = true;
        $slave->lastResult = date(DATETIME_FORMAT);
        if (isset($allSlaves[$slave->ip])) {
            $slave->id = $allSlaves[$slave->ip]->id;
        } else {
            $slave->id = 1 + count($allSlaves);
        }
        $allSlaves[$slave->ip] = $slave;
        \Yii::app()->cache->set(self::SLAVE_NODES, $allSlaves);
        return json_encode(['slaveId' => $slave->id]);
    }

    /**
     * Mark slave as inactive
     * @param string $ip The slave node IP
     */
    static function deactivateSlave($ip) {
        $allSlaves = \Yii::app()->cache->get(self::SLAVE_NODES);
        if (empty($allSlaves) || !isset($allSlaves[$ip])) {
            return;
        }
        $allSlaves[$ip]->active = false;
        \Yii::app()->cache->set(self::SLAVE_NODES, $allSlaves);
    }

    /**
     * Mark all slaves as inactive
     */
    static function deactivateAllSlaves() {
        $allSlaves = \Yii::app()->cache->get(self::SLAVE_NODES);
        if (!empty($allSlaves)) {
            foreach ($allSlaves as $slave) {
                $slave->active = false;
            }
            \Yii::app()->cache->set(self::SLAVE_NODES, $allSlaves);
            return 'All slaves deactivated';
        }
        
        return 'No slaves available';
    }

    /**
     * Mark slave as active. The slave must be registered
     * @param string $ip The slave node IP
     */
    static function activateSlave($ip) {
        $allSlaves = \Yii::app()->cache->get(self::SLAVE_NODES);
        if (!isset($allSlaves[$ip])) {
            return;
        }
        $allSlaves[$ip]->active = true;
        $allSlaves[$ip]->lastResult = date(DATETIME_FORMAT);
        \Yii::app()->cache->set(self::SLAVE_NODES, $allSlaves);
    }

    /**
     * Returns the number of available CPU cores
     *  Should work for Linux, Windows
     *
     * @return int
     */
    static function cpuCores() {
        $numCpus = \Yii::app()->cache->get(self::CPU_CORES);
        if ($numCpus !== false) {
            return $numCpus;
        }
        $numCpus = 1;
        if (is_file('/proc/cpuinfo')) {
            $cpuinfo = file_get_contents('/proc/cpuinfo');
            preg_match_all('/^processor/m', $cpuinfo, $matches);
            $numCpus = count($matches[0]);
        } elseif ('WIN' == strtoupper(substr(PHP_OS, 0, 3))) {
            $process = @popen('wmic cpu get NumberOfLogicalProcessors', 'rb');
            if (false !== $process) {
                fgets($process);
                $numCpus = intval(fgets($process));
                pclose($process);
            }
        }

        \Yii::app()->cache->set(self::CPU_CORES, $numCpus);
        return $numCpus;
    }

    /**
     * The number of the maximum allowed simultaneus processes
     * @return int
     */
    static function getMaxRunningProcesses() {
        return self::MAX_RUNNING_PROCESSES_PER_CORE * self::cpuCores();
    }

    /**
     * Get the Server ID
     * @return int
     */
    static function getServerId() {
        if (self::getIsSlave()) {
            return (int) self::getSlaveId();
        } else {
            return 0;
        }
    }

    /**
     * @todo Expire slave
     * @todo Provision new slave
     * @todo Shutdown existing slave
     * @todo Tasks distribution per slave proportional to the CPU cores
     * @todo Get Slave CPU, Memory and HDD load
     * @todo Get Slave API calls statistics
     */
    static function test() {
        self::decideSlaveOrMaster();
        $allSlaves = \Yii::app()->cache->get(self::SLAVE_NODES);
        return '<legend>Cluster stats:</legend>' .
                \Utils::arr2tableVertical([
                    [
                        'cpuCores',
                        'MaxRunningProcesses',
                        'IsSlave',
                        'ServerId',
                        'Slaves'
                    ], [
                        self::cpuCores(),
                        self::getMaxRunningProcesses(),
                        (self::getIsSlave() ? 'YES' : 'Nope'),
                        self::getServerId(),
                        $allSlaves ? "<pre>" . print_r($allSlaves, true) . "</pre>" : 'None'
                    ]
        ]);
    }

    /**
     * Is this a private network request.<br>
     * Slave nodes should use the private network.
     * @return bool
     */
    static function isPrivateNetworkRequest() {
        return strncmp(\Yii::app()->request->userHostAddress, \Controller::PRIVATE_IP_NETWORK, 3) === 0;
    }

    /**
     * Decide which node should do the job
     * the jobs are randomly distributed with relation to the available CPU cores in each server
     * @return string|bool IP of the slave node that should get the task or false for the main server
     */
    static function distributeLoad() {
        // Temporary do not outsource load
        // return false;
        
        $allSlaves = \Yii::app()->cache->get(self::SLAVE_NODES);
        if (empty($allSlaves)) {
            return false;
        }

        // As many false elements as the number of the main node cores <self::MAIN_NODE_CORES>
        $cores = [false, false, false, false, false, false, false];
        foreach ($allSlaves as $slave) {
            if ($slave->active) {
                for ($j = 0; $j < $slave->cpuCores; $j++) {
                    $cores[] = $slave->ip;
                }
            }
        }
        return $cores[rand(0, count($cores) - 1)];
    }

    /**
     * Check if the encryption key is correct
     * @return boolean|string True or Error message
     */
    static function checkKey() {
        $ts = \Yii::app()->request->getPost('ts');
        if (abs(time() - $ts) > 5) {
            return 'The clock is not accurate';
        }
        $key = \Yii::app()->request->getPost('key');
        if ($key != sha1($ts . self::PRIVATE_KEY)) {
            return 'Incorrect hash';
        }
        return true;
    }

    /**
     * Git deploy the master branch on the slaves
     */
    static function slavesGitDeploy() {
        $allSlaves = \Yii::app()->cache->get(self::SLAVE_NODES);
        if (!empty($allSlaves)) {
            foreach ($allSlaves as $slave) {
                if ($slave->active) {
                    $url = 'http://' . $slave->ip . self::GIT_DEPLOY_URL;
                    $res = file_get_contents($url);
                    \Utils::dbgYiiLog("Git deploy to slave {$slave->ip} result: $res");
                }
            }
        }
    }

    static function slaveLabor($ip, $input) {
        $url = "http://{$ip}/api3d/search";
        $content = json_encode($input);
        $res = \Utils::curl($url, $content);
        return empty($res['error']) ? $res['result'] : $res['error'];
    }

}

class Slave {

    public $ip;
    public $id;
    public $active = false;
    public $cpuCores;
    public $lastResult;

}
