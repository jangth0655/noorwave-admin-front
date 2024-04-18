import { RefObject, useCallback, useEffect } from "react";

type Props = {
  close?: () => void;
  exceptRefsArray: RefObject<HTMLElement>[];
  isOutSideClose?: boolean;
};

export const useCloseOnOutSideClick = ({
  exceptRefsArray = [],
  isOutSideClose = false,
  close,
}: Props) => {
  const handleBackgroundClick = useCallback(
    (event: MouseEvent): void => {
      event.stopPropagation();
      const isInsideRefs = exceptRefsArray?.some((ref) =>
        ref.current?.contains(event.target as Node)
      );
      if (isInsideRefs) {
        return;
      }
      if (isOutSideClose) {
        close && close();
      }
    },
    [exceptRefsArray, isOutSideClose, close]
  );

  useEffect(() => {
    window.addEventListener("click", handleBackgroundClick);
    return () => {
      window.removeEventListener("click", handleBackgroundClick);
    };
  }, [handleBackgroundClick]);
};
