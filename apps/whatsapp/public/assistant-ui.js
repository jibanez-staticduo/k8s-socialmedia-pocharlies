//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, ee = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function te(e, t) {
		return E(e.type, t, e.props);
	}
	function ne(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function re(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var D = /\/+/g;
	function ie(e, t) {
		return typeof e == "object" && e && e.key != null ? re("" + e.key) : t.toString(36);
	}
	function O(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function ae(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, ae(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + ie(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(D, "$&/") + "/"), ae(o, r, i, "", function(e) {
			return e;
		})) : o != null && (ne(o) && (o = te(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(D, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + ie(a, u), c += ae(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + ie(a, u++), c += ae(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return ae(O(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function k(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return ae(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function A(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var j = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function oe(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, j);
		} catch (e) {
			j(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function se(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else oe(se.bind(null, e));
	}
	var ce = {
		map: k,
		forEach: function(e, t, n) {
			k(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return k(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return k(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!ne(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = ce, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = se, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !ee.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) ee.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = ne, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: A
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = oe, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.0";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, te());
			else {
				var t = n(l);
				t !== null && D(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function ee() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function E() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ee());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && D(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? te() : S = !1;
			}
		}
	}
	var te;
	if (typeof y == "function") te = function() {
		y(E);
	};
	else if (typeof MessageChannel < "u") {
		var ne = new MessageChannel(), re = ne.port2;
		ne.port1.onmessage = E, te = function() {
			re.postMessage(null);
		};
	} else te = function() {
		_(E, 0);
	};
	function D(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, D(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, te()))), r;
	}, e.unstable_shouldYield = ee, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.0";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function ee(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var E = Object.assign, te = Symbol.for("react.element"), ne = Symbol.for("react.transitional.element"), re = Symbol.for("react.portal"), D = Symbol.for("react.fragment"), ie = Symbol.for("react.strict_mode"), O = Symbol.for("react.profiler"), ae = Symbol.for("react.consumer"), k = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), j = Symbol.for("react.suspense"), oe = Symbol.for("react.suspense_list"), se = Symbol.for("react.memo"), ce = Symbol.for("react.lazy"), le = Symbol.for("react.activity"), ue = Symbol.for("react.legacy_hidden"), de = Symbol.for("react.memo_cache_sentinel"), fe = Symbol.for("react.view_transition"), pe = Symbol.for("react.recoverable"), me = Symbol.iterator;
	function he(e) {
		return typeof e != "object" || !e ? null : (e = me && e[me] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ge = Symbol.for("react.client.reference");
	function _e(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ge ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case D: return "Fragment";
			case O: return "Profiler";
			case ie: return "StrictMode";
			case j: return "Suspense";
			case oe: return "SuspenseList";
			case le: return "Activity";
			case fe: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case re: return "Portal";
			case k: return e.displayName || "Context";
			case ae: return (e._context.displayName || "Context") + ".Consumer";
			case A:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case se: return t = e.displayName || null, t === null ? _e(e.type) || "Memo" : t;
			case ce:
				t = e._payload, e = e._init;
				try {
					return _e(e(t));
				} catch {}
		}
		return null;
	}
	var ve = Array.isArray, M = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, N = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ye = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, be = [], xe = -1;
	function Se(e) {
		return { current: e };
	}
	function Ce(e) {
		0 > xe || (e.current = be[xe], be[xe] = null, xe--);
	}
	function P(e, t) {
		xe++, be[xe] = e.current, e.current = t;
	}
	var we = Se(null), Te = Se(null), Ee = Se(null), De = Se(null);
	function Oe(e, t) {
		switch (P(Ee, t), P(Te, e), P(we, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		Ce(we), P(we, e);
	}
	function ke() {
		Ce(we), Ce(Te), Ce(Ee);
	}
	function Ae(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, P(De, e)), t = we.current;
		var n = dp(t, e.type);
		t !== n && (P(Te, e), P(we, n));
	}
	function je(e) {
		Te.current === e && (Ce(we), Ce(Te)), De.current === e && (Ce(De), sh._currentValue = ye);
	}
	var Me, Ne;
	function Pe(e) {
		if (Me === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Me = t && t[1] || "", Ne = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Me + e + Ne;
	}
	var Fe = !1;
	function Ie(e, t) {
		if (!e || Fe) return "";
		Fe = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Fe = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Pe(n) : "";
	}
	function Le(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Pe(e.type);
			case 16: return Pe("Lazy");
			case 13: return e.child !== t && t !== null ? Pe("Suspense Fallback") : Pe("Suspense");
			case 19: return Pe("SuspenseList");
			case 0:
			case 15: return Ie(e.type, !1);
			case 11: return Ie(e.type.render, !1);
			case 1: return Ie(e.type, !0);
			case 31: return Pe("Activity");
			case 30: return Pe("ViewTransition");
			default: return "";
		}
	}
	function Re(e) {
		try {
			var t = "", n = null;
			do
				t += Le(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var ze = Object.prototype.hasOwnProperty, Be = t.unstable_scheduleCallback, Ve = t.unstable_cancelCallback, He = t.unstable_shouldYield, Ue = t.unstable_requestPaint, We = t.unstable_now, Ge = t.unstable_getCurrentPriorityLevel, Ke = t.unstable_ImmediatePriority, qe = t.unstable_UserBlockingPriority, Je = t.unstable_NormalPriority, Ye = t.unstable_LowPriority, Xe = t.unstable_IdlePriority, Ze = t.log, Qe = t.unstable_setDisableYieldValue, F = null, I = null;
	function $e(e) {
		if (typeof Ze == "function" && Qe(e), I && typeof I.setStrictMode == "function") try {
			I.setStrictMode(F, e);
		} catch {}
	}
	var L = Math.clz32 ? Math.clz32 : R, et = Math.log, tt = Math.LN2;
	function R(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (et(e) / tt | 0) | 0;
	}
	var nt = 256, rt = 262144, it = 4194304;
	function at(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function ot(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = at(n))) : i = at(o) : i = at(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = at(n))) : i = at(o)) : i = at(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function st(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function ct(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - L(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function lt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function ut() {
		var e = it;
		return it <<= 1, !(it & 62914560) && (it = 4194304), e;
	}
	function dt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function ft(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function pt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - L(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && mt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function mt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - L(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function ht(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - L(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function gt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : _t(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function _t(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function vt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function yt() {
		var e = N.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function bt(e, t) {
		var n = N.p;
		try {
			return N.p = e, t();
		} finally {
			N.p = n;
		}
	}
	var xt = Math.random().toString(36).slice(2), St = "__reactFiber$" + xt, Ct = "__reactProps$" + xt, wt = "__reactContainer$" + xt, Tt = "__reactEvents$" + xt, Et = "__reactListeners$" + xt, Dt = "__reactHandles$" + xt, Ot = "__reactResources$" + xt, kt = "__reactMarker$" + xt, At = "__reactLoad$" + xt;
	function jt(e) {
		delete e[St], delete e[Ct], delete e[Et], delete e[Dt];
	}
	function Mt(e) {
		var t;
		if (t = e[St]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[wt] || n[St]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[St]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Nt(e) {
		if (e = e[St] || e[wt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Pt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Ft(e) {
		var t = e[Ot];
		return t ||= e[Ot] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function It(e) {
		e[kt] = !0;
	}
	function Lt(e) {
		e[At] = void 0;
	}
	var Rt = /* @__PURE__ */ new Set(), zt = {};
	function Bt(e, t) {
		Vt(e, t), Vt(e + "Capture", t);
	}
	function Vt(e, t) {
		for (zt[e] = t, e = 0; e < t.length; e++) Rt.add(t[e]);
	}
	var Ht = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ut = {}, Wt = {};
	function Gt(e) {
		return ze.call(Wt, e) ? !0 : ze.call(Ut, e) ? !1 : Ht.test(e) ? Wt[e] = !0 : (Ut[e] = !0, !1);
	}
	var z = !1;
	function Kt() {
		var e = z;
		return z = !1, e;
	}
	function qt(e, t, n) {
		if (Gt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function Jt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function Yt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Xt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Zt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Qt(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function $t(e) {
		if (!e._valueTracker) {
			var t = Zt(e) ? "checked" : "value";
			e._valueTracker = Qt(e, t, "" + e[t]);
		}
	}
	function en(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Zt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var tn = /[\n"\\]/g;
	function nn(e) {
		return e.replace(tn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function rn(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Xt(t)) : e.value !== "" + Xt(t) && (e.value = "" + Xt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : on(e, Xt(n)) : o === "number" && e.value == t ? on(e, Xt(e.value)) : on(e, Xt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Xt(s) : e.removeAttribute("name");
	}
	function an(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				$t(e);
				return;
			}
			n = n == null ? "" : "" + Xt(n), t = t == null ? n : "" + Xt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), $t(e);
	}
	function on(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function sn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Xt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function cn(e, t, n) {
		if (t != null && (t = "" + Xt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Xt(n);
	}
	function ln(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (ve(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Xt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), $t(e);
	}
	function un(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var dn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function fn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || dn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function pn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", z = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (fn(e, a, r), z = !0);
		} else for (var o in t) t.hasOwnProperty(o) && fn(e, o, t[o]);
	}
	function mn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var hn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), gn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function _n(e) {
		return gn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function vn() {}
	var yn = null;
	function bn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var xn = null, Sn = null;
	function Cn(e) {
		var t = Nt(e);
		if (t && (e = t.stateNode)) {
			var n = e[Ct] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (rn(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + nn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[Ct] || null;
								if (!a) throw Error(i(90));
								rn(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && en(r);
					}
					break a;
				case "textarea":
					cn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && sn(e, !!n.multiple, t, !1);
			}
		}
	}
	var wn = !1;
	function Tn(e, t, n) {
		if (wn) return e(t, n);
		wn = !0;
		try {
			return e(t);
		} finally {
			if (wn = !1, (xn !== null || Sn !== null) && (zd(), xn && (t = xn, e = Sn, Sn = xn = null, Cn(t), e))) for (t = 0; t < e.length; t++) Cn(e[t]);
		}
	}
	function En(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[Ct] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var Dn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, On = !1;
	if (Dn) try {
		var kn = {};
		Object.defineProperty(kn, "passive", { get: function() {
			On = !0;
		} }), window.addEventListener("test", kn, kn), window.removeEventListener("test", kn, kn);
	} catch {
		On = !1;
	}
	var An = null, jn = null, Mn = null;
	function Nn() {
		if (Mn) return Mn;
		var e, t = jn, n = t.length, r, i = "value" in An ? An.value : An.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Mn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Pn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Fn() {
		return !0;
	}
	function In() {
		return !1;
	}
	function Ln(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Fn : In, this.isPropagationStopped = In, this;
		}
		return E(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Fn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Fn);
			},
			persist: function() {},
			isPersistent: Fn
		}), t;
	}
	var Rn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, zn = Ln(Rn), Bn = E({}, Rn, {
		view: 0,
		detail: 0
	}), Vn = Ln(Bn), Hn, Un, Wn, Gn = E({}, Bn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: nr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Wn && (Wn && e.type === "mousemove" ? (Hn = e.screenX - Wn.screenX, Un = e.screenY - Wn.screenY) : Un = Hn = 0, Wn = e), Hn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Un;
		}
	}), Kn = Ln(Gn), qn = Ln(E({}, Gn, { dataTransfer: 0 })), Jn = Ln(E({}, Bn, { relatedTarget: 0 })), Yn = Ln(E({}, Rn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Xn = Ln(E({}, Rn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Zn = Ln(E({}, Rn, { data: 0 })), Qn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, $n = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, er = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function tr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = er[e]) ? !!t[e] : !1;
	}
	function nr() {
		return tr;
	}
	var rr = Ln(E({}, Bn, {
		key: function(e) {
			if (e.key) {
				var t = Qn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Pn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? $n[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: nr,
		charCode: function(e) {
			return e.type === "keypress" ? Pn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Pn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), ir = Ln(E({}, Gn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), ar = Ln(E({}, Rn, { submitter: 0 })), or = Ln(E({}, Bn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: nr
	})), sr = Ln(E({}, Rn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), cr = Ln(E({}, Gn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), lr = Ln(E({}, Rn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), ur = [
		9,
		13,
		27,
		32
	], dr = Dn && "CompositionEvent" in window, fr = null;
	Dn && "documentMode" in document && (fr = document.documentMode);
	var pr = Dn && "TextEvent" in window && !fr, mr = Dn && (!dr || fr && 8 < fr && 11 >= fr), hr = " ", gr = !1;
	function _r(e, t) {
		switch (e) {
			case "keyup": return ur.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function vr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var yr = !1;
	function br(e, t) {
		switch (e) {
			case "compositionend": return vr(t);
			case "keypress": return t.which === 32 ? (gr = !0, hr) : null;
			case "textInput": return e = t.data, e === hr && gr ? null : e;
			default: return null;
		}
	}
	function xr(e, t) {
		if (yr) return e === "compositionend" || !dr && _r(e, t) ? (e = Nn(), Mn = jn = An = null, yr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return mr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Sr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Cr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Sr[e.type] : t === "textarea";
	}
	function wr(e, t, n, r) {
		xn ? Sn ? Sn.push(r) : Sn = [r] : xn = r, t = Jf(t, "onChange"), 0 < t.length && (n = new zn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Tr = null, Er = null;
	function Dr(e) {
		Vf(e, 0);
	}
	function Or(e) {
		if (en(Pt(e))) return e;
	}
	function kr(e, t) {
		if (e === "change") return t;
	}
	var Ar = !1;
	if (Dn) {
		var jr;
		if (Dn) {
			var Mr = "oninput" in document;
			if (!Mr) {
				var Nr = document.createElement("div");
				Nr.setAttribute("oninput", "return;"), Mr = typeof Nr.oninput == "function";
			}
			jr = Mr;
		} else jr = !1;
		Ar = jr && (!document.documentMode || 9 < document.documentMode);
	}
	function Pr() {
		Tr && (Tr.detachEvent("onpropertychange", Fr), Er = Tr = null);
	}
	function Fr(e) {
		if (e.propertyName === "value" && Or(Er)) {
			var t = [];
			wr(t, Er, e, bn(e)), Tn(Dr, t);
		}
	}
	function Ir(e, t, n) {
		e === "focusin" ? (Pr(), Tr = t, Er = n, Tr.attachEvent("onpropertychange", Fr)) : e === "focusout" && Pr();
	}
	function Lr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Or(Er);
	}
	function Rr(e, t) {
		if (e === "click") return Or(t);
	}
	function zr(e, t) {
		if (e === "input" || e === "change") return Or(t);
	}
	function Br(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Vr = typeof Object.is == "function" ? Object.is : Br;
	function Hr(e, t) {
		if (Vr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!ze.call(t, i) || !Vr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Ur(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Wr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Gr(e, t) {
		var n = Wr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Wr(n);
		}
	}
	function Kr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Kr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function qr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Ur(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Ur(e.document);
		}
		return t;
	}
	function Jr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Yr = Dn && "documentMode" in document && 11 >= document.documentMode, Xr = null, B = null, Zr = null, Qr = !1;
	function $r(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Qr || Xr == null || Xr !== Ur(r) || (r = Xr, "selectionStart" in r && Jr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Zr && Hr(Zr, r) || (Zr = r, r = Jf(B, "onSelect"), 0 < r.length && (t = new zn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Xr)));
	}
	function ei(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var ti = {
		animationend: ei("Animation", "AnimationEnd"),
		animationiteration: ei("Animation", "AnimationIteration"),
		animationstart: ei("Animation", "AnimationStart"),
		transitionrun: ei("Transition", "TransitionRun"),
		transitionstart: ei("Transition", "TransitionStart"),
		transitioncancel: ei("Transition", "TransitionCancel"),
		transitionend: ei("Transition", "TransitionEnd")
	}, ni = {}, ri = {};
	Dn && (ri = document.createElement("div").style, "AnimationEvent" in window || (delete ti.animationend.animation, delete ti.animationiteration.animation, delete ti.animationstart.animation), "TransitionEvent" in window || delete ti.transitionend.transition);
	function ii(e) {
		if (ni[e]) return ni[e];
		if (!ti[e]) return e;
		var t = ti[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in ri) return ni[e] = t[n];
		return e;
	}
	var ai = ii("animationend"), oi = ii("animationiteration"), si = ii("animationstart"), ci = ii("transitionrun"), li = ii("transitionstart"), ui = ii("transitioncancel"), di = ii("transitionend"), fi = /* @__PURE__ */ new Map(), pi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	pi.push("scrollEnd");
	function mi(e, t) {
		fi.set(e, t), Bt(t, [e]);
	}
	var hi = 0;
	function gi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = bd.identifierPrefix;
		var n = hi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function _i(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Od;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function vi(e, t) {
		return e = _i(e), t = _i(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var yi = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, bi = [], xi = 0, Si = 0;
	function Ci() {
		for (var e = xi, t = Si = xi = 0; t < e;) {
			var n = bi[t];
			bi[t++] = null;
			var r = bi[t];
			bi[t++] = null;
			var i = bi[t];
			bi[t++] = null;
			var a = bi[t];
			if (bi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Di(n, i, a);
		}
	}
	function wi(e, t, n, r) {
		bi[xi++] = e, bi[xi++] = t, bi[xi++] = n, bi[xi++] = r, Si |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Ti(e, t, n, r) {
		return wi(e, t, n, r), Oi(e);
	}
	function Ei(e, t) {
		return wi(e, null, null, t), Oi(e);
	}
	function Di(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - L(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Oi(e) {
		if (50 < kd) throw kd = 0, Ad = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var ki = {};
	function Ai(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function ji(e, t, n, r) {
		return new Ai(e, t, n, r);
	}
	function Mi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Ni(e, t) {
		var n = e.alternate;
		return n === null ? (n = ji(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Pi(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Fi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Mi(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, we.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case le: return e = ji(31, n, t, a), e.elementType = le, e.lanes = o, e;
			case D: return Ii(n.children, a, o, t);
			case ie:
				s = 8, a |= 24;
				break;
			case O: return e = ji(12, n, t, a | 2), e.elementType = O, e.lanes = o, e;
			case j: return e = ji(13, n, t, a), e.elementType = j, e.lanes = o, e;
			case oe: return e = ji(19, n, t, a), e.elementType = oe, e.lanes = o, e;
			case ue:
			case fe: return e = a | 32, e = ji(30, n, t, e), e.elementType = fe, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case k:
						s = 10;
						break a;
					case ae:
						s = 9;
						break a;
					case A:
						s = 11;
						break a;
					case se:
						s = 14;
						break a;
					case ce:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = ji(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Ii(e, t, n, r) {
		return e = ji(7, e, r, t), e.lanes = n, e;
	}
	function Li(e, t, n) {
		return e = ji(6, e, null, t), e.lanes = n, e;
	}
	function Ri(e) {
		var t = ji(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function zi(e, t, n) {
		return t = ji(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Bi = /* @__PURE__ */ new WeakMap();
	function Vi(e, t) {
		if (typeof e == "object" && e) {
			var n = Bi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Re(t)
			}, Bi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Re(t)
		};
	}
	var Hi = [], Ui = 0, Wi = null, Gi = 0, Ki = [], qi = 0, Ji = null, Yi = 1, Xi = "";
	function Zi(e, t) {
		Hi[Ui++] = Gi, Hi[Ui++] = Wi, Wi = e, Gi = t;
	}
	function Qi(e, t, n) {
		Ki[qi++] = Yi, Ki[qi++] = Xi, Ki[qi++] = Ji, Ji = e;
		var r = Yi;
		e = Xi;
		var i = 32 - L(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - L(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Yi = 1 << 32 - L(t) + i | n << i | r, Xi = a + e;
		} else Yi = 1 << a | n << i | r, Xi = e;
	}
	function $i(e) {
		e.return !== null && (Zi(e, 1), Qi(e, 1, 0));
	}
	function ea(e) {
		for (; e === Wi;) Wi = Hi[--Ui], Hi[Ui] = null, Gi = Hi[--Ui], Hi[Ui] = null;
		for (; e === Ji;) Ji = Ki[--qi], Ki[qi] = null, Xi = Ki[--qi], Ki[qi] = null, Yi = Ki[--qi], Ki[qi] = null;
	}
	function ta(e, t) {
		Ki[qi++] = Yi, Ki[qi++] = Xi, Ki[qi++] = Ji, Yi = t.id, Xi = t.overflow, Ji = e;
	}
	var na = null, ra = null, V = !1, ia = null, aa = !1, oa = Error(i(519));
	function sa(e) {
		throw pa(Vi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), oa;
	}
	function ca(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[St] = e, t[Ct] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < zf.length; n++) Q(zf[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), an(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), ln(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = vn), t = !0) : t = !1, t || sa(e, !0);
	}
	function la(e) {
		for (na = e.return; na;) switch (na.tag) {
			case 5:
			case 31:
			case 13:
				aa = !1;
				return;
			case 27:
			case 3:
				aa = !0;
				return;
			default: na = na.return;
		}
	}
	function ua(e) {
		if (e !== na) return !1;
		if (!V) return la(e), V = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && ra && sa(e), la(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ra = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			ra = dm(e);
		} else t === 27 ? (t = ra, Sp(e.type) ? (e = um, um = null, ra = e) : ra = t) : ra = na ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function da() {
		ra = na = null, V = !1;
	}
	function fa() {
		var e = ia;
		return e !== null && (fd === null ? fd = e : fd.push.apply(fd, e), ia = null), e;
	}
	function pa(e) {
		ia === null ? ia = [e] : ia.push(e);
	}
	var ma = Se(null), ha = null, ga = null;
	function _a(e, t, n) {
		P(ma, t._currentValue), t._currentValue = n;
	}
	function va(e) {
		e._currentValue = ma.current, Ce(ma);
	}
	function ya(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function ba(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), ya(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), ya(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), ya(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function xa(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Vr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === De.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && ba(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function H(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Vr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Sa(e) {
		ha = e, ga = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Ca(e) {
		return Ta(ha, e);
	}
	function wa(e, t) {
		return ha === null && Sa(e), Ta(e, t);
	}
	function Ta(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ga === null) {
			if (e === null) throw Error(i(308));
			ga = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ga = ga.next = t;
		return n;
	}
	var Ea = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Da = t.unstable_scheduleCallback, Oa = t.unstable_NormalPriority, ka = {
		$$typeof: k,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Aa() {
		return {
			controller: new Ea(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ja(e) {
		e.refCount--, e.refCount === 0 && Da(Oa, function() {
			e.controller.abort();
		});
	}
	function Ma(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Na = null;
	function Pa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Fa = null, Ia = 0, La = 0, Ra = null;
	function za(e, t) {
		if (Fa === null) {
			var n = Fa = [];
			Ia = 0, La = Pf(), Ra = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ia++, t.then(Ba, Ba), t;
	}
	function Ba() {
		if (--Ia === 0 && (Na = null, Fa !== null)) {
			Ra !== null && (Ra.status = "fulfilled");
			var e = Fa;
			Fa = null, La = 0, Ra = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Va(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ha = M.S;
	M.S = function(e, t) {
		if (hd = We(), typeof t == "object" && t && typeof t.then == "function" && za(e, t), Na !== null) for (var n = bf; n !== null;) Ma(n, Na), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = bf; r !== null;) Ma(r, n), r = r.next;
			if (La !== 0) {
				r = Na, r === null && (r = Na = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ha !== null && Ha(e, t);
	};
	var Ua = Se(null);
	function Wa() {
		var e = Ua.current;
		return e === null ? q.pooledCache : e;
	}
	function Ga(e, t) {
		t === null ? P(Ua, Ua.current) : P(Ua, t.pool);
	}
	function Ka() {
		var e = Wa();
		return e === null ? null : {
			parent: ka._currentValue,
			pool: e
		};
	}
	var qa = Error(i(460)), Ja = Error(i(474)), Ya = Error(i(542)), Xa = { then: function() {} };
	function Za(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Qa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(vn, vn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, no(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(vn, vn);
				else {
					if (e = q, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, no(e), e;
				}
				throw eo = t, qa;
		}
	}
	function $a(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (eo = e, qa) : e;
		}
	}
	var eo = null;
	function to() {
		if (eo === null) throw Error(i(459));
		var e = eo;
		return eo = null, e;
	}
	function no(e) {
		if (e === qa || e === Ya) throw Error(i(483));
	}
	var ro = null, io = 0;
	function ao(e) {
		var t = io;
		return io += 1, ro === null && (ro = []), Qa(ro, e, t);
	}
	function oo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function so(e, t) {
		throw t.$$typeof === te ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function co(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Ni(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Li(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === D ? (e = d(e, t, n.props.children, r, n.key), oo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === ce && $a(i) === t.type) ? (t = a(t, n.props), oo(t, n), t.return = e, t) : (t = Fi(n.type, n.key, n.props, null, e.mode, r), oo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = zi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Ii(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Li("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case ne: return n = Fi(t.type, t.key, t.props, null, e.mode, n), oo(n, t), n.return = e, n;
					case re: return t = zi(t, e.mode, n), t.return = e, t;
					case ce: return t = $a(t), f(e, t, n);
				}
				if (ve(t) || he(t)) return t = Ii(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, ao(t), n);
				if (t.$$typeof === k) return f(e, wa(e, t), n);
				so(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case ne: return n.key === i ? l(e, t, n, r) : null;
					case re: return n.key === i ? u(e, t, n, r) : null;
					case ce: return n = $a(n), p(e, t, n, r);
				}
				if (ve(n) || he(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, ao(n), r);
				if (n.$$typeof === k) return p(e, t, wa(e, n), r);
				so(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case ne: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case re: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case ce: return r = $a(r), m(e, t, n, r, i);
				}
				if (ve(r) || he(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, ao(r), i);
				if (r.$$typeof === k) return m(e, t, n, wa(t, r), i);
				so(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), V && Zi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return V && Zi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), V && Zi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), V && Zi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return V && Zi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), V && Zi(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === D && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case ne:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === D) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), oo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ce && $a(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), oo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === D ? (c = Ii(o.props.children, e.mode, c, o.key), oo(c, o), c.return = e, e = c) : (c = Fi(o.type, o.key, o.props, null, e.mode, c), oo(c, o), c.return = e, e = c);
						}
						return s(e);
					case re:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = zi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ce: return o = $a(o), _(e, r, o, c);
				}
				if (ve(o)) return h(e, r, o, c);
				if (he(o)) {
					if (l = he(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, ao(o), c);
				if (o.$$typeof === k) return _(e, r, wa(e, o), c);
				so(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Li(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				io = 0;
				var i = _(e, t, n, r);
				return ro = null, i;
			} catch (t) {
				if (t === qa || t === Ya) throw t;
				var a = ji(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var lo = co(!0), uo = co(!1), fo = !1;
	function po(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function mo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function ho(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function go(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, K & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Oi(e), Di(e, null, n), t;
		}
		return wi(e, r, t, n), Oi(e);
	}
	function _o(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ht(e, n);
		}
	}
	function vo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var yo = !1;
	function bo() {
		if (yo) {
			var e = Ra;
			if (e !== null) throw e;
		}
	}
	function xo(e, t, n, r) {
		yo = !1;
		var i = e.updateQueue;
		fo = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Y & f) === f : (r & f) === f) {
					f !== 0 && f === La && (yo = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = E({}, d, f);
								break a;
							case 2: fo = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), od |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function So(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Co(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) So(n[e], t);
	}
	var wo = Se(null), To = Se(0);
	function Eo(e, t) {
		e = id, P(To, e), P(wo, t), id = e | t.baseLanes;
	}
	function Do() {
		P(To, id), P(wo, wo.current);
	}
	function Oo() {
		id = To.current, Ce(wo), Ce(To);
	}
	var ko = Se(null), Ao = null;
	function jo(e) {
		var t = e.alternate;
		P(Io, Io.current & 1), P(ko, e), Ao === null && (t === null || wo.current !== null || t.memoizedState !== null) && (Ao = e);
	}
	function Mo(e) {
		P(Io, Io.current), P(ko, e), Ao === null && (Ao = e);
	}
	function No(e) {
		e.tag === 22 ? (P(Io, Io.current), P(ko, e), Ao === null && (Ao = e)) : Po();
	}
	function Po() {
		P(Io, Io.current), P(ko, ko.current);
	}
	function Fo(e) {
		Ce(ko), Ao === e && (Ao = null), Ce(Io);
	}
	var Io = Se(0);
	function Lo(e, t) {
		P(ko, ko.current), P(Io, t);
	}
	function Ro(e) {
		Ce(Io), Ce(ko), Ao === e && (Ao = null);
	}
	function zo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Bo = 0, U = null, W = null, Vo = null, Ho = !1, Uo = !1, Wo = !1, Go = 0, Ko = 0, qo = null, Jo = 0;
	function Yo() {
		throw Error(i(321));
	}
	function Xo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Vr(e[n], t[n])) return !1;
		return !0;
	}
	function Zo(e, t, n, r, i, a) {
		return Bo = a, U = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, M.H = e === null || e.memoizedState === null ? mc : hc, Wo = !1, a = n(r, i), Wo = !1, Uo && (a = $o(t, n, r, i)), Qo(e), a;
	}
	function Qo(e) {
		M.H = pc;
		var t = W !== null && W.next !== null;
		if (Bo = 0, Vo = W = U = null, Ho = !1, Ko = 0, qo = null, t) throw Error(i(300));
		e === null || Mc || (e = e.dependencies, e !== null && H(e) && (Mc = !0));
	}
	function $o(e, t, n, r) {
		U = e;
		var a = 0;
		do {
			if (Uo && (qo = null), Ko = 0, Uo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Vo = W = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			M.H = gc, o = t(n, r);
		} while (Uo);
		return o;
	}
	function es() {
		var e = M.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ss(t) : t, e = e.useState()[0], (W === null ? null : W.memoizedState) !== e && (U.flags |= 1024), t;
	}
	function ts() {
		var e = Go !== 0;
		return Go = 0, e;
	}
	function ns(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function rs(e) {
		if (Ho) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Ho = !1;
		}
		Bo = 0, Vo = W = U = null, Uo = !1, Ko = Go = 0, qo = null;
	}
	function is() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Vo === null ? U.memoizedState = Vo = e : Vo = Vo.next = e, Vo;
	}
	function as() {
		if (W === null) {
			var e = U.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = W.next;
		var t = Vo === null ? U.memoizedState : Vo.next;
		if (t !== null) Vo = t, W = e;
		else {
			if (e === null) throw U.alternate === null ? Error(i(467)) : Error(i(310));
			W = e, e = {
				memoizedState: W.memoizedState,
				baseState: W.baseState,
				baseQueue: W.baseQueue,
				queue: W.queue,
				next: null
			}, Vo === null ? U.memoizedState = Vo = e : Vo = Vo.next = e;
		}
		return Vo;
	}
	function os() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ss(e) {
		var t = Ko;
		return Ko += 1, qo === null && (qo = []), e = Qa(qo, e, t), t = U, (Vo === null ? t.memoizedState : Vo.next) === null && (t = t.alternate, M.H = t === null || t.memoizedState === null ? mc : hc), e;
	}
	function cs(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ss(e);
			if (e.$$typeof === pe) return;
			if (e.$$typeof === k) return Ca(e);
		}
		throw Error(i(438, String(e)));
	}
	function ls(e) {
		var t = null, n = U.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = U.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = os(), U.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = de;
		return t.index++, n;
	}
	function us(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ds(e) {
		return fs(as(), W, e);
	}
	function fs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Bo & f) === f : (Y & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === La && (d = !0);
					else if ((Bo & p) === p) {
						u = u.next, p === La && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, U.lanes |= p, od |= p;
					f = u.action, Wo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, U.lanes |= f, od |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Vr(o, e.memoizedState) && (Mc = !0, d && (n = Ra, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ps(e) {
		var t = as(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Vr(o, t.memoizedState) || (Mc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function ms(e, t, n) {
		var r = U, a = as(), o = V;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Vr((W || a).memoizedState, n);
		if (s && (a.memoizedState = n, Mc = !0), a = a.queue, zs(_s.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Vo !== null && !!(Vo.memoizedState.tag & 1), Ps(e ? 9 : 8, { destroy: void 0 }, gs.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, q === null) throw Error(i(349));
			o || Bo & 127 || hs(r, t, n);
		}
		return n;
	}
	function hs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = U.updateQueue, t === null ? (t = os(), U.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function gs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, vs(t) && ys(e);
	}
	function _s(e, t, n) {
		return n(function() {
			vs(t) && ys(e);
		});
	}
	function vs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Vr(e, n);
		} catch {
			return !0;
		}
	}
	function ys(e) {
		var t = Ei(e, 2);
		t !== null && Pd(t, e, 2);
	}
	function bs(e) {
		var t = is();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Wo) {
				$e(!0);
				try {
					n();
				} finally {
					$e(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: us,
			lastRenderedState: e
		}, t;
	}
	function xs(e, t, n, r) {
		return e.baseState = n, fs(e, W, typeof r == "function" ? r : us);
	}
	function Ss(e, t, n, r, a) {
		if (uc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			M.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Cs(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Cs(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = M.T, o = {};
			o.types = a === null ? null : a.types, M.T = o;
			try {
				var s = n(i, r), c = M.S;
				c !== null && c(o, s), ws(e, t, s);
			} catch (n) {
				Es(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), M.T = a;
			}
		} else try {
			a = n(i, r), ws(e, t, a);
		} catch (n) {
			Es(e, t, n);
		}
	}
	function ws(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Ts(e, t, n);
		}, function(n) {
			return Es(e, t, n);
		}) : Ts(e, t, n);
	}
	function Ts(e, t, n) {
		t.status = "fulfilled", t.value = n, Ds(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Cs(e, n)));
	}
	function Es(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ds(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ds(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Os(e, t) {
		return t;
	}
	function ks(e, t) {
		if (V) {
			var n = q.formState;
			if (n !== null) {
				a: {
					var r = U;
					if (V) {
						if (ra) {
							b: {
								for (var i = ra, a = aa; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = lm(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								ra = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						sa(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = is(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Os,
			lastRenderedState: t
		}, n.queue = r, n = sc.bind(null, U, r), r.dispatch = n, r = bs(!1), a = lc.bind(null, U, !1, r.queue), r = is(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Ss.bind(null, U, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function As(e) {
		return js(as(), W, e);
	}
	function js(e, t, n) {
		if (t = fs(e, t, Os)[0], e = ds(us)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ss(t);
		} catch (e) {
			throw e === qa ? Ya : e;
		}
		else r = t;
		t = as();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (U.flags |= 2048, Ps(9, { destroy: void 0 }, Ms.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Ms(e, t) {
		e.action = t;
	}
	function Ns(e) {
		var t = as(), n = W;
		if (n !== null) return js(t, n, e);
		as(), t = t.memoizedState, n = as();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Ps(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = U.updateQueue, t === null && (t = os(), U.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Fs() {
		return as().memoizedState;
	}
	function Is(e, t, n, r) {
		var i = is();
		U.flags |= e, i.memoizedState = Ps(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ls(e, t, n, r) {
		var i = as();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		W !== null && r !== null && Xo(r, W.memoizedState.deps) ? i.memoizedState = Ps(t, a, n, r) : (U.flags |= e, i.memoizedState = Ps(1 | t, a, n, r));
	}
	function Rs(e, t) {
		Is(8390656, 8, e, t);
	}
	function zs(e, t) {
		Ls(2048, 8, e, t);
	}
	function Bs(e) {
		U.flags |= 4;
		var t = U.updateQueue;
		if (t === null) t = os(), U.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Vs(e) {
		var t = as().memoizedState;
		return Bs({
			ref: t,
			nextImpl: e
		}), function() {
			if (K & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Hs(e, t) {
		return Ls(4, 2, e, t);
	}
	function Us(e, t) {
		return Ls(4, 4, e, t);
	}
	function Ws(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Gs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ls(4, 4, Ws.bind(null, t, e), n);
	}
	function Ks() {}
	function qs(e, t) {
		var n = as();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Xo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Js(e, t) {
		var n = as();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Xo(t, r[1])) return r[0];
		if (r = e(), Wo) {
			$e(!0);
			try {
				e();
			} finally {
				$e(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Ys(e, t, n) {
		return n === void 0 || Bo & 1073741824 && !(Y & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Md(), U.lanes |= e, od |= e, n);
	}
	function Xs(e, t, n, r) {
		return Vr(n, t) ? n : wo.current === null ? !(Bo & 106) || Bo & 1073741824 && !(Y & 261930) ? (Mc = !0, e.memoizedState = n) : (e = Md(), U.lanes |= e, od |= e, t) : (e = Ys(e, n, r), Vr(e, t) || (Mc = !0), e);
	}
	function Zs(e, t, n, r, i) {
		var a = N.p;
		N.p = a !== 0 && 8 > a ? a : 8;
		var o = M.T, s = {};
		s.types = o === null ? null : o.types, M.T = s, lc(e, !1, t, n);
		try {
			var c = i(), l = M.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? cc(e, t, Va(c, r), jd(e)) : cc(e, t, r, jd(e));
		} catch (n) {
			cc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, jd());
		} finally {
			N.p = a, o !== null && s.types !== null && (o.types = s.types), M.T = o;
		}
	}
	function Qs() {}
	function $s(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = ec(e).queue;
		Zs(e, a, t, ye, n === null ? Qs : function() {
			return tc(e), n(r);
		});
	}
	function ec(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ye,
			baseState: ye,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: us,
				lastRenderedState: ye
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: us,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function tc(e) {
		var t = ec(e);
		t.next === null && (t = e.alternate.memoizedState), cc(e, t.next.queue, {}, jd());
	}
	function nc() {
		return Ca(sh);
	}
	function rc() {
		return as().memoizedState;
	}
	function ic() {
		return as().memoizedState;
	}
	function ac(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = jd();
					e = ho(n);
					var r = go(t, e, n);
					r !== null && (Pd(r, t, n), _o(r, t, n)), t = { cache: Aa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function oc(e, t, n) {
		var r = jd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, uc(e) ? dc(t, n) : (n = Ti(e, t, n, r), n !== null && (Pd(n, e, r), fc(n, t, r)));
	}
	function sc(e, t, n) {
		cc(e, t, n, jd());
	}
	function cc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (uc(e)) dc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Vr(s, o)) return wi(e, t, i, 0), q === null && Ci(), !1;
			} catch {}
			if (n = Ti(e, t, i, r), n !== null) return Pd(n, e, r), fc(n, t, r), !0;
		}
		return !1;
	}
	function lc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Pf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, uc(e)) {
			if (t) throw Error(i(479));
		} else t = Ti(e, n, r, 2), t !== null && Pd(t, e, 2);
	}
	function uc(e) {
		var t = e.alternate;
		return e === U || t !== null && t === U;
	}
	function dc(e, t) {
		Uo = Ho = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function fc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ht(e, n);
		}
	}
	var pc = {
		readContext: Ca,
		use: cs,
		useCallback: Yo,
		useContext: Yo,
		useEffect: Yo,
		useImperativeHandle: Yo,
		useLayoutEffect: Yo,
		useInsertionEffect: Yo,
		useMemo: Yo,
		useReducer: Yo,
		useRef: Yo,
		useState: Yo,
		useDebugValue: Yo,
		useDeferredValue: Yo,
		useTransition: Yo,
		useSyncExternalStore: Yo,
		useId: Yo,
		useHostTransitionStatus: Yo,
		useFormState: Yo,
		useActionState: Yo,
		useOptimistic: Yo,
		useMemoCache: Yo,
		useCacheRefresh: Yo,
		useEffectEvent: Yo
	}, mc = {
		readContext: Ca,
		use: cs,
		useCallback: function(e, t) {
			return is().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Ca,
		useEffect: Rs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Is(4194308, 4, Ws.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Is(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Is(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = is();
			t = t === void 0 ? null : t;
			var r = e();
			if (Wo) {
				$e(!0);
				try {
					e();
				} finally {
					$e(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = is();
			if (n !== void 0) {
				var i = n(t);
				if (Wo) {
					$e(!0);
					try {
						n(t);
					} finally {
						$e(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = oc.bind(null, U, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = is();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = bs(e);
			var t = e.queue, n = sc.bind(null, U, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			return Ys(is(), e, t);
		},
		useTransition: function() {
			var e = bs(!1);
			return e = Zs.bind(null, U, e.queue, !0, !1), is().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = U, a = is();
			if (V) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), q === null) throw Error(i(349));
				Y & 127 || hs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Rs(_s.bind(null, r, o, e), [e]), r.flags |= 2048, Ps(9, { destroy: void 0 }, gs.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = is(), t = q.identifierPrefix;
			if (V) {
				var n = Xi, r = Yi;
				n = (r & ~(1 << 32 - L(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Go++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Jo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: nc,
		useFormState: ks,
		useActionState: ks,
		useOptimistic: function(e) {
			var t = is();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = lc.bind(null, U, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: ls,
		useCacheRefresh: function() {
			return is().memoizedState = ac.bind(null, U);
		},
		useEffectEvent: function(e) {
			var t = is(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (K & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, hc = {
		readContext: Ca,
		use: cs,
		useCallback: qs,
		useContext: Ca,
		useEffect: zs,
		useImperativeHandle: Gs,
		useInsertionEffect: Hs,
		useLayoutEffect: Us,
		useMemo: Js,
		useReducer: ds,
		useRef: Fs,
		useState: function() {
			return ds(us);
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			return Xs(as(), W.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ds(us)[0], t = as().memoizedState;
			return [typeof e == "boolean" ? e : ss(e), t];
		},
		useSyncExternalStore: ms,
		useId: rc,
		useHostTransitionStatus: nc,
		useFormState: As,
		useActionState: As,
		useOptimistic: function(e, t) {
			return xs(as(), W, e, t);
		},
		useMemoCache: ls,
		useCacheRefresh: ic,
		useEffectEvent: Vs
	}, gc = {
		readContext: Ca,
		use: cs,
		useCallback: qs,
		useContext: Ca,
		useEffect: zs,
		useImperativeHandle: Gs,
		useInsertionEffect: Hs,
		useLayoutEffect: Us,
		useMemo: Js,
		useReducer: ps,
		useRef: Fs,
		useState: function() {
			return ps(us);
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			var n = as();
			return W === null ? Ys(n, e, t) : Xs(n, W.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ps(us)[0], t = as().memoizedState;
			return [typeof e == "boolean" ? e : ss(e), t];
		},
		useSyncExternalStore: ms,
		useId: rc,
		useHostTransitionStatus: nc,
		useFormState: Ns,
		useActionState: Ns,
		useOptimistic: function(e, t) {
			var n = as();
			return W === null ? (n.baseState = e, [e, n.queue.dispatch]) : xs(n, W, e, t);
		},
		useMemoCache: ls,
		useCacheRefresh: ic,
		useEffectEvent: Vs
	};
	function _c(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : E({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var vc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = ho(r);
			i.payload = t, n != null && (i.callback = n), t = go(e, i, r), t !== null && (Pd(t, e, r), _o(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = ho(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = go(e, i, r), t !== null && (Pd(t, e, r), _o(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = jd(), r = ho(n);
			r.tag = 2, t != null && (r.callback = t), t = go(e, r, n), t !== null && (Pd(t, e, n), _o(t, e, n));
		}
	};
	function yc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Hr(n, r) || !Hr(i, a) : !0;
	}
	function bc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && vc.enqueueReplaceState(t, t.state, null);
	}
	function xc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = E({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Sc(e) {
		yi(e);
	}
	function Cc(e) {
		console.error(e);
	}
	function wc(e) {
		yi(e);
	}
	function Tc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ec(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Dc(e, t, n) {
		return n = ho(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Tc(e, t);
		}, n;
	}
	function Oc(e) {
		return e = ho(e), e.tag = 3, e;
	}
	function kc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Ec(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Ec(t, n, r), typeof i != "function" && (vd === null ? vd = /* @__PURE__ */ new Set([this]) : vd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ac(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && xa(t, n, a, !0), n = ko.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Ao === null ? Kd() : n.alternate === null && ad === 0 && (ad = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Xa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), mf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Xa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), mf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return mf(e, r, a), Kd(), !1;
		}
		if (V) return t = ko.current, t === null ? (r !== oa && (t = Error(i(423), { cause: r }), pa(Vi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Vi(r, n), a = Dc(e.stateNode, r, a), vo(e, a), ad !== 4 && (ad = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== oa && (e = Error(i(422), { cause: r }), pa(Vi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Vi(o, n), dd === null ? dd = [o] : dd.push(o), ad !== 4 && (ad = 2), t === null) return !0;
		r = Vi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Dc(n.stateNode, r, e), vo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (vd === null || !vd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Oc(a), kc(a, e, n, r), vo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var jc = Error(i(461)), Mc = !1;
	function Nc(e, t, n, r) {
		t.child = e === null ? uo(t, null, n, r) : lo(t, e.child, n, r);
	}
	function Pc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Sa(t), r = Zo(e, t, n, o, a, i), s = ts(), e !== null && !Mc ? (ns(e, t, i), cl(e, t, i)) : (V && s && $i(t), t.flags |= 1, Nc(e, t, r, i), t.child);
	}
	function Fc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Mi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Ic(e, t, a, r, i)) : (e = Fi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !ll(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Hr : n, n(o, r) && e.ref === t.ref) return cl(e, t, i);
		}
		return t.flags |= 1, e = Ni(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Ic(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Hr(a, r) && e.ref === t.ref) {
				if (Mc = !1, t.pendingProps = r = a, ll(e, i)) e.flags & 131072 && (Mc = !0);
				else return t.lanes = e.lanes, cl(e, t, i);
			}
		}
		return Wc(e, t, n, r, i);
	}
	function Lc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return zc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ga(t, a === null ? null : a.cachePool), a === null ? Do() : Eo(t, a), No(t);
			else return r = t.lanes = 536870912, zc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ga(t, null), Do(), Po()) : (Ga(t, a.cachePool), Eo(t, a), Po(), t.memoizedState = null);
		return Nc(e, t, i, n), t.child;
	}
	function Rc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function zc(e, t, n, r, i) {
		var a = Wa();
		return a = a === null ? null : {
			parent: ka._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ga(t, null), Do(), No(t), e !== null && xa(e, t, r, !0), t.childLanes = i, null;
	}
	function Bc(e, t) {
		return t = $c({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Vc(e, t, n) {
		return lo(t, e.child, null, n), e = Bc(t, t.pendingProps), e.flags |= 2, Fo(t), t.memoizedState = null, e;
	}
	function Hc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (V) {
				if (r.mode === "hidden") return e = Bc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Rc(null, e);
				if (Mo(t), (e = ra) ? (e = am(e, aa), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ji === null ? null : {
						id: Yi,
						overflow: Xi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ri(e), n.return = t, t.child = n, na = t, ra = null)) : e = null, e === null) throw sa(t);
				return t.lanes = 536870912, null;
			}
			return Bc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Mo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Vc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Mc || xa(e, t, n, !1), a = (n & e.childLanes) !== 0, Mc || a) {
				if (wo.current === null) {
					if (r = q, r !== null && (s = gt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Ei(e, s), Pd(r, e, s), jc;
					Kd();
				}
				t = Vc(e, t, n);
			} else e = o.treeContext, ra = lm(s.nextSibling), na = t, V = !0, ia = null, aa = !1, e !== null && ta(t, e), t = Bc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Ni(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Uc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Wc(e, t, n, r, i) {
		return Sa(t), n = Zo(e, t, n, r, void 0, i), r = ts(), e !== null && !Mc ? (ns(e, t, i), cl(e, t, i)) : (V && r && $i(t), t.flags |= 1, Nc(e, t, n, i), t.child);
	}
	function Gc(e, t, n, r, i, a) {
		return Sa(t), t.updateQueue = null, n = $o(t, r, n, i), Qo(e), r = ts(), e !== null && !Mc ? (ns(e, t, a), cl(e, t, a)) : (V && r && $i(t), t.flags |= 1, Nc(e, t, n, a), t.child);
	}
	function Kc(e, t, n, r, i) {
		if (Sa(t), t.stateNode === null) {
			var a = ki, o = n.contextType;
			typeof o == "object" && o && (a = Ca(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = vc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, po(t), o = n.contextType, a.context = typeof o == "object" && o ? Ca(o) : ki, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (_c(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && vc.enqueueReplaceState(a, a.state, null), xo(t, r, a, i), bo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = xc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = ki, typeof u == "object" && u && (o = Ca(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && bc(t, a, r, o), fo = !1;
			var f = t.memoizedState;
			a.state = f, xo(t, r, a, i), bo(), l = t.memoizedState, s || f !== l || fo ? (typeof d == "function" && (_c(t, n, d, r), l = t.memoizedState), (c = fo || yc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, mo(e, t), o = t.memoizedProps, u = xc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = ki, typeof l == "object" && l && (c = Ca(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && bc(t, a, r, c), fo = !1, f = t.memoizedState, a.state = f, xo(t, r, a, i), bo();
			var p = t.memoizedState;
			o !== d || f !== p || fo || e !== null && e.dependencies !== null && H(e.dependencies) ? (typeof s == "function" && (_c(t, n, s, r), p = t.memoizedState), (u = fo || yc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && H(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Uc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = lo(t, e.child, null, i), t.child = lo(t, null, n, i)) : Nc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = cl(e, t, i), e;
	}
	function qc(e, t, n, r) {
		return da(), t.flags |= 256, Nc(e, t, n, r), t.child;
	}
	var Jc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Yc(e) {
		return {
			baseLanes: e,
			cachePool: Ka()
		};
	}
	function Xc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ld), e;
	}
	function Zc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Io.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (V) {
				if (i ? jo(t) : Po(), (e = ra) ? (e = am(e, aa), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ji === null ? null : {
						id: Yi,
						overflow: Xi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ri(e), n.return = t, t.child = n, na = t, ra = null)) : e = null, e === null) throw sa(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Po(), i = t.mode, a = $c({
				mode: "hidden",
				children: a
			}, i), r = Ii(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Yc(n), r.childLanes = Xc(e, o, n), t.memoizedState = Jc, Rc(null, r)) : (jo(t), Qc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return tl(e, t, a, o, r, c, s, n);
		}
		return i ? (Po(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Ni(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Ii(i, a, n, null), i.flags |= 2) : i = Ni(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Rc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Yc(n) : (a = i.cachePool, a === null ? a = Ka() : (s = ka._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Xc(e, o, n), t.memoizedState = Jc, Rc(e.child, r)) : (jo(t), n = e.child, e = n.sibling, n = Ni(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Qc(e, t) {
		return t = $c({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function $c(e, t) {
		return e = ji(22, e, null, t), e.lanes = 0, e;
	}
	function el(e, t, n) {
		return lo(t, e.child, null, n), e = Qc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function tl(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (jo(t), t.flags &= -257, el(e, t, c)) : t.memoizedState === null ? (Po(), o = a.fallback, s = t.mode, a = $c({
			mode: "visible",
			children: a.children
		}, s), o = Ii(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, lo(t, e.child, null, c), a = t.child, a.memoizedState = Yc(c), a.childLanes = Xc(e, r, c), t.memoizedState = Jc, Rc(null, a)) : (Po(), t.child = e.child, t.flags |= 128, null);
		if (jo(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, pa({
				value: a,
				source: null,
				stack: null
			})), el(e, t, c);
		}
		if (Mc || xa(e, t, c, !1), r = (c & e.childLanes) !== 0, Mc || r) {
			if (wo.current !== null) return el(e, t, c);
			if (r = q, r !== null && (a = gt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Ei(e, a), Pd(r, e, a), jc;
			return om(o) || Kd(), el(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, ra = lm(o.nextSibling), na = t, V = !0, ia = null, aa = !1, e !== null && ta(t, e), t = Qc(t, a.children), t.flags |= 134221824, t);
	}
	function nl(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), ya(e.return, t, n);
	}
	function rl(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && zo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function il(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function al(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ol(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Io.current;
		if (t.flags & 128) return Lo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Lo(t, o), i === "backwards" && e !== null ? (al(e), Nc(e, t, r, n), al(e)) : Nc(e, t, r, n), r = V ? Gi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && nl(e, n, t);
			else if (e.tag === 19) nl(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = rl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, al(t)), il(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && zo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				il(t, !0, n, null, a, r);
				break;
			case "together":
				il(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = rl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), il(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function sl(e, t, n) {
		var r = t.pendingProps;
		return _a(t, t.type, r.value), Nc(e, t, r.children, n), t.child;
	}
	function cl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), od |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (xa(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Ni(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Ni(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function ll(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && H(e)));
	}
	function ul(e, t, n) {
		switch (t.tag) {
			case 3:
				Oe(t, t.stateNode.containerInfo), _a(t, ka, e.memoizedState.cache), da();
				break;
			case 27:
			case 5:
				Ae(t);
				break;
			case 4:
				Oe(t, t.stateNode.containerInfo);
				break;
			case 10:
				_a(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Mo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return jo(t), t.flags |= 128, null;
					r = xa(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Zc(e, t, n) : (jo(t), e = cl(e, t, n), e === null ? null : e.sibling);
				}
				jo(t);
				break;
			case 19:
				if (t.flags & 128) return ol(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (xa(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ol(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Lo(t, Io.current), r) break;
				return null;
			case 22: return t.lanes = 0, Lc(e, t, n, t.pendingProps);
			case 24: _a(t, ka, e.memoizedState.cache);
		}
		return cl(e, t, n);
	}
	function dl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Mc = !0;
			else {
				if (!ll(e, n) && !(t.flags & 128)) return Mc = !1, ul(e, t, n);
				Mc = !!(e.flags & 131072);
			}
		} else Mc = !1, V && t.flags & 1048576 && Qi(t, Gi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = $a(t.elementType), t.type = e, typeof e == "function") Mi(e) ? (r = xc(e, r), t.tag = 1, t = Kc(null, t, e, r, n)) : (t.tag = 0, t = Wc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === A) {
								t.tag = 11, t = Pc(null, t, e, r, n);
								break a;
							}
							if (a === se) {
								t.tag = 14, t = Fc(null, t, e, r, n);
								break a;
							}
							if (a === k) {
								t.tag = 10, t.type = e, t = sl(null, t, n);
								break a;
							}
						}
						throw t = _e(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Wc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = xc(r, t.pendingProps), Kc(e, t, r, a, n);
			case 3:
				a: {
					if (Oe(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, mo(e, t), xo(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, _a(t, ka, r), r !== o.cache && ba(t, [ka], n, !0), bo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = qc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Vi(Error(i(424)), t), pa(a), t = qc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (ra = lm(e.firstChild), na = t, V = !0, ia = null, aa = !0, n = uo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (da(), r === a) {
							t = cl(e, t, n);
							break a;
						}
						Nc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Uc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : V || (t.stateNode = fp(t.type, t.pendingProps, Ee.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Ae(t), e === null && V && (r = t.stateNode = hm(t.type, t.pendingProps, Ee.current), na = t, aa = !0, a = ra, Sp(t.type) ? (um = a, ra = lm(r.firstChild)) : ra = a), Nc(e, t, t.pendingProps.children, n), Uc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && V && ((a = r = ra) && (r = rm(r, t.type, t.pendingProps, aa), r === null ? a = !1 : (t.stateNode = r, na = t, ra = lm(r.firstChild), aa = !1, a = !0)), a || sa(t)), Ae(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Zo(e, t, es, null, null, n), sh._currentValue = a), Uc(e, t), Nc(e, t, r, n), t.child;
			case 6: return e === null && V && ((e = n = ra) && (n = im(n, t.pendingProps, aa), n === null ? e = !1 : (t.stateNode = n, na = t, ra = null, e = !0)), e || sa(t)), null;
			case 13: return Zc(e, t, n);
			case 4: return Oe(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = lo(t, null, r, n) : Nc(e, t, r, n), t.child;
			case 11: return Pc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Uc(e, t), Nc(e, t, r, n), t.child;
			case 8: return Nc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Nc(e, t, t.pendingProps.children, n), t.child;
			case 10: return sl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Sa(t), a = Ca(a), r = r(a), t.flags |= 1, Nc(e, t, r, n), t.child;
			case 14: return Fc(e, t, t.type, t.pendingProps, n);
			case 15: return Ic(e, t, t.type, t.pendingProps, n);
			case 19: return ol(e, t, n);
			case 31: return Hc(e, t, n);
			case 22: return Lc(e, t, n, t.pendingProps);
			case 24: return Sa(t), r = Ca(ka), e === null ? (a = Wa(), a === null && (a = q, o = Aa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, po(t), _a(t, ka, a)) : ((e.lanes & n) !== 0 && (mo(e, t), xo(t, null, null, n), bo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, _a(t, ka, r), r !== a.cache && ba(t, [ka], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), _a(t, ka, r))), Nc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : V && $i(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Uc(e, t), Nc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function fl(e) {
		e.flags |= 4;
	}
	function pl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Ud()) e.flags |= 8192;
				else throw eo = Xa, Ja;
			}
		} else e.flags &= -16777217;
	}
	function ml(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Ud()) e.flags |= 8192;
			else throw eo = Xa, Ja;
		}
	}
	function hl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : ut(), e.lanes |= t, ud |= t);
	}
	function gl(e, t) {
		if (!V) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function _l(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function vl(e, t, n) {
		var r = t.pendingProps;
		switch (ea(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return _l(t), null;
			case 1: return _l(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), va(ka), ke(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ua(t) ? fl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, fa())), _l(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (fl(t), o === null ? (_l(t), pl(t, a, null, r, n)) : (_l(t), ml(t, o))) : o ? o === e.memoizedState ? (_l(t), t.flags &= -16777217) : (fl(t), _l(t), ml(t, o)) : (e = e.memoizedProps, e !== r && fl(t), _l(t), pl(t, a, e, r, n)), null;
			case 27:
				if (je(t), n = Ee.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return _l(t), t.subtreeFlags &= -33554433, null;
					}
					e = we.current, ua(t) ? ca(t, e) : (e = hm(a, r, n), t.stateNode = e, fl(t));
				}
				return _l(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (je(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return _l(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = we.current, ua(t)) ca(t, o);
					else {
						var s = lp(Ee.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[St] = t, o[Ct] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (np(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && fl(t);
					}
				}
				return _l(t), t.subtreeFlags &= -33554433, pl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Ee.current, ua(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = na, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[St] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || sa(t, !0);
					} else e = lp(e).createTextNode(r), e[St] = t, t.stateNode = e;
				}
				return _l(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ua(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[St] = t;
						} else da(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						_l(t), e = !1;
					} else n = fa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Fo(t), t) : (Fo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return _l(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ua(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[St] = t;
						} else da(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						_l(t), a = !1;
					} else a = fa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Fo(t), t) : (Fo(t), null);
				}
				return Fo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), hl(t, t.updateQueue), _l(t), null);
			case 4: return ke(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, _l(t), null;
			case 10: return va(t.type), _l(t), null;
			case 19:
				if (Ro(t), r = t.memoizedState, r === null) return _l(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) gl(r, !1);
					else {
						if (ad !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = zo(e), o !== null) {
								for (t.flags |= 128, gl(r, !1), e = o.updateQueue, t.updateQueue = e, hl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Pi(n, e), n = n.sibling;
								return Lo(t, Io.current & 1 | 2), V && Zi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && We() > gd && (t.flags |= 128, a = !0, gl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = zo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, hl(t, e), gl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !V) return _l(t), null;
						} else 2 * We() - r.renderingStartTime > gd && n !== 536870912 && (t.flags |= 128, a = !0, gl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = We(), e.sibling = null, o = Io.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || V ? Lo(t, o) : (n = o, P(ko, t), P(Io, n), Ao === null && (Ao = t)), V && Zi(t, r.treeForkCount), e;
				}
				return _l(t), null;
			case 22:
			case 23: return Fo(t), Oo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (_l(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : _l(t), n = t.updateQueue, n !== null && hl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && Ce(Ua), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), va(ka), _l(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, _l(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function yl(e, t) {
		switch (ea(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return va(ka), ke(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return je(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Fo(t), t.alternate === null) throw Error(i(340));
					da();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Fo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					da();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Ro(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return ke(), null;
			case 10: return va(t.type), null;
			case 22:
			case 23: return Fo(t), Oo(), e !== null && Ce(Ua), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return va(ka), null;
			case 25: return null;
			default: return null;
		}
	}
	function bl(e, t) {
		switch (ea(t), t.tag) {
			case 3:
				va(ka), ke();
				break;
			case 26:
			case 27:
			case 5:
				je(t);
				break;
			case 4:
				ke();
				break;
			case 31:
				t.memoizedState !== null && Fo(t);
				break;
			case 13:
				Fo(t);
				break;
			case 19:
				Ro(t);
				break;
			case 10:
				va(t.type);
				break;
			case 22:
			case 23:
				Fo(t), Oo(), e !== null && Ce(Ua);
				break;
			case 24: va(ka);
		}
	}
	function xl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Sl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Z(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Cl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Co(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function wl(e, t, n) {
		n.props = xc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Tl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = gi(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							h(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Z(e, t, n);
		}
	}
	function El(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Z(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Z(e, t, n);
			}
			else n.current = null;
		}
	}
	function Dl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function Ol(e) {
		for (var t = e.return; t !== null && (jl(t) && em(e.stateNode, t.stateNode), !Al(t));) t = t.return;
	}
	function kl(e) {
		for (var t = e.return; t !== null && (jl(t) && tm(e.stateNode, t.stateNode), !Al(t));) t = t.return;
	}
	function Al(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function jl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Ml(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Nl(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[Ct] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Pl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Fl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Pl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Il(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = vn)), Dl(e, r), z = !0;
		else if (i !== 4 && (i === 27 && (Dl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Il(e, t, n, r), e = e.sibling; e !== null;) Il(e, t, n, r), e = e.sibling;
	}
	function Ll(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Dl(e, r), z = !0;
		else if (i !== 4 && (i === 27 && (Dl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Ll(e, t, n, r), e = e.sibling; e !== null;) Ll(e, t, n, r), e = e.sibling;
	}
	function Rl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[St] = e, t[Ct] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var zl = !1, Bl = null;
	function Vl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (zl = !0);
	}
	var Hl = null;
	function Ul() {
		var e = Hl;
		return Hl = null, e;
	}
	var Wl = 0;
	function Gl(e, t, n, r, i) {
		return Wl = 0, Kl(e.child, t, n, r, i);
	}
	function Kl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				zl = !0, Tp(o, Wl === 0 ? t : t + "_" + Wl, n), Wl++;
			} else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && i || Kl(e.child, t, n, r, i) && (a = !0));
			e = e.sibling;
		}
		return a;
	}
	function ql(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || ql(e.child, t)), e = e.sibling;
	}
	function Jl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Jl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = vi(t.default, t.share), t !== "none" && (Gl(e, n, t, null, !1) || ql(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Yl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = gi(r, n), a = vi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Jl(e) : Gl(e, i, a, null, !1) ? (Jl(e), n.paired || t || Nd(e, r.onEnter)) : ql(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Yl(e, t), e = e.sibling;
		else Jl(e);
	}
	function Xl(e) {
		if (Bl !== null && Bl.size !== 0) {
			var t = Bl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = vi(n.default, n.share);
								if (a !== "none" && (Gl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Nd(e, n.onShare)) : ql(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Xl(e);
				}
				e = e.sibling;
			}
		}
	}
	function Zl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = gi(t, e.stateNode), r = Bl === null ? void 0 : Bl.get(n), i = vi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Gl(e, n, i, null, !1) ? r === void 0 ? Nd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Bl.delete(n), Nd(e, t.onShare)) : ql(e.child, !1)), Bl !== null && Xl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Zl(e), e = e.sibling;
		else Bl !== null && Xl(e);
	}
	function Ql(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = gi(t, e.stateNode);
				t = vi(t.default, t.update), e.flags &= -5, t !== "none" && Gl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Ql(e);
			e = e.sibling;
		}
	}
	function $l(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, ql(e.child, !1));
				}
				$l(e);
			}
			e = e.sibling;
		}
	}
	function eu(e) {
		if (e.tag === 30) e.stateNode.paired = null, ql(e.child, !1), $l(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) eu(e), e = e.sibling;
		else $l(e);
	}
	function tu(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? ql(e.child, !1) : e.subtreeFlags & 33554432 && tu(e), e = e.sibling;
	}
	function nu(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Wl < a.length) {
					var l = a[Wl], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, Wl === 0 ? n : n + "_" + Wl, i), s && e.flags & 4 || (Hl === null && (Hl = []), Hl.push(c, Wl === 0 ? r : r + "_" + Wl, t.memoizedProps)), Wl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : nu(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function ru(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = gi(n, r), a = vi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Wl = 0, i = nu(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Nd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && ru(e, t);
			e = e.sibling;
		}
	}
	var iu = !1, G = !1, au = !1, ou = !1, su = typeof WeakSet == "function" ? WeakSet : Set, cu = null, lu = !1, uu = !1, du = !1, fu = !1;
	function pu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = qr(e), Jr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, cu = t, t = n ? 9270 : 1024; cu !== null;) {
			if (e = cu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Zl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Vl(e), mu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Zl(r), mu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Vl(e), mu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, cu = r) : (n && Ql(e), mu(n));
			}
		}
		Bl = null;
	}
	function mu(e) {
		for (; cu !== null;) {
			var t = cu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = xc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							Z(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = gi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = vi(a.default, a.update), a !== "none" && Gl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, cu = r;
				break;
			}
			cu = t.return;
		}
	}
	function hu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Fu(e, n), r & 4 && xl(5, n);
				break;
			case 1:
				if (Fu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = xc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && Cl(n), r & 512 && Tl(n, n.return);
				break;
			case 3:
				if (Fu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Co(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Rl(n);
			case 26:
			case 5:
				Fu(e, n), t === null && r & 4 && Ml(n), r & 512 && Tl(n, n.return);
				break;
			case 12:
				Fu(e, n);
				break;
			case 31:
				Fu(e, n), r & 4 && wu(e, n);
				break;
			case 13:
				Fu(e, n), r & 4 && Tu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = _f.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || iu, !r) {
					var a = t !== null && t.memoizedState !== null || G;
					t = iu, i = G, iu = r, (G = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Lu(e, n, r)) : Fu(e, n), iu = t, G = i;
				}
				break;
			case 30:
				Fu(e, n), r & 512 && Tl(n, n.return);
				break;
			case 7: r & 512 && Tl(n, n.return);
			default: Fu(e, n);
		}
	}
	function gu(e, t) {
		for (e = e.child; e !== null;) _u(e, t), e = e.sibling;
	}
	function _u(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					Z(e, e.return, t);
				}
				vu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, z = !0;
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && gu(e, t);
				break;
			default: gu(e, t);
		}
	}
	function vu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						_u(n, r);
						break a;
					case 22:
						n.memoizedState === null && vu(n, r);
						break a;
					default: vu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function yu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, yu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && jt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var bu = null, xu = !1;
	function Su(e, t, n) {
		for (n = n.child; n !== null;) Cu(e, t, n), n = n.sibling;
	}
	function Cu(e, t, n) {
		if (I && typeof I.onCommitFiberUnmount == "function") try {
			I.onCommitFiberUnmount(F, n);
		} catch {}
		switch (n.tag) {
			case 26:
				G || El(n, t), Su(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !G && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				G || El(n, t), kl(n);
				var r = bu, i = xu;
				Sp(n.type) && (bu = n.stateNode, xu = !1), Su(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), bu = r, xu = i;
				break;
			case 5: G || El(n, t), kl(n);
			case 6:
				if (n.tag === 6 && kl(n), r = bu, i = xu, bu = null, Su(e, t, n), bu = r, xu = i, bu !== null) {
					if (xu) try {
						(bu.nodeType === 9 ? bu.body : bu.nodeName === "HTML" ? bu.ownerDocument.body : bu).removeChild(n.stateNode), z = !0;
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						bu.removeChild(n.stateNode), z = !0;
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				bu !== null && (xu ? (e = bu, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(bu, n.stateNode));
				break;
			case 4:
				r = bu, i = xu, bu = n.stateNode.containerInfo, xu = !0, Su(e, t, n), bu = r, xu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Sl(2, n, t), G || Sl(4, n, t), Su(e, t, n);
				break;
			case 1:
				G || (El(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && wl(n, t, r)), Su(e, t, n);
				break;
			case 21:
				Su(e, t, n);
				break;
			case 22:
				G = (r = G) || n.memoizedState !== null, Su(e, t, n), G = r;
				break;
			case 30:
				El(n, t), Su(e, t, n);
				break;
			case 7:
				G || El(n, t), Su(e, t, n);
				break;
			default: Su(e, t, n);
		}
	}
	function wu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function Tu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Eu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new su()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new su()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Du(e, t) {
		var n = Eu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = vf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Ou(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							bu = l.stateNode, xu = !1;
							break a;
						}
						break;
					case 5:
						bu = l.stateNode, xu = !1;
						break a;
					case 3:
					case 4:
						bu = l.stateNode.containerInfo, xu = !0;
						break a;
				}
				l = l.return;
			}
			if (bu === null) throw Error(i(160));
			Cu(s, c, o), bu = null, xu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Au(t, e, n), t = t.sibling;
	}
	var ku = null;
	function Au(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Ou(t, e, n), ju(e), a & 4 && (Sl(3, e, e.return), xl(3, e), Sl(5, e, e.return));
				break;
			case 1:
				Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), a & 64 && iu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = ku, Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (iu) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[kt] || r[St] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), np(r, t, n), r[St] = e, It(r), t = r;
												break a;
											case "link":
												if (o = Gm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Gm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[St] = e, It(r), t = r;
									}
									e.stateNode = t;
								}
							} else iu || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Nl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || G || t.parentNode.removeChild(t)) : a.count--, n === null ? iu || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), r !== null && a & 4 && Nl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = au, au = !1, Ou(t, e, n), au = o, ju(e), a & 512 && (G || r === null || El(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						un(t, ""), z = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Nl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (ou = !0);
				break;
			case 6:
				if (Ou(t, e, n), ju(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, z = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (z = !1, Wm = null, o = ku, ku = bm(t.containerInfo), Ou(t, e, n), ku = o, ju(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				ou && (ou = !1, Mu(e)), z = !1;
				break;
			case 4:
				a = au, au = iu, r = Kt(), o = ku, ku = bm(e.stateNode.containerInfo), Ou(t, e, n), ju(e), ku = o, z && uu && (du = !0), z = r, au = a;
				break;
			case 12:
				Ou(t, e, n), ju(e);
				break;
			case 31:
				Ou(t, e, n), ju(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 13:
				Ou(t, e, n), ju(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (md = We()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = iu, l = G, u = au;
				iu = c || o, au = u || o, G = l || s, Ou(t, e, n), G = l, au = u, iu = c, ju(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || iu || G || (t = s || G, n = iu, r = G, iu = o || iu, G = t, Iu(e, 2), iu = n, G = r), !o && au || gu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Du(e, n))));
				break;
			case 19:
				Ou(t, e, n), ju(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 30:
				a & 512 && (G || r === null || El(r, r.return)), a = Kt(), o = uu, s = (n & 335544064) === n, c = e.memoizedProps, uu = s && vi(c.default, c.update) !== "none", Ou(t, e, n), ju(e), s && r !== null && z && (e.flags |= 4), uu = o, z = a;
				break;
			case 21: break;
			case 7: a & 512 && (G || r === null || El(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Ou(t, e, n), ju(e);
		}
	}
	function ju(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Pl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (jl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Al(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Ll(e, Fl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (un(l, ""), n.flags &= -33), Ll(e, Fl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Il(e, Fl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Z(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Mu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Mu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Nu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Pu(t, e), t = t.sibling;
		else ru(t, !1);
	}
	function Pu(e, t) {
		var n = e.alternate;
		if (n === null) Yl(e, !1);
		else switch (e.tag) {
			case 3:
				if (fu = lu = !1, Ul(), Nu(t, e), !lu && !du) {
					if (e = Hl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), fu = !0;
				}
				Hl = null;
				break;
			case 5:
				Nu(t, e);
				break;
			case 4:
				r = lu, lu = !1, Nu(t, e), lu && (du = !0), lu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Nu(t, e) : Yl(e, !1));
				break;
			case 30:
				r = lu, i = Ul(), lu = !1, Nu(t, e), lu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = gi(a, o), o = gi(n.memoizedProps, o);
				var s = vi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Wl = 0, t = nu(e, n, t, o, s, a, !0), Wl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Nd(e, e.memoizedProps.onUpdate), Hl = i) : i !== null && (i.push.apply(i, Hl), Hl = i), lu = e.flags & 32 ? !0 : r;
				break;
			default: Nu(t, e);
		}
	}
	function Fu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) hu(e, t.alternate, t), t = t.sibling;
	}
	function Iu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Sl(4, n, n.return), Iu(n, r);
					break;
				case 1:
					El(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && wl(n, n.return, i), Iu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					El(n, n.return), n.tag !== 5 && n.tag !== 27 || kl(n), Iu(n, r);
					break;
				case 6:
					kl(n);
					break;
				case 26:
					El(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || G || i.parentNode.removeChild(i), Iu(n, r);
					break;
				case 22:
					n.memoizedState === null && Iu(n, r);
					break;
				case 30:
					El(n, n.return), Iu(n, r);
					break;
				case 7: El(n, n.return);
				default: Iu(n, r);
			}
			e = e.sibling;
		}
	}
	function Lu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Lu(i, a, n), xl(4, a);
					break;
				case 1:
					if (Lu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Z(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) So(l[i], c);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					s && o & 64 && Cl(a), Tl(a, a.return);
					break;
				case 27: n & 2 && Rl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Ol(a), Lu(i, a, n), s && r === null && o & 4 && Ml(a), Tl(a, a.return);
					break;
				case 6:
					Ol(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || iu || Km(bm(c.ownerDocument), a.type, c), Lu(i, a, n), s && r === null && o & 4 && Ml(a), Tl(a, a.return);
					break;
				case 12:
					Lu(i, a, n);
					break;
				case 31:
					Lu(i, a, n), s && o & 4 && wu(i, a);
					break;
				case 13:
					Lu(i, a, n), s && o & 4 && Tu(i, a);
					break;
				case 22:
					a.memoizedState === null && Lu(i, a, n), Tl(a, a.return);
					break;
				case 30:
					Lu(i, a, n), Tl(a, a.return);
					break;
				case 7: Tl(a, a.return);
				default: Lu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Ru(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ja(n));
	}
	function zu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ja(e));
	}
	function Bu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Vu(e, t, n, r), t = t.sibling;
		else i && tu(t);
	}
	function Vu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && eu(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Bu(e, t, n, r), a & 2048 && xl(9, t);
				break;
			case 1:
				Bu(e, t, n, r);
				break;
			case 3:
				Bu(e, t, n, r), i && fu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && ja(a)));
				break;
			case 12:
				if (a & 2048) {
					Bu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else Bu(e, t, n, r);
				break;
			case 31:
				Bu(e, t, n, r);
				break;
			case 13:
				Bu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && eu(t), o._visibility & 2 ? Bu(e, t, n, r) : (o._visibility |= 2, Hu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && eu(s), o._visibility & 2 ? Bu(e, t, n, r) : Uu(e, t)), a & 2048 && Ru(s, t);
				break;
			case 24:
				Bu(e, t, n, r), a & 2048 && zu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (ql(a.child, !0), ql(t.child, !0))), Bu(e, t, n, r);
				break;
			default: Bu(e, t, n, r);
		}
	}
	function Hu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Hu(a, o, s, c, i), xl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Hu(a, o, s, c, i)) : u._visibility & 2 ? Hu(a, o, s, c, i) : Uu(a, o), i && l & 2048 && Ru(o.alternate, o);
					break;
				case 24:
					Hu(a, o, s, c, i), i && l & 2048 && zu(o.alternate, o);
					break;
				default: Hu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Uu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Uu(n, r), i & 2048 && Ru(r.alternate, r);
					break;
				case 24:
					Uu(n, r), i & 2048 && zu(r.alternate, r);
					break;
				default: Uu(n, r);
			}
			t = t.sibling;
		}
	}
	var Wu = 8192;
	function Gu(e, t, n) {
		if (e.subtreeFlags & Wu) for (e = e.child; e !== null;) Ku(e, t, n), e = e.sibling;
	}
	function Ku(e, t, n) {
		switch (e.tag) {
			case 26:
				Gu(e, t, n), e.flags & Wu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, ku, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Gu(e, t, n), e.flags & Wu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = ku;
				ku = bm(e.stateNode.containerInfo), Gu(e, t, n), ku = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Wu, Wu = 16777216, Gu(e, t, n), Wu = r) : Gu(e, t, n));
				break;
			case 30:
				if ((e.flags & Wu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Bl === null && (Bl = /* @__PURE__ */ new Map()), Bl.set(r, i);
				}
				Gu(e, t, n);
				break;
			default: Gu(e, t, n);
		}
	}
	function qu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Ju(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cu = r, Zu(r, e);
			}
			qu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Yu(e), e = e.sibling;
	}
	function Yu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Ju(e), e.flags & 2048 && Sl(9, e, e.return);
				break;
			case 3:
				Ju(e);
				break;
			case 12:
				Ju(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Xu(e)) : Ju(e);
				break;
			default: Ju(e);
		}
	}
	function Xu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cu = r, Zu(r, e);
			}
			qu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Sl(8, t, t.return), Xu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Xu(t));
					break;
				default: Xu(t);
			}
			e = e.sibling;
		}
	}
	function Zu(e, t) {
		for (; cu !== null;) {
			var n = cu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Sl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ja(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, cu = r;
			else a: for (n = e; cu !== null;) {
				r = cu;
				var i = r.sibling, a = r.return;
				if (yu(r), r === n) {
					cu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, cu = i;
					break a;
				}
				cu = a;
			}
		}
	}
	var Qu = {
		getCacheForType: function(e) {
			var t = Ca(ka), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Ca(ka).controller.signal;
		}
	}, $u = typeof WeakMap == "function" ? WeakMap : Map, K = 0, q = null, J = null, Y = 0, X = 0, ed = null, td = !1, nd = !1, rd = !1, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = null, fd = null, pd = !1, md = 0, hd = 0, gd = Infinity, _d = null, vd = null, yd = 0, bd = null, xd = null, Sd = 0, Cd = 0, wd = null, Td = null, Ed = null, Dd = null, Od = null, kd = 0, Ad = null;
	function jd() {
		return K & 2 && Y !== 0 ? Y & -Y : M.T === null ? yt() : Pf();
	}
	function Md() {
		if (ld === 0) {
			if (!(Y & 536870912) || V) {
				var e = rt;
				rt <<= 1, !(rt & 3932160) && (rt = 262144), ld = e;
			} else ld = 536870912;
		}
		return e = ko.current, e !== null && (e.flags |= 32), ld;
	}
	function Nd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(gi(e.memoizedProps, n))), Dd === null && (Dd = []), Dd.push(t.bind(null, r));
		}
	}
	function Pd(e, t, n) {
		(e === q && (X === 2 || X === 9) || e.cancelPendingCommit !== null) && (Vd(e, 0), Rd(e, Y, ld, !1)), ft(e, n), (!(K & 2) || e !== q) && (e === q && (!(K & 2) && (sd |= n), ad === 4 && Rd(e, Y, ld, !1)), Ef(e));
	}
	function Fd(e, t, n) {
		if (K & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || st(e, t), a = r ? Yd(e, t) : qd(e, t, !0), o = r;
		do {
			if (a === 0) {
				nd && !r && Rd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Ld(n)) {
				a = qd(e, t, !1), o = !1;
				continue;
			}
			if (a === 2) {
				if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
				else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
				if (s !== 0) {
					t = s;
					a: {
						var c = e;
						a = dd;
						var l = c.current.memoizedState.isDehydrated;
						if (l && (Vd(c, s).flags |= 256), s = qd(c, s, !1), s !== 2 && s !== 6) {
							if (rd && !l) {
								c.errorRecoveryDisabledLanes |= o, sd |= o, a = 4;
								break a;
							}
							o = fd, fd = a, o !== null && (fd === null ? fd = o : fd.push.apply(fd, o));
						}
						a = s;
					}
					if (o = !1, a !== 2) continue;
				}
			}
			if (a === 1) {
				Vd(e, 0), Rd(e, t, 0, !0);
				break;
			}
			a: {
				switch (r = e, o = a, o) {
					case 0:
					case 1: throw Error(i(345));
					case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
					case 6:
						Rd(r, t, ld, !td);
						break a;
					case 2:
						fd = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(i(329));
				}
				if ((t & 62914560) === t && (a = md + 300 - We(), 10 < a)) {
					if (Rd(r, t, ld, !td), ot(r, 0, !0) !== 0) break a;
					Sd = t, r.timeoutHandle = gp(Id.bind(null, r, n, fd, _d, pd, t, ld, sd, ud, td, o, "Throttled", -0, 0), a);
					break a;
				}
				Id(r, n, fd, _d, pd, t, ld, sd, ud, td, o, null, -0, 0);
			}
			break;
		} while (1);
		Ef(e);
	}
	function Id(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		if (d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: vn
		}, Bl = null, Ku(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? md - We() : (a & 4194048) === a ? hd - We() : 0, m = eh(d, m), m !== null)) {
			Sd = a, e.cancelPendingCommit = m(nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Rd(e, a, o, !l);
			return;
		}
		nf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Ld(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Vr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Rd(e, t, n, r) {
		t = ct(e, t), t &= ~cd, t &= ~sd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - L(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && mt(e, n, t);
	}
	function zd() {
		return K & 6 ? !0 : (Df(0, !1), !1);
	}
	function Bd() {
		if (J !== null) {
			if (X === 0) var e = J.return;
			else e = J, ga = ha = null, rs(e), ro = null, io = 0, e = J;
			for (; e !== null;) bl(e.alternate, e), e = e.return;
			J = null;
		}
	}
	function Vd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Sd = 0, Bd(), q = e, J = n = Ni(e.current, null), Y = t, X = 0, ed = null, td = !1, nd = st(e, t), rd = !1, ud = ld = cd = sd = od = ad = 0, fd = dd = null, pd = !1, id = ct(e, t), Ci(), n;
	}
	function Hd(e, t) {
		U = null, M.H = pc, t === qa || t === Ya ? (t = to(), X = 3) : t === Ja ? (t = to(), X = 4) : X = t === jc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, ed = t, J === null && (ad = 1, Tc(e, Vi(t, e.current)));
	}
	function Ud() {
		var e = ko.current;
		return e === null ? !0 : (Y & 4194048) === Y ? Ao === null : (Y & 62914560) === Y || Y & 536870912 ? e === Ao : !1;
	}
	function Wd() {
		var e = M.H;
		return M.H = pc, e === null ? pc : e;
	}
	function Gd() {
		var e = M.A;
		return M.A = Qu, e;
	}
	function Kd() {
		ad = 4, td || (Y & 4194048) !== Y && ko.current !== null || (nd = !0), !(od & 134217727) && !(sd & 134217727) || q === null || Rd(q, Y, ld, !1);
	}
	function qd(e, t, n) {
		var r = K;
		K |= 2;
		var i = Wd(), a = Gd();
		(q !== e || Y !== t) && (_d = null, Vd(e, t)), t = !1;
		var o = ad;
		a: do
			try {
				if (X !== 0 && J !== null) {
					var s = J, c = ed;
					switch (X) {
						case 8:
							Bd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							ko.current === null && (t = !0);
							var l = X;
							if (X = 0, ed = null, $d(e, s, c, l), n && nd) {
								o = 0;
								break a;
							}
							break;
						default: l = X, X = 0, ed = null, $d(e, s, c, l);
					}
				}
				Jd(), o = ad;
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ga = ha = null, K = r, M.H = i, M.A = a, J === null && (q = null, Y = 0, Ci()), o;
	}
	function Jd() {
		for (; J !== null;) Zd(J);
	}
	function Yd(e, t) {
		var n = K;
		K |= 2;
		var r = Wd(), a = Gd();
		q !== e || Y !== t ? (_d = null, gd = We() + 500, Vd(e, t)) : nd = st(e, t);
		a: do
			try {
				if (X !== 0 && J !== null) {
					t = J;
					var o = ed;
					b: switch (X) {
						case 1:
							X = 0, ed = null, $d(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Za(o)) {
								X = 0, ed = null, Qd(t);
								break;
							}
							t = function() {
								X !== 2 && X !== 9 || q !== e || (X = 7), Ef(e);
							}, o.then(t, t);
							break a;
						case 3:
							X = 7;
							break a;
						case 4:
							X = 5;
							break a;
						case 7:
							Za(o) ? (X = 0, ed = null, Qd(t)) : (X = 0, ed = null, $d(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (J.tag) {
								case 26: s = J.memoizedState;
								case 5:
								case 27:
									var c = J;
									if (s ? Ym(s) : c.stateNode.complete) {
										X = 0, ed = null;
										var l = c.sibling;
										if (l !== null) J = l;
										else {
											var u = c.return;
											u === null ? J = null : (J = u, ef(u));
										}
										break b;
									}
							}
							X = 0, ed = null, $d(e, t, o, 5);
							break;
						case 6:
							X = 0, ed = null, $d(e, t, o, 6);
							break;
						case 8:
							Bd(), ad = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Xd();
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return ga = ha = null, M.H = r, M.A = a, K = n, J === null ? (q = null, Y = 0, Ci(), ad) : 0;
	}
	function Xd() {
		for (; J !== null && !He();) Zd(J);
	}
	function Zd(e) {
		var t = dl(e.alternate, e, id);
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : J = t;
	}
	function Qd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Gc(n, t, t.pendingProps, t.type, void 0, Y);
				break;
			case 11:
				t = Gc(n, t, t.pendingProps, t.type.render, t.ref, Y);
				break;
			case 5:
				rs(t);
				var r = t;
				r === na && (V ? (la(r), r.tag === 5 && r.stateNode != null && (ra = r.stateNode)) : (la(r), V = !0));
			default: bl(n, t), t = J = Pi(t, id), t = dl(n, t, id);
		}
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : J = t;
	}
	function $d(e, t, n, r) {
		ga = ha = null, rs(t), ro = null, io = 0;
		var i = t.return;
		try {
			if (Ac(e, i, t, n, Y)) {
				ad = 1, Tc(e, Vi(n, e.current)), J = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw J = i, t;
			ad = 1, Tc(e, Vi(n, e.current)), J = null;
			return;
		}
		t.flags & 32768 ? (V || r === 1 ? e = !0 : nd || Y & 536870912 ? e = !1 : (td = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = ko.current, r !== null && r.tag === 13 && (r.flags |= 16384))), tf(t, e)) : ef(t);
	}
	function ef(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				tf(t, td);
				return;
			}
			e = t.return;
			var n = vl(t.alternate, t, id);
			if (n !== null) {
				J = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				J = t;
				return;
			}
			J = t = e;
		} while (t !== null);
		ad === 0 && (ad = 5);
	}
	function tf(e, t) {
		do {
			var n = yl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, J = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				J = e;
				return;
			}
			J = e = n;
		} while (e !== null);
		ad = 6, J = null;
	}
	function nf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			df();
		while (yd !== 0);
		if (K & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === q && (J = q = null, Y = 0), xd = t, bd = e, Sd = n, wd = a, Td = r, rf(e, t, n, s, c, l, f);
		}
	}
	function rf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Cd = s, s |= Si, pt(e, n, s, r, i, a), Dd = null, (n & 335544064) === n ? (Od = Pa(e), r = 10262) : (Od = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, yf(Je, function() {
			return ff(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), zl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = M.T, M.T = null, i = N.p, N.p = 2, a = K, K |= 4;
			try {
				pu(e, t, n);
			} finally {
				K = a, N.p = i, M.T = r;
			}
		}
		yd = 1, zl ? Ed = Mp(o, e.containerInfo, Od, sf, cf, of, lf, ff, af, null, null) : (sf(), cf(), lf());
	}
	function af(e) {
		if (yd !== 0) {
			var t = bd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function of() {
		yd === 3 && (yd = 0, Pu(xd, bd), yd = 4);
	}
	function sf() {
		if (yd === 1) {
			yd = 0;
			var e = bd, t = xd, n = Sd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = M.T, M.T = null;
				var i = N.p;
				N.p = 2;
				var a = K;
				K |= 4;
				try {
					uu = du = !1, Au(t, e, n), n = cp;
					var o = qr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Kr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Jr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Gr(s, h), v = Gr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!sp, cp = sp = null;
				} finally {
					K = a, N.p = i, M.T = r;
				}
			}
			e.current = t, yd = 2;
		}
	}
	function cf() {
		if (yd === 2) {
			yd = 0;
			var e = bd, t = xd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = M.T, M.T = null;
				var r = N.p;
				N.p = 2;
				var i = K;
				K |= 4;
				try {
					hu(e, t.alternate, t);
				} finally {
					K = i, N.p = r, M.T = n;
				}
			}
			yd = 3;
		}
	}
	function lf() {
		if (yd === 4 || yd === 3) {
			yd = 0;
			var e = Ed;
			Ed = null, Ue();
			var t = bd, n = xd, r = Sd, i = Td, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? yd = 5 : (yd = 0, xd = bd = null, uf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (vd = null), vt(r), n = n.stateNode, I && typeof I.onCommitFiberRoot == "function") try {
				I.onCommitFiberRoot(F, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = M.T, a = N.p, N.p = 2, M.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					M.T = n, N.p = a;
				}
			}
			if (i = Dd, o = Od, Od = null, i !== null && (Dd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Sd & 3 && df(), Ef(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ad ? kd++ : (kd = 0, Ad = t) : (kd = 0, Ad = null), Df(0, !1);
		}
	}
	function uf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ja(t)));
	}
	function df() {
		return Ed !== null && (Ed.skipTransition(), Ed = null), sf(), cf(), lf(), ff();
	}
	function ff() {
		if (yd !== 5) return !1;
		var e = bd, t = Cd;
		Cd = 0;
		var n = vt(Sd), r = M.T, a = N.p;
		try {
			N.p = 32 > n ? 32 : n, M.T = null, n = wd, wd = null;
			var o = bd, s = Sd;
			if (yd = 0, xd = bd = null, Sd = 0, K & 6) throw Error(i(331));
			var c = K;
			if (K |= 4, Yu(o.current), Vu(o, o.current, s, n), K = c, Df(0, !1), I && typeof I.onPostCommitFiberRoot == "function") try {
				I.onPostCommitFiberRoot(F, o);
			} catch {}
			return !0;
		} finally {
			N.p = a, M.T = r, uf(e, t);
		}
	}
	function pf(e, t, n) {
		t = Vi(n, t), t = Dc(e.stateNode, t, 2), e = go(e, t, 2), e !== null && (ft(e, 2), Ef(e));
	}
	function Z(e, t, n) {
		if (e.tag === 3) pf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				pf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (vd === null || !vd.has(r))) {
					e = Vi(n, e), n = Oc(2), r = go(t, n, 2), r !== null && (kc(n, r, t, e), ft(r, 2), Ef(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new $u();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (rd = !0, i.add(n), e = hf.bind(null, e, t, n), t.then(e, e));
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, q === e && (Y & n) === n && (ad === 4 || ad === 3 && (Y & 62914560) === Y && 300 > We() - md ? K & 2 ? cd |= n : Vd(e, 0) : cd |= n, ud === Y && (ud = 0)), Ef(e);
	}
	function gf(e, t) {
		t === 0 && (t = ut()), e = Ei(e, t), e !== null && (ft(e, t), Ef(e));
	}
	function _f(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), gf(e, n);
	}
	function vf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), gf(e, n);
	}
	function yf(e, t) {
		return Be(e, t);
	}
	var bf = null, xf = null, Sf = !1, Cf = !1, wf = !1, Tf = 0;
	function Ef(e) {
		e !== xf && e.next === null && (xf === null ? bf = xf = e : xf = xf.next = e), Cf = !0, Sf || (Sf = !0, Nf());
	}
	function Df(e, t) {
		if (!wf && Cf) {
			wf = !0;
			do
				for (var n = !1, r = bf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - L(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Mf(r, a));
						} else a = Y, a = ot(r, r === q ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || st(r, a) || (n = !0, Mf(r, a));
					}
					r = r.next;
				}
			while (n);
			wf = !1;
		}
	}
	function Of() {
		kf();
	}
	function kf() {
		Cf = Sf = !1;
		var e = 0;
		Tf !== 0 && hp() && (e = Tf);
		for (var t = We(), n = null, r = bf; r !== null;) {
			var i = r.next, a = Af(r, t);
			a === 0 ? (r.next = null, n === null ? bf = i : n.next = i, i === null && (xf = n)) : (n = r, (e !== 0 || a & 3) && (Cf = !0)), r = i;
		}
		yd !== 0 && yd !== 5 || Df(e, !1), Tf !== 0 && (Tf = 0);
	}
	function Af(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - L(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = lt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = q, n = Y, n = ot(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (X === 2 || X === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ve(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || st(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ve(r), vt(n)) {
				case 2:
				case 8:
					n = qe;
					break;
				case 32:
					n = Je;
					break;
				case 268435456:
					n = Xe;
					break;
				default: n = Je;
			}
			return r = jf.bind(null, e), n = Be(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ve(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function jf(e, t) {
		if (yd !== 0 && yd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (df() && e.callbackNode !== n) return null;
		var r = Y;
		return r = ot(e, e === q ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Fd(e, r, t), Af(e, We()), e.callbackNode != null && e.callbackNode === n ? jf.bind(null, e) : null);
	}
	function Mf(e, t) {
		if (df()) return null;
		Fd(e, t, !0);
	}
	function Nf() {
		bp(function() {
			K & 6 ? Be(Ke, Of) : kf();
		});
	}
	function Pf() {
		if (Tf === 0) {
			var e = La;
			e === 0 && (e = nt, nt <<= 1, !(nt & 261888) && (nt = 256)), Tf = e;
		}
		return Tf;
	}
	function Ff(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : _n(e);
	}
	function If(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ff((i[Ct] || null).action), o = r.submitter;
			o && (t = (t = o[Ct] || null) ? Ff(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new zn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Tf !== 0) {
								var e = new FormData(i, o);
								$s(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), $s(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Lf = 0; Lf < pi.length; Lf++) {
		var Rf = pi[Lf];
		mi(Rf.toLowerCase(), "on" + (Rf[0].toUpperCase() + Rf.slice(1)));
	}
	mi(ai, "onAnimationEnd"), mi(oi, "onAnimationIteration"), mi(si, "onAnimationStart"), mi("dblclick", "onDoubleClick"), mi("focusin", "onFocus"), mi("focusout", "onBlur"), mi(ci, "onTransitionRun"), mi(li, "onTransitionStart"), mi(ui, "onTransitionCancel"), mi(di, "onTransitionEnd"), Vt("onMouseEnter", ["mouseout", "mouseover"]), Vt("onMouseLeave", ["mouseout", "mouseover"]), Vt("onPointerEnter", ["pointerout", "pointerover"]), Vt("onPointerLeave", ["pointerout", "pointerover"]), Bt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Bt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Bt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Bt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Bt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Bt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var zf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zf));
	function Vf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						yi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						yi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[Tt];
		n === void 0 && (n = t[Tt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Gf(t, e, 2, !1), n.add(r));
	}
	function Hf(e, t, n) {
		var r = 0;
		t && (r |= 4), Gf(n, e, r, t);
	}
	var Uf = "_reactListening" + Math.random().toString(36).slice(2);
	function Wf(e) {
		if (!e[Uf]) {
			e[Uf] = !0, Rt.forEach(function(t) {
				t !== "selectionchange" && (Bf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Uf] || (t[Uf] = !0, Hf("selectionchange", !1, t));
		}
	}
	function Gf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !On || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Kf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Mt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		Tn(function() {
			var r = a, i = bn(n), s = [];
			a: {
				var c = fi.get(e);
				if (c !== void 0) {
					var l = zn, u = e;
					switch (e) {
						case "keypress": if (Pn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = rr;
							break;
						case "focusin":
							u = "focus", l = Jn;
							break;
						case "focusout":
							u = "blur", l = Jn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Jn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Kn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = qn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = or;
							break;
						case ai:
						case oi:
						case si:
							l = Yn;
							break;
						case di:
							l = sr;
							break;
						case "scroll":
						case "scrollend":
							l = Vn;
							break;
						case "wheel":
							l = cr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Xn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = ir;
							break;
						case "submit":
							l = ar;
							break;
						case "toggle":
						case "beforetoggle": l = lr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = En(m, p), g != null && d.push(qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== yn && (u = n.relatedTarget || n.fromElement) && (Mt(u) || u[wt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Mt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Kn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = ir, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Pt(c), h = l == null ? u : Pt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Mt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? ee(c, l, Yf) : null, c !== null && Xf(s, u, c, d, !1), l !== null && f !== null && Xf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Pt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = kr;
					else if (Cr(c)) {
						if (Ar) _ = zr;
						else {
							_ = Lr;
							var v = Ir;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && mn(r.elementType) && (_ = kr) : _ = Rr;
					if (_ &&= _(e, r)) {
						wr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Pt(r) : window, e) {
					case "focusin":
						(Cr(v) || v.contentEditable === "true") && (Xr = v, B = r, Zr = null);
						break;
					case "focusout":
						Zr = B = Xr = null;
						break;
					case "mousedown":
						Qr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Qr = !1, $r(s, n, i);
						break;
					case "selectionchange": if (Yr) break;
					case "keydown":
					case "keyup": $r(s, n, i);
				}
				var y;
				if (dr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else yr ? _r(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (mr && n.locale !== "ko" && (yr || b !== "onCompositionStart" ? b === "onCompositionEnd" && yr && (y = Nn()) : (An = i, jn = "value" in An ? An.value : An.textContent, yr = !0)), v = Jf(r, b), 0 < v.length && (b = new Zn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = vr(n), y !== null && (b.data = y)))), (y = pr ? br(e, n) : xr(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new Zn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), If(s, e, r, n, i);
			}
			Vf(s, t);
		});
	}
	function qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Jf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = En(e, n), i != null && r.unshift(qf(e, i, a)), i = En(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Yf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Xf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = En(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = En(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Zf = /\r\n?/g, Qf = /\u0000|\uFFFD/g;
	function $f(e) {
		return (typeof e == "string" ? e : "" + e).replace(Zf, "\n").replace(Qf, "");
	}
	function ep(e, t) {
		return t = $f(t), $f(e) === t;
	}
	function $(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || un(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && un(e, "" + r);
				else return;
				break;
			case "className":
				Jt(e, "class", r);
				break;
			case "tabIndex":
				Jt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Jt(e, n, r);
				break;
			case "style":
				pn(e, r, o);
				return;
			case "data": if (t !== "object") {
				Jt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = _n(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", a.name, a, null), $(e, t, "formEncType", a.formEncType, a, null), $(e, t, "formMethod", a.formMethod, a, null), $(e, t, "formTarget", a.formTarget, a, null)) : ($(e, t, "encType", a.encType, a, null), $(e, t, "method", a.method, a, null), $(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = _n(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = vn);
				return;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = _n(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), qt(e, "popover", r);
				break;
			case "xlinkActuate":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Yt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Yt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				qt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = hn.get(n) || n, qt(e, n, r);
			else return;
		}
		z = !0;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				pn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") un(e, r);
				else if (typeof r == "number" || typeof r == "bigint") un(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = vn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!zt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[Ct] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					z = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : qt(e, n, r);
				}
				return;
		}
		z = !0;
	}
	function np(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: $(e, t, o, s, n, null);
					}
				}
				a && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: $(e, t, r, d, n, null);
					}
				}
				an(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: $(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && sn(e, !!r, n, !0) : sn(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: $(e, t, s, c, n, null);
				}
				ln(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: $(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < zf.length; r++) Q(zf[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (mn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && tp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && $(e, t, c, r, n, null));
	}
	var rp = {};
	function ip(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || $(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (z = !0), o = m;
							break;
						case "name":
							m !== f && (z = !0), a = m;
							break;
						case "checked":
							m !== f && (z = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (z = !0), d = m;
							break;
						case "value":
							m !== f && (z = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (z = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				rn(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || $(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (z = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (z = !0), c = o;
						break;
					case "multiple": o !== l && (z = !0), s = o;
					default: o !== l && $(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? sn(e, !!n, n ? [] : "", !1) : sn(e, !!n, t, !0)) : sn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (z = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (z = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && $(e, t, s, a, r, o);
				}
				cn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: $(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (z = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: $(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && $(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (mn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && tp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || tp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && $(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || $(e, t, f, p, r, m);
	}
	function ap(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function op() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && ap(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && ap(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var sp = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[St] = r, n[Ct] = t, np(n, e, t), It(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[kt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : E({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag !== 6 && (e = b(e), t.observe(e), !1);
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag !== 6 && (e = b(e), t.unobserve(e), !1);
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = Mt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = ee(n, a, T), t === null ? t = !1 : (h(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = ee(r, a, T), t === null ? t = !1 : (h(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Zp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), jt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[kt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && $(e, t, r, null, rp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === vn && (e.onclick = null), jt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		jt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = N.d;
	N.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = zd();
		return e || t;
	}
	function Cm(e) {
		var t = Nt(e);
		t !== null && t.tag === 5 && t.type === "form" ? tc(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = nn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), It(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + nn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + nn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + nn(n.imageSizes) + "\"]")) : i += "[href=\"" + nn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = E({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[At] = !0, o.onload = o.onerror = function() {
					Lt(o);
				}), It(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + nn(r) + "\"][href=\"" + nn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = E({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), np(r, "link", e), It(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Ft(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = E({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					It(c), np(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = Ft(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = E({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), It(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = Ft(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = E({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), It(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = Ee.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Ft(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var o = Ft(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Fm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = vm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, o)), Lm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Ft(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + nn(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return E({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[At]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[At] = !0, t.onload = t.onerror = Lt.bind(null, t), np(t, "link", n), It(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + nn(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + nn(n.href) + "\"]");
				if (r) return t.instance = r, It(r), r;
				var a = E({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), It(r), np(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, It(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), It(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), np(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, It(a), a) : (r = n, (a = vm.get(o)) && (r = E({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), It(a), np(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[kt] || a[St] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, It(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), It(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: k,
		Provider: null,
		Consumer: null,
		_currentValue: ye,
		_currentValue2: ye,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = dt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = dt(0), this.hiddenUpdates = dt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = ji(3, null, null, t), e.current = a, a.stateNode = e, t = Aa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, po(a), e;
	}
	function uh(e) {
		return e ? (e = ki, e) : ki;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = ho(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = go(e, r, t), n !== null && (Pd(n, e, t), _o(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Ei(e, 67108864);
			t !== null && Pd(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = jd();
			t = _t(t);
			var n = Ei(e, t);
			n !== null && Pd(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = M.T;
		M.T = null;
		var a = N.p;
		try {
			N.p = 2, yh(e, t, n, r);
		} finally {
			N.p = a, M.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = M.T;
		M.T = null;
		var a = N.p;
		try {
			N.p = 8, yh(e, t, n, r);
		} finally {
			N.p = a, M.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Kf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = Nt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = at(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - L(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Ef(a), !(K & 6) && (gd = We() + 500, Df(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Ei(a, 2), s !== null && Pd(s, a, 2), zd(), ph(a, 2);
					}
					if (a = bh(r), a === null && Kf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = bn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Mt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ge()) {
				case Ke: return 2;
				case qe: return 8;
				case Je:
				case Ye: return 32;
				case Xe: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Nt(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = Mt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, bt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, bt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				yn = r, n.target.dispatchEvent(r), yn = null;
			} else return t = Nt(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = Nt(n);
				a !== null && (e.splice(t, 3), t -= 3, $s(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[Ct] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[Ct] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		dh(n, jd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), zd(), t[wt] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = yt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.0") throw Error(i(527, Kh, "19.3.0"));
	N.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.0",
		rendererPackageName: "react-dom",
		currentDispatcherRef: M,
		reconcilerVersion: "19.3.0"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			F = Jh.inject(qh), I = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Sc, s = Cc, c = wc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[wt] = t.current, Wf(e), new Wh(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = null;
function v(e, t) {
	e.currentIndex = 0, e.wipContextDeps = null, e.wipCommitCallbacks = [];
	let n = _;
	_ = e;
	try {
		if (t(), e.isFirstRender = !1, e.cells.length !== e.currentIndex) throw Error(`Rendered ${e.currentIndex} hooks but expected ${e.cells.length}. Hooks must be called in the exact same order in every render.`);
	} finally {
		_ = n;
	}
}
function y() {
	if (!_) throw Error("No resource fiber available");
	return _;
}
function b() {
	return _;
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/helpers/env.js
var x = typeof process < "u" && !1, S = (e) => ({
	version: 0,
	committedVersion: 0,
	dispatchUpdate: e,
	changelog: [],
	committedLog: [],
	unsettledCount: 0,
	rollbackCallbacks: []
}), C = (e) => {
	e.committedVersion = e.version;
	for (let t of e.changelog) t.logged = !1, t.settled || (t.settled = !0, e.unsettledCount--), e.committedLog.push(t);
	e.changelog.length = 0, e.unsettledCount === 0 && (e.committedLog.length = 0), e.rollbackCallbacks.length = 0;
}, w = (e, t) => {
	let n = e.version > t;
	if (e.version = t, n) {
		for (let t = 0; t < e.rollbackCallbacks.length; t++) e.rollbackCallbacks[t]();
		if (e.rollbackCallbacks.length = 0, t <= e.committedVersion) {
			let n = [];
			for (; e.committedVersion - n.length > t;) {
				let t = e.committedLog.pop();
				if (t === void 0) {
					if (x) throw Error("tap: committed history is shorter than the replay base.");
					break;
				}
				te(t.fiber, t.cell), t.cell.workInProgress = t.prevState, n.push({
					record: t,
					prevState: t.prevState,
					eagerState: t.eagerState,
					hasEagerState: t.hasEagerState
				});
			}
			if (n.length > 0) {
				let t = e.committedVersion;
				E(e, () => {
					for (let t = n.length - 1; t >= 0; t--) {
						let r = n[t];
						r.record.prevState = r.prevState, r.record.eagerState = r.eagerState, r.record.hasEagerState = r.hasEagerState, e.committedLog.push(r.record);
					}
					e.committedVersion = t;
				});
			}
			e.committedVersion = t;
			for (let t of e.changelog) t.logged = !1;
			e.changelog.length = 0;
		} else {
			for (; e.committedVersion + e.changelog.length > t;) e.changelog.pop().logged = !1;
			for (let t = 0; t < e.changelog.length; t++) T(e.changelog[t]);
			C(e);
		}
	}
}, T = (e) => {
	te(e.fiber, e.cell), e.queued || (e.queued = !0, (e.cell.queue ??= []).push(e));
}, ee = (e, t) => {
	e.wipCommitCallbacks.push(t);
}, E = (e, t) => {
	e.rollbackCallbacks.push(t);
}, te = (e, t) => {
	t.isDirty || (t.isDirty = !0, e.markDirty?.(), E(e.root, () => {
		if (t.queue !== null) {
			for (let e of t.queue) e.queued = !1;
			t.queue = null;
		}
		t.workInProgress = t.current, t.isDirty = !1;
	}));
}, ne = Symbol.for("react.memo_cache_sentinel"), re = (e) => Array(e).fill(ne), D = (e, t) => {
	let n = e.memoCache, r = n.workInProgress;
	if (r === null) {
		let t = n.current;
		r = t === null ? [] : t.map((e) => e.slice()), n.workInProgress = r, E(e.root, () => {
			n.workInProgress = null;
		});
	}
	let i = n.index++, a = r[i];
	return a === void 0 ? (a = re(t), r[i] = a) : x && a.length !== t && console.error(`Expected a constant size argument for each invocation of c(). The previous cache was allocated with size ${a.length} but size ${t} was requested.`), a;
}, ie = (e) => D(y(), e), O = /* @__PURE__ */ c(u(), 1), ae = O.default.__COMPILER_RUNTIME?.c ?? ((e) => (0, O.useMemo)(() => {
	let t = re(e);
	return t[ne] = !0, t;
}, [])), k = () => b() !== null, A = (e) => k() ? ie(e) : ae(e), j = (e, ...t) => Object.assign(Object.create(null), e, ...t), oe = () => {
	throw Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, se = () => {
	throw Error("Hook order changed between renders");
}, ce = () => ({
	type: "effect",
	setup: void 0,
	setupDeps: void 0,
	cleanup: void 0,
	deps: null,
	generation: 0
});
function le(e, t) {
	let n = y(), r = n.currentIndex++, i = n.cells[r], a = i === void 0 ? ce() : i.type === "effect" ? i : se();
	if (i === void 0 && (n.isFirstRender || oe(), n.cells[r] = a, n.effectCells.push(a)), a.deps !== null && !!t != !!a.deps) throw Error("useEffect called with and without dependencies across re-renders");
	ee(n, () => {
		a.setup = e, a.setupDeps = t, a.generation++;
	});
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/hooks/utils/depsShallowEqual.js
var ue = (e, t) => {
	x && e.length !== t.length && console.error(`The final argument passed to a hook changed size between renders. The order and size of this array must remain constant.

Previous: [${e.join(", ")}]\nIncoming: [${t.join(", ")}]`);
	for (let n = 0; n < e.length && n < t.length; n++) if (!Object.is(e[n], t[n])) return !1;
	return !0;
}, de = (e, t) => {
	ee(e, () => {
		t.current = t.wip, t.currentDeps = t.wipDeps, t.isDirty = !1;
	});
}, fe = (e, t) => {
	let n = y(), r = n.currentIndex++, i = n.cells[r];
	if (i === void 0) {
		n.isFirstRender || oe();
		let a = e();
		return x && n.devStrictMode && e(), i = {
			type: "memo",
			current: a,
			currentDeps: t,
			wip: a,
			wipDeps: t,
			isDirty: !1
		}, n.cells[r] = i, a;
	}
	i.type !== "memo" && se();
	let a = i;
	if (ue(a.wipDeps, t)) return a.isDirty && de(n, a), a.wip;
	let o = e();
	return x && n.devStrictMode && e(), a.wip = o, a.wipDeps = t, a.isDirty || (a.isDirty = !0, E(n.root, () => {
		a.wip = a.current, a.wipDeps = a.currentDeps, a.isDirty = !1;
	})), de(n, a), o;
};
//#endregion
//#region node_modules/@assistant-ui/tap/dist/react-hooks/useRef.js
function pe(e) {
	return fe(() => ({ current: e }), []);
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/context.js
var me = Symbol("tap.Context.defaultValue"), he = (e) => e, ge = /* @__PURE__ */ new Map(), _e = /* @__PURE__ */ new Set(), ve = () => new Map(ge), M = (e, t) => {
	let n = ge;
	ge = e;
	try {
		return t();
	} finally {
		ge = n;
	}
}, N = (e, t) => {
	e[me] = t;
}, ye = (e) => typeof e == "object" && !!e && me in e, be = (e) => typeof e == "object" && !!e && "$$typeof" in e && e.$$typeof === Symbol.for("react.context"), xe = (e) => ye(e) || be(e), Se = (e) => {
	if (!ye(e)) {
		if (be(e)) {
			N(e, e._currentValue ?? e._currentValue2);
			return;
		}
		throw Error("A tap resource's `use()` only accepts a tap context.");
	}
}, Ce = (e, t, n) => {
	if (typeof e != "object" || !e) throw Error("useContextProvider only accepts a React context.");
	Se(e);
	let r = e, i = y(), a = pe(void 0), o = a.current === void 0 || !Object.is(a.current.value, t);
	le(() => {
		a.current = { value: t };
	}, [t]);
	let s = ge.get(r), c = s !== void 0 || ge.has(r);
	ge.set(r, {
		value: t,
		source: i
	});
	try {
		return P(r, o, n);
	} finally {
		c ? ge.set(r, s) : ge.delete(r);
	}
}, P = (e, t, n) => {
	let r = _e.has(e);
	t ? _e.add(e) : _e.delete(e);
	try {
		return n();
	} finally {
		r ? _e.add(e) : _e.delete(e);
	}
}, we = (e) => {
	Se(e);
	let t = e, n = Te(t, e), r = y();
	return (r.wipContextDeps ??= /* @__PURE__ */ new Map()).set(t, n.source), n.value;
}, Te = (e, t) => ge.get(e) ?? {
	value: he(t)[me],
	source: null
}, Ee = (e, t, n, r) => {
	if (!r) return n;
	let i = n;
	for (let [n, a] of r) a !== t && a !== e && (i ??= /* @__PURE__ */ new Map()).set(n, a);
	return i;
}, De = (e, t = e.wipContextDeps) => {
	let n = b();
	n && t && (n.wipContextDeps = Ee(n, e, n.wipContextDeps, t));
}, Oe = () => _e.size > 0, ke = (e) => {
	if (!e.contextDeps || !Oe()) return !1;
	for (let t of _e.keys()) if (e.contextDeps.has(t)) return !0;
	return !1;
}, Ae = (e, t, n) => {
	if (e.isNeverMounted) throw Error("Resource updated before mount");
	let r = !1, i = !0;
	e.root.unsettledCount++, e.root.dispatchUpdate(() => r ? i : (r = !0, n && e.root.changelog.length === 0 && !t.cell.isDirty && !t.hasEagerState && (t.prevState = t.cell.workInProgress, t.eagerState = n(t.cell.workInProgress, t.action), t.hasEagerState = !0, i = !Object.is(t.cell.current, t.eagerState), !i && !t.settled && (t.settled = !0, e.root.unsettledCount--)), i), () => (r = !0, i = !0, T(t), t.logged || (t.logged = !0, e.root.changelog.push(t)), !0));
}, je = (e, t, n, r, i) => {
	let a = r ? r(n) : n;
	x && e.devStrictMode && r && r(n);
	let o = {
		type: "reducer",
		workInProgress: a,
		current: a,
		isDirty: !1,
		queue: null,
		renderQueue: null,
		reducer: t,
		dispatch: (n) => {
			let r = b();
			if (r !== null) {
				if (r !== e) throw Error("Cannot update a resource while rendering a different resource.");
				(e.renderPendingCells ??= /* @__PURE__ */ new Set()).add(o), (o.renderQueue ??= []).push(n);
			} else Ae(e, {
				fiber: e,
				cell: o,
				action: n,
				hasEagerState: !1,
				eagerState: void 0,
				prevState: o.current,
				settled: !1,
				queued: !1,
				logged: !1
			}, i ? t : void 0);
		}
	};
	return o;
};
function Me(e, t, n, r) {
	let i = y(), a = i.currentIndex++, o = i.cells[a], s = (() => {
		if (o !== void 0) return o.type === "reducer" ? o : se();
		i.isFirstRender || oe();
		let s = je(i, e, t, n, r);
		return i.cells[a] = s, s;
	})(), c = s.queue;
	if (c !== null) {
		let t = e === s.reducer;
		for (let n = 0; n < c.length; n++) {
			let r = c[n];
			!r.hasEagerState || !t || !Object.is(r.prevState, s.workInProgress) ? (r.prevState = s.workInProgress, r.eagerState = e(s.workInProgress, r.action), r.hasEagerState = !0, x && i.devStrictMode && (r.eagerState = e(s.workInProgress, r.action))) : x && i.devStrictMode && e(s.workInProgress, r.action), r.queued = !1, s.workInProgress = r.eagerState;
		}
		s.queue = null;
	}
	if (s.reducer = e, s.renderQueue !== null) {
		let t = s.workInProgress;
		for (let n of s.renderQueue) t = e(t, n);
		s.renderQueue = null, i.renderPendingCells?.delete(s), Object.is(t, s.workInProgress) || (te(i, s), s.workInProgress = t);
	}
	return s.isDirty && ee(i, () => {
		s.current = s.workInProgress, s.isDirty = !1;
	}), [s.workInProgress, s.dispatch];
}
function Ne(e, t, n) {
	return Me(e, t, n, !1);
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/react-hooks/useState.js
var Pe = (e, t) => typeof t == "function" ? t(e) : t, Fe = (e) => e === void 0 ? void 0 : typeof e == "function" ? e() : e;
function Ie(e) {
	return Me(Pe, e, Fe, !0);
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/react-hooks/useCallback.js
var Le = (e, t) => fe(() => e, t);
//#endregion
//#region node_modules/@assistant-ui/tap/dist/react-hooks/useEffectEvent.js
function Re(e) {
	let t = y(), n = pe(e);
	return n.current !== e && ee(t, () => {
		n.current = e;
	}), Le(((...e) => {
		if (x && b()) throw Error("useEffectEvent cannot be called during render");
		return n.current(...e);
	}), []);
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/helpers/thenable.js
var ze = (e) => typeof e == "object" && !!e && typeof e.then == "function", Be = () => {}, Ve = (e) => {
	let t = e;
	switch (typeof t.status == "string" ? t.status !== "fulfilled" && t.status !== "rejected" && e.then(Be, Be) : (t.status = "pending", e.then((e) => {
		t.status === "pending" && (t.status = "fulfilled", t.value = e);
	}, (e) => {
		t.status === "pending" && (t.status = "rejected", t.reason = e);
	})), t.status) {
		case "fulfilled": return t.value;
		case "rejected": throw t.reason;
		default: throw e;
	}
}, He = (e) => ze(e) ? Ve(e) : we(e), Ue = !1, We = (e, t, n = t) => {
	let r = y().isNeverMounted, i = r ? n() : t();
	x && !Ue && (!r || n === t) && (Object.is(i, t()) || (Ue = !0, console.error("The result of getSnapshot should be cached to avoid an infinite loop")));
	let [, a] = Ne((e) => e + 1, 0), o = pe(0), s = Re(() => {
		try {
			if (Object.is(i, t())) return o.current = 0, !1;
		} catch {}
		return !0;
	});
	return le(() => e(() => {
		s() && a();
	}), [e]), le(() => {
		if (s()) {
			if (++o.current > 50) throw o.current = 0, Error("Maximum update depth exceeded. The result of getSnapshot should be cached to avoid an infinite loop.");
			a();
		}
	}, [
		e,
		i,
		t
	]), i;
}, Ge = (e, t) => {}, Ke = 0, qe = () => {
	let e = pe(null);
	return e.current ??= `:tap${Ke++}:`, e.current;
}, Je = (e, t, n) => {
	let r = () => {
		if (!e) return;
		let n = t();
		if (typeof e == "function") {
			let t = e(n);
			return typeof t == "function" ? t : () => e(null);
		}
		return e.current = n, () => {
			e.current = null;
		};
	};
	n == null ? le(r) : le(r, [...n, e]);
}, Ye = O.default;
function Xe(e) {
	let t = (0, O.useRef)(e);
	return (0, O.useInsertionEffect)(() => {
		t.current = e;
	}), (0, O.useCallback)(((...e) => t.current(...e)), []);
}
var Ze = Ye.useEffectEvent ?? Xe, Qe = () => b() !== null, F = O.default, I = (e) => Qe() ? Ie(e) : F.useState(e), $e = (e, t, n) => Qe() ? Ne(e, t, n) : F.useReducer(e, t, n), L = (e) => Qe() ? pe(e) : F.useRef(e), et = (e, t) => Qe() ? fe(e, t) : F.useMemo(e, t), tt = (e, t) => Qe() ? Le(e, t) : F.useCallback(e, t), R = (e, t) => Qe() ? le(e, t) : F.useEffect(e, t), nt = (e, t) => Qe() ? le(e, t) : F.useLayoutEffect(e, t), rt = (e) => Qe() ? Re(e) : Ze(e), it = (e, t, n) => Qe() ? We(e, t, n) : F.useSyncExternalStore(e, t, n), at = (e, t) => Qe() ? void 0 : F.useDebugValue(e, t), ot = (e, t) => Qe() ? le(e, t) : F.useInsertionEffect(e, t), st = (e, t, n) => Qe() ? Je(e, t, n) : F.useImperativeHandle(e, t, n), ct = (e) => F.forwardRef(e), lt = (e, t) => F.memo(e, t), ut = F.Fragment, dt = (...e) => F.createElement(...e), ft = (...e) => F.cloneElement(...e), pt = (e) => F.isValidElement(e);
F.Children, F.Suspense;
var mt = (e) => {
	let t = F.createContext(e);
	return N(t, e), t;
}, ht = (e) => Qe() && xe(e) ? He(e) : F.use(e), gt = (e) => Qe() && xe(e) ? He(e) : F.useContext(e);
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/resource.js
function _t(e) {
	return (...t) => ({
		hook: e,
		args: t
	});
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/withKey.js
function vt(e, t, n) {
	return typeof t == "function" ? (...n) => vt(e, t(...n)) : n ? {
		...t,
		key: e,
		deps: n
	} : {
		...t,
		key: e
	};
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/helpers/throwAggregated.js
var yt = (e, t) => {
	if (e.length !== 0) {
		if (e.length === 1) throw e[0];
		for (let t of e) console.error(t);
		throw AggregateError(e, t);
	}
}, bt = 50, xt = {
	schedulers: /* @__PURE__ */ new Set(),
	isScheduled: !1
}, St = null, Ct = [], wt = class {
	_isDirty = !1;
	_task;
	constructor(e) {
		this._task = e;
	}
	get isDirty() {
		return this._isDirty;
	}
	markDirty() {
		if (St && (St.get(this) ?? 0) >= bt) throw Error("Maximum update depth exceeded. This can happen when a resource repeatedly calls setState inside useEffect.");
		this._isDirty = !0, xt.schedulers.add(this), Dt();
	}
	runTask() {
		St?.set(this, (St.get(this) ?? 0) + 1), this._isDirty = !1, this._task();
	}
	settle() {
		this._isDirty = !1;
	}
}, Tt = [];
new wt(() => {
	let e = Tt.splice(0), t = [];
	for (let n of e) try {
		n();
	} catch (e) {
		t.push(e);
	}
	yt(t, "Errors occurred while running scheduled tasks");
});
var Et = (e) => {
	if (St !== null) {
		Ct.push(e);
		return;
	}
	e();
}, Dt = () => {
	xt.isScheduled || (xt.isScheduled = !0, kt());
}, Ot = () => {
	let e = St;
	St = /* @__PURE__ */ new Map();
	let t = [];
	try {
		for (let e of xt.schedulers) if (xt.schedulers.delete(e), e.isDirty) try {
			e.runTask();
		} catch (e) {
			t.push(e);
		}
	} finally {
		if (St = e, xt.schedulers.clear(), xt.isScheduled = !1, St === null) for (; Ct.length > 0;) try {
			Ct.shift()();
		} catch (e) {
			t.push(e);
		}
	}
	yt(t, "Errors occurred during flushSync");
}, kt = (() => {
	if (typeof MessageChannel < "u") {
		let e = null, t;
		return () => {
			if (!e) {
				let n = new MessageChannel();
				n.port1.onmessage = () => {
					e?.unref?.(), Ot();
				}, e = n.port1, t = n.port2;
			}
			e.ref?.(), t.postMessage(null);
		};
	}
	return () => setTimeout(Ot, 0);
})(), At = (e) => {
	if (St !== null) return x && console.warn("flushTapSync was called from inside a render or commit. The flush is deferred until the current pass completes."), e();
	let t = xt;
	xt = {
		schedulers: /* @__PURE__ */ new Set(),
		isScheduled: !0
	};
	try {
		let t = e();
		return Ot(), t;
	} finally {
		let e = xt.schedulers;
		if (xt = t, e.size > 0) {
			for (let t of e) xt.schedulers.add(t);
			Dt();
		}
	}
};
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/helpers/commit.js
function jt(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) try {
		e[n]();
	} catch (e) {
		t.push(e);
	}
	yt(t, "Errors during commit");
}
function Mt(e) {
	let t = e.setup, n = e.setupDeps, r = e.generation, i;
	try {
		let e = t();
		if (e !== void 0 && typeof e != "function") throw Error(`An effect function must either return a cleanup function or nothing. Received: ${typeof e}`);
		i = e;
	} finally {
		e.generation === r ? (e.cleanup = i, e.deps = n) : i?.();
	}
}
var Nt = (e) => e.setup === void 0 ? !1 : e.deps === null || e.setupDeps === void 0 || !ue(e.deps, e.setupDeps);
function Pt(e) {
	let t = [], n = [];
	for (let t of e.effectCells) Nt(t) && n.push(t);
	for (let e of n) if (e.deps = null, e.cleanup !== void 0) try {
		e.cleanup();
	} catch (e) {
		t.push(e);
	} finally {
		e.cleanup = void 0;
	}
	for (let e of n) try {
		Mt(e);
	} catch (e) {
		t.push(e);
	}
	yt(t, "Errors during commit");
}
function Ft(e) {
	let t = [];
	for (let n of e.effectCells) if (n.deps = null, n.cleanup) try {
		n.cleanup?.();
	} catch (e) {
		t.push(e);
	} finally {
		n.cleanup = void 0;
	}
	yt(t, "Errors during cleanup");
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/react-dispatcher.js
var It = {
	useState: Ie,
	useReducer: Ne,
	useRef: pe,
	useMemo: fe,
	useCallback: Le,
	useEffect: le,
	useLayoutEffect: le,
	useInsertionEffect: le,
	useEffectEvent: Re,
	useContext: we,
	use: He,
	useSyncExternalStore: We,
	useDebugValue: Ge,
	useId: qe,
	useImperativeHandle: Je,
	useMemoCache: ie
}, Lt = O.default, Rt = Lt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? Lt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, zt = Rt == null ? null : "H" in Rt ? {
	get current() {
		return Rt.H;
	},
	set current(e) {
		Rt.H = e;
	}
} : "ReactCurrentDispatcher" in Rt ? {
	get current() {
		return Rt.ReactCurrentDispatcher.current;
	},
	set current(e) {
		Rt.ReactCurrentDispatcher.current = e;
	}
} : null;
function Bt(e) {
	if (!zt) return e();
	let t = zt.current;
	zt.current = It;
	try {
		return e();
	} finally {
		zt.current = t;
	}
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/core/ResourceFiber.js
function Vt(e, t, n = void 0, r) {
	return {
		hook: e,
		root: t,
		markDirty: n,
		devStrictMode: r,
		cells: [],
		effectCells: [],
		contextDeps: null,
		wipContextDeps: null,
		wipCommitCallbacks: null,
		memoCache: {
			current: null,
			workInProgress: null,
			index: 0
		},
		renderPendingCells: null,
		currentIndex: 0,
		isFirstRender: !0,
		isMounted: !1,
		isNeverMounted: !0
	};
}
function Ht(e) {
	e.wipCommitCallbacks = null, e.wipContextDeps = null, e.memoCache.workInProgress = null;
}
function Ut(e) {
	e.isMounted && (e.isMounted = !1, Ft(e));
}
function Wt(e, t) {
	if (e.renderPendingCells !== null) {
		for (let t of e.renderPendingCells) t.renderQueue = null;
		e.renderPendingCells.clear();
	}
	let n = 0, r;
	try {
		do {
			if (++n > 25) throw Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
			e.memoCache.index = 0, v(e, () => {
				r = Bt(() => e.hook(...t));
			});
		} while ((e.renderPendingCells?.size ?? 0) > 0);
	} catch (t) {
		throw Ht(e), t;
	}
	return De(e), r;
}
function Gt(e) {
	let t = e.wipCommitCallbacks;
	e.wipCommitCallbacks = null;
	let n = x && !e.isMounted && e.devStrictMode === "root";
	e.isMounted = !0, e.isNeverMounted = !1, t !== null && (e.contextDeps = e.wipContextDeps, C(e.root), e.memoCache.workInProgress !== null && (e.memoCache.current = e.memoCache.workInProgress, e.memoCache.workInProgress = null), jt(t)), n && (Pt(e), Ft(e)), Pt(e);
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/hooks/utils/useDevStrictMode.js
var z = () => {
	let e = y();
	return e.devStrictMode ? e.isFirstRender ? "child" : "root" : null;
}, Kt = () => "child", qt = () => null, Jt = () => {
	if (!x) return qt;
	let e = L(0);
	return I(() => e.current++), e.current === 2 ? Kt : qt;
}, Yt = () => b() ? z : Jt(), Xt = (e) => e(), Zt = (e) => {
	let t = [];
	for (let n of e) try {
		n();
	} catch (e) {
		t.push(e);
	}
	yt(t, "Errors occurred while notifying Tap root subscribers");
}, Qt = (e, t, n) => {
	let r = new wt(() => s.handleUpdate()), i = [], a = S((e, t) => {
		(i.length !== 0 || e()) && (i.push(t), r.markDirty());
	}), o = Vt(Xt, a, void 0, t), s = {
		scheduler: r,
		queue: i,
		fiber: o,
		subscribers: /* @__PURE__ */ new Set(),
		pendingHostRender: !1,
		isMounted: !1,
		hasRendered: !1,
		committedRender: e,
		context: /* @__PURE__ */ new Map(),
		value: void 0,
		applyQueue: () => {
			w(a, a.committedVersion);
			for (let e of i) x && o.devStrictMode && e(), e();
			return w(a, a.committedVersion + a.changelog.length), i.length;
		},
		publish: (e, t) => {
			r.isDirty || a.committedVersion !== t || s.value === e || (s.value = e, Et(() => Zt(s.subscribers)));
		},
		finishFlush: (e, t, n) => {
			C(a), i.splice(0, n), s.pendingHostRender = !1, i.length === 0 && r.settle(), s.isMounted && Gt(o), s.publish(e, t);
		},
		handleUpdate: () => {
			let e = s.applyQueue(), t;
			try {
				x && o.devStrictMode && M(s.context, () => Wt(o, [s.committedRender])), t = M(s.context, () => Wt(o, [s.committedRender]));
			} catch (e) {
				if (w(a, a.committedVersion), ze(e)) {
					let t = () => {
						s.isMounted && r.markDirty();
					};
					e.then(t, t);
					return;
				}
				if (s.isMounted) {
					s.pendingHostRender = !0, n((e) => e + 1);
					return;
				}
				throw e;
			}
			if (r.isDirty) throw Error("Scheduler is dirty, this should never happen");
			s.finishFlush(t, a.version, e);
		}
	};
	return s;
}, $t = (e) => {
	let [, t] = I(0), n = Yt(), r = L(null), i = r.current ??= Qt(e, n(), t), a = ve(), o = i.scheduler.isDirty || i.pendingHostRender ? i.applyQueue() : 0, s = M(a, () => Wt(i.fiber, [e])), c = {
		render: e,
		context: a,
		value: s,
		drained: o,
		wip: i.fiber.wipCommitCallbacks,
		version: i.fiber.root.version,
		processed: !1
	};
	return i.hasRendered || (i.hasRendered = !0, i.committedRender = e, i.context = a, i.value = s), R(() => (i.isMounted = !0, () => {
		i.isMounted = !1, Ut(i.fiber);
	}), [i]), R(() => {
		if (c.processed) {
			i.fiber.isMounted || (Gt(i.fiber), i.queue.length && !i.scheduler.isDirty && i.scheduler.markDirty());
			return;
		}
		if (c.processed = !0, i.committedRender = c.render, i.context = c.context, i.fiber.wipCommitCallbacks !== c.wip) {
			i.scheduler.isDirty || i.handleUpdate();
			return;
		}
		if (c.drained > 0 && i.fiber.root.version === c.version) {
			i.finishFlush(c.value, c.version, c.drained);
			return;
		}
		Gt(i.fiber), i.publish(c.value, c.version);
	}), et(() => ({
		getValue: () => i.value,
		subscribe: (e) => (i.subscribers.add(e), () => i.subscribers.delete(e))
	}), [i]);
}, en = () => {
	let e = L(0), t = e.current, n = y();
	return {
		version: t,
		markDirty: et(() => () => {
			e.current++, n.markDirty?.();
		}, [n]),
		root: n.root
	};
}, tn = () => {
	let [e] = I(() => S((e, t) => {
		let i = !1;
		r((t) => (i = !e(), i ? t : t + 1)), i || n(t);
	})), [t, n] = $e((t, n) => (w(e, t), t + +!!n()), 0), [, r] = I(0);
	return w(e, t), {
		root: e,
		version: t,
		markDirty: void 0
	};
}, nn = () => {
	let e = Yt(), { root: t, version: n, markDirty: r } = b() ? en() : tn();
	return {
		version: n,
		createFiber: tt((n, i, a) => Vt(n, t, a ? () => {
			a(), r?.();
		} : r, e()), [])
	};
}, rn = (e, t, n) => {
	let r = L(null), i = r.current ??= {
		wipDeps: null,
		wip: null,
		currentDeps: null,
		current: null
	};
	return i.wipDeps = i.currentDeps, i.wip = i.current, R(() => {
		i.currentDeps = i.wipDeps, i.current = i.wip;
	}), !n && i.currentDeps && ue(i.currentDeps, t) ? i.current : (i.wipDeps = t, i.wip = e(), i.wip);
};
//#endregion
//#region node_modules/@assistant-ui/tap/dist/hooks/useResource.js
function an(e) {
	let { version: t, createFiber: n } = nn(), r = et(() => n(e.hook, e.key), [
		e.hook,
		e.key,
		n
	]), i = rn(() => ({ value: Wt(r, e.args) }), [
		r,
		t,
		e.args
	], ke(r));
	return R(() => () => Ut(r), [r]), R(() => {
		Gt(r);
	}, [r, i]), i.value;
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/hooks/useResources.js
var on = (e, t) => {
	let n = e.get(t);
	n && (n.isDirty = !0);
}, sn = (e, t) => !e.isDirty && !ke(e.fiber) && t !== void 0 && e.committedDeps !== void 0 && ue(e.committedDeps, t), cn = (e) => {
	if (!Oe()) return !1;
	for (let { fiber: t } of e.values()) if (ke(t)) return !0;
	return !1;
};
function ln(e) {
	let [t] = I(() => /* @__PURE__ */ new Map()), { version: n, createFiber: r } = nn(), i = cn(t), a = rn(() => {
		let n = /* @__PURE__ */ new Set(), i = [], a = 0;
		for (let o = 0; o < e.length; o++) {
			let s = e[o], c = s.key;
			if (c === void 0) throw Error(`useResources did not provide a key for array at index ${o}`);
			if (n.has(c)) throw Error(`Duplicate key ${c} in useResources`);
			n.add(c);
			let l = t.get(c);
			if (!l) {
				let e = r(s.hook, s.key, () => on(t, c));
				l = {
					fiber: e,
					next: {
						value: Wt(e, s.args),
						deps: s.deps
					},
					isDirty: !1,
					committedDeps: void 0,
					committedValue: void 0
				}, a++, t.set(c, l);
			} else if (l.fiber.hook !== s.hook) {
				let e = r(s.hook, s.key, () => on(t, c)), n = Wt(e, s.args);
				l.next = {
					value: n,
					deps: s.deps,
					remount: e
				};
			} else if (sn(l, s.deps)) typeof l.next == "object" && Ht(l.fiber), l.fiber.contextDeps && De(l.fiber, l.fiber.contextDeps), l.next = "skip";
			else {
				let e = Wt(l.fiber, s.args);
				l.next = {
					value: e,
					deps: s.deps
				};
			}
			i.push(typeof l.next == "object" ? l.next.value : l.committedValue);
		}
		if (t.size > i.length - a) for (let e of t.keys()) n.has(e) || (t.get(e).next = "delete");
		return i;
	}, [
		e,
		t,
		r,
		n
	], i);
	return R(() => () => {
		for (let e of t.keys()) Ut(t.get(e).fiber);
	}, [t]), R(() => {
		for (let [e, n] of t.entries()) {
			let r = n.next;
			r === "delete" ? (Ut(n.fiber), t.delete(e)) : r === "skip" ? !n.fiber.isNeverMounted && !n.fiber.isMounted && Gt(n.fiber) : (r.remount && (Ut(n.fiber), n.fiber = r.remount), Gt(n.fiber), n.committedDeps = r.deps, n.committedValue = r.value, n.isDirty = !1, n.next = "skip");
		}
	}, [a, t]), a;
}
//#endregion
//#region node_modules/@assistant-ui/tap/dist/hooks/useTapHost.js
var un = (e) => e(), dn = (e) => {
	let { createFiber: t } = nn(), n = et(() => t(un, void 0), [t]), r = Wt(n, [e]);
	R(() => () => {
		Ut(n);
	}, [n]);
	let i = !1, a = () => {
		i && n.isMounted || (i = !0, Gt(n));
	};
	return R(a), {
		value: r,
		effects: a
	};
}, fn = _t(() => {
	let e = A(4), [t, n] = I(pn), r;
	e[0] === Symbol.for("react.memo_cache_sentinel") ? (r = (e, t) => (n((n) => {
		let r = j(n.renderers);
		return r[e] = [...r[e] ?? [], t], {
			...n,
			renderers: r
		};
	}), () => {
		n((n) => {
			let r = j(n.renderers), i = r[e]?.filter((e) => e !== t) ?? [];
			return i.length > 0 ? r[e] = i : delete r[e], {
				...n,
				renderers: r
			};
		});
	}), e[0] = r) : r = e[0];
	let i = r, a;
	e[1] === Symbol.for("react.memo_cache_sentinel") ? (a = (e) => (n((t) => ({
		...t,
		fallbacks: [...t.fallbacks, e]
	})), () => {
		n((t) => ({
			...t,
			fallbacks: t.fallbacks.filter((t) => t !== e)
		}));
	}), e[1] = a) : a = e[1];
	let o = a, s;
	return e[2] === t ? s = e[3] : (s = {
		getState: () => t,
		setDataUI: i,
		setFallbackDataUI: o
	}, e[2] = t, e[3] = s), s;
});
function pn() {
	return {
		renderers: j(),
		fallbacks: []
	};
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/model-context/types.js
var mn = (e) => {
	if (!e.overwrite) return e;
	let { overwrite: t, ...n } = e;
	return n;
}, hn = (e) => {
	let t = Array.from(e).map((e) => e.getModelContext()).sort((e, t) => (t.priority ?? 0) - (e.priority ?? 0)), n = j();
	return t.reduce((e, t) => {
		let r = t.priority ?? 0;
		if (t.system && (e.system ? e.system += `\n\n${t.system}` : e.system = t.system), t.tools) for (let [i, a] of Object.entries(t.tools)) {
			let t = e.tools !== void 0 && Object.hasOwn(e.tools, i) ? e.tools[i] : void 0;
			if (t && t !== a) {
				let o = n[i];
				if (o === r) {
					if (!a.overwrite) throw Error(`You tried to define a tool with the name ${i}, but it already exists.`);
					e.tools[i] = mn(a);
					continue;
				}
				let s = o > r ? t : a, c = o > r ? a : t;
				e.tools[i] = mn({
					...c,
					...s
				}), n[i] = Math.max(o, r);
				continue;
			}
			e.tools ||= j(), e.tools[i] = mn(a), Object.hasOwn(n, i) || (n[i] = r);
		}
		return t.config && (e.config = {
			...e.config,
			...t.config
		}), t.callSettings && (e.callSettings = {
			...e.callSettings,
			...t.callSettings
		}), t.unstable_composerMetadata && (e.unstable_composerMetadata = {
			...e.unstable_composerMetadata,
			...t.unstable_composerMetadata
		}), e;
	}, {});
}, gn = (e, t, n) => {
	let r = (e) => {
		console.error(`[assistant-ui] ${n} listener threw an error`, e);
	};
	for (let n of e) try {
		let e = n(typeof t == "function" ? t() : t);
		e !== null && (typeof e == "object" || typeof e == "function") && "then" in e && typeof e.then == "function" && Promise.resolve(e).catch(r);
	} catch (e) {
		r(e);
	}
}, _n = (e) => e, vn = /* @__PURE__ */ new Set([
	"$$typeof",
	"nodeType",
	"then",
	"__v_raw",
	"__v_isRef",
	"__v_isReactive",
	"__v_isReadonly",
	"__v_isShallow",
	"__v_skip"
]), yn = (e, t) => {
	if (e === Symbol.toStringTag) return t;
	if (typeof e != "symbol") {
		if (e === "toJSON") return () => t;
		if (!vn.has(e)) return !1;
	}
}, bn = class {
	getOwnPropertyDescriptor(e, t) {
		let n = this.get(e, t);
		if (n !== void 0) return {
			value: n,
			writable: !1,
			enumerable: !0,
			configurable: !0
		};
	}
	set() {
		return !1;
	}
	setPrototypeOf() {
		return !1;
	}
	defineProperty() {
		return !1;
	}
	deleteProperty() {
		return !1;
	}
	preventExtensions() {
		return !1;
	}
}, xn = Symbol("assistant-ui.store.clientId"), Sn = Symbol("assistant-ui.store.instanceTag"), Cn = (e, t) => {
	let n = new Proxy((() => {}), {
		apply: () => (t(), n),
		get: (n, r) => r === "source" ? e.source : r === "query" ? e.query : r === "name" ? e.name : r === xn ? Dn(t()) : t()[r],
		has: (e, n) => n === "source" || n === "query" || n === "name" || n === xn || n in t(),
		ownKeys: () => Reflect.ownKeys(t()),
		getOwnPropertyDescriptor: (e, n) => {
			if (typeof n != "symbol" && n in t()) return {
				value: t()[n],
				writable: !1,
				enumerable: !0,
				configurable: !0
			};
		}
	});
	return n;
}, wn = (e, t) => {
	let n = () => {
		throw Error(e);
	};
	return new Proxy((() => {}), {
		apply: n,
		get: (e, r) => {
			if (r === "source" || r === "query") return null;
			if (r === "name") return t;
			if (r === xn) return n();
			let i = yn(r, "AssistantClientAccessor");
			return i === !1 ? n() : i;
		},
		has: (e, t) => t === "source" || t === "query" || t === "name",
		ownKeys: () => [],
		getOwnPropertyDescriptor: () => void 0
	});
}, Tn = (e) => e?.source != null, En = (e) => e?.source === null, Dn = (e) => e[xn] ?? e, On = (e) => e[Sn] ?? Dn(e), kn = (e) => e === "optional" || e === "subscribe" || e === "on" || e === "__proto__" || typeof e == "symbol", An = (e) => {
	let t = [];
	for (let n in e) kn(n) || t.push(n);
	return t;
}, jn = class extends bn {
	#e;
	constructor(e) {
		super(), this.#e = e;
	}
	get(e, t) {
		let n = yn(t, "OptionalAssistantClient");
		if (n !== !1) return n;
		if (kn(t)) return;
		let r = this.#e[t];
		return Tn(r) ? r : void 0;
	}
	ownKeys() {
		return An(this.#e);
	}
	has(e, t) {
		return !kn(t) && t in this.#e;
	}
}, Mn = (e) => new Proxy({}, new jn(e)), Nn = () => () => {}, Pn = "You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.", Fn = class extends bn {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t, n) {
		super(), this.#e = e, this.#t = t, this.#n = n;
	}
	get(e, t) {
		if (t === "subscribe" || t === "on") return Nn;
		if (t === "optional") return this.#r ??= Mn(this.#n());
		let n = yn(t, this.#e);
		return n === !1 ? wn(this.#t(String(t)), String(t)) : n;
	}
	ownKeys() {
		return [
			"subscribe",
			"on",
			"optional"
		];
	}
	getOwnPropertyDescriptor(e, t) {
		if (t !== "optional") return super.getOwnPropertyDescriptor(e, t);
		let n = this.get(e, t);
		if (n !== void 0) return {
			value: n,
			writable: !1,
			enumerable: !1,
			configurable: !0
		};
	}
	has(e, t) {
		return t === "subscribe" || t === "on" || t === "optional";
	}
}, In = ((e, t) => {
	let n = new Proxy({}, new Fn(e, t, () => n));
	return n;
})("DefaultAssistantClient", () => Pn), Ln = () => new Proxy({}, { get(e, t) {
	let n = yn(t, "AssistantClient");
	return n === !1 ? wn(`The current scope does not have a "${String(t)}" property.`, String(t)) : n;
} }), Rn = mt(In), zn = () => {}, Bn = /* @__PURE__ */ new WeakMap(), Vn = (e) => Bn.get(e) ?? zn, Hn = (e, t) => {
	Bn.set(e, t);
}, Un = () => gt(Rn), Wn = (e, t) => Ce(Rn, e, t), Gn = Symbol("assistant-ui.transform-scopes");
function Kn(e, t) {
	let n = e;
	if (n[Gn]) throw Error("transformScopes is already attached to this resource");
	n[Gn] = t;
}
function qn(e) {
	return e[Gn];
}
//#endregion
//#region node_modules/@assistant-ui/store/dist/types/events.js
var Jn = (e) => typeof e == "string" ? {
	scope: e.split(".")[0],
	event: e
} : {
	scope: e.scope,
	event: e.event
}, Yn = (e) => {
	console.error("NotificationManager: event listener error", e);
}, Xn = (e, t, n) => {
	try {
		let r = e(t, n);
		r !== null && (typeof r == "object" || typeof r == "function") && typeof r.then == "function" && Promise.resolve(r).catch(Yn);
	} catch (e) {
		Yn(e);
	}
}, Zn = () => {
	let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	return {
		on(n, r) {
			let i = r;
			if (n === "*") return t.add(i), () => t.delete(i);
			let a = e.get(n);
			return a || (a = /* @__PURE__ */ new Set(), e.set(n, a)), a.add(i), () => {
				a.delete(i), a.size === 0 && e.get(n) === a && e.delete(n);
			};
		},
		emit(n, r, i) {
			(e.has(n) || t.size !== 0) && queueMicrotask(() => {
				let a = e.get(n);
				if (a) for (let e of a) Xn(e, r, i);
				if (t.size > 0) {
					let e = {
						event: n,
						payload: r
					};
					for (let n of t) Xn(n, e, i);
				}
			});
		},
		subscribe(e) {
			return n.add(e), () => n.delete(e);
		},
		notifySubscribers() {
			for (let e of n) try {
				e();
			} catch (e) {
				console.error("NotificationManager: subscriber callback error", e);
			}
		}
	};
}, Qn = () => I(Zn)[0], $n = Symbol("assistant-ui.store.clientIndex"), er = (e) => e[$n], tr = mt([]), nr = () => ht(tr), rr = (e, t) => {
	let n = A(3), r = nr(), i;
	return n[0] !== e || n[1] !== r ? (i = [...r, e], n[0] = e, n[1] = r, n[2] = i) : i = n[2], Ce(tr, i, t);
}, ir = mt(null), ar = Symbol("aui.scope-effect-unapplied"), or = (e, t) => Ce(ir, e, t), sr = () => {
	let e = ht(ir);
	if (!e) throw Error("AssistantTapContext is not available");
	return e;
}, cr = () => sr().clientRef, lr = (e, t, n) => {
	let r = A(8), { clientRef: i } = sr(), a;
	r[0] !== i || r[1] !== t || r[2] !== e ? (a = () => {
		let n = i.current;
		if (n === null) throw Error("useAssistantScopeEffect ran before the client was committed. This is likely an internal bug in assistant-ui.");
		let r = () => {
			let t = i.current?.[e];
			return t !== void 0 && Tn(t) ? On(t) : void 0;
		}, a = ar, o, s = (e) => {
			if (o?.(), o = void 0, a = ar, e !== void 0) {
				let e = t();
				o = typeof e == "function" ? e : void 0;
			}
			a = e;
		};
		s(r());
		let c = n.subscribe(() => {
			let e = r();
			e !== a && s(e);
		});
		return () => {
			c(), o?.();
		};
	}, r[0] = i, r[1] = t, r[2] = e, r[3] = a) : a = r[3];
	let o;
	r[4] !== i || r[5] !== n || r[6] !== e ? (o = [
		i,
		e,
		...n
	], r[4] = i, r[5] = n, r[6] = e, r[7] = o) : o = r[7], R(a, o);
}, ur = () => {
	let e = A(3), { emit: t } = sr(), n = nr(), r;
	return e[0] !== n || e[1] !== t ? (r = (e, r) => {
		t(e, r, n);
	}, e[0] = n, e[1] = t, e[2] = r) : r = e[2], rt(r);
}, dr = mt(void 0), fr = (e, t) => {
	let n = ht(dr);
	return Ce(dr, e ?? n, t);
}, pr = () => {
	let e = A(3), [t] = I(mr), n, r;
	return e[0] === t ? (n = e[1], r = e[2]) : (n = () => () => queueMicrotask(() => t.abort()), r = [t], e[0] = t, e[1] = n, e[2] = r), ot(n, r), t.signal;
};
function mr() {
	return new AbortController();
}
//#endregion
//#region node_modules/@assistant-ui/store/dist/useClientResource.js
var hr = Symbol("assistant-ui.store.getValue"), gr = (e) => {
	let t = e[hr];
	if (!t) throw Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
	return t.getState?.();
}, _r = /* @__PURE__ */ new Map();
function vr(e) {
	let t = _r.get(e);
	return t || (t = function(...t) {
		if (!this || typeof this != "object") throw Error(`Method "${String(e)}" called without proper context. This may indicate the function was called incorrectly.`);
		let n = this[hr];
		if (!n) throw Error(`Method "${String(e)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
		let r = n[e];
		if (!r) throw Error(`Method "${String(e)}" is not implemented.`);
		if (typeof r != "function") throw Error(`"${String(e)}" is not a function.`);
		return r(...t);
	}, _r.set(e, t)), t;
}
var yr = class extends bn {
	boundFns;
	cachedReceiver;
	outputRef;
	tagRef;
	index;
	constructor(e, t, n) {
		super(), this.outputRef = e, this.tagRef = t, this.index = n;
	}
	get(e, t, n) {
		if (t === hr) return this.outputRef.current;
		if (t === $n) return this.index;
		if (t === Sn) return this.tagRef.current;
		let r = yn(t, "ClientProxy");
		if (r !== !1) return r;
		let i = this.outputRef.current[t];
		if (typeof i == "function") {
			if (n === void 0) return i;
			(!this.boundFns || this.cachedReceiver !== n) && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = n);
			let e = this.boundFns.get(t);
			return e || (e = vr(t).bind(n), this.boundFns.set(t, e)), e;
		}
		return i;
	}
	ownKeys() {
		return Object.keys(this.outputRef.current);
	}
	has(e, t) {
		return t === hr || t === $n || t === Sn || t in this.outputRef.current;
	}
}, br = (e) => {
	let t = L(null), n = L(null), r = et(() => ({}), [e.hook, e.key]), i = nr().length, a = et(() => new Proxy({}, new yr(t, n, i)), [i]), o = rr(a, function() {
		return an(e);
	});
	return t.current || (t.current = o, n.current = r), R(() => {
		t.current = o, n.current = r;
	}), {
		methods: a,
		state: o.getState?.(),
		key: e.key
	};
}, xr = _t(br), Sr = (e, t) => {
	if (Array.isArray(e) !== Array.isArray(t)) return !1;
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return !1;
		for (let n = 0; n < e.length; n++) if (!Object.is(e[n], t[n])) return !1;
		return !0;
	}
	let n = Object.keys(e);
	return n.length === Object.keys(t).length && n.every((n) => Object.hasOwn(t, n) && Object.is(e[n], t[n]));
}, Cr = (e) => {
	let t = et(() => ({}), []);
	return t.v !== void 0 && Sr(t.v, e) ? t.v : (t.v = e, e);
}, wr = (e) => {
	let t = A(2), n = L(void 0), r;
	return t[0] === e ? r = t[1] : (r = (t) => {
		let r = e(t);
		return n.current !== void 0 && Sr(n.current, r) ? n.current : (n.current = r, r);
	}, t[0] = e, t[1] = r), r;
}, Tr = (() => {
	try {
		return !1;
	} catch {
		return !1;
	}
})(), Er = (e, t) => {
	let n = { ...e }, r = /* @__PURE__ */ new Set(), i = !0;
	for (; i;) {
		i = !1;
		for (let e of Object.values(n)) {
			if (r.has(e.hook)) continue;
			r.add(e.hook);
			let a = qn(e.hook);
			if (a) {
				a(n, t), i = !0;
				break;
			}
		}
	}
	return n;
}, Dr = (e) => e.hook === Zr, Or = (e) => {
	if (!Dr(e)) return {
		source: "root",
		query: {}
	};
	let t = e.args[0];
	return {
		source: t.source,
		query: t.query ?? {}
	};
}, kr = Symbol.for("aui.event-receiver-ref"), Ar = (e, t) => {
	let n = e === In ? Ln() : e, r = Object.create(n);
	Object.assign(r, t);
	let i;
	return Object.defineProperty(r, "optional", {
		get: () => i ??= Mn(r),
		enumerable: !1
	}), r;
}, jr = ({ notifications: e, clientRef: t }) => et(() => ({
	subscribe: e.subscribe,
	on: function(n, r) {
		if (!this) throw Error("const { on } = useAui() is not supported. Use aui.on() instead.");
		let { scope: i, event: a } = Jn(n), o = n[kr];
		if (i !== "*" && !o && En(this[i])) throw Error(`Scope "${i}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
		let s = e.on(a, (e, n) => {
			if (i === "*") return r(e);
			let a = ((o ?? t).current ?? this)[i];
			if (!Tn(a)) return;
			let s = Dn(a);
			if (s === n[er(s)]) return r(e);
		});
		if (i !== "*") {
			if (o) {
				if (t.parent === In) return s;
			} else if (En(t.parent[i])) return s;
		}
		let c = t.parent.on(n, r);
		return () => {
			s(), c();
		};
	}
}), [e, t]), Mr = (e) => {
	let t = A(5), n;
	t[0] === e ? n = t[1] : (n = Or(e), t[0] = e, t[1] = n);
	let { source: r, query: i } = n, a = Cr(i), o;
	return t[2] !== r || t[3] !== a ? (o = {
		source: r,
		query: a
	}, t[2] = r, t[3] = a, t[4] = o) : o = t[4], Cr(o);
}, Nr = (e, t) => {
	let n = A(3), r;
	return n[0] !== t || n[1] !== e ? (r = t ? e : xr(e), n[0] = t, n[1] = e, n[2] = r) : r = n[2], an(r);
}, Pr = _t((e, t) => {
	let n = Un(), r = Dr(t), i = Nr(t, r), a = r ? i : i.methods, o = Mr(t), s = et(() => Cn({
		name: e,
		...o
	}, () => a), [
		e,
		o,
		a
	]);
	return n[e] = s, s;
}), Fr = (e) => {
	let t = A(2), n;
	return t[0] === e ? n = t[1] : (n = e.map(Kr), t[0] = e, t[1] = n), ln(n);
}, Ir = (e, t) => {
	let n = Cr(t), r = et(() => ({}), []);
	return r.deps !== n && (r.deps = n, r.client = e), r.client;
}, Lr = ({ parent: e, entries: t, clientRef: n, notifications: r }) => {
	let i = Ar(e, jr({
		notifications: r,
		clientRef: n
	}));
	return { client: Ir(i, [e, ...or({
		clientRef: n,
		emit: r.emit
	}, function() {
		return Wn(i, function() {
			return Fr(t);
		});
	})]) };
}, Rr = ({ parent: e, entries: t, destroySignal: n }) => {
	let r = L({
		parent: e,
		current: null
	}).current, { value: i, effects: a } = dn(function() {
		let i = Qn(), { client: a } = fr(n, function() {
			return Lr({
				parent: e,
				entries: t,
				clientRef: r,
				notifications: i
			});
		});
		return R(() => e.subscribe(i.notifySubscribers), [e, i]), R(() => i.notifySubscribers()), a;
	});
	return ot(() => {
		r.parent = e, r.current = i;
	}, [
		i,
		e,
		r
	]), {
		client: i,
		effects: a
	};
}, zr = ({ parent: e, entries: t, destroySignal: n }) => {
	let r = L({
		parent: e,
		current: null
	}).current, { value: i, effects: a } = dn(function() {
		let i = Qn(), a = $t(function() {
			return fr(n, function() {
				return Lr({
					parent: e,
					entries: t,
					clientRef: r,
					notifications: i
				});
			});
		}), o = it(a.subscribe, () => a.getValue().client, () => a.getValue().client);
		return R(() => {
			let t = () => At(() => {
				r.current = a.getValue().client, i.notifySubscribers();
			}), n = a.subscribe(t), o = e.subscribe(t);
			return () => {
				n(), o();
			};
		}, [
			a,
			e,
			i
		]), o;
	});
	return ot(() => {
		r.parent = e, r.current = i;
	}, [
		i,
		e,
		r
	]), {
		client: i,
		effects: a
	};
}, Br = (e, t, n, r) => {
	let { get: i } = r.args[0], a = it(e.subscribe, () => i(e), () => i(e)), o = Mr(r), s = et(() => Cn({
		name: n,
		...o
	}, () => a), [
		n,
		o,
		a
	]);
	return t[n] = s, s;
}, Vr = (e, t) => {
	if (Tr) {
		let [e] = I(() => t.map(([e]) => e).join(",")), n = t.find(([, e]) => !Dr(e));
		if (n) throw Error(`Scope "${n[0]}" is a root scope but this useAui mounted derived-only; remount with a new key to change scope kinds.`);
		let r = t.map(([e]) => e).join(",");
		if (r !== e) throw Error(`A derived-only config mounted scopes [${e}] but now has [${r}]; remount with a new key to change the scope set.`);
	}
	let n = L({
		parent: e,
		current: null
	}).current, r = Ar(e, {
		subscribe: e.subscribe,
		on: function(t, r) {
			if (!this) throw Error("const { on } = useAui() is not supported. Use aui.on() instead.");
			let { scope: i, event: a } = Jn(t);
			if (i === "*") return e.on(t, r);
			let o = t[kr];
			if (!o && En(this[i])) throw Error(`Scope "${i}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
			return e.on({
				scope: i,
				event: a,
				[kr]: o ?? n
			}, r);
		}
	}), i = Ir(r, [e, ...t.map(([t, n]) => Br(e, r, t, n))]);
	return ot(() => {
		n.parent = e, n.current = i;
	}, [
		i,
		e,
		n
	]), i;
}, Hr = (e, t) => {
	let n = A(8), r;
	n[0] !== t || n[1] !== e ? (r = Object.entries(Er(t, e)), n[0] = t, n[1] = e, n[2] = r) : r = n[2];
	let i = r, a;
	n[3] === i ? a = n[4] : (a = () => i.length === 0 || i.some(qr), n[3] = i, n[4] = a);
	let [o] = I(a), s;
	return n[5] !== i || n[6] !== o ? (s = {
		entries: i,
		rooted: o
	}, n[5] = i, n[6] = o, n[7] = s) : s = n[7], s;
}, Ur = (e, t, n, r) => {
	let { entries: i, rooted: a } = Hr(e, t);
	return a ? n({
		parent: e,
		entries: i,
		destroySignal: r
	}) : { client: Vr(e, i) };
}, Wr = (e, t, n) => Ur(e, t, Rr, n);
function Gr(e) {
	let t = Un();
	if (e) {
		let { client: n, effects: r } = Ur(t, e, zr, pr());
		return r && Hn(n, r), n;
	}
	return t;
}
function Kr(e) {
	let [t, n] = e;
	return vt(t, Pr(t, n));
}
function qr(e) {
	let [, t] = e;
	return !Dr(t);
}
//#endregion
//#region node_modules/@assistant-ui/store/dist/utils/proxied-assistant-state.js
var Jr = (e) => {
	let t;
	class n extends bn {
		get(t, n) {
			let r = yn(n, "OptionalAssistantState");
			if (r !== !1) return r;
			let i = n;
			if (!kn(i) && Tn(e[i])) return gr(e[i]());
		}
		ownKeys() {
			return An(e);
		}
		has(t, n) {
			return !kn(n) && n in e;
		}
	}
	class r extends bn {
		get(r, i) {
			let a = yn(i, "AssistantState");
			if (a !== !1) return a;
			if (i === "optional") return t ??= new Proxy({}, new n());
			let o = i;
			if (!kn(o)) return gr(e[o]());
		}
		ownKeys() {
			return [...An(e), "optional"];
		}
		has(t, n) {
			return n === "optional" || !kn(n) && n in e;
		}
	}
	return new Proxy({}, new r());
}, Yr = /* @__PURE__ */ new WeakMap(), Xr = (e) => {
	let t = Yr.get(e);
	return t || (t = Jr(e), Yr.set(e, t)), t;
}, B = (e) => {
	let t = A(6), n = Gr(), r;
	t[0] === n ? r = t[1] : (r = Xr(n), t[0] = n, t[1] = r);
	let i = r, a, o;
	t[2] !== i || t[3] !== e ? (a = () => e(i), o = () => e(i), t[2] = i, t[3] = e, t[4] = a, t[5] = o) : (a = t[4], o = t[5]);
	let s = it(n.subscribe, a, o);
	if (typeof s == "object" && s && (s === i || s === i.optional)) throw Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
	return at(s), s;
}, Zr = (e) => {
	let t = A(3), { get: n } = e, r = Gr(), i;
	return t[0] !== r || t[1] !== n ? (i = () => n(r), t[0] = r, t[1] = n, t[2] = i) : i = t[2], B(i);
}, Qr = _t(Zr), $r = (e) => {
	if (e.key === void 0) throw Error("useClientLookup: Element has no key");
	return e.key;
};
function ei(e) {
	let t = A(12), n;
	t[0] === e ? n = t[1] : (n = e.map(ri), t[0] = e, t[1] = n);
	let r = ln(n), i;
	t[2] === e ? i = t[3] : (i = e.reduce(ni, Object.create(null)), t[2] = e, t[3] = i);
	let a = i, o;
	t[4] === r ? o = t[5] : (o = r.map(ti), t[4] = r, t[5] = o);
	let s = o, c;
	t[6] !== a || t[7] !== r ? (c = (e) => {
		if ("index" in e) {
			if (e.index < 0 || e.index >= r.length) throw Error(`useClientLookup: index ${e.index} out of bounds (length: ${r.length}) (ignore if recovered)`);
			return r[e.index].methods;
		}
		let t = a[e.key];
		if (t === void 0) throw Error(`useClientLookup: key "${e.key}" not found (ignore if recovered)`);
		return r[t].methods;
	}, t[6] = a, t[7] = r, t[8] = c) : c = t[8];
	let l;
	return t[9] !== s || t[10] !== c ? (l = {
		state: s,
		get: c
	}, t[9] = s, t[10] = c, t[11] = l) : l = t[11], l;
}
function ti(e) {
	return e.state;
}
function ni(e, t, n) {
	return e[$r(t)] = n, e;
}
function ri(e) {
	return vt($r(e), xr(e), e.deps);
}
//#endregion
//#region node_modules/@assistant-ui/store/dist/utils/viewport-scroll.js
var ii = (e, t = 0) => t === 0 ? Math.abs(e.scrollHeight - e.scrollTop - e.clientHeight) <= 1 || e.scrollHeight <= e.clientHeight : e.scrollHeight - t - e.scrollTop - e.clientHeight <= 1 || e.scrollHeight - t <= e.clientHeight, ai = (e, t = 0) => t === 0 ? e.scrollHeight > e.clientHeight + 1 : e.scrollHeight - t > e.clientHeight + 1, oi = (e, t) => e.scrollTop > t.scrollTop && e.scrollHeight === t.scrollHeight, si = Symbol("skip-update"), ci = (e, ...t) => {
	let n = [];
	for (let r of e) try {
		r(...t);
	} catch (e) {
		n.push(e);
	}
	if (n.length === 1) throw n[0];
	if (n.length > 1) {
		for (let e of n) console.error(e);
		throw AggregateError(n);
	}
}, li = (e) => {
	ci(e);
}, ui = (e, t) => e === void 0 || t === void 0 ? e === t : Sr(e, t), di = class {
	_subscribers = /* @__PURE__ */ new Set();
	subscribe(e) {
		return this._subscribers.add(e), () => this._subscribers.delete(e);
	}
	waitForUpdate() {
		return new Promise((e) => {
			let t = this.subscribe(() => {
				t(), e();
			});
		});
	}
	_notifySubscribers() {
		ci(this._subscribers);
	}
}, fi = class {
	_subscriptions = /* @__PURE__ */ new Set();
	_connection;
	get isConnected() {
		return !!this._connection;
	}
	notifySubscribers(e, t) {
		if (t) {
			gn(this._subscriptions, e, t);
			return;
		}
		ci(this._subscriptions, e);
	}
	_updateConnection() {
		if (this._subscriptions.size > 0) {
			if (this._connection) return;
			this._connection = this._connect();
		} else {
			let e = this._connection;
			this._connection = void 0, e?.();
		}
	}
	subscribe(e) {
		return this._subscriptions.add(e), this._updateConnection(), () => {
			this._subscriptions.delete(e), this._updateConnection();
		};
	}
}, pi = class extends fi {
	get path() {
		return this.binding.path;
	}
	binding;
	constructor(e) {
		super(), this.binding = e;
		let t = e.getState();
		if (t === si) throw Error("Entry not available in the store");
		this._previousState = t;
	}
	_previousState;
	getState = () => (this.isConnected || this._syncState(), this._previousState);
	_syncState() {
		let e = this.binding.getState();
		return e === si || ui(e, this._previousState) ? !1 : (this._previousState = e, !0);
	}
	_connect() {
		let e = this.binding.subscribe(() => {
			this._syncState() && this.notifySubscribers();
		});
		return this._syncState(), e;
	}
}, mi = class extends fi {
	get path() {
		return this.binding.path;
	}
	binding;
	constructor(e) {
		super(), this.binding = e;
	}
	_previousStateDirty = !0;
	_previousState;
	getState = () => {
		if (!this.isConnected || this._previousStateDirty) {
			let e = this.binding.getState();
			e !== si && (this._previousState === void 0 || !ui(e, this._previousState)) && (this._previousState = e), this._previousStateDirty = !1;
		}
		if (this._previousState === void 0) throw Error("Entry not available in the store");
		return this._previousState;
	};
	_connect() {
		let e = this.binding.subscribe(() => {
			this._previousStateDirty = !0, this.notifySubscribers();
		});
		return this._previousStateDirty = !0, e;
	}
}, hi = class extends fi {
	get path() {
		return this.binding.path;
	}
	binding;
	constructor(e) {
		super(), this.binding = e;
	}
	getState() {
		return this.binding.getState();
	}
	outerSubscribe(e) {
		return this.binding.subscribe(e);
	}
	_connect() {
		let e = () => {
			this.notifySubscribers();
		}, t = this.binding.getState(), n = t?.subscribe(e), r = this.outerSubscribe(() => {
			let r = this.binding.getState();
			if (r === t) return;
			t = r;
			let i = n;
			n = void 0;
			try {
				i?.();
			} finally {
				n = r?.subscribe(e), e();
			}
		});
		return () => li([() => r?.(), () => n?.()]);
	}
}, gi = class extends fi {
	config;
	constructor(e) {
		super(), this.config = e;
	}
	getState() {
		return this.config.binding.getState();
	}
	outerSubscribe(e) {
		return this.config.binding.subscribe(e);
	}
	_connect() {
		let e = `Runtime event "${this.config.event}"`, t = (t) => {
			this.notifySubscribers(t, e);
		}, n = this.config.binding.getState(), r = n?.unstable_on(this.config.event, t), i = this.outerSubscribe(() => {
			let e = this.config.binding.getState();
			if (e === n) return;
			n = e;
			let i = r;
			r = void 0;
			try {
				i?.();
			} finally {
				r = e?.unstable_on(this.config.event, t);
			}
		});
		return () => li([() => i?.(), () => r?.()]);
	}
}, _i = class {
	_providers = /* @__PURE__ */ new Map();
	_providerUnsubscribes = /* @__PURE__ */ new Map();
	getModelContext() {
		return hn(new Set(this._providers.values()));
	}
	registerModelContextProvider(e) {
		let t = Symbol();
		this._providers.set(t, e);
		let n;
		try {
			n = e.subscribe?.(() => {
				this.notifySubscribers();
			});
		} catch (e) {
			this._providers.delete(t);
			try {
				this.notifySubscribers();
			} catch (e) {
				console.error(e);
			}
			throw e;
		}
		this._providerUnsubscribes.set(t, n), this.notifySubscribers();
		let r = !1;
		return () => {
			if (r) return;
			r = !0, this._providers.delete(t);
			let e = this._providerUnsubscribes.get(t);
			this._providerUnsubscribes.delete(t);
			let n = !1, i, a = (e) => {
				try {
					e();
				} catch (e) {
					n ? console.error(e) : (n = !0, i = e);
				}
			};
			if (e && a(e), a(() => this.notifySubscribers()), n) throw i;
		};
	}
	_subscribers = /* @__PURE__ */ new Set();
	notifySubscribers() {
		ci(this._subscribers);
	}
	subscribe(e) {
		return this._subscribers.add(e), () => {
			this._subscribers.delete(e);
		};
	}
}, vi = [], yi = {
	modelName: void 0,
	toolNames: vi
}, bi = (e, t) => e === t || Sr(e, t), xi = (e, t) => {
	let n = e.getModelContext(), r = n.config?.modelName, i = n.tools ? Object.keys(n.tools).sort() : vi, a = i.length ? i : vi;
	return r === t.modelName && bi(a, t.toolNames) ? t : {
		modelName: r,
		toolNames: a
	};
}, Si = _t(() => {
	let e = A(11), t;
	e[0] === Symbol.for("react.memo_cache_sentinel") ? (t = new _i(), e[0] = t) : t = e[0];
	let n = t, r;
	e[1] === Symbol.for("react.memo_cache_sentinel") ? (r = () => xi(n, yi), e[1] = r) : r = e[1];
	let [i, a] = I(r), o, s;
	e[2] === Symbol.for("react.memo_cache_sentinel") ? (o = () => (a((e) => xi(n, e)), n.subscribe(() => {
		a((e) => xi(n, e));
	})), s = [n], e[2] = o, e[3] = s) : (o = e[2], s = e[3]), R(o, s);
	let c;
	e[4] === i ? c = e[5] : (c = () => xi(n, i), e[4] = i, e[5] = c);
	let l, u, d;
	e[6] === Symbol.for("react.memo_cache_sentinel") ? (l = () => n.getModelContext(), u = (e) => n.subscribe(e), d = (e) => n.registerModelContextProvider(e), e[6] = l, e[7] = u, e[8] = d) : (l = e[6], u = e[7], d = e[8]);
	let f;
	return e[9] === c ? f = e[10] : (f = {
		getState: c,
		getModelContext: l,
		subscribe: u,
		register: d
	}, e[9] = c, e[10] = f), f;
}), Ci = (e, t) => {
	if (t.status?.type !== "running" && t.status?.type !== "requires-action") {
		let n = e.complete;
		return typeof n == "function" ? n({
			args: t.args,
			result: t.result
		}) : n ?? null;
	}
	let n = e.running;
	return typeof n == "function" ? n({ args: t.args }) : n ?? null;
}, wi = (e) => e.display === void 0 ? e.type === "human" : e.display === "standalone", Ti = (e) => function(t) {
	return Ci(e, t);
}, Ei = (e) => {
	let t = A(16), { toolkit: n, mcpApp: r } = e, i;
	t[0] === r ? i = t[1] : (i = r ? [vt("mcpApp", r)] : [], t[0] = r, t[1] = i);
	let a = ln(i)[0], [o, s] = I(Oi), c;
	t[2] !== a || t[3] !== o ? (c = {
		toolUIs: o,
		mcpApp: a
	}, t[2] = a, t[3] = o, t[4] = c) : c = t[4];
	let l = c, u = cr(), d;
	t[5] === Symbol.for("react.memo_cache_sentinel") ? (d = (e, t, n) => {
		let r = {
			render: t,
			renderText: n?.renderText,
			standalone: n?.standalone ?? !1
		};
		return s((t) => {
			let n = j(t);
			return n[e] = [...n[e] ?? [], r], n;
		}), () => {
			s((t) => {
				let n = t[e]?.filter((e) => e !== r) ?? [], i = j(t);
				return n.length > 0 ? (i[e] = n, i) : (delete i[e], i);
			});
		};
	}, t[5] = d) : d = t[5];
	let f = d, p, m;
	t[6] === n ? (p = t[7], m = t[8]) : (p = () => {
		if (!n) return;
		let e = [];
		for (let [t, r] of Object.entries(n)) {
			let n = "render" in r ? r.render : void 0, i = "renderText" in r ? r.renderText : void 0, a = n ?? (i ? Ti(i) : void 0);
			a && e.push(f(t, a, {
				standalone: wi(r),
				renderText: i
			}));
		}
		return () => {
			e.forEach(ki);
		};
	}, m = [n, f], t[6] = n, t[7] = p, t[8] = m), R(p, m);
	let h;
	t[9] !== u || t[10] !== n ? (h = () => {
		if (!n) return;
		let e = Object.entries(n).reduce(Ai, j());
		return u.current.modelContext().register({ getModelContext: () => ({ tools: e }) });
	}, t[9] = u, t[10] = n, t[11] = h) : h = t[11];
	let g;
	t[12] === n ? g = t[13] : (g = [n], t[12] = n, t[13] = g), lr("modelContext", h, g);
	let _;
	return t[14] === l ? _ = t[15] : (_ = {
		getState: () => l,
		setToolUI: f
	}, t[14] = l, t[15] = _), _;
}, Di = _t(Ei);
Kn(Ei, (e, t) => {
	!e.modelContext && t.modelContext.source === null && (e.modelContext = Si());
});
function Oi() {
	return j();
}
function ki(e) {
	return e();
}
function Ai(e, t) {
	let [n, r] = t;
	if (r.type === "mcp") return e;
	let { display: i, render: a, renderText: o, ...s } = r;
	return e[n] = s, e;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/store/runtime-clients/useSubscribable.js
var ji = (e) => it(e.subscribe, e.getState, e.getServerSnapshot), Mi = Symbol.for("assistant-ui.silent-runtime-action"), Ni = (e) => typeof e == "object" && !!e && Mi in e, Pi = (e, t) => {
	let n = t();
	return n.catch((t) => {
		Ni(t) || console.error(`[assistant-ui] ${e} failed:`, t);
	}), n;
}, Fi = _t((e) => {
	let t = A(9), { runtime: n } = e, r = ji(n), i;
	t[0] === r ? i = t[1] : (i = () => r, t[0] = r, t[1] = i);
	let a, o;
	t[2] === n ? (a = t[3], o = t[4]) : (a = () => Pi("attachment remove", n.remove), o = () => n, t[2] = n, t[3] = a, t[4] = o);
	let s;
	return t[5] !== i || t[6] !== a || t[7] !== o ? (s = {
		getState: i,
		remove: a,
		__internal_getRuntime: o
	}, t[5] = i, t[6] = a, t[7] = o, t[8] = s) : s = t[8], s;
}), Ii = _t((e) => {
	let t = A(5), { runtime: n, index: r } = e, i;
	t[0] !== r || t[1] !== n ? (i = n.getAttachmentByIndex(r), t[0] = r, t[1] = n, t[2] = i) : i = t[2];
	let a = i, o;
	return t[3] === a ? o = t[4] : (o = Fi({ runtime: a }), t[3] = a, t[4] = o), an(o);
}), Li = _t(({ item: e, onMove: t, onRemove: n }) => ({
	getState: () => e,
	steer: () => t({
		lane: "steer",
		insertAfter: null
	}),
	move: t,
	remove: n
})), Ri = _t((e) => {
	let t = A(63), { threadIdRef: n, messageIdRef: r, runtime: i, isSuggestion: a } = e, o = ji(i), s = ur(), c = L(!1), l, u;
	t[0] !== s || t[1] !== r || t[2] !== i || t[3] !== n ? (l = () => {
		let e = [], t = i.unstable_on("send", (e) => {
			let t = c.current;
			c.current = !1, s("composer.send", {
				threadId: n.current,
				...r && { messageId: r.current },
				chars: e.chars,
				attachments: e.attachments,
				...t ? { suggestion: !0 } : void 0
			});
		});
		e.push(t);
		let a = i.unstable_on("attachmentAdd", (e) => {
			s("composer.attachmentAdd", {
				threadId: n.current,
				...r && { messageId: r.current },
				...e.contentType ? { contentType: e.contentType } : void 0
			});
		});
		return e.push(a), e.push(i.unstable_on("attachmentAddError", (e) => {
			s("composer.attachmentAddError", {
				threadId: n.current,
				...r && { messageId: r.current },
				...e.attachmentId && { attachmentId: e.attachmentId },
				reason: e.reason,
				message: e.message,
				...e.contentType ? { contentType: e.contentType } : void 0
			});
		})), () => {
			for (let t of e) t();
		};
	}, u = [
		i,
		s,
		n,
		r
	], t[0] = s, t[1] = r, t[2] = i, t[3] = n, t[4] = l, t[5] = u) : (l = t[4], u = t[5]), R(l, u);
	let d;
	if (t[6] !== i || t[7] !== o.attachments) {
		let e;
		t[9] === i ? e = t[10] : (e = (e, t) => vt(e.id, Ii({
			runtime: i,
			index: t
		}), [i, t]), t[9] = i, t[10] = e), d = o.attachments.map(e), t[6] = i, t[7] = o.attachments, t[8] = d;
	} else d = t[8];
	let f = ei(d), p = o.queue, m;
	if (t[11] !== p || t[12] !== i) {
		let e;
		t[14] === i ? e = t[15] : (e = (e) => vt(e.id, Li({
			item: e,
			onMove: (t) => i.moveQueueItem(e.id, t),
			onRemove: () => i.removeQueueItem(e.id)
		})), t[14] = i, t[15] = e), m = p.map(e), t[11] = p, t[12] = i, t[13] = m;
	} else m = t[13];
	let h = ei(m), g = o.type ?? "thread", _;
	t[16] !== f.state || t[17] !== p || t[18] !== o.attachmentAccept || t[19] !== o.canCancel || t[20] !== o.canSend || t[21] !== o.dictation || t[22] !== o.isEditing || t[23] !== o.isEmpty || t[24] !== o.quote || t[25] !== o.role || t[26] !== o.runConfig || t[27] !== o.text || t[28] !== g ? (_ = {
		text: o.text,
		role: o.role,
		attachments: f.state,
		runConfig: o.runConfig,
		isEditing: o.isEditing,
		canCancel: o.canCancel,
		canSend: o.canSend,
		attachmentAccept: o.attachmentAccept,
		isEmpty: o.isEmpty,
		type: g,
		dictation: o.dictation,
		quote: o.quote,
		queue: p
	}, t[16] = f.state, t[17] = p, t[18] = o.attachmentAccept, t[19] = o.canCancel, t[20] = o.canSend, t[21] = o.dictation, t[22] = o.isEditing, t[23] = o.isEmpty, t[24] = o.quote, t[25] = o.role, t[26] = o.runConfig, t[27] = o.text, t[28] = g, t[29] = _) : _ = t[29];
	let v = _, y;
	t[30] === v ? y = t[31] : (y = () => v, t[30] = v, t[31] = y);
	let b;
	t[32] !== a || t[33] !== i ? (b = (e) => {
		let t = i.getState();
		c.current = t.canSend && (a?.(t.text) ?? !1), i.send(e);
	}, t[32] = a, t[33] = i, t[34] = b) : b = t[34];
	let x;
	t[35] !== s || t[36] !== r || t[37] !== i || t[38] !== n ? (x = () => {
		!r && i.getState().canCancel && s("composer.cancel", { threadId: n.current }), i.cancel();
	}, t[35] = s, t[36] = r, t[37] = i, t[38] = n, t[39] = x) : x = t[39];
	let S = i.beginEdit ?? zi, C;
	t[40] === f ? C = t[41] : (C = (e) => "id" in e ? f.get({ key: e.id }) : f.get(e), t[40] = f, t[41] = C);
	let w;
	t[42] === h ? w = t[43] : (w = (e) => "id" in e ? h.get({ key: e.id }) : h.get(e), t[42] = h, t[43] = w);
	let T;
	t[44] === i ? T = t[45] : (T = () => i, t[44] = i, t[45] = T);
	let ee;
	return t[46] !== i.addAttachment || t[47] !== i.clearAttachments || t[48] !== i.reset || t[49] !== i.setQuote || t[50] !== i.setRole || t[51] !== i.setRunConfig || t[52] !== i.setText || t[53] !== i.startDictation || t[54] !== i.stopDictation || t[55] !== S || t[56] !== C || t[57] !== w || t[58] !== T || t[59] !== y || t[60] !== b || t[61] !== x ? (ee = {
		getState: y,
		setText: i.setText,
		setRole: i.setRole,
		setRunConfig: i.setRunConfig,
		addAttachment: i.addAttachment,
		reset: i.reset,
		clearAttachments: i.clearAttachments,
		send: b,
		cancel: x,
		beginEdit: S,
		startDictation: i.startDictation,
		stopDictation: i.stopDictation,
		setQuote: i.setQuote,
		attachment: C,
		queueItem: w,
		__internal_getRuntime: T
	}, t[46] = i.addAttachment, t[47] = i.clearAttachments, t[48] = i.reset, t[49] = i.setQuote, t[50] = i.setRole, t[51] = i.setRunConfig, t[52] = i.setText, t[53] = i.startDictation, t[54] = i.stopDictation, t[55] = S, t[56] = C, t[57] = w, t[58] = T, t[59] = y, t[60] = b, t[61] = x, t[62] = ee) : ee = t[62], ee;
});
function zi() {
	throw Error("beginEdit is not supported in this runtime");
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/store/runtime-clients/liveRef.js
var Bi = (e) => ({ get current() {
	return e();
} }), Vi = _t((e) => {
	let t = A(13), { runtime: n } = e, r = ji(n), i;
	t[0] === r ? i = t[1] : (i = () => r, t[0] = r, t[1] = i);
	let a, o, s, c;
	t[2] === n ? (a = t[3], o = t[4], s = t[5], c = t[6]) : (a = (e) => n.addToolResult(e), o = (e) => n.resumeToolCall(e), s = (e) => n.respondToToolApproval(e), c = () => n, t[2] = n, t[3] = a, t[4] = o, t[5] = s, t[6] = c);
	let l;
	return t[7] !== i || t[8] !== a || t[9] !== o || t[10] !== s || t[11] !== c ? (l = {
		getState: i,
		addToolResult: a,
		resumeToolCall: o,
		respondToToolApproval: s,
		__internal_getRuntime: c
	}, t[7] = i, t[8] = a, t[9] = o, t[10] = s, t[11] = c, t[12] = l) : l = t[12], l;
}), Hi = _t((e) => {
	let t = A(5), { runtime: n, index: r } = e, i;
	t[0] !== r || t[1] !== n ? (i = n.getAttachmentByIndex(r), t[0] = r, t[1] = n, t[2] = i) : i = t[2];
	let a = i, o;
	return t[3] === a ? o = t[4] : (o = Fi({ runtime: a }), t[3] = a, t[4] = o), an(o);
}), Ui = _t((e) => {
	let t = A(5), { runtime: n, index: r } = e, i;
	t[0] !== r || t[1] !== n ? (i = n.getMessagePartByIndex(r), t[0] = r, t[1] = n, t[2] = i) : i = t[2];
	let a = i, o;
	return t[3] === a ? o = t[4] : (o = Vi({ runtime: a }), t[3] = a, t[4] = o), an(o);
}), Wi = _t((e) => {
	let t = A(74), { runtime: n, threadIdRef: r, threadId: i } = e, a = ji(n), o = ur(), [s, c] = I(!1), [l, u] = I(!1), d;
	t[0] === n ? d = t[1] : (d = Bi(() => n.getState().id), t[0] = n, t[1] = d);
	let f = d, p = L(a.status), m;
	t[2] !== o || t[3] !== n || t[4] !== i ? (m = (e) => {
		o(e, {
			threadId: i,
			messageId: n.getState().id
		});
	}, t[2] = o, t[3] = n, t[4] = i, t[5] = m) : m = t[5];
	let h = m, g, _;
	t[6] !== o || t[7] !== a.id || t[8] !== a.status || t[9] !== i ? (g = () => {
		let e = a.status, t = p.current;
		p.current = e, e?.type === "incomplete" && e.reason === "error" && (t?.type !== "incomplete" || t.reason !== "error") && o("message.error", {
			threadId: i,
			messageId: a.id,
			reason: "error"
		});
	}, _ = [
		a.status,
		a.id,
		o,
		i
	], t[6] = o, t[7] = a.id, t[8] = a.status, t[9] = i, t[10] = g, t[11] = _) : (g = t[10], _ = t[11]), R(g, _);
	let v;
	t[12] !== f || t[13] !== n.composer || t[14] !== r ? (v = Ri({
		runtime: n.composer,
		threadIdRef: r,
		messageIdRef: f
	}), t[12] = f, t[13] = n.composer, t[14] = r, t[15] = v) : v = t[15];
	let y = br(v), b;
	if (t[16] !== n || t[17] !== a.content) {
		let e;
		t[19] === n ? e = t[20] : (e = (e, t) => vt("toolCallId" in e && e.toolCallId != null ? `toolCallId-${e.toolCallId}` : `index-${t}`, Ui({
			runtime: n,
			index: t
		}), [n, t]), t[19] = n, t[20] = e), b = a.content.map(e), t[16] = n, t[17] = a.content, t[18] = b;
	} else b = t[18];
	let x = ei(b), S;
	t[21] === a.attachments ? S = t[22] : (S = a.attachments ?? [], t[21] = a.attachments, t[22] = S);
	let C;
	if (t[23] !== n || t[24] !== S) {
		let e;
		t[26] === n ? e = t[27] : (e = (e, t) => vt(e.id, Hi({
			runtime: n,
			index: t
		}), [n, t]), t[26] = n, t[27] = e), C = S.map(e), t[23] = n, t[24] = S, t[25] = C;
	} else C = t[25];
	let w = ei(C), T = a, ee;
	t[28] !== y.state || t[29] !== s || t[30] !== l || t[31] !== x.state || t[32] !== T ? (ee = {
		...T,
		parts: x.state,
		composer: y.state,
		isCopied: s,
		isHovering: l
	}, t[28] = y.state, t[29] = s, t[30] = l, t[31] = x.state, t[32] = T, t[33] = ee) : ee = t[33];
	let E = ee, te;
	t[34] === E ? te = t[35] : (te = () => E, t[34] = E, t[35] = te);
	let ne;
	t[36] === y.methods ? ne = t[37] : (ne = () => y.methods, t[36] = y.methods, t[37] = ne);
	let re;
	t[38] === n ? re = t[39] : (re = () => n.delete(), t[38] = n, t[39] = re);
	let D, ie;
	t[40] !== h || t[41] !== n ? (D = (e) => (h("message.reload"), n.reload(e)), ie = () => (h("message.speak"), n.speak()), t[40] = h, t[41] = n, t[42] = D, t[43] = ie) : (D = t[42], ie = t[43]);
	let O, ae;
	t[44] === n ? (O = t[45], ae = t[46]) : (O = () => n.stopSpeaking(), ae = (e) => n.submitFeedback(e), t[44] = n, t[45] = O, t[46] = ae);
	let k;
	t[47] !== h || t[48] !== n ? (k = (e) => (h("message.branchSwitched"), n.switchToBranch(e)), t[47] = h, t[48] = n, t[49] = k) : k = t[49];
	let j;
	t[50] === n ? j = t[51] : (j = () => n.unstable_getCopyText(), t[50] = n, t[51] = j);
	let oe;
	t[52] === x ? oe = t[53] : (oe = (e) => "index" in e ? x.get({ index: e.index }) : x.get({ key: `toolCallId-${e.toolCallId}` }), t[52] = x, t[53] = oe);
	let se;
	t[54] === w ? se = t[55] : (se = (e) => "id" in e ? w.get({ key: e.id }) : w.get(e), t[54] = w, t[55] = se);
	let ce;
	t[56] === h ? ce = t[57] : (ce = (e) => {
		e && h("message.copied"), c(e);
	}, t[56] = h, t[57] = ce);
	let le;
	t[58] === n ? le = t[59] : (le = () => n, t[58] = n, t[59] = le);
	let ue;
	return t[60] !== te || t[61] !== ne || t[62] !== re || t[63] !== D || t[64] !== ie || t[65] !== O || t[66] !== ae || t[67] !== k || t[68] !== j || t[69] !== oe || t[70] !== se || t[71] !== ce || t[72] !== le ? (ue = {
		getState: te,
		composer: ne,
		delete: re,
		reload: D,
		speak: ie,
		stopSpeaking: O,
		submitFeedback: ae,
		switchToBranch: k,
		getCopyText: j,
		part: oe,
		attachment: se,
		setIsCopied: ce,
		setIsHovering: u,
		__internal_getRuntime: le
	}, t[60] = te, t[61] = ne, t[62] = re, t[63] = D, t[64] = ie, t[65] = O, t[66] = ae, t[67] = k, t[68] = j, t[69] = oe, t[70] = se, t[71] = ce, t[72] = le, t[73] = ue) : ue = t[73], ue;
}), Gi = (e) => {
	let t = et(() => ({}), []), n = t.state, r = [];
	e.suggestions.forEach((e) => {
		let t = n?.suggestions[r.length];
		r.push(t && Sr(t, e) ? t : e);
	});
	let i = n && Sr(r, n.suggestions) ? n : { suggestions: r };
	return t.state = i, i;
}, Ki = _t((e) => ({ getState: () => e })), qi = (e) => {
	let t = A(9), n = Gi(e), r;
	t[0] === n.suggestions ? r = t[1] : (r = n.suggestions.map(Yi), t[0] = n.suggestions, t[1] = r);
	let i = ei(r), a;
	t[2] === n ? a = t[3] : (a = () => n, t[2] = n, t[3] = a);
	let o;
	t[4] === i ? o = t[5] : (o = (e) => {
		let { index: t } = e;
		return i.get({ index: t });
	}, t[4] = i, t[5] = o);
	let s;
	return t[6] !== a || t[7] !== o ? (s = {
		getState: a,
		suggestion: o
	}, t[6] = a, t[7] = o, t[8] = s) : s = t[8], s;
}, Ji = _t((e) => {
	let t = A(4), n;
	t[0] === e ? n = t[1] : (n = e.map(Xi), t[0] = e, t[1] = n);
	let r;
	return t[2] === n ? r = t[3] : (r = { suggestions: n }, t[2] = n, t[3] = r), qi(r);
});
function Yi(e, t) {
	return vt(t, Ki(e), [e]);
}
function Xi(e) {
	return {
		title: e.title ?? e.prompt,
		label: e.label ?? "",
		prompt: e.prompt
	};
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/utils/normalizePartStatus.js
var Zi = Object.freeze({ type: "complete" }), Qi = Object.freeze({ type: "running" }), $i = Object.freeze({
	cancelled: Object.freeze({
		type: "incomplete",
		reason: "cancelled"
	}),
	length: Object.freeze({
		type: "incomplete",
		reason: "length"
	}),
	"content-filter": Object.freeze({
		type: "incomplete",
		reason: "content-filter"
	}),
	other: Object.freeze({
		type: "incomplete",
		reason: "other"
	}),
	error: Object.freeze({
		type: "incomplete",
		reason: "error"
	})
}), ea = (e) => {
	let t = e.status;
	if (!t || typeof t != "object") return;
	let { type: n } = t;
	if (n === "running") return Qi;
	if (n === "complete") return Zi;
	if (n !== "incomplete") return;
	let { reason: r } = t;
	return $i[r === "cancelled" || r === "length" || r === "content-filter" || r === "other" || r === "error" ? r : "other"];
}, ta = (e, t, n) => {
	if (e.role !== "assistant") return Zi;
	if (n.type === "tool-call") return n.result === void 0 ? e.status : Zi;
	if (e.status.type === "running") {
		let e = ea(n);
		if (e) return e;
	}
	let r = t === Math.max(0, e.content.length - 1);
	return e.status.type === "requires-action" ? Zi : r ? e.status : Zi;
}, na = (e) => "reason" in e ? e.reason : void 0, ra = (e) => "error" in e ? e.error : void 0, V = 32, ia = /* @__PURE__ */ new WeakMap(), aa = (e) => ia.get(e) ?? e.id, oa = (e, t, n) => "status" in e && e.status ? ta(e, t, n) : Zi, sa = () => {
	let e = [], t = /* @__PURE__ */ new Map();
	return (n) => {
		let r = [], i = /* @__PURE__ */ new Map(), a = !0, o = (e, n, s, c) => {
			if (!(s > V)) for (let [l, u] of e.entries()) for (let [e, d] of u.content.entries()) {
				if (d.type !== "tool-call" || d.messages === void 0) continue;
				let f = d.messages, p = oa(u, e, d), m = na(p), h = ra(p), g = `${c}${l}.${e}`, _ = t.get(g), v = _?.part === d && _.statusType === p.type && _.statusReason === m && Object.is(_.statusError, h) && _.messages === f && _.task.messageId === u.id && _.task.parentTaskId === n && _.task.depth === s ? _.task : {
					id: d.toolCallId,
					toolName: d.toolName,
					args: d.args,
					result: d.result,
					...d.isError === void 0 ? void 0 : { isError: d.isError },
					status: p,
					timing: d.timing,
					messageId: u.id,
					parentTaskId: n,
					depth: s,
					messages: f
				};
				v !== _?.task && (a = !1, ia.set(v, g)), r.push(v), i.set(g, {
					task: v,
					part: d,
					statusType: p.type,
					statusReason: m,
					statusError: h,
					messages: f
				}), o(f, v.id, s + 1, `${g}.`);
			}
		};
		o(n, null, 0, "");
		let s = a && r.length === e.length && r.every((t, n) => t === e[n]) ? e : r;
		return e = s, t = i, s;
	};
}, ca = _t(({ task: e }) => ({ getState: () => e })), la = _t((e) => {
	let t = A(7), { runtime: n, id: r, threadIdRef: i, threadId: a } = e, o;
	t[0] !== r || t[1] !== n ? (o = n.getMessageById(r), t[0] = r, t[1] = n, t[2] = o) : o = t[2];
	let s = o, c;
	return t[3] !== s || t[4] !== a || t[5] !== i ? (c = Wi({
		runtime: s,
		threadIdRef: i,
		threadId: a
	}), t[3] = s, t[4] = a, t[5] = i, t[6] = c) : c = t[6], an(c);
}), ua = _t((e) => {
	let t = A(93), { runtime: n } = e, r = ji(n), i = ur(), a, o;
	t[0] !== i || t[1] !== n ? (a = () => {
		let e = [];
		for (let t of [
			"runStart",
			"runEnd",
			"initialize",
			"modelContextUpdate"
		]) {
			let r = n.unstable_on(t, () => {
				let e = n.getState()?.threadId || "unknown";
				i(`thread.${t}`, { threadId: e });
			});
			e.push(r);
		}
		return e.push(n.unstable_on("toolApprovalAnswered", (e) => {
			let t = n.getState()?.threadId || "unknown";
			i("thread.toolApprovalAnswered", {
				threadId: t,
				...e
			});
		})), () => {
			for (let t of e) t();
		};
	}, o = [n, i], t[0] = i, t[1] = n, t[2] = a, t[3] = o) : (a = t[2], o = t[3]), R(a, o);
	let s;
	t[4] === n ? s = t[5] : (s = Bi(() => n.getState().threadId), t[4] = n, t[5] = s);
	let c = s, l;
	t[6] !== i || t[7] !== n ? (l = (e) => {
		i(e, { threadId: n.getState().threadId });
	}, t[6] = i, t[7] = n, t[8] = l) : l = t[8];
	let u = l, d;
	t[9] === n ? d = t[10] : (d = (e) => n.getState().suggestions.some((t) => t.prompt === e), t[9] = n, t[10] = d);
	let f = d, p;
	t[11] !== f || t[12] !== n.composer || t[13] !== c ? (p = Ri({
		runtime: n.composer,
		threadIdRef: c,
		isSuggestion: f
	}), t[11] = f, t[12] = n.composer, t[13] = c, t[14] = p) : p = t[14];
	let m = br(p), h;
	t[15] === r.suggestions ? h = t[16] : (h = Ji(r.suggestions), t[15] = r.suggestions, t[16] = h);
	let g = br(h), _;
	t[17] === Symbol.for("react.memo_cache_sentinel") ? (_ = sa(), t[17] = _) : _ = t[17];
	let v = _, y;
	t[18] === r.messages ? y = t[19] : (y = v(r.messages), t[18] = r.messages, t[19] = y);
	let b = y, x;
	t[20] === b ? x = t[21] : (x = b.map(da), t[20] = b, t[21] = x);
	let S = ei(x), C;
	if (t[22] !== n || t[23] !== r.messages || t[24] !== r.threadId || t[25] !== c) {
		let e;
		t[27] !== n || t[28] !== r.threadId || t[29] !== c ? (e = (e) => vt(e.id, la({
			runtime: n,
			id: e.id,
			threadIdRef: c,
			threadId: r.threadId
		}), [
			n,
			e.id,
			c,
			r.threadId
		]), t[27] = n, t[28] = r.threadId, t[29] = c, t[30] = e) : e = t[30], C = r.messages.map(e), t[22] = n, t[23] = r.messages, t[24] = r.threadId, t[25] = c, t[26] = C;
	} else C = t[26];
	let w = ei(C), T = w.state.length === 0 && !r.isLoading, ee;
	t[31] !== m.state || t[32] !== w.state || t[33] !== r.capabilities || t[34] !== r.extras || t[35] !== r.isDisabled || t[36] !== r.isLoading || t[37] !== r.isRunning || t[38] !== r.speech || t[39] !== r.state || t[40] !== r.suggestions || t[41] !== r.voice || t[42] !== T || t[43] !== b ? (ee = {
		isEmpty: T,
		isDisabled: r.isDisabled,
		isLoading: r.isLoading,
		isRunning: r.isRunning,
		capabilities: r.capabilities,
		state: r.state,
		suggestions: r.suggestions,
		extras: r.extras,
		speech: r.speech,
		voice: r.voice,
		composer: m.state,
		messages: w.state,
		tasks: b
	}, t[31] = m.state, t[32] = w.state, t[33] = r.capabilities, t[34] = r.extras, t[35] = r.isDisabled, t[36] = r.isLoading, t[37] = r.isRunning, t[38] = r.speech, t[39] = r.state, t[40] = r.suggestions, t[41] = r.voice, t[42] = T, t[43] = b, t[44] = ee) : ee = t[44];
	let E = ee, te;
	t[45] === E ? te = t[46] : (te = () => E, t[45] = E, t[46] = te);
	let ne;
	t[47] === m.methods ? ne = t[48] : (ne = () => m.methods, t[47] = m.methods, t[48] = ne);
	let re;
	t[49] === g ? re = t[50] : (re = () => g.methods, t[49] = g, t[50] = re);
	let D;
	t[51] !== S || t[52] !== b ? (D = (e) => {
		if ("id" in e) {
			let t = b.find((t) => t.id === e.id);
			return S.get({ key: t ? aa(t) : e.id });
		}
		return S.get(e);
	}, t[51] = S, t[52] = b, t[53] = D) : D = t[53];
	let ie;
	t[54] !== i || t[55] !== f || t[56] !== n ? (ie = (e) => {
		let t = typeof e == "string" ? { content: [{
			type: "text",
			text: e
		}] } : e;
		if ((t.role ?? "user") === "user") {
			let e = t.content.map(fa).join("");
			i("composer.send", {
				threadId: n.getState().threadId,
				chars: e.length,
				attachments: t.attachments?.length ?? 0,
				...f(e) ? { suggestion: !0 } : void 0
			});
		}
		n.append(e);
	}, t[54] = i, t[55] = f, t[56] = n, t[57] = ie) : ie = t[57];
	let O;
	t[58] !== u || t[59] !== n || t[60] !== r.isRunning ? (O = () => {
		r.isRunning && u("thread.cancelRun"), n.cancelRun();
	}, t[58] = u, t[59] = n, t[60] = r.isRunning, t[61] = O) : O = t[61];
	let ae;
	t[62] !== u || t[63] !== n ? (ae = () => {
		n.connectVoice(), u("thread.voiceStarted");
	}, t[62] = u, t[63] = n, t[64] = ae) : ae = t[64];
	let k;
	t[65] === w ? k = t[66] : (k = (e) => "id" in e ? w.get({ key: e.id }) : w.get(e), t[65] = w, t[66] = k);
	let j;
	t[67] === n ? j = t[68] : (j = () => n, t[67] = n, t[68] = j);
	let oe;
	return t[69] !== n.deleteMessage || t[70] !== n.disconnectVoice || t[71] !== n.export || t[72] !== n.getModelContext || t[73] !== n.getVoiceVolume || t[74] !== n.import || t[75] !== n.importExternalState || t[76] !== n.muteVoice || t[77] !== n.reset || t[78] !== n.resumeRun || t[79] !== n.startRun || t[80] !== n.stopSpeaking || t[81] !== n.subscribeVoiceVolume || t[82] !== n.unmuteVoice || t[83] !== te || t[84] !== ne || t[85] !== re || t[86] !== D || t[87] !== ie || t[88] !== O || t[89] !== ae || t[90] !== k || t[91] !== j ? (oe = {
		getState: te,
		composer: ne,
		suggestions: re,
		task: D,
		append: ie,
		deleteMessage: n.deleteMessage,
		startRun: n.startRun,
		resumeRun: n.resumeRun,
		importExternalState: n.importExternalState,
		cancelRun: O,
		getModelContext: n.getModelContext,
		export: n.export,
		import: n.import,
		reset: n.reset,
		stopSpeaking: n.stopSpeaking,
		connectVoice: ae,
		disconnectVoice: n.disconnectVoice,
		getVoiceVolume: n.getVoiceVolume,
		subscribeVoiceVolume: n.subscribeVoiceVolume,
		muteVoice: n.muteVoice,
		unmuteVoice: n.unmuteVoice,
		message: k,
		__internal_getRuntime: j
	}, t[69] = n.deleteMessage, t[70] = n.disconnectVoice, t[71] = n.export, t[72] = n.getModelContext, t[73] = n.getVoiceVolume, t[74] = n.import, t[75] = n.importExternalState, t[76] = n.muteVoice, t[77] = n.reset, t[78] = n.resumeRun, t[79] = n.startRun, t[80] = n.stopSpeaking, t[81] = n.subscribeVoiceVolume, t[82] = n.unmuteVoice, t[83] = te, t[84] = ne, t[85] = re, t[86] = D, t[87] = ie, t[88] = O, t[89] = ae, t[90] = k, t[91] = j, t[92] = oe) : oe = t[92], oe;
});
function da(e) {
	return vt(aa(e), ca({ task: e }), [e]);
}
function fa(e) {
	return e.type === "text" ? e.text : "";
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/store/runtime-clients/handle-thread-list-action.js
var pa = (e, t) => Pi(`thread list ${e}`, t), ma = _t((e) => {
	let t = A(35), { runtime: n, mainThreadIsRunning: r } = e, i = r !== void 0 && r, a = ji(n), o;
	bb0: {
		let e = a.isRunning || a.isMain && i;
		if (e === a.isRunning) {
			o = a;
			break bb0;
		}
		let n;
		t[0] !== e || t[1] !== a ? (n = {
			...a,
			isRunning: e
		}, t[0] = e, t[1] = a, t[2] = n) : n = t[2], o = n;
	}
	let s = o, c = ur(), { isMain: l, id: u } = a, d;
	t[3] !== l || t[4] !== u ? (d = {
		isMain: l,
		threadId: u
	}, t[3] = l, t[4] = u, t[5] = d) : d = t[5];
	let f = L(d), p, m;
	t[6] !== c || t[7] !== l || t[8] !== u ? (p = () => {
		let e = f.current;
		(e.isMain !== l || e.threadId !== u) && (f.current = {
			isMain: l,
			threadId: u
		}, c(l ? "threadListItem.switchedTo" : "threadListItem.switchedAway", { threadId: u }));
	}, m = [
		l,
		u,
		c
	], t[6] = c, t[7] = l, t[8] = u, t[9] = p, t[10] = m) : (p = t[9], m = t[10]), R(p, m);
	let h;
	t[11] === s ? h = t[12] : (h = () => s, t[11] = s, t[12] = h);
	let g, _, v, y, b, x, S;
	t[13] === n ? (g = t[14], _ = t[15], v = t[16], y = t[17], b = t[18], x = t[19], S = t[20]) : (b = (e) => pa("switch", () => n.switchTo(e)), x = (e) => pa("rename", () => n.rename(e)), S = (e) => pa("update custom metadata", () => n.updateCustom(e)), g = () => pa("archive", () => n.archive()), _ = () => pa("unarchive", () => n.unarchive()), v = () => pa("delete", () => n.delete()), y = (e) => pa("generate title", () => n.generateTitle(e)), t[13] = n, t[14] = g, t[15] = _, t[16] = v, t[17] = y, t[18] = b, t[19] = x, t[20] = S);
	let C;
	t[21] === n ? C = t[22] : (C = () => n, t[21] = n, t[22] = C);
	let w;
	return t[23] !== n.detach || t[24] !== n.initialize || t[25] !== g || t[26] !== _ || t[27] !== v || t[28] !== y || t[29] !== C || t[30] !== h || t[31] !== b || t[32] !== x || t[33] !== S ? (w = {
		getState: h,
		switchTo: b,
		rename: x,
		updateCustom: S,
		archive: g,
		unarchive: _,
		delete: v,
		generateTitle: y,
		initialize: n.initialize,
		detach: n.detach,
		__internal_getRuntime: C
	}, t[23] = n.detach, t[24] = n.initialize, t[25] = g, t[26] = _, t[27] = v, t[28] = y, t[29] = C, t[30] = h, t[31] = b, t[32] = x, t[33] = S, t[34] = w) : w = t[34], w;
}), ha = (e) => {
	let t = A(4), n = ur(), r = L(e), i, a;
	t[0] !== n || t[1] !== e ? (i = () => {
		let t = r.current;
		t !== e && (r.current = e, n("threads.selectionChanged", {
			threadId: e,
			previousThreadId: t
		}));
	}, a = [e, n], t[0] = n, t[1] = e, t[2] = i, t[3] = a) : (i = t[2], a = t[3]), R(i, a);
}, ga = _t((e) => {
	let t = A(6), { runtime: n, id: r, mainThreadIsRunning: i } = e, a;
	t[0] !== r || t[1] !== n ? (a = n.getItemById(r), t[0] = r, t[1] = n, t[2] = a) : a = t[2];
	let o = a, s;
	return t[3] !== i || t[4] !== o ? (s = ma({
		runtime: o,
		mainThreadIsRunning: i
	}), t[3] = i, t[4] = o, t[5] = s) : s = t[5], an(s);
}), _a = _t((e) => {
	let t = A(48), { runtime: n, __internal_assistantRuntime: r } = e, i = ji(n);
	ha(i.mainThreadId);
	let a = ur(), o, s;
	t[0] !== a || t[1] !== n ? (o = () => n.unstable_subscribeThreadEvents((e) => {
		let { threadId: t, type: r } = e;
		t !== n.getState().mainThreadId && a(`thread.${r}`, { threadId: t });
	}), s = [n, a], t[0] = a, t[1] = n, t[2] = o, t[3] = s) : (o = t[2], s = t[3]), R(o, s);
	let c;
	t[4] === n.main ? c = t[5] : (c = ua({ runtime: n.main }), t[4] = n.main, t[5] = c);
	let l = br(c), u;
	t[6] !== l.state || t[7] !== n || t[8] !== i.threadItems ? (u = Object.keys(i.threadItems).map((e) => vt(e, ga({
		runtime: n,
		id: e,
		mainThreadIsRunning: l.state.isRunning
	}), [
		n,
		e,
		l.state.isRunning
	])), t[6] = l.state, t[7] = n, t[8] = i.threadItems, t[9] = u) : u = t[9];
	let d = ei(u), f = i.newThreadId ?? null, p;
	t[10] !== l.state || t[11] !== i.archivedThreadIds || t[12] !== i.hasMore || t[13] !== i.isLoading || t[14] !== i.isLoadingMore || t[15] !== i.loadError || t[16] !== i.mainThreadId || t[17] !== i.threadIds || t[18] !== f || t[19] !== d.state ? (p = {
		mainThreadId: i.mainThreadId,
		newThreadId: f,
		isLoading: i.isLoading,
		loadError: i.loadError,
		isLoadingMore: i.isLoadingMore,
		hasMore: i.hasMore,
		threadIds: i.threadIds,
		archivedThreadIds: i.archivedThreadIds,
		threadItems: d.state,
		main: l.state
	}, t[10] = l.state, t[11] = i.archivedThreadIds, t[12] = i.hasMore, t[13] = i.isLoading, t[14] = i.isLoadingMore, t[15] = i.loadError, t[16] = i.mainThreadId, t[17] = i.threadIds, t[18] = f, t[19] = d.state, t[20] = p) : p = t[20];
	let m = p, h;
	t[21] === m ? h = t[22] : (h = () => m, t[21] = m, t[22] = h);
	let g;
	t[23] === l.methods ? g = t[24] : (g = () => l.methods, t[23] = l.methods, t[24] = g);
	let _;
	t[25] !== m || t[26] !== d ? (_ = (e) => {
		if (e === "main") return d.get({ key: m.mainThreadId });
		if ("id" in e) return d.get({ key: e.id });
		let { index: t, archived: n } = e, r = n !== void 0 && n ? m.archivedThreadIds[t] : m.threadIds[t];
		return d.get({ key: r });
	}, t[25] = m, t[26] = d, t[27] = _) : _ = t[27];
	let v, y, b, x, S, C;
	t[28] === n ? (v = t[29], y = t[30], b = t[31], x = t[32], S = t[33], C = t[34]) : (v = (e, t) => pa("switch", () => n.switchToThread(e, t)), y = () => pa("create", () => n.switchToNewThread()), b = () => n.getLoadThreadsPromise(), x = () => n.reload(), S = () => n.reloadMainThread(), C = () => n.loadMore(), t[28] = n, t[29] = v, t[30] = y, t[31] = b, t[32] = x, t[33] = S, t[34] = C);
	let w;
	t[35] === r ? w = t[36] : (w = () => r, t[35] = r, t[36] = w);
	let T;
	return t[37] !== v || t[38] !== y || t[39] !== b || t[40] !== x || t[41] !== S || t[42] !== C || t[43] !== w || t[44] !== h || t[45] !== g || t[46] !== _ ? (T = {
		getState: h,
		thread: g,
		item: _,
		switchToThread: v,
		switchToNewThread: y,
		getLoadThreadsPromise: b,
		reload: x,
		reloadMainThread: S,
		loadMore: C,
		__internal_getAssistantRuntime: w
	}, t[37] = v, t[38] = y, t[39] = b, t[40] = x, t[41] = S, t[42] = C, t[43] = w, t[44] = h, t[45] = g, t[46] = _, t[47] = T) : T = t[47], T;
}), va = (e, t) => {
	e.thread ??= Qr({
		source: "threads",
		query: { type: "main" },
		get: (e) => e.threads.thread("main")
	}), e.threadListItem ??= Qr({
		source: "threads",
		query: { type: "main" },
		get: (e) => e.threads.item("main")
	}), e.composer ??= Qr({
		source: "thread",
		query: {},
		get: (e) => e.threads.thread("main").composer()
	}), !e.modelContext && t.modelContext.source === null && (e.modelContext = Si()), !e.suggestions && t.suggestions.source === null && (e.suggestions = Qr({
		source: "thread",
		query: {},
		get: (e) => e.thread.suggestions()
	}));
}, ya = (e) => {
	let t = A(7), n = cr(), r;
	t[0] !== n || t[1] !== e ? (r = () => e.registerModelContextProvider(n.current.modelContext()), t[0] = n, t[1] = e, t[2] = r) : r = t[2];
	let i;
	t[3] === e ? i = t[4] : (i = [e], t[3] = e, t[4] = i), lr("modelContext", r, i);
	let a;
	return t[5] === e ? a = t[6] : (a = _a({
		runtime: e.threads,
		__internal_assistantRuntime: e
	}), t[5] = e, t[6] = a), an(a);
}, ba = _t(ya);
Kn(ya, (e, t) => {
	va(e, t), !e.tools && t.tools.source === null && (e.tools = Di({})), !e.dataRenderers && t.dataRenderers.source === null && (e.dataRenderers = fn());
});
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var xa = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), H = (/* @__PURE__ */ o(((e, t) => {
	t.exports = xa();
})))(), Sa = _n({}), Ca = ({ effects: e }) => {
	"use no memo";
	return nt(e), null;
}, wa = ct(function(e, t) {
	"use no memo";
	let { config: n, children: r } = e, i = "extends" in e, a = "value" in e, o = Un();
	if (Tr) {
		if (i && a) throw Error("AuiProvider: pass either `extends` or `value`, not both.");
		if (i && e.extends === void 0) throw Error("AuiProvider: `extends` must be a client or null, not undefined.");
		if (i && !n) throw Error("AuiProvider: `extends` requires a `config`.");
		if (a && n) throw Error("AuiProvider: pass either `value` or `config`, not both.");
		if (!a && !n) throw Error("AuiProvider: a `config` is required.");
		if (!i && !a && o !== In) throw Error("A parent AuiProvider exists — pass extends={aui} to inherit it or extends={null} to isolate.");
	}
	let s = i ? e.extends ?? In : a ? e.value ?? In : o, c = pr(), { client: l, effects: u } = Wr(s, n ?? Sa, c);
	return st(t, () => l, [l]), /* @__PURE__ */ (0, H.jsx)(dr.Provider, {
		value: c,
		children: /* @__PURE__ */ (0, H.jsxs)(Rn.Provider, {
			value: l,
			children: [
				/* @__PURE__ */ (0, H.jsx)(Ca, { effects: Vn(s) }),
				u && /* @__PURE__ */ (0, H.jsx)(Ca, { effects: u }),
				r
			]
		})
	});
}), Ta = (e) => {
	let t = Gr(), n = L(!1), r = n.current ? null : e(t);
	return B(() => n.current ? e(t) : r), () => (n.current = !0, e(t));
}, Ea = Object.freeze({});
function Da(e) {
	let t = A(3), { getItemState: n, children: r } = e, i = Ta(n), a;
	return t[0] !== r || t[1] !== i ? (a = r(i), t[0] = r, t[1] = i, t[2] = a) : a = t[2], Oa(a);
}
var Oa = (e) => {
	let t = typeof e == "object" && e && "type" in e ? e : null, n = t?.type, r = t?.key;
	return et(() => t, [
		n,
		r,
		typeof t?.props == "object" && t.props != null && Object.entries(t.props).length === 0 ? Ea : t?.props
	]) ?? e;
}, ka = (e, t) => {
	let n = A(11), r = Gr(), i = rt(t), a;
	n[0] === e ? a = n[1] : (a = Jn(e), n[0] = e, n[1] = a);
	let { scope: o, event: s } = a, c;
	n[2] !== r || n[3] !== i || n[4] !== s || n[5] !== o ? (c = () => r.on({
		scope: o,
		event: s
	}, i), n[2] = r, n[3] = i, n[4] = s, n[5] = o, n[6] = c) : c = n[6];
	let l;
	n[7] !== r || n[8] !== s || n[9] !== o ? (l = [
		r,
		o,
		s
	], n[7] = r, n[8] = s, n[9] = o, n[10] = l) : l = n[10], R(c, l);
}, Aa = (e) => e._core?.RenderComponent, ja = ({ runtime: e, aui: t, config: n, children: r }) => {
	"use no memo";
	let i = Aa(e), a = _n({
		...n,
		threads: ba(e)
	});
	return /* @__PURE__ */ (0, H.jsxs)(wa, {
		extends: t,
		config: a,
		children: [i && /* @__PURE__ */ (0, H.jsx)(i, {}), r]
	});
}, Ma = lt((e) => {
	let t = A(5), { runtime: n, aui: r, config: i, children: a } = e, o = r === void 0 ? null : r, s;
	return t[0] !== o || t[1] !== a || t[2] !== i || t[3] !== n ? (s = /* @__PURE__ */ (0, H.jsx)(ja, {
		runtime: n,
		aui: o,
		config: i,
		children: a
	}), t[0] = o, t[1] = a, t[2] = i, t[3] = n, t[4] = s) : s = t[4], s;
});
//#endregion
//#region node_modules/@assistant-ui/core/dist/utils/json/is-json.js
function Na(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Pa(e, t = 0) {
	return t > 100 ? !1 : e === null || typeof e == "string" || typeof e == "boolean" ? !0 : typeof e == "number" ? !Number.isNaN(e) && Number.isFinite(e) : Array.isArray(e) ? e.every((e) => Pa(e, t + 1)) : Na(e) ? Object.entries(e).every(([e, n]) => typeof e == "string" && Pa(n, t + 1)) : !1;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/utils/json/is-json-equal.js
var Fa = 100, Ia = (e, t, n) => {
	if (e === t) return !0;
	if (n > Fa || e == null || t == null) return !1;
	if (Array.isArray(e)) return !Array.isArray(t) || e.length !== t.length ? !1 : e.every((e, r) => Ia(e, t[r], n + 1));
	if (Array.isArray(t) || !Na(e) || !Na(t)) return !1;
	let r = Object.keys(e), i = Object.keys(t);
	return r.length === i.length && r.every((r) => Object.hasOwn(t, r) && Ia(e[r], t[r], n + 1));
}, La = (e, t) => !Pa(e) || !Pa(t) ? !1 : Ia(e, t, 0), Ra = Symbol.for("aui.tool-response"), za = "<no result>", Ba = class e {
	get [Ra]() {
		return !0;
	}
	artifact;
	result;
	isError;
	modelContent;
	messages;
	constructor(e) {
		e.artifact !== void 0 && (this.artifact = e.artifact);
		let t = e.result;
		this.result = t === void 0 ? za : t, this.isError = e.isError ?? !1, e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
	}
	static [Symbol.hasInstance](e) {
		return typeof e == "object" && !!e && Ra in e;
	}
	static toResponse(t) {
		return t instanceof e ? t : new e({ result: t === void 0 ? za : t });
	}
}, Va = () => {
	let e, t, n = new Promise((n, r) => {
		e = n, t = r;
	});
	if (!e || !t) throw Error("Failed to create promise");
	return {
		promise: n,
		resolve: e,
		reject: t
	};
}, Ha = () => {
	let e = [], t = !1, n = !1, r = !1, i, a, o = 0, s, c, l = () => (a = void 0, c ??= Promise.all(e.splice(0).map(async (e) => {
		try {
			await e.reader.cancel().catch(() => void 0), await e.pipeTask;
		} finally {
			e.reader.releaseLock();
		}
	})).then(() => void 0), c), u = (e) => {
		n || r || (r = !0, console.error(e), l(), i.error(e), s?.reject(e), s = void 0);
	}, d = (a) => {
		a.promise ||= a.reader.read().then(({ done: c, value: l }) => {
			a.promise = void 0, !(n || r) && (c ? (e.splice(e.indexOf(a), 1), a.reader.releaseLock(), t && e.length === 0 && o === 0 && i.close()) : i.enqueue(l), s?.resolve(), s = void 0);
		}).catch(u);
	}, f = new ReadableStream({
		start(e) {
			i = e;
		},
		pull() {
			return s = Va(), e.forEach((e) => {
				d(e);
			}), s.promise;
		},
		async cancel() {
			n = !0;
			let e = l();
			s?.resolve(), s = void 0, await e;
		}
	}), p = (c) => {
		if (e.length > 0 && (a = void 0), !a) {
			let c = [];
			a = c, o++, Promise.resolve().then(() => {
				if (o--, a === c && (a = void 0), !(n || r)) {
					for (let e of c) i.enqueue(e);
					t && e.length === 0 && o === 0 && i.close(), s?.resolve(), s = void 0;
				}
			}).catch(u);
		}
		a.push(c);
	};
	return {
		readable: f,
		isSealed() {
			return t;
		},
		isCancelled() {
			return n;
		},
		isErrored() {
			return r;
		},
		seal() {
			t || n || r || (t = !0, e.length === 0 && o === 0 && i.close());
		},
		addStream: (i, o) => {
			let s = o?.catch(() => void 0);
			if (n || r) {
				i.cancel().catch(() => void 0);
				return;
			}
			if (t) throw i.cancel().catch(() => void 0), Error("Cannot add streams after the run callback has settled.");
			a = void 0;
			let c = {
				reader: i.getReader(),
				pipeTask: s
			};
			e.push(c), d(c);
		},
		enqueue(e) {
			if (!(n || r)) {
				if (t) throw Error("Cannot add streams after the run callback has settled.");
				p(e);
			}
		}
	};
}, Ua = (e) => e instanceof TypeError, Wa = (e, t, n) => {
	try {
		e.enqueue(t);
	} catch (e) {
		if (!Ua(e)) throw e;
		n?.(e);
	}
}, Ga = (e) => {
	try {
		e.close();
	} catch (e) {
		if (!Ua(e)) throw e;
	}
}, Ka = (e, t) => new ReadableStream({
	start(n) {
		return e.start?.(t(n));
	},
	pull(n) {
		return e.pull?.(t(n));
	},
	cancel(t) {
		return e.cancel?.(t);
	}
}), qa = (e, t) => {
	let n;
	return [Ka({
		start(e) {
			n = e;
		},
		cancel(e) {
			return t?.(n, e);
		}
	}, e), n];
}, Ja = class {
	_controller;
	_strict;
	_isClosed = !1;
	_warnedDropped = !1;
	constructor(e, t = {}) {
		this._controller = e, this._strict = t.strict ?? !0;
	}
	append(e) {
		let t = {
			type: "text-delta",
			path: [],
			textDelta: e
		};
		if (this._isClosed) {
			if (this._strict) throw TypeError("Cannot append to a closed TextStreamController");
			return Wa(this._controller, t, this._warnDroppedAfterClose), this;
		}
		return Wa(this._controller, t), this;
	}
	_warnDroppedAfterClose = (e) => {
		this._warnedDropped || (this._warnedDropped = !0, console.error(`Dropped text delta for closed stream: ${String(e)}`));
	};
	close() {
		this._isClosed || (this._isClosed = !0, Wa(this._controller, {
			type: "part-finish",
			path: []
		}), Ga(this._controller));
	}
}, Ya = (e, t = {}) => Ka(e, (e) => new Ja(e, t)), Xa = (e = {}) => qa((t) => new Ja(t, e)), Za = class {
	_isClosed = !1;
	_mergeTask;
	_controller;
	constructor(e, t = {}) {
		this._controller = e;
		let n = Ya({ start: (e) => {
			this._argsTextController = e;
		} }, t), r = !1;
		this._mergeTask = n.pipeTo(new WritableStream({ write: (e) => {
			switch (e.type) {
				case "text-delta":
					r = !0, Wa(this._controller, e);
					break;
				case "part-finish":
					r || Wa(this._controller, {
						type: "text-delta",
						textDelta: "{}",
						path: []
					}), Wa(this._controller, {
						type: "tool-call-args-text-finish",
						path: []
					});
					break;
				default: throw Error(`Unexpected chunk type: ${e.type}`);
			}
		} }));
	}
	get argsText() {
		return this._argsTextController;
	}
	_argsTextController;
	async setResponse(e) {
		if (this._isClosed) return;
		let t = e.result;
		Wa(this._controller, {
			type: "result",
			path: [],
			...e.artifact === void 0 ? {} : { artifact: e.artifact },
			result: t === void 0 ? za : t,
			isError: e.isError ?? !1,
			...e.modelContent === void 0 ? {} : { modelContent: e.modelContent },
			...e.messages === void 0 ? {} : { messages: e.messages }
		}), await this.close();
	}
	async close() {
		this._isClosed || (this._isClosed = !0, this._argsTextController.close(), await this._mergeTask, Wa(this._controller, {
			type: "part-finish",
			path: []
		}), Ga(this._controller));
	}
}, Qa = (e = {}) => qa((t) => new Za(t, e)), $a = class {
	value = -1;
	up() {
		return ++this.value;
	}
}, eo = class extends TransformStream {
	constructor(e) {
		super({ transform(t, n) {
			n.enqueue({
				...t,
				path: [e, ...t.path]
			});
		} });
	}
};
TransformStream;
var to = class extends TransformStream {
	constructor(e) {
		let t = new $a(), n = /* @__PURE__ */ new Map();
		super({ transform(r, i) {
			r.type === "part-start" && r.path.length === 0 && n.set(t.up(), e.up());
			let [a, ...o] = r.path;
			if (a === void 0) {
				i.enqueue(r);
				return;
			}
			let s = n.get(a);
			if (s === void 0) throw Error("Path not found");
			i.enqueue({
				...r,
				path: [s, ...o]
			});
		} });
	}
}, no = (e, t = 21) => (n = t) => {
	let r = "", i = n | 0;
	for (; i-- > 0;) r += e[Math.random() * e.length | 0];
	return r;
}, ro = no("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), io = class e {
	_state;
	_parentId;
	constructor(e, t = {}) {
		this._state = e || {
			strict: t.strict ?? !0,
			merger: Ha(),
			contentCounter: new $a()
		};
	}
	get __internal_isClosed() {
		return this._state.merger.isSealed() || this._state.merger.isCancelled() || this._state.merger.isErrored();
	}
	get __internal_isCancelled() {
		return this._state.merger.isCancelled();
	}
	__internal_getReadable() {
		return this._state.merger.readable;
	}
	__internal_subscribeToClose(e) {
		this._state.closeSubscriber = e;
	}
	_addTransformedStream(e, t) {
		if (e.locked) throw TypeError("Cannot merge a stream that is already locked to a reader.");
		let n = e.pipeTo(t.writable).catch(async (e) => {
			throw await t.writable.abort(e).catch(() => void 0), e;
		});
		this._state.merger.addStream(t.readable, n);
	}
	_addPart(e, t) {
		this._state.append && (this._state.append.controller.close(), this._state.append = void 0), this.enqueue({
			type: "part-start",
			part: e,
			path: []
		}), this._addTransformedStream(t, new eo(this._state.contentCounter.value));
	}
	merge(e) {
		this._addTransformedStream(e, new to(this._state.contentCounter));
	}
	appendText(e) {
		(this._state.append?.kind !== "text" || this._state.append.parentId !== this._parentId) && (this._state.append = {
			kind: "text",
			parentId: this._parentId,
			controller: this.addTextPart()
		}), this._state.append.controller.append(e);
	}
	appendReasoning(e, t) {
		(t !== void 0 || this._state.append?.kind !== "reasoning" || this._state.append.parentId !== this._parentId) && (this._state.append = {
			kind: "reasoning",
			parentId: this._parentId,
			controller: this.addReasoningPart(t)
		}), (t === void 0 || e.length !== 0) && this._state.append.controller.append(e);
	}
	addTextPart() {
		let [e, t] = Xa({ strict: this._state.strict });
		return this._addPart(this._withParentIdOption({ type: "text" }), e), t;
	}
	addReasoningPart(e) {
		let [t, n] = Xa({ strict: this._state.strict });
		return this._addPart(this._withParentIdOption({
			type: "reasoning",
			...e
		}), t), n;
	}
	addToolCallPart(e) {
		let t = typeof e == "string" ? { toolName: e } : e, n = t.toolName, r = t.toolCallId ?? ro(), [i, a] = Qa({ strict: this._state.strict });
		return this._addPart({
			type: "tool-call",
			toolName: n,
			toolCallId: r,
			...this._parentId && { parentId: this._parentId }
		}, i), t.argsText !== void 0 && (a.argsText.append(t.argsText), a.argsText.close()), t.args !== void 0 && (a.argsText.append(JSON.stringify(t.args)), a.argsText.close()), t.response !== void 0 && a.setResponse(t.response), a;
	}
	_finishedPartStream() {
		return new ReadableStream({ start(e) {
			e.enqueue({
				type: "part-finish",
				path: []
			}), e.close();
		} });
	}
	_withParentIdOption(e) {
		return this._parentId ? {
			...e,
			parentId: this._parentId
		} : e;
	}
	appendSource(e) {
		this._addPart(this._withParentIdOption(e), this._finishedPartStream());
	}
	appendFile(e) {
		this._addPart(this._withParentIdOption(e), this._finishedPartStream());
	}
	appendData(e) {
		this._addPart(this._withParentIdOption(e), this._finishedPartStream());
	}
	enqueue(e) {
		this._state.merger.enqueue(e), e.type === "part-start" && e.path.length === 0 && this._state.contentCounter.up();
	}
	withParentId(t) {
		let n = new e(this._state);
		return n._parentId = t, n;
	}
	close() {
		this._state.append?.controller?.close(), this._state.merger.seal(), this._state.closeSubscriber?.();
	}
};
function ao(e, t = {}) {
	let n = new io(void 0, t);
	return (async () => {
		try {
			await e(n);
		} catch (e) {
			n.__internal_isClosed ? n.__internal_isCancelled || console.error(e) : n.enqueue({
				type: "error",
				path: [],
				error: String(e)
			});
		} finally {
			n.__internal_isClosed || n.close();
		}
	})(), n.__internal_getReadable();
}
function oo(e = {}) {
	let { resolve: t, promise: n } = Va(), r;
	return [ao((e) => (r = e, r.__internal_subscribeToClose(t), n), e), r];
}
//#endregion
//#region node_modules/assistant-stream/dist/core/utils/stream/PipeableTransformStream.js
var so = class extends TransformStream {
	constructor(e) {
		super();
		let t = e(super.readable);
		Object.defineProperty(this, "readable", {
			value: t,
			writable: !1
		});
	}
}, co = /* @__PURE__ */ o(((e, t) => {
	var n = typeof Buffer < "u", r = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, i = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
	function a(e, t, a) {
		a == null && typeof t == "object" && t && (a = t, t = void 0), n && Buffer.isBuffer(e) && (e = e.toString()), e && e.charCodeAt(0) === 65279 && (e = e.slice(1));
		let s = JSON.parse(e, t);
		if (typeof s != "object" || !s) return s;
		let c = a && a.protoAction || "error", l = a && a.constructorAction || "error";
		if (c === "ignore" && l === "ignore") return s;
		if (c !== "ignore" && l !== "ignore") {
			if (r.test(e) === !1 && i.test(e) === !1) return s;
		} else if (c !== "ignore" && l === "ignore") {
			if (r.test(e) === !1) return s;
		} else if (i.test(e) === !1) return s;
		return o(s, {
			protoAction: c,
			constructorAction: l,
			safe: a && a.safe
		});
	}
	function o(e, { protoAction: t = "error", constructorAction: n = "error", safe: r } = {}) {
		let i = [e];
		for (; i.length;) {
			let e = i;
			i = [];
			for (let a of e) {
				if (t !== "ignore" && Object.prototype.hasOwnProperty.call(a, "__proto__")) {
					if (r === !0) return null;
					if (t === "error") throw SyntaxError("Object contains forbidden prototype property");
					delete a.__proto__;
				}
				if (n !== "ignore" && Object.prototype.hasOwnProperty.call(a, "constructor") && a.constructor !== null && typeof a.constructor == "object" && Object.prototype.hasOwnProperty.call(a.constructor, "prototype")) {
					if (r === !0) return null;
					if (n === "error") throw SyntaxError("Object contains forbidden prototype property");
					delete a.constructor;
				}
				for (let e in a) {
					let t = a[e];
					t && typeof t == "object" && i.push(t);
				}
			}
		}
		return e;
	}
	function s(e, t, n) {
		let { stackTraceLimit: r } = Error;
		Error.stackTraceLimit = 0;
		try {
			return a(e, t, n);
		} finally {
			Error.stackTraceLimit = r;
		}
	}
	function c(e, t) {
		let { stackTraceLimit: n } = Error;
		Error.stackTraceLimit = 0;
		try {
			return a(e, t, { safe: !0 });
		} catch {
			return;
		} finally {
			Error.stackTraceLimit = n;
		}
	}
	t.exports = s, t.exports.default = s, t.exports.parse = s, t.exports.safeParse = c, t.exports.scan = o;
})), lo = class extends TransformStream {
	constructor() {
		let e = [];
		super({ transform(t, n) {
			if (t.type === "part-start") {
				if (t.path.length !== 0) {
					n.error(/* @__PURE__ */ Error("Nested parts are not supported"));
					return;
				}
				e.push(t.part), n.enqueue(t);
				return;
			}
			if (t.type === "text-delta" || t.type === "result" || t.type === "part-finish" || t.type === "tool-call-args-text-finish") {
				if (t.path.length !== 1) {
					n.error(/* @__PURE__ */ Error(`${t.type} chunks must have a path of length 1`));
					return;
				}
				let r = t.path[0];
				if (r < 0 || r >= e.length) {
					n.error(/* @__PURE__ */ Error(`Invalid path index: ${r}`));
					return;
				}
				let i = e[r];
				n.enqueue({
					...t,
					meta: i
				});
				return;
			}
			n.enqueue(t);
		} });
	}
}, uo = /[0-9a-fA-F]/;
function fo(e) {
	let t = ["ROOT"], n = -1, r = null, i = 0, a = [], o;
	function s() {
		o !== void 0 && (a.push(JSON.parse(`"${o}"`)), o = void 0);
	}
	function c(e, i, a) {
		switch (e) {
			case "\"":
				n = i, t.pop(), t.push(a), t.push("INSIDE_STRING"), s();
				break;
			case "f":
			case "t":
			case "n":
				n = i, r = i, t.pop(), t.push(a), t.push("INSIDE_LITERAL");
				break;
			case "-":
				t.pop(), t.push(a), t.push("INSIDE_NUMBER"), s();
				break;
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				n = i, t.pop(), t.push(a), t.push("INSIDE_NUMBER"), s();
				break;
			case "{":
				n = i, t.pop(), t.push(a), t.push("INSIDE_OBJECT_START"), s();
				break;
			case "[": n = i, t.pop(), t.push(a), t.push("INSIDE_ARRAY_START"), s();
		}
	}
	function l(e, r) {
		switch (e) {
			case ",":
				t.pop(), t.push("INSIDE_OBJECT_AFTER_COMMA");
				break;
			case "}": n = r, t.pop(), o = a.pop();
		}
	}
	function u(e, r) {
		switch (e) {
			case ",":
				t.pop(), t.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
				break;
			case "]": n = r, t.pop(), o = a.pop();
		}
	}
	for (let s = 0; s < e.length; s++) {
		let d = e[s];
		switch (t[t.length - 1]) {
			case "ROOT":
				c(d, s, "FINISH");
				break;
			case "INSIDE_OBJECT_START":
				switch (d) {
					case "\"":
						t.pop(), t.push("INSIDE_OBJECT_KEY"), o = "";
						break;
					case "}": n = s, t.pop(), o = a.pop();
				}
				break;
			case "INSIDE_OBJECT_AFTER_COMMA":
				d === "\"" && (t.pop(), t.push("INSIDE_OBJECT_KEY"), o = "");
				break;
			case "INSIDE_OBJECT_KEY":
				switch (d) {
					case "\"":
						t.pop(), t.push("INSIDE_OBJECT_AFTER_KEY");
						break;
					case "\\":
						t.push("INSIDE_STRING_ESCAPE"), o += d;
						break;
					default: o += d;
				}
				break;
			case "INSIDE_OBJECT_AFTER_KEY":
				d === ":" && (t.pop(), t.push("INSIDE_OBJECT_BEFORE_VALUE"));
				break;
			case "INSIDE_OBJECT_BEFORE_VALUE":
				c(d, s, "INSIDE_OBJECT_AFTER_VALUE");
				break;
			case "INSIDE_OBJECT_AFTER_VALUE":
				l(d, s);
				break;
			case "INSIDE_STRING":
				switch (d) {
					case "\"":
						t.pop(), n = s, o = a.pop();
						break;
					case "\\":
						t.push("INSIDE_STRING_ESCAPE");
						break;
					default: n = s;
				}
				break;
			case "INSIDE_ARRAY_START":
				switch (d) {
					case "]":
						n = s, t.pop(), o = a.pop();
						break;
					default: o = "0", c(d, s, "INSIDE_ARRAY_AFTER_VALUE");
				}
				break;
			case "INSIDE_ARRAY_AFTER_VALUE":
				switch (d) {
					case ",":
						t.pop(), t.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
						break;
					case "]":
						n = s, t.pop(), o = a.pop();
						break;
					default: n = s;
				}
				break;
			case "INSIDE_ARRAY_AFTER_COMMA":
				c(d, s, "INSIDE_ARRAY_AFTER_VALUE");
				break;
			case "INSIDE_STRING_ESCAPE": {
				t.pop();
				let e = t[t.length - 1];
				d === "u" ? (t.push("INSIDE_STRING_UNICODE_ESCAPE"), i = 0) : e === "INSIDE_STRING" && (n = s), e === "INSIDE_OBJECT_KEY" && (o += d);
				break;
			}
			case "INSIDE_STRING_UNICODE_ESCAPE": {
				let e = t[t.length - 2];
				if (!uo.test(d)) {
					t.pop(), s--;
					break;
				}
				i++, i === 4 && (t.pop(), e === "INSIDE_STRING" && (n = s)), e === "INSIDE_OBJECT_KEY" && (o += d);
				break;
			}
			case "INSIDE_NUMBER":
				switch (d) {
					case "0":
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
					case "9":
						n = s;
						break;
					case "e":
					case "E":
					case "-":
					case "+":
					case ".": break;
					case ",":
						t.pop(), o = a.pop(), t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, s), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(d, s);
						break;
					case "}":
						t.pop(), o = a.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(d, s);
						break;
					case "]":
						t.pop(), o = a.pop(), t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, s);
						break;
					default: t.pop(), o = a.pop();
				}
				break;
			case "INSIDE_LITERAL": {
				let i = e.substring(r, s + 1);
				!"false".startsWith(i) && !"true".startsWith(i) && !"null".startsWith(i) ? (t.pop(), t[t.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? l(d, s) : t[t.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && u(d, s)) : n = s;
				break;
			}
		}
	}
	let d = e.slice(0, n + 1);
	for (let n = t.length - 1; n >= 0; n--) switch (t[n]) {
		case "INSIDE_STRING":
			d += "\"";
			break;
		case "INSIDE_OBJECT_KEY":
		case "INSIDE_OBJECT_AFTER_KEY":
		case "INSIDE_OBJECT_AFTER_COMMA":
		case "INSIDE_OBJECT_START":
		case "INSIDE_OBJECT_BEFORE_VALUE":
		case "INSIDE_OBJECT_AFTER_VALUE":
			d += "}";
			break;
		case "INSIDE_ARRAY_START":
		case "INSIDE_ARRAY_AFTER_COMMA":
		case "INSIDE_ARRAY_AFTER_VALUE":
			d += "]";
			break;
		case "INSIDE_LITERAL": {
			let t = e.substring(r, e.length);
			"true".startsWith(t) ? d += "true".slice(t.length) : "false".startsWith(t) ? d += "false".slice(t.length) : "null".startsWith(t) && (d += "null".slice(t.length));
		}
	}
	return [d, a];
}
//#endregion
//#region node_modules/assistant-stream/dist/utils/json/parse-partial-json-object.js
var po = /* @__PURE__ */ c(co(), 1), mo = Symbol("aui.parse-partial-json-object.meta"), ho = (e) => e?.[mo], go = (e) => {
	if (e.length === 0) return { [mo]: {
		state: "partial",
		partialPath: []
	} };
	try {
		let t = po.default.parse(e);
		if (typeof t != "object" || !t) throw Error("argsText is expected to be an object");
		return t[mo] = {
			state: "complete",
			partialPath: []
		}, t;
	} catch {
		try {
			let [t, n] = fo(e), r = po.default.parse(t);
			if (typeof r != "object" || !r) throw Error("argsText is expected to be an object");
			return r[mo] = {
				state: "partial",
				partialPath: n
			}, r;
		} catch {
			return;
		}
	}
}, _o = (e, t, n) => {
	if (typeof e != "object" || !e) return t.state;
	if (t.state === "complete") return "complete";
	if (n.length === 0) return t.state;
	let [r, ...i] = n;
	if (!Object.hasOwn(e, r)) return "partial";
	let [a, ...o] = t.partialPath;
	if (r !== a) return "complete";
	let s = e[r];
	return _o(s, {
		state: "partial",
		partialPath: o
	}, i);
}, vo = (e, t) => {
	let n = ho(e);
	if (!n) throw Error("unable to determine object state");
	return _o(e, n, t.map(String));
};
//#endregion
//#region node_modules/assistant-stream/dist/utils/AsyncIterableStream.js
async function* yo() {
	let e = this.getReader(), t = !0;
	try {
		for (;;) {
			let n;
			try {
				n = await e.read();
			} catch (e) {
				throw t = !1, e;
			}
			if (n.done) {
				t = !1;
				break;
			}
			let { value: r } = n;
			yield r;
		}
	} finally {
		try {
			t && await e.cancel();
		} finally {
			e.releaseLock();
		}
	}
}
function bo(e) {
	return e[Symbol.asyncIterator] ??= yo, e;
}
//#endregion
//#region node_modules/assistant-stream/dist/core/utils/withPromiseOrValue.js
function xo(e, t, n) {
	try {
		let r = e();
		if (typeof r == "object" && r && "then" in r) return r.then(t, n);
		t(r);
	} catch (e) {
		n(e);
	}
}
//#endregion
//#region node_modules/assistant-stream/dist/core/tool/ToolCallReader.js
function So(e, t) {
	let n = e;
	for (let e of t) {
		if (n == null || !Object.hasOwn(n, e)) return;
		n = n[e];
	}
	return n;
}
var Co = class {
	resolve;
	reject;
	disposed = !1;
	fieldPath;
	get isDisposed() {
		return this.disposed;
	}
	constructor(e, t, n) {
		this.resolve = e, this.reject = t, this.fieldPath = n;
	}
	update(e) {
		if (!this.disposed) try {
			if (vo(e, this.fieldPath) === "complete") {
				let t = So(e, this.fieldPath);
				t !== void 0 && (this.resolve(t), this.dispose());
			}
		} catch (e) {
			this.reject(e), this.dispose();
		}
	}
	end(e) {
		if (!this.disposed) try {
			let t = So(e, this.fieldPath);
			this.resolve(t);
		} catch (e) {
			this.reject(e);
		} finally {
			this.dispose();
		}
	}
	dispose() {
		this.disposed = !0;
	}
}, wo = class {
	controller;
	disposed = !1;
	fieldPath;
	get isDisposed() {
		return this.disposed;
	}
	constructor(e, t) {
		this.controller = e, this.fieldPath = t;
	}
	update(e) {
		if (!this.disposed) try {
			let t = So(e, this.fieldPath);
			t !== void 0 && this.controller.enqueue(t), vo(e, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
		} catch (e) {
			this.controller.error(e), this.dispose();
		}
	}
	end() {
		this.disposed || (this.controller.close(), this.dispose());
	}
	dispose() {
		this.disposed = !0;
	}
}, To = class {
	controller;
	disposed = !1;
	fieldPath;
	lastValue = void 0;
	get isDisposed() {
		return this.disposed;
	}
	constructor(e, t) {
		this.controller = e, this.fieldPath = t;
	}
	update(e) {
		if (!this.disposed) try {
			let t = So(e, this.fieldPath);
			if (t !== void 0 && typeof t == "string") {
				let e = t.substring(this.lastValue?.length || 0);
				this.lastValue = t, this.controller.enqueue(e);
			}
			vo(e, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
		} catch (e) {
			this.controller.error(e), this.dispose();
		}
	}
	end() {
		this.disposed || (this.controller.close(), this.dispose());
	}
	dispose() {
		this.disposed = !0;
	}
}, Eo = class {
	controller;
	disposed = !1;
	fieldPath;
	nextIndex = 0;
	get isDisposed() {
		return this.disposed;
	}
	constructor(e, t) {
		this.controller = e, this.fieldPath = t;
	}
	update(e) {
		if (!this.disposed) try {
			let t = So(e, this.fieldPath);
			if (!Array.isArray(t)) return;
			for (; this.nextIndex < t.length && vo(e, [...this.fieldPath, this.nextIndex]) === "complete"; this.nextIndex++) this.controller.enqueue(t[this.nextIndex]);
			vo(e, this.fieldPath) === "complete" && (this.controller.close(), this.dispose());
		} catch (e) {
			this.controller.error(e), this.dispose();
		}
	}
	end() {
		this.disposed || (this.controller.close(), this.dispose());
	}
	dispose() {
		this.disposed = !0;
	}
}, Do = class {
	argTextDeltas;
	handles = /* @__PURE__ */ new Set();
	accumulatedText = "";
	parsedTextLength = -1;
	args = void 0;
	finished = !1;
	constructor(e) {
		this.argTextDeltas = e, this.processStream();
	}
	async processStream() {
		try {
			let e = this.argTextDeltas.getReader();
			for (;;) {
				let { value: t, done: n } = await e.read();
				if (n) break;
				this.accumulatedText += t, this.handles.size !== 0 && this.parseCurrentArgs() && this.updateHandles();
			}
		} catch (e) {
			console.error("Error processing argument stream:", e);
		} finally {
			this.finished = !0;
			for (let e of this.handles) e.end(this.args);
			this.handles.clear();
		}
	}
	parseCurrentArgs() {
		if (this.parsedTextLength === this.accumulatedText.length) return !1;
		let e = go(this.accumulatedText);
		return this.parsedTextLength = this.accumulatedText.length, e === void 0 ? (this.args ??= go(""), !1) : (this.args = e, !0);
	}
	updateHandles() {
		for (let e of this.handles) e.update(this.args), e.isDisposed && this.handles.delete(e);
	}
	activateHandle(e) {
		if (this.parseCurrentArgs(), e.update(this.args), !e.isDisposed) {
			if (this.finished) {
				e.end(this.args);
				return;
			}
			this.handles.add(e);
		}
	}
	get(...e) {
		return new Promise((t, n) => {
			let r = new Co(t, n, e);
			this.activateHandle(r);
		});
	}
	streamValues(...e) {
		let t = e, n;
		return bo(new ReadableStream({
			start: (e) => {
				n = new wo(e, t), this.activateHandle(n);
			},
			cancel: () => {
				n && (n.dispose(), this.handles.delete(n));
			}
		}));
	}
	streamText(...e) {
		let t = e, n;
		return bo(new ReadableStream({
			start: (e) => {
				n = new To(e, t), this.activateHandle(n);
			},
			cancel: () => {
				n && (n.dispose(), this.handles.delete(n));
			}
		}));
	}
	forEach(...e) {
		let t = e, n;
		return bo(new ReadableStream({
			start: (e) => {
				n = new Eo(e, t), this.activateHandle(n);
			},
			cancel: () => {
				n && (n.dispose(), this.handles.delete(n));
			}
		}));
	}
}, Oo = class {
	promise;
	constructor(e) {
		this.promise = e;
	}
	get() {
		return this.promise;
	}
}, ko = class {
	args;
	response;
	writable;
	resolve;
	argsText = "";
	constructor() {
		let e = new TransformStream();
		this.writable = e.writable, this.args = new Do(e.readable);
		let { promise: t, resolve: n } = Va();
		this.resolve = n, this.response = new Oo(t);
	}
	async appendArgsTextDelta(e) {
		let t = this.writable.getWriter();
		try {
			await t.write(e);
		} catch (e) {
			console.warn(e);
		} finally {
			t.releaseLock();
		}
		this.argsText += e;
	}
	async finishArgsText() {
		let e = this.writable.getWriter();
		try {
			await e.close();
		} catch (e) {
			console.warn(e);
		} finally {
			e.releaseLock();
		}
	}
	setResponse(e) {
		this.resolve(e);
	}
	result = { get: async () => (await this.response.get()).result };
}, Ao = Symbol.for("assistant-stream.tool-execution-id"), jo = (e, t, n, r, i) => {
	try {
		let a = t?.(n, r, i);
		Promise.resolve(a).catch((t) => {
			console.error(`[assistant-stream] ${e} callback threw an error`, t);
		});
	} catch (t) {
		console.error(`[assistant-stream] ${e} callback threw an error`, t);
	}
}, Mo = (e) => e.join(","), No = (e, t) => {
	let n = { ...e };
	return Object.defineProperty(n, Ao, {
		value: t,
		enumerable: !0
	}), n;
}, Po = class extends so {
	constructor(e) {
		let t = e, n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = 0;
		super((e) => {
			let s = new TransformStream({
				async transform(e, s) {
					let c = a.get(Mo(e.path));
					switch ((e.type !== "part-finish" || e.meta.type !== "tool-call") && s.enqueue(c ? No(e, c) : e), e.type) {
						case "part-start": {
							let n = o;
							if (o += 1, e.part.type === "tool-call") {
								let i = new ko(), o = Symbol();
								a.set(String(n), o), r.set(o, i), t.streamCall({
									reader: i,
									toolCallId: e.part.toolCallId,
									toolName: e.part.toolName,
									executionId: o
								});
							}
							break;
						}
						case "text-delta":
							if (e.meta.type === "tool-call") {
								let t = a.get(Mo(e.path)), n = t ? r.get(t) : void 0;
								if (!n) throw Error("No controller found for tool call");
								await n.appendArgsTextDelta(e.textDelta);
							}
							break;
						case "result": {
							if (e.meta.type !== "tool-call") break;
							let t = a.get(Mo(e.path)), n = t ? r.get(t) : void 0;
							if (!n) throw Error("No controller found for tool call");
							n.setResponse(new Ba({
								result: e.result,
								artifact: e.artifact,
								isError: e.isError,
								modelContent: e.modelContent,
								messages: e.messages
							})), i.add(t);
							break;
						}
						case "tool-call-args-text-finish": {
							if (e.meta.type !== "tool-call") break;
							let { toolCallId: o, toolName: c } = e.meta, l = a.get(Mo(e.path)), u = l ? r.get(l) : void 0;
							if (!u) throw Error("No controller found for tool call");
							if (await u.finishArgsText(), i.has(l)) break;
							let d = !1, f = xo(() => {
								let e;
								try {
									e = po.default.parse(u.argsText);
								} catch (e) {
									throw Error(`Function parameter parsing failed. ${JSON.stringify(e.message)}`);
								}
								let n = t.execute({
									toolCallId: o,
									toolName: c,
									args: e,
									executionId: l
								});
								return n !== void 0 && (d = !0, jo("onExecutionStart", t.onExecutionStart, o, c, l)), n;
							}, (n) => {
								if (d && jo("onExecutionEnd", t.onExecutionEnd, o, c, l), n === void 0) return;
								let r = new Ba({
									artifact: n.artifact,
									result: n.result,
									isError: n.isError,
									messages: n.messages,
									modelContent: n.modelContent
								});
								u.setResponse(r), Wa(s, No({
									type: "result",
									path: e.path,
									...r
								}, l));
							}, (n) => {
								d && jo("onExecutionEnd", t.onExecutionEnd, o, c, l);
								let r = new Ba({
									result: String(n),
									isError: !0
								});
								u.setResponse(r), Wa(s, No({
									type: "result",
									path: e.path,
									...r
								}, l));
							});
							f && n.set(l, f);
							break;
						}
						case "part-finish": {
							if (e.meta.type !== "tool-call") break;
							let t = a.get(Mo(e.path)), o = t ? n.get(t) : void 0, c = () => {
								t && (n.delete(t), r.delete(t), i.delete(t), a.delete(Mo(e.path)));
							};
							o ? o.then(() => {
								c(), Wa(s, e);
							}) : (c(), s.enqueue(e));
						}
					}
				},
				async flush() {
					await Promise.all(n.values());
				}
			});
			return e.pipeThrough(new lo()).pipeThrough(s);
		});
	}
}, Fo = Symbol.for("assistant-stream.tool-execution-id"), Io = Symbol("assistant-stream.tool-aborted"), Lo = (e) => typeof e == "object" && !!e && "~standard" in e && e["~standard"].version === 1, Ro = (e) => typeof e?.then == "function", zo = async (e, t, n = !1) => {
	let r, i = new Promise((e) => {
		r = () => {
			n ? queueMicrotask(() => queueMicrotask(() => e(Io))) : e(Io);
		}, t.aborted ? r() : t.addEventListener("abort", r, { once: !0 });
	});
	try {
		return await Promise.race([e, i]);
	} finally {
		t.removeEventListener("abort", r);
	}
}, Bo = () => new Ba({
	result: "Tool execution was cancelled.",
	isError: !0
});
function U(e, t, n, r) {
	let i = e?.[n.toolName];
	return i?.execute ? (async (e) => {
		if (t.aborted) return Bo();
		let a = e;
		if (Lo(i.parameters)) {
			let e = i.parameters["~standard"].validate(n.args), r = Ro(e) ? await zo(e, t) : e;
			if (r === Io) return Bo();
			r.issues && (a = i.experimental_onSchemaValidationError ?? (() => {
				throw Error(`Function parameter validation failed. ${JSON.stringify(r.issues)}`);
			}));
		}
		if (t.aborted) return Bo();
		let o = await zo((async () => {
			let e = {
				toolCallId: n.toolCallId,
				abortSignal: t,
				human: (e) => r(n.toolCallId, e, n.executionId),
				[Fo]: n.executionId
			}, o = await a(n.args, e), s = Ba.toResponse(o);
			if (i.toModelOutput && !s.isError && s.modelContent === void 0) try {
				let e = await i.toModelOutput({
					toolCallId: n.toolCallId,
					input: n.args,
					output: s.result
				});
				return new Ba({
					result: s.result,
					artifact: s.artifact,
					isError: s.isError,
					messages: s.messages,
					modelContent: e
				});
			} catch (e) {
				console.warn(`[assistant-stream] tool "${n.toolName}" toModelOutput threw; falling back to default projection.`, e);
			}
			return s;
		})(), t, !0);
		return o === Io ? Bo() : o;
	})(i.execute) : void 0;
}
function W(e, t, n, r, i) {
	let a = {
		toolCallId: r.toolCallId,
		abortSignal: t,
		human: (e) => i(r.toolCallId, e, r.executionId),
		[Fo]: r.executionId
	};
	e?.[r.toolName]?.streamCall?.(n, a);
}
function Vo(e, t, n, r) {
	let i = typeof e == "function" ? e : () => e, a = typeof t == "function" ? t : () => t, o = r, s = n;
	return new Po({
		execute: (e) => U(i(), a(), e, s),
		streamCall: ({ reader: e, ...t }) => W(i(), a(), e, t, s),
		onExecutionStart: o?.onExecutionStart,
		onExecutionEnd: o?.onExecutionEnd
	});
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/model-context/interactable-composer-metadata.js
function Ho(e) {
	let t = e.metadata;
	if (!t || typeof t != "object") return;
	let n = t.custom;
	if (!n || typeof n != "object") return;
	let r = n.interactables;
	return Array.isArray(r) ? r : void 0;
}
function Uo(e) {
	return `update_${e.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
var Wo = (e) => {
	if (!Na(e)) return;
	let t = e.id;
	return typeof t == "string" || typeof t == "number" ? t : void 0;
};
function Go(e, t, n) {
	let r = Array.isArray(t.set) ? [...t.set] : [...e];
	if (t.clear === !0 && (r = []), Array.isArray(t.remove) && t.remove.length > 0) {
		let e = new Set(t.remove);
		r = r.filter((t) => {
			let n = Wo(t);
			return n === void 0 ? !e.has(t) : !e.has(n);
		});
	}
	let i = t.update;
	if (Array.isArray(i) && i.length > 0) {
		let e = /* @__PURE__ */ new Map();
		for (let t of i) {
			let n = Wo(t);
			n !== void 0 && !Number.isNaN(n) && !e.has(n) && e.set(n, t);
		}
		r = r.map((t) => {
			let n = Wo(t);
			if (n === void 0 || !Na(t)) return t;
			let r = e.get(n);
			return r ? {
				...t,
				...r
			} : t;
		});
	}
	if (Array.isArray(t.add) && t.add.length > 0) {
		let e = n ? t.add.map((e) => {
			if (!Na(e) || e.id !== void 0) return e;
			let t = n();
			return t === void 0 ? e : {
				...e,
				id: t
			};
		}) : t.add;
		r = [...r, ...e];
	}
	return r;
}
function Ko(e, t, n) {
	if (!Na(e) || !Na(t)) return t;
	let r = Na(n?.arrayBaseline) ? n.arrayBaseline : e, i = Object.entries(e);
	for (let [e, a] of Object.entries(t)) {
		let t = r[e];
		if (Array.isArray(t) && Na(a)) {
			let r = n?.idFactory && (n.idKeyedFields === void 0 || n.idKeyedFields.has(e)) ? () => n.idFactory?.(e) : void 0;
			i.push([e, Go(t, a, r)]);
		} else i.push([e, a]);
	}
	return Object.fromEntries(i);
}
function qo(e, t) {
	if (!Na(e) || !Na(t)) return;
	for (let n of Object.keys(e)) if (!Object.hasOwn(t, n)) return;
	let n = [];
	for (let [r, i] of Object.entries(t)) (!Object.hasOwn(e, r) || !La(e[r], i)) && n.push([r, i]);
	let r = n.length;
	if (r !== 0 && r !== Object.keys(t).length) return Object.fromEntries(n);
}
var Jo = (e) => {
	if (!e || typeof e != "object") return;
	let t = e;
	return t.type === "tool-call" ? t : void 0;
}, Yo = (e, t) => {
	if (!e.args || typeof e.args != "object") return !1;
	let n = Na(e.result) ? e.result : void 0;
	if (n?.success === !1) return !1;
	if (typeof n?.id == "string") return n.id === t;
	let r = e.args.id;
	return r === t || r === void 0;
}, Xo = (e) => {
	let t = Na(e) ? e.addedItemIds : void 0;
	if (!Na(t)) return;
	let n = /* @__PURE__ */ new Map();
	for (let [e, r] of Object.entries(t)) {
		if (!Array.isArray(r)) continue;
		let t = r.filter((e) => typeof e == "string");
		t.length > 0 && n.set(e, t);
	}
	if (n.size !== 0) return (e) => n.get(e)?.shift();
}, Zo = /* @__PURE__ */ new WeakMap();
function Qo(e, t, n) {
	let r = Zo.get(e);
	r || (r = /* @__PURE__ */ new Map(), Zo.set(e, r));
	let i = r.get(n);
	i || (i = /* @__PURE__ */ new Map(), r.set(n, i));
	let a = i.get(t);
	if (a) return a;
	let o = Uo(n), s = [], c = () => s[s.length - 1];
	for (let r of e) {
		if (r.role === "user") {
			let e = Ho(r)?.find((e) => e.id === t);
			if (!e) continue;
			if (e.partial) {
				let t = c();
				t && s.push({
					state: Ko(t.state, e.state),
					origin: "user-edit"
				});
			} else s.push({
				state: e.state,
				origin: "user-edit"
			});
			continue;
		}
		if (r.role === "assistant") for (let e of r.content ?? []) {
			let r = Jo(e);
			if (r) {
				if (r.toolCallId === t && r.toolName === n) r.args && typeof r.args == "object" && s.push({
					state: r.args,
					origin: "create",
					toolCallId: t
				});
				else if (r.toolName === o && Yo(r, t)) {
					let e = c();
					if (e) {
						let { id: t, ...n } = r.args, i = Xo(r.result);
						s.push({
							state: i ? Ko(e.state, n, { idFactory: i }) : Ko(e.state, n),
							origin: "update",
							toolCallId: r.toolCallId
						});
					}
				}
			}
		}
	}
	return i.set(t, s), s;
}
function $o(e, t, n) {
	let r = Qo(e, t, n), i = r[r.length - 1];
	return i ? { state: i.state } : void 0;
}
function es(e, t) {
	if (!e) return;
	let { interactables: n, ...r } = e, i = { ...r };
	if (Array.isArray(n)) {
		let e = [];
		for (let r of n) {
			let n = $o(t, r.id, r.name);
			if (!n) {
				e.push({
					id: r.id,
					name: r.name,
					state: r.state
				});
				continue;
			}
			if (La(r.state, n.state)) continue;
			let i = qo(n.state, r.state);
			e.push(i ? {
				id: r.id,
				name: r.name,
				state: i,
				partial: !0
			} : {
				id: r.id,
				name: r.name,
				state: r.state
			});
		}
		e.length && (i.interactables = e);
	}
	return Object.keys(i).length ? i : void 0;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/runtimes/useRuntimeAdapters.js
var ts = mt(null), ns = () => gt(ts), rs = Symbol("innerMessage"), is = Symbol("innerMessages"), as = [], os = (e, t) => {
	rs in e || (e[rs] = t);
}, ss = (e) => {
	let t = "messages" in e ? e.messages : e, n = t[is] || t[rs];
	return n ? Array.isArray(n) ? n : (t[is] = [n], t[is]) : as;
}, cs = "__external_store_fallback_", ls = no("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
//#endregion
//#region node_modules/@assistant-ui/core/dist/utils/data-url.js
function us(e) {
	let t = e.match(/^data:([^;,]+)(?:;[^;,]+)*;base64,(.*)$/i);
	return t ? {
		mimeType: t[1].toLowerCase(),
		data: t[2]
	} : null;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/runtime/utils/thread-message-like.js
var ds = (e, t) => {
	if (e.startsWith("data-")) return {
		type: "data",
		name: e.substring(5),
		data: t
	};
}, fs = (e, t, n) => {
	let { role: r, id: i, createdAt: a, attachments: o, status: s, metadata: c } = e, l = {
		id: i ?? t,
		createdAt: a ?? /* @__PURE__ */ new Date()
	}, u = typeof e.content == "string" ? [{
		type: "text",
		text: e.content
	}] : e.content, d = ({ image: e, ...t }) => typeof e == "string" ? us(e)?.mimeType.startsWith("image/") || /^(https:\/\/|blob:)/i.test(e) ? {
		...t,
		image: e
	} : (console.warn("Invalid image data format detected"), null) : null;
	if (r !== "user" && o?.length) throw Error("attachments are only supported for user messages");
	if (r !== "assistant" && s) throw Error("status is only supported for assistant messages");
	if (r !== "assistant" && c?.steps) throw Error("metadata.steps is only supported for assistant messages");
	switch (r) {
		case "assistant": return {
			...l,
			role: r,
			content: u.map((e) => {
				let t = e.type;
				switch (t) {
					case "text": return e.text?.trim() ? e : null;
					case "reasoning": return !e.text?.trim() && !e.unstable_summary?.trim() ? null : e;
					case "file":
					case "source": return e;
					case "image": return d(e);
					case "data": return e;
					case "generative-ui": return e;
					case "tool-call": {
						let { parentId: t, messages: n, ...r } = e, i = {
							...r,
							toolCallId: e.toolCallId || `tool-${ls()}`,
							...t !== void 0 && { parentId: t },
							...n !== void 0 && { messages: n }
						};
						return e.args ? {
							...i,
							args: e.args,
							argsText: e.argsText ?? JSON.stringify(e.args)
						} : {
							...i,
							args: go(e.argsText ?? "") ?? {},
							argsText: e.argsText ?? ""
						};
					}
					default: {
						let n = ds(t, e.data);
						if (n) return n;
						throw Error(`Unsupported assistant message part type: ${t}`);
					}
				}
			}).filter((e) => !!e),
			status: s ?? n,
			metadata: {
				unstable_state: c?.unstable_state ?? null,
				unstable_annotations: c?.unstable_annotations ?? [],
				unstable_data: c?.unstable_data ?? [],
				custom: c?.custom ?? {},
				steps: c?.steps ?? [],
				...c?.timing && { timing: c.timing },
				...c?.submittedFeedback && { submittedFeedback: c.submittedFeedback },
				...c?.isOptimistic && { isOptimistic: !0 },
				...c?.modality && { modality: c.modality }
			}
		};
		case "user": return {
			...l,
			role: r,
			content: u.map((e) => {
				let t = e.type;
				switch (t) {
					case "text":
					case "image":
					case "audio":
					case "file":
					case "data": return e;
					default: {
						let n = ds(t, e.data);
						if (n) return n;
						throw Error(`Unsupported user message part type: ${t}`);
					}
				}
			}),
			attachments: (o ?? []).map((e) => ({
				...e,
				content: e.content.map((e) => ds(e.type, e.data) ?? e)
			})),
			metadata: {
				custom: c?.custom ?? {},
				...c?.isOptimistic && { isOptimistic: !0 },
				...c?.modality && { modality: c.modality }
			}
		};
		case "system":
			if (u.length !== 1 || u[0].type !== "text") throw Error("System messages must have exactly one text message part.");
			return {
				...l,
				role: r,
				content: u,
				metadata: { custom: c?.custom ?? {} }
			};
		default: throw Error(`Unknown message role: ${r}`);
	}
}, ps = (e) => e.type === "tool-call" && e.result === void 0, ms = (e) => {
	if (e.type !== "tool-call" || e.result !== void 0) return !1;
	let t = e.messages?.at(-1);
	return t?.role === "assistant" && t.status.type === "running";
}, hs = (e) => e.type !== "tool-call" || e.result !== void 0 ? !1 : e.interrupt != null || e.approval != null && e.approval.approved === void 0 && e.approval.resolution === void 0, gs = Symbol("autoStatus"), _s = Object.freeze(Object.assign({ type: "running" }, { [gs]: !0 })), vs = Object.freeze(Object.assign({
	type: "complete",
	reason: "unknown"
}, { [gs]: !0 })), ys = Object.freeze(Object.assign({
	type: "incomplete",
	reason: "cancelled"
}, { [gs]: !0 })), bs = Object.freeze(Object.assign({
	type: "requires-action",
	reason: "tool-calls"
}, { [gs]: !0 })), xs = Object.freeze(Object.assign({
	type: "requires-action",
	reason: "interrupt"
}, { [gs]: !0 })), Ss = (e) => e[gs] === !0, Cs = (e, t, n, r, i, a, o) => e && i ? Object.assign({
	type: "incomplete",
	reason: "error",
	error: i
}, { [gs]: !0 }) : e && t ? _s : n ? xs : o && !a ? _s : r ? bs : a ? ys : vs, ws = (e) => Cs(!1, !1, typeof e != "string" && e.some(hs), typeof e != "string" && e.some(ps)), Ts = (e, t, n) => Cs(t, n, typeof e != "string" && e.some(hs), typeof e != "string" && e.some(ps), void 0, void 0, typeof e != "string" && e.some(ms)), Es = class {
	cache = /* @__PURE__ */ new WeakMap();
	convertMessages(e, t) {
		return e.map((e, n) => {
			let r = t(this.cache.get(e), e, n);
			return this.cache.set(e, r), r;
		});
	}
}, Ds = (e, t) => {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
	return !0;
}, Os = (e) => {
	let t = A(6), { index: n, children: r } = e, i = Gr(), a;
	t[0] === n ? a = t[1] : (a = _n({ attachment: Qr({
		source: "message",
		query: {
			type: "index",
			index: n
		},
		get: (e) => e.message.attachment({ index: n })
	}) }), t[0] = n, t[1] = a);
	let o = a, s;
	return t[2] !== i || t[3] !== r || t[4] !== o ? (s = /* @__PURE__ */ (0, H.jsx)(wa, {
		extends: i,
		config: o,
		children: r
	}), t[2] = i, t[3] = r, t[4] = o, t[5] = s) : s = t[5], s;
}, ks = (e) => {
	let t = A(6), { index: n, children: r } = e, i = Gr(), a;
	t[0] === n ? a = t[1] : (a = _n({
		message: Qr({
			source: "thread",
			query: {
				type: "index",
				index: n
			},
			get: (e) => e.thread.message({ index: n })
		}),
		composer: Qr({
			source: "message",
			query: {},
			get: (e) => e.thread.message({ index: n }).composer()
		})
	}), t[0] = n, t[1] = a);
	let o = a, s;
	return t[2] !== i || t[3] !== r || t[4] !== o ? (s = /* @__PURE__ */ (0, H.jsx)(wa, {
		extends: i,
		config: o,
		children: r
	}), t[2] = i, t[3] = r, t[4] = o, t[5] = s) : s = t[5], s;
}, As = (e) => {
	let t = A(6), { index: n, children: r } = e, i = Gr(), a;
	t[0] === n ? a = t[1] : (a = _n({ part: Qr({
		source: "message",
		query: {
			type: "index",
			index: n
		},
		get: (e) => e.message.part({ index: n })
	}) }), t[0] = n, t[1] = a);
	let o = a, s;
	return t[2] !== i || t[3] !== r || t[4] !== o ? (s = /* @__PURE__ */ (0, H.jsx)(wa, {
		extends: i,
		config: o,
		children: r
	}), t[2] = i, t[3] = r, t[4] = o, t[5] = s) : s = t[5], s;
}, js = _t((e) => {
	let t = A(7), { text: n, isRunning: r } = e, i;
	t[0] === r ? i = t[1] : (i = r ? { type: "running" } : { type: "complete" }, t[0] = r, t[1] = i);
	let a;
	t[2] !== i || t[3] !== n ? (a = {
		type: "text",
		text: n,
		status: i
	}, t[2] = i, t[3] = n, t[4] = a) : a = t[4];
	let o = a, s;
	return t[5] === o ? s = t[6] : (s = {
		getState: () => o,
		addToolResult: Ns,
		resumeToolCall: Ps,
		respondToToolApproval: Fs
	}, t[5] = o, t[6] = s), s;
}), Ms = (e) => {
	let t = A(7), { text: n, isRunning: r, children: i } = e, a = r !== void 0 && r, o = Gr(), s;
	t[0] !== a || t[1] !== n ? (s = _n({ part: js({
		text: n,
		isRunning: a
	}) }), t[0] = a, t[1] = n, t[2] = s) : s = t[2];
	let c = s, l;
	return t[3] !== o || t[4] !== i || t[5] !== c ? (l = /* @__PURE__ */ (0, H.jsx)(wa, {
		extends: o,
		config: c,
		children: i
	}), t[3] = o, t[4] = i, t[5] = c, t[6] = l) : l = t[6], l;
};
function Ns() {
	throw Error("Not supported");
}
function Ps() {
	throw Error("Not supported");
}
function Fs() {
	throw Error("Not supported");
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/utils/getGroupStatus.js
var Is = (e) => {
	for (let t of e) if (t?.status.type === "running") return Qi;
	return e.at(-1)?.status ?? Zi;
}, Ls = (e, t) => {
	let n = {
		running: 0,
		complete: 0,
		incomplete: 0,
		requiresAction: 0
	}, r = Zi, i = !1;
	for (let a of t) switch (r = e[a]?.status ?? Zi, r.type) {
		case "running":
			n.running++, i = !0;
			break;
		case "complete":
			n.complete++;
			break;
		case "incomplete":
			n.incomplete++;
			break;
		case "requires-action": n.requiresAction++;
	}
	return {
		status: i ? Qi : r,
		counts: n
	};
}, Rs = _t((e) => {
	let t = A(11), { parts: n, getMessagePart: r } = e, [i, a] = I(!0), o;
	t[0] === n ? o = t[1] : (o = Is(n), t[0] = n, t[1] = o);
	let s = o, c;
	t[2] !== i || t[3] !== n || t[4] !== s ? (c = {
		parts: n,
		collapsed: i,
		status: s
	}, t[2] = i, t[3] = n, t[4] = s, t[5] = c) : c = t[5];
	let l = c, u;
	t[6] === l ? u = t[7] : (u = () => l, t[6] = l, t[7] = u);
	let d;
	return t[8] !== r || t[9] !== u ? (d = {
		getState: u,
		setCollapsed: a,
		part: r
	}, t[8] = r, t[9] = u, t[10] = d) : d = t[10], d;
}), zs = (e) => {
	let t = A(4), { startIndex: n, endIndex: r, children: i } = e, a = B(Bs).slice(n, r + 1), o = Gr(), s = _n({ chainOfThought: Rs({
		parts: a,
		getMessagePart: (e) => {
			let { index: t } = e;
			if (t < 0 || t >= a.length) throw Error(`ChainOfThought part index ${t} is out of bounds (0..${a.length - 1})`);
			return o.message.part({ index: n + t });
		}
	}) }), c;
	return t[0] !== i || t[1] !== s || t[2] !== o ? (c = /* @__PURE__ */ (0, H.jsx)(wa, {
		extends: o,
		config: s,
		children: i
	}), t[0] = i, t[1] = s, t[2] = o, t[3] = c) : c = t[3], c;
};
function Bs(e) {
	return e.message.parts;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/providers/SuggestionByIndexProvider.js
var Vs = (e) => {
	let t = A(6), { index: n, children: r } = e, i = Gr(), a;
	t[0] === n ? a = t[1] : (a = _n({ suggestion: Qr({
		source: "suggestions",
		query: { index: n },
		get: (e) => e.suggestions.suggestion({ index: n })
	}) }), t[0] = n, t[1] = a);
	let o = a, s;
	return t[2] !== i || t[3] !== r || t[4] !== o ? (s = /* @__PURE__ */ (0, H.jsx)(wa, {
		extends: i,
		config: o,
		children: r
	}), t[2] = i, t[3] = r, t[4] = o, t[5] = s) : s = t[5], s;
}, Hs = Symbol.for("assistant-ui.message-not-sent"), Us = (e) => typeof e == "object" && !!e && Hs in e, Ws = class {
	get path() {
		return this._core.path;
	}
	_core;
	constructor(e) {
		this._core = e, this.__internal_bindMethods();
	}
	__internal_bindMethods() {
		this.getState = this.getState.bind(this), this.remove = this.remove.bind(this), this.subscribe = this.subscribe.bind(this);
	}
	getState() {
		return this._core.getState();
	}
	subscribe(e) {
		return this._core.subscribe(e);
	}
}, Gs = class extends Ws {
	_composerApi;
	constructor(e, t) {
		super(e), this._composerApi = t;
	}
	remove() {
		let e = this._composerApi.getState();
		if (!e) throw Error("Composer is not available");
		return e.removeAttachment(this.getState().id);
	}
}, Ks = class extends Gs {
	get source() {
		return "thread-composer";
	}
}, qs = class extends Gs {
	get source() {
		return "edit-composer";
	}
}, Js = class extends Ws {
	get source() {
		return "message";
	}
	remove() {
		throw Error("Message attachments cannot be removed");
	}
}, Ys = Object.freeze([]), Xs = Object.freeze({}), Zs = (e) => Object.freeze({
	type: "thread",
	isEditing: e?.isEditing ?? !1,
	canCancel: e?.canCancel ?? !1,
	canSend: e?.canSend ?? !1,
	isEmpty: e?.isEmpty ?? !0,
	attachments: e?.attachments ?? Ys,
	text: e?.text ?? "",
	role: e?.role ?? "user",
	runConfig: e?.runConfig ?? Xs,
	attachmentAccept: e?.attachmentAccept ?? "",
	dictation: e?.dictation,
	quote: e?.quote,
	queue: e?.queue ?? Ys,
	value: e?.text ?? ""
}), Qs = (e) => Object.freeze({
	type: "edit",
	isEditing: e?.isEditing ?? !1,
	canCancel: e?.canCancel ?? !1,
	canSend: e?.canSend ?? !1,
	isEmpty: e?.isEmpty ?? !0,
	text: e?.text ?? "",
	role: e?.role ?? "user",
	attachments: e?.attachments ?? Ys,
	runConfig: e?.runConfig ?? Xs,
	attachmentAccept: e?.attachmentAccept ?? "",
	dictation: e?.dictation,
	quote: e?.quote,
	queue: e?.queue ?? Ys,
	parentId: e?.parentId ?? null,
	sourceId: e?.sourceId ?? null,
	value: e?.text ?? ""
}), $s = class {
	get path() {
		return this._core.path;
	}
	_core;
	constructor(e) {
		this._core = e;
	}
	__internal_bindMethods() {
		this.setText = this.setText.bind(this), this.setRunConfig = this.setRunConfig.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.addAttachment = this.addAttachment.bind(this), this.reset = this.reset.bind(this), this.clearAttachments = this.clearAttachments.bind(this), this.send = this.send.bind(this), this.cancel = this.cancel.bind(this), this.steerQueueItem = this.steerQueueItem.bind(this), this.moveQueueItem = this.moveQueueItem.bind(this), this.removeQueueItem = this.removeQueueItem.bind(this), this.setRole = this.setRole.bind(this), this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this), this.startDictation = this.startDictation.bind(this), this.stopDictation = this.stopDictation.bind(this), this.setQuote = this.setQuote.bind(this), this.unstable_on = this.unstable_on.bind(this);
	}
	setText(e) {
		let t = this._core.getState();
		if (!t) throw Error("Composer is not available");
		t.setText(e);
	}
	setRunConfig(e) {
		let t = this._core.getState();
		if (!t) throw Error("Composer is not available");
		t.setRunConfig(e);
	}
	addAttachment(e) {
		let t = this._core.getState();
		if (!t) throw Error("Composer is not available");
		return t.addAttachment(e);
	}
	reset() {
		let e = this._core.getState();
		if (!e) throw Error("Composer is not available");
		return e.reset();
	}
	clearAttachments() {
		let e = this._core.getState();
		if (!e) throw Error("Composer is not available");
		return e.clearAttachments();
	}
	send(e) {
		let t = this._core.getState();
		if (!t) throw Error("Composer is not available");
		t.send(e);
	}
	cancel() {
		let e = this._core.getState();
		if (!e) throw Error("Composer is not available");
		e.cancel();
	}
	steerQueueItem(e) {
		this.moveQueueItem(e, {
			lane: "steer",
			insertAfter: null
		});
	}
	moveQueueItem(e, t) {
		let n = this._core.getState();
		if (!n) throw Error("Composer is not available");
		n.moveQueueItem(e, t);
	}
	removeQueueItem(e) {
		let t = this._core.getState();
		if (!t) throw Error("Composer is not available");
		t.removeQueueItem(e);
	}
	setRole(e) {
		let t = this._core.getState();
		if (!t) throw Error("Composer is not available");
		t.setRole(e);
	}
	startDictation() {
		let e = this._core.getState();
		if (!e) throw Error("Composer is not available");
		e.startDictation();
	}
	stopDictation() {
		let e = this._core.getState();
		if (!e) throw Error("Composer is not available");
		e.stopDictation();
	}
	setQuote(e) {
		let t = this._core.getState();
		if (!t) throw Error("Composer is not available");
		t.setQuote(e);
	}
	subscribe(e) {
		return this._core.subscribe(e);
	}
	_eventSubscriptionSubjects = /* @__PURE__ */ new Map();
	unstable_on(e, t) {
		let n = this._eventSubscriptionSubjects.get(e);
		return n || (n = new gi({
			event: e,
			binding: this._core
		}), this._eventSubscriptionSubjects.set(e, n)), n.subscribe(t);
	}
}, ec = class extends $s {
	get path() {
		return this._core.path;
	}
	get type() {
		return "thread";
	}
	_getState;
	constructor(e) {
		let t = new mi({
			path: e.path,
			getState: () => Zs(e.getState()),
			subscribe: (t) => e.subscribe(t)
		});
		super({
			path: e.path,
			getState: () => e.getState(),
			subscribe: (e) => t.subscribe(e)
		}), this._getState = t.getState.bind(t), this.__internal_bindMethods();
	}
	getState() {
		return this._getState();
	}
	getAttachmentByIndex(e) {
		return new Ks(new pi({
			path: {
				...this.path,
				attachmentSource: "thread-composer",
				attachmentSelector: {
					type: "index",
					index: e
				},
				ref: `${this.path.ref}.attachments[${e}]`
			},
			getState: () => {
				let t = this.getState().attachments[e];
				return t ? {
					...t,
					source: "thread-composer"
				} : si;
			},
			subscribe: (e) => this._core.subscribe(e)
		}), this._core);
	}
}, tc = class extends $s {
	get path() {
		return this._core.path;
	}
	get type() {
		return "edit";
	}
	_getState;
	_beginEdit;
	constructor(e, t) {
		let n = new mi({
			path: e.path,
			getState: () => Qs(e.getState()),
			subscribe: (t) => e.subscribe(t)
		});
		super({
			path: e.path,
			getState: () => e.getState(),
			subscribe: (e) => n.subscribe(e)
		}), this._beginEdit = t, this._getState = n.getState.bind(n), this.__internal_bindMethods();
	}
	__internal_bindMethods() {
		super.__internal_bindMethods(), this.beginEdit = this.beginEdit.bind(this);
	}
	getState() {
		return this._getState();
	}
	beginEdit() {
		this._beginEdit();
	}
	getAttachmentByIndex(e) {
		return new qs(new pi({
			path: {
				...this.path,
				attachmentSource: "edit-composer",
				attachmentSelector: {
					type: "index",
					index: e
				},
				ref: `${this.path.ref}.attachments[${e}]`
			},
			getState: () => {
				let t = this.getState().attachments[e];
				return t ? {
					...t,
					source: "edit-composer"
				} : si;
			},
			subscribe: (e) => this._core.subscribe(e)
		}), this._core);
	}
}, nc = (e) => e.content.filter((e) => e.type === "text").map((e) => e.text).join("\n\n"), rc = "ui://", ic = (e) => !!e?.startsWith(rc), ac = (e) => e.display === "text" || e.allowFreeform === !0, oc = {
	"allow-once": !0,
	"allow-always": !0,
	"reject-once": !1,
	"reject-always": !1
}, sc = (e, t) => {
	let n = t.text;
	if (n !== void 0 && !ac(e)) throw Error(`Tool approval "${e.id}" does not accept a free-form answer; the request must declare display "text" or allowFreeform`);
	let r, i;
	if ("optionId" in t) {
		let n = e.options?.find((e) => e.id === t.optionId);
		if (!n) throw Error(`Tool approval has no option with id "${t.optionId}"`);
		if ("approved" in t) r = t.approved;
		else {
			if (!Object.hasOwn(oc, n.kind)) throw Error(`Tool approval option "${n.id}" has a custom kind "${n.kind}"; respond with an explicit approved value instead`);
			r = oc[n.kind];
		}
		i = n.id;
	} else if ("approved" in t) r = t.approved;
	else {
		if (e.display !== "text" && e.display !== "select") throw Error(`Tool approval "${e.id}" is a decision, not a question; respond with an explicit approved value, optionally alongside the answer`);
		r = !0;
	}
	return {
		approvalId: e.id,
		approved: r,
		...i !== void 0 && { optionId: i },
		...n !== void 0 && { text: n },
		...t.reason != null && { reason: t.reason }
	};
}, cc = class {
	get path() {
		return this.contentBinding.path;
	}
	contentBinding;
	messageApi;
	threadApi;
	constructor(e, t, n) {
		this.contentBinding = e, this.messageApi = t, this.threadApi = n, this.__internal_bindMethods();
	}
	__internal_bindMethods() {
		this.addToolResult = this.addToolResult.bind(this), this.resumeToolCall = this.resumeToolCall.bind(this), this.respondToToolApproval = this.respondToToolApproval.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this);
	}
	getState() {
		return this.contentBinding.getState();
	}
	addToolResult(e) {
		let t = this.contentBinding.getState();
		if (!t) throw Error("Message part is not available");
		if (t.type !== "tool-call") throw Error("Tried to add tool result to non-tool message part");
		if (!this.messageApi) throw Error("Message API is not available. This is likely a bug in assistant-ui.");
		if (!this.threadApi) throw Error("Thread API is not available");
		let n = this.messageApi.getState();
		if (!n) throw Error("Message is not available");
		let r = t.toolName, i = t.toolCallId, a = Ba.toResponse(e);
		this.threadApi.getState().addToolResult({
			messageId: n.id,
			toolName: r,
			toolCallId: i,
			result: a.result,
			isError: a.isError,
			...a.artifact !== void 0 && { artifact: a.artifact },
			...a.modelContent !== void 0 && { modelContent: a.modelContent }
		});
	}
	resumeToolCall(e) {
		let t = this.contentBinding.getState();
		if (!t) throw Error("Message part is not available");
		if (t.type !== "tool-call") throw Error("Tried to resume tool call on non-tool message part");
		if (!this.threadApi) throw Error("Thread API is not available");
		let n = t.toolCallId;
		this.threadApi.getState().resumeToolCall({
			toolCallId: n,
			payload: e
		});
	}
	respondToToolApproval(e) {
		let t = this.contentBinding.getState();
		if (!t) throw Error("Message part is not available");
		if (t.type !== "tool-call") throw Error("Tried to respond to tool approval on non-tool message part");
		if (!t.approval || t.approval.approved !== void 0 || t.approval.resolution !== void 0) throw Error("Tool call has no pending approval");
		if (!this.threadApi) throw Error("Thread API is not available");
		return this.threadApi.getState().respondToToolApproval(sc(t.approval, e));
	}
	subscribe(e) {
		return this.contentBinding.subscribe(e);
	}
}, lc = (e, t) => {
	let n = e.content[t];
	if (!n) return si;
	let r = ta(e, t, n);
	return Object.freeze({
		...n,
		[rs]: n[rs],
		status: r
	});
}, uc = class {
	get path() {
		return this._core.path;
	}
	_core;
	_threadBinding;
	constructor(e, t) {
		this._core = e, this._threadBinding = t, this.composer = new tc(new hi({
			path: {
				...this.path,
				ref: `${this.path.ref}.composer`,
				composerSource: "edit"
			},
			getState: this._getEditComposerRuntimeCore,
			subscribe: (e) => this._threadBinding.subscribe(e)
		}), () => this._threadBinding.getState().beginEdit(this._core.getState().id)), this.__internal_bindMethods();
	}
	__internal_bindMethods() {
		this.reload = this.reload.bind(this), this.delete = this.delete.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.getMessagePartByIndex = this.getMessagePartByIndex.bind(this), this.getMessagePartByToolCallId = this.getMessagePartByToolCallId.bind(this), this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this), this.unstable_getCopyText = this.unstable_getCopyText.bind(this), this.speak = this.speak.bind(this), this.stopSpeaking = this.stopSpeaking.bind(this), this.submitFeedback = this.submitFeedback.bind(this), this.switchToBranch = this.switchToBranch.bind(this);
	}
	composer;
	_getEditComposerRuntimeCore = () => this._threadBinding.getState().getEditComposer(this._core.getState().id);
	getState() {
		return this._core.getState();
	}
	delete() {
		let e = this._core.getState();
		return this._threadBinding.getState().deleteMessage(e.id);
	}
	reload(e = {}) {
		let t = this._getEditComposerRuntimeCore(), n = t ?? this._threadBinding.getState().composer, r = t ?? n, { runConfig: i = r.runConfig } = e, a = this._core.getState();
		if (a.role !== "assistant") throw Error("Can only reload assistant messages");
		this._threadBinding.getState().startRun({
			parentId: a.parentId,
			sourceId: a.id,
			runConfig: i
		});
	}
	speak() {
		let e = this._core.getState();
		return this._threadBinding.getState().speak(e.id);
	}
	stopSpeaking() {
		let e = this._core.getState();
		if (this._threadBinding.getState().speech?.messageId === e.id) this._threadBinding.getState().stopSpeaking();
		else throw Error("Message is not being spoken");
	}
	submitFeedback({ type: e, comment: t }) {
		let n = this._core.getState();
		this._threadBinding.getState().submitFeedback({
			messageId: n.id,
			type: e,
			...t === void 0 ? void 0 : { comment: t }
		});
	}
	switchToBranch({ position: e, branchId: t }) {
		let n = this._core.getState();
		if (t && e) throw Error("May not specify both branchId and position");
		if (!t && !e) throw Error("Must specify either branchId or position");
		let r = this._threadBinding.getState().getBranches(n.id), i = t;
		if (e === "previous" ? i = r[n.branchNumber - 2] : e === "next" && (i = r[n.branchNumber]), !i) throw Error("Branch not found");
		this._threadBinding.getState().switchToBranch(i);
	}
	unstable_getCopyText() {
		return nc(this.getState());
	}
	subscribe(e) {
		return this._core.subscribe(e);
	}
	getMessagePartByIndex(e) {
		if (e < 0) throw Error("Message part index must be >= 0");
		return new cc(new pi({
			path: {
				...this.path,
				ref: `${this.path.ref}.content[${e}]`,
				messagePartSelector: {
					type: "index",
					index: e
				}
			},
			getState: () => lc(this.getState(), e),
			subscribe: (e) => this._core.subscribe(e)
		}), this._core, this._threadBinding);
	}
	getMessagePartByToolCallId(e) {
		return new cc(new pi({
			path: {
				...this.path,
				ref: `${this.path.ref}.content[toolCallId=${JSON.stringify(e)}]`,
				messagePartSelector: {
					type: "toolCallId",
					toolCallId: e
				}
			},
			getState: () => {
				let t = this._core.getState(), n = t.content.findIndex((t) => t.type === "tool-call" && t.toolCallId === e);
				return n === -1 ? si : lc(t, n);
			},
			subscribe: (e) => this._core.subscribe(e)
		}), this._core, this._threadBinding);
	}
	getAttachmentByIndex(e) {
		return new Js(new pi({
			path: {
				...this.path,
				ref: `${this.path.ref}.attachments[${e}]`,
				attachmentSource: "message",
				attachmentSelector: {
					type: "index",
					index: e
				}
			},
			getState: () => {
				let t = this.getState().attachments?.[e];
				return t ? {
					...t,
					source: "message"
				} : si;
			},
			subscribe: (e) => this._core.subscribe(e)
		}));
	}
}, dc = (e) => ({
	parentId: e.parentId ?? null,
	sourceId: e.sourceId ?? null,
	runConfig: e.runConfig ?? {},
	...e.stream ? { stream: e.stream } : {}
}), fc = (e) => ({
	parentId: e.parentId ?? null,
	sourceId: e.sourceId ?? null,
	runConfig: e.runConfig ?? {}
}), pc = (e, t) => typeof t == "string" ? {
	createdAt: /* @__PURE__ */ new Date(),
	parentId: e.at(-1)?.id ?? null,
	sourceId: null,
	runConfig: {},
	role: "user",
	content: [{
		type: "text",
		text: t
	}],
	attachments: [],
	metadata: { custom: {} }
} : {
	createdAt: t.createdAt ?? /* @__PURE__ */ new Date(),
	parentId: t.parentId === void 0 ? e.at(-1)?.id ?? null : t.parentId,
	sourceId: t.sourceId ?? null,
	role: t.role ?? "user",
	content: t.content,
	attachments: t.attachments ?? [],
	metadata: t.metadata ?? { custom: {} },
	runConfig: t.runConfig ?? {},
	startRun: t.startRun
}, mc = (e) => {
	if (e.isRunning !== void 0) return e.isRunning;
	let t = e.messages.at(-1);
	return t?.role === "assistant" && t.status.type === "running";
}, hc = (e, t) => Object.freeze({
	threadId: t.id,
	metadata: t,
	capabilities: e.capabilities,
	isDisabled: e.isDisabled,
	isLoading: e.isLoading,
	isRunning: mc(e),
	messages: e.messages,
	state: e.state,
	suggestions: e.suggestions,
	extras: e.extras,
	speech: e.speech,
	voice: e.voice
}), gc = class {
	get path() {
		return this._threadBinding.path;
	}
	get __internal_threadBinding() {
		return this._threadBinding;
	}
	_threadBinding;
	_stateBinding;
	constructor(e, t) {
		let n = new pi({
			path: e.path,
			getState: () => hc(e.getState(), t.getState()),
			subscribe: (n) => {
				let r = e.subscribe(n), i = t.subscribe(n);
				return () => li([r, i]);
			}
		});
		this._stateBinding = n, this._threadBinding = {
			path: e.path,
			getState: () => e.getState(),
			getStateState: () => n.getState(),
			outerSubscribe: (t) => e.outerSubscribe(t),
			subscribe: (t) => e.subscribe(t)
		}, this.composer = new ec(new hi({
			path: {
				...this.path,
				ref: `${this.path.ref}.composer`,
				composerSource: "thread"
			},
			getState: () => this._threadBinding.getState().composer,
			subscribe: (e) => this._threadBinding.subscribe(e)
		})), this.__internal_bindMethods();
	}
	__internal_bindMethods() {
		this.append = this.append.bind(this), this.deleteMessage = this.deleteMessage.bind(this), this.resumeRun = this.resumeRun.bind(this), this.importExternalState = this.importExternalState.bind(this), this.exportExternalState = this.exportExternalState.bind(this), this.startRun = this.startRun.bind(this), this.cancelRun = this.cancelRun.bind(this), this.unstable_notifySessionReset = this.unstable_notifySessionReset.bind(this), this.stopSpeaking = this.stopSpeaking.bind(this), this.connectVoice = this.connectVoice.bind(this), this.disconnectVoice = this.disconnectVoice.bind(this), this.muteVoice = this.muteVoice.bind(this), this.unmuteVoice = this.unmuteVoice.bind(this), this.getVoiceVolume = this.getVoiceVolume.bind(this), this.subscribeVoiceVolume = this.subscribeVoiceVolume.bind(this), this.export = this.export.bind(this), this.import = this.import.bind(this), this.reset = this.reset.bind(this), this.getMessageByIndex = this.getMessageByIndex.bind(this), this.getMessageById = this.getMessageById.bind(this), this.subscribe = this.subscribe.bind(this), this.unstable_on = this.unstable_on.bind(this), this.getModelContext = this.getModelContext.bind(this), this.getState = this.getState.bind(this);
	}
	composer;
	getState() {
		return this._threadBinding.getStateState();
	}
	append(e) {
		let t = this._threadBinding.getState().append(pc(this._threadBinding.getState().messages, e));
		Promise.resolve(t).catch((e) => {
			if (!Us(e)) throw e;
		});
	}
	deleteMessage(e) {
		return this._threadBinding.getState().deleteMessage(e);
	}
	subscribe(e) {
		return this._stateBinding.subscribe(e);
	}
	getModelContext() {
		return this._threadBinding.getState().getModelContext();
	}
	startRun(e) {
		return this._threadBinding.getState().startRun(fc(e));
	}
	resumeRun(e) {
		return this._threadBinding.getState().resumeRun(dc(e));
	}
	exportExternalState() {
		return this._threadBinding.getState().exportExternalState();
	}
	importExternalState(e) {
		this._threadBinding.getState().importExternalState(e);
	}
	cancelRun() {
		this._threadBinding.getState().cancelRun();
	}
	unstable_notifySessionReset() {
		this._threadBinding.getState().unstable_notifySessionReset();
	}
	stopSpeaking() {
		return this._threadBinding.getState().stopSpeaking();
	}
	connectVoice() {
		this._threadBinding.getState().connectVoice();
	}
	disconnectVoice() {
		this._threadBinding.getState().disconnectVoice();
	}
	getVoiceVolume() {
		return this._threadBinding.getState().getVoiceVolume();
	}
	subscribeVoiceVolume(e) {
		return this._threadBinding.getState().subscribeVoiceVolume(e);
	}
	muteVoice() {
		this._threadBinding.getState().muteVoice();
	}
	unmuteVoice() {
		this._threadBinding.getState().unmuteVoice();
	}
	export() {
		return this._threadBinding.getState().export();
	}
	import(e) {
		this._threadBinding.getState().import(e);
	}
	reset(e) {
		this._threadBinding.getState().reset(e);
	}
	getMessageByIndex(e) {
		if (e < 0) throw Error("Message index must be >= 0");
		return this._getMessageRuntime({
			...this.path,
			ref: `${this.path.ref}.messages[${e}]`,
			messageSelector: {
				type: "index",
				index: e
			}
		}, () => {
			let t = this._threadBinding.getState().messages, n = t[e];
			if (n) return {
				message: n,
				parentId: t[e - 1]?.id ?? null,
				index: e
			};
		});
	}
	getMessageById(e) {
		return this._getMessageRuntime({
			...this.path,
			ref: `${this.path.ref}.messages[messageId=${JSON.stringify(e)}]`,
			messageSelector: {
				type: "messageId",
				messageId: e
			}
		}, () => this._threadBinding.getState().getMessageById(e));
	}
	_getMessageRuntime(e, t) {
		return new uc(new pi({
			path: e,
			getState: () => {
				let { message: e, parentId: n, index: r } = t() ?? {}, { messages: i, speech: a } = this._threadBinding.getState();
				if (!e || n === void 0 || r === void 0) return si;
				let o = this._threadBinding.getState().getBranches(e.id);
				return {
					...e,
					[rs]: e[rs],
					index: r,
					isLast: i.at(-1)?.id === e.id,
					parentId: n,
					branchNumber: o.indexOf(e.id) + 1,
					branchCount: o.length,
					speech: a?.messageId === e.id ? a : void 0
				};
			},
			subscribe: (e) => this._threadBinding.subscribe(e)
		}), this._threadBinding);
	}
	_eventSubscriptionSubjects = /* @__PURE__ */ new Map();
	unstable_on(e, t) {
		let n = this._eventSubscriptionSubjects.get(e);
		return n || (n = new gi({
			event: e,
			binding: this._threadBinding
		}), this._eventSubscriptionSubjects.set(e, n)), n.subscribe(t);
	}
}, _c = class {
	get path() {
		return this._core.path;
	}
	_core;
	_threadListBinding;
	constructor(e, t) {
		this._core = e, this._threadListBinding = t, this.__internal_bindMethods();
	}
	__internal_bindMethods() {
		this.switchTo = this.switchTo.bind(this), this.rename = this.rename.bind(this), this.updateCustom = this.updateCustom.bind(this), this.archive = this.archive.bind(this), this.unarchive = this.unarchive.bind(this), this.delete = this.delete.bind(this), this.initialize = this.initialize.bind(this), this.generateTitle = this.generateTitle.bind(this), this.subscribe = this.subscribe.bind(this), this.unstable_on = this.unstable_on.bind(this), this.getState = this.getState.bind(this), this.detach = this.detach.bind(this);
	}
	getState() {
		return this._core.getState();
	}
	switchTo(e) {
		let t = this._core.getState();
		return this._threadListBinding.switchToThread(t.id, e);
	}
	rename(e) {
		let t = this._core.getState();
		return this._threadListBinding.rename(t.id, e);
	}
	updateCustom(e) {
		let t = this._core.getState();
		if (!this._threadListBinding.updateCustom) throw Error("Thread list runtime does not support updating custom metadata");
		return this._threadListBinding.updateCustom(t.id, e);
	}
	archive() {
		let e = this._core.getState();
		return this._threadListBinding.archive(e.id);
	}
	unarchive() {
		let e = this._core.getState();
		return this._threadListBinding.unarchive(e.id);
	}
	delete() {
		let e = this._core.getState();
		return this._threadListBinding.delete(e.id);
	}
	initialize() {
		let e = this._core.getState();
		return this._threadListBinding.initialize(e.id);
	}
	generateTitle(e) {
		let t = this._core.getState();
		return this._threadListBinding.generateTitle(t.id, e);
	}
	unstable_on(e, t) {
		let n = this._core.getState().isMain, r = this._core.getState().id;
		return this.subscribe(() => {
			let i = this._core.getState(), a = i.isMain, o = i.id;
			(n !== a || r !== o) && (n = a, r = o, (e !== "switchedTo" || a) && (e === "switchedAway" && a || gn([t], {}, `Thread list item "${e}"`)));
		});
	}
	subscribe(e) {
		return this._core.subscribe(e);
	}
	detach() {
		let e = this._core.getState();
		this._threadListBinding.detach(e.id);
	}
	__internal_getRuntime() {
		return this;
	}
}, vc = Promise.resolve(), yc = () => {}, bc = (e) => ({
	mainThreadId: e.mainThreadId,
	newThreadId: e.newThreadId,
	threadIds: e.threadIds,
	archivedThreadIds: e.archivedThreadIds,
	isLoading: e.isLoading,
	loadError: e.loadError,
	isLoadingMore: e.isLoadingMore ?? !1,
	hasMore: e.hasMore ?? !1,
	threadItems: e.threadItems
}), xc = (e, t) => {
	if (t === void 0) return si;
	let n = e.getItemById(t);
	return n ? {
		id: n.id,
		remoteId: n.remoteId,
		externalId: n.externalId,
		title: n.title,
		status: n.status,
		lastMessageAt: n.lastMessageAt,
		custom: n.custom,
		isMain: n.id === e.mainThreadId,
		isRunning: e.unstable_isThreadRunning?.(n.id) ?? !1
	} : si;
}, Sc = class {
	_getState;
	_stateBinding;
	_core;
	_runtimeFactory;
	constructor(e, t = gc) {
		this._core = e, this._runtimeFactory = t;
		let n = new mi({
			path: {},
			getState: () => bc(e),
			subscribe: (t) => e.subscribe(t)
		});
		this._getState = n.getState.bind(n), this._stateBinding = n, this._mainThreadListItemRuntime = new _c(new pi({
			path: {
				ref: "threadItems[main]",
				threadSelector: { type: "main" }
			},
			getState: () => xc(this._core, this._core.mainThreadId),
			subscribe: (e) => this._core.subscribe(e)
		}), this._core), this.main = new t(new hi({
			path: {
				ref: "threads.main",
				threadSelector: { type: "main" }
			},
			getState: () => e.getMainThreadRuntimeCore(),
			subscribe: (t) => e.subscribe(t)
		}), this._mainThreadListItemRuntime), this.__internal_bindMethods();
	}
	__internal_bindMethods() {
		this.switchToThread = this.switchToThread.bind(this), this.switchToNewThread = this.switchToNewThread.bind(this), this.unstable_subscribeThreadEvents = this.unstable_subscribeThreadEvents.bind(this), this.getLoadThreadsPromise = this.getLoadThreadsPromise.bind(this), this.reload = this.reload.bind(this), this.reloadMainThread = this.reloadMainThread.bind(this), this.loadMore = this.loadMore.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.getById = this.getById.bind(this), this.getItemById = this.getItemById.bind(this), this.getItemByIndex = this.getItemByIndex.bind(this), this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
	}
	switchToThread(e, t) {
		return this._core.switchToThread(e, t);
	}
	switchToNewThread() {
		return this._core.switchToNewThread();
	}
	unstable_subscribeThreadEvents(e) {
		return this._core.unstable_subscribeThreadEvents?.(e) ?? yc;
	}
	getLoadThreadsPromise() {
		return this._core.getLoadThreadsPromise();
	}
	reload() {
		return this._core.reload?.() ?? vc;
	}
	reloadMainThread() {
		return this._core.reloadMainThread?.() ?? vc;
	}
	loadMore() {
		return this._core.loadMore?.() ?? vc;
	}
	getState() {
		return this._getState();
	}
	subscribe(e) {
		return this._stateBinding.subscribe(e);
	}
	_mainThreadListItemRuntime;
	main;
	get mainItem() {
		return this._mainThreadListItemRuntime;
	}
	_createItemStateBinding(e) {
		return new pi({
			path: {
				ref: `threadItems[threadId=${e}]`,
				threadSelector: {
					type: "threadId",
					threadId: e
				}
			},
			getState: () => xc(this._core, e),
			subscribe: (e) => this._core.subscribe(e)
		});
	}
	getById(e) {
		return new this._runtimeFactory(new hi({
			path: {
				ref: `threads[threadId=${JSON.stringify(e)}]`,
				threadSelector: {
					type: "threadId",
					threadId: e
				}
			},
			getState: () => this._core.getThreadRuntimeCore(e),
			subscribe: (e) => this._core.subscribe(e)
		}), this._createItemStateBinding(e));
	}
	getItemByIndex(e) {
		return new _c(new pi({
			path: {
				ref: `threadItems[${e}]`,
				threadSelector: {
					type: "index",
					index: e
				}
			},
			getState: () => xc(this._core, this._core.threadIds[e]),
			subscribe: (e) => this._core.subscribe(e)
		}), this._core);
	}
	getArchivedItemByIndex(e) {
		return new _c(new pi({
			path: {
				ref: `archivedThreadItems[${e}]`,
				threadSelector: {
					type: "archiveIndex",
					index: e
				}
			},
			getState: () => xc(this._core, this._core.archivedThreadIds[e]),
			subscribe: (e) => this._core.subscribe(e)
		}), this._core);
	}
	getItemById(e) {
		return new _c(this._createItemStateBinding(e), this._core);
	}
}, Cc = class {
	threads;
	_thread;
	_core;
	constructor(e) {
		this._core = e, this.threads = new Sc(e.threads), this._thread = this.threads.main, this.__internal_bindMethods();
	}
	__internal_bindMethods() {
		this.registerModelContextProvider = this.registerModelContextProvider.bind(this);
	}
	get thread() {
		return this._thread;
	}
	registerModelContextProvider(e) {
		return this._core.registerModelContextProvider(e);
	}
}, wc = /* @__PURE__ */ new WeakMap(), Tc = (e) => wc.get(e) ?? 0, Ec = (e, t) => Tc(e) === t, Dc = (e) => {
	wc.set(e, Tc(e) + 1);
}, Oc = class {
	_contextProvider = new _i();
	registerModelContextProvider(e) {
		return this._contextProvider.registerModelContextProvider(e);
	}
	getModelContextProvider() {
		return this._contextProvider;
	}
}, kc = Object.freeze([]), Ac = "DEFAULT_THREAD_ID", jc = Object.freeze([Ac]), Mc = Object.freeze({
	id: Ac,
	remoteId: void 0,
	externalId: void 0,
	status: "regular"
}), Nc = Promise.resolve(), Pc = Object.freeze(j({ [Ac]: Mc })), Fc = class extends di {
	_mainThreadId = Ac;
	_threads = jc;
	_archivedThreads = kc;
	_threadData = Pc;
	adapter = {};
	get isLoading() {
		return this.adapter.isLoading ?? !1;
	}
	get newThreadId() {}
	get threadIds() {
		return this._threads;
	}
	get archivedThreadIds() {
		return this._archivedThreads;
	}
	get threadItems() {
		return this._threadData;
	}
	getLoadThreadsPromise() {
		return Nc;
	}
	_mainThread;
	get mainThreadId() {
		return this._mainThreadId;
	}
	threadFactory;
	constructor(e = {}, t) {
		super(), this.threadFactory = t, this.__internal_setAdapter(e, !0);
	}
	getMainThreadRuntimeCore() {
		return this._mainThread;
	}
	getThreadRuntimeCore() {
		throw Error("Method not implemented.");
	}
	getItemById(e) {
		return Object.hasOwn(this._threadData, e) ? this._threadData[e] : void 0;
	}
	__internal_setAdapter(e, t = !1) {
		let n = this.adapter;
		this.adapter = e;
		let r = e.threadId ?? Ac, i = e.threads ?? kc, a = e.archivedThreads ?? kc, o = n.threadId ?? Ac, s = n.threads ?? kc, c = n.archivedThreads ?? kc;
		(t || (n.isLoading ?? !1) !== (e.isLoading ?? !1) || o !== r || s !== i || c !== a) && ((s !== i || c !== a || o !== r) && (this._threadData = j(Pc, Object.fromEntries(e.threads?.map((e) => [e.id, {
			...e,
			remoteId: e.remoteId,
			externalId: e.externalId,
			status: "regular"
		}]) ?? []), Object.fromEntries(e.archivedThreads?.map((e) => [e.id, {
			...e,
			remoteId: e.remoteId,
			externalId: e.externalId,
			status: "archived"
		}]) ?? []))), s !== i && (this._threads = this.adapter.threads?.map((e) => e.id) ?? kc), c !== a && (this._archivedThreads = this.adapter.archivedThreads?.map((e) => e.id) ?? kc), (t || o !== r) && (t || Dc(this._mainThread), this._mainThreadId = r, this._mainThread = this.threadFactory()), Object.hasOwn(this._threadData, this._mainThreadId) || (this._threadData = j(this._threadData, { [this._mainThreadId]: {
			id: this._mainThreadId,
			remoteId: void 0,
			externalId: void 0,
			status: "regular"
		} })), this._notifySubscribers());
	}
	async reloadMainThread() {
		this._mainThread.unstable_refetchThread && await this._mainThread.unstable_refetchThread();
	}
	async switchToThread(e, t) {
		if (this._mainThreadId === e) return;
		let n = this.adapter.onSwitchToThread;
		if (!n) throw Error("External store adapter does not support switching to thread");
		await n(e);
	}
	async switchToNewThread() {
		let e = this.adapter.onSwitchToNewThread;
		if (!e) throw Error("External store adapter does not support switching to new thread");
		await e();
	}
	async rename(e, t) {
		let n = this.adapter.onRename;
		if (!n) throw Error("External store adapter does not support renaming");
		await n(e, t);
	}
	async updateCustom(e, t) {
		let n = this.adapter.onUpdateCustom;
		if (!n) throw Error("External store adapter does not support updating custom metadata");
		await n(e, t);
	}
	async detach() {}
	async archive(e) {
		let t = this.adapter.onArchive;
		if (!t) throw Error("External store adapter does not support archiving");
		await t(e);
	}
	async unarchive(e) {
		let t = this.adapter.onUnarchive;
		if (!t) throw Error("External store adapter does not support unarchiving");
		await t(e);
	}
	async delete(e) {
		let t = this.adapter.onDelete;
		if (!t) throw Error("External store adapter does not support deleting");
		await t(e);
	}
	initialize(e) {
		return Promise.resolve({
			remoteId: e,
			externalId: void 0
		});
	}
	generateTitle() {
		throw Error("Method not implemented.");
	}
}, Ic = {
	fromArray: (e) => {
		let t = e.map((e) => fs(e, ls(), ws(e.content)));
		return { messages: t.map((e, n) => ({
			parentId: n > 0 ? t[n - 1].id : null,
			message: e
		})) };
	},
	fromBranchableArray: (e, t) => ({
		...t?.headId === void 0 ? void 0 : { headId: t.headId },
		messages: e.map(({ message: e, parentId: t }) => {
			if (!e.id) throw Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
			return {
				parentId: t,
				message: fs(e, e.id, ws(e.content))
			};
		})
	})
}, Lc = (e) => {
	let t = e;
	for (; t.next;) t = t.next;
	return "current" in t ? t : null;
}, Rc = class {
	_value = null;
	func;
	constructor(e) {
		this.func = e;
	}
	get value() {
		return this._value === null && (this._value = this.func()), this._value;
	}
	dirty() {
		this._value = null;
	}
}, zc = class {
	messages = /* @__PURE__ */ new Map();
	head = null;
	root = {
		children: [],
		next: null
	};
	updateLevels(e, t) {
		let n = [{
			message: e,
			level: t
		}];
		for (; n.length > 0;) {
			let e = n.pop();
			e.message.level = e.level;
			for (let t of e.message.children) {
				let r = this.messages.get(t);
				r && n.push({
					message: r,
					level: e.level + 1
				});
			}
		}
	}
	selectPathTo(e) {
		for (let t = e; t; t = t.prev) (t.prev ?? this.root).next = t;
	}
	performOp(e, t, n) {
		let r = t.prev ?? this.root, i = e ?? this.root;
		if (n !== "relink" || r !== i) {
			if (n === "relink") {
				for (let n = e; n; n = n.prev) if (n.current.id === t.current.id) throw Error("MessageRepository(performOp/relink): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
			}
			if (n !== "link" && (r.children = r.children.filter((e) => e !== t.current.id), r.next === t)) {
				let e = r.children.at(-1), t = e ? this.messages.get(e) : null;
				if (t === void 0) throw Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
				r.next = t;
			}
			if (n !== "cut") {
				i.children = [...i.children, t.current.id], t.prev = e, Lc(t) === this.head ? this.selectPathTo(t) : i.next === null && (i.next = t, this.head === i && (this.head = Lc(t)));
				let n = e ? e.level + 1 : 0;
				this.updateLevels(t, n);
			}
		}
	}
	_messages = new Rc(() => {
		let e = Array((this.head?.level ?? -1) + 1);
		for (let t = this.head; t; t = t.prev) e[t.level] = t.current;
		return e;
	});
	get headId() {
		return this.head?.current.id ?? null;
	}
	get canonicalHeadId() {
		let e = this.head;
		for (; e?.current.metadata?.isOptimistic;) e = e.prev;
		return e?.current.id ?? null;
	}
	getMessages(e) {
		if (e === void 0 || e === this.head?.current.id) return this._messages.value;
		let t = this.messages.get(e);
		if (!t) throw Error("MessageRepository(getMessages): Head message not found. This is likely an internal bug in assistant-ui.");
		let n = Array(t.level + 1);
		for (let e = t; e; e = e.prev) n[e.level] = e.current;
		return n;
	}
	addOrUpdateMessage(e, t) {
		let n = this.messages.get(t.id), r = e ? this.messages.get(e) : null;
		if (r === void 0) throw Error("MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui.");
		if (n) {
			n.current = t, this.performOp(r, n, "relink"), this._messages.dirty();
			return;
		}
		let i = {
			prev: r,
			current: t,
			next: null,
			children: [],
			level: r ? r.level + 1 : 0
		};
		this.messages.set(t.id, i), this.performOp(r, i, "link"), this.head === r && (this.head = i), this._messages.dirty();
	}
	getMessage(e) {
		let t = this.messages.get(e);
		if (!t) throw Error("MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui.");
		return {
			parentId: t.prev?.current.id ?? null,
			message: t.current,
			index: t.level
		};
	}
	deleteMessage(e, t) {
		let n = this.messages.get(e);
		if (!n) throw Error("MessageRepository(deleteMessage): Message not found. This is likely an internal bug in assistant-ui.");
		let r = t === void 0 ? n.prev : t === null ? null : this.messages.get(t);
		if (r === void 0) throw Error("MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui.");
		for (let e of n.children) {
			let t = this.messages.get(e);
			if (!t) throw Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
			this.performOp(r, t, "relink");
		}
		this.performOp(null, n, "cut"), this.messages.delete(e), this.head === n && (this.head = Lc(r ?? this.root)), this._messages.dirty();
	}
	getBranches(e) {
		let t = this.messages.get(e);
		if (!t) throw Error("MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui.");
		let { children: n } = t.prev ?? this.root;
		return n;
	}
	evictOffBranchOptimisticMessages(e, t) {
		if (!e) return;
		let n = /* @__PURE__ */ new Set();
		for (let e = t; e; e = e.prev) n.add(e.current.id);
		let r = [];
		for (let t = e; t && !n.has(t.current.id); t = t.prev) t.current.metadata?.isOptimistic && r.push(t.current.id);
		for (let e of r) this.messages.has(e) && this.deleteMessage(e);
	}
	switchToBranch(e) {
		let t = this.messages.get(e);
		if (!t) throw Error("MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui.");
		let n = this.head;
		this.selectPathTo(t), this.head = Lc(t), this.evictOffBranchOptimisticMessages(n, this.head), this._messages.dirty();
	}
	resetHead(e) {
		if (e === null) {
			this.clear();
			return;
		}
		let t = this.messages.get(e);
		if (!t) throw Error("MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui.");
		let n = this.head;
		if (t.children.length > 0) {
			let e = [...t.children];
			for (; e.length > 0;) {
				let t = e.pop(), n = this.messages.get(t);
				if (n) {
					for (let t of n.children) e.push(t);
					this.messages.delete(t);
				}
			}
			t.children = [], t.next = null;
		}
		this.head = t, this.selectPathTo(t), this.evictOffBranchOptimisticMessages(n, this.head), this._messages.dirty();
	}
	clear() {
		this.messages.clear(), this.head = null, this.root = {
			children: [],
			next: null
		}, this._messages.dirty();
	}
	export() {
		let e = [], t = [...this.root.children].reverse();
		for (; t.length > 0;) {
			let n = this.messages.get(t.pop());
			if (!n) continue;
			for (let e = n.children.length - 1; e >= 0; e--) t.push(n.children[e]);
			if (n.current.metadata?.isOptimistic) continue;
			let r = n.prev;
			for (; r && r.current.metadata?.isOptimistic;) r = r.prev;
			e.push({
				message: n.current,
				parentId: r?.current.id ?? null
			});
		}
		return {
			headId: this.canonicalHeadId,
			messages: e
		};
	}
	import({ headId: e, messages: t }) {
		for (let { message: e, parentId: n } of t) this.addOrUpdateMessage(n, e);
		this.resetHead(e ?? t.at(-1)?.message.id ?? null);
	}
}, Bc = Object.freeze([]);
//#endregion
//#region node_modules/@assistant-ui/core/dist/runtime/utils/tool-call-tree.js
function* Vc(e) {
	for (let t of e) if (t?.role === "assistant" && Array.isArray(t.content)) for (let e of t.content) e && e.type === "tool-call" && (yield {
		part: e,
		messageId: t.id
	}, e.messages?.length && (yield* Vc(e.messages)));
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/adapters/attachment.js
function Hc(e, t) {
	if (t === "*") return !0;
	let n = t.split(",").map((e) => e.trim().toLowerCase()), r = e.name.toLowerCase(), i = e.type.split(";", 1)[0].trim().toLowerCase();
	for (let e of n) {
		if (e.startsWith(".") && r.endsWith(e) || e.includes("/") && e === i) return !0;
		if (e.endsWith("/*")) {
			let t = e.split("/")[0];
			if (i.startsWith(`${t}/`)) return !0;
		}
	}
	return !1;
}
function Uc(e) {
	let t = ls();
	return e.type === "image" ? {
		id: t,
		type: "image",
		name: e.filename ?? "image",
		content: [e],
		status: { type: "complete" }
	} : e.type === "file" ? {
		id: t,
		type: "document",
		name: e.filename ?? "document",
		contentType: e.mimeType,
		content: [e],
		status: { type: "complete" }
	} : e.type === "audio" ? {
		id: t,
		type: "audio",
		name: `audio.${e.audio.format}`,
		contentType: `audio/${e.audio.format}`,
		content: [e],
		status: { type: "complete" }
	} : {
		id: t,
		type: "data",
		name: e.name,
		content: [e],
		status: { type: "complete" }
	};
}
function Wc(e) {
	let t = [];
	for (let n of e) n.type !== "text" && t.push(Uc(n));
	return t;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/types/attachment.js
var Gc = (e) => "content" in e && !("lastModified" in e), Kc = (e) => e.status.type === "complete", qc = class {
	operations = /* @__PURE__ */ new Set();
	start() {
		let e = {
			cancelled: !1,
			attachmentIds: /* @__PURE__ */ new Set()
		};
		return this.operations.add(e), e;
	}
	accept(e, t) {
		return !e.cancelled && (e.attachmentIds.add(t), !0);
	}
	finish(e) {
		this.operations.delete(e);
	}
	isCancelled(e) {
		return e.cancelled;
	}
	cancel(e) {
		for (let t of [...this.operations]) t.attachmentIds.has(e) && (t.cancelled = !0, this.operations.delete(t));
	}
	cancelAll() {
		for (let e of this.operations) e.cancelled = !0;
		this.operations.clear();
	}
}, Jc = async (e, t) => {
	if (Symbol.asyncIterator in e) {
		for await (let n of e) if (!t(n)) break;
	} else t(await e);
}, Yc = class extends di {
	isEditing = !0;
	enrichWithComposerMetadata(e, t) {
		return t ? {
			...e,
			metadata: {
				...e.metadata,
				custom: {
					...e.metadata?.custom,
					...t
				}
			}
		} : e;
	}
	get attachmentAccept() {
		return this.getAttachmentAdapter()?.accept ?? "*";
	}
	_attachments = [];
	get attachments() {
		return this._attachments;
	}
	setAttachments(e) {
		this._attachments = e, this._notifySubscribers();
	}
	get isEmpty() {
		return !this.text.trim() && !this.attachments.length;
	}
	_text = "";
	get text() {
		return this._text;
	}
	_role = "user";
	get role() {
		return this._role;
	}
	_runConfig = {};
	get runConfig() {
		return this._runConfig;
	}
	_quote = void 0;
	get quote() {
		return this._quote;
	}
	setQuote(e) {
		this._quote !== e && (this._quote = e, this._notifySubscribers());
	}
	setText(e) {
		this._text !== e && (this._text = e, this._rebaseDictation(e), this._notifySubscribers());
	}
	_rebaseDictation(e) {
		if (!this._dictation) return;
		this._dictationBaseText = e, this._currentInterimText = "";
		let { status: t, inputDisabled: n } = this._dictation;
		this._dictation = n ? {
			status: t,
			inputDisabled: n
		} : { status: t };
	}
	setRole(e) {
		this._role !== e && (this._role = e, this._notifySubscribers());
	}
	setRunConfig(e) {
		this._runConfig !== e && (this._runConfig = e, this._notifySubscribers());
	}
	_isSending = !1;
	_removedDuringSend = /* @__PURE__ */ new Set();
	_sendGeneration = 0;
	_attachmentAddOperations = new qc();
	_cancelAttachmentAdd(e) {
		this._attachmentAddOperations.cancel(e);
	}
	_cancelAllAttachmentAdds() {
		this._attachmentAddOperations.cancelAll();
	}
	_emptyTextAndAttachments() {
		this._attachments = [], this._text = "", this._rebaseDictation(""), this._notifySubscribers();
	}
	async _onClearAttachments() {
		let e = this.getAttachmentAdapter();
		if (e) {
			let t = this._attachments.filter((e) => !Kc(e));
			await Promise.all(t.map(async (t) => e.remove(t)));
		}
	}
	async reset() {
		if (this._cancelAllAttachmentAdds(), this._sendGeneration++, this._isSending = !1, this._removedDuringSend.clear(), this._attachments.length === 0 && this._text === "" && this._role === "user" && Object.keys(this._runConfig).length === 0 && this._quote === void 0) return;
		this._role = "user", this._runConfig = {}, this._quote = void 0;
		let e = this._onClearAttachments();
		this._emptyTextAndAttachments(), await e;
	}
	async clearAttachments() {
		if (this._cancelAllAttachmentAdds(), this._isSending) for (let e of this._attachments) this._removedDuringSend.add(e.id);
		let e = this._onClearAttachments();
		this.setAttachments([]), await e;
	}
	async send(e) {
		if (!this.canSend || this._isSending) return;
		if (this._dictationSession) try {
			this._dictationSession.cancel();
		} catch (e) {
			console.error("[assistant-ui] Dictation session cancel threw", e);
		} finally {
			this._cleanupDictation();
		}
		let t = this.getAttachmentAdapter(), n = this.attachments.map(async (e) => {
			if (Kc(e)) return e;
			if (!t) throw Error("Attachments are not supported");
			return await t.send(e);
		}), r = this.attachments, i = this.text, a = this._quote, o = this.role, s = this.runConfig;
		this._quote = void 0, this._text = "", this._isSending = !0;
		let c = ++this._sendGeneration;
		this._notifySubscribers();
		let l;
		try {
			l = await Promise.all(n);
		} catch (e) {
			throw c === this._sendGeneration && (!this.text.trim() && this._quote === void 0 && (this._text = i, this._rebaseDictation(i), this._quote = a, this._notifySubscribers()), Promise.allSettled(n).then(() => {
				c === this._sendGeneration && (this._removedDuringSend.clear(), this._isSending = !1, this._notifySubscribers());
			})), e;
		}
		if (c !== this._sendGeneration) return;
		let u = new Set(r.map((e) => e.id));
		this._attachments = this._attachments.filter((e) => !u.has(e.id)), this._isSending = !1, this._notifySubscribers();
		let d = l.filter((e) => !this._removedDuringSend.has(e.id));
		this._removedDuringSend.clear();
		let f = {
			createdAt: /* @__PURE__ */ new Date(),
			role: o,
			content: i ? [{
				type: "text",
				text: i
			}] : [],
			attachments: d,
			runConfig: s,
			metadata: { custom: { ...a ? { quote: a } : {} } }
		}, p = {
			text: i,
			quote: a,
			attachments: d
		}, m;
		try {
			m = this.handleSend(f, e);
		} catch (e) {
			throw this._restoreUnsentDraft(e, c, p), e;
		}
		m && m.catch((e) => {
			this._restoreUnsentDraft(e, c, p);
		}), this._notifyEventSubscribers("send", {
			chars: i.length,
			attachments: d.length
		});
	}
	restoreDraft(e) {
		return this._text.trim() || this._quote !== void 0 || this._attachments.length > 0 ? !1 : (this._text = e.text, this._rebaseDictation(e.text), this._quote = e.quote, this._attachments = e.attachments ?? [], this._notifySubscribers(), !0);
	}
	retractDraft(e) {
		let t = e.attachments === void 0 ? this._attachments.length === 0 : this._attachments === e.attachments;
		this._text === e.text && this._quote === e.quote && t && (this._text = "", this._rebaseDictation(""), this._quote = void 0, this._attachments = [], this._notifySubscribers());
	}
	_restoreUnsentDraft(e, t, n) {
		Us(e) && t === this._sendGeneration && this.restoreDraft(n);
	}
	cancel() {
		this.handleCancel();
	}
	get queue() {
		return Bc;
	}
	moveQueueItem(e, t) {}
	removeQueueItem(e) {}
	async addAttachment(e) {
		if (Gc(e)) {
			let t = this.getAttachmentAdapter();
			if (t && !Hc({
				name: e.name,
				type: e.contentType ?? ""
			}, t.accept)) {
				let n = `File type ${e.contentType || "unknown"} is not accepted. Accepted types: ${t.accept}`, r = Error(n);
				throw this._safeEmitAttachmentAddError("not-accepted", n, void 0, r, e.contentType), r;
			}
			let n = {
				id: e.id ?? ls(),
				type: e.type ?? "document",
				name: e.name,
				contentType: e.contentType,
				content: e.content,
				status: { type: "complete" }
			};
			this._attachments = [...this._attachments, n], this._notifySubscribers(), this._notifyEventSubscribers("attachmentAdd", { ...n.contentType ? { contentType: n.contentType } : void 0 });
			return;
		}
		let t = this.getAttachmentAdapter();
		if (!t) {
			let t = "Attachments are not supported", n = /* @__PURE__ */ Error(t);
			throw this._safeEmitAttachmentAddError("no-adapter", t, void 0, n, e.type), n;
		}
		if (!Hc({
			name: e.name,
			type: e.type
		}, t.accept)) {
			let n = `File type ${e.type || "unknown"} is not accepted. Accepted types: ${t.accept}`, r = Error(n);
			throw this._safeEmitAttachmentAddError("not-accepted", n, void 0, r, e.type), r;
		}
		let n = this._attachmentAddOperations.start(), r = (e) => {
			if (!this._attachmentAddOperations.accept(n, e.id)) return !1;
			let t = this._attachments.findIndex((t) => t.id === e.id);
			return this._attachments = t === -1 ? [...this._attachments, e] : [
				...this._attachments.slice(0, t),
				e,
				...this._attachments.slice(t + 1)
			], this._notifySubscribers(), !0;
		}, i;
		try {
			await Jc(t.add({ file: e }), (e) => (i = e, r(e)));
		} catch (t) {
			if (this._attachmentAddOperations.isCancelled(n)) return;
			throw i && r({
				...i,
				status: {
					type: "incomplete",
					reason: "error",
					message: t instanceof Error ? t.message : String(t)
				}
			}), this._safeEmitAttachmentAddError("adapter-error", t instanceof Error ? t.message : String(t), i?.id, t instanceof Error ? t : void 0, i?.contentType || e.type), t;
		} finally {
			this._attachmentAddOperations.finish(n);
		}
		this._attachmentAddOperations.isCancelled(n) || (i?.status.type === "incomplete" && i.status.reason === "error" ? this._safeEmitAttachmentAddError("adapter-error", i.status.message ?? "Attachment upload did not complete successfully.", i.id, void 0, i.contentType || e.type) : this._notifyEventSubscribers("attachmentAdd", { ...i?.contentType ? { contentType: i.contentType } : e.type ? { contentType: e.type } : void 0 }));
	}
	_safeEmitAttachmentAddError(e, t, n, r, i) {
		try {
			this._notifyEventSubscribers("attachmentAddError", {
				reason: e,
				message: t,
				...n !== void 0 && { attachmentId: n },
				...r !== void 0 && { error: r },
				...i ? { contentType: i } : void 0
			});
		} catch (e) {
			console.error("[assistant-ui] attachmentAddError subscriber threw:", e);
		}
	}
	async removeAttachment(e) {
		let t = this._attachments.findIndex((t) => t.id === e);
		if (t === -1) throw Error("Attachment not found");
		let n = this._attachments[t];
		if (this._cancelAttachmentAdd(e), this._isSending && this._removedDuringSend.add(e), !Kc(n)) {
			let t = this.getAttachmentAdapter();
			if (!t) throw Error("Attachments are not supported");
			try {
				await t.remove(n);
			} catch (t) {
				let n = t instanceof Error ? t.message : String(t);
				throw this._attachments = this._attachments.map((t) => t.id === e && !Kc(t) ? {
					...t,
					status: {
						type: "incomplete",
						reason: "error",
						message: n
					}
				} : t), this._notifySubscribers(), t;
			}
		}
		this._attachments = this._attachments.filter((t) => t.id !== e), this._notifySubscribers();
	}
	_dictation;
	_dictationSession;
	_dictationUnsubscribes = [];
	_dictationBaseText = "";
	_currentInterimText = "";
	_dictationSessionIdCounter = 0;
	_activeDictationSessionId;
	_isCleaningDictation = !1;
	get dictation() {
		return this._dictation;
	}
	_isActiveSession(e, t) {
		return this._activeDictationSessionId === e && this._dictationSession === t;
	}
	startDictation() {
		let e = this.getDictationAdapter();
		if (!e) throw Error("Dictation adapter not configured");
		let t = this._dictationSession !== void 0;
		if (this._dictationSession) {
			let e = this._dictationSession;
			this._cleanupDictation({ notify: !1 }), this._stopDictationSession(e);
		}
		let n = e.disableInputDuringDictation ?? !1;
		this._dictationBaseText = this._text, this._currentInterimText = "";
		let r;
		try {
			r = e.listen();
		} catch (e) {
			if (t) try {
				this._notifySubscribers();
			} catch (e) {
				console.error("[assistant-ui] Dictation replacement rollback notification threw", e);
			}
			throw e;
		}
		this._dictationSession = r;
		let i = ++this._dictationSessionIdCounter;
		this._activeDictationSessionId = i, this._dictation = {
			status: r.status,
			inputDisabled: n
		}, this._notifySubscribers();
		let a = r.onSpeech((e) => {
			if (!this._isActiveSession(i, r)) return;
			let t = e.isFinal !== !1, n = this._dictationBaseText && !this._dictationBaseText.endsWith(" ") && e.transcript ? " " : "";
			if (t) {
				if (this._dictationBaseText = this._dictationBaseText + n + e.transcript, this._currentInterimText = "", this._text = this._dictationBaseText, this._dictation) {
					let { transcript: e, ...t } = this._dictation;
					this._dictation = t;
				}
				this._notifySubscribers();
			} else this._currentInterimText = n + e.transcript, this._text = this._dictationBaseText + this._currentInterimText, this._dictation &&= {
				...this._dictation,
				transcript: e.transcript
			}, this._notifySubscribers();
		});
		this._dictationUnsubscribes.push(a);
		let o = r.onSpeechStart(() => {
			this._isActiveSession(i, r) && (this._dictation = {
				status: { type: "running" },
				inputDisabled: n,
				...this._dictation?.transcript && { transcript: this._dictation.transcript }
			}, this._notifySubscribers());
		});
		this._dictationUnsubscribes.push(o);
		let s = r.onSpeechEnd(() => {
			this._cleanupDictation({ sessionId: i });
		});
		this._dictationUnsubscribes.push(s);
		let c = setInterval(() => {
			this._isActiveSession(i, r) && r.status.type === "ended" && this._cleanupDictation({ sessionId: i });
		}, 100);
		this._dictationUnsubscribes.push(() => clearInterval(c));
	}
	stopDictation() {
		if (!this._dictationSession) return;
		let e = this._dictationSession, t = this._activeDictationSessionId;
		this._stopDictationSession(e, () => this._cleanupDictation({ sessionId: t }));
	}
	_stopDictationSession(e, t = () => {}) {
		let n;
		try {
			n = e.stop();
		} catch (e) {
			console.error("[assistant-ui] Dictation session stop threw", e), t();
			return;
		}
		n.then(t, (e) => {
			console.error("[assistant-ui] Dictation session stop rejected", e), t();
		});
	}
	_cleanupDictation(e) {
		if (e?.sessionId !== void 0 && e.sessionId !== this._activeDictationSessionId || this._isCleaningDictation) return;
		this._isCleaningDictation = !0;
		let t = (e) => {
			try {
				e();
			} catch (e) {
				console.error("[assistant-ui] Dictation cleanup threw", e);
			}
		};
		try {
			let n = this._dictationUnsubscribes;
			this._dictationUnsubscribes = [], this._dictationSession = void 0, this._activeDictationSessionId = void 0, this._dictation = void 0, this._dictationBaseText = "", this._currentInterimText = "";
			for (let e of n) t(e);
			e?.notify !== !1 && t(() => this._notifySubscribers());
		} finally {
			this._isCleaningDictation = !1;
		}
	}
	_eventSubscribers = /* @__PURE__ */ new Map();
	_notifyEventSubscribers(e, t) {
		let n = this._eventSubscribers.get(e);
		n && gn(n, t, `Composer runtime "${e}"`);
	}
	unstable_on(e, t) {
		let n = t, r = this._eventSubscribers.get(e);
		return r || (r = /* @__PURE__ */ new Set(), this._eventSubscribers.set(e, r)), r.add(n), () => {
			this._eventSubscribers.get(e)?.delete(n);
		};
	}
}, Xc = (e) => e.capabilities?.cancel ? mc(e) : !1, Zc = class extends Yc {
	get canCancel() {
		return Xc(this.runtime);
	}
	get canSend() {
		return !this.isEmpty && !this.runtime.isSendDisabled && !this.runtime.voice && !this._isSending;
	}
	_queueCache;
	get queue() {
		let e = this.runtime.getSteerQueueItems?.() ?? Bc, t = this.runtime.getQueueItems?.() ?? Bc, n = this._queueCache;
		if (n && n.steer === e && n.queue === t) return n.flat;
		let r = e.length === 0 ? t : t.length === 0 ? e : [...e, ...t];
		return this._queueCache = {
			steer: e,
			queue: t,
			flat: r
		}, r;
	}
	moveQueueItem(e, t) {
		this.runtime.moveQueueItem?.(e, t);
	}
	removeQueueItem(e) {
		this.runtime.removeQueueItem?.(e);
	}
	getAttachmentAdapter() {
		return this.runtime.adapters?.attachments;
	}
	getDictationAdapter() {
		return this.runtime.adapters?.dictation;
	}
	runtime;
	constructor(e) {
		super(), this.runtime = e, this.connect();
	}
	connect() {
		let e = !1, t = this.runtime.isSendDisabled, n = this.runtime.voice !== void 0, r = this.queue;
		return this.runtime.subscribe(() => {
			let i = !1, a = this.canCancel;
			e !== a && (e = a, i = !0), t !== this.runtime.isSendDisabled && (t = this.runtime.isSendDisabled, i = !0);
			let o = this.runtime.voice !== void 0;
			n !== o && (n = o, i = !0), r !== this.queue && (r = this.queue, i = !0), i && this._notifySubscribers();
		});
	}
	async handleSend(e, t) {
		return this.runtime.append({
			...e,
			parentId: this.runtime.messages.at(-1)?.id ?? null,
			sourceId: null,
			startRun: t?.startRun,
			steer: t?.steer
		});
	}
	async handleCancel() {
		this.runtime.cancelRun();
	}
}, Qc = class extends Yc {
	get canCancel() {
		return !0;
	}
	get canSend() {
		return !this.isEmpty && !this.runtime.voice && !this._isSending;
	}
	getAttachmentAdapter() {
		return this.runtime.adapters?.attachments;
	}
	getDictationAdapter() {
		return this.runtime.adapters?.dictation;
	}
	_nonTextPassthrough;
	_parentId;
	_sourceId;
	runtime;
	endEditCallback;
	constructor(e, t, { parentId: n, message: r }) {
		super(), this.runtime = e;
		let i = e.voice !== void 0, a = e.subscribe(() => {
			let t = e.voice !== void 0;
			t !== i && (i = t, this._notifySubscribers());
		});
		this.endEditCallback = () => {
			a(), t();
		}, this._parentId = n, this._sourceId = r.id, this.setText(nc(r)), this.setRole(r.role);
		let o;
		r.role === "user" ? (o = [...r.attachments ?? [], ...Wc(r.content)], this._nonTextPassthrough = []) : (o = r.attachments ?? [], this._nonTextPassthrough = r.content.filter((e) => e.type !== "text")), this.setAttachments(o), this.setRunConfig({ ...e.composer.runConfig });
	}
	get parentId() {
		return this._parentId;
	}
	get sourceId() {
		return this._sourceId;
	}
	async handleSend(e, t) {
		let n = this._nonTextPassthrough.length > 0 ? [...e.content, ...this._nonTextPassthrough] : e.content, r = this.runtime.append({
			...e,
			content: n,
			parentId: this._parentId,
			sourceId: this._sourceId,
			startRun: t?.startRun
		});
		return this.handleCancel(), r;
	}
	handleCancel() {
		this.endEditCallback(), this._notifySubscribers();
	}
}, $c = class extends di {
	_isInitialized = !1;
	repository = new zc();
	_voiceMessages = [];
	_voiceGeneration = 0;
	_cachedMergedMessages = null;
	_cachedVoiceGeneration = -1;
	_cachedMergedBase = null;
	_markVoiceMessagesDirty() {
		this._voiceGeneration++, this._cachedMergedMessages = null;
	}
	_getBaseMessages() {
		return this.repository.getMessages();
	}
	_commitVoiceMessage(e) {}
	get messages() {
		if (this._voiceMessages.length === 0) return this._getBaseMessages();
		let e = this._getBaseMessages();
		if (this._cachedVoiceGeneration !== this._voiceGeneration || this._cachedMergedBase !== e) {
			let t = new Set(e.map((e) => e.id));
			this._cachedMergedMessages = [...e, ...this._voiceMessages.filter((e) => !t.has(e.id))], this._cachedVoiceGeneration = this._voiceGeneration, this._cachedMergedBase = e;
		}
		return this._cachedMergedMessages;
	}
	get state() {
		let e;
		for (let t of this.messages) t.role === "assistant" && (e = t);
		return e?.metadata.unstable_state ?? null;
	}
	composer = new Zc(this);
	_contextProvider;
	constructor(e) {
		super(), this._contextProvider = e;
	}
	getModelContext() {
		return this._contextProvider.getModelContext();
	}
	enrichAppendMetadata(e, t = e.parentId) {
		if (e.role !== "user") return e;
		let n = this.messages, r = t === null ? -1 : n.findIndex((e) => e.id === t), i = es(this.getModelContext().unstable_composerMetadata, n.slice(0, r + 1));
		return i ? {
			...e,
			metadata: {
				...e.metadata,
				custom: {
					...e.metadata?.custom,
					...i
				}
			}
		} : e;
	}
	_editComposers = /* @__PURE__ */ new Map();
	getEditComposer(e) {
		return this._editComposers.get(e);
	}
	_isVoiceMessage(e) {
		return e !== null && this._voiceMessages.some((t) => t.id === e);
	}
	_resolveAppendParent(e) {
		return this._isVoiceMessage(e) ? this._getBaseMessages().at(-1)?.id ?? null : e;
	}
	beginEdit(e) {
		if (this.voice) throw Error("Cannot edit a message while a voice session is connected");
		if (this._isVoiceMessage(e)) throw Error("Voice transcript messages cannot be edited");
		if (this._editComposers.has(e)) throw Error("Edit already in progress");
		this._editComposers.set(e, new Qc(this, () => this._editComposers.delete(e), this.repository.getMessage(e))), this._notifySubscribers();
	}
	getMessageById(e) {
		try {
			return this.repository.getMessage(e);
		} catch {
			let t = this.repository.getMessages(), n = this._voiceMessages.findIndex((t) => t.id === e);
			return n === -1 ? void 0 : {
				parentId: n > 0 ? this._voiceMessages[n - 1].id : t.at(-1)?.id ?? null,
				message: this._voiceMessages[n],
				index: t.length + n
			};
		}
	}
	getBranches(e) {
		return this._voiceMessages.some((t) => t.id === e) ? [] : this.repository.getBranches(e);
	}
	switchToBranch(e) {
		this.repository.switchToBranch(e), this._notifySubscribers();
	}
	_notifyEventSubscribers(e, t) {
		let n = this._eventSubscribers.get(e);
		n && gn(n, t, `Thread runtime "${e}"`);
	}
	_notifyToolApprovalAnswered(e, t, n, r) {
		this._notifyEventSubscribers("toolApprovalAnswered", {
			messageId: e,
			toolCallId: t,
			toolName: n,
			approved: r
		});
	}
	submitFeedback({ messageId: e, type: t, comment: n }) {
		let r = this.adapters?.feedback, i = this.getMessageById(e);
		if (!i) throw Error(`Message not found: ${e}`);
		let { message: a, parentId: o } = i, s = n?.trim(), c = {
			type: t,
			...s ? { comment: s } : void 0
		};
		if (r?.submit({
			message: a,
			...c
		}), a.role === "assistant") {
			let t = {
				...a,
				metadata: {
					...a.metadata,
					submittedFeedback: c
				}
			}, n = this._voiceMessages.findIndex((t) => t.id === e);
			n === -1 ? this.repository.addOrUpdateMessage(o, t) : (this._voiceMessages[n] = t, this._currentAssistantMsg === a && (this._currentAssistantMsg = t), this._markVoiceMessagesDirty());
		}
		this._notifySubscribers();
	}
	_stopSpeaking;
	speech;
	speak(e) {
		let t = this.adapters?.speech;
		if (!t) throw Error("Speech adapter not configured");
		let n = this.getMessageById(e);
		if (!n) throw Error(`Message not found: ${e}`);
		let { message: r } = n, i = this._stopSpeaking, a;
		try {
			i?.(), a = t.speak(nc(r));
		} catch (e) {
			if (i && !this._stopSpeaking) try {
				this._notifySubscribers();
			} catch (e) {
				console.error("[assistant-ui] Speech rollback notification threw", e);
			}
			throw e;
		}
		let o, s = () => {
			this._stopSpeaking = void 0, this.speech = void 0;
			let e = o;
			o = void 0, e?.();
		}, c = () => {
			if (this._stopSpeaking === c) try {
				s();
			} finally {
				a.cancel();
			}
		}, l = () => {
			this._stopSpeaking === c && (a.status.type === "ended" ? ci([s, () => this._notifySubscribers()]) : (this.speech = {
				messageId: e,
				status: a.status
			}, this._notifySubscribers()));
		};
		this._stopSpeaking = c;
		try {
			if (o = a.subscribe(l), this._stopSpeaking !== c) {
				o();
				return;
			}
			l();
		} catch (e) {
			if (this._stopSpeaking === c) try {
				ci([c, () => this._notifySubscribers()]);
			} catch (e) {
				console.error("[assistant-ui] Speech rollback cleanup threw", e);
			}
			throw e;
		}
	}
	stopSpeaking() {
		if (!this._stopSpeaking) throw Error("No message is being spoken");
		ci([this._stopSpeaking, () => this._notifySubscribers()]);
	}
	_voiceSession;
	_voiceUnsubs = [];
	voice;
	_voiceVolume = 0;
	_voiceVolumeSubscribers = /* @__PURE__ */ new Set();
	getVoiceVolume = () => this._voiceVolume;
	subscribeVoiceVolume = (e) => (this._voiceVolumeSubscribers.add(e), () => this._voiceVolumeSubscribers.delete(e));
	_onVoiceConnected() {}
	_onVoiceDisconnected() {}
	_isRunActive() {
		if (this.isRunning) return !0;
		let e = this._getBaseMessages().at(-1);
		return e?.role === "assistant" && (e.status.type === "running" || e.status.type === "requires-action");
	}
	connectVoice() {
		let e = this.adapters?.voice;
		if (!e) throw Error("Voice adapter not configured");
		if (this._isRunActive()) throw Error("Cannot start a voice session while a run is in progress or paused on a pending tool action");
		let t = this._voiceSession !== void 0;
		try {
			this._disconnectVoice(!1);
		} catch (e) {
			console.error("[assistant-ui] Voice cleanup threw before reconnect", e);
		}
		let n;
		try {
			n = e.connect({});
		} catch (e) {
			throw t && this._voiceSession === void 0 && this._onVoiceDisconnected(), e;
		}
		this._voiceSession = n;
		let r = [];
		this._voiceUnsubs = r;
		let i = () => {
			if (this._voiceSession === n && this._voiceUnsubs === r) return !1;
			try {
				ci(r.splice(0));
			} catch (e) {
				console.error("[assistant-ui] Detached voice setup cleanup threw", e);
			}
			return !0;
		};
		try {
			let e = "listening";
			if (this.voice = {
				status: n.status,
				isMuted: n.isMuted,
				mode: e
			}, this._voiceVolume = 0, this._notifySubscribers(), i() || (r.push(n.onStatusChange((t) => {
				this._voiceSession === n && (t.type === "ended" ? (this._finishVoiceAssistantMessage(), this._voiceSession = void 0, this.voice = void 0, this._onVoiceDisconnected()) : this.voice = {
					status: t,
					isMuted: n.isMuted,
					mode: e
				}, this._notifySubscribers());
			})), i()) || (r.push(n.onModeChange((t) => {
				e = t, this.voice && (this.voice = {
					...this.voice,
					mode: t
				}, this._notifySubscribers());
			})), i()) || (r.push(n.onVolumeChange((e) => {
				this._voiceVolume = e, gn(this._voiceVolumeSubscribers, void 0, "Voice volume");
			})), i())) return;
			r.push(n.onTranscript((e) => {
				this._handleVoiceTranscript(e);
			})), i() || this._onVoiceConnected();
		} catch (e) {
			if (this._voiceSession === n && this._voiceUnsubs === r) {
				try {
					this._disconnectVoice(!1);
				} catch (e) {
					console.error("[assistant-ui] Voice rollback cleanup threw", e);
				}
				t && this._voiceSession === void 0 && this._onVoiceDisconnected();
			} else i();
			throw e;
		}
	}
	_currentAssistantMsg = null;
	_handleVoiceTranscript(e) {
		if (this.ensureInitialized(), e.role === "user") {
			if (this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null, e.isFinal) {
				let t = {
					id: ls(),
					role: "user",
					content: [{
						type: "text",
						text: e.text
					}],
					metadata: {
						modality: "voice",
						custom: {}
					},
					createdAt: /* @__PURE__ */ new Date(),
					status: {
						type: "complete",
						reason: "unknown"
					},
					attachments: []
				};
				this._voiceMessages.push(t), this._commitVoiceMessage(t), this._markVoiceMessagesDirty(), this._notifySubscribers();
			}
		} else {
			let t = e.isFinal ? {
				type: "complete",
				reason: "stop"
			} : { type: "running" };
			if (!this._currentAssistantMsg) this._currentAssistantMsg = {
				id: ls(),
				role: "assistant",
				content: [{
					type: "text",
					text: e.text
				}],
				metadata: {
					unstable_state: this.state,
					unstable_annotations: [],
					unstable_data: [],
					steps: [],
					modality: "voice",
					custom: {}
				},
				status: t,
				createdAt: /* @__PURE__ */ new Date()
			}, this._voiceMessages.push(this._currentAssistantMsg);
			else {
				let n = this._voiceMessages.indexOf(this._currentAssistantMsg);
				if (n === -1) return;
				let r = {
					...this._currentAssistantMsg,
					content: [{
						type: "text",
						text: e.text
					}],
					status: t
				};
				this._voiceMessages[n] = r, this._currentAssistantMsg = r;
			}
			e.isFinal && (this._commitVoiceMessage(this._currentAssistantMsg), this._currentAssistantMsg = null), this._markVoiceMessagesDirty(), this._notifySubscribers();
		}
	}
	_finishVoiceAssistantMessage(e = !0) {
		let t = this._voiceMessages.at(-1);
		if (t?.role === "assistant" && t.status.type === "running") {
			let n = this._voiceMessages.length - 1;
			this._voiceMessages[n] = {
				...t,
				status: {
					type: "complete",
					reason: "stop"
				}
			}, this._commitVoiceMessage(this._voiceMessages[n]), this._currentAssistantMsg = null, this._markVoiceMessagesDirty(), e && this._notifySubscribers();
		}
	}
	disconnectVoice() {
		this._disconnectVoice(!0);
	}
	_disconnectVoice(e) {
		this._finishVoiceAssistantMessage(!1), this._currentAssistantMsg = null;
		let t = this._voiceUnsubs.splice(0);
		this._voiceUnsubs = [];
		let n = this._voiceSession;
		this._voiceSession = void 0, this.voice = void 0, this._voiceVolume = 0;
		let r = this.speech && this._isVoiceMessage(this.speech.messageId) ? this._stopSpeaking : void 0;
		this._voiceMessages = [], this._markVoiceMessagesDirty();
		try {
			ci([
				...t,
				...r ? [r] : [],
				...n ? [() => n.disconnect()] : [],
				() => gn(this._voiceVolumeSubscribers, void 0, "Voice volume"),
				() => this._notifySubscribers()
			]);
		} finally {
			e && n && this._voiceSession === void 0 && this._onVoiceDisconnected();
		}
	}
	muteVoice() {
		if (!this._voiceSession) throw Error("No active voice session");
		this._voiceSession.mute(), this.voice = {
			...this.voice,
			isMuted: !0
		}, this._notifySubscribers();
	}
	unmuteVoice() {
		if (!this._voiceSession) throw Error("No active voice session");
		this._voiceSession.unmute(), this.voice = {
			...this.voice,
			isMuted: !1
		}, this._notifySubscribers();
	}
	ensureInitialized() {
		this._isInitialized || (this._isInitialized = !0, this._notifyEventSubscribers("initialize", {}));
	}
	export() {
		return this.repository.export();
	}
	import(e) {
		this.ensureInitialized(), this.repository.clear(), this.repository.import(e), this._notifySubscribers();
	}
	reset(e) {
		this.import(Ic.fromArray(e ?? []));
	}
	_eventSubscribers = /* @__PURE__ */ new Map();
	unstable_on(e, t) {
		let n = t;
		if (e === "modelContextUpdate") return this._contextProvider.subscribe?.(() => gn([n], {}, `Thread runtime "${e}"`)) ?? (() => {});
		let r = this._eventSubscribers.get(e);
		return r || (r = /* @__PURE__ */ new Set(), this._eventSubscribers.set(e, r)), r.add(n), e === "initialize" && this._isInitialized && queueMicrotask(() => {
			r.has(n) && gn([n], {}, `Thread runtime "${e}"`);
		}), () => {
			this._eventSubscribers.get(e)?.delete(n);
		};
	}
}, el = Symbol.for("assistant-stream.tool-execution-id"), tl = (e) => {
	try {
		return JSON.parse(e), !0;
	} catch {
		return !1;
	}
}, nl = (e) => {
	try {
		return JSON.parse(e);
	} catch {
		return;
	}
}, rl = (e, t) => {
	let n = nl(e), r = nl(t);
	return n === void 0 || r === void 0 ? !1 : La(n, r);
}, il = (e) => e[el], al = class {
	_getTools;
	_callbacks;
	_isClientToolCall;
	_entries = /* @__PURE__ */ new Map();
	_humanInput = /* @__PURE__ */ new Map();
	_executing = /* @__PURE__ */ new Set();
	_discardedToolCallIds = /* @__PURE__ */ new Set();
	_settledResolvers = [];
	_statuses = /* @__PURE__ */ new Map();
	_ac = new AbortController();
	_pendingRestore = !0;
	_lastSnapshot = null;
	_isRunning = !1;
	_controller;
	_pipelineDead = !1;
	_pipelineRestartUsed = !1;
	constructor(e, t, n) {
		this._getTools = e, this._callbacks = t, this._isClientToolCall = n, this._initPipeline();
	}
	_initPipeline() {
		let [e, t] = oo();
		this._controller = t;
		let n = Vo(() => this._getWrappedTools(), () => this._ac.signal, (e, t, n) => this._onHumanInput(e, t, n), {
			onExecutionStart: (e, t, n) => this._onExecutionStart(e, n),
			onExecutionEnd: (e, t, n) => this._onExecutionEnd(e, n)
		});
		e.pipeThrough(n).pipeThrough(new lo()).pipeTo(new WritableStream({ write: (e) => {
			try {
				if (e.type !== "result") return;
				this._handleResultChunk(e);
			} catch (e) {
				console.error("[ToolInvocationTracker] result chunk handling failed", e);
			}
		} })).catch((e) => {
			console.error("[ToolInvocationTracker] stream pipeline failed; will attempt single restart on next setState", e), this._pipelineDead = !0;
		});
	}
	setState(e) {
		try {
			if (this._pipelineDead) {
				if (this._pipelineRestartUsed) return;
				this._pipelineRestartUsed = !0, this._pipelineDead = !1, this._demoteEntriesToRestored(), this._executing.clear(), this._ac = new AbortController(), this._initPipeline();
			}
			if (this._lastSnapshot && this._lastSnapshot.messages === e.messages && this._lastSnapshot.isRunning === e.isRunning && this._lastSnapshot.isLoading === e.isLoading) return;
			e.isLoading === !0 && (this._pendingRestore = !0);
			let t = this._isRunning;
			this._isRunning = e.isRunning;
			try {
				this._processMessages(e.messages);
			} catch (e) {
				throw this._isRunning = t, e;
			}
			this._lastSnapshot = e, this._pendingRestore = !1;
		} catch (e) {
			console.error("[ToolInvocationTracker] setState failed; snapshot dropped", e);
		}
	}
	reset() {
		try {
			this._pendingRestore = !0, this._entries.clear(), this._discardedToolCallIds.clear(), this._lastSnapshot = null, this.abort(), this._statuses.size > 0 && (this._statuses = /* @__PURE__ */ new Map(), this._invokeOnStatusesChange());
		} catch (e) {
			console.error("[ToolInvocationTracker] reset failed", e);
		}
	}
	abort(e) {
		try {
			if (this._humanInput.forEach(({ reject: e }) => {
				try {
					e(/* @__PURE__ */ Error("Tool execution aborted"));
				} catch {}
			}), this._humanInput.clear(), e?.discardPending) for (let [e, t] of this._entries) t.controller && (t.argsComplete || t.hasResult || (this._discardedToolCallIds.add(e), t.skipExecute = !0));
			if (this._ac.abort(), this._ac = new AbortController(), this._executing.size === 0) return Promise.resolve();
			let t = new Set(this._executing);
			return new Promise((e) => {
				this._settledResolvers.push({
					executionIds: t,
					resolve: e
				});
			});
		} catch (e) {
			return console.error("[ToolInvocationTracker] abort failed", e), Promise.resolve();
		}
	}
	resume(e, t) {
		try {
			let n = this._humanInput.get(e);
			return n ? (this._humanInput.delete(e), this._setStatus(e, { type: "executing" }), n.resolve(t), !0) : !1;
		} catch (e) {
			return console.error("[ToolInvocationTracker] resume failed", e), !1;
		}
	}
	getStatuses() {
		return this._statuses;
	}
	_getWrappedTools() {
		let e = this._getTools();
		if (e) return Object.fromEntries(Object.entries(e).map(([e, t]) => {
			let n = t.execute, r = t.streamCall;
			return n === void 0 && r === void 0 ? [e, t] : [e, {
				...t,
				...n !== void 0 && { execute: (...[e, t]) => {
					let r = il(t), i = this._captureExecution(t.toolCallId, r);
					return !i || i.skipExecute ? new Promise(() => {}) : n(e, t);
				} },
				...r !== void 0 && { streamCall: (...[e, t]) => {
					let n = il(t);
					if (this._captureExecution(t.toolCallId, n)) return r(e, t);
				} }
			}];
		}));
	}
	_captureExecution(e, t) {
		if (t === void 0) return;
		let n = this._entries.get(e);
		if (n?.controller) return n.executionId === void 0 && (n.executionId = t), n.executionId === t ? n : void 0;
	}
	_onHumanInput(e, t, n) {
		return new Promise((r, i) => {
			let a = this._entries.get(e);
			if (!a?.controller || a.executionId !== n) {
				i(/* @__PURE__ */ Error("Tool execution aborted"));
				return;
			}
			let o = this._humanInput.get(e);
			if (o) try {
				o.reject(/* @__PURE__ */ Error("Human input request was superseded by a new request"));
			} catch {}
			this._humanInput.set(e, {
				executionId: n,
				resolve: r,
				reject: i
			}), this._setStatus(e, {
				type: "interrupt",
				payload: {
					type: "human",
					payload: t
				}
			});
		});
	}
	_onExecutionStart(e, t) {
		this._captureExecution(e, t) && (this._entries.get(e).skipExecute || (this._executing.add(t), this._humanInput.get(e)?.executionId !== t && this._setStatus(e, { type: "executing" })));
	}
	_onExecutionEnd(e, t) {
		if (t === void 0 || !this._executing.delete(t)) return;
		this._entries.get(e)?.executionId === t && this._deleteStatus(e);
		let n = [];
		this._settledResolvers.forEach(({ executionIds: e, resolve: t }) => {
			if ([...e].some((e) => this._executing.has(e))) {
				n.push({
					executionIds: e,
					resolve: t
				});
				return;
			}
			try {
				t();
			} catch {}
		}), this._settledResolvers.length = 0, this._settledResolvers.push(...n);
	}
	_handleResultChunk(e) {
		let t = e.meta.toolCallId, n = il(e), r = this._entries.get(t);
		r && r.executionId === n && (r?.hasResult || r.skipExecute || this._invokeOnResult({
			type: "add-tool-result",
			toolCallId: t,
			toolName: e.meta.toolName,
			result: e.result,
			isError: e.isError,
			...e.artifact !== void 0 && { artifact: e.artifact },
			...e.modelContent !== void 0 && { modelContent: e.modelContent }
		}));
	}
	_invokeOnResult(e) {
		try {
			this._callbacks.onResult(e);
		} catch (e) {
			console.error("[ToolInvocationTracker] onResult callback threw; result dropped", e);
		}
	}
	_invokeOnStatusesChange() {
		try {
			this._callbacks.onStatusesChange(this._statuses);
		} catch (e) {
			console.error("[ToolInvocationTracker] onStatusesChange callback threw; status change not propagated", e);
		}
	}
	_setStatus(e, t) {
		let n = new Map(this._statuses);
		n.set(e, t), this._statuses = n, this._invokeOnStatusesChange();
	}
	_deleteStatus(e) {
		if (!this._statuses.has(e)) return;
		let t = new Map(this._statuses);
		t.delete(e), this._statuses = t, this._invokeOnStatusesChange();
	}
	_warnProviderOwnedSkip(e, t) {}
	_shouldCloseArgsStream({ argsText: e, hasResult: t, clientOwned: n }) {
		return t ? !0 : tl(e) ? n || !this._isRunning : !1;
	}
	_startActiveEntry(e, t, n, r) {
		let i = {
			toolName: t,
			controller: this._controller.addToolCallPart({
				toolName: t,
				toolCallId: e
			}),
			argsText: "",
			hasResult: !1,
			skipExecute: n,
			argsComplete: !1,
			clientOwned: r
		};
		return this._entries.set(e, i), i;
	}
	_demoteEntriesToRestored() {
		for (let [e, t] of this._entries) if (t.controller) {
			if (!t.argsComplete && !t.hasResult) {
				this._entries.delete(e);
				continue;
			}
			this._entries.set(e, {
				toolName: t.toolName,
				argsText: t.argsText,
				hasResult: t.hasResult
			});
		}
	}
	_processArgsText(e, t) {
		if (!e.controller) return;
		let n = t.result !== void 0;
		if (t.argsText !== e.argsText) {
			let r = !0;
			if (e.argsComplete) rl(e.argsText, t.argsText) && (e.argsText = t.argsText), r = !1;
			else if (!t.argsText.startsWith(e.argsText)) {
				if (tl(e.argsText) && tl(t.argsText) && rl(e.argsText, t.argsText)) {
					let i = this._shouldCloseArgsStream({
						argsText: t.argsText,
						hasResult: n,
						clientOwned: e.clientOwned
					});
					i && e.controller.argsText.close(), e.argsText = t.argsText, e.argsComplete = i, r = !1;
				} else r = !1;
			}
			if (r && e.controller) {
				let r = t.argsText.slice(e.argsText.length);
				e.controller.argsText.append(r);
				let i = this._shouldCloseArgsStream({
					argsText: t.argsText,
					hasResult: n,
					clientOwned: e.clientOwned
				});
				i && e.controller.argsText.close(), e.argsText = t.argsText, e.argsComplete = i;
			}
		}
		!e.argsComplete && e.controller && this._shouldCloseArgsStream({
			argsText: e.argsText,
			hasResult: n,
			clientOwned: e.clientOwned
		}) && (e.controller.argsText.close(), e.argsComplete = !0);
	}
	_processMessages(e) {
		let t = this._pendingRestore;
		for (let { part: n } of Vc(e)) {
			let e = this._entries.get(n.toolCallId);
			if (t) {
				e?.controller || this._entries.set(n.toolCallId, {
					toolName: n.toolName,
					argsText: n.argsText,
					hasResult: n.result !== void 0
				});
				continue;
			}
			let r = e;
			if (n.result !== void 0 && this._discardedToolCallIds.delete(n.toolCallId), r && !r.controller) {
				if (r.hasResult || (n.argsText === r.argsText || tl(r.argsText) && tl(n.argsText) && rl(r.argsText, n.argsText)) && n.result === void 0) continue;
				this._entries.delete(n.toolCallId), r = void 0;
			}
			if (!r) {
				let e = this._isClientToolCall?.(n), t = n.result === void 0 && e === !1;
				t && this._warnProviderOwnedSkip(n.toolName, n.toolCallId), r = this._startActiveEntry(n.toolCallId, n.toolName, n.result !== void 0 || t || this._discardedToolCallIds.has(n.toolCallId), e === !0);
			}
			if (n.approval !== void 0 && (r.skipExecute = !0), this._processArgsText(r, n), n.result !== void 0 && !r.hasResult) {
				let { controller: e } = r;
				if (!e) continue;
				r.hasResult = !0, r.argsComplete = !0, e.setResponse(new Ba({
					result: n.result,
					artifact: n.artifact,
					isError: n.isError,
					...n.modelContent === void 0 ? {} : { modelContent: n.modelContent }
				})), e.close();
			}
		}
	}
}, ol = Object.freeze([]), sl = (e, t) => {
	Promise.resolve(t).catch((t) => {
		console.error(`[ExternalStoreThreadRuntimeCore] ${e} callback rejected`, t);
	});
}, cl = (e, t) => e && t[t.length - 1]?.role !== "assistant", ll = class extends $c {
	_capabilities = {
		switchToBranch: !1,
		switchBranchDuringRun: !1,
		edit: !1,
		delete: !1,
		reload: !1,
		refetchThread: !1,
		cancel: !1,
		unstable_copy: !1,
		speech: !1,
		dictation: !1,
		voice: !1,
		attachments: !1,
		feedback: !1,
		queue: !1
	};
	get capabilities() {
		return this._capabilities;
	}
	_messages;
	isDisabled;
	isSendDisabled;
	get isLoading() {
		return this._store.isLoading ?? !1;
	}
	get isRunning() {
		return this._hasExecutingTools(this._store) ? !0 : this._store.isRunning;
	}
	_getBaseMessages() {
		return this._messages;
	}
	get state() {
		return this._store.state ?? super.state;
	}
	get adapters() {
		return this._store.adapters;
	}
	get unstable_refetchThread() {
		if (this._store.onRefetchThread) return () => this._store.onRefetchThread();
	}
	suggestions = [];
	extras = void 0;
	_converter = new Es();
	_pendingDeleteEvictions = /* @__PURE__ */ new Set();
	_optimistic = null;
	_store;
	_getInitializePromise;
	__internal_setGetInitializePromise(e) {
		this._getInitializePromise = e;
	}
	_transformedQueue;
	_toolInvocations = null;
	_toolStatuses = /* @__PURE__ */ new Map();
	_effectiveIsRunning = !1;
	_inTrackerUpdate = !1;
	_pendingRunningRefresh = !1;
	_runTrackerUpdate(e) {
		this._inTrackerUpdate = !0;
		try {
			e();
		} finally {
			this._inTrackerUpdate = !1;
		}
		this._pendingRunningRefresh && (this._pendingRunningRefresh = !1, this._refreshEffectiveIsRunning());
	}
	_refreshEffectiveIsRunning() {
		let e = this._getEffectiveIsRunning(this._store);
		this._effectiveIsRunning !== e && (this._effectiveIsRunning = e, this._notifyEventSubscribers(e ? "runStart" : "runEnd", {}), this._notifySubscribers());
	}
	_hasExecutingTools(e) {
		if (e.unstable_enableToolInvocations !== !0 || this._toolInvocations === null) return !1;
		for (let e of this._toolStatuses.values()) if (e.type === "executing") return !0;
		return !1;
	}
	_getEffectiveIsRunning(e) {
		return (e.isRunning ?? !1) || this._hasExecutingTools(e);
	}
	beginEdit(e) {
		if (!this._store.onEdit) throw Error("Runtime does not support editing.");
		super.beginEdit(e);
	}
	constructor(e, t) {
		super(e), this.__internal_setAdapter(t);
	}
	__internal_setAdapter(e) {
		this._store !== e && this._updateStoreSnapshot(e);
	}
	_updateStoreSnapshot(e) {
		let t = this._effectiveIsRunning;
		this.isDisabled = e.isDisabled ?? !1, this.isSendDisabled = e.isSendDisabled ?? !1;
		let n = this._store;
		this._store = e;
		let r = this._getEffectiveIsRunning(e), i = e.unstable_messageRepositoryInstance, a = i !== void 0 && i !== this.repository;
		a && (this.repository = i, this._pendingDeleteEvictions.clear()), n?.queue !== e.queue && (this._transformedQueue = void 0, e.queue?.__internal_setDispatchTransform?.((e) => {
			let t = this.messages.at(-1)?.id ?? null;
			return this.enrichAppendMetadata({
				...e,
				parentId: t
			}, t);
		}), e.queue?.__internal_setDispatchTransform && (this._transformedQueue = e.queue)), this.extras !== e.extras && (this.extras = e.extras);
		let o = e.suggestions ?? ol;
		Sr(this.suggestions, o) || (this.suggestions = o);
		let s = {
			switchToBranch: this._store.setMessages !== void 0,
			switchBranchDuringRun: !1,
			edit: this._store.onEdit !== void 0,
			delete: this._store.onDelete !== void 0 || this._store.setMessages !== void 0,
			reload: this._store.onReload !== void 0,
			refetchThread: this._store.onRefetchThread !== void 0,
			cancel: this._store.onCancel !== void 0,
			speech: this._store.adapters?.speech !== void 0,
			dictation: this._store.adapters?.dictation !== void 0,
			voice: this._store.adapters?.voice !== void 0,
			unstable_copy: this._store.unstable_capabilities?.copy !== !1,
			attachments: !!this._store.adapters?.attachments,
			feedback: !!this._store.adapters?.feedback,
			queue: this._store.queue !== void 0
		};
		Sr(this._capabilities, s) || (this._capabilities = s);
		let c;
		if (e.messageRepository) {
			if (n && !a && n.isRunning === e.isRunning && n.messageRepository === e.messageRepository && t === r) {
				this._notifySubscribers();
				return;
			}
			let i = e.messageRepository.messages, o = e.messageRepository.headId ?? i.at(-1)?.message.id ?? null;
			if (n && !a && n.messageRepository === e.messageRepository) this.repository.resetHead(o), c = this.repository.getMessages();
			else {
				let e = new Set(i.map(({ message: e }) => e.id));
				for (let { message: e, parentId: t } of i) this.repository.addOrUpdateMessage(t, e);
				for (let { message: t } of this.repository.export().messages) e.has(t.id) || this.repository.deleteMessage(t.id);
				this._pendingDeleteEvictions.clear(), this.repository.resetHead(o), c = this.repository.getMessages();
			}
		} else if (e.messages) {
			if (n) {
				if (n.convertMessage !== e.convertMessage) this._converter = new Es();
				else if (!a && n.isRunning === e.isRunning && n.messages === e.messages && t === r) {
					this._notifySubscribers();
					return;
				}
			}
			c = e.convertMessage ? this._converter.convertMessages(e.messages, (t, n, i) => {
				if (!e.convertMessage) return n;
				let a = i === (e.messages?.length ?? 0) - 1, o = `${cs}${i}`;
				if (t && (t.role !== "assistant" || !Ss(t.status) || t.status === Ts(t.content, a, r))) {
					if (t.id.startsWith("__external_store_fallback_") && t.id !== o) {
						let e = {
							...t,
							id: o
						};
						return os(e, n), e;
					}
					return t;
				}
				let s = e.convertMessage(n, i), c = fs(s, o, Ts(s.content, a, r));
				return os(c, n), c;
			}) : e.messages;
			let i = /* @__PURE__ */ new Set(), o = [];
			for (let e = c.length - 1; e >= 0; e--) {
				let t = c[e];
				if (i.has(t.id)) {
					console.warn(`ExternalStoreThreadRuntimeCore: duplicate message id "${t.id}" in the provided messages array; keeping the last occurrence.`);
					continue;
				}
				i.add(t.id), o.push(t);
			}
			o.length !== c.length && (c = o.reverse());
			for (let e = 0; e < c.length; e++) {
				let t = c[e], n = c[e - 1];
				this.repository.addOrUpdateMessage(n?.id ?? null, t);
			}
			if (this._pendingDeleteEvictions.size > 0) {
				let e = new Set(c.map((e) => e.id));
				for (let t of this._pendingDeleteEvictions) if (this._pendingDeleteEvictions.delete(t), !e.has(t)) {
					try {
						this.repository.getMessage(t);
					} catch {
						continue;
					}
					this.repository.deleteMessage(t);
				}
			}
		} else throw Error("ExternalStoreAdapter must provide either 'messages' or 'messageRepository'");
		c.length > 0 && this.ensureInitialized(), this._effectiveIsRunning = r, t !== r && (r ? this._notifyEventSubscribers("runStart", {}) : this._notifyEventSubscribers("runEnd", {}));
		let l = null;
		if (cl(r, c)) {
			let e = c.at(-1)?.id ?? null;
			this._optimistic?.parentId !== e && (this._optimistic = {
				id: ls(),
				parentId: e
			}), l = this._optimistic.id, this.repository.addOrUpdateMessage(e, fs({
				role: "assistant",
				content: [],
				metadata: { isOptimistic: !0 }
			}, l, { type: "running" }));
		}
		l === null && (this._optimistic = null), this.repository.resetHead(l ?? c.at(-1)?.id ?? null);
		let u = this.repository.getMessages();
		if ((!this._messages || !Ds(this._messages, u)) && (this._messages = u), this._voiceMessages.length > 0) {
			let e = new Set(this._messages.map((e) => e.id)), t = this._voiceMessages.filter((t) => !e.has(t.id));
			t.length !== this._voiceMessages.length && (this._voiceMessages = t, this._markVoiceMessagesDirty());
		}
		a && this._runTrackerUpdate(() => this._toolInvocations?.reset()), this._runTrackerUpdate(() => this._driveToolInvocations()), this._notifySubscribers();
	}
	_driveToolInvocations() {
		if (!this._store.unstable_enableToolInvocations) {
			this._toolInvocations && (this._toolInvocations.reset(), this._toolInvocations = null, this._toolStatuses = /* @__PURE__ */ new Map(), this._store.setToolStatuses?.({}));
			return;
		}
		this._toolInvocations ||= new al(() => this.getModelContext().tools, {
			onResult: (e) => {
				try {
					let t = this._findMessageIdForToolCall(e.toolCallId);
					if (t === void 0) return;
					sl("onAddToolResult", this._store.onAddToolResult?.({
						messageId: t,
						toolCallId: e.toolCallId,
						toolName: e.toolName,
						result: e.result,
						isError: e.isError,
						...e.artifact !== void 0 && { artifact: e.artifact },
						...e.modelContent !== void 0 && { modelContent: e.modelContent }
					}));
				} catch (e) {
					console.error("[ExternalStoreThreadRuntimeCore] onAddToolResult dispatch failed", e);
				}
			},
			onStatusesChange: (e) => {
				let t = this._hasExecutingTools(this._store);
				this._toolStatuses = e;
				try {
					this._store.setToolStatuses?.(Object.fromEntries(e));
				} finally {
					t !== this._hasExecutingTools(this._store) && (this._inTrackerUpdate ? this._pendingRunningRefresh = !0 : this._updateStoreSnapshot(this._store));
				}
			}
		}, (e) => this._store.unstable_isClientToolCall?.(e)), this._toolInvocations.setState({
			messages: this._messages,
			isRunning: this._getEffectiveIsRunning(this._store),
			...this._store.isLoading !== void 0 && { isLoading: this._store.isLoading }
		});
	}
	_toolCallToMessageId = /* @__PURE__ */ new Map();
	_messagesForToolCallIndex = null;
	_findMessageIdForToolCall(e) {
		if (this._messagesForToolCallIndex !== this._messages) {
			this._toolCallToMessageId.clear();
			for (let { part: e, messageId: t } of Vc(this._messages)) this._toolCallToMessageId.set(e.toolCallId, t);
			this._messagesForToolCallIndex = this._messages;
		}
		return this._toolCallToMessageId.get(e);
	}
	switchToBranch(e) {
		if (!this._store.setMessages) throw Error("Runtime does not support switching branches.");
		if (this._getEffectiveIsRunning(this._store)) return;
		let t = this._store.unstable_onBranchChange, n = t ? this.repository.canonicalHeadId : null;
		this.repository.switchToBranch(e), this._pendingDeleteEvictions.clear(), this.updateMessages(this.repository.getMessages()), t && this._notifyBranchChange(n, t);
	}
	_notifyBranchChange(e, t) {
		let n = this.repository.canonicalHeadId;
		n !== e && t({
			headId: n,
			visibleMessageIds: this.repository.getMessages().map((e) => e.id)
		});
	}
	async append(e) {
		let t = {
			...e,
			parentId: this._resolveAppendParent(e.parentId)
		};
		if (this.voice) throw Error("Cannot send a text message while a voice session is connected");
		if (this._isVoiceMessage(t.sourceId)) throw Error("Voice transcript messages cannot be edited");
		let n = t.sourceId != null || t.parentId !== (this._getBaseMessages().at(-1)?.id ?? null);
		t = !n && this._store.queue && this._store.queue === this._transformedQueue ? t : this.enrichAppendMetadata(t);
		let r = Tc(this);
		this.ensureInitialized();
		let i = this._getInitializePromise?.();
		if (!n && this._store.queue) {
			if (i && await i, !Ec(this, r)) return;
			t.steer ?? this._getEffectiveIsRunning(this._store) ? this._store.queue.steer(t) : this._store.queue.enqueue(t);
			return;
		}
		if (i?.catch(() => {}), (t.startRun ?? t.role === "user") && await this._toolInvocations?.abort({ discardPending: !0 }), Ec(this, r)) {
			if (n) {
				if (!this._store.onEdit) throw Error("Runtime does not support editing messages.");
				this._pendingDeleteEvictions.clear(), await this._store.onEdit(t);
			} else await this._store.onNew(t);
		}
	}
	_commitVoiceMessage(e) {
		this._store.onVoiceTranscript?.(e);
	}
	async deleteMessage(e) {
		if (this._store.onDelete) {
			this.repository.getMessages().some((t) => t.id === e) && this._pendingDeleteEvictions.add(e);
			try {
				await this._store.onDelete(e);
			} catch (t) {
				throw this._pendingDeleteEvictions.delete(e), t;
			}
			return;
		}
		if (!this._store.setMessages) throw Error("Runtime does not support deleting messages.");
		this._getEffectiveIsRunning(this._store) && await this._toolInvocations?.abort();
		let t = this.repository.getMessages();
		if (t.findIndex((t) => t.id === e) === -1) throw Error("Message not found.");
		this._pendingDeleteEvictions.clear(), this.updateMessages(t.filter((t) => t.id !== e)), this._evictDeletedMessage(e);
	}
	_evictDeletedMessage(e) {
		if (!e.startsWith("__external_store_fallback_")) {
			try {
				this.repository.getMessage(e);
			} catch {
				return;
			}
			this.repository.deleteMessage(e), this._publishRepositoryMessages();
		}
	}
	_publishRepositoryMessages() {
		let e = this.repository.getMessages();
		Ds(this._messages, e) || (this._messages = e), this._notifySubscribers();
	}
	getQueueItems() {
		return this._store?.queue?.items ?? Bc;
	}
	getSteerQueueItems() {
		return this._store?.queue?.steerItems ?? Bc;
	}
	moveQueueItem(e, t) {
		this._store?.queue?.move(e, t);
	}
	removeQueueItem(e) {
		this._store?.queue?.remove(e);
	}
	async startRun(e) {
		if (!this._store.onReload) throw Error("Runtime does not support reloading messages.");
		if (this.voice) throw Error("Cannot start a run while a voice session is connected");
		if (this._isVoiceMessage(e.sourceId)) throw Error("Voice transcript messages cannot be reloaded");
		this._pendingDeleteEvictions.clear(), await this._toolInvocations?.abort({ discardPending: !0 }), await this._store.onReload(e.parentId, e);
	}
	async resumeRun(e) {
		if (!this._store.onResume) throw Error("Runtime does not support resuming runs.");
		if (this.voice) throw Error("Cannot start a run while a voice session is connected");
		if (this._isVoiceMessage(e.sourceId)) throw Error("Voice transcript messages cannot be reloaded");
		await this._store.onResume(e);
	}
	exportExternalState() {
		if (!this._store.onExportExternalState) throw Error("Runtime does not support exporting external states.");
		return this._store.onExportExternalState();
	}
	importExternalState(e) {
		if (!this._store.onLoadExternalState) throw Error("Runtime does not support importing external states.");
		this._runTrackerUpdate(() => this._toolInvocations?.reset()), this._store.onLoadExternalState(e);
	}
	unstable_notifySessionReset() {
		this._runTrackerUpdate(() => this._toolInvocations?.reset()), this._store.queue?.__internal_notifyCancelled?.();
	}
	cancelRun() {
		if (!this._store.onCancel) throw Error("Runtime does not support cancelling runs.");
		let e = Tc(this);
		this._toolInvocations?.abort({ discardPending: !0 }), this._store.queue?.__internal_notifyCancelled?.(), sl("onCancel", this._store.onCancel()), this.dropEmptyOptimisticHead();
		let t = this.repository.getMessages(), n = t[t.length - 1], r = this._store.setMessages !== void 0 && n?.role === "user" && n.id === t.at(-1)?.id && n.content.every((e) => e.type === "text") ? n : void 0, i;
		if (r) {
			let e = {
				text: nc(r),
				attachments: r.attachments,
				quote: r.metadata.custom.quote
			};
			this.composer.restoreDraft(e) && (this.repository.deleteMessage(r.id), i = {
				id: r.id,
				draft: e
			});
		}
		this._publishRepositoryMessages(), setTimeout(() => {
			if (Ec(this, e)) {
				if (this.dropEmptyOptimisticHead(), i) {
					let e = this.repository.getMessages();
					e.at(-1)?.id === i.id ? this.repository.deleteMessage(i.id) : e.some((e) => e.id === i.id) && this.composer.retractDraft(i.draft);
				}
				this._publishRepositoryMessages(), this.updateMessages(this._messages);
			}
		}, 0);
	}
	dropEmptyOptimisticHead() {
		let e = this.repository.getMessages().at(-1);
		e && e.metadata.isOptimistic && e.content.length === 0 && this.repository.deleteMessage(e.id);
	}
	addToolResult(e) {
		if (!this._store.onAddToolResult) throw Error("Runtime does not support tool results.");
		sl("onAddToolResult", this._store.onAddToolResult(e));
	}
	resumeToolCall(e) {
		if (!(this._toolInvocations?.resume(e.toolCallId, e.payload) ?? !1)) {
			if (this._store.onResumeToolCall) {
				this._store.onResumeToolCall(e);
				return;
			}
			throw Error(`Tool call ${e.toolCallId} is not waiting for resume.`);
		}
	}
	respondToToolApproval(e) {
		if (!this._store.onRespondToToolApproval) throw Error("Runtime does not support tool approvals.");
		let t = this.messages.findLast((t) => t.role === "assistant" && t.content.some((t) => t.type === "tool-call" && t.approval?.id === e.approvalId)), n = t?.content.find((t) => t.type === "tool-call" && t.approval?.id === e.approvalId);
		try {
			return Promise.resolve(this._store.onRespondToToolApproval(e)).then(() => {
				t && n?.type === "tool-call" && this._notifyToolApprovalAnswered(t.id, n.toolCallId, n.toolName, e.approved);
			});
		} catch (e) {
			return Promise.reject(e);
		}
	}
	reset(e) {
		let t = new zc();
		t.import(Ic.fromArray(e ?? [])), this.updateMessages(t.getMessages());
	}
	import(e) {
		super.import(e), this._store.onImport && this._store.onImport(this.repository.getMessages());
	}
	updateMessages = (e) => {
		this._store.convertMessage === void 0 ? this._store.setMessages?.(e) : this._store.setMessages?.(e.flatMap(ss));
	};
}, ul = (e) => e.adapters?.threadList ?? {}, dl = class extends Oc {
	threads;
	constructor(e) {
		super(), this.threads = new Fc(ul(e), () => new ll(this._contextProvider, e));
	}
	setAdapter(e) {
		this.threads.__internal_setAdapter(ul(e)), this.threads.getMainThreadRuntimeCore().__internal_setAdapter(e);
	}
}, fl = (e) => {
	let t = A(21), { modelContext: n, feedback: r } = ns() ?? {}, i;
	bb0: {
		if (!r || e.adapters?.feedback) {
			i = e;
			break bb0;
		}
		let n;
		t[0] !== r || t[1] !== e.adapters ? (n = {
			...e.adapters,
			feedback: r
		}, t[0] = r, t[1] = e.adapters, t[2] = n) : n = t[2];
		let a;
		t[3] !== e || t[4] !== n ? (a = {
			...e,
			adapters: n
		}, t[3] = e, t[4] = n, t[5] = a) : a = t[5], i = a;
	}
	let a = i, o;
	t[6] === a ? o = t[7] : (o = () => new dl(a), t[6] = a, t[7] = o);
	let [s] = I(o), c;
	t[8] === s.threads ? c = t[9] : (c = () => () => {
		Dc(s.threads.getMainThreadRuntimeCore());
	}, t[8] = s.threads, t[9] = c);
	let l;
	t[10] === s ? l = t[11] : (l = [s], t[10] = s, t[11] = l), R(c, l);
	let u;
	t[12] !== a || t[13] !== s ? (u = () => {
		s.setAdapter(a);
	}, t[12] = a, t[13] = s, t[14] = u) : u = t[14], R(u);
	let d, f;
	t[15] !== n || t[16] !== s ? (d = () => {
		if (n) return s.registerModelContextProvider(n);
	}, f = [n, s], t[15] = n, t[16] = s, t[17] = d, t[18] = f) : (d = t[17], f = t[18]), R(d, f);
	let p;
	return t[19] === s ? p = t[20] : (p = new Cc(s), t[19] = s, t[20] = p), p;
}, pl = (e) => {
	let t = A(6), { id: n, children: r } = e, i = Gr(), a;
	t[0] === n ? a = t[1] : (a = _n({
		message: Qr({
			source: "thread",
			query: {
				type: "id",
				id: n
			},
			get: (e) => e.thread.message({ id: n })
		}),
		composer: Qr({
			source: "message",
			query: {},
			get: (e) => e.thread.message({ id: n }).composer()
		})
	}), t[0] = n, t[1] = a);
	let o = a, s;
	return t[2] !== i || t[3] !== r || t[4] !== o ? (s = /* @__PURE__ */ (0, H.jsx)(wa, {
		extends: i,
		config: o,
		children: r
	}), t[2] = i, t[3] = r, t[4] = o, t[5] = s) : s = t[5], s;
}, ml = (e, t) => e.Message === t.Message && e.EditComposer === t.EditComposer && e.UserEditComposer === t.UserEditComposer && e.AssistantEditComposer === t.AssistantEditComposer && e.SystemEditComposer === t.SystemEditComposer && e.UserMessage === t.UserMessage && e.AssistantMessage === t.AssistantMessage && e.SystemMessage === t.SystemMessage, hl = () => null, gl = /* @__PURE__ */ new WeakMap(), _l = (e, t) => {
	let n = gl.get(e);
	return n || (n = new Set(e.map((e) => e.id)), gl.set(e, n)), n.has(t);
}, vl = (e, t, n) => {
	switch (t) {
		case "user": return n ? e.UserEditComposer ?? e.EditComposer ?? e.UserMessage ?? e.Message : e.UserMessage ?? e.Message;
		case "assistant": return n ? e.AssistantEditComposer ?? e.EditComposer ?? e.AssistantMessage ?? e.Message : e.AssistantMessage ?? e.Message;
		case "system": return n ? e.SystemEditComposer ?? e.EditComposer ?? e.SystemMessage ?? e.Message ?? hl : e.SystemMessage ?? e.Message ?? hl;
		default: throw Error(`Unknown message role: ${t}`);
	}
}, yl = (e) => {
	let t = A(6), { components: n } = e, r = B(Tl), i = B(El), a;
	t[0] !== n || t[1] !== i || t[2] !== r ? (a = vl(n, r, i), t[0] = n, t[1] = i, t[2] = r, t[3] = a) : a = t[3];
	let o = a, s;
	return t[4] === o ? s = t[5] : (s = /* @__PURE__ */ (0, H.jsx)(o, {}), t[4] = o, t[5] = s), s;
}, bl = lt((e) => {
	let t = A(5), { index: n, components: r } = e, i;
	t[0] === r ? i = t[1] : (i = /* @__PURE__ */ (0, H.jsx)(yl, { components: r }), t[0] = r, t[1] = i);
	let a;
	return t[2] !== n || t[3] !== i ? (a = /* @__PURE__ */ (0, H.jsx)(ks, {
		index: n,
		children: i
	}), t[2] = n, t[3] = i, t[4] = a) : a = t[4], a;
}, (e, t) => e.index === t.index && ml(e.components, t.components));
bl.displayName = "ThreadPrimitive.MessageByIndex";
var xl = lt((e) => {
	let t = A(7), { messageId: n, components: r } = e, i;
	if (t[0] === n ? i = t[1] : (i = (e) => _l(e.thread.messages, n), t[0] = n, t[1] = i), !B(i)) return null;
	let a;
	t[2] === r ? a = t[3] : (a = /* @__PURE__ */ (0, H.jsx)(yl, { components: r }), t[2] = r, t[3] = a);
	let o;
	return t[4] !== n || t[5] !== a ? (o = /* @__PURE__ */ (0, H.jsx)(pl, {
		id: n,
		children: a
	}), t[4] = n, t[5] = a, t[6] = o) : o = t[6], o;
}, (e, t) => e.messageId === t.messageId && ml(e.components, t.components));
xl.displayName = "ThreadPrimitive.Unstable_MessageById";
var Sl = ({ children: e }) => {
	let t = B(wr((e) => e.thread.messages.map((e) => e.id)));
	return et(() => t.length === 0 ? null : t.map((t, n) => /* @__PURE__ */ (0, H.jsx)(ks, {
		index: n,
		children: /* @__PURE__ */ (0, H.jsx)(Da, {
			getItemState: (e) => e.thread.message({ index: n }).getState(),
			children: (t) => e({ get message() {
				return t();
			} })
		})
	}, t)), [t, e]);
}, Cl = (e) => {
	let t = A(4), { components: n, children: r } = e;
	if (n) {
		let e;
		return t[0] === n ? e = t[1] : (e = /* @__PURE__ */ (0, H.jsx)(Sl, { children: () => /* @__PURE__ */ (0, H.jsx)(yl, { components: n }) }), t[0] = n, t[1] = e), e;
	}
	let i;
	return t[2] === r ? i = t[3] : (i = /* @__PURE__ */ (0, H.jsx)(Sl, { children: r }), t[2] = r, t[3] = i), i;
};
Cl.displayName = "ThreadPrimitive.Messages";
var wl = lt(Cl, (e, t) => e.children || t.children ? e.children === t.children : ml(e.components, t.components));
function Tl(e) {
	return e.message.role;
}
function El(e) {
	return e.message.composer.isEditing;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/utils/getMessageQuote.js
var Dl = (e) => {
	let t = e.message.metadata;
	if (t && typeof t == "object") return t.custom?.quote;
}, Ol = class extends Error {
	componentName;
	constructor(e, t = `Component "${e}" is not in the generative-ui allowlist.`) {
		super(t), this.name = "GenerativeUIRenderError", this.componentName = e;
	}
}, kl = (e) => typeof e == "object" && !!e, Al = (e) => e == null ? [] : Array.isArray(e) ? e : [e], jl = (e, t, n, r) => {
	if (e == null) return null;
	if (typeof e == "string") return e;
	if (!kl(e) || !("component" in e) || typeof e.component != "string") return null;
	let { component: i, props: a, children: o, key: s } = e, c = t[i];
	if (!c) {
		if (n) return /* @__PURE__ */ (0, H.jsx)(n, {
			component: i,
			props: a
		}, s ?? r);
		throw new Ol(i);
	}
	return dt(c, {
		...a ?? {},
		key: s ?? r
	}, ...Al(o).map((e, i) => jl(e, t, n, `${r}/${i}`)));
}, Ml = (e) => {
	let t = A(11), { spec: n, components: r, Fallback: i } = e, a = n?.root, o;
	t[0] === a ? o = t[1] : (o = Al(a), t[0] = a, t[1] = o);
	let s = o, c;
	if (t[2] !== i || t[3] !== r || t[4] !== s) {
		let e;
		t[6] !== i || t[7] !== r ? (e = (e, t) => jl(e, r, i, `${t}`), t[6] = i, t[7] = r, t[8] = e) : e = t[8], c = s.map(e), t[2] = i, t[3] = r, t[4] = s, t[5] = c;
	} else c = t[5];
	let l;
	return t[9] === c ? l = t[10] : (l = /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: c }), t[9] = c, t[10] = l), l;
};
Ml.displayName = "GenerativeUIRender";
var Nl = (e) => {
	let t = A(4), { components: n, spec: r, Fallback: i } = e, a = B(Pl), o = r ?? a;
	if (!o) return null;
	let s;
	return t[0] !== i || t[1] !== n || t[2] !== o ? (s = /* @__PURE__ */ (0, H.jsx)(Ml, {
		spec: o,
		components: n,
		Fallback: i
	}), t[0] = i, t[1] = n, t[2] = o, t[3] = s) : s = t[3], s;
};
Nl.displayName = "MessagePrimitive.GenerativeUI";
function Pl(e) {
	let t = e.part;
	return t?.type === "generative-ui" ? t.spec : void 0;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/primitives/message/MessageParts.js
var Fl = (e) => {
	let t = -1;
	return {
		startGroup: (e) => {
			t === -1 && (t = e);
		},
		endGroup: (n, r) => {
			t !== -1 && (r.push({
				type: e,
				startIndex: t,
				endIndex: n
			}), t = -1);
		},
		finalize: (n, r) => {
			t !== -1 && r.push({
				type: e,
				startIndex: t,
				endIndex: n
			});
		}
	};
}, Il = (e, t, n) => {
	let r = [];
	if (t) {
		let t = Fl("chainOfThoughtGroup");
		for (let n = 0; n < e.length; n++) {
			let i = e[n];
			i === "tool-call" || i === "reasoning" ? t.startGroup(n) : (t.endGroup(n - 1, r), r.push({
				type: "single",
				index: n
			}));
		}
		t.finalize(e.length - 1, r);
	} else {
		let t = Fl("toolGroup"), n = Fl("reasoningGroup");
		for (let i = 0; i < e.length; i++) {
			let a = e[i];
			a === "tool-call" ? (n.endGroup(i - 1, r), t.startGroup(i)) : a === "reasoning" ? (t.endGroup(i - 1, r), n.startGroup(i)) : (t.endGroup(i - 1, r), n.endGroup(i - 1, r), r.push({
				type: "single",
				index: i
			}));
		}
		t.finalize(e.length - 1, r), n.finalize(e.length - 1, r);
	}
	if (n) {
		let e = /* @__PURE__ */ new Set();
		for (let t of r) {
			if (t.type === "single") continue;
			let r = n[t.startIndex];
			r !== void 0 && !e.has(r) && (e.add(r), t.idKey = `id:${r}`);
		}
	}
	return r;
}, Ll = (e) => {
	let t = A(10), n = B(wr(ou)), r = B(wr(cu)), i;
	bb0: {
		if (n.length === 0) {
			let e;
			t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = [], t[0] = e) : e = t[0];
			let n;
			t[1] === r ? n = t[2] : (n = {
				ranges: e,
				partIds: r
			}, t[1] = r, t[2] = n), i = n;
			break bb0;
		}
		let a;
		t[3] !== n || t[4] !== r || t[5] !== e ? (a = Il(n, e, r), t[3] = n, t[4] = r, t[5] = e, t[6] = a) : a = t[6];
		let o;
		t[7] !== r || t[8] !== a ? (o = {
			ranges: a,
			partIds: r
		}, t[7] = r, t[8] = a, t[9] = o) : o = t[9], i = o;
	}
	return i;
}, Rl = (e) => {
	let t = A(9), n, r;
	t[0] === e ? (n = t[1], r = t[2]) : ({Fallback: n, ...r} = e, t[0] = e, t[1] = n, t[2] = r);
	let i;
	t[3] !== n || t[4] !== r.toolName ? (i = (e) => e.tools.toolUIs[r.toolName]?.[0]?.render ?? n, t[3] = n, t[4] = r.toolName, t[5] = i) : i = t[5];
	let a = B(i);
	if (!a) return null;
	let o;
	return t[6] !== a || t[7] !== r ? (o = /* @__PURE__ */ (0, H.jsx)(a, { ...r }), t[6] = a, t[7] = r, t[8] = o) : o = t[8], o;
}, zl = (e, t, n) => e.renderers[t]?.[0] || (e.fallbacks[0] ?? n), Bl = (e) => {
	let t = A(9), n, r;
	t[0] === e ? (n = t[1], r = t[2]) : ({Fallback: n, ...r} = e, t[0] = e, t[1] = n, t[2] = r);
	let i;
	t[3] !== n || t[4] !== r.name ? (i = (e) => zl(e.dataRenderers, r.name, n), t[3] = n, t[4] = r.name, t[5] = i) : i = t[5];
	let a = B(i);
	if (!a) return null;
	let o;
	return t[6] !== a || t[7] !== r ? (o = /* @__PURE__ */ (0, H.jsx)(a, { ...r }), t[6] = a, t[7] = r, t[8] = o) : o = t[8], o;
}, Vl = {
	Text: () => null,
	Reasoning: () => null,
	Source: () => null,
	Image: () => null,
	File: () => null,
	Unstable_Audio: () => null,
	ToolGroup: ({ children: e }) => e,
	ReasoningGroup: ({ children: e }) => e
}, Hl = (e) => {
	let t = A(41), { components: n } = e, r;
	t[0] === n ? r = t[1] : (r = n === void 0 ? {} : n, t[0] = n, t[1] = r);
	let { Text: i, Reasoning: a, Image: o, Source: s, File: c, Unstable_Audio: l, tools: u, data: d, generativeUI: f } = r, p = i === void 0 ? Vl.Text : i, m = a === void 0 ? Vl.Reasoning : a, h = o === void 0 ? Vl.Image : o, g = s === void 0 ? Vl.Source : s, _ = c === void 0 ? Vl.File : c, v = l === void 0 ? Vl.Unstable_Audio : l, y;
	t[2] === u ? y = t[3] : (y = u === void 0 ? {} : u, t[2] = u, t[3] = y);
	let b = y, x = Gr(), S = B(lu), C = S.type;
	if (C === "tool-call") {
		let e = x.part.addToolResult, n = x.part.resumeToolCall, r = x.part.respondToToolApproval;
		if ("Override" in b) {
			let i;
			return t[4] !== e || t[5] !== S || t[6] !== r || t[7] !== n || t[8] !== b.Override ? (i = /* @__PURE__ */ (0, H.jsx)(b.Override, {
				...S,
				addResult: e,
				resume: n,
				respondToApproval: r
			}), t[4] = e, t[5] = S, t[6] = r, t[7] = n, t[8] = b.Override, t[9] = i) : i = t[9], i;
		}
		let i = b.by_name?.[S.toolName] ?? b.Fallback, a;
		return t[10] !== i || t[11] !== e || t[12] !== S || t[13] !== r || t[14] !== n ? (a = /* @__PURE__ */ (0, H.jsx)(Rl, {
			...S,
			Fallback: i,
			addResult: e,
			resume: n,
			respondToApproval: r
		}), t[10] = i, t[11] = e, t[12] = S, t[13] = r, t[14] = n, t[15] = a) : a = t[15], a;
	}
	if (S.status?.type === "requires-action") throw Error("Encountered unexpected requires-action status");
	switch (C) {
		case "text": {
			let e;
			return t[16] !== p || t[17] !== S ? (e = /* @__PURE__ */ (0, H.jsx)(p, { ...S }), t[16] = p, t[17] = S, t[18] = e) : e = t[18], e;
		}
		case "reasoning": {
			let e;
			return t[19] !== m || t[20] !== S ? (e = /* @__PURE__ */ (0, H.jsx)(m, { ...S }), t[19] = m, t[20] = S, t[21] = e) : e = t[21], e;
		}
		case "source": {
			let e;
			return t[22] !== g || t[23] !== S ? (e = /* @__PURE__ */ (0, H.jsx)(g, { ...S }), t[22] = g, t[23] = S, t[24] = e) : e = t[24], e;
		}
		case "image": {
			let e;
			return t[25] !== h || t[26] !== S ? (e = /* @__PURE__ */ (0, H.jsx)(h, { ...S }), t[25] = h, t[26] = S, t[27] = e) : e = t[27], e;
		}
		case "file": {
			let e;
			return t[28] !== _ || t[29] !== S ? (e = /* @__PURE__ */ (0, H.jsx)(_, { ...S }), t[28] = _, t[29] = S, t[30] = e) : e = t[30], e;
		}
		case "audio": {
			let e;
			return t[31] !== v || t[32] !== S ? (e = /* @__PURE__ */ (0, H.jsx)(v, { ...S }), t[31] = v, t[32] = S, t[33] = e) : e = t[33], e;
		}
		case "data": {
			let e = d?.by_name?.[S.name] ?? d?.Fallback, n;
			return t[34] !== e || t[35] !== S ? (n = /* @__PURE__ */ (0, H.jsx)(Bl, {
				...S,
				Fallback: e
			}), t[34] = e, t[35] = S, t[36] = n) : n = t[36], n;
		}
		case "generative-ui": {
			if (!f?.components) return null;
			let e = S, n;
			return t[37] !== f.Fallback || t[38] !== f.components || t[39] !== e.spec ? (n = /* @__PURE__ */ (0, H.jsx)(Ml, {
				spec: e.spec,
				components: f.components,
				Fallback: f.Fallback
			}), t[37] = f.Fallback, t[38] = f.components, t[39] = e.spec, t[40] = n) : n = t[40], n;
		}
		default: return console.warn(`Unknown message part type: ${C}`), null;
	}
}, Ul = lt((e) => {
	let t = A(5), { index: n, components: r } = e, i;
	t[0] === r ? i = t[1] : (i = /* @__PURE__ */ (0, H.jsx)(Hl, { components: r }), t[0] = r, t[1] = i);
	let a;
	return t[2] !== n || t[3] !== i ? (a = /* @__PURE__ */ (0, H.jsx)(As, {
		index: n,
		children: i
	}), t[2] = n, t[3] = i, t[4] = a) : a = t[4], a;
}, (e, t) => e.index === t.index && e.components?.Text === t.components?.Text && e.components?.Reasoning === t.components?.Reasoning && e.components?.Source === t.components?.Source && e.components?.Image === t.components?.Image && e.components?.File === t.components?.File && e.components?.Unstable_Audio === t.components?.Unstable_Audio && e.components?.tools === t.components?.tools && e.components?.data === t.components?.data && e.components?.generativeUI === t.components?.generativeUI && e.components?.ToolGroup === t.components?.ToolGroup && e.components?.ReasoningGroup === t.components?.ReasoningGroup);
Ul.displayName = "MessagePrimitive.PartByIndex";
var Wl = (e) => {
	let t = A(6), { status: n, component: r } = e, i = n.type === "running", a;
	t[0] !== r || t[1] !== n ? (a = /* @__PURE__ */ (0, H.jsx)(r, {
		type: "text",
		text: "",
		status: n
	}), t[0] = r, t[1] = n, t[2] = a) : a = t[2];
	let o;
	return t[3] !== i || t[4] !== a ? (o = /* @__PURE__ */ (0, H.jsx)(Ms, {
		text: "",
		isRunning: i,
		children: a
	}), t[3] = i, t[4] = a, t[5] = o) : o = t[5], o;
}, Gl = Object.freeze({ type: "complete" }), Kl = Object.freeze({ type: "running" }), ql = lt((e) => {
	let t = A(6), { components: n } = e, r = B(uu);
	if (n?.Empty) {
		let e;
		return t[0] !== n.Empty || t[1] !== r ? (e = /* @__PURE__ */ (0, H.jsx)(n.Empty, { status: r }), t[0] = n.Empty, t[1] = r, t[2] = e) : e = t[2], e;
	}
	if (r.type !== "running") return null;
	let i = n?.Text ?? Vl.Text, a;
	return t[3] !== r || t[4] !== i ? (a = /* @__PURE__ */ (0, H.jsx)(Wl, {
		status: r,
		component: i
	}), t[3] = r, t[4] = i, t[5] = a) : a = t[5], a;
}, (e, t) => e.components?.Empty === t.components?.Empty && e.components?.Text === t.components?.Text), Jl = lt((e) => {
	let t = A(4), { components: n, enabled: r } = e, i;
	if (t[0] === r ? i = t[1] : (i = (e) => {
		if (!r || e.message.parts.length === 0) return !1;
		let t = e.message.parts[e.message.parts.length - 1];
		return t?.type !== "text" && t?.type !== "reasoning";
	}, t[0] = r, t[1] = i), !B(i)) return null;
	let a;
	return t[2] === n ? a = t[3] : (a = /* @__PURE__ */ (0, H.jsx)(ql, { components: n }), t[2] = n, t[3] = a), a;
}, (e, t) => e.enabled === t.enabled && e.components?.Empty === t.components?.Empty && e.components?.Text === t.components?.Text), Yl = lt((e) => {
	let t = A(4), { Quote: n } = e, r = B(Dl);
	if (!r) return null;
	let i;
	return t[0] !== n || t[1] !== r.messageId || t[2] !== r.text ? (i = /* @__PURE__ */ (0, H.jsx)(n, {
		text: r.text,
		messageId: r.messageId
	}), t[0] = n, t[1] = r.messageId, t[2] = r.text, t[3] = i) : i = t[3], i;
});
function Xl(e, t) {
	return (e.toolUIs[t.toolName]?.[0]?.render ?? null) || (ic(t.mcp?.app?.resourceUri) && e.mcpApp ? e.mcpApp.render : null);
}
var Zl = () => {
	let e = A(6), t = Gr(), n = B(du), r = B(fu);
	if (!r || n.type !== "tool-call") return null;
	let i;
	return e[0] !== r || e[1] !== t.part.addToolResult || e[2] !== t.part.respondToToolApproval || e[3] !== t.part.resumeToolCall || e[4] !== n ? (i = /* @__PURE__ */ (0, H.jsx)(r, {
		...n,
		addResult: t.part.addToolResult,
		resume: t.part.resumeToolCall,
		respondToApproval: t.part.respondToToolApproval
	}), e[0] = r, e[1] = t.part.addToolResult, e[2] = t.part.respondToToolApproval, e[3] = t.part.resumeToolCall, e[4] = n, e[5] = i) : i = e[5], i;
}, Ql = () => {
	let e = A(3), t = B(pu), n = B(mu);
	if (!n || t.type !== "data") return null;
	let r = t, i;
	return e[0] !== n || e[1] !== r ? (i = /* @__PURE__ */ (0, H.jsx)(n, { ...r }), e[0] = n, e[1] = r, e[2] = i) : i = e[2], i;
}, $l = () => {
	let e = A(2), t = B(hu);
	if (t === "tool-call") {
		let t;
		return e[0] === Symbol.for("react.memo_cache_sentinel") ? (t = /* @__PURE__ */ (0, H.jsx)(Zl, {}), e[0] = t) : t = e[0], t;
	}
	if (t === "data") {
		let t;
		return e[1] === Symbol.for("react.memo_cache_sentinel") ? (t = /* @__PURE__ */ (0, H.jsx)(Ql, {}), e[1] = t) : t = e[1], t;
	}
	return null;
}, eu = Object.freeze({
	type: "text",
	text: "",
	status: Kl
}), tu = ({ children: e }) => {
	let t = Gr(), n = B((e) => e.dataRenderers);
	return /* @__PURE__ */ (0, H.jsx)(Da, {
		getItemState: (e) => e.part.getState(),
		children: (r) => e({ get part() {
			let e = r();
			if (e.type === "tool-call") {
				let n = Xl(t.tools.getState(), e) !== null, r = t.part;
				return {
					...e,
					toolUI: n ? /* @__PURE__ */ (0, H.jsx)(Zl, {}) : null,
					addResult: r.addToolResult,
					resume: r.resumeToolCall,
					respondToApproval: r.respondToToolApproval
				};
			}
			if (e.type === "data") {
				let t = zl(n, e.name, void 0) !== void 0;
				return {
					...e,
					dataRendererUI: t ? /* @__PURE__ */ (0, H.jsx)(Ql, {}) : null
				};
			}
			return e;
		} })
	});
}, nu = (e) => {
	let t = A(5), { index: n, children: r } = e, i;
	t[0] === r ? i = t[1] : (i = /* @__PURE__ */ (0, H.jsx)(tu, { children: r }), t[0] = r, t[1] = i);
	let a;
	return t[2] !== n || t[3] !== i ? (a = /* @__PURE__ */ (0, H.jsx)(As, {
		index: n,
		children: i
	}), t[2] = n, t[3] = i, t[4] = a) : a = t[4], a;
}, ru = (e) => {
	let t = A(9), { children: n } = e, r = B(gu), i = B(_u), a = r === 0 && i;
	if (r === 0) {
		if (!a) return null;
		let e;
		t[0] === n ? e = t[1] : (e = n({ part: eu }), t[0] = n, t[1] = e);
		let r;
		return t[2] === e ? r = t[3] : (r = /* @__PURE__ */ (0, H.jsx)(Ms, {
			text: "",
			isRunning: !0,
			children: e
		}), t[2] = e, t[3] = r), r;
	}
	let o;
	if (t[4] !== n || t[5] !== r) {
		let e;
		t[7] === n ? e = t[8] : (e = (e, t) => /* @__PURE__ */ (0, H.jsx)(nu, {
			index: t,
			children: (e) => n(e) ?? /* @__PURE__ */ (0, H.jsx)($l, {})
		}, t), t[7] = n, t[8] = e), o = /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: Array.from({ length: r }, e) }), t[4] = n, t[5] = r, t[6] = o;
	} else o = t[6];
	return o;
}, iu = (e) => {
	let t = A(5), { components: n, unstable_showEmptyOnNonTextEnd: r, children: i } = e, a = r === void 0 || r;
	if (i) {
		let e;
		return t[0] === i ? e = t[1] : (e = /* @__PURE__ */ (0, H.jsx)(ru, { children: i }), t[0] = i, t[1] = e), e;
	}
	let o;
	return t[2] !== n || t[3] !== a ? (o = /* @__PURE__ */ (0, H.jsx)(G, {
		components: n,
		unstable_showEmptyOnNonTextEnd: a
	}), t[2] = n, t[3] = a, t[4] = o) : o = t[4], o;
};
iu.displayName = "MessagePrimitive.Parts";
var G = (e) => {
	let t = A(15), { components: n, unstable_showEmptyOnNonTextEnd: r } = e, i = B(vu), { ranges: a, partIds: o } = Ll(!!n?.ChainOfThought), s;
	bb0: {
		if (i === 0) {
			let e;
			t[0] === n ? e = t[1] : (e = /* @__PURE__ */ (0, H.jsx)(ql, { components: n }), t[0] = n, t[1] = e), s = e;
			break bb0;
		}
		let e;
		if (t[2] !== n || t[3] !== a || t[4] !== o) {
			let r = /* @__PURE__ */ new Set(), i = (e) => {
				let t = o[e];
				return t !== void 0 && !r.has(t) ? (r.add(t), `part-id:${t}`) : `part-${e}`;
			};
			e = a.map((e) => {
				if (e.type === "single") return /* @__PURE__ */ (0, H.jsx)(Ul, {
					index: e.index,
					components: n
				}, e.index);
				if (e.type === "chainOfThoughtGroup") {
					let t = n?.ChainOfThought;
					return t ? /* @__PURE__ */ (0, H.jsx)(zs, {
						startIndex: e.startIndex,
						endIndex: e.endIndex,
						children: /* @__PURE__ */ (0, H.jsx)(t, {})
					}, `chainOfThought-${e.idKey ?? e.startIndex}`) : null;
				}
				if (e.type === "toolGroup") {
					let t = n?.ToolGroup ?? Vl.ToolGroup;
					return /* @__PURE__ */ (0, H.jsx)(t, {
						startIndex: e.startIndex,
						endIndex: e.endIndex,
						children: Array.from({ length: e.endIndex - e.startIndex + 1 }, (t, r) => {
							let a = e.startIndex + r;
							return /* @__PURE__ */ (0, H.jsx)(Ul, {
								index: a,
								components: n
							}, i(a));
						})
					}, `tool-${e.idKey ?? e.startIndex}`);
				}
				{
					let t = n?.ReasoningGroup ?? Vl.ReasoningGroup;
					return /* @__PURE__ */ (0, H.jsx)(t, {
						startIndex: e.startIndex,
						endIndex: e.endIndex,
						children: Array.from({ length: e.endIndex - e.startIndex + 1 }, (t, r) => {
							let i = e.startIndex + r;
							return /* @__PURE__ */ (0, H.jsx)(Ul, {
								index: i,
								components: n
							}, `part-${i}`);
						})
					}, `reasoning-${e.startIndex}`);
				}
			}), t[2] = n, t[3] = a, t[4] = o, t[5] = e;
		} else e = t[5];
		s = e;
	}
	let c = s, l;
	t[6] === n ? l = t[7] : (l = n?.Quote && /* @__PURE__ */ (0, H.jsx)(Yl, { Quote: n.Quote }), t[6] = n, t[7] = l);
	let u;
	t[8] !== n || t[9] !== r ? (u = /* @__PURE__ */ (0, H.jsx)(Jl, {
		components: n,
		enabled: r
	}), t[8] = n, t[9] = r, t[10] = u) : u = t[10];
	let d;
	return t[11] !== c || t[12] !== l || t[13] !== u ? (d = /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
		l,
		c,
		u
	] }), t[11] = c, t[12] = l, t[13] = u, t[14] = d) : d = t[14], d;
};
function au(e) {
	return e.type;
}
function ou(e) {
	return e.message.parts.map(au);
}
function su(e) {
	return e.type === "tool-call" ? e.toolCallId : void 0;
}
function cu(e) {
	return e.message.parts.map(su);
}
function lu(e) {
	return e.part;
}
function uu(e) {
	return e.message.status ?? Gl;
}
function du(e) {
	return e.part;
}
function fu(e) {
	return e.part.type === "tool-call" ? Xl(e.tools, e.part) : null;
}
function pu(e) {
	return e.part;
}
function mu(e) {
	return e.part.type === "data" ? zl(e.dataRenderers, e.part.name, void 0) ?? null : null;
}
function hu(e) {
	return e.part.type;
}
function gu(e) {
	return e.message.parts.length;
}
function _u(e) {
	return (e.message.status?.type ?? "complete") === "running";
}
function vu(e) {
	return e.message.parts.length;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/utils/groupParts.js
var yu = Symbol.for("@assistant-ui/groupBy.memoKey"), bu = (e) => {
	let t = e.nextChildIdx++;
	return e.nodeKey === "" ? String(t) : `${e.nodeKey}.${t}`;
}, xu = (e, t) => {
	if (!(t === void 0 || e.claimed.has(t))) return e.claimed.add(t), `id:${t}`;
}, Su = (e, t) => {
	let n = {
		key: "",
		nodeKey: "",
		indices: [],
		children: [],
		nextChildIdx: 0,
		claimed: /* @__PURE__ */ new Set()
	}, r = [n], i = () => {
		let e = r.pop(), n = r[r.length - 1];
		n.children.push({
			type: "group",
			key: e.key,
			nodeKey: e.nodeKey,
			idKey: xu(n, t?.[e.indices[0]]),
			indices: e.indices,
			children: e.children
		});
	};
	for (let n = 0; n < e.length; n++) {
		let a = e[n], o = 0;
		for (; o < r.length - 1 && o < a.length && r[o + 1].key === a[o];) o++;
		for (; r.length - 1 > o;) i();
		for (; r.length - 1 < a.length;) {
			let e = r[r.length - 1];
			r.push({
				key: a[r.length - 1],
				nodeKey: bu(e),
				indices: [],
				children: [],
				nextChildIdx: 0,
				claimed: /* @__PURE__ */ new Set()
			});
		}
		let s = r[r.length - 1];
		s.children.push({
			type: "part",
			index: n,
			nodeKey: bu(s),
			idKey: xu(s, t?.[n])
		});
		for (let e = 1; e < r.length; e++) r[e].indices.push(n);
	}
	for (; r.length > 1;) i();
	return n.children;
}, Cu = (e, t, n) => {
	if (!n) return !1;
	switch (e) {
		case "never": return !1;
		case "always": return !0;
		case "empty": return t.length === 0;
		case "no-text": {
			let e = t[t.length - 1];
			return e === void 0 || e.type !== "text" && e.type !== "reasoning";
		}
	}
}, wu = () => {
	throw Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, Tu = (e, t, n) => {
	if (e.type === "part") return /* @__PURE__ */ (0, H.jsx)(nu, {
		index: e.index,
		children: ({ part: e }) => n({
			part: e,
			children: /* @__PURE__ */ (0, H.jsx)(wu, {})
		})
	}, e.idKey ? `part-${e.idKey}` : `part-${e.index}`);
	let { status: r, counts: i } = Ls(t, e.indices), a = {
		type: e.key,
		status: r,
		counts: i,
		indices: e.indices
	};
	return /* @__PURE__ */ (0, H.jsx)(ut, { children: n({
		part: a,
		children: /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: e.children.map((e) => Tu(e, t, n)) })
	}) }, e.idKey ?? e.nodeKey);
}, Eu = ({ groupBy: e, indicator: t = "no-text", children: n }) => {
	let r = B(wr((e) => e.message.parts)), i = B((e) => e.tools.toolUIs), a = B((e) => t !== "never" && e.message.status?.type === "running"), o = et(() => {
		let t = { toolUIs: i };
		return Su(r.map((n) => e(n, t) ?? []), r.map((e) => e.type === "tool-call" ? e.toolCallId : void 0));
	}, [
		r,
		e[yu] ?? e,
		i
	]);
	return /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [o.map((e) => Tu(e, r, n)), Cu(t, r, a) && n({
		part: { type: "indicator" },
		children: /* @__PURE__ */ (0, H.jsx)(wu, {})
	})] });
};
Eu.displayName = "MessagePrimitive.GroupedParts";
var Du = lt((e) => {
	let t = A(5), { children: n } = e, r = B(Dl);
	if (!r) return null;
	let i;
	t[0] !== n || t[1] !== r ? (i = n(r), t[0] = n, t[1] = r, t[2] = i) : i = t[2];
	let a;
	return t[3] === i ? a = t[4] : (a = /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: i }), t[3] = i, t[4] = a), a;
});
Du.displayName = "MessagePrimitive.Quote";
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/primitives/message/MessageAttachments.js
var Ou = (e, t) => {
	switch (t.type) {
		case "image": return e?.Image ?? e?.Attachment;
		case "document": return e?.Document ?? e?.Attachment;
		case "file": return e?.File ?? e?.Attachment;
		default: return e?.Attachment;
	}
}, ku = (e) => {
	let t = A(5), { components: n } = e, r = B(Nu);
	if (!r) return null;
	let i = r, a;
	t[0] !== n || t[1] !== i ? (a = Ou(n, i), t[0] = n, t[1] = i, t[2] = a) : a = t[2];
	let o = a;
	if (!o) return null;
	let s;
	return t[3] === o ? s = t[4] : (s = /* @__PURE__ */ (0, H.jsx)(o, {}), t[3] = o, t[4] = s), s;
}, Au = lt((e) => {
	let t = A(5), { index: n, components: r } = e, i;
	t[0] === r ? i = t[1] : (i = /* @__PURE__ */ (0, H.jsx)(ku, { components: r }), t[0] = r, t[1] = i);
	let a;
	return t[2] !== n || t[3] !== i ? (a = /* @__PURE__ */ (0, H.jsx)(Os, {
		index: n,
		children: i
	}), t[2] = n, t[3] = i, t[4] = a) : a = t[4], a;
}, (e, t) => e.index === t.index && e.components?.Image === t.components?.Image && e.components?.Document === t.components?.Document && e.components?.File === t.components?.File && e.components?.Attachment === t.components?.Attachment);
Au.displayName = "MessagePrimitive.AttachmentByIndex";
var ju = ({ children: e }) => {
	let t = B(wr((e) => e.message.role === "user" ? (e.message.attachments ?? []).map((e) => e.id) : []));
	return et(() => t.map((t, n) => /* @__PURE__ */ (0, H.jsx)(Os, {
		index: n,
		children: /* @__PURE__ */ (0, H.jsx)(Da, {
			getItemState: (e) => e.message.attachment({ index: n }).getState(),
			children: (t) => e({ get attachment() {
				return t();
			} })
		})
	}, t)), [t, e]);
}, Mu = (e) => {
	let t = A(4), { components: n, children: r } = e;
	if (n) {
		let e;
		return t[0] === n ? e = t[1] : (e = /* @__PURE__ */ (0, H.jsx)(ju, { children: (e) => {
			let { attachment: t } = e, r = Ou(n, t);
			return r ? /* @__PURE__ */ (0, H.jsx)(r, {}) : null;
		} }), t[0] = n, t[1] = e), e;
	}
	let i;
	return t[2] === r ? i = t[3] : (i = /* @__PURE__ */ (0, H.jsx)(ju, { children: r }), t[2] = r, t[3] = i), i;
};
Mu.displayName = "MessagePrimitive.Attachments";
function Nu(e) {
	return e.attachment;
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/primitives/messagePart/MessagePartInProgress.js
var Pu = (e) => {
	let { children: t } = e;
	return B(Fu) ? t : null;
};
Pu.displayName = "MessagePartPrimitive.InProgress";
function Fu(e) {
	return e.part.status.type === "running";
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/primitives/thread/ThreadSuggestions.js
var Iu = (e) => {
	let t = A(2), { components: n } = e, r = n.Suggestion, i;
	return t[0] === r ? i = t[1] : (i = /* @__PURE__ */ (0, H.jsx)(r, {}), t[0] = r, t[1] = i), i;
}, Lu = lt((e) => {
	let t = A(5), { index: n, components: r } = e, i;
	t[0] === r ? i = t[1] : (i = /* @__PURE__ */ (0, H.jsx)(Iu, { components: r }), t[0] = r, t[1] = i);
	let a;
	return t[2] !== n || t[3] !== i ? (a = /* @__PURE__ */ (0, H.jsx)(Vs, {
		index: n,
		children: i
	}), t[2] = n, t[3] = i, t[4] = a) : a = t[4], a;
}, (e, t) => e.index === t.index && e.components.Suggestion === t.components.Suggestion);
Lu.displayName = "ThreadPrimitive.SuggestionByIndex";
var Ru = ({ children: e }) => {
	let t = B((e) => e.suggestions.suggestions.length);
	return et(() => t === 0 ? null : Array.from({ length: t }, (t, n) => /* @__PURE__ */ (0, H.jsx)(Vs, {
		index: n,
		children: /* @__PURE__ */ (0, H.jsx)(Da, {
			getItemState: (e) => e.suggestions.suggestion({ index: n }).getState(),
			children: (t) => e({ get suggestion() {
				return t();
			} })
		})
	}, n)), [t, e]);
}, zu = (e) => {
	let t = A(4), { components: n, children: r } = e;
	if (n) {
		let e;
		return t[0] === n ? e = t[1] : (e = /* @__PURE__ */ (0, H.jsx)(Ru, { children: () => /* @__PURE__ */ (0, H.jsx)(Iu, { components: n }) }), t[0] = n, t[1] = e), e;
	}
	let i;
	return t[2] === r ? i = t[3] : (i = /* @__PURE__ */ (0, H.jsx)(Ru, { children: r }), t[2] = r, t[3] = i), i;
};
zu.displayName = "ThreadPrimitive.Suggestions";
var Bu = lt(zu, (e, t) => e.children || t.children ? e.children === t.children : e.components.Suggestion === t.components.Suggestion), Vu = (e, t) => e.thread.isDisabled || t && e.thread.isRunning && !e.thread.capabilities.queue, Hu = (e) => {
	if (e.message.status?.type !== "incomplete" || e.message.status.reason !== "error") return;
	let t = e.message.status.error;
	return typeof t == "string" ? t : typeof t == "object" && t && "message" in t && typeof t.message == "string" ? t.message : t ?? "An error occurred";
}, Uu = (e) => {
	let t = A(10), { prompt: n, send: r, clearComposer: i } = e, a = i === void 0 || i, o = Gr(), s = r ?? !1, c;
	t[0] === s ? c = t[1] : (c = (e) => Vu(e, s), t[0] = s, t[1] = c);
	let l = B(c), u;
	t[2] !== o || t[3] !== a || t[4] !== n || t[5] !== s ? (u = () => {
		if (s) {
			let { isRunning: e, capabilities: t } = o.thread.getState();
			if (e && !t.queue) return;
			o.thread.append({
				content: [{
					type: "text",
					text: n
				}],
				runConfig: o.composer.getState().runConfig
			}), a && !e && o.composer.setText("");
		} else if (a) o.composer.setText(n);
		else {
			let e = o.composer.getState().text;
			o.composer.setText([e, n].filter(Wu).join(" "));
		}
	}, t[2] = o, t[3] = a, t[4] = n, t[5] = s, t[6] = u) : u = t[6];
	let d = u, f;
	return t[7] !== l || t[8] !== d ? (f = {
		trigger: d,
		disabled: l
	}, t[7] = l, t[8] = d, t[9] = f) : f = t[9], f;
};
function Wu(e) {
	return e.trim();
}
//#endregion
//#region node_modules/@assistant-ui/core/dist/react/primitive-hooks/useMessageError.js
var Gu = () => B(Hu);
//#endregion
//#region node_modules/@assistant-ui/react/dist/context/react/utils/createContextHook.js
function Ku(e, t) {
	function n(n) {
		let r = gt(e);
		if (!n?.optional && !r) throw Error(`This component must be used within ${t}.`);
		return r;
	}
	return n;
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/context/react/utils/createContextStoreHook.js
function qu(e, t) {
	function n(n) {
		let r = e(n);
		return r ? r[t] : null;
	}
	function r(e) {
		let t = !1, r;
		typeof e == "function" ? r = e : e && typeof e == "object" && (t = !!e.optional, r = e.selector);
		let i = n({ optional: t });
		return i ? r ? i(r) : i() : null;
	}
	return {
		[t]: r,
		[`${t}Store`]: n
	};
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/context/react/ThreadViewportContext.js
var Ju = mt(null), { useThreadViewport: Yu, useThreadViewportStore: Xu } = qu(Ku(Ju, "ThreadPrimitive.Viewport"), "useThreadViewport"), Zu = (e) => {
	let t, n = /* @__PURE__ */ new Set(), r = (e, r) => {
		let i = typeof e == "function" ? e(t) : e;
		if (!Object.is(i, t)) {
			let e = t;
			t = r ?? (typeof i != "object" || !i) ? i : Object.assign({}, t, i), n.forEach((n) => n(t, e));
		}
	}, i = () => t, a = {
		setState: r,
		getState: i,
		getInitialState: () => o,
		subscribe: (e) => (n.add(e), () => n.delete(e))
	}, o = t = e(r, i, a);
	return a;
}, Qu = ((e) => e ? Zu(e) : Zu), $u = (e) => e;
function K(e, t = $u) {
	let n = O.useSyncExternalStore(e.subscribe, O.useCallback(() => t(e.getState()), [e, t]), O.useCallback(() => t(e.getInitialState()), [e, t]));
	return O.useDebugValue(n), n;
}
var q = (e) => {
	let t = Qu(e), n = (e) => K(t, e);
	return Object.assign(n, t), n;
}, J = ((e) => e ? q(e) : q), Y = (e) => {
	let t = /* @__PURE__ */ new Map(), n = () => {
		let n = 0;
		for (let e of t.values()) n += e;
		e(n);
	};
	return { register: () => {
		let e = Symbol();
		return t.set(e, 0), {
			setHeight: (r) => {
				t.get(e) !== r && (t.set(e, r), n());
			},
			unregister: () => {
				t.delete(e), n();
			}
		};
	} };
}, X = (e = {}) => {
	let t = /* @__PURE__ */ new Set(), n = Y((e) => {
		a.setState({ height: {
			...a.getState().height,
			viewport: e
		} });
	}), r = Y((e) => {
		a.setState({ height: {
			...a.getState().height,
			inset: e
		} });
	}), i = (e, t) => (a.setState({ element: {
		...a.getState().element,
		[e]: t
	} }), () => {
		a.getState().element[e] === t && a.setState({ element: {
			...a.getState().element,
			[e]: null
		} });
	}), a = J(() => ({
		isAtBottom: !0,
		scrollToBottom: ({ behavior: e = "auto" } = {}) => {
			gn(t, () => ({ behavior: e }), "Thread viewport");
		},
		onScrollToBottom: (e) => (t.add(e), () => {
			t.delete(e);
		}),
		turnAnchor: e.turnAnchor ?? "bottom",
		topAnchorMessageClamp: {
			tallerThan: e.topAnchorMessageClamp?.tallerThan ?? "10em",
			visibleHeight: e.topAnchorMessageClamp?.visibleHeight ?? "6em"
		},
		height: {
			viewport: 0,
			inset: 0
		},
		element: {
			viewport: null,
			anchor: null,
			target: null
		},
		targetConfig: null,
		topAnchorTurn: null,
		registerViewport: n.register,
		registerContentInset: r.register,
		registerViewportElement: (e) => i("viewport", e),
		registerAnchorElement: (e) => i("anchor", e),
		registerAnchorTargetElement: (e, t) => (a.setState({
			element: {
				...a.getState().element,
				target: e
			},
			targetConfig: e && t ? t : null
		}), () => {
			a.getState().element.target === e && a.setState({
				element: {
					...a.getState().element,
					target: null
				},
				targetConfig: null
			});
		}),
		setTopAnchorTurn: (e) => {
			a.setState({ topAnchorTurn: e });
		}
	}));
	return a;
}, ed = (e) => e, td = (e) => {
	let t = A(11), n;
	t[0] === Symbol.for("react.memo_cache_sentinel") ? (n = { optional: !0 }, t[0] = n) : n = t[0];
	let r = Xu(n), i;
	t[1] === e ? i = t[2] : (i = () => X(e), t[1] = e, t[2] = i);
	let [a] = I(i), o, s;
	t[3] !== r || t[4] !== a ? (o = () => r?.getState().onScrollToBottom((e) => {
		a.getState().scrollToBottom(e);
	}), s = [r, a], t[3] = r, t[4] = a, t[5] = o, t[6] = s) : (o = t[5], s = t[6]), R(o, s);
	let c, l;
	return t[7] !== r || t[8] !== a ? (c = () => {
		if (r) return a.subscribe((e) => {
			r.getState().isAtBottom !== e.isAtBottom && ed(r).setState({ isAtBottom: e.isAtBottom });
		});
	}, l = [a, r], t[7] = r, t[8] = a, t[9] = c, t[10] = l) : (c = t[9], l = t[10]), R(c, l), a;
}, nd = (e) => {
	let t = A(7), { children: n, options: r } = e, i;
	t[0] === r ? i = t[1] : (i = r === void 0 ? {} : r, t[0] = r, t[1] = i);
	let a = td(i), o;
	t[2] === a ? o = t[3] : (o = () => ({ useThreadViewport: a }), t[2] = a, t[3] = o);
	let [s] = I(o), c;
	return t[4] !== n || t[5] !== s ? (c = /* @__PURE__ */ (0, H.jsx)(Ju.Provider, {
		value: s,
		children: n
	}), t[4] = n, t[5] = s, t[6] = c) : c = t[6], c;
}, rd = () => {
	let e = A(3), t = Gr(), n, r;
	return e[0] === t ? (n = e[1], r = e[2]) : (n = () => {}, r = [t], e[0] = t, e[1] = n, e[2] = r), R(n, r), null;
}, id = lt((e) => {
	let t = A(8), { children: n, aui: r, config: i, runtime: a } = e, o = r ?? null, s;
	t[0] === Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ (0, H.jsx)(rd, {}), t[0] = s) : s = t[0];
	let c;
	t[1] === n ? c = t[2] : (c = /* @__PURE__ */ (0, H.jsx)(nd, { children: n }), t[1] = n, t[2] = c);
	let l;
	return t[3] !== i || t[4] !== a || t[5] !== o || t[6] !== c ? (l = /* @__PURE__ */ (0, H.jsxs)(Ma, {
		runtime: a,
		aui: o,
		config: i,
		children: [s, c]
	}), t[3] = i, t[4] = a, t[5] = o, t[6] = c, t[7] = l) : l = t[7], l;
}), ad = Object.defineProperty, od = (e, t) => ad(e, "name", {
	value: t,
	configurable: !0
});
function sd(e, t) {
	if (typeof e == "function") return e(t);
	e != null && (e.current = t);
}
od(sd, "setRef");
function cd(...e) {
	return (t) => {
		let n = !1, r = e.map((e) => {
			let r = sd(e, t);
			return !n && typeof r == "function" && (n = !0), r;
		});
		if (n) return () => {
			for (let t = 0; t < r.length; t++) {
				let n = r[t];
				typeof n == "function" ? n() : sd(e[t], null);
			}
		};
	};
}
od(cd, "composeRefs");
function ld(...e) {
	return O.useCallback(cd(...e), e);
}
od(ld, "useComposedRefs");
//#endregion
//#region node_modules/@radix-ui/react-slot/dist/index.mjs
var ud = Object.defineProperty, dd = (e, t) => ud(e, "name", {
	value: t,
	configurable: !0
});
// @__NO_SIDE_EFFECTS__
function fd(e) {
	let t = O.forwardRef((t, n) => {
		let { children: r, ...i } = t, a = null, o = !1, s = [];
		xd(r) && typeof Td == "function" && (r = Td(r._payload)), O.Children.forEach(r, (e) => {
			if (yd(e)) {
				o = !0;
				let t = e, n = "child" in t.props ? t.props.child : t.props.children;
				xd(n) && typeof Td == "function" && (n = Td(n._payload)), a = gd(t, n), s.push(a?.props?.children);
			} else s.push(e);
		}), a ? a = O.cloneElement(a, void 0, s) : !o && O.Children.count(r) === 1 && O.isValidElement(r) && (a = r);
		let c = a ? vd(a) : void 0, l = ld(n, c);
		if (!a) {
			if (r || r === 0) throw Error(o ? wd(e) : Cd(e));
			return r;
		}
		let u = _d(i, a.props ?? {});
		return a.type !== O.Fragment && (u.ref = n ? l : c), O.cloneElement(a, u);
	});
	return t.displayName = `${e}.Slot`, t;
}
dd(fd, "createSlot");
var pd = /* @__PURE__ */ fd("Slot"), md = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function hd(e) {
	let t = /* @__PURE__ */ dd((e) => "child" in e ? e.children(e.child) : e.children, "Slottable");
	return t.displayName = `${e}.Slottable`, t.__radixId = md, t;
}
dd(hd, "createSlottable");
var gd = /* @__PURE__ */ dd((e, t) => {
	if ("child" in e.props) {
		let t = e.props.child;
		return O.isValidElement(t) ? O.cloneElement(t, void 0, e.props.children(t.props.children)) : null;
	}
	return O.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function _d(e, t) {
	let n = { ...t };
	for (let r in t) {
		let i = e[r], a = t[r];
		/^on[A-Z]/.test(r) ? i && a ? n[r] = (...e) => {
			let t = a(...e);
			return i(...e), t;
		} : i && (n[r] = i) : r === "style" ? n[r] = {
			...i,
			...a
		} : r === "className" && (n[r] = [i, a].filter(Boolean).join(" "));
	}
	return {
		...e,
		...n
	};
}
dd(_d, "mergeProps");
function vd(e) {
	let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
	return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
dd(vd, "getElementRef");
function yd(e) {
	return O.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === md;
}
dd(yd, "isSlottable");
var bd = Symbol.for("react.lazy");
function xd(e) {
	return typeof e == "object" && !!e && "$$typeof" in e && e.$$typeof === bd && "_payload" in e && Sd(e._payload);
}
dd(xd, "isLazyComponent");
function Sd(e) {
	return typeof e == "object" && !!e && "then" in e;
}
dd(Sd, "isPromiseLike");
var Cd = /* @__PURE__ */ dd((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), wd = /* @__PURE__ */ dd((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Td = O.use, Ed = /* @__PURE__ */ c(m(), 1), Dd = Object.defineProperty, Od = (e, t) => Dd(e, "name", {
	value: t,
	configurable: !0
}), kd = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((e, t) => {
	let n = /* @__PURE__ */ fd(`Primitive.${t}`), r = O.forwardRef((e, r) => {
		let { asChild: i, ...a } = e, o = i ? n : t;
		return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ (0, H.jsx)(o, {
			...a,
			ref: r
		});
	});
	return r.displayName = `Primitive.${t}`, {
		...e,
		[t]: r
	};
}, {});
function Ad(e, t) {
	e && Ed.flushSync(() => e.dispatchEvent(t));
}
Od(Ad, "dispatchDiscreteCustomEvent");
//#endregion
//#region node_modules/@radix-ui/primitive/dist/index.mjs
var jd = Object.defineProperty, Md = (e, t) => jd(e, "name", {
	value: t,
	configurable: !0
}), Nd = !!(typeof window < "u" && window.document && window.document.createElement);
function Pd(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
	return /* @__PURE__ */ Md(function(r) {
		if (e?.(r), n === !1 || !r || !r.defaultPrevented) return t?.(r);
	}, "handleEvent");
}
Md(Pd, "composeEventHandlers");
function Fd(e) {
	if (!Nd) throw Error("Cannot access window outside of the DOM");
	return e?.ownerDocument?.defaultView ?? window;
}
Md(Fd, "getOwnerWindow");
function Id(e) {
	if (!Nd) throw Error("Cannot access document outside of the DOM");
	return e?.ownerDocument ?? document;
}
Md(Id, "getOwnerDocument");
function Ld(e, t = !1) {
	let { activeElement: n } = Id(e);
	if (!n?.nodeName) return null;
	if (Rd(n) && n.contentDocument) return Ld(n.contentDocument.body, t);
	if (t) {
		let e = n.getAttribute("aria-activedescendant");
		if (e) {
			let t = Id(n).getElementById(e);
			if (t) return t;
		}
	}
	return n;
}
Md(Ld, "getActiveElement");
function Rd(e) {
	return e.tagName === "IFRAME";
}
Md(Rd, "isFrame");
//#endregion
//#region node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var zd = Object.defineProperty, Bd = (e, t) => zd(e, "name", {
	value: t,
	configurable: !0
});
function Vd(e) {
	let t = O.useRef(e);
	return O.useEffect(() => {
		t.current = e;
	}), O.useMemo(() => ((...e) => t.current?.(...e)), []);
}
Bd(Vd, "useCallbackRef");
//#endregion
//#region node_modules/radix-ui/dist/internal.mjs
var Hd = kd;
Hd.dispatchDiscreteCustomEvent = Ad, Hd.Root = kd;
//#endregion
//#region node_modules/@assistant-ui/react/dist/_virtual/_rolldown/runtime.js
var Ud = Object.defineProperty, Wd = (e, t) => {
	let n = {};
	for (var r in e) Ud(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || Ud(n, Symbol.toStringTag, { value: "Module" }), n;
}, Gd = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
];
function Kd(e, t) {
	return ft(e, void 0, t === void 0 ? e.props.children : t);
}
function qd(e, t, n) {
	return /* @__PURE__ */ (0, H.jsx)(pd, {
		...n,
		children: Kd(e, t)
	});
}
function Jd(e) {
	let t = ct((t, n) => {
		let r = A(17), i, a, o, s;
		r[0] === t ? (i = r[1], a = r[2], o = r[3], s = r[4]) : ({render: o, asChild: i, children: a, ...s} = t, r[0] = t, r[1] = i, r[2] = a, r[3] = o, r[4] = s);
		let c = e;
		if (o && pt(o)) {
			let e = s, t;
			r[5] !== a || r[6] !== o ? (t = Kd(o, a), r[5] = a, r[6] = o, r[7] = t) : t = r[7];
			let i;
			return r[8] !== n || r[9] !== e || r[10] !== t ? (i = /* @__PURE__ */ (0, H.jsx)(c, {
				...e,
				asChild: !0,
				ref: n,
				children: t
			}), r[8] = n, r[9] = e, r[10] = t, r[11] = i) : i = r[11], i;
		}
		let l = s, u;
		return r[12] !== i || r[13] !== a || r[14] !== n || r[15] !== l ? (u = /* @__PURE__ */ (0, H.jsx)(c, {
			...l,
			asChild: i,
			ref: n,
			children: a
		}), r[12] = i, r[13] = a, r[14] = n, r[15] = l, r[16] = u) : u = r[16], u;
	});
	return t.displayName = typeof e == "string" ? e : e.displayName ?? e.name ?? "Component", t;
}
function Yd(e) {
	let t = Hd[e], n = Jd(t);
	return n.displayName = `Primitive.${e}`, n;
}
var Xd = Gd.reduce((e, t) => (e[t] = Yd(t), e), {}), Zd = (e, t, n = []) => {
	let r = ct((e, r) => {
		let i = A(6), a = {}, o = {};
		Object.keys(e).forEach((t) => {
			n.includes(t) ? a[t] = e[t] : o[t] = e[t];
		});
		let s = t(a) ?? void 0, c = Xd, l = o.disabled || !s, u = Pd(o.onClick, s), d;
		return i[0] !== r || i[1] !== o || i[2] !== c.button || i[3] !== l || i[4] !== u ? (d = /* @__PURE__ */ (0, H.jsx)(c.button, {
			type: "button",
			...o,
			ref: r,
			disabled: l,
			onClick: u
		}), i[0] = r, i[1] = o, i[2] = c.button, i[3] = l, i[4] = u, i[5] = d) : d = i[5], d;
	});
	return r.displayName = e, r;
}, Qd = (e) => {
	let t = A(4), n = Vd(e), r = Yu($d), i, a;
	t[0] !== n || t[1] !== r ? (i = () => r(n), a = [r, n], t[0] = n, t[1] = r, t[2] = i, t[3] = a) : (i = t[2], a = t[3]), R(i, a);
};
function $d(e) {
	return e.onScrollToBottom;
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/utils/hooks/useMediaQuery.js
var ef = () => !1, tf = () => {}, nf = (e) => {
	let t = A(4), n;
	t[0] === e ? n = t[1] : (n = (t) => {
		if (typeof window > "u" || e === null || !window.matchMedia) return tf;
		let n = window.matchMedia(e);
		return n.addEventListener("change", t), () => n.removeEventListener("change", t);
	}, t[0] = e, t[1] = n);
	let r = n, i;
	return t[2] === e ? i = t[3] : (i = () => typeof window > "u" || e === null || !window.matchMedia ? !1 : window.matchMedia(e).matches, t[2] = e, t[3] = i), it(r, i, ef);
}, rf = Object.freeze({ type: "complete" }), af = Object.freeze({
	type: "text",
	text: "",
	status: rf
}), of = () => B(sf);
function sf(e) {
	return e.part.type !== "text" && e.part.type !== "reasoning" ? af : e.part;
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/utils/smooth/SmoothContext.js
var cf = mt(null);
function lf(e) {
	let t = gt(cf);
	if (!e?.optional && !t) throw Error("This component must be used within a SmoothContextProvider.");
	return t;
}
var { useSmoothStatus: uf, useSmoothStatusStore: df } = qu(lf, "useSmoothStatus"), ff = 250, pf = 5, Z = class {
	animationFrameId = null;
	lastUpdateTime = Date.now();
	lastCommitTime = 0;
	targetText = "";
	drainMs = ff;
	maxCharIntervalMs = pf;
	maxCharsPerFrame = Infinity;
	minCommitMs = 0;
	currentText;
	setText;
	constructor(e, t) {
		this.currentText = e, this.setText = t;
	}
	start() {
		this.animationFrameId === null && (this.lastUpdateTime = Date.now(), this.animate());
	}
	stop() {
		this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
	}
	animate = () => {
		let e = Date.now(), t = e - this.lastUpdateTime, n = this.targetText.length - this.currentText.length, r = Math.min(this.maxCharIntervalMs, this.drainMs / n), i = Math.min(n, this.maxCharsPerFrame), a = 0;
		for (; t >= r && a < i;) a++, t -= r;
		a === i && i === this.maxCharsPerFrame && (t = 0), this.animationFrameId = a === n ? null : requestAnimationFrame(this.animate), a !== 0 && (this.currentText = this.targetText.slice(0, this.currentText.length + a), this.lastUpdateTime = e - t, (a === n || e - this.lastCommitTime >= this.minCommitMs) && (this.lastCommitTime = e, this.setText(this.currentText)));
	};
}, mf = Object.freeze({ type: "running" }), hf = (e, t) => e !== void 0 && e > 0 ? e : t, gf = (e, t = !1) => {
	let { text: n } = e, r = nf("(prefers-reduced-motion: reduce)"), i = typeof t == "object" && t ? t : void 0, a = t !== !1 && t !== null && !r, o = hf(i?.drainMs, ff), s = hf(i?.maxCharIntervalMs, pf), c = hf(i?.maxCharsPerFrame, Infinity), l = hf(i?.minCommitMs, 0), [u, d] = I(e.status.type === "running" ? "" : n), f = Gr(), p = B(() => f.part), [m, h] = I(p);
	(p !== m || !n.startsWith(u)) && (h(p), d(e.status.type === "running" ? "" : n));
	let g = df({ optional: !0 }), _ = Vd((t) => {
		if (d(t), g) {
			let n = u !== t || e.status.type === "running" ? mf : e.status;
			ed(g).setState(n, !0);
		}
	});
	R(() => {
		if (g) {
			let t = a && (u !== n || e.status.type === "running") ? mf : e.status;
			ed(g).setState(t, !0);
		}
	}, [
		g,
		a,
		n,
		u,
		e.status
	]);
	let [v] = I(new Z(u, _));
	R(() => {
		v.drainMs = o, v.maxCharIntervalMs = s, v.maxCharsPerFrame = c, v.minCommitMs = l;
	}, [
		v,
		o,
		s,
		c,
		l
	]);
	let y = L(p);
	return R(() => {
		if (!a) {
			v.stop();
			return;
		}
		let t = y.current !== p;
		if (y.current = p, t || !n.startsWith(v.targetText)) {
			e.status.type === "running" ? (v.currentText = "", v.targetText = n, v.lastCommitTime = 0, v.start()) : (v.currentText = n, v.targetText = n, v.stop(), _(n));
			return;
		}
		if (v.targetText = n, e.status.type !== "running") {
			if (v.currentText === "") {
				v.currentText = n, v.stop(), _(n);
				return;
			}
			v.start();
			return;
		}
		v.start();
	}, [
		v,
		a,
		n,
		e.status.type,
		p,
		_
	]), R(() => () => {
		v.stop();
	}, [v]), et(() => a ? {
		...e,
		text: u,
		status: n === u ? e.status : mf
	} : e, [
		a,
		u,
		e,
		n
	]);
}, _f = Object.freeze({ type: "complete" }), vf = Object.freeze({
	type: "image",
	image: "",
	status: _f
}), yf = () => B(bf);
function bf(e) {
	return e.part.type === "image" ? e.part : vf;
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartText.js
var xf = ct(({ smooth: e = !0, component: t = Xd.span, render: n, ...r }, i) => {
	let { text: a, status: o } = gf(of(), e), s = {
		"data-status": o.type,
		...r,
		ref: i
	};
	return n && pt(n) ? qd(n, a, s) : /* @__PURE__ */ (0, H.jsx)(t, {
		...s,
		children: a
	});
});
xf.displayName = "MessagePartPrimitive.Text";
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/messagePart/MessagePartImage.js
var Sf = ct((e, t) => {
	let n = A(4), { image: r } = yf(), i;
	return n[0] !== t || n[1] !== r || n[2] !== e ? (i = /* @__PURE__ */ (0, H.jsx)(Xd.img, {
		src: r,
		...e,
		ref: t
	}), n[0] = t, n[1] = r, n[2] = e, n[3] = i) : i = n[3], i;
});
Sf.displayName = "MessagePartPrimitive.Image";
//#endregion
//#region node_modules/@assistant-ui/react/dist/utils/hooks/useManagedRef.js
var Cf = (e) => {
	let t = A(2), n = L(void 0), r;
	return t[0] === e ? r = t[1] : (r = (t) => {
		n.current &&= (n.current(), void 0), t && (n.current = e(t));
	}, t[0] = e, t[1] = r), r;
}, wf = (e, t) => {
	let n = e.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
	if (!n) return Infinity;
	let r = Number(n[1]), i = n[2];
	return i === "px" ? r : i === "em" ? r * (parseFloat(getComputedStyle(t).fontSize) || 16) : i === "rem" ? r * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Infinity;
}, Tf = (e) => e.dataset.messageId, Ef = () => {
	let e = document.createElement("div");
	return e.dataset.auiTopAnchorReserve = "", e.style.height = "0px", e.style.flexShrink = "0", e.style.pointerEvents = "none", e.setAttribute("aria-hidden", "true"), e;
}, Df = (e, t) => {
	let n = `${t}px`;
	return e.style.height !== n && (e.style.height = n, !0);
}, Of = (e) => {
	let t = window.devicePixelRatio || 1;
	return Math.round(e * t) / t;
}, kf = () => {
	let e = A(4), t = Gr(), n;
	e[0] === t.message ? n = e[1] : (n = () => t.message, e[0] = t.message, e[1] = n);
	let r = B(n), i;
	return e[2] === r ? i = e[3] : (i = (e) => {
		let t = () => {
			r.setIsHovering(!0);
		}, n = () => {
			r.setIsHovering(!1);
		};
		return e.addEventListener("mouseenter", t), e.addEventListener("mouseleave", n), e.matches(":hover") && queueMicrotask(() => r.setIsHovering(!0)), () => {
			e.removeEventListener("mouseenter", t), e.removeEventListener("mouseleave", n), r.setIsHovering(!1);
		};
	}, e[2] = r, e[3] = i), Cf(i);
}, Af = () => {
	let e = A(2), t = Yu(Lf), n;
	return e[0] === t ? n = e[1] : (n = (e) => e.message.role === "user" && e.message.index > 0 && e.message.index === e.thread.messages.length - 2 && e.thread.messages.at(-1)?.role === "assistant" && (e.message.id === t || e.thread.isRunning), e[0] = t, e[1] = n), B(n);
}, jf = () => {
	let e = A(2), t = Yu(Rf), n;
	return e[0] === t ? n = e[1] : (n = (e) => e.message.isLast && e.message.role === "assistant" && e.message.index >= 1 && e.thread.messages.at(e.message.index - 1)?.role === "user" && (e.message.id === t || e.thread.isRunning), e[0] = t, e[1] = n), B(n);
}, Mf = (e, t) => {
	let n = A(3), r;
	return n[0] !== e || n[1] !== t ? (r = (n) => {
		if (e) return t.getState().registerAnchorElement(n);
	}, n[0] = e, n[1] = t, n[2] = r) : r = n[2], Cf(r);
}, Nf = (e) => {
	let t = A(3), { active: n, threadViewportStore: r } = e, i;
	return t[0] !== n || t[1] !== r ? (i = (e) => {
		if (!n) return;
		let t = r.getState(), i = t.topAnchorMessageClamp;
		return t.registerAnchorTargetElement(e, {
			tallerThan: wf(i.tallerThan, e),
			visibleHeight: wf(i.visibleHeight, e)
		});
	}, t[0] = n, t[1] = r, t[2] = i) : i = t[2], Cf(i);
}, Pf = (e) => {
	let t = A(7), n, r;
	t[0] === e ? (n = t[1], r = t[2]) : ({forwardedRef: n, ...r} = e, t[0] = e, t[1] = n, t[2] = r);
	let i = kf(), a = ld(n, i), o = B(zf), s;
	return t[3] !== o || t[4] !== r || t[5] !== a ? (s = /* @__PURE__ */ (0, H.jsx)(Xd.div, {
		...r,
		ref: a,
		"data-message-id": o
	}), t[3] = o, t[4] = r, t[5] = a, t[6] = s) : s = t[6], s;
}, Ff = (e) => {
	let t = A(13), n, r, i;
	t[0] === e ? (n = t[1], r = t[2], i = t[3]) : ({forwardedRef: n, threadViewportStore: i, ...r} = e, t[0] = e, t[1] = n, t[2] = r, t[3] = i);
	let a = kf(), o = Af(), s = jf(), c = Mf(o, i), l;
	t[4] !== s || t[5] !== i ? (l = {
		active: s,
		threadViewportStore: i
	}, t[4] = s, t[5] = i, t[6] = l) : l = t[6];
	let u = Nf(l), d = ld(n, a, c, u), f = B(Bf), p = o ? "" : void 0, m = s ? "" : void 0, h;
	return t[7] !== f || t[8] !== r || t[9] !== d || t[10] !== p || t[11] !== m ? (h = /* @__PURE__ */ (0, H.jsx)(Xd.div, {
		...r,
		ref: d,
		"data-message-id": f,
		"data-aui-top-anchor-user": p,
		"data-aui-top-anchor-target": m
	}), t[7] = f, t[8] = r, t[9] = d, t[10] = p, t[11] = m, t[12] = h) : h = t[12], h;
}, If = ct((e, t) => {
	let n = A(7), r = Xu();
	if (r.getState().turnAnchor === "top") {
		let i;
		return n[0] !== t || n[1] !== e || n[2] !== r ? (i = /* @__PURE__ */ (0, H.jsx)(Ff, {
			...e,
			forwardedRef: t,
			threadViewportStore: r
		}), n[0] = t, n[1] = e, n[2] = r, n[3] = i) : i = n[3], i;
	}
	let i;
	return n[4] !== t || n[5] !== e ? (i = /* @__PURE__ */ (0, H.jsx)(Pf, {
		...e,
		forwardedRef: t
	}), n[4] = t, n[5] = e, n[6] = i) : i = n[6], i;
});
If.displayName = "MessagePrimitive.Root";
function Lf(e) {
	return e.topAnchorTurn?.anchorId;
}
function Rf(e) {
	return e.topAnchorTurn?.targetId;
}
function zf(e) {
	return e.message.id;
}
function Bf(e) {
	return e.message.id;
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/message/MessageParts.js
var Vf = {
	...Vl,
	Text: () => /* @__PURE__ */ (0, H.jsxs)("p", {
		style: { whiteSpace: "pre-line" },
		children: [/* @__PURE__ */ (0, H.jsx)(xf, {}), /* @__PURE__ */ (0, H.jsx)(Pu, { children: /* @__PURE__ */ (0, H.jsx)("span", {
			style: { fontFamily: "revert" },
			children: " ●"
		}) })]
	}),
	Image: () => /* @__PURE__ */ (0, H.jsx)(Sf, {})
}, Q = (e) => {
	let t = A(10);
	if ("children" in e) {
		let n;
		return t[0] === e.children ? n = t[1] : (n = /* @__PURE__ */ (0, H.jsx)(iu, { children: e.children }), t[0] = e.children, t[1] = n), n;
	}
	let n, r;
	t[2] === e ? (n = t[3], r = t[4]) : ({components: n, ...r} = e, t[2] = e, t[3] = n, t[4] = r);
	let i;
	t[5] === n ? i = t[6] : (i = n ? {
		...n,
		Text: n.Text ?? Vf.Text,
		Image: n.Image ?? Vf.Image
	} : Vf, t[5] = n, t[6] = i);
	let a = i, o;
	return t[7] !== r || t[8] !== a ? (o = /* @__PURE__ */ (0, H.jsx)(iu, {
		components: a,
		...r
	}), t[7] = r, t[8] = a, t[9] = o) : o = t[9], o;
};
Q.displayName = "MessagePrimitive.Parts";
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/message/MessageIf.js
var Hf = (e) => {
	let t = A(12), n;
	return t[0] !== e.assistant || t[1] !== e.copied || t[2] !== e.hasAttachments || t[3] !== e.hasBranches || t[4] !== e.hasContent || t[5] !== e.last || t[6] !== e.lastOrHover || t[7] !== e.speaking || t[8] !== e.submittedFeedback || t[9] !== e.system || t[10] !== e.user ? (n = (t) => {
		let { role: n, attachments: r, parts: i, branchCount: a, isLast: o, speech: s, isCopied: c, isHovering: l } = t.message;
		return !(e.hasBranches === !0 && a < 2 || e.user && n !== "user" || e.assistant && n !== "assistant" || e.system && n !== "system" || e.lastOrHover === !0 && !l && !o || e.last !== void 0 && e.last !== o || e.copied === !0 && !c || e.copied === !1 && c || e.speaking === !0 && s == null || e.speaking === !1 && s != null || e.hasAttachments === !0 && (n !== "user" || !r?.length) || e.hasAttachments === !1 && n === "user" && r?.length || e.hasContent === !0 && i.length === 0 || e.hasContent === !1 && i.length > 0 || e.submittedFeedback !== void 0 && (t.message.metadata.submittedFeedback?.type ?? null) !== e.submittedFeedback);
	}, t[0] = e.assistant, t[1] = e.copied, t[2] = e.hasAttachments, t[3] = e.hasBranches, t[4] = e.hasContent, t[5] = e.last, t[6] = e.lastOrHover, t[7] = e.speaking, t[8] = e.submittedFeedback, t[9] = e.system, t[10] = e.user, t[11] = n) : n = t[11], B(n);
}, Uf = (e) => {
	let t = A(3), n, r;
	return t[0] === e ? (n = t[1], r = t[2]) : ({children: n, ...r} = e, t[0] = e, t[1] = n, t[2] = r), Hf(r) ? n : null;
};
Uf.displayName = "MessagePrimitive.If";
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/message/MessageError.js
var Wf = (e) => {
	let { children: t } = e;
	return Gu() === void 0 ? null : t;
};
Wf.displayName = "MessagePrimitive.Error";
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/message/MessagePartsGrouped.js
var Gf = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length; n++) {
		let r = e[n]?.parentId ?? n, i = t.get(r) ?? [];
		i.push(n), t.set(r, i);
	}
	let n = [];
	for (let [e, r] of t) {
		let t = typeof e == "string" ? e : void 0;
		n.push({
			groupKey: t,
			indices: r
		});
	}
	return n;
}, Kf = (e) => {
	let t = A(4), n = B(np), r;
	bb0: {
		if (n.length === 0) {
			let e;
			t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = [], t[0] = e) : e = t[0], r = e;
			break bb0;
		}
		let i;
		t[1] !== e || t[2] !== n ? (i = e(n), t[1] = e, t[2] = n, t[3] = i) : i = t[3], r = i;
	}
	return r;
}, qf = (e) => {
	let t = A(9), n, r;
	t[0] === e ? (n = t[1], r = t[2]) : ({Fallback: n, ...r} = e, t[0] = e, t[1] = n, t[2] = r);
	let i;
	t[3] !== n || t[4] !== r.toolName ? (i = (e) => e.tools.toolUIs[r.toolName]?.[0]?.render ?? n, t[3] = n, t[4] = r.toolName, t[5] = i) : i = t[5];
	let a = B(i);
	if (!a) return null;
	let o;
	return t[6] !== a || t[7] !== r ? (o = /* @__PURE__ */ (0, H.jsx)(a, { ...r }), t[6] = a, t[7] = r, t[8] = o) : o = t[8], o;
}, Jf = (e) => {
	let t = A(9), n, r;
	t[0] === e ? (n = t[1], r = t[2]) : ({Fallback: n, ...r} = e, t[0] = e, t[1] = n, t[2] = r);
	let i;
	t[3] !== n || t[4] !== r.name ? (i = (e) => {
		let t = e.dataRenderers.renderers[r.name] ?? n;
		return Array.isArray(t) ? t[0] ?? n : t;
	}, t[3] = n, t[4] = r.name, t[5] = i) : i = t[5];
	let a = B(i);
	if (!a) return null;
	let o;
	return t[6] !== a || t[7] !== r ? (o = /* @__PURE__ */ (0, H.jsx)(a, { ...r }), t[6] = a, t[7] = r, t[8] = o) : o = t[8], o;
}, Yf = {
	Text: () => /* @__PURE__ */ (0, H.jsxs)("p", {
		style: { whiteSpace: "pre-line" },
		children: [/* @__PURE__ */ (0, H.jsx)(xf, {}), /* @__PURE__ */ (0, H.jsx)(Pu, { children: /* @__PURE__ */ (0, H.jsx)("span", {
			style: { fontFamily: "revert" },
			children: " ●"
		}) })]
	}),
	Reasoning: () => null,
	Source: () => null,
	Image: () => /* @__PURE__ */ (0, H.jsx)(Sf, {}),
	File: () => null,
	Unstable_Audio: () => null,
	Group: ({ children: e }) => e
}, Xf = (e) => {
	let t = A(37), { components: n } = e, r;
	t[0] === n ? r = t[1] : (r = n === void 0 ? {} : n, t[0] = n, t[1] = r);
	let { Text: i, Reasoning: a, Image: o, Source: s, File: c, Unstable_Audio: l, tools: u, data: d } = r, f = i === void 0 ? Yf.Text : i, p = a === void 0 ? Yf.Reasoning : a, m = o === void 0 ? Yf.Image : o, h = s === void 0 ? Yf.Source : s, g = c === void 0 ? Yf.File : c, _ = l === void 0 ? Yf.Unstable_Audio : l, v;
	t[2] === u ? v = t[3] : (v = u === void 0 ? {} : u, t[2] = u, t[3] = v);
	let y = v, b = Gr(), x = B(rp), S = x.type;
	if (S === "tool-call") {
		let e = b.part.addToolResult, n = b.part.resumeToolCall, r = b.part.respondToToolApproval;
		if ("Override" in y) {
			let i;
			return t[4] !== e || t[5] !== x || t[6] !== r || t[7] !== n || t[8] !== y.Override ? (i = /* @__PURE__ */ (0, H.jsx)(y.Override, {
				...x,
				addResult: e,
				resume: n,
				respondToApproval: r
			}), t[4] = e, t[5] = x, t[6] = r, t[7] = n, t[8] = y.Override, t[9] = i) : i = t[9], i;
		}
		let i = y.by_name?.[x.toolName] ?? y.Fallback, a;
		return t[10] !== i || t[11] !== e || t[12] !== x || t[13] !== r || t[14] !== n ? (a = /* @__PURE__ */ (0, H.jsx)(qf, {
			...x,
			Fallback: i,
			addResult: e,
			resume: n,
			respondToApproval: r
		}), t[10] = i, t[11] = e, t[12] = x, t[13] = r, t[14] = n, t[15] = a) : a = t[15], a;
	}
	if (x.status?.type === "requires-action") throw Error("Encountered unexpected requires-action status");
	switch (S) {
		case "text": {
			let e;
			return t[16] !== f || t[17] !== x ? (e = /* @__PURE__ */ (0, H.jsx)(f, { ...x }), t[16] = f, t[17] = x, t[18] = e) : e = t[18], e;
		}
		case "reasoning": {
			let e;
			return t[19] !== p || t[20] !== x ? (e = /* @__PURE__ */ (0, H.jsx)(p, { ...x }), t[19] = p, t[20] = x, t[21] = e) : e = t[21], e;
		}
		case "source": {
			let e;
			return t[22] !== h || t[23] !== x ? (e = /* @__PURE__ */ (0, H.jsx)(h, { ...x }), t[22] = h, t[23] = x, t[24] = e) : e = t[24], e;
		}
		case "image": {
			let e;
			return t[25] !== m || t[26] !== x ? (e = /* @__PURE__ */ (0, H.jsx)(m, { ...x }), t[25] = m, t[26] = x, t[27] = e) : e = t[27], e;
		}
		case "file": {
			let e;
			return t[28] !== g || t[29] !== x ? (e = /* @__PURE__ */ (0, H.jsx)(g, { ...x }), t[28] = g, t[29] = x, t[30] = e) : e = t[30], e;
		}
		case "audio": {
			let e;
			return t[31] !== _ || t[32] !== x ? (e = /* @__PURE__ */ (0, H.jsx)(_, { ...x }), t[31] = _, t[32] = x, t[33] = e) : e = t[33], e;
		}
		case "data": {
			let e = d?.by_name?.[x.name] ?? d?.Fallback, n;
			return t[34] !== e || t[35] !== x ? (n = /* @__PURE__ */ (0, H.jsx)(Jf, {
				...x,
				Fallback: e
			}), t[34] = e, t[35] = x, t[36] = n) : n = t[36], n;
		}
		default: return console.warn(`Unknown message part type: ${S}`), null;
	}
}, Zf = lt((e) => {
	let t = A(5), { partIndex: n, components: r } = e, i;
	t[0] === r ? i = t[1] : (i = /* @__PURE__ */ (0, H.jsx)(Xf, { components: r }), t[0] = r, t[1] = i);
	let a;
	return t[2] !== n || t[3] !== i ? (a = /* @__PURE__ */ (0, H.jsx)(As, {
		index: n,
		children: i
	}), t[2] = n, t[3] = i, t[4] = a) : a = t[4], a;
}, (e, t) => e.partIndex === t.partIndex && e.components?.Text === t.components?.Text && e.components?.Reasoning === t.components?.Reasoning && e.components?.Source === t.components?.Source && e.components?.Image === t.components?.Image && e.components?.File === t.components?.File && e.components?.Unstable_Audio === t.components?.Unstable_Audio && e.components?.tools === t.components?.tools && e.components?.data === t.components?.data && e.components?.Group === t.components?.Group), Qf = (e) => {
	let t = A(6), { status: n, component: r } = e, i = n.type === "running", a;
	t[0] !== r || t[1] !== n ? (a = /* @__PURE__ */ (0, H.jsx)(r, {
		type: "text",
		text: "",
		status: n
	}), t[0] = r, t[1] = n, t[2] = a) : a = t[2];
	let o;
	return t[3] !== i || t[4] !== a ? (o = /* @__PURE__ */ (0, H.jsx)(Ms, {
		text: "",
		isRunning: i,
		children: a
	}), t[3] = i, t[4] = a, t[5] = o) : o = t[5], o;
}, $f = Object.freeze({ type: "complete" }), ep = lt((e) => {
	let t = A(6), { components: n } = e, r = B(ip);
	if (n?.Empty) {
		let e;
		return t[0] !== n.Empty || t[1] !== r ? (e = /* @__PURE__ */ (0, H.jsx)(n.Empty, { status: r }), t[0] = n.Empty, t[1] = r, t[2] = e) : e = t[2], e;
	}
	let i = n?.Text ?? Yf.Text, a;
	return t[3] !== r || t[4] !== i ? (a = /* @__PURE__ */ (0, H.jsx)(Qf, {
		status: r,
		component: i
	}), t[3] = r, t[4] = i, t[5] = a) : a = t[5], a;
}, (e, t) => e.components?.Empty === t.components?.Empty && e.components?.Text === t.components?.Text), $ = (e) => {
	let t = A(9), { groupingFunction: n, components: r } = e, i = B(ap), a = Kf(n), o;
	bb0: {
		if (i === 0) {
			let e;
			t[0] === r ? e = t[1] : (e = /* @__PURE__ */ (0, H.jsx)(ep, { components: r }), t[0] = r, t[1] = e), o = e;
			break bb0;
		}
		let e;
		if (t[2] !== r || t[3] !== a) {
			let n;
			t[5] === r ? n = t[6] : (n = (e, t) => {
				let n = r?.Group ?? Yf.Group;
				return /* @__PURE__ */ (0, H.jsx)(n, {
					groupKey: e.groupKey,
					indices: e.indices,
					children: e.indices.map((e) => /* @__PURE__ */ (0, H.jsx)(Zf, {
						partIndex: e,
						components: r
					}, e))
				}, `group-${t}-${e.groupKey ?? "ungrouped"}`);
			}, t[5] = r, t[6] = n), e = a.map(n), t[2] = r, t[3] = a, t[4] = e;
		} else e = t[4];
		o = e;
	}
	let s = o, c;
	return t[7] === s ? c = t[8] : (c = /* @__PURE__ */ (0, H.jsx)(H.Fragment, { children: s }), t[7] = s, t[8] = c), c;
};
$.displayName = "MessagePrimitive.Unstable_PartsGrouped";
var tp = (e) => {
	let t = A(6), n, r;
	t[0] === e ? (n = t[1], r = t[2]) : ({components: n, ...r} = e, t[0] = e, t[1] = n, t[2] = r);
	let i;
	return t[3] !== n || t[4] !== r ? (i = /* @__PURE__ */ (0, H.jsx)($, {
		...r,
		components: n,
		groupingFunction: Gf
	}), t[3] = n, t[4] = r, t[5] = i) : i = t[5], i;
};
tp.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function np(e) {
	return e.message.parts;
}
function rp(e) {
	return e.part;
}
function ip(e) {
	return e.message.status ?? $f;
}
function ap(e) {
	return e.message.parts.length;
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/message.js
var op = /* @__PURE__ */ Wd({
	AttachmentByIndex: () => Au,
	Attachments: () => Mu,
	Content: () => Q,
	Error: () => Wf,
	GenerativeUI: () => Nl,
	GroupedParts: () => Eu,
	If: () => Uf,
	PartByIndex: () => Ul,
	Parts: () => Q,
	Quote: () => Du,
	Root: () => If,
	Unstable_PartsGrouped: () => $,
	Unstable_PartsGroupedByParentId: () => tp
}), sp = (e) => {
	let t = A(2), n = Vd(e), r;
	return t[0] === n ? r = t[1] : (r = (e) => {
		let t = new ResizeObserver(() => {
			n();
		}), r = new MutationObserver((e) => {
			e.some(cp) && n();
		});
		return t.observe(e), r.observe(e, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			characterData: !0
		}), () => {
			t.disconnect(), r.disconnect();
		};
	}, t[0] = n, t[1] = r), Cf(r);
};
function cp(e) {
	return e.type !== "attributes" || e.attributeName !== "style";
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/thread/useThreadViewportAutoScroll.js
var lp = ({ autoScroll: e, scrollToBottomOnRunStart: t = !0, scrollToBottomOnInitialize: n = !0, scrollToBottomOnThreadSwitch: r = !0 }) => {
	let i = L(null), a = B((e) => e.thread.messages.length > 0), o = B((e) => e.thread.isRunning), s = L(!1), c = L(null), l = Xu();
	e === void 0 && (e = l.getState().turnAnchor !== "top");
	let u = L(0), d = L(0), f = L(0), p = L(0), m = L(null), h = L(e), g = L(e);
	nt(() => {
		let t = g.current;
		if (g.current = e, t || !e) return;
		let n = i.current;
		h.current = n !== null && ii(n);
	}, [e]);
	let _ = tt((e) => {
		let t = i.current;
		t && (h.current = !0, m.current = e, t.scrollTo({
			top: t.scrollHeight,
			behavior: e
		}));
	}, []), v = tt(() => {
		c.current !== null && (cancelAnimationFrame(c.current), c.current = null);
	}, []), y = tt((e) => {
		m.current = e, v(), c.current = requestAnimationFrame(() => {
			c.current = null, _(e);
		});
	}, [v, _]);
	nt(() => () => v(), [v]);
	let b = tt(() => {
		let e = l.getState();
		return e.turnAnchor === "top" && e.element.viewport === i.current && e.element.anchor !== null;
	}, [l]), x = () => {
		let t = i.current;
		if (!t) return;
		let n = l.getState().isAtBottom, r = ii(t);
		if (!(!r && u.current < t.scrollTop)) {
			let i = oi({
				scrollTop: u.current,
				scrollHeight: d.current
			}, t);
			r ? (ai(t) && (m.current = null), e && (h.current = !0)) : i && (v(), m.current = null, h.current = !1), (r || m.current === null) && r !== n && ed(l).setState({ isAtBottom: r });
		}
		u.current = t.scrollTop, d.current = t.scrollHeight;
	}, S = sp(() => {
		let t = i.current;
		if (!t) return;
		let { scrollHeight: n, clientHeight: r } = t;
		if (n === f.current && r === p.current) return;
		f.current = n, p.current = r;
		let a = m.current;
		a && b() ? m.current = null : a ? _(a) : e && !(o && b()) && h.current && _("instant"), x();
	}), C = Cf((e) => {
		let t = () => {
			m.current = null;
		};
		return e.addEventListener("scroll", x), e.addEventListener("pointerdown", t), () => {
			e.removeEventListener("scroll", x), e.removeEventListener("pointerdown", t);
		};
	});
	return nt(() => {
		if (n) {
			if (!a) {
				s.current = !1;
				return;
			}
			s.current || (s.current = !0, m.current === null && y("instant"));
		}
	}, [
		a,
		y,
		n
	]), Qd(({ behavior: e }) => {
		_(e);
	}), ka("thread.runStart", () => {
		t && l.getState().turnAnchor !== "top" && y("auto");
	}), ka("threads.selectionChanged", () => {
		r && y("instant");
	}), ld(S, C, i);
}, up = ct((e, t) => {
	let n = A(6), r = Gr(), i, a;
	n[0] === r ? (i = n[1], a = n[2]) : (i = () => {
		let e = (e) => {
			if (e.key === "Escape" && !(e.defaultPrevented || r.thread.source === null) && r.thread.getState().speech != null) {
				e.preventDefault();
				try {
					r.thread.stopSpeaking();
				} catch (e) {
					let t = e;
					if (!(t instanceof Error) || t.message !== "No message is being spoken") throw t;
				}
			}
		};
		return document.addEventListener("keydown", e), () => {
			document.removeEventListener("keydown", e);
		};
	}, a = [r], n[0] = r, n[1] = i, n[2] = a), R(i, a);
	let o;
	return n[3] !== e || n[4] !== t ? (o = /* @__PURE__ */ (0, H.jsx)(Xd.div, {
		...e,
		ref: t
	}), n[3] = e, n[4] = t, n[5] = o) : o = n[5], o;
});
up.displayName = "ThreadPrimitive.Root";
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/thread/ThreadEmpty.js
var dp = (e) => {
	let { children: t } = e;
	return B(fp) ? t : null;
};
dp.displayName = "ThreadPrimitive.Empty";
function fp(e) {
	return e.thread.isEmpty;
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/thread/ThreadIf.js
var pp = (e) => {
	let t = A(4), n;
	return t[0] !== e.disabled || t[1] !== e.empty || t[2] !== e.running ? (n = (t) => !(e.empty === !0 && !t.thread.isEmpty || e.empty === !1 && t.thread.isEmpty || e.running === !0 && !t.thread.isRunning || e.running === !1 && t.thread.isRunning || e.disabled === !0 && !t.thread.isDisabled || e.disabled === !1 && t.thread.isDisabled), t[0] = e.disabled, t[1] = e.empty, t[2] = e.running, t[3] = n) : n = t[3], B(n);
}, mp = (e) => {
	let t = A(3), n, r;
	return t[0] === e ? (n = t[1], r = t[2]) : ({children: n, ...r} = e, t[0] = e, t[1] = n, t[2] = r), pp(r) ? n : null;
};
mp.displayName = "ThreadPrimitive.If";
//#endregion
//#region node_modules/@assistant-ui/react/dist/utils/hooks/useSizeHandle.js
var hp = (e, t) => {
	let n = A(3), r;
	return n[0] !== t || n[1] !== e ? (r = (n) => {
		if (!e) return;
		let r = e(), i = () => {
			let e = t ? t(n) : n.offsetHeight;
			r.setHeight(e);
		}, a = new ResizeObserver(i);
		return a.observe(n), i(), () => {
			a.disconnect(), r.unregister();
		};
	}, n[0] = t, n[1] = e, n[2] = r) : r = n[2], Cf(r);
}, gp = (e) => {
	let t = 0, n = e;
	for (; n;) t += n.offsetTop, n = n.offsetParent;
	return t;
}, _p = (e, t) => {
	let n = 0, r = e;
	for (; r && r !== t;) n += r.offsetTop, r = r.offsetParent;
	return r === t ? n : gp(e) - gp(t);
}, vp = ({ viewport: e, anchor: t, tallerThan: n, visibleHeight: r }) => {
	let i = _p(t, e), a = t.offsetHeight;
	return i + Math.max(0, a - (a <= n ? a : r));
}, yp = ({ scrollHeight: e, ...t }) => {
	let { viewport: n } = t, r = vp(t) + n.clientHeight;
	return Math.max(0, r - e);
}, bp = ({ viewport: e, reserve: t, ...n }) => yp({
	viewport: e,
	...n,
	scrollHeight: e.scrollHeight - t.offsetHeight
}), xp = (e) => {
	let t = new ResizeObserver(e), n = new MutationObserver(e), r = null, i = null, a = null, o = () => {
		t.disconnect(), n.disconnect(), r = null, i = null, a = null;
	};
	return {
		target: (e, s, c) => {
			(r !== e || i !== s || a !== c) && (o(), t.observe(e), t.observe(s), t.observe(c), n.observe(c, {
				childList: !0,
				subtree: !0,
				characterData: !0
			}), r = e, i = s, a = c);
		},
		disconnect: o
	};
}, Sp = (e) => {
	let t = null;
	return {
		schedule: () => {
			t === null && (t = requestAnimationFrame(() => {
				t = null, e();
			}));
		},
		cancel: () => {
			t !== null && (cancelAnimationFrame(t), t = null);
		}
	};
}, Cp = (e) => {
	let t = null, n;
	function r() {
		let r = e.getState(), { viewport: o, anchor: s, target: c } = r.element, l = r.targetConfig;
		if (r.turnAnchor !== "top" || !o) {
			a.disconnect(), t && (Df(t, 0), t.remove());
			return;
		}
		if (!s && !c && !l && r.topAnchorTurn) {
			a.disconnect(), t?.parentElement && t.parentElement.lastElementChild !== t && t.parentElement.append(t);
			return;
		}
		if (!s || !c || !l) {
			a.disconnect(), t && (Df(t, 0), t.remove());
			return;
		}
		if (t ??= Ef(), (t.parentElement !== c.parentElement || t.previousElementSibling !== c) && c.after(t), a.target(o, s, c), Df(t, bp({
			viewport: o,
			anchor: s,
			reserve: t,
			...l
		}))) {
			i.schedule();
			return;
		}
		let u = Tf(s);
		if (u !== void 0 && n === u) return;
		let d = Of(vp({
			viewport: o,
			anchor: s,
			...l
		}));
		Math.abs(o.scrollTop - d) > 1 && o.scrollTo({
			top: d,
			behavior: "smooth"
		}), u !== void 0 && (n = u);
	}
	let i = Sp(r), a = xp(i.schedule);
	i.schedule();
	let o = e.subscribe(i.schedule);
	return () => {
		i.cancel(), o(), a.disconnect(), t?.remove();
	};
}, wp = (e) => {
	let t = A(4), n = Xu(), r, i;
	t[0] !== e || t[1] !== n ? (r = () => {
		if (e) return Cp(n);
	}, i = [e, n], t[0] = e, t[1] = n, t[2] = r, t[3] = i) : (r = t[2], i = t[3]), nt(r, i);
}, Tp = (e, t) => {
	if (!e) return !1;
	let n = t.findIndex((t) => t.id === e.targetId);
	return n < 1 ? !1 : t[n - 1]?.id === e.anchorId && t.slice(n + 1).every((e) => e.role === "user");
}, Ep = ({ isRunning: e, messages: t }) => {
	if (!e) return null;
	let n = t.at(-1), r = t.at(-2);
	return r?.role !== "user" || n?.role !== "assistant" ? null : {
		anchorId: r.id,
		targetId: n.id
	};
}, Dp = (e) => Ep(e)?.anchorId, Op = (e) => Ep(e)?.targetId, kp = () => hp(Yu(Pp), Fp), Ap = () => Cf(Yu(Ip)), jp = (e) => {
	let t = A(19), n = Xu(), r;
	t[0] === e ? r = t[1] : (r = (t) => {
		if (e) return Dp(t.thread);
	}, t[0] = e, t[1] = r);
	let i = B(r), a;
	t[2] === e ? a = t[3] : (a = (t) => {
		if (e) return Op(t.thread);
	}, t[2] = e, t[3] = a);
	let o = B(a), s = Yu(Lp), c;
	bb0: {
		if (!i || !o) {
			c = null;
			break bb0;
		}
		let e;
		t[4] !== i || t[5] !== o ? (e = {
			anchorId: i,
			targetId: o
		}, t[4] = i, t[5] = o, t[6] = e) : e = t[6], c = e;
	}
	let l = c, u;
	t[7] !== e || t[8] !== s ? (u = (t) => e && !!s && Tp(s, t.thread.messages), t[7] = e, t[8] = s, t[9] = u) : u = t[9];
	let d = B(u), f, p;
	t[10] !== n || t[11] !== s || t[12] !== d ? (f = () => {
		s && !d && n.getState().setTopAnchorTurn(null);
	}, p = [
		n,
		s,
		d
	], t[10] = n, t[11] = s, t[12] = d, t[13] = f, t[14] = p) : (f = t[13], p = t[14]), nt(f, p);
	let m, h;
	t[15] !== l || t[16] !== n ? (m = () => {
		if (!l) return;
		let e = n.getState(), t = e.topAnchorTurn;
		(t?.anchorId !== l.anchorId || t.targetId !== l.targetId) && e.setTopAnchorTurn(l);
	}, h = [l, n], t[15] = l, t[16] = n, t[17] = m, t[18] = h) : (m = t[17], h = t[18]), nt(m, h);
}, Mp = ct((e, t) => {
	let n = A(18), r, i, a, o, s, c;
	n[0] === e ? (r = n[1], i = n[2], a = n[3], o = n[4], s = n[5], c = n[6]) : ({autoScroll: r, scrollToBottomOnRunStart: s, scrollToBottomOnInitialize: o, scrollToBottomOnThreadSwitch: c, children: i, ...a} = e, n[0] = e, n[1] = r, n[2] = i, n[3] = a, n[4] = o, n[5] = s, n[6] = c);
	let l;
	n[7] !== r || n[8] !== o || n[9] !== s || n[10] !== c ? (l = {
		autoScroll: r,
		scrollToBottomOnRunStart: s,
		scrollToBottomOnInitialize: o,
		scrollToBottomOnThreadSwitch: c
	}, n[7] = r, n[8] = o, n[9] = s, n[10] = c, n[11] = l) : l = n[11];
	let u = lp(l), d = kp(), f = Ap(), p = Xu(), m;
	n[12] === p ? m = n[13] : (m = p.getState(), n[12] = p, n[13] = m);
	let h = m.turnAnchor === "top";
	jp(h), wp(h);
	let g = ld(t, u, d, f), _;
	return n[14] !== i || n[15] !== g || n[16] !== a ? (_ = /* @__PURE__ */ (0, H.jsx)(Xd.div, {
		...a,
		ref: g,
		children: i
	}), n[14] = i, n[15] = g, n[16] = a, n[17] = _) : _ = n[17], _;
});
Mp.displayName = "ThreadPrimitive.ViewportScrollable";
var Np = ct((e, t) => {
	let n = A(13), r, i, a;
	n[0] === e ? (r = n[1], i = n[2], a = n[3]) : ({turnAnchor: a, topAnchorMessageClamp: i, ...r} = e, n[0] = e, n[1] = r, n[2] = i, n[3] = a);
	let o;
	n[4] !== i || n[5] !== a ? (o = {
		turnAnchor: a,
		topAnchorMessageClamp: i
	}, n[4] = i, n[5] = a, n[6] = o) : o = n[6];
	let s;
	n[7] !== r || n[8] !== t ? (s = /* @__PURE__ */ (0, H.jsx)(Mp, {
		...r,
		ref: t
	}), n[7] = r, n[8] = t, n[9] = s) : s = n[9];
	let c;
	return n[10] !== o || n[11] !== s ? (c = /* @__PURE__ */ (0, H.jsx)(nd, {
		options: o,
		children: s
	}), n[10] = o, n[11] = s, n[12] = c) : c = n[12], c;
});
Np.displayName = "ThreadPrimitive.Viewport";
function Pp(e) {
	return e.registerViewport;
}
function Fp(e) {
	return e.clientHeight;
}
function Ip(e) {
	return e.registerViewportElement;
}
function Lp(e) {
	return e.topAnchorTurn;
}
//#endregion
//#region node_modules/@assistant-ui/react/dist/primitives/thread/ThreadViewportFooter.js
var Rp = ct((e, t) => {
	let n = A(3), r = ld(t, hp(Yu(zp), Bp)), i;
	return n[0] !== e || n[1] !== r ? (i = /* @__PURE__ */ (0, H.jsx)(Xd.div, {
		...e,
		ref: r
	}), n[0] = e, n[1] = r, n[2] = i) : i = n[2], i;
});
Rp.displayName = "ThreadPrimitive.ViewportFooter";
function zp(e) {
	return e.registerContentInset;
}
function Bp(e) {
	let t = parseFloat(getComputedStyle(e).marginTop) || 0;
	return e.offsetHeight + t;
}
var Vp = Zd("ThreadPrimitive.ScrollToBottom", (e) => {
	let t = A(5), n;
	t[0] === e ? n = t[1] : (n = e === void 0 ? {} : e, t[0] = e, t[1] = n);
	let { behavior: r } = n, i = Yu(Hp), a = Xu(), o;
	return t[2] !== r || t[3] !== a ? (o = () => {
		a.getState().scrollToBottom({ behavior: r });
	}, t[2] = r, t[3] = a, t[4] = o) : o = t[4], i ? null : o;
}, ["behavior"]);
function Hp(e) {
	return e.isAtBottom;
}
var Up = Zd("ThreadPrimitive.Suggestion", (e) => {
	let t = A(4), { prompt: n, send: r, clearComposer: i, autoSend: a } = e, o = r ?? a ?? !1, s;
	t[0] !== i || t[1] !== n || t[2] !== o ? (s = {
		prompt: n,
		send: o,
		clearComposer: i
	}, t[0] = i, t[1] = n, t[2] = o, t[3] = s) : s = t[3];
	let { disabled: c, trigger: l } = Uu(s);
	return c ? null : l;
}, [
	"prompt",
	"send",
	"clearComposer",
	"autoSend",
	"method"
]), Wp = /* @__PURE__ */ Wd({
	Empty: () => dp,
	If: () => mp,
	MessageByIndex: () => bl,
	Messages: () => wl,
	Root: () => up,
	ScrollToBottom: () => Vp,
	Suggestion: () => Up,
	SuggestionByIndex: () => Lu,
	Suggestions: () => Bu,
	Unstable_MessageById: () => xl,
	Viewport: () => Np,
	ViewportFooter: () => Rp,
	ViewportProvider: () => nd
}), Gp = g(), Kp = "m4 4 16 8-16 8 3-8zM7 12h13";
function qp() {
	let e = B((e) => e.message.role);
	return /* @__PURE__ */ (0, H.jsx)(op.Root, {
		className: e === "user" ? "ai-bubble ai-bubble-out" : "ai-bubble ai-bubble-in",
		children: /* @__PURE__ */ (0, H.jsx)("div", {
			className: "ai-bubble-text",
			children: /* @__PURE__ */ (0, H.jsx)(op.Parts, {})
		})
	});
}
function Jp({ ctx: e, request: t, useDraft: n, active: r, api: i }) {
	let [a, o] = (0, O.useState)([]), [s, c] = (0, O.useState)(!1), [l, u] = (0, O.useState)(!1), [d, f] = (0, O.useState)(""), [p, m] = (0, O.useState)(""), [h, g] = (0, O.useState)([]), [_, v] = (0, O.useState)(""), y = (0, O.useRef)(0), b = (0, O.useRef)("chat"), x = (0, O.useRef)(!1), S = (0, O.useRef)(Promise.resolve()), C = (0, O.useRef)(null), w = (0, O.useRef)(null), T = (0, O.useCallback)(async () => {
		if (!e.account || !e.chat) return;
		let n = ++y.current, r = await t(`/api/ai/proposals?${new URLSearchParams({
			account: e.account,
			chat: e.chat
		})}`);
		n === y.current && g((r.proposals || []).filter((e) => typeof e.id == "string" && typeof e.text == "string"));
	}, [
		e.account,
		e.chat,
		t
	]);
	(0, O.useEffect)(() => {
		if (!r || x.current || !e.account || !e.chat) return;
		x.current = !0, c(!0);
		let n = !0;
		return t(`/api/ai/session?${new URLSearchParams({
			account: e.account,
			chat: e.chat
		})}`).then((e) => {
			n && (b.current = e.sessionId || "chat", o((e.messages || []).filter((e) => ["user", "assistant"].includes(e.role) && typeof e.content == "string").map((e, t) => ({
				id: `${b.current}-${t}`,
				role: e.role,
				content: [{
					type: "text",
					text: e.content
				}]
			}))));
		}).catch((e) => {
			n && m(e.message);
		}).finally(() => {
			n && c(!1);
		}), () => {
			n = !1;
		};
	}, [
		r,
		e.account,
		e.chat,
		t
	]), (0, O.useEffect)(() => {
		if (!r || !e.chat) return;
		let t = !0;
		return T().catch((e) => {
			t && m(e.message);
		}), () => {
			t = !1;
		};
	}, [
		r,
		e.chat,
		T
	]);
	let ee = (0, O.useCallback)(() => r ? T() : Promise.resolve(), [r, T]), E = async (n, r) => {
		if (!_) {
			v(n), m("");
			try {
				await t("/api/ai/proposal", {
					account: e.account,
					chat: e.chat,
					id: n,
					action: r
				}), g((e) => e.filter((e) => e.id !== n)), await ee().catch((e) => m(`No se pudieron actualizar las propuestas: ${e.message}`));
			} catch (e) {
				m(e.message), ee().catch(() => {});
			} finally {
				v("");
			}
		}
	}, te = (0, O.useCallback)(() => {
		let e = C.current?.querySelector(".ai-history");
		e && (e.scrollTop = e.scrollHeight);
	}, []), ne = (0, O.useCallback)(async (n) => {
		let r = String(n || "").trim();
		if (!r) return "";
		if (!e.account || !e.chat) throw Error("Selecciona una conversación para consultar.");
		let i = await t("/api/ai/chat", {
			account: e.account,
			chat: e.chat,
			message: r,
			allowPropose: !1
		}), a = typeof i.text == "string" ? i.text : "";
		return o((e) => [
			...e,
			{
				id: `user-${crypto.randomUUID()}`,
				role: "user",
				content: [{
					type: "text",
					text: r
				}]
			},
			{
				id: `assistant-${crypto.randomUUID()}`,
				role: "assistant",
				content: [{
					type: "text",
					text: a
				}]
			}
		]), ee().catch((e) => m(`No se pudieron actualizar las propuestas: ${e.message}`)), a;
	}, [
		e.account,
		e.chat,
		ee,
		t
	]), re = (0, O.useCallback)((e) => {
		let t = () => (u(!0), m(""), Promise.resolve().then(e).finally(() => u(!1))), n = S.current.then(t, t);
		return S.current = n.then(() => {}, () => {}), n;
	}, []), D = (0, O.useCallback)((e) => re(() => ne(e)), [re, ne]);
	(0, O.useEffect)(() => (i.ask = D, () => {
		i.ask === D && (i.ask = null);
	}), [i, D]);
	let ie = (0, O.useCallback)((e) => {
		let t = e.content.filter((e) => e.type === "text").map((e) => e.text).join("").trim();
		return t ? re(async () => {
			let e = await ne(t);
			return f(""), e;
		}).catch((e) => (m(e.message), Promise.reject(e))) : Promise.resolve();
	}, [re, ne]), ae = fl({
		messages: a,
		onNew: ie,
		convertMessage: (e) => e,
		isRunning: l,
		isSendDisabled: !e.chat || s || l
	}), k = [...a].reverse().find((e) => e.role === "assistant")?.content[0]?.text || "", A = (e) => {
		e.preventDefault();
		let t = d.trim();
		t && ie({
			role: "user",
			content: [{
				type: "text",
				text: t
			}]
		}).catch(() => {});
	}, j = (e) => {
		e.key === "Enter" && !e.shiftKey && !e.isComposing && (e.preventDefault(), e.currentTarget.form?.requestSubmit());
	};
	(0, O.useEffect)(() => {
		let e = w.current;
		e && (e.style.height = "auto", e.style.height = `${Math.min(e.scrollHeight, 160)}px`);
	}, [
		d,
		r,
		e.chat
	]), (0, O.useEffect)(() => {
		te();
	}, [
		a.length,
		l,
		s,
		te
	]);
	let oe = e.chat ? "Escribe para consultar sobre esta conversación." : "Selecciona una conversación para empezar.";
	return /* @__PURE__ */ (0, H.jsx)(id, {
		runtime: ae,
		children: /* @__PURE__ */ (0, H.jsx)("div", {
			className: "ai-thread",
			ref: C,
			children: /* @__PURE__ */ (0, H.jsxs)(Wp.Root, {
				className: "ai-conversation",
				children: [
					/* @__PURE__ */ (0, H.jsxs)(Wp.Viewport, {
						className: "ai-history",
						"aria-label": "Conversación con Social Media Agent",
						children: [
							s ? /* @__PURE__ */ (0, H.jsx)("p", {
								className: "ai-note",
								role: "status",
								children: "Cargando conversación…"
							}) : a.length === 0 ? /* @__PURE__ */ (0, H.jsx)("p", {
								className: "ai-note",
								children: oe
							}) : null,
							/* @__PURE__ */ (0, H.jsx)(Wp.Messages, { components: { Message: qp } }),
							l && /* @__PURE__ */ (0, H.jsxs)("div", {
								className: "ai-bubble ai-bubble-in ai-typing",
								role: "status",
								"aria-label": "Social Media Agent está escribiendo",
								children: [
									/* @__PURE__ */ (0, H.jsx)("span", {}),
									/* @__PURE__ */ (0, H.jsx)("span", {}),
									/* @__PURE__ */ (0, H.jsx)("span", {})
								]
							})
						]
					}),
					p && /* @__PURE__ */ (0, H.jsx)("p", {
						className: "ai-error",
						role: "alert",
						children: p
					}),
					h.length > 0 && /* @__PURE__ */ (0, H.jsxs)("section", {
						className: "ai-proposals",
						"aria-label": "Propuestas pendientes",
						children: [
							/* @__PURE__ */ (0, H.jsx)("h3", { children: "Propuestas pendientes" }),
							/* @__PURE__ */ (0, H.jsx)("p", { children: "Revisa el texto exacto antes de aprobar su envío por WhatsApp." }),
							h.map((e) => /* @__PURE__ */ (0, H.jsxs)("article", {
								className: "ai-proposal",
								children: [/* @__PURE__ */ (0, H.jsx)("div", {
									className: "ai-proposal-text",
									children: e.text
								}), /* @__PURE__ */ (0, H.jsxs)("div", {
									className: "ai-proposal-actions",
									children: [/* @__PURE__ */ (0, H.jsx)("button", {
										type: "button",
										disabled: !!_,
										onClick: () => E(e.id, "reject"),
										children: "Descartar"
									}), /* @__PURE__ */ (0, H.jsx)("button", {
										type: "button",
										className: "primary",
										disabled: !!_,
										onClick: () => E(e.id, "approve"),
										children: "Aprobar y enviar"
									})]
								})]
							}, e.id))
						]
					}),
					k && /* @__PURE__ */ (0, H.jsx)("button", {
						id: "ai-use-draft",
						type: "button",
						disabled: !e.chat,
						onClick: () => n(k, e),
						children: "Usar como borrador"
					}),
					/* @__PURE__ */ (0, H.jsxs)("form", {
						className: "ai-composer",
						onSubmit: A,
						children: [
							/* @__PURE__ */ (0, H.jsx)("label", {
								className: "sr-only",
								htmlFor: "ai-prompt",
								children: "Mensaje para Social Media Agent"
							}),
							/* @__PURE__ */ (0, H.jsx)("textarea", {
								id: "ai-prompt",
								ref: w,
								value: d,
								onChange: (e) => f(e.target.value),
								onKeyDown: j,
								placeholder: "Escribe un mensaje",
								rows: "1",
								disabled: !e.chat || s
							}),
							/* @__PURE__ */ (0, H.jsx)("button", {
								id: "ai-send",
								className: "ai-send",
								type: "submit",
								disabled: !e.chat || s || l || !d.trim(),
								"aria-label": "Enviar mensaje",
								children: /* @__PURE__ */ (0, H.jsx)("svg", {
									viewBox: "0 0 24 24",
									focusable: "false",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, H.jsx)("path", { d: Kp })
								})
							})
						]
					})
				]
			})
		})
	});
}
function Yp(e, { request: t, useDraft: n }) {
	let r = (0, Gp.createRoot)(e), i = {
		account: "",
		chat: "",
		version: 0
	}, a = !1, o = {}, s = () => r.render(/* @__PURE__ */ (0, H.jsx)(Jp, {
		ctx: i,
		active: a,
		request: t,
		useDraft: n,
		api: o
	}, `${i.account}:${i.chat}:${i.version}`));
	return s(), {
		select(e) {
			i = e, s();
		},
		setOpen(t) {
			a = t, s(), a && requestAnimationFrame(() => e.querySelector("#ai-prompt")?.focus());
		},
		async proposeDraft(e) {
			let n = String(e || "").trim();
			if (!n) throw Error("No se pudo preparar la propuesta.");
			if (!i.account || !i.chat) throw Error("Selecciona una conversación para pedir una propuesta.");
			if (o.ask) return o.ask(n);
			let r = await t("/api/ai/chat", {
				account: i.account,
				chat: i.chat,
				message: n,
				allowPropose: !1
			});
			return i = {
				...i,
				version: i.version + 1
			}, typeof r.text == "string" ? r.text : "";
		}
	};
}
//#endregion
export { Yp as mountAssistant };
