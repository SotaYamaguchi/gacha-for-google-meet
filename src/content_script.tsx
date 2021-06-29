chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let names: string[] = [];

  const elems = document.querySelectorAll("[data-self-name]");
  for (var i = 0; i < elems.length; i++) {
    names = [...names, elems[i].innerHTML.toLowerCase()];
  }
  names = Array.from(new Set(names));
  console.log(names);

  sendResponse(names.join(","));
});
