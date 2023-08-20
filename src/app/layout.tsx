import type { IUserSettings } from '@t/user';
import type { Metadata } from 'next';
import '../styles/globals.css';

import getPageSession from 'src/helpers/getPageSesion';
import Header from '@components/Header';

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getPageSession();

  const getDarkModeStatus = (v: IUserSettings['theme']) => {
    if (v === 'dark') return 'dark';
    if (v === 'light') return '';
    if (typeof window !== 'undefined' && v === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        return 'dark';
    }
    return 'dark';
  };

  return (
    <html lang="en">
      <body>
        <div className={getDarkModeStatus(undefined)}>
          <div className="h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50">
            <Header user={session?.user}></Header>

            <div className="mx-auto box-border w-full pt-4">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'TrackYourLife',
  description: 'TrackYourLifeApp',
  icons: {
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    icon: '/favicon-32x32.png',
  },
};
