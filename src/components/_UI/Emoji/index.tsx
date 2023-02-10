/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["em-emoji"]: {
        shortcodes: string;
        size?: string;
        fallback: string;
      };
    }
  }
}

type EmojiProps = { shortcodes: string; size?: string; class?: string };

export const Emoji = (props: EmojiProps) => {
  return <em-emoji {...props} fallback=":question" />;
};
