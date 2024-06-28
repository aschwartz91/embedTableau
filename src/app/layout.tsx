// src/app/layout.tsx
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script 
          src="/tableauLoader.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}