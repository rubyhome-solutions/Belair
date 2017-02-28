<?php

// This class was automatically generated by build task
// You should not change it manually as it will be overwritten on next build
// @codingStandardsIgnoreFile


use \Codeception\Maybe;
use Codeception\Module\CodeHelper;

/**
 * Inherited methods
 * @method void execute($callable)
 * @method void wantToTest($text)
 * @method void wantTo($text)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void offsetGet($offset)
 * @method void offsetSet($offset, $value)
 * @method void offsetExists($offset)
 * @method void offsetUnset($offset)
 */
class CodeGuy extends \Codeception\AbstractGuy {

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param string $text
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodeText()
     * @return \Codeception\Maybe
     */
    public function canSeeNodeText($node, $text) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodeText', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param string $text
     * @see Codeception\Module\CodeHelper::seeNodeText()
     * @return \Codeception\Maybe
     */
    public function seeNodeText($node, $text) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodeText', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param $pattern $text
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodePattern()
     * @return \Codeception\Maybe
     */
    public function canSeeNodePattern($node, $pattern) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodePattern', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param $pattern $text
     * @see Codeception\Module\CodeHelper::seeNodePattern()
     * @return \Codeception\Maybe
     */
    public function seeNodePattern($node, $pattern) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodePattern', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodeEmpty()
     * @return \Codeception\Maybe
     */
    public function canSeeNodeEmpty($node) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodeEmpty', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @see Codeception\Module\CodeHelper::seeNodeEmpty()
     * @return \Codeception\Maybe
     */
    public function seeNodeEmpty($node) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodeEmpty', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param mixed $cssClass
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodeCssClass()
     * @return \Codeception\Maybe
     */
    public function canSeeNodeCssClass($node, $cssClass) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodeCssClass', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param mixed $cssClass
     * @see Codeception\Module\CodeHelper::seeNodeCssClass()
     * @return \Codeception\Maybe
     */
    public function seeNodeCssClass($node, $cssClass) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodeCssClass', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param mixed $cssClass
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::dontSeeNodeCssClass()
     * @return \Codeception\Maybe
     */
    public function cantSeeNodeCssClass($node, $cssClass) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('dontSeeNodeCssClass', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param mixed $cssClass
     * @see Codeception\Module\CodeHelper::dontSeeNodeCssClass()
     * @return \Codeception\Maybe
     */
    public function dontSeeNodeCssClass($node, $cssClass) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('dontSeeNodeCssClass', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param string $cssStyle
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodeCssStyle()
     * @return \Codeception\Maybe
     */
    public function canSeeNodeCssStyle($node, $cssStyle) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodeCssStyle', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param string $cssStyle
     * @see Codeception\Module\CodeHelper::seeNodeCssStyle()
     * @return \Codeception\Maybe
     */
    public function seeNodeCssStyle($node, $cssStyle) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodeCssStyle', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param string $cssStyle
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::dontSeeNodeCssStyle()
     * @return \Codeception\Maybe
     */
    public function cantSeeNodeCssStyle($node, $cssStyle) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('dontSeeNodeCssStyle', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param string $cssStyle
     * @see Codeception\Module\CodeHelper::dontSeeNodeCssStyle()
     * @return \Codeception\Maybe
     */
    public function dontSeeNodeCssStyle($node, $cssStyle) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('dontSeeNodeCssStyle', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param string $name
     * @param string $value
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodeAttribute()
     * @return \Codeception\Maybe
     */
    public function canSeeNodeAttribute($node, $name, $value = null) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodeAttribute', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param string $name
     * @param string $value
     * @see Codeception\Module\CodeHelper::seeNodeAttribute()
     * @return \Codeception\Maybe
     */
    public function seeNodeAttribute($node, $name, $value = null) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodeAttribute', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $name
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::dontSeeNodeAttribute()
     * @return \Codeception\Maybe
     */
    public function cantSeeNodeAttribute($node, $name) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('dontSeeNodeAttribute', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $name
     * @see Codeception\Module\CodeHelper::dontSeeNodeAttribute()
     * @return \Codeception\Maybe
     */
    public function dontSeeNodeAttribute($node, $name) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('dontSeeNodeAttribute', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $attributes
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodeAttributes()
     * @return \Codeception\Maybe
     */
    public function canSeeNodeAttributes($node, $attributes) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodeAttributes', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $attributes
     * @see Codeception\Module\CodeHelper::seeNodeAttributes()
     * @return \Codeception\Maybe
     */
    public function seeNodeAttributes($node, $attributes) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodeAttributes', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $attributes
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::dontSeeNodeAttributes()
     * @return \Codeception\Maybe
     */
    public function cantSeeNodeAttributes($node, $attributes) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('dontSeeNodeAttributes', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $attributes
     * @see Codeception\Module\CodeHelper::dontSeeNodeAttributes()
     * @return \Codeception\Maybe
     */
    public function dontSeeNodeAttributes($node, $attributes) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('dontSeeNodeAttributes', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $elements
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodeChildren()
     * @return \Codeception\Maybe
     */
    public function canSeeNodeChildren($node, $elements) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodeChildren', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $elements
     * @see Codeception\Module\CodeHelper::seeNodeChildren()
     * @return \Codeception\Maybe
     */
    public function seeNodeChildren($node, $elements) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodeChildren', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $elements
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::dontSeeNodeChildren()
     * @return \Codeception\Maybe
     */
    public function cantSeeNodeChildren($node, $elements) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('dontSeeNodeChildren', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param array $elements
     * @see Codeception\Module\CodeHelper::dontSeeNodeChildren()
     * @return \Codeception\Maybe
     */
    public function dontSeeNodeChildren($node, $elements) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('dontSeeNodeChildren', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param integer $amount
     * Conditional Assertion: Test won't be stopped on fail
     * @see Codeception\Module\CodeHelper::seeNodeNumChildren()
     * @return \Codeception\Maybe
     */
    public function canSeeNodeNumChildren($node, $amount) {
        $this->scenario->addStep(new \Codeception\Step\ConditionalAssertion('seeNodeNumChildren', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param \Symfony\Component\DomCrawler\Crawler $node
     * @param integer $amount
     * @see Codeception\Module\CodeHelper::seeNodeNumChildren()
     * @return \Codeception\Maybe
     */
    public function seeNodeNumChildren($node, $amount) {
        $this->scenario->addStep(new \Codeception\Step\Assertion('seeNodeNumChildren', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

    /**
     * This method is generated.
     * Documentation taken from corresponding module.
     * ----------------------------------------------
     *
     * @param mixed $content
     * @param string $filter
     * @return \Symfony\Component\DomCrawler\Crawler
     * @see Codeception\Module\CodeHelper::createNode()
     * @return \Codeception\Maybe
     */
    public function createNode($content, $filter = null) {
        $this->scenario->addStep(new \Codeception\Step\Action('createNode', func_get_args()));
        if ($this->scenario->running()) {
            $result = $this->scenario->runStep();
            return new Maybe($result);
        }
        return new Maybe();
    }

}
