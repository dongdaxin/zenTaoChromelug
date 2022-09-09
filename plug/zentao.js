// 刷新完成
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type === 'reloadEnd') {
    const textDomList = frames[0].document.querySelectorAll(".tile-amount");
    const textList = [...textDomList][1];
    const text = textList.innerHTML;
    console.log("开始执行 --- dom", text);
    chrome.runtime.sendMessage({ type: "setText", text: '' + Math.round(Math.random() * 100) });
    chrome.runtime.sendMessage({ type: "reload"});
  }
})