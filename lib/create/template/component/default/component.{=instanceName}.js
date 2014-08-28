define(function(require) {
    var ComponentCreator = require('./component.creator'),
        Template = require('template!./{=name}/templates/{=name}.template'),

        MainExtension = require('./{=name}/extensions/{=name}.extension'),
        Model = require('./{=name}/extensions/{=name}.model');

    return {
        create: function(config) {
            config = config || {};

            var creatorConfig = {
                extensions: [
                    MainExtension,
                    Model
                ],
                template: Template
            };

            return ComponentCreator.create(creatorConfig, config);
        }
    };
});