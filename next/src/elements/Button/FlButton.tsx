import { Button } from "@nextui-org/button";
import React, { ReactNode } from "react";

type TFlButtonProps = {
  color?: string;
  children: ReactNode;
};
export const FlButton: React.FC<TFlButtonProps> = ({ children }) => {
  return (
    <Button variant="shadow" color="secondary">
      {children}
    </Button>
  );
};
