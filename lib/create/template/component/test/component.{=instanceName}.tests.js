define(function(require) {
    'use strict';
    var Component = require('tau/components/component.{=name}'),
        $ = require('jQuery'),
        sinon = require('libs.tests/Sinon'),
        TestKit = require('tests.async/testkit/testkit.component');

    var testKit = new TestKit(Component);
    testKit.registerSetup('component.initialize', function(test, next) {
        var configurator = test.get('configurator');
        var componentBus = test.get('componentBus');

        componentBus.initialize({});
        next();
    });

    var testCase = {
        name: 'component.{=name}.tests'
    };

    testCase['should render content'] = testKit.test(function(test) {
        return testKit.flow(test, {
            'bus afterRender[0]': function(evt, renderData) {
                test.done('fail');
            }
        });
    });

    return testCase;
});