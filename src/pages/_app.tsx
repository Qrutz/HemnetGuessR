import { type AppType } from "next/dist/shared/lib/utils";
import { QueryClient, QueryClientProvider } from "react-query";
import "~/styles/globals.css";
import { Amplify, API } from "aws-amplify";
import awsconfig from "../aws-exports";

Amplify.configure({ ...awsconfig, ssr: true });
API.configure(awsconfig);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default MyApp;
