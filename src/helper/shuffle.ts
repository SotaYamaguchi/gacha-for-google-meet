type Shuffle = (list: string[]) => string[];

const shuffle: Shuffle = (list) => {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    list[i] = array[j];
    list[j] = temp;
  }
  return list;
};

export default shuffle;
