var content = (function() {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  function defineContentScript(definition2) {
    return definition2;
  }
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var browserPolyfill$1 = { exports: {} };
  var browserPolyfill = browserPolyfill$1.exports;
  var hasRequiredBrowserPolyfill;
  function requireBrowserPolyfill() {
    if (hasRequiredBrowserPolyfill) return browserPolyfill$1.exports;
    hasRequiredBrowserPolyfill = 1;
    (function(module, exports$1) {
      (function(global, factory) {
        {
          factory(module);
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : browserPolyfill, function(module2) {
        if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(req, {}, {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                });
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result2;
                try {
                  result2 = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result2 = Promise.reject(err);
                }
                const isResultThenable = result2 !== true && isThenable(result2);
                if (result2 !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result2);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    })(browserPolyfill$1);
    return browserPolyfill$1.exports;
  }
  var browserPolyfillExports = requireBrowserPolyfill();
  const originalBrowser = /* @__PURE__ */ getDefaultExportFromCjs(browserPolyfillExports);
  const browser = originalBrowser;
  function extractElementInfo(el) {
    const htmlEl = el;
    const inputEl = el;
    const anchorEl = el;
    const imgEl = el;
    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id || "",
      className: el.className || "",
      textContent: (htmlEl.textContent || "").trim().slice(0, 500),
      ...anchorEl.href ? { href: anchorEl.href } : {},
      ...imgEl.src ? { src: imgEl.src } : {},
      ...inputEl.value !== void 0 && inputEl.value !== "" ? { value: inputEl.value } : {},
      ...inputEl.type ? { type: inputEl.type } : {},
      ...inputEl.placeholder ? { placeholder: inputEl.placeholder } : {}
    };
  }
  function findElement(selector, text) {
    var _a;
    if (text) {
      const candidates = document.querySelectorAll(selector);
      for (const el of candidates) {
        if ((_a = el.textContent) == null ? void 0 : _a.includes(text)) {
          return el;
        }
      }
      return null;
    }
    return document.querySelector(selector);
  }
  function executeClick(action) {
    if (!action.selector) {
      return { success: false, error: "click 操作需要 selector 参数" };
    }
    const el = findElement(action.selector, action.text);
    if (!el) {
      return { success: false, error: `未找到元素: ${action.selector}${action.text ? ` (text: "${action.text}")` : ""}` };
    }
    el.click();
    return { success: true, data: { clicked: action.selector } };
  }
  function executeType(action) {
    var _a;
    if (!action.selector) {
      return { success: false, error: "type 操作需要 selector 参数" };
    }
    if (action.value === void 0) {
      return { success: false, error: "type 操作需要 value 参数" };
    }
    const el = findElement(action.selector);
    if (!el) {
      return { success: false, error: `未找到元素: ${action.selector}` };
    }
    el.focus();
    el.value = "";
    el.dispatchEvent(new Event("input", { bubbles: true }));
    const nativeInputValueSetter = (_a = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(el),
      "value"
    )) == null ? void 0 : _a.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(el, action.value);
    } else {
      el.value = action.value;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return { success: true, data: { typed: action.value, selector: action.selector } };
  }
  function executeScroll(action) {
    const mode = action.scrollMode || "by-pixels";
    switch (mode) {
      case "to-top":
        window.scrollTo({ top: 0, behavior: "smooth" });
        return { success: true, data: { scrolled: "to-top" } };
      case "to-bottom":
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        return { success: true, data: { scrolled: "to-bottom" } };
      case "by-pixels": {
        const pixels = action.scrollPixels || 300;
        window.scrollBy({ top: pixels, behavior: "smooth" });
        return { success: true, data: { scrolled: "by-pixels", pixels } };
      }
      case "to-element": {
        if (!action.selector) {
          return { success: false, error: "scroll to-element 模式需要 selector 参数" };
        }
        const el = document.querySelector(action.selector);
        if (!el) {
          return { success: false, error: `未找到元素: ${action.selector}` };
        }
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return { success: true, data: { scrolled: "to-element", selector: action.selector } };
      }
      default:
        return { success: false, error: `不支持的滚动模式: ${mode}` };
    }
  }
  function executeQuerySelector(action) {
    if (!action.selector) {
      return { success: false, error: "querySelector 操作需要 selector 参数" };
    }
    const el = document.querySelector(action.selector);
    if (!el) {
      return { success: false, error: `未找到元素: ${action.selector}` };
    }
    return { success: true, data: extractElementInfo(el) };
  }
  function executeQuerySelectorAll(action) {
    if (!action.selector) {
      return { success: false, error: "querySelectorAll 操作需要 selector 参数" };
    }
    const elements = document.querySelectorAll(action.selector);
    const results = [];
    const limit = Math.min(elements.length, action.maxCount || 50);
    for (let i = 0; i < limit; i++) {
      results.push(extractElementInfo(elements[i]));
    }
    return { success: true, data: { count: elements.length, elements: results } };
  }
  function executeGetTextContent(action) {
    var _a;
    if (!action.selector) {
      return { success: false, error: "getTextContent 操作需要 selector 参数" };
    }
    const el = document.querySelector(action.selector);
    if (!el) {
      return { success: false, error: `未找到元素: ${action.selector}` };
    }
    return { success: true, data: { textContent: ((_a = el.textContent) == null ? void 0 : _a.trim()) || "" } };
  }
  function executeGetAttribute(action) {
    if (!action.selector) {
      return { success: false, error: "getAttribute 操作需要 selector 参数" };
    }
    if (!action.attributeName) {
      return { success: false, error: "getAttribute 操作需要 attributeName 参数" };
    }
    const el = document.querySelector(action.selector);
    if (!el) {
      return { success: false, error: `未找到元素: ${action.selector}` };
    }
    return { success: true, data: { attribute: action.attributeName, value: el.getAttribute(action.attributeName) } };
  }
  function executeGetValue(action) {
    if (!action.selector) {
      return { success: false, error: "getValue 操作需要 selector 参数" };
    }
    const el = document.querySelector(action.selector);
    if (!el) {
      return { success: false, error: `未找到元素: ${action.selector}` };
    }
    return { success: true, data: { value: el.value || "" } };
  }
  async function executeWaitForElement(action) {
    if (!action.selector) {
      return { success: false, error: "waitForElement 操作需要 selector 参数" };
    }
    const timeout = action.timeout || 5e3;
    const existing = document.querySelector(action.selector);
    if (existing) {
      return { success: true, data: extractElementInfo(existing) };
    }
    return new Promise((resolve) => {
      let resolved = false;
      const observer = new MutationObserver(() => {
        const el = document.querySelector(action.selector);
        if (el && !resolved) {
          resolved = true;
          observer.disconnect();
          resolve({ success: true, data: extractElementInfo(el) });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          observer.disconnect();
          resolve({ success: false, error: `等待元素超时 (${timeout}ms): ${action.selector}` });
        }
      }, timeout);
    });
  }
  function executeHighlight(action) {
    if (!action.selector) {
      return { success: false, error: "highlight 操作需要 selector 参数" };
    }
    const el = document.querySelector(action.selector);
    if (!el) {
      return { success: false, error: `未找到元素: ${action.selector}` };
    }
    const color = action.highlightColor || "rgba(255, 165, 0, 0.4)";
    const duration = action.highlightDuration || 2e3;
    const originalOutline = el.style.outline;
    const originalBgColor = el.style.backgroundColor;
    el.style.outline = `3px solid ${color}`;
    el.style.backgroundColor = color;
    setTimeout(() => {
      el.style.outline = originalOutline;
      el.style.backgroundColor = originalBgColor;
    }, duration);
    return { success: true, data: { highlighted: action.selector, duration } };
  }
  async function executeEvaluate(action) {
    if (!action.expression) {
      return { success: false, error: "evaluate 操作需要 expression 参数" };
    }
    try {
      const fn = new Function(action.expression);
      const result2 = await fn();
      const serialized = result2 === void 0 ? null : JSON.parse(JSON.stringify(result2));
      return { success: true, data: { result: serialized } };
    } catch (err) {
      return {
        success: false,
        error: `evaluate 执行失败: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }
  function executeSelectOption(action) {
    if (!action.selector) {
      return { success: false, error: "selectOption 操作需要 selector 参数" };
    }
    const el = document.querySelector(action.selector);
    if (!el) {
      return { success: false, error: `未找到元素: ${action.selector}` };
    }
    if (el.tagName.toLowerCase() !== "select") {
      return { success: false, error: `目标元素不是 <select>，而是 <${el.tagName.toLowerCase()}>` };
    }
    let matched = false;
    const options = el.options;
    if (action.optionValue !== void 0) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === action.optionValue) {
          el.selectedIndex = i;
          matched = true;
          break;
        }
      }
    } else if (action.optionText !== void 0) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].text.trim() === action.optionText.trim()) {
          el.selectedIndex = i;
          matched = true;
          break;
        }
      }
    } else {
      return { success: false, error: "selectOption 需要 optionValue 或 optionText 参数" };
    }
    if (!matched) {
      return {
        success: false,
        error: `未找到匹配的选项: ${action.optionValue !== void 0 ? `value="${action.optionValue}"` : `text="${action.optionText}"`}`
      };
    }
    el.dispatchEvent(new Event("change", { bubbles: true }));
    const selected = options[el.selectedIndex];
    return {
      success: true,
      data: {
        selectedIndex: el.selectedIndex,
        selectedValue: selected.value,
        selectedText: selected.text.trim()
      }
    };
  }
  function executeGetLinks(action) {
    const maxCount = action.maxCount || 100;
    const scope = action.selector ? document.querySelector(action.selector) : document;
    if (action.selector && !scope) {
      return { success: false, error: `未找到范围元素: ${action.selector}` };
    }
    const anchors = (scope || document).querySelectorAll("a[href]");
    const links = [];
    const limit = Math.min(anchors.length, maxCount);
    for (let i = 0; i < limit; i++) {
      const a = anchors[i];
      links.push({
        href: a.href,
        text: (a.textContent || "").trim().slice(0, 200)
      });
    }
    return {
      success: true,
      data: { totalFound: anchors.length, returned: links.length, links }
    };
  }
  const IMT_SKIP_TAGS = /* @__PURE__ */ new Set([
    "script",
    "style",
    "noscript",
    "iframe",
    "svg",
    "canvas",
    "nav",
    "footer",
    "header",
    "aside",
    "form",
    "button",
    "input",
    "textarea",
    "select",
    "label"
  ]);
  const IMT_PARAGRAPH_TAGS = /* @__PURE__ */ new Set([
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "li",
    "blockquote",
    "td",
    "th",
    "dt",
    "dd",
    "figcaption",
    "caption",
    "summary",
    "pre"
  ]);
  function detectMainContent() {
    const candidates = [
      "article",
      "main",
      '[role="main"]',
      ".content",
      ".post",
      ".article",
      ".post-content",
      ".entry-content",
      ".article-content",
      "#content"
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && el.textContent && el.textContent.trim().length > 100) {
        return el;
      }
    }
    return document.body;
  }
  function executeExtractParagraphs(action) {
    const scope = action.scopeSelector ? document.querySelector(action.scopeSelector) : detectMainContent();
    if (!scope) {
      return { success: false, error: `未找到范围元素: ${action.scopeSelector}` };
    }
    const maxCount = action.maxCount || 200;
    const paragraphs = [];
    let idCounter = 0;
    function walk(node) {
      if (paragraphs.length >= maxCount) {
        return;
      }
      const tag = node.tagName.toLowerCase();
      if (IMT_SKIP_TAGS.has(tag)) {
        return;
      }
      if (node instanceof HTMLElement) {
        const style = window.getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden") {
          return;
        }
      }
      if (node.classList.contains("imt-translation")) {
        return;
      }
      if (IMT_PARAGRAPH_TAGS.has(tag)) {
        const text = (node.textContent || "").trim();
        if (text.length >= 2) {
          const id = `imt-${idCounter++}`;
          node.setAttribute("data-imt-id", id);
          paragraphs.push({ id, tag, text: text.slice(0, 2e3) });
        }
        return;
      }
      for (let i = 0; i < node.children.length; i++) {
        walk(node.children[i]);
      }
    }
    walk(scope);
    return {
      success: true,
      data: {
        totalExtracted: paragraphs.length,
        scope: action.scopeSelector || "(auto-detected)",
        paragraphs
      }
    };
  }
  const IMT_STYLE_ID = "imt-bilingual-style";
  const IMT_CSS = `
.imt-translation {
  margin: 4px 0 12px 0;
  padding: 6px 12px;
  border-left: 3px solid #4287f5;
  background: rgba(66, 135, 245, 0.06);
  color: #555;
  font-size: 0.95em;
  line-height: 1.6;
  border-radius: 0 4px 4px 0;
  font-style: normal;
}
.imt-translation.imt-hidden {
  display: none;
}
`;
  function ensureImtStyle() {
    if (!document.getElementById(IMT_STYLE_ID)) {
      const styleEl = document.createElement("style");
      styleEl.id = IMT_STYLE_ID;
      styleEl.textContent = IMT_CSS;
      document.head.appendChild(styleEl);
    }
  }
  function executeInjectBilingual(action) {
    var _a;
    const mode = action.injectMode || "inject";
    switch (mode) {
      case "inject": {
        if (!action.translations) {
          return { success: false, error: "inject 模式需要 translations 参数（JSON 字符串）" };
        }
        let items;
        try {
          items = JSON.parse(action.translations);
        } catch {
          return { success: false, error: "translations 参数 JSON 解析失败" };
        }
        if (!Array.isArray(items)) {
          return { success: false, error: "translations 必须是数组" };
        }
        ensureImtStyle();
        let injected = 0;
        let skipped = 0;
        for (const item of items) {
          if (!item.id || !item.translated) {
            skipped++;
            continue;
          }
          const original = document.querySelector(`[data-imt-id="${item.id}"]`);
          if (!original) {
            skipped++;
            continue;
          }
          const existingTranslation = document.querySelector(`.imt-translation[data-imt-source="${item.id}"]`);
          if (existingTranslation) {
            existingTranslation.textContent = item.translated;
            existingTranslation.classList.remove("imt-hidden");
            injected++;
            continue;
          }
          const translatedEl = document.createElement("div");
          translatedEl.className = "imt-translation";
          translatedEl.setAttribute("data-imt-source", item.id);
          translatedEl.textContent = item.translated;
          (_a = original.parentNode) == null ? void 0 : _a.insertBefore(translatedEl, original.nextSibling);
          injected++;
        }
        return {
          success: true,
          data: { mode: "inject", injected, skipped, total: items.length }
        };
      }
      case "toggle": {
        const translations = document.querySelectorAll(".imt-translation");
        if (translations.length === 0) {
          return { success: true, data: { mode: "toggle", message: "没有已注入的翻译", toggled: 0 } };
        }
        const isHidden = translations[0].classList.contains("imt-hidden");
        translations.forEach((el) => {
          if (isHidden) {
            el.classList.remove("imt-hidden");
          } else {
            el.classList.add("imt-hidden");
          }
        });
        return {
          success: true,
          data: {
            mode: "toggle",
            newState: isHidden ? "visible" : "hidden",
            toggled: translations.length
          }
        };
      }
      case "clear": {
        const translations = document.querySelectorAll(".imt-translation");
        const count = translations.length;
        translations.forEach((el) => el.remove());
        const tagged = document.querySelectorAll("[data-imt-id]");
        tagged.forEach((el) => el.removeAttribute("data-imt-id"));
        const styleEl = document.getElementById(IMT_STYLE_ID);
        if (styleEl) {
          styleEl.remove();
        }
        return {
          success: true,
          data: { mode: "clear", removed: count }
        };
      }
      default:
        return { success: false, error: `不支持的 injectBilingual 模式: ${mode}` };
    }
  }
  async function executeAction(action) {
    try {
      switch (action.type) {
        case "click":
          return executeClick(action);
        case "type":
          return executeType(action);
        case "scroll":
          return executeScroll(action);
        case "navigate":
          if (!action.url) {
            return { success: false, error: "navigate 操作需要 url 参数" };
          }
          window.location.href = action.url;
          return { success: true, data: { navigated: action.url } };
        case "querySelector":
          return executeQuerySelector(action);
        case "querySelectorAll":
          return executeQuerySelectorAll(action);
        case "getTextContent":
          return executeGetTextContent(action);
        case "getAttribute":
          return executeGetAttribute(action);
        case "getValue":
          return executeGetValue(action);
        case "screenshot":
          return { success: false, error: "__SCREENSHOT_NEEDS_BACKGROUND__" };
        case "waitForElement":
          return executeWaitForElement(action);
        case "highlight":
          return executeHighlight(action);
        case "evaluate":
          return executeEvaluate(action);
        case "selectOption":
          return executeSelectOption(action);
        case "getLinks":
          return executeGetLinks(action);
        // ── evo_v19_001: 沉浸式翻译工具 ──
        case "extractParagraphs":
          return executeExtractParagraphs(action);
        case "injectBilingual":
          return executeInjectBilingual(action);
        default:
          return { success: false, error: `不支持的操作类型: ${action.type}` };
      }
    } catch (err) {
      return {
        success: false,
        error: `执行操作 ${action.type} 失败: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }
  content;
  const MAX_SELECTED_TEXT_CHARS = 8e3;
  const definition = defineContentScript({
    matches: ["<all_urls>"],
    main() {
      console.log("[content] Browser Agent content script loaded on:", location.href);
      browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        var _a;
        if (message.type === "GET_PAGE_CONTEXT") {
          const rawSelected = ((_a = window.getSelection()) == null ? void 0 : _a.toString()) || "";
          const selectedText = rawSelected.substring(0, MAX_SELECTED_TEXT_CHARS);
          const context = {
            url: location.href,
            title: document.title,
            selectedText
          };
          if (rawSelected.length > MAX_SELECTED_TEXT_CHARS) {
            console.log("[content] selectedText 已截断:", rawSelected.length, "->", MAX_SELECTED_TEXT_CHARS);
          }
          console.log("[content] 采集页面上下文:", context.url, "选中文本长度:", context.selectedText.length);
          sendResponse({ type: "PAGE_CONTEXT", payload: context });
          return true;
        }
        if (message.type === "EXECUTE_ACTION") {
          const action = message.payload;
          console.log("[content] 执行浏览器操作:", action.type, action.selector || "");
          executeAction(action).then((result2) => {
            console.log("[content] 操作结果:", action.type, result2.success);
            sendResponse({ type: "ACTION_RESULT", payload: result2 });
          }).catch((err) => {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.error("[content] 操作执行异常:", action.type, errorMsg);
            sendResponse({
              type: "ACTION_RESULT",
              payload: { success: false, error: errorMsg }
            });
          });
          return true;
        }
        return false;
      });
      document.addEventListener("selectionchange", () => {
        var _a;
        const rawSelected = ((_a = window.getSelection()) == null ? void 0 : _a.toString()) || "";
        if (rawSelected.length > 0) {
          const selectedText = rawSelected.substring(0, MAX_SELECTED_TEXT_CHARS);
          if (rawSelected.length > MAX_SELECTED_TEXT_CHARS) {
            console.log("[content] selectionchange 截断:", rawSelected.length, "->", MAX_SELECTED_TEXT_CHARS);
          }
          browser.runtime.sendMessage({
            type: "SELECTION_CHANGED",
            payload: {
              url: location.href,
              title: document.title,
              selectedText
            }
          }).catch(() => {
          });
        }
      });
    }
  });
  content;
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  const _WxtLocationChangeEvent = class _WxtLocationChangeEvent extends Event {
    constructor(newUrl, oldUrl) {
      super(_WxtLocationChangeEvent.EVENT_NAME, {});
      this.newUrl = newUrl;
      this.oldUrl = oldUrl;
    }
  };
  __publicField(_WxtLocationChangeEvent, "EVENT_NAME", getUniqueEventName("wxt:locationchange"));
  let WxtLocationChangeEvent = _WxtLocationChangeEvent;
  function getUniqueEventName(eventName) {
    var _a;
    return `${(_a = browser == null ? void 0 : browser.runtime) == null ? void 0 : _a.id}:${"content"}:${eventName}`;
  }
  function createLocationWatcher(ctx) {
    let interval;
    let oldUrl;
    return {
      /**
       * Ensure the location watcher is actively looking for URL changes. If it's already watching,
       * this is a noop.
       */
      run() {
        if (interval != null) return;
        oldUrl = new URL(location.href);
        interval = ctx.setInterval(() => {
          let newUrl = new URL(location.href);
          if (newUrl.href !== oldUrl.href) {
            window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
            oldUrl = newUrl;
          }
        }, 1e3);
      }
    };
  }
  const _ContentScriptContext = class _ContentScriptContext {
    constructor(contentScriptName, options) {
      __publicField(this, "isTopFrame", window.self === window.top);
      __publicField(this, "abortController");
      __publicField(this, "locationWatcher", createLocationWatcher(this));
      __publicField(this, "receivedMessageIds", /* @__PURE__ */ new Set());
      this.contentScriptName = contentScriptName;
      this.options = options;
      this.abortController = new AbortController();
      if (this.isTopFrame) {
        this.listenForNewerScripts({ ignoreFirstEvent: true });
        this.stopOldScripts();
      } else {
        this.listenForNewerScripts();
      }
    }
    get signal() {
      return this.abortController.signal;
    }
    abort(reason) {
      return this.abortController.abort(reason);
    }
    get isInvalid() {
      if (browser.runtime.id == null) {
        this.notifyInvalidated();
      }
      return this.signal.aborted;
    }
    get isValid() {
      return !this.isInvalid;
    }
    /**
     * Add a listener that is called when the content script's context is invalidated.
     *
     * @returns A function to remove the listener.
     *
     * @example
     * browser.runtime.onMessage.addListener(cb);
     * const removeInvalidatedListener = ctx.onInvalidated(() => {
     *   browser.runtime.onMessage.removeListener(cb);
     * })
     * // ...
     * removeInvalidatedListener();
     */
    onInvalidated(cb) {
      this.signal.addEventListener("abort", cb);
      return () => this.signal.removeEventListener("abort", cb);
    }
    /**
     * Return a promise that never resolves. Useful if you have an async function that shouldn't run
     * after the context is expired.
     *
     * @example
     * const getValueFromStorage = async () => {
     *   if (ctx.isInvalid) return ctx.block();
     *
     *   // ...
     * }
     */
    block() {
      return new Promise(() => {
      });
    }
    /**
     * Wrapper around `window.setInterval` that automatically clears the interval when invalidated.
     */
    setInterval(handler, timeout) {
      const id = setInterval(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearInterval(id));
      return id;
    }
    /**
     * Wrapper around `window.setTimeout` that automatically clears the interval when invalidated.
     */
    setTimeout(handler, timeout) {
      const id = setTimeout(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearTimeout(id));
      return id;
    }
    /**
     * Wrapper around `window.requestAnimationFrame` that automatically cancels the request when
     * invalidated.
     */
    requestAnimationFrame(callback) {
      const id = requestAnimationFrame((...args) => {
        if (this.isValid) callback(...args);
      });
      this.onInvalidated(() => cancelAnimationFrame(id));
      return id;
    }
    /**
     * Wrapper around `window.requestIdleCallback` that automatically cancels the request when
     * invalidated.
     */
    requestIdleCallback(callback, options) {
      const id = requestIdleCallback((...args) => {
        if (!this.signal.aborted) callback(...args);
      }, options);
      this.onInvalidated(() => cancelIdleCallback(id));
      return id;
    }
    addEventListener(target, type, handler, options) {
      var _a;
      if (type === "wxt:locationchange") {
        if (this.isValid) this.locationWatcher.run();
      }
      (_a = target.addEventListener) == null ? void 0 : _a.call(
        target,
        type.startsWith("wxt:") ? getUniqueEventName(type) : type,
        handler,
        {
          ...options,
          signal: this.signal
        }
      );
    }
    /**
     * @internal
     * Abort the abort controller and execute all `onInvalidated` listeners.
     */
    notifyInvalidated() {
      this.abort("Content script context invalidated");
      logger$1.debug(
        `Content script "${this.contentScriptName}" context invalidated`
      );
    }
    stopOldScripts() {
      window.postMessage(
        {
          type: _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
          contentScriptName: this.contentScriptName,
          messageId: Math.random().toString(36).slice(2)
        },
        "*"
      );
    }
    verifyScriptStartedEvent(event) {
      var _a, _b, _c;
      const isScriptStartedEvent = ((_a = event.data) == null ? void 0 : _a.type) === _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE;
      const isSameContentScript = ((_b = event.data) == null ? void 0 : _b.contentScriptName) === this.contentScriptName;
      const isNotDuplicate = !this.receivedMessageIds.has((_c = event.data) == null ? void 0 : _c.messageId);
      return isScriptStartedEvent && isSameContentScript && isNotDuplicate;
    }
    listenForNewerScripts(options) {
      let isFirst = true;
      const cb = (event) => {
        if (this.verifyScriptStartedEvent(event)) {
          this.receivedMessageIds.add(event.data.messageId);
          const wasFirst = isFirst;
          isFirst = false;
          if (wasFirst && (options == null ? void 0 : options.ignoreFirstEvent)) return;
          this.notifyInvalidated();
        }
      };
      addEventListener("message", cb);
      this.onInvalidated(() => removeEventListener("message", cb));
    }
  };
  __publicField(_ContentScriptContext, "SCRIPT_STARTED_MESSAGE_TYPE", getUniqueEventName(
    "wxt:content-script-started"
  ));
  let ContentScriptContext = _ContentScriptContext;
  const nullKey = Symbol("null");
  let keyCounter = 0;
  class ManyKeysMap extends Map {
    constructor() {
      super();
      this._objectHashes = /* @__PURE__ */ new WeakMap();
      this._symbolHashes = /* @__PURE__ */ new Map();
      this._publicKeys = /* @__PURE__ */ new Map();
      const [pairs] = arguments;
      if (pairs === null || pairs === void 0) {
        return;
      }
      if (typeof pairs[Symbol.iterator] !== "function") {
        throw new TypeError(typeof pairs + " is not iterable (cannot read property Symbol(Symbol.iterator))");
      }
      for (const [keys, value] of pairs) {
        this.set(keys, value);
      }
    }
    _getPublicKeys(keys, create = false) {
      if (!Array.isArray(keys)) {
        throw new TypeError("The keys parameter must be an array");
      }
      const privateKey = this._getPrivateKey(keys, create);
      let publicKey;
      if (privateKey && this._publicKeys.has(privateKey)) {
        publicKey = this._publicKeys.get(privateKey);
      } else if (create) {
        publicKey = [...keys];
        this._publicKeys.set(privateKey, publicKey);
      }
      return { privateKey, publicKey };
    }
    _getPrivateKey(keys, create = false) {
      const privateKeys = [];
      for (let key of keys) {
        if (key === null) {
          key = nullKey;
        }
        const hashes = typeof key === "object" || typeof key === "function" ? "_objectHashes" : typeof key === "symbol" ? "_symbolHashes" : false;
        if (!hashes) {
          privateKeys.push(key);
        } else if (this[hashes].has(key)) {
          privateKeys.push(this[hashes].get(key));
        } else if (create) {
          const privateKey = `@@mkm-ref-${keyCounter++}@@`;
          this[hashes].set(key, privateKey);
          privateKeys.push(privateKey);
        } else {
          return false;
        }
      }
      return JSON.stringify(privateKeys);
    }
    set(keys, value) {
      const { publicKey } = this._getPublicKeys(keys, true);
      return super.set(publicKey, value);
    }
    get(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.get(publicKey);
    }
    has(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.has(publicKey);
    }
    delete(keys) {
      const { publicKey, privateKey } = this._getPublicKeys(keys);
      return Boolean(publicKey && super.delete(publicKey) && this._publicKeys.delete(privateKey));
    }
    clear() {
      super.clear();
      this._symbolHashes.clear();
      this._publicKeys.clear();
    }
    get [Symbol.toStringTag]() {
      return "ManyKeysMap";
    }
    get size() {
      return super.size;
    }
  }
  new ManyKeysMap();
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      const { main, ...options } = definition;
      const ctx = new ContentScriptContext("content", options);
      return await main(ctx);
    } catch (err) {
      logger.error(
        `The content script "${"content"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
})();
content;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93ZWJleHRlbnNpb24tcG9seWZpbGxAMC4xMi4wL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIvaW5kZXgubWpzIiwiLi4vLi4vLi4vdXRpbHMvYWN0aW9uLWV4ZWN1dG9yLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyMC4xOS4zN19yb2xsdXBANC41OS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L3V0aWxzL2xvZ2dlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMjlfQHR5cGVzK25vZGVAMjAuMTkuMzdfcm9sbHVwQDQuNTkuMC9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9jdXN0b20tZXZlbnRzLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyMC4xOS4zN19yb2xsdXBANC41OS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbWFueS1rZXlzLW1hcEAyLjAuMS9ub2RlX21vZHVsZXMvbWFueS1rZXlzLW1hcC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AMW5hdHN1K3dhaXQtZWxlbWVudEA0LjEuMi9ub2RlX21vZHVsZXMvQDFuYXRzdS93YWl0LWVsZW1lbnQvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiLCBbXCJtb2R1bGVcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeShtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QpO1xuICAgIGdsb2JhbC5icm93c2VyID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgLyogd2ViZXh0ZW5zaW9uLXBvbHlmaWxsIC0gdjAuMTIuMCAtIFR1ZSBNYXkgMTQgMjAyNCAxODowMToyOSAqL1xuICAvKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG4gIC8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAgICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICAgKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAoIShnbG9iYWxUaGlzLmNocm9tZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUuaWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG4gIGlmICghKGdsb2JhbFRoaXMuYnJvd3NlciAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZSAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZS5pZCkpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjtcblxuICAgIC8vIFdyYXBwaW5nIHRoZSBidWxrIG9mIHRoaXMgcG9seWZpbGwgaW4gYSBvbmUtdGltZS11c2UgZnVuY3Rpb24gaXMgYSBtaW5vclxuICAgIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAgIC8vIGNvbnRlbnRzIG9mIGEgZnVuY3Rpb24gdW50aWwgdGhlIGZpcnN0IHRpbWUgaXQncyBjYWxsZWQsIGFuZCBzaW5jZSBpdCB3aWxsXG4gICAgLy8gbmV2ZXIgYWN0dWFsbHkgbmVlZCB0byBiZSBjYWxsZWQsIHRoaXMgYWxsb3dzIHRoZSBwb2x5ZmlsbCB0byBiZSBpbmNsdWRlZFxuICAgIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICAgIGNvbnN0IHdyYXBBUElzID0gZXh0ZW5zaW9uQVBJcyA9PiB7XG4gICAgICAvLyBOT1RFOiBhcGlNZXRhZGF0YSBpcyBhc3NvY2lhdGVkIHRvIHRoZSBjb250ZW50IG9mIHRoZSBhcGktbWV0YWRhdGEuanNvbiBmaWxlXG4gICAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICAvLyBKU09OIGZpbGUuXG4gICAgICBjb25zdCBhcGlNZXRhZGF0YSA9IHtcbiAgICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjbGVhckFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFN1YlRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2VyQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImRpc2FibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlbmFibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuUG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNhY2hlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZURvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZvcm1EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUxvY2FsU3RvcmFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBhc3N3b3Jkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb29raWVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbENvb2tpZVN0b3Jlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgICBcImluc3BlY3RlZFdpbmRvd1wiOiB7XG4gICAgICAgICAgICBcImV2YWxcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDIsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGFuZWxzXCI6IHtcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVsZW1lbnRzXCI6IHtcbiAgICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwiY2FuY2VsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlcmFzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZpbGVJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhdXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3VtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICAgIFwiaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImlzQWxsb3dlZEluY29nbml0b0FjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhpc3RvcnlcIjoge1xuICAgICAgICAgIFwiYWRkVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlUmFuZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWNjZXB0TGFuZ3VhZ2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRlbnRpdHlcIjoge1xuICAgICAgICAgIFwibGF1bmNoV2ViQXV0aEZsb3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGxlXCI6IHtcbiAgICAgICAgICBcInF1ZXJ5U3RhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYW5hZ2VtZW50XCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRFbmFibGVkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjoge1xuICAgICAgICAgIFwiY29udGFpbnNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicnVudGltZVwiOiB7XG4gICAgICAgICAgXCJnZXRCYWNrZ3JvdW5kUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5PcHRpb25zUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RVcGRhdGVDaGVja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE5hdGl2ZU1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRVbmluc3RhbGxVUkxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJnZXREZXZpY2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN0b3JlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgXCJsb2NhbFwiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1hbmFnZWRcIjoge1xuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRhYnNcIjoge1xuICAgICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkdXBsaWNhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJleGVjdXRlU2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0JhY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0ZvcndhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpbnNlcnRDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgICBcImdldEFsbEZyYW1lc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZyYW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViUmVxdWVzdFwiOiB7XG4gICAgICAgICAgXCJoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2luZG93c1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAgICogICAgICAgIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2YWx1ZSBmb3IgYW55XG4gICAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICAgKi9cbiAgICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG4gICAgICBjb25zdCBpc1RoZW5hYmxlID0gdmFsdWUgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICAgKlxuICAgICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIElmIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIHByb21pc2UgaXNcbiAgICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgICAqICAgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x1dGlvbiBhbmQgcmVqZWN0aW9uIGZ1bmN0aW9ucyBvZiBhXG4gICAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVzb2x1dGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBsdXJhbGl6ZUFyZ3VtZW50cyA9IG51bUFyZ3MgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYXN5bmNGdW5jdGlvbldyYXBwZXIodGFyZ2V0LCAuLi5hcmdzKSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgQVBJIG1ldGhvZCBoYXMgY3VycmVudGx5IG5vIGNhbGxiYWNrIG9uIENocm9tZSwgYnV0IGl0IHJldHVybiBhIHByb21pc2Ugb24gRmlyZWZveCxcbiAgICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgICAgLy8gdG8gbm90IHBhc3NpbmcgdGhlIGNhbGxiYWNrIGlmIHRoZSBmaXJzdCBjYWxsIGZhaWxzLlxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGNiRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bmFtZX0gQVBJIG1ldGhvZCBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyLCBgICsgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEFQSSBtZXRob2QgbWV0YWRhdGEsIHNvIHRoYXQgdGhlIG5leHQgQVBJIGNhbGxzIHdpbGwgbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdW5zdXBwb3J0ZWQgY2FsbGJhY2sgYW55bW9yZS5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gZXhpc3RpbmcgbWV0aG9kIG9mIHRoZSB0YXJnZXQgb2JqZWN0LCBzbyB0aGF0IGNhbGxzIHRvIGl0IGFyZVxuICAgICAgICogaW50ZXJjZXB0ZWQgYnkgdGhlIGdpdmVuIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHJlY2VpdmVzLFxuICAgICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICAgKiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgb3JpZ2luYWwgdGFyZ2V0IG9iamVjdCB0aGF0IHRoZSB3cmFwcGVkIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kXG4gICAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgICAqICAgICAgICBvYmplY3Qgd2hpY2ggaXMgY3JlYXRlZCB0byB3cmFwIHRoZSBtZXRob2QuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgICAqICAgICAgICBvZiB0aGUgd3JhcHBlZCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgICAqICAgICAgICBBIFByb3h5IG9iamVjdCBmb3IgdGhlIGdpdmVuIG1ldGhvZCwgd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gd3JhcHBlclxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiBpdHMgcGxhY2UuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBNZXRob2QgPSAodGFyZ2V0LCBtZXRob2QsIHdyYXBwZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShtZXRob2QsIHtcbiAgICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmNhbGwodGhpc09iaiwgdGFyZ2V0LCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvYmplY3QgaW4gYSBQcm94eSB3aGljaCBpbnRlcmNlcHRzIGFuZCB3cmFwcyBjZXJ0YWluIG1ldGhvZHNcbiAgICAgICAqIGJhc2VkIG9uIHRoZSBnaXZlbiBgd3JhcHBlcnNgIGFuZCBgbWV0YWRhdGFgIG9iamVjdHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSB0YXJnZXQgb2JqZWN0IHRvIHdyYXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFt3cmFwcGVycyA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgd3JhcHBlciBmdW5jdGlvbnMgZm9yIHNwZWNpYWwgY2FzZXMuIEFueVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZS4gVGhlc2VcbiAgICAgICAqICAgICAgICB3cmFwcGVyIG1ldGhvZHMgYXJlIGludm9rZWQgYXMgZGVzY3JpYmVkIGluIHtAc2VlIHdyYXBNZXRob2R9LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGEgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIG1ldGFkYXRhIHVzZWQgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZVxuICAgICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICAgKiAgICAgICAgdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlIHdoaWNoIGhhcyBhIGNvcnJlc3BvbmRpbmcgbWV0YWRhdGEgb2JqZWN0XG4gICAgICAgKiAgICAgICAgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGBtZXRhZGF0YWAgdHJlZSBpcyByZXBsYWNlZCB3aXRoIGFuXG4gICAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgKiAgICAgICAge0BzZWUgd3JhcEFzeW5jRnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0KHByb3h5VGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBvYmplY3QuIENoZWNrIGlmIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgICAgLy8gYW55IHdyYXBwaW5nLlxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHByb3h5VGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShjYWNoZSwgcHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgdGFyZ2V0IGlmIHRoYXQgdmFsdWUgaXMgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZFxuICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLiBGb3IgdGhpcyByZWFzb24sIHdlIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2Fubm90IHJldHVybiBhIGN1c3RvbSBvYmplY3QgZm9yIEFQSXMgdGhhdFxuICAgICAgICAvLyBhcmUgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZCBub24tY29uZmlndXJhYmxlLCBzdWNoIGFzIGBjaHJvbWUuZGV2dG9vbHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgcHJveHkgaGFuZGxlcnMgdGhlbXNlbHZlcyB3aWxsIHN0aWxsIHVzZSB0aGUgb3JpZ2luYWwgYHRhcmdldGBcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgYHByb3h5VGFyZ2V0YCwgc28gdGhhdCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBhcmVcbiAgICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBzZXQgb2Ygd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IG9iamVjdCwgd2hpY2ggaGFuZGxlc1xuICAgICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBBIHNpbmdsZSB3cmFwcGVyIGlzIGNyZWF0ZWQgZm9yIGVhY2ggbGlzdGVuZXIgZnVuY3Rpb24sIGFuZCBzdG9yZWQgaW4gYVxuICAgICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgICAqIHJldHJpZXZlIHRoZSBvcmlnaW5hbCB3cmFwcGVyLCBzbyB0aGF0ICBhdHRlbXB0cyB0byByZW1vdmUgYVxuICAgICAgICogcHJldmlvdXNseS1hZGRlZCBsaXN0ZW5lciB3b3JrIGFzIGV4cGVjdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RGVmYXVsdFdlYWtNYXA8ZnVuY3Rpb24sIGZ1bmN0aW9uPn0gd3JhcHBlck1hcFxuICAgICAgICogICAgICAgIEEgRGVmYXVsdFdlYWtNYXAgb2JqZWN0IHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAgICogICAgICAgIGFuIGV4aXN0aW5nIG9uZSB3aGVuIGl0IGRvZXMuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEV2ZW50ID0gd3JhcHBlck1hcCA9PiAoe1xuICAgICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgICAgdGFyZ2V0LmFkZExpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0xpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGFuIG9uUmVxdWVzdEZpbmlzaGVkIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCByZXR1cm4gYVxuICAgICAgICAgKiBgZ2V0Q29udGVudCgpYCBwcm9wZXJ0eSB3aGljaCByZXR1cm5zIGEgYFByb21pc2VgIHJhdGhlciB0aGFuIHVzaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxXG4gICAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgICBnZXRDb250ZW50OiB7XG4gICAgICAgICAgICAgIG1pbkFyZ3M6IDAsXG4gICAgICAgICAgICAgIG1heEFyZ3M6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0ZW5lcih3cmFwcGVkUmVxKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBkaWRDYWxsU2VuZFJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHdyYXBwZWRTZW5kUmVzcG9uc2U7XG4gICAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgICAvLyB3cmFwcGVkU2VuZFJlc3BvbnNlIHN5bmNocm9ub3VzbHksIHdlIGNhbiBleGl0IGVhcmxpZXJcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgICAvLyBhbmQgYW4gZXJyb3IgaWYgdGhlIHByb21pc2UgcmVqZWN0cyAoYSB3cmFwcGVkIHNlbmRNZXNzYWdlIGhhc1xuICAgICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgICAgLy8gcHJvbWlzZSkuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG4gICAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fCB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZSA9IChuYW1lLCBtZXRhZGF0YSwgYXBpTmFtZXNwYWNlT2JqLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgICBkZXZ0b29sczoge1xuICAgICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMixcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2V0dGluZ01ldGFkYXRhID0ge1xuICAgICAgICBjbGVhcjoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBhcGlNZXRhZGF0YS5wcml2YWN5ID0ge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXJ2aWNlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgd2Vic2l0ZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gICAgLy8gYG1vZHVsZWAgdmFyaWFibGUgYXZhaWxhYmxlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuYnJvd3NlcjtcbiAgfVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icm93c2VyLXBvbHlmaWxsLmpzLm1hcFxuIiwiaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcbiIsIi8vIGFjdGlvbi1leGVjdXRvci50cyDigJQg5rWP6KeI5Zmo5pON5L2c5omn6KGM5byV5pOOXG4vLyDlrprkuYkgQnJvd3NlckFjdGlvbiDmjqXlj6PkuI7miYDmnInmlK/mjIHnmoQgRE9NIOaTjeS9nOexu+Wei++8jFxuLy8g5ZyoIGNvbnRlbnQgc2NyaXB0IOS4iuS4i+aWh+S4reaJp+ihjCBjbGljay90eXBlL3Njcm9sbC9xdWVyeVNlbGVjdG9yIOetieaTjeS9nFxuXG4vKiog5pSv5oyB55qE5rWP6KeI5Zmo5pON5L2c57G75Z6L5p6a5Li+ICovXG5leHBvcnQgdHlwZSBBY3Rpb25UeXBlID1cbiAgfCAnY2xpY2snXG4gIHwgJ3R5cGUnXG4gIHwgJ3Njcm9sbCdcbiAgfCAnbmF2aWdhdGUnXG4gIHwgJ3F1ZXJ5U2VsZWN0b3InXG4gIHwgJ3F1ZXJ5U2VsZWN0b3JBbGwnXG4gIHwgJ2dldFRleHRDb250ZW50J1xuICB8ICdnZXRBdHRyaWJ1dGUnXG4gIHwgJ2dldFZhbHVlJ1xuICB8ICdzY3JlZW5zaG90J1xuICB8ICd3YWl0Rm9yRWxlbWVudCdcbiAgfCAnaGlnaGxpZ2h0J1xuICB8ICdldmFsdWF0ZSdcbiAgfCAnc2VsZWN0T3B0aW9uJ1xuICB8ICdnZXRMaW5rcydcbiAgfCAnZXh0cmFjdFBhcmFncmFwaHMnXG4gIHwgJ2luamVjdEJpbGluZ3VhbCc7XG5cbi8qKiDmu5rliqjmqKHlvI8gKi9cbmV4cG9ydCB0eXBlIFNjcm9sbE1vZGUgPSAndG8tdG9wJyB8ICd0by1ib3R0b20nIHwgJ2J5LXBpeGVscycgfCAndG8tZWxlbWVudCc7XG5cbi8qKiDmtY/op4jlmajmk43kvZzor7fmsYIgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlckFjdGlvbiB7XG4gIC8qKiDmk43kvZznsbvlnosgKi9cbiAgdHlwZTogQWN0aW9uVHlwZTtcbiAgLyoqIENTUyDpgInmi6nlmajvvIzlrprkvY3nm67moIflhYPntKAgKi9cbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8qKiDmlofmnKzljLnphY3ov4fmu6TvvIhjbGljayDml7blj6/pgInvvIznlKjkuo7ku47lpJrkuKrljLnphY3kuK3nrZvpgInlkKvmjIflrprmlofmnKznmoTlhYPntKDvvIkgKi9cbiAgdGV4dD86IHN0cmluZztcbiAgLyoqIHR5cGUg5pON5L2c6KaB6L6T5YWl55qE5paH5pysICovXG4gIHZhbHVlPzogc3RyaW5nO1xuICAvKiogc2Nyb2xsIOaTjeS9nOeahOaooeW8jyAqL1xuICBzY3JvbGxNb2RlPzogU2Nyb2xsTW9kZTtcbiAgLyoqIHNjcm9sbCBieS1waXhlbHMg5qih5byP55qE5YOP57Sg5pWw77yI5q2j5pWw5ZCR5LiL77yM6LSf5pWw5ZCR5LiK77yJICovXG4gIHNjcm9sbFBpeGVscz86IG51bWJlcjtcbiAgLyoqIGdldEF0dHJpYnV0ZSDopoHojrflj5bnmoTlsZ7mgKflkI0gKi9cbiAgYXR0cmlidXRlTmFtZT86IHN0cmluZztcbiAgLyoqIG5hdmlnYXRlIOaTjeS9nOeahOebruaghyBVUkwgKi9cbiAgdXJsPzogc3RyaW5nO1xuICAvKiogd2FpdEZvckVsZW1lbnQg55qE6LaF5pe25q+r56eS5pWw77yI6buY6K6kIDUwMDDvvIkgKi9cbiAgdGltZW91dD86IG51bWJlcjtcbiAgLyoqIGhpZ2hsaWdodCDpq5jkuq7popzoibLvvIjpu5jorqQgcmdiYSgyNTUsIDE2NSwgMCwgMC40Ke+8iSAqL1xuICBoaWdobGlnaHRDb2xvcj86IHN0cmluZztcbiAgLyoqIGhpZ2hsaWdodCDmjIHnu63ml7bpl7Tmr6vnp5LmlbDvvIjpu5jorqQgMjAwMO+8iSAqL1xuICBoaWdobGlnaHREdXJhdGlvbj86IG51bWJlcjtcbiAgLyoqIGV2YWx1YXRlIOaTjeS9nOimgeaJp+ihjOeahCBKYXZhU2NyaXB0IOihqOi+vuW8jyAqL1xuICBleHByZXNzaW9uPzogc3RyaW5nO1xuICAvKiogc2VsZWN0T3B0aW9uIOaTjeS9nOimgemAieaLqeeahCBvcHRpb24gdmFsdWUg5bGe5oCnICovXG4gIG9wdGlvblZhbHVlPzogc3RyaW5nO1xuICAvKiogc2VsZWN0T3B0aW9uIOaTjeS9nOimgemAieaLqeeahCBvcHRpb24g5Y+v6KeB5paH5pysICovXG4gIG9wdGlvblRleHQ/OiBzdHJpbmc7XG4gIC8qKiBnZXRMaW5rcyAvIHF1ZXJ5U2VsZWN0b3JBbGwg6L+U5Zue55qE5pyA5aSn5YWD57Sg5pWwICovXG4gIG1heENvdW50PzogbnVtYmVyO1xuICAvKiogZXh0cmFjdFBhcmFncmFwaHMg55qE6IyD5Zu06YCJ5oup5ZmoICovXG4gIHNjb3BlU2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8qKiBpbmplY3RCaWxpbmd1YWwg55qE5pON5L2c5qih5byPOiBpbmplY3QgLyB0b2dnbGUgLyBjbGVhciAqL1xuICBpbmplY3RNb2RlPzogJ2luamVjdCcgfCAndG9nZ2xlJyB8ICdjbGVhcic7XG4gIC8qKiBpbmplY3RCaWxpbmd1YWwgaW5qZWN0IOaooeW8j+eahOe/u+ivkeaVsOaNru+8iEpTT04g5a2X56ym5Liy77yJICovXG4gIHRyYW5zbGF0aW9ucz86IHN0cmluZztcbn1cblxuLyoqIOaTjeS9nOaJp+ihjOe7k+aenCAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25SZXN1bHQge1xuICAvKiog5piv5ZCm5oiQ5YqfICovXG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIC8qKiDov5Tlm57mlbDmja7vvIjmoLnmja7mk43kvZznsbvlnovkuI3lkIzogIzkuI3lkIzvvIkgKi9cbiAgZGF0YT86IHVua25vd247XG4gIC8qKiDlpLHotKXml7bnmoTplJnor6/kv6Hmga8gKi9cbiAgZXJyb3I/OiBzdHJpbmc7XG59XG5cbi8qKiBxdWVyeVNlbGVjdG9yIOi/lOWbnueahOWFg+e0oOS/oeaBryAqL1xuZXhwb3J0IGludGVyZmFjZSBFbGVtZW50SW5mbyB7XG4gIHRhZ05hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIHRleHRDb250ZW50OiBzdHJpbmc7XG4gIGhyZWY/OiBzdHJpbmc7XG4gIHNyYz86IHN0cmluZztcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIOS7jiBET00g5YWD57Sg5o+Q5Y+W5YWz6ZSu5bGe5oCn5L+h5oGvXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RFbGVtZW50SW5mbyhlbDogRWxlbWVudCk6IEVsZW1lbnRJbmZvIHtcbiAgY29uc3QgaHRtbEVsID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IGlucHV0RWwgPSBlbCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICBjb25zdCBhbmNob3JFbCA9IGVsIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICBjb25zdCBpbWdFbCA9IGVsIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG5cbiAgcmV0dXJuIHtcbiAgICB0YWdOYW1lOiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgaWQ6IGVsLmlkIHx8ICcnLFxuICAgIGNsYXNzTmFtZTogZWwuY2xhc3NOYW1lIHx8ICcnLFxuICAgIHRleHRDb250ZW50OiAoaHRtbEVsLnRleHRDb250ZW50IHx8ICcnKS50cmltKCkuc2xpY2UoMCwgNTAwKSxcbiAgICAuLi4oYW5jaG9yRWwuaHJlZiA/IHsgaHJlZjogYW5jaG9yRWwuaHJlZiB9IDoge30pLFxuICAgIC4uLihpbWdFbC5zcmMgPyB7IHNyYzogaW1nRWwuc3JjIH0gOiB7fSksXG4gICAgLi4uKGlucHV0RWwudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dEVsLnZhbHVlICE9PSAnJyA/IHsgdmFsdWU6IGlucHV0RWwudmFsdWUgfSA6IHt9KSxcbiAgICAuLi4oaW5wdXRFbC50eXBlID8geyB0eXBlOiBpbnB1dEVsLnR5cGUgfSA6IHt9KSxcbiAgICAuLi4oaW5wdXRFbC5wbGFjZWhvbGRlciA/IHsgcGxhY2Vob2xkZXI6IGlucHV0RWwucGxhY2Vob2xkZXIgfSA6IHt9KSxcbiAgfTtcbn1cblxuLyoqXG4gKiDmoLnmja4gc2VsZWN0b3Ig5ZKM5Y+v6YCJIHRleHQg6L+H5ruk5a6a5L2N5YWD57SgXG4gKi9cbmZ1bmN0aW9uIGZpbmRFbGVtZW50KHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBFbGVtZW50IHwgbnVsbCB7XG4gIGlmICh0ZXh0KSB7XG4gICAgLy8g5om+5Yiw5omA5pyJ5Yy56YWNIHNlbGVjdG9yIOeahOWFg+e0oO+8jOWGjeaMiSB0ZXh0Q29udGVudCDnrZvpgIlcbiAgICBjb25zdCBjYW5kaWRhdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgZm9yIChjb25zdCBlbCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICBpZiAoKGVsIGFzIEhUTUxFbGVtZW50KS50ZXh0Q29udGVudD8uaW5jbHVkZXModGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG59XG5cbi8qKlxuICog5omn6KGMIGNsaWNrIOaTjeS9nFxuICog5pSv5oyBIENTUyBzZWxlY3RvciDlrprkvY0gKyDlj6/pgInnmoTmlofmnKzljLnphY3ov4fmu6RcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUNsaWNrKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnY2xpY2sg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGZpbmRFbGVtZW50KGFjdGlvbi5zZWxlY3RvciwgYWN0aW9uLnRleHQpO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn0ke2FjdGlvbi50ZXh0ID8gYCAodGV4dDogXCIke2FjdGlvbi50ZXh0fVwiKWAgOiAnJ31gIH07XG4gIH1cbiAgKGVsIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGNsaWNrZWQ6IGFjdGlvbi5zZWxlY3RvciB9IH07XG59XG5cbi8qKlxuICog5omn6KGMIHR5cGUg5pON5L2cXG4gKiBmb2N1cyDihpIg5riF56m6IOKGkiDpgJDlrZfovpPlhaUg4oaSIOinpuWPkSBpbnB1dC9jaGFuZ2Ug5LqL5Lu2XG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVUeXBlKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAndHlwZSDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGlmIChhY3Rpb24udmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3R5cGUg5pON5L2c6ZyA6KaBIHZhbHVlIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGZpbmRFbGVtZW50KGFjdGlvbi5zZWxlY3RvcikgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cblxuICAvLyBmb2N1c1xuICBlbC5mb2N1cygpO1xuXG4gIC8vIOa4heepuueOsOacieWAvFxuICBlbC52YWx1ZSA9ICcnO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gIC8vIOiuvue9ruaWsOWAvFxuICAvLyDkvb/nlKggbmF0aXZlIGlucHV0IHNldHRlciDku6Xnoa7kv50gUmVhY3Qg5Y+X5o6n57uE5Lu25Lmf6IO95q2j56Gu5pu05pawXG4gIGNvbnN0IG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihlbCksXG4gICAgJ3ZhbHVlJyxcbiAgKT8uc2V0O1xuXG4gIGlmIChuYXRpdmVJbnB1dFZhbHVlU2V0dGVyKSB7XG4gICAgbmF0aXZlSW5wdXRWYWx1ZVNldHRlci5jYWxsKGVsLCBhY3Rpb24udmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGVsLnZhbHVlID0gYWN0aW9uLnZhbHVlO1xuICB9XG5cbiAgLy8g6Kem5Y+R5LqL5Lu2XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgdHlwZWQ6IGFjdGlvbi52YWx1ZSwgc2VsZWN0b3I6IGFjdGlvbi5zZWxlY3RvciB9IH07XG59XG5cbi8qKlxuICog5omn6KGMIHNjcm9sbCDmk43kvZxcbiAqIOaUr+aMgSB0by10b3AgLyB0by1ib3R0b20gLyBieS1waXhlbHMgLyB0by1lbGVtZW50IOWbm+enjeaooeW8j1xuICovXG5mdW5jdGlvbiBleGVjdXRlU2Nyb2xsKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGNvbnN0IG1vZGUgPSBhY3Rpb24uc2Nyb2xsTW9kZSB8fCAnYnktcGl4ZWxzJztcblxuICBzd2l0Y2ggKG1vZGUpIHtcbiAgICBjYXNlICd0by10b3AnOlxuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHNjcm9sbGVkOiAndG8tdG9wJyB9IH07XG5cbiAgICBjYXNlICd0by1ib3R0b20nOlxuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ3RvLWJvdHRvbScgfSB9O1xuXG4gICAgY2FzZSAnYnktcGl4ZWxzJzoge1xuICAgICAgY29uc3QgcGl4ZWxzID0gYWN0aW9uLnNjcm9sbFBpeGVscyB8fCAzMDA7XG4gICAgICB3aW5kb3cuc2Nyb2xsQnkoeyB0b3A6IHBpeGVscywgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ2J5LXBpeGVscycsIHBpeGVscyB9IH07XG4gICAgfVxuXG4gICAgY2FzZSAndG8tZWxlbWVudCc6IHtcbiAgICAgIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3Njcm9sbCB0by1lbGVtZW50IOaooeW8j+mcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gICAgICB9XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gICAgICB9XG4gICAgICBlbC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ3RvLWVsZW1lbnQnLCBzZWxlY3RvcjogYWN0aW9uLnNlbGVjdG9yIH0gfTtcbiAgICB9XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5LiN5pSv5oyB55qE5rua5Yqo5qih5byPOiAke21vZGV9YCB9O1xuICB9XG59XG5cbi8qKlxuICog5omn6KGMIHF1ZXJ5U2VsZWN0b3Ig5pON5L2cXG4gKiDov5Tlm57ljLnphY3lhYPntKDnmoQgdGFnTmFtZS9pZC9jbGFzc05hbWUvdGV4dENvbnRlbnQvaHJlZi9zcmMg562J5bGe5oCnXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVRdWVyeVNlbGVjdG9yKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAncXVlcnlTZWxlY3RvciDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IpO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogZXh0cmFjdEVsZW1lbnRJbmZvKGVsKSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBxdWVyeVNlbGVjdG9yQWxsIOaTjeS9nFxuICog6L+U5Zue5omA5pyJ5Yy56YWN5YWD57Sg55qE5bGe5oCn5pWw57uEXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVRdWVyeVNlbGVjdG9yQWxsKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAncXVlcnlTZWxlY3RvckFsbCDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhY3Rpb24uc2VsZWN0b3IpO1xuICBjb25zdCByZXN1bHRzOiBFbGVtZW50SW5mb1tdID0gW107XG4gIC8vIOacgOWkmui/lOWbniBtYXhDb3VudCDkuKrlhYPntKDvvIjpu5jorqQgNTDvvInvvIzpmLLmraLmlbDmja7ov4flpKdcbiAgY29uc3QgbGltaXQgPSBNYXRoLm1pbihlbGVtZW50cy5sZW5ndGgsIGFjdGlvbi5tYXhDb3VudCB8fCA1MCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXQ7IGkrKykge1xuICAgIHJlc3VsdHMucHVzaChleHRyYWN0RWxlbWVudEluZm8oZWxlbWVudHNbaV0pKTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGNvdW50OiBlbGVtZW50cy5sZW5ndGgsIGVsZW1lbnRzOiByZXN1bHRzIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgZ2V0VGV4dENvbnRlbnQg5pON5L2cXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVHZXRUZXh0Q29udGVudChhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBBY3Rpb25SZXN1bHQge1xuICBpZiAoIWFjdGlvbi5zZWxlY3Rvcikge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2dldFRleHRDb250ZW50IOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3Rvcik7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHRleHRDb250ZW50OiAoZWwgYXMgSFRNTEVsZW1lbnQpLnRleHRDb250ZW50Py50cmltKCkgfHwgJycgfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRBdHRyaWJ1dGUg5pON5L2cXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVHZXRBdHRyaWJ1dGUoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdnZXRBdHRyaWJ1dGUg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBpZiAoIWFjdGlvbi5hdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnZ2V0QXR0cmlidXRlIOaTjeS9nOmcgOimgSBhdHRyaWJ1dGVOYW1lIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgaWYgKCFlbCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgYXR0cmlidXRlOiBhY3Rpb24uYXR0cmlidXRlTmFtZSwgdmFsdWU6IGVsLmdldEF0dHJpYnV0ZShhY3Rpb24uYXR0cmlidXRlTmFtZSkgfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRWYWx1ZSDmk43kvZxcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUdldFZhbHVlKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnZ2V0VmFsdWUg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcbiAgaWYgKCFlbCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgdmFsdWU6IGVsLnZhbHVlIHx8ICcnIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgd2FpdEZvckVsZW1lbnQg5pON5L2cXG4gKiDkvb/nlKggTXV0YXRpb25PYnNlcnZlciDnrYnlvoXlhYPntKDlh7rnjrBcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVdhaXRGb3JFbGVtZW50KGFjdGlvbjogQnJvd3NlckFjdGlvbik6IFByb21pc2U8QWN0aW9uUmVzdWx0PiB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnd2FpdEZvckVsZW1lbnQg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuXG4gIGNvbnN0IHRpbWVvdXQgPSBhY3Rpb24udGltZW91dCB8fCA1MDAwO1xuXG4gIC8vIOWFiOajgOafpeWFg+e0oOaYr+WQpuW3suWtmOWcqFxuICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgaWYgKGV4aXN0aW5nKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogZXh0cmFjdEVsZW1lbnRJbmZvKGV4aXN0aW5nKSB9O1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlPEFjdGlvblJlc3VsdD4oKHJlc29sdmUpID0+IHtcbiAgICBsZXQgcmVzb2x2ZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3RvciEpO1xuICAgICAgaWYgKGVsICYmICFyZXNvbHZlZCkge1xuICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGV4dHJhY3RFbGVtZW50SW5mbyhlbCkgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuXG4gICAgLy8g6LaF5pe25aSE55CGXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXJlc29sdmVkKSB7XG4gICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg562J5b6F5YWD57Sg6LaF5pe2ICgke3RpbWVvdXR9bXMpOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH0pO1xuICAgICAgfVxuICAgIH0sIHRpbWVvdXQpO1xuICB9KTtcbn1cblxuLyoqXG4gKiDmiafooYwgaGlnaGxpZ2h0IOaTjeS9nFxuICog5Li655uu5qCH5YWD57Sg5re75Yqg5Li05pe26auY5Lqu6L655qGGXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVIaWdobGlnaHQoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdoaWdobGlnaHQg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuXG4gIGNvbnN0IGNvbG9yID0gYWN0aW9uLmhpZ2hsaWdodENvbG9yIHx8ICdyZ2JhKDI1NSwgMTY1LCAwLCAwLjQpJztcbiAgY29uc3QgZHVyYXRpb24gPSBhY3Rpb24uaGlnaGxpZ2h0RHVyYXRpb24gfHwgMjAwMDtcblxuICAvLyDkv53lrZjljp/mnInmoLflvI9cbiAgY29uc3Qgb3JpZ2luYWxPdXRsaW5lID0gZWwuc3R5bGUub3V0bGluZTtcbiAgY29uc3Qgb3JpZ2luYWxCZ0NvbG9yID0gZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuXG4gIC8vIOW6lOeUqOmrmOS6rlxuICBlbC5zdHlsZS5vdXRsaW5lID0gYDNweCBzb2xpZCAke2NvbG9yfWA7XG4gIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuXG4gIC8vIOWumuaXtuaBouWkjVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBlbC5zdHlsZS5vdXRsaW5lID0gb3JpZ2luYWxPdXRsaW5lO1xuICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9yaWdpbmFsQmdDb2xvcjtcbiAgfSwgZHVyYXRpb24pO1xuXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgaGlnaGxpZ2h0ZWQ6IGFjdGlvbi5zZWxlY3RvciwgZHVyYXRpb24gfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBldmFsdWF0ZSDmk43kvZxcbiAqIOWcqOmhtemdouS4iuS4i+aWh+S4reaJp+ihjOS7u+aEjyBKYXZhU2NyaXB0IOS7o+eggeW5tui/lOWbnue7k+aenFxuICovXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlRXZhbHVhdGUoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ+IHtcbiAgaWYgKCFhY3Rpb24uZXhwcmVzc2lvbikge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2V2YWx1YXRlIOaTjeS9nOmcgOimgSBleHByZXNzaW9uIOWPguaVsCcgfTtcbiAgfVxuICB0cnkge1xuICAgIC8vIOS9v+eUqCBuZXcgRnVuY3Rpb24g5Lul5L6/5pSv5oyBIHJldHVybiDor63lj6VcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbihhY3Rpb24uZXhwcmVzc2lvbik7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZm4oKTtcbiAgICAvLyDlronlhajluo/liJfljJbvvJp1bmRlZmluZWQg4oaSIG51bGzvvIzlhbbkvZkgSlNPTiDljJZcbiAgICBjb25zdCBzZXJpYWxpemVkID0gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBudWxsIDogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHJlc3VsdDogc2VyaWFsaXplZCB9IH07XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBgZXZhbHVhdGUg5omn6KGM5aSx6LSlOiAke2VyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKX1gLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiDmiafooYwgc2VsZWN0T3B0aW9uIOaTjeS9nFxuICog6YCa6L+HIHZhbHVlIOaIliB0ZXh0IOmAieaLqSA8c2VsZWN0PiDkuIvmi4nmoYbpgInpobnvvIzop6blj5EgY2hhbmdlIOS6i+S7tlxuICovXG5mdW5jdGlvbiBleGVjdXRlU2VsZWN0T3B0aW9uKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2VsZWN0T3B0aW9uIOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3RvcikgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ3NlbGVjdCcpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDnm67moIflhYPntKDkuI3mmK8gPHNlbGVjdD7vvIzogIzmmK8gPCR7ZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpfT5gIH07XG4gIH1cblxuICBsZXQgbWF0Y2hlZCA9IGZhbHNlO1xuICBjb25zdCBvcHRpb25zID0gZWwub3B0aW9ucztcblxuICBpZiAoYWN0aW9uLm9wdGlvblZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyDmjIkgdmFsdWUg5Yy56YWNXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3B0aW9uc1tpXS52YWx1ZSA9PT0gYWN0aW9uLm9wdGlvblZhbHVlKSB7XG4gICAgICAgIGVsLnNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGFjdGlvbi5vcHRpb25UZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyDmjInlj6/op4HmlofmnKzljLnphY1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcHRpb25zW2ldLnRleHQudHJpbSgpID09PSBhY3Rpb24ub3B0aW9uVGV4dC50cmltKCkpIHtcbiAgICAgICAgZWwuc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgIG1hdGNoZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2VsZWN0T3B0aW9uIOmcgOimgSBvcHRpb25WYWx1ZSDmiJYgb3B0aW9uVGV4dCDlj4LmlbAnIH07XG4gIH1cblxuICBpZiAoIW1hdGNoZWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogYOacquaJvuWIsOWMuemFjeeahOmAiemhuTogJHthY3Rpb24ub3B0aW9uVmFsdWUgIT09IHVuZGVmaW5lZCA/IGB2YWx1ZT1cIiR7YWN0aW9uLm9wdGlvblZhbHVlfVwiYCA6IGB0ZXh0PVwiJHthY3Rpb24ub3B0aW9uVGV4dH1cImB9YCxcbiAgICB9O1xuICB9XG5cbiAgLy8g6Kem5Y+RIGNoYW5nZSDkuovku7ZcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG5cbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zW2VsLnNlbGVjdGVkSW5kZXhdO1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgZGF0YToge1xuICAgICAgc2VsZWN0ZWRJbmRleDogZWwuc2VsZWN0ZWRJbmRleCxcbiAgICAgIHNlbGVjdGVkVmFsdWU6IHNlbGVjdGVkLnZhbHVlLFxuICAgICAgc2VsZWN0ZWRUZXh0OiBzZWxlY3RlZC50ZXh0LnRyaW0oKSxcbiAgICB9LFxuICB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRMaW5rcyDmk43kvZxcbiAqIOaPkOWPlumhtemdouS4reaJgOacieWQqyBocmVmIOeahCA8YT4g5YWD57Sg77yM6L+U5ZueIHsgaHJlZiwgdGV4dCB9IOaVsOe7hFxuICovXG5mdW5jdGlvbiBleGVjdXRlR2V0TGlua3MoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgY29uc3QgbWF4Q291bnQgPSBhY3Rpb24ubWF4Q291bnQgfHwgMTAwO1xuICBjb25zdCBzY29wZSA9IGFjdGlvbi5zZWxlY3RvclxuICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IpXG4gICAgOiBkb2N1bWVudDtcblxuICBpZiAoYWN0aW9uLnNlbGVjdG9yICYmICFzY29wZSkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOiMg+WbtOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG5cbiAgY29uc3QgYW5jaG9ycyA9IChzY29wZSB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXScpO1xuICBjb25zdCBsaW5rczogQXJyYXk8eyBocmVmOiBzdHJpbmc7IHRleHQ6IHN0cmluZyB9PiA9IFtdO1xuICBjb25zdCBsaW1pdCA9IE1hdGgubWluKGFuY2hvcnMubGVuZ3RoLCBtYXhDb3VudCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW1pdDsgaSsrKSB7XG4gICAgY29uc3QgYSA9IGFuY2hvcnNbaV0gYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgbGlua3MucHVzaCh7XG4gICAgICBocmVmOiBhLmhyZWYsXG4gICAgICB0ZXh0OiAoYS50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpLnNsaWNlKDAsIDIwMCksXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgZGF0YTogeyB0b3RhbEZvdW5kOiBhbmNob3JzLmxlbmd0aCwgcmV0dXJuZWQ6IGxpbmtzLmxlbmd0aCwgbGlua3MgfSxcbiAgfTtcbn1cblxuLy8g4pSA4pSAIGV2b192MTlfMDAxOiDmsonmtbjlvI/nv7vor5Eg4oCUIOauteiQveaPkOWPliArIOWPjOivreazqOWFpSDilIDilIBcblxuLyoqIOmcgOimgei3s+i/h+eahOagh+etvu+8iOWvvOiIquOAgeiEmuacrOOAgeagt+W8j+OAgeW5v+WRiuetie+8iSAqL1xuY29uc3QgSU1UX1NLSVBfVEFHUyA9IG5ldyBTZXQoW1xuICAnc2NyaXB0JywgJ3N0eWxlJywgJ25vc2NyaXB0JywgJ2lmcmFtZScsICdzdmcnLCAnY2FudmFzJyxcbiAgJ25hdicsICdmb290ZXInLCAnaGVhZGVyJywgJ2FzaWRlJywgJ2Zvcm0nLCAnYnV0dG9uJyxcbiAgJ2lucHV0JywgJ3RleHRhcmVhJywgJ3NlbGVjdCcsICdsYWJlbCcsXG5dKTtcblxuLyoqIOWGheWuueauteiQveagh+etviAqL1xuY29uc3QgSU1UX1BBUkFHUkFQSF9UQUdTID0gbmV3IFNldChbXG4gICdwJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JyxcbiAgJ2xpJywgJ2Jsb2NrcXVvdGUnLCAndGQnLCAndGgnLCAnZHQnLCAnZGQnLFxuICAnZmlnY2FwdGlvbicsICdjYXB0aW9uJywgJ3N1bW1hcnknLCAncHJlJyxcbl0pO1xuXG4vKipcbiAqIOiHquWKqOajgOa1i+mhtemdouS4u+WGheWuueWMuuWfn1xuICog5LyY5YWI57qnOiBhcnRpY2xlID4gbWFpbiA+IFtyb2xlPVwibWFpblwiXSA+IC5jb250ZW50Ly5wb3N0Ly5hcnRpY2xlID4gYm9keVxuICovXG5mdW5jdGlvbiBkZXRlY3RNYWluQ29udGVudCgpOiBFbGVtZW50IHtcbiAgY29uc3QgY2FuZGlkYXRlcyA9IFtcbiAgICAnYXJ0aWNsZScsXG4gICAgJ21haW4nLFxuICAgICdbcm9sZT1cIm1haW5cIl0nLFxuICAgICcuY29udGVudCcsXG4gICAgJy5wb3N0JyxcbiAgICAnLmFydGljbGUnLFxuICAgICcucG9zdC1jb250ZW50JyxcbiAgICAnLmVudHJ5LWNvbnRlbnQnLFxuICAgICcuYXJ0aWNsZS1jb250ZW50JyxcbiAgICAnI2NvbnRlbnQnLFxuICBdO1xuICBmb3IgKGNvbnN0IHNlbCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgaWYgKGVsICYmIGVsLnRleHRDb250ZW50ICYmIGVsLnRleHRDb250ZW50LnRyaW0oKS5sZW5ndGggPiAxMDApIHtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XG59XG5cbi8qKlxuICog5omn6KGMIGV4dHJhY3RQYXJhZ3JhcGhzIOaTjeS9nFxuICog5pm66IO95o+Q5Y+W6aG16Z2i5q616JC977yM5Li65q+P5Liq5q616JC96K6+572uIGRhdGEtaW10LWlk77yM6L+U5Zue57uT5p6E5YyW5pWw5o2uXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVFeHRyYWN0UGFyYWdyYXBocyhhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBBY3Rpb25SZXN1bHQge1xuICBjb25zdCBzY29wZSA9IGFjdGlvbi5zY29wZVNlbGVjdG9yXG4gICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zY29wZVNlbGVjdG9yKVxuICAgIDogZGV0ZWN0TWFpbkNvbnRlbnQoKTtcblxuICBpZiAoIXNjb3BlKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw6IyD5Zu05YWD57SgOiAke2FjdGlvbi5zY29wZVNlbGVjdG9yfWAgfTtcbiAgfVxuXG4gIGNvbnN0IG1heENvdW50ID0gYWN0aW9uLm1heENvdW50IHx8IDIwMDtcbiAgY29uc3QgcGFyYWdyYXBoczogQXJyYXk8eyBpZDogc3RyaW5nOyB0YWc6IHN0cmluZzsgdGV4dDogc3RyaW5nIH0+ID0gW107XG4gIGxldCBpZENvdW50ZXIgPSAwO1xuXG4gIC8vIOmAkuW9kumBjeWOhiBET00g5qCR77yM5o+Q5Y+W5YaF5a655q616JC9XG4gIGZ1bmN0aW9uIHdhbGsobm9kZTogRWxlbWVudCk6IHZvaWQge1xuICAgIGlmIChwYXJhZ3JhcGhzLmxlbmd0aCA+PSBtYXhDb3VudCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHRhZyA9IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8g6Lez6L+H5LiN55u45YWz55qE5qCH562+XG4gICAgaWYgKElNVF9TS0lQX1RBR1MuaGFzKHRhZykpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyDot7Pov4fpmpDol4/lhYPntKBcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgaWYgKHN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fCBzdHlsZS52aXNpYmlsaXR5ID09PSAnaGlkZGVuJykgeyByZXR1cm47IH1cbiAgICB9XG5cbiAgICAvLyDot7Pov4flt7Lms6jlhaXnmoTnv7vor5HmrrXokL1cbiAgICBpZiAobm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2ltdC10cmFuc2xhdGlvbicpKSB7IHJldHVybjsgfVxuXG4gICAgLy8g5aaC5p6c5piv5q616JC957qn5qCH562+5LiU5pyJ5pyJ5pWI5paH5pys5YaF5a65XG4gICAgaWYgKElNVF9QQVJBR1JBUEhfVEFHUy5oYXModGFnKSkge1xuICAgICAgY29uc3QgdGV4dCA9IChub2RlLnRleHRDb250ZW50IHx8ICcnKS50cmltKCk7XG4gICAgICAvLyDot7Pov4fnqbrmrrXokL3lkozmnoHnn63mrrXokL3vvIjlsJHkuo4y5a2X56ym77yJXG4gICAgICBpZiAodGV4dC5sZW5ndGggPj0gMikge1xuICAgICAgICBjb25zdCBpZCA9IGBpbXQtJHtpZENvdW50ZXIrK31gO1xuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS1pbXQtaWQnLCBpZCk7XG4gICAgICAgIHBhcmFncmFwaHMucHVzaCh7IGlkLCB0YWcsIHRleHQ6IHRleHQuc2xpY2UoMCwgMjAwMCkgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm47IC8vIOS4jeWGjeWQkeS4i+mAkuW9ku+8jOmBv+WFjemHjeWkjeaPkOWPllxuICAgIH1cblxuICAgIC8vIOmdnuauteiQvee6p+agh+etviDihpIg57un57ut5ZCR5LiL6YGN5Y6G5a2Q5YWD57SgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB3YWxrKG5vZGUuY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgfVxuXG4gIHdhbGsoc2NvcGUgYXMgRWxlbWVudCk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzOiB0cnVlLFxuICAgIGRhdGE6IHtcbiAgICAgIHRvdGFsRXh0cmFjdGVkOiBwYXJhZ3JhcGhzLmxlbmd0aCxcbiAgICAgIHNjb3BlOiBhY3Rpb24uc2NvcGVTZWxlY3RvciB8fCAnKGF1dG8tZGV0ZWN0ZWQpJyxcbiAgICAgIHBhcmFncmFwaHMsXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqIOayiea1uOW8j+e/u+ivkeazqOWFpeagt+W8j++8iOWPquazqOWFpeS4gOasoe+8iSAqL1xuY29uc3QgSU1UX1NUWUxFX0lEID0gJ2ltdC1iaWxpbmd1YWwtc3R5bGUnO1xuY29uc3QgSU1UX0NTUyA9IGBcbi5pbXQtdHJhbnNsYXRpb24ge1xuICBtYXJnaW46IDRweCAwIDEycHggMDtcbiAgcGFkZGluZzogNnB4IDEycHg7XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgIzQyODdmNTtcbiAgYmFja2dyb3VuZDogcmdiYSg2NiwgMTM1LCAyNDUsIDAuMDYpO1xuICBjb2xvcjogIzU1NTtcbiAgZm9udC1zaXplOiAwLjk1ZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjY7XG4gIGJvcmRlci1yYWRpdXM6IDAgNHB4IDRweCAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4uaW10LXRyYW5zbGF0aW9uLmltdC1oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuYDtcblxuLyoqXG4gKiDnoa7kv53msonmtbjlvI/nv7vor5HmoLflvI/lt7Lms6jlhaVcbiAqL1xuZnVuY3Rpb24gZW5zdXJlSW10U3R5bGUoKTogdm9pZCB7XG4gIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoSU1UX1NUWUxFX0lEKSkge1xuICAgIGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWwuaWQgPSBJTVRfU1RZTEVfSUQ7XG4gICAgc3R5bGVFbC50ZXh0Q29udGVudCA9IElNVF9DU1M7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcbiAgfVxufVxuXG4vKipcbiAqIOaJp+ihjCBpbmplY3RCaWxpbmd1YWwg5pON5L2cXG4gKiDmlK/mjIHkuInnp43mqKHlvI86IGluamVjdO+8iOazqOWFpee/u+ivke+8iS8gdG9nZ2xl77yI5YiH5o2i5pi+56S6L+makOiXj++8iS8gY2xlYXLvvIjmuIXpmaTmiYDmnInnv7vor5HvvIlcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUluamVjdEJpbGluZ3VhbChhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBBY3Rpb25SZXN1bHQge1xuICBjb25zdCBtb2RlID0gYWN0aW9uLmluamVjdE1vZGUgfHwgJ2luamVjdCc7XG5cbiAgc3dpdGNoIChtb2RlKSB7XG4gICAgY2FzZSAnaW5qZWN0Jzoge1xuICAgICAgaWYgKCFhY3Rpb24udHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2luamVjdCDmqKHlvI/pnIDopoEgdHJhbnNsYXRpb25zIOWPguaVsO+8iEpTT04g5a2X56ym5Liy77yJJyB9O1xuICAgICAgfVxuXG4gICAgICBsZXQgaXRlbXM6IEFycmF5PHsgaWQ6IHN0cmluZzsgdHJhbnNsYXRlZDogc3RyaW5nIH0+O1xuICAgICAgdHJ5IHtcbiAgICAgICAgaXRlbXMgPSBKU09OLnBhcnNlKGFjdGlvbi50cmFuc2xhdGlvbnMpO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3RyYW5zbGF0aW9ucyDlj4LmlbAgSlNPTiDop6PmnpDlpLHotKUnIH07XG4gICAgICB9XG5cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShpdGVtcykpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAndHJhbnNsYXRpb25zIOW/hemhu+aYr+aVsOe7hCcgfTtcbiAgICAgIH1cblxuICAgICAgZW5zdXJlSW10U3R5bGUoKTtcblxuICAgICAgbGV0IGluamVjdGVkID0gMDtcbiAgICAgIGxldCBza2lwcGVkID0gMDtcblxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgIGlmICghaXRlbS5pZCB8fCAhaXRlbS50cmFuc2xhdGVkKSB7XG4gICAgICAgICAgc2tpcHBlZCsrO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pbXQtaWQ9XCIke2l0ZW0uaWR9XCJdYCk7XG4gICAgICAgIGlmICghb3JpZ2luYWwpIHtcbiAgICAgICAgICBza2lwcGVkKys7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDpgb/lhY3ph43lpI3ms6jlhaXvvJrmo4Dmn6XmmK/lkKblt7LmnInlkIwgaWQg55qE57+76K+RXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nVHJhbnNsYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuaW10LXRyYW5zbGF0aW9uW2RhdGEtaW10LXNvdXJjZT1cIiR7aXRlbS5pZH1cIl1gKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nVHJhbnNsYXRpb24pIHtcbiAgICAgICAgICAvLyDmm7TmlrDnjrDmnInnv7vor5FcbiAgICAgICAgICBleGlzdGluZ1RyYW5zbGF0aW9uLnRleHRDb250ZW50ID0gaXRlbS50cmFuc2xhdGVkO1xuICAgICAgICAgIGV4aXN0aW5nVHJhbnNsYXRpb24uY2xhc3NMaXN0LnJlbW92ZSgnaW10LWhpZGRlbicpO1xuICAgICAgICAgIGluamVjdGVkKys7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDliJvlu7rnv7vor5HmrrXokL1cbiAgICAgICAgY29uc3QgdHJhbnNsYXRlZEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRyYW5zbGF0ZWRFbC5jbGFzc05hbWUgPSAnaW10LXRyYW5zbGF0aW9uJztcbiAgICAgICAgdHJhbnNsYXRlZEVsLnNldEF0dHJpYnV0ZSgnZGF0YS1pbXQtc291cmNlJywgaXRlbS5pZCk7XG4gICAgICAgIHRyYW5zbGF0ZWRFbC50ZXh0Q29udGVudCA9IGl0ZW0udHJhbnNsYXRlZDtcblxuICAgICAgICAvLyDmj5LlhaXliLDljp/mlofmrrXokL3kuYvlkI5cbiAgICAgICAgb3JpZ2luYWwucGFyZW50Tm9kZT8uaW5zZXJ0QmVmb3JlKHRyYW5zbGF0ZWRFbCwgb3JpZ2luYWwubmV4dFNpYmxpbmcpO1xuICAgICAgICBpbmplY3RlZCsrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBkYXRhOiB7IG1vZGU6ICdpbmplY3QnLCBpbmplY3RlZCwgc2tpcHBlZCwgdG90YWw6IGl0ZW1zLmxlbmd0aCB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjYXNlICd0b2dnbGUnOiB7XG4gICAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW10LXRyYW5zbGF0aW9uJyk7XG4gICAgICBpZiAodHJhbnNsYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IG1vZGU6ICd0b2dnbGUnLCBtZXNzYWdlOiAn5rKh5pyJ5bey5rOo5YWl55qE57+76K+RJywgdG9nZ2xlZDogMCB9IH07XG4gICAgICB9XG5cbiAgICAgIC8vIOajgOafpeW9k+WJjeeKtuaAge+8iOagueaNruesrOS4gOS4que/u+ivkeauteiQveWIpOaWre+8iVxuICAgICAgY29uc3QgaXNIaWRkZW4gPSB0cmFuc2xhdGlvbnNbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbXQtaGlkZGVuJyk7XG5cbiAgICAgIHRyYW5zbGF0aW9ucy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBpZiAoaXNIaWRkZW4pIHtcbiAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpbXQtaGlkZGVuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnaW10LWhpZGRlbicpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGU6ICd0b2dnbGUnLFxuICAgICAgICAgIG5ld1N0YXRlOiBpc0hpZGRlbiA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nLFxuICAgICAgICAgIHRvZ2dsZWQ6IHRyYW5zbGF0aW9ucy5sZW5ndGgsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ2NsZWFyJzoge1xuICAgICAgY29uc3QgdHJhbnNsYXRpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmltdC10cmFuc2xhdGlvbicpO1xuICAgICAgY29uc3QgY291bnQgPSB0cmFuc2xhdGlvbnMubGVuZ3RoO1xuICAgICAgdHJhbnNsYXRpb25zLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XG5cbiAgICAgIC8vIOWQjOaXtuenu+mZpCBkYXRhLWltdC1pZCDlsZ7mgKdcbiAgICAgIGNvbnN0IHRhZ2dlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWltdC1pZF0nKTtcbiAgICAgIHRhZ2dlZC5mb3JFYWNoKChlbCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWltdC1pZCcpKTtcblxuICAgICAgLy8g56e76Zmk5qC35byPXG4gICAgICBjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoSU1UX1NUWUxFX0lEKTtcbiAgICAgIGlmIChzdHlsZUVsKSB7IHN0eWxlRWwucmVtb3ZlKCk7IH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgZGF0YTogeyBtb2RlOiAnY2xlYXInLCByZW1vdmVkOiBjb3VudCB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5LiN5pSv5oyB55qEIGluamVjdEJpbGluZ3VhbCDmqKHlvI86ICR7bW9kZX1gIH07XG4gIH1cbn1cblxuLyoqXG4gKiDkuLvmiafooYzlhaXlj6Mg4oCUIOagueaNriBhY3Rpb24udHlwZSDliIblj5HliLDlr7nlupTmiafooYzlh73mlbBcbiAqXG4gKiDms6jmhI/vvJpzY3JlZW5zaG90IOaTjeS9nOmcgOimgeWcqCBiYWNrZ3JvdW5kIHNjcmlwdCDkuK3kvb/nlKggY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWLvvIxcbiAqIGNvbnRlbnQgc2NyaXB0IOaXoOazleaJp+ihjOatpOaTjeS9nO+8jOi/lOWbnueJueauiuagh+iusOeUsSBiYWNrZ3JvdW5kIOWkhOeQhuOAglxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUFjdGlvbihhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBQcm9taXNlPEFjdGlvblJlc3VsdD4ge1xuICB0cnkge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVDbGljayhhY3Rpb24pO1xuXG4gICAgICBjYXNlICd0eXBlJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVUeXBlKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ3Njcm9sbCc6XG4gICAgICAgIHJldHVybiBleGVjdXRlU2Nyb2xsKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ25hdmlnYXRlJzpcbiAgICAgICAgLy8gbmF2aWdhdGUg5ZyoIGNvbnRlbnQgc2NyaXB0IOS4remAmui/hyBsb2NhdGlvbi5ocmVmIOWunueOsFxuICAgICAgICBpZiAoIWFjdGlvbi51cmwpIHtcbiAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICduYXZpZ2F0ZSDmk43kvZzpnIDopoEgdXJsIOWPguaVsCcgfTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFjdGlvbi51cmw7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgbmF2aWdhdGVkOiBhY3Rpb24udXJsIH0gfTtcblxuICAgICAgY2FzZSAncXVlcnlTZWxlY3Rvcic6XG4gICAgICAgIHJldHVybiBleGVjdXRlUXVlcnlTZWxlY3RvcihhY3Rpb24pO1xuXG4gICAgICBjYXNlICdxdWVyeVNlbGVjdG9yQWxsJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVRdWVyeVNlbGVjdG9yQWxsKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ2dldFRleHRDb250ZW50JzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVHZXRUZXh0Q29udGVudChhY3Rpb24pO1xuXG4gICAgICBjYXNlICdnZXRBdHRyaWJ1dGUnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUdldEF0dHJpYnV0ZShhY3Rpb24pO1xuXG4gICAgICBjYXNlICdnZXRWYWx1ZSc6XG4gICAgICAgIHJldHVybiBleGVjdXRlR2V0VmFsdWUoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnc2NyZWVuc2hvdCc6XG4gICAgICAgIC8vIHNjcmVlbnNob3Qg6ZyA6KaBIGJhY2tncm91bmQgc2NyaXB0IOadg+mZkO+8jGNvbnRlbnQgc2NyaXB0IOi/lOWbnueJueauiuagh+iusFxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdfX1NDUkVFTlNIT1RfTkVFRFNfQkFDS0dST1VORF9fJyB9O1xuXG4gICAgICBjYXNlICd3YWl0Rm9yRWxlbWVudCc6XG4gICAgICAgIHJldHVybiBleGVjdXRlV2FpdEZvckVsZW1lbnQoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnaGlnaGxpZ2h0JzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVIaWdobGlnaHQoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnZXZhbHVhdGUnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUV2YWx1YXRlKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdE9wdGlvbic6XG4gICAgICAgIHJldHVybiBleGVjdXRlU2VsZWN0T3B0aW9uKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ2dldExpbmtzJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVHZXRMaW5rcyhhY3Rpb24pO1xuXG4gICAgICAvLyDilIDilIAgZXZvX3YxOV8wMDE6IOayiea1uOW8j+e/u+ivkeW3peWFtyDilIDilIBcbiAgICAgIGNhc2UgJ2V4dHJhY3RQYXJhZ3JhcGhzJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVFeHRyYWN0UGFyYWdyYXBocyhhY3Rpb24pO1xuXG4gICAgICBjYXNlICdpbmplY3RCaWxpbmd1YWwnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUluamVjdEJpbGluZ3VhbChhY3Rpb24pO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDkuI3mlK/mjIHnmoTmk43kvZznsbvlnos6ICR7KGFjdGlvbiBhcyBCcm93c2VyQWN0aW9uKS50eXBlfWAgfTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBg5omn6KGM5pON5L2cICR7YWN0aW9uLnR5cGV9IOWksei0pTogJHtlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycil9YCxcbiAgICB9O1xuICB9XG59XG4iLCIvLyBjb250ZW50LnRzIOKAlCBDb250ZW50IFNjcmlwdO+8jOazqOWFpemhtemdoumHh+mbhuS4iuS4i+aWh+S/oeaBr++8iFVSTCAvIOagh+mimCAvIOmAieS4reaWh+acrO+8iVxuLy8g55uR5ZCs5p2l6IeqIGJhY2tncm91bmQg55qE5LiK5LiL5paH6K+35rGC77yM5a6e5pe26YeH6ZuG5bm26L+U5ZueXG4vLyDlop7lvLrvvJrmjqXmlLYgRVhFQ1VURV9BQ1RJT04g5raI5oGv77yM5omn6KGM5rWP6KeI5ZmoIERPTSDmk43kvZzvvIhjbGljay90eXBlL3Njcm9sbCDnrYnvvIlcbi8vIOmihOaIquaWre+8mnNlbGVjdGVkVGV4dCDlnKjph4fpm4bmupDlpLTljbPmiKrmlq3vvIzpmLLmraLkuIrkuIvmlofniIbngrhcblxuaW1wb3J0IHsgZXhlY3V0ZUFjdGlvbiB9IGZyb20gJy4uL3V0aWxzL2FjdGlvbi1leGVjdXRvcic7XG5pbXBvcnQgdHlwZSB7IEJyb3dzZXJBY3Rpb24sIEFjdGlvblJlc3VsdCB9IGZyb20gJy4uL3V0aWxzL2FjdGlvbi1leGVjdXRvcic7XG5cbi8vIOKUgOKUgOKUgCDkuIrkuIvmlofpooTnrpfluLjph4/vvIjkuI4gdnNjb2RlLWV4dC9jb250ZXh0LWJ1ZGdldC50cyDkv53mjIHkuIDoh7TvvIkg4pSA4pSA4pSAXG5jb25zdCBNQVhfU0VMRUNURURfVEVYVF9DSEFSUyA9IDgwMDA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFnZUNvbnRleHQge1xuICB1cmw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgc2VsZWN0ZWRUZXh0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbnRlbnRTY3JpcHQoe1xuICBtYXRjaGVzOiBbJzxhbGxfdXJscz4nXSxcbiAgbWFpbigpIHtcbiAgICBjb25zb2xlLmxvZygnW2NvbnRlbnRdIEJyb3dzZXIgQWdlbnQgY29udGVudCBzY3JpcHQgbG9hZGVkIG9uOicsIGxvY2F0aW9uLmhyZWYpO1xuXG4gICAgLy8g5ZON5bqU5p2l6IeqIGJhY2tncm91bmQgLyBzaWRlIHBhbmVsIOeahOS4iuS4i+aWh+ivt+axglxuICAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIF9zZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ0dFVF9QQUdFX0NPTlRFWFQnKSB7XG4gICAgICAgIGNvbnN0IHJhd1NlbGVjdGVkID0gd2luZG93LmdldFNlbGVjdGlvbigpPy50b1N0cmluZygpIHx8ICcnO1xuICAgICAgICBjb25zdCBzZWxlY3RlZFRleHQgPSByYXdTZWxlY3RlZC5zdWJzdHJpbmcoMCwgTUFYX1NFTEVDVEVEX1RFWFRfQ0hBUlMpO1xuICAgICAgICBjb25zdCBjb250ZXh0OiBQYWdlQ29udGV4dCA9IHtcbiAgICAgICAgICB1cmw6IGxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgIHNlbGVjdGVkVGV4dCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJhd1NlbGVjdGVkLmxlbmd0aCA+IE1BWF9TRUxFQ1RFRF9URVhUX0NIQVJTKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tjb250ZW50XSBzZWxlY3RlZFRleHQg5bey5oiq5patOicsIHJhd1NlbGVjdGVkLmxlbmd0aCwgJy0+JywgTUFYX1NFTEVDVEVEX1RFWFRfQ0hBUlMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdbY29udGVudF0g6YeH6ZuG6aG16Z2i5LiK5LiL5paHOicsIGNvbnRleHQudXJsLCAn6YCJ5Lit5paH5pys6ZW/5bqmOicsIGNvbnRleHQuc2VsZWN0ZWRUZXh0Lmxlbmd0aCk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7IHR5cGU6ICdQQUdFX0NPTlRFWFQnLCBwYXlsb2FkOiBjb250ZXh0IH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8g6KGo56S65byC5q2l5ZON5bqUXG4gICAgICB9XG5cbiAgICAgIC8vIOa1j+iniOWZqOaTjeS9nOaJp+ihjOW8leaTjuWFpeWPo1xuICAgICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ0VYRUNVVEVfQUNUSU9OJykge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBtZXNzYWdlLnBheWxvYWQgYXMgQnJvd3NlckFjdGlvbjtcbiAgICAgICAgY29uc29sZS5sb2coJ1tjb250ZW50XSDmiafooYzmtY/op4jlmajmk43kvZw6JywgYWN0aW9uLnR5cGUsIGFjdGlvbi5zZWxlY3RvciB8fCAnJyk7XG5cbiAgICAgICAgLy8gZXhlY3V0ZUFjdGlvbiDlj6/og73ov5Tlm54gUHJvbWlzZe+8iOWmgiB3YWl0Rm9yRWxlbWVudO+8ie+8jOe7n+S4gOeUqCBhc3luYyDlpITnkIZcbiAgICAgICAgZXhlY3V0ZUFjdGlvbihhY3Rpb24pXG4gICAgICAgICAgLnRoZW4oKHJlc3VsdDogQWN0aW9uUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW2NvbnRlbnRdIOaTjeS9nOe7k+aenDonLCBhY3Rpb24udHlwZSwgcmVzdWx0LnN1Y2Nlc3MpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgdHlwZTogJ0FDVElPTl9SRVNVTFQnLCBwYXlsb2FkOiByZXN1bHQgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNc2cgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbY29udGVudF0g5pON5L2c5omn6KGM5byC5bi4OicsIGFjdGlvbi50eXBlLCBlcnJvck1zZyk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICB0eXBlOiAnQUNUSU9OX1JFU1VMVCcsXG4gICAgICAgICAgICAgIHBheWxvYWQ6IHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvck1zZyB9IHNhdGlzZmllcyBBY3Rpb25SZXN1bHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIOW8guatpeWTjeW6lFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyDnm5HlkKzpgInkuK3mlofmnKzlj5jljJbvvIzkuLvliqjmjqjpgIHnu5kgYmFja2dyb3VuZO+8iOWQjOagt+mihOaIquaWre+8iVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3NlbGVjdGlvbmNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJhd1NlbGVjdGVkID0gd2luZG93LmdldFNlbGVjdGlvbigpPy50b1N0cmluZygpIHx8ICcnO1xuICAgICAgaWYgKHJhd1NlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gcmF3U2VsZWN0ZWQuc3Vic3RyaW5nKDAsIE1BWF9TRUxFQ1RFRF9URVhUX0NIQVJTKTtcbiAgICAgICAgaWYgKHJhd1NlbGVjdGVkLmxlbmd0aCA+IE1BWF9TRUxFQ1RFRF9URVhUX0NIQVJTKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tjb250ZW50XSBzZWxlY3Rpb25jaGFuZ2Ug5oiq5patOicsIHJhd1NlbGVjdGVkLmxlbmd0aCwgJy0+JywgTUFYX1NFTEVDVEVEX1RFWFRfQ0hBUlMpO1xuICAgICAgICB9XG4gICAgICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgdHlwZTogJ1NFTEVDVElPTl9DSEFOR0VEJyxcbiAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICB1cmw6IGxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUsXG4gICAgICAgICAgICBzZWxlY3RlZFRleHQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgIC8vIHNpZGUgcGFuZWwg5Y+v6IO95pyq5omT5byA77yM5b+955WlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxufSk7XG4iLCJmdW5jdGlvbiBwcmludChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgaWYgKGltcG9ydC5tZXRhLmVudi5NT0RFID09PSBcInByb2R1Y3Rpb25cIikgcmV0dXJuO1xuICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXJncy5zaGlmdCgpO1xuICAgIG1ldGhvZChgW3d4dF0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xuICB9XG59XG5leHBvcnQgY29uc3QgbG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuICBsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG4gIHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuZXhwb3J0IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIGNvbnN0cnVjdG9yKG5ld1VybCwgb2xkVXJsKSB7XG4gICAgc3VwZXIoV3h0TG9jYXRpb25DaGFuZ2VFdmVudC5FVkVOVF9OQU1FLCB7fSk7XG4gICAgdGhpcy5uZXdVcmwgPSBuZXdVcmw7XG4gICAgdGhpcy5vbGRVcmwgPSBvbGRVcmw7XG4gIH1cbiAgc3RhdGljIEVWRU5UX05BTUUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIik7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuICByZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4iLCJpbXBvcnQgeyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG4gIGxldCBpbnRlcnZhbDtcbiAgbGV0IG9sZFVybDtcbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhlIGxvY2F0aW9uIHdhdGNoZXIgaXMgYWN0aXZlbHkgbG9va2luZyBmb3IgVVJMIGNoYW5nZXMuIElmIGl0J3MgYWxyZWFkeSB3YXRjaGluZyxcbiAgICAgKiB0aGlzIGlzIGEgbm9vcC5cbiAgICAgKi9cbiAgICBydW4oKSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgIT0gbnVsbCkgcmV0dXJuO1xuICAgICAgb2xkVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgIGludGVydmFsID0gY3R4LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgICAgIGlmIChuZXdVcmwuaHJlZiAhPT0gb2xkVXJsLmhyZWYpIHtcbiAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIG9sZFVybCkpO1xuICAgICAgICAgIG9sZFVybCA9IG5ld1VybDtcbiAgICAgICAgfVxuICAgICAgfSwgMWUzKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwiLi4vLi4vc2FuZGJveC91dGlscy9sb2dnZXIubWpzXCI7XG5pbXBvcnQgeyBnZXRVbmlxdWVFdmVudE5hbWUgfSBmcm9tIFwiLi9jdXN0b20tZXZlbnRzLm1qc1wiO1xuaW1wb3J0IHsgY3JlYXRlTG9jYXRpb25XYXRjaGVyIH0gZnJvbSBcIi4vbG9jYXRpb24td2F0Y2hlci5tanNcIjtcbmV4cG9ydCBjbGFzcyBDb250ZW50U2NyaXB0Q29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgaWYgKHRoaXMuaXNUb3BGcmFtZSkge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JOZXdlclNjcmlwdHMoeyBpZ25vcmVGaXJzdEV2ZW50OiB0cnVlIH0pO1xuICAgICAgdGhpcy5zdG9wT2xkU2NyaXB0cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cygpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFID0gZ2V0VW5pcXVlRXZlbnROYW1lKFxuICAgIFwid3h0OmNvbnRlbnQtc2NyaXB0LXN0YXJ0ZWRcIlxuICApO1xuICBpc1RvcEZyYW1lID0gd2luZG93LnNlbGYgPT09IHdpbmRvdy50b3A7XG4gIGFib3J0Q29udHJvbGxlcjtcbiAgbG9jYXRpb25XYXRjaGVyID0gY3JlYXRlTG9jYXRpb25XYXRjaGVyKHRoaXMpO1xuICByZWNlaXZlZE1lc3NhZ2VJZHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBnZXQgc2lnbmFsKCkge1xuICAgIHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gIH1cbiAgYWJvcnQocmVhc29uKSB7XG4gICAgcmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLmFib3J0KHJlYXNvbik7XG4gIH1cbiAgZ2V0IGlzSW52YWxpZCgpIHtcbiAgICBpZiAoYnJvd3Nlci5ydW50aW1lLmlkID09IG51bGwpIHtcbiAgICAgIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2lnbmFsLmFib3J0ZWQ7XG4gIH1cbiAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzSW52YWxpZDtcbiAgfVxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBzY3JpcHQncyBjb250ZXh0IGlzIGludmFsaWRhdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuICAgKiBjb25zdCByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyID0gY3R4Lm9uSW52YWxpZGF0ZWQoKCkgPT4ge1xuICAgKiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIoY2IpO1xuICAgKiB9KVxuICAgKiAvLyAuLi5cbiAgICogcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuICAgKi9cbiAgb25JbnZhbGlkYXRlZChjYikge1xuICAgIHRoaXMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBhIHByb21pc2UgdGhhdCBuZXZlciByZXNvbHZlcy4gVXNlZnVsIGlmIHlvdSBoYXZlIGFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgc2hvdWxkbid0IHJ1blxuICAgKiBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBnZXRWYWx1ZUZyb21TdG9yYWdlID0gYXN5bmMgKCkgPT4ge1xuICAgKiAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG4gICAqXG4gICAqICAgLy8gLi4uXG4gICAqIH1cbiAgICovXG4gIGJsb2NrKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsIHdoZW4gaW52YWxpZGF0ZWQuXG4gICAqL1xuICBzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0VGltZW91dGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuICAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0SWRsZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaWQgPSByZXF1ZXN0SWRsZUNhbGxiYWNrKCguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc2lnbmFsLmFib3J0ZWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgIH0sIG9wdGlvbnMpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxJZGxlQ2FsbGJhY2soaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgYWRkRXZlbnRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIikge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgdGhpcy5sb2NhdGlvbldhdGNoZXIucnVuKCk7XG4gICAgfVxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyPy4oXG4gICAgICB0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSxcbiAgICAgIGhhbmRsZXIsXG4gICAgICB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHNpZ25hbDogdGhpcy5zaWduYWxcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQWJvcnQgdGhlIGFib3J0IGNvbnRyb2xsZXIgYW5kIGV4ZWN1dGUgYWxsIGBvbkludmFsaWRhdGVkYCBsaXN0ZW5lcnMuXG4gICAqL1xuICBub3RpZnlJbnZhbGlkYXRlZCgpIHtcbiAgICB0aGlzLmFib3J0KFwiQ29udGVudCBzY3JpcHQgY29udGV4dCBpbnZhbGlkYXRlZFwiKTtcbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBgQ29udGVudCBzY3JpcHQgXCIke3RoaXMuY29udGVudFNjcmlwdE5hbWV9XCIgY29udGV4dCBpbnZhbGlkYXRlZGBcbiAgICApO1xuICB9XG4gIHN0b3BPbGRTY3JpcHRzKCkge1xuICAgIHdpbmRvdy5wb3N0TWVzc2FnZShcbiAgICAgIHtcbiAgICAgICAgdHlwZTogQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLFxuICAgICAgICBjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcbiAgICAgICAgbWVzc2FnZUlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKVxuICAgICAgfSxcbiAgICAgIFwiKlwiXG4gICAgKTtcbiAgfVxuICB2ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpIHtcbiAgICBjb25zdCBpc1NjcmlwdFN0YXJ0ZWRFdmVudCA9IGV2ZW50LmRhdGE/LnR5cGUgPT09IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRTtcbiAgICBjb25zdCBpc1NhbWVDb250ZW50U2NyaXB0ID0gZXZlbnQuZGF0YT8uY29udGVudFNjcmlwdE5hbWUgPT09IHRoaXMuY29udGVudFNjcmlwdE5hbWU7XG4gICAgY29uc3QgaXNOb3REdXBsaWNhdGUgPSAhdGhpcy5yZWNlaXZlZE1lc3NhZ2VJZHMuaGFzKGV2ZW50LmRhdGE/Lm1lc3NhZ2VJZCk7XG4gICAgcmV0dXJuIGlzU2NyaXB0U3RhcnRlZEV2ZW50ICYmIGlzU2FtZUNvbnRlbnRTY3JpcHQgJiYgaXNOb3REdXBsaWNhdGU7XG4gIH1cbiAgbGlzdGVuRm9yTmV3ZXJTY3JpcHRzKG9wdGlvbnMpIHtcbiAgICBsZXQgaXNGaXJzdCA9IHRydWU7XG4gICAgY29uc3QgY2IgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICh0aGlzLnZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkpIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlZE1lc3NhZ2VJZHMuYWRkKGV2ZW50LmRhdGEubWVzc2FnZUlkKTtcbiAgICAgICAgY29uc3Qgd2FzRmlyc3QgPSBpc0ZpcnN0O1xuICAgICAgICBpc0ZpcnN0ID0gZmFsc2U7XG4gICAgICAgIGlmICh3YXNGaXJzdCAmJiBvcHRpb25zPy5pZ25vcmVGaXJzdEV2ZW50KSByZXR1cm47XG4gICAgICAgIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gcmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgY2IpKTtcbiAgfVxufVxuIiwiY29uc3QgbnVsbEtleSA9IFN5bWJvbCgnbnVsbCcpOyAvLyBgb2JqZWN0SGFzaGVzYCBrZXkgZm9yIG51bGxcblxubGV0IGtleUNvdW50ZXIgPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYW55S2V5c01hcCBleHRlbmRzIE1hcCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9vYmplY3RIYXNoZXMgPSBuZXcgV2Vha01hcCgpO1xuXHRcdHRoaXMuX3N5bWJvbEhhc2hlcyA9IG5ldyBNYXAoKTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvZWNtYTI2Mi9pc3N1ZXMvMTE5NFxuXHRcdHRoaXMuX3B1YmxpY0tleXMgPSBuZXcgTWFwKCk7XG5cblx0XHRjb25zdCBbcGFpcnNdID0gYXJndW1lbnRzOyAvLyBNYXAgY29tcGF0XG5cdFx0aWYgKHBhaXJzID09PSBudWxsIHx8IHBhaXJzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHBhaXJzW1N5bWJvbC5pdGVyYXRvcl0gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IodHlwZW9mIHBhaXJzICsgJyBpcyBub3QgaXRlcmFibGUgKGNhbm5vdCByZWFkIHByb3BlcnR5IFN5bWJvbChTeW1ib2wuaXRlcmF0b3IpKScpO1xuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgW2tleXMsIHZhbHVlXSBvZiBwYWlycykge1xuXHRcdFx0dGhpcy5zZXQoa2V5cywgdmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRQdWJsaWNLZXlzKGtleXMsIGNyZWF0ZSA9IGZhbHNlKSB7XG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KGtleXMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUga2V5cyBwYXJhbWV0ZXIgbXVzdCBiZSBhbiBhcnJheScpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHByaXZhdGVLZXkgPSB0aGlzLl9nZXRQcml2YXRlS2V5KGtleXMsIGNyZWF0ZSk7XG5cblx0XHRsZXQgcHVibGljS2V5O1xuXHRcdGlmIChwcml2YXRlS2V5ICYmIHRoaXMuX3B1YmxpY0tleXMuaGFzKHByaXZhdGVLZXkpKSB7XG5cdFx0XHRwdWJsaWNLZXkgPSB0aGlzLl9wdWJsaWNLZXlzLmdldChwcml2YXRlS2V5KTtcblx0XHR9IGVsc2UgaWYgKGNyZWF0ZSkge1xuXHRcdFx0cHVibGljS2V5ID0gWy4uLmtleXNdOyAvLyBSZWdlbmVyYXRlIGtleXMgYXJyYXkgdG8gYXZvaWQgZXh0ZXJuYWwgaW50ZXJhY3Rpb25cblx0XHRcdHRoaXMuX3B1YmxpY0tleXMuc2V0KHByaXZhdGVLZXksIHB1YmxpY0tleSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtwcml2YXRlS2V5LCBwdWJsaWNLZXl9O1xuXHR9XG5cblx0X2dldFByaXZhdGVLZXkoa2V5cywgY3JlYXRlID0gZmFsc2UpIHtcblx0XHRjb25zdCBwcml2YXRlS2V5cyA9IFtdO1xuXHRcdGZvciAobGV0IGtleSBvZiBrZXlzKSB7XG5cdFx0XHRpZiAoa2V5ID09PSBudWxsKSB7XG5cdFx0XHRcdGtleSA9IG51bGxLZXk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhhc2hlcyA9IHR5cGVvZiBrZXkgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicgPyAnX29iamVjdEhhc2hlcycgOiAodHlwZW9mIGtleSA9PT0gJ3N5bWJvbCcgPyAnX3N5bWJvbEhhc2hlcycgOiBmYWxzZSk7XG5cblx0XHRcdGlmICghaGFzaGVzKSB7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2goa2V5KTtcblx0XHRcdH0gZWxzZSBpZiAodGhpc1toYXNoZXNdLmhhcyhrZXkpKSB7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2godGhpc1toYXNoZXNdLmdldChrZXkpKTtcblx0XHRcdH0gZWxzZSBpZiAoY3JlYXRlKSB7XG5cdFx0XHRcdGNvbnN0IHByaXZhdGVLZXkgPSBgQEBta20tcmVmLSR7a2V5Q291bnRlcisrfUBAYDtcblx0XHRcdFx0dGhpc1toYXNoZXNdLnNldChrZXksIHByaXZhdGVLZXkpO1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKHByaXZhdGVLZXkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShwcml2YXRlS2V5cyk7XG5cdH1cblxuXHRzZXQoa2V5cywgdmFsdWUpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cywgdHJ1ZSk7XG5cdFx0cmV0dXJuIHN1cGVyLnNldChwdWJsaWNLZXksIHZhbHVlKTtcblx0fVxuXG5cdGdldChrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBzdXBlci5nZXQocHVibGljS2V5KTtcblx0fVxuXG5cdGhhcyhrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBzdXBlci5oYXMocHVibGljS2V5KTtcblx0fVxuXG5cdGRlbGV0ZShrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleSwgcHJpdmF0ZUtleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBCb29sZWFuKHB1YmxpY0tleSAmJiBzdXBlci5kZWxldGUocHVibGljS2V5KSAmJiB0aGlzLl9wdWJsaWNLZXlzLmRlbGV0ZShwcml2YXRlS2V5KSk7XG5cdH1cblxuXHRjbGVhcigpIHtcblx0XHRzdXBlci5jbGVhcigpO1xuXHRcdHRoaXMuX3N5bWJvbEhhc2hlcy5jbGVhcigpO1xuXHRcdHRoaXMuX3B1YmxpY0tleXMuY2xlYXIoKTtcblx0fVxuXG5cdGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcblx0XHRyZXR1cm4gJ01hbnlLZXlzTWFwJztcblx0fVxuXG5cdGdldCBzaXplKCkge1xuXHRcdHJldHVybiBzdXBlci5zaXplO1xuXHR9XG59XG4iLCJpbXBvcnQgTWFueUtleXNNYXAgZnJvbSAnbWFueS1rZXlzLW1hcCc7XG5pbXBvcnQgeyBkZWZ1IH0gZnJvbSAnZGVmdSc7XG5pbXBvcnQgeyBpc0V4aXN0IH0gZnJvbSAnLi9kZXRlY3RvcnMubWpzJztcblxuY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSAoKSA9PiAoe1xuICB0YXJnZXQ6IGdsb2JhbFRoaXMuZG9jdW1lbnQsXG4gIHVuaWZ5UHJvY2VzczogdHJ1ZSxcbiAgZGV0ZWN0b3I6IGlzRXhpc3QsXG4gIG9ic2VydmVDb25maWdzOiB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gICAgYXR0cmlidXRlczogdHJ1ZVxuICB9LFxuICBzaWduYWw6IHZvaWQgMCxcbiAgY3VzdG9tTWF0Y2hlcjogdm9pZCAwXG59KTtcbmNvbnN0IG1lcmdlT3B0aW9ucyA9ICh1c2VyU2lkZU9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKSA9PiB7XG4gIHJldHVybiBkZWZ1KHVzZXJTaWRlT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xufTtcblxuY29uc3QgdW5pZnlDYWNoZSA9IG5ldyBNYW55S2V5c01hcCgpO1xuZnVuY3Rpb24gY3JlYXRlV2FpdEVsZW1lbnQoaW5zdGFuY2VPcHRpb25zKSB7XG4gIGNvbnN0IHsgZGVmYXVsdE9wdGlvbnMgfSA9IGluc3RhbmNlT3B0aW9ucztcbiAgcmV0dXJuIChzZWxlY3Rvciwgb3B0aW9ucykgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHRhcmdldCxcbiAgICAgIHVuaWZ5UHJvY2VzcyxcbiAgICAgIG9ic2VydmVDb25maWdzLFxuICAgICAgZGV0ZWN0b3IsXG4gICAgICBzaWduYWwsXG4gICAgICBjdXN0b21NYXRjaGVyXG4gICAgfSA9IG1lcmdlT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG4gICAgY29uc3QgdW5pZnlQcm9taXNlS2V5ID0gW1xuICAgICAgc2VsZWN0b3IsXG4gICAgICB0YXJnZXQsXG4gICAgICB1bmlmeVByb2Nlc3MsXG4gICAgICBvYnNlcnZlQ29uZmlncyxcbiAgICAgIGRldGVjdG9yLFxuICAgICAgc2lnbmFsLFxuICAgICAgY3VzdG9tTWF0Y2hlclxuICAgIF07XG4gICAgY29uc3QgY2FjaGVkUHJvbWlzZSA9IHVuaWZ5Q2FjaGUuZ2V0KHVuaWZ5UHJvbWlzZUtleSk7XG4gICAgaWYgKHVuaWZ5UHJvY2VzcyAmJiBjYWNoZWRQcm9taXNlKSB7XG4gICAgICByZXR1cm4gY2FjaGVkUHJvbWlzZTtcbiAgICB9XG4gICAgY29uc3QgZGV0ZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgLy8gYmlvbWUtaWdub3JlIGxpbnQvc3VzcGljaW91cy9ub0FzeW5jUHJvbWlzZUV4ZWN1dG9yOiBhdm9pZCBuZXN0aW5nIHByb21pc2VcbiAgICAgIGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgICAgICBhc3luYyAobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IF8gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc3QgZGV0ZWN0UmVzdWx0MiA9IGF3YWl0IGRldGVjdEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgICAgICBkZXRlY3RvcixcbiAgICAgICAgICAgICAgICBjdXN0b21NYXRjaGVyXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoZGV0ZWN0UmVzdWx0Mi5pc0RldGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGV0ZWN0UmVzdWx0Mi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBzaWduYWw/LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgXCJhYm9ydFwiLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJldHVybiByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBkZXRlY3RSZXN1bHQgPSBhd2FpdCBkZXRlY3RFbGVtZW50KHtcbiAgICAgICAgICBzZWxlY3RvcixcbiAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgZGV0ZWN0b3IsXG4gICAgICAgICAgY3VzdG9tTWF0Y2hlclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGRldGVjdFJlc3VsdC5pc0RldGVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGV0ZWN0UmVzdWx0LnJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIG9ic2VydmVDb25maWdzKTtcbiAgICAgIH1cbiAgICApLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgdW5pZnlDYWNoZS5kZWxldGUodW5pZnlQcm9taXNlS2V5KTtcbiAgICB9KTtcbiAgICB1bmlmeUNhY2hlLnNldCh1bmlmeVByb21pc2VLZXksIGRldGVjdFByb21pc2UpO1xuICAgIHJldHVybiBkZXRlY3RQcm9taXNlO1xuICB9O1xufVxuYXN5bmMgZnVuY3Rpb24gZGV0ZWN0RWxlbWVudCh7XG4gIHRhcmdldCxcbiAgc2VsZWN0b3IsXG4gIGRldGVjdG9yLFxuICBjdXN0b21NYXRjaGVyXG59KSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBjdXN0b21NYXRjaGVyID8gY3VzdG9tTWF0Y2hlcihzZWxlY3RvcikgOiB0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIHJldHVybiBhd2FpdCBkZXRlY3RvcihlbGVtZW50KTtcbn1cbmNvbnN0IHdhaXRFbGVtZW50ID0gY3JlYXRlV2FpdEVsZW1lbnQoe1xuICBkZWZhdWx0T3B0aW9uczogZ2V0RGVmYXVsdE9wdGlvbnMoKVxufSk7XG5cbmV4cG9ydCB7IGNyZWF0ZVdhaXRFbGVtZW50LCBnZXREZWZhdWx0T3B0aW9ucywgd2FpdEVsZW1lbnQgfTtcbiJdLCJuYW1lcyI6WyJkZWZpbml0aW9uIiwidGhpcyIsIm1vZHVsZSIsInByb3h5VGFyZ2V0IiwidmFsdWUiLCJyZXN1bHQiLCJtZXNzYWdlIiwicHJpbnQiLCJsb2dnZXIiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sV0FBUyxvQkFBb0JBLGFBQVk7QUFDOUMsV0FBT0E7QUFBQSxFQUNUOzs7Ozs7Ozs7OztBQ0ZBLE9BQUMsU0FBVSxRQUFRLFNBQVM7QUFHaUI7QUFDekMsa0JBQVEsTUFBTTtBQUFBLFFBQ2xCO0FBQUEsTUFPQSxHQUFHLE9BQU8sZUFBZSxjQUFjLGFBQWEsT0FBTyxTQUFTLGNBQWMsT0FBT0MsaUJBQU0sU0FBVUMsU0FBUTtBQVMvRyxZQUFJLEVBQUUsV0FBVyxVQUFVLFdBQVcsT0FBTyxXQUFXLFdBQVcsT0FBTyxRQUFRLEtBQUs7QUFDckYsZ0JBQU0sSUFBSSxNQUFNLDJEQUEyRDtBQUFBLFFBQy9FO0FBQ0UsWUFBSSxFQUFFLFdBQVcsV0FBVyxXQUFXLFFBQVEsV0FBVyxXQUFXLFFBQVEsUUFBUSxLQUFLO0FBQ3hGLGdCQUFNLG1EQUFtRDtBQU96RCxnQkFBTSxXQUFXLG1CQUFpQjtBQUloQyxrQkFBTSxjQUFjO0FBQUEsY0FDbEIsVUFBVTtBQUFBLGdCQUNSLFNBQVM7QUFBQSxrQkFDUCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLE9BQU87QUFBQSxrQkFDTCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsYUFBYTtBQUFBLGdCQUNYLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLE9BQU87QUFBQSxrQkFDTCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGVBQWU7QUFBQSxrQkFDYixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGFBQWE7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGNBQWM7QUFBQSxrQkFDWixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFdBQVc7QUFBQSxrQkFDVCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFFBQVE7QUFBQSxrQkFDTixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGNBQWM7QUFBQSxrQkFDWixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsaUJBQWlCO0FBQUEsZ0JBQ2YsV0FBVztBQUFBLGtCQUNULFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsd0JBQXdCO0FBQUE7Z0JBRTFCLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBO2dCQUUxQiwyQkFBMkI7QUFBQSxrQkFDekIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixnQkFBZ0I7QUFBQSxrQkFDZCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGFBQWE7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLDJCQUEyQjtBQUFBLGtCQUN6QixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBO2dCQUUxQixnQkFBZ0I7QUFBQSxrQkFDZCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBO2dCQUUxQixXQUFXO0FBQUEsa0JBQ1QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixZQUFZO0FBQUEsa0JBQ1YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCx3QkFBd0I7QUFBQTtnQkFFMUIsWUFBWTtBQUFBLGtCQUNWLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsd0JBQXdCO0FBQUEsZ0JBQ3BDO0FBQUE7Y0FFUSxnQkFBZ0I7QUFBQSxnQkFDZCxVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixlQUFlO0FBQUEsa0JBQ2IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixpQkFBaUI7QUFBQSxrQkFDZixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLG1CQUFtQjtBQUFBLGtCQUNqQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGtCQUFrQjtBQUFBLGtCQUNoQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGlCQUFpQjtBQUFBLGtCQUNmLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsc0JBQXNCO0FBQUEsa0JBQ3BCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsbUJBQW1CO0FBQUEsa0JBQ2pCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsb0JBQW9CO0FBQUEsa0JBQ2xCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsWUFBWTtBQUFBLGtCQUNWLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxZQUFZO0FBQUEsZ0JBQ1YsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxnQkFBZ0I7QUFBQSxnQkFDZCxVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLFdBQVc7QUFBQSxnQkFDVCxPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixzQkFBc0I7QUFBQSxrQkFDcEIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLFlBQVk7QUFBQSxnQkFDVixtQkFBbUI7QUFBQSxrQkFDakIsUUFBUTtBQUFBLG9CQUNOLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUEsb0JBQ1gscUJBQXFCO0FBQUEsa0JBQ25DO0FBQUE7Z0JBRVUsVUFBVTtBQUFBLGtCQUNSLFVBQVU7QUFBQSxvQkFDUixXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBLG9CQUNYLHFCQUFxQjtBQUFBO2tCQUV2QixZQUFZO0FBQUEsb0JBQ1YscUJBQXFCO0FBQUEsc0JBQ25CLFdBQVc7QUFBQSxzQkFDWCxXQUFXO0FBQUEsb0JBQzNCO0FBQUEsa0JBQ0E7QUFBQSxnQkFDQTtBQUFBO2NBRVEsYUFBYTtBQUFBLGdCQUNYLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFNBQVM7QUFBQSxrQkFDUCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGVBQWU7QUFBQSxrQkFDYixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFFBQVE7QUFBQSxrQkFDTixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBO2dCQUUxQixTQUFTO0FBQUEsa0JBQ1AsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixjQUFjO0FBQUEsa0JBQ1osV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixRQUFRO0FBQUEsa0JBQ04sV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCx3QkFBd0I7QUFBQSxnQkFDcEM7QUFBQTtjQUVRLGFBQWE7QUFBQSxnQkFDWCw2QkFBNkI7QUFBQSxrQkFDM0IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYiw0QkFBNEI7QUFBQSxrQkFDMUIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLFdBQVc7QUFBQSxnQkFDVCxVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixlQUFlO0FBQUEsa0JBQ2IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLFFBQVE7QUFBQSxnQkFDTixrQkFBa0I7QUFBQSxrQkFDaEIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixzQkFBc0I7QUFBQSxrQkFDcEIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLFlBQVk7QUFBQSxnQkFDVixxQkFBcUI7QUFBQSxrQkFDbkIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLFFBQVE7QUFBQSxnQkFDTixjQUFjO0FBQUEsa0JBQ1osV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLGNBQWM7QUFBQSxnQkFDWixPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixXQUFXO0FBQUEsa0JBQ1QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixjQUFjO0FBQUEsa0JBQ1osV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixpQkFBaUI7QUFBQSxrQkFDZixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsaUJBQWlCO0FBQUEsZ0JBQ2YsU0FBUztBQUFBLGtCQUNQLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsc0JBQXNCO0FBQUEsa0JBQ3BCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxjQUFjO0FBQUEsZ0JBQ1osWUFBWTtBQUFBLGtCQUNWLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsWUFBWTtBQUFBLGtCQUNWLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsUUFBUTtBQUFBLGtCQUNOLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsd0JBQXdCO0FBQUE7Z0JBRTFCLFdBQVc7QUFBQSxrQkFDVCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBO2dCQUUxQixZQUFZO0FBQUEsa0JBQ1YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCx3QkFBd0I7QUFBQTtnQkFFMUIsUUFBUTtBQUFBLGtCQUNOLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsd0JBQXdCO0FBQUEsZ0JBQ3BDO0FBQUE7Y0FFUSxlQUFlO0FBQUEsZ0JBQ2IsWUFBWTtBQUFBLGtCQUNWLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsV0FBVztBQUFBLGtCQUNULFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxXQUFXO0FBQUEsZ0JBQ1QscUJBQXFCO0FBQUEsa0JBQ25CLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsbUJBQW1CO0FBQUEsa0JBQ2pCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsbUJBQW1CO0FBQUEsa0JBQ2pCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsc0JBQXNCO0FBQUEsa0JBQ3BCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsZUFBZTtBQUFBLGtCQUNiLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIscUJBQXFCO0FBQUEsa0JBQ25CLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsbUJBQW1CO0FBQUEsa0JBQ2pCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxZQUFZO0FBQUEsZ0JBQ1YsY0FBYztBQUFBLGtCQUNaLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIscUJBQXFCO0FBQUEsa0JBQ25CLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsV0FBVztBQUFBLGtCQUNULFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxXQUFXO0FBQUEsZ0JBQ1QsU0FBUztBQUFBLGtCQUNQLFNBQVM7QUFBQSxvQkFDUCxXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLE9BQU87QUFBQSxvQkFDTCxXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLGlCQUFpQjtBQUFBLG9CQUNmLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUE7a0JBRWIsVUFBVTtBQUFBLG9CQUNSLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUE7a0JBRWIsT0FBTztBQUFBLG9CQUNMLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUEsa0JBQ3pCO0FBQUE7Z0JBRVUsV0FBVztBQUFBLGtCQUNULE9BQU87QUFBQSxvQkFDTCxXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLGlCQUFpQjtBQUFBLG9CQUNmLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUEsa0JBQ3pCO0FBQUE7Z0JBRVUsUUFBUTtBQUFBLGtCQUNOLFNBQVM7QUFBQSxvQkFDUCxXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLE9BQU87QUFBQSxvQkFDTCxXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLGlCQUFpQjtBQUFBLG9CQUNmLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUE7a0JBRWIsVUFBVTtBQUFBLG9CQUNSLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUE7a0JBRWIsT0FBTztBQUFBLG9CQUNMLFdBQVc7QUFBQSxvQkFDWCxXQUFXO0FBQUEsa0JBQ3pCO0FBQUEsZ0JBQ0E7QUFBQTtjQUVRLFFBQVE7QUFBQSxnQkFDTixxQkFBcUI7QUFBQSxrQkFDbkIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixrQkFBa0I7QUFBQSxrQkFDaEIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixXQUFXO0FBQUEsa0JBQ1QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixpQkFBaUI7QUFBQSxrQkFDZixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLE9BQU87QUFBQSxrQkFDTCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGNBQWM7QUFBQSxrQkFDWixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFdBQVc7QUFBQSxrQkFDVCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLG1CQUFtQjtBQUFBLGtCQUNqQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGFBQWE7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGFBQWE7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGFBQWE7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFFBQVE7QUFBQSxrQkFDTixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFNBQVM7QUFBQSxrQkFDUCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGFBQWE7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGVBQWU7QUFBQSxrQkFDYixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFdBQVc7QUFBQSxrQkFDVCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLG1CQUFtQjtBQUFBLGtCQUNqQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsWUFBWTtBQUFBLGdCQUNWLE9BQU87QUFBQSxrQkFDTCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsaUJBQWlCO0FBQUEsZ0JBQ2YsZ0JBQWdCO0FBQUEsa0JBQ2QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixZQUFZO0FBQUEsa0JBQ1YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLGNBQWM7QUFBQSxnQkFDWiwwQkFBMEI7QUFBQSxrQkFDeEIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLFdBQVc7QUFBQSxnQkFDVCxVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixjQUFjO0FBQUEsa0JBQ1osV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixrQkFBa0I7QUFBQSxrQkFDaEIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQSxjQUNBO0FBQUE7QUFFTSxnQkFBSSxPQUFPLEtBQUssV0FBVyxFQUFFLFdBQVcsR0FBRztBQUN6QyxvQkFBTSxJQUFJLE1BQU0sNkRBQTZEO0FBQUEsWUFDckY7QUFBQSxZQVlNLE1BQU0sdUJBQXVCLFFBQVE7QUFBQSxjQUNuQyxZQUFZLFlBQVksUUFBUSxRQUFXO0FBQ3pDLHNCQUFNLEtBQUs7QUFDWCxxQkFBSyxhQUFhO0FBQUEsY0FDNUI7QUFBQSxjQUNRLElBQUksS0FBSztBQUNQLG9CQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsR0FBRztBQUNsQix1QkFBSyxJQUFJLEtBQUssS0FBSyxXQUFXLEdBQUcsQ0FBQztBQUFBLGdCQUM5QztBQUNVLHVCQUFPLE1BQU0sSUFBSSxHQUFHO0FBQUEsY0FDOUI7QUFBQSxZQUNBO0FBU00sa0JBQU0sYUFBYSxXQUFTO0FBQzFCLHFCQUFPLFNBQVMsT0FBTyxVQUFVLFlBQVksT0FBTyxNQUFNLFNBQVM7QUFBQSxZQUMzRTtBQWlDTSxrQkFBTSxlQUFlLENBQUMsU0FBUyxhQUFhO0FBQzFDLHFCQUFPLElBQUksaUJBQWlCO0FBQzFCLG9CQUFJLGNBQWMsUUFBUSxXQUFXO0FBQ25DLDBCQUFRLE9BQU8sSUFBSSxNQUFNLGNBQWMsUUFBUSxVQUFVLE9BQU8sQ0FBQztBQUFBLGdCQUM3RSxXQUFxQixTQUFTLHFCQUFxQixhQUFhLFVBQVUsS0FBSyxTQUFTLHNCQUFzQixPQUFPO0FBQ3pHLDBCQUFRLFFBQVEsYUFBYSxDQUFDLENBQUM7QUFBQSxnQkFDM0MsT0FBaUI7QUFDTCwwQkFBUSxRQUFRLFlBQVk7QUFBQSxnQkFDeEM7QUFBQSxjQUNBO0FBQUEsWUFDQTtBQUNNLGtCQUFNLHFCQUFxQixhQUFXLFdBQVcsSUFBSSxhQUFhO0FBNEJsRSxrQkFBTSxvQkFBb0IsQ0FBQyxNQUFNLGFBQWE7QUFDNUMscUJBQU8sU0FBUyxxQkFBcUIsV0FBVyxNQUFNO0FBQ3BELG9CQUFJLEtBQUssU0FBUyxTQUFTLFNBQVM7QUFDbEMsd0JBQU0sSUFBSSxNQUFNLHFCQUFxQixTQUFTLE9BQU8sSUFBSSxtQkFBbUIsU0FBUyxPQUFPLENBQUMsUUFBUSxJQUFJLFdBQVcsS0FBSyxNQUFNLEVBQUU7QUFBQSxnQkFDN0k7QUFDVSxvQkFBSSxLQUFLLFNBQVMsU0FBUyxTQUFTO0FBQ2xDLHdCQUFNLElBQUksTUFBTSxvQkFBb0IsU0FBUyxPQUFPLElBQUksbUJBQW1CLFNBQVMsT0FBTyxDQUFDLFFBQVEsSUFBSSxXQUFXLEtBQUssTUFBTSxFQUFFO0FBQUEsZ0JBQzVJO0FBQ1UsdUJBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLHNCQUFJLFNBQVMsc0JBQXNCO0FBSWpDLHdCQUFJO0FBQ0YsNkJBQU8sSUFBSSxFQUFFLEdBQUcsTUFBTSxhQUFhO0FBQUEsd0JBQ2pDO0FBQUEsd0JBQ0E7QUFBQSx5QkFDQyxRQUFRLENBQUM7QUFBQSxvQkFDNUIsU0FBdUIsU0FBUztBQUNoQiw4QkFBUSxLQUFLLEdBQUcsSUFBSSw0R0FBaUgsT0FBTztBQUM1SSw2QkFBTyxJQUFJLEVBQUUsR0FBRyxJQUFJO0FBSXBCLCtCQUFTLHVCQUF1QjtBQUNoQywrQkFBUyxhQUFhO0FBQ3RCLDhCQUFPO0FBQUEsb0JBQ3ZCO0FBQUEsa0JBQ0EsV0FBdUIsU0FBUyxZQUFZO0FBQzlCLDJCQUFPLElBQUksRUFBRSxHQUFHLElBQUk7QUFDcEIsNEJBQU87QUFBQSxrQkFDckIsT0FBbUI7QUFDTCwyQkFBTyxJQUFJLEVBQUUsR0FBRyxNQUFNLGFBQWE7QUFBQSxzQkFDakM7QUFBQSxzQkFDQTtBQUFBLHVCQUNDLFFBQVEsQ0FBQztBQUFBLGtCQUMxQjtBQUFBLGdCQUNBLENBQVc7QUFBQSxjQUNYO0FBQUEsWUFDQTtBQXFCTSxrQkFBTSxhQUFhLENBQUMsUUFBUSxRQUFRLFlBQVk7QUFDOUMscUJBQU8sSUFBSSxNQUFNLFFBQVE7QUFBQSxnQkFDdkIsTUFBTSxjQUFjLFNBQVMsTUFBTTtBQUNqQyx5QkFBTyxRQUFRLEtBQUssU0FBUyxRQUFRLEdBQUcsSUFBSTtBQUFBLGdCQUN4RDtBQUFBLGNBQ0EsQ0FBUztBQUFBLFlBQ1Q7QUFDTSxnQkFBSSxpQkFBaUIsU0FBUyxLQUFLLEtBQUssT0FBTyxVQUFVLGNBQWM7QUF5QnZFLGtCQUFNLGFBQWEsQ0FBQyxRQUFRLFdBQVcsQ0FBQSxHQUFJLFdBQVcsT0FBTztBQUMzRCxrQkFBSSxRQUFRLHVCQUFPLE9BQU8sSUFBSTtBQUM5QixrQkFBSSxXQUFXO0FBQUEsZ0JBQ2IsSUFBSUMsY0FBYSxNQUFNO0FBQ3JCLHlCQUFPLFFBQVEsVUFBVSxRQUFRO0FBQUEsZ0JBQzdDO0FBQUEsZ0JBQ1UsSUFBSUEsY0FBYSxNQUFNLFVBQVU7QUFDL0Isc0JBQUksUUFBUSxPQUFPO0FBQ2pCLDJCQUFPLE1BQU0sSUFBSTtBQUFBLGtCQUMvQjtBQUNZLHNCQUFJLEVBQUUsUUFBUSxTQUFTO0FBQ3JCLDJCQUFPO0FBQUEsa0JBQ3JCO0FBQ1ksc0JBQUksUUFBUSxPQUFPLElBQUk7QUFDdkIsc0JBQUksT0FBTyxVQUFVLFlBQVk7QUFJL0Isd0JBQUksT0FBTyxTQUFTLElBQUksTUFBTSxZQUFZO0FBRXhDLDhCQUFRLFdBQVcsUUFBUSxPQUFPLElBQUksR0FBRyxTQUFTLElBQUksQ0FBQztBQUFBLG9CQUN2RSxXQUF5QixlQUFlLFVBQVUsSUFBSSxHQUFHO0FBR3pDLDBCQUFJLFVBQVUsa0JBQWtCLE1BQU0sU0FBUyxJQUFJLENBQUM7QUFDcEQsOEJBQVEsV0FBVyxRQUFRLE9BQU8sSUFBSSxHQUFHLE9BQU87QUFBQSxvQkFDaEUsT0FBcUI7QUFHTCw4QkFBUSxNQUFNLEtBQUssTUFBTTtBQUFBLG9CQUN6QztBQUFBLGtCQUNBLFdBQXVCLE9BQU8sVUFBVSxZQUFZLFVBQVUsU0FBUyxlQUFlLFVBQVUsSUFBSSxLQUFLLGVBQWUsVUFBVSxJQUFJLElBQUk7QUFJNUgsNEJBQVEsV0FBVyxPQUFPLFNBQVMsSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDO0FBQUEsa0JBQ3RFLFdBQXVCLGVBQWUsVUFBVSxHQUFHLEdBQUc7QUFFeEMsNEJBQVEsV0FBVyxPQUFPLFNBQVMsSUFBSSxHQUFHLFNBQVMsR0FBRyxDQUFDO0FBQUEsa0JBQ3JFLE9BQW1CO0FBR0wsMkJBQU8sZUFBZSxPQUFPLE1BQU07QUFBQSxzQkFDakMsY0FBYztBQUFBLHNCQUNkLFlBQVk7QUFBQSxzQkFDWixNQUFNO0FBQ0osK0JBQU8sT0FBTyxJQUFJO0FBQUEsc0JBQ3BDO0FBQUEsc0JBQ2dCLElBQUlDLFFBQU87QUFDVCwrQkFBTyxJQUFJLElBQUlBO0FBQUEsc0JBQ2pDO0FBQUEsb0JBQ0EsQ0FBZTtBQUNELDJCQUFPO0FBQUEsa0JBQ3JCO0FBQ1ksd0JBQU0sSUFBSSxJQUFJO0FBQ2QseUJBQU87QUFBQSxnQkFDbkI7QUFBQSxnQkFDVSxJQUFJRCxjQUFhLE1BQU0sT0FBTyxVQUFVO0FBQ3RDLHNCQUFJLFFBQVEsT0FBTztBQUNqQiwwQkFBTSxJQUFJLElBQUk7QUFBQSxrQkFDNUIsT0FBbUI7QUFDTCwyQkFBTyxJQUFJLElBQUk7QUFBQSxrQkFDN0I7QUFDWSx5QkFBTztBQUFBLGdCQUNuQjtBQUFBLGdCQUNVLGVBQWVBLGNBQWEsTUFBTSxNQUFNO0FBQ3RDLHlCQUFPLFFBQVEsZUFBZSxPQUFPLE1BQU0sSUFBSTtBQUFBLGdCQUMzRDtBQUFBLGdCQUNVLGVBQWVBLGNBQWEsTUFBTTtBQUNoQyx5QkFBTyxRQUFRLGVBQWUsT0FBTyxJQUFJO0FBQUEsZ0JBQ3JEO0FBQUE7QUFhUSxrQkFBSSxjQUFjLE9BQU8sT0FBTyxNQUFNO0FBQ3RDLHFCQUFPLElBQUksTUFBTSxhQUFhLFFBQVE7QUFBQSxZQUM5QztBQWtCTSxrQkFBTSxZQUFZLGlCQUFlO0FBQUEsY0FDL0IsWUFBWSxRQUFRLGFBQWEsTUFBTTtBQUNyQyx1QkFBTyxZQUFZLFdBQVcsSUFBSSxRQUFRLEdBQUcsR0FBRyxJQUFJO0FBQUEsY0FDOUQ7QUFBQSxjQUNRLFlBQVksUUFBUSxVQUFVO0FBQzVCLHVCQUFPLE9BQU8sWUFBWSxXQUFXLElBQUksUUFBUSxDQUFDO0FBQUEsY0FDNUQ7QUFBQSxjQUNRLGVBQWUsUUFBUSxVQUFVO0FBQy9CLHVCQUFPLGVBQWUsV0FBVyxJQUFJLFFBQVEsQ0FBQztBQUFBLGNBQ3hEO0FBQUEsWUFDQTtBQUNNLGtCQUFNLDRCQUE0QixJQUFJLGVBQWUsY0FBWTtBQUMvRCxrQkFBSSxPQUFPLGFBQWEsWUFBWTtBQUNsQyx1QkFBTztBQUFBLGNBQ2pCO0FBVVEscUJBQU8sU0FBUyxrQkFBa0IsS0FBSztBQUNyQyxzQkFBTSxhQUFhLFdBQVcsS0FBSyxJQUFtQjtBQUFBLGtCQUNwRCxZQUFZO0FBQUEsb0JBQ1YsU0FBUztBQUFBLG9CQUNULFNBQVM7QUFBQSxrQkFDdkI7QUFBQSxnQkFDQSxDQUFXO0FBQ0QseUJBQVMsVUFBVTtBQUFBLGNBQzdCO0FBQUEsWUFDQSxDQUFPO0FBQ0Qsa0JBQU0sb0JBQW9CLElBQUksZUFBZSxjQUFZO0FBQ3ZELGtCQUFJLE9BQU8sYUFBYSxZQUFZO0FBQ2xDLHVCQUFPO0FBQUEsY0FDakI7QUFtQlEscUJBQU8sU0FBUyxVQUFVLFNBQVMsUUFBUSxjQUFjO0FBQ3ZELG9CQUFJLHNCQUFzQjtBQUMxQixvQkFBSTtBQUNKLG9CQUFJLHNCQUFzQixJQUFJLFFBQVEsYUFBVztBQUMvQyx3Q0FBc0IsU0FBVSxVQUFVO0FBQ3hDLDBDQUFzQjtBQUN0Qiw0QkFBUSxRQUFRO0FBQUEsa0JBQzlCO0FBQUEsZ0JBQ0EsQ0FBVztBQUNELG9CQUFJRTtBQUNKLG9CQUFJO0FBQ0Ysa0JBQUFBLFVBQVMsU0FBUyxTQUFTLFFBQVEsbUJBQW1CO0FBQUEsZ0JBQ2xFLFNBQW1CLEtBQUs7QUFDWixrQkFBQUEsVUFBUyxRQUFRLE9BQU8sR0FBRztBQUFBLGdCQUN2QztBQUNVLHNCQUFNLG1CQUFtQkEsWUFBVyxRQUFRLFdBQVdBLE9BQU07QUFLN0Qsb0JBQUlBLFlBQVcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLHFCQUFxQjtBQUNoRSx5QkFBTztBQUFBLGdCQUNuQjtBQU1VLHNCQUFNLHFCQUFxQixhQUFXO0FBQ3BDLDBCQUFRLEtBQUssU0FBTztBQUVsQixpQ0FBYSxHQUFHO0FBQUEsa0JBQzlCLEdBQWUsV0FBUztBQUdWLHdCQUFJQztBQUNKLHdCQUFJLFVBQVUsaUJBQWlCLFNBQVMsT0FBTyxNQUFNLFlBQVksV0FBVztBQUMxRSxzQkFBQUEsV0FBVSxNQUFNO0FBQUEsb0JBQ2hDLE9BQXFCO0FBQ0wsc0JBQUFBLFdBQVU7QUFBQSxvQkFDMUI7QUFDYyxpQ0FBYTtBQUFBLHNCQUNYLG1DQUFtQztBQUFBLHNCQUNuQyxTQUFBQTtBQUFBLG9CQUNoQixDQUFlO0FBQUEsa0JBQ2YsQ0FBYSxFQUFFLE1BQU0sU0FBTztBQUVkLDRCQUFRLE1BQU0sMkNBQTJDLEdBQUc7QUFBQSxrQkFDMUUsQ0FBYTtBQUFBLGdCQUNiO0FBS1Usb0JBQUksa0JBQWtCO0FBQ3BCLHFDQUFtQkQsT0FBTTtBQUFBLGdCQUNyQyxPQUFpQjtBQUNMLHFDQUFtQixtQkFBbUI7QUFBQSxnQkFDbEQ7QUFHVSx1QkFBTztBQUFBLGNBQ2pCO0FBQUEsWUFDQSxDQUFPO0FBQ0Qsa0JBQU0sNkJBQTZCLENBQUM7QUFBQSxjQUNsQztBQUFBLGNBQ0E7QUFBQSxlQUNDLFVBQVU7QUFDWCxrQkFBSSxjQUFjLFFBQVEsV0FBVztBQUluQyxvQkFBSSxjQUFjLFFBQVEsVUFBVSxZQUFZLGtEQUFrRDtBQUNoRywwQkFBTztBQUFBLGdCQUNuQixPQUFpQjtBQUNMLHlCQUFPLElBQUksTUFBTSxjQUFjLFFBQVEsVUFBVSxPQUFPLENBQUM7QUFBQSxnQkFDckU7QUFBQSxjQUNBLFdBQW1CLFNBQVMsTUFBTSxtQ0FBbUM7QUFHM0QsdUJBQU8sSUFBSSxNQUFNLE1BQU0sT0FBTyxDQUFDO0FBQUEsY0FDekMsT0FBZTtBQUNMLHdCQUFRLEtBQUs7QUFBQSxjQUN2QjtBQUFBLFlBQ0E7QUFDTSxrQkFBTSxxQkFBcUIsQ0FBQyxNQUFNLFVBQVUsb0JBQW9CLFNBQVM7QUFDdkUsa0JBQUksS0FBSyxTQUFTLFNBQVMsU0FBUztBQUNsQyxzQkFBTSxJQUFJLE1BQU0scUJBQXFCLFNBQVMsT0FBTyxJQUFJLG1CQUFtQixTQUFTLE9BQU8sQ0FBQyxRQUFRLElBQUksV0FBVyxLQUFLLE1BQU0sRUFBRTtBQUFBLGNBQzNJO0FBQ1Esa0JBQUksS0FBSyxTQUFTLFNBQVMsU0FBUztBQUNsQyxzQkFBTSxJQUFJLE1BQU0sb0JBQW9CLFNBQVMsT0FBTyxJQUFJLG1CQUFtQixTQUFTLE9BQU8sQ0FBQyxRQUFRLElBQUksV0FBVyxLQUFLLE1BQU0sRUFBRTtBQUFBLGNBQzFJO0FBQ1EscUJBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLHNCQUFNLFlBQVksMkJBQTJCLEtBQUssTUFBTTtBQUFBLGtCQUN0RDtBQUFBLGtCQUNBO0FBQUEsZ0JBQ1osQ0FBVztBQUNELHFCQUFLLEtBQUssU0FBUztBQUNuQixnQ0FBZ0IsWUFBWSxHQUFHLElBQUk7QUFBQSxjQUM3QyxDQUFTO0FBQUEsWUFDVDtBQUNNLGtCQUFNLGlCQUFpQjtBQUFBLGNBQ3JCLFVBQVU7QUFBQSxnQkFDUixTQUFTO0FBQUEsa0JBQ1AsbUJBQW1CLFVBQVUseUJBQXlCO0FBQUEsZ0JBQ2xFO0FBQUE7Y0FFUSxTQUFTO0FBQUEsZ0JBQ1AsV0FBVyxVQUFVLGlCQUFpQjtBQUFBLGdCQUN0QyxtQkFBbUIsVUFBVSxpQkFBaUI7QUFBQSxnQkFDOUMsYUFBYSxtQkFBbUIsS0FBSyxNQUFNLGVBQWU7QUFBQSxrQkFDeEQsU0FBUztBQUFBLGtCQUNULFNBQVM7QUFBQSxpQkFDVjtBQUFBO2NBRUgsTUFBTTtBQUFBLGdCQUNKLGFBQWEsbUJBQW1CLEtBQUssTUFBTSxlQUFlO0FBQUEsa0JBQ3hELFNBQVM7QUFBQSxrQkFDVCxTQUFTO0FBQUEsaUJBQ1Y7QUFBQSxjQUNYO0FBQUE7QUFFTSxrQkFBTSxrQkFBa0I7QUFBQSxjQUN0QixPQUFPO0FBQUEsZ0JBQ0wsU0FBUztBQUFBLGdCQUNULFNBQVM7QUFBQTtjQUVYLEtBQUs7QUFBQSxnQkFDSCxTQUFTO0FBQUEsZ0JBQ1QsU0FBUztBQUFBO2NBRVgsS0FBSztBQUFBLGdCQUNILFNBQVM7QUFBQSxnQkFDVCxTQUFTO0FBQUEsY0FDbkI7QUFBQTtBQUVNLHdCQUFZLFVBQVU7QUFBQSxjQUNwQixTQUFTO0FBQUEsZ0JBQ1AsS0FBSztBQUFBO2NBRVAsVUFBVTtBQUFBLGdCQUNSLEtBQUs7QUFBQTtjQUVQLFVBQVU7QUFBQSxnQkFDUixLQUFLO0FBQUEsY0FDZjtBQUFBO0FBRU0sbUJBQU8sV0FBVyxlQUFlLGdCQUFnQixXQUFXO0FBQUEsVUFDbEU7QUFJSSxVQUFBSCxRQUFPLFVBQVUsU0FBUyxNQUFNO0FBQUEsUUFDcEMsT0FBUztBQUNMLFVBQUFBLFFBQU8sVUFBVSxXQUFXO0FBQUEsUUFDaEM7QUFBQSxNQUNBLENBQUM7QUFBQTs7Ozs7QUN0c0NNLFFBQU0sVUFBVTtBQzRGdkIsV0FBUyxtQkFBbUIsSUFBMEI7QUFDcEQsVUFBTSxTQUFTO0FBQ2YsVUFBTSxVQUFVO0FBQ2hCLFVBQU0sV0FBVztBQUNqQixVQUFNLFFBQVE7QUFFZCxXQUFPO0FBQUEsTUFDTCxTQUFTLEdBQUcsUUFBUSxZQUFBO0FBQUEsTUFDcEIsSUFBSSxHQUFHLE1BQU07QUFBQSxNQUNiLFdBQVcsR0FBRyxhQUFhO0FBQUEsTUFDM0IsY0FBYyxPQUFPLGVBQWUsSUFBSSxPQUFPLE1BQU0sR0FBRyxHQUFHO0FBQUEsTUFDM0QsR0FBSSxTQUFTLE9BQU8sRUFBRSxNQUFNLFNBQVMsS0FBQSxJQUFTLENBQUE7QUFBQSxNQUM5QyxHQUFJLE1BQU0sTUFBTSxFQUFFLEtBQUssTUFBTSxJQUFBLElBQVEsQ0FBQTtBQUFBLE1BQ3JDLEdBQUksUUFBUSxVQUFVLFVBQWEsUUFBUSxVQUFVLEtBQUssRUFBRSxPQUFPLFFBQVEsTUFBQSxJQUFVLENBQUE7QUFBQSxNQUNyRixHQUFJLFFBQVEsT0FBTyxFQUFFLE1BQU0sUUFBUSxLQUFBLElBQVMsQ0FBQTtBQUFBLE1BQzVDLEdBQUksUUFBUSxjQUFjLEVBQUUsYUFBYSxRQUFRLFlBQUEsSUFBZ0IsQ0FBQTtBQUFBLElBQUM7QUFBQSxFQUV0RTtBQUtBLFdBQVMsWUFBWSxVQUFrQixNQUErQjs7QUFDcEUsUUFBSSxNQUFNO0FBRVIsWUFBTSxhQUFhLFNBQVMsaUJBQWlCLFFBQVE7QUFDckQsaUJBQVcsTUFBTSxZQUFZO0FBQzNCLGFBQUssUUFBbUIsZ0JBQW5CLG1CQUFnQyxTQUFTLE9BQU87QUFDbkQsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQ0EsV0FBTyxTQUFTLGNBQWMsUUFBUTtBQUFBLEVBQ3hDO0FBTUEsV0FBUyxhQUFhLFFBQXFDO0FBQ3pELFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLHlCQUFBO0FBQUEsSUFDbEM7QUFDQSxVQUFNLEtBQUssWUFBWSxPQUFPLFVBQVUsT0FBTyxJQUFJO0FBQ25ELFFBQUksQ0FBQyxJQUFJO0FBQ1AsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLFVBQVUsT0FBTyxRQUFRLEdBQUcsT0FBTyxPQUFPLFlBQVksT0FBTyxJQUFJLE9BQU8sRUFBRSxHQUFBO0FBQUEsSUFDNUc7QUFDQyxPQUFtQixNQUFBO0FBQ3BCLFdBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLFNBQVMsT0FBTyxXQUFTO0FBQUEsRUFDM0Q7QUFNQSxXQUFTLFlBQVksUUFBcUM7O0FBQ3hELFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLHdCQUFBO0FBQUEsSUFDbEM7QUFDQSxRQUFJLE9BQU8sVUFBVSxRQUFXO0FBQzlCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxxQkFBQTtBQUFBLElBQ2xDO0FBQ0EsVUFBTSxLQUFLLFlBQVksT0FBTyxRQUFRO0FBQ3RDLFFBQUksQ0FBQyxJQUFJO0FBQ1AsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLFVBQVUsT0FBTyxRQUFRLEdBQUE7QUFBQSxJQUMzRDtBQUdBLE9BQUcsTUFBQTtBQUdILE9BQUcsUUFBUTtBQUNYLE9BQUcsY0FBYyxJQUFJLE1BQU0sU0FBUyxFQUFFLFNBQVMsS0FBQSxDQUFNLENBQUM7QUFJdEQsVUFBTSwwQkFBeUIsWUFBTztBQUFBLE1BQ3BDLE9BQU8sZUFBZSxFQUFFO0FBQUEsTUFDeEI7QUFBQSxJQUFBLE1BRjZCLG1CQUc1QjtBQUVILFFBQUksd0JBQXdCO0FBQzFCLDZCQUF1QixLQUFLLElBQUksT0FBTyxLQUFLO0FBQUEsSUFDOUMsT0FBTztBQUNMLFNBQUcsUUFBUSxPQUFPO0FBQUEsSUFDcEI7QUFHQSxPQUFHLGNBQWMsSUFBSSxNQUFNLFNBQVMsRUFBRSxTQUFTLEtBQUEsQ0FBTSxDQUFDO0FBQ3RELE9BQUcsY0FBYyxJQUFJLE1BQU0sVUFBVSxFQUFFLFNBQVMsS0FBQSxDQUFNLENBQUM7QUFFdkQsV0FBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsT0FBTyxPQUFPLE9BQU8sVUFBVSxPQUFPLFNBQUEsRUFBUztBQUFBLEVBQ2pGO0FBTUEsV0FBUyxjQUFjLFFBQXFDO0FBQzFELFVBQU0sT0FBTyxPQUFPLGNBQWM7QUFFbEMsWUFBUSxNQUFBO0FBQUEsTUFDTixLQUFLO0FBQ0gsZUFBTyxTQUFTLEVBQUUsS0FBSyxHQUFHLFVBQVUsVUFBVTtBQUM5QyxlQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sRUFBRSxVQUFVLFdBQVM7QUFBQSxNQUVyRCxLQUFLO0FBQ0gsZUFBTyxTQUFTLEVBQUUsS0FBSyxTQUFTLEtBQUssY0FBYyxVQUFVLFVBQVU7QUFDdkUsZUFBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsVUFBVSxjQUFZO0FBQUEsTUFFeEQsS0FBSyxhQUFhO0FBQ2hCLGNBQU0sU0FBUyxPQUFPLGdCQUFnQjtBQUN0QyxlQUFPLFNBQVMsRUFBRSxLQUFLLFFBQVEsVUFBVSxVQUFVO0FBQ25ELGVBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLFVBQVUsYUFBYSxTQUFPO0FBQUEsTUFDaEU7QUFBQSxNQUVBLEtBQUssY0FBYztBQUNqQixZQUFJLENBQUMsT0FBTyxVQUFVO0FBQ3BCLGlCQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8scUNBQUE7QUFBQSxRQUNsQztBQUNBLGNBQU0sS0FBSyxTQUFTLGNBQWMsT0FBTyxRQUFRO0FBQ2pELFlBQUksQ0FBQyxJQUFJO0FBQ1AsaUJBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxVQUFVLE9BQU8sUUFBUSxHQUFBO0FBQUEsUUFDM0Q7QUFDQSxXQUFHLGVBQWUsRUFBRSxVQUFVLFVBQVUsT0FBTyxVQUFVO0FBQ3pELGVBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLFVBQVUsY0FBYyxVQUFVLE9BQU8sV0FBUztBQUFBLE1BQ3BGO0FBQUEsTUFFQTtBQUNFLGVBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxhQUFhLElBQUksR0FBQTtBQUFBLElBQUc7QUFBQSxFQUUxRDtBQU1BLFdBQVMscUJBQXFCLFFBQXFDO0FBQ2pFLFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLGlDQUFBO0FBQUEsSUFDbEM7QUFDQSxVQUFNLEtBQUssU0FBUyxjQUFjLE9BQU8sUUFBUTtBQUNqRCxRQUFJLENBQUMsSUFBSTtBQUNQLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxVQUFVLE9BQU8sUUFBUSxHQUFBO0FBQUEsSUFDM0Q7QUFDQSxXQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sbUJBQW1CLEVBQUUsRUFBQTtBQUFBLEVBQ3JEO0FBTUEsV0FBUyx3QkFBd0IsUUFBcUM7QUFDcEUsUUFBSSxDQUFDLE9BQU8sVUFBVTtBQUNwQixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sb0NBQUE7QUFBQSxJQUNsQztBQUNBLFVBQU0sV0FBVyxTQUFTLGlCQUFpQixPQUFPLFFBQVE7QUFDMUQsVUFBTSxVQUF5QixDQUFBO0FBRS9CLFVBQU0sUUFBUSxLQUFLLElBQUksU0FBUyxRQUFRLE9BQU8sWUFBWSxFQUFFO0FBQzdELGFBQVMsSUFBSSxHQUFHLElBQUksT0FBTyxLQUFLO0FBQzlCLGNBQVEsS0FBSyxtQkFBbUIsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUFBLElBQzlDO0FBQ0EsV0FBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsT0FBTyxTQUFTLFFBQVEsVUFBVSxVQUFRO0FBQUEsRUFDNUU7QUFLQSxXQUFTLHNCQUFzQixRQUFxQzs7QUFDbEUsUUFBSSxDQUFDLE9BQU8sVUFBVTtBQUNwQixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sa0NBQUE7QUFBQSxJQUNsQztBQUNBLFVBQU0sS0FBSyxTQUFTLGNBQWMsT0FBTyxRQUFRO0FBQ2pELFFBQUksQ0FBQyxJQUFJO0FBQ1AsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLFVBQVUsT0FBTyxRQUFRLEdBQUE7QUFBQSxJQUMzRDtBQUNBLFdBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLGVBQWMsUUFBbUIsZ0JBQW5CLG1CQUFnQyxXQUFVLEtBQUc7QUFBQSxFQUM3RjtBQUtBLFdBQVMsb0JBQW9CLFFBQXFDO0FBQ2hFLFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLGdDQUFBO0FBQUEsSUFDbEM7QUFDQSxRQUFJLENBQUMsT0FBTyxlQUFlO0FBQ3pCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxxQ0FBQTtBQUFBLElBQ2xDO0FBQ0EsVUFBTSxLQUFLLFNBQVMsY0FBYyxPQUFPLFFBQVE7QUFDakQsUUFBSSxDQUFDLElBQUk7QUFDUCxhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sVUFBVSxPQUFPLFFBQVEsR0FBQTtBQUFBLElBQzNEO0FBQ0EsV0FBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsV0FBVyxPQUFPLGVBQWUsT0FBTyxHQUFHLGFBQWEsT0FBTyxhQUFhLElBQUU7QUFBQSxFQUNoSDtBQUtBLFdBQVMsZ0JBQWdCLFFBQXFDO0FBQzVELFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLDRCQUFBO0FBQUEsSUFDbEM7QUFDQSxVQUFNLEtBQUssU0FBUyxjQUFjLE9BQU8sUUFBUTtBQUNqRCxRQUFJLENBQUMsSUFBSTtBQUNQLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxVQUFVLE9BQU8sUUFBUSxHQUFBO0FBQUEsSUFDM0Q7QUFDQSxXQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sRUFBRSxPQUFPLEdBQUcsU0FBUyxLQUFHO0FBQUEsRUFDeEQ7QUFNQSxpQkFBZSxzQkFBc0IsUUFBOEM7QUFDakYsUUFBSSxDQUFDLE9BQU8sVUFBVTtBQUNwQixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sa0NBQUE7QUFBQSxJQUNsQztBQUVBLFVBQU0sVUFBVSxPQUFPLFdBQVc7QUFHbEMsVUFBTSxXQUFXLFNBQVMsY0FBYyxPQUFPLFFBQVE7QUFDdkQsUUFBSSxVQUFVO0FBQ1osYUFBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLG1CQUFtQixRQUFRLEVBQUE7QUFBQSxJQUMzRDtBQUVBLFdBQU8sSUFBSSxRQUFzQixDQUFDLFlBQVk7QUFDNUMsVUFBSSxXQUFXO0FBRWYsWUFBTSxXQUFXLElBQUksaUJBQWlCLE1BQU07QUFDMUMsY0FBTSxLQUFLLFNBQVMsY0FBYyxPQUFPLFFBQVM7QUFDbEQsWUFBSSxNQUFNLENBQUMsVUFBVTtBQUNuQixxQkFBVztBQUNYLG1CQUFTLFdBQUE7QUFDVCxrQkFBUSxFQUFFLFNBQVMsTUFBTSxNQUFNLG1CQUFtQixFQUFFLEdBQUc7QUFBQSxRQUN6RDtBQUFBLE1BQ0YsQ0FBQztBQUVELGVBQVMsUUFBUSxTQUFTLE1BQU0sRUFBRSxXQUFXLE1BQU0sU0FBUyxNQUFNO0FBR2xFLGlCQUFXLE1BQU07QUFDZixZQUFJLENBQUMsVUFBVTtBQUNiLHFCQUFXO0FBQ1gsbUJBQVMsV0FBQTtBQUNULGtCQUFRLEVBQUUsU0FBUyxPQUFPLE9BQU8sV0FBVyxPQUFPLFFBQVEsT0FBTyxRQUFRLEdBQUEsQ0FBSTtBQUFBLFFBQ2hGO0FBQUEsTUFDRixHQUFHLE9BQU87QUFBQSxJQUNaLENBQUM7QUFBQSxFQUNIO0FBTUEsV0FBUyxpQkFBaUIsUUFBcUM7QUFDN0QsUUFBSSxDQUFDLE9BQU8sVUFBVTtBQUNwQixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sNkJBQUE7QUFBQSxJQUNsQztBQUNBLFVBQU0sS0FBSyxTQUFTLGNBQWMsT0FBTyxRQUFRO0FBQ2pELFFBQUksQ0FBQyxJQUFJO0FBQ1AsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLFVBQVUsT0FBTyxRQUFRLEdBQUE7QUFBQSxJQUMzRDtBQUVBLFVBQU0sUUFBUSxPQUFPLGtCQUFrQjtBQUN2QyxVQUFNLFdBQVcsT0FBTyxxQkFBcUI7QUFHN0MsVUFBTSxrQkFBa0IsR0FBRyxNQUFNO0FBQ2pDLFVBQU0sa0JBQWtCLEdBQUcsTUFBTTtBQUdqQyxPQUFHLE1BQU0sVUFBVSxhQUFhLEtBQUs7QUFDckMsT0FBRyxNQUFNLGtCQUFrQjtBQUczQixlQUFXLE1BQU07QUFDZixTQUFHLE1BQU0sVUFBVTtBQUNuQixTQUFHLE1BQU0sa0JBQWtCO0FBQUEsSUFDN0IsR0FBRyxRQUFRO0FBRVgsV0FBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsYUFBYSxPQUFPLFVBQVUsV0FBUztBQUFBLEVBQ3pFO0FBTUEsaUJBQWUsZ0JBQWdCLFFBQThDO0FBQzNFLFFBQUksQ0FBQyxPQUFPLFlBQVk7QUFDdEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLDhCQUFBO0FBQUEsSUFDbEM7QUFDQSxRQUFJO0FBR0YsWUFBTSxLQUFLLElBQUksU0FBUyxPQUFPLFVBQVU7QUFDekMsWUFBTUcsVUFBUyxNQUFNLEdBQUE7QUFFckIsWUFBTSxhQUFhQSxZQUFXLFNBQVksT0FBTyxLQUFLLE1BQU0sS0FBSyxVQUFVQSxPQUFNLENBQUM7QUFDbEYsYUFBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsUUFBUSxhQUFXO0FBQUEsSUFDckQsU0FBUyxLQUFLO0FBQ1osYUFBTztBQUFBLFFBQ0wsU0FBUztBQUFBLFFBQ1QsT0FBTyxrQkFBa0IsZUFBZSxRQUFRLElBQUksVUFBVSxPQUFPLEdBQUcsQ0FBQztBQUFBLE1BQUE7QUFBQSxJQUU3RTtBQUFBLEVBQ0Y7QUFNQSxXQUFTLG9CQUFvQixRQUFxQztBQUNoRSxRQUFJLENBQUMsT0FBTyxVQUFVO0FBQ3BCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxnQ0FBQTtBQUFBLElBQ2xDO0FBQ0EsVUFBTSxLQUFLLFNBQVMsY0FBYyxPQUFPLFFBQVE7QUFDakQsUUFBSSxDQUFDLElBQUk7QUFDUCxhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sVUFBVSxPQUFPLFFBQVEsR0FBQTtBQUFBLElBQzNEO0FBQ0EsUUFBSSxHQUFHLFFBQVEsWUFBQSxNQUFrQixVQUFVO0FBQ3pDLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyx1QkFBdUIsR0FBRyxRQUFRLGFBQWEsSUFBQTtBQUFBLElBQ2pGO0FBRUEsUUFBSSxVQUFVO0FBQ2QsVUFBTSxVQUFVLEdBQUc7QUFFbkIsUUFBSSxPQUFPLGdCQUFnQixRQUFXO0FBRXBDLGVBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxRQUFRLEtBQUs7QUFDdkMsWUFBSSxRQUFRLENBQUMsRUFBRSxVQUFVLE9BQU8sYUFBYTtBQUMzQyxhQUFHLGdCQUFnQjtBQUNuQixvQkFBVTtBQUNWO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLFdBQVcsT0FBTyxlQUFlLFFBQVc7QUFFMUMsZUFBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLFFBQVEsS0FBSztBQUN2QyxZQUFJLFFBQVEsQ0FBQyxFQUFFLEtBQUssV0FBVyxPQUFPLFdBQVcsUUFBUTtBQUN2RCxhQUFHLGdCQUFnQjtBQUNuQixvQkFBVTtBQUNWO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLE9BQU87QUFDTCxhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sOENBQUE7QUFBQSxJQUNsQztBQUVBLFFBQUksQ0FBQyxTQUFTO0FBQ1osYUFBTztBQUFBLFFBQ0wsU0FBUztBQUFBLFFBQ1QsT0FBTyxhQUFhLE9BQU8sZ0JBQWdCLFNBQVksVUFBVSxPQUFPLFdBQVcsTUFBTSxTQUFTLE9BQU8sVUFBVSxHQUFHO0FBQUEsTUFBQTtBQUFBLElBRTFIO0FBR0EsT0FBRyxjQUFjLElBQUksTUFBTSxVQUFVLEVBQUUsU0FBUyxLQUFBLENBQU0sQ0FBQztBQUV2RCxVQUFNLFdBQVcsUUFBUSxHQUFHLGFBQWE7QUFDekMsV0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLE1BQ1QsTUFBTTtBQUFBLFFBQ0osZUFBZSxHQUFHO0FBQUEsUUFDbEIsZUFBZSxTQUFTO0FBQUEsUUFDeEIsY0FBYyxTQUFTLEtBQUssS0FBQTtBQUFBLE1BQUs7QUFBQSxJQUNuQztBQUFBLEVBRUo7QUFNQSxXQUFTLGdCQUFnQixRQUFxQztBQUM1RCxVQUFNLFdBQVcsT0FBTyxZQUFZO0FBQ3BDLFVBQU0sUUFBUSxPQUFPLFdBQ2pCLFNBQVMsY0FBYyxPQUFPLFFBQVEsSUFDdEM7QUFFSixRQUFJLE9BQU8sWUFBWSxDQUFDLE9BQU87QUFDN0IsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLFlBQVksT0FBTyxRQUFRLEdBQUE7QUFBQSxJQUM3RDtBQUVBLFVBQU0sV0FBVyxTQUFTLFVBQVUsaUJBQWlCLFNBQVM7QUFDOUQsVUFBTSxRQUErQyxDQUFBO0FBQ3JELFVBQU0sUUFBUSxLQUFLLElBQUksUUFBUSxRQUFRLFFBQVE7QUFFL0MsYUFBUyxJQUFJLEdBQUcsSUFBSSxPQUFPLEtBQUs7QUFDOUIsWUFBTSxJQUFJLFFBQVEsQ0FBQztBQUNuQixZQUFNLEtBQUs7QUFBQSxRQUNULE1BQU0sRUFBRTtBQUFBLFFBQ1IsT0FBTyxFQUFFLGVBQWUsSUFBSSxPQUFPLE1BQU0sR0FBRyxHQUFHO0FBQUEsTUFBQSxDQUNoRDtBQUFBLElBQ0g7QUFFQSxXQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsTUFDVCxNQUFNLEVBQUUsWUFBWSxRQUFRLFFBQVEsVUFBVSxNQUFNLFFBQVEsTUFBQTtBQUFBLElBQU07QUFBQSxFQUV0RTtBQUtBLFFBQU0sb0NBQW9CLElBQUk7QUFBQSxJQUM1QjtBQUFBLElBQVU7QUFBQSxJQUFTO0FBQUEsSUFBWTtBQUFBLElBQVU7QUFBQSxJQUFPO0FBQUEsSUFDaEQ7QUFBQSxJQUFPO0FBQUEsSUFBVTtBQUFBLElBQVU7QUFBQSxJQUFTO0FBQUEsSUFBUTtBQUFBLElBQzVDO0FBQUEsSUFBUztBQUFBLElBQVk7QUFBQSxJQUFVO0FBQUEsRUFDakMsQ0FBQztBQUdELFFBQU0seUNBQXlCLElBQUk7QUFBQSxJQUNqQztBQUFBLElBQUs7QUFBQSxJQUFNO0FBQUEsSUFBTTtBQUFBLElBQU07QUFBQSxJQUFNO0FBQUEsSUFBTTtBQUFBLElBQ25DO0FBQUEsSUFBTTtBQUFBLElBQWM7QUFBQSxJQUFNO0FBQUEsSUFBTTtBQUFBLElBQU07QUFBQSxJQUN0QztBQUFBLElBQWM7QUFBQSxJQUFXO0FBQUEsSUFBVztBQUFBLEVBQ3RDLENBQUM7QUFNRCxXQUFTLG9CQUE2QjtBQUNwQyxVQUFNLGFBQWE7QUFBQSxNQUNqQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQUE7QUFFRixlQUFXLE9BQU8sWUFBWTtBQUM1QixZQUFNLEtBQUssU0FBUyxjQUFjLEdBQUc7QUFDckMsVUFBSSxNQUFNLEdBQUcsZUFBZSxHQUFHLFlBQVksS0FBQSxFQUFPLFNBQVMsS0FBSztBQUM5RCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFDQSxXQUFPLFNBQVM7QUFBQSxFQUNsQjtBQU1BLFdBQVMseUJBQXlCLFFBQXFDO0FBQ3JFLFVBQU0sUUFBUSxPQUFPLGdCQUNqQixTQUFTLGNBQWMsT0FBTyxhQUFhLElBQzNDLGtCQUFBO0FBRUosUUFBSSxDQUFDLE9BQU87QUFDVixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sWUFBWSxPQUFPLGFBQWEsR0FBQTtBQUFBLElBQ2xFO0FBRUEsVUFBTSxXQUFXLE9BQU8sWUFBWTtBQUNwQyxVQUFNLGFBQStELENBQUE7QUFDckUsUUFBSSxZQUFZO0FBR2hCLGFBQVMsS0FBSyxNQUFxQjtBQUNqQyxVQUFJLFdBQVcsVUFBVSxVQUFVO0FBQUU7QUFBQSxNQUFRO0FBRTdDLFlBQU0sTUFBTSxLQUFLLFFBQVEsWUFBQTtBQUd6QixVQUFJLGNBQWMsSUFBSSxHQUFHLEdBQUc7QUFBRTtBQUFBLE1BQVE7QUFHdEMsVUFBSSxnQkFBZ0IsYUFBYTtBQUMvQixjQUFNLFFBQVEsT0FBTyxpQkFBaUIsSUFBSTtBQUMxQyxZQUFJLE1BQU0sWUFBWSxVQUFVLE1BQU0sZUFBZSxVQUFVO0FBQUU7QUFBQSxRQUFRO0FBQUEsTUFDM0U7QUFHQSxVQUFJLEtBQUssVUFBVSxTQUFTLGlCQUFpQixHQUFHO0FBQUU7QUFBQSxNQUFRO0FBRzFELFVBQUksbUJBQW1CLElBQUksR0FBRyxHQUFHO0FBQy9CLGNBQU0sUUFBUSxLQUFLLGVBQWUsSUFBSSxLQUFBO0FBRXRDLFlBQUksS0FBSyxVQUFVLEdBQUc7QUFDcEIsZ0JBQU0sS0FBSyxPQUFPLFdBQVc7QUFDN0IsZUFBSyxhQUFhLGVBQWUsRUFBRTtBQUNuQyxxQkFBVyxLQUFLLEVBQUUsSUFBSSxLQUFLLE1BQU0sS0FBSyxNQUFNLEdBQUcsR0FBSSxHQUFHO0FBQUEsUUFDeEQ7QUFDQTtBQUFBLE1BQ0Y7QUFHQSxlQUFTLElBQUksR0FBRyxJQUFJLEtBQUssU0FBUyxRQUFRLEtBQUs7QUFDN0MsYUFBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0FBQUEsTUFDdkI7QUFBQSxJQUNGO0FBRUEsU0FBSyxLQUFnQjtBQUVyQixXQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsTUFDVCxNQUFNO0FBQUEsUUFDSixnQkFBZ0IsV0FBVztBQUFBLFFBQzNCLE9BQU8sT0FBTyxpQkFBaUI7QUFBQSxRQUMvQjtBQUFBLE1BQUE7QUFBQSxJQUNGO0FBQUEsRUFFSjtBQUdBLFFBQU0sZUFBZTtBQUNyQixRQUFNLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFvQmhCLFdBQVMsaUJBQXVCO0FBQzlCLFFBQUksQ0FBQyxTQUFTLGVBQWUsWUFBWSxHQUFHO0FBQzFDLFlBQU0sVUFBVSxTQUFTLGNBQWMsT0FBTztBQUM5QyxjQUFRLEtBQUs7QUFDYixjQUFRLGNBQWM7QUFDdEIsZUFBUyxLQUFLLFlBQVksT0FBTztBQUFBLElBQ25DO0FBQUEsRUFDRjtBQU1BLFdBQVMsdUJBQXVCLFFBQXFDOztBQUNuRSxVQUFNLE9BQU8sT0FBTyxjQUFjO0FBRWxDLFlBQVEsTUFBQTtBQUFBLE1BQ04sS0FBSyxVQUFVO0FBQ2IsWUFBSSxDQUFDLE9BQU8sY0FBYztBQUN4QixpQkFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLHdDQUFBO0FBQUEsUUFDbEM7QUFFQSxZQUFJO0FBQ0osWUFBSTtBQUNGLGtCQUFRLEtBQUssTUFBTSxPQUFPLFlBQVk7QUFBQSxRQUN4QyxRQUFRO0FBQ04saUJBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyw0QkFBQTtBQUFBLFFBQ2xDO0FBRUEsWUFBSSxDQUFDLE1BQU0sUUFBUSxLQUFLLEdBQUc7QUFDekIsaUJBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxxQkFBQTtBQUFBLFFBQ2xDO0FBRUEsdUJBQUE7QUFFQSxZQUFJLFdBQVc7QUFDZixZQUFJLFVBQVU7QUFFZCxtQkFBVyxRQUFRLE9BQU87QUFDeEIsY0FBSSxDQUFDLEtBQUssTUFBTSxDQUFDLEtBQUssWUFBWTtBQUNoQztBQUNBO0FBQUEsVUFDRjtBQUVBLGdCQUFNLFdBQVcsU0FBUyxjQUFjLGlCQUFpQixLQUFLLEVBQUUsSUFBSTtBQUNwRSxjQUFJLENBQUMsVUFBVTtBQUNiO0FBQ0E7QUFBQSxVQUNGO0FBR0EsZ0JBQU0sc0JBQXNCLFNBQVMsY0FBYyxxQ0FBcUMsS0FBSyxFQUFFLElBQUk7QUFDbkcsY0FBSSxxQkFBcUI7QUFFdkIsZ0NBQW9CLGNBQWMsS0FBSztBQUN2QyxnQ0FBb0IsVUFBVSxPQUFPLFlBQVk7QUFDakQ7QUFDQTtBQUFBLFVBQ0Y7QUFHQSxnQkFBTSxlQUFlLFNBQVMsY0FBYyxLQUFLO0FBQ2pELHVCQUFhLFlBQVk7QUFDekIsdUJBQWEsYUFBYSxtQkFBbUIsS0FBSyxFQUFFO0FBQ3BELHVCQUFhLGNBQWMsS0FBSztBQUdoQyx5QkFBUyxlQUFULG1CQUFxQixhQUFhLGNBQWMsU0FBUztBQUN6RDtBQUFBLFFBQ0Y7QUFFQSxlQUFPO0FBQUEsVUFDTCxTQUFTO0FBQUEsVUFDVCxNQUFNLEVBQUUsTUFBTSxVQUFVLFVBQVUsU0FBUyxPQUFPLE1BQU0sT0FBQTtBQUFBLFFBQU87QUFBQSxNQUVuRTtBQUFBLE1BRUEsS0FBSyxVQUFVO0FBQ2IsY0FBTSxlQUFlLFNBQVMsaUJBQWlCLGtCQUFrQjtBQUNqRSxZQUFJLGFBQWEsV0FBVyxHQUFHO0FBQzdCLGlCQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sRUFBRSxNQUFNLFVBQVUsU0FBUyxZQUFZLFNBQVMsRUFBQSxFQUFFO0FBQUEsUUFDbEY7QUFHQSxjQUFNLFdBQVcsYUFBYSxDQUFDLEVBQUUsVUFBVSxTQUFTLFlBQVk7QUFFaEUscUJBQWEsUUFBUSxDQUFDLE9BQU87QUFDM0IsY0FBSSxVQUFVO0FBQ1osZUFBRyxVQUFVLE9BQU8sWUFBWTtBQUFBLFVBQ2xDLE9BQU87QUFDTCxlQUFHLFVBQVUsSUFBSSxZQUFZO0FBQUEsVUFDL0I7QUFBQSxRQUNGLENBQUM7QUFFRCxlQUFPO0FBQUEsVUFDTCxTQUFTO0FBQUEsVUFDVCxNQUFNO0FBQUEsWUFDSixNQUFNO0FBQUEsWUFDTixVQUFVLFdBQVcsWUFBWTtBQUFBLFlBQ2pDLFNBQVMsYUFBYTtBQUFBLFVBQUE7QUFBQSxRQUN4QjtBQUFBLE1BRUo7QUFBQSxNQUVBLEtBQUssU0FBUztBQUNaLGNBQU0sZUFBZSxTQUFTLGlCQUFpQixrQkFBa0I7QUFDakUsY0FBTSxRQUFRLGFBQWE7QUFDM0IscUJBQWEsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRO0FBR3hDLGNBQU0sU0FBUyxTQUFTLGlCQUFpQixlQUFlO0FBQ3hELGVBQU8sUUFBUSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsYUFBYSxDQUFDO0FBR3hELGNBQU0sVUFBVSxTQUFTLGVBQWUsWUFBWTtBQUNwRCxZQUFJLFNBQVM7QUFBRSxrQkFBUSxPQUFBO0FBQUEsUUFBVTtBQUVqQyxlQUFPO0FBQUEsVUFDTCxTQUFTO0FBQUEsVUFDVCxNQUFNLEVBQUUsTUFBTSxTQUFTLFNBQVMsTUFBQTtBQUFBLFFBQU07QUFBQSxNQUUxQztBQUFBLE1BRUE7QUFDRSxlQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sNEJBQTRCLElBQUksR0FBQTtBQUFBLElBQUc7QUFBQSxFQUV6RTtBQVFBLGlCQUFzQixjQUFjLFFBQThDO0FBQ2hGLFFBQUk7QUFDRixjQUFRLE9BQU8sTUFBQTtBQUFBLFFBQ2IsS0FBSztBQUNILGlCQUFPLGFBQWEsTUFBTTtBQUFBLFFBRTVCLEtBQUs7QUFDSCxpQkFBTyxZQUFZLE1BQU07QUFBQSxRQUUzQixLQUFLO0FBQ0gsaUJBQU8sY0FBYyxNQUFNO0FBQUEsUUFFN0IsS0FBSztBQUVILGNBQUksQ0FBQyxPQUFPLEtBQUs7QUFDZixtQkFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLHVCQUFBO0FBQUEsVUFDbEM7QUFDQSxpQkFBTyxTQUFTLE9BQU8sT0FBTztBQUM5QixpQkFBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsV0FBVyxPQUFPLE1BQUk7QUFBQSxRQUV4RCxLQUFLO0FBQ0gsaUJBQU8scUJBQXFCLE1BQU07QUFBQSxRQUVwQyxLQUFLO0FBQ0gsaUJBQU8sd0JBQXdCLE1BQU07QUFBQSxRQUV2QyxLQUFLO0FBQ0gsaUJBQU8sc0JBQXNCLE1BQU07QUFBQSxRQUVyQyxLQUFLO0FBQ0gsaUJBQU8sb0JBQW9CLE1BQU07QUFBQSxRQUVuQyxLQUFLO0FBQ0gsaUJBQU8sZ0JBQWdCLE1BQU07QUFBQSxRQUUvQixLQUFLO0FBRUgsaUJBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxrQ0FBQTtBQUFBLFFBRWxDLEtBQUs7QUFDSCxpQkFBTyxzQkFBc0IsTUFBTTtBQUFBLFFBRXJDLEtBQUs7QUFDSCxpQkFBTyxpQkFBaUIsTUFBTTtBQUFBLFFBRWhDLEtBQUs7QUFDSCxpQkFBTyxnQkFBZ0IsTUFBTTtBQUFBLFFBRS9CLEtBQUs7QUFDSCxpQkFBTyxvQkFBb0IsTUFBTTtBQUFBLFFBRW5DLEtBQUs7QUFDSCxpQkFBTyxnQkFBZ0IsTUFBTTtBQUFBO0FBQUEsUUFHL0IsS0FBSztBQUNILGlCQUFPLHlCQUF5QixNQUFNO0FBQUEsUUFFeEMsS0FBSztBQUNILGlCQUFPLHVCQUF1QixNQUFNO0FBQUEsUUFFdEM7QUFDRSxpQkFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLGFBQWMsT0FBeUIsSUFBSSxHQUFBO0FBQUEsTUFBRztBQUFBLElBRXBGLFNBQVMsS0FBSztBQUNaLGFBQU87QUFBQSxRQUNMLFNBQVM7QUFBQSxRQUNULE9BQU8sUUFBUSxPQUFPLElBQUksUUFBUSxlQUFlLFFBQVEsSUFBSSxVQUFVLE9BQU8sR0FBRyxDQUFDO0FBQUEsTUFBQTtBQUFBLElBRXRGO0FBQUEsRUFDRjs7QUN0ekJBLFFBQUEsMEJBQUE7QUFRQSxRQUFBLGFBQUEsb0JBQUE7QUFBQSxJQUFtQyxTQUFBLENBQUEsWUFBQTtBQUFBLElBQ1gsT0FBQTtBQUVwQixjQUFBLElBQUEscURBQUEsU0FBQSxJQUFBO0FBR0EsY0FBQSxRQUFBLFVBQUEsWUFBQSxDQUFBLFNBQUEsU0FBQSxpQkFBQTs7QUFDRSxZQUFBLFFBQUEsU0FBQSxvQkFBQTtBQUNFLGdCQUFBLGdCQUFBLFlBQUEsYUFBQSxNQUFBLG1CQUFBLGVBQUE7QUFDQSxnQkFBQSxlQUFBLFlBQUEsVUFBQSxHQUFBLHVCQUFBO0FBQ0EsZ0JBQUEsVUFBQTtBQUFBLFlBQTZCLEtBQUEsU0FBQTtBQUFBLFlBQ2IsT0FBQSxTQUFBO0FBQUEsWUFDRTtBQUFBLFVBQ2hCO0FBRUYsY0FBQSxZQUFBLFNBQUEseUJBQUE7QUFDRSxvQkFBQSxJQUFBLCtCQUFBLFlBQUEsUUFBQSxNQUFBLHVCQUFBO0FBQUEsVUFBNEY7QUFFOUYsa0JBQUEsSUFBQSxzQkFBQSxRQUFBLEtBQUEsV0FBQSxRQUFBLGFBQUEsTUFBQTtBQUNBLHVCQUFBLEVBQUEsTUFBQSxnQkFBQSxTQUFBLFFBQUEsQ0FBQTtBQUNBLGlCQUFBO0FBQUEsUUFBTztBQUlULFlBQUEsUUFBQSxTQUFBLGtCQUFBO0FBQ0UsZ0JBQUEsU0FBQSxRQUFBO0FBQ0Esa0JBQUEsSUFBQSxzQkFBQSxPQUFBLE1BQUEsT0FBQSxZQUFBLEVBQUE7QUFHQSx3QkFBQSxNQUFBLEVBQUEsS0FBQSxDQUFBQSxZQUFBO0FBRUksb0JBQUEsSUFBQSxtQkFBQSxPQUFBLE1BQUFBLFFBQUEsT0FBQTtBQUNBLHlCQUFBLEVBQUEsTUFBQSxpQkFBQSxTQUFBQSxRQUFBLENBQUE7QUFBQSxVQUF1RCxDQUFBLEVBQUEsTUFBQSxDQUFBLFFBQUE7QUFHdkQsa0JBQUEsV0FBQSxlQUFBLFFBQUEsSUFBQSxVQUFBLE9BQUEsR0FBQTtBQUNBLG9CQUFBLE1BQUEscUJBQUEsT0FBQSxNQUFBLFFBQUE7QUFDQSx5QkFBQTtBQUFBLGNBQWEsTUFBQTtBQUFBLGNBQ0wsU0FBQSxFQUFBLFNBQUEsT0FBQSxPQUFBLFNBQUE7QUFBQSxZQUNxQyxDQUFBO0FBQUEsVUFDNUMsQ0FBQTtBQUVMLGlCQUFBO0FBQUEsUUFBTztBQUdULGVBQUE7QUFBQSxNQUFPLENBQUE7QUFJVCxlQUFBLGlCQUFBLG1CQUFBLE1BQUE7O0FBQ0UsY0FBQSxnQkFBQSxZQUFBLGFBQUEsTUFBQSxtQkFBQSxlQUFBO0FBQ0EsWUFBQSxZQUFBLFNBQUEsR0FBQTtBQUNFLGdCQUFBLGVBQUEsWUFBQSxVQUFBLEdBQUEsdUJBQUE7QUFDQSxjQUFBLFlBQUEsU0FBQSx5QkFBQTtBQUNFLG9CQUFBLElBQUEsaUNBQUEsWUFBQSxRQUFBLE1BQUEsdUJBQUE7QUFBQSxVQUE4RjtBQUVoRyxrQkFBQSxRQUFBLFlBQUE7QUFBQSxZQUE0QixNQUFBO0FBQUEsWUFDcEIsU0FBQTtBQUFBLGNBQ0csS0FBQSxTQUFBO0FBQUEsY0FDTyxPQUFBLFNBQUE7QUFBQSxjQUNFO0FBQUEsWUFDaEI7QUFBQSxVQUNGLENBQUEsRUFBQSxNQUFBLE1BQUE7QUFBQSxVQUNhLENBQUE7QUFBQSxRQUVkO0FBQUEsTUFDSCxDQUFBO0FBQUEsSUFDRDtBQUFBLEVBRUwsQ0FBQTs7QUN0RkEsV0FBU0UsUUFBTSxXQUFXLE1BQU07QUFFOUIsUUFBSSxPQUFPLEtBQUssQ0FBQyxNQUFNLFVBQVU7QUFDL0IsWUFBTSxVQUFVLEtBQUssTUFBQTtBQUNyQixhQUFPLFNBQVMsT0FBTyxJQUFJLEdBQUcsSUFBSTtBQUFBLElBQ3BDLE9BQU87QUFDTCxhQUFPLFNBQVMsR0FBRyxJQUFJO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBQ08sUUFBTUMsV0FBUztBQUFBLElBQ3BCLE9BQU8sSUFBSSxTQUFTRCxRQUFNLFFBQVEsT0FBTyxHQUFHLElBQUk7QUFBQSxJQUNoRCxLQUFLLElBQUksU0FBU0EsUUFBTSxRQUFRLEtBQUssR0FBRyxJQUFJO0FBQUEsSUFDNUMsTUFBTSxJQUFJLFNBQVNBLFFBQU0sUUFBUSxNQUFNLEdBQUcsSUFBSTtBQUFBLElBQzlDLE9BQU8sSUFBSSxTQUFTQSxRQUFNLFFBQVEsT0FBTyxHQUFHLElBQUk7QUFBQSxFQUNsRDtBQ2JPLFFBQU0sMEJBQU4sTUFBTSxnQ0FBK0IsTUFBTTtBQUFBLElBQ2hELFlBQVksUUFBUSxRQUFRO0FBQzFCLFlBQU0sd0JBQXVCLFlBQVksRUFBRTtBQUMzQyxXQUFLLFNBQVM7QUFDZCxXQUFLLFNBQVM7QUFBQSxJQUNoQjtBQUFBLEVBRUY7QUFERSxnQkFOVyx5QkFNSixjQUFhLG1CQUFtQixvQkFBb0I7QUFOdEQsTUFBTSx5QkFBTjtBQVFBLFdBQVMsbUJBQW1CLFdBQVc7O0FBQzVDLFdBQU8sSUFBRyx3Q0FBUyxZQUFULG1CQUFrQixFQUFFLElBQUksU0FBMEIsSUFBSSxTQUFTO0FBQUEsRUFDM0U7QUNWTyxXQUFTLHNCQUFzQixLQUFLO0FBQ3pDLFFBQUk7QUFDSixRQUFJO0FBQ0osV0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLTCxNQUFNO0FBQ0osWUFBSSxZQUFZLEtBQU07QUFDdEIsaUJBQVMsSUFBSSxJQUFJLFNBQVMsSUFBSTtBQUM5QixtQkFBVyxJQUFJLFlBQVksTUFBTTtBQUMvQixjQUFJLFNBQVMsSUFBSSxJQUFJLFNBQVMsSUFBSTtBQUNsQyxjQUFJLE9BQU8sU0FBUyxPQUFPLE1BQU07QUFDL0IsbUJBQU8sY0FBYyxJQUFJLHVCQUF1QixRQUFRLE1BQU0sQ0FBQztBQUMvRCxxQkFBUztBQUFBLFVBQ1g7QUFBQSxRQUNGLEdBQUcsR0FBRztBQUFBLE1BQ1I7QUFBQSxJQUNKO0FBQUEsRUFDQTtBQ2pCTyxRQUFNLHdCQUFOLE1BQU0sc0JBQXFCO0FBQUEsSUFDaEMsWUFBWSxtQkFBbUIsU0FBUztBQWN4Qyx3Q0FBYSxPQUFPLFNBQVMsT0FBTztBQUNwQztBQUNBLDZDQUFrQixzQkFBc0IsSUFBSTtBQUM1QyxnREFBcUMsb0JBQUksSUFBRztBQWhCMUMsV0FBSyxvQkFBb0I7QUFDekIsV0FBSyxVQUFVO0FBQ2YsV0FBSyxrQkFBa0IsSUFBSSxnQkFBZTtBQUMxQyxVQUFJLEtBQUssWUFBWTtBQUNuQixhQUFLLHNCQUFzQixFQUFFLGtCQUFrQixLQUFJLENBQUU7QUFDckQsYUFBSyxlQUFjO0FBQUEsTUFDckIsT0FBTztBQUNMLGFBQUssc0JBQXFCO0FBQUEsTUFDNUI7QUFBQSxJQUNGO0FBQUEsSUFRQSxJQUFJLFNBQVM7QUFDWCxhQUFPLEtBQUssZ0JBQWdCO0FBQUEsSUFDOUI7QUFBQSxJQUNBLE1BQU0sUUFBUTtBQUNaLGFBQU8sS0FBSyxnQkFBZ0IsTUFBTSxNQUFNO0FBQUEsSUFDMUM7QUFBQSxJQUNBLElBQUksWUFBWTtBQUNkLFVBQUksUUFBUSxRQUFRLE1BQU0sTUFBTTtBQUM5QixhQUFLLGtCQUFpQjtBQUFBLE1BQ3hCO0FBQ0EsYUFBTyxLQUFLLE9BQU87QUFBQSxJQUNyQjtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1osYUFBTyxDQUFDLEtBQUs7QUFBQSxJQUNmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQWNBLGNBQWMsSUFBSTtBQUNoQixXQUFLLE9BQU8saUJBQWlCLFNBQVMsRUFBRTtBQUN4QyxhQUFPLE1BQU0sS0FBSyxPQUFPLG9CQUFvQixTQUFTLEVBQUU7QUFBQSxJQUMxRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVlBLFFBQVE7QUFDTixhQUFPLElBQUksUUFBUSxNQUFNO0FBQUEsTUFDekIsQ0FBQztBQUFBLElBQ0g7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLFlBQVksU0FBUyxTQUFTO0FBQzVCLFlBQU0sS0FBSyxZQUFZLE1BQU07QUFDM0IsWUFBSSxLQUFLLFFBQVMsU0FBTztBQUFBLE1BQzNCLEdBQUcsT0FBTztBQUNWLFdBQUssY0FBYyxNQUFNLGNBQWMsRUFBRSxDQUFDO0FBQzFDLGFBQU87QUFBQSxJQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJQSxXQUFXLFNBQVMsU0FBUztBQUMzQixZQUFNLEtBQUssV0FBVyxNQUFNO0FBQzFCLFlBQUksS0FBSyxRQUFTLFNBQU87QUFBQSxNQUMzQixHQUFHLE9BQU87QUFDVixXQUFLLGNBQWMsTUFBTSxhQUFhLEVBQUUsQ0FBQztBQUN6QyxhQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxzQkFBc0IsVUFBVTtBQUM5QixZQUFNLEtBQUssc0JBQXNCLElBQUksU0FBUztBQUM1QyxZQUFJLEtBQUssUUFBUyxVQUFTLEdBQUcsSUFBSTtBQUFBLE1BQ3BDLENBQUM7QUFDRCxXQUFLLGNBQWMsTUFBTSxxQkFBcUIsRUFBRSxDQUFDO0FBQ2pELGFBQU87QUFBQSxJQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtBLG9CQUFvQixVQUFVLFNBQVM7QUFDckMsWUFBTSxLQUFLLG9CQUFvQixJQUFJLFNBQVM7QUFDMUMsWUFBSSxDQUFDLEtBQUssT0FBTyxRQUFTLFVBQVMsR0FBRyxJQUFJO0FBQUEsTUFDNUMsR0FBRyxPQUFPO0FBQ1YsV0FBSyxjQUFjLE1BQU0sbUJBQW1CLEVBQUUsQ0FBQztBQUMvQyxhQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0EsaUJBQWlCLFFBQVEsTUFBTSxTQUFTLFNBQVM7O0FBQy9DLFVBQUksU0FBUyxzQkFBc0I7QUFDakMsWUFBSSxLQUFLLFFBQVMsTUFBSyxnQkFBZ0IsSUFBRztBQUFBLE1BQzVDO0FBQ0EsbUJBQU8scUJBQVA7QUFBQTtBQUFBLFFBQ0UsS0FBSyxXQUFXLE1BQU0sSUFBSSxtQkFBbUIsSUFBSSxJQUFJO0FBQUEsUUFDckQ7QUFBQSxRQUNBO0FBQUEsVUFDRSxHQUFHO0FBQUEsVUFDSCxRQUFRLEtBQUs7QUFBQSxRQUNyQjtBQUFBO0FBQUEsSUFFRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxvQkFBb0I7QUFDbEIsV0FBSyxNQUFNLG9DQUFvQztBQUMvQ0MsZUFBTztBQUFBLFFBQ0wsbUJBQW1CLEtBQUssaUJBQWlCO0FBQUEsTUFDL0M7QUFBQSxJQUNFO0FBQUEsSUFDQSxpQkFBaUI7QUFDZixhQUFPO0FBQUEsUUFDTDtBQUFBLFVBQ0UsTUFBTSxzQkFBcUI7QUFBQSxVQUMzQixtQkFBbUIsS0FBSztBQUFBLFVBQ3hCLFdBQVcsS0FBSyxPQUFNLEVBQUcsU0FBUyxFQUFFLEVBQUUsTUFBTSxDQUFDO0FBQUEsUUFDckQ7QUFBQSxRQUNNO0FBQUEsTUFDTjtBQUFBLElBQ0U7QUFBQSxJQUNBLHlCQUF5QixPQUFPOztBQUM5QixZQUFNLHlCQUF1QixXQUFNLFNBQU4sbUJBQVksVUFBUyxzQkFBcUI7QUFDdkUsWUFBTSx3QkFBc0IsV0FBTSxTQUFOLG1CQUFZLHVCQUFzQixLQUFLO0FBQ25FLFlBQU0saUJBQWlCLENBQUMsS0FBSyxtQkFBbUIsS0FBSSxXQUFNLFNBQU4sbUJBQVksU0FBUztBQUN6RSxhQUFPLHdCQUF3Qix1QkFBdUI7QUFBQSxJQUN4RDtBQUFBLElBQ0Esc0JBQXNCLFNBQVM7QUFDN0IsVUFBSSxVQUFVO0FBQ2QsWUFBTSxLQUFLLENBQUMsVUFBVTtBQUNwQixZQUFJLEtBQUsseUJBQXlCLEtBQUssR0FBRztBQUN4QyxlQUFLLG1CQUFtQixJQUFJLE1BQU0sS0FBSyxTQUFTO0FBQ2hELGdCQUFNLFdBQVc7QUFDakIsb0JBQVU7QUFDVixjQUFJLGFBQVksbUNBQVMsa0JBQWtCO0FBQzNDLGVBQUssa0JBQWlCO0FBQUEsUUFDeEI7QUFBQSxNQUNGO0FBQ0EsdUJBQWlCLFdBQVcsRUFBRTtBQUM5QixXQUFLLGNBQWMsTUFBTSxvQkFBb0IsV0FBVyxFQUFFLENBQUM7QUFBQSxJQUM3RDtBQUFBLEVBQ0Y7QUFySkUsZ0JBWlcsdUJBWUosK0JBQThCO0FBQUEsSUFDbkM7QUFBQSxFQUNKO0FBZE8sTUFBTSx1QkFBTjtBQ0pQLFFBQU0sVUFBVSxPQUFPLE1BQU07QUFFN0IsTUFBSSxhQUFhO0FBQUEsRUFFRixNQUFNLG9CQUFvQixJQUFJO0FBQUEsSUFDNUMsY0FBYztBQUNiLFlBQUs7QUFFTCxXQUFLLGdCQUFnQixvQkFBSSxRQUFPO0FBQ2hDLFdBQUssZ0JBQWdCLG9CQUFJO0FBQ3pCLFdBQUssY0FBYyxvQkFBSSxJQUFHO0FBRTFCLFlBQU0sQ0FBQyxLQUFLLElBQUk7QUFDaEIsVUFBSSxVQUFVLFFBQVEsVUFBVSxRQUFXO0FBQzFDO0FBQUEsTUFDRDtBQUVBLFVBQUksT0FBTyxNQUFNLE9BQU8sUUFBUSxNQUFNLFlBQVk7QUFDakQsY0FBTSxJQUFJLFVBQVUsT0FBTyxRQUFRLGlFQUFpRTtBQUFBLE1BQ3JHO0FBRUEsaUJBQVcsQ0FBQyxNQUFNLEtBQUssS0FBSyxPQUFPO0FBQ2xDLGFBQUssSUFBSSxNQUFNLEtBQUs7QUFBQSxNQUNyQjtBQUFBLElBQ0Q7QUFBQSxJQUVBLGVBQWUsTUFBTSxTQUFTLE9BQU87QUFDcEMsVUFBSSxDQUFDLE1BQU0sUUFBUSxJQUFJLEdBQUc7QUFDekIsY0FBTSxJQUFJLFVBQVUscUNBQXFDO0FBQUEsTUFDMUQ7QUFFQSxZQUFNLGFBQWEsS0FBSyxlQUFlLE1BQU0sTUFBTTtBQUVuRCxVQUFJO0FBQ0osVUFBSSxjQUFjLEtBQUssWUFBWSxJQUFJLFVBQVUsR0FBRztBQUNuRCxvQkFBWSxLQUFLLFlBQVksSUFBSSxVQUFVO0FBQUEsTUFDNUMsV0FBVyxRQUFRO0FBQ2xCLG9CQUFZLENBQUMsR0FBRyxJQUFJO0FBQ3BCLGFBQUssWUFBWSxJQUFJLFlBQVksU0FBUztBQUFBLE1BQzNDO0FBRUEsYUFBTyxFQUFDLFlBQVksVUFBUztBQUFBLElBQzlCO0FBQUEsSUFFQSxlQUFlLE1BQU0sU0FBUyxPQUFPO0FBQ3BDLFlBQU0sY0FBYyxDQUFBO0FBQ3BCLGVBQVMsT0FBTyxNQUFNO0FBQ3JCLFlBQUksUUFBUSxNQUFNO0FBQ2pCLGdCQUFNO0FBQUEsUUFDUDtBQUVBLGNBQU0sU0FBUyxPQUFPLFFBQVEsWUFBWSxPQUFPLFFBQVEsYUFBYSxrQkFBbUIsT0FBTyxRQUFRLFdBQVcsa0JBQWtCO0FBRXJJLFlBQUksQ0FBQyxRQUFRO0FBQ1osc0JBQVksS0FBSyxHQUFHO0FBQUEsUUFDckIsV0FBVyxLQUFLLE1BQU0sRUFBRSxJQUFJLEdBQUcsR0FBRztBQUNqQyxzQkFBWSxLQUFLLEtBQUssTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDO0FBQUEsUUFDdkMsV0FBVyxRQUFRO0FBQ2xCLGdCQUFNLGFBQWEsYUFBYSxZQUFZO0FBQzVDLGVBQUssTUFBTSxFQUFFLElBQUksS0FBSyxVQUFVO0FBQ2hDLHNCQUFZLEtBQUssVUFBVTtBQUFBLFFBQzVCLE9BQU87QUFDTixpQkFBTztBQUFBLFFBQ1I7QUFBQSxNQUNEO0FBRUEsYUFBTyxLQUFLLFVBQVUsV0FBVztBQUFBLElBQ2xDO0FBQUEsSUFFQSxJQUFJLE1BQU0sT0FBTztBQUNoQixZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxNQUFNLElBQUk7QUFDbEQsYUFBTyxNQUFNLElBQUksV0FBVyxLQUFLO0FBQUEsSUFDbEM7QUFBQSxJQUVBLElBQUksTUFBTTtBQUNULFlBQU0sRUFBQyxVQUFTLElBQUksS0FBSyxlQUFlLElBQUk7QUFDNUMsYUFBTyxNQUFNLElBQUksU0FBUztBQUFBLElBQzNCO0FBQUEsSUFFQSxJQUFJLE1BQU07QUFDVCxZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQzVDLGFBQU8sTUFBTSxJQUFJLFNBQVM7QUFBQSxJQUMzQjtBQUFBLElBRUEsT0FBTyxNQUFNO0FBQ1osWUFBTSxFQUFDLFdBQVcsV0FBVSxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQ3hELGFBQU8sUUFBUSxhQUFhLE1BQU0sT0FBTyxTQUFTLEtBQUssS0FBSyxZQUFZLE9BQU8sVUFBVSxDQUFDO0FBQUEsSUFDM0Y7QUFBQSxJQUVBLFFBQVE7QUFDUCxZQUFNLE1BQUs7QUFDWCxXQUFLLGNBQWMsTUFBSztBQUN4QixXQUFLLFlBQVksTUFBSztBQUFBLElBQ3ZCO0FBQUEsSUFFQSxLQUFLLE9BQU8sV0FBVyxJQUFJO0FBQzFCLGFBQU87QUFBQSxJQUNSO0FBQUEsSUFFQSxJQUFJLE9BQU87QUFDVixhQUFPLE1BQU07QUFBQSxJQUNkO0FBQUEsRUFDRDtBQ2xGbUIsTUFBSSxZQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDUsNiw3LDgsOSwxMF19
