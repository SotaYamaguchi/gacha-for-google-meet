import { NOT_FOUND } from "./constants/common";

const pickUserNameFromElm = (parentElm: Element) => {
  const child1Divs = Array.prototype.filter.call(
    parentElm.children,
    (targetElm) => {
      return targetElm.nodeName === "DIV";
    }
  );
  const child2Divs = Array.prototype.filter.call(
    child1Divs[0].children,
    (targetElm) => {
      return targetElm.nodeName === "DIV";
    }
  );
  const childSpans = Array.prototype.filter.call(
    child2Divs[0].children,
    (targetElm) => {
      return targetElm.nodeName === "SPAN";
    }
  );
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
    names = [...names, pickUserNameFromElm(elems[i])];
  }
  names = Array.from(new Set(names));

  sendResponse(names.join(","));
});
