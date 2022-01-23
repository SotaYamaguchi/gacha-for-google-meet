import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { RedoIcon } from "./components/atoms/RedoIcon";
import { SEND_MESSAGES } from "./constants/commons";
import shuffle from "./helper/shuffle";

type CurrentChromeTab = (callback: (tabId: number) => void) => void;
type GetMemberList = () => void;
type OpenChatOnMeet = () => void;

const Popup = () => {
  // state
  const [currentTime, setCurrentTime] = useState<Date>();
  const [members, setMembers] = useState<string[]>([]);

  const currentChromeTab: CurrentChromeTab = (callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // 現在表示しているタブを取得
      const tab = tabs[0];
      if (tab.id) {
        callback(tab.id);
      }
    });
  };

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

  const openChatOnMeet: OpenChatOnMeet = () => {
    currentChromeTab((tabId) => {
      chrome.tabs.sendMessage(tabId, SEND_MESSAGES.CHAT_OPEN);
    });
  };

  const sleep = (waitTime: number) =>
    new Promise((resolve) => setTimeout(resolve, waitTime));

  const initialize = async () => {
    // 初回はユーザー一覧 drawer のレンダリングを待つため sleep を入れる
    await sleep(300);
    getMemberList();
  };

  // init
  useEffect(() => {
    currentChromeTab((tabId) => {
      // ユーザー一覧 drawer を表示させる
      chrome.tabs.sendMessage(
        tabId,
        undefined, // message は不要なため undefined とする
        () => initialize()
      );
    });
  }, []);

  return (
    <div>
      <div style={{ minWidth: "300px", padding: "1rem" }}>
        <section style={{ marginBottom: "1rem" }}>
          <div>現在 Meet に参加しているメンバーを並び替えて一覧表示します</div>
        </section>
        <section>
          <div>
            <button
              onClick={getMemberList}
              style={{ display: "flex", padding: "0.5rem 1rem" }}
            >
              Shuffle
              <div style={{ marginLeft: "0.5rem" }}>
                <RedoIcon />
              </div>
            </button>
          </div>
          {!!currentTime && (
            <div style={{ marginTop: "0.5rem" }}>
              Current Time: {currentTime.toLocaleTimeString()}
            </div>
          )}
          {!!members.length && (
            <div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p>参加メンバー</p>
                <ul style={{ listStyle: "none" }}>
                  {members.map((x, i) => (
                    <li key={i}>{`${i + 1}. ${x}`}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
