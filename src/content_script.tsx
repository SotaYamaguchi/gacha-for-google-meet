import {
  ALL_USER_BUTTON_LABEL,
  NOT_FOUND,
  OPEN_ALL_USER_DRAWER,
} from "./constants/common";

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

const openAllUserDrawer = () => {
  /*
   * 各ボタンの aria-label 属性にラベルに表示するボタン名が格納されている
   * 全てのボタンを DOM から取得して全員を表示ボタンを探す
   */
  const ariaLabelElems = document.querySelectorAll("[aria-label]");
  for (let i = 0; i < ariaLabelElems.length; i++) {
    if (
      ariaLabelElems[i].getAttribute("aria-label") === ALL_USER_BUTTON_LABEL
    ) {
      const chatOpenButton = ariaLabelElems[i] as HTMLButtonElement;
      chatOpenButton.click();
    }
  }
};

const getUserNameList = (sendResponse: (response?: any) => void) => {
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
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === OPEN_ALL_USER_DRAWER) {
    console.log(OPEN_ALL_USER_DRAWER);
    openAllUserDrawer();
    return;
  }

  getUserNameList(sendResponse);
});
