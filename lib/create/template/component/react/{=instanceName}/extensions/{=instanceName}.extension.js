var ExtensionBase = require('tau/core/extension.base');

module.exports = ExtensionBase.extend({
    'bus afterRender': function () {
        this.fire('props.ready', {});
    }
});


