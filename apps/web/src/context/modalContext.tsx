import { createContext } from "react";

interface modalContextType {
    isActive : boolean,
    toggleState : (modeType : boolean) => void
}

const modalContext = createContext<modalContextType>({
  isActive : false,
  toggleState : () => {},
});

export default modalContext;