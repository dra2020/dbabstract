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
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/all.ts":
/*!********************!*\
  !*** ./lib/all.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./db */ "./lib/db.ts"), exports);


/***/ }),

/***/ "./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DBClose = exports.DBIndex = exports.DBQuery = exports.DBFind = exports.DBDelete = exports.DBUnset = exports.DBUpdate = exports.DBCollection = exports.DBClient = exports.toCompactSchema = exports.fromCompactIndex = exports.fromCompactKey = exports.fromCompactSchema = exports.FSM_READING = exports.FSM_RELEASING = exports.FSM_NEEDRELEASE = exports.FSM_CREATING = void 0;
const FSM = __webpack_require__(/*! @dra2020/fsm */ "@dra2020/fsm");
// Custom DB state codes
exports.FSM_CREATING = FSM.FSM_CUSTOM1;
exports.FSM_NEEDRELEASE = FSM.FSM_CUSTOM2;
exports.FSM_RELEASING = FSM.FSM_CUSTOM3;
exports.FSM_READING = FSM.FSM_CUSTOM4;
function fromCompactSchema(c) {
    let s = [];
    if (c && !Array.isArray(c)) {
        for (let p in c)
            if (c.hasOwnProperty(p))
                s.push({ AttributeName: p, AttributeType: c[p] });
    }
    else
        s = c;
    return s;
}
exports.fromCompactSchema = fromCompactSchema;
function fromCompactKey(c) {
    let s = [];
    if (c && !Array.isArray(c)) {
        for (let p in c)
            if (c.hasOwnProperty(p))
                s.push({ AttributeName: p, KeyType: c[p] });
    }
    else
        s = c;
    return s;
}
exports.fromCompactKey = fromCompactKey;
function findHash(c) {
    let h = null;
    Object.keys(c).forEach((k) => { if (c[k] === 'HASH')
        h = k; });
    while (h && h.length < 3)
        h = `_${h}`;
    return h;
}
function fromCompactIndex(c) {
    return { KeySchema: fromCompactKey(c), IndexName: findHash(c) };
}
exports.fromCompactIndex = fromCompactIndex;
function toCompactSchema(s) {
    let c = {};
    if (s && Array.isArray(s)) {
        for (let i = 0; i < s.length; i++)
            c[s[i].AttributeName] = s[i].AttributeType;
    }
    else
        c = s;
    return c;
}
exports.toCompactSchema = toCompactSchema;
class DBClient extends FSM.Fsm {
    constructor(env) {
        super(env);
    }
    get env() { return this._env; }
    createCollection(name, options) { return new DBCollection(this.env, this, name, options); }
    createStream(col) { return null; }
    closeStream(col) { }
    createUpdate(col, query, values) { return new DBUpdate(this.env, col, query, values); }
    createUnset(col, query, values) { return new DBUnset(this.env, col, query, values); }
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
}
exports.DBUpdate = DBUpdate;
class DBUnset extends FSM.Fsm {
    constructor(env, col, query, values) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.query = query;
        this.values = values;
        this.result = undefined;
    }
}
exports.DBUnset = DBUnset;
class DBDelete extends FSM.Fsm {
    constructor(env, col, query) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.query = query;
        this.result = null;
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
}
exports.DBFind = DBFind;
class DBQuery extends FSM.Fsm {
    constructor(env, col, filter) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.filter = filter;
        this.fsmResult = new FSM.FsmArray(env);
        ;
    }
    get result() { return this.fsmResult.a; }
}
exports.DBQuery = DBQuery;
class DBIndex extends FSM.Fsm {
    constructor(env, col, uid) {
        super(env);
        this.waitOn(col);
        this.col = col;
        this.uid = uid;
    }
}
exports.DBIndex = DBIndex;
class DBClose extends FSM.Fsm {
    constructor(env, client) {
        super(env);
        this.client = client;
    }
    tick() {
        if (this.ready && this.isDependentError)
            this.setState(FSM.FSM_ERROR);
        else if (this.ready && this.state == FSM.FSM_STARTING) {
            this.client.close();
            this.setState(FSM.FSM_DONE);
        }
    }
}
exports.DBClose = DBClose;


/***/ }),

/***/ "@dra2020/fsm":
/*!*******************************!*\
  !*** external "@dra2020/fsm" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@dra2020/fsm");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./lib/all.ts");
/******/ })()
;
});
//# sourceMappingURL=db.js.map