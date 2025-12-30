import type { Metadata } from "next";
import { Providers } from "./providers";
import { stackSansHeadline } from "./theme";

export const metadata: Metadata = {
  title: "PasaTanda - Gestión de Pagos Pasanaku",
  description: "Plataforma de gestión de pagos colaborativos Pasanaku en Stellar",
  icons: {
    icon: "/assets/images/icons/logopasatanda.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={stackSansHeadline.variable} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
