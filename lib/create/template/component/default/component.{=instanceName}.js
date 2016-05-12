var ComponentCreator = require('./component.creator');
var Template = require('./{=name}/templates/{=name}.template.html');

var MainExtension = require('./{=name}/extensions/{=name}.extension');
var Model = require('./{=name}/models/{=name}.model');

module.exports = {
    create: function (config) {
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
