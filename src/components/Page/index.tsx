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
    <div className="h-screen overflow-hidden">
      <Head>
        <title>{title || "TrackYourLife"}</title>
        <meta name="description" content="TrackYourLife app" />
      </Head>
      <Header />
      <main className="container mx-auto my-5 h-full max-h-full max-w-5xl">
        {children}
      </main>
    </div>
  );
};

export default Page;
