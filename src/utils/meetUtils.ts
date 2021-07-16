export const getUserNamesByString = (value: string, user: string) => {
  // 画面共有用のアカウントは省く
  let membersName = value;
  if (user) {
    // 名前が登録されている場合は置き換える
    membersName = value.split("あなた").join(user);
  }

  // 画面共有用のアカウントは省く
  const pickMembers = membersName
    .split(",")
    .filter((x) => !x.includes("<wbr>"));

  return pickMembers;
};
