(function() {
/**
 * Подключение dust-хэлперов для node.js и browser использования
 */

    var helpers = {};

    function addHelpers (dust) {
        var helper;

        dust.helpers = dust.helpers || {};

        for (helper in helpers) {
            if (helpers.hasOwnProperty(helper)) {
                dust.helpers[helper] = helpers[helper];
            }
        }
    }

    /* HELPERS HERE */

    helpers.my = function (chunk, ctx, bodies, params) {
        var body = bodies.block,
            //content,
            moduleTypes = {
                table: {
                    node: 'table'
                },
                form: {
                    node: 'form'
                }
            },
            moduleType = dust.helpers.tap(params.module, chunk, ctx),
            moduleParams = moduleTypes[moduleType] || {},
            paramName,
            saveData;

        for (paramName in params) {
            if (params.hasOwnProperty(paramName)) {
                moduleParams[paramName] = dust.helpers.tap(params[paramName], chunk, ctx);
            }
        }

        moduleParams.node = moduleParams.node || 'div';

        function createModuleHtml (moduleParams, content) {
            var opt = '';
            content = content || '';

            opt = "data-options='" + JSON.stringify(moduleParams) + "'";

            return '<' + moduleParams.node + ' data-type="module" data-name="' + moduleParams.module + '" ' + opt + '>' + content + '</' + moduleParams.node + '>';
        }

        if (bodies.json) {
            saveData = chunk.data;
            ctx = ctx.push(params);
            chunk.data = [];
            moduleParams.json = bodies.json(chunk, ctx).data.join('');
            moduleParams.json = JSON.parse(moduleParams.json);
            chunk.data = saveData;
        }

        if (body) {
            return chunk.capture(body, ctx, function(string, chunk) {
                chunk.end(createModuleHtml(moduleParams, string));
            });
        }

        return chunk.write(createModuleHtml(moduleParams));
    };

    /* end helpers */

    /* global module */
    if (typeof(module) !== 'undefined') {
        module.exports = addHelpers;
    } else if (typeof(dust) !== 'undefined') {
        addHelpers(dust);
    } else {
        throw "Can't find Dust!";
    }
}());