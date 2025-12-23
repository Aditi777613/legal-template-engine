// UOIONHHC
import './globals.css';

export const metadata = {
  title: 'Legal Template Engine',
  description: 'Transform legal documents into intelligent templates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

