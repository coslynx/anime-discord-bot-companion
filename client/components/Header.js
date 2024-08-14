import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useUser } from '../utils/auth';

const Header = () => {
  const { data: session } = useSession();
  const { getUser, logout } = useUser();

  return (
    <header className="bg-gray-800 text-gray-400 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold">Anime Discord Bot Companion</a>
        </Link>
        <nav className="flex space-x-6">
          <Link href="/anime">
            <a className="hover:underline">Anime</a>
          </Link>
          <Link href="/list">
            <a className="hover:underline">Anime Lists</a>
          </Link>
          <Link href="/mmorpg">
            <a className="hover:underline">MMORPG</a>
          </Link>
          {session ? (
            <>
              <Link href="/user/dashboard">
                <a className="hover:underline">Dashboard</a>
              </Link>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="hover:underline">Login</a>
              </Link>
              <Link href="/register">
                <a className="hover:underline">Register</a>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;