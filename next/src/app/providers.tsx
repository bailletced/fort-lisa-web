"use client";

import { NextUIProvider } from "@nextui-org/system";
import { ReactNode } from "react";

export type TProvidersProps = {
  children: ReactNode;
};

export const Providers: React.FC<TProvidersProps> = ({ children }) => (
  <NextUIProvider>{children}</NextUIProvider>
);
