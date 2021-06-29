import { NOT_FOUND } from "./constants/common";

type NodeName = "DIV" | "SPAN";

const pickChildElm = (parent: HTMLCollection, nodeName: NodeName) => {
  let nodeList: Element[] = [];
  // nodeName で指定したノードのみになるようフィルターする
  for (let targetElm of parent) {
    if (targetElm.nodeName === nodeName) {
      nodeList = [...nodeList, targetElm];
    }
  }
  return nodeList;
};

const findUserNameFromElm = (parentElm: Element) => {
  const child1Divs = pickChildElm(parentElm.children, "DIV");
  const child2Divs = pickChildElm(child1Divs[0].children, "DIV");
  const childSpans = pickChildElm(child2Divs[0].children, "SPAN");
  return childSpans[0].innerHTML.toLowerCase();
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let names: string[] = [];

  const elems = document.querySelectorAll(".cylMye");
  if (!elems.length) {
    // .cylMye が存在しない = 全員を表示 drawer が表示されていない
    sendResponse(NOT_FOUND);
    return;
  }
  for (let i = 0; i < elems.length; i++) {
    names = [...names, findUserNameFromElm(elems[i])];
  }
  // 重複した名前を省く
  names = Array.from(new Set(names));

  sendResponse(names.join(","));
});
