// src/app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://public.tableau.com/javascripts/api/tableau-2.min.js" strategy ="lazyOnload" />
      </body>
    </html>
  );
}