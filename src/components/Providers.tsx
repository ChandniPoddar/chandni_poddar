"use client";
import { SessionProvider } from 'next-auth/react';
import ThemeProvider from '@/lib/theme';
import { useEffect, useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="dark">
        {mounted ? children : <div className="invisible">{children}</div>}
      </ThemeProvider>
    </SessionProvider>
  );
}
