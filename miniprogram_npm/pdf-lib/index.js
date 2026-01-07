module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1767772065458, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./api/index"), exports);
tslib_1.__exportStar(require("./core/index"), exports);
tslib_1.__exportStar(require("./types/index"), exports);
tslib_1.__exportStar(require("./utils/index"), exports);
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./api/index":1767772065459,"./core/index":1767772065466,"./types/index":1767772065593,"./utils/index":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065459, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./form"), exports);
tslib_1.__exportStar(require("./text"), exports);
tslib_1.__exportStar(require("./colors"), exports);
tslib_1.__exportStar(require("./errors"), exports);
tslib_1.__exportStar(require("./image"), exports);
tslib_1.__exportStar(require("./objects"), exports);
tslib_1.__exportStar(require("./operations"), exports);
tslib_1.__exportStar(require("./operators"), exports);
tslib_1.__exportStar(require("./rotations"), exports);
tslib_1.__exportStar(require("./sizes"), exports);
tslib_1.__exportStar(require("./PDFPageOptions"), exports);
tslib_1.__exportStar(require("./PDFDocumentOptions"), exports);
tslib_1.__exportStar(require("./StandardFonts"), exports);
var PDFDocument_1 = require("./PDFDocument");
Object.defineProperty(exports, "PDFDocument", { enumerable: true, get: function () { return PDFDocument_1.default; } });
var PDFFont_1 = require("./PDFFont");
Object.defineProperty(exports, "PDFFont", { enumerable: true, get: function () { return PDFFont_1.default; } });
var PDFImage_1 = require("./PDFImage");
Object.defineProperty(exports, "PDFImage", { enumerable: true, get: function () { return PDFImage_1.default; } });
var PDFPage_1 = require("./PDFPage");
Object.defineProperty(exports, "PDFPage", { enumerable: true, get: function () { return PDFPage_1.default; } });
var PDFEmbeddedPage_1 = require("./PDFEmbeddedPage");
Object.defineProperty(exports, "PDFEmbeddedPage", { enumerable: true, get: function () { return PDFEmbeddedPage_1.default; } });
var PDFJavaScript_1 = require("./PDFJavaScript");
Object.defineProperty(exports, "PDFJavaScript", { enumerable: true, get: function () { return PDFJavaScript_1.default; } });
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./form":1767772065460,"./text":1767772065592,"./colors":1767772065463,"./errors":1767772065567,"./image":1767772065578,"./objects":1767772065465,"./operations":1767772065462,"./operators":1767772065464,"./rotations":1767772065564,"./sizes":1767772065586,"./PDFPageOptions":1767772065591,"./PDFDocumentOptions":1767772065587,"./StandardFonts":1767772065585,"./PDFDocument":1767772065571,"./PDFFont":1767772065573,"./PDFImage":1767772065574,"./PDFPage":1767772065570,"./PDFEmbeddedPage":1767772065572,"./PDFJavaScript":1767772065589}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065460, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./appearances"), exports);
var PDFButton_1 = require("./PDFButton");
Object.defineProperty(exports, "PDFButton", { enumerable: true, get: function () { return PDFButton_1.default; } });
var PDFCheckBox_1 = require("./PDFCheckBox");
Object.defineProperty(exports, "PDFCheckBox", { enumerable: true, get: function () { return PDFCheckBox_1.default; } });
var PDFDropdown_1 = require("./PDFDropdown");
Object.defineProperty(exports, "PDFDropdown", { enumerable: true, get: function () { return PDFDropdown_1.default; } });
var PDFField_1 = require("./PDFField");
Object.defineProperty(exports, "PDFField", { enumerable: true, get: function () { return PDFField_1.default; } });
var PDFForm_1 = require("./PDFForm");
Object.defineProperty(exports, "PDFForm", { enumerable: true, get: function () { return PDFForm_1.default; } });
var PDFOptionList_1 = require("./PDFOptionList");
Object.defineProperty(exports, "PDFOptionList", { enumerable: true, get: function () { return PDFOptionList_1.default; } });
var PDFRadioGroup_1 = require("./PDFRadioGroup");
Object.defineProperty(exports, "PDFRadioGroup", { enumerable: true, get: function () { return PDFRadioGroup_1.default; } });
var PDFSignature_1 = require("./PDFSignature");
Object.defineProperty(exports, "PDFSignature", { enumerable: true, get: function () { return PDFSignature_1.default; } });
var PDFTextField_1 = require("./PDFTextField");
Object.defineProperty(exports, "PDFTextField", { enumerable: true, get: function () { return PDFTextField_1.default; } });
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./appearances":1767772065461,"./PDFButton":1767772065569,"./PDFCheckBox":1767772065576,"./PDFDropdown":1767772065580,"./PDFField":1767772065577,"./PDFForm":1767772065575,"./PDFOptionList":1767772065581,"./PDFRadioGroup":1767772065582,"./PDFSignature":1767772065583,"./PDFTextField":1767772065584}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065461, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptionListAppearanceProvider = exports.defaultDropdownAppearanceProvider = exports.defaultTextFieldAppearanceProvider = exports.defaultButtonAppearanceProvider = exports.defaultRadioGroupAppearanceProvider = exports.defaultCheckBoxAppearanceProvider = exports.normalizeAppearance = void 0;
var tslib_1 = require("tslib");
var operations_1 = require("../operations");
var colors_1 = require("../colors");
var rotations_1 = require("../rotations");
var layout_1 = require("../text/layout");
var alignment_1 = require("../text/alignment");
var operators_1 = require("../operators");
var utils_1 = require("../../utils");
/********************* Appearance Provider Functions **************************/
exports.normalizeAppearance = function (appearance) {
    if ('normal' in appearance)
        return appearance;
    return { normal: appearance };
};
// Examples:
//   `/Helv 12 Tf` -> ['/Helv 12 Tf', 'Helv', '12']
//   `/HeBo 8.00 Tf` -> ['/HeBo 8 Tf', 'HeBo', '8.00']
var tfRegex = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]+(\d*\.\d+|\d+)[\0\t\n\f\r\ ]+Tf/;
var getDefaultFontSize = function (field) {
    var _a, _b;
    var da = (_a = field.getDefaultAppearance()) !== null && _a !== void 0 ? _a : '';
    var daMatch = (_b = utils_1.findLastMatch(da, tfRegex).match) !== null && _b !== void 0 ? _b : [];
    var defaultFontSize = Number(daMatch[2]);
    return isFinite(defaultFontSize) ? defaultFontSize : undefined;
};
// Examples:
//   `0.3 g` -> ['0.3', 'g']
//   `0.3 1 .3 rg` -> ['0.3', '1', '.3', 'rg']
//   `0.3 1 .3 0 k` -> ['0.3', '1', '.3', '0', 'k']
var colorRegex = /(\d*\.\d+|\d+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+(g|rg|k)/;
var getDefaultColor = function (field) {
    var _a;
    var da = (_a = field.getDefaultAppearance()) !== null && _a !== void 0 ? _a : '';
    var daMatch = utils_1.findLastMatch(da, colorRegex).match;
    var _b = daMatch !== null && daMatch !== void 0 ? daMatch : [], c1 = _b[1], c2 = _b[2], c3 = _b[3], c4 = _b[4], colorSpace = _b[5];
    if (colorSpace === 'g' && c1) {
        return colors_1.grayscale(Number(c1));
    }
    if (colorSpace === 'rg' && c1 && c2 && c3) {
        return colors_1.rgb(Number(c1), Number(c2), Number(c3));
    }
    if (colorSpace === 'k' && c1 && c2 && c3 && c4) {
        return colors_1.cmyk(Number(c1), Number(c2), Number(c3), Number(c4));
    }
    return undefined;
};
var updateDefaultAppearance = function (field, color, font, fontSize) {
    var _a;
    if (fontSize === void 0) { fontSize = 0; }
    var da = [
        colors_1.setFillingColor(color).toString(),
        operators_1.setFontAndSize((_a = font === null || font === void 0 ? void 0 : font.name) !== null && _a !== void 0 ? _a : 'dummy__noop', fontSize).toString(),
    ].join('\n');
    field.setDefaultAppearance(da);
};
exports.defaultCheckBoxAppearanceProvider = function (checkBox, widget) {
    var _a, _b, _c;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(checkBox.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
    var rotation = rotations_1.reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _d = rotations_1.adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
    var rotate = operations_1.rotateInPlace(tslib_1.__assign(tslib_1.__assign({}, rectangle), { rotation: rotation }));
    var black = colors_1.rgb(0, 0, 0);
    var borderColor = (_b = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor())) !== null && _b !== void 0 ? _b : black;
    var normalBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var downBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
    // Update color
    var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
    if (widgetColor) {
        updateDefaultAppearance(widget, textColor);
    }
    else {
        updateDefaultAppearance(checkBox.acroField, textColor);
    }
    var options = {
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        thickness: 1.5,
        borderWidth: borderWidth,
        borderColor: borderColor,
        markColor: textColor,
    };
    return {
        normal: {
            on: tslib_1.__spreadArrays(rotate, operations_1.drawCheckBox(tslib_1.__assign(tslib_1.__assign({}, options), { color: normalBackgroundColor, filled: true }))),
            off: tslib_1.__spreadArrays(rotate, operations_1.drawCheckBox(tslib_1.__assign(tslib_1.__assign({}, options), { color: normalBackgroundColor, filled: false }))),
        },
        down: {
            on: tslib_1.__spreadArrays(rotate, operations_1.drawCheckBox(tslib_1.__assign(tslib_1.__assign({}, options), { color: downBackgroundColor, filled: true }))),
            off: tslib_1.__spreadArrays(rotate, operations_1.drawCheckBox(tslib_1.__assign(tslib_1.__assign({}, options), { color: downBackgroundColor, filled: false }))),
        },
    };
};
exports.defaultRadioGroupAppearanceProvider = function (radioGroup, widget) {
    var _a, _b, _c;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(radioGroup.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
    var rotation = rotations_1.reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _d = rotations_1.adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
    var rotate = operations_1.rotateInPlace(tslib_1.__assign(tslib_1.__assign({}, rectangle), { rotation: rotation }));
    var black = colors_1.rgb(0, 0, 0);
    var borderColor = (_b = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor())) !== null && _b !== void 0 ? _b : black;
    var normalBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var downBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
    // Update color
    var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
    if (widgetColor) {
        updateDefaultAppearance(widget, textColor);
    }
    else {
        updateDefaultAppearance(radioGroup.acroField, textColor);
    }
    var options = {
        x: width / 2,
        y: height / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth,
        borderColor: borderColor,
        dotColor: textColor,
    };
    return {
        normal: {
            on: tslib_1.__spreadArrays(rotate, operations_1.drawRadioButton(tslib_1.__assign(tslib_1.__assign({}, options), { color: normalBackgroundColor, filled: true }))),
            off: tslib_1.__spreadArrays(rotate, operations_1.drawRadioButton(tslib_1.__assign(tslib_1.__assign({}, options), { color: normalBackgroundColor, filled: false }))),
        },
        down: {
            on: tslib_1.__spreadArrays(rotate, operations_1.drawRadioButton(tslib_1.__assign(tslib_1.__assign({}, options), { color: downBackgroundColor, filled: true }))),
            off: tslib_1.__spreadArrays(rotate, operations_1.drawRadioButton(tslib_1.__assign(tslib_1.__assign({}, options), { color: downBackgroundColor, filled: false }))),
        },
    };
};
exports.defaultButtonAppearanceProvider = function (button, widget, font) {
    var _a, _b, _c, _d, _e;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(button.acroField);
    var widgetFontSize = getDefaultFontSize(widget);
    var fieldFontSize = getDefaultFontSize(button.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var captions = ap === null || ap === void 0 ? void 0 : ap.getCaptions();
    var normalText = (_a = captions === null || captions === void 0 ? void 0 : captions.normal) !== null && _a !== void 0 ? _a : '';
    var downText = (_c = (_b = captions === null || captions === void 0 ? void 0 : captions.down) !== null && _b !== void 0 ? _b : normalText) !== null && _c !== void 0 ? _c : '';
    var borderWidth = (_d = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _d !== void 0 ? _d : 0;
    var rotation = rotations_1.reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _f = rotations_1.adjustDimsForRotation(rectangle, rotation), width = _f.width, height = _f.height;
    var rotate = operations_1.rotateInPlace(tslib_1.__assign(tslib_1.__assign({}, rectangle), { rotation: rotation }));
    var black = colors_1.rgb(0, 0, 0);
    var borderColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
    var normalBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var downBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
    var bounds = {
        x: borderWidth,
        y: borderWidth,
        width: width - borderWidth * 2,
        height: height - borderWidth * 2,
    };
    var normalLayout = layout_1.layoutSinglelineText(normalText, {
        alignment: alignment_1.TextAlignment.Center,
        fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
        font: font,
        bounds: bounds,
    });
    var downLayout = layout_1.layoutSinglelineText(downText, {
        alignment: alignment_1.TextAlignment.Center,
        fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
        font: font,
        bounds: bounds,
    });
    // Update font size and color
    var fontSize = Math.min(normalLayout.fontSize, downLayout.fontSize);
    var textColor = (_e = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _e !== void 0 ? _e : black;
    if (widgetColor || widgetFontSize !== undefined) {
        updateDefaultAppearance(widget, textColor, font, fontSize);
    }
    else {
        updateDefaultAppearance(button.acroField, textColor, font, fontSize);
    }
    var options = {
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth,
        borderColor: borderColor,
        textColor: textColor,
        font: font.name,
        fontSize: fontSize,
    };
    return {
        normal: tslib_1.__spreadArrays(rotate, operations_1.drawButton(tslib_1.__assign(tslib_1.__assign({}, options), { color: normalBackgroundColor, textLines: [normalLayout.line] }))),
        down: tslib_1.__spreadArrays(rotate, operations_1.drawButton(tslib_1.__assign(tslib_1.__assign({}, options), { color: downBackgroundColor, textLines: [downLayout.line] }))),
    };
};
exports.defaultTextFieldAppearanceProvider = function (textField, widget, font) {
    var _a, _b, _c, _d;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(textField.acroField);
    var widgetFontSize = getDefaultFontSize(widget);
    var fieldFontSize = getDefaultFontSize(textField.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var text = (_a = textField.getText()) !== null && _a !== void 0 ? _a : '';
    var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 0;
    var rotation = rotations_1.reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _e = rotations_1.adjustDimsForRotation(rectangle, rotation), width = _e.width, height = _e.height;
    var rotate = operations_1.rotateInPlace(tslib_1.__assign(tslib_1.__assign({}, rectangle), { rotation: rotation }));
    var black = colors_1.rgb(0, 0, 0);
    var borderColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
    var normalBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var textLines;
    var fontSize;
    var padding = textField.isCombed() ? 0 : 1;
    var bounds = {
        x: borderWidth + padding,
        y: borderWidth + padding,
        width: width - (borderWidth + padding) * 2,
        height: height - (borderWidth + padding) * 2,
    };
    if (textField.isMultiline()) {
        var layout = layout_1.layoutMultilineText(text, {
            alignment: textField.getAlignment(),
            fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
            font: font,
            bounds: bounds,
        });
        textLines = layout.lines;
        fontSize = layout.fontSize;
    }
    else if (textField.isCombed()) {
        var layout = layout_1.layoutCombedText(text, {
            fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
            font: font,
            bounds: bounds,
            cellCount: (_c = textField.getMaxLength()) !== null && _c !== void 0 ? _c : 0,
        });
        textLines = layout.cells;
        fontSize = layout.fontSize;
    }
    else {
        var layout = layout_1.layoutSinglelineText(text, {
            alignment: textField.getAlignment(),
            fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
            font: font,
            bounds: bounds,
        });
        textLines = [layout.line];
        fontSize = layout.fontSize;
    }
    // Update font size and color
    var textColor = (_d = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _d !== void 0 ? _d : black;
    if (widgetColor || widgetFontSize !== undefined) {
        updateDefaultAppearance(widget, textColor, font, fontSize);
    }
    else {
        updateDefaultAppearance(textField.acroField, textColor, font, fontSize);
    }
    var options = {
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
        borderColor: borderColor,
        textColor: textColor,
        font: font.name,
        fontSize: fontSize,
        color: normalBackgroundColor,
        textLines: textLines,
        padding: padding,
    };
    return tslib_1.__spreadArrays(rotate, operations_1.drawTextField(options));
};
exports.defaultDropdownAppearanceProvider = function (dropdown, widget, font) {
    var _a, _b, _c;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(dropdown.acroField);
    var widgetFontSize = getDefaultFontSize(widget);
    var fieldFontSize = getDefaultFontSize(dropdown.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var text = (_a = dropdown.getSelected()[0]) !== null && _a !== void 0 ? _a : '';
    var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 0;
    var rotation = rotations_1.reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _d = rotations_1.adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
    var rotate = operations_1.rotateInPlace(tslib_1.__assign(tslib_1.__assign({}, rectangle), { rotation: rotation }));
    var black = colors_1.rgb(0, 0, 0);
    var borderColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
    var normalBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var padding = 1;
    var bounds = {
        x: borderWidth + padding,
        y: borderWidth + padding,
        width: width - (borderWidth + padding) * 2,
        height: height - (borderWidth + padding) * 2,
    };
    var _e = layout_1.layoutSinglelineText(text, {
        alignment: alignment_1.TextAlignment.Left,
        fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
        font: font,
        bounds: bounds,
    }), line = _e.line, fontSize = _e.fontSize;
    // Update font size and color
    var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
    if (widgetColor || widgetFontSize !== undefined) {
        updateDefaultAppearance(widget, textColor, font, fontSize);
    }
    else {
        updateDefaultAppearance(dropdown.acroField, textColor, font, fontSize);
    }
    var options = {
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
        borderColor: borderColor,
        textColor: textColor,
        font: font.name,
        fontSize: fontSize,
        color: normalBackgroundColor,
        textLines: [line],
        padding: padding,
    };
    return tslib_1.__spreadArrays(rotate, operations_1.drawTextField(options));
};
exports.defaultOptionListAppearanceProvider = function (optionList, widget, font) {
    var _a, _b;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(optionList.acroField);
    var widgetFontSize = getDefaultFontSize(widget);
    var fieldFontSize = getDefaultFontSize(optionList.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
    var rotation = rotations_1.reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _c = rotations_1.adjustDimsForRotation(rectangle, rotation), width = _c.width, height = _c.height;
    var rotate = operations_1.rotateInPlace(tslib_1.__assign(tslib_1.__assign({}, rectangle), { rotation: rotation }));
    var black = colors_1.rgb(0, 0, 0);
    var borderColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
    var normalBackgroundColor = colors_1.componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var options = optionList.getOptions();
    var selected = optionList.getSelected();
    if (optionList.isSorted())
        options.sort();
    var text = '';
    for (var idx = 0, len = options.length; idx < len; idx++) {
        text += options[idx];
        if (idx < len - 1)
            text += '\n';
    }
    var padding = 1;
    var bounds = {
        x: borderWidth + padding,
        y: borderWidth + padding,
        width: width - (borderWidth + padding) * 2,
        height: height - (borderWidth + padding) * 2,
    };
    var _d = layout_1.layoutMultilineText(text, {
        alignment: alignment_1.TextAlignment.Left,
        fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
        font: font,
        bounds: bounds,
    }), lines = _d.lines, fontSize = _d.fontSize, lineHeight = _d.lineHeight;
    var selectedLines = [];
    for (var idx = 0, len = lines.length; idx < len; idx++) {
        var line = lines[idx];
        if (selected.includes(line.text))
            selectedLines.push(idx);
    }
    var blue = colors_1.rgb(153 / 255, 193 / 255, 218 / 255);
    // Update font size and color
    var textColor = (_b = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _b !== void 0 ? _b : black;
    if (widgetColor || widgetFontSize !== undefined) {
        updateDefaultAppearance(widget, textColor, font, fontSize);
    }
    else {
        updateDefaultAppearance(optionList.acroField, textColor, font, fontSize);
    }
    return tslib_1.__spreadArrays(rotate, operations_1.drawOptionList({
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
        borderColor: borderColor,
        textColor: textColor,
        font: font.name,
        fontSize: fontSize,
        color: normalBackgroundColor,
        textLines: lines,
        lineHeight: lineHeight,
        selectedColor: blue,
        selectedLines: selectedLines,
        padding: padding,
    }));
};
//# sourceMappingURL=appearances.js.map
}, function(modId) { var map = {"../operations":1767772065462,"../colors":1767772065463,"../rotations":1767772065564,"../text/layout":1767772065566,"../text/alignment":1767772065568,"../operators":1767772065464,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065462, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.drawOptionList = exports.drawTextField = exports.drawTextLines = exports.drawButton = exports.drawRadioButton = exports.drawCheckBox = exports.rotateInPlace = exports.drawCheckMark = exports.drawSvgPath = exports.drawEllipse = exports.drawEllipsePath = exports.drawRectangle = exports.drawLine = exports.drawPage = exports.drawImage = exports.drawLinesOfText = exports.drawText = void 0;
var tslib_1 = require("tslib");
var colors_1 = require("./colors");
var operators_1 = require("./operators");
var rotations_1 = require("./rotations");
var svgPath_1 = require("./svgPath");
var objects_1 = require("./objects");
exports.drawText = function (line, options) {
    return [
        operators_1.pushGraphicsState(),
        options.graphicsState && operators_1.setGraphicsState(options.graphicsState),
        operators_1.beginText(),
        colors_1.setFillingColor(options.color),
        operators_1.setFontAndSize(options.font, options.size),
        operators_1.rotateAndSkewTextRadiansAndTranslate(rotations_1.toRadians(options.rotate), rotations_1.toRadians(options.xSkew), rotations_1.toRadians(options.ySkew), options.x, options.y),
        operators_1.showText(line),
        operators_1.endText(),
        operators_1.popGraphicsState(),
    ].filter(Boolean);
};
exports.drawLinesOfText = function (lines, options) {
    var operators = [
        operators_1.pushGraphicsState(),
        options.graphicsState && operators_1.setGraphicsState(options.graphicsState),
        operators_1.beginText(),
        colors_1.setFillingColor(options.color),
        operators_1.setFontAndSize(options.font, options.size),
        operators_1.setLineHeight(options.lineHeight),
        operators_1.rotateAndSkewTextRadiansAndTranslate(rotations_1.toRadians(options.rotate), rotations_1.toRadians(options.xSkew), rotations_1.toRadians(options.ySkew), options.x, options.y),
    ].filter(Boolean);
    for (var idx = 0, len = lines.length; idx < len; idx++) {
        operators.push(operators_1.showText(lines[idx]), operators_1.nextLine());
    }
    operators.push(operators_1.endText(), operators_1.popGraphicsState());
    return operators;
};
exports.drawImage = function (name, options) {
    return [
        operators_1.pushGraphicsState(),
        options.graphicsState && operators_1.setGraphicsState(options.graphicsState),
        operators_1.translate(options.x, options.y),
        operators_1.rotateRadians(rotations_1.toRadians(options.rotate)),
        operators_1.scale(options.width, options.height),
        operators_1.skewRadians(rotations_1.toRadians(options.xSkew), rotations_1.toRadians(options.ySkew)),
        operators_1.drawObject(name),
        operators_1.popGraphicsState(),
    ].filter(Boolean);
};
exports.drawPage = function (name, options) {
    return [
        operators_1.pushGraphicsState(),
        options.graphicsState && operators_1.setGraphicsState(options.graphicsState),
        operators_1.translate(options.x, options.y),
        operators_1.rotateRadians(rotations_1.toRadians(options.rotate)),
        operators_1.scale(options.xScale, options.yScale),
        operators_1.skewRadians(rotations_1.toRadians(options.xSkew), rotations_1.toRadians(options.ySkew)),
        operators_1.drawObject(name),
        operators_1.popGraphicsState(),
    ].filter(Boolean);
};
exports.drawLine = function (options) {
    var _a, _b;
    return [
        operators_1.pushGraphicsState(),
        options.graphicsState && operators_1.setGraphicsState(options.graphicsState),
        options.color && colors_1.setStrokingColor(options.color),
        operators_1.setLineWidth(options.thickness),
        operators_1.setDashPattern((_a = options.dashArray) !== null && _a !== void 0 ? _a : [], (_b = options.dashPhase) !== null && _b !== void 0 ? _b : 0),
        operators_1.moveTo(options.start.x, options.start.y),
        options.lineCap && operators_1.setLineCap(options.lineCap),
        operators_1.moveTo(options.start.x, options.start.y),
        operators_1.lineTo(options.end.x, options.end.y),
        operators_1.stroke(),
        operators_1.popGraphicsState(),
    ].filter(Boolean);
};
exports.drawRectangle = function (options) {
    var _a, _b;
    return [
        operators_1.pushGraphicsState(),
        options.graphicsState && operators_1.setGraphicsState(options.graphicsState),
        options.color && colors_1.setFillingColor(options.color),
        options.borderColor && colors_1.setStrokingColor(options.borderColor),
        operators_1.setLineWidth(options.borderWidth),
        options.borderLineCap && operators_1.setLineCap(options.borderLineCap),
        operators_1.setDashPattern((_a = options.borderDashArray) !== null && _a !== void 0 ? _a : [], (_b = options.borderDashPhase) !== null && _b !== void 0 ? _b : 0),
        operators_1.translate(options.x, options.y),
        operators_1.rotateRadians(rotations_1.toRadians(options.rotate)),
        operators_1.skewRadians(rotations_1.toRadians(options.xSkew), rotations_1.toRadians(options.ySkew)),
        operators_1.moveTo(0, 0),
        operators_1.lineTo(0, options.height),
        operators_1.lineTo(options.width, options.height),
        operators_1.lineTo(options.width, 0),
        operators_1.closePath(),
        // prettier-ignore
        options.color && options.borderWidth ? operators_1.fillAndStroke()
            : options.color ? operators_1.fill()
                : options.borderColor ? operators_1.stroke()
                    : operators_1.closePath(),
        operators_1.popGraphicsState(),
    ].filter(Boolean);
};
var KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);
/** @deprecated */
exports.drawEllipsePath = function (config) {
    var x = objects_1.asNumber(config.x);
    var y = objects_1.asNumber(config.y);
    var xScale = objects_1.asNumber(config.xScale);
    var yScale = objects_1.asNumber(config.yScale);
    x -= xScale;
    y -= yScale;
    var ox = xScale * KAPPA;
    var oy = yScale * KAPPA;
    var xe = x + xScale * 2;
    var ye = y + yScale * 2;
    var xm = x + xScale;
    var ym = y + yScale;
    return [
        operators_1.pushGraphicsState(),
        operators_1.moveTo(x, ym),
        operators_1.appendBezierCurve(x, ym - oy, xm - ox, y, xm, y),
        operators_1.appendBezierCurve(xm + ox, y, xe, ym - oy, xe, ym),
        operators_1.appendBezierCurve(xe, ym + oy, xm + ox, ye, xm, ye),
        operators_1.appendBezierCurve(xm - ox, ye, x, ym + oy, x, ym),
        operators_1.popGraphicsState(),
    ];
};
var drawEllipseCurves = function (config) {
    var centerX = objects_1.asNumber(config.x);
    var centerY = objects_1.asNumber(config.y);
    var xScale = objects_1.asNumber(config.xScale);
    var yScale = objects_1.asNumber(config.yScale);
    var x = -xScale;
    var y = -yScale;
    var ox = xScale * KAPPA;
    var oy = yScale * KAPPA;
    var xe = x + xScale * 2;
    var ye = y + yScale * 2;
    var xm = x + xScale;
    var ym = y + yScale;
    return [
        operators_1.translate(centerX, centerY),
        operators_1.rotateRadians(rotations_1.toRadians(config.rotate)),
        operators_1.moveTo(x, ym),
        operators_1.appendBezierCurve(x, ym - oy, xm - ox, y, xm, y),
        operators_1.appendBezierCurve(xm + ox, y, xe, ym - oy, xe, ym),
        operators_1.appendBezierCurve(xe, ym + oy, xm + ox, ye, xm, ye),
        operators_1.appendBezierCurve(xm - ox, ye, x, ym + oy, x, ym),
    ];
};
exports.drawEllipse = function (options) {
    var _a, _b, _c;
    return tslib_1.__spreadArrays([
        operators_1.pushGraphicsState(),
        options.graphicsState && operators_1.setGraphicsState(options.graphicsState),
        options.color && colors_1.setFillingColor(options.color),
        options.borderColor && colors_1.setStrokingColor(options.borderColor),
        operators_1.setLineWidth(options.borderWidth),
        options.borderLineCap && operators_1.setLineCap(options.borderLineCap),
        operators_1.setDashPattern((_a = options.borderDashArray) !== null && _a !== void 0 ? _a : [], (_b = options.borderDashPhase) !== null && _b !== void 0 ? _b : 0)
    ], (options.rotate === undefined
        ? exports.drawEllipsePath({
            x: options.x,
            y: options.y,
            xScale: options.xScale,
            yScale: options.yScale,
        })
        : drawEllipseCurves({
            x: options.x,
            y: options.y,
            xScale: options.xScale,
            yScale: options.yScale,
            rotate: (_c = options.rotate) !== null && _c !== void 0 ? _c : rotations_1.degrees(0),
        })), [
        // prettier-ignore
        options.color && options.borderWidth ? operators_1.fillAndStroke()
            : options.color ? operators_1.fill()
                : options.borderColor ? operators_1.stroke()
                    : operators_1.closePath(),
        operators_1.popGraphicsState(),
    ]).filter(Boolean);
};
exports.drawSvgPath = function (path, options) {
    var _a, _b, _c;
    return tslib_1.__spreadArrays([
        operators_1.pushGraphicsState(),
        options.graphicsState && operators_1.setGraphicsState(options.graphicsState),
        operators_1.translate(options.x, options.y),
        operators_1.rotateRadians(rotations_1.toRadians((_a = options.rotate) !== null && _a !== void 0 ? _a : rotations_1.degrees(0))),
        // SVG path Y axis is opposite pdf-lib's
        options.scale ? operators_1.scale(options.scale, -options.scale) : operators_1.scale(1, -1),
        options.color && colors_1.setFillingColor(options.color),
        options.borderColor && colors_1.setStrokingColor(options.borderColor),
        options.borderWidth && operators_1.setLineWidth(options.borderWidth),
        options.borderLineCap && operators_1.setLineCap(options.borderLineCap),
        operators_1.setDashPattern((_b = options.borderDashArray) !== null && _b !== void 0 ? _b : [], (_c = options.borderDashPhase) !== null && _c !== void 0 ? _c : 0)
    ], svgPath_1.svgPathToOperators(path), [
        // prettier-ignore
        options.color && options.borderWidth ? operators_1.fillAndStroke()
            : options.color ? operators_1.fill()
                : options.borderColor ? operators_1.stroke()
                    : operators_1.closePath(),
        operators_1.popGraphicsState(),
    ]).filter(Boolean);
};
exports.drawCheckMark = function (options) {
    var size = objects_1.asNumber(options.size);
    /*********************** Define Check Mark Points ***************************/
    // A check mark is defined by three points in some coordinate space. Here, we
    // define these points in a unit coordinate system, where the range of the x
    // and y axis are both [-1, 1].
    //
    // Note that we do not hard code `p1y` in case we wish to change the
    // size/shape of the check mark in the future. We want the check mark to
    // always form a right angle. This means that the dot product between (p1-p2)
    // and (p3-p2) should be zero:
    //
    //   (p1x-p2x) * (p3x-p2x) + (p1y-p2y) * (p3y-p2y) = 0
    //
    // We can now rejigger this equation to solve for `p1y`:
    //
    //   (p1y-p2y) * (p3y-p2y) = -((p1x-p2x) * (p3x-p2x))
    //   (p1y-p2y) = -((p1x-p2x) * (p3x-p2x)) / (p3y-p2y)
    //   p1y = -((p1x-p2x) * (p3x-p2x)) / (p3y-p2y) + p2y
    //
    // Thanks to my friend Joel Walker (https://github.com/JWalker1995) for
    // devising the above equation and unit coordinate system approach!
    // (x, y) coords of the check mark's bottommost point
    var p2x = -1 + 0.75;
    var p2y = -1 + 0.51;
    // (x, y) coords of the check mark's topmost point
    var p3y = 1 - 0.525;
    var p3x = 1 - 0.31;
    // (x, y) coords of the check mark's center (vertically) point
    var p1x = -1 + 0.325;
    var p1y = -((p1x - p2x) * (p3x - p2x)) / (p3y - p2y) + p2y;
    /****************************************************************************/
    return [
        operators_1.pushGraphicsState(),
        options.color && colors_1.setStrokingColor(options.color),
        operators_1.setLineWidth(options.thickness),
        operators_1.translate(options.x, options.y),
        operators_1.moveTo(p1x * size, p1y * size),
        operators_1.lineTo(p2x * size, p2y * size),
        operators_1.lineTo(p3x * size, p3y * size),
        operators_1.stroke(),
        operators_1.popGraphicsState(),
    ].filter(Boolean);
};
// prettier-ignore
exports.rotateInPlace = function (options) {
    return options.rotation === 0 ? [
        operators_1.translate(0, 0),
        operators_1.rotateDegrees(0)
    ]
        : options.rotation === 90 ? [
            operators_1.translate(options.width, 0),
            operators_1.rotateDegrees(90)
        ]
            : options.rotation === 180 ? [
                operators_1.translate(options.width, options.height),
                operators_1.rotateDegrees(180)
            ]
                : options.rotation === 270 ? [
                    operators_1.translate(0, options.height),
                    operators_1.rotateDegrees(270)
                ]
                    : [];
}; // Invalid rotation - noop
exports.drawCheckBox = function (options) {
    var outline = exports.drawRectangle({
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        borderWidth: options.borderWidth,
        color: options.color,
        borderColor: options.borderColor,
        rotate: rotations_1.degrees(0),
        xSkew: rotations_1.degrees(0),
        ySkew: rotations_1.degrees(0),
    });
    if (!options.filled)
        return outline;
    var width = objects_1.asNumber(options.width);
    var height = objects_1.asNumber(options.height);
    var checkMarkSize = Math.min(width, height) / 2;
    var checkMark = exports.drawCheckMark({
        x: width / 2,
        y: height / 2,
        size: checkMarkSize,
        thickness: options.thickness,
        color: options.markColor,
    });
    return tslib_1.__spreadArrays([operators_1.pushGraphicsState()], outline, checkMark, [operators_1.popGraphicsState()]);
};
exports.drawRadioButton = function (options) {
    var width = objects_1.asNumber(options.width);
    var height = objects_1.asNumber(options.height);
    var outlineScale = Math.min(width, height) / 2;
    var outline = exports.drawEllipse({
        x: options.x,
        y: options.y,
        xScale: outlineScale,
        yScale: outlineScale,
        color: options.color,
        borderColor: options.borderColor,
        borderWidth: options.borderWidth,
    });
    if (!options.filled)
        return outline;
    var dot = exports.drawEllipse({
        x: options.x,
        y: options.y,
        xScale: outlineScale * 0.45,
        yScale: outlineScale * 0.45,
        color: options.dotColor,
        borderColor: undefined,
        borderWidth: 0,
    });
    return tslib_1.__spreadArrays([operators_1.pushGraphicsState()], outline, dot, [operators_1.popGraphicsState()]);
};
exports.drawButton = function (options) {
    var x = objects_1.asNumber(options.x);
    var y = objects_1.asNumber(options.y);
    var width = objects_1.asNumber(options.width);
    var height = objects_1.asNumber(options.height);
    var background = exports.drawRectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        borderWidth: options.borderWidth,
        color: options.color,
        borderColor: options.borderColor,
        rotate: rotations_1.degrees(0),
        xSkew: rotations_1.degrees(0),
        ySkew: rotations_1.degrees(0),
    });
    var lines = exports.drawTextLines(options.textLines, {
        color: options.textColor,
        font: options.font,
        size: options.fontSize,
        rotate: rotations_1.degrees(0),
        xSkew: rotations_1.degrees(0),
        ySkew: rotations_1.degrees(0),
    });
    return tslib_1.__spreadArrays([operators_1.pushGraphicsState()], background, lines, [operators_1.popGraphicsState()]);
};
exports.drawTextLines = function (lines, options) {
    var operators = [
        operators_1.beginText(),
        colors_1.setFillingColor(options.color),
        operators_1.setFontAndSize(options.font, options.size),
    ];
    for (var idx = 0, len = lines.length; idx < len; idx++) {
        var _a = lines[idx], encoded = _a.encoded, x = _a.x, y = _a.y;
        operators.push(operators_1.rotateAndSkewTextRadiansAndTranslate(rotations_1.toRadians(options.rotate), rotations_1.toRadians(options.xSkew), rotations_1.toRadians(options.ySkew), x, y), operators_1.showText(encoded));
    }
    operators.push(operators_1.endText());
    return operators;
};
exports.drawTextField = function (options) {
    var x = objects_1.asNumber(options.x);
    var y = objects_1.asNumber(options.y);
    var width = objects_1.asNumber(options.width);
    var height = objects_1.asNumber(options.height);
    var borderWidth = objects_1.asNumber(options.borderWidth);
    var padding = objects_1.asNumber(options.padding);
    var clipX = x + borderWidth / 2 + padding;
    var clipY = y + borderWidth / 2 + padding;
    var clipWidth = width - (borderWidth / 2 + padding) * 2;
    var clipHeight = height - (borderWidth / 2 + padding) * 2;
    var clippingArea = [
        operators_1.moveTo(clipX, clipY),
        operators_1.lineTo(clipX, clipY + clipHeight),
        operators_1.lineTo(clipX + clipWidth, clipY + clipHeight),
        operators_1.lineTo(clipX + clipWidth, clipY),
        operators_1.closePath(),
        operators_1.clip(),
        operators_1.endPath(),
    ];
    var background = exports.drawRectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        borderWidth: options.borderWidth,
        color: options.color,
        borderColor: options.borderColor,
        rotate: rotations_1.degrees(0),
        xSkew: rotations_1.degrees(0),
        ySkew: rotations_1.degrees(0),
    });
    var lines = exports.drawTextLines(options.textLines, {
        color: options.textColor,
        font: options.font,
        size: options.fontSize,
        rotate: rotations_1.degrees(0),
        xSkew: rotations_1.degrees(0),
        ySkew: rotations_1.degrees(0),
    });
    var markedContent = tslib_1.__spreadArrays([
        operators_1.beginMarkedContent('Tx'),
        operators_1.pushGraphicsState()
    ], lines, [
        operators_1.popGraphicsState(),
        operators_1.endMarkedContent(),
    ]);
    return tslib_1.__spreadArrays([
        operators_1.pushGraphicsState()
    ], background, clippingArea, markedContent, [
        operators_1.popGraphicsState(),
    ]);
};
exports.drawOptionList = function (options) {
    var x = objects_1.asNumber(options.x);
    var y = objects_1.asNumber(options.y);
    var width = objects_1.asNumber(options.width);
    var height = objects_1.asNumber(options.height);
    var lineHeight = objects_1.asNumber(options.lineHeight);
    var borderWidth = objects_1.asNumber(options.borderWidth);
    var padding = objects_1.asNumber(options.padding);
    var clipX = x + borderWidth / 2 + padding;
    var clipY = y + borderWidth / 2 + padding;
    var clipWidth = width - (borderWidth / 2 + padding) * 2;
    var clipHeight = height - (borderWidth / 2 + padding) * 2;
    var clippingArea = [
        operators_1.moveTo(clipX, clipY),
        operators_1.lineTo(clipX, clipY + clipHeight),
        operators_1.lineTo(clipX + clipWidth, clipY + clipHeight),
        operators_1.lineTo(clipX + clipWidth, clipY),
        operators_1.closePath(),
        operators_1.clip(),
        operators_1.endPath(),
    ];
    var background = exports.drawRectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        borderWidth: options.borderWidth,
        color: options.color,
        borderColor: options.borderColor,
        rotate: rotations_1.degrees(0),
        xSkew: rotations_1.degrees(0),
        ySkew: rotations_1.degrees(0),
    });
    var highlights = [];
    for (var idx = 0, len = options.selectedLines.length; idx < len; idx++) {
        var line = options.textLines[options.selectedLines[idx]];
        highlights.push.apply(highlights, exports.drawRectangle({
            x: line.x - padding,
            y: line.y - (lineHeight - line.height) / 2,
            width: width - borderWidth,
            height: line.height + (lineHeight - line.height) / 2,
            borderWidth: 0,
            color: options.selectedColor,
            borderColor: undefined,
            rotate: rotations_1.degrees(0),
            xSkew: rotations_1.degrees(0),
            ySkew: rotations_1.degrees(0),
        }));
    }
    var lines = exports.drawTextLines(options.textLines, {
        color: options.textColor,
        font: options.font,
        size: options.fontSize,
        rotate: rotations_1.degrees(0),
        xSkew: rotations_1.degrees(0),
        ySkew: rotations_1.degrees(0),
    });
    var markedContent = tslib_1.__spreadArrays([
        operators_1.beginMarkedContent('Tx'),
        operators_1.pushGraphicsState()
    ], lines, [
        operators_1.popGraphicsState(),
        operators_1.endMarkedContent(),
    ]);
    return tslib_1.__spreadArrays([
        operators_1.pushGraphicsState()
    ], background, highlights, clippingArea, markedContent, [
        operators_1.popGraphicsState(),
    ]);
};
//# sourceMappingURL=operations.js.map
}, function(modId) { var map = {"./colors":1767772065463,"./operators":1767772065464,"./rotations":1767772065564,"./svgPath":1767772065565,"./objects":1767772065465}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065463, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.colorToComponents = exports.componentsToColor = exports.setStrokingColor = exports.setFillingColor = exports.cmyk = exports.rgb = exports.grayscale = exports.ColorTypes = void 0;
var operators_1 = require("./operators");
var utils_1 = require("../utils");
var ColorTypes;
(function (ColorTypes) {
    ColorTypes["Grayscale"] = "Grayscale";
    ColorTypes["RGB"] = "RGB";
    ColorTypes["CMYK"] = "CMYK";
})(ColorTypes = exports.ColorTypes || (exports.ColorTypes = {}));
exports.grayscale = function (gray) {
    utils_1.assertRange(gray, 'gray', 0.0, 1.0);
    return { type: ColorTypes.Grayscale, gray: gray };
};
exports.rgb = function (red, green, blue) {
    utils_1.assertRange(red, 'red', 0, 1);
    utils_1.assertRange(green, 'green', 0, 1);
    utils_1.assertRange(blue, 'blue', 0, 1);
    return { type: ColorTypes.RGB, red: red, green: green, blue: blue };
};
exports.cmyk = function (cyan, magenta, yellow, key) {
    utils_1.assertRange(cyan, 'cyan', 0, 1);
    utils_1.assertRange(magenta, 'magenta', 0, 1);
    utils_1.assertRange(yellow, 'yellow', 0, 1);
    utils_1.assertRange(key, 'key', 0, 1);
    return { type: ColorTypes.CMYK, cyan: cyan, magenta: magenta, yellow: yellow, key: key };
};
var Grayscale = ColorTypes.Grayscale, RGB = ColorTypes.RGB, CMYK = ColorTypes.CMYK;
// prettier-ignore
exports.setFillingColor = function (color) {
    return color.type === Grayscale ? operators_1.setFillingGrayscaleColor(color.gray)
        : color.type === RGB ? operators_1.setFillingRgbColor(color.red, color.green, color.blue)
            : color.type === CMYK ? operators_1.setFillingCmykColor(color.cyan, color.magenta, color.yellow, color.key)
                : utils_1.error("Invalid color: " + JSON.stringify(color));
};
// prettier-ignore
exports.setStrokingColor = function (color) {
    return color.type === Grayscale ? operators_1.setStrokingGrayscaleColor(color.gray)
        : color.type === RGB ? operators_1.setStrokingRgbColor(color.red, color.green, color.blue)
            : color.type === CMYK ? operators_1.setStrokingCmykColor(color.cyan, color.magenta, color.yellow, color.key)
                : utils_1.error("Invalid color: " + JSON.stringify(color));
};
// prettier-ignore
exports.componentsToColor = function (comps, scale) {
    if (scale === void 0) { scale = 1; }
    return ((comps === null || comps === void 0 ? void 0 : comps.length) === 1 ? exports.grayscale(comps[0] * scale)
        : (comps === null || comps === void 0 ? void 0 : comps.length) === 3 ? exports.rgb(comps[0] * scale, comps[1] * scale, comps[2] * scale)
            : (comps === null || comps === void 0 ? void 0 : comps.length) === 4 ? exports.cmyk(comps[0] * scale, comps[1] * scale, comps[2] * scale, comps[3] * scale)
                : undefined);
};
// prettier-ignore
exports.colorToComponents = function (color) {
    return color.type === Grayscale ? [color.gray]
        : color.type === RGB ? [color.red, color.green, color.blue]
            : color.type === CMYK ? [color.cyan, color.magenta, color.yellow, color.key]
                : utils_1.error("Invalid color: " + JSON.stringify(color));
};
//# sourceMappingURL=colors.js.map
}, function(modId) { var map = {"./operators":1767772065464,"../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065464, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.endMarkedContent = exports.beginMarkedContent = exports.setStrokingCmykColor = exports.setFillingCmykColor = exports.setStrokingRgbColor = exports.setFillingRgbColor = exports.setStrokingGrayscaleColor = exports.setFillingGrayscaleColor = exports.drawObject = exports.rotateAndSkewTextDegreesAndTranslate = exports.rotateAndSkewTextRadiansAndTranslate = exports.setTextMatrix = exports.setTextRenderingMode = exports.TextRenderingMode = exports.setTextRise = exports.setLineHeight = exports.setCharacterSqueeze = exports.setWordSpacing = exports.setCharacterSpacing = exports.setFontAndSize = exports.endText = exports.beginText = exports.showText = exports.moveText = exports.nextLine = exports.endPath = exports.fillAndStroke = exports.fill = exports.stroke = exports.square = exports.rectangle = exports.lineTo = exports.moveTo = exports.closePath = exports.appendQuadraticCurve = exports.appendBezierCurve = exports.setLineWidth = exports.popGraphicsState = exports.pushGraphicsState = exports.setGraphicsState = exports.setLineJoin = exports.LineJoinStyle = exports.setLineCap = exports.LineCapStyle = exports.restoreDashPattern = exports.setDashPattern = exports.skewDegrees = exports.skewRadians = exports.rotateDegrees = exports.rotateRadians = exports.scale = exports.translate = exports.concatTransformationMatrix = exports.clipEvenOdd = exports.clip = void 0;
var objects_1 = require("./objects");
var rotations_1 = require("./rotations");
var core_1 = require("../core");
/* ==================== Clipping Path Operators ==================== */
exports.clip = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.ClipNonZero); };
exports.clipEvenOdd = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.ClipEvenOdd); };
/* ==================== Graphics State Operators ==================== */
var cos = Math.cos, sin = Math.sin, tan = Math.tan;
exports.concatTransformationMatrix = function (a, b, c, d, e, f) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.ConcatTransformationMatrix, [
        objects_1.asPDFNumber(a),
        objects_1.asPDFNumber(b),
        objects_1.asPDFNumber(c),
        objects_1.asPDFNumber(d),
        objects_1.asPDFNumber(e),
        objects_1.asPDFNumber(f),
    ]);
};
exports.translate = function (xPos, yPos) {
    return exports.concatTransformationMatrix(1, 0, 0, 1, xPos, yPos);
};
exports.scale = function (xPos, yPos) {
    return exports.concatTransformationMatrix(xPos, 0, 0, yPos, 0, 0);
};
exports.rotateRadians = function (angle) {
    return exports.concatTransformationMatrix(cos(objects_1.asNumber(angle)), sin(objects_1.asNumber(angle)), -sin(objects_1.asNumber(angle)), cos(objects_1.asNumber(angle)), 0, 0);
};
exports.rotateDegrees = function (angle) {
    return exports.rotateRadians(rotations_1.degreesToRadians(objects_1.asNumber(angle)));
};
exports.skewRadians = function (xSkewAngle, ySkewAngle) {
    return exports.concatTransformationMatrix(1, tan(objects_1.asNumber(xSkewAngle)), tan(objects_1.asNumber(ySkewAngle)), 1, 0, 0);
};
exports.skewDegrees = function (xSkewAngle, ySkewAngle) {
    return exports.skewRadians(rotations_1.degreesToRadians(objects_1.asNumber(xSkewAngle)), rotations_1.degreesToRadians(objects_1.asNumber(ySkewAngle)));
};
exports.setDashPattern = function (dashArray, dashPhase) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetLineDashPattern, [
        "[" + dashArray.map(objects_1.asPDFNumber).join(' ') + "]",
        objects_1.asPDFNumber(dashPhase),
    ]);
};
exports.restoreDashPattern = function () { return exports.setDashPattern([], 0); };
var LineCapStyle;
(function (LineCapStyle) {
    LineCapStyle[LineCapStyle["Butt"] = 0] = "Butt";
    LineCapStyle[LineCapStyle["Round"] = 1] = "Round";
    LineCapStyle[LineCapStyle["Projecting"] = 2] = "Projecting";
})(LineCapStyle = exports.LineCapStyle || (exports.LineCapStyle = {}));
exports.setLineCap = function (style) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetLineCapStyle, [objects_1.asPDFNumber(style)]);
};
var LineJoinStyle;
(function (LineJoinStyle) {
    LineJoinStyle[LineJoinStyle["Miter"] = 0] = "Miter";
    LineJoinStyle[LineJoinStyle["Round"] = 1] = "Round";
    LineJoinStyle[LineJoinStyle["Bevel"] = 2] = "Bevel";
})(LineJoinStyle = exports.LineJoinStyle || (exports.LineJoinStyle = {}));
exports.setLineJoin = function (style) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetLineJoinStyle, [objects_1.asPDFNumber(style)]);
};
exports.setGraphicsState = function (state) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetGraphicsStateParams, [objects_1.asPDFName(state)]);
};
exports.pushGraphicsState = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.PushGraphicsState); };
exports.popGraphicsState = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.PopGraphicsState); };
exports.setLineWidth = function (width) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetLineWidth, [objects_1.asPDFNumber(width)]);
};
/* ==================== Path Construction Operators ==================== */
exports.appendBezierCurve = function (x1, y1, x2, y2, x3, y3) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.AppendBezierCurve, [
        objects_1.asPDFNumber(x1),
        objects_1.asPDFNumber(y1),
        objects_1.asPDFNumber(x2),
        objects_1.asPDFNumber(y2),
        objects_1.asPDFNumber(x3),
        objects_1.asPDFNumber(y3),
    ]);
};
exports.appendQuadraticCurve = function (x1, y1, x2, y2) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.CurveToReplicateInitialPoint, [
        objects_1.asPDFNumber(x1),
        objects_1.asPDFNumber(y1),
        objects_1.asPDFNumber(x2),
        objects_1.asPDFNumber(y2),
    ]);
};
exports.closePath = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.ClosePath); };
exports.moveTo = function (xPos, yPos) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.MoveTo, [objects_1.asPDFNumber(xPos), objects_1.asPDFNumber(yPos)]);
};
exports.lineTo = function (xPos, yPos) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.LineTo, [objects_1.asPDFNumber(xPos), objects_1.asPDFNumber(yPos)]);
};
/**
 * @param xPos x coordinate for the lower left corner of the rectangle
 * @param yPos y coordinate for the lower left corner of the rectangle
 * @param width width of the rectangle
 * @param height height of the rectangle
 */
exports.rectangle = function (xPos, yPos, width, height) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.AppendRectangle, [
        objects_1.asPDFNumber(xPos),
        objects_1.asPDFNumber(yPos),
        objects_1.asPDFNumber(width),
        objects_1.asPDFNumber(height),
    ]);
};
/**
 * @param xPos x coordinate for the lower left corner of the square
 * @param yPos y coordinate for the lower left corner of the square
 * @param size width and height of the square
 */
exports.square = function (xPos, yPos, size) {
    return exports.rectangle(xPos, yPos, size, size);
};
/* ==================== Path Painting Operators ==================== */
exports.stroke = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.StrokePath); };
exports.fill = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.FillNonZero); };
exports.fillAndStroke = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.FillNonZeroAndStroke); };
exports.endPath = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.EndPath); };
/* ==================== Text Positioning Operators ==================== */
exports.nextLine = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.NextLine); };
exports.moveText = function (x, y) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.MoveText, [objects_1.asPDFNumber(x), objects_1.asPDFNumber(y)]);
};
/* ==================== Text Showing Operators ==================== */
exports.showText = function (text) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.ShowText, [text]);
};
/* ==================== Text State Operators ==================== */
exports.beginText = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.BeginText); };
exports.endText = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.EndText); };
exports.setFontAndSize = function (name, size) { return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetFontAndSize, [objects_1.asPDFName(name), objects_1.asPDFNumber(size)]); };
exports.setCharacterSpacing = function (spacing) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetCharacterSpacing, [objects_1.asPDFNumber(spacing)]);
};
exports.setWordSpacing = function (spacing) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetWordSpacing, [objects_1.asPDFNumber(spacing)]);
};
/** @param squeeze horizontal character spacing */
exports.setCharacterSqueeze = function (squeeze) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetTextHorizontalScaling, [objects_1.asPDFNumber(squeeze)]);
};
exports.setLineHeight = function (lineHeight) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetTextLineHeight, [objects_1.asPDFNumber(lineHeight)]);
};
exports.setTextRise = function (rise) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetTextRise, [objects_1.asPDFNumber(rise)]);
};
var TextRenderingMode;
(function (TextRenderingMode) {
    TextRenderingMode[TextRenderingMode["Fill"] = 0] = "Fill";
    TextRenderingMode[TextRenderingMode["Outline"] = 1] = "Outline";
    TextRenderingMode[TextRenderingMode["FillAndOutline"] = 2] = "FillAndOutline";
    TextRenderingMode[TextRenderingMode["Invisible"] = 3] = "Invisible";
    TextRenderingMode[TextRenderingMode["FillAndClip"] = 4] = "FillAndClip";
    TextRenderingMode[TextRenderingMode["OutlineAndClip"] = 5] = "OutlineAndClip";
    TextRenderingMode[TextRenderingMode["FillAndOutlineAndClip"] = 6] = "FillAndOutlineAndClip";
    TextRenderingMode[TextRenderingMode["Clip"] = 7] = "Clip";
})(TextRenderingMode = exports.TextRenderingMode || (exports.TextRenderingMode = {}));
exports.setTextRenderingMode = function (mode) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetTextRenderingMode, [objects_1.asPDFNumber(mode)]);
};
exports.setTextMatrix = function (a, b, c, d, e, f) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.SetTextMatrix, [
        objects_1.asPDFNumber(a),
        objects_1.asPDFNumber(b),
        objects_1.asPDFNumber(c),
        objects_1.asPDFNumber(d),
        objects_1.asPDFNumber(e),
        objects_1.asPDFNumber(f),
    ]);
};
exports.rotateAndSkewTextRadiansAndTranslate = function (rotationAngle, xSkewAngle, ySkewAngle, x, y) {
    return exports.setTextMatrix(cos(objects_1.asNumber(rotationAngle)), sin(objects_1.asNumber(rotationAngle)) + tan(objects_1.asNumber(xSkewAngle)), -sin(objects_1.asNumber(rotationAngle)) + tan(objects_1.asNumber(ySkewAngle)), cos(objects_1.asNumber(rotationAngle)), x, y);
};
exports.rotateAndSkewTextDegreesAndTranslate = function (rotationAngle, xSkewAngle, ySkewAngle, x, y) {
    return exports.rotateAndSkewTextRadiansAndTranslate(rotations_1.degreesToRadians(objects_1.asNumber(rotationAngle)), rotations_1.degreesToRadians(objects_1.asNumber(xSkewAngle)), rotations_1.degreesToRadians(objects_1.asNumber(ySkewAngle)), x, y);
};
/* ==================== XObject Operator ==================== */
exports.drawObject = function (name) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.DrawObject, [objects_1.asPDFName(name)]);
};
/* ==================== Color Operators ==================== */
exports.setFillingGrayscaleColor = function (gray) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.NonStrokingColorGray, [objects_1.asPDFNumber(gray)]);
};
exports.setStrokingGrayscaleColor = function (gray) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.StrokingColorGray, [objects_1.asPDFNumber(gray)]);
};
exports.setFillingRgbColor = function (red, green, blue) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.NonStrokingColorRgb, [
        objects_1.asPDFNumber(red),
        objects_1.asPDFNumber(green),
        objects_1.asPDFNumber(blue),
    ]);
};
exports.setStrokingRgbColor = function (red, green, blue) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.StrokingColorRgb, [
        objects_1.asPDFNumber(red),
        objects_1.asPDFNumber(green),
        objects_1.asPDFNumber(blue),
    ]);
};
exports.setFillingCmykColor = function (cyan, magenta, yellow, key) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.NonStrokingColorCmyk, [
        objects_1.asPDFNumber(cyan),
        objects_1.asPDFNumber(magenta),
        objects_1.asPDFNumber(yellow),
        objects_1.asPDFNumber(key),
    ]);
};
exports.setStrokingCmykColor = function (cyan, magenta, yellow, key) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.StrokingColorCmyk, [
        objects_1.asPDFNumber(cyan),
        objects_1.asPDFNumber(magenta),
        objects_1.asPDFNumber(yellow),
        objects_1.asPDFNumber(key),
    ]);
};
/* ==================== Marked Content Operators ==================== */
exports.beginMarkedContent = function (tag) {
    return core_1.PDFOperator.of(core_1.PDFOperatorNames.BeginMarkedContent, [objects_1.asPDFName(tag)]);
};
exports.endMarkedContent = function () { return core_1.PDFOperator.of(core_1.PDFOperatorNames.EndMarkedContent); };
//# sourceMappingURL=operators.js.map
}, function(modId) { var map = {"./objects":1767772065465,"./rotations":1767772065564,"../core":1767772065466}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065465, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.asNumber = exports.asPDFNumber = exports.asPDFName = void 0;
var core_1 = require("../core");
exports.asPDFName = function (name) {
    return name instanceof core_1.PDFName ? name : core_1.PDFName.of(name);
};
exports.asPDFNumber = function (num) {
    return num instanceof core_1.PDFNumber ? num : core_1.PDFNumber.of(num);
};
exports.asNumber = function (num) {
    return num instanceof core_1.PDFNumber ? num.asNumber() : num;
};
//# sourceMappingURL=objects.js.map
}, function(modId) { var map = {"../core":1767772065466}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065466, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./errors"), exports);
var CharCodes_1 = require("./syntax/CharCodes");
Object.defineProperty(exports, "CharCodes", { enumerable: true, get: function () { return CharCodes_1.default; } });
var PDFContext_1 = require("./PDFContext");
Object.defineProperty(exports, "PDFContext", { enumerable: true, get: function () { return PDFContext_1.default; } });
var PDFObjectCopier_1 = require("./PDFObjectCopier");
Object.defineProperty(exports, "PDFObjectCopier", { enumerable: true, get: function () { return PDFObjectCopier_1.default; } });
var PDFWriter_1 = require("./writers/PDFWriter");
Object.defineProperty(exports, "PDFWriter", { enumerable: true, get: function () { return PDFWriter_1.default; } });
var PDFStreamWriter_1 = require("./writers/PDFStreamWriter");
Object.defineProperty(exports, "PDFStreamWriter", { enumerable: true, get: function () { return PDFStreamWriter_1.default; } });
var PDFHeader_1 = require("./document/PDFHeader");
Object.defineProperty(exports, "PDFHeader", { enumerable: true, get: function () { return PDFHeader_1.default; } });
var PDFTrailer_1 = require("./document/PDFTrailer");
Object.defineProperty(exports, "PDFTrailer", { enumerable: true, get: function () { return PDFTrailer_1.default; } });
var PDFTrailerDict_1 = require("./document/PDFTrailerDict");
Object.defineProperty(exports, "PDFTrailerDict", { enumerable: true, get: function () { return PDFTrailerDict_1.default; } });
var PDFCrossRefSection_1 = require("./document/PDFCrossRefSection");
Object.defineProperty(exports, "PDFCrossRefSection", { enumerable: true, get: function () { return PDFCrossRefSection_1.default; } });
var StandardFontEmbedder_1 = require("./embedders/StandardFontEmbedder");
Object.defineProperty(exports, "StandardFontEmbedder", { enumerable: true, get: function () { return StandardFontEmbedder_1.default; } });
var CustomFontEmbedder_1 = require("./embedders/CustomFontEmbedder");
Object.defineProperty(exports, "CustomFontEmbedder", { enumerable: true, get: function () { return CustomFontEmbedder_1.default; } });
var CustomFontSubsetEmbedder_1 = require("./embedders/CustomFontSubsetEmbedder");
Object.defineProperty(exports, "CustomFontSubsetEmbedder", { enumerable: true, get: function () { return CustomFontSubsetEmbedder_1.default; } });
var FileEmbedder_1 = require("./embedders/FileEmbedder");
Object.defineProperty(exports, "FileEmbedder", { enumerable: true, get: function () { return FileEmbedder_1.default; } });
Object.defineProperty(exports, "AFRelationship", { enumerable: true, get: function () { return FileEmbedder_1.AFRelationship; } });
var JpegEmbedder_1 = require("./embedders/JpegEmbedder");
Object.defineProperty(exports, "JpegEmbedder", { enumerable: true, get: function () { return JpegEmbedder_1.default; } });
var PngEmbedder_1 = require("./embedders/PngEmbedder");
Object.defineProperty(exports, "PngEmbedder", { enumerable: true, get: function () { return PngEmbedder_1.default; } });
var PDFPageEmbedder_1 = require("./embedders/PDFPageEmbedder");
Object.defineProperty(exports, "PDFPageEmbedder", { enumerable: true, get: function () { return PDFPageEmbedder_1.default; } });
var ViewerPreferences_1 = require("./interactive/ViewerPreferences");
Object.defineProperty(exports, "ViewerPreferences", { enumerable: true, get: function () { return ViewerPreferences_1.default; } });
Object.defineProperty(exports, "NonFullScreenPageMode", { enumerable: true, get: function () { return ViewerPreferences_1.NonFullScreenPageMode; } });
Object.defineProperty(exports, "ReadingDirection", { enumerable: true, get: function () { return ViewerPreferences_1.ReadingDirection; } });
Object.defineProperty(exports, "PrintScaling", { enumerable: true, get: function () { return ViewerPreferences_1.PrintScaling; } });
Object.defineProperty(exports, "Duplex", { enumerable: true, get: function () { return ViewerPreferences_1.Duplex; } });
var PDFObject_1 = require("./objects/PDFObject");
Object.defineProperty(exports, "PDFObject", { enumerable: true, get: function () { return PDFObject_1.default; } });
var PDFBool_1 = require("./objects/PDFBool");
Object.defineProperty(exports, "PDFBool", { enumerable: true, get: function () { return PDFBool_1.default; } });
var PDFNumber_1 = require("./objects/PDFNumber");
Object.defineProperty(exports, "PDFNumber", { enumerable: true, get: function () { return PDFNumber_1.default; } });
var PDFString_1 = require("./objects/PDFString");
Object.defineProperty(exports, "PDFString", { enumerable: true, get: function () { return PDFString_1.default; } });
var PDFHexString_1 = require("./objects/PDFHexString");
Object.defineProperty(exports, "PDFHexString", { enumerable: true, get: function () { return PDFHexString_1.default; } });
var PDFName_1 = require("./objects/PDFName");
Object.defineProperty(exports, "PDFName", { enumerable: true, get: function () { return PDFName_1.default; } });
var PDFNull_1 = require("./objects/PDFNull");
Object.defineProperty(exports, "PDFNull", { enumerable: true, get: function () { return PDFNull_1.default; } });
var PDFArray_1 = require("./objects/PDFArray");
Object.defineProperty(exports, "PDFArray", { enumerable: true, get: function () { return PDFArray_1.default; } });
var PDFDict_1 = require("./objects/PDFDict");
Object.defineProperty(exports, "PDFDict", { enumerable: true, get: function () { return PDFDict_1.default; } });
var PDFRef_1 = require("./objects/PDFRef");
Object.defineProperty(exports, "PDFRef", { enumerable: true, get: function () { return PDFRef_1.default; } });
var PDFInvalidObject_1 = require("./objects/PDFInvalidObject");
Object.defineProperty(exports, "PDFInvalidObject", { enumerable: true, get: function () { return PDFInvalidObject_1.default; } });
var PDFStream_1 = require("./objects/PDFStream");
Object.defineProperty(exports, "PDFStream", { enumerable: true, get: function () { return PDFStream_1.default; } });
var PDFRawStream_1 = require("./objects/PDFRawStream");
Object.defineProperty(exports, "PDFRawStream", { enumerable: true, get: function () { return PDFRawStream_1.default; } });
var PDFCatalog_1 = require("./structures/PDFCatalog");
Object.defineProperty(exports, "PDFCatalog", { enumerable: true, get: function () { return PDFCatalog_1.default; } });
var PDFContentStream_1 = require("./structures/PDFContentStream");
Object.defineProperty(exports, "PDFContentStream", { enumerable: true, get: function () { return PDFContentStream_1.default; } });
var PDFCrossRefStream_1 = require("./structures/PDFCrossRefStream");
Object.defineProperty(exports, "PDFCrossRefStream", { enumerable: true, get: function () { return PDFCrossRefStream_1.default; } });
var PDFObjectStream_1 = require("./structures/PDFObjectStream");
Object.defineProperty(exports, "PDFObjectStream", { enumerable: true, get: function () { return PDFObjectStream_1.default; } });
var PDFPageTree_1 = require("./structures/PDFPageTree");
Object.defineProperty(exports, "PDFPageTree", { enumerable: true, get: function () { return PDFPageTree_1.default; } });
var PDFPageLeaf_1 = require("./structures/PDFPageLeaf");
Object.defineProperty(exports, "PDFPageLeaf", { enumerable: true, get: function () { return PDFPageLeaf_1.default; } });
var PDFFlateStream_1 = require("./structures/PDFFlateStream");
Object.defineProperty(exports, "PDFFlateStream", { enumerable: true, get: function () { return PDFFlateStream_1.default; } });
var PDFOperator_1 = require("./operators/PDFOperator");
Object.defineProperty(exports, "PDFOperator", { enumerable: true, get: function () { return PDFOperator_1.default; } });
var PDFOperatorNames_1 = require("./operators/PDFOperatorNames");
Object.defineProperty(exports, "PDFOperatorNames", { enumerable: true, get: function () { return PDFOperatorNames_1.default; } });
var PDFObjectParser_1 = require("./parser/PDFObjectParser");
Object.defineProperty(exports, "PDFObjectParser", { enumerable: true, get: function () { return PDFObjectParser_1.default; } });
var PDFObjectStreamParser_1 = require("./parser/PDFObjectStreamParser");
Object.defineProperty(exports, "PDFObjectStreamParser", { enumerable: true, get: function () { return PDFObjectStreamParser_1.default; } });
var PDFParser_1 = require("./parser/PDFParser");
Object.defineProperty(exports, "PDFParser", { enumerable: true, get: function () { return PDFParser_1.default; } });
var PDFXRefStreamParser_1 = require("./parser/PDFXRefStreamParser");
Object.defineProperty(exports, "PDFXRefStreamParser", { enumerable: true, get: function () { return PDFXRefStreamParser_1.default; } });
var decode_1 = require("./streams/decode");
Object.defineProperty(exports, "decodePDFRawStream", { enumerable: true, get: function () { return decode_1.decodePDFRawStream; } });
tslib_1.__exportStar(require("./annotation"), exports);
tslib_1.__exportStar(require("./acroform"), exports);
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./errors":1767772065467,"./syntax/CharCodes":1767772065480,"./PDFContext":1767772065481,"./PDFObjectCopier":1767772065501,"./writers/PDFWriter":1767772065503,"./writers/PDFStreamWriter":1767772065508,"./document/PDFHeader":1767772065482,"./document/PDFTrailer":1767772065505,"./document/PDFTrailerDict":1767772065506,"./document/PDFCrossRefSection":1767772065504,"./embedders/StandardFontEmbedder":1767772065511,"./embedders/CustomFontEmbedder":1767772065513,"./embedders/CustomFontSubsetEmbedder":1767772065517,"./embedders/FileEmbedder":1767772065518,"./embedders/JpegEmbedder":1767772065519,"./embedders/PngEmbedder":1767772065520,"./embedders/PDFPageEmbedder":1767772065522,"./interactive/ViewerPreferences":1767772065531,"./objects/PDFObject":1767772065485,"./objects/PDFBool":1767772065486,"./objects/PDFNumber":1767772065484,"./objects/PDFString":1767772065516,"./objects/PDFHexString":1767772065512,"./objects/PDFName":1767772065488,"./objects/PDFNull":1767772065492,"./objects/PDFArray":1767772065483,"./objects/PDFDict":1767772065487,"./objects/PDFRef":1767772065495,"./objects/PDFInvalidObject":1767772065509,"./objects/PDFStream":1767772065494,"./objects/PDFRawStream":1767772065493,"./structures/PDFCatalog":1767772065532,"./structures/PDFContentStream":1767772065498,"./structures/PDFCrossRefStream":1767772065510,"./structures/PDFObjectStream":1767772065507,"./structures/PDFPageTree":1767772065553,"./structures/PDFPageLeaf":1767772065502,"./structures/PDFFlateStream":1767772065499,"./operators/PDFOperator":1767772065496,"./operators/PDFOperatorNames":1767772065497,"./parser/PDFObjectParser":1767772065554,"./parser/PDFObjectStreamParser":1767772065559,"./parser/PDFParser":1767772065560,"./parser/PDFXRefStreamParser":1767772065561,"./streams/decode":1767772065523,"./annotation":1767772065562,"./acroform":1767772065533}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065467, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingKeywordError = exports.MissingPDFHeaderError = exports.StalledParserError = exports.UnbalancedParenthesisError = exports.PDFStreamParsingError = exports.PDFInvalidObjectParsingError = exports.PDFObjectParsingError = exports.NextByteAssertionError = exports.PDFParsingError = exports.NumberParsingError = exports.MissingTfOperatorError = exports.MissingDAEntryError = exports.MultiSelectValueError = exports.InvalidAcroFieldValueError = exports.IndexOutOfBoundsError = exports.CorruptPageTreeError = exports.InvalidTargetIndexError = exports.InvalidPDFDateStringError = exports.PDFArrayIsNotRectangleError = exports.PageEmbeddingMismatchedContextError = exports.UnrecognizedStreamTypeError = exports.MissingPageContentsEmbeddingError = exports.MissingCatalogError = exports.ReparseError = exports.UnsupportedEncodingError = exports.UnexpectedObjectTypeError = exports.PrivateConstructorError = exports.MethodNotImplementedError = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
var MethodNotImplementedError = /** @class */ (function (_super) {
    tslib_1.__extends(MethodNotImplementedError, _super);
    function MethodNotImplementedError(className, methodName) {
        var _this = this;
        var msg = "Method " + className + "." + methodName + "() not implemented";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return MethodNotImplementedError;
}(Error));
exports.MethodNotImplementedError = MethodNotImplementedError;
var PrivateConstructorError = /** @class */ (function (_super) {
    tslib_1.__extends(PrivateConstructorError, _super);
    function PrivateConstructorError(className) {
        var _this = this;
        var msg = "Cannot construct " + className + " - it has a private constructor";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return PrivateConstructorError;
}(Error));
exports.PrivateConstructorError = PrivateConstructorError;
var UnexpectedObjectTypeError = /** @class */ (function (_super) {
    tslib_1.__extends(UnexpectedObjectTypeError, _super);
    function UnexpectedObjectTypeError(expected, actual) {
        var _this = this;
        var name = function (t) { var _a, _b; return (_a = t === null || t === void 0 ? void 0 : t.name) !== null && _a !== void 0 ? _a : (_b = t === null || t === void 0 ? void 0 : t.constructor) === null || _b === void 0 ? void 0 : _b.name; };
        var expectedTypes = Array.isArray(expected)
            ? expected.map(name)
            : [name(expected)];
        var msg = "Expected instance of " + expectedTypes.join(' or ') + ", " +
            ("but got instance of " + (actual ? name(actual) : actual));
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return UnexpectedObjectTypeError;
}(Error));
exports.UnexpectedObjectTypeError = UnexpectedObjectTypeError;
var UnsupportedEncodingError = /** @class */ (function (_super) {
    tslib_1.__extends(UnsupportedEncodingError, _super);
    function UnsupportedEncodingError(encoding) {
        var _this = this;
        var msg = encoding + " stream encoding not supported";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return UnsupportedEncodingError;
}(Error));
exports.UnsupportedEncodingError = UnsupportedEncodingError;
var ReparseError = /** @class */ (function (_super) {
    tslib_1.__extends(ReparseError, _super);
    function ReparseError(className, methodName) {
        var _this = this;
        var msg = "Cannot call " + className + "." + methodName + "() more than once";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return ReparseError;
}(Error));
exports.ReparseError = ReparseError;
var MissingCatalogError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingCatalogError, _super);
    function MissingCatalogError(ref) {
        var _this = this;
        var msg = "Missing catalog (ref=" + ref + ")";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return MissingCatalogError;
}(Error));
exports.MissingCatalogError = MissingCatalogError;
var MissingPageContentsEmbeddingError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingPageContentsEmbeddingError, _super);
    function MissingPageContentsEmbeddingError() {
        var _this = this;
        var msg = "Can't embed page with missing Contents";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return MissingPageContentsEmbeddingError;
}(Error));
exports.MissingPageContentsEmbeddingError = MissingPageContentsEmbeddingError;
var UnrecognizedStreamTypeError = /** @class */ (function (_super) {
    tslib_1.__extends(UnrecognizedStreamTypeError, _super);
    function UnrecognizedStreamTypeError(stream) {
        var _a, _b, _c;
        var _this = this;
        var streamType = (_c = (_b = (_a = stream === null || stream === void 0 ? void 0 : stream.contructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : stream === null || stream === void 0 ? void 0 : stream.name) !== null && _c !== void 0 ? _c : stream;
        var msg = "Unrecognized stream type: " + streamType;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return UnrecognizedStreamTypeError;
}(Error));
exports.UnrecognizedStreamTypeError = UnrecognizedStreamTypeError;
var PageEmbeddingMismatchedContextError = /** @class */ (function (_super) {
    tslib_1.__extends(PageEmbeddingMismatchedContextError, _super);
    function PageEmbeddingMismatchedContextError() {
        var _this = this;
        var msg = "Found mismatched contexts while embedding pages. All pages in the array passed to `PDFDocument.embedPages()` must be from the same document.";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return PageEmbeddingMismatchedContextError;
}(Error));
exports.PageEmbeddingMismatchedContextError = PageEmbeddingMismatchedContextError;
var PDFArrayIsNotRectangleError = /** @class */ (function (_super) {
    tslib_1.__extends(PDFArrayIsNotRectangleError, _super);
    function PDFArrayIsNotRectangleError(size) {
        var _this = this;
        var msg = "Attempted to convert PDFArray with " + size + " elements to rectangle, but must have exactly 4 elements.";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return PDFArrayIsNotRectangleError;
}(Error));
exports.PDFArrayIsNotRectangleError = PDFArrayIsNotRectangleError;
var InvalidPDFDateStringError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidPDFDateStringError, _super);
    function InvalidPDFDateStringError(value) {
        var _this = this;
        var msg = "Attempted to convert \"" + value + "\" to a date, but it does not match the PDF date string format.";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return InvalidPDFDateStringError;
}(Error));
exports.InvalidPDFDateStringError = InvalidPDFDateStringError;
var InvalidTargetIndexError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidTargetIndexError, _super);
    function InvalidTargetIndexError(targetIndex, Count) {
        var _this = this;
        var msg = "Invalid targetIndex specified: targetIndex=" + targetIndex + " must be less than Count=" + Count;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return InvalidTargetIndexError;
}(Error));
exports.InvalidTargetIndexError = InvalidTargetIndexError;
var CorruptPageTreeError = /** @class */ (function (_super) {
    tslib_1.__extends(CorruptPageTreeError, _super);
    function CorruptPageTreeError(targetIndex, operation) {
        var _this = this;
        var msg = "Failed to " + operation + " at targetIndex=" + targetIndex + " due to corrupt page tree: It is likely that one or more 'Count' entries are invalid";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return CorruptPageTreeError;
}(Error));
exports.CorruptPageTreeError = CorruptPageTreeError;
var IndexOutOfBoundsError = /** @class */ (function (_super) {
    tslib_1.__extends(IndexOutOfBoundsError, _super);
    function IndexOutOfBoundsError(index, min, max) {
        var _this = this;
        var msg = "index should be at least " + min + " and at most " + max + ", but was actually " + index;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return IndexOutOfBoundsError;
}(Error));
exports.IndexOutOfBoundsError = IndexOutOfBoundsError;
var InvalidAcroFieldValueError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidAcroFieldValueError, _super);
    function InvalidAcroFieldValueError() {
        var _this = this;
        var msg = "Attempted to set invalid field value";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return InvalidAcroFieldValueError;
}(Error));
exports.InvalidAcroFieldValueError = InvalidAcroFieldValueError;
var MultiSelectValueError = /** @class */ (function (_super) {
    tslib_1.__extends(MultiSelectValueError, _super);
    function MultiSelectValueError() {
        var _this = this;
        var msg = "Attempted to select multiple values for single-select field";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return MultiSelectValueError;
}(Error));
exports.MultiSelectValueError = MultiSelectValueError;
var MissingDAEntryError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingDAEntryError, _super);
    function MissingDAEntryError(fieldName) {
        var _this = this;
        var msg = "No /DA (default appearance) entry found for field: " + fieldName;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return MissingDAEntryError;
}(Error));
exports.MissingDAEntryError = MissingDAEntryError;
var MissingTfOperatorError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingTfOperatorError, _super);
    function MissingTfOperatorError(fieldName) {
        var _this = this;
        var msg = "No Tf operator found for DA of field: " + fieldName;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return MissingTfOperatorError;
}(Error));
exports.MissingTfOperatorError = MissingTfOperatorError;
var NumberParsingError = /** @class */ (function (_super) {
    tslib_1.__extends(NumberParsingError, _super);
    function NumberParsingError(pos, value) {
        var _this = this;
        var msg = "Failed to parse number " +
            ("(line:" + pos.line + " col:" + pos.column + " offset=" + pos.offset + "): \"" + value + "\"");
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return NumberParsingError;
}(Error));
exports.NumberParsingError = NumberParsingError;
var PDFParsingError = /** @class */ (function (_super) {
    tslib_1.__extends(PDFParsingError, _super);
    function PDFParsingError(pos, details) {
        var _this = this;
        var msg = "Failed to parse PDF document " +
            ("(line:" + pos.line + " col:" + pos.column + " offset=" + pos.offset + "): " + details);
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return PDFParsingError;
}(Error));
exports.PDFParsingError = PDFParsingError;
var NextByteAssertionError = /** @class */ (function (_super) {
    tslib_1.__extends(NextByteAssertionError, _super);
    function NextByteAssertionError(pos, expectedByte, actualByte) {
        var _this = this;
        var msg = "Expected next byte to be " + expectedByte + " but it was actually " + actualByte;
        _this = _super.call(this, pos, msg) || this;
        return _this;
    }
    return NextByteAssertionError;
}(PDFParsingError));
exports.NextByteAssertionError = NextByteAssertionError;
var PDFObjectParsingError = /** @class */ (function (_super) {
    tslib_1.__extends(PDFObjectParsingError, _super);
    function PDFObjectParsingError(pos, byte) {
        var _this = this;
        var msg = "Failed to parse PDF object starting with the following byte: " + byte;
        _this = _super.call(this, pos, msg) || this;
        return _this;
    }
    return PDFObjectParsingError;
}(PDFParsingError));
exports.PDFObjectParsingError = PDFObjectParsingError;
var PDFInvalidObjectParsingError = /** @class */ (function (_super) {
    tslib_1.__extends(PDFInvalidObjectParsingError, _super);
    function PDFInvalidObjectParsingError(pos) {
        var _this = this;
        var msg = "Failed to parse invalid PDF object";
        _this = _super.call(this, pos, msg) || this;
        return _this;
    }
    return PDFInvalidObjectParsingError;
}(PDFParsingError));
exports.PDFInvalidObjectParsingError = PDFInvalidObjectParsingError;
var PDFStreamParsingError = /** @class */ (function (_super) {
    tslib_1.__extends(PDFStreamParsingError, _super);
    function PDFStreamParsingError(pos) {
        var _this = this;
        var msg = "Failed to parse PDF stream";
        _this = _super.call(this, pos, msg) || this;
        return _this;
    }
    return PDFStreamParsingError;
}(PDFParsingError));
exports.PDFStreamParsingError = PDFStreamParsingError;
var UnbalancedParenthesisError = /** @class */ (function (_super) {
    tslib_1.__extends(UnbalancedParenthesisError, _super);
    function UnbalancedParenthesisError(pos) {
        var _this = this;
        var msg = "Failed to parse PDF literal string due to unbalanced parenthesis";
        _this = _super.call(this, pos, msg) || this;
        return _this;
    }
    return UnbalancedParenthesisError;
}(PDFParsingError));
exports.UnbalancedParenthesisError = UnbalancedParenthesisError;
var StalledParserError = /** @class */ (function (_super) {
    tslib_1.__extends(StalledParserError, _super);
    function StalledParserError(pos) {
        var _this = this;
        var msg = "Parser stalled";
        _this = _super.call(this, pos, msg) || this;
        return _this;
    }
    return StalledParserError;
}(PDFParsingError));
exports.StalledParserError = StalledParserError;
var MissingPDFHeaderError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingPDFHeaderError, _super);
    function MissingPDFHeaderError(pos) {
        var _this = this;
        var msg = "No PDF header found";
        _this = _super.call(this, pos, msg) || this;
        return _this;
    }
    return MissingPDFHeaderError;
}(PDFParsingError));
exports.MissingPDFHeaderError = MissingPDFHeaderError;
var MissingKeywordError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingKeywordError, _super);
    function MissingKeywordError(pos, keyword) {
        var _this = this;
        var msg = "Did not find expected keyword '" + utils_1.arrayAsString(keyword) + "'";
        _this = _super.call(this, pos, msg) || this;
        return _this;
    }
    return MissingKeywordError;
}(PDFParsingError));
exports.MissingKeywordError = MissingKeywordError;
//# sourceMappingURL=errors.js.map
}, function(modId) { var map = {"../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065468, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./arrays"), exports);
tslib_1.__exportStar(require("./async"), exports);
tslib_1.__exportStar(require("./strings"), exports);
tslib_1.__exportStar(require("./unicode"), exports);
tslib_1.__exportStar(require("./numbers"), exports);
tslib_1.__exportStar(require("./errors"), exports);
tslib_1.__exportStar(require("./base64"), exports);
tslib_1.__exportStar(require("./objects"), exports);
tslib_1.__exportStar(require("./validators"), exports);
tslib_1.__exportStar(require("./pdfDocEncoding"), exports);
var Cache_1 = require("./Cache");
Object.defineProperty(exports, "Cache", { enumerable: true, get: function () { return Cache_1.default; } });
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./arrays":1767772065469,"./async":1767772065472,"./strings":1767772065471,"./unicode":1767772065473,"./numbers":1767772065474,"./errors":1767772065475,"./base64":1767772065470,"./objects":1767772065476,"./validators":1767772065477,"./pdfDocEncoding":1767772065478,"./Cache":1767772065479}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065469, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.toUint8Array = exports.canBeConvertedToUint8Array = exports.pluckIndices = exports.range = exports.sum = exports.reverseArray = exports.sortedUniq = exports.byAscendingId = exports.arrayAsString = exports.mergeUint8Arrays = exports.mergeIntoTypedArray = exports.typedArrayFor = exports.last = void 0;
var base64_1 = require("./base64");
var strings_1 = require("./strings");
exports.last = function (array) { return array[array.length - 1]; };
// export const dropLast = <T>(array: T[]): T[] =>
// array.slice(0, array.length - 1);
exports.typedArrayFor = function (value) {
    if (value instanceof Uint8Array)
        return value;
    var length = value.length;
    var typedArray = new Uint8Array(length);
    for (var idx = 0; idx < length; idx++) {
        typedArray[idx] = value.charCodeAt(idx);
    }
    return typedArray;
};
exports.mergeIntoTypedArray = function () {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    var arrayCount = arrays.length;
    var typedArrays = [];
    for (var idx = 0; idx < arrayCount; idx++) {
        var element = arrays[idx];
        typedArrays[idx] =
            element instanceof Uint8Array ? element : exports.typedArrayFor(element);
    }
    var totalSize = 0;
    for (var idx = 0; idx < arrayCount; idx++) {
        totalSize += arrays[idx].length;
    }
    var merged = new Uint8Array(totalSize);
    var offset = 0;
    for (var arrIdx = 0; arrIdx < arrayCount; arrIdx++) {
        var arr = typedArrays[arrIdx];
        for (var byteIdx = 0, arrLen = arr.length; byteIdx < arrLen; byteIdx++) {
            merged[offset++] = arr[byteIdx];
        }
    }
    return merged;
};
exports.mergeUint8Arrays = function (arrays) {
    var totalSize = 0;
    for (var idx = 0, len = arrays.length; idx < len; idx++) {
        totalSize += arrays[idx].length;
    }
    var mergedBuffer = new Uint8Array(totalSize);
    var offset = 0;
    for (var idx = 0, len = arrays.length; idx < len; idx++) {
        var array = arrays[idx];
        mergedBuffer.set(array, offset);
        offset += array.length;
    }
    return mergedBuffer;
};
exports.arrayAsString = function (array) {
    var str = '';
    for (var idx = 0, len = array.length; idx < len; idx++) {
        str += strings_1.charFromCode(array[idx]);
    }
    return str;
};
exports.byAscendingId = function (a, b) { return a.id - b.id; };
exports.sortedUniq = function (array, indexer) {
    var uniq = [];
    for (var idx = 0, len = array.length; idx < len; idx++) {
        var curr = array[idx];
        var prev = array[idx - 1];
        if (idx === 0 || indexer(curr) !== indexer(prev)) {
            uniq.push(curr);
        }
    }
    return uniq;
};
// Arrays and TypedArrays in JS both have .reverse() methods, which would seem
// to negate the need for this function. However, not all runtimes support this
// method (e.g. React Native). This function compensates for that fact.
exports.reverseArray = function (array) {
    var arrayLen = array.length;
    for (var idx = 0, len = Math.floor(arrayLen / 2); idx < len; idx++) {
        var leftIdx = idx;
        var rightIdx = arrayLen - idx - 1;
        var temp = array[idx];
        array[leftIdx] = array[rightIdx];
        array[rightIdx] = temp;
    }
    return array;
};
exports.sum = function (array) {
    var total = 0;
    for (var idx = 0, len = array.length; idx < len; idx++) {
        total += array[idx];
    }
    return total;
};
exports.range = function (start, end) {
    var arr = new Array(end - start);
    for (var idx = 0, len = arr.length; idx < len; idx++) {
        arr[idx] = start + idx;
    }
    return arr;
};
exports.pluckIndices = function (arr, indices) {
    var plucked = new Array(indices.length);
    for (var idx = 0, len = indices.length; idx < len; idx++) {
        plucked[idx] = arr[indices[idx]];
    }
    return plucked;
};
exports.canBeConvertedToUint8Array = function (input) {
    return input instanceof Uint8Array ||
        input instanceof ArrayBuffer ||
        typeof input === 'string';
};
exports.toUint8Array = function (input) {
    if (typeof input === 'string') {
        return base64_1.decodeFromBase64DataUri(input);
    }
    else if (input instanceof ArrayBuffer) {
        return new Uint8Array(input);
    }
    else if (input instanceof Uint8Array) {
        return input;
    }
    else {
        throw new TypeError('`input` must be one of `string | ArrayBuffer | Uint8Array`');
    }
};
//# sourceMappingURL=arrays.js.map
}, function(modId) { var map = {"./base64":1767772065470,"./strings":1767772065471}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065470, function(require, module, exports) {

/*
 * The `chars`, `lookup`, `encode`, and `decode` members of this file are
 * licensed under the following:
 *
 *     base64-arraybuffer
 *     https://github.com/niklasvh/base64-arraybuffer
 *
 *     Copyright (c) 2012 Niklas von Hertzen
 *     Licensed under the MIT license.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeFromBase64DataUri = exports.decodeFromBase64 = exports.encodeToBase64 = void 0;
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
var lookup = new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
exports.encodeToBase64 = function (bytes) {
    var base64 = '';
    var len = bytes.length;
    for (var i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }
    if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + '=';
    }
    else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + '==';
    }
    return base64;
};
exports.decodeFromBase64 = function (base64) {
    var bufferLength = base64.length * 0.75;
    var len = base64.length;
    var i;
    var p = 0;
    var encoded1;
    var encoded2;
    var encoded3;
    var encoded4;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    var bytes = new Uint8Array(bufferLength);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return bytes;
};
// This regex is designed to be as flexible as possible. It will parse certain
// invalid data URIs.
var DATA_URI_PREFIX_REGEX = /^(data)?:?([\w\/\+]+)?;?(charset=[\w-]+|base64)?.*,/i;
/**
 * If the `dataUri` input is a data URI, then the data URI prefix must not be
 * longer than 100 characters, or this function will fail to decode it.
 *
 * @param dataUri a base64 data URI or plain base64 string
 * @returns a Uint8Array containing the decoded input
 */
exports.decodeFromBase64DataUri = function (dataUri) {
    var trimmedUri = dataUri.trim();
    var prefix = trimmedUri.substring(0, 100);
    var res = prefix.match(DATA_URI_PREFIX_REGEX);
    // Assume it's not a data URI - just a plain base64 string
    if (!res)
        return exports.decodeFromBase64(trimmedUri);
    // Remove the data URI prefix and parse the remainder as a base64 string
    var fullMatch = res[0];
    var data = trimmedUri.substring(fullMatch.length);
    return exports.decodeFromBase64(data);
};
//# sourceMappingURL=base64.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065471, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.findLastMatch = exports.parseDate = exports.breakTextIntoLines = exports.charSplit = exports.charAtIndex = exports.mergeLines = exports.lineSplit = exports.isNewlineChar = exports.newlineChars = exports.escapedNewlineChars = exports.cleanText = exports.escapeRegExp = exports.addRandomSuffix = exports.copyStringIntoBuffer = exports.padStart = exports.charFromHexCode = exports.charFromCode = exports.toHexString = exports.toHexStringOfMinLength = exports.toCodePoint = exports.toCharCode = void 0;
exports.toCharCode = function (character) { return character.charCodeAt(0); };
exports.toCodePoint = function (character) { return character.codePointAt(0); };
exports.toHexStringOfMinLength = function (num, minLength) {
    return exports.padStart(num.toString(16), minLength, '0').toUpperCase();
};
exports.toHexString = function (num) { return exports.toHexStringOfMinLength(num, 2); };
exports.charFromCode = function (code) { return String.fromCharCode(code); };
exports.charFromHexCode = function (hex) { return exports.charFromCode(parseInt(hex, 16)); };
exports.padStart = function (value, length, padChar) {
    var padding = '';
    for (var idx = 0, len = length - value.length; idx < len; idx++) {
        padding += padChar;
    }
    return padding + value;
};
exports.copyStringIntoBuffer = function (str, buffer, offset) {
    var length = str.length;
    for (var idx = 0; idx < length; idx++) {
        buffer[offset++] = str.charCodeAt(idx);
    }
    return length;
};
exports.addRandomSuffix = function (prefix, suffixLength) {
    if (suffixLength === void 0) { suffixLength = 4; }
    return prefix + "-" + Math.floor(Math.random() * Math.pow(10, suffixLength));
};
exports.escapeRegExp = function (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
exports.cleanText = function (text) {
    return text.replace(/\t|\u0085|\u2028|\u2029/g, '    ').replace(/[\b\v]/g, '');
};
exports.escapedNewlineChars = ['\\n', '\\f', '\\r', '\\u000B'];
exports.newlineChars = ['\n', '\f', '\r', '\u000B'];
exports.isNewlineChar = function (text) { return /^[\n\f\r\u000B]$/.test(text); };
exports.lineSplit = function (text) { return text.split(/[\n\f\r\u000B]/); };
exports.mergeLines = function (text) {
    return text.replace(/[\n\f\r\u000B]/g, ' ');
};
// JavaScript's String.charAt() method doesn work on strings containing UTF-16
// characters (with high and low surrogate pairs), such as 💩 (poo emoji). This
// `charAtIndex()` function does.
//
// Credit: https://github.com/mathiasbynens/String.prototype.at/blob/master/at.js#L14-L48
exports.charAtIndex = function (text, index) {
    // Get the first code unit and code unit value
    var cuFirst = text.charCodeAt(index);
    var cuSecond;
    var nextIndex = index + 1;
    var length = 1;
    if (
    // Check if it's the start of a surrogate pair.
    cuFirst >= 0xd800 &&
        cuFirst <= 0xdbff && // high surrogate
        text.length > nextIndex // there is a next code unit
    ) {
        cuSecond = text.charCodeAt(nextIndex);
        if (cuSecond >= 0xdc00 && cuSecond <= 0xdfff)
            length = 2; // low surrogate
    }
    return [text.slice(index, index + length), length];
};
exports.charSplit = function (text) {
    var chars = [];
    for (var idx = 0, len = text.length; idx < len;) {
        var _a = exports.charAtIndex(text, idx), c = _a[0], cLen = _a[1];
        chars.push(c);
        idx += cLen;
    }
    return chars;
};
var buildWordBreakRegex = function (wordBreaks) {
    var newlineCharUnion = exports.escapedNewlineChars.join('|');
    var escapedRules = ['$'];
    for (var idx = 0, len = wordBreaks.length; idx < len; idx++) {
        var wordBreak = wordBreaks[idx];
        if (exports.isNewlineChar(wordBreak)) {
            throw new TypeError("`wordBreak` must not include " + newlineCharUnion);
        }
        escapedRules.push(wordBreak === '' ? '.' : exports.escapeRegExp(wordBreak));
    }
    var breakRules = escapedRules.join('|');
    return new RegExp("(" + newlineCharUnion + ")|((.*?)(" + breakRules + "))", 'gm');
};
exports.breakTextIntoLines = function (text, wordBreaks, maxWidth, computeWidthOfText) {
    var regex = buildWordBreakRegex(wordBreaks);
    var words = exports.cleanText(text).match(regex);
    var currLine = '';
    var currWidth = 0;
    var lines = [];
    var pushCurrLine = function () {
        if (currLine !== '')
            lines.push(currLine);
        currLine = '';
        currWidth = 0;
    };
    for (var idx = 0, len = words.length; idx < len; idx++) {
        var word = words[idx];
        if (exports.isNewlineChar(word)) {
            pushCurrLine();
        }
        else {
            var width = computeWidthOfText(word);
            if (currWidth + width > maxWidth)
                pushCurrLine();
            currLine += word;
            currWidth += width;
        }
    }
    pushCurrLine();
    return lines;
};
// See section "7.9.4 Dates" of the PDF specification
var dateRegex = /^D:(\d\d\d\d)(\d\d)?(\d\d)?(\d\d)?(\d\d)?(\d\d)?([+\-Z])?(\d\d)?'?(\d\d)?'?$/;
exports.parseDate = function (dateStr) {
    var match = dateStr.match(dateRegex);
    if (!match)
        return undefined;
    var year = match[1], _a = match[2], month = _a === void 0 ? '01' : _a, _b = match[3], day = _b === void 0 ? '01' : _b, _c = match[4], hours = _c === void 0 ? '00' : _c, _d = match[5], mins = _d === void 0 ? '00' : _d, _e = match[6], secs = _e === void 0 ? '00' : _e, _f = match[7], offsetSign = _f === void 0 ? 'Z' : _f, _g = match[8], offsetHours = _g === void 0 ? '00' : _g, _h = match[9], offsetMins = _h === void 0 ? '00' : _h;
    // http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15
    var tzOffset = offsetSign === 'Z' ? 'Z' : "" + offsetSign + offsetHours + ":" + offsetMins;
    var date = new Date(year + "-" + month + "-" + day + "T" + hours + ":" + mins + ":" + secs + tzOffset);
    return date;
};
exports.findLastMatch = function (value, regex) {
    var _a;
    var position = 0;
    var lastMatch;
    while (position < value.length) {
        var match = value.substring(position).match(regex);
        if (!match)
            return { match: lastMatch, pos: position };
        lastMatch = match;
        position += ((_a = match.index) !== null && _a !== void 0 ? _a : 0) + match[0].length;
    }
    return { match: lastMatch, pos: position };
};
//# sourceMappingURL=strings.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065472, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForTick = void 0;
/**
 * Returns a Promise that resolves after at least one tick of the
 * Macro Task Queue occurs.
 */
exports.waitForTick = function () {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(); }, 0);
    });
};
//# sourceMappingURL=async.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065473, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.hasUtf16BOM = exports.utf16Decode = exports.lowSurrogate = exports.highSurrogate = exports.hasSurrogates = exports.isWithinBMP = exports.utf16Encode = exports.utf8Encode = void 0;
var strings_1 = require("./strings");
/**
 * Encodes a string to UTF-8.
 *
 * @param input The string to be encoded.
 * @param byteOrderMark Whether or not a byte order marker (BOM) should be added
 *                      to the start of the encoding. (default `true`)
 * @returns A Uint8Array containing the UTF-8 encoding of the input string.
 *
 * -----------------------------------------------------------------------------
 *
 * JavaScript strings are composed of Unicode code points. Code points are
 * integers in the range 0 to 1,114,111 (0x10FFFF). When serializing a string,
 * it must be encoded as a sequence of words. A word is typically 8, 16, or 32
 * bytes in size. As such, Unicode defines three encoding forms: UTF-8, UTF-16,
 * and UTF-32. These encoding forms are described in the Unicode standard [1].
 * This function implements the UTF-8 encoding form.
 *
 * -----------------------------------------------------------------------------
 *
 * In UTF-8, each code point is mapped to a sequence of 1, 2, 3, or 4 bytes.
 * Note that the logic which defines this mapping is slightly convoluted, and
 * not as straightforward as the mapping logic for UTF-16 or UTF-32. The UTF-8
 * mapping logic is as follows [2]:
 *
 * • If a code point is in the range U+0000..U+007F, then view it as a 7-bit
 *   integer: 0bxxxxxxx. Map the code point to 1 byte with the first high order
 *   bit set to 0:
 *
 *       b1=0b0xxxxxxx
 *
 * • If a code point is in the range U+0080..U+07FF, then view it as an 11-bit
 *   integer: 0byyyyyxxxxxx. Map the code point to 2 bytes with the first 5 bits
 *   of the code point stored in the first byte, and the last 6 bits stored in
 *   the second byte:
 *
 *       b1=0b110yyyyy    b2=0b10xxxxxx
 *
 * • If a code point is in the range U+0800..U+FFFF, then view it as a 16-bit
 *   integer, 0bzzzzyyyyyyxxxxxx. Map the code point to 3 bytes with the first
 *   4 bits stored in the first byte, the next 6 bits stored in the second byte,
 *   and the last 6 bits in the third byte:
 *
 *       b1=0b1110zzzz    b2=0b10yyyyyy    b3=0b10xxxxxx
 *
 * • If a code point is in the range U+10000...U+10FFFF, then view it as a
 *   21-bit integer, 0bvvvzzzzzzyyyyyyxxxxxx. Map the code point to 4 bytes with
 *   the first 3 bits stored in the first byte, the next 6 bits stored in the
 *   second byte, the next 6 bits stored in the third byte, and the last 6 bits
 *   stored in the fourth byte:
 *
 *       b1=0b11110xxx    b2=0b10zzzzzz    b3=0b10yyyyyy    b4=0b10xxxxxx
 *
 * -----------------------------------------------------------------------------
 *
 * It is important to note, when iterating through the code points of a string
 * in JavaScript, that if a character is encoded as a surrogate pair it will
 * increase the string's length by 2 instead of 1 [4]. For example:
 *
 * ```
 * > 'a'.length
 * 1
 * > '💩'.length
 * 2
 * > '語'.length
 * 1
 * > 'a💩語'.length
 * 4
 * ```
 *
 * The results of the above example are explained by the fact that the
 * characters 'a' and '語' are not represented by surrogate pairs, but '💩' is.
 *
 * Because of this idiosyncrasy in JavaScript's string implementation and APIs,
 * we must "jump" an extra index after encoding a character as a surrogate
 * pair. In practice, this means we must increment the index of our for loop by
 * 2 if we encode a surrogate pair, and 1 in all other cases.
 *
 * -----------------------------------------------------------------------------
 *
 * References:
 *   - [1] https://www.unicode.org/versions/Unicode12.0.0/UnicodeStandard-12.0.pdf
 *         3.9  Unicode Encoding Forms - UTF-8
 *   - [2] http://www.herongyang.com/Unicode/UTF-8-UTF-8-Encoding.html
 *   - [3] http://www.herongyang.com/Unicode/UTF-8-UTF-8-Encoding-Algorithm.html
 *   - [4] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length#Description
 *
 */
exports.utf8Encode = function (input, byteOrderMark) {
    if (byteOrderMark === void 0) { byteOrderMark = true; }
    var encoded = [];
    if (byteOrderMark)
        encoded.push(0xef, 0xbb, 0xbf);
    for (var idx = 0, len = input.length; idx < len;) {
        var codePoint = input.codePointAt(idx);
        // One byte encoding
        if (codePoint < 0x80) {
            var byte1 = codePoint & 0x7f;
            encoded.push(byte1);
            idx += 1;
        }
        // Two byte encoding
        else if (codePoint < 0x0800) {
            var byte1 = ((codePoint >> 6) & 0x1f) | 0xc0;
            var byte2 = (codePoint & 0x3f) | 0x80;
            encoded.push(byte1, byte2);
            idx += 1;
        }
        // Three byte encoding
        else if (codePoint < 0x010000) {
            var byte1 = ((codePoint >> 12) & 0x0f) | 0xe0;
            var byte2 = ((codePoint >> 6) & 0x3f) | 0x80;
            var byte3 = (codePoint & 0x3f) | 0x80;
            encoded.push(byte1, byte2, byte3);
            idx += 1;
        }
        // Four byte encoding (surrogate pair)
        else if (codePoint < 0x110000) {
            var byte1 = ((codePoint >> 18) & 0x07) | 0xf0;
            var byte2 = ((codePoint >> 12) & 0x3f) | 0x80;
            var byte3 = ((codePoint >> 6) & 0x3f) | 0x80;
            var byte4 = ((codePoint >> 0) & 0x3f) | 0x80;
            encoded.push(byte1, byte2, byte3, byte4);
            idx += 2;
        }
        // Should never reach this case
        else
            throw new Error("Invalid code point: 0x" + strings_1.toHexString(codePoint));
    }
    return new Uint8Array(encoded);
};
/**
 * Encodes a string to UTF-16.
 *
 * @param input The string to be encoded.
 * @param byteOrderMark Whether or not a byte order marker (BOM) should be added
 *                      to the start of the encoding. (default `true`)
 * @returns A Uint16Array containing the UTF-16 encoding of the input string.
 *
 * -----------------------------------------------------------------------------
 *
 * JavaScript strings are composed of Unicode code points. Code points are
 * integers in the range 0 to 1,114,111 (0x10FFFF). When serializing a string,
 * it must be encoded as a sequence of words. A word is typically 8, 16, or 32
 * bytes in size. As such, Unicode defines three encoding forms: UTF-8, UTF-16,
 * and UTF-32. These encoding forms are described in the Unicode standard [1].
 * This function implements the UTF-16 encoding form.
 *
 * -----------------------------------------------------------------------------
 *
 * In UTF-16, each code point is mapped to one or two 16-bit integers. The
 * UTF-16 mapping logic is as follows [2]:
 *
 * • If a code point is in the range U+0000..U+FFFF, then map the code point to
 *   a 16-bit integer with the most significant byte first.
 *
 * • If a code point is in the range U+10000..U+10000, then map the code point
 *   to two 16-bit integers. The first integer should contain the high surrogate
 *   and the second integer should contain the low surrogate. Both surrogates
 *   should be written with the most significant byte first.
 *
 * -----------------------------------------------------------------------------
 *
 * It is important to note, when iterating through the code points of a string
 * in JavaScript, that if a character is encoded as a surrogate pair it will
 * increase the string's length by 2 instead of 1 [4]. For example:
 *
 * ```
 * > 'a'.length
 * 1
 * > '💩'.length
 * 2
 * > '語'.length
 * 1
 * > 'a💩語'.length
 * 4
 * ```
 *
 * The results of the above example are explained by the fact that the
 * characters 'a' and '語' are not represented by surrogate pairs, but '💩' is.
 *
 * Because of this idiosyncrasy in JavaScript's string implementation and APIs,
 * we must "jump" an extra index after encoding a character as a surrogate
 * pair. In practice, this means we must increment the index of our for loop by
 * 2 if we encode a surrogate pair, and 1 in all other cases.
 *
 * -----------------------------------------------------------------------------
 *
 * References:
 *   - [1] https://www.unicode.org/versions/Unicode12.0.0/UnicodeStandard-12.0.pdf
 *         3.9  Unicode Encoding Forms - UTF-8
 *   - [2] http://www.herongyang.com/Unicode/UTF-16-UTF-16-Encoding.html
 *   - [3] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length#Description
 *
 */
exports.utf16Encode = function (input, byteOrderMark) {
    if (byteOrderMark === void 0) { byteOrderMark = true; }
    var encoded = [];
    if (byteOrderMark)
        encoded.push(0xfeff);
    for (var idx = 0, len = input.length; idx < len;) {
        var codePoint = input.codePointAt(idx);
        // Two byte encoding
        if (codePoint < 0x010000) {
            encoded.push(codePoint);
            idx += 1;
        }
        // Four byte encoding (surrogate pair)
        else if (codePoint < 0x110000) {
            encoded.push(exports.highSurrogate(codePoint), exports.lowSurrogate(codePoint));
            idx += 2;
        }
        // Should never reach this case
        else
            throw new Error("Invalid code point: 0x" + strings_1.toHexString(codePoint));
    }
    return new Uint16Array(encoded);
};
/**
 * Returns `true` if the `codePoint` is within the
 * Basic Multilingual Plane (BMP). Code points inside the BMP are not encoded
 * with surrogate pairs.
 * @param codePoint The code point to be evaluated.
 *
 * Reference: https://en.wikipedia.org/wiki/UTF-16#Description
 */
exports.isWithinBMP = function (codePoint) {
    return codePoint >= 0 && codePoint <= 0xffff;
};
/**
 * Returns `true` if the given `codePoint` is valid and must be represented
 * with a surrogate pair when encoded.
 * @param codePoint The code point to be evaluated.
 *
 * Reference: https://en.wikipedia.org/wiki/UTF-16#Description
 */
exports.hasSurrogates = function (codePoint) {
    return codePoint >= 0x010000 && codePoint <= 0x10ffff;
};
// From Unicode 3.0 spec, section 3.7:
//   http://unicode.org/versions/Unicode3.0.0/ch03.pdf
exports.highSurrogate = function (codePoint) {
    return Math.floor((codePoint - 0x10000) / 0x400) + 0xd800;
};
// From Unicode 3.0 spec, section 3.7:
//   http://unicode.org/versions/Unicode3.0.0/ch03.pdf
exports.lowSurrogate = function (codePoint) {
    return ((codePoint - 0x10000) % 0x400) + 0xdc00;
};
var ByteOrder;
(function (ByteOrder) {
    ByteOrder["BigEndian"] = "BigEndian";
    ByteOrder["LittleEndian"] = "LittleEndian";
})(ByteOrder || (ByteOrder = {}));
var REPLACEMENT = '�'.codePointAt(0);
/**
 * Decodes a Uint8Array of data to a string using UTF-16.
 *
 * Note that this function attempts to recover from erronous input by
 * inserting the replacement character (�) to mark invalid code points
 * and surrogate pairs.
 *
 * @param input A Uint8Array containing UTF-16 encoded data
 * @param byteOrderMark Whether or not a byte order marker (BOM) should be read
 *                      at the start of the encoding. (default `true`)
 * @returns The decoded string.
 */
exports.utf16Decode = function (input, byteOrderMark) {
    if (byteOrderMark === void 0) { byteOrderMark = true; }
    // Need at least 2 bytes of data in UTF-16 encodings
    if (input.length <= 1)
        return String.fromCodePoint(REPLACEMENT);
    var byteOrder = byteOrderMark ? readBOM(input) : ByteOrder.BigEndian;
    // Skip byte order mark if needed
    var idx = byteOrderMark ? 2 : 0;
    var codePoints = [];
    while (input.length - idx >= 2) {
        var first = decodeValues(input[idx++], input[idx++], byteOrder);
        if (isHighSurrogate(first)) {
            if (input.length - idx < 2) {
                // Need at least 2 bytes left for the low surrogate that is required
                codePoints.push(REPLACEMENT);
            }
            else {
                var second = decodeValues(input[idx++], input[idx++], byteOrder);
                if (isLowSurrogate(second)) {
                    codePoints.push(first, second);
                }
                else {
                    // Low surrogates should always follow high surrogates
                    codePoints.push(REPLACEMENT);
                }
            }
        }
        else if (isLowSurrogate(first)) {
            // High surrogates should always come first since `decodeValues()`
            // accounts for the byte ordering
            idx += 2;
            codePoints.push(REPLACEMENT);
        }
        else {
            codePoints.push(first);
        }
    }
    // There shouldn't be extra byte(s) left over
    if (idx < input.length)
        codePoints.push(REPLACEMENT);
    return String.fromCodePoint.apply(String, codePoints);
};
/**
 * Returns `true` if the given `codePoint` is a high surrogate.
 * @param codePoint The code point to be evaluated.
 *
 * Reference: https://en.wikipedia.org/wiki/UTF-16#Description
 */
var isHighSurrogate = function (codePoint) {
    return codePoint >= 0xd800 && codePoint <= 0xdbff;
};
/**
 * Returns `true` if the given `codePoint` is a low surrogate.
 * @param codePoint The code point to be evaluated.
 *
 * Reference: https://en.wikipedia.org/wiki/UTF-16#Description
 */
var isLowSurrogate = function (codePoint) {
    return codePoint >= 0xdc00 && codePoint <= 0xdfff;
};
/**
 * Decodes the given utf-16 values first and second using the specified
 * byte order.
 * @param first The first byte of the encoding.
 * @param second The second byte of the encoding.
 * @param byteOrder The byte order of the encoding.
 * Reference: https://en.wikipedia.org/wiki/UTF-16#Examples
 */
var decodeValues = function (first, second, byteOrder) {
    // Append the binary representation of the preceding byte by shifting the
    // first one 8 to the left and than applying a bitwise or-operator to append
    // the second one.
    if (byteOrder === ByteOrder.LittleEndian)
        return (second << 8) | first;
    if (byteOrder === ByteOrder.BigEndian)
        return (first << 8) | second;
    throw new Error("Invalid byteOrder: " + byteOrder);
};
/**
 * Returns whether the given array contains a byte order mark for the
 * UTF-16BE or UTF-16LE encoding. If it has neither, BigEndian is assumed.
 *
 * Reference: https://en.wikipedia.org/wiki/Byte_order_mark#UTF-16
 *
 * @param bytes The byte array to be evaluated.
 */
// prettier-ignore
var readBOM = function (bytes) { return (hasUtf16BigEndianBOM(bytes) ? ByteOrder.BigEndian
    : hasUtf16LittleEndianBOM(bytes) ? ByteOrder.LittleEndian
        : ByteOrder.BigEndian); };
var hasUtf16BigEndianBOM = function (bytes) {
    return bytes[0] === 0xfe && bytes[1] === 0xff;
};
var hasUtf16LittleEndianBOM = function (bytes) {
    return bytes[0] === 0xff && bytes[1] === 0xfe;
};
exports.hasUtf16BOM = function (bytes) {
    return hasUtf16BigEndianBOM(bytes) || hasUtf16LittleEndianBOM(bytes);
};
//# sourceMappingURL=unicode.js.map
}, function(modId) { var map = {"./strings":1767772065471}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065474, function(require, module, exports) {

// tslint:disable radix
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesFor = exports.sizeInBytes = exports.numberToString = void 0;
/**
 * Converts a number to its string representation in decimal. This function
 * differs from simply converting a number to a string with `.toString()`
 * because this function's output string will **not** contain exponential
 * notation.
 *
 * Credit: https://stackoverflow.com/a/46545519
 */
exports.numberToString = function (num) {
    var numStr = String(num);
    if (Math.abs(num) < 1.0) {
        var e = parseInt(num.toString().split('e-')[1]);
        if (e) {
            var negative = num < 0;
            if (negative)
                num *= -1;
            num *= Math.pow(10, e - 1);
            numStr = '0.' + new Array(e).join('0') + num.toString().substring(2);
            if (negative)
                numStr = '-' + numStr;
        }
    }
    else {
        var e = parseInt(num.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            num /= Math.pow(10, e);
            numStr = num.toString() + new Array(e + 1).join('0');
        }
    }
    return numStr;
};
exports.sizeInBytes = function (n) { return Math.ceil(n.toString(2).length / 8); };
/**
 * Converts a number into its constituent bytes and returns them as
 * a number[].
 *
 * Returns most significant byte as first element in array. It may be necessary
 * to call .reverse() to get the bits in the desired order.
 *
 * Example:
 *   bytesFor(0x02A41E) => [ 0b10, 0b10100100, 0b11110 ]
 *
 * Credit for algorithm: https://stackoverflow.com/a/1936865
 */
exports.bytesFor = function (n) {
    var bytes = new Uint8Array(exports.sizeInBytes(n));
    for (var i = 1; i <= bytes.length; i++) {
        bytes[i - 1] = n >> ((bytes.length - i) * 8);
    }
    return bytes;
};
//# sourceMappingURL=numbers.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065475, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
exports.error = function (msg) {
    throw new Error(msg);
};
//# sourceMappingURL=errors.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065476, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.rectanglesAreEqual = exports.isStandardFont = exports.StandardFontValues = exports.values = void 0;
var standard_fonts_1 = require("@pdf-lib/standard-fonts");
exports.values = function (obj) { return Object.keys(obj).map(function (k) { return obj[k]; }); };
exports.StandardFontValues = exports.values(standard_fonts_1.FontNames);
exports.isStandardFont = function (input) {
    return exports.StandardFontValues.includes(input);
};
exports.rectanglesAreEqual = function (a, b) { return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height; };
//# sourceMappingURL=objects.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065477, function(require, module, exports) {

/* tslint:disable:ban-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPositive = exports.assertInteger = exports.assertMultiple = exports.assertRangeOrUndefined = exports.assertRange = exports.assertEachIs = exports.assertOrUndefined = exports.assertIs = exports.createTypeErrorMsg = exports.isType = exports.getType = exports.assertIsSubset = exports.assertIsOneOfOrUndefined = exports.assertIsOneOf = exports.createValueErrorMsg = exports.singleQuote = exports.backtick = void 0;
var objects_1 = require("./objects");
exports.backtick = function (val) { return "`" + val + "`"; };
exports.singleQuote = function (val) { return "'" + val + "'"; };
// prettier-ignore
var formatValue = function (value) {
    var type = typeof value;
    if (type === 'string')
        return exports.singleQuote(value);
    else if (type === 'undefined')
        return exports.backtick(value);
    else
        return value;
};
exports.createValueErrorMsg = function (value, valueName, values) {
    var allowedValues = new Array(values.length);
    for (var idx = 0, len = values.length; idx < len; idx++) {
        var v = values[idx];
        allowedValues[idx] = formatValue(v);
    }
    var joinedValues = allowedValues.join(' or ');
    // prettier-ignore
    return exports.backtick(valueName) + " must be one of " + joinedValues + ", but was actually " + formatValue(value);
};
exports.assertIsOneOf = function (value, valueName, allowedValues) {
    if (!Array.isArray(allowedValues)) {
        allowedValues = objects_1.values(allowedValues);
    }
    for (var idx = 0, len = allowedValues.length; idx < len; idx++) {
        if (value === allowedValues[idx])
            return;
    }
    throw new TypeError(exports.createValueErrorMsg(value, valueName, allowedValues));
};
exports.assertIsOneOfOrUndefined = function (value, valueName, allowedValues) {
    if (!Array.isArray(allowedValues)) {
        allowedValues = objects_1.values(allowedValues);
    }
    exports.assertIsOneOf(value, valueName, allowedValues.concat(undefined));
};
exports.assertIsSubset = function (values, valueName, allowedValues) {
    if (!Array.isArray(allowedValues)) {
        allowedValues = objects_1.values(allowedValues);
    }
    for (var idx = 0, len = values.length; idx < len; idx++) {
        exports.assertIsOneOf(values[idx], valueName, allowedValues);
    }
};
exports.getType = function (val) {
    if (val === null)
        return 'null';
    if (val === undefined)
        return 'undefined';
    if (typeof val === 'string')
        return 'string';
    if (isNaN(val))
        return 'NaN';
    if (typeof val === 'number')
        return 'number';
    if (typeof val === 'boolean')
        return 'boolean';
    if (typeof val === 'symbol')
        return 'symbol';
    if (typeof val === 'bigint')
        return 'bigint';
    if (val.constructor && val.constructor.name)
        return val.constructor.name;
    if (val.name)
        return val.name;
    if (val.constructor)
        return String(val.constructor);
    return String(val);
};
exports.isType = function (value, type) {
    if (type === 'null')
        return value === null;
    if (type === 'undefined')
        return value === undefined;
    if (type === 'string')
        return typeof value === 'string';
    if (type === 'number')
        return typeof value === 'number' && !isNaN(value);
    if (type === 'boolean')
        return typeof value === 'boolean';
    if (type === 'symbol')
        return typeof value === 'symbol';
    if (type === 'bigint')
        return typeof value === 'bigint';
    if (type === Date)
        return value instanceof Date;
    if (type === Array)
        return value instanceof Array;
    if (type === Uint8Array)
        return value instanceof Uint8Array;
    if (type === ArrayBuffer)
        return value instanceof ArrayBuffer;
    if (type === Function)
        return value instanceof Function;
    return value instanceof type[0];
};
exports.createTypeErrorMsg = function (value, valueName, types) {
    var allowedTypes = new Array(types.length);
    for (var idx = 0, len = types.length; idx < len; idx++) {
        var type = types[idx];
        if (type === 'null')
            allowedTypes[idx] = exports.backtick('null');
        if (type === 'undefined')
            allowedTypes[idx] = exports.backtick('undefined');
        if (type === 'string')
            allowedTypes[idx] = exports.backtick('string');
        else if (type === 'number')
            allowedTypes[idx] = exports.backtick('number');
        else if (type === 'boolean')
            allowedTypes[idx] = exports.backtick('boolean');
        else if (type === 'symbol')
            allowedTypes[idx] = exports.backtick('symbol');
        else if (type === 'bigint')
            allowedTypes[idx] = exports.backtick('bigint');
        else if (type === Array)
            allowedTypes[idx] = exports.backtick('Array');
        else if (type === Uint8Array)
            allowedTypes[idx] = exports.backtick('Uint8Array');
        else if (type === ArrayBuffer)
            allowedTypes[idx] = exports.backtick('ArrayBuffer');
        else
            allowedTypes[idx] = exports.backtick(type[1]);
    }
    var joinedTypes = allowedTypes.join(' or ');
    // prettier-ignore
    return exports.backtick(valueName) + " must be of type " + joinedTypes + ", but was actually of type " + exports.backtick(exports.getType(value));
};
exports.assertIs = function (value, valueName, types) {
    for (var idx = 0, len = types.length; idx < len; idx++) {
        if (exports.isType(value, types[idx]))
            return;
    }
    throw new TypeError(exports.createTypeErrorMsg(value, valueName, types));
};
exports.assertOrUndefined = function (value, valueName, types) {
    exports.assertIs(value, valueName, types.concat('undefined'));
};
exports.assertEachIs = function (values, valueName, types) {
    for (var idx = 0, len = values.length; idx < len; idx++) {
        exports.assertIs(values[idx], valueName, types);
    }
};
exports.assertRange = function (value, valueName, min, max) {
    exports.assertIs(value, valueName, ['number']);
    exports.assertIs(min, 'min', ['number']);
    exports.assertIs(max, 'max', ['number']);
    max = Math.max(min, max);
    if (value < min || value > max) {
        // prettier-ignore
        throw new Error(exports.backtick(valueName) + " must be at least " + min + " and at most " + max + ", but was actually " + value);
    }
};
exports.assertRangeOrUndefined = function (value, valueName, min, max) {
    exports.assertIs(value, valueName, ['number', 'undefined']);
    if (typeof value === 'number')
        exports.assertRange(value, valueName, min, max);
};
exports.assertMultiple = function (value, valueName, multiplier) {
    exports.assertIs(value, valueName, ['number']);
    if (value % multiplier !== 0) {
        // prettier-ignore
        throw new Error(exports.backtick(valueName) + " must be a multiple of " + multiplier + ", but was actually " + value);
    }
};
exports.assertInteger = function (value, valueName) {
    if (!Number.isInteger(value)) {
        throw new Error(exports.backtick(valueName) + " must be an integer, but was actually " + value);
    }
};
exports.assertPositive = function (value, valueName) {
    if (![1, 0].includes(Math.sign(value))) {
        // prettier-ignore
        throw new Error(exports.backtick(valueName) + " must be a positive number or 0, but was actually " + value);
    }
};
//# sourceMappingURL=validators.js.map
}, function(modId) { var map = {"./objects":1767772065476}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065478, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfDocEncodingDecode = void 0;
var strings_1 = require("./strings");
// Mapping from PDFDocEncoding to Unicode code point
var pdfDocEncodingToUnicode = new Uint16Array(256);
// Initialize the code points which are the same
for (var idx = 0; idx < 256; idx++) {
    pdfDocEncodingToUnicode[idx] = idx;
}
// Set differences (see "Table D.2 – PDFDocEncoding Character Set" of the PDF spec)
pdfDocEncodingToUnicode[0x16] = strings_1.toCharCode('\u0017'); // SYNCRONOUS IDLE
pdfDocEncodingToUnicode[0x18] = strings_1.toCharCode('\u02D8'); // BREVE
pdfDocEncodingToUnicode[0x19] = strings_1.toCharCode('\u02C7'); // CARON
pdfDocEncodingToUnicode[0x1a] = strings_1.toCharCode('\u02C6'); // MODIFIER LETTER CIRCUMFLEX ACCENT
pdfDocEncodingToUnicode[0x1b] = strings_1.toCharCode('\u02D9'); // DOT ABOVE
pdfDocEncodingToUnicode[0x1c] = strings_1.toCharCode('\u02DD'); // DOUBLE ACUTE ACCENT
pdfDocEncodingToUnicode[0x1d] = strings_1.toCharCode('\u02DB'); // OGONEK
pdfDocEncodingToUnicode[0x1e] = strings_1.toCharCode('\u02DA'); // RING ABOVE
pdfDocEncodingToUnicode[0x1f] = strings_1.toCharCode('\u02DC'); // SMALL TILDE
pdfDocEncodingToUnicode[0x7f] = strings_1.toCharCode('\uFFFD'); // REPLACEMENT CHARACTER (box with questionmark)
pdfDocEncodingToUnicode[0x80] = strings_1.toCharCode('\u2022'); // BULLET
pdfDocEncodingToUnicode[0x81] = strings_1.toCharCode('\u2020'); // DAGGER
pdfDocEncodingToUnicode[0x82] = strings_1.toCharCode('\u2021'); // DOUBLE DAGGER
pdfDocEncodingToUnicode[0x83] = strings_1.toCharCode('\u2026'); // HORIZONTAL ELLIPSIS
pdfDocEncodingToUnicode[0x84] = strings_1.toCharCode('\u2014'); // EM DASH
pdfDocEncodingToUnicode[0x85] = strings_1.toCharCode('\u2013'); // EN DASH
pdfDocEncodingToUnicode[0x86] = strings_1.toCharCode('\u0192'); // LATIN SMALL LETTER SCRIPT F
pdfDocEncodingToUnicode[0x87] = strings_1.toCharCode('\u2044'); // FRACTION SLASH (solidus)
pdfDocEncodingToUnicode[0x88] = strings_1.toCharCode('\u2039'); // SINGLE LEFT-POINTING ANGLE QUOTATION MARK
pdfDocEncodingToUnicode[0x89] = strings_1.toCharCode('\u203A'); // SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
pdfDocEncodingToUnicode[0x8a] = strings_1.toCharCode('\u2212'); // MINUS SIGN
pdfDocEncodingToUnicode[0x8b] = strings_1.toCharCode('\u2030'); // PER MILLE SIGN
pdfDocEncodingToUnicode[0x8c] = strings_1.toCharCode('\u201E'); // DOUBLE LOW-9 QUOTATION MARK (quotedblbase)
pdfDocEncodingToUnicode[0x8d] = strings_1.toCharCode('\u201C'); // LEFT DOUBLE QUOTATION MARK (quotedblleft)
pdfDocEncodingToUnicode[0x8e] = strings_1.toCharCode('\u201D'); // RIGHT DOUBLE QUOTATION MARK (quotedblright)
pdfDocEncodingToUnicode[0x8f] = strings_1.toCharCode('\u2018'); // LEFT SINGLE QUOTATION MARK (quoteleft)
pdfDocEncodingToUnicode[0x90] = strings_1.toCharCode('\u2019'); // RIGHT SINGLE QUOTATION MARK (quoteright)
pdfDocEncodingToUnicode[0x91] = strings_1.toCharCode('\u201A'); // SINGLE LOW-9 QUOTATION MARK (quotesinglbase)
pdfDocEncodingToUnicode[0x92] = strings_1.toCharCode('\u2122'); // TRADE MARK SIGN
pdfDocEncodingToUnicode[0x93] = strings_1.toCharCode('\uFB01'); // LATIN SMALL LIGATURE FI
pdfDocEncodingToUnicode[0x94] = strings_1.toCharCode('\uFB02'); // LATIN SMALL LIGATURE FL
pdfDocEncodingToUnicode[0x95] = strings_1.toCharCode('\u0141'); // LATIN CAPITAL LETTER L WITH STROKE
pdfDocEncodingToUnicode[0x96] = strings_1.toCharCode('\u0152'); // LATIN CAPITAL LIGATURE OE
pdfDocEncodingToUnicode[0x97] = strings_1.toCharCode('\u0160'); // LATIN CAPITAL LETTER S WITH CARON
pdfDocEncodingToUnicode[0x98] = strings_1.toCharCode('\u0178'); // LATIN CAPITAL LETTER Y WITH DIAERESIS
pdfDocEncodingToUnicode[0x99] = strings_1.toCharCode('\u017D'); // LATIN CAPITAL LETTER Z WITH CARON
pdfDocEncodingToUnicode[0x9a] = strings_1.toCharCode('\u0131'); // LATIN SMALL LETTER DOTLESS I
pdfDocEncodingToUnicode[0x9b] = strings_1.toCharCode('\u0142'); // LATIN SMALL LETTER L WITH STROKE
pdfDocEncodingToUnicode[0x9c] = strings_1.toCharCode('\u0153'); // LATIN SMALL LIGATURE OE
pdfDocEncodingToUnicode[0x9d] = strings_1.toCharCode('\u0161'); // LATIN SMALL LETTER S WITH CARON
pdfDocEncodingToUnicode[0x9e] = strings_1.toCharCode('\u017E'); // LATIN SMALL LETTER Z WITH CARON
pdfDocEncodingToUnicode[0x9f] = strings_1.toCharCode('\uFFFD'); // REPLACEMENT CHARACTER (box with questionmark)
pdfDocEncodingToUnicode[0xa0] = strings_1.toCharCode('\u20AC'); // EURO SIGN
pdfDocEncodingToUnicode[0xad] = strings_1.toCharCode('\uFFFD'); // REPLACEMENT CHARACTER (box with questionmark)
/**
 * Decode a byte array into a string using PDFDocEncoding.
 *
 * @param bytes a byte array (decimal representation) containing a string
 *              encoded with PDFDocEncoding.
 */
exports.pdfDocEncodingDecode = function (bytes) {
    var codePoints = new Array(bytes.length);
    for (var idx = 0, len = bytes.length; idx < len; idx++) {
        codePoints[idx] = pdfDocEncodingToUnicode[bytes[idx]];
    }
    return String.fromCodePoint.apply(String, codePoints);
};
//# sourceMappingURL=pdfDocEncoding.js.map
}, function(modId) { var map = {"./strings":1767772065471}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065479, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var Cache = /** @class */ (function () {
    function Cache(populate) {
        this.populate = populate;
        this.value = undefined;
    }
    Cache.prototype.getValue = function () {
        return this.value;
    };
    Cache.prototype.access = function () {
        if (!this.value)
            this.value = this.populate();
        return this.value;
    };
    Cache.prototype.invalidate = function () {
        this.value = undefined;
    };
    Cache.populatedBy = function (populate) { return new Cache(populate); };
    return Cache;
}());
exports.default = Cache;
//# sourceMappingURL=Cache.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065480, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var CharCodes;
(function (CharCodes) {
    CharCodes[CharCodes["Null"] = 0] = "Null";
    CharCodes[CharCodes["Backspace"] = 8] = "Backspace";
    CharCodes[CharCodes["Tab"] = 9] = "Tab";
    CharCodes[CharCodes["Newline"] = 10] = "Newline";
    CharCodes[CharCodes["FormFeed"] = 12] = "FormFeed";
    CharCodes[CharCodes["CarriageReturn"] = 13] = "CarriageReturn";
    CharCodes[CharCodes["Space"] = 32] = "Space";
    CharCodes[CharCodes["ExclamationPoint"] = 33] = "ExclamationPoint";
    CharCodes[CharCodes["Hash"] = 35] = "Hash";
    CharCodes[CharCodes["Percent"] = 37] = "Percent";
    CharCodes[CharCodes["LeftParen"] = 40] = "LeftParen";
    CharCodes[CharCodes["RightParen"] = 41] = "RightParen";
    CharCodes[CharCodes["Plus"] = 43] = "Plus";
    CharCodes[CharCodes["Minus"] = 45] = "Minus";
    CharCodes[CharCodes["Dash"] = 45] = "Dash";
    CharCodes[CharCodes["Period"] = 46] = "Period";
    CharCodes[CharCodes["ForwardSlash"] = 47] = "ForwardSlash";
    CharCodes[CharCodes["Zero"] = 48] = "Zero";
    CharCodes[CharCodes["One"] = 49] = "One";
    CharCodes[CharCodes["Two"] = 50] = "Two";
    CharCodes[CharCodes["Three"] = 51] = "Three";
    CharCodes[CharCodes["Four"] = 52] = "Four";
    CharCodes[CharCodes["Five"] = 53] = "Five";
    CharCodes[CharCodes["Six"] = 54] = "Six";
    CharCodes[CharCodes["Seven"] = 55] = "Seven";
    CharCodes[CharCodes["Eight"] = 56] = "Eight";
    CharCodes[CharCodes["Nine"] = 57] = "Nine";
    CharCodes[CharCodes["LessThan"] = 60] = "LessThan";
    CharCodes[CharCodes["GreaterThan"] = 62] = "GreaterThan";
    CharCodes[CharCodes["A"] = 65] = "A";
    CharCodes[CharCodes["D"] = 68] = "D";
    CharCodes[CharCodes["E"] = 69] = "E";
    CharCodes[CharCodes["F"] = 70] = "F";
    CharCodes[CharCodes["O"] = 79] = "O";
    CharCodes[CharCodes["P"] = 80] = "P";
    CharCodes[CharCodes["R"] = 82] = "R";
    CharCodes[CharCodes["LeftSquareBracket"] = 91] = "LeftSquareBracket";
    CharCodes[CharCodes["BackSlash"] = 92] = "BackSlash";
    CharCodes[CharCodes["RightSquareBracket"] = 93] = "RightSquareBracket";
    CharCodes[CharCodes["a"] = 97] = "a";
    CharCodes[CharCodes["b"] = 98] = "b";
    CharCodes[CharCodes["d"] = 100] = "d";
    CharCodes[CharCodes["e"] = 101] = "e";
    CharCodes[CharCodes["f"] = 102] = "f";
    CharCodes[CharCodes["i"] = 105] = "i";
    CharCodes[CharCodes["j"] = 106] = "j";
    CharCodes[CharCodes["l"] = 108] = "l";
    CharCodes[CharCodes["m"] = 109] = "m";
    CharCodes[CharCodes["n"] = 110] = "n";
    CharCodes[CharCodes["o"] = 111] = "o";
    CharCodes[CharCodes["r"] = 114] = "r";
    CharCodes[CharCodes["s"] = 115] = "s";
    CharCodes[CharCodes["t"] = 116] = "t";
    CharCodes[CharCodes["u"] = 117] = "u";
    CharCodes[CharCodes["x"] = 120] = "x";
    CharCodes[CharCodes["LeftCurly"] = 123] = "LeftCurly";
    CharCodes[CharCodes["RightCurly"] = 125] = "RightCurly";
    CharCodes[CharCodes["Tilde"] = 126] = "Tilde";
})(CharCodes || (CharCodes = {}));
exports.default = CharCodes;
//# sourceMappingURL=CharCodes.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065481, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var pako_1 = tslib_1.__importDefault(require("pako"));
var PDFHeader_1 = tslib_1.__importDefault(require("./document/PDFHeader"));
var errors_1 = require("./errors");
var PDFArray_1 = tslib_1.__importDefault(require("./objects/PDFArray"));
var PDFBool_1 = tslib_1.__importDefault(require("./objects/PDFBool"));
var PDFDict_1 = tslib_1.__importDefault(require("./objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("./objects/PDFName"));
var PDFNull_1 = tslib_1.__importDefault(require("./objects/PDFNull"));
var PDFNumber_1 = tslib_1.__importDefault(require("./objects/PDFNumber"));
var PDFObject_1 = tslib_1.__importDefault(require("./objects/PDFObject"));
var PDFRawStream_1 = tslib_1.__importDefault(require("./objects/PDFRawStream"));
var PDFRef_1 = tslib_1.__importDefault(require("./objects/PDFRef"));
var PDFOperator_1 = tslib_1.__importDefault(require("./operators/PDFOperator"));
var PDFOperatorNames_1 = tslib_1.__importDefault(require("./operators/PDFOperatorNames"));
var PDFContentStream_1 = tslib_1.__importDefault(require("./structures/PDFContentStream"));
var utils_1 = require("../utils");
var rng_1 = require("../utils/rng");
var byAscendingObjectNumber = function (_a, _b) {
    var a = _a[0];
    var b = _b[0];
    return a.objectNumber - b.objectNumber;
};
var PDFContext = /** @class */ (function () {
    function PDFContext() {
        this.largestObjectNumber = 0;
        this.header = PDFHeader_1.default.forVersion(1, 7);
        this.trailerInfo = {};
        this.indirectObjects = new Map();
        this.rng = rng_1.SimpleRNG.withSeed(1);
    }
    PDFContext.prototype.assign = function (ref, object) {
        this.indirectObjects.set(ref, object);
        if (ref.objectNumber > this.largestObjectNumber) {
            this.largestObjectNumber = ref.objectNumber;
        }
    };
    PDFContext.prototype.nextRef = function () {
        this.largestObjectNumber += 1;
        return PDFRef_1.default.of(this.largestObjectNumber);
    };
    PDFContext.prototype.register = function (object) {
        var ref = this.nextRef();
        this.assign(ref, object);
        return ref;
    };
    PDFContext.prototype.delete = function (ref) {
        return this.indirectObjects.delete(ref);
    };
    PDFContext.prototype.lookupMaybe = function (ref) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        // TODO: `preservePDFNull` is for backwards compatibility. Should be
        // removed in next breaking API change.
        var preservePDFNull = types.includes(PDFNull_1.default);
        var result = ref instanceof PDFRef_1.default ? this.indirectObjects.get(ref) : ref;
        if (!result || (result === PDFNull_1.default && !preservePDFNull))
            return undefined;
        for (var idx = 0, len = types.length; idx < len; idx++) {
            var type = types[idx];
            if (type === PDFNull_1.default) {
                if (result === PDFNull_1.default)
                    return result;
            }
            else {
                if (result instanceof type)
                    return result;
            }
        }
        throw new errors_1.UnexpectedObjectTypeError(types, result);
    };
    PDFContext.prototype.lookup = function (ref) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        var result = ref instanceof PDFRef_1.default ? this.indirectObjects.get(ref) : ref;
        if (types.length === 0)
            return result;
        for (var idx = 0, len = types.length; idx < len; idx++) {
            var type = types[idx];
            if (type === PDFNull_1.default) {
                if (result === PDFNull_1.default)
                    return result;
            }
            else {
                if (result instanceof type)
                    return result;
            }
        }
        throw new errors_1.UnexpectedObjectTypeError(types, result);
    };
    PDFContext.prototype.getObjectRef = function (pdfObject) {
        var entries = Array.from(this.indirectObjects.entries());
        for (var idx = 0, len = entries.length; idx < len; idx++) {
            var _a = entries[idx], ref = _a[0], object = _a[1];
            if (object === pdfObject) {
                return ref;
            }
        }
        return undefined;
    };
    PDFContext.prototype.enumerateIndirectObjects = function () {
        return Array.from(this.indirectObjects.entries()).sort(byAscendingObjectNumber);
    };
    PDFContext.prototype.obj = function (literal) {
        if (literal instanceof PDFObject_1.default) {
            return literal;
        }
        else if (literal === null || literal === undefined) {
            return PDFNull_1.default;
        }
        else if (typeof literal === 'string') {
            return PDFName_1.default.of(literal);
        }
        else if (typeof literal === 'number') {
            return PDFNumber_1.default.of(literal);
        }
        else if (typeof literal === 'boolean') {
            return literal ? PDFBool_1.default.True : PDFBool_1.default.False;
        }
        else if (Array.isArray(literal)) {
            var array = PDFArray_1.default.withContext(this);
            for (var idx = 0, len = literal.length; idx < len; idx++) {
                array.push(this.obj(literal[idx]));
            }
            return array;
        }
        else {
            var dict = PDFDict_1.default.withContext(this);
            var keys = Object.keys(literal);
            for (var idx = 0, len = keys.length; idx < len; idx++) {
                var key = keys[idx];
                var value = literal[key];
                if (value !== undefined)
                    dict.set(PDFName_1.default.of(key), this.obj(value));
            }
            return dict;
        }
    };
    PDFContext.prototype.stream = function (contents, dict) {
        if (dict === void 0) { dict = {}; }
        return PDFRawStream_1.default.of(this.obj(dict), utils_1.typedArrayFor(contents));
    };
    PDFContext.prototype.flateStream = function (contents, dict) {
        if (dict === void 0) { dict = {}; }
        return this.stream(pako_1.default.deflate(utils_1.typedArrayFor(contents)), tslib_1.__assign(tslib_1.__assign({}, dict), { Filter: 'FlateDecode' }));
    };
    PDFContext.prototype.contentStream = function (operators, dict) {
        if (dict === void 0) { dict = {}; }
        return PDFContentStream_1.default.of(this.obj(dict), operators);
    };
    PDFContext.prototype.formXObject = function (operators, dict) {
        if (dict === void 0) { dict = {}; }
        return this.contentStream(operators, tslib_1.__assign(tslib_1.__assign({ BBox: this.obj([0, 0, 0, 0]), Matrix: this.obj([1, 0, 0, 1, 0, 0]) }, dict), { Type: 'XObject', Subtype: 'Form' }));
    };
    /*
     * Reference to PDFContentStream that contains a single PDFOperator: `q`.
     * Used by [[PDFPageLeaf]] instances to ensure that when content streams are
     * added to a modified PDF, they start in the default, unchanged graphics
     * state.
     */
    PDFContext.prototype.getPushGraphicsStateContentStream = function () {
        if (this.pushGraphicsStateContentStreamRef) {
            return this.pushGraphicsStateContentStreamRef;
        }
        var dict = this.obj({});
        var op = PDFOperator_1.default.of(PDFOperatorNames_1.default.PushGraphicsState);
        var stream = PDFContentStream_1.default.of(dict, [op]);
        this.pushGraphicsStateContentStreamRef = this.register(stream);
        return this.pushGraphicsStateContentStreamRef;
    };
    /*
     * Reference to PDFContentStream that contains a single PDFOperator: `Q`.
     * Used by [[PDFPageLeaf]] instances to ensure that when content streams are
     * added to a modified PDF, they start in the default, unchanged graphics
     * state.
     */
    PDFContext.prototype.getPopGraphicsStateContentStream = function () {
        if (this.popGraphicsStateContentStreamRef) {
            return this.popGraphicsStateContentStreamRef;
        }
        var dict = this.obj({});
        var op = PDFOperator_1.default.of(PDFOperatorNames_1.default.PopGraphicsState);
        var stream = PDFContentStream_1.default.of(dict, [op]);
        this.popGraphicsStateContentStreamRef = this.register(stream);
        return this.popGraphicsStateContentStreamRef;
    };
    PDFContext.prototype.addRandomSuffix = function (prefix, suffixLength) {
        if (suffixLength === void 0) { suffixLength = 4; }
        return prefix + "-" + Math.floor(this.rng.nextInt() * Math.pow(10, suffixLength));
    };
    PDFContext.create = function () { return new PDFContext(); };
    return PDFContext;
}());
exports.default = PDFContext;
//# sourceMappingURL=PDFContext.js.map
}, function(modId) { var map = {"./document/PDFHeader":1767772065482,"./errors":1767772065467,"./objects/PDFArray":1767772065483,"./objects/PDFBool":1767772065486,"./objects/PDFDict":1767772065487,"./objects/PDFName":1767772065488,"./objects/PDFNull":1767772065492,"./objects/PDFNumber":1767772065484,"./objects/PDFObject":1767772065485,"./objects/PDFRawStream":1767772065493,"./objects/PDFRef":1767772065495,"./operators/PDFOperator":1767772065496,"./operators/PDFOperatorNames":1767772065497,"./structures/PDFContentStream":1767772065498,"../utils":1767772065468,"../utils/rng":1767772065500}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065482, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
var PDFHeader = /** @class */ (function () {
    function PDFHeader(major, minor) {
        this.major = String(major);
        this.minor = String(minor);
    }
    PDFHeader.prototype.toString = function () {
        var bc = utils_1.charFromCode(129);
        return "%PDF-" + this.major + "." + this.minor + "\n%" + bc + bc + bc + bc;
    };
    PDFHeader.prototype.sizeInBytes = function () {
        return 12 + this.major.length + this.minor.length;
    };
    PDFHeader.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes_1.default.Percent;
        buffer[offset++] = CharCodes_1.default.P;
        buffer[offset++] = CharCodes_1.default.D;
        buffer[offset++] = CharCodes_1.default.F;
        buffer[offset++] = CharCodes_1.default.Dash;
        offset += utils_1.copyStringIntoBuffer(this.major, buffer, offset);
        buffer[offset++] = CharCodes_1.default.Period;
        offset += utils_1.copyStringIntoBuffer(this.minor, buffer, offset);
        buffer[offset++] = CharCodes_1.default.Newline;
        buffer[offset++] = CharCodes_1.default.Percent;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        return offset - initialOffset;
    };
    PDFHeader.forVersion = function (major, minor) {
        return new PDFHeader(major, minor);
    };
    return PDFHeader;
}());
exports.default = PDFHeader;
//# sourceMappingURL=PDFHeader.js.map
}, function(modId) { var map = {"../syntax/CharCodes":1767772065480,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065483, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFNumber_1 = tslib_1.__importDefault(require("./PDFNumber"));
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var errors_1 = require("../errors");
var PDFArray = /** @class */ (function (_super) {
    tslib_1.__extends(PDFArray, _super);
    function PDFArray(context) {
        var _this = _super.call(this) || this;
        _this.array = [];
        _this.context = context;
        return _this;
    }
    PDFArray.prototype.size = function () {
        return this.array.length;
    };
    PDFArray.prototype.push = function (object) {
        this.array.push(object);
    };
    PDFArray.prototype.insert = function (index, object) {
        this.array.splice(index, 0, object);
    };
    PDFArray.prototype.indexOf = function (object) {
        var index = this.array.indexOf(object);
        return index === -1 ? undefined : index;
    };
    PDFArray.prototype.remove = function (index) {
        this.array.splice(index, 1);
    };
    PDFArray.prototype.set = function (idx, object) {
        this.array[idx] = object;
    };
    PDFArray.prototype.get = function (index) {
        return this.array[index];
    };
    PDFArray.prototype.lookupMaybe = function (index) {
        var _a;
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        return (_a = this.context).lookupMaybe.apply(_a, tslib_1.__spreadArrays([this.get(index)], types));
    };
    PDFArray.prototype.lookup = function (index) {
        var _a;
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        return (_a = this.context).lookup.apply(_a, tslib_1.__spreadArrays([this.get(index)], types));
    };
    PDFArray.prototype.asRectangle = function () {
        if (this.size() !== 4)
            throw new errors_1.PDFArrayIsNotRectangleError(this.size());
        var lowerLeftX = this.lookup(0, PDFNumber_1.default).asNumber();
        var lowerLeftY = this.lookup(1, PDFNumber_1.default).asNumber();
        var upperRightX = this.lookup(2, PDFNumber_1.default).asNumber();
        var upperRightY = this.lookup(3, PDFNumber_1.default).asNumber();
        var x = lowerLeftX;
        var y = lowerLeftY;
        var width = upperRightX - lowerLeftX;
        var height = upperRightY - lowerLeftY;
        return { x: x, y: y, width: width, height: height };
    };
    PDFArray.prototype.asArray = function () {
        return this.array.slice();
    };
    PDFArray.prototype.clone = function (context) {
        var clone = PDFArray.withContext(context || this.context);
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            clone.push(this.array[idx]);
        }
        return clone;
    };
    PDFArray.prototype.toString = function () {
        var arrayString = '[ ';
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            arrayString += this.get(idx).toString();
            arrayString += ' ';
        }
        arrayString += ']';
        return arrayString;
    };
    PDFArray.prototype.sizeInBytes = function () {
        var size = 3;
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            size += this.get(idx).sizeInBytes() + 1;
        }
        return size;
    };
    PDFArray.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes_1.default.LeftSquareBracket;
        buffer[offset++] = CharCodes_1.default.Space;
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            offset += this.get(idx).copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes_1.default.Space;
        }
        buffer[offset++] = CharCodes_1.default.RightSquareBracket;
        return offset - initialOffset;
    };
    PDFArray.prototype.scalePDFNumbers = function (x, y) {
        for (var idx = 0, len = this.size(); idx < len; idx++) {
            var el = this.lookup(idx);
            if (el instanceof PDFNumber_1.default) {
                var factor = idx % 2 === 0 ? x : y;
                this.set(idx, PDFNumber_1.default.of(el.asNumber() * factor));
            }
        }
    };
    PDFArray.withContext = function (context) { return new PDFArray(context); };
    return PDFArray;
}(PDFObject_1.default));
exports.default = PDFArray;
//# sourceMappingURL=PDFArray.js.map
}, function(modId) { var map = {"./PDFNumber":1767772065484,"./PDFObject":1767772065485,"../syntax/CharCodes":1767772065480,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065484, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = require("../../utils/index");
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var PDFNumber = /** @class */ (function (_super) {
    tslib_1.__extends(PDFNumber, _super);
    function PDFNumber(value) {
        var _this = _super.call(this) || this;
        _this.numberValue = value;
        _this.stringValue = index_1.numberToString(value);
        return _this;
    }
    PDFNumber.prototype.asNumber = function () {
        return this.numberValue;
    };
    /** @deprecated in favor of [[PDFNumber.asNumber]] */
    PDFNumber.prototype.value = function () {
        return this.numberValue;
    };
    PDFNumber.prototype.clone = function () {
        return PDFNumber.of(this.numberValue);
    };
    PDFNumber.prototype.toString = function () {
        return this.stringValue;
    };
    PDFNumber.prototype.sizeInBytes = function () {
        return this.stringValue.length;
    };
    PDFNumber.prototype.copyBytesInto = function (buffer, offset) {
        offset += index_1.copyStringIntoBuffer(this.stringValue, buffer, offset);
        return this.stringValue.length;
    };
    PDFNumber.of = function (value) { return new PDFNumber(value); };
    return PDFNumber;
}(PDFObject_1.default));
exports.default = PDFNumber;
//# sourceMappingURL=PDFNumber.js.map
}, function(modId) { var map = {"../../utils/index":1767772065468,"./PDFObject":1767772065485}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065485, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var PDFObject = /** @class */ (function () {
    function PDFObject() {
    }
    PDFObject.prototype.clone = function (_context) {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'clone');
    };
    PDFObject.prototype.toString = function () {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'toString');
    };
    PDFObject.prototype.sizeInBytes = function () {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'sizeInBytes');
    };
    PDFObject.prototype.copyBytesInto = function (_buffer, _offset) {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'copyBytesInto');
    };
    return PDFObject;
}());
exports.default = PDFObject;
//# sourceMappingURL=PDFObject.js.map
}, function(modId) { var map = {"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065486, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var ENFORCER = {};
var PDFBool = /** @class */ (function (_super) {
    tslib_1.__extends(PDFBool, _super);
    function PDFBool(enforcer, value) {
        var _this = this;
        if (enforcer !== ENFORCER)
            throw new errors_1.PrivateConstructorError('PDFBool');
        _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    PDFBool.prototype.asBoolean = function () {
        return this.value;
    };
    PDFBool.prototype.clone = function () {
        return this;
    };
    PDFBool.prototype.toString = function () {
        return String(this.value);
    };
    PDFBool.prototype.sizeInBytes = function () {
        return this.value ? 4 : 5;
    };
    PDFBool.prototype.copyBytesInto = function (buffer, offset) {
        if (this.value) {
            buffer[offset++] = CharCodes_1.default.t;
            buffer[offset++] = CharCodes_1.default.r;
            buffer[offset++] = CharCodes_1.default.u;
            buffer[offset++] = CharCodes_1.default.e;
            return 4;
        }
        else {
            buffer[offset++] = CharCodes_1.default.f;
            buffer[offset++] = CharCodes_1.default.a;
            buffer[offset++] = CharCodes_1.default.l;
            buffer[offset++] = CharCodes_1.default.s;
            buffer[offset++] = CharCodes_1.default.e;
            return 5;
        }
    };
    PDFBool.True = new PDFBool(ENFORCER, true);
    PDFBool.False = new PDFBool(ENFORCER, false);
    return PDFBool;
}(PDFObject_1.default));
exports.default = PDFBool;
//# sourceMappingURL=PDFBool.js.map
}, function(modId) { var map = {"../errors":1767772065467,"./PDFObject":1767772065485,"../syntax/CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065487, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFName_1 = tslib_1.__importDefault(require("./PDFName"));
var PDFNull_1 = tslib_1.__importDefault(require("./PDFNull"));
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var PDFDict = /** @class */ (function (_super) {
    tslib_1.__extends(PDFDict, _super);
    function PDFDict(map, context) {
        var _this = _super.call(this) || this;
        _this.dict = map;
        _this.context = context;
        return _this;
    }
    PDFDict.prototype.keys = function () {
        return Array.from(this.dict.keys());
    };
    PDFDict.prototype.values = function () {
        return Array.from(this.dict.values());
    };
    PDFDict.prototype.entries = function () {
        return Array.from(this.dict.entries());
    };
    PDFDict.prototype.set = function (key, value) {
        this.dict.set(key, value);
    };
    PDFDict.prototype.get = function (key, 
    // TODO: `preservePDFNull` is for backwards compatibility. Should be
    // removed in next breaking API change.
    preservePDFNull) {
        if (preservePDFNull === void 0) { preservePDFNull = false; }
        var value = this.dict.get(key);
        if (value === PDFNull_1.default && !preservePDFNull)
            return undefined;
        return value;
    };
    PDFDict.prototype.has = function (key) {
        var value = this.dict.get(key);
        return value !== undefined && value !== PDFNull_1.default;
    };
    PDFDict.prototype.lookupMaybe = function (key) {
        var _a;
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        // TODO: `preservePDFNull` is for backwards compatibility. Should be
        // removed in next breaking API change.
        var preservePDFNull = types.includes(PDFNull_1.default);
        var value = (_a = this.context).lookupMaybe.apply(_a, tslib_1.__spreadArrays([this.get(key, preservePDFNull)], types));
        if (value === PDFNull_1.default && !preservePDFNull)
            return undefined;
        return value;
    };
    PDFDict.prototype.lookup = function (key) {
        var _a;
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        // TODO: `preservePDFNull` is for backwards compatibility. Should be
        // removed in next breaking API change.
        var preservePDFNull = types.includes(PDFNull_1.default);
        var value = (_a = this.context).lookup.apply(_a, tslib_1.__spreadArrays([this.get(key, preservePDFNull)], types));
        if (value === PDFNull_1.default && !preservePDFNull)
            return undefined;
        return value;
    };
    PDFDict.prototype.delete = function (key) {
        return this.dict.delete(key);
    };
    PDFDict.prototype.asMap = function () {
        return new Map(this.dict);
    };
    /** Generate a random key that doesn't exist in current key set */
    PDFDict.prototype.uniqueKey = function (tag) {
        if (tag === void 0) { tag = ''; }
        var existingKeys = this.keys();
        var key = PDFName_1.default.of(this.context.addRandomSuffix(tag, 10));
        while (existingKeys.includes(key)) {
            key = PDFName_1.default.of(this.context.addRandomSuffix(tag, 10));
        }
        return key;
    };
    PDFDict.prototype.clone = function (context) {
        var clone = PDFDict.withContext(context || this.context);
        var entries = this.entries();
        for (var idx = 0, len = entries.length; idx < len; idx++) {
            var _a = entries[idx], key = _a[0], value = _a[1];
            clone.set(key, value);
        }
        return clone;
    };
    PDFDict.prototype.toString = function () {
        var dictString = '<<\n';
        var entries = this.entries();
        for (var idx = 0, len = entries.length; idx < len; idx++) {
            var _a = entries[idx], key = _a[0], value = _a[1];
            dictString += key.toString() + ' ' + value.toString() + '\n';
        }
        dictString += '>>';
        return dictString;
    };
    PDFDict.prototype.sizeInBytes = function () {
        var size = 5;
        var entries = this.entries();
        for (var idx = 0, len = entries.length; idx < len; idx++) {
            var _a = entries[idx], key = _a[0], value = _a[1];
            size += key.sizeInBytes() + value.sizeInBytes() + 2;
        }
        return size;
    };
    PDFDict.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes_1.default.LessThan;
        buffer[offset++] = CharCodes_1.default.LessThan;
        buffer[offset++] = CharCodes_1.default.Newline;
        var entries = this.entries();
        for (var idx = 0, len = entries.length; idx < len; idx++) {
            var _a = entries[idx], key = _a[0], value = _a[1];
            offset += key.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes_1.default.Space;
            offset += value.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes_1.default.Newline;
        }
        buffer[offset++] = CharCodes_1.default.GreaterThan;
        buffer[offset++] = CharCodes_1.default.GreaterThan;
        return offset - initialOffset;
    };
    PDFDict.withContext = function (context) { return new PDFDict(new Map(), context); };
    PDFDict.fromMapWithContext = function (map, context) {
        return new PDFDict(map, context);
    };
    return PDFDict;
}(PDFObject_1.default));
exports.default = PDFDict;
//# sourceMappingURL=PDFDict.js.map
}, function(modId) { var map = {"./PDFName":1767772065488,"./PDFNull":1767772065492,"./PDFObject":1767772065485,"../syntax/CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065488, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var Irregular_1 = require("../syntax/Irregular");
var utils_1 = require("../../utils");
var decodeName = function (name) {
    return name.replace(/#([\dABCDEF]{2})/g, function (_, hex) { return utils_1.charFromHexCode(hex); });
};
var isRegularChar = function (charCode) {
    return charCode >= CharCodes_1.default.ExclamationPoint &&
        charCode <= CharCodes_1.default.Tilde &&
        !Irregular_1.IsIrregular[charCode];
};
var ENFORCER = {};
var pool = new Map();
var PDFName = /** @class */ (function (_super) {
    tslib_1.__extends(PDFName, _super);
    function PDFName(enforcer, name) {
        var _this = this;
        if (enforcer !== ENFORCER)
            throw new errors_1.PrivateConstructorError('PDFName');
        _this = _super.call(this) || this;
        var encodedName = '/';
        for (var idx = 0, len = name.length; idx < len; idx++) {
            var character = name[idx];
            var code = utils_1.toCharCode(character);
            encodedName += isRegularChar(code) ? character : "#" + utils_1.toHexString(code);
        }
        _this.encodedName = encodedName;
        return _this;
    }
    PDFName.prototype.asBytes = function () {
        var bytes = [];
        var hex = '';
        var escaped = false;
        var pushByte = function (byte) {
            if (byte !== undefined)
                bytes.push(byte);
            escaped = false;
        };
        for (var idx = 1, len = this.encodedName.length; idx < len; idx++) {
            var char = this.encodedName[idx];
            var byte = utils_1.toCharCode(char);
            var nextChar = this.encodedName[idx + 1];
            if (!escaped) {
                if (byte === CharCodes_1.default.Hash)
                    escaped = true;
                else
                    pushByte(byte);
            }
            else {
                if ((byte >= CharCodes_1.default.Zero && byte <= CharCodes_1.default.Nine) ||
                    (byte >= CharCodes_1.default.a && byte <= CharCodes_1.default.f) ||
                    (byte >= CharCodes_1.default.A && byte <= CharCodes_1.default.F)) {
                    hex += char;
                    if (hex.length === 2 ||
                        !((nextChar >= '0' && nextChar <= '9') ||
                            (nextChar >= 'a' && nextChar <= 'f') ||
                            (nextChar >= 'A' && nextChar <= 'F'))) {
                        pushByte(parseInt(hex, 16));
                        hex = '';
                    }
                }
                else {
                    pushByte(byte);
                }
            }
        }
        return new Uint8Array(bytes);
    };
    // TODO: This should probably use `utf8Decode()`
    // TODO: Polyfill Array.from?
    PDFName.prototype.decodeText = function () {
        var bytes = this.asBytes();
        return String.fromCharCode.apply(String, Array.from(bytes));
    };
    PDFName.prototype.asString = function () {
        return this.encodedName;
    };
    /** @deprecated in favor of [[PDFName.asString]] */
    PDFName.prototype.value = function () {
        return this.encodedName;
    };
    PDFName.prototype.clone = function () {
        return this;
    };
    PDFName.prototype.toString = function () {
        return this.encodedName;
    };
    PDFName.prototype.sizeInBytes = function () {
        return this.encodedName.length;
    };
    PDFName.prototype.copyBytesInto = function (buffer, offset) {
        offset += utils_1.copyStringIntoBuffer(this.encodedName, buffer, offset);
        return this.encodedName.length;
    };
    PDFName.of = function (name) {
        var decodedValue = decodeName(name);
        var instance = pool.get(decodedValue);
        if (!instance) {
            instance = new PDFName(ENFORCER, decodedValue);
            pool.set(decodedValue, instance);
        }
        return instance;
    };
    /* tslint:disable member-ordering */
    PDFName.Length = PDFName.of('Length');
    PDFName.FlateDecode = PDFName.of('FlateDecode');
    PDFName.Resources = PDFName.of('Resources');
    PDFName.Font = PDFName.of('Font');
    PDFName.XObject = PDFName.of('XObject');
    PDFName.ExtGState = PDFName.of('ExtGState');
    PDFName.Contents = PDFName.of('Contents');
    PDFName.Type = PDFName.of('Type');
    PDFName.Parent = PDFName.of('Parent');
    PDFName.MediaBox = PDFName.of('MediaBox');
    PDFName.Page = PDFName.of('Page');
    PDFName.Annots = PDFName.of('Annots');
    PDFName.TrimBox = PDFName.of('TrimBox');
    PDFName.ArtBox = PDFName.of('ArtBox');
    PDFName.BleedBox = PDFName.of('BleedBox');
    PDFName.CropBox = PDFName.of('CropBox');
    PDFName.Rotate = PDFName.of('Rotate');
    PDFName.Title = PDFName.of('Title');
    PDFName.Author = PDFName.of('Author');
    PDFName.Subject = PDFName.of('Subject');
    PDFName.Creator = PDFName.of('Creator');
    PDFName.Keywords = PDFName.of('Keywords');
    PDFName.Producer = PDFName.of('Producer');
    PDFName.CreationDate = PDFName.of('CreationDate');
    PDFName.ModDate = PDFName.of('ModDate');
    return PDFName;
}(PDFObject_1.default));
exports.default = PDFName;
//# sourceMappingURL=PDFName.js.map
}, function(modId) { var map = {"../errors":1767772065467,"./PDFObject":1767772065485,"../syntax/CharCodes":1767772065480,"../syntax/Irregular":1767772065489,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065489, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.IsIrregular = void 0;
var tslib_1 = require("tslib");
var CharCodes_1 = tslib_1.__importDefault(require("./CharCodes"));
var Delimiters_1 = require("./Delimiters");
var Whitespace_1 = require("./Whitespace");
exports.IsIrregular = new Uint8Array(256);
for (var idx = 0, len = 256; idx < len; idx++) {
    exports.IsIrregular[idx] = Whitespace_1.IsWhitespace[idx] || Delimiters_1.IsDelimiter[idx] ? 1 : 0;
}
exports.IsIrregular[CharCodes_1.default.Hash] = 1;
//# sourceMappingURL=Irregular.js.map
}, function(modId) { var map = {"./CharCodes":1767772065480,"./Delimiters":1767772065490,"./Whitespace":1767772065491}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065490, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.IsDelimiter = void 0;
var tslib_1 = require("tslib");
var CharCodes_1 = tslib_1.__importDefault(require("./CharCodes"));
exports.IsDelimiter = new Uint8Array(256);
exports.IsDelimiter[CharCodes_1.default.LeftParen] = 1;
exports.IsDelimiter[CharCodes_1.default.RightParen] = 1;
exports.IsDelimiter[CharCodes_1.default.LessThan] = 1;
exports.IsDelimiter[CharCodes_1.default.GreaterThan] = 1;
exports.IsDelimiter[CharCodes_1.default.LeftSquareBracket] = 1;
exports.IsDelimiter[CharCodes_1.default.RightSquareBracket] = 1;
exports.IsDelimiter[CharCodes_1.default.LeftCurly] = 1;
exports.IsDelimiter[CharCodes_1.default.RightCurly] = 1;
exports.IsDelimiter[CharCodes_1.default.ForwardSlash] = 1;
exports.IsDelimiter[CharCodes_1.default.Percent] = 1;
//# sourceMappingURL=Delimiters.js.map
}, function(modId) { var map = {"./CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065491, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.IsWhitespace = void 0;
var tslib_1 = require("tslib");
var CharCodes_1 = tslib_1.__importDefault(require("./CharCodes"));
exports.IsWhitespace = new Uint8Array(256);
exports.IsWhitespace[CharCodes_1.default.Null] = 1;
exports.IsWhitespace[CharCodes_1.default.Tab] = 1;
exports.IsWhitespace[CharCodes_1.default.Newline] = 1;
exports.IsWhitespace[CharCodes_1.default.FormFeed] = 1;
exports.IsWhitespace[CharCodes_1.default.CarriageReturn] = 1;
exports.IsWhitespace[CharCodes_1.default.Space] = 1;
//# sourceMappingURL=Whitespace.js.map
}, function(modId) { var map = {"./CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065492, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var PDFNull = /** @class */ (function (_super) {
    tslib_1.__extends(PDFNull, _super);
    function PDFNull() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFNull.prototype.asNull = function () {
        return null;
    };
    PDFNull.prototype.clone = function () {
        return this;
    };
    PDFNull.prototype.toString = function () {
        return 'null';
    };
    PDFNull.prototype.sizeInBytes = function () {
        return 4;
    };
    PDFNull.prototype.copyBytesInto = function (buffer, offset) {
        buffer[offset++] = CharCodes_1.default.n;
        buffer[offset++] = CharCodes_1.default.u;
        buffer[offset++] = CharCodes_1.default.l;
        buffer[offset++] = CharCodes_1.default.l;
        return 4;
    };
    return PDFNull;
}(PDFObject_1.default));
exports.default = new PDFNull();
//# sourceMappingURL=PDFNull.js.map
}, function(modId) { var map = {"./PDFObject":1767772065485,"../syntax/CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065493, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFStream_1 = tslib_1.__importDefault(require("./PDFStream"));
var utils_1 = require("../../utils");
var PDFRawStream = /** @class */ (function (_super) {
    tslib_1.__extends(PDFRawStream, _super);
    function PDFRawStream(dict, contents) {
        var _this = _super.call(this, dict) || this;
        _this.contents = contents;
        return _this;
    }
    PDFRawStream.prototype.asUint8Array = function () {
        return this.contents.slice();
    };
    PDFRawStream.prototype.clone = function (context) {
        return PDFRawStream.of(this.dict.clone(context), this.contents.slice());
    };
    PDFRawStream.prototype.getContentsString = function () {
        return utils_1.arrayAsString(this.contents);
    };
    PDFRawStream.prototype.getContents = function () {
        return this.contents;
    };
    PDFRawStream.prototype.getContentsSize = function () {
        return this.contents.length;
    };
    PDFRawStream.of = function (dict, contents) {
        return new PDFRawStream(dict, contents);
    };
    return PDFRawStream;
}(PDFStream_1.default));
exports.default = PDFRawStream;
//# sourceMappingURL=PDFRawStream.js.map
}, function(modId) { var map = {"./PDFStream":1767772065494,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065494, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFName_1 = tslib_1.__importDefault(require("./PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("./PDFNumber"));
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var PDFStream = /** @class */ (function (_super) {
    tslib_1.__extends(PDFStream, _super);
    function PDFStream(dict) {
        var _this = _super.call(this) || this;
        _this.dict = dict;
        return _this;
    }
    PDFStream.prototype.clone = function (_context) {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'clone');
    };
    PDFStream.prototype.getContentsString = function () {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'getContentsString');
    };
    PDFStream.prototype.getContents = function () {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'getContents');
    };
    PDFStream.prototype.getContentsSize = function () {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'getContentsSize');
    };
    PDFStream.prototype.updateDict = function () {
        var contentsSize = this.getContentsSize();
        this.dict.set(PDFName_1.default.Length, PDFNumber_1.default.of(contentsSize));
    };
    PDFStream.prototype.sizeInBytes = function () {
        this.updateDict();
        return this.dict.sizeInBytes() + this.getContentsSize() + 18;
    };
    PDFStream.prototype.toString = function () {
        this.updateDict();
        var streamString = this.dict.toString();
        streamString += '\nstream\n';
        streamString += this.getContentsString();
        streamString += '\nendstream';
        return streamString;
    };
    PDFStream.prototype.copyBytesInto = function (buffer, offset) {
        this.updateDict();
        var initialOffset = offset;
        offset += this.dict.copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes_1.default.Newline;
        buffer[offset++] = CharCodes_1.default.s;
        buffer[offset++] = CharCodes_1.default.t;
        buffer[offset++] = CharCodes_1.default.r;
        buffer[offset++] = CharCodes_1.default.e;
        buffer[offset++] = CharCodes_1.default.a;
        buffer[offset++] = CharCodes_1.default.m;
        buffer[offset++] = CharCodes_1.default.Newline;
        var contents = this.getContents();
        for (var idx = 0, len = contents.length; idx < len; idx++) {
            buffer[offset++] = contents[idx];
        }
        buffer[offset++] = CharCodes_1.default.Newline;
        buffer[offset++] = CharCodes_1.default.e;
        buffer[offset++] = CharCodes_1.default.n;
        buffer[offset++] = CharCodes_1.default.d;
        buffer[offset++] = CharCodes_1.default.s;
        buffer[offset++] = CharCodes_1.default.t;
        buffer[offset++] = CharCodes_1.default.r;
        buffer[offset++] = CharCodes_1.default.e;
        buffer[offset++] = CharCodes_1.default.a;
        buffer[offset++] = CharCodes_1.default.m;
        return offset - initialOffset;
    };
    return PDFStream;
}(PDFObject_1.default));
exports.default = PDFStream;
//# sourceMappingURL=PDFStream.js.map
}, function(modId) { var map = {"../errors":1767772065467,"./PDFName":1767772065488,"./PDFNumber":1767772065484,"./PDFObject":1767772065485,"../syntax/CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065495, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var utils_1 = require("../../utils");
var ENFORCER = {};
var pool = new Map();
var PDFRef = /** @class */ (function (_super) {
    tslib_1.__extends(PDFRef, _super);
    function PDFRef(enforcer, objectNumber, generationNumber) {
        var _this = this;
        if (enforcer !== ENFORCER)
            throw new errors_1.PrivateConstructorError('PDFRef');
        _this = _super.call(this) || this;
        _this.objectNumber = objectNumber;
        _this.generationNumber = generationNumber;
        _this.tag = objectNumber + " " + generationNumber + " R";
        return _this;
    }
    PDFRef.prototype.clone = function () {
        return this;
    };
    PDFRef.prototype.toString = function () {
        return this.tag;
    };
    PDFRef.prototype.sizeInBytes = function () {
        return this.tag.length;
    };
    PDFRef.prototype.copyBytesInto = function (buffer, offset) {
        offset += utils_1.copyStringIntoBuffer(this.tag, buffer, offset);
        return this.tag.length;
    };
    PDFRef.of = function (objectNumber, generationNumber) {
        if (generationNumber === void 0) { generationNumber = 0; }
        var tag = objectNumber + " " + generationNumber + " R";
        var instance = pool.get(tag);
        if (!instance) {
            instance = new PDFRef(ENFORCER, objectNumber, generationNumber);
            pool.set(tag, instance);
        }
        return instance;
    };
    return PDFRef;
}(PDFObject_1.default));
exports.default = PDFRef;
//# sourceMappingURL=PDFRef.js.map
}, function(modId) { var map = {"../errors":1767772065467,"./PDFObject":1767772065485,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065496, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFObject_1 = tslib_1.__importDefault(require("../objects/PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
var PDFOperator = /** @class */ (function () {
    function PDFOperator(name, args) {
        this.name = name;
        this.args = args || [];
    }
    PDFOperator.prototype.clone = function (context) {
        var args = new Array(this.args.length);
        for (var idx = 0, len = args.length; idx < len; idx++) {
            var arg = this.args[idx];
            args[idx] = arg instanceof PDFObject_1.default ? arg.clone(context) : arg;
        }
        return PDFOperator.of(this.name, args);
    };
    PDFOperator.prototype.toString = function () {
        var value = '';
        for (var idx = 0, len = this.args.length; idx < len; idx++) {
            value += String(this.args[idx]) + ' ';
        }
        value += this.name;
        return value;
    };
    PDFOperator.prototype.sizeInBytes = function () {
        var size = 0;
        for (var idx = 0, len = this.args.length; idx < len; idx++) {
            var arg = this.args[idx];
            size += (arg instanceof PDFObject_1.default ? arg.sizeInBytes() : arg.length) + 1;
        }
        size += this.name.length;
        return size;
    };
    PDFOperator.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        for (var idx = 0, len = this.args.length; idx < len; idx++) {
            var arg = this.args[idx];
            if (arg instanceof PDFObject_1.default) {
                offset += arg.copyBytesInto(buffer, offset);
            }
            else {
                offset += utils_1.copyStringIntoBuffer(arg, buffer, offset);
            }
            buffer[offset++] = CharCodes_1.default.Space;
        }
        offset += utils_1.copyStringIntoBuffer(this.name, buffer, offset);
        return offset - initialOffset;
    };
    PDFOperator.of = function (name, args) {
        return new PDFOperator(name, args);
    };
    return PDFOperator;
}());
exports.default = PDFOperator;
//# sourceMappingURL=PDFOperator.js.map
}, function(modId) { var map = {"../objects/PDFObject":1767772065485,"../syntax/CharCodes":1767772065480,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065497, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var PDFOperatorNames;
(function (PDFOperatorNames) {
    // Non Stroking Color Operators
    PDFOperatorNames["NonStrokingColor"] = "sc";
    PDFOperatorNames["NonStrokingColorN"] = "scn";
    PDFOperatorNames["NonStrokingColorRgb"] = "rg";
    PDFOperatorNames["NonStrokingColorGray"] = "g";
    PDFOperatorNames["NonStrokingColorCmyk"] = "k";
    PDFOperatorNames["NonStrokingColorspace"] = "cs";
    // Stroking Color Operators
    PDFOperatorNames["StrokingColor"] = "SC";
    PDFOperatorNames["StrokingColorN"] = "SCN";
    PDFOperatorNames["StrokingColorRgb"] = "RG";
    PDFOperatorNames["StrokingColorGray"] = "G";
    PDFOperatorNames["StrokingColorCmyk"] = "K";
    PDFOperatorNames["StrokingColorspace"] = "CS";
    // Marked Content Operators
    PDFOperatorNames["BeginMarkedContentSequence"] = "BDC";
    PDFOperatorNames["BeginMarkedContent"] = "BMC";
    PDFOperatorNames["EndMarkedContent"] = "EMC";
    PDFOperatorNames["MarkedContentPointWithProps"] = "DP";
    PDFOperatorNames["MarkedContentPoint"] = "MP";
    PDFOperatorNames["DrawObject"] = "Do";
    // Graphics State Operators
    PDFOperatorNames["ConcatTransformationMatrix"] = "cm";
    PDFOperatorNames["PopGraphicsState"] = "Q";
    PDFOperatorNames["PushGraphicsState"] = "q";
    PDFOperatorNames["SetFlatness"] = "i";
    PDFOperatorNames["SetGraphicsStateParams"] = "gs";
    PDFOperatorNames["SetLineCapStyle"] = "J";
    PDFOperatorNames["SetLineDashPattern"] = "d";
    PDFOperatorNames["SetLineJoinStyle"] = "j";
    PDFOperatorNames["SetLineMiterLimit"] = "M";
    PDFOperatorNames["SetLineWidth"] = "w";
    PDFOperatorNames["SetTextMatrix"] = "Tm";
    PDFOperatorNames["SetRenderingIntent"] = "ri";
    // Graphics Operators
    PDFOperatorNames["AppendRectangle"] = "re";
    PDFOperatorNames["BeginInlineImage"] = "BI";
    PDFOperatorNames["BeginInlineImageData"] = "ID";
    PDFOperatorNames["EndInlineImage"] = "EI";
    PDFOperatorNames["ClipEvenOdd"] = "W*";
    PDFOperatorNames["ClipNonZero"] = "W";
    PDFOperatorNames["CloseAndStroke"] = "s";
    PDFOperatorNames["CloseFillEvenOddAndStroke"] = "b*";
    PDFOperatorNames["CloseFillNonZeroAndStroke"] = "b";
    PDFOperatorNames["ClosePath"] = "h";
    PDFOperatorNames["AppendBezierCurve"] = "c";
    PDFOperatorNames["CurveToReplicateFinalPoint"] = "y";
    PDFOperatorNames["CurveToReplicateInitialPoint"] = "v";
    PDFOperatorNames["EndPath"] = "n";
    PDFOperatorNames["FillEvenOddAndStroke"] = "B*";
    PDFOperatorNames["FillEvenOdd"] = "f*";
    PDFOperatorNames["FillNonZeroAndStroke"] = "B";
    PDFOperatorNames["FillNonZero"] = "f";
    PDFOperatorNames["LegacyFillNonZero"] = "F";
    PDFOperatorNames["LineTo"] = "l";
    PDFOperatorNames["MoveTo"] = "m";
    PDFOperatorNames["ShadingFill"] = "sh";
    PDFOperatorNames["StrokePath"] = "S";
    // Text Operators
    PDFOperatorNames["BeginText"] = "BT";
    PDFOperatorNames["EndText"] = "ET";
    PDFOperatorNames["MoveText"] = "Td";
    PDFOperatorNames["MoveTextSetLeading"] = "TD";
    PDFOperatorNames["NextLine"] = "T*";
    PDFOperatorNames["SetCharacterSpacing"] = "Tc";
    PDFOperatorNames["SetFontAndSize"] = "Tf";
    PDFOperatorNames["SetTextHorizontalScaling"] = "Tz";
    PDFOperatorNames["SetTextLineHeight"] = "TL";
    PDFOperatorNames["SetTextRenderingMode"] = "Tr";
    PDFOperatorNames["SetTextRise"] = "Ts";
    PDFOperatorNames["SetWordSpacing"] = "Tw";
    PDFOperatorNames["ShowText"] = "Tj";
    PDFOperatorNames["ShowTextAdjusted"] = "TJ";
    PDFOperatorNames["ShowTextLine"] = "'";
    PDFOperatorNames["ShowTextLineAndSpace"] = "\"";
    // Type3 Font Operators
    PDFOperatorNames["Type3D0"] = "d0";
    PDFOperatorNames["Type3D1"] = "d1";
    // Compatibility Section Operators
    PDFOperatorNames["BeginCompatibilitySection"] = "BX";
    PDFOperatorNames["EndCompatibilitySection"] = "EX";
})(PDFOperatorNames || (PDFOperatorNames = {}));
exports.default = PDFOperatorNames;
//# sourceMappingURL=PDFOperatorNames.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065498, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFFlateStream_1 = tslib_1.__importDefault(require("./PDFFlateStream"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var PDFContentStream = /** @class */ (function (_super) {
    tslib_1.__extends(PDFContentStream, _super);
    function PDFContentStream(dict, operators, encode) {
        if (encode === void 0) { encode = true; }
        var _this = _super.call(this, dict, encode) || this;
        _this.operators = operators;
        return _this;
    }
    PDFContentStream.prototype.push = function () {
        var _a;
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        (_a = this.operators).push.apply(_a, operators);
    };
    PDFContentStream.prototype.clone = function (context) {
        var operators = new Array(this.operators.length);
        for (var idx = 0, len = this.operators.length; idx < len; idx++) {
            operators[idx] = this.operators[idx].clone(context);
        }
        var _a = this, dict = _a.dict, encode = _a.encode;
        return PDFContentStream.of(dict.clone(context), operators, encode);
    };
    PDFContentStream.prototype.getContentsString = function () {
        var value = '';
        for (var idx = 0, len = this.operators.length; idx < len; idx++) {
            value += this.operators[idx] + "\n";
        }
        return value;
    };
    PDFContentStream.prototype.getUnencodedContents = function () {
        var buffer = new Uint8Array(this.getUnencodedContentsSize());
        var offset = 0;
        for (var idx = 0, len = this.operators.length; idx < len; idx++) {
            offset += this.operators[idx].copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes_1.default.Newline;
        }
        return buffer;
    };
    PDFContentStream.prototype.getUnencodedContentsSize = function () {
        var size = 0;
        for (var idx = 0, len = this.operators.length; idx < len; idx++) {
            size += this.operators[idx].sizeInBytes() + 1;
        }
        return size;
    };
    PDFContentStream.of = function (dict, operators, encode) {
        if (encode === void 0) { encode = true; }
        return new PDFContentStream(dict, operators, encode);
    };
    return PDFContentStream;
}(PDFFlateStream_1.default));
exports.default = PDFContentStream;
//# sourceMappingURL=PDFContentStream.js.map
}, function(modId) { var map = {"./PDFFlateStream":1767772065499,"../syntax/CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065499, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var pako_1 = tslib_1.__importDefault(require("pako"));
var errors_1 = require("../errors");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFStream_1 = tslib_1.__importDefault(require("../objects/PDFStream"));
var utils_1 = require("../../utils");
var PDFFlateStream = /** @class */ (function (_super) {
    tslib_1.__extends(PDFFlateStream, _super);
    function PDFFlateStream(dict, encode) {
        var _this = _super.call(this, dict) || this;
        _this.computeContents = function () {
            var unencodedContents = _this.getUnencodedContents();
            return _this.encode ? pako_1.default.deflate(unencodedContents) : unencodedContents;
        };
        _this.encode = encode;
        if (encode)
            dict.set(PDFName_1.default.of('Filter'), PDFName_1.default.of('FlateDecode'));
        _this.contentsCache = utils_1.Cache.populatedBy(_this.computeContents);
        return _this;
    }
    PDFFlateStream.prototype.getContents = function () {
        return this.contentsCache.access();
    };
    PDFFlateStream.prototype.getContentsSize = function () {
        return this.contentsCache.access().length;
    };
    PDFFlateStream.prototype.getUnencodedContents = function () {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'getUnencodedContents');
    };
    return PDFFlateStream;
}(PDFStream_1.default));
exports.default = PDFFlateStream;
//# sourceMappingURL=PDFFlateStream.js.map
}, function(modId) { var map = {"../errors":1767772065467,"../objects/PDFName":1767772065488,"../objects/PDFStream":1767772065494,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065500, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRNG = void 0;
/**
 * Generates a pseudo random number. Although it is not cryptographically secure
 * and uniformly distributed, it is not a concern for the intended use-case,
 * which is to generate distinct numbers.
 *
 * Credit: https://stackoverflow.com/a/19303725/10254049
 */
var SimpleRNG = /** @class */ (function () {
    function SimpleRNG(seed) {
        this.seed = seed;
    }
    SimpleRNG.prototype.nextInt = function () {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    };
    SimpleRNG.withSeed = function (seed) { return new SimpleRNG(seed); };
    return SimpleRNG;
}());
exports.SimpleRNG = SimpleRNG;
//# sourceMappingURL=rng.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065501, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFArray_1 = tslib_1.__importDefault(require("./objects/PDFArray"));
var PDFDict_1 = tslib_1.__importDefault(require("./objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("./objects/PDFName"));
var PDFRef_1 = tslib_1.__importDefault(require("./objects/PDFRef"));
var PDFStream_1 = tslib_1.__importDefault(require("./objects/PDFStream"));
var PDFPageLeaf_1 = tslib_1.__importDefault(require("./structures/PDFPageLeaf"));
/**
 * PDFObjectCopier copies PDFObjects from a src context to a dest context.
 * The primary use case for this is to copy pages between PDFs.
 *
 * _Copying_ an object with a PDFObjectCopier is different from _cloning_ an
 * object with its [[PDFObject.clone]] method:
 *
 * ```
 *   const src: PDFContext = ...
 *   const dest: PDFContext = ...
 *   const originalObject: PDFObject = ...
 *   const copiedObject = PDFObjectCopier.for(src, dest).copy(originalObject);
 *   const clonedObject = originalObject.clone();
 * ```
 *
 * Copying an object is equivalent to cloning it and then copying over any other
 * objects that it references. Note that only dictionaries, arrays, and streams
 * (or structures build from them) can contain indirect references to other
 * objects. Copying a PDFObject that is not a dictionary, array, or stream is
 * supported, but is equivalent to cloning it.
 */
var PDFObjectCopier = /** @class */ (function () {
    function PDFObjectCopier(src, dest) {
        var _this = this;
        this.traversedObjects = new Map();
        // prettier-ignore
        this.copy = function (object) { return (object instanceof PDFPageLeaf_1.default ? _this.copyPDFPage(object)
            : object instanceof PDFDict_1.default ? _this.copyPDFDict(object)
                : object instanceof PDFArray_1.default ? _this.copyPDFArray(object)
                    : object instanceof PDFStream_1.default ? _this.copyPDFStream(object)
                        : object instanceof PDFRef_1.default ? _this.copyPDFIndirectObject(object)
                            : object.clone()); };
        this.copyPDFPage = function (originalPage) {
            var clonedPage = originalPage.clone();
            // Move any entries that the originalPage is inheriting from its parent
            // tree nodes directly into originalPage so they are preserved during
            // the copy.
            var InheritableEntries = PDFPageLeaf_1.default.InheritableEntries;
            for (var idx = 0, len = InheritableEntries.length; idx < len; idx++) {
                var key = PDFName_1.default.of(InheritableEntries[idx]);
                var value = clonedPage.getInheritableAttribute(key);
                if (!clonedPage.get(key) && value)
                    clonedPage.set(key, value);
            }
            // Remove the parent reference to prevent the whole donor document's page
            // tree from being copied when we only need a single page.
            clonedPage.delete(PDFName_1.default.of('Parent'));
            return _this.copyPDFDict(clonedPage);
        };
        this.copyPDFDict = function (originalDict) {
            if (_this.traversedObjects.has(originalDict)) {
                return _this.traversedObjects.get(originalDict);
            }
            var clonedDict = originalDict.clone(_this.dest);
            _this.traversedObjects.set(originalDict, clonedDict);
            var entries = originalDict.entries();
            for (var idx = 0, len = entries.length; idx < len; idx++) {
                var _a = entries[idx], key = _a[0], value = _a[1];
                clonedDict.set(key, _this.copy(value));
            }
            return clonedDict;
        };
        this.copyPDFArray = function (originalArray) {
            if (_this.traversedObjects.has(originalArray)) {
                return _this.traversedObjects.get(originalArray);
            }
            var clonedArray = originalArray.clone(_this.dest);
            _this.traversedObjects.set(originalArray, clonedArray);
            for (var idx = 0, len = originalArray.size(); idx < len; idx++) {
                var value = originalArray.get(idx);
                clonedArray.set(idx, _this.copy(value));
            }
            return clonedArray;
        };
        this.copyPDFStream = function (originalStream) {
            if (_this.traversedObjects.has(originalStream)) {
                return _this.traversedObjects.get(originalStream);
            }
            var clonedStream = originalStream.clone(_this.dest);
            _this.traversedObjects.set(originalStream, clonedStream);
            var entries = originalStream.dict.entries();
            for (var idx = 0, len = entries.length; idx < len; idx++) {
                var _a = entries[idx], key = _a[0], value = _a[1];
                clonedStream.dict.set(key, _this.copy(value));
            }
            return clonedStream;
        };
        this.copyPDFIndirectObject = function (ref) {
            var alreadyMapped = _this.traversedObjects.has(ref);
            if (!alreadyMapped) {
                var newRef = _this.dest.nextRef();
                _this.traversedObjects.set(ref, newRef);
                var dereferencedValue = _this.src.lookup(ref);
                if (dereferencedValue) {
                    var cloned = _this.copy(dereferencedValue);
                    _this.dest.assign(newRef, cloned);
                }
            }
            return _this.traversedObjects.get(ref);
        };
        this.src = src;
        this.dest = dest;
    }
    PDFObjectCopier.for = function (src, dest) {
        return new PDFObjectCopier(src, dest);
    };
    return PDFObjectCopier;
}());
exports.default = PDFObjectCopier;
//# sourceMappingURL=PDFObjectCopier.js.map
}, function(modId) { var map = {"./objects/PDFArray":1767772065483,"./objects/PDFDict":1767772065487,"./objects/PDFName":1767772065488,"./objects/PDFRef":1767772065495,"./objects/PDFStream":1767772065494,"./structures/PDFPageLeaf":1767772065502}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065502, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFStream_1 = tslib_1.__importDefault(require("../objects/PDFStream"));
var PDFPageLeaf = /** @class */ (function (_super) {
    tslib_1.__extends(PDFPageLeaf, _super);
    function PDFPageLeaf(map, context, autoNormalizeCTM) {
        if (autoNormalizeCTM === void 0) { autoNormalizeCTM = true; }
        var _this = _super.call(this, map, context) || this;
        _this.normalized = false;
        _this.autoNormalizeCTM = autoNormalizeCTM;
        return _this;
    }
    PDFPageLeaf.prototype.clone = function (context) {
        var clone = PDFPageLeaf.fromMapWithContext(new Map(), context || this.context, this.autoNormalizeCTM);
        var entries = this.entries();
        for (var idx = 0, len = entries.length; idx < len; idx++) {
            var _a = entries[idx], key = _a[0], value = _a[1];
            clone.set(key, value);
        }
        return clone;
    };
    PDFPageLeaf.prototype.Parent = function () {
        return this.lookupMaybe(PDFName_1.default.Parent, PDFDict_1.default);
    };
    PDFPageLeaf.prototype.Contents = function () {
        return this.lookup(PDFName_1.default.of('Contents'));
    };
    PDFPageLeaf.prototype.Annots = function () {
        return this.lookupMaybe(PDFName_1.default.Annots, PDFArray_1.default);
    };
    PDFPageLeaf.prototype.BleedBox = function () {
        return this.lookupMaybe(PDFName_1.default.BleedBox, PDFArray_1.default);
    };
    PDFPageLeaf.prototype.TrimBox = function () {
        return this.lookupMaybe(PDFName_1.default.TrimBox, PDFArray_1.default);
    };
    PDFPageLeaf.prototype.ArtBox = function () {
        return this.lookupMaybe(PDFName_1.default.ArtBox, PDFArray_1.default);
    };
    PDFPageLeaf.prototype.Resources = function () {
        var dictOrRef = this.getInheritableAttribute(PDFName_1.default.Resources);
        return this.context.lookupMaybe(dictOrRef, PDFDict_1.default);
    };
    PDFPageLeaf.prototype.MediaBox = function () {
        var arrayOrRef = this.getInheritableAttribute(PDFName_1.default.MediaBox);
        return this.context.lookup(arrayOrRef, PDFArray_1.default);
    };
    PDFPageLeaf.prototype.CropBox = function () {
        var arrayOrRef = this.getInheritableAttribute(PDFName_1.default.CropBox);
        return this.context.lookupMaybe(arrayOrRef, PDFArray_1.default);
    };
    PDFPageLeaf.prototype.Rotate = function () {
        var numberOrRef = this.getInheritableAttribute(PDFName_1.default.Rotate);
        return this.context.lookupMaybe(numberOrRef, PDFNumber_1.default);
    };
    PDFPageLeaf.prototype.getInheritableAttribute = function (name) {
        var attribute;
        this.ascend(function (node) {
            if (!attribute)
                attribute = node.get(name);
        });
        return attribute;
    };
    PDFPageLeaf.prototype.setParent = function (parentRef) {
        this.set(PDFName_1.default.Parent, parentRef);
    };
    PDFPageLeaf.prototype.addContentStream = function (contentStreamRef) {
        var Contents = this.normalizedEntries().Contents || this.context.obj([]);
        this.set(PDFName_1.default.Contents, Contents);
        Contents.push(contentStreamRef);
    };
    PDFPageLeaf.prototype.wrapContentStreams = function (startStream, endStream) {
        var Contents = this.Contents();
        if (Contents instanceof PDFArray_1.default) {
            Contents.insert(0, startStream);
            Contents.push(endStream);
            return true;
        }
        return false;
    };
    PDFPageLeaf.prototype.addAnnot = function (annotRef) {
        var Annots = this.normalizedEntries().Annots;
        Annots.push(annotRef);
    };
    PDFPageLeaf.prototype.removeAnnot = function (annotRef) {
        var Annots = this.normalizedEntries().Annots;
        var index = Annots.indexOf(annotRef);
        if (index !== undefined) {
            Annots.remove(index);
        }
    };
    PDFPageLeaf.prototype.setFontDictionary = function (name, fontDictRef) {
        var Font = this.normalizedEntries().Font;
        Font.set(name, fontDictRef);
    };
    PDFPageLeaf.prototype.newFontDictionaryKey = function (tag) {
        var Font = this.normalizedEntries().Font;
        return Font.uniqueKey(tag);
    };
    PDFPageLeaf.prototype.newFontDictionary = function (tag, fontDictRef) {
        var key = this.newFontDictionaryKey(tag);
        this.setFontDictionary(key, fontDictRef);
        return key;
    };
    PDFPageLeaf.prototype.setXObject = function (name, xObjectRef) {
        var XObject = this.normalizedEntries().XObject;
        XObject.set(name, xObjectRef);
    };
    PDFPageLeaf.prototype.newXObjectKey = function (tag) {
        var XObject = this.normalizedEntries().XObject;
        return XObject.uniqueKey(tag);
    };
    PDFPageLeaf.prototype.newXObject = function (tag, xObjectRef) {
        var key = this.newXObjectKey(tag);
        this.setXObject(key, xObjectRef);
        return key;
    };
    PDFPageLeaf.prototype.setExtGState = function (name, extGStateRef) {
        var ExtGState = this.normalizedEntries().ExtGState;
        ExtGState.set(name, extGStateRef);
    };
    PDFPageLeaf.prototype.newExtGStateKey = function (tag) {
        var ExtGState = this.normalizedEntries().ExtGState;
        return ExtGState.uniqueKey(tag);
    };
    PDFPageLeaf.prototype.newExtGState = function (tag, extGStateRef) {
        var key = this.newExtGStateKey(tag);
        this.setExtGState(key, extGStateRef);
        return key;
    };
    PDFPageLeaf.prototype.ascend = function (visitor) {
        visitor(this);
        var Parent = this.Parent();
        if (Parent)
            Parent.ascend(visitor);
    };
    PDFPageLeaf.prototype.normalize = function () {
        if (this.normalized)
            return;
        var context = this.context;
        var contentsRef = this.get(PDFName_1.default.Contents);
        var contents = this.context.lookup(contentsRef);
        if (contents instanceof PDFStream_1.default) {
            this.set(PDFName_1.default.Contents, context.obj([contentsRef]));
        }
        if (this.autoNormalizeCTM) {
            this.wrapContentStreams(this.context.getPushGraphicsStateContentStream(), this.context.getPopGraphicsStateContentStream());
        }
        // TODO: Clone `Resources` if it is inherited
        var dictOrRef = this.getInheritableAttribute(PDFName_1.default.Resources);
        var Resources = context.lookupMaybe(dictOrRef, PDFDict_1.default) || context.obj({});
        this.set(PDFName_1.default.Resources, Resources);
        // TODO: Clone `Font` if it is inherited
        var Font = Resources.lookupMaybe(PDFName_1.default.Font, PDFDict_1.default) || context.obj({});
        Resources.set(PDFName_1.default.Font, Font);
        // TODO: Clone `XObject` if it is inherited
        var XObject = Resources.lookupMaybe(PDFName_1.default.XObject, PDFDict_1.default) || context.obj({});
        Resources.set(PDFName_1.default.XObject, XObject);
        // TODO: Clone `ExtGState` if it is inherited
        var ExtGState = Resources.lookupMaybe(PDFName_1.default.ExtGState, PDFDict_1.default) || context.obj({});
        Resources.set(PDFName_1.default.ExtGState, ExtGState);
        var Annots = this.Annots() || context.obj([]);
        this.set(PDFName_1.default.Annots, Annots);
        this.normalized = true;
    };
    PDFPageLeaf.prototype.normalizedEntries = function () {
        this.normalize();
        var Annots = this.Annots();
        var Resources = this.Resources();
        var Contents = this.Contents();
        return {
            Annots: Annots,
            Resources: Resources,
            Contents: Contents,
            Font: Resources.lookup(PDFName_1.default.Font, PDFDict_1.default),
            XObject: Resources.lookup(PDFName_1.default.XObject, PDFDict_1.default),
            ExtGState: Resources.lookup(PDFName_1.default.ExtGState, PDFDict_1.default),
        };
    };
    PDFPageLeaf.InheritableEntries = [
        'Resources',
        'MediaBox',
        'CropBox',
        'Rotate',
    ];
    PDFPageLeaf.withContextAndParent = function (context, parent) {
        var dict = new Map();
        dict.set(PDFName_1.default.Type, PDFName_1.default.Page);
        dict.set(PDFName_1.default.Parent, parent);
        dict.set(PDFName_1.default.Resources, context.obj({}));
        dict.set(PDFName_1.default.MediaBox, context.obj([0, 0, 612, 792]));
        return new PDFPageLeaf(dict, context, false);
    };
    PDFPageLeaf.fromMapWithContext = function (map, context, autoNormalizeCTM) {
        if (autoNormalizeCTM === void 0) { autoNormalizeCTM = true; }
        return new PDFPageLeaf(map, context, autoNormalizeCTM);
    };
    return PDFPageLeaf;
}(PDFDict_1.default));
exports.default = PDFPageLeaf;
//# sourceMappingURL=PDFPageLeaf.js.map
}, function(modId) { var map = {"../objects/PDFArray":1767772065483,"../objects/PDFDict":1767772065487,"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"../objects/PDFStream":1767772065494}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065503, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFCrossRefSection_1 = tslib_1.__importDefault(require("../document/PDFCrossRefSection"));
var PDFHeader_1 = tslib_1.__importDefault(require("../document/PDFHeader"));
var PDFTrailer_1 = tslib_1.__importDefault(require("../document/PDFTrailer"));
var PDFTrailerDict_1 = tslib_1.__importDefault(require("../document/PDFTrailerDict"));
var PDFObjectStream_1 = tslib_1.__importDefault(require("../structures/PDFObjectStream"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
var PDFWriter = /** @class */ (function () {
    function PDFWriter(context, objectsPerTick) {
        var _this = this;
        this.parsedObjects = 0;
        this.shouldWaitForTick = function (n) {
            _this.parsedObjects += n;
            return _this.parsedObjects % _this.objectsPerTick === 0;
        };
        this.context = context;
        this.objectsPerTick = objectsPerTick;
    }
    PDFWriter.prototype.serializeToBuffer = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, size, header, indirectObjects, xref, trailerDict, trailer, offset, buffer, idx, len, _b, ref, object, objectNumber, generationNumber, n;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.computeBufferSize()];
                    case 1:
                        _a = _c.sent(), size = _a.size, header = _a.header, indirectObjects = _a.indirectObjects, xref = _a.xref, trailerDict = _a.trailerDict, trailer = _a.trailer;
                        offset = 0;
                        buffer = new Uint8Array(size);
                        offset += header.copyBytesInto(buffer, offset);
                        buffer[offset++] = CharCodes_1.default.Newline;
                        buffer[offset++] = CharCodes_1.default.Newline;
                        idx = 0, len = indirectObjects.length;
                        _c.label = 2;
                    case 2:
                        if (!(idx < len)) return [3 /*break*/, 5];
                        _b = indirectObjects[idx], ref = _b[0], object = _b[1];
                        objectNumber = String(ref.objectNumber);
                        offset += utils_1.copyStringIntoBuffer(objectNumber, buffer, offset);
                        buffer[offset++] = CharCodes_1.default.Space;
                        generationNumber = String(ref.generationNumber);
                        offset += utils_1.copyStringIntoBuffer(generationNumber, buffer, offset);
                        buffer[offset++] = CharCodes_1.default.Space;
                        buffer[offset++] = CharCodes_1.default.o;
                        buffer[offset++] = CharCodes_1.default.b;
                        buffer[offset++] = CharCodes_1.default.j;
                        buffer[offset++] = CharCodes_1.default.Newline;
                        offset += object.copyBytesInto(buffer, offset);
                        buffer[offset++] = CharCodes_1.default.Newline;
                        buffer[offset++] = CharCodes_1.default.e;
                        buffer[offset++] = CharCodes_1.default.n;
                        buffer[offset++] = CharCodes_1.default.d;
                        buffer[offset++] = CharCodes_1.default.o;
                        buffer[offset++] = CharCodes_1.default.b;
                        buffer[offset++] = CharCodes_1.default.j;
                        buffer[offset++] = CharCodes_1.default.Newline;
                        buffer[offset++] = CharCodes_1.default.Newline;
                        n = object instanceof PDFObjectStream_1.default ? object.getObjectsCount() : 1;
                        if (!this.shouldWaitForTick(n)) return [3 /*break*/, 4];
                        return [4 /*yield*/, utils_1.waitForTick()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        idx++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (xref) {
                            offset += xref.copyBytesInto(buffer, offset);
                            buffer[offset++] = CharCodes_1.default.Newline;
                        }
                        if (trailerDict) {
                            offset += trailerDict.copyBytesInto(buffer, offset);
                            buffer[offset++] = CharCodes_1.default.Newline;
                            buffer[offset++] = CharCodes_1.default.Newline;
                        }
                        offset += trailer.copyBytesInto(buffer, offset);
                        return [2 /*return*/, buffer];
                }
            });
        });
    };
    PDFWriter.prototype.computeIndirectObjectSize = function (_a) {
        var ref = _a[0], object = _a[1];
        var refSize = ref.sizeInBytes() + 3; // 'R' -> 'obj\n'
        var objectSize = object.sizeInBytes() + 9; // '\nendobj\n\n'
        return refSize + objectSize;
    };
    PDFWriter.prototype.createTrailerDict = function () {
        return this.context.obj({
            Size: this.context.largestObjectNumber + 1,
            Root: this.context.trailerInfo.Root,
            Encrypt: this.context.trailerInfo.Encrypt,
            Info: this.context.trailerInfo.Info,
            ID: this.context.trailerInfo.ID,
        });
    };
    PDFWriter.prototype.computeBufferSize = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var header, size, xref, indirectObjects, idx, len, indirectObject, ref, xrefOffset, trailerDict, trailer;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        header = PDFHeader_1.default.forVersion(1, 7);
                        size = header.sizeInBytes() + 2;
                        xref = PDFCrossRefSection_1.default.create();
                        indirectObjects = this.context.enumerateIndirectObjects();
                        idx = 0, len = indirectObjects.length;
                        _a.label = 1;
                    case 1:
                        if (!(idx < len)) return [3 /*break*/, 4];
                        indirectObject = indirectObjects[idx];
                        ref = indirectObject[0];
                        xref.addEntry(ref, size);
                        size += this.computeIndirectObjectSize(indirectObject);
                        if (!this.shouldWaitForTick(1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, utils_1.waitForTick()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        idx++;
                        return [3 /*break*/, 1];
                    case 4:
                        xrefOffset = size;
                        size += xref.sizeInBytes() + 1; // '\n'
                        trailerDict = PDFTrailerDict_1.default.of(this.createTrailerDict());
                        size += trailerDict.sizeInBytes() + 2; // '\n\n'
                        trailer = PDFTrailer_1.default.forLastCrossRefSectionOffset(xrefOffset);
                        size += trailer.sizeInBytes();
                        return [2 /*return*/, { size: size, header: header, indirectObjects: indirectObjects, xref: xref, trailerDict: trailerDict, trailer: trailer }];
                }
            });
        });
    };
    PDFWriter.forContext = function (context, objectsPerTick) {
        return new PDFWriter(context, objectsPerTick);
    };
    return PDFWriter;
}());
exports.default = PDFWriter;
//# sourceMappingURL=PDFWriter.js.map
}, function(modId) { var map = {"../document/PDFCrossRefSection":1767772065504,"../document/PDFHeader":1767772065482,"../document/PDFTrailer":1767772065505,"../document/PDFTrailerDict":1767772065506,"../structures/PDFObjectStream":1767772065507,"../syntax/CharCodes":1767772065480,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065504, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
/**
 * Entries should be added using the [[addEntry]] and [[addDeletedEntry]]
 * methods **in order of ascending object number**.
 */
var PDFCrossRefSection = /** @class */ (function () {
    function PDFCrossRefSection(firstEntry) {
        this.subsections = firstEntry ? [[firstEntry]] : [];
        this.chunkIdx = 0;
        this.chunkLength = firstEntry ? 1 : 0;
    }
    PDFCrossRefSection.prototype.addEntry = function (ref, offset) {
        this.append({ ref: ref, offset: offset, deleted: false });
    };
    PDFCrossRefSection.prototype.addDeletedEntry = function (ref, nextFreeObjectNumber) {
        this.append({ ref: ref, offset: nextFreeObjectNumber, deleted: true });
    };
    PDFCrossRefSection.prototype.toString = function () {
        var section = "xref\n";
        for (var rangeIdx = 0, rangeLen = this.subsections.length; rangeIdx < rangeLen; rangeIdx++) {
            var range = this.subsections[rangeIdx];
            section += range[0].ref.objectNumber + " " + range.length + "\n";
            for (var entryIdx = 0, entryLen = range.length; entryIdx < entryLen; entryIdx++) {
                var entry = range[entryIdx];
                section += utils_1.padStart(String(entry.offset), 10, '0');
                section += ' ';
                section += utils_1.padStart(String(entry.ref.generationNumber), 5, '0');
                section += ' ';
                section += entry.deleted ? 'f' : 'n';
                section += ' \n';
            }
        }
        return section;
    };
    PDFCrossRefSection.prototype.sizeInBytes = function () {
        var size = 5;
        for (var idx = 0, len = this.subsections.length; idx < len; idx++) {
            var subsection = this.subsections[idx];
            var subsectionLength = subsection.length;
            var firstEntry = subsection[0];
            size += 2;
            size += String(firstEntry.ref.objectNumber).length;
            size += String(subsectionLength).length;
            size += 20 * subsectionLength;
        }
        return size;
    };
    PDFCrossRefSection.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes_1.default.x;
        buffer[offset++] = CharCodes_1.default.r;
        buffer[offset++] = CharCodes_1.default.e;
        buffer[offset++] = CharCodes_1.default.f;
        buffer[offset++] = CharCodes_1.default.Newline;
        offset += this.copySubsectionsIntoBuffer(this.subsections, buffer, offset);
        return offset - initialOffset;
    };
    PDFCrossRefSection.prototype.copySubsectionsIntoBuffer = function (subsections, buffer, offset) {
        var initialOffset = offset;
        var length = subsections.length;
        for (var idx = 0; idx < length; idx++) {
            var subsection = this.subsections[idx];
            var firstObjectNumber = String(subsection[0].ref.objectNumber);
            offset += utils_1.copyStringIntoBuffer(firstObjectNumber, buffer, offset);
            buffer[offset++] = CharCodes_1.default.Space;
            var rangeLength = String(subsection.length);
            offset += utils_1.copyStringIntoBuffer(rangeLength, buffer, offset);
            buffer[offset++] = CharCodes_1.default.Newline;
            offset += this.copyEntriesIntoBuffer(subsection, buffer, offset);
        }
        return offset - initialOffset;
    };
    PDFCrossRefSection.prototype.copyEntriesIntoBuffer = function (entries, buffer, offset) {
        var length = entries.length;
        for (var idx = 0; idx < length; idx++) {
            var entry = entries[idx];
            var entryOffset = utils_1.padStart(String(entry.offset), 10, '0');
            offset += utils_1.copyStringIntoBuffer(entryOffset, buffer, offset);
            buffer[offset++] = CharCodes_1.default.Space;
            var entryGen = utils_1.padStart(String(entry.ref.generationNumber), 5, '0');
            offset += utils_1.copyStringIntoBuffer(entryGen, buffer, offset);
            buffer[offset++] = CharCodes_1.default.Space;
            buffer[offset++] = entry.deleted ? CharCodes_1.default.f : CharCodes_1.default.n;
            buffer[offset++] = CharCodes_1.default.Space;
            buffer[offset++] = CharCodes_1.default.Newline;
        }
        return 20 * length;
    };
    PDFCrossRefSection.prototype.append = function (currEntry) {
        if (this.chunkLength === 0) {
            this.subsections.push([currEntry]);
            this.chunkIdx = 0;
            this.chunkLength = 1;
            return;
        }
        var chunk = this.subsections[this.chunkIdx];
        var prevEntry = chunk[this.chunkLength - 1];
        if (currEntry.ref.objectNumber - prevEntry.ref.objectNumber > 1) {
            this.subsections.push([currEntry]);
            this.chunkIdx += 1;
            this.chunkLength = 1;
        }
        else {
            chunk.push(currEntry);
            this.chunkLength += 1;
        }
    };
    PDFCrossRefSection.create = function () {
        return new PDFCrossRefSection({
            ref: PDFRef_1.default.of(0, 65535),
            offset: 0,
            deleted: true,
        });
    };
    PDFCrossRefSection.createEmpty = function () { return new PDFCrossRefSection(); };
    return PDFCrossRefSection;
}());
exports.default = PDFCrossRefSection;
//# sourceMappingURL=PDFCrossRefSection.js.map
}, function(modId) { var map = {"../objects/PDFRef":1767772065495,"../syntax/CharCodes":1767772065480,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065505, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
var PDFTrailer = /** @class */ (function () {
    function PDFTrailer(lastXRefOffset) {
        this.lastXRefOffset = String(lastXRefOffset);
    }
    PDFTrailer.prototype.toString = function () {
        return "startxref\n" + this.lastXRefOffset + "\n%%EOF";
    };
    PDFTrailer.prototype.sizeInBytes = function () {
        return 16 + this.lastXRefOffset.length;
    };
    PDFTrailer.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes_1.default.s;
        buffer[offset++] = CharCodes_1.default.t;
        buffer[offset++] = CharCodes_1.default.a;
        buffer[offset++] = CharCodes_1.default.r;
        buffer[offset++] = CharCodes_1.default.t;
        buffer[offset++] = CharCodes_1.default.x;
        buffer[offset++] = CharCodes_1.default.r;
        buffer[offset++] = CharCodes_1.default.e;
        buffer[offset++] = CharCodes_1.default.f;
        buffer[offset++] = CharCodes_1.default.Newline;
        offset += utils_1.copyStringIntoBuffer(this.lastXRefOffset, buffer, offset);
        buffer[offset++] = CharCodes_1.default.Newline;
        buffer[offset++] = CharCodes_1.default.Percent;
        buffer[offset++] = CharCodes_1.default.Percent;
        buffer[offset++] = CharCodes_1.default.E;
        buffer[offset++] = CharCodes_1.default.O;
        buffer[offset++] = CharCodes_1.default.F;
        return offset - initialOffset;
    };
    PDFTrailer.forLastCrossRefSectionOffset = function (offset) {
        return new PDFTrailer(offset);
    };
    return PDFTrailer;
}());
exports.default = PDFTrailer;
//# sourceMappingURL=PDFTrailer.js.map
}, function(modId) { var map = {"../syntax/CharCodes":1767772065480,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065506, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var PDFTrailerDict = /** @class */ (function () {
    function PDFTrailerDict(dict) {
        this.dict = dict;
    }
    PDFTrailerDict.prototype.toString = function () {
        return "trailer\n" + this.dict.toString();
    };
    PDFTrailerDict.prototype.sizeInBytes = function () {
        return 8 + this.dict.sizeInBytes();
    };
    PDFTrailerDict.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes_1.default.t;
        buffer[offset++] = CharCodes_1.default.r;
        buffer[offset++] = CharCodes_1.default.a;
        buffer[offset++] = CharCodes_1.default.i;
        buffer[offset++] = CharCodes_1.default.l;
        buffer[offset++] = CharCodes_1.default.e;
        buffer[offset++] = CharCodes_1.default.r;
        buffer[offset++] = CharCodes_1.default.Newline;
        offset += this.dict.copyBytesInto(buffer, offset);
        return offset - initialOffset;
    };
    PDFTrailerDict.of = function (dict) { return new PDFTrailerDict(dict); };
    return PDFTrailerDict;
}());
exports.default = PDFTrailerDict;
//# sourceMappingURL=PDFTrailerDict.js.map
}, function(modId) { var map = {"../syntax/CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065507, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFFlateStream_1 = tslib_1.__importDefault(require("./PDFFlateStream"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
var PDFObjectStream = /** @class */ (function (_super) {
    tslib_1.__extends(PDFObjectStream, _super);
    function PDFObjectStream(context, objects, encode) {
        if (encode === void 0) { encode = true; }
        var _this = _super.call(this, context.obj({}), encode) || this;
        _this.objects = objects;
        _this.offsets = _this.computeObjectOffsets();
        _this.offsetsString = _this.computeOffsetsString();
        _this.dict.set(PDFName_1.default.of('Type'), PDFName_1.default.of('ObjStm'));
        _this.dict.set(PDFName_1.default.of('N'), PDFNumber_1.default.of(_this.objects.length));
        _this.dict.set(PDFName_1.default.of('First'), PDFNumber_1.default.of(_this.offsetsString.length));
        return _this;
    }
    PDFObjectStream.prototype.getObjectsCount = function () {
        return this.objects.length;
    };
    PDFObjectStream.prototype.clone = function (context) {
        return PDFObjectStream.withContextAndObjects(context || this.dict.context, this.objects.slice(), this.encode);
    };
    PDFObjectStream.prototype.getContentsString = function () {
        var value = this.offsetsString;
        for (var idx = 0, len = this.objects.length; idx < len; idx++) {
            var _a = this.objects[idx], object = _a[1];
            value += object + "\n";
        }
        return value;
    };
    PDFObjectStream.prototype.getUnencodedContents = function () {
        var buffer = new Uint8Array(this.getUnencodedContentsSize());
        var offset = utils_1.copyStringIntoBuffer(this.offsetsString, buffer, 0);
        for (var idx = 0, len = this.objects.length; idx < len; idx++) {
            var _a = this.objects[idx], object = _a[1];
            offset += object.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes_1.default.Newline;
        }
        return buffer;
    };
    PDFObjectStream.prototype.getUnencodedContentsSize = function () {
        return (this.offsetsString.length +
            utils_1.last(this.offsets)[1] +
            utils_1.last(this.objects)[1].sizeInBytes() +
            1);
    };
    PDFObjectStream.prototype.computeOffsetsString = function () {
        var offsetsString = '';
        for (var idx = 0, len = this.offsets.length; idx < len; idx++) {
            var _a = this.offsets[idx], objectNumber = _a[0], offset = _a[1];
            offsetsString += objectNumber + " " + offset + " ";
        }
        return offsetsString;
    };
    PDFObjectStream.prototype.computeObjectOffsets = function () {
        var offset = 0;
        var offsets = new Array(this.objects.length);
        for (var idx = 0, len = this.objects.length; idx < len; idx++) {
            var _a = this.objects[idx], ref = _a[0], object = _a[1];
            offsets[idx] = [ref.objectNumber, offset];
            offset += object.sizeInBytes() + 1; // '\n'
        }
        return offsets;
    };
    PDFObjectStream.withContextAndObjects = function (context, objects, encode) {
        if (encode === void 0) { encode = true; }
        return new PDFObjectStream(context, objects, encode);
    };
    return PDFObjectStream;
}(PDFFlateStream_1.default));
exports.default = PDFObjectStream;
//# sourceMappingURL=PDFObjectStream.js.map
}, function(modId) { var map = {"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"./PDFFlateStream":1767772065499,"../syntax/CharCodes":1767772065480,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065508, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFHeader_1 = tslib_1.__importDefault(require("../document/PDFHeader"));
var PDFTrailer_1 = tslib_1.__importDefault(require("../document/PDFTrailer"));
var PDFInvalidObject_1 = tslib_1.__importDefault(require("../objects/PDFInvalidObject"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var PDFStream_1 = tslib_1.__importDefault(require("../objects/PDFStream"));
var PDFCrossRefStream_1 = tslib_1.__importDefault(require("../structures/PDFCrossRefStream"));
var PDFObjectStream_1 = tslib_1.__importDefault(require("../structures/PDFObjectStream"));
var PDFWriter_1 = tslib_1.__importDefault(require("./PDFWriter"));
var utils_1 = require("../../utils");
var PDFStreamWriter = /** @class */ (function (_super) {
    tslib_1.__extends(PDFStreamWriter, _super);
    function PDFStreamWriter(context, objectsPerTick, encodeStreams, objectsPerStream) {
        var _this = _super.call(this, context, objectsPerTick) || this;
        _this.encodeStreams = encodeStreams;
        _this.objectsPerStream = objectsPerStream;
        return _this;
    }
    PDFStreamWriter.prototype.computeBufferSize = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var objectNumber, header, size, xrefStream, uncompressedObjects, compressedObjects, objectStreamRefs, indirectObjects, idx, len, indirectObject, ref, object, shouldNotCompress, chunk, objectStreamRef, idx, len, chunk, ref, objectStream, xrefStreamRef, xrefOffset, trailer;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        objectNumber = this.context.largestObjectNumber + 1;
                        header = PDFHeader_1.default.forVersion(1, 7);
                        size = header.sizeInBytes() + 2;
                        xrefStream = PDFCrossRefStream_1.default.create(this.createTrailerDict(), this.encodeStreams);
                        uncompressedObjects = [];
                        compressedObjects = [];
                        objectStreamRefs = [];
                        indirectObjects = this.context.enumerateIndirectObjects();
                        idx = 0, len = indirectObjects.length;
                        _a.label = 1;
                    case 1:
                        if (!(idx < len)) return [3 /*break*/, 6];
                        indirectObject = indirectObjects[idx];
                        ref = indirectObject[0], object = indirectObject[1];
                        shouldNotCompress = ref === this.context.trailerInfo.Encrypt ||
                            object instanceof PDFStream_1.default ||
                            object instanceof PDFInvalidObject_1.default ||
                            ref.generationNumber !== 0;
                        if (!shouldNotCompress) return [3 /*break*/, 4];
                        uncompressedObjects.push(indirectObject);
                        xrefStream.addUncompressedEntry(ref, size);
                        size += this.computeIndirectObjectSize(indirectObject);
                        if (!this.shouldWaitForTick(1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, utils_1.waitForTick()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        chunk = utils_1.last(compressedObjects);
                        objectStreamRef = utils_1.last(objectStreamRefs);
                        if (!chunk || chunk.length % this.objectsPerStream === 0) {
                            chunk = [];
                            compressedObjects.push(chunk);
                            objectStreamRef = PDFRef_1.default.of(objectNumber++);
                            objectStreamRefs.push(objectStreamRef);
                        }
                        xrefStream.addCompressedEntry(ref, objectStreamRef, chunk.length);
                        chunk.push(indirectObject);
                        _a.label = 5;
                    case 5:
                        idx++;
                        return [3 /*break*/, 1];
                    case 6:
                        idx = 0, len = compressedObjects.length;
                        _a.label = 7;
                    case 7:
                        if (!(idx < len)) return [3 /*break*/, 10];
                        chunk = compressedObjects[idx];
                        ref = objectStreamRefs[idx];
                        objectStream = PDFObjectStream_1.default.withContextAndObjects(this.context, chunk, this.encodeStreams);
                        xrefStream.addUncompressedEntry(ref, size);
                        size += this.computeIndirectObjectSize([ref, objectStream]);
                        uncompressedObjects.push([ref, objectStream]);
                        if (!this.shouldWaitForTick(chunk.length)) return [3 /*break*/, 9];
                        return [4 /*yield*/, utils_1.waitForTick()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        idx++;
                        return [3 /*break*/, 7];
                    case 10:
                        xrefStreamRef = PDFRef_1.default.of(objectNumber++);
                        xrefStream.dict.set(PDFName_1.default.of('Size'), PDFNumber_1.default.of(objectNumber));
                        xrefStream.addUncompressedEntry(xrefStreamRef, size);
                        xrefOffset = size;
                        size += this.computeIndirectObjectSize([xrefStreamRef, xrefStream]);
                        uncompressedObjects.push([xrefStreamRef, xrefStream]);
                        trailer = PDFTrailer_1.default.forLastCrossRefSectionOffset(xrefOffset);
                        size += trailer.sizeInBytes();
                        return [2 /*return*/, { size: size, header: header, indirectObjects: uncompressedObjects, trailer: trailer }];
                }
            });
        });
    };
    PDFStreamWriter.forContext = function (context, objectsPerTick, encodeStreams, objectsPerStream) {
        if (encodeStreams === void 0) { encodeStreams = true; }
        if (objectsPerStream === void 0) { objectsPerStream = 50; }
        return new PDFStreamWriter(context, objectsPerTick, encodeStreams, objectsPerStream);
    };
    return PDFStreamWriter;
}(PDFWriter_1.default));
exports.default = PDFStreamWriter;
//# sourceMappingURL=PDFStreamWriter.js.map
}, function(modId) { var map = {"../document/PDFHeader":1767772065482,"../document/PDFTrailer":1767772065505,"../objects/PDFInvalidObject":1767772065509,"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"../objects/PDFRef":1767772065495,"../objects/PDFStream":1767772065494,"../structures/PDFCrossRefStream":1767772065510,"../structures/PDFObjectStream":1767772065507,"./PDFWriter":1767772065503,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065509, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var PDFInvalidObject = /** @class */ (function (_super) {
    tslib_1.__extends(PDFInvalidObject, _super);
    function PDFInvalidObject(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
    }
    PDFInvalidObject.prototype.clone = function () {
        return PDFInvalidObject.of(this.data.slice());
    };
    PDFInvalidObject.prototype.toString = function () {
        return "PDFInvalidObject(" + this.data.length + " bytes)";
    };
    PDFInvalidObject.prototype.sizeInBytes = function () {
        return this.data.length;
    };
    PDFInvalidObject.prototype.copyBytesInto = function (buffer, offset) {
        var length = this.data.length;
        for (var idx = 0; idx < length; idx++) {
            buffer[offset++] = this.data[idx];
        }
        return length;
    };
    PDFInvalidObject.of = function (data) { return new PDFInvalidObject(data); };
    return PDFInvalidObject;
}(PDFObject_1.default));
exports.default = PDFInvalidObject;
//# sourceMappingURL=PDFInvalidObject.js.map
}, function(modId) { var map = {"./PDFObject":1767772065485}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065510, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryType = void 0;
var tslib_1 = require("tslib");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var PDFFlateStream_1 = tslib_1.__importDefault(require("./PDFFlateStream"));
var utils_1 = require("../../utils");
var EntryType;
(function (EntryType) {
    EntryType[EntryType["Deleted"] = 0] = "Deleted";
    EntryType[EntryType["Uncompressed"] = 1] = "Uncompressed";
    EntryType[EntryType["Compressed"] = 2] = "Compressed";
})(EntryType = exports.EntryType || (exports.EntryType = {}));
/**
 * Entries should be added using the [[addDeletedEntry]],
 * [[addUncompressedEntry]], and [[addCompressedEntry]] methods
 * **in order of ascending object number**.
 */
var PDFCrossRefStream = /** @class */ (function (_super) {
    tslib_1.__extends(PDFCrossRefStream, _super);
    function PDFCrossRefStream(dict, entries, encode) {
        if (encode === void 0) { encode = true; }
        var _this = _super.call(this, dict, encode) || this;
        // Returns an array of integer pairs for each subsection of the cross ref
        // section, where each integer pair represents:
        //   firstObjectNumber(OfSection), length(OfSection)
        _this.computeIndex = function () {
            var subsections = [];
            var subsectionLength = 0;
            for (var idx = 0, len = _this.entries.length; idx < len; idx++) {
                var currEntry = _this.entries[idx];
                var prevEntry = _this.entries[idx - 1];
                if (idx === 0) {
                    subsections.push(currEntry.ref.objectNumber);
                }
                else if (currEntry.ref.objectNumber - prevEntry.ref.objectNumber > 1) {
                    subsections.push(subsectionLength);
                    subsections.push(currEntry.ref.objectNumber);
                    subsectionLength = 0;
                }
                subsectionLength += 1;
            }
            subsections.push(subsectionLength);
            return subsections;
        };
        _this.computeEntryTuples = function () {
            var entryTuples = new Array(_this.entries.length);
            for (var idx = 0, len = _this.entries.length; idx < len; idx++) {
                var entry = _this.entries[idx];
                if (entry.type === EntryType.Deleted) {
                    var type = entry.type, nextFreeObjectNumber = entry.nextFreeObjectNumber, ref = entry.ref;
                    entryTuples[idx] = [type, nextFreeObjectNumber, ref.generationNumber];
                }
                if (entry.type === EntryType.Uncompressed) {
                    var type = entry.type, offset = entry.offset, ref = entry.ref;
                    entryTuples[idx] = [type, offset, ref.generationNumber];
                }
                if (entry.type === EntryType.Compressed) {
                    var type = entry.type, objectStreamRef = entry.objectStreamRef, index = entry.index;
                    entryTuples[idx] = [type, objectStreamRef.objectNumber, index];
                }
            }
            return entryTuples;
        };
        _this.computeMaxEntryByteWidths = function () {
            var entryTuples = _this.entryTuplesCache.access();
            var widths = [0, 0, 0];
            for (var idx = 0, len = entryTuples.length; idx < len; idx++) {
                var _a = entryTuples[idx], first = _a[0], second = _a[1], third = _a[2];
                var firstSize = utils_1.sizeInBytes(first);
                var secondSize = utils_1.sizeInBytes(second);
                var thirdSize = utils_1.sizeInBytes(third);
                if (firstSize > widths[0])
                    widths[0] = firstSize;
                if (secondSize > widths[1])
                    widths[1] = secondSize;
                if (thirdSize > widths[2])
                    widths[2] = thirdSize;
            }
            return widths;
        };
        _this.entries = entries || [];
        _this.entryTuplesCache = utils_1.Cache.populatedBy(_this.computeEntryTuples);
        _this.maxByteWidthsCache = utils_1.Cache.populatedBy(_this.computeMaxEntryByteWidths);
        _this.indexCache = utils_1.Cache.populatedBy(_this.computeIndex);
        dict.set(PDFName_1.default.of('Type'), PDFName_1.default.of('XRef'));
        return _this;
    }
    PDFCrossRefStream.prototype.addDeletedEntry = function (ref, nextFreeObjectNumber) {
        var type = EntryType.Deleted;
        this.entries.push({ type: type, ref: ref, nextFreeObjectNumber: nextFreeObjectNumber });
        this.entryTuplesCache.invalidate();
        this.maxByteWidthsCache.invalidate();
        this.indexCache.invalidate();
        this.contentsCache.invalidate();
    };
    PDFCrossRefStream.prototype.addUncompressedEntry = function (ref, offset) {
        var type = EntryType.Uncompressed;
        this.entries.push({ type: type, ref: ref, offset: offset });
        this.entryTuplesCache.invalidate();
        this.maxByteWidthsCache.invalidate();
        this.indexCache.invalidate();
        this.contentsCache.invalidate();
    };
    PDFCrossRefStream.prototype.addCompressedEntry = function (ref, objectStreamRef, index) {
        var type = EntryType.Compressed;
        this.entries.push({ type: type, ref: ref, objectStreamRef: objectStreamRef, index: index });
        this.entryTuplesCache.invalidate();
        this.maxByteWidthsCache.invalidate();
        this.indexCache.invalidate();
        this.contentsCache.invalidate();
    };
    PDFCrossRefStream.prototype.clone = function (context) {
        var _a = this, dict = _a.dict, entries = _a.entries, encode = _a.encode;
        return PDFCrossRefStream.of(dict.clone(context), entries.slice(), encode);
    };
    PDFCrossRefStream.prototype.getContentsString = function () {
        var entryTuples = this.entryTuplesCache.access();
        var byteWidths = this.maxByteWidthsCache.access();
        var value = '';
        for (var entryIdx = 0, entriesLen = entryTuples.length; entryIdx < entriesLen; entryIdx++) {
            var _a = entryTuples[entryIdx], first = _a[0], second = _a[1], third = _a[2];
            var firstBytes = utils_1.reverseArray(utils_1.bytesFor(first));
            var secondBytes = utils_1.reverseArray(utils_1.bytesFor(second));
            var thirdBytes = utils_1.reverseArray(utils_1.bytesFor(third));
            for (var idx = byteWidths[0] - 1; idx >= 0; idx--) {
                value += (firstBytes[idx] || 0).toString(2);
            }
            for (var idx = byteWidths[1] - 1; idx >= 0; idx--) {
                value += (secondBytes[idx] || 0).toString(2);
            }
            for (var idx = byteWidths[2] - 1; idx >= 0; idx--) {
                value += (thirdBytes[idx] || 0).toString(2);
            }
        }
        return value;
    };
    PDFCrossRefStream.prototype.getUnencodedContents = function () {
        var entryTuples = this.entryTuplesCache.access();
        var byteWidths = this.maxByteWidthsCache.access();
        var buffer = new Uint8Array(this.getUnencodedContentsSize());
        var offset = 0;
        for (var entryIdx = 0, entriesLen = entryTuples.length; entryIdx < entriesLen; entryIdx++) {
            var _a = entryTuples[entryIdx], first = _a[0], second = _a[1], third = _a[2];
            var firstBytes = utils_1.reverseArray(utils_1.bytesFor(first));
            var secondBytes = utils_1.reverseArray(utils_1.bytesFor(second));
            var thirdBytes = utils_1.reverseArray(utils_1.bytesFor(third));
            for (var idx = byteWidths[0] - 1; idx >= 0; idx--) {
                buffer[offset++] = firstBytes[idx] || 0;
            }
            for (var idx = byteWidths[1] - 1; idx >= 0; idx--) {
                buffer[offset++] = secondBytes[idx] || 0;
            }
            for (var idx = byteWidths[2] - 1; idx >= 0; idx--) {
                buffer[offset++] = thirdBytes[idx] || 0;
            }
        }
        return buffer;
    };
    PDFCrossRefStream.prototype.getUnencodedContentsSize = function () {
        var byteWidths = this.maxByteWidthsCache.access();
        var entryWidth = utils_1.sum(byteWidths);
        return entryWidth * this.entries.length;
    };
    PDFCrossRefStream.prototype.updateDict = function () {
        _super.prototype.updateDict.call(this);
        var byteWidths = this.maxByteWidthsCache.access();
        var index = this.indexCache.access();
        var context = this.dict.context;
        this.dict.set(PDFName_1.default.of('W'), context.obj(byteWidths));
        this.dict.set(PDFName_1.default.of('Index'), context.obj(index));
    };
    PDFCrossRefStream.create = function (dict, encode) {
        if (encode === void 0) { encode = true; }
        var stream = new PDFCrossRefStream(dict, [], encode);
        stream.addDeletedEntry(PDFRef_1.default.of(0, 65535), 0);
        return stream;
    };
    PDFCrossRefStream.of = function (dict, entries, encode) {
        if (encode === void 0) { encode = true; }
        return new PDFCrossRefStream(dict, entries, encode);
    };
    return PDFCrossRefStream;
}(PDFFlateStream_1.default));
exports.default = PDFCrossRefStream;
//# sourceMappingURL=PDFCrossRefStream.js.map
}, function(modId) { var map = {"../objects/PDFName":1767772065488,"../objects/PDFRef":1767772065495,"./PDFFlateStream":1767772065499,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065511, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var standard_fonts_1 = require("@pdf-lib/standard-fonts");
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var utils_1 = require("../../utils");
/**
 * A note of thanks to the developers of https://github.com/foliojs/pdfkit, as
 * this class borrows from:
 *   https://github.com/foliojs/pdfkit/blob/f91bdd61c164a72ea06be1a43dc0a412afc3925f/lib/font/afm.coffee
 */
var StandardFontEmbedder = /** @class */ (function () {
    function StandardFontEmbedder(fontName, customName) {
        // prettier-ignore
        this.encoding = (fontName === standard_fonts_1.FontNames.ZapfDingbats ? standard_fonts_1.Encodings.ZapfDingbats
            : fontName === standard_fonts_1.FontNames.Symbol ? standard_fonts_1.Encodings.Symbol
                : standard_fonts_1.Encodings.WinAnsi);
        this.font = standard_fonts_1.Font.load(fontName);
        this.fontName = this.font.FontName;
        this.customName = customName;
    }
    /**
     * Encode the JavaScript string into this font. (JavaScript encodes strings in
     * Unicode, but standard fonts use either WinAnsi, ZapfDingbats, or Symbol
     * encodings)
     */
    StandardFontEmbedder.prototype.encodeText = function (text) {
        var glyphs = this.encodeTextAsGlyphs(text);
        var hexCodes = new Array(glyphs.length);
        for (var idx = 0, len = glyphs.length; idx < len; idx++) {
            hexCodes[idx] = utils_1.toHexString(glyphs[idx].code);
        }
        return PDFHexString_1.default.of(hexCodes.join(''));
    };
    StandardFontEmbedder.prototype.widthOfTextAtSize = function (text, size) {
        var glyphs = this.encodeTextAsGlyphs(text);
        var totalWidth = 0;
        for (var idx = 0, len = glyphs.length; idx < len; idx++) {
            var left = glyphs[idx].name;
            var right = (glyphs[idx + 1] || {}).name;
            var kernAmount = this.font.getXAxisKerningForPair(left, right) || 0;
            totalWidth += this.widthOfGlyph(left) + kernAmount;
        }
        var scale = size / 1000;
        return totalWidth * scale;
    };
    StandardFontEmbedder.prototype.heightOfFontAtSize = function (size, options) {
        if (options === void 0) { options = {}; }
        var _a = options.descender, descender = _a === void 0 ? true : _a;
        var _b = this.font, Ascender = _b.Ascender, Descender = _b.Descender, FontBBox = _b.FontBBox;
        var yTop = Ascender || FontBBox[3];
        var yBottom = Descender || FontBBox[1];
        var height = yTop - yBottom;
        if (!descender)
            height += Descender || 0;
        return (height / 1000) * size;
    };
    StandardFontEmbedder.prototype.sizeOfFontAtHeight = function (height) {
        var _a = this.font, Ascender = _a.Ascender, Descender = _a.Descender, FontBBox = _a.FontBBox;
        var yTop = Ascender || FontBBox[3];
        var yBottom = Descender || FontBBox[1];
        return (1000 * height) / (yTop - yBottom);
    };
    StandardFontEmbedder.prototype.embedIntoContext = function (context, ref) {
        var fontDict = context.obj({
            Type: 'Font',
            Subtype: 'Type1',
            BaseFont: this.customName || this.fontName,
            Encoding: this.encoding === standard_fonts_1.Encodings.WinAnsi ? 'WinAnsiEncoding' : undefined,
        });
        if (ref) {
            context.assign(ref, fontDict);
            return ref;
        }
        else {
            return context.register(fontDict);
        }
    };
    StandardFontEmbedder.prototype.widthOfGlyph = function (glyphName) {
        // Default to 250 if font doesn't specify a width
        return this.font.getWidthOfGlyph(glyphName) || 250;
    };
    StandardFontEmbedder.prototype.encodeTextAsGlyphs = function (text) {
        var codePoints = Array.from(text);
        var glyphs = new Array(codePoints.length);
        for (var idx = 0, len = codePoints.length; idx < len; idx++) {
            var codePoint = utils_1.toCodePoint(codePoints[idx]);
            glyphs[idx] = this.encoding.encodeUnicodeCodePoint(codePoint);
        }
        return glyphs;
    };
    StandardFontEmbedder.for = function (fontName, customName) {
        return new StandardFontEmbedder(fontName, customName);
    };
    return StandardFontEmbedder;
}());
exports.default = StandardFontEmbedder;
//# sourceMappingURL=StandardFontEmbedder.js.map
}, function(modId) { var map = {"../objects/PDFHexString":1767772065512,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065512, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
var errors_1 = require("../errors");
var PDFHexString = /** @class */ (function (_super) {
    tslib_1.__extends(PDFHexString, _super);
    function PDFHexString(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    PDFHexString.prototype.asBytes = function () {
        // Append a zero if the number of digits is odd. See PDF spec 7.3.4.3
        var hex = this.value + (this.value.length % 2 === 1 ? '0' : '');
        var hexLength = hex.length;
        var bytes = new Uint8Array(hex.length / 2);
        var hexOffset = 0;
        var bytesOffset = 0;
        // Interpret each pair of hex digits as a single byte
        while (hexOffset < hexLength) {
            var byte = parseInt(hex.substring(hexOffset, hexOffset + 2), 16);
            bytes[bytesOffset] = byte;
            hexOffset += 2;
            bytesOffset += 1;
        }
        return bytes;
    };
    PDFHexString.prototype.decodeText = function () {
        var bytes = this.asBytes();
        if (utils_1.hasUtf16BOM(bytes))
            return utils_1.utf16Decode(bytes);
        return utils_1.pdfDocEncodingDecode(bytes);
    };
    PDFHexString.prototype.decodeDate = function () {
        var text = this.decodeText();
        var date = utils_1.parseDate(text);
        if (!date)
            throw new errors_1.InvalidPDFDateStringError(text);
        return date;
    };
    PDFHexString.prototype.asString = function () {
        return this.value;
    };
    PDFHexString.prototype.clone = function () {
        return PDFHexString.of(this.value);
    };
    PDFHexString.prototype.toString = function () {
        return "<" + this.value + ">";
    };
    PDFHexString.prototype.sizeInBytes = function () {
        return this.value.length + 2;
    };
    PDFHexString.prototype.copyBytesInto = function (buffer, offset) {
        buffer[offset++] = CharCodes_1.default.LessThan;
        offset += utils_1.copyStringIntoBuffer(this.value, buffer, offset);
        buffer[offset++] = CharCodes_1.default.GreaterThan;
        return this.value.length + 2;
    };
    PDFHexString.of = function (value) { return new PDFHexString(value); };
    PDFHexString.fromText = function (value) {
        var encoded = utils_1.utf16Encode(value);
        var hex = '';
        for (var idx = 0, len = encoded.length; idx < len; idx++) {
            hex += utils_1.toHexStringOfMinLength(encoded[idx], 4);
        }
        return new PDFHexString(hex);
    };
    return PDFHexString;
}(PDFObject_1.default));
exports.default = PDFHexString;
//# sourceMappingURL=PDFHexString.js.map
}, function(modId) { var map = {"./PDFObject":1767772065485,"../syntax/CharCodes":1767772065480,"../../utils":1767772065468,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065513, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CMap_1 = require("./CMap");
var FontFlags_1 = require("./FontFlags");
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var utils_1 = require("../../utils");
/**
 * A note of thanks to the developers of https://github.com/foliojs/pdfkit, as
 * this class borrows from:
 *   https://github.com/devongovett/pdfkit/blob/e71edab0dd4657b5a767804ba86c94c58d01fbca/lib/image/jpeg.coffee
 */
var CustomFontEmbedder = /** @class */ (function () {
    function CustomFontEmbedder(font, fontData, customName, fontFeatures) {
        var _this = this;
        this.allGlyphsInFontSortedById = function () {
            var glyphs = new Array(_this.font.characterSet.length);
            for (var idx = 0, len = glyphs.length; idx < len; idx++) {
                var codePoint = _this.font.characterSet[idx];
                glyphs[idx] = _this.font.glyphForCodePoint(codePoint);
            }
            return utils_1.sortedUniq(glyphs.sort(utils_1.byAscendingId), function (g) { return g.id; });
        };
        this.font = font;
        this.scale = 1000 / this.font.unitsPerEm;
        this.fontData = fontData;
        this.fontName = this.font.postscriptName || 'Font';
        this.customName = customName;
        this.fontFeatures = fontFeatures;
        this.baseFontName = '';
        this.glyphCache = utils_1.Cache.populatedBy(this.allGlyphsInFontSortedById);
    }
    CustomFontEmbedder.for = function (fontkit, fontData, customName, fontFeatures) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var font;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fontkit.create(fontData)];
                    case 1:
                        font = _a.sent();
                        return [2 /*return*/, new CustomFontEmbedder(font, fontData, customName, fontFeatures)];
                }
            });
        });
    };
    /**
     * Encode the JavaScript string into this font. (JavaScript encodes strings in
     * Unicode, but embedded fonts use their own custom encodings)
     */
    CustomFontEmbedder.prototype.encodeText = function (text) {
        var glyphs = this.font.layout(text, this.fontFeatures).glyphs;
        var hexCodes = new Array(glyphs.length);
        for (var idx = 0, len = glyphs.length; idx < len; idx++) {
            hexCodes[idx] = utils_1.toHexStringOfMinLength(glyphs[idx].id, 4);
        }
        return PDFHexString_1.default.of(hexCodes.join(''));
    };
    // The advanceWidth takes into account kerning automatically, so we don't
    // have to do that manually like we do for the standard fonts.
    CustomFontEmbedder.prototype.widthOfTextAtSize = function (text, size) {
        var glyphs = this.font.layout(text, this.fontFeatures).glyphs;
        var totalWidth = 0;
        for (var idx = 0, len = glyphs.length; idx < len; idx++) {
            totalWidth += glyphs[idx].advanceWidth * this.scale;
        }
        var scale = size / 1000;
        return totalWidth * scale;
    };
    CustomFontEmbedder.prototype.heightOfFontAtSize = function (size, options) {
        if (options === void 0) { options = {}; }
        var _a = options.descender, descender = _a === void 0 ? true : _a;
        var _b = this.font, ascent = _b.ascent, descent = _b.descent, bbox = _b.bbox;
        var yTop = (ascent || bbox.maxY) * this.scale;
        var yBottom = (descent || bbox.minY) * this.scale;
        var height = yTop - yBottom;
        if (!descender)
            height -= Math.abs(descent) || 0;
        return (height / 1000) * size;
    };
    CustomFontEmbedder.prototype.sizeOfFontAtHeight = function (height) {
        var _a = this.font, ascent = _a.ascent, descent = _a.descent, bbox = _a.bbox;
        var yTop = (ascent || bbox.maxY) * this.scale;
        var yBottom = (descent || bbox.minY) * this.scale;
        return (1000 * height) / (yTop - yBottom);
    };
    CustomFontEmbedder.prototype.embedIntoContext = function (context, ref) {
        this.baseFontName =
            this.customName || context.addRandomSuffix(this.fontName);
        return this.embedFontDict(context, ref);
    };
    CustomFontEmbedder.prototype.embedFontDict = function (context, ref) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cidFontDictRef, unicodeCMapRef, fontDict;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.embedCIDFontDict(context)];
                    case 1:
                        cidFontDictRef = _a.sent();
                        unicodeCMapRef = this.embedUnicodeCmap(context);
                        fontDict = context.obj({
                            Type: 'Font',
                            Subtype: 'Type0',
                            BaseFont: this.baseFontName,
                            Encoding: 'Identity-H',
                            DescendantFonts: [cidFontDictRef],
                            ToUnicode: unicodeCMapRef,
                        });
                        if (ref) {
                            context.assign(ref, fontDict);
                            return [2 /*return*/, ref];
                        }
                        else {
                            return [2 /*return*/, context.register(fontDict)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomFontEmbedder.prototype.isCFF = function () {
        return this.font.cff;
    };
    CustomFontEmbedder.prototype.embedCIDFontDict = function (context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fontDescriptorRef, cidFontDict;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.embedFontDescriptor(context)];
                    case 1:
                        fontDescriptorRef = _a.sent();
                        cidFontDict = context.obj({
                            Type: 'Font',
                            Subtype: this.isCFF() ? 'CIDFontType0' : 'CIDFontType2',
                            CIDToGIDMap: 'Identity',
                            BaseFont: this.baseFontName,
                            CIDSystemInfo: {
                                Registry: PDFString_1.default.of('Adobe'),
                                Ordering: PDFString_1.default.of('Identity'),
                                Supplement: 0,
                            },
                            FontDescriptor: fontDescriptorRef,
                            W: this.computeWidths(),
                        });
                        return [2 /*return*/, context.register(cidFontDict)];
                }
            });
        });
    };
    CustomFontEmbedder.prototype.embedFontDescriptor = function (context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fontStreamRef, scale, _a, italicAngle, ascent, descent, capHeight, xHeight, _b, minX, minY, maxX, maxY, fontDescriptor;
            var _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.embedFontStream(context)];
                    case 1:
                        fontStreamRef = _d.sent();
                        scale = this.scale;
                        _a = this.font, italicAngle = _a.italicAngle, ascent = _a.ascent, descent = _a.descent, capHeight = _a.capHeight, xHeight = _a.xHeight;
                        _b = this.font.bbox, minX = _b.minX, minY = _b.minY, maxX = _b.maxX, maxY = _b.maxY;
                        fontDescriptor = context.obj((_c = {
                                Type: 'FontDescriptor',
                                FontName: this.baseFontName,
                                Flags: FontFlags_1.deriveFontFlags(this.font),
                                FontBBox: [minX * scale, minY * scale, maxX * scale, maxY * scale],
                                ItalicAngle: italicAngle,
                                Ascent: ascent * scale,
                                Descent: descent * scale,
                                CapHeight: (capHeight || ascent) * scale,
                                XHeight: (xHeight || 0) * scale,
                                // Not sure how to compute/find this, nor is anybody else really:
                                // https://stackoverflow.com/questions/35485179/stemv-value-of-the-truetype-font
                                StemV: 0
                            },
                            _c[this.isCFF() ? 'FontFile3' : 'FontFile2'] = fontStreamRef,
                            _c));
                        return [2 /*return*/, context.register(fontDescriptor)];
                }
            });
        });
    };
    CustomFontEmbedder.prototype.serializeFont = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.fontData];
            });
        });
    };
    CustomFontEmbedder.prototype.embedFontStream = function (context) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fontStream, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = context).flateStream;
                        return [4 /*yield*/, this.serializeFont()];
                    case 1:
                        fontStream = _b.apply(_a, [_c.sent(), {
                                Subtype: this.isCFF() ? 'CIDFontType0C' : undefined,
                            }]);
                        return [2 /*return*/, context.register(fontStream)];
                }
            });
        });
    };
    CustomFontEmbedder.prototype.embedUnicodeCmap = function (context) {
        var cmap = CMap_1.createCmap(this.glyphCache.access(), this.glyphId.bind(this));
        var cmapStream = context.flateStream(cmap);
        return context.register(cmapStream);
    };
    CustomFontEmbedder.prototype.glyphId = function (glyph) {
        return glyph ? glyph.id : -1;
    };
    CustomFontEmbedder.prototype.computeWidths = function () {
        var glyphs = this.glyphCache.access();
        var widths = [];
        var currSection = [];
        for (var idx = 0, len = glyphs.length; idx < len; idx++) {
            var currGlyph = glyphs[idx];
            var prevGlyph = glyphs[idx - 1];
            var currGlyphId = this.glyphId(currGlyph);
            var prevGlyphId = this.glyphId(prevGlyph);
            if (idx === 0) {
                widths.push(currGlyphId);
            }
            else if (currGlyphId - prevGlyphId !== 1) {
                widths.push(currSection);
                widths.push(currGlyphId);
                currSection = [];
            }
            currSection.push(currGlyph.advanceWidth * this.scale);
        }
        widths.push(currSection);
        return widths;
    };
    return CustomFontEmbedder;
}());
exports.default = CustomFontEmbedder;
//# sourceMappingURL=CustomFontEmbedder.js.map
}, function(modId) { var map = {"./CMap":1767772065514,"./FontFlags":1767772065515,"../objects/PDFHexString":1767772065512,"../objects/PDFString":1767772065516,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065514, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.createCmap = void 0;
var utils_1 = require("../../utils");
var unicode_1 = require("../../utils/unicode");
/** `glyphs` should be an array of unique glyphs */
exports.createCmap = function (glyphs, glyphId) {
    var bfChars = new Array(glyphs.length);
    for (var idx = 0, len = glyphs.length; idx < len; idx++) {
        var glyph = glyphs[idx];
        var id = cmapHexFormat(cmapHexString(glyphId(glyph)));
        var unicode = cmapHexFormat.apply(void 0, glyph.codePoints.map(cmapCodePointFormat));
        bfChars[idx] = [id, unicode];
    }
    return fillCmapTemplate(bfChars);
};
/* =============================== Templates ================================ */
var fillCmapTemplate = function (bfChars) { return "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange\n" + bfChars.length + " beginbfchar\n" + bfChars.map(function (_a) {
    var glyphId = _a[0], codePoint = _a[1];
    return glyphId + " " + codePoint;
}).join('\n') + "\nendbfchar\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend"; };
/* =============================== Utilities ================================ */
var cmapHexFormat = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return "<" + values.join('') + ">";
};
var cmapHexString = function (value) { return utils_1.toHexStringOfMinLength(value, 4); };
var cmapCodePointFormat = function (codePoint) {
    if (unicode_1.isWithinBMP(codePoint))
        return cmapHexString(codePoint);
    if (unicode_1.hasSurrogates(codePoint)) {
        var hs = unicode_1.highSurrogate(codePoint);
        var ls = unicode_1.lowSurrogate(codePoint);
        return "" + cmapHexString(hs) + cmapHexString(ls);
    }
    var hex = utils_1.toHexString(codePoint);
    var msg = "0x" + hex + " is not a valid UTF-8 or UTF-16 codepoint.";
    throw new Error(msg);
};
//# sourceMappingURL=CMap.js.map
}, function(modId) { var map = {"../../utils":1767772065468,"../../utils/unicode":1767772065473}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065515, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveFontFlags = void 0;
// prettier-ignore
var makeFontFlags = function (options) {
    var flags = 0;
    var flipBit = function (bit) { flags |= (1 << (bit - 1)); };
    if (options.fixedPitch)
        flipBit(1);
    if (options.serif)
        flipBit(2);
    if (options.symbolic)
        flipBit(3);
    if (options.script)
        flipBit(4);
    if (options.nonsymbolic)
        flipBit(6);
    if (options.italic)
        flipBit(7);
    if (options.allCap)
        flipBit(17);
    if (options.smallCap)
        flipBit(18);
    if (options.forceBold)
        flipBit(19);
    return flags;
};
// From: https://github.com/foliojs/pdfkit/blob/83f5f7243172a017adcf6a7faa5547c55982c57b/lib/font/embedded.js#L123-L129
exports.deriveFontFlags = function (font) {
    var familyClass = font['OS/2'] ? font['OS/2'].sFamilyClass : 0;
    var flags = makeFontFlags({
        fixedPitch: font.post.isFixedPitch,
        serif: 1 <= familyClass && familyClass <= 7,
        symbolic: true,
        script: familyClass === 10,
        italic: font.head.macStyle.italic,
    });
    return flags;
};
//# sourceMappingURL=FontFlags.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065516, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFObject_1 = tslib_1.__importDefault(require("./PDFObject"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
var errors_1 = require("../errors");
var PDFString = /** @class */ (function (_super) {
    tslib_1.__extends(PDFString, _super);
    function PDFString(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    PDFString.prototype.asBytes = function () {
        var bytes = [];
        var octal = '';
        var escaped = false;
        var pushByte = function (byte) {
            if (byte !== undefined)
                bytes.push(byte);
            escaped = false;
        };
        for (var idx = 0, len = this.value.length; idx < len; idx++) {
            var char = this.value[idx];
            var byte = utils_1.toCharCode(char);
            var nextChar = this.value[idx + 1];
            if (!escaped) {
                if (byte === CharCodes_1.default.BackSlash)
                    escaped = true;
                else
                    pushByte(byte);
            }
            else {
                if (byte === CharCodes_1.default.Newline)
                    pushByte();
                else if (byte === CharCodes_1.default.CarriageReturn)
                    pushByte();
                else if (byte === CharCodes_1.default.n)
                    pushByte(CharCodes_1.default.Newline);
                else if (byte === CharCodes_1.default.r)
                    pushByte(CharCodes_1.default.CarriageReturn);
                else if (byte === CharCodes_1.default.t)
                    pushByte(CharCodes_1.default.Tab);
                else if (byte === CharCodes_1.default.b)
                    pushByte(CharCodes_1.default.Backspace);
                else if (byte === CharCodes_1.default.f)
                    pushByte(CharCodes_1.default.FormFeed);
                else if (byte === CharCodes_1.default.LeftParen)
                    pushByte(CharCodes_1.default.LeftParen);
                else if (byte === CharCodes_1.default.RightParen)
                    pushByte(CharCodes_1.default.RightParen);
                else if (byte === CharCodes_1.default.Backspace)
                    pushByte(CharCodes_1.default.BackSlash);
                else if (byte >= CharCodes_1.default.Zero && byte <= CharCodes_1.default.Seven) {
                    octal += char;
                    if (octal.length === 3 || !(nextChar >= '0' && nextChar <= '7')) {
                        pushByte(parseInt(octal, 8));
                        octal = '';
                    }
                }
                else {
                    pushByte(byte);
                }
            }
        }
        return new Uint8Array(bytes);
    };
    PDFString.prototype.decodeText = function () {
        var bytes = this.asBytes();
        if (utils_1.hasUtf16BOM(bytes))
            return utils_1.utf16Decode(bytes);
        return utils_1.pdfDocEncodingDecode(bytes);
    };
    PDFString.prototype.decodeDate = function () {
        var text = this.decodeText();
        var date = utils_1.parseDate(text);
        if (!date)
            throw new errors_1.InvalidPDFDateStringError(text);
        return date;
    };
    PDFString.prototype.asString = function () {
        return this.value;
    };
    PDFString.prototype.clone = function () {
        return PDFString.of(this.value);
    };
    PDFString.prototype.toString = function () {
        return "(" + this.value + ")";
    };
    PDFString.prototype.sizeInBytes = function () {
        return this.value.length + 2;
    };
    PDFString.prototype.copyBytesInto = function (buffer, offset) {
        buffer[offset++] = CharCodes_1.default.LeftParen;
        offset += utils_1.copyStringIntoBuffer(this.value, buffer, offset);
        buffer[offset++] = CharCodes_1.default.RightParen;
        return this.value.length + 2;
    };
    // The PDF spec allows newlines and parens to appear directly within a literal
    // string. These character _may_ be escaped. But they do not _have_ to be. So
    // for simplicity, we will not bother escaping them.
    PDFString.of = function (value) { return new PDFString(value); };
    PDFString.fromDate = function (date) {
        var year = utils_1.padStart(String(date.getUTCFullYear()), 4, '0');
        var month = utils_1.padStart(String(date.getUTCMonth() + 1), 2, '0');
        var day = utils_1.padStart(String(date.getUTCDate()), 2, '0');
        var hours = utils_1.padStart(String(date.getUTCHours()), 2, '0');
        var mins = utils_1.padStart(String(date.getUTCMinutes()), 2, '0');
        var secs = utils_1.padStart(String(date.getUTCSeconds()), 2, '0');
        return new PDFString("D:" + year + month + day + hours + mins + secs + "Z");
    };
    return PDFString;
}(PDFObject_1.default));
exports.default = PDFString;
//# sourceMappingURL=PDFString.js.map
}, function(modId) { var map = {"./PDFObject":1767772065485,"../syntax/CharCodes":1767772065480,"../../utils":1767772065468,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065517, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CustomFontEmbedder_1 = tslib_1.__importDefault(require("./CustomFontEmbedder"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var utils_1 = require("../../utils");
/**
 * A note of thanks to the developers of https://github.com/foliojs/pdfkit, as
 * this class borrows from:
 *   https://github.com/devongovett/pdfkit/blob/e71edab0dd4657b5a767804ba86c94c58d01fbca/lib/image/jpeg.coffee
 */
var CustomFontSubsetEmbedder = /** @class */ (function (_super) {
    tslib_1.__extends(CustomFontSubsetEmbedder, _super);
    function CustomFontSubsetEmbedder(font, fontData, customFontName, fontFeatures) {
        var _this = _super.call(this, font, fontData, customFontName, fontFeatures) || this;
        _this.subset = _this.font.createSubset();
        _this.glyphs = [];
        _this.glyphCache = utils_1.Cache.populatedBy(function () { return _this.glyphs; });
        _this.glyphIdMap = new Map();
        return _this;
    }
    CustomFontSubsetEmbedder.for = function (fontkit, fontData, customFontName, fontFeatures) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var font;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fontkit.create(fontData)];
                    case 1:
                        font = _a.sent();
                        return [2 /*return*/, new CustomFontSubsetEmbedder(font, fontData, customFontName, fontFeatures)];
                }
            });
        });
    };
    CustomFontSubsetEmbedder.prototype.encodeText = function (text) {
        var glyphs = this.font.layout(text, this.fontFeatures).glyphs;
        var hexCodes = new Array(glyphs.length);
        for (var idx = 0, len = glyphs.length; idx < len; idx++) {
            var glyph = glyphs[idx];
            var subsetGlyphId = this.subset.includeGlyph(glyph);
            this.glyphs[subsetGlyphId - 1] = glyph;
            this.glyphIdMap.set(glyph.id, subsetGlyphId);
            hexCodes[idx] = utils_1.toHexStringOfMinLength(subsetGlyphId, 4);
        }
        this.glyphCache.invalidate();
        return PDFHexString_1.default.of(hexCodes.join(''));
    };
    CustomFontSubsetEmbedder.prototype.isCFF = function () {
        return this.subset.cff;
    };
    CustomFontSubsetEmbedder.prototype.glyphId = function (glyph) {
        return glyph ? this.glyphIdMap.get(glyph.id) : -1;
    };
    CustomFontSubsetEmbedder.prototype.serializeFont = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var parts = [];
            _this.subset
                .encodeStream()
                .on('data', function (bytes) { return parts.push(bytes); })
                .on('end', function () { return resolve(utils_1.mergeUint8Arrays(parts)); })
                .on('error', function (err) { return reject(err); });
        });
    };
    return CustomFontSubsetEmbedder;
}(CustomFontEmbedder_1.default));
exports.default = CustomFontSubsetEmbedder;
//# sourceMappingURL=CustomFontSubsetEmbedder.js.map
}, function(modId) { var map = {"./CustomFontEmbedder":1767772065513,"../objects/PDFHexString":1767772065512,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065518, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.AFRelationship = void 0;
var tslib_1 = require("tslib");
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
/**
 * From the PDF-A3 specification, section **3.1. Requirements - General**.
 * See:
 * * https://www.pdfa.org/wp-content/uploads/2018/10/PDF20_AN002-AF.pdf
 */
var AFRelationship;
(function (AFRelationship) {
    AFRelationship["Source"] = "Source";
    AFRelationship["Data"] = "Data";
    AFRelationship["Alternative"] = "Alternative";
    AFRelationship["Supplement"] = "Supplement";
    AFRelationship["EncryptedPayload"] = "EncryptedPayload";
    AFRelationship["FormData"] = "EncryptedPayload";
    AFRelationship["Schema"] = "Schema";
    AFRelationship["Unspecified"] = "Unspecified";
})(AFRelationship = exports.AFRelationship || (exports.AFRelationship = {}));
var FileEmbedder = /** @class */ (function () {
    function FileEmbedder(fileData, fileName, options) {
        if (options === void 0) { options = {}; }
        this.fileData = fileData;
        this.fileName = fileName;
        this.options = options;
    }
    FileEmbedder.for = function (bytes, fileName, options) {
        if (options === void 0) { options = {}; }
        return new FileEmbedder(bytes, fileName, options);
    };
    FileEmbedder.prototype.embedIntoContext = function (context, ref) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, mimeType, description, creationDate, modificationDate, afRelationship, embeddedFileStream, embeddedFileStreamRef, fileSpecDict;
            return tslib_1.__generator(this, function (_b) {
                _a = this.options, mimeType = _a.mimeType, description = _a.description, creationDate = _a.creationDate, modificationDate = _a.modificationDate, afRelationship = _a.afRelationship;
                embeddedFileStream = context.flateStream(this.fileData, {
                    Type: 'EmbeddedFile',
                    Subtype: mimeType !== null && mimeType !== void 0 ? mimeType : undefined,
                    Params: {
                        Size: this.fileData.length,
                        CreationDate: creationDate
                            ? PDFString_1.default.fromDate(creationDate)
                            : undefined,
                        ModDate: modificationDate
                            ? PDFString_1.default.fromDate(modificationDate)
                            : undefined,
                    },
                });
                embeddedFileStreamRef = context.register(embeddedFileStream);
                fileSpecDict = context.obj({
                    Type: 'Filespec',
                    F: PDFString_1.default.of(this.fileName),
                    UF: PDFHexString_1.default.fromText(this.fileName),
                    EF: { F: embeddedFileStreamRef },
                    Desc: description ? PDFHexString_1.default.fromText(description) : undefined,
                    AFRelationship: afRelationship !== null && afRelationship !== void 0 ? afRelationship : undefined,
                });
                if (ref) {
                    context.assign(ref, fileSpecDict);
                    return [2 /*return*/, ref];
                }
                else {
                    return [2 /*return*/, context.register(fileSpecDict)];
                }
                return [2 /*return*/];
            });
        });
    };
    return FileEmbedder;
}());
exports.default = FileEmbedder;
//# sourceMappingURL=FileEmbedder.js.map
}, function(modId) { var map = {"../objects/PDFString":1767772065516,"../objects/PDFHexString":1767772065512}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065519, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// prettier-ignore
var MARKERS = [
    0xffc0, 0xffc1, 0xffc2,
    0xffc3, 0xffc5, 0xffc6,
    0xffc7, 0xffc8, 0xffc9,
    0xffca, 0xffcb, 0xffcc,
    0xffcd, 0xffce, 0xffcf,
];
var ColorSpace;
(function (ColorSpace) {
    ColorSpace["DeviceGray"] = "DeviceGray";
    ColorSpace["DeviceRGB"] = "DeviceRGB";
    ColorSpace["DeviceCMYK"] = "DeviceCMYK";
})(ColorSpace || (ColorSpace = {}));
var ChannelToColorSpace = {
    1: ColorSpace.DeviceGray,
    3: ColorSpace.DeviceRGB,
    4: ColorSpace.DeviceCMYK,
};
/**
 * A note of thanks to the developers of https://github.com/foliojs/pdfkit, as
 * this class borrows from:
 *   https://github.com/foliojs/pdfkit/blob/a6af76467ce06bd6a2af4aa7271ccac9ff152a7d/lib/image/jpeg.js
 */
var JpegEmbedder = /** @class */ (function () {
    function JpegEmbedder(imageData, bitsPerComponent, width, height, colorSpace) {
        this.imageData = imageData;
        this.bitsPerComponent = bitsPerComponent;
        this.width = width;
        this.height = height;
        this.colorSpace = colorSpace;
    }
    JpegEmbedder.for = function (imageData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var dataView, soi, pos, marker, bitsPerComponent, height, width, channelByte, channelName, colorSpace;
            return tslib_1.__generator(this, function (_a) {
                dataView = new DataView(imageData.buffer);
                soi = dataView.getUint16(0);
                if (soi !== 0xffd8)
                    throw new Error('SOI not found in JPEG');
                pos = 2;
                while (pos < dataView.byteLength) {
                    marker = dataView.getUint16(pos);
                    pos += 2;
                    if (MARKERS.includes(marker))
                        break;
                    pos += dataView.getUint16(pos);
                }
                if (!MARKERS.includes(marker))
                    throw new Error('Invalid JPEG');
                pos += 2;
                bitsPerComponent = dataView.getUint8(pos++);
                height = dataView.getUint16(pos);
                pos += 2;
                width = dataView.getUint16(pos);
                pos += 2;
                channelByte = dataView.getUint8(pos++);
                channelName = ChannelToColorSpace[channelByte];
                if (!channelName)
                    throw new Error('Unknown JPEG channel.');
                colorSpace = channelName;
                return [2 /*return*/, new JpegEmbedder(imageData, bitsPerComponent, width, height, colorSpace)];
            });
        });
    };
    JpegEmbedder.prototype.embedIntoContext = function (context, ref) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var xObject;
            return tslib_1.__generator(this, function (_a) {
                xObject = context.stream(this.imageData, {
                    Type: 'XObject',
                    Subtype: 'Image',
                    BitsPerComponent: this.bitsPerComponent,
                    Width: this.width,
                    Height: this.height,
                    ColorSpace: this.colorSpace,
                    Filter: 'DCTDecode',
                    // CMYK JPEG streams in PDF are typically stored complemented,
                    // with 1 as 'off' and 0 as 'on' (PDF 32000-1:2008, 8.6.4.4).
                    //
                    // Standalone CMYK JPEG (usually exported by Photoshop) are
                    // stored inverse, with 0 as 'off' and 1 as 'on', like RGB.
                    //
                    // Applying a swap here as a hedge that most bytes passing
                    // through this method will benefit from it.
                    Decode: this.colorSpace === ColorSpace.DeviceCMYK
                        ? [1, 0, 1, 0, 1, 0, 1, 0]
                        : undefined,
                });
                if (ref) {
                    context.assign(ref, xObject);
                    return [2 /*return*/, ref];
                }
                else {
                    return [2 /*return*/, context.register(xObject)];
                }
                return [2 /*return*/];
            });
        });
    };
    return JpegEmbedder;
}());
exports.default = JpegEmbedder;
//# sourceMappingURL=JpegEmbedder.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065520, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var png_1 = require("../../utils/png");
/**
 * A note of thanks to the developers of https://github.com/foliojs/pdfkit, as
 * this class borrows from:
 *   https://github.com/devongovett/pdfkit/blob/e71edab0dd4657b5a767804ba86c94c58d01fbca/lib/image/png.coffee
 */
var PngEmbedder = /** @class */ (function () {
    function PngEmbedder(png) {
        this.image = png;
        this.bitsPerComponent = png.bitsPerComponent;
        this.width = png.width;
        this.height = png.height;
        this.colorSpace = 'DeviceRGB';
    }
    PngEmbedder.for = function (imageData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var png;
            return tslib_1.__generator(this, function (_a) {
                png = png_1.PNG.load(imageData);
                return [2 /*return*/, new PngEmbedder(png)];
            });
        });
    };
    PngEmbedder.prototype.embedIntoContext = function (context, ref) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var SMask, xObject;
            return tslib_1.__generator(this, function (_a) {
                SMask = this.embedAlphaChannel(context);
                xObject = context.flateStream(this.image.rgbChannel, {
                    Type: 'XObject',
                    Subtype: 'Image',
                    BitsPerComponent: this.image.bitsPerComponent,
                    Width: this.image.width,
                    Height: this.image.height,
                    ColorSpace: this.colorSpace,
                    SMask: SMask,
                });
                if (ref) {
                    context.assign(ref, xObject);
                    return [2 /*return*/, ref];
                }
                else {
                    return [2 /*return*/, context.register(xObject)];
                }
                return [2 /*return*/];
            });
        });
    };
    PngEmbedder.prototype.embedAlphaChannel = function (context) {
        if (!this.image.alphaChannel)
            return undefined;
        var xObject = context.flateStream(this.image.alphaChannel, {
            Type: 'XObject',
            Subtype: 'Image',
            Height: this.image.height,
            Width: this.image.width,
            BitsPerComponent: this.image.bitsPerComponent,
            ColorSpace: 'DeviceGray',
            Decode: [0, 1],
        });
        return context.register(xObject);
    };
    return PngEmbedder;
}());
exports.default = PngEmbedder;
//# sourceMappingURL=PngEmbedder.js.map
}, function(modId) { var map = {"../../utils/png":1767772065521}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065521, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.PNG = exports.PngType = void 0;
var tslib_1 = require("tslib");
var upng_1 = tslib_1.__importDefault(require("@pdf-lib/upng"));
var getImageType = function (ctype) {
    if (ctype === 0)
        return PngType.Greyscale;
    if (ctype === 2)
        return PngType.Truecolour;
    if (ctype === 3)
        return PngType.IndexedColour;
    if (ctype === 4)
        return PngType.GreyscaleWithAlpha;
    if (ctype === 6)
        return PngType.TruecolourWithAlpha;
    throw new Error("Unknown color type: " + ctype);
};
var splitAlphaChannel = function (rgbaChannel) {
    var pixelCount = Math.floor(rgbaChannel.length / 4);
    var rgbChannel = new Uint8Array(pixelCount * 3);
    var alphaChannel = new Uint8Array(pixelCount * 1);
    var rgbaOffset = 0;
    var rgbOffset = 0;
    var alphaOffset = 0;
    while (rgbaOffset < rgbaChannel.length) {
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        alphaChannel[alphaOffset++] = rgbaChannel[rgbaOffset++];
    }
    return { rgbChannel: rgbChannel, alphaChannel: alphaChannel };
};
var PngType;
(function (PngType) {
    PngType["Greyscale"] = "Greyscale";
    PngType["Truecolour"] = "Truecolour";
    PngType["IndexedColour"] = "IndexedColour";
    PngType["GreyscaleWithAlpha"] = "GreyscaleWithAlpha";
    PngType["TruecolourWithAlpha"] = "TruecolourWithAlpha";
})(PngType = exports.PngType || (exports.PngType = {}));
var PNG = /** @class */ (function () {
    function PNG(pngData) {
        var upng = upng_1.default.decode(pngData);
        var frames = upng_1.default.toRGBA8(upng);
        if (frames.length > 1)
            throw new Error("Animated PNGs are not supported");
        var frame = new Uint8Array(frames[0]);
        var _a = splitAlphaChannel(frame), rgbChannel = _a.rgbChannel, alphaChannel = _a.alphaChannel;
        this.rgbChannel = rgbChannel;
        var hasAlphaValues = alphaChannel.some(function (a) { return a < 255; });
        if (hasAlphaValues)
            this.alphaChannel = alphaChannel;
        this.type = getImageType(upng.ctype);
        this.width = upng.width;
        this.height = upng.height;
        this.bitsPerComponent = 8;
    }
    PNG.load = function (pngData) { return new PNG(pngData); };
    return PNG;
}());
exports.PNG = PNG;
//# sourceMappingURL=png.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065522, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFRawStream_1 = tslib_1.__importDefault(require("../objects/PDFRawStream"));
var PDFStream_1 = tslib_1.__importDefault(require("../objects/PDFStream"));
var decode_1 = require("../streams/decode");
var PDFContentStream_1 = tslib_1.__importDefault(require("../structures/PDFContentStream"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var utils_1 = require("../../utils");
var fullPageBoundingBox = function (page) {
    var mediaBox = page.MediaBox();
    var width = mediaBox.lookup(2, PDFNumber_1.default).asNumber() -
        mediaBox.lookup(0, PDFNumber_1.default).asNumber();
    var height = mediaBox.lookup(3, PDFNumber_1.default).asNumber() -
        mediaBox.lookup(1, PDFNumber_1.default).asNumber();
    return { left: 0, bottom: 0, right: width, top: height };
};
// Returns the identity matrix, modified to position the content of the given
// bounding box at (0, 0).
var boundingBoxAdjustedMatrix = function (bb) { return [1, 0, 0, 1, -bb.left, -bb.bottom]; };
var PDFPageEmbedder = /** @class */ (function () {
    function PDFPageEmbedder(page, boundingBox, transformationMatrix) {
        this.page = page;
        var bb = boundingBox !== null && boundingBox !== void 0 ? boundingBox : fullPageBoundingBox(page);
        this.width = bb.right - bb.left;
        this.height = bb.top - bb.bottom;
        this.boundingBox = bb;
        this.transformationMatrix = transformationMatrix !== null && transformationMatrix !== void 0 ? transformationMatrix : boundingBoxAdjustedMatrix(bb);
    }
    PDFPageEmbedder.for = function (page, boundingBox, transformationMatrix) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new PDFPageEmbedder(page, boundingBox, transformationMatrix)];
            });
        });
    };
    PDFPageEmbedder.prototype.embedIntoContext = function (context, ref) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, Contents, Resources, decodedContents, _b, left, bottom, right, top, xObject;
            return tslib_1.__generator(this, function (_c) {
                _a = this.page.normalizedEntries(), Contents = _a.Contents, Resources = _a.Resources;
                if (!Contents)
                    throw new errors_1.MissingPageContentsEmbeddingError();
                decodedContents = this.decodeContents(Contents);
                _b = this.boundingBox, left = _b.left, bottom = _b.bottom, right = _b.right, top = _b.top;
                xObject = context.flateStream(decodedContents, {
                    Type: 'XObject',
                    Subtype: 'Form',
                    FormType: 1,
                    BBox: [left, bottom, right, top],
                    Matrix: this.transformationMatrix,
                    Resources: Resources,
                });
                if (ref) {
                    context.assign(ref, xObject);
                    return [2 /*return*/, ref];
                }
                else {
                    return [2 /*return*/, context.register(xObject)];
                }
                return [2 /*return*/];
            });
        });
    };
    // `contents` is an array of streams which are merged to include them in the XObject.
    // This methods extracts each stream and joins them with a newline character.
    PDFPageEmbedder.prototype.decodeContents = function (contents) {
        var newline = Uint8Array.of(CharCodes_1.default.Newline);
        var decodedContents = [];
        for (var idx = 0, len = contents.size(); idx < len; idx++) {
            var stream = contents.lookup(idx, PDFStream_1.default);
            var content = void 0;
            if (stream instanceof PDFRawStream_1.default) {
                content = decode_1.decodePDFRawStream(stream).decode();
            }
            else if (stream instanceof PDFContentStream_1.default) {
                content = stream.getUnencodedContents();
            }
            else {
                throw new errors_1.UnrecognizedStreamTypeError(stream);
            }
            decodedContents.push(content, newline);
        }
        return utils_1.mergeIntoTypedArray.apply(void 0, decodedContents);
    };
    return PDFPageEmbedder;
}());
exports.default = PDFPageEmbedder;
//# sourceMappingURL=PDFPageEmbedder.js.map
}, function(modId) { var map = {"../errors":1767772065467,"../objects/PDFNumber":1767772065484,"../objects/PDFRawStream":1767772065493,"../objects/PDFStream":1767772065494,"../streams/decode":1767772065523,"../structures/PDFContentStream":1767772065498,"../syntax/CharCodes":1767772065480,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065523, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.decodePDFRawStream = void 0;
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var Ascii85Stream_1 = tslib_1.__importDefault(require("./Ascii85Stream"));
var AsciiHexStream_1 = tslib_1.__importDefault(require("./AsciiHexStream"));
var FlateStream_1 = tslib_1.__importDefault(require("./FlateStream"));
var LZWStream_1 = tslib_1.__importDefault(require("./LZWStream"));
var RunLengthStream_1 = tslib_1.__importDefault(require("./RunLengthStream"));
var Stream_1 = tslib_1.__importDefault(require("./Stream"));
var decodeStream = function (stream, encoding, params) {
    if (encoding === PDFName_1.default.of('FlateDecode')) {
        return new FlateStream_1.default(stream);
    }
    if (encoding === PDFName_1.default.of('LZWDecode')) {
        var earlyChange = 1;
        if (params instanceof PDFDict_1.default) {
            var EarlyChange = params.lookup(PDFName_1.default.of('EarlyChange'));
            if (EarlyChange instanceof PDFNumber_1.default) {
                earlyChange = EarlyChange.asNumber();
            }
        }
        return new LZWStream_1.default(stream, undefined, earlyChange);
    }
    if (encoding === PDFName_1.default.of('ASCII85Decode')) {
        return new Ascii85Stream_1.default(stream);
    }
    if (encoding === PDFName_1.default.of('ASCIIHexDecode')) {
        return new AsciiHexStream_1.default(stream);
    }
    if (encoding === PDFName_1.default.of('RunLengthDecode')) {
        return new RunLengthStream_1.default(stream);
    }
    throw new errors_1.UnsupportedEncodingError(encoding.asString());
};
exports.decodePDFRawStream = function (_a) {
    var dict = _a.dict, contents = _a.contents;
    var stream = new Stream_1.default(contents);
    var Filter = dict.lookup(PDFName_1.default.of('Filter'));
    var DecodeParms = dict.lookup(PDFName_1.default.of('DecodeParms'));
    if (Filter instanceof PDFName_1.default) {
        stream = decodeStream(stream, Filter, DecodeParms);
    }
    else if (Filter instanceof PDFArray_1.default) {
        for (var idx = 0, len = Filter.size(); idx < len; idx++) {
            stream = decodeStream(stream, Filter.lookup(idx, PDFName_1.default), DecodeParms && DecodeParms.lookupMaybe(idx, PDFDict_1.default));
        }
    }
    else if (!!Filter) {
        throw new errors_1.UnexpectedObjectTypeError([PDFName_1.default, PDFArray_1.default], Filter);
    }
    return stream;
};
//# sourceMappingURL=decode.js.map
}, function(modId) { var map = {"../errors":1767772065467,"../objects/PDFArray":1767772065483,"../objects/PDFDict":1767772065487,"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"./Ascii85Stream":1767772065524,"./AsciiHexStream":1767772065527,"./FlateStream":1767772065528,"./LZWStream":1767772065529,"./RunLengthStream":1767772065530,"./Stream":1767772065526}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065524, function(require, module, exports) {

/*
 * Copyright 2012 Mozilla Foundation
 *
 * The Ascii85Stream class contained in this file is a TypeScript port of the
 * JavaScript Ascii85Stream class in Mozilla's pdf.js project, made available
 * under the Apache 2.0 open source license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DecodeStream_1 = tslib_1.__importDefault(require("./DecodeStream"));
var isSpace = function (ch) {
    return ch === 0x20 || ch === 0x09 || ch === 0x0d || ch === 0x0a;
};
var Ascii85Stream = /** @class */ (function (_super) {
    tslib_1.__extends(Ascii85Stream, _super);
    function Ascii85Stream(stream, maybeLength) {
        var _this = _super.call(this, maybeLength) || this;
        _this.stream = stream;
        _this.input = new Uint8Array(5);
        // Most streams increase in size when decoded, but Ascii85 streams
        // typically shrink by ~20%.
        if (maybeLength) {
            maybeLength = 0.8 * maybeLength;
        }
        return _this;
    }
    Ascii85Stream.prototype.readBlock = function () {
        var TILDA_CHAR = 0x7e; // '~'
        var Z_LOWER_CHAR = 0x7a; // 'z'
        var EOF = -1;
        var stream = this.stream;
        var c = stream.getByte();
        while (isSpace(c)) {
            c = stream.getByte();
        }
        if (c === EOF || c === TILDA_CHAR) {
            this.eof = true;
            return;
        }
        var bufferLength = this.bufferLength;
        var buffer;
        var i;
        // special code for z
        if (c === Z_LOWER_CHAR) {
            buffer = this.ensureBuffer(bufferLength + 4);
            for (i = 0; i < 4; ++i) {
                buffer[bufferLength + i] = 0;
            }
            this.bufferLength += 4;
        }
        else {
            var input = this.input;
            input[0] = c;
            for (i = 1; i < 5; ++i) {
                c = stream.getByte();
                while (isSpace(c)) {
                    c = stream.getByte();
                }
                input[i] = c;
                if (c === EOF || c === TILDA_CHAR) {
                    break;
                }
            }
            buffer = this.ensureBuffer(bufferLength + i - 1);
            this.bufferLength += i - 1;
            // partial ending;
            if (i < 5) {
                for (; i < 5; ++i) {
                    input[i] = 0x21 + 84;
                }
                this.eof = true;
            }
            var t = 0;
            for (i = 0; i < 5; ++i) {
                t = t * 85 + (input[i] - 0x21);
            }
            for (i = 3; i >= 0; --i) {
                buffer[bufferLength + i] = t & 0xff;
                t >>= 8;
            }
        }
    };
    return Ascii85Stream;
}(DecodeStream_1.default));
exports.default = Ascii85Stream;
//# sourceMappingURL=Ascii85Stream.js.map
}, function(modId) { var map = {"./DecodeStream":1767772065525}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065525, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var Stream_1 = tslib_1.__importDefault(require("./Stream"));
/*
 * Copyright 2012 Mozilla Foundation
 *
 * The DecodeStream class contained in this file is a TypeScript port of the
 * JavaScript DecodeStream class in Mozilla's pdf.js project, made available
 * under the Apache 2.0 open source license.
 */
// Lots of DecodeStreams are created whose buffers are never used.  For these
// we share a single empty buffer. This is (a) space-efficient and (b) avoids
// having special cases that would be required if we used |null| for an empty
// buffer.
var emptyBuffer = new Uint8Array(0);
/**
 * Super class for the decoding streams
 */
var DecodeStream = /** @class */ (function () {
    function DecodeStream(maybeMinBufferLength) {
        this.pos = 0;
        this.bufferLength = 0;
        this.eof = false;
        this.buffer = emptyBuffer;
        this.minBufferLength = 512;
        if (maybeMinBufferLength) {
            // Compute the first power of two that is as big as maybeMinBufferLength.
            while (this.minBufferLength < maybeMinBufferLength) {
                this.minBufferLength *= 2;
            }
        }
    }
    Object.defineProperty(DecodeStream.prototype, "isEmpty", {
        get: function () {
            while (!this.eof && this.bufferLength === 0) {
                this.readBlock();
            }
            return this.bufferLength === 0;
        },
        enumerable: false,
        configurable: true
    });
    DecodeStream.prototype.getByte = function () {
        var pos = this.pos;
        while (this.bufferLength <= pos) {
            if (this.eof) {
                return -1;
            }
            this.readBlock();
        }
        return this.buffer[this.pos++];
    };
    DecodeStream.prototype.getUint16 = function () {
        var b0 = this.getByte();
        var b1 = this.getByte();
        if (b0 === -1 || b1 === -1) {
            return -1;
        }
        return (b0 << 8) + b1;
    };
    DecodeStream.prototype.getInt32 = function () {
        var b0 = this.getByte();
        var b1 = this.getByte();
        var b2 = this.getByte();
        var b3 = this.getByte();
        return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    };
    DecodeStream.prototype.getBytes = function (length, forceClamped) {
        if (forceClamped === void 0) { forceClamped = false; }
        var end;
        var pos = this.pos;
        if (length) {
            this.ensureBuffer(pos + length);
            end = pos + length;
            while (!this.eof && this.bufferLength < end) {
                this.readBlock();
            }
            var bufEnd = this.bufferLength;
            if (end > bufEnd) {
                end = bufEnd;
            }
        }
        else {
            while (!this.eof) {
                this.readBlock();
            }
            end = this.bufferLength;
        }
        this.pos = end;
        var subarray = this.buffer.subarray(pos, end);
        // `this.buffer` is either a `Uint8Array` or `Uint8ClampedArray` here.
        return forceClamped && !(subarray instanceof Uint8ClampedArray)
            ? new Uint8ClampedArray(subarray)
            : subarray;
    };
    DecodeStream.prototype.peekByte = function () {
        var peekedByte = this.getByte();
        this.pos--;
        return peekedByte;
    };
    DecodeStream.prototype.peekBytes = function (length, forceClamped) {
        if (forceClamped === void 0) { forceClamped = false; }
        var bytes = this.getBytes(length, forceClamped);
        this.pos -= bytes.length;
        return bytes;
    };
    DecodeStream.prototype.skip = function (n) {
        if (!n) {
            n = 1;
        }
        this.pos += n;
    };
    DecodeStream.prototype.reset = function () {
        this.pos = 0;
    };
    DecodeStream.prototype.makeSubStream = function (start, length /* dict */) {
        var end = start + length;
        while (this.bufferLength <= end && !this.eof) {
            this.readBlock();
        }
        return new Stream_1.default(this.buffer, start, length /* dict */);
    };
    DecodeStream.prototype.decode = function () {
        while (!this.eof)
            this.readBlock();
        return this.buffer.subarray(0, this.bufferLength);
    };
    DecodeStream.prototype.readBlock = function () {
        throw new errors_1.MethodNotImplementedError(this.constructor.name, 'readBlock');
    };
    DecodeStream.prototype.ensureBuffer = function (requested) {
        var buffer = this.buffer;
        if (requested <= buffer.byteLength) {
            return buffer;
        }
        var size = this.minBufferLength;
        while (size < requested) {
            size *= 2;
        }
        var buffer2 = new Uint8Array(size);
        buffer2.set(buffer);
        return (this.buffer = buffer2);
    };
    return DecodeStream;
}());
exports.default = DecodeStream;
//# sourceMappingURL=DecodeStream.js.map
}, function(modId) { var map = {"../errors":1767772065467,"./Stream":1767772065526}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065526, function(require, module, exports) {

/*
 * Copyright 2012 Mozilla Foundation
 *
 * The Stream class contained in this file is a TypeScript port of the
 * JavaScript Stream class in Mozilla's pdf.js project, made available
 * under the Apache 2.0 open source license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Stream = /** @class */ (function () {
    function Stream(buffer, start, length) {
        this.bytes = buffer;
        this.start = start || 0;
        this.pos = this.start;
        this.end = !!start && !!length ? start + length : this.bytes.length;
    }
    Object.defineProperty(Stream.prototype, "length", {
        get: function () {
            return this.end - this.start;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "isEmpty", {
        get: function () {
            return this.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Stream.prototype.getByte = function () {
        if (this.pos >= this.end) {
            return -1;
        }
        return this.bytes[this.pos++];
    };
    Stream.prototype.getUint16 = function () {
        var b0 = this.getByte();
        var b1 = this.getByte();
        if (b0 === -1 || b1 === -1) {
            return -1;
        }
        return (b0 << 8) + b1;
    };
    Stream.prototype.getInt32 = function () {
        var b0 = this.getByte();
        var b1 = this.getByte();
        var b2 = this.getByte();
        var b3 = this.getByte();
        return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    };
    // Returns subarray of original buffer, should only be read.
    Stream.prototype.getBytes = function (length, forceClamped) {
        if (forceClamped === void 0) { forceClamped = false; }
        var bytes = this.bytes;
        var pos = this.pos;
        var strEnd = this.end;
        if (!length) {
            var subarray = bytes.subarray(pos, strEnd);
            // `this.bytes` is always a `Uint8Array` here.
            return forceClamped ? new Uint8ClampedArray(subarray) : subarray;
        }
        else {
            var end = pos + length;
            if (end > strEnd) {
                end = strEnd;
            }
            this.pos = end;
            var subarray = bytes.subarray(pos, end);
            // `this.bytes` is always a `Uint8Array` here.
            return forceClamped ? new Uint8ClampedArray(subarray) : subarray;
        }
    };
    Stream.prototype.peekByte = function () {
        var peekedByte = this.getByte();
        this.pos--;
        return peekedByte;
    };
    Stream.prototype.peekBytes = function (length, forceClamped) {
        if (forceClamped === void 0) { forceClamped = false; }
        var bytes = this.getBytes(length, forceClamped);
        this.pos -= bytes.length;
        return bytes;
    };
    Stream.prototype.skip = function (n) {
        if (!n) {
            n = 1;
        }
        this.pos += n;
    };
    Stream.prototype.reset = function () {
        this.pos = this.start;
    };
    Stream.prototype.moveStart = function () {
        this.start = this.pos;
    };
    Stream.prototype.makeSubStream = function (start, length) {
        return new Stream(this.bytes, start, length);
    };
    Stream.prototype.decode = function () {
        return this.bytes;
    };
    return Stream;
}());
exports.default = Stream;
//# sourceMappingURL=Stream.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065527, function(require, module, exports) {

/*
 * Copyright 2012 Mozilla Foundation
 *
 * The AsciiHexStream class contained in this file is a TypeScript port of the
 * JavaScript AsciiHexStream class in Mozilla's pdf.js project, made available
 * under the Apache 2.0 open source license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DecodeStream_1 = tslib_1.__importDefault(require("./DecodeStream"));
var AsciiHexStream = /** @class */ (function (_super) {
    tslib_1.__extends(AsciiHexStream, _super);
    function AsciiHexStream(stream, maybeLength) {
        var _this = _super.call(this, maybeLength) || this;
        _this.stream = stream;
        _this.firstDigit = -1;
        // Most streams increase in size when decoded, but AsciiHex streams shrink
        // by 50%.
        if (maybeLength) {
            maybeLength = 0.5 * maybeLength;
        }
        return _this;
    }
    AsciiHexStream.prototype.readBlock = function () {
        var UPSTREAM_BLOCK_SIZE = 8000;
        var bytes = this.stream.getBytes(UPSTREAM_BLOCK_SIZE);
        if (!bytes.length) {
            this.eof = true;
            return;
        }
        var maxDecodeLength = (bytes.length + 1) >> 1;
        var buffer = this.ensureBuffer(this.bufferLength + maxDecodeLength);
        var bufferLength = this.bufferLength;
        var firstDigit = this.firstDigit;
        for (var i = 0, ii = bytes.length; i < ii; i++) {
            var ch = bytes[i];
            var digit = void 0;
            if (ch >= 0x30 && ch <= 0x39) {
                // '0'-'9'
                digit = ch & 0x0f;
            }
            else if ((ch >= 0x41 && ch <= 0x46) || (ch >= 0x61 && ch <= 0x66)) {
                // 'A'-'Z', 'a'-'z'
                digit = (ch & 0x0f) + 9;
            }
            else if (ch === 0x3e) {
                // '>'
                this.eof = true;
                break;
            }
            else {
                // probably whitespace
                continue; // ignoring
            }
            if (firstDigit < 0) {
                firstDigit = digit;
            }
            else {
                buffer[bufferLength++] = (firstDigit << 4) | digit;
                firstDigit = -1;
            }
        }
        if (firstDigit >= 0 && this.eof) {
            // incomplete byte
            buffer[bufferLength++] = firstDigit << 4;
            firstDigit = -1;
        }
        this.firstDigit = firstDigit;
        this.bufferLength = bufferLength;
    };
    return AsciiHexStream;
}(DecodeStream_1.default));
exports.default = AsciiHexStream;
//# sourceMappingURL=AsciiHexStream.js.map
}, function(modId) { var map = {"./DecodeStream":1767772065525}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065528, function(require, module, exports) {

/*
 * Copyright 1996-2003 Glyph & Cog, LLC
 *
 * The flate stream implementation contained in this file is a JavaScript port
 * of XPDF's implementation, made available under the Apache 2.0 open source
 * license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/*
 * Copyright 2012 Mozilla Foundation
 *
 * The FlateStream class contained in this file is a TypeScript port of the
 * JavaScript FlateStream class in Mozilla's pdf.js project, made available
 * under the Apache 2.0 open source license.
 */
/* tslint:disable  no-conditional-assignment */
var DecodeStream_1 = tslib_1.__importDefault(require("./DecodeStream"));
// prettier-ignore
var codeLenCodeMap = new Int32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
]);
// prettier-ignore
var lengthDecode = new Int32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
]);
// prettier-ignore
var distDecode = new Int32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
]);
// prettier-ignore
var fixedLitCodeTab = [new Int32Array([
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
        0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
        0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
        0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
        0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
        0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
        0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
        0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
        0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
        0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
        0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
        0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
        0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
        0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
        0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
        0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
        0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
        0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
        0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
        0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
        0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
        0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
        0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
        0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
        0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
        0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
        0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
        0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
        0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
        0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
        0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
        0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
        0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
        0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
        0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
        0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
        0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
        0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
        0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
        0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
        0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
        0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
        0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
        0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
        0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
        0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
        0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
        0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
        0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
        0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
        0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
        0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
        0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
        0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
        0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
        0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
        0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
    ]), 9];
// prettier-ignore
var fixedDistCodeTab = [new Int32Array([
        0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
        0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
        0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
        0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
    ]), 5];
var FlateStream = /** @class */ (function (_super) {
    tslib_1.__extends(FlateStream, _super);
    function FlateStream(stream, maybeLength) {
        var _this = _super.call(this, maybeLength) || this;
        _this.stream = stream;
        var cmf = stream.getByte();
        var flg = stream.getByte();
        if (cmf === -1 || flg === -1) {
            throw new Error("Invalid header in flate stream: " + cmf + ", " + flg);
        }
        if ((cmf & 0x0f) !== 0x08) {
            throw new Error("Unknown compression method in flate stream: " + cmf + ", " + flg);
        }
        if (((cmf << 8) + flg) % 31 !== 0) {
            throw new Error("Bad FCHECK in flate stream: " + cmf + ", " + flg);
        }
        if (flg & 0x20) {
            throw new Error("FDICT bit set in flate stream: " + cmf + ", " + flg);
        }
        _this.codeSize = 0;
        _this.codeBuf = 0;
        return _this;
    }
    FlateStream.prototype.readBlock = function () {
        var buffer;
        var len;
        var str = this.stream;
        // read block header
        var hdr = this.getBits(3);
        if (hdr & 1) {
            this.eof = true;
        }
        hdr >>= 1;
        if (hdr === 0) {
            // uncompressed block
            var b = void 0;
            if ((b = str.getByte()) === -1) {
                throw new Error('Bad block header in flate stream');
            }
            var blockLen = b;
            if ((b = str.getByte()) === -1) {
                throw new Error('Bad block header in flate stream');
            }
            blockLen |= b << 8;
            if ((b = str.getByte()) === -1) {
                throw new Error('Bad block header in flate stream');
            }
            var check = b;
            if ((b = str.getByte()) === -1) {
                throw new Error('Bad block header in flate stream');
            }
            check |= b << 8;
            if (check !== (~blockLen & 0xffff) && (blockLen !== 0 || check !== 0)) {
                // Ignoring error for bad "empty" block (see issue 1277)
                throw new Error('Bad uncompressed block length in flate stream');
            }
            this.codeBuf = 0;
            this.codeSize = 0;
            var bufferLength = this.bufferLength;
            buffer = this.ensureBuffer(bufferLength + blockLen);
            var end = bufferLength + blockLen;
            this.bufferLength = end;
            if (blockLen === 0) {
                if (str.peekByte() === -1) {
                    this.eof = true;
                }
            }
            else {
                for (var n = bufferLength; n < end; ++n) {
                    if ((b = str.getByte()) === -1) {
                        this.eof = true;
                        break;
                    }
                    buffer[n] = b;
                }
            }
            return;
        }
        var litCodeTable;
        var distCodeTable;
        if (hdr === 1) {
            // compressed block, fixed codes
            litCodeTable = fixedLitCodeTab;
            distCodeTable = fixedDistCodeTab;
        }
        else if (hdr === 2) {
            // compressed block, dynamic codes
            var numLitCodes = this.getBits(5) + 257;
            var numDistCodes = this.getBits(5) + 1;
            var numCodeLenCodes = this.getBits(4) + 4;
            // build the code lengths code table
            var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);
            var i = void 0;
            for (i = 0; i < numCodeLenCodes; ++i) {
                codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
            }
            var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);
            // build the literal and distance code tables
            len = 0;
            i = 0;
            var codes = numLitCodes + numDistCodes;
            var codeLengths = new Uint8Array(codes);
            var bitsLength = void 0;
            var bitsOffset = void 0;
            var what = void 0;
            while (i < codes) {
                var code = this.getCode(codeLenCodeTab);
                if (code === 16) {
                    bitsLength = 2;
                    bitsOffset = 3;
                    what = len;
                }
                else if (code === 17) {
                    bitsLength = 3;
                    bitsOffset = 3;
                    what = len = 0;
                }
                else if (code === 18) {
                    bitsLength = 7;
                    bitsOffset = 11;
                    what = len = 0;
                }
                else {
                    codeLengths[i++] = len = code;
                    continue;
                }
                var repeatLength = this.getBits(bitsLength) + bitsOffset;
                while (repeatLength-- > 0) {
                    codeLengths[i++] = what;
                }
            }
            litCodeTable = this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
            distCodeTable = this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
        }
        else {
            throw new Error('Unknown block type in flate stream');
        }
        buffer = this.buffer;
        var limit = buffer ? buffer.length : 0;
        var pos = this.bufferLength;
        while (true) {
            var code1 = this.getCode(litCodeTable);
            if (code1 < 256) {
                if (pos + 1 >= limit) {
                    buffer = this.ensureBuffer(pos + 1);
                    limit = buffer.length;
                }
                buffer[pos++] = code1;
                continue;
            }
            if (code1 === 256) {
                this.bufferLength = pos;
                return;
            }
            code1 -= 257;
            code1 = lengthDecode[code1];
            var code2 = code1 >> 16;
            if (code2 > 0) {
                code2 = this.getBits(code2);
            }
            len = (code1 & 0xffff) + code2;
            code1 = this.getCode(distCodeTable);
            code1 = distDecode[code1];
            code2 = code1 >> 16;
            if (code2 > 0) {
                code2 = this.getBits(code2);
            }
            var dist = (code1 & 0xffff) + code2;
            if (pos + len >= limit) {
                buffer = this.ensureBuffer(pos + len);
                limit = buffer.length;
            }
            for (var k = 0; k < len; ++k, ++pos) {
                buffer[pos] = buffer[pos - dist];
            }
        }
    };
    FlateStream.prototype.getBits = function (bits) {
        var str = this.stream;
        var codeSize = this.codeSize;
        var codeBuf = this.codeBuf;
        var b;
        while (codeSize < bits) {
            if ((b = str.getByte()) === -1) {
                throw new Error('Bad encoding in flate stream');
            }
            codeBuf |= b << codeSize;
            codeSize += 8;
        }
        b = codeBuf & ((1 << bits) - 1);
        this.codeBuf = codeBuf >> bits;
        this.codeSize = codeSize -= bits;
        return b;
    };
    FlateStream.prototype.getCode = function (table) {
        var str = this.stream;
        var codes = table[0];
        var maxLen = table[1];
        var codeSize = this.codeSize;
        var codeBuf = this.codeBuf;
        var b;
        while (codeSize < maxLen) {
            if ((b = str.getByte()) === -1) {
                // premature end of stream. code might however still be valid.
                // codeSize < codeLen check below guards against incomplete codeVal.
                break;
            }
            codeBuf |= b << codeSize;
            codeSize += 8;
        }
        var code = codes[codeBuf & ((1 << maxLen) - 1)];
        if (typeof codes === 'number') {
            console.log('FLATE:', code);
        }
        var codeLen = code >> 16;
        var codeVal = code & 0xffff;
        if (codeLen < 1 || codeSize < codeLen) {
            throw new Error('Bad encoding in flate stream');
        }
        this.codeBuf = codeBuf >> codeLen;
        this.codeSize = codeSize - codeLen;
        return codeVal;
    };
    FlateStream.prototype.generateHuffmanTable = function (lengths) {
        var n = lengths.length;
        // find max code length
        var maxLen = 0;
        var i;
        for (i = 0; i < n; ++i) {
            if (lengths[i] > maxLen) {
                maxLen = lengths[i];
            }
        }
        // build the table
        var size = 1 << maxLen;
        var codes = new Int32Array(size);
        for (var len = 1, code = 0, skip = 2; len <= maxLen; ++len, code <<= 1, skip <<= 1) {
            for (var val = 0; val < n; ++val) {
                if (lengths[val] === len) {
                    // bit-reverse the code
                    var code2 = 0;
                    var t = code;
                    for (i = 0; i < len; ++i) {
                        code2 = (code2 << 1) | (t & 1);
                        t >>= 1;
                    }
                    // fill the table entries
                    for (i = code2; i < size; i += skip) {
                        codes[i] = (len << 16) | val;
                    }
                    ++code;
                }
            }
        }
        return [codes, maxLen];
    };
    return FlateStream;
}(DecodeStream_1.default));
exports.default = FlateStream;
//# sourceMappingURL=FlateStream.js.map
}, function(modId) { var map = {"./DecodeStream":1767772065525}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065529, function(require, module, exports) {

/*
 * Copyright 2012 Mozilla Foundation
 *
 * The LZWStream class contained in this file is a TypeScript port of the
 * JavaScript LZWStream class in Mozilla's pdf.js project, made available
 * under the Apache 2.0 open source license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DecodeStream_1 = tslib_1.__importDefault(require("./DecodeStream"));
var LZWStream = /** @class */ (function (_super) {
    tslib_1.__extends(LZWStream, _super);
    function LZWStream(stream, maybeLength, earlyChange) {
        var _this = _super.call(this, maybeLength) || this;
        _this.stream = stream;
        _this.cachedData = 0;
        _this.bitsCached = 0;
        var maxLzwDictionarySize = 4096;
        var lzwState = {
            earlyChange: earlyChange,
            codeLength: 9,
            nextCode: 258,
            dictionaryValues: new Uint8Array(maxLzwDictionarySize),
            dictionaryLengths: new Uint16Array(maxLzwDictionarySize),
            dictionaryPrevCodes: new Uint16Array(maxLzwDictionarySize),
            currentSequence: new Uint8Array(maxLzwDictionarySize),
            currentSequenceLength: 0,
        };
        for (var i = 0; i < 256; ++i) {
            lzwState.dictionaryValues[i] = i;
            lzwState.dictionaryLengths[i] = 1;
        }
        _this.lzwState = lzwState;
        return _this;
    }
    LZWStream.prototype.readBlock = function () {
        var blockSize = 512;
        var estimatedDecodedSize = blockSize * 2;
        var decodedSizeDelta = blockSize;
        var i;
        var j;
        var q;
        var lzwState = this.lzwState;
        if (!lzwState) {
            return; // eof was found
        }
        var earlyChange = lzwState.earlyChange;
        var nextCode = lzwState.nextCode;
        var dictionaryValues = lzwState.dictionaryValues;
        var dictionaryLengths = lzwState.dictionaryLengths;
        var dictionaryPrevCodes = lzwState.dictionaryPrevCodes;
        var codeLength = lzwState.codeLength;
        var prevCode = lzwState.prevCode;
        var currentSequence = lzwState.currentSequence;
        var currentSequenceLength = lzwState.currentSequenceLength;
        var decodedLength = 0;
        var currentBufferLength = this.bufferLength;
        var buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
        for (i = 0; i < blockSize; i++) {
            var code = this.readBits(codeLength);
            var hasPrev = currentSequenceLength > 0;
            if (!code || code < 256) {
                currentSequence[0] = code;
                currentSequenceLength = 1;
            }
            else if (code >= 258) {
                if (code < nextCode) {
                    currentSequenceLength = dictionaryLengths[code];
                    for (j = currentSequenceLength - 1, q = code; j >= 0; j--) {
                        currentSequence[j] = dictionaryValues[q];
                        q = dictionaryPrevCodes[q];
                    }
                }
                else {
                    currentSequence[currentSequenceLength++] = currentSequence[0];
                }
            }
            else if (code === 256) {
                codeLength = 9;
                nextCode = 258;
                currentSequenceLength = 0;
                continue;
            }
            else {
                this.eof = true;
                delete this.lzwState;
                break;
            }
            if (hasPrev) {
                dictionaryPrevCodes[nextCode] = prevCode;
                dictionaryLengths[nextCode] = dictionaryLengths[prevCode] + 1;
                dictionaryValues[nextCode] = currentSequence[0];
                nextCode++;
                codeLength =
                    (nextCode + earlyChange) & (nextCode + earlyChange - 1)
                        ? codeLength
                        : Math.min(Math.log(nextCode + earlyChange) / 0.6931471805599453 + 1, 12) | 0;
            }
            prevCode = code;
            decodedLength += currentSequenceLength;
            if (estimatedDecodedSize < decodedLength) {
                do {
                    estimatedDecodedSize += decodedSizeDelta;
                } while (estimatedDecodedSize < decodedLength);
                buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
            }
            for (j = 0; j < currentSequenceLength; j++) {
                buffer[currentBufferLength++] = currentSequence[j];
            }
        }
        lzwState.nextCode = nextCode;
        lzwState.codeLength = codeLength;
        lzwState.prevCode = prevCode;
        lzwState.currentSequenceLength = currentSequenceLength;
        this.bufferLength = currentBufferLength;
    };
    LZWStream.prototype.readBits = function (n) {
        var bitsCached = this.bitsCached;
        var cachedData = this.cachedData;
        while (bitsCached < n) {
            var c = this.stream.getByte();
            if (c === -1) {
                this.eof = true;
                return null;
            }
            cachedData = (cachedData << 8) | c;
            bitsCached += 8;
        }
        this.bitsCached = bitsCached -= n;
        this.cachedData = cachedData;
        return (cachedData >>> bitsCached) & ((1 << n) - 1);
    };
    return LZWStream;
}(DecodeStream_1.default));
exports.default = LZWStream;
//# sourceMappingURL=LZWStream.js.map
}, function(modId) { var map = {"./DecodeStream":1767772065525}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065530, function(require, module, exports) {

/*
 * Copyright 2012 Mozilla Foundation
 *
 * The RunLengthStream class contained in this file is a TypeScript port of the
 * JavaScript RunLengthStream class in Mozilla's pdf.js project, made available
 * under the Apache 2.0 open source license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DecodeStream_1 = tslib_1.__importDefault(require("./DecodeStream"));
var RunLengthStream = /** @class */ (function (_super) {
    tslib_1.__extends(RunLengthStream, _super);
    function RunLengthStream(stream, maybeLength) {
        var _this = _super.call(this, maybeLength) || this;
        _this.stream = stream;
        return _this;
    }
    RunLengthStream.prototype.readBlock = function () {
        // The repeatHeader has following format. The first byte defines type of run
        // and amount of bytes to repeat/copy: n = 0 through 127 - copy next n bytes
        // (in addition to the second byte from the header), n = 129 through 255 -
        // duplicate the second byte from the header (257 - n) times, n = 128 - end.
        var repeatHeader = this.stream.getBytes(2);
        if (!repeatHeader || repeatHeader.length < 2 || repeatHeader[0] === 128) {
            this.eof = true;
            return;
        }
        var buffer;
        var bufferLength = this.bufferLength;
        var n = repeatHeader[0];
        if (n < 128) {
            // copy n bytes
            buffer = this.ensureBuffer(bufferLength + n + 1);
            buffer[bufferLength++] = repeatHeader[1];
            if (n > 0) {
                var source = this.stream.getBytes(n);
                buffer.set(source, bufferLength);
                bufferLength += n;
            }
        }
        else {
            n = 257 - n;
            var b = repeatHeader[1];
            buffer = this.ensureBuffer(bufferLength + n + 1);
            for (var i = 0; i < n; i++) {
                buffer[bufferLength++] = b;
            }
        }
        this.bufferLength = bufferLength;
    };
    return RunLengthStream;
}(DecodeStream_1.default));
exports.default = RunLengthStream;
//# sourceMappingURL=RunLengthStream.js.map
}, function(modId) { var map = {"./DecodeStream":1767772065525}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065531, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.Duplex = exports.PrintScaling = exports.ReadingDirection = exports.NonFullScreenPageMode = void 0;
var tslib_1 = require("tslib");
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFBool_1 = tslib_1.__importDefault(require("../objects/PDFBool"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var utils_1 = require("../../utils");
var asEnum = function (rawValue, enumType) {
    if (rawValue === undefined)
        return undefined;
    return enumType[rawValue];
};
var NonFullScreenPageMode;
(function (NonFullScreenPageMode) {
    /**
     * After exiting FullScreen mode, neither the document outline nor thumbnail
     * images should be visible.
     */
    NonFullScreenPageMode["UseNone"] = "UseNone";
    /** After exiting FullScreen mode, the document outline should be visible. */
    NonFullScreenPageMode["UseOutlines"] = "UseOutlines";
    /** After exiting FullScreen mode, thumbnail images should be visible. */
    NonFullScreenPageMode["UseThumbs"] = "UseThumbs";
    /**
     * After exiting FullScreen mode, the optional content group panel should be
     * visible.
     */
    NonFullScreenPageMode["UseOC"] = "UseOC";
})(NonFullScreenPageMode = exports.NonFullScreenPageMode || (exports.NonFullScreenPageMode = {}));
var ReadingDirection;
(function (ReadingDirection) {
    /** The predominant reading order is Left to Right. */
    ReadingDirection["L2R"] = "L2R";
    /**
     * The predominant reading order is Right to left (including vertical writing
     * systems, such as Chinese, Japanese and Korean).
     */
    ReadingDirection["R2L"] = "R2L";
})(ReadingDirection = exports.ReadingDirection || (exports.ReadingDirection = {}));
var PrintScaling;
(function (PrintScaling) {
    /** No page scaling. */
    PrintScaling["None"] = "None";
    /* Use the PDF reader's default print scaling. */
    PrintScaling["AppDefault"] = "AppDefault";
})(PrintScaling = exports.PrintScaling || (exports.PrintScaling = {}));
var Duplex;
(function (Duplex) {
    /** The PDF reader should print single-sided. */
    Duplex["Simplex"] = "Simplex";
    /**
     * The PDF reader should print double sided and flip on the short edge of the
     * sheet.
     */
    Duplex["DuplexFlipShortEdge"] = "DuplexFlipShortEdge";
    /**
     * The PDF reader should print double sided and flip on the long edge of the
     * sheet.
     */
    Duplex["DuplexFlipLongEdge"] = "DuplexFlipLongEdge";
})(Duplex = exports.Duplex || (exports.Duplex = {}));
var ViewerPreferences = /** @class */ (function () {
    /** @ignore */
    function ViewerPreferences(dict) {
        this.dict = dict;
    }
    ViewerPreferences.prototype.lookupBool = function (key) {
        var returnObj = this.dict.lookup(PDFName_1.default.of(key));
        if (returnObj instanceof PDFBool_1.default)
            return returnObj;
        return undefined;
    };
    ViewerPreferences.prototype.lookupName = function (key) {
        var returnObj = this.dict.lookup(PDFName_1.default.of(key));
        if (returnObj instanceof PDFName_1.default)
            return returnObj;
        return undefined;
    };
    /** @ignore */
    ViewerPreferences.prototype.HideToolbar = function () {
        return this.lookupBool('HideToolbar');
    };
    /** @ignore */
    ViewerPreferences.prototype.HideMenubar = function () {
        return this.lookupBool('HideMenubar');
    };
    /** @ignore */
    ViewerPreferences.prototype.HideWindowUI = function () {
        return this.lookupBool('HideWindowUI');
    };
    /** @ignore */
    ViewerPreferences.prototype.FitWindow = function () {
        return this.lookupBool('FitWindow');
    };
    /** @ignore */
    ViewerPreferences.prototype.CenterWindow = function () {
        return this.lookupBool('CenterWindow');
    };
    /** @ignore */
    ViewerPreferences.prototype.DisplayDocTitle = function () {
        return this.lookupBool('DisplayDocTitle');
    };
    /** @ignore */
    ViewerPreferences.prototype.NonFullScreenPageMode = function () {
        return this.lookupName('NonFullScreenPageMode');
    };
    /** @ignore */
    ViewerPreferences.prototype.Direction = function () {
        return this.lookupName('Direction');
    };
    /** @ignore */
    ViewerPreferences.prototype.PrintScaling = function () {
        return this.lookupName('PrintScaling');
    };
    /** @ignore */
    ViewerPreferences.prototype.Duplex = function () {
        return this.lookupName('Duplex');
    };
    /** @ignore */
    ViewerPreferences.prototype.PickTrayByPDFSize = function () {
        return this.lookupBool('PickTrayByPDFSize');
    };
    /** @ignore */
    ViewerPreferences.prototype.PrintPageRange = function () {
        var PrintPageRange = this.dict.lookup(PDFName_1.default.of('PrintPageRange'));
        if (PrintPageRange instanceof PDFArray_1.default)
            return PrintPageRange;
        return undefined;
    };
    /** @ignore */
    ViewerPreferences.prototype.NumCopies = function () {
        var NumCopies = this.dict.lookup(PDFName_1.default.of('NumCopies'));
        if (NumCopies instanceof PDFNumber_1.default)
            return NumCopies;
        return undefined;
    };
    /**
     * Returns `true` if PDF readers should hide the toolbar menus when displaying
     * this document.
     * @returns Whether or not toolbars should be hidden.
     */
    ViewerPreferences.prototype.getHideToolbar = function () {
        var _a, _b;
        return (_b = (_a = this.HideToolbar()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    /**
     * Returns `true` if PDF readers should hide the menu bar when displaying this
     * document.
     * @returns Whether or not the menu bar should be hidden.
     */
    ViewerPreferences.prototype.getHideMenubar = function () {
        var _a, _b;
        return (_b = (_a = this.HideMenubar()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    /**
     * Returns `true` if PDF readers should hide the user interface elements in
     * the document's window (such as scroll bars and navigation controls),
     * leaving only the document's contents displayed.
     * @returns Whether or not user interface elements should be hidden.
     */
    ViewerPreferences.prototype.getHideWindowUI = function () {
        var _a, _b;
        return (_b = (_a = this.HideWindowUI()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    /**
     * Returns `true` if PDF readers should resize the document's window to fit
     * the size of the first displayed page.
     * @returns Whether or not the window should be resized to fit.
     */
    ViewerPreferences.prototype.getFitWindow = function () {
        var _a, _b;
        return (_b = (_a = this.FitWindow()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    /**
     * Returns `true` if PDF readers should position the document's window in the
     * center of the screen.
     * @returns Whether or not to center the document window.
     */
    ViewerPreferences.prototype.getCenterWindow = function () {
        var _a, _b;
        return (_b = (_a = this.CenterWindow()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    /**
     * Returns `true` if the window's title bar should display the document
     * `Title`, taken from the document metadata (see [[PDFDocument.getTitle]]).
     * Returns `false` if the title bar should instead display the filename of the
     * PDF file.
     * @returns Whether to display the document title.
     */
    ViewerPreferences.prototype.getDisplayDocTitle = function () {
        var _a, _b;
        return (_b = (_a = this.DisplayDocTitle()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    /**
     * Returns the page mode, which tells the PDF reader how to display the
     * document after exiting full-screen mode.
     * @returns The page mode after exiting full-screen mode.
     */
    ViewerPreferences.prototype.getNonFullScreenPageMode = function () {
        var _a, _b;
        var mode = (_a = this.NonFullScreenPageMode()) === null || _a === void 0 ? void 0 : _a.decodeText();
        return (_b = asEnum(mode, NonFullScreenPageMode)) !== null && _b !== void 0 ? _b : NonFullScreenPageMode.UseNone;
    };
    /**
     * Returns the predominant reading order for text.
     * @returns The text reading order.
     */
    ViewerPreferences.prototype.getReadingDirection = function () {
        var _a, _b;
        var direction = (_a = this.Direction()) === null || _a === void 0 ? void 0 : _a.decodeText();
        return (_b = asEnum(direction, ReadingDirection)) !== null && _b !== void 0 ? _b : ReadingDirection.L2R;
    };
    /**
     * Returns the page scaling option that the PDF reader should select when the
     * print dialog is displayed.
     * @returns The page scaling option.
     */
    ViewerPreferences.prototype.getPrintScaling = function () {
        var _a, _b;
        var scaling = (_a = this.PrintScaling()) === null || _a === void 0 ? void 0 : _a.decodeText();
        return (_b = asEnum(scaling, PrintScaling)) !== null && _b !== void 0 ? _b : PrintScaling.AppDefault;
    };
    /**
     * Returns the paper handling option that should be used when printing the
     * file from the print dialog.
     * @returns The paper handling option.
     */
    ViewerPreferences.prototype.getDuplex = function () {
        var _a;
        var duplex = (_a = this.Duplex()) === null || _a === void 0 ? void 0 : _a.decodeText();
        return asEnum(duplex, Duplex);
    };
    /**
     * Returns `true` if the PDF page size should be used to select the input
     * paper tray.
     * @returns Whether or not the PDF page size should be used to select the
     *          input paper tray.
     */
    ViewerPreferences.prototype.getPickTrayByPDFSize = function () {
        var _a;
        return (_a = this.PickTrayByPDFSize()) === null || _a === void 0 ? void 0 : _a.asBoolean();
    };
    /**
     * Returns an array of page number ranges, which are the values used to
     * initialize the print dialog box when the file is printed. Each range
     * specifies the first (`start`) and last (`end`) pages in a sub-range of
     * pages to be printed. The first page of the PDF file is denoted by 0.
     * For example:
     * ```js
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * const includesPage3 = viewerPrefs
     *   .getPrintRanges()
     *   .some(pr => pr.start =< 2 && pr.end >= 2)
     * if (includesPage3) console.log('printRange includes page 3')
     * ```
     * @returns An array of objects, each with the properties `start` and `end`,
     *          denoting page indices. If not, specified an empty array is
     *          returned.
     */
    ViewerPreferences.prototype.getPrintPageRange = function () {
        var rng = this.PrintPageRange();
        if (!rng)
            return [];
        var pageRanges = [];
        for (var i = 0; i < rng.size(); i += 2) {
            // Despite the spec clearly stating that "The first page of the PDF file
            // shall be donoted by 1", several test PDFs (spec 1.7) created in
            // Acrobat XI 11.0 and also read with Reader DC 2020.013 indicate this is
            // actually a 0 based index.
            var start = rng.lookup(i, PDFNumber_1.default).asNumber();
            var end = rng.lookup(i + 1, PDFNumber_1.default).asNumber();
            pageRanges.push({ start: start, end: end });
        }
        return pageRanges;
    };
    /**
     * Returns the number of copies to be printed when the print dialog is opened
     * for this document.
     * @returns The default number of copies to be printed.
     */
    ViewerPreferences.prototype.getNumCopies = function () {
        var _a, _b;
        return (_b = (_a = this.NumCopies()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 1;
    };
    /**
     * Choose whether the PDF reader's toolbars should be hidden while the
     * document is active.
     * @param hideToolbar `true` if the toolbar should be hidden.
     */
    ViewerPreferences.prototype.setHideToolbar = function (hideToolbar) {
        var HideToolbar = this.dict.context.obj(hideToolbar);
        this.dict.set(PDFName_1.default.of('HideToolbar'), HideToolbar);
    };
    /**
     * Choose whether the PDF reader's menu bar should be hidden while the
     * document is active.
     * @param hideMenubar `true` if the menu bar should be hidden.
     */
    ViewerPreferences.prototype.setHideMenubar = function (hideMenubar) {
        var HideMenubar = this.dict.context.obj(hideMenubar);
        this.dict.set(PDFName_1.default.of('HideMenubar'), HideMenubar);
    };
    /**
     * Choose whether the PDF reader should hide user interface elements in the
     * document's window (such as scroll bars and navigation controls), leaving
     * only the document's contents displayed.
     * @param hideWindowUI `true` if the user interface elements should be hidden.
     */
    ViewerPreferences.prototype.setHideWindowUI = function (hideWindowUI) {
        var HideWindowUI = this.dict.context.obj(hideWindowUI);
        this.dict.set(PDFName_1.default.of('HideWindowUI'), HideWindowUI);
    };
    /**
     * Choose whether the PDF reader should resize the document's window to fit
     * the size of the first displayed page.
     * @param fitWindow `true` if the window should be resized.
     */
    ViewerPreferences.prototype.setFitWindow = function (fitWindow) {
        var FitWindow = this.dict.context.obj(fitWindow);
        this.dict.set(PDFName_1.default.of('FitWindow'), FitWindow);
    };
    /**
     * Choose whether the PDF reader should position the document's window in the
     * center of the screen.
     * @param centerWindow `true` if the window should be centered.
     */
    ViewerPreferences.prototype.setCenterWindow = function (centerWindow) {
        var CenterWindow = this.dict.context.obj(centerWindow);
        this.dict.set(PDFName_1.default.of('CenterWindow'), CenterWindow);
    };
    /**
     * Choose whether the window's title bar should display the document `Title`
     * taken from the document metadata (see [[PDFDocument.setTitle]]). If
     * `false`, the title bar should instead display the PDF filename.
     * @param displayTitle `true` if the document title should be displayed.
     */
    ViewerPreferences.prototype.setDisplayDocTitle = function (displayTitle) {
        var DisplayDocTitle = this.dict.context.obj(displayTitle);
        this.dict.set(PDFName_1.default.of('DisplayDocTitle'), DisplayDocTitle);
    };
    /**
     * Choose how the PDF reader should display the document upon exiting
     * full-screen mode. This entry is meaningful only if the value of the
     * `PageMode` entry in the document's [[PDFCatalog]] is `FullScreen`.
     *
     * For example:
     * ```js
     * import { PDFDocument, NonFullScreenPageMode, PDFName } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     *
     * // Set the PageMode
     * pdfDoc.catalog.set(PDFName.of('PageMode'),PDFName.of('FullScreen'))
     *
     * // Set what happens when full-screen is closed
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * viewerPrefs.setNonFullScreenPageMode(NonFullScreenPageMode.UseOutlines)
     * ```
     *
     * @param nonFullScreenPageMode How the document should be displayed upon
     *                              exiting full screen mode.
     */
    ViewerPreferences.prototype.setNonFullScreenPageMode = function (nonFullScreenPageMode) {
        utils_1.assertIsOneOf(nonFullScreenPageMode, 'nonFullScreenPageMode', NonFullScreenPageMode);
        var mode = PDFName_1.default.of(nonFullScreenPageMode);
        this.dict.set(PDFName_1.default.of('NonFullScreenPageMode'), mode);
    };
    /**
     * Choose the predominant reading order for text.
     *
     * This entry has no direct effect on the document's contents or page
     * numbering, but may be used to determine the relative positioning of pages
     * when displayed side by side or printed n-up.
     *
     * For example:
     * ```js
     * import { PDFDocument, ReadingDirection } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * viewerPrefs.setReadingDirection(ReadingDirection.R2L)
     * ```
     *
     * @param readingDirection The reading order for text.
     */
    ViewerPreferences.prototype.setReadingDirection = function (readingDirection) {
        utils_1.assertIsOneOf(readingDirection, 'readingDirection', ReadingDirection);
        var direction = PDFName_1.default.of(readingDirection);
        this.dict.set(PDFName_1.default.of('Direction'), direction);
    };
    /**
     * Choose the page scaling option that should be selected when a print dialog
     * is displayed for this document.
     *
     * For example:
     * ```js
     * import { PDFDocument, PrintScaling } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * viewerPrefs.setPrintScaling(PrintScaling.None)
     * ```
     *
     * @param printScaling The print scaling option.
     */
    ViewerPreferences.prototype.setPrintScaling = function (printScaling) {
        utils_1.assertIsOneOf(printScaling, 'printScaling', PrintScaling);
        var scaling = PDFName_1.default.of(printScaling);
        this.dict.set(PDFName_1.default.of('PrintScaling'), scaling);
    };
    /**
     * Choose the paper handling option that should be selected by default in the
     * print dialog.
     *
     * For example:
     * ```js
     * import { PDFDocument, Duplex } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * viewerPrefs.setDuplex(Duplex.DuplexFlipShortEdge)
     * ```
     *
     * @param duplex The double or single sided printing option.
     */
    ViewerPreferences.prototype.setDuplex = function (duplex) {
        utils_1.assertIsOneOf(duplex, 'duplex', Duplex);
        var dup = PDFName_1.default.of(duplex);
        this.dict.set(PDFName_1.default.of('Duplex'), dup);
    };
    /**
     * Choose whether the PDF document's page size should be used to select the
     * input paper tray when printing. This setting influences only the preset
     * values used to populate the print dialog presented by a PDF reader.
     *
     * If PickTrayByPDFSize is true, the check box in the print dialog associated
     * with input paper tray should be checked. This setting has no effect on
     * operating systems that do not provide the ability to pick the input tray
     * by size.
     *
     * @param pickTrayByPDFSize `true` if the document's page size should be used
     *                          to select the input paper tray.
     */
    ViewerPreferences.prototype.setPickTrayByPDFSize = function (pickTrayByPDFSize) {
        var PickTrayByPDFSize = this.dict.context.obj(pickTrayByPDFSize);
        this.dict.set(PDFName_1.default.of('PickTrayByPDFSize'), PickTrayByPDFSize);
    };
    /**
     * Choose the page numbers used to initialize the print dialog box when the
     * file is printed. The first page of the PDF file is denoted by 0.
     *
     * For example:
     * ```js
     * import { PDFDocument } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     *
     * // We can set the default print range to only the first page
     * viewerPrefs.setPrintPageRange({ start: 0, end: 0 })
     *
     * // Or we can supply noncontiguous ranges (e.g. pages 1, 3, and 5-7)
     * viewerPrefs.setPrintPageRange([
     *   { start: 0, end: 0 },
     *   { start: 2, end: 2 },
     *   { start: 4, end: 6 },
     * ])
     * ```
     *
     * @param printPageRange An object or array of objects, each with the
     *                       properties `start` and `end`, denoting a range of
     *                       page indices.
     */
    ViewerPreferences.prototype.setPrintPageRange = function (printPageRange) {
        if (!Array.isArray(printPageRange))
            printPageRange = [printPageRange];
        var flatRange = [];
        for (var idx = 0, len = printPageRange.length; idx < len; idx++) {
            flatRange.push(printPageRange[idx].start);
            flatRange.push(printPageRange[idx].end);
        }
        utils_1.assertEachIs(flatRange, 'printPageRange', ['number']);
        var pageRanges = this.dict.context.obj(flatRange);
        this.dict.set(PDFName_1.default.of('PrintPageRange'), pageRanges);
    };
    /**
     * Choose the default number of copies to be printed when the print dialog is
     * opened for this file.
     * @param numCopies The default number of copies.
     */
    ViewerPreferences.prototype.setNumCopies = function (numCopies) {
        utils_1.assertRange(numCopies, 'numCopies', 1, Number.MAX_VALUE);
        utils_1.assertInteger(numCopies, 'numCopies');
        var NumCopies = this.dict.context.obj(numCopies);
        this.dict.set(PDFName_1.default.of('NumCopies'), NumCopies);
    };
    /** @ignore */
    ViewerPreferences.fromDict = function (dict) {
        return new ViewerPreferences(dict);
    };
    /** @ignore */
    ViewerPreferences.create = function (context) {
        var dict = context.obj({});
        return new ViewerPreferences(dict);
    };
    return ViewerPreferences;
}());
exports.default = ViewerPreferences;
//# sourceMappingURL=ViewerPreferences.js.map
}, function(modId) { var map = {"../objects/PDFArray":1767772065483,"../objects/PDFBool":1767772065486,"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065532, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var acroform_1 = require("../acroform");
var ViewerPreferences_1 = tslib_1.__importDefault(require("../interactive/ViewerPreferences"));
var PDFCatalog = /** @class */ (function (_super) {
    tslib_1.__extends(PDFCatalog, _super);
    function PDFCatalog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFCatalog.prototype.Pages = function () {
        return this.lookup(PDFName_1.default.of('Pages'), PDFDict_1.default);
    };
    PDFCatalog.prototype.AcroForm = function () {
        return this.lookupMaybe(PDFName_1.default.of('AcroForm'), PDFDict_1.default);
    };
    PDFCatalog.prototype.getAcroForm = function () {
        var dict = this.AcroForm();
        if (!dict)
            return undefined;
        return acroform_1.PDFAcroForm.fromDict(dict);
    };
    PDFCatalog.prototype.getOrCreateAcroForm = function () {
        var acroForm = this.getAcroForm();
        if (!acroForm) {
            acroForm = acroform_1.PDFAcroForm.create(this.context);
            var acroFormRef = this.context.register(acroForm.dict);
            this.set(PDFName_1.default.of('AcroForm'), acroFormRef);
        }
        return acroForm;
    };
    PDFCatalog.prototype.ViewerPreferences = function () {
        return this.lookupMaybe(PDFName_1.default.of('ViewerPreferences'), PDFDict_1.default);
    };
    PDFCatalog.prototype.getViewerPreferences = function () {
        var dict = this.ViewerPreferences();
        if (!dict)
            return undefined;
        return ViewerPreferences_1.default.fromDict(dict);
    };
    PDFCatalog.prototype.getOrCreateViewerPreferences = function () {
        var viewerPrefs = this.getViewerPreferences();
        if (!viewerPrefs) {
            viewerPrefs = ViewerPreferences_1.default.create(this.context);
            var viewerPrefsRef = this.context.register(viewerPrefs.dict);
            this.set(PDFName_1.default.of('ViewerPreferences'), viewerPrefsRef);
        }
        return viewerPrefs;
    };
    /**
     * Inserts the given ref as a leaf node of this catalog's page tree at the
     * specified index (zero-based). Also increments the `Count` of each node in
     * the page tree hierarchy to accomodate the new page.
     *
     * Returns the ref of the PDFPageTree node into which `leafRef` was inserted.
     */
    PDFCatalog.prototype.insertLeafNode = function (leafRef, index) {
        var pagesRef = this.get(PDFName_1.default.of('Pages'));
        var maybeParentRef = this.Pages().insertLeafNode(leafRef, index);
        return maybeParentRef || pagesRef;
    };
    PDFCatalog.prototype.removeLeafNode = function (index) {
        this.Pages().removeLeafNode(index);
    };
    PDFCatalog.withContextAndPages = function (context, pages) {
        var dict = new Map();
        dict.set(PDFName_1.default.of('Type'), PDFName_1.default.of('Catalog'));
        dict.set(PDFName_1.default.of('Pages'), pages);
        return new PDFCatalog(dict, context);
    };
    PDFCatalog.fromMapWithContext = function (map, context) {
        return new PDFCatalog(map, context);
    };
    return PDFCatalog;
}(PDFDict_1.default));
exports.default = PDFCatalog;
//# sourceMappingURL=PDFCatalog.js.map
}, function(modId) { var map = {"../objects/PDFDict":1767772065487,"../objects/PDFName":1767772065488,"../acroform":1767772065533,"../interactive/ViewerPreferences":1767772065531}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065533, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFAcroButton_1 = require("./PDFAcroButton");
Object.defineProperty(exports, "PDFAcroButton", { enumerable: true, get: function () { return PDFAcroButton_1.default; } });
var PDFAcroCheckBox_1 = require("./PDFAcroCheckBox");
Object.defineProperty(exports, "PDFAcroCheckBox", { enumerable: true, get: function () { return PDFAcroCheckBox_1.default; } });
var PDFAcroChoice_1 = require("./PDFAcroChoice");
Object.defineProperty(exports, "PDFAcroChoice", { enumerable: true, get: function () { return PDFAcroChoice_1.default; } });
var PDFAcroComboBox_1 = require("./PDFAcroComboBox");
Object.defineProperty(exports, "PDFAcroComboBox", { enumerable: true, get: function () { return PDFAcroComboBox_1.default; } });
var PDFAcroField_1 = require("./PDFAcroField");
Object.defineProperty(exports, "PDFAcroField", { enumerable: true, get: function () { return PDFAcroField_1.default; } });
var PDFAcroForm_1 = require("./PDFAcroForm");
Object.defineProperty(exports, "PDFAcroForm", { enumerable: true, get: function () { return PDFAcroForm_1.default; } });
var PDFAcroListBox_1 = require("./PDFAcroListBox");
Object.defineProperty(exports, "PDFAcroListBox", { enumerable: true, get: function () { return PDFAcroListBox_1.default; } });
var PDFAcroNonTerminal_1 = require("./PDFAcroNonTerminal");
Object.defineProperty(exports, "PDFAcroNonTerminal", { enumerable: true, get: function () { return PDFAcroNonTerminal_1.default; } });
var PDFAcroPushButton_1 = require("./PDFAcroPushButton");
Object.defineProperty(exports, "PDFAcroPushButton", { enumerable: true, get: function () { return PDFAcroPushButton_1.default; } });
var PDFAcroRadioButton_1 = require("./PDFAcroRadioButton");
Object.defineProperty(exports, "PDFAcroRadioButton", { enumerable: true, get: function () { return PDFAcroRadioButton_1.default; } });
var PDFAcroSignature_1 = require("./PDFAcroSignature");
Object.defineProperty(exports, "PDFAcroSignature", { enumerable: true, get: function () { return PDFAcroSignature_1.default; } });
var PDFAcroTerminal_1 = require("./PDFAcroTerminal");
Object.defineProperty(exports, "PDFAcroTerminal", { enumerable: true, get: function () { return PDFAcroTerminal_1.default; } });
var PDFAcroText_1 = require("./PDFAcroText");
Object.defineProperty(exports, "PDFAcroText", { enumerable: true, get: function () { return PDFAcroText_1.default; } });
tslib_1.__exportStar(require("./flags"), exports);
tslib_1.__exportStar(require("./utils"), exports);
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./PDFAcroButton":1767772065534,"./PDFAcroCheckBox":1767772065541,"./PDFAcroChoice":1767772065542,"./PDFAcroComboBox":1767772065544,"./PDFAcroField":1767772065536,"./PDFAcroForm":1767772065545,"./PDFAcroListBox":1767772065552,"./PDFAcroNonTerminal":1767772065546,"./PDFAcroPushButton":1767772065550,"./PDFAcroRadioButton":1767772065551,"./PDFAcroSignature":1767772065548,"./PDFAcroTerminal":1767772065535,"./PDFAcroText":1767772065549,"./flags":1767772065543,"./utils":1767772065547}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065534, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFAcroTerminal_1 = tslib_1.__importDefault(require("./PDFAcroTerminal"));
var errors_1 = require("../errors");
var PDFAcroButton = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroButton, _super);
    function PDFAcroButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroButton.prototype.Opt = function () {
        return this.dict.lookupMaybe(PDFName_1.default.of('Opt'), PDFString_1.default, PDFHexString_1.default, PDFArray_1.default);
    };
    PDFAcroButton.prototype.setOpt = function (opt) {
        this.dict.set(PDFName_1.default.of('Opt'), this.dict.context.obj(opt));
    };
    PDFAcroButton.prototype.getExportValues = function () {
        var opt = this.Opt();
        if (!opt)
            return undefined;
        if (opt instanceof PDFString_1.default || opt instanceof PDFHexString_1.default) {
            return [opt];
        }
        var values = [];
        for (var idx = 0, len = opt.size(); idx < len; idx++) {
            var value = opt.lookup(idx);
            if (value instanceof PDFString_1.default || value instanceof PDFHexString_1.default) {
                values.push(value);
            }
        }
        return values;
    };
    PDFAcroButton.prototype.removeExportValue = function (idx) {
        var opt = this.Opt();
        if (!opt)
            return;
        if (opt instanceof PDFString_1.default || opt instanceof PDFHexString_1.default) {
            if (idx !== 0)
                throw new errors_1.IndexOutOfBoundsError(idx, 0, 0);
            this.setOpt([]);
        }
        else {
            if (idx < 0 || idx > opt.size()) {
                throw new errors_1.IndexOutOfBoundsError(idx, 0, opt.size());
            }
            opt.remove(idx);
        }
    };
    // Enforce use use of /Opt even if it isn't strictly necessary
    PDFAcroButton.prototype.normalizeExportValues = function () {
        var _a, _b, _c, _d;
        var exportValues = (_a = this.getExportValues()) !== null && _a !== void 0 ? _a : [];
        var Opt = [];
        var widgets = this.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var exportVal = (_b = exportValues[idx]) !== null && _b !== void 0 ? _b : PDFHexString_1.default.fromText((_d = (_c = widget.getOnValue()) === null || _c === void 0 ? void 0 : _c.decodeText()) !== null && _d !== void 0 ? _d : '');
            Opt.push(exportVal);
        }
        this.setOpt(Opt);
    };
    /**
     * Reuses existing opt if one exists with the same value (assuming
     * `useExistingIdx` is `true`). Returns index of existing (or new) opt.
     */
    PDFAcroButton.prototype.addOpt = function (opt, useExistingOptIdx) {
        var _a;
        this.normalizeExportValues();
        var optText = opt.decodeText();
        var existingIdx;
        if (useExistingOptIdx) {
            var exportValues = (_a = this.getExportValues()) !== null && _a !== void 0 ? _a : [];
            for (var idx = 0, len = exportValues.length; idx < len; idx++) {
                var exportVal = exportValues[idx];
                if (exportVal.decodeText() === optText)
                    existingIdx = idx;
            }
        }
        var Opt = this.Opt();
        Opt.push(opt);
        return existingIdx !== null && existingIdx !== void 0 ? existingIdx : Opt.size() - 1;
    };
    PDFAcroButton.prototype.addWidgetWithOpt = function (widget, opt, useExistingOptIdx) {
        var optIdx = this.addOpt(opt, useExistingOptIdx);
        var apStateValue = PDFName_1.default.of(String(optIdx));
        this.addWidget(widget);
        return apStateValue;
    };
    return PDFAcroButton;
}(PDFAcroTerminal_1.default));
exports.default = PDFAcroButton;
//# sourceMappingURL=PDFAcroButton.js.map
}, function(modId) { var map = {"../objects/PDFString":1767772065516,"../objects/PDFHexString":1767772065512,"../objects/PDFArray":1767772065483,"../objects/PDFName":1767772065488,"./PDFAcroTerminal":1767772065535,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065535, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFAcroField_1 = tslib_1.__importDefault(require("./PDFAcroField"));
var PDFWidgetAnnotation_1 = tslib_1.__importDefault(require("../annotation/PDFWidgetAnnotation"));
var errors_1 = require("../errors");
var PDFAcroTerminal = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroTerminal, _super);
    function PDFAcroTerminal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroTerminal.prototype.FT = function () {
        var nameOrRef = this.getInheritableAttribute(PDFName_1.default.of('FT'));
        return this.dict.context.lookup(nameOrRef, PDFName_1.default);
    };
    PDFAcroTerminal.prototype.getWidgets = function () {
        var kidDicts = this.Kids();
        // This field is itself a widget
        if (!kidDicts)
            return [PDFWidgetAnnotation_1.default.fromDict(this.dict)];
        // This field's kids are its widgets
        var widgets = new Array(kidDicts.size());
        for (var idx = 0, len = kidDicts.size(); idx < len; idx++) {
            var dict = kidDicts.lookup(idx, PDFDict_1.default);
            widgets[idx] = PDFWidgetAnnotation_1.default.fromDict(dict);
        }
        return widgets;
    };
    PDFAcroTerminal.prototype.addWidget = function (ref) {
        var Kids = this.normalizedEntries().Kids;
        Kids.push(ref);
    };
    PDFAcroTerminal.prototype.removeWidget = function (idx) {
        var kidDicts = this.Kids();
        if (!kidDicts) {
            // This field is itself a widget
            if (idx !== 0)
                throw new errors_1.IndexOutOfBoundsError(idx, 0, 0);
            this.setKids([]);
        }
        else {
            // This field's kids are its widgets
            if (idx < 0 || idx > kidDicts.size()) {
                throw new errors_1.IndexOutOfBoundsError(idx, 0, kidDicts.size());
            }
            kidDicts.remove(idx);
        }
    };
    PDFAcroTerminal.prototype.normalizedEntries = function () {
        var Kids = this.Kids();
        // If this field is itself a widget (because it was only rendered once in
        // the document, so the field and widget properties were merged) then we
        // add itself to the `Kids` array. The alternative would be to try
        // splitting apart the widget properties and creating a separate object
        // for them.
        if (!Kids) {
            Kids = this.dict.context.obj([this.ref]);
            this.dict.set(PDFName_1.default.of('Kids'), Kids);
        }
        return { Kids: Kids };
    };
    PDFAcroTerminal.fromDict = function (dict, ref) {
        return new PDFAcroTerminal(dict, ref);
    };
    return PDFAcroTerminal;
}(PDFAcroField_1.default));
exports.default = PDFAcroTerminal;
//# sourceMappingURL=PDFAcroTerminal.js.map
}, function(modId) { var map = {"../objects/PDFDict":1767772065487,"../objects/PDFName":1767772065488,"./PDFAcroField":1767772065536,"../annotation/PDFWidgetAnnotation":1767772065537,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065536, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var utils_1 = require("../../utils");
var errors_1 = require("../errors");
// Examples:
//   `/Helv 12 Tf` -> ['Helv', '12']
//   `/HeBo 8.00 Tf` -> ['HeBo', '8.00']
//   `/HeBo Tf` -> ['HeBo', undefined]
var tfRegex = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+Tf/;
var PDFAcroField = /** @class */ (function () {
    function PDFAcroField(dict, ref) {
        this.dict = dict;
        this.ref = ref;
    }
    PDFAcroField.prototype.T = function () {
        return this.dict.lookupMaybe(PDFName_1.default.of('T'), PDFString_1.default, PDFHexString_1.default);
    };
    PDFAcroField.prototype.Ff = function () {
        var numberOrRef = this.getInheritableAttribute(PDFName_1.default.of('Ff'));
        return this.dict.context.lookupMaybe(numberOrRef, PDFNumber_1.default);
    };
    PDFAcroField.prototype.V = function () {
        var valueOrRef = this.getInheritableAttribute(PDFName_1.default.of('V'));
        return this.dict.context.lookup(valueOrRef);
    };
    PDFAcroField.prototype.Kids = function () {
        return this.dict.lookupMaybe(PDFName_1.default.of('Kids'), PDFArray_1.default);
    };
    // Parent(): PDFDict | undefined {
    //   return this.dict.lookupMaybe(PDFName.of('Parent'), PDFDict);
    // }
    PDFAcroField.prototype.DA = function () {
        var da = this.dict.lookup(PDFName_1.default.of('DA'));
        if (da instanceof PDFString_1.default || da instanceof PDFHexString_1.default)
            return da;
        return undefined;
    };
    PDFAcroField.prototype.setKids = function (kids) {
        this.dict.set(PDFName_1.default.of('Kids'), this.dict.context.obj(kids));
    };
    PDFAcroField.prototype.getParent = function () {
        // const parent = this.Parent();
        // if (!parent) return undefined;
        // return new PDFAcroField(parent);
        var parentRef = this.dict.get(PDFName_1.default.of('Parent'));
        if (parentRef instanceof PDFRef_1.default) {
            var parent_1 = this.dict.lookup(PDFName_1.default.of('Parent'), PDFDict_1.default);
            return new PDFAcroField(parent_1, parentRef);
        }
        return undefined;
    };
    PDFAcroField.prototype.setParent = function (parent) {
        if (!parent)
            this.dict.delete(PDFName_1.default.of('Parent'));
        else
            this.dict.set(PDFName_1.default.of('Parent'), parent);
    };
    PDFAcroField.prototype.getFullyQualifiedName = function () {
        var parent = this.getParent();
        if (!parent)
            return this.getPartialName();
        return parent.getFullyQualifiedName() + "." + this.getPartialName();
    };
    PDFAcroField.prototype.getPartialName = function () {
        var _a;
        return (_a = this.T()) === null || _a === void 0 ? void 0 : _a.decodeText();
    };
    PDFAcroField.prototype.setPartialName = function (partialName) {
        if (!partialName)
            this.dict.delete(PDFName_1.default.of('T'));
        else
            this.dict.set(PDFName_1.default.of('T'), PDFHexString_1.default.fromText(partialName));
    };
    PDFAcroField.prototype.setDefaultAppearance = function (appearance) {
        this.dict.set(PDFName_1.default.of('DA'), PDFString_1.default.of(appearance));
    };
    PDFAcroField.prototype.getDefaultAppearance = function () {
        var DA = this.DA();
        if (DA instanceof PDFHexString_1.default) {
            return DA.decodeText();
        }
        return DA === null || DA === void 0 ? void 0 : DA.asString();
    };
    PDFAcroField.prototype.setFontSize = function (fontSize) {
        var _a;
        var name = (_a = this.getFullyQualifiedName()) !== null && _a !== void 0 ? _a : '';
        var da = this.getDefaultAppearance();
        if (!da)
            throw new errors_1.MissingDAEntryError(name);
        var daMatch = utils_1.findLastMatch(da, tfRegex);
        if (!daMatch.match)
            throw new errors_1.MissingTfOperatorError(name);
        var daStart = da.slice(0, daMatch.pos - daMatch.match[0].length);
        var daEnd = daMatch.pos <= da.length ? da.slice(daMatch.pos) : '';
        var fontName = daMatch.match[1];
        var modifiedDa = daStart + " /" + fontName + " " + fontSize + " Tf " + daEnd;
        this.setDefaultAppearance(modifiedDa);
    };
    PDFAcroField.prototype.getFlags = function () {
        var _a, _b;
        return (_b = (_a = this.Ff()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 0;
    };
    PDFAcroField.prototype.setFlags = function (flags) {
        this.dict.set(PDFName_1.default.of('Ff'), PDFNumber_1.default.of(flags));
    };
    PDFAcroField.prototype.hasFlag = function (flag) {
        var flags = this.getFlags();
        return (flags & flag) !== 0;
    };
    PDFAcroField.prototype.setFlag = function (flag) {
        var flags = this.getFlags();
        this.setFlags(flags | flag);
    };
    PDFAcroField.prototype.clearFlag = function (flag) {
        var flags = this.getFlags();
        this.setFlags(flags & ~flag);
    };
    PDFAcroField.prototype.setFlagTo = function (flag, enable) {
        if (enable)
            this.setFlag(flag);
        else
            this.clearFlag(flag);
    };
    PDFAcroField.prototype.getInheritableAttribute = function (name) {
        var attribute;
        this.ascend(function (node) {
            if (!attribute)
                attribute = node.dict.get(name);
        });
        return attribute;
    };
    PDFAcroField.prototype.ascend = function (visitor) {
        visitor(this);
        var parent = this.getParent();
        if (parent)
            parent.ascend(visitor);
    };
    return PDFAcroField;
}());
exports.default = PDFAcroField;
//# sourceMappingURL=PDFAcroField.js.map
}, function(modId) { var map = {"../objects/PDFDict":1767772065487,"../objects/PDFString":1767772065516,"../objects/PDFHexString":1767772065512,"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"../objects/PDFArray":1767772065483,"../objects/PDFRef":1767772065495,"../../utils":1767772065468,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065537, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var BorderStyle_1 = tslib_1.__importDefault(require("./BorderStyle"));
var PDFAnnotation_1 = tslib_1.__importDefault(require("./PDFAnnotation"));
var AppearanceCharacteristics_1 = tslib_1.__importDefault(require("./AppearanceCharacteristics"));
var PDFWidgetAnnotation = /** @class */ (function (_super) {
    tslib_1.__extends(PDFWidgetAnnotation, _super);
    function PDFWidgetAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFWidgetAnnotation.prototype.MK = function () {
        var MK = this.dict.lookup(PDFName_1.default.of('MK'));
        if (MK instanceof PDFDict_1.default)
            return MK;
        return undefined;
    };
    PDFWidgetAnnotation.prototype.BS = function () {
        var BS = this.dict.lookup(PDFName_1.default.of('BS'));
        if (BS instanceof PDFDict_1.default)
            return BS;
        return undefined;
    };
    PDFWidgetAnnotation.prototype.DA = function () {
        var da = this.dict.lookup(PDFName_1.default.of('DA'));
        if (da instanceof PDFString_1.default || da instanceof PDFHexString_1.default)
            return da;
        return undefined;
    };
    PDFWidgetAnnotation.prototype.P = function () {
        var P = this.dict.get(PDFName_1.default.of('P'));
        if (P instanceof PDFRef_1.default)
            return P;
        return undefined;
    };
    PDFWidgetAnnotation.prototype.setP = function (page) {
        this.dict.set(PDFName_1.default.of('P'), page);
    };
    PDFWidgetAnnotation.prototype.setDefaultAppearance = function (appearance) {
        this.dict.set(PDFName_1.default.of('DA'), PDFString_1.default.of(appearance));
    };
    PDFWidgetAnnotation.prototype.getDefaultAppearance = function () {
        var DA = this.DA();
        if (DA instanceof PDFHexString_1.default) {
            return DA.decodeText();
        }
        return DA === null || DA === void 0 ? void 0 : DA.asString();
    };
    PDFWidgetAnnotation.prototype.getAppearanceCharacteristics = function () {
        var MK = this.MK();
        if (MK)
            return AppearanceCharacteristics_1.default.fromDict(MK);
        return undefined;
    };
    PDFWidgetAnnotation.prototype.getOrCreateAppearanceCharacteristics = function () {
        var MK = this.MK();
        if (MK)
            return AppearanceCharacteristics_1.default.fromDict(MK);
        var ac = AppearanceCharacteristics_1.default.fromDict(this.dict.context.obj({}));
        this.dict.set(PDFName_1.default.of('MK'), ac.dict);
        return ac;
    };
    PDFWidgetAnnotation.prototype.getBorderStyle = function () {
        var BS = this.BS();
        if (BS)
            return BorderStyle_1.default.fromDict(BS);
        return undefined;
    };
    PDFWidgetAnnotation.prototype.getOrCreateBorderStyle = function () {
        var BS = this.BS();
        if (BS)
            return BorderStyle_1.default.fromDict(BS);
        var bs = BorderStyle_1.default.fromDict(this.dict.context.obj({}));
        this.dict.set(PDFName_1.default.of('BS'), bs.dict);
        return bs;
    };
    PDFWidgetAnnotation.prototype.getOnValue = function () {
        var _a;
        var normal = (_a = this.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal;
        if (normal instanceof PDFDict_1.default) {
            var keys = normal.keys();
            for (var idx = 0, len = keys.length; idx < len; idx++) {
                var key = keys[idx];
                if (key !== PDFName_1.default.of('Off'))
                    return key;
            }
        }
        return undefined;
    };
    PDFWidgetAnnotation.fromDict = function (dict) {
        return new PDFWidgetAnnotation(dict);
    };
    PDFWidgetAnnotation.create = function (context, parent) {
        var dict = context.obj({
            Type: 'Annot',
            Subtype: 'Widget',
            Rect: [0, 0, 0, 0],
            Parent: parent,
        });
        return new PDFWidgetAnnotation(dict);
    };
    return PDFWidgetAnnotation;
}(PDFAnnotation_1.default));
exports.default = PDFWidgetAnnotation;
//# sourceMappingURL=PDFWidgetAnnotation.js.map
}, function(modId) { var map = {"../objects/PDFDict":1767772065487,"../objects/PDFName":1767772065488,"../objects/PDFRef":1767772065495,"../objects/PDFString":1767772065516,"../objects/PDFHexString":1767772065512,"./BorderStyle":1767772065538,"./PDFAnnotation":1767772065539,"./AppearanceCharacteristics":1767772065540}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065538, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
// TODO: Also handle the `/S` and `/D` entries
var BorderStyle = /** @class */ (function () {
    function BorderStyle(dict) {
        this.dict = dict;
    }
    BorderStyle.prototype.W = function () {
        var W = this.dict.lookup(PDFName_1.default.of('W'));
        if (W instanceof PDFNumber_1.default)
            return W;
        return undefined;
    };
    BorderStyle.prototype.getWidth = function () {
        var _a, _b;
        return (_b = (_a = this.W()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 1;
    };
    BorderStyle.prototype.setWidth = function (width) {
        var W = this.dict.context.obj(width);
        this.dict.set(PDFName_1.default.of('W'), W);
    };
    BorderStyle.fromDict = function (dict) { return new BorderStyle(dict); };
    return BorderStyle;
}());
exports.default = BorderStyle;
//# sourceMappingURL=BorderStyle.js.map
}, function(modId) { var map = {"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065539, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFStream_1 = tslib_1.__importDefault(require("../objects/PDFStream"));
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFAnnotation = /** @class */ (function () {
    function PDFAnnotation(dict) {
        this.dict = dict;
    }
    // This is technically required by the PDF spec
    PDFAnnotation.prototype.Rect = function () {
        return this.dict.lookup(PDFName_1.default.of('Rect'), PDFArray_1.default);
    };
    PDFAnnotation.prototype.AP = function () {
        return this.dict.lookupMaybe(PDFName_1.default.of('AP'), PDFDict_1.default);
    };
    PDFAnnotation.prototype.F = function () {
        var numberOrRef = this.dict.lookup(PDFName_1.default.of('F'));
        return this.dict.context.lookupMaybe(numberOrRef, PDFNumber_1.default);
    };
    PDFAnnotation.prototype.getRectangle = function () {
        var _a;
        var Rect = this.Rect();
        return (_a = Rect === null || Rect === void 0 ? void 0 : Rect.asRectangle()) !== null && _a !== void 0 ? _a : { x: 0, y: 0, width: 0, height: 0 };
    };
    PDFAnnotation.prototype.setRectangle = function (rect) {
        var x = rect.x, y = rect.y, width = rect.width, height = rect.height;
        var Rect = this.dict.context.obj([x, y, x + width, y + height]);
        this.dict.set(PDFName_1.default.of('Rect'), Rect);
    };
    PDFAnnotation.prototype.getAppearanceState = function () {
        var AS = this.dict.lookup(PDFName_1.default.of('AS'));
        if (AS instanceof PDFName_1.default)
            return AS;
        return undefined;
    };
    PDFAnnotation.prototype.setAppearanceState = function (state) {
        this.dict.set(PDFName_1.default.of('AS'), state);
    };
    PDFAnnotation.prototype.setAppearances = function (appearances) {
        this.dict.set(PDFName_1.default.of('AP'), appearances);
    };
    PDFAnnotation.prototype.ensureAP = function () {
        var AP = this.AP();
        if (!AP) {
            AP = this.dict.context.obj({});
            this.dict.set(PDFName_1.default.of('AP'), AP);
        }
        return AP;
    };
    PDFAnnotation.prototype.getNormalAppearance = function () {
        var AP = this.ensureAP();
        var N = AP.get(PDFName_1.default.of('N'));
        if (N instanceof PDFRef_1.default || N instanceof PDFDict_1.default)
            return N;
        throw new Error("Unexpected N type: " + (N === null || N === void 0 ? void 0 : N.constructor.name));
    };
    /** @param appearance A PDFDict or PDFStream (direct or ref) */
    PDFAnnotation.prototype.setNormalAppearance = function (appearance) {
        var AP = this.ensureAP();
        AP.set(PDFName_1.default.of('N'), appearance);
    };
    /** @param appearance A PDFDict or PDFStream (direct or ref) */
    PDFAnnotation.prototype.setRolloverAppearance = function (appearance) {
        var AP = this.ensureAP();
        AP.set(PDFName_1.default.of('R'), appearance);
    };
    /** @param appearance A PDFDict or PDFStream (direct or ref) */
    PDFAnnotation.prototype.setDownAppearance = function (appearance) {
        var AP = this.ensureAP();
        AP.set(PDFName_1.default.of('D'), appearance);
    };
    PDFAnnotation.prototype.removeRolloverAppearance = function () {
        var AP = this.AP();
        AP === null || AP === void 0 ? void 0 : AP.delete(PDFName_1.default.of('R'));
    };
    PDFAnnotation.prototype.removeDownAppearance = function () {
        var AP = this.AP();
        AP === null || AP === void 0 ? void 0 : AP.delete(PDFName_1.default.of('D'));
    };
    PDFAnnotation.prototype.getAppearances = function () {
        var AP = this.AP();
        if (!AP)
            return undefined;
        var N = AP.lookup(PDFName_1.default.of('N'), PDFDict_1.default, PDFStream_1.default);
        var R = AP.lookupMaybe(PDFName_1.default.of('R'), PDFDict_1.default, PDFStream_1.default);
        var D = AP.lookupMaybe(PDFName_1.default.of('D'), PDFDict_1.default, PDFStream_1.default);
        return { normal: N, rollover: R, down: D };
    };
    PDFAnnotation.prototype.getFlags = function () {
        var _a, _b;
        return (_b = (_a = this.F()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 0;
    };
    PDFAnnotation.prototype.setFlags = function (flags) {
        this.dict.set(PDFName_1.default.of('F'), PDFNumber_1.default.of(flags));
    };
    PDFAnnotation.prototype.hasFlag = function (flag) {
        var flags = this.getFlags();
        return (flags & flag) !== 0;
    };
    PDFAnnotation.prototype.setFlag = function (flag) {
        var flags = this.getFlags();
        this.setFlags(flags | flag);
    };
    PDFAnnotation.prototype.clearFlag = function (flag) {
        var flags = this.getFlags();
        this.setFlags(flags & ~flag);
    };
    PDFAnnotation.prototype.setFlagTo = function (flag, enable) {
        if (enable)
            this.setFlag(flag);
        else
            this.clearFlag(flag);
    };
    PDFAnnotation.fromDict = function (dict) { return new PDFAnnotation(dict); };
    return PDFAnnotation;
}());
exports.default = PDFAnnotation;
//# sourceMappingURL=PDFAnnotation.js.map
}, function(modId) { var map = {"../objects/PDFDict":1767772065487,"../objects/PDFName":1767772065488,"../objects/PDFStream":1767772065494,"../objects/PDFArray":1767772065483,"../objects/PDFRef":1767772065495,"../objects/PDFNumber":1767772065484}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065540, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var AppearanceCharacteristics = /** @class */ (function () {
    function AppearanceCharacteristics(dict) {
        this.dict = dict;
    }
    AppearanceCharacteristics.prototype.R = function () {
        var R = this.dict.lookup(PDFName_1.default.of('R'));
        if (R instanceof PDFNumber_1.default)
            return R;
        return undefined;
    };
    AppearanceCharacteristics.prototype.BC = function () {
        var BC = this.dict.lookup(PDFName_1.default.of('BC'));
        if (BC instanceof PDFArray_1.default)
            return BC;
        return undefined;
    };
    AppearanceCharacteristics.prototype.BG = function () {
        var BG = this.dict.lookup(PDFName_1.default.of('BG'));
        if (BG instanceof PDFArray_1.default)
            return BG;
        return undefined;
    };
    AppearanceCharacteristics.prototype.CA = function () {
        var CA = this.dict.lookup(PDFName_1.default.of('CA'));
        if (CA instanceof PDFHexString_1.default || CA instanceof PDFString_1.default)
            return CA;
        return undefined;
    };
    AppearanceCharacteristics.prototype.RC = function () {
        var RC = this.dict.lookup(PDFName_1.default.of('RC'));
        if (RC instanceof PDFHexString_1.default || RC instanceof PDFString_1.default)
            return RC;
        return undefined;
    };
    AppearanceCharacteristics.prototype.AC = function () {
        var AC = this.dict.lookup(PDFName_1.default.of('AC'));
        if (AC instanceof PDFHexString_1.default || AC instanceof PDFString_1.default)
            return AC;
        return undefined;
    };
    AppearanceCharacteristics.prototype.getRotation = function () {
        var _a;
        return (_a = this.R()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    AppearanceCharacteristics.prototype.getBorderColor = function () {
        var BC = this.BC();
        if (!BC)
            return undefined;
        var components = [];
        for (var idx = 0, len = BC === null || BC === void 0 ? void 0 : BC.size(); idx < len; idx++) {
            var component = BC.get(idx);
            if (component instanceof PDFNumber_1.default)
                components.push(component.asNumber());
        }
        return components;
    };
    AppearanceCharacteristics.prototype.getBackgroundColor = function () {
        var BG = this.BG();
        if (!BG)
            return undefined;
        var components = [];
        for (var idx = 0, len = BG === null || BG === void 0 ? void 0 : BG.size(); idx < len; idx++) {
            var component = BG.get(idx);
            if (component instanceof PDFNumber_1.default)
                components.push(component.asNumber());
        }
        return components;
    };
    AppearanceCharacteristics.prototype.getCaptions = function () {
        var CA = this.CA();
        var RC = this.RC();
        var AC = this.AC();
        return {
            normal: CA === null || CA === void 0 ? void 0 : CA.decodeText(),
            rollover: RC === null || RC === void 0 ? void 0 : RC.decodeText(),
            down: AC === null || AC === void 0 ? void 0 : AC.decodeText(),
        };
    };
    AppearanceCharacteristics.prototype.setRotation = function (rotation) {
        var R = this.dict.context.obj(rotation);
        this.dict.set(PDFName_1.default.of('R'), R);
    };
    AppearanceCharacteristics.prototype.setBorderColor = function (color) {
        var BC = this.dict.context.obj(color);
        this.dict.set(PDFName_1.default.of('BC'), BC);
    };
    AppearanceCharacteristics.prototype.setBackgroundColor = function (color) {
        var BG = this.dict.context.obj(color);
        this.dict.set(PDFName_1.default.of('BG'), BG);
    };
    AppearanceCharacteristics.prototype.setCaptions = function (captions) {
        var CA = PDFHexString_1.default.fromText(captions.normal);
        this.dict.set(PDFName_1.default.of('CA'), CA);
        if (captions.rollover) {
            var RC = PDFHexString_1.default.fromText(captions.rollover);
            this.dict.set(PDFName_1.default.of('RC'), RC);
        }
        else {
            this.dict.delete(PDFName_1.default.of('RC'));
        }
        if (captions.down) {
            var AC = PDFHexString_1.default.fromText(captions.down);
            this.dict.set(PDFName_1.default.of('AC'), AC);
        }
        else {
            this.dict.delete(PDFName_1.default.of('AC'));
        }
    };
    AppearanceCharacteristics.fromDict = function (dict) {
        return new AppearanceCharacteristics(dict);
    };
    return AppearanceCharacteristics;
}());
exports.default = AppearanceCharacteristics;
//# sourceMappingURL=AppearanceCharacteristics.js.map
}, function(modId) { var map = {"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"../objects/PDFArray":1767772065483,"../objects/PDFHexString":1767772065512,"../objects/PDFString":1767772065516}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065541, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFAcroButton_1 = tslib_1.__importDefault(require("./PDFAcroButton"));
var errors_1 = require("../errors");
var PDFAcroCheckBox = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroCheckBox, _super);
    function PDFAcroCheckBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroCheckBox.prototype.setValue = function (value) {
        var _a;
        var onValue = (_a = this.getOnValue()) !== null && _a !== void 0 ? _a : PDFName_1.default.of('Yes');
        if (value !== onValue && value !== PDFName_1.default.of('Off')) {
            throw new errors_1.InvalidAcroFieldValueError();
        }
        this.dict.set(PDFName_1.default.of('V'), value);
        var widgets = this.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var state = widget.getOnValue() === value ? value : PDFName_1.default.of('Off');
            widget.setAppearanceState(state);
        }
    };
    PDFAcroCheckBox.prototype.getValue = function () {
        var v = this.V();
        if (v instanceof PDFName_1.default)
            return v;
        return PDFName_1.default.of('Off');
    };
    PDFAcroCheckBox.prototype.getOnValue = function () {
        var widget = this.getWidgets()[0];
        return widget === null || widget === void 0 ? void 0 : widget.getOnValue();
    };
    PDFAcroCheckBox.fromDict = function (dict, ref) {
        return new PDFAcroCheckBox(dict, ref);
    };
    PDFAcroCheckBox.create = function (context) {
        var dict = context.obj({
            FT: 'Btn',
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroCheckBox(dict, ref);
    };
    return PDFAcroCheckBox;
}(PDFAcroButton_1.default));
exports.default = PDFAcroCheckBox;
//# sourceMappingURL=PDFAcroCheckBox.js.map
}, function(modId) { var map = {"../objects/PDFName":1767772065488,"./PDFAcroButton":1767772065534,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065542, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFAcroTerminal_1 = tslib_1.__importDefault(require("./PDFAcroTerminal"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var flags_1 = require("./flags");
var errors_1 = require("../errors");
var PDFAcroChoice = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroChoice, _super);
    function PDFAcroChoice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroChoice.prototype.setValues = function (values) {
        if (this.hasFlag(flags_1.AcroChoiceFlags.Combo) &&
            !this.hasFlag(flags_1.AcroChoiceFlags.Edit) &&
            !this.valuesAreValid(values)) {
            throw new errors_1.InvalidAcroFieldValueError();
        }
        if (values.length === 0) {
            this.dict.delete(PDFName_1.default.of('V'));
        }
        if (values.length === 1) {
            this.dict.set(PDFName_1.default.of('V'), values[0]);
        }
        if (values.length > 1) {
            if (!this.hasFlag(flags_1.AcroChoiceFlags.MultiSelect)) {
                throw new errors_1.MultiSelectValueError();
            }
            this.dict.set(PDFName_1.default.of('V'), this.dict.context.obj(values));
        }
        this.updateSelectedIndices(values);
    };
    PDFAcroChoice.prototype.valuesAreValid = function (values) {
        var options = this.getOptions();
        var _loop_1 = function (idx, len) {
            var val = values[idx].decodeText();
            if (!options.find(function (o) { return val === (o.display || o.value).decodeText(); })) {
                return { value: false };
            }
        };
        for (var idx = 0, len = values.length; idx < len; idx++) {
            var state_1 = _loop_1(idx, len);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return true;
    };
    PDFAcroChoice.prototype.updateSelectedIndices = function (values) {
        if (values.length > 1) {
            var indices = new Array(values.length);
            var options = this.getOptions();
            var _loop_2 = function (idx, len) {
                var val = values[idx].decodeText();
                indices[idx] = options.findIndex(function (o) { return val === (o.display || o.value).decodeText(); });
            };
            for (var idx = 0, len = values.length; idx < len; idx++) {
                _loop_2(idx, len);
            }
            this.dict.set(PDFName_1.default.of('I'), this.dict.context.obj(indices.sort()));
        }
        else {
            this.dict.delete(PDFName_1.default.of('I'));
        }
    };
    PDFAcroChoice.prototype.getValues = function () {
        var v = this.V();
        if (v instanceof PDFString_1.default || v instanceof PDFHexString_1.default)
            return [v];
        if (v instanceof PDFArray_1.default) {
            var values = [];
            for (var idx = 0, len = v.size(); idx < len; idx++) {
                var value = v.lookup(idx);
                if (value instanceof PDFString_1.default || value instanceof PDFHexString_1.default) {
                    values.push(value);
                }
            }
            return values;
        }
        return [];
    };
    PDFAcroChoice.prototype.Opt = function () {
        return this.dict.lookupMaybe(PDFName_1.default.of('Opt'), PDFString_1.default, PDFHexString_1.default, PDFArray_1.default);
    };
    PDFAcroChoice.prototype.setOptions = function (options) {
        var newOpt = new Array(options.length);
        for (var idx = 0, len = options.length; idx < len; idx++) {
            var _a = options[idx], value = _a.value, display = _a.display;
            newOpt[idx] = this.dict.context.obj([value, display || value]);
        }
        this.dict.set(PDFName_1.default.of('Opt'), this.dict.context.obj(newOpt));
    };
    PDFAcroChoice.prototype.getOptions = function () {
        var Opt = this.Opt();
        // Not supposed to happen - Opt _should_ always be `PDFArray | undefined`
        if (Opt instanceof PDFString_1.default || Opt instanceof PDFHexString_1.default) {
            return [{ value: Opt, display: Opt }];
        }
        if (Opt instanceof PDFArray_1.default) {
            var res = [];
            for (var idx = 0, len = Opt.size(); idx < len; idx++) {
                var item = Opt.lookup(idx);
                // If `item` is a string, use that as both the export and text value
                if (item instanceof PDFString_1.default || item instanceof PDFHexString_1.default) {
                    res.push({ value: item, display: item });
                }
                // If `item` is an array of one, treat it the same as just a string,
                // if it's an array of two then `item[0]` is the export value and
                // `item[1]` is the text value
                if (item instanceof PDFArray_1.default) {
                    if (item.size() > 0) {
                        var first = item.lookup(0, PDFString_1.default, PDFHexString_1.default);
                        var second = item.lookupMaybe(1, PDFString_1.default, PDFHexString_1.default);
                        res.push({ value: first, display: second || first });
                    }
                }
            }
            return res;
        }
        return [];
    };
    return PDFAcroChoice;
}(PDFAcroTerminal_1.default));
exports.default = PDFAcroChoice;
//# sourceMappingURL=PDFAcroChoice.js.map
}, function(modId) { var map = {"./PDFAcroTerminal":1767772065535,"../objects/PDFHexString":1767772065512,"../objects/PDFString":1767772065516,"../objects/PDFArray":1767772065483,"../objects/PDFName":1767772065488,"./flags":1767772065543,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065543, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.AcroChoiceFlags = exports.AcroTextFlags = exports.AcroButtonFlags = exports.AcroFieldFlags = void 0;
var flag = function (bitIndex) { return 1 << bitIndex; };
/** From PDF spec table 221 */
var AcroFieldFlags;
(function (AcroFieldFlags) {
    /**
     * If set, the user may not change the value of the field. Any associated
     * widget annotations will not interact with the user; that is, they will not
     * respond to mouse clicks or change their appearance in response to mouse
     * motions. This flag is useful for fields whose values are computed or
     * imported from a database.
     */
    AcroFieldFlags[AcroFieldFlags["ReadOnly"] = flag(1 - 1)] = "ReadOnly";
    /**
     * If set, the field shall have a value at the time it is exported by a
     * submit-form action (see 12.7.5.2, "Submit-Form Action").
     */
    AcroFieldFlags[AcroFieldFlags["Required"] = flag(2 - 1)] = "Required";
    /**
     * If set, the field shall not be exported by a submit-form action
     * (see 12.7.5.2, "Submit-Form Action").
     */
    AcroFieldFlags[AcroFieldFlags["NoExport"] = flag(3 - 1)] = "NoExport";
})(AcroFieldFlags = exports.AcroFieldFlags || (exports.AcroFieldFlags = {}));
/** From PDF spec table 226 */
var AcroButtonFlags;
(function (AcroButtonFlags) {
    /**
     * (Radio buttons only) If set, exactly one radio button shall be selected at
     * all times; selecting the currently selected button has no effect. If clear,
     * clicking the selected button deselects it, leaving no button selected.
     */
    AcroButtonFlags[AcroButtonFlags["NoToggleToOff"] = flag(15 - 1)] = "NoToggleToOff";
    /**
     * If set, the field is a set of radio buttons; if clear, the field is a check
     * box. This flag may be set only if the Pushbutton flag is clear.
     */
    AcroButtonFlags[AcroButtonFlags["Radio"] = flag(16 - 1)] = "Radio";
    /**
     * If set, the field is a pushbutton that does not retain a permanent value.
     */
    AcroButtonFlags[AcroButtonFlags["PushButton"] = flag(17 - 1)] = "PushButton";
    /**
     * If set, a group of radio buttons within a radio button field that use the
     * same value for the on state will turn on and off in unison; that is if one
     * is checked, they are all checked. If clear, the buttons are mutually
     * exclusive (the same behavior as HTML radio buttons).
     */
    AcroButtonFlags[AcroButtonFlags["RadiosInUnison"] = flag(26 - 1)] = "RadiosInUnison";
})(AcroButtonFlags = exports.AcroButtonFlags || (exports.AcroButtonFlags = {}));
/** From PDF spec table 228 */
var AcroTextFlags;
(function (AcroTextFlags) {
    /**
     * If set, the field may contain multiple lines of text; if clear, the field's
     * text shall be restricted to a single line.
     */
    AcroTextFlags[AcroTextFlags["Multiline"] = flag(13 - 1)] = "Multiline";
    /**
     * If set, the field is intended for entering a secure password that should
     * not be echoed visibly to the screen. Characters typed from the keyboard
     * shall instead be echoed in some unreadable form, such as asterisks or
     * bullet characters.
     * > NOTE   To protect password confidentiality, readers should never store
     * >        the value of the text field in the PDF file if this flag is set.
     */
    AcroTextFlags[AcroTextFlags["Password"] = flag(14 - 1)] = "Password";
    /**
     * If set, the text entered in the field represents the pathname of a file
     * whose contents shall be submitted as the value of the field.
     */
    AcroTextFlags[AcroTextFlags["FileSelect"] = flag(21 - 1)] = "FileSelect";
    /**
     * If set, text entered in the field shall not be spell-checked.
     */
    AcroTextFlags[AcroTextFlags["DoNotSpellCheck"] = flag(23 - 1)] = "DoNotSpellCheck";
    /**
     * If set, the field shall not scroll (horizontally for single-line fields,
     * vertically for multiple-line fields) to accommodate more text than fits
     * within its annotation rectangle. Once the field is full, no further text
     * shall be accepted for interactive form filling; for non-interactive form
     * filling, the filler should take care not to add more character than will
     * visibly fit in the defined area.
     */
    AcroTextFlags[AcroTextFlags["DoNotScroll"] = flag(24 - 1)] = "DoNotScroll";
    /**
     * May be set only if the MaxLen entry is present in the text field dictionary
     * (see Table 229) and if the Multiline, Password, and FileSelect flags are
     * clear. If set, the field shall be automatically divided into as many
     * equally spaced positions, or combs, as the value of MaxLen, and the text
     * is laid out into those combs.
     */
    AcroTextFlags[AcroTextFlags["Comb"] = flag(25 - 1)] = "Comb";
    /**
     * If set, the value of this field shall be a rich text string
     * (see 12.7.3.4, "Rich Text Strings"). If the field has a value, the RV
     * entry of the field dictionary (Table 222) shall specify the rich text
     * string.
     */
    AcroTextFlags[AcroTextFlags["RichText"] = flag(26 - 1)] = "RichText";
})(AcroTextFlags = exports.AcroTextFlags || (exports.AcroTextFlags = {}));
/** From PDF spec table 230 */
var AcroChoiceFlags;
(function (AcroChoiceFlags) {
    /**
     * If set, the field is a combo box; if clear, the field is a list box.
     */
    AcroChoiceFlags[AcroChoiceFlags["Combo"] = flag(18 - 1)] = "Combo";
    /**
     * If set, the combo box shall include an editable text box as well as a
     * drop-down list; if clear, it shall include only a drop-down list. This
     * flag shall be used only if the Combo flag is set.
     */
    AcroChoiceFlags[AcroChoiceFlags["Edit"] = flag(19 - 1)] = "Edit";
    /**
     * If set, the field's option items shall be sorted alphabetically. This flag
     * is intended for use by writers, not by readers. Conforming readers shall
     * display the options in the order in which they occur in the Opt array
     * (see Table 231).
     */
    AcroChoiceFlags[AcroChoiceFlags["Sort"] = flag(20 - 1)] = "Sort";
    /**
     * If set, more than one of the field's option items may be selected
     * simultaneously; if clear, at most one item shall be selected.
     */
    AcroChoiceFlags[AcroChoiceFlags["MultiSelect"] = flag(22 - 1)] = "MultiSelect";
    /**
     * If set, text entered in the field shall not be spell-checked. This flag
     * shall not be used unless the Combo and Edit flags are both set.
     */
    AcroChoiceFlags[AcroChoiceFlags["DoNotSpellCheck"] = flag(23 - 1)] = "DoNotSpellCheck";
    /**
     * If set, the new value shall be committed as soon as a selection is made
     * (commonly with the pointing device). In this case, supplying a value for
     * a field involves three actions: selecting the field for fill-in,
     * selecting a choice for the fill-in value, and leaving that field, which
     * finalizes or "commits" the data choice and triggers any actions associated
     * with the entry or changing of this data. If this flag is on, then
     * processing does not wait for leaving the field action to occur, but
     * immediately proceeds to the third step.
     *
     * This option enables applications to perform an action once a selection is
     * made, without requiring the user to exit the field. If clear, the new
     * value is not committed until the user exits the field.
     */
    AcroChoiceFlags[AcroChoiceFlags["CommitOnSelChange"] = flag(27 - 1)] = "CommitOnSelChange";
})(AcroChoiceFlags = exports.AcroChoiceFlags || (exports.AcroChoiceFlags = {}));
//# sourceMappingURL=flags.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065544, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFAcroChoice_1 = tslib_1.__importDefault(require("./PDFAcroChoice"));
var flags_1 = require("./flags");
var PDFAcroComboBox = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroComboBox, _super);
    function PDFAcroComboBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroComboBox.fromDict = function (dict, ref) {
        return new PDFAcroComboBox(dict, ref);
    };
    PDFAcroComboBox.create = function (context) {
        var dict = context.obj({
            FT: 'Ch',
            Ff: flags_1.AcroChoiceFlags.Combo,
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroComboBox(dict, ref);
    };
    return PDFAcroComboBox;
}(PDFAcroChoice_1.default));
exports.default = PDFAcroComboBox;
//# sourceMappingURL=PDFAcroComboBox.js.map
}, function(modId) { var map = {"./PDFAcroChoice":1767772065542,"./flags":1767772065543}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065545, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFAcroNonTerminal_1 = tslib_1.__importDefault(require("./PDFAcroNonTerminal"));
var utils_1 = require("./utils");
var PDFAcroForm = /** @class */ (function () {
    function PDFAcroForm(dict) {
        this.dict = dict;
    }
    PDFAcroForm.prototype.Fields = function () {
        var fields = this.dict.lookup(PDFName_1.default.of('Fields'));
        if (fields instanceof PDFArray_1.default)
            return fields;
        return undefined;
    };
    PDFAcroForm.prototype.getFields = function () {
        var Fields = this.normalizedEntries().Fields;
        var fields = new Array(Fields.size());
        for (var idx = 0, len = Fields.size(); idx < len; idx++) {
            var ref = Fields.get(idx);
            var dict = Fields.lookup(idx, PDFDict_1.default);
            fields[idx] = [utils_1.createPDFAcroField(dict, ref), ref];
        }
        return fields;
    };
    PDFAcroForm.prototype.getAllFields = function () {
        var allFields = [];
        var pushFields = function (fields) {
            if (!fields)
                return;
            for (var idx = 0, len = fields.length; idx < len; idx++) {
                var field = fields[idx];
                allFields.push(field);
                var fieldModel = field[0];
                if (fieldModel instanceof PDFAcroNonTerminal_1.default) {
                    pushFields(utils_1.createPDFAcroFields(fieldModel.Kids()));
                }
            }
        };
        pushFields(this.getFields());
        return allFields;
    };
    PDFAcroForm.prototype.addField = function (field) {
        var Fields = this.normalizedEntries().Fields;
        Fields === null || Fields === void 0 ? void 0 : Fields.push(field);
    };
    PDFAcroForm.prototype.removeField = function (field) {
        var parent = field.getParent();
        var fields = parent === undefined ? this.normalizedEntries().Fields : parent.Kids();
        var index = fields === null || fields === void 0 ? void 0 : fields.indexOf(field.ref);
        if (fields === undefined || index === undefined) {
            throw new Error("Tried to remove inexistent field " + field.getFullyQualifiedName());
        }
        fields.remove(index);
        if (parent !== undefined && fields.size() === 0) {
            this.removeField(parent);
        }
    };
    PDFAcroForm.prototype.normalizedEntries = function () {
        var Fields = this.Fields();
        if (!Fields) {
            Fields = this.dict.context.obj([]);
            this.dict.set(PDFName_1.default.of('Fields'), Fields);
        }
        return { Fields: Fields };
    };
    PDFAcroForm.fromDict = function (dict) { return new PDFAcroForm(dict); };
    PDFAcroForm.create = function (context) {
        var dict = context.obj({ Fields: [] });
        return new PDFAcroForm(dict);
    };
    return PDFAcroForm;
}());
exports.default = PDFAcroForm;
//# sourceMappingURL=PDFAcroForm.js.map
}, function(modId) { var map = {"../objects/PDFDict":1767772065487,"../objects/PDFArray":1767772065483,"../objects/PDFName":1767772065488,"./PDFAcroNonTerminal":1767772065546,"./utils":1767772065547}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065546, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFAcroField_1 = tslib_1.__importDefault(require("./PDFAcroField"));
var PDFAcroNonTerminal = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroNonTerminal, _super);
    function PDFAcroNonTerminal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroNonTerminal.prototype.addField = function (field) {
        var Kids = this.normalizedEntries().Kids;
        Kids === null || Kids === void 0 ? void 0 : Kids.push(field);
    };
    PDFAcroNonTerminal.prototype.normalizedEntries = function () {
        var Kids = this.Kids();
        if (!Kids) {
            Kids = this.dict.context.obj([]);
            this.dict.set(PDFName_1.default.of('Kids'), Kids);
        }
        return { Kids: Kids };
    };
    PDFAcroNonTerminal.fromDict = function (dict, ref) {
        return new PDFAcroNonTerminal(dict, ref);
    };
    PDFAcroNonTerminal.create = function (context) {
        var dict = context.obj({});
        var ref = context.register(dict);
        return new PDFAcroNonTerminal(dict, ref);
    };
    return PDFAcroNonTerminal;
}(PDFAcroField_1.default));
exports.default = PDFAcroNonTerminal;
//# sourceMappingURL=PDFAcroNonTerminal.js.map
}, function(modId) { var map = {"../objects/PDFName":1767772065488,"./PDFAcroField":1767772065536}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065547, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.createPDFAcroField = exports.createPDFAcroFields = void 0;
var tslib_1 = require("tslib");
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var PDFAcroTerminal_1 = tslib_1.__importDefault(require("./PDFAcroTerminal"));
var PDFAcroNonTerminal_1 = tslib_1.__importDefault(require("./PDFAcroNonTerminal"));
var PDFAcroSignature_1 = tslib_1.__importDefault(require("./PDFAcroSignature"));
var PDFAcroText_1 = tslib_1.__importDefault(require("./PDFAcroText"));
var PDFAcroPushButton_1 = tslib_1.__importDefault(require("./PDFAcroPushButton"));
var PDFAcroRadioButton_1 = tslib_1.__importDefault(require("./PDFAcroRadioButton"));
var PDFAcroCheckBox_1 = tslib_1.__importDefault(require("./PDFAcroCheckBox"));
var PDFAcroComboBox_1 = tslib_1.__importDefault(require("./PDFAcroComboBox"));
var PDFAcroListBox_1 = tslib_1.__importDefault(require("./PDFAcroListBox"));
var flags_1 = require("./flags");
exports.createPDFAcroFields = function (kidDicts) {
    if (!kidDicts)
        return [];
    var kids = [];
    for (var idx = 0, len = kidDicts.size(); idx < len; idx++) {
        var ref = kidDicts.get(idx);
        var dict = kidDicts.lookup(idx);
        // if (dict instanceof PDFDict) kids.push(PDFAcroField.fromDict(dict));
        if (ref instanceof PDFRef_1.default && dict instanceof PDFDict_1.default) {
            kids.push([exports.createPDFAcroField(dict, ref), ref]);
        }
    }
    return kids;
};
exports.createPDFAcroField = function (dict, ref) {
    var isNonTerminal = isNonTerminalAcroField(dict);
    if (isNonTerminal)
        return PDFAcroNonTerminal_1.default.fromDict(dict, ref);
    return createPDFAcroTerminal(dict, ref);
};
// TODO: Maybe just check if the dict is *not* a widget? That might be better.
// According to the PDF spec:
//
//   > A field's children in the hierarchy may also include widget annotations
//   > that define its appearance on the page. A field that has children that
//   > are fields is called a non-terminal field. A field that does not have
//   > children that are fields is called a terminal field.
//
// The spec is not entirely clear about how to determine whether a given
// dictionary represents an acrofield or a widget annotation. So we will assume
// that a dictionary is an acrofield if it is a member of the `/Kids` array
// and it contains a `/T` entry (widgets do not have `/T` entries). This isn't
// a bullet proof solution, because the `/T` entry is technically defined as
// optional for acrofields by the PDF spec. But in practice all acrofields seem
// to have a `/T` entry defined.
var isNonTerminalAcroField = function (dict) {
    var kids = dict.lookup(PDFName_1.default.of('Kids'));
    if (kids instanceof PDFArray_1.default) {
        for (var idx = 0, len = kids.size(); idx < len; idx++) {
            var kid = kids.lookup(idx);
            var kidIsField = kid instanceof PDFDict_1.default && kid.has(PDFName_1.default.of('T'));
            if (kidIsField)
                return true;
        }
    }
    return false;
};
var createPDFAcroTerminal = function (dict, ref) {
    var ftNameOrRef = getInheritableAttribute(dict, PDFName_1.default.of('FT'));
    var type = dict.context.lookup(ftNameOrRef, PDFName_1.default);
    if (type === PDFName_1.default.of('Btn'))
        return createPDFAcroButton(dict, ref);
    if (type === PDFName_1.default.of('Ch'))
        return createPDFAcroChoice(dict, ref);
    if (type === PDFName_1.default.of('Tx'))
        return PDFAcroText_1.default.fromDict(dict, ref);
    if (type === PDFName_1.default.of('Sig'))
        return PDFAcroSignature_1.default.fromDict(dict, ref);
    // We should never reach this line. But there are a lot of weird PDFs out
    // there. So, just to be safe, we'll try to handle things gracefully instead
    // of throwing an error.
    return PDFAcroTerminal_1.default.fromDict(dict, ref);
};
var createPDFAcroButton = function (dict, ref) {
    var _a;
    var ffNumberOrRef = getInheritableAttribute(dict, PDFName_1.default.of('Ff'));
    var ffNumber = dict.context.lookupMaybe(ffNumberOrRef, PDFNumber_1.default);
    var flags = (_a = ffNumber === null || ffNumber === void 0 ? void 0 : ffNumber.asNumber()) !== null && _a !== void 0 ? _a : 0;
    if (flagIsSet(flags, flags_1.AcroButtonFlags.PushButton)) {
        return PDFAcroPushButton_1.default.fromDict(dict, ref);
    }
    else if (flagIsSet(flags, flags_1.AcroButtonFlags.Radio)) {
        return PDFAcroRadioButton_1.default.fromDict(dict, ref);
    }
    else {
        return PDFAcroCheckBox_1.default.fromDict(dict, ref);
    }
};
var createPDFAcroChoice = function (dict, ref) {
    var _a;
    var ffNumberOrRef = getInheritableAttribute(dict, PDFName_1.default.of('Ff'));
    var ffNumber = dict.context.lookupMaybe(ffNumberOrRef, PDFNumber_1.default);
    var flags = (_a = ffNumber === null || ffNumber === void 0 ? void 0 : ffNumber.asNumber()) !== null && _a !== void 0 ? _a : 0;
    if (flagIsSet(flags, flags_1.AcroChoiceFlags.Combo)) {
        return PDFAcroComboBox_1.default.fromDict(dict, ref);
    }
    else {
        return PDFAcroListBox_1.default.fromDict(dict, ref);
    }
};
var flagIsSet = function (flags, flag) {
    return (flags & flag) !== 0;
};
var getInheritableAttribute = function (startNode, name) {
    var attribute;
    ascend(startNode, function (node) {
        if (!attribute)
            attribute = node.get(name);
    });
    return attribute;
};
var ascend = function (startNode, visitor) {
    visitor(startNode);
    var Parent = startNode.lookupMaybe(PDFName_1.default.of('Parent'), PDFDict_1.default);
    if (Parent)
        ascend(Parent, visitor);
};
//# sourceMappingURL=utils.js.map
}, function(modId) { var map = {"../objects/PDFNumber":1767772065484,"../objects/PDFDict":1767772065487,"../objects/PDFName":1767772065488,"../objects/PDFArray":1767772065483,"../objects/PDFRef":1767772065495,"./PDFAcroTerminal":1767772065535,"./PDFAcroNonTerminal":1767772065546,"./PDFAcroSignature":1767772065548,"./PDFAcroText":1767772065549,"./PDFAcroPushButton":1767772065550,"./PDFAcroRadioButton":1767772065551,"./PDFAcroCheckBox":1767772065541,"./PDFAcroComboBox":1767772065544,"./PDFAcroListBox":1767772065552,"./flags":1767772065543}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065548, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFAcroTerminal_1 = tslib_1.__importDefault(require("./PDFAcroTerminal"));
var PDFAcroSignature = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroSignature, _super);
    function PDFAcroSignature() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroSignature.fromDict = function (dict, ref) {
        return new PDFAcroSignature(dict, ref);
    };
    return PDFAcroSignature;
}(PDFAcroTerminal_1.default));
exports.default = PDFAcroSignature;
//# sourceMappingURL=PDFAcroSignature.js.map
}, function(modId) { var map = {"./PDFAcroTerminal":1767772065535}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065549, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFAcroTerminal_1 = tslib_1.__importDefault(require("./PDFAcroTerminal"));
var PDFAcroText = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroText, _super);
    function PDFAcroText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroText.prototype.MaxLen = function () {
        var maxLen = this.dict.lookup(PDFName_1.default.of('MaxLen'));
        if (maxLen instanceof PDFNumber_1.default)
            return maxLen;
        return undefined;
    };
    PDFAcroText.prototype.Q = function () {
        var q = this.dict.lookup(PDFName_1.default.of('Q'));
        if (q instanceof PDFNumber_1.default)
            return q;
        return undefined;
    };
    PDFAcroText.prototype.setMaxLength = function (maxLength) {
        this.dict.set(PDFName_1.default.of('MaxLen'), PDFNumber_1.default.of(maxLength));
    };
    PDFAcroText.prototype.removeMaxLength = function () {
        this.dict.delete(PDFName_1.default.of('MaxLen'));
    };
    PDFAcroText.prototype.getMaxLength = function () {
        var _a;
        return (_a = this.MaxLen()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    PDFAcroText.prototype.setQuadding = function (quadding) {
        this.dict.set(PDFName_1.default.of('Q'), PDFNumber_1.default.of(quadding));
    };
    PDFAcroText.prototype.getQuadding = function () {
        var _a;
        return (_a = this.Q()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    PDFAcroText.prototype.setValue = function (value) {
        this.dict.set(PDFName_1.default.of('V'), value);
        // const widgets = this.getWidgets();
        // for (let idx = 0, len = widgets.length; idx < len; idx++) {
        //   const widget = widgets[idx];
        //   const state = widget.getOnValue() === value ? value : PDFName.of('Off');
        //   widget.setAppearanceState(state);
        // }
    };
    PDFAcroText.prototype.removeValue = function () {
        this.dict.delete(PDFName_1.default.of('V'));
    };
    PDFAcroText.prototype.getValue = function () {
        var v = this.V();
        if (v instanceof PDFString_1.default || v instanceof PDFHexString_1.default)
            return v;
        return undefined;
    };
    PDFAcroText.fromDict = function (dict, ref) { return new PDFAcroText(dict, ref); };
    PDFAcroText.create = function (context) {
        var dict = context.obj({
            FT: 'Tx',
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroText(dict, ref);
    };
    return PDFAcroText;
}(PDFAcroTerminal_1.default));
exports.default = PDFAcroText;
//# sourceMappingURL=PDFAcroText.js.map
}, function(modId) { var map = {"../objects/PDFNumber":1767772065484,"../objects/PDFString":1767772065516,"../objects/PDFHexString":1767772065512,"../objects/PDFName":1767772065488,"./PDFAcroTerminal":1767772065535}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065550, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFAcroButton_1 = tslib_1.__importDefault(require("./PDFAcroButton"));
var flags_1 = require("./flags");
var PDFAcroPushButton = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroPushButton, _super);
    function PDFAcroPushButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroPushButton.fromDict = function (dict, ref) {
        return new PDFAcroPushButton(dict, ref);
    };
    PDFAcroPushButton.create = function (context) {
        var dict = context.obj({
            FT: 'Btn',
            Ff: flags_1.AcroButtonFlags.PushButton,
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroPushButton(dict, ref);
    };
    return PDFAcroPushButton;
}(PDFAcroButton_1.default));
exports.default = PDFAcroPushButton;
//# sourceMappingURL=PDFAcroPushButton.js.map
}, function(modId) { var map = {"./PDFAcroButton":1767772065534,"./flags":1767772065543}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065551, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFAcroButton_1 = tslib_1.__importDefault(require("./PDFAcroButton"));
var flags_1 = require("./flags");
var errors_1 = require("../errors");
var PDFAcroRadioButton = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroRadioButton, _super);
    function PDFAcroRadioButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroRadioButton.prototype.setValue = function (value) {
        var onValues = this.getOnValues();
        if (!onValues.includes(value) && value !== PDFName_1.default.of('Off')) {
            throw new errors_1.InvalidAcroFieldValueError();
        }
        this.dict.set(PDFName_1.default.of('V'), value);
        var widgets = this.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var state = widget.getOnValue() === value ? value : PDFName_1.default.of('Off');
            widget.setAppearanceState(state);
        }
    };
    PDFAcroRadioButton.prototype.getValue = function () {
        var v = this.V();
        if (v instanceof PDFName_1.default)
            return v;
        return PDFName_1.default.of('Off');
    };
    PDFAcroRadioButton.prototype.getOnValues = function () {
        var widgets = this.getWidgets();
        var onValues = [];
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var onValue = widgets[idx].getOnValue();
            if (onValue)
                onValues.push(onValue);
        }
        return onValues;
    };
    PDFAcroRadioButton.fromDict = function (dict, ref) {
        return new PDFAcroRadioButton(dict, ref);
    };
    PDFAcroRadioButton.create = function (context) {
        var dict = context.obj({
            FT: 'Btn',
            Ff: flags_1.AcroButtonFlags.Radio,
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroRadioButton(dict, ref);
    };
    return PDFAcroRadioButton;
}(PDFAcroButton_1.default));
exports.default = PDFAcroRadioButton;
//# sourceMappingURL=PDFAcroRadioButton.js.map
}, function(modId) { var map = {"../objects/PDFName":1767772065488,"./PDFAcroButton":1767772065534,"./flags":1767772065543,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065552, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFAcroChoice_1 = tslib_1.__importDefault(require("./PDFAcroChoice"));
var PDFAcroListBox = /** @class */ (function (_super) {
    tslib_1.__extends(PDFAcroListBox, _super);
    function PDFAcroListBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroListBox.fromDict = function (dict, ref) {
        return new PDFAcroListBox(dict, ref);
    };
    PDFAcroListBox.create = function (context) {
        var dict = context.obj({
            FT: 'Ch',
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroListBox(dict, ref);
    };
    return PDFAcroListBox;
}(PDFAcroChoice_1.default));
exports.default = PDFAcroListBox;
//# sourceMappingURL=PDFAcroListBox.js.map
}, function(modId) { var map = {"./PDFAcroChoice":1767772065542}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065553, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFPageLeaf_1 = tslib_1.__importDefault(require("./PDFPageLeaf"));
var errors_1 = require("../errors");
var PDFPageTree = /** @class */ (function (_super) {
    tslib_1.__extends(PDFPageTree, _super);
    function PDFPageTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFPageTree.prototype.Parent = function () {
        return this.lookup(PDFName_1.default.of('Parent'));
    };
    PDFPageTree.prototype.Kids = function () {
        return this.lookup(PDFName_1.default.of('Kids'), PDFArray_1.default);
    };
    PDFPageTree.prototype.Count = function () {
        return this.lookup(PDFName_1.default.of('Count'), PDFNumber_1.default);
    };
    PDFPageTree.prototype.pushTreeNode = function (treeRef) {
        var Kids = this.Kids();
        Kids.push(treeRef);
    };
    PDFPageTree.prototype.pushLeafNode = function (leafRef) {
        var Kids = this.Kids();
        this.insertLeafKid(Kids.size(), leafRef);
    };
    /**
     * Inserts the given ref as a leaf node of this page tree at the specified
     * index (zero-based). Also increments the `Count` of each page tree in the
     * hierarchy to accomodate the new page.
     *
     * Returns the ref of the PDFPageTree node into which `leafRef` was inserted,
     * or `undefined` if it was inserted into the root node (the PDFPageTree upon
     * which the method was first called).
     */
    PDFPageTree.prototype.insertLeafNode = function (leafRef, targetIndex) {
        var Kids = this.Kids();
        var Count = this.Count().asNumber();
        if (targetIndex > Count) {
            throw new errors_1.InvalidTargetIndexError(targetIndex, Count);
        }
        var leafsRemainingUntilTarget = targetIndex;
        for (var idx = 0, len = Kids.size(); idx < len; idx++) {
            if (leafsRemainingUntilTarget === 0) {
                // Insert page and return
                this.insertLeafKid(idx, leafRef);
                return undefined;
            }
            var kidRef = Kids.get(idx);
            var kid = this.context.lookup(kidRef);
            if (kid instanceof PDFPageTree) {
                if (kid.Count().asNumber() > leafsRemainingUntilTarget) {
                    // Dig in
                    return (kid.insertLeafNode(leafRef, leafsRemainingUntilTarget) || kidRef);
                }
                else {
                    // Move on
                    leafsRemainingUntilTarget -= kid.Count().asNumber();
                }
            }
            if (kid instanceof PDFPageLeaf_1.default) {
                // Move on
                leafsRemainingUntilTarget -= 1;
            }
        }
        if (leafsRemainingUntilTarget === 0) {
            // Insert page at the end and return
            this.insertLeafKid(Kids.size(), leafRef);
            return undefined;
        }
        // Should never get here if `targetIndex` is valid
        throw new errors_1.CorruptPageTreeError(targetIndex, 'insertLeafNode');
    };
    /**
     * Removes the leaf node at the specified index (zero-based) from this page
     * tree. Also decrements the `Count` of each page tree in the hierarchy to
     * account for the removed page.
     *
     * If `prune` is true, then intermediate tree nodes will be removed from the
     * tree if they contain 0 children after the leaf node is removed.
     */
    PDFPageTree.prototype.removeLeafNode = function (targetIndex, prune) {
        if (prune === void 0) { prune = true; }
        var Kids = this.Kids();
        var Count = this.Count().asNumber();
        if (targetIndex >= Count) {
            throw new errors_1.InvalidTargetIndexError(targetIndex, Count);
        }
        var leafsRemainingUntilTarget = targetIndex;
        for (var idx = 0, len = Kids.size(); idx < len; idx++) {
            var kidRef = Kids.get(idx);
            var kid = this.context.lookup(kidRef);
            if (kid instanceof PDFPageTree) {
                if (kid.Count().asNumber() > leafsRemainingUntilTarget) {
                    // Dig in
                    kid.removeLeafNode(leafsRemainingUntilTarget, prune);
                    if (prune && kid.Kids().size() === 0)
                        Kids.remove(idx);
                    return;
                }
                else {
                    // Move on
                    leafsRemainingUntilTarget -= kid.Count().asNumber();
                }
            }
            if (kid instanceof PDFPageLeaf_1.default) {
                if (leafsRemainingUntilTarget === 0) {
                    // Remove page and return
                    this.removeKid(idx);
                    return;
                }
                else {
                    // Move on
                    leafsRemainingUntilTarget -= 1;
                }
            }
        }
        // Should never get here if `targetIndex` is valid
        throw new errors_1.CorruptPageTreeError(targetIndex, 'removeLeafNode');
    };
    PDFPageTree.prototype.ascend = function (visitor) {
        visitor(this);
        var Parent = this.Parent();
        if (Parent)
            Parent.ascend(visitor);
    };
    /** Performs a Post-Order traversal of this page tree */
    PDFPageTree.prototype.traverse = function (visitor) {
        var Kids = this.Kids();
        for (var idx = 0, len = Kids.size(); idx < len; idx++) {
            var kidRef = Kids.get(idx);
            var kid = this.context.lookup(kidRef);
            if (kid instanceof PDFPageTree)
                kid.traverse(visitor);
            visitor(kid, kidRef);
        }
    };
    PDFPageTree.prototype.insertLeafKid = function (kidIdx, leafRef) {
        var Kids = this.Kids();
        this.ascend(function (node) {
            var newCount = node.Count().asNumber() + 1;
            node.set(PDFName_1.default.of('Count'), PDFNumber_1.default.of(newCount));
        });
        Kids.insert(kidIdx, leafRef);
    };
    PDFPageTree.prototype.removeKid = function (kidIdx) {
        var Kids = this.Kids();
        var kid = Kids.lookup(kidIdx);
        if (kid instanceof PDFPageLeaf_1.default) {
            this.ascend(function (node) {
                var newCount = node.Count().asNumber() - 1;
                node.set(PDFName_1.default.of('Count'), PDFNumber_1.default.of(newCount));
            });
        }
        Kids.remove(kidIdx);
    };
    PDFPageTree.withContext = function (context, parent) {
        var dict = new Map();
        dict.set(PDFName_1.default.of('Type'), PDFName_1.default.of('Pages'));
        dict.set(PDFName_1.default.of('Kids'), context.obj([]));
        dict.set(PDFName_1.default.of('Count'), context.obj(0));
        if (parent)
            dict.set(PDFName_1.default.of('Parent'), parent);
        return new PDFPageTree(dict, context);
    };
    PDFPageTree.fromMapWithContext = function (map, context) {
        return new PDFPageTree(map, context);
    };
    return PDFPageTree;
}(PDFDict_1.default));
exports.default = PDFPageTree;
//# sourceMappingURL=PDFPageTree.js.map
}, function(modId) { var map = {"../objects/PDFArray":1767772065483,"../objects/PDFDict":1767772065487,"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"./PDFPageLeaf":1767772065502,"../errors":1767772065467}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065554, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFBool_1 = tslib_1.__importDefault(require("../objects/PDFBool"));
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNull_1 = tslib_1.__importDefault(require("../objects/PDFNull"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFRawStream_1 = tslib_1.__importDefault(require("../objects/PDFRawStream"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var PDFString_1 = tslib_1.__importDefault(require("../objects/PDFString"));
var BaseParser_1 = tslib_1.__importDefault(require("./BaseParser"));
var ByteStream_1 = tslib_1.__importDefault(require("./ByteStream"));
var PDFCatalog_1 = tslib_1.__importDefault(require("../structures/PDFCatalog"));
var PDFPageLeaf_1 = tslib_1.__importDefault(require("../structures/PDFPageLeaf"));
var PDFPageTree_1 = tslib_1.__importDefault(require("../structures/PDFPageTree"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var Delimiters_1 = require("../syntax/Delimiters");
var Keywords_1 = require("../syntax/Keywords");
var Numeric_1 = require("../syntax/Numeric");
var Whitespace_1 = require("../syntax/Whitespace");
var utils_1 = require("../../utils");
// TODO: Throw error if eof is reached before finishing object parse...
var PDFObjectParser = /** @class */ (function (_super) {
    tslib_1.__extends(PDFObjectParser, _super);
    function PDFObjectParser(byteStream, context, capNumbers) {
        if (capNumbers === void 0) { capNumbers = false; }
        var _this = _super.call(this, byteStream, capNumbers) || this;
        _this.context = context;
        return _this;
    }
    // TODO: Is it possible to reduce duplicate parsing for ref lookaheads?
    PDFObjectParser.prototype.parseObject = function () {
        this.skipWhitespaceAndComments();
        if (this.matchKeyword(Keywords_1.Keywords.true))
            return PDFBool_1.default.True;
        if (this.matchKeyword(Keywords_1.Keywords.false))
            return PDFBool_1.default.False;
        if (this.matchKeyword(Keywords_1.Keywords.null))
            return PDFNull_1.default;
        var byte = this.bytes.peek();
        if (byte === CharCodes_1.default.LessThan &&
            this.bytes.peekAhead(1) === CharCodes_1.default.LessThan) {
            return this.parseDictOrStream();
        }
        if (byte === CharCodes_1.default.LessThan)
            return this.parseHexString();
        if (byte === CharCodes_1.default.LeftParen)
            return this.parseString();
        if (byte === CharCodes_1.default.ForwardSlash)
            return this.parseName();
        if (byte === CharCodes_1.default.LeftSquareBracket)
            return this.parseArray();
        if (Numeric_1.IsNumeric[byte])
            return this.parseNumberOrRef();
        throw new errors_1.PDFObjectParsingError(this.bytes.position(), byte);
    };
    PDFObjectParser.prototype.parseNumberOrRef = function () {
        var firstNum = this.parseRawNumber();
        this.skipWhitespaceAndComments();
        var lookaheadStart = this.bytes.offset();
        if (Numeric_1.IsDigit[this.bytes.peek()]) {
            var secondNum = this.parseRawNumber();
            this.skipWhitespaceAndComments();
            if (this.bytes.peek() === CharCodes_1.default.R) {
                this.bytes.assertNext(CharCodes_1.default.R);
                return PDFRef_1.default.of(firstNum, secondNum);
            }
        }
        this.bytes.moveTo(lookaheadStart);
        return PDFNumber_1.default.of(firstNum);
    };
    // TODO: Maybe update PDFHexString.of() logic to remove whitespace and validate input?
    PDFObjectParser.prototype.parseHexString = function () {
        var value = '';
        this.bytes.assertNext(CharCodes_1.default.LessThan);
        while (!this.bytes.done() && this.bytes.peek() !== CharCodes_1.default.GreaterThan) {
            value += utils_1.charFromCode(this.bytes.next());
        }
        this.bytes.assertNext(CharCodes_1.default.GreaterThan);
        return PDFHexString_1.default.of(value);
    };
    PDFObjectParser.prototype.parseString = function () {
        var nestingLvl = 0;
        var isEscaped = false;
        var value = '';
        while (!this.bytes.done()) {
            var byte = this.bytes.next();
            value += utils_1.charFromCode(byte);
            // Check for unescaped parenthesis
            if (!isEscaped) {
                if (byte === CharCodes_1.default.LeftParen)
                    nestingLvl += 1;
                if (byte === CharCodes_1.default.RightParen)
                    nestingLvl -= 1;
            }
            // Track whether current character is being escaped or not
            if (byte === CharCodes_1.default.BackSlash) {
                isEscaped = !isEscaped;
            }
            else if (isEscaped) {
                isEscaped = false;
            }
            // Once (if) the unescaped parenthesis balance out, return their contents
            if (nestingLvl === 0) {
                // Remove the outer parens so they aren't part of the contents
                return PDFString_1.default.of(value.substring(1, value.length - 1));
            }
        }
        throw new errors_1.UnbalancedParenthesisError(this.bytes.position());
    };
    // TODO: Compare performance of string concatenation to charFromCode(...bytes)
    // TODO: Maybe preallocate small Uint8Array if can use charFromCode?
    PDFObjectParser.prototype.parseName = function () {
        this.bytes.assertNext(CharCodes_1.default.ForwardSlash);
        var name = '';
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (Whitespace_1.IsWhitespace[byte] || Delimiters_1.IsDelimiter[byte])
                break;
            name += utils_1.charFromCode(byte);
            this.bytes.next();
        }
        return PDFName_1.default.of(name);
    };
    PDFObjectParser.prototype.parseArray = function () {
        this.bytes.assertNext(CharCodes_1.default.LeftSquareBracket);
        this.skipWhitespaceAndComments();
        var pdfArray = PDFArray_1.default.withContext(this.context);
        while (this.bytes.peek() !== CharCodes_1.default.RightSquareBracket) {
            var element = this.parseObject();
            pdfArray.push(element);
            this.skipWhitespaceAndComments();
        }
        this.bytes.assertNext(CharCodes_1.default.RightSquareBracket);
        return pdfArray;
    };
    PDFObjectParser.prototype.parseDict = function () {
        this.bytes.assertNext(CharCodes_1.default.LessThan);
        this.bytes.assertNext(CharCodes_1.default.LessThan);
        this.skipWhitespaceAndComments();
        var dict = new Map();
        while (!this.bytes.done() &&
            this.bytes.peek() !== CharCodes_1.default.GreaterThan &&
            this.bytes.peekAhead(1) !== CharCodes_1.default.GreaterThan) {
            var key = this.parseName();
            var value = this.parseObject();
            dict.set(key, value);
            this.skipWhitespaceAndComments();
        }
        this.skipWhitespaceAndComments();
        this.bytes.assertNext(CharCodes_1.default.GreaterThan);
        this.bytes.assertNext(CharCodes_1.default.GreaterThan);
        var Type = dict.get(PDFName_1.default.of('Type'));
        if (Type === PDFName_1.default.of('Catalog')) {
            return PDFCatalog_1.default.fromMapWithContext(dict, this.context);
        }
        else if (Type === PDFName_1.default.of('Pages')) {
            return PDFPageTree_1.default.fromMapWithContext(dict, this.context);
        }
        else if (Type === PDFName_1.default.of('Page')) {
            return PDFPageLeaf_1.default.fromMapWithContext(dict, this.context);
        }
        else {
            return PDFDict_1.default.fromMapWithContext(dict, this.context);
        }
    };
    PDFObjectParser.prototype.parseDictOrStream = function () {
        var startPos = this.bytes.position();
        var dict = this.parseDict();
        this.skipWhitespaceAndComments();
        if (!this.matchKeyword(Keywords_1.Keywords.streamEOF1) &&
            !this.matchKeyword(Keywords_1.Keywords.streamEOF2) &&
            !this.matchKeyword(Keywords_1.Keywords.streamEOF3) &&
            !this.matchKeyword(Keywords_1.Keywords.streamEOF4) &&
            !this.matchKeyword(Keywords_1.Keywords.stream)) {
            return dict;
        }
        var start = this.bytes.offset();
        var end;
        var Length = dict.get(PDFName_1.default.of('Length'));
        if (Length instanceof PDFNumber_1.default) {
            end = start + Length.asNumber();
            this.bytes.moveTo(end);
            this.skipWhitespaceAndComments();
            if (!this.matchKeyword(Keywords_1.Keywords.endstream)) {
                this.bytes.moveTo(start);
                end = this.findEndOfStreamFallback(startPos);
            }
        }
        else {
            end = this.findEndOfStreamFallback(startPos);
        }
        var contents = this.bytes.slice(start, end);
        return PDFRawStream_1.default.of(dict, contents);
    };
    PDFObjectParser.prototype.findEndOfStreamFallback = function (startPos) {
        // Move to end of stream, while handling nested streams
        var nestingLvl = 1;
        var end = this.bytes.offset();
        while (!this.bytes.done()) {
            end = this.bytes.offset();
            if (this.matchKeyword(Keywords_1.Keywords.stream)) {
                nestingLvl += 1;
            }
            else if (this.matchKeyword(Keywords_1.Keywords.EOF1endstream) ||
                this.matchKeyword(Keywords_1.Keywords.EOF2endstream) ||
                this.matchKeyword(Keywords_1.Keywords.EOF3endstream) ||
                this.matchKeyword(Keywords_1.Keywords.endstream)) {
                nestingLvl -= 1;
            }
            else {
                this.bytes.next();
            }
            if (nestingLvl === 0)
                break;
        }
        if (nestingLvl !== 0)
            throw new errors_1.PDFStreamParsingError(startPos);
        return end;
    };
    PDFObjectParser.forBytes = function (bytes, context, capNumbers) { return new PDFObjectParser(ByteStream_1.default.of(bytes), context, capNumbers); };
    PDFObjectParser.forByteStream = function (byteStream, context, capNumbers) {
        if (capNumbers === void 0) { capNumbers = false; }
        return new PDFObjectParser(byteStream, context, capNumbers);
    };
    return PDFObjectParser;
}(BaseParser_1.default));
exports.default = PDFObjectParser;
//# sourceMappingURL=PDFObjectParser.js.map
}, function(modId) { var map = {"../errors":1767772065467,"../objects/PDFArray":1767772065483,"../objects/PDFBool":1767772065486,"../objects/PDFDict":1767772065487,"../objects/PDFHexString":1767772065512,"../objects/PDFName":1767772065488,"../objects/PDFNull":1767772065492,"../objects/PDFNumber":1767772065484,"../objects/PDFRawStream":1767772065493,"../objects/PDFRef":1767772065495,"../objects/PDFString":1767772065516,"./BaseParser":1767772065555,"./ByteStream":1767772065557,"../structures/PDFCatalog":1767772065532,"../structures/PDFPageLeaf":1767772065502,"../structures/PDFPageTree":1767772065553,"../syntax/CharCodes":1767772065480,"../syntax/Delimiters":1767772065490,"../syntax/Keywords":1767772065558,"../syntax/Numeric":1767772065556,"../syntax/Whitespace":1767772065491,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065555, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var Numeric_1 = require("../syntax/Numeric");
var Whitespace_1 = require("../syntax/Whitespace");
var utils_1 = require("../../utils");
var Newline = CharCodes_1.default.Newline, CarriageReturn = CharCodes_1.default.CarriageReturn;
// TODO: Throw error if eof is reached before finishing object parse...
var BaseParser = /** @class */ (function () {
    function BaseParser(bytes, capNumbers) {
        if (capNumbers === void 0) { capNumbers = false; }
        this.bytes = bytes;
        this.capNumbers = capNumbers;
    }
    BaseParser.prototype.parseRawInt = function () {
        var value = '';
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (!Numeric_1.IsDigit[byte])
                break;
            value += utils_1.charFromCode(this.bytes.next());
        }
        var numberValue = Number(value);
        if (!value || !isFinite(numberValue)) {
            throw new errors_1.NumberParsingError(this.bytes.position(), value);
        }
        return numberValue;
    };
    // TODO: Maybe handle exponential format?
    // TODO: Compare performance of string concatenation to charFromCode(...bytes)
    BaseParser.prototype.parseRawNumber = function () {
        var value = '';
        // Parse integer-part, the leading (+ | - | . | 0-9)
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (!Numeric_1.IsNumeric[byte])
                break;
            value += utils_1.charFromCode(this.bytes.next());
            if (byte === CharCodes_1.default.Period)
                break;
        }
        // Parse decimal-part, the trailing (0-9)
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (!Numeric_1.IsDigit[byte])
                break;
            value += utils_1.charFromCode(this.bytes.next());
        }
        var numberValue = Number(value);
        if (!value || !isFinite(numberValue)) {
            throw new errors_1.NumberParsingError(this.bytes.position(), value);
        }
        if (numberValue > Number.MAX_SAFE_INTEGER) {
            if (this.capNumbers) {
                var msg = "Parsed number that is too large for some PDF readers: " + value + ", using Number.MAX_SAFE_INTEGER instead.";
                console.warn(msg);
                return Number.MAX_SAFE_INTEGER;
            }
            else {
                var msg = "Parsed number that is too large for some PDF readers: " + value + ", not capping.";
                console.warn(msg);
            }
        }
        return numberValue;
    };
    BaseParser.prototype.skipWhitespace = function () {
        while (!this.bytes.done() && Whitespace_1.IsWhitespace[this.bytes.peek()]) {
            this.bytes.next();
        }
    };
    BaseParser.prototype.skipLine = function () {
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (byte === Newline || byte === CarriageReturn)
                return;
            this.bytes.next();
        }
    };
    BaseParser.prototype.skipComment = function () {
        if (this.bytes.peek() !== CharCodes_1.default.Percent)
            return false;
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (byte === Newline || byte === CarriageReturn)
                return true;
            this.bytes.next();
        }
        return true;
    };
    BaseParser.prototype.skipWhitespaceAndComments = function () {
        this.skipWhitespace();
        while (this.skipComment())
            this.skipWhitespace();
    };
    BaseParser.prototype.matchKeyword = function (keyword) {
        var initialOffset = this.bytes.offset();
        for (var idx = 0, len = keyword.length; idx < len; idx++) {
            if (this.bytes.done() || this.bytes.next() !== keyword[idx]) {
                this.bytes.moveTo(initialOffset);
                return false;
            }
        }
        return true;
    };
    return BaseParser;
}());
exports.default = BaseParser;
//# sourceMappingURL=BaseParser.js.map
}, function(modId) { var map = {"../errors":1767772065467,"../syntax/CharCodes":1767772065480,"../syntax/Numeric":1767772065556,"../syntax/Whitespace":1767772065491,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065556, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNumeric = exports.IsNumericPrefix = exports.IsDigit = void 0;
var tslib_1 = require("tslib");
var CharCodes_1 = tslib_1.__importDefault(require("./CharCodes"));
exports.IsDigit = new Uint8Array(256);
exports.IsDigit[CharCodes_1.default.Zero] = 1;
exports.IsDigit[CharCodes_1.default.One] = 1;
exports.IsDigit[CharCodes_1.default.Two] = 1;
exports.IsDigit[CharCodes_1.default.Three] = 1;
exports.IsDigit[CharCodes_1.default.Four] = 1;
exports.IsDigit[CharCodes_1.default.Five] = 1;
exports.IsDigit[CharCodes_1.default.Six] = 1;
exports.IsDigit[CharCodes_1.default.Seven] = 1;
exports.IsDigit[CharCodes_1.default.Eight] = 1;
exports.IsDigit[CharCodes_1.default.Nine] = 1;
exports.IsNumericPrefix = new Uint8Array(256);
exports.IsNumericPrefix[CharCodes_1.default.Period] = 1;
exports.IsNumericPrefix[CharCodes_1.default.Plus] = 1;
exports.IsNumericPrefix[CharCodes_1.default.Minus] = 1;
exports.IsNumeric = new Uint8Array(256);
for (var idx = 0, len = 256; idx < len; idx++) {
    exports.IsNumeric[idx] = exports.IsDigit[idx] || exports.IsNumericPrefix[idx] ? 1 : 0;
}
//# sourceMappingURL=Numeric.js.map
}, function(modId) { var map = {"./CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065557, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var decode_1 = require("../streams/decode");
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
// TODO: See how line/col tracking affects performance
var ByteStream = /** @class */ (function () {
    function ByteStream(bytes) {
        this.idx = 0;
        this.line = 0;
        this.column = 0;
        this.bytes = bytes;
        this.length = this.bytes.length;
    }
    ByteStream.prototype.moveTo = function (offset) {
        this.idx = offset;
    };
    ByteStream.prototype.next = function () {
        var byte = this.bytes[this.idx++];
        if (byte === CharCodes_1.default.Newline) {
            this.line += 1;
            this.column = 0;
        }
        else {
            this.column += 1;
        }
        return byte;
    };
    ByteStream.prototype.assertNext = function (expected) {
        if (this.peek() !== expected) {
            throw new errors_1.NextByteAssertionError(this.position(), expected, this.peek());
        }
        return this.next();
    };
    ByteStream.prototype.peek = function () {
        return this.bytes[this.idx];
    };
    ByteStream.prototype.peekAhead = function (steps) {
        return this.bytes[this.idx + steps];
    };
    ByteStream.prototype.peekAt = function (offset) {
        return this.bytes[offset];
    };
    ByteStream.prototype.done = function () {
        return this.idx >= this.length;
    };
    ByteStream.prototype.offset = function () {
        return this.idx;
    };
    ByteStream.prototype.slice = function (start, end) {
        return this.bytes.slice(start, end);
    };
    ByteStream.prototype.position = function () {
        return { line: this.line, column: this.column, offset: this.idx };
    };
    ByteStream.of = function (bytes) { return new ByteStream(bytes); };
    ByteStream.fromPDFRawStream = function (rawStream) {
        return ByteStream.of(decode_1.decodePDFRawStream(rawStream).decode());
    };
    return ByteStream;
}());
exports.default = ByteStream;
//# sourceMappingURL=ByteStream.js.map
}, function(modId) { var map = {"../errors":1767772065467,"../streams/decode":1767772065523,"../syntax/CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065558, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.Keywords = void 0;
var tslib_1 = require("tslib");
var CharCodes_1 = tslib_1.__importDefault(require("./CharCodes"));
var Space = CharCodes_1.default.Space, CarriageReturn = CharCodes_1.default.CarriageReturn, Newline = CharCodes_1.default.Newline;
var stream = [
    CharCodes_1.default.s,
    CharCodes_1.default.t,
    CharCodes_1.default.r,
    CharCodes_1.default.e,
    CharCodes_1.default.a,
    CharCodes_1.default.m,
];
var endstream = [
    CharCodes_1.default.e,
    CharCodes_1.default.n,
    CharCodes_1.default.d,
    CharCodes_1.default.s,
    CharCodes_1.default.t,
    CharCodes_1.default.r,
    CharCodes_1.default.e,
    CharCodes_1.default.a,
    CharCodes_1.default.m,
];
exports.Keywords = {
    header: [
        CharCodes_1.default.Percent,
        CharCodes_1.default.P,
        CharCodes_1.default.D,
        CharCodes_1.default.F,
        CharCodes_1.default.Dash,
    ],
    eof: [
        CharCodes_1.default.Percent,
        CharCodes_1.default.Percent,
        CharCodes_1.default.E,
        CharCodes_1.default.O,
        CharCodes_1.default.F,
    ],
    obj: [CharCodes_1.default.o, CharCodes_1.default.b, CharCodes_1.default.j],
    endobj: [
        CharCodes_1.default.e,
        CharCodes_1.default.n,
        CharCodes_1.default.d,
        CharCodes_1.default.o,
        CharCodes_1.default.b,
        CharCodes_1.default.j,
    ],
    xref: [CharCodes_1.default.x, CharCodes_1.default.r, CharCodes_1.default.e, CharCodes_1.default.f],
    trailer: [
        CharCodes_1.default.t,
        CharCodes_1.default.r,
        CharCodes_1.default.a,
        CharCodes_1.default.i,
        CharCodes_1.default.l,
        CharCodes_1.default.e,
        CharCodes_1.default.r,
    ],
    startxref: [
        CharCodes_1.default.s,
        CharCodes_1.default.t,
        CharCodes_1.default.a,
        CharCodes_1.default.r,
        CharCodes_1.default.t,
        CharCodes_1.default.x,
        CharCodes_1.default.r,
        CharCodes_1.default.e,
        CharCodes_1.default.f,
    ],
    true: [CharCodes_1.default.t, CharCodes_1.default.r, CharCodes_1.default.u, CharCodes_1.default.e],
    false: [CharCodes_1.default.f, CharCodes_1.default.a, CharCodes_1.default.l, CharCodes_1.default.s, CharCodes_1.default.e],
    null: [CharCodes_1.default.n, CharCodes_1.default.u, CharCodes_1.default.l, CharCodes_1.default.l],
    stream: stream,
    streamEOF1: tslib_1.__spreadArrays(stream, [Space, CarriageReturn, Newline]),
    streamEOF2: tslib_1.__spreadArrays(stream, [CarriageReturn, Newline]),
    streamEOF3: tslib_1.__spreadArrays(stream, [CarriageReturn]),
    streamEOF4: tslib_1.__spreadArrays(stream, [Newline]),
    endstream: endstream,
    EOF1endstream: tslib_1.__spreadArrays([CarriageReturn, Newline], endstream),
    EOF2endstream: tslib_1.__spreadArrays([CarriageReturn], endstream),
    EOF3endstream: tslib_1.__spreadArrays([Newline], endstream),
};
//# sourceMappingURL=Keywords.js.map
}, function(modId) { var map = {"./CharCodes":1767772065480}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065559, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var ByteStream_1 = tslib_1.__importDefault(require("./ByteStream"));
var PDFObjectParser_1 = tslib_1.__importDefault(require("./PDFObjectParser"));
var utils_1 = require("../../utils");
var PDFObjectStreamParser = /** @class */ (function (_super) {
    tslib_1.__extends(PDFObjectStreamParser, _super);
    function PDFObjectStreamParser(rawStream, shouldWaitForTick) {
        var _this = _super.call(this, ByteStream_1.default.fromPDFRawStream(rawStream), rawStream.dict.context) || this;
        var dict = rawStream.dict;
        _this.alreadyParsed = false;
        _this.shouldWaitForTick = shouldWaitForTick || (function () { return false; });
        _this.firstOffset = dict.lookup(PDFName_1.default.of('First'), PDFNumber_1.default).asNumber();
        _this.objectCount = dict.lookup(PDFName_1.default.of('N'), PDFNumber_1.default).asNumber();
        return _this;
    }
    PDFObjectStreamParser.prototype.parseIntoContext = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var offsetsAndObjectNumbers, idx, len, _a, objectNumber, offset, object, ref;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.alreadyParsed) {
                            throw new errors_1.ReparseError('PDFObjectStreamParser', 'parseIntoContext');
                        }
                        this.alreadyParsed = true;
                        offsetsAndObjectNumbers = this.parseOffsetsAndObjectNumbers();
                        idx = 0, len = offsetsAndObjectNumbers.length;
                        _b.label = 1;
                    case 1:
                        if (!(idx < len)) return [3 /*break*/, 4];
                        _a = offsetsAndObjectNumbers[idx], objectNumber = _a.objectNumber, offset = _a.offset;
                        this.bytes.moveTo(this.firstOffset + offset);
                        object = this.parseObject();
                        ref = PDFRef_1.default.of(objectNumber, 0);
                        this.context.assign(ref, object);
                        if (!this.shouldWaitForTick()) return [3 /*break*/, 3];
                        return [4 /*yield*/, utils_1.waitForTick()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        idx++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PDFObjectStreamParser.prototype.parseOffsetsAndObjectNumbers = function () {
        var offsetsAndObjectNumbers = [];
        for (var idx = 0, len = this.objectCount; idx < len; idx++) {
            this.skipWhitespaceAndComments();
            var objectNumber = this.parseRawInt();
            this.skipWhitespaceAndComments();
            var offset = this.parseRawInt();
            offsetsAndObjectNumbers.push({ objectNumber: objectNumber, offset: offset });
        }
        return offsetsAndObjectNumbers;
    };
    PDFObjectStreamParser.forStream = function (rawStream, shouldWaitForTick) { return new PDFObjectStreamParser(rawStream, shouldWaitForTick); };
    return PDFObjectStreamParser;
}(PDFObjectParser_1.default));
exports.default = PDFObjectStreamParser;
//# sourceMappingURL=PDFObjectStreamParser.js.map
}, function(modId) { var map = {"../errors":1767772065467,"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"../objects/PDFRef":1767772065495,"./ByteStream":1767772065557,"./PDFObjectParser":1767772065554,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065560, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFCrossRefSection_1 = tslib_1.__importDefault(require("../document/PDFCrossRefSection"));
var PDFHeader_1 = tslib_1.__importDefault(require("../document/PDFHeader"));
var PDFTrailer_1 = tslib_1.__importDefault(require("../document/PDFTrailer"));
var errors_1 = require("../errors");
var PDFDict_1 = tslib_1.__importDefault(require("../objects/PDFDict"));
var PDFInvalidObject_1 = tslib_1.__importDefault(require("../objects/PDFInvalidObject"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFRawStream_1 = tslib_1.__importDefault(require("../objects/PDFRawStream"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var ByteStream_1 = tslib_1.__importDefault(require("./ByteStream"));
var PDFObjectParser_1 = tslib_1.__importDefault(require("./PDFObjectParser"));
var PDFObjectStreamParser_1 = tslib_1.__importDefault(require("./PDFObjectStreamParser"));
var PDFXRefStreamParser_1 = tslib_1.__importDefault(require("./PDFXRefStreamParser"));
var PDFContext_1 = tslib_1.__importDefault(require("../PDFContext"));
var CharCodes_1 = tslib_1.__importDefault(require("../syntax/CharCodes"));
var Keywords_1 = require("../syntax/Keywords");
var Numeric_1 = require("../syntax/Numeric");
var utils_1 = require("../../utils");
var PDFParser = /** @class */ (function (_super) {
    tslib_1.__extends(PDFParser, _super);
    function PDFParser(pdfBytes, objectsPerTick, throwOnInvalidObject, capNumbers) {
        if (objectsPerTick === void 0) { objectsPerTick = Infinity; }
        if (throwOnInvalidObject === void 0) { throwOnInvalidObject = false; }
        if (capNumbers === void 0) { capNumbers = false; }
        var _this = _super.call(this, ByteStream_1.default.of(pdfBytes), PDFContext_1.default.create(), capNumbers) || this;
        _this.alreadyParsed = false;
        _this.parsedObjects = 0;
        _this.shouldWaitForTick = function () {
            _this.parsedObjects += 1;
            return _this.parsedObjects % _this.objectsPerTick === 0;
        };
        _this.objectsPerTick = objectsPerTick;
        _this.throwOnInvalidObject = throwOnInvalidObject;
        return _this;
    }
    PDFParser.prototype.parseDocument = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var prevOffset, offset;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.alreadyParsed) {
                            throw new errors_1.ReparseError('PDFParser', 'parseDocument');
                        }
                        this.alreadyParsed = true;
                        this.context.header = this.parseHeader();
                        _a.label = 1;
                    case 1:
                        if (!!this.bytes.done()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.parseDocumentSection()];
                    case 2:
                        _a.sent();
                        offset = this.bytes.offset();
                        if (offset === prevOffset) {
                            throw new errors_1.StalledParserError(this.bytes.position());
                        }
                        prevOffset = offset;
                        return [3 /*break*/, 1];
                    case 3:
                        this.maybeRecoverRoot();
                        if (this.context.lookup(PDFRef_1.default.of(0))) {
                            console.warn('Removing parsed object: 0 0 R');
                            this.context.delete(PDFRef_1.default.of(0));
                        }
                        return [2 /*return*/, this.context];
                }
            });
        });
    };
    PDFParser.prototype.maybeRecoverRoot = function () {
        var isValidCatalog = function (obj) {
            return obj instanceof PDFDict_1.default &&
                obj.lookup(PDFName_1.default.of('Type')) === PDFName_1.default.of('Catalog');
        };
        var catalog = this.context.lookup(this.context.trailerInfo.Root);
        if (!isValidCatalog(catalog)) {
            var indirectObjects = this.context.enumerateIndirectObjects();
            for (var idx = 0, len = indirectObjects.length; idx < len; idx++) {
                var _a = indirectObjects[idx], ref = _a[0], object = _a[1];
                if (isValidCatalog(object)) {
                    this.context.trailerInfo.Root = ref;
                }
            }
        }
    };
    PDFParser.prototype.parseHeader = function () {
        while (!this.bytes.done()) {
            if (this.matchKeyword(Keywords_1.Keywords.header)) {
                var major = this.parseRawInt();
                this.bytes.assertNext(CharCodes_1.default.Period);
                var minor = this.parseRawInt();
                var header = PDFHeader_1.default.forVersion(major, minor);
                this.skipBinaryHeaderComment();
                return header;
            }
            this.bytes.next();
        }
        throw new errors_1.MissingPDFHeaderError(this.bytes.position());
    };
    PDFParser.prototype.parseIndirectObjectHeader = function () {
        this.skipWhitespaceAndComments();
        var objectNumber = this.parseRawInt();
        this.skipWhitespaceAndComments();
        var generationNumber = this.parseRawInt();
        this.skipWhitespaceAndComments();
        if (!this.matchKeyword(Keywords_1.Keywords.obj)) {
            throw new errors_1.MissingKeywordError(this.bytes.position(), Keywords_1.Keywords.obj);
        }
        return PDFRef_1.default.of(objectNumber, generationNumber);
    };
    PDFParser.prototype.matchIndirectObjectHeader = function () {
        var initialOffset = this.bytes.offset();
        try {
            this.parseIndirectObjectHeader();
            return true;
        }
        catch (e) {
            this.bytes.moveTo(initialOffset);
            return false;
        }
    };
    PDFParser.prototype.parseIndirectObject = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref, object;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ref = this.parseIndirectObjectHeader();
                        this.skipWhitespaceAndComments();
                        object = this.parseObject();
                        this.skipWhitespaceAndComments();
                        // if (!this.matchKeyword(Keywords.endobj)) {
                        // throw new MissingKeywordError(this.bytes.position(), Keywords.endobj);
                        // }
                        // TODO: Log a warning if this fails...
                        this.matchKeyword(Keywords_1.Keywords.endobj);
                        if (!(object instanceof PDFRawStream_1.default &&
                            object.dict.lookup(PDFName_1.default.of('Type')) === PDFName_1.default.of('ObjStm'))) return [3 /*break*/, 2];
                        return [4 /*yield*/, PDFObjectStreamParser_1.default.forStream(object, this.shouldWaitForTick).parseIntoContext()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (object instanceof PDFRawStream_1.default &&
                            object.dict.lookup(PDFName_1.default.of('Type')) === PDFName_1.default.of('XRef')) {
                            PDFXRefStreamParser_1.default.forStream(object).parseIntoContext();
                        }
                        else {
                            this.context.assign(ref, object);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, ref];
                }
            });
        });
    };
    // TODO: Improve and clean this up
    PDFParser.prototype.tryToParseInvalidIndirectObject = function () {
        var startPos = this.bytes.position();
        var msg = "Trying to parse invalid object: " + JSON.stringify(startPos) + ")";
        if (this.throwOnInvalidObject)
            throw new Error(msg);
        console.warn(msg);
        var ref = this.parseIndirectObjectHeader();
        console.warn("Invalid object ref: " + ref);
        this.skipWhitespaceAndComments();
        var start = this.bytes.offset();
        var failed = true;
        while (!this.bytes.done()) {
            if (this.matchKeyword(Keywords_1.Keywords.endobj)) {
                failed = false;
            }
            if (!failed)
                break;
            this.bytes.next();
        }
        if (failed)
            throw new errors_1.PDFInvalidObjectParsingError(startPos);
        var end = this.bytes.offset() - Keywords_1.Keywords.endobj.length;
        var object = PDFInvalidObject_1.default.of(this.bytes.slice(start, end));
        this.context.assign(ref, object);
        return ref;
    };
    PDFParser.prototype.parseIndirectObjects = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var initialOffset, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.skipWhitespaceAndComments();
                        _a.label = 1;
                    case 1:
                        if (!(!this.bytes.done() && Numeric_1.IsDigit[this.bytes.peek()])) return [3 /*break*/, 8];
                        initialOffset = this.bytes.offset();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.parseIndirectObject()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        // TODO: Add tracing/logging mechanism to track when this happens!
                        this.bytes.moveTo(initialOffset);
                        this.tryToParseInvalidIndirectObject();
                        return [3 /*break*/, 5];
                    case 5:
                        this.skipWhitespaceAndComments();
                        // TODO: Can this be done only when needed, to avoid harming performance?
                        this.skipJibberish();
                        if (!this.shouldWaitForTick()) return [3 /*break*/, 7];
                        return [4 /*yield*/, utils_1.waitForTick()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 1];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    PDFParser.prototype.maybeParseCrossRefSection = function () {
        this.skipWhitespaceAndComments();
        if (!this.matchKeyword(Keywords_1.Keywords.xref))
            return;
        this.skipWhitespaceAndComments();
        var objectNumber = -1;
        var xref = PDFCrossRefSection_1.default.createEmpty();
        while (!this.bytes.done() && Numeric_1.IsDigit[this.bytes.peek()]) {
            var firstInt = this.parseRawInt();
            this.skipWhitespaceAndComments();
            var secondInt = this.parseRawInt();
            this.skipWhitespaceAndComments();
            var byte = this.bytes.peek();
            if (byte === CharCodes_1.default.n || byte === CharCodes_1.default.f) {
                var ref = PDFRef_1.default.of(objectNumber, secondInt);
                if (this.bytes.next() === CharCodes_1.default.n) {
                    xref.addEntry(ref, firstInt);
                }
                else {
                    // this.context.delete(ref);
                    xref.addDeletedEntry(ref, firstInt);
                }
                objectNumber += 1;
            }
            else {
                objectNumber = firstInt;
            }
            this.skipWhitespaceAndComments();
        }
        return xref;
    };
    PDFParser.prototype.maybeParseTrailerDict = function () {
        this.skipWhitespaceAndComments();
        if (!this.matchKeyword(Keywords_1.Keywords.trailer))
            return;
        this.skipWhitespaceAndComments();
        var dict = this.parseDict();
        var context = this.context;
        context.trailerInfo = {
            Root: dict.get(PDFName_1.default.of('Root')) || context.trailerInfo.Root,
            Encrypt: dict.get(PDFName_1.default.of('Encrypt')) || context.trailerInfo.Encrypt,
            Info: dict.get(PDFName_1.default.of('Info')) || context.trailerInfo.Info,
            ID: dict.get(PDFName_1.default.of('ID')) || context.trailerInfo.ID,
        };
    };
    PDFParser.prototype.maybeParseTrailer = function () {
        this.skipWhitespaceAndComments();
        if (!this.matchKeyword(Keywords_1.Keywords.startxref))
            return;
        this.skipWhitespaceAndComments();
        var offset = this.parseRawInt();
        this.skipWhitespace();
        this.matchKeyword(Keywords_1.Keywords.eof);
        this.skipWhitespaceAndComments();
        this.matchKeyword(Keywords_1.Keywords.eof);
        this.skipWhitespaceAndComments();
        return PDFTrailer_1.default.forLastCrossRefSectionOffset(offset);
    };
    PDFParser.prototype.parseDocumentSection = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.parseIndirectObjects()];
                    case 1:
                        _a.sent();
                        this.maybeParseCrossRefSection();
                        this.maybeParseTrailerDict();
                        this.maybeParseTrailer();
                        // TODO: Can this be done only when needed, to avoid harming performance?
                        this.skipJibberish();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This operation is not necessary for valid PDF files. But some invalid PDFs
     * contain jibberish in between indirect objects. This method is designed to
     * skip past that jibberish, should it exist, until it reaches the next
     * indirect object header, an xref table section, or the file trailer.
     */
    PDFParser.prototype.skipJibberish = function () {
        this.skipWhitespaceAndComments();
        while (!this.bytes.done()) {
            var initialOffset = this.bytes.offset();
            var byte = this.bytes.peek();
            var isAlphaNumeric = byte >= CharCodes_1.default.Space && byte <= CharCodes_1.default.Tilde;
            if (isAlphaNumeric) {
                if (this.matchKeyword(Keywords_1.Keywords.xref) ||
                    this.matchKeyword(Keywords_1.Keywords.trailer) ||
                    this.matchKeyword(Keywords_1.Keywords.startxref) ||
                    this.matchIndirectObjectHeader()) {
                    this.bytes.moveTo(initialOffset);
                    break;
                }
            }
            this.bytes.next();
        }
    };
    /**
     * Skips the binary comment following a PDF header. The specification
     * defines this binary comment (section 7.5.2 File Header) as a sequence of 4
     * or more bytes that are 128 or greater, and which are preceded by a "%".
     *
     * This would imply that to strip out this binary comment, we could check for
     * a sequence of bytes starting with "%", and remove all subsequent bytes that
     * are 128 or greater. This works for many documents that properly comply with
     * the spec. But in the wild, there are PDFs that omit the leading "%", and
     * include bytes that are less than 128 (e.g. 0 or 1). So in order to parse
     * these headers correctly, we just throw out all bytes leading up to the
     * first indirect object header.
     */
    PDFParser.prototype.skipBinaryHeaderComment = function () {
        this.skipWhitespaceAndComments();
        try {
            var initialOffset = this.bytes.offset();
            this.parseIndirectObjectHeader();
            this.bytes.moveTo(initialOffset);
        }
        catch (e) {
            this.bytes.next();
            this.skipWhitespaceAndComments();
        }
    };
    PDFParser.forBytesWithOptions = function (pdfBytes, objectsPerTick, throwOnInvalidObject, capNumbers) {
        return new PDFParser(pdfBytes, objectsPerTick, throwOnInvalidObject, capNumbers);
    };
    return PDFParser;
}(PDFObjectParser_1.default));
exports.default = PDFParser;
//# sourceMappingURL=PDFParser.js.map
}, function(modId) { var map = {"../document/PDFCrossRefSection":1767772065504,"../document/PDFHeader":1767772065482,"../document/PDFTrailer":1767772065505,"../errors":1767772065467,"../objects/PDFDict":1767772065487,"../objects/PDFInvalidObject":1767772065509,"../objects/PDFName":1767772065488,"../objects/PDFRawStream":1767772065493,"../objects/PDFRef":1767772065495,"./ByteStream":1767772065557,"./PDFObjectParser":1767772065554,"./PDFObjectStreamParser":1767772065559,"./PDFXRefStreamParser":1767772065561,"../PDFContext":1767772065481,"../syntax/CharCodes":1767772065480,"../syntax/Keywords":1767772065558,"../syntax/Numeric":1767772065556,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065561, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("../errors");
var PDFArray_1 = tslib_1.__importDefault(require("../objects/PDFArray"));
var PDFName_1 = tslib_1.__importDefault(require("../objects/PDFName"));
var PDFNumber_1 = tslib_1.__importDefault(require("../objects/PDFNumber"));
var PDFRef_1 = tslib_1.__importDefault(require("../objects/PDFRef"));
var ByteStream_1 = tslib_1.__importDefault(require("./ByteStream"));
var PDFXRefStreamParser = /** @class */ (function () {
    function PDFXRefStreamParser(rawStream) {
        this.alreadyParsed = false;
        this.dict = rawStream.dict;
        this.bytes = ByteStream_1.default.fromPDFRawStream(rawStream);
        this.context = this.dict.context;
        var Size = this.dict.lookup(PDFName_1.default.of('Size'), PDFNumber_1.default);
        var Index = this.dict.lookup(PDFName_1.default.of('Index'));
        if (Index instanceof PDFArray_1.default) {
            this.subsections = [];
            for (var idx = 0, len = Index.size(); idx < len; idx += 2) {
                var firstObjectNumber = Index.lookup(idx + 0, PDFNumber_1.default).asNumber();
                var length_1 = Index.lookup(idx + 1, PDFNumber_1.default).asNumber();
                this.subsections.push({ firstObjectNumber: firstObjectNumber, length: length_1 });
            }
        }
        else {
            this.subsections = [{ firstObjectNumber: 0, length: Size.asNumber() }];
        }
        var W = this.dict.lookup(PDFName_1.default.of('W'), PDFArray_1.default);
        this.byteWidths = [-1, -1, -1];
        for (var idx = 0, len = W.size(); idx < len; idx++) {
            this.byteWidths[idx] = W.lookup(idx, PDFNumber_1.default).asNumber();
        }
    }
    PDFXRefStreamParser.prototype.parseIntoContext = function () {
        if (this.alreadyParsed) {
            throw new errors_1.ReparseError('PDFXRefStreamParser', 'parseIntoContext');
        }
        this.alreadyParsed = true;
        this.context.trailerInfo = {
            Root: this.dict.get(PDFName_1.default.of('Root')),
            Encrypt: this.dict.get(PDFName_1.default.of('Encrypt')),
            Info: this.dict.get(PDFName_1.default.of('Info')),
            ID: this.dict.get(PDFName_1.default.of('ID')),
        };
        var entries = this.parseEntries();
        // for (let idx = 0, len = entries.length; idx < len; idx++) {
        // const entry = entries[idx];
        // if (entry.deleted) this.context.delete(entry.ref);
        // }
        return entries;
    };
    PDFXRefStreamParser.prototype.parseEntries = function () {
        var entries = [];
        var _a = this.byteWidths, typeFieldWidth = _a[0], offsetFieldWidth = _a[1], genFieldWidth = _a[2];
        for (var subsectionIdx = 0, subsectionLen = this.subsections.length; subsectionIdx < subsectionLen; subsectionIdx++) {
            var _b = this.subsections[subsectionIdx], firstObjectNumber = _b.firstObjectNumber, length_2 = _b.length;
            for (var objIdx = 0; objIdx < length_2; objIdx++) {
                var type = 0;
                for (var idx = 0, len = typeFieldWidth; idx < len; idx++) {
                    type = (type << 8) | this.bytes.next();
                }
                var offset = 0;
                for (var idx = 0, len = offsetFieldWidth; idx < len; idx++) {
                    offset = (offset << 8) | this.bytes.next();
                }
                var generationNumber = 0;
                for (var idx = 0, len = genFieldWidth; idx < len; idx++) {
                    generationNumber = (generationNumber << 8) | this.bytes.next();
                }
                // When the `type` field is absent, it defaults to 1
                if (typeFieldWidth === 0)
                    type = 1;
                var objectNumber = firstObjectNumber + objIdx;
                var entry = {
                    ref: PDFRef_1.default.of(objectNumber, generationNumber),
                    offset: offset,
                    deleted: type === 0,
                    inObjectStream: type === 2,
                };
                entries.push(entry);
            }
        }
        return entries;
    };
    PDFXRefStreamParser.forStream = function (rawStream) {
        return new PDFXRefStreamParser(rawStream);
    };
    return PDFXRefStreamParser;
}());
exports.default = PDFXRefStreamParser;
//# sourceMappingURL=PDFXRefStreamParser.js.map
}, function(modId) { var map = {"../errors":1767772065467,"../objects/PDFArray":1767772065483,"../objects/PDFName":1767772065488,"../objects/PDFNumber":1767772065484,"../objects/PDFRef":1767772065495,"./ByteStream":1767772065557}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065562, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFAnnotation_1 = require("./PDFAnnotation");
Object.defineProperty(exports, "PDFAnnotation", { enumerable: true, get: function () { return PDFAnnotation_1.default; } });
var PDFWidgetAnnotation_1 = require("./PDFWidgetAnnotation");
Object.defineProperty(exports, "PDFWidgetAnnotation", { enumerable: true, get: function () { return PDFWidgetAnnotation_1.default; } });
var AppearanceCharacteristics_1 = require("./AppearanceCharacteristics");
Object.defineProperty(exports, "AppearanceCharacteristics", { enumerable: true, get: function () { return AppearanceCharacteristics_1.default; } });
tslib_1.__exportStar(require("./flags"), exports);
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./PDFAnnotation":1767772065539,"./PDFWidgetAnnotation":1767772065537,"./AppearanceCharacteristics":1767772065540,"./flags":1767772065563}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065563, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationFlags = void 0;
var flag = function (bitIndex) { return 1 << bitIndex; };
/** From PDF spec table 165 */
var AnnotationFlags;
(function (AnnotationFlags) {
    /**
     * If set, do not display the annotation if it does not belong to one of the
     * standard annotation types and no annotation handler is available. If clear,
     * display such an unknown annotation using an appearance stream specified by
     * its appearance dictionary, if any.
     */
    AnnotationFlags[AnnotationFlags["Invisible"] = flag(1 - 1)] = "Invisible";
    /**
     * If set, do not display or print the annotation or allow it to interact with
     * the user, regardless of its annotation type or whether an annotation
     * handler is available.
     *
     * In cases where screen space is limited, the ability to hide and show
     * annotations selectively can be used in combination with appearance streams
     * to display auxiliary pop-up information similar in function to online help
     * systems.
     */
    AnnotationFlags[AnnotationFlags["Hidden"] = flag(2 - 1)] = "Hidden";
    /**
     * If set, print the annotation when the page is printed. If clear, never
     * print the annotation, regardless of whether it is displayed on the screen.
     *
     * This can be useful for annotations representing interactive pushbuttons,
     * which would serve no meaningful purpose on the printed page.
     */
    AnnotationFlags[AnnotationFlags["Print"] = flag(3 - 1)] = "Print";
    /**
     * If set, do not scale the annotation’s appearance to match the magnification
     * of the page. The location of the annotation on the page (defined by the
     * upper-left corner of its annotation rectangle) shall remain fixed,
     * regardless of the page magnification.
     */
    AnnotationFlags[AnnotationFlags["NoZoom"] = flag(4 - 1)] = "NoZoom";
    /**
     * If set, do not rotate the annotation’s appearance to match the rotation of
     * the page. The upper-left corner of the annotation rectangle shall remain in
     * a fixed location on the page, regardless of the page rotation.
     */
    AnnotationFlags[AnnotationFlags["NoRotate"] = flag(5 - 1)] = "NoRotate";
    /**
     * If set, do not display the annotation on the screen or allow it to interact
     * with the user. The annotation may be printed (depending on the setting of
     * the Print flag) but should be considered hidden for purposes of on-screen
     * display and user interaction.
     */
    AnnotationFlags[AnnotationFlags["NoView"] = flag(6 - 1)] = "NoView";
    /**
     * If set, do not allow the annotation to interact with the user. The
     * annotation may be displayed or printed (depending on the settings of the
     * NoView and Print flags) but should not respond to mouse clicks or change
     * its appearance in response to mouse motions.
     *
     * This flag shall be ignored for widget annotations; its function is
     * subsumed by the ReadOnly flag of the associated form field.
     */
    AnnotationFlags[AnnotationFlags["ReadOnly"] = flag(7 - 1)] = "ReadOnly";
    /**
     * If set, do not allow the annotation to be deleted or its properties
     * (including position and size) to be modified by the user. However, this
     * flag does not restrict changes to the annotation’s contents, such as the
     * value of a form field.
     */
    AnnotationFlags[AnnotationFlags["Locked"] = flag(8 - 1)] = "Locked";
    /**
     * If set, invert the interpretation of the NoView flag for certain events.
     *
     * A typical use is to have an annotation that appears only when a mouse
     * cursor is held over it.
     */
    AnnotationFlags[AnnotationFlags["ToggleNoView"] = flag(9 - 1)] = "ToggleNoView";
    /**
     * If set, do not allow the contents of the annotation to be modified by the
     * user. This flag does not restrict deletion of the annotation or changes to
     * other annotation properties, such as position and size.
     */
    AnnotationFlags[AnnotationFlags["LockedContents"] = flag(10 - 1)] = "LockedContents";
})(AnnotationFlags = exports.AnnotationFlags || (exports.AnnotationFlags = {}));
//# sourceMappingURL=flags.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065564, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateRectangle = exports.adjustDimsForRotation = exports.reduceRotation = exports.toDegrees = exports.toRadians = exports.radiansToDegrees = exports.degreesToRadians = exports.degrees = exports.radians = exports.RotationTypes = void 0;
var utils_1 = require("../utils");
var RotationTypes;
(function (RotationTypes) {
    RotationTypes["Degrees"] = "degrees";
    RotationTypes["Radians"] = "radians";
})(RotationTypes = exports.RotationTypes || (exports.RotationTypes = {}));
exports.radians = function (radianAngle) {
    utils_1.assertIs(radianAngle, 'radianAngle', ['number']);
    return { type: RotationTypes.Radians, angle: radianAngle };
};
exports.degrees = function (degreeAngle) {
    utils_1.assertIs(degreeAngle, 'degreeAngle', ['number']);
    return { type: RotationTypes.Degrees, angle: degreeAngle };
};
var Radians = RotationTypes.Radians, Degrees = RotationTypes.Degrees;
exports.degreesToRadians = function (degree) { return (degree * Math.PI) / 180; };
exports.radiansToDegrees = function (radian) { return (radian * 180) / Math.PI; };
// prettier-ignore
exports.toRadians = function (rotation) {
    return rotation.type === Radians ? rotation.angle
        : rotation.type === Degrees ? exports.degreesToRadians(rotation.angle)
            : utils_1.error("Invalid rotation: " + JSON.stringify(rotation));
};
// prettier-ignore
exports.toDegrees = function (rotation) {
    return rotation.type === Radians ? exports.radiansToDegrees(rotation.angle)
        : rotation.type === Degrees ? rotation.angle
            : utils_1.error("Invalid rotation: " + JSON.stringify(rotation));
};
exports.reduceRotation = function (degreeAngle) {
    if (degreeAngle === void 0) { degreeAngle = 0; }
    var quadrants = (degreeAngle / 90) % 4;
    if (quadrants === 0)
        return 0;
    if (quadrants === 1)
        return 90;
    if (quadrants === 2)
        return 180;
    if (quadrants === 3)
        return 270;
    return 0; // `degreeAngle` is not a multiple of 90
};
exports.adjustDimsForRotation = function (dims, degreeAngle) {
    if (degreeAngle === void 0) { degreeAngle = 0; }
    var rotation = exports.reduceRotation(degreeAngle);
    return rotation === 90 || rotation === 270
        ? { width: dims.height, height: dims.width }
        : { width: dims.width, height: dims.height };
};
exports.rotateRectangle = function (rectangle, borderWidth, degreeAngle) {
    if (borderWidth === void 0) { borderWidth = 0; }
    if (degreeAngle === void 0) { degreeAngle = 0; }
    var x = rectangle.x, y = rectangle.y, w = rectangle.width, h = rectangle.height;
    var r = exports.reduceRotation(degreeAngle);
    var b = borderWidth / 2;
    // prettier-ignore
    if (r === 0)
        return { x: x - b, y: y - b, width: w, height: h };
    else if (r === 90)
        return { x: x - h + b, y: y - b, width: h, height: w };
    else if (r === 180)
        return { x: x - w + b, y: y - h + b, width: w, height: h };
    else if (r === 270)
        return { x: x - b, y: y - w + b, width: h, height: w };
    else
        return { x: x - b, y: y - b, width: w, height: h };
};
//# sourceMappingURL=rotations.js.map
}, function(modId) { var map = {"../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065565, function(require, module, exports) {

// Originated from pdfkit Copyright (c) 2014 Devon Govett
// https://github.com/foliojs/pdfkit/blob/1e62e6ffe24b378eb890df507a47610f4c4a7b24/lib/path.js
// MIT LICENSE
// Updated for pdf-lib & TypeScript by Jeremy Messenger
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgPathToOperators = void 0;
var operators_1 = require("./operators");
var cx = 0;
var cy = 0;
var px = 0;
var py = 0;
var sx = 0;
var sy = 0;
var parameters = new Map([
    ['A', 7],
    ['a', 7],
    ['C', 6],
    ['c', 6],
    ['H', 1],
    ['h', 1],
    ['L', 2],
    ['l', 2],
    ['M', 2],
    ['m', 2],
    ['Q', 4],
    ['q', 4],
    ['S', 4],
    ['s', 4],
    ['T', 2],
    ['t', 2],
    ['V', 1],
    ['v', 1],
    ['Z', 0],
    ['z', 0],
]);
var parse = function (path) {
    var cmd;
    var ret = [];
    var args = [];
    var curArg = '';
    var foundDecimal = false;
    var params = 0;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var c = path_1[_i];
        if (parameters.has(c)) {
            params = parameters.get(c);
            if (cmd) {
                // save existing command
                if (curArg.length > 0) {
                    args[args.length] = +curArg;
                }
                ret[ret.length] = { cmd: cmd, args: args };
                args = [];
                curArg = '';
                foundDecimal = false;
            }
            cmd = c;
        }
        else if ([' ', ','].includes(c) ||
            (c === '-' && curArg.length > 0 && curArg[curArg.length - 1] !== 'e') ||
            (c === '.' && foundDecimal)) {
            if (curArg.length === 0) {
                continue;
            }
            if (args.length === params) {
                // handle reused commands
                ret[ret.length] = { cmd: cmd, args: args };
                args = [+curArg];
                // handle assumed commands
                if (cmd === 'M') {
                    cmd = 'L';
                }
                if (cmd === 'm') {
                    cmd = 'l';
                }
            }
            else {
                args[args.length] = +curArg;
            }
            foundDecimal = c === '.';
            // fix for negative numbers or repeated decimals with no delimeter between commands
            curArg = ['-', '.'].includes(c) ? c : '';
        }
        else {
            curArg += c;
            if (c === '.') {
                foundDecimal = true;
            }
        }
    }
    // add the last command
    if (curArg.length > 0) {
        if (args.length === params) {
            // handle reused commands
            ret[ret.length] = { cmd: cmd, args: args };
            args = [+curArg];
            // handle assumed commands
            if (cmd === 'M') {
                cmd = 'L';
            }
            if (cmd === 'm') {
                cmd = 'l';
            }
        }
        else {
            args[args.length] = +curArg;
        }
    }
    ret[ret.length] = { cmd: cmd, args: args };
    return ret;
};
var apply = function (commands) {
    // current point, control point, and subpath starting point
    cx = cy = px = py = sx = sy = 0;
    // run the commands
    var cmds = [];
    for (var i = 0; i < commands.length; i++) {
        var c = commands[i];
        if (c.cmd && typeof runners[c.cmd] === 'function') {
            var cmd = runners[c.cmd](c.args);
            if (Array.isArray(cmd)) {
                cmds = cmds.concat(cmd);
            }
            else {
                cmds.push(cmd);
            }
        }
    }
    return cmds;
};
var runners = {
    M: function (a) {
        cx = a[0];
        cy = a[1];
        px = py = null;
        sx = cx;
        sy = cy;
        return operators_1.moveTo(cx, cy);
    },
    m: function (a) {
        cx += a[0];
        cy += a[1];
        px = py = null;
        sx = cx;
        sy = cy;
        return operators_1.moveTo(cx, cy);
    },
    C: function (a) {
        cx = a[4];
        cy = a[5];
        px = a[2];
        py = a[3];
        return operators_1.appendBezierCurve(a[0], a[1], a[2], a[3], a[4], a[5]);
    },
    c: function (a) {
        var cmd = operators_1.appendBezierCurve(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy, a[4] + cx, a[5] + cy);
        px = cx + a[2];
        py = cy + a[3];
        cx += a[4];
        cy += a[5];
        return cmd;
    },
    S: function (a) {
        if (px === null || py === null) {
            px = cx;
            py = cy;
        }
        var cmd = operators_1.appendBezierCurve(cx - (px - cx), cy - (py - cy), a[0], a[1], a[2], a[3]);
        px = a[0];
        py = a[1];
        cx = a[2];
        cy = a[3];
        return cmd;
    },
    s: function (a) {
        if (px === null || py === null) {
            px = cx;
            py = cy;
        }
        var cmd = operators_1.appendBezierCurve(cx - (px - cx), cy - (py - cy), cx + a[0], cy + a[1], cx + a[2], cy + a[3]);
        px = cx + a[0];
        py = cy + a[1];
        cx += a[2];
        cy += a[3];
        return cmd;
    },
    Q: function (a) {
        px = a[0];
        py = a[1];
        cx = a[2];
        cy = a[3];
        return operators_1.appendQuadraticCurve(a[0], a[1], cx, cy);
    },
    q: function (a) {
        var cmd = operators_1.appendQuadraticCurve(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy);
        px = cx + a[0];
        py = cy + a[1];
        cx += a[2];
        cy += a[3];
        return cmd;
    },
    T: function (a) {
        if (px === null || py === null) {
            px = cx;
            py = cy;
        }
        else {
            px = cx - (px - cx);
            py = cy - (py - cy);
        }
        var cmd = operators_1.appendQuadraticCurve(px, py, a[0], a[1]);
        px = cx - (px - cx);
        py = cy - (py - cy);
        cx = a[0];
        cy = a[1];
        return cmd;
    },
    t: function (a) {
        if (px === null || py === null) {
            px = cx;
            py = cy;
        }
        else {
            px = cx - (px - cx);
            py = cy - (py - cy);
        }
        var cmd = operators_1.appendQuadraticCurve(px, py, cx + a[0], cy + a[1]);
        cx += a[0];
        cy += a[1];
        return cmd;
    },
    A: function (a) {
        var cmds = solveArc(cx, cy, a);
        cx = a[5];
        cy = a[6];
        return cmds;
    },
    a: function (a) {
        a[5] += cx;
        a[6] += cy;
        var cmds = solveArc(cx, cy, a);
        cx = a[5];
        cy = a[6];
        return cmds;
    },
    L: function (a) {
        cx = a[0];
        cy = a[1];
        px = py = null;
        return operators_1.lineTo(cx, cy);
    },
    l: function (a) {
        cx += a[0];
        cy += a[1];
        px = py = null;
        return operators_1.lineTo(cx, cy);
    },
    H: function (a) {
        cx = a[0];
        px = py = null;
        return operators_1.lineTo(cx, cy);
    },
    h: function (a) {
        cx += a[0];
        px = py = null;
        return operators_1.lineTo(cx, cy);
    },
    V: function (a) {
        cy = a[0];
        px = py = null;
        return operators_1.lineTo(cx, cy);
    },
    v: function (a) {
        cy += a[0];
        px = py = null;
        return operators_1.lineTo(cx, cy);
    },
    Z: function () {
        var cmd = operators_1.closePath();
        cx = sx;
        cy = sy;
        return cmd;
    },
    z: function () {
        var cmd = operators_1.closePath();
        cx = sx;
        cy = sy;
        return cmd;
    },
};
var solveArc = function (x, y, coords) {
    var rx = coords[0], ry = coords[1], rot = coords[2], large = coords[3], sweep = coords[4], ex = coords[5], ey = coords[6];
    var segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);
    var cmds = [];
    for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
        var seg = segs_1[_i];
        var bez = segmentToBezier.apply(void 0, seg);
        cmds.push(operators_1.appendBezierCurve.apply(void 0, bez));
    }
    return cmds;
};
// from Inkscape svgtopdf, thanks!
var arcToSegments = function (x, y, rx, ry, large, sweep, rotateX, ox, oy) {
    var th = rotateX * (Math.PI / 180);
    var sinTh = Math.sin(th);
    var cosTh = Math.cos(th);
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    px = cosTh * (ox - x) * 0.5 + sinTh * (oy - y) * 0.5;
    py = cosTh * (oy - y) * 0.5 - sinTh * (ox - x) * 0.5;
    var pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);
    if (pl > 1) {
        pl = Math.sqrt(pl);
        rx *= pl;
        ry *= pl;
    }
    var a00 = cosTh / rx;
    var a01 = sinTh / rx;
    var a10 = -sinTh / ry;
    var a11 = cosTh / ry;
    var x0 = a00 * ox + a01 * oy;
    var y0 = a10 * ox + a11 * oy;
    var x1 = a00 * x + a01 * y;
    var y1 = a10 * x + a11 * y;
    var d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    var sfactorSq = 1 / d - 0.25;
    if (sfactorSq < 0) {
        sfactorSq = 0;
    }
    var sfactor = Math.sqrt(sfactorSq);
    if (sweep === large) {
        sfactor = -sfactor;
    }
    var xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
    var yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);
    var th0 = Math.atan2(y0 - yc, x0 - xc);
    var th1 = Math.atan2(y1 - yc, x1 - xc);
    var thArc = th1 - th0;
    if (thArc < 0 && sweep === 1) {
        thArc += 2 * Math.PI;
    }
    else if (thArc > 0 && sweep === 0) {
        thArc -= 2 * Math.PI;
    }
    var segments = Math.ceil(Math.abs(thArc / (Math.PI * 0.5 + 0.001)));
    var result = [];
    for (var i = 0; i < segments; i++) {
        var th2 = th0 + (i * thArc) / segments;
        var th3 = th0 + ((i + 1) * thArc) / segments;
        result[i] = [xc, yc, th2, th3, rx, ry, sinTh, cosTh];
    }
    return result;
};
var segmentToBezier = function (cx1, cy1, th0, th1, rx, ry, sinTh, cosTh) {
    var a00 = cosTh * rx;
    var a01 = -sinTh * ry;
    var a10 = sinTh * rx;
    var a11 = cosTh * ry;
    var thHalf = 0.5 * (th1 - th0);
    var t = ((8 / 3) * Math.sin(thHalf * 0.5) * Math.sin(thHalf * 0.5)) /
        Math.sin(thHalf);
    var x1 = cx1 + Math.cos(th0) - t * Math.sin(th0);
    var y1 = cy1 + Math.sin(th0) + t * Math.cos(th0);
    var x3 = cx1 + Math.cos(th1);
    var y3 = cy1 + Math.sin(th1);
    var x2 = x3 + t * Math.sin(th1);
    var y2 = y3 - t * Math.cos(th1);
    var result = [
        a00 * x1 + a01 * y1,
        a10 * x1 + a11 * y1,
        a00 * x2 + a01 * y2,
        a10 * x2 + a11 * y2,
        a00 * x3 + a01 * y3,
        a10 * x3 + a11 * y3,
    ];
    return result;
};
exports.svgPathToOperators = function (path) { return apply(parse(path)); };
//# sourceMappingURL=svgPath.js.map
}, function(modId) { var map = {"./operators":1767772065464}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065566, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutSinglelineText = exports.layoutCombedText = exports.layoutMultilineText = void 0;
var errors_1 = require("../errors");
var alignment_1 = require("./alignment");
var utils_1 = require("../../utils");
var MIN_FONT_SIZE = 4;
var MAX_FONT_SIZE = 500;
var computeFontSize = function (lines, font, bounds, multiline) {
    if (multiline === void 0) { multiline = false; }
    var fontSize = MIN_FONT_SIZE;
    while (fontSize < MAX_FONT_SIZE) {
        var linesUsed = 0;
        for (var lineIdx = 0, lineLen = lines.length; lineIdx < lineLen; lineIdx++) {
            linesUsed += 1;
            var line = lines[lineIdx];
            var words = line.split(' ');
            // Layout the words using the current `fontSize`, line wrapping
            // whenever we reach the end of the current line.
            var spaceInLineRemaining = bounds.width;
            for (var idx = 0, len = words.length; idx < len; idx++) {
                var isLastWord = idx === len - 1;
                var word = isLastWord ? words[idx] : words[idx] + ' ';
                var widthOfWord = font.widthOfTextAtSize(word, fontSize);
                spaceInLineRemaining -= widthOfWord;
                if (spaceInLineRemaining <= 0) {
                    linesUsed += 1;
                    spaceInLineRemaining = bounds.width - widthOfWord;
                }
            }
        }
        // Return if we exceeded the allowed width
        if (!multiline && linesUsed > lines.length)
            return fontSize - 1;
        var height = font.heightAtSize(fontSize);
        var lineHeight = height + height * 0.2;
        var totalHeight = lineHeight * linesUsed;
        // Return if we exceeded the allowed height
        if (totalHeight > Math.abs(bounds.height))
            return fontSize - 1;
        fontSize += 1;
    }
    return fontSize;
};
var computeCombedFontSize = function (line, font, bounds, cellCount) {
    var cellWidth = bounds.width / cellCount;
    var cellHeight = bounds.height;
    var fontSize = MIN_FONT_SIZE;
    var chars = utils_1.charSplit(line);
    while (fontSize < MAX_FONT_SIZE) {
        for (var idx = 0, len = chars.length; idx < len; idx++) {
            var c = chars[idx];
            var tooLong = font.widthOfTextAtSize(c, fontSize) > cellWidth * 0.75;
            if (tooLong)
                return fontSize - 1;
        }
        var height = font.heightAtSize(fontSize, { descender: false });
        if (height > cellHeight)
            return fontSize - 1;
        fontSize += 1;
    }
    return fontSize;
};
var lastIndexOfWhitespace = function (line) {
    for (var idx = line.length; idx > 0; idx--) {
        if (/\s/.test(line[idx]))
            return idx;
    }
    return undefined;
};
var splitOutLines = function (input, maxWidth, font, fontSize) {
    var _a;
    var lastWhitespaceIdx = input.length;
    while (lastWhitespaceIdx > 0) {
        var line = input.substring(0, lastWhitespaceIdx);
        var encoded = font.encodeText(line);
        var width = font.widthOfTextAtSize(line, fontSize);
        if (width < maxWidth) {
            var remainder = input.substring(lastWhitespaceIdx) || undefined;
            return { line: line, encoded: encoded, width: width, remainder: remainder };
        }
        lastWhitespaceIdx = (_a = lastIndexOfWhitespace(line)) !== null && _a !== void 0 ? _a : 0;
    }
    // We were unable to split the input enough to get a chunk that would fit
    // within the specified `maxWidth` so we'll just return everything
    return {
        line: input,
        encoded: font.encodeText(input),
        width: font.widthOfTextAtSize(input, fontSize),
        remainder: undefined,
    };
};
exports.layoutMultilineText = function (text, _a) {
    var alignment = _a.alignment, fontSize = _a.fontSize, font = _a.font, bounds = _a.bounds;
    var lines = utils_1.lineSplit(utils_1.cleanText(text));
    if (fontSize === undefined || fontSize === 0) {
        fontSize = computeFontSize(lines, font, bounds, true);
    }
    var height = font.heightAtSize(fontSize);
    var lineHeight = height + height * 0.2;
    var textLines = [];
    var minX = bounds.x;
    var minY = bounds.y;
    var maxX = bounds.x + bounds.width;
    var maxY = bounds.y + bounds.height;
    var y = bounds.y + bounds.height;
    for (var idx = 0, len = lines.length; idx < len; idx++) {
        var prevRemainder = lines[idx];
        while (prevRemainder !== undefined) {
            var _b = splitOutLines(prevRemainder, bounds.width, font, fontSize), line = _b.line, encoded = _b.encoded, width = _b.width, remainder = _b.remainder;
            // prettier-ignore
            var x = (alignment === alignment_1.TextAlignment.Left ? bounds.x
                : alignment === alignment_1.TextAlignment.Center ? bounds.x + (bounds.width / 2) - (width / 2)
                    : alignment === alignment_1.TextAlignment.Right ? bounds.x + bounds.width - width
                        : bounds.x);
            y -= lineHeight;
            if (x < minX)
                minX = x;
            if (y < minY)
                minY = y;
            if (x + width > maxX)
                maxX = x + width;
            if (y + height > maxY)
                maxY = y + height;
            textLines.push({ text: line, encoded: encoded, width: width, height: height, x: x, y: y });
            // Only trim lines that we had to split ourselves. So we won't trim lines
            // that the user provided themselves with whitespace.
            prevRemainder = remainder === null || remainder === void 0 ? void 0 : remainder.trim();
        }
    }
    return {
        fontSize: fontSize,
        lineHeight: lineHeight,
        lines: textLines,
        bounds: {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        },
    };
};
exports.layoutCombedText = function (text, _a) {
    var fontSize = _a.fontSize, font = _a.font, bounds = _a.bounds, cellCount = _a.cellCount;
    var line = utils_1.mergeLines(utils_1.cleanText(text));
    if (line.length > cellCount) {
        throw new errors_1.CombedTextLayoutError(line.length, cellCount);
    }
    if (fontSize === undefined || fontSize === 0) {
        fontSize = computeCombedFontSize(line, font, bounds, cellCount);
    }
    var cellWidth = bounds.width / cellCount;
    var height = font.heightAtSize(fontSize, { descender: false });
    var y = bounds.y + (bounds.height / 2 - height / 2);
    var cells = [];
    var minX = bounds.x;
    var minY = bounds.y;
    var maxX = bounds.x + bounds.width;
    var maxY = bounds.y + bounds.height;
    var cellOffset = 0;
    var charOffset = 0;
    while (cellOffset < cellCount) {
        var _b = utils_1.charAtIndex(line, charOffset), char = _b[0], charLength = _b[1];
        var encoded = font.encodeText(char);
        var width = font.widthOfTextAtSize(char, fontSize);
        var cellCenter = bounds.x + (cellWidth * cellOffset + cellWidth / 2);
        var x = cellCenter - width / 2;
        if (x < minX)
            minX = x;
        if (y < minY)
            minY = y;
        if (x + width > maxX)
            maxX = x + width;
        if (y + height > maxY)
            maxY = y + height;
        cells.push({ text: line, encoded: encoded, width: width, height: height, x: x, y: y });
        cellOffset += 1;
        charOffset += charLength;
    }
    return {
        fontSize: fontSize,
        cells: cells,
        bounds: {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        },
    };
};
exports.layoutSinglelineText = function (text, _a) {
    var alignment = _a.alignment, fontSize = _a.fontSize, font = _a.font, bounds = _a.bounds;
    var line = utils_1.mergeLines(utils_1.cleanText(text));
    if (fontSize === undefined || fontSize === 0) {
        fontSize = computeFontSize([line], font, bounds);
    }
    var encoded = font.encodeText(line);
    var width = font.widthOfTextAtSize(line, fontSize);
    var height = font.heightAtSize(fontSize, { descender: false });
    // prettier-ignore
    var x = (alignment === alignment_1.TextAlignment.Left ? bounds.x
        : alignment === alignment_1.TextAlignment.Center ? bounds.x + (bounds.width / 2) - (width / 2)
            : alignment === alignment_1.TextAlignment.Right ? bounds.x + bounds.width - width
                : bounds.x);
    var y = bounds.y + (bounds.height / 2 - height / 2);
    return {
        fontSize: fontSize,
        line: { text: line, encoded: encoded, width: width, height: height, x: x, y: y },
        bounds: { x: x, y: y, width: width, height: height },
    };
};
//# sourceMappingURL=layout.js.map
}, function(modId) { var map = {"../errors":1767772065567,"./alignment":1767772065568,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065567, function(require, module, exports) {

// tslint:disable: max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidMaxLengthError = exports.ExceededMaxLengthError = exports.CombedTextLayoutError = exports.RichTextFieldReadError = exports.FieldExistsAsNonTerminalError = exports.InvalidFieldNamePartError = exports.FieldAlreadyExistsError = exports.MissingOnValueCheckError = exports.UnexpectedFieldTypeError = exports.NoSuchFieldError = exports.RemovePageFromEmptyDocumentError = exports.ForeignPageError = exports.FontkitNotRegisteredError = exports.EncryptedPDFError = void 0;
var tslib_1 = require("tslib");
// TODO: Include link to documentation with example
var EncryptedPDFError = /** @class */ (function (_super) {
    tslib_1.__extends(EncryptedPDFError, _super);
    function EncryptedPDFError() {
        var _this = this;
        var msg = 'Input document to `PDFDocument.load` is encrypted. You can use `PDFDocument.load(..., { ignoreEncryption: true })` if you wish to load the document anyways.';
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return EncryptedPDFError;
}(Error));
exports.EncryptedPDFError = EncryptedPDFError;
// TODO: Include link to documentation with example
var FontkitNotRegisteredError = /** @class */ (function (_super) {
    tslib_1.__extends(FontkitNotRegisteredError, _super);
    function FontkitNotRegisteredError() {
        var _this = this;
        var msg = 'Input to `PDFDocument.embedFont` was a custom font, but no `fontkit` instance was found. You must register a `fontkit` instance with `PDFDocument.registerFontkit(...)` before embedding custom fonts.';
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return FontkitNotRegisteredError;
}(Error));
exports.FontkitNotRegisteredError = FontkitNotRegisteredError;
// TODO: Include link to documentation with example
var ForeignPageError = /** @class */ (function (_super) {
    tslib_1.__extends(ForeignPageError, _super);
    function ForeignPageError() {
        var _this = this;
        var msg = 'A `page` passed to `PDFDocument.addPage` or `PDFDocument.insertPage` was from a different (foreign) PDF document. If you want to copy pages from one PDFDocument to another, you must use `PDFDocument.copyPages(...)` to copy the pages before adding or inserting them.';
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return ForeignPageError;
}(Error));
exports.ForeignPageError = ForeignPageError;
// TODO: Include link to documentation with example
var RemovePageFromEmptyDocumentError = /** @class */ (function (_super) {
    tslib_1.__extends(RemovePageFromEmptyDocumentError, _super);
    function RemovePageFromEmptyDocumentError() {
        var _this = this;
        var msg = 'PDFDocument has no pages so `PDFDocument.removePage` cannot be called';
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return RemovePageFromEmptyDocumentError;
}(Error));
exports.RemovePageFromEmptyDocumentError = RemovePageFromEmptyDocumentError;
var NoSuchFieldError = /** @class */ (function (_super) {
    tslib_1.__extends(NoSuchFieldError, _super);
    function NoSuchFieldError(name) {
        var _this = this;
        var msg = "PDFDocument has no form field with the name \"" + name + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return NoSuchFieldError;
}(Error));
exports.NoSuchFieldError = NoSuchFieldError;
var UnexpectedFieldTypeError = /** @class */ (function (_super) {
    tslib_1.__extends(UnexpectedFieldTypeError, _super);
    function UnexpectedFieldTypeError(name, expected, actual) {
        var _a, _b;
        var _this = this;
        var expectedType = expected === null || expected === void 0 ? void 0 : expected.name;
        var actualType = (_b = (_a = actual === null || actual === void 0 ? void 0 : actual.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : actual;
        var msg = "Expected field \"" + name + "\" to be of type " + expectedType + ", " +
            ("but it is actually of type " + actualType);
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return UnexpectedFieldTypeError;
}(Error));
exports.UnexpectedFieldTypeError = UnexpectedFieldTypeError;
var MissingOnValueCheckError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingOnValueCheckError, _super);
    function MissingOnValueCheckError(onValue) {
        var _this = this;
        var msg = "Failed to select check box due to missing onValue: \"" + onValue + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return MissingOnValueCheckError;
}(Error));
exports.MissingOnValueCheckError = MissingOnValueCheckError;
var FieldAlreadyExistsError = /** @class */ (function (_super) {
    tslib_1.__extends(FieldAlreadyExistsError, _super);
    function FieldAlreadyExistsError(name) {
        var _this = this;
        var msg = "A field already exists with the specified name: \"" + name + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return FieldAlreadyExistsError;
}(Error));
exports.FieldAlreadyExistsError = FieldAlreadyExistsError;
var InvalidFieldNamePartError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidFieldNamePartError, _super);
    function InvalidFieldNamePartError(namePart) {
        var _this = this;
        var msg = "Field name contains invalid component: \"" + namePart + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return InvalidFieldNamePartError;
}(Error));
exports.InvalidFieldNamePartError = InvalidFieldNamePartError;
var FieldExistsAsNonTerminalError = /** @class */ (function (_super) {
    tslib_1.__extends(FieldExistsAsNonTerminalError, _super);
    function FieldExistsAsNonTerminalError(name) {
        var _this = this;
        var msg = "A non-terminal field already exists with the specified name: \"" + name + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return FieldExistsAsNonTerminalError;
}(Error));
exports.FieldExistsAsNonTerminalError = FieldExistsAsNonTerminalError;
var RichTextFieldReadError = /** @class */ (function (_super) {
    tslib_1.__extends(RichTextFieldReadError, _super);
    function RichTextFieldReadError(fieldName) {
        var _this = this;
        var msg = "Reading rich text fields is not supported: Attempted to read rich text field: " + fieldName;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return RichTextFieldReadError;
}(Error));
exports.RichTextFieldReadError = RichTextFieldReadError;
var CombedTextLayoutError = /** @class */ (function (_super) {
    tslib_1.__extends(CombedTextLayoutError, _super);
    function CombedTextLayoutError(lineLength, cellCount) {
        var _this = this;
        var msg = "Failed to layout combed text as lineLength=" + lineLength + " is greater than cellCount=" + cellCount;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return CombedTextLayoutError;
}(Error));
exports.CombedTextLayoutError = CombedTextLayoutError;
var ExceededMaxLengthError = /** @class */ (function (_super) {
    tslib_1.__extends(ExceededMaxLengthError, _super);
    function ExceededMaxLengthError(textLength, maxLength, name) {
        var _this = this;
        var msg = "Attempted to set text with length=" + textLength + " for TextField with maxLength=" + maxLength + " and name=" + name;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return ExceededMaxLengthError;
}(Error));
exports.ExceededMaxLengthError = ExceededMaxLengthError;
var InvalidMaxLengthError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidMaxLengthError, _super);
    function InvalidMaxLengthError(textLength, maxLength, name) {
        var _this = this;
        var msg = "Attempted to set maxLength=" + maxLength + ", which is less than " + textLength + ", the length of this field's current value (name=" + name + ")";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return InvalidMaxLengthError;
}(Error));
exports.InvalidMaxLengthError = InvalidMaxLengthError;
//# sourceMappingURL=errors.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065568, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAlignment = void 0;
var TextAlignment;
(function (TextAlignment) {
    TextAlignment[TextAlignment["Left"] = 0] = "Left";
    TextAlignment[TextAlignment["Center"] = 1] = "Center";
    TextAlignment[TextAlignment["Right"] = 2] = "Right";
})(TextAlignment = exports.TextAlignment || (exports.TextAlignment = {}));
//# sourceMappingURL=alignment.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065569, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFPage_1 = tslib_1.__importDefault(require("../PDFPage"));
var PDFFont_1 = tslib_1.__importDefault(require("../PDFFont"));
var alignment_1 = require("../image/alignment");
var appearances_1 = require("./appearances");
var PDFField_1 = tslib_1.__importStar(require("./PDFField"));
var colors_1 = require("../colors");
var rotations_1 = require("../rotations");
var core_1 = require("../../core");
var utils_1 = require("../../utils");
/**
 * Represents a button field of a [[PDFForm]].
 *
 * [[PDFButton]] fields are interactive controls that users can click with their
 * mouse. This type of [[PDFField]] is not stateful. The purpose of a button
 * is to perform an action when the user clicks on it, such as opening a print
 * modal or resetting the form. Buttons are typically rectangular in shape and
 * have a text label describing the action that they perform when clicked.
 */
var PDFButton = /** @class */ (function (_super) {
    tslib_1.__extends(PDFButton, _super);
    function PDFButton(acroPushButton, ref, doc) {
        var _this = _super.call(this, acroPushButton, ref, doc) || this;
        utils_1.assertIs(acroPushButton, 'acroButton', [
            [core_1.PDFAcroPushButton, 'PDFAcroPushButton'],
        ]);
        _this.acroField = acroPushButton;
        return _this;
    }
    /**
     * Display an image inside the bounds of this button's widgets. For example:
     * ```js
     * const pngImage = await pdfDoc.embedPng(...)
     * const button = form.getButton('some.button.field')
     * button.setImage(pngImage, ImageAlignment.Center)
     * ```
     * This will update the appearances streams for each of this button's widgets.
     * @param image The image that should be displayed.
     * @param alignment The alignment of the image.
     */
    PDFButton.prototype.setImage = function (image, alignment) {
        if (alignment === void 0) { alignment = alignment_1.ImageAlignment.Center; }
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var streamRef = this.createImageAppearanceStream(widget, image, alignment);
            this.updateWidgetAppearances(widget, { normal: streamRef });
        }
        this.markAsClean();
    };
    /**
     * Set the font size for this field. Larger font sizes will result in larger
     * text being displayed when PDF readers render this button. Font sizes may
     * be integer or floating point numbers. Supplying a negative font size will
     * cause this method to throw an error.
     *
     * For example:
     * ```js
     * const button = form.getButton('some.button.field')
     * button.setFontSize(4)
     * button.setFontSize(15.7)
     * ```
     *
     * > This method depends upon the existence of a default appearance
     * > (`/DA`) string. If this field does not have a default appearance string,
     * > or that string does not contain a font size (via the `Tf` operator),
     * > then this method will throw an error.
     *
     * @param fontSize The font size to be used when rendering text in this field.
     */
    PDFButton.prototype.setFontSize = function (fontSize) {
        utils_1.assertPositive(fontSize, 'fontSize');
        this.acroField.setFontSize(fontSize);
        this.markAsDirty();
    };
    /**
     * Show this button on the specified page with the given text. For example:
     * ```js
     * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const button = form.createButton('some.button.field')
     *
     * button.addToPage('Do Stuff', page, {
     *   x: 50,
     *   y: 75,
     *   width: 200,
     *   height: 100,
     *   textColor: rgb(1, 0, 0),
     *   backgroundColor: rgb(0, 1, 0),
     *   borderColor: rgb(0, 0, 1),
     *   borderWidth: 2,
     *   rotate: degrees(90),
     *   font: ubuntuFont,
     * })
     * ```
     * This will create a new widget for this button field.
     * @param text The text to be displayed for this button widget.
     * @param page The page to which this button widget should be added.
     * @param options The options to be used when adding this button widget.
     */
    PDFButton.prototype.addToPage = function (
    // TODO: This needs to be optional, e.g. for image buttons
    text, page, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        utils_1.assertOrUndefined(text, 'text', ['string']);
        utils_1.assertOrUndefined(page, 'page', [[PDFPage_1.default, 'PDFPage']]);
        PDFField_1.assertFieldAppearanceOptions(options);
        // Create a widget for this button
        var widget = this.createWidget({
            x: ((_a = options === null || options === void 0 ? void 0 : options.x) !== null && _a !== void 0 ? _a : 0) - ((_b = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _b !== void 0 ? _b : 0) / 2,
            y: ((_c = options === null || options === void 0 ? void 0 : options.y) !== null && _c !== void 0 ? _c : 0) - ((_d = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _d !== void 0 ? _d : 0) / 2,
            width: (_e = options === null || options === void 0 ? void 0 : options.width) !== null && _e !== void 0 ? _e : 100,
            height: (_f = options === null || options === void 0 ? void 0 : options.height) !== null && _f !== void 0 ? _f : 50,
            textColor: (_g = options === null || options === void 0 ? void 0 : options.textColor) !== null && _g !== void 0 ? _g : colors_1.rgb(0, 0, 0),
            backgroundColor: (_h = options === null || options === void 0 ? void 0 : options.backgroundColor) !== null && _h !== void 0 ? _h : colors_1.rgb(0.75, 0.75, 0.75),
            borderColor: options === null || options === void 0 ? void 0 : options.borderColor,
            borderWidth: (_j = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _j !== void 0 ? _j : 0,
            rotate: (_k = options === null || options === void 0 ? void 0 : options.rotate) !== null && _k !== void 0 ? _k : rotations_1.degrees(0),
            caption: text,
            hidden: options === null || options === void 0 ? void 0 : options.hidden,
            page: page.ref,
        });
        var widgetRef = this.doc.context.register(widget.dict);
        // Add widget to this field
        this.acroField.addWidget(widgetRef);
        // Set appearance streams for widget
        var font = (_l = options === null || options === void 0 ? void 0 : options.font) !== null && _l !== void 0 ? _l : this.doc.getForm().getDefaultFont();
        this.updateWidgetAppearance(widget, font);
        // Add widget to the given page
        page.node.addAnnot(widgetRef);
    };
    /**
     * Returns `true` if this button has been marked as dirty, or if any of this
     * button's widgets do not have an appearance stream. For example:
     * ```js
     * const button = form.getButton('some.button.field')
     * if (button.needsAppearancesUpdate()) console.log('Needs update')
     * ```
     * @returns Whether or not this button needs an appearance update.
     */
    PDFButton.prototype.needsAppearancesUpdate = function () {
        var _a;
        if (this.isDirty())
            return true;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof core_1.PDFStream;
            if (!hasAppearances)
                return true;
        }
        return false;
    };
    /**
     * Update the appearance streams for each of this button's widgets using
     * the default appearance provider for buttons. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const button = form.getButton('some.button.field')
     * button.defaultUpdateAppearances(helvetica)
     * ```
     * @param font The font to be used for creating the appearance streams.
     */
    PDFButton.prototype.defaultUpdateAppearances = function (font) {
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        this.updateAppearances(font);
    };
    /**
     * Update the appearance streams for each of this button's widgets using
     * the given appearance provider. If no `provider` is passed, the default
     * appearance provider for buttons will be used. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const button = form.getButton('some.button.field')
     * button.updateAppearances(helvetica, (field, widget, font) => {
     *   ...
     *   return {
     *     normal: drawButton(...),
     *     down: drawButton(...),
     *   }
     * })
     * ```
     * @param font The font to be used for creating the appearance streams.
     * @param provider Optionally, the appearance provider to be used for
     *                 generating the contents of the appearance streams.
     */
    PDFButton.prototype.updateAppearances = function (font, provider) {
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        utils_1.assertOrUndefined(provider, 'provider', [Function]);
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            this.updateWidgetAppearance(widget, font, provider);
        }
    };
    PDFButton.prototype.updateWidgetAppearance = function (widget, font, provider) {
        var apProvider = provider !== null && provider !== void 0 ? provider : appearances_1.defaultButtonAppearanceProvider;
        var appearances = appearances_1.normalizeAppearance(apProvider(this, widget, font));
        this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getButton]] method, which will create an
     * > instance of [[PDFButton]] for you.
     *
     * Create an instance of [[PDFButton]] from an existing acroPushButton and ref
     *
     * @param acroPushButton The underlying `PDFAcroPushButton` for this button.
     * @param ref The unique reference for this button.
     * @param doc The document to which this button will belong.
     */
    PDFButton.of = function (acroPushButton, ref, doc) { return new PDFButton(acroPushButton, ref, doc); };
    return PDFButton;
}(PDFField_1.default));
exports.default = PDFButton;
//# sourceMappingURL=PDFButton.js.map
}, function(modId) { var map = {"../PDFPage":1767772065570,"../PDFFont":1767772065573,"../image/alignment":1767772065579,"./appearances":1767772065461,"./PDFField":1767772065577,"../colors":1767772065463,"../rotations":1767772065564,"../../core":1767772065466,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065570, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var colors_1 = require("./colors");
var operations_1 = require("./operations");
var operators_1 = require("./operators");
var PDFDocument_1 = tslib_1.__importDefault(require("./PDFDocument"));
var PDFEmbeddedPage_1 = tslib_1.__importDefault(require("./PDFEmbeddedPage"));
var PDFFont_1 = tslib_1.__importDefault(require("./PDFFont"));
var PDFImage_1 = tslib_1.__importDefault(require("./PDFImage"));
var PDFPageOptions_1 = require("./PDFPageOptions");
var rotations_1 = require("./rotations");
var StandardFonts_1 = require("./StandardFonts");
var core_1 = require("../core");
var utils_1 = require("../utils");
/**
 * Represents a single page of a [[PDFDocument]].
 */
var PDFPage = /** @class */ (function () {
    function PDFPage(leafNode, ref, doc) {
        this.fontSize = 24;
        this.fontColor = colors_1.rgb(0, 0, 0);
        this.lineHeight = 24;
        this.x = 0;
        this.y = 0;
        utils_1.assertIs(leafNode, 'leafNode', [[core_1.PDFPageLeaf, 'PDFPageLeaf']]);
        utils_1.assertIs(ref, 'ref', [[core_1.PDFRef, 'PDFRef']]);
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        this.node = leafNode;
        this.ref = ref;
        this.doc = doc;
    }
    /**
     * Rotate this page by a multiple of 90 degrees. For example:
     * ```js
     * import { degrees } from 'pdf-lib'
     *
     * page.setRotation(degrees(-90))
     * page.setRotation(degrees(0))
     * page.setRotation(degrees(90))
     * page.setRotation(degrees(180))
     * page.setRotation(degrees(270))
     * ```
     * @param angle The angle to rotate this page.
     */
    PDFPage.prototype.setRotation = function (angle) {
        var degreesAngle = rotations_1.toDegrees(angle);
        utils_1.assertMultiple(degreesAngle, 'degreesAngle', 90);
        this.node.set(core_1.PDFName.of('Rotate'), this.doc.context.obj(degreesAngle));
    };
    /**
     * Get this page's rotation angle in degrees. For example:
     * ```js
     * const rotationAngle = page.getRotation().angle;
     * ```
     * @returns The rotation angle of the page in degrees (always a multiple of
     *          90 degrees).
     */
    PDFPage.prototype.getRotation = function () {
        var Rotate = this.node.Rotate();
        return rotations_1.degrees(Rotate ? Rotate.asNumber() : 0);
    };
    /**
     * Resize this page by increasing or decreasing its width and height. For
     * example:
     * ```js
     * page.setSize(250, 500)
     * page.setSize(page.getWidth() + 50, page.getHeight() + 100)
     * page.setSize(page.getWidth() - 50, page.getHeight() - 100)
     * ```
     *
     * Note that the PDF specification does not allow for pages to have explicit
     * widths and heights. Instead it defines the "size" of a page in terms of
     * five rectangles: the MediaBox, CropBox, BleedBox, TrimBox, and ArtBox. As a
     * result, this method cannot directly change the width and height of a page.
     * Instead, it works by adjusting these five boxes.
     *
     * This method performs the following steps:
     *   1. Set width & height of MediaBox.
     *   2. Set width & height of CropBox, if it has same dimensions as MediaBox.
     *   3. Set width & height of BleedBox, if it has same dimensions as MediaBox.
     *   4. Set width & height of TrimBox, if it has same dimensions as MediaBox.
     *   5. Set width & height of ArtBox, if it has same dimensions as MediaBox.
     *
     * This approach works well for most PDF documents as all PDF pages must
     * have a MediaBox, but relatively few have a CropBox, BleedBox, TrimBox, or
     * ArtBox. And when they do have these additional boxes, they often have the
     * same dimensions as the MediaBox. However, if you find this method does not
     * work for your document, consider setting the boxes directly:
     *   * [[PDFPage.setMediaBox]]
     *   * [[PDFPage.setCropBox]]
     *   * [[PDFPage.setBleedBox]]
     *   * [[PDFPage.setTrimBox]]
     *   * [[PDFPage.setArtBox]]
     *
     * @param width The new width of the page.
     * @param height The new height of the page.
     */
    PDFPage.prototype.setSize = function (width, height) {
        utils_1.assertIs(width, 'width', ['number']);
        utils_1.assertIs(height, 'height', ['number']);
        var mediaBox = this.getMediaBox();
        this.setMediaBox(mediaBox.x, mediaBox.y, width, height);
        var cropBox = this.getCropBox();
        var bleedBox = this.getBleedBox();
        var trimBox = this.getTrimBox();
        var artBox = this.getArtBox();
        var hasCropBox = this.node.CropBox();
        var hasBleedBox = this.node.BleedBox();
        var hasTrimBox = this.node.TrimBox();
        var hasArtBox = this.node.ArtBox();
        if (hasCropBox && utils_1.rectanglesAreEqual(cropBox, mediaBox)) {
            this.setCropBox(mediaBox.x, mediaBox.y, width, height);
        }
        if (hasBleedBox && utils_1.rectanglesAreEqual(bleedBox, mediaBox)) {
            this.setBleedBox(mediaBox.x, mediaBox.y, width, height);
        }
        if (hasTrimBox && utils_1.rectanglesAreEqual(trimBox, mediaBox)) {
            this.setTrimBox(mediaBox.x, mediaBox.y, width, height);
        }
        if (hasArtBox && utils_1.rectanglesAreEqual(artBox, mediaBox)) {
            this.setArtBox(mediaBox.x, mediaBox.y, width, height);
        }
    };
    /**
     * Resize this page by increasing or decreasing its width. For example:
     * ```js
     * page.setWidth(250)
     * page.setWidth(page.getWidth() + 50)
     * page.setWidth(page.getWidth() - 50)
     * ```
     *
     * This method uses [[PDFPage.setSize]] to set the page's width.
     *
     * @param width The new width of the page.
     */
    PDFPage.prototype.setWidth = function (width) {
        utils_1.assertIs(width, 'width', ['number']);
        this.setSize(width, this.getSize().height);
    };
    /**
     * Resize this page by increasing or decreasing its height. For example:
     * ```js
     * page.setHeight(500)
     * page.setHeight(page.getWidth() + 100)
     * page.setHeight(page.getWidth() - 100)
     * ```
     *
     * This method uses [[PDFPage.setSize]] to set the page's height.
     *
     * @param height The new height of the page.
     */
    PDFPage.prototype.setHeight = function (height) {
        utils_1.assertIs(height, 'height', ['number']);
        this.setSize(this.getSize().width, height);
    };
    /**
     * Set the MediaBox of this page. For example:
     * ```js
     * const mediaBox = page.getMediaBox()
     *
     * page.setMediaBox(0, 0, 250, 500)
     * page.setMediaBox(mediaBox.x, mediaBox.y, 50, 100)
     * page.setMediaBox(15, 5, mediaBox.width - 50, mediaBox.height - 100)
     * ```
     *
     * See [[PDFPage.getMediaBox]] for details about what the MediaBox represents.
     *
     * @param x The x coordinate of the lower left corner of the new MediaBox.
     * @param y The y coordinate of the lower left corner of the new MediaBox.
     * @param width The width of the new MediaBox.
     * @param height The height of the new MediaBox.
     */
    PDFPage.prototype.setMediaBox = function (x, y, width, height) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        utils_1.assertIs(width, 'width', ['number']);
        utils_1.assertIs(height, 'height', ['number']);
        var mediaBox = this.doc.context.obj([x, y, x + width, y + height]);
        this.node.set(core_1.PDFName.MediaBox, mediaBox);
    };
    /**
     * Set the CropBox of this page. For example:
     * ```js
     * const cropBox = page.getCropBox()
     *
     * page.setCropBox(0, 0, 250, 500)
     * page.setCropBox(cropBox.x, cropBox.y, 50, 100)
     * page.setCropBox(15, 5, cropBox.width - 50, cropBox.height - 100)
     * ```
     *
     * See [[PDFPage.getCropBox]] for details about what the CropBox represents.
     *
     * @param x The x coordinate of the lower left corner of the new CropBox.
     * @param y The y coordinate of the lower left corner of the new CropBox.
     * @param width The width of the new CropBox.
     * @param height The height of the new CropBox.
     */
    PDFPage.prototype.setCropBox = function (x, y, width, height) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        utils_1.assertIs(width, 'width', ['number']);
        utils_1.assertIs(height, 'height', ['number']);
        var cropBox = this.doc.context.obj([x, y, x + width, y + height]);
        this.node.set(core_1.PDFName.CropBox, cropBox);
    };
    /**
     * Set the BleedBox of this page. For example:
     * ```js
     * const bleedBox = page.getBleedBox()
     *
     * page.setBleedBox(0, 0, 250, 500)
     * page.setBleedBox(bleedBox.x, bleedBox.y, 50, 100)
     * page.setBleedBox(15, 5, bleedBox.width - 50, bleedBox.height - 100)
     * ```
     *
     * See [[PDFPage.getBleedBox]] for details about what the BleedBox represents.
     *
     * @param x The x coordinate of the lower left corner of the new BleedBox.
     * @param y The y coordinate of the lower left corner of the new BleedBox.
     * @param width The width of the new BleedBox.
     * @param height The height of the new BleedBox.
     */
    PDFPage.prototype.setBleedBox = function (x, y, width, height) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        utils_1.assertIs(width, 'width', ['number']);
        utils_1.assertIs(height, 'height', ['number']);
        var bleedBox = this.doc.context.obj([x, y, x + width, y + height]);
        this.node.set(core_1.PDFName.BleedBox, bleedBox);
    };
    /**
     * Set the TrimBox of this page. For example:
     * ```js
     * const trimBox = page.getTrimBox()
     *
     * page.setTrimBox(0, 0, 250, 500)
     * page.setTrimBox(trimBox.x, trimBox.y, 50, 100)
     * page.setTrimBox(15, 5, trimBox.width - 50, trimBox.height - 100)
     * ```
     *
     * See [[PDFPage.getTrimBox]] for details about what the TrimBox represents.
     *
     * @param x The x coordinate of the lower left corner of the new TrimBox.
     * @param y The y coordinate of the lower left corner of the new TrimBox.
     * @param width The width of the new TrimBox.
     * @param height The height of the new TrimBox.
     */
    PDFPage.prototype.setTrimBox = function (x, y, width, height) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        utils_1.assertIs(width, 'width', ['number']);
        utils_1.assertIs(height, 'height', ['number']);
        var trimBox = this.doc.context.obj([x, y, x + width, y + height]);
        this.node.set(core_1.PDFName.TrimBox, trimBox);
    };
    /**
     * Set the ArtBox of this page. For example:
     * ```js
     * const artBox = page.getArtBox()
     *
     * page.setArtBox(0, 0, 250, 500)
     * page.setArtBox(artBox.x, artBox.y, 50, 100)
     * page.setArtBox(15, 5, artBox.width - 50, artBox.height - 100)
     * ```
     *
     * See [[PDFPage.getArtBox]] for details about what the ArtBox represents.
     *
     * @param x The x coordinate of the lower left corner of the new ArtBox.
     * @param y The y coordinate of the lower left corner of the new ArtBox.
     * @param width The width of the new ArtBox.
     * @param height The height of the new ArtBox.
     */
    PDFPage.prototype.setArtBox = function (x, y, width, height) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        utils_1.assertIs(width, 'width', ['number']);
        utils_1.assertIs(height, 'height', ['number']);
        var artBox = this.doc.context.obj([x, y, x + width, y + height]);
        this.node.set(core_1.PDFName.ArtBox, artBox);
    };
    /**
     * Get this page's width and height. For example:
     * ```js
     * const { width, height } = page.getSize()
     * ```
     *
     * This method uses [[PDFPage.getMediaBox]] to obtain the page's
     * width and height.
     *
     * @returns The width and height of the page.
     */
    PDFPage.prototype.getSize = function () {
        var _a = this.getMediaBox(), width = _a.width, height = _a.height;
        return { width: width, height: height };
    };
    /**
     * Get this page's width. For example:
     * ```js
     * const width = page.getWidth()
     * ```
     *
     * This method uses [[PDFPage.getSize]] to obtain the page's size.
     *
     * @returns The width of the page.
     */
    PDFPage.prototype.getWidth = function () {
        return this.getSize().width;
    };
    /**
     * Get this page's height. For example:
     * ```js
     * const height = page.getHeight()
     * ```
     *
     * This method uses [[PDFPage.getSize]] to obtain the page's size.
     *
     * @returns The height of the page.
     */
    PDFPage.prototype.getHeight = function () {
        return this.getSize().height;
    };
    /**
     * Get the rectangle defining this page's MediaBox. For example:
     * ```js
     * const { x, y, width, height } = page.getMediaBox()
     * ```
     *
     * The MediaBox of a page defines the boundaries of the physical medium on
     * which the page is to be displayed/printed. It may include extended area
     * surrounding the page content for bleed marks, printing marks, etc...
     * It may also include areas close to the edges of the medium that cannot be
     * marked because of physical limitations of the output device. Content
     * falling outside this boundary may safely be discarded without affecting
     * the meaning of the PDF file.
     *
     * @returns An object defining the lower left corner of the MediaBox and its
     *          width & height.
     */
    PDFPage.prototype.getMediaBox = function () {
        var mediaBox = this.node.MediaBox();
        return mediaBox.asRectangle();
    };
    /**
     * Get the rectangle defining this page's CropBox. For example:
     * ```js
     * const { x, y, width, height } = page.getCropBox()
     * ```
     *
     * The CropBox of a page defines the region to which the contents of the page
     * shall be clipped when displayed or printed. Unlike the other boxes, the
     * CropBox does not necessarily represent the physical page geometry. It
     * merely imposes clipping on the page contents.
     *
     * The CropBox's default value is the page's MediaBox.
     *
     * @returns An object defining the lower left corner of the CropBox and its
     *          width & height.
     */
    PDFPage.prototype.getCropBox = function () {
        var _a;
        var cropBox = this.node.CropBox();
        return (_a = cropBox === null || cropBox === void 0 ? void 0 : cropBox.asRectangle()) !== null && _a !== void 0 ? _a : this.getMediaBox();
    };
    /**
     * Get the rectangle defining this page's BleedBox. For example:
     * ```js
     * const { x, y, width, height } = page.getBleedBox()
     * ```
     *
     * The BleedBox of a page defines the region to which the contents of the
     * page shall be clipped when output in a production environment. This may
     * include any extra bleed area needed to accommodate the physical
     * limitations of cutting, folding, and trimming equipment. The actual
     * printed page may include printing marks that fall outside the BleedBox.
     *
     * The BleedBox's default value is the page's CropBox.
     *
     * @returns An object defining the lower left corner of the BleedBox and its
     *          width & height.
     */
    PDFPage.prototype.getBleedBox = function () {
        var _a;
        var bleedBox = this.node.BleedBox();
        return (_a = bleedBox === null || bleedBox === void 0 ? void 0 : bleedBox.asRectangle()) !== null && _a !== void 0 ? _a : this.getCropBox();
    };
    /**
     * Get the rectangle defining this page's TrimBox. For example:
     * ```js
     * const { x, y, width, height } = page.getTrimBox()
     * ```
     *
     * The TrimBox of a page defines the intended dimensions of the finished
     * page after trimming. It may be smaller than the MediaBox to allow for
     * production-related content, such as printing instructions, cut marks, or
     * color bars.
     *
     * The TrimBox's default value is the page's CropBox.
     *
     * @returns An object defining the lower left corner of the TrimBox and its
     *          width & height.
     */
    PDFPage.prototype.getTrimBox = function () {
        var _a;
        var trimBox = this.node.TrimBox();
        return (_a = trimBox === null || trimBox === void 0 ? void 0 : trimBox.asRectangle()) !== null && _a !== void 0 ? _a : this.getCropBox();
    };
    /**
     * Get the rectangle defining this page's ArtBox. For example:
     * ```js
     * const { x, y, width, height } = page.getArtBox()
     * ```
     *
     * The ArtBox of a page defines the extent of the page's meaningful content
     * (including potential white space).
     *
     * The ArtBox's default value is the page's CropBox.
     *
     * @returns An object defining the lower left corner of the ArtBox and its
     *          width & height.
     */
    PDFPage.prototype.getArtBox = function () {
        var _a;
        var artBox = this.node.ArtBox();
        return (_a = artBox === null || artBox === void 0 ? void 0 : artBox.asRectangle()) !== null && _a !== void 0 ? _a : this.getCropBox();
    };
    /**
     * Translate this page's content to a new location on the page. This operation
     * is often useful after resizing the page with [[setSize]]. For example:
     * ```js
     * // Add 50 units of whitespace to the top and right of the page
     * page.setSize(page.getWidth() + 50, page.getHeight() + 50)
     *
     * // Move the page's content from the lower-left corner of the page
     * // to the top-right corner.
     * page.translateContent(50, 50)
     *
     * // Now there are 50 units of whitespace to the left and bottom of the page
     * ```
     * See also: [[resetPosition]]
     * @param x The new position on the x-axis for this page's content.
     * @param y The new position on the y-axis for this page's content.
     */
    PDFPage.prototype.translateContent = function (x, y) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        this.node.normalize();
        this.getContentStream();
        var start = this.createContentStream(operators_1.pushGraphicsState(), operators_1.translate(x, y));
        var startRef = this.doc.context.register(start);
        var end = this.createContentStream(operators_1.popGraphicsState());
        var endRef = this.doc.context.register(end);
        this.node.wrapContentStreams(startRef, endRef);
    };
    /**
     * Scale the size, content, and annotations of a page.
     *
     * For example:
     * ```js
     * page.scale(0.5, 0.5);
     * ```
     *
     * @param x The factor by which the width for the page should be scaled
     *          (e.g. `0.5` is 50%).
     * @param y The factor by which the height for the page should be scaled
     *          (e.g. `2.0` is 200%).
     */
    PDFPage.prototype.scale = function (x, y) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        this.setSize(this.getWidth() * x, this.getHeight() * y);
        this.scaleContent(x, y);
        this.scaleAnnotations(x, y);
    };
    /**
     * Scale the content of a page. This is useful after resizing an existing
     * page. This scales only the content, not the annotations.
     *
     * For example:
     * ```js
     * // Bisect the size of the page
     * page.setSize(page.getWidth() / 2, page.getHeight() / 2);
     *
     * // Scale the content of the page down by 50% in x and y
     * page.scaleContent(0.5, 0.5);
     * ```
     * See also: [[scaleAnnotations]]
     * @param x The factor by which the x-axis for the content should be scaled
     *          (e.g. `0.5` is 50%).
     * @param y The factor by which the y-axis for the content should be scaled
     *          (e.g. `2.0` is 200%).
     */
    PDFPage.prototype.scaleContent = function (x, y) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        this.node.normalize();
        this.getContentStream();
        var start = this.createContentStream(operators_1.pushGraphicsState(), operators_1.scale(x, y));
        var startRef = this.doc.context.register(start);
        var end = this.createContentStream(operators_1.popGraphicsState());
        var endRef = this.doc.context.register(end);
        this.node.wrapContentStreams(startRef, endRef);
    };
    /**
     * Scale the annotations of a page. This is useful if you want to scale a
     * page with comments or other annotations.
     * ```js
     * // Scale the content of the page down by 50% in x and y
     * page.scaleContent(0.5, 0.5);
     *
     * // Scale the content of the page down by 50% in x and y
     * page.scaleAnnotations(0.5, 0.5);
     * ```
     * See also: [[scaleContent]]
     * @param x The factor by which the x-axis for the annotations should be
     *          scaled (e.g. `0.5` is 50%).
     * @param y The factor by which the y-axis for the annotations should be
     *          scaled (e.g. `2.0` is 200%).
     */
    PDFPage.prototype.scaleAnnotations = function (x, y) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        var annots = this.node.Annots();
        if (!annots)
            return;
        for (var idx = 0; idx < annots.size(); idx++) {
            var annot = annots.lookup(idx);
            if (annot instanceof core_1.PDFDict)
                this.scaleAnnot(annot, x, y);
        }
    };
    /**
     * Reset the x and y coordinates of this page to `(0, 0)`. This operation is
     * often useful after calling [[translateContent]]. For example:
     * ```js
     * // Shift the page's contents up and to the right by 50 units
     * page.translateContent(50, 50)
     *
     * // This text will shifted - it will be drawn at (50, 50)
     * page.drawText('I am shifted')
     *
     * // Move back to (0, 0)
     * page.resetPosition()
     *
     * // This text will not be shifted - it will be drawn at (0, 0)
     * page.drawText('I am not shifted')
     * ```
     */
    PDFPage.prototype.resetPosition = function () {
        this.getContentStream(false);
        this.x = 0;
        this.y = 0;
    };
    /**
     * Choose a default font for this page. The default font will be used whenever
     * text is drawn on this page and no font is specified. For example:
     * ```js
     * import { StandardFonts } from 'pdf-lib'
     *
     * const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
     * const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
     *
     * const page = pdfDoc.addPage()
     *
     * page.setFont(helveticaFont)
     * page.drawText('I will be drawn in Helvetica')
     *
     * page.setFont(timesRomanFont)
     * page.drawText('I will be drawn in Courier', { font: courierFont })
     * ```
     * @param font The default font to be used when drawing text on this page.
     */
    PDFPage.prototype.setFont = function (font) {
        // TODO: Reuse image Font name if we've already added this image to Resources.Fonts
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        this.font = font;
        this.fontKey = this.node.newFontDictionary(this.font.name, this.font.ref);
    };
    /**
     * Choose a default font size for this page. The default font size will be
     * used whenever text is drawn on this page and no font size is specified.
     * For example:
     * ```js
     * page.setFontSize(12)
     * page.drawText('I will be drawn in size 12')
     *
     * page.setFontSize(36)
     * page.drawText('I will be drawn in size 24', { fontSize: 24 })
     * ```
     * @param fontSize The default font size to be used when drawing text on this
     *                 page.
     */
    PDFPage.prototype.setFontSize = function (fontSize) {
        utils_1.assertIs(fontSize, 'fontSize', ['number']);
        this.fontSize = fontSize;
    };
    /**
     * Choose a default font color for this page. The default font color will be
     * used whenever text is drawn on this page and no font color is specified.
     * For example:
     * ```js
     * import { rgb, cmyk, grayscale } from 'pdf-lib'
     *
     * page.setFontColor(rgb(0.97, 0.02, 0.97))
     * page.drawText('I will be drawn in pink')
     *
     * page.setFontColor(cmyk(0.4, 0.7, 0.39, 0.15))
     * page.drawText('I will be drawn in gray', { color: grayscale(0.5) })
     * ```
     * @param fontColor The default font color to be used when drawing text on
     *                  this page.
     */
    PDFPage.prototype.setFontColor = function (fontColor) {
        utils_1.assertIs(fontColor, 'fontColor', [[Object, 'Color']]);
        this.fontColor = fontColor;
    };
    /**
     * Choose a default line height for this page. The default line height will be
     * used whenever text is drawn on this page and no line height is specified.
     * For example:
     * ```js
     * page.setLineHeight(12);
     * page.drawText('These lines will be vertically \n separated by 12 units')
     *
     * page.setLineHeight(36);
     * page.drawText('These lines will be vertically \n separated by 24 units', {
     *   lineHeight: 24
     * })
     * ```
     * @param lineHeight The default line height to be used when drawing text on
     *                   this page.
     */
    PDFPage.prototype.setLineHeight = function (lineHeight) {
        utils_1.assertIs(lineHeight, 'lineHeight', ['number']);
        this.lineHeight = lineHeight;
    };
    /**
     * Get the default position of this page. For example:
     * ```js
     * const { x, y } = page.getPosition()
     * ```
     * @returns The default position of the page.
     */
    PDFPage.prototype.getPosition = function () {
        return { x: this.x, y: this.y };
    };
    /**
     * Get the default x coordinate of this page. For example:
     * ```js
     * const x = page.getX()
     * ```
     * @returns The default x coordinate of the page.
     */
    PDFPage.prototype.getX = function () {
        return this.x;
    };
    /**
     * Get the default y coordinate of this page. For example:
     * ```js
     * const y = page.getY()
     * ```
     * @returns The default y coordinate of the page.
     */
    PDFPage.prototype.getY = function () {
        return this.y;
    };
    /**
     * Change the default position of this page. For example:
     * ```js
     * page.moveTo(0, 0)
     * page.drawText('I will be drawn at the origin')
     *
     * page.moveTo(0, 25)
     * page.drawText('I will be drawn 25 units up')
     *
     * page.moveTo(25, 25)
     * page.drawText('I will be drawn 25 units up and 25 units to the right')
     * ```
     * @param x The new default position on the x-axis for this page.
     * @param y The new default position on the y-axis for this page.
     */
    PDFPage.prototype.moveTo = function (x, y) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        this.x = x;
        this.y = y;
    };
    /**
     * Change the default position of this page to be further down the y-axis.
     * For example:
     * ```js
     * page.moveTo(50, 50)
     * page.drawText('I will be drawn at (50, 50)')
     *
     * page.moveDown(10)
     * page.drawText('I will be drawn at (50, 40)')
     * ```
     * @param yDecrease The amount by which the page's default position along the
     *                  y-axis should be decreased.
     */
    PDFPage.prototype.moveDown = function (yDecrease) {
        utils_1.assertIs(yDecrease, 'yDecrease', ['number']);
        this.y -= yDecrease;
    };
    /**
     * Change the default position of this page to be further up the y-axis.
     * For example:
     * ```js
     * page.moveTo(50, 50)
     * page.drawText('I will be drawn at (50, 50)')
     *
     * page.moveUp(10)
     * page.drawText('I will be drawn at (50, 60)')
     * ```
     * @param yIncrease The amount by which the page's default position along the
     *                  y-axis should be increased.
     */
    PDFPage.prototype.moveUp = function (yIncrease) {
        utils_1.assertIs(yIncrease, 'yIncrease', ['number']);
        this.y += yIncrease;
    };
    /**
     * Change the default position of this page to be further left on the x-axis.
     * For example:
     * ```js
     * page.moveTo(50, 50)
     * page.drawText('I will be drawn at (50, 50)')
     *
     * page.moveLeft(10)
     * page.drawText('I will be drawn at (40, 50)')
     * ```
     * @param xDecrease The amount by which the page's default position along the
     *                  x-axis should be decreased.
     */
    PDFPage.prototype.moveLeft = function (xDecrease) {
        utils_1.assertIs(xDecrease, 'xDecrease', ['number']);
        this.x -= xDecrease;
    };
    /**
     * Change the default position of this page to be further right on the y-axis.
     * For example:
     * ```js
     * page.moveTo(50, 50)
     * page.drawText('I will be drawn at (50, 50)')
     *
     * page.moveRight(10)
     * page.drawText('I will be drawn at (60, 50)')
     * ```
     * @param xIncrease The amount by which the page's default position along the
     *                  x-axis should be increased.
     */
    PDFPage.prototype.moveRight = function (xIncrease) {
        utils_1.assertIs(xIncrease, 'xIncrease', ['number']);
        this.x += xIncrease;
    };
    /**
     * Push one or more operators to the end of this page's current content
     * stream. For example:
     * ```js
     * import {
     *   pushGraphicsState,
     *   moveTo,
     *   lineTo,
     *   closePath,
     *   setFillingColor,
     *   rgb,
     *   fill,
     *   popGraphicsState,
     * } from 'pdf-lib'
     *
     * // Draw a green triangle in the lower-left corner of the page
     * page.pushOperators(
     *   pushGraphicsState(),
     *   moveTo(0, 0),
     *   lineTo(100, 0),
     *   lineTo(50, 100),
     *   closePath(),
     *   setFillingColor(rgb(0.0, 1.0, 0.0)),
     *   fill(),
     *   popGraphicsState(),
     * )
     * ```
     * @param operator The operators to be pushed.
     */
    PDFPage.prototype.pushOperators = function () {
        var operator = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operator[_i] = arguments[_i];
        }
        utils_1.assertEachIs(operator, 'operator', [[core_1.PDFOperator, 'PDFOperator']]);
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operator);
    };
    /**
     * Draw one or more lines of text on this page. For example:
     * ```js
     * import { StandardFonts, rgb } from 'pdf-lib'
     *
     * const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
     *
     * const page = pdfDoc.addPage()
     *
     * page.setFont(helveticaFont)
     *
     * page.moveTo(5, 200)
     * page.drawText('The Life of an Egg', { size: 36 })
     *
     * page.moveDown(36)
     * page.drawText('An Epic Tale of Woe', { size: 30 })
     *
     * page.drawText(
     *   `Humpty Dumpty sat on a wall \n` +
     *   `Humpty Dumpty had a great fall; \n` +
     *   `All the king's horses and all the king's men \n` +
     *   `Couldn't put Humpty together again. \n`,
     *   {
     *     x: 25,
     *     y: 100,
     *     font: timesRomanFont,
     *     size: 24,
     *     color: rgb(1, 0, 0),
     *     lineHeight: 24,
     *     opacity: 0.75,
     *   },
     * )
     * ```
     * @param text The text to be drawn.
     * @param options The options to be used when drawing the text.
     */
    PDFPage.prototype.drawText = function (text, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (options === void 0) { options = {}; }
        utils_1.assertIs(text, 'text', ['string']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertRangeOrUndefined(options.opacity, 'opacity.opacity', 0, 1);
        utils_1.assertOrUndefined(options.font, 'options.font', [[PDFFont_1.default, 'PDFFont']]);
        utils_1.assertOrUndefined(options.size, 'options.size', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.xSkew, 'options.xSkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.ySkew, 'options.ySkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.lineHeight, 'options.lineHeight', ['number']);
        utils_1.assertOrUndefined(options.maxWidth, 'options.maxWidth', ['number']);
        utils_1.assertOrUndefined(options.wordBreaks, 'options.wordBreaks', [Array]);
        utils_1.assertIsOneOfOrUndefined(options.blendMode, 'options.blendMode', PDFPageOptions_1.BlendMode);
        var _h = this.setOrEmbedFont(options.font), oldFont = _h.oldFont, newFont = _h.newFont, newFontKey = _h.newFontKey;
        var fontSize = options.size || this.fontSize;
        var wordBreaks = options.wordBreaks || this.doc.defaultWordBreaks;
        var textWidth = function (t) { return newFont.widthOfTextAtSize(t, fontSize); };
        var lines = options.maxWidth === undefined
            ? utils_1.lineSplit(utils_1.cleanText(text))
            : utils_1.breakTextIntoLines(text, wordBreaks, options.maxWidth, textWidth);
        var encodedLines = new Array(lines.length);
        for (var idx = 0, len = lines.length; idx < len; idx++) {
            encodedLines[idx] = newFont.encodeText(lines[idx]);
        }
        var graphicsStateKey = this.maybeEmbedGraphicsState({
            opacity: options.opacity,
            blendMode: options.blendMode,
        });
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawLinesOfText(encodedLines, {
            color: (_a = options.color) !== null && _a !== void 0 ? _a : this.fontColor,
            font: newFontKey,
            size: fontSize,
            rotate: (_b = options.rotate) !== null && _b !== void 0 ? _b : rotations_1.degrees(0),
            xSkew: (_c = options.xSkew) !== null && _c !== void 0 ? _c : rotations_1.degrees(0),
            ySkew: (_d = options.ySkew) !== null && _d !== void 0 ? _d : rotations_1.degrees(0),
            x: (_e = options.x) !== null && _e !== void 0 ? _e : this.x,
            y: (_f = options.y) !== null && _f !== void 0 ? _f : this.y,
            lineHeight: (_g = options.lineHeight) !== null && _g !== void 0 ? _g : this.lineHeight,
            graphicsState: graphicsStateKey,
        }));
        if (options.font) {
            if (oldFont)
                this.setFont(oldFont);
            else
                this.resetFont();
        }
    };
    /**
     * Draw an image on this page. For example:
     * ```js
     * import { degrees } from 'pdf-lib'
     *
     * const jpgUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
     * const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer())
     *
     * const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)
     * const jpgDims = jpgImage.scale(0.5)
     *
     * const page = pdfDoc.addPage()
     *
     * page.drawImage(jpgImage, {
     *   x: 25,
     *   y: 25,
     *   width: jpgDims.width,
     *   height: jpgDims.height,
     *   rotate: degrees(30),
     *   opacity: 0.75,
     * })
     * ```
     * @param image The image to be drawn.
     * @param options The options to be used when drawing the image.
     */
    PDFPage.prototype.drawImage = function (image, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (options === void 0) { options = {}; }
        // TODO: Reuse image XObject name if we've already added this image to Resources.XObjects
        utils_1.assertIs(image, 'image', [[PDFImage_1.default, 'PDFImage']]);
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.width, 'options.width', ['number']);
        utils_1.assertOrUndefined(options.height, 'options.height', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.xSkew, 'options.xSkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.ySkew, 'options.ySkew', [[Object, 'Rotation']]);
        utils_1.assertRangeOrUndefined(options.opacity, 'opacity.opacity', 0, 1);
        utils_1.assertIsOneOfOrUndefined(options.blendMode, 'options.blendMode', PDFPageOptions_1.BlendMode);
        var xObjectKey = this.node.newXObject('Image', image.ref);
        var graphicsStateKey = this.maybeEmbedGraphicsState({
            opacity: options.opacity,
            blendMode: options.blendMode,
        });
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawImage(xObjectKey, {
            x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
            width: (_c = options.width) !== null && _c !== void 0 ? _c : image.size().width,
            height: (_d = options.height) !== null && _d !== void 0 ? _d : image.size().height,
            rotate: (_e = options.rotate) !== null && _e !== void 0 ? _e : rotations_1.degrees(0),
            xSkew: (_f = options.xSkew) !== null && _f !== void 0 ? _f : rotations_1.degrees(0),
            ySkew: (_g = options.ySkew) !== null && _g !== void 0 ? _g : rotations_1.degrees(0),
            graphicsState: graphicsStateKey,
        }));
    };
    /**
     * Draw an embedded PDF page on this page. For example:
     * ```js
     * import { degrees } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const page = pdfDoc.addPage()
     *
     * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
     * const sourcePdf = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())
     *
     * // Embed page 74 from the PDF
     * const [embeddedPage] = await pdfDoc.embedPdf(sourcePdf, 73)
     *
     * page.drawPage(embeddedPage, {
     *   x: 250,
     *   y: 200,
     *   xScale: 0.5,
     *   yScale: 0.5,
     *   rotate: degrees(30),
     *   opacity: 0.75,
     * })
     * ```
     *
     * The `options` argument accepts both `width`/`height` and `xScale`/`yScale`
     * as options. Since each of these options defines the size of the drawn page,
     * if both options are given, `width` and `height` take precedence and the
     * corresponding scale variants are ignored.
     *
     * @param embeddedPage The embedded page to be drawn.
     * @param options The options to be used when drawing the embedded page.
     */
    PDFPage.prototype.drawPage = function (embeddedPage, options) {
        var _a, _b, _c, _d, _e;
        if (options === void 0) { options = {}; }
        // TODO: Reuse embeddedPage XObject name if we've already added this embeddedPage to Resources.XObjects
        utils_1.assertIs(embeddedPage, 'embeddedPage', [
            [PDFEmbeddedPage_1.default, 'PDFEmbeddedPage'],
        ]);
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.xScale, 'options.xScale', ['number']);
        utils_1.assertOrUndefined(options.yScale, 'options.yScale', ['number']);
        utils_1.assertOrUndefined(options.width, 'options.width', ['number']);
        utils_1.assertOrUndefined(options.height, 'options.height', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.xSkew, 'options.xSkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.ySkew, 'options.ySkew', [[Object, 'Rotation']]);
        utils_1.assertRangeOrUndefined(options.opacity, 'opacity.opacity', 0, 1);
        utils_1.assertIsOneOfOrUndefined(options.blendMode, 'options.blendMode', PDFPageOptions_1.BlendMode);
        var xObjectKey = this.node.newXObject('EmbeddedPdfPage', embeddedPage.ref);
        var graphicsStateKey = this.maybeEmbedGraphicsState({
            opacity: options.opacity,
            blendMode: options.blendMode,
        });
        // prettier-ignore
        var xScale = (options.width !== undefined ? options.width / embeddedPage.width
            : options.xScale !== undefined ? options.xScale
                : 1);
        // prettier-ignore
        var yScale = (options.height !== undefined ? options.height / embeddedPage.height
            : options.yScale !== undefined ? options.yScale
                : 1);
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawPage(xObjectKey, {
            x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
            xScale: xScale,
            yScale: yScale,
            rotate: (_c = options.rotate) !== null && _c !== void 0 ? _c : rotations_1.degrees(0),
            xSkew: (_d = options.xSkew) !== null && _d !== void 0 ? _d : rotations_1.degrees(0),
            ySkew: (_e = options.ySkew) !== null && _e !== void 0 ? _e : rotations_1.degrees(0),
            graphicsState: graphicsStateKey,
        }));
    };
    /**
     * Draw an SVG path on this page. For example:
     * ```js
     * import { rgb } from 'pdf-lib'
     *
     * const svgPath = 'M 0,20 L 100,160 Q 130,200 150,120 C 190,-40 200,200 300,150 L 400,90'
     *
     * // Draw path as black line
     * page.drawSvgPath(svgPath, { x: 25, y: 75 })
     *
     * // Change border style and opacity
     * page.drawSvgPath(svgPath, {
     *   x: 25,
     *   y: 275,
     *   borderColor: rgb(0.5, 0.5, 0.5),
     *   borderWidth: 2,
     *   borderOpacity: 0.75,
     * })
     *
     * // Set fill color and opacity
     * page.drawSvgPath(svgPath, {
     *   x: 25,
     *   y: 475,
     *   color: rgb(1.0, 0, 0),
     *   opacity: 0.75,
     * })
     *
     * // Draw 50% of original size
     * page.drawSvgPath(svgPath, {
     *   x: 25,
     *   y: 675,
     *   scale: 0.5,
     * })
     * ```
     * @param path The SVG path to be drawn.
     * @param options The options to be used when drawing the SVG path.
     */
    PDFPage.prototype.drawSvgPath = function (path, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (options === void 0) { options = {}; }
        utils_1.assertIs(path, 'path', ['string']);
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.scale, 'options.scale', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.borderWidth, 'options.borderWidth', ['number']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertRangeOrUndefined(options.opacity, 'opacity.opacity', 0, 1);
        utils_1.assertOrUndefined(options.borderColor, 'options.borderColor', [
            [Object, 'Color'],
        ]);
        utils_1.assertOrUndefined(options.borderDashArray, 'options.borderDashArray', [
            Array,
        ]);
        utils_1.assertOrUndefined(options.borderDashPhase, 'options.borderDashPhase', [
            'number',
        ]);
        utils_1.assertIsOneOfOrUndefined(options.borderLineCap, 'options.borderLineCap', operators_1.LineCapStyle);
        utils_1.assertRangeOrUndefined(options.borderOpacity, 'options.borderOpacity', 0, 1);
        utils_1.assertIsOneOfOrUndefined(options.blendMode, 'options.blendMode', PDFPageOptions_1.BlendMode);
        var graphicsStateKey = this.maybeEmbedGraphicsState({
            opacity: options.opacity,
            borderOpacity: options.borderOpacity,
            blendMode: options.blendMode,
        });
        if (!('color' in options) && !('borderColor' in options)) {
            options.borderColor = colors_1.rgb(0, 0, 0);
        }
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawSvgPath(path, {
            x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
            scale: options.scale,
            rotate: (_c = options.rotate) !== null && _c !== void 0 ? _c : rotations_1.degrees(0),
            color: (_d = options.color) !== null && _d !== void 0 ? _d : undefined,
            borderColor: (_e = options.borderColor) !== null && _e !== void 0 ? _e : undefined,
            borderWidth: (_f = options.borderWidth) !== null && _f !== void 0 ? _f : 0,
            borderDashArray: (_g = options.borderDashArray) !== null && _g !== void 0 ? _g : undefined,
            borderDashPhase: (_h = options.borderDashPhase) !== null && _h !== void 0 ? _h : undefined,
            borderLineCap: (_j = options.borderLineCap) !== null && _j !== void 0 ? _j : undefined,
            graphicsState: graphicsStateKey,
        }));
    };
    /**
     * Draw a line on this page. For example:
     * ```js
     * import { rgb } from 'pdf-lib'
     *
     * page.drawLine({
     *   start: { x: 25, y: 75 },
     *   end: { x: 125, y: 175 },
     *   thickness: 2,
     *   color: rgb(0.75, 0.2, 0.2),
     *   opacity: 0.75,
     * })
     * ```
     * @param options The options to be used when drawing the line.
     */
    PDFPage.prototype.drawLine = function (options) {
        var _a, _b, _c, _d, _e;
        utils_1.assertIs(options.start, 'options.start', [
            [Object, '{ x: number, y: number }'],
        ]);
        utils_1.assertIs(options.end, 'options.end', [
            [Object, '{ x: number, y: number }'],
        ]);
        utils_1.assertIs(options.start.x, 'options.start.x', ['number']);
        utils_1.assertIs(options.start.y, 'options.start.y', ['number']);
        utils_1.assertIs(options.end.x, 'options.end.x', ['number']);
        utils_1.assertIs(options.end.y, 'options.end.y', ['number']);
        utils_1.assertOrUndefined(options.thickness, 'options.thickness', ['number']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertOrUndefined(options.dashArray, 'options.dashArray', [Array]);
        utils_1.assertOrUndefined(options.dashPhase, 'options.dashPhase', ['number']);
        utils_1.assertIsOneOfOrUndefined(options.lineCap, 'options.lineCap', operators_1.LineCapStyle);
        utils_1.assertRangeOrUndefined(options.opacity, 'opacity.opacity', 0, 1);
        utils_1.assertIsOneOfOrUndefined(options.blendMode, 'options.blendMode', PDFPageOptions_1.BlendMode);
        var graphicsStateKey = this.maybeEmbedGraphicsState({
            borderOpacity: options.opacity,
            blendMode: options.blendMode,
        });
        if (!('color' in options)) {
            options.color = colors_1.rgb(0, 0, 0);
        }
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawLine({
            start: options.start,
            end: options.end,
            thickness: (_a = options.thickness) !== null && _a !== void 0 ? _a : 1,
            color: (_b = options.color) !== null && _b !== void 0 ? _b : undefined,
            dashArray: (_c = options.dashArray) !== null && _c !== void 0 ? _c : undefined,
            dashPhase: (_d = options.dashPhase) !== null && _d !== void 0 ? _d : undefined,
            lineCap: (_e = options.lineCap) !== null && _e !== void 0 ? _e : undefined,
            graphicsState: graphicsStateKey,
        }));
    };
    /**
     * Draw a rectangle on this page. For example:
     * ```js
     * import { degrees, grayscale, rgb } from 'pdf-lib'
     *
     * page.drawRectangle({
     *   x: 25,
     *   y: 75,
     *   width: 250,
     *   height: 75,
     *   rotate: degrees(-15),
     *   borderWidth: 5,
     *   borderColor: grayscale(0.5),
     *   color: rgb(0.75, 0.2, 0.2),
     *   opacity: 0.5,
     *   borderOpacity: 0.75,
     * })
     * ```
     * @param options The options to be used when drawing the rectangle.
     */
    PDFPage.prototype.drawRectangle = function (options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        if (options === void 0) { options = {}; }
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.width, 'options.width', ['number']);
        utils_1.assertOrUndefined(options.height, 'options.height', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.xSkew, 'options.xSkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.ySkew, 'options.ySkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.borderWidth, 'options.borderWidth', ['number']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertRangeOrUndefined(options.opacity, 'opacity.opacity', 0, 1);
        utils_1.assertOrUndefined(options.borderColor, 'options.borderColor', [
            [Object, 'Color'],
        ]);
        utils_1.assertOrUndefined(options.borderDashArray, 'options.borderDashArray', [
            Array,
        ]);
        utils_1.assertOrUndefined(options.borderDashPhase, 'options.borderDashPhase', [
            'number',
        ]);
        utils_1.assertIsOneOfOrUndefined(options.borderLineCap, 'options.borderLineCap', operators_1.LineCapStyle);
        utils_1.assertRangeOrUndefined(options.borderOpacity, 'options.borderOpacity', 0, 1);
        utils_1.assertIsOneOfOrUndefined(options.blendMode, 'options.blendMode', PDFPageOptions_1.BlendMode);
        var graphicsStateKey = this.maybeEmbedGraphicsState({
            opacity: options.opacity,
            borderOpacity: options.borderOpacity,
            blendMode: options.blendMode,
        });
        if (!('color' in options) && !('borderColor' in options)) {
            options.color = colors_1.rgb(0, 0, 0);
        }
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawRectangle({
            x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
            width: (_c = options.width) !== null && _c !== void 0 ? _c : 150,
            height: (_d = options.height) !== null && _d !== void 0 ? _d : 100,
            rotate: (_e = options.rotate) !== null && _e !== void 0 ? _e : rotations_1.degrees(0),
            xSkew: (_f = options.xSkew) !== null && _f !== void 0 ? _f : rotations_1.degrees(0),
            ySkew: (_g = options.ySkew) !== null && _g !== void 0 ? _g : rotations_1.degrees(0),
            borderWidth: (_h = options.borderWidth) !== null && _h !== void 0 ? _h : 0,
            color: (_j = options.color) !== null && _j !== void 0 ? _j : undefined,
            borderColor: (_k = options.borderColor) !== null && _k !== void 0 ? _k : undefined,
            borderDashArray: (_l = options.borderDashArray) !== null && _l !== void 0 ? _l : undefined,
            borderDashPhase: (_m = options.borderDashPhase) !== null && _m !== void 0 ? _m : undefined,
            graphicsState: graphicsStateKey,
            borderLineCap: (_o = options.borderLineCap) !== null && _o !== void 0 ? _o : undefined,
        }));
    };
    /**
     * Draw a square on this page. For example:
     * ```js
     * import { degrees, grayscale, rgb } from 'pdf-lib'
     *
     * page.drawSquare({
     *   x: 25,
     *   y: 75,
     *   size: 100,
     *   rotate: degrees(-15),
     *   borderWidth: 5,
     *   borderColor: grayscale(0.5),
     *   color: rgb(0.75, 0.2, 0.2),
     *   opacity: 0.5,
     *   borderOpacity: 0.75,
     * })
     * ```
     * @param options The options to be used when drawing the square.
     */
    PDFPage.prototype.drawSquare = function (options) {
        if (options === void 0) { options = {}; }
        var size = options.size;
        utils_1.assertOrUndefined(size, 'size', ['number']);
        this.drawRectangle(tslib_1.__assign(tslib_1.__assign({}, options), { width: size, height: size }));
    };
    /**
     * Draw an ellipse on this page. For example:
     * ```js
     * import { grayscale, rgb } from 'pdf-lib'
     *
     * page.drawEllipse({
     *   x: 200,
     *   y: 75,
     *   xScale: 100,
     *   yScale: 50,
     *   borderWidth: 5,
     *   borderColor: grayscale(0.5),
     *   color: rgb(0.75, 0.2, 0.2),
     *   opacity: 0.5,
     *   borderOpacity: 0.75,
     * })
     * ```
     * @param options The options to be used when drawing the ellipse.
     */
    PDFPage.prototype.drawEllipse = function (options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (options === void 0) { options = {}; }
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.xScale, 'options.xScale', ['number']);
        utils_1.assertOrUndefined(options.yScale, 'options.yScale', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertRangeOrUndefined(options.opacity, 'opacity.opacity', 0, 1);
        utils_1.assertOrUndefined(options.borderColor, 'options.borderColor', [
            [Object, 'Color'],
        ]);
        utils_1.assertRangeOrUndefined(options.borderOpacity, 'options.borderOpacity', 0, 1);
        utils_1.assertOrUndefined(options.borderWidth, 'options.borderWidth', ['number']);
        utils_1.assertOrUndefined(options.borderDashArray, 'options.borderDashArray', [
            Array,
        ]);
        utils_1.assertOrUndefined(options.borderDashPhase, 'options.borderDashPhase', [
            'number',
        ]);
        utils_1.assertIsOneOfOrUndefined(options.borderLineCap, 'options.borderLineCap', operators_1.LineCapStyle);
        utils_1.assertIsOneOfOrUndefined(options.blendMode, 'options.blendMode', PDFPageOptions_1.BlendMode);
        var graphicsStateKey = this.maybeEmbedGraphicsState({
            opacity: options.opacity,
            borderOpacity: options.borderOpacity,
            blendMode: options.blendMode,
        });
        if (!('color' in options) && !('borderColor' in options)) {
            options.color = colors_1.rgb(0, 0, 0);
        }
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawEllipse({
            x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
            xScale: (_c = options.xScale) !== null && _c !== void 0 ? _c : 100,
            yScale: (_d = options.yScale) !== null && _d !== void 0 ? _d : 100,
            rotate: (_e = options.rotate) !== null && _e !== void 0 ? _e : undefined,
            color: (_f = options.color) !== null && _f !== void 0 ? _f : undefined,
            borderColor: (_g = options.borderColor) !== null && _g !== void 0 ? _g : undefined,
            borderWidth: (_h = options.borderWidth) !== null && _h !== void 0 ? _h : 0,
            borderDashArray: (_j = options.borderDashArray) !== null && _j !== void 0 ? _j : undefined,
            borderDashPhase: (_k = options.borderDashPhase) !== null && _k !== void 0 ? _k : undefined,
            borderLineCap: (_l = options.borderLineCap) !== null && _l !== void 0 ? _l : undefined,
            graphicsState: graphicsStateKey,
        }));
    };
    /**
     * Draw a circle on this page. For example:
     * ```js
     * import { grayscale, rgb } from 'pdf-lib'
     *
     * page.drawCircle({
     *   x: 200,
     *   y: 150,
     *   size: 100,
     *   borderWidth: 5,
     *   borderColor: grayscale(0.5),
     *   color: rgb(0.75, 0.2, 0.2),
     *   opacity: 0.5,
     *   borderOpacity: 0.75,
     * })
     * ```
     * @param options The options to be used when drawing the ellipse.
     */
    PDFPage.prototype.drawCircle = function (options) {
        if (options === void 0) { options = {}; }
        var _a = options.size, size = _a === void 0 ? 100 : _a;
        utils_1.assertOrUndefined(size, 'size', ['number']);
        this.drawEllipse(tslib_1.__assign(tslib_1.__assign({}, options), { xScale: size, yScale: size }));
    };
    PDFPage.prototype.setOrEmbedFont = function (font) {
        var oldFont = this.font;
        var oldFontKey = this.fontKey;
        if (font)
            this.setFont(font);
        else
            this.getFont();
        var newFont = this.font;
        var newFontKey = this.fontKey;
        return { oldFont: oldFont, oldFontKey: oldFontKey, newFont: newFont, newFontKey: newFontKey };
    };
    PDFPage.prototype.getFont = function () {
        if (!this.font || !this.fontKey) {
            var font = this.doc.embedStandardFont(StandardFonts_1.StandardFonts.Helvetica);
            this.setFont(font);
        }
        return [this.font, this.fontKey];
    };
    PDFPage.prototype.resetFont = function () {
        this.font = undefined;
        this.fontKey = undefined;
    };
    PDFPage.prototype.getContentStream = function (useExisting) {
        if (useExisting === void 0) { useExisting = true; }
        if (useExisting && this.contentStream)
            return this.contentStream;
        this.contentStream = this.createContentStream();
        this.contentStreamRef = this.doc.context.register(this.contentStream);
        this.node.addContentStream(this.contentStreamRef);
        return this.contentStream;
    };
    PDFPage.prototype.createContentStream = function () {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        var dict = this.doc.context.obj({});
        var contentStream = core_1.PDFContentStream.of(dict, operators);
        return contentStream;
    };
    PDFPage.prototype.maybeEmbedGraphicsState = function (options) {
        var opacity = options.opacity, borderOpacity = options.borderOpacity, blendMode = options.blendMode;
        if (opacity === undefined &&
            borderOpacity === undefined &&
            blendMode === undefined) {
            return undefined;
        }
        var graphicsState = this.doc.context.obj({
            Type: 'ExtGState',
            ca: opacity,
            CA: borderOpacity,
            BM: blendMode,
        });
        var key = this.node.newExtGState('GS', graphicsState);
        return key;
    };
    PDFPage.prototype.scaleAnnot = function (annot, x, y) {
        var selectors = ['RD', 'CL', 'Vertices', 'QuadPoints', 'L', 'Rect'];
        for (var idx = 0, len = selectors.length; idx < len; idx++) {
            var list = annot.lookup(core_1.PDFName.of(selectors[idx]));
            if (list instanceof core_1.PDFArray)
                list.scalePDFNumbers(x, y);
        }
        var inkLists = annot.lookup(core_1.PDFName.of('InkList'));
        if (inkLists instanceof core_1.PDFArray) {
            for (var idx = 0, len = inkLists.size(); idx < len; idx++) {
                var arr = inkLists.lookup(idx);
                if (arr instanceof core_1.PDFArray)
                    arr.scalePDFNumbers(x, y);
            }
        }
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.addPage]] and [[PDFDocument.insertPage]]
     * > methods, which can create instances of [[PDFPage]] for you.
     *
     * Create an instance of [[PDFPage]] from an existing leaf node.
     *
     * @param leafNode The leaf node to be wrapped.
     * @param ref The unique reference for the page.
     * @param doc The document to which the page will belong.
     */
    PDFPage.of = function (leafNode, ref, doc) {
        return new PDFPage(leafNode, ref, doc);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.addPage]] and [[PDFDocument.insertPage]]
     * > methods, which can create instances of [[PDFPage]] for you.
     *
     * Create an instance of [[PDFPage]].
     *
     * @param doc The document to which the page will belong.
     */
    PDFPage.create = function (doc) {
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        var dummyRef = core_1.PDFRef.of(-1);
        var pageLeaf = core_1.PDFPageLeaf.withContextAndParent(doc.context, dummyRef);
        var pageRef = doc.context.register(pageLeaf);
        return new PDFPage(pageLeaf, pageRef, doc);
    };
    return PDFPage;
}());
exports.default = PDFPage;
//# sourceMappingURL=PDFPage.js.map
}, function(modId) { var map = {"./colors":1767772065463,"./operations":1767772065462,"./operators":1767772065464,"./PDFDocument":1767772065571,"./PDFEmbeddedPage":1767772065572,"./PDFFont":1767772065573,"./PDFImage":1767772065574,"./PDFPageOptions":1767772065591,"./rotations":1767772065564,"./StandardFonts":1767772065585,"../core":1767772065466,"../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065571, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = require("./errors");
var PDFEmbeddedPage_1 = tslib_1.__importDefault(require("./PDFEmbeddedPage"));
var PDFFont_1 = tslib_1.__importDefault(require("./PDFFont"));
var PDFImage_1 = tslib_1.__importDefault(require("./PDFImage"));
var PDFPage_1 = tslib_1.__importDefault(require("./PDFPage"));
var PDFForm_1 = tslib_1.__importDefault(require("./form/PDFForm"));
var sizes_1 = require("./sizes");
var core_1 = require("../core");
var PDFDocumentOptions_1 = require("./PDFDocumentOptions");
var utils_1 = require("../utils");
var FileEmbedder_1 = tslib_1.__importStar(require("../core/embedders/FileEmbedder"));
var PDFEmbeddedFile_1 = tslib_1.__importDefault(require("./PDFEmbeddedFile"));
var PDFJavaScript_1 = tslib_1.__importDefault(require("./PDFJavaScript"));
var JavaScriptEmbedder_1 = tslib_1.__importDefault(require("../core/embedders/JavaScriptEmbedder"));
/**
 * Represents a PDF document.
 */
var PDFDocument = /** @class */ (function () {
    function PDFDocument(context, ignoreEncryption, updateMetadata) {
        var _this = this;
        /** The default word breaks used in PDFPage.drawText */
        this.defaultWordBreaks = [' '];
        this.computePages = function () {
            var pages = [];
            _this.catalog.Pages().traverse(function (node, ref) {
                if (node instanceof core_1.PDFPageLeaf) {
                    var page = _this.pageMap.get(node);
                    if (!page) {
                        page = PDFPage_1.default.of(node, ref, _this);
                        _this.pageMap.set(node, page);
                    }
                    pages.push(page);
                }
            });
            return pages;
        };
        this.getOrCreateForm = function () {
            var acroForm = _this.catalog.getOrCreateAcroForm();
            return PDFForm_1.default.of(acroForm, _this);
        };
        utils_1.assertIs(context, 'context', [[core_1.PDFContext, 'PDFContext']]);
        utils_1.assertIs(ignoreEncryption, 'ignoreEncryption', ['boolean']);
        this.context = context;
        this.catalog = context.lookup(context.trailerInfo.Root);
        this.isEncrypted = !!context.lookup(context.trailerInfo.Encrypt);
        this.pageCache = utils_1.Cache.populatedBy(this.computePages);
        this.pageMap = new Map();
        this.formCache = utils_1.Cache.populatedBy(this.getOrCreateForm);
        this.fonts = [];
        this.images = [];
        this.embeddedPages = [];
        this.embeddedFiles = [];
        this.javaScripts = [];
        if (!ignoreEncryption && this.isEncrypted)
            throw new errors_1.EncryptedPDFError();
        if (updateMetadata)
            this.updateInfoDict();
    }
    /**
     * Load an existing [[PDFDocument]]. The input data can be provided in
     * multiple formats:
     *
     * | Type          | Contents                                               |
     * | ------------- | ------------------------------------------------------ |
     * | `string`      | A base64 encoded string (or data URI) containing a PDF |
     * | `Uint8Array`  | The raw bytes of a PDF                                 |
     * | `ArrayBuffer` | The raw bytes of a PDF                                 |
     *
     * For example:
     * ```js
     * import { PDFDocument } from 'pdf-lib'
     *
     * // pdf=string
     * const base64 =
     *  'JVBERi0xLjcKJYGBgYEKCjUgMCBvYmoKPDwKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbm' +
     *  'd0aCAxMDQKPj4Kc3RyZWFtCniccwrhMlAAwaJ0Ln2P1Jyy1JLM5ERdc0MjCwUjE4WQNC4Q' +
     *  '6cNlCFZkqGCqYGSqEJLLZWNuYGZiZmbkYuZsZmlmZGRgZmluDCQNzc3NTM2NzdzMXMxMjQ' +
     *  'ztFEKyuEK0uFxDuAAOERdVCmVuZHN0cmVhbQplbmRvYmoKCjYgMCBvYmoKPDwKL0ZpbHRl' +
     *  'ciAvRmxhdGVEZWNvZGUKL1R5cGUgL09ialN0bQovTiA0Ci9GaXJzdCAyMAovTGVuZ3RoID' +
     *  'IxNQo+PgpzdHJlYW0KeJxVj9GqwjAMhu/zFHkBzTo3nCCCiiKIHPEICuJF3cKoSCu2E8/b' +
     *  '20wPIr1p8v9/8kVhgilmGfawX2CGaVrgcAi0/bsy0lrX7IGWpvJ4iJYEN3gEmrrGBlQwGs' +
     *  'HHO9VBX1wNrxAqMX87RBD5xpJuddqwd82tjAHxzV1U5LPgy52DKXWnr1Lheg+j/c/pzGVr' +
     *  'iqV0VlwZPXGPCJjElw/ybkwUmeoWgxesDXGhHJC/D/iikp1Av80ptKU0FdBEe25pPihAM1' +
     *  'u6ytgaaWfs2Hrz35CJT1+EWmAKZW5kc3RyZWFtCmVuZG9iagoKNyAwIG9iago8PAovU2l6' +
     *  'ZSA4Ci9Sb290IDIgMCBSCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9UeXBlIC9YUmVmCi9MZW' +
     *  '5ndGggMzgKL1cgWyAxIDIgMiBdCi9JbmRleCBbIDAgOCBdCj4+CnN0cmVhbQp4nBXEwREA' +
     *  'EBAEsCwz3vrvRmOOyyOoGhZdutHN2MT55fIAVocD+AplbmRzdHJlYW0KZW5kb2JqCgpzdG' +
     *  'FydHhyZWYKNTEwCiUlRU9G'
     *
     * const dataUri = 'data:application/pdf;base64,' + base64
     *
     * const pdfDoc1 = await PDFDocument.load(base64)
     * const pdfDoc2 = await PDFDocument.load(dataUri)
     *
     * // pdf=Uint8Array
     * import fs from 'fs'
     * const uint8Array = fs.readFileSync('with_update_sections.pdf')
     * const pdfDoc3 = await PDFDocument.load(uint8Array)
     *
     * // pdf=ArrayBuffer
     * const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
     * const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
     * const pdfDoc4 = await PDFDocument.load(arrayBuffer)
     *
     * ```
     *
     * @param pdf The input data containing a PDF document.
     * @param options The options to be used when loading the document.
     * @returns Resolves with a document loaded from the input.
     */
    PDFDocument.load = function (pdf, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, ignoreEncryption, _b, parseSpeed, _c, throwOnInvalidObject, _d, updateMetadata, _e, capNumbers, bytes, context;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = options.ignoreEncryption, ignoreEncryption = _a === void 0 ? false : _a, _b = options.parseSpeed, parseSpeed = _b === void 0 ? PDFDocumentOptions_1.ParseSpeeds.Slow : _b, _c = options.throwOnInvalidObject, throwOnInvalidObject = _c === void 0 ? false : _c, _d = options.updateMetadata, updateMetadata = _d === void 0 ? true : _d, _e = options.capNumbers, capNumbers = _e === void 0 ? false : _e;
                        utils_1.assertIs(pdf, 'pdf', ['string', Uint8Array, ArrayBuffer]);
                        utils_1.assertIs(ignoreEncryption, 'ignoreEncryption', ['boolean']);
                        utils_1.assertIs(parseSpeed, 'parseSpeed', ['number']);
                        utils_1.assertIs(throwOnInvalidObject, 'throwOnInvalidObject', ['boolean']);
                        bytes = utils_1.toUint8Array(pdf);
                        return [4 /*yield*/, core_1.PDFParser.forBytesWithOptions(bytes, parseSpeed, throwOnInvalidObject, capNumbers).parseDocument()];
                    case 1:
                        context = _f.sent();
                        return [2 /*return*/, new PDFDocument(context, ignoreEncryption, updateMetadata)];
                }
            });
        });
    };
    /**
     * Create a new [[PDFDocument]].
     * @returns Resolves with the newly created document.
     */
    PDFDocument.create = function (options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, updateMetadata, context, pageTree, pageTreeRef, catalog;
            return tslib_1.__generator(this, function (_b) {
                _a = options.updateMetadata, updateMetadata = _a === void 0 ? true : _a;
                context = core_1.PDFContext.create();
                pageTree = core_1.PDFPageTree.withContext(context);
                pageTreeRef = context.register(pageTree);
                catalog = core_1.PDFCatalog.withContextAndPages(context, pageTreeRef);
                context.trailerInfo.Root = context.register(catalog);
                return [2 /*return*/, new PDFDocument(context, false, updateMetadata)];
            });
        });
    };
    /**
     * Register a fontkit instance. This must be done before custom fonts can
     * be embedded. See [here](https://github.com/Hopding/pdf-lib/tree/master#fontkit-installation)
     * for instructions on how to install and register a fontkit instance.
     *
     * > You do **not** need to call this method to embed standard fonts.
     *
     * For example:
     * ```js
     * import { PDFDocument } from 'pdf-lib'
     * import fontkit from '@pdf-lib/fontkit'
     *
     * const pdfDoc = await PDFDocument.create()
     * pdfDoc.registerFontkit(fontkit)
     * ```
     *
     * @param fontkit The fontkit instance to be registered.
     */
    PDFDocument.prototype.registerFontkit = function (fontkit) {
        this.fontkit = fontkit;
    };
    /**
     * Get the [[PDFForm]] containing all interactive fields for this document.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const fields = form.getFields()
     * fields.forEach(field => {
     *   const type = field.constructor.name
     *   const name = field.getName()
     *   console.log(`${type}: ${name}`)
     * })
     * ```
     * @returns The form for this document.
     */
    PDFDocument.prototype.getForm = function () {
        var form = this.formCache.access();
        if (form.hasXFA()) {
            console.warn('Removing XFA form data as pdf-lib does not support reading or writing XFA');
            form.deleteXFA();
        }
        return form;
    };
    /**
     * Get this document's title metadata. The title appears in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * const title = pdfDoc.getTitle()
     * ```
     * @returns A string containing the title of this document, if it has one.
     */
    PDFDocument.prototype.getTitle = function () {
        var title = this.getInfoDict().lookup(core_1.PDFName.Title);
        if (!title)
            return undefined;
        assertIsLiteralOrHexString(title);
        return title.decodeText();
    };
    /**
     * Get this document's author metadata. The author appears in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * const author = pdfDoc.getAuthor()
     * ```
     * @returns A string containing the author of this document, if it has one.
     */
    PDFDocument.prototype.getAuthor = function () {
        var author = this.getInfoDict().lookup(core_1.PDFName.Author);
        if (!author)
            return undefined;
        assertIsLiteralOrHexString(author);
        return author.decodeText();
    };
    /**
     * Get this document's subject metadata. The subject appears in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * const subject = pdfDoc.getSubject()
     * ```
     * @returns A string containing the subject of this document, if it has one.
     */
    PDFDocument.prototype.getSubject = function () {
        var subject = this.getInfoDict().lookup(core_1.PDFName.Subject);
        if (!subject)
            return undefined;
        assertIsLiteralOrHexString(subject);
        return subject.decodeText();
    };
    /**
     * Get this document's keywords metadata. The keywords appear in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * const keywords = pdfDoc.getKeywords()
     * ```
     * @returns A string containing the keywords of this document, if it has any.
     */
    PDFDocument.prototype.getKeywords = function () {
        var keywords = this.getInfoDict().lookup(core_1.PDFName.Keywords);
        if (!keywords)
            return undefined;
        assertIsLiteralOrHexString(keywords);
        return keywords.decodeText();
    };
    /**
     * Get this document's creator metadata. The creator appears in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * const creator = pdfDoc.getCreator()
     * ```
     * @returns A string containing the creator of this document, if it has one.
     */
    PDFDocument.prototype.getCreator = function () {
        var creator = this.getInfoDict().lookup(core_1.PDFName.Creator);
        if (!creator)
            return undefined;
        assertIsLiteralOrHexString(creator);
        return creator.decodeText();
    };
    /**
     * Get this document's producer metadata. The producer appears in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * const producer = pdfDoc.getProducer()
     * ```
     * @returns A string containing the producer of this document, if it has one.
     */
    PDFDocument.prototype.getProducer = function () {
        var producer = this.getInfoDict().lookup(core_1.PDFName.Producer);
        if (!producer)
            return undefined;
        assertIsLiteralOrHexString(producer);
        return producer.decodeText();
    };
    /**
     * Get this document's creation date metadata. The creation date appears in
     * the "Document Properties" section of most PDF readers. For example:
     * ```js
     * const creationDate = pdfDoc.getCreationDate()
     * ```
     * @returns A Date containing the creation date of this document,
     *          if it has one.
     */
    PDFDocument.prototype.getCreationDate = function () {
        var creationDate = this.getInfoDict().lookup(core_1.PDFName.CreationDate);
        if (!creationDate)
            return undefined;
        assertIsLiteralOrHexString(creationDate);
        return creationDate.decodeDate();
    };
    /**
     * Get this document's modification date metadata. The modification date
     * appears in the "Document Properties" section of most PDF readers.
     * For example:
     * ```js
     * const modification = pdfDoc.getModificationDate()
     * ```
     * @returns A Date containing the modification date of this document,
     *          if it has one.
     */
    PDFDocument.prototype.getModificationDate = function () {
        var modificationDate = this.getInfoDict().lookup(core_1.PDFName.ModDate);
        if (!modificationDate)
            return undefined;
        assertIsLiteralOrHexString(modificationDate);
        return modificationDate.decodeDate();
    };
    /**
     * Set this document's title metadata. The title will appear in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * pdfDoc.setTitle('🥚 The Life of an Egg 🍳')
     * ```
     *
     * To display the title in the window's title bar, set the
     * `showInWindowTitleBar` option to `true` (works for _most_ PDF readers).
     * For example:
     * ```js
     * pdfDoc.setTitle('🥚 The Life of an Egg 🍳', { showInWindowTitleBar: true })
     * ```
     *
     * @param title The title of this document.
     * @param options The options to be used when setting the title.
     */
    PDFDocument.prototype.setTitle = function (title, options) {
        utils_1.assertIs(title, 'title', ['string']);
        var key = core_1.PDFName.of('Title');
        this.getInfoDict().set(key, core_1.PDFHexString.fromText(title));
        // Indicate that readers should display the title rather than the filename
        if (options === null || options === void 0 ? void 0 : options.showInWindowTitleBar) {
            var prefs = this.catalog.getOrCreateViewerPreferences();
            prefs.setDisplayDocTitle(true);
        }
    };
    /**
     * Set this document's author metadata. The author will appear in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * pdfDoc.setAuthor('Humpty Dumpty')
     * ```
     * @param author The author of this document.
     */
    PDFDocument.prototype.setAuthor = function (author) {
        utils_1.assertIs(author, 'author', ['string']);
        var key = core_1.PDFName.of('Author');
        this.getInfoDict().set(key, core_1.PDFHexString.fromText(author));
    };
    /**
     * Set this document's subject metadata. The subject will appear in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * pdfDoc.setSubject('📘 An Epic Tale of Woe 📖')
     * ```
     * @param subject The subject of this document.
     */
    PDFDocument.prototype.setSubject = function (subject) {
        utils_1.assertIs(subject, 'author', ['string']);
        var key = core_1.PDFName.of('Subject');
        this.getInfoDict().set(key, core_1.PDFHexString.fromText(subject));
    };
    /**
     * Set this document's keyword metadata. These keywords will appear in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * pdfDoc.setKeywords(['eggs', 'wall', 'fall', 'king', 'horses', 'men'])
     * ```
     * @param keywords An array of keywords associated with this document.
     */
    PDFDocument.prototype.setKeywords = function (keywords) {
        utils_1.assertIs(keywords, 'keywords', [Array]);
        var key = core_1.PDFName.of('Keywords');
        this.getInfoDict().set(key, core_1.PDFHexString.fromText(keywords.join(' ')));
    };
    /**
     * Set this document's creator metadata. The creator will appear in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * pdfDoc.setCreator('PDF App 9000 🤖')
     * ```
     * @param creator The creator of this document.
     */
    PDFDocument.prototype.setCreator = function (creator) {
        utils_1.assertIs(creator, 'creator', ['string']);
        var key = core_1.PDFName.of('Creator');
        this.getInfoDict().set(key, core_1.PDFHexString.fromText(creator));
    };
    /**
     * Set this document's producer metadata. The producer will appear in the
     * "Document Properties" section of most PDF readers. For example:
     * ```js
     * pdfDoc.setProducer('PDF App 9000 🤖')
     * ```
     * @param producer The producer of this document.
     */
    PDFDocument.prototype.setProducer = function (producer) {
        utils_1.assertIs(producer, 'creator', ['string']);
        var key = core_1.PDFName.of('Producer');
        this.getInfoDict().set(key, core_1.PDFHexString.fromText(producer));
    };
    /**
     * Set this document's language metadata. The language will appear in the
     * "Document Properties" section of some PDF readers. For example:
     * ```js
     * pdfDoc.setLanguage('en-us')
     * ```
     *
     * @param language An RFC 3066 _Language-Tag_ denoting the language of this
     *                 document, or an empty string if the language is unknown.
     */
    PDFDocument.prototype.setLanguage = function (language) {
        utils_1.assertIs(language, 'language', ['string']);
        var key = core_1.PDFName.of('Lang');
        this.catalog.set(key, core_1.PDFString.of(language));
    };
    /**
     * Set this document's creation date metadata. The creation date will appear
     * in the "Document Properties" section of most PDF readers. For example:
     * ```js
     * pdfDoc.setCreationDate(new Date())
     * ```
     * @param creationDate The date this document was created.
     */
    PDFDocument.prototype.setCreationDate = function (creationDate) {
        utils_1.assertIs(creationDate, 'creationDate', [[Date, 'Date']]);
        var key = core_1.PDFName.of('CreationDate');
        this.getInfoDict().set(key, core_1.PDFString.fromDate(creationDate));
    };
    /**
     * Set this document's modification date metadata. The modification date will
     * appear in the "Document Properties" section of most PDF readers. For
     * example:
     * ```js
     * pdfDoc.setModificationDate(new Date())
     * ```
     * @param modificationDate The date this document was last modified.
     */
    PDFDocument.prototype.setModificationDate = function (modificationDate) {
        utils_1.assertIs(modificationDate, 'modificationDate', [[Date, 'Date']]);
        var key = core_1.PDFName.of('ModDate');
        this.getInfoDict().set(key, core_1.PDFString.fromDate(modificationDate));
    };
    /**
     * Get the number of pages contained in this document. For example:
     * ```js
     * const totalPages = pdfDoc.getPageCount()
     * ```
     * @returns The number of pages in this document.
     */
    PDFDocument.prototype.getPageCount = function () {
        if (this.pageCount === undefined)
            this.pageCount = this.getPages().length;
        return this.pageCount;
    };
    /**
     * Get an array of all the pages contained in this document. The pages are
     * stored in the array in the same order that they are rendered in the
     * document. For example:
     * ```js
     * const pages = pdfDoc.getPages()
     * pages[0]   // The first page of the document
     * pages[2]   // The third page of the document
     * pages[197] // The 198th page of the document
     * ```
     * @returns An array of all the pages contained in this document.
     */
    PDFDocument.prototype.getPages = function () {
        return this.pageCache.access();
    };
    /**
     * Get the page rendered at a particular `index` of the document. For example:
     * ```js
     * pdfDoc.getPage(0)   // The first page of the document
     * pdfDoc.getPage(2)   // The third page of the document
     * pdfDoc.getPage(197) // The 198th page of the document
     * ```
     * @returns The [[PDFPage]] rendered at the given `index` of the document.
     */
    PDFDocument.prototype.getPage = function (index) {
        var pages = this.getPages();
        utils_1.assertRange(index, 'index', 0, pages.length - 1);
        return pages[index];
    };
    /**
     * Get an array of indices for all the pages contained in this document. The
     * array will contain a range of integers from
     * `0..pdfDoc.getPageCount() - 1`. For example:
     * ```js
     * const pdfDoc = await PDFDocument.create()
     * pdfDoc.addPage()
     * pdfDoc.addPage()
     * pdfDoc.addPage()
     *
     * const indices = pdfDoc.getPageIndices()
     * indices // => [0, 1, 2]
     * ```
     * @returns An array of indices for all pages contained in this document.
     */
    PDFDocument.prototype.getPageIndices = function () {
        return utils_1.range(0, this.getPageCount());
    };
    /**
     * Remove the page at a given index from this document. For example:
     * ```js
     * pdfDoc.removePage(0)   // Remove the first page of the document
     * pdfDoc.removePage(2)   // Remove the third page of the document
     * pdfDoc.removePage(197) // Remove the 198th page of the document
     * ```
     * Once a page has been removed, it will no longer be rendered at that index
     * in the document.
     * @param index The index of the page to be removed.
     */
    PDFDocument.prototype.removePage = function (index) {
        var pageCount = this.getPageCount();
        if (this.pageCount === 0)
            throw new errors_1.RemovePageFromEmptyDocumentError();
        utils_1.assertRange(index, 'index', 0, pageCount - 1);
        this.catalog.removeLeafNode(index);
        this.pageCount = pageCount - 1;
    };
    /**
     * Add a page to the end of this document. This method accepts three
     * different value types for the `page` parameter:
     *
     * | Type               | Behavior                                                                            |
     * | ------------------ | ----------------------------------------------------------------------------------- |
     * | `undefined`        | Create a new page and add it to the end of this document                            |
     * | `[number, number]` | Create a new page with the given dimensions and add it to the end of this document  |
     * | `PDFPage`          | Add the existing page to the end of this document                                   |
     *
     * For example:
     * ```js
     * // page=undefined
     * const newPage = pdfDoc.addPage()
     *
     * // page=[number, number]
     * import { PageSizes } from 'pdf-lib'
     * const newPage1 = pdfDoc.addPage(PageSizes.A7)
     * const newPage2 = pdfDoc.addPage(PageSizes.Letter)
     * const newPage3 = pdfDoc.addPage([500, 750])
     *
     * // page=PDFPage
     * const pdfDoc1 = await PDFDocument.create()
     * const pdfDoc2 = await PDFDocument.load(...)
     * const [existingPage] = await pdfDoc1.copyPages(pdfDoc2, [0])
     * pdfDoc1.addPage(existingPage)
     * ```
     *
     * @param page Optionally, the desired dimensions or existing page.
     * @returns The newly created (or existing) page.
     */
    PDFDocument.prototype.addPage = function (page) {
        utils_1.assertIs(page, 'page', ['undefined', [PDFPage_1.default, 'PDFPage'], Array]);
        return this.insertPage(this.getPageCount(), page);
    };
    /**
     * Insert a page at a given index within this document. This method accepts
     * three different value types for the `page` parameter:
     *
     * | Type               | Behavior                                                                       |
     * | ------------------ | ------------------------------------------------------------------------------ |
     * | `undefined`        | Create a new page and insert it into this document                             |
     * | `[number, number]` | Create a new page with the given dimensions and insert it into this document   |
     * | `PDFPage`          | Insert the existing page into this document                                    |
     *
     * For example:
     * ```js
     * // page=undefined
     * const newPage = pdfDoc.insertPage(2)
     *
     * // page=[number, number]
     * import { PageSizes } from 'pdf-lib'
     * const newPage1 = pdfDoc.insertPage(2, PageSizes.A7)
     * const newPage2 = pdfDoc.insertPage(0, PageSizes.Letter)
     * const newPage3 = pdfDoc.insertPage(198, [500, 750])
     *
     * // page=PDFPage
     * const pdfDoc1 = await PDFDocument.create()
     * const pdfDoc2 = await PDFDocument.load(...)
     * const [existingPage] = await pdfDoc1.copyPages(pdfDoc2, [0])
     * pdfDoc1.insertPage(0, existingPage)
     * ```
     *
     * @param index The index at which the page should be inserted (zero-based).
     * @param page Optionally, the desired dimensions or existing page.
     * @returns The newly created (or existing) page.
     */
    PDFDocument.prototype.insertPage = function (index, page) {
        var pageCount = this.getPageCount();
        utils_1.assertRange(index, 'index', 0, pageCount);
        utils_1.assertIs(page, 'page', ['undefined', [PDFPage_1.default, 'PDFPage'], Array]);
        if (!page || Array.isArray(page)) {
            var dims = Array.isArray(page) ? page : sizes_1.PageSizes.A4;
            page = PDFPage_1.default.create(this);
            page.setSize.apply(page, dims);
        }
        else if (page.doc !== this) {
            throw new errors_1.ForeignPageError();
        }
        var parentRef = this.catalog.insertLeafNode(page.ref, index);
        page.node.setParent(parentRef);
        this.pageMap.set(page.node, page);
        this.pageCache.invalidate();
        this.pageCount = pageCount + 1;
        return page;
    };
    /**
     * Copy pages from a source document into this document. Allows pages to be
     * copied between different [[PDFDocument]] instances. For example:
     * ```js
     * const pdfDoc = await PDFDocument.create()
     * const srcDoc = await PDFDocument.load(...)
     *
     * const copiedPages = await pdfDoc.copyPages(srcDoc, [0, 3, 89])
     * const [firstPage, fourthPage, ninetiethPage] = copiedPages;
     *
     * pdfDoc.addPage(fourthPage)
     * pdfDoc.insertPage(0, ninetiethPage)
     * pdfDoc.addPage(firstPage)
     * ```
     * @param srcDoc The document from which pages should be copied.
     * @param indices The indices of the pages that should be copied.
     * @returns Resolves with an array of pages copied into this document.
     */
    PDFDocument.prototype.copyPages = function (srcDoc, indices) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var copier, srcPages, copiedPages, idx, len, srcPage, copiedPage, ref;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils_1.assertIs(srcDoc, 'srcDoc', [[PDFDocument, 'PDFDocument']]);
                        utils_1.assertIs(indices, 'indices', [Array]);
                        return [4 /*yield*/, srcDoc.flush()];
                    case 1:
                        _a.sent();
                        copier = core_1.PDFObjectCopier.for(srcDoc.context, this.context);
                        srcPages = srcDoc.getPages();
                        copiedPages = new Array(indices.length);
                        for (idx = 0, len = indices.length; idx < len; idx++) {
                            srcPage = srcPages[indices[idx]];
                            copiedPage = copier.copy(srcPage.node);
                            ref = this.context.register(copiedPage);
                            copiedPages[idx] = PDFPage_1.default.of(copiedPage, ref, this);
                        }
                        return [2 /*return*/, copiedPages];
                }
            });
        });
    };
    /**
     * Get a copy of this document.
     *
     * For example:
     * ```js
     * const srcDoc = await PDFDocument.load(...)
     * const pdfDoc = await srcDoc.copy()
     * ```
     *
     * > **NOTE:**  This method won't copy all information over to the new
     * > document (acroforms, outlines, etc...).
     *
     * @returns Resolves with a copy this document.
     */
    PDFDocument.prototype.copy = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pdfCopy, contentPages, idx, len;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PDFDocument.create()];
                    case 1:
                        pdfCopy = _a.sent();
                        return [4 /*yield*/, pdfCopy.copyPages(this, this.getPageIndices())];
                    case 2:
                        contentPages = _a.sent();
                        for (idx = 0, len = contentPages.length; idx < len; idx++) {
                            pdfCopy.addPage(contentPages[idx]);
                        }
                        if (this.getAuthor() !== undefined) {
                            pdfCopy.setAuthor(this.getAuthor());
                        }
                        if (this.getCreationDate() !== undefined) {
                            pdfCopy.setCreationDate(this.getCreationDate());
                        }
                        if (this.getCreator() !== undefined) {
                            pdfCopy.setCreator(this.getCreator());
                        }
                        if (this.getModificationDate() !== undefined) {
                            pdfCopy.setModificationDate(this.getModificationDate());
                        }
                        if (this.getProducer() !== undefined) {
                            pdfCopy.setProducer(this.getProducer());
                        }
                        if (this.getSubject() !== undefined) {
                            pdfCopy.setSubject(this.getSubject());
                        }
                        if (this.getTitle() !== undefined) {
                            pdfCopy.setTitle(this.getTitle());
                        }
                        pdfCopy.defaultWordBreaks = this.defaultWordBreaks;
                        return [2 /*return*/, pdfCopy];
                }
            });
        });
    };
    /**
     * Add JavaScript to this document. The supplied `script` is executed when the
     * document is opened. The `script` can be used to perform some operation
     * when the document is opened (e.g. logging to the console), or it can be
     * used to define a function that can be referenced later in a JavaScript
     * action. For example:
     * ```js
     * // Show "Hello World!" in the console when the PDF is opened
     * pdfDoc.addJavaScript(
     *   'main',
     *   'console.show(); console.println("Hello World!");'
     * );
     *
     * // Define a function named "foo" that can be called in JavaScript Actions
     * pdfDoc.addJavaScript(
     *   'foo',
     *   'function foo() { return "foo"; }'
     * );
     * ```
     * See the [JavaScript for Acrobat API Reference](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/js_api_reference.pdf)
     * for details.
     * @param name The name of the script. Must be unique per document.
     * @param script The JavaScript to execute.
     */
    PDFDocument.prototype.addJavaScript = function (name, script) {
        utils_1.assertIs(name, 'name', ['string']);
        utils_1.assertIs(script, 'script', ['string']);
        var embedder = JavaScriptEmbedder_1.default.for(script, name);
        var ref = this.context.nextRef();
        var javaScript = PDFJavaScript_1.default.of(ref, this, embedder);
        this.javaScripts.push(javaScript);
    };
    /**
     * Add an attachment to this document. Attachments are visible in the
     * "Attachments" panel of Adobe Acrobat and some other PDF readers. Any
     * type of file can be added as an attachment. This includes, but is not
     * limited to, `.png`, `.jpg`, `.pdf`, `.csv`, `.docx`, and `.xlsx` files.
     *
     * The input data can be provided in multiple formats:
     *
     * | Type          | Contents                                                       |
     * | ------------- | -------------------------------------------------------------- |
     * | `string`      | A base64 encoded string (or data URI) containing an attachment |
     * | `Uint8Array`  | The raw bytes of an attachment                                 |
     * | `ArrayBuffer` | The raw bytes of an attachment                                 |
     *
     * For example:
     * ```js
     * // attachment=string
     * await pdfDoc.attach('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD...', 'cat_riding_unicorn.jpg', {
     *   mimeType: 'image/jpeg',
     *   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
     *   creationDate: new Date('2019/12/01'),
     *   modificationDate: new Date('2020/04/19'),
     * })
     * await pdfDoc.attach('data:image/jpeg;base64,/9j/4AAQ...', 'cat_riding_unicorn.jpg', {
     *   mimeType: 'image/jpeg',
     *   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
     *   creationDate: new Date('2019/12/01'),
     *   modificationDate: new Date('2020/04/19'),
     * })
     *
     * // attachment=Uint8Array
     * import fs from 'fs'
     * const uint8Array = fs.readFileSync('cat_riding_unicorn.jpg')
     * await pdfDoc.attach(uint8Array, 'cat_riding_unicorn.jpg', {
     *   mimeType: 'image/jpeg',
     *   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
     *   creationDate: new Date('2019/12/01'),
     *   modificationDate: new Date('2020/04/19'),
     * })
     *
     * // attachment=ArrayBuffer
     * const url = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
     * const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
     * await pdfDoc.attach(arrayBuffer, 'cat_riding_unicorn.jpg', {
     *   mimeType: 'image/jpeg',
     *   description: 'Cool cat riding a unicorn! 🦄🐈🕶️',
     *   creationDate: new Date('2019/12/01'),
     *   modificationDate: new Date('2020/04/19'),
     * })
     * ```
     *
     * @param attachment The input data containing the file to be attached.
     * @param name The name of the file to be attached.
     * @returns Resolves when the attachment is complete.
     */
    PDFDocument.prototype.attach = function (attachment, name, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var bytes, embedder, ref, embeddedFile;
            return tslib_1.__generator(this, function (_a) {
                utils_1.assertIs(attachment, 'attachment', ['string', Uint8Array, ArrayBuffer]);
                utils_1.assertIs(name, 'name', ['string']);
                utils_1.assertOrUndefined(options.mimeType, 'mimeType', ['string']);
                utils_1.assertOrUndefined(options.description, 'description', ['string']);
                utils_1.assertOrUndefined(options.creationDate, 'options.creationDate', [Date]);
                utils_1.assertOrUndefined(options.modificationDate, 'options.modificationDate', [
                    Date,
                ]);
                utils_1.assertIsOneOfOrUndefined(options.afRelationship, 'options.afRelationship', FileEmbedder_1.AFRelationship);
                bytes = utils_1.toUint8Array(attachment);
                embedder = FileEmbedder_1.default.for(bytes, name, options);
                ref = this.context.nextRef();
                embeddedFile = PDFEmbeddedFile_1.default.of(ref, this, embedder);
                this.embeddedFiles.push(embeddedFile);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Embed a font into this document. The input data can be provided in multiple
     * formats:
     *
     * | Type            | Contents                                                |
     * | --------------- | ------------------------------------------------------- |
     * | `StandardFonts` | One of the standard 14 fonts                            |
     * | `string`        | A base64 encoded string (or data URI) containing a font |
     * | `Uint8Array`    | The raw bytes of a font                                 |
     * | `ArrayBuffer`   | The raw bytes of a font                                 |
     *
     * For example:
     * ```js
     * // font=StandardFonts
     * import { StandardFonts } from 'pdf-lib'
     * const font1 = await pdfDoc.embedFont(StandardFonts.Helvetica)
     *
     * // font=string
     * const font2 = await pdfDoc.embedFont('AAEAAAAVAQAABABQRFNJRx/upe...')
     * const font3 = await pdfDoc.embedFont('data:font/opentype;base64,AAEAAA...')
     *
     * // font=Uint8Array
     * import fs from 'fs'
     * const font4 = await pdfDoc.embedFont(fs.readFileSync('Ubuntu-R.ttf'))
     *
     * // font=ArrayBuffer
     * const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf'
     * const ubuntuBytes = await fetch(url).then(res => res.arrayBuffer())
     * const font5 = await pdfDoc.embedFont(ubuntuBytes)
     * ```
     * See also: [[registerFontkit]]
     * @param font The input data for a font.
     * @param options The options to be used when embedding the font.
     * @returns Resolves with the embedded font.
     */
    PDFDocument.prototype.embedFont = function (font, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, subset, customName, features, embedder, bytes, fontkit, _b, ref, pdfFont;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = options.subset, subset = _a === void 0 ? false : _a, customName = options.customName, features = options.features;
                        utils_1.assertIs(font, 'font', ['string', Uint8Array, ArrayBuffer]);
                        utils_1.assertIs(subset, 'subset', ['boolean']);
                        if (!utils_1.isStandardFont(font)) return [3 /*break*/, 1];
                        embedder = core_1.StandardFontEmbedder.for(font, customName);
                        return [3 /*break*/, 7];
                    case 1:
                        if (!utils_1.canBeConvertedToUint8Array(font)) return [3 /*break*/, 6];
                        bytes = utils_1.toUint8Array(font);
                        fontkit = this.assertFontkit();
                        if (!subset) return [3 /*break*/, 3];
                        return [4 /*yield*/, core_1.CustomFontSubsetEmbedder.for(fontkit, bytes, customName, features)];
                    case 2:
                        _b = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, core_1.CustomFontEmbedder.for(fontkit, bytes, customName, features)];
                    case 4:
                        _b = _c.sent();
                        _c.label = 5;
                    case 5:
                        embedder = _b;
                        return [3 /*break*/, 7];
                    case 6: throw new TypeError('`font` must be one of `StandardFonts | string | Uint8Array | ArrayBuffer`');
                    case 7:
                        ref = this.context.nextRef();
                        pdfFont = PDFFont_1.default.of(ref, this, embedder);
                        this.fonts.push(pdfFont);
                        return [2 /*return*/, pdfFont];
                }
            });
        });
    };
    /**
     * Embed a standard font into this document.
     * For example:
     * ```js
     * import { StandardFonts } from 'pdf-lib'
     * const helveticaFont = pdfDoc.embedFont(StandardFonts.Helvetica)
     * ```
     * @param font The standard font to be embedded.
     * @param customName The name to be used when embedding the font.
     * @returns The embedded font.
     */
    PDFDocument.prototype.embedStandardFont = function (font, customName) {
        utils_1.assertIs(font, 'font', ['string']);
        if (!utils_1.isStandardFont(font)) {
            throw new TypeError('`font` must be one of type `StandardFonts`');
        }
        var embedder = core_1.StandardFontEmbedder.for(font, customName);
        var ref = this.context.nextRef();
        var pdfFont = PDFFont_1.default.of(ref, this, embedder);
        this.fonts.push(pdfFont);
        return pdfFont;
    };
    /**
     * Embed a JPEG image into this document. The input data can be provided in
     * multiple formats:
     *
     * | Type          | Contents                                                      |
     * | ------------- | ------------------------------------------------------------- |
     * | `string`      | A base64 encoded string (or data URI) containing a JPEG image |
     * | `Uint8Array`  | The raw bytes of a JPEG image                                 |
     * | `ArrayBuffer` | The raw bytes of a JPEG image                                 |
     *
     * For example:
     * ```js
     * // jpg=string
     * const image1 = await pdfDoc.embedJpg('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD...')
     * const image2 = await pdfDoc.embedJpg('data:image/jpeg;base64,/9j/4AAQ...')
     *
     * // jpg=Uint8Array
     * import fs from 'fs'
     * const uint8Array = fs.readFileSync('cat_riding_unicorn.jpg')
     * const image3 = await pdfDoc.embedJpg(uint8Array)
     *
     * // jpg=ArrayBuffer
     * const url = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
     * const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
     * const image4 = await pdfDoc.embedJpg(arrayBuffer)
     * ```
     *
     * @param jpg The input data for a JPEG image.
     * @returns Resolves with the embedded image.
     */
    PDFDocument.prototype.embedJpg = function (jpg) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var bytes, embedder, ref, pdfImage;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils_1.assertIs(jpg, 'jpg', ['string', Uint8Array, ArrayBuffer]);
                        bytes = utils_1.toUint8Array(jpg);
                        return [4 /*yield*/, core_1.JpegEmbedder.for(bytes)];
                    case 1:
                        embedder = _a.sent();
                        ref = this.context.nextRef();
                        pdfImage = PDFImage_1.default.of(ref, this, embedder);
                        this.images.push(pdfImage);
                        return [2 /*return*/, pdfImage];
                }
            });
        });
    };
    /**
     * Embed a PNG image into this document. The input data can be provided in
     * multiple formats:
     *
     * | Type          | Contents                                                     |
     * | ------------- | ------------------------------------------------------------ |
     * | `string`      | A base64 encoded string (or data URI) containing a PNG image |
     * | `Uint8Array`  | The raw bytes of a PNG image                                 |
     * | `ArrayBuffer` | The raw bytes of a PNG image                                 |
     *
     * For example:
     * ```js
     * // png=string
     * const image1 = await pdfDoc.embedPng('iVBORw0KGgoAAAANSUhEUgAAAlgAAAF3...')
     * const image2 = await pdfDoc.embedPng('data:image/png;base64,iVBORw0KGg...')
     *
     * // png=Uint8Array
     * import fs from 'fs'
     * const uint8Array = fs.readFileSync('small_mario.png')
     * const image3 = await pdfDoc.embedPng(uint8Array)
     *
     * // png=ArrayBuffer
     * const url = 'https://pdf-lib.js.org/assets/small_mario.png'
     * const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
     * const image4 = await pdfDoc.embedPng(arrayBuffer)
     * ```
     *
     * @param png The input data for a PNG image.
     * @returns Resolves with the embedded image.
     */
    PDFDocument.prototype.embedPng = function (png) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var bytes, embedder, ref, pdfImage;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils_1.assertIs(png, 'png', ['string', Uint8Array, ArrayBuffer]);
                        bytes = utils_1.toUint8Array(png);
                        return [4 /*yield*/, core_1.PngEmbedder.for(bytes)];
                    case 1:
                        embedder = _a.sent();
                        ref = this.context.nextRef();
                        pdfImage = PDFImage_1.default.of(ref, this, embedder);
                        this.images.push(pdfImage);
                        return [2 /*return*/, pdfImage];
                }
            });
        });
    };
    /**
     * Embed one or more PDF pages into this document.
     *
     * For example:
     * ```js
     * const pdfDoc = await PDFDocument.create()
     *
     * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
     * const sourcePdf = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())
     *
     * // Embed page 74 of `sourcePdf` into `pdfDoc`
     * const [embeddedPage] = await pdfDoc.embedPdf(sourcePdf, [73])
     * ```
     *
     * See [[PDFDocument.load]] for examples of the allowed input data formats.
     *
     * @param pdf The input data containing a PDF document.
     * @param indices The indices of the pages that should be embedded.
     * @returns Resolves with an array of the embedded pages.
     */
    PDFDocument.prototype.embedPdf = function (pdf, indices) {
        if (indices === void 0) { indices = [0]; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var srcDoc, _a, srcPages;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        utils_1.assertIs(pdf, 'pdf', [
                            'string',
                            Uint8Array,
                            ArrayBuffer,
                            [PDFDocument, 'PDFDocument'],
                        ]);
                        utils_1.assertIs(indices, 'indices', [Array]);
                        if (!(pdf instanceof PDFDocument)) return [3 /*break*/, 1];
                        _a = pdf;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, PDFDocument.load(pdf)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        srcDoc = _a;
                        srcPages = utils_1.pluckIndices(srcDoc.getPages(), indices);
                        return [2 /*return*/, this.embedPages(srcPages)];
                }
            });
        });
    };
    /**
     * Embed a single PDF page into this document.
     *
     * For example:
     * ```js
     * const pdfDoc = await PDFDocument.create()
     *
     * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
     * const sourceBuffer = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())
     * const sourcePdfDoc = await PDFDocument.load(sourceBuffer)
     * const sourcePdfPage = sourcePdfDoc.getPages()[73]
     *
     * const embeddedPage = await pdfDoc.embedPage(
     *   sourcePdfPage,
     *
     *   // Clip a section of the source page so that we only embed part of it
     *   { left: 100, right: 450, bottom: 330, top: 570 },
     *
     *   // Translate all drawings of the embedded page by (10, 200) units
     *   [1, 0, 0, 1, 10, 200],
     * )
     * ```
     *
     * @param page The page to be embedded.
     * @param boundingBox
     * Optionally, an area of the source page that should be embedded
     * (defaults to entire page).
     * @param transformationMatrix
     * Optionally, a transformation matrix that is always applied to the embedded
     * page anywhere it is drawn.
     * @returns Resolves with the embedded pdf page.
     */
    PDFDocument.prototype.embedPage = function (page, boundingBox, transformationMatrix) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var embeddedPage;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils_1.assertIs(page, 'page', [[PDFPage_1.default, 'PDFPage']]);
                        return [4 /*yield*/, this.embedPages([page], [boundingBox], [transformationMatrix])];
                    case 1:
                        embeddedPage = (_a.sent())[0];
                        return [2 /*return*/, embeddedPage];
                }
            });
        });
    };
    /**
     * Embed one or more PDF pages into this document.
     *
     * For example:
     * ```js
     * const pdfDoc = await PDFDocument.create()
     *
     * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
     * const sourceBuffer = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())
     * const sourcePdfDoc = await PDFDocument.load(sourceBuffer)
     *
     * const page1 = sourcePdfDoc.getPages()[0]
     * const page2 = sourcePdfDoc.getPages()[52]
     * const page3 = sourcePdfDoc.getPages()[73]
     *
     * const embeddedPages = await pdfDoc.embedPages([page1, page2, page3])
     * ```
     *
     * @param page
     * The pages to be embedded (they must all share the same context).
     * @param boundingBoxes
     * Optionally, an array of clipping boundaries - one for each page
     * (defaults to entirety of each page).
     * @param transformationMatrices
     * Optionally, an array of transformation matrices - one for each page
     * (each page's transformation will apply anywhere it is drawn).
     * @returns Resolves with an array of the embedded pdf pages.
     */
    PDFDocument.prototype.embedPages = function (pages, boundingBoxes, transformationMatrices) {
        if (boundingBoxes === void 0) { boundingBoxes = []; }
        if (transformationMatrices === void 0) { transformationMatrices = []; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var idx, len, currPage, nextPage, context, maybeCopyPage, embeddedPages, idx, len, page, box, matrix, embedder, ref;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pages.length === 0)
                            return [2 /*return*/, []];
                        // Assert all pages have the same context
                        for (idx = 0, len = pages.length - 1; idx < len; idx++) {
                            currPage = pages[idx];
                            nextPage = pages[idx + 1];
                            if (currPage.node.context !== nextPage.node.context) {
                                throw new core_1.PageEmbeddingMismatchedContextError();
                            }
                        }
                        context = pages[0].node.context;
                        maybeCopyPage = context === this.context
                            ? function (p) { return p; }
                            : core_1.PDFObjectCopier.for(context, this.context).copy;
                        embeddedPages = new Array(pages.length);
                        idx = 0, len = pages.length;
                        _b.label = 1;
                    case 1:
                        if (!(idx < len)) return [3 /*break*/, 4];
                        page = maybeCopyPage(pages[idx].node);
                        box = boundingBoxes[idx];
                        matrix = transformationMatrices[idx];
                        return [4 /*yield*/, core_1.PDFPageEmbedder.for(page, box, matrix)];
                    case 2:
                        embedder = _b.sent();
                        ref = this.context.nextRef();
                        embeddedPages[idx] = PDFEmbeddedPage_1.default.of(ref, this, embedder);
                        _b.label = 3;
                    case 3:
                        idx++;
                        return [3 /*break*/, 1];
                    case 4:
                        (_a = this.embeddedPages).push.apply(_a, embeddedPages);
                        return [2 /*return*/, embeddedPages];
                }
            });
        });
    };
    /**
     * > **NOTE:** You shouldn't need to call this method directly. The [[save]]
     * > and [[saveAsBase64]] methods will automatically ensure that all embedded
     * > assets are flushed before serializing the document.
     *
     * Flush all embedded fonts, PDF pages, and images to this document's
     * [[context]].
     *
     * @returns Resolves when the flush is complete.
     */
    PDFDocument.prototype.flush = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.embedAll(this.fonts)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.embedAll(this.images)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.embedAll(this.embeddedPages)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.embedAll(this.embeddedFiles)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.embedAll(this.javaScripts)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Serialize this document to an array of bytes making up a PDF file.
     * For example:
     * ```js
     * const pdfBytes = await pdfDoc.save()
     * ```
     *
     * There are a number of things you can do with the serialized document,
     * depending on the JavaScript environment you're running in:
     * * Write it to a file in Node or React Native
     * * Download it as a Blob in the browser
     * * Render it in an `iframe`
     *
     * @param options The options to be used when saving the document.
     * @returns Resolves with the bytes of the serialized document.
     */
    PDFDocument.prototype.save = function (options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, useObjectStreams, _b, addDefaultPage, _c, objectsPerTick, _d, updateFieldAppearances, form, Writer;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = options.useObjectStreams, useObjectStreams = _a === void 0 ? true : _a, _b = options.addDefaultPage, addDefaultPage = _b === void 0 ? true : _b, _c = options.objectsPerTick, objectsPerTick = _c === void 0 ? 50 : _c, _d = options.updateFieldAppearances, updateFieldAppearances = _d === void 0 ? true : _d;
                        utils_1.assertIs(useObjectStreams, 'useObjectStreams', ['boolean']);
                        utils_1.assertIs(addDefaultPage, 'addDefaultPage', ['boolean']);
                        utils_1.assertIs(objectsPerTick, 'objectsPerTick', ['number']);
                        utils_1.assertIs(updateFieldAppearances, 'updateFieldAppearances', ['boolean']);
                        if (addDefaultPage && this.getPageCount() === 0)
                            this.addPage();
                        if (updateFieldAppearances) {
                            form = this.formCache.getValue();
                            if (form)
                                form.updateFieldAppearances();
                        }
                        return [4 /*yield*/, this.flush()];
                    case 1:
                        _e.sent();
                        Writer = useObjectStreams ? core_1.PDFStreamWriter : core_1.PDFWriter;
                        return [2 /*return*/, Writer.forContext(this.context, objectsPerTick).serializeToBuffer()];
                }
            });
        });
    };
    /**
     * Serialize this document to a base64 encoded string or data URI making up a
     * PDF file. For example:
     * ```js
     * const base64String = await pdfDoc.saveAsBase64()
     * base64String // => 'JVBERi0xLjcKJYGBgYEKC...'
     *
     * const base64DataUri = await pdfDoc.saveAsBase64({ dataUri: true })
     * base64DataUri // => 'data:application/pdf;base64,JVBERi0xLjcKJYGBgYEKC...'
     * ```
     *
     * @param options The options to be used when saving the document.
     * @returns Resolves with a base64 encoded string or data URI of the
     *          serialized document.
     */
    PDFDocument.prototype.saveAsBase64 = function (options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, dataUri, otherOptions, bytes, base64;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = options.dataUri, dataUri = _a === void 0 ? false : _a, otherOptions = tslib_1.__rest(options, ["dataUri"]);
                        utils_1.assertIs(dataUri, 'dataUri', ['boolean']);
                        return [4 /*yield*/, this.save(otherOptions)];
                    case 1:
                        bytes = _b.sent();
                        base64 = utils_1.encodeToBase64(bytes);
                        return [2 /*return*/, dataUri ? "data:application/pdf;base64," + base64 : base64];
                }
            });
        });
    };
    PDFDocument.prototype.findPageForAnnotationRef = function (ref) {
        var pages = this.getPages();
        for (var idx = 0, len = pages.length; idx < len; idx++) {
            var page = pages[idx];
            var annotations = page.node.Annots();
            if ((annotations === null || annotations === void 0 ? void 0 : annotations.indexOf(ref)) !== undefined) {
                return page;
            }
        }
        return undefined;
    };
    PDFDocument.prototype.embedAll = function (embeddables) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var idx, len;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idx = 0, len = embeddables.length;
                        _a.label = 1;
                    case 1:
                        if (!(idx < len)) return [3 /*break*/, 4];
                        return [4 /*yield*/, embeddables[idx].embed()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        idx++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PDFDocument.prototype.updateInfoDict = function () {
        var pdfLib = "pdf-lib (https://github.com/Hopding/pdf-lib)";
        var now = new Date();
        var info = this.getInfoDict();
        this.setProducer(pdfLib);
        this.setModificationDate(now);
        if (!info.get(core_1.PDFName.of('Creator')))
            this.setCreator(pdfLib);
        if (!info.get(core_1.PDFName.of('CreationDate')))
            this.setCreationDate(now);
    };
    PDFDocument.prototype.getInfoDict = function () {
        var existingInfo = this.context.lookup(this.context.trailerInfo.Info);
        if (existingInfo instanceof core_1.PDFDict)
            return existingInfo;
        var newInfo = this.context.obj({});
        this.context.trailerInfo.Info = this.context.register(newInfo);
        return newInfo;
    };
    PDFDocument.prototype.assertFontkit = function () {
        if (!this.fontkit)
            throw new errors_1.FontkitNotRegisteredError();
        return this.fontkit;
    };
    return PDFDocument;
}());
exports.default = PDFDocument;
/* tslint:disable-next-line only-arrow-functions */
function assertIsLiteralOrHexString(pdfObject) {
    if (!(pdfObject instanceof core_1.PDFHexString) &&
        !(pdfObject instanceof core_1.PDFString)) {
        throw new core_1.UnexpectedObjectTypeError([core_1.PDFHexString, core_1.PDFString], pdfObject);
    }
}
//# sourceMappingURL=PDFDocument.js.map
}, function(modId) { var map = {"./errors":1767772065567,"./PDFEmbeddedPage":1767772065572,"./PDFFont":1767772065573,"./PDFImage":1767772065574,"./PDFPage":1767772065570,"./form/PDFForm":1767772065575,"./sizes":1767772065586,"../core":1767772065466,"./PDFDocumentOptions":1767772065587,"../utils":1767772065468,"../core/embedders/FileEmbedder":1767772065518,"./PDFEmbeddedFile":1767772065588,"./PDFJavaScript":1767772065589,"../core/embedders/JavaScriptEmbedder":1767772065590}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065572, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDocument_1 = tslib_1.__importDefault(require("./PDFDocument"));
var core_1 = require("../core");
var utils_1 = require("../utils");
/**
 * Represents a PDF page that has been embedded in a [[PDFDocument]].
 */
var PDFEmbeddedPage = /** @class */ (function () {
    function PDFEmbeddedPage(ref, doc, embedder) {
        this.alreadyEmbedded = false;
        utils_1.assertIs(ref, 'ref', [[core_1.PDFRef, 'PDFRef']]);
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        utils_1.assertIs(embedder, 'embedder', [[core_1.PDFPageEmbedder, 'PDFPageEmbedder']]);
        this.ref = ref;
        this.doc = doc;
        this.width = embedder.width;
        this.height = embedder.height;
        this.embedder = embedder;
    }
    /**
     * Compute the width and height of this page after being scaled by the
     * given `factor`. For example:
     * ```js
     * embeddedPage.width  // => 500
     * embeddedPage.height // => 250
     *
     * const scaled = embeddedPage.scale(0.5)
     * scaled.width  // => 250
     * scaled.height // => 125
     * ```
     * This operation is often useful before drawing a page with
     * [[PDFPage.drawPage]] to compute the `width` and `height` options.
     * @param factor The factor by which this page should be scaled.
     * @returns The width and height of the page after being scaled.
     */
    PDFEmbeddedPage.prototype.scale = function (factor) {
        utils_1.assertIs(factor, 'factor', ['number']);
        return { width: this.width * factor, height: this.height * factor };
    };
    /**
     * Get the width and height of this page. For example:
     * ```js
     * const { width, height } = embeddedPage.size()
     * ```
     * @returns The width and height of the page.
     */
    PDFEmbeddedPage.prototype.size = function () {
        return this.scale(1);
    };
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all embeddable pages get embedded.
     *
     * Embed this embeddable page in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    PDFEmbeddedPage.prototype.embed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.alreadyEmbedded) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.embedder.embedIntoContext(this.doc.context, this.ref)];
                    case 1:
                        _a.sent();
                        this.alreadyEmbedded = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.embedPdf]] and
     * > [[PDFDocument.embedPage]] methods, which will create instances of
     * > [[PDFEmbeddedPage]] for you.
     *
     * Create an instance of [[PDFEmbeddedPage]] from an existing ref and embedder
     *
     * @param ref The unique reference for this embedded page.
     * @param doc The document to which the embedded page will belong.
     * @param embedder The embedder that will be used to embed the page.
     */
    PDFEmbeddedPage.of = function (ref, doc, embedder) {
        return new PDFEmbeddedPage(ref, doc, embedder);
    };
    return PDFEmbeddedPage;
}());
exports.default = PDFEmbeddedPage;
//# sourceMappingURL=PDFEmbeddedPage.js.map
}, function(modId) { var map = {"./PDFDocument":1767772065571,"../core":1767772065466,"../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065573, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDocument_1 = tslib_1.__importDefault(require("./PDFDocument"));
var core_1 = require("../core");
var utils_1 = require("../utils");
/**
 * Represents a font that has been embedded in a [[PDFDocument]].
 */
var PDFFont = /** @class */ (function () {
    function PDFFont(ref, doc, embedder) {
        this.modified = true;
        utils_1.assertIs(ref, 'ref', [[core_1.PDFRef, 'PDFRef']]);
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        utils_1.assertIs(embedder, 'embedder', [
            [core_1.CustomFontEmbedder, 'CustomFontEmbedder'],
            [core_1.StandardFontEmbedder, 'StandardFontEmbedder'],
        ]);
        this.ref = ref;
        this.doc = doc;
        this.name = embedder.fontName;
        this.embedder = embedder;
    }
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFPage.drawText]] method will automatically encode the text it is
     * > given.
     *
     * Encodes a string of text in this font.
     *
     * @param text The text to be encoded.
     * @returns The encoded text as a hex string.
     */
    PDFFont.prototype.encodeText = function (text) {
        utils_1.assertIs(text, 'text', ['string']);
        this.modified = true;
        return this.embedder.encodeText(text);
    };
    /**
     * Measure the width of a string of text drawn in this font at a given size.
     * For example:
     * ```js
     * const width = font.widthOfTextAtSize('Foo Bar Qux Baz', 36)
     * ```
     * @param text The string of text to be measured.
     * @param size The font size to be used for this measurement.
     * @returns The width of the string of text when drawn in this font at the
     *          given size.
     */
    PDFFont.prototype.widthOfTextAtSize = function (text, size) {
        utils_1.assertIs(text, 'text', ['string']);
        utils_1.assertIs(size, 'size', ['number']);
        return this.embedder.widthOfTextAtSize(text, size);
    };
    /**
     * Measure the height of this font at a given size. For example:
     * ```js
     * const height = font.heightAtSize(24)
     * ```
     *
     * The `options.descender` value controls whether or not the font's
     * descender is included in the height calculation.
     *
     * @param size The font size to be used for this measurement.
     * @param options The options to be used when computing this measurement.
     * @returns The height of this font at the given size.
     */
    PDFFont.prototype.heightAtSize = function (size, options) {
        var _a;
        utils_1.assertIs(size, 'size', ['number']);
        utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.descender, 'options.descender', ['boolean']);
        return this.embedder.heightOfFontAtSize(size, {
            descender: (_a = options === null || options === void 0 ? void 0 : options.descender) !== null && _a !== void 0 ? _a : true,
        });
    };
    /**
     * Compute the font size at which this font is a given height. For example:
     * ```js
     * const fontSize = font.sizeAtHeight(12)
     * ```
     * @param height The height to be used for this calculation.
     * @returns The font size at which this font is the given height.
     */
    PDFFont.prototype.sizeAtHeight = function (height) {
        utils_1.assertIs(height, 'height', ['number']);
        return this.embedder.sizeOfFontAtHeight(height);
    };
    /**
     * Get the set of unicode code points that can be represented by this font.
     * @returns The set of unicode code points supported by this font.
     */
    PDFFont.prototype.getCharacterSet = function () {
        if (this.embedder instanceof core_1.StandardFontEmbedder) {
            return this.embedder.encoding.supportedCodePoints;
        }
        else {
            return this.embedder.font.characterSet;
        }
    };
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all fonts get embedded.
     *
     * Embed this font in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    PDFFont.prototype.embed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.modified) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.embedder.embedIntoContext(this.doc.context, this.ref)];
                    case 1:
                        _a.sent();
                        this.modified = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.embedFont]] and
     * > [[PDFDocument.embedStandardFont]] methods, which will create instances
     * > of [[PDFFont]] for you.
     *
     * Create an instance of [[PDFFont]] from an existing ref and embedder
     *
     * @param ref The unique reference for this font.
     * @param doc The document to which the font will belong.
     * @param embedder The embedder that will be used to embed the font.
     */
    PDFFont.of = function (ref, doc, embedder) {
        return new PDFFont(ref, doc, embedder);
    };
    return PDFFont;
}());
exports.default = PDFFont;
//# sourceMappingURL=PDFFont.js.map
}, function(modId) { var map = {"./PDFDocument":1767772065571,"../core":1767772065466,"../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065574, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDocument_1 = tslib_1.__importDefault(require("./PDFDocument"));
var core_1 = require("../core");
var utils_1 = require("../utils");
/**
 * Represents an image that has been embedded in a [[PDFDocument]].
 */
var PDFImage = /** @class */ (function () {
    function PDFImage(ref, doc, embedder) {
        utils_1.assertIs(ref, 'ref', [[core_1.PDFRef, 'PDFRef']]);
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        utils_1.assertIs(embedder, 'embedder', [
            [core_1.JpegEmbedder, 'JpegEmbedder'],
            [core_1.PngEmbedder, 'PngEmbedder'],
        ]);
        this.ref = ref;
        this.doc = doc;
        this.width = embedder.width;
        this.height = embedder.height;
        this.embedder = embedder;
    }
    /**
     * Compute the width and height of this image after being scaled by the
     * given `factor`. For example:
     * ```js
     * image.width  // => 500
     * image.height // => 250
     *
     * const scaled = image.scale(0.5)
     * scaled.width  // => 250
     * scaled.height // => 125
     * ```
     * This operation is often useful before drawing an image with
     * [[PDFPage.drawImage]] to compute the `width` and `height` options.
     * @param factor The factor by which this image should be scaled.
     * @returns The width and height of the image after being scaled.
     */
    PDFImage.prototype.scale = function (factor) {
        utils_1.assertIs(factor, 'factor', ['number']);
        return { width: this.width * factor, height: this.height * factor };
    };
    /**
     * Get the width and height of this image after scaling it as large as
     * possible while maintaining its aspect ratio and not exceeding the
     * specified `width` and `height`. For example:
     * ```
     * image.width  // => 500
     * image.height // => 250
     *
     * const scaled = image.scaleToFit(750, 1000)
     * scaled.width  // => 750
     * scaled.height // => 375
     * ```
     * The `width` and `height` parameters can also be thought of as the width
     * and height of a box that the scaled image must fit within.
     * @param width The bounding box's width.
     * @param height The bounding box's height.
     * @returns The width and height of the image after being scaled.
     */
    PDFImage.prototype.scaleToFit = function (width, height) {
        utils_1.assertIs(width, 'width', ['number']);
        utils_1.assertIs(height, 'height', ['number']);
        var imgWidthScale = width / this.width;
        var imgHeightScale = height / this.height;
        var scale = Math.min(imgWidthScale, imgHeightScale);
        return this.scale(scale);
    };
    /**
     * Get the width and height of this image. For example:
     * ```js
     * const { width, height } = image.size()
     * ```
     * @returns The width and height of the image.
     */
    PDFImage.prototype.size = function () {
        return this.scale(1);
    };
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all images get embedded.
     *
     * Embed this image in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    PDFImage.prototype.embed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, doc, ref;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.embedder)
                            return [2 /*return*/];
                        // The image should only be embedded once. If there's a pending embed
                        // operation then wait on it. Otherwise we need to start the embed.
                        if (!this.embedTask) {
                            _a = this, doc = _a.doc, ref = _a.ref;
                            this.embedTask = this.embedder.embedIntoContext(doc.context, ref);
                        }
                        return [4 /*yield*/, this.embedTask];
                    case 1:
                        _b.sent();
                        // We clear `this.embedder` so that the indirectly referenced image data
                        // can be garbage collected, thus avoiding a memory leak.
                        // See https://github.com/Hopding/pdf-lib/pull/1032/files.
                        this.embedder = undefined;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.embedPng]] and [[PDFDocument.embedJpg]]
     * > methods, which will create instances of [[PDFImage]] for you.
     *
     * Create an instance of [[PDFImage]] from an existing ref and embedder
     *
     * @param ref The unique reference for this image.
     * @param doc The document to which the image will belong.
     * @param embedder The embedder that will be used to embed the image.
     */
    PDFImage.of = function (ref, doc, embedder) {
        return new PDFImage(ref, doc, embedder);
    };
    return PDFImage;
}());
exports.default = PDFImage;
//# sourceMappingURL=PDFImage.js.map
}, function(modId) { var map = {"./PDFDocument":1767772065571,"../core":1767772065466,"../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065575, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFDocument_1 = tslib_1.__importDefault(require("../PDFDocument"));
var PDFButton_1 = tslib_1.__importDefault(require("./PDFButton"));
var PDFCheckBox_1 = tslib_1.__importDefault(require("./PDFCheckBox"));
var PDFDropdown_1 = tslib_1.__importDefault(require("./PDFDropdown"));
var PDFOptionList_1 = tslib_1.__importDefault(require("./PDFOptionList"));
var PDFRadioGroup_1 = tslib_1.__importDefault(require("./PDFRadioGroup"));
var PDFSignature_1 = tslib_1.__importDefault(require("./PDFSignature"));
var PDFTextField_1 = tslib_1.__importDefault(require("./PDFTextField"));
var errors_1 = require("../errors");
var PDFFont_1 = tslib_1.__importDefault(require("../PDFFont"));
var StandardFonts_1 = require("../StandardFonts");
var operations_1 = require("../operations");
var operators_1 = require("../operators");
var core_1 = require("../../core");
var utils_1 = require("../../utils");
/**
 * Represents the interactive form of a [[PDFDocument]].
 *
 * Interactive forms (sometimes called _AcroForms_) are collections of fields
 * designed to gather information from a user. A PDF document may contains any
 * number of fields that appear on various pages, all of which make up a single,
 * global interactive form spanning the entire document. This means that
 * instances of [[PDFDocument]] shall contain at most one [[PDFForm]].
 *
 * The fields of an interactive form are represented by [[PDFField]] instances.
 */
var PDFForm = /** @class */ (function () {
    function PDFForm(acroForm, doc) {
        var _this = this;
        this.embedDefaultFont = function () {
            return _this.doc.embedStandardFont(StandardFonts_1.StandardFonts.Helvetica);
        };
        utils_1.assertIs(acroForm, 'acroForm', [[core_1.PDFAcroForm, 'PDFAcroForm']]);
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        this.acroForm = acroForm;
        this.doc = doc;
        this.dirtyFields = new Set();
        this.defaultFontCache = utils_1.Cache.populatedBy(this.embedDefaultFont);
    }
    /**
     * Returns `true` if this [[PDFForm]] has XFA data. Most PDFs with form
     * fields do not use XFA as it is not widely supported by PDF readers.
     *
     * > `pdf-lib` does not support creation, modification, or reading of XFA
     * > fields.
     *
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * if (form.hasXFA()) console.log('PDF has XFA data')
     * ```
     * @returns Whether or not this form has XFA data.
     */
    PDFForm.prototype.hasXFA = function () {
        return this.acroForm.dict.has(core_1.PDFName.of('XFA'));
    };
    /**
     * Disconnect the XFA data from this [[PDFForm]] (if any exists). This will
     * force readers to fallback to standard fields if the [[PDFDocument]]
     * contains any. For example:
     *
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * form.deleteXFA()
     * ```
     */
    PDFForm.prototype.deleteXFA = function () {
        this.acroForm.dict.delete(core_1.PDFName.of('XFA'));
    };
    /**
     * Get all fields contained in this [[PDFForm]]. For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const fields = form.getFields()
     * fields.forEach(field => {
     *   const type = field.constructor.name
     *   const name = field.getName()
     *   console.log(`${type}: ${name}`)
     * })
     * ```
     * @returns An array of all fields in this form.
     */
    PDFForm.prototype.getFields = function () {
        var allFields = this.acroForm.getAllFields();
        var fields = [];
        for (var idx = 0, len = allFields.length; idx < len; idx++) {
            var _a = allFields[idx], acroField = _a[0], ref = _a[1];
            var field = convertToPDFField(acroField, ref, this.doc);
            if (field)
                fields.push(field);
        }
        return fields;
    };
    /**
     * Get the field in this [[PDFForm]] with the given name. For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getFieldMaybe('Page1.Foo.Bar[0]')
     * if (field) console.log('Field exists!')
     * ```
     * @param name A fully qualified field name.
     * @returns The field with the specified name, if one exists.
     */
    PDFForm.prototype.getFieldMaybe = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var fields = this.getFields();
        for (var idx = 0, len = fields.length; idx < len; idx++) {
            var field = fields[idx];
            if (field.getName() === name)
                return field;
        }
        return undefined;
    };
    /**
     * Get the field in this [[PDFForm]] with the given name. For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getField('Page1.Foo.Bar[0]')
     * ```
     * If no field exists with the provided name, an error will be thrown.
     * @param name A fully qualified field name.
     * @returns The field with the specified name.
     */
    PDFForm.prototype.getField = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var field = this.getFieldMaybe(name);
        if (field)
            return field;
        throw new errors_1.NoSuchFieldError(name);
    };
    /**
     * Get the button field in this [[PDFForm]] with the given name. For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const button = form.getButton('Page1.Foo.Button[0]')
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a button.
     * @param name A fully qualified button name.
     * @returns The button with the specified name.
     */
    PDFForm.prototype.getButton = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFButton_1.default)
            return field;
        throw new errors_1.UnexpectedFieldTypeError(name, PDFButton_1.default, field);
    };
    /**
     * Get the check box field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const checkBox = form.getCheckBox('Page1.Foo.CheckBox[0]')
     * checkBox.check()
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a check box.
     * @param name A fully qualified check box name.
     * @returns The check box with the specified name.
     */
    PDFForm.prototype.getCheckBox = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFCheckBox_1.default)
            return field;
        throw new errors_1.UnexpectedFieldTypeError(name, PDFCheckBox_1.default, field);
    };
    /**
     * Get the dropdown field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const dropdown = form.getDropdown('Page1.Foo.Dropdown[0]')
     * const options = dropdown.getOptions()
     * dropdown.select(options[0])
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a dropdown.
     * @param name A fully qualified dropdown name.
     * @returns The dropdown with the specified name.
     */
    PDFForm.prototype.getDropdown = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFDropdown_1.default)
            return field;
        throw new errors_1.UnexpectedFieldTypeError(name, PDFDropdown_1.default, field);
    };
    /**
     * Get the option list field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const optionList = form.getOptionList('Page1.Foo.OptionList[0]')
     * const options = optionList.getOptions()
     * optionList.select(options[0])
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not an option list.
     * @param name A fully qualified option list name.
     * @returns The option list with the specified name.
     */
    PDFForm.prototype.getOptionList = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFOptionList_1.default)
            return field;
        throw new errors_1.UnexpectedFieldTypeError(name, PDFOptionList_1.default, field);
    };
    /**
     * Get the radio group field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const radioGroup = form.getRadioGroup('Page1.Foo.RadioGroup[0]')
     * const options = radioGroup.getOptions()
     * radioGroup.select(options[0])
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a radio group.
     * @param name A fully qualified radio group name.
     * @returns The radio group with the specified name.
     */
    PDFForm.prototype.getRadioGroup = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFRadioGroup_1.default)
            return field;
        throw new errors_1.UnexpectedFieldTypeError(name, PDFRadioGroup_1.default, field);
    };
    /**
     * Get the signature field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const signature = form.getSignature('Page1.Foo.Signature[0]')
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a signature.
     * @param name A fully qualified signature name.
     * @returns The signature with the specified name.
     */
    PDFForm.prototype.getSignature = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFSignature_1.default)
            return field;
        throw new errors_1.UnexpectedFieldTypeError(name, PDFSignature_1.default, field);
    };
    /**
     * Get the text field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const form = pdfDoc.getForm()
     * const textField = form.getTextField('Page1.Foo.TextField[0]')
     * textField.setText('Are you designed to act or to be acted upon?')
     * ```
     * An error will be thrown if no field exists with the provided name, or if
     * the field exists but is not a text field.
     * @param name A fully qualified text field name.
     * @returns The text field with the specified name.
     */
    PDFForm.prototype.getTextField = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var field = this.getField(name);
        if (field instanceof PDFTextField_1.default)
            return field;
        throw new errors_1.UnexpectedFieldTypeError(name, PDFTextField_1.default, field);
    };
    /**
     * Create a new button field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const button = form.createButton('cool.new.button')
     *
     * button.addToPage('Do Stuff', font, page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new button.
     * @returns The new button field.
     */
    PDFForm.prototype.createButton = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var button = core_1.PDFAcroPushButton.create(this.doc.context);
        button.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [button, button.ref], nameParts.terminal);
        return PDFButton_1.default.of(button, button.ref, this.doc);
    };
    /**
     * Create a new check box field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const checkBox = form.createCheckBox('cool.new.checkBox')
     *
     * checkBox.addToPage(page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new check box.
     * @returns The new check box field.
     */
    PDFForm.prototype.createCheckBox = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var checkBox = core_1.PDFAcroCheckBox.create(this.doc.context);
        checkBox.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [checkBox, checkBox.ref], nameParts.terminal);
        return PDFCheckBox_1.default.of(checkBox, checkBox.ref, this.doc);
    };
    /**
     * Create a new dropdown field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const dropdown = form.createDropdown('cool.new.dropdown')
     *
     * dropdown.addToPage(font, page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new dropdown.
     * @returns The new dropdown field.
     */
    PDFForm.prototype.createDropdown = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var comboBox = core_1.PDFAcroComboBox.create(this.doc.context);
        comboBox.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [comboBox, comboBox.ref], nameParts.terminal);
        return PDFDropdown_1.default.of(comboBox, comboBox.ref, this.doc);
    };
    /**
     * Create a new option list field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const optionList = form.createOptionList('cool.new.optionList')
     *
     * optionList.addToPage(font, page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new option list.
     * @returns The new option list field.
     */
    PDFForm.prototype.createOptionList = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var listBox = core_1.PDFAcroListBox.create(this.doc.context);
        listBox.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [listBox, listBox.ref], nameParts.terminal);
        return PDFOptionList_1.default.of(listBox, listBox.ref, this.doc);
    };
    /**
     * Create a new radio group field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const radioGroup = form.createRadioGroup('cool.new.radioGroup')
     *
     * radioGroup.addOptionToPage('is-dog', page, { y: 0 })
     * radioGroup.addOptionToPage('is-cat', page, { y: 75 })
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new radio group.
     * @returns The new radio group field.
     */
    PDFForm.prototype.createRadioGroup = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var radioButton = core_1.PDFAcroRadioButton.create(this.doc.context);
        radioButton.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [radioButton, radioButton.ref], nameParts.terminal);
        return PDFRadioGroup_1.default.of(radioButton, radioButton.ref, this.doc);
    };
    /**
     * Create a new text field in this [[PDFForm]] with the given name.
     * For example:
     * ```js
     * const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const textField = form.createTextField('cool.new.textField')
     *
     * textField.addToPage(font, page)
     * ```
     * An error will be thrown if a field already exists with the provided name.
     * @param name The fully qualified name for the new radio group.
     * @returns The new radio group field.
     */
    PDFForm.prototype.createTextField = function (name) {
        utils_1.assertIs(name, 'name', ['string']);
        var nameParts = splitFieldName(name);
        var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
        var text = core_1.PDFAcroText.create(this.doc.context);
        text.setPartialName(nameParts.terminal);
        addFieldToParent(parent, [text, text.ref], nameParts.terminal);
        return PDFTextField_1.default.of(text, text.ref, this.doc);
    };
    /**
     * Flatten all fields in this [[PDFForm]].
     *
     * Flattening a form field will take the current appearance for each of that
     * field's widgets and make them part of their page's content stream. All form
     * fields and annotations associated are then removed. Note that once a form
     * has been flattened its fields can no longer be accessed or edited.
     *
     * This operation is often used after filling form fields to ensure a
     * consistent appearance across different PDF readers and/or printers.
     * Another common use case is to copy a template document with form fields
     * into another document. In this scenario you would load the template
     * document, fill its fields, flatten it, and then copy its pages into the
     * recipient document - the filled fields will be copied over.
     *
     * For example:
     * ```js
     * const form = pdfDoc.getForm();
     * form.flatten();
     * ```
     */
    PDFForm.prototype.flatten = function (options) {
        if (options === void 0) { options = { updateFieldAppearances: true }; }
        if (options.updateFieldAppearances) {
            this.updateFieldAppearances();
        }
        var fields = this.getFields();
        for (var i = 0, lenFields = fields.length; i < lenFields; i++) {
            var field = fields[i];
            var widgets = field.acroField.getWidgets();
            for (var j = 0, lenWidgets = widgets.length; j < lenWidgets; j++) {
                var widget = widgets[j];
                var page = this.findWidgetPage(widget);
                var widgetRef = this.findWidgetAppearanceRef(field, widget);
                var xObjectKey = page.node.newXObject('FlatWidget', widgetRef);
                var rectangle = widget.getRectangle();
                var operators = tslib_1.__spreadArrays([
                    operators_1.pushGraphicsState(),
                    operators_1.translate(rectangle.x, rectangle.y)
                ], operations_1.rotateInPlace(tslib_1.__assign(tslib_1.__assign({}, rectangle), { rotation: 0 })), [
                    operators_1.drawObject(xObjectKey),
                    operators_1.popGraphicsState(),
                ]).filter(Boolean);
                page.pushOperators.apply(page, operators);
            }
            this.removeField(field);
        }
    };
    /**
     * Remove a field from this [[PDFForm]].
     *
     * For example:
     * ```js
     * const form = pdfDoc.getForm();
     * const ageField = form.getFields().find(x => x.getName() === 'Age');
     * form.removeField(ageField);
     * ```
     */
    PDFForm.prototype.removeField = function (field) {
        var widgets = field.acroField.getWidgets();
        var pages = new Set();
        for (var i = 0, len = widgets.length; i < len; i++) {
            var widget = widgets[i];
            var widgetRef = this.findWidgetAppearanceRef(field, widget);
            var page = this.findWidgetPage(widget);
            pages.add(page);
            page.node.removeAnnot(widgetRef);
        }
        pages.forEach(function (page) { return page.node.removeAnnot(field.ref); });
        this.acroForm.removeField(field.acroField);
        var fieldKids = field.acroField.normalizedEntries().Kids;
        var kidsCount = fieldKids.size();
        for (var childIndex = 0; childIndex < kidsCount; childIndex++) {
            var child = fieldKids.get(childIndex);
            if (child instanceof core_1.PDFRef) {
                this.doc.context.delete(child);
            }
        }
        this.doc.context.delete(field.ref);
    };
    /**
     * Update the appearance streams for all widgets of all fields in this
     * [[PDFForm]]. Appearance streams will only be created for a widget if it
     * does not have any existing appearance streams, or the field's value has
     * changed (e.g. by calling [[PDFTextField.setText]] or
     * [[PDFDropdown.select]]).
     *
     * For example:
     * ```js
     * const courier = await pdfDoc.embedFont(StandardFonts.Courier)
     * const form = pdfDoc.getForm()
     * form.updateFieldAppearances(courier)
     * ```
     *
     * **IMPORTANT:** The default value for the `font` parameter is
     * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
     * that encoding errors will be thrown if any fields contain text with
     * characters outside the WinAnsi character set (the latin alphabet).
     *
     * Embedding a custom font and passing that as the `font`
     * parameter allows you to generate appearance streams with non WinAnsi
     * characters (assuming your custom font supports them).
     *
     * > **NOTE:** The [[PDFDocument.save]] method will call this method to
     * > update appearances automatically if a form was accessed via the
     * > [[PDFDocument.getForm]] method prior to saving.
     *
     * @param font Optionally, the font to use when creating new appearances.
     */
    PDFForm.prototype.updateFieldAppearances = function (font) {
        utils_1.assertOrUndefined(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        font = font !== null && font !== void 0 ? font : this.getDefaultFont();
        var fields = this.getFields();
        for (var idx = 0, len = fields.length; idx < len; idx++) {
            var field = fields[idx];
            if (field.needsAppearancesUpdate()) {
                field.defaultUpdateAppearances(font);
            }
        }
    };
    /**
     * Mark a field as dirty. This will cause its appearance streams to be
     * updated by [[PDFForm.updateFieldAppearances]].
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getField('foo.bar')
     * form.markFieldAsDirty(field.ref)
     * ```
     * @param fieldRef The reference to the field that should be marked.
     */
    PDFForm.prototype.markFieldAsDirty = function (fieldRef) {
        utils_1.assertOrUndefined(fieldRef, 'fieldRef', [[core_1.PDFRef, 'PDFRef']]);
        this.dirtyFields.add(fieldRef);
    };
    /**
     * Mark a field as dirty. This will cause its appearance streams to not be
     * updated by [[PDFForm.updateFieldAppearances]].
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getField('foo.bar')
     * form.markFieldAsClean(field.ref)
     * ```
     * @param fieldRef The reference to the field that should be marked.
     */
    PDFForm.prototype.markFieldAsClean = function (fieldRef) {
        utils_1.assertOrUndefined(fieldRef, 'fieldRef', [[core_1.PDFRef, 'PDFRef']]);
        this.dirtyFields.delete(fieldRef);
    };
    /**
     * Returns `true` is the specified field has been marked as dirty.
     * ```js
     * const form = pdfDoc.getForm()
     * const field = form.getField('foo.bar')
     * if (form.fieldIsDirty(field.ref)) console.log('Field is dirty')
     * ```
     * @param fieldRef The reference to the field that should be checked.
     * @returns Whether or not the specified field is dirty.
     */
    PDFForm.prototype.fieldIsDirty = function (fieldRef) {
        utils_1.assertOrUndefined(fieldRef, 'fieldRef', [[core_1.PDFRef, 'PDFRef']]);
        return this.dirtyFields.has(fieldRef);
    };
    PDFForm.prototype.getDefaultFont = function () {
        return this.defaultFontCache.access();
    };
    PDFForm.prototype.findWidgetPage = function (widget) {
        var pageRef = widget.P();
        var page = this.doc.getPages().find(function (x) { return x.ref === pageRef; });
        if (page === undefined) {
            var widgetRef = this.doc.context.getObjectRef(widget.dict);
            if (widgetRef === undefined) {
                throw new Error('Could not find PDFRef for PDFObject');
            }
            page = this.doc.findPageForAnnotationRef(widgetRef);
            if (page === undefined) {
                throw new Error("Could not find page for PDFRef " + widgetRef);
            }
        }
        return page;
    };
    PDFForm.prototype.findWidgetAppearanceRef = function (field, widget) {
        var _a;
        var refOrDict = widget.getNormalAppearance();
        if (refOrDict instanceof core_1.PDFDict &&
            (field instanceof PDFCheckBox_1.default || field instanceof PDFRadioGroup_1.default)) {
            var value = field.acroField.getValue();
            var ref = (_a = refOrDict.get(value)) !== null && _a !== void 0 ? _a : refOrDict.get(core_1.PDFName.of('Off'));
            if (ref instanceof core_1.PDFRef) {
                refOrDict = ref;
            }
        }
        if (!(refOrDict instanceof core_1.PDFRef)) {
            var name_1 = field.getName();
            throw new Error("Failed to extract appearance ref for: " + name_1);
        }
        return refOrDict;
    };
    PDFForm.prototype.findOrCreateNonTerminals = function (partialNames) {
        var nonTerminal = [
            this.acroForm,
        ];
        for (var idx = 0, len = partialNames.length; idx < len; idx++) {
            var namePart = partialNames[idx];
            if (!namePart)
                throw new errors_1.InvalidFieldNamePartError(namePart);
            var parent_1 = nonTerminal[0], parentRef = nonTerminal[1];
            var res = this.findNonTerminal(namePart, parent_1);
            if (res) {
                nonTerminal = res;
            }
            else {
                var node = core_1.PDFAcroNonTerminal.create(this.doc.context);
                node.setPartialName(namePart);
                node.setParent(parentRef);
                var nodeRef = this.doc.context.register(node.dict);
                parent_1.addField(nodeRef);
                nonTerminal = [node, nodeRef];
            }
        }
        return nonTerminal;
    };
    PDFForm.prototype.findNonTerminal = function (partialName, parent) {
        var fields = parent instanceof core_1.PDFAcroForm
            ? this.acroForm.getFields()
            : core_1.createPDFAcroFields(parent.Kids());
        for (var idx = 0, len = fields.length; idx < len; idx++) {
            var _a = fields[idx], field = _a[0], ref = _a[1];
            if (field.getPartialName() === partialName) {
                if (field instanceof core_1.PDFAcroNonTerminal)
                    return [field, ref];
                throw new errors_1.FieldAlreadyExistsError(partialName);
            }
        }
        return undefined;
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.getForm]] method, which will create an
     * > instance of [[PDFForm]] for you.
     *
     * Create an instance of [[PDFForm]] from an existing acroForm and embedder
     *
     * @param acroForm The underlying `PDFAcroForm` for this form.
     * @param doc The document to which the form will belong.
     */
    PDFForm.of = function (acroForm, doc) {
        return new PDFForm(acroForm, doc);
    };
    return PDFForm;
}());
exports.default = PDFForm;
var convertToPDFField = function (field, ref, doc) {
    if (field instanceof core_1.PDFAcroPushButton)
        return PDFButton_1.default.of(field, ref, doc);
    if (field instanceof core_1.PDFAcroCheckBox)
        return PDFCheckBox_1.default.of(field, ref, doc);
    if (field instanceof core_1.PDFAcroComboBox)
        return PDFDropdown_1.default.of(field, ref, doc);
    if (field instanceof core_1.PDFAcroListBox)
        return PDFOptionList_1.default.of(field, ref, doc);
    if (field instanceof core_1.PDFAcroText)
        return PDFTextField_1.default.of(field, ref, doc);
    if (field instanceof core_1.PDFAcroRadioButton) {
        return PDFRadioGroup_1.default.of(field, ref, doc);
    }
    if (field instanceof core_1.PDFAcroSignature) {
        return PDFSignature_1.default.of(field, ref, doc);
    }
    return undefined;
};
var splitFieldName = function (fullyQualifiedName) {
    if (fullyQualifiedName.length === 0) {
        throw new Error('PDF field names must not be empty strings');
    }
    var parts = fullyQualifiedName.split('.');
    for (var idx = 0, len = parts.length; idx < len; idx++) {
        if (parts[idx] === '') {
            throw new Error("Periods in PDF field names must be separated by at least one character: \"" + fullyQualifiedName + "\"");
        }
    }
    if (parts.length === 1)
        return { nonTerminal: [], terminal: parts[0] };
    return {
        nonTerminal: parts.slice(0, parts.length - 1),
        terminal: parts[parts.length - 1],
    };
};
var addFieldToParent = function (_a, _b, partialName) {
    var parent = _a[0], parentRef = _a[1];
    var field = _b[0], fieldRef = _b[1];
    var entries = parent.normalizedEntries();
    var fields = core_1.createPDFAcroFields('Kids' in entries ? entries.Kids : entries.Fields);
    for (var idx = 0, len = fields.length; idx < len; idx++) {
        if (fields[idx][0].getPartialName() === partialName) {
            throw new errors_1.FieldAlreadyExistsError(partialName);
        }
    }
    parent.addField(fieldRef);
    field.setParent(parentRef);
};
//# sourceMappingURL=PDFForm.js.map
}, function(modId) { var map = {"../PDFDocument":1767772065571,"./PDFButton":1767772065569,"./PDFCheckBox":1767772065576,"./PDFDropdown":1767772065580,"./PDFOptionList":1767772065581,"./PDFRadioGroup":1767772065582,"./PDFSignature":1767772065583,"./PDFTextField":1767772065584,"../errors":1767772065567,"../PDFFont":1767772065573,"../StandardFonts":1767772065585,"../operations":1767772065462,"../operators":1767772065464,"../../core":1767772065466,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065576, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFPage_1 = tslib_1.__importDefault(require("../PDFPage"));
var appearances_1 = require("./appearances");
var colors_1 = require("../colors");
var rotations_1 = require("../rotations");
var PDFField_1 = tslib_1.__importStar(require("./PDFField"));
var core_1 = require("../../core");
var utils_1 = require("../../utils");
/**
 * Represents a check box field of a [[PDFForm]].
 *
 * [[PDFCheckBox]] fields are interactive boxes that users can click with their
 * mouse. This type of [[PDFField]] has two states: `on` and `off`. The purpose
 * of a check box is to enable users to select from one or more options, where
 * each option is represented by a single check box. Check boxes are typically
 * square in shape and display a check mark when they are in the `on` state.
 */
var PDFCheckBox = /** @class */ (function (_super) {
    tslib_1.__extends(PDFCheckBox, _super);
    function PDFCheckBox(acroCheckBox, ref, doc) {
        var _this = _super.call(this, acroCheckBox, ref, doc) || this;
        utils_1.assertIs(acroCheckBox, 'acroCheckBox', [
            [core_1.PDFAcroCheckBox, 'PDFAcroCheckBox'],
        ]);
        _this.acroField = acroCheckBox;
        return _this;
    }
    /**
     * Mark this check box. This operation is analogous to a human user clicking
     * a check box to fill it in a PDF reader. This method will update the
     * underlying state of the check box field to indicate it has been selected.
     * PDF libraries and readers will be able to extract this value from the
     * saved document and determine that it was selected.
     *
     * For example:
     * ```js
     * const checkBox = form.getCheckBox('some.checkBox.field')
     * checkBox.check()
     * ```
     *
     * This method will mark this check box as dirty, causing its appearance
     * streams to be updated when either [[PDFDocument.save]] or
     * [[PDFForm.updateFieldAppearances]] is called. The updated appearance
     * streams will display a check mark inside the widgets of this check box
     * field.
     */
    PDFCheckBox.prototype.check = function () {
        var _a;
        var onValue = (_a = this.acroField.getOnValue()) !== null && _a !== void 0 ? _a : core_1.PDFName.of('Yes');
        this.markAsDirty();
        this.acroField.setValue(onValue);
    };
    /**
     * Clears this check box. This operation is analogous to a human user clicking
     * a check box to unmark it in a PDF reader. This method will update the
     * underlying state of the check box field to indicate it has been deselected.
     * PDF libraries and readers will be able to extract this value from the
     * saved document and determine that it was not selected.
     *
     * For example:
     * ```js
     * const checkBox = form.getCheckBox('some.checkBox.field')
     * checkBox.uncheck()
     * ```
     *
     * This method will mark this check box as dirty. See [[PDFCheckBox.check]]
     * for more details about what this means.
     */
    PDFCheckBox.prototype.uncheck = function () {
        this.markAsDirty();
        this.acroField.setValue(core_1.PDFName.of('Off'));
    };
    /**
     * Returns `true` if this check box is selected (either by a human user via
     * a PDF reader, or else programmatically via software). For example:
     * ```js
     * const checkBox = form.getCheckBox('some.checkBox.field')
     * if (checkBox.isChecked()) console.log('check box is selected')
     * ```
     * @returns Whether or not this check box is selected.
     */
    PDFCheckBox.prototype.isChecked = function () {
        var onValue = this.acroField.getOnValue();
        return !!onValue && onValue === this.acroField.getValue();
    };
    /**
     * Show this check box on the specified page. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const checkBox = form.createCheckBox('some.checkBox.field')
     *
     * checkBox.addToPage(page, {
     *   x: 50,
     *   y: 75,
     *   width: 25,
     *   height: 25,
     *   textColor: rgb(1, 0, 0),
     *   backgroundColor: rgb(0, 1, 0),
     *   borderColor: rgb(0, 0, 1),
     *   borderWidth: 2,
     *   rotate: degrees(90),
     * })
     * ```
     * This will create a new widget for this check box field.
     * @param page The page to which this check box widget should be added.
     * @param options The options to be used when adding this check box widget.
     */
    PDFCheckBox.prototype.addToPage = function (page, options) {
        var _a, _b, _c, _d, _e, _f;
        utils_1.assertIs(page, 'page', [[PDFPage_1.default, 'PDFPage']]);
        PDFField_1.assertFieldAppearanceOptions(options);
        if (!options)
            options = {};
        if (!('textColor' in options))
            options.textColor = colors_1.rgb(0, 0, 0);
        if (!('backgroundColor' in options))
            options.backgroundColor = colors_1.rgb(1, 1, 1);
        if (!('borderColor' in options))
            options.borderColor = colors_1.rgb(0, 0, 0);
        if (!('borderWidth' in options))
            options.borderWidth = 1;
        // Create a widget for this check box
        var widget = this.createWidget({
            x: (_a = options.x) !== null && _a !== void 0 ? _a : 0,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : 0,
            width: (_c = options.width) !== null && _c !== void 0 ? _c : 50,
            height: (_d = options.height) !== null && _d !== void 0 ? _d : 50,
            textColor: options.textColor,
            backgroundColor: options.backgroundColor,
            borderColor: options.borderColor,
            borderWidth: (_e = options.borderWidth) !== null && _e !== void 0 ? _e : 0,
            rotate: (_f = options.rotate) !== null && _f !== void 0 ? _f : rotations_1.degrees(0),
            hidden: options.hidden,
            page: page.ref,
        });
        var widgetRef = this.doc.context.register(widget.dict);
        // Add widget to this field
        this.acroField.addWidget(widgetRef);
        // Set appearance streams for widget
        widget.setAppearanceState(core_1.PDFName.of('Off'));
        this.updateWidgetAppearance(widget, core_1.PDFName.of('Yes'));
        // Add widget to the given page
        page.node.addAnnot(widgetRef);
    };
    /**
     * Returns `true` if any of this check box's widgets do not have an
     * appearance stream for its current state. For example:
     * ```js
     * const checkBox = form.getCheckBox('some.checkBox.field')
     * if (checkBox.needsAppearancesUpdate()) console.log('Needs update')
     * ```
     * @returns Whether or not this check box needs an appearance update.
     */
    PDFCheckBox.prototype.needsAppearancesUpdate = function () {
        var _a;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var state = widget.getAppearanceState();
            var normal = (_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal;
            if (!(normal instanceof core_1.PDFDict))
                return true;
            if (state && !normal.has(state))
                return true;
        }
        return false;
    };
    /**
     * Update the appearance streams for each of this check box's widgets using
     * the default appearance provider for check boxes. For example:
     * ```js
     * const checkBox = form.getCheckBox('some.checkBox.field')
     * checkBox.defaultUpdateAppearances()
     * ```
     */
    PDFCheckBox.prototype.defaultUpdateAppearances = function () {
        this.updateAppearances();
    };
    /**
     * Update the appearance streams for each of this check box's widgets using
     * the given appearance provider. If no `provider` is passed, the default
     * appearance provider for check boxs will be used. For example:
     * ```js
     * const checkBox = form.getCheckBox('some.checkBox.field')
     * checkBox.updateAppearances((field, widget) => {
     *   ...
     *   return {
     *     normal: { on: drawCheckBox(...), off: drawCheckBox(...) },
     *     down: { on: drawCheckBox(...), off: drawCheckBox(...) },
     *   }
     * })
     * ```
     * @param provider Optionally, the appearance provider to be used for
     *                 generating the contents of the appearance streams.
     */
    PDFCheckBox.prototype.updateAppearances = function (provider) {
        var _a;
        utils_1.assertOrUndefined(provider, 'provider', [Function]);
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var onValue = (_a = widget.getOnValue()) !== null && _a !== void 0 ? _a : core_1.PDFName.of('Yes');
            if (!onValue)
                continue;
            this.updateWidgetAppearance(widget, onValue, provider);
        }
        this.markAsClean();
    };
    PDFCheckBox.prototype.updateWidgetAppearance = function (widget, onValue, provider) {
        var apProvider = provider !== null && provider !== void 0 ? provider : appearances_1.defaultCheckBoxAppearanceProvider;
        var appearances = appearances_1.normalizeAppearance(apProvider(this, widget));
        this.updateOnOffWidgetAppearance(widget, onValue, appearances);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getCheckBox]] method, which will create an
     * > instance of [[PDFCheckBox]] for you.
     *
     * Create an instance of [[PDFCheckBox]] from an existing acroCheckBox and ref
     *
     * @param acroCheckBox The underlying `PDFAcroCheckBox` for this check box.
     * @param ref The unique reference for this check box.
     * @param doc The document to which this check box will belong.
     */
    PDFCheckBox.of = function (acroCheckBox, ref, doc) {
        return new PDFCheckBox(acroCheckBox, ref, doc);
    };
    return PDFCheckBox;
}(PDFField_1.default));
exports.default = PDFCheckBox;
//# sourceMappingURL=PDFCheckBox.js.map
}, function(modId) { var map = {"../PDFPage":1767772065570,"./appearances":1767772065461,"../colors":1767772065463,"../rotations":1767772065564,"./PDFField":1767772065577,"../../core":1767772065466,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065577, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.assertFieldAppearanceOptions = void 0;
var tslib_1 = require("tslib");
var PDFDocument_1 = tslib_1.__importDefault(require("../PDFDocument"));
var colors_1 = require("../colors");
var rotations_1 = require("../rotations");
var core_1 = require("../../core");
var utils_1 = require("../../utils");
var image_1 = require("../image");
var operations_1 = require("../operations");
exports.assertFieldAppearanceOptions = function (options) {
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.x, 'options.x', ['number']);
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.y, 'options.y', ['number']);
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.width, 'options.width', ['number']);
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.height, 'options.height', ['number']);
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.textColor, 'options.textColor', [
        [Object, 'Color'],
    ]);
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.backgroundColor, 'options.backgroundColor', [
        [Object, 'Color'],
    ]);
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.borderColor, 'options.borderColor', [
        [Object, 'Color'],
    ]);
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.borderWidth, 'options.borderWidth', ['number']);
    utils_1.assertOrUndefined(options === null || options === void 0 ? void 0 : options.rotate, 'options.rotate', [[Object, 'Rotation']]);
};
/**
 * Represents a field of a [[PDFForm]].
 *
 * This class is effectively abstract. All fields in a [[PDFForm]] will
 * actually be an instance of a subclass of this class.
 *
 * Note that each field in a PDF is represented by a single field object.
 * However, a given field object may be rendered at multiple locations within
 * the document (across one or more pages). The rendering of a field is
 * controlled by its widgets. Each widget causes its field to be displayed at a
 * particular location in the document.
 *
 * Most of the time each field in a PDF has only a single widget, and thus is
 * only rendered once. However, if a field is rendered multiple times, it will
 * have multiple widgets - one for each location it is rendered.
 *
 * This abstraction of field objects and widgets is defined in the PDF
 * specification and dictates how PDF files store fields and where they are
 * to be rendered.
 */
var PDFField = /** @class */ (function () {
    function PDFField(acroField, ref, doc) {
        utils_1.assertIs(acroField, 'acroField', [[core_1.PDFAcroTerminal, 'PDFAcroTerminal']]);
        utils_1.assertIs(ref, 'ref', [[core_1.PDFRef, 'PDFRef']]);
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        this.acroField = acroField;
        this.ref = ref;
        this.doc = doc;
    }
    /**
     * Get the fully qualified name of this field. For example:
     * ```js
     * const fields = form.getFields()
     * fields.forEach(field => {
     *   const name = field.getName()
     *   console.log('Field name:', name)
     * })
     * ```
     * Note that PDF fields are structured as a tree. Each field is the
     * descendent of a series of ancestor nodes all the way up to the form node,
     * which is always the root of the tree. Each node in the tree (except for
     * the form node) has a partial name. Partial names can be composed of any
     * unicode characters except a period (`.`). The fully qualified name of a
     * field is composed of the partial names of all its ancestors joined
     * with periods. This means that splitting the fully qualified name on
     * periods and taking the last element of the resulting array will give you
     * the partial name of a specific field.
     * @returns The fully qualified name of this field.
     */
    PDFField.prototype.getName = function () {
        var _a;
        return (_a = this.acroField.getFullyQualifiedName()) !== null && _a !== void 0 ? _a : '';
    };
    /**
     * Returns `true` if this field is read only. This means that PDF readers
     * will not allow users to interact with the field or change its value. See
     * [[PDFField.enableReadOnly]] and [[PDFField.disableReadOnly]].
     * For example:
     * ```js
     * const field = form.getField('some.field')
     * if (field.isReadOnly()) console.log('Read only is enabled')
     * ```
     * @returns Whether or not this is a read only field.
     */
    PDFField.prototype.isReadOnly = function () {
        return this.acroField.hasFlag(core_1.AcroFieldFlags.ReadOnly);
    };
    /**
     * Prevent PDF readers from allowing users to interact with this field or
     * change its value. The field will not respond to mouse or keyboard input.
     * For example:
     * ```js
     * const field = form.getField('some.field')
     * field.enableReadOnly()
     * ```
     * Useful for fields whose values are computed, imported from a database, or
     * prefilled by software before being displayed to the user.
     */
    PDFField.prototype.enableReadOnly = function () {
        this.acroField.setFlagTo(core_1.AcroFieldFlags.ReadOnly, true);
    };
    /**
     * Allow users to interact with this field and change its value in PDF
     * readers via mouse and keyboard input. For example:
     * ```js
     * const field = form.getField('some.field')
     * field.disableReadOnly()
     * ```
     */
    PDFField.prototype.disableReadOnly = function () {
        this.acroField.setFlagTo(core_1.AcroFieldFlags.ReadOnly, false);
    };
    /**
     * Returns `true` if this field must have a value when the form is submitted.
     * See [[PDFField.enableRequired]] and [[PDFField.disableRequired]].
     * For example:
     * ```js
     * const field = form.getField('some.field')
     * if (field.isRequired()) console.log('Field is required')
     * ```
     * @returns Whether or not this field is required.
     */
    PDFField.prototype.isRequired = function () {
        return this.acroField.hasFlag(core_1.AcroFieldFlags.Required);
    };
    /**
     * Require this field to have a value when the form is submitted.
     * For example:
     * ```js
     * const field = form.getField('some.field')
     * field.enableRequired()
     * ```
     */
    PDFField.prototype.enableRequired = function () {
        this.acroField.setFlagTo(core_1.AcroFieldFlags.Required, true);
    };
    /**
     * Do not require this field to have a value when the form is submitted.
     * For example:
     * ```js
     * const field = form.getField('some.field')
     * field.disableRequired()
     * ```
     */
    PDFField.prototype.disableRequired = function () {
        this.acroField.setFlagTo(core_1.AcroFieldFlags.Required, false);
    };
    /**
     * Returns `true` if this field's value should be exported when the form is
     * submitted. See [[PDFField.enableExporting]] and
     * [[PDFField.disableExporting]].
     * For example:
     * ```js
     * const field = form.getField('some.field')
     * if (field.isExported()) console.log('Exporting is enabled')
     * ```
     * @returns Whether or not this field's value should be exported.
     */
    PDFField.prototype.isExported = function () {
        return !this.acroField.hasFlag(core_1.AcroFieldFlags.NoExport);
    };
    /**
     * Indicate that this field's value should be exported when the form is
     * submitted in a PDF reader. For example:
     * ```js
     * const field = form.getField('some.field')
     * field.enableExporting()
     * ```
     */
    PDFField.prototype.enableExporting = function () {
        this.acroField.setFlagTo(core_1.AcroFieldFlags.NoExport, false);
    };
    /**
     * Indicate that this field's value should **not** be exported when the form
     * is submitted in a PDF reader. For example:
     * ```js
     * const field = form.getField('some.field')
     * field.disableExporting()
     * ```
     */
    PDFField.prototype.disableExporting = function () {
        this.acroField.setFlagTo(core_1.AcroFieldFlags.NoExport, true);
    };
    /** @ignore */
    PDFField.prototype.needsAppearancesUpdate = function () {
        throw new core_1.MethodNotImplementedError(this.constructor.name, 'needsAppearancesUpdate');
    };
    /** @ignore */
    PDFField.prototype.defaultUpdateAppearances = function (_font) {
        throw new core_1.MethodNotImplementedError(this.constructor.name, 'defaultUpdateAppearances');
    };
    PDFField.prototype.markAsDirty = function () {
        this.doc.getForm().markFieldAsDirty(this.ref);
    };
    PDFField.prototype.markAsClean = function () {
        this.doc.getForm().markFieldAsClean(this.ref);
    };
    PDFField.prototype.isDirty = function () {
        return this.doc.getForm().fieldIsDirty(this.ref);
    };
    PDFField.prototype.createWidget = function (options) {
        var _a;
        var textColor = options.textColor;
        var backgroundColor = options.backgroundColor;
        var borderColor = options.borderColor;
        var borderWidth = options.borderWidth;
        var degreesAngle = rotations_1.toDegrees(options.rotate);
        var caption = options.caption;
        var x = options.x;
        var y = options.y;
        var width = options.width + borderWidth;
        var height = options.height + borderWidth;
        var hidden = Boolean(options.hidden);
        var pageRef = options.page;
        utils_1.assertMultiple(degreesAngle, 'degreesAngle', 90);
        // Create a widget for this field
        var widget = core_1.PDFWidgetAnnotation.create(this.doc.context, this.ref);
        // Set widget properties
        var rect = rotations_1.rotateRectangle({ x: x, y: y, width: width, height: height }, borderWidth, degreesAngle);
        widget.setRectangle(rect);
        if (pageRef)
            widget.setP(pageRef);
        var ac = widget.getOrCreateAppearanceCharacteristics();
        if (backgroundColor) {
            ac.setBackgroundColor(colors_1.colorToComponents(backgroundColor));
        }
        ac.setRotation(degreesAngle);
        if (caption)
            ac.setCaptions({ normal: caption });
        if (borderColor)
            ac.setBorderColor(colors_1.colorToComponents(borderColor));
        var bs = widget.getOrCreateBorderStyle();
        if (borderWidth !== undefined)
            bs.setWidth(borderWidth);
        widget.setFlagTo(core_1.AnnotationFlags.Print, true);
        widget.setFlagTo(core_1.AnnotationFlags.Hidden, hidden);
        widget.setFlagTo(core_1.AnnotationFlags.Invisible, false);
        // Set acrofield properties
        if (textColor) {
            var da = (_a = this.acroField.getDefaultAppearance()) !== null && _a !== void 0 ? _a : '';
            var newDa = da + '\n' + colors_1.setFillingColor(textColor).toString();
            this.acroField.setDefaultAppearance(newDa);
        }
        return widget;
    };
    PDFField.prototype.updateWidgetAppearanceWithFont = function (widget, font, _a) {
        var normal = _a.normal, rollover = _a.rollover, down = _a.down;
        this.updateWidgetAppearances(widget, {
            normal: this.createAppearanceStream(widget, normal, font),
            rollover: rollover && this.createAppearanceStream(widget, rollover, font),
            down: down && this.createAppearanceStream(widget, down, font),
        });
    };
    PDFField.prototype.updateOnOffWidgetAppearance = function (widget, onValue, _a) {
        var normal = _a.normal, rollover = _a.rollover, down = _a.down;
        this.updateWidgetAppearances(widget, {
            normal: this.createAppearanceDict(widget, normal, onValue),
            rollover: rollover && this.createAppearanceDict(widget, rollover, onValue),
            down: down && this.createAppearanceDict(widget, down, onValue),
        });
    };
    PDFField.prototype.updateWidgetAppearances = function (widget, _a) {
        var normal = _a.normal, rollover = _a.rollover, down = _a.down;
        widget.setNormalAppearance(normal);
        if (rollover) {
            widget.setRolloverAppearance(rollover);
        }
        else {
            widget.removeRolloverAppearance();
        }
        if (down) {
            widget.setDownAppearance(down);
        }
        else {
            widget.removeDownAppearance();
        }
    };
    // // TODO: Do we need to do this...?
    // private foo(font: PDFFont, dict: PDFDict) {
    //   if (!dict.lookup(PDFName.of('DR'))) {
    //     dict.set(PDFName.of('DR'), dict.context.obj({}));
    //   }
    //   const DR = dict.lookup(PDFName.of('DR'), PDFDict);
    //   if (!DR.lookup(PDFName.of('Font'))) {
    //     DR.set(PDFName.of('Font'), dict.context.obj({}));
    //   }
    //   const Font = DR.lookup(PDFName.of('Font'), PDFDict);
    //   Font.set(PDFName.of(font.name), font.ref);
    // }
    PDFField.prototype.createAppearanceStream = function (widget, appearance, font) {
        var _a;
        var context = this.acroField.dict.context;
        var _b = widget.getRectangle(), width = _b.width, height = _b.height;
        // TODO: Do we need to do this...?
        // if (font) {
        //   this.foo(font, widget.dict);
        //   this.foo(font, this.doc.getForm().acroForm.dict);
        // }
        // END TODO
        var Resources = font && { Font: (_a = {}, _a[font.name] = font.ref, _a) };
        var stream = context.formXObject(appearance, {
            Resources: Resources,
            BBox: context.obj([0, 0, width, height]),
            Matrix: context.obj([1, 0, 0, 1, 0, 0]),
        });
        var streamRef = context.register(stream);
        return streamRef;
    };
    /**
     * Create a FormXObject of the supplied image and add it to context.
     * The FormXObject size is calculated based on the widget (including
     * the alignment).
     * @param widget The widget that should display the image.
     * @param alignment The alignment of the image.
     * @param image The image that should be displayed.
     * @returns The ref for the FormXObject that was added to the context.
     */
    PDFField.prototype.createImageAppearanceStream = function (widget, image, alignment) {
        // NOTE: This implementation doesn't handle image borders.
        // NOTE: Acrobat seems to resize the image (maybe even skewing its aspect
        //       ratio) to fit perfectly within the widget's rectangle. This method
        //       does not currently do that. Should there be an option for that?
        var _a;
        var _b;
        var context = this.acroField.dict.context;
        var rectangle = widget.getRectangle();
        var ap = widget.getAppearanceCharacteristics();
        var bs = widget.getBorderStyle();
        var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 0;
        var rotation = rotations_1.reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
        var rotate = operations_1.rotateInPlace(tslib_1.__assign(tslib_1.__assign({}, rectangle), { rotation: rotation }));
        var adj = rotations_1.adjustDimsForRotation(rectangle, rotation);
        var imageDims = image.scaleToFit(adj.width - borderWidth * 2, adj.height - borderWidth * 2);
        // Support borders on images and maybe other properties
        var options = {
            x: borderWidth,
            y: borderWidth,
            width: imageDims.width,
            height: imageDims.height,
            //
            rotate: rotations_1.degrees(0),
            xSkew: rotations_1.degrees(0),
            ySkew: rotations_1.degrees(0),
        };
        if (alignment === image_1.ImageAlignment.Center) {
            options.x += (adj.width - borderWidth * 2) / 2 - imageDims.width / 2;
            options.y += (adj.height - borderWidth * 2) / 2 - imageDims.height / 2;
        }
        else if (alignment === image_1.ImageAlignment.Right) {
            options.x = adj.width - borderWidth - imageDims.width;
            options.y = adj.height - borderWidth - imageDims.height;
        }
        var imageName = this.doc.context.addRandomSuffix('Image', 10);
        var appearance = tslib_1.__spreadArrays(rotate, operations_1.drawImage(imageName, options));
        ////////////
        var Resources = { XObject: (_a = {}, _a[imageName] = image.ref, _a) };
        var stream = context.formXObject(appearance, {
            Resources: Resources,
            BBox: context.obj([0, 0, rectangle.width, rectangle.height]),
            Matrix: context.obj([1, 0, 0, 1, 0, 0]),
        });
        return context.register(stream);
    };
    PDFField.prototype.createAppearanceDict = function (widget, appearance, onValue) {
        var context = this.acroField.dict.context;
        var onStreamRef = this.createAppearanceStream(widget, appearance.on);
        var offStreamRef = this.createAppearanceStream(widget, appearance.off);
        var appearanceDict = context.obj({});
        appearanceDict.set(onValue, onStreamRef);
        appearanceDict.set(core_1.PDFName.of('Off'), offStreamRef);
        return appearanceDict;
    };
    return PDFField;
}());
exports.default = PDFField;
//# sourceMappingURL=PDFField.js.map
}, function(modId) { var map = {"../PDFDocument":1767772065571,"../colors":1767772065463,"../rotations":1767772065564,"../../core":1767772065466,"../../utils":1767772065468,"../image":1767772065578,"../operations":1767772065462}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065578, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./alignment"), exports);
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./alignment":1767772065579}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065579, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAlignment = void 0;
var ImageAlignment;
(function (ImageAlignment) {
    ImageAlignment[ImageAlignment["Left"] = 0] = "Left";
    ImageAlignment[ImageAlignment["Center"] = 1] = "Center";
    ImageAlignment[ImageAlignment["Right"] = 2] = "Right";
})(ImageAlignment = exports.ImageAlignment || (exports.ImageAlignment = {}));
//# sourceMappingURL=alignment.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065580, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFPage_1 = tslib_1.__importDefault(require("../PDFPage"));
var PDFFont_1 = tslib_1.__importDefault(require("../PDFFont"));
var PDFField_1 = tslib_1.__importStar(require("./PDFField"));
var appearances_1 = require("./appearances");
var colors_1 = require("../colors");
var rotations_1 = require("../rotations");
var core_1 = require("../../core");
var utils_1 = require("../../utils");
/**
 * Represents a dropdown field of a [[PDFForm]].
 *
 * [[PDFDropdown]] fields are interactive text boxes that display a single
 * element (the currently selected value). The purpose of a dropdown is to
 * enable users to select a single option from a set of possible options. Users
 * can click on a dropdown to view the full list of options it provides.
 * Clicking on an option in the list will cause it to be selected and displayed
 * in the dropdown's text box. Some dropdowns allow users to enter text
 * directly into the box from their keyboard, rather than only being allowed to
 * choose an option from the list (see [[PDFDropdown.isEditable]]).
 */
var PDFDropdown = /** @class */ (function (_super) {
    tslib_1.__extends(PDFDropdown, _super);
    function PDFDropdown(acroComboBox, ref, doc) {
        var _this = _super.call(this, acroComboBox, ref, doc) || this;
        utils_1.assertIs(acroComboBox, 'acroComboBox', [
            [core_1.PDFAcroComboBox, 'PDFAcroComboBox'],
        ]);
        _this.acroField = acroComboBox;
        return _this;
    }
    /**
     * Get the list of available options for this dropdown. These options will be
     * displayed to users who click on this dropdown in a PDF reader.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * const options = dropdown.getOptions()
     * console.log('Dropdown options:', options)
     * ```
     * @returns The options for this dropdown.
     */
    PDFDropdown.prototype.getOptions = function () {
        var rawOptions = this.acroField.getOptions();
        var options = new Array(rawOptions.length);
        for (var idx = 0, len = options.length; idx < len; idx++) {
            var _a = rawOptions[idx], display = _a.display, value = _a.value;
            options[idx] = (display !== null && display !== void 0 ? display : value).decodeText();
        }
        return options;
    };
    /**
     * Get the selected options for this dropdown. These are the values that were
     * selected by a human user via a PDF reader, or programatically via
     * software.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * const selections = dropdown.getSelected()
     * console.log('Dropdown selections:', selections)
     * ```
     * > **NOTE:** Note that PDF readers only display one selected option when
     * > rendering dropdowns. However, the PDF specification does allow for
     * > multiple values to be selected in a dropdown. As such, the `pdf-lib`
     * > API supports this. However, in most cases the array returned by this
     * > method will contain only a single element (or no elements).
     * @returns The selected options in this dropdown.
     */
    PDFDropdown.prototype.getSelected = function () {
        var values = this.acroField.getValues();
        var selected = new Array(values.length);
        for (var idx = 0, len = values.length; idx < len; idx++) {
            selected[idx] = values[idx].decodeText();
        }
        return selected;
    };
    /**
     * Set the list of options that are available for this dropdown. These are
     * the values that will be available for users to select when they view this
     * dropdown in a PDF reader. Note that preexisting options for this dropdown
     * will be removed. Only the values passed as `options` will be available to
     * select.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('planets.dropdown')
     * dropdown.setOptions(['Earth', 'Mars', 'Pluto', 'Venus'])
     * ```
     * @param options The options that should be available in this dropdown.
     */
    PDFDropdown.prototype.setOptions = function (options) {
        utils_1.assertIs(options, 'options', [Array]);
        var optionObjects = new Array(options.length);
        for (var idx = 0, len = options.length; idx < len; idx++) {
            optionObjects[idx] = { value: core_1.PDFHexString.fromText(options[idx]) };
        }
        this.acroField.setOptions(optionObjects);
    };
    /**
     * Add to the list of options that are available for this dropdown. Users
     * will be able to select these values in a PDF reader. In addition to the
     * values passed as `options`, any preexisting options for this dropdown will
     * still be available for users to select.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('rockets.dropdown')
     * dropdown.addOptions(['Saturn IV', 'Falcon Heavy'])
     * ```
     * @param options New options that should be available in this dropdown.
     */
    PDFDropdown.prototype.addOptions = function (options) {
        utils_1.assertIs(options, 'options', ['string', Array]);
        var optionsArr = Array.isArray(options) ? options : [options];
        var existingOptions = this.acroField.getOptions();
        var newOptions = new Array(optionsArr.length);
        for (var idx = 0, len = optionsArr.length; idx < len; idx++) {
            newOptions[idx] = { value: core_1.PDFHexString.fromText(optionsArr[idx]) };
        }
        this.acroField.setOptions(existingOptions.concat(newOptions));
    };
    /**
     * Select one or more values for this dropdown. This operation is analogous
     * to a human user opening the dropdown in a PDF reader and clicking on a
     * value to select it. This method will update the underlying state of the
     * dropdown to indicate which values have been selected. PDF libraries and
     * readers will be able to extract these values from the saved document and
     * determine which values were selected.
     *
     * For example:
     * ```js
     * const dropdown = form.getDropdown('best.superhero.dropdown')
     * dropdown.select('One Punch Man')
     * ```
     *
     * This method will mark this dropdown as dirty, causing its appearance
     * streams to be updated when either [[PDFDocument.save]] or
     * [[PDFForm.updateFieldAppearances]] is called. The updated streams will
     * display the selected option inside the widgets of this dropdown.
     *
     * **IMPORTANT:** The default font used to update appearance streams is
     * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
     * that encoding errors will be thrown if the selected option for this field
     * contains characters outside the WinAnsi character set (the latin alphabet).
     *
     * Embedding a custom font and passing it to
     * [[PDFForm.updateFieldAppearances]] or [[PDFDropdown.updateAppearances]]
     * allows you to generate appearance streams with characters outside the
     * latin alphabet (assuming the custom font supports them).
     *
     * Selecting an option that does not exist in this dropdown's option list
     * (see [[PDFDropdown.getOptions]]) will enable editing on this dropdown
     * (see [[PDFDropdown.enableEditing]]).
     *
     * > **NOTE:** PDF readers only display one selected option when rendering
     * > dropdowns. However, the PDF specification does allow for multiple values
     * > to be selected in a dropdown. As such, the `pdf-lib` API supports this.
     * > However, it is not recommended to select more than one value with this
     * > method, as only one will be visible. [[PDFOptionList]] fields are better
     * > suited for displaying multiple selected values.
     *
     * @param options The options to be selected.
     * @param merge Whether or not existing selections should be preserved.
     */
    PDFDropdown.prototype.select = function (options, merge) {
        if (merge === void 0) { merge = false; }
        utils_1.assertIs(options, 'options', ['string', Array]);
        utils_1.assertIs(merge, 'merge', ['boolean']);
        var optionsArr = Array.isArray(options) ? options : [options];
        var validOptions = this.getOptions();
        var hasCustomOption = optionsArr.find(function (option) { return !validOptions.includes(option); });
        if (hasCustomOption)
            this.enableEditing();
        this.markAsDirty();
        if (optionsArr.length > 1 || (optionsArr.length === 1 && merge)) {
            this.enableMultiselect();
        }
        var values = new Array(optionsArr.length);
        for (var idx = 0, len = optionsArr.length; idx < len; idx++) {
            values[idx] = core_1.PDFHexString.fromText(optionsArr[idx]);
        }
        if (merge) {
            var existingValues = this.acroField.getValues();
            this.acroField.setValues(existingValues.concat(values));
        }
        else {
            this.acroField.setValues(values);
        }
    };
    /**
     * Clear all selected values for this dropdown. This operation is equivalent
     * to selecting an empty list. This method will update the underlying state
     * of the dropdown to indicate that no values have been selected.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.clear()
     * ```
     * This method will mark this text field as dirty. See [[PDFDropdown.select]]
     * for more details about what this means.
     */
    PDFDropdown.prototype.clear = function () {
        this.markAsDirty();
        this.acroField.setValues([]);
    };
    /**
     * Set the font size for this field. Larger font sizes will result in larger
     * text being displayed when PDF readers render this dropdown. Font sizes may
     * be integer or floating point numbers. Supplying a negative font size will
     * cause this method to throw an error.
     *
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.setFontSize(4)
     * dropdown.setFontSize(15.7)
     * ```
     *
     * > This method depends upon the existence of a default appearance
     * > (`/DA`) string. If this field does not have a default appearance string,
     * > or that string does not contain a font size (via the `Tf` operator),
     * > then this method will throw an error.
     *
     * @param fontSize The font size to be used when rendering text in this field.
     */
    PDFDropdown.prototype.setFontSize = function (fontSize) {
        utils_1.assertPositive(fontSize, 'fontSize');
        this.acroField.setFontSize(fontSize);
        this.markAsDirty();
    };
    /**
     * Returns `true` if users are allowed to edit the selected value of this
     * dropdown directly and are not constrained by the list of available
     * options. See [[PDFDropdown.enableEditing]] and
     * [[PDFDropdown.disableEditing]]. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * if (dropdown.isEditable()) console.log('Editing is enabled')
     * ```
     * @returns Whether or not this dropdown is editable.
     */
    PDFDropdown.prototype.isEditable = function () {
        return this.acroField.hasFlag(core_1.AcroChoiceFlags.Edit);
    };
    /**
     * Allow users to edit the selected value of this dropdown in PDF readers
     * with their keyboard. This means that the selected value of this dropdown
     * will not be constrained by the list of available options. However, if this
     * dropdown has any available options, users will still be allowed to select
     * from that list.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.enableEditing()
     * ```
     */
    PDFDropdown.prototype.enableEditing = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.Edit, true);
    };
    /**
     * Do not allow users to edit the selected value of this dropdown in PDF
     * readers with their keyboard. This will constrain the selected value of
     * this dropdown to the list of available options. Users will only be able
     * to select an option from that list.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.disableEditing()
     * ```
     */
    PDFDropdown.prototype.disableEditing = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.Edit, false);
    };
    /**
     * Returns `true` if the option list of this dropdown is always displayed
     * in alphabetical order, irrespective of the order in which the options
     * were added to the dropdown. See [[PDFDropdown.enableSorting]] and
     * [[PDFDropdown.disableSorting]]. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * if (dropdown.isSorted()) console.log('Sorting is enabled')
     * ```
     * @returns Whether or not this dropdown's options are sorted.
     */
    PDFDropdown.prototype.isSorted = function () {
        return this.acroField.hasFlag(core_1.AcroChoiceFlags.Sort);
    };
    /**
     * Always display the option list of this dropdown in alphabetical order,
     * irrespective of the order in which the options were added to this dropdown.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.enableSorting()
     * ```
     */
    PDFDropdown.prototype.enableSorting = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.Sort, true);
    };
    /**
     * Do not always display the option list of this dropdown in alphabetical
     * order. Instead, display the options in whichever order they were added
     * to the list. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.disableSorting()
     * ```
     */
    PDFDropdown.prototype.disableSorting = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.Sort, false);
    };
    /**
     * Returns `true` if multiple options can be selected from this dropdown's
     * option list. See [[PDFDropdown.enableMultiselect]] and
     * [[PDFDropdown.disableMultiselect]]. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * if (dropdown.isMultiselect()) console.log('Multiselect is enabled')
     * ```
     * @returns Whether or not multiple options can be selected.
     */
    PDFDropdown.prototype.isMultiselect = function () {
        return this.acroField.hasFlag(core_1.AcroChoiceFlags.MultiSelect);
    };
    /**
     * Allow users to select more than one option from this dropdown's option
     * list. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.enableMultiselect()
     * ```
     */
    PDFDropdown.prototype.enableMultiselect = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.MultiSelect, true);
    };
    /**
     * Do not allow users to select more than one option from this dropdown's
     * option list. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.disableMultiselect()
     * ```
     */
    PDFDropdown.prototype.disableMultiselect = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.MultiSelect, false);
    };
    /**
     * Returns `true` if the selected option should be spell checked by PDF
     * readers. Spell checking will only be performed if this dropdown allows
     * editing (see [[PDFDropdown.isEditable]]). See
     * [[PDFDropdown.enableSpellChecking]] and
     * [[PDFDropdown.disableSpellChecking]]. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * if (dropdown.isSpellChecked()) console.log('Spell checking is enabled')
     * ```
     * @returns Whether or not this dropdown can be spell checked.
     */
    PDFDropdown.prototype.isSpellChecked = function () {
        return !this.acroField.hasFlag(core_1.AcroChoiceFlags.DoNotSpellCheck);
    };
    /**
     * Allow PDF readers to spell check the selected option of this dropdown.
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.enableSpellChecking()
     * ```
     */
    PDFDropdown.prototype.enableSpellChecking = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.DoNotSpellCheck, false);
    };
    /**
     * Do not allow PDF readers to spell check the selected option of this
     * dropdown. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.disableSpellChecking()
     * ```
     */
    PDFDropdown.prototype.disableSpellChecking = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.DoNotSpellCheck, true);
    };
    /**
     * Returns `true` if the option selected by a user is stored, or "committed",
     * when the user clicks the option. The alternative is that the user's
     * selection is stored when the user leaves this dropdown field (by clicking
     * outside of it - on another field, for example). See
     * [[PDFDropdown.enableSelectOnClick]] and
     * [[PDFDropdown.disableSelectOnClick]]. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * if (dropdown.isSelectOnClick()) console.log('Select on click is enabled')
     * ```
     * @returns Whether or not options are selected immediately after they are
     *          clicked.
     */
    PDFDropdown.prototype.isSelectOnClick = function () {
        return this.acroField.hasFlag(core_1.AcroChoiceFlags.CommitOnSelChange);
    };
    /**
     * Store the option selected by a user immediately after the user clicks the
     * option. Do not wait for the user to leave this dropdown field (by clicking
     * outside of it - on another field, for example). For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.enableSelectOnClick()
     * ```
     */
    PDFDropdown.prototype.enableSelectOnClick = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.CommitOnSelChange, true);
    };
    /**
     * Wait to store the option selected by a user until they leave this dropdown
     * field (by clicking outside of it - on another field, for example).
     * For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.disableSelectOnClick()
     * ```
     */
    PDFDropdown.prototype.disableSelectOnClick = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.CommitOnSelChange, false);
    };
    /**
     * Show this dropdown on the specified page. For example:
     * ```js
     * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const dropdown = form.createDropdown('best.gundam')
     * dropdown.setOptions(['Exia', 'Dynames'])
     * dropdown.select('Exia')
     *
     * dropdown.addToPage(page, {
     *   x: 50,
     *   y: 75,
     *   width: 200,
     *   height: 100,
     *   textColor: rgb(1, 0, 0),
     *   backgroundColor: rgb(0, 1, 0),
     *   borderColor: rgb(0, 0, 1),
     *   borderWidth: 2,
     *   rotate: degrees(90),
     *   font: ubuntuFont,
     * })
     * ```
     * This will create a new widget for this dropdown field.
     * @param page The page to which this dropdown widget should be added.
     * @param options The options to be used when adding this dropdown widget.
     */
    PDFDropdown.prototype.addToPage = function (page, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        utils_1.assertIs(page, 'page', [[PDFPage_1.default, 'PDFPage']]);
        PDFField_1.assertFieldAppearanceOptions(options);
        if (!options)
            options = {};
        if (!('textColor' in options))
            options.textColor = colors_1.rgb(0, 0, 0);
        if (!('backgroundColor' in options))
            options.backgroundColor = colors_1.rgb(1, 1, 1);
        if (!('borderColor' in options))
            options.borderColor = colors_1.rgb(0, 0, 0);
        if (!('borderWidth' in options))
            options.borderWidth = 1;
        // Create a widget for this dropdown
        var widget = this.createWidget({
            x: (_a = options.x) !== null && _a !== void 0 ? _a : 0,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : 0,
            width: (_c = options.width) !== null && _c !== void 0 ? _c : 200,
            height: (_d = options.height) !== null && _d !== void 0 ? _d : 50,
            textColor: options.textColor,
            backgroundColor: options.backgroundColor,
            borderColor: options.borderColor,
            borderWidth: (_e = options.borderWidth) !== null && _e !== void 0 ? _e : 0,
            rotate: (_f = options.rotate) !== null && _f !== void 0 ? _f : rotations_1.degrees(0),
            hidden: options.hidden,
            page: page.ref,
        });
        var widgetRef = this.doc.context.register(widget.dict);
        // Add widget to this field
        this.acroField.addWidget(widgetRef);
        // Set appearance streams for widget
        var font = (_g = options.font) !== null && _g !== void 0 ? _g : this.doc.getForm().getDefaultFont();
        this.updateWidgetAppearance(widget, font);
        // Add widget to the given page
        page.node.addAnnot(widgetRef);
    };
    /**
     * Returns `true` if this dropdown has been marked as dirty, or if any of
     * this dropdown's widgets do not have an appearance stream. For example:
     * ```js
     * const dropdown = form.getDropdown('some.dropdown.field')
     * if (dropdown.needsAppearancesUpdate()) console.log('Needs update')
     * ```
     * @returns Whether or not this dropdown needs an appearance update.
     */
    PDFDropdown.prototype.needsAppearancesUpdate = function () {
        var _a;
        if (this.isDirty())
            return true;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof core_1.PDFStream;
            if (!hasAppearances)
                return true;
        }
        return false;
    };
    /**
     * Update the appearance streams for each of this dropdown's widgets using
     * the default appearance provider for dropdowns. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.defaultUpdateAppearances(helvetica)
     * ```
     * @param font The font to be used for creating the appearance streams.
     */
    PDFDropdown.prototype.defaultUpdateAppearances = function (font) {
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        this.updateAppearances(font);
    };
    /**
     * Update the appearance streams for each of this dropdown's widgets using
     * the given appearance provider. If no `provider` is passed, the default
     * appearance provider for dropdowns will be used. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const dropdown = form.getDropdown('some.dropdown.field')
     * dropdown.updateAppearances(helvetica, (field, widget, font) => {
     *   ...
     *   return drawTextField(...)
     * })
     * ```
     * @param font The font to be used for creating the appearance streams.
     * @param provider Optionally, the appearance provider to be used for
     *                 generating the contents of the appearance streams.
     */
    PDFDropdown.prototype.updateAppearances = function (font, provider) {
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        utils_1.assertOrUndefined(provider, 'provider', [Function]);
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            this.updateWidgetAppearance(widget, font, provider);
        }
        this.markAsClean();
    };
    // getOption(index: number): string {}
    // getSelectedIndices(): number[] {}
    // removeOptions(option: string | string[]) {}
    // removeIndices(option: number[]) {}
    // deselect(options: string | string[]) {}
    // deselectIndices(optionIndices: number[]) {}
    PDFDropdown.prototype.updateWidgetAppearance = function (widget, font, provider) {
        var apProvider = provider !== null && provider !== void 0 ? provider : appearances_1.defaultDropdownAppearanceProvider;
        var appearances = appearances_1.normalizeAppearance(apProvider(this, widget, font));
        this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getDropdown]] method, which will create an
     * > instance of [[PDFDropdown]] for you.
     *
     * Create an instance of [[PDFDropdown]] from an existing acroComboBox and ref
     *
     * @param acroComboBox The underlying `PDFAcroComboBox` for this dropdown.
     * @param ref The unique reference for this dropdown.
     * @param doc The document to which this dropdown will belong.
     */
    PDFDropdown.of = function (acroComboBox, ref, doc) {
        return new PDFDropdown(acroComboBox, ref, doc);
    };
    return PDFDropdown;
}(PDFField_1.default));
exports.default = PDFDropdown;
//# sourceMappingURL=PDFDropdown.js.map
}, function(modId) { var map = {"../PDFPage":1767772065570,"../PDFFont":1767772065573,"./PDFField":1767772065577,"./appearances":1767772065461,"../colors":1767772065463,"../rotations":1767772065564,"../../core":1767772065466,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065581, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFPage_1 = tslib_1.__importDefault(require("../PDFPage"));
var PDFFont_1 = tslib_1.__importDefault(require("../PDFFont"));
var PDFField_1 = tslib_1.__importStar(require("./PDFField"));
var appearances_1 = require("./appearances");
var colors_1 = require("../colors");
var rotations_1 = require("../rotations");
var core_1 = require("../../core");
var utils_1 = require("../../utils");
/**
 * Represents an option list field of a [[PDFForm]].
 *
 * [[PDFOptionList]] fields are interactive lists of options. The purpose of an
 * option list is to enable users to select one or more options from a set of
 * possible options. Users are able to see the full set of options without
 * first having to click on the field (though scrolling may be necessary).
 * Clicking an option in the list will cause it to be selected and displayed
 * with a highlighted background. Some option lists allow users to select
 * more than one option (see [[PDFOptionList.isMultiselect]]).
 */
var PDFOptionList = /** @class */ (function (_super) {
    tslib_1.__extends(PDFOptionList, _super);
    function PDFOptionList(acroListBox, ref, doc) {
        var _this = _super.call(this, acroListBox, ref, doc) || this;
        utils_1.assertIs(acroListBox, 'acroListBox', [[core_1.PDFAcroListBox, 'PDFAcroListBox']]);
        _this.acroField = acroListBox;
        return _this;
    }
    /**
     * Get the list of available options for this option list. These options will
     * be displayed to users who view this option list in a PDF reader.
     * For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * const options = optionList.getOptions()
     * console.log('Option List options:', options)
     * ```
     * @returns The options for this option list.
     */
    PDFOptionList.prototype.getOptions = function () {
        var rawOptions = this.acroField.getOptions();
        var options = new Array(rawOptions.length);
        for (var idx = 0, len = options.length; idx < len; idx++) {
            var _a = rawOptions[idx], display = _a.display, value = _a.value;
            options[idx] = (display !== null && display !== void 0 ? display : value).decodeText();
        }
        return options;
    };
    /**
     * Get the selected options for this option list. These are the values that
     * were selected by a human user via a PDF reader, or programatically via
     * software.
     * For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * const selections = optionList.getSelected()
     * console.log('Option List selections:', selections)
     * ```
     * @returns The selected options for this option list.
     */
    PDFOptionList.prototype.getSelected = function () {
        var values = this.acroField.getValues();
        var selected = new Array(values.length);
        for (var idx = 0, len = values.length; idx < len; idx++) {
            selected[idx] = values[idx].decodeText();
        }
        return selected;
    };
    /**
     * Set the list of options that are available for this option list. These are
     * the values that will be available for users to select when they view this
     * option list in a PDF reader. Note that preexisting options for this
     * option list will be removed. Only the values passed as `options` will be
     * available to select.
     *
     * For example:
     * ```js
     * const optionList = form.getOptionList('planets.optionList')
     * optionList.setOptions(['Earth', 'Mars', 'Pluto', 'Venus'])
     * ```
     *
     * This method will mark this option list as dirty, causing its appearance
     * streams to be updated when either [[PDFDocument.save]] or
     * [[PDFForm.updateFieldAppearances]] is called. The updated streams will
     * display the options this field contains inside the widgets of this text
     * field (with selected options highlighted).
     *
     * **IMPORTANT:** The default font used to update appearance streams is
     * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
     * that encoding errors will be thrown if this field contains any options
     * with characters outside the WinAnsi character set (the latin alphabet).
     *
     * Embedding a custom font and passing it to
     * [[PDFForm.updateFieldAppearances]] or [[PDFOptionList.updateAppearances]]
     * allows you to generate appearance streams with characters outside the
     * latin alphabet (assuming the custom font supports them).
     *
     * @param options The options that should be available in this option list.
     */
    PDFOptionList.prototype.setOptions = function (options) {
        utils_1.assertIs(options, 'options', [Array]);
        this.markAsDirty();
        var optionObjects = new Array(options.length);
        for (var idx = 0, len = options.length; idx < len; idx++) {
            optionObjects[idx] = { value: core_1.PDFHexString.fromText(options[idx]) };
        }
        this.acroField.setOptions(optionObjects);
    };
    /**
     * Add to the list of options that are available for this option list. Users
     * will be able to select these values in a PDF reader. In addition to the
     * values passed as `options`, any preexisting options for this option list
     * will still be available for users to select.
     * For example:
     * ```js
     * const optionList = form.getOptionList('rockets.optionList')
     * optionList.addOptions(['Saturn IV', 'Falcon Heavy'])
     * ```
     * This method will mark this option list as dirty. See
     * [[PDFOptionList.setOptions]] for more details about what this means.
     * @param options New options that should be available in this option list.
     */
    PDFOptionList.prototype.addOptions = function (options) {
        utils_1.assertIs(options, 'options', ['string', Array]);
        this.markAsDirty();
        var optionsArr = Array.isArray(options) ? options : [options];
        var existingOptions = this.acroField.getOptions();
        var newOptions = new Array(optionsArr.length);
        for (var idx = 0, len = optionsArr.length; idx < len; idx++) {
            newOptions[idx] = { value: core_1.PDFHexString.fromText(optionsArr[idx]) };
        }
        this.acroField.setOptions(existingOptions.concat(newOptions));
    };
    /**
     * Select one or more values for this option list. This operation is analogous
     * to a human user opening the option list in a PDF reader and clicking on one
     * or more values to select them. This method will update the underlying state
     * of the option list to indicate which values have been selected. PDF
     * libraries and readers will be able to extract these values from the saved
     * document and determine which values were selected.
     * For example:
     * ```js
     * const optionList = form.getOptionList('best.superheroes.optionList')
     * optionList.select(['One Punch Man', 'Iron Man'])
     * ```
     * This method will mark this option list as dirty. See
     * [[PDFOptionList.setOptions]] for more details about what this means.
     * @param options The options to be selected.
     * @param merge Whether or not existing selections should be preserved.
     */
    PDFOptionList.prototype.select = function (options, merge) {
        if (merge === void 0) { merge = false; }
        utils_1.assertIs(options, 'options', ['string', Array]);
        utils_1.assertIs(merge, 'merge', ['boolean']);
        var optionsArr = Array.isArray(options) ? options : [options];
        var validOptions = this.getOptions();
        utils_1.assertIsSubset(optionsArr, 'option', validOptions);
        this.markAsDirty();
        if (optionsArr.length > 1 || (optionsArr.length === 1 && merge)) {
            this.enableMultiselect();
        }
        var values = new Array(optionsArr.length);
        for (var idx = 0, len = optionsArr.length; idx < len; idx++) {
            values[idx] = core_1.PDFHexString.fromText(optionsArr[idx]);
        }
        if (merge) {
            var existingValues = this.acroField.getValues();
            this.acroField.setValues(existingValues.concat(values));
        }
        else {
            this.acroField.setValues(values);
        }
    };
    /**
     * Clear all selected values for this option list. This operation is
     * equivalent to selecting an empty list. This method will update the
     * underlying state of the option list to indicate that no values have been
     * selected.
     * For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.clear()
     * ```
     * This method will mark this option list as dirty. See
     * [[PDFOptionList.setOptions]] for more details about what this means.
     */
    PDFOptionList.prototype.clear = function () {
        this.markAsDirty();
        this.acroField.setValues([]);
    };
    /**
     * Set the font size for the text in this field. There needs to be a
     * default appearance string (DA) set with a font value specified
     * for this to work. For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.setFontSize(4);
     * ```
     * @param fontSize The font size to set the font to.
     */
    /**
     * Set the font size for this field. Larger font sizes will result in larger
     * text being displayed when PDF readers render this option list. Font sizes
     * may be integer or floating point numbers. Supplying a negative font size
     * will cause this method to throw an error.
     *
     * For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.setFontSize(4)
     * optionList.setFontSize(15.7)
     * ```
     *
     * > This method depends upon the existence of a default appearance
     * > (`/DA`) string. If this field does not have a default appearance string,
     * > or that string does not contain a font size (via the `Tf` operator),
     * > then this method will throw an error.
     *
     * @param fontSize The font size to be used when rendering text in this field.
     */
    PDFOptionList.prototype.setFontSize = function (fontSize) {
        utils_1.assertPositive(fontSize, 'fontSize');
        this.acroField.setFontSize(fontSize);
        this.markAsDirty();
    };
    /**
     * Returns `true` if the options of this option list are always displayed
     * in alphabetical order, irrespective of the order in which the options
     * were added to the option list. See [[PDFOptionList.enableSorting]] and
     * [[PDFOptionList.disableSorting]]. For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * if (optionList.isSorted()) console.log('Sorting is enabled')
     * ```
     * @returns Whether or not this option list is sorted.
     */
    PDFOptionList.prototype.isSorted = function () {
        return this.acroField.hasFlag(core_1.AcroChoiceFlags.Sort);
    };
    /**
     * Always display the options of this option list in alphabetical order,
     * irrespective of the order in which the options were added to this option
     * list.
     * For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.enableSorting()
     * ```
     */
    PDFOptionList.prototype.enableSorting = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.Sort, true);
    };
    /**
     * Do not always display the options of this option list in alphabetical
     * order. Instead, display the options in whichever order they were added
     * to this option list. For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.disableSorting()
     * ```
     */
    PDFOptionList.prototype.disableSorting = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.Sort, false);
    };
    /**
     * Returns `true` if multiple options can be selected from this option list.
     * See [[PDFOptionList.enableMultiselect]] and
     * [[PDFOptionList.disableMultiselect]]. For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * if (optionList.isMultiselect()) console.log('Multiselect is enabled')
     * ```
     * @returns Whether or not multiple options can be selected.
     */
    PDFOptionList.prototype.isMultiselect = function () {
        return this.acroField.hasFlag(core_1.AcroChoiceFlags.MultiSelect);
    };
    /**
     * Allow users to select more than one option from this option list.
     * For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.enableMultiselect()
     * ```
     */
    PDFOptionList.prototype.enableMultiselect = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.MultiSelect, true);
    };
    /**
     * Do not allow users to select more than one option from this option list.
     * For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.disableMultiselect()
     * ```
     */
    PDFOptionList.prototype.disableMultiselect = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.MultiSelect, false);
    };
    /**
     * Returns `true` if the option selected by a user is stored, or "committed",
     * when the user clicks the option. The alternative is that the user's
     * selection is stored when the user leaves this option list field (by
     * clicking outside of it - on another field, for example). See
     * [[PDFOptionList.enableSelectOnClick]] and
     * [[PDFOptionList.disableSelectOnClick]]. For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * if (optionList.isSelectOnClick()) console.log('Select on click is enabled')
     * ```
     * @returns Whether or not options are selected immediately after they are
     *          clicked.
     */
    PDFOptionList.prototype.isSelectOnClick = function () {
        return this.acroField.hasFlag(core_1.AcroChoiceFlags.CommitOnSelChange);
    };
    /**
     * Store the option selected by a user immediately after the user clicks the
     * option. Do not wait for the user to leave this option list field (by
     * clicking outside of it - on another field, for example). For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.enableSelectOnClick()
     * ```
     */
    PDFOptionList.prototype.enableSelectOnClick = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.CommitOnSelChange, true);
    };
    /**
     * Wait to store the option selected by a user until they leave this option
     * list field (by clicking outside of it - on another field, for example).
     * For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.disableSelectOnClick()
     * ```
     */
    PDFOptionList.prototype.disableSelectOnClick = function () {
        this.acroField.setFlagTo(core_1.AcroChoiceFlags.CommitOnSelChange, false);
    };
    /**
     * Show this option list on the specified page. For example:
     * ```js
     * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const optionList = form.createOptionList('best.gundams')
     * optionList.setOptions(['Exia', 'Dynames', 'Kyrios', 'Virtue'])
     * optionList.select(['Exia', 'Virtue'])
     *
     * optionList.addToPage(page, {
     *   x: 50,
     *   y: 75,
     *   width: 200,
     *   height: 100,
     *   textColor: rgb(1, 0, 0),
     *   backgroundColor: rgb(0, 1, 0),
     *   borderColor: rgb(0, 0, 1),
     *   borderWidth: 2,
     *   rotate: degrees(90),
     *   font: ubuntuFont,
     * })
     * ```
     * This will create a new widget for this option list field.
     * @param page The page to which this option list widget should be added.
     * @param options The options to be used when adding this option list widget.
     */
    PDFOptionList.prototype.addToPage = function (page, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        utils_1.assertIs(page, 'page', [[PDFPage_1.default, 'PDFPage']]);
        PDFField_1.assertFieldAppearanceOptions(options);
        if (!options)
            options = {};
        if (!('textColor' in options))
            options.textColor = colors_1.rgb(0, 0, 0);
        if (!('backgroundColor' in options))
            options.backgroundColor = colors_1.rgb(1, 1, 1);
        if (!('borderColor' in options))
            options.borderColor = colors_1.rgb(0, 0, 0);
        if (!('borderWidth' in options))
            options.borderWidth = 1;
        // Create a widget for this option list
        var widget = this.createWidget({
            x: (_a = options.x) !== null && _a !== void 0 ? _a : 0,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : 0,
            width: (_c = options.width) !== null && _c !== void 0 ? _c : 200,
            height: (_d = options.height) !== null && _d !== void 0 ? _d : 100,
            textColor: options.textColor,
            backgroundColor: options.backgroundColor,
            borderColor: options.borderColor,
            borderWidth: (_e = options.borderWidth) !== null && _e !== void 0 ? _e : 0,
            rotate: (_f = options.rotate) !== null && _f !== void 0 ? _f : rotations_1.degrees(0),
            hidden: options.hidden,
            page: page.ref,
        });
        var widgetRef = this.doc.context.register(widget.dict);
        // Add widget to this field
        this.acroField.addWidget(widgetRef);
        // Set appearance streams for widget
        var font = (_g = options.font) !== null && _g !== void 0 ? _g : this.doc.getForm().getDefaultFont();
        this.updateWidgetAppearance(widget, font);
        // Add widget to the given page
        page.node.addAnnot(widgetRef);
    };
    /**
     * Returns `true` if this option list has been marked as dirty, or if any of
     * this option list's widgets do not have an appearance stream. For example:
     * ```js
     * const optionList = form.getOptionList('some.optionList.field')
     * if (optionList.needsAppearancesUpdate()) console.log('Needs update')
     * ```
     * @returns Whether or not this option list needs an appearance update.
     */
    PDFOptionList.prototype.needsAppearancesUpdate = function () {
        var _a;
        if (this.isDirty())
            return true;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof core_1.PDFStream;
            if (!hasAppearances)
                return true;
        }
        return false;
    };
    /**
     * Update the appearance streams for each of this option list's widgets using
     * the default appearance provider for option lists. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.defaultUpdateAppearances(helvetica)
     * ```
     * @param font The font to be used for creating the appearance streams.
     */
    PDFOptionList.prototype.defaultUpdateAppearances = function (font) {
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        this.updateAppearances(font);
    };
    /**
     * Update the appearance streams for each of this option list's widgets using
     * the given appearance provider. If no `provider` is passed, the default
     * appearance provider for option lists will be used. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const optionList = form.getOptionList('some.optionList.field')
     * optionList.updateAppearances(helvetica, (field, widget, font) => {
     *   ...
     *   return drawOptionList(...)
     * })
     * ```
     * @param font The font to be used for creating the appearance streams.
     * @param provider Optionally, the appearance provider to be used for
     *                 generating the contents of the appearance streams.
     */
    PDFOptionList.prototype.updateAppearances = function (font, provider) {
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        utils_1.assertOrUndefined(provider, 'provider', [Function]);
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            this.updateWidgetAppearance(widget, font, provider);
        }
        this.markAsClean();
    };
    // getOption(index: number): string {}
    // getSelectedIndices(): number[] {}
    // removeOptions(option: string | string[]) {}
    // removeIndices(option: number[]) {}
    // deselect(options: string | string[]) {}
    // deselectIndices(optionIndices: number[]) {}
    PDFOptionList.prototype.updateWidgetAppearance = function (widget, font, provider) {
        var apProvider = provider !== null && provider !== void 0 ? provider : appearances_1.defaultOptionListAppearanceProvider;
        var appearances = appearances_1.normalizeAppearance(apProvider(this, widget, font));
        this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getOptionList]] method, which will create
     * > an instance of [[PDFOptionList]] for you.
     *
     * Create an instance of [[PDFOptionList]] from an existing acroListBox and
     * ref
     *
     * @param acroComboBox The underlying `PDFAcroListBox` for this option list.
     * @param ref The unique reference for this option list.
     * @param doc The document to which this option list will belong.
     */
    PDFOptionList.of = function (acroListBox, ref, doc) {
        return new PDFOptionList(acroListBox, ref, doc);
    };
    return PDFOptionList;
}(PDFField_1.default));
exports.default = PDFOptionList;
//# sourceMappingURL=PDFOptionList.js.map
}, function(modId) { var map = {"../PDFPage":1767772065570,"../PDFFont":1767772065573,"./PDFField":1767772065577,"./appearances":1767772065461,"../colors":1767772065463,"../rotations":1767772065564,"../../core":1767772065466,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065582, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFPage_1 = tslib_1.__importDefault(require("../PDFPage"));
var PDFField_1 = tslib_1.__importStar(require("./PDFField"));
var appearances_1 = require("./appearances");
var colors_1 = require("../colors");
var rotations_1 = require("../rotations");
var core_1 = require("../../core");
var utils_1 = require("../../utils");
/**
 * Represents a radio group field of a [[PDFForm]].
 *
 * [[PDFRadioGroup]] fields are collections of radio buttons. The purpose of a
 * radio group is to enable users to select one option from a set of mutually
 * exclusive choices. Each choice in a radio group is represented by a radio
 * button. Radio buttons each have two states: `on` and `off`. At most one
 * radio button in a group may be in the `on` state at any time. Users can
 * click on a radio button to select it (and thereby automatically deselect any
 * other radio button that might have already been selected). Some radio
 * groups allow users to toggle a selected radio button `off` by clicking on
 * it (see [[PDFRadioGroup.isOffToggleable]]).
 *
 * Note that some radio groups allow multiple radio buttons to be in the `on`
 * state at the same type **if** they represent the same underlying value (see
 * [[PDFRadioGroup.isMutuallyExclusive]]).
 */
var PDFRadioGroup = /** @class */ (function (_super) {
    tslib_1.__extends(PDFRadioGroup, _super);
    function PDFRadioGroup(acroRadioButton, ref, doc) {
        var _this = _super.call(this, acroRadioButton, ref, doc) || this;
        utils_1.assertIs(acroRadioButton, 'acroRadioButton', [
            [core_1.PDFAcroRadioButton, 'PDFAcroRadioButton'],
        ]);
        _this.acroField = acroRadioButton;
        return _this;
    }
    /**
     * Get the list of available options for this radio group. Each option is
     * represented by a radio button. These radio buttons are displayed at
     * various locations in the document, potentially on different pages (though
     * typically they are stacked horizontally or vertically on the same page).
     * For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * const options = radioGroup.getOptions()
     * console.log('Radio Group options:', options)
     * ```
     * @returns The options for this radio group.
     */
    PDFRadioGroup.prototype.getOptions = function () {
        var exportValues = this.acroField.getExportValues();
        if (exportValues) {
            var exportOptions = new Array(exportValues.length);
            for (var idx = 0, len = exportValues.length; idx < len; idx++) {
                exportOptions[idx] = exportValues[idx].decodeText();
            }
            return exportOptions;
        }
        var onValues = this.acroField.getOnValues();
        var onOptions = new Array(onValues.length);
        for (var idx = 0, len = onOptions.length; idx < len; idx++) {
            onOptions[idx] = onValues[idx].decodeText();
        }
        return onOptions;
    };
    /**
     * Get the selected option for this radio group. The selected option is
     * represented by the radio button in this group that is turned on. At most
     * one radio button in a group can be selected. If no buttons in this group
     * are selected, `undefined` is returned.
     * For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * const selected = radioGroup.getSelected()
     * console.log('Selected radio button:', selected)
     * ```
     * @returns The selected option for this radio group.
     */
    PDFRadioGroup.prototype.getSelected = function () {
        var value = this.acroField.getValue();
        if (value === core_1.PDFName.of('Off'))
            return undefined;
        var exportValues = this.acroField.getExportValues();
        if (exportValues) {
            var onValues = this.acroField.getOnValues();
            for (var idx = 0, len = onValues.length; idx < len; idx++) {
                if (onValues[idx] === value)
                    return exportValues[idx].decodeText();
            }
        }
        return value.decodeText();
    };
    // // TODO: Figure out why this seems to crash Acrobat. Maybe it's because we
    // //       aren't removing the widget reference from the page's Annots?
    // removeOption(option: string) {
    //   assertIs(option, 'option', ['string']);
    //   // TODO: Assert is valid `option`!
    //   const onValues = this.acroField.getOnValues();
    //   const exportValues = this.acroField.getExportValues();
    //   if (exportValues) {
    //     for (let idx = 0, len = exportValues.length; idx < len; idx++) {
    //       if (exportValues[idx].decodeText() === option) {
    //         this.acroField.removeWidget(idx);
    //         this.acroField.removeExportValue(idx);
    //       }
    //     }
    //   } else {
    //     for (let idx = 0, len = onValues.length; idx < len; idx++) {
    //       const value = onValues[idx];
    //       if (value.decodeText() === option) {
    //         this.acroField.removeWidget(idx);
    //         this.acroField.removeExportValue(idx);
    //       }
    //     }
    //   }
    // }
    /**
     * Select an option for this radio group. This operation is analogous to a
     * human user clicking one of the radio buttons in this group via a PDF
     * reader to toggle it on. This method will update the underlying state of
     * the radio group to indicate which option has been selected. PDF libraries
     * and readers will be able to extract this value from the saved document and
     * determine which option was selected.
     *
     * For example:
     * ```js
     * const radioGroup = form.getRadioGroup('best.superhero.radioGroup')
     * radioGroup.select('One Punch Man')
     * ```
     *
     * This method will mark this radio group as dirty, causing its appearance
     * streams to be updated when either [[PDFDocument.save]] or
     * [[PDFForm.updateFieldAppearances]] is called. The updated appearance
     * streams will display a dot inside the widget of this check box field
     * that represents the selected option.
     *
     * @param option The option to be selected.
     */
    PDFRadioGroup.prototype.select = function (option) {
        utils_1.assertIs(option, 'option', ['string']);
        var validOptions = this.getOptions();
        utils_1.assertIsOneOf(option, 'option', validOptions);
        this.markAsDirty();
        var onValues = this.acroField.getOnValues();
        var exportValues = this.acroField.getExportValues();
        if (exportValues) {
            for (var idx = 0, len = exportValues.length; idx < len; idx++) {
                if (exportValues[idx].decodeText() === option) {
                    this.acroField.setValue(onValues[idx]);
                }
            }
        }
        else {
            for (var idx = 0, len = onValues.length; idx < len; idx++) {
                var value = onValues[idx];
                if (value.decodeText() === option)
                    this.acroField.setValue(value);
            }
        }
    };
    /**
     * Clear any selected option for this dropdown. This will result in all
     * radio buttons in this group being toggled off. This method will update
     * the underlying state of the dropdown to indicate that no radio buttons
     * have been selected.
     * For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * radioGroup.clear()
     * ```
     * This method will mark this radio group as dirty. See
     * [[PDFRadioGroup.select]] for more details about what this means.
     */
    PDFRadioGroup.prototype.clear = function () {
        this.markAsDirty();
        this.acroField.setValue(core_1.PDFName.of('Off'));
    };
    /**
     * Returns `true` if users can click on radio buttons in this group to toggle
     * them off. The alternative is that once a user clicks on a radio button
     * to select it, the only way to deselect it is by selecting on another radio
     * button in the group. See [[PDFRadioGroup.enableOffToggling]] and
     * [[PDFRadioGroup.disableOffToggling]]. For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * if (radioGroup.isOffToggleable()) console.log('Off toggling is enabled')
     * ```
     */
    PDFRadioGroup.prototype.isOffToggleable = function () {
        return !this.acroField.hasFlag(core_1.AcroButtonFlags.NoToggleToOff);
    };
    /**
     * Allow users to click on selected radio buttons in this group to toggle
     * them off. For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * radioGroup.enableOffToggling()
     * ```
     * > **NOTE:** This feature is documented in the PDF specification
     * > (Table 226). However, most PDF readers do not respect this option and
     * > prevent users from toggling radio buttons off even when it is enabled.
     * > At the time of this writing (9/6/2020) Mac's Preview software did
     * > respect the option. Adobe Acrobat, Foxit Reader, and Google Chrome did
     * > not.
     */
    PDFRadioGroup.prototype.enableOffToggling = function () {
        this.acroField.setFlagTo(core_1.AcroButtonFlags.NoToggleToOff, false);
    };
    /**
     * Prevent users from clicking on selected radio buttons in this group to
     * toggle them off. Clicking on a selected radio button will have no effect.
     * The only way to deselect a selected radio button is to click on a
     * different radio button in the group. For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * radioGroup.disableOffToggling()
     * ```
     */
    PDFRadioGroup.prototype.disableOffToggling = function () {
        this.acroField.setFlagTo(core_1.AcroButtonFlags.NoToggleToOff, true);
    };
    /**
     * Returns `true` if the radio buttons in this group are mutually exclusive.
     * This means that when the user selects a radio button, only that specific
     * button will be turned on. Even if other radio buttons in the group
     * represent the same value, they will not be enabled. The alternative to
     * this is that clicking a radio button will select that button along with
     * any other radio buttons in the group that share the same value. See
     * [[PDFRadioGroup.enableMutualExclusion]] and
     * [[PDFRadioGroup.disableMutualExclusion]].
     * For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * if (radioGroup.isMutuallyExclusive()) console.log('Mutual exclusion is enabled')
     * ```
     */
    PDFRadioGroup.prototype.isMutuallyExclusive = function () {
        return !this.acroField.hasFlag(core_1.AcroButtonFlags.RadiosInUnison);
    };
    /**
     * When the user clicks a radio button in this group it will be selected. In
     * addition, any other radio buttons in this group that share the same
     * underlying value will also be selected. For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * radioGroup.enableMutualExclusion()
     * ```
     * Note that this option must be enabled prior to adding options to the
     * radio group. It does not currently apply retroactively to existing
     * radio buttons in the group.
     */
    PDFRadioGroup.prototype.enableMutualExclusion = function () {
        this.acroField.setFlagTo(core_1.AcroButtonFlags.RadiosInUnison, false);
    };
    /**
     * When the user clicks a radio button in this group only it will be selected.
     * No other radio buttons in the group will be selected, even if they share
     * the same underlying value. For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * radioGroup.disableMutualExclusion()
     * ```
     * Note that this option must be disabled prior to adding options to the
     * radio group. It does not currently apply retroactively to existing
     * radio buttons in the group.
     */
    PDFRadioGroup.prototype.disableMutualExclusion = function () {
        this.acroField.setFlagTo(core_1.AcroButtonFlags.RadiosInUnison, true);
    };
    /**
     * Add a new radio button to this group on the specified page. For example:
     * ```js
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const radioGroup = form.createRadioGroup('best.gundam')
     *
     * const options = {
     *   x: 50,
     *   width: 25,
     *   height: 25,
     *   textColor: rgb(1, 0, 0),
     *   backgroundColor: rgb(0, 1, 0),
     *   borderColor: rgb(0, 0, 1),
     *   borderWidth: 2,
     *   rotate: degrees(90),
     * }
     *
     * radioGroup.addOptionToPage('Exia', page, { ...options, y: 50 })
     * radioGroup.addOptionToPage('Dynames', page, { ...options, y: 110 })
     * ```
     * This will create a new radio button widget for this radio group field.
     * @param option The option that the radio button widget represents.
     * @param page The page to which the radio button widget should be added.
     * @param options The options to be used when adding the radio button widget.
     */
    PDFRadioGroup.prototype.addOptionToPage = function (option, page, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        utils_1.assertIs(option, 'option', ['string']);
        utils_1.assertIs(page, 'page', [[PDFPage_1.default, 'PDFPage']]);
        PDFField_1.assertFieldAppearanceOptions(options);
        // Create a widget for this radio button
        var widget = this.createWidget({
            x: (_a = options === null || options === void 0 ? void 0 : options.x) !== null && _a !== void 0 ? _a : 0,
            y: (_b = options === null || options === void 0 ? void 0 : options.y) !== null && _b !== void 0 ? _b : 0,
            width: (_c = options === null || options === void 0 ? void 0 : options.width) !== null && _c !== void 0 ? _c : 50,
            height: (_d = options === null || options === void 0 ? void 0 : options.height) !== null && _d !== void 0 ? _d : 50,
            textColor: (_e = options === null || options === void 0 ? void 0 : options.textColor) !== null && _e !== void 0 ? _e : colors_1.rgb(0, 0, 0),
            backgroundColor: (_f = options === null || options === void 0 ? void 0 : options.backgroundColor) !== null && _f !== void 0 ? _f : colors_1.rgb(1, 1, 1),
            borderColor: (_g = options === null || options === void 0 ? void 0 : options.borderColor) !== null && _g !== void 0 ? _g : colors_1.rgb(0, 0, 0),
            borderWidth: (_h = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _h !== void 0 ? _h : 1,
            rotate: (_j = options === null || options === void 0 ? void 0 : options.rotate) !== null && _j !== void 0 ? _j : rotations_1.degrees(0),
            hidden: options === null || options === void 0 ? void 0 : options.hidden,
            page: page.ref,
        });
        var widgetRef = this.doc.context.register(widget.dict);
        // Add widget to this field
        var apStateValue = this.acroField.addWidgetWithOpt(widgetRef, core_1.PDFHexString.fromText(option), !this.isMutuallyExclusive());
        // Set appearance streams for widget
        widget.setAppearanceState(core_1.PDFName.of('Off'));
        this.updateWidgetAppearance(widget, apStateValue);
        // Add widget to the given page
        page.node.addAnnot(widgetRef);
    };
    /**
     * Returns `true` if any of this group's radio button widgets do not have an
     * appearance stream for their current state. For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * if (radioGroup.needsAppearancesUpdate()) console.log('Needs update')
     * ```
     * @returns Whether or not this radio group needs an appearance update.
     */
    PDFRadioGroup.prototype.needsAppearancesUpdate = function () {
        var _a;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var state = widget.getAppearanceState();
            var normal = (_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal;
            if (!(normal instanceof core_1.PDFDict))
                return true;
            if (state && !normal.has(state))
                return true;
        }
        return false;
    };
    /**
     * Update the appearance streams for each of this group's radio button widgets
     * using the default appearance provider for radio groups. For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * radioGroup.defaultUpdateAppearances()
     * ```
     */
    PDFRadioGroup.prototype.defaultUpdateAppearances = function () {
        this.updateAppearances();
    };
    // rg.updateAppearances((field: any, widget: any) => {
    //   assert(field === rg);
    //   assert(widget instanceof PDFWidgetAnnotation);
    //   return { on: [...rectangle, ...circle], off: [...rectangle, ...circle] };
    // });
    /**
     * Update the appearance streams for each of this group's radio button widgets
     * using the given appearance provider. If no `provider` is passed, the
     * default appearance provider for radio groups will be used. For example:
     * ```js
     * const radioGroup = form.getRadioGroup('some.radioGroup.field')
     * radioGroup.updateAppearances((field, widget) => {
     *   ...
     *   return {
     *     normal: { on: drawRadioButton(...), off: drawRadioButton(...) },
     *     down: { on: drawRadioButton(...), off: drawRadioButton(...) },
     *   }
     * })
     * ```
     * @param provider Optionally, the appearance provider to be used for
     *                 generating the contents of the appearance streams.
     */
    PDFRadioGroup.prototype.updateAppearances = function (provider) {
        utils_1.assertOrUndefined(provider, 'provider', [Function]);
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var onValue = widget.getOnValue();
            if (!onValue)
                continue;
            this.updateWidgetAppearance(widget, onValue, provider);
        }
    };
    PDFRadioGroup.prototype.updateWidgetAppearance = function (widget, onValue, provider) {
        var apProvider = provider !== null && provider !== void 0 ? provider : appearances_1.defaultRadioGroupAppearanceProvider;
        var appearances = appearances_1.normalizeAppearance(apProvider(this, widget));
        this.updateOnOffWidgetAppearance(widget, onValue, appearances);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getOptionList]] method, which will create an
     * > instance of [[PDFOptionList]] for you.
     *
     * Create an instance of [[PDFOptionList]] from an existing acroRadioButton
     * and ref
     *
     * @param acroRadioButton The underlying `PDFAcroRadioButton` for this
     *                        radio group.
     * @param ref The unique reference for this radio group.
     * @param doc The document to which this radio group will belong.
     */
    PDFRadioGroup.of = function (acroRadioButton, ref, doc) { return new PDFRadioGroup(acroRadioButton, ref, doc); };
    return PDFRadioGroup;
}(PDFField_1.default));
exports.default = PDFRadioGroup;
//# sourceMappingURL=PDFRadioGroup.js.map
}, function(modId) { var map = {"../PDFPage":1767772065570,"./PDFField":1767772065577,"./appearances":1767772065461,"../colors":1767772065463,"../rotations":1767772065564,"../../core":1767772065466,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065583, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFField_1 = tslib_1.__importDefault(require("./PDFField"));
var core_1 = require("../../core");
var utils_1 = require("../../utils");
/**
 * Represents a signature field of a [[PDFForm]].
 *
 * [[PDFSignature]] fields are digital signatures. `pdf-lib` does not
 * currently provide any specialized APIs for creating digital signatures or
 * reading the contents of existing digital signatures.
 */
var PDFSignature = /** @class */ (function (_super) {
    tslib_1.__extends(PDFSignature, _super);
    function PDFSignature(acroSignature, ref, doc) {
        var _this = _super.call(this, acroSignature, ref, doc) || this;
        utils_1.assertIs(acroSignature, 'acroSignature', [
            [core_1.PDFAcroSignature, 'PDFAcroSignature'],
        ]);
        _this.acroField = acroSignature;
        return _this;
    }
    PDFSignature.prototype.needsAppearancesUpdate = function () {
        return false;
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getSignature]] method, which will create an
     * > instance of [[PDFSignature]] for you.
     *
     * Create an instance of [[PDFSignature]] from an existing acroSignature and
     * ref
     *
     * @param acroSignature The underlying `PDFAcroSignature` for this signature.
     * @param ref The unique reference for this signature.
     * @param doc The document to which this signature will belong.
     */
    PDFSignature.of = function (acroSignature, ref, doc) { return new PDFSignature(acroSignature, ref, doc); };
    return PDFSignature;
}(PDFField_1.default));
exports.default = PDFSignature;
//# sourceMappingURL=PDFSignature.js.map
}, function(modId) { var map = {"./PDFField":1767772065577,"../../core":1767772065466,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065584, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFPage_1 = tslib_1.__importDefault(require("../PDFPage"));
var PDFFont_1 = tslib_1.__importDefault(require("../PDFFont"));
var PDFField_1 = tslib_1.__importStar(require("./PDFField"));
var appearances_1 = require("./appearances");
var colors_1 = require("../colors");
var rotations_1 = require("../rotations");
var errors_1 = require("../errors");
var alignment_1 = require("../image/alignment");
var alignment_2 = require("../text/alignment");
var core_1 = require("../../core");
var utils_1 = require("../../utils");
/**
 * Represents a text field of a [[PDFForm]].
 *
 * [[PDFTextField]] fields are boxes that display text entered by the user. The
 * purpose of a text field is to enable users to enter text or view text values
 * in the document prefilled by software. Users can click on a text field and
 * input text via their keyboard. Some text fields allow multiple lines of text
 * to be entered (see [[PDFTextField.isMultiline]]).
 */
var PDFTextField = /** @class */ (function (_super) {
    tslib_1.__extends(PDFTextField, _super);
    function PDFTextField(acroText, ref, doc) {
        var _this = _super.call(this, acroText, ref, doc) || this;
        utils_1.assertIs(acroText, 'acroText', [[core_1.PDFAcroText, 'PDFAcroText']]);
        _this.acroField = acroText;
        return _this;
    }
    /**
     * Get the text that this field contains. This text is visible to users who
     * view this field in a PDF reader.
     *
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * const text = textField.getText()
     * console.log('Text field contents:', text)
     * ```
     *
     * Note that if this text field contains no underlying value, `undefined`
     * will be returned. Text fields may also contain an underlying value that
     * is simply an empty string (`''`). This detail is largely irrelevant for
     * most applications. In general, you'll want to treat both cases the same
     * way and simply consider the text field to be empty. In either case, the
     * text field will appear empty to users when viewed in a PDF reader.
     *
     * An error will be thrown if this is a rich text field. `pdf-lib` does not
     * support reading rich text fields. Nor do most PDF readers and writers.
     * Rich text fields are based on XFA (XML Forms Architecture). Relatively few
     * PDFs use rich text fields or XFA. Unlike PDF itself, XFA is not an ISO
     * standard. XFA has been deprecated in PDF 2.0:
     * * https://en.wikipedia.org/wiki/XFA
     * * http://blog.pdfshareforms.com/pdf-2-0-release-bid-farewell-xfa-forms/
     *
     * @returns The text contained in this text field.
     */
    PDFTextField.prototype.getText = function () {
        var value = this.acroField.getValue();
        if (!value && this.isRichFormatted()) {
            throw new errors_1.RichTextFieldReadError(this.getName());
        }
        return value === null || value === void 0 ? void 0 : value.decodeText();
    };
    /**
     * Set the text for this field. This operation is analogous to a human user
     * clicking on the text field in a PDF reader and typing in text via their
     * keyboard. This method will update the underlying state of the text field
     * to indicate what text has been set. PDF libraries and readers will be able
     * to extract these values from the saved document and determine what text
     * was set.
     *
     * For example:
     * ```js
     * const textField = form.getTextField('best.superhero.text.field')
     * textField.setText('One Punch Man')
     * ```
     *
     * This method will mark this text field as dirty, causing its appearance
     * streams to be updated when either [[PDFDocument.save]] or
     * [[PDFForm.updateFieldAppearances]] is called. The updated streams will
     * display the text this field contains inside the widgets of this text
     * field.
     *
     * **IMPORTANT:** The default font used to update appearance streams is
     * [[StandardFonts.Helvetica]]. Note that this is a WinAnsi font. This means
     * that encoding errors will be thrown if this field contains text outside
     * the WinAnsi character set (the latin alphabet).
     *
     * Embedding a custom font and passing it to
     * [[PDFForm.updateFieldAppearances]] or [[PDFTextField.updateAppearances]]
     * allows you to generate appearance streams with characters outside the
     * latin alphabet (assuming the custom font supports them).
     *
     * If this is a rich text field, it will be converted to a standard text
     * field in order to set the text. `pdf-lib` does not support writing rich
     * text strings. Nor do most PDF readers and writers. See
     * [[PDFTextField.getText]] for more information about rich text fields and
     * their deprecation in PDF 2.0.
     *
     * @param text The text this field should contain.
     */
    PDFTextField.prototype.setText = function (text) {
        utils_1.assertOrUndefined(text, 'text', ['string']);
        var maxLength = this.getMaxLength();
        if (maxLength !== undefined && text && text.length > maxLength) {
            throw new errors_1.ExceededMaxLengthError(text.length, maxLength, this.getName());
        }
        this.markAsDirty();
        this.disableRichFormatting();
        if (text) {
            this.acroField.setValue(core_1.PDFHexString.fromText(text));
        }
        else {
            this.acroField.removeValue();
        }
    };
    /**
     * Get the alignment for this text field. This value represents the
     * justification of the text when it is displayed to the user in PDF readers.
     * There are three possible alignments: left, center, and right. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * const alignment = textField.getAlignment()
     * if (alignment === TextAlignment.Left) console.log('Text is left justified')
     * if (alignment === TextAlignment.Center) console.log('Text is centered')
     * if (alignment === TextAlignment.Right) console.log('Text is right justified')
     * ```
     * @returns The alignment of this text field.
     */
    PDFTextField.prototype.getAlignment = function () {
        var quadding = this.acroField.getQuadding();
        // prettier-ignore
        return (quadding === 0 ? alignment_2.TextAlignment.Left
            : quadding === 1 ? alignment_2.TextAlignment.Center
                : quadding === 2 ? alignment_2.TextAlignment.Right
                    : alignment_2.TextAlignment.Left);
    };
    /**
     * Set the alignment for this text field. This will determine the
     * justification of the text when it is displayed to the user in PDF readers.
     * There are three possible alignments: left, center, and right. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     *
     * // Text will be left justified when displayed
     * textField.setAlignment(TextAlignment.Left)
     *
     * // Text will be centered when displayed
     * textField.setAlignment(TextAlignment.Center)
     *
     * // Text will be right justified when displayed
     * textField.setAlignment(TextAlignment.Right)
     * ```
     * This method will mark this text field as dirty. See
     * [[PDFTextField.setText]] for more details about what this means.
     * @param alignment The alignment for this text field.
     */
    PDFTextField.prototype.setAlignment = function (alignment) {
        utils_1.assertIsOneOf(alignment, 'alignment', alignment_2.TextAlignment);
        this.markAsDirty();
        this.acroField.setQuadding(alignment);
    };
    /**
     * Get the maximum length of this field. This value represents the maximum
     * number of characters that can be typed into this field by the user. If
     * this field does not have a maximum length, `undefined` is returned.
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * const maxLength = textField.getMaxLength()
     * if (maxLength === undefined) console.log('No max length')
     * else console.log(`Max length is ${maxLength}`)
     * ```
     * @returns The maximum number of characters allowed in this field, or
     *          `undefined` if no limit exists.
     */
    PDFTextField.prototype.getMaxLength = function () {
        return this.acroField.getMaxLength();
    };
    /**
     * Set the maximum length of this field. This limits the number of characters
     * that can be typed into this field by the user. This also limits the length
     * of the string that can be passed to [[PDFTextField.setText]]. This limit
     * can be removed by passing `undefined` as `maxLength`. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     *
     * // Allow between 0 and 5 characters to be entered
     * textField.setMaxLength(5)
     *
     * // Allow any number of characters to be entered
     * textField.setMaxLength(undefined)
     * ```
     * This method will mark this text field as dirty. See
     * [[PDFTextField.setText]] for more details about what this means.
     * @param maxLength The maximum number of characters allowed in this field, or
     *                  `undefined` to remove the limit.
     */
    PDFTextField.prototype.setMaxLength = function (maxLength) {
        utils_1.assertRangeOrUndefined(maxLength, 'maxLength', 0, Number.MAX_SAFE_INTEGER);
        this.markAsDirty();
        if (maxLength === undefined) {
            this.acroField.removeMaxLength();
        }
        else {
            var text = this.getText();
            if (text && text.length > maxLength) {
                throw new errors_1.InvalidMaxLengthError(text.length, maxLength, this.getName());
            }
            this.acroField.setMaxLength(maxLength);
        }
    };
    /**
     * Remove the maximum length for this text field. This allows any number of
     * characters to be typed into this field by the user. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.removeMaxLength()
     * ```
     * Calling this method is equivalent to passing `undefined` to
     * [[PDFTextField.setMaxLength]].
     */
    PDFTextField.prototype.removeMaxLength = function () {
        this.markAsDirty();
        this.acroField.removeMaxLength();
    };
    /**
     * Display an image inside the bounds of this text field's widgets. For example:
     * ```js
     * const pngImage = await pdfDoc.embedPng(...)
     * const textField = form.getTextField('some.text.field')
     * textField.setImage(pngImage)
     * ```
     * This will update the appearances streams for each of this text field's widgets.
     * @param image The image that should be displayed.
     */
    PDFTextField.prototype.setImage = function (image) {
        var fieldAlignment = this.getAlignment();
        // prettier-ignore
        var alignment = fieldAlignment === alignment_2.TextAlignment.Center ? alignment_1.ImageAlignment.Center
            : fieldAlignment === alignment_2.TextAlignment.Right ? alignment_1.ImageAlignment.Right
                : alignment_1.ImageAlignment.Left;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var streamRef = this.createImageAppearanceStream(widget, image, alignment);
            this.updateWidgetAppearances(widget, { normal: streamRef });
        }
        this.markAsClean();
    };
    /**
     * Set the font size for this field. Larger font sizes will result in larger
     * text being displayed when PDF readers render this text field. Font sizes
     * may be integer or floating point numbers. Supplying a negative font size
     * will cause this method to throw an error.
     *
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.setFontSize(4)
     * textField.setFontSize(15.7)
     * ```
     *
     * > This method depends upon the existence of a default appearance
     * > (`/DA`) string. If this field does not have a default appearance string,
     * > or that string does not contain a font size (via the `Tf` operator),
     * > then this method will throw an error.
     *
     * @param fontSize The font size to be used when rendering text in this field.
     */
    PDFTextField.prototype.setFontSize = function (fontSize) {
        utils_1.assertPositive(fontSize, 'fontSize');
        this.acroField.setFontSize(fontSize);
        this.markAsDirty();
    };
    /**
     * Returns `true` if each line of text is shown on a new line when this
     * field is displayed in a PDF reader. The alternative is that all lines of
     * text are merged onto a single line when displayed. See
     * [[PDFTextField.enableMultiline]] and [[PDFTextField.disableMultiline]].
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * if (textField.isMultiline()) console.log('Multiline is enabled')
     * ```
     * @returns Whether or not this is a multiline text field.
     */
    PDFTextField.prototype.isMultiline = function () {
        return this.acroField.hasFlag(core_1.AcroTextFlags.Multiline);
    };
    /**
     * Display each line of text on a new line when this field is displayed in a
     * PDF reader. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.enableMultiline()
     * ```
     * This method will mark this text field as dirty. See
     * [[PDFTextField.setText]] for more details about what this means.
     */
    PDFTextField.prototype.enableMultiline = function () {
        this.markAsDirty();
        this.acroField.setFlagTo(core_1.AcroTextFlags.Multiline, true);
    };
    /**
     * Display each line of text on the same line when this field is displayed
     * in a PDF reader. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.disableMultiline()
     * ```
     * This method will mark this text field as dirty. See
     * [[PDFTextField.setText]] for more details about what this means.
     */
    PDFTextField.prototype.disableMultiline = function () {
        this.markAsDirty();
        this.acroField.setFlagTo(core_1.AcroTextFlags.Multiline, false);
    };
    /**
     * Returns `true` if this is a password text field. This means that the field
     * is intended for storing a secure password. See
     * [[PDFTextField.enablePassword]] and [[PDFTextField.disablePassword]].
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * if (textField.isPassword()) console.log('Password is enabled')
     * ```
     * @returns Whether or not this is a password text field.
     */
    PDFTextField.prototype.isPassword = function () {
        return this.acroField.hasFlag(core_1.AcroTextFlags.Password);
    };
    /**
     * Indicate that this text field is intended for storing a secure password.
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.enablePassword()
     * ```
     * Values entered into password text fields should not be displayed on the
     * screen by PDF readers. Most PDF readers will display the value as
     * asterisks or bullets. PDF readers should never store values entered by the
     * user into password text fields. Similarly, applications should not
     * write data to a password text field.
     *
     * **Please note that this method does not cause entered values to be
     * encrypted or secured in any way! It simply sets a flag that PDF software
     * and readers can access to determine the _purpose_ of this field.**
     */
    PDFTextField.prototype.enablePassword = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.Password, true);
    };
    /**
     * Indicate that this text field is **not** intended for storing a secure
     * password. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.disablePassword()
     * ```
     */
    PDFTextField.prototype.disablePassword = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.Password, false);
    };
    /**
     * Returns `true` if the contents of this text field represent a file path.
     * See [[PDFTextField.enableFileSelection]] and
     * [[PDFTextField.disableFileSelection]]. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * if (textField.isFileSelector()) console.log('Is a file selector')
     * ```
     * @returns Whether or not this field should contain file paths.
     */
    PDFTextField.prototype.isFileSelector = function () {
        return this.acroField.hasFlag(core_1.AcroTextFlags.FileSelect);
    };
    /**
     * Indicate that this text field is intended to store a file path. The
     * contents of the file stored at that path should be submitted as the value
     * of the field. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.enableFileSelection()
     * ```
     */
    PDFTextField.prototype.enableFileSelection = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.FileSelect, true);
    };
    /**
     * Indicate that this text field is **not** intended to store a file path.
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.disableFileSelection()
     * ```
     */
    PDFTextField.prototype.disableFileSelection = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.FileSelect, false);
    };
    /**
     * Returns `true` if the text entered in this field should be spell checked
     * by PDF readers. See [[PDFTextField.enableSpellChecking]] and
     * [[PDFTextField.disableSpellChecking]]. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * if (textField.isSpellChecked()) console.log('Spell checking is enabled')
     * ```
     * @returns Whether or not this field should be spell checked.
     */
    PDFTextField.prototype.isSpellChecked = function () {
        return !this.acroField.hasFlag(core_1.AcroTextFlags.DoNotSpellCheck);
    };
    /**
     * Allow PDF readers to spell check the text entered in this field.
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.enableSpellChecking()
     * ```
     */
    PDFTextField.prototype.enableSpellChecking = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.DoNotSpellCheck, false);
    };
    /**
     * Do not allow PDF readers to spell check the text entered in this field.
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.disableSpellChecking()
     * ```
     */
    PDFTextField.prototype.disableSpellChecking = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.DoNotSpellCheck, true);
    };
    /**
     * Returns `true` if PDF readers should allow the user to scroll the text
     * field when its contents do not fit within the field's view bounds. See
     * [[PDFTextField.enableScrolling]] and [[PDFTextField.disableScrolling]].
     * For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * if (textField.isScrollable()) console.log('Scrolling is enabled')
     * ```
     * @returns Whether or not the field is scrollable in PDF readers.
     */
    PDFTextField.prototype.isScrollable = function () {
        return !this.acroField.hasFlag(core_1.AcroTextFlags.DoNotScroll);
    };
    /**
     * Allow PDF readers to present a scroll bar to the user when the contents
     * of this text field do not fit within its view bounds. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.enableScrolling()
     * ```
     * A horizontal scroll bar should be shown for singleline fields. A vertical
     * scroll bar should be shown for multiline fields.
     */
    PDFTextField.prototype.enableScrolling = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.DoNotScroll, false);
    };
    /**
     * Do not allow PDF readers to present a scroll bar to the user when the
     * contents of this text field do not fit within its view bounds. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.disableScrolling()
     * ```
     */
    PDFTextField.prototype.disableScrolling = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.DoNotScroll, true);
    };
    /**
     * Returns `true` if this is a combed text field. This means that the field
     * is split into `n` equal size cells with one character in each (where `n`
     * is equal to the max length of the text field). The result is that all
     * characters in this field are displayed an equal distance apart from one
     * another. See [[PDFTextField.enableCombing]] and
     * [[PDFTextField.disableCombing]]. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * if (textField.isCombed()) console.log('Combing is enabled')
     * ```
     * Note that in order for a text field to be combed, the following must be
     * true (in addition to enabling combing):
     * * It must not be a multiline field (see [[PDFTextField.isMultiline]])
     * * It must not be a password field (see [[PDFTextField.isPassword]])
     * * It must not be a file selector field (see [[PDFTextField.isFileSelector]])
     * * It must have a max length defined (see [[PDFTextField.setMaxLength]])
     * @returns Whether or not this field is combed.
     */
    PDFTextField.prototype.isCombed = function () {
        return (this.acroField.hasFlag(core_1.AcroTextFlags.Comb) &&
            !this.isMultiline() &&
            !this.isPassword() &&
            !this.isFileSelector() &&
            this.getMaxLength() !== undefined);
    };
    /**
     * Split this field into `n` equal size cells with one character in each
     * (where `n` is equal to the max length of the text field). This will cause
     * all characters in the field to be displayed an equal distance apart from
     * one another. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.enableCombing()
     * ```
     *
     * In addition to calling this method, text fields must have a max length
     * defined in order to be combed (see [[PDFTextField.setMaxLength]]).
     *
     * This method will also call the following three methods internally:
     * * [[PDFTextField.disableMultiline]]
     * * [[PDFTextField.disablePassword]]
     * * [[PDFTextField.disableFileSelection]]
     *
     * This method will mark this text field as dirty. See
     * [[PDFTextField.setText]] for more details about what this means.
     */
    PDFTextField.prototype.enableCombing = function () {
        if (this.getMaxLength() === undefined) {
            var msg = "PDFTextFields must have a max length in order to be combed";
            console.warn(msg);
        }
        this.markAsDirty();
        this.disableMultiline();
        this.disablePassword();
        this.disableFileSelection();
        this.acroField.setFlagTo(core_1.AcroTextFlags.Comb, true);
    };
    /**
     * Turn off combing for this text field. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.disableCombing()
     * ```
     * See [[PDFTextField.isCombed]] and [[PDFTextField.enableCombing]] for more
     * information about what combing is.
     *
     * This method will mark this text field as dirty. See
     * [[PDFTextField.setText]] for more details about what this means.
     */
    PDFTextField.prototype.disableCombing = function () {
        this.markAsDirty();
        this.acroField.setFlagTo(core_1.AcroTextFlags.Comb, false);
    };
    /**
     * Returns `true` if this text field contains rich text. See
     * [[PDFTextField.enableRichFormatting]] and
     * [[PDFTextField.disableRichFormatting]]. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * if (textField.isRichFormatted()) console.log('Rich formatting enabled')
     * ```
     * @returns Whether or not this field contains rich text.
     */
    PDFTextField.prototype.isRichFormatted = function () {
        return this.acroField.hasFlag(core_1.AcroTextFlags.RichText);
    };
    /**
     * Indicate that this field contains XFA data - or rich text. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.enableRichFormatting()
     * ```
     * Note that `pdf-lib` does not support reading or writing rich text fields.
     * Nor do most PDF readers and writers. Rich text fields are based on XFA
     * (XML Forms Architecture). Relatively few PDFs use rich text fields or XFA.
     * Unlike PDF itself, XFA is not an ISO standard. XFA has been deprecated in
     * PDF 2.0:
     * * https://en.wikipedia.org/wiki/XFA
     * * http://blog.pdfshareforms.com/pdf-2-0-release-bid-farewell-xfa-forms/
     */
    PDFTextField.prototype.enableRichFormatting = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.RichText, true);
    };
    /**
     * Indicate that this is a standard text field that does not XFA data (rich
     * text). For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * textField.disableRichFormatting()
     * ```
     */
    PDFTextField.prototype.disableRichFormatting = function () {
        this.acroField.setFlagTo(core_1.AcroTextFlags.RichText, false);
    };
    /**
     * Show this text field on the specified page. For example:
     * ```js
     * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const textField = form.createTextField('best.gundam')
     * textField.setText('Exia')
     *
     * textField.addToPage(page, {
     *   x: 50,
     *   y: 75,
     *   width: 200,
     *   height: 100,
     *   textColor: rgb(1, 0, 0),
     *   backgroundColor: rgb(0, 1, 0),
     *   borderColor: rgb(0, 0, 1),
     *   borderWidth: 2,
     *   rotate: degrees(90),
     *   font: ubuntuFont,
     * })
     * ```
     * This will create a new widget for this text field.
     * @param page The page to which this text field widget should be added.
     * @param options The options to be used when adding this text field widget.
     */
    PDFTextField.prototype.addToPage = function (page, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        utils_1.assertIs(page, 'page', [[PDFPage_1.default, 'PDFPage']]);
        PDFField_1.assertFieldAppearanceOptions(options);
        if (!options)
            options = {};
        if (!('textColor' in options))
            options.textColor = colors_1.rgb(0, 0, 0);
        if (!('backgroundColor' in options))
            options.backgroundColor = colors_1.rgb(1, 1, 1);
        if (!('borderColor' in options))
            options.borderColor = colors_1.rgb(0, 0, 0);
        if (!('borderWidth' in options))
            options.borderWidth = 1;
        // Create a widget for this text field
        var widget = this.createWidget({
            x: (_a = options.x) !== null && _a !== void 0 ? _a : 0,
            y: (_b = options.y) !== null && _b !== void 0 ? _b : 0,
            width: (_c = options.width) !== null && _c !== void 0 ? _c : 200,
            height: (_d = options.height) !== null && _d !== void 0 ? _d : 50,
            textColor: options.textColor,
            backgroundColor: options.backgroundColor,
            borderColor: options.borderColor,
            borderWidth: (_e = options.borderWidth) !== null && _e !== void 0 ? _e : 0,
            rotate: (_f = options.rotate) !== null && _f !== void 0 ? _f : rotations_1.degrees(0),
            hidden: options.hidden,
            page: page.ref,
        });
        var widgetRef = this.doc.context.register(widget.dict);
        // Add widget to this field
        this.acroField.addWidget(widgetRef);
        // Set appearance streams for widget
        var font = (_g = options.font) !== null && _g !== void 0 ? _g : this.doc.getForm().getDefaultFont();
        this.updateWidgetAppearance(widget, font);
        // Add widget to the given page
        page.node.addAnnot(widgetRef);
    };
    /**
     * Returns `true` if this text field has been marked as dirty, or if any of
     * this text field's widgets do not have an appearance stream. For example:
     * ```js
     * const textField = form.getTextField('some.text.field')
     * if (textField.needsAppearancesUpdate()) console.log('Needs update')
     * ```
     * @returns Whether or not this text field needs an appearance update.
     */
    PDFTextField.prototype.needsAppearancesUpdate = function () {
        var _a;
        if (this.isDirty())
            return true;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof core_1.PDFStream;
            if (!hasAppearances)
                return true;
        }
        return false;
    };
    /**
     * Update the appearance streams for each of this text field's widgets using
     * the default appearance provider for text fields. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const textField = form.getTextField('some.text.field')
     * textField.defaultUpdateAppearances(helvetica)
     * ```
     * @param font The font to be used for creating the appearance streams.
     */
    PDFTextField.prototype.defaultUpdateAppearances = function (font) {
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        this.updateAppearances(font);
    };
    /**
     * Update the appearance streams for each of this text field's widgets using
     * the given appearance provider. If no `provider` is passed, the default
     * appearance provider for text fields will be used. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const textField = form.getTextField('some.text.field')
     * textField.updateAppearances(helvetica, (field, widget, font) => {
     *   ...
     *   return drawTextField(...)
     * })
     * ```
     * @param font The font to be used for creating the appearance streams.
     * @param provider Optionally, the appearance provider to be used for
     *                 generating the contents of the appearance streams.
     */
    PDFTextField.prototype.updateAppearances = function (font, provider) {
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        utils_1.assertOrUndefined(provider, 'provider', [Function]);
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            this.updateWidgetAppearance(widget, font, provider);
        }
        this.markAsClean();
    };
    PDFTextField.prototype.updateWidgetAppearance = function (widget, font, provider) {
        var apProvider = provider !== null && provider !== void 0 ? provider : appearances_1.defaultTextFieldAppearanceProvider;
        var appearances = appearances_1.normalizeAppearance(apProvider(this, widget, font));
        this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getTextField]] method, which will create an
     * > instance of [[PDFTextField]] for you.
     *
     * Create an instance of [[PDFTextField]] from an existing acroText and ref
     *
     * @param acroText The underlying `PDFAcroText` for this text field.
     * @param ref The unique reference for this text field.
     * @param doc The document to which this text field will belong.
     */
    PDFTextField.of = function (acroText, ref, doc) {
        return new PDFTextField(acroText, ref, doc);
    };
    return PDFTextField;
}(PDFField_1.default));
exports.default = PDFTextField;
//# sourceMappingURL=PDFTextField.js.map
}, function(modId) { var map = {"../PDFPage":1767772065570,"../PDFFont":1767772065573,"./PDFField":1767772065577,"./appearances":1767772065461,"../colors":1767772065463,"../rotations":1767772065564,"../errors":1767772065567,"../image/alignment":1767772065579,"../text/alignment":1767772065568,"../../core":1767772065466,"../../utils":1767772065468}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065585, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardFonts = void 0;
var StandardFonts;
(function (StandardFonts) {
    StandardFonts["Courier"] = "Courier";
    StandardFonts["CourierBold"] = "Courier-Bold";
    StandardFonts["CourierOblique"] = "Courier-Oblique";
    StandardFonts["CourierBoldOblique"] = "Courier-BoldOblique";
    StandardFonts["Helvetica"] = "Helvetica";
    StandardFonts["HelveticaBold"] = "Helvetica-Bold";
    StandardFonts["HelveticaOblique"] = "Helvetica-Oblique";
    StandardFonts["HelveticaBoldOblique"] = "Helvetica-BoldOblique";
    StandardFonts["TimesRoman"] = "Times-Roman";
    StandardFonts["TimesRomanBold"] = "Times-Bold";
    StandardFonts["TimesRomanItalic"] = "Times-Italic";
    StandardFonts["TimesRomanBoldItalic"] = "Times-BoldItalic";
    StandardFonts["Symbol"] = "Symbol";
    StandardFonts["ZapfDingbats"] = "ZapfDingbats";
})(StandardFonts = exports.StandardFonts || (exports.StandardFonts = {}));
//# sourceMappingURL=StandardFonts.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065586, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.PageSizes = void 0;
exports.PageSizes = {
    '4A0': [4767.87, 6740.79],
    '2A0': [3370.39, 4767.87],
    A0: [2383.94, 3370.39],
    A1: [1683.78, 2383.94],
    A2: [1190.55, 1683.78],
    A3: [841.89, 1190.55],
    A4: [595.28, 841.89],
    A5: [419.53, 595.28],
    A6: [297.64, 419.53],
    A7: [209.76, 297.64],
    A8: [147.4, 209.76],
    A9: [104.88, 147.4],
    A10: [73.7, 104.88],
    B0: [2834.65, 4008.19],
    B1: [2004.09, 2834.65],
    B2: [1417.32, 2004.09],
    B3: [1000.63, 1417.32],
    B4: [708.66, 1000.63],
    B5: [498.9, 708.66],
    B6: [354.33, 498.9],
    B7: [249.45, 354.33],
    B8: [175.75, 249.45],
    B9: [124.72, 175.75],
    B10: [87.87, 124.72],
    C0: [2599.37, 3676.54],
    C1: [1836.85, 2599.37],
    C2: [1298.27, 1836.85],
    C3: [918.43, 1298.27],
    C4: [649.13, 918.43],
    C5: [459.21, 649.13],
    C6: [323.15, 459.21],
    C7: [229.61, 323.15],
    C8: [161.57, 229.61],
    C9: [113.39, 161.57],
    C10: [79.37, 113.39],
    RA0: [2437.8, 3458.27],
    RA1: [1729.13, 2437.8],
    RA2: [1218.9, 1729.13],
    RA3: [864.57, 1218.9],
    RA4: [609.45, 864.57],
    SRA0: [2551.18, 3628.35],
    SRA1: [1814.17, 2551.18],
    SRA2: [1275.59, 1814.17],
    SRA3: [907.09, 1275.59],
    SRA4: [637.8, 907.09],
    Executive: [521.86, 756.0],
    Folio: [612.0, 936.0],
    Legal: [612.0, 1008.0],
    Letter: [612.0, 792.0],
    Tabloid: [792.0, 1224.0],
};
//# sourceMappingURL=sizes.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065587, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseSpeeds = void 0;
var ParseSpeeds;
(function (ParseSpeeds) {
    ParseSpeeds[ParseSpeeds["Fastest"] = Infinity] = "Fastest";
    ParseSpeeds[ParseSpeeds["Fast"] = 1500] = "Fast";
    ParseSpeeds[ParseSpeeds["Medium"] = 500] = "Medium";
    ParseSpeeds[ParseSpeeds["Slow"] = 100] = "Slow";
})(ParseSpeeds = exports.ParseSpeeds || (exports.ParseSpeeds = {}));
//# sourceMappingURL=PDFDocumentOptions.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065588, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("../core");
/**
 * Represents a file that has been embedded in a [[PDFDocument]].
 */
var PDFEmbeddedFile = /** @class */ (function () {
    function PDFEmbeddedFile(ref, doc, embedder) {
        this.alreadyEmbedded = false;
        this.ref = ref;
        this.doc = doc;
        this.embedder = embedder;
    }
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all embeddable files get embedded.
     *
     * Embed this embeddable file in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    PDFEmbeddedFile.prototype.embed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref, Names, EmbeddedFiles, EFNames, AF;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.alreadyEmbedded) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.embedder.embedIntoContext(this.doc.context, this.ref)];
                    case 1:
                        ref = _a.sent();
                        if (!this.doc.catalog.has(core_1.PDFName.of('Names'))) {
                            this.doc.catalog.set(core_1.PDFName.of('Names'), this.doc.context.obj({}));
                        }
                        Names = this.doc.catalog.lookup(core_1.PDFName.of('Names'), core_1.PDFDict);
                        if (!Names.has(core_1.PDFName.of('EmbeddedFiles'))) {
                            Names.set(core_1.PDFName.of('EmbeddedFiles'), this.doc.context.obj({}));
                        }
                        EmbeddedFiles = Names.lookup(core_1.PDFName.of('EmbeddedFiles'), core_1.PDFDict);
                        if (!EmbeddedFiles.has(core_1.PDFName.of('Names'))) {
                            EmbeddedFiles.set(core_1.PDFName.of('Names'), this.doc.context.obj([]));
                        }
                        EFNames = EmbeddedFiles.lookup(core_1.PDFName.of('Names'), core_1.PDFArray);
                        EFNames.push(core_1.PDFHexString.fromText(this.embedder.fileName));
                        EFNames.push(ref);
                        /**
                         * The AF-Tag is needed to achieve PDF-A3 compliance for embedded files
                         *
                         * The following document outlines the uses cases of the associated files (AF) tag.
                         * See:
                         * https://www.pdfa.org/wp-content/uploads/2018/10/PDF20_AN002-AF.pdf
                         */
                        if (!this.doc.catalog.has(core_1.PDFName.of('AF'))) {
                            this.doc.catalog.set(core_1.PDFName.of('AF'), this.doc.context.obj([]));
                        }
                        AF = this.doc.catalog.lookup(core_1.PDFName.of('AF'), core_1.PDFArray);
                        AF.push(ref);
                        this.alreadyEmbedded = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.attach]] method, which will create
     * instances of [[PDFEmbeddedFile]] for you.
     *
     * Create an instance of [[PDFEmbeddedFile]] from an existing ref and embedder
     *
     * @param ref The unique reference for this file.
     * @param doc The document to which the file will belong.
     * @param embedder The embedder that will be used to embed the file.
     */
    PDFEmbeddedFile.of = function (ref, doc, embedder) {
        return new PDFEmbeddedFile(ref, doc, embedder);
    };
    return PDFEmbeddedFile;
}());
exports.default = PDFEmbeddedFile;
//# sourceMappingURL=PDFEmbeddedFile.js.map
}, function(modId) { var map = {"../core":1767772065466}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065589, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("../core");
/**
 * Represents JavaScript that has been embedded in a [[PDFDocument]].
 */
var PDFJavaScript = /** @class */ (function () {
    function PDFJavaScript(ref, doc, embedder) {
        this.alreadyEmbedded = false;
        this.ref = ref;
        this.doc = doc;
        this.embedder = embedder;
    }
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all JavaScripts get embedded.
     *
     * Embed this JavaScript in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    PDFJavaScript.prototype.embed = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, catalog, context, ref, Names, Javascript, JSNames;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.alreadyEmbedded) return [3 /*break*/, 2];
                        _a = this.doc, catalog = _a.catalog, context = _a.context;
                        return [4 /*yield*/, this.embedder.embedIntoContext(this.doc.context, this.ref)];
                    case 1:
                        ref = _b.sent();
                        if (!catalog.has(core_1.PDFName.of('Names'))) {
                            catalog.set(core_1.PDFName.of('Names'), context.obj({}));
                        }
                        Names = catalog.lookup(core_1.PDFName.of('Names'), core_1.PDFDict);
                        if (!Names.has(core_1.PDFName.of('JavaScript'))) {
                            Names.set(core_1.PDFName.of('JavaScript'), context.obj({}));
                        }
                        Javascript = Names.lookup(core_1.PDFName.of('JavaScript'), core_1.PDFDict);
                        if (!Javascript.has(core_1.PDFName.of('Names'))) {
                            Javascript.set(core_1.PDFName.of('Names'), context.obj([]));
                        }
                        JSNames = Javascript.lookup(core_1.PDFName.of('Names'), core_1.PDFArray);
                        JSNames.push(core_1.PDFHexString.fromText(this.embedder.scriptName));
                        JSNames.push(ref);
                        this.alreadyEmbedded = true;
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.addJavaScript]] method, which will
     * create instances of [[PDFJavaScript]] for you.
     *
     * Create an instance of [[PDFJavaScript]] from an existing ref and script
     *
     * @param ref The unique reference for this script.
     * @param doc The document to which the script will belong.
     * @param embedder The embedder that will be used to embed the script.
     */
    PDFJavaScript.of = function (ref, doc, embedder) {
        return new PDFJavaScript(ref, doc, embedder);
    };
    return PDFJavaScript;
}());
exports.default = PDFJavaScript;
//# sourceMappingURL=PDFJavaScript.js.map
}, function(modId) { var map = {"../core":1767772065466}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065590, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFHexString_1 = tslib_1.__importDefault(require("../objects/PDFHexString"));
var JavaScriptEmbedder = /** @class */ (function () {
    function JavaScriptEmbedder(script, scriptName) {
        this.script = script;
        this.scriptName = scriptName;
    }
    JavaScriptEmbedder.for = function (script, scriptName) {
        return new JavaScriptEmbedder(script, scriptName);
    };
    JavaScriptEmbedder.prototype.embedIntoContext = function (context, ref) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var jsActionDict;
            return tslib_1.__generator(this, function (_a) {
                jsActionDict = context.obj({
                    Type: 'Action',
                    S: 'JavaScript',
                    JS: PDFHexString_1.default.fromText(this.script),
                });
                if (ref) {
                    context.assign(ref, jsActionDict);
                    return [2 /*return*/, ref];
                }
                else {
                    return [2 /*return*/, context.register(jsActionDict)];
                }
                return [2 /*return*/];
            });
        });
    };
    return JavaScriptEmbedder;
}());
exports.default = JavaScriptEmbedder;
//# sourceMappingURL=JavaScriptEmbedder.js.map
}, function(modId) { var map = {"../objects/PDFHexString":1767772065512}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065591, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendMode = void 0;
var BlendMode;
(function (BlendMode) {
    BlendMode["Normal"] = "Normal";
    BlendMode["Multiply"] = "Multiply";
    BlendMode["Screen"] = "Screen";
    BlendMode["Overlay"] = "Overlay";
    BlendMode["Darken"] = "Darken";
    BlendMode["Lighten"] = "Lighten";
    BlendMode["ColorDodge"] = "ColorDodge";
    BlendMode["ColorBurn"] = "ColorBurn";
    BlendMode["HardLight"] = "HardLight";
    BlendMode["SoftLight"] = "SoftLight";
    BlendMode["Difference"] = "Difference";
    BlendMode["Exclusion"] = "Exclusion";
})(BlendMode = exports.BlendMode || (exports.BlendMode = {}));
//# sourceMappingURL=PDFPageOptions.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065592, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./alignment"), exports);
tslib_1.__exportStar(require("./layout"), exports);
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {"./alignment":1767772065568,"./layout":1767772065566}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1767772065593, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=index.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1767772065458);
})()
//miniprogram-npm-outsideDeps=["tslib","@pdf-lib/standard-fonts","pako","@pdf-lib/upng"]
//# sourceMappingURL=index.js.map