define(function(require) {

    var ComponentCreator = require('tau/components/component.react.creator');
    var Editor = require('jsx!./{=name}/views/{=name}.view');
    var Extension = require('./{=name}/extensions/{=name}.extension');
    var ConfiguratorExtension = require('tau/core/helpers/extension.configurator');

    return ComponentCreator.create(Editor, [Extension, ConfiguratorExtension]);
});