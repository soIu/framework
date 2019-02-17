(function(){
    "use strict";
    var ρσ_iterator_symbol = (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") ? Symbol.iterator : "iterator-Symbol-5d0927e5554349048cf0e3762a228256";
    var ρσ_kwargs_symbol = (typeof Symbol === "function") ? Symbol("kwargs-object") : "kwargs-object-Symbol-5d0927e5554349048cf0e3762a228256";
    var ρσ_cond_temp, ρσ_expr_temp, ρσ_last_exception;
    var ρσ_object_counter = 0;
    var ρσ_regenerator = {};
    (function(global) {
      "use strict";
    
      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined; 
    
      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    
      var inModule = typeof module === "object";
      var runtime = global.regeneratorRuntime;
      if (runtime) {
        if (inModule) {
    
          module.exports = runtime;
        }
    
        return;
      }
    
      runtime = global.regeneratorRuntime = inModule ? module.exports : {};
    
      function wrap(innerFn, outerFn, self, tryLocsList) {
    
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);
    
        generator._invoke = makeInvokeMethod(innerFn, self, context);
    
        return generator;
      }
      runtime.wrap = wrap;
    
      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }
    
      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed";
    
      var ContinueSentinel = {};
    
      function Generator() {}
      function GeneratorFunction() {}
      function GeneratorFunctionPrototype() {}
    
      var IteratorPrototype = {};
      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };
    
      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
      if (NativeIteratorPrototype &&
          NativeIteratorPrototype !== Op &&
          hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    
        IteratorPrototype = NativeIteratorPrototype;
      }
    
      var Gp = GeneratorFunctionPrototype.prototype =
        Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunctionPrototype[toStringTagSymbol] =
        GeneratorFunction.displayName = "GeneratorFunction";
    
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function(method) {
          prototype[method] = function(arg) {
            return this._invoke(method, arg);
          };
        });
      }
    
      runtime.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor
          ? ctor === GeneratorFunction ||
    
            (ctor.displayName || ctor.name) === "GeneratorFunction"
          : false;
      };
    
      runtime.mark = function(genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          if (!(toStringTagSymbol in genFun)) {
            genFun[toStringTagSymbol] = "GeneratorFunction";
          }
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
      };
    
      runtime.awrap = function(arg) {
        return { __await: arg };
      };
    
      function AsyncIterator(generator) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;
            if (value &&
                typeof value === "object" &&
                hasOwn.call(value, "__await")) {
              return Promise.resolve(value.__await).then(function(value) {
                invoke("next", value, resolve, reject);
              }, function(err) {
                invoke("throw", err, resolve, reject);
              });
            }
    
            return Promise.resolve(value).then(function(unwrapped) {
    
              result.value = unwrapped;
              resolve(result);
            }, reject);
          }
        }
    
        var previousPromise;
    
        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new Promise(function(resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
    
          return previousPromise =
    
            previousPromise ? previousPromise.then(
              callInvokeWithMethodAndArg,
    
              callInvokeWithMethodAndArg
            ) : callInvokeWithMethodAndArg();
        }
    
        this._invoke = enqueue;
      }
    
      defineIteratorMethods(AsyncIterator.prototype);
      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };
      runtime.AsyncIterator = AsyncIterator;
    
      runtime.async = function(innerFn, outerFn, self, tryLocsList) {
        var iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList)
        );
    
        return runtime.isGeneratorFunction(outerFn)
          ? iter 
    
          : iter.next().then(function(result) {
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
            }
    
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
    
              state = context.done
                ? GenStateCompleted
                : GenStateSuspendedYield;
    
              if (record.arg === ContinueSentinel) {
                continue;
              }
    
              return {
                value: record.arg,
                done: context.done
              };
    
            } else if (record.type === "throw") {
              state = GenStateCompleted;
    
              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      }
    
      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];
        if (method === undefined) {
    
          context.delegate = null;
    
          if (context.method === "throw") {
            if (delegate.iterator.return) {
    
              context.method = "return";
              context.arg = undefined;
              maybeInvokeDelegate(delegate, context);
    
              if (context.method === "throw") {
    
                return ContinueSentinel;
              }
            }
    
            context.method = "throw";
            context.arg = new TypeError(
              "The iterator does not provide a 'throw' method");
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
    
        if (! info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }
    
        if (info.done) {
    
          context[delegate.resultName] = info.value;
    
          context.next = delegate.nextLoc;
    
          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined;
          }
    
        } else {
    
          return info;
        }
    
        context.delegate = null;
        return ContinueSentinel;
      }
    
      defineIteratorMethods(Gp);
    
      Gp[toStringTagSymbol] = "Generator";
    
      Gp[iteratorSymbol] = function() {
        return this;
      };
    
      Gp.toString = function() {
        return "[object Generator]";
      };
    
      function pushTryEntry(locs) {
        var entry = { tryLoc: locs[0] };
    
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
    
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }
    
      runtime.keys = function(object) {
        var keys = [];
        for (var key in object) {
          keys.push(key);
        }
        keys.reverse();
    
        return function next() {
          while (keys.length) {
            var key = keys.pop();
            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          }
    
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
            var i = -1, next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }
    
              next.value = undefined;
              next.done = true;
    
              return next;
            };
    
            return next.next = next;
          }
        }
    
        return { next: doneResult };
      }
      runtime.values = values;
    
      function doneResult() {
        return { value: undefined, done: true };
      }
    
      Context.prototype = {
        constructor: Context,
    
        reset: function(skipTempReset) {
          this.prev = 0;
          this.next = 0;
    
          this.sent = this._sent = undefined;
          this.done = false;
          this.delegate = null;
    
          this.method = "next";
          this.arg = undefined;
    
          this.tryEntries.forEach(resetTryEntry);
    
          if (!skipTempReset) {
            for (var name in this) {
    
              if (name.charAt(0) === "t" &&
                  hasOwn.call(this, name) &&
                  !isNaN(+name.slice(1))) {
                this[name] = undefined;
              }
            }
          }
        },
    
        stop: function() {
          this.done = true;
    
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }
    
          return this.rval;
        },
    
        dispatchException: function(exception) {
          if (this.done) {
            throw exception;
          }
    
          var context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;
    
            if (caught) {
    
              context.method = "next";
              context.arg = undefined;
            }
    
            return !! caught;
          }
    
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;
    
            if (entry.tryLoc === "root") {
    
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
    
        abrupt: function(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev &&
                hasOwn.call(entry, "finallyLoc") &&
                this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }
    
          if (finallyEntry &&
              (type === "break" ||
               type === "continue") &&
              finallyEntry.tryLoc <= arg &&
              arg <= finallyEntry.finallyLoc) {
    
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
    
        complete: function(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }
    
          if (record.type === "break" ||
              record.type === "continue") {
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
    
        finish: function(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
    
        "catch": function(tryLoc) {
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
          }
    
          throw new Error("illegal catch attempt");
        },
    
        delegateYield: function(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };
    
          if (this.method === "next") {
    
            this.arg = undefined;
          }
    
          return ContinueSentinel;
        }
      };
    })(ρσ_regenerator);
var ρσ_len;
function ρσ_bool(val) {
    return !!val;
};
if (!ρσ_bool.__argnames__) Object.defineProperties(ρσ_bool, {
    __argnames__ : {value: ["val"]}
});

function ρσ_print() {
    var parts;
    if (typeof console === "object") {
        parts = [];
        for (var i = 0; i < arguments.length; i++) {
            parts.push(ρσ_str(arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]));
        }
        console.log(parts.join(" "));
    }
};

function ρσ_int(val, base) {
    var ans;
    ans = parseInt(val, base || 10);
    if (isNaN(ans)) {
        throw new ValueError("Invalid literal for int with base " + (base || 10) + ": " + val);
    }
    return ans;
};
if (!ρσ_int.__argnames__) Object.defineProperties(ρσ_int, {
    __argnames__ : {value: ["val", "base"]}
});

function ρσ_float() {
    var ans;
    ans = parseFloat.apply(null, arguments);
    if (isNaN(ans)) {
        throw new ValueError("Could not convert string to float: " + arguments[0]);
    }
    return ans;
};

function ρσ_arraylike_creator() {
    var names;
    names = "Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" ");
    if (typeof HTMLCollection === "function") {
        names = names.concat("HTMLCollection NodeList NamedNodeMap TouchList".split(" "));
    }
    return (function() {
        var ρσ_anonfunc = function (x) {
            if (Array.isArray(x) || typeof x === "string" || names.indexOf(Object.prototype.toString.call(x).slice(8, -1)) > -1) {
                return true;
            }
            return false;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["x"]}
        });
        return ρσ_anonfunc;
    })();
};

function options_object(f) {
    return function () {
        if (typeof arguments[arguments.length - 1] === "object") {
            arguments[ρσ_bound_index(arguments.length - 1, arguments)][ρσ_kwargs_symbol] = true;
        }
        return f.apply(this, arguments);
    };
};
if (!options_object.__argnames__) Object.defineProperties(options_object, {
    __argnames__ : {value: ["f"]}
});

function ρσ_id(x) {
    return x.ρσ_object_id;
};
if (!ρσ_id.__argnames__) Object.defineProperties(ρσ_id, {
    __argnames__ : {value: ["x"]}
});

function ρσ_dir(item) {
    var arr;
    arr = ρσ_list_decorate([]);
    for (var i in item) {
        arr.push(i);
    }
    return arr;
};
if (!ρσ_dir.__argnames__) Object.defineProperties(ρσ_dir, {
    __argnames__ : {value: ["item"]}
});

function ρσ_ord(x) {
    var ans, second;
    ans = x.charCodeAt(0);
    if (55296 <= ans && ans <= 56319) {
        second = x.charCodeAt(1);
        if (56320 <= second && second <= 57343) {
            return (ans - 55296) * 1024 + second - 56320 + 65536;
        }
        throw new TypeError("string is missing the low surrogate char");
    }
    return ans;
};
if (!ρσ_ord.__argnames__) Object.defineProperties(ρσ_ord, {
    __argnames__ : {value: ["x"]}
});

function ρσ_chr(code) {
    if (code <= 65535) {
        return String.fromCharCode(code);
    }
    code -= 65536;
    return String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
};
if (!ρσ_chr.__argnames__) Object.defineProperties(ρσ_chr, {
    __argnames__ : {value: ["code"]}
});

function ρσ_callable(x) {
    return typeof x === "function";
};
if (!ρσ_callable.__argnames__) Object.defineProperties(ρσ_callable, {
    __argnames__ : {value: ["x"]}
});

function ρσ_bin(x) {
    var ans;
    if (typeof x !== "number" || x % 1 !== 0) {
        throw new TypeError("integer required");
    }
    ans = x.toString(2);
    if (ans[0] === "-") {
        ans = "-" + "0b" + ans.slice(1);
    } else {
        ans = "0b" + ans;
    }
    return ans;
};
if (!ρσ_bin.__argnames__) Object.defineProperties(ρσ_bin, {
    __argnames__ : {value: ["x"]}
});

function ρσ_hex(x) {
    var ans;
    if (typeof x !== "number" || x % 1 !== 0) {
        throw new TypeError("integer required");
    }
    ans = x.toString(16);
    if (ans[0] === "-") {
        ans = "-" + "0x" + ans.slice(1);
    } else {
        ans = "0x" + ans;
    }
    return ans;
};
if (!ρσ_hex.__argnames__) Object.defineProperties(ρσ_hex, {
    __argnames__ : {value: ["x"]}
});

function ρσ_enumerate(iterable) {
    var ans, iterator;
    ans = {"_i":-1};
    ans[ρσ_iterator_symbol] = function () {
        return this;
    };
    if (ρσ_arraylike(iterable)) {
        ans["next"] = function () {
            this._i += 1;
            if (this._i < iterable.length) {
                return {'done':false, 'value':[this._i, iterable[this._i]]};
            }
            return {'done':true};
        };
        return ans;
    }
    if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        ans["_iterator"] = iterator;
        ans["next"] = function () {
            var r;
            r = this._iterator.next();
            if (r.done) {
                return {'done':true};
            }
            this._i += 1;
            return {'done':false, 'value':[this._i, r.value]};
        };
        return ans;
    }
    return ρσ_enumerate(Object.keys(iterable));
};
if (!ρσ_enumerate.__argnames__) Object.defineProperties(ρσ_enumerate, {
    __argnames__ : {value: ["iterable"]}
});

function ρσ_reversed(iterable) {
    var ans;
    if (ρσ_arraylike(iterable)) {
        ans = {"_i": iterable.length};
        ans["next"] = function () {
            this._i -= 1;
            if (this._i > -1) {
                return {'done':false, 'value':iterable[this._i]};
            }
            return {'done':true};
        };
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        return ans;
    }
    throw new TypeError("reversed() can only be called on arrays or strings");
};
if (!ρσ_reversed.__argnames__) Object.defineProperties(ρσ_reversed, {
    __argnames__ : {value: ["iterable"]}
});

function ρσ_iter(iterable) {
    var ans;
    if (typeof iterable[ρσ_iterator_symbol] === "function") {
        return (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
    }
    if (ρσ_arraylike(iterable)) {
        ans = {"_i":-1};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i < iterable.length) {
                return {'done':false, 'value':iterable[this._i]};
            }
            return {'done':true};
        };
        return ans;
    }
    return ρσ_iter(Object.keys(iterable));
};
if (!ρσ_iter.__argnames__) Object.defineProperties(ρσ_iter, {
    __argnames__ : {value: ["iterable"]}
});

function ρσ_range_next(step, length) {
    var ρσ_unpack;
    this._i += step;
    this._idx += 1;
    if (this._idx >= length) {
        ρσ_unpack = [this.__i, -1];
        this._i = ρσ_unpack[0];
        this._idx = ρσ_unpack[1];
        return {'done':true};
    }
    return {'done':false, 'value':this._i};
};
if (!ρσ_range_next.__argnames__) Object.defineProperties(ρσ_range_next, {
    __argnames__ : {value: ["step", "length"]}
});

function ρσ_range(start, stop, step) {
    var length, ans;
    if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
    }
    step = arguments[2] || 1;
    length = Math.max(Math.ceil((stop - start) / step), 0);
    ans = {start:start, step:step, stop:stop};
    ans[ρσ_iterator_symbol] = function () {
        var it;
        it = {"_i": start - step, "_idx": -1};
        it.next = ρσ_range_next.bind(it, step, length);
        it[ρσ_iterator_symbol] = function () {
            return this;
        };
        return it;
    };
    ans.count = (function() {
        var ρσ_anonfunc = function (val) {
            if (!this._cached) {
                this._cached = list(this);
            }
            return this._cached.count(val);
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["val"]}
        });
        return ρσ_anonfunc;
    })();
    ans.index = (function() {
        var ρσ_anonfunc = function (val) {
            if (!this._cached) {
                this._cached = list(this);
            }
            return this._cached.index(val);
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["val"]}
        });
        return ρσ_anonfunc;
    })();
    if (typeof Proxy === "function") {
        ans = new Proxy(ans, (function(){
            var ρσ_d = {};
            ρσ_d["get"] = (function() {
                var ρσ_anonfunc = function (obj, prop) {
                    var iprop;
                    if (typeof prop === "string") {
                        iprop = parseInt(prop);
                        if (!isNaN(iprop)) {
                            prop = iprop;
                        }
                    }
                    if (typeof prop === "number") {
                        if (!obj._cached) {
                            obj._cached = list(obj);
                        }
                        return (ρσ_expr_temp = obj._cached)[(typeof prop === "number" && prop < 0) ? ρσ_expr_temp.length + prop : prop];
                    }
                    return obj[(typeof prop === "number" && prop < 0) ? obj.length + prop : prop];
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["obj", "prop"]}
                });
                return ρσ_anonfunc;
            })();
            return ρσ_d;
        }).call(this));
    }
    return ans;
};
if (!ρσ_range.__argnames__) Object.defineProperties(ρσ_range, {
    __argnames__ : {value: ["start", "stop", "step"]}
});

function ρσ_getattr(obj, name, defval) {
    var ret;
    try {
        ret = obj[(typeof name === "number" && name < 0) ? obj.length + name : name];
    } catch (ρσ_Exception) {
        ρσ_last_exception = ρσ_Exception;
        if (ρσ_Exception instanceof TypeError) {
            if (defval === undefined) {
                throw new AttributeError("The attribute " + name + " is not present");
            }
            return defval;
        } else {
            throw ρσ_Exception;
        }
    }
    if (ret === undefined && !(name in obj)) {
        if (defval === undefined) {
            throw new AttributeError("The attribute " + name + " is not present");
        }
        ret = defval;
    }
    return ret;
};
if (!ρσ_getattr.__argnames__) Object.defineProperties(ρσ_getattr, {
    __argnames__ : {value: ["obj", "name", "defval"]}
});

function ρσ_setattr(obj, name, value) {
    obj[(typeof name === "number" && name < 0) ? obj.length + name : name] = value;
};
if (!ρσ_setattr.__argnames__) Object.defineProperties(ρσ_setattr, {
    __argnames__ : {value: ["obj", "name", "value"]}
});

function ρσ_hasattr(obj, name) {
    return name in obj;
};
if (!ρσ_hasattr.__argnames__) Object.defineProperties(ρσ_hasattr, {
    __argnames__ : {value: ["obj", "name"]}
});

ρσ_len = function () {
    function len(obj) {
        if (ρσ_arraylike(obj)) {
            return obj.length;
        }
        if (typeof obj.__len__ === "function") {
            return obj.__len__();
        }
        if (obj instanceof Set || obj instanceof Map) {
            return obj.size;
        }
        return Object.keys(obj).length;
    };
    if (!len.__argnames__) Object.defineProperties(len, {
        __argnames__ : {value: ["obj"]}
    });

    function len5(obj) {
        if (ρσ_arraylike(obj)) {
            return obj.length;
        }
        if (typeof obj.__len__ === "function") {
            return obj.__len__();
        }
        return Object.keys(obj).length;
    };
    if (!len5.__argnames__) Object.defineProperties(len5, {
        __argnames__ : {value: ["obj"]}
    });

    return (typeof Set === "function" && typeof Map === "function") ? len : len5;
}();
function ρσ_get_module(name) {
    return ρσ_modules[(typeof name === "number" && name < 0) ? ρσ_modules.length + name : name];
};
if (!ρσ_get_module.__argnames__) Object.defineProperties(ρσ_get_module, {
    __argnames__ : {value: ["name"]}
});

function ρσ_pow(x, y, z) {
    var ans;
    ans = Math.pow(x, y);
    if (z !== undefined) {
        ans %= z;
    }
    return ans;
};
if (!ρσ_pow.__argnames__) Object.defineProperties(ρσ_pow, {
    __argnames__ : {value: ["x", "y", "z"]}
});

function ρσ_type(x) {
    return x.constructor;
};
if (!ρσ_type.__argnames__) Object.defineProperties(ρσ_type, {
    __argnames__ : {value: ["x"]}
});

function ρσ_divmod(x, y) {
    var d;
    if (y === 0) {
        throw new ZeroDivisionError("integer division or modulo by zero");
    }
    d = Math.floor(x / y);
    return [d, x - d * y];
};
if (!ρσ_divmod.__argnames__) Object.defineProperties(ρσ_divmod, {
    __argnames__ : {value: ["x", "y"]}
});

function ρσ_max() {
    var kwargs = arguments[arguments.length-1];
    if (kwargs === null || typeof kwargs !== "object" || kwargs [ρσ_kwargs_symbol] !== true) kwargs = {};
    var args = Array.prototype.slice.call(arguments, 0);
    if (kwargs !== null && typeof kwargs === "object" && kwargs [ρσ_kwargs_symbol] === true) args.pop();
    var args, x;
    if (args.length === 0) {
        if (kwargs.defval !== undefined) {
            return kwargs.defval;
        }
        throw new TypeError("expected at least one argument");
    }
    if (args.length === 1) {
        args = args[0];
    }
    if (kwargs.key) {
        args = (function() {
            var ρσ_Iter = ρσ_Iterable(args), ρσ_Result = [], x;
            for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                x = ρσ_Iter[ρσ_Index];
                ρσ_Result.push(kwargs.key(x));
            }
            ρσ_Result = ρσ_list_constructor(ρσ_Result);
            return ρσ_Result;
        })();
    }
    if (!Array.isArray(args)) {
        args = list(args);
    }
    if (args.length) {
        return this.apply(null, args);
    }
    if (kwargs.defval !== undefined) {
        return kwargs.defval;
    }
    throw new TypeError("expected at least one argument");
};
if (!ρσ_max.__handles_kwarg_interpolation__) Object.defineProperties(ρσ_max, {
    __handles_kwarg_interpolation__ : {value: true}
});

var abs = Math.abs, max = ρσ_max.bind(Math.max), min = ρσ_max.bind(Math.min), bool = ρσ_bool, type = ρσ_type;
var float = ρσ_float, int = ρσ_int, arraylike = ρσ_arraylike_creator(), ρσ_arraylike = arraylike;
var print = ρσ_print, id = ρσ_id, get_module = ρσ_get_module, pow = ρσ_pow, divmod = ρσ_divmod;
var dir = ρσ_dir, ord = ρσ_ord, chr = ρσ_chr, bin = ρσ_bin, hex = ρσ_hex, callable = ρσ_callable;
var enumerate = ρσ_enumerate, iter = ρσ_iter, reversed = ρσ_reversed, len = ρσ_len;
var range = ρσ_range, getattr = ρσ_getattr, setattr = ρσ_setattr, hasattr = ρσ_hasattr;function ρσ_equals(a, b) {
    var ρσ_unpack, akeys, bkeys, key;
    if (a === b) {
        return true;
    }
    if (a && typeof a.__eq__ === "function") {
        return a.__eq__(b);
    }
    if (b && typeof b.__eq__ === "function") {
        return b.__eq__(a);
    }
    if (ρσ_arraylike(a) && ρσ_arraylike(b)) {
        if ((a.length !== b.length && (typeof a.length !== "object" || ρσ_not_equals(a.length, b.length)))) {
            return false;
        }
        for (var i=0; i < a.length; i++) {
            if (!((a[(typeof i === "number" && i < 0) ? a.length + i : i] === b[(typeof i === "number" && i < 0) ? b.length + i : i] || typeof a[(typeof i === "number" && i < 0) ? a.length + i : i] === "object" && ρσ_equals(a[(typeof i === "number" && i < 0) ? a.length + i : i], b[(typeof i === "number" && i < 0) ? b.length + i : i])))) {
                return false;
            }
        }
        return true;
    }
    if (typeof a === "object" && typeof b === "object" && a !== null && b !== null && (a.constructor === Object && b.constructor === Object || Object.getPrototypeOf(a) === null && Object.getPrototypeOf(b) === null)) {
        ρσ_unpack = [Object.keys(a), Object.keys(b)];
        akeys = ρσ_unpack[0];
        bkeys = ρσ_unpack[1];
        if (akeys.length !== bkeys.length) {
            return false;
        }
        for (var j=0; j < akeys.length; j++) {
            key = akeys[(typeof j === "number" && j < 0) ? akeys.length + j : j];
            if (!((a[(typeof key === "number" && key < 0) ? a.length + key : key] === b[(typeof key === "number" && key < 0) ? b.length + key : key] || typeof a[(typeof key === "number" && key < 0) ? a.length + key : key] === "object" && ρσ_equals(a[(typeof key === "number" && key < 0) ? a.length + key : key], b[(typeof key === "number" && key < 0) ? b.length + key : key])))) {
                return false;
            }
        }
        return true;
    }
    return false;
};
if (!ρσ_equals.__argnames__) Object.defineProperties(ρσ_equals, {
    __argnames__ : {value: ["a", "b"]}
});

function ρσ_not_equals(a, b) {
    if (a === b) {
        return false;
    }
    if (a && typeof a.__ne__ === "function") {
        return a.__ne__(b);
    }
    if (b && typeof b.__ne__ === "function") {
        return b.__ne__(a);
    }
    return !ρσ_equals(a, b);
};
if (!ρσ_not_equals.__argnames__) Object.defineProperties(ρσ_not_equals, {
    __argnames__ : {value: ["a", "b"]}
});

var equals = ρσ_equals;
function ρσ_list_extend(iterable) {
    var start, iterator, result;
    if (Array.isArray(iterable) || typeof iterable === "string") {
        start = this.length;
        this.length += iterable.length;
        for (var i = 0; i < iterable.length; i++) {
            (ρσ_expr_temp = this)[ρσ_bound_index(start + i, ρσ_expr_temp)] = iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i];
        }
    } else {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        result = iterator.next();
        while (!result.done) {
            this.push(result.value);
            result = iterator.next();
        }
    }
};
if (!ρσ_list_extend.__argnames__) Object.defineProperties(ρσ_list_extend, {
    __argnames__ : {value: ["iterable"]}
});

function ρσ_list_index(val, start, stop) {
    var idx;
    start = start || 0;
    if (start < 0) {
        start = this.length + start;
    }
    if (start < 0) {
        throw new ValueError(val + " is not in list");
    }
    if (stop === undefined) {
        idx = this.indexOf(val, start);
        if (idx === -1) {
            throw new ValueError(val + " is not in list");
        }
        return idx;
    }
    if (stop < 0) {
        stop = this.length + stop;
    }
    for (var i = start; i < stop; i++) {
        if (((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === val || typeof (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === "object" && ρσ_equals((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i], val))) {
            return i;
        }
    }
    throw new ValueError(val + " is not in list");
};
if (!ρσ_list_index.__argnames__) Object.defineProperties(ρσ_list_index, {
    __argnames__ : {value: ["val", "start", "stop"]}
});

function ρσ_list_pop(index) {
    var ans;
    if (this.length === 0) {
        throw new IndexError("list is empty");
    }
    ans = this.splice(index, 1);
    if (!ans.length) {
        throw new IndexError("pop index out of range");
    }
    return ans[0];
};
if (!ρσ_list_pop.__argnames__) Object.defineProperties(ρσ_list_pop, {
    __argnames__ : {value: ["index"]}
});

function ρσ_list_remove(value) {
    var idx;
    idx = this.indexOf(value);
    if (idx === -1) {
        throw new ValueError(value + " not in list");
    }
    this.splice(idx, 1);
};
if (!ρσ_list_remove.__argnames__) Object.defineProperties(ρσ_list_remove, {
    __argnames__ : {value: ["value"]}
});

function ρσ_list_to_string() {
    return "[" + this.join(", ") + "]";
};

function ρσ_list_insert(index, val) {
    if (index < 0) {
        index += this.length;
    }
    index = min(this.length, max(index, 0));
    if (index === 0) {
        this.unshift(val);
        return;
    }
    for (var i = this.length; i > index; i--) {
        (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] = (ρσ_expr_temp = this)[ρσ_bound_index(i - 1, ρσ_expr_temp)];
    }
    (ρσ_expr_temp = this)[(typeof index === "number" && index < 0) ? ρσ_expr_temp.length + index : index] = val;
};
if (!ρσ_list_insert.__argnames__) Object.defineProperties(ρσ_list_insert, {
    __argnames__ : {value: ["index", "val"]}
});

function ρσ_list_copy() {
    return ρσ_list_constructor(this);
};

function ρσ_list_clear() {
    this.length = 0;
};

function ρσ_list_as_array() {
    return Array.prototype.slice.call(this);
};

function ρσ_list_count(value) {
    return this.reduce((function() {
        var ρσ_anonfunc = function (n, val) {
            return n + (val === value);
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["n", "val"]}
        });
        return ρσ_anonfunc;
    })(), 0);
};
if (!ρσ_list_count.__argnames__) Object.defineProperties(ρσ_list_count, {
    __argnames__ : {value: ["value"]}
});

function ρσ_list_sort_key(value) {
    var t;
    t = typeof value;
    if (t === "string" || t === "number") {
        return value;
    }
    return value.toString();
};
if (!ρσ_list_sort_key.__argnames__) Object.defineProperties(ρσ_list_sort_key, {
    __argnames__ : {value: ["value"]}
});

function ρσ_list_sort_cmp(a, b, ap, bp) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return ap - bp;
};
if (!ρσ_list_sort_cmp.__argnames__) Object.defineProperties(ρσ_list_sort_cmp, {
    __argnames__ : {value: ["a", "b", "ap", "bp"]}
});

function ρσ_list_sort() {
    var key = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? ρσ_list_sort.__defaults__.key : arguments[0];
    var reverse = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? ρσ_list_sort.__defaults__.reverse : arguments[1];
    var ρσ_kwargs_obj = arguments[arguments.length-1];
    if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
    if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
        key = ρσ_kwargs_obj.key;
    }
    if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "reverse")){
        reverse = ρσ_kwargs_obj.reverse;
    }
    var mult, keymap, posmap, k;
    key = key || ρσ_list_sort_key;
    mult = (reverse) ? -1 : 1;
    keymap = dict();
    posmap = dict();
    for (var i=0; i < this.length; i++) {
        k = (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
        keymap.set(k, key(k));
        posmap.set(k, i);
    }
    this.sort((function() {
        var ρσ_anonfunc = function (a, b) {
            return mult * ρσ_list_sort_cmp(keymap.get(a), keymap.get(b), posmap.get(a), posmap.get(b));
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["a", "b"]}
        });
        return ρσ_anonfunc;
    })());
};
if (!ρσ_list_sort.__defaults__) Object.defineProperties(ρσ_list_sort, {
    __defaults__ : {value: {key:null, reverse:false}},
    __handles_kwarg_interpolation__ : {value: true},
    __argnames__ : {value: ["key", "reverse"]}
});

function ρσ_list_concat() {
    var ans;
    ans = Array.prototype.concat.apply(this, arguments);
    ρσ_list_decorate(ans);
    return ans;
};

function ρσ_list_slice() {
    var ans;
    ans = Array.prototype.slice.apply(this, arguments);
    ρσ_list_decorate(ans);
    return ans;
};

function ρσ_list_iterator(value) {
    var self;
    self = this;
    return (function(){
        var ρσ_d = {};
        ρσ_d["_i"] = -1;
        ρσ_d["_list"] = self;
        ρσ_d["next"] = function () {
            this._i += 1;
            if (this._i >= this._list.length) {
                return (function(){
                    var ρσ_d = {};
                    ρσ_d["done"] = true;
                    return ρσ_d;
                }).call(this);
            }
            return (function(){
                var ρσ_d = {};
                ρσ_d["done"] = false;
                ρσ_d["value"] = (ρσ_expr_temp = this._list)[ρσ_bound_index(this._i, ρσ_expr_temp)];
                return ρσ_d;
            }).call(this);
        };
        return ρσ_d;
    }).call(this);
};
if (!ρσ_list_iterator.__argnames__) Object.defineProperties(ρσ_list_iterator, {
    __argnames__ : {value: ["value"]}
});

function ρσ_list_len() {
    return this.length;
};

function ρσ_list_contains(val) {
    for (var i = 0; i < this.length; i++) {
        if (((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === val || typeof (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === "object" && ρσ_equals((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i], val))) {
            return true;
        }
    }
    return false;
};
if (!ρσ_list_contains.__argnames__) Object.defineProperties(ρσ_list_contains, {
    __argnames__ : {value: ["val"]}
});

function ρσ_list_eq(other) {
    if (!ρσ_arraylike(other)) {
        return false;
    }
    if ((this.length !== other.length && (typeof this.length !== "object" || ρσ_not_equals(this.length, other.length)))) {
        return false;
    }
    for (var i = 0; i < this.length; i++) {
        if (!(((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === other[(typeof i === "number" && i < 0) ? other.length + i : i] || typeof (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === "object" && ρσ_equals((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i], other[(typeof i === "number" && i < 0) ? other.length + i : i])))) {
            return false;
        }
    }
    return true;
};
if (!ρσ_list_eq.__argnames__) Object.defineProperties(ρσ_list_eq, {
    __argnames__ : {value: ["other"]}
});

function ρσ_list_decorate(ans) {
    ans.append = Array.prototype.push;
    ans.toString = ρσ_list_to_string;
    ans.inspect = ρσ_list_to_string;
    ans.extend = ρσ_list_extend;
    ans.index = ρσ_list_index;
    ans.pypop = ρσ_list_pop;
    ans.remove = ρσ_list_remove;
    ans.insert = ρσ_list_insert;
    ans.copy = ρσ_list_copy;
    ans.clear = ρσ_list_clear;
    ans.count = ρσ_list_count;
    ans.concat = ρσ_list_concat;
    ans.pysort = ρσ_list_sort;
    ans.slice = ρσ_list_slice;
    ans.as_array = ρσ_list_as_array;
    ans.__len__ = ρσ_list_len;
    ans.__contains__ = ρσ_list_contains;
    ans.__eq__ = ρσ_list_eq;
    ans.constructor = ρσ_list_constructor;
    if (typeof ans[ρσ_iterator_symbol] !== "function") {
        ans[ρσ_iterator_symbol] = ρσ_list_iterator;
    }
    return ans;
};
if (!ρσ_list_decorate.__argnames__) Object.defineProperties(ρσ_list_decorate, {
    __argnames__ : {value: ["ans"]}
});

function ρσ_list_constructor(iterable) {
    var ans, iterator, result;
    if (iterable === undefined) {
        ans = [];
    } else if (ρσ_arraylike(iterable)) {
        ans = new Array(iterable.length);
        for (var i = 0; i < iterable.length; i++) {
            ans[(typeof i === "number" && i < 0) ? ans.length + i : i] = iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i];
        }
    } else if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        ans = ρσ_list_decorate([]);
        result = iterator.next();
        while (!result.done) {
            ans.push(result.value);
            result = iterator.next();
        }
    } else if (typeof iterable === "number") {
        ans = new Array(iterable);
    } else {
        ans = Object.keys(iterable);
    }
    return ρσ_list_decorate(ans);
};
if (!ρσ_list_constructor.__argnames__) Object.defineProperties(ρσ_list_constructor, {
    __argnames__ : {value: ["iterable"]}
});

ρσ_list_constructor.__name__ = "list";
var list = ρσ_list_constructor, list_wrap = ρσ_list_decorate;
function sorted() {
    var iterable = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
    var key = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? sorted.__defaults__.key : arguments[1];
    var reverse = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? sorted.__defaults__.reverse : arguments[2];
    var ρσ_kwargs_obj = arguments[arguments.length-1];
    if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
    if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
        key = ρσ_kwargs_obj.key;
    }
    if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "reverse")){
        reverse = ρσ_kwargs_obj.reverse;
    }
    var ans;
    ans = ρσ_list_constructor(iterable);
    ans.pysort(key, reverse);
    return ans;
};
if (!sorted.__defaults__) Object.defineProperties(sorted, {
    __defaults__ : {value: {key:null, reverse:false}},
    __handles_kwarg_interpolation__ : {value: true},
    __argnames__ : {value: ["iterable", "key", "reverse"]}
});

var ρσ_global_object_id = 0, ρσ_set_implementation;
function ρσ_set_keyfor(x) {
    var t, ans;
    t = typeof x;
    if (t === "string" || t === "number" || t === "boolean") {
        return "_" + t[0] + x;
    }
    if (x === null) {
        return "__!@#$0";
    }
    ans = x.ρσ_hash_key_prop;
    if (ans === undefined) {
        ans = "_!@#$" + (++ρσ_global_object_id);
        Object.defineProperty(x, "ρσ_hash_key_prop", (function(){
            var ρσ_d = {};
            ρσ_d["value"] = ans;
            return ρσ_d;
        }).call(this));
    }
    return ans;
};
if (!ρσ_set_keyfor.__argnames__) Object.defineProperties(ρσ_set_keyfor, {
    __argnames__ : {value: ["x"]}
});

function ρσ_set_polyfill() {
    this._store = {};
    this.size = 0;
};

