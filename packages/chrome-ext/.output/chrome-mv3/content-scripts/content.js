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
    const limit = Math.min(elements.length, 50);
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
  const definition = defineContentScript({
    matches: ["<all_urls>"],
    main() {
      console.log("[content] Browser Agent content script loaded on:", location.href);
      browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        var _a;
        if (message.type === "GET_PAGE_CONTEXT") {
          const context = {
            url: location.href,
            title: document.title,
            selectedText: ((_a = window.getSelection()) == null ? void 0 : _a.toString()) || ""
          };
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
        const selectedText = ((_a = window.getSelection()) == null ? void 0 : _a.toString()) || "";
        if (selectedText.length > 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93ZWJleHRlbnNpb24tcG9seWZpbGxAMC4xMi4wL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIvaW5kZXgubWpzIiwiLi4vLi4vLi4vdXRpbHMvYWN0aW9uLWV4ZWN1dG9yLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyMC4xOS4zN19yb2xsdXBANC41OS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L3V0aWxzL2xvZ2dlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMjlfQHR5cGVzK25vZGVAMjAuMTkuMzdfcm9sbHVwQDQuNTkuMC9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9jdXN0b20tZXZlbnRzLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyMC4xOS4zN19yb2xsdXBANC41OS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbWFueS1rZXlzLW1hcEAyLjAuMS9ub2RlX21vZHVsZXMvbWFueS1rZXlzLW1hcC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AMW5hdHN1K3dhaXQtZWxlbWVudEA0LjEuMi9ub2RlX21vZHVsZXMvQDFuYXRzdS93YWl0LWVsZW1lbnQvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiLCBbXCJtb2R1bGVcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeShtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QpO1xuICAgIGdsb2JhbC5icm93c2VyID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgLyogd2ViZXh0ZW5zaW9uLXBvbHlmaWxsIC0gdjAuMTIuMCAtIFR1ZSBNYXkgMTQgMjAyNCAxODowMToyOSAqL1xuICAvKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG4gIC8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAgICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICAgKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAoIShnbG9iYWxUaGlzLmNocm9tZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUuaWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG4gIGlmICghKGdsb2JhbFRoaXMuYnJvd3NlciAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZSAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZS5pZCkpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjtcblxuICAgIC8vIFdyYXBwaW5nIHRoZSBidWxrIG9mIHRoaXMgcG9seWZpbGwgaW4gYSBvbmUtdGltZS11c2UgZnVuY3Rpb24gaXMgYSBtaW5vclxuICAgIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAgIC8vIGNvbnRlbnRzIG9mIGEgZnVuY3Rpb24gdW50aWwgdGhlIGZpcnN0IHRpbWUgaXQncyBjYWxsZWQsIGFuZCBzaW5jZSBpdCB3aWxsXG4gICAgLy8gbmV2ZXIgYWN0dWFsbHkgbmVlZCB0byBiZSBjYWxsZWQsIHRoaXMgYWxsb3dzIHRoZSBwb2x5ZmlsbCB0byBiZSBpbmNsdWRlZFxuICAgIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICAgIGNvbnN0IHdyYXBBUElzID0gZXh0ZW5zaW9uQVBJcyA9PiB7XG4gICAgICAvLyBOT1RFOiBhcGlNZXRhZGF0YSBpcyBhc3NvY2lhdGVkIHRvIHRoZSBjb250ZW50IG9mIHRoZSBhcGktbWV0YWRhdGEuanNvbiBmaWxlXG4gICAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICAvLyBKU09OIGZpbGUuXG4gICAgICBjb25zdCBhcGlNZXRhZGF0YSA9IHtcbiAgICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjbGVhckFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFN1YlRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2VyQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImRpc2FibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlbmFibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuUG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNhY2hlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZURvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZvcm1EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUxvY2FsU3RvcmFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBhc3N3b3Jkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb29raWVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbENvb2tpZVN0b3Jlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgICBcImluc3BlY3RlZFdpbmRvd1wiOiB7XG4gICAgICAgICAgICBcImV2YWxcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDIsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGFuZWxzXCI6IHtcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVsZW1lbnRzXCI6IHtcbiAgICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwiY2FuY2VsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlcmFzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZpbGVJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhdXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3VtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICAgIFwiaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImlzQWxsb3dlZEluY29nbml0b0FjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhpc3RvcnlcIjoge1xuICAgICAgICAgIFwiYWRkVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlUmFuZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWNjZXB0TGFuZ3VhZ2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRlbnRpdHlcIjoge1xuICAgICAgICAgIFwibGF1bmNoV2ViQXV0aEZsb3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGxlXCI6IHtcbiAgICAgICAgICBcInF1ZXJ5U3RhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYW5hZ2VtZW50XCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRFbmFibGVkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjoge1xuICAgICAgICAgIFwiY29udGFpbnNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicnVudGltZVwiOiB7XG4gICAgICAgICAgXCJnZXRCYWNrZ3JvdW5kUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5PcHRpb25zUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RVcGRhdGVDaGVja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE5hdGl2ZU1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRVbmluc3RhbGxVUkxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJnZXREZXZpY2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN0b3JlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgXCJsb2NhbFwiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1hbmFnZWRcIjoge1xuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRhYnNcIjoge1xuICAgICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkdXBsaWNhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJleGVjdXRlU2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0JhY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0ZvcndhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpbnNlcnRDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgICBcImdldEFsbEZyYW1lc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZyYW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViUmVxdWVzdFwiOiB7XG4gICAgICAgICAgXCJoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2luZG93c1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAgICogICAgICAgIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2YWx1ZSBmb3IgYW55XG4gICAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICAgKi9cbiAgICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG4gICAgICBjb25zdCBpc1RoZW5hYmxlID0gdmFsdWUgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICAgKlxuICAgICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIElmIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIHByb21pc2UgaXNcbiAgICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgICAqICAgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x1dGlvbiBhbmQgcmVqZWN0aW9uIGZ1bmN0aW9ucyBvZiBhXG4gICAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVzb2x1dGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBsdXJhbGl6ZUFyZ3VtZW50cyA9IG51bUFyZ3MgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYXN5bmNGdW5jdGlvbldyYXBwZXIodGFyZ2V0LCAuLi5hcmdzKSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgQVBJIG1ldGhvZCBoYXMgY3VycmVudGx5IG5vIGNhbGxiYWNrIG9uIENocm9tZSwgYnV0IGl0IHJldHVybiBhIHByb21pc2Ugb24gRmlyZWZveCxcbiAgICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgICAgLy8gdG8gbm90IHBhc3NpbmcgdGhlIGNhbGxiYWNrIGlmIHRoZSBmaXJzdCBjYWxsIGZhaWxzLlxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGNiRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bmFtZX0gQVBJIG1ldGhvZCBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyLCBgICsgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEFQSSBtZXRob2QgbWV0YWRhdGEsIHNvIHRoYXQgdGhlIG5leHQgQVBJIGNhbGxzIHdpbGwgbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdW5zdXBwb3J0ZWQgY2FsbGJhY2sgYW55bW9yZS5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gZXhpc3RpbmcgbWV0aG9kIG9mIHRoZSB0YXJnZXQgb2JqZWN0LCBzbyB0aGF0IGNhbGxzIHRvIGl0IGFyZVxuICAgICAgICogaW50ZXJjZXB0ZWQgYnkgdGhlIGdpdmVuIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHJlY2VpdmVzLFxuICAgICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICAgKiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgb3JpZ2luYWwgdGFyZ2V0IG9iamVjdCB0aGF0IHRoZSB3cmFwcGVkIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kXG4gICAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgICAqICAgICAgICBvYmplY3Qgd2hpY2ggaXMgY3JlYXRlZCB0byB3cmFwIHRoZSBtZXRob2QuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgICAqICAgICAgICBvZiB0aGUgd3JhcHBlZCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgICAqICAgICAgICBBIFByb3h5IG9iamVjdCBmb3IgdGhlIGdpdmVuIG1ldGhvZCwgd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gd3JhcHBlclxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiBpdHMgcGxhY2UuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBNZXRob2QgPSAodGFyZ2V0LCBtZXRob2QsIHdyYXBwZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShtZXRob2QsIHtcbiAgICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmNhbGwodGhpc09iaiwgdGFyZ2V0LCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvYmplY3QgaW4gYSBQcm94eSB3aGljaCBpbnRlcmNlcHRzIGFuZCB3cmFwcyBjZXJ0YWluIG1ldGhvZHNcbiAgICAgICAqIGJhc2VkIG9uIHRoZSBnaXZlbiBgd3JhcHBlcnNgIGFuZCBgbWV0YWRhdGFgIG9iamVjdHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSB0YXJnZXQgb2JqZWN0IHRvIHdyYXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFt3cmFwcGVycyA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgd3JhcHBlciBmdW5jdGlvbnMgZm9yIHNwZWNpYWwgY2FzZXMuIEFueVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZS4gVGhlc2VcbiAgICAgICAqICAgICAgICB3cmFwcGVyIG1ldGhvZHMgYXJlIGludm9rZWQgYXMgZGVzY3JpYmVkIGluIHtAc2VlIHdyYXBNZXRob2R9LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGEgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIG1ldGFkYXRhIHVzZWQgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZVxuICAgICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICAgKiAgICAgICAgdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlIHdoaWNoIGhhcyBhIGNvcnJlc3BvbmRpbmcgbWV0YWRhdGEgb2JqZWN0XG4gICAgICAgKiAgICAgICAgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGBtZXRhZGF0YWAgdHJlZSBpcyByZXBsYWNlZCB3aXRoIGFuXG4gICAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgKiAgICAgICAge0BzZWUgd3JhcEFzeW5jRnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0KHByb3h5VGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBvYmplY3QuIENoZWNrIGlmIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgICAgLy8gYW55IHdyYXBwaW5nLlxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHByb3h5VGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShjYWNoZSwgcHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgdGFyZ2V0IGlmIHRoYXQgdmFsdWUgaXMgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZFxuICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLiBGb3IgdGhpcyByZWFzb24sIHdlIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2Fubm90IHJldHVybiBhIGN1c3RvbSBvYmplY3QgZm9yIEFQSXMgdGhhdFxuICAgICAgICAvLyBhcmUgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZCBub24tY29uZmlndXJhYmxlLCBzdWNoIGFzIGBjaHJvbWUuZGV2dG9vbHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgcHJveHkgaGFuZGxlcnMgdGhlbXNlbHZlcyB3aWxsIHN0aWxsIHVzZSB0aGUgb3JpZ2luYWwgYHRhcmdldGBcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgYHByb3h5VGFyZ2V0YCwgc28gdGhhdCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBhcmVcbiAgICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBzZXQgb2Ygd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IG9iamVjdCwgd2hpY2ggaGFuZGxlc1xuICAgICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBBIHNpbmdsZSB3cmFwcGVyIGlzIGNyZWF0ZWQgZm9yIGVhY2ggbGlzdGVuZXIgZnVuY3Rpb24sIGFuZCBzdG9yZWQgaW4gYVxuICAgICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgICAqIHJldHJpZXZlIHRoZSBvcmlnaW5hbCB3cmFwcGVyLCBzbyB0aGF0ICBhdHRlbXB0cyB0byByZW1vdmUgYVxuICAgICAgICogcHJldmlvdXNseS1hZGRlZCBsaXN0ZW5lciB3b3JrIGFzIGV4cGVjdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RGVmYXVsdFdlYWtNYXA8ZnVuY3Rpb24sIGZ1bmN0aW9uPn0gd3JhcHBlck1hcFxuICAgICAgICogICAgICAgIEEgRGVmYXVsdFdlYWtNYXAgb2JqZWN0IHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAgICogICAgICAgIGFuIGV4aXN0aW5nIG9uZSB3aGVuIGl0IGRvZXMuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEV2ZW50ID0gd3JhcHBlck1hcCA9PiAoe1xuICAgICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgICAgdGFyZ2V0LmFkZExpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0xpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGFuIG9uUmVxdWVzdEZpbmlzaGVkIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCByZXR1cm4gYVxuICAgICAgICAgKiBgZ2V0Q29udGVudCgpYCBwcm9wZXJ0eSB3aGljaCByZXR1cm5zIGEgYFByb21pc2VgIHJhdGhlciB0aGFuIHVzaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxXG4gICAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgICBnZXRDb250ZW50OiB7XG4gICAgICAgICAgICAgIG1pbkFyZ3M6IDAsXG4gICAgICAgICAgICAgIG1heEFyZ3M6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0ZW5lcih3cmFwcGVkUmVxKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBkaWRDYWxsU2VuZFJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHdyYXBwZWRTZW5kUmVzcG9uc2U7XG4gICAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgICAvLyB3cmFwcGVkU2VuZFJlc3BvbnNlIHN5bmNocm9ub3VzbHksIHdlIGNhbiBleGl0IGVhcmxpZXJcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgICAvLyBhbmQgYW4gZXJyb3IgaWYgdGhlIHByb21pc2UgcmVqZWN0cyAoYSB3cmFwcGVkIHNlbmRNZXNzYWdlIGhhc1xuICAgICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgICAgLy8gcHJvbWlzZSkuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG4gICAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fCB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZSA9IChuYW1lLCBtZXRhZGF0YSwgYXBpTmFtZXNwYWNlT2JqLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgICBkZXZ0b29sczoge1xuICAgICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMixcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2V0dGluZ01ldGFkYXRhID0ge1xuICAgICAgICBjbGVhcjoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBhcGlNZXRhZGF0YS5wcml2YWN5ID0ge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXJ2aWNlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgd2Vic2l0ZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gICAgLy8gYG1vZHVsZWAgdmFyaWFibGUgYXZhaWxhYmxlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuYnJvd3NlcjtcbiAgfVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icm93c2VyLXBvbHlmaWxsLmpzLm1hcFxuIiwiaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcbiIsIi8vIGFjdGlvbi1leGVjdXRvci50cyDigJQg5rWP6KeI5Zmo5pON5L2c5omn6KGM5byV5pOOXG4vLyDlrprkuYkgQnJvd3NlckFjdGlvbiDmjqXlj6PkuI7miYDmnInmlK/mjIHnmoQgRE9NIOaTjeS9nOexu+Wei++8jFxuLy8g5ZyoIGNvbnRlbnQgc2NyaXB0IOS4iuS4i+aWh+S4reaJp+ihjCBjbGljay90eXBlL3Njcm9sbC9xdWVyeVNlbGVjdG9yIOetieaTjeS9nFxuXG4vKiog5pSv5oyB55qE5rWP6KeI5Zmo5pON5L2c57G75Z6L5p6a5Li+ICovXG5leHBvcnQgdHlwZSBBY3Rpb25UeXBlID1cbiAgfCAnY2xpY2snXG4gIHwgJ3R5cGUnXG4gIHwgJ3Njcm9sbCdcbiAgfCAnbmF2aWdhdGUnXG4gIHwgJ3F1ZXJ5U2VsZWN0b3InXG4gIHwgJ3F1ZXJ5U2VsZWN0b3JBbGwnXG4gIHwgJ2dldFRleHRDb250ZW50J1xuICB8ICdnZXRBdHRyaWJ1dGUnXG4gIHwgJ2dldFZhbHVlJ1xuICB8ICdzY3JlZW5zaG90J1xuICB8ICd3YWl0Rm9yRWxlbWVudCdcbiAgfCAnaGlnaGxpZ2h0JztcblxuLyoqIOa7muWKqOaooeW8jyAqL1xuZXhwb3J0IHR5cGUgU2Nyb2xsTW9kZSA9ICd0by10b3AnIHwgJ3RvLWJvdHRvbScgfCAnYnktcGl4ZWxzJyB8ICd0by1lbGVtZW50JztcblxuLyoqIOa1j+iniOWZqOaTjeS9nOivt+axgiAqL1xuZXhwb3J0IGludGVyZmFjZSBCcm93c2VyQWN0aW9uIHtcbiAgLyoqIOaTjeS9nOexu+WeiyAqL1xuICB0eXBlOiBBY3Rpb25UeXBlO1xuICAvKiogQ1NTIOmAieaLqeWZqO+8jOWumuS9jeebruagh+WFg+e0oCAqL1xuICBzZWxlY3Rvcj86IHN0cmluZztcbiAgLyoqIOaWh+acrOWMuemFjei/h+a7pO+8iGNsaWNrIOaXtuWPr+mAie+8jOeUqOS6juS7juWkmuS4quWMuemFjeS4reetm+mAieWQq+aMh+WumuaWh+acrOeahOWFg+e0oO+8iSAqL1xuICB0ZXh0Pzogc3RyaW5nO1xuICAvKiogdHlwZSDmk43kvZzopoHovpPlhaXnmoTmlofmnKwgKi9cbiAgdmFsdWU/OiBzdHJpbmc7XG4gIC8qKiBzY3JvbGwg5pON5L2c55qE5qih5byPICovXG4gIHNjcm9sbE1vZGU/OiBTY3JvbGxNb2RlO1xuICAvKiogc2Nyb2xsIGJ5LXBpeGVscyDmqKHlvI/nmoTlg4/ntKDmlbDvvIjmraPmlbDlkJHkuIvvvIzotJ/mlbDlkJHkuIrvvIkgKi9cbiAgc2Nyb2xsUGl4ZWxzPzogbnVtYmVyO1xuICAvKiogZ2V0QXR0cmlidXRlIOimgeiOt+WPlueahOWxnuaAp+WQjSAqL1xuICBhdHRyaWJ1dGVOYW1lPzogc3RyaW5nO1xuICAvKiogbmF2aWdhdGUg5pON5L2c55qE55uu5qCHIFVSTCAqL1xuICB1cmw/OiBzdHJpbmc7XG4gIC8qKiB3YWl0Rm9yRWxlbWVudCDnmoTotoXml7bmr6vnp5LmlbDvvIjpu5jorqQgNTAwMO+8iSAqL1xuICB0aW1lb3V0PzogbnVtYmVyO1xuICAvKiogaGlnaGxpZ2h0IOmrmOS6ruminOiJsu+8iOm7mOiupCByZ2JhKDI1NSwgMTY1LCAwLCAwLjQp77yJICovXG4gIGhpZ2hsaWdodENvbG9yPzogc3RyaW5nO1xuICAvKiogaGlnaGxpZ2h0IOaMgee7reaXtumXtOavq+enkuaVsO+8iOm7mOiupCAyMDAw77yJICovXG4gIGhpZ2hsaWdodER1cmF0aW9uPzogbnVtYmVyO1xufVxuXG4vKiog5pON5L2c5omn6KGM57uT5p6cICovXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvblJlc3VsdCB7XG4gIC8qKiDmmK/lkKbmiJDlip8gKi9cbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgLyoqIOi/lOWbnuaVsOaNru+8iOagueaNruaTjeS9nOexu+Wei+S4jeWQjOiAjOS4jeWQjO+8iSAqL1xuICBkYXRhPzogdW5rbm93bjtcbiAgLyoqIOWksei0peaXtueahOmUmeivr+S/oeaBryAqL1xuICBlcnJvcj86IHN0cmluZztcbn1cblxuLyoqIHF1ZXJ5U2VsZWN0b3Ig6L+U5Zue55qE5YWD57Sg5L+h5oGvICovXG5leHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRJbmZvIHtcbiAgdGFnTmFtZTogc3RyaW5nO1xuICBpZDogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgdGV4dENvbnRlbnQ6IHN0cmluZztcbiAgaHJlZj86IHN0cmluZztcbiAgc3JjPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbiAgdHlwZT86IHN0cmluZztcbiAgcGxhY2Vob2xkZXI/OiBzdHJpbmc7XG59XG5cbi8qKlxuICog5LuOIERPTSDlhYPntKDmj5Dlj5blhbPplK7lsZ7mgKfkv6Hmga9cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdEVsZW1lbnRJbmZvKGVsOiBFbGVtZW50KTogRWxlbWVudEluZm8ge1xuICBjb25zdCBodG1sRWwgPSBlbCBhcyBIVE1MRWxlbWVudDtcbiAgY29uc3QgaW5wdXRFbCA9IGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gIGNvbnN0IGFuY2hvckVsID0gZWwgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gIGNvbnN0IGltZ0VsID0gZWwgYXMgSFRNTEltYWdlRWxlbWVudDtcblxuICByZXR1cm4ge1xuICAgIHRhZ05hbWU6IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICBpZDogZWwuaWQgfHwgJycsXG4gICAgY2xhc3NOYW1lOiBlbC5jbGFzc05hbWUgfHwgJycsXG4gICAgdGV4dENvbnRlbnQ6IChodG1sRWwudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKS5zbGljZSgwLCA1MDApLFxuICAgIC4uLihhbmNob3JFbC5ocmVmID8geyBocmVmOiBhbmNob3JFbC5ocmVmIH0gOiB7fSksXG4gICAgLi4uKGltZ0VsLnNyYyA/IHsgc3JjOiBpbWdFbC5zcmMgfSA6IHt9KSxcbiAgICAuLi4oaW5wdXRFbC52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGlucHV0RWwudmFsdWUgIT09ICcnID8geyB2YWx1ZTogaW5wdXRFbC52YWx1ZSB9IDoge30pLFxuICAgIC4uLihpbnB1dEVsLnR5cGUgPyB7IHR5cGU6IGlucHV0RWwudHlwZSB9IDoge30pLFxuICAgIC4uLihpbnB1dEVsLnBsYWNlaG9sZGVyID8geyBwbGFjZWhvbGRlcjogaW5wdXRFbC5wbGFjZWhvbGRlciB9IDoge30pLFxuICB9O1xufVxuXG4vKipcbiAqIOagueaNriBzZWxlY3RvciDlkozlj6/pgIkgdGV4dCDov4fmu6TlrprkvY3lhYPntKBcbiAqL1xuZnVuY3Rpb24gZmluZEVsZW1lbnQoc2VsZWN0b3I6IHN0cmluZywgdGV4dD86IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgaWYgKHRleHQpIHtcbiAgICAvLyDmib7liLDmiYDmnInljLnphY0gc2VsZWN0b3Ig55qE5YWD57Sg77yM5YaN5oyJIHRleHRDb250ZW50IOetm+mAiVxuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgIGlmICgoZWwgYXMgSFRNTEVsZW1lbnQpLnRleHRDb250ZW50Py5pbmNsdWRlcyh0ZXh0KSkge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuLyoqXG4gKiDmiafooYwgY2xpY2sg5pON5L2cXG4gKiDmlK/mjIEgQ1NTIHNlbGVjdG9yIOWumuS9jSArIOWPr+mAieeahOaWh+acrOWMuemFjei/h+a7pFxuICovXG5mdW5jdGlvbiBleGVjdXRlQ2xpY2soYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdjbGljayDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsID0gZmluZEVsZW1lbnQoYWN0aW9uLnNlbGVjdG9yLCBhY3Rpb24udGV4dCk7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfSR7YWN0aW9uLnRleHQgPyBgICh0ZXh0OiBcIiR7YWN0aW9uLnRleHR9XCIpYCA6ICcnfWAgfTtcbiAgfVxuICAoZWwgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKCk7XG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgY2xpY2tlZDogYWN0aW9uLnNlbGVjdG9yIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgdHlwZSDmk43kvZxcbiAqIGZvY3VzIOKGkiDmuIXnqbog4oaSIOmAkOWtl+i+k+WFpSDihpIg6Kem5Y+RIGlucHV0L2NoYW5nZSDkuovku7ZcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZVR5cGUoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICd0eXBlIOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgaWYgKGFjdGlvbi52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAndHlwZSDmk43kvZzpnIDopoEgdmFsdWUg5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsID0gZmluZEVsZW1lbnQoYWN0aW9uLnNlbGVjdG9yKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IG51bGw7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuXG4gIC8vIGZvY3VzXG4gIGVsLmZvY3VzKCk7XG5cbiAgLy8g5riF56m6546w5pyJ5YC8XG4gIGVsLnZhbHVlID0gJyc7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG5cbiAgLy8g6K6+572u5paw5YC8XG4gIC8vIOS9v+eUqCBuYXRpdmUgaW5wdXQgc2V0dGVyIOS7peehruS/nSBSZWFjdCDlj5fmjqfnu4Tku7bkuZ/og73mraPnoa7mm7TmlrBcbiAgY29uc3QgbmF0aXZlSW5wdXRWYWx1ZVNldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKGVsKSxcbiAgICAndmFsdWUnLFxuICApPy5zZXQ7XG5cbiAgaWYgKG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIpIHtcbiAgICBuYXRpdmVJbnB1dFZhbHVlU2V0dGVyLmNhbGwoZWwsIGFjdGlvbi52YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgZWwudmFsdWUgPSBhY3Rpb24udmFsdWU7XG4gIH1cblxuICAvLyDop6blj5Hkuovku7ZcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG5cbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyB0eXBlZDogYWN0aW9uLnZhbHVlLCBzZWxlY3RvcjogYWN0aW9uLnNlbGVjdG9yIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgc2Nyb2xsIOaTjeS9nFxuICog5pSv5oyBIHRvLXRvcCAvIHRvLWJvdHRvbSAvIGJ5LXBpeGVscyAvIHRvLWVsZW1lbnQg5Zub56eN5qih5byPXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVTY3JvbGwoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgY29uc3QgbW9kZSA9IGFjdGlvbi5zY3JvbGxNb2RlIHx8ICdieS1waXhlbHMnO1xuXG4gIHN3aXRjaCAobW9kZSkge1xuICAgIGNhc2UgJ3RvLXRvcCc6XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IDAsIGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgc2Nyb2xsZWQ6ICd0by10b3AnIH0gfTtcblxuICAgIGNhc2UgJ3RvLWJvdHRvbSc6XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0LCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHNjcm9sbGVkOiAndG8tYm90dG9tJyB9IH07XG5cbiAgICBjYXNlICdieS1waXhlbHMnOiB7XG4gICAgICBjb25zdCBwaXhlbHMgPSBhY3Rpb24uc2Nyb2xsUGl4ZWxzIHx8IDMwMDtcbiAgICAgIHdpbmRvdy5zY3JvbGxCeSh7IHRvcDogcGl4ZWxzLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHNjcm9sbGVkOiAnYnktcGl4ZWxzJywgcGl4ZWxzIH0gfTtcbiAgICB9XG5cbiAgICBjYXNlICd0by1lbGVtZW50Jzoge1xuICAgICAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2Nyb2xsIHRvLWVsZW1lbnQg5qih5byP6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IpO1xuICAgICAgaWYgKCFlbCkge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgICAgIH1cbiAgICAgIGVsLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcicgfSk7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHNjcm9sbGVkOiAndG8tZWxlbWVudCcsIHNlbGVjdG9yOiBhY3Rpb24uc2VsZWN0b3IgfSB9O1xuICAgIH1cblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDkuI3mlK/mjIHnmoTmu5rliqjmqKHlvI86ICR7bW9kZX1gIH07XG4gIH1cbn1cblxuLyoqXG4gKiDmiafooYwgcXVlcnlTZWxlY3RvciDmk43kvZxcbiAqIOi/lOWbnuWMuemFjeWFg+e0oOeahCB0YWdOYW1lL2lkL2NsYXNzTmFtZS90ZXh0Q29udGVudC9ocmVmL3NyYyDnrYnlsZ7mgKdcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZVF1ZXJ5U2VsZWN0b3IoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdxdWVyeVNlbGVjdG9yIOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3Rvcik7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBleHRyYWN0RWxlbWVudEluZm8oZWwpIH07XG59XG5cbi8qKlxuICog5omn6KGMIHF1ZXJ5U2VsZWN0b3JBbGwg5pON5L2cXG4gKiDov5Tlm57miYDmnInljLnphY3lhYPntKDnmoTlsZ7mgKfmlbDnu4RcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZVF1ZXJ5U2VsZWN0b3JBbGwoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdxdWVyeVNlbGVjdG9yQWxsIOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFjdGlvbi5zZWxlY3Rvcik7XG4gIGNvbnN0IHJlc3VsdHM6IEVsZW1lbnRJbmZvW10gPSBbXTtcbiAgLy8g5pyA5aSa6L+U5ZueIDUwIOS4quWFg+e0oO+8jOmYsuatouaVsOaNrui/h+Wkp1xuICBjb25zdCBsaW1pdCA9IE1hdGgubWluKGVsZW1lbnRzLmxlbmd0aCwgNTApO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbWl0OyBpKyspIHtcbiAgICByZXN1bHRzLnB1c2goZXh0cmFjdEVsZW1lbnRJbmZvKGVsZW1lbnRzW2ldKSk7XG4gIH1cbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBjb3VudDogZWxlbWVudHMubGVuZ3RoLCBlbGVtZW50czogcmVzdWx0cyB9IH07XG59XG5cbi8qKlxuICog5omn6KGMIGdldFRleHRDb250ZW50IOaTjeS9nFxuICovXG5mdW5jdGlvbiBleGVjdXRlR2V0VGV4dENvbnRlbnQoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdnZXRUZXh0Q29udGVudCDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IpO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyB0ZXh0Q29udGVudDogKGVsIGFzIEhUTUxFbGVtZW50KS50ZXh0Q29udGVudD8udHJpbSgpIHx8ICcnIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgZ2V0QXR0cmlidXRlIOaTjeS9nFxuICovXG5mdW5jdGlvbiBleGVjdXRlR2V0QXR0cmlidXRlKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnZ2V0QXR0cmlidXRlIOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgaWYgKCFhY3Rpb24uYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2dldEF0dHJpYnV0ZSDmk43kvZzpnIDopoEgYXR0cmlidXRlTmFtZSDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3Rvcik7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGF0dHJpYnV0ZTogYWN0aW9uLmF0dHJpYnV0ZU5hbWUsIHZhbHVlOiBlbC5nZXRBdHRyaWJ1dGUoYWN0aW9uLmF0dHJpYnV0ZU5hbWUpIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgZ2V0VmFsdWUg5pON5L2cXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVHZXRWYWx1ZShhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBBY3Rpb25SZXN1bHQge1xuICBpZiAoIWFjdGlvbi5zZWxlY3Rvcikge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2dldFZhbHVlIOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3RvcikgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IG51bGw7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHZhbHVlOiBlbC52YWx1ZSB8fCAnJyB9IH07XG59XG5cbi8qKlxuICog5omn6KGMIHdhaXRGb3JFbGVtZW50IOaTjeS9nFxuICog5L2/55SoIE11dGF0aW9uT2JzZXJ2ZXIg562J5b6F5YWD57Sg5Ye6546wXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVXYWl0Rm9yRWxlbWVudChhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBQcm9taXNlPEFjdGlvblJlc3VsdD4ge1xuICBpZiAoIWFjdGlvbi5zZWxlY3Rvcikge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3dhaXRGb3JFbGVtZW50IOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cblxuICBjb25zdCB0aW1lb3V0ID0gYWN0aW9uLnRpbWVvdXQgfHwgNTAwMDtcblxuICAvLyDlhYjmo4Dmn6XlhYPntKDmmK/lkKblt7LlrZjlnKhcbiAgY29uc3QgZXhpc3RpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3Rvcik7XG4gIGlmIChleGlzdGluZykge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGV4dHJhY3RFbGVtZW50SW5mbyhleGlzdGluZykgfTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZTxBY3Rpb25SZXN1bHQ+KChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IHJlc29sdmVkID0gZmFsc2U7XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IhKTtcbiAgICAgIGlmIChlbCAmJiAhcmVzb2x2ZWQpIHtcbiAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBleHRyYWN0RWxlbWVudEluZm8oZWwpIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcblxuICAgIC8vIOi2heaXtuWkhOeQhlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCFyZXNvbHZlZCkge1xuICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOetieW+heWFg+e0oOi2heaXtiAoJHt0aW1lb3V0fW1zKTogJHthY3Rpb24uc2VsZWN0b3J9YCB9KTtcbiAgICAgIH1cbiAgICB9LCB0aW1lb3V0KTtcbiAgfSk7XG59XG5cbi8qKlxuICog5omn6KGMIGhpZ2hsaWdodCDmk43kvZxcbiAqIOS4uuebruagh+WFg+e0oOa3u+WKoOS4tOaXtumrmOS6rui+ueahhlxuICovXG5mdW5jdGlvbiBleGVjdXRlSGlnaGxpZ2h0KGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnaGlnaGxpZ2h0IOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cblxuICBjb25zdCBjb2xvciA9IGFjdGlvbi5oaWdobGlnaHRDb2xvciB8fCAncmdiYSgyNTUsIDE2NSwgMCwgMC40KSc7XG4gIGNvbnN0IGR1cmF0aW9uID0gYWN0aW9uLmhpZ2hsaWdodER1cmF0aW9uIHx8IDIwMDA7XG5cbiAgLy8g5L+d5a2Y5Y6f5pyJ5qC35byPXG4gIGNvbnN0IG9yaWdpbmFsT3V0bGluZSA9IGVsLnN0eWxlLm91dGxpbmU7XG4gIGNvbnN0IG9yaWdpbmFsQmdDb2xvciA9IGVsLnN0eWxlLmJhY2tncm91bmRDb2xvcjtcblxuICAvLyDlupTnlKjpq5jkuq5cbiAgZWwuc3R5bGUub3V0bGluZSA9IGAzcHggc29saWQgJHtjb2xvcn1gO1xuICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcblxuICAvLyDlrprml7bmgaLlpI1cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZWwuc3R5bGUub3V0bGluZSA9IG9yaWdpbmFsT3V0bGluZTtcbiAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBvcmlnaW5hbEJnQ29sb3I7XG4gIH0sIGR1cmF0aW9uKTtcblxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGhpZ2hsaWdodGVkOiBhY3Rpb24uc2VsZWN0b3IsIGR1cmF0aW9uIH0gfTtcbn1cblxuLyoqXG4gKiDkuLvmiafooYzlhaXlj6Mg4oCUIOagueaNriBhY3Rpb24udHlwZSDliIblj5HliLDlr7nlupTmiafooYzlh73mlbBcbiAqXG4gKiDms6jmhI/vvJpzY3JlZW5zaG90IOaTjeS9nOmcgOimgeWcqCBiYWNrZ3JvdW5kIHNjcmlwdCDkuK3kvb/nlKggY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWLvvIxcbiAqIGNvbnRlbnQgc2NyaXB0IOaXoOazleaJp+ihjOatpOaTjeS9nO+8jOi/lOWbnueJueauiuagh+iusOeUsSBiYWNrZ3JvdW5kIOWkhOeQhuOAglxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUFjdGlvbihhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBQcm9taXNlPEFjdGlvblJlc3VsdD4ge1xuICB0cnkge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVDbGljayhhY3Rpb24pO1xuXG4gICAgICBjYXNlICd0eXBlJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVUeXBlKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ3Njcm9sbCc6XG4gICAgICAgIHJldHVybiBleGVjdXRlU2Nyb2xsKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ25hdmlnYXRlJzpcbiAgICAgICAgLy8gbmF2aWdhdGUg5ZyoIGNvbnRlbnQgc2NyaXB0IOS4remAmui/hyBsb2NhdGlvbi5ocmVmIOWunueOsFxuICAgICAgICBpZiAoIWFjdGlvbi51cmwpIHtcbiAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICduYXZpZ2F0ZSDmk43kvZzpnIDopoEgdXJsIOWPguaVsCcgfTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFjdGlvbi51cmw7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgbmF2aWdhdGVkOiBhY3Rpb24udXJsIH0gfTtcblxuICAgICAgY2FzZSAncXVlcnlTZWxlY3Rvcic6XG4gICAgICAgIHJldHVybiBleGVjdXRlUXVlcnlTZWxlY3RvcihhY3Rpb24pO1xuXG4gICAgICBjYXNlICdxdWVyeVNlbGVjdG9yQWxsJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVRdWVyeVNlbGVjdG9yQWxsKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ2dldFRleHRDb250ZW50JzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVHZXRUZXh0Q29udGVudChhY3Rpb24pO1xuXG4gICAgICBjYXNlICdnZXRBdHRyaWJ1dGUnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUdldEF0dHJpYnV0ZShhY3Rpb24pO1xuXG4gICAgICBjYXNlICdnZXRWYWx1ZSc6XG4gICAgICAgIHJldHVybiBleGVjdXRlR2V0VmFsdWUoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnc2NyZWVuc2hvdCc6XG4gICAgICAgIC8vIHNjcmVlbnNob3Qg6ZyA6KaBIGJhY2tncm91bmQgc2NyaXB0IOadg+mZkO+8jGNvbnRlbnQgc2NyaXB0IOi/lOWbnueJueauiuagh+iusFxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdfX1NDUkVFTlNIT1RfTkVFRFNfQkFDS0dST1VORF9fJyB9O1xuXG4gICAgICBjYXNlICd3YWl0Rm9yRWxlbWVudCc6XG4gICAgICAgIHJldHVybiBleGVjdXRlV2FpdEZvckVsZW1lbnQoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnaGlnaGxpZ2h0JzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVIaWdobGlnaHQoYWN0aW9uKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5LiN5pSv5oyB55qE5pON5L2c57G75Z6LOiAkeyhhY3Rpb24gYXMgQnJvd3NlckFjdGlvbikudHlwZX1gIH07XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogYOaJp+ihjOaTjeS9nCAke2FjdGlvbi50eXBlfSDlpLHotKU6ICR7ZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpfWAsXG4gICAgfTtcbiAgfVxufVxuIiwiLy8gY29udGVudC50cyDigJQgQ29udGVudCBTY3JpcHTvvIzms6jlhaXpobXpnaLph4fpm4bkuIrkuIvmlofkv6Hmga/vvIhVUkwgLyDmoIfpopggLyDpgInkuK3mlofmnKzvvIlcbi8vIOebkeWQrOadpeiHqiBiYWNrZ3JvdW5kIOeahOS4iuS4i+aWh+ivt+axgu+8jOWunuaXtumHh+mbhuW5tui/lOWbnlxuLy8g5aKe5by677ya5o6l5pS2IEVYRUNVVEVfQUNUSU9OIOa2iOaBr++8jOaJp+ihjOa1j+iniOWZqCBET00g5pON5L2c77yIY2xpY2svdHlwZS9zY3JvbGwg562J77yJXG5cbmltcG9ydCB7IGV4ZWN1dGVBY3Rpb24gfSBmcm9tICcuLi91dGlscy9hY3Rpb24tZXhlY3V0b3InO1xuaW1wb3J0IHR5cGUgeyBCcm93c2VyQWN0aW9uLCBBY3Rpb25SZXN1bHQgfSBmcm9tICcuLi91dGlscy9hY3Rpb24tZXhlY3V0b3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2VDb250ZXh0IHtcbiAgdXJsOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHNlbGVjdGVkVGV4dDogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcbiAgbWF0Y2hlczogWyc8YWxsX3VybHM+J10sXG4gIG1haW4oKSB7XG4gICAgY29uc29sZS5sb2coJ1tjb250ZW50XSBCcm93c2VyIEFnZW50IGNvbnRlbnQgc2NyaXB0IGxvYWRlZCBvbjonLCBsb2NhdGlvbi5ocmVmKTtcblxuICAgIC8vIOWTjeW6lOadpeiHqiBiYWNrZ3JvdW5kIC8gc2lkZSBwYW5lbCDnmoTkuIrkuIvmlofor7fmsYJcbiAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBfc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdHRVRfUEFHRV9DT05URVhUJykge1xuICAgICAgICBjb25zdCBjb250ZXh0OiBQYWdlQ29udGV4dCA9IHtcbiAgICAgICAgICB1cmw6IGxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgIHNlbGVjdGVkVGV4dDogd2luZG93LmdldFNlbGVjdGlvbigpPy50b1N0cmluZygpIHx8ICcnLFxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmxvZygnW2NvbnRlbnRdIOmHh+mbhumhtemdouS4iuS4i+aWhzonLCBjb250ZXh0LnVybCwgJ+mAieS4reaWh+acrOmVv+W6pjonLCBjb250ZXh0LnNlbGVjdGVkVGV4dC5sZW5ndGgpO1xuICAgICAgICBzZW5kUmVzcG9uc2UoeyB0eXBlOiAnUEFHRV9DT05URVhUJywgcGF5bG9hZDogY29udGV4dCB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIOihqOekuuW8guatpeWTjeW6lFxuICAgICAgfVxuXG4gICAgICAvLyDmtY/op4jlmajmk43kvZzmiafooYzlvJXmk47lhaXlj6NcbiAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdFWEVDVVRFX0FDVElPTicpIHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gbWVzc2FnZS5wYXlsb2FkIGFzIEJyb3dzZXJBY3Rpb247XG4gICAgICAgIGNvbnNvbGUubG9nKCdbY29udGVudF0g5omn6KGM5rWP6KeI5Zmo5pON5L2cOicsIGFjdGlvbi50eXBlLCBhY3Rpb24uc2VsZWN0b3IgfHwgJycpO1xuXG4gICAgICAgIC8vIGV4ZWN1dGVBY3Rpb24g5Y+v6IO96L+U5ZueIFByb21pc2XvvIjlpoIgd2FpdEZvckVsZW1lbnTvvInvvIznu5/kuIDnlKggYXN5bmMg5aSE55CGXG4gICAgICAgIGV4ZWN1dGVBY3Rpb24oYWN0aW9uKVxuICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEFjdGlvblJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1tjb250ZW50XSDmk43kvZznu5Pmnpw6JywgYWN0aW9uLnR5cGUsIHJlc3VsdC5zdWNjZXNzKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHR5cGU6ICdBQ1RJT05fUkVTVUxUJywgcGF5bG9hZDogcmVzdWx0IH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnI6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTXNnID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2NvbnRlbnRdIOaTjeS9nOaJp+ihjOW8guW4uDonLCBhY3Rpb24udHlwZSwgZXJyb3JNc2cpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgdHlwZTogJ0FDVElPTl9SRVNVTFQnLFxuICAgICAgICAgICAgICBwYXlsb2FkOiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3JNc2cgfSBzYXRpc2ZpZXMgQWN0aW9uUmVzdWx0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyDlvILmraXlk43lupRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8g55uR5ZCs6YCJ5Lit5paH5pys5Y+Y5YyW77yM5Li75Yqo5o6o6YCB57uZIGJhY2tncm91bmRcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RlZFRleHQgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk/LnRvU3RyaW5nKCkgfHwgJyc7XG4gICAgICBpZiAoc2VsZWN0ZWRUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICB0eXBlOiAnU0VMRUNUSU9OX0NIQU5HRUQnLFxuICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICAgIHNlbGVjdGVkVGV4dCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgLy8gc2lkZSBwYW5lbCDlj6/og73mnKrmiZPlvIDvvIzlv73nlaVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59KTtcbiIsImZ1bmN0aW9uIHByaW50KG1ldGhvZCwgLi4uYXJncykge1xuICBpZiAoaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09IFwicHJvZHVjdGlvblwiKSByZXR1cm47XG4gIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBhcmdzLnNoaWZ0KCk7XG4gICAgbWV0aG9kKGBbd3h0XSAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgbWV0aG9kKFwiW3d4dF1cIiwgLi4uYXJncyk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBsb2dnZXIgPSB7XG4gIGRlYnVnOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5kZWJ1ZywgLi4uYXJncyksXG4gIGxvZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUubG9nLCAuLi5hcmdzKSxcbiAgd2FybjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUud2FybiwgLi4uYXJncyksXG4gIGVycm9yOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5lcnJvciwgLi4uYXJncylcbn07XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5leHBvcnQgY2xhc3MgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgY29uc3RydWN0b3IobmV3VXJsLCBvbGRVcmwpIHtcbiAgICBzdXBlcihXeHRMb2NhdGlvbkNoYW5nZUV2ZW50LkVWRU5UX05BTUUsIHt9KTtcbiAgICB0aGlzLm5ld1VybCA9IG5ld1VybDtcbiAgICB0aGlzLm9sZFVybCA9IG9sZFVybDtcbiAgfVxuICBzdGF0aWMgRVZFTlRfTkFNRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpsb2NhdGlvbmNoYW5nZVwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbmlxdWVFdmVudE5hbWUoZXZlbnROYW1lKSB7XG4gIHJldHVybiBgJHticm93c2VyPy5ydW50aW1lPy5pZH06JHtpbXBvcnQubWV0YS5lbnYuRU5UUllQT0lOVH06JHtldmVudE5hbWV9YDtcbn1cbiIsImltcG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgfSBmcm9tIFwiLi9jdXN0b20tZXZlbnRzLm1qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcihjdHgpIHtcbiAgbGV0IGludGVydmFsO1xuICBsZXQgb2xkVXJsO1xuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIEVuc3VyZSB0aGUgbG9jYXRpb24gd2F0Y2hlciBpcyBhY3RpdmVseSBsb29raW5nIGZvciBVUkwgY2hhbmdlcy4gSWYgaXQncyBhbHJlYWR5IHdhdGNoaW5nLFxuICAgICAqIHRoaXMgaXMgYSBub29wLlxuICAgICAqL1xuICAgIHJ1bigpIHtcbiAgICAgIGlmIChpbnRlcnZhbCAhPSBudWxsKSByZXR1cm47XG4gICAgICBvbGRVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgaW50ZXJ2YWwgPSBjdHguc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBsZXQgbmV3VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgaWYgKG5ld1VybC5ocmVmICE9PSBvbGRVcmwuaHJlZikge1xuICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgb2xkVXJsKSk7XG4gICAgICAgICAgb2xkVXJsID0gbmV3VXJsO1xuICAgICAgICB9XG4gICAgICB9LCAxZTMpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwid3h0L2Jyb3dzZXJcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuLi8uLi9zYW5kYm94L3V0aWxzL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IGdldFVuaXF1ZUV2ZW50TmFtZSB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuZXhwb3J0IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoY29udGVudFNjcmlwdE5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbnRlbnRTY3JpcHROYW1lID0gY29udGVudFNjcmlwdE5hbWU7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICBpZiAodGhpcy5pc1RvcEZyYW1lKSB7XG4gICAgICB0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cyh7IGlnbm9yZUZpcnN0RXZlbnQ6IHRydWUgfSk7XG4gICAgICB0aGlzLnN0b3BPbGRTY3JpcHRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBTQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXG4gICAgXCJ3eHQ6Y29udGVudC1zY3JpcHQtc3RhcnRlZFwiXG4gICk7XG4gIGlzVG9wRnJhbWUgPSB3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcDtcbiAgYWJvcnRDb250cm9sbGVyO1xuICBsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG4gIHJlY2VpdmVkTWVzc2FnZUlkcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGdldCBzaWduYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuICBhYm9ydChyZWFzb24pIHtcbiAgICByZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcbiAgfVxuICBnZXQgaXNJbnZhbGlkKCkge1xuICAgIGlmIChicm93c2VyLnJ1bnRpbWUuaWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcbiAgfVxuICBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBjb250ZW50IHNjcmlwdCdzIGNvbnRleHQgaXMgaW52YWxpZGF0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lci5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYik7XG4gICAqIGNvbnN0IHJlbW92ZUludmFsaWRhdGVkTGlzdGVuZXIgPSBjdHgub25JbnZhbGlkYXRlZCgoKSA9PiB7XG4gICAqICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG4gICAqIH0pXG4gICAqIC8vIC4uLlxuICAgKiByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyKCk7XG4gICAqL1xuICBvbkludmFsaWRhdGVkKGNiKSB7XG4gICAgdGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGEgcHJvbWlzZSB0aGF0IG5ldmVyIHJlc29sdmVzLiBVc2VmdWwgaWYgeW91IGhhdmUgYW4gYXN5bmMgZnVuY3Rpb24gdGhhdCBzaG91bGRuJ3QgcnVuXG4gICAqIGFmdGVyIHRoZSBjb250ZXh0IGlzIGV4cGlyZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAqICAgaWYgKGN0eC5pc0ludmFsaWQpIHJldHVybiBjdHguYmxvY2soKTtcbiAgICpcbiAgICogICAvLyAuLi5cbiAgICogfVxuICAgKi9cbiAgYmxvY2soKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRJbnRlcnZhbGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHNldEludGVydmFsKGhhbmRsZXIsIHRpbWVvdXQpIHtcbiAgICBjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJJbnRlcnZhbChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRUaW1lb3V0YCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbCB3aGVuIGludmFsaWRhdGVkLlxuICAgKi9cbiAgc2V0VGltZW91dChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJUaW1lb3V0KGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIHJlcXVlc3Qgd2hlblxuICAgKiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjaykge1xuICAgIGNvbnN0IGlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFja2AgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIHJlcXVlc3Qgd2hlblxuICAgKiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHJlcXVlc3RJZGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmICghdGhpcy5zaWduYWwuYWJvcnRlZCkgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSwgb3B0aW9ucyk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICBhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSB0aGlzLmxvY2F0aW9uV2F0Y2hlci5ydW4oKTtcbiAgICB9XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/LihcbiAgICAgIHR5cGUuc3RhcnRzV2l0aChcInd4dDpcIikgPyBnZXRVbmlxdWVFdmVudE5hbWUodHlwZSkgOiB0eXBlLFxuICAgICAgaGFuZGxlcixcbiAgICAgIHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgc2lnbmFsOiB0aGlzLnNpZ25hbFxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBBYm9ydCB0aGUgYWJvcnQgY29udHJvbGxlciBhbmQgZXhlY3V0ZSBhbGwgYG9uSW52YWxpZGF0ZWRgIGxpc3RlbmVycy5cbiAgICovXG4gIG5vdGlmeUludmFsaWRhdGVkKCkge1xuICAgIHRoaXMuYWJvcnQoXCJDb250ZW50IHNjcmlwdCBjb250ZXh0IGludmFsaWRhdGVkXCIpO1xuICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgIGBDb250ZW50IHNjcmlwdCBcIiR7dGhpcy5jb250ZW50U2NyaXB0TmFtZX1cIiBjb250ZXh0IGludmFsaWRhdGVkYFxuICAgICk7XG4gIH1cbiAgc3RvcE9sZFNjcmlwdHMoKSB7XG4gICAgd2luZG93LnBvc3RNZXNzYWdlKFxuICAgICAge1xuICAgICAgICB0eXBlOiBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsXG4gICAgICAgIGNvbnRlbnRTY3JpcHROYW1lOiB0aGlzLmNvbnRlbnRTY3JpcHROYW1lLFxuICAgICAgICBtZXNzYWdlSWQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpXG4gICAgICB9LFxuICAgICAgXCIqXCJcbiAgICApO1xuICB9XG4gIHZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkge1xuICAgIGNvbnN0IGlzU2NyaXB0U3RhcnRlZEV2ZW50ID0gZXZlbnQuZGF0YT8udHlwZSA9PT0gQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFO1xuICAgIGNvbnN0IGlzU2FtZUNvbnRlbnRTY3JpcHQgPSBldmVudC5kYXRhPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZTtcbiAgICBjb25zdCBpc05vdER1cGxpY2F0ZSA9ICF0aGlzLnJlY2VpdmVkTWVzc2FnZUlkcy5oYXMoZXZlbnQuZGF0YT8ubWVzc2FnZUlkKTtcbiAgICByZXR1cm4gaXNTY3JpcHRTdGFydGVkRXZlbnQgJiYgaXNTYW1lQ29udGVudFNjcmlwdCAmJiBpc05vdER1cGxpY2F0ZTtcbiAgfVxuICBsaXN0ZW5Gb3JOZXdlclNjcmlwdHMob3B0aW9ucykge1xuICAgIGxldCBpc0ZpcnN0ID0gdHJ1ZTtcbiAgICBjb25zdCBjYiA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMudmVyaWZ5U2NyaXB0U3RhcnRlZEV2ZW50KGV2ZW50KSkge1xuICAgICAgICB0aGlzLnJlY2VpdmVkTWVzc2FnZUlkcy5hZGQoZXZlbnQuZGF0YS5tZXNzYWdlSWQpO1xuICAgICAgICBjb25zdCB3YXNGaXJzdCA9IGlzRmlyc3Q7XG4gICAgICAgIGlzRmlyc3QgPSBmYWxzZTtcbiAgICAgICAgaWYgKHdhc0ZpcnN0ICYmIG9wdGlvbnM/Lmlnbm9yZUZpcnN0RXZlbnQpIHJldHVybjtcbiAgICAgICAgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgY2IpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiByZW1vdmVFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBjYikpO1xuICB9XG59XG4iLCJjb25zdCBudWxsS2V5ID0gU3ltYm9sKCdudWxsJyk7IC8vIGBvYmplY3RIYXNoZXNgIGtleSBmb3IgbnVsbFxuXG5sZXQga2V5Q291bnRlciA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hbnlLZXlzTWFwIGV4dGVuZHMgTWFwIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX29iamVjdEhhc2hlcyA9IG5ldyBXZWFrTWFwKCk7XG5cdFx0dGhpcy5fc3ltYm9sSGFzaGVzID0gbmV3IE1hcCgpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9lY21hMjYyL2lzc3Vlcy8xMTk0XG5cdFx0dGhpcy5fcHVibGljS2V5cyA9IG5ldyBNYXAoKTtcblxuXHRcdGNvbnN0IFtwYWlyc10gPSBhcmd1bWVudHM7IC8vIE1hcCBjb21wYXRcblx0XHRpZiAocGFpcnMgPT09IG51bGwgfHwgcGFpcnMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgcGFpcnNbU3ltYm9sLml0ZXJhdG9yXSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcih0eXBlb2YgcGFpcnMgKyAnIGlzIG5vdCBpdGVyYWJsZSAoY2Fubm90IHJlYWQgcHJvcGVydHkgU3ltYm9sKFN5bWJvbC5pdGVyYXRvcikpJyk7XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBba2V5cywgdmFsdWVdIG9mIHBhaXJzKSB7XG5cdFx0XHR0aGlzLnNldChrZXlzLCB2YWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0X2dldFB1YmxpY0tleXMoa2V5cywgY3JlYXRlID0gZmFsc2UpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkoa2V5cykpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBrZXlzIHBhcmFtZXRlciBtdXN0IGJlIGFuIGFycmF5Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJpdmF0ZUtleSA9IHRoaXMuX2dldFByaXZhdGVLZXkoa2V5cywgY3JlYXRlKTtcblxuXHRcdGxldCBwdWJsaWNLZXk7XG5cdFx0aWYgKHByaXZhdGVLZXkgJiYgdGhpcy5fcHVibGljS2V5cy5oYXMocHJpdmF0ZUtleSkpIHtcblx0XHRcdHB1YmxpY0tleSA9IHRoaXMuX3B1YmxpY0tleXMuZ2V0KHByaXZhdGVLZXkpO1xuXHRcdH0gZWxzZSBpZiAoY3JlYXRlKSB7XG5cdFx0XHRwdWJsaWNLZXkgPSBbLi4ua2V5c107IC8vIFJlZ2VuZXJhdGUga2V5cyBhcnJheSB0byBhdm9pZCBleHRlcm5hbCBpbnRlcmFjdGlvblxuXHRcdFx0dGhpcy5fcHVibGljS2V5cy5zZXQocHJpdmF0ZUtleSwgcHVibGljS2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge3ByaXZhdGVLZXksIHB1YmxpY0tleX07XG5cdH1cblxuXHRfZ2V0UHJpdmF0ZUtleShrZXlzLCBjcmVhdGUgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHByaXZhdGVLZXlzID0gW107XG5cdFx0Zm9yIChsZXQga2V5IG9mIGtleXMpIHtcblx0XHRcdGlmIChrZXkgPT09IG51bGwpIHtcblx0XHRcdFx0a2V5ID0gbnVsbEtleTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaGFzaGVzID0gdHlwZW9mIGtleSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJyA/ICdfb2JqZWN0SGFzaGVzJyA6ICh0eXBlb2Yga2V5ID09PSAnc3ltYm9sJyA/ICdfc3ltYm9sSGFzaGVzJyA6IGZhbHNlKTtcblxuXHRcdFx0aWYgKCFoYXNoZXMpIHtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaChrZXkpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzW2hhc2hlc10uaGFzKGtleSkpIHtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaCh0aGlzW2hhc2hlc10uZ2V0KGtleSkpO1xuXHRcdFx0fSBlbHNlIGlmIChjcmVhdGUpIHtcblx0XHRcdFx0Y29uc3QgcHJpdmF0ZUtleSA9IGBAQG1rbS1yZWYtJHtrZXlDb3VudGVyKyt9QEBgO1xuXHRcdFx0XHR0aGlzW2hhc2hlc10uc2V0KGtleSwgcHJpdmF0ZUtleSk7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2gocHJpdmF0ZUtleSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHByaXZhdGVLZXlzKTtcblx0fVxuXG5cdHNldChrZXlzLCB2YWx1ZSkge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzLCB0cnVlKTtcblx0XHRyZXR1cm4gc3VwZXIuc2V0KHB1YmxpY0tleSwgdmFsdWUpO1xuXHR9XG5cblx0Z2V0KGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIHN1cGVyLmdldChwdWJsaWNLZXkpO1xuXHR9XG5cblx0aGFzKGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIHN1cGVyLmhhcyhwdWJsaWNLZXkpO1xuXHR9XG5cblx0ZGVsZXRlKGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5LCBwcml2YXRlS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIEJvb2xlYW4ocHVibGljS2V5ICYmIHN1cGVyLmRlbGV0ZShwdWJsaWNLZXkpICYmIHRoaXMuX3B1YmxpY0tleXMuZGVsZXRlKHByaXZhdGVLZXkpKTtcblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdHN1cGVyLmNsZWFyKCk7XG5cdFx0dGhpcy5fc3ltYm9sSGFzaGVzLmNsZWFyKCk7XG5cdFx0dGhpcy5fcHVibGljS2V5cy5jbGVhcigpO1xuXHR9XG5cblx0Z2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuXHRcdHJldHVybiAnTWFueUtleXNNYXAnO1xuXHR9XG5cblx0Z2V0IHNpemUoKSB7XG5cdFx0cmV0dXJuIHN1cGVyLnNpemU7XG5cdH1cbn1cbiIsImltcG9ydCBNYW55S2V5c01hcCBmcm9tICdtYW55LWtleXMtbWFwJztcbmltcG9ydCB7IGRlZnUgfSBmcm9tICdkZWZ1JztcbmltcG9ydCB7IGlzRXhpc3QgfSBmcm9tICcuL2RldGVjdG9ycy5tanMnO1xuXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9ICgpID0+ICh7XG4gIHRhcmdldDogZ2xvYmFsVGhpcy5kb2N1bWVudCxcbiAgdW5pZnlQcm9jZXNzOiB0cnVlLFxuICBkZXRlY3RvcjogaXNFeGlzdCxcbiAgb2JzZXJ2ZUNvbmZpZ3M6IHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gIH0sXG4gIHNpZ25hbDogdm9pZCAwLFxuICBjdXN0b21NYXRjaGVyOiB2b2lkIDBcbn0pO1xuY29uc3QgbWVyZ2VPcHRpb25zID0gKHVzZXJTaWRlT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIGRlZnUodXNlclNpZGVPcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG59O1xuXG5jb25zdCB1bmlmeUNhY2hlID0gbmV3IE1hbnlLZXlzTWFwKCk7XG5mdW5jdGlvbiBjcmVhdGVXYWl0RWxlbWVudChpbnN0YW5jZU9wdGlvbnMpIHtcbiAgY29uc3QgeyBkZWZhdWx0T3B0aW9ucyB9ID0gaW5zdGFuY2VPcHRpb25zO1xuICByZXR1cm4gKHNlbGVjdG9yLCBvcHRpb25zKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgdGFyZ2V0LFxuICAgICAgdW5pZnlQcm9jZXNzLFxuICAgICAgb2JzZXJ2ZUNvbmZpZ3MsXG4gICAgICBkZXRlY3RvcixcbiAgICAgIHNpZ25hbCxcbiAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICB9ID0gbWVyZ2VPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgICBjb25zdCB1bmlmeVByb21pc2VLZXkgPSBbXG4gICAgICBzZWxlY3RvcixcbiAgICAgIHRhcmdldCxcbiAgICAgIHVuaWZ5UHJvY2VzcyxcbiAgICAgIG9ic2VydmVDb25maWdzLFxuICAgICAgZGV0ZWN0b3IsXG4gICAgICBzaWduYWwsXG4gICAgICBjdXN0b21NYXRjaGVyXG4gICAgXTtcbiAgICBjb25zdCBjYWNoZWRQcm9taXNlID0gdW5pZnlDYWNoZS5nZXQodW5pZnlQcm9taXNlS2V5KTtcbiAgICBpZiAodW5pZnlQcm9jZXNzICYmIGNhY2hlZFByb21pc2UpIHtcbiAgICAgIHJldHVybiBjYWNoZWRQcm9taXNlO1xuICAgIH1cbiAgICBjb25zdCBkZXRlY3RQcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAvLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vQXN5bmNQcm9taXNlRXhlY3V0b3I6IGF2b2lkIG5lc3RpbmcgcHJvbWlzZVxuICAgICAgYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgICAgIGFzeW5jIChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgXyBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zdCBkZXRlY3RSZXN1bHQyID0gYXdhaXQgZGV0ZWN0RWxlbWVudCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgIGRldGVjdG9yLFxuICAgICAgICAgICAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChkZXRlY3RSZXN1bHQyLmlzRGV0ZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkZXRlY3RSZXN1bHQyLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHNpZ25hbD8uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcImFib3J0XCIsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgb25jZTogdHJ1ZSB9XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGRldGVjdFJlc3VsdCA9IGF3YWl0IGRldGVjdEVsZW1lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICBkZXRlY3RvcixcbiAgICAgICAgICBjdXN0b21NYXRjaGVyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZGV0ZWN0UmVzdWx0LmlzRGV0ZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkZXRlY3RSZXN1bHQucmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwgb2JzZXJ2ZUNvbmZpZ3MpO1xuICAgICAgfVxuICAgICkuZmluYWxseSgoKSA9PiB7XG4gICAgICB1bmlmeUNhY2hlLmRlbGV0ZSh1bmlmeVByb21pc2VLZXkpO1xuICAgIH0pO1xuICAgIHVuaWZ5Q2FjaGUuc2V0KHVuaWZ5UHJvbWlzZUtleSwgZGV0ZWN0UHJvbWlzZSk7XG4gICAgcmV0dXJuIGRldGVjdFByb21pc2U7XG4gIH07XG59XG5hc3luYyBmdW5jdGlvbiBkZXRlY3RFbGVtZW50KHtcbiAgdGFyZ2V0LFxuICBzZWxlY3RvcixcbiAgZGV0ZWN0b3IsXG4gIGN1c3RvbU1hdGNoZXJcbn0pIHtcbiAgY29uc3QgZWxlbWVudCA9IGN1c3RvbU1hdGNoZXIgPyBjdXN0b21NYXRjaGVyKHNlbGVjdG9yKSA6IHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgcmV0dXJuIGF3YWl0IGRldGVjdG9yKGVsZW1lbnQpO1xufVxuY29uc3Qgd2FpdEVsZW1lbnQgPSBjcmVhdGVXYWl0RWxlbWVudCh7XG4gIGRlZmF1bHRPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucygpXG59KTtcblxuZXhwb3J0IHsgY3JlYXRlV2FpdEVsZW1lbnQsIGdldERlZmF1bHRPcHRpb25zLCB3YWl0RWxlbWVudCB9O1xuIl0sIm5hbWVzIjpbImRlZmluaXRpb24iLCJ0aGlzIiwibW9kdWxlIiwicHJveHlUYXJnZXQiLCJ2YWx1ZSIsInJlc3VsdCIsIm1lc3NhZ2UiLCJwcmludCIsImxvZ2dlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBTyxXQUFTLG9CQUFvQkEsYUFBWTtBQUM5QyxXQUFPQTtBQUFBLEVBQ1Q7Ozs7Ozs7Ozs7O0FDRkEsT0FBQyxTQUFVLFFBQVEsU0FBUztBQUdpQjtBQUN6QyxrQkFBUSxNQUFNO0FBQUEsUUFDbEI7QUFBQSxNQU9BLEdBQUcsT0FBTyxlQUFlLGNBQWMsYUFBYSxPQUFPLFNBQVMsY0FBYyxPQUFPQyxpQkFBTSxTQUFVQyxTQUFRO0FBUy9HLFlBQUksRUFBRSxXQUFXLFVBQVUsV0FBVyxPQUFPLFdBQVcsV0FBVyxPQUFPLFFBQVEsS0FBSztBQUNyRixnQkFBTSxJQUFJLE1BQU0sMkRBQTJEO0FBQUEsUUFDL0U7QUFDRSxZQUFJLEVBQUUsV0FBVyxXQUFXLFdBQVcsUUFBUSxXQUFXLFdBQVcsUUFBUSxRQUFRLEtBQUs7QUFDeEYsZ0JBQU0sbURBQW1EO0FBT3pELGdCQUFNLFdBQVcsbUJBQWlCO0FBSWhDLGtCQUFNLGNBQWM7QUFBQSxjQUNsQixVQUFVO0FBQUEsZ0JBQ1IsU0FBUztBQUFBLGtCQUNQLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsWUFBWTtBQUFBLGtCQUNWLFdB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QSxJQUVBLGVBQWUsTUFBTSxTQUFTLE9BQU87QUFDcEMsWUFBTSxjQUFjLENBQUE7QUFDcEIsZUFBUyxPQUFPLE1BQU07QUFDckIsWUFBSSxRQUFRLE1BQU07QUFDakIsZ0JBQU07QUFBQSxRQUNQO0FBRUEsY0FBTSxTQUFTLE9BQU8sUUFBUSxZQUFZLE9BQU8sUUFBUSxhQUFhLGtCQUFtQixPQUFPLFFBQVEsV0FBVyxrQkFBa0I7QUFFckksWUFBSSxDQUFDLFFBQVE7QUFDWixzQkFBWSxLQUFLLEdBQUc7QUFBQSxRQUNyQixXQUFXLEtBQUssTUFBTSxFQUFFLElBQUksR0FBRyxHQUFHO0FBQ2pDLHNCQUFZLEtBQUssS0FBSyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUM7QUFBQSxRQUN2QyxXQUFXLFFBQVE7QUFDbEIsZ0JBQU0sYUFBYSxhQUFhLFlBQVk7QUFDNUMsZUFBSyxNQUFNLEVBQUUsSUFBSSxLQUFLLFVBQVU7QUFDaEMsc0JBQVksS0FBSyxVQUFVO0FBQUEsUUFDNUIsT0FBTztBQUNOLGlCQUFPO0FBQUEsUUFDUjtBQUFBLE1BQ0Q7QUFFQSxhQUFPLEtBQUssVUFBVSxXQUFXO0FBQUEsSUFDbEM7QUFBQSxJQUVBLElBQUksTUFBTSxPQUFPO0FBQ2hCLFlBQU0sRUFBQyxVQUFTLElBQUksS0FBSyxlQUFlLE1BQU0sSUFBSTtBQUNsRCxhQUFPLE1BQU0sSUFBSSxXQUFXLEtBQUs7QUFBQSxJQUNsQztBQUFBLElBRUEsSUFBSSxNQUFNO0FBQ1QsWUFBTSxFQUFDLFVBQVMsSUFBSSxLQUFLLGVBQWUsSUFBSTtBQUM1QyxhQUFPLE1BQU0sSUFBSSxTQUFTO0FBQUEsSUFDM0I7QUFBQSxJQUVBLElBQUksTUFBTTtBQUNULFlBQU0sRUFBQyxVQUFTLElBQUksS0FBSyxlQUFlLElBQUk7QUFDNUMsYUFBTyxNQUFNLElBQUksU0FBUztBQUFBLElBQzNCO0FBQUEsSUFFQSxPQUFPLE1BQU07QUFDWixZQUFNLEVBQUMsV0FBVyxXQUFVLElBQUksS0FBSyxlQUFlLElBQUk7QUFDeEQsYUFBTyxRQUFRLGFBQWEsTUFBTSxPQUFPLFNBQVMsS0FBSyxLQUFLLFlBQVksT0FBTyxVQUFVLENBQUM7QUFBQSxJQUMzRjtBQUFBLElBRUEsUUFBUTtBQUNQLFlBQU0sTUFBSztBQUNYLFdBQUssY0FBYyxNQUFLO0FBQ3hCLFdBQUssWUFBWSxNQUFLO0FBQUEsSUFDdkI7QUFBQSxJQUVBLEtBQUssT0FBTyxXQUFXLElBQUk7QUFDMUIsYUFBTztBQUFBLElBQ1I7QUFBQSxJQUVBLElBQUksT0FBTztBQUNWLGFBQU8sTUFBTTtBQUFBLElBQ2Q7QUFBQSxFQUNEO0FDbEZtQixNQUFJLFlBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsNSw2LDcsOCw5LDEwXX0=
