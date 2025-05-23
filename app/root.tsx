import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import { Theme } from "@radix-ui/themes";
import radixStyles from "@radix-ui/themes/styles.css?url";
import FontStyles from "@fontsource/lexend/index.css?url";
import styles from "~/main.css?url";
import stylesAccordion from "~/accordion.css?url";
import aflManagerStyles from "~/afl-manager.css?url";
import Footer from "./components/Footer";
import type { LoaderFunctionArgs } from "@remix-run/node";
import * as Backgrounds from "./components/Backgrounds";
import persiteSource from 'PERSITE_SOURCE';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {process.env.NODE_ENV === 'production' && persiteSource.useSimpleAnalytics && (
          <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
        )}
      </head>
      <body>
        <Theme {...persiteSource.theme.radixConfig}>
          {Backgrounds[persiteSource.theme.background]()}

          <main style={{ paddingTop: '2vw', paddingLeft: '2vw', paddingRight: '2vw', paddingBottom: '5vw' }}>
            {children}
          </main>
          <Footer/>
          <ScrollRestoration />
          <Scripts />
          <Analytics />
        </Theme>
      </body>
    </html>
  );
}

export const loader = ({ request }: LoaderFunctionArgs) => ({
  host: request.headers.get("host")
})

export default function App() {
  return <Outlet />;
}

export function links() {
  return [
    { rel: "stylesheet", href: radixStyles },
    { rel: "stylesheet", href: FontStyles },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesAccordion },
    { rel: "stylesheet", href: aflManagerStyles },
    { rel: "stylesheet", href: Backgrounds.css[persiteSource.theme.background] },
    { rel: "icon", href: "/favicon.ico" },
  ];
}
