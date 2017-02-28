<?php

namespace application\components\B2bApi;

/**
 * B2bApi Auth
 *
 * @author Boxx
 */
class Auth {

    public $email;
    public $password;

    /**
     * The logged user
     * @var \Users
     */
    public $user = null;

    function authenticate() {
        $user = \Users::model()->findByAttributes([
            'email' => $this->email,
//            'enabled' => 1,
            'b2b_api' => 1,
        ]);
        if (!$user) {
            throw new B2bApiException(B2bApiException::WRONG_EMAIL_OR_API_ACCESS, null, 403);
        }
        if ($user->password !== crypt($this->password, $user->password)) {
            throw new B2bApiException(B2bApiException::WRONG_PASSWORD, null, 403);
        }
        $this->user = $user;
        return true;
    }

    /**
     * Return info about the customer balance
     * @return array
     * @throws B2bApiException
     */
    function getBalance() {
        if ($this->user) {
            return [
                'currency' => $this->user->userInfo->currency->code,
                'balance' => (float)$this->user->userInfo->balance,
                'credit' => (float)$this->user->userInfo->credit_limit,
                'total' => (float)($this->user->userInfo->credit_limit + $this->user->userInfo->balance),
            ];
        }
        throw new B2bApiException(B2bApiException::WRONG_EMAIL_OR_API_ACCESS, null, 404);
    }

}
