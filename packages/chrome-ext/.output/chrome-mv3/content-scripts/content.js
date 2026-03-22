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
  const IMT_INLINE_LEAF_TAGS = /* @__PURE__ */ new Set([
    "a",
    "span",
    "em",
    "strong",
    "b",
    "i",
    "mark",
    "code",
    "label",
    "time"
  ]);
  function detectMainContent() {
    const candidates = [
      "article",
      "main",
      '[role="main"]',
      // 表格布局支持：HN itemlist 等使用 <table> 作为内容容器的站点
      "table.itemlist",
      "#hnmain",
      ".itemlist",
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
  function extractInlineLeafNodes(container) {
    const containerTag = container.tagName.toLowerCase();
    if (containerTag !== "td" && containerTag !== "th") {
      return [];
    }
    const selectorStr = Array.from(IMT_INLINE_LEAF_TAGS).join(",");
    const inlineEls = container.querySelectorAll(selectorStr);
    const leaves = [];
    for (const el of inlineEls) {
      const text = (el.textContent || "").trim();
      if (text.length < 2) {
        continue;
      }
      if (el.closest(".imt-translation")) {
        continue;
      }
      const childInlines = el.querySelectorAll(selectorStr);
      let hasTextChild = false;
      for (const child of childInlines) {
        if ((child.textContent || "").trim().length >= 2) {
          hasTextChild = true;
          break;
        }
      }
      if (!hasTextChild) {
        leaves.push(el);
      }
    }
    return leaves;
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
          const leafNodes = extractInlineLeafNodes(node);
          if (leafNodes.length > 0) {
            for (const leaf of leafNodes) {
              if (paragraphs.length >= maxCount) {
                break;
              }
              const leafText = (leaf.textContent || "").trim();
              if (leafText.length >= 2) {
                const id2 = `imt-${idCounter++}`;
                leaf.setAttribute("data-imt-id", id2);
                paragraphs.push({
                  id: id2,
                  tag: leaf.tagName.toLowerCase(),
                  text: leafText.slice(0, 2e3)
                });
              }
            }
            return;
          }
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
  margin: 0;
  color: #888;
  font-size: 0.88em;
  line-height: 1.5;
  font-style: normal;
  word-break: break-word;
}
.imt-translation.imt-inline {
  display: block;
}
.imt-translation.imt-hidden,
.imt-translation.imt-inline.imt-hidden {
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
  function insertTranslationElement(original, translatedText, sourceId) {
    var _a;
    const parent = original.parentNode;
    if (!parent) {
      return false;
    }
    const parentTag = ((_a = parent.tagName) == null ? void 0 : _a.toLowerCase()) || "";
    const originalTag = original.tagName.toLowerCase();
    if (parentTag === "tr") {
      const translatedEl2 = document.createElement("div");
      translatedEl2.className = "imt-translation";
      translatedEl2.setAttribute("data-imt-source", sourceId);
      translatedEl2.textContent = translatedText;
      original.appendChild(translatedEl2);
      return true;
    }
    if (IMT_INLINE_LEAF_TAGS.has(originalTag)) {
      const translatedEl2 = document.createElement("span");
      translatedEl2.className = "imt-translation imt-inline";
      translatedEl2.setAttribute("data-imt-source", sourceId);
      translatedEl2.textContent = translatedText;
      parent.insertBefore(translatedEl2, original.nextSibling);
      return true;
    }
    const translatedEl = document.createElement("div");
    translatedEl.className = "imt-translation";
    translatedEl.setAttribute("data-imt-source", sourceId);
    translatedEl.textContent = translatedText;
    parent.insertBefore(translatedEl, original.nextSibling);
    return true;
  }
  function executeInjectBilingual(action) {
    const mode = action.injectMode || "inject";
    switch (mode) {
      case "inject": {
        if (!action.translations) {
          return { success: false, error: "inject 模式需要 translations 参数（JSON 字符串）" };
        }
        let items;
        try {
          let parsed = JSON.parse(action.translations);
          if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
            const inner = parsed.translations;
            if (inner && Array.isArray(inner)) {
              parsed = inner;
            }
          }
          if (!Array.isArray(parsed)) {
            return { success: false, error: "translations 必须是数组或 {translations:[...]} 包装对象" };
          }
          if (parsed.length > 0 && typeof parsed[0] === "string") {
            items = parsed.map((text, idx) => ({
              id: `imt-${idx}`,
              translated: text
            }));
          } else {
            items = parsed;
          }
        } catch {
          return { success: false, error: "translations 参数 JSON 解析失败" };
        }
        ensureImtStyle();
        let autoRemarkDone = false;
        const existingMarked = document.querySelectorAll("[data-imt-id]").length;
        if (existingMarked === 0 && items.length > 0) {
          console.log("[imt] 自动重标记：data-imt-id 元素全部缺失，重新提取段落并标记");
          const reExtractResult = executeExtractParagraphs({});
          if (reExtractResult.success && reExtractResult.data) {
            const reData = reExtractResult.data;
            console.log(`[imt] 自动重标记完成：重新标记了 ${reData.totalExtracted} 个段落`);
            autoRemarkDone = true;
            const newParagraphs = reData.paragraphs;
            for (let i = 0; i < items.length && i < newParagraphs.length; i++) {
              const oldId = items[i].id;
              const newId = newParagraphs[i].id;
              if (oldId !== newId) {
                items[i].id = newId;
              }
            }
            console.log(`[imt] ID 重映射完成：${Math.min(items.length, newParagraphs.length)} 项已对齐`);
          } else {
            console.warn("[imt] 自动重标记失败：", reExtractResult.error);
          }
        }
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
          const inserted = insertTranslationElement(original, item.translated, item.id);
          if (inserted) {
            injected++;
          } else {
            skipped++;
          }
        }
        let diagnostic;
        if (injected === 0 && skipped > 0) {
          const possibleCauses = [];
          const suggestedActions = [];
          if (autoRemarkDone) {
            possibleCauses.push(
              "自动重标记已执行，但翻译数据与当前页面段落无法匹配（页面内容可能已发生变化）"
            );
            suggestedActions.push("重新执行完整翻译流程（extractParagraphs → translate → injectBilingual）");
          } else {
            const markedCount = document.querySelectorAll("[data-imt-id]").length;
            if (markedCount > 0) {
              possibleCauses.push(
                `页面存在 ${markedCount} 个已标记段落，但翻译数据中的 id/translated 字段可能缺失或格式不正确`
              );
              suggestedActions.push('检查 translations 数据格式：每项需包含 { id: "imt-N", translated: "翻译文本" }');
            } else {
              possibleCauses.push("Tab 切换导致工具执行到了不同页面，目标页面无 data-imt-id 标记");
              possibleCauses.push("SPA 页面重渲染导致之前标记的 DOM 节点被替换");
              suggestedActions.push("确保翻译期间不要切换浏览器标签页");
              suggestedActions.push("重新执行完整翻译流程（extractParagraphs → translate → injectBilingual）");
            }
          }
          diagnostic = { possibleCauses, suggestedActions };
          console.warn("[imt] 诊断：注入数为 0", diagnostic);
        }
        return {
          success: true,
          data: {
            mode: "inject",
            injected,
            skipped,
            total: items.length,
            ...autoRemarkDone ? { autoRemarkDone: true } : {},
            ...diagnostic ? { diagnostic } : {}
          }
        };
      }
      case "toggle": {
        const translations = document.querySelectorAll(".imt-translation");
        if (translations.length === 0) {
          return { success: true, data: { mode: "toggle", message: "没有已注入的翻译", toggled: 0 } };
        }
        const isHidden = translations[0].classList.contains("imt-hidden");
        let inlineCount = 0;
        let blockCount = 0;
        translations.forEach((el) => {
          if (isHidden) {
            el.classList.remove("imt-hidden");
          } else {
            el.classList.add("imt-hidden");
          }
          if (el.classList.contains("imt-inline")) {
            inlineCount++;
          } else {
            blockCount++;
          }
        });
        return {
          success: true,
          data: {
            mode: "toggle",
            newState: isHidden ? "visible" : "hidden",
            toggled: translations.length,
            inlineCount,
            blockCount
          }
        };
      }
      case "clear": {
        const translations = document.querySelectorAll(".imt-translation");
        const count = translations.length;
        let inlineRemoved = 0;
        let blockRemoved = 0;
        translations.forEach((el) => {
          if (el.classList.contains("imt-inline")) {
            inlineRemoved++;
          } else {
            blockRemoved++;
          }
          el.remove();
        });
        const tagged = document.querySelectorAll("[data-imt-id]");
        const untaggedCount = tagged.length;
        tagged.forEach((el) => el.removeAttribute("data-imt-id"));
        const styleEl = document.getElementById(IMT_STYLE_ID);
        if (styleEl) {
          styleEl.remove();
        }
        return {
          success: true,
          data: {
            mode: "clear",
            removed: count,
            inlineRemoved,
            blockRemoved,
            untagged: untaggedCount
          }
        };
      }
      default:
        return { success: false, error: `不支持的 injectBilingual 模式: ${mode}` };
    }
  }
  async function executeCompositeDownload(action) {
    const raw = action.screenshots;
    if (!raw) {
      return { success: false, error: "compositeDownload 需要 screenshots 参数（base64 data URL 数组的 JSON 字符串）" };
    }
    let screenshots;
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { success: false, error: "screenshots 必须是非空数组" };
      }
      screenshots = parsed;
    } catch {
      return { success: false, error: "screenshots 参数 JSON 解析失败" };
    }
    const fileName = action.fileName || "composite-screenshot.png";
    try {
      const images = await Promise.all(
        screenshots.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`图片加载失败: ${src.slice(0, 60)}...`));
            img.src = src;
          });
        })
      );
      const maxWidth = Math.max(...images.map((img) => img.naturalWidth));
      const totalHeight = images.reduce((sum, img) => sum + img.naturalHeight, 0);
      if (maxWidth <= 0 || totalHeight <= 0) {
        return { success: false, error: "图片尺寸无效（宽或高为 0）" };
      }
      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return { success: false, error: "无法创建 Canvas 2D 上下文" };
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, maxWidth, totalHeight);
      let yOffset = 0;
      for (const img of images) {
        ctx.drawImage(img, 0, yOffset, img.naturalWidth, img.naturalHeight);
        yOffset += img.naturalHeight;
      }
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error("Canvas toBlob 失败"));
          }
        }, "image/png");
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      }, 1e3);
      return {
        success: true,
        data: {
          fileName,
          imageCount: images.length,
          width: maxWidth,
          height: totalHeight,
          fileSizeBytes: blob.size
        }
      };
    } catch (err) {
      return {
        success: false,
        error: `截图合成失败: ${err instanceof Error ? err.message : String(err)}`
      };
    }
  }
  function executeGetPageInfo() {
    const docEl = document.documentElement;
    return {
      success: true,
      data: {
        url: window.location.href,
        title: document.title,
        scrollHeight: docEl.scrollHeight,
        scrollWidth: docEl.scrollWidth,
        clientHeight: docEl.clientHeight,
        clientWidth: docEl.clientWidth,
        scrollTop: window.scrollY || window.pageYOffset || 0,
        scrollLeft: window.scrollX || window.pageXOffset || 0,
        // 计算总屏数（向上取整），方便 batch_screenshot 等 Skill 使用
        totalScreens: Math.ceil(docEl.scrollHeight / (docEl.clientHeight || 1)),
        // 文档就绪状态
        readyState: document.readyState
      }
    };
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
        // ── evo_v28_001: CSP 安全的页面度量工具 ──
        case "getPageInfo":
          return executeGetPageInfo();
        // ── evo_v28_003: 截图合成下载 ──
        case "compositeDownload":
          return executeCompositeDownload(action);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93ZWJleHRlbnNpb24tcG9seWZpbGxAMC4xMi4wL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIvaW5kZXgubWpzIiwiLi4vLi4vLi4vdXRpbHMvYWN0aW9uLWV4ZWN1dG9yLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyMC4xOS4zN19yb2xsdXBANC41OS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L3V0aWxzL2xvZ2dlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMjlfQHR5cGVzK25vZGVAMjAuMTkuMzdfcm9sbHVwQDQuNTkuMC9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9jdXN0b20tZXZlbnRzLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyMC4xOS4zN19yb2xsdXBANC41OS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbWFueS1rZXlzLW1hcEAyLjAuMS9ub2RlX21vZHVsZXMvbWFueS1rZXlzLW1hcC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AMW5hdHN1K3dhaXQtZWxlbWVudEA0LjEuMi9ub2RlX21vZHVsZXMvQDFuYXRzdS93YWl0LWVsZW1lbnQvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiLCBbXCJtb2R1bGVcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeShtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QpO1xuICAgIGdsb2JhbC5icm93c2VyID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgLyogd2ViZXh0ZW5zaW9uLXBvbHlmaWxsIC0gdjAuMTIuMCAtIFR1ZSBNYXkgMTQgMjAyNCAxODowMToyOSAqL1xuICAvKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG4gIC8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAgICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICAgKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAoIShnbG9iYWxUaGlzLmNocm9tZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUuaWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG4gIGlmICghKGdsb2JhbFRoaXMuYnJvd3NlciAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZSAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZS5pZCkpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjtcblxuICAgIC8vIFdyYXBwaW5nIHRoZSBidWxrIG9mIHRoaXMgcG9seWZpbGwgaW4gYSBvbmUtdGltZS11c2UgZnVuY3Rpb24gaXMgYSBtaW5vclxuICAgIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAgIC8vIGNvbnRlbnRzIG9mIGEgZnVuY3Rpb24gdW50aWwgdGhlIGZpcnN0IHRpbWUgaXQncyBjYWxsZWQsIGFuZCBzaW5jZSBpdCB3aWxsXG4gICAgLy8gbmV2ZXIgYWN0dWFsbHkgbmVlZCB0byBiZSBjYWxsZWQsIHRoaXMgYWxsb3dzIHRoZSBwb2x5ZmlsbCB0byBiZSBpbmNsdWRlZFxuICAgIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICAgIGNvbnN0IHdyYXBBUElzID0gZXh0ZW5zaW9uQVBJcyA9PiB7XG4gICAgICAvLyBOT1RFOiBhcGlNZXRhZGF0YSBpcyBhc3NvY2lhdGVkIHRvIHRoZSBjb250ZW50IG9mIHRoZSBhcGktbWV0YWRhdGEuanNvbiBmaWxlXG4gICAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICAvLyBKU09OIGZpbGUuXG4gICAgICBjb25zdCBhcGlNZXRhZGF0YSA9IHtcbiAgICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjbGVhckFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFN1YlRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2VyQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImRpc2FibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlbmFibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuUG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNhY2hlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZURvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZvcm1EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUxvY2FsU3RvcmFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBhc3N3b3Jkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb29raWVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbENvb2tpZVN0b3Jlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgICBcImluc3BlY3RlZFdpbmRvd1wiOiB7XG4gICAgICAgICAgICBcImV2YWxcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDIsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGFuZWxzXCI6IHtcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVsZW1lbnRzXCI6IHtcbiAgICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwiY2FuY2VsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlcmFzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZpbGVJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhdXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3VtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICAgIFwiaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImlzQWxsb3dlZEluY29nbml0b0FjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhpc3RvcnlcIjoge1xuICAgICAgICAgIFwiYWRkVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlUmFuZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWNjZXB0TGFuZ3VhZ2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRlbnRpdHlcIjoge1xuICAgICAgICAgIFwibGF1bmNoV2ViQXV0aEZsb3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGxlXCI6IHtcbiAgICAgICAgICBcInF1ZXJ5U3RhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYW5hZ2VtZW50XCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRFbmFibGVkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjoge1xuICAgICAgICAgIFwiY29udGFpbnNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicnVudGltZVwiOiB7XG4gICAgICAgICAgXCJnZXRCYWNrZ3JvdW5kUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5PcHRpb25zUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RVcGRhdGVDaGVja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE5hdGl2ZU1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRVbmluc3RhbGxVUkxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJnZXREZXZpY2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN0b3JlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgXCJsb2NhbFwiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1hbmFnZWRcIjoge1xuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRhYnNcIjoge1xuICAgICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkdXBsaWNhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJleGVjdXRlU2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0JhY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0ZvcndhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpbnNlcnRDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgICBcImdldEFsbEZyYW1lc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZyYW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViUmVxdWVzdFwiOiB7XG4gICAgICAgICAgXCJoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2luZG93c1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAgICogICAgICAgIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2YWx1ZSBmb3IgYW55XG4gICAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICAgKi9cbiAgICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG4gICAgICBjb25zdCBpc1RoZW5hYmxlID0gdmFsdWUgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICAgKlxuICAgICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIElmIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIHByb21pc2UgaXNcbiAgICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgICAqICAgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x1dGlvbiBhbmQgcmVqZWN0aW9uIGZ1bmN0aW9ucyBvZiBhXG4gICAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVzb2x1dGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBsdXJhbGl6ZUFyZ3VtZW50cyA9IG51bUFyZ3MgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYXN5bmNGdW5jdGlvbldyYXBwZXIodGFyZ2V0LCAuLi5hcmdzKSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgQVBJIG1ldGhvZCBoYXMgY3VycmVudGx5IG5vIGNhbGxiYWNrIG9uIENocm9tZSwgYnV0IGl0IHJldHVybiBhIHByb21pc2Ugb24gRmlyZWZveCxcbiAgICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgICAgLy8gdG8gbm90IHBhc3NpbmcgdGhlIGNhbGxiYWNrIGlmIHRoZSBmaXJzdCBjYWxsIGZhaWxzLlxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGNiRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bmFtZX0gQVBJIG1ldGhvZCBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyLCBgICsgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEFQSSBtZXRob2QgbWV0YWRhdGEsIHNvIHRoYXQgdGhlIG5leHQgQVBJIGNhbGxzIHdpbGwgbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdW5zdXBwb3J0ZWQgY2FsbGJhY2sgYW55bW9yZS5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gZXhpc3RpbmcgbWV0aG9kIG9mIHRoZSB0YXJnZXQgb2JqZWN0LCBzbyB0aGF0IGNhbGxzIHRvIGl0IGFyZVxuICAgICAgICogaW50ZXJjZXB0ZWQgYnkgdGhlIGdpdmVuIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHJlY2VpdmVzLFxuICAgICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICAgKiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgb3JpZ2luYWwgdGFyZ2V0IG9iamVjdCB0aGF0IHRoZSB3cmFwcGVkIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kXG4gICAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgICAqICAgICAgICBvYmplY3Qgd2hpY2ggaXMgY3JlYXRlZCB0byB3cmFwIHRoZSBtZXRob2QuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgICAqICAgICAgICBvZiB0aGUgd3JhcHBlZCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgICAqICAgICAgICBBIFByb3h5IG9iamVjdCBmb3IgdGhlIGdpdmVuIG1ldGhvZCwgd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gd3JhcHBlclxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiBpdHMgcGxhY2UuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBNZXRob2QgPSAodGFyZ2V0LCBtZXRob2QsIHdyYXBwZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShtZXRob2QsIHtcbiAgICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmNhbGwodGhpc09iaiwgdGFyZ2V0LCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvYmplY3QgaW4gYSBQcm94eSB3aGljaCBpbnRlcmNlcHRzIGFuZCB3cmFwcyBjZXJ0YWluIG1ldGhvZHNcbiAgICAgICAqIGJhc2VkIG9uIHRoZSBnaXZlbiBgd3JhcHBlcnNgIGFuZCBgbWV0YWRhdGFgIG9iamVjdHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSB0YXJnZXQgb2JqZWN0IHRvIHdyYXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFt3cmFwcGVycyA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgd3JhcHBlciBmdW5jdGlvbnMgZm9yIHNwZWNpYWwgY2FzZXMuIEFueVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZS4gVGhlc2VcbiAgICAgICAqICAgICAgICB3cmFwcGVyIG1ldGhvZHMgYXJlIGludm9rZWQgYXMgZGVzY3JpYmVkIGluIHtAc2VlIHdyYXBNZXRob2R9LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGEgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIG1ldGFkYXRhIHVzZWQgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZVxuICAgICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICAgKiAgICAgICAgdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlIHdoaWNoIGhhcyBhIGNvcnJlc3BvbmRpbmcgbWV0YWRhdGEgb2JqZWN0XG4gICAgICAgKiAgICAgICAgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGBtZXRhZGF0YWAgdHJlZSBpcyByZXBsYWNlZCB3aXRoIGFuXG4gICAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgKiAgICAgICAge0BzZWUgd3JhcEFzeW5jRnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0KHByb3h5VGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBvYmplY3QuIENoZWNrIGlmIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgICAgLy8gYW55IHdyYXBwaW5nLlxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHByb3h5VGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShjYWNoZSwgcHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgdGFyZ2V0IGlmIHRoYXQgdmFsdWUgaXMgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZFxuICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLiBGb3IgdGhpcyByZWFzb24sIHdlIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2Fubm90IHJldHVybiBhIGN1c3RvbSBvYmplY3QgZm9yIEFQSXMgdGhhdFxuICAgICAgICAvLyBhcmUgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZCBub24tY29uZmlndXJhYmxlLCBzdWNoIGFzIGBjaHJvbWUuZGV2dG9vbHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgcHJveHkgaGFuZGxlcnMgdGhlbXNlbHZlcyB3aWxsIHN0aWxsIHVzZSB0aGUgb3JpZ2luYWwgYHRhcmdldGBcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgYHByb3h5VGFyZ2V0YCwgc28gdGhhdCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBhcmVcbiAgICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBzZXQgb2Ygd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IG9iamVjdCwgd2hpY2ggaGFuZGxlc1xuICAgICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBBIHNpbmdsZSB3cmFwcGVyIGlzIGNyZWF0ZWQgZm9yIGVhY2ggbGlzdGVuZXIgZnVuY3Rpb24sIGFuZCBzdG9yZWQgaW4gYVxuICAgICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgICAqIHJldHJpZXZlIHRoZSBvcmlnaW5hbCB3cmFwcGVyLCBzbyB0aGF0ICBhdHRlbXB0cyB0byByZW1vdmUgYVxuICAgICAgICogcHJldmlvdXNseS1hZGRlZCBsaXN0ZW5lciB3b3JrIGFzIGV4cGVjdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RGVmYXVsdFdlYWtNYXA8ZnVuY3Rpb24sIGZ1bmN0aW9uPn0gd3JhcHBlck1hcFxuICAgICAgICogICAgICAgIEEgRGVmYXVsdFdlYWtNYXAgb2JqZWN0IHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAgICogICAgICAgIGFuIGV4aXN0aW5nIG9uZSB3aGVuIGl0IGRvZXMuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEV2ZW50ID0gd3JhcHBlck1hcCA9PiAoe1xuICAgICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgICAgdGFyZ2V0LmFkZExpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0xpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGFuIG9uUmVxdWVzdEZpbmlzaGVkIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCByZXR1cm4gYVxuICAgICAgICAgKiBgZ2V0Q29udGVudCgpYCBwcm9wZXJ0eSB3aGljaCByZXR1cm5zIGEgYFByb21pc2VgIHJhdGhlciB0aGFuIHVzaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxXG4gICAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgICBnZXRDb250ZW50OiB7XG4gICAgICAgICAgICAgIG1pbkFyZ3M6IDAsXG4gICAgICAgICAgICAgIG1heEFyZ3M6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0ZW5lcih3cmFwcGVkUmVxKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBkaWRDYWxsU2VuZFJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHdyYXBwZWRTZW5kUmVzcG9uc2U7XG4gICAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgICAvLyB3cmFwcGVkU2VuZFJlc3BvbnNlIHN5bmNocm9ub3VzbHksIHdlIGNhbiBleGl0IGVhcmxpZXJcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgICAvLyBhbmQgYW4gZXJyb3IgaWYgdGhlIHByb21pc2UgcmVqZWN0cyAoYSB3cmFwcGVkIHNlbmRNZXNzYWdlIGhhc1xuICAgICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgICAgLy8gcHJvbWlzZSkuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG4gICAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fCB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZSA9IChuYW1lLCBtZXRhZGF0YSwgYXBpTmFtZXNwYWNlT2JqLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgICBkZXZ0b29sczoge1xuICAgICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMixcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2V0dGluZ01ldGFkYXRhID0ge1xuICAgICAgICBjbGVhcjoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBhcGlNZXRhZGF0YS5wcml2YWN5ID0ge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXJ2aWNlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgd2Vic2l0ZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gICAgLy8gYG1vZHVsZWAgdmFyaWFibGUgYXZhaWxhYmxlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuYnJvd3NlcjtcbiAgfVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icm93c2VyLXBvbHlmaWxsLmpzLm1hcFxuIiwiaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcbiIsIi8vIGFjdGlvbi1leGVjdXRvci50cyDigJQg5rWP6KeI5Zmo5pON5L2c5omn6KGM5byV5pOOXG4vLyDlrprkuYkgQnJvd3NlckFjdGlvbiDmjqXlj6PkuI7miYDmnInmlK/mjIHnmoQgRE9NIOaTjeS9nOexu+Wei++8jFxuLy8g5ZyoIGNvbnRlbnQgc2NyaXB0IOS4iuS4i+aWh+S4reaJp+ihjCBjbGljay90eXBlL3Njcm9sbC9xdWVyeVNlbGVjdG9yIOetieaTjeS9nFxuXG4vKiog5pSv5oyB55qE5rWP6KeI5Zmo5pON5L2c57G75Z6L5p6a5Li+ICovXG5leHBvcnQgdHlwZSBBY3Rpb25UeXBlID1cbiAgfCAnY2xpY2snXG4gIHwgJ3R5cGUnXG4gIHwgJ3Njcm9sbCdcbiAgfCAnbmF2aWdhdGUnXG4gIHwgJ3F1ZXJ5U2VsZWN0b3InXG4gIHwgJ3F1ZXJ5U2VsZWN0b3JBbGwnXG4gIHwgJ2dldFRleHRDb250ZW50J1xuICB8ICdnZXRBdHRyaWJ1dGUnXG4gIHwgJ2dldFZhbHVlJ1xuICB8ICdzY3JlZW5zaG90J1xuICB8ICd3YWl0Rm9yRWxlbWVudCdcbiAgfCAnaGlnaGxpZ2h0J1xuICB8ICdldmFsdWF0ZSdcbiAgfCAnc2VsZWN0T3B0aW9uJ1xuICB8ICdnZXRMaW5rcydcbiAgfCAnZXh0cmFjdFBhcmFncmFwaHMnXG4gIHwgJ2luamVjdEJpbGluZ3VhbCdcbiAgfCAnZ2V0UGFnZUluZm8nXG4gIHwgJ2NvbXBvc2l0ZURvd25sb2FkJztcblxuLyoqIOa7muWKqOaooeW8jyAqL1xuZXhwb3J0IHR5cGUgU2Nyb2xsTW9kZSA9ICd0by10b3AnIHwgJ3RvLWJvdHRvbScgfCAnYnktcGl4ZWxzJyB8ICd0by1lbGVtZW50JztcblxuLyoqIOa1j+iniOWZqOaTjeS9nOivt+axgiAqL1xuZXhwb3J0IGludGVyZmFjZSBCcm93c2VyQWN0aW9uIHtcbiAgLyoqIOaTjeS9nOexu+WeiyAqL1xuICB0eXBlOiBBY3Rpb25UeXBlO1xuICAvKiogQ1NTIOmAieaLqeWZqO+8jOWumuS9jeebruagh+WFg+e0oCAqL1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLyoqIOaWh+acrOWMuemFjei/h+a7pO+8iGNsaWNrIOaXtuWPr+mAie+8jOeUqOS6juS7juWkmuS4quWMuemFjeS4reetm+mAieWQq+aMh+WumuaWh+acrOeahOWFg+e0oO+8iSAqL1xuICB0ZXh0Pzogc3RyaW5nO1xuICAvKiogdHlwZSDmk43kvZzopoHovpPlhaXnmoTmlofmnKwgKi9cbiAgdmFsdWU/OiBzdHJpbmc7XG4gIC8qKiBzY3JvbGwg5pON5L2c55qE5qih5byPICovXG4gIHNjcm9sbE1vZGU/OiBTY3JvbGxNb2RlO1xuICAvKiogc2Nyb2xsIGJ5LXBpeGVscyDmqKHlvI/nmoTlg4/ntKDmlbDvvIjmraPmlbDlkJHkuIvvvIzotJ/mlbDlkJHkuIrvvIkgKi9cbiAgc2Nyb2xsUGl4ZWxzPzogbnVtYmVyO1xuICAvKiogZ2V0QXR0cmlidXRlIOimgeiOt+WPlueahOWxnuaAp+WQjSAqL1xuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICAvKiogbmF2aWdhdGUg5pON5L2c55qE55uu5qCHIFVSTCAqL1xuICB1cmw/OiBzdHJpbmc7XG4gIC8qKiB3YWl0Rm9yRWxlbWVudCDnmoTotoXml7bmr6vnp5LmlbDvvIjpu5jorqQgNTAwMO+8iSAqL1xuICB0aW1lb3V0PzogbnVtYmVyO1xuICAvKiogaGlnaGxpZ2h0IOmrmOS6ruminOiJsu+8iOm7mOiupCByZ2JhKDI1NSwgMTY1LCAwLCAwLjQp77yJICovXG4gIGhpZ2hsaWdodENvbG9yPzogc3RyaW5nO1xuICAvKiogaGlnaGxpZ2h0IOaMgee7reaXtumXtOavq+enkuaVsO+8iOm7mOiupCAyMDAw77yJICovXG4gIGhpZ2hsaWdodER1cmF0aW9uPzogbnVtYmVyO1xuICAvKiogZXZhbHVhdGUg5pON5L2c6KaB5omn6KGM55qEIEphdmFTY3JpcHQg6KGo6L6+5byPICovXG4gIGV4cHJlc3Npb24/OiBzdHJpbmc7XG4gIC8qKiBzZWxlY3RPcHRpb24g5pON5L2c6KaB6YCJ5oup55qEIG9wdGlvbiB2YWx1ZSDlsZ7mgKcgKi9cbiAgb3B0aW9uVmFsdWU/OiBzdHJpbmc7XG4gIC8qKiBzZWxlY3RPcHRpb24g5pON5L2c6KaB6YCJ5oup55qEIG9wdGlvbiDlj6/op4HmlofmnKwgKi9cbiAgb3B0aW9uVGV4dD86IHN0cmluZztcbiAgLyoqIGdldExpbmtzIC8gcXVlcnlTZWxlY3RvckFsbCDov5Tlm57nmoTmnIDlpKflhYPntKDmlbAgKi9cbiAgbWF4Q291bnQ/OiBudW1iZXI7XG4gIC8qKiBleHRyYWN0UGFyYWdyYXBocyDnmoTojIPlm7TpgInmi6nlmaggKi9cbiAgc2NvcGVTZWxlY3Rvcj86IHN0cmluZztcbiAgLyoqIGluamVjdEJpbGluZ3VhbCDnmoTmk43kvZzmqKHlvI86IGluamVjdCAvIHRvZ2dsZSAvIGNsZWFyICovXG4gIGluamVjdE1vZGU/OiAnaW5qZWN0JyB8ICd0b2dnbGUnIHwgJ2NsZWFyJztcbiAgLyoqIGluamVjdEJpbGluZ3VhbCBpbmplY3Qg5qih5byP55qE57+76K+R5pWw5o2u77yISlNPTiDlrZfnrKbkuLLvvIkgKi9cbiAgdHJhbnNsYXRpb25zPzogc3RyaW5nO1xuICAvKiogY29tcG9zaXRlRG93bmxvYWQ6IGJhc2U2NCDmiKrlm77mlbDnu4TnmoQgSlNPTiDlrZfnrKbkuLLvvIjmr4/pobnkuLogZGF0YTppbWFnZS9wbmc7YmFzZTY0LC4uLiDmoLzlvI/vvIkgKi9cbiAgc2NyZWVuc2hvdHM/OiBzdHJpbmc7XG4gIC8qKiBjb21wb3NpdGVEb3dubG9hZDog5LiL6L295paH5Lu25ZCN77yI6buY6K6kIGNvbXBvc2l0ZS1zY3JlZW5zaG90LnBuZ++8iSAqL1xuICBmaWxlTmFtZT86IHN0cmluZztcbn1cblxuLyoqIOaTjeS9nOaJp+ihjOe7k+aenCAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25SZXN1bHQge1xuICAvKiog5piv5ZCm5oiQ5YqfICovXG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIC8qKiDov5Tlm57mlbDmja7vvIjmoLnmja7mk43kvZznsbvlnovkuI3lkIzogIzkuI3lkIzvvIkgKi9cbiAgZGF0YT86IHVua25vd247XG4gIC8qKiDlpLHotKXml7bnmoTplJnor6/kv6Hmga8gKi9cbiAgZXJyb3I/OiBzdHJpbmc7XG59XG5cbi8qKiBxdWVyeVNlbGVjdG9yIOi/lOWbnueahOWFg+e0oOS/oeaBryAqL1xuZXhwb3J0IGludGVyZmFjZSBFbGVtZW50SW5mbyB7XG4gIHRhZ05hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIHRleHRDb250ZW50OiBzdHJpbmc7XG4gIGhyZWY/OiBzdHJpbmc7XG4gIHNyYz86IHN0cmluZztcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIOS7jiBET00g5YWD57Sg5o+Q5Y+W5YWz6ZSu5bGe5oCn5L+h5oGvXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RFbGVtZW50SW5mbyhlbDogRWxlbWVudCk6IEVsZW1lbnRJbmZvIHtcbiAgY29uc3QgaHRtbEVsID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IGlucHV0RWwgPSBlbCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICBjb25zdCBhbmNob3JFbCA9IGVsIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICBjb25zdCBpbWdFbCA9IGVsIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG5cbiAgcmV0dXJuIHtcbiAgICB0YWdOYW1lOiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgaWQ6IGVsLmlkIHx8ICcnLFxuICAgIGNsYXNzTmFtZTogZWwuY2xhc3NOYW1lIHx8ICcnLFxuICAgIHRleHRDb250ZW50OiAoaHRtbEVsLnRleHRDb250ZW50IHx8ICcnKS50cmltKCkuc2xpY2UoMCwgNTAwKSxcbiAgICAuLi4oYW5jaG9yRWwuaHJlZiA/IHsgaHJlZjogYW5jaG9yRWwuaHJlZiB9IDoge30pLFxuICAgIC4uLihpbWdFbC5zcmMgPyB7IHNyYzogaW1nRWwuc3JjIH0gOiB7fSksXG4gICAgLi4uKGlucHV0RWwudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dEVsLnZhbHVlICE9PSAnJyA/IHsgdmFsdWU6IGlucHV0RWwudmFsdWUgfSA6IHt9KSxcbiAgICAuLi4oaW5wdXRFbC50eXBlID8geyB0eXBlOiBpbnB1dEVsLnR5cGUgfSA6IHt9KSxcbiAgICAuLi4oaW5wdXRFbC5wbGFjZWhvbGRlciA/IHsgcGxhY2Vob2xkZXI6IGlucHV0RWwucGxhY2Vob2xkZXIgfSA6IHt9KSxcbiAgfTtcbn1cblxuLyoqXG4gKiDmoLnmja4gc2VsZWN0b3Ig5ZKM5Y+v6YCJIHRleHQg6L+H5ruk5a6a5L2N5YWD57SgXG4gKi9cbmZ1bmN0aW9uIGZpbmRFbGVtZW50KHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBFbGVtZW50IHwgbnVsbCB7XG4gIGlmICh0ZXh0KSB7XG4gICAgLy8g5om+5Yiw5omA5pyJ5Yy56YWNIHNlbGVjdG9yIOeahOWFg+e0oO+8jOWGjeaMiSB0ZXh0Q29udGVudCDnrZvpgIlcbiAgICBjb25zdCBjYW5kaWRhdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgZm9yIChjb25zdCBlbCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICBpZiAoKGVsIGFzIEhUTUxFbGVtZW50KS50ZXh0Q29udGVudD8uaW5jbHVkZXModGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG59XG5cbi8qKlxuICog5omn6KGMIGNsaWNrIOaTjeS9nFxuICog5pSv5oyBIENTUyBzZWxlY3RvciDlrprkvY0gKyDlj6/pgInnmoTmlofmnKzljLnphY3ov4fmu6RcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUNsaWNrKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnY2xpY2sg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGZpbmRFbGVtZW50KGFjdGlvbi5zZWxlY3RvciwgYWN0aW9uLnRleHQpO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn0ke2FjdGlvbi50ZXh0ID8gYCAodGV4dDogXCIke2FjdGlvbi50ZXh0fVwiKWAgOiAnJ31gIH07XG4gIH1cbiAgKGVsIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGNsaWNrZWQ6IGFjdGlvbi5zZWxlY3RvciB9IH07XG59XG5cbi8qKlxuICog5omn6KGMIHR5cGUg5pON5L2cXG4gKiBmb2N1cyDihpIg5riF56m6IOKGkiDpgJDlrZfovpPlhaUg4oaSIOinpuWPkSBpbnB1dC9jaGFuZ2Ug5LqL5Lu2XG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVUeXBlKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAndHlwZSDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGlmIChhY3Rpb24udmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3R5cGUg5pON5L2c6ZyA6KaBIHZhbHVlIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGZpbmRFbGVtZW50KGFjdGlvbi5zZWxlY3RvcikgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cblxuICAvLyBmb2N1c1xuICBlbC5mb2N1cygpO1xuXG4gIC8vIOa4heepuueOsOacieWAvFxuICBlbC52YWx1ZSA9ICcnO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gIC8vIOiuvue9ruaWsOWAvFxuICAvLyDkvb/nlKggbmF0aXZlIGlucHV0IHNldHRlciDku6Xnoa7kv50gUmVhY3Qg5Y+X5o6n57uE5Lu25Lmf6IO95q2j56Gu5pu05pawXG4gIGNvbnN0IG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihlbCksXG4gICAgJ3ZhbHVlJyxcbiAgKT8uc2V0O1xuXG4gIGlmIChuYXRpdmVJbnB1dFZhbHVlU2V0dGVyKSB7XG4gICAgbmF0aXZlSW5wdXRWYWx1ZVNldHRlci5jYWxsKGVsLCBhY3Rpb24udmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGVsLnZhbHVlID0gYWN0aW9uLnZhbHVlO1xuICB9XG5cbiAgLy8g6Kem5Y+R5LqL5Lu2XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgdHlwZWQ6IGFjdGlvbi52YWx1ZSwgc2VsZWN0b3I6IGFjdGlvbi5zZWxlY3RvciB9IH07XG59XG5cbi8qKlxuICog5omn6KGMIHNjcm9sbCDmk43kvZxcbiAqIOaUr+aMgSB0by10b3AgLyB0by1ib3R0b20gLyBieS1waXhlbHMgLyB0by1lbGVtZW50IOWbm+enjeaooeW8j1xuICovXG5mdW5jdGlvbiBleGVjdXRlU2Nyb2xsKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGNvbnN0IG1vZGUgPSBhY3Rpb24uc2Nyb2xsTW9kZSB8fCAnYnktcGl4ZWxzJztcblxuICBzd2l0Y2ggKG1vZGUpIHtcbiAgICBjYXNlICd0by10b3AnOlxuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHNjcm9sbGVkOiAndG8tdG9wJyB9IH07XG5cbiAgICBjYXNlICd0by1ib3R0b20nOlxuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ3RvLWJvdHRvbScgfSB9O1xuXG4gICAgY2FzZSAnYnktcGl4ZWxzJzoge1xuICAgICAgY29uc3QgcGl4ZWxzID0gYWN0aW9uLnNjcm9sbFBpeGVscyB8fCAzMDA7XG4gICAgICB3aW5kb3cuc2Nyb2xsQnkoeyB0b3A6IHBpeGVscywgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ2J5LXBpeGVscycsIHBpeGVscyB9IH07XG4gICAgfVxuXG4gICAgY2FzZSAndG8tZWxlbWVudCc6IHtcbiAgICAgIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3Njcm9sbCB0by1lbGVtZW50IOaooeW8j+mcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gICAgICB9XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gICAgICB9XG4gICAgICBlbC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ3RvLWVsZW1lbnQnLCBzZWxlY3RvcjogYWN0aW9uLnNlbGVjdG9yIH0gfTtcbiAgICB9XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5LiN5pSv5oyB55qE5rua5Yqo5qih5byPOiAke21vZGV9YCB9O1xuICB9XG59XG5cbi8qKlxuICog5omn6KGMIHF1ZXJ5U2VsZWN0b3Ig5pON5L2cXG4gKiDov5Tlm57ljLnphY3lhYPntKDnmoQgdGFnTmFtZS9pZC9jbGFzc05hbWUvdGV4dENvbnRlbnQvaHJlZi9zcmMg562J5bGe5oCnXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVRdWVyeVNlbGVjdG9yKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAncXVlcnlTZWxlY3RvciDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IpO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogZXh0cmFjdEVsZW1lbnRJbmZvKGVsKSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBxdWVyeVNlbGVjdG9yQWxsIOaTjeS9nFxuICog6L+U5Zue5omA5pyJ5Yy56YWN5YWD57Sg55qE5bGe5oCn5pWw57uEXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVRdWVyeVNlbGVjdG9yQWxsKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAncXVlcnlTZWxlY3RvckFsbCDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhY3Rpb24uc2VsZWN0b3IpO1xuICBjb25zdCByZXN1bHRzOiBFbGVtZW50SW5mb1tdID0gW107XG4gIC8vIOacgOWkmui/lOWbniBtYXhDb3VudCDkuKrlhYPntKDvvIjpu5jorqQgNTDvvInvvIzpmLLmraLmlbDmja7ov4flpKdcbiAgY29uc3QgbGltaXQgPSBNYXRoLm1pbihlbGVtZW50cy5sZW5ndGgsIGFjdGlvbi5tYXhDb3VudCB8fCA1MCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXQ7IGkrKykge1xuICAgIHJlc3VsdHMucHVzaChleHRyYWN0RWxlbWVudEluZm8oZWxlbWVudHNbaV0pKTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGNvdW50OiBlbGVtZW50cy5sZW5ndGgsIGVsZW1lbnRzOiByZXN1bHRzIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgZ2V0VGV4dENvbnRlbnQg5pON5L2cXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVHZXRUZXh0Q29udGVudChhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBBY3Rpb25SZXN1bHQge1xuICBpZiAoIWFjdGlvbi5zZWxlY3Rvcikge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2dldFRleHRDb250ZW50IOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3Rvcik7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHRleHRDb250ZW50OiAoZWwgYXMgSFRNTEVsZW1lbnQpLnRleHRDb250ZW50Py50cmltKCkgfHwgJycgfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRBdHRyaWJ1dGUg5pON5L2cXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVHZXRBdHRyaWJ1dGUoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdnZXRBdHRyaWJ1dGUg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBpZiAoIWFjdGlvbi5hdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnZ2V0QXR0cmlidXRlIOaTjeS9nOmcgOimgSBhdHRyaWJ1dGVOYW1lIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgaWYgKCFlbCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgYXR0cmlidXRlOiBhY3Rpb24uYXR0cmlidXRlTmFtZSwgdmFsdWU6IGVsLmdldEF0dHJpYnV0ZShhY3Rpb24uYXR0cmlidXRlTmFtZSkgfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRWYWx1ZSDmk43kvZxcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUdldFZhbHVlKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnZ2V0VmFsdWUg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcbiAgaWYgKCFlbCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgdmFsdWU6IGVsLnZhbHVlIHx8ICcnIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgd2FpdEZvckVsZW1lbnQg5pON5L2cXG4gKiDkvb/nlKggTXV0YXRpb25PYnNlcnZlciDnrYnlvoXlhYPntKDlh7rnjrBcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVdhaXRGb3JFbGVtZW50KGFjdGlvbjogQnJvd3NlckFjdGlvbik6IFByb21pc2U8QWN0aW9uUmVzdWx0PiB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnd2FpdEZvckVsZW1lbnQg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuXG4gIGNvbnN0IHRpbWVvdXQgPSBhY3Rpb24udGltZW91dCB8fCA1MDAwO1xuXG4gIC8vIOWFiOajgOafpeWFg+e0oOaYr+WQpuW3suWtmOWcqFxuICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgaWYgKGV4aXN0aW5nKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogZXh0cmFjdEVsZW1lbnRJbmZvKGV4aXN0aW5nKSB9O1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlPEFjdGlvblJlc3VsdD4oKHJlc29sdmUpID0+IHtcbiAgICBsZXQgcmVzb2x2ZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3RvciEpO1xuICAgICAgaWYgKGVsICYmICFyZXNvbHZlZCkge1xuICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGV4dHJhY3RFbGVtZW50SW5mbyhlbCkgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuXG4gICAgLy8g6LaF5pe25aSE55CGXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXJlc29sdmVkKSB7XG4gICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg562J5b6F5YWD57Sg6LaF5pe2ICgke3RpbWVvdXR9bXMpOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH0pO1xuICAgICAgfVxuICAgIH0sIHRpbWVvdXQpO1xuICB9KTtcbn1cblxuLyoqXG4gKiDmiafooYwgaGlnaGxpZ2h0IOaTjeS9nFxuICog5Li655uu5qCH5YWD57Sg5re75Yqg5Li05pe26auY5Lqu6L655qGGXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVIaWdobGlnaHQoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdoaWdobGlnaHQg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuXG4gIGNvbnN0IGNvbG9yID0gYWN0aW9uLmhpZ2hsaWdodENvbG9yIHx8ICdyZ2JhKDI1NSwgMTY1LCAwLCAwLjQpJztcbiAgY29uc3QgZHVyYXRpb24gPSBhY3Rpb24uaGlnaGxpZ2h0RHVyYXRpb24gfHwgMjAwMDtcblxuICAvLyDkv53lrZjljp/mnInmoLflvI9cbiAgY29uc3Qgb3JpZ2luYWxPdXRsaW5lID0gZWwuc3R5bGUub3V0bGluZTtcbiAgY29uc3Qgb3JpZ2luYWxCZ0NvbG9yID0gZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuXG4gIC8vIOW6lOeUqOmrmOS6rlxuICBlbC5zdHlsZS5vdXRsaW5lID0gYDNweCBzb2xpZCAke2NvbG9yfWA7XG4gIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuXG4gIC8vIOWumuaXtuaBouWkjVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBlbC5zdHlsZS5vdXRsaW5lID0gb3JpZ2luYWxPdXRsaW5lO1xuICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9yaWdpbmFsQmdDb2xvcjtcbiAgfSwgZHVyYXRpb24pO1xuXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgaGlnaGxpZ2h0ZWQ6IGFjdGlvbi5zZWxlY3RvciwgZHVyYXRpb24gfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBldmFsdWF0ZSDmk43kvZxcbiAqIOWcqOmhtemdouS4iuS4i+aWh+S4reaJp+ihjOS7u+aEjyBKYXZhU2NyaXB0IOS7o+eggeW5tui/lOWbnue7k+aenFxuICovXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlRXZhbHVhdGUoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ+IHtcbiAgaWYgKCFhY3Rpb24uZXhwcmVzc2lvbikge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2V2YWx1YXRlIOaTjeS9nOmcgOimgSBleHByZXNzaW9uIOWPguaVsCcgfTtcbiAgfVxuICB0cnkge1xuICAgIC8vIOS9v+eUqCBuZXcgRnVuY3Rpb24g5Lul5L6/5pSv5oyBIHJldHVybiDor63lj6VcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbihhY3Rpb24uZXhwcmVzc2lvbik7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZm4oKTtcbiAgICAvLyDlronlhajluo/liJfljJbvvJp1bmRlZmluZWQg4oaSIG51bGzvvIzlhbbkvZkgSlNPTiDljJZcbiAgICBjb25zdCBzZXJpYWxpemVkID0gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBudWxsIDogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHJlc3VsdDogc2VyaWFsaXplZCB9IH07XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBgZXZhbHVhdGUg5omn6KGM5aSx6LSlOiAke2VyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKX1gLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiDmiafooYwgc2VsZWN0T3B0aW9uIOaTjeS9nFxuICog6YCa6L+HIHZhbHVlIOaIliB0ZXh0IOmAieaLqSA8c2VsZWN0PiDkuIvmi4nmoYbpgInpobnvvIzop6blj5EgY2hhbmdlIOS6i+S7tlxuICovXG5mdW5jdGlvbiBleGVjdXRlU2VsZWN0T3B0aW9uKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2VsZWN0T3B0aW9uIOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3RvcikgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ3NlbGVjdCcpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDnm67moIflhYPntKDkuI3mmK8gPHNlbGVjdD7vvIzogIzmmK8gPCR7ZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpfT5gIH07XG4gIH1cblxuICBsZXQgbWF0Y2hlZCA9IGZhbHNlO1xuICBjb25zdCBvcHRpb25zID0gZWwub3B0aW9ucztcblxuICBpZiAoYWN0aW9uLm9wdGlvblZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyDmjIkgdmFsdWUg5Yy56YWNXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3B0aW9uc1tpXS52YWx1ZSA9PT0gYWN0aW9uLm9wdGlvblZhbHVlKSB7XG4gICAgICAgIGVsLnNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGFjdGlvbi5vcHRpb25UZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyDmjInlj6/op4HmlofmnKzljLnphY1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcHRpb25zW2ldLnRleHQudHJpbSgpID09PSBhY3Rpb24ub3B0aW9uVGV4dC50cmltKCkpIHtcbiAgICAgICAgZWwuc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgIG1hdGNoZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2VsZWN0T3B0aW9uIOmcgOimgSBvcHRpb25WYWx1ZSDmiJYgb3B0aW9uVGV4dCDlj4LmlbAnIH07XG4gIH1cblxuICBpZiAoIW1hdGNoZWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogYOacquaJvuWIsOWMuemFjeeahOmAiemhuTogJHthY3Rpb24ub3B0aW9uVmFsdWUgIT09IHVuZGVmaW5lZCA/IGB2YWx1ZT1cIiR7YWN0aW9uLm9wdGlvblZhbHVlfVwiYCA6IGB0ZXh0PVwiJHthY3Rpb24ub3B0aW9uVGV4dH1cImB9YCxcbiAgICB9O1xuICB9XG5cbiAgLy8g6Kem5Y+RIGNoYW5nZSDkuovku7ZcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG5cbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zW2VsLnNlbGVjdGVkSW5kZXhdO1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgZGF0YToge1xuICAgICAgc2VsZWN0ZWRJbmRleDogZWwuc2VsZWN0ZWRJbmRleCxcbiAgICAgIHNlbGVjdGVkVmFsdWU6IHNlbGVjdGVkLnZhbHVlLFxuICAgICAgc2VsZWN0ZWRUZXh0OiBzZWxlY3RlZC50ZXh0LnRyaW0oKSxcbiAgICB9LFxuICB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRMaW5rcyDmk43kvZxcbiAqIOaPkOWPlumhtemdouS4reaJgOacieWQqyBocmVmIOeahCA8YT4g5YWD57Sg77yM6L+U5ZueIHsgaHJlZiwgdGV4dCB9IOaVsOe7hFxuICovXG5mdW5jdGlvbiBleGVjdXRlR2V0TGlua3MoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgY29uc3QgbWF4Q291bnQgPSBhY3Rpb24ubWF4Q291bnQgfHwgMTAwO1xuICBjb25zdCBzY29wZSA9IGFjdGlvbi5zZWxlY3RvclxuICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IpXG4gICAgOiBkb2N1bWVudDtcblxuICBpZiAoYWN0aW9uLnNlbGVjdG9yICYmICFzY29wZSkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOiMg+WbtOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG5cbiAgY29uc3QgYW5jaG9ycyA9IChzY29wZSB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXScpO1xuICBjb25zdCBsaW5rczogQXJyYXk8eyBocmVmOiBzdHJpbmc7IHRleHQ6IHN0cmluZyB9PiA9IFtdO1xuICBjb25zdCBsaW1pdCA9IE1hdGgubWluKGFuY2hvcnMubGVuZ3RoLCBtYXhDb3VudCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW1pdDsgaSsrKSB7XG4gICAgY29uc3QgYSA9IGFuY2hvcnNbaV0gYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgbGlua3MucHVzaCh7XG4gICAgICBocmVmOiBhLmhyZWYsXG4gICAgICB0ZXh0OiAoYS50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpLnNsaWNlKDAsIDIwMCksXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgZGF0YTogeyB0b3RhbEZvdW5kOiBhbmNob3JzLmxlbmd0aCwgcmV0dXJuZWQ6IGxpbmtzLmxlbmd0aCwgbGlua3MgfSxcbiAgfTtcbn1cblxuLy8g4pSA4pSAIGV2b192MTlfMDAxOiDmsonmtbjlvI/nv7vor5Eg4oCUIOauteiQveaPkOWPliArIOWPjOivreazqOWFpSDilIDilIBcblxuLyoqIOmcgOimgei3s+i/h+eahOagh+etvu+8iOWvvOiIquOAgeiEmuacrOOAgeagt+W8j+OAgeW5v+WRiuetie+8iSAqL1xuY29uc3QgSU1UX1NLSVBfVEFHUyA9IG5ldyBTZXQoW1xuICAnc2NyaXB0JywgJ3N0eWxlJywgJ25vc2NyaXB0JywgJ2lmcmFtZScsICdzdmcnLCAnY2FudmFzJyxcbiAgJ25hdicsICdmb290ZXInLCAnaGVhZGVyJywgJ2FzaWRlJywgJ2Zvcm0nLCAnYnV0dG9uJyxcbiAgJ2lucHV0JywgJ3RleHRhcmVhJywgJ3NlbGVjdCcsICdsYWJlbCcsXG5dKTtcblxuLyoqIOWGheWuueauteiQveagh+etviAqL1xuY29uc3QgSU1UX1BBUkFHUkFQSF9UQUdTID0gbmV3IFNldChbXG4gICdwJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JyxcbiAgJ2xpJywgJ2Jsb2NrcXVvdGUnLCAndGQnLCAndGgnLCAnZHQnLCAnZGQnLFxuICAnZmlnY2FwdGlvbicsICdjYXB0aW9uJywgJ3N1bW1hcnknLCAncHJlJyxcbl0pO1xuXG4vKipcbiAqIOihjOWGheaWh+acrOWPtuiKgueCueagh+etviDigJQg5pm66IO95Y+26IqC54K55o+Q5Y+WKGlubGluZSBsZWFmIGV4dHJhY3Rpb24pXG4gKiDlvZPmrrXokL3nuqflrrnlmago5aaCIDx0ZD4p5YaF5ZCr6L+Z5Lqb6KGM5YaF5YWD57Sg5pe277yM5LyY5YWI5o+Q5Y+W5Y+26IqC54K56ICM6Z2e5pW05Liq5a655ZmoXG4gKiDpgILnlKjkuo4gSE4gdGl0bGVsaW5lIDxhPiDnrYnlnLrmma/vvIzmj5Dlj5bnspLluqbku44gPHRkPiDpmY3liLAgPGE+LzxzcGFuPiDnuqfliKtcbiAqL1xuY29uc3QgSU1UX0lOTElORV9MRUFGX1RBR1MgPSBuZXcgU2V0KFtcbiAgJ2EnLCAnc3BhbicsICdlbScsICdzdHJvbmcnLCAnYicsICdpJywgJ21hcmsnLCAnY29kZScsICdsYWJlbCcsICd0aW1lJyxcbl0pO1xuXG4vKipcbiAqIOiHquWKqOajgOa1i+mhtemdouS4u+WGheWuueWMuuWfn1xuICog5LyY5YWI57qnOiBhcnRpY2xlID4gbWFpbiA+IFtyb2xlPVwibWFpblwiXSA+IOihqOagvOW4g+WxgChpdGVtbGlzdCkgPiAuY29udGVudC8ucG9zdC8uYXJ0aWNsZSA+IGJvZHlcbiAqXG4gKiDooajmoLzluIPlsYDmlK/mjIHvvJpITiDnrYnnq5nngrnkvb/nlKggdGFibGUuaXRlbWxpc3Qg5L2c5Li65YaF5a655a655Zmo77yMXG4gKiDpnIDopoHmmL7lvI/or4bliKvmiY3og73mraPnoa7ov5vlhaXooajmoLzlhoXpg6jmj5Dlj5ZcbiAqL1xuZnVuY3Rpb24gZGV0ZWN0TWFpbkNvbnRlbnQoKTogRWxlbWVudCB7XG4gIGNvbnN0IGNhbmRpZGF0ZXMgPSBbXG4gICAgJ2FydGljbGUnLFxuICAgICdtYWluJyxcbiAgICAnW3JvbGU9XCJtYWluXCJdJyxcbiAgICAvLyDooajmoLzluIPlsYDmlK/mjIHvvJpITiBpdGVtbGlzdCDnrYnkvb/nlKggPHRhYmxlPiDkvZzkuLrlhoXlrrnlrrnlmajnmoTnq5nngrlcbiAgICAndGFibGUuaXRlbWxpc3QnLFxuICAgICcjaG5tYWluJyxcbiAgICAnLml0ZW1saXN0JyxcbiAgICAnLmNvbnRlbnQnLFxuICAgICcucG9zdCcsXG4gICAgJy5hcnRpY2xlJyxcbiAgICAnLnBvc3QtY29udGVudCcsXG4gICAgJy5lbnRyeS1jb250ZW50JyxcbiAgICAnLmFydGljbGUtY29udGVudCcsXG4gICAgJyNjb250ZW50JyxcbiAgXTtcbiAgZm9yIChjb25zdCBzZWwgb2YgY2FuZGlkYXRlcykge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgIGlmIChlbCAmJiBlbC50ZXh0Q29udGVudCAmJiBlbC50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoID4gMTAwKSB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICB9XG4gIHJldHVybiBkb2N1bWVudC5ib2R5O1xufVxuXG4vKipcbiAqIOaZuuiDveWPtuiKgueCueaPkOWPlihsZWFmIG5vZGUgZXh0cmFjdGlvbinvvJrku47mrrXokL3lrrnlmajkuK3mj5Dlj5bmnInmhI/kuYnnmoTooYzlhoXmlofmnKzlhYPntKBcbiAqXG4gKiDlvZPmrrXokL3lrrnlmago5aaCIDx0ZD4p5YaF5ZCrIDxhPi88c3Bhbj4g562J6KGM5YaF5YWD57Sg5pe277yM5o+Q5Y+W5pyA5rex5bGC55qE5Y+26IqC54K577yMXG4gKiDogIzpnZ7mlbTkuKrlrrnlmajmlofmnKzjgILkvovlpoIgSE4g55qEIDx0ZCBjbGFzcz1cInRpdGxlXCI+IOWGheeahCA8YSBjbGFzcz1cInRpdGxlbGluZVwiPuOAglxuICpcbiAqIOS7heWvueihqOagvOWNleWFg+agvCg8dGQ+Lzx0aD4p6Ieq5Yqo5ZCv55So77yb5a+5IDxwPi88bGk+IOetieaZrumAmuauteiQveS/neaMgeaVtOauteaPkOWPluOAglxuICovXG5mdW5jdGlvbiBleHRyYWN0SW5saW5lTGVhZk5vZGVzKGNvbnRhaW5lcjogRWxlbWVudCk6IEVsZW1lbnRbXSB7XG4gIGNvbnN0IGNvbnRhaW5lclRhZyA9IGNvbnRhaW5lci50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8g5LuF5a+56KGo5qC85Y2V5YWD5qC85ZCv55So5pm66IO95Y+26IqC54K55o+Q5Y+W77yM5pmu6YCa5q616JC95L+d5oyB5pW05q61XG4gIGlmIChjb250YWluZXJUYWcgIT09ICd0ZCcgJiYgY29udGFpbmVyVGFnICE9PSAndGgnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0b3JTdHIgPSBBcnJheS5mcm9tKElNVF9JTkxJTkVfTEVBRl9UQUdTKS5qb2luKCcsJyk7XG4gIGNvbnN0IGlubGluZUVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yU3RyKTtcbiAgY29uc3QgbGVhdmVzOiBFbGVtZW50W10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGVsIG9mIGlubGluZUVscykge1xuICAgIGNvbnN0IHRleHQgPSAoZWwudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgICBpZiAodGV4dC5sZW5ndGggPCAyKSB7IGNvbnRpbnVlOyB9XG4gICAgaWYgKGVsLmNsb3Nlc3QoJy5pbXQtdHJhbnNsYXRpb24nKSkgeyBjb250aW51ZTsgfVxuXG4gICAgLy8g5qOA5p+l5piv5ZCm5Li655yf5q2j55qE5Y+26IqC54K577ya5LiN5ZCr5pyJ5a6e6LSo5paH5pys55qE5a2Q6KGM5YaF5YWD57SgXG4gICAgY29uc3QgY2hpbGRJbmxpbmVzID0gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvclN0cik7XG4gICAgbGV0IGhhc1RleHRDaGlsZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRJbmxpbmVzKSB7XG4gICAgICBpZiAoKGNoaWxkLnRleHRDb250ZW50IHx8ICcnKS50cmltKCkubGVuZ3RoID49IDIpIHtcbiAgICAgICAgaGFzVGV4dENoaWxkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g5Y+q5pS26ZuG5Y+26IqC54K577yI5peg5pyJ5oSP5LmJ5a2Q6KGM5YaF5YWD57Sg55qE77yJXG4gICAgaWYgKCFoYXNUZXh0Q2hpbGQpIHtcbiAgICAgIGxlYXZlcy5wdXNoKGVsKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGVhdmVzO1xufVxuXG4vKipcbiAqIOaJp+ihjCBleHRyYWN0UGFyYWdyYXBocyDmk43kvZxcbiAqIOaZuuiDveaPkOWPlumhtemdouauteiQve+8jOS4uuavj+S4quauteiQveiuvue9riBkYXRhLWltdC1pZO+8jOi/lOWbnue7k+aehOWMluaVsOaNrlxuICovXG5mdW5jdGlvbiBleGVjdXRlRXh0cmFjdFBhcmFncmFwaHMoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgY29uc3Qgc2NvcGUgPSBhY3Rpb24uc2NvcGVTZWxlY3RvclxuICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2NvcGVTZWxlY3RvcilcbiAgICA6IGRldGVjdE1haW5Db250ZW50KCk7XG5cbiAgaWYgKCFzY29wZSkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOiMg+WbtOWFg+e0oDogJHthY3Rpb24uc2NvcGVTZWxlY3Rvcn1gIH07XG4gIH1cblxuICBjb25zdCBtYXhDb3VudCA9IGFjdGlvbi5tYXhDb3VudCB8fCAyMDA7XG4gIGNvbnN0IHBhcmFncmFwaHM6IEFycmF5PHsgaWQ6IHN0cmluZzsgdGFnOiBzdHJpbmc7IHRleHQ6IHN0cmluZyB9PiA9IFtdO1xuICBsZXQgaWRDb3VudGVyID0gMDtcblxuICAvLyDpgJLlvZLpgY3ljoYgRE9NIOagke+8jOaPkOWPluWGheWuueauteiQvVxuICAvLyDmmbrog73lj7boioLngrnmj5Dlj5bvvJrlr7nooajmoLzljZXlhYPmoLwoPHRkPi88dGg+KeS8mOWFiOaPkOWPluWGhemDqCA8YT4vPHNwYW4+IOetieihjOWGheWFg+e0oFxuICBmdW5jdGlvbiB3YWxrKG5vZGU6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAocGFyYWdyYXBocy5sZW5ndGggPj0gbWF4Q291bnQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCB0YWcgPSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIOi3s+i/h+S4jeebuOWFs+eahOagh+etvlxuICAgIGlmIChJTVRfU0tJUF9UQUdTLmhhcyh0YWcpKSB7IHJldHVybjsgfVxuXG4gICAgLy8g6Lez6L+H6ZqQ6JeP5YWD57SgXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIGlmIChzdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHwgc3R5bGUudmlzaWJpbGl0eSA9PT0gJ2hpZGRlbicpIHsgcmV0dXJuOyB9XG4gICAgfVxuXG4gICAgLy8g6Lez6L+H5bey5rOo5YWl55qE57+76K+R5q616JC9XG4gICAgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbXQtdHJhbnNsYXRpb24nKSkgeyByZXR1cm47IH1cblxuICAgIC8vIOWmguaenOaYr+auteiQvee6p+agh+etvuS4lOacieacieaViOaWh+acrOWGheWuuVxuICAgIGlmIChJTVRfUEFSQUdSQVBIX1RBR1MuaGFzKHRhZykpIHtcbiAgICAgIGNvbnN0IHRleHQgPSAobm9kZS50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICAgICAgLy8g6Lez6L+H56m65q616JC95ZKM5p6B55+t5q616JC977yI5bCR5LqOMuWtl+espu+8iVxuICAgICAgaWYgKHRleHQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgLy8g4pSA4pSAIOaZuuiDveWPtuiKgueCueaPkOWPliDilIDilIBcbiAgICAgICAgLy8g5a+56KGo5qC85Y2V5YWD5qC8KDx0ZD4vPHRoPinvvIzkvJjlhYjmj5Dlj5blhoXpg6jnmoTooYzlhoXmlofmnKzlj7boioLngrkoPGE+LzxzcGFuPuetiSlcbiAgICAgICAgLy8g5L6L5aaCIEhOIOeahCB0aXRsZWxpbmUgPGE+IOagh+mimOmTvuaOpe+8jOiAjOmdnuaVtOS4qiA8dGQ+IOWNleWFg+agvOaWh+acrFxuICAgICAgICBjb25zdCBsZWFmTm9kZXMgPSBleHRyYWN0SW5saW5lTGVhZk5vZGVzKG5vZGUpO1xuICAgICAgICBpZiAobGVhZk5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGxlYWYgb2YgbGVhZk5vZGVzKSB7XG4gICAgICAgICAgICBpZiAocGFyYWdyYXBocy5sZW5ndGggPj0gbWF4Q291bnQpIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIGNvbnN0IGxlYWZUZXh0ID0gKGxlYWYudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChsZWFmVGV4dC5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICBjb25zdCBpZCA9IGBpbXQtJHtpZENvdW50ZXIrK31gO1xuICAgICAgICAgICAgICBsZWFmLnNldEF0dHJpYnV0ZSgnZGF0YS1pbXQtaWQnLCBpZCk7XG4gICAgICAgICAgICAgIHBhcmFncmFwaHMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgdGFnOiBsZWFmLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBsZWFmVGV4dC5zbGljZSgwLCAyMDAwKSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjsgLy8g5Y+26IqC54K55bey5o+Q5Y+W77yM5LiN5YaN5pW05q615o+Q5Y+WXG4gICAgICAgIH1cblxuICAgICAgICAvLyDml6Dlj7boioLngrkg4oaSIOaVtOauteaPkOWPlu+8iOWOn+mAu+i+ke+8iVxuICAgICAgICBjb25zdCBpZCA9IGBpbXQtJHtpZENvdW50ZXIrK31gO1xuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS1pbXQtaWQnLCBpZCk7XG4gICAgICAgIHBhcmFncmFwaHMucHVzaCh7IGlkLCB0YWcsIHRleHQ6IHRleHQuc2xpY2UoMCwgMjAwMCkgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm47IC8vIOS4jeWGjeWQkeS4i+mAkuW9ku+8jOmBv+WFjemHjeWkjeaPkOWPllxuICAgIH1cblxuICAgIC8vIOmdnuauteiQvee6p+agh+etviDihpIg57un57ut5ZCR5LiL6YGN5Y6G5a2Q5YWD57SgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB3YWxrKG5vZGUuY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgfVxuXG4gIHdhbGsoc2NvcGUgYXMgRWxlbWVudCk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzOiB0cnVlLFxuICAgIGRhdGE6IHtcbiAgICAgIHRvdGFsRXh0cmFjdGVkOiBwYXJhZ3JhcGhzLmxlbmd0aCxcbiAgICAgIHNjb3BlOiBhY3Rpb24uc2NvcGVTZWxlY3RvciB8fCAnKGF1dG8tZGV0ZWN0ZWQpJyxcbiAgICAgIHBhcmFncmFwaHMsXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqIOayiea1uOW8j+e/u+ivkeazqOWFpeagt+W8j++8iOWPquazqOWFpeS4gOasoe+8ieKAlCDml6DovrnmoYbnuq/mlofmnKzmsonmtbjlvI/po47moLzvvIzlj4LogIPmsonmtbjlvI/nv7vor5HmianlsZUgKi9cbmNvbnN0IElNVF9TVFlMRV9JRCA9ICdpbXQtYmlsaW5ndWFsLXN0eWxlJztcbmNvbnN0IElNVF9DU1MgPSBgXG4uaW10LXRyYW5zbGF0aW9uIHtcbiAgbWFyZ2luOiAwO1xuICBjb2xvcjogIzg4ODtcbiAgZm9udC1zaXplOiAwLjg4ZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjU7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgd29yZC1icmVhazogYnJlYWstd29yZDtcbn1cbi5pbXQtdHJhbnNsYXRpb24uaW10LWlubGluZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuLmltdC10cmFuc2xhdGlvbi5pbXQtaGlkZGVuLFxuLmltdC10cmFuc2xhdGlvbi5pbXQtaW5saW5lLmltdC1oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuYDtcblxuLyoqXG4gKiDnoa7kv53msonmtbjlvI/nv7vor5HmoLflvI/lt7Lms6jlhaVcbiAqL1xuZnVuY3Rpb24gZW5zdXJlSW10U3R5bGUoKTogdm9pZCB7XG4gIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoSU1UX1NUWUxFX0lEKSkge1xuICAgIGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWwuaWQgPSBJTVRfU1RZTEVfSUQ7XG4gICAgc3R5bGVFbC50ZXh0Q29udGVudCA9IElNVF9DU1M7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcbiAgfVxufVxuXG4vKipcbiAqIOihqOagvOW4g+WxgOWFvOWuueazqOWFpSDigJQg5qC55o2u5Y6f5aeL5YWD57Sg55qEIERPTSDkuIrkuIvmlofliJvlu7rlubbmj5LlhaXnv7vor5HlhYPntKBcbiAqXG4gKiDnrZbnlaXor7TmmI7vvIjkuI3lnKggPHRyPiDlhoXmj5IgPGRpdj7vvInvvJpcbiAqIDEuIOeItuWFg+e0oOaYryA8dHI+77yI5Y6f5aeL5YWD57Sg5pivIDx0ZD4vPHRoPu+8ieKGkiDlnKjljZXlhYPmoLzlhoXpg6jov73liqDnv7vor5HvvIzkuI3lnKggdGFibGVSb3cg5YaF5o+S5YWlIDxkaXY+XG4gKiAyLiDljp/lp4vlhYPntKDmmK/ooYzlhoXlhYPntKDvvIg8YT4vPHNwYW4+IOetiSBpbmxpbmUgbGVhZu+8ieKGkiDkvb/nlKggPHNwYW4+IOabv+S7oyA8ZGl2Pu+8jOS/neaMgSBpbmxpbmUg6K+t5LmJXG4gKiAzLiDmma7pgJrlnZfnuqflhYPntKDvvIg8cD4vPGxpPiDnrYnvvInihpIg5L+d5oyB5Y6f6YC76L6RIGluc2VydEJlZm9yZShkaXYsIG9yaWdpbmFsLm5leHRTaWJsaW5nKVxuICpcbiAqIEByZXR1cm5zIHRydWUg5o+S5YWl5oiQ5YqfLCBmYWxzZSDmj5LlhaXlpLHotKXvvIjml6AgcGFyZW50Tm9kZe+8iVxuICovXG5mdW5jdGlvbiBpbnNlcnRUcmFuc2xhdGlvbkVsZW1lbnQoXG4gIG9yaWdpbmFsOiBFbGVtZW50LFxuICB0cmFuc2xhdGVkVGV4dDogc3RyaW5nLFxuICBzb3VyY2VJZDogc3RyaW5nLFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhcmVudCA9IG9yaWdpbmFsLnBhcmVudE5vZGUgYXMgRWxlbWVudCB8IG51bGw7XG4gIGlmICghcGFyZW50KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGNvbnN0IHBhcmVudFRhZyA9IHBhcmVudC50YWdOYW1lPy50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuICBjb25zdCBvcmlnaW5hbFRhZyA9IG9yaWdpbmFsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAvLyDilIDilIAgQ2FzZSAxOiDooajmoLzooYzlhoUg4oCUIHBhcmVudE5vZGUudGFnTmFtZSA9PT0gJ1RSJyDilIDilIBcbiAgLy8g5Y6f5aeL5YWD57Sg5pivIDx0ZD4vPHRoPu+8jOeItuWFg+e0oOaYryA8dHI+XG4gIC8vIOS4jeWcqCA8dHI+IOWGheebtOaOpeaPkuWFpSA8ZGl2Pu+8iOaXoOaViCBIVE1M77yJ77yM5pS55Li65ZyoIHRhYmxlIOWNleWFg+agvOWGhemDqOi/veWKoOe/u+ivkVxuICBpZiAocGFyZW50VGFnID09PSAndHInKSB7XG4gICAgY29uc3QgdHJhbnNsYXRlZEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdHJhbnNsYXRlZEVsLmNsYXNzTmFtZSA9ICdpbXQtdHJhbnNsYXRpb24nO1xuICAgIHRyYW5zbGF0ZWRFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW10LXNvdXJjZScsIHNvdXJjZUlkKTtcbiAgICB0cmFuc2xhdGVkRWwudGV4dENvbnRlbnQgPSB0cmFuc2xhdGVkVGV4dDtcbiAgICAvLyDov73liqDliLDljZXlhYPmoLzlhoXpg6jmnIDlkI7vvIzogIzpnZ4gPHRyPiDkuIvmlrlcbiAgICBvcmlnaW5hbC5hcHBlbmRDaGlsZCh0cmFuc2xhdGVkRWwpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8g4pSA4pSAIENhc2UgMjog6KGM5YaF5YWD57Sg6YCC6YWNIOKAlCA8YT4vPHNwYW4+IOetiSBpbmxpbmUgbGVhZiDilIDilIBcbiAgLy8g5L2/55SoIDxzcGFuPiDmm7/ku6MgPGRpdj7vvIzmt7vliqAgaW10LWlubGluZSDnsbvvvIhkaXNwbGF5OmJsb2NrIOS/neaMgeeLrOeri+ihjO+8iVxuICAvLyDpgILnlKjkuo4gSE4gdGl0bGVsaW5lIDxhPiDnrYnmmbrog73lj7boioLngrnmj5Dlj5blnLrmma9cbiAgaWYgKElNVF9JTkxJTkVfTEVBRl9UQUdTLmhhcyhvcmlnaW5hbFRhZykpIHtcbiAgICBjb25zdCB0cmFuc2xhdGVkRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdHJhbnNsYXRlZEVsLmNsYXNzTmFtZSA9ICdpbXQtdHJhbnNsYXRpb24gaW10LWlubGluZSc7XG4gICAgdHJhbnNsYXRlZEVsLnNldEF0dHJpYnV0ZSgnZGF0YS1pbXQtc291cmNlJywgc291cmNlSWQpO1xuICAgIHRyYW5zbGF0ZWRFbC50ZXh0Q29udGVudCA9IHRyYW5zbGF0ZWRUZXh0O1xuICAgIHBhcmVudC5pbnNlcnRCZWZvcmUodHJhbnNsYXRlZEVsLCBvcmlnaW5hbC5uZXh0U2libGluZyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyDilIDilIAgQ2FzZSAzOiDmma7pgJrlnZfnuqflhYPntKDvvIg8cD4vPGxpPiDnrYnvvInigJQg5Y6f6YC76L6R5LiN5Y+YIOKUgOKUgFxuICBjb25zdCB0cmFuc2xhdGVkRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdHJhbnNsYXRlZEVsLmNsYXNzTmFtZSA9ICdpbXQtdHJhbnNsYXRpb24nO1xuICB0cmFuc2xhdGVkRWwuc2V0QXR0cmlidXRlKCdkYXRhLWltdC1zb3VyY2UnLCBzb3VyY2VJZCk7XG4gIHRyYW5zbGF0ZWRFbC50ZXh0Q29udGVudCA9IHRyYW5zbGF0ZWRUZXh0O1xuICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHRyYW5zbGF0ZWRFbCwgb3JpZ2luYWwubmV4dFNpYmxpbmcpO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiDmiafooYwgaW5qZWN0QmlsaW5ndWFsIOaTjeS9nFxuICog5pSv5oyB5LiJ56eN5qih5byPOiBpbmplY3TvvIjms6jlhaXnv7vor5HvvIkvIHRvZ2dsZe+8iOWIh+aNouaYvuekui/pmpDol4/vvIkvIGNsZWFy77yI5riF6Zmk5omA5pyJ57+76K+R77yJXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVJbmplY3RCaWxpbmd1YWwoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgY29uc3QgbW9kZSA9IGFjdGlvbi5pbmplY3RNb2RlIHx8ICdpbmplY3QnO1xuXG4gIHN3aXRjaCAobW9kZSkge1xuICAgIGNhc2UgJ2luamVjdCc6IHtcbiAgICAgIGlmICghYWN0aW9uLnRyYW5zbGF0aW9ucykge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdpbmplY3Qg5qih5byP6ZyA6KaBIHRyYW5zbGF0aW9ucyDlj4LmlbDvvIhKU09OIOWtl+espuS4su+8iScgfTtcbiAgICAgIH1cblxuICAgICAgbGV0IGl0ZW1zOiBBcnJheTx7IGlkOiBzdHJpbmc7IHRyYW5zbGF0ZWQ6IHN0cmluZyB9PjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBwYXJzZWQgPSBKU09OLnBhcnNlKGFjdGlvbi50cmFuc2xhdGlvbnMpO1xuXG4gICAgICAgIC8vIOmYsuW+oeaAp+iHquWKqOino+WMhe+8muW9kyB0cmFuc2xhdGlvbnMg5Li6IHt0cmFuc2xhdGlvbnM6Wy4uLl19IOWMheijheWvueixoeaXtuiHquWKqOaPkOWPluaVsOe7hFxuICAgICAgICBpZiAocGFyc2VkICE9PSBudWxsICYmIHR5cGVvZiBwYXJzZWQgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHBhcnNlZCkpIHtcbiAgICAgICAgICAvLyDmo4DmtYsgLnRyYW5zbGF0aW9ucyDlsZ7mgKfmmK/lkKbkuLogQXJyYXnvvIzmmK/liJnoh6rliqjop6PljIVcbiAgICAgICAgICBjb25zdCBpbm5lciA9IChwYXJzZWQgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pLnRyYW5zbGF0aW9ucztcbiAgICAgICAgICBpZiAoaW5uZXIgJiYgQXJyYXkuaXNBcnJheShpbm5lcikpIHsgcGFyc2VkID0gaW5uZXI7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShwYXJzZWQpKSB7XG4gICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAndHJhbnNsYXRpb25zIOW/hemhu+aYr+aVsOe7hOaIliB7dHJhbnNsYXRpb25zOlsuLi5dfSDljIXoo4Xlr7nosaEnIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmlK/mjIEgc3RyaW5nW10g5bmz5Z2m5pWw57uE77ya6Ieq5Yqo5oyJ57Si5byV5LiOIGRhdGEtaW10LWlkIOWFg+e0oOmFjeWvuVxuICAgICAgICAvLyDkvovlpoIgW1wic3RyMVwiLFwic3RyMlwiXSDihpIgW3tpZDpcImltdC0wXCIsdHJhbnNsYXRlZDpcInN0cjFcIn0se2lkOlwiaW10LTFcIix0cmFuc2xhdGVkOlwic3RyMlwifV1cbiAgICAgICAgaWYgKHBhcnNlZC5sZW5ndGggPiAwICYmIHR5cGVvZiBwYXJzZWRbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaXRlbXMgPSAocGFyc2VkIGFzIHN0cmluZ1tdKS5tYXAoKHRleHQsIGlkeCkgPT4gKHtcbiAgICAgICAgICAgIGlkOiBgaW10LSR7aWR4fWAsXG4gICAgICAgICAgICB0cmFuc2xhdGVkOiB0ZXh0LFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtcyA9IHBhcnNlZDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3RyYW5zbGF0aW9ucyDlj4LmlbAgSlNPTiDop6PmnpDlpLHotKUnIH07XG4gICAgICB9XG5cbiAgICAgIGVuc3VyZUltdFN0eWxlKCk7XG5cbiAgICAgIC8vIOKUgOKUgCBldm9fdjIzXzAwMyArIGV2b192MjdfMDA0OiDoh6rliqjph43moIforrDlhZzlupXvvIjlhbzlrrnlj7boioLngrnmj5Dlj5bnrZbnlaXvvInilIDilIBcbiAgICAgIC8vIOW9kyBkYXRhLWltdC1pZCDlhYPntKDlhajpg6jnvLrlpLHml7bvvIhTUEEg6YeN5riy5p+TIC8gdGFiIOWIh+aNouWvvOiHtCBET00g6YeN5bu677yJ77yMXG4gICAgICAvLyDoh6rliqjph43mlrDosIPnlKggZXh0cmFjdFBhcmFncmFwaHMg5qCH6K6w5q616JC977yM5YaN5oyJ57Si5byV6YWN5a+55rOo5YWl57+76K+R44CCXG4gICAgICAvLyBldm9fdjI3XzAwNDog6YeN5qCH6K6w5ZCO5oyJ57Si5byV6YeN5pig5bCEIGl0ZW1zW10uaWQg4oaSIOaWsOaPkOWPlueahOauteiQvSBJRO+8jFxuICAgICAgLy8g56Gu5L+dIDxhPiDlj7boioLngrnnmoQgZGF0YS1pbXQtaWQg5LiO57+76K+R57uT5p6c5q2j56Gu6YWN5a+544CCXG4gICAgICBsZXQgYXV0b1JlbWFya0RvbmUgPSBmYWxzZTtcbiAgICAgIGNvbnN0IGV4aXN0aW5nTWFya2VkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaW10LWlkXScpLmxlbmd0aDtcbiAgICAgIGlmIChleGlzdGluZ01hcmtlZCA9PT0gMCAmJiBpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdbaW10XSDoh6rliqjph43moIforrDvvJpkYXRhLWltdC1pZCDlhYPntKDlhajpg6jnvLrlpLHvvIzph43mlrDmj5Dlj5bmrrXokL3lubbmoIforrAnKTtcbiAgICAgICAgY29uc3QgcmVFeHRyYWN0UmVzdWx0ID0gZXhlY3V0ZUV4dHJhY3RQYXJhZ3JhcGhzKHsgdHlwZTogJ2V4dHJhY3RQYXJhZ3JhcGhzJyB9KTtcbiAgICAgICAgaWYgKHJlRXh0cmFjdFJlc3VsdC5zdWNjZXNzICYmIHJlRXh0cmFjdFJlc3VsdC5kYXRhKSB7XG4gICAgICAgICAgY29uc3QgcmVEYXRhID0gcmVFeHRyYWN0UmVzdWx0LmRhdGEgYXMgeyB0b3RhbEV4dHJhY3RlZDogbnVtYmVyOyBwYXJhZ3JhcGhzOiBBcnJheTx7IGlkOiBzdHJpbmc7IHRhZzogc3RyaW5nOyB0ZXh0OiBzdHJpbmcgfT4gfTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgW2ltdF0g6Ieq5Yqo6YeN5qCH6K6w5a6M5oiQ77ya6YeN5paw5qCH6K6w5LqGICR7cmVEYXRhLnRvdGFsRXh0cmFjdGVkfSDkuKrmrrXokL1gKTtcbiAgICAgICAgICBhdXRvUmVtYXJrRG9uZSA9IHRydWU7XG5cbiAgICAgICAgICAvLyDilIDilIAgZXZvX3YyN18wMDQ6IElEIOmHjeaYoOWwhCDilIDilIBcbiAgICAgICAgICAvLyDph43moIforrDlkI7vvIxpdGVtcyDkuK3nmoTml6cgSUQg5Y+v6IO95LiO5paw5o+Q5Y+W55qEIElEIOS4jeS4gOiHtOOAglxuICAgICAgICAgIC8vIOaMiee0ouW8leWwhiBpdGVtc1tpXS5pZCDph43mmKDlsITkuLogcmVEYXRhLnBhcmFncmFwaHNbaV0uaWTvvIxcbiAgICAgICAgICAvLyDkv53or4EgPGE+LzxzcGFuPiDnrYnlj7boioLngrnnmoQgZGF0YS1pbXQtaWQg5LiO57+76K+R5q2j56Gu6YWN5a+544CCXG4gICAgICAgICAgY29uc3QgbmV3UGFyYWdyYXBocyA9IHJlRGF0YS5wYXJhZ3JhcGhzO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoICYmIGkgPCBuZXdQYXJhZ3JhcGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRJZCA9IGl0ZW1zW2ldLmlkO1xuICAgICAgICAgICAgY29uc3QgbmV3SWQgPSBuZXdQYXJhZ3JhcGhzW2ldLmlkO1xuICAgICAgICAgICAgaWYgKG9sZElkICE9PSBuZXdJZCkge1xuICAgICAgICAgICAgICBpdGVtc1tpXS5pZCA9IG5ld0lkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmxvZyhgW2ltdF0gSUQg6YeN5pig5bCE5a6M5oiQ77yaJHtNYXRoLm1pbihpdGVtcy5sZW5ndGgsIG5ld1BhcmFncmFwaHMubGVuZ3RoKX0g6aG55bey5a+56b2QYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbaW10XSDoh6rliqjph43moIforrDlpLHotKXvvJonLCByZUV4dHJhY3RSZXN1bHQuZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBpbmplY3RlZCA9IDA7XG4gICAgICBsZXQgc2tpcHBlZCA9IDA7XG5cbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICBpZiAoIWl0ZW0uaWQgfHwgIWl0ZW0udHJhbnNsYXRlZCkge1xuICAgICAgICAgIHNraXBwZWQrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaW10LWlkPVwiJHtpdGVtLmlkfVwiXWApO1xuICAgICAgICBpZiAoIW9yaWdpbmFsKSB7XG4gICAgICAgICAgc2tpcHBlZCsrO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6YG/5YWN6YeN5aSN5rOo5YWl77ya5qOA5p+l5piv5ZCm5bey5pyJ5ZCMIGlkIOeahOe/u+ivkVxuICAgICAgICBjb25zdCBleGlzdGluZ1RyYW5zbGF0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmltdC10cmFuc2xhdGlvbltkYXRhLWltdC1zb3VyY2U9XCIke2l0ZW0uaWR9XCJdYCk7XG4gICAgICAgIGlmIChleGlzdGluZ1RyYW5zbGF0aW9uKSB7XG4gICAgICAgICAgLy8g5pu05paw546w5pyJ57+76K+RXG4gICAgICAgICAgZXhpc3RpbmdUcmFuc2xhdGlvbi50ZXh0Q29udGVudCA9IGl0ZW0udHJhbnNsYXRlZDtcbiAgICAgICAgICBleGlzdGluZ1RyYW5zbGF0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ltdC1oaWRkZW4nKTtcbiAgICAgICAgICBpbmplY3RlZCsrO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6KGo5qC85biD5bGA5YW85a655rOo5YWlIOKAlCDmoLnmja7kuIrkuIvmlofpgInmi6nlkIjpgILnmoTmj5LlhaXkvY3nva7lkozlhYPntKDnsbvlnotcbiAgICAgICAgY29uc3QgaW5zZXJ0ZWQgPSBpbnNlcnRUcmFuc2xhdGlvbkVsZW1lbnQob3JpZ2luYWwsIGl0ZW0udHJhbnNsYXRlZCwgaXRlbS5pZCk7XG4gICAgICAgIGlmIChpbnNlcnRlZCkge1xuICAgICAgICAgIGluamVjdGVkKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2tpcHBlZCsrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIOKUgOKUgCBldm9fdjIzXzAwNDog5rOo5YWl57uT5p6c6K+K5pat5aKe5by6IOKUgOKUgFxuICAgICAgLy8gaW5qZWN0ZWQ9MCDkuJQgc2tpcHBlZD4wIOaXtumZhOWKoOiviuaWreS/oeaBr++8jOW4ruWKqeeUqOaIty9BZ2VudCDnkIbop6PlpLHotKXljp/lm6BcbiAgICAgIGxldCBkaWFnbm9zdGljOiB7IHBvc3NpYmxlQ2F1c2VzOiBzdHJpbmdbXTsgc3VnZ2VzdGVkQWN0aW9uczogc3RyaW5nW10gfSB8IHVuZGVmaW5lZDtcbiAgICAgIGlmIChpbmplY3RlZCA9PT0gMCAmJiBza2lwcGVkID4gMCkge1xuICAgICAgICBjb25zdCBwb3NzaWJsZUNhdXNlczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGVkQWN0aW9uczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICBpZiAoYXV0b1JlbWFya0RvbmUpIHtcbiAgICAgICAgICAvLyDoh6rliqjph43moIforrDlt7LmiafooYzkvYbku43nhLYgaW5qZWN0ZWQ9MCDihpIg57+76K+R5pWw5o2u5LiO6aG16Z2i5q616JC95LiN5Yy56YWNXG4gICAgICAgICAgcG9zc2libGVDYXVzZXMucHVzaChcbiAgICAgICAgICAgICfoh6rliqjph43moIforrDlt7LmiafooYzvvIzkvYbnv7vor5HmlbDmja7kuI7lvZPliY3pobXpnaLmrrXokL3ml6Dms5XljLnphY3vvIjpobXpnaLlhoXlrrnlj6/og73lt7Llj5HnlJ/lj5jljJbvvIknLFxuICAgICAgICAgICk7XG4gICAgICAgICAgc3VnZ2VzdGVkQWN0aW9ucy5wdXNoKCfph43mlrDmiafooYzlrozmlbTnv7vor5HmtYHnqIvvvIhleHRyYWN0UGFyYWdyYXBocyDihpIgdHJhbnNsYXRlIOKGkiBpbmplY3RCaWxpbmd1YWzvvIknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyDmnKrop6blj5Hoh6rliqjph43moIforrAg4oaSIGRhdGEtaW10LWlkIOWtmOWcqOS9hiBpdGVtLmlkIC8gaXRlbS50cmFuc2xhdGVkIOWPr+iDveS4uuepulxuICAgICAgICAgIGNvbnN0IG1hcmtlZENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaW10LWlkXScpLmxlbmd0aDtcbiAgICAgICAgICBpZiAobWFya2VkQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBwb3NzaWJsZUNhdXNlcy5wdXNoKFxuICAgICAgICAgICAgICBg6aG16Z2i5a2Y5ZyoICR7bWFya2VkQ291bnR9IOS4quW3suagh+iusOauteiQve+8jOS9hue/u+ivkeaVsOaNruS4reeahCBpZC90cmFuc2xhdGVkIOWtl+auteWPr+iDvee8uuWkseaIluagvOW8j+S4jeato+ehrmAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc3VnZ2VzdGVkQWN0aW9ucy5wdXNoKCfmo4Dmn6UgdHJhbnNsYXRpb25zIOaVsOaNruagvOW8j++8muavj+mhuemcgOWMheWQqyB7IGlkOiBcImltdC1OXCIsIHRyYW5zbGF0ZWQ6IFwi57+76K+R5paH5pysXCIgfScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3NzaWJsZUNhdXNlcy5wdXNoKCdUYWIg5YiH5o2i5a+86Ie05bel5YW35omn6KGM5Yiw5LqG5LiN5ZCM6aG16Z2i77yM55uu5qCH6aG16Z2i5pegIGRhdGEtaW10LWlkIOagh+iusCcpO1xuICAgICAgICAgICAgcG9zc2libGVDYXVzZXMucHVzaCgnU1BBIOmhtemdoumHjea4suafk+WvvOiHtOS5i+WJjeagh+iusOeahCBET00g6IqC54K56KKr5pu/5o2iJyk7XG4gICAgICAgICAgICBzdWdnZXN0ZWRBY3Rpb25zLnB1c2goJ+ehruS/nee/u+ivkeacn+mXtOS4jeimgeWIh+aNoua1j+iniOWZqOagh+etvumhtScpO1xuICAgICAgICAgICAgc3VnZ2VzdGVkQWN0aW9ucy5wdXNoKCfph43mlrDmiafooYzlrozmlbTnv7vor5HmtYHnqIvvvIhleHRyYWN0UGFyYWdyYXBocyDihpIgdHJhbnNsYXRlIOKGkiBpbmplY3RCaWxpbmd1YWzvvIknKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkaWFnbm9zdGljID0geyBwb3NzaWJsZUNhdXNlcywgc3VnZ2VzdGVkQWN0aW9ucyB9O1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tpbXRdIOiviuaWre+8muazqOWFpeaVsOS4uiAwJywgZGlhZ25vc3RpYyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlOiAnaW5qZWN0JyxcbiAgICAgICAgICBpbmplY3RlZCxcbiAgICAgICAgICBza2lwcGVkLFxuICAgICAgICAgIHRvdGFsOiBpdGVtcy5sZW5ndGgsXG4gICAgICAgICAgLi4uKGF1dG9SZW1hcmtEb25lID8geyBhdXRvUmVtYXJrRG9uZTogdHJ1ZSB9IDoge30pLFxuICAgICAgICAgIC4uLihkaWFnbm9zdGljID8geyBkaWFnbm9zdGljIH0gOiB7fSksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ3RvZ2dsZSc6IHtcbiAgICAgIC8vIOKUgOKUgCBldm9fdjI3XzAwNDog5YW85a655pawIERPTSDnu5PmnoTvvIhpbi1jZWxsIC8gaW5saW5lIC8gYmxvY2vvvInilIDilIBcbiAgICAgIC8vIOafpeivouaJgOaciee/u+ivkeWFg+e0oO+8jOa2teeblu+8mlxuICAgICAgLy8gICAtIENhc2UgMTogPGRpdiBjbGFzcz1cImltdC10cmFuc2xhdGlvblwiPiBpbnNpZGUgPHRkPu+8iOihqOagvOihjOWGheazqOWFpe+8iVxuICAgICAgLy8gICAtIENhc2UgMjogPHNwYW4gY2xhc3M9XCJpbXQtdHJhbnNsYXRpb24gaW10LWlubGluZVwiPiBhZnRlciA8YT7vvIjlj7boioLngrnms6jlhaXvvIlcbiAgICAgIC8vICAgLSBDYXNlIDM6IDxkaXYgY2xhc3M9XCJpbXQtdHJhbnNsYXRpb25cIj4gYWZ0ZXIgPHA+77yI5pmu6YCa5Z2X57qn5rOo5YWl77yJXG4gICAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW10LXRyYW5zbGF0aW9uJyk7XG4gICAgICBpZiAodHJhbnNsYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IG1vZGU6ICd0b2dnbGUnLCBtZXNzYWdlOiAn5rKh5pyJ5bey5rOo5YWl55qE57+76K+RJywgdG9nZ2xlZDogMCB9IH07XG4gICAgICB9XG5cbiAgICAgIC8vIOajgOafpeW9k+WJjeeKtuaAge+8iOagueaNruesrOS4gOS4que/u+ivkeauteiQveWIpOaWre+8iVxuICAgICAgY29uc3QgaXNIaWRkZW4gPSB0cmFuc2xhdGlvbnNbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdpbXQtaGlkZGVuJyk7XG4gICAgICBsZXQgaW5saW5lQ291bnQgPSAwO1xuICAgICAgbGV0IGJsb2NrQ291bnQgPSAwO1xuXG4gICAgICB0cmFuc2xhdGlvbnMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgaWYgKGlzSGlkZGVuKSB7XG4gICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaW10LWhpZGRlbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2ltdC1oaWRkZW4nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDnu5/orqHkuI3lkIwgRE9NIOe7k+aehOexu+Wei1xuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbXQtaW5saW5lJykpIHtcbiAgICAgICAgICBpbmxpbmVDb3VudCsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJsb2NrQ291bnQrKztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlOiAndG9nZ2xlJyxcbiAgICAgICAgICBuZXdTdGF0ZTogaXNIaWRkZW4gPyAndmlzaWJsZScgOiAnaGlkZGVuJyxcbiAgICAgICAgICB0b2dnbGVkOiB0cmFuc2xhdGlvbnMubGVuZ3RoLFxuICAgICAgICAgIGlubGluZUNvdW50LFxuICAgICAgICAgIGJsb2NrQ291bnQsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ2NsZWFyJzoge1xuICAgICAgLy8g4pSA4pSAIGV2b192MjdfMDA0OiDlhbzlrrnmlrAgRE9NIOe7k+aehOeahOa4hemZpOmAu+i+kSDilIDilIBcbiAgICAgIC8vIOenu+mZpOaJgOaciee/u+ivkeWFg+e0oO+8jOa2teeblu+8mlxuICAgICAgLy8gICAtIDxkaXYgY2xhc3M9XCJpbXQtdHJhbnNsYXRpb25cIj4gaW5zaWRlIDx0ZD7vvIjooajmoLwgaW4tY2VsbCDms6jlhaXvvIlcbiAgICAgIC8vICAgLSA8c3BhbiBjbGFzcz1cImltdC10cmFuc2xhdGlvbiBpbXQtaW5saW5lXCI+IGFmdGVyIDxhPu+8iOWPtuiKgueCuSBpbmxpbmUg5rOo5YWl77yJXG4gICAgICAvLyAgIC0gPGRpdiBjbGFzcz1cImltdC10cmFuc2xhdGlvblwiPiBhZnRlciA8cD7vvIjmma7pgJogYmxvY2sg5rOo5YWl77yJXG4gICAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW10LXRyYW5zbGF0aW9uJyk7XG4gICAgICBjb25zdCBjb3VudCA9IHRyYW5zbGF0aW9ucy5sZW5ndGg7XG4gICAgICBsZXQgaW5saW5lUmVtb3ZlZCA9IDA7XG4gICAgICBsZXQgYmxvY2tSZW1vdmVkID0gMDtcblxuICAgICAgdHJhbnNsYXRpb25zLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2ltdC1pbmxpbmUnKSkge1xuICAgICAgICAgIGlubGluZVJlbW92ZWQrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBibG9ja1JlbW92ZWQrKztcbiAgICAgICAgfVxuICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyDnp7vpmaQgZGF0YS1pbXQtaWQg5bGe5oCn77yI6KaG55uW5omA5pyJ5YWD57Sg57G75Z6L77yaPHA+Lzx0ZD4vPGE+LzxzcGFuPiDnrYnlj7boioLngrnvvIlcbiAgICAgIGNvbnN0IHRhZ2dlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWltdC1pZF0nKTtcbiAgICAgIGNvbnN0IHVudGFnZ2VkQ291bnQgPSB0YWdnZWQubGVuZ3RoO1xuICAgICAgdGFnZ2VkLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW10LWlkJykpO1xuXG4gICAgICAvLyDnp7vpmaTmoLflvI9cbiAgICAgIGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChJTVRfU1RZTEVfSUQpO1xuICAgICAgaWYgKHN0eWxlRWwpIHsgc3R5bGVFbC5yZW1vdmUoKTsgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZTogJ2NsZWFyJyxcbiAgICAgICAgICByZW1vdmVkOiBjb3VudCxcbiAgICAgICAgICBpbmxpbmVSZW1vdmVkLFxuICAgICAgICAgIGJsb2NrUmVtb3ZlZCxcbiAgICAgICAgICB1bnRhZ2dlZDogdW50YWdnZWRDb3VudCxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOS4jeaUr+aMgeeahCBpbmplY3RCaWxpbmd1YWwg5qih5byPOiAke21vZGV9YCB9O1xuICB9XG59XG5cbi8vIOKUgOKUgCBldm9fdjI4XzAwMzog5oiq5Zu+5ZCI5oiQ5LiL6L29IOKAlCBDYW52YXMg57q15ZCR5ou85o6lICsgQmxvYiDkuIvovb0g4pSA4pSAXG5cbi8qKlxuICogY29tcG9zaXRlU2NyZWVuc2hvdHMg4oCUIOWwhuWkmuW8oCBiYXNlNjQg5oiq5Zu+57q15ZCR5ou85o6l5oiQ5LiA5byg6ZW/5Zu+5bm26Kem5Y+R5rWP6KeI5Zmo5LiL6L29XG4gKlxuICog5a6e546w5oCd6Lev77yaXG4gKiAxLiDlsIbmr4/lvKAgYmFzZTY0IGRhdGEgVVJMIOWKoOi9veS4uiBJbWFnZSDlr7nosaFcbiAqIDIuIOiuoeeul+WQiOaIkOeUu+W4g+WwuuWvuO+8muWuveW6puWPluacgOWkp+WAvO+8jOmrmOW6puS4uuaJgOacieWbvueJh+mrmOW6puS5i+WSjFxuICogMy4g5L2/55SoIE9mZnNjcmVlbkNhbnZhc++8iOmZjee6pyBDYW52YXPvvInnurXlkJHnu5jliLbmiYDmnInlm77niYdcbiAqIDQuIOWvvOWHuuS4uiBCbG9iIOKGkiDliJvlu7ogT2JqZWN0IFVSTCDihpIgPGEgZG93bmxvYWQ+IOinpuWPkea1j+iniOWZqOS4i+i9vVxuICogNS4g5LiL6L295ZCO5riF55CG5Li05pe2IFVSTFxuICovXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlQ29tcG9zaXRlRG93bmxvYWQoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ+IHtcbiAgY29uc3QgcmF3ID0gYWN0aW9uLnNjcmVlbnNob3RzO1xuICBpZiAoIXJhdykge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2NvbXBvc2l0ZURvd25sb2FkIOmcgOimgSBzY3JlZW5zaG90cyDlj4LmlbDvvIhiYXNlNjQgZGF0YSBVUkwg5pWw57uE55qEIEpTT04g5a2X56ym5Liy77yJJyB9O1xuICB9XG5cbiAgLy8g5pSv5oyBIEpTT04g5a2X56ym5Liy5oiW5bey6Kej5p6Q55qE5pWw57uE77yI6Ziy5b6h5oCn5aSE55CG77yJXG4gIGxldCBzY3JlZW5zaG90czogc3RyaW5nW107XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkID0gdHlwZW9mIHJhdyA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHJhdykgOiByYXc7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHBhcnNlZCkgfHwgcGFyc2VkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2NyZWVuc2hvdHMg5b+F6aG75piv6Z2e56m65pWw57uEJyB9O1xuICAgIH1cbiAgICBzY3JlZW5zaG90cyA9IHBhcnNlZCBhcyBzdHJpbmdbXTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2NyZWVuc2hvdHMg5Y+C5pWwIEpTT04g6Kej5p6Q5aSx6LSlJyB9O1xuICB9XG5cbiAgY29uc3QgZmlsZU5hbWUgPSBhY3Rpb24uZmlsZU5hbWUgfHwgJ2NvbXBvc2l0ZS1zY3JlZW5zaG90LnBuZyc7XG5cbiAgdHJ5IHtcbiAgICAvLyAxLiDlubbooYzliqDovb3miYDmnIkgYmFzZTY0IOWbvueJh+S4uiBJbWFnZSDlr7nosaFcbiAgICBjb25zdCBpbWFnZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIHNjcmVlbnNob3RzLm1hcCgoc3JjKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoaW1nKTtcbiAgICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHJlamVjdChuZXcgRXJyb3IoYOWbvueJh+WKoOi9veWksei0pTogJHtzcmMuc2xpY2UoMCwgNjApfS4uLmApKTtcbiAgICAgICAgICBpbWcuc3JjID0gc3JjO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyAyLiDorqHnrpflkIjmiJDnlLvluIPlsLrlr7hcbiAgICBjb25zdCBtYXhXaWR0aCA9IE1hdGgubWF4KC4uLmltYWdlcy5tYXAoKGltZykgPT4gaW1nLm5hdHVyYWxXaWR0aCkpO1xuICAgIGNvbnN0IHRvdGFsSGVpZ2h0ID0gaW1hZ2VzLnJlZHVjZSgoc3VtLCBpbWcpID0+IHN1bSArIGltZy5uYXR1cmFsSGVpZ2h0LCAwKTtcblxuICAgIGlmIChtYXhXaWR0aCA8PSAwIHx8IHRvdGFsSGVpZ2h0IDw9IDApIHtcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ+WbvueJh+WwuuWvuOaXoOaViO+8iOWuveaIlumrmOS4uiAw77yJJyB9O1xuICAgIH1cblxuICAgIC8vIDMuIOWIm+W7uiBDYW52YXMg5bm257q15ZCR57uY5Yi2XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gbWF4V2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHRvdGFsSGVpZ2h0O1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICghY3R4KSB7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICfml6Dms5XliJvlu7ogQ2FudmFzIDJEIOS4iuS4i+aWhycgfTtcbiAgICB9XG5cbiAgICAvLyDnmb3oibLog4zmma9cbiAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xuICAgIGN0eC5maWxsUmVjdCgwLCAwLCBtYXhXaWR0aCwgdG90YWxIZWlnaHQpO1xuXG4gICAgbGV0IHlPZmZzZXQgPSAwO1xuICAgIGZvciAoY29uc3QgaW1nIG9mIGltYWdlcykge1xuICAgICAgLy8g5q+P5byg5Zu+54mH5bem5a+56b2Q57uY5Yi277yM5a695bqm5LiN6LazIG1heFdpZHRoIOeahOmDqOWIhuS/neaMgeeZveiJsuiDjOaZr1xuICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIHlPZmZzZXQsIGltZy5uYXR1cmFsV2lkdGgsIGltZy5uYXR1cmFsSGVpZ2h0KTtcbiAgICAgIHlPZmZzZXQgKz0gaW1nLm5hdHVyYWxIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gNC4gQ2FudmFzIOKGkiBCbG9iIOKGkiDop6blj5HkuIvovb1cbiAgICBjb25zdCBibG9iID0gYXdhaXQgbmV3IFByb21pc2U8QmxvYj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY2FudmFzLnRvQmxvYigoYikgPT4ge1xuICAgICAgICBpZiAoYikge1xuICAgICAgICAgIHJlc29sdmUoYik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignQ2FudmFzIHRvQmxvYiDlpLHotKUnKSk7XG4gICAgICAgIH1cbiAgICAgIH0sICdpbWFnZS9wbmcnKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGFuY2hvci5ocmVmID0gdXJsO1xuICAgIGFuY2hvci5kb3dubG9hZCA9IGZpbGVOYW1lO1xuICAgIGFuY2hvci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYW5jaG9yKTtcbiAgICBhbmNob3IuY2xpY2soKTtcblxuICAgIC8vIOa4heeQhlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhbmNob3IpO1xuICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgIH0sIDEwMDApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBpbWFnZUNvdW50OiBpbWFnZXMubGVuZ3RoLFxuICAgICAgICB3aWR0aDogbWF4V2lkdGgsXG4gICAgICAgIGhlaWdodDogdG90YWxIZWlnaHQsXG4gICAgICAgIGZpbGVTaXplQnl0ZXM6IGJsb2Iuc2l6ZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IGDmiKrlm77lkIjmiJDlpLHotKU6ICR7ZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpfWAsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIOS4u+aJp+ihjOWFpeWPoyDigJQg5qC55o2uIGFjdGlvbi50eXBlIOWIhuWPkeWIsOWvueW6lOaJp+ihjOWHveaVsFxuICpcbiAqIOazqOaEj++8mnNjcmVlbnNob3Qg5pON5L2c6ZyA6KaB5ZyoIGJhY2tncm91bmQgc2NyaXB0IOS4reS9v+eUqCBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYu+8jFxuICogY29udGVudCBzY3JpcHQg5peg5rOV5omn6KGM5q2k5pON5L2c77yM6L+U5Zue54m55q6K5qCH6K6w55SxIGJhY2tncm91bmQg5aSE55CG44CCXG4gKi9cbi8qKlxuICog5omn6KGMIGdldFBhZ2VJbmZvIOaTjeS9nCDigJQgQ1NQIOWuieWFqOeahOmhtemdouW6pumHj+W3peWFt1xuICog55u05o6l6K+75Y+WIERPTSDlsZ7mgKfojrflj5bpobXpnaLlsLrlr7jjgIHmu5rliqjkvY3nva7jgIFVUkzjgIHmoIfpopjnrYnkv6Hmga/vvIxcbiAqIOS4jeS+nei1liBldmFsIC8gbmV3IEZ1bmN0aW9u77yM5ZyoIENTUCDkuKXmoLzpobXpnaLkuIrlj6/mraPluLjosIPnlKjjgIJcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUdldFBhZ2VJbmZvKCk6IEFjdGlvblJlc3VsdCB7XG4gIGNvbnN0IGRvY0VsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgZGF0YToge1xuICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgIHNjcm9sbEhlaWdodDogZG9jRWwuc2Nyb2xsSGVpZ2h0LFxuICAgICAgc2Nyb2xsV2lkdGg6IGRvY0VsLnNjcm9sbFdpZHRoLFxuICAgICAgY2xpZW50SGVpZ2h0OiBkb2NFbC5jbGllbnRIZWlnaHQsXG4gICAgICBjbGllbnRXaWR0aDogZG9jRWwuY2xpZW50V2lkdGgsXG4gICAgICBzY3JvbGxUb3A6IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldCB8fCAwLFxuICAgICAgc2Nyb2xsTGVmdDogd2luZG93LnNjcm9sbFggfHwgd2luZG93LnBhZ2VYT2Zmc2V0IHx8IDAsXG4gICAgICAvLyDorqHnrpfmgLvlsY/mlbDvvIjlkJHkuIrlj5bmlbTvvInvvIzmlrnkvr8gYmF0Y2hfc2NyZWVuc2hvdCDnrYkgU2tpbGwg5L2/55SoXG4gICAgICB0b3RhbFNjcmVlbnM6IE1hdGguY2VpbChkb2NFbC5zY3JvbGxIZWlnaHQgLyAoZG9jRWwuY2xpZW50SGVpZ2h0IHx8IDEpKSxcbiAgICAgIC8vIOaWh+aho+Wwsee7queKtuaAgVxuICAgICAgcmVhZHlTdGF0ZTogZG9jdW1lbnQucmVhZHlTdGF0ZSxcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUFjdGlvbihhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBQcm9taXNlPEFjdGlvblJlc3VsdD4ge1xuICB0cnkge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVDbGljayhhY3Rpb24pO1xuXG4gICAgICBjYXNlICd0eXBlJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVUeXBlKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ3Njcm9sbCc6XG4gICAgICAgIHJldHVybiBleGVjdXRlU2Nyb2xsKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ25hdmlnYXRlJzpcbiAgICAgICAgLy8gbmF2aWdhdGUg5ZyoIGNvbnRlbnQgc2NyaXB0IOS4remAmui/hyBsb2NhdGlvbi5ocmVmIOWunueOsFxuICAgICAgICBpZiAoIWFjdGlvbi51cmwpIHtcbiAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICduYXZpZ2F0ZSDmk43kvZzpnIDopoEgdXJsIOWPguaVsCcgfTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFjdGlvbi51cmw7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgbmF2aWdhdGVkOiBhY3Rpb24udXJsIH0gfTtcblxuICAgICAgY2FzZSAncXVlcnlTZWxlY3Rvcic6XG4gICAgICAgIHJldHVybiBleGVjdXRlUXVlcnlTZWxlY3RvcihhY3Rpb24pO1xuXG4gICAgICBjYXNlICdxdWVyeVNlbGVjdG9yQWxsJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVRdWVyeVNlbGVjdG9yQWxsKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ2dldFRleHRDb250ZW50JzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVHZXRUZXh0Q29udGVudChhY3Rpb24pO1xuXG4gICAgICBjYXNlICdnZXRBdHRyaWJ1dGUnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUdldEF0dHJpYnV0ZShhY3Rpb24pO1xuXG4gICAgICBjYXNlICdnZXRWYWx1ZSc6XG4gICAgICAgIHJldHVybiBleGVjdXRlR2V0VmFsdWUoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnc2NyZWVuc2hvdCc6XG4gICAgICAgIC8vIHNjcmVlbnNob3Qg6ZyA6KaBIGJhY2tncm91bmQgc2NyaXB0IOadg+mZkO+8jGNvbnRlbnQgc2NyaXB0IOi/lOWbnueJueauiuagh+iusFxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdfX1NDUkVFTlNIT1RfTkVFRFNfQkFDS0dST1VORF9fJyB9O1xuXG4gICAgICBjYXNlICd3YWl0Rm9yRWxlbWVudCc6XG4gICAgICAgIHJldHVybiBleGVjdXRlV2FpdEZvckVsZW1lbnQoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnaGlnaGxpZ2h0JzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVIaWdobGlnaHQoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnZXZhbHVhdGUnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUV2YWx1YXRlKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdE9wdGlvbic6XG4gICAgICAgIHJldHVybiBleGVjdXRlU2VsZWN0T3B0aW9uKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ2dldExpbmtzJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVHZXRMaW5rcyhhY3Rpb24pO1xuXG4gICAgICAvLyDilIDilIAgZXZvX3YxOV8wMDE6IOayiea1uOW8j+e/u+ivkeW3peWFtyDilIDilIBcbiAgICAgIGNhc2UgJ2V4dHJhY3RQYXJhZ3JhcGhzJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVFeHRyYWN0UGFyYWdyYXBocyhhY3Rpb24pO1xuXG4gICAgICBjYXNlICdpbmplY3RCaWxpbmd1YWwnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUluamVjdEJpbGluZ3VhbChhY3Rpb24pO1xuXG4gICAgICAvLyDilIDilIAgZXZvX3YyOF8wMDE6IENTUCDlronlhajnmoTpobXpnaLluqbph4/lt6Xlhbcg4pSA4pSAXG4gICAgICBjYXNlICdnZXRQYWdlSW5mbyc6XG4gICAgICAgIHJldHVybiBleGVjdXRlR2V0UGFnZUluZm8oKTtcblxuICAgICAgLy8g4pSA4pSAIGV2b192MjhfMDAzOiDmiKrlm77lkIjmiJDkuIvovb0g4pSA4pSAXG4gICAgICBjYXNlICdjb21wb3NpdGVEb3dubG9hZCc6XG4gICAgICAgIHJldHVybiBleGVjdXRlQ29tcG9zaXRlRG93bmxvYWQoYWN0aW9uKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5LiN5pSv5oyB55qE5pON5L2c57G75Z6LOiAkeyhhY3Rpb24gYXMgQnJvd3NlckFjdGlvbikudHlwZX1gIH07XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogYOaJp+ihjOaTjeS9nCAke2FjdGlvbi50eXBlfSDlpLHotKU6ICR7ZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpfWAsXG4gICAgfTtcbiAgfVxufVxuIiwiLy8gY29udGVudC50cyDigJQgQ29udGVudCBTY3JpcHTvvIzms6jlhaXpobXpnaLph4fpm4bkuIrkuIvmlofkv6Hmga/vvIhVUkwgLyDmoIfpopggLyDpgInkuK3mlofmnKzvvIlcbi8vIOebkeWQrOadpeiHqiBiYWNrZ3JvdW5kIOeahOS4iuS4i+aWh+ivt+axgu+8jOWunuaXtumHh+mbhuW5tui/lOWbnlxuLy8g5aKe5by677ya5o6l5pS2IEVYRUNVVEVfQUNUSU9OIOa2iOaBr++8jOaJp+ihjOa1j+iniOWZqCBET00g5pON5L2c77yIY2xpY2svdHlwZS9zY3JvbGwg562J77yJXG4vLyDpooTmiKrmlq3vvJpzZWxlY3RlZFRleHQg5Zyo6YeH6ZuG5rqQ5aS05Y2z5oiq5pat77yM6Ziy5q2i5LiK5LiL5paH54iG54K4XG5cbmltcG9ydCB7IGV4ZWN1dGVBY3Rpb24gfSBmcm9tICcuLi91dGlscy9hY3Rpb24tZXhlY3V0b3InO1xuaW1wb3J0IHR5cGUgeyBCcm93c2VyQWN0aW9uLCBBY3Rpb25SZXN1bHQgfSBmcm9tICcuLi91dGlscy9hY3Rpb24tZXhlY3V0b3InO1xuXG4vLyDilIDilIDilIAg5LiK5LiL5paH6aKE566X5bi46YeP77yI5LiOIHZzY29kZS1leHQvY29udGV4dC1idWRnZXQudHMg5L+d5oyB5LiA6Ie077yJIOKUgOKUgOKUgFxuY29uc3QgTUFYX1NFTEVDVEVEX1RFWFRfQ0hBUlMgPSA4MDAwO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2VDb250ZXh0IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHNlbGVjdGVkVGV4dDogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcbiAgbWF0Y2hlczogWyc8YWxsX3VybHM+J10sXG4gIG1haW4oKSB7XG4gICAgY29uc29sZS5sb2coJ1tjb250ZW50XSBCcm93c2VyIEFnZW50IGNvbnRlbnQgc2NyaXB0IGxvYWRlZCBvbjonLCBsb2NhdGlvbi5ocmVmKTtcblxuICAgIC8vIOWTjeW6lOadpeiHqiBiYWNrZ3JvdW5kIC8gc2lkZSBwYW5lbCDnmoTkuIrkuIvmlofor7fmsYJcbiAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBfc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdHRVRfUEFHRV9DT05URVhUJykge1xuICAgICAgICBjb25zdCByYXdTZWxlY3RlZCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKT8udG9TdHJpbmcoKSB8fCAnJztcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gcmF3U2VsZWN0ZWQuc3Vic3RyaW5nKDAsIE1BWF9TRUxFQ1RFRF9URVhUX0NIQVJTKTtcbiAgICAgICAgY29uc3QgY29udGV4dDogUGFnZUNvbnRleHQgPSB7XG4gICAgICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICBzZWxlY3RlZFRleHQsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChyYXdTZWxlY3RlZC5sZW5ndGggPiBNQVhfU0VMRUNURURfVEVYVF9DSEFSUykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbY29udGVudF0gc2VsZWN0ZWRUZXh0IOW3suaIquaWrTonLCByYXdTZWxlY3RlZC5sZW5ndGgsICctPicsIE1BWF9TRUxFQ1RFRF9URVhUX0NIQVJTKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnW2NvbnRlbnRdIOmHh+mbhumhtemdouS4iuS4i+aWhzonLCBjb250ZXh0LnVybCwgJ+mAieS4reaWh+acrOmVv+W6pjonLCBjb250ZXh0LnNlbGVjdGVkVGV4dC5sZW5ndGgpO1xuICAgICAgICBzZW5kUmVzcG9uc2UoeyB0eXBlOiAnUEFHRV9DT05URVhUJywgcGF5bG9hZDogY29udGV4dCB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIOihqOekuuW8guatpeWTjeW6lFxuICAgICAgfVxuXG4gICAgICAvLyDmtY/op4jlmajmk43kvZzmiafooYzlvJXmk47lhaXlj6NcbiAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdFWEVDVVRFX0FDVElPTicpIHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gbWVzc2FnZS5wYXlsb2FkIGFzIEJyb3dzZXJBY3Rpb247XG4gICAgICAgIGNvbnNvbGUubG9nKCdbY29udGVudF0g5omn6KGM5rWP6KeI5Zmo5pON5L2cOicsIGFjdGlvbi50eXBlLCBhY3Rpb24uc2VsZWN0b3IgfHwgJycpO1xuXG4gICAgICAgIC8vIGV4ZWN1dGVBY3Rpb24g5Y+v6IO96L+U5ZueIFByb21pc2XvvIjlpoIgd2FpdEZvckVsZW1lbnTvvInvvIznu5/kuIDnlKggYXN5bmMg5aSE55CGXG4gICAgICAgIGV4ZWN1dGVBY3Rpb24oYWN0aW9uKVxuICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEFjdGlvblJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tjb250ZW50XSDmk43kvZznu5Pmnpw6JywgYWN0aW9uLnR5cGUsIHJlc3VsdC5zdWNjZXNzKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHR5cGU6ICdBQ1RJT05fUkVTVUxUJywgcGF5bG9hZDogcmVzdWx0IH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnI6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTXNnID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2NvbnRlbnRdIOaTjeS9nOaJp+ihjOW8guW4uDonLCBhY3Rpb24udHlwZSwgZXJyb3JNc2cpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgdHlwZTogJ0FDVElPTl9SRVNVTFQnLFxuICAgICAgICAgICAgICBwYXlsb2FkOiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3JNc2cgfSBzYXRpc2ZpZXMgQWN0aW9uUmVzdWx0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyDlvILmraXlk43lupRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8g55uR5ZCs6YCJ5Lit5paH5pys5Y+Y5YyW77yM5Li75Yqo5o6o6YCB57uZIGJhY2tncm91bmTvvIjlkIzmoLfpooTmiKrmlq3vvIlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCByYXdTZWxlY3RlZCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKT8udG9TdHJpbmcoKSB8fCAnJztcbiAgICAgIGlmIChyYXdTZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IHJhd1NlbGVjdGVkLnN1YnN0cmluZygwLCBNQVhfU0VMRUNURURfVEVYVF9DSEFSUyk7XG4gICAgICAgIGlmIChyYXdTZWxlY3RlZC5sZW5ndGggPiBNQVhfU0VMRUNURURfVEVYVF9DSEFSUykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbY29udGVudF0gc2VsZWN0aW9uY2hhbmdlIOaIquaWrTonLCByYXdTZWxlY3RlZC5sZW5ndGgsICctPicsIE1BWF9TRUxFQ1RFRF9URVhUX0NIQVJTKTtcbiAgICAgICAgfVxuICAgICAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgIHR5cGU6ICdTRUxFQ1RJT05fQ0hBTkdFRCcsXG4gICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgICAgc2VsZWN0ZWRUZXh0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAvLyBzaWRlIHBhbmVsIOWPr+iDveacquaJk+W8gO+8jOW/veeVpVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbn0pO1xuIiwiZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG4gIGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICBtZXRob2QoYFt3eHRdICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICBtZXRob2QoXCJbd3h0XVwiLCAuLi5hcmdzKTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IGxvZ2dlciA9IHtcbiAgZGVidWc6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmRlYnVnLCAuLi5hcmdzKSxcbiAgbG9nOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5sb2csIC4uLmFyZ3MpLFxuICB3YXJuOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS53YXJuLCAuLi5hcmdzKSxcbiAgZXJyb3I6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmVycm9yLCAuLi5hcmdzKVxufTtcbiIsImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwid3h0L2Jyb3dzZXJcIjtcbmV4cG9ydCBjbGFzcyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICBjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuICAgIHN1cGVyKFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQuRVZFTlRfTkFNRSwge30pO1xuICAgIHRoaXMubmV3VXJsID0gbmV3VXJsO1xuICAgIHRoaXMub2xkVXJsID0gb2xkVXJsO1xuICB9XG4gIHN0YXRpYyBFVkVOVF9OQU1FID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFVuaXF1ZUV2ZW50TmFtZShldmVudE5hbWUpIHtcbiAgcmV0dXJuIGAke2Jyb3dzZXI/LnJ1bnRpbWU/LmlkfToke2ltcG9ydC5tZXRhLmVudi5FTlRSWVBPSU5UfToke2V2ZW50TmFtZX1gO1xufVxuIiwiaW1wb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9jYXRpb25XYXRjaGVyKGN0eCkge1xuICBsZXQgaW50ZXJ2YWw7XG4gIGxldCBvbGRVcmw7XG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogRW5zdXJlIHRoZSBsb2NhdGlvbiB3YXRjaGVyIGlzIGFjdGl2ZWx5IGxvb2tpbmcgZm9yIFVSTCBjaGFuZ2VzLiBJZiBpdCdzIGFscmVhZHkgd2F0Y2hpbmcsXG4gICAgICogdGhpcyBpcyBhIG5vb3AuXG4gICAgICovXG4gICAgcnVuKCkge1xuICAgICAgaWYgKGludGVydmFsICE9IG51bGwpIHJldHVybjtcbiAgICAgIG9sZFVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgICBpbnRlcnZhbCA9IGN0eC5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGxldCBuZXdVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgICBpZiAobmV3VXJsLmhyZWYgIT09IG9sZFVybC5ocmVmKSB7XG4gICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBvbGRVcmwpKTtcbiAgICAgICAgICBvbGRVcmwgPSBuZXdVcmw7XG4gICAgICAgIH1cbiAgICAgIH0sIDFlMyk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4uLy4uL3NhbmRib3gvdXRpbHMvbG9nZ2VyLm1qc1wiO1xuaW1wb3J0IHsgZ2V0VW5pcXVlRXZlbnROYW1lIH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbmltcG9ydCB7IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlciB9IGZyb20gXCIuL2xvY2F0aW9uLXdhdGNoZXIubWpzXCI7XG5leHBvcnQgY2xhc3MgQ29udGVudFNjcmlwdENvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihjb250ZW50U2NyaXB0TmFtZSwgb3B0aW9ucykge1xuICAgIHRoaXMuY29udGVudFNjcmlwdE5hbWUgPSBjb250ZW50U2NyaXB0TmFtZTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgIGlmICh0aGlzLmlzVG9wRnJhbWUpIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKHsgaWdub3JlRmlyc3RFdmVudDogdHJ1ZSB9KTtcbiAgICAgIHRoaXMuc3RvcE9sZFNjcmlwdHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JOZXdlclNjcmlwdHMoKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcbiAgICBcInd4dDpjb250ZW50LXNjcmlwdC1zdGFydGVkXCJcbiAgKTtcbiAgaXNUb3BGcmFtZSA9IHdpbmRvdy5zZWxmID09PSB3aW5kb3cudG9wO1xuICBhYm9ydENvbnRyb2xsZXI7XG4gIGxvY2F0aW9uV2F0Y2hlciA9IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcih0aGlzKTtcbiAgcmVjZWl2ZWRNZXNzYWdlSWRzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbiAgZ2V0IHNpZ25hbCgpIHtcbiAgICByZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICB9XG4gIGFib3J0KHJlYXNvbikge1xuICAgIHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydChyZWFzb24pO1xuICB9XG4gIGdldCBpc0ludmFsaWQoKSB7XG4gICAgaWYgKGJyb3dzZXIucnVudGltZS5pZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNpZ25hbC5hYm9ydGVkO1xuICB9XG4gIGdldCBpc1ZhbGlkKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0ludmFsaWQ7XG4gIH1cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgc2NyaXB0J3MgY29udGV4dCBpcyBpbnZhbGlkYXRlZC5cbiAgICpcbiAgICogQHJldHVybnMgQSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVyLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGNiKTtcbiAgICogY29uc3QgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lciA9IGN0eC5vbkludmFsaWRhdGVkKCgpID0+IHtcbiAgICogICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGNiKTtcbiAgICogfSlcbiAgICogLy8gLi4uXG4gICAqIHJlbW92ZUludmFsaWRhdGVkTGlzdGVuZXIoKTtcbiAgICovXG4gIG9uSW52YWxpZGF0ZWQoY2IpIHtcbiAgICB0aGlzLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMuIFVzZWZ1bCBpZiB5b3UgaGF2ZSBhbiBhc3luYyBmdW5jdGlvbiB0aGF0IHNob3VsZG4ndCBydW5cbiAgICogYWZ0ZXIgdGhlIGNvbnRleHQgaXMgZXhwaXJlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgZ2V0VmFsdWVGcm9tU3RvcmFnZSA9IGFzeW5jICgpID0+IHtcbiAgICogICBpZiAoY3R4LmlzSW52YWxpZCkgcmV0dXJuIGN0eC5ibG9jaygpO1xuICAgKlxuICAgKiAgIC8vIC4uLlxuICAgKiB9XG4gICAqL1xuICBibG9jaygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge1xuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnNldEludGVydmFsYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbCB3aGVuIGludmFsaWRhdGVkLlxuICAgKi9cbiAgc2V0SW50ZXJ2YWwoaGFuZGxlciwgdGltZW91dCkge1xuICAgIGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuICAgIH0sIHRpbWVvdXQpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhckludGVydmFsKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnNldFRpbWVvdXRgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsIHdoZW4gaW52YWxpZGF0ZWQuXG4gICAqL1xuICBzZXRUaW1lb3V0KGhhbmRsZXIsIHRpbWVvdXQpIHtcbiAgICBjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuICAgIH0sIHRpbWVvdXQpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhclRpbWVvdXQoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgcmVxdWVzdCB3aGVuXG4gICAqIGludmFsaWRhdGVkLlxuICAgKi9cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgIH0pO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGUgcmVxdWVzdCB3aGVuXG4gICAqIGludmFsaWRhdGVkLlxuICAgKi9cbiAgcmVxdWVzdElkbGVDYWxsYmFjayhjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGNvbnN0IGlkID0gcmVxdWVzdElkbGVDYWxsYmFjaygoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNpZ25hbC5hYm9ydGVkKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICB9LCBvcHRpb25zKTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsSWRsZUNhbGxiYWNrKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIGFkZEV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGUgPT09IFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpIHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIHRoaXMubG9jYXRpb25XYXRjaGVyLnJ1bigpO1xuICAgIH1cbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uKFxuICAgICAgdHlwZS5zdGFydHNXaXRoKFwid3h0OlwiKSA/IGdldFVuaXF1ZUV2ZW50TmFtZSh0eXBlKSA6IHR5cGUsXG4gICAgICBoYW5kbGVyLFxuICAgICAge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICBzaWduYWw6IHRoaXMuc2lnbmFsXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEFib3J0IHRoZSBhYm9ydCBjb250cm9sbGVyIGFuZCBleGVjdXRlIGFsbCBgb25JbnZhbGlkYXRlZGAgbGlzdGVuZXJzLlxuICAgKi9cbiAgbm90aWZ5SW52YWxpZGF0ZWQoKSB7XG4gICAgdGhpcy5hYm9ydChcIkNvbnRlbnQgc2NyaXB0IGNvbnRleHQgaW52YWxpZGF0ZWRcIik7XG4gICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgYENvbnRlbnQgc2NyaXB0IFwiJHt0aGlzLmNvbnRlbnRTY3JpcHROYW1lfVwiIGNvbnRleHQgaW52YWxpZGF0ZWRgXG4gICAgKTtcbiAgfVxuICBzdG9wT2xkU2NyaXB0cygpIHtcbiAgICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAgICB7XG4gICAgICAgIHR5cGU6IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSxcbiAgICAgICAgY29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG4gICAgICAgIG1lc3NhZ2VJZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMilcbiAgICAgIH0sXG4gICAgICBcIipcIlxuICAgICk7XG4gIH1cbiAgdmVyaWZ5U2NyaXB0U3RhcnRlZEV2ZW50KGV2ZW50KSB7XG4gICAgY29uc3QgaXNTY3JpcHRTdGFydGVkRXZlbnQgPSBldmVudC5kYXRhPy50eXBlID09PSBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEU7XG4gICAgY29uc3QgaXNTYW1lQ29udGVudFNjcmlwdCA9IGV2ZW50LmRhdGE/LmNvbnRlbnRTY3JpcHROYW1lID09PSB0aGlzLmNvbnRlbnRTY3JpcHROYW1lO1xuICAgIGNvbnN0IGlzTm90RHVwbGljYXRlID0gIXRoaXMucmVjZWl2ZWRNZXNzYWdlSWRzLmhhcyhldmVudC5kYXRhPy5tZXNzYWdlSWQpO1xuICAgIHJldHVybiBpc1NjcmlwdFN0YXJ0ZWRFdmVudCAmJiBpc1NhbWVDb250ZW50U2NyaXB0ICYmIGlzTm90RHVwbGljYXRlO1xuICB9XG4gIGxpc3RlbkZvck5ld2VyU2NyaXB0cyhvcHRpb25zKSB7XG4gICAgbGV0IGlzRmlyc3QgPSB0cnVlO1xuICAgIGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy52ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgIHRoaXMucmVjZWl2ZWRNZXNzYWdlSWRzLmFkZChldmVudC5kYXRhLm1lc3NhZ2VJZCk7XG4gICAgICAgIGNvbnN0IHdhc0ZpcnN0ID0gaXNGaXJzdDtcbiAgICAgICAgaXNGaXJzdCA9IGZhbHNlO1xuICAgICAgICBpZiAod2FzRmlyc3QgJiYgb3B0aW9ucz8uaWdub3JlRmlyc3RFdmVudCkgcmV0dXJuO1xuICAgICAgICB0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBjYik7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKSk7XG4gIH1cbn1cbiIsImNvbnN0IG51bGxLZXkgPSBTeW1ib2woJ251bGwnKTsgLy8gYG9iamVjdEhhc2hlc2Aga2V5IGZvciBudWxsXG5cbmxldCBrZXlDb3VudGVyID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFueUtleXNNYXAgZXh0ZW5kcyBNYXAge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fb2JqZWN0SGFzaGVzID0gbmV3IFdlYWtNYXAoKTtcblx0XHR0aGlzLl9zeW1ib2xIYXNoZXMgPSBuZXcgTWFwKCk7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L2VjbWEyNjIvaXNzdWVzLzExOTRcblx0XHR0aGlzLl9wdWJsaWNLZXlzID0gbmV3IE1hcCgpO1xuXG5cdFx0Y29uc3QgW3BhaXJzXSA9IGFyZ3VtZW50czsgLy8gTWFwIGNvbXBhdFxuXHRcdGlmIChwYWlycyA9PT0gbnVsbCB8fCBwYWlycyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBwYWlyc1tTeW1ib2wuaXRlcmF0b3JdICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKHR5cGVvZiBwYWlycyArICcgaXMgbm90IGl0ZXJhYmxlIChjYW5ub3QgcmVhZCBwcm9wZXJ0eSBTeW1ib2woU3ltYm9sLml0ZXJhdG9yKSknKTtcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IFtrZXlzLCB2YWx1ZV0gb2YgcGFpcnMpIHtcblx0XHRcdHRoaXMuc2V0KGtleXMsIHZhbHVlKTtcblx0XHR9XG5cdH1cblxuXHRfZ2V0UHVibGljS2V5cyhrZXlzLCBjcmVhdGUgPSBmYWxzZSkge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShrZXlzKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGtleXMgcGFyYW1ldGVyIG11c3QgYmUgYW4gYXJyYXknKTtcblx0XHR9XG5cblx0XHRjb25zdCBwcml2YXRlS2V5ID0gdGhpcy5fZ2V0UHJpdmF0ZUtleShrZXlzLCBjcmVhdGUpO1xuXG5cdFx0bGV0IHB1YmxpY0tleTtcblx0XHRpZiAocHJpdmF0ZUtleSAmJiB0aGlzLl9wdWJsaWNLZXlzLmhhcyhwcml2YXRlS2V5KSkge1xuXHRcdFx0cHVibGljS2V5ID0gdGhpcy5fcHVibGljS2V5cy5nZXQocHJpdmF0ZUtleSk7XG5cdFx0fSBlbHNlIGlmIChjcmVhdGUpIHtcblx0XHRcdHB1YmxpY0tleSA9IFsuLi5rZXlzXTsgLy8gUmVnZW5lcmF0ZSBrZXlzIGFycmF5IHRvIGF2b2lkIGV4dGVybmFsIGludGVyYWN0aW9uXG5cdFx0XHR0aGlzLl9wdWJsaWNLZXlzLnNldChwcml2YXRlS2V5LCBwdWJsaWNLZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7cHJpdmF0ZUtleSwgcHVibGljS2V5fTtcblx0fVxuXG5cdF9nZXRQcml2YXRlS2V5KGtleXMsIGNyZWF0ZSA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgcHJpdmF0ZUtleXMgPSBbXTtcblx0XHRmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuXHRcdFx0aWYgKGtleSA9PT0gbnVsbCkge1xuXHRcdFx0XHRrZXkgPSBudWxsS2V5O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoYXNoZXMgPSB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyB8fCB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nID8gJ19vYmplY3RIYXNoZXMnIDogKHR5cGVvZiBrZXkgPT09ICdzeW1ib2wnID8gJ19zeW1ib2xIYXNoZXMnIDogZmFsc2UpO1xuXG5cdFx0XHRpZiAoIWhhc2hlcykge1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKGtleSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXNbaGFzaGVzXS5oYXMoa2V5KSkge1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKHRoaXNbaGFzaGVzXS5nZXQoa2V5KSk7XG5cdFx0XHR9IGVsc2UgaWYgKGNyZWF0ZSkge1xuXHRcdFx0XHRjb25zdCBwcml2YXRlS2V5ID0gYEBAbWttLXJlZi0ke2tleUNvdW50ZXIrK31AQGA7XG5cdFx0XHRcdHRoaXNbaGFzaGVzXS5zZXQoa2V5LCBwcml2YXRlS2V5KTtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaChwcml2YXRlS2V5KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkocHJpdmF0ZUtleXMpO1xuXHR9XG5cblx0c2V0KGtleXMsIHZhbHVlKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMsIHRydWUpO1xuXHRcdHJldHVybiBzdXBlci5zZXQocHVibGljS2V5LCB2YWx1ZSk7XG5cdH1cblxuXHRnZXQoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gc3VwZXIuZ2V0KHB1YmxpY0tleSk7XG5cdH1cblxuXHRoYXMoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gc3VwZXIuaGFzKHB1YmxpY0tleSk7XG5cdH1cblxuXHRkZWxldGUoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXksIHByaXZhdGVLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gQm9vbGVhbihwdWJsaWNLZXkgJiYgc3VwZXIuZGVsZXRlKHB1YmxpY0tleSkgJiYgdGhpcy5fcHVibGljS2V5cy5kZWxldGUocHJpdmF0ZUtleSkpO1xuXHR9XG5cblx0Y2xlYXIoKSB7XG5cdFx0c3VwZXIuY2xlYXIoKTtcblx0XHR0aGlzLl9zeW1ib2xIYXNoZXMuY2xlYXIoKTtcblx0XHR0aGlzLl9wdWJsaWNLZXlzLmNsZWFyKCk7XG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuICdNYW55S2V5c01hcCc7XG5cdH1cblxuXHRnZXQgc2l6ZSgpIHtcblx0XHRyZXR1cm4gc3VwZXIuc2l6ZTtcblx0fVxufVxuIiwiaW1wb3J0IE1hbnlLZXlzTWFwIGZyb20gJ21hbnkta2V5cy1tYXAnO1xuaW1wb3J0IHsgZGVmdSB9IGZyb20gJ2RlZnUnO1xuaW1wb3J0IHsgaXNFeGlzdCB9IGZyb20gJy4vZGV0ZWN0b3JzLm1qcyc7XG5cbmNvbnN0IGdldERlZmF1bHRPcHRpb25zID0gKCkgPT4gKHtcbiAgdGFyZ2V0OiBnbG9iYWxUaGlzLmRvY3VtZW50LFxuICB1bmlmeVByb2Nlc3M6IHRydWUsXG4gIGRldGVjdG9yOiBpc0V4aXN0LFxuICBvYnNlcnZlQ29uZmlnczoge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgfSxcbiAgc2lnbmFsOiB2b2lkIDAsXG4gIGN1c3RvbU1hdGNoZXI6IHZvaWQgMFxufSk7XG5jb25zdCBtZXJnZU9wdGlvbnMgPSAodXNlclNpZGVPcHRpb25zLCBkZWZhdWx0T3B0aW9ucykgPT4ge1xuICByZXR1cm4gZGVmdSh1c2VyU2lkZU9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbn07XG5cbmNvbnN0IHVuaWZ5Q2FjaGUgPSBuZXcgTWFueUtleXNNYXAoKTtcbmZ1bmN0aW9uIGNyZWF0ZVdhaXRFbGVtZW50KGluc3RhbmNlT3B0aW9ucykge1xuICBjb25zdCB7IGRlZmF1bHRPcHRpb25zIH0gPSBpbnN0YW5jZU9wdGlvbnM7XG4gIHJldHVybiAoc2VsZWN0b3IsIG9wdGlvbnMpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB0YXJnZXQsXG4gICAgICB1bmlmeVByb2Nlc3MsXG4gICAgICBvYnNlcnZlQ29uZmlncyxcbiAgICAgIGRldGVjdG9yLFxuICAgICAgc2lnbmFsLFxuICAgICAgY3VzdG9tTWF0Y2hlclxuICAgIH0gPSBtZXJnZU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xuICAgIGNvbnN0IHVuaWZ5UHJvbWlzZUtleSA9IFtcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgdGFyZ2V0LFxuICAgICAgdW5pZnlQcm9jZXNzLFxuICAgICAgb2JzZXJ2ZUNvbmZpZ3MsXG4gICAgICBkZXRlY3RvcixcbiAgICAgIHNpZ25hbCxcbiAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICBdO1xuICAgIGNvbnN0IGNhY2hlZFByb21pc2UgPSB1bmlmeUNhY2hlLmdldCh1bmlmeVByb21pc2VLZXkpO1xuICAgIGlmICh1bmlmeVByb2Nlc3MgJiYgY2FjaGVkUHJvbWlzZSkge1xuICAgICAgcmV0dXJuIGNhY2hlZFByb21pc2U7XG4gICAgfVxuICAgIGNvbnN0IGRldGVjdFByb21pc2UgPSBuZXcgUHJvbWlzZShcbiAgICAgIC8vIGJpb21lLWlnbm9yZSBsaW50L3N1c3BpY2lvdXMvbm9Bc3luY1Byb21pc2VFeGVjdXRvcjogYXZvaWQgbmVzdGluZyBwcm9taXNlXG4gICAgICBhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KHNpZ25hbC5yZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICAgICAgYXN5bmMgKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBfIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnN0IGRldGVjdFJlc3VsdDIgPSBhd2FpdCBkZXRlY3RFbGVtZW50KHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICAgICAgZGV0ZWN0b3IsXG4gICAgICAgICAgICAgICAgY3VzdG9tTWF0Y2hlclxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKGRldGVjdFJlc3VsdDIuaXNEZXRlY3RlZCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRldGVjdFJlc3VsdDIucmVzdWx0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgc2lnbmFsPy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwiYWJvcnRcIixcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KHNpZ25hbC5yZWFzb24pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZGV0ZWN0UmVzdWx0ID0gYXdhaXQgZGV0ZWN0RWxlbWVudCh7XG4gICAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgIGRldGVjdG9yLFxuICAgICAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChkZXRlY3RSZXN1bHQuaXNEZXRlY3RlZCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKGRldGVjdFJlc3VsdC5yZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCBvYnNlcnZlQ29uZmlncyk7XG4gICAgICB9XG4gICAgKS5maW5hbGx5KCgpID0+IHtcbiAgICAgIHVuaWZ5Q2FjaGUuZGVsZXRlKHVuaWZ5UHJvbWlzZUtleSk7XG4gICAgfSk7XG4gICAgdW5pZnlDYWNoZS5zZXQodW5pZnlQcm9taXNlS2V5LCBkZXRlY3RQcm9taXNlKTtcbiAgICByZXR1cm4gZGV0ZWN0UHJvbWlzZTtcbiAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGRldGVjdEVsZW1lbnQoe1xuICB0YXJnZXQsXG4gIHNlbGVjdG9yLFxuICBkZXRlY3RvcixcbiAgY3VzdG9tTWF0Y2hlclxufSkge1xuICBjb25zdCBlbGVtZW50ID0gY3VzdG9tTWF0Y2hlciA/IGN1c3RvbU1hdGNoZXIoc2VsZWN0b3IpIDogdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICByZXR1cm4gYXdhaXQgZGV0ZWN0b3IoZWxlbWVudCk7XG59XG5jb25zdCB3YWl0RWxlbWVudCA9IGNyZWF0ZVdhaXRFbGVtZW50KHtcbiAgZGVmYXVsdE9wdGlvbnM6IGdldERlZmF1bHRPcHRpb25zKClcbn0pO1xuXG5leHBvcnQgeyBjcmVhdGVXYWl0RWxlbWVudCwgZ2V0RGVmYXVsdE9wdGlvbnMsIHdhaXRFbGVtZW50IH07XG4iXSwibmFtZXMiOlsiZGVmaW5pdGlvbiIsInRoaXMiLCJtb2R1bGUiLCJwcm94eVRhcmdldCIsInZhbHVlIiwicmVzdWx0IiwibWVzc2FnZSIsImlkIiwidHJhbnNsYXRlZEVsIiwicHJpbnQiLCJsb2dnZXIiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sV0FBUyxvQkFBb0JBLGFBQVk7QUFDOUMsV0FBT0E7QUFBQSxFQUNUOzs7Ozs7Ozs7OztBQ0ZBLE9BQUMsU0FBVSxRQUFRLFNBQVM7QUFHaUI7QUFDekMsa0JBQVEsTUFBTTtBQUFBLFFBQ2xCO0FBQUEsTUFPQSxHQUFHLE9BQU8sZUFBZSxjQUFjLGFBQWEsT0FBTyxTQUFTLGNBQWMsT0FBT0MsaUJBQU0sU0FBVUMsU0FBUTtBQVMvRyxZQUFJLEVBQUUsV0FBVyxVQUFVLFdBQVcsT0FBTyxXQUFXLFdBQVcsT0FBTyxRQUFRLEtBQUs7QUFDckYsZ0JBQU0sSUFBSSxNQUFNLDJEQUEyRDtBQUFBLFFBQy9FO0FBQ0UsWUFBSSxFQUFFLFdBQVcsV0FBVyxXQUFXLFFBQVEsV0FBVyxXQUFXLFFBQVEsUUFBUSxLQUFLO0FBQ3hGLGdCQUFNLG1EQUFtRDtBQU96RCxnQkFBTSxXQUFXLG1CQUFpQjtBQUloQyxrQkFBTSxjQUFjO0FBQUEsY0FDbEIsVUFBVTtBQUFBLGdCQUNSLFNBQVM7QUFBQSxrQkFDUCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLE9BQU87QUFBQSxrQkFDTCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsYUFBYTtBQUFBLGdCQUNYLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLE9BQU87QUFBQSxrQkFDTCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGVBQWU7QUFBQSxrQkFDYixXQUFXO0FBQUEs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
