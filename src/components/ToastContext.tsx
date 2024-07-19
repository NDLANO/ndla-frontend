/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, createContext, useContext } from "react";
import { Toaster, createToaster } from "@ark-ui/react";
import { Cross } from "@ndla/icons/action";
import { IconButton, ToastCloseTrigger, ToastDescription, ToastRoot, ToastTitle } from "@ndla/primitives";

const toaster = createToaster({
  placement: "bottom",
  overlap: true,
  gap: 8,
  max: 10,
});

const ToastContext = createContext<ReturnType<typeof createToaster> | null>(null);

interface ToastProviderProps {
  children?: ReactNode;
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <ToastContext.Provider value={toaster}>
      <Toaster toaster={toaster}>
        {(toast) => (
          <ToastRoot>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
            <ToastCloseTrigger asChild>
              <IconButton variant="clearSubtle">
                <Cross />
              </IconButton>
            </ToastCloseTrigger>
          </ToastRoot>
        )}
      </Toaster>
      {children}
    </ToastContext.Provider>
  );
};
