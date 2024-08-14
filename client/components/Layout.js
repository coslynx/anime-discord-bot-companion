import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Anime Discord Bot Companion</title>
        <meta name="description" content="A Discord bot companion for anime enthusiasts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="container mx-auto py-8">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;