import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import shuffle from "./helper/shuffle";

const Popup = () => {
  // state
  const [currentTime, setCurrentTime] = useState<Date>();
  const [members, setMembers] = useState<string[]>([]);

  const currentChromeTab = (callback: (tabId: number) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // 現在表示しているタブを取得
      const tab = tabs[0];
      if (tab.id) {
        callback(tab.id);
      }
    });
  };

  const getMemberList = () => {
    currentChromeTab((tabId) => {
      chrome.tabs.sendMessage(
        tabId,
        undefined, // message は不要なため undefined とする
        (msg) => {
          if (typeof msg === "string") {
            const shuffledMembers = shuffle(msg.split(","));
            setCurrentTime(new Date());
            setMembers(shuffledMembers);
          }
        }
      );
    });
  };

  // init
  useEffect(() => {
    currentChromeTab((tabId) => {
      // ユーザー一覧 drawer を表示させる
      chrome.tabs.sendMessage(tabId, undefined);
    });
  }, []);

  return (
    <>
      <div>
        <div style={{ minWidth: "300px", padding: "1rem" }}>
          <section style={{ marginBottom: "1rem" }}>
            <div>
              現在 Meet に参加しているメンバーを並び替えて一覧表示します
            </div>
          </section>
          <section>
            <div>
              <button onClick={getMemberList}>一覧取得</button>
            </div>

            {!!currentTime && (
              <div>Current Time: {currentTime.toLocaleTimeString()}</div>
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
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