ρσ_set_polyfill.prototype.add = (function() {
    var ρσ_anonfunc = function (x) {
        var key;
        key = ρσ_set_keyfor(x);
        if (!Object.prototype.hasOwnProperty.call(this._store, key)) {
            this.size += 1;
            (ρσ_expr_temp = this._store)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = x;
        }
        return this;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set_polyfill.prototype.clear = (function() {
    var ρσ_anonfunc = function (x) {
        this._store = {};
        this.size = 0;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set_polyfill.prototype.delete = (function() {
    var ρσ_anonfunc = function (x) {
        var key;
        key = ρσ_set_keyfor(x);
        if (Object.prototype.hasOwnProperty.call(this._store, key)) {
            this.size -= 1;
            delete this._store[key];
            return true;
        }
        return false;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set_polyfill.prototype.has = (function() {
    var ρσ_anonfunc = function (x) {
        return Object.prototype.hasOwnProperty.call(this._store, ρσ_set_keyfor(x));
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set_polyfill.prototype.values = (function() {
    var ρσ_anonfunc = function (x) {
        var ans;
        ans = {'_keys': Object.keys(this._store), '_i':-1, '_s':this._store};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i >= this._keys.length) {
                return {'done': true};
            }
            return {'done':false, 'value':this._s[this._keys[this._i]]};
        };
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
if (typeof Set !== "function" || typeof Set.prototype.delete !== "function") {
    ρσ_set_implementation = ρσ_set_polyfill;
} else {
    ρσ_set_implementation = Set;
}
function ρσ_set(iterable) {
    var ans, s, iterator, result, keys;
    if (this instanceof ρσ_set) {
        this.jsset = new ρσ_set_implementation;
        ans = this;
        if (iterable === undefined) {
            return ans;
        }
        s = ans.jsset;
        if (ρσ_arraylike(iterable)) {
            for (var i = 0; i < iterable.length; i++) {
                s.add(iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i]);
            }
        } else if (typeof iterable[ρσ_iterator_symbol] === "function") {
            iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
            result = iterator.next();
            while (!result.done) {
                s.add(result.value);
                result = iterator.next();
            }
        } else {
            keys = Object.keys(iterable);
            for (var j=0; j < keys.length; j++) {
                s.add(keys[(typeof j === "number" && j < 0) ? keys.length + j : j]);
            }
        }
        return ans;
    } else {
        return new ρσ_set(iterable);
    }
};
if (!ρσ_set.__argnames__) Object.defineProperties(ρσ_set, {
    __argnames__ : {value: ["iterable"]}
});

ρσ_set.prototype.__name__ = "set";
Object.defineProperties(ρσ_set.prototype, (function(){
    var ρσ_d = {};
    ρσ_d["length"] = (function(){
        var ρσ_d = {};
        ρσ_d["get"] = function () {
            return this.jsset.size;
        };
        return ρσ_d;
    }).call(this);
    ρσ_d["size"] = (function(){
        var ρσ_d = {};
        ρσ_d["get"] = function () {
            return this.jsset.size;
        };
        return ρσ_d;
    }).call(this);
    return ρσ_d;
}).call(this));
ρσ_set.prototype.__len__ = function () {
    return this.jsset.size;
};
ρσ_set.prototype.has = ρσ_set.prototype.__contains__ = (function() {
    var ρσ_anonfunc = function (x) {
        return this.jsset.has(x);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.add = (function() {
    var ρσ_anonfunc = function (x) {
        this.jsset.add(x);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.clear = function () {
    this.jsset.clear();
};
ρσ_set.prototype.copy = function () {
    return ρσ_set(this);
};
ρσ_set.prototype.discard = (function() {
    var ρσ_anonfunc = function (x) {
        this.jsset.delete(x);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype[ρσ_iterator_symbol] = function () {
    return this.jsset.values();
};
ρσ_set.prototype.difference = function () {
    var ans, s, iterator, r, x, has;
    ans = new ρσ_set;
    s = ans.jsset;
    iterator = this.jsset.values();
    r = iterator.next();
    while (!r.done) {
        x = r.value;
        has = false;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i].has(x)) {
                has = true;
                break;
            }
        }
        if (!has) {
            s.add(x);
        }
        r = iterator.next();
    }
    return ans;
};
ρσ_set.prototype.difference_update = function () {
    var s, remove, iterator, r, x;
    s = this.jsset;
    remove = [];
    iterator = s.values();
    r = iterator.next();
    while (!r.done) {
        x = r.value;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i].has(x)) {
                remove.push(x);
                break;
            }
        }
        r = iterator.next();
    }
    for (var j = 0; j < remove.length; j++) {
        s.delete(remove[(typeof j === "number" && j < 0) ? remove.length + j : j]);
    }
};
ρσ_set.prototype.intersection = function () {
    var ans, s, iterator, r, x, has;
    ans = new ρσ_set;
    s = ans.jsset;
    iterator = this.jsset.values();
    r = iterator.next();
    while (!r.done) {
        x = r.value;
        has = true;
        for (var i = 0; i < arguments.length; i++) {
            if (!arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i].has(x)) {
                has = false;
                break;
            }
        }
        if (has) {
            s.add(x);
        }
        r = iterator.next();
    }
    return ans;
};
ρσ_set.prototype.intersection_update = function () {
    var s, remove, iterator, r, x;
    s = this.jsset;
    remove = [];
    iterator = s.values();
    r = iterator.next();
    while (!r.done) {
        x = r.value;
        for (var i = 0; i < arguments.length; i++) {
            if (!arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i].has(x)) {
                remove.push(x);
                break;
            }
        }
        r = iterator.next();
    }
    for (var j = 0; j < remove.length; j++) {
        s.delete(remove[(typeof j === "number" && j < 0) ? remove.length + j : j]);
    }
};
ρσ_set.prototype.isdisjoint = (function() {
    var ρσ_anonfunc = function (other) {
        var iterator, r, x;
        iterator = this.jsset.values();
        r = iterator.next();
        while (!r.done) {
            x = r.value;
            if (other.has(x)) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.issubset = (function() {
    var ρσ_anonfunc = function (other) {
        var iterator, r, x;
        iterator = this.jsset.values();
        r = iterator.next();
        while (!r.done) {
            x = r.value;
            if (!other.has(x)) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.issuperset = (function() {
    var ρσ_anonfunc = function (other) {
        var s, iterator, r, x;
        s = this.jsset;
        iterator = other.jsset.values();
        r = iterator.next();
        while (!r.done) {
            x = r.value;
            if (!s.has(x)) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.pop = function () {
    var iterator, r;
    iterator = this.jsset.values();
    r = iterator.next();
    if (r.done) {
        throw new KeyError("pop from an empty set");
    }
    this.jsset.delete(r.value);
    return r.value;
};
ρσ_set.prototype.remove = (function() {
    var ρσ_anonfunc = function (x) {
        if (!this.jsset.delete(x)) {
            throw new KeyError(x.toString());
        }
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.symmetric_difference = (function() {
    var ρσ_anonfunc = function (other) {
        return this.union(other).difference(this.intersection(other));
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.symmetric_difference_update = (function() {
    var ρσ_anonfunc = function (other) {
        var common;
        common = this.intersection(other);
        this.update(other);
        this.difference_update(common);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.union = function () {
    var ans;
    ans = ρσ_set(this);
    ans.update.apply(ans, arguments);
    return ans;
};
ρσ_set.prototype.update = function () {
    var s, iterator, r;
    s = this.jsset;
    for (var i=0; i < arguments.length; i++) {
        iterator = arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i][ρσ_iterator_symbol]();
        r = iterator.next();
        while (!r.done) {
            s.add(r.value);
            r = iterator.next();
        }
    }
};
ρσ_set.prototype.toString = ρσ_set.prototype.inspect = function () {
    return "{" + list(this).join(", ") + "}";
};
ρσ_set.prototype.__eq__ = (function() {
    var ρσ_anonfunc = function (other) {
        var iterator, r;
        if (!other instanceof this.constructor) {
            return false;
        }
        if (other.size !== this.size) {
            return false;
        }
        if (other.size === 0) {
            return true;
        }
        iterator = other[ρσ_iterator_symbol]();
        r = iterator.next();
        while (!r.done) {
            if (!this.has(r.value)) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
function ρσ_set_wrap(x) {
    var ans;
    ans = new ρσ_set;
    ans.jsset = x;
    return ans;
};
if (!ρσ_set_wrap.__argnames__) Object.defineProperties(ρσ_set_wrap, {
    __argnames__ : {value: ["x"]}
});

var set = ρσ_set, set_wrap = ρσ_set_wrap;
var ρσ_dict_implementation;
function ρσ_dict_polyfill() {
    this._store = {};
    this.size = 0;
};

ρσ_dict_polyfill.prototype.set = (function() {
    var ρσ_anonfunc = function (x, value) {
        var key;
        key = ρσ_set_keyfor(x);
        if (!Object.prototype.hasOwnProperty.call(this._store, key)) {
            this.size += 1;
        }
        (ρσ_expr_temp = this._store)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = [x, value];
        return this;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x", "value"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.clear = (function() {
    var ρσ_anonfunc = function (x) {
        this._store = {};
        this.size = 0;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.delete = (function() {
    var ρσ_anonfunc = function (x) {
        var key;
        key = ρσ_set_keyfor(x);
        if (Object.prototype.hasOwnProperty.call(this._store, key)) {
            this.size -= 1;
            delete this._store[key];
            return true;
        }
        return false;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.has = (function() {
    var ρσ_anonfunc = function (x) {
        return Object.prototype.hasOwnProperty.call(this._store, ρσ_set_keyfor(x));
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.get = (function() {
    var ρσ_anonfunc = function (x) {
        try {
            return (ρσ_expr_temp = this._store)[ρσ_bound_index(ρσ_set_keyfor(x), ρσ_expr_temp)][1];
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            if (ρσ_Exception instanceof TypeError) {
                return undefined;
            } else {
                throw ρσ_Exception;
            }
        }
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.values = (function() {
    var ρσ_anonfunc = function (x) {
        var ans;
        ans = {'_keys': Object.keys(this._store), '_i':-1, '_s':this._store};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i >= this._keys.length) {
                return {'done': true};
            }
            return {'done':false, 'value':this._s[this._keys[this._i]][1]};
        };
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.keys = (function() {
    var ρσ_anonfunc = function (x) {
        var ans;
        ans = {'_keys': Object.keys(this._store), '_i':-1, '_s':this._store};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i >= this._keys.length) {
                return {'done': true};
            }
            return {'done':false, 'value':this._s[this._keys[this._i]][0]};
        };
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.entries = (function() {
    var ρσ_anonfunc = function (x) {
        var ans;
        ans = {'_keys': Object.keys(this._store), '_i':-1, '_s':this._store};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i >= this._keys.length) {
                return {'done': true};
            }
            return {'done':false, 'value':this._s[this._keys[this._i]]};
        };
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
if (typeof Map !== "function" || typeof Map.prototype.delete !== "function") {
    ρσ_dict_implementation = ρσ_dict_polyfill;
} else {
    ρσ_dict_implementation = Map;
}
function ρσ_dict() {
    var iterable = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
    var kw = arguments[arguments.length-1];
    if (kw === null || typeof kw !== "object" || kw [ρσ_kwargs_symbol] !== true) kw = {};
    if (this instanceof ρσ_dict) {
        this.jsmap = new ρσ_dict_implementation;
        if (iterable !== undefined) {
            this.update(iterable);
        }
        this.update(kw);
        return this;
    } else {
        return ρσ_interpolate_kwargs_constructor.call(Object.create(ρσ_dict.prototype), false, ρσ_dict, [iterable].concat([ρσ_desugar_kwargs(kw)]));
    }
};
if (!ρσ_dict.__handles_kwarg_interpolation__) Object.defineProperties(ρσ_dict, {
    __handles_kwarg_interpolation__ : {value: true},
    __argnames__ : {value: ["iterable"]}
});

ρσ_dict.prototype.__name__ = "dict";
Object.defineProperties(ρσ_dict.prototype, (function(){
    var ρσ_d = {};
    ρσ_d["length"] = (function(){
        var ρσ_d = {};
        ρσ_d["get"] = function () {
            return this.jsmap.size;
        };
        return ρσ_d;
    }).call(this);
    ρσ_d["size"] = (function(){
        var ρσ_d = {};
        ρσ_d["get"] = function () {
            return this.jsmap.size;
        };
        return ρσ_d;
    }).call(this);
    return ρσ_d;
}).call(this));
ρσ_dict.prototype.__len__ = function () {
    return this.jsmap.size;
};
ρσ_dict.prototype.has = ρσ_dict.prototype.__contains__ = (function() {
    var ρσ_anonfunc = function (x) {
        return this.jsmap.has(x);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.set = ρσ_dict.prototype.__setitem__ = (function() {
    var ρσ_anonfunc = function (key, value) {
        this.jsmap.set(key, value);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key", "value"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.__delitem__ = (function() {
    var ρσ_anonfunc = function (key) {
        this.jsmap.delete(key);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.clear = function () {
    this.jsmap.clear();
};
ρσ_dict.prototype.copy = function () {
    return ρσ_dict(this);
};
ρσ_dict.prototype.keys = function () {
    return this.jsmap.keys();
};
ρσ_dict.prototype.values = function () {
    return this.jsmap.values();
};
ρσ_dict.prototype.items = ρσ_dict.prototype.entries = function () {
    return this.jsmap.entries();
};
ρσ_dict.prototype[ρσ_iterator_symbol] = function () {
    return this.jsmap.keys();
};
ρσ_dict.prototype.__getitem__ = (function() {
    var ρσ_anonfunc = function (key) {
        var ans;
        ans = this.jsmap.get(key);
        if (ans === undefined && !this.jsmap.has(key)) {
            throw new KeyError(key + "");
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.get = (function() {
    var ρσ_anonfunc = function (key, defval) {
        var ans;
        ans = this.jsmap.get(key);
        if (ans === undefined && !this.jsmap.has(key)) {
            return (defval === undefined) ? null : defval;
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key", "defval"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.set_default = (function() {
    var ρσ_anonfunc = function (key, defval) {
        var j;
        j = this.jsmap;
        if (!j.has(key)) {
            j.set(key, defval);
            return defval;
        }
        return j.get(key);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key", "defval"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.fromkeys = ρσ_dict.prototype.fromkeys = (function() {
    var ρσ_anonfunc = function () {
        var iterable = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
        var value = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? ρσ_anonfunc.__defaults__.value : arguments[1];
        var ρσ_kwargs_obj = arguments[arguments.length-1];
        if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
        if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "value")){
            value = ρσ_kwargs_obj.value;
        }
        var ans, iterator, r;
        ans = ρσ_dict();
        iterator = iter(iterable);
        r = iterator.next();
        while (!r.done) {
            ans.set(r.value, value);
            r = iterator.next();
        }
        return ans;
    };
    if (!ρσ_anonfunc.__defaults__) Object.defineProperties(ρσ_anonfunc, {
        __defaults__ : {value: {value:null}},
        __handles_kwarg_interpolation__ : {value: true},
        __argnames__ : {value: ["iterable", "value"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.pop = (function() {
    var ρσ_anonfunc = function (key, defval) {
        var ans;
        ans = this.jsmap.get(key);
        if (ans === undefined && !this.jsmap.has(key)) {
            if (defval === undefined) {
                throw new KeyError(key);
            }
            return defval;
        }
        this.jsmap.delete(key);
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key", "defval"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.popitem = function () {
    var r;
    r = this.jsmap.entries().next();
    if (r.done) {
        throw new KeyError("dict is empty");
    }
    this.jsmap.delete(r.value[0]);
    return r.value;
};
ρσ_dict.prototype.update = function () {
    var m, iterable, iterator, result, keys;
    if (arguments.length === 0) {
        return;
    }
    m = this.jsmap;
    iterable = arguments[0];
    if (Array.isArray(iterable)) {
        for (var i = 0; i < iterable.length; i++) {
            m.set(iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i][0], iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i][1]);
        }
    } else if (iterable instanceof ρσ_dict) {
        iterator = iterable.items();
        result = iterator.next();
        while (!result.done) {
            m.set(result.value[0], result.value[1]);
            result = iterator.next();
        }
    } else if (typeof Map === "function" && iterable instanceof Map) {
        iterator = iterable.entries();
        result = iterator.next();
        while (!result.done) {
            m.set(result.value[0], result.value[1]);
            result = iterator.next();
        }
    } else if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = iterable[ρσ_iterator_symbol]();
        result = iterator.next();
        while (!result.done) {
            m.set(result.value[0], result.value[1]);
            result = iterator.next();
        }
    } else {
        keys = Object.keys(iterable);
        for (var j=0; j < keys.length; j++) {
            if (keys[(typeof j === "number" && j < 0) ? keys.length + j : j] !== ρσ_iterator_symbol) {
                m.set(keys[(typeof j === "number" && j < 0) ? keys.length + j : j], iterable[ρσ_bound_index(keys[(typeof j === "number" && j < 0) ? keys.length + j : j], iterable)]);
            }
        }
    }
    if (arguments.length > 1) {
        ρσ_dict.prototype.update.call(this, arguments[1]);
    }
};
ρσ_dict.prototype.toString = ρσ_dict.prototype.inspect = ρσ_dict.prototype.__str__ = ρσ_dict.prototype.__repr__ = function () {
    var entries, iterator, r;
    entries = [];
    iterator = this.jsmap.entries();
    r = iterator.next();
    while (!r.done) {
        entries.push(ρσ_repr(r.value[0]) + ": " + ρσ_repr(r.value[1]));
        r = iterator.next();
    }
    return "{" + entries.join(", ") + "}";
};
ρσ_dict.prototype.__eq__ = (function() {
    var ρσ_anonfunc = function (other) {
        var iterator, r, x;
        if (!(other instanceof this.constructor)) {
            return false;
        }
        if (other.size !== this.size) {
            return false;
        }
        if (other.size === 0) {
            return true;
        }
        iterator = other.items();
        r = iterator.next();
        while (!r.done) {
            x = this.jsmap.get(r.value[0]);
            if (x === undefined && !this.jsmap.has(r.value[0]) || x !== r.value[1]) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.as_object = (function() {
    var ρσ_anonfunc = function (other) {
        var ans, iterator, r;
        ans = {};
        iterator = this.jsmap.entries();
        r = iterator.next();
        while (!r.done) {
            ans[ρσ_bound_index(r.value[0], ans)] = r.value[1];
            r = iterator.next();
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
function ρσ_dict_wrap(x) {
    var ans;
    ans = new ρσ_dict;
    ans.jsmap = x;
    return ans;
};
if (!ρσ_dict_wrap.__argnames__) Object.defineProperties(ρσ_dict_wrap, {
    __argnames__ : {value: ["x"]}
});

var dict = ρσ_dict, dict_wrap = ρσ_dict_wrap;var NameError;
NameError = ReferenceError;
function Exception() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    Exception.prototype.__init__.apply(this, arguments);
}
ρσ_extends(Exception, Error);
Exception.prototype.__init__ = function __init__(message) {
    var self = this;
    self.message = message;
    self.stack = (new Error).stack;
    self.name = self.constructor.name;
};
if (!Exception.prototype.__init__.__argnames__) Object.defineProperties(Exception.prototype.__init__, {
    __argnames__ : {value: ["message"]}
});
Exception.__argnames__ = Exception.prototype.__init__.__argnames__;
Exception.__handles_kwarg_interpolation__ = Exception.prototype.__init__.__handles_kwarg_interpolation__;
Exception.prototype.__repr__ = function __repr__() {
    var self = this;
    return self.name + ": " + self.message;
};
if (!Exception.prototype.__repr__.__argnames__) Object.defineProperties(Exception.prototype.__repr__, {
    __argnames__ : {value: []}
});
Exception.prototype.__str__ = function __str__ () {
    if(Error.prototype.__str__) return Error.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(Exception.prototype, "__bases__", {value: [Error]});

function AttributeError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    AttributeError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(AttributeError, Exception);
AttributeError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
AttributeError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
AttributeError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(AttributeError.prototype, "__bases__", {value: [Exception]});


function IndexError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    IndexError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(IndexError, Exception);
IndexError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
IndexError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
IndexError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(IndexError.prototype, "__bases__", {value: [Exception]});


function KeyError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    KeyError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(KeyError, Exception);
KeyError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
KeyError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
KeyError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(KeyError.prototype, "__bases__", {value: [Exception]});


function ValueError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    ValueError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(ValueError, Exception);
ValueError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
ValueError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
ValueError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(ValueError.prototype, "__bases__", {value: [Exception]});


function UnicodeDecodeError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    UnicodeDecodeError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(UnicodeDecodeError, Exception);
UnicodeDecodeError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
UnicodeDecodeError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
UnicodeDecodeError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(UnicodeDecodeError.prototype, "__bases__", {value: [Exception]});


function AssertionError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    AssertionError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(AssertionError, Exception);
AssertionError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
AssertionError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
AssertionError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(AssertionError.prototype, "__bases__", {value: [Exception]});


function ZeroDivisionError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    ZeroDivisionError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(ZeroDivisionError, Exception);
ZeroDivisionError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
ZeroDivisionError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
ZeroDivisionError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(ZeroDivisionError.prototype, "__bases__", {value: [Exception]});

var ρσ_in, ρσ_desugar_kwargs, ρσ_exists;
function ρσ_eslice(arr, step, start, end) {
    var is_string;
    if (typeof arr === "string" || arr instanceof String) {
        is_string = true;
        arr = arr.split("");
    }
    if (step < 0) {
        step = -step;
        arr = arr.slice().reverse();
        if (typeof start !== "undefined") {
            start = arr.length - start - 1;
        }
        if (typeof end !== "undefined") {
            end = arr.length - end - 1;
        }
    }
    if (typeof start === "undefined") {
        start = 0;
    }
    if (typeof end === "undefined") {
        end = arr.length;
    }
    arr = arr.slice(start, end).filter((function() {
        var ρσ_anonfunc = function (e, i) {
            return i % step === 0;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["e", "i"]}
        });
        return ρσ_anonfunc;
    })());
    if (is_string) {
        arr = arr.join("");
    }
    return arr;
};
if (!ρσ_eslice.__argnames__) Object.defineProperties(ρσ_eslice, {
    __argnames__ : {value: ["arr", "step", "start", "end"]}
});

function ρσ_delslice(arr, step, start, end) {
    var is_string, ρσ_unpack, indices;
    if (typeof arr === "string" || arr instanceof String) {
        is_string = true;
        arr = arr.split("");
    }
    if (step < 0) {
        if (typeof start === "undefined") {
            start = arr.length;
        }
        if (typeof end === "undefined") {
            end = 0;
        }
        ρσ_unpack = [end, start, -step];
        start = ρσ_unpack[0];
        end = ρσ_unpack[1];
        step = ρσ_unpack[2];
    }
    if (typeof start === "undefined") {
        start = 0;
    }
    if (typeof end === "undefined") {
        end = arr.length;
    }
    if (step === 1) {
        arr.splice(start, end - start);
    } else {
        if (end > start) {
            indices = [];
            for (var i = start; i < end; i += step) {
                indices.push(i);
            }
            for (var i = indices.length - 1; i >= 0; i--) {
                arr.splice(indices[(typeof i === "number" && i < 0) ? indices.length + i : i], 1);
            }
        }
    }
    if (is_string) {
        arr = arr.join("");
    }
    return arr;
};
if (!ρσ_delslice.__argnames__) Object.defineProperties(ρσ_delslice, {
    __argnames__ : {value: ["arr", "step", "start", "end"]}
});

function ρσ_flatten(arr) {
    var ans, value;
    ans = ρσ_list_decorate([]);
    for (var i=0; i < arr.length; i++) {
        value = arr[(typeof i === "number" && i < 0) ? arr.length + i : i];
        if (Array.isArray(value)) {
            ans = ans.concat(ρσ_flatten(value));
        } else {
            ans.push(value);
        }
    }
    return ans;
};
if (!ρσ_flatten.__argnames__) Object.defineProperties(ρσ_flatten, {
    __argnames__ : {value: ["arr"]}
});

function ρσ_unpack_asarray(num, iterable) {
    var ans, iterator, result;
    if (ρσ_arraylike(iterable)) {
        return iterable;
    }
    ans = [];
    if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        result = iterator.next();
        while (!result.done && ans.length < num) {
            ans.push(result.value);
            result = iterator.next();
        }
    }
    return ans;
};
if (!ρσ_unpack_asarray.__argnames__) Object.defineProperties(ρσ_unpack_asarray, {
    __argnames__ : {value: ["num", "iterable"]}
});

function ρσ_extends(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};
if (!ρσ_extends.__argnames__) Object.defineProperties(ρσ_extends, {
    __argnames__ : {value: ["child", "parent"]}
});

ρσ_in = function () {
    if (typeof Map === "function" && typeof Set === "function") {
        return (function() {
            var ρσ_anonfunc = function (val, arr) {
                if (typeof arr === "string") {
                    return arr.indexOf(val) !== -1;
                }
                if (typeof arr.__contains__ === "function") {
                    return arr.__contains__(val);
                }
                if (arr instanceof Map || arr instanceof Set) {
                    return arr.has(val);
                }
                if (ρσ_arraylike(arr)) {
                    return ρσ_list_contains.call(arr, val);
                }
                return Object.prototype.hasOwnProperty.call(arr, val);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["val", "arr"]}
            });
            return ρσ_anonfunc;
        })();
    }
    return (function() {
        var ρσ_anonfunc = function (val, arr) {
            if (typeof arr === "string") {
                return arr.indexOf(val) !== -1;
            }
            if (typeof arr.__contains__ === "function") {
                return arr.__contains__(val);
            }
            if (ρσ_arraylike(arr)) {
                return ρσ_list_contains.call(arr, val);
            }
            return Object.prototype.hasOwnProperty.call(arr, val);
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["val", "arr"]}
        });
        return ρσ_anonfunc;
    })();
}();
function ρσ_Iterable(iterable) {
    var iterator, ans, result;
    if (ρσ_arraylike(iterable)) {
        return iterable;
    }
    if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        ans = ρσ_list_decorate([]);
        result = iterator.next();
        while (!result.done) {
            ans.push(result.value);
            result = iterator.next();
        }
        return ans;
    }
    return Object.keys(iterable);
};
if (!ρσ_Iterable.__argnames__) Object.defineProperties(ρσ_Iterable, {
    __argnames__ : {value: ["iterable"]}
});

ρσ_desugar_kwargs = function () {
    if (typeof Object.assign === "function") {
        return function () {
            var ans;
            ans = Object.create(null);
            ans[ρσ_kwargs_symbol] = true;
            for (var i = 0; i < arguments.length; i++) {
                Object.assign(ans, arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]);
            }
            return ans;
        };
    }
    return function () {
        var ans, keys;
        ans = Object.create(null);
        ans[ρσ_kwargs_symbol] = true;
        for (var i = 0; i < arguments.length; i++) {
            keys = Object.keys(arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]);
            for (var j = 0; j < keys.length; j++) {
                ans[ρσ_bound_index(keys[(typeof j === "number" && j < 0) ? keys.length + j : j], ans)] = (ρσ_expr_temp = arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i])[ρσ_bound_index(keys[(typeof j === "number" && j < 0) ? keys.length + j : j], ρσ_expr_temp)];
            }
        }
        return ans;
    };
}();
function ρσ_interpolate_kwargs(f, supplied_args) {
    var has_prop, kwobj, args, prop;
    if (!f.__argnames__) {
        return f.apply(this, supplied_args);
    }
    has_prop = Object.prototype.hasOwnProperty;
    kwobj = supplied_args.pop();
    if (f.__handles_kwarg_interpolation__) {
        args = new Array(Math.max(supplied_args.length, f.__argnames__.length) + 1);
        args[args.length-1] = kwobj;
        for (var i = 0; i < args.length - 1; i++) {
            if (i < f.__argnames__.length) {
                prop = (ρσ_expr_temp = f.__argnames__)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
                if (has_prop.call(kwobj, prop)) {
                    args[(typeof i === "number" && i < 0) ? args.length + i : i] = kwobj[(typeof prop === "number" && prop < 0) ? kwobj.length + prop : prop];
                    delete kwobj[prop];
                } else if (i < supplied_args.length) {
                    args[(typeof i === "number" && i < 0) ? args.length + i : i] = supplied_args[(typeof i === "number" && i < 0) ? supplied_args.length + i : i];
                }
            } else {
                args[(typeof i === "number" && i < 0) ? args.length + i : i] = supplied_args[(typeof i === "number" && i < 0) ? supplied_args.length + i : i];
            }
        }
        return f.apply(this, args);
    }
    for (var i = 0; i < f.__argnames__.length; i++) {
        prop = (ρσ_expr_temp = f.__argnames__)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
        if (has_prop.call(kwobj, prop)) {
            supplied_args[(typeof i === "number" && i < 0) ? supplied_args.length + i : i] = kwobj[(typeof prop === "number" && prop < 0) ? kwobj.length + prop : prop];
        }
    }
    return f.apply(this, supplied_args);
};
if (!ρσ_interpolate_kwargs.__argnames__) Object.defineProperties(ρσ_interpolate_kwargs, {
    __argnames__ : {value: ["f", "supplied_args"]}
});

function ρσ_interpolate_kwargs_constructor(apply, f, supplied_args) {
    if (apply) {
        f.apply(this, supplied_args);
    } else {
        ρσ_interpolate_kwargs.call(this, f, supplied_args);
    }
    return this;
};
if (!ρσ_interpolate_kwargs_constructor.__argnames__) Object.defineProperties(ρσ_interpolate_kwargs_constructor, {
    __argnames__ : {value: ["apply", "f", "supplied_args"]}
});

function ρσ_getitem(obj, key) {
    if (obj.__getitem__) {
        return obj.__getitem__(key);
    }
    if (typeof key === "number" && key < 0) {
        key += obj.length;
    }
    return obj[(typeof key === "number" && key < 0) ? obj.length + key : key];
};
if (!ρσ_getitem.__argnames__) Object.defineProperties(ρσ_getitem, {
    __argnames__ : {value: ["obj", "key"]}
});

function ρσ_setitem(obj, key, val) {
    if (obj.__setitem__) {
        obj.__setitem__(key, val);
    } else {
        if (typeof key === "number" && key < 0) {
            key += obj.length;
        }
        obj[(typeof key === "number" && key < 0) ? obj.length + key : key] = val;
    }
};
if (!ρσ_setitem.__argnames__) Object.defineProperties(ρσ_setitem, {
    __argnames__ : {value: ["obj", "key", "val"]}
});

function ρσ_delitem(obj, key) {
    if (obj.__delitem__) {
        obj.__delitem__(key);
    } else if (typeof obj.splice === "function") {
        obj.splice(key, 1);
    } else {
        if (typeof key === "number" && key < 0) {
            key += obj.length;
        }
        delete obj[key];
    }
};
if (!ρσ_delitem.__argnames__) Object.defineProperties(ρσ_delitem, {
    __argnames__ : {value: ["obj", "key"]}
});

function ρσ_bound_index(idx, arr) {
    if (typeof idx === "number" && idx < 0) {
        idx += arr.length;
    }
    return idx;
};
if (!ρσ_bound_index.__argnames__) Object.defineProperties(ρσ_bound_index, {
    __argnames__ : {value: ["idx", "arr"]}
});

function ρσ_splice(arr, val, start, end) {
    start = start || 0;
    if (start < 0) {
        start += arr.length;
    }
    if (end === undefined) {
        end = arr.length;
    }
    if (end < 0) {
        end += arr.length;
    }
    Array.prototype.splice.apply(arr, [start, end - start].concat(val));
};
if (!ρσ_splice.__argnames__) Object.defineProperties(ρσ_splice, {
    __argnames__ : {value: ["arr", "val", "start", "end"]}
});

ρσ_exists = (function(){
    var ρσ_d = {};
    ρσ_d["n"] = (function() {
        var ρσ_anonfunc = function (expr) {
            return expr !== undefined && expr !== null;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr"]}
        });
        return ρσ_anonfunc;
    })();
    ρσ_d["d"] = (function() {
        var ρσ_anonfunc = function (expr) {
            if (expr === undefined || expr === null) {
                return Object.create(null);
            }
            return expr;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr"]}
        });
        return ρσ_anonfunc;
    })();
    ρσ_d["c"] = (function() {
        var ρσ_anonfunc = function (expr) {
            if (typeof expr === "function") {
                return expr;
            }
            return function () {
                return undefined;
            };
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr"]}
        });
        return ρσ_anonfunc;
    })();
    ρσ_d["g"] = (function() {
        var ρσ_anonfunc = function (expr) {
            if (expr === undefined || expr === null || typeof expr.__getitem__ !== "function") {
                return (function(){
                    var ρσ_d = {};
                    ρσ_d["__getitem__"] = function () {
                        return undefined;
                    };
                    return ρσ_d;
                }).call(this);
            }
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr"]}
        });
        return ρσ_anonfunc;
    })();
    ρσ_d["e"] = (function() {
        var ρσ_anonfunc = function (expr, alt) {
            return (expr === undefined || expr === null) ? alt : expr;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr", "alt"]}
        });
        return ρσ_anonfunc;
    })();
    return ρσ_d;
}).call(this);
function ρσ_mixin() {
    var seen, resolved_props, p, target, props, name;
    seen = Object.create(null);
    seen.__argnames__ = seen.__handles_kwarg_interpolation__ = seen.__init__ = seen.__annotations__ = seen.__doc__ = seen.__bind_methods__ = seen.__bases__ = seen.constructor = seen.__class__ = true;
    resolved_props = {};
    p = target = arguments[0].prototype;
    while (p && p !== Object.prototype) {
        props = Object.getOwnPropertyNames(p);
        for (var i = 0; i < props.length; i++) {
            seen[ρσ_bound_index(props[(typeof i === "number" && i < 0) ? props.length + i : i], seen)] = true;
        }
        p = Object.getPrototypeOf(p);
    }
    for (var c = 1; c < arguments.length; c++) {
        p = arguments[(typeof c === "number" && c < 0) ? arguments.length + c : c].prototype;
        while (p && p !== Object.prototype) {
            props = Object.getOwnPropertyNames(p);
            for (var i = 0; i < props.length; i++) {
                name = props[(typeof i === "number" && i < 0) ? props.length + i : i];
                if (seen[(typeof name === "number" && name < 0) ? seen.length + name : name]) {
                    continue;
                }
                seen[(typeof name === "number" && name < 0) ? seen.length + name : name] = true;
                resolved_props[(typeof name === "number" && name < 0) ? resolved_props.length + name : name] = Object.getOwnPropertyDescriptor(p, name);
            }
            p = Object.getPrototypeOf(p);
        }
    }
    Object.defineProperties(target, resolved_props);
};

function ρσ_instanceof() {
    var obj, bases, q, cls, p;
    obj = arguments[0];
    bases = "";
    if (obj && obj.constructor && obj.constructor.prototype) {
        bases = obj.constructor.prototype.__bases__ || "";
    }
    for (var i = 1; i < arguments.length; i++) {
        q = arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i];
        if (obj instanceof q) {
            return true;
        }
        if ((q === Array || q === ρσ_list_constructor) && Array.isArray(obj)) {
            return true;
        }
        if (q === ρσ_str && (typeof obj === "string" || obj instanceof String)) {
            return true;
        }
        if (bases.length > 1) {
            for (var c = 1; c < bases.length; c++) {
                cls = bases[(typeof c === "number" && c < 0) ? bases.length + c : c];
                while (cls) {
                    if (q === cls) {
                        return true;
                    }
                    p = Object.getPrototypeOf(cls.prototype);
                    if (!p) {
                        break;
                    }
                    cls = p.constructor;
                }
            }
        }
    }
    return false;
};
function sum(iterable, start) {
    var ans, iterator, r;
    if (Array.isArray(iterable)) {
        return iterable.reduce((function() {
            var ρσ_anonfunc = function (prev, cur) {
                return prev + cur;
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["prev", "cur"]}
            });
            return ρσ_anonfunc;
        })(), start || 0);
    }
    ans = start || 0;
    iterator = iter(iterable);
    r = iterator.next();
    while (!r.done) {
        ans += r.value;
        r = iterator.next();
    }
    return ans;
};
if (!sum.__argnames__) Object.defineProperties(sum, {
    __argnames__ : {value: ["iterable", "start"]}
});

function map() {
    var iterators, func, args, ans;
    iterators = new Array(arguments.length - 1);
    func = arguments[0];
    args = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
        iterators[ρσ_bound_index(i - 1, iterators)] = iter(arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]);
    }
    ans = {'_func':func, '_iterators':iterators, '_args':args};
    ans[ρσ_iterator_symbol] = function () {
        return this;
    };
    ans["next"] = function () {
        var r;
        for (var i = 0; i < this._iterators.length; i++) {
            r = (ρσ_expr_temp = this._iterators)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i].next();
            if (r.done) {
                return {'done':true};
            }
            (ρσ_expr_temp = this._args)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] = r.value;
        }
        return {'done':false, 'value':this._func.apply(undefined, this._args)};
    };
    return ans;
};

function filter(func_or_none, iterable) {
    var func, ans;
    func = (func_or_none === null) ? ρσ_bool : func_or_none;
    ans = {'_func':func, '_iterator':ρσ_iter(iterable)};
    ans[ρσ_iterator_symbol] = function () {
        return this;
    };
    ans["next"] = function () {
        var r;
        r = this._iterator.next();
        while (!r.done) {
            if (this._func(r.value)) {
                return r;
            }
            r = this._iterator.next();
        }
        return {'done':true};
    };
    return ans;
};
if (!filter.__argnames__) Object.defineProperties(filter, {
    __argnames__ : {value: ["func_or_none", "iterable"]}
});

function zip() {
    var iterators, ans;
    iterators = new Array(arguments.length);
    for (var i = 0; i < arguments.length; i++) {
        iterators[(typeof i === "number" && i < 0) ? iterators.length + i : i] = iter(arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]);
    }
    ans = {'_iterators':iterators};
    ans[ρσ_iterator_symbol] = function () {
        return this;
    };
    ans["next"] = function () {
        var args, r;
        args = new Array(this._iterators.length);
        for (var i = 0; i < this._iterators.length; i++) {
            r = (ρσ_expr_temp = this._iterators)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i].next();
            if (r.done) {
                return {'done':true};
            }
            args[(typeof i === "number" && i < 0) ? args.length + i : i] = r.value;
        }
        return {'done':false, 'value':args};
    };
    return ans;
};

function any(iterable) {
    var i;
    var ρσ_Iter0 = ρσ_Iterable(iterable);
    for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
        i = ρσ_Iter0[ρσ_Index0];
        if (i) {
            return true;
        }
    }
    return false;
};
if (!any.__argnames__) Object.defineProperties(any, {
    __argnames__ : {value: ["iterable"]}
});

function all(iterable) {
    var i;
    var ρσ_Iter1 = ρσ_Iterable(iterable);
    for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
        i = ρσ_Iter1[ρσ_Index1];
        if (!i) {
            return false;
        }
    }
    return true;
};
if (!all.__argnames__) Object.defineProperties(all, {
    __argnames__ : {value: ["iterable"]}
});
var define_str_func, ρσ_unpack, ρσ_orig_split, ρσ_orig_replace;
function ρσ_repr_js_builtin(x, as_array) {
    var ans, b, keys, key;
    ans = [];
    b = "{}";
    if (as_array) {
        b = "[]";
        for (var i = 0; i < x.length; i++) {
            ans.push(ρσ_repr(x[(typeof i === "number" && i < 0) ? x.length + i : i]));
        }
    } else {
        keys = Object.keys(x);
        for (var k = 0; k < keys.length; k++) {
            key = keys[(typeof k === "number" && k < 0) ? keys.length + k : k];
            ans.push(JSON.stringify(key) + ":" + ρσ_repr(x[(typeof key === "number" && key < 0) ? x.length + key : key]));
        }
    }
    return b[0] + ans.join(", ") + b[1];
};
if (!ρσ_repr_js_builtin.__argnames__) Object.defineProperties(ρσ_repr_js_builtin, {
    __argnames__ : {value: ["x", "as_array"]}
});

function ρσ_html_element_to_string(elem) {
    var attrs, val, attr, ans;
    attrs = [];
    var ρσ_Iter0 = ρσ_Iterable(elem.attributes);
    for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
        attr = ρσ_Iter0[ρσ_Index0];
        if (attr.specified) {
            val = attr.value;
            if (val.length > 10) {
                val = val.slice(0, 15) + "...";
            }
            val = JSON.stringify(val);
            attrs.push("" + ρσ_str.format("{}", attr.name) + "=" + ρσ_str.format("{}", val) + "");
        }
    }
    attrs = (attrs.length) ? " " + attrs.join(" ") : "";
    ans = "<" + ρσ_str.format("{}", elem.tagName) + "" + ρσ_str.format("{}", attrs) + ">";
    return ans;
};
if (!ρσ_html_element_to_string.__argnames__) Object.defineProperties(ρσ_html_element_to_string, {
    __argnames__ : {value: ["elem"]}
});

function ρσ_repr(x) {
    var ans, name;
    if (x === null) {
        return "None";
    }
    if (x === undefined) {
        return "undefined";
    }
    ans = x;
    if (typeof x.__repr__ === "function") {
        ans = x.__repr__();
    } else if (x === true || x === false) {
        ans = (x) ? "True" : "False";
    } else if (Array.isArray(x)) {
        ans = ρσ_repr_js_builtin(x, true);
    } else if (typeof x === "function") {
        ans = x.toString();
    } else if (typeof x === "object" && !x.toString) {
        ans = ρσ_repr_js_builtin(x);
    } else {
        name = Object.prototype.toString.call(x).slice(8, -1);
        if (ρσ_not_equals("Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".indexOf(name), -1)) {
            return name + "([" + x.map((function() {
                var ρσ_anonfunc = function (i) {
                    return str.format("0x{:02x}", i);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["i"]}
                });
                return ρσ_anonfunc;
            })()).join(", ") + "])";
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
            ans = ρσ_html_element_to_string(x);
        } else {
            ans = (typeof x.toString === "function") ? x.toString() : x;
        }
        if (ans === "[object Object]") {
            return ρσ_repr_js_builtin(x);
        }
        try {
            ans = JSON.stringify(x);
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            {
            } 
        }
    }
    return ans + "";
};
if (!ρσ_repr.__argnames__) Object.defineProperties(ρσ_repr, {
    __argnames__ : {value: ["x"]}
});

function ρσ_str(x) {
    var ans, name;
    if (x === null) {
        return "None";
    }
    if (x === undefined) {
        return "undefined";
    }
    ans = x;
    if (typeof x.__str__ === "function") {
        ans = x.__str__();
    } else if (typeof x.__repr__ === "function") {
        ans = x.__repr__();
    } else if (x === true || x === false) {
        ans = (x) ? "True" : "False";
    } else if (Array.isArray(x)) {
        ans = ρσ_repr_js_builtin(x, true);
    } else if (typeof x.toString === "function") {
        name = Object.prototype.toString.call(x).slice(8, -1);
        if (ρσ_not_equals("Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".indexOf(name), -1)) {
            return name + "([" + x.map((function() {
                var ρσ_anonfunc = function (i) {
                    return str.format("0x{:02x}", i);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["i"]}
                });
                return ρσ_anonfunc;
            })()).join(", ") + "])";
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
            ans = ρσ_html_element_to_string(x);
        } else {
            ans = x.toString();
        }
        if (ans === "[object Object]") {
            ans = ρσ_repr_js_builtin(x);
        }
    } else if (typeof x === "object" && !x.toString) {
        ans = ρσ_repr_js_builtin(x);
    }
    return ans + "";
};
if (!ρσ_str.__argnames__) Object.defineProperties(ρσ_str, {
    __argnames__ : {value: ["x"]}
});

define_str_func = (function() {
    var ρσ_anonfunc = function (name, func) {
        var f;
        (ρσ_expr_temp = ρσ_str.prototype)[(typeof name === "number" && name < 0) ? ρσ_expr_temp.length + name : name] = func;
        ρσ_str[(typeof name === "number" && name < 0) ? ρσ_str.length + name : name] = f = func.call.bind(func);
        if (func.__argnames__) {
            Object.defineProperty(f, "__argnames__", (function(){
                var ρσ_d = {};
                ρσ_d["value"] = ['string'].concat(func.__argnames__);
                return ρσ_d;
            }).call(this));
        }
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["name", "func"]}
    });
    return ρσ_anonfunc;
})();
ρσ_unpack = [String.prototype.split.call.bind(String.prototype.split), String.prototype.replace.call.bind(String.prototype.replace)];
ρσ_orig_split = ρσ_unpack[0];
ρσ_orig_replace = ρσ_unpack[1];
define_str_func("format", function () {
    var template, args, kwargs, explicit, implicit, idx, split, ans, pos, in_brace, markup, ch;
    template = this;
    if (template === undefined) {
        throw new TypeError("Template is required");
    }
    args = Array.prototype.slice.call(arguments);
    kwargs = {};
    if (args[args.length-1] && args[args.length-1][ρσ_kwargs_symbol] !== undefined) {
        kwargs = args[args.length-1];
        args = args.slice(0, -1);
    }
    explicit = implicit = false;
    idx = 0;
    split = ρσ_orig_split;
    if (ρσ_str.format._template_resolve_pat === undefined) {
        ρσ_str.format._template_resolve_pat = /[.\[]/;
    }
    function resolve(arg, object) {
        var ρσ_unpack, first, key, rest, ans;
        if (!arg) {
            return object;
        }
        ρσ_unpack = [arg[0], arg.slice(1)];
        first = ρσ_unpack[0];
        arg = ρσ_unpack[1];
        key = split(arg, ρσ_str.format._template_resolve_pat, 1)[0];
        rest = arg.slice(key.length);
        ans = (first === "[") ? object[ρσ_bound_index(key.slice(0, -1), object)] : getattr(object, key);
        if (ans === undefined) {
            throw new KeyError((first === "[") ? key.slice(0, -1) : key);
        }
        return resolve(rest, ans);
    };
    if (!resolve.__argnames__) Object.defineProperties(resolve, {
        __argnames__ : {value: ["arg", "object"]}
    });

    function resolve_format_spec(format_spec) {
        if (ρσ_str.format._template_resolve_fs_pat === undefined) {
            ρσ_str.format._template_resolve_fs_pat = /[{]([a-zA-Z0-9_]+)[}]/g;
        }
        return format_spec.replace(ρσ_str.format._template_resolve_fs_pat, (function() {
            var ρσ_anonfunc = function (match, key) {
                if (!Object.prototype.hasOwnProperty.call(kwargs, key)) {
                    return "";
                }
                return "" + kwargs[(typeof key === "number" && key < 0) ? kwargs.length + key : key];
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["match", "key"]}
            });
            return ρσ_anonfunc;
        })());
    };
    if (!resolve_format_spec.__argnames__) Object.defineProperties(resolve_format_spec, {
        __argnames__ : {value: ["format_spec"]}
    });

    function set_comma(ans, comma) {
        var sep;
        if (comma !== ",") {
            sep = 1234;
            sep = sep.toLocaleString(undefined, {useGrouping: true})[1];
            ans = str.replace(ans, sep, comma);
        }
        return ans;
    };
    if (!set_comma.__argnames__) Object.defineProperties(set_comma, {
        __argnames__ : {value: ["ans", "comma"]}
    });

    function safe_comma(value, comma) {
        try {
            return set_comma(value.toLocaleString(undefined, {useGrouping: true}), comma);
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            {
                return value.toString(10);
            } 
        }
    };
    if (!safe_comma.__argnames__) Object.defineProperties(safe_comma, {
        __argnames__ : {value: ["value", "comma"]}
    });

    function safe_fixed(value, precision, comma) {
        if (!comma) {
            return value.toFixed(precision);
        }
        try {
            return set_comma(value.toLocaleString(undefined, {useGrouping: true, minimumFractionDigits: precision, maximumFractionDigits: precision}), comma);
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            {
                return value.toFixed(precision);
            } 
        }
    };
    if (!safe_fixed.__argnames__) Object.defineProperties(safe_fixed, {
        __argnames__ : {value: ["value", "precision", "comma"]}
    });

    function apply_formatting(value, format_spec) {
        var ρσ_unpack, fill, align, sign, fhash, zeropad, width, comma, precision, ftype, is_numeric, is_int, lftype, code, prec, exp, nval, is_positive, left, right;
        if (format_spec.indexOf("{") !== -1) {
            format_spec = resolve_format_spec(format_spec);
        }
        if (ρσ_str.format._template_format_pat === undefined) {
            ρσ_str.format._template_format_pat = /([^{}](?=[<>=^]))?([<>=^])?([-+\x20])?(\#)?(0)?(\d+)?([,_])?(?:\.(\d+))?([bcdeEfFgGnosxX%])?/;
        }
        try {
            ρσ_unpack = format_spec.match(ρσ_str.format._template_format_pat).slice(1);
ρσ_unpack = ρσ_unpack_asarray(9, ρσ_unpack);
            fill = ρσ_unpack[0];
            align = ρσ_unpack[1];
            sign = ρσ_unpack[2];
            fhash = ρσ_unpack[3];
            zeropad = ρσ_unpack[4];
            width = ρσ_unpack[5];
            comma = ρσ_unpack[6];
            precision = ρσ_unpack[7];
            ftype = ρσ_unpack[8];
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            if (ρσ_Exception instanceof TypeError) {
                return value;
            } else {
                throw ρσ_Exception;
            }
        }
        if (zeropad) {
            fill = fill || "0";
            align = align || "=";
        } else {
            fill = fill || " ";
            align = align || ">";
        }
        is_numeric = Number(value) === value;
        is_int = is_numeric && value % 1 === 0;
        precision = parseInt(precision, 10);
        lftype = (ftype || "").toLowerCase();
        if (ftype === "n") {
            is_numeric = true;
            if (is_int) {
                if (comma) {
                    throw new ValueError("Cannot specify ',' with 'n'");
                }
                value = parseInt(value, 10).toLocaleString();
            } else {
                value = parseFloat(value).toLocaleString();
            }
        } else if (['b', 'c', 'd', 'o', 'x'].indexOf(lftype) !== -1) {
            value = parseInt(value, 10);
            is_numeric = true;
            if (!isNaN(value)) {
                if (ftype === "b") {
                    value = (value >>> 0).toString(2);
                    if (fhash) {
                        value = "0b" + value;
                    }
                } else if (ftype === "c") {
                    if (value > 65535) {
                        code = value - 65536;
                        value = String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
                    } else {
                        value = String.fromCharCode(value);
                    }
                } else if (ftype === "d") {
                    if (comma) {
                        value = safe_comma(value, comma);
                    } else {
                        value = value.toString(10);
                    }
                } else if (ftype === "o") {
                    value = value.toString(8);
                    if (fhash) {
                        value = "0o" + value;
                    }
                } else if (lftype === "x") {
                    value = value.toString(16);
                    value = (ftype === "x") ? value.toLowerCase() : value.toUpperCase();
                    if (fhash) {
                        value = "0x" + value;
                    }
                }
            }
        } else if (['e','f','g','%'].indexOf(lftype) !== -1) {
            is_numeric = true;
            value = parseFloat(value);
            prec = (isNaN(precision)) ? 6 : precision;
            if (lftype === "e") {
                value = value.toExponential(prec);
                value = (ftype === "E") ? value.toUpperCase() : value.toLowerCase();
            } else if (lftype === "f") {
                value = safe_fixed(value, prec, comma);
                value = (ftype === "F") ? value.toUpperCase() : value.toLowerCase();
            } else if (lftype === "%") {
                value *= 100;
                value = safe_fixed(value, prec, comma) + "%";
            } else if (lftype === "g") {
                prec = max(1, prec);
                exp = parseInt(split(value.toExponential(prec - 1).toLowerCase(), "e")[1], 10);
                if (-4 <= exp && exp < prec) {
                    value = safe_fixed(value, prec - 1 - exp, comma);
                } else {
                    value = value.toExponential(prec - 1);
                }
                value = value.replace(/0+$/g, "");
                if (value[value.length-1] === ".") {
                    value = value.slice(0, -1);
                }
                if (ftype === "G") {
                    value = value.toUpperCase();
                }
            }
        } else {
            if (comma) {
                value = parseInt(value, 10);
                if (isNaN(value)) {
                    throw new ValueError("Must use numbers with , or _");
                }
                value = safe_comma(value, comma);
            }
            value += "";
            if (!isNaN(precision)) {
                value = value.slice(0, precision);
            }
        }
        value += "";
        if (is_numeric && sign) {
            nval = Number(value);
            is_positive = !isNaN(nval) && nval >= 0;
            if (is_positive && (sign === " " || sign === "+")) {
                value = sign + value;
            }
        }
        function repeat(char, num) {
            return (new Array(num+1)).join(char);
        };
        if (!repeat.__argnames__) Object.defineProperties(repeat, {
            __argnames__ : {value: ["char", "num"]}
        });

        if (is_numeric && width && width[0] === "0") {
            width = width.slice(1);
            ρσ_unpack = ["0", "="];
            fill = ρσ_unpack[0];
            align = ρσ_unpack[1];
        }
        width = parseInt(width || "-1", 10);
        if (isNaN(width)) {
            throw new ValueError("Invalid width specification: " + width);
        }
        if (fill && value.length < width) {
            if (align === "<") {
                value = value + repeat(fill, width - value.length);
            } else if (align === ">") {
                value = repeat(fill, width - value.length) + value;
            } else if (align === "^") {
                left = Math.floor((width - value.length) / 2);
                right = width - left - value.length;
                value = repeat(fill, left) + value + repeat(fill, right);
            } else if (align === "=") {
                if (ρσ_in(value[0], "+- ")) {
                    value = value[0] + repeat(fill, width - value.length) + value.slice(1);
                } else {
                    value = repeat(fill, width - value.length) + value;
                }
            } else {
                throw new ValueError("Unrecognized alignment: " + align);
            }
        }
        return value;
    };
    if (!apply_formatting.__argnames__) Object.defineProperties(apply_formatting, {
        __argnames__ : {value: ["value", "format_spec"]}
    });

    function parse_markup(markup) {
        var key, transformer, format_spec, pos, state, ch;
        key = transformer = format_spec = "";
        pos = 0;
        state = 0;
        while (pos < markup.length) {
            ch = markup[(typeof pos === "number" && pos < 0) ? markup.length + pos : pos];
            if (state === 0) {
                if (ch === "!") {
                    state = 1;
                } else if (ch === ":") {
                    state = 2;
                } else {
                    key += ch;
                }
            } else if (state === 1) {
                if (ch === ":") {
                    state = 2;
                } else {
                    transformer += ch;
                }
            } else {
                format_spec += ch;
            }
            pos += 1;
        }
        return [key, transformer, format_spec];
    };
    if (!parse_markup.__argnames__) Object.defineProperties(parse_markup, {
        __argnames__ : {value: ["markup"]}
    });

    function render_markup(markup) {
        var ρσ_unpack, key, transformer, format_spec, lkey, nvalue, object, ans;
        ρσ_unpack = parse_markup(markup);
ρσ_unpack = ρσ_unpack_asarray(3, ρσ_unpack);
        key = ρσ_unpack[0];
        transformer = ρσ_unpack[1];
        format_spec = ρσ_unpack[2];
        if (transformer && ['a', 'r', 's'].indexOf(transformer) === -1) {
            throw new ValueError("Unknown conversion specifier: " + transformer);
        }
        lkey = key.length && split(key, /[.\[]/, 1)[0];
        if (lkey) {
            explicit = true;
            if (implicit) {
                throw new ValueError("cannot switch from automatic field numbering to manual field specification");
            }
            nvalue = parseInt(lkey);
            object = (isNaN(nvalue)) ? kwargs[(typeof lkey === "number" && lkey < 0) ? kwargs.length + lkey : lkey] : args[(typeof nvalue === "number" && nvalue < 0) ? args.length + nvalue : nvalue];
            if (object === undefined) {
                if (isNaN(nvalue)) {
                    throw new KeyError(lkey);
                }
                throw new IndexError(lkey);
            }
            object = resolve(key.slice(lkey.length), object);
        } else {
            implicit = true;
            if (explicit) {
                throw new ValueError("cannot switch from manual field specification to automatic field numbering");
            }
            if (idx >= args.length) {
                throw new IndexError("Not enough arguments to match template: " + template);
            }
            object = args[(typeof idx === "number" && idx < 0) ? args.length + idx : idx];
            idx += 1;
        }
        if (typeof object === "function") {
            object = object();
        }
        ans = "" + object;
        if (format_spec) {
            ans = apply_formatting(ans, format_spec);
        }
        return ans;
    };
    if (!render_markup.__argnames__) Object.defineProperties(render_markup, {
        __argnames__ : {value: ["markup"]}
    });

    ans = "";
    pos = 0;
    in_brace = 0;
    markup = "";
    while (pos < template.length) {
        ch = template[(typeof pos === "number" && pos < 0) ? template.length + pos : pos];
        if (in_brace) {
            if (ch === "{") {
                in_brace += 1;
                markup += "{";
            } else if (ch === "}") {
                in_brace -= 1;
                if (in_brace > 0) {
                    markup += "}";
                } else {
                    ans += render_markup(markup);
                }
            } else {
                markup += ch;
            }
        } else {
            if (ch === "{") {
                if (template[ρσ_bound_index(pos + 1, template)] === "{") {
                    pos += 1;
                    ans += "{";
                } else {
                    in_brace = 1;
                    markup = "";
                }
            } else {
                ans += ch;
                if (ch === "}" && template[ρσ_bound_index(pos + 1, template)] === "}") {
                    pos += 1;
                }
            }
        }
        pos += 1;
    }
    if (in_brace) {
        throw new ValueError("expected '}' before end of string");
    }
    return ans;
});
define_str_func("capitalize", function () {
    var string;
    string = this;
    if (string) {
        string = string[0].toUpperCase() + string.slice(1).toLowerCase();
    }
    return string;
});
define_str_func("center", (function() {
    var ρσ_anonfunc = function (width, fill) {
        var left, right;
        left = Math.floor((width - this.length) / 2);
        right = width - left - this.length;
        fill = fill || " ";
        return new Array(left+1).join(fill) + this + new Array(right+1).join(fill);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["width", "fill"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("count", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var string, ρσ_unpack, pos, step, ans;
        string = this;
        start = start || 0;
        end = end || string.length;
        if (start < 0 || end < 0) {
            string = string.slice(start, end);
            ρσ_unpack = [0, string.length];
            start = ρσ_unpack[0];
            end = ρσ_unpack[1];
        }
        pos = start;
        step = needle.length;
        if (!step) {
            return 0;
        }
        ans = 0;
        while (pos !== -1) {
            pos = string.indexOf(needle, pos);
            if (pos !== -1) {
                ans += 1;
                pos += step;
            }
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("endswith", (function() {
    var ρσ_anonfunc = function (suffixes, start, end) {
        var string, q;
        string = this;
        start = start || 0;
        if (typeof suffixes === "string") {
            suffixes = [suffixes];
        }
        if (end !== undefined) {
            string = string.slice(0, end);
        }
        for (var i = 0; i < suffixes.length; i++) {
            q = suffixes[(typeof i === "number" && i < 0) ? suffixes.length + i : i];
            if (string.indexOf(q, Math.max(start, string.length - q.length)) !== -1) {
                return true;
            }
        }
        return false;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["suffixes", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("startswith", (function() {
    var ρσ_anonfunc = function (prefixes, start, end) {
        var prefix;
        start = start || 0;
        if (typeof prefixes === "string") {
            prefixes = [prefixes];
        }
        for (var i = 0; i < prefixes.length; i++) {
            prefix = prefixes[(typeof i === "number" && i < 0) ? prefixes.length + i : i];
            end = (end === undefined) ? this.length : end;
            if (end - start >= prefix.length && prefix === this.slice(start, start + prefix.length)) {
                return true;
            }
        }
        return false;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["prefixes", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("find", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var ans;
        while (start < 0) {
            start += this.length;
        }
        ans = this.indexOf(needle, start);
        if (end !== undefined && ans !== -1) {
            while (end < 0) {
                end += this.length;
            }
            if (ans >= end - needle.length) {
                return -1;
            }
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rfind", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var ans;
        while (end < 0) {
            end += this.length;
        }
        ans = this.lastIndexOf(needle, end - 1);
        if (start !== undefined && ans !== -1) {
            while (start < 0) {
                start += this.length;
            }
            if (ans < start) {
                return -1;
            }
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("index", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var ans;
        ans = ρσ_str.prototype.find.apply(this, arguments);
        if (ans === -1) {
            throw new ValueError("substring not found");
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rindex", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var ans;
        ans = ρσ_str.prototype.rfind.apply(this, arguments);
        if (ans === -1) {
            throw new ValueError("substring not found");
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("islower", function () {
    return this.length > 0 && this.toLowerCase() === this.toString();
});
define_str_func("isupper", function () {
    return this.length > 0 && this.toUpperCase() === this.toString();
});
define_str_func("isspace", function () {
    return this.length > 0 && /^\s+$/.test(this);
});
define_str_func("join", (function() {
    var ρσ_anonfunc = function (iterable) {
        var ans, r;
        if (Array.isArray(iterable)) {
            return iterable.join(this);
        }
        ans = "";
        r = iterable.next();
        while (!r.done) {
            if (ans) {
                ans += this;
            }
            ans += r.value;
            r = iterable.next();
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["iterable"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("ljust", (function() {
    var ρσ_anonfunc = function (width, fill) {
        var string;
        string = this;
        if (width > string.length) {
            fill = fill || " ";
            string += new Array(width - string.length + 1).join(fill);
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["width", "fill"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rjust", (function() {
    var ρσ_anonfunc = function (width, fill) {
        var string;
        string = this;
        if (width > string.length) {
            fill = fill || " ";
            string = new Array(width - string.length + 1).join(fill) + string;
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["width", "fill"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("lower", function () {
    return this.toLowerCase();
});
define_str_func("upper", function () {
    return this.toUpperCase();
});
define_str_func("lstrip", (function() {
    var ρσ_anonfunc = function (chars) {
        var string, pos;
        string = this;
        pos = 0;
        chars = chars || ρσ_str.whitespace;
        while (chars.indexOf(string[(typeof pos === "number" && pos < 0) ? string.length + pos : pos]) !== -1) {
            pos += 1;
        }
        if (pos) {
            string = string.slice(pos);
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["chars"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rstrip", (function() {
    var ρσ_anonfunc = function (chars) {
        var string, pos;
        string = this;
        pos = string.length - 1;
        chars = chars || ρσ_str.whitespace;
        while (chars.indexOf(string[(typeof pos === "number" && pos < 0) ? string.length + pos : pos]) !== -1) {
            pos -= 1;
        }
        if (pos < string.length - 1) {
            string = string.slice(0, pos + 1);
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["chars"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("strip", (function() {
    var ρσ_anonfunc = function (chars) {
        return ρσ_str.prototype.lstrip.call(ρσ_str.prototype.rstrip.call(this, chars), chars);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["chars"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("partition", (function() {
    var ρσ_anonfunc = function (sep) {
        var idx;
        idx = this.indexOf(sep);
        if (idx === -1) {
            return [this, "", ""];
        }
        return [this.slice(0, idx), sep, this.slice(idx + sep.length)];
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["sep"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rpartition", (function() {
    var ρσ_anonfunc = function (sep) {
        var idx;
        idx = this.lastIndexOf(sep);
        if (idx === -1) {
            return ["", "", this];
        }
        return [this.slice(0, idx), sep, this.slice(idx + sep.length)];
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["sep"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("replace", (function() {
    var ρσ_anonfunc = function (old, repl, count) {
        var string, pos, idx;
        string = this;
        if (count === 1) {
            return ρσ_orig_replace(string, old, repl);
        }
        if (count < 1) {
            return string;
        }
        count = count || Number.MAX_VALUE;
        pos = 0;
        while (count > 0) {
            count -= 1;
            idx = string.indexOf(old, pos);
            if (idx === -1) {
                break;
            }
            pos = idx + repl.length;
            string = string.slice(0, idx) + repl + string.slice(idx + old.length);
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["old", "repl", "count"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("split", (function() {
    var ρσ_anonfunc = function (sep, maxsplit) {
        var split, ans, extra, parts;
        if (maxsplit === 0) {
            return ρσ_list_decorate([ this ]);
        }
        split = ρσ_orig_split;
        if (sep === undefined || sep === null) {
            if (maxsplit > 0) {
                ans = split(this, /(\s+)/);
                extra = "";
                parts = [];
                for (var i = 0; i < ans.length; i++) {
                    if (parts.length >= maxsplit + 1) {
                        extra += ans[(typeof i === "number" && i < 0) ? ans.length + i : i];
                    } else if (i % 2 === 0) {
                        parts.push(ans[(typeof i === "number" && i < 0) ? ans.length + i : i]);
                    }
                }
                parts[parts.length-1] += extra;
                ans = parts;
            } else {
                ans = split(this, /\s+/);
            }
        } else {
            if (sep === "") {
                throw new ValueError("empty separator");
            }
            ans = split(this, sep);
            if (maxsplit > 0 && ans.length > maxsplit) {
                extra = ans.slice(maxsplit).join(sep);
                ans = ans.slice(0, maxsplit);
                ans.push(extra);
            }
        }
        return ρσ_list_decorate(ans);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["sep", "maxsplit"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rsplit", (function() {
    var ρσ_anonfunc = function (sep, maxsplit) {
        var split, ans, is_space, pos, current, spc, ch, end, idx;
        if (!maxsplit) {
            return ρσ_str.prototype.split.call(this, sep);
        }
        split = ρσ_orig_split;
        if (sep === undefined || sep === null) {
            if (maxsplit > 0) {
                ans = [];
                is_space = /\s/;
                pos = this.length - 1;
                current = "";
                while (pos > -1 && maxsplit > 0) {
                    spc = false;
                    ch = (ρσ_expr_temp = this)[(typeof pos === "number" && pos < 0) ? ρσ_expr_temp.length + pos : pos];
                    while (pos > -1 && is_space.test(ch)) {
                        spc = true;
                        ch = this[--pos];
                    }
                    if (spc) {
                        if (current) {
                            ans.push(current);
                            maxsplit -= 1;
                        }
                        current = ch;
                    } else {
                        current += ch;
                    }
                    pos -= 1;
                }
                ans.push(this.slice(0, pos + 1) + current);
                ans.reverse();
            } else {
                ans = split(this, /\s+/);
            }
        } else {
            if (sep === "") {
                throw new ValueError("empty separator");
            }
            ans = [];
            pos = end = this.length;
            while (pos > -1 && maxsplit > 0) {
                maxsplit -= 1;
                idx = this.lastIndexOf(sep, pos);
                if (idx === -1) {
                    break;
                }
                ans.push(this.slice(idx + sep.length, end));
                pos = idx - 1;
                end = idx;
            }
            ans.push(this.slice(0, end));
            ans.reverse();
        }
        return ρσ_list_decorate(ans);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["sep", "maxsplit"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("splitlines", (function() {
    var ρσ_anonfunc = function (keepends) {
        var split, parts, ans;
        split = ρσ_orig_split;
        if (keepends) {
            parts = split(this, /((?:\r?\n)|\r)/);
            ans = [];
            for (var i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    ans.push(parts[(typeof i === "number" && i < 0) ? parts.length + i : i]);
                } else {
                    ans[ans.length-1] += parts[(typeof i === "number" && i < 0) ? parts.length + i : i];
                }
            }
        } else {
            ans = split(this, /(?:\r?\n)|\r/);
        }
        return ρσ_list_decorate(ans);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["keepends"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("swapcase", function () {
    var ans, a, b;
    ans = new Array(this.length);
    for (var i = 0; i < ans.length; i++) {
        a = (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
        b = a.toLowerCase();
        if (a === b) {
            b = a.toUpperCase();
        }
        ans[(typeof i === "number" && i < 0) ? ans.length + i : i] = b;
    }
    return ans.join("");
});
define_str_func("zfill", (function() {
    var ρσ_anonfunc = function (width) {
        var string;
        string = this;
        if (width > string.length) {
            string = new Array(width - string.length + 1).join("0") + string;
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["width"]}
    });
    return ρσ_anonfunc;
})());
ρσ_str.uchrs = (function() {
    var ρσ_anonfunc = function (string, with_positions) {
        return (function(){
            var ρσ_d = {};
            ρσ_d["_string"] = string;
            ρσ_d["_pos"] = 0;
            ρσ_d[ρσ_iterator_symbol] = function () {
                return this;
            };
            ρσ_d["next"] = function () {
                var length, pos, value, ans, extra;
                length = this._string.length;
                if (this._pos >= length) {
                    return (function(){
                        var ρσ_d = {};
                        ρσ_d["done"] = true;
                        return ρσ_d;
                    }).call(this);
                }
                pos = this._pos;
                value = this._string.charCodeAt(this._pos++);
                ans = "\ufffd";
                if (55296 <= value && value <= 56319) {
                    if (this._pos < length) {
                        extra = this._string.charCodeAt(this._pos++);
                        if ((extra & 56320) === 56320) {
                            ans = String.fromCharCode(value, extra);
                        }
                    }
                } else if ((value & 56320) !== 56320) {
                    ans = String.fromCharCode(value);
                }
                if (with_positions) {
                    return (function(){
                        var ρσ_d = {};
                        ρσ_d["done"] = false;
                        ρσ_d["value"] = ρσ_list_decorate([ pos, ans ]);
                        return ρσ_d;
                    }).call(this);
                } else {
                    return (function(){
                        var ρσ_d = {};
                        ρσ_d["done"] = false;
                        ρσ_d["value"] = ans;
                        return ρσ_d;
                    }).call(this);
                }
            };
            return ρσ_d;
        }).call(this);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["string", "with_positions"]}
    });
    return ρσ_anonfunc;
})();
ρσ_str.uslice = (function() {
    var ρσ_anonfunc = function (string, start, end) {
        var items, iterator, r;
        items = [];
        iterator = ρσ_str.uchrs(string);
        r = iterator.next();
        while (!r.done) {
            items.push(r.value);
            r = iterator.next();
        }
        return items.slice(start || 0, (end === undefined) ? items.length : end).join("");
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["string", "start", "end"]}
    });
    return ρσ_anonfunc;
})();
ρσ_str.ulen = (function() {
    var ρσ_anonfunc = function (string) {
        var iterator, r, ans;
        iterator = ρσ_str.uchrs(string);
        r = iterator.next();
        ans = 0;
        while (!r.done) {
            r = iterator.next();
            ans += 1;
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["string"]}
    });
    return ρσ_anonfunc;
})();
ρσ_str.ascii_lowercase = "abcdefghijklmnopqrstuvwxyz";
ρσ_str.ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
ρσ_str.ascii_letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
ρσ_str.digits = "0123456789";
ρσ_str.punctuation = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
ρσ_str.printable = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\u000b\f";
ρσ_str.whitespace = " \t\n\r\u000b\f";
define_str_func = undefined;
var str = ρσ_str, repr = ρσ_repr;;
    var ρσ_modules = {};
    ρσ_modules.res = {};
    ρσ_modules.orm = {};
    ρσ_modules["orm.tools"] = {};
    ρσ_modules["orm.fields"] = {};
    ρσ_modules["orm.pouchdb"] = {};
    ρσ_modules["orm.models"] = {};
    ρσ_modules["res.config"] = {};
    ρσ_modules.ir = {};
    ρσ_modules["ir.ui"] = {};
    ρσ_modules["res.debug"] = {};
    ρσ_modules["orm.api"] = {};
    ρσ_modules["res.users"] = {};
    ρσ_modules["res.partner"] = {};
    ρσ_modules["res.message"] = {};
    ρσ_modules["res.modules"] = {};
    ρσ_modules.modules = {};
    ρσ_modules["modules.modules"] = {};
    ρσ_modules["orm.http"] = {};
    ρσ_modules["res.controllers"] = {};
    ρσ_modules["modules.controllers"] = {};

    (function(){
        var __name__ = "res";

    })();

    (function(){
        var __name__ = "orm";

    })();

    (function(){
        var __name__ = "orm.tools";
        var array, month, configuration;
        function keys() {
            var object = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var sort = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? keys.__defaults__.sort : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "sort")){
                sort = ρσ_kwargs_obj.sort;
            }
            var key;
            if (exist(sort)) {
                object = (function() {
                    var ρσ_Iter = ρσ_Iterable(object), ρσ_Result = [], key;
                    for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                        key = ρσ_Iter[ρσ_Index];
                        ρσ_Result.push(ρσ_list_decorate([ key, (ρσ_expr_temp = object[(typeof key === "number" && key < 0) ? object.length + key : key])[(typeof sort === "number" && sort < 0) ? ρσ_expr_temp.length + sort : sort] ]));
                    }
                    ρσ_Result = ρσ_list_constructor(ρσ_Result);
                    return ρσ_Result;
                })();
                object.sort((function() {
                    var ρσ_anonfunc = function (a, b) {
                        return a[1] - b[1];
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["a", "b"]}
                    });
                    return ρσ_anonfunc;
                })());
                return (function() {
                    var ρσ_Iter = ρσ_Iterable(object), ρσ_Result = [], item;
                    for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                        item = ρσ_Iter[ρσ_Index];
                        ρσ_Result.push(item[0]);
                    }
                    ρσ_Result = ρσ_list_constructor(ρσ_Result);
                    return ρσ_Result;
                })();
            }
            return Object.keys(object);
        };
        if (!keys.__defaults__) Object.defineProperties(keys, {
            __defaults__ : {value: {sort:false}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["object", "sort"]}
        });

        function merge() {
            var args = Array.prototype.slice.call(arguments, 0);
            if (arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) args.pop();
            var target, object;
            target = args[0];
            var ρσ_Iter0 = ρσ_Iterable(args.slice(1));
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                object = ρσ_Iter0[ρσ_Index0];
                target = Object.assign(target, object);
            }
            return target;
        };
        if (!merge.__handles_kwarg_interpolation__) Object.defineProperties(merge, {
            __handles_kwarg_interpolation__ : {value: true}
        });

        function copy(object) {
            if (exist(object)) {
                if (ρσ_equals(type(object), Object)) {
                    return (function() {
                        var ρσ_Iter = ρσ_Iterable(object), ρσ_Result = {}, key;
                        for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                            key = ρσ_Iter[ρσ_Index];
                            ρσ_Result[key] = ((exist(object[(typeof key === "number" && key < 0) ? object.length + key : key]) && ρσ_in(type(object[(typeof key === "number" && key < 0) ? object.length + key : key]), ρσ_list_decorate([ Object, Array ]))) ? copy(object[(typeof key === "number" && key < 0) ? object.length + key : key]) : object[(typeof key === "number" && key < 0) ? object.length + key : key]);
                        }
                        return ρσ_Result;
                    })();
                } else if (ρσ_equals(type(object), Array)) {
                    return (function() {
                        var ρσ_Iter = ρσ_Iterable(object), ρσ_Result = [], value;
                        for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                            value = ρσ_Iter[ρσ_Index];
                            ρσ_Result.push((exist(value) && ρσ_in(type(value), ρσ_list_decorate([ Object, Array ]))) ? copy(value) : value);
                        }
                        ρσ_Result = ρσ_list_constructor(ρσ_Result);
                        return ρσ_Result;
                    })();
                }
            }
            return object;
        };
        if (!copy.__argnames__) Object.defineProperties(copy, {
            __argnames__ : {value: ["object"]}
        });

        function dict(entries) {
            var object, entry;
            object = {};
            var ρσ_Iter1 = ρσ_Iterable(entries);
            for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                entry = ρσ_Iter1[ρσ_Index1];
                object[ρσ_bound_index(entry[0], object)] = entry[1];
            }
            return object;
        };
        if (!dict.__argnames__) Object.defineProperties(dict, {
            __argnames__ : {value: ["entries"]}
        });

        function checkBase64(string) {
            try {
                return ρσ_equals(btoa(atob(string)), string);
            } catch (ρσ_Exception) {
                ρσ_last_exception = ρσ_Exception;
                {
                    return false;
                } 
            }
        };
        if (!checkBase64.__argnames__) Object.defineProperties(checkBase64, {
            __argnames__ : {value: ["string"]}
        });

        function exist(object) {
            if (ρσ_in(object, ρσ_list_decorate([ "", false, null, undefined, 0, {}, ρσ_list_decorate([]) ]))) {
                return false;
            } else if (typeof object == "object" && typeof object.length == "number") {
                return object.length > 0;
            }
            return true;
        };
        if (!exist.__argnames__) Object.defineProperties(exist, {
            __argnames__ : {value: ["object"]}
        });

        function empty(object) {
            return ρσ_equals(exist(object), false);
        };
        if (!empty.__argnames__) Object.defineProperties(empty, {
            __argnames__ : {value: ["object"]}
        });

        function create_worker(code) {
            var URL, blob, BlobBuilder;
            if (typeof window === 'undefined') {
                return;
            }
            URL = window.URL || window.webkitURL;
            blob = false;
            try {
                blob = new Blob(ρσ_list_decorate([ code ]), (function(){
                    var ρσ_d = {};
                    ρσ_d["type"] = "application/javascript";
                    return ρσ_d;
                }).call(this));
            } catch (ρσ_Exception) {
                ρσ_last_exception = ρσ_Exception;
                {
                    BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                    blob = BlobBuilder();
                    blob.append(code);
                    blob = blob.getBlob();
                } 
            }
            return new Worker(URL.createObjectURL(blob));
        };
        if (!create_worker.__argnames__) Object.defineProperties(create_worker, {
            __argnames__ : {value: ["code"]}
        });

        function exception(string) {
            console.log(string);
        };
        if (!exception.__argnames__) Object.defineProperties(exception, {
            __argnames__ : {value: ["string"]}
        });

        function warning(string, offline) {
            if (offline) {
                console.log("You are offline");
            }
            console.log(string);
        };
        if (!warning.__argnames__) Object.defineProperties(warning, {
            __argnames__ : {value: ["string", "offline"]}
        });

        array = ρσ_list_decorate([ ρσ_list_constructor, Array ]);
        month = ρσ_list_decorate([ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]);
        configuration = {};
        configuration.client = false;
        configuration.url = false;
        
if (typeof window !== 'undefined' && typeof window.HTMLBodyElement !== 'undefined') {configuration.client = true}
else {configuration.client = false}
;
        function parseURI(data) {
            var array, key;
            array = ρσ_list_decorate([]);
            var ρσ_Iter2 = ρσ_Iterable(data);
            for (var ρσ_Index2 = 0; ρσ_Index2 < ρσ_Iter2.length; ρσ_Index2++) {
                key = ρσ_Iter2[ρσ_Index2];
                if (!(ρσ_in(data[(typeof key === "number" && key < 0) ? data.length + key : key], ρσ_list_decorate([ true, false, null, undefined ])))) {
                    if (ρσ_in(type(data[(typeof key === "number" && key < 0) ? data.length + key : key]), array) || ρσ_equals(type(data), Object)) {
                        try {
                            data[(typeof key === "number" && key < 0) ? data.length + key : key] = JSON.stringify(data[(typeof key === "number" && key < 0) ? data.length + key : key]);
                        } catch (ρσ_Exception) {
                            ρσ_last_exception = ρσ_Exception;
                            {
                            } 
                        }
                    }
                } else if ((data[(typeof key === "number" && key < 0) ? data.length + key : key] === "" || typeof data[(typeof key === "number" && key < 0) ? data.length + key : key] === "object" && ρσ_equals(data[(typeof key === "number" && key < 0) ? data.length + key : key], ""))) {
                    data[(typeof key === "number" && key < 0) ? data.length + key : key] = null;
                }
                array.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[(typeof key === "number" && key < 0) ? data.length + key : key]));
            }
            return array.join("&");
        };
        if (!parseURI.__argnames__) Object.defineProperties(parseURI, {
            __argnames__ : {value: ["data"]}
        });

        /**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 */

if (typeof window === 'undefined') {
var Url = require("url");
var spawn = require("child_process").spawn;
var fs = require("fs");

var XMLHttpRequest = function() {
  "use strict";

  /**
   * Private variables
   */
  var self = this;
  var http = require("http");
  var https = require("https");

  // Holds http.js objects
  var request;
  var response;

  // Request settings
  var settings = {};

  // Disable header blacklist.
  // Not part of XHR specs.
  var disableHeaderCheck = false;

  // Set some default headers
  var defaultHeaders = {
    "User-Agent": "node-XMLHttpRequest",
    "Accept": "*/*",
  };

  var headers = {};
  var headersCase = {};

  // These headers are not user setable.
  // The following are allowed but banned in the spec:
  // * user-agent
  var forbiddenRequestHeaders = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "content-transfer-encoding",
    "cookie",
    "cookie2",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "via"
  ];

  // These request methods are not allowed
  var forbiddenRequestMethods = [
    "TRACE",
    "TRACK",
    "CONNECT"
  ];

  // Send flag
  var sendFlag = false;
  // Error flag, used when errors occur or abort is called
  var errorFlag = false;

  // Event listeners
  var listeners = {};

  /**
   * Constants
   */

  this.UNSENT = 0;
  this.OPENED = 1;
  this.HEADERS_RECEIVED = 2;
  this.LOADING = 3;
  this.DONE = 4;

  /**
   * Public vars
   */

  // Current state
  this.readyState = this.UNSENT;

  // default ready state change handler in case one is not set or is set late
  this.onreadystatechange = null;

  // Result & response
  this.responseText = "";
  this.responseXML = "";
  this.status = null;
  this.statusText = null;
  
  // Whether cross-site Access-Control requests should be made using
  // credentials such as cookies or authorization headers
  this.withCredentials = false;

  /**
   * Private methods
   */

  /**
   * Check if the specified header is allowed.
   *
   * @param string header Header to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpHeader = function(header) {
    return disableHeaderCheck || (header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1);
  };

  /**
   * Check if the specified method is allowed.
   *
   * @param string method Request method to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpMethod = function(method) {
    return (method && forbiddenRequestMethods.indexOf(method) === -1);
  };

  /**
   * Public methods
   */

  /**
   * Open the connection. Currently supports local server requests.
   *
   * @param string method Connection method (eg GET, POST)
   * @param string url URL for the connection.
   * @param boolean async Asynchronous connection. Default is true.
   * @param string user Username for basic authentication (optional)
   * @param string password Password for basic authentication (optional)
   */
  this.open = function(method, url, async, user, password) {
    this.abort();
    errorFlag = false;

    // Check for valid request method
    if (!isAllowedHttpMethod(method)) {
      throw new Error("SecurityError: Request method not allowed");
    }

    settings = {
      "method": method,
      "url": url.toString(),
      "async": (typeof async !== "boolean" ? true : async),
      "user": user || null,
      "password": password || null
    };

    setState(this.OPENED);
  };

  /**
   * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
   * This does not conform to the W3C spec.
   *
   * @param boolean state Enable or disable header checking.
   */
  this.setDisableHeaderCheck = function(state) {
    disableHeaderCheck = state;
  };

  /**
   * Sets a header for the request or appends the value if one is already set.
   *
   * @param string header Header name
   * @param string value Header value
   */
  this.setRequestHeader = function(header, value) {
    if (this.readyState !== this.OPENED) {
      throw new Error("INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN");
    }
    if (!isAllowedHttpHeader(header)) {
      console.warn('Refused to set unsafe header "' + header + '"');
      return;
    }
    if (sendFlag) {
      throw new Error("INVALID_STATE_ERR: send flag is true");
    }
    header = headersCase[header.toLowerCase()] || header;
    headersCase[header.toLowerCase()] = header;
    headers[header] = headers[header] ? headers[header] + ', ' + value : value;
  };

  /**
   * Gets a header from the server response.
   *
   * @param string header Name of header to get.
   * @return string Text of the header or null if it doesn't exist.
   */
  this.getResponseHeader = function(header) {
    if (typeof header === "string"
      && this.readyState > this.OPENED
      && response
      && response.headers
      && response.headers[header.toLowerCase()]
      && !errorFlag
    ) {
      return response.headers[header.toLowerCase()];
    }

    return null;
  };

  /**
   * Gets all the response headers.
   *
   * @return string A string with all response headers separated by CR+LF
   */
  this.getAllResponseHeaders = function() {
    if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
      return "";
    }
    var result = "";

    for (var i in response.headers) {
      // Cookie headers are excluded
      if (i !== "set-cookie" && i !== "set-cookie2") {
        result += i + ": " + response.headers[i] + "\r\n";
      }
    }
    return result.substr(0, result.length - 2);
  };

  /**
   * Gets a request header
   *
   * @param string name Name of header to get
   * @return string Returns the request header or empty string if not set
   */
  this.getRequestHeader = function(name) {
    if (typeof name === "string" && headersCase[name.toLowerCase()]) {
      return headers[headersCase[name.toLowerCase()]];
    }

    return "";
  };

  /**
   * Sends the request to the server.
   *
   * @param string data Optional data to send as request body.
   */
  this.send = function(data) {
    if (this.readyState !== this.OPENED) {
      throw new Error("INVALID_STATE_ERR: connection must be opened before send() is called");
    }

    if (sendFlag) {
      throw new Error("INVALID_STATE_ERR: send has already been called");
    }

    var ssl = false, local = false;
    var url = Url.parse(settings.url);
    var host;
    // Determine the server
    switch (url.protocol) {
      case "https:":
        ssl = true;
        // SSL & non-SSL both need host, no break here.
      case "http:":
        host = url.hostname;
        break;

      case "file:":
        local = true;
        break;

      case undefined:
      case null:
      case "":
        host = "localhost";
        break;

      default:
        throw new Error("Protocol not supported.");
    }

    // Load files off the local filesystem (file://)
    if (local) {
      if (settings.method !== "GET") {
        throw new Error("XMLHttpRequest: Only GET method is supported");
      }

      if (settings.async) {
        fs.readFile(url.pathname, "utf8", function(error, data) {
          if (error) {
            self.handleError(error);
          } else {
            self.status = 200;
            self.responseText = data;
            setState(self.DONE);
          }
        });
      } else {
        try {
          this.responseText = fs.readFileSync(url.pathname, "utf8");
          this.status = 200;
          setState(self.DONE);
        } catch(e) {
          this.handleError(e);
        }
      }

      return;
    }

    // Default to port 80. If accessing localhost on another port be sure
    // to use http://localhost:port/path
    var port = url.port || (ssl ? 443 : 80);
    // Add query string if one is used
    var uri = url.pathname + (url.search ? url.search : "");

    // Set the defaults if they haven't been set
    for (var name in defaultHeaders) {
      if (!headersCase[name.toLowerCase()]) {
        headers[name] = defaultHeaders[name];
      }
    }

    // Set the Host header or the server may reject the request
    headers.Host = host;
    if (!((ssl && port === 443) || port === 80)) {
      headers.Host += ":" + url.port;
    }

    // Set Basic Auth if necessary
    if (settings.user) {
      if (typeof settings.password === "undefined") {
        settings.password = "";
      }
      var authBuf = new Buffer(settings.user + ":" + settings.password);
      headers.Authorization = "Basic " + authBuf.toString("base64");
    }

    // Set content length header
    if (settings.method === "GET" || settings.method === "HEAD") {
      data = null;
    } else if (data) {
      headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);

      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
    } else if (settings.method === "POST") {
      // For a post with no data set Content-Length: 0.
      // This is required by buggy servers that don't meet the specs.
      headers["Content-Length"] = 0;
    }

    var options = {
      host: host,
      port: port,
      path: uri,
      method: settings.method,
      headers: headers,
      agent: false,
      withCredentials: self.withCredentials
    };

    // Reset error flag
    errorFlag = false;

    // Handle async requests
    if (settings.async) {
      // Use the proper protocol
      var doRequest = ssl ? https.request : http.request;

      // Request is being sent, set send flag
      sendFlag = true;

      // As per spec, this is called here for historical reasons.
      self.dispatchEvent("readystatechange");

      // Handler for the response
      var responseHandler = function responseHandler(resp) {
        // Set response var to the response we got back
        // This is so it remains accessable outside this scope
        response = resp;
        // Check for redirect
        // @TODO Prevent looped redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
          // Change URL to the redirect location
          settings.url = response.headers.location;
          var url = Url.parse(settings.url);
          // Set host var in case it's used later
          host = url.hostname;
          // Options for the new request
          var newOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: response.statusCode === 303 ? "GET" : settings.method,
            headers: headers,
            withCredentials: self.withCredentials
          };

          // Issue the new request
          request = doRequest(newOptions, responseHandler).on("error", errorHandler);
          request.end();
          // @TODO Check if an XHR event needs to be fired here
          return;
        }

        response.setEncoding("utf8");

        setState(self.HEADERS_RECEIVED);
        self.status = response.statusCode;

        response.on("data", function(chunk) {
          // Make sure there's some data
          if (chunk) {
            self.responseText += chunk;
          }
          // Don't emit state changes if the connection has been aborted.
          if (sendFlag) {
            setState(self.LOADING);
          }
        });

        response.on("end", function() {
          if (sendFlag) {
            // Discard the end event if the connection has been aborted
            setState(self.DONE);
            sendFlag = false;
          }
        });

        response.on("error", function(error) {
          self.handleError(error);
        });
      };

      // Error handler for the request
      var errorHandler = function errorHandler(error) {
        self.handleError(error);
      };

      // Create the request
      request = doRequest(options, responseHandler).on("error", errorHandler);

      // Node 0.4 and later won't accept empty data. Make sure it's needed.
      if (data) {
        request.write(data);
      }

      request.end();

      self.dispatchEvent("loadstart");
    } else { // Synchronous
      // Create a temporary file for communication with the other Node process
      var contentFile = ".node-xmlhttprequest-content-" + process.pid;
      var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
      fs.writeFileSync(syncFile, "", "utf8");
      // The async request the other Node process executes
      var execString = "var http = require('http'), https = require('https'), fs = require('fs');"
        + "var doRequest = http" + (ssl ? "s" : "") + ".request;"
        + "var options = " + JSON.stringify(options) + ";"
        + "var responseText = '';"
        + "var req = doRequest(options, function(response) {"
        + "response.setEncoding('utf8');"
        + "response.on('data', function(chunk) {"
        + "  responseText += chunk;"
        + "});"
        + "response.on('end', function() {"
        + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText}}), 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + "response.on('error', function(error) {"
        + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + "}).on('error', function(error) {"
        + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');"
        + "fs.unlinkSync('" + syncFile + "');"
        + "});"
        + (data ? "req.write('" + JSON.stringify(data).slice(1,-1).replace(/'/g, "\'") + "');":"")
        + "req.end();";
      // Start the other Node Process, executing this string
      var syncProc = spawn(process.argv[0], ["-e", execString]);
      while(fs.existsSync(syncFile)) {
        // Wait while the sync file is empty
      }
      var resp = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
      // Kill the child process once the file has data
      syncProc.stdin.end();
      // Remove the temporary file
      fs.unlinkSync(contentFile);

      if (resp.err) {
        self.handleError(resp.err);
      } else {
        response = resp.data;
        self.status = resp.data.statusCode;
        self.responseText = resp.data.text;
        setState(self.DONE);
      }
    }
  };

  /**
   * Called when an error is encountered to deal with it.
   */
  this.handleError = function(error) {
    this.status = 0;
    this.statusText = error;
    this.responseText = error.stack;
    errorFlag = true;
    setState(this.DONE);
    this.dispatchEvent('error');
  };

  /**
   * Aborts a request.
   */
  this.abort = function() {
    if (request) {
      request.abort();
      request = null;
    }

    headers = defaultHeaders;
    this.status = 0;
    this.responseText = "";
    this.responseXML = "";

    errorFlag = true;

    if (this.readyState !== this.UNSENT
        && (this.readyState !== this.OPENED || sendFlag)
        && this.readyState !== this.DONE) {
      sendFlag = false;
      setState(this.DONE);
    }
    this.readyState = this.UNSENT;
    this.dispatchEvent('abort');
  };

  /**
   * Adds an event listener. Preferred method of binding to events.
   */
  this.addEventListener = function(event, callback) {
    if (!(event in listeners)) {
      listeners[event] = [];
    }
    // Currently allows duplicate callbacks. Should it?
    listeners[event].push(callback);
  };

  /**
   * Remove an event callback that has already been bound.
   * Only works on the matching funciton, cannot be a copy.
   */
  this.removeEventListener = function(event, callback) {
    if (event in listeners) {
      // Filter will return a new array with the callback removed
      listeners[event] = listeners[event].filter(function(ev) {
        return ev !== callback;
      });
    }
  };

  /**
   * Dispatch any events, including both "on" methods and events attached using addEventListener.
   */
  this.dispatchEvent = function(event) {
    if (typeof self["on" + event] === "function") {
      self["on" + event]();
    }
    if (event in listeners) {
      for (var i = 0, len = listeners[event].length; i < len; i++) {
        listeners[event][i].call(self);
      }
    }
  };

  /**
   * Changes readyState and calls onreadystatechange.
   *
   * @param int state New state
   */
  var setState = function(state) {
    if (state == self.LOADING || self.readyState !== state) {
      self.readyState = state;

      if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
        self.dispatchEvent("readystatechange");
      }

      if (self.readyState === self.DONE && !errorFlag) {
        self.dispatchEvent("load");
        // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
        self.dispatchEvent("loadend");
      }
    }
  };
};
}else{
var XMLHttpRequest = window.XMLHttpRequest;
};
        function ajax_load() {
            return;
        };

        function ajax_resolve(resolve, xhr, opts) {
            resolve(xhr.response);
        };
        if (!ajax_resolve.__argnames__) Object.defineProperties(ajax_resolve, {
            __argnames__ : {value: ["resolve", "xhr", "opts"]}
        });

        function ajax_reject(reject, xhr, opts) {
            reject(xhr.statusText);
        };
        if (!ajax_reject.__argnames__) Object.defineProperties(ajax_reject, {
            __argnames__ : {value: ["reject", "xhr", "opts"]}
        });

        function ajax(type, dataType, url, data, opts) {
            if (!exist(opts)) {
                opts = {};
            }
            ajax_load(opts);
            if (exist(data)) {
                data = parseURI(data);
            }
            return new Promise((function() {
                var ρσ_anonfunc = function (resolve, reject) {
                    var xhr;
                    xhr = new XMLHttpRequest;
                    xhr.open(type, url, true);
                    xhr.onload = function () {
                        ajax_resolve(resolve, this, opts);
                    };
                    xhr.onerror = function () {
                        ajax_reject(reject, this, opts);
                    };
                    xhr.responseType = dataType;
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    try {
                        xhr.send(data);
                    } catch (ρσ_Exception) {
                        ρσ_last_exception = ρσ_Exception;
                        if (ρσ_Exception instanceof Error) {
                            var error = ρσ_Exception;
                            reject(error);
                        } else {
                            throw ρσ_Exception;
                        }
                    }
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["resolve", "reject"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!ajax.__argnames__) Object.defineProperties(ajax, {
            __argnames__ : {value: ["type", "dataType", "url", "data", "opts"]}
        });

        if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
};
        if (!Array.prototype.filter)
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
        throw new TypeError();
    
    var len = this.length >>> 0,
        res = new Array(len), // preallocate array
        t = this, c = 0, i = -1;
    if (thisArg === undefined)
      while (++i !== len)
        // checks to see if the key was set
        if (i in this)
          if (func(t[i], i, t))
            res[c++] = t[i];
    else
      while (++i !== len)
        // checks to see if the key was set
        if (i in this)
          if (func.call(thisArg, t[i], i, t))
            res[c++] = t[i];
    
    res.length = c; // shrink down array to proper size
    return res;
  };;
        if (!Array.prototype.every) {
  Array.prototype.every = function(callbackfn, thisArg) {
    'use strict';
    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the this 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method
    //    of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
    if (typeof callbackfn !== 'function') {
      throw new TypeError();
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method
        //    of O with argument Pk.
        kValue = O[k];

        // ii. Let testResult be the result of calling the Call internal method
        //     of callbackfn with T as the this value and argument list 
        //     containing kValue, k, and O.
        var testResult = callbackfn.call(T, kValue, k, O);

        // iii. If ToBoolean(testResult) is false, return false.
        if (!testResult) {
          return false;
        }
      }
      k++;
    }
    return true;
  };
};
        // Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
  Array.prototype.some = function(fun/*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
};
        if (!Object.entries)
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
  };
;
        ρσ_modules["orm.tools"].array = array;
        ρσ_modules["orm.tools"].month = month;
        ρσ_modules["orm.tools"].configuration = configuration;
        ρσ_modules["orm.tools"].keys = keys;
        ρσ_modules["orm.tools"].merge = merge;
        ρσ_modules["orm.tools"].copy = copy;
        ρσ_modules["orm.tools"].dict = dict;
        ρσ_modules["orm.tools"].checkBase64 = checkBase64;
        ρσ_modules["orm.tools"].exist = exist;
        ρσ_modules["orm.tools"].empty = empty;
        ρσ_modules["orm.tools"].create_worker = create_worker;
        ρσ_modules["orm.tools"].exception = exception;
        ρσ_modules["orm.tools"].warning = warning;
        ρσ_modules["orm.tools"].parseURI = parseURI;
        ρσ_modules["orm.tools"].ajax_load = ajax_load;
        ρσ_modules["orm.tools"].ajax_resolve = ajax_resolve;
        ρσ_modules["orm.tools"].ajax_reject = ajax_reject;
        ρσ_modules["orm.tools"].ajax = ajax;
    })();

    (function(){
        var __name__ = "orm.fields";
        var Text;
        var merge = ρσ_modules["orm.tools"].merge;

        function Char() {
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "char";
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Char.__handles_kwarg_interpolation__) Object.defineProperties(Char, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string"]}
        });

        Text = Char;
        function Integer() {
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "integer";
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Integer.__handles_kwarg_interpolation__) Object.defineProperties(Integer, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string"]}
        });

        function Float() {
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "float";
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Float.__handles_kwarg_interpolation__) Object.defineProperties(Float, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string"]}
        });

        function Boolean() {
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "boolean";
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Boolean.__handles_kwarg_interpolation__) Object.defineProperties(Boolean, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string"]}
        });

        function Binary() {
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "binary";
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Binary.__handles_kwarg_interpolation__) Object.defineProperties(Binary, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string"]}
        });

        function Many2one() {
            var relation = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "many2one";
                ρσ_d["relation"] = relation;
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Many2one.__handles_kwarg_interpolation__) Object.defineProperties(Many2one, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["relation", "string"]}
        });

        function One2many() {
            var relation = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var inverse = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var string = ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[2];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "one2many";
                ρσ_d["relation"] = relation;
                ρσ_d["inverse"] = inverse;
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!One2many.__handles_kwarg_interpolation__) Object.defineProperties(One2many, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["relation", "inverse", "string"]}
        });

        function Many2many() {
            var relation = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "many2many";
                ρσ_d["relation"] = relation;
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Many2many.__handles_kwarg_interpolation__) Object.defineProperties(Many2many, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["relation", "string"]}
        });

        function One2one() {
            var relation = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "one2one";
                ρσ_d["relation"] = relation;
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!One2one.__handles_kwarg_interpolation__) Object.defineProperties(One2one, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["relation", "string"]}
        });

        function Selection() {
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var selection = Array.prototype.slice.call(arguments, 0);
            if (args !== null && typeof args === "object" && args [ρσ_kwargs_symbol] === true) selection.pop();
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "selection";
                ρσ_d["selection"] = selection;
                ρσ_d["string"] = args.string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Selection.__handles_kwarg_interpolation__) Object.defineProperties(Selection, {
            __handles_kwarg_interpolation__ : {value: true}
        });

        function Date() {
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "date";
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Date.__handles_kwarg_interpolation__) Object.defineProperties(Date, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string"]}
        });

        function Datetime() {
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "datetime";
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Datetime.__handles_kwarg_interpolation__) Object.defineProperties(Datetime, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string"]}
        });

        function Data() {
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var args = arguments[arguments.length-1];
            if (args === null || typeof args !== "object" || args [ρσ_kwargs_symbol] !== true) args = {};
            var attributes;
            attributes = ρσ_list_decorate([ "required", "readonly", "default", "compute", "store", "related" ]);
            return merge((function(){
                var ρσ_d = {};
                ρσ_d["type"] = "data";
                ρσ_d["string"] = string;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_Iter = ρσ_Iterable(attributes), ρσ_Result = {}, attribute;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    attribute = ρσ_Iter[ρσ_Index];
                    ρσ_Result[attribute] = (args[(typeof attribute === "number" && attribute < 0) ? args.length + attribute : attribute] || null);
                }
                return ρσ_Result;
            })());
        };
        if (!Data.__handles_kwarg_interpolation__) Object.defineProperties(Data, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string"]}
        });

        ρσ_modules["orm.fields"].Text = Text;
        ρσ_modules["orm.fields"].Char = Char;
        ρσ_modules["orm.fields"].Integer = Integer;
        ρσ_modules["orm.fields"].Float = Float;
        ρσ_modules["orm.fields"].Boolean = Boolean;
        ρσ_modules["orm.fields"].Binary = Binary;
        ρσ_modules["orm.fields"].Many2one = Many2one;
        ρσ_modules["orm.fields"].One2many = One2many;
        ρσ_modules["orm.fields"].Many2many = Many2many;
        ρσ_modules["orm.fields"].One2one = One2one;
        ρσ_modules["orm.fields"].Selection = Selection;
        ρσ_modules["orm.fields"].Date = Date;
        ρσ_modules["orm.fields"].Datetime = Datetime;
        ρσ_modules["orm.fields"].Data = Data;
    })();

    (function(){
        var __name__ = "orm.pouchdb";
        var PouchDB, db;
        if (typeof window === 'undefined') {
            PouchDB = require("pouchdb-core");
            PouchDB.plugin(require("pouchdb-find"));
            PouchDB.plugin(require("pouchdb-adapter-http"));
            PouchDB.plugin(require("pouchdb-adapter-memory"));
            PouchDB.plugin(require("relational-pouch"));
            if (!(ρσ_in(require("process").env.server_db_custom_adapter, ρσ_list_decorate([ "False", undefined ])))) {
                PouchDB.plugin(require(require("process").env.server_db_custom_adapter));
            }
            db = PouchDB(require("process").env.server_db || "cache", (function(){
                var ρσ_d = {};
                ρσ_d["adapter"] = require("process").env.server_db_adapter || "memory";
                return ρσ_d;
            }).call(this));
        } else {
            PouchDB = window.PouchDB;
            db = PouchDB("main");
        }
        ρσ_modules["orm.pouchdb"].PouchDB = PouchDB;
        ρσ_modules["orm.pouchdb"].db = db;
    })();

    (function(){
        var __name__ = "orm.models";
        var env, schemas, raw_models;
        var fields = ρσ_modules["orm.fields"];

        var exist = ρσ_modules["orm.tools"].exist;
        var keys = ρσ_modules["orm.tools"].keys;
        var merge = ρσ_modules["orm.tools"].merge;
        var copy = ρσ_modules["orm.tools"].copy;
        var dict = ρσ_modules["orm.tools"].dict;
        var checkBase64 = ρσ_modules["orm.tools"].checkBase64;
        var configuration = ρσ_modules["orm.tools"].configuration;
        var ajax = ρσ_modules["orm.tools"].ajax;
        var array = ρσ_modules["orm.tools"].array;
        var exception = ρσ_modules["orm.tools"].exception;
        var warning = ρσ_modules["orm.tools"].warning;

        var db = ρσ_modules["orm.pouchdb"].db;

        env = {};
        schemas = {};
        raw_models = {};
        function setSchema() {
            db.setSchema((function() {
                var ρσ_Iter = ρσ_Iterable(schemas), ρσ_Result = [], key;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    key = ρσ_Iter[ρσ_Index];
                    ρσ_Result.push(schemas[(typeof key === "number" && key < 0) ? schemas.length + key : key]);
                }
                ρσ_Result = ρσ_list_constructor(ρσ_Result);
                return ρσ_Result;
            })());
        };

        function queryInverse(field_type, records, fields, _fields) {
            var result, field, record;
            var ρσ_Iter0 = ρσ_Iterable(records[(typeof field_type === "number" && field_type < 0) ? records.length + field_type : field_type]);
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                record = ρσ_Iter0[ρσ_Index0];
                var ρσ_Iter1 = ρσ_Iterable(fields);
                for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                    field = ρσ_Iter1[ρσ_Index1];
                    record[(typeof field === "number" && field < 0) ? record.length + field : field] = ρσ_list_decorate([]);
                    var ρσ_Iter2 = ρσ_Iterable(records[ρσ_bound_index(_fields[(typeof field === "number" && field < 0) ? _fields.length + field : field].relation, records)]);
                    for (var ρσ_Index2 = 0; ρσ_Index2 < ρσ_Iter2.length; ρσ_Index2++) {
                        result = ρσ_Iter2[ρσ_Index2];
                        if ((result[ρσ_bound_index(_fields[(typeof field === "number" && field < 0) ? _fields.length + field : field].inverse, result)] === record.id || typeof result[ρσ_bound_index(_fields[(typeof field === "number" && field < 0) ? _fields.length + field : field].inverse, result)] === "object" && ρσ_equals(result[ρσ_bound_index(_fields[(typeof field === "number" && field < 0) ? _fields.length + field : field].inverse, result)], record.id))) {
                            record[(typeof field === "number" && field < 0) ? record.length + field : field].push(result.id);
                        }
                    }
                }
            }
            return records;
        };
        if (!queryInverse.__argnames__) Object.defineProperties(queryInverse, {
            __argnames__ : {value: ["field_type", "records", "fields", "_fields"]}
        });

        function Model() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            Model.prototype.__init__.apply(this, arguments);
        }
        Model.prototype.__init__ = function __init__(_is_env, _is_singleton) {
            var self = this;
            var newmodel, oldconstructor, models, key, raw_model, schema, reserved, valid_fields, relation;
            self._fields = {};
            self._values = {};
            self._related = {};
            self._one2many_fields = ρσ_list_decorate([]);
            self._is_env = ((_is_env !== undefined && (typeof _is_env !== "object" || ρσ_not_equals(_is_env, undefined)))) ? _is_env : false;
            self._is_singleton = ((_is_singleton !== undefined && (typeof _is_singleton !== "object" || ρσ_not_equals(_is_singleton, undefined)))) ? _is_singleton : false;
            self._inherited_keys = ρσ_list_decorate([]);
            self._context = {};
            self._search_count = 0;
            if (exist(self._inherit) && exist(raw_models[ρσ_bound_index(self._inherit, raw_models)]) && (env[ρσ_bound_index(self._inherit, env)] !== true && (typeof env[ρσ_bound_index(self._inherit, env)] !== "object" || ρσ_not_equals(env[ρσ_bound_index(self._inherit, env)], true)))) {
                if (!exist(self._name)) {
                    self._name = self._inherit;
                }
                newmodel = self;
                oldconstructor = self.constructor;
                models = raw_models[ρσ_bound_index(newmodel._inherit, raw_models)];
                if (!(ρσ_in(oldconstructor, models))) {
                    models.push(oldconstructor);
                }
                var ρσ_Iter3 = ρσ_Iterable(models);
                for (var ρσ_Index3 = 0; ρσ_Index3 < ρσ_Iter3.length; ρσ_Index3++) {
                    raw_model = ρσ_Iter3[ρσ_Index3];
                    var ρσ_Iter4 = ρσ_Iterable(Object.getOwnPropertyNames(raw_model.prototype));
                    for (var ρσ_Index4 = 0; ρσ_Index4 < ρσ_Iter4.length; ρσ_Index4++) {
                        key = ρσ_Iter4[ρσ_Index4];
                        if (ρσ_not_equals(key.slice(0, 2), "__") && !(ρσ_in(key, ρσ_list_decorate([ "_inherit", "inherited_constructor", "values" ])))) {
                            self[(typeof key === "number" && key < 0) ? self.length + key : key] = (ρσ_expr_temp = raw_model.prototype)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key];
                            self._inherited_keys.push(key);
                        }
                    }
                }
                self._name = newmodel._name;
                self._is_env = false;
                if (exist(env[ρσ_bound_index(self._name, env)]) && (env[ρσ_bound_index(self._name, env)].constructor !== self.constructor && (typeof env[ρσ_bound_index(self._name, env)].constructor !== "object" || ρσ_not_equals(env[ρσ_bound_index(self._name, env)].constructor, self.constructor)))) {
                    ρσ_delitem(env, self._name);
                }
            }
            if (!(ρσ_in("Model", env))) {
                env["Model"] = Model;
            }
            if (!(ρσ_in("context", env))) {
                env["context"] = {};
            }
            if (!(ρσ_in(self._name, env))) {
                env[ρσ_bound_index(self._name, env)] = true;
                Object.defineProperty(env, self._name, {get: function() {return new self.constructor(true)}});
            }
            self.env = env;
            schema = (function(){
                var ρσ_d = {};
                ρσ_d["singular"] = self._name;
                ρσ_d["plural"] = self._name;
                return ρσ_d;
            }).call(this);
            schemas[ρσ_bound_index(self._name, schemas)] = schema;
            reserved = ρσ_list_decorate([ "id", "_id", "rev", "_rev", "ids" ]);
            if ((self.name === undefined || typeof self.name === "object" && ρσ_equals(self.name, undefined)) && (self._rec_name !== "name" && (typeof self._rec_name !== "object" || ρσ_not_equals(self._rec_name, "name")))) {
                self.constructor.prototype.name = copy(self[ρσ_bound_index(self._rec_name, self)]);
                self.constructor.prototype.name.related = self._rec_name;
                self.constructor.prototype.name.store = true;
            }
            if (self._is_singleton) {
                self.id = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "ID", related: "_id", store: true})]);
                self._id = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "ID (Raw)"})]);
            }
            self._fields.ids = ρσ_interpolate_kwargs.call(fields, fields.Data, [ρσ_desugar_kwargs({string: "IDs"})]);
            self.rev = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "DB Revision Number", related: "_rev", store: true})]);
            self._rev = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "DB Revision Number"})]);
            valid_fields = (function() {
                var ρσ_Iter = ρσ_Iterable(Object.getOwnPropertyNames(self.constructor.prototype)), ρσ_Result = [], key;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    key = ρσ_Iter[ρσ_Index];
                    if ((key[0] !== "_" && (typeof key[0] !== "object" || ρσ_not_equals(key[0], "_"))) && !(ρσ_in(key, ρσ_list_decorate([ "constructor", "env", "values" ])))) {
                        ρσ_Result.push(key);
                    }
                }
                ρσ_Result = ρσ_list_constructor(ρσ_Result);
                return ρσ_Result;
            })().concat(reserved).concat(self._inherited_keys);
            var ρσ_Iter5 = ρσ_Iterable(valid_fields);
            for (var ρσ_Index5 = 0; ρσ_Index5 < ρσ_Iter5.length; ρσ_Index5++) {
                key = ρσ_Iter5[ρσ_Index5];
                if (!exist(self[(typeof key === "number" && key < 0) ? self.length + key : key]) || ρσ_not_equals(type(self[(typeof key === "number" && key < 0) ? self.length + key : key]), Object) || ρσ_equals(type(self[(typeof key === "number" && key < 0) ? self.length + key : key]), Object) && !(ρσ_in("compute", self[(typeof key === "number" && key < 0) ? self.length + key : key]))) {
                    continue;
                }
                if (ρσ_in(self[(typeof key === "number" && key < 0) ? self.length + key : key].type, ρσ_list_decorate([ "many2one", "one2many", "many2many", "one2one" ]))) {
                    if (!schema.relations) {
                        schema.relations = {};
                    }
                    relation = "belongsTo";
                    if (ρσ_in(self[(typeof key === "number" && key < 0) ? self.length + key : key].type, ρσ_list_decorate([ "one2many", "many2many" ]))) {
                        relation = "hasMany";
                    }
                    if ((self[(typeof key === "number" && key < 0) ? self.length + key : key].type !== "one2many" && (typeof self[(typeof key === "number" && key < 0) ? self.length + key : key].type !== "object" || ρσ_not_equals(self[(typeof key === "number" && key < 0) ? self.length + key : key].type, "one2many")))) {
                        (ρσ_expr_temp = schema.relations)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = (function(){
                            var ρσ_d = {};
                            ρσ_d[relation] = (function(){
                                var ρσ_d = {};
                                ρσ_d["type"] = self[(typeof key === "number" && key < 0) ? self.length + key : key].relation;
                                ρσ_d["options"] = (function(){
                                    var ρσ_d = {};
                                    ρσ_d["async"] = false;
                                    return ρσ_d;
                                }).call(this);
                                return ρσ_d;
                            }).call(this);
                            return ρσ_d;
                        }).call(this);
                    } else {
                        (ρσ_expr_temp = schema.relations)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = (function(){
                            var ρσ_d = {};
                            ρσ_d[relation] = (function(){
                                var ρσ_d = {};
                                ρσ_d["type"] = self[(typeof key === "number" && key < 0) ? self.length + key : key].relation;
                                ρσ_d["options"] = (function(){
                                    var ρσ_d = {};
                                    ρσ_d["async"] = false;
                                    ρσ_d["queryInverse"] = self[(typeof key === "number" && key < 0) ? self.length + key : key].inverse;
                                    return ρσ_d;
                                }).call(this);
                                return ρσ_d;
                            }).call(this);
                            return ρσ_d;
                        }).call(this);
                        self._one2many_fields.push(key);
                    }
                    if ((type === "belongsTo" || typeof type === "object" && ρσ_equals(type, "belongsTo"))) {
                        db.createIndex((function(){
                            var ρσ_d = {};
                            ρσ_d["index"] = (function(){
                                var ρσ_d = {};
                                ρσ_d["fields"] = ρσ_list_decorate([ "data." + key, "_id" ]);
                                return ρσ_d;
                            }).call(this);
                            return ρσ_d;
                        }).call(this));
                    }
                }
                (ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = self[(typeof key === "number" && key < 0) ? self.length + key : key];
                if (self._is_singleton) {
                    if (exist((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].related)) {
                        if (!exist((ρσ_expr_temp = self._related)[ρσ_bound_index((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].related, ρσ_expr_temp)])) {
                            (ρσ_expr_temp = self._related)[ρσ_bound_index((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].related, ρσ_expr_temp)] = ρσ_list_decorate([]);
                        }
                        (ρσ_expr_temp = self._related)[ρσ_bound_index((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].related, ρσ_expr_temp)].push(key);
                    }
                    self[(typeof key === "number" && key < 0) ? self.length + key : key] = (ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].default;
                    (ρσ_expr_temp = self._values)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = self[(typeof key === "number" && key < 0) ? self.length + key : key];
                    "Object.defineProperty(self, key, {\n               'get': def(): return self._values[key]\n               ,\n               'set': def(value): self._values[key] = self.adapt(key, value)\n               }})";
                }
            }
            try {
                setSchema();
            } catch (ρσ_Exception) {
                ρσ_last_exception = ρσ_Exception;
                {
                } 
            }
            if (exist(self._name)) {
                if (!exist(raw_models[ρσ_bound_index(self._name, raw_models)])) {
                    raw_models[ρσ_bound_index(self._name, raw_models)] = ρσ_list_decorate([]);
                }
                if (!(ρσ_in(self.constructor, raw_models[ρσ_bound_index(self._name, raw_models)]))) {
                    raw_models[ρσ_bound_index(self._name, raw_models)].push(self.constructor);
                }
            }
            if (ρσ_in("values", Object.getOwnPropertyNames(self))) {
                return;
            }
            Object.defineProperty(self, "ids", (function(){
                var ρσ_d = {};
                ρσ_d["get"] = function () {
                    if (self._is_singleton) {
                        return (self.id) ? ρσ_list_decorate([ self.id ]) : ρσ_list_decorate([]);
                    } else {
                        return (function() {
                            var ρσ_Iter = ρσ_Iterable(self.values), ρσ_Result = [], object;
                            for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                                object = ρσ_Iter[ρσ_Index];
                                if (object.id) {
                                    ρσ_Result.push(object.id.toString());
                                }
                            }
                            ρσ_Result = ρσ_list_constructor(ρσ_Result);
                            return ρσ_Result;
                        })();
                    }
                };
                ρσ_d["set"] = function () {
                    return;
                };
                return ρσ_d;
            }).call(this));
            Object.defineProperty(self, "values", (function(){
                var ρσ_d = {};
                ρσ_d["get"] = function () {
                    var value;
                    if (!(ρσ_in(type(self._values).name, (function() {
                        var ρσ_Iter = ρσ_Iterable(array), ρσ_Result = [], types;
                        for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                            types = ρσ_Iter[ρσ_Index];
                            ρσ_Result.push(types.name);
                        }
                        ρσ_Result = ρσ_list_constructor(ρσ_Result);
                        return ρσ_Result;
                    })()))) {
                        self._values._search_count = self._search_count;
                    } else {
                        var ρσ_Iter6 = ρσ_Iterable(self._values);
                        for (var ρσ_Index6 = 0; ρσ_Index6 < ρσ_Iter6.length; ρσ_Index6++) {
                            value = ρσ_Iter6[ρσ_Index6];
                            value._search_count = self._search_count;
                        }
                    }
                    return self._values;
                };
                ρσ_d["set"] = (function() {
                    var ρσ_anonfunc = function (newvalue) {
                        var oldvalue, key, value;
                        if (!exist(newvalue)) {
                            return;
                        }
                        if (!(ρσ_in(type(newvalue).name, (function() {
                            var ρσ_Iter = ρσ_Iterable(array), ρσ_Result = [], types;
                            for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                                types = ρσ_Iter[ρσ_Index];
                                ρσ_Result.push(types.name);
                            }
                            ρσ_Result = ρσ_list_constructor(ρσ_Result);
                            return ρσ_Result;
                        })()))) {
                            self._is_singleton = true;
                            if (ρσ_in(type(newvalue).name, (function() {
                                var ρσ_Iter = ρσ_Iterable(array), ρσ_Result = [], types;
                                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                                    types = ρσ_Iter[ρσ_Index];
                                    ρσ_Result.push(types.name);
                                }
                                ρσ_Result = ρσ_list_constructor(ρσ_Result);
                                return ρσ_Result;
                            })())) {
                                self._values = {};
                            }
                            oldvalue = copy(self._values);
                            newvalue.id = newvalue.id.toString();
                            self._values = newvalue;
                            var ρσ_Iter7 = ρσ_Iterable(oldvalue);
                            for (var ρσ_Index7 = 0; ρσ_Index7 < ρσ_Iter7.length; ρσ_Index7++) {
                                key = ρσ_Iter7[ρσ_Index7];
                                if (!(ρσ_in(key, newvalue))) {
                                    (ρσ_expr_temp = self._values)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = oldvalue[(typeof key === "number" && key < 0) ? oldvalue.length + key : key];
                                }
                            }
                            var ρσ_Iter8 = ρσ_Iterable(self._fields);
                            for (var ρσ_Index8 = 0; ρσ_Index8 < ρσ_Iter8.length; ρσ_Index8++) {
                                key = ρσ_Iter8[ρσ_Index8];
                                if (ρσ_in(key, newvalue)) {
                                    self[(typeof key === "number" && key < 0) ? self.length + key : key] = self.adapt(key, newvalue[(typeof key === "number" && key < 0) ? newvalue.length + key : key]);
                                }
                            }
                        } else {
                            self._is_singleton = false;
                            var ρσ_Iter9 = ρσ_Iterable(newvalue);
                            for (var ρσ_Index9 = 0; ρσ_Index9 < ρσ_Iter9.length; ρσ_Index9++) {
                                value = ρσ_Iter9[ρσ_Index9];
                                var ρσ_Iter10 = ρσ_Iterable(self._fields);
                                for (var ρσ_Index10 = 0; ρσ_Index10 < ρσ_Iter10.length; ρσ_Index10++) {
                                    key = ρσ_Iter10[ρσ_Index10];
                                    if (ρσ_in(key, value)) {
                                        value[(typeof key === "number" && key < 0) ? value.length + key : key] = self.adapt(key, value[(typeof key === "number" && key < 0) ? value.length + key : key]);
                                    }
                                }
                            }
                            self._values = newvalue;
                        }
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["newvalue"]}
                    });
                    return ρσ_anonfunc;
                })();
                return ρσ_d;
            }).call(this));
            Object.defineProperty(self, "length", (function(){
                var ρσ_d = {};
                ρσ_d["get"] = function () {
                    if (self._is_env) {
                        return 0;
                    } else if (self._is_singleton) {
                        if (!exist(self.id) || !exist(self.values)) {
                            return 0;
                        }
                        return 1;
                    } else {
                        return self._values.length;
                    }
                };
                return ρσ_d;
            }).call(this));
        };
        if (!Model.prototype.__init__.__argnames__) Object.defineProperties(Model.prototype.__init__, {
            __argnames__ : {value: ["_is_env", "_is_singleton"]}
        });
        Model.__argnames__ = Model.prototype.__init__.__argnames__;
        Model.__handles_kwarg_interpolation__ = Model.prototype.__init__.__handles_kwarg_interpolation__;
        Model.prototype.__iter__ = function __iter__() {
            var self = this;
            if (self._is_env || self.length < 1) {
                return iter(ρσ_list_decorate([]));
            } else if (self._is_singleton) {
                return iter(ρσ_list_decorate([ self ]));
            }
            function yield_record() {
                var _marked = /*#__PURE__*/ρσ_regenerator.regeneratorRuntime.mark(js_generator);
                
                function js_generator(self) {
                    var result, index, ρσ_Index0;
                    return ρσ_regenerator.regeneratorRuntime.wrap(function js_generator$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    ρσ_Index0 = 0;
                
                                case 1:
                                    if (!(ρσ_Index0 < self.values.length)) {
                                        _context.next = 11;
                                        break;
                                    }
                
                                    index = ρσ_Index0;
                                    result = self.browse();
                                    result.values = (ρσ_expr_temp = self.values)[typeof index === "number" && index < 0 ? ρσ_expr_temp.length + index : index];
                                    result._search_count = (ρσ_expr_temp = self.values)[typeof index === "number" && index < 0 ? ρσ_expr_temp.length + index : index]._search_count;
                                    _context.next = 8;
                                    return result;
                
                                case 8:
                                    ρσ_Index0++;
                                    _context.next = 1;
                                    break;
                
                                case 11:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _marked, this);
                }
                var result = js_generator.apply(this, arguments);
                result.send = result.next;
                return result;
            };
            if (!yield_record.__argnames__) Object.defineProperties(yield_record, {
                __argnames__ : {value: ["self"]}
            });

            return yield_record(self);
        };
        if (!Model.prototype.__iter__.__argnames__) Object.defineProperties(Model.prototype.__iter__, {
            __argnames__ : {value: []}
        });
        Model.prototype[ρσ_iterator_symbol] = Model.prototype.__iter__;
        Model.prototype.__view__ = function __view__(view, view_type) {
            var self = this;
            return view;
        };
        if (!Model.prototype.__view__.__argnames__) Object.defineProperties(Model.prototype.__view__, {
            __argnames__ : {value: ["view", "view_type"]}
        });
        Model.prototype.browse = function browse() {
            var self = this;
            var ids = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? browse.__defaults__.ids : arguments[0];
            var is_singleton = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? browse.__defaults__.is_singleton : arguments[1];
            var is_client = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? browse.__defaults__.is_client : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "ids")){
                ids = ρσ_kwargs_obj.ids;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "is_singleton")){
                is_singleton = ρσ_kwargs_obj.is_singleton;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "is_client")){
                is_client = ρσ_kwargs_obj.is_client;
            }
            var result;
            if (!exist(ids)) {
                if (ρσ_equals(ids, ρσ_list_decorate([]))) {
                    return new Promise((function() {
                        var ρσ_anonfunc = function (resolve, reject) {
                            resolve((ρσ_expr_temp = self.env)[ρσ_bound_index(self._name, ρσ_expr_temp)]);
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["resolve", "reject"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
                result = new self.constructor(false, is_singleton);
                result._context = self._context;
                return result;
            } else if (is_client) {
                return ajax("post", "json", configuration.url + "/api/browse", (function(){
                    var ρσ_d = {};
                    ρσ_d["login"] = self.env.user.login;
                    ρσ_d["password"] = self.env.user.password;
                    ρσ_d["encrypted"] = true;
                    ρσ_d["model"] = self._name;
                    ρσ_d["ids"] = ids;
                    return ρσ_d;
                }).call(this), self._context).then((function() {
                    var ρσ_anonfunc = function (result) {
                        var record;
                        console.log(result);
                        record = ρσ_interpolate_kwargs.call(self, self.browse, [ρσ_desugar_kwargs({is_singleton: !(ρσ_in(type(result.values), array))})]);
                        record.values = result.values;
                        if (result.values.map) {
                            record._search_count = result.values[0]._search_count;
                        } else {
                            record._search_count = result.values._search_count;
                        }
                        if (exist(record)) {
                            ρσ_interpolate_kwargs.call(self, self.browse, [ρσ_desugar_kwargs({ids: ids, is_client: false})]).then((function() {
                                var ρσ_anonfunc = function (records) {
                                    var values, value, record;
                                    if (exist(records)) {
                                        var ρσ_Iter11 = ρσ_Iterable(records);
                                        for (var ρσ_Index11 = 0; ρσ_Index11 < ρσ_Iter11.length; ρσ_Index11++) {
                                            record = ρσ_Iter11[ρσ_Index11];
                                            values = {};
                                            if (!records._is_singleton) {
                                                result.values = ρσ_list_decorate([ result.values ]);
                                            }
                                            var ρσ_Iter12 = ρσ_Iterable(result.values);
                                            for (var ρσ_Index12 = 0; ρσ_Index12 < ρσ_Iter12.length; ρσ_Index12++) {
                                                value = ρσ_Iter12[ρσ_Index12];
                                                if ((value.id === record.id || typeof value.id === "object" && ρσ_equals(value.id, record.id))) {
                                                    values = value;
                                                    break;
                                                }
                                            }
                                            ρσ_interpolate_kwargs.call(record, record.write, [values].concat([ρσ_desugar_kwargs({is_client: false})]));
                                        }
                                    } else {
                                        if (records._is_singleton) {
                                            result.values = ρσ_list_decorate([ result.values ]);
                                        }
                                        var ρσ_Iter13 = ρσ_Iterable(result.values);
                                        for (var ρσ_Index13 = 0; ρσ_Index13 < ρσ_Iter13.length; ρσ_Index13++) {
                                            value = ρσ_Iter13[ρσ_Index13];
                                            delete value.rev;
                                            delete value._rev;
                                            delete value._id;
                                            db.rel.save(records._name, value);
                                        }
                                    }
                                };
                                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                    __argnames__ : {value: ["records"]}
                                });
                                return ρσ_anonfunc;
                            })()).catch((function() {
                                var ρσ_anonfunc = function (error) {
                                    console.log(error);
                                    delete result.values.rev;
                                    delete result.values._rev;
                                    delete result.values._id;
                                    db.rel.save(record._name, result.values);
                                };
                                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                    __argnames__ : {value: ["error"]}
                                });
                                return ρσ_anonfunc;
                            })());
                        }
                        return record;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        warning(error, true);
                        return ρσ_interpolate_kwargs.call(self, self.browse, [ids].concat([ρσ_desugar_kwargs({is_client: false})]));
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            } else if (ρσ_in(type(ids).name, (function() {
                var ρσ_Iter = ρσ_Iterable(array), ρσ_Result = [], types;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    types = ρσ_Iter[ρσ_Index];
                    ρσ_Result.push(types.name);
                }
                ρσ_Result = ρσ_list_constructor(ρσ_Result);
                return ρσ_Result;
            })())) {
                if (ids.length > 1) {
                    var result = new self.constructor(false, false);
                    return db.rel.find(result._name, ids).then((function() {
                        var ρσ_anonfunc = function (record) {
                            record = queryInverse(result._name, record, result._one2many_fields, result._fields);
                            result.values = record[ρσ_bound_index(result._name, record)];
                            result._search_count = record[ρσ_bound_index(result._name, record)].length;
                            return result;
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["record"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    ids = ids[0];
                }
            }
            if (ρσ_equals(type(ids), String)) {
                result = self.browse();
                return db.rel.find(result._name, ids).then((function() {
                    var ρσ_anonfunc = function (record) {
                        record = queryInverse(result._name, record, result._one2many_fields, result._fields);
                        result.values = record[ρσ_bound_index(result._name, record)][0];
                        result._search_count = 1;
                        return result;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["record"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            return result;
        };
        if (!Model.prototype.browse.__defaults__) Object.defineProperties(Model.prototype.browse, {
            __defaults__ : {value: {ids:false, is_singleton:true, is_client:configuration.client}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["ids", "is_singleton", "is_client"]}
        });
        Model.prototype.search = function search() {
            var self = this;
            var args, options, result;
            args = Array.prototype.slice.call(arguments);
            options = copy(self._context);
            if ((options.is_client === undefined || typeof options.is_client === "object" && ρσ_equals(options.is_client, undefined))) {
                options.is_client = configuration.client;
            }
            if (exist(self.env.context.active_limit)) {
                options.limit = self.env.context.active_limit;
            }
            if (exist(self.env.context.active_index)) {
                options.index = self.env.context.active_index;
            }
            if (exist(self.env.context.active_sort)) {
                options.order = self.env.context.active_sort;
            }
            if (exist(options.is_client)) {
                delete options.is_client;
                options.fields = Object.keys(self._fields);
                return ajax("post", "json", configuration.url + "/api/search", (function(){
                    var ρσ_d = {};
                    ρσ_d["login"] = self.env.user.login;
                    ρσ_d["password"] = self.env.user.password;
                    ρσ_d["encrypted"] = true;
                    ρσ_d["model"] = self._name;
                    ρσ_d["args"] = args;
                    ρσ_d["options"] = options;
                    return ρσ_d;
                }).call(this), self._context).then((function() {
                    var ρσ_anonfunc = function (result) {
                        var record, id;
                        record = ρσ_interpolate_kwargs.call(self, self.browse, [ρσ_desugar_kwargs({is_singleton: !(ρσ_in(type(result.values), array))})]);
                        record.values = result.values;
                        if (result.values.map) {
                            record._search_count = result.values[0]._search_count;
                        } else {
                            record._search_count = result.values._search_count;
                        }
                        var ρσ_Iter14 = ρσ_Iterable(record.ids);
                        for (var ρσ_Index14 = 0; ρσ_Index14 < ρσ_Iter14.length; ρσ_Index14++) {
                            id = ρσ_Iter14[ρσ_Index14];
                            ρσ_interpolate_kwargs.call(self, self.with_context, [ρσ_desugar_kwargs({no_preload: true})]).browse(id);
                        }
                        return record;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        warning(error, true);
                        return ρσ_interpolate_kwargs.call(self, self.with_context, [ρσ_desugar_kwargs({is_client: false})]).search(args);
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            function query(record) {
                var results, arg;
                results = ρσ_list_decorate([]);
                var ρσ_Iter15 = ρσ_Iterable(args);
                for (var ρσ_Index15 = 0; ρσ_Index15 < ρσ_Iter15.length; ρσ_Index15++) {
                    arg = ρσ_Iter15[ρσ_Index15];
                    if (!arg || ρσ_in(str(arg), ρσ_list_decorate([ "|", "[]" ]))) {
                        continue;
                    }
                    if ((arg[1] === "=" || typeof arg[1] === "object" && ρσ_equals(arg[1], "="))) {
                        if ((arg[2] !== false && (typeof arg[2] !== "object" || ρσ_not_equals(arg[2], false)))) {
                            results.push((record[ρσ_bound_index(arg[0], record)] === arg[2] || typeof record[ρσ_bound_index(arg[0], record)] === "object" && ρσ_equals(record[ρσ_bound_index(arg[0], record)], arg[2])));
                        } else {
                            results.push(exist(record[ρσ_bound_index(arg[0], record)]));
                        }
                    } else if ((arg[1] === ">" || typeof arg[1] === "object" && ρσ_equals(arg[1], ">"))) {
                        results.push(record[ρσ_bound_index(arg[0], record)] > arg[2]);
                    } else if ((arg[1] === ">=" || typeof arg[1] === "object" && ρσ_equals(arg[1], ">="))) {
                        results.push(record[ρσ_bound_index(arg[0], record)] >= arg[2]);
                    } else if ((arg[1] === "<" || typeof arg[1] === "object" && ρσ_equals(arg[1], "<"))) {
                        results.push(record[ρσ_bound_index(arg[0], record)] < arg[2]);
                    } else if ((arg[1] === "<=" || typeof arg[1] === "object" && ρσ_equals(arg[1], "<="))) {
                        results.push(record[ρσ_bound_index(arg[0], record)] <= arg[2]);
                    } else if ((arg[1] === "in" || typeof arg[1] === "object" && ρσ_equals(arg[1], "in"))) {
                        results.push(ρσ_in(record[ρσ_bound_index(arg[0], record)], arg[2]));
                    } else if ((arg[1] === "not in" || typeof arg[1] === "object" && ρσ_equals(arg[1], "not in"))) {
                        results.push(!(ρσ_in(record[ρσ_bound_index(arg[0], record)], arg[2])));
                    } else if ((arg[1] === "like" || typeof arg[1] === "object" && ρσ_equals(arg[1], "like"))) {
                        results.push(ρσ_in(arg[2], record[ρσ_bound_index(arg[0], record)]));
                    } else if ((arg[1] === "ilike" || typeof arg[1] === "object" && ρσ_equals(arg[1], "ilike"))) {
                        results.push(ρσ_in(str(arg[2]).toLowerCase(), str(record[ρσ_bound_index(arg[0], record)]).toLowerCase()));
                    }
                }
                if (!exist(args) || !exist(args[0])) {
                    return true;
                } else if ((args[0] === "|" || typeof args[0] === "object" && ρσ_equals(args[0], "|"))) {
                    return results.some((function() {
                        var ρσ_anonfunc = function (result) {
                            return (result === true || typeof result === "object" && ρσ_equals(result, true));
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["result"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    return results.every((function() {
                        var ρσ_anonfunc = function (result) {
                            return (result === true || typeof result === "object" && ρσ_equals(result, true));
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["result"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
            };
            if (!query.__argnames__) Object.defineProperties(query, {
                __argnames__ : {value: ["record"]}
            });

            result = self.browse();
            if ((options.limit === 1 || typeof options.limit === "object" && ρσ_equals(options.limit, 1))) {
                if (options.index > 0) {
                    return new Promise((function() {
                        var ρσ_anonfunc = function (resolve, reject) {
                            resolve(result);
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["resolve", "reject"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
                return db.rel.find(result._name).then((function() {
                    var ρσ_anonfunc = function (records) {
                        var record, ρσ_unpack, order, desc;
                        records = queryInverse(result._name, records, result._one2many_fields, result._fields);
                        record = records[ρσ_bound_index(result._name, records)].find(query);
                        result._search_count = (record) ? 1 : 0;
                        result.values = record;
                        if (exist(options.order)) {
                            var ρσ_Iter16 = ρσ_Iterable(options.order.split(","));
                            for (var ρσ_Index16 = 0; ρσ_Index16 < ρσ_Iter16.length; ρσ_Index16++) {
                                order = ρσ_Iter16[ρσ_Index16];
                                ρσ_unpack = order.split(" ");
ρσ_unpack = ρσ_unpack_asarray(2, ρσ_unpack);
                                order = ρσ_unpack[0];
                                desc = ρσ_unpack[1];
                                desc = ((desc === "desc" || typeof desc === "object" && ρσ_equals(desc, "desc"))) ? true : false;
                                result.sort_by(order, desc);
                            }
                        }
                        return result;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["records"]}
                    });
                    return ρσ_anonfunc;
                })());
            } else {
                return db.rel.find(result._name).then((function() {
                    var ρσ_anonfunc = function (records) {
                        var values, start, ρσ_unpack, order, desc, result, record;
                        var result = new self.constructor(false, false);
                        records = queryInverse(result._name, records, result._one2many_fields, result._fields);
                        result._search_count = records[ρσ_bound_index(result._name, records)].length;
                        if (records[ρσ_bound_index(result._name, records)].length > 1) {
                            values = records[ρσ_bound_index(result._name, records)].filter(query);
                            result._search_count = values.length;
                            if (exist(options.limit) && ρσ_equals(type(options.limit), Number)) {
                                start = 0;
                                if (exist(options.index) && ρσ_equals(type(options.index), Number)) {
                                    start = options.index * options.limit;
                                    options.limit = (options.index + 1) * options.limit;
                                }
                                result.values = values.slice(start, options.limit);
                            } else {
                                result.values = values;
                            }
                            if (exist(options.order)) {
                                var ρσ_Iter17 = ρσ_Iterable(options.order.split(","));
                                for (var ρσ_Index17 = 0; ρσ_Index17 < ρσ_Iter17.length; ρσ_Index17++) {
                                    order = ρσ_Iter17[ρσ_Index17];
                                    ρσ_unpack = order.split(" ");
ρσ_unpack = ρσ_unpack_asarray(2, ρσ_unpack);
                                    order = ρσ_unpack[0];
                                    desc = ρσ_unpack[1];
                                    desc = ((desc === "desc" || typeof desc === "object" && ρσ_equals(desc, "desc"))) ? true : false;
                                    result.sort_by(order, desc);
                                }
                            }
                            return result;
                        } else {
                            result = self.browse();
                            if (options.index > 0) {
                                return result;
                            }
                            record = records[ρσ_bound_index(result._name, records)].find(query);
                            result.values = record;
                            if (exist(options.order)) {
                                var ρσ_Iter18 = ρσ_Iterable(options.order.split(","));
                                for (var ρσ_Index18 = 0; ρσ_Index18 < ρσ_Iter18.length; ρσ_Index18++) {
                                    order = ρσ_Iter18[ρσ_Index18];
                                    ρσ_unpack = order.split(" ");
ρσ_unpack = ρσ_unpack_asarray(2, ρσ_unpack);
                                    order = ρσ_unpack[0];
                                    desc = ρσ_unpack[1];
                                    desc = ((desc === "desc" || typeof desc === "object" && ρσ_equals(desc, "desc"))) ? true : false;
                                    result.sort_by(order, desc);
                                }
                            }
                            return result;
                        }
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["records"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            return result;
        };
        if (!Model.prototype.search.__argnames__) Object.defineProperties(Model.prototype.search, {
            __argnames__ : {value: []}
        });
        Model.prototype.read = function read() {
            var self = this;
            if (self._is_env) {
                return {};
            }
            return self._values;
        };
        if (!Model.prototype.read.__argnames__) Object.defineProperties(Model.prototype.read, {
            __argnames__ : {value: []}
        });
        Model.prototype.adapt = function adapt(key, value) {
            var self = this;
            var field;
            if (self._is_env) {
                return;
            }
            if (ρσ_in((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, ρσ_list_decorate([ "char", "text" ]))) {
                if (!exist(value)) {
                    value = "";
                } else {
                    value = String(value);
                }
            } else if (((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "integer" || typeof (ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "object" && ρσ_equals((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, "integer"))) {
                value = parseInt(value);
                if (isNaN(value)) {
                    return new Exception("Not a valid Number");
                }
            } else if (((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "float" || typeof (ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "object" && ρσ_equals((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, "float"))) {
                value = parseFloat(value);
                if (isNaN(value)) {
                    return new Exception("Not a valid Number");
                }
            } else if (((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "boolean" || typeof (ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "object" && ρσ_equals((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, "boolean"))) {
                if (ρσ_in(value, ρσ_list_decorate([ "true", "True" ]))) {
                    value = true;
                } else if (ρσ_in(value, ρσ_list_decorate([ "false", "False", null, undefined ]))) {
                    value = false;
                } else if (ρσ_equals(type(value), String)) {
                    return new Exception("Not a valid Boolean");
                } else {
                    value = Boolean(value);
                }
            } else if (((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "binary" || typeof (ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "object" && ρσ_equals((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, "binary"))) {
                if (!checkBase64(value)) {
                    return new Exception("Not a valid base64");
                }
            } else if (((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "selection" || typeof (ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "object" && ρσ_equals((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, "selection"))) {
                if (!exist(value)) {
                    value = null;
                } else if (ρσ_in(!value, dict((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].selection))) {
                    return new Exception("Incorrect value");
                }
            } else if (ρσ_in((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, ρσ_list_decorate([ "date", "datetime" ]))) {
                if (!exist(value)) {
                    value = null;
                } else if (ρσ_equals(type(value), Date)) {
                    value = value.toISOString();
                } else if (ρσ_equals(type(value), String)) {
                    try {
                        value = new Date(value).toISOString();
                    } catch (ρσ_Exception) {
                        ρσ_last_exception = ρσ_Exception;
                        {
                            return new Exception("Can't parse Date");
                        } 
                    }
                } else {
                    return new Exception("Can't parse Date");
                }
                if (exist(value) && ((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "date" || typeof (ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type === "object" && ρσ_equals((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, "date"))) {
                    value = value.split("T")[0] + "T00:00:00.000Z";
                }
            } else if (ρσ_in((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, ρσ_list_decorate([ "many2one", "one2one" ]))) {
                if (!exist(value)) {
                    return null;
                } else if ((value instanceof env.Model === true || typeof value instanceof env.Model === "object" && ρσ_equals(value instanceof env.Model, true))) {
                    value = value.id;
                } else if (ρσ_in(type(value), ρσ_list_decorate([ ρσ_list_constructor, Array ])) && value.length > 0) {
                    value = value[0];
                }
            } else if (ρσ_in((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].type, ρσ_list_decorate([ "many2many", "one2many" ]))) {
                if (!exist(value)) {
                    value = ρσ_list_decorate([]);
                } else if ((value instanceof env.Model === true || typeof value instanceof env.Model === "object" && ρσ_equals(value instanceof env.Model, true))) {
                    value = value.ids;
                }
            }
            if (ρσ_in((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].store, ρσ_list_decorate([ true, null ]))) {
                if (exist((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].related)) {
                    self[ρσ_bound_index((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].related, self)] = value;
                    (ρσ_expr_temp = self._values)[ρσ_bound_index((ρσ_expr_temp = self._fields)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].related, ρσ_expr_temp)] = value;
                }
                if (exist((ρσ_expr_temp = self._related)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key])) {
                    var ρσ_Iter19 = ρσ_Iterable((ρσ_expr_temp = self._related)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key]);
                    for (var ρσ_Index19 = 0; ρσ_Index19 < ρσ_Iter19.length; ρσ_Index19++) {
                        field = ρσ_Iter19[ρσ_Index19];
                        self[(typeof field === "number" && field < 0) ? self.length + field : field] = value;
                        (ρσ_expr_temp = self._values)[(typeof field === "number" && field < 0) ? ρσ_expr_temp.length + field : field] = value;
                    }
                }
            }
            return value;
        };
        if (!Model.prototype.adapt.__argnames__) Object.defineProperties(Model.prototype.adapt, {
            __argnames__ : {value: ["key", "value"]}
        });
        Model.prototype.update = function update() {
            var self = this;
            var values = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? update.__defaults__.values : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "values")){
                values = ρσ_kwargs_obj.values;
            }
            var key, value, object;
            if (self._is_env) {
                return;
            }
            if (!exist(values)) {
                if (self._is_singleton) {
                    values = (function() {
                        var ρσ_Iter = ρσ_Iterable(self._fields), ρσ_Result = {}, key;
                        for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                            key = ρσ_Iter[ρσ_Index];
                            ρσ_Result[key] = (self[(typeof key === "number" && key < 0) ? self.length + key : key]);
                        }
                        return ρσ_Result;
                    })();
                } else {
                    values = {};
                }
            }
            var ρσ_Iter20 = ρσ_Iterable(values);
            for (var ρσ_Index20 = 0; ρσ_Index20 < ρσ_Iter20.length; ρσ_Index20++) {
                key = ρσ_Iter20[ρσ_Index20];
                value = self.adapt(key, values[(typeof key === "number" && key < 0) ? values.length + key : key]);
                if (self._is_singleton) {
                    (ρσ_expr_temp = self._values)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = value;
                } else {
                    var ρσ_Iter21 = ρσ_Iterable(self._values);
                    for (var ρσ_Index21 = 0; ρσ_Index21 < ρσ_Iter21.length; ρσ_Index21++) {
                        object = ρσ_Iter21[ρσ_Index21];
                        object[(typeof key === "number" && key < 0) ? object.length + key : key] = value;
                    }
                }
            }
        };
        if (!Model.prototype.update.__defaults__) Object.defineProperties(Model.prototype.update, {
            __defaults__ : {value: {values:false}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["values"]}
        });
        Model.prototype.queue = function queue(method) {
            var self = this;
            var records, record, result;
            if (self._is_env || !exist(self)) {
                return;
            }
            records = (function() {
                var ρσ_Iter = ρσ_Iterable(self), ρσ_Result = [], record;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    record = ρσ_Iter[ρσ_Index];
                    ρσ_Result.push(record);
                }
                ρσ_Result = ρσ_list_constructor(ρσ_Result);
                return ρσ_Result;
            })();
            var index = 0;
            function next() {
                index += 1;
                if (index < records.length && ρσ_exists.n(records[(typeof index === "number" && index < 0) ? records.length + index : index])) {
                    return method(records[(typeof index === "number" && index < 0) ? records.length + index : index], next);
                }
                return self;
            };

            result = method(records[(typeof index === "number" && index < 0) ? records.length + index : index], next);
            return result;
        };
        if (!Model.prototype.queue.__argnames__) Object.defineProperties(Model.prototype.queue, {
            __argnames__ : {value: ["method"]}
        });
        Model.prototype.create = function create() {
            var self = this;
            var values = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? create.__defaults__.values : arguments[0];
            var is_client = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? create.__defaults__.is_client : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "values")){
                values = ρσ_kwargs_obj.values;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "is_client")){
                is_client = ρσ_kwargs_obj.is_client;
            }
            self.update();
            if (!exist(values)) {
                values = self.read();
            } else {
                values = merge(self.read(), values);
            }
            if (self._is_env) {
                self = self.browse();
                self.update(values);
            }
            if (is_client) {
                return ajax("post", "json", configuration.url + "/api/create", (function(){
                    var ρσ_d = {};
                    ρσ_d["login"] = self.env.user.login;
                    ρσ_d["password"] = self.env.user.password;
                    ρσ_d["encrypted"] = true;
                    ρσ_d["model"] = self._name;
                    ρσ_d["values"] = values;
                    return ρσ_d;
                }).call(this), self._context).then((function() {
                    var ρσ_anonfunc = function (result) {
                        self.values = result.values;
                        ρσ_interpolate_kwargs.call(self, self.with_context, [ρσ_desugar_kwargs({no_preload: true})]).browse(self.id);
                        return self;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        exception(error);
                        return new Exception("There is some error");
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            ρσ_delitem(values, "id");
            ρσ_delitem(values, "rev");
            ρσ_delitem(values, "_id");
            ρσ_delitem(values, "_rev");
            return db.rel.save(self._name, values).then((function() {
                var ρσ_anonfunc = function (record) {
                    self.values = record[ρσ_bound_index(self._name, record)][0];
                    return self;
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["record"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!Model.prototype.create.__defaults__) Object.defineProperties(Model.prototype.create, {
            __defaults__ : {value: {values:false, is_client:configuration.client}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["values", "is_client"]}
        });
        Model.prototype.write = function write() {
            var self = this;
            var values = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? write.__defaults__.values : arguments[0];
            var is_client = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? write.__defaults__.is_client : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "values")){
                values = ρσ_kwargs_obj.values;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "is_client")){
                is_client = ρσ_kwargs_obj.is_client;
            }
            if (!exist(self.id) && !exist(self.ids)) {
                return self;
            }
            self.update();
            if (!exist(values)) {
                if (!self._is_singleton) {
                    return;
                }
                values = self.read();
            } else {
                self.update(values);
                values = self.read();
            }
            if (is_client) {
                return ajax("post", "json", configuration.url + "/api/write", (function(){
                    var ρσ_d = {};
                    ρσ_d["login"] = self.env.user.login;
                    ρσ_d["password"] = self.env.user.password;
                    ρσ_d["encrypted"] = true;
                    ρσ_d["model"] = self._name;
                    ρσ_d["ids"] = (function() {
                        var ρσ_Iter = ρσ_Iterable(self.__iter__()), ρσ_Result = [], record;
                        for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                            record = ρσ_Iter[ρσ_Index];
                            ρσ_Result.push(record.id);
                        }
                        ρσ_Result = ρσ_list_constructor(ρσ_Result);
                        return ρσ_Result;
                    })();
                    ρσ_d["values"] = values;
                    return ρσ_d;
                }).call(this), self._context).then((function() {
                    var ρσ_anonfunc = function (result) {
                        self.values = result.values;
                        ρσ_interpolate_kwargs.call(self, self.with_context, [ρσ_desugar_kwargs({no_preload: true})]).browse(self.id);
                        return self;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        exception(error);
                        return new Exception("There are some error");
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            if (self._is_singleton) {
                return db.get(db.rel.makeDocID((function(){
                    var ρσ_d = {};
                    ρσ_d["type"] = self._name;
                    ρσ_d["id"] = self.id;
                    return ρσ_d;
                }).call(this))).then((function() {
                    var ρσ_anonfunc = function (record) {
                        delete values._id;
                        delete values._rev;
                        delete values.rev;
                        values.rev = record._rev;
                        return db.rel.save(self._name, values).then((function() {
                            var ρσ_anonfunc = function (result) {
                                self.values = values;
                                return self;
                            };
                            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                __argnames__ : {value: ["result"]}
                            });
                            return ρσ_anonfunc;
                        })());
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["record"]}
                    });
                    return ρσ_anonfunc;
                })());
            } else {
                return self.queue((function() {
                    var ρσ_anonfunc = function (record, next) {
                        return record.write().then((function() {
                            var ρσ_anonfunc = function (result) {
                                return next();
                            };
                            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                __argnames__ : {value: ["result"]}
                            });
                            return ρσ_anonfunc;
                        })());
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["record", "next"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            return self;
        };
        if (!Model.prototype.write.__defaults__) Object.defineProperties(Model.prototype.write, {
            __defaults__ : {value: {values:false, is_client:configuration.client}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["values", "is_client"]}
        });
        Model.prototype.unlink = function unlink() {
            var self = this;
            var is_client = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? unlink.__defaults__.is_client : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "is_client")){
                is_client = ρσ_kwargs_obj.is_client;
            }
            var value;
            if (!exist(self.id) && !exist(self.ids)) {
                return;
            }
            if (is_client) {
                return ajax("post", "json", configuration.url + "/api/unlink", (function(){
                    var ρσ_d = {};
                    ρσ_d["login"] = self.env.user.login;
                    ρσ_d["password"] = self.env.user.password;
                    ρσ_d["encrypted"] = true;
                    ρσ_d["model"] = self._name;
                    ρσ_d["ids"] = (function() {
                        var ρσ_Iter = ρσ_Iterable(self.__iter__()), ρσ_Result = [], record;
                        for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                            record = ρσ_Iter[ρσ_Index];
                            ρσ_Result.push(record.id);
                        }
                        ρσ_Result = ρσ_list_constructor(ρσ_Result);
                        return ρσ_Result;
                    })();
                    return ρσ_d;
                }).call(this), self._context).then((function() {
                    var ρσ_anonfunc = function (result) {
                        return true;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        warning(error, true);
                        return false;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            if (self._is_singleton) {
                db.get(db.rel.makeDocID((function(){
                    var ρσ_d = {};
                    ρσ_d["type"] = self._name;
                    ρσ_d["id"] = self.id;
                    return ρσ_d;
                }).call(this))).then((function() {
                    var ρσ_anonfunc = function (record) {
                        db.remove(record);
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["record"]}
                    });
                    return ρσ_anonfunc;
                })());
            } else {
                var ρσ_Iter22 = ρσ_Iterable(self._values);
                for (var ρσ_Index22 = 0; ρσ_Index22 < ρσ_Iter22.length; ρσ_Index22++) {
                    value = ρσ_Iter22[ρσ_Index22];
                    value["_deleted"] = true;
                }
                db.bulkDocs(self._values);
            }
            return true;
        };
        if (!Model.prototype.unlink.__defaults__) Object.defineProperties(Model.prototype.unlink, {
            __defaults__ : {value: {is_client:configuration.client}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["is_client"]}
        });
        Model.prototype.with_context = function with_context() {
            var self = this;
            var kwargs = arguments[arguments.length-1];
            if (kwargs === null || typeof kwargs !== "object" || kwargs [ρσ_kwargs_symbol] !== true) kwargs = {};
            var key;
            var ρσ_Iter23 = ρσ_Iterable(kwargs);
            for (var ρσ_Index23 = 0; ρσ_Index23 < ρσ_Iter23.length; ρσ_Index23++) {
                key = ρσ_Iter23[ρσ_Index23];
                (ρσ_expr_temp = self._context)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = kwargs[(typeof key === "number" && key < 0) ? kwargs.length + key : key];
            }
            return self;
        };
        if (!Model.prototype.with_context.__handles_kwarg_interpolation__) Object.defineProperties(Model.prototype.with_context, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: []}
        });
        Model.prototype.sort_by = function sort_by() {
            var self = this;
            var field = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var desc = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? sort_by.__defaults__.desc : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "desc")){
                desc = ρσ_kwargs_obj.desc;
            }
            if (self.length < 2) {
                return self;
            }
            self.values.sort((function() {
                var ρσ_anonfunc = function (a, b) {
                    var c, d;
                    if (desc) {
                        c = a;
                        d = b;
                        a = d;
                        b = c;
                    }
                    if (a[(typeof field === "number" && field < 0) ? a.length + field : field] < b[(typeof field === "number" && field < 0) ? b.length + field : field]) {
                        return -1;
                    } else if (a[(typeof field === "number" && field < 0) ? a.length + field : field] > b[(typeof field === "number" && field < 0) ? b.length + field : field]) {
                        return 1;
                    }
                    return 0;
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["a", "b"]}
                });
                return ρσ_anonfunc;
            })());
            return self;
        };
        if (!Model.prototype.sort_by.__defaults__) Object.defineProperties(Model.prototype.sort_by, {
            __defaults__ : {value: {desc:false}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["field", "desc"]}
        });
        Model.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        Model.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(Model.prototype, "__bases__", {value: []});
        Model.prototype._name = undefined;
        Model.prototype._inherit = false;
        Model.prototype._rec_name = "name";

        ρσ_modules["orm.models"].env = env;
        ρσ_modules["orm.models"].schemas = schemas;
        ρσ_modules["orm.models"].raw_models = raw_models;
        ρσ_modules["orm.models"].setSchema = setSchema;
        ρσ_modules["orm.models"].queryInverse = queryInverse;
        ρσ_modules["orm.models"].Model = Model;
    })();

    (function(){
        var __name__ = "res.config";
        var models = ρσ_modules["orm.models"];

        var fields = ρσ_modules["orm.fields"];

        function ResConfig() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            ResConfig.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(ResConfig, models.Model);
        ResConfig.prototype.__init__ = function __init__ () {
            models.Model.prototype.__init__ && models.Model.prototype.__init__.apply(this, arguments);
        };
        ResConfig.prototype.__repr__ = function __repr__ () {
            if(models.Model.prototype.__repr__) return models.Model.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        ResConfig.prototype.__str__ = function __str__ () {
            if(models.Model.prototype.__str__) return models.Model.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(ResConfig.prototype, "__bases__", {value: [models.Model]});
        ResConfig.prototype._name = "res.config";
        ResConfig.prototype.key = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Config Key"})]);
        ResConfig.prototype.value = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Config Value"})]);

        new ResConfig;
        ρσ_modules["res.config"].ResConfig = ResConfig;
    })();

    (function(){
        var __name__ = "ir";

    })();

    (function(){
        var __name__ = "ir.ui";
        var menu, view;
        var schemas = ρσ_modules["orm.models"].schemas;

        var tools = ρσ_modules["orm.tools"];

        if (!tools.exist(tools.menu)) {
            tools.menu = {};
        }
        menu = {};
        menu.add = (function() {
            var ρσ_anonfunc = function add(args) {
                if (ρσ_in("id", args) && ρσ_in("string", args)) {
                    if (ρσ_in(args.id, tools.menu)) {
                        return;
                    }
                    if (ρσ_in("parent", args)) {
                        if (!(ρσ_in(args.parent, tools.menu))) {
                            return;
                        }
                    }
                    if (ρσ_in("model", args)) {
                        if (!(ρσ_in(args.model, schemas))) {
                            return;
                        }
                    }
                    (ρσ_expr_temp = tools.menu)[ρσ_bound_index(args.id, ρσ_expr_temp)] = tools.merge((function(){
                        var ρσ_d = {};
                        ρσ_d["parent"] = false;
                        ρσ_d["childs"] = ρσ_list_decorate([]);
                        ρσ_d["model"] = false;
                        ρσ_d["view_id"] = false;
                        ρσ_d["sequence"] = 1;
                        return ρσ_d;
                    }).call(this), args);
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["args"]}
            });
            return ρσ_anonfunc;
        })();
        menu.add((function(){
            var ρσ_d = {};
            ρσ_d["id"] = "settings";
            ρσ_d["string"] = "Settings";
            ρσ_d["sequence"] = 1e3;
            return ρσ_d;
        }).call(this));
        if (!tools.exist(tools.view)) {
            tools.view = {};
        }
        view = {};
        view.add = (function() {
            var ρσ_anonfunc = function add(args) {
                var key;
                if (ρσ_in("model", args) && ρσ_in("mode", args) && ρσ_in("arch", args)) {
                    if (!(ρσ_in(args.model, schemas))) {
                        return;
                    }
                    if (!tools.exist(args.string)) {
                        args.string = "";
                        var ρσ_Iter0 = ρσ_Iterable(tools.menu);
                        for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                            key = ρσ_Iter0[ρσ_Index0];
                            if (tools.exist((ρσ_expr_temp = tools.menu)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].model) && ((ρσ_expr_temp = tools.menu)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].model === args.model || typeof (ρσ_expr_temp = tools.menu)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].model === "object" && ρσ_equals((ρσ_expr_temp = tools.menu)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].model, args.model))) {
                                args.string = (ρσ_expr_temp = tools.menu)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key].string;
                                break;
                            }
                        }
                    }
                    if (!(ρσ_in(args.model, tools.view))) {
                        (ρσ_expr_temp = tools.view)[ρσ_bound_index(args.model, ρσ_expr_temp)] = {};
                    }
                    if (tools.exist(args.init)) {
                        if (!(ρσ_expr_temp = tools.view)[ρσ_bound_index(args.model, ρσ_expr_temp)].custom_init) {
                            (ρσ_expr_temp = tools.view)[ρσ_bound_index(args.model, ρσ_expr_temp)].custom_init = {};
                        }
                        (ρσ_expr_temp = (ρσ_expr_temp = tools.view)[ρσ_bound_index(args.model, ρσ_expr_temp)].custom_init)[ρσ_bound_index(args.model + "." + args.mode, ρσ_expr_temp)] = args.init;
                    }
                    (ρσ_expr_temp = (ρσ_expr_temp = tools.view)[ρσ_bound_index(args.model, ρσ_expr_temp)])[ρσ_bound_index(args.mode, ρσ_expr_temp)] = args.arch;
                    (ρσ_expr_temp = tools.view)[ρσ_bound_index(args.model, ρσ_expr_temp)].string = args.string;
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["args"]}
            });
            return ρσ_anonfunc;
        })();
        tools.configuration.material_theme = "theme-teal";
        tools.configuration.custom_navbar = "#875a7b";
        ρσ_modules["ir.ui"].menu = menu;
        ρσ_modules["ir.ui"].view = view;
    })();

    (function(){
        var __name__ = "res.debug";
        var models = ρσ_modules["orm.models"];

        var fields = ρσ_modules["orm.fields"];

        var menu = ρσ_modules["ir.ui"].menu;
        var view = ρσ_modules["ir.ui"].view;

        function ResDebug() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            ResDebug.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(ResDebug, models.Model);
        ResDebug.prototype.__init__ = function __init__ () {
            models.Model.prototype.__init__ && models.Model.prototype.__init__.apply(this, arguments);
        };
        ResDebug.prototype.__repr__ = function __repr__ () {
            if(models.Model.prototype.__repr__) return models.Model.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        ResDebug.prototype.__str__ = function __str__ () {
            if(models.Model.prototype.__str__) return models.Model.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(ResDebug.prototype, "__bases__", {value: [models.Model]});
        ResDebug.prototype._name = "res.debug";
        ResDebug.prototype.name = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Debug"})]);

        new ResDebug;
        menu.add((function(){
            var ρσ_d = {};
            ρσ_d["id"] = "settings_debug";
            ρσ_d["string"] = "Debug";
            ρσ_d["parent"] = "settings";
            ρσ_d["model"] = "res.debug";
            ρσ_d["view_id"] = "res.debug.console";
            ρσ_d["sequence"] = 1e4;
            return ρσ_d;
        }).call(this));
        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.debug";
            ρσ_d["mode"] = "console";
            ρσ_d["string"] = false;
            ρσ_d["arch"] = "\n<div data-page=\"res.debug.console\" class=\"page\">\n \n            <!-- Top Navbar. In Material theme it should be inside of the page-->\n            <div class=\"navbar\">\n              <div class=\"navbar-inner\">\n                <div class=\"left\">\n                  <a class=\"back link icon-only\"><i class=\"icon icon-back\"></i></a>\n                </div>\n                <div class=\"center\">Debug</div>\n              </div>\n            </div>\n \n            <!-- Scrollable page content -->\n            <div class=\"page-content\">\n              <div class=\"list-block inputs-list\" style=\"margin: 0px;\">\n                <div>\n                  \n                  <div>\n                    <div class=\"item-content\">\n                      <div class=\"item-inner not-empty-state\">\n                        <div class=\"item-title label\">Command</div>\n                        <div class=\"item-input item-input-field not-empty-state\">\n                          <input type=\"text\" id=\"command\">\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                  \n                  <div class=\"item-content\" style=\"margin-top: 10px;\">\n                    <div class=\"button button-fill button-raised\" onclick=\"eval(getValue('command'))\">Execute</div>\n                  </div>\n                  \n                </div>\n              </div>\n            </div>\n          </div>\n";
            return ρσ_d;
        }).call(this));
        ρσ_modules["res.debug"].ResDebug = ResDebug;
    })();

    (function(){
        var __name__ = "orm.api";
        var depends;
        var models = ρσ_modules["orm.models"];

        var tools = ρσ_modules["orm.tools"];

        function server() {
            var method = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var write = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? server.__defaults__.write : arguments[1];
            var iterate = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? server.__defaults__.iterate : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "write")){
                write = ρσ_kwargs_obj.write;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "iterate")){
                iterate = ρσ_kwargs_obj.iterate;
            }
            function wrap() {
                var args, result;
                var self = this;
                args = Array.prototype.slice.call(arguments);
                if (!tools.configuration.client) {
                    if (self.length > 1) {
                        return self.queue((function() {
                            var ρσ_anonfunc = function (record, next) {
                                return record[ρσ_bound_index(method.name, record)].apply(record, args).then((function() {
                                    var ρσ_anonfunc = function (value) {
                                        if (tools.exist(value)) {
                                            return value;
                                        } else {
                                            return next();
                                        }
                                    };
                                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                        __argnames__ : {value: ["value"]}
                                    });
                                    return ρσ_anonfunc;
                                })());
                            };
                            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                __argnames__ : {value: ["record", "next"]}
                            });
                            return ρσ_anonfunc;
                        })());
                    }
                    self[ρσ_bound_index(method.name, self)] = method;
                    result = self[ρσ_bound_index(method.name, self)].apply(self, args);
                    if (write && (result instanceof models.Model === true || typeof result instanceof models.Model === "object" && ρσ_equals(result instanceof models.Model, true))) {
                        result = result.write();
                    }
                    if (tools.exist(result) && ρσ_equals(type(result), Promise)) {
                        return result;
                    }
                    return new Promise((function() {
                        var ρσ_anonfunc = function (resolve, reject) {
                            try {
                                resolve(result);
                            } catch (ρσ_Exception) {
                                ρσ_last_exception = ρσ_Exception;
                                if (ρσ_Exception instanceof Error) {
                                    var error = ρσ_Exception;
                                    reject(error);
                                } else {
                                    throw ρσ_Exception;
                                }
                            }
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["resolve", "reject"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
                return tools.ajax("post", "json", tools.configuration.url + "/api/methods", (function(){
                    var ρσ_d = {};
                    ρσ_d["login"] = models.env.user.login;
                    ρσ_d["password"] = models.env.user.password;
                    ρσ_d["encrypted"] = true;
                    ρσ_d["model"] = self._name;
                    ρσ_d["ids"] = self.ids;
                    ρσ_d["method"] = method.name;
                    ρσ_d["args"] = args;
                    return ρσ_d;
                }).call(this), self._context).then((function() {
                    var ρσ_anonfunc = function (result) {
                        var context;
                        self.values = result.values;
                        context = self._context;
                        ρσ_interpolate_kwargs.call((ρσ_expr_temp = self.env)[ρσ_bound_index(self._name, ρσ_expr_temp)], (ρσ_expr_temp = self.env)[ρσ_bound_index(self._name, ρσ_expr_temp)].with_context, [ρσ_desugar_kwargs(context)]).browse(self.ids);
                        return self;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        console.log(error);
                        return new Exception("There are some error");
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            };

            return wrap;
        };
        if (!server.__defaults__) Object.defineProperties(server, {
            __defaults__ : {value: {write:true, iterate:true}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["method", "write", "iterate"]}
        });

        function client() {
            var method = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var write = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? client.__defaults__.write : arguments[1];
            var iterate = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? client.__defaults__.iterate : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "write")){
                write = ρσ_kwargs_obj.write;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "iterate")){
                iterate = ρσ_kwargs_obj.iterate;
            }
            function wrap() {
                var result;
                var self = this;
                if (!tools.configuration.client) {
                    if (self.length > 1) {
                        return self.queue((function() {
                            var ρσ_anonfunc = function (record, next) {
                                return record[ρσ_bound_index(method.name, record)]().then((function() {
                                    var ρσ_anonfunc = function (value) {
                                        if (tools.exist(value)) {
                                            return value;
                                        } else {
                                            return next();
                                        }
                                    };
                                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                        __argnames__ : {value: ["value"]}
                                    });
                                    return ρσ_anonfunc;
                                })());
                            };
                            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                __argnames__ : {value: ["record", "next"]}
                            });
                            return ρσ_anonfunc;
                        })());
                    }
                    self[ρσ_bound_index(method.name, self)] = method;
                    result = self[ρσ_bound_index(method.name, self)]();
                    if (write && (result instanceof models.Model === true || typeof result instanceof models.Model === "object" && ρσ_equals(result instanceof models.Model, true))) {
                        result = result.write();
                    }
                    if (tools.exist(result) && ρσ_equals(type(result), Promise)) {
                        return result;
                    }
                    return new Promise((function() {
                        var ρσ_anonfunc = function (resolve, reject) {
                            try {
                                resolve(result);
                            } catch (ρσ_Exception) {
                                ρσ_last_exception = ρσ_Exception;
                                if (ρσ_Exception instanceof Error) {
                                    var error = ρσ_Exception;
                                    reject(error);
                                } else {
                                    throw ρσ_Exception;
                                }
                            }
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["resolve", "reject"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
                return tools.ajax("post", "json", tools.configuration.url + "/api/methods", (function(){
                    var ρσ_d = {};
                    ρσ_d["login"] = models.env.user.login;
                    ρσ_d["password"] = models.env.user.password;
                    ρσ_d["encrypted"] = true;
                    ρσ_d["model"] = self._name;
                    ρσ_d["ids"] = self.ids;
                    ρσ_d["method"] = method.name;
                    return ρσ_d;
                }).call(this), self._context).then((function() {
                    var ρσ_anonfunc = function (result) {
                        var context;
                        self.values = result.values;
                        context = self._context;
                        ρσ_interpolate_kwargs.call((ρσ_expr_temp = self.env)[ρσ_bound_index(self._name, ρσ_expr_temp)], (ρσ_expr_temp = self.env)[ρσ_bound_index(self._name, ρσ_expr_temp)].with_context, [ρσ_desugar_kwargs(context)]).browse(self.ids);
                        return self;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        console.log(error);
                        self[ρσ_bound_index(method.name, self)] = method;
                        return self[ρσ_bound_index(method.name, self)]();
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            };

            return wrap;
        };
        if (!client.__defaults__) Object.defineProperties(client, {
            __defaults__ : {value: {write:true, iterate:true}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["method", "write", "iterate"]}
        });

        function strict() {
            var method = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var write = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? strict.__defaults__.write : arguments[1];
            var iterate = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? strict.__defaults__.iterate : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "write")){
                write = ρσ_kwargs_obj.write;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "iterate")){
                iterate = ρσ_kwargs_obj.iterate;
            }
            function wrap() {
                var result;
                var self = this;
                if ((typeof window === 'undefined' === true || typeof typeof window === 'undefined' === "object" && ρσ_equals(typeof window === 'undefined', true))) {
                    if (self.length > 1) {
                        return self.queue((function() {
                            var ρσ_anonfunc = function (record, next) {
                                return record[ρσ_bound_index(method.name, record)]().then((function() {
                                    var ρσ_anonfunc = function (value) {
                                        if (tools.exist(value)) {
                                            return value;
                                        } else {
                                            return next();
                                        }
                                    };
                                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                        __argnames__ : {value: ["value"]}
                                    });
                                    return ρσ_anonfunc;
                                })());
                            };
                            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                __argnames__ : {value: ["record", "next"]}
                            });
                            return ρσ_anonfunc;
                        })());
                    }
                    self[ρσ_bound_index(method.name, self)] = method;
                    result = self[ρσ_bound_index(method.name, self)]();
                    if (write && (result instanceof models.Model === true || typeof result instanceof models.Model === "object" && ρσ_equals(result instanceof models.Model, true))) {
                        result = result.write();
                    }
                    if (tools.exist(result) && ρσ_equals(type(result), Promise)) {
                        return result;
                    }
                    return new Promise((function() {
                        var ρσ_anonfunc = function (resolve, reject) {
                            try {
                                resolve(result);
                            } catch (ρσ_Exception) {
                                ρσ_last_exception = ρσ_Exception;
                                if (ρσ_Exception instanceof Error) {
                                    var error = ρσ_Exception;
                                    reject(error);
                                } else {
                                    throw ρσ_Exception;
                                }
                            }
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["resolve", "reject"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
                return tools.ajax("post", "json", tools.configuration.url + "/api/methods", (function(){
                    var ρσ_d = {};
                    ρσ_d["login"] = models.env.user.login;
                    ρσ_d["password"] = models.env.user.password;
                    ρσ_d["encrypted"] = true;
                    ρσ_d["model"] = self._name;
                    ρσ_d["ids"] = self.ids;
                    ρσ_d["method"] = method.name;
                    return ρσ_d;
                }).call(this), self._context).then((function() {
                    var ρσ_anonfunc = function (result) {
                        var context;
                        self.values = result.values;
                        context = self._context;
                        ρσ_interpolate_kwargs.call((ρσ_expr_temp = self.env)[ρσ_bound_index(self._name, ρσ_expr_temp)], (ρσ_expr_temp = self.env)[ρσ_bound_index(self._name, ρσ_expr_temp)].with_context, [ρσ_desugar_kwargs(context)]).browse(self.ids);
                        return self;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        console.log(error);
                        return new Exception("There are some error");
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            };

            return wrap;
        };
        if (!strict.__defaults__) Object.defineProperties(strict, {
            __defaults__ : {value: {write:true, iterate:true}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["method", "write", "iterate"]}
        });

        function onchange() {
            var method = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var fields = Array.prototype.slice.call(arguments, 1);
            if (arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) fields.pop();
            method._onchange_fields = fields;
            function wrap() {
                var result;
                var self = this;
                self[ρσ_bound_index(method.name, self)] = method;
                result = self[ρσ_bound_index(method.name, self)]();
                if (!tools.exist(result)) {
                    result = self;
                }
                return result;
            };

            return wrap;
        };
        if (!onchange.__handles_kwarg_interpolation__) Object.defineProperties(onchange, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["method"]}
        });

        function get_onchanges(self) {
            var onchanges, field, key;
            onchanges = {};
            var ρσ_Iter0 = ρσ_Iterable(Object.getOwnPropertyNames(self));
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                key = ρσ_Iter0[ρσ_Index0];
                if (tools.exist(self[(typeof key === "number" && key < 0) ? self.length + key : key]) && ρσ_equals(type(self[(typeof key === "number" && key < 0) ? self.length + key : key]), Function) && tools.exist(self[(typeof key === "number" && key < 0) ? self.length + key : key]._onchange_fields)) {
                    var ρσ_Iter1 = ρσ_Iterable(self[(typeof key === "number" && key < 0) ? self.length + key : key]._onchange_fields);
                    for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                        field = ρσ_Iter1[ρσ_Index1];
                        if (!tools.exist(onchanges[(typeof field === "number" && field < 0) ? onchanges.length + field : field])) {
                            onchanges[(typeof field === "number" && field < 0) ? onchanges.length + field : field] = ρσ_list_decorate([]);
                        }
                        onchanges[(typeof field === "number" && field < 0) ? onchanges.length + field : field].push(self[(typeof key === "number" && key < 0) ? self.length + key : key].name);
                    }
                }
            }
            return onchanges;
        };
        if (!get_onchanges.__argnames__) Object.defineProperties(get_onchanges, {
            __argnames__ : {value: ["self"]}
        });

        tools.get_onchanges = get_onchanges;
        depends = onchange;
        ρσ_modules["orm.api"].depends = depends;
        ρσ_modules["orm.api"].server = server;
        ρσ_modules["orm.api"].client = client;
        ρσ_modules["orm.api"].strict = strict;
        ρσ_modules["orm.api"].onchange = onchange;
        ρσ_modules["orm.api"].get_onchanges = get_onchanges;
    })();

    (function(){
        var __name__ = "res.users";
        var default_create, admin_password;
        var models = ρσ_modules["orm.models"];

        var fields = ρσ_modules["orm.fields"];

        var api = ρσ_modules["orm.api"];

        var tools = ρσ_modules["orm.tools"];

        var menu = ρσ_modules["ir.ui"].menu;
        var view = ρσ_modules["ir.ui"].view;

        function ResUsers() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            ResUsers.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(ResUsers, models.Model);
        ResUsers.prototype.__init__ = function __init__ () {
            models.Model.prototype.__init__ && models.Model.prototype.__init__.apply(this, arguments);
        };
        ResUsers.prototype._create_partner = api.server((function() {
            var ρσ_anonfunc = function _create_partner() {
                var self = this;
                return self.env["res.partner"].create((function(){
                    var ρσ_d = {};
                    ρσ_d["name"] = self.name;
                    ρσ_d["email"] = self.login;
                    return ρσ_d;
                }).call(this)).then((function() {
                    var ρσ_anonfunc = function (result) {
                        return self;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })());
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: []}
            });
            return ρσ_anonfunc;
        })());
        ResUsers.prototype.__repr__ = function __repr__ () {
            if(models.Model.prototype.__repr__) return models.Model.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        ResUsers.prototype.__str__ = function __str__ () {
            if(models.Model.prototype.__str__) return models.Model.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(ResUsers.prototype, "__bases__", {value: [models.Model]});
        ResUsers.prototype._name = "res.users";
        ResUsers.prototype.name = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Name", required: true})]);
        ResUsers.prototype.login = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Username/Email", required: true})]);
        ResUsers.prototype.password = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Password"})]);
        

        default_create = ResUsers.prototype.create;
        function create() {
            var values = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? create.__defaults__.values : arguments[0];
            var client = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? create.__defaults__.client : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "values")){
                values = ρσ_kwargs_obj.values;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "client")){
                client = ρσ_kwargs_obj.client;
            }
            var self, result;
            self = this;
            self.create = default_create;
            result = ρσ_interpolate_kwargs.call(self, self.create, [ρσ_desugar_kwargs({values: values, client: client})]);
            if (typeof window === 'undefined') {
                result = result.then((function() {
                    var ρσ_anonfunc = function (record) {
                        (ρσ_expr_temp = models.env.context.sockets)[ρσ_bound_index(record.id, ρσ_expr_temp)] = models.env.context.socket.of("/" + record.id);
                        return record;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["record"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            self.create = create;
            return result;
        };
        if (!create.__defaults__) Object.defineProperties(create, {
            __defaults__ : {value: {values:false, client:tools.configuration.client}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["values", "client"]}
        });

        ResUsers.prototype.create = create;
        ResUsers.create = create;
        new ResUsers;
        menu.add((function(){
            var ρσ_d = {};
            ρσ_d["id"] = "settings_users";
            ρσ_d["string"] = "Users";
            ρσ_d["parent"] = "settings";
            ρσ_d["model"] = "res.users";
            ρσ_d["sequence"] = 1;
            return ρσ_d;
        }).call(this));
        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.users";
            ρσ_d["mode"] = "tree";
            ρσ_d["string"] = false;
            ρσ_d["arch"] = "\n<tree>\n    <field name=\"name\"/>\n    <field name=\"login\"/>\n</tree>\n";
            return ρσ_d;
        }).call(this));
        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.users";
            ρσ_d["mode"] = "form";
            ρσ_d["string"] = false;
            ρσ_d["arch"] = "\n<form>\n    <header>\n        <button name=\"_create_partner\" string=\"Create Contact\"/>\n    </header>\n    <sheet>\n        <group>\n            <field name=\"name\"/>\n        </group>\n        <group>\n            <field name=\"login\"/>\n        </group>\n    </sheet>\n</form>\n";
            return ρσ_d;
        }).call(this));
        admin_password = "r4pyd";
        function check_admin() {
            function create_admin() {
                models.env["res.users"].create((function(){
                    var ρσ_d = {};
                    ρσ_d["name"] = "Administrator";
                    ρσ_d["login"] = "admin";
                    ρσ_d["password"] = admin_password;
                    return ρσ_d;
                }).call(this)).then((function() {
                    var ρσ_anonfunc = function (record) {
                        models.env.user = record;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["record"]}
                    });
                    return ρσ_anonfunc;
                })());
            };

            if (!tools.configuration.client) {
                models.env["res.users"].search(ρσ_list_decorate([])).then((function() {
                    var ρσ_anonfunc = function (records) {
                        if (records.length < 1) {
                            create_admin();
                        }
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["records"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (error) {
                        create_admin();
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
        };

        ρσ_modules["res.users"].default_create = default_create;
        ρσ_modules["res.users"].admin_password = admin_password;
        ρσ_modules["res.users"].ResUsers = ResUsers;
        ρσ_modules["res.users"].create = create;
        ρσ_modules["res.users"].check_admin = check_admin;
    })();

    (function(){
        var __name__ = "res.partner";
        var models = ρσ_modules["orm.models"];

        var fields = ρσ_modules["orm.fields"];

        var tools = ρσ_modules["orm.tools"];

        var menu = ρσ_modules["ir.ui"].menu;
        var view = ρσ_modules["ir.ui"].view;

        function ResPartner() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            ResPartner.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(ResPartner, models.Model);
        ResPartner.prototype.__init__ = function __init__ () {
            models.Model.prototype.__init__ && models.Model.prototype.__init__.apply(this, arguments);
        };
        ResPartner.prototype.__repr__ = function __repr__ () {
            if(models.Model.prototype.__repr__) return models.Model.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        ResPartner.prototype.__str__ = function __str__ () {
            if(models.Model.prototype.__str__) return models.Model.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(ResPartner.prototype, "__bases__", {value: [models.Model]});
        ResPartner.prototype._name = "res.partner";
        ResPartner.prototype.name = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Name", required: true})]);
        ResPartner.prototype.email = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Email"})]);
        ResPartner.prototype.phone = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Phone"})]);

        new ResPartner;
        menu.add((function(){
            var ρσ_d = {};
            ρσ_d["id"] = "contact";
            ρσ_d["string"] = "Contacts";
            ρσ_d["model"] = "res.partner";
            ρσ_d["sequence"] = 1;
            return ρσ_d;
        }).call(this));
        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.partner";
            ρσ_d["mode"] = "tree";
            ρσ_d["string"] = false;
            ρσ_d["arch"] = "\n<tree>\n    <field name=\"name\"/>\n    <field name=\"email\"/>\n    <field name=\"phone\"/>\n</tree>\n";
            return ρσ_d;
        }).call(this));
        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.partner";
            ρσ_d["mode"] = "form";
            ρσ_d["string"] = false;
            ρσ_d["arch"] = "\n<form>\n    <sheet>\n        <group>\n            <field name=\"name\"/>\n            <field name=\"phone\"/>\n        </group>\n        <group>\n            <field name=\"email\"/>\n        </group>\n    </sheet>\n</form>\n";
            return ρσ_d;
        }).call(this));
        ρσ_modules["res.partner"].ResPartner = ResPartner;
    })();

    (function(){
        var __name__ = "res.message";
        var interval;
        var models = ρσ_modules["orm.models"];

        var fields = ρσ_modules["orm.fields"];

        var tools = ρσ_modules["orm.tools"];

        var api = ρσ_modules["orm.api"];

        var menu = ρσ_modules["ir.ui"].menu;
        var view = ρσ_modules["ir.ui"].view;

        function ResMessage() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            ResMessage.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(ResMessage, models.Model);
        ResMessage.prototype.__init__ = function __init__ () {
            models.Model.prototype.__init__ && models.Model.prototype.__init__.apply(this, arguments);
        };
        ResMessage.prototype.send_message = api.strict((function() {
            var ρσ_anonfunc = function send_message() {
                var self = this;
                self.sent = true;
                if (!self.date) {
                    self.date = new Date;
                }
                self.env["res.users"].browse(self.sender_id).then((function() {
                    var ρσ_anonfunc = function (result) {
                        var message;
                        if (self.recipient_id) {
                            (ρσ_expr_temp = models.env.context.sockets)[ρσ_bound_index(self.sender_id, ρσ_expr_temp)].emit("private-message", (function(){
                                var ρσ_d = {};
                                ρσ_d["text"] = self.text;
                                ρσ_d["date"] = self.date;
                                ρσ_d["type"] = "sent";
                                return ρσ_d;
                            }).call(this));
                            (ρσ_expr_temp = models.env.context.sockets)[ρσ_bound_index(self.recipient_id, ρσ_expr_temp)].emit("private-message", (function(){
                                var ρσ_d = {};
                                ρσ_d["name"] = result.name;
                                ρσ_d["text"] = self.text;
                                ρσ_d["date"] = self.date;
                                ρσ_d["type"] = "received";
                                return ρσ_d;
                            }).call(this));
                            return self;
                        }
                        message = (function(){
                            var ρσ_d = {};
                            ρσ_d["message"] = self.text;
                            ρσ_d["date"] = self.date;
                            return ρσ_d;
                        }).call(this);
                        if (result.length > 0) {
                            message["user"] = result.name;
                        } else {
                            message["user"] = "Administrator";
                        }
                        self.env.context.socket.emit("message", message);
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })()).catch((function() {
                    var ρσ_anonfunc = function (result) {
                        self.env.context.socket.emit("message", (function(){
                            var ρσ_d = {};
                            ρσ_d["message"] = self.text;
                            ρσ_d["date"] = self.date;
                            ρσ_d["user"] = "Administrator";
                            return ρσ_d;
                        }).call(this));
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["result"]}
                    });
                    return ρσ_anonfunc;
                })());
                console.log(self.text);
                return self;
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: []}
            });
            return ρσ_anonfunc;
        })());
        ResMessage.prototype.__repr__ = function __repr__ () {
            if(models.Model.prototype.__repr__) return models.Model.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        ResMessage.prototype.__str__ = function __str__ () {
            if(models.Model.prototype.__str__) return models.Model.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(ResMessage.prototype, "__bases__", {value: [models.Model]});
        ResMessage.prototype._name = "res.message";
        ResMessage.prototype.name = ρσ_interpolate_kwargs.call(fields, fields.Char, [ρσ_desugar_kwargs({string: "Title", required: true})]);
        ResMessage.prototype.text = ρσ_interpolate_kwargs.call(fields, fields.Text, [ρσ_desugar_kwargs({string: "Text", required: true})]);
        ResMessage.prototype.sent = ρσ_interpolate_kwargs.call(fields, fields.Boolean, [ρσ_desugar_kwargs({string: "Sent"})]);
        ResMessage.prototype.date = ρσ_interpolate_kwargs.call(fields, fields.Datetime, [ρσ_desugar_kwargs({string: "Date"})]);
        ResMessage.prototype.sender_id = ρσ_interpolate_kwargs.call(fields, fields.Many2one, ["res.users"].concat([ρσ_desugar_kwargs({string: "Sender"})]));
        ResMessage.prototype.recipient_id = ρσ_interpolate_kwargs.call(fields, fields.Many2one, ["res.users"].concat([ρσ_desugar_kwargs({string: "Recipient"})]));
        

        new ResMessage;
        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.message";
            ρσ_d["mode"] = "tree";
            ρσ_d["string"] = false;
            ρσ_d["arch"] = "\n<tree>\n    <field name=\"name\"/>\n</tree>\n";
            return ρσ_d;
        }).call(this));
        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.message";
            ρσ_d["mode"] = "form";
            ρσ_d["string"] = false;
            ρσ_d["arch"] = "\n<form>\n    <header>\n        <button name=\"send_message\" string=\"Send\"/>\n    </header>\n    <sheet>\n        <group>\n            <field name=\"name\"/>\n            <field name=\"sent\"/>\n        </group>\n        <group>\n            <field name=\"text\"/>\n        </group>\n    </sheet>\n</form>\n";
            return ρσ_d;
        }).call(this));
        function show_message(msg) {
            var d, s, m, h, listItem, mainSpan, icon, user, message;
            d = new Date(msg.date);
            s = d.getSeconds();
            m = d.getMinutes();
            h = d.getHours();
            if (s < 10) {
                s = "0" + s;
            }
            if (m < 10) {
                m = "0" + m;
            }
            if (h < 10) {
                h = "0" + h;
            }
            listItem = window.$$("<li class=\"mdl-list__item mdl-list__item--three-line\"></li>");
            mainSpan = window.$$("<span class=\"mdl-list__item-primary-content\"></span>");
            icon = window.$$("<i class=\"material-icons mdl-list__item-avatar\">&#xe7fd</i>");
            user = window.$$("<span></span>").text(msg.user);
            message = window.$$("<span class=\"mdl-list__item-text-body\"></span>").text(msg.message + " - " + h + ":" + m + ":" + s);
            mainSpan.append(icon);
            mainSpan.append(user);
            mainSpan.append(message);
            listItem.append(mainSpan);
            window.$$(".messages").append(listItem);
            window.document.querySelector(".page-content").scrollTop = window.$$(".chat-list-div").prop("scrollHeight");
        };
        if (!show_message.__argnames__) Object.defineProperties(show_message, {
            __argnames__ : {value: ["msg"]}
        });

        tools.show_message = show_message;
        function chat_init(page) {
            var preload;
            preload = loadApp();
            models.env["res.message"].search(ρσ_list_decorate([ "recipient_id", "=", false ])).then((function() {
                var ρσ_anonfunc = function (message_ids) {
                    message_ids.queue((function() {
                        var ρσ_anonfunc = function (message_id, next) {
                            show_message((function(){
                                var ρσ_d = {};
                                ρσ_d["user"] = "Administrator";
                                ρσ_d["message"] = message_id.text;
                                ρσ_d["date"] = message_id.date;
                                return ρσ_d;
                            }).call(this));
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["message_id", "next"]}
                        });
                        return ρσ_anonfunc;
                    })());
                    doneApp(preload);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["message_ids"]}
                });
                return ρσ_anonfunc;
            })()).catch((function() {
                var ρσ_anonfunc = function (error) {
                    console.log(error);
                    doneApp();
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["error"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!chat_init.__argnames__) Object.defineProperties(chat_init, {
            __argnames__ : {value: ["page"]}
        });

        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.message";
            ρσ_d["mode"] = "chat";
            ρσ_d["string"] = false;
            ρσ_d["init"] = chat_init;
            ρσ_d["arch"] = "\n          <div data-page=\"res.message.chat\" class=\"page\">\n \n            <!-- Top Navbar. In Material theme it should be inside of the page-->\n            <div class=\"navbar\">\n              <div class=\"navbar-inner\">\n                <div class=\"left\">\n                  <a href=\"#\" data-panel=\"left\" class=\"open-panel link icon-only\">\n                    <i class=\"icon icon-bars\"></i>\n                  </a>\n                </div>\n                <div class=\"center\">Home</div>\n                <!--<div class=\"right\">\n                  <a href=\"#\" data-panel=\"left\" class=\"open-panel link icon-only\">\n                    <i class=\"icon icon-bars\"></i>\n                  </a>\n                </div>-->\n              </div>\n            </div>\n\n  <a class=\"floating-button\" onclick=\"loadPage(mainView, 'res.message.users');\" href=\"#\">\n    <i class=\"material-icons mdl-list__item-avatar\" style=\"background-color: transparent;\">&#xe851</i>\n  </a>\n\n            <!-- Scrollable page content -->\n            <div class=\"page-content\" style=\"padding-top: 56px\">\n              \n              <main>\n                <div>\n\n                    <section class=\"chat-area mdl-grid\" style=\"padding-bottom: 196px\">\n                        <div class=\"mdl-cell mdl-cell--9-col\" id=\"chat-cell\">\n                          <div class=\"chat-list-div\">\n                            <ul class=\"listborder mdl-list messages\"></ul>\n                          </div>\n                        </div>\n                        <!--<div class=\"user-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--2-col mdl-cell--1-offset mdl-cell--hide-phone mdl-cell--hide-tablet\" style=\"margin: 0; min-width: 200px;\">\n                            <div class=\"mdl-card__title\">\n                                <h2 class=\"mdl-card__title-text\">Users</h2>\n                            </div>\n                            <div class=\"user-list-div\">\n                                <ul class=\"listborder mdl-list\" id=\"users\">\n                                </ul>\n                            </div>\n\n                        </div>-->\n                    </section>\n\n                    <section class=\"message-area mdl-grid\">\n                        <div class=\"mdl-cell mdl-cell--12-col\">\n                            <div class=\"message-card mdl-card mdl-grid mdl-shadow--2dp\" style=\"min-width: 100%; position: fixed; left: 0; bottom: 0;\">\n                                <!--<div class=\"message-box mdl-cell mdl-cell--11-col\">\n                                    <form action=\"\" id=\"send-message-form\">\n                                        <div class=\"message-field mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n                                            <input class=\"mdl-textfield__input\" autocomplete=\"off\" type=\"text\" id=\"send-message-form-input\">\n                                            <label class=\"mdl-textfield__label\" for=\"send-message-form-input\">Message</label>\n                                        </div>\n                                    </form>\n                                </div>\n                                <div class=\"send-button mdl-cell mdl-cell--1-col\">\n                                    <button id=\"send-message-button\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-button--raised mdl-js-ripple-effect\">Send</button>\n                                </div>-->\n                                <div class=\"list-block\">\n                    <div class=\"item-content\">\n                      <div>\n                        <div class=\"item-input\">\n                          <input type=\"text\" placeholder=\"Message\" id=\"homepage_chat_message\">\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                                <div class=\"item-content\" style=\"margin-top: 40px; margin-left: 10px; margin-right: 100%;\">\n                    <div class=\"button button-fill button-raised\" onclick=\"models.env['res.message'].create({'sender_id': models.env.user.id, 'text': getValue('homepage_chat_message'), 'name': 'Chat'}).then(function(result) {setValue('homepage_chat_message', ''); if (result.length > 0) result.send_message()})\">Send</div>\n                  </div>\n                            </div>\n                            \n                        </div>\n                    </section>\n                </div>\n              </main>\n                \n            </div>\n          </div>\n";
            return ρσ_d;
        }).call(this));
        function users_init(page) {
            var preload, element;
            preload = loadApp();
            element = "\n        <div class=\"item-media\"><i class=\"material-icons mdl-list__item-avatar\">&#xe7fd</i></div>\n        <div class=\"item-inner\">\n          <div class=\"item-title\">{}</div>\n        </div>\n    ";
            models.env["res.users"].search().then((function() {
                var ρσ_anonfunc = function (user_ids) {
                    user_ids.queue((function() {
                        var ρσ_anonfunc = function (user_id, next) {
                            var li, div;
                            if ((user_id.id === models.env.user.id || typeof user_id.id === "object" && ρσ_equals(user_id.id, models.env.user.id))) {
                                return next();
                            }
                            li = document.createElement("li");
                            div = document.createElement("div");
                            div.className = "item-content";
                            div.onclick = function () {
                                console.log(user_id);
                                models.env.context.active_id = user_id;
                                loadPage(mainView, "res.message.private");
                            };
                            div.innerHTML += str.format(element, user_id.name);
                            li.appendChild(div);
                            document.querySelector("ul.message-users").appendChild(li);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["user_id", "next"]}
                        });
                        return ρσ_anonfunc;
                    })());
                    doneApp(preload);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["user_ids"]}
                });
                return ρσ_anonfunc;
            })()).catch((function() {
                var ρσ_anonfunc = function (error) {
                    console.log(error);
                    doneApp(preload);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["error"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!users_init.__argnames__) Object.defineProperties(users_init, {
            __argnames__ : {value: ["page"]}
        });

        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.message";
            ρσ_d["mode"] = "users";
            ρσ_d["string"] = false;
            ρσ_d["init"] = users_init;
            ρσ_d["arch"] = "\n<div data-page=\"res.message.users\" class=\"page\">\n\n            <!-- Top Navbar. In Material theme it should be inside of the page-->\n            <div class=\"navbar\">\n              <div class=\"navbar-inner\">\n                <div class=\"left\">\n                  <a class=\"back link icon-only\"><i class=\"icon icon-back\"></i></a>\n                </div>\n                <div class=\"center\">Users</div>\n                <!--<div class=\"right\">\n                  <a href=\"#\" data-panel=\"left\" class=\"open-panel link icon-only\">\n                    <i class=\"icon icon-bars\"></i>\n                  </a>\n                </div>-->\n              </div>\n            </div>\n<div class=\"page-content\" style=\"padding-top: 24px\">\n\n    <div class=\"list-block\">\n      <ul class=\"message-users\">\n      </ul>\n    </div>\n\n</div>\n</div>\n";
            return ρσ_d;
        }).call(this));
        function private_init(page) {
            var preload, messages, user_ids;
            preload = loadApp();
            messages = myApp.messages(".messages-container", (function(){
                var ρσ_d = {};
                ρσ_d["autoLayout"] = true;
                return ρσ_d;
            }).call(this));
            user_ids = ρσ_list_decorate([ models.env.user.id, models.env.context.active_id.id ]);
            models.env["res.message"].search(ρσ_list_decorate([ "sender_id", "in", user_ids ]), ρσ_list_decorate([ "recipient_id", "in", user_ids ])).then((function() {
                var ρσ_anonfunc = function (message_ids) {
                    window.recent_messages = ρσ_list_decorate([]);
                    message_ids.sort_by("date").queue((function() {
                        var ρσ_anonfunc = function (message_id, next) {
                            return ρσ_interpolate_kwargs.call(models.env["res.users"], models.env["res.users"].with_context, [ρσ_desugar_kwargs({no_preload: true})]).browse(message_id.sender_id).then((function() {
                                var ρσ_anonfunc = function (user_id) {
                                    window.recent_messages.push((function(){
                                        var ρσ_d = {};
                                        ρσ_d["name"] = user_id.name;
                                        ρσ_d["text"] = message_id.text;
                                        ρσ_d["date"] = new Date(message_id.date).toLocaleString();
                                        ρσ_d["type"] = ((models.env.user.id !== message_id.sender_id && (typeof models.env.user.id !== "object" || ρσ_not_equals(models.env.user.id, message_id.sender_id)))) ? "received" : "sent";
                                        return ρσ_d;
                                    }).call(this));
                                    return next();
                                };
                                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                    __argnames__ : {value: ["user_id"]}
                                });
                                return ρσ_anonfunc;
                            })());
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["message_id", "next"]}
                        });
                        return ρσ_anonfunc;
                    })()).then(function () {
                        messages.addMessages(window.recent_messages, "append", false);
                        doneApp(preload);
                    });
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["message_ids"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!private_init.__argnames__) Object.defineProperties(private_init, {
            __argnames__ : {value: ["page"]}
        });

        view.add((function(){
            var ρσ_d = {};
            ρσ_d["model"] = "res.message";
            ρσ_d["mode"] = "private";
            ρσ_d["string"] = false;
            ρσ_d["init"] = private_init;
            ρσ_d["arch"] = "\n<div data-page=\"res.message.private\" class=\"page\">\n\n            <!-- Top Navbar. In Material theme it should be inside of the page-->\n            <div class=\"navbar\">\n              <div class=\"navbar-inner\">\n                <div class=\"left\">\n                  <a class=\"back link icon-only\"><i class=\"icon icon-back\"></i></a>\n                </div>\n                <div class=\"center\">Message</div>\n                <!--<div class=\"right\">\n                  <a href=\"#\" data-panel=\"left\" class=\"open-panel link icon-only\">\n                    <i class=\"icon icon-bars\"></i>\n                  </a>\n                </div>-->\n              </div>\n            </div>\n\n  <div class=\"toolbar messagebar\" style=\"background-color: #fff !important\">\n    <div class=\"toolbar-inner\">\n      <textarea placeholder=\"Message\" id=\"private_text_message\"></textarea><a href=\"#\" class=\"link\" onclick=\"models.env['res.message'].create({'sender_id': models.env.user.id, 'recipient_id': models.env.context.active_id.id, 'text': getValue('private_text_message'), 'name': 'Message'}).then(function(result) {setValue('private_text_message', ''); if (result.length > 0) result.send_message()})\">Send</a>\n    </div>\n  </div>\n\n<div class=\"page-content\">\n\n    <div class=\"messages-container\" style=\"padding-bottom: 60px\">\n    </div>\n\n</div>\n</div>\n";
            return ρσ_d;
        }).call(this));
        if (typeof window !== 'undefined') {
            interval = setInterval(function () {
                if (typeof user_socket === 'undefined') {
                    return;
                }
                user_socket.on("private-message", (function() {
                    var ρσ_anonfunc = function (message) {
                        var container;
                        message.date = new Date(message.date).toLocaleString();
                        container = document.querySelector(".messages-container");
                        if ((container !== null && (typeof container !== "object" || ρσ_not_equals(container, null)))) {
                            container.f7Messages.addMessage(message);
                        }
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["message"]}
                    });
                    return ρσ_anonfunc;
                })());
                clearInterval(interval);
            }, 500);
        }
        ρσ_modules["res.message"].interval = interval;
        ρσ_modules["res.message"].ResMessage = ResMessage;
        ρσ_modules["res.message"].show_message = show_message;
        ρσ_modules["res.message"].chat_init = chat_init;
        ρσ_modules["res.message"].users_init = users_init;
        ρσ_modules["res.message"].private_init = private_init;
    })();

    (function(){
        var __name__ = "res.modules";
        var res = ρσ_modules.res;
        res.config = ρσ_modules["res.config"];

        var res = ρσ_modules.res;
        res.debug = ρσ_modules["res.debug"];

        var res = ρσ_modules.res;
        res.users = ρσ_modules["res.users"];

        var res = ρσ_modules.res;
        res.partner = ρσ_modules["res.partner"];

        var res = ρσ_modules.res;
        res.message = ρσ_modules["res.message"];

    })();

    (function(){
        var __name__ = "modules";
        var res = ρσ_modules.res;
        res.modules = ρσ_modules["res.modules"];

    })();

    (function(){
        var __name__ = "modules.modules";
        var res = ρσ_modules.res;
        res.modules = ρσ_modules["res.modules"];

    })();

    (function(){
        var __name__ = "orm.http";
        var restify, server, cors, _controllers;
        var exist = ρσ_modules["orm.tools"].exist;
        var keys = ρσ_modules["orm.tools"].keys;
        var configuration = ρσ_modules["orm.tools"].configuration;

        configuration.port = 8069;
        configuration.local_app = false;
        restify = require("restify");
        server = restify.createServer();
        cors = require("restify-cors-middleware")((function(){
            var ρσ_d = {};
            ρσ_d["origins"] = ρσ_list_decorate([ "*" ]);
            return ρσ_d;
        }).call(this));
        server.pre(cors.preflight);
        server.use(cors.actual);
        server.use(restify.plugins.bodyParser((function(){
            var ρσ_d = {};
            ρσ_d["mapParams"] = true;
            return ρσ_d;
        }).call(this)));
        server.use(restify.plugins.queryParser());
        function parse(params) {
            var key;
            var ρσ_Iter0 = ρσ_Iterable(keys(params));
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                key = ρσ_Iter0[ρσ_Index0];
                try {
                    params[(typeof key === "number" && key < 0) ? params.length + key : key] = JSON.parse(params[(typeof key === "number" && key < 0) ? params.length + key : key]);
                } catch (ρσ_Exception) {
                    ρσ_last_exception = ρσ_Exception;
                    {
                    } 
                }
            }
            return params;
        };
        if (!parse.__argnames__) Object.defineProperties(parse, {
            __argnames__ : {value: ["params"]}
        });

        _controllers = {};
        function route() {
            var routing = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var method = Array.prototype.slice.call(arguments, 1);
            if (arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) method.pop();
            function apply() {
                if (!(ρσ_in(routing, _controllers))) {
                    _controllers[(typeof routing === "number" && routing < 0) ? _controllers.length + routing : routing] = ρσ_list_decorate([]);
                    _controllers[(typeof routing === "number" && routing < 0) ? _controllers.length + routing : routing].push(method);
                }
            };

            apply();
            return function () {
                return;
            };
        };
        if (!route.__handles_kwarg_interpolation__) Object.defineProperties(route, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["routing"]}
        });

        function Controller() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            Controller.prototype.__init__.apply(this, arguments);
        }
        Controller.prototype.__init__ = function __init__() {
            var self = this;
            var key;
            var ρσ_Iter1 = ρσ_Iterable(keys(_controllers));
            for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                key = ρσ_Iter1[ρσ_Index1];
                if ((key !== "/api/login" && (typeof key !== "object" || ρσ_not_equals(key, "/api/login")))) {
                    _controllers[(typeof key === "number" && key < 0) ? _controllers.length + key : key].unshift(_controllers["/api/login"][0][0]);
                }
                server.post(key, _controllers[(typeof key === "number" && key < 0) ? _controllers.length + key : key]);
                server.get(key, _controllers[(typeof key === "number" && key < 0) ? _controllers.length + key : key]);
            }
            if ((configuration.local_app === true || typeof configuration.local_app === "object" && ρσ_equals(configuration.local_app, true))) {
                if ((configuration.serverless !== true && (typeof configuration.serverless !== "object" || ρσ_not_equals(configuration.serverless, true)))) {
                    server.get("/\\/(.*)?.*/", restify.plugins.serveStatic((function(){
                        var ρσ_d = {};
                        ρσ_d["directory"] = "./client";
                        ρσ_d["default"] = "index.html";
                        return ρσ_d;
                    }).call(this)));
                } else {
                    _controllers["/api/web"] = ρσ_list_decorate([ restify.plugins.serveStatic((function(){
                        var ρσ_d = {};
                        ρσ_d["directory"] = "./client";
                        ρσ_d["default"] = "index.html";
                        return ρσ_d;
                    }).call(this)) ]);
                }
            }
        };
        if (!Controller.prototype.__init__.__argnames__) Object.defineProperties(Controller.prototype.__init__, {
            __argnames__ : {value: []}
        });
        Controller.__argnames__ = Controller.prototype.__init__.__argnames__;
        Controller.__handles_kwarg_interpolation__ = Controller.prototype.__init__.__handles_kwarg_interpolation__;
        Controller.prototype.run = function run() {
            var self = this;
            console.log("Running on port " + configuration.port);
            server.listen(configuration.port);
        };
        if (!Controller.prototype.run.__argnames__) Object.defineProperties(Controller.prototype.run, {
            __argnames__ : {value: []}
        });
        Controller.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        Controller.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(Controller.prototype, "__bases__", {value: []});

        ρσ_modules["orm.http"].restify = restify;
        ρσ_modules["orm.http"].server = server;
        ρσ_modules["orm.http"].cors = cors;
        ρσ_modules["orm.http"]._controllers = _controllers;
        ρσ_modules["orm.http"].parse = parse;
        ρσ_modules["orm.http"].route = route;
        ρσ_modules["orm.http"].Controller = Controller;
    })();

    (function(){
        var __name__ = "res.controllers";
        var socket;
        var http = ρσ_modules["orm.http"];

        var models = ρσ_modules["orm.models"];

        socket = require("socket.io")(http.server.server);
        models.env.context.sockets = {};
        models.env["res.users"].search().then((function() {
            var ρσ_anonfunc = function (user_ids) {
                var user_socket, user_id;
                var ρσ_Iter0 = ρσ_Iterable(user_ids);
                for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                    user_id = ρσ_Iter0[ρσ_Index0];
                    user_socket = socket.of("/" + user_id.id);
                    (ρσ_expr_temp = models.env.context.sockets)[ρσ_bound_index(user_id.id, ρσ_expr_temp)] = user_socket;
                    user_socket.on("connection", (function() {
                        var ρσ_anonfunc = function (socket) {
                            console.log("User " + user_id.login + " connected");
                            socket.on("disconnect", function () {
                                console.log("User " + user_id.login + " disconnected");
                            });
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["socket"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["user_ids"]}
            });
            return ρσ_anonfunc;
        })());
        models.env.context.socket = socket;
        ρσ_modules["res.controllers"].socket = socket;
    })();

    (function(){
        var __name__ = "modules.controllers";
        var res = ρσ_modules.res;
        res.controllers = ρσ_modules["res.controllers"];

    })();

    (function(){

        var __name__ = "__main__";


        var configuration, admin_password, client_js, client_js_time, crypto, controller, serverless_route, route;
        var modules = ρσ_modules.modules;
        modules.modules = ρσ_modules["modules.modules"];

        var modules = ρσ_modules.modules;
        modules.controllers = ρσ_modules["modules.controllers"];

        var http = ρσ_modules["orm.http"];

        var env = ρσ_modules["orm.models"].env;
        var setSchema = ρσ_modules["orm.models"].setSchema;

        var exist = ρσ_modules["orm.tools"].exist;
        var configuration = ρσ_modules["orm.tools"].configuration;
        var merge = ρσ_modules["orm.tools"].merge;

        var check_admin = ρσ_modules["res.users"].check_admin;
        var admin_password = ρσ_modules["res.users"].admin_password;

        setSchema();
        configuration = merge(configuration, (function() {
            var ρσ_Iter = ρσ_Iterable(Object.entries(require("process").env)), ρσ_Result = {}, key, value;
            for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                ρσ_unpack = ρσ_Iter[ρσ_Index];
                key = ρσ_unpack[0];
                value = ρσ_unpack[1];
                ρσ_Result[key] = ((ρσ_in(value, ρσ_list_decorate([ "True", "true" ]))) ? true : (ρσ_in(value, ρσ_list_decorate([ "False", "false" ]))) ? false : value);
            }
            return ρσ_Result;
        })());
        admin_password = configuration.admin_password;
        check_admin();
        client_js = require("child_process").execSync(((!(ρσ_in(".exe", require("process").execPath))) ? require("process").execPath : "node") + " node_modules/rapydscript-ng/bin/rapydscript -p modules/ client.pyj", (function(){
            var ρσ_d = {};
            ρσ_d["env"] = require("process").env;
            return ρσ_d;
        }).call(this)).toString();
        client_js = client_js.replace("{\"home_view\": window.localStorage.rapyd_home_view || \"res.message.chat\"}", JSON.stringify(configuration));
        client_js_time = (new Date).toISOString();
        crypto = require("crypto");
        function encrypt(string) {
            var cipher;
            cipher = crypto.createCipher("aes-256-cbc", configuration.master_password);
            string = cipher.update(string, "utf-8", "hex");
            string += cipher.final("hex");
            return string;
        };
        if (!encrypt.__argnames__) Object.defineProperties(encrypt, {
            __argnames__ : {value: ["string"]}
        });

        function decrypt(string) {
            var decipher;
            decipher = crypto.createDecipher("aes-256-cbc", configuration.master_password);
            string = decipher.update(string, "hex", "utf-8");
            string += decipher.final("utf-8");
            return string;
        };
        if (!decrypt.__argnames__) Object.defineProperties(decrypt, {
            __argnames__ : {value: ["string"]}
        });

        http.route("/api/login", (function() {
            var ρσ_anonfunc = function (request, result, next) {
                var params, ρσ_unpack;
                request.env = env;
                result.response = (function(){
                    var ρσ_d = {};
                    ρσ_d["status"] = "denied";
                    return ρσ_d;
                }).call(this);
                request.params = Object.assign(request.params, request.query, request.body || {});
                params = http.parse(request.params);
                if (exist(request.params.login)) {
                    if ((params.encrypted === true || typeof params.encrypted === "object" && ρσ_equals(params.encrypted, true))) {
                        ρσ_unpack = [decrypt(params.login), decrypt(params.password)];
                        params.login = ρσ_unpack[0];
                        params.password = ρσ_unpack[1];
                    }
                    ρσ_interpolate_kwargs.call(request.env["res.users"], request.env["res.users"].with_context, [ρσ_desugar_kwargs({limit: 1})]).search(ρσ_list_decorate([ "login", "=", params.login ]), ρσ_list_decorate([ "password", "=", params.password ])).then((function() {
                        var ρσ_anonfunc = function (user_id) {
                            var ρσ_unpack;
                            if (exist(user_id)) {
                                request.env.context.user = user_id;
                                result.response = (function(){
                                    var ρσ_d = {};
                                    ρσ_d["status"] = "success";
                                    return ρσ_d;
                                }).call(this);
                                if (params.authentication = true) {
                                    ρσ_unpack = [encrypt(params.login), encrypt(params.password)];
                                    result.response.login = ρσ_unpack[0];
                                    result.response.password = ρσ_unpack[1];
                                    result.response.id = user_id.id;
                                    if (!exist(params.client_js_time) || (params.client_js_time !== client_js_time && (typeof params.client_js_time !== "object" || ρσ_not_equals(params.client_js_time, client_js_time)))) {
                                        result.response.client_js = client_js;
                                        result.response.client_js_time = client_js_time;
                                    }
                                }
                            }
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["user_id"]}
                        });
                        return ρσ_anonfunc;
                    })()).catch((function() {
                        var ρσ_anonfunc = function (error) {
                            console.log(error.stack);
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "error";
                                ρσ_d["error"] = error;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["error"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    next();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })(), (function() {
            var ρσ_anonfunc = function (request, result, next) {
                return result.send(result.response);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })());
        http.route("/api/browse", (function() {
            var ρσ_anonfunc = function (request, result, next) {
                var params;
                if ((result.response.status !== "success" && (typeof result.response.status !== "object" || ρσ_not_equals(result.response.status, "success")))) {
                    next();
                }
                params = request.params;
                if (exist(request.params)) {
                    (ρσ_expr_temp = request.env)[ρσ_bound_index(params.model, ρσ_expr_temp)].browse(params.ids).then((function() {
                        var ρσ_anonfunc = function (record) {
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "success";
                                ρσ_d["values"] = record.values;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["record"]}
                        });
                        return ρσ_anonfunc;
                    })()).catch((function() {
                        var ρσ_anonfunc = function (error) {
                            console.log(error);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["error"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    next();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })(), (function() {
            var ρσ_anonfunc = function (request, result, next) {
                return result.send(result.response);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })());
        http.route("/api/search", (function() {
            var ρσ_anonfunc = function (request, result, next) {
                var params, options;
                if ((result.response.status !== "success" && (typeof result.response.status !== "object" || ρσ_not_equals(result.response.status, "success")))) {
                    next();
                }
                params = request.params;
                if (exist(request.params)) {
                    options = params.options || {};
                    (ρσ_expr_temp = ρσ_interpolate_kwargs.call((ρσ_expr_temp = request.env)[ρσ_bound_index(params.model, ρσ_expr_temp)], (ρσ_expr_temp = request.env)[ρσ_bound_index(params.model, ρσ_expr_temp)].with_context, [ρσ_desugar_kwargs(options)]), ρσ_expr_temp.search.apply(ρσ_expr_temp, params.args)).then((function() {
                        var ρσ_anonfunc = function (record) {
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "success";
                                ρσ_d["values"] = record.values;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["record"]}
                        });
                        return ρσ_anonfunc;
                    })()).catch((function() {
                        var ρσ_anonfunc = function (error) {
                            console.log(error);
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "error";
                                ρσ_d["error"] = error;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["error"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    next();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })(), (function() {
            var ρσ_anonfunc = function (request, result, next) {
                return result.send(result.response);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })());
        http.route("/api/create", (function() {
            var ρσ_anonfunc = function (request, result, next) {
                var params;
                if ((result.response.status !== "success" && (typeof result.response.status !== "object" || ρσ_not_equals(result.response.status, "success")))) {
                    next();
                }
                params = request.params;
                if (exist(request.params)) {
                    (ρσ_expr_temp = request.env)[ρσ_bound_index(params.model, ρσ_expr_temp)].create(params.values).then((function() {
                        var ρσ_anonfunc = function (record) {
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "success";
                                ρσ_d["values"] = record.values;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["record"]}
                        });
                        return ρσ_anonfunc;
                    })()).catch((function() {
                        var ρσ_anonfunc = function (error) {
                            console.log(error);
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "error";
                                ρσ_d["error"] = error;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["error"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    next();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })(), (function() {
            var ρσ_anonfunc = function (request, result, next) {
                return result.send(result.response);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })());
        http.route("/api/write", (function() {
            var ρσ_anonfunc = function (request, result, next) {
                var params;
                if ((result.response.status !== "success" && (typeof result.response.status !== "object" || ρσ_not_equals(result.response.status, "success")))) {
                    next();
                }
                params = request.params;
                if (exist(request.params)) {
                    (ρσ_expr_temp = request.env)[ρσ_bound_index(params.model, ρσ_expr_temp)].browse(params.ids).then((function() {
                        var ρσ_anonfunc = function (record) {
                            record.write(params.values).then((function() {
                                var ρσ_anonfunc = function (record) {
                                    result.response = (function(){
                                        var ρσ_d = {};
                                        ρσ_d["status"] = "success";
                                        ρσ_d["values"] = record.values;
                                        return ρσ_d;
                                    }).call(this);
                                    next();
                                };
                                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                    __argnames__ : {value: ["record"]}
                                });
                                return ρσ_anonfunc;
                            })());
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["record"]}
                        });
                        return ρσ_anonfunc;
                    })()).catch((function() {
                        var ρσ_anonfunc = function (error) {
                            console.log(error);
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "error";
                                ρσ_d["error"] = error;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["error"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    next();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })(), (function() {
            var ρσ_anonfunc = function (request, result, next) {
                return result.send(result.response);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })());
        http.route("/api/unlink", (function() {
            var ρσ_anonfunc = function (request, result, next) {
                var params;
                if ((result.response.status !== "success" && (typeof result.response.status !== "object" || ρσ_not_equals(result.response.status, "success")))) {
                    next();
                }
                params = request.params;
                if (exist(request.params)) {
                    (ρσ_expr_temp = request.env)[ρσ_bound_index(params.model, ρσ_expr_temp)].browse(params.ids).then((function() {
                        var ρσ_anonfunc = function (record) {
                            record.unlink().then(function () {
                                result.response = (function(){
                                    var ρσ_d = {};
                                    ρσ_d["status"] = "success";
                                    return ρσ_d;
                                }).call(this);
                                next();
                            });
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["record"]}
                        });
                        return ρσ_anonfunc;
                    })()).catch((function() {
                        var ρσ_anonfunc = function (error) {
                            console.log(error);
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "error";
                                ρσ_d["error"] = error;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["error"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    next();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })(), (function() {
            var ρσ_anonfunc = function (request, result, next) {
                return result.send(result.response);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })());
        http.route("/api/methods", (function() {
            var ρσ_anonfunc = function (request, result, next) {
                var params;
                if ((result.response.status !== "success" && (typeof result.response.status !== "object" || ρσ_not_equals(result.response.status, "success")))) {
                    next();
                }
                params = request.params;
                if (exist(request.params)) {
                    (ρσ_expr_temp = request.env)[ρσ_bound_index(params.model, ρσ_expr_temp)].browse(params.ids).then((function() {
                        var ρσ_anonfunc = function (record) {
                            var args;
                            args = (params.args) ? params.args : ρσ_list_decorate([]);
                            return record[ρσ_bound_index(params.method, record)].apply(record, args).then((function() {
                                var ρσ_anonfunc = function (record) {
                                    result.response = (function(){
                                        var ρσ_d = {};
                                        ρσ_d["status"] = "success";
                                        ρσ_d["values"] = record.values;
                                        return ρσ_d;
                                    }).call(this);
                                    next();
                                };
                                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                    __argnames__ : {value: ["record"]}
                                });
                                return ρσ_anonfunc;
                            })());
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["record"]}
                        });
                        return ρσ_anonfunc;
                    })()).catch((function() {
                        var ρσ_anonfunc = function (error) {
                            console.log(error);
                            result.response = (function(){
                                var ρσ_d = {};
                                ρσ_d["status"] = "error";
                                ρσ_d["error"] = error;
                                return ρσ_d;
                            }).call(this);
                            next();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["error"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else {
                    next();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })(), (function() {
            var ρσ_anonfunc = function (request, result, next) {
                return result.send(result.response);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "result", "next"]}
            });
            return ρσ_anonfunc;
        })());
        controller = new http.Controller;
        if (!configuration.serverless) {
            controller.run();
        } else {
            serverless_route = {};
            var ρσ_Iter0 = ρσ_Iterable(http._controllers);
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                route = ρσ_Iter0[ρσ_Index0];
                console.log(route);
                serverless_route[(typeof route === "number" && route < 0) ? serverless_route.length + route : route] = (function() {
                    var ρσ_anonfunc = function (request, result, route) {
                        var functions, index;
                        functions = ρσ_list_decorate([]);
                        ((function() {
                            var ρσ_anonfunc = function recurse(methods) {
                                var method;
                                var ρσ_Iter1 = ρσ_Iterable(methods);
                                for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                                    method = ρσ_Iter1[ρσ_Index1];
                                    if (ρσ_equals(type(method), Array)) {
                                        recurse(method);
                                    } else {
                                        functions.push(method);
                                    }
                                }
                            };
                            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                __argnames__ : {value: ["methods"]}
                            });
                            return ρσ_anonfunc;
                        })())((ρσ_expr_temp = http._controllers)[(typeof route === "number" && route < 0) ? ρσ_expr_temp.length + route : route]);
                        index = 0;
                        function next(arg) {
                            if (arg instanceof Error) {throw arg;};
                            index += 1;
                            if (index < functions.length && exist(functions[(typeof index === "number" && index < 0) ? functions.length + index : index])) {
                                console.log(functions[(typeof index === "number" && index < 0) ? functions.length + index : index].toString());
                                functions[(typeof index === "number" && index < 0) ? functions.length + index : index](request, result, next);
                            }
                        };
                        if (!next.__argnames__) Object.defineProperties(next, {
                            __argnames__ : {value: ["arg"]}
                        });

                        console.log(functions[(typeof index === "number" && index < 0) ? functions.length + index : index].toString());
                        functions[(typeof index === "number" && index < 0) ? functions.length + index : index](request, result, next);
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["request", "result", "route"]}
                    });
                    return ρσ_anonfunc;
                })();
            }
            exports.api = (function() {
                var ρσ_anonfunc = function (request, result) {
                    var path, routing, route;
                    path = request.path;
                    console.log(path);
                    routing = "/api/" + path.split("/")[1];
                    route = serverless_route[(typeof routing === "number" && routing < 0) ? serverless_route.length + routing : routing];
                    if (exist(route)) {
                        Object.defineProperty(request, "path", (function(){
                            var ρσ_d = {};
                            ρσ_d["get"] = function () {
                                if (!(ρσ_in("/web", path))) {
                                    return path;
                                }
                                return function () {
                                    return path.slice(5);
                                };
                            };
                            return ρσ_d;
                        }).call(this));
                        route(request, result, routing);
                    } else {
                        result.send((function(){
                            var ρσ_d = {};
                            ρσ_d["status"] = "error";
                            ρσ_d["error"] = (function(){
                                var ρσ_d = {};
                                ρσ_d["message"] = "URL not found";
                                return ρσ_d;
                            }).call(this);
                            return ρσ_d;
                        }).call(this));
                    }
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["request", "result"]}
                });
                return ρσ_anonfunc;
            })();
        }
    })();
})();

