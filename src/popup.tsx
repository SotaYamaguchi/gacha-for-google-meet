import React, { useState } from "react";
import ReactDOM from "react-dom";
import { NOT_FOUND, OPEN_ALL_USER_DRAWER } from "./constants/common";
import shuffle from "./helper/shuffle";

type ErrorMsgProps = {
  errorText: string;
};

const ErrorMsg: React.FC<ErrorMsgProps> = ({ errorText }) => {
  return <p style={{ color: "red" }}>{errorText}</p>;
};

const Popup = () => {
  // state
  const [currentTime, setCurrentTime] = useState<Date>();
  const [members, setMembers] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const currentChromeTab = (callback: (tabId: number) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // 現在表示しているタブを取得
      const tab = tabs[0];
      if (tab.id) {
        callback(tab.id);
      }
    });
  };

  const openAllUserDrawer = () => {
    currentChromeTab((tabId) => {
      chrome.tabs.sendMessage(tabId, OPEN_ALL_USER_DRAWER, (msg) => {
        setErrorMsg("");
      });
    });
  };

  const getMemberList = () => {
    currentChromeTab((tabId) => {
      chrome.tabs.sendMessage(
        tabId,
        undefined, // message は不要なため undefined とする
        (msg) => {
          if (typeof msg === "string") {
            // validation
            if (msg === NOT_FOUND) {
              setErrorMsg("Google Meet 画面の「全員を表示」を開いてください");
              return;
            }
            setErrorMsg("");

            const shuffledMembers = shuffle(msg.split(","));

            setCurrentTime(new Date());
            setMembers(shuffledMembers);
          }
        }
      );
    });
  };

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

            {!!errorMsg && (
              <>
                <ErrorMsg errorText={errorMsg} />
                <div>
                  <button onClick={openAllUserDrawer}>開く</button>
                </div>
              </>
            )}
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
