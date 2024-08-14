import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Anime Discord Bot Companion</p>
        <p>
          Created by{' '}
          <Link href="https://spectra.codes/">
            <a target="_blank" rel="noopener noreferrer">
              Spectra.Codes
            </a>
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;