// Ractive
var Ractive = require('ractive');
require('ractive-ractive');
require('ractive-transitions-fade');
require('ractive-transitions-slide');

Ractive.defaults.adapt.push('Ractive');
Ractive.DEBUG = false;


require('ractive-transitions-fade');
require('ractive-transitions-slide');

// jQuery and plugins
global.$ = global.jQuery = require('jquery');
require('ionrangeslider/js/ion.rangeSlider');
require('jquery-form');

// Semantic-ui
require('semantic/dist/components/checkbox.js');
require('semantic/dist/components/dropdown.js');
require('semantic/dist/components/visibility.js');
require('semantic/dist/components/transition.js');
require('semantic/dist/components/accordion.js');
require('semantic/dist/components/dimmer.js');
require('semantic/dist/components/modal.js');
require('semantic/dist/components/sidebar.js');
require('semantic/dist/components/popup.js');

// Libs
require('moment');
require('page');