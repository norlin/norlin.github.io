(function(){dust.register("layout-test",body_0);function body_0(chk,ctx){return chk.write("<!doctype html><html lang=\"ru\"><head><meta charset=\"UTF-8\" />\n<title>").exists(ctx.get("title"),ctx,{"else":body_1,"block":body_2},null).write("</title>").section(ctx.getPath(false,["layout","styles"]),ctx,{"block":body_3},null).exists(ctx.getPath(false,["layout","stylesIE"]),ctx,{"block":body_4},null).write("</head><body><div id=\"mocha\"></div>").section(ctx.getPath(false,["layout","scriptsTest"]),ctx,{"block":body_6},null).write("<script type=\"text/javascript\">mocha.ui('bdd');mocha.reporter('html');</script>").section(ctx.getPath(false,["layout","scriptsTestCases"]),ctx,{"block":body_7},null).write("<div id=\"layout\" class=\"g-layout\">Загрузка...</div>").section(ctx.getPath(false,["layout","scripts"]),ctx,{"block":body_8},null).write("\n<script type=\"text/javascript\">if (window.mochaPhantomJS) { mochaPhantomJS.run(); }else { mocha.run(); }</script></body></html>");}function body_1(chk,ctx){return chk.write("Медтера");}function body_2(chk,ctx){return chk.reference(ctx.get("title"),ctx,"h");}function body_3(chk,ctx){return chk.write("\n<link rel=\"stylesheet\" href=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" />");}function body_4(chk,ctx){return chk.write("\n<!--[if IE]>").section(ctx.getPath(false,["layout","stylesIE"]),ctx,{"block":body_5},null).write("\n<![endif]-->");}function body_5(chk,ctx){return chk.write("\n<link rel=\"stylesheet\" href=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" />");}function body_6(chk,ctx){return chk.write("\n<script src=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" type=\"text/javascript\"></script>");}function body_7(chk,ctx){return chk.write("\n<script src=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" type=\"text/javascript\"></script>");}function body_8(chk,ctx){return chk.write("\n<script src=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" type=\"text/javascript\"></script>");}return body_0;})();
/* file: layout-test.dust */
(function(){dust.register("layout",body_0);function body_0(chk,ctx){return chk.write("<!doctype html><html lang=\"ru\"><head><meta charset=\"UTF-8\" />\n<title>").exists(ctx.get("title"),ctx,{"else":body_1,"block":body_2},null).write("</title>").section(ctx.getPath(false,["layout","styles"]),ctx,{"block":body_3},null).exists(ctx.getPath(false,["layout","stylesIE"]),ctx,{"block":body_4},null).section(ctx.getPath(false,["layout","scripts"]),ctx,{"block":body_6},null).write("<script src=\"http://api-maps.yandex.ru/2.0/?load=package.standard&lang=ru-RU\" type=\"text/javascript\"></script></head><body><div id=\"layout\" class=\"g-layout\"></div><div class=\"b-loader_curtain g-transition-opacity\"></div><div class=\"b-loader_block g-transition-opacity\"><i class=\"b-loader\"></i>Загрузка...</div></body></html>");}function body_1(chk,ctx){return chk.write("Медтера");}function body_2(chk,ctx){return chk.reference(ctx.get("title"),ctx,"h");}function body_3(chk,ctx){return chk.write("\n<link rel=\"stylesheet\" href=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" />");}function body_4(chk,ctx){return chk.write("\n<!--[if IE]>").section(ctx.getPath(false,["layout","stylesIE"]),ctx,{"block":body_5},null).write("\n<![endif]-->");}function body_5(chk,ctx){return chk.write("\n<link rel=\"stylesheet\" href=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" />");}function body_6(chk,ctx){return chk.write("\n<script src=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\" type=\"text/javascript\"></script>");}return body_0;})();
/* file: layout.dust */
(function(){dust.register("module.css",body_0);function body_0(chk,ctx){return chk.write(".b-").reference(ctx.get("moduleName"),ctx,"h").write(" {position: relative;}");}return body_0;})();
/* file: module.css.dust */
(function(){dust.register("module",body_0);function body_0(chk,ctx){return chk.write("<").reference(ctx.get("node"),ctx,"h").write(" data-type=\"module\" data-name=\"").reference(ctx.get("moduleName"),ctx,"h").write("\">").reference(ctx.get("body"),ctx,"h").write("</").reference(ctx.get("node"),ctx,"h").write(">");}return body_0;})();
/* file: module.dust */
(function(){dust.register("module.dust",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-").reference(ctx.get("moduleName"),ctx,"h").write("\">{module.content|s}</div>");}return body_0;})();
/* file: module.dust.dust */
(function(){dust.register("module.js",body_0);function body_0(chk,ctx){return chk.write("/* global app */(function ($, app) {var ").reference(ctx.get("ModuleName"),ctx,"h").write(" = app.createModule({name: '").reference(ctx.get("moduleName"),ctx,"h").write("',template: '").reference(ctx.get("moduleName"),ctx,"h").write("'});/*").reference(ctx.get("ModuleName"),ctx,"h").write(".prototype.render = function (ready) {var module = this,moduleSource = this.data.dom; //`<div data-type=\"module\">` node from app templatethis.processDOM();//method for custom html rendererdust.render(this.name + '/' + this.template, this.data, function (err, moduleHtml) {module.node = $(moduleHtml);ready();});};*/").reference(ctx.get("ModuleName"),ctx,"h").write(".prototype.ready = function () {var module = this;//module usage};} (jQuery, app));/* global -app */");}return body_0;})();
/* file: module.js.dust */
(function(){dust.register("module.test.js",body_0);function body_0(chk,ctx){return chk.write("var assert = chai.assert;describe('Существование модуля', function() {var module;before(function () {module = $('.b-").reference(ctx.get("moduleName"),ctx,"h").write("');});/*//не обязательно, т.к. модуль может подключаться динамическиit('должен быть в dom', function(){assert.notEqual(module.length, '0', 'Должен быть в dom');});*/});");}return body_0;})();
/* file: module.test.js.dust */