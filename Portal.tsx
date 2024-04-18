"use client";

import { useEffect, useState } from "react";
import reactDom from "react-dom";

type Props = {
  children: React.ReactNode;
};

export default function Portal({ children }: Props) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElement(document.getElementById("modal"));
  }, []);

  if (!element) return null;

  return reactDom.createPortal(children, element);
}
