// app/admin/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

const inter = Inter({ subsets: ["latin"] });

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
