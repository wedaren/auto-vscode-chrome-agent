type AnyCallback = (...args: any[]) => any;

interface BrowserEvent<T extends AnyCallback> {
  addListener(listener: T): void;
  removeListener(listener: T): void;
}

interface BrowserTab {
  id?: number;
  url?: string;
  title?: string;
  active?: boolean;
}

interface BrowserMessageSender {
  id?: string;
  tab?: BrowserTab;
}

interface BrowserRuntimeApi {
  onMessage: BrowserEvent<(
    message: any,
    sender: BrowserMessageSender,
    sendResponse: (response?: any) => void,
  ) => boolean | void>;
  sendMessage(message: any): Promise<any>;
}

interface BrowserTabsApi {
  query(queryInfo: Record<string, unknown>): Promise<BrowserTab[]>;
  get(tabId: number): Promise<BrowserTab>;
  update(tabId: number, updateProperties: Record<string, unknown>): Promise<BrowserTab>;
  sendMessage(tabId: number, message: any): Promise<any>;
  captureVisibleTab(windowId?: number, options?: Record<string, unknown>): Promise<string>;
  onActivated: BrowserEvent<(activeInfo: { tabId: number; windowId?: number }) => void | Promise<void>>;
  onUpdated: BrowserEvent<(
    tabId: number,
    changeInfo: { status?: string },
    tab: BrowserTab,
  ) => void>;
}

interface BrowserActionApi {
  onClicked: BrowserEvent<(tab: BrowserTab) => void | Promise<void>>;
}

interface BrowserSidePanelApi {
  open(options: { tabId: number }): Promise<void>;
}

interface ChromeRuntimeApi {
  lastError?: { message: string };
  sendMessage(
    message: any,
    callback?: (response: any) => void,
  ): void;
}

interface ChromeStorageArea {
  get(keys?: string | string[] | Record<string, unknown>): Promise<Record<string, any>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
}

interface ChromeStorageApi {
  local: ChromeStorageArea;
}

interface ChromeTabsApi {
  query(queryInfo: Record<string, unknown>): Promise<BrowserTab[]>;
}

declare const browser: {
  action: BrowserActionApi;
  runtime: BrowserRuntimeApi;
  tabs: BrowserTabsApi;
  sidePanel: BrowserSidePanelApi;
};

declare const chrome: {
  runtime: ChromeRuntimeApi;
  storage: ChromeStorageApi;
  tabs: ChromeTabsApi;
};

declare function defineBackground(setup: () => void): unknown;

declare function defineContentScript(config: {
  matches: string[];
  main: () => void;
}): unknown;
