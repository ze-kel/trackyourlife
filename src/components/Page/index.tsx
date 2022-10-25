import Head from "next/head";
import Header from "../Header";

const Page = ({
  children,
  title,
}: {
  children: JSX.Element | JSX.Element[] | string;
  title?: string;
}) => {
  return (
    <div className="box-border flex h-full flex-col overflow-hidden">
      <Head>
        <title>{title || "TrackYourLife"}</title>
        <meta name="description" content="TrackYourLife app" />
      </Head>
      <Header />
      <main className="mx-auto box-border max-h-[calc(100vh-48px)] w-full">
        {children}
      </main>
    </div>
  );
};

export default Page;
