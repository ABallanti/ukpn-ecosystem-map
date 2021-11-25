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
	var id$1 = 0;
	var postfix = Math.random();
	var toString$6 = uncurryThis$g(1.0.toString);

	var uid$2 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$6(++id$1 + postfix, 36);
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
	var set$2, get$2, has;

	var enforce = function (it) {
	  return has(it) ? get$2(it) : set$2(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject$3(it) || (state = get$2(it)).type !== TYPE) {
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

	  set$2 = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$5(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };

	  get$2 = function (it) {
	    return wmget(store, it) || {};
	  };

	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey$2('state');
	  hiddenKeys$3[STATE] = true;

	  set$2 = function (it, metadata) {
	    if (hasOwn$6(it, STATE)) throw new TypeError$5(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$6(it, STATE, metadata);
	    return metadata;
	  };

	  get$2 = function (it) {
	    return hasOwn$6(it, STATE) ? it[STATE] : {};
	  };

	  has = function (it) {
	    return hasOwn$6(it, STATE);
	  };
	}

	var internalState = {
	  set: set$2,
	  get: get$2,
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
	var max$1 = Math.max;
	var min$3 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toIntegerOrInfinity$2(index);
	  return integer < 0 ? max$1(integer + length, 0) : min$3(integer, length);
	};

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$3;
	var min$2 = Math.min; // `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength

	var toLength$2 = function (argument) {
	  return argument > 0 ? min$2(toIntegerOrInfinity$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
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

	var uncurryThis$b = functionUncurryThis;
	var aCallable$7 = aCallable$9;
	var bind$2 = uncurryThis$b(uncurryThis$b.bind); // optional / simple context binding

	var functionBindContext = function (fn, that) {
	  aCallable$7(fn);
	  return that === undefined ? fn : bind$2 ? bind$2(fn, that) : function
	    /* ...args */
	  () {
	    return fn.apply(that, arguments);
	  };
	};

	var classof$6 = classofRaw$1; // `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe

	var isArray$3 = Array.isArray || function isArray(argument) {
	  return classof$6(argument) == 'Array';
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

	var uncurryThis$a = functionUncurryThis;
	var fails$c = fails$i;
	var isCallable$5 = isCallable$g;
	var classof$4 = classof$5;
	var getBuiltIn$2 = getBuiltIn$6;
	var inspectSource = inspectSource$3;

	var noop$1 = function () {
	  /* empty */
	};

	var empty$1 = [];
	var construct = getBuiltIn$2('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$2 = uncurryThis$a(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop$1);

	var isConstructorModern = function (argument) {
	  if (!isCallable$5(argument)) return false;

	  try {
	    construct(noop$1, empty$1, argument);
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


	var isConstructor$2 = !construct || fails$c(function () {
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

	var bind$1 = functionBindContext;
	var uncurryThis$9 = functionUncurryThis;
	var IndexedObject$1 = indexedObject;
	var toObject$3 = toObject$5;
	var lengthOfArrayLike$2 = lengthOfArrayLike$4;
	var arraySpeciesCreate$1 = arraySpeciesCreate$2;
	var push$2 = uncurryThis$9([].push); // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation

	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject$3($this);
	    var self = IndexedObject$1(O);
	    var boundFunction = bind$1(callbackfn, that);
	    var length = lengthOfArrayLike$2(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate$1;
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

	var fails$b = fails$i;
	var wellKnownSymbol$9 = wellKnownSymbol$e;
	var V8_VERSION$1 = engineV8Version;
	var SPECIES$2 = wellKnownSymbol$9('species');

	var arrayMethodHasSpeciesSupport$3 = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION$1 >= 51 || !fails$b(function () {
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

	var $$b = _export;
	var $filter = arrayIteration.filter;
	var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$3;
	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$2('filter'); // `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species

	$$b({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT$1
	}, {
	  filter: function filter(callbackfn
	  /* , thisArg */
	  ) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof$3 = classof$5; // `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$3(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var redefine$4 = redefine$6.exports;
	var toString$5 = objectToString; // `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	if (!TO_STRING_TAG_SUPPORT) {
	  redefine$4(Object.prototype, 'toString', toString$5, {
	    unsafe: true
	  });
	}

	var FunctionPrototype$1 = Function.prototype;
	var apply$5 = FunctionPrototype$1.apply;
	var bind = FunctionPrototype$1.bind;
	var call$6 = FunctionPrototype$1.call; // eslint-disable-next-line es/no-reflect -- safe

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

	var DESCRIPTORS$1 = descriptors;
	var definePropertyModule$1 = objectDefineProperty;
	var anObject$d = anObject$g;
	var toIndexedObject$1 = toIndexedObject$5;
	var objectKeys = objectKeys$1; // `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe

	var objectDefineProperties = DESCRIPTORS$1 ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$d(O);
	  var props = toIndexedObject$1(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) definePropertyModule$1.f(O, key = keys[index++], props[key]);

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

	var redefine$3 = redefine$6.exports;

	var redefineAll$2 = function (target, src, options) {
	  for (var key in src) redefine$3(target, key, src[key], options);

	  return target;
	};

	var fails$a = fails$i;
	var correctPrototypeGetter = !fails$a(function () {
	  function F() {
	    /* empty */
	  }

	  F.prototype.constructor = null; // eslint-disable-next-line es/no-object-getprototypeof -- required for testing

	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var global$b = global$y;
	var hasOwn$1 = hasOwnProperty_1;
	var isCallable$4 = isCallable$g;
	var toObject$2 = toObject$5;
	var sharedKey = sharedKey$3;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;
	var IE_PROTO = sharedKey('IE_PROTO');
	var Object$1 = global$b.Object;
	var ObjectPrototype = Object$1.prototype; // `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof

	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object$1.getPrototypeOf : function (O) {
	  var object = toObject$2(O);
	  if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;

	  if (isCallable$4(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  }

	  return object instanceof Object$1 ? ObjectPrototype : null;
	};

	var global$a = global$y;
	var shared$1 = sharedStore;
	var isCallable$3 = isCallable$g;
	var getPrototypeOf$1 = objectGetPrototypeOf;
	var redefine$2 = redefine$6.exports;
	var wellKnownSymbol$8 = wellKnownSymbol$e;
	var USE_FUNCTION_CONSTRUCTOR = 'USE_FUNCTION_CONSTRUCTOR';
	var ASYNC_ITERATOR = wellKnownSymbol$8('asyncIterator');
	var AsyncIterator = global$a.AsyncIterator;
	var PassedAsyncIteratorPrototype = shared$1.AsyncIteratorPrototype;
	var AsyncIteratorPrototype$1, prototype;

	if (PassedAsyncIteratorPrototype) {
	  AsyncIteratorPrototype$1 = PassedAsyncIteratorPrototype;
	} else if (isCallable$3(AsyncIterator)) {
	  AsyncIteratorPrototype$1 = AsyncIterator.prototype;
	} else if (shared$1[USE_FUNCTION_CONSTRUCTOR] || global$a[USE_FUNCTION_CONSTRUCTOR]) {
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
	  redefine$2(AsyncIteratorPrototype$1, ASYNC_ITERATOR, function () {
	    return this;
	  });
	}

	var asyncIteratorPrototype = AsyncIteratorPrototype$1;

	var call$5 = functionCall;
	var aCallable$6 = aCallable$9;
	var anObject$b = anObject$g;
	var create$3 = objectCreate;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$7;
	var redefineAll$1 = redefineAll$2;
	var wellKnownSymbol$7 = wellKnownSymbol$e;
	var InternalStateModule$1 = internalState;
	var getBuiltIn = getBuiltIn$6;
	var getMethod$3 = getMethod$5;
	var AsyncIteratorPrototype = asyncIteratorPrototype;
	var Promise$1 = getBuiltIn('Promise');
	var setInternalState$1 = InternalStateModule$1.set;
	var getInternalState$2 = InternalStateModule$1.get;
	var TO_STRING_TAG$2 = wellKnownSymbol$7('toStringTag');

	var asyncIteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var AsyncIteratorProxy = function AsyncIterator(state) {
	    state.next = aCallable$6(state.iterator.next);
	    state.done = false;
	    state.ignoreArgument = !IS_ITERATOR;
	    setInternalState$1(this, state);
	  };

	  AsyncIteratorProxy.prototype = redefineAll$1(create$3(AsyncIteratorPrototype), {
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

	var $$a = _export;
	var apply$4 = functionApply;
	var aCallable$5 = aCallable$9;
	var anObject$a = anObject$g;
	var createAsyncIteratorProxy$1 = asyncIteratorCreateProxy;
	var AsyncIteratorProxy$1 = createAsyncIteratorProxy$1(function (Promise, args) {
	  var state = this;
	  var filterer = state.filterer;
	  return new Promise(function (resolve, reject) {
	    var loop = function () {
	      try {
	        Promise.resolve(anObject$a(apply$4(state.next, state.iterator, args))).then(function (step) {
	          try {
	            if (anObject$a(step).done) {
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
	$$a({
	  target: 'AsyncIterator',
	  proto: true,
	  real: true
	}, {
	  filter: function filter(filterer) {
	    return new AsyncIteratorProxy$1({
	      iterator: anObject$a(this),
	      filterer: aCallable$5(filterer)
	    });
	  }
	});

	var global$9 = global$y;
	var isPrototypeOf = objectIsPrototypeOf;
	var TypeError$4 = global$9.TypeError;

	var anInstance$1 = function (it, Prototype) {
	  if (isPrototypeOf(Prototype, it)) return it;
	  throw TypeError$4('Incorrect invocation');
	};

	var fails$9 = fails$i;
	var isCallable$2 = isCallable$g;
	var getPrototypeOf = objectGetPrototypeOf;
	var redefine$1 = redefine$6.exports;
	var wellKnownSymbol$6 = wellKnownSymbol$e;
	var ITERATOR = wellKnownSymbol$6('iterator');
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

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$9(function () {
	  var test = {}; // FF44- legacy iterators case

	  return IteratorPrototype$2[ITERATOR].call(test) !== test;
	});
	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {}; // `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator

	if (!isCallable$2(IteratorPrototype$2[ITERATOR])) {
	  redefine$1(IteratorPrototype$2, ITERATOR, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var $$9 = _export;
	var global$8 = global$y;
	var anInstance = anInstance$1;
	var isCallable$1 = isCallable$g;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$7;
	var fails$8 = fails$i;
	var hasOwn = hasOwnProperty_1;
	var wellKnownSymbol$5 = wellKnownSymbol$e;
	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
	var TO_STRING_TAG$1 = wellKnownSymbol$5('toStringTag');
	var NativeIterator = global$8.Iterator; // FF56- have non-standard global helper `Iterator`

	var FORCED$2 = !isCallable$1(NativeIterator) || NativeIterator.prototype !== IteratorPrototype$1 // FF44- non-standard `Iterator` passes previous tests
	|| !fails$8(function () {
	  NativeIterator({});
	});

	var IteratorConstructor = function Iterator() {
	  anInstance(this, IteratorPrototype$1);
	};

	if (!hasOwn(IteratorPrototype$1, TO_STRING_TAG$1)) {
	  createNonEnumerableProperty$2(IteratorPrototype$1, TO_STRING_TAG$1, 'Iterator');
	}

	if (FORCED$2 || !hasOwn(IteratorPrototype$1, 'constructor') || IteratorPrototype$1.constructor === Object) {
	  createNonEnumerableProperty$2(IteratorPrototype$1, 'constructor', IteratorConstructor);
	}

	IteratorConstructor.prototype = IteratorPrototype$1;
	$$9({
	  global: true,
	  forced: FORCED$2
	}, {
	  Iterator: IteratorConstructor
	});

	var call$4 = functionCall;
	var aCallable$4 = aCallable$9;
	var anObject$9 = anObject$g;
	var create$2 = objectCreate;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$7;
	var redefineAll = redefineAll$2;
	var wellKnownSymbol$4 = wellKnownSymbol$e;
	var InternalStateModule = internalState;
	var getMethod$2 = getMethod$5;
	var IteratorPrototype = iteratorsCore.IteratorPrototype;
	var setInternalState = InternalStateModule.set;
	var getInternalState$1 = InternalStateModule.get;
	var TO_STRING_TAG = wellKnownSymbol$4('toStringTag');

	var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var IteratorProxy = function Iterator(state) {
	    state.next = aCallable$4(state.iterator.next);
	    state.done = false;
	    state.ignoreArg = !IS_ITERATOR;
	    setInternalState(this, state);
	  };

	  IteratorProxy.prototype = redefineAll(create$2(IteratorPrototype), {
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
	    createNonEnumerableProperty$1(IteratorProxy.prototype, TO_STRING_TAG, 'Generator');
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

	var $$8 = _export;
	var apply$3 = functionApply;
	var aCallable$3 = aCallable$9;
	var anObject$6 = anObject$g;
	var createIteratorProxy$1 = iteratorCreateProxy;
	var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$2;
	var IteratorProxy$1 = createIteratorProxy$1(function (args) {
	  var iterator = this.iterator;
	  var filterer = this.filterer;
	  var next = this.next;
	  var result, done, value;

	  while (true) {
	    result = anObject$6(apply$3(next, iterator, args));
	    done = this.done = !!result.done;
	    if (done) return;
	    value = result.value;
	    if (callWithSafeIterationClosing$1(iterator, filterer, value)) return value;
	  }
	});
	$$8({
	  target: 'Iterator',
	  proto: true,
	  real: true
	}, {
	  filter: function filter(filterer) {
	    return new IteratorProxy$1({
	      iterator: anObject$6(this),
	      filterer: aCallable$3(filterer)
	    });
	  }
	});

	var fails$7 = fails$i;

	var arrayMethodIsStrict$2 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$7(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var $$7 = _export;
	var uncurryThis$8 = functionUncurryThis;
	var IndexedObject = indexedObject;
	var toIndexedObject = toIndexedObject$5;
	var arrayMethodIsStrict$1 = arrayMethodIsStrict$2;
	var un$Join = uncurryThis$8([].join);
	var ES3_STRINGS = IndexedObject != Object;
	var STRICT_METHOD$1 = arrayMethodIsStrict$1('join', ','); // `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join

	$$7({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || !STRICT_METHOD$1
	}, {
	  join: function join(separator) {
	    return un$Join(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var DESCRIPTORS = descriptors;
	var FUNCTION_NAME_EXISTS = functionName.EXISTS;
	var uncurryThis$7 = functionUncurryThis;
	var defineProperty = objectDefineProperty.f;
	var FunctionPrototype = Function.prototype;
	var functionToString = uncurryThis$7(FunctionPrototype.toString);
	var nameRE = /^\s*function ([^ (]*)/;
	var regExpExec = uncurryThis$7(nameRE.exec);
	var NAME = 'name'; // Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name

	if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
	  defineProperty(FunctionPrototype, NAME, {
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

	var toPropertyKey = toPropertyKey$3;
	var definePropertyModule = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$3;

	var createProperty$1 = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var $$6 = _export;
	var global$7 = global$y;
	var fails$6 = fails$i;
	var isArray$1 = isArray$3;
	var isObject$1 = isObject$8;
	var toObject$1 = toObject$5;
	var lengthOfArrayLike$1 = lengthOfArrayLike$4;
	var createProperty = createProperty$1;
	var arraySpeciesCreate = arraySpeciesCreate$2;
	var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$3;
	var wellKnownSymbol$3 = wellKnownSymbol$e;
	var V8_VERSION = engineV8Version;
	var IS_CONCAT_SPREADABLE = wellKnownSymbol$3('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
	var TypeError$3 = global$7.TypeError; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails$6(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$1('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject$1(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray$1(O);
	};

	var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	$$6({
	  target: 'Array',
	  proto: true,
	  forced: FORCED$1
	}, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject$1(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike$1(E);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError$3(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError$3(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var $$5 = _export;
	var uncurryThis$6 = functionUncurryThis;
	var isArray = isArray$3;
	var un$Reverse = uncurryThis$6([].reverse);
	var test$1 = [1, 2]; // `Array.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-array.prototype.reverse
	// fix for Safari 12.0 bug
	// https://bugs.webkit.org/show_bug.cgi?id=188794

	$$5({
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

	var $$4 = _export;
	var $map = arrayIteration.map;
	var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$3;
	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map'); // `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species

	$$4({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT
	}, {
	  map: function map(callbackfn
	  /* , thisArg */
	  ) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$3 = _export;
	var apply$2 = functionApply;
	var aCallable$2 = aCallable$9;
	var anObject$5 = anObject$g;
	var createAsyncIteratorProxy = asyncIteratorCreateProxy;
	var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise, args) {
	  var state = this;
	  var mapper = state.mapper;
	  return Promise.resolve(anObject$5(apply$2(state.next, state.iterator, args))).then(function (step) {
	    if (anObject$5(step).done) {
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
	$$3({
	  target: 'AsyncIterator',
	  proto: true,
	  real: true
	}, {
	  map: function map(mapper) {
	    return new AsyncIteratorProxy({
	      iterator: anObject$5(this),
	      mapper: aCallable$2(mapper)
	    });
	  }
	});

	var $$2 = _export;
	var apply$1 = functionApply;
	var aCallable$1 = aCallable$9;
	var anObject$4 = anObject$g;
	var createIteratorProxy = iteratorCreateProxy;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$2;
	var IteratorProxy = createIteratorProxy(function (args) {
	  var iterator = this.iterator;
	  var result = anObject$4(apply$1(this.next, iterator, args));
	  var done = this.done = !!result.done;
	  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, result.value);
	});
	$$2({
	  target: 'Iterator',
	  proto: true,
	  real: true
	}, {
	  map: function map(mapper) {
	    return new IteratorProxy({
	      iterator: anObject$4(this),
	      mapper: aCallable$1(mapper)
	    });
	  }
	});

	var noop = {
	  value: () => {}
	};

	function dispatch() {
	  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
	    _[t] = [];
	  }

	  return new Dispatch(_);
	}

	function Dispatch(_) {
	  this._ = _;
	}

	function parseTypenames$1(typenames, types) {
	  return typenames.trim().split(/^|\s+/).map(function (t) {
	    var name = "",
	        i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	    return {
	      type: t,
	      name: name
	    };
	  });
	}

	Dispatch.prototype = dispatch.prototype = {
	  constructor: Dispatch,
	  on: function (typename, callback) {
	    var _ = this._,
	        T = parseTypenames$1(typename + "", _),
	        t,
	        i = -1,
	        n = T.length; // If no callback was specified, return the callback of the given type and name.

	    if (arguments.length < 2) {
	      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;

	      return;
	    } // If a type was specified, set the callback for the given type and name.
	    // Otherwise, if a null callback was specified, remove callbacks of the given name.


	    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);

	    while (++i < n) {
	      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
	    }

	    return this;
	  },
	  copy: function () {
	    var copy = {},
	        _ = this._;

	    for (var t in _) copy[t] = _[t].slice();

	    return new Dispatch(copy);
	  },
	  call: function (type, that) {
	    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

	    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  },
	  apply: function (type, that, args) {
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

	    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  }
	};

	function get$1(type, name) {
	  for (var i = 0, n = type.length, c; i < n; ++i) {
	    if ((c = type[i]).name === name) {
	      return c.value;
	    }
	  }
	}

	function set$1(type, name, callback) {
	  for (var i = 0, n = type.length; i < n; ++i) {
	    if (type[i].name === name) {
	      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
	      break;
	    }
	  }

	  if (callback != null) type.push({
	    name: name,
	    value: callback
	  });
	  return type;
	}

	var xhtml = "http://www.w3.org/1999/xhtml";
	var namespaces = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	function namespace (name) {
	  var prefix = name += "",
	      i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces.hasOwnProperty(prefix) ? {
	    space: namespaces[prefix],
	    local: name
	  } : name; // eslint-disable-line no-prototype-builtins
	}

	function creatorInherit(name) {
	  return function () {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml && document.documentElement.namespaceURI === xhtml ? document.createElement(name) : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed(fullname) {
	  return function () {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	function creator (name) {
	  var fullname = namespace(name);
	  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
	}

	function none() {}

	function selector (selector) {
	  return selector == null ? none : function () {
	    return this.querySelector(selector);
	  };
	}

	function selection_select (select) {
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection$1(subgroups, this._parents);
	}

	// Given something array like (or null), returns something that is strictly an
	// array. This is used to ensure that array-like objects passed to d3.selectAll
	// or selection.selectAll are converted into proper arrays when creating a
	// selection; we don’t ever want to create a selection backed by a live
	// HTMLCollection or NodeList. However, note that selection.selectAll will use a
	// static NodeList as a group, since it safely derived from querySelectorAll.
	function array$1(x) {
	  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
	}

	function empty() {
	  return [];
	}

	function selectorAll (selector) {
	  return selector == null ? empty : function () {
	    return this.querySelectorAll(selector);
	  };
	}

	function arrayAll(select) {
	  return function () {
	    return array$1(select.apply(this, arguments));
	  };
	}

	function selection_selectAll (select) {
	  if (typeof select === "function") select = arrayAll(select);else select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection$1(subgroups, parents);
	}

	function matcher (selector) {
	  return function () {
	    return this.matches(selector);
	  };
	}
	function childMatcher(selector) {
	  return function (node) {
	    return node.matches(selector);
	  };
	}

	var find$1 = Array.prototype.find;

	function childFind(match) {
	  return function () {
	    return find$1.call(this.children, match);
	  };
	}

	function childFirst() {
	  return this.firstElementChild;
	}

	function selection_selectChild (match) {
	  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
	}

	var filter = Array.prototype.filter;

	function children() {
	  return Array.from(this.children);
	}

	function childrenFilter(match) {
	  return function () {
	    return filter.call(this.children, match);
	  };
	}

	function selection_selectChildren (match) {
	  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
	}

	function selection_filter (match) {
	  if (typeof match !== "function") match = matcher(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection$1(subgroups, this._parents);
	}

	function sparse (update) {
	  return new Array(update.length);
	}

	function selection_enter () {
	  return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
	}
	function EnterNode(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}
	EnterNode.prototype = {
	  constructor: EnterNode,
	  appendChild: function (child) {
	    return this._parent.insertBefore(child, this._next);
	  },
	  insertBefore: function (child, next) {
	    return this._parent.insertBefore(child, next);
	  },
	  querySelector: function (selector) {
	    return this._parent.querySelector(selector);
	  },
	  querySelectorAll: function (selector) {
	    return this._parent.querySelectorAll(selector);
	  }
	};

	function constant$6 (x) {
	  return function () {
	    return x;
	  };
	}

	function bindIndex(parent, group, enter, update, exit, data) {
	  var i = 0,
	      node,
	      groupLength = group.length,
	      dataLength = data.length; // Put any non-null nodes that fit into update.
	  // Put any null nodes into enter.
	  // Put any remaining data into enter.

	  for (; i < dataLength; ++i) {
	    if (node = group[i]) {
	      node.__data__ = data[i];
	      update[i] = node;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  } // Put any non-null nodes that don’t fit into exit.


	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey(parent, group, enter, update, exit, data, key) {
	  var i,
	      node,
	      nodeByKeyValue = new Map(),
	      groupLength = group.length,
	      dataLength = data.length,
	      keyValues = new Array(groupLength),
	      keyValue; // Compute the key for each node.
	  // If multiple nodes have the same key, the duplicates are added to exit.

	  for (i = 0; i < groupLength; ++i) {
	    if (node = group[i]) {
	      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";

	      if (nodeByKeyValue.has(keyValue)) {
	        exit[i] = node;
	      } else {
	        nodeByKeyValue.set(keyValue, node);
	      }
	    }
	  } // Compute the key for each datum.
	  // If there a node associated with this key, join and add it to update.
	  // If there is not (or the key is a duplicate), add it to enter.


	  for (i = 0; i < dataLength; ++i) {
	    keyValue = key.call(parent, data[i], i, data) + "";

	    if (node = nodeByKeyValue.get(keyValue)) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue.delete(keyValue);
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  } // Add any remaining nodes that were not bound to data to exit.


	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
	      exit[i] = node;
	    }
	  }
	}

	function datum(node) {
	  return node.__data__;
	}

	function selection_data (value, key) {
	  if (!arguments.length) return Array.from(this, datum);
	  var bind = key ? bindKey : bindIndex,
	      parents = this._parents,
	      groups = this._groups;
	  if (typeof value !== "function") value = constant$6(value);

	  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	    var parent = parents[j],
	        group = groups[j],
	        groupLength = group.length,
	        data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
	        dataLength = data.length,
	        enterGroup = enter[j] = new Array(dataLength),
	        updateGroup = update[j] = new Array(dataLength),
	        exitGroup = exit[j] = new Array(groupLength);
	    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key); // Now connect the enter nodes to their following update node, such that
	    // appendChild can insert the materialized enter node before this node,
	    // rather than at the end of the parent node.

	    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	      if (previous = enterGroup[i0]) {
	        if (i0 >= i1) i1 = i0 + 1;

	        while (!(next = updateGroup[i1]) && ++i1 < dataLength);

	        previous._next = next || null;
	      }
	    }
	  }

	  update = new Selection$1(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	} // Given some data, this returns an array-like view of it: an object that
	// exposes a length property and allows numeric indexing. Note that unlike
	// selectAll, this isn’t worried about “live” collections because the resulting
	// array will only be used briefly while data is being bound. (It is possible to
	// cause the data to change while iterating by using a key function, but please
	// don’t; we’d rather avoid a gratuitous copy.)

	function arraylike(data) {
	  return typeof data === "object" && "length" in data ? data // Array, TypedArray, NodeList, array-like
	  : Array.from(data); // Map, Set, iterable, string, or anything else
	}

	function selection_exit () {
	  return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
	}

	function selection_join (onenter, onupdate, onexit) {
	  var enter = this.enter(),
	      update = this,
	      exit = this.exit();

	  if (typeof onenter === "function") {
	    enter = onenter(enter);
	    if (enter) enter = enter.selection();
	  } else {
	    enter = enter.append(onenter + "");
	  }

	  if (onupdate != null) {
	    update = onupdate(update);
	    if (update) update = update.selection();
	  }

	  if (onexit == null) exit.remove();else onexit(exit);
	  return enter && update ? enter.merge(update).order() : update;
	}

	function selection_merge (context) {
	  var selection = context.selection ? context.selection() : context;

	  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Selection$1(merges, this._parents);
	}

	function selection_order () {
	  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	      if (node = group[i]) {
	        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
	        next = node;
	      }
	    }
	  }

	  return this;
	}

	function selection_sort (compare) {
	  if (!compare) compare = ascending;

	  function compareNode(a, b) {
	    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	  }

	  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        sortgroup[i] = node;
	      }
	    }

	    sortgroup.sort(compareNode);
	  }

	  return new Selection$1(sortgroups, this._parents).order();
	}

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function selection_call () {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	}

	function selection_nodes () {
	  return Array.from(this);
	}

	function selection_node () {
	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	}

	function selection_size () {
	  let size = 0;

	  for (const node of this) ++size; // eslint-disable-line no-unused-vars


	  return size;
	}

	function selection_empty () {
	  return !this.node();
	}

	function selection_each (callback) {
	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	}

	function attrRemove$1(name) {
	  return function () {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS$1(fullname) {
	  return function () {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant$1(name, value) {
	  return function () {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS$1(fullname, value) {
	  return function () {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction$1(name, value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS$1(fullname, value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	function selection_attr (name, value) {
	  var fullname = namespace(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
	  }

	  return this.each((value == null ? fullname.local ? attrRemoveNS$1 : attrRemove$1 : typeof value === "function" ? fullname.local ? attrFunctionNS$1 : attrFunction$1 : fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, value));
	}

	function defaultView (node) {
	  return node.ownerDocument && node.ownerDocument.defaultView // node is a Node
	  || node.document && node // node is a Window
	  || node.defaultView; // node is a Document
	}

	function styleRemove$1(name) {
	  return function () {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant$1(name, value, priority) {
	  return function () {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction$1(name, value, priority) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
	  };
	}

	function selection_style (name, value, priority) {
	  return arguments.length > 1 ? this.each((value == null ? styleRemove$1 : typeof value === "function" ? styleFunction$1 : styleConstant$1)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
	}
	function styleValue(node, name) {
	  return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
	}

	function propertyRemove(name) {
	  return function () {
	    delete this[name];
	  };
	}

	function propertyConstant(name, value) {
	  return function () {
	    this[name] = value;
	  };
	}

	function propertyFunction(name, value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];else this[name] = v;
	  };
	}

	function selection_property (name, value) {
	  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
	}

	function classArray(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList(node) {
	  return node.classList || new ClassList(node);
	}

	function ClassList(node) {
	  this._node = node;
	  this._names = classArray(node.getAttribute("class") || "");
	}

	ClassList.prototype = {
	  add: function (name) {
	    var i = this._names.indexOf(name);

	    if (i < 0) {
	      this._names.push(name);

	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  remove: function (name) {
	    var i = this._names.indexOf(name);

	    if (i >= 0) {
	      this._names.splice(i, 1);

	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  contains: function (name) {
	    return this._names.indexOf(name) >= 0;
	  }
	};

	function classedAdd(node, names) {
	  var list = classList(node),
	      i = -1,
	      n = names.length;

	  while (++i < n) list.add(names[i]);
	}

	function classedRemove(node, names) {
	  var list = classList(node),
	      i = -1,
	      n = names.length;

	  while (++i < n) list.remove(names[i]);
	}

	function classedTrue(names) {
	  return function () {
	    classedAdd(this, names);
	  };
	}

	function classedFalse(names) {
	  return function () {
	    classedRemove(this, names);
	  };
	}

	function classedFunction(names, value) {
	  return function () {
	    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	  };
	}

	function selection_classed (name, value) {
	  var names = classArray(name + "");

	  if (arguments.length < 2) {
	    var list = classList(this.node()),
	        i = -1,
	        n = names.length;

	    while (++i < n) if (!list.contains(names[i])) return false;

	    return true;
	  }

	  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
	}

	function textRemove() {
	  this.textContent = "";
	}

	function textConstant$1(value) {
	  return function () {
	    this.textContent = value;
	  };
	}

	function textFunction$1(value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	function selection_text (value) {
	  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction$1 : textConstant$1)(value)) : this.node().textContent;
	}

	function htmlRemove() {
	  this.innerHTML = "";
	}

	function htmlConstant(value) {
	  return function () {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction(value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	function selection_html (value) {
	  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
	}

	function raise() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	function selection_raise () {
	  return this.each(raise);
	}

	function lower() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	function selection_lower () {
	  return this.each(lower);
	}

	function selection_append (name) {
	  var create = typeof name === "function" ? name : creator(name);
	  return this.select(function () {
	    return this.appendChild(create.apply(this, arguments));
	  });
	}

	function constantNull() {
	  return null;
	}

	function selection_insert (name, before) {
	  var create = typeof name === "function" ? name : creator(name),
	      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	  return this.select(function () {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	}

	function remove() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	function selection_remove () {
	  return this.each(remove);
	}

	function selection_cloneShallow() {
	  var clone = this.cloneNode(false),
	      parent = this.parentNode;
	  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
	}

	function selection_cloneDeep() {
	  var clone = this.cloneNode(true),
	      parent = this.parentNode;
	  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
	}

	function selection_clone (deep) {
	  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
	}

	function selection_datum (value) {
	  return arguments.length ? this.property("__data__", value) : this.node().__data__;
	}

	function contextListener(listener) {
	  return function (event) {
	    listener.call(this, event, this.__data__);
	  };
	}

	function parseTypenames(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function (t) {
	    var name = "",
	        i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return {
	      type: t,
	      name: name
	    };
	  });
	}

	function onRemove(typename) {
	  return function () {
	    var on = this.__on;
	    if (!on) return;

	    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.options);
	      } else {
	        on[++i] = o;
	      }
	    }

	    if (++i) on.length = i;else delete this.__on;
	  };
	}

	function onAdd(typename, value, options) {
	  return function () {
	    var on = this.__on,
	        o,
	        listener = contextListener(value);
	    if (on) for (var j = 0, m = on.length; j < m; ++j) {
	      if ((o = on[j]).type === typename.type && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.options);
	        this.addEventListener(o.type, o.listener = listener, o.options = options);
	        o.value = value;
	        return;
	      }
	    }
	    this.addEventListener(typename.type, listener, options);
	    o = {
	      type: typename.type,
	      name: typename.name,
	      value: value,
	      listener: listener,
	      options: options
	    };
	    if (!on) this.__on = [o];else on.push(o);
	  };
	}

	function selection_on (typename, value, options) {
	  var typenames = parseTypenames(typename + ""),
	      i,
	      n = typenames.length,
	      t;

	  if (arguments.length < 2) {
	    var on = this.node().__on;

	    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	      for (i = 0, o = on[j]; i < n; ++i) {
	        if ((t = typenames[i]).type === o.type && t.name === o.name) {
	          return o.value;
	        }
	      }
	    }
	    return;
	  }

	  on = value ? onAdd : onRemove;

	  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));

	  return this;
	}

	function dispatchEvent(node, type, params) {
	  var window = defaultView(node),
	      event = window.CustomEvent;

	  if (typeof event === "function") {
	    event = new event(type, params);
	  } else {
	    event = window.document.createEvent("Event");
	    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
	  }

	  node.dispatchEvent(event);
	}

	function dispatchConstant(type, params) {
	  return function () {
	    return dispatchEvent(this, type, params);
	  };
	}

	function dispatchFunction(type, params) {
	  return function () {
	    return dispatchEvent(this, type, params.apply(this, arguments));
	  };
	}

	function selection_dispatch (type, params) {
	  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
	}

	function* selection_iterator () {
	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) yield node;
	    }
	  }
	}

	var root = [null];
	function Selection$1(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection$1([[document.documentElement]], root);
	}

	function selection_selection() {
	  return this;
	}

	Selection$1.prototype = selection.prototype = {
	  constructor: Selection$1,
	  select: selection_select,
	  selectAll: selection_selectAll,
	  selectChild: selection_selectChild,
	  selectChildren: selection_selectChildren,
	  filter: selection_filter,
	  data: selection_data,
	  enter: selection_enter,
	  exit: selection_exit,
	  join: selection_join,
	  merge: selection_merge,
	  selection: selection_selection,
	  order: selection_order,
	  sort: selection_sort,
	  call: selection_call,
	  nodes: selection_nodes,
	  node: selection_node,
	  size: selection_size,
	  empty: selection_empty,
	  each: selection_each,
	  attr: selection_attr,
	  style: selection_style,
	  property: selection_property,
	  classed: selection_classed,
	  text: selection_text,
	  html: selection_html,
	  raise: selection_raise,
	  lower: selection_lower,
	  append: selection_append,
	  insert: selection_insert,
	  remove: selection_remove,
	  clone: selection_clone,
	  datum: selection_datum,
	  on: selection_on,
	  dispatch: selection_dispatch,
	  [Symbol.iterator]: selection_iterator
	};

	function select (selector) {
	  return typeof selector === "string" ? new Selection$1([[document.querySelector(selector)]], [document.documentElement]) : new Selection$1([[selector]], root);
	}

	function sourceEvent (event) {
	  let sourceEvent;

	  while (sourceEvent = event.sourceEvent) event = sourceEvent;

	  return event;
	}

	function pointer (event, node) {
	  event = sourceEvent(event);
	  if (node === undefined) node = event.currentTarget;

	  if (node) {
	    var svg = node.ownerSVGElement || node;

	    if (svg.createSVGPoint) {
	      var point = svg.createSVGPoint();
	      point.x = event.clientX, point.y = event.clientY;
	      point = point.matrixTransform(node.getScreenCTM().inverse());
	      return [point.x, point.y];
	    }

	    if (node.getBoundingClientRect) {
	      var rect = node.getBoundingClientRect();
	      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
	    }
	  }

	  return [event.pageX, event.pageY];
	}

	// These are typically used in conjunction with noevent to ensure that we can
	// preventDefault on the event.
	const nonpassive = {
	  passive: false
	};
	const nonpassivecapture = {
	  capture: true,
	  passive: false
	};
	function nopropagation$1(event) {
	  event.stopImmediatePropagation();
	}
	function noevent$1 (event) {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}

	function dragDisable (view) {
	  var root = view.document.documentElement,
	      selection = select(view).on("dragstart.drag", noevent$1, nonpassivecapture);

	  if ("onselectstart" in root) {
	    selection.on("selectstart.drag", noevent$1, nonpassivecapture);
	  } else {
	    root.__noselect = root.style.MozUserSelect;
	    root.style.MozUserSelect = "none";
	  }
	}
	function yesdrag(view, noclick) {
	  var root = view.document.documentElement,
	      selection = select(view).on("dragstart.drag", null);

	  if (noclick) {
	    selection.on("click.drag", noevent$1, nonpassivecapture);
	    setTimeout(function () {
	      selection.on("click.drag", null);
	    }, 0);
	  }

	  if ("onselectstart" in root) {
	    selection.on("selectstart.drag", null);
	  } else {
	    root.style.MozUserSelect = root.__noselect;
	    delete root.__noselect;
	  }
	}

	var constant$5 = (x => () => x);

	function DragEvent(type, {
	  sourceEvent,
	  subject,
	  target,
	  identifier,
	  active,
	  x,
	  y,
	  dx,
	  dy,
	  dispatch
	}) {
	  Object.defineProperties(this, {
	    type: {
	      value: type,
	      enumerable: true,
	      configurable: true
	    },
	    sourceEvent: {
	      value: sourceEvent,
	      enumerable: true,
	      configurable: true
	    },
	    subject: {
	      value: subject,
	      enumerable: true,
	      configurable: true
	    },
	    target: {
	      value: target,
	      enumerable: true,
	      configurable: true
	    },
	    identifier: {
	      value: identifier,
	      enumerable: true,
	      configurable: true
	    },
	    active: {
	      value: active,
	      enumerable: true,
	      configurable: true
	    },
	    x: {
	      value: x,
	      enumerable: true,
	      configurable: true
	    },
	    y: {
	      value: y,
	      enumerable: true,
	      configurable: true
	    },
	    dx: {
	      value: dx,
	      enumerable: true,
	      configurable: true
	    },
	    dy: {
	      value: dy,
	      enumerable: true,
	      configurable: true
	    },
	    _: {
	      value: dispatch
	    }
	  });
	}

	DragEvent.prototype.on = function () {
	  var value = this._.on.apply(this._, arguments);

	  return value === this._ ? this : value;
	};

	function defaultFilter$1(event) {
	  return !event.ctrlKey && !event.button;
	}

	function defaultContainer() {
	  return this.parentNode;
	}

	function defaultSubject(event, d) {
	  return d == null ? {
	    x: event.x,
	    y: event.y
	  } : d;
	}

	function defaultTouchable$1() {
	  return navigator.maxTouchPoints || "ontouchstart" in this;
	}

	function d3drag () {
	  var filter = defaultFilter$1,
	      container = defaultContainer,
	      subject = defaultSubject,
	      touchable = defaultTouchable$1,
	      gestures = {},
	      listeners = dispatch("start", "drag", "end"),
	      active = 0,
	      mousedownx,
	      mousedowny,
	      mousemoving,
	      touchending,
	      clickDistance2 = 0;

	  function drag(selection) {
	    selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	  }

	  function mousedowned(event, d) {
	    if (touchending || !filter.call(this, event, d)) return;
	    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
	    if (!gesture) return;
	    select(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
	    dragDisable(event.view);
	    nopropagation$1(event);
	    mousemoving = false;
	    mousedownx = event.clientX;
	    mousedowny = event.clientY;
	    gesture("start", event);
	  }

	  function mousemoved(event) {
	    noevent$1(event);

	    if (!mousemoving) {
	      var dx = event.clientX - mousedownx,
	          dy = event.clientY - mousedowny;
	      mousemoving = dx * dx + dy * dy > clickDistance2;
	    }

	    gestures.mouse("drag", event);
	  }

	  function mouseupped(event) {
	    select(event.view).on("mousemove.drag mouseup.drag", null);
	    yesdrag(event.view, mousemoving);
	    noevent$1(event);
	    gestures.mouse("end", event);
	  }

	  function touchstarted(event, d) {
	    if (!filter.call(this, event, d)) return;
	    var touches = event.changedTouches,
	        c = container.call(this, event, d),
	        n = touches.length,
	        i,
	        gesture;

	    for (i = 0; i < n; ++i) {
	      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
	        nopropagation$1(event);
	        gesture("start", event, touches[i]);
	      }
	    }
	  }

	  function touchmoved(event) {
	    var touches = event.changedTouches,
	        n = touches.length,
	        i,
	        gesture;

	    for (i = 0; i < n; ++i) {
	      if (gesture = gestures[touches[i].identifier]) {
	        noevent$1(event);
	        gesture("drag", event, touches[i]);
	      }
	    }
	  }

	  function touchended(event) {
	    var touches = event.changedTouches,
	        n = touches.length,
	        i,
	        gesture;
	    if (touchending) clearTimeout(touchending);
	    touchending = setTimeout(function () {
	      touchending = null;
	    }, 500); // Ghost clicks are delayed!

	    for (i = 0; i < n; ++i) {
	      if (gesture = gestures[touches[i].identifier]) {
	        nopropagation$1(event);
	        gesture("end", event, touches[i]);
	      }
	    }
	  }

	  function beforestart(that, container, event, d, identifier, touch) {
	    var dispatch = listeners.copy(),
	        p = pointer(touch || event, container),
	        dx,
	        dy,
	        s;
	    if ((s = subject.call(that, new DragEvent("beforestart", {
	      sourceEvent: event,
	      target: drag,
	      identifier,
	      active,
	      x: p[0],
	      y: p[1],
	      dx: 0,
	      dy: 0,
	      dispatch
	    }), d)) == null) return;
	    dx = s.x - p[0] || 0;
	    dy = s.y - p[1] || 0;
	    return function gesture(type, event, touch) {
	      var p0 = p,
	          n;

	      switch (type) {
	        case "start":
	          gestures[identifier] = gesture, n = active++;
	          break;

	        case "end":
	          delete gestures[identifier], --active;
	        // falls through

	        case "drag":
	          p = pointer(touch || event, container), n = active;
	          break;
	      }

	      dispatch.call(type, that, new DragEvent(type, {
	        sourceEvent: event,
	        subject: s,
	        target: drag,
	        identifier,
	        active: n,
	        x: p[0] + dx,
	        y: p[1] + dy,
	        dx: p[0] - p0[0],
	        dy: p[1] - p0[1],
	        dispatch
	      }), d);
	    };
	  }

	  drag.filter = function (_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$5(!!_), drag) : filter;
	  };

	  drag.container = function (_) {
	    return arguments.length ? (container = typeof _ === "function" ? _ : constant$5(_), drag) : container;
	  };

	  drag.subject = function (_) {
	    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$5(_), drag) : subject;
	  };

	  drag.touchable = function (_) {
	    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$5(!!_), drag) : touchable;
	  };

	  drag.on = function () {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? drag : value;
	  };

	  drag.clickDistance = function (_) {
	    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
	  };

	  return drag;
	}

	var EOL = {},
	    EOF = {},
	    QUOTE = 34,
	    NEWLINE = 10,
	    RETURN = 13;

	function objectConverter(columns) {
	  return new Function("d", "return {" + columns.map(function (name, i) {
	    return JSON.stringify(name) + ": d[" + i + "] || \"\"";
	  }).join(",") + "}");
	}

	function customConverter(columns, f) {
	  var object = objectConverter(columns);
	  return function (row, i) {
	    return f(object(row), i, columns);
	  };
	} // Compute unique columns in order of discovery.


	function inferColumns(rows) {
	  var columnSet = Object.create(null),
	      columns = [];
	  rows.forEach(function (row) {
	    for (var column in row) {
	      if (!(column in columnSet)) {
	        columns.push(columnSet[column] = column);
	      }
	    }
	  });
	  return columns;
	}

	function pad(value, width) {
	  var s = value + "",
	      length = s.length;
	  return length < width ? new Array(width - length + 1).join(0) + s : s;
	}

	function formatYear(year) {
	  return year < 0 ? "-" + pad(-year, 6) : year > 9999 ? "+" + pad(year, 6) : pad(year, 4);
	}

	function formatDate(date) {
	  var hours = date.getUTCHours(),
	      minutes = date.getUTCMinutes(),
	      seconds = date.getUTCSeconds(),
	      milliseconds = date.getUTCMilliseconds();
	  return isNaN(date) ? "Invalid Date" : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2) + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z" : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z" : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z" : "");
	}

	function dsvFormat (delimiter) {
	  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
	      DELIMITER = delimiter.charCodeAt(0);

	  function parse(text, f) {
	    var convert,
	        columns,
	        rows = parseRows(text, function (row, i) {
	      if (convert) return convert(row, i - 1);
	      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
	    });
	    rows.columns = columns || [];
	    return rows;
	  }

	  function parseRows(text, f) {
	    var rows = [],
	        // output rows
	    N = text.length,
	        I = 0,
	        // current character index
	    n = 0,
	        // current line number
	    t,
	        // current token
	    eof = N <= 0,
	        // current token followed by EOF?
	    eol = false; // current token followed by EOL?
	    // Strip the trailing newline.

	    if (text.charCodeAt(N - 1) === NEWLINE) --N;
	    if (text.charCodeAt(N - 1) === RETURN) --N;

	    function token() {
	      if (eof) return EOF;
	      if (eol) return eol = false, EOL; // Unescape quotes.

	      var i,
	          j = I,
	          c;

	      if (text.charCodeAt(j) === QUOTE) {
	        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);

	        if ((i = I) >= N) eof = true;else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;else if (c === RETURN) {
	          eol = true;
	          if (text.charCodeAt(I) === NEWLINE) ++I;
	        }
	        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
	      } // Find next delimiter or newline.


	      while (I < N) {
	        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;else if (c === RETURN) {
	          eol = true;
	          if (text.charCodeAt(I) === NEWLINE) ++I;
	        } else if (c !== DELIMITER) continue;
	        return text.slice(j, i);
	      } // Return last token before EOF.


	      return eof = true, text.slice(j, N);
	    }

	    while ((t = token()) !== EOF) {
	      var row = [];

	      while (t !== EOL && t !== EOF) row.push(t), t = token();

	      if (f && (row = f(row, n++)) == null) continue;
	      rows.push(row);
	    }

	    return rows;
	  }

	  function preformatBody(rows, columns) {
	    return rows.map(function (row) {
	      return columns.map(function (column) {
	        return formatValue(row[column]);
	      }).join(delimiter);
	    });
	  }

	  function format(rows, columns) {
	    if (columns == null) columns = inferColumns(rows);
	    return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
	  }

	  function formatBody(rows, columns) {
	    if (columns == null) columns = inferColumns(rows);
	    return preformatBody(rows, columns).join("\n");
	  }

	  function formatRows(rows) {
	    return rows.map(formatRow).join("\n");
	  }

	  function formatRow(row) {
	    return row.map(formatValue).join(delimiter);
	  }

	  function formatValue(value) {
	    return value == null ? "" : value instanceof Date ? formatDate(value) : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\"" : value;
	  }

	  return {
	    parse: parse,
	    parseRows: parseRows,
	    format: format,
	    formatBody: formatBody,
	    formatRows: formatRows,
	    formatRow: formatRow,
	    formatValue: formatValue
	  };
	}

	var csv$1 = dsvFormat(",");
	var csvParse = csv$1.parse;

	function responseText(response) {
	  if (!response.ok) throw new Error(response.status + " " + response.statusText);
	  return response.text();
	}

	function text (input, init) {
	  return fetch(input, init).then(responseText);
	}

	function dsvParse(parse) {
	  return function (input, init, row) {
	    if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
	    return text(input, init).then(function (response) {
	      return parse(response, row);
	    });
	  };
	}
	var csv = dsvParse(csvParse);

	function tree_add (d) {
	  const x = +this._x.call(null, d),
	        y = +this._y.call(null, d);
	  return add(this.cover(x, y), x, y, d);
	}

	function add(tree, x, y, d) {
	  if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

	  var parent,
	      node = tree._root,
	      leaf = {
	    data: d
	  },
	      x0 = tree._x0,
	      y0 = tree._y0,
	      x1 = tree._x1,
	      y1 = tree._y1,
	      xm,
	      ym,
	      xp,
	      yp,
	      right,
	      bottom,
	      i,
	      j; // If the tree is empty, initialize the root as a leaf.

	  if (!node) return tree._root = leaf, tree; // Find the existing leaf for the new point, or add it.

	  while (node.length) {
	    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
	    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
	    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
	  } // Is the new point is exactly coincident with the existing point?


	  xp = +tree._x.call(null, node.data);
	  yp = +tree._y.call(null, node.data);
	  if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree; // Otherwise, split the leaf node until the old and new point are separated.

	  do {
	    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
	    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
	    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
	  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));

	  return parent[j] = node, parent[i] = leaf, tree;
	}

	function addAll(data) {
	  var d,
	      i,
	      n = data.length,
	      x,
	      y,
	      xz = new Array(n),
	      yz = new Array(n),
	      x0 = Infinity,
	      y0 = Infinity,
	      x1 = -Infinity,
	      y1 = -Infinity; // Compute the points and their extent.

	  for (i = 0; i < n; ++i) {
	    if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
	    xz[i] = x;
	    yz[i] = y;
	    if (x < x0) x0 = x;
	    if (x > x1) x1 = x;
	    if (y < y0) y0 = y;
	    if (y > y1) y1 = y;
	  } // If there were no (valid) points, abort.


	  if (x0 > x1 || y0 > y1) return this; // Expand the tree to cover the new points.

	  this.cover(x0, y0).cover(x1, y1); // Add the new points.

	  for (i = 0; i < n; ++i) {
	    add(this, xz[i], yz[i], data[i]);
	  }

	  return this;
	}

	function tree_cover (x, y) {
	  if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

	  var x0 = this._x0,
	      y0 = this._y0,
	      x1 = this._x1,
	      y1 = this._y1; // If the quadtree has no extent, initialize them.
	  // Integer extent are necessary so that if we later double the extent,
	  // the existing quadrant boundaries don’t change due to floating point error!

	  if (isNaN(x0)) {
	    x1 = (x0 = Math.floor(x)) + 1;
	    y1 = (y0 = Math.floor(y)) + 1;
	  } // Otherwise, double repeatedly to cover.
	  else {
	    var z = x1 - x0 || 1,
	        node = this._root,
	        parent,
	        i;

	    while (x0 > x || x >= x1 || y0 > y || y >= y1) {
	      i = (y < y0) << 1 | x < x0;
	      parent = new Array(4), parent[i] = node, node = parent, z *= 2;

	      switch (i) {
	        case 0:
	          x1 = x0 + z, y1 = y0 + z;
	          break;

	        case 1:
	          x0 = x1 - z, y1 = y0 + z;
	          break;

	        case 2:
	          x1 = x0 + z, y0 = y1 - z;
	          break;

	        case 3:
	          x0 = x1 - z, y0 = y1 - z;
	          break;
	      }
	    }

	    if (this._root && this._root.length) this._root = node;
	  }

	  this._x0 = x0;
	  this._y0 = y0;
	  this._x1 = x1;
	  this._y1 = y1;
	  return this;
	}

	function tree_data () {
	  var data = [];
	  this.visit(function (node) {
	    if (!node.length) do data.push(node.data); while (node = node.next);
	  });
	  return data;
	}

	function tree_extent (_) {
	  return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
	}

	function Quad (node, x0, y0, x1, y1) {
	  this.node = node;
	  this.x0 = x0;
	  this.y0 = y0;
	  this.x1 = x1;
	  this.y1 = y1;
	}

	function tree_find (x, y, radius) {
	  var data,
	      x0 = this._x0,
	      y0 = this._y0,
	      x1,
	      y1,
	      x2,
	      y2,
	      x3 = this._x1,
	      y3 = this._y1,
	      quads = [],
	      node = this._root,
	      q,
	      i;
	  if (node) quads.push(new Quad(node, x0, y0, x3, y3));
	  if (radius == null) radius = Infinity;else {
	    x0 = x - radius, y0 = y - radius;
	    x3 = x + radius, y3 = y + radius;
	    radius *= radius;
	  }

	  while (q = quads.pop()) {
	    // Stop searching if this quadrant can’t contain a closer node.
	    if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x2 = q.x1) < x0 || (y2 = q.y1) < y0) continue; // Bisect the current quadrant.

	    if (node.length) {
	      var xm = (x1 + x2) / 2,
	          ym = (y1 + y2) / 2;
	      quads.push(new Quad(node[3], xm, ym, x2, y2), new Quad(node[2], x1, ym, xm, y2), new Quad(node[1], xm, y1, x2, ym), new Quad(node[0], x1, y1, xm, ym)); // Visit the closest quadrant first.

	      if (i = (y >= ym) << 1 | x >= xm) {
	        q = quads[quads.length - 1];
	        quads[quads.length - 1] = quads[quads.length - 1 - i];
	        quads[quads.length - 1 - i] = q;
	      }
	    } // Visit this point. (Visiting coincident points isn’t necessary!)
	    else {
	      var dx = x - +this._x.call(null, node.data),
	          dy = y - +this._y.call(null, node.data),
	          d2 = dx * dx + dy * dy;

	      if (d2 < radius) {
	        var d = Math.sqrt(radius = d2);
	        x0 = x - d, y0 = y - d;
	        x3 = x + d, y3 = y + d;
	        data = node.data;
	      }
	    }
	  }

	  return data;
	}

	function tree_remove (d) {
	  if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

	  var parent,
	      node = this._root,
	      retainer,
	      previous,
	      next,
	      x0 = this._x0,
	      y0 = this._y0,
	      x1 = this._x1,
	      y1 = this._y1,
	      x,
	      y,
	      xm,
	      ym,
	      right,
	      bottom,
	      i,
	      j; // If the tree is empty, initialize the root as a leaf.

	  if (!node) return this; // Find the leaf node for the point.
	  // While descending, also retain the deepest parent with a non-removed sibling.

	  if (node.length) while (true) {
	    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
	    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
	    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
	    if (!node.length) break;
	    if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
	  } // Find the point to remove.

	  while (node.data !== d) if (!(previous = node, node = node.next)) return this;

	  if (next = node.next) delete node.next; // If there are multiple coincident points, remove just the point.

	  if (previous) return next ? previous.next = next : delete previous.next, this; // If this is the root point, remove it.

	  if (!parent) return this._root = next, this; // Remove this leaf.

	  next ? parent[i] = next : delete parent[i]; // If the parent now contains exactly one leaf, collapse superfluous parents.

	  if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
	    if (retainer) retainer[j] = node;else this._root = node;
	  }

	  return this;
	}
	function removeAll(data) {
	  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);

	  return this;
	}

	function tree_root () {
	  return this._root;
	}

	function tree_size () {
	  var size = 0;
	  this.visit(function (node) {
	    if (!node.length) do ++size; while (node = node.next);
	  });
	  return size;
	}

	function tree_visit (callback) {
	  var quads = [],
	      q,
	      node = this._root,
	      child,
	      x0,
	      y0,
	      x1,
	      y1;
	  if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));

	  while (q = quads.pop()) {
	    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
	      var xm = (x0 + x1) / 2,
	          ym = (y0 + y1) / 2;
	      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
	      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
	      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
	      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
	    }
	  }

	  return this;
	}

	function tree_visitAfter (callback) {
	  var quads = [],
	      next = [],
	      q;
	  if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));

	  while (q = quads.pop()) {
	    var node = q.node;

	    if (node.length) {
	      var child,
	          x0 = q.x0,
	          y0 = q.y0,
	          x1 = q.x1,
	          y1 = q.y1,
	          xm = (x0 + x1) / 2,
	          ym = (y0 + y1) / 2;
	      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
	      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
	      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
	      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
	    }

	    next.push(q);
	  }

	  while (q = next.pop()) {
	    callback(q.node, q.x0, q.y0, q.x1, q.y1);
	  }

	  return this;
	}

	function defaultX(d) {
	  return d[0];
	}
	function tree_x (_) {
	  return arguments.length ? (this._x = _, this) : this._x;
	}

	function defaultY(d) {
	  return d[1];
	}
	function tree_y (_) {
	  return arguments.length ? (this._y = _, this) : this._y;
	}

	function quadtree(nodes, x, y) {
	  var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
	  return nodes == null ? tree : tree.addAll(nodes);
	}

	function Quadtree(x, y, x0, y0, x1, y1) {
	  this._x = x;
	  this._y = y;
	  this._x0 = x0;
	  this._y0 = y0;
	  this._x1 = x1;
	  this._y1 = y1;
	  this._root = undefined;
	}

	function leaf_copy(leaf) {
	  var copy = {
	    data: leaf.data
	  },
	      next = copy;

	  while (leaf = leaf.next) next = next.next = {
	    data: leaf.data
	  };

	  return copy;
	}

	var treeProto = quadtree.prototype = Quadtree.prototype;

	treeProto.copy = function () {
	  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
	      node = this._root,
	      nodes,
	      child;
	  if (!node) return copy;
	  if (!node.length) return copy._root = leaf_copy(node), copy;
	  nodes = [{
	    source: node,
	    target: copy._root = new Array(4)
	  }];

	  while (node = nodes.pop()) {
	    for (var i = 0; i < 4; ++i) {
	      if (child = node.source[i]) {
	        if (child.length) nodes.push({
	          source: child,
	          target: node.target[i] = new Array(4)
	        });else node.target[i] = leaf_copy(child);
	      }
	    }
	  }

	  return copy;
	};

	treeProto.add = tree_add;
	treeProto.addAll = addAll;
	treeProto.cover = tree_cover;
	treeProto.data = tree_data;
	treeProto.extent = tree_extent;
	treeProto.find = tree_find;
	treeProto.remove = tree_remove;
	treeProto.removeAll = removeAll;
	treeProto.root = tree_root;
	treeProto.size = tree_size;
	treeProto.visit = tree_visit;
	treeProto.visitAfter = tree_visitAfter;
	treeProto.x = tree_x;
	treeProto.y = tree_y;

	function constant$4 (x) {
	  return function () {
	    return x;
	  };
	}

	function jiggle (random) {
	  return (random() - 0.5) * 1e-6;
	}

	function index$1(d) {
	  return d.index;
	}

	function find(nodeById, nodeId) {
	  var node = nodeById.get(nodeId);
	  if (!node) throw new Error("node not found: " + nodeId);
	  return node;
	}

	function link$1 (links) {
	  var id = index$1,
	      strength = defaultStrength,
	      strengths,
	      distance = constant$4(30),
	      distances,
	      nodes,
	      count,
	      bias,
	      random,
	      iterations = 1;
	  if (links == null) links = [];

	  function defaultStrength(link) {
	    return 1 / Math.min(count[link.source.index], count[link.target.index]);
	  }

	  function force(alpha) {
	    for (var k = 0, n = links.length; k < iterations; ++k) {
	      for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
	        link = links[i], source = link.source, target = link.target;
	        x = target.x + target.vx - source.x - source.vx || jiggle(random);
	        y = target.y + target.vy - source.y - source.vy || jiggle(random);
	        l = Math.sqrt(x * x + y * y);
	        l = (l - distances[i]) / l * alpha * strengths[i];
	        x *= l, y *= l;
	        target.vx -= x * (b = bias[i]);
	        target.vy -= y * b;
	        source.vx += x * (b = 1 - b);
	        source.vy += y * b;
	      }
	    }
	  }

	  function initialize() {
	    if (!nodes) return;
	    var i,
	        n = nodes.length,
	        m = links.length,
	        nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d])),
	        link;

	    for (i = 0, count = new Array(n); i < m; ++i) {
	      link = links[i], link.index = i;
	      if (typeof link.source !== "object") link.source = find(nodeById, link.source);
	      if (typeof link.target !== "object") link.target = find(nodeById, link.target);
	      count[link.source.index] = (count[link.source.index] || 0) + 1;
	      count[link.target.index] = (count[link.target.index] || 0) + 1;
	    }

	    for (i = 0, bias = new Array(m); i < m; ++i) {
	      link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
	    }

	    strengths = new Array(m), initializeStrength();
	    distances = new Array(m), initializeDistance();
	  }

	  function initializeStrength() {
	    if (!nodes) return;

	    for (var i = 0, n = links.length; i < n; ++i) {
	      strengths[i] = +strength(links[i], i, links);
	    }
	  }

	  function initializeDistance() {
	    if (!nodes) return;

	    for (var i = 0, n = links.length; i < n; ++i) {
	      distances[i] = +distance(links[i], i, links);
	    }
	  }

	  force.initialize = function (_nodes, _random) {
	    nodes = _nodes;
	    random = _random;
	    initialize();
	  };

	  force.links = function (_) {
	    return arguments.length ? (links = _, initialize(), force) : links;
	  };

	  force.id = function (_) {
	    return arguments.length ? (id = _, force) : id;
	  };

	  force.iterations = function (_) {
	    return arguments.length ? (iterations = +_, force) : iterations;
	  };

	  force.strength = function (_) {
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$4(+_), initializeStrength(), force) : strength;
	  };

	  force.distance = function (_) {
	    return arguments.length ? (distance = typeof _ === "function" ? _ : constant$4(+_), initializeDistance(), force) : distance;
	  };

	  return force;
	}

	var frame = 0,
	    // is an animation frame pending?
	timeout$1 = 0,
	    // is a timeout pending?
	interval = 0,
	    // are any timers active?
	pokeDelay = 1000,
	    // how frequently we check for clock skew
	taskHead,
	    taskTail,
	    clockLast = 0,
	    clockNow = 0,
	    clockSkew = 0,
	    clock = typeof performance === "object" && performance.now ? performance : Date,
	    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) {
	  setTimeout(f, 17);
	};
	function now() {
	  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
	}

	function clearNow() {
	  clockNow = 0;
	}

	function Timer() {
	  this._call = this._time = this._next = null;
	}
	Timer.prototype = timer.prototype = {
	  constructor: Timer,
	  restart: function (callback, delay, time) {
	    if (typeof callback !== "function") throw new TypeError("callback is not a function");
	    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);

	    if (!this._next && taskTail !== this) {
	      if (taskTail) taskTail._next = this;else taskHead = this;
	      taskTail = this;
	    }

	    this._call = callback;
	    this._time = time;
	    sleep();
	  },
	  stop: function () {
	    if (this._call) {
	      this._call = null;
	      this._time = Infinity;
	      sleep();
	    }
	  }
	};
	function timer(callback, delay, time) {
	  var t = new Timer();
	  t.restart(callback, delay, time);
	  return t;
	}
	function timerFlush() {
	  now(); // Get the current time, if not already set.

	  ++frame; // Pretend we’ve set an alarm, if we haven’t already.

	  var t = taskHead,
	      e;

	  while (t) {
	    if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
	    t = t._next;
	  }

	  --frame;
	}

	function wake() {
	  clockNow = (clockLast = clock.now()) + clockSkew;
	  frame = timeout$1 = 0;

	  try {
	    timerFlush();
	  } finally {
	    frame = 0;
	    nap();
	    clockNow = 0;
	  }
	}

	function poke() {
	  var now = clock.now(),
	      delay = now - clockLast;
	  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
	}

	function nap() {
	  var t0,
	      t1 = taskHead,
	      t2,
	      time = Infinity;

	  while (t1) {
	    if (t1._call) {
	      if (time > t1._time) time = t1._time;
	      t0 = t1, t1 = t1._next;
	    } else {
	      t2 = t1._next, t1._next = null;
	      t1 = t0 ? t0._next = t2 : taskHead = t2;
	    }
	  }

	  taskTail = t0;
	  sleep(time);
	}

	function sleep(time) {
	  if (frame) return; // Soonest alarm already set, or will be.

	  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
	  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.

	  if (delay > 24) {
	    if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
	    if (interval) interval = clearInterval(interval);
	  } else {
	    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
	    frame = 1, setFrame(wake);
	  }
	}

	function timeout (callback, delay, time) {
	  var t = new Timer();
	  delay = delay == null ? 0 : +delay;
	  t.restart(elapsed => {
	    t.stop();
	    callback(elapsed + delay);
	  }, delay, time);
	  return t;
	}

	// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
	const a = 1664525;
	const c$1 = 1013904223;
	const m = 4294967296; // 2^32

	function lcg () {
	  let s = 1;
	  return () => (s = (a * s + c$1) % m) / m;
	}

	function x$2(d) {
	  return d.x;
	}
	function y$2(d) {
	  return d.y;
	}
	var initialRadius = 10,
	    initialAngle = Math.PI * (3 - Math.sqrt(5));
	function simulation (nodes) {
	  var simulation,
	      alpha = 1,
	      alphaMin = 0.001,
	      alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
	      alphaTarget = 0,
	      velocityDecay = 0.6,
	      forces = new Map(),
	      stepper = timer(step),
	      event = dispatch("tick", "end"),
	      random = lcg();
	  if (nodes == null) nodes = [];

	  function step() {
	    tick();
	    event.call("tick", simulation);

	    if (alpha < alphaMin) {
	      stepper.stop();
	      event.call("end", simulation);
	    }
	  }

	  function tick(iterations) {
	    var i,
	        n = nodes.length,
	        node;
	    if (iterations === undefined) iterations = 1;

	    for (var k = 0; k < iterations; ++k) {
	      alpha += (alphaTarget - alpha) * alphaDecay;
	      forces.forEach(function (force) {
	        force(alpha);
	      });

	      for (i = 0; i < n; ++i) {
	        node = nodes[i];
	        if (node.fx == null) node.x += node.vx *= velocityDecay;else node.x = node.fx, node.vx = 0;
	        if (node.fy == null) node.y += node.vy *= velocityDecay;else node.y = node.fy, node.vy = 0;
	      }
	    }

	    return simulation;
	  }

	  function initializeNodes() {
	    for (var i = 0, n = nodes.length, node; i < n; ++i) {
	      node = nodes[i], node.index = i;
	      if (node.fx != null) node.x = node.fx;
	      if (node.fy != null) node.y = node.fy;

	      if (isNaN(node.x) || isNaN(node.y)) {
	        var radius = initialRadius * Math.sqrt(0.5 + i),
	            angle = i * initialAngle;
	        node.x = radius * Math.cos(angle);
	        node.y = radius * Math.sin(angle);
	      }

	      if (isNaN(node.vx) || isNaN(node.vy)) {
	        node.vx = node.vy = 0;
	      }
	    }
	  }

	  function initializeForce(force) {
	    if (force.initialize) force.initialize(nodes, random);
	    return force;
	  }

	  initializeNodes();
	  return simulation = {
	    tick: tick,
	    restart: function () {
	      return stepper.restart(step), simulation;
	    },
	    stop: function () {
	      return stepper.stop(), simulation;
	    },
	    nodes: function (_) {
	      return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
	    },
	    alpha: function (_) {
	      return arguments.length ? (alpha = +_, simulation) : alpha;
	    },
	    alphaMin: function (_) {
	      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
	    },
	    alphaDecay: function (_) {
	      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
	    },
	    alphaTarget: function (_) {
	      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
	    },
	    velocityDecay: function (_) {
	      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
	    },
	    randomSource: function (_) {
	      return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
	    },
	    force: function (name, _) {
	      return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation) : forces.get(name);
	    },
	    find: function (x, y, radius) {
	      var i = 0,
	          n = nodes.length,
	          dx,
	          dy,
	          d2,
	          node,
	          closest;
	      if (radius == null) radius = Infinity;else radius *= radius;

	      for (i = 0; i < n; ++i) {
	        node = nodes[i];
	        dx = x - node.x;
	        dy = y - node.y;
	        d2 = dx * dx + dy * dy;
	        if (d2 < radius) closest = node, radius = d2;
	      }

	      return closest;
	    },
	    on: function (name, _) {
	      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
	    }
	  };
	}

	function manyBody () {
	  var nodes,
	      node,
	      random,
	      alpha,
	      strength = constant$4(-30),
	      strengths,
	      distanceMin2 = 1,
	      distanceMax2 = Infinity,
	      theta2 = 0.81;

	  function force(_) {
	    var i,
	        n = nodes.length,
	        tree = quadtree(nodes, x$2, y$2).visitAfter(accumulate);

	    for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
	  }

	  function initialize() {
	    if (!nodes) return;
	    var i,
	        n = nodes.length,
	        node;
	    strengths = new Array(n);

	    for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
	  }

	  function accumulate(quad) {
	    var strength = 0,
	        q,
	        c,
	        weight = 0,
	        x,
	        y,
	        i; // For internal nodes, accumulate forces from child quadrants.

	    if (quad.length) {
	      for (x = y = i = 0; i < 4; ++i) {
	        if ((q = quad[i]) && (c = Math.abs(q.value))) {
	          strength += q.value, weight += c, x += c * q.x, y += c * q.y;
	        }
	      }

	      quad.x = x / weight;
	      quad.y = y / weight;
	    } // For leaf nodes, accumulate forces from coincident quadrants.
	    else {
	      q = quad;
	      q.x = q.data.x;
	      q.y = q.data.y;

	      do strength += strengths[q.data.index]; while (q = q.next);
	    }

	    quad.value = strength;
	  }

	  function apply(quad, x1, _, x2) {
	    if (!quad.value) return true;
	    var x = quad.x - node.x,
	        y = quad.y - node.y,
	        w = x2 - x1,
	        l = x * x + y * y; // Apply the Barnes-Hut approximation if possible.
	    // Limit forces for very close nodes; randomize direction if coincident.

	    if (w * w / theta2 < l) {
	      if (l < distanceMax2) {
	        if (x === 0) x = jiggle(random), l += x * x;
	        if (y === 0) y = jiggle(random), l += y * y;
	        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
	        node.vx += x * quad.value * alpha / l;
	        node.vy += y * quad.value * alpha / l;
	      }

	      return true;
	    } // Otherwise, process points directly.
	    else if (quad.length || l >= distanceMax2) return; // Limit forces for very close nodes; randomize direction if coincident.


	    if (quad.data !== node || quad.next) {
	      if (x === 0) x = jiggle(random), l += x * x;
	      if (y === 0) y = jiggle(random), l += y * y;
	      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
	    }

	    do if (quad.data !== node) {
	      w = strengths[quad.data.index] * alpha / l;
	      node.vx += x * w;
	      node.vy += y * w;
	    } while (quad = quad.next);
	  }

	  force.initialize = function (_nodes, _random) {
	    nodes = _nodes;
	    random = _random;
	    initialize();
	  };

	  force.strength = function (_) {
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$4(+_), initialize(), force) : strength;
	  };

	  force.distanceMin = function (_) {
	    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
	  };

	  force.distanceMax = function (_) {
	    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
	  };

	  force.theta = function (_) {
	    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
	  };

	  return force;
	}

	function x$1 (x) {
	  var strength = constant$4(0.1),
	      nodes,
	      strengths,
	      xz;
	  if (typeof x !== "function") x = constant$4(x == null ? 0 : +x);

	  function force(alpha) {
	    for (var i = 0, n = nodes.length, node; i < n; ++i) {
	      node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
	    }
	  }

	  function initialize() {
	    if (!nodes) return;
	    var i,
	        n = nodes.length;
	    strengths = new Array(n);
	    xz = new Array(n);

	    for (i = 0; i < n; ++i) {
	      strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
	    }
	  }

	  force.initialize = function (_) {
	    nodes = _;
	    initialize();
	  };

	  force.strength = function (_) {
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$4(+_), initialize(), force) : strength;
	  };

	  force.x = function (_) {
	    return arguments.length ? (x = typeof _ === "function" ? _ : constant$4(+_), initialize(), force) : x;
	  };

	  return force;
	}

	function y$1 (y) {
	  var strength = constant$4(0.1),
	      nodes,
	      strengths,
	      yz;
	  if (typeof y !== "function") y = constant$4(y == null ? 0 : +y);

	  function force(alpha) {
	    for (var i = 0, n = nodes.length, node; i < n; ++i) {
	      node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
	    }
	  }

	  function initialize() {
	    if (!nodes) return;
	    var i,
	        n = nodes.length;
	    strengths = new Array(n);
	    yz = new Array(n);

	    for (i = 0; i < n; ++i) {
	      strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
	    }
	  }

	  force.initialize = function (_) {
	    nodes = _;
	    initialize();
	  };

	  force.strength = function (_) {
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$4(+_), initialize(), force) : strength;
	  };

	  force.y = function (_) {
	    return arguments.length ? (y = typeof _ === "function" ? _ : constant$4(+_), initialize(), force) : y;
	  };

	  return force;
	}

	function count(node) {
	  var sum = 0,
	      children = node.children,
	      i = children && children.length;
	  if (!i) sum = 1;else while (--i >= 0) sum += children[i].value;
	  node.value = sum;
	}

	function node_count () {
	  return this.eachAfter(count);
	}

	function node_each (callback, that) {
	  let index = -1;

	  for (const node of this) {
	    callback.call(that, node, ++index, this);
	  }

	  return this;
	}

	function node_eachBefore (callback, that) {
	  var node = this,
	      nodes = [node],
	      children,
	      i,
	      index = -1;

	  while (node = nodes.pop()) {
	    callback.call(that, node, ++index, this);

	    if (children = node.children) {
	      for (i = children.length - 1; i >= 0; --i) {
	        nodes.push(children[i]);
	      }
	    }
	  }

	  return this;
	}

	function node_eachAfter (callback, that) {
	  var node = this,
	      nodes = [node],
	      next = [],
	      children,
	      i,
	      n,
	      index = -1;

	  while (node = nodes.pop()) {
	    next.push(node);

	    if (children = node.children) {
	      for (i = 0, n = children.length; i < n; ++i) {
	        nodes.push(children[i]);
	      }
	    }
	  }

	  while (node = next.pop()) {
	    callback.call(that, node, ++index, this);
	  }

	  return this;
	}

	function node_find (callback, that) {
	  let index = -1;

	  for (const node of this) {
	    if (callback.call(that, node, ++index, this)) {
	      return node;
	    }
	  }
	}

	function node_sum (value) {
	  return this.eachAfter(function (node) {
	    var sum = +value(node.data) || 0,
	        children = node.children,
	        i = children && children.length;

	    while (--i >= 0) sum += children[i].value;

	    node.value = sum;
	  });
	}

	function node_sort (compare) {
	  return this.eachBefore(function (node) {
	    if (node.children) {
	      node.children.sort(compare);
	    }
	  });
	}

	function node_path (end) {
	  var start = this,
	      ancestor = leastCommonAncestor(start, end),
	      nodes = [start];

	  while (start !== ancestor) {
	    start = start.parent;
	    nodes.push(start);
	  }

	  var k = nodes.length;

	  while (end !== ancestor) {
	    nodes.splice(k, 0, end);
	    end = end.parent;
	  }

	  return nodes;
	}

	function leastCommonAncestor(a, b) {
	  if (a === b) return a;
	  var aNodes = a.ancestors(),
	      bNodes = b.ancestors(),
	      c = null;
	  a = aNodes.pop();
	  b = bNodes.pop();

	  while (a === b) {
	    c = a;
	    a = aNodes.pop();
	    b = bNodes.pop();
	  }

	  return c;
	}

	function node_ancestors () {
	  var node = this,
	      nodes = [node];

	  while (node = node.parent) {
	    nodes.push(node);
	  }

	  return nodes;
	}

	function node_descendants () {
	  return Array.from(this);
	}

	function node_leaves () {
	  var leaves = [];
	  this.eachBefore(function (node) {
	    if (!node.children) {
	      leaves.push(node);
	    }
	  });
	  return leaves;
	}

	function node_links () {
	  var root = this,
	      links = [];
	  root.each(function (node) {
	    if (node !== root) {
	      // Don’t include the root’s parent, if any.
	      links.push({
	        source: node.parent,
	        target: node
	      });
	    }
	  });
	  return links;
	}

	function* node_iterator () {
	  var node = this,
	      current,
	      next = [node],
	      children,
	      i,
	      n;

	  do {
	    current = next.reverse(), next = [];

	    while (node = current.pop()) {
	      yield node;

	      if (children = node.children) {
	        for (i = 0, n = children.length; i < n; ++i) {
	          next.push(children[i]);
	        }
	      }
	    }
	  } while (next.length);
	}

	function hierarchy(data, children) {
	  if (data instanceof Map) {
	    data = [undefined, data];
	    if (children === undefined) children = mapChildren;
	  } else if (children === undefined) {
	    children = objectChildren;
	  }

	  var root = new Node$1(data),
	      node,
	      nodes = [root],
	      child,
	      childs,
	      i,
	      n;

	  while (node = nodes.pop()) {
	    if ((childs = children(node.data)) && (n = (childs = Array.from(childs)).length)) {
	      node.children = childs;

	      for (i = n - 1; i >= 0; --i) {
	        nodes.push(child = childs[i] = new Node$1(childs[i]));
	        child.parent = node;
	        child.depth = node.depth + 1;
	      }
	    }
	  }

	  return root.eachBefore(computeHeight);
	}

	function node_copy() {
	  return hierarchy(this).eachBefore(copyData);
	}

	function objectChildren(d) {
	  return d.children;
	}

	function mapChildren(d) {
	  return Array.isArray(d) ? d[1] : null;
	}

	function copyData(node) {
	  if (node.data.value !== undefined) node.value = node.data.value;
	  node.data = node.data.data;
	}

	function computeHeight(node) {
	  var height = 0;

	  do node.height = height; while ((node = node.parent) && node.height < ++height);
	}
	function Node$1(data) {
	  this.data = data;
	  this.depth = this.height = 0;
	  this.parent = null;
	}
	Node$1.prototype = hierarchy.prototype = {
	  constructor: Node$1,
	  count: node_count,
	  each: node_each,
	  eachAfter: node_eachAfter,
	  eachBefore: node_eachBefore,
	  find: node_find,
	  sum: node_sum,
	  sort: node_sort,
	  path: node_path,
	  ancestors: node_ancestors,
	  descendants: node_descendants,
	  leaves: node_leaves,
	  links: node_links,
	  copy: node_copy,
	  [Symbol.iterator]: node_iterator
	};

	function array (x) {
	  return typeof x === "object" && "length" in x ? x // Array, TypedArray, NodeList, array-like
	  : Array.from(x); // Map, Set, iterable, string, or anything else
	}
	function shuffle(array) {
	  var m = array.length,
	      t,
	      i;

	  while (m) {
	    i = Math.random() * m-- | 0;
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	}

	function enclose (circles) {
	  var i = 0,
	      n = (circles = shuffle(Array.from(circles))).length,
	      B = [],
	      p,
	      e;

	  while (i < n) {
	    p = circles[i];
	    if (e && enclosesWeak(e, p)) ++i;else e = encloseBasis(B = extendBasis(B, p)), i = 0;
	  }

	  return e;
	}

	function extendBasis(B, p) {
	  var i, j;
	  if (enclosesWeakAll(p, B)) return [p]; // If we get here then B must have at least one element.

	  for (i = 0; i < B.length; ++i) {
	    if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
	      return [B[i], p];
	    }
	  } // If we get here then B must have at least two elements.


	  for (i = 0; i < B.length - 1; ++i) {
	    for (j = i + 1; j < B.length; ++j) {
	      if (enclosesNot(encloseBasis2(B[i], B[j]), p) && enclosesNot(encloseBasis2(B[i], p), B[j]) && enclosesNot(encloseBasis2(B[j], p), B[i]) && enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)) {
	        return [B[i], B[j], p];
	      }
	    }
	  } // If we get here then something is very wrong.


	  throw new Error();
	}

	function enclosesNot(a, b) {
	  var dr = a.r - b.r,
	      dx = b.x - a.x,
	      dy = b.y - a.y;
	  return dr < 0 || dr * dr < dx * dx + dy * dy;
	}

	function enclosesWeak(a, b) {
	  var dr = a.r - b.r + Math.max(a.r, b.r, 1) * 1e-9,
	      dx = b.x - a.x,
	      dy = b.y - a.y;
	  return dr > 0 && dr * dr > dx * dx + dy * dy;
	}

	function enclosesWeakAll(a, B) {
	  for (var i = 0; i < B.length; ++i) {
	    if (!enclosesWeak(a, B[i])) {
	      return false;
	    }
	  }

	  return true;
	}

	function encloseBasis(B) {
	  switch (B.length) {
	    case 1:
	      return encloseBasis1(B[0]);

	    case 2:
	      return encloseBasis2(B[0], B[1]);

	    case 3:
	      return encloseBasis3(B[0], B[1], B[2]);
	  }
	}

	function encloseBasis1(a) {
	  return {
	    x: a.x,
	    y: a.y,
	    r: a.r
	  };
	}

	function encloseBasis2(a, b) {
	  var x1 = a.x,
	      y1 = a.y,
	      r1 = a.r,
	      x2 = b.x,
	      y2 = b.y,
	      r2 = b.r,
	      x21 = x2 - x1,
	      y21 = y2 - y1,
	      r21 = r2 - r1,
	      l = Math.sqrt(x21 * x21 + y21 * y21);
	  return {
	    x: (x1 + x2 + x21 / l * r21) / 2,
	    y: (y1 + y2 + y21 / l * r21) / 2,
	    r: (l + r1 + r2) / 2
	  };
	}

	function encloseBasis3(a, b, c) {
	  var x1 = a.x,
	      y1 = a.y,
	      r1 = a.r,
	      x2 = b.x,
	      y2 = b.y,
	      r2 = b.r,
	      x3 = c.x,
	      y3 = c.y,
	      r3 = c.r,
	      a2 = x1 - x2,
	      a3 = x1 - x3,
	      b2 = y1 - y2,
	      b3 = y1 - y3,
	      c2 = r2 - r1,
	      c3 = r3 - r1,
	      d1 = x1 * x1 + y1 * y1 - r1 * r1,
	      d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
	      d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
	      ab = a3 * b2 - a2 * b3,
	      xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
	      xb = (b3 * c2 - b2 * c3) / ab,
	      ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
	      yb = (a2 * c3 - a3 * c2) / ab,
	      A = xb * xb + yb * yb - 1,
	      B = 2 * (r1 + xa * xb + ya * yb),
	      C = xa * xa + ya * ya - r1 * r1,
	      r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
	  return {
	    x: x1 + xa + xb * r,
	    y: y1 + ya + yb * r,
	    r: r
	  };
	}

	function place(b, a, c) {
	  var dx = b.x - a.x,
	      x,
	      a2,
	      dy = b.y - a.y,
	      y,
	      b2,
	      d2 = dx * dx + dy * dy;

	  if (d2) {
	    a2 = a.r + c.r, a2 *= a2;
	    b2 = b.r + c.r, b2 *= b2;

	    if (a2 > b2) {
	      x = (d2 + b2 - a2) / (2 * d2);
	      y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
	      c.x = b.x - x * dx - y * dy;
	      c.y = b.y - x * dy + y * dx;
	    } else {
	      x = (d2 + a2 - b2) / (2 * d2);
	      y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
	      c.x = a.x + x * dx - y * dy;
	      c.y = a.y + x * dy + y * dx;
	    }
	  } else {
	    c.x = a.x + c.r;
	    c.y = a.y;
	  }
	}

	function intersects(a, b) {
	  var dr = a.r + b.r - 1e-6,
	      dx = b.x - a.x,
	      dy = b.y - a.y;
	  return dr > 0 && dr * dr > dx * dx + dy * dy;
	}

	function score(node) {
	  var a = node._,
	      b = node.next._,
	      ab = a.r + b.r,
	      dx = (a.x * b.r + b.x * a.r) / ab,
	      dy = (a.y * b.r + b.y * a.r) / ab;
	  return dx * dx + dy * dy;
	}

	function Node(circle) {
	  this._ = circle;
	  this.next = null;
	  this.previous = null;
	}

	function packEnclose(circles) {
	  if (!(n = (circles = array(circles)).length)) return 0;
	  var a, b, c, n, aa, ca, i, j, k, sj, sk; // Place the first circle.

	  a = circles[0], a.x = 0, a.y = 0;
	  if (!(n > 1)) return a.r; // Place the second circle.

	  b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
	  if (!(n > 2)) return a.r + b.r; // Place the third circle.

	  place(b, a, c = circles[2]); // Initialize the front-chain using the first three circles a, b and c.

	  a = new Node(a), b = new Node(b), c = new Node(c);
	  a.next = c.previous = b;
	  b.next = a.previous = c;
	  c.next = b.previous = a; // Attempt to place each remaining circle…

	  pack: for (i = 3; i < n; ++i) {
	    place(a._, b._, c = circles[i]), c = new Node(c); // Find the closest intersecting circle on the front-chain, if any.
	    // “Closeness” is determined by linear distance along the front-chain.
	    // “Ahead” or “behind” is likewise determined by linear distance.

	    j = b.next, k = a.previous, sj = b._.r, sk = a._.r;

	    do {
	      if (sj <= sk) {
	        if (intersects(j._, c._)) {
	          b = j, a.next = b, b.previous = a, --i;
	          continue pack;
	        }

	        sj += j._.r, j = j.next;
	      } else {
	        if (intersects(k._, c._)) {
	          a = k, a.next = b, b.previous = a, --i;
	          continue pack;
	        }

	        sk += k._.r, k = k.previous;
	      }
	    } while (j !== k.next); // Success! Insert the new circle c between a and b.


	    c.previous = a, c.next = b, a.next = b.previous = b = c; // Compute the new closest circle pair to the centroid.

	    aa = score(a);

	    while ((c = c.next) !== b) {
	      if ((ca = score(c)) < aa) {
	        a = c, aa = ca;
	      }
	    }

	    b = a.next;
	  } // Compute the enclosing circle of the front chain.


	  a = [b._], c = b;

	  while ((c = c.next) !== b) a.push(c._);

	  c = enclose(a); // Translate the circles to put the enclosing circle around the origin.

	  for (i = 0; i < n; ++i) a = circles[i], a.x -= c.x, a.y -= c.y;

	  return c.r;
	}

	function optional(f) {
	  return f == null ? null : required(f);
	}
	function required(f) {
	  if (typeof f !== "function") throw new Error();
	  return f;
	}

	function constantZero() {
	  return 0;
	}
	function constant$3 (x) {
	  return function () {
	    return x;
	  };
	}

	function defaultRadius(d) {
	  return Math.sqrt(d.value);
	}

	function index () {
	  var radius = null,
	      dx = 1,
	      dy = 1,
	      padding = constantZero;

	  function pack(root) {
	    root.x = dx / 2, root.y = dy / 2;

	    if (radius) {
	      root.eachBefore(radiusLeaf(radius)).eachAfter(packChildren(padding, 0.5)).eachBefore(translateChild(1));
	    } else {
	      root.eachBefore(radiusLeaf(defaultRadius)).eachAfter(packChildren(constantZero, 1)).eachAfter(packChildren(padding, root.r / Math.min(dx, dy))).eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
	    }

	    return root;
	  }

	  pack.radius = function (x) {
	    return arguments.length ? (radius = optional(x), pack) : radius;
	  };

	  pack.size = function (x) {
	    return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
	  };

	  pack.padding = function (x) {
	    return arguments.length ? (padding = typeof x === "function" ? x : constant$3(+x), pack) : padding;
	  };

	  return pack;
	}

	function radiusLeaf(radius) {
	  return function (node) {
	    if (!node.children) {
	      node.r = Math.max(0, +radius(node) || 0);
	    }
	  };
	}

	function packChildren(padding, k) {
	  return function (node) {
	    if (children = node.children) {
	      var children,
	          i,
	          n = children.length,
	          r = padding(node) * k || 0,
	          e;
	      if (r) for (i = 0; i < n; ++i) children[i].r += r;
	      e = packEnclose(children);
	      if (r) for (i = 0; i < n; ++i) children[i].r -= r;
	      node.r = e + r;
	    }
	  };
	}

	function translateChild(k) {
	  return function (node) {
	    var parent = node.parent;
	    node.r *= k;

	    if (parent) {
	      node.x = parent.x + k * node.x;
	      node.y = parent.y + k * node.y;
	    }
	  };
	}

	function roundNode (node) {
	  node.x0 = Math.round(node.x0);
	  node.y0 = Math.round(node.y0);
	  node.x1 = Math.round(node.x1);
	  node.y1 = Math.round(node.y1);
	}

	function treemapDice (parent, x0, y0, x1, y1) {
	  var nodes = parent.children,
	      node,
	      i = -1,
	      n = nodes.length,
	      k = parent.value && (x1 - x0) / parent.value;

	  while (++i < n) {
	    node = nodes[i], node.y0 = y0, node.y1 = y1;
	    node.x0 = x0, node.x1 = x0 += node.value * k;
	  }
	}

	function partition () {
	  var dx = 1,
	      dy = 1,
	      padding = 0,
	      round = false;

	  function partition(root) {
	    var n = root.height + 1;
	    root.x0 = root.y0 = padding;
	    root.x1 = dx;
	    root.y1 = dy / n;
	    root.eachBefore(positionNode(dy, n));
	    if (round) root.eachBefore(roundNode);
	    return root;
	  }

	  function positionNode(dy, n) {
	    return function (node) {
	      if (node.children) {
	        treemapDice(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
	      }

	      var x0 = node.x0,
	          y0 = node.y0,
	          x1 = node.x1 - padding,
	          y1 = node.y1 - padding;
	      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
	      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
	      node.x0 = x0;
	      node.y0 = y0;
	      node.x1 = x1;
	      node.y1 = y1;
	    };
	  }

	  partition.round = function (x) {
	    return arguments.length ? (round = !!x, partition) : round;
	  };

	  partition.size = function (x) {
	    return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
	  };

	  partition.padding = function (x) {
	    return arguments.length ? (padding = +x, partition) : padding;
	  };

	  return partition;
	}

	var preroot = {
	  depth: -1
	},
	    ambiguous = {};

	function defaultId(d) {
	  return d.id;
	}

	function defaultParentId(d) {
	  return d.parentId;
	}

	function stratify () {
	  var id = defaultId,
	      parentId = defaultParentId;

	  function stratify(data) {
	    var nodes = Array.from(data),
	        n = nodes.length,
	        d,
	        i,
	        root,
	        parent,
	        node,
	        nodeId,
	        nodeKey,
	        nodeByKey = new Map();

	    for (i = 0; i < n; ++i) {
	      d = nodes[i], node = nodes[i] = new Node$1(d);

	      if ((nodeId = id(d, i, data)) != null && (nodeId += "")) {
	        nodeKey = node.id = nodeId;
	        nodeByKey.set(nodeKey, nodeByKey.has(nodeKey) ? ambiguous : node);
	      }

	      if ((nodeId = parentId(d, i, data)) != null && (nodeId += "")) {
	        node.parent = nodeId;
	      }
	    }

	    for (i = 0; i < n; ++i) {
	      node = nodes[i];

	      if (nodeId = node.parent) {
	        parent = nodeByKey.get(nodeId);
	        if (!parent) throw new Error("missing: " + nodeId);
	        if (parent === ambiguous) throw new Error("ambiguous: " + nodeId);
	        if (parent.children) parent.children.push(node);else parent.children = [node];
	        node.parent = parent;
	      } else {
	        if (root) throw new Error("multiple roots");
	        root = node;
	      }
	    }

	    if (!root) throw new Error("no root");
	    root.parent = preroot;
	    root.eachBefore(function (node) {
	      node.depth = node.parent.depth + 1;
	      --n;
	    }).eachBefore(computeHeight);
	    root.parent = null;
	    if (n > 0) throw new Error("cycle");
	    return root;
	  }

	  stratify.id = function (x) {
	    return arguments.length ? (id = required(x), stratify) : id;
	  };

	  stratify.parentId = function (x) {
	    return arguments.length ? (parentId = required(x), stratify) : parentId;
	  };

	  return stratify;
	}

	function defaultSeparation(a, b) {
	  return a.parent === b.parent ? 1 : 2;
	} // function radialSeparation(a, b) {
	//   return (a.parent === b.parent ? 1 : 2) / a.depth;
	// }
	// This function is used to traverse the left contour of a subtree (or
	// subforest). It returns the successor of v on this contour. This successor is
	// either given by the leftmost child of v or by the thread of v. The function
	// returns null if and only if v is on the highest level of its subtree.


	function nextLeft(v) {
	  var children = v.children;
	  return children ? children[0] : v.t;
	} // This function works analogously to nextLeft.


	function nextRight(v) {
	  var children = v.children;
	  return children ? children[children.length - 1] : v.t;
	} // Shifts the current subtree rooted at w+. This is done by increasing
	// prelim(w+) and mod(w+) by shift.


	function moveSubtree(wm, wp, shift) {
	  var change = shift / (wp.i - wm.i);
	  wp.c -= change;
	  wp.s += shift;
	  wm.c += change;
	  wp.z += shift;
	  wp.m += shift;
	} // All other shifts, applied to the smaller subtrees between w- and w+, are
	// performed by this function. To prepare the shifts, we have to adjust
	// change(w+), shift(w+), and change(w-).


	function executeShifts(v) {
	  var shift = 0,
	      change = 0,
	      children = v.children,
	      i = children.length,
	      w;

	  while (--i >= 0) {
	    w = children[i];
	    w.z += shift;
	    w.m += shift;
	    shift += w.s + (change += w.c);
	  }
	} // If vi-’s ancestor is a sibling of v, returns vi-’s ancestor. Otherwise,
	// returns the specified (default) ancestor.


	function nextAncestor(vim, v, ancestor) {
	  return vim.a.parent === v.parent ? vim.a : ancestor;
	}

	function TreeNode(node, i) {
	  this._ = node;
	  this.parent = null;
	  this.children = null;
	  this.A = null; // default ancestor

	  this.a = this; // ancestor

	  this.z = 0; // prelim

	  this.m = 0; // mod

	  this.c = 0; // change

	  this.s = 0; // shift

	  this.t = null; // thread

	  this.i = i; // number
	}

	TreeNode.prototype = Object.create(Node$1.prototype);

	function treeRoot(root) {
	  var tree = new TreeNode(root, 0),
	      node,
	      nodes = [tree],
	      child,
	      children,
	      i,
	      n;

	  while (node = nodes.pop()) {
	    if (children = node._.children) {
	      node.children = new Array(n = children.length);

	      for (i = n - 1; i >= 0; --i) {
	        nodes.push(child = node.children[i] = new TreeNode(children[i], i));
	        child.parent = node;
	      }
	    }
	  }

	  (tree.parent = new TreeNode(null, 0)).children = [tree];
	  return tree;
	} // Node-link tree diagram using the Reingold-Tilford "tidy" algorithm


	function tree () {
	  var separation = defaultSeparation,
	      dx = 1,
	      dy = 1,
	      nodeSize = null;

	  function tree(root) {
	    var t = treeRoot(root); // Compute the layout using Buchheim et al.’s algorithm.

	    t.eachAfter(firstWalk), t.parent.m = -t.z;
	    t.eachBefore(secondWalk); // If a fixed node size is specified, scale x and y.

	    if (nodeSize) root.eachBefore(sizeNode); // If a fixed tree size is specified, scale x and y based on the extent.
	    // Compute the left-most, right-most, and depth-most nodes for extents.
	    else {
	      var left = root,
	          right = root,
	          bottom = root;
	      root.eachBefore(function (node) {
	        if (node.x < left.x) left = node;
	        if (node.x > right.x) right = node;
	        if (node.depth > bottom.depth) bottom = node;
	      });
	      var s = left === right ? 1 : separation(left, right) / 2,
	          tx = s - left.x,
	          kx = dx / (right.x + s + tx),
	          ky = dy / (bottom.depth || 1);
	      root.eachBefore(function (node) {
	        node.x = (node.x + tx) * kx;
	        node.y = node.depth * ky;
	      });
	    }
	    return root;
	  } // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
	  // applied recursively to the children of v, as well as the function
	  // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
	  // node v is placed to the midpoint of its outermost children.


	  function firstWalk(v) {
	    var children = v.children,
	        siblings = v.parent.children,
	        w = v.i ? siblings[v.i - 1] : null;

	    if (children) {
	      executeShifts(v);
	      var midpoint = (children[0].z + children[children.length - 1].z) / 2;

	      if (w) {
	        v.z = w.z + separation(v._, w._);
	        v.m = v.z - midpoint;
	      } else {
	        v.z = midpoint;
	      }
	    } else if (w) {
	      v.z = w.z + separation(v._, w._);
	    }

	    v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
	  } // Computes all real x-coordinates by summing up the modifiers recursively.


	  function secondWalk(v) {
	    v._.x = v.z + v.parent.m;
	    v.m += v.parent.m;
	  } // The core of the algorithm. Here, a new subtree is combined with the
	  // previous subtrees. Threads are used to traverse the inside and outside
	  // contours of the left and right subtree up to the highest common level. The
	  // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
	  // superscript o means outside and i means inside, the subscript - means left
	  // subtree and + means right subtree. For summing up the modifiers along the
	  // contour, we use respective variables si+, si-, so-, and so+. Whenever two
	  // nodes of the inside contours conflict, we compute the left one of the
	  // greatest uncommon ancestors using the function ANCESTOR and call MOVE
	  // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
	  // Finally, we add a new thread (if necessary).


	  function apportion(v, w, ancestor) {
	    if (w) {
	      var vip = v,
	          vop = v,
	          vim = w,
	          vom = vip.parent.children[0],
	          sip = vip.m,
	          sop = vop.m,
	          sim = vim.m,
	          som = vom.m,
	          shift;

	      while (vim = nextRight(vim), vip = nextLeft(vip), vim && vip) {
	        vom = nextLeft(vom);
	        vop = nextRight(vop);
	        vop.a = v;
	        shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);

	        if (shift > 0) {
	          moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
	          sip += shift;
	          sop += shift;
	        }

	        sim += vim.m;
	        sip += vip.m;
	        som += vom.m;
	        sop += vop.m;
	      }

	      if (vim && !nextRight(vop)) {
	        vop.t = vim;
	        vop.m += sim - sop;
	      }

	      if (vip && !nextLeft(vom)) {
	        vom.t = vip;
	        vom.m += sip - som;
	        ancestor = v;
	      }
	    }

	    return ancestor;
	  }

	  function sizeNode(node) {
	    node.x *= dx;
	    node.y = node.depth * dy;
	  }

	  tree.separation = function (x) {
	    return arguments.length ? (separation = x, tree) : separation;
	  };

	  tree.size = function (x) {
	    return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], tree) : nodeSize ? null : [dx, dy];
	  };

	  tree.nodeSize = function (x) {
	    return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], tree) : nodeSize ? [dx, dy] : null;
	  };

	  return tree;
	}

	function define (constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	}
	function extend(parent, definition) {
	  var prototype = Object.create(parent.prototype);

	  for (var key in definition) prototype[key] = definition[key];

	  return prototype;
	}

	function Color() {}
	var darker = 0.7;
	var brighter = 1 / darker;
	var reI = "\\s*([+-]?\\d+)\\s*",
	    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
	    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
	    reHex = /^#([0-9a-f]{3,8})$/,
	    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
	    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
	    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
	    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
	    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
	    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
	var named = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};
	define(Color, color, {
	  copy: function (channels) {
	    return Object.assign(new this.constructor(), this, channels);
	  },
	  displayable: function () {
	    return this.rgb().displayable();
	  },
	  hex: color_formatHex,
	  // Deprecated! Use color.formatHex.
	  formatHex: color_formatHex,
	  formatHsl: color_formatHsl,
	  formatRgb: color_formatRgb,
	  toString: color_formatRgb
	});

	function color_formatHex() {
	  return this.rgb().formatHex();
	}

	function color_formatHsl() {
	  return hslConvert(this).formatHsl();
	}

	function color_formatRgb() {
	  return this.rgb().formatRgb();
	}

	function color(format) {
	  var m, l;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
	  : l === 3 ? new Rgb(m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
	  : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
	  : l === 4 ? rgba(m >> 12 & 0xf | m >> 8 & 0xf0, m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, ((m & 0xf) << 4 | m & 0xf) / 0xff) // #f000
	  : null // invalid hex
	  ) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	  : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
	  : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
	}

	function rgbn(n) {
	  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb(r, g, b, a);
	}

	function rgbConvert(o) {
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Rgb();
	  o = o.rgb();
	  return new Rgb(o.r, o.g, o.b, o.opacity);
	}
	function rgb(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	}
	function Rgb(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}
	define(Rgb, rgb, extend(Color, {
	  brighter: function (k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker: function (k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb: function () {
	    return this;
	  },
	  displayable: function () {
	    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	  },
	  hex: rgb_formatHex,
	  // Deprecated! Use color.formatHex.
	  formatHex: rgb_formatHex,
	  formatRgb: rgb_formatRgb,
	  toString: rgb_formatRgb
	}));

	function rgb_formatHex() {
	  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
	}

	function rgb_formatRgb() {
	  var a = this.opacity;
	  a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	  return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
	}

	function hex(value) {
	  value = Math.max(0, Math.min(255, Math.round(value) || 0));
	  return (value < 16 ? "0" : "") + value.toString(16);
	}

	function hsla(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
	  return new Hsl(h, s, l, a);
	}

	function hslConvert(o) {
	  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Hsl();
	  if (o instanceof Hsl) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;

	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }

	  return new Hsl(h, s, l, o.opacity);
	}
	function hsl(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hsl, hsl, extend(Color, {
	  brighter: function (k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function (k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function () {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
	  },
	  displayable: function () {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	  },
	  formatHsl: function () {
	    var a = this.opacity;
	    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	    return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
	  }
	}));
	/* From FvD 13.37, CSS Color Module Level 3 */

	function hsl2rgb(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
	}

	const radians = Math.PI / 180;
	const degrees$1 = 180 / Math.PI;

	var A = -0.14861,
	    B = +1.78277,
	    C = -0.29227,
	    D = -0.90649,
	    E = +1.97294,
	    ED = E * D,
	    EB = E * B,
	    BC_DA = B * C - D * A;

	function cubehelixConvert(o) {
	  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
	      bl = b - l,
	      k = (E * (g - l) - C * bl) / D,
	      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
	      // NaN if l=0 or l=1
	  h = s ? Math.atan2(k, bl) * degrees$1 - 120 : NaN;
	  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
	}

	function cubehelix$1(h, s, l, opacity) {
	  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
	}
	function Cubehelix(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}
	define(Cubehelix, cubehelix$1, extend(Color, {
	  brighter: function (k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function (k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function () {
	    var h = isNaN(this.h) ? 0 : (this.h + 120) * radians,
	        l = +this.l,
	        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	        cosh = Math.cos(h),
	        sinh = Math.sin(h);
	    return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
	  }
	}));

	var constant$2 = (x => () => x);

	function linear(a, d) {
	  return function (t) {
	    return a + t * d;
	  };
	}

	function exponential(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function hue(a, b) {
	  var d = b - a;
	  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$2(isNaN(a) ? b : a);
	}
	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function (a, b) {
	    return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
	  };
	}
	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear(a, d) : constant$2(isNaN(a) ? b : a);
	}

	var interpolateRgb = (function rgbGamma(y) {
	  var color = gamma(y);

	  function rgb$1(start, end) {
	    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
	        g = color(start.g, end.g),
	        b = color(start.b, end.b),
	        opacity = nogamma(start.opacity, end.opacity);
	    return function (t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb$1.gamma = rgbGamma;
	  return rgb$1;
	})(1);

	function numberArray (a, b) {
	  if (!b) b = [];
	  var n = a ? Math.min(b.length, a.length) : 0,
	      c = b.slice(),
	      i;
	  return function (t) {
	    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;

	    return c;
	  };
	}
	function isNumberArray(x) {
	  return ArrayBuffer.isView(x) && !(x instanceof DataView);
	}

	function genericArray(a, b) {
	  var nb = b ? b.length : 0,
	      na = a ? Math.min(nb, a.length) : 0,
	      x = new Array(na),
	      c = new Array(nb),
	      i;

	  for (i = 0; i < na; ++i) x[i] = interpolate$1(a[i], b[i]);

	  for (; i < nb; ++i) c[i] = b[i];

	  return function (t) {
	    for (i = 0; i < na; ++i) c[i] = x[i](t);

	    return c;
	  };
	}

	function date (a, b) {
	  var d = new Date();
	  return a = +a, b = +b, function (t) {
	    return d.setTime(a * (1 - t) + b * t), d;
	  };
	}

	function interpolateNumber (a, b) {
	  return a = +a, b = +b, function (t) {
	    return a * (1 - t) + b * t;
	  };
	}

	function object (a, b) {
	  var i = {},
	      c = {},
	      k;
	  if (a === null || typeof a !== "object") a = {};
	  if (b === null || typeof b !== "object") b = {};

	  for (k in b) {
	    if (k in a) {
	      i[k] = interpolate$1(a[k], b[k]);
	    } else {
	      c[k] = b[k];
	    }
	  }

	  return function (t) {
	    for (k in i) c[k] = i[k](t);

	    return c;
	  };
	}

	var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
	    reB = new RegExp(reA.source, "g");

	function zero(b) {
	  return function () {
	    return b;
	  };
	}

	function one(b) {
	  return function (t) {
	    return b(t) + "";
	  };
	}

	function interpolateString (a, b) {
	  var bi = reA.lastIndex = reB.lastIndex = 0,
	      // scan index for next number in b
	  am,
	      // current match in a
	  bm,
	      // current match in b
	  bs,
	      // string preceding current number in b, if any
	  i = -1,
	      // index in s
	  s = [],
	      // string constants and placeholders
	  q = []; // number interpolators
	  // Coerce inputs to strings.

	  a = a + "", b = b + ""; // Interpolate pairs of numbers in a & b.

	  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
	    if ((bs = bm.index) > bi) {
	      // a string precedes the next number in b
	      bs = b.slice(bi, bs);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }

	    if ((am = am[0]) === (bm = bm[0])) {
	      // numbers in a & b match
	      if (s[i]) s[i] += bm; // coalesce with previous string
	      else s[++i] = bm;
	    } else {
	      // interpolate non-matching numbers
	      s[++i] = null;
	      q.push({
	        i: i,
	        x: interpolateNumber(am, bm)
	      });
	    }

	    bi = reB.lastIndex;
	  } // Add remains of b.


	  if (bi < b.length) {
	    bs = b.slice(bi);
	    if (s[i]) s[i] += bs; // coalesce with previous string
	    else s[++i] = bs;
	  } // Special optimization for only a single match.
	  // Otherwise, interpolate each of the numbers and rejoin the string.


	  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
	    for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);

	    return s.join("");
	  });
	}

	function interpolate$1 (a, b) {
	  var t = typeof b,
	      c;
	  return b == null || t === "boolean" ? constant$2(b) : (t === "number" ? interpolateNumber : t === "string" ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : interpolateNumber)(a, b);
	}

	function interpolateRound (a, b) {
	  return a = +a, b = +b, function (t) {
	    return Math.round(a * (1 - t) + b * t);
	  };
	}

	var degrees = 180 / Math.PI;
	var identity$4 = {
	  translateX: 0,
	  translateY: 0,
	  rotate: 0,
	  skewX: 0,
	  scaleX: 1,
	  scaleY: 1
	};
	function decompose (a, b, c, d, e, f) {
	  var scaleX, scaleY, skewX;
	  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	  return {
	    translateX: e,
	    translateY: f,
	    rotate: Math.atan2(b, a) * degrees,
	    skewX: Math.atan(skewX) * degrees,
	    scaleX: scaleX,
	    scaleY: scaleY
	  };
	}

	var svgNode;
	/* eslint-disable no-undef */

	function parseCss(value) {
	  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
	  return m.isIdentity ? identity$4 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
	}
	function parseSvg(value) {
	  if (value == null) return identity$4;
	  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	  svgNode.setAttribute("transform", value);
	  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$4;
	  value = value.matrix;
	  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
	}

	function interpolateTransform(parse, pxComma, pxParen, degParen) {
	  function pop(s) {
	    return s.length ? s.pop() + " " : "";
	  }

	  function translate(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push("translate(", null, pxComma, null, pxParen);
	      q.push({
	        i: i - 4,
	        x: interpolateNumber(xa, xb)
	      }, {
	        i: i - 2,
	        x: interpolateNumber(ya, yb)
	      });
	    } else if (xb || yb) {
	      s.push("translate(" + xb + pxComma + yb + pxParen);
	    }
	  }

	  function rotate(a, b, s, q) {
	    if (a !== b) {
	      if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path

	      q.push({
	        i: s.push(pop(s) + "rotate(", null, degParen) - 2,
	        x: interpolateNumber(a, b)
	      });
	    } else if (b) {
	      s.push(pop(s) + "rotate(" + b + degParen);
	    }
	  }

	  function skewX(a, b, s, q) {
	    if (a !== b) {
	      q.push({
	        i: s.push(pop(s) + "skewX(", null, degParen) - 2,
	        x: interpolateNumber(a, b)
	      });
	    } else if (b) {
	      s.push(pop(s) + "skewX(" + b + degParen);
	    }
	  }

	  function scale(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
	      q.push({
	        i: i - 4,
	        x: interpolateNumber(xa, xb)
	      }, {
	        i: i - 2,
	        x: interpolateNumber(ya, yb)
	      });
	    } else if (xb !== 1 || yb !== 1) {
	      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	    }
	  }

	  return function (a, b) {
	    var s = [],
	        // string constants and placeholders
	    q = []; // number interpolators

	    a = parse(a), b = parse(b);
	    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
	    rotate(a.rotate, b.rotate, s, q);
	    skewX(a.skewX, b.skewX, s, q);
	    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
	    a = b = null; // gc

	    return function (t) {
	      var i = -1,
	          n = q.length,
	          o;

	      while (++i < n) s[(o = q[i]).i] = o.x(t);

	      return s.join("");
	    };
	  };
	}

	var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
	var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

	var epsilon2 = 1e-12;

	function cosh(x) {
	  return ((x = Math.exp(x)) + 1 / x) / 2;
	}

	function sinh(x) {
	  return ((x = Math.exp(x)) - 1 / x) / 2;
	}

	function tanh(x) {
	  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	}

	var interpolateZoom = (function zoomRho(rho, rho2, rho4) {
	  // p0 = [ux0, uy0, w0]
	  // p1 = [ux1, uy1, w1]
	  function zoom(p0, p1) {
	    var ux0 = p0[0],
	        uy0 = p0[1],
	        w0 = p0[2],
	        ux1 = p1[0],
	        uy1 = p1[1],
	        w1 = p1[2],
	        dx = ux1 - ux0,
	        dy = uy1 - uy0,
	        d2 = dx * dx + dy * dy,
	        i,
	        S; // Special case for u0 ≅ u1.

	    if (d2 < epsilon2) {
	      S = Math.log(w1 / w0) / rho;

	      i = function (t) {
	        return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
	      };
	    } // General case.
	    else {
	      var d1 = Math.sqrt(d2),
	          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
	          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
	          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
	          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
	      S = (r1 - r0) / rho;

	      i = function (t) {
	        var s = t * S,
	            coshr0 = cosh(r0),
	            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
	        return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(rho * s + r0)];
	      };
	    }

	    i.duration = S * 1000 * rho / Math.SQRT2;
	    return i;
	  }

	  zoom.rho = function (_) {
	    var _1 = Math.max(1e-3, +_),
	        _2 = _1 * _1,
	        _4 = _2 * _2;

	    return zoomRho(_1, _2, _4);
	  };

	  return zoom;
	})(Math.SQRT2, 2, 4);

	function cubehelix(hue) {
	  return function cubehelixGamma(y) {
	    y = +y;

	    function cubehelix(start, end) {
	      var h = hue((start = cubehelix$1(start)).h, (end = cubehelix$1(end)).h),
	          s = nogamma(start.s, end.s),
	          l = nogamma(start.l, end.l),
	          opacity = nogamma(start.opacity, end.opacity);
	      return function (t) {
	        start.h = h(t);
	        start.s = s(t);
	        start.l = l(Math.pow(t, y));
	        start.opacity = opacity(t);
	        return start + "";
	      };
	    }

	    cubehelix.gamma = cubehelixGamma;
	    return cubehelix;
	  }(1);
	}

	cubehelix(hue);
	var cubehelixLong = cubehelix(nogamma);

	function quantize (interpolator, n) {
	  var samples = new Array(n);

	  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));

	  return samples;
	}

	var emptyOn = dispatch("start", "end", "cancel", "interrupt");
	var emptyTween = [];
	var CREATED = 0;
	var SCHEDULED = 1;
	var STARTING = 2;
	var STARTED = 3;
	var RUNNING = 4;
	var ENDING = 5;
	var ENDED = 6;
	function schedule (node, name, id, index, group, timing) {
	  var schedules = node.__transition;
	  if (!schedules) node.__transition = {};else if (id in schedules) return;
	  create$1(node, id, {
	    name: name,
	    index: index,
	    // For context during callback.
	    group: group,
	    // For context during callback.
	    on: emptyOn,
	    tween: emptyTween,
	    time: timing.time,
	    delay: timing.delay,
	    duration: timing.duration,
	    ease: timing.ease,
	    timer: null,
	    state: CREATED
	  });
	}
	function init(node, id) {
	  var schedule = get(node, id);
	  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
	  return schedule;
	}
	function set(node, id) {
	  var schedule = get(node, id);
	  if (schedule.state > STARTED) throw new Error("too late; already running");
	  return schedule;
	}
	function get(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
	  return schedule;
	}

	function create$1(node, id, self) {
	  var schedules = node.__transition,
	      tween; // Initialize the self timer when the transition is created.
	  // Note the actual delay is not known until the first callback!

	  schedules[id] = self;
	  self.timer = timer(schedule, 0, self.time);

	  function schedule(elapsed) {
	    self.state = SCHEDULED;
	    self.timer.restart(start, self.delay, self.time); // If the elapsed delay is less than our first sleep, start immediately.

	    if (self.delay <= elapsed) start(elapsed - self.delay);
	  }

	  function start(elapsed) {
	    var i, j, n, o; // If the state is not SCHEDULED, then we previously errored on start.

	    if (self.state !== SCHEDULED) return stop();

	    for (i in schedules) {
	      o = schedules[i];
	      if (o.name !== self.name) continue; // While this element already has a starting transition during this frame,
	      // defer starting an interrupting transition until that transition has a
	      // chance to tick (and possibly end); see d3/d3-transition#54!

	      if (o.state === STARTED) return timeout(start); // Interrupt the active transition, if any.

	      if (o.state === RUNNING) {
	        o.state = ENDED;
	        o.timer.stop();
	        o.on.call("interrupt", node, node.__data__, o.index, o.group);
	        delete schedules[i];
	      } // Cancel any pre-empted transitions.
	      else if (+i < id) {
	        o.state = ENDED;
	        o.timer.stop();
	        o.on.call("cancel", node, node.__data__, o.index, o.group);
	        delete schedules[i];
	      }
	    } // Defer the first tick to end of the current frame; see d3/d3#1576.
	    // Note the transition may be canceled after start and before the first tick!
	    // Note this must be scheduled before the start event; see d3/d3-transition#16!
	    // Assuming this is successful, subsequent callbacks go straight to tick.


	    timeout(function () {
	      if (self.state === STARTED) {
	        self.state = RUNNING;
	        self.timer.restart(tick, self.delay, self.time);
	        tick(elapsed);
	      }
	    }); // Dispatch the start event.
	    // Note this must be done before the tween are initialized.

	    self.state = STARTING;
	    self.on.call("start", node, node.__data__, self.index, self.group);
	    if (self.state !== STARTING) return; // interrupted

	    self.state = STARTED; // Initialize the tween, deleting null tween.

	    tween = new Array(n = self.tween.length);

	    for (i = 0, j = -1; i < n; ++i) {
	      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
	        tween[++j] = o;
	      }
	    }

	    tween.length = j + 1;
	  }

	  function tick(elapsed) {
	    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
	        i = -1,
	        n = tween.length;

	    while (++i < n) {
	      tween[i].call(node, t);
	    } // Dispatch the end event.


	    if (self.state === ENDING) {
	      self.on.call("end", node, node.__data__, self.index, self.group);
	      stop();
	    }
	  }

	  function stop() {
	    self.state = ENDED;
	    self.timer.stop();
	    delete schedules[id];

	    for (var i in schedules) return; // eslint-disable-line no-unused-vars


	    delete node.__transition;
	  }
	}

	function interrupt (node, name) {
	  var schedules = node.__transition,
	      schedule,
	      active,
	      empty = true,
	      i;
	  if (!schedules) return;
	  name = name == null ? null : name + "";

	  for (i in schedules) {
	    if ((schedule = schedules[i]).name !== name) {
	      empty = false;
	      continue;
	    }

	    active = schedule.state > STARTING && schedule.state < ENDING;
	    schedule.state = ENDED;
	    schedule.timer.stop();
	    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
	    delete schedules[i];
	  }

	  if (empty) delete node.__transition;
	}

	function selection_interrupt (name) {
	  return this.each(function () {
	    interrupt(this, name);
	  });
	}

	function tweenRemove(id, name) {
	  var tween0, tween1;
	  return function () {
	    var schedule = set(this, id),
	        tween = schedule.tween; // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.

	    if (tween !== tween0) {
	      tween1 = tween0 = tween;

	      for (var i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1 = tween1.slice();
	          tween1.splice(i, 1);
	          break;
	        }
	      }
	    }

	    schedule.tween = tween1;
	  };
	}

	function tweenFunction(id, name, value) {
	  var tween0, tween1;
	  if (typeof value !== "function") throw new Error();
	  return function () {
	    var schedule = set(this, id),
	        tween = schedule.tween; // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.

	    if (tween !== tween0) {
	      tween1 = (tween0 = tween).slice();

	      for (var t = {
	        name: name,
	        value: value
	      }, i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1[i] = t;
	          break;
	        }
	      }

	      if (i === n) tween1.push(t);
	    }

	    schedule.tween = tween1;
	  };
	}

	function transition_tween (name, value) {
	  var id = this._id;
	  name += "";

	  if (arguments.length < 2) {
	    var tween = get(this.node(), id).tween;

	    for (var i = 0, n = tween.length, t; i < n; ++i) {
	      if ((t = tween[i]).name === name) {
	        return t.value;
	      }
	    }

	    return null;
	  }

	  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
	}
	function tweenValue(transition, name, value) {
	  var id = transition._id;
	  transition.each(function () {
	    var schedule = set(this, id);
	    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
	  });
	  return function (node) {
	    return get(node, id).value[name];
	  };
	}

	function interpolate (a, b) {
	  var c;
	  return (typeof b === "number" ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
	}

	function attrRemove(name) {
	  return function () {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS(fullname) {
	  return function () {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant(name, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function () {
	    var string0 = this.getAttribute(name);
	    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function attrConstantNS(fullname, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function () {
	    var string0 = this.getAttributeNS(fullname.space, fullname.local);
	    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function attrFunction(name, interpolate, value) {
	  var string00, string10, interpolate0;
	  return function () {
	    var string0,
	        value1 = value(this),
	        string1;
	    if (value1 == null) return void this.removeAttribute(name);
	    string0 = this.getAttribute(name);
	    string1 = value1 + "";
	    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function attrFunctionNS(fullname, interpolate, value) {
	  var string00, string10, interpolate0;
	  return function () {
	    var string0,
	        value1 = value(this),
	        string1;
	    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
	    string0 = this.getAttributeNS(fullname.space, fullname.local);
	    string1 = value1 + "";
	    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function transition_attr (name, value) {
	  var fullname = namespace(name),
	      i = fullname === "transform" ? interpolateTransformSvg : interpolate;
	  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
	}

	function attrInterpolate(name, i) {
	  return function (t) {
	    this.setAttribute(name, i.call(this, t));
	  };
	}

	function attrInterpolateNS(fullname, i) {
	  return function (t) {
	    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
	  };
	}

	function attrTweenNS(fullname, value) {
	  var t0, i0;

	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
	    return t0;
	  }

	  tween._value = value;
	  return tween;
	}

	function attrTween(name, value) {
	  var t0, i0;

	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
	    return t0;
	  }

	  tween._value = value;
	  return tween;
	}

	function transition_attrTween (name, value) {
	  var key = "attr." + name;
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error();
	  var fullname = namespace(name);
	  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
	}

	function delayFunction(id, value) {
	  return function () {
	    init(this, id).delay = +value.apply(this, arguments);
	  };
	}

	function delayConstant(id, value) {
	  return value = +value, function () {
	    init(this, id).delay = value;
	  };
	}

	function transition_delay (value) {
	  var id = this._id;
	  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get(this.node(), id).delay;
	}

	function durationFunction(id, value) {
	  return function () {
	    set(this, id).duration = +value.apply(this, arguments);
	  };
	}

	function durationConstant(id, value) {
	  return value = +value, function () {
	    set(this, id).duration = value;
	  };
	}

	function transition_duration (value) {
	  var id = this._id;
	  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get(this.node(), id).duration;
	}

	function easeConstant(id, value) {
	  if (typeof value !== "function") throw new Error();
	  return function () {
	    set(this, id).ease = value;
	  };
	}

	function transition_ease (value) {
	  var id = this._id;
	  return arguments.length ? this.each(easeConstant(id, value)) : get(this.node(), id).ease;
	}

	function easeVarying(id, value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (typeof v !== "function") throw new Error();
	    set(this, id).ease = v;
	  };
	}

	function transition_easeVarying (value) {
	  if (typeof value !== "function") throw new Error();
	  return this.each(easeVarying(this._id, value));
	}

	function transition_filter (match) {
	  if (typeof match !== "function") match = matcher(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, this._name, this._id);
	}

	function transition_merge (transition) {
	  if (transition._id !== this._id) throw new Error();

	  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Transition(merges, this._parents, this._name, this._id);
	}

	function start(name) {
	  return (name + "").trim().split(/^|\s+/).every(function (t) {
	    var i = t.indexOf(".");
	    if (i >= 0) t = t.slice(0, i);
	    return !t || t === "start";
	  });
	}

	function onFunction(id, name, listener) {
	  var on0,
	      on1,
	      sit = start(name) ? init : set;
	  return function () {
	    var schedule = sit(this, id),
	        on = schedule.on; // If this node shared a dispatch with the previous node,
	    // just assign the updated shared dispatch and we’re done!
	    // Otherwise, copy-on-write.

	    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
	    schedule.on = on1;
	  };
	}

	function transition_on (name, listener) {
	  var id = this._id;
	  return arguments.length < 2 ? get(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
	}

	function removeFunction(id) {
	  return function () {
	    var parent = this.parentNode;

	    for (var i in this.__transition) if (+i !== id) return;

	    if (parent) parent.removeChild(this);
	  };
	}

	function transition_remove () {
	  return this.on("end.remove", removeFunction(this._id));
	}

	function transition_select (select) {
	  var name = this._name,
	      id = this._id;
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, name, id);
	}

	function transition_selectAll (select) {
	  var name = this._name,
	      id = this._id;
	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
	          if (child = children[k]) {
	            schedule(child, name, id, k, children, inherit);
	          }
	        }

	        subgroups.push(children);
	        parents.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, parents, name, id);
	}

	var Selection = selection.prototype.constructor;
	function transition_selection () {
	  return new Selection(this._groups, this._parents);
	}

	function styleNull(name, interpolate) {
	  var string00, string10, interpolate0;
	  return function () {
	    var string0 = styleValue(this, name),
	        string1 = (this.style.removeProperty(name), styleValue(this, name));
	    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
	  };
	}

	function styleRemove(name) {
	  return function () {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant(name, interpolate, value1) {
	  var string00,
	      string1 = value1 + "",
	      interpolate0;
	  return function () {
	    var string0 = styleValue(this, name);
	    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
	  };
	}

	function styleFunction(name, interpolate, value) {
	  var string00, string10, interpolate0;
	  return function () {
	    var string0 = styleValue(this, name),
	        value1 = value(this),
	        string1 = value1 + "";
	    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
	    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
	  };
	}

	function styleMaybeRemove(id, name) {
	  var on0,
	      on1,
	      listener0,
	      key = "style." + name,
	      event = "end." + key,
	      remove;
	  return function () {
	    var schedule = set(this, id),
	        on = schedule.on,
	        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined; // If this node shared a dispatch with the previous node,
	    // just assign the updated shared dispatch and we’re done!
	    // Otherwise, copy-on-write.

	    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
	    schedule.on = on1;
	  };
	}

	function transition_style (name, value, priority) {
	  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
	  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
	}

	function styleInterpolate(name, i, priority) {
	  return function (t) {
	    this.style.setProperty(name, i.call(this, t), priority);
	  };
	}

	function styleTween(name, value, priority) {
	  var t, i0;

	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
	    return t;
	  }

	  tween._value = value;
	  return tween;
	}

	function transition_styleTween (name, value, priority) {
	  var key = "style." + (name += "");
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error();
	  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
	}

	function textConstant(value) {
	  return function () {
	    this.textContent = value;
	  };
	}

	function textFunction(value) {
	  return function () {
	    var value1 = value(this);
	    this.textContent = value1 == null ? "" : value1;
	  };
	}

	function transition_text (value) {
	  return this.tween("text", typeof value === "function" ? textFunction(tweenValue(this, "text", value)) : textConstant(value == null ? "" : value + ""));
	}

	function textInterpolate(i) {
	  return function (t) {
	    this.textContent = i.call(this, t);
	  };
	}

	function textTween(value) {
	  var t0, i0;

	  function tween() {
	    var i = value.apply(this, arguments);
	    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
	    return t0;
	  }

	  tween._value = value;
	  return tween;
	}

	function transition_textTween (value) {
	  var key = "text";
	  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error();
	  return this.tween(key, textTween(value));
	}

	function transition_transition () {
	  var name = this._name,
	      id0 = this._id,
	      id1 = newId();

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        var inherit = get(node, id0);
	        schedule(node, name, id1, i, group, {
	          time: inherit.time + inherit.delay + inherit.duration,
	          delay: 0,
	          duration: inherit.duration,
	          ease: inherit.ease
	        });
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id1);
	}

	function transition_end () {
	  var on0,
	      on1,
	      that = this,
	      id = that._id,
	      size = that.size();
	  return new Promise(function (resolve, reject) {
	    var cancel = {
	      value: reject
	    },
	        end = {
	      value: function () {
	        if (--size === 0) resolve();
	      }
	    };
	    that.each(function () {
	      var schedule = set(this, id),
	          on = schedule.on; // If this node shared a dispatch with the previous node,
	      // just assign the updated shared dispatch and we’re done!
	      // Otherwise, copy-on-write.

	      if (on !== on0) {
	        on1 = (on0 = on).copy();

	        on1._.cancel.push(cancel);

	        on1._.interrupt.push(cancel);

	        on1._.end.push(end);
	      }

	      schedule.on = on1;
	    }); // The selection was empty, resolve end immediately

	    if (size === 0) resolve();
	  });
	}

	var id = 0;
	function Transition(groups, parents, name, id) {
	  this._groups = groups;
	  this._parents = parents;
	  this._name = name;
	  this._id = id;
	}
	function newId() {
	  return ++id;
	}
	var selection_prototype = selection.prototype;
	Transition.prototype = {
	  constructor: Transition,
	  select: transition_select,
	  selectAll: transition_selectAll,
	  selectChild: selection_prototype.selectChild,
	  selectChildren: selection_prototype.selectChildren,
	  filter: transition_filter,
	  merge: transition_merge,
	  selection: transition_selection,
	  transition: transition_transition,
	  call: selection_prototype.call,
	  nodes: selection_prototype.nodes,
	  node: selection_prototype.node,
	  size: selection_prototype.size,
	  empty: selection_prototype.empty,
	  each: selection_prototype.each,
	  on: transition_on,
	  attr: transition_attr,
	  attrTween: transition_attrTween,
	  style: transition_style,
	  styleTween: transition_styleTween,
	  text: transition_text,
	  textTween: transition_textTween,
	  remove: transition_remove,
	  tween: transition_tween,
	  delay: transition_delay,
	  duration: transition_duration,
	  ease: transition_ease,
	  easeVarying: transition_easeVarying,
	  end: transition_end,
	  [Symbol.iterator]: selection_prototype[Symbol.iterator]
	};

	function cubicInOut(t) {
	  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
	}

	var defaultTiming = {
	  time: null,
	  // Set on use.
	  delay: 0,
	  duration: 250,
	  ease: cubicInOut
	};

	function inherit(node, id) {
	  var timing;

	  while (!(timing = node.__transition) || !(timing = timing[id])) {
	    if (!(node = node.parentNode)) {
	      throw new Error(`transition ${id} not found`);
	    }
	  }

	  return timing;
	}

	function selection_transition (name) {
	  var id, timing;

	  if (name instanceof Transition) {
	    id = name._id, name = name._name;
	  } else {
	    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
	  }

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        schedule(node, name, id, i, group, timing || inherit(node, id));
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id);
	}

	selection.prototype.interrupt = selection_interrupt;
	selection.prototype.transition = selection_transition;

	var constant$1 = (x => () => x);

	function ZoomEvent(type, {
	  sourceEvent,
	  target,
	  transform,
	  dispatch
	}) {
	  Object.defineProperties(this, {
	    type: {
	      value: type,
	      enumerable: true,
	      configurable: true
	    },
	    sourceEvent: {
	      value: sourceEvent,
	      enumerable: true,
	      configurable: true
	    },
	    target: {
	      value: target,
	      enumerable: true,
	      configurable: true
	    },
	    transform: {
	      value: transform,
	      enumerable: true,
	      configurable: true
	    },
	    _: {
	      value: dispatch
	    }
	  });
	}

	function Transform(k, x, y) {
	  this.k = k;
	  this.x = x;
	  this.y = y;
	}
	Transform.prototype = {
	  constructor: Transform,
	  scale: function (k) {
	    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
	  },
	  translate: function (x, y) {
	    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
	  },
	  apply: function (point) {
	    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
	  },
	  applyX: function (x) {
	    return x * this.k + this.x;
	  },
	  applyY: function (y) {
	    return y * this.k + this.y;
	  },
	  invert: function (location) {
	    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
	  },
	  invertX: function (x) {
	    return (x - this.x) / this.k;
	  },
	  invertY: function (y) {
	    return (y - this.y) / this.k;
	  },
	  rescaleX: function (x) {
	    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
	  },
	  rescaleY: function (y) {
	    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
	  },
	  toString: function () {
	    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	  }
	};
	var identity$3 = new Transform(1, 0, 0);

	function nopropagation(event) {
	  event.stopImmediatePropagation();
	}
	function noevent (event) {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}

	// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event

	function defaultFilter(event) {
	  return (!event.ctrlKey || event.type === 'wheel') && !event.button;
	}

	function defaultExtent() {
	  var e = this;

	  if (e instanceof SVGElement) {
	    e = e.ownerSVGElement || e;

	    if (e.hasAttribute("viewBox")) {
	      e = e.viewBox.baseVal;
	      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
	    }

	    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
	  }

	  return [[0, 0], [e.clientWidth, e.clientHeight]];
	}

	function defaultTransform() {
	  return this.__zoom || identity$3;
	}

	function defaultWheelDelta(event) {
	  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
	}

	function defaultTouchable() {
	  return navigator.maxTouchPoints || "ontouchstart" in this;
	}

	function defaultConstrain(transform, extent, translateExtent) {
	  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
	      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
	      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
	      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
	  return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
	}

	function zoom () {
	  var filter = defaultFilter,
	      extent = defaultExtent,
	      constrain = defaultConstrain,
	      wheelDelta = defaultWheelDelta,
	      touchable = defaultTouchable,
	      scaleExtent = [0, Infinity],
	      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
	      duration = 250,
	      interpolate = interpolateZoom,
	      listeners = dispatch("start", "zoom", "end"),
	      touchstarting,
	      touchfirst,
	      touchending,
	      touchDelay = 500,
	      wheelDelay = 150,
	      clickDistance2 = 0,
	      tapDistance = 10;

	  function zoom(selection) {
	    selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, {
	      passive: false
	    }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	  }

	  zoom.transform = function (collection, transform, point, event) {
	    var selection = collection.selection ? collection.selection() : collection;
	    selection.property("__zoom", defaultTransform);

	    if (collection !== selection) {
	      schedule(collection, transform, point, event);
	    } else {
	      selection.interrupt().each(function () {
	        gesture(this, arguments).event(event).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
	      });
	    }
	  };

	  zoom.scaleBy = function (selection, k, p, event) {
	    zoom.scaleTo(selection, function () {
	      var k0 = this.__zoom.k,
	          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
	      return k0 * k1;
	    }, p, event);
	  };

	  zoom.scaleTo = function (selection, k, p, event) {
	    zoom.transform(selection, function () {
	      var e = extent.apply(this, arguments),
	          t0 = this.__zoom,
	          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
	          p1 = t0.invert(p0),
	          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
	      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
	    }, p, event);
	  };

	  zoom.translateBy = function (selection, x, y, event) {
	    zoom.transform(selection, function () {
	      return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
	    }, null, event);
	  };

	  zoom.translateTo = function (selection, x, y, p, event) {
	    zoom.transform(selection, function () {
	      var e = extent.apply(this, arguments),
	          t = this.__zoom,
	          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
	      return constrain(identity$3.translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
	    }, p, event);
	  };

	  function scale(transform, k) {
	    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
	    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
	  }

	  function translate(transform, p0, p1) {
	    var x = p0[0] - p1[0] * transform.k,
	        y = p0[1] - p1[1] * transform.k;
	    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
	  }

	  function centroid(extent) {
	    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
	  }

	  function schedule(transition, transform, point, event) {
	    transition.on("start.zoom", function () {
	      gesture(this, arguments).event(event).start();
	    }).on("interrupt.zoom end.zoom", function () {
	      gesture(this, arguments).event(event).end();
	    }).tween("zoom", function () {
	      var that = this,
	          args = arguments,
	          g = gesture(that, args).event(event),
	          e = extent.apply(that, args),
	          p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
	          w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
	          a = that.__zoom,
	          b = typeof transform === "function" ? transform.apply(that, args) : transform,
	          i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
	      return function (t) {
	        if (t === 1) t = b; // Avoid rounding error on end.
	        else {
	          var l = i(t),
	              k = w / l[2];
	          t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
	        }
	        g.zoom(null, t);
	      };
	    });
	  }

	  function gesture(that, args, clean) {
	    return !clean && that.__zooming || new Gesture(that, args);
	  }

	  function Gesture(that, args) {
	    this.that = that;
	    this.args = args;
	    this.active = 0;
	    this.sourceEvent = null;
	    this.extent = extent.apply(that, args);
	    this.taps = 0;
	  }

	  Gesture.prototype = {
	    event: function (event) {
	      if (event) this.sourceEvent = event;
	      return this;
	    },
	    start: function () {
	      if (++this.active === 1) {
	        this.that.__zooming = this;
	        this.emit("start");
	      }

	      return this;
	    },
	    zoom: function (key, transform) {
	      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
	      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
	      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
	      this.that.__zoom = transform;
	      this.emit("zoom");
	      return this;
	    },
	    end: function () {
	      if (--this.active === 0) {
	        delete this.that.__zooming;
	        this.emit("end");
	      }

	      return this;
	    },
	    emit: function (type) {
	      var d = select(this.that).datum();
	      listeners.call(type, this.that, new ZoomEvent(type, {
	        sourceEvent: this.sourceEvent,
	        target: zoom,
	        type,
	        transform: this.that.__zoom,
	        dispatch: listeners
	      }), d);
	    }
	  };

	  function wheeled(event, ...args) {
	    if (!filter.apply(this, arguments)) return;
	    var g = gesture(this, args).event(event),
	        t = this.__zoom,
	        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
	        p = pointer(event); // If the mouse is in the same location as before, reuse it.
	    // If there were recent wheel events, reset the wheel idle timeout.

	    if (g.wheel) {
	      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
	        g.mouse[1] = t.invert(g.mouse[0] = p);
	      }

	      clearTimeout(g.wheel);
	    } // If this wheel event won’t trigger a transform change, ignore it.
	    else if (t.k === k) return; // Otherwise, capture the mouse point and location at the start.
	    else {
	      g.mouse = [p, t.invert(p)];
	      interrupt(this);
	      g.start();
	    }

	    noevent(event);
	    g.wheel = setTimeout(wheelidled, wheelDelay);
	    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

	    function wheelidled() {
	      g.wheel = null;
	      g.end();
	    }
	  }

	  function mousedowned(event, ...args) {
	    if (touchending || !filter.apply(this, arguments)) return;
	    var currentTarget = event.currentTarget,
	        g = gesture(this, args, true).event(event),
	        v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
	        p = pointer(event, currentTarget),
	        x0 = event.clientX,
	        y0 = event.clientY;
	    dragDisable(event.view);
	    nopropagation(event);
	    g.mouse = [p, this.__zoom.invert(p)];
	    interrupt(this);
	    g.start();

	    function mousemoved(event) {
	      noevent(event);

	      if (!g.moved) {
	        var dx = event.clientX - x0,
	            dy = event.clientY - y0;
	        g.moved = dx * dx + dy * dy > clickDistance2;
	      }

	      g.event(event).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
	    }

	    function mouseupped(event) {
	      v.on("mousemove.zoom mouseup.zoom", null);
	      yesdrag(event.view, g.moved);
	      noevent(event);
	      g.event(event).end();
	    }
	  }

	  function dblclicked(event, ...args) {
	    if (!filter.apply(this, arguments)) return;
	    var t0 = this.__zoom,
	        p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this),
	        p1 = t0.invert(p0),
	        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
	        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
	    noevent(event);
	    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0, event);else select(this).call(zoom.transform, t1, p0, event);
	  }

	  function touchstarted(event, ...args) {
	    if (!filter.apply(this, arguments)) return;
	    var touches = event.touches,
	        n = touches.length,
	        g = gesture(this, args, event.changedTouches.length === n).event(event),
	        started,
	        i,
	        t,
	        p;
	    nopropagation(event);

	    for (i = 0; i < n; ++i) {
	      t = touches[i], p = pointer(t, this);
	      p = [p, this.__zoom.invert(p), t.identifier];
	      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
	    }

	    if (touchstarting) touchstarting = clearTimeout(touchstarting);

	    if (started) {
	      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function () {
	        touchstarting = null;
	      }, touchDelay);
	      interrupt(this);
	      g.start();
	    }
	  }

	  function touchmoved(event, ...args) {
	    if (!this.__zooming) return;
	    var g = gesture(this, args).event(event),
	        touches = event.changedTouches,
	        n = touches.length,
	        i,
	        t,
	        p,
	        l;
	    noevent(event);

	    for (i = 0; i < n; ++i) {
	      t = touches[i], p = pointer(t, this);
	      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
	    }

	    t = g.that.__zoom;

	    if (g.touch1) {
	      var p0 = g.touch0[0],
	          l0 = g.touch0[1],
	          p1 = g.touch1[0],
	          l1 = g.touch1[1],
	          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
	          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
	      t = scale(t, Math.sqrt(dp / dl));
	      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
	      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
	    } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];else return;

	    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
	  }

	  function touchended(event, ...args) {
	    if (!this.__zooming) return;
	    var g = gesture(this, args).event(event),
	        touches = event.changedTouches,
	        n = touches.length,
	        i,
	        t;
	    nopropagation(event);
	    if (touchending) clearTimeout(touchending);
	    touchending = setTimeout(function () {
	      touchending = null;
	    }, touchDelay);

	    for (i = 0; i < n; ++i) {
	      t = touches[i];
	      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
	    }

	    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
	    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);else {
	      g.end(); // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.

	      if (g.taps === 2) {
	        t = pointer(t, this);

	        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
	          var p = select(this).on("dblclick.zoom");
	          if (p) p.apply(this, arguments);
	        }
	      }
	    }
	  }

	  zoom.wheelDelta = function (_) {
	    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant$1(+_), zoom) : wheelDelta;
	  };

	  zoom.filter = function (_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$1(!!_), zoom) : filter;
	  };

	  zoom.touchable = function (_) {
	    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$1(!!_), zoom) : touchable;
	  };

	  zoom.extent = function (_) {
	    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$1([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
	  };

	  zoom.scaleExtent = function (_) {
	    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
	  };

	  zoom.translateExtent = function (_) {
	    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
	  };

	  zoom.constrain = function (_) {
	    return arguments.length ? (constrain = _, zoom) : constrain;
	  };

	  zoom.duration = function (_) {
	    return arguments.length ? (duration = +_, zoom) : duration;
	  };

	  zoom.interpolate = function (_) {
	    return arguments.length ? (interpolate = _, zoom) : interpolate;
	  };

	  zoom.on = function () {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? zoom : value;
	  };

	  zoom.clickDistance = function (_) {
	    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
	  };

	  zoom.tapDistance = function (_) {
	    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
	  };

	  return zoom;
	}

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

	  return d3drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
	};

	var sparseness = 50; // https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy

	var forceTree = function forceTree(ecosystem, element) {
	  var width = 200;
	  var height = width;
	  var links = ecosystem.links().filter(function (d) {
	    return d.source.depth > 0;
	  });
	  var nodes = ecosystem.descendants().filter(function (d) {
	    return d.depth > 0;
	  });
	  var simulation$1 = simulation(nodes).force('link', link$1(links).id(function (d) {
	    return d.id;
	  }).distance(0).strength(1)).force('charge', manyBody().strength(-sparseness)).force('x', x$1()).force('y', y$1());
	  var svg = element.append('svg').attr('viewBox', [-width / 2, -height / 2, width, height]);
	  var graph = svg.append('g').attr('id', 'graph');
	  var link = graph.append('g').attr('id', 'edges').selectAll('line').data(links).join('line').attr('class', function (d) {
	    return d.source.data.type;
	  });
	  var tooltip = element.append('div').attr('class', 'tooltip hide');

	  var showTooltip = function showTooltip(entity) {
	    var _entity$data = entity.data,
	        id = _entity$data.id,
	        name = _entity$data.name,
	        type = _entity$data.type;
	    var content = "\n      <h1>".concat(name || id, " (").concat(type, ")</h1>\n      <p>").concat(nodePath(entity), "</p>\n    ");
	    tooltip.classed('hide', false);
	    tooltip.html(content);
	  };

	  var hideTooltip = function hideTooltip(entity) {
	    tooltip.classed('hide', true);
	  };

	  var node = graph.append('g').attr('id', 'nodes').selectAll('circle').data(nodes).join('circle').attr('class', function (d) {
	    return d.data.type;
	  }).attr('r', 3.5).call(drag(simulation$1)).on('mouseover', function (_, i) {
	    return showTooltip(i);
	  }).on('mouseout', function (_, i) {
	    return hideTooltip();
	  });

	  function zoomed(_ref) {
	    var transform = _ref.transform;
	    graph.attr("transform", transform);
	  }

	  svg.call(zoom().extent([[0, 0], [width, height]]).scaleExtent([0.5, 4]).on("zoom", zoomed));

	  var nodePath = function nodePath(d) {
	    return d.ancestors().map(function (d) {
	      return d.data.id;
	    }).reverse().join('/');
	  };

	  node.append('title').text(function (d) {
	    return nodePath(d);
	  });
	  simulation$1.on('tick', function () {
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
	  });
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

	class InternMap extends Map {
	  constructor(entries, key = keyof) {
	    super();
	    Object.defineProperties(this, {
	      _intern: {
	        value: new Map()
	      },
	      _key: {
	        value: key
	      }
	    });
	    if (entries != null) for (const [key, value] of entries) this.set(key, value);
	  }

	  get(key) {
	    return super.get(intern_get(this, key));
	  }

	  has(key) {
	    return super.has(intern_get(this, key));
	  }

	  set(key, value) {
	    return super.set(intern_set(this, key), value);
	  }

	  delete(key) {
	    return super.delete(intern_delete(this, key));
	  }

	}

	function intern_get({
	  _intern,
	  _key
	}, value) {
	  const key = _key(value);

	  return _intern.has(key) ? _intern.get(key) : value;
	}

	function intern_set({
	  _intern,
	  _key
	}, value) {
	  const key = _key(value);

	  if (_intern.has(key)) return _intern.get(key);

	  _intern.set(key, value);

	  return value;
	}

	function intern_delete({
	  _intern,
	  _key
	}, value) {
	  const key = _key(value);

	  if (_intern.has(key)) {
	    value = _intern.get(key);

	    _intern.delete(key);
	  }

	  return value;
	}

	function keyof(value) {
	  return value !== null && typeof value === "object" ? value.valueOf() : value;
	}

	function identity$2(x) {
	  return x;
	}

	function group(values, ...keys) {
	  return nest(values, identity$2, identity$2, keys);
	}

	function nest(values, map, reduce, keys) {
	  return function regroup(values, i) {
	    if (i >= keys.length) return reduce(values);
	    const groups = new InternMap();
	    const keyof = keys[i++];
	    let index = -1;

	    for (const value of values) {
	      const key = keyof(value, ++index, values);
	      const group = groups.get(key);
	      if (group) group.push(value);else groups.set(key, [value]);
	    }

	    for (const [key, values] of groups) {
	      groups.set(key, regroup(values, i));
	    }

	    return map(groups);
	  }(values, 0);
	}

	var e10 = Math.sqrt(50),
	    e5 = Math.sqrt(10),
	    e2 = Math.sqrt(2);
	function ticks(start, stop, count) {
	  var reverse,
	      i = -1,
	      n,
	      ticks,
	      step;
	  stop = +stop, start = +start, count = +count;
	  if (start === stop && count > 0) return [start];
	  if (reverse = stop < start) n = start, start = stop, stop = n;
	  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

	  if (step > 0) {
	    let r0 = Math.round(start / step),
	        r1 = Math.round(stop / step);
	    if (r0 * step < start) ++r0;
	    if (r1 * step > stop) --r1;
	    ticks = new Array(n = r1 - r0 + 1);

	    while (++i < n) ticks[i] = (r0 + i) * step;
	  } else {
	    step = -step;
	    let r0 = Math.round(start * step),
	        r1 = Math.round(stop * step);
	    if (r0 / step < start) ++r0;
	    if (r1 / step > stop) --r1;
	    ticks = new Array(n = r1 - r0 + 1);

	    while (++i < n) ticks[i] = (r0 + i) / step;
	  }

	  if (reverse) ticks.reverse();
	  return ticks;
	}
	function tickIncrement(start, stop, count) {
	  var step = (stop - start) / Math.max(0, count),
	      power = Math.floor(Math.log(step) / Math.LN10),
	      error = step / Math.pow(10, power);
	  return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
	}
	function tickStep(start, stop, count) {
	  var step0 = Math.abs(stop - start) / Math.max(0, count),
	      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	      error = step0 / step1;
	  if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
	  return stop < start ? -step1 : step1;
	}

	const pi$1 = Math.PI,
	      tau$1 = 2 * pi$1,
	      epsilon$1 = 1e-6,
	      tauEpsilon = tau$1 - epsilon$1;

	function Path() {
	  this._x0 = this._y0 = // start of current subpath
	  this._x1 = this._y1 = null; // end of current subpath

	  this._ = "";
	}

	function path() {
	  return new Path();
	}

	Path.prototype = path.prototype = {
	  constructor: Path,
	  moveTo: function (x, y) {
	    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
	  },
	  closePath: function () {
	    if (this._x1 !== null) {
	      this._x1 = this._x0, this._y1 = this._y0;
	      this._ += "Z";
	    }
	  },
	  lineTo: function (x, y) {
	    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  quadraticCurveTo: function (x1, y1, x, y) {
	    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  bezierCurveTo: function (x1, y1, x2, y2, x, y) {
	    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  arcTo: function (x1, y1, x2, y2, r) {
	    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
	    var x0 = this._x1,
	        y0 = this._y1,
	        x21 = x2 - x1,
	        y21 = y2 - y1,
	        x01 = x0 - x1,
	        y01 = y0 - y1,
	        l01_2 = x01 * x01 + y01 * y01; // Is the radius negative? Error.

	    if (r < 0) throw new Error("negative radius: " + r); // Is this path empty? Move to (x1,y1).

	    if (this._x1 === null) {
	      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
	    } // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
	    else if (!(l01_2 > epsilon$1)) ; // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
	    // Equivalently, is (x1,y1) coincident with (x2,y2)?
	    // Or, is the radius zero? Line to (x1,y1).
	    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
	      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
	    } // Otherwise, draw an arc!
	    else {
	      var x20 = x2 - x0,
	          y20 = y2 - y0,
	          l21_2 = x21 * x21 + y21 * y21,
	          l20_2 = x20 * x20 + y20 * y20,
	          l21 = Math.sqrt(l21_2),
	          l01 = Math.sqrt(l01_2),
	          l = r * Math.tan((pi$1 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
	          t01 = l / l01,
	          t21 = l / l21; // If the start tangent is not coincident with (x0,y0), line to.

	      if (Math.abs(t01 - 1) > epsilon$1) {
	        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
	      }

	      this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
	    }
	  },
	  arc: function (x, y, r, a0, a1, ccw) {
	    x = +x, y = +y, r = +r, ccw = !!ccw;
	    var dx = r * Math.cos(a0),
	        dy = r * Math.sin(a0),
	        x0 = x + dx,
	        y0 = y + dy,
	        cw = 1 ^ ccw,
	        da = ccw ? a0 - a1 : a1 - a0; // Is the radius negative? Error.

	    if (r < 0) throw new Error("negative radius: " + r); // Is this path empty? Move to (x0,y0).

	    if (this._x1 === null) {
	      this._ += "M" + x0 + "," + y0;
	    } // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
	    else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
	      this._ += "L" + x0 + "," + y0;
	    } // Is this arc empty? We’re done.


	    if (!r) return; // Does the angle go the wrong way? Flip the direction.

	    if (da < 0) da = da % tau$1 + tau$1; // Is this a complete circle? Draw two arcs to complete the circle.

	    if (da > tauEpsilon) {
	      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
	    } // Is this arc non-empty? Draw an arc!
	    else if (da > epsilon$1) {
	      this._ += "A" + r + "," + r + ",0," + +(da >= pi$1) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
	    }
	  },
	  rect: function (x, y, w, h) {
	    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
	  },
	  toString: function () {
	    return this._;
	  }
	};

	function formatDecimal (x) {
	  return Math.abs(x = Math.round(x)) >= 1e21 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
	} // Computes the decimal coefficient and exponent of the specified number x with
	// significant digits p, where x is positive and p is in [1, 21] or undefined.
	// For example, formatDecimalParts(1.23) returns ["123", 0].

	function formatDecimalParts(x, p) {
	  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity

	  var i,
	      coefficient = x.slice(0, i); // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).

	  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
	}

	function exponent (x) {
	  return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
	}

	function formatGroup (grouping, thousands) {
	  return function (value, width) {
	    var i = value.length,
	        t = [],
	        j = 0,
	        g = grouping[0],
	        length = 0;

	    while (i > 0 && g > 0) {
	      if (length + g + 1 > width) g = Math.max(1, width - length);
	      t.push(value.substring(i -= g, i + g));
	      if ((length += g + 1) > width) break;
	      g = grouping[j = (j + 1) % grouping.length];
	    }

	    return t.reverse().join(thousands);
	  };
	}

	function formatNumerals (numerals) {
	  return function (value) {
	    return value.replace(/[0-9]/g, function (i) {
	      return numerals[+i];
	    });
	  };
	}

	// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
	var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
	function formatSpecifier(specifier) {
	  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
	  var match;
	  return new FormatSpecifier({
	    fill: match[1],
	    align: match[2],
	    sign: match[3],
	    symbol: match[4],
	    zero: match[5],
	    width: match[6],
	    comma: match[7],
	    precision: match[8] && match[8].slice(1),
	    trim: match[9],
	    type: match[10]
	  });
	}
	formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

	function FormatSpecifier(specifier) {
	  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
	  this.align = specifier.align === undefined ? ">" : specifier.align + "";
	  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
	  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
	  this.zero = !!specifier.zero;
	  this.width = specifier.width === undefined ? undefined : +specifier.width;
	  this.comma = !!specifier.comma;
	  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
	  this.trim = !!specifier.trim;
	  this.type = specifier.type === undefined ? "" : specifier.type + "";
	}

	FormatSpecifier.prototype.toString = function () {
	  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === undefined ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
	};

	// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
	function formatTrim (s) {
	  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
	    switch (s[i]) {
	      case ".":
	        i0 = i1 = i;
	        break;

	      case "0":
	        if (i0 === 0) i0 = i;
	        i1 = i;
	        break;

	      default:
	        if (!+s[i]) break out;
	        if (i0 > 0) i0 = 0;
	        break;
	    }
	  }

	  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
	}

	var prefixExponent;
	function formatPrefixAuto (x, p) {
	  var d = formatDecimalParts(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1],
	      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	      n = coefficient.length;
	  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	}

	function formatRounded (x, p) {
	  var d = formatDecimalParts(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1];
	  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	}

	var formatTypes = {
	  "%": (x, p) => (x * 100).toFixed(p),
	  "b": x => Math.round(x).toString(2),
	  "c": x => x + "",
	  "d": formatDecimal,
	  "e": (x, p) => x.toExponential(p),
	  "f": (x, p) => x.toFixed(p),
	  "g": (x, p) => x.toPrecision(p),
	  "o": x => Math.round(x).toString(8),
	  "p": (x, p) => formatRounded(x * 100, p),
	  "r": formatRounded,
	  "s": formatPrefixAuto,
	  "X": x => Math.round(x).toString(16).toUpperCase(),
	  "x": x => Math.round(x).toString(16)
	};

	function identity$1 (x) {
	  return x;
	}

	var map = Array.prototype.map,
	    prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
	function formatLocale (locale) {
	  var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
	      currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
	      currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
	      decimal = locale.decimal === undefined ? "." : locale.decimal + "",
	      numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
	      percent = locale.percent === undefined ? "%" : locale.percent + "",
	      minus = locale.minus === undefined ? "−" : locale.minus + "",
	      nan = locale.nan === undefined ? "NaN" : locale.nan + "";

	  function newFormat(specifier) {
	    specifier = formatSpecifier(specifier);
	    var fill = specifier.fill,
	        align = specifier.align,
	        sign = specifier.sign,
	        symbol = specifier.symbol,
	        zero = specifier.zero,
	        width = specifier.width,
	        comma = specifier.comma,
	        precision = specifier.precision,
	        trim = specifier.trim,
	        type = specifier.type; // The "n" type is an alias for ",g".

	    if (type === "n") comma = true, type = "g"; // The "" type, and any invalid type, is an alias for ".12~g".
	    else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g"; // If zero fill is specified, padding goes after sign and before digits.

	    if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "="; // Compute the prefix and suffix.
	    // For SI-prefix, the suffix is lazily computed.

	    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	        suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : ""; // What format function should we use?
	    // Is this an integer type?
	    // Can this type generate exponential notation?

	    var formatType = formatTypes[type],
	        maybeSuffix = /[defgprs%]/.test(type); // Set the default precision if not specified,
	    // or clamp the specified precision to the supported range.
	    // For significant precision, it must be in [1, 21].
	    // For fixed precision, it must be in [0, 20].

	    precision = precision === undefined ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

	    function format(value) {
	      var valuePrefix = prefix,
	          valueSuffix = suffix,
	          i,
	          n,
	          c;

	      if (type === "c") {
	        valueSuffix = formatType(value) + valueSuffix;
	        value = "";
	      } else {
	        value = +value; // Determine the sign. -0 is not less than 0, but 1 / -0 is!

	        var valueNegative = value < 0 || 1 / value < 0; // Perform the initial formatting.

	        value = isNaN(value) ? nan : formatType(Math.abs(value), precision); // Trim insignificant zeros.

	        if (trim) value = formatTrim(value); // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.

	        if (valueNegative && +value === 0 && sign !== "+") valueNegative = false; // Compute the prefix and suffix.

	        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : ""); // Break the formatted value into the integer “value” part that can be
	        // grouped, and fractional or exponential “suffix” part that is not.

	        if (maybeSuffix) {
	          i = -1, n = value.length;

	          while (++i < n) {
	            if (c = value.charCodeAt(i), 48 > c || c > 57) {
	              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	              value = value.slice(0, i);
	              break;
	            }
	          }
	        }
	      } // If the fill character is not "0", grouping is applied before padding.


	      if (comma && !zero) value = group(value, Infinity); // Compute the padding.

	      var length = valuePrefix.length + value.length + valueSuffix.length,
	          padding = length < width ? new Array(width - length + 1).join(fill) : ""; // If the fill character is "0", grouping is applied after padding.

	      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = ""; // Reconstruct the final output based on the desired alignment.

	      switch (align) {
	        case "<":
	          value = valuePrefix + value + valueSuffix + padding;
	          break;

	        case "=":
	          value = valuePrefix + padding + value + valueSuffix;
	          break;

	        case "^":
	          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
	          break;

	        default:
	          value = padding + valuePrefix + value + valueSuffix;
	          break;
	      }

	      return numerals(value);
	    }

	    format.toString = function () {
	      return specifier + "";
	    };

	    return format;
	  }

	  function formatPrefix(specifier, value) {
	    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
	        k = Math.pow(10, -e),
	        prefix = prefixes[8 + e / 3];
	    return function (value) {
	      return f(k * value) + prefix;
	    };
	  }

	  return {
	    format: newFormat,
	    formatPrefix: formatPrefix
	  };
	}

	var locale;
	var format;
	var formatPrefix;
	defaultLocale({
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	});
	function defaultLocale(definition) {
	  locale = formatLocale(definition);
	  format = locale.format;
	  formatPrefix = locale.formatPrefix;
	  return locale;
	}

	function precisionFixed (step) {
	  return Math.max(0, -exponent(Math.abs(step)));
	}

	function precisionPrefix (step, value) {
	  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
	}

	function precisionRound (step, max) {
	  step = Math.abs(step), max = Math.abs(max) - step;
	  return Math.max(0, exponent(max) - exponent(step)) + 1;
	}

	function initRange(domain, range) {
	  switch (arguments.length) {
	    case 0:
	      break;

	    case 1:
	      this.range(domain);
	      break;

	    default:
	      this.range(range).domain(domain);
	      break;
	  }

	  return this;
	}
	function initInterpolator(domain, interpolator) {
	  switch (arguments.length) {
	    case 0:
	      break;

	    case 1:
	      {
	        if (typeof domain === "function") this.interpolator(domain);else this.range(domain);
	        break;
	      }

	    default:
	      {
	        this.domain(domain);
	        if (typeof interpolator === "function") this.interpolator(interpolator);else this.range(interpolator);
	        break;
	      }
	  }

	  return this;
	}

	const implicit = Symbol("implicit");
	function ordinal() {
	  var index = new InternMap(),
	      domain = [],
	      range = [],
	      unknown = implicit;

	  function scale(d) {
	    let i = index.get(d);

	    if (i === undefined) {
	      if (unknown !== implicit) return unknown;
	      index.set(d, i = domain.push(d) - 1);
	    }

	    return range[i % range.length];
	  }

	  scale.domain = function (_) {
	    if (!arguments.length) return domain.slice();
	    domain = [], index = new InternMap();

	    for (const value of _) {
	      if (index.has(value)) continue;
	      index.set(value, domain.push(value) - 1);
	    }

	    return scale;
	  };

	  scale.range = function (_) {
	    return arguments.length ? (range = Array.from(_), scale) : range.slice();
	  };

	  scale.unknown = function (_) {
	    return arguments.length ? (unknown = _, scale) : unknown;
	  };

	  scale.copy = function () {
	    return ordinal(domain, range).unknown(unknown);
	  };

	  initRange.apply(scale, arguments);
	  return scale;
	}

	function identity(x) {
	  return x;
	}

	function tickFormat(start, stop, count, specifier) {
	  var step = tickStep(start, stop, count),
	      precision;
	  specifier = formatSpecifier(specifier == null ? ",f" : specifier);

	  switch (specifier.type) {
	    case "s":
	      {
	        var value = Math.max(Math.abs(start), Math.abs(stop));
	        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
	        return formatPrefix(specifier, value);
	      }

	    case "":
	    case "e":
	    case "g":
	    case "p":
	    case "r":
	      {
	        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
	        break;
	      }

	    case "f":
	    case "%":
	      {
	        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
	        break;
	      }
	  }

	  return format(specifier);
	}

	function linearish(scale) {
	  var domain = scale.domain;

	  scale.ticks = function (count) {
	    var d = domain();
	    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
	  };

	  scale.tickFormat = function (count, specifier) {
	    var d = domain();
	    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
	  };

	  scale.nice = function (count) {
	    if (count == null) count = 10;
	    var d = domain();
	    var i0 = 0;
	    var i1 = d.length - 1;
	    var start = d[i0];
	    var stop = d[i1];
	    var prestep;
	    var step;
	    var maxIter = 10;

	    if (stop < start) {
	      step = start, start = stop, stop = step;
	      step = i0, i0 = i1, i1 = step;
	    }

	    while (maxIter-- > 0) {
	      step = tickIncrement(start, stop, count);

	      if (step === prestep) {
	        d[i0] = start;
	        d[i1] = stop;
	        return domain(d);
	      } else if (step > 0) {
	        start = Math.floor(start / step) * step;
	        stop = Math.ceil(stop / step) * step;
	      } else if (step < 0) {
	        start = Math.ceil(start * step) / step;
	        stop = Math.floor(stop * step) / step;
	      } else {
	        break;
	      }

	      prestep = step;
	    }

	    return scale;
	  };

	  return scale;
	}

	function transformer() {
	  var x0 = 0,
	      x1 = 1,
	      t0,
	      t1,
	      k10,
	      transform,
	      interpolator = identity,
	      clamp = false,
	      unknown;

	  function scale(x) {
	    return x == null || isNaN(x = +x) ? unknown : interpolator(k10 === 0 ? 0.5 : (x = (transform(x) - t0) * k10, clamp ? Math.max(0, Math.min(1, x)) : x));
	  }

	  scale.domain = function (_) {
	    return arguments.length ? ([x0, x1] = _, t0 = transform(x0 = +x0), t1 = transform(x1 = +x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0), scale) : [x0, x1];
	  };

	  scale.clamp = function (_) {
	    return arguments.length ? (clamp = !!_, scale) : clamp;
	  };

	  scale.interpolator = function (_) {
	    return arguments.length ? (interpolator = _, scale) : interpolator;
	  };

	  function range(interpolate) {
	    return function (_) {
	      var r0, r1;
	      return arguments.length ? ([r0, r1] = _, interpolator = interpolate(r0, r1), scale) : [interpolator(0), interpolator(1)];
	    };
	  }

	  scale.range = range(interpolate$1);
	  scale.rangeRound = range(interpolateRound);

	  scale.unknown = function (_) {
	    return arguments.length ? (unknown = _, scale) : unknown;
	  };

	  return function (t) {
	    transform = t, t0 = t(x0), t1 = t(x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0);
	    return scale;
	  };
	}

	function copy(source, target) {
	  return target.domain(source.domain()).interpolator(source.interpolator()).clamp(source.clamp()).unknown(source.unknown());
	}
	function sequential() {
	  var scale = linearish(transformer()(identity));

	  scale.copy = function () {
	    return copy(scale, sequential());
	  };

	  return initInterpolator.apply(scale, arguments);
	}

	function colors (specifier) {
	  var n = specifier.length / 6 | 0,
	      colors = new Array(n),
	      i = 0;

	  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);

	  return colors;
	}

	cubehelixLong(cubehelix$1(-100, 0.75, 0.35), cubehelix$1(80, 1.50, 0.8));
	cubehelixLong(cubehelix$1(260, 0.75, 0.35), cubehelix$1(80, 1.50, 0.8));
	var c = cubehelix$1();
	function rainbow (t) {
	  if (t < 0 || t > 1) t -= Math.floor(t);
	  var ts = Math.abs(t - 0.5);
	  c.h = 360 * t - 100;
	  c.s = 1.5 - 1.5 * ts;
	  c.l = 0.8 - 0.9 * ts;
	  return c + "";
	}

	function ramp(range) {
	  var n = range.length;
	  return function (t) {
	    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
	  };
	}

	ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
	var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
	ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
	ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

	function constant (x) {
	  return function constant() {
	    return x;
	  };
	}

	var abs = Math.abs;
	var atan2 = Math.atan2;
	var cos = Math.cos;
	var max = Math.max;
	var min$1 = Math.min;
	var sin = Math.sin;
	var sqrt = Math.sqrt;
	var epsilon = 1e-12;
	var pi = Math.PI;
	var halfPi = pi / 2;
	var tau = 2 * pi;
	function acos(x) {
	  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
	}
	function asin(x) {
	  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
	}

	function arcInnerRadius(d) {
	  return d.innerRadius;
	}

	function arcOuterRadius(d) {
	  return d.outerRadius;
	}

	function arcStartAngle(d) {
	  return d.startAngle;
	}

	function arcEndAngle(d) {
	  return d.endAngle;
	}

	function arcPadAngle(d) {
	  return d && d.padAngle; // Note: optional!
	}

	function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
	  var x10 = x1 - x0,
	      y10 = y1 - y0,
	      x32 = x3 - x2,
	      y32 = y3 - y2,
	      t = y32 * x10 - x32 * y10;
	  if (t * t < epsilon) return;
	  t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
	  return [x0 + t * x10, y0 + t * y10];
	} // Compute perpendicular offset line of length rc.
	// http://mathworld.wolfram.com/Circle-LineIntersection.html


	function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
	  var x01 = x0 - x1,
	      y01 = y0 - y1,
	      lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
	      ox = lo * y01,
	      oy = -lo * x01,
	      x11 = x0 + ox,
	      y11 = y0 + oy,
	      x10 = x1 + ox,
	      y10 = y1 + oy,
	      x00 = (x11 + x10) / 2,
	      y00 = (y11 + y10) / 2,
	      dx = x10 - x11,
	      dy = y10 - y11,
	      d2 = dx * dx + dy * dy,
	      r = r1 - rc,
	      D = x11 * y10 - x10 * y11,
	      d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)),
	      cx0 = (D * dy - dx * d) / d2,
	      cy0 = (-D * dx - dy * d) / d2,
	      cx1 = (D * dy + dx * d) / d2,
	      cy1 = (-D * dx + dy * d) / d2,
	      dx0 = cx0 - x00,
	      dy0 = cy0 - y00,
	      dx1 = cx1 - x00,
	      dy1 = cy1 - y00; // Pick the closer of the two intersection points.
	  // TODO Is there a faster way to determine which intersection to use?

	  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
	  return {
	    cx: cx0,
	    cy: cy0,
	    x01: -ox,
	    y01: -oy,
	    x11: cx0 * (r1 / r - 1),
	    y11: cy0 * (r1 / r - 1)
	  };
	}

	function arc () {
	  var innerRadius = arcInnerRadius,
	      outerRadius = arcOuterRadius,
	      cornerRadius = constant(0),
	      padRadius = null,
	      startAngle = arcStartAngle,
	      endAngle = arcEndAngle,
	      padAngle = arcPadAngle,
	      context = null;

	  function arc() {
	    var buffer,
	        r,
	        r0 = +innerRadius.apply(this, arguments),
	        r1 = +outerRadius.apply(this, arguments),
	        a0 = startAngle.apply(this, arguments) - halfPi,
	        a1 = endAngle.apply(this, arguments) - halfPi,
	        da = abs(a1 - a0),
	        cw = a1 > a0;
	    if (!context) context = buffer = path(); // Ensure that the outer radius is always larger than the inner radius.

	    if (r1 < r0) r = r1, r1 = r0, r0 = r; // Is it a point?

	    if (!(r1 > epsilon)) context.moveTo(0, 0); // Or is it a circle or annulus?
	    else if (da > tau - epsilon) {
	      context.moveTo(r1 * cos(a0), r1 * sin(a0));
	      context.arc(0, 0, r1, a0, a1, !cw);

	      if (r0 > epsilon) {
	        context.moveTo(r0 * cos(a1), r0 * sin(a1));
	        context.arc(0, 0, r0, a1, a0, cw);
	      }
	    } // Or is it a circular or annular sector?
	    else {
	      var a01 = a0,
	          a11 = a1,
	          a00 = a0,
	          a10 = a1,
	          da0 = da,
	          da1 = da,
	          ap = padAngle.apply(this, arguments) / 2,
	          rp = ap > epsilon && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
	          rc = min$1(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
	          rc0 = rc,
	          rc1 = rc,
	          t0,
	          t1; // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.

	      if (rp > epsilon) {
	        var p0 = asin(rp / r0 * sin(ap)),
	            p1 = asin(rp / r1 * sin(ap));
	        if ((da0 -= p0 * 2) > epsilon) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
	        if ((da1 -= p1 * 2) > epsilon) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
	      }

	      var x01 = r1 * cos(a01),
	          y01 = r1 * sin(a01),
	          x10 = r0 * cos(a10),
	          y10 = r0 * sin(a10); // Apply rounded corners?

	      if (rc > epsilon) {
	        var x11 = r1 * cos(a11),
	            y11 = r1 * sin(a11),
	            x00 = r0 * cos(a00),
	            y00 = r0 * sin(a00),
	            oc; // Restrict the corner radius according to the sector angle.

	        if (da < pi && (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10))) {
	          var ax = x01 - oc[0],
	              ay = y01 - oc[1],
	              bx = x11 - oc[0],
	              by = y11 - oc[1],
	              kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
	              lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
	          rc0 = min$1(rc, (r0 - lc) / (kc - 1));
	          rc1 = min$1(rc, (r1 - lc) / (kc + 1));
	        }
	      } // Is the sector collapsed to a line?


	      if (!(da1 > epsilon)) context.moveTo(x01, y01); // Does the sector’s outer ring have rounded corners?
	      else if (rc1 > epsilon) {
	        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
	        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
	        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01); // Have the corners merged?

	        if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw); // Otherwise, draw the two corners and the ring.
	        else {
	          context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
	          context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
	          context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
	        }
	      } // Or is the outer ring just a circular arc?
	      else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw); // Is there no inner ring, and it’s a circular sector?
	      // Or perhaps it’s an annular sector collapsed due to padding?

	      if (!(r0 > epsilon) || !(da0 > epsilon)) context.lineTo(x10, y10); // Does the sector’s inner ring (or point) have rounded corners?
	      else if (rc0 > epsilon) {
	        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
	        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
	        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01); // Have the corners merged?

	        if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw); // Otherwise, draw the two corners and the ring.
	        else {
	          context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
	          context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
	          context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
	        }
	      } // Or is the inner ring just a circular arc?
	      else context.arc(0, 0, r0, a10, a00, cw);
	    }
	    context.closePath();
	    if (buffer) return context = null, buffer + "" || null;
	  }

	  arc.centroid = function () {
	    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
	        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi / 2;
	    return [cos(a) * r, sin(a) * r];
	  };

	  arc.innerRadius = function (_) {
	    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant(+_), arc) : innerRadius;
	  };

	  arc.outerRadius = function (_) {
	    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant(+_), arc) : outerRadius;
	  };

	  arc.cornerRadius = function (_) {
	    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant(+_), arc) : cornerRadius;
	  };

	  arc.padRadius = function (_) {
	    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant(+_), arc) : padRadius;
	  };

	  arc.startAngle = function (_) {
	    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), arc) : startAngle;
	  };

	  arc.endAngle = function (_) {
	    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), arc) : endAngle;
	  };

	  arc.padAngle = function (_) {
	    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), arc) : padAngle;
	  };

	  arc.context = function (_) {
	    return arguments.length ? (context = _ == null ? null : _, arc) : context;
	  };

	  return arc;
	}

	var slice = Array.prototype.slice;

	function x(p) {
	  return p[0];
	}
	function y(p) {
	  return p[1];
	}

	function pointRadial (x, y) {
	  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
	}

	function linkSource(d) {
	  return d.source;
	}

	function linkTarget(d) {
	  return d.target;
	}

	function link(curve) {
	  var source = linkSource,
	      target = linkTarget,
	      x$1 = x,
	      y$1 = y,
	      context = null;

	  function link() {
	    var buffer,
	        argv = slice.call(arguments),
	        s = source.apply(this, argv),
	        t = target.apply(this, argv);
	    if (!context) context = buffer = path();
	    curve(context, +x$1.apply(this, (argv[0] = s, argv)), +y$1.apply(this, argv), +x$1.apply(this, (argv[0] = t, argv)), +y$1.apply(this, argv));
	    if (buffer) return context = null, buffer + "" || null;
	  }

	  link.source = function (_) {
	    return arguments.length ? (source = _, link) : source;
	  };

	  link.target = function (_) {
	    return arguments.length ? (target = _, link) : target;
	  };

	  link.x = function (_) {
	    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), link) : x$1;
	  };

	  link.y = function (_) {
	    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), link) : y$1;
	  };

	  link.context = function (_) {
	    return arguments.length ? (context = _ == null ? null : _, link) : context;
	  };

	  return link;
	}

	function curveRadial(context, x0, y0, x1, y1) {
	  var p0 = pointRadial(x0, y0),
	      p1 = pointRadial(x0, y0 = (y0 + y1) / 2),
	      p2 = pointRadial(x1, y0),
	      p3 = pointRadial(x1, y1);
	  context.moveTo(p0[0], p0[1]);
	  context.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
	}
	function linkRadial() {
	  var l = link(curveRadial);
	  l.angle = l.x, delete l.x;
	  l.radius = l.y, delete l.y;
	  return l;
	}

	var radialTree = function radialTree(ecosystem, element) {
	  var width = 800;
	  var radius = width / 2;
	  var svg = element.append("svg");
	  var tree$1 = tree().size([2 * Math.PI, radius]).separation(function (a, b) {
	    return (a.parent == b.parent ? 1 : 2) / a.depth;
	  });
	  var root = tree$1(ecosystem);
	  svg.append("g").attr("fill", "none").attr("stroke", "#555").attr("stroke-opacity", 0.4).attr("stroke-width", 1.5).selectAll("path").data(root.links()).join("path").attr("d", linkRadial().angle(function (d) {
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
	    return d.data.id;
	  }).clone(true).lower().attr("stroke", "white");
	  return svg.attr("viewBox", autoBox).node();
	};

	var global$6 = global$y;
	var classof$2 = classof$5;
	var String$1 = global$6.String;

	var toString$4 = function (argument) {
	  if (classof$2(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
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

	var $$1 = _export;
	var uncurryThis$4 = functionUncurryThis;
	var aCallable = aCallable$9;
	var toObject = toObject$5;
	var lengthOfArrayLike = lengthOfArrayLike$4;
	var toString$3 = toString$4;
	var fails$5 = fails$i;
	var internalSort = arraySort;
	var arrayMethodIsStrict = arrayMethodIsStrict$2;
	var FF = engineFfVersion;
	var IE_OR_EDGE = engineIsIeOrEdge;
	var V8 = engineV8Version;
	var WEBKIT = engineWebkitVersion;
	var test = [];
	var un$Sort = uncurryThis$4(test.sort);
	var push$1 = uncurryThis$4(test.push); // IE8-

	var FAILS_ON_UNDEFINED = fails$5(function () {
	  test.sort(undefined);
	}); // V8 bug

	var FAILS_ON_NULL = fails$5(function () {
	  test.sort(null);
	}); // Old WebKit

	var STRICT_METHOD = arrayMethodIsStrict('sort');
	var STABLE_SORT = !fails$5(function () {
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
	var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

	var getSortCompare = function (comparefn) {
	  return function (x, y) {
	    if (y === undefined) return -1;
	    if (x === undefined) return 1;
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    return toString$3(x) > toString$3(y) ? 1 : -1;
	  };
	}; // `Array.prototype.sort` method
	// https://tc39.es/ecma262/#sec-array.prototype.sort


	$$1({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  sort: function sort(comparefn) {
	    if (comparefn !== undefined) aCallable(comparefn);
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

	var sunburst = function sunburst(ecosystem, element) {
	  var width = 800;
	  var radius = width / 2;
	  var format$1 = format(",d");
	  var color = ordinal(quantize(rainbow, ecosystem.children.length + 1));
	  var arc$1 = arc().startAngle(function (d) {
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

	  var partition$1 = function partition$1(data) {
	    return partition().size([2 * Math.PI, radius])(data.sum(function (d) {
	      return 1;
	    }).sort(function (a, b) {
	      return b.value - a.value;
	    }));
	  };

	  var root = partition$1(ecosystem);
	  var svg = element.append("svg");
	  svg.append("g").attr("fill-opacity", 0.6).selectAll("path").data(root.descendants().filter(function (d) {
	    return d.depth;
	  })).join("path").attr("fill", function (d) {
	    while (d.depth > 1) {
	      d = d.parent;
	    }

	    return color(d.data.id);
	  }).attr("d", arc$1).append("title").text(function (d) {
	    return "".concat(d.ancestors().map(function (d) {
	      return d.data.id;
	    }).reverse().join("/"), "\n").concat(format$1(d.value));
	  });
	  svg.append("g").attr("pointer-events", "none").attr("text-anchor", "middle").attr("font-size", 10).attr("font-family", "sans-serif").selectAll("text").data(root.descendants().filter(function (d) {
	    return d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10;
	  })).join("text").attr("transform", function (d) {
	    var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
	    var y = (d.y0 + d.y1) / 2;
	    return "rotate(".concat(x - 90, ") translate(").concat(y, ",0) rotate(").concat(x < 180 ? 0 : 180, ")");
	  }).attr("dy", "0.35em").text(function (d) {
	    return d.data.id;
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
	var toString$2 = toString$4;
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
	var toString$1 = toString$4;
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
	var toString = toString$4;
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
	    return index().size([width - 2, height - 2]).padding(3)(data.sum(function (d) {
	      return d.children ? 0 : 1;
	    }).sort(function (a, b) {
	      return b.value - a.value;
	    }));
	  };

	  var root = pack(ecosystem);
	  var svg = element.append("svg").attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif").attr("text-anchor", "middle");
	  var shadow = sid('filter');
	  svg.append("filter").attr("id", shadow).append("feDropShadow").attr("flood-opacity", 0.3).attr("dx", 0).attr("dy", 1);
	  var node = svg.selectAll("g").data(group(root.descendants(), function (d) {
	    return d.height;
	  })).join("g").attr("filter", "url(#".concat(shadow)).selectAll("g").data(function (d) {
	    return d[1];
	  }).join("g").attr("transform", function (d) {
	    return "translate(".concat(d.x + 1, ",").concat(d.y + 1, ")");
	  });
	  var color = sequential([8, 0], magma);
	  var format$1 = format(",d");
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
	    return d.data.id.split(/(?=[A-Z][a-z])|\s+/g);
	  }).join("tspan").attr("x", 0).attr("y", function (d, i, nodes) {
	    return "".concat(i - nodes.length / 2 + 0.8, "em");
	  }).text(function (d) {
	    return d;
	  });
	  node.append("title").text(function (d) {
	    return "".concat(d.ancestors().map(function (d) {
	      return d.data.id;
	    }).reverse().join("/"), "\n").concat(format$1(d.value));
	  });
	  return svg.node();
	};

	csv('ecosystem-tree.csv').then(function (data) {
	  var ecosystem = stratify().id(function (x) {
	    return x.id;
	  }).parentId(function (x) {
	    return x.parent;
	  })(data);
	  forceTree(ecosystem, select("#tree"));
	  packChart(ecosystem, select("#pack-chart"));
	  sunburst(ecosystem, select("#sunburst"));
	  radialTree(ecosystem, select("#radial-tree"));
	});

})();
