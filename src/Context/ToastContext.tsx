import { createContext, PropsWithChildren, useContext } from "react";
import { toast } from "react-toastify";
import { ToastTypeProps } from "../Interfaces/interface";

const ToastContext = createContext<ToastTypeProps>({
  showToast(type, message) {
    return toast[type](message);
  },
});

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastContextProvider({ children }: PropsWithChildren) {
  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    return toast[type](message, {
      autoClose: 2000,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}
