import './globals.css';

export const metadata = {
  title: 'Legal Template Engine',
  description: 'AI-powered legal document templating',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page-wrapper">
          {children}
        </div>
        {/* UOIONHHC */}
      </body>
    </html>
  );
}
