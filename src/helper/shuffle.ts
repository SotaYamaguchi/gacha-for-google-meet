const shuffle = (value: string[]) => {
  /*
   並び替えのアルゴリズムは Fisher–Yates shuffle を用いる
   ref: https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A3%E3%83%83%E3%82%B7%E3%83%A3%E3%83%BC%E2%80%93%E3%82%A4%E3%82%A7%E3%83%BC%E3%83%84%E3%81%AE%E3%82%B7%E3%83%A3%E3%83%83%E3%83%95%E3%83%AB
 */
  for (let i = value.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [value[i], value[j]] = [value[j], value[i]];
  }
  return value;
};

export default shuffle;
