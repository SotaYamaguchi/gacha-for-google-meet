import React, { ReactNode, FC } from "react";

type Props = {
  children: ReactNode;
};

const NumberedListIndex: FC<Props> = (props) => {
  const { children } = props;

  return (
    <span
      style={{
        userSelect: "none",
      }}
    >
      {children}
    </span>
  );
};

export default NumberedListIndex;
