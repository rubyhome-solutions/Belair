'use strict';

var Component = require('core/component'),
    $ = require('jquery'),
    _ = require('lodash')
    ;

var
    LARGE = 'large',
    DISABLED = 'disabled',
    LOADING = 'icon loading',
    DECORATED = 'decorated',
    ERROR = 'error',
    IN = 'in',
    SEARCH = 'search',
    INPUT = 'input'
    ;

module.exports = Component.extend({
    isolated: true,
    template: require('templates/components/form/mobileselect.html'),

    data: function() {
        return {
            classes: function() {
                var data = this.get(),
                    classes = [];

                if (_.isObject(data.state)) {
                    if (data.state.disabled || data.state.submitting) classes.push(DISABLED);
                    if (data.state.loading) classes.push(LOADING);
                    if (data.state.error) classes.push(ERROR);

                }

                if (data.large) {
                    classes.push(INPUT);
                    classes.push(DECORATED);
                    classes.push(LARGE);

                    if (data.value || data.focus) {
                        classes.push(IN);
                    }
                }

                if (data.search) {
                    classes.push(SEARCH);
                }

                if (data.disabled) {
                    classes.push(DISABLED);
                }


                return classes.join(' ');
            }
        };
    },

    oncomplete: function() {
        var view = this, o;

        var el = $('.popup', view.el).mobiscroll().select({
                       buttons: [],
                       onSelect: function (v, inst) {
                           
                            $(view.el).find('.tt').text(v);
                            var value= _.result(_.find(titles, {'name': _.parseInt(v)}), 'id');
                            view.set('traveler.title_id',value);
                           // console.log(view.get('traveler'));
                       },
                       onValueTap: function (v, inst) { 
                          // console.log('pp');
                           var titles =view.get('options');
                           var title=v.context.attributes['data-val'].nodeValue;
                           var value= _.result(_.find(titles, {'id': _.parseInt(title)}), 'name');
                           $(view.el).find('.tt').text(value);
                           $('.popup', view.el).mobiscroll('hide');
                           view.set('traveler.title_id',_.parseInt(title));
                           //console.log(view.get('traveler'));
                           //console.log('pp'+title);
                       }
                   });
            ;
        
       
        this.observe('value', function(value) {

            if (value) {
                var options = this.get('options');

                if (options) {
                    var o = _.find(options, {id: value});

                    if (o) {
//                        el.dropdown('set value', o.id);
//                        el.dropdown('set text', o.text);

                        return;
                    }

                }

                return;
            }

//            el.dropdown('restore defaults');


        }, {init: false});

        

    },
selectvalue: function() {
   
       view.set('traveler.title_id',_.parseInt($(this.find('.popup')).val()));
     //  console.log(view.get('traveler'));
      // console.log(view.get('value'));
    },
    onteadown: function() {
        //this.set('options', null);
    },
     dropdownselect: function() {
        
            $('.popup', this.el).mobiscroll('show');
           // console.log('dropdownselect');
        
    },
});