import Head from "next/head";
import Header from "../Header";

const Page = ({
  children,
  title,
}: {
  children: JSX.Element;
  title?: string;
}) => {
  return (
    <>
      <Head>
        <title>{title || "TrackYourLife"}</title>
        <meta name="description" content="TrackYourLife app" />
      </Head>
      <Header />
      <main className="container mx-auto my-5 max-w-5xl">{children}</main>
      <footer></footer>
    </>
  );
};

export default Page;
