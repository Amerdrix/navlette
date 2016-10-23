(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var normalisePath = function (path) { return path.match((/\/*(.*?)\/*$/))[1]; };
    var getPathFromBrowser = function () { return normalisePath(normalisePath(window.location.pathname) + "/" + normalisePath(window.location.hash.substring(1))); };
    var getHistoryState = function () { return window.history.state || {}; };
    var doubleBack;
    var onPopstate;
    window.addEventListener('popstate', function () {
        if (onPopstate) {
            onPopstate();
            return;
        }
        var state = getHistoryState();
        var path = state.path || getPathFromBrowser();
        if (state.preventForward) {
            if (state.first) {
                if (state.applied) {
                    return;
                }
                state.applied = true;
                window.history.replaceState(state, null, null);
                delete state['applied'];
                delete state['first'];
                window.history.pushState(state, null, null);
                dispatch(path);
            }
            else {
                window.history.back();
                onPopstate = function () {
                    window.history.pushState(state, null, null);
                    dispatch(path);
                    onPopstate = null;
                };
            }
        }
        else {
            dispatch(path);
        }
    });
    exports.navTo = function (path, _a) {
        var _b = _a === void 0 ? { display: true, allowForward: true } : _a, allowForward = _b.allowForward, display = _b.display;
        return function () {
            var state = window.history.state;
            if (!allowForward) {
                state.preventForward = true;
                if (state.first) {
                    state.applied = false;
                }
                window.history.replaceState(state, null, null);
            }
            else if (state.preventForward) {
                delete state['preventForward'];
                window.history.replaceState(state, null, null);
            }
            var normalisedPath = "/" + normalisePath(path);
            if (display) {
                window.history.pushState({}, '', normalisedPath);
            }
            else {
                window.history.pushState({ path: normalisedPath }, '', '');
            }
            dispatch(path);
        };
    };
    var dispatch = function (_) { };
    function onBrowserPathDidChange(fn) {
        dispatch = function (p) { return fn(normalisePath(p)); };
    }
    exports.onBrowserPathDidChange = onBrowserPathDidChange;
    function attach() {
        var state = window.history.state || {};
        state.first = true;
        window.history.replaceState(state, null, null);
        dispatch(getPathFromBrowser());
    }
    exports.attach = attach;
});
//# sourceMappingURL=navlette.js.map