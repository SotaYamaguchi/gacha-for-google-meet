import lodashShuffle from "lodash/shuffle";

type Shuffle = (list: string[]) => string[];

const shuffle: Shuffle = (list) => lodashShuffle(list);

export default shuffle;
