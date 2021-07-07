import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { NOT_FOUND } from "./constants/common";
import shuffle from "./helper/shuffle";
import { getUserNamesByString } from "./utils/meetUtils";

type ErrorMsgProps = {
  errorText: string;
};

const ErrorMsg: React.FC<ErrorMsgProps> = ({ errorText }) => {
  return <p style={{ color: "red" }}>{errorText}</p>;
};

const Popup = () => {
  // state
  const [user, setUser] = useState<string>("");
  const [status, setStatus] = useState<string>();
  const [currentTime, setCurrentTime] = useState<Date>();
  const [members, setMembers] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        user: "",
      },
      (items) => {
        setUser(items.user);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        user: user,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus(undefined);
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  const getMemberList = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          undefined, // message は不要なため undefined とする
          (msg) => {
            if (typeof msg === "string") {
              // validation
              if (msg === NOT_FOUND) {
                setErrorMsg(
                  "Google Meet 画面の「全員を表示」ボタンをクリックしてください"
                );
                return;
              }
              setErrorMsg("");

              const shuffledMemcbers = shuffle(getUserNamesByString(msg, user));

              setCurrentTime(new Date());
              setMembers(shuffledMemcbers);
            }
          }
        );
      }
    });
  };

  return (
    <>
      <div>
        <div style={{ minWidth: "300px", padding: "1rem" }}>
          <section style={{ marginBottom: "1rem" }}>
            <div>
              あなたの名前:&nbsp;
              <input
                type="text"
                id="user"
                name="user"
                value={user}
                maxLength={20}
                onChange={(e) => setUser(e.target.value)}
              />
              <button style={{ marginLeft: "0.5rem" }} onClick={saveOptions}>
                保存
              </button>
            </div>
            <div>{status}</div>
          </section>
          <section>
            <div>
              <button onClick={getMemberList}>一覧取得</button>
            </div>

            {!!errorMsg && <ErrorMsg errorText={errorMsg} />}
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
