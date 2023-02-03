/* eslint-disable @typescript-eslint/no-namespace */

type EmojiProps = { shortcodes: string; size: string };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["em-emoji"]: EmojiProps & { fallback: string };
    }
  }
}

export const Emoji = (props: EmojiProps) => {
  return <em-emoji {...props} fallback=":question" />;
};
