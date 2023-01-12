import clsx from "clsx";
import Head from "next/head";
import Header from "../Header";

const Page = ({
  children,
  title,
  noContainer,
}: {
  children: JSX.Element | JSX.Element[] | string;
  title?: string;
  noContainer?: boolean;
}) => {
  return (
    <div className="box-border flex h-full flex-col overflow-hidden">
      <Head>
        <title>{title || "TrackYourLife"}</title>
        <meta name="description" content="TrackYourLife app" />
      </Head>
      <Header />
      <main
        className={clsx(
          "mx-auto box-border w-full",
          !noContainer && "content-container"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Page;
