import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="dark">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <body className="bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50">
        <Main />
        <div id="modal-portal"></div>
        <NextScript />
      </body>
    </Html>
  );
}
