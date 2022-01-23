const LABELS_FOR_BUTTONS_ON_MEET = {
  ALL_USER_BUTTON: "全員を表示",
} as const

type LABEL_FOR_BUTTONS_ON_MEET = typeof LABELS_FOR_BUTTONS_ON_MEET[keyof typeof LABELS_FOR_BUTTONS_ON_MEET]

const listItemClassName = ".cxdMu";

type FindUserNameFromElm = (parentElm: Element) => string;
type OpenDrawerOnMeet = (buttonLabel: LABEL_FOR_BUTTONS_ON_MEET) => void;
type GetUserNameList = (sendResponse: (response?: any) => void) => void;

const findUserNameFromElm: FindUserNameFromElm = (parentElm) => {
  // 最初のdiv > 2番目のdiv > div > span.innerHTML
  return parentElm.children[0].children[1].children[0].children[0].innerHTML.toLowerCase();
};

const openDrawerOnMeet: OpenDrawerOnMeet = (buttonLabel) => {
  /*
   * 各ボタンの aria-label 属性にラベルに表示するボタン名が格納されている
   * 全てのボタンを DOM から取得して全員を表示ボタンを探す
   */
  const ariaLabelElems = document.querySelectorAll("[aria-label]");
  for (let i = 0; i < ariaLabelElems.length; i++) {
    if (
      ariaLabelElems[i].getAttribute("aria-label") === buttonLabel
    ) {
      const chatOpenButton = ariaLabelElems[i] as HTMLButtonElement;
      chatOpenButton.click();
    }
  }
};

const getUserNameList: GetUserNameList = (sendResponse) => {
  let names: string[] = [];
  const elems = document.querySelectorAll(listItemClassName);
  if (!elems.length) {
    // listItemClassName が存在しない = ユーザー一覧 drawer が表示されていない
    openDrawerOnMeet(LABELS_FOR_BUTTONS_ON_MEET.ALL_USER_BUTTON);
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
  getUserNameList(sendResponse);
});
