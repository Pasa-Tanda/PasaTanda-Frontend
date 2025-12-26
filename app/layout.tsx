import type { Metadata } from "next";
import { Providers } from "./providers";
import { stackSansHeadline } from "./theme";

export const metadata: Metadata = {
  title: "PasaTanda - Gestión de Pagos Pasanaku",
  description: "Plataforma de gestión de pagos colaborativos Pasanaku en Stellar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={stackSansHeadline.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
