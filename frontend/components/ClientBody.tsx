"use client";

import { ReactNode } from "react";

interface ClientBodyProps {
  children: ReactNode;
  className: string;
}

export default function ClientBody({ children, className }: ClientBodyProps) {
  return (
    <body className={className} suppressHydrationWarning>
      {children}
    </body>
  );
}