import { SEND_MESSAGES } from "./constants/commons";

const LABELS_FOR_BUTTONS = {
  ALL_USER_BUTTON: "全員を表示",
  CHAT_BUTTON: "全員とチャット",
} as const;

type LABEL_FOR_BUTTON =
  typeof LABELS_FOR_BUTTONS[keyof typeof LABELS_FOR_BUTTONS];

const listItemClassName = ".cxdMu";
let openedDrawersLabels: LABEL_FOR_BUTTON[] = [];

type FindUserNameFromElm = (parentElm: HTMLElement) => string;
type OpenDrawer = (buttonLabel: LABEL_FOR_BUTTON) => void;
type GetUserNameList = (sendResponse: (response?: string) => void) => void;

const findUserNameFromElm: FindUserNameFromElm = (parentElm) => {
  // 最初のdiv > 2番目のdiv > div > span.innerHTML
  return parentElm.children[0].children[1].children[0].children[0].innerHTML.toLowerCase();
};

const openDrawer: OpenDrawer = (buttonLabel) => {
  if (openedDrawersLabels.includes(buttonLabel)) {
    // 既に開いたドロワーは再度開く必要がないため処理をスキップする
    return;
  }

  /*
   * 各ボタンの aria-label 属性にラベルに表示するボタン名が格納されている
   * 全てのボタンを DOM から取得して全員を表示ボタンを探す
   */
  const ariaLabelElems = document.querySelectorAll("[aria-label]");
  for (const ariaLabelElem of ariaLabelElems) {
    if (ariaLabelElem.getAttribute("aria-label") === buttonLabel) {
      const chatOpenButton = ariaLabelElem as HTMLButtonElement;
      chatOpenButton.click();
      openedDrawersLabels = [...openedDrawersLabels, buttonLabel];
    }
  }
};

const getUserNameList: GetUserNameList = (sendResponse) => {
  let names: string[] = [];
  const elems = document.querySelectorAll<HTMLElement>(listItemClassName);
  if (elems.length === 0) {
    // listItemClassName が存在しない = ユーザー一覧 drawer が表示されていない
    openDrawer(LABELS_FOR_BUTTONS.ALL_USER_BUTTON);
    return;
  }

  for (const elem of elems) {
    // 「招待されているユーザー(未参加)」には参加者IDが割り振られない
    if (elem.dataset.participantId === undefined) {
      continue;
    }

    names = [...names, findUserNameFromElm(elem)];
  }

  // 重複した名前を省く
  names = [...new Set(names)];
  sendResponse(names.join(","));
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  getUserNameList(sendResponse);

  if (msg === SEND_MESSAGES.CHAT_OPEN) {
    openDrawer(LABELS_FOR_BUTTONS.CHAT_BUTTON);
  }
});
