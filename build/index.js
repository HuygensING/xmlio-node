"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const puppeteer_1 = tslib_1.__importDefault(require("puppeteer"));
function logWarning(warning) {
    console.log(`[WARNING] ${warning}`);
}
function XMLioNode(xml, transformers = [], exporters = [], options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = yield browser.newPage();
        page.on('console', (msg) => {
            msg = msg.text();
            if (msg.slice(0, 7) === 'WARNING')
                logWarning(msg.slice(7));
            else
                console.log('From page: ', msg);
        });
        yield page.addScriptTag({
            path: './node_modules/xmlio/dist/bundle.js'
        });
        let transformerString = '';
        if (Array.isArray(transformers)) {
            transformerString = JSON.stringify(transformers.map(transformer => {
                if (transformer.type === 'replace' && typeof transformer.sourceSelectorFunc !== 'string') {
                    transformer.sourceSelectorFunc = transformer.sourceSelectorFunc.toString();
                }
                if (transformer.type === 'change' && typeof transformer.changeFunc !== 'string') {
                    transformer.changeFunc = transformer.changeFunc.toString();
                }
                return transformer;
            }));
        }
        else {
            transformerString = transformers.toString();
        }
        const output = yield page.evaluate(function (xml, transformers, exporters, options, transformerArray) {
            const unwrapStringFunction = (func) => {
                const outerFunc = new Function(`return ${func}`);
                return outerFunc();
            };
            const xmlio = new XMLio(xml, JSON.parse(options));
            if (transformerArray) {
                JSON.parse(transformers).forEach((t) => {
                    if (t.type === 'replace') {
                        t.sourceSelectorFunc = unwrapStringFunction(t.sourceSelectorFunc);
                    }
                    if (t.type === 'change') {
                        t.changeFunc = unwrapStringFunction(t.changeFunc);
                    }
                    return xmlio.addTransform(t);
                });
            }
            else {
                unwrapStringFunction(transformers)(xmlio);
            }
            return xmlio.export(JSON.parse(exporters));
        }, xml, transformerString, JSON.stringify(exporters), JSON.stringify(options), Array.isArray(transformers));
        browser.close();
        return output;
    });
}
exports.default = XMLioNode;
