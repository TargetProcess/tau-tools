var ComponentCreator = require('tau/components/component.react.creator');
var Editor = require('./{=name}/views/{=name}.view.jsx');
var Extension = require('./{=name}/extensions/{=name}.extension');
var ConfiguratorExtension = require('tau/core/helpers/extension.configurator');

module.exports = ComponentCreator.create(Editor, [Extension, ConfiguratorExtension]);
