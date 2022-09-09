const btn = document.querySelector("#show");
btn.addEventListener("click", async () => {
  const { isStart } = await chrome.storage.sync.get(["isStart"]);
  if (isStart) {
    // 关闭
    console.log("关闭");
    chrome.runtime.sendMessage({ type: "close" });
    await chrome.storage.sync.set({ isStart: !isStart });
  } else {
    // 开启
    console.log("开始");
    chrome.runtime.sendMessage({ type: "reload" });
    await chrome.storage.sync.set({ isStart: !isStart });
  }
  setButtonText();
});

function setButtonText() {
  chrome.storage.sync.get(["isStart"], function (v) {
    btn.innerHTML = !v.isStart ? "开始监听" : "关闭监听";
    if (!v.isStart) {
      chrome.runtime.sendMessage({ type: "setText", text: "" });
    }
  });
}
setButtonText();
