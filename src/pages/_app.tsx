import { type AppType } from "next/dist/shared/lib/utils";
import { ToastContainer } from "react-toastify";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
