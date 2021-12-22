(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global$A = // eslint-disable-next-line es/no-global-this -- safe
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
	check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
	function () {
	  return this;
	}() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$d = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$c = fails$d; // Detect IE8's incomplete defineProperty implementation

	var descriptors = !fails$c(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var call$c = Function.prototype.call;
	var functionCall = call$c.bind ? call$c.bind(call$c) : function () {
	  return call$c.apply(call$c, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable$1 = {}.propertyIsEnumerable; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable$1.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$1(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable$1;

	var createPropertyDescriptor$4 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var FunctionPrototype$3 = Function.prototype;
	var bind$4 = FunctionPrototype$3.bind;
	var call$b = FunctionPrototype$3.call;
	var callBind = bind$4 && bind$4.bind(call$b);
	var functionUncurryThis = bind$4 ? function (fn) {
	  return fn && callBind(call$b, fn);
	} : function (fn) {
	  return fn && function () {
	    return call$b.apply(fn, arguments);
	  };
	};

	var uncurryThis$h = functionUncurryThis;
	var toString$4 = uncurryThis$h({}.toString);
	var stringSlice$1 = uncurryThis$h(''.slice);

	var classofRaw$1 = function (it) {
	  return stringSlice$1(toString$4(it), 8, -1);
	};

	var global$z = global$A;
	var uncurryThis$g = functionUncurryThis;
	var fails$b = fails$d;
	var classof$7 = classofRaw$1;
	var Object$5 = global$z.Object;
	var split = uncurryThis$g(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails$b(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$5('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$7(it) == 'String' ? split(it, '') : Object$5(it);
	} : Object$5;

	var global$y = global$A;
	var TypeError$d = global$y.TypeError; // `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible

	var requireObjectCoercible$2 = function (it) {
	  if (it == undefined) throw TypeError$d("Can't call method on " + it);
	  return it;
	};

	var IndexedObject$2 = indexedObject;
	var requireObjectCoercible$1 = requireObjectCoercible$2;

	var toIndexedObject$7 = function (it) {
	  return IndexedObject$2(requireObjectCoercible$1(it));
	};

	// https://tc39.es/ecma262/#sec-iscallable

	var isCallable$h = function (argument) {
	  return typeof argument == 'function';
	};

	var isCallable$g = isCallable$h;

	var isObject$8 = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$g(it);
	};

	var global$x = global$A;
	var isCallable$f = isCallable$h;

	var aFunction = function (argument) {
	  return isCallable$f(argument) ? argument : undefined;
	};

	var getBuiltIn$8 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$x[namespace]) : global$x[namespace] && global$x[namespace][method];
	};

	var uncurryThis$f = functionUncurryThis;
	var objectIsPrototypeOf = uncurryThis$f({}.isPrototypeOf);

	var getBuiltIn$7 = getBuiltIn$8;
	var engineUserAgent = getBuiltIn$7('navigator', 'userAgent') || '';

	var global$w = global$A;
	var userAgent = engineUserAgent;
	var process = global$w.process;
	var Deno = global$w.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us

	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	} // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0


	if (!version && userAgent) {
	  match = userAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = userAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION$2 = engineV8Version;
	var fails$a = fails$d; // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$a(function () {
	  var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

	  return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	  !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL$3 = nativeSymbol;
	var useSymbolAsUid = NATIVE_SYMBOL$3 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

	var global$v = global$A;
	var getBuiltIn$6 = getBuiltIn$8;
	var isCallable$e = isCallable$h;
	var isPrototypeOf$4 = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
	var Object$4 = global$v.Object;
	var isSymbol$3 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$6('Symbol');
	  return isCallable$e($Symbol) && isPrototypeOf$4($Symbol.prototype, Object$4(it));
	};

	var global$u = global$A;
	var String$3 = global$u.String;

	var tryToString$3 = function (argument) {
	  try {
	    return String$3(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var global$t = global$A;
	var isCallable$d = isCallable$h;
	var tryToString$2 = tryToString$3;
	var TypeError$c = global$t.TypeError; // `Assert: IsCallable(argument) is true`

	var aCallable$a = function (argument) {
	  if (isCallable$d(argument)) return argument;
	  throw TypeError$c(tryToString$2(argument) + ' is not a function');
	};

	var aCallable$9 = aCallable$a; // `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod

	var getMethod$6 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable$9(func);
	};

	var global$s = global$A;
	var call$a = functionCall;
	var isCallable$c = isCallable$h;
	var isObject$7 = isObject$8;
	var TypeError$b = global$s.TypeError; // `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive

	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$c(fn = input.toString) && !isObject$7(val = call$a(fn, input))) return val;
	  if (isCallable$c(fn = input.valueOf) && !isObject$7(val = call$a(fn, input))) return val;
	  if (pref !== 'string' && isCallable$c(fn = input.toString) && !isObject$7(val = call$a(fn, input))) return val;
	  throw TypeError$b("Can't convert object to primitive value");
	};

	var shared$5 = {exports: {}};

	var global$r = global$A; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var defineProperty$4 = Object.defineProperty;

	var setGlobal$3 = function (key, value) {
	  try {
	    defineProperty$4(global$r, key, {
	      value: value,
	      configurable: true,
	      writable: true
	    });
	  } catch (error) {
	    global$r[key] = value;
	  }

	  return value;
	};

	var global$q = global$A;
	var setGlobal$2 = setGlobal$3;
	var SHARED = '__core-js_shared__';
	var store$3 = global$q[SHARED] || setGlobal$2(SHARED, {});
	var sharedStore = store$3;

	var store$2 = sharedStore;
	(shared$5.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.19.1',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});

	var global$p = global$A;
	var requireObjectCoercible = requireObjectCoercible$2;
	var Object$3 = global$p.Object; // `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject

	var toObject$5 = function (argument) {
	  return Object$3(requireObjectCoercible(argument));
	};

	var uncurryThis$e = functionUncurryThis;
	var toObject$4 = toObject$5;
	var hasOwnProperty = uncurryThis$e({}.hasOwnProperty); // `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty

	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$4(it), key);
	};

	var uncurryThis$d = functionUncurryThis;
	var id$1 = 0;
	var postfix = Math.random();
	var toString$3 = uncurryThis$d(1.0.toString);

	var uid$3 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$3(++id$1 + postfix, 36);
	};

	var global$o = global$A;
	var shared$4 = shared$5.exports;
	var hasOwn$c = hasOwnProperty_1;
	var uid$2 = uid$3;
	var NATIVE_SYMBOL$2 = nativeSymbol;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;
	var WellKnownSymbolsStore$1 = shared$4('wks');
	var Symbol$1 = global$o.Symbol;
	var symbolFor = Symbol$1 && Symbol$1['for'];
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$2;

	var wellKnownSymbol$g = function (name) {
	  if (!hasOwn$c(WellKnownSymbolsStore$1, name) || !(NATIVE_SYMBOL$2 || typeof WellKnownSymbolsStore$1[name] == 'string')) {
	    var description = 'Symbol.' + name;

	    if (NATIVE_SYMBOL$2 && hasOwn$c(Symbol$1, name)) {
	      WellKnownSymbolsStore$1[name] = Symbol$1[name];
	    } else if (USE_SYMBOL_AS_UID && symbolFor) {
	      WellKnownSymbolsStore$1[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
	    }
	  }

	  return WellKnownSymbolsStore$1[name];
	};

	var global$n = global$A;
	var call$9 = functionCall;
	var isObject$6 = isObject$8;
	var isSymbol$2 = isSymbol$3;
	var getMethod$5 = getMethod$6;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$f = wellKnownSymbol$g;
	var TypeError$a = global$n.TypeError;
	var TO_PRIMITIVE$1 = wellKnownSymbol$f('toPrimitive'); // `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive

	var toPrimitive$1 = function (input, pref) {
	  if (!isObject$6(input) || isSymbol$2(input)) return input;
	  var exoticToPrim = getMethod$5(input, TO_PRIMITIVE$1);
	  var result;

	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$9(exoticToPrim, input, pref);
	    if (!isObject$6(result) || isSymbol$2(result)) return result;
	    throw TypeError$a("Can't convert object to primitive value");
	  }

	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;
	var isSymbol$1 = isSymbol$3; // `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey

	var toPropertyKey$4 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol$1(key) ? key : key + '';
	};

	var global$m = global$A;
	var isObject$5 = isObject$8;
	var document$1 = global$m.document; // typeof document.createElement is 'object' in old IE

	var EXISTS$1 = isObject$5(document$1) && isObject$5(document$1.createElement);

	var documentCreateElement$2 = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$8 = descriptors;
	var fails$9 = fails$d;
	var createElement = documentCreateElement$2; // Thank's IE8 for his funny defineProperty

	var ie8DomDefine = !DESCRIPTORS$8 && !fails$9(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
	  return Object.defineProperty(createElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var DESCRIPTORS$7 = descriptors;
	var call$8 = functionCall;
	var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
	var createPropertyDescriptor$3 = createPropertyDescriptor$4;
	var toIndexedObject$6 = toIndexedObject$7;
	var toPropertyKey$3 = toPropertyKey$4;
	var hasOwn$b = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$7 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$6(O);
	  P = toPropertyKey$3(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor$1(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (hasOwn$b(O, P)) return createPropertyDescriptor$3(!call$8(propertyIsEnumerableModule$1.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var global$l = global$A;
	var isObject$4 = isObject$8;
	var String$2 = global$l.String;
	var TypeError$9 = global$l.TypeError; // `Assert: Type(argument) is Object`

	var anObject$h = function (argument) {
	  if (isObject$4(argument)) return argument;
	  throw TypeError$9(String$2(argument) + ' is not an object');
	};

	var global$k = global$A;
	var DESCRIPTORS$6 = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var anObject$g = anObject$h;
	var toPropertyKey$2 = toPropertyKey$4;
	var TypeError$8 = global$k.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

	var $defineProperty$1 = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty

	objectDefineProperty.f = DESCRIPTORS$6 ? $defineProperty$1 : function defineProperty(O, P, Attributes) {
	  anObject$g(O);
	  P = toPropertyKey$2(P);
	  anObject$g(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty$1(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$8('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$5 = descriptors;
	var definePropertyModule$4 = objectDefineProperty;
	var createPropertyDescriptor$2 = createPropertyDescriptor$4;
	var createNonEnumerableProperty$7 = DESCRIPTORS$5 ? function (object, key, value) {
	  return definePropertyModule$4.f(object, key, createPropertyDescriptor$2(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$6 = {exports: {}};

	var uncurryThis$c = functionUncurryThis;
	var isCallable$b = isCallable$h;
	var store$1 = sharedStore;
	var functionToString$1 = uncurryThis$c(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

	if (!isCallable$b(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString$1(it);
	  };
	}

	var inspectSource$3 = store$1.inspectSource;

	var global$j = global$A;
	var isCallable$a = isCallable$h;
	var inspectSource$2 = inspectSource$3;
	var WeakMap$1 = global$j.WeakMap;
	var nativeWeakMap = isCallable$a(WeakMap$1) && /native code/.test(inspectSource$2(WeakMap$1));

	var shared$3 = shared$5.exports;
	var uid$1 = uid$3;
	var keys = shared$3('keys');

	var sharedKey$4 = function (key) {
	  return keys[key] || (keys[key] = uid$1(key));
	};

	var hiddenKeys$5 = {};

	var NATIVE_WEAK_MAP = nativeWeakMap;
	var global$i = global$A;
	var uncurryThis$b = functionUncurryThis;
	var isObject$3 = isObject$8;
	var createNonEnumerableProperty$6 = createNonEnumerableProperty$7;
	var hasOwn$a = hasOwnProperty_1;
	var shared$2 = sharedStore;
	var sharedKey$3 = sharedKey$4;
	var hiddenKeys$4 = hiddenKeys$5;
	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$7 = global$i.TypeError;
	var WeakMap = global$i.WeakMap;
	var set$2, get$2, has;

	var enforce = function (it) {
	  return has(it) ? get$2(it) : set$2(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject$3(it) || (state = get$2(it)).type !== TYPE) {
	      throw TypeError$7('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared$2.state) {
	  var store = shared$2.state || (shared$2.state = new WeakMap());
	  var wmget = uncurryThis$b(store.get);
	  var wmhas = uncurryThis$b(store.has);
	  var wmset = uncurryThis$b(store.set);

	  set$2 = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$7(OBJECT_ALREADY_INITIALIZED);
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
	  var STATE = sharedKey$3('state');
	  hiddenKeys$4[STATE] = true;

	  set$2 = function (it, metadata) {
	    if (hasOwn$a(it, STATE)) throw new TypeError$7(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$6(it, STATE, metadata);
	    return metadata;
	  };

	  get$2 = function (it) {
	    return hasOwn$a(it, STATE) ? it[STATE] : {};
	  };

	  has = function (it) {
	    return hasOwn$a(it, STATE);
	  };
	}

	var internalState = {
	  set: set$2,
	  get: get$2,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var DESCRIPTORS$4 = descriptors;
	var hasOwn$9 = hasOwnProperty_1;
	var FunctionPrototype$2 = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

	var getDescriptor = DESCRIPTORS$4 && Object.getOwnPropertyDescriptor;
	var EXISTS = hasOwn$9(FunctionPrototype$2, 'name'); // additional protection from minified / mangled / dropped function names

	var PROPER = EXISTS && function something() {
	  /* empty */
	}.name === 'something';

	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$4 || DESCRIPTORS$4 && getDescriptor(FunctionPrototype$2, 'name').configurable);
	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var global$h = global$A;
	var isCallable$9 = isCallable$h;
	var hasOwn$8 = hasOwnProperty_1;
	var createNonEnumerableProperty$5 = createNonEnumerableProperty$7;
	var setGlobal$1 = setGlobal$3;
	var inspectSource$1 = inspectSource$3;
	var InternalStateModule$3 = internalState;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var getInternalState$3 = InternalStateModule$3.get;
	var enforceInternalState = InternalStateModule$3.enforce;
	var TEMPLATE = String(String).split('String');
	(redefine$6.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;

	  if (isCallable$9(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }

	    if (!hasOwn$8(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
	      createNonEnumerableProperty$5(value, 'name', name);
	    }

	    state = enforceInternalState(value);

	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }

	  if (O === global$h) {
	    if (simple) O[key] = value;else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty$5(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable$9(this) && getInternalState$3(this).source || inspectSource$1(this);
	});

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity

	var toIntegerOrInfinity$2 = function (argument) {
	  var number = +argument; // eslint-disable-next-line no-self-compare -- safe

	  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
	};

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;
	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toIntegerOrInfinity$1(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var toIntegerOrInfinity = toIntegerOrInfinity$2;
	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength

	var toLength$1 = function (argument) {
	  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength = toLength$1; // `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike

	var lengthOfArrayLike$4 = function (obj) {
	  return toLength(obj.length);
	};

	var toIndexedObject$5 = toIndexedObject$7;
	var toAbsoluteIndex = toAbsoluteIndex$1;
	var lengthOfArrayLike$3 = lengthOfArrayLike$4; // `Array.prototype.{ indexOf, includes }` methods implementation

	var createMethod$2 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$5($this);
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

	var uncurryThis$a = functionUncurryThis;
	var hasOwn$7 = hasOwnProperty_1;
	var toIndexedObject$4 = toIndexedObject$7;
	var indexOf = arrayIncludes.indexOf;
	var hiddenKeys$3 = hiddenKeys$5;
	var push$2 = uncurryThis$a([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$4(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !hasOwn$7(hiddenKeys$3, key) && hasOwn$7(O, key) && push$2(result, key); // Don't enum bug & hidden keys


	  while (names.length > i) if (hasOwn$7(O, key = names[i++])) {
	    ~indexOf(result, key) || push$2(result, key);
	  }

	  return result;
	};

	var enumBugKeys$3 = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;
	var hiddenKeys$2 = enumBugKeys$2.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe

	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$2);
	};

	var objectGetOwnPropertySymbols = {};

	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$5 = getBuiltIn$8;
	var uncurryThis$9 = functionUncurryThis;
	var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
	var anObject$f = anObject$h;
	var concat = uncurryThis$9([].concat); // all object keys, includes non-enumerable and symbols

	var ownKeys$1 = getBuiltIn$5('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule$1.f(anObject$f(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$6 = hasOwnProperty_1;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;
	var definePropertyModule$3 = objectDefineProperty;

	var copyConstructorProperties$2 = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$3.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$1.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn$6(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var fails$8 = fails$d;
	var isCallable$8 = isCallable$h;
	var replacement = /#|\.prototype\./;

	var isForced$1 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : isCallable$8(detection) ? fails$8(detection) : !!detection;
	};

	var normalize = isForced$1.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$1.data = {};
	var NATIVE = isForced$1.NATIVE = 'N';
	var POLYFILL = isForced$1.POLYFILL = 'P';
	var isForced_1 = isForced$1;

	var global$g = global$A;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$7;
	var redefine$5 = redefine$6.exports;
	var setGlobal = setGlobal$3;
	var copyConstructorProperties$1 = copyConstructorProperties$2;
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
	    target = global$g;
	  } else if (STATIC) {
	    target = global$g[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$g[TARGET] || {}).prototype;
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
	      copyConstructorProperties$1(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty$4(sourceProperty, 'sham', true);
	    } // extend global


	    redefine$5(target, key, sourceProperty, options);
	  }
	};

	var uncurryThis$8 = functionUncurryThis;
	var aCallable$8 = aCallable$a;
	var bind$3 = uncurryThis$8(uncurryThis$8.bind); // optional / simple context binding

	var functionBindContext = function (fn, that) {
	  aCallable$8(fn);
	  return that === undefined ? fn : bind$3 ? bind$3(fn, that) : function
	    /* ...args */
	  () {
	    return fn.apply(that, arguments);
	  };
	};

	var classof$6 = classofRaw$1; // `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe

	var isArray$4 = Array.isArray || function isArray(argument) {
	  return classof$6(argument) == 'Array';
	};

	var wellKnownSymbol$e = wellKnownSymbol$g;
	var TO_STRING_TAG$5 = wellKnownSymbol$e('toStringTag');
	var test$1 = {};
	test$1[TO_STRING_TAG$5] = 'z';
	var toStringTagSupport = String(test$1) === '[object z]';

	var global$f = global$A;
	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
	var isCallable$7 = isCallable$h;
	var classofRaw = classofRaw$1;
	var wellKnownSymbol$d = wellKnownSymbol$g;
	var TO_STRING_TAG$4 = wellKnownSymbol$d('toStringTag');
	var Object$2 = global$f.Object; // ES3 wrong here

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
	  : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$4)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && isCallable$7(O.callee) ? 'Arguments' : result;
	};

	var uncurryThis$7 = functionUncurryThis;
	var fails$7 = fails$d;
	var isCallable$6 = isCallable$h;
	var classof$4 = classof$5;
	var getBuiltIn$4 = getBuiltIn$8;
	var inspectSource = inspectSource$3;

	var noop$1 = function () {
	  /* empty */
	};

	var empty$1 = [];
	var construct = getBuiltIn$4('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec = uncurryThis$7(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop$1);

	var isConstructorModern = function (argument) {
	  if (!isCallable$6(argument)) return false;

	  try {
	    construct(noop$1, empty$1, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function (argument) {
	  if (!isCallable$6(argument)) return false;

	  switch (classof$4(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction':
	      return false;
	    // we can't check .prototype since constructors produced by .bind haven't it
	  }

	  return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
	}; // `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor


	var isConstructor$1 = !construct || fails$7(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
	    called = true;
	  }) || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var global$e = global$A;
	var isArray$3 = isArray$4;
	var isConstructor = isConstructor$1;
	var isObject$2 = isObject$8;
	var wellKnownSymbol$c = wellKnownSymbol$g;
	var SPECIES$1 = wellKnownSymbol$c('species');
	var Array$1 = global$e.Array; // a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate

	var arraySpeciesConstructor$1 = function (originalArray) {
	  var C;

	  if (isArray$3(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (isConstructor(C) && (C === Array$1 || isArray$3(C.prototype))) C = undefined;else if (isObject$2(C)) {
	      C = C[SPECIES$1];
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

	var bind$2 = functionBindContext;
	var uncurryThis$6 = functionUncurryThis;
	var IndexedObject$1 = indexedObject;
	var toObject$3 = toObject$5;
	var lengthOfArrayLike$2 = lengthOfArrayLike$4;
	var arraySpeciesCreate$1 = arraySpeciesCreate$2;
	var push$1 = uncurryThis$6([].push); // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation

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
	    var boundFunction = bind$2(callbackfn, that);
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
	            push$1(target, value);
	          // filter
	        } else switch (TYPE) {
	          case 4:
	            return false;
	          // every

	          case 7:
	            push$1(target, value);
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

	var fails$6 = fails$d;

	var arrayMethodIsStrict$2 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$6(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var $forEach$2 = arrayIteration.forEach;
	var arrayMethodIsStrict$1 = arrayMethodIsStrict$2;
	var STRICT_METHOD$1 = arrayMethodIsStrict$1('forEach'); // `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach

	var arrayForEach = !STRICT_METHOD$1 ? function forEach(callbackfn
	/* , thisArg */
	) {
	  return $forEach$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined); // eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;

	var $$e = _export;
	var forEach$1 = arrayForEach; // `Array.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe

	$$e({
	  target: 'Array',
	  proto: true,
	  forced: [].forEach != forEach$1
	}, {
	  forEach: forEach$1
	});

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof$3 = classof$5; // `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$3(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var redefine$4 = redefine$6.exports;
	var toString$2 = objectToString; // `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring

	if (!TO_STRING_TAG_SUPPORT) {
	  redefine$4(Object.prototype, 'toString', toString$2, {
	    unsafe: true
	  });
	}

	// https://github.com/tc39/proposal-array-from-async


	var global$d = global$A;
	var call$7 = functionCall;
	var aCallable$7 = aCallable$a;
	var anObject$e = anObject$h;
	var getBuiltIn$3 = getBuiltIn$8;
	var getMethod$4 = getMethod$6;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var TypeError$6 = global$d.TypeError;

	var createMethod = function (TYPE) {
	  var IS_TO_ARRAY = TYPE == 0;
	  var IS_FOR_EACH = TYPE == 1;
	  var IS_EVERY = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  return function (iterator, fn, target) {
	    anObject$e(iterator);
	    var Promise = getBuiltIn$3('Promise');
	    var next = aCallable$7(iterator.next);
	    var index = 0;
	    var MAPPING = fn !== undefined;
	    if (MAPPING || !IS_TO_ARRAY) aCallable$7(fn);
	    return new Promise(function (resolve, reject) {
	      var closeIteration = function (method, argument) {
	        try {
	          var returnMethod = getMethod$4(iterator, 'return');

	          if (returnMethod) {
	            return Promise.resolve(call$7(returnMethod, iterator)).then(function () {
	              method(argument);
	            }, function (error) {
	              reject(error);
	            });
	          }
	        } catch (error2) {
	          return reject(error2);
	        }

	        method(argument);
	      };

	      var onError = function (error) {
	        closeIteration(reject, error);
	      };

	      var loop = function () {
	        try {
	          if (IS_TO_ARRAY && index > MAX_SAFE_INTEGER$1 && MAPPING) {
	            throw TypeError$6('The allowed number of iterations has been exceeded');
	          }

	          Promise.resolve(anObject$e(call$7(next, iterator))).then(function (step) {
	            try {
	              if (anObject$e(step).done) {
	                if (IS_TO_ARRAY) {
	                  target.length = index;
	                  resolve(target);
	                } else resolve(IS_SOME ? false : IS_EVERY || undefined);
	              } else {
	                var value = step.value;

	                if (MAPPING) {
	                  Promise.resolve(IS_TO_ARRAY ? fn(value, index) : fn(value)).then(function (result) {
	                    if (IS_FOR_EACH) {
	                      loop();
	                    } else if (IS_EVERY) {
	                      result ? loop() : closeIteration(resolve, false);
	                    } else if (IS_TO_ARRAY) {
	                      target[index++] = result;
	                      loop();
	                    } else {
	                      result ? closeIteration(resolve, IS_SOME || value) : loop();
	                    }
	                  }, onError);
	                } else {
	                  target[index++] = value;
	                  loop();
	                }
	              }
	            } catch (error) {
	              onError(error);
	            }
	          }, onError);
	        } catch (error2) {
	          onError(error2);
	        }
	      };

	      loop();
	    });
	  };
	};

	var asyncIteratorIteration = {
	  toArray: createMethod(0),
	  forEach: createMethod(1),
	  every: createMethod(2),
	  some: createMethod(3),
	  find: createMethod(4)
	};

	var $$d = _export;
	var $forEach$1 = asyncIteratorIteration.forEach;
	$$d({
	  target: 'AsyncIterator',
	  proto: true,
	  real: true
	}, {
	  forEach: function forEach(fn) {
	    return $forEach$1(this, fn);
	  }
	});

	var global$c = global$A;
	var isPrototypeOf$3 = objectIsPrototypeOf;
	var TypeError$5 = global$c.TypeError;

	var anInstance$1 = function (it, Prototype) {
	  if (isPrototypeOf$3(Prototype, it)) return it;
	  throw TypeError$5('Incorrect invocation');
	};

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3; // `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe

	var objectKeys$2 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS$3 = descriptors;
	var definePropertyModule$2 = objectDefineProperty;
	var anObject$d = anObject$h;
	var toIndexedObject$3 = toIndexedObject$7;
	var objectKeys$1 = objectKeys$2; // `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe

	var objectDefineProperties = DESCRIPTORS$3 ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$d(O);
	  var props = toIndexedObject$3(Properties);
	  var keys = objectKeys$1(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) definePropertyModule$2.f(O, key = keys[index++], props[key]);

	  return O;
	};

	var getBuiltIn$2 = getBuiltIn$8;
	var html$1 = getBuiltIn$2('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */
	var anObject$c = anObject$h;
	var defineProperties = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys$1 = hiddenKeys$5;
	var html = html$1;
	var documentCreateElement$1 = documentCreateElement$2;
	var sharedKey$2 = sharedKey$4;
	var GT = '>';
	var LT = '<';
	var PROTOTYPE$1 = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey$2('IE_PROTO');

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
	  var iframe = documentCreateElement$1('iframe');
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

	  while (length--) delete NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys$1[IE_PROTO$1] = true; // `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE$1] = anObject$c(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE$1] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : defineProperties(result, Properties);
	};

	var fails$5 = fails$d;
	var correctPrototypeGetter = !fails$5(function () {
	  function F() {
	    /* empty */
	  }

	  F.prototype.constructor = null; // eslint-disable-next-line es/no-object-getprototypeof -- required for testing

	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var global$b = global$A;
	var hasOwn$5 = hasOwnProperty_1;
	var isCallable$5 = isCallable$h;
	var toObject$2 = toObject$5;
	var sharedKey$1 = sharedKey$4;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;
	var IE_PROTO = sharedKey$1('IE_PROTO');
	var Object$1 = global$b.Object;
	var ObjectPrototype$1 = Object$1.prototype; // `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof

	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object$1.getPrototypeOf : function (O) {
	  var object = toObject$2(O);
	  if (hasOwn$5(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;

	  if (isCallable$5(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  }

	  return object instanceof Object$1 ? ObjectPrototype$1 : null;
	};

	var fails$4 = fails$d;
	var isCallable$4 = isCallable$h;
	var getPrototypeOf$1 = objectGetPrototypeOf;
	var redefine$3 = redefine$6.exports;
	var wellKnownSymbol$b = wellKnownSymbol$g;
	var ITERATOR$2 = wellKnownSymbol$b('iterator');
	var BUGGY_SAFARI_ITERATORS = false; // `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object

	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;
	/* eslint-disable es/no-array-prototype-keys -- safe */

	if ([].keys) {
	  arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf$1(getPrototypeOf$1(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$4(function () {
	  var test = {}; // FF44- legacy iterators case

	  return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
	});
	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {}; // `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator

	if (!isCallable$4(IteratorPrototype$2[ITERATOR$2])) {
	  redefine$3(IteratorPrototype$2, ITERATOR$2, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var $$c = _export;
	var global$a = global$A;
	var anInstance = anInstance$1;
	var isCallable$3 = isCallable$h;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$7;
	var fails$3 = fails$d;
	var hasOwn$4 = hasOwnProperty_1;
	var wellKnownSymbol$a = wellKnownSymbol$g;
	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
	var TO_STRING_TAG$3 = wellKnownSymbol$a('toStringTag');
	var NativeIterator = global$a.Iterator; // FF56- have non-standard global helper `Iterator`

	var FORCED$1 = !isCallable$3(NativeIterator) || NativeIterator.prototype !== IteratorPrototype$1 // FF44- non-standard `Iterator` passes previous tests
	|| !fails$3(function () {
	  NativeIterator({});
	});

	var IteratorConstructor = function Iterator() {
	  anInstance(this, IteratorPrototype$1);
	};

	if (!hasOwn$4(IteratorPrototype$1, TO_STRING_TAG$3)) {
	  createNonEnumerableProperty$3(IteratorPrototype$1, TO_STRING_TAG$3, 'Iterator');
	}

	if (FORCED$1 || !hasOwn$4(IteratorPrototype$1, 'constructor') || IteratorPrototype$1.constructor === Object) {
	  createNonEnumerableProperty$3(IteratorPrototype$1, 'constructor', IteratorConstructor);
	}

	IteratorConstructor.prototype = IteratorPrototype$1;
	$$c({
	  global: true,
	  forced: FORCED$1
	}, {
	  Iterator: IteratorConstructor
	});

	var iterators = {};

	var wellKnownSymbol$9 = wellKnownSymbol$g;
	var Iterators$1 = iterators;
	var ITERATOR$1 = wellKnownSymbol$9('iterator');
	var ArrayPrototype = Array.prototype; // check on default Array iterator

	var isArrayIteratorMethod$1 = function (it) {
	  return it !== undefined && (Iterators$1.Array === it || ArrayPrototype[ITERATOR$1] === it);
	};

	var classof$2 = classof$5;
	var getMethod$3 = getMethod$6;
	var Iterators = iterators;
	var wellKnownSymbol$8 = wellKnownSymbol$g;
	var ITERATOR = wellKnownSymbol$8('iterator');

	var getIteratorMethod$2 = function (it) {
	  if (it != undefined) return getMethod$3(it, ITERATOR) || getMethod$3(it, '@@iterator') || Iterators[classof$2(it)];
	};

	var global$9 = global$A;
	var call$6 = functionCall;
	var aCallable$6 = aCallable$a;
	var anObject$b = anObject$h;
	var tryToString$1 = tryToString$3;
	var getIteratorMethod$1 = getIteratorMethod$2;
	var TypeError$4 = global$9.TypeError;

	var getIterator$1 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
	  if (aCallable$6(iteratorMethod)) return anObject$b(call$6(iteratorMethod, argument));
	  throw TypeError$4(tryToString$1(argument) + ' is not iterable');
	};

	var call$5 = functionCall;
	var anObject$a = anObject$h;
	var getMethod$2 = getMethod$6;

	var iteratorClose$2 = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$a(iterator);

	  try {
	    innerResult = getMethod$2(iterator, 'return');

	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }

	    innerResult = call$5(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }

	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$a(innerResult);
	  return value;
	};

	var global$8 = global$A;
	var bind$1 = functionBindContext;
	var call$4 = functionCall;
	var anObject$9 = anObject$h;
	var tryToString = tryToString$3;
	var isArrayIteratorMethod = isArrayIteratorMethod$1;
	var lengthOfArrayLike$1 = lengthOfArrayLike$4;
	var isPrototypeOf$2 = objectIsPrototypeOf;
	var getIterator = getIterator$1;
	var getIteratorMethod = getIteratorMethod$2;
	var iteratorClose$1 = iteratorClose$2;
	var TypeError$3 = global$8.TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate$1 = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind$1(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose$1(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject$9(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    }

	    return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw TypeError$3(tryToString(iterable) + ' is not iterable'); // optimisation for array iterators

	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike$1(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && isPrototypeOf$2(ResultPrototype, result)) return result;
	      }

	      return new Result(false);
	    }

	    iterator = getIterator(iterable, iterFn);
	  }

	  next = iterator.next;

	  while (!(step = call$4(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose$1(iterator, 'throw', error);
	    }

	    if (typeof result == 'object' && result && isPrototypeOf$2(ResultPrototype, result)) return result;
	  }

	  return new Result(false);
	};

	var $$b = _export;
	var iterate = iterate$1;
	var anObject$8 = anObject$h;
	$$b({
	  target: 'Iterator',
	  proto: true,
	  real: true
	}, {
	  forEach: function forEach(fn) {
	    iterate(anObject$8(this), fn, {
	      IS_ITERATOR: true
	    });
	  }
	});

	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods

	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var documentCreateElement = documentCreateElement$2;
	var classList$1 = documentCreateElement('span').classList;
	var DOMTokenListPrototype$1 = classList$1 && classList$1.constructor && classList$1.constructor.prototype;
	var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? undefined : DOMTokenListPrototype$1;

	var global$7 = global$A;
	var DOMIterables = domIterables;
	var DOMTokenListPrototype = domTokenListPrototype;
	var forEach = arrayForEach;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$7;

	var handlePrototype = function (CollectionPrototype) {
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
	    createNonEnumerableProperty$2(CollectionPrototype, 'forEach', forEach);
	  } catch (error) {
	    CollectionPrototype.forEach = forEach;
	  }
	};

	for (var COLLECTION_NAME in DOMIterables) {
	  if (DOMIterables[COLLECTION_NAME]) {
	    handlePrototype(global$7[COLLECTION_NAME] && global$7[COLLECTION_NAME].prototype);
	  }
	}

	handlePrototype(DOMTokenListPrototype);

	var fails$2 = fails$d;
	var wellKnownSymbol$7 = wellKnownSymbol$g;
	var V8_VERSION$1 = engineV8Version;
	var SPECIES = wellKnownSymbol$7('species');

	var arrayMethodHasSpeciesSupport$3 = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION$1 >= 51 || !fails$2(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var $$a = _export;
	var $filter = arrayIteration.filter;
	var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$3;
	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$2('filter'); // `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species

	$$a({
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

	var FunctionPrototype$1 = Function.prototype;
	var apply$5 = FunctionPrototype$1.apply;
	var bind = FunctionPrototype$1.bind;
	var call$3 = FunctionPrototype$1.call; // eslint-disable-next-line es/no-reflect -- safe

	var functionApply = typeof Reflect == 'object' && Reflect.apply || (bind ? call$3.bind(apply$5) : function () {
	  return call$3.apply(apply$5, arguments);
	});

	var redefine$2 = redefine$6.exports;

	var redefineAll$2 = function (target, src, options) {
	  for (var key in src) redefine$2(target, key, src[key], options);

	  return target;
	};

	var global$6 = global$A;
	var shared$1 = sharedStore;
	var isCallable$2 = isCallable$h;
	var getPrototypeOf = objectGetPrototypeOf;
	var redefine$1 = redefine$6.exports;
	var wellKnownSymbol$6 = wellKnownSymbol$g;
	var USE_FUNCTION_CONSTRUCTOR = 'USE_FUNCTION_CONSTRUCTOR';
	var ASYNC_ITERATOR = wellKnownSymbol$6('asyncIterator');
	var AsyncIterator = global$6.AsyncIterator;
	var PassedAsyncIteratorPrototype = shared$1.AsyncIteratorPrototype;
	var AsyncIteratorPrototype$1, prototype;

	if (PassedAsyncIteratorPrototype) {
	  AsyncIteratorPrototype$1 = PassedAsyncIteratorPrototype;
	} else if (isCallable$2(AsyncIterator)) {
	  AsyncIteratorPrototype$1 = AsyncIterator.prototype;
	} else if (shared$1[USE_FUNCTION_CONSTRUCTOR] || global$6[USE_FUNCTION_CONSTRUCTOR]) {
	  try {
	    // eslint-disable-next-line no-new-func -- we have no alternatives without usage of modern syntax
	    prototype = getPrototypeOf(getPrototypeOf(getPrototypeOf(Function('return async function*(){}()')())));
	    if (getPrototypeOf(prototype) === Object.prototype) AsyncIteratorPrototype$1 = prototype;
	  } catch (error) {
	    /* empty */
	  }
	}

	if (!AsyncIteratorPrototype$1) AsyncIteratorPrototype$1 = {};

	if (!isCallable$2(AsyncIteratorPrototype$1[ASYNC_ITERATOR])) {
	  redefine$1(AsyncIteratorPrototype$1, ASYNC_ITERATOR, function () {
	    return this;
	  });
	}

	var asyncIteratorPrototype = AsyncIteratorPrototype$1;

	var call$2 = functionCall;
	var aCallable$5 = aCallable$a;
	var anObject$7 = anObject$h;
	var create$2 = objectCreate;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$7;
	var redefineAll$1 = redefineAll$2;
	var wellKnownSymbol$5 = wellKnownSymbol$g;
	var InternalStateModule$2 = internalState;
	var getBuiltIn$1 = getBuiltIn$8;
	var getMethod$1 = getMethod$6;
	var AsyncIteratorPrototype = asyncIteratorPrototype;
	var Promise$1 = getBuiltIn$1('Promise');
	var setInternalState$2 = InternalStateModule$2.set;
	var getInternalState$2 = InternalStateModule$2.get;
	var TO_STRING_TAG$2 = wellKnownSymbol$5('toStringTag');

	var asyncIteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var AsyncIteratorProxy = function AsyncIterator(state) {
	    state.next = aCallable$5(state.iterator.next);
	    state.done = false;
	    state.ignoreArgument = !IS_ITERATOR;
	    setInternalState$2(this, state);
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
	        } : anObject$7(call$2(nextHandler, state, Promise$1, args)));
	      });
	    },
	    'return': function (value) {
	      var that = this;
	      return new Promise$1(function (resolve, reject) {
	        var state = getInternalState$2(that);
	        var iterator = state.iterator;
	        state.done = true;
	        var $$return = getMethod$1(iterator, 'return');
	        if ($$return === undefined) return resolve({
	          done: true,
	          value: value
	        });
	        Promise$1.resolve(call$2($$return, iterator, value)).then(function (result) {
	          anObject$7(result);
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
	        var $$throw = getMethod$1(iterator, 'throw');
	        if ($$throw === undefined) return reject(value);
	        resolve(call$2($$throw, iterator, value));
	      });
	    }
	  });

	  if (!IS_ITERATOR) {
	    createNonEnumerableProperty$1(AsyncIteratorProxy.prototype, TO_STRING_TAG$2, 'Generator');
	  }

	  return AsyncIteratorProxy;
	};

	var $$9 = _export;
	var apply$4 = functionApply;
	var aCallable$4 = aCallable$a;
	var anObject$6 = anObject$h;
	var createAsyncIteratorProxy$1 = asyncIteratorCreateProxy;
	var AsyncIteratorProxy$1 = createAsyncIteratorProxy$1(function (Promise, args) {
	  var state = this;
	  var filterer = state.filterer;
	  return new Promise(function (resolve, reject) {
	    var loop = function () {
	      try {
	        Promise.resolve(anObject$6(apply$4(state.next, state.iterator, args))).then(function (step) {
	          try {
	            if (anObject$6(step).done) {
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
	$$9({
	  target: 'AsyncIterator',
	  proto: true,
	  real: true
	}, {
	  filter: function filter(filterer) {
	    return new AsyncIteratorProxy$1({
	      iterator: anObject$6(this),
	      filterer: aCallable$4(filterer)
	    });
	  }
	});

	var call$1 = functionCall;
	var aCallable$3 = aCallable$a;
	var anObject$5 = anObject$h;
	var create$1 = objectCreate;
	var createNonEnumerableProperty = createNonEnumerableProperty$7;
	var redefineAll = redefineAll$2;
	var wellKnownSymbol$4 = wellKnownSymbol$g;
	var InternalStateModule$1 = internalState;
	var getMethod = getMethod$6;
	var IteratorPrototype = iteratorsCore.IteratorPrototype;
	var setInternalState$1 = InternalStateModule$1.set;
	var getInternalState$1 = InternalStateModule$1.get;
	var TO_STRING_TAG$1 = wellKnownSymbol$4('toStringTag');

	var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var IteratorProxy = function Iterator(state) {
	    state.next = aCallable$3(state.iterator.next);
	    state.done = false;
	    state.ignoreArg = !IS_ITERATOR;
	    setInternalState$1(this, state);
	  };

	  IteratorProxy.prototype = redefineAll(create$1(IteratorPrototype), {
	    next: function next(arg) {
	      var state = getInternalState$1(this);
	      var args = arguments.length ? [state.ignoreArg ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
	      state.ignoreArg = false;
	      var result = state.done ? undefined : call$1(nextHandler, state, args);
	      return {
	        done: state.done,
	        value: result
	      };
	    },
	    'return': function (value) {
	      var state = getInternalState$1(this);
	      var iterator = state.iterator;
	      state.done = true;
	      var $$return = getMethod(iterator, 'return');
	      return {
	        done: true,
	        value: $$return ? anObject$5(call$1($$return, iterator, value)).value : value
	      };
	    },
	    'throw': function (value) {
	      var state = getInternalState$1(this);
	      var iterator = state.iterator;
	      state.done = true;
	      var $$throw = getMethod(iterator, 'throw');
	      if ($$throw) return call$1($$throw, iterator, value);
	      throw value;
	    }
	  });

	  if (!IS_ITERATOR) {
	    createNonEnumerableProperty(IteratorProxy.prototype, TO_STRING_TAG$1, 'Generator');
	  }

	  return IteratorProxy;
	};

	var anObject$4 = anObject$h;
	var iteratorClose = iteratorClose$2; // call something on iterator step with safe closing on error

	var callWithSafeIterationClosing$2 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$4(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var $$8 = _export;
	var apply$3 = functionApply;
	var aCallable$2 = aCallable$a;
	var anObject$3 = anObject$h;
	var createIteratorProxy$1 = iteratorCreateProxy;
	var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$2;
	var IteratorProxy$1 = createIteratorProxy$1(function (args) {
	  var iterator = this.iterator;
	  var filterer = this.filterer;
	  var next = this.next;
	  var result, done, value;

	  while (true) {
	    result = anObject$3(apply$3(next, iterator, args));
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
	      iterator: anObject$3(this),
	      filterer: aCallable$2(filterer)
	    });
	  }
	});

	var DESCRIPTORS$2 = descriptors;
	var FUNCTION_NAME_EXISTS = functionName.EXISTS;
	var uncurryThis$5 = functionUncurryThis;
	var defineProperty$3 = objectDefineProperty.f;
	var FunctionPrototype = Function.prototype;
	var functionToString = uncurryThis$5(FunctionPrototype.toString);
	var nameRE = /^\s*function ([^ (]*)/;
	var regExpExec = uncurryThis$5(nameRE.exec);
	var NAME = 'name'; // Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name

	if (DESCRIPTORS$2 && !FUNCTION_NAME_EXISTS) {
	  defineProperty$3(FunctionPrototype, NAME, {
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

	var global$5 = global$A;
	var classof$1 = classof$5;
	var String$1 = global$5.String;

	var toString$1 = function (argument) {
	  if (classof$1(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$1(argument);
	};

	var objectGetOwnPropertyNamesExternal = {};

	var uncurryThis$4 = functionUncurryThis;
	var arraySlice$2 = uncurryThis$4([].slice);

	/* eslint-disable es/no-object-getownpropertynames -- safe */
	var classof = classofRaw$1;
	var toIndexedObject$2 = toIndexedObject$7;
	var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
	var arraySlice$1 = arraySlice$2;
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames$1(it);
	  } catch (error) {
	    return arraySlice$1(windowNames);
	  }
	}; // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window


	objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
	  return windowNames && classof(it) == 'Window' ? getWindowNames(it) : $getOwnPropertyNames$1(toIndexedObject$2(it));
	};

	var wellKnownSymbolWrapped = {};

	var wellKnownSymbol$3 = wellKnownSymbol$g;
	wellKnownSymbolWrapped.f = wellKnownSymbol$3;

	var global$4 = global$A;
	var path$1 = global$4;

	var path = path$1;
	var hasOwn$3 = hasOwnProperty_1;
	var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
	var defineProperty$2 = objectDefineProperty.f;

	var defineWellKnownSymbol$1 = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!hasOwn$3(Symbol, NAME)) defineProperty$2(Symbol, NAME, {
	    value: wrappedWellKnownSymbolModule$1.f(NAME)
	  });
	};

	var defineProperty$1 = objectDefineProperty.f;
	var hasOwn$2 = hasOwnProperty_1;
	var wellKnownSymbol$2 = wellKnownSymbol$g;
	var TO_STRING_TAG = wellKnownSymbol$2('toStringTag');

	var setToStringTag$1 = function (it, TAG, STATIC) {
	  if (it && !hasOwn$2(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$1(it, TO_STRING_TAG, {
	      configurable: true,
	      value: TAG
	    });
	  }
	};

	var $$7 = _export;
	var global$3 = global$A;
	var getBuiltIn = getBuiltIn$8;
	var apply$2 = functionApply;
	var call = functionCall;
	var uncurryThis$3 = functionUncurryThis;
	var DESCRIPTORS$1 = descriptors;
	var NATIVE_SYMBOL$1 = nativeSymbol;
	var fails$1 = fails$d;
	var hasOwn$1 = hasOwnProperty_1;
	var isArray$2 = isArray$4;
	var isCallable$1 = isCallable$h;
	var isObject$1 = isObject$8;
	var isPrototypeOf$1 = objectIsPrototypeOf;
	var isSymbol = isSymbol$3;
	var anObject$2 = anObject$h;
	var toObject$1 = toObject$5;
	var toIndexedObject$1 = toIndexedObject$7;
	var toPropertyKey$1 = toPropertyKey$4;
	var $toString = toString$1;
	var createPropertyDescriptor$1 = createPropertyDescriptor$4;
	var nativeObjectCreate = objectCreate;
	var objectKeys = objectKeys$2;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule$1 = objectDefineProperty;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var arraySlice = arraySlice$2;
	var redefine = redefine$6.exports;
	var shared = shared$5.exports;
	var sharedKey = sharedKey$4;
	var hiddenKeys = hiddenKeys$5;
	var uid = uid$3;
	var wellKnownSymbol$1 = wellKnownSymbol$g;
	var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
	var defineWellKnownSymbol = defineWellKnownSymbol$1;
	var setToStringTag = setToStringTag$1;
	var InternalStateModule = internalState;
	var $forEach = arrayIteration.forEach;
	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol$1('toPrimitive');
	var setInternalState = InternalStateModule.set;
	var getInternalState = InternalStateModule.getterFor(SYMBOL);
	var ObjectPrototype = Object[PROTOTYPE];
	var $Symbol = global$3.Symbol;
	var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
	var TypeError$2 = global$3.TypeError;
	var QObject = global$3.QObject;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	var nativeDefineProperty = definePropertyModule$1.f;
	var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
	var push = uncurryThis$3([].push);
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore = shared('wks'); // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

	var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

	var setSymbolDescriptor = DESCRIPTORS$1 && fails$1(function () {
	  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
	    get: function () {
	      return nativeDefineProperty(this, 'a', {
	        value: 7
	      }).a;
	    }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty(O, P, Attributes);

	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype$1);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!DESCRIPTORS$1) symbol.description = description;
	  return symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject$2(O);
	  var key = toPropertyKey$1(P);
	  anObject$2(Attributes);

	  if (hasOwn$1(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!hasOwn$1(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor$1(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (hasOwn$1(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = nativeObjectCreate(Attributes, {
	        enumerable: createPropertyDescriptor$1(0, false)
	      });
	    }

	    return setSymbolDescriptor(O, key, Attributes);
	  }

	  return nativeDefineProperty(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject$2(O);
	  var properties = toIndexedObject$1(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!DESCRIPTORS$1 || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPropertyKey$1(V);
	  var enumerable = call(nativePropertyIsEnumerable, this, P);
	  if (this === ObjectPrototype && hasOwn$1(AllSymbols, P) && !hasOwn$1(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !hasOwn$1(this, P) || !hasOwn$1(AllSymbols, P) || hasOwn$1(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject$1(O);
	  var key = toPropertyKey$1(P);
	  if (it === ObjectPrototype && hasOwn$1(AllSymbols, key) && !hasOwn$1(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor(it, key);

	  if (descriptor && hasOwn$1(AllSymbols, key) && !(hasOwn$1(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }

	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames(toIndexedObject$1(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!hasOwn$1(AllSymbols, key) && !hasOwn$1(hiddenKeys, key)) push(result, key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$1(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (hasOwn$1(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$1(ObjectPrototype, key))) {
	      push(result, AllSymbols[key]);
	    }
	  });
	  return result;
	}; // `Symbol` constructor
	// https://tc39.es/ecma262/#sec-symbol-constructor


	if (!NATIVE_SYMBOL$1) {
	  $Symbol = function Symbol() {
	    if (isPrototypeOf$1(SymbolPrototype$1, this)) throw TypeError$2('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
	    var tag = uid(description);

	    var setter = function (value) {
	      if (this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
	      if (hasOwn$1(this, HIDDEN) && hasOwn$1(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor$1(1, value));
	    };

	    if (DESCRIPTORS$1 && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, {
	      configurable: true,
	      set: setter
	    });
	    return wrap(tag, description);
	  };

	  SymbolPrototype$1 = $Symbol[PROTOTYPE];
	  redefine(SymbolPrototype$1, 'toString', function toString() {
	    return getInternalState(this).tag;
	  });
	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });
	  propertyIsEnumerableModule.f = $propertyIsEnumerable;
	  definePropertyModule$1.f = $defineProperty;
	  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
	  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

	  wrappedWellKnownSymbolModule.f = function (name) {
	    return wrap(wellKnownSymbol$1(name), name);
	  };

	  if (DESCRIPTORS$1) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty(SymbolPrototype$1, 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });

	    {
	      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, {
	        unsafe: true
	      });
	    }
	  }
	}

	$$7({
	  global: true,
	  wrap: true,
	  forced: !NATIVE_SYMBOL$1,
	  sham: !NATIVE_SYMBOL$1
	}, {
	  Symbol: $Symbol
	});
	$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
	  defineWellKnownSymbol(name);
	});
	$$7({
	  target: SYMBOL,
	  stat: true,
	  forced: !NATIVE_SYMBOL$1
	}, {
	  // `Symbol.for` method
	  // https://tc39.es/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = $toString(key);
	    if (hasOwn$1(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.es/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError$2(sym + ' is not a symbol');
	    if (hasOwn$1(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () {
	    USE_SETTER = true;
	  },
	  useSimple: function () {
	    USE_SETTER = false;
	  }
	});
	$$7({
	  target: 'Object',
	  stat: true,
	  forced: !NATIVE_SYMBOL$1,
	  sham: !DESCRIPTORS$1
	}, {
	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});
	$$7({
	  target: 'Object',
	  stat: true,
	  forced: !NATIVE_SYMBOL$1
	}, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	}); // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443

	$$7({
	  target: 'Object',
	  stat: true,
	  forced: fails$1(function () {
	    getOwnPropertySymbolsModule.f(1);
	  })
	}, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return getOwnPropertySymbolsModule.f(toObject$1(it));
	  }
	}); // `JSON.stringify` method behavior with symbols
	// https://tc39.es/ecma262/#sec-json.stringify

	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL$1 || fails$1(function () {
	    var symbol = $Symbol(); // MS Edge converts symbol values to JSON as {}

	    return $stringify([symbol]) != '[null]' // WebKit converts symbol values to JSON as null
	    || $stringify({
	      a: symbol
	    }) != '{}' // V8 throws on boxed symbols
	    || $stringify(Object(symbol)) != '{}';
	  });
	  $$7({
	    target: 'JSON',
	    stat: true,
	    forced: FORCED_JSON_STRINGIFY
	  }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = arraySlice(arguments);
	      var $replacer = replacer;
	      if (!isObject$1(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

	      if (!isArray$2(replacer)) replacer = function (key, value) {
	        if (isCallable$1($replacer)) value = call($replacer, this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return apply$2($stringify, null, args);
	    }
	  });
	} // `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive


	if (!SymbolPrototype$1[TO_PRIMITIVE]) {
	  var valueOf = SymbolPrototype$1.valueOf; // eslint-disable-next-line no-unused-vars -- required for .length

	  redefine(SymbolPrototype$1, TO_PRIMITIVE, function (hint) {
	    // TODO: improve hint logic
	    return call(valueOf, this);
	  });
	} // `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag


	setToStringTag($Symbol, SYMBOL);
	hiddenKeys[HIDDEN] = true;

	var $$6 = _export;
	var DESCRIPTORS = descriptors;
	var global$2 = global$A;
	var uncurryThis$2 = functionUncurryThis;
	var hasOwn = hasOwnProperty_1;
	var isCallable = isCallable$h;
	var isPrototypeOf = objectIsPrototypeOf;
	var toString = toString$1;
	var defineProperty = objectDefineProperty.f;
	var copyConstructorProperties = copyConstructorProperties$2;
	var NativeSymbol = global$2.Symbol;
	var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

	if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) || // Safari 12 bug
	NativeSymbol().description !== undefined)) {
	  var EmptyStringDescriptionStore = {}; // wrap Symbol constructor for correct work with undefined description

	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
	    var result = isPrototypeOf(SymbolPrototype, this) ? new NativeSymbol(description) // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	    : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };

	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  SymbolWrapper.prototype = SymbolPrototype;
	  SymbolPrototype.constructor = SymbolWrapper;
	  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
	  var symbolToString = uncurryThis$2(SymbolPrototype.toString);
	  var symbolValueOf = uncurryThis$2(SymbolPrototype.valueOf);
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  var replace = uncurryThis$2(''.replace);
	  var stringSlice = uncurryThis$2(''.slice);
	  defineProperty(SymbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = symbolValueOf(this);
	      var string = symbolToString(symbol);
	      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });
	  $$6({
	    global: true,
	    forced: true
	  }, {
	    Symbol: SymbolWrapper
	  });
	}

	var toPropertyKey = toPropertyKey$4;
	var definePropertyModule = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$4;

	var createProperty$1 = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var $$5 = _export;
	var global$1 = global$A;
	var fails = fails$d;
	var isArray$1 = isArray$4;
	var isObject = isObject$8;
	var toObject = toObject$5;
	var lengthOfArrayLike = lengthOfArrayLike$4;
	var createProperty = createProperty$1;
	var arraySpeciesCreate = arraySpeciesCreate$2;
	var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$3;
	var wellKnownSymbol = wellKnownSymbol$g;
	var V8_VERSION = engineV8Version;
	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
	var TypeError$1 = global$1.TypeError; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$1('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray$1(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	$$5({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike(E);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError$1(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError$1(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var $$4 = _export;
	var uncurryThis$1 = functionUncurryThis;
	var IndexedObject = indexedObject;
	var toIndexedObject = toIndexedObject$7;
	var arrayMethodIsStrict = arrayMethodIsStrict$2;
	var un$Join = uncurryThis$1([].join);
	var ES3_STRINGS = IndexedObject != Object;
	var STRICT_METHOD = arrayMethodIsStrict('join', ','); // `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join

	$$4({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || !STRICT_METHOD
	}, {
	  join: function join(separator) {
	    return un$Join(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var $$3 = _export;
	var $map = arrayIteration.map;
	var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$3;
	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map'); // `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species

	$$3({
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

	var $$2 = _export;
	var apply$1 = functionApply;
	var aCallable$1 = aCallable$a;
	var anObject$1 = anObject$h;
	var createAsyncIteratorProxy = asyncIteratorCreateProxy;
	var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise, args) {
	  var state = this;
	  var mapper = state.mapper;
	  return Promise.resolve(anObject$1(apply$1(state.next, state.iterator, args))).then(function (step) {
	    if (anObject$1(step).done) {
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
	$$2({
	  target: 'AsyncIterator',
	  proto: true,
	  real: true
	}, {
	  map: function map(mapper) {
	    return new AsyncIteratorProxy({
	      iterator: anObject$1(this),
	      mapper: aCallable$1(mapper)
	    });
	  }
	});

	var $$1 = _export;
	var apply = functionApply;
	var aCallable = aCallable$a;
	var anObject = anObject$h;
	var createIteratorProxy = iteratorCreateProxy;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$2;
	var IteratorProxy = createIteratorProxy(function (args) {
	  var iterator = this.iterator;
	  var result = anObject(apply(this.next, iterator, args));
	  var done = this.done = !!result.done;
	  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, result.value);
	});
	$$1({
	  target: 'Iterator',
	  proto: true,
	  real: true
	}, {
	  map: function map(mapper) {
	    return new IteratorProxy({
	      iterator: anObject(this),
	      mapper: aCallable(mapper)
	    });
	  }
	});

	var $ = _export;
	var uncurryThis = functionUncurryThis;
	var isArray = isArray$4;
	var un$Reverse = uncurryThis([].reverse);
	var test = [1, 2]; // `Array.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-array.prototype.reverse
	// fix for Safari 12.0 bug
	// https://bugs.webkit.org/show_bug.cgi?id=188794

	$({
	  target: 'Array',
	  proto: true,
	  forced: String(test) === String(test.reverse())
	}, {
	  reverse: function reverse() {
	    // eslint-disable-next-line no-self-assign -- dirty hack
	    if (isArray(this)) this.length = this.length;
	    return un$Reverse(this);
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
	function array(x) {
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
	    return array(select.apply(this, arguments));
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

	function constant$4 (x) {
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
	  if (typeof value !== "function") value = constant$4(value);

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

	function selectAll (selector) {
	  return typeof selector === "string" ? new Selection$1([document.querySelectorAll(selector)], [document.documentElement]) : new Selection$1([array(selector)], root);
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

	var constant$3 = (x => () => x);

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
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$3(!!_), drag) : filter;
	  };

	  drag.container = function (_) {
	    return arguments.length ? (container = typeof _ === "function" ? _ : constant$3(_), drag) : container;
	  };

	  drag.subject = function (_) {
	    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$3(_), drag) : subject;
	  };

	  drag.touchable = function (_) {
	    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$3(!!_), drag) : touchable;
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

	function constant$2 (x) {
	  return function () {
	    return x;
	  };
	}

	function jiggle (random) {
	  return (random() - 0.5) * 1e-6;
	}

	function index(d) {
	  return d.index;
	}

	function find(nodeById, nodeId) {
	  var node = nodeById.get(nodeId);
	  if (!node) throw new Error("node not found: " + nodeId);
	  return node;
	}

	function link (links) {
	  var id = index,
	      strength = defaultStrength,
	      strengths,
	      distance = constant$2(30),
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
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$2(+_), initializeStrength(), force) : strength;
	  };

	  force.distance = function (_) {
	    return arguments.length ? (distance = typeof _ === "function" ? _ : constant$2(+_), initializeDistance(), force) : distance;
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
	const c = 1013904223;
	const m = 4294967296; // 2^32

	function lcg () {
	  let s = 1;
	  return () => (s = (a * s + c) % m) / m;
	}

	function x$1(d) {
	  return d.x;
	}
	function y$1(d) {
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
	      strength = constant$2(-30),
	      strengths,
	      distanceMin2 = 1,
	      distanceMax2 = Infinity,
	      theta2 = 0.81;

	  function force(_) {
	    var i,
	        n = nodes.length,
	        tree = quadtree(nodes, x$1, y$1).visitAfter(accumulate);

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
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$2(+_), initialize(), force) : strength;
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

	function x (x) {
	  var strength = constant$2(0.1),
	      nodes,
	      strengths,
	      xz;
	  if (typeof x !== "function") x = constant$2(x == null ? 0 : +x);

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
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$2(+_), initialize(), force) : strength;
	  };

	  force.x = function (_) {
	    return arguments.length ? (x = typeof _ === "function" ? _ : constant$2(+_), initialize(), force) : x;
	  };

	  return force;
	}

	function y (y) {
	  var strength = constant$2(0.1),
	      nodes,
	      strengths,
	      yz;
	  if (typeof y !== "function") y = constant$2(y == null ? 0 : +y);

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
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$2(+_), initialize(), force) : strength;
	  };

	  force.y = function (_) {
	    return arguments.length ? (y = typeof _ === "function" ? _ : constant$2(+_), initialize(), force) : y;
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

	  var root = new Node(data),
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
	        nodes.push(child = childs[i] = new Node(childs[i]));
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
	function Node(data) {
	  this.data = data;
	  this.depth = this.height = 0;
	  this.parent = null;
	}
	Node.prototype = hierarchy.prototype = {
	  constructor: Node,
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

	function required(f) {
	  if (typeof f !== "function") throw new Error();
	  return f;
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
	      d = nodes[i], node = nodes[i] = new Node(d);

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

	var constant$1 = (x => () => x);

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
	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function (a, b) {
	    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
	  };
	}
	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
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

	function interpolateNumber (a, b) {
	  return a = +a, b = +b, function (t) {
	    return a * (1 - t) + b * t;
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

	var degrees = 180 / Math.PI;
	var identity$1 = {
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
	  return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
	}
	function parseSvg(value) {
	  if (value == null) return identity$1;
	  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	  svgNode.setAttribute("transform", value);
	  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
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
	  create(node, id, {
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

	function create(node, id, self) {
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

	var constant = (x => () => x);

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
	var identity = new Transform(1, 0, 0);

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
	  return this.__zoom || identity;
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
	      return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
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
	    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant(+_), zoom) : wheelDelta;
	  };

	  zoom.filter = function (_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), zoom) : filter;
	  };

	  zoom.touchable = function (_) {
	    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom) : touchable;
	  };

	  zoom.extent = function (_) {
	    return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
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

	var sparseness = 2000;
	var KEY_DATA_ENTITY = 'key-data-entity'; // https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy

	var forceTree = function forceTree(ecosystem, element) {
	  var width = 1000;
	  var height = 800;
	  var minDepth = -1; // Set to 0 to exclude root

	  ecosystem.descendants().forEach(function (d) {
	    d.collapsing = 0;
	    d.collapsed = false;
	  });
	  var allLinks = ecosystem.links().filter(function (d) {
	    return d.source.depth > minDepth;
	  });
	  var allNodes = ecosystem.descendants().filter(function (d) {
	    return d.depth > minDepth;
	  });
	  var svg = element.append('svg').attr('viewBox', [-width / 2, -height / 2, width, height]);
	  var tooltip = element.append('div').attr('class', 'tooltip empty');

	  var clearSelections = function clearSelections() {
	    return selectAll('#nodes > g').classed('selected', false);
	  };

	  var selectNode = function selectNode(id) {
	    return select("#".concat(id)).classed('selected', true);
	  };

	  var showTooltip = function showTooltip(entity) {
	    if (graph.locked) return;
	    var _entity$data = entity.data,
	        id = _entity$data.id,
	        name = _entity$data.name,
	        type = _entity$data.type,
	        description = _entity$data.description;
	    clearSelections();
	    selectNode(id);
	    var keyDataEntities = entity.descendants().filter(function (x) {
	      return x.data.type === KEY_DATA_ENTITY;
	    });

	    var listKeyDataEntities = function listKeyDataEntities(list, heading) {
	      if (list.length < 1) return '';
	      return "<h2>".concat(heading, "</h2>\n      <ul class='tag-cloud'>\n        ").concat(list.map(function (x) {
	        return "<li>".concat(x.data.name, "</li>");
	      }).join(''), "\n      </ul>");
	    };

	    var content = "\n      <article>\n        <h1>".concat(name || id, " (<em>").concat(type, "</em>)</h1>\n        <p>").concat(description, "</p>\n        ").concat(listKeyDataEntities(keyDataEntities.filter(function (x) {
	      return x.data.published === 'Y';
	    }), 'Published Key Data Entities'), "\n        ").concat(listKeyDataEntities(keyDataEntities.filter(function (x) {
	      return x.data.published === 'N';
	    }), 'Unpublished Key Data Entities'), "\n      </article>\n    ");
	    tooltip.classed('empty', false);
	    tooltip.html(content);
	  };

	  var setDefaultTooltipContent = function setDefaultTooltipContent() {
	    var content = "\n      <article>\n      <h1>Instructions</h1>\n      <p>\n        Hover over a node to show the metadata.\n        Click a node to lock the current selection.\n      </p>\n      </article>\n    ";
	    tooltip.html(content);
	  };

	  setDefaultTooltipContent();

	  var hideTooltip = function hideTooltip(entity) {
	    if (graph.locked) return;
	    clearSelections();
	    setDefaultTooltipContent();
	  };

	  var toggleTooltipLock = function toggleTooltipLock(entity) {
	    if (graph.locked && graph.locked != entity.data.id) return;
	    if (graph.locked) graph.locked = undefined;else graph.locked = entity.data.id;
	    console.log(graph.locked);
	  };

	  function update() {
	    svg.select('#graph').remove();
	    var graph = svg.append('g').attr('id', 'graph');

	    var notCollapsing = function notCollapsing(n) {
	      return n.collapsing == 0;
	    };

	    var nodes = allNodes.filter(notCollapsing);
	    var links = allLinks.filter(function (l) {
	      return notCollapsing(l.source) && notCollapsing(l.target);
	    });
	    var simulation$1 = simulation(nodes).velocityDecay(0.4).force('link', link(links).id(function (d) {
	      return d.id;
	    }).distance(0).strength(1)).force('charge', manyBody().strength(-sparseness)).force('x', x()).force('y', y());
	    var link$1 = graph.append('g').attr('id', 'edges').selectAll('line').data(links).join('line').attr('class', function (d) {
	      return d.source.data.type;
	    });

	    var node = graph.append('g').attr('id', 'nodes').selectAll('g').data(nodes).join('g').attr('id', function (d) {
	      return d.data.id;
	    }).attr('class', function (d) {
	      return d.data.type;
	    });
	    node.append('circle').classed('collapsed', function (d) {
	      return d.collapsed;
	    }).attr('r', 15).call(drag(simulation$1)).on('click', function (_, i) {
	      return toggleTooltipLock(i);
	    }).on('mouseover', function (_, i) {
	      return showTooltip(i);
	    }).on('mouseout', function (_, i) {
	      return hideTooltip();
	    });
	    node.append('text').attr('text-anchor', 'right').attr('dominant-baseline', 'middle').attr('x', 20) // .attr('y', 0)
	    // .attr('textLength', 20)
	    .text(function (d) {
	      return d.data.name;
	    });
	    simulation$1.on('tick', function () {
	      link$1.attr('x1', function (d) {
	        return d.source.x;
	      }).attr('y1', function (d) {
	        return d.source.y;
	      }).attr('x2', function (d) {
	        return d.target.x;
	      }).attr('y2', function (d) {
	        return d.target.y;
	      });
	      node.attr('transform', function (d) {
	        return "translate(".concat(d.x, " ").concat(d.y, ")");
	      });
	    });
	    node.append('title').text(function (d) {
	      return nodePath(d);
	    });
	  }

	  function zoomed(_ref) {
	    var transform = _ref.transform;
	    graph.attr('transform', transform);
	  }

	  svg.call(zoom().extent([[0, 0], [width, height]]).scaleExtent([0.5, 4]).on('zoom', zoomed));

	  var nodePath = function nodePath(d) {
	    return d.ancestors().map(function (d) {
	      return d.data.id;
	    }).reverse().join('/');
	  };

	  update();
	  return svg.node();
	};

	csv('ecosystem-tree.csv').then(function (data) {
	  var ecosystem = stratify().id(function (x) {
	    return x.id;
	  }).parentId(function (x) {
	    return x.parent;
	  })(data);
	  forceTree(ecosystem, select("#tree"));
	});

})();
