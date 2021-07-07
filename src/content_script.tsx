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

  // const ariaLabelElems = document.querySelectorAll("[aria-label]");

  // // 全員とチャット drawer を表示
  // let chatOpenButton;
  // for (let i = 0; i < ariaLabelElems.length; i++) {
  //   if (ariaLabelElems[i].getAttribute("aria-label") === "全員とチャット") {
  //     chatOpenButton = ariaLabelElems[i] as HTMLButtonElement;
  //     chatOpenButton.click();
  //   }
  // }

  // // chat のメッセージ入力欄にシャッフル後のユーザーリストを入力
  // const chatTextInputElem = document.querySelector(
  //   '[name="chatTextInput"]'
  // ) as HTMLTextAreaElement;
  // const shuffledMemcbers = shuffle(
  //   getUserNamesByString(names.join(","), "テスト　ユーザー名")
  // ).join("\n");
  // console.log(chatTextInputElem);
  // chatTextInputElem.value = shuffledMemcbers;

  // // chat に入力したメッセージを送信
  // let chatMsgSendButton;
  // const buttons = document.getElementsByTagName("button");
  // for (let i = 0; i < buttons.length; i++) {
  //   const label = buttons[i].getAttribute("aria-label");
  //   if (label === "参加者全員にメッセージを送信") {
  //     chatMsgSendButton = buttons[i] as HTMLButtonElement;
  //   }
  // }
  // chatMsgSendButton?.click();
});
