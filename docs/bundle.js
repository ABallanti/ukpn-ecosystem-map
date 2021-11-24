(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global$y = // eslint-disable-next-line es/no-global-this -- safe
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
	check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
	function () {
	  return this;
	}() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$i = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$h = fails$i; // Detect IE8's incomplete defineProperty implementation

	var descriptors = !fails$h(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var call$b = Function.prototype.call;
	var functionCall = call$b.bind ? call$b.bind(call$b) : function () {
	  return call$b.apply(call$b, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$1(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var createPropertyDescriptor$3 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var FunctionPrototype$3 = Function.prototype;
	var bind$3 = FunctionPrototype$3.bind;
	var call$a = FunctionPrototype$3.call;
	var callBind = bind$3 && bind$3.bind(call$a);
	var functionUncurryThis = bind$3 ? function (fn) {
	  return fn && callBind(call$a, fn);
	} : function (fn) {
	  return fn && function () {
	    return call$a.apply(fn, arguments);
	  };
	};

	var uncurryThis$k = functionUncurryThis;
	var toString$7 = uncurryThis$k({}.toString);
	var stringSlice$3 = uncurryThis$k(''.slice);

	var classofRaw$1 = function (it) {
	  return stringSlice$3(toString$7(it), 8, -1);
	};

	var global$x = global$y;
	var uncurryThis$j = functionUncurryThis;
	var fails$g = fails$i;
	var classof$7 = classofRaw$1;
	var Object$5 = global$x.Object;
	var split = uncurryThis$j(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails$g(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$5('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$7(it) == 'String' ? split(it, '') : Object$5(it);
	} : Object$5;

	var global$w = global$y;
	var TypeError$b = global$w.TypeError; // `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible

	var requireObjectCoercible$4 = function (it) {
	  if (it == undefined) throw TypeError$b("Can't call method on " + it);
	  return it;
	};

	var IndexedObject$2 = indexedObject;
	var requireObjectCoercible$3 = requireObjectCoercible$4;

	var toIndexedObject$5 = function (it) {
	  return IndexedObject$2(requireObjectCoercible$3(it));
	};

	// https://tc39.es/ecma262/#sec-iscallable

	var isCallable$g = function (argument) {
	  return typeof argument == 'function';
	};

	var isCallable$f = isCallable$g;

	var isObject$8 = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$f(it);
	};

	var global$v = global$y;
	var isCallable$e = isCallable$g;

	var aFunction = function (argument) {
	  return isCallable$e(argument) ? argument : undefined;
	};

	var getBuiltIn$6 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$v[namespace]) : global$v[namespace] && global$v[namespace][method];
	};

	var uncurryThis$i = functionUncurryThis;
	var objectIsPrototypeOf = uncurryThis$i({}.isPrototypeOf);

	var getBuiltIn$5 = getBuiltIn$6;
	var engineUserAgent = getBuiltIn$5('navigator', 'userAgent') || '';

	var global$u = global$y;
	var userAgent$2 = engineUserAgent;
	var process = global$u.process;
	var Deno = global$u.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us

	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	} // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0


	if (!version && userAgent$2) {
	  match = userAgent$2.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = userAgent$2.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION$2 = engineV8Version;
	var fails$f = fails$i; // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$f(function () {
	  var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

	  return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	  !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL$1 = nativeSymbol;
	var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

	var global$t = global$y;
	var getBuiltIn$4 = getBuiltIn$6;
	var isCallable$d = isCallable$g;
	var isPrototypeOf$1 = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
	var Object$4 = global$t.Object;
	var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$4('Symbol');
	  return isCallable$d($Symbol) && isPrototypeOf$1($Symbol.prototype, Object$4(it));
	};

	var global$s = global$y;
	var String$3 = global$s.String;

	var tryToString$2 = function (argument) {
	  try {
	    return String$3(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var global$r = global$y;
	var isCallable$c = isCallable$g;
	var tryToString$1 = tryToString$2;
	var TypeError$a = global$r.TypeError; // `Assert: IsCallable(argument) is true`

	var aCallable$9 = function (argument) {
	  if (isCallable$c(argument)) return argument;
	  throw TypeError$a(tryToString$1(argument) + ' is not a function');
	};

	var aCallable$8 = aCallable$9; // `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod

	var getMethod$5 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable$8(func);
	};

	var global$q = global$y;
	var call$9 = functionCall;
	var isCallable$b = isCallable$g;
	var isObject$7 = isObject$8;
	var TypeError$9 = global$q.TypeError; // `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive

	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$b(fn = input.toString) && !isObject$7(val = call$9(fn, input))) return val;
	  if (isCallable$b(fn = input.valueOf) && !isObject$7(val = call$9(fn, input))) return val;
	  if (pref !== 'string' && isCallable$b(fn = input.toString) && !isObject$7(val = call$9(fn, input))) return val;
	  throw TypeError$9("Can't convert object to primitive value");
	};

	var shared$5 = {exports: {}};

	var global$p = global$y; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var defineProperty$1 = Object.defineProperty;

	var setGlobal$3 = function (key, value) {
	  try {
	    defineProperty$1(global$p, key, {
	      value: value,
	      configurable: true,
	      writable: true
	    });
	  } catch (error) {
	    global$p[key] = value;
	  }

	  return value;
	};

	var global$o = global$y;
	var setGlobal$2 = setGlobal$3;
	var SHARED = '__core-js_shared__';
	var store$3 = global$o[SHARED] || setGlobal$2(SHARED, {});
	var sharedStore = store$3;

	var store$2 = sharedStore;
	(shared$5.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.19.1',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});

	var global$n = global$y;
	var requireObjectCoercible$2 = requireObjectCoercible$4;
	var Object$3 = global$n.Object; // `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject

	var toObject$5 = function (argument) {
	  return Object$3(requireObjectCoercible$2(argument));
	};

	var uncurryThis$h = functionUncurryThis;
	var toObject$4 = toObject$5;
	var hasOwnProperty = uncurryThis$h({}.hasOwnProperty); // `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty

	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$4(it), key);
	};

	var uncurryThis$g = functionUncurryThis;
	var id = 0;
	var postfix = Math.random();
	var toString$6 = uncurryThis$g(1.0.toString);

	var uid$2 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$6(++id + postfix, 36);
	};

	var global$m = global$y;
	var shared$4 = shared$5.exports;
	var hasOwn$8 = hasOwnProperty_1;
	var uid$1 = uid$2;
	var NATIVE_SYMBOL = nativeSymbol;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;
	var WellKnownSymbolsStore = shared$4('wks');
	var Symbol$1 = global$m.Symbol;
	var symbolFor = Symbol$1 && Symbol$1['for'];
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

	var wellKnownSymbol$e = function (name) {
	  if (!hasOwn$8(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
	    var description = 'Symbol.' + name;

	    if (NATIVE_SYMBOL && hasOwn$8(Symbol$1, name)) {
	      WellKnownSymbolsStore[name] = Symbol$1[name];
	    } else if (USE_SYMBOL_AS_UID && symbolFor) {
	      WellKnownSymbolsStore[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
	    }
	  }

	  return WellKnownSymbolsStore[name];
	};

	var global$l = global$y;
	var call$8 = functionCall;
	var isObject$6 = isObject$8;
	var isSymbol$1 = isSymbol$2;
	var getMethod$4 = getMethod$5;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$d = wellKnownSymbol$e;
	var TypeError$8 = global$l.TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$d('toPrimitive'); // `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive

	var toPrimitive$1 = function (input, pref) {
	  if (!isObject$6(input) || isSymbol$1(input)) return input;
	  var exoticToPrim = getMethod$4(input, TO_PRIMITIVE);
	  var result;

	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$8(exoticToPrim, input, pref);
	    if (!isObject$6(result) || isSymbol$1(result)) return result;
	    throw TypeError$8("Can't convert object to primitive value");
	  }

	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;
	var isSymbol = isSymbol$2; // `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey

	var toPropertyKey$3 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var global$k = global$y;
	var isObject$5 = isObject$8;
	var document$1 = global$k.document; // typeof document.createElement is 'object' in old IE

	var EXISTS$1 = isObject$5(document$1) && isObject$5(document$1.createElement);

	var documentCreateElement$1 = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$6 = descriptors;
	var fails$e = fails$i;
	var createElement = documentCreateElement$1; // Thank's IE8 for his funny defineProperty

	var ie8DomDefine = !DESCRIPTORS$6 && !fails$e(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var DESCRIPTORS$5 = descriptors;
	var call$7 = functionCall;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var createPropertyDescriptor$2 = createPropertyDescriptor$3;
	var toIndexedObject$4 = toIndexedObject$5;
	var toPropertyKey$2 = toPropertyKey$3;
	var hasOwn$7 = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$5 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$4(O);
	  P = toPropertyKey$2(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (hasOwn$7(O, P)) return createPropertyDescriptor$2(!call$7(propertyIsEnumerableModule.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var global$j = global$y;
	var isObject$4 = isObject$8;
	var String$2 = global$j.String;
	var TypeError$7 = global$j.TypeError; // `Assert: Type(argument) is Object`

	var anObject$g = function (argument) {
	  if (isObject$4(argument)) return argument;
	  throw TypeError$7(String$2(argument) + ' is not an object');
	};

	var global$i = global$y;
	var DESCRIPTORS$4 = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var anObject$f = anObject$g;
	var toPropertyKey$1 = toPropertyKey$3;
	var TypeError$6 = global$i.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var $defineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty

	objectDefineProperty.f = DESCRIPTORS$4 ? $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$f(O);
	  P = toPropertyKey$1(P);
	  anObject$f(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$6('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$3 = descriptors;
	var definePropertyModule$3 = objectDefineProperty;
	var createPropertyDescriptor$1 = createPropertyDescriptor$3;
	var createNonEnumerableProperty$7 = DESCRIPTORS$3 ? function (object, key, value) {
	  return definePropertyModule$3.f(object, key, createPropertyDescriptor$1(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$6 = {exports: {}};

	var uncurryThis$f = functionUncurryThis;
	var isCallable$a = isCallable$g;
	var store$1 = sharedStore;
	var functionToString$1 = uncurryThis$f(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

	if (!isCallable$a(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString$1(it);
	  };
	}

	var inspectSource$3 = store$1.inspectSource;

	var global$h = global$y;
	var isCallable$9 = isCallable$g;
	var inspectSource$2 = inspectSource$3;
	var WeakMap$1 = global$h.WeakMap;
	var nativeWeakMap = isCallable$9(WeakMap$1) && /native code/.test(inspectSource$2(WeakMap$1));

	var shared$3 = shared$5.exports;
	var uid = uid$2;
	var keys = shared$3('keys');

	var sharedKey$3 = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys$4 = {};

	var NATIVE_WEAK_MAP = nativeWeakMap;
	var global$g = global$y;
	var uncurryThis$e = functionUncurryThis;
	var isObject$3 = isObject$8;
	var createNonEnumerableProperty$6 = createNonEnumerableProperty$7;
	var hasOwn$6 = hasOwnProperty_1;
	var shared$2 = sharedStore;
	var sharedKey$2 = sharedKey$3;
	var hiddenKeys$3 = hiddenKeys$4;
	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$5 = global$g.TypeError;
	var WeakMap = global$g.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject$3(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$5('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared$2.state) {
	  var store = shared$2.state || (shared$2.state = new WeakMap());
	  var wmget = uncurryThis$e(store.get);
	  var wmhas = uncurryThis$e(store.has);
	  var wmset = uncurryThis$e(store.set);

	  set = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$5(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget(store, it) || {};
	  };

	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey$2('state');
	  hiddenKeys$3[STATE] = true;

	  set = function (it, metadata) {
	    if (hasOwn$6(it, STATE)) throw new TypeError$5(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$6(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return hasOwn$6(it, STATE) ? it[STATE] : {};
	  };

	  has = function (it) {
	    return hasOwn$6(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var DESCRIPTORS$2 = descriptors;
	var hasOwn$5 = hasOwnProperty_1;
	var FunctionPrototype$2 = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getDescriptor = DESCRIPTORS$2 && Object.getOwnPropertyDescriptor;
	var EXISTS = hasOwn$5(FunctionPrototype$2, 'name'); // additional protection from minified / mangled / dropped function names

	var PROPER = EXISTS && function something() {
	  /* empty */
	}.name === 'something';

	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$2 || DESCRIPTORS$2 && getDescriptor(FunctionPrototype$2, 'name').configurable);
	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var global$f = global$y;
	var isCallable$8 = isCallable$g;
	var hasOwn$4 = hasOwnProperty_1;
	var createNonEnumerableProperty$5 = createNonEnumerableProperty$7;
	var setGlobal$1 = setGlobal$3;
	var inspectSource$1 = inspectSource$3;
	var InternalStateModule$2 = internalState;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var getInternalState$3 = InternalStateModule$2.get;
	var enforceInternalState = InternalStateModule$2.enforce;
	var TEMPLATE = String(String).split('String');
	(redefine$6.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;

	  if (isCallable$8(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }

	    if (!hasOwn$4(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
	      createNonEnumerableProperty$5(value, 'name', name);
	    }

	    state = enforceInternalState(value);

	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }

	  if (O === global$f) {
	    if (simple) O[key] = value;else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty$5(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable$8(this) && getInternalState$3(this).source || inspectSource$1(this);
	});

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor$1 = Math.floor; // `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity

	var toIntegerOrInfinity$3 = function (argument) {
	  var number = +argument; // eslint-disable-next-line no-self-compare -- safe

	  return number !== number || number === 0 ? 0 : (number > 0 ? floor$1 : ceil)(number);
	};

	var toIntegerOrInfinity$2 = toIntegerOrInfinity$3;
	var max = Math.max;
	var min$2 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toIntegerOrInfinity$2(index);
	  return integer < 0 ? max(integer + length, 0) : min$2(integer, length);
	};

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$3;
	var min$1 = Math.min; // `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength

	var toLength$2 = function (argument) {
	  return argument > 0 ? min$1(toIntegerOrInfinity$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength$1 = toLength$2; // `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike

	var lengthOfArrayLike$4 = function (obj) {
	  return toLength$1(obj.length);
	};

	var toIndexedObject$3 = toIndexedObject$5;
	var toAbsoluteIndex = toAbsoluteIndex$1;
	var lengthOfArrayLike$3 = lengthOfArrayLike$4; // `Array.prototype.{ indexOf, includes }` methods implementation

	var createMethod$2 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$3($this);
	    var length = lengthOfArrayLike$3(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare -- NaN check

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$2(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$2(false)
	};

	var uncurryThis$d = functionUncurryThis;
	var hasOwn$3 = hasOwnProperty_1;
	var toIndexedObject$2 = toIndexedObject$5;
	var indexOf$1 = arrayIncludes.indexOf;
	var hiddenKeys$2 = hiddenKeys$4;
	var push$3 = uncurryThis$d([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$2(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !hasOwn$3(hiddenKeys$2, key) && hasOwn$3(O, key) && push$3(result, key); // Don't enum bug & hidden keys


	  while (names.length > i) if (hasOwn$3(O, key = names[i++])) {
	    ~indexOf$1(result, key) || push$3(result, key);
	  }

	  return result;
	};

	var enumBugKeys$3 = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;
	var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe

	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$1);
	};

	var objectGetOwnPropertySymbols = {};

	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$3 = getBuiltIn$6;
	var uncurryThis$c = functionUncurryThis;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var anObject$e = anObject$g;
	var concat = uncurryThis$c([].concat); // all object keys, includes non-enumerable and symbols

	var ownKeys$1 = getBuiltIn$3('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject$e(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$2 = hasOwnProperty_1;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule$2 = objectDefineProperty;

	var copyConstructorProperties$1 = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$2.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn$2(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var fails$d = fails$i;
	var isCallable$7 = isCallable$g;
	var replacement = /#|\.prototype\./;

	var isForced$1 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : isCallable$7(detection) ? fails$d(detection) : !!detection;
	};

	var normalize = isForced$1.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$1.data = {};
	var NATIVE = isForced$1.NATIVE = 'N';
	var POLYFILL = isForced$1.POLYFILL = 'P';
	var isForced_1 = isForced$1;

	var global$e = global$y;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$7;
	var redefine$5 = redefine$6.exports;
	var setGlobal = setGlobal$3;
	var copyConstructorProperties = copyConstructorProperties$1;
	var isForced = isForced_1;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	  options.name        - the .name of the function if it does not match the key
	*/

	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global$e;
	  } else if (STATIC) {
	    target = global$e[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$e[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty$4(sourceProperty, 'sham', true);
	    } // extend global


	    redefine$5(target, key, sourceProperty, options);
	  }
	};

	var fails$c = fails$i;

	var arrayMethodIsStrict$2 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$c(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var $$b = _export;
	var uncurryThis$b = functionUncurryThis;
	var IndexedObject$1 = indexedObject;
	var toIndexedObject$1 = toIndexedObject$5;
	var arrayMethodIsStrict$1 = arrayMethodIsStrict$2;
	var un$Join = uncurryThis$b([].join);
	var ES3_STRINGS = IndexedObject$1 != Object;
	var STRICT_METHOD$1 = arrayMethodIsStrict$1('join', ','); // `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join

	$$b({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || !STRICT_METHOD$1
	}, {
	  join: function join(separator) {
	    return un$Join(toIndexedObject$1(this), separator === undefined ? ',' : separator);
	  }
	});

	var DESCRIPTORS$1 = descriptors;
	var FUNCTION_NAME_EXISTS = functionName.EXISTS;
	var uncurryThis$a = functionUncurryThis;
	var defineProperty = objectDefineProperty.f;
	var FunctionPrototype$1 = Function.prototype;
	var functionToString = uncurryThis$a(FunctionPrototype$1.toString);
	var nameRE = /^\s*function ([^ (]*)/;
	var regExpExec = uncurryThis$a(nameRE.exec);
	var NAME = 'name'; // Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name

	if (DESCRIPTORS$1 && !FUNCTION_NAME_EXISTS) {
	  defineProperty(FunctionPrototype$1, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return regExpExec(nameRE, functionToString(this))[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var classof$6 = classofRaw$1; // `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe

	var isArray$3 = Array.isArray || function isArray(argument) {
	  return classof$6(argument) == 'Array';
	};

	var toPropertyKey = toPropertyKey$3;
	var definePropertyModule$1 = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$3;

	var createProperty$1 = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) definePropertyModule$1.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var wellKnownSymbol$c = wellKnownSymbol$e;
	var TO_STRING_TAG$4 = wellKnownSymbol$c('toStringTag');
	var test$2 = {};
	test$2[TO_STRING_TAG$4] = 'z';
	var toStringTagSupport = String(test$2) === '[object z]';

	var global$d = global$y;
	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
	var isCallable$6 = isCallable$g;
	var classofRaw = classofRaw$1;
	var wellKnownSymbol$b = wellKnownSymbol$e;
	var TO_STRING_TAG$3 = wellKnownSymbol$b('toStringTag');
	var Object$2 = global$d.Object; // ES3 wrong here

	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {
	    /* empty */
	  }
	}; // getting tag from ES6+ `Object.prototype.toString`


	var classof$5 = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$3)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && isCallable$6(O.callee) ? 'Arguments' : result;
	};

	var uncurryThis$9 = functionUncurryThis;
	var fails$b = fails$i;
	var isCallable$5 = isCallable$g;
	var classof$4 = classof$5;
	var getBuiltIn$2 = getBuiltIn$6;
	var inspectSource = inspectSource$3;

	var noop = function () {
	  /* empty */
	};

	var empty = [];
	var construct = getBuiltIn$2('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$2 = uncurryThis$9(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function (argument) {
	  if (!isCallable$5(argument)) return false;

	  try {
	    construct(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function (argument) {
	  if (!isCallable$5(argument)) return false;

	  switch (classof$4(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction':
	      return false;
	    // we can't check .prototype since constructors produced by .bind haven't it
	  }

	  return INCORRECT_TO_STRING || !!exec$2(constructorRegExp, inspectSource(argument));
	}; // `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor


	var isConstructor$2 = !construct || fails$b(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
	    called = true;
	  }) || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var global$c = global$y;
	var isArray$2 = isArray$3;
	var isConstructor$1 = isConstructor$2;
	var isObject$2 = isObject$8;
	var wellKnownSymbol$a = wellKnownSymbol$e;
	var SPECIES$3 = wellKnownSymbol$a('species');
	var Array$1 = global$c.Array; // a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate

	var arraySpeciesConstructor$1 = function (originalArray) {
	  var C;

	  if (isArray$2(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (isConstructor$1(C) && (C === Array$1 || isArray$2(C.prototype))) C = undefined;else if (isObject$2(C)) {
	      C = C[SPECIES$3];
	      if (C === null) C = undefined;
	    }
	  }

	  return C === undefined ? Array$1 : C;
	};

	var arraySpeciesConstructor = arraySpeciesConstructor$1; // `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate$2 = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var fails$a = fails$i;
	var wellKnownSymbol$9 = wellKnownSymbol$e;
	var V8_VERSION$1 = engineV8Version;
	var SPECIES$2 = wellKnownSymbol$9('species');

	var arrayMethodHasSpeciesSupport$3 = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION$1 >= 51 || !fails$a(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$2] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var $$a = _export;
	var global$b = global$y;
	var fails$9 = fails$i;
	var isArray$1 = isArray$3;
	var isObject$1 = isObject$8;
	var toObject$3 = toObject$5;
	var lengthOfArrayLike$2 = lengthOfArrayLike$4;
	var createProperty = createProperty$1;
	var arraySpeciesCreate$1 = arraySpeciesCreate$2;
	var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$3;
	var wellKnownSymbol$8 = wellKnownSymbol$e;
	var V8_VERSION = engineV8Version;
	var IS_CONCAT_SPREADABLE = wellKnownSymbol$8('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
	var TypeError$4 = global$b.TypeError; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails$9(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$2('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject$1(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray$1(O);
	};

	var FORCED$2 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	$$a({
	  target: 'Array',
	  proto: true,
	  forced: FORCED$2
	}, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject$3(this);
	    var A = arraySpeciesCreate$1(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike$2(E);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError$4(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError$4(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var $$9 = _export;
	var uncurryThis$8 = functionUncurryThis;
	var isArray = isArray$3;
	var un$Reverse = uncurryThis$8([].reverse);
	var test$1 = [1, 2]; // `Array.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-array.prototype.reverse
	// fix for Safari 12.0 bug
	// https://bugs.webkit.org/show_bug.cgi?id=188794

	$$9({
	  target: 'Array',
	  proto: true,
	  forced: String(test$1) === String(test$1.reverse())
	}, {
	  reverse: function reverse() {
	    // eslint-disable-next-line no-self-assign -- dirty hack
	    if (isArray(this)) this.length = this.length;
	    return un$Reverse(this);
	  }
	});

	var uncurryThis$7 = functionUncurryThis;
	var aCallable$7 = aCallable$9;
	var bind$2 = uncurryThis$7(uncurryThis$7.bind); // optional / simple context binding

	var functionBindContext = function (fn, that) {
	  aCallable$7(fn);
	  return that === undefined ? fn : bind$2 ? bind$2(fn, that) : function
	    /* ...args */
	  () {
	    return fn.apply(that, arguments);
	  };
	};

	var bind$1 = functionBindContext;
	var uncurryThis$6 = functionUncurryThis;
	var IndexedObject = indexedObject;
	var toObject$2 = toObject$5;
	var lengthOfArrayLike$1 = lengthOfArrayLike$4;
	var arraySpeciesCreate = arraySpeciesCreate$2;
	var push$2 = uncurryThis$6([].push); // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation

	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject$2($this);
	    var self = IndexedObject(O);
	    var boundFunction = bind$1(callbackfn, that);
	    var length = lengthOfArrayLike$1(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;

	    for (; length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);

	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3:
	            return true;
	          // some

	          case 5:
	            return value;
	          // find

	          case 6:
	            return index;
	          // findIndex

	          case 2:
	            push$2(target, value);
	          // filter
	        } else switch (TYPE) {
	          case 4:
	            return false;
	          // every

	          case 7:
	            push$2(target, value);
	          // filterReject
	        }
	      }
	    }

	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$1(7)
	};

	var $$8 = _export;
	var $map = arrayIteration.map;
	var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$3;
	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('map'); // `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species

	$$8({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT$1
	}, {
	  map: function map(callbackfn
	  /* , thisArg */
	  ) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var FunctionPrototype = Function.prototype;
	var apply$5 = FunctionPrototype.apply;
	var bind = FunctionPrototype.bind;
	var call$6 = FunctionPrototype.call; // eslint-disable-next-line es/no-reflect -- safe

	var functionApply = typeof Reflect == 'object' && Reflect.apply || (bind ? call$6.bind(apply$5) : function () {
	  return call$6.apply(apply$5, arguments);
	});

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3; // `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe

	var objectKeys$1 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS = descriptors;
	var definePropertyModule = objectDefineProperty;
	var anObject$d = anObject$g;
	var toIndexedObject = toIndexedObject$5;
	var objectKeys = objectKeys$1; // `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe

	var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$d(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);

	  return O;
	};

	var getBuiltIn$1 = getBuiltIn$6;
	var html$1 = getBuiltIn$1('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */
	var anObject$c = anObject$g;
	var defineProperties = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys = hiddenKeys$4;
	var html = html$1;
	var documentCreateElement = documentCreateElement$1;
	var sharedKey$1 = sharedKey$3;
	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey$1('IE_PROTO');

	var EmptyConstructor = function () {
	  /* empty */
	};

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak

	  return temp;
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	}; // Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug


	var activeXDocument;

	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) {
	    /* ignore */
	  }

	  NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	  : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH

	  var length = enumBugKeys.length;

	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO$1] = true; // `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject$c(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : defineProperties(result, Properties);
	};

	var redefine$4 = redefine$6.exports;

	var redefineAll$2 = function (target, src, options) {
	  for (var key in src) redefine$4(target, key, src[key], options);

	  return target;
	};

	var fails$8 = fails$i;
	var correctPrototypeGetter = !fails$8(function () {
	  function F() {
	    /* empty */
	  }

	  F.prototype.constructor = null; // eslint-disable-next-line es/no-object-getprototypeof -- required for testing

	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var global$a = global$y;
	var hasOwn$1 = hasOwnProperty_1;
	var isCallable$4 = isCallable$g;
	var toObject$1 = toObject$5;
	var sharedKey = sharedKey$3;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;
	var IE_PROTO = sharedKey('IE_PROTO');
	var Object$1 = global$a.Object;
	var ObjectPrototype = Object$1.prototype; // `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof

	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object$1.getPrototypeOf : function (O) {
	  var object = toObject$1(O);
	  if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;

	  if (isCallable$4(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  }

	  return object instanceof Object$1 ? ObjectPrototype : null;
	};

	var global$9 = global$y;
	var shared$1 = sharedStore;
	var isCallable$3 = isCallable$g;
	var getPrototypeOf$1 = objectGetPrototypeOf;
	var redefine$3 = redefine$6.exports;
	var wellKnownSymbol$7 = wellKnownSymbol$e;
	var USE_FUNCTION_CONSTRUCTOR = 'USE_FUNCTION_CONSTRUCTOR';
	var ASYNC_ITERATOR = wellKnownSymbol$7('asyncIterator');
	var AsyncIterator = global$9.AsyncIterator;
	var PassedAsyncIteratorPrototype = shared$1.AsyncIteratorPrototype;
	var AsyncIteratorPrototype$1, prototype;

	if (PassedAsyncIteratorPrototype) {
	  AsyncIteratorPrototype$1 = PassedAsyncIteratorPrototype;
	} else if (isCallable$3(AsyncIterator)) {
	  AsyncIteratorPrototype$1 = AsyncIterator.prototype;
	} else if (shared$1[USE_FUNCTION_CONSTRUCTOR] || global$9[USE_FUNCTION_CONSTRUCTOR]) {
	  try {
	    // eslint-disable-next-line no-new-func -- we have no alternatives without usage of modern syntax
	    prototype = getPrototypeOf$1(getPrototypeOf$1(getPrototypeOf$1(Function('return async function*(){}()')())));
	    if (getPrototypeOf$1(prototype) === Object.prototype) AsyncIteratorPrototype$1 = prototype;
	  } catch (error) {
	    /* empty */
	  }
	}

	if (!AsyncIteratorPrototype$1) AsyncIteratorPrototype$1 = {};

	if (!isCallable$3(AsyncIteratorPrototype$1[ASYNC_ITERATOR])) {
	  redefine$3(AsyncIteratorPrototype$1, ASYNC_ITERATOR, function () {
	    return this;
	  });
	}

	var asyncIteratorPrototype = AsyncIteratorPrototype$1;

	var call$5 = functionCall;
	var aCallable$6 = aCallable$9;
	var anObject$b = anObject$g;
	var create$2 = objectCreate;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$7;
	var redefineAll$1 = redefineAll$2;
	var wellKnownSymbol$6 = wellKnownSymbol$e;
	var InternalStateModule$1 = internalState;
	var getBuiltIn = getBuiltIn$6;
	var getMethod$3 = getMethod$5;
	var AsyncIteratorPrototype = asyncIteratorPrototype;
	var Promise$1 = getBuiltIn('Promise');
	var setInternalState$1 = InternalStateModule$1.set;
	var getInternalState$2 = InternalStateModule$1.get;
	var TO_STRING_TAG$2 = wellKnownSymbol$6('toStringTag');

	var asyncIteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var AsyncIteratorProxy = function AsyncIterator(state) {
	    state.next = aCallable$6(state.iterator.next);
	    state.done = false;
	    state.ignoreArgument = !IS_ITERATOR;
	    setInternalState$1(this, state);
	  };

	  AsyncIteratorProxy.prototype = redefineAll$1(create$2(AsyncIteratorPrototype), {
	    next: function next(arg) {
	      var that = this;
	      var hasArgument = !!arguments.length;
	      return new Promise$1(function (resolve) {
	        var state = getInternalState$2(that);
	        var args = hasArgument ? [state.ignoreArgument ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
	        state.ignoreArgument = false;
	        resolve(state.done ? {
	          done: true,
	          value: undefined
	        } : anObject$b(call$5(nextHandler, state, Promise$1, args)));
	      });
	    },
	    'return': function (value) {
	      var that = this;
	      return new Promise$1(function (resolve, reject) {
	        var state = getInternalState$2(that);
	        var iterator = state.iterator;
	        state.done = true;
	        var $$return = getMethod$3(iterator, 'return');
	        if ($$return === undefined) return resolve({
	          done: true,
	          value: value
	        });
	        Promise$1.resolve(call$5($$return, iterator, value)).then(function (result) {
	          anObject$b(result);
	          resolve({
	            done: true,
	            value: value
	          });
	        }, reject);
	      });
	    },
	    'throw': function (value) {
	      var that = this;
	      return new Promise$1(function (resolve, reject) {
	        var state = getInternalState$2(that);
	        var iterator = state.iterator;
	        state.done = true;
	        var $$throw = getMethod$3(iterator, 'throw');
	        if ($$throw === undefined) return reject(value);
	        resolve(call$5($$throw, iterator, value));
	      });
	    }
	  });

	  if (!IS_ITERATOR) {
	    createNonEnumerableProperty$3(AsyncIteratorProxy.prototype, TO_STRING_TAG$2, 'Generator');
	  }

	  return AsyncIteratorProxy;
	};

	var $$7 = _export;
	var apply$4 = functionApply;
	var aCallable$5 = aCallable$9;
	var anObject$a = anObject$g;
	var createAsyncIteratorProxy$1 = asyncIteratorCreateProxy;
	var AsyncIteratorProxy$1 = createAsyncIteratorProxy$1(function (Promise, args) {
	  var state = this;
	  var mapper = state.mapper;
	  return Promise.resolve(anObject$a(apply$4(state.next, state.iterator, args))).then(function (step) {
	    if (anObject$a(step).done) {
	      state.done = true;
	      return {
	        done: true,
	        value: undefined
	      };
	    }

	    return Promise.resolve(mapper(step.value)).then(function (value) {
	      return {
	        done: false,
	        value: value
	      };
	    });
	  });
	});
	$$7({
	  target: 'AsyncIterator',
	  proto: true,
	  real: true
	}, {
	  map: function map(mapper) {
	    return new AsyncIteratorProxy$1({
	      iterator: anObject$a(this),
	      mapper: aCallable$5(mapper)
	    });
	  }
	});

	var fails$7 = fails$i;
	var isCallable$2 = isCallable$g;
	var getPrototypeOf = objectGetPrototypeOf;
	var redefine$2 = redefine$6.exports;
	var wellKnownSymbol$5 = wellKnownSymbol$e;
	var ITERATOR = wellKnownSymbol$5('iterator');
	var BUGGY_SAFARI_ITERATORS = false; // `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object

	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;
	/* eslint-disable es/no-array-prototype-keys -- safe */

	if ([].keys) {
	  arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$7(function () {
	  var test = {}; // FF44- legacy iterators case

	  return IteratorPrototype$2[ITERATOR].call(test) !== test;
	});
	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {}; // `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator

	if (!isCallable$2(IteratorPrototype$2[ITERATOR])) {
	  redefine$2(IteratorPrototype$2, ITERATOR, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var call$4 = functionCall;
	var aCallable$4 = aCallable$9;
	var anObject$9 = anObject$g;
	var create$1 = objectCreate;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$7;
	var redefineAll = redefineAll$2;
	var wellKnownSymbol$4 = wellKnownSymbol$e;
	var InternalStateModule = internalState;
	var getMethod$2 = getMethod$5;
	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
	var setInternalState = InternalStateModule.set;
	var getInternalState$1 = InternalStateModule.get;
	var TO_STRING_TAG$1 = wellKnownSymbol$4('toStringTag');

	var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var IteratorProxy = function Iterator(state) {
	    state.next = aCallable$4(state.iterator.next);
	    state.done = false;
	    state.ignoreArg = !IS_ITERATOR;
	    setInternalState(this, state);
	  };

	  IteratorProxy.prototype = redefineAll(create$1(IteratorPrototype$1), {
	    next: function next(arg) {
	      var state = getInternalState$1(this);
	      var args = arguments.length ? [state.ignoreArg ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
	      state.ignoreArg = false;
	      var result = state.done ? undefined : call$4(nextHandler, state, args);
	      return {
	        done: state.done,
	        value: result
	      };
	    },
	    'return': function (value) {
	      var state = getInternalState$1(this);
	      var iterator = state.iterator;
	      state.done = true;
	      var $$return = getMethod$2(iterator, 'return');
	      return {
	        done: true,
	        value: $$return ? anObject$9(call$4($$return, iterator, value)).value : value
	      };
	    },
	    'throw': function (value) {
	      var state = getInternalState$1(this);
	      var iterator = state.iterator;
	      state.done = true;
	      var $$throw = getMethod$2(iterator, 'throw');
	      if ($$throw) return call$4($$throw, iterator, value);
	      throw value;
	    }
	  });

	  if (!IS_ITERATOR) {
	    createNonEnumerableProperty$2(IteratorProxy.prototype, TO_STRING_TAG$1, 'Generator');
	  }

	  return IteratorProxy;
	};

	var call$3 = functionCall;
	var anObject$8 = anObject$g;
	var getMethod$1 = getMethod$5;

	var iteratorClose$1 = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$8(iterator);

	  try {
	    innerResult = getMethod$1(iterator, 'return');

	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }

	    innerResult = call$3(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }

	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$8(innerResult);
	  return value;
	};

	var anObject$7 = anObject$g;
	var iteratorClose = iteratorClose$1; // call something on iterator step with safe closing on error

	var callWithSafeIterationClosing$2 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$7(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var $$6 = _export;
	var apply$3 = functionApply;
	var aCallable$3 = aCallable$9;
	var anObject$6 = anObject$g;
	var createIteratorProxy$1 = iteratorCreateProxy;
	var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$2;
	var IteratorProxy$1 = createIteratorProxy$1(function (args) {
	  var iterator = this.iterator;
	  var result = anObject$6(apply$3(this.next, iterator, args));
	  var done = this.done = !!result.done;
	  if (!done) return callWithSafeIterationClosing$1(iterator, this.mapper, result.value);
	});
	$$6({
	  target: 'Iterator',
	  proto: true,
	  real: true
	}, {
	  map: function map(mapper) {
	    return new IteratorProxy$1({
	      iterator: anObject$6(this),
	      mapper: aCallable$3(mapper)
	    });
	  }
	});

	// https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
	var forceTree = function forceTree(ecosystem, element) {
	  var width = 200;
	  var height = width;
	  var links = ecosystem.links();
	  var nodes = ecosystem.descendants();
	  var simulation = d3.forceSimulation(nodes).force('link', d3.forceLink(links).id(function (d) {
	    return d.id;
	  }).distance(0).strength(1)).force('charge', d3.forceManyBody().strength(-50)).force('x', d3.forceX()).force('y', d3.forceY());
	  var svg = element.append('svg').attr('viewBox', [-width / 2, -height / 2, width, height]);
	  var link = svg.append('g').attr('stroke', '#999').attr('stroke-opacity', 0.6).selectAll('line').data(links).join('line');

	  var drag = function drag(simulation) {
	    function dragstarted(event, d) {
	      if (!event.active) simulation.alphaTarget(0.3).restart();
	      d.fx = d.x;
	      d.fy = d.y;
	    }

	    function dragged(event, d) {
	      d.fx = event.x;
	      d.fy = event.y;
	    }

	    function dragended(event, d) {
	      if (!event.active) simulation.alphaTarget(0);
	      d.fx = null;
	      d.fy = null;
	    }

	    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
	  };

	  var tooltip = element.append('div').attr('class', 'tooltip hide');

	  var mouseover = function mouseover(evt, entity) {
	    var _entity$data = entity.data,
	        node = _entity$data.node,
	        name = _entity$data.name,
	        type = _entity$data.type;
	    var content = "<h1>".concat(name || node, " (").concat(type, ")</h1>");
	    tooltip.classed('hide', false);
	    tooltip.html(content);
	  };

	  var mouseout = function mouseout(evt, node) {
	    tooltip.classed('hide', true);
	    tooltip.html('');
	  };

	  var node = svg.append('g').selectAll('circle').data(nodes).join('circle').attr('class', function (d) {
	    return d.data.type;
	  }).attr('r', 3.5).call(drag(simulation)).on('mouseover', mouseover).on('mouseout', mouseout);
	  node.append('title').text(function (d) {
	    return "".concat(d.ancestors().map(function (d) {
	      return d.data.node;
	    }).reverse().join('/'));
	  });
	  simulation.on('tick', function () {
	    link.attr('x1', function (d) {
	      return d.source.x;
	    }).attr('y1', function (d) {
	      return d.source.y;
	    }).attr('x2', function (d) {
	      return d.target.x;
	    }).attr('y2', function (d) {
	      return d.target.y;
	    });
	    node.attr('cx', function (d) {
	      return d.x;
	    }).attr('cy', function (d) {
	      return d.y;
	    });
	  }); // WAT DIS? invalidation.then(() => simulation.stop());

	  return svg.node();
	};

	var runtime = {exports: {}};

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function (module) {
	  var runtime = function (exports) {

	    var Op = Object.prototype;
	    var hasOwn = Op.hasOwnProperty;
	    var undefined$1; // More compressible than void 0.

	    var $Symbol = typeof Symbol === "function" ? Symbol : {};
	    var iteratorSymbol = $Symbol.iterator || "@@iterator";
	    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	    function define(obj, key, value) {
	      Object.defineProperty(obj, key, {
	        value: value,
	        enumerable: true,
	        configurable: true,
	        writable: true
	      });
	      return obj[key];
	    }

	    try {
	      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	      define({}, "");
	    } catch (err) {
	      define = function (obj, key, value) {
	        return obj[key] = value;
	      };
	    }

	    function wrap(innerFn, outerFn, self, tryLocsList) {
	      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	      var generator = Object.create(protoGenerator.prototype);
	      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
	      // .throw, and .return methods.

	      generator._invoke = makeInvokeMethod(innerFn, self, context);
	      return generator;
	    }

	    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
	    // record like context.tryEntries[i].completion. This interface could
	    // have been (and was previously) designed to take a closure to be
	    // invoked without arguments, but in all the cases we care about we
	    // already have an existing method we want to call, so there's no need
	    // to create a new function object. We can even get away with assuming
	    // the method takes exactly one argument, since that happens to be true
	    // in every case, so we don't have to touch the arguments object. The
	    // only additional allocation required is the completion record, which
	    // has a stable shape and so hopefully should be cheap to allocate.

	    function tryCatch(fn, obj, arg) {
	      try {
	        return {
	          type: "normal",
	          arg: fn.call(obj, arg)
	        };
	      } catch (err) {
	        return {
	          type: "throw",
	          arg: err
	        };
	      }
	    }

	    var GenStateSuspendedStart = "suspendedStart";
	    var GenStateSuspendedYield = "suspendedYield";
	    var GenStateExecuting = "executing";
	    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
	    // breaking out of the dispatch switch statement.

	    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
	    // .constructor.prototype properties for functions that return Generator
	    // objects. For full spec compliance, you may wish to configure your
	    // minifier not to mangle the names of these two functions.

	    function Generator() {}

	    function GeneratorFunction() {}

	    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
	    // don't natively support it.


	    var IteratorPrototype = {};
	    define(IteratorPrototype, iteratorSymbol, function () {
	      return this;
	    });
	    var getProto = Object.getPrototypeOf;
	    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

	    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	      // This environment has a native %IteratorPrototype%; use it instead
	      // of the polyfill.
	      IteratorPrototype = NativeIteratorPrototype;
	    }

	    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
	    GeneratorFunction.prototype = GeneratorFunctionPrototype;
	    define(Gp, "constructor", GeneratorFunctionPrototype);
	    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
	    GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
	    // Iterator interface in terms of a single ._invoke method.

	    function defineIteratorMethods(prototype) {
	      ["next", "throw", "return"].forEach(function (method) {
	        define(prototype, method, function (arg) {
	          return this._invoke(method, arg);
	        });
	      });
	    }

	    exports.isGeneratorFunction = function (genFun) {
	      var ctor = typeof genFun === "function" && genFun.constructor;
	      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
	      // do is to check its .name property.
	      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	    };

	    exports.mark = function (genFun) {
	      if (Object.setPrototypeOf) {
	        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	      } else {
	        genFun.__proto__ = GeneratorFunctionPrototype;
	        define(genFun, toStringTagSymbol, "GeneratorFunction");
	      }

	      genFun.prototype = Object.create(Gp);
	      return genFun;
	    }; // Within the body of any async function, `await x` is transformed to
	    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	    // `hasOwn.call(value, "__await")` to determine if the yielded value is
	    // meant to be awaited.


	    exports.awrap = function (arg) {
	      return {
	        __await: arg
	      };
	    };

	    function AsyncIterator(generator, PromiseImpl) {
	      function invoke(method, arg, resolve, reject) {
	        var record = tryCatch(generator[method], generator, arg);

	        if (record.type === "throw") {
	          reject(record.arg);
	        } else {
	          var result = record.arg;
	          var value = result.value;

	          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
	            return PromiseImpl.resolve(value.__await).then(function (value) {
	              invoke("next", value, resolve, reject);
	            }, function (err) {
	              invoke("throw", err, resolve, reject);
	            });
	          }

	          return PromiseImpl.resolve(value).then(function (unwrapped) {
	            // When a yielded Promise is resolved, its final value becomes
	            // the .value of the Promise<{value,done}> result for the
	            // current iteration.
	            result.value = unwrapped;
	            resolve(result);
	          }, function (error) {
	            // If a rejected Promise was yielded, throw the rejection back
	            // into the async generator function so it can be handled there.
	            return invoke("throw", error, resolve, reject);
	          });
	        }
	      }

	      var previousPromise;

	      function enqueue(method, arg) {
	        function callInvokeWithMethodAndArg() {
	          return new PromiseImpl(function (resolve, reject) {
	            invoke(method, arg, resolve, reject);
	          });
	        }

	        return previousPromise = // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
	        // invocations of the iterator.
	        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
	      } // Define the unified helper method that is used to implement .next,
	      // .throw, and .return (see defineIteratorMethods).


	      this._invoke = enqueue;
	    }

	    defineIteratorMethods(AsyncIterator.prototype);
	    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
	      return this;
	    });
	    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
	    // AsyncIterator objects; they just return a Promise for the value of
	    // the final result produced by the iterator.

	    exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	      if (PromiseImpl === void 0) PromiseImpl = Promise;
	      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
	      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function (result) {
	        return result.done ? result.value : iter.next();
	      });
	    };

	    function makeInvokeMethod(innerFn, self, context) {
	      var state = GenStateSuspendedStart;
	      return function invoke(method, arg) {
	        if (state === GenStateExecuting) {
	          throw new Error("Generator is already running");
	        }

	        if (state === GenStateCompleted) {
	          if (method === "throw") {
	            throw arg;
	          } // Be forgiving, per 25.3.3.3.3 of the spec:
	          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


	          return doneResult();
	        }

	        context.method = method;
	        context.arg = arg;

	        while (true) {
	          var delegate = context.delegate;

	          if (delegate) {
	            var delegateResult = maybeInvokeDelegate(delegate, context);

	            if (delegateResult) {
	              if (delegateResult === ContinueSentinel) continue;
	              return delegateResult;
	            }
	          }

	          if (context.method === "next") {
	            // Setting context._sent for legacy support of Babel's
	            // function.sent implementation.
	            context.sent = context._sent = context.arg;
	          } else if (context.method === "throw") {
	            if (state === GenStateSuspendedStart) {
	              state = GenStateCompleted;
	              throw context.arg;
	            }

	            context.dispatchException(context.arg);
	          } else if (context.method === "return") {
	            context.abrupt("return", context.arg);
	          }

	          state = GenStateExecuting;
	          var record = tryCatch(innerFn, self, context);

	          if (record.type === "normal") {
	            // If an exception is thrown from innerFn, we leave state ===
	            // GenStateExecuting and loop back for another invocation.
	            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	            if (record.arg === ContinueSentinel) {
	              continue;
	            }

	            return {
	              value: record.arg,
	              done: context.done
	            };
	          } else if (record.type === "throw") {
	            state = GenStateCompleted; // Dispatch the exception by looping back around to the
	            // context.dispatchException(context.arg) call above.

	            context.method = "throw";
	            context.arg = record.arg;
	          }
	        }
	      };
	    } // Call delegate.iterator[context.method](context.arg) and handle the
	    // result, either by returning a { value, done } result from the
	    // delegate iterator, or by modifying context.method and context.arg,
	    // setting context.delegate to null, and returning the ContinueSentinel.


	    function maybeInvokeDelegate(delegate, context) {
	      var method = delegate.iterator[context.method];

	      if (method === undefined$1) {
	        // A .throw or .return when the delegate iterator has no .throw
	        // method always terminates the yield* loop.
	        context.delegate = null;

	        if (context.method === "throw") {
	          // Note: ["return"] must be used for ES3 parsing compatibility.
	          if (delegate.iterator["return"]) {
	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            context.method = "return";
	            context.arg = undefined$1;
	            maybeInvokeDelegate(delegate, context);

	            if (context.method === "throw") {
	              // If maybeInvokeDelegate(context) changed context.method from
	              // "return" to "throw", let that override the TypeError below.
	              return ContinueSentinel;
	            }
	          }

	          context.method = "throw";
	          context.arg = new TypeError("The iterator does not provide a 'throw' method");
	        }

	        return ContinueSentinel;
	      }

	      var record = tryCatch(method, delegate.iterator, context.arg);

	      if (record.type === "throw") {
	        context.method = "throw";
	        context.arg = record.arg;
	        context.delegate = null;
	        return ContinueSentinel;
	      }

	      var info = record.arg;

	      if (!info) {
	        context.method = "throw";
	        context.arg = new TypeError("iterator result is not an object");
	        context.delegate = null;
	        return ContinueSentinel;
	      }

	      if (info.done) {
	        // Assign the result of the finished delegate to the temporary
	        // variable specified by delegate.resultName (see delegateYield).
	        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

	        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
	        // exception, let the outer generator proceed normally. If
	        // context.method was "next", forget context.arg since it has been
	        // "consumed" by the delegate iterator. If context.method was
	        // "return", allow the original .return call to continue in the
	        // outer generator.

	        if (context.method !== "return") {
	          context.method = "next";
	          context.arg = undefined$1;
	        }
	      } else {
	        // Re-yield the result returned by the delegate method.
	        return info;
	      } // The delegate iterator is finished, so forget it and continue with
	      // the outer generator.


	      context.delegate = null;
	      return ContinueSentinel;
	    } // Define Generator.prototype.{next,throw,return} in terms of the
	    // unified ._invoke helper method.


	    defineIteratorMethods(Gp);
	    define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
	    // @@iterator function is called on it. Some browsers' implementations of the
	    // iterator prototype chain incorrectly implement this, causing the Generator
	    // object to not be returned from this call. This ensures that doesn't happen.
	    // See https://github.com/facebook/regenerator/issues/274 for more details.

	    define(Gp, iteratorSymbol, function () {
	      return this;
	    });
	    define(Gp, "toString", function () {
	      return "[object Generator]";
	    });

	    function pushTryEntry(locs) {
	      var entry = {
	        tryLoc: locs[0]
	      };

	      if (1 in locs) {
	        entry.catchLoc = locs[1];
	      }

	      if (2 in locs) {
	        entry.finallyLoc = locs[2];
	        entry.afterLoc = locs[3];
	      }

	      this.tryEntries.push(entry);
	    }

	    function resetTryEntry(entry) {
	      var record = entry.completion || {};
	      record.type = "normal";
	      delete record.arg;
	      entry.completion = record;
	    }

	    function Context(tryLocsList) {
	      // The root entry object (effectively a try statement without a catch
	      // or a finally block) gives us a place to store values thrown from
	      // locations where there is no enclosing try statement.
	      this.tryEntries = [{
	        tryLoc: "root"
	      }];
	      tryLocsList.forEach(pushTryEntry, this);
	      this.reset(true);
	    }

	    exports.keys = function (object) {
	      var keys = [];

	      for (var key in object) {
	        keys.push(key);
	      }

	      keys.reverse(); // Rather than returning an object with a next method, we keep
	      // things simple and return the next function itself.

	      return function next() {
	        while (keys.length) {
	          var key = keys.pop();

	          if (key in object) {
	            next.value = key;
	            next.done = false;
	            return next;
	          }
	        } // To avoid creating an additional object, we just hang the .value
	        // and .done properties off the next function object itself. This
	        // also ensures that the minifier will not anonymize the function.


	        next.done = true;
	        return next;
	      };
	    };

	    function values(iterable) {
	      if (iterable) {
	        var iteratorMethod = iterable[iteratorSymbol];

	        if (iteratorMethod) {
	          return iteratorMethod.call(iterable);
	        }

	        if (typeof iterable.next === "function") {
	          return iterable;
	        }

	        if (!isNaN(iterable.length)) {
	          var i = -1,
	              next = function next() {
	            while (++i < iterable.length) {
	              if (hasOwn.call(iterable, i)) {
	                next.value = iterable[i];
	                next.done = false;
	                return next;
	              }
	            }

	            next.value = undefined$1;
	            next.done = true;
	            return next;
	          };

	          return next.next = next;
	        }
	      } // Return an iterator with no values.


	      return {
	        next: doneResult
	      };
	    }

	    exports.values = values;

	    function doneResult() {
	      return {
	        value: undefined$1,
	        done: true
	      };
	    }

	    Context.prototype = {
	      constructor: Context,
	      reset: function (skipTempReset) {
	        this.prev = 0;
	        this.next = 0; // Resetting context._sent for legacy support of Babel's
	        // function.sent implementation.

	        this.sent = this._sent = undefined$1;
	        this.done = false;
	        this.delegate = null;
	        this.method = "next";
	        this.arg = undefined$1;
	        this.tryEntries.forEach(resetTryEntry);

	        if (!skipTempReset) {
	          for (var name in this) {
	            // Not sure about the optimal order of these conditions:
	            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	              this[name] = undefined$1;
	            }
	          }
	        }
	      },
	      stop: function () {
	        this.done = true;
	        var rootEntry = this.tryEntries[0];
	        var rootRecord = rootEntry.completion;

	        if (rootRecord.type === "throw") {
	          throw rootRecord.arg;
	        }

	        return this.rval;
	      },
	      dispatchException: function (exception) {
	        if (this.done) {
	          throw exception;
	        }

	        var context = this;

	        function handle(loc, caught) {
	          record.type = "throw";
	          record.arg = exception;
	          context.next = loc;

	          if (caught) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            context.method = "next";
	            context.arg = undefined$1;
	          }

	          return !!caught;
	        }

	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];
	          var record = entry.completion;

	          if (entry.tryLoc === "root") {
	            // Exception thrown outside of any try block that could handle
	            // it, so set the completion value of the entire function to
	            // throw the exception.
	            return handle("end");
	          }

	          if (entry.tryLoc <= this.prev) {
	            var hasCatch = hasOwn.call(entry, "catchLoc");
	            var hasFinally = hasOwn.call(entry, "finallyLoc");

	            if (hasCatch && hasFinally) {
	              if (this.prev < entry.catchLoc) {
	                return handle(entry.catchLoc, true);
	              } else if (this.prev < entry.finallyLoc) {
	                return handle(entry.finallyLoc);
	              }
	            } else if (hasCatch) {
	              if (this.prev < entry.catchLoc) {
	                return handle(entry.catchLoc, true);
	              }
	            } else if (hasFinally) {
	              if (this.prev < entry.finallyLoc) {
	                return handle(entry.finallyLoc);
	              }
	            } else {
	              throw new Error("try statement without catch or finally");
	            }
	          }
	        }
	      },
	      abrupt: function (type, arg) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	            var finallyEntry = entry;
	            break;
	          }
	        }

	        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
	          // Ignore the finally entry if control is not jumping to a
	          // location outside the try/catch block.
	          finallyEntry = null;
	        }

	        var record = finallyEntry ? finallyEntry.completion : {};
	        record.type = type;
	        record.arg = arg;

	        if (finallyEntry) {
	          this.method = "next";
	          this.next = finallyEntry.finallyLoc;
	          return ContinueSentinel;
	        }

	        return this.complete(record);
	      },
	      complete: function (record, afterLoc) {
	        if (record.type === "throw") {
	          throw record.arg;
	        }

	        if (record.type === "break" || record.type === "continue") {
	          this.next = record.arg;
	        } else if (record.type === "return") {
	          this.rval = this.arg = record.arg;
	          this.method = "return";
	          this.next = "end";
	        } else if (record.type === "normal" && afterLoc) {
	          this.next = afterLoc;
	        }

	        return ContinueSentinel;
	      },
	      finish: function (finallyLoc) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.finallyLoc === finallyLoc) {
	            this.complete(entry.completion, entry.afterLoc);
	            resetTryEntry(entry);
	            return ContinueSentinel;
	          }
	        }
	      },
	      "catch": function (tryLoc) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.tryLoc === tryLoc) {
	            var record = entry.completion;

	            if (record.type === "throw") {
	              var thrown = record.arg;
	              resetTryEntry(entry);
	            }

	            return thrown;
	          }
	        } // The context.catch method must only be called with a location
	        // argument that corresponds to a known catch block.


	        throw new Error("illegal catch attempt");
	      },
	      delegateYield: function (iterable, resultName, nextLoc) {
	        this.delegate = {
	          iterator: values(iterable),
	          resultName: resultName,
	          nextLoc: nextLoc
	        };

	        if (this.method === "next") {
	          // Deliberately forget the last sent value so that we don't
	          // accidentally pass it on to the delegate.
	          this.arg = undefined$1;
	        }

	        return ContinueSentinel;
	      }
	    }; // Regardless of whether this script is executing as a CommonJS module
	    // or not, return the runtime object so that we can declare the variable
	    // regeneratorRuntime in the outer scope, which allows this module to be
	    // injected easily by `bin/regenerator --include-runtime script.js`.

	    return exports;
	  }( // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	  module.exports );

	  try {
	    regeneratorRuntime = runtime;
	  } catch (accidentalStrictMode) {
	    // This module should not be running in strict mode, so the above
	    // assignment should always work unless something is misconfigured. Just
	    // in case runtime.js accidentally runs in strict mode, in modern engines
	    // we can explicitly access globalThis. In older engines we can escape
	    // strict mode using a global Function call. This could conceivably fail
	    // if a Content Security Policy forbids using Function, but in that case
	    // the proper solution is to fix the accidental strict mode problem. If
	    // you've misconfigured your bundler to force strict mode and applied a
	    // CSP to forbid Function, and you're not willing to fix either of those
	    // problems, please detail your unique predicament in a GitHub issue.
	    if (typeof globalThis === "object") {
	      globalThis.regeneratorRuntime = runtime;
	    } else {
	      Function("r", "regeneratorRuntime = r")(runtime);
	    }
	  }
	})(runtime);

	var sid = function () {
	  var _marked = /*#__PURE__*/regeneratorRuntime.mark(sequence);

	  var sequences = {};

	  function sequence(ref) {
	    var i;
	    return regeneratorRuntime.wrap(function sequence$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            i = 0;

	          case 1:

	            _context.next = 4;
	            return "".concat(ref, "-").concat(i);

	          case 4:
	            i++;
	            _context.next = 1;
	            break;

	          case 7:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _marked);
	  }

	  return function (id) {
	    if (!sequences[id]) sequences[id] = sequence(id);
	    return sequences[id].next().value;
	  };
	}();
	function autoBox() {
	  var _this$getBBox = this.getBBox(),
	      x = _this$getBBox.x,
	      y = _this$getBBox.y,
	      width = _this$getBBox.width,
	      height = _this$getBBox.height;

	  return [x, y, width, height];
	}

	var radialTree = function radialTree(ecosystem, element) {
	  var width = 800;
	  var radius = width / 2;
	  var svg = element.append("svg");
	  var tree = d3.tree().size([2 * Math.PI, radius]).separation(function (a, b) {
	    return (a.parent == b.parent ? 1 : 2) / a.depth;
	  });
	  var root = tree(ecosystem);
	  svg.append("g").attr("fill", "none").attr("stroke", "#555").attr("stroke-opacity", 0.4).attr("stroke-width", 1.5).selectAll("path").data(root.links()).join("path").attr("d", d3.linkRadial().angle(function (d) {
	    return d.x;
	  }).radius(function (d) {
	    return d.y;
	  }));
	  svg.append("g").selectAll("circle").data(root.descendants()).join("circle").attr("transform", function (d) {
	    return "\n      rotate(".concat(d.x * 180 / Math.PI - 90, ")\n      translate(").concat(d.y, ",0)\n    ");
	  }).attr("fill", function (d) {
	    return d.children ? "#555" : "#999";
	  }).attr("r", 10);
	  svg.append("g").attr("font-family", "sans-serif").attr("font-size", 10).attr("stroke-linejoin", "round").attr("stroke-width", 3).selectAll("text").data(root.descendants()).join("text").attr("transform", function (d) {
	    return "\n      rotate(".concat(d.x * 180 / Math.PI - 90, ") \n      translate(").concat(d.y, ",0) \n      rotate(").concat(d.x >= Math.PI ? 180 : 0, ")\n    ");
	  }).attr("dy", "0.31em").attr("x", function (d) {
	    return d.x < Math.PI === !d.children ? 6 : -6;
	  }).attr("text-anchor", function (d) {
	    return d.x < Math.PI === !d.children ? "start" : "end";
	  }).text(function (d) {
	    return d.data.node;
	  }).clone(true).lower().attr("stroke", "white");
	  return svg.attr("viewBox", autoBox).node();
	};

	var global$8 = global$y;
	var classof$3 = classof$5;
	var String$1 = global$8.String;

	var toString$5 = function (argument) {
	  if (classof$3(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$1(argument);
	};

	var uncurryThis$5 = functionUncurryThis;
	var arraySlice$2 = uncurryThis$5([].slice);

	var arraySlice$1 = arraySlice$2;
	var floor = Math.floor;

	var mergeSort = function (array, comparefn) {
	  var length = array.length;
	  var middle = floor(length / 2);
	  return length < 8 ? insertionSort(array, comparefn) : merge(array, mergeSort(arraySlice$1(array, 0, middle), comparefn), mergeSort(arraySlice$1(array, middle), comparefn), comparefn);
	};

	var insertionSort = function (array, comparefn) {
	  var length = array.length;
	  var i = 1;
	  var element, j;

	  while (i < length) {
	    j = i;
	    element = array[i];

	    while (j && comparefn(array[j - 1], element) > 0) {
	      array[j] = array[--j];
	    }

	    if (j !== i++) array[j] = element;
	  }

	  return array;
	};

	var merge = function (array, left, right, comparefn) {
	  var llength = left.length;
	  var rlength = right.length;
	  var lindex = 0;
	  var rindex = 0;

	  while (lindex < llength || rindex < rlength) {
	    array[lindex + rindex] = lindex < llength && rindex < rlength ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++] : lindex < llength ? left[lindex++] : right[rindex++];
	  }

	  return array;
	};

	var arraySort = mergeSort;

	var userAgent$1 = engineUserAgent;
	var firefox = userAgent$1.match(/firefox\/(\d+)/i);
	var engineFfVersion = !!firefox && +firefox[1];

	var UA = engineUserAgent;
	var engineIsIeOrEdge = /MSIE|Trident/.test(UA);

	var userAgent = engineUserAgent;
	var webkit = userAgent.match(/AppleWebKit\/(\d+)\./);
	var engineWebkitVersion = !!webkit && +webkit[1];

	var $$5 = _export;
	var uncurryThis$4 = functionUncurryThis;
	var aCallable$2 = aCallable$9;
	var toObject = toObject$5;
	var lengthOfArrayLike = lengthOfArrayLike$4;
	var toString$4 = toString$5;
	var fails$6 = fails$i;
	var internalSort = arraySort;
	var arrayMethodIsStrict = arrayMethodIsStrict$2;
	var FF = engineFfVersion;
	var IE_OR_EDGE = engineIsIeOrEdge;
	var V8 = engineV8Version;
	var WEBKIT = engineWebkitVersion;
	var test = [];
	var un$Sort = uncurryThis$4(test.sort);
	var push$1 = uncurryThis$4(test.push); // IE8-

	var FAILS_ON_UNDEFINED = fails$6(function () {
	  test.sort(undefined);
	}); // V8 bug

	var FAILS_ON_NULL = fails$6(function () {
	  test.sort(null);
	}); // Old WebKit

	var STRICT_METHOD = arrayMethodIsStrict('sort');
	var STABLE_SORT = !fails$6(function () {
	  // feature detection can be too slow, so check engines versions
	  if (V8) return V8 < 70;
	  if (FF && FF > 3) return;
	  if (IE_OR_EDGE) return true;
	  if (WEBKIT) return WEBKIT < 603;
	  var result = '';
	  var code, chr, value, index; // generate an array with more 512 elements (Chakra and old V8 fails only in this case)

	  for (code = 65; code < 76; code++) {
	    chr = String.fromCharCode(code);

	    switch (code) {
	      case 66:
	      case 69:
	      case 70:
	      case 72:
	        value = 3;
	        break;

	      case 68:
	      case 71:
	        value = 4;
	        break;

	      default:
	        value = 2;
	    }

	    for (index = 0; index < 47; index++) {
	      test.push({
	        k: chr + index,
	        v: value
	      });
	    }
	  }

	  test.sort(function (a, b) {
	    return b.v - a.v;
	  });

	  for (index = 0; index < test.length; index++) {
	    chr = test[index].k.charAt(0);
	    if (result.charAt(result.length - 1) !== chr) result += chr;
	  }

	  return result !== 'DGBEFHACIJK';
	});
	var FORCED$1 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

	var getSortCompare = function (comparefn) {
	  return function (x, y) {
	    if (y === undefined) return -1;
	    if (x === undefined) return 1;
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    return toString$4(x) > toString$4(y) ? 1 : -1;
	  };
	}; // `Array.prototype.sort` method
	// https://tc39.es/ecma262/#sec-array.prototype.sort


	$$5({
	  target: 'Array',
	  proto: true,
	  forced: FORCED$1
	}, {
	  sort: function sort(comparefn) {
	    if (comparefn !== undefined) aCallable$2(comparefn);
	    var array = toObject(this);
	    if (STABLE_SORT) return comparefn === undefined ? un$Sort(array) : un$Sort(array, comparefn);
	    var items = [];
	    var arrayLength = lengthOfArrayLike(array);
	    var itemsLength, index;

	    for (index = 0; index < arrayLength; index++) {
	      if (index in array) push$1(items, array[index]);
	    }

	    internalSort(items, getSortCompare(comparefn));
	    itemsLength = items.length;
	    index = 0;

	    while (index < itemsLength) array[index] = items[index++];

	    while (index < arrayLength) delete array[index++];

	    return array;
	  }
	});

	var $$4 = _export;
	var $filter = arrayIteration.filter;
	var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$3;
	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter'); // `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species

	$$4({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT
	}, {
	  filter: function filter(callbackfn
	  /* , thisArg */
	  ) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof$2 = classof$5; // `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$2(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var redefine$1 = redefine$6.exports;
	var toString$3 = objectToString; // `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	if (!TO_STRING_TAG_SUPPORT) {
	  redefine$1(Object.prototype, 'toString', toString$3, {
	    unsafe: true
	  });
	}

	var $$3 = _export;
	var apply$2 = functionApply;
	var aCallable$1 = aCallable$9;
	var anObject$5 = anObject$g;
	var createAsyncIteratorProxy = asyncIteratorCreateProxy;
	var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise, args) {
	  var state = this;
	  var filterer = state.filterer;
	  return new Promise(function (resolve, reject) {
	    var loop = function () {
	      try {
	        Promise.resolve(anObject$5(apply$2(state.next, state.iterator, args))).then(function (step) {
	          try {
	            if (anObject$5(step).done) {
	              state.done = true;
	              resolve({
	                done: true,
	                value: undefined
	              });
	            } else {
	              var value = step.value;
	              Promise.resolve(filterer(value)).then(function (selected) {
	                selected ? resolve({
	                  done: false,
	                  value: value
	                }) : loop();
	              }, reject);
	            }
	          } catch (err) {
	            reject(err);
	          }
	        }, reject);
	      } catch (error) {
	        reject(error);
	      }
	    };

	    loop();
	  });
	});
	$$3({
	  target: 'AsyncIterator',
	  proto: true,
	  real: true
	}, {
	  filter: function filter(filterer) {
	    return new AsyncIteratorProxy({
	      iterator: anObject$5(this),
	      filterer: aCallable$1(filterer)
	    });
	  }
	});

	var global$7 = global$y;
	var isPrototypeOf = objectIsPrototypeOf;
	var TypeError$3 = global$7.TypeError;

	var anInstance$1 = function (it, Prototype) {
	  if (isPrototypeOf(Prototype, it)) return it;
	  throw TypeError$3('Incorrect invocation');
	};

	var $$2 = _export;
	var global$6 = global$y;
	var anInstance = anInstance$1;
	var isCallable$1 = isCallable$g;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$7;
	var fails$5 = fails$i;
	var hasOwn = hasOwnProperty_1;
	var wellKnownSymbol$3 = wellKnownSymbol$e;
	var IteratorPrototype = iteratorsCore.IteratorPrototype;
	var TO_STRING_TAG = wellKnownSymbol$3('toStringTag');
	var NativeIterator = global$6.Iterator; // FF56- have non-standard global helper `Iterator`

	var FORCED = !isCallable$1(NativeIterator) || NativeIterator.prototype !== IteratorPrototype // FF44- non-standard `Iterator` passes previous tests
	|| !fails$5(function () {
	  NativeIterator({});
	});

	var IteratorConstructor = function Iterator() {
	  anInstance(this, IteratorPrototype);
	};

	if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) {
	  createNonEnumerableProperty$1(IteratorPrototype, TO_STRING_TAG, 'Iterator');
	}

	if (FORCED || !hasOwn(IteratorPrototype, 'constructor') || IteratorPrototype.constructor === Object) {
	  createNonEnumerableProperty$1(IteratorPrototype, 'constructor', IteratorConstructor);
	}

	IteratorConstructor.prototype = IteratorPrototype;
	$$2({
	  global: true,
	  forced: FORCED
	}, {
	  Iterator: IteratorConstructor
	});

	var $$1 = _export;
	var apply$1 = functionApply;
	var aCallable = aCallable$9;
	var anObject$4 = anObject$g;
	var createIteratorProxy = iteratorCreateProxy;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$2;
	var IteratorProxy = createIteratorProxy(function (args) {
	  var iterator = this.iterator;
	  var filterer = this.filterer;
	  var next = this.next;
	  var result, done, value;

	  while (true) {
	    result = anObject$4(apply$1(next, iterator, args));
	    done = this.done = !!result.done;
	    if (done) return;
	    value = result.value;
	    if (callWithSafeIterationClosing(iterator, filterer, value)) return value;
	  }
	});
	$$1({
	  target: 'Iterator',
	  proto: true,
	  real: true
	}, {
	  filter: function filter(filterer) {
	    return new IteratorProxy({
	      iterator: anObject$4(this),
	      filterer: aCallable(filterer)
	    });
	  }
	});

	var sunburst = function sunburst(ecosystem, element) {
	  var width = 800;
	  var radius = width / 2;
	  var format = d3.format(",d");
	  var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, ecosystem.children.length + 1));
	  var arc = d3.arc().startAngle(function (d) {
	    return d.x0;
	  }).endAngle(function (d) {
	    return d.x1;
	  }).padAngle(function (d) {
	    return Math.min((d.x1 - d.x0) / 2, 0.005);
	  }).padRadius(radius / 2).innerRadius(function (d) {
	    return d.y0;
	  }).outerRadius(function (d) {
	    return d.y1 - 1;
	  });

	  var partition = function partition(data) {
	    return d3.partition().size([2 * Math.PI, radius])(data.sum(function (d) {
	      return 1;
	    }).sort(function (a, b) {
	      return b.value - a.value;
	    }));
	  };

	  var root = partition(ecosystem);
	  var svg = element.append("svg");
	  svg.append("g").attr("fill-opacity", 0.6).selectAll("path").data(root.descendants().filter(function (d) {
	    return d.depth;
	  })).join("path").attr("fill", function (d) {
	    while (d.depth > 1) {
	      d = d.parent;
	    }

	    return color(d.data.node);
	  }).attr("d", arc).append("title").text(function (d) {
	    return "".concat(d.ancestors().map(function (d) {
	      return d.data.node;
	    }).reverse().join("/"), "\n").concat(format(d.value));
	  });
	  svg.append("g").attr("pointer-events", "none").attr("text-anchor", "middle").attr("font-size", 10).attr("font-family", "sans-serif").selectAll("text").data(root.descendants().filter(function (d) {
	    return d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10;
	  })).join("text").attr("transform", function (d) {
	    var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
	    var y = (d.y0 + d.y1) / 2;
	    return "rotate(".concat(x - 90, ") translate(").concat(y, ",0) rotate(").concat(x < 180 ? 0 : 180, ")");
	  }).attr("dy", "0.35em").text(function (d) {
	    return d.data.node;
	  });
	  return svg.attr("viewBox", autoBox).node();
	};

	var anObject$3 = anObject$g; // `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags

	var regexpFlags$1 = function () {
	  var that = anObject$3(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var regexpStickyHelpers = {};

	var fails$4 = fails$i;
	var global$5 = global$y; // babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError

	var $RegExp$2 = global$5.RegExp;
	regexpStickyHelpers.UNSUPPORTED_Y = fails$4(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});
	regexpStickyHelpers.BROKEN_CARET = fails$4(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var fails$3 = fails$i;
	var global$4 = global$y; // babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError

	var $RegExp$1 = global$4.RegExp;
	var regexpUnsupportedDotAll = fails$3(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	var fails$2 = fails$i;
	var global$3 = global$y; // babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError

	var $RegExp = global$3.RegExp;
	var regexpUnsupportedNcg = fails$2(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' || 'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */

	/* eslint-disable regexp/no-useless-quantifier -- testing */


	var call$2 = functionCall;
	var uncurryThis$3 = functionUncurryThis;
	var toString$2 = toString$5;
	var regexpFlags = regexpFlags$1;
	var stickyHelpers$1 = regexpStickyHelpers;
	var shared = shared$5.exports;
	var create = objectCreate;
	var getInternalState = internalState.get;
	var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG = regexpUnsupportedNcg;
	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$2 = uncurryThis$3(''.charAt);
	var indexOf = uncurryThis$3(''.indexOf);
	var replace = uncurryThis$3(''.replace);
	var stringSlice$2 = uncurryThis$3(''.slice);

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  call$2(nativeExec, re1, 'a');
	  call$2(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}();

	var UNSUPPORTED_Y$1 = stickyHelpers$1.UNSUPPORTED_Y || stickyHelpers$1.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

	if (PATCH) {
	  // eslint-disable-next-line max-statements -- TODO
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState(re);
	    var str = toString$2(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = call$2(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = call$2(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace(flags, 'y', '');

	      if (indexOf(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice$2(str, re.lastIndex); // Support anchored sticky behavior.

	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$2(str, re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      } // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.


	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }

	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
	    match = call$2(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice$2(match.input, charsAdded);
	        match[0] = stringSlice$2(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      call$2(nativeReplace, match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = create(null);

	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec$3 = patchedExec;

	var $ = _export;
	var exec$1 = regexpExec$3; // `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec

	$({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== exec$1
	}, {
	  exec: exec$1
	});

	var uncurryThis$2 = functionUncurryThis;
	var redefine = redefine$6.exports;
	var regexpExec$2 = regexpExec$3;
	var fails$1 = fails$i;
	var wellKnownSymbol$2 = wellKnownSymbol$e;
	var createNonEnumerableProperty = createNonEnumerableProperty$7;
	var SPECIES$1 = wellKnownSymbol$2('species');
	var RegExpPrototype = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol$2(KEY);
	  var DELEGATES_TO_SYMBOL = !fails$1(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$1(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {}; // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.

	      re.constructor = {};

	      re.constructor[SPECIES$1] = function () {
	        return re;
	      };

	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
	    var uncurriedNativeRegExpMethod = uncurryThis$2(/./[SYMBOL]);
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var uncurriedNativeMethod = uncurryThis$2(nativeMethod);
	      var $exec = regexp.exec;

	      if ($exec === regexpExec$2 || $exec === RegExpPrototype.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: uncurriedNativeRegExpMethod(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: uncurriedNativeMethod(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    });
	    redefine(String.prototype, KEY, methods[0]);
	    redefine(RegExpPrototype, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
	};

	var isObject = isObject$8;
	var classof$1 = classofRaw$1;
	var wellKnownSymbol$1 = wellKnownSymbol$e;
	var MATCH = wellKnownSymbol$1('match'); // `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp

	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof$1(it) == 'RegExp');
	};

	var global$2 = global$y;
	var isConstructor = isConstructor$2;
	var tryToString = tryToString$2;
	var TypeError$2 = global$2.TypeError; // `Assert: IsConstructor(argument) is true`

	var aConstructor$1 = function (argument) {
	  if (isConstructor(argument)) return argument;
	  throw TypeError$2(tryToString(argument) + ' is not a constructor');
	};

	var anObject$2 = anObject$g;
	var aConstructor = aConstructor$1;
	var wellKnownSymbol = wellKnownSymbol$e;
	var SPECIES = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor

	var speciesConstructor$1 = function (O, defaultConstructor) {
	  var C = anObject$2(O).constructor;
	  var S;
	  return C === undefined || (S = anObject$2(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
	};

	var uncurryThis$1 = functionUncurryThis;
	var toIntegerOrInfinity = toIntegerOrInfinity$3;
	var toString$1 = toString$5;
	var requireObjectCoercible$1 = requireObjectCoercible$4;
	var charAt$1 = uncurryThis$1(''.charAt);
	var charCodeAt = uncurryThis$1(''.charCodeAt);
	var stringSlice$1 = uncurryThis$1(''.slice);

	var createMethod = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$1(requireObjectCoercible$1($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? charAt$1(S, position) : first : CONVERT_TO_STRING ? stringSlice$1(S, position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod(true)
	};

	var charAt = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex

	var advanceStringIndex$1 = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	var global$1 = global$y;
	var call$1 = functionCall;
	var anObject$1 = anObject$g;
	var isCallable = isCallable$g;
	var classof = classofRaw$1;
	var regexpExec$1 = regexpExec$3;
	var TypeError$1 = global$1.TypeError; // `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec

	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (isCallable(exec)) {
	    var result = call$1(exec, R, S);
	    if (result !== null) anObject$1(result);
	    return result;
	  }

	  if (classof(R) === 'RegExp') return call$1(regexpExec$1, R, S);
	  throw TypeError$1('RegExp#exec called on incompatible receiver');
	};

	var apply = functionApply;
	var call = functionCall;
	var uncurryThis = functionUncurryThis;
	var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
	var isRegExp = isRegexp;
	var anObject = anObject$g;
	var requireObjectCoercible = requireObjectCoercible$4;
	var speciesConstructor = speciesConstructor$1;
	var advanceStringIndex = advanceStringIndex$1;
	var toLength = toLength$2;
	var toString = toString$5;
	var getMethod = getMethod$5;
	var arraySlice = arraySlice$2;
	var callRegExpExec = regexpExecAbstract;
	var regexpExec = regexpExec$3;
	var stickyHelpers = regexpStickyHelpers;
	var fails = fails$i;
	var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
	var MAX_UINT32 = 0xFFFFFFFF;
	var min = Math.min;
	var $push = [].push;
	var exec = uncurryThis(/./.exec);
	var push = uncurryThis($push);
	var stringSlice = uncurryThis(''.slice); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	}); // @@split logic

	fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'.split(/(b)*/)[1] == 'c' || // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
	  '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = toString(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

	      if (!isRegExp(separator)) {
	        return call(nativeSplit, string, separator, lim);
	      }

	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = call(regexpExec, separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;

	        if (lastIndex > lastLastIndex) {
	          push(output, stringSlice(string, lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) apply($push, output, arraySlice(match, 1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }

	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string.length) {
	        if (lastLength || !exec(separatorCopy, '')) push(output, '');
	      } else push(output, stringSlice(string, lastLastIndex));

	      return output.length > lim ? arraySlice(output, 0, lim) : output;
	    }; // Chakra, V8

	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [// `String.prototype.split` method
	  // https://tc39.es/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = requireObjectCoercible(this);
	    var splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
	    return splitter ? call(splitter, separator, O, limit) : call(internalSplit, toString(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (string, limit) {
	    var rx = anObject(this);
	    var S = toString(string);
	    var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
	    if (res.done) return res.value;
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (UNSUPPORTED_Y ? 'g' : 'y'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
	      var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
	      var e;

	      if (z === null || (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p) {
	        q = advanceStringIndex(S, q, unicodeMatching);
	      } else {
	        push(A, stringSlice(S, p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          push(A, z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    push(A, stringSlice(S, p));
	    return A;
	  }];
	}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

	var packChart = function packChart(ecosystem, element) {
	  var width = 975;
	  var height = 975;

	  var pack = function pack(data) {
	    return d3.pack().size([width - 2, height - 2]).padding(3)(data.sum(function (d) {
	      return d.children ? 0 : 1;
	    }).sort(function (a, b) {
	      return b.value - a.value;
	    }));
	  };

	  var root = pack(ecosystem);
	  var svg = element.append("svg").attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif").attr("text-anchor", "middle");
	  var shadow = sid('filter');
	  svg.append("filter").attr("id", shadow).append("feDropShadow").attr("flood-opacity", 0.3).attr("dx", 0).attr("dy", 1);
	  var node = svg.selectAll("g").data(d3.group(root.descendants(), function (d) {
	    return d.height;
	  })).join("g").attr("filter", "url(#".concat(shadow)).selectAll("g").data(function (d) {
	    return d[1];
	  }).join("g").attr("transform", function (d) {
	    return "translate(".concat(d.x + 1, ",").concat(d.y + 1, ")");
	  });
	  var color = d3.scaleSequential([8, 0], d3.interpolateMagma);
	  var format = d3.format(",d");
	  node.append("circle").attr("r", function (d) {
	    return d.r;
	  }).attr("fill", function (d) {
	    return color(d.height);
	  });
	  var leaf = node.filter(function (d) {
	    return !d.children;
	  });
	  leaf.select("circle").attr("id", function (d) {
	    return d.leafUid = sid('leaf');
	  });
	  leaf.append("clipPath").attr("id", function (d) {
	    return d.clipUid = sid('clip');
	  }).append("use").attr("xlink:href", function (d) {
	    return d.leafUid.href;
	  });
	  leaf.append("text").attr("clip-path", function (d) {
	    return d.clipUid;
	  }).selectAll("tspan").data(function (d) {
	    return d.data.node.split(/(?=[A-Z][a-z])|\s+/g);
	  }).join("tspan").attr("x", 0).attr("y", function (d, i, nodes) {
	    return "".concat(i - nodes.length / 2 + 0.8, "em");
	  }).text(function (d) {
	    return d;
	  });
	  node.append("title").text(function (d) {
	    return "".concat(d.ancestors().map(function (d) {
	      return d.data.node;
	    }).reverse().join("/"), "\n").concat(format(d.value));
	  });
	  return svg.node();
	};

	d3.csv('ecosystem-tree.csv').then(function (data) {
	  var ecosystem = d3.stratify().id(function (x) {
	    return x.node;
	  }).parentId(function (x) {
	    return x.parent;
	  })(data);
	  forceTree(ecosystem, d3.select("#tree"));
	  packChart(ecosystem, d3.select("#pack-chart"));
	  sunburst(ecosystem, d3.select("#sunburst"));
	  radialTree(ecosystem, d3.select("#radial-tree"));
	});

})();
