import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import shuffle from "./helper/shuffle";

const Popup = () => {
  // state
  const [user, setUser] = useState<string>("");
  const [status, setStatus] = useState<string>();
  const [currentTime, setCurrentTime] = useState<Date>();
  const [members, setMembers] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    chrome.browserAction.setBadgeText({ text: count.toString() });
  }, [count]);

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

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          undefined, // message は不要なため undefined とする
          (msg) => {
            console.log("result message:", msg);
            if (typeof msg === "string") {
              // 画面共有用のアカウントは省く
              let membersName = msg;
              if (user) {
                // 名前が登録されている場合は置き換える
                membersName = msg.split("あなた").join(user);
              }
              // 画面共有用のアカウントは省く
              const pickMembers = membersName
                .split(",")
                .filter((x) => !x.includes("<wbr>"));
              const shuffledMemcbers = shuffle(pickMembers);

              setCurrentTime(new Date());
              setMembers(shuffledMemcbers);
              setCount(shuffledMemcbers.length);
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
            </div>
            <div>{status}</div>
            <div>
              <button onClick={saveOptions}>保存</button>
            </div>
          </section>
          <section>
            <div>
              <button onClick={changeBackground}>一覧取得</button>
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
                      <li key={i}>{x}</li>
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
