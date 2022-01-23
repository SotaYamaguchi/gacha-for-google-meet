export const SEND_MESSAGES = {
  CHAT_OPEN: "chatOpen",
} as const;

export type SEND_MESSAGE = typeof SEND_MESSAGES[keyof typeof SEND_MESSAGES];
