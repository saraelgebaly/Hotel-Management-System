import { jwtDecode } from "jwt-decode";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AuthInterface from "../Interfaces/interface";

export let AuthContext = createContext<AuthInterface>({
  baseUrl: "",
  loginData: {},
  getUserData: () => {},
  requestHeaders: {
    Authorization: "",
  },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

//?=================================================================> */
export default function AuthContextProvider(props: PropsWithChildren) {
  //?=================================================================> */

  let [loginData, setLoginData] = useState(null);

  let baseUrl = "https://upskilling-egypt.com:3000/api/v0";

  let requestHeaders = {
    Authorization: `${localStorage.getItem("token")}`,
  };

  let getUserData = () => {
    let encodedToken: any = localStorage.getItem("token");
    let decodedToken: any = jwtDecode(encodedToken);
    console.log(decodedToken);
    setLoginData(decodedToken);
  };

  useEffect(() => {
    if (localStorage.getItem("token") && loginData) {
      getUserData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ getUserData, loginData, baseUrl, requestHeaders }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
