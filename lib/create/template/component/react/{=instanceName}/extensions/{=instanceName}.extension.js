define(function(require) {
    var ExtensionBase = require('tau/core/extension.base');

    return ExtensionBase.extend({
        'bus afterRender': function() {
            this.fire('props.ready',{});
        }
    });
});

