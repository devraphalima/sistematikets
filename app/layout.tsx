import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Support Desk',
  description: 'Support Desk powered by HESK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
        <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0" />
        <link rel="icon" href="/support-desk-icon.svg" type="image/svg+xml" />
        <meta name="format-detection" content="telephone=no" />

        {/* HESK CSS — same load order as header.inc.php */}
        <link rel="stylesheet" media="all" href="/hesk/css/core/0_00_default_theme_vars.css" />
        <link rel="stylesheet" media="all" href="/hesk/css/theme_overrides.css" />
        <link rel="stylesheet" media="all" href="/hesk/dist/app.min.css" />
        <link rel="stylesheet" media="all" href="/hesk/css/core_overrides.css" />
      </head>
      <body className="cust-help">
        {children}

        {/* HESK JS */}
        <script src="/hesk/js/jquery-3.5.1.min.js" />
        <script src="/hesk/js/hesk_functions.js" />
        <script src="/hesk/js/svg4everybody.min.js" />
        <script src="/hesk/js/selectize.min.js" />
        <script src="/hesk/js/app.min.js" />
      </body>
    </html>
  );
}
