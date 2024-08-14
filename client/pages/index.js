import Head from 'next/head';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();

  return (
    <Layout>
      <Head>
        <title>Anime Discord Bot Companion</title>
        <meta name="description" content="A Discord bot companion for anime enthusiasts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-4">Welcome to Anime Discord Bot Companion</h1>

        <p className="text-lg text-center mb-4">
          Explore anime recommendations, manage your watchlists, and engage in fun anime-related activities.
        </p>

        {session ? (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">
              Welcome back, {session.user.name}!
            </h2>
            <p className="text-gray-600 mb-4">
              You are currently logged in.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">
              Explore the features of our bot.
            </p>
            <p className="text-lg mb-4">
              Login or Register to access personalized features like watchlist management.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Discover Anime</h2>
          <p className="text-lg mb-4">
            Join our Discord server and use the `/anime recommend` and `/anime search` commands to discover new anime.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Fun Activities</h2>
          <p className="text-lg mb-4">
            Join our Discord server and use the `/fun trivia`, `/fun meme`, and `/fun character` commands to test your knowledge and have some laughs.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">MMORPG</h2>
          <p className="text-lg mb-4">
            Join our Discord server and use the `/mmorpg create` command to start your adventure in our anime-themed MMORPG. 
          </p>
        </div>

        {/ Add more information or calls to action as needed /}
      </div>
    </Layout>
  );
};

export default Home;