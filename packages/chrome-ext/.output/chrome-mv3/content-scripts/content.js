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
          const translatedEl = document.createElement("div");
          translatedEl.className = "imt-translation";
          translatedEl.setAttribute("data-imt-source", item.id);
          translatedEl.textContent = item.translated;
          (_a = original.parentNode) == null ? void 0 : _a.insertBefore(translatedEl, original.nextSibling);
          injected++;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93ZWJleHRlbnNpb24tcG9seWZpbGxAMC4xMi4wL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIvaW5kZXgubWpzIiwiLi4vLi4vLi4vdXRpbHMvYWN0aW9uLWV4ZWN1dG9yLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyMC4xOS4zN19yb2xsdXBANC41OS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L3V0aWxzL2xvZ2dlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMjlfQHR5cGVzK25vZGVAMjAuMTkuMzdfcm9sbHVwQDQuNTkuMC9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvY2xpZW50L2NvbnRlbnQtc2NyaXB0cy9jdXN0b20tZXZlbnRzLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyMC4xOS4zN19yb2xsdXBANC41OS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDIwLjE5LjM3X3JvbGx1cEA0LjU5LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbWFueS1rZXlzLW1hcEAyLjAuMS9ub2RlX21vZHVsZXMvbWFueS1rZXlzLW1hcC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AMW5hdHN1K3dhaXQtZWxlbWVudEA0LjEuMi9ub2RlX21vZHVsZXMvQDFuYXRzdS93YWl0LWVsZW1lbnQvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiLCBbXCJtb2R1bGVcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeShtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QpO1xuICAgIGdsb2JhbC5icm93c2VyID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgLyogd2ViZXh0ZW5zaW9uLXBvbHlmaWxsIC0gdjAuMTIuMCAtIFR1ZSBNYXkgMTQgMjAyNCAxODowMToyOSAqL1xuICAvKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG4gIC8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAgICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICAgKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAoIShnbG9iYWxUaGlzLmNocm9tZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUuaWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG4gIGlmICghKGdsb2JhbFRoaXMuYnJvd3NlciAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZSAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZS5pZCkpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjtcblxuICAgIC8vIFdyYXBwaW5nIHRoZSBidWxrIG9mIHRoaXMgcG9seWZpbGwgaW4gYSBvbmUtdGltZS11c2UgZnVuY3Rpb24gaXMgYSBtaW5vclxuICAgIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAgIC8vIGNvbnRlbnRzIG9mIGEgZnVuY3Rpb24gdW50aWwgdGhlIGZpcnN0IHRpbWUgaXQncyBjYWxsZWQsIGFuZCBzaW5jZSBpdCB3aWxsXG4gICAgLy8gbmV2ZXIgYWN0dWFsbHkgbmVlZCB0byBiZSBjYWxsZWQsIHRoaXMgYWxsb3dzIHRoZSBwb2x5ZmlsbCB0byBiZSBpbmNsdWRlZFxuICAgIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICAgIGNvbnN0IHdyYXBBUElzID0gZXh0ZW5zaW9uQVBJcyA9PiB7XG4gICAgICAvLyBOT1RFOiBhcGlNZXRhZGF0YSBpcyBhc3NvY2lhdGVkIHRvIHRoZSBjb250ZW50IG9mIHRoZSBhcGktbWV0YWRhdGEuanNvbiBmaWxlXG4gICAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICAvLyBKU09OIGZpbGUuXG4gICAgICBjb25zdCBhcGlNZXRhZGF0YSA9IHtcbiAgICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjbGVhckFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFN1YlRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2VyQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImRpc2FibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlbmFibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuUG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNhY2hlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZURvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZvcm1EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUxvY2FsU3RvcmFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBhc3N3b3Jkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb29raWVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbENvb2tpZVN0b3Jlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgICBcImluc3BlY3RlZFdpbmRvd1wiOiB7XG4gICAgICAgICAgICBcImV2YWxcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDIsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGFuZWxzXCI6IHtcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVsZW1lbnRzXCI6IHtcbiAgICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwiY2FuY2VsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlcmFzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZpbGVJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhdXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3VtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICAgIFwiaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImlzQWxsb3dlZEluY29nbml0b0FjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhpc3RvcnlcIjoge1xuICAgICAgICAgIFwiYWRkVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlUmFuZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWNjZXB0TGFuZ3VhZ2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRlbnRpdHlcIjoge1xuICAgICAgICAgIFwibGF1bmNoV2ViQXV0aEZsb3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGxlXCI6IHtcbiAgICAgICAgICBcInF1ZXJ5U3RhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYW5hZ2VtZW50XCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRFbmFibGVkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjoge1xuICAgICAgICAgIFwiY29udGFpbnNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicnVudGltZVwiOiB7XG4gICAgICAgICAgXCJnZXRCYWNrZ3JvdW5kUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5PcHRpb25zUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RVcGRhdGVDaGVja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE5hdGl2ZU1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRVbmluc3RhbGxVUkxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJnZXREZXZpY2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN0b3JlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgXCJsb2NhbFwiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1hbmFnZWRcIjoge1xuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRhYnNcIjoge1xuICAgICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkdXBsaWNhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJleGVjdXRlU2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0JhY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0ZvcndhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpbnNlcnRDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgICBcImdldEFsbEZyYW1lc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZyYW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViUmVxdWVzdFwiOiB7XG4gICAgICAgICAgXCJoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2luZG93c1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAgICogICAgICAgIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2YWx1ZSBmb3IgYW55XG4gICAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICAgKi9cbiAgICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG4gICAgICBjb25zdCBpc1RoZW5hYmxlID0gdmFsdWUgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICAgKlxuICAgICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIElmIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIHByb21pc2UgaXNcbiAgICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgICAqICAgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x1dGlvbiBhbmQgcmVqZWN0aW9uIGZ1bmN0aW9ucyBvZiBhXG4gICAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVzb2x1dGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBsdXJhbGl6ZUFyZ3VtZW50cyA9IG51bUFyZ3MgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYXN5bmNGdW5jdGlvbldyYXBwZXIodGFyZ2V0LCAuLi5hcmdzKSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgQVBJIG1ldGhvZCBoYXMgY3VycmVudGx5IG5vIGNhbGxiYWNrIG9uIENocm9tZSwgYnV0IGl0IHJldHVybiBhIHByb21pc2Ugb24gRmlyZWZveCxcbiAgICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgICAgLy8gdG8gbm90IHBhc3NpbmcgdGhlIGNhbGxiYWNrIGlmIHRoZSBmaXJzdCBjYWxsIGZhaWxzLlxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGNiRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bmFtZX0gQVBJIG1ldGhvZCBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyLCBgICsgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEFQSSBtZXRob2QgbWV0YWRhdGEsIHNvIHRoYXQgdGhlIG5leHQgQVBJIGNhbGxzIHdpbGwgbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdW5zdXBwb3J0ZWQgY2FsbGJhY2sgYW55bW9yZS5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gZXhpc3RpbmcgbWV0aG9kIG9mIHRoZSB0YXJnZXQgb2JqZWN0LCBzbyB0aGF0IGNhbGxzIHRvIGl0IGFyZVxuICAgICAgICogaW50ZXJjZXB0ZWQgYnkgdGhlIGdpdmVuIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHJlY2VpdmVzLFxuICAgICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICAgKiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgb3JpZ2luYWwgdGFyZ2V0IG9iamVjdCB0aGF0IHRoZSB3cmFwcGVkIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kXG4gICAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgICAqICAgICAgICBvYmplY3Qgd2hpY2ggaXMgY3JlYXRlZCB0byB3cmFwIHRoZSBtZXRob2QuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgICAqICAgICAgICBvZiB0aGUgd3JhcHBlZCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgICAqICAgICAgICBBIFByb3h5IG9iamVjdCBmb3IgdGhlIGdpdmVuIG1ldGhvZCwgd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gd3JhcHBlclxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiBpdHMgcGxhY2UuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBNZXRob2QgPSAodGFyZ2V0LCBtZXRob2QsIHdyYXBwZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShtZXRob2QsIHtcbiAgICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmNhbGwodGhpc09iaiwgdGFyZ2V0LCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvYmplY3QgaW4gYSBQcm94eSB3aGljaCBpbnRlcmNlcHRzIGFuZCB3cmFwcyBjZXJ0YWluIG1ldGhvZHNcbiAgICAgICAqIGJhc2VkIG9uIHRoZSBnaXZlbiBgd3JhcHBlcnNgIGFuZCBgbWV0YWRhdGFgIG9iamVjdHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSB0YXJnZXQgb2JqZWN0IHRvIHdyYXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFt3cmFwcGVycyA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgd3JhcHBlciBmdW5jdGlvbnMgZm9yIHNwZWNpYWwgY2FzZXMuIEFueVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZS4gVGhlc2VcbiAgICAgICAqICAgICAgICB3cmFwcGVyIG1ldGhvZHMgYXJlIGludm9rZWQgYXMgZGVzY3JpYmVkIGluIHtAc2VlIHdyYXBNZXRob2R9LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGEgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIG1ldGFkYXRhIHVzZWQgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZVxuICAgICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICAgKiAgICAgICAgdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlIHdoaWNoIGhhcyBhIGNvcnJlc3BvbmRpbmcgbWV0YWRhdGEgb2JqZWN0XG4gICAgICAgKiAgICAgICAgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGBtZXRhZGF0YWAgdHJlZSBpcyByZXBsYWNlZCB3aXRoIGFuXG4gICAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgKiAgICAgICAge0BzZWUgd3JhcEFzeW5jRnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0KHByb3h5VGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBvYmplY3QuIENoZWNrIGlmIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgICAgLy8gYW55IHdyYXBwaW5nLlxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHByb3h5VGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShjYWNoZSwgcHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgdGFyZ2V0IGlmIHRoYXQgdmFsdWUgaXMgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZFxuICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLiBGb3IgdGhpcyByZWFzb24sIHdlIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2Fubm90IHJldHVybiBhIGN1c3RvbSBvYmplY3QgZm9yIEFQSXMgdGhhdFxuICAgICAgICAvLyBhcmUgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZCBub24tY29uZmlndXJhYmxlLCBzdWNoIGFzIGBjaHJvbWUuZGV2dG9vbHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgcHJveHkgaGFuZGxlcnMgdGhlbXNlbHZlcyB3aWxsIHN0aWxsIHVzZSB0aGUgb3JpZ2luYWwgYHRhcmdldGBcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgYHByb3h5VGFyZ2V0YCwgc28gdGhhdCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBhcmVcbiAgICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBzZXQgb2Ygd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IG9iamVjdCwgd2hpY2ggaGFuZGxlc1xuICAgICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBBIHNpbmdsZSB3cmFwcGVyIGlzIGNyZWF0ZWQgZm9yIGVhY2ggbGlzdGVuZXIgZnVuY3Rpb24sIGFuZCBzdG9yZWQgaW4gYVxuICAgICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgICAqIHJldHJpZXZlIHRoZSBvcmlnaW5hbCB3cmFwcGVyLCBzbyB0aGF0ICBhdHRlbXB0cyB0byByZW1vdmUgYVxuICAgICAgICogcHJldmlvdXNseS1hZGRlZCBsaXN0ZW5lciB3b3JrIGFzIGV4cGVjdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RGVmYXVsdFdlYWtNYXA8ZnVuY3Rpb24sIGZ1bmN0aW9uPn0gd3JhcHBlck1hcFxuICAgICAgICogICAgICAgIEEgRGVmYXVsdFdlYWtNYXAgb2JqZWN0IHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAgICogICAgICAgIGFuIGV4aXN0aW5nIG9uZSB3aGVuIGl0IGRvZXMuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEV2ZW50ID0gd3JhcHBlck1hcCA9PiAoe1xuICAgICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgICAgdGFyZ2V0LmFkZExpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0xpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGFuIG9uUmVxdWVzdEZpbmlzaGVkIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCByZXR1cm4gYVxuICAgICAgICAgKiBgZ2V0Q29udGVudCgpYCBwcm9wZXJ0eSB3aGljaCByZXR1cm5zIGEgYFByb21pc2VgIHJhdGhlciB0aGFuIHVzaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxXG4gICAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgICBnZXRDb250ZW50OiB7XG4gICAgICAgICAgICAgIG1pbkFyZ3M6IDAsXG4gICAgICAgICAgICAgIG1heEFyZ3M6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0ZW5lcih3cmFwcGVkUmVxKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBkaWRDYWxsU2VuZFJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHdyYXBwZWRTZW5kUmVzcG9uc2U7XG4gICAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgICAvLyB3cmFwcGVkU2VuZFJlc3BvbnNlIHN5bmNocm9ub3VzbHksIHdlIGNhbiBleGl0IGVhcmxpZXJcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgICAvLyBhbmQgYW4gZXJyb3IgaWYgdGhlIHByb21pc2UgcmVqZWN0cyAoYSB3cmFwcGVkIHNlbmRNZXNzYWdlIGhhc1xuICAgICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgICAgLy8gcHJvbWlzZSkuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG4gICAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fCB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZSA9IChuYW1lLCBtZXRhZGF0YSwgYXBpTmFtZXNwYWNlT2JqLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgICBkZXZ0b29sczoge1xuICAgICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMixcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2V0dGluZ01ldGFkYXRhID0ge1xuICAgICAgICBjbGVhcjoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBhcGlNZXRhZGF0YS5wcml2YWN5ID0ge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXJ2aWNlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgd2Vic2l0ZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gICAgLy8gYG1vZHVsZWAgdmFyaWFibGUgYXZhaWxhYmxlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuYnJvd3NlcjtcbiAgfVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icm93c2VyLXBvbHlmaWxsLmpzLm1hcFxuIiwiaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcbiIsIi8vIGFjdGlvbi1leGVjdXRvci50cyDigJQg5rWP6KeI5Zmo5pON5L2c5omn6KGM5byV5pOOXG4vLyDlrprkuYkgQnJvd3NlckFjdGlvbiDmjqXlj6PkuI7miYDmnInmlK/mjIHnmoQgRE9NIOaTjeS9nOexu+Wei++8jFxuLy8g5ZyoIGNvbnRlbnQgc2NyaXB0IOS4iuS4i+aWh+S4reaJp+ihjCBjbGljay90eXBlL3Njcm9sbC9xdWVyeVNlbGVjdG9yIOetieaTjeS9nFxuXG4vKiog5pSv5oyB55qE5rWP6KeI5Zmo5pON5L2c57G75Z6L5p6a5Li+ICovXG5leHBvcnQgdHlwZSBBY3Rpb25UeXBlID1cbiAgfCAnY2xpY2snXG4gIHwgJ3R5cGUnXG4gIHwgJ3Njcm9sbCdcbiAgfCAnbmF2aWdhdGUnXG4gIHwgJ3F1ZXJ5U2VsZWN0b3InXG4gIHwgJ3F1ZXJ5U2VsZWN0b3JBbGwnXG4gIHwgJ2dldFRleHRDb250ZW50J1xuICB8ICdnZXRBdHRyaWJ1dGUnXG4gIHwgJ2dldFZhbHVlJ1xuICB8ICdzY3JlZW5zaG90J1xuICB8ICd3YWl0Rm9yRWxlbWVudCdcbiAgfCAnaGlnaGxpZ2h0J1xuICB8ICdldmFsdWF0ZSdcbiAgfCAnc2VsZWN0T3B0aW9uJ1xuICB8ICdnZXRMaW5rcydcbiAgfCAnZXh0cmFjdFBhcmFncmFwaHMnXG4gIHwgJ2luamVjdEJpbGluZ3VhbCc7XG5cbi8qKiDmu5rliqjmqKHlvI8gKi9cbmV4cG9ydCB0eXBlIFNjcm9sbE1vZGUgPSAndG8tdG9wJyB8ICd0by1ib3R0b20nIHwgJ2J5LXBpeGVscycgfCAndG8tZWxlbWVudCc7XG5cbi8qKiDmtY/op4jlmajmk43kvZzor7fmsYIgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlckFjdGlvbiB7XG4gIC8qKiDmk43kvZznsbvlnosgKi9cbiAgdHlwZTogQWN0aW9uVHlwZTtcbiAgLyoqIENTUyDpgInmi6nlmajvvIzlrprkvY3nm67moIflhYPntKAgKi9cbiAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8qKiDmlofmnKzljLnphY3ov4fmu6TvvIhjbGljayDml7blj6/pgInvvIznlKjkuo7ku47lpJrkuKrljLnphY3kuK3nrZvpgInlkKvmjIflrprmlofmnKznmoTlhYPntKDvvIkgKi9cbiAgdGV4dD86IHN0cmluZztcbiAgLyoqIHR5cGUg5pON5L2c6KaB6L6T5YWl55qE5paH5pysICovXG4gIHZhbHVlPzogc3RyaW5nO1xuICAvKiogc2Nyb2xsIOaTjeS9nOeahOaooeW8jyAqL1xuICBzY3JvbGxNb2RlPzogU2Nyb2xsTW9kZTtcbiAgLyoqIHNjcm9sbCBieS1waXhlbHMg5qih5byP55qE5YOP57Sg5pWw77yI5q2j5pWw5ZCR5LiL77yM6LSf5pWw5ZCR5LiK77yJICovXG4gIHNjcm9sbFBpeGVscz86IG51bWJlcjtcbiAgLyoqIGdldEF0dHJpYnV0ZSDopoHojrflj5bnmoTlsZ7mgKflkI0gKi9cbiAgYXR0cmlidXRlTmFtZT86IHN0cmluZztcbiAgLyoqIG5hdmlnYXRlIOaTjeS9nOeahOebruaghyBVUkwgKi9cbiAgdXJsPzogc3RyaW5nO1xuICAvKiogd2FpdEZvckVsZW1lbnQg55qE6LaF5pe25q+r56eS5pWw77yI6buY6K6kIDUwMDDvvIkgKi9cbiAgdGltZW91dD86IG51bWJlcjtcbiAgLyoqIGhpZ2hsaWdodCDpq5jkuq7popzoibLvvIjpu5jorqQgcmdiYSgyNTUsIDE2NSwgMCwgMC40Ke+8iSAqL1xuICBoaWdobGlnaHRDb2xvcj86IHN0cmluZztcbiAgLyoqIGhpZ2hsaWdodCDmjIHnu63ml7bpl7Tmr6vnp5LmlbDvvIjpu5jorqQgMjAwMO+8iSAqL1xuICBoaWdobGlnaHREdXJhdGlvbj86IG51bWJlcjtcbiAgLyoqIGV2YWx1YXRlIOaTjeS9nOimgeaJp+ihjOeahCBKYXZhU2NyaXB0IOihqOi+vuW8jyAqL1xuICBleHByZXNzaW9uPzogc3RyaW5nO1xuICAvKiogc2VsZWN0T3B0aW9uIOaTjeS9nOimgemAieaLqeeahCBvcHRpb24gdmFsdWUg5bGe5oCnICovXG4gIG9wdGlvblZhbHVlPzogc3RyaW5nO1xuICAvKiogc2VsZWN0T3B0aW9uIOaTjeS9nOimgemAieaLqeeahCBvcHRpb24g5Y+v6KeB5paH5pysICovXG4gIG9wdGlvblRleHQ/OiBzdHJpbmc7XG4gIC8qKiBnZXRMaW5rcyAvIHF1ZXJ5U2VsZWN0b3JBbGwg6L+U5Zue55qE5pyA5aSn5YWD57Sg5pWwICovXG4gIG1heENvdW50PzogbnVtYmVyO1xuICAvKiogZXh0cmFjdFBhcmFncmFwaHMg55qE6IyD5Zu06YCJ5oup5ZmoICovXG4gIHNjb3BlU2VsZWN0b3I/OiBzdHJpbmc7XG4gIC8qKiBpbmplY3RCaWxpbmd1YWwg55qE5pON5L2c5qih5byPOiBpbmplY3QgLyB0b2dnbGUgLyBjbGVhciAqL1xuICBpbmplY3RNb2RlPzogJ2luamVjdCcgfCAndG9nZ2xlJyB8ICdjbGVhcic7XG4gIC8qKiBpbmplY3RCaWxpbmd1YWwgaW5qZWN0IOaooeW8j+eahOe/u+ivkeaVsOaNru+8iEpTT04g5a2X56ym5Liy77yJICovXG4gIHRyYW5zbGF0aW9ucz86IHN0cmluZztcbn1cblxuLyoqIOaTjeS9nOaJp+ihjOe7k+aenCAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25SZXN1bHQge1xuICAvKiog5piv5ZCm5oiQ5YqfICovXG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIC8qKiDov5Tlm57mlbDmja7vvIjmoLnmja7mk43kvZznsbvlnovkuI3lkIzogIzkuI3lkIzvvIkgKi9cbiAgZGF0YT86IHVua25vd247XG4gIC8qKiDlpLHotKXml7bnmoTplJnor6/kv6Hmga8gKi9cbiAgZXJyb3I/OiBzdHJpbmc7XG59XG5cbi8qKiBxdWVyeVNlbGVjdG9yIOi/lOWbnueahOWFg+e0oOS/oeaBryAqL1xuZXhwb3J0IGludGVyZmFjZSBFbGVtZW50SW5mbyB7XG4gIHRhZ05hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIHRleHRDb250ZW50OiBzdHJpbmc7XG4gIGhyZWY/OiBzdHJpbmc7XG4gIHNyYz86IHN0cmluZztcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIOS7jiBET00g5YWD57Sg5o+Q5Y+W5YWz6ZSu5bGe5oCn5L+h5oGvXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RFbGVtZW50SW5mbyhlbDogRWxlbWVudCk6IEVsZW1lbnRJbmZvIHtcbiAgY29uc3QgaHRtbEVsID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IGlucHV0RWwgPSBlbCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICBjb25zdCBhbmNob3JFbCA9IGVsIGFzIEhUTUxBbmNob3JFbGVtZW50O1xuICBjb25zdCBpbWdFbCA9IGVsIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG5cbiAgcmV0dXJuIHtcbiAgICB0YWdOYW1lOiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgaWQ6IGVsLmlkIHx8ICcnLFxuICAgIGNsYXNzTmFtZTogZWwuY2xhc3NOYW1lIHx8ICcnLFxuICAgIHRleHRDb250ZW50OiAoaHRtbEVsLnRleHRDb250ZW50IHx8ICcnKS50cmltKCkuc2xpY2UoMCwgNTAwKSxcbiAgICAuLi4oYW5jaG9yRWwuaHJlZiA/IHsgaHJlZjogYW5jaG9yRWwuaHJlZiB9IDoge30pLFxuICAgIC4uLihpbWdFbC5zcmMgPyB7IHNyYzogaW1nRWwuc3JjIH0gOiB7fSksXG4gICAgLi4uKGlucHV0RWwudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dEVsLnZhbHVlICE9PSAnJyA/IHsgdmFsdWU6IGlucHV0RWwudmFsdWUgfSA6IHt9KSxcbiAgICAuLi4oaW5wdXRFbC50eXBlID8geyB0eXBlOiBpbnB1dEVsLnR5cGUgfSA6IHt9KSxcbiAgICAuLi4oaW5wdXRFbC5wbGFjZWhvbGRlciA/IHsgcGxhY2Vob2xkZXI6IGlucHV0RWwucGxhY2Vob2xkZXIgfSA6IHt9KSxcbiAgfTtcbn1cblxuLyoqXG4gKiDmoLnmja4gc2VsZWN0b3Ig5ZKM5Y+v6YCJIHRleHQg6L+H5ruk5a6a5L2N5YWD57SgXG4gKi9cbmZ1bmN0aW9uIGZpbmRFbGVtZW50KHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBFbGVtZW50IHwgbnVsbCB7XG4gIGlmICh0ZXh0KSB7XG4gICAgLy8g5om+5Yiw5omA5pyJ5Yy56YWNIHNlbGVjdG9yIOeahOWFg+e0oO+8jOWGjeaMiSB0ZXh0Q29udGVudCDnrZvpgIlcbiAgICBjb25zdCBjYW5kaWRhdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgZm9yIChjb25zdCBlbCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICBpZiAoKGVsIGFzIEhUTUxFbGVtZW50KS50ZXh0Q29udGVudD8uaW5jbHVkZXModGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG59XG5cbi8qKlxuICog5omn6KGMIGNsaWNrIOaTjeS9nFxuICog5pSv5oyBIENTUyBzZWxlY3RvciDlrprkvY0gKyDlj6/pgInnmoTmlofmnKzljLnphY3ov4fmu6RcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUNsaWNrKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnY2xpY2sg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGZpbmRFbGVtZW50KGFjdGlvbi5zZWxlY3RvciwgYWN0aW9uLnRleHQpO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn0ke2FjdGlvbi50ZXh0ID8gYCAodGV4dDogXCIke2FjdGlvbi50ZXh0fVwiKWAgOiAnJ31gIH07XG4gIH1cbiAgKGVsIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGNsaWNrZWQ6IGFjdGlvbi5zZWxlY3RvciB9IH07XG59XG5cbi8qKlxuICog5omn6KGMIHR5cGUg5pON5L2cXG4gKiBmb2N1cyDihpIg5riF56m6IOKGkiDpgJDlrZfovpPlhaUg4oaSIOinpuWPkSBpbnB1dC9jaGFuZ2Ug5LqL5Lu2XG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVUeXBlKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAndHlwZSDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGlmIChhY3Rpb24udmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3R5cGUg5pON5L2c6ZyA6KaBIHZhbHVlIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGZpbmRFbGVtZW50KGFjdGlvbi5zZWxlY3RvcikgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cblxuICAvLyBmb2N1c1xuICBlbC5mb2N1cygpO1xuXG4gIC8vIOa4heepuueOsOacieWAvFxuICBlbC52YWx1ZSA9ICcnO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gIC8vIOiuvue9ruaWsOWAvFxuICAvLyDkvb/nlKggbmF0aXZlIGlucHV0IHNldHRlciDku6Xnoa7kv50gUmVhY3Qg5Y+X5o6n57uE5Lu25Lmf6IO95q2j56Gu5pu05pawXG4gIGNvbnN0IG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihlbCksXG4gICAgJ3ZhbHVlJyxcbiAgKT8uc2V0O1xuXG4gIGlmIChuYXRpdmVJbnB1dFZhbHVlU2V0dGVyKSB7XG4gICAgbmF0aXZlSW5wdXRWYWx1ZVNldHRlci5jYWxsKGVsLCBhY3Rpb24udmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGVsLnZhbHVlID0gYWN0aW9uLnZhbHVlO1xuICB9XG5cbiAgLy8g6Kem5Y+R5LqL5Lu2XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgdHlwZWQ6IGFjdGlvbi52YWx1ZSwgc2VsZWN0b3I6IGFjdGlvbi5zZWxlY3RvciB9IH07XG59XG5cbi8qKlxuICog5omn6KGMIHNjcm9sbCDmk43kvZxcbiAqIOaUr+aMgSB0by10b3AgLyB0by1ib3R0b20gLyBieS1waXhlbHMgLyB0by1lbGVtZW50IOWbm+enjeaooeW8j1xuICovXG5mdW5jdGlvbiBleGVjdXRlU2Nyb2xsKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGNvbnN0IG1vZGUgPSBhY3Rpb24uc2Nyb2xsTW9kZSB8fCAnYnktcGl4ZWxzJztcblxuICBzd2l0Y2ggKG1vZGUpIHtcbiAgICBjYXNlICd0by10b3AnOlxuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHNjcm9sbGVkOiAndG8tdG9wJyB9IH07XG5cbiAgICBjYXNlICd0by1ib3R0b20nOlxuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ3RvLWJvdHRvbScgfSB9O1xuXG4gICAgY2FzZSAnYnktcGl4ZWxzJzoge1xuICAgICAgY29uc3QgcGl4ZWxzID0gYWN0aW9uLnNjcm9sbFBpeGVscyB8fCAzMDA7XG4gICAgICB3aW5kb3cuc2Nyb2xsQnkoeyB0b3A6IHBpeGVscywgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ2J5LXBpeGVscycsIHBpeGVscyB9IH07XG4gICAgfVxuXG4gICAgY2FzZSAndG8tZWxlbWVudCc6IHtcbiAgICAgIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ3Njcm9sbCB0by1lbGVtZW50IOaooeW8j+mcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gICAgICB9XG4gICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gICAgICB9XG4gICAgICBlbC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInIH0pO1xuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBzY3JvbGxlZDogJ3RvLWVsZW1lbnQnLCBzZWxlY3RvcjogYWN0aW9uLnNlbGVjdG9yIH0gfTtcbiAgICB9XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5LiN5pSv5oyB55qE5rua5Yqo5qih5byPOiAke21vZGV9YCB9O1xuICB9XG59XG5cbi8qKlxuICog5omn6KGMIHF1ZXJ5U2VsZWN0b3Ig5pON5L2cXG4gKiDov5Tlm57ljLnphY3lhYPntKDnmoQgdGFnTmFtZS9pZC9jbGFzc05hbWUvdGV4dENvbnRlbnQvaHJlZi9zcmMg562J5bGe5oCnXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVRdWVyeVNlbGVjdG9yKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAncXVlcnlTZWxlY3RvciDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IpO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogZXh0cmFjdEVsZW1lbnRJbmZvKGVsKSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBxdWVyeVNlbGVjdG9yQWxsIOaTjeS9nFxuICog6L+U5Zue5omA5pyJ5Yy56YWN5YWD57Sg55qE5bGe5oCn5pWw57uEXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVRdWVyeVNlbGVjdG9yQWxsKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAncXVlcnlTZWxlY3RvckFsbCDmk43kvZzpnIDopoEgc2VsZWN0b3Ig5Y+C5pWwJyB9O1xuICB9XG4gIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhY3Rpb24uc2VsZWN0b3IpO1xuICBjb25zdCByZXN1bHRzOiBFbGVtZW50SW5mb1tdID0gW107XG4gIC8vIOacgOWkmui/lOWbniBtYXhDb3VudCDkuKrlhYPntKDvvIjpu5jorqQgNTDvvInvvIzpmLLmraLmlbDmja7ov4flpKdcbiAgY29uc3QgbGltaXQgPSBNYXRoLm1pbihlbGVtZW50cy5sZW5ndGgsIGFjdGlvbi5tYXhDb3VudCB8fCA1MCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGltaXQ7IGkrKykge1xuICAgIHJlc3VsdHMucHVzaChleHRyYWN0RWxlbWVudEluZm8oZWxlbWVudHNbaV0pKTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGNvdW50OiBlbGVtZW50cy5sZW5ndGgsIGVsZW1lbnRzOiByZXN1bHRzIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgZ2V0VGV4dENvbnRlbnQg5pON5L2cXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVHZXRUZXh0Q29udGVudChhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBBY3Rpb25SZXN1bHQge1xuICBpZiAoIWFjdGlvbi5zZWxlY3Rvcikge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2dldFRleHRDb250ZW50IOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3Rvcik7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHRleHRDb250ZW50OiAoZWwgYXMgSFRNTEVsZW1lbnQpLnRleHRDb250ZW50Py50cmltKCkgfHwgJycgfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRBdHRyaWJ1dGUg5pON5L2cXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVHZXRBdHRyaWJ1dGUoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdnZXRBdHRyaWJ1dGUg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBpZiAoIWFjdGlvbi5hdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnZ2V0QXR0cmlidXRlIOaTjeS9nOmcgOimgSBhdHRyaWJ1dGVOYW1lIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgaWYgKCFlbCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgYXR0cmlidXRlOiBhY3Rpb24uYXR0cmlidXRlTmFtZSwgdmFsdWU6IGVsLmdldEF0dHJpYnV0ZShhY3Rpb24uYXR0cmlidXRlTmFtZSkgfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRWYWx1ZSDmk43kvZxcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUdldFZhbHVlKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnZ2V0VmFsdWUg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcbiAgaWYgKCFlbCkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgdmFsdWU6IGVsLnZhbHVlIHx8ICcnIH0gfTtcbn1cblxuLyoqXG4gKiDmiafooYwgd2FpdEZvckVsZW1lbnQg5pON5L2cXG4gKiDkvb/nlKggTXV0YXRpb25PYnNlcnZlciDnrYnlvoXlhYPntKDlh7rnjrBcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVdhaXRGb3JFbGVtZW50KGFjdGlvbjogQnJvd3NlckFjdGlvbik6IFByb21pc2U8QWN0aW9uUmVzdWx0PiB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnd2FpdEZvckVsZW1lbnQg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuXG4gIGNvbnN0IHRpbWVvdXQgPSBhY3Rpb24udGltZW91dCB8fCA1MDAwO1xuXG4gIC8vIOWFiOajgOafpeWFg+e0oOaYr+WQpuW3suWtmOWcqFxuICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKTtcbiAgaWYgKGV4aXN0aW5nKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogZXh0cmFjdEVsZW1lbnRJbmZvKGV4aXN0aW5nKSB9O1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlPEFjdGlvblJlc3VsdD4oKHJlc29sdmUpID0+IHtcbiAgICBsZXQgcmVzb2x2ZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3RvciEpO1xuICAgICAgaWYgKGVsICYmICFyZXNvbHZlZCkge1xuICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgcmVzb2x2ZSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGV4dHJhY3RFbGVtZW50SW5mbyhlbCkgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuXG4gICAgLy8g6LaF5pe25aSE55CGXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXJlc29sdmVkKSB7XG4gICAgICAgIHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg562J5b6F5YWD57Sg6LaF5pe2ICgke3RpbWVvdXR9bXMpOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH0pO1xuICAgICAgfVxuICAgIH0sIHRpbWVvdXQpO1xuICB9KTtcbn1cblxuLyoqXG4gKiDmiafooYwgaGlnaGxpZ2h0IOaTjeS9nFxuICog5Li655uu5qCH5YWD57Sg5re75Yqg5Li05pe26auY5Lqu6L655qGGXG4gKi9cbmZ1bmN0aW9uIGV4ZWN1dGVIaWdobGlnaHQoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgaWYgKCFhY3Rpb24uc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdoaWdobGlnaHQg5pON5L2c6ZyA6KaBIHNlbGVjdG9yIOWPguaVsCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aW9uLnNlbGVjdG9yKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gIGlmICghZWwpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDmnKrmib7liLDlhYPntKA6ICR7YWN0aW9uLnNlbGVjdG9yfWAgfTtcbiAgfVxuXG4gIGNvbnN0IGNvbG9yID0gYWN0aW9uLmhpZ2hsaWdodENvbG9yIHx8ICdyZ2JhKDI1NSwgMTY1LCAwLCAwLjQpJztcbiAgY29uc3QgZHVyYXRpb24gPSBhY3Rpb24uaGlnaGxpZ2h0RHVyYXRpb24gfHwgMjAwMDtcblxuICAvLyDkv53lrZjljp/mnInmoLflvI9cbiAgY29uc3Qgb3JpZ2luYWxPdXRsaW5lID0gZWwuc3R5bGUub3V0bGluZTtcbiAgY29uc3Qgb3JpZ2luYWxCZ0NvbG9yID0gZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuXG4gIC8vIOW6lOeUqOmrmOS6rlxuICBlbC5zdHlsZS5vdXRsaW5lID0gYDNweCBzb2xpZCAke2NvbG9yfWA7XG4gIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuXG4gIC8vIOWumuaXtuaBouWkjVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBlbC5zdHlsZS5vdXRsaW5lID0gb3JpZ2luYWxPdXRsaW5lO1xuICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9yaWdpbmFsQmdDb2xvcjtcbiAgfSwgZHVyYXRpb24pO1xuXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgaGlnaGxpZ2h0ZWQ6IGFjdGlvbi5zZWxlY3RvciwgZHVyYXRpb24gfSB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBldmFsdWF0ZSDmk43kvZxcbiAqIOWcqOmhtemdouS4iuS4i+aWh+S4reaJp+ihjOS7u+aEjyBKYXZhU2NyaXB0IOS7o+eggeW5tui/lOWbnue7k+aenFxuICovXG5hc3luYyBmdW5jdGlvbiBleGVjdXRlRXZhbHVhdGUoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ+IHtcbiAgaWYgKCFhY3Rpb24uZXhwcmVzc2lvbikge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2V2YWx1YXRlIOaTjeS9nOmcgOimgSBleHByZXNzaW9uIOWPguaVsCcgfTtcbiAgfVxuICB0cnkge1xuICAgIC8vIOS9v+eUqCBuZXcgRnVuY3Rpb24g5Lul5L6/5pSv5oyBIHJldHVybiDor63lj6VcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbihhY3Rpb24uZXhwcmVzc2lvbik7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZm4oKTtcbiAgICAvLyDlronlhajluo/liJfljJbvvJp1bmRlZmluZWQg4oaSIG51bGzvvIzlhbbkvZkgSlNPTiDljJZcbiAgICBjb25zdCBzZXJpYWxpemVkID0gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBudWxsIDogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHJlc3VsdDogc2VyaWFsaXplZCB9IH07XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiBgZXZhbHVhdGUg5omn6KGM5aSx6LSlOiAke2VyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKX1gLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiDmiafooYwgc2VsZWN0T3B0aW9uIOaTjeS9nFxuICog6YCa6L+HIHZhbHVlIOaIliB0ZXh0IOmAieaLqSA8c2VsZWN0PiDkuIvmi4nmoYbpgInpobnvvIzop6blj5EgY2hhbmdlIOS6i+S7tlxuICovXG5mdW5jdGlvbiBleGVjdXRlU2VsZWN0T3B0aW9uKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IEFjdGlvblJlc3VsdCB7XG4gIGlmICghYWN0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2VsZWN0T3B0aW9uIOaTjeS9nOmcgOimgSBzZWxlY3RvciDlj4LmlbAnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFjdGlvbi5zZWxlY3RvcikgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBg5pyq5om+5Yiw5YWD57SgOiAke2FjdGlvbi5zZWxlY3Rvcn1gIH07XG4gIH1cbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ3NlbGVjdCcpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDnm67moIflhYPntKDkuI3mmK8gPHNlbGVjdD7vvIzogIzmmK8gPCR7ZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpfT5gIH07XG4gIH1cblxuICBsZXQgbWF0Y2hlZCA9IGZhbHNlO1xuICBjb25zdCBvcHRpb25zID0gZWwub3B0aW9ucztcblxuICBpZiAoYWN0aW9uLm9wdGlvblZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyDmjIkgdmFsdWUg5Yy56YWNXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAob3B0aW9uc1tpXS52YWx1ZSA9PT0gYWN0aW9uLm9wdGlvblZhbHVlKSB7XG4gICAgICAgIGVsLnNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGFjdGlvbi5vcHRpb25UZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyDmjInlj6/op4HmlofmnKzljLnphY1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChvcHRpb25zW2ldLnRleHQudHJpbSgpID09PSBhY3Rpb24ub3B0aW9uVGV4dC50cmltKCkpIHtcbiAgICAgICAgZWwuc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgIG1hdGNoZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnc2VsZWN0T3B0aW9uIOmcgOimgSBvcHRpb25WYWx1ZSDmiJYgb3B0aW9uVGV4dCDlj4LmlbAnIH07XG4gIH1cblxuICBpZiAoIW1hdGNoZWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBlcnJvcjogYOacquaJvuWIsOWMuemFjeeahOmAiemhuTogJHthY3Rpb24ub3B0aW9uVmFsdWUgIT09IHVuZGVmaW5lZCA/IGB2YWx1ZT1cIiR7YWN0aW9uLm9wdGlvblZhbHVlfVwiYCA6IGB0ZXh0PVwiJHthY3Rpb24ub3B0aW9uVGV4dH1cImB9YCxcbiAgICB9O1xuICB9XG5cbiAgLy8g6Kem5Y+RIGNoYW5nZSDkuovku7ZcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG5cbiAgY29uc3Qgc2VsZWN0ZWQgPSBvcHRpb25zW2VsLnNlbGVjdGVkSW5kZXhdO1xuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgZGF0YToge1xuICAgICAgc2VsZWN0ZWRJbmRleDogZWwuc2VsZWN0ZWRJbmRleCxcbiAgICAgIHNlbGVjdGVkVmFsdWU6IHNlbGVjdGVkLnZhbHVlLFxuICAgICAgc2VsZWN0ZWRUZXh0OiBzZWxlY3RlZC50ZXh0LnRyaW0oKSxcbiAgICB9LFxuICB9O1xufVxuXG4vKipcbiAqIOaJp+ihjCBnZXRMaW5rcyDmk43kvZxcbiAqIOaPkOWPlumhtemdouS4reaJgOacieWQqyBocmVmIOeahCA8YT4g5YWD57Sg77yM6L+U5ZueIHsgaHJlZiwgdGV4dCB9IOaVsOe7hFxuICovXG5mdW5jdGlvbiBleGVjdXRlR2V0TGlua3MoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgY29uc3QgbWF4Q291bnQgPSBhY3Rpb24ubWF4Q291bnQgfHwgMTAwO1xuICBjb25zdCBzY29wZSA9IGFjdGlvbi5zZWxlY3RvclxuICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2VsZWN0b3IpXG4gICAgOiBkb2N1bWVudDtcblxuICBpZiAoYWN0aW9uLnNlbGVjdG9yICYmICFzY29wZSkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOiMg+WbtOWFg+e0oDogJHthY3Rpb24uc2VsZWN0b3J9YCB9O1xuICB9XG5cbiAgY29uc3QgYW5jaG9ycyA9IChzY29wZSB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXScpO1xuICBjb25zdCBsaW5rczogQXJyYXk8eyBocmVmOiBzdHJpbmc7IHRleHQ6IHN0cmluZyB9PiA9IFtdO1xuICBjb25zdCBsaW1pdCA9IE1hdGgubWluKGFuY2hvcnMubGVuZ3RoLCBtYXhDb3VudCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW1pdDsgaSsrKSB7XG4gICAgY29uc3QgYSA9IGFuY2hvcnNbaV0gYXMgSFRNTEFuY2hvckVsZW1lbnQ7XG4gICAgbGlua3MucHVzaCh7XG4gICAgICBocmVmOiBhLmhyZWYsXG4gICAgICB0ZXh0OiAoYS50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpLnNsaWNlKDAsIDIwMCksXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgZGF0YTogeyB0b3RhbEZvdW5kOiBhbmNob3JzLmxlbmd0aCwgcmV0dXJuZWQ6IGxpbmtzLmxlbmd0aCwgbGlua3MgfSxcbiAgfTtcbn1cblxuLy8g4pSA4pSAIGV2b192MTlfMDAxOiDmsonmtbjlvI/nv7vor5Eg4oCUIOauteiQveaPkOWPliArIOWPjOivreazqOWFpSDilIDilIBcblxuLyoqIOmcgOimgei3s+i/h+eahOagh+etvu+8iOWvvOiIquOAgeiEmuacrOOAgeagt+W8j+OAgeW5v+WRiuetie+8iSAqL1xuY29uc3QgSU1UX1NLSVBfVEFHUyA9IG5ldyBTZXQoW1xuICAnc2NyaXB0JywgJ3N0eWxlJywgJ25vc2NyaXB0JywgJ2lmcmFtZScsICdzdmcnLCAnY2FudmFzJyxcbiAgJ25hdicsICdmb290ZXInLCAnaGVhZGVyJywgJ2FzaWRlJywgJ2Zvcm0nLCAnYnV0dG9uJyxcbiAgJ2lucHV0JywgJ3RleHRhcmVhJywgJ3NlbGVjdCcsICdsYWJlbCcsXG5dKTtcblxuLyoqIOWGheWuueauteiQveagh+etviAqL1xuY29uc3QgSU1UX1BBUkFHUkFQSF9UQUdTID0gbmV3IFNldChbXG4gICdwJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JyxcbiAgJ2xpJywgJ2Jsb2NrcXVvdGUnLCAndGQnLCAndGgnLCAnZHQnLCAnZGQnLFxuICAnZmlnY2FwdGlvbicsICdjYXB0aW9uJywgJ3N1bW1hcnknLCAncHJlJyxcbl0pO1xuXG4vKipcbiAqIOihjOWGheaWh+acrOWPtuiKgueCueagh+etviDigJQg5pm66IO95Y+26IqC54K55o+Q5Y+WKGlubGluZSBsZWFmIGV4dHJhY3Rpb24pXG4gKiDlvZPmrrXokL3nuqflrrnlmago5aaCIDx0ZD4p5YaF5ZCr6L+Z5Lqb6KGM5YaF5YWD57Sg5pe277yM5LyY5YWI5o+Q5Y+W5Y+26IqC54K56ICM6Z2e5pW05Liq5a655ZmoXG4gKiDpgILnlKjkuo4gSE4gdGl0bGVsaW5lIDxhPiDnrYnlnLrmma/vvIzmj5Dlj5bnspLluqbku44gPHRkPiDpmY3liLAgPGE+LzxzcGFuPiDnuqfliKtcbiAqL1xuY29uc3QgSU1UX0lOTElORV9MRUFGX1RBR1MgPSBuZXcgU2V0KFtcbiAgJ2EnLCAnc3BhbicsICdlbScsICdzdHJvbmcnLCAnYicsICdpJywgJ21hcmsnLCAnY29kZScsICdsYWJlbCcsICd0aW1lJyxcbl0pO1xuXG4vKipcbiAqIOiHquWKqOajgOa1i+mhtemdouS4u+WGheWuueWMuuWfn1xuICog5LyY5YWI57qnOiBhcnRpY2xlID4gbWFpbiA+IFtyb2xlPVwibWFpblwiXSA+IOihqOagvOW4g+WxgChpdGVtbGlzdCkgPiAuY29udGVudC8ucG9zdC8uYXJ0aWNsZSA+IGJvZHlcbiAqXG4gKiDooajmoLzluIPlsYDmlK/mjIHvvJpITiDnrYnnq5nngrnkvb/nlKggdGFibGUuaXRlbWxpc3Qg5L2c5Li65YaF5a655a655Zmo77yMXG4gKiDpnIDopoHmmL7lvI/or4bliKvmiY3og73mraPnoa7ov5vlhaXooajmoLzlhoXpg6jmj5Dlj5ZcbiAqL1xuZnVuY3Rpb24gZGV0ZWN0TWFpbkNvbnRlbnQoKTogRWxlbWVudCB7XG4gIGNvbnN0IGNhbmRpZGF0ZXMgPSBbXG4gICAgJ2FydGljbGUnLFxuICAgICdtYWluJyxcbiAgICAnW3JvbGU9XCJtYWluXCJdJyxcbiAgICAvLyDooajmoLzluIPlsYDmlK/mjIHvvJpITiBpdGVtbGlzdCDnrYnkvb/nlKggPHRhYmxlPiDkvZzkuLrlhoXlrrnlrrnlmajnmoTnq5nngrlcbiAgICAndGFibGUuaXRlbWxpc3QnLFxuICAgICcjaG5tYWluJyxcbiAgICAnLml0ZW1saXN0JyxcbiAgICAnLmNvbnRlbnQnLFxuICAgICcucG9zdCcsXG4gICAgJy5hcnRpY2xlJyxcbiAgICAnLnBvc3QtY29udGVudCcsXG4gICAgJy5lbnRyeS1jb250ZW50JyxcbiAgICAnLmFydGljbGUtY29udGVudCcsXG4gICAgJyNjb250ZW50JyxcbiAgXTtcbiAgZm9yIChjb25zdCBzZWwgb2YgY2FuZGlkYXRlcykge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgIGlmIChlbCAmJiBlbC50ZXh0Q29udGVudCAmJiBlbC50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoID4gMTAwKSB7XG4gICAgICByZXR1cm4gZWw7XG4gICAgfVxuICB9XG4gIHJldHVybiBkb2N1bWVudC5ib2R5O1xufVxuXG4vKipcbiAqIOaZuuiDveWPtuiKgueCueaPkOWPlihsZWFmIG5vZGUgZXh0cmFjdGlvbinvvJrku47mrrXokL3lrrnlmajkuK3mj5Dlj5bmnInmhI/kuYnnmoTooYzlhoXmlofmnKzlhYPntKBcbiAqXG4gKiDlvZPmrrXokL3lrrnlmago5aaCIDx0ZD4p5YaF5ZCrIDxhPi88c3Bhbj4g562J6KGM5YaF5YWD57Sg5pe277yM5o+Q5Y+W5pyA5rex5bGC55qE5Y+26IqC54K577yMXG4gKiDogIzpnZ7mlbTkuKrlrrnlmajmlofmnKzjgILkvovlpoIgSE4g55qEIDx0ZCBjbGFzcz1cInRpdGxlXCI+IOWGheeahCA8YSBjbGFzcz1cInRpdGxlbGluZVwiPuOAglxuICpcbiAqIOS7heWvueihqOagvOWNleWFg+agvCg8dGQ+Lzx0aD4p6Ieq5Yqo5ZCv55So77yb5a+5IDxwPi88bGk+IOetieaZrumAmuauteiQveS/neaMgeaVtOauteaPkOWPluOAglxuICovXG5mdW5jdGlvbiBleHRyYWN0SW5saW5lTGVhZk5vZGVzKGNvbnRhaW5lcjogRWxlbWVudCk6IEVsZW1lbnRbXSB7XG4gIGNvbnN0IGNvbnRhaW5lclRhZyA9IGNvbnRhaW5lci50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8g5LuF5a+56KGo5qC85Y2V5YWD5qC85ZCv55So5pm66IO95Y+26IqC54K55o+Q5Y+W77yM5pmu6YCa5q616JC95L+d5oyB5pW05q61XG4gIGlmIChjb250YWluZXJUYWcgIT09ICd0ZCcgJiYgY29udGFpbmVyVGFnICE9PSAndGgnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0b3JTdHIgPSBBcnJheS5mcm9tKElNVF9JTkxJTkVfTEVBRl9UQUdTKS5qb2luKCcsJyk7XG4gIGNvbnN0IGlubGluZUVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yU3RyKTtcbiAgY29uc3QgbGVhdmVzOiBFbGVtZW50W10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGVsIG9mIGlubGluZUVscykge1xuICAgIGNvbnN0IHRleHQgPSAoZWwudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgICBpZiAodGV4dC5sZW5ndGggPCAyKSB7IGNvbnRpbnVlOyB9XG4gICAgaWYgKGVsLmNsb3Nlc3QoJy5pbXQtdHJhbnNsYXRpb24nKSkgeyBjb250aW51ZTsgfVxuXG4gICAgLy8g5qOA5p+l5piv5ZCm5Li655yf5q2j55qE5Y+26IqC54K577ya5LiN5ZCr5pyJ5a6e6LSo5paH5pys55qE5a2Q6KGM5YaF5YWD57SgXG4gICAgY29uc3QgY2hpbGRJbmxpbmVzID0gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvclN0cik7XG4gICAgbGV0IGhhc1RleHRDaGlsZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRJbmxpbmVzKSB7XG4gICAgICBpZiAoKGNoaWxkLnRleHRDb250ZW50IHx8ICcnKS50cmltKCkubGVuZ3RoID49IDIpIHtcbiAgICAgICAgaGFzVGV4dENoaWxkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g5Y+q5pS26ZuG5Y+26IqC54K577yI5peg5pyJ5oSP5LmJ5a2Q6KGM5YaF5YWD57Sg55qE77yJXG4gICAgaWYgKCFoYXNUZXh0Q2hpbGQpIHtcbiAgICAgIGxlYXZlcy5wdXNoKGVsKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGVhdmVzO1xufVxuXG4vKipcbiAqIOaJp+ihjCBleHRyYWN0UGFyYWdyYXBocyDmk43kvZxcbiAqIOaZuuiDveaPkOWPlumhtemdouauteiQve+8jOS4uuavj+S4quauteiQveiuvue9riBkYXRhLWltdC1pZO+8jOi/lOWbnue7k+aehOWMluaVsOaNrlxuICovXG5mdW5jdGlvbiBleGVjdXRlRXh0cmFjdFBhcmFncmFwaHMoYWN0aW9uOiBCcm93c2VyQWN0aW9uKTogQWN0aW9uUmVzdWx0IHtcbiAgY29uc3Qgc2NvcGUgPSBhY3Rpb24uc2NvcGVTZWxlY3RvclxuICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3Rpb24uc2NvcGVTZWxlY3RvcilcbiAgICA6IGRldGVjdE1haW5Db250ZW50KCk7XG5cbiAgaWYgKCFzY29wZSkge1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOacquaJvuWIsOiMg+WbtOWFg+e0oDogJHthY3Rpb24uc2NvcGVTZWxlY3Rvcn1gIH07XG4gIH1cblxuICBjb25zdCBtYXhDb3VudCA9IGFjdGlvbi5tYXhDb3VudCB8fCAyMDA7XG4gIGNvbnN0IHBhcmFncmFwaHM6IEFycmF5PHsgaWQ6IHN0cmluZzsgdGFnOiBzdHJpbmc7IHRleHQ6IHN0cmluZyB9PiA9IFtdO1xuICBsZXQgaWRDb3VudGVyID0gMDtcblxuICAvLyDpgJLlvZLpgY3ljoYgRE9NIOagke+8jOaPkOWPluWGheWuueauteiQvVxuICAvLyDmmbrog73lj7boioLngrnmj5Dlj5bvvJrlr7nooajmoLzljZXlhYPmoLwoPHRkPi88dGg+KeS8mOWFiOaPkOWPluWGhemDqCA8YT4vPHNwYW4+IOetieihjOWGheWFg+e0oFxuICBmdW5jdGlvbiB3YWxrKG5vZGU6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAocGFyYWdyYXBocy5sZW5ndGggPj0gbWF4Q291bnQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCB0YWcgPSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIOi3s+i/h+S4jeebuOWFs+eahOagh+etvlxuICAgIGlmIChJTVRfU0tJUF9UQUdTLmhhcyh0YWcpKSB7IHJldHVybjsgfVxuXG4gICAgLy8g6Lez6L+H6ZqQ6JeP5YWD57SgXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIGlmIChzdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHwgc3R5bGUudmlzaWJpbGl0eSA9PT0gJ2hpZGRlbicpIHsgcmV0dXJuOyB9XG4gICAgfVxuXG4gICAgLy8g6Lez6L+H5bey5rOo5YWl55qE57+76K+R5q616JC9XG4gICAgaWYgKG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbXQtdHJhbnNsYXRpb24nKSkgeyByZXR1cm47IH1cblxuICAgIC8vIOWmguaenOaYr+auteiQvee6p+agh+etvuS4lOacieacieaViOaWh+acrOWGheWuuVxuICAgIGlmIChJTVRfUEFSQUdSQVBIX1RBR1MuaGFzKHRhZykpIHtcbiAgICAgIGNvbnN0IHRleHQgPSAobm9kZS50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICAgICAgLy8g6Lez6L+H56m65q616JC95ZKM5p6B55+t5q616JC977yI5bCR5LqOMuWtl+espu+8iVxuICAgICAgaWYgKHRleHQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgLy8g4pSA4pSAIOaZuuiDveWPtuiKgueCueaPkOWPliDilIDilIBcbiAgICAgICAgLy8g5a+56KGo5qC85Y2V5YWD5qC8KDx0ZD4vPHRoPinvvIzkvJjlhYjmj5Dlj5blhoXpg6jnmoTooYzlhoXmlofmnKzlj7boioLngrkoPGE+LzxzcGFuPuetiSlcbiAgICAgICAgLy8g5L6L5aaCIEhOIOeahCB0aXRsZWxpbmUgPGE+IOagh+mimOmTvuaOpe+8jOiAjOmdnuaVtOS4qiA8dGQ+IOWNleWFg+agvOaWh+acrFxuICAgICAgICBjb25zdCBsZWFmTm9kZXMgPSBleHRyYWN0SW5saW5lTGVhZk5vZGVzKG5vZGUpO1xuICAgICAgICBpZiAobGVhZk5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGxlYWYgb2YgbGVhZk5vZGVzKSB7XG4gICAgICAgICAgICBpZiAocGFyYWdyYXBocy5sZW5ndGggPj0gbWF4Q291bnQpIHsgYnJlYWs7IH1cbiAgICAgICAgICAgIGNvbnN0IGxlYWZUZXh0ID0gKGxlYWYudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChsZWFmVGV4dC5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICBjb25zdCBpZCA9IGBpbXQtJHtpZENvdW50ZXIrK31gO1xuICAgICAgICAgICAgICBsZWFmLnNldEF0dHJpYnV0ZSgnZGF0YS1pbXQtaWQnLCBpZCk7XG4gICAgICAgICAgICAgIHBhcmFncmFwaHMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgdGFnOiBsZWFmLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBsZWFmVGV4dC5zbGljZSgwLCAyMDAwKSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjsgLy8g5Y+26IqC54K55bey5o+Q5Y+W77yM5LiN5YaN5pW05q615o+Q5Y+WXG4gICAgICAgIH1cblxuICAgICAgICAvLyDml6Dlj7boioLngrkg4oaSIOaVtOauteaPkOWPlu+8iOWOn+mAu+i+ke+8iVxuICAgICAgICBjb25zdCBpZCA9IGBpbXQtJHtpZENvdW50ZXIrK31gO1xuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS1pbXQtaWQnLCBpZCk7XG4gICAgICAgIHBhcmFncmFwaHMucHVzaCh7IGlkLCB0YWcsIHRleHQ6IHRleHQuc2xpY2UoMCwgMjAwMCkgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm47IC8vIOS4jeWGjeWQkeS4i+mAkuW9ku+8jOmBv+WFjemHjeWkjeaPkOWPllxuICAgIH1cblxuICAgIC8vIOmdnuauteiQvee6p+agh+etviDihpIg57un57ut5ZCR5LiL6YGN5Y6G5a2Q5YWD57SgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB3YWxrKG5vZGUuY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgfVxuXG4gIHdhbGsoc2NvcGUgYXMgRWxlbWVudCk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdWNjZXNzOiB0cnVlLFxuICAgIGRhdGE6IHtcbiAgICAgIHRvdGFsRXh0cmFjdGVkOiBwYXJhZ3JhcGhzLmxlbmd0aCxcbiAgICAgIHNjb3BlOiBhY3Rpb24uc2NvcGVTZWxlY3RvciB8fCAnKGF1dG8tZGV0ZWN0ZWQpJyxcbiAgICAgIHBhcmFncmFwaHMsXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqIOayiea1uOW8j+e/u+ivkeazqOWFpeagt+W8j++8iOWPquazqOWFpeS4gOasoe+8iSAqL1xuY29uc3QgSU1UX1NUWUxFX0lEID0gJ2ltdC1iaWxpbmd1YWwtc3R5bGUnO1xuY29uc3QgSU1UX0NTUyA9IGBcbi5pbXQtdHJhbnNsYXRpb24ge1xuICBtYXJnaW46IDRweCAwIDEycHggMDtcbiAgcGFkZGluZzogNnB4IDEycHg7XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgIzQyODdmNTtcbiAgYmFja2dyb3VuZDogcmdiYSg2NiwgMTM1LCAyNDUsIDAuMDYpO1xuICBjb2xvcjogIzU1NTtcbiAgZm9udC1zaXplOiAwLjk1ZW07XG4gIGxpbmUtaGVpZ2h0OiAxLjY7XG4gIGJvcmRlci1yYWRpdXM6IDAgNHB4IDRweCAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4uaW10LXRyYW5zbGF0aW9uLmltdC1oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuYDtcblxuLyoqXG4gKiDnoa7kv53msonmtbjlvI/nv7vor5HmoLflvI/lt7Lms6jlhaVcbiAqL1xuZnVuY3Rpb24gZW5zdXJlSW10U3R5bGUoKTogdm9pZCB7XG4gIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoSU1UX1NUWUxFX0lEKSkge1xuICAgIGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWwuaWQgPSBJTVRfU1RZTEVfSUQ7XG4gICAgc3R5bGVFbC50ZXh0Q29udGVudCA9IElNVF9DU1M7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcbiAgfVxufVxuXG4vKipcbiAqIOaJp+ihjCBpbmplY3RCaWxpbmd1YWwg5pON5L2cXG4gKiDmlK/mjIHkuInnp43mqKHlvI86IGluamVjdO+8iOazqOWFpee/u+ivke+8iS8gdG9nZ2xl77yI5YiH5o2i5pi+56S6L+makOiXj++8iS8gY2xlYXLvvIjmuIXpmaTmiYDmnInnv7vor5HvvIlcbiAqL1xuZnVuY3Rpb24gZXhlY3V0ZUluamVjdEJpbGluZ3VhbChhY3Rpb246IEJyb3dzZXJBY3Rpb24pOiBBY3Rpb25SZXN1bHQge1xuICBjb25zdCBtb2RlID0gYWN0aW9uLmluamVjdE1vZGUgfHwgJ2luamVjdCc7XG5cbiAgc3dpdGNoIChtb2RlKSB7XG4gICAgY2FzZSAnaW5qZWN0Jzoge1xuICAgICAgaWYgKCFhY3Rpb24udHJhbnNsYXRpb25zKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ2luamVjdCDmqKHlvI/pnIDopoEgdHJhbnNsYXRpb25zIOWPguaVsO+8iEpTT04g5a2X56ym5Liy77yJJyB9O1xuICAgICAgfVxuXG4gICAgICBsZXQgaXRlbXM6IEFycmF5PHsgaWQ6IHN0cmluZzsgdHJhbnNsYXRlZDogc3RyaW5nIH0+O1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IHBhcnNlZCA9IEpTT04ucGFyc2UoYWN0aW9uLnRyYW5zbGF0aW9ucyk7XG5cbiAgICAgICAgLy8g6Ziy5b6h5oCn6Ieq5Yqo6Kej5YyF77ya5b2TIHRyYW5zbGF0aW9ucyDkuLoge3RyYW5zbGF0aW9uczpbLi4uXX0g5YyF6KOF5a+56LGh5pe26Ieq5Yqo5o+Q5Y+W5pWw57uEXG4gICAgICAgIGlmIChwYXJzZWQgIT09IG51bGwgJiYgdHlwZW9mIHBhcnNlZCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkocGFyc2VkKSkge1xuICAgICAgICAgIC8vIOajgOa1iyAudHJhbnNsYXRpb25zIOWxnuaAp+aYr+WQpuS4uiBBcnJhee+8jOaYr+WImeiHquWKqOino+WMhVxuICAgICAgICAgIGNvbnN0IGlubmVyID0gKHBhcnNlZCBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikudHJhbnNsYXRpb25zO1xuICAgICAgICAgIGlmIChpbm5lciAmJiBBcnJheS5pc0FycmF5KGlubmVyKSkgeyBwYXJzZWQgPSBpbm5lcjsgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHBhcnNlZCkpIHtcbiAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICd0cmFuc2xhdGlvbnMg5b+F6aG75piv5pWw57uE5oiWIHt0cmFuc2xhdGlvbnM6Wy4uLl19IOWMheijheWvueixoScgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOaUr+aMgSBzdHJpbmdbXSDlubPlnabmlbDnu4TvvJroh6rliqjmjInntKLlvJXkuI4gZGF0YS1pbXQtaWQg5YWD57Sg6YWN5a+5XG4gICAgICAgIC8vIOS+i+WmgiBbXCJzdHIxXCIsXCJzdHIyXCJdIOKGkiBbe2lkOlwiaW10LTBcIix0cmFuc2xhdGVkOlwic3RyMVwifSx7aWQ6XCJpbXQtMVwiLHRyYW5zbGF0ZWQ6XCJzdHIyXCJ9XVxuICAgICAgICBpZiAocGFyc2VkLmxlbmd0aCA+IDAgJiYgdHlwZW9mIHBhcnNlZFswXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpdGVtcyA9IChwYXJzZWQgYXMgc3RyaW5nW10pLm1hcCgodGV4dCwgaWR4KSA9PiAoe1xuICAgICAgICAgICAgaWQ6IGBpbXQtJHtpZHh9YCxcbiAgICAgICAgICAgIHRyYW5zbGF0ZWQ6IHRleHQsXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1zID0gcGFyc2VkO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAndHJhbnNsYXRpb25zIOWPguaVsCBKU09OIOino+aekOWksei0pScgfTtcbiAgICAgIH1cblxuICAgICAgZW5zdXJlSW10U3R5bGUoKTtcblxuICAgICAgLy8g4pSA4pSAIGV2b192MjNfMDAzOiDoh6rliqjph43moIforrDlhZzlupUg4pSA4pSAXG4gICAgICAvLyDlvZMgZGF0YS1pbXQtaWQg5YWD57Sg5YWo6YOo57y65aSx5pe277yIU1BBIOmHjea4suafkyAvIHRhYiDliIfmjaLlr7zoh7QgRE9NIOmHjeW7uu+8ie+8jFxuICAgICAgLy8g6Ieq5Yqo6YeN5paw6LCD55SoIGV4dHJhY3RQYXJhZ3JhcGhzIOagh+iusOauteiQve+8jOWGjeaMiee0ouW8lemFjeWvueazqOWFpee/u+ivkVxuICAgICAgbGV0IGF1dG9SZW1hcmtEb25lID0gZmFsc2U7XG4gICAgICBjb25zdCBleGlzdGluZ01hcmtlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWltdC1pZF0nKS5sZW5ndGg7XG4gICAgICBpZiAoZXhpc3RpbmdNYXJrZWQgPT09IDAgJiYgaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnW2ltdF0g6Ieq5Yqo6YeN5qCH6K6w77yaZGF0YS1pbXQtaWQg5YWD57Sg5YWo6YOo57y65aSx77yM6YeN5paw5o+Q5Y+W5q616JC95bm25qCH6K6wJyk7XG4gICAgICAgIGNvbnN0IHJlRXh0cmFjdFJlc3VsdCA9IGV4ZWN1dGVFeHRyYWN0UGFyYWdyYXBocyh7IHR5cGU6ICdleHRyYWN0UGFyYWdyYXBocycgfSk7XG4gICAgICAgIGlmIChyZUV4dHJhY3RSZXN1bHQuc3VjY2VzcyAmJiByZUV4dHJhY3RSZXN1bHQuZGF0YSkge1xuICAgICAgICAgIGNvbnN0IHJlRGF0YSA9IHJlRXh0cmFjdFJlc3VsdC5kYXRhIGFzIHsgdG90YWxFeHRyYWN0ZWQ6IG51bWJlcjsgcGFyYWdyYXBoczogQXJyYXk8eyBpZDogc3RyaW5nOyB0YWc6IHN0cmluZzsgdGV4dDogc3RyaW5nIH0+IH07XG4gICAgICAgICAgY29uc29sZS5sb2coYFtpbXRdIOiHquWKqOmHjeagh+iusOWujOaIkO+8mumHjeaWsOagh+iusOS6hiAke3JlRGF0YS50b3RhbEV4dHJhY3RlZH0g5Liq5q616JC9YCk7XG4gICAgICAgICAgYXV0b1JlbWFya0RvbmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybignW2ltdF0g6Ieq5Yqo6YeN5qCH6K6w5aSx6LSl77yaJywgcmVFeHRyYWN0UmVzdWx0LmVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgaW5qZWN0ZWQgPSAwO1xuICAgICAgbGV0IHNraXBwZWQgPSAwO1xuXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgaWYgKCFpdGVtLmlkIHx8ICFpdGVtLnRyYW5zbGF0ZWQpIHtcbiAgICAgICAgICBza2lwcGVkKys7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcmlnaW5hbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWltdC1pZD1cIiR7aXRlbS5pZH1cIl1gKTtcbiAgICAgICAgaWYgKCFvcmlnaW5hbCkge1xuICAgICAgICAgIHNraXBwZWQrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOmBv+WFjemHjeWkjeazqOWFpe+8muajgOafpeaYr+WQpuW3suacieWQjCBpZCDnmoTnv7vor5FcbiAgICAgICAgY29uc3QgZXhpc3RpbmdUcmFuc2xhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5pbXQtdHJhbnNsYXRpb25bZGF0YS1pbXQtc291cmNlPVwiJHtpdGVtLmlkfVwiXWApO1xuICAgICAgICBpZiAoZXhpc3RpbmdUcmFuc2xhdGlvbikge1xuICAgICAgICAgIC8vIOabtOaWsOeOsOaciee/u+ivkVxuICAgICAgICAgIGV4aXN0aW5nVHJhbnNsYXRpb24udGV4dENvbnRlbnQgPSBpdGVtLnRyYW5zbGF0ZWQ7XG4gICAgICAgICAgZXhpc3RpbmdUcmFuc2xhdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdpbXQtaGlkZGVuJyk7XG4gICAgICAgICAgaW5qZWN0ZWQrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWIm+W7uue/u+ivkeauteiQvVxuICAgICAgICBjb25zdCB0cmFuc2xhdGVkRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdHJhbnNsYXRlZEVsLmNsYXNzTmFtZSA9ICdpbXQtdHJhbnNsYXRpb24nO1xuICAgICAgICB0cmFuc2xhdGVkRWwuc2V0QXR0cmlidXRlKCdkYXRhLWltdC1zb3VyY2UnLCBpdGVtLmlkKTtcbiAgICAgICAgdHJhbnNsYXRlZEVsLnRleHRDb250ZW50ID0gaXRlbS50cmFuc2xhdGVkO1xuXG4gICAgICAgIC8vIOaPkuWFpeWIsOWOn+aWh+auteiQveS5i+WQjlxuICAgICAgICBvcmlnaW5hbC5wYXJlbnROb2RlPy5pbnNlcnRCZWZvcmUodHJhbnNsYXRlZEVsLCBvcmlnaW5hbC5uZXh0U2libGluZyk7XG4gICAgICAgIGluamVjdGVkKys7XG4gICAgICB9XG5cbiAgICAgIC8vIOKUgOKUgCBldm9fdjIzXzAwNDog5rOo5YWl57uT5p6c6K+K5pat5aKe5by6IOKUgOKUgFxuICAgICAgLy8gaW5qZWN0ZWQ9MCDkuJQgc2tpcHBlZD4wIOaXtumZhOWKoOiviuaWreS/oeaBr++8jOW4ruWKqeeUqOaIty9BZ2VudCDnkIbop6PlpLHotKXljp/lm6BcbiAgICAgIGxldCBkaWFnbm9zdGljOiB7IHBvc3NpYmxlQ2F1c2VzOiBzdHJpbmdbXTsgc3VnZ2VzdGVkQWN0aW9uczogc3RyaW5nW10gfSB8IHVuZGVmaW5lZDtcbiAgICAgIGlmIChpbmplY3RlZCA9PT0gMCAmJiBza2lwcGVkID4gMCkge1xuICAgICAgICBjb25zdCBwb3NzaWJsZUNhdXNlczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGVkQWN0aW9uczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICBpZiAoYXV0b1JlbWFya0RvbmUpIHtcbiAgICAgICAgICAvLyDoh6rliqjph43moIforrDlt7LmiafooYzkvYbku43nhLYgaW5qZWN0ZWQ9MCDihpIg57+76K+R5pWw5o2u5LiO6aG16Z2i5q616JC95LiN5Yy56YWNXG4gICAgICAgICAgcG9zc2libGVDYXVzZXMucHVzaChcbiAgICAgICAgICAgICfoh6rliqjph43moIforrDlt7LmiafooYzvvIzkvYbnv7vor5HmlbDmja7kuI7lvZPliY3pobXpnaLmrrXokL3ml6Dms5XljLnphY3vvIjpobXpnaLlhoXlrrnlj6/og73lt7Llj5HnlJ/lj5jljJbvvIknLFxuICAgICAgICAgICk7XG4gICAgICAgICAgc3VnZ2VzdGVkQWN0aW9ucy5wdXNoKCfph43mlrDmiafooYzlrozmlbTnv7vor5HmtYHnqIvvvIhleHRyYWN0UGFyYWdyYXBocyDihpIgdHJhbnNsYXRlIOKGkiBpbmplY3RCaWxpbmd1YWzvvIknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyDmnKrop6blj5Hoh6rliqjph43moIforrAg4oaSIGRhdGEtaW10LWlkIOWtmOWcqOS9hiBpdGVtLmlkIC8gaXRlbS50cmFuc2xhdGVkIOWPr+iDveS4uuepulxuICAgICAgICAgIGNvbnN0IG1hcmtlZENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaW10LWlkXScpLmxlbmd0aDtcbiAgICAgICAgICBpZiAobWFya2VkQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBwb3NzaWJsZUNhdXNlcy5wdXNoKFxuICAgICAgICAgICAgICBg6aG16Z2i5a2Y5ZyoICR7bWFya2VkQ291bnR9IOS4quW3suagh+iusOauteiQve+8jOS9hue/u+ivkeaVsOaNruS4reeahCBpZC90cmFuc2xhdGVkIOWtl+auteWPr+iDvee8uuWkseaIluagvOW8j+S4jeato+ehrmAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgc3VnZ2VzdGVkQWN0aW9ucy5wdXNoKCfmo4Dmn6UgdHJhbnNsYXRpb25zIOaVsOaNruagvOW8j++8muavj+mhuemcgOWMheWQqyB7IGlkOiBcImltdC1OXCIsIHRyYW5zbGF0ZWQ6IFwi57+76K+R5paH5pysXCIgfScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3NzaWJsZUNhdXNlcy5wdXNoKCdUYWIg5YiH5o2i5a+86Ie05bel5YW35omn6KGM5Yiw5LqG5LiN5ZCM6aG16Z2i77yM55uu5qCH6aG16Z2i5pegIGRhdGEtaW10LWlkIOagh+iusCcpO1xuICAgICAgICAgICAgcG9zc2libGVDYXVzZXMucHVzaCgnU1BBIOmhtemdoumHjea4suafk+WvvOiHtOS5i+WJjeagh+iusOeahCBET00g6IqC54K56KKr5pu/5o2iJyk7XG4gICAgICAgICAgICBzdWdnZXN0ZWRBY3Rpb25zLnB1c2goJ+ehruS/nee/u+ivkeacn+mXtOS4jeimgeWIh+aNoua1j+iniOWZqOagh+etvumhtScpO1xuICAgICAgICAgICAgc3VnZ2VzdGVkQWN0aW9ucy5wdXNoKCfph43mlrDmiafooYzlrozmlbTnv7vor5HmtYHnqIvvvIhleHRyYWN0UGFyYWdyYXBocyDihpIgdHJhbnNsYXRlIOKGkiBpbmplY3RCaWxpbmd1YWzvvIknKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkaWFnbm9zdGljID0geyBwb3NzaWJsZUNhdXNlcywgc3VnZ2VzdGVkQWN0aW9ucyB9O1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tpbXRdIOiviuaWre+8muazqOWFpeaVsOS4uiAwJywgZGlhZ25vc3RpYyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlOiAnaW5qZWN0JyxcbiAgICAgICAgICBpbmplY3RlZCxcbiAgICAgICAgICBza2lwcGVkLFxuICAgICAgICAgIHRvdGFsOiBpdGVtcy5sZW5ndGgsXG4gICAgICAgICAgLi4uKGF1dG9SZW1hcmtEb25lID8geyBhdXRvUmVtYXJrRG9uZTogdHJ1ZSB9IDoge30pLFxuICAgICAgICAgIC4uLihkaWFnbm9zdGljID8geyBkaWFnbm9zdGljIH0gOiB7fSksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ3RvZ2dsZSc6IHtcbiAgICAgIGNvbnN0IHRyYW5zbGF0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbXQtdHJhbnNsYXRpb24nKTtcbiAgICAgIGlmICh0cmFuc2xhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHsgbW9kZTogJ3RvZ2dsZScsIG1lc3NhZ2U6ICfmsqHmnInlt7Lms6jlhaXnmoTnv7vor5EnLCB0b2dnbGVkOiAwIH0gfTtcbiAgICAgIH1cblxuICAgICAgLy8g5qOA5p+l5b2T5YmN54q25oCB77yI5qC55o2u56ys5LiA5Liq57+76K+R5q616JC95Yik5pat77yJXG4gICAgICBjb25zdCBpc0hpZGRlbiA9IHRyYW5zbGF0aW9uc1swXS5jbGFzc0xpc3QuY29udGFpbnMoJ2ltdC1oaWRkZW4nKTtcblxuICAgICAgdHJhbnNsYXRpb25zLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGlmIChpc0hpZGRlbikge1xuICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ltdC1oaWRkZW4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdpbXQtaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZTogJ3RvZ2dsZScsXG4gICAgICAgICAgbmV3U3RhdGU6IGlzSGlkZGVuID8gJ3Zpc2libGUnIDogJ2hpZGRlbicsXG4gICAgICAgICAgdG9nZ2xlZDogdHJhbnNsYXRpb25zLmxlbmd0aCxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY2FzZSAnY2xlYXInOiB7XG4gICAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW10LXRyYW5zbGF0aW9uJyk7XG4gICAgICBjb25zdCBjb3VudCA9IHRyYW5zbGF0aW9ucy5sZW5ndGg7XG4gICAgICB0cmFuc2xhdGlvbnMuZm9yRWFjaCgoZWwpID0+IGVsLnJlbW92ZSgpKTtcblxuICAgICAgLy8g5ZCM5pe256e76ZmkIGRhdGEtaW10LWlkIOWxnuaAp1xuICAgICAgY29uc3QgdGFnZ2VkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaW10LWlkXScpO1xuICAgICAgdGFnZ2VkLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW10LWlkJykpO1xuXG4gICAgICAvLyDnp7vpmaTmoLflvI9cbiAgICAgIGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChJTVRfU1RZTEVfSUQpO1xuICAgICAgaWYgKHN0eWxlRWwpIHsgc3R5bGVFbC5yZW1vdmUoKTsgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICBkYXRhOiB7IG1vZGU6ICdjbGVhcicsIHJlbW92ZWQ6IGNvdW50IH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGDkuI3mlK/mjIHnmoQgaW5qZWN0QmlsaW5ndWFsIOaooeW8jzogJHttb2RlfWAgfTtcbiAgfVxufVxuXG4vKipcbiAqIOS4u+aJp+ihjOWFpeWPoyDigJQg5qC55o2uIGFjdGlvbi50eXBlIOWIhuWPkeWIsOWvueW6lOaJp+ihjOWHveaVsFxuICpcbiAqIOazqOaEj++8mnNjcmVlbnNob3Qg5pON5L2c6ZyA6KaB5ZyoIGJhY2tncm91bmQgc2NyaXB0IOS4reS9v+eUqCBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYu+8jFxuICogY29udGVudCBzY3JpcHQg5peg5rOV5omn6KGM5q2k5pON5L2c77yM6L+U5Zue54m55q6K5qCH6K6w55SxIGJhY2tncm91bmQg5aSE55CG44CCXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQWN0aW9uKGFjdGlvbjogQnJvd3NlckFjdGlvbik6IFByb21pc2U8QWN0aW9uUmVzdWx0PiB7XG4gIHRyeSB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgY2FzZSAnY2xpY2snOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUNsaWNrKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ3R5cGUnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZVR5cGUoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnc2Nyb2xsJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVTY3JvbGwoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnbmF2aWdhdGUnOlxuICAgICAgICAvLyBuYXZpZ2F0ZSDlnKggY29udGVudCBzY3JpcHQg5Lit6YCa6L+HIGxvY2F0aW9uLmhyZWYg5a6e546wXG4gICAgICAgIGlmICghYWN0aW9uLnVybCkge1xuICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ25hdmlnYXRlIOaTjeS9nOmcgOimgSB1cmwg5Y+C5pWwJyB9O1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYWN0aW9uLnVybDtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogeyBuYXZpZ2F0ZWQ6IGFjdGlvbi51cmwgfSB9O1xuXG4gICAgICBjYXNlICdxdWVyeVNlbGVjdG9yJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVRdWVyeVNlbGVjdG9yKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ3F1ZXJ5U2VsZWN0b3JBbGwnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZVF1ZXJ5U2VsZWN0b3JBbGwoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnZ2V0VGV4dENvbnRlbnQnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUdldFRleHRDb250ZW50KGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ2dldEF0dHJpYnV0ZSc6XG4gICAgICAgIHJldHVybiBleGVjdXRlR2V0QXR0cmlidXRlKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ2dldFZhbHVlJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVHZXRWYWx1ZShhY3Rpb24pO1xuXG4gICAgICBjYXNlICdzY3JlZW5zaG90JzpcbiAgICAgICAgLy8gc2NyZWVuc2hvdCDpnIDopoEgYmFja2dyb3VuZCBzY3JpcHQg5p2D6ZmQ77yMY29udGVudCBzY3JpcHQg6L+U5Zue54m55q6K5qCH6K6wXG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ19fU0NSRUVOU0hPVF9ORUVEU19CQUNLR1JPVU5EX18nIH07XG5cbiAgICAgIGNhc2UgJ3dhaXRGb3JFbGVtZW50JzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVXYWl0Rm9yRWxlbWVudChhY3Rpb24pO1xuXG4gICAgICBjYXNlICdoaWdobGlnaHQnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUhpZ2hsaWdodChhY3Rpb24pO1xuXG4gICAgICBjYXNlICdldmFsdWF0ZSc6XG4gICAgICAgIHJldHVybiBleGVjdXRlRXZhbHVhdGUoYWN0aW9uKTtcblxuICAgICAgY2FzZSAnc2VsZWN0T3B0aW9uJzpcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVTZWxlY3RPcHRpb24oYWN0aW9uKTtcblxuICAgICAgY2FzZSAnZ2V0TGlua3MnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUdldExpbmtzKGFjdGlvbik7XG5cbiAgICAgIC8vIOKUgOKUgCBldm9fdjE5XzAwMTog5rKJ5rW45byP57+76K+R5bel5YW3IOKUgOKUgFxuICAgICAgY2FzZSAnZXh0cmFjdFBhcmFncmFwaHMnOlxuICAgICAgICByZXR1cm4gZXhlY3V0ZUV4dHJhY3RQYXJhZ3JhcGhzKGFjdGlvbik7XG5cbiAgICAgIGNhc2UgJ2luamVjdEJpbGluZ3VhbCc6XG4gICAgICAgIHJldHVybiBleGVjdXRlSW5qZWN0QmlsaW5ndWFsKGFjdGlvbik7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYOS4jeaUr+aMgeeahOaTjeS9nOexu+WeizogJHsoYWN0aW9uIGFzIEJyb3dzZXJBY3Rpb24pLnR5cGV9YCB9O1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IGDmiafooYzmk43kvZwgJHthY3Rpb24udHlwZX0g5aSx6LSlOiAke2VyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKX1gLFxuICAgIH07XG4gIH1cbn1cbiIsIi8vIGNvbnRlbnQudHMg4oCUIENvbnRlbnQgU2NyaXB077yM5rOo5YWl6aG16Z2i6YeH6ZuG5LiK5LiL5paH5L+h5oGv77yIVVJMIC8g5qCH6aKYIC8g6YCJ5Lit5paH5pys77yJXG4vLyDnm5HlkKzmnaXoh6ogYmFja2dyb3VuZCDnmoTkuIrkuIvmlofor7fmsYLvvIzlrp7ml7bph4fpm4blubbov5Tlm55cbi8vIOWinuW8uu+8muaOpeaUtiBFWEVDVVRFX0FDVElPTiDmtojmga/vvIzmiafooYzmtY/op4jlmaggRE9NIOaTjeS9nO+8iGNsaWNrL3R5cGUvc2Nyb2xsIOetie+8iVxuLy8g6aKE5oiq5pat77yac2VsZWN0ZWRUZXh0IOWcqOmHh+mbhua6kOWktOWNs+aIquaWre+8jOmYsuatouS4iuS4i+aWh+eIhueCuFxuXG5pbXBvcnQgeyBleGVjdXRlQWN0aW9uIH0gZnJvbSAnLi4vdXRpbHMvYWN0aW9uLWV4ZWN1dG9yJztcbmltcG9ydCB0eXBlIHsgQnJvd3NlckFjdGlvbiwgQWN0aW9uUmVzdWx0IH0gZnJvbSAnLi4vdXRpbHMvYWN0aW9uLWV4ZWN1dG9yJztcblxuLy8g4pSA4pSA4pSAIOS4iuS4i+aWh+mihOeul+W4uOmHj++8iOS4jiB2c2NvZGUtZXh0L2NvbnRleHQtYnVkZ2V0LnRzIOS/neaMgeS4gOiHtO+8iSDilIDilIDilIBcbmNvbnN0IE1BWF9TRUxFQ1RFRF9URVhUX0NIQVJTID0gODAwMDtcblxuZXhwb3J0IGludGVyZmFjZSBQYWdlQ29udGV4dCB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBzZWxlY3RlZFRleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29udGVudFNjcmlwdCh7XG4gIG1hdGNoZXM6IFsnPGFsbF91cmxzPiddLFxuICBtYWluKCkge1xuICAgIGNvbnNvbGUubG9nKCdbY29udGVudF0gQnJvd3NlciBBZ2VudCBjb250ZW50IHNjcmlwdCBsb2FkZWQgb246JywgbG9jYXRpb24uaHJlZik7XG5cbiAgICAvLyDlk43lupTmnaXoh6ogYmFja2dyb3VuZCAvIHNpZGUgcGFuZWwg55qE5LiK5LiL5paH6K+35rGCXG4gICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgX3NlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS50eXBlID09PSAnR0VUX1BBR0VfQ09OVEVYVCcpIHtcbiAgICAgICAgY29uc3QgcmF3U2VsZWN0ZWQgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk/LnRvU3RyaW5nKCkgfHwgJyc7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IHJhd1NlbGVjdGVkLnN1YnN0cmluZygwLCBNQVhfU0VMRUNURURfVEVYVF9DSEFSUyk7XG4gICAgICAgIGNvbnN0IGNvbnRleHQ6IFBhZ2VDb250ZXh0ID0ge1xuICAgICAgICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICAgICAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUsXG4gICAgICAgICAgc2VsZWN0ZWRUZXh0LFxuICAgICAgICB9O1xuICAgICAgICBpZiAocmF3U2VsZWN0ZWQubGVuZ3RoID4gTUFYX1NFTEVDVEVEX1RFWFRfQ0hBUlMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW2NvbnRlbnRdIHNlbGVjdGVkVGV4dCDlt7LmiKrmlq06JywgcmF3U2VsZWN0ZWQubGVuZ3RoLCAnLT4nLCBNQVhfU0VMRUNURURfVEVYVF9DSEFSUyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ1tjb250ZW50XSDph4fpm4bpobXpnaLkuIrkuIvmloc6JywgY29udGV4dC51cmwsICfpgInkuK3mlofmnKzplb/luqY6JywgY29udGV4dC5zZWxlY3RlZFRleHQubGVuZ3RoKTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHsgdHlwZTogJ1BBR0VfQ09OVEVYVCcsIHBheWxvYWQ6IGNvbnRleHQgfSk7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyDooajnpLrlvILmraXlk43lupRcbiAgICAgIH1cblxuICAgICAgLy8g5rWP6KeI5Zmo5pON5L2c5omn6KGM5byV5pOO5YWl5Y+jXG4gICAgICBpZiAobWVzc2FnZS50eXBlID09PSAnRVhFQ1VURV9BQ1RJT04nKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG1lc3NhZ2UucGF5bG9hZCBhcyBCcm93c2VyQWN0aW9uO1xuICAgICAgICBjb25zb2xlLmxvZygnW2NvbnRlbnRdIOaJp+ihjOa1j+iniOWZqOaTjeS9nDonLCBhY3Rpb24udHlwZSwgYWN0aW9uLnNlbGVjdG9yIHx8ICcnKTtcblxuICAgICAgICAvLyBleGVjdXRlQWN0aW9uIOWPr+iDvei/lOWbniBQcm9taXNl77yI5aaCIHdhaXRGb3JFbGVtZW5077yJ77yM57uf5LiA55SoIGFzeW5jIOWkhOeQhlxuICAgICAgICBleGVjdXRlQWN0aW9uKGFjdGlvbilcbiAgICAgICAgICAudGhlbigocmVzdWx0OiBBY3Rpb25SZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbY29udGVudF0g5pON5L2c57uT5p6cOicsIGFjdGlvbi50eXBlLCByZXN1bHQuc3VjY2Vzcyk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyB0eXBlOiAnQUNUSU9OX1JFU1VMVCcsIHBheWxvYWQ6IHJlc3VsdCB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlcnJvck1zZyA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tjb250ZW50XSDmk43kvZzmiafooYzlvILluLg6JywgYWN0aW9uLnR5cGUsIGVycm9yTXNnKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgIHR5cGU6ICdBQ1RJT05fUkVTVUxUJyxcbiAgICAgICAgICAgICAgcGF5bG9hZDogeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yTXNnIH0gc2F0aXNmaWVzIEFjdGlvblJlc3VsdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8g5byC5q2l5ZON5bqUXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIC8vIOebkeWQrOmAieS4reaWh+acrOWPmOWMlu+8jOS4u+WKqOaOqOmAgee7mSBiYWNrZ3JvdW5k77yI5ZCM5qC36aKE5oiq5pat77yJXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0aW9uY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmF3U2VsZWN0ZWQgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk/LnRvU3RyaW5nKCkgfHwgJyc7XG4gICAgICBpZiAocmF3U2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZFRleHQgPSByYXdTZWxlY3RlZC5zdWJzdHJpbmcoMCwgTUFYX1NFTEVDVEVEX1RFWFRfQ0hBUlMpO1xuICAgICAgICBpZiAocmF3U2VsZWN0ZWQubGVuZ3RoID4gTUFYX1NFTEVDVEVEX1RFWFRfQ0hBUlMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW2NvbnRlbnRdIHNlbGVjdGlvbmNoYW5nZSDmiKrmlq06JywgcmF3U2VsZWN0ZWQubGVuZ3RoLCAnLT4nLCBNQVhfU0VMRUNURURfVEVYVF9DSEFSUyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICB0eXBlOiAnU0VMRUNUSU9OX0NIQU5HRUQnLFxuICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgIHVybDogbG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHRpdGxlOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICAgIHNlbGVjdGVkVGV4dCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgLy8gc2lkZSBwYW5lbCDlj6/og73mnKrmiZPlvIDvvIzlv73nlaVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59KTtcbiIsImZ1bmN0aW9uIHByaW50KG1ldGhvZCwgLi4uYXJncykge1xuICBpZiAoaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09IFwicHJvZHVjdGlvblwiKSByZXR1cm47XG4gIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBhcmdzLnNoaWZ0KCk7XG4gICAgbWV0aG9kKGBbd3h0XSAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgbWV0aG9kKFwiW3d4dF1cIiwgLi4uYXJncyk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBsb2dnZXIgPSB7XG4gIGRlYnVnOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5kZWJ1ZywgLi4uYXJncyksXG4gIGxvZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUubG9nLCAuLi5hcmdzKSxcbiAgd2FybjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUud2FybiwgLi4uYXJncyksXG4gIGVycm9yOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5lcnJvciwgLi4uYXJncylcbn07XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5leHBvcnQgY2xhc3MgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgY29uc3RydWN0b3IobmV3VXJsLCBvbGRVcmwpIHtcbiAgICBzdXBlcihXeHRMb2NhdGlvbkNoYW5nZUV2ZW50LkVWRU5UX05BTUUsIHt9KTtcbiAgICB0aGlzLm5ld1VybCA9IG5ld1VybDtcbiAgICB0aGlzLm9sZFVybCA9IG9sZFVybDtcbiAgfVxuICBzdGF0aWMgRVZFTlRfTkFNRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpsb2NhdGlvbmNoYW5nZVwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbmlxdWVFdmVudE5hbWUoZXZlbnROYW1lKSB7XG4gIHJldHVybiBgJHticm93c2VyPy5ydW50aW1lPy5pZH06JHtpbXBvcnQubWV0YS5lbnYuRU5UUllQT0lOVH06JHtldmVudE5hbWV9YDtcbn1cbiIsImltcG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgfSBmcm9tIFwiLi9jdXN0b20tZXZlbnRzLm1qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcihjdHgpIHtcbiAgbGV0IGludGVydmFsO1xuICBsZXQgb2xkVXJsO1xuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIEVuc3VyZSB0aGUgbG9jYXRpb24gd2F0Y2hlciBpcyBhY3RpdmVseSBsb29raW5nIGZvciBVUkwgY2hhbmdlcy4gSWYgaXQncyBhbHJlYWR5IHdhdGNoaW5nLFxuICAgICAqIHRoaXMgaXMgYSBub29wLlxuICAgICAqL1xuICAgIHJ1bigpIHtcbiAgICAgIGlmIChpbnRlcnZhbCAhPSBudWxsKSByZXR1cm47XG4gICAgICBvbGRVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgaW50ZXJ2YWwgPSBjdHguc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBsZXQgbmV3VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgaWYgKG5ld1VybC5ocmVmICE9PSBvbGRVcmwuaHJlZikge1xuICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgb2xkVXJsKSk7XG4gICAgICAgICAgb2xkVXJsID0gbmV3VXJsO1xuICAgICAgICB9XG4gICAgICB9LCAxZTMpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwid3h0L2Jyb3dzZXJcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuLi8uLi9zYW5kYm94L3V0aWxzL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IGdldFVuaXF1ZUV2ZW50TmFtZSB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuZXhwb3J0IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoY29udGVudFNjcmlwdE5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbnRlbnRTY3JpcHROYW1lID0gY29udGVudFNjcmlwdE5hbWU7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICBpZiAodGhpcy5pc1RvcEZyYW1lKSB7XG4gICAgICB0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cyh7IGlnbm9yZUZpcnN0RXZlbnQ6IHRydWUgfSk7XG4gICAgICB0aGlzLnN0b3BPbGRTY3JpcHRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBTQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXG4gICAgXCJ3eHQ6Y29udGVudC1zY3JpcHQtc3RhcnRlZFwiXG4gICk7XG4gIGlzVG9wRnJhbWUgPSB3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcDtcbiAgYWJvcnRDb250cm9sbGVyO1xuICBsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG4gIHJlY2VpdmVkTWVzc2FnZUlkcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGdldCBzaWduYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuICBhYm9ydChyZWFzb24pIHtcbiAgICByZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcbiAgfVxuICBnZXQgaXNJbnZhbGlkKCkge1xuICAgIGlmIChicm93c2VyLnJ1bnRpbWUuaWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcbiAgfVxuICBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBjb250ZW50IHNjcmlwdCdzIGNvbnRleHQgaXMgaW52YWxpZGF0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lci5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYik7XG4gICAqIGNvbnN0IHJlbW92ZUludmFsaWRhdGVkTGlzdGVuZXIgPSBjdHgub25JbnZhbGlkYXRlZCgoKSA9PiB7XG4gICAqICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG4gICAqIH0pXG4gICAqIC8vIC4uLlxuICAgKiByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyKCk7XG4gICAqL1xuICBvbkludmFsaWRhdGVkKGNiKSB7XG4gICAgdGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGEgcHJvbWlzZSB0aGF0IG5ldmVyIHJlc29sdmVzLiBVc2VmdWwgaWYgeW91IGhhdmUgYW4gYXN5bmMgZnVuY3Rpb24gdGhhdCBzaG91bGRuJ3QgcnVuXG4gICAqIGFmdGVyIHRoZSBjb250ZXh0IGlzIGV4cGlyZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAqICAgaWYgKGN0eC5pc0ludmFsaWQpIHJldHVybiBjdHguYmxvY2soKTtcbiAgICpcbiAgICogICAvLyAuLi5cbiAgICogfVxuICAgKi9cbiAgYmxvY2soKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRJbnRlcnZhbGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHNldEludGVydmFsKGhhbmRsZXIsIHRpbWVvdXQpIHtcbiAgICBjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJJbnRlcnZhbChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRUaW1lb3V0YCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbCB3aGVuIGludmFsaWRhdGVkLlxuICAgKi9cbiAgc2V0VGltZW91dChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJUaW1lb3V0KGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIHJlcXVlc3Qgd2hlblxuICAgKiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjaykge1xuICAgIGNvbnN0IGlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFja2AgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIHJlcXVlc3Qgd2hlblxuICAgKiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHJlcXVlc3RJZGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmICghdGhpcy5zaWduYWwuYWJvcnRlZCkgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSwgb3B0aW9ucyk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICBhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSB0aGlzLmxvY2F0aW9uV2F0Y2hlci5ydW4oKTtcbiAgICB9XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/LihcbiAgICAgIHR5cGUuc3RhcnRzV2l0aChcInd4dDpcIikgPyBnZXRVbmlxdWVFdmVudE5hbWUodHlwZSkgOiB0eXBlLFxuICAgICAgaGFuZGxlcixcbiAgICAgIHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgc2lnbmFsOiB0aGlzLnNpZ25hbFxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBBYm9ydCB0aGUgYWJvcnQgY29udHJvbGxlciBhbmQgZXhlY3V0ZSBhbGwgYG9uSW52YWxpZGF0ZWRgIGxpc3RlbmVycy5cbiAgICovXG4gIG5vdGlmeUludmFsaWRhdGVkKCkge1xuICAgIHRoaXMuYWJvcnQoXCJDb250ZW50IHNjcmlwdCBjb250ZXh0IGludmFsaWRhdGVkXCIpO1xuICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgIGBDb250ZW50IHNjcmlwdCBcIiR7dGhpcy5jb250ZW50U2NyaXB0TmFtZX1cIiBjb250ZXh0IGludmFsaWRhdGVkYFxuICAgICk7XG4gIH1cbiAgc3RvcE9sZFNjcmlwdHMoKSB7XG4gICAgd2luZG93LnBvc3RNZXNzYWdlKFxuICAgICAge1xuICAgICAgICB0eXBlOiBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsXG4gICAgICAgIGNvbnRlbnRTY3JpcHROYW1lOiB0aGlzLmNvbnRlbnRTY3JpcHROYW1lLFxuICAgICAgICBtZXNzYWdlSWQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpXG4gICAgICB9LFxuICAgICAgXCIqXCJcbiAgICApO1xuICB9XG4gIHZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkge1xuICAgIGNvbnN0IGlzU2NyaXB0U3RhcnRlZEV2ZW50ID0gZXZlbnQuZGF0YT8udHlwZSA9PT0gQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFO1xuICAgIGNvbnN0IGlzU2FtZUNvbnRlbnRTY3JpcHQgPSBldmVudC5kYXRhPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZTtcbiAgICBjb25zdCBpc05vdER1cGxpY2F0ZSA9ICF0aGlzLnJlY2VpdmVkTWVzc2FnZUlkcy5oYXMoZXZlbnQuZGF0YT8ubWVzc2FnZUlkKTtcbiAgICByZXR1cm4gaXNTY3JpcHRTdGFydGVkRXZlbnQgJiYgaXNTYW1lQ29udGVudFNjcmlwdCAmJiBpc05vdER1cGxpY2F0ZTtcbiAgfVxuICBsaXN0ZW5Gb3JOZXdlclNjcmlwdHMob3B0aW9ucykge1xuICAgIGxldCBpc0ZpcnN0ID0gdHJ1ZTtcbiAgICBjb25zdCBjYiA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMudmVyaWZ5U2NyaXB0U3RhcnRlZEV2ZW50KGV2ZW50KSkge1xuICAgICAgICB0aGlzLnJlY2VpdmVkTWVzc2FnZUlkcy5hZGQoZXZlbnQuZGF0YS5tZXNzYWdlSWQpO1xuICAgICAgICBjb25zdCB3YXNGaXJzdCA9IGlzRmlyc3Q7XG4gICAgICAgIGlzRmlyc3QgPSBmYWxzZTtcbiAgICAgICAgaWYgKHdhc0ZpcnN0ICYmIG9wdGlvbnM/Lmlnbm9yZUZpcnN0RXZlbnQpIHJldHVybjtcbiAgICAgICAgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgY2IpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiByZW1vdmVFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBjYikpO1xuICB9XG59XG4iLCJjb25zdCBudWxsS2V5ID0gU3ltYm9sKCdudWxsJyk7IC8vIGBvYmplY3RIYXNoZXNgIGtleSBmb3IgbnVsbFxuXG5sZXQga2V5Q291bnRlciA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hbnlLZXlzTWFwIGV4dGVuZHMgTWFwIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX29iamVjdEhhc2hlcyA9IG5ldyBXZWFrTWFwKCk7XG5cdFx0dGhpcy5fc3ltYm9sSGFzaGVzID0gbmV3IE1hcCgpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9lY21hMjYyL2lzc3Vlcy8xMTk0XG5cdFx0dGhpcy5fcHVibGljS2V5cyA9IG5ldyBNYXAoKTtcblxuXHRcdGNvbnN0IFtwYWlyc10gPSBhcmd1bWVudHM7IC8vIE1hcCBjb21wYXRcblx0XHRpZiAocGFpcnMgPT09IG51bGwgfHwgcGFpcnMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgcGFpcnNbU3ltYm9sLml0ZXJhdG9yXSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcih0eXBlb2YgcGFpcnMgKyAnIGlzIG5vdCBpdGVyYWJsZSAoY2Fubm90IHJlYWQgcHJvcGVydHkgU3ltYm9sKFN5bWJvbC5pdGVyYXRvcikpJyk7XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBba2V5cywgdmFsdWVdIG9mIHBhaXJzKSB7XG5cdFx0XHR0aGlzLnNldChrZXlzLCB2YWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0X2dldFB1YmxpY0tleXMoa2V5cywgY3JlYXRlID0gZmFsc2UpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkoa2V5cykpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBrZXlzIHBhcmFtZXRlciBtdXN0IGJlIGFuIGFycmF5Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJpdmF0ZUtleSA9IHRoaXMuX2dldFByaXZhdGVLZXkoa2V5cywgY3JlYXRlKTtcblxuXHRcdGxldCBwdWJsaWNLZXk7XG5cdFx0aWYgKHByaXZhdGVLZXkgJiYgdGhpcy5fcHVibGljS2V5cy5oYXMocHJpdmF0ZUtleSkpIHtcblx0XHRcdHB1YmxpY0tleSA9IHRoaXMuX3B1YmxpY0tleXMuZ2V0KHByaXZhdGVLZXkpO1xuXHRcdH0gZWxzZSBpZiAoY3JlYXRlKSB7XG5cdFx0XHRwdWJsaWNLZXkgPSBbLi4ua2V5c107IC8vIFJlZ2VuZXJhdGUga2V5cyBhcnJheSB0byBhdm9pZCBleHRlcm5hbCBpbnRlcmFjdGlvblxuXHRcdFx0dGhpcy5fcHVibGljS2V5cy5zZXQocHJpdmF0ZUtleSwgcHVibGljS2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge3ByaXZhdGVLZXksIHB1YmxpY0tleX07XG5cdH1cblxuXHRfZ2V0UHJpdmF0ZUtleShrZXlzLCBjcmVhdGUgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHByaXZhdGVLZXlzID0gW107XG5cdFx0Zm9yIChsZXQga2V5IG9mIGtleXMpIHtcblx0XHRcdGlmIChrZXkgPT09IG51bGwpIHtcblx0XHRcdFx0a2V5ID0gbnVsbEtleTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaGFzaGVzID0gdHlwZW9mIGtleSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGtleSA9PT0gJ2Z1bmN0aW9uJyA/ICdfb2JqZWN0SGFzaGVzJyA6ICh0eXBlb2Yga2V5ID09PSAnc3ltYm9sJyA/ICdfc3ltYm9sSGFzaGVzJyA6IGZhbHNlKTtcblxuXHRcdFx0aWYgKCFoYXNoZXMpIHtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaChrZXkpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzW2hhc2hlc10uaGFzKGtleSkpIHtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaCh0aGlzW2hhc2hlc10uZ2V0KGtleSkpO1xuXHRcdFx0fSBlbHNlIGlmIChjcmVhdGUpIHtcblx0XHRcdFx0Y29uc3QgcHJpdmF0ZUtleSA9IGBAQG1rbS1yZWYtJHtrZXlDb3VudGVyKyt9QEBgO1xuXHRcdFx0XHR0aGlzW2hhc2hlc10uc2V0KGtleSwgcHJpdmF0ZUtleSk7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2gocHJpdmF0ZUtleSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHByaXZhdGVLZXlzKTtcblx0fVxuXG5cdHNldChrZXlzLCB2YWx1ZSkge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzLCB0cnVlKTtcblx0XHRyZXR1cm4gc3VwZXIuc2V0KHB1YmxpY0tleSwgdmFsdWUpO1xuXHR9XG5cblx0Z2V0KGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIHN1cGVyLmdldChwdWJsaWNLZXkpO1xuXHR9XG5cblx0aGFzKGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIHN1cGVyLmhhcyhwdWJsaWNLZXkpO1xuXHR9XG5cblx0ZGVsZXRlKGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5LCBwcml2YXRlS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIEJvb2xlYW4ocHVibGljS2V5ICYmIHN1cGVyLmRlbGV0ZShwdWJsaWNLZXkpICYmIHRoaXMuX3B1YmxpY0tleXMuZGVsZXRlKHByaXZhdGVLZXkpKTtcblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdHN1cGVyLmNsZWFyKCk7XG5cdFx0dGhpcy5fc3ltYm9sSGFzaGVzLmNsZWFyKCk7XG5cdFx0dGhpcy5fcHVibGljS2V5cy5jbGVhcigpO1xuXHR9XG5cblx0Z2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuXHRcdHJldHVybiAnTWFueUtleXNNYXAnO1xuXHR9XG5cblx0Z2V0IHNpemUoKSB7XG5cdFx0cmV0dXJuIHN1cGVyLnNpemU7XG5cdH1cbn1cbiIsImltcG9ydCBNYW55S2V5c01hcCBmcm9tICdtYW55LWtleXMtbWFwJztcbmltcG9ydCB7IGRlZnUgfSBmcm9tICdkZWZ1JztcbmltcG9ydCB7IGlzRXhpc3QgfSBmcm9tICcuL2RldGVjdG9ycy5tanMnO1xuXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9ICgpID0+ICh7XG4gIHRhcmdldDogZ2xvYmFsVGhpcy5kb2N1bWVudCxcbiAgdW5pZnlQcm9jZXNzOiB0cnVlLFxuICBkZXRlY3RvcjogaXNFeGlzdCxcbiAgb2JzZXJ2ZUNvbmZpZ3M6IHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gIH0sXG4gIHNpZ25hbDogdm9pZCAwLFxuICBjdXN0b21NYXRjaGVyOiB2b2lkIDBcbn0pO1xuY29uc3QgbWVyZ2VPcHRpb25zID0gKHVzZXJTaWRlT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIGRlZnUodXNlclNpZGVPcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG59O1xuXG5jb25zdCB1bmlmeUNhY2hlID0gbmV3IE1hbnlLZXlzTWFwKCk7XG5mdW5jdGlvbiBjcmVhdGVXYWl0RWxlbWVudChpbnN0YW5jZU9wdGlvbnMpIHtcbiAgY29uc3QgeyBkZWZhdWx0T3B0aW9ucyB9ID0gaW5zdGFuY2VPcHRpb25zO1xuICByZXR1cm4gKHNlbGVjdG9yLCBvcHRpb25zKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgdGFyZ2V0LFxuICAgICAgdW5pZnlQcm9jZXNzLFxuICAgICAgb2JzZXJ2ZUNvbmZpZ3MsXG4gICAgICBkZXRlY3RvcixcbiAgICAgIHNpZ25hbCxcbiAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICB9ID0gbWVyZ2VPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgICBjb25zdCB1bmlmeVByb21pc2VLZXkgPSBbXG4gICAgICBzZWxlY3RvcixcbiAgICAgIHRhcmdldCxcbiAgICAgIHVuaWZ5UHJvY2VzcyxcbiAgICAgIG9ic2VydmVDb25maWdzLFxuICAgICAgZGV0ZWN0b3IsXG4gICAgICBzaWduYWwsXG4gICAgICBjdXN0b21NYXRjaGVyXG4gICAgXTtcbiAgICBjb25zdCBjYWNoZWRQcm9taXNlID0gdW5pZnlDYWNoZS5nZXQodW5pZnlQcm9taXNlS2V5KTtcbiAgICBpZiAodW5pZnlQcm9jZXNzICYmIGNhY2hlZFByb21pc2UpIHtcbiAgICAgIHJldHVybiBjYWNoZWRQcm9taXNlO1xuICAgIH1cbiAgICBjb25zdCBkZXRlY3RQcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAvLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vQXN5bmNQcm9taXNlRXhlY3V0b3I6IGF2b2lkIG5lc3RpbmcgcHJvbWlzZVxuICAgICAgYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgICAgIGFzeW5jIChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgXyBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zdCBkZXRlY3RSZXN1bHQyID0gYXdhaXQgZGV0ZWN0RWxlbWVudCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgIGRldGVjdG9yLFxuICAgICAgICAgICAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChkZXRlY3RSZXN1bHQyLmlzRGV0ZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkZXRlY3RSZXN1bHQyLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHNpZ25hbD8uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcImFib3J0XCIsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgb25jZTogdHJ1ZSB9XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGRldGVjdFJlc3VsdCA9IGF3YWl0IGRldGVjdEVsZW1lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICBkZXRlY3RvcixcbiAgICAgICAgICBjdXN0b21NYXRjaGVyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZGV0ZWN0UmVzdWx0LmlzRGV0ZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkZXRlY3RSZXN1bHQucmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwgb2JzZXJ2ZUNvbmZpZ3MpO1xuICAgICAgfVxuICAgICkuZmluYWxseSgoKSA9PiB7XG4gICAgICB1bmlmeUNhY2hlLmRlbGV0ZSh1bmlmeVByb21pc2VLZXkpO1xuICAgIH0pO1xuICAgIHVuaWZ5Q2FjaGUuc2V0KHVuaWZ5UHJvbWlzZUtleSwgZGV0ZWN0UHJvbWlzZSk7XG4gICAgcmV0dXJuIGRldGVjdFByb21pc2U7XG4gIH07XG59XG5hc3luYyBmdW5jdGlvbiBkZXRlY3RFbGVtZW50KHtcbiAgdGFyZ2V0LFxuICBzZWxlY3RvcixcbiAgZGV0ZWN0b3IsXG4gIGN1c3RvbU1hdGNoZXJcbn0pIHtcbiAgY29uc3QgZWxlbWVudCA9IGN1c3RvbU1hdGNoZXIgPyBjdXN0b21NYXRjaGVyKHNlbGVjdG9yKSA6IHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgcmV0dXJuIGF3YWl0IGRldGVjdG9yKGVsZW1lbnQpO1xufVxuY29uc3Qgd2FpdEVsZW1lbnQgPSBjcmVhdGVXYWl0RWxlbWVudCh7XG4gIGRlZmF1bHRPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucygpXG59KTtcblxuZXhwb3J0IHsgY3JlYXRlV2FpdEVsZW1lbnQsIGdldERlZmF1bHRPcHRpb25zLCB3YWl0RWxlbWVudCB9O1xuIl0sIm5hbWVzIjpbImRlZmluaXRpb24iLCJ0aGlzIiwibW9kdWxlIiwicHJveHlUYXJnZXQiLCJ2YWx1ZSIsInJlc3VsdCIsIm1lc3NhZ2UiLCJpZCIsInByaW50IiwibG9nZ2VyIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFPLFdBQVMsb0JBQW9CQSxhQUFZO0FBQzlDLFdBQU9BO0FBQUEsRUFDVDs7Ozs7Ozs7Ozs7QUNGQSxPQUFDLFNBQVUsUUFBUSxTQUFTO0FBR2lCO0FBQ3pDLGtCQUFRLE1BQU07QUFBQSxRQUNsQjtBQUFBLE1BT0EsR0FBRyxPQUFPLGVBQWUsY0FBYyxhQUFhLE9BQU8sU0FBUyxjQUFjLE9BQU9DLGlCQUFNLFNBQVVDLFNBQVE7QUFTL0csWUFBSSxFQUFFLFdBQVcsVUFBVSxXQUFXLE9BQU8sV0FBVyxXQUFXLE9BQU8sUUFBUSxLQUFLO0FBQ3JGLGdCQUFNLElBQUksTUFBTSwyREFBMkQ7QUFBQSxRQUMvRTtBQUNFLFlBQUksRUFBRSxXQUFXLFdBQVcsV0FBVyxRQUFRLFdBQVcsV0FBVyxRQUFRLFFBQVEsS0FBSztBQUN4RixnQkFBTSxtREFBbUQ7QUFPekQsZ0JBQU0sV0FBVyxtQkFBaUI7QUFJaEMsa0JBQU0sY0FBYztBQUFBLGNBQ2xCLFVBQVU7QUFBQSxnQkFDUixTQUFTO0FBQUEsa0JBQ1AsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixZQUFZO0FBQUEsa0JBQ1YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLGFBQWE7QUFBQSxnQkFDWCxVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixlQUFlO0FBQUEsa0JBQ2IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixjQUFjO0FBQUEsa0JBQ1osV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixXQUFXO0FBQUEsa0JBQ1QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixRQUFRO0FBQUEsa0JBQ04sV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixjQUFjO0FBQUEsa0JBQ1osV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLGlCQUFpQjtBQUFBLGdCQUNmLFdBQVc7QUFBQSxrQkFDVCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBO2dCQUUxQixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCx3QkFBd0I7QUFBQTtnQkFFMUIsMkJBQTJCO0FBQUEsa0JBQ3pCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsZ0JBQWdCO0FBQUEsa0JBQ2QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixZQUFZO0FBQUEsa0JBQ1YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixZQUFZO0FBQUEsa0JBQ1YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYiwyQkFBMkI7QUFBQSxrQkFDekIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCx3QkFBd0I7QUFBQTtnQkFFMUIsZ0JBQWdCO0FBQUEsa0JBQ2QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCx3QkFBd0I7QUFBQTtnQkFFMUIsV0FBVztBQUFBLGtCQUNULFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsWUFBWTtBQUFBLGtCQUNWLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsd0JBQXdCO0FBQUE7Z0JBRTFCLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBLGdCQUNwQztBQUFBO2NBRVEsZ0JBQWdCO0FBQUEsZ0JBQ2QsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsZUFBZTtBQUFBLGtCQUNiLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsaUJBQWlCO0FBQUEsa0JBQ2YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixtQkFBbUI7QUFBQSxrQkFDakIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixrQkFBa0I7QUFBQSxrQkFDaEIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixpQkFBaUI7QUFBQSxrQkFDZixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLHNCQUFzQjtBQUFBLGtCQUNwQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLG1CQUFtQjtBQUFBLGtCQUNqQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLG9CQUFvQjtBQUFBLGtCQUNsQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsWUFBWTtBQUFBLGdCQUNWLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsZ0JBQWdCO0FBQUEsZ0JBQ2QsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsYUFBYTtBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxXQUFXO0FBQUEsZ0JBQ1QsT0FBTztBQUFBLGtCQUNMLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsc0JBQXNCO0FBQUEsa0JBQ3BCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsT0FBTztBQUFBLGtCQUNMLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxZQUFZO0FBQUEsZ0JBQ1YsbUJBQW1CO0FBQUEsa0JBQ2pCLFFBQVE7QUFBQSxvQkFDTixXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBLG9CQUNYLHFCQUFxQjtBQUFBLGtCQUNuQztBQUFBO2dCQUVVLFVBQVU7QUFBQSxrQkFDUixVQUFVO0FBQUEsb0JBQ1IsV0FBVztBQUFBLG9CQUNYLFdBQVc7QUFBQSxvQkFDWCxxQkFBcUI7QUFBQTtrQkFFdkIsWUFBWTtBQUFBLG9CQUNWLHFCQUFxQjtBQUFBLHNCQUNuQixXQUFXO0FBQUEsc0JBQ1gsV0FBVztBQUFBLG9CQUMzQjtBQUFBLGtCQUNBO0FBQUEsZ0JBQ0E7QUFBQTtjQUVRLGFBQWE7QUFBQSxnQkFDWCxVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixZQUFZO0FBQUEsa0JBQ1YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixTQUFTO0FBQUEsa0JBQ1AsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixlQUFlO0FBQUEsa0JBQ2IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixRQUFRO0FBQUEsa0JBQ04sV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCx3QkFBd0I7QUFBQTtnQkFFMUIsU0FBUztBQUFBLGtCQUNQLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsY0FBYztBQUFBLGtCQUNaLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsUUFBUTtBQUFBLGtCQUNOLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsd0JBQXdCO0FBQUEsZ0JBQ3BDO0FBQUE7Y0FFUSxhQUFhO0FBQUEsZ0JBQ1gsNkJBQTZCO0FBQUEsa0JBQzNCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsNEJBQTRCO0FBQUEsa0JBQzFCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxXQUFXO0FBQUEsZ0JBQ1QsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsYUFBYTtBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsZUFBZTtBQUFBLGtCQUNiLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsYUFBYTtBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsYUFBYTtBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxRQUFRO0FBQUEsZ0JBQ04sa0JBQWtCO0FBQUEsa0JBQ2hCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsc0JBQXNCO0FBQUEsa0JBQ3BCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxZQUFZO0FBQUEsZ0JBQ1YscUJBQXFCO0FBQUEsa0JBQ25CLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxRQUFRO0FBQUEsZ0JBQ04sY0FBYztBQUFBLGtCQUNaLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxjQUFjO0FBQUEsZ0JBQ1osT0FBTztBQUFBLGtCQUNMLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsV0FBVztBQUFBLGtCQUNULFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsY0FBYztBQUFBLGtCQUNaLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsaUJBQWlCO0FBQUEsa0JBQ2YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLGlCQUFpQjtBQUFBLGdCQUNmLFNBQVM7QUFBQSxrQkFDUCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLHNCQUFzQjtBQUFBLGtCQUNwQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsY0FBYztBQUFBLGdCQUNaLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFFBQVE7QUFBQSxrQkFDTixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBO2dCQUUxQixXQUFXO0FBQUEsa0JBQ1QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixZQUFZO0FBQUEsa0JBQ1YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCx3QkFBd0I7QUFBQTtnQkFFMUIsWUFBWTtBQUFBLGtCQUNWLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsa0JBQ1gsd0JBQXdCO0FBQUE7Z0JBRTFCLFFBQVE7QUFBQSxrQkFDTixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLHdCQUF3QjtBQUFBLGdCQUNwQztBQUFBO2NBRVEsZUFBZTtBQUFBLGdCQUNiLFlBQVk7QUFBQSxrQkFDVixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFVBQVU7QUFBQSxrQkFDUixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFdBQVc7QUFBQSxrQkFDVCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsV0FBVztBQUFBLGdCQUNULHFCQUFxQjtBQUFBLGtCQUNuQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLG1CQUFtQjtBQUFBLGtCQUNqQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLG1CQUFtQjtBQUFBLGtCQUNqQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLHNCQUFzQjtBQUFBLGtCQUNwQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLGVBQWU7QUFBQSxrQkFDYixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLHFCQUFxQjtBQUFBLGtCQUNuQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLG1CQUFtQjtBQUFBLGtCQUNqQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsWUFBWTtBQUFBLGdCQUNWLGNBQWM7QUFBQSxrQkFDWixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLHFCQUFxQjtBQUFBLGtCQUNuQixXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBO2dCQUViLFdBQVc7QUFBQSxrQkFDVCxXQUFXO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGdCQUN2QjtBQUFBO2NBRVEsV0FBVztBQUFBLGdCQUNULFNBQVM7QUFBQSxrQkFDUCxTQUFTO0FBQUEsb0JBQ1AsV0FBVztBQUFBLG9CQUNYLFdBQVc7QUFBQTtrQkFFYixPQUFPO0FBQUEsb0JBQ0wsV0FBVztBQUFBLG9CQUNYLFdBQVc7QUFBQTtrQkFFYixpQkFBaUI7QUFBQSxvQkFDZixXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLFVBQVU7QUFBQSxvQkFDUixXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLE9BQU87QUFBQSxvQkFDTCxXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBLGtCQUN6QjtBQUFBO2dCQUVVLFdBQVc7QUFBQSxrQkFDVCxPQUFPO0FBQUEsb0JBQ0wsV0FBVztBQUFBLG9CQUNYLFdBQVc7QUFBQTtrQkFFYixpQkFBaUI7QUFBQSxvQkFDZixXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBLGtCQUN6QjtBQUFBO2dCQUVVLFFBQVE7QUFBQSxrQkFDTixTQUFTO0FBQUEsb0JBQ1AsV0FBVztBQUFBLG9CQUNYLFdBQVc7QUFBQTtrQkFFYixPQUFPO0FBQUEsb0JBQ0wsV0FBVztBQUFBLG9CQUNYLFdBQVc7QUFBQTtrQkFFYixpQkFBaUI7QUFBQSxvQkFDZixXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLFVBQVU7QUFBQSxvQkFDUixXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBO2tCQUViLE9BQU87QUFBQSxvQkFDTCxXQUFXO0FBQUEsb0JBQ1gsV0FBVztBQUFBLGtCQUN6QjtBQUFBLGdCQUNBO0FBQUE7Y0FFUSxRQUFRO0FBQUEsZ0JBQ04scUJBQXFCO0FBQUEsa0JBQ25CLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsa0JBQWtCO0FBQUEsa0JBQ2hCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsV0FBVztBQUFBLGtCQUNULFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsYUFBYTtBQUFBLGtCQUNYLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsaUJBQWlCO0FBQUEsa0JBQ2YsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixjQUFjO0FBQUEsa0JBQ1osV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixXQUFXO0FBQUEsa0JBQ1QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixtQkFBbUI7QUFBQSxrQkFDakIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixRQUFRO0FBQUEsa0JBQ04sV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixTQUFTO0FBQUEsa0JBQ1AsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixhQUFhO0FBQUEsa0JBQ1gsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixlQUFlO0FBQUEsa0JBQ2IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixXQUFXO0FBQUEsa0JBQ1QsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixtQkFBbUI7QUFBQSxrQkFDakIsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQTtnQkFFYixVQUFVO0FBQUEsa0JBQ1IsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLFlBQVk7QUFBQSxnQkFDVixPQUFPO0FBQUEsa0JBQ0wsV0FBVztBQUFBLGtCQUNYLFdBQVc7QUFBQSxnQkFDdkI7QUFBQTtjQUVRLGlCQUFpQjtBQUFBLGdCQUNmLGdCQUFnQjtBQUFBLGtCQUNkLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsWUFBWTtBQUFBLGtCQUNWLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxjQUFjO0FBQUEsZ0JBQ1osMEJBQTBCO0FBQUEsa0JBQ3hCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUE7Y0FFUSxXQUFXO0FBQUEsZ0JBQ1QsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsT0FBTztBQUFBLGtCQUNMLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsY0FBYztBQUFBLGtCQUNaLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsa0JBQWtCO0FBQUEsa0JBQ2hCLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUE7Z0JBRWIsVUFBVTtBQUFBLGtCQUNSLFdBQVc7QUFBQSxrQkFDWCxXQUFXO0FBQUEsZ0JBQ3ZCO0FBQUEsY0FDQTtBQUFBO0FBRU0sZ0JBQUksT0FBTyxLQUFLLFdBQVcsRUFBRSxXQUFXLEdBQUc7QUFDekMsb0JBQU0sSUFBSSxNQUFNLDZEQUE2RDtBQUFBLFlBQ3JGO0FBQUEsWUFZTSxNQUFNLHVCQUF1QixRQUFRO0FBQUEsY0FDbkMsWUFBWSxZQUFZLFFBQVEsUUFBVztBQUN6QyxzQkFBTSxLQUFLO0FBQ1gscUJBQUssYUFBYTtBQUFBLGNBQzVCO0FBQUEsY0FDUSxJQUFJLEtBQUs7QUFDUCxvQkFBSSxDQUFDLEtBQUssSUFBSSxHQUFHLEdBQUc7QUFDbEIsdUJBQUssSUFBSSxLQUFLLEtBQUssV0FBVyxHQUFHLENBQUM7QUFBQSxnQkFDOUM7QUFDVSx1QkFBTyxNQUFNLElBQUksR0FBRztBQUFBLGNBQzlCO0FBQUEsWUFDQTtBQVNNLGtCQUFNLGFBQWEsV0FBUztBQUMxQixxQkFBTyxTQUFTLE9BQU8sVUFBVSxZQUFZLE9BQU8sTUFBTSxTQUFTO0FBQUEsWUFDM0U7QUFpQ00sa0JBQU0sZUFBZSxDQUFDLFNBQVMsYUFBYTtBQUMxQyxxQkFBTyxJQUFJLGlCQUFpQjtBQUMxQixvQkFBSSxjQUFjLFFBQVEsV0FBVztBQUNuQywwQkFBUSxPQUFPLElBQUksTUFBTSxjQUFjLFFBQVEsVUFBVSxPQUFPLENBQUM7QUFBQSxnQkFDN0UsV0FBcUIsU0FBUyxxQkFBcUIsYUFBYSxVQUFVLEtBQUssU0FBUyxzQkFBc0IsT0FBTztBQUN6RywwQkFBUSxRQUFRLGFBQWEsQ0FBQyxDQUFDO0FBQUEsZ0JBQzNDLE9BQWlCO0FBQ0wsMEJBQVEsUUFBUSxZQUFZO0FBQUEsZ0JBQ3hDO0FBQUEsY0FDQTtBQUFBLFlBQ0E7QUFDTSxrQkFBTSxxQkFBcUIsYUFBVyxXQUFXLElBQUksYUFBYTtBQTRCbEUsa0JBQU0sb0JBQW9CLENBQUMsTUFBTSxhQUFhO0FBQzVDLHFCQUFPLFNBQVMscUJBQXFCLFdBQVcsTUFBTTtBQUNwRCxvQkFBSSxLQUFLLFNBQVMsU0FBUyxTQUFTO0FBQ2xDLHdCQUFNLElBQUksTUFBTSxxQkFBcUIsU0FBUyxPQUFPLElBQUksbUJBQW1CLFNBQVMsT0FBTyxDQUFDLFFBQVEsSUFBSSxXQUFXLEtBQUssTUFBTSxFQUFFO0FBQUEsZ0JBQzdJO0FBQ1Usb0JBQUksS0FBSyxTQUFTLFNBQVMsU0FBUztBQUNsQyx3QkFBTSxJQUFJLE1BQU0sb0JBQW9CLFNBQVMsT0FBTyxJQUFJLG1CQUFtQixTQUFTLE9BQU8sQ0FBQyxRQUFRLElBQUksV0FBVyxLQUFLLE1BQU0sRUFBRTtBQUFBLGdCQUM1STtBQUNVLHVCQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUN0QyxzQkFBSSxTQUFTLHNCQUFzQjtBQUlqQyx3QkFBSTtBQUNGLDZCQUFPLElBQUksRUFBRSxHQUFHLE1BQU0sYUFBYTtBQUFBLHdCQUNqQztBQUFBLHdCQUNBO0FBQUEseUJBQ0MsUUFBUSxDQUFDO0FBQUEsb0JBQzVCLFNBQXVCLFNBQVM7QUFDaEIsOEJBQVEsS0FBSyxHQUFHLElBQUksNEdBQWlILE9BQU87QUFDNUksNkJBQU8sSUFBSSxFQUFFLEdBQUcsSUFBSTtBQUlwQiwrQkFBUyx1QkFBdUI7QUFDaEMsK0JBQVMsYUFBYTtBQUN0Qiw4QkFBTztBQUFBLG9CQUN2QjtBQUFBLGtCQUNBLFdBQXVCLFNBQVMsWUFBWTtBQUM5QiwyQkFBTyxJQUFJLEVBQUUsR0FBRyxJQUFJO0FBQ3BCLDRCQUFPO0FBQUEsa0JBQ3JCLE9BQW1CO0FBQ0wsMkJBQU8sSUFBSSxFQUFFLEdBQUcsTUFBTSxhQUFhO0FBQUEsc0JBQ2pDO0FBQUEsc0JBQ0E7QUFBQSx1QkFDQyxRQUFRLENBQUM7QUFBQSxrQkFDMUI7QUFBQSxnQkFDQSxDQUFXO0FBQUEsY0FDWDtBQUFBLFlBQ0E7QUFxQk0sa0JBQU0sYUFBYSxDQUFDLFFBQVEsUUFBUSxZQUFZO0FBQzlDLHFCQUFPLElBQUksTUFBTSxRQUFRO0FBQUEsZ0JBQ3ZCLE1BQU0sY0FBYyxTQUFTLE1BQU07QUFDakMseUJBQU8sUUFBUSxLQUFLLFNBQVMsUUFBUSxHQUFHLElBQUk7QUFBQSxnQkFDeEQ7QUFBQSxjQUNBLENBQVM7QUFBQSxZQUNUO0FBQ00sZ0JBQUksaUJBQWlCLFNBQVMsS0FBSyxLQUFLLE9BQU8sVUFBVSxjQUFjO0FBeUJ2RSxrQkFBTSxhQUFhLENBQUMsUUFBUSxXQUFXLENBQUEsR0FBSSxXQUFXLE9BQU87QUFDM0Qsa0JBQUksUUFBUSx1QkFBTyxPQUFPLElBQUk7QUFDOUIsa0JBQUksV0FBVztBQUFBLGdCQUNiLElBQUlDLGNBQWEsTUFBTTtBQUNyQix5QkFBTyxRQUFRLFVBQVUsUUFBUTtBQUFBLGdCQUM3QztBQUFBLGdCQUNVLElBQUlBLGNBQWEsTUFBTSxVQUFVO0FBQy9CLHNCQUFJLFFBQVEsT0FBTztBQUNqQiwyQkFBTyxNQUFNLElBQUk7QUFBQSxrQkFDL0I7QUFDWSxzQkFBSSxFQUFFLFFBQVEsU0FBUztBQUNyQiwyQkFBTztBQUFBLGtCQUNyQjtBQUNZLHNCQUFJLFFBQVEsT0FBTyxJQUFJO0FBQ3ZCLHNCQUFJLE9BQU8sVUFBVSxZQUFZO0FBSS9CLHdCQUFJLE9BQU8sU0FBUyxJQUFJLE1BQU0sWUFBWTtBQUV4Qyw4QkFBUSxXQUFXLFFBQVEsT0FBTyxJQUFJLEdBQUcsU0FBUyxJQUFJLENBQUM7QUFBQSxvQkFDdkUsV0FBeUIsZUFBZSxVQUFVLElBQUksR0FBRztBQUd6QywwQkFBSSxVQUFVLGtCQUFrQixNQUFNLFNBQVMsSUFBSSxDQUFDO0FBQ3BELDhCQUFRLFdBQVcsUUFBUSxPQUFPLElBQUksR0FBRyxPQUFPO0FBQUEsb0JBQ2hFLE9BQXFCO0FBR0wsOEJBQVEsTUFBTSxLQUFLLE1BQU07QUFBQSxvQkFDekM7QUFBQSxrQkFDQSxXQUF1QixPQUFPLFVBQVUsWUFBWSxVQUFVLFNBQVMsZUFBZSxVQUFVLElBQUksS0FBSyxlQUFlLFVBQVUsSUFBSSxJQUFJO0FBSTVILDRCQUFRLFdBQVcsT0FBTyxTQUFTLElBQUksR0FBRyxTQUFTLElBQUksQ0FBQztBQUFBLGtCQUN0RSxXQUF1QixlQUFlLFVBQVUsR0FBRyxHQUFHO0FBRXhDLDRCQUFRLFdBQVcsT0FBTyxTQUFTLElBQUksR0FBRyxTQUFTLEdBQUcsQ0FBQztBQUFBLGtCQUNyRSxPQUFtQjtBQUdMLDJCQUFPLGVBQWUsT0FBTyxNQUFNO0FBQUEsc0JBQ2pDLGNBQWM7QUFBQSxzQkFDZCxZQUFZO0FBQUEsc0JBQ1osTUFBTTtBQUNKLCtCQUFPLE9BQU8sSUFBSTtBQUFBLHNCQUNwQztBQUFBLHNCQUNnQixJQUFJQyxRQUFPO0FBQ1QsK0JBQU8sSUFBSSxJQUFJQTtBQUFBLHNCQUNqQztBQUFBLG9CQUNBLENBQWU7QUFDRCwyQkFBTztBQUFBLGtCQUNyQjtBQUNZLHdCQUFNLElBQUksSUFBSTtBQUNkLHlCQUFPO0FBQUEsZ0JBQ25CO0FBQUEsZ0JBQ1UsSUFBSUQsY0FBYSxNQUFNLE9BQU8sVUFBVTtBQUN0QyxzQkFBSSxRQUFRLE9BQU87QUFDakIsMEJBQU0sSUFBSSxJQUFJO0FBQUEsa0JBQzVCLE9BQW1CO0FBQ0wsMkJBQU8sSUFBSSxJQUFJO0FBQUEsa0JBQzdCO0FBQ1kseUJBQU87QUFBQSxnQkFDbkI7QUFBQSxnQkFDVSxlQUFlQSxjQUFhLE1BQU0sTUFBTTtBQUN0Qyx5QkFBTyxRQUFRLGVBQWUsT0FBTyxNQUFNLElBQUk7QUFBQSxnQkFDM0Q7QUFBQSxnQkFDVSxlQUFlQSxjQUFhLE1BQU07QUFDaEMseUJBQU8sUUFBUSxlQUFlLE9BQU8sSUFBSTtBQUFBLGdCQUNyRDtBQUFBO0FBYVEsa0JBQUksY0FBYyxPQUFPLE9BQU8sTUFBTTtBQUN0QyxxQkFBTyxJQUFJLE1BQU0sYUFBYSxRQUFRO0FBQUEsWUFDOUM7QUFrQk0sa0JBQU0sWUFBWSxpQkFBZTtBQUFBLGNBQy9CLFlBQVksUUFBUSxhQUFhLE1BQU07QUFDckMsdUJBQU8sWUFBWSxXQUFXLElBQUksUUFBUSxHQUFHLEdBQUcsSUFBSTtBQUFBLGNBQzlEO0FBQUEsY0FDUSxZQUFZLFFBQVEsVUFBVTtBQUM1Qix1QkFBTyxPQUFPLFlBQVksV0FBVyxJQUFJLFFBQVEsQ0FBQztBQUFBLGNBQzVEO0FBQUEsY0FDUSxlQUFlLFFBQVEsVUFBVTtBQUMvQix1QkFBTyxlQUFlLFdBQVcsSUFBSSxRQUFRLENBQUM7QUFBQSxjQUN4RDtBQUFBLFlBQ0E7QUFDTSxrQkFBTSw0QkFBNEIsSUFBSSxlQUFlLGNBQVk7QUFDL0Qsa0JBQUksT0FBTyxhQUFhLFlBQVk7QUFDbEMsdUJBQU87QUFBQSxjQUNqQjtBQVVRLHFCQUFPLFNBQVMsa0JBQWtCLEtBQUs7QUFDckMsc0JBQU0sYUFBYSxXQUFXLEtBQUssSUFBbUI7QUFBQSxrQkFDcEQsWUFBWTtBQUFBLG9CQUNWLFNBQVM7QUFBQSxvQkFDVCxTQUFTO0FBQUEsa0JBQ3ZCO0FBQUEsZ0JBQ0EsQ0FBVztBQUNELHlCQUFTLFVBQVU7QUFBQSxjQUM3QjtBQUFBLFlBQ0EsQ0FBTztBQUNELGtCQUFNLG9CQUFvQixJQUFJLGVBQWUsY0FBWTtBQUN2RCxrQkFBSSxPQUFPLGFBQWEsWUFBWTtBQUNsQyx1QkFBTztBQUFBLGNBQ2pCO0FBbUJRLHFCQUFPLFNBQVMsVUFBVSxTQUFTLFFBQVEsY0FBYztBQUN2RCxvQkFBSSxzQkFBc0I7QUFDMUIsb0JBQUk7QUFDSixvQkFBSSxzQkFBc0IsSUFBSSxRQUFRLGFBQVc7QUFDL0Msd0NBQXNCLFNBQVUsVUFBVTtBQUN4QywwQ0FBc0I7QUFDdEIsNEJBQVEsUUFBUTtBQUFBLGtCQUM5QjtBQUFBLGdCQUNBLENBQVc7QUFDRCxvQkFBSUU7QUFDSixvQkFBSTtBQUNGLGtCQUFBQSxVQUFTLFNBQVMsU0FBUyxRQUFRLG1CQUFtQjtBQUFBLGdCQUNsRSxTQUFtQixLQUFLO0FBQ1osa0JBQUFBLFVBQVMsUUFBUSxPQUFPLEdBQUc7QUFBQSxnQkFDdkM7QUFDVSxzQkFBTSxtQkFBbUJBLFlBQVcsUUFBUSxXQUFXQSxPQUFNO0FBSzdELG9CQUFJQSxZQUFXLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxxQkFBcUI7QUFDaEUseUJBQU87QUFBQSxnQkFDbkI7QUFNVSxzQkFBTSxxQkFBcUIsYUFBVztBQUNwQywwQkFBUSxLQUFLLFNBQU87QUFFbEIsaUNBQWEsR0FBRztBQUFBLGtCQUM5QixHQUFlLFdBQVM7QUFHVix3QkFBSUM7QUFDSix3QkFBSSxVQUFVLGlCQUFpQixTQUFTLE9BQU8sTUFBTSxZQUFZLFdBQVc7QUFDMUUsc0JBQUFBLFdBQVUsTUFBTTtBQUFBLG9CQUNoQyxPQUFxQjtBQUNMLHNCQUFBQSxXQUFVO0FBQUEsb0JBQzFCO0FBQ2MsaUNBQWE7QUFBQSxzQkFDWCxtQ0FBbUM7QUFBQSxzQkFDbkMsU0FBQUE7QUFBQSxvQkFDaEIsQ0FBZTtBQUFBLGtCQUNmLENBQWEsRUFBRSxNQUFNLFNBQU87QUFFZCw0QkFBUSxNQUFNLDJDQUEyQyxHQUFHO0FBQUEsa0JBQzFFLENBQWE7QUFBQSxnQkFDYjtBQUtVLG9CQUFJLGtCQUFrQjtBQUNwQixxQ0FBbUJELE9BQU07QUFBQSxnQkFDckMsT0FBaUI7QUFDTCxxQ0FBbUIsbUJBQW1CO0FBQUEsZ0JBQ2xEO0FBR1UsdUJBQU87QUFBQSxjQUNqQjtBQUFBLFlBQ0EsQ0FBTztBQUNELGtCQUFNLDZCQUE2QixDQUFDO0FBQUEsY0FDbEM7QUFBQSxjQUNBO0FBQUEsZUFDQyxVQUFVO0FBQ1gsa0JBQUksY0FBYyxRQUFRLFdBQVc7QUFJbkMsb0JBQUksY0FBYyxRQUFRLFVBQVUsWUFBWSxrREFBa0Q7QUFDaEcsMEJBQU87QUFBQSxnQkFDbkIsT0FBaUI7QUFDTCx5QkFBTyxJQUFJLE1BQU0sY0FBYyxRQUFRLFVBQVUsT0FBTyxDQUFDO0FBQUEsZ0JBQ3JFO0FBQUEsY0FDQSxXQUFtQixTQUFTLE1BQU0sbUNBQW1DO0FBRzNELHVCQUFPLElBQUksTUFBTSxNQUFNLE9BQU8sQ0FBQztBQUFBLGNBQ3pDLE9BQWU7QUFDTCx3QkFBUSxLQUFLO0FBQUEsY0FDdkI7QUFBQSxZQUNBO0FBQ00sa0JBQU0scUJBQXFCLENBQUMsTUFBTSxVQUFVLG9CQUFvQixTQUFTO0FBQ3ZFLGtCQUFJLEtBQUssU0FBUyxTQUFTLFNBQVM7QUFDbEMsc0JBQU0sSUFBSSxNQUFNLHFCQUFxQixTQUFTLE9BQU8sSUFBSSxtQkFBbUIsU0FBUyxPQUFPLENBQUMsUUFBUSxJQUFJLFdBQVcsS0FBSyxNQUFNLEVBQUU7QUFBQSxjQUMzSTtBQUNRLGtCQUFJLEtBQUssU0FBUyxTQUFTLFNBQVM7QUFDbEMsc0JBQU0sSUFBSSxNQUFNLG9CQUFvQixTQUFTLE9BQU8sSUFBSSxtQkFBbUIsU0FBUyxPQUFPLENBQUMsUUFBUSxJQUFJLFdBQVcsS0FBSyxNQUFNLEVBQUU7QUFBQSxjQUMxSTtBQUNRLHFCQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUN0QyxzQkFBTSxZQUFZLDJCQUEyQixLQUFLLE1BQU07QUFBQSxrQkFDdEQ7QUFBQSxrQkFDQTtBQUFBLGdCQUNaLENBQVc7QUFDRCxxQkFBSyxLQUFLLFNBQVM7QUFDbkIsZ0NBQWdCLFlBQVksR0FBRyxJQUFJO0FBQUEsY0FDN0MsQ0FBUztBQUFBLFlBQ1Q7QUFDTSxrQkFBTSxpQkFBaUI7QUFBQSxjQUNyQixVQUFVO0FBQUEsZ0JBQ1IsU0FBUztBQUFBLGtCQUNQLG1CQUFtQixVQUFVLHlCQUF5QjtBQUFBLGdCQUNsRTtBQUFBO2NBRVEsU0FBUztBQUFBLGdCQUNQLFdBQVcsVUFBVSxpQkFBaUI7QUFBQSxnQkFDdEMsbUJBQW1CLFVBQVUsaUJBQWlCO0FBQUEsZ0JBQzlDLGFBQWEsbUJBQW1CLEtBQUssTUFBTSxlQUFlO0FBQUEsa0JBQ3hELFNBQVM7QUFBQSxrQkFDVCxTQUFTO0FBQUEsaUJBQ1Y7QUFBQTtjQUVILE1BQU07QUFBQSxnQkFDSixhQUFhLG1CQUFtQixLQUFLLE1BQU0sZUFBZTtBQUFBLGtCQUN4RCxTQUFTO0FBQUEsa0JBQ1QsU0FBUztBQUFBLGlCQUNWO0FBQUEsY0FDWDtBQUFBO0FBRU0sa0JBQU0sa0JBQWtCO0FBQUEsY0FDdEIsT0FBTztBQUFBLGdCQUNMLFNBQVM7QUFBQSxnQkFDVCxTQUFTO0FBQUE7Y0FFWCxLQUFLO0FBQUEsZ0JBQ0gsU0FBUztBQUFBLGdCQUNULFNBQVM7QUFBQTtjQUVYLEtBQUs7QUFBQSxnQkFDSCxTQUFTO0FBQUEsZ0JBQ1QsU0FBUztBQUFBLGNBQ25CO0FBQUE7QUFFTSx3QkFBWSxVQUFVO0FBQUEsY0FDcEIsU0FBUztBQUFBLGdCQUNQLEtBQUs7QUFBQTtjQUVQLFVBQVU7QUFBQSxnQkFDUixLQUFLO0FBQUE7Y0FFUCxVQUFVO0FBQUEsZ0JBQ1IsS0FBSztBQUFBLGNBQ2Y7QUFBQTtBQUVNLG1CQUFPLFdBQVcsZUFBZSxnQkFBZ0IsV0FBVztBQUFBLFVBQ2xFO0FBSUksVUFBQUgsUUFBTyxVQUFVLFNBQVMsTUFBTTtBQUFBLFFBQ3BDLE9BQVM7QUFDTCxVQUFBQSxRQUFPLFVBQVUsV0FBVztBQUFBLFFBQ2hDO0FBQUEsTUFDQSxDQUFDO0FBQUE7Ozs7O0FDdHNDTSxRQUFNLFVBQVU7QUM0RnZCLFdBQVMsbUJBQW1CLElBQTBCO0FBQ3BELFVBQU0sU0FBUztBQUNmLFVBQU0sVUFBVTtBQUNoQixVQUFNLFdBQVc7QUFDakIsVUFBTSxRQUFRO0FBRWQsV0FBTztBQUFBLE1BQ0wsU0FBUyxHQUFHLFFBQVEsWUFBQTtBQUFBLE1BQ3BCLElBQUksR0FBRyxNQUFNO0FBQUEsTUFDYixXQUFXLEdBQUcsYUFBYTtBQUFBLE1BQzNCLGNBQWMsT0FBTyxlQUFlLElBQUksT0FBTyxNQUFNLEdBQUcsR0FBRztBQUFBLE1BQzNELEdBQUksU0FBUyxPQUFPLEVBQUUsTUFBTSxTQUFTLEtBQUEsSUFBUyxDQUFBO0FBQUEsTUFDOUMsR0FBSSxNQUFNLE1BQU0sRUFBRSxLQUFLLE1BQU0sSUFBQSxJQUFRLENBQUE7QUFBQSxNQUNyQyxHQUFJLFFBQVEsVUFBVSxVQUFhLFFBQVEsVUFBVSxLQUFLLEVBQUUsT0FBTyxRQUFRLE1BQUEsSUFBVSxDQUFBO0FBQUEsTUFDckYsR0FBSSxRQUFRLE9BQU8sRUFBRSxNQUFNLFFBQVEsS0FBQSxJQUFTLENBQUE7QUFBQSxNQUM1QyxHQUFJLFFBQVEsY0FBYyxFQUFFLGFBQWEsUUFBUSxZQUFBLElBQWdCLENBQUE7QUFBQSxJQUFDO0FBQUEsRUFFdEU7QUFLQSxXQUFTLFlBQVksVUFBa0IsTUFBK0I7O0FBQ3BFLFFBQUksTUFBTTtBQUVSLFlBQU0sYUFBYSxTQUFTLGlCQUFpQixRQUFRO0FBQ3JELGlCQUFXLE1BQU0sWUFBWTtBQUMzQixhQUFLLFFBQW1CLGdCQUFuQixtQkFBZ0MsU0FBUyxPQUFPO0FBQ25ELGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFDQSxhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU8sU0FBUyxjQUFjLFFBQVE7QUFBQSxFQUN4QztBQU1BLFdBQVMsYUFBYSxRQUFxQztBQUN6RCxRQUFJLENBQUMsT0FBTyxVQUFVO0FBQ3BCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyx5QkFBQTtBQUFBLElBQ2xDO0FBQ0EsVUFBTSxLQUFLLFlBQVksT0FBTyxVQUFVLE9BQU8sSUFBSTtBQUNuRCxRQUFJLENBQUMsSUFBSTtBQUNQLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxVQUFVLE9BQU8sUUFBUSxHQUFHLE9BQU8sT0FBTyxZQUFZLE9BQU8sSUFBSSxPQUFPLEVBQUUsR0FBQTtBQUFBLElBQzVHO0FBQ0MsT0FBbUIsTUFBQTtBQUNwQixXQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sRUFBRSxTQUFTLE9BQU8sV0FBUztBQUFBLEVBQzNEO0FBTUEsV0FBUyxZQUFZLFFBQXFDOztBQUN4RCxRQUFJLENBQUMsT0FBTyxVQUFVO0FBQ3BCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyx3QkFBQTtBQUFBLElBQ2xDO0FBQ0EsUUFBSSxPQUFPLFVBQVUsUUFBVztBQUM5QixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8scUJBQUE7QUFBQSxJQUNsQztBQUNBLFVBQU0sS0FBSyxZQUFZLE9BQU8sUUFBUTtBQUN0QyxRQUFJLENBQUMsSUFBSTtBQUNQLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxVQUFVLE9BQU8sUUFBUSxHQUFBO0FBQUEsSUFDM0Q7QUFHQSxPQUFHLE1BQUE7QUFHSCxPQUFHLFFBQVE7QUFDWCxPQUFHLGNBQWMsSUFBSSxNQUFNLFNBQVMsRUFBRSxTQUFTLEtBQUEsQ0FBTSxDQUFDO0FBSXRELFVBQU0sMEJBQXlCLFlBQU87QUFBQSxNQUNwQyxPQUFPLGVBQWUsRUFBRTtBQUFBLE1BQ3hCO0FBQUEsSUFBQSxNQUY2QixtQkFHNUI7QUFFSCxRQUFJLHdCQUF3QjtBQUMxQiw2QkFBdUIsS0FBSyxJQUFJLE9BQU8sS0FBSztBQUFBLElBQzlDLE9BQU87QUFDTCxTQUFHLFFBQVEsT0FBTztBQUFBLElBQ3BCO0FBR0EsT0FBRyxjQUFjLElBQUksTUFBTSxTQUFTLEVBQUUsU0FBUyxLQUFBLENBQU0sQ0FBQztBQUN0RCxPQUFHLGNBQWMsSUFBSSxNQUFNLFVBQVUsRUFBRSxTQUFTLEtBQUEsQ0FBTSxDQUFDO0FBRXZELFdBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLE9BQU8sT0FBTyxPQUFPLFVBQVUsT0FBTyxTQUFBLEVBQVM7QUFBQSxFQUNqRjtBQU1BLFdBQVMsY0FBYyxRQUFxQztBQUMxRCxVQUFNLE9BQU8sT0FBTyxjQUFjO0FBRWxDLFlBQVEsTUFBQTtBQUFBLE1BQ04sS0FBSztBQUNILGVBQU8sU0FBUyxFQUFFLEtBQUssR0FBRyxVQUFVLFVBQVU7QUFDOUMsZUFBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsVUFBVSxXQUFTO0FBQUEsTUFFckQsS0FBSztBQUNILGVBQU8sU0FBUyxFQUFFLEtBQUssU0FBUyxLQUFLLGNBQWMsVUFBVSxVQUFVO0FBQ3ZFLGVBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLFVBQVUsY0FBWTtBQUFBLE1BRXhELEtBQUssYUFBYTtBQUNoQixjQUFNLFNBQVMsT0FBTyxnQkFBZ0I7QUFDdEMsZUFBTyxTQUFTLEVBQUUsS0FBSyxRQUFRLFVBQVUsVUFBVTtBQUNuRCxlQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sRUFBRSxVQUFVLGFBQWEsU0FBTztBQUFBLE1BQ2hFO0FBQUEsTUFFQSxLQUFLLGNBQWM7QUFDakIsWUFBSSxDQUFDLE9BQU8sVUFBVTtBQUNwQixpQkFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLHFDQUFBO0FBQUEsUUFDbEM7QUFDQSxjQUFNLEtBQUssU0FBUyxjQUFjLE9BQU8sUUFBUTtBQUNqRCxZQUFJLENBQUMsSUFBSTtBQUNQLGlCQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sVUFBVSxPQUFPLFFBQVEsR0FBQTtBQUFBLFFBQzNEO0FBQ0EsV0FBRyxlQUFlLEVBQUUsVUFBVSxVQUFVLE9BQU8sVUFBVTtBQUN6RCxlQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sRUFBRSxVQUFVLGNBQWMsVUFBVSxPQUFPLFdBQVM7QUFBQSxNQUNwRjtBQUFBLE1BRUE7QUFDRSxlQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sYUFBYSxJQUFJLEdBQUE7QUFBQSxJQUFHO0FBQUEsRUFFMUQ7QUFNQSxXQUFTLHFCQUFxQixRQUFxQztBQUNqRSxRQUFJLENBQUMsT0FBTyxVQUFVO0FBQ3BCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxpQ0FBQTtBQUFBLElBQ2xDO0FBQ0EsVUFBTSxLQUFLLFNBQVMsY0FBYyxPQUFPLFFBQVE7QUFDakQsUUFBSSxDQUFDLElBQUk7QUFDUCxhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sVUFBVSxPQUFPLFFBQVEsR0FBQTtBQUFBLElBQzNEO0FBQ0EsV0FBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLG1CQUFtQixFQUFFLEVBQUE7QUFBQSxFQUNyRDtBQU1BLFdBQVMsd0JBQXdCLFFBQXFDO0FBQ3BFLFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLG9DQUFBO0FBQUEsSUFDbEM7QUFDQSxVQUFNLFdBQVcsU0FBUyxpQkFBaUIsT0FBTyxRQUFRO0FBQzFELFVBQU0sVUFBeUIsQ0FBQTtBQUUvQixVQUFNLFFBQVEsS0FBSyxJQUFJLFNBQVMsUUFBUSxPQUFPLFlBQVksRUFBRTtBQUM3RCxhQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sS0FBSztBQUM5QixjQUFRLEtBQUssbUJBQW1CLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFBQSxJQUM5QztBQUNBLFdBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLE9BQU8sU0FBUyxRQUFRLFVBQVUsVUFBUTtBQUFBLEVBQzVFO0FBS0EsV0FBUyxzQkFBc0IsUUFBcUM7O0FBQ2xFLFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLGtDQUFBO0FBQUEsSUFDbEM7QUFDQSxVQUFNLEtBQUssU0FBUyxjQUFjLE9BQU8sUUFBUTtBQUNqRCxRQUFJLENBQUMsSUFBSTtBQUNQLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxVQUFVLE9BQU8sUUFBUSxHQUFBO0FBQUEsSUFDM0Q7QUFDQSxXQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sRUFBRSxlQUFjLFFBQW1CLGdCQUFuQixtQkFBZ0MsV0FBVSxLQUFHO0FBQUEsRUFDN0Y7QUFLQSxXQUFTLG9CQUFvQixRQUFxQztBQUNoRSxRQUFJLENBQUMsT0FBTyxVQUFVO0FBQ3BCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxnQ0FBQTtBQUFBLElBQ2xDO0FBQ0EsUUFBSSxDQUFDLE9BQU8sZUFBZTtBQUN6QixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8scUNBQUE7QUFBQSxJQUNsQztBQUNBLFVBQU0sS0FBSyxTQUFTLGNBQWMsT0FBTyxRQUFRO0FBQ2pELFFBQUksQ0FBQyxJQUFJO0FBQ1AsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLFVBQVUsT0FBTyxRQUFRLEdBQUE7QUFBQSxJQUMzRDtBQUNBLFdBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLFdBQVcsT0FBTyxlQUFlLE9BQU8sR0FBRyxhQUFhLE9BQU8sYUFBYSxJQUFFO0FBQUEsRUFDaEg7QUFLQSxXQUFTLGdCQUFnQixRQUFxQztBQUM1RCxRQUFJLENBQUMsT0FBTyxVQUFVO0FBQ3BCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyw0QkFBQTtBQUFBLElBQ2xDO0FBQ0EsVUFBTSxLQUFLLFNBQVMsY0FBYyxPQUFPLFFBQVE7QUFDakQsUUFBSSxDQUFDLElBQUk7QUFDUCxhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sVUFBVSxPQUFPLFFBQVEsR0FBQTtBQUFBLElBQzNEO0FBQ0EsV0FBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsT0FBTyxHQUFHLFNBQVMsS0FBRztBQUFBLEVBQ3hEO0FBTUEsaUJBQWUsc0JBQXNCLFFBQThDO0FBQ2pGLFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLGtDQUFBO0FBQUEsSUFDbEM7QUFFQSxVQUFNLFVBQVUsT0FBTyxXQUFXO0FBR2xDLFVBQU0sV0FBVyxTQUFTLGNBQWMsT0FBTyxRQUFRO0FBQ3ZELFFBQUksVUFBVTtBQUNaLGFBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxtQkFBbUIsUUFBUSxFQUFBO0FBQUEsSUFDM0Q7QUFFQSxXQUFPLElBQUksUUFBc0IsQ0FBQyxZQUFZO0FBQzVDLFVBQUksV0FBVztBQUVmLFlBQU0sV0FBVyxJQUFJLGlCQUFpQixNQUFNO0FBQzFDLGNBQU0sS0FBSyxTQUFTLGNBQWMsT0FBTyxRQUFTO0FBQ2xELFlBQUksTUFBTSxDQUFDLFVBQVU7QUFDbkIscUJBQVc7QUFDWCxtQkFBUyxXQUFBO0FBQ1Qsa0JBQVEsRUFBRSxTQUFTLE1BQU0sTUFBTSxtQkFBbUIsRUFBRSxHQUFHO0FBQUEsUUFDekQ7QUFBQSxNQUNGLENBQUM7QUFFRCxlQUFTLFFBQVEsU0FBUyxNQUFNLEVBQUUsV0FBVyxNQUFNLFNBQVMsTUFBTTtBQUdsRSxpQkFBVyxNQUFNO0FBQ2YsWUFBSSxDQUFDLFVBQVU7QUFDYixxQkFBVztBQUNYLG1CQUFTLFdBQUE7QUFDVCxrQkFBUSxFQUFFLFNBQVMsT0FBTyxPQUFPLFdBQVcsT0FBTyxRQUFRLE9BQU8sUUFBUSxHQUFBLENBQUk7QUFBQSxRQUNoRjtBQUFBLE1BQ0YsR0FBRyxPQUFPO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDSDtBQU1BLFdBQVMsaUJBQWlCLFFBQXFDO0FBQzdELFFBQUksQ0FBQyxPQUFPLFVBQVU7QUFDcEIsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLDZCQUFBO0FBQUEsSUFDbEM7QUFDQSxVQUFNLEtBQUssU0FBUyxjQUFjLE9BQU8sUUFBUTtBQUNqRCxRQUFJLENBQUMsSUFBSTtBQUNQLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxVQUFVLE9BQU8sUUFBUSxHQUFBO0FBQUEsSUFDM0Q7QUFFQSxVQUFNLFFBQVEsT0FBTyxrQkFBa0I7QUFDdkMsVUFBTSxXQUFXLE9BQU8scUJBQXFCO0FBRzdDLFVBQU0sa0JBQWtCLEdBQUcsTUFBTTtBQUNqQyxVQUFNLGtCQUFrQixHQUFHLE1BQU07QUFHakMsT0FBRyxNQUFNLFVBQVUsYUFBYSxLQUFLO0FBQ3JDLE9BQUcsTUFBTSxrQkFBa0I7QUFHM0IsZUFBVyxNQUFNO0FBQ2YsU0FBRyxNQUFNLFVBQVU7QUFDbkIsU0FBRyxNQUFNLGtCQUFrQjtBQUFBLElBQzdCLEdBQUcsUUFBUTtBQUVYLFdBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLGFBQWEsT0FBTyxVQUFVLFdBQVM7QUFBQSxFQUN6RTtBQU1BLGlCQUFlLGdCQUFnQixRQUE4QztBQUMzRSxRQUFJLENBQUMsT0FBTyxZQUFZO0FBQ3RCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyw4QkFBQTtBQUFBLElBQ2xDO0FBQ0EsUUFBSTtBQUdGLFlBQU0sS0FBSyxJQUFJLFNBQVMsT0FBTyxVQUFVO0FBQ3pDLFlBQU1HLFVBQVMsTUFBTSxHQUFBO0FBRXJCLFlBQU0sYUFBYUEsWUFBVyxTQUFZLE9BQU8sS0FBSyxNQUFNLEtBQUssVUFBVUEsT0FBTSxDQUFDO0FBQ2xGLGFBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLFFBQVEsYUFBVztBQUFBLElBQ3JELFNBQVMsS0FBSztBQUNaLGFBQU87QUFBQSxRQUNMLFNBQVM7QUFBQSxRQUNULE9BQU8sa0JBQWtCLGVBQWUsUUFBUSxJQUFJLFVBQVUsT0FBTyxHQUFHLENBQUM7QUFBQSxNQUFBO0FBQUEsSUFFN0U7QUFBQSxFQUNGO0FBTUEsV0FBUyxvQkFBb0IsUUFBcUM7QUFDaEUsUUFBSSxDQUFDLE9BQU8sVUFBVTtBQUNwQixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sZ0NBQUE7QUFBQSxJQUNsQztBQUNBLFVBQU0sS0FBSyxTQUFTLGNBQWMsT0FBTyxRQUFRO0FBQ2pELFFBQUksQ0FBQyxJQUFJO0FBQ1AsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLFVBQVUsT0FBTyxRQUFRLEdBQUE7QUFBQSxJQUMzRDtBQUNBLFFBQUksR0FBRyxRQUFRLFlBQUEsTUFBa0IsVUFBVTtBQUN6QyxhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sdUJBQXVCLEdBQUcsUUFBUSxhQUFhLElBQUE7QUFBQSxJQUNqRjtBQUVBLFFBQUksVUFBVTtBQUNkLFVBQU0sVUFBVSxHQUFHO0FBRW5CLFFBQUksT0FBTyxnQkFBZ0IsUUFBVztBQUVwQyxlQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsUUFBUSxLQUFLO0FBQ3ZDLFlBQUksUUFBUSxDQUFDLEVBQUUsVUFBVSxPQUFPLGFBQWE7QUFDM0MsYUFBRyxnQkFBZ0I7QUFDbkIsb0JBQVU7QUFDVjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixXQUFXLE9BQU8sZUFBZSxRQUFXO0FBRTFDLGVBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxRQUFRLEtBQUs7QUFDdkMsWUFBSSxRQUFRLENBQUMsRUFBRSxLQUFLLFdBQVcsT0FBTyxXQUFXLFFBQVE7QUFDdkQsYUFBRyxnQkFBZ0I7QUFDbkIsb0JBQVU7QUFDVjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixPQUFPO0FBQ0wsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLDhDQUFBO0FBQUEsSUFDbEM7QUFFQSxRQUFJLENBQUMsU0FBUztBQUNaLGFBQU87QUFBQSxRQUNMLFNBQVM7QUFBQSxRQUNULE9BQU8sYUFBYSxPQUFPLGdCQUFnQixTQUFZLFVBQVUsT0FBTyxXQUFXLE1BQU0sU0FBUyxPQUFPLFVBQVUsR0FBRztBQUFBLE1BQUE7QUFBQSxJQUUxSDtBQUdBLE9BQUcsY0FBYyxJQUFJLE1BQU0sVUFBVSxFQUFFLFNBQVMsS0FBQSxDQUFNLENBQUM7QUFFdkQsVUFBTSxXQUFXLFFBQVEsR0FBRyxhQUFhO0FBQ3pDLFdBQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULE1BQU07QUFBQSxRQUNKLGVBQWUsR0FBRztBQUFBLFFBQ2xCLGVBQWUsU0FBUztBQUFBLFFBQ3hCLGNBQWMsU0FBUyxLQUFLLEtBQUE7QUFBQSxNQUFLO0FBQUEsSUFDbkM7QUFBQSxFQUVKO0FBTUEsV0FBUyxnQkFBZ0IsUUFBcUM7QUFDNUQsVUFBTSxXQUFXLE9BQU8sWUFBWTtBQUNwQyxVQUFNLFFBQVEsT0FBTyxXQUNqQixTQUFTLGNBQWMsT0FBTyxRQUFRLElBQ3RDO0FBRUosUUFBSSxPQUFPLFlBQVksQ0FBQyxPQUFPO0FBQzdCLGFBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxZQUFZLE9BQU8sUUFBUSxHQUFBO0FBQUEsSUFDN0Q7QUFFQSxVQUFNLFdBQVcsU0FBUyxVQUFVLGlCQUFpQixTQUFTO0FBQzlELFVBQU0sUUFBK0MsQ0FBQTtBQUNyRCxVQUFNLFFBQVEsS0FBSyxJQUFJLFFBQVEsUUFBUSxRQUFRO0FBRS9DLGFBQVMsSUFBSSxHQUFHLElBQUksT0FBTyxLQUFLO0FBQzlCLFlBQU0sSUFBSSxRQUFRLENBQUM7QUFDbkIsWUFBTSxLQUFLO0FBQUEsUUFDVCxNQUFNLEVBQUU7QUFBQSxRQUNSLE9BQU8sRUFBRSxlQUFlLElBQUksT0FBTyxNQUFNLEdBQUcsR0FBRztBQUFBLE1BQUEsQ0FDaEQ7QUFBQSxJQUNIO0FBRUEsV0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLE1BQ1QsTUFBTSxFQUFFLFlBQVksUUFBUSxRQUFRLFVBQVUsTUFBTSxRQUFRLE1BQUE7QUFBQSxJQUFNO0FBQUEsRUFFdEU7QUFLQSxRQUFNLG9DQUFvQixJQUFJO0FBQUEsSUFDNUI7QUFBQSxJQUFVO0FBQUEsSUFBUztBQUFBLElBQVk7QUFBQSxJQUFVO0FBQUEsSUFBTztBQUFBLElBQ2hEO0FBQUEsSUFBTztBQUFBLElBQVU7QUFBQSxJQUFVO0FBQUEsSUFBUztBQUFBLElBQVE7QUFBQSxJQUM1QztBQUFBLElBQVM7QUFBQSxJQUFZO0FBQUEsSUFBVTtBQUFBLEVBQ2pDLENBQUM7QUFHRCxRQUFNLHlDQUF5QixJQUFJO0FBQUEsSUFDakM7QUFBQSxJQUFLO0FBQUEsSUFBTTtBQUFBLElBQU07QUFBQSxJQUFNO0FBQUEsSUFBTTtBQUFBLElBQU07QUFBQSxJQUNuQztBQUFBLElBQU07QUFBQSxJQUFjO0FBQUEsSUFBTTtBQUFBLElBQU07QUFBQSxJQUFNO0FBQUEsSUFDdEM7QUFBQSxJQUFjO0FBQUEsSUFBVztBQUFBLElBQVc7QUFBQSxFQUN0QyxDQUFDO0FBT0QsUUFBTSwyQ0FBMkIsSUFBSTtBQUFBLElBQ25DO0FBQUEsSUFBSztBQUFBLElBQVE7QUFBQSxJQUFNO0FBQUEsSUFBVTtBQUFBLElBQUs7QUFBQSxJQUFLO0FBQUEsSUFBUTtBQUFBLElBQVE7QUFBQSxJQUFTO0FBQUEsRUFDbEUsQ0FBQztBQVNELFdBQVMsb0JBQTZCO0FBQ3BDLFVBQU0sYUFBYTtBQUFBLE1BQ2pCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQTtBQUFBLE1BRUE7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUFBO0FBRUYsZUFBVyxPQUFPLFlBQVk7QUFDNUIsWUFBTSxLQUFLLFNBQVMsY0FBYyxHQUFHO0FBQ3JDLFVBQUksTUFBTSxHQUFHLGVBQWUsR0FBRyxZQUFZLEtBQUEsRUFBTyxTQUFTLEtBQUs7QUFDOUQsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBQ0EsV0FBTyxTQUFTO0FBQUEsRUFDbEI7QUFVQSxXQUFTLHVCQUF1QixXQUErQjtBQUM3RCxVQUFNLGVBQWUsVUFBVSxRQUFRLFlBQUE7QUFHdkMsUUFBSSxpQkFBaUIsUUFBUSxpQkFBaUIsTUFBTTtBQUNsRCxhQUFPLENBQUE7QUFBQSxJQUNUO0FBRUEsVUFBTSxjQUFjLE1BQU0sS0FBSyxvQkFBb0IsRUFBRSxLQUFLLEdBQUc7QUFDN0QsVUFBTSxZQUFZLFVBQVUsaUJBQWlCLFdBQVc7QUFDeEQsVUFBTSxTQUFvQixDQUFBO0FBRTFCLGVBQVcsTUFBTSxXQUFXO0FBQzFCLFlBQU0sUUFBUSxHQUFHLGVBQWUsSUFBSSxLQUFBO0FBQ3BDLFVBQUksS0FBSyxTQUFTLEdBQUc7QUFBRTtBQUFBLE1BQVU7QUFDakMsVUFBSSxHQUFHLFFBQVEsa0JBQWtCLEdBQUc7QUFBRTtBQUFBLE1BQVU7QUFHaEQsWUFBTSxlQUFlLEdBQUcsaUJBQWlCLFdBQVc7QUFDcEQsVUFBSSxlQUFlO0FBQ25CLGlCQUFXLFNBQVMsY0FBYztBQUNoQyxhQUFLLE1BQU0sZUFBZSxJQUFJLEtBQUEsRUFBTyxVQUFVLEdBQUc7QUFDaEQseUJBQWU7QUFDZjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBR0EsVUFBSSxDQUFDLGNBQWM7QUFDakIsZUFBTyxLQUFLLEVBQUU7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQU1BLFdBQVMseUJBQXlCLFFBQXFDO0FBQ3JFLFVBQU0sUUFBUSxPQUFPLGdCQUNqQixTQUFTLGNBQWMsT0FBTyxhQUFhLElBQzNDLGtCQUFBO0FBRUosUUFBSSxDQUFDLE9BQU87QUFDVixhQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sWUFBWSxPQUFPLGFBQWEsR0FBQTtBQUFBLElBQ2xFO0FBRUEsVUFBTSxXQUFXLE9BQU8sWUFBWTtBQUNwQyxVQUFNLGFBQStELENBQUE7QUFDckUsUUFBSSxZQUFZO0FBSWhCLGFBQVMsS0FBSyxNQUFxQjtBQUNqQyxVQUFJLFdBQVcsVUFBVSxVQUFVO0FBQUU7QUFBQSxNQUFRO0FBRTdDLFlBQU0sTUFBTSxLQUFLLFFBQVEsWUFBQTtBQUd6QixVQUFJLGNBQWMsSUFBSSxHQUFHLEdBQUc7QUFBRTtBQUFBLE1BQVE7QUFHdEMsVUFBSSxnQkFBZ0IsYUFBYTtBQUMvQixjQUFNLFFBQVEsT0FBTyxpQkFBaUIsSUFBSTtBQUMxQyxZQUFJLE1BQU0sWUFBWSxVQUFVLE1BQU0sZUFBZSxVQUFVO0FBQUU7QUFBQSxRQUFRO0FBQUEsTUFDM0U7QUFHQSxVQUFJLEtBQUssVUFBVSxTQUFTLGlCQUFpQixHQUFHO0FBQUU7QUFBQSxNQUFRO0FBRzFELFVBQUksbUJBQW1CLElBQUksR0FBRyxHQUFHO0FBQy9CLGNBQU0sUUFBUSxLQUFLLGVBQWUsSUFBSSxLQUFBO0FBRXRDLFlBQUksS0FBSyxVQUFVLEdBQUc7QUFJcEIsZ0JBQU0sWUFBWSx1QkFBdUIsSUFBSTtBQUM3QyxjQUFJLFVBQVUsU0FBUyxHQUFHO0FBQ3hCLHVCQUFXLFFBQVEsV0FBVztBQUM1QixrQkFBSSxXQUFXLFVBQVUsVUFBVTtBQUFFO0FBQUEsY0FBTztBQUM1QyxvQkFBTSxZQUFZLEtBQUssZUFBZSxJQUFJLEtBQUE7QUFDMUMsa0JBQUksU0FBUyxVQUFVLEdBQUc7QUFDeEIsc0JBQU1FLE1BQUssT0FBTyxXQUFXO0FBQzdCLHFCQUFLLGFBQWEsZUFBZUEsR0FBRTtBQUNuQywyQkFBVyxLQUFLO0FBQUEsa0JBQ2QsSUFBQUE7QUFBQUEsa0JBQ0EsS0FBSyxLQUFLLFFBQVEsWUFBQTtBQUFBLGtCQUNsQixNQUFNLFNBQVMsTUFBTSxHQUFHLEdBQUk7QUFBQSxnQkFBQSxDQUM3QjtBQUFBLGNBQ0g7QUFBQSxZQUNGO0FBQ0E7QUFBQSxVQUNGO0FBR0EsZ0JBQU0sS0FBSyxPQUFPLFdBQVc7QUFDN0IsZUFBSyxhQUFhLGVBQWUsRUFBRTtBQUNuQyxxQkFBVyxLQUFLLEVBQUUsSUFBSSxLQUFLLE1BQU0sS0FBSyxNQUFNLEdBQUcsR0FBSSxHQUFHO0FBQUEsUUFDeEQ7QUFDQTtBQUFBLE1BQ0Y7QUFHQSxlQUFTLElBQUksR0FBRyxJQUFJLEtBQUssU0FBUyxRQUFRLEtBQUs7QUFDN0MsYUFBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0FBQUEsTUFDdkI7QUFBQSxJQUNGO0FBRUEsU0FBSyxLQUFnQjtBQUVyQixXQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsTUFDVCxNQUFNO0FBQUEsUUFDSixnQkFBZ0IsV0FBVztBQUFBLFFBQzNCLE9BQU8sT0FBTyxpQkFBaUI7QUFBQSxRQUMvQjtBQUFBLE1BQUE7QUFBQSxJQUNGO0FBQUEsRUFFSjtBQUdBLFFBQU0sZUFBZTtBQUNyQixRQUFNLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFvQmhCLFdBQVMsaUJBQXVCO0FBQzlCLFFBQUksQ0FBQyxTQUFTLGVBQWUsWUFBWSxHQUFHO0FBQzFDLFlBQU0sVUFBVSxTQUFTLGNBQWMsT0FBTztBQUM5QyxjQUFRLEtBQUs7QUFDYixjQUFRLGNBQWM7QUFDdEIsZUFBUyxLQUFLLFlBQVksT0FBTztBQUFBLElBQ25DO0FBQUEsRUFDRjtBQU1BLFdBQVMsdUJBQXVCLFFBQXFDOztBQUNuRSxVQUFNLE9BQU8sT0FBTyxjQUFjO0FBRWxDLFlBQVEsTUFBQTtBQUFBLE1BQ04sS0FBSyxVQUFVO0FBQ2IsWUFBSSxDQUFDLE9BQU8sY0FBYztBQUN4QixpQkFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLHdDQUFBO0FBQUEsUUFDbEM7QUFFQSxZQUFJO0FBQ0osWUFBSTtBQUNGLGNBQUksU0FBUyxLQUFLLE1BQU0sT0FBTyxZQUFZO0FBRzNDLGNBQUksV0FBVyxRQUFRLE9BQU8sV0FBVyxZQUFZLENBQUMsTUFBTSxRQUFRLE1BQU0sR0FBRztBQUUzRSxrQkFBTSxRQUFTLE9BQW1DO0FBQ2xELGdCQUFJLFNBQVMsTUFBTSxRQUFRLEtBQUssR0FBRztBQUFFLHVCQUFTO0FBQUEsWUFBTztBQUFBLFVBQ3ZEO0FBRUEsY0FBSSxDQUFDLE1BQU0sUUFBUSxNQUFNLEdBQUc7QUFDMUIsbUJBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxnREFBQTtBQUFBLFVBQ2xDO0FBSUEsY0FBSSxPQUFPLFNBQVMsS0FBSyxPQUFPLE9BQU8sQ0FBQyxNQUFNLFVBQVU7QUFDdEQsb0JBQVMsT0FBb0IsSUFBSSxDQUFDLE1BQU0sU0FBUztBQUFBLGNBQy9DLElBQUksT0FBTyxHQUFHO0FBQUEsY0FDZCxZQUFZO0FBQUEsWUFBQSxFQUNaO0FBQUEsVUFDSixPQUFPO0FBQ0wsb0JBQVE7QUFBQSxVQUNWO0FBQUEsUUFDRixRQUFRO0FBQ04saUJBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyw0QkFBQTtBQUFBLFFBQ2xDO0FBRUEsdUJBQUE7QUFLQSxZQUFJLGlCQUFpQjtBQUNyQixjQUFNLGlCQUFpQixTQUFTLGlCQUFpQixlQUFlLEVBQUU7QUFDbEUsWUFBSSxtQkFBbUIsS0FBSyxNQUFNLFNBQVMsR0FBRztBQUM1QyxrQkFBUSxJQUFJLDBDQUEwQztBQUN0RCxnQkFBTSxrQkFBa0IseUJBQXlCLENBQTRCLENBQUM7QUFDOUUsY0FBSSxnQkFBZ0IsV0FBVyxnQkFBZ0IsTUFBTTtBQUNuRCxrQkFBTSxTQUFTLGdCQUFnQjtBQUMvQixvQkFBUSxJQUFJLHVCQUF1QixPQUFPLGNBQWMsTUFBTTtBQUM5RCw2QkFBaUI7QUFBQSxVQUNuQixPQUFPO0FBQ0wsb0JBQVEsS0FBSyxrQkFBa0IsZ0JBQWdCLEtBQUs7QUFBQSxVQUN0RDtBQUFBLFFBQ0Y7QUFFQSxZQUFJLFdBQVc7QUFDZixZQUFJLFVBQVU7QUFFZCxtQkFBVyxRQUFRLE9BQU87QUFDeEIsY0FBSSxDQUFDLEtBQUssTUFBTSxDQUFDLEtBQUssWUFBWTtBQUNoQztBQUNBO0FBQUEsVUFDRjtBQUVBLGdCQUFNLFdBQVcsU0FBUyxjQUFjLGlCQUFpQixLQUFLLEVBQUUsSUFBSTtBQUNwRSxjQUFJLENBQUMsVUFBVTtBQUNiO0FBQ0E7QUFBQSxVQUNGO0FBR0EsZ0JBQU0sc0JBQXNCLFNBQVMsY0FBYyxxQ0FBcUMsS0FBSyxFQUFFLElBQUk7QUFDbkcsY0FBSSxxQkFBcUI7QUFFdkIsZ0NBQW9CLGNBQWMsS0FBSztBQUN2QyxnQ0FBb0IsVUFBVSxPQUFPLFlBQVk7QUFDakQ7QUFDQTtBQUFBLFVBQ0Y7QUFHQSxnQkFBTSxlQUFlLFNBQVMsY0FBYyxLQUFLO0FBQ2pELHVCQUFhLFlBQVk7QUFDekIsdUJBQWEsYUFBYSxtQkFBbUIsS0FBSyxFQUFFO0FBQ3BELHVCQUFhLGNBQWMsS0FBSztBQUdoQyx5QkFBUyxlQUFULG1CQUFxQixhQUFhLGNBQWMsU0FBUztBQUN6RDtBQUFBLFFBQ0Y7QUFJQSxZQUFJO0FBQ0osWUFBSSxhQUFhLEtBQUssVUFBVSxHQUFHO0FBQ2pDLGdCQUFNLGlCQUEyQixDQUFBO0FBQ2pDLGdCQUFNLG1CQUE2QixDQUFBO0FBRW5DLGNBQUksZ0JBQWdCO0FBRWxCLDJCQUFlO0FBQUEsY0FDYjtBQUFBLFlBQUE7QUFFRiw2QkFBaUIsS0FBSyw2REFBNkQ7QUFBQSxVQUNyRixPQUFPO0FBRUwsa0JBQU0sY0FBYyxTQUFTLGlCQUFpQixlQUFlLEVBQUU7QUFDL0QsZ0JBQUksY0FBYyxHQUFHO0FBQ25CLDZCQUFlO0FBQUEsZ0JBQ2IsUUFBUSxXQUFXO0FBQUEsY0FBQTtBQUVyQiwrQkFBaUIsS0FBSyxnRUFBZ0U7QUFBQSxZQUN4RixPQUFPO0FBQ0wsNkJBQWUsS0FBSyx5Q0FBeUM7QUFDN0QsNkJBQWUsS0FBSyw0QkFBNEI7QUFDaEQsK0JBQWlCLEtBQUssa0JBQWtCO0FBQ3hDLCtCQUFpQixLQUFLLDZEQUE2RDtBQUFBLFlBQ3JGO0FBQUEsVUFDRjtBQUVBLHVCQUFhLEVBQUUsZ0JBQWdCLGlCQUFBO0FBQy9CLGtCQUFRLEtBQUssbUJBQW1CLFVBQVU7QUFBQSxRQUM1QztBQUVBLGVBQU87QUFBQSxVQUNMLFNBQVM7QUFBQSxVQUNULE1BQU07QUFBQSxZQUNKLE1BQU07QUFBQSxZQUNOO0FBQUEsWUFDQTtBQUFBLFlBQ0EsT0FBTyxNQUFNO0FBQUEsWUFDYixHQUFJLGlCQUFpQixFQUFFLGdCQUFnQixLQUFBLElBQVMsQ0FBQTtBQUFBLFlBQ2hELEdBQUksYUFBYSxFQUFFLGVBQWUsQ0FBQTtBQUFBLFVBQUM7QUFBQSxRQUNyQztBQUFBLE1BRUo7QUFBQSxNQUVBLEtBQUssVUFBVTtBQUNiLGNBQU0sZUFBZSxTQUFTLGlCQUFpQixrQkFBa0I7QUFDakUsWUFBSSxhQUFhLFdBQVcsR0FBRztBQUM3QixpQkFBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEVBQUUsTUFBTSxVQUFVLFNBQVMsWUFBWSxTQUFTLEVBQUEsRUFBRTtBQUFBLFFBQ2xGO0FBR0EsY0FBTSxXQUFXLGFBQWEsQ0FBQyxFQUFFLFVBQVUsU0FBUyxZQUFZO0FBRWhFLHFCQUFhLFFBQVEsQ0FBQyxPQUFPO0FBQzNCLGNBQUksVUFBVTtBQUNaLGVBQUcsVUFBVSxPQUFPLFlBQVk7QUFBQSxVQUNsQyxPQUFPO0FBQ0wsZUFBRyxVQUFVLElBQUksWUFBWTtBQUFBLFVBQy9CO0FBQUEsUUFDRixDQUFDO0FBRUQsZUFBTztBQUFBLFVBQ0wsU0FBUztBQUFBLFVBQ1QsTUFBTTtBQUFBLFlBQ0osTUFBTTtBQUFBLFlBQ04sVUFBVSxXQUFXLFlBQVk7QUFBQSxZQUNqQyxTQUFTLGFBQWE7QUFBQSxVQUFBO0FBQUEsUUFDeEI7QUFBQSxNQUVKO0FBQUEsTUFFQSxLQUFLLFNBQVM7QUFDWixjQUFNLGVBQWUsU0FBUyxpQkFBaUIsa0JBQWtCO0FBQ2pFLGNBQU0sUUFBUSxhQUFhO0FBQzNCLHFCQUFhLFFBQVEsQ0FBQyxPQUFPLEdBQUcsUUFBUTtBQUd4QyxjQUFNLFNBQVMsU0FBUyxpQkFBaUIsZUFBZTtBQUN4RCxlQUFPLFFBQVEsQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLGFBQWEsQ0FBQztBQUd4RCxjQUFNLFVBQVUsU0FBUyxlQUFlLFlBQVk7QUFDcEQsWUFBSSxTQUFTO0FBQUUsa0JBQVEsT0FBQTtBQUFBLFFBQVU7QUFFakMsZUFBTztBQUFBLFVBQ0wsU0FBUztBQUFBLFVBQ1QsTUFBTSxFQUFFLE1BQU0sU0FBUyxTQUFTLE1BQUE7QUFBQSxRQUFNO0FBQUEsTUFFMUM7QUFBQSxNQUVBO0FBQ0UsZUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLDRCQUE0QixJQUFJLEdBQUE7QUFBQSxJQUFHO0FBQUEsRUFFekU7QUFRQSxpQkFBc0IsY0FBYyxRQUE4QztBQUNoRixRQUFJO0FBQ0YsY0FBUSxPQUFPLE1BQUE7QUFBQSxRQUNiLEtBQUs7QUFDSCxpQkFBTyxhQUFhLE1BQU07QUFBQSxRQUU1QixLQUFLO0FBQ0gsaUJBQU8sWUFBWSxNQUFNO0FBQUEsUUFFM0IsS0FBSztBQUNILGlCQUFPLGNBQWMsTUFBTTtBQUFBLFFBRTdCLEtBQUs7QUFFSCxjQUFJLENBQUMsT0FBTyxLQUFLO0FBQ2YsbUJBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyx1QkFBQTtBQUFBLFVBQ2xDO0FBQ0EsaUJBQU8sU0FBUyxPQUFPLE9BQU87QUFDOUIsaUJBQU8sRUFBRSxTQUFTLE1BQU0sTUFBTSxFQUFFLFdBQVcsT0FBTyxNQUFJO0FBQUEsUUFFeEQsS0FBSztBQUNILGlCQUFPLHFCQUFxQixNQUFNO0FBQUEsUUFFcEMsS0FBSztBQUNILGlCQUFPLHdCQUF3QixNQUFNO0FBQUEsUUFFdkMsS0FBSztBQUNILGlCQUFPLHNCQUFzQixNQUFNO0FBQUEsUUFFckMsS0FBSztBQUNILGlCQUFPLG9CQUFvQixNQUFNO0FBQUEsUUFFbkMsS0FBSztBQUNILGlCQUFPLGdCQUFnQixNQUFNO0FBQUEsUUFFL0IsS0FBSztBQUVILGlCQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sa0NBQUE7QUFBQSxRQUVsQyxLQUFLO0FBQ0gsaUJBQU8sc0JBQXNCLE1BQU07QUFBQSxRQUVyQyxLQUFLO0FBQ0gsaUJBQU8saUJBQWlCLE1BQU07QUFBQSxRQUVoQyxLQUFLO0FBQ0gsaUJBQU8sZ0JBQWdCLE1BQU07QUFBQSxRQUUvQixLQUFLO0FBQ0gsaUJBQU8sb0JBQW9CLE1BQU07QUFBQSxRQUVuQyxLQUFLO0FBQ0gsaUJBQU8sZ0JBQWdCLE1BQU07QUFBQTtBQUFBLFFBRy9CLEtBQUs7QUFDSCxpQkFBTyx5QkFBeUIsTUFBTTtBQUFBLFFBRXhDLEtBQUs7QUFDSCxpQkFBTyx1QkFBdUIsTUFBTTtBQUFBLFFBRXRDO0FBQ0UsaUJBQU8sRUFBRSxTQUFTLE9BQU8sT0FBTyxhQUFjLE9BQXlCLElBQUksR0FBQTtBQUFBLE1BQUc7QUFBQSxJQUVwRixTQUFTLEtBQUs7QUFDWixhQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxPQUFPLFFBQVEsT0FBTyxJQUFJLFFBQVEsZUFBZSxRQUFRLElBQUksVUFBVSxPQUFPLEdBQUcsQ0FBQztBQUFBLE1BQUE7QUFBQSxJQUV0RjtBQUFBLEVBQ0Y7O0FDcDlCQSxRQUFBLDBCQUFBO0FBUUEsUUFBQSxhQUFBLG9CQUFBO0FBQUEsSUFBbUMsU0FBQSxDQUFBLFlBQUE7QUFBQSxJQUNYLE9BQUE7QUFFcEIsY0FBQSxJQUFBLHFEQUFBLFNBQUEsSUFBQTtBQUdBLGNBQUEsUUFBQSxVQUFBLFlBQUEsQ0FBQSxTQUFBLFNBQUEsaUJBQUE7O0FBQ0UsWUFBQSxRQUFBLFNBQUEsb0JBQUE7QUFDRSxnQkFBQSxnQkFBQSxZQUFBLGFBQUEsTUFBQSxtQkFBQSxlQUFBO0FBQ0EsZ0JBQUEsZUFBQSxZQUFBLFVBQUEsR0FBQSx1QkFBQTtBQUNBLGdCQUFBLFVBQUE7QUFBQSxZQUE2QixLQUFBLFNBQUE7QUFBQSxZQUNiLE9BQUEsU0FBQTtBQUFBLFlBQ0U7QUFBQSxVQUNoQjtBQUVGLGNBQUEsWUFBQSxTQUFBLHlCQUFBO0FBQ0Usb0JBQUEsSUFBQSwrQkFBQSxZQUFBLFFBQUEsTUFBQSx1QkFBQTtBQUFBLFVBQTRGO0FBRTlGLGtCQUFBLElBQUEsc0JBQUEsUUFBQSxLQUFBLFdBQUEsUUFBQSxhQUFBLE1BQUE7QUFDQSx1QkFBQSxFQUFBLE1BQUEsZ0JBQUEsU0FBQSxRQUFBLENBQUE7QUFDQSxpQkFBQTtBQUFBLFFBQU87QUFJVCxZQUFBLFFBQUEsU0FBQSxrQkFBQTtBQUNFLGdCQUFBLFNBQUEsUUFBQTtBQUNBLGtCQUFBLElBQUEsc0JBQUEsT0FBQSxNQUFBLE9BQUEsWUFBQSxFQUFBO0FBR0Esd0JBQUEsTUFBQSxFQUFBLEtBQUEsQ0FBQUYsWUFBQTtBQUVJLG9CQUFBLElBQUEsbUJBQUEsT0FBQSxNQUFBQSxRQUFBLE9BQUE7QUFDQSx5QkFBQSxFQUFBLE1BQUEsaUJBQUEsU0FBQUEsUUFBQSxDQUFBO0FBQUEsVUFBdUQsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxRQUFBO0FBR3ZELGtCQUFBLFdBQUEsZUFBQSxRQUFBLElBQUEsVUFBQSxPQUFBLEdBQUE7QUFDQSxvQkFBQSxNQUFBLHFCQUFBLE9BQUEsTUFBQSxRQUFBO0FBQ0EseUJBQUE7QUFBQSxjQUFhLE1BQUE7QUFBQSxjQUNMLFNBQUEsRUFBQSxTQUFBLE9BQUEsT0FBQSxTQUFBO0FBQUEsWUFDcUMsQ0FBQTtBQUFBLFVBQzVDLENBQUE7QUFFTCxpQkFBQTtBQUFBLFFBQU87QUFHVCxlQUFBO0FBQUEsTUFBTyxDQUFBO0FBSVQsZUFBQSxpQkFBQSxtQkFBQSxNQUFBOztBQUNFLGNBQUEsZ0JBQUEsWUFBQSxhQUFBLE1BQUEsbUJBQUEsZUFBQTtBQUNBLFlBQUEsWUFBQSxTQUFBLEdBQUE7QUFDRSxnQkFBQSxlQUFBLFlBQUEsVUFBQSxHQUFBLHVCQUFBO0FBQ0EsY0FBQSxZQUFBLFNBQUEseUJBQUE7QUFDRSxvQkFBQSxJQUFBLGlDQUFBLFlBQUEsUUFBQSxNQUFBLHVCQUFBO0FBQUEsVUFBOEY7QUFFaEcsa0JBQUEsUUFBQSxZQUFBO0FBQUEsWUFBNEIsTUFBQTtBQUFBLFlBQ3BCLFNBQUE7QUFBQSxjQUNHLEtBQUEsU0FBQTtBQUFBLGNBQ08sT0FBQSxTQUFBO0FBQUEsY0FDRTtBQUFBLFlBQ2hCO0FBQUEsVUFDRixDQUFBLEVBQUEsTUFBQSxNQUFBO0FBQUEsVUFDYSxDQUFBO0FBQUEsUUFFZDtBQUFBLE1BQ0gsQ0FBQTtBQUFBLElBQ0Q7QUFBQSxFQUVMLENBQUE7O0FDdEZBLFdBQVNHLFFBQU0sV0FBVyxNQUFNO0FBRTlCLFFBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxVQUFVO0FBQy9CLFlBQU0sVUFBVSxLQUFLLE1BQUE7QUFDckIsYUFBTyxTQUFTLE9BQU8sSUFBSSxHQUFHLElBQUk7QUFBQSxJQUNwQyxPQUFPO0FBQ0wsYUFBTyxTQUFTLEdBQUcsSUFBSTtBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUNPLFFBQU1DLFdBQVM7QUFBQSxJQUNwQixPQUFPLElBQUksU0FBU0QsUUFBTSxRQUFRLE9BQU8sR0FBRyxJQUFJO0FBQUEsSUFDaEQsS0FBSyxJQUFJLFNBQVNBLFFBQU0sUUFBUSxLQUFLLEdBQUcsSUFBSTtBQUFBLElBQzVDLE1BQU0sSUFBSSxTQUFTQSxRQUFNLFFBQVEsTUFBTSxHQUFHLElBQUk7QUFBQSxJQUM5QyxPQUFPLElBQUksU0FBU0EsUUFBTSxRQUFRLE9BQU8sR0FBRyxJQUFJO0FBQUEsRUFDbEQ7QUNiTyxRQUFNLDBCQUFOLE1BQU0sZ0NBQStCLE1BQU07QUFBQSxJQUNoRCxZQUFZLFFBQVEsUUFBUTtBQUMxQixZQUFNLHdCQUF1QixZQUFZLEVBQUU7QUFDM0MsV0FBSyxTQUFTO0FBQ2QsV0FBSyxTQUFTO0FBQUEsSUFDaEI7QUFBQSxFQUVGO0FBREUsZ0JBTlcseUJBTUosY0FBYSxtQkFBbUIsb0JBQW9CO0FBTnRELE1BQU0seUJBQU47QUFRQSxXQUFTLG1CQUFtQixXQUFXOztBQUM1QyxXQUFPLElBQUcsd0NBQVMsWUFBVCxtQkFBa0IsRUFBRSxJQUFJLFNBQTBCLElBQUksU0FBUztBQUFBLEVBQzNFO0FDVk8sV0FBUyxzQkFBc0IsS0FBSztBQUN6QyxRQUFJO0FBQ0osUUFBSTtBQUNKLFdBQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS0wsTUFBTTtBQUNKLFlBQUksWUFBWSxLQUFNO0FBQ3RCLGlCQUFTLElBQUksSUFBSSxTQUFTLElBQUk7QUFDOUIsbUJBQVcsSUFBSSxZQUFZLE1BQU07QUFDL0IsY0FBSSxTQUFTLElBQUksSUFBSSxTQUFTLElBQUk7QUFDbEMsY0FBSSxPQUFPLFNBQVMsT0FBTyxNQUFNO0FBQy9CLG1CQUFPLGNBQWMsSUFBSSx1QkFBdUIsUUFBUSxNQUFNLENBQUM7QUFDL0QscUJBQVM7QUFBQSxVQUNYO0FBQUEsUUFDRixHQUFHLEdBQUc7QUFBQSxNQUNSO0FBQUEsSUFDSjtBQUFBLEVBQ0E7QUNqQk8sUUFBTSx3QkFBTixNQUFNLHNCQUFxQjtBQUFBLElBQ2hDLFlBQVksbUJBQW1CLFNBQVM7QUFjeEMsd0NBQWEsT0FBTyxTQUFTLE9BQU87QUFDcEM7QUFDQSw2Q0FBa0Isc0JBQXNCLElBQUk7QUFDNUMsZ0RBQXFDLG9CQUFJLElBQUc7QUFoQjFDLFdBQUssb0JBQW9CO0FBQ3pCLFdBQUssVUFBVTtBQUNmLFdBQUssa0JBQWtCLElBQUksZ0JBQWU7QUFDMUMsVUFBSSxLQUFLLFlBQVk7QUFDbkIsYUFBSyxzQkFBc0IsRUFBRSxrQkFBa0IsS0FBSSxDQUFFO0FBQ3JELGFBQUssZUFBYztBQUFBLE1BQ3JCLE9BQU87QUFDTCxhQUFLLHNCQUFxQjtBQUFBLE1BQzVCO0FBQUEsSUFDRjtBQUFBLElBUUEsSUFBSSxTQUFTO0FBQ1gsYUFBTyxLQUFLLGdCQUFnQjtBQUFBLElBQzlCO0FBQUEsSUFDQSxNQUFNLFFBQVE7QUFDWixhQUFPLEtBQUssZ0JBQWdCLE1BQU0sTUFBTTtBQUFBLElBQzFDO0FBQUEsSUFDQSxJQUFJLFlBQVk7QUFDZCxVQUFJLFFBQVEsUUFBUSxNQUFNLE1BQU07QUFDOUIsYUFBSyxrQkFBaUI7QUFBQSxNQUN4QjtBQUNBLGFBQU8sS0FBSyxPQUFPO0FBQUEsSUFDckI7QUFBQSxJQUNBLElBQUksVUFBVTtBQUNaLGFBQU8sQ0FBQyxLQUFLO0FBQUEsSUFDZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFjQSxjQUFjLElBQUk7QUFDaEIsV0FBSyxPQUFPLGlCQUFpQixTQUFTLEVBQUU7QUFDeEMsYUFBTyxNQUFNLEtBQUssT0FBTyxvQkFBb0IsU0FBUyxFQUFFO0FBQUEsSUFDMUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFZQSxRQUFRO0FBQ04sYUFBTyxJQUFJLFFBQVEsTUFBTTtBQUFBLE1BQ3pCLENBQUM7QUFBQSxJQUNIO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJQSxZQUFZLFNBQVMsU0FBUztBQUM1QixZQUFNLEtBQUssWUFBWSxNQUFNO0FBQzNCLFlBQUksS0FBSyxRQUFTLFNBQU87QUFBQSxNQUMzQixHQUFHLE9BQU87QUFDVixXQUFLLGNBQWMsTUFBTSxjQUFjLEVBQUUsQ0FBQztBQUMxQyxhQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSUEsV0FBVyxTQUFTLFNBQVM7QUFDM0IsWUFBTSxLQUFLLFdBQVcsTUFBTTtBQUMxQixZQUFJLEtBQUssUUFBUyxTQUFPO0FBQUEsTUFDM0IsR0FBRyxPQUFPO0FBQ1YsV0FBSyxjQUFjLE1BQU0sYUFBYSxFQUFFLENBQUM7QUFDekMsYUFBTztBQUFBLElBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0Esc0JBQXNCLFVBQVU7QUFDOUIsWUFBTSxLQUFLLHNCQUFzQixJQUFJLFNBQVM7QUFDNUMsWUFBSSxLQUFLLFFBQVMsVUFBUyxHQUFHLElBQUk7QUFBQSxNQUNwQyxDQUFDO0FBQ0QsV0FBSyxjQUFjLE1BQU0scUJBQXFCLEVBQUUsQ0FBQztBQUNqRCxhQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxvQkFBb0IsVUFBVSxTQUFTO0FBQ3JDLFlBQU0sS0FBSyxvQkFBb0IsSUFBSSxTQUFTO0FBQzFDLFlBQUksQ0FBQyxLQUFLLE9BQU8sUUFBUyxVQUFTLEdBQUcsSUFBSTtBQUFBLE1BQzVDLEdBQUcsT0FBTztBQUNWLFdBQUssY0FBYyxNQUFNLG1CQUFtQixFQUFFLENBQUM7QUFDL0MsYUFBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLGlCQUFpQixRQUFRLE1BQU0sU0FBUyxTQUFTOztBQUMvQyxVQUFJLFNBQVMsc0JBQXNCO0FBQ2pDLFlBQUksS0FBSyxRQUFTLE1BQUssZ0JBQWdCLElBQUc7QUFBQSxNQUM1QztBQUNBLG1CQUFPLHFCQUFQO0FBQUE7QUFBQSxRQUNFLEtBQUssV0FBVyxNQUFNLElBQUksbUJBQW1CLElBQUksSUFBSTtBQUFBLFFBQ3JEO0FBQUEsUUFDQTtBQUFBLFVBQ0UsR0FBRztBQUFBLFVBQ0gsUUFBUSxLQUFLO0FBQUEsUUFDckI7QUFBQTtBQUFBLElBRUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0Esb0JBQW9CO0FBQ2xCLFdBQUssTUFBTSxvQ0FBb0M7QUFDL0NDLGVBQU87QUFBQSxRQUNMLG1CQUFtQixLQUFLLGlCQUFpQjtBQUFBLE1BQy9DO0FBQUEsSUFDRTtBQUFBLElBQ0EsaUJBQWlCO0FBQ2YsYUFBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE1BQU0sc0JBQXFCO0FBQUEsVUFDM0IsbUJBQW1CLEtBQUs7QUFBQSxVQUN4QixXQUFXLEtBQUssT0FBTSxFQUFHLFNBQVMsRUFBRSxFQUFFLE1BQU0sQ0FBQztBQUFBLFFBQ3JEO0FBQUEsUUFDTTtBQUFBLE1BQ047QUFBQSxJQUNFO0FBQUEsSUFDQSx5QkFBeUIsT0FBTzs7QUFDOUIsWUFBTSx5QkFBdUIsV0FBTSxTQUFOLG1CQUFZLFVBQVMsc0JBQXFCO0FBQ3ZFLFlBQU0sd0JBQXNCLFdBQU0sU0FBTixtQkFBWSx1QkFBc0IsS0FBSztBQUNuRSxZQUFNLGlCQUFpQixDQUFDLEtBQUssbUJBQW1CLEtBQUksV0FBTSxTQUFOLG1CQUFZLFNBQVM7QUFDekUsYUFBTyx3QkFBd0IsdUJBQXVCO0FBQUEsSUFDeEQ7QUFBQSxJQUNBLHNCQUFzQixTQUFTO0FBQzdCLFVBQUksVUFBVTtBQUNkLFlBQU0sS0FBSyxDQUFDLFVBQVU7QUFDcEIsWUFBSSxLQUFLLHlCQUF5QixLQUFLLEdBQUc7QUFDeEMsZUFBSyxtQkFBbUIsSUFBSSxNQUFNLEtBQUssU0FBUztBQUNoRCxnQkFBTSxXQUFXO0FBQ2pCLG9CQUFVO0FBQ1YsY0FBSSxhQUFZLG1DQUFTLGtCQUFrQjtBQUMzQyxlQUFLLGtCQUFpQjtBQUFBLFFBQ3hCO0FBQUEsTUFDRjtBQUNBLHVCQUFpQixXQUFXLEVBQUU7QUFDOUIsV0FBSyxjQUFjLE1BQU0sb0JBQW9CLFdBQVcsRUFBRSxDQUFDO0FBQUEsSUFDN0Q7QUFBQSxFQUNGO0FBckpFLGdCQVpXLHVCQVlKLCtCQUE4QjtBQUFBLElBQ25DO0FBQUEsRUFDSjtBQWRPLE1BQU0sdUJBQU47QUNKUCxRQUFNLFVBQVUsT0FBTyxNQUFNO0FBRTdCLE1BQUksYUFBYTtBQUFBLEVBRUYsTUFBTSxvQkFBb0IsSUFBSTtBQUFBLElBQzVDLGNBQWM7QUFDYixZQUFLO0FBRUwsV0FBSyxnQkFBZ0Isb0JBQUksUUFBTztBQUNoQyxXQUFLLGdCQUFnQixvQkFBSTtBQUN6QixXQUFLLGNBQWMsb0JBQUksSUFBRztBQUUxQixZQUFNLENBQUMsS0FBSyxJQUFJO0FBQ2hCLFVBQUksVUFBVSxRQUFRLFVBQVUsUUFBVztBQUMxQztBQUFBLE1BQ0Q7QUFFQSxVQUFJLE9BQU8sTUFBTSxPQUFPLFFBQVEsTUFBTSxZQUFZO0FBQ2pELGNBQU0sSUFBSSxVQUFVLE9BQU8sUUFBUSxpRUFBaUU7QUFBQSxNQUNyRztBQUVBLGlCQUFXLENBQUMsTUFBTSxLQUFLLEtBQUssT0FBTztBQUNsQyxhQUFLLElBQUksTUFBTSxLQUFLO0FBQUEsTUFDckI7QUFBQSxJQUNEO0FBQUEsSUFFQSxlQUFlLE1BQU0sU0FBUyxPQUFPO0FBQ3BDLFVBQUksQ0FBQyxNQUFNLFFBQVEsSUFBSSxHQUFHO0FBQ3pCLGNBQU0sSUFBSSxVQUFVLHFDQUFxQztBQUFBLE1BQzFEO0FBRUEsWUFBTSxhQUFhLEtBQUssZUFBZSxNQUFNLE1BQU07QUFFbkQsVUFBSTtBQUNKLFVBQUksY0FBYyxLQUFLLFlBQVksSUFBSSxVQUFVLEdBQUc7QUFDbkQsb0JBQVksS0FBSyxZQUFZLElBQUksVUFBVTtBQUFBLE1BQzVDLFdBQVcsUUFBUTtBQUNsQixvQkFBWSxDQUFDLEdBQUcsSUFBSTtBQUNwQixhQUFLLFlBQVksSUFBSSxZQUFZLFNBQVM7QUFBQSxNQUMzQztBQUVBLGFBQU8sRUFBQyxZQUFZLFVBQVM7QUFBQSxJQUM5QjtBQUFBLElBRUEsZUFBZSxNQUFNLFNBQVMsT0FBTztBQUNwQyxZQUFNLGNBQWMsQ0FBQTtBQUNwQixlQUFTLE9BQU8sTUFBTTtBQUNyQixZQUFJLFFBQVEsTUFBTTtBQUNqQixnQkFBTTtBQUFBLFFBQ1A7QUFFQSxjQUFNLFNBQVMsT0FBTyxRQUFRLFlBQVksT0FBTyxRQUFRLGFBQWEsa0JBQW1CLE9BQU8sUUFBUSxXQUFXLGtCQUFrQjtBQUVySSxZQUFJLENBQUMsUUFBUTtBQUNaLHNCQUFZLEtBQUssR0FBRztBQUFBLFFBQ3JCLFdBQVcsS0FBSyxNQUFNLEVBQUUsSUFBSSxHQUFHLEdBQUc7QUFDakMsc0JBQVksS0FBSyxLQUFLLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQztBQUFBLFFBQ3ZDLFdBQVcsUUFBUTtBQUNsQixnQkFBTSxhQUFhLGFBQWEsWUFBWTtBQUM1QyxlQUFLLE1BQU0sRUFBRSxJQUFJLEtBQUssVUFBVTtBQUNoQyxzQkFBWSxLQUFLLFVBQVU7QUFBQSxRQUM1QixPQUFPO0FBQ04saUJBQU87QUFBQSxRQUNSO0FBQUEsTUFDRDtBQUVBLGFBQU8sS0FBSyxVQUFVLFdBQVc7QUFBQSxJQUNsQztBQUFBLElBRUEsSUFBSSxNQUFNLE9BQU87QUFDaEIsWUFBTSxFQUFDLFVBQVMsSUFBSSxLQUFLLGVBQWUsTUFBTSxJQUFJO0FBQ2xELGFBQU8sTUFBTSxJQUFJLFdBQVcsS0FBSztBQUFBLElBQ2xDO0FBQUEsSUFFQSxJQUFJLE1BQU07QUFDVCxZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQzVDLGFBQU8sTUFBTSxJQUFJLFNBQVM7QUFBQSxJQUMzQjtBQUFBLElBRUEsSUFBSSxNQUFNO0FBQ1QsWUFBTSxFQUFDLFVBQVMsSUFBSSxLQUFLLGVBQWUsSUFBSTtBQUM1QyxhQUFPLE1BQU0sSUFBSSxTQUFTO0FBQUEsSUFDM0I7QUFBQSxJQUVBLE9BQU8sTUFBTTtBQUNaLFlBQU0sRUFBQyxXQUFXLFdBQVUsSUFBSSxLQUFLLGVBQWUsSUFBSTtBQUN4RCxhQUFPLFFBQVEsYUFBYSxNQUFNLE9BQU8sU0FBUyxLQUFLLEtBQUssWUFBWSxPQUFPLFVBQVUsQ0FBQztBQUFBLElBQzNGO0FBQUEsSUFFQSxRQUFRO0FBQ1AsWUFBTSxNQUFLO0FBQ1gsV0FBSyxjQUFjLE1BQUs7QUFDeEIsV0FBSyxZQUFZLE1BQUs7QUFBQSxJQUN2QjtBQUFBLElBRUEsS0FBSyxPQUFPLFdBQVcsSUFBSTtBQUMxQixhQUFPO0FBQUEsSUFDUjtBQUFBLElBRUEsSUFBSSxPQUFPO0FBQ1YsYUFBTyxNQUFNO0FBQUEsSUFDZDtBQUFBLEVBQ0Q7QUNsRm1CLE1BQUksWUFBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiw1LDYsNyw4LDksMTBdfQ==
