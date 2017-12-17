var Dryad =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = __webpack_require__(1);
exports.Sprite = Sprite_1.Sprite;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Sprite {
    constructor(options = {}) {
        this.id = Sprite.idCounter++;
        Object.assign(this, options);
        // Setup required option defaults
        this.name = this.name || this.constructor.name;
        this.animation = this.animation || 0;
        this.frame = this.frame || 0;
        this.frameSpeedScale = this.frameSpeedScale || 1;
        this.opacity = this.opacity || 1;
        // Set default dimensions based upon animation 
        // and load images into cache if needed
        if (this.animations) {
            if (Sprite.images[this.animations[0].image])
                this.autosize();
            else {
                console.warn(`Image not preloaded [${this.animations[0].image}]`);
                // TODO: FIGURE OUT WHY THIS ISN'T RESOLVING
                Sprite.addImages(this.animations.map(a => a.image))
                    .then(() => this.autosize())
                    .catch(e => console.warn(`error loading images`, e));
            }
        }
    }
    static addImages(filenames, imagesRoot = Sprite.imagesRoot) {
        return Promise.all(filenames.map(filename => new Promise((resolve, reject) => {
            if (this.images[filename])
                return resolve();
            this.images[filename] = new Image();
            this.images[filename].onload = resolve;
            this.images[filename].onerror = reject;
            this.images[filename].src = `${imagesRoot}/${filename}`;
        })));
    }
    autosize() {
        this.width = this.width || this.animations[0].frameWidth || Sprite.images[this.animations[0].image].width;
        this.height = this.height || this.animations[0].frameHeight || Sprite.images[this.animations[0].image].height;
    }
    render(context, x = 0, y = 0, viewWidth, viewHeight) {
        // Temp ignore unused params for compiler
        viewWidth && viewHeight;
        // Bail if no animations set
        if (!this.animations)
            return;
        let a = this.animation < this.animations.length ? this.animations[this.animation] : this.animations[0], ascale = a.scale || 1;
        // Bail if image isn't loaded or out of frame
        if (!Sprite.images[a.image] || !Sprite.images[a.image].width || this.frame >= a.frameCount)
            return;
        context.globalAlpha = this.opacity;
        context.drawImage(Sprite.images[a.image], !a.frameWidth ? 0 :
            ~~((a.xOffset || 0) + (~~this.frame * a.frameWidth)), a.yOffset || 0, a.frameWidth || Sprite.images[a.image].width, a.frameHeight || Sprite.images[a.image].height, ~~(x - (this.width * 0.5 * ascale)), ~~(y - (this.height * 0.5 * ascale)), ~~(this.width * ascale), ~~(this.height * ascale));
        context.globalAlpha = 1;
    }
    run() {
        this.updateFrame();
    }
    updateFrame() {
        if (this.animations) {
            let a = this.animation < this.animations.length ? this.animations[this.animation] : this.animations[0];
            this.frame += (a.frameSpeed * this.frameSpeedScale);
            this.frame = a.noloop || this.frame < a.frameCount ? this.frame : 0;
        }
    }
}
Sprite.idCounter = 10;
Sprite.images = {};
exports.Sprite = Sprite;


/***/ })
/******/ ]);