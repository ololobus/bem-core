var BEM = require('bem'),
    Q = BEM.require('q'),
    PATH = require('path'),
    compat = require('bemhtml-compat');

exports.API_VER = 2;

exports.techMixin = {

    getBuildSuffixesMap: function() {
        return {
            'bemhtml.js': ['bemhtml', 'bemhtml.xjst']
        };
    },

    getCreateSuffixes : function() {
        return ['bemhtml'];
    },

    getBuildResultChunk : function(relPath, path, suffix) {
        var content = this.readContent(path, suffix);
        return (suffix !== 'bemhtml.xjst' ?
            content.then(function(source) { return compat.transpile(source); }) :
            content)
                .then(function(source) {
                    return '\n/* begin: ' + relPath + ' */\n' +
                        source +
                        '\n/* end: ' + relPath + ' */\n';
                });
    },

    getBuildResult : function(files, suffix, output, opts) {
        var _t = this;
        return this.__base(files, suffix, output, opts)
            .then(_t.getCompiledResult.bind(_t));
    },

    getCompiledResult : function(sources) {
        sources = sources.join('\n');

        var BEMHTML = require('bem-xjst/lib/bemhtml'),
            exportName = this.getExportName(),
            optimize = process.env[exportName + '_ENV'] != 'development';

        return BEMHTML.generate(sources, {
            wrap: true,
            exportName: exportName,
            optimize: optimize,
            cache   : optimize && process.env[exportName + '_CACHE'] == 'on'
        });
    },

    getExportName: function() {
        return 'BEMHTML';
    }

};
