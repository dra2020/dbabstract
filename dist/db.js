(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["db"] = factory();
	else
		root["db"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/all.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/all.ts":
/*!********************!*\
  !*** ./lib/all.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./db */ "./lib/db.ts"));


/***/ }),

/***/ "./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const FSM = __webpack_require__(/*! @terrencecrowley/fsm */ "@terrencecrowley/fsm");
// Custom DB state codes
exports.FSM_CREATING = FSM.FSM_CUSTOM1;
exports.FSM_NEEDRELEASE = FSM.FSM_CUSTOM2;
exports.FSM_RELEASING = FSM.FSM_CUSTOM3;
exports.FSM_READING = FSM.FSM_CUSTOM4;
class DBClient extends FSM.Fsm {
    constructor(env) {
        super(env);
    }
    get env() { return this._env; }
    createCollection(name, options) { return new DBCollection(this.env, this, name, options); }
    createUpdate(col, query, values) { return new DBUpdate(this.env, col, query, values); }
    createDelete(col, query) { return new DBDelete(this.env, col, query); }
    createFind(col, filter) { return new DBFind(this.env, col, filter); }
    createQuery(col, filter) { return new DBQuery(this.env, col, filter); }
    createIndex(col, uid) { return new DBIndex(this.env, col, uid); }
    createClose() { return new DBClose(this.env, this); }
    close() {
        if (this.state == FSM.FSM_DONE)
            this.setState(exports.FSM_NEEDRELEASE);
    }
}
exports.DBClient = DBClient;
class DBCollection extends FSM.Fsm {
    constructor(env, client, name, options) {
        super(env);
        this.waitOn(client);
        this.client = client;
        this.name = name;
        this.options = options;
        this.col = null;
    }
    get isChildError() {
        return (this.client && this.client.iserror);
    }
}
exports.DBCollection = DBCollection;
class DBUpdate extends FSM.Fsm {
    constructor(env, col, query, values) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.query = query;
        this.values = values;
        this.result = undefined;
    }
    get isChildError() {
        return (this.col && this.col.iserror);
    }
}
exports.DBUpdate = DBUpdate;
class DBDelete extends FSM.Fsm {
    constructor(env, col, query) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.query = query;
        this.result = null;
    }
    get isChildError() {
        return (this.col && this.col.iserror);
    }
}
exports.DBDelete = DBDelete;
class DBFind extends FSM.Fsm {
    constructor(env, col, filter) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.filter = filter;
        this.result = null;
    }
    get isChildError() {
        return (this.col && this.col.iserror);
    }
}
exports.DBFind = DBFind;
class DBQuery extends FSM.Fsm {
    constructor(env, col, filter) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.filter = filter;
        this.result = [];
    }
    get isChildError() {
        return (this.col && this.col.iserror);
    }
}
exports.DBQuery = DBQuery;
class DBIndex extends FSM.Fsm {
    constructor(env, col, uid) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.uid = uid;
    }
    get isChildError() {
        return (this.col && this.col.iserror);
    }
}
exports.DBIndex = DBIndex;
class DBClose extends FSM.Fsm {
    constructor(env, client) {
        super(env);
        this.client = client;
    }
    get isChildError() {
        return (this.client && this.client.iserror);
    }
    tick() {
        if (this.ready && this.isChildError)
            this.setState(FSM.FSM_ERROR);
        else if (this.ready && this.state == FSM.FSM_STARTING) {
            this.client.close();
            this.setState(FSM.FSM_DONE);
        }
    }
}
exports.DBClose = DBClose;


/***/ }),

/***/ "@terrencecrowley/fsm":
/*!***************************************!*\
  !*** external "@terrencecrowley/fsm" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@terrencecrowley/fsm");

/***/ })

/******/ });
});
//# sourceMappingURL=db.js.map