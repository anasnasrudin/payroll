import { Chakra_Petch, Inter, Poppins, Unbounded, Sora } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "remixicon/fonts/remixicon.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakrapetch",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Payroll",
  description: "Employee Payroll Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/assets/wallet.png" />
        <title>{metadata.title}</title>
      </head>
      <body
        className={`${chakraPetch.variable} ${inter.variable} ${poppins.variable} ${unbounded.variable} ${sora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
