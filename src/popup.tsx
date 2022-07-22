import React, { useState, VFC } from "react";
import ReactDOM from "react-dom";
import { ClipboardCheck } from "./components/atoms/icons/ClipboardCheck";
import { ClipboardCopy } from "./components/atoms/icons/ClipboardCopy";
import { RedoIcon } from "./components/atoms/icons/RedoIcon";
import { SEND_MESSAGES } from "./constants/commons";
import shuffle from "./helper/shuffle";
import { useEffectOnce } from "./hooks";

type CurrentChromeTab = (callback: (tabId: number) => void) => void;
type GetMemberList = () => void;
type OpenChatOnMeet = () => void;
type HandleClickCopy = () => void;
type HandleChangeExcludeMembers = (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => void;
type Sleep = (waitTime: number) => void;
type Initialize = () => Promise<void>;

const currentChromeTab: CurrentChromeTab = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // 現在表示しているタブを取得
    const tab = tabs[0];
    if (tab.id) {
      callback(tab.id);
    }
  });
};

const openChatOnMeet: OpenChatOnMeet = () => {
  currentChromeTab((tabId) => {
    chrome.tabs.sendMessage(tabId, SEND_MESSAGES.CHAT_OPEN);
  });
};

const sleep: Sleep = (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

const Popup: VFC = () => {
  // state
  const [currentTime, setCurrentTime] = useState<Date>();
  const [members, setMembers] = useState<string[]>([]);
  const [excludeMembers, setExcludeMembers] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const getMemberList: GetMemberList = () => {
    currentChromeTab((tabId) => {
      chrome.tabs.sendMessage(
        tabId,
        undefined, // message は不要なため undefined とする
        async (msg) => {
          if (typeof msg === "string") {
            const shuffledMembers = shuffle(msg.split(","));
            setCurrentTime(new Date());
            setMembers(shuffledMembers);

            await sleep(300);
            openChatOnMeet();
          }
        }
      );
    });
  };

  const handleClickCopy: HandleClickCopy = () => {
    const copyText = filteredMembers
      .map((member, i) => `${i + 1}. ${member}`)
      .join("\n");
    navigator.clipboard.writeText(copyText);

    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 600);
  };

  const handleChangeExcludeMembers: HandleChangeExcludeMembers = (e) =>
    setExcludeMembers(e.target.value);

  const initialize: Initialize = async () => {
    // 初回はユーザー一覧 drawer のレンダリングを待つため sleep を入れる
    await sleep(300);
    getMemberList();
  };

  // init
  useEffectOnce(() =>
    currentChromeTab((tabId) => {
      // ユーザー一覧 drawer を表示させる
      chrome.tabs.sendMessage(
        tabId,
        undefined, // message は不要なため undefined とする
        () => initialize()
      );
    })
  );

  const excludeMemberNames = excludeMembers.split(",");
  const filteredMembers = members.filter((member) => {
    return !excludeMemberNames.includes(member);
  });

  const formDisabled = filteredMembers.length <= 1;
  const isShowing = filteredMembers.length > 0;

  return (
    <div>
      <div style={{ minWidth: "400px", padding: "1rem" }}>
        <section style={{ marginBottom: "1rem" }}>
          <div>Meet の参加メンバーを並び替えて一覧表示します</div>
        </section>
        <section>
          {!!currentTime && (
            <div style={{ marginTop: "0.5rem" }}>
              Current Time: {currentTime.toLocaleTimeString()}
            </div>
          )}
          {isShowing && (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p>参加メンバー</p>
                  <ul style={{ fontSize: "0.9rem", listStyle: "none" }}>
                    {filteredMembers.map((x, i) => (
                      <li key={i}>{`${i + 1}. ${x}`}</li>
                    ))}
                  </ul>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "180px",
                  }}
                >
                  <p>除外するメンバー</p>
                  <label style={{ fontSize: "0.5rem" }}>
                    ※ 除外するメンバーを,で区切って入力してください
                  </label>
                  <textarea
                    value={excludeMembers}
                    onChange={handleChangeExcludeMembers}
                    disabled={formDisabled}
                    rows={5}
                    cols={22}
                  />
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "1rem",
            }}
          >
            <div>
              <button
                onClick={getMemberList}
                style={{
                  alignItems: "center",
                  backgroundColor: "rgb(126, 126, 126)",
                  color: "white",
                  display: "flex",
                  height: "2.5rem",
                  justifyContent: "center",
                  padding: "0.5rem 1rem",
                  width: "6rem",
                }}
              >
                Shuffle
                <div style={{ marginLeft: "0.5rem" }}>
                  <RedoIcon />
                </div>
              </button>
            </div>
            {isShowing && (
              <div>
                <button
                  onClick={handleClickCopy}
                  style={{
                    alignItems: "center",
                    backgroundColor: copied
                      ? "rgb(51, 103, 214)"
                      : "rgb(0, 157, 237)",
                    color: "white",
                    display: "flex",
                    fontWeight: "bold",
                    height: "2.5rem",
                    justifyContent: "center",
                    padding: "0.5rem 1rem",
                    width: "6rem",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                  <div style={{ marginLeft: "0.5rem" }}>
                    {copied ? <ClipboardCheck /> : <ClipboardCopy />}
                  </div>
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.querySelector("#root")
);
