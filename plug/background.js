const pageUrl = "http://172.16.175.90:18080/zentao/my/";
let isQuery = false;
let tabId = "";

async function createTab() {
  const tab = await chrome.tabs.create({
    index: 0,
    url: pageUrl,
    active: true,
  });
  console.log("创建", tab);
  return tab;
}

async function getTabId() {
  if (isQuery && tabId) return tabId;
  const tabs = await chrome.tabs.query({ url: pageUrl });
  if (tabs.length) {
    // if (tabs.length > 1) {
    //   const removeIds = tabs.map((v) => v.id).filter((_, i) => i > 0);
    //   chrome.tabs.remove(removeIds);
    // }
    const tab = await chrome.tabs.update(tabs[0].id, { active: true });
    tabId = tab.id;
    isQuery = true;
    return tab.id;
  } else {
    const tab = await createTab();
    tabId = tab.id;
    isQuery = true;
    return tab.id;
  }
}

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type === "setText") {
    chrome.action.setBadgeText({
      text: msg.text || "",
    });
    chrome.action.setBadgeBackgroundColor({
      color: "#f45",
    });
  } else if (msg.type === "reload") {
    timeoutQueryPageText();
  } else if (msg.type === "close") {
    console.log("结束", timeId);
    clearTimeout(timeId);
  }
});

chrome.storage.sync.set({ isStart: false });

let timeId = "";
let a = 1;
async function timeoutQueryPageText() {
  const tabId = await getTabId();
  console.log("轮询", tabId);
  timeId && clearTimeout(timeId);
  timeId = setTimeout(() => {
    console.log("刷新次数", a++);
    chrome.tabs.reload(tabId, { bypassCache: false }, () => {
      chrome.tabs.sendMessage(tabId, { type: "reloadEnd" });
    });
  }, 60000);
  console.log("timeId", timeId);
}
