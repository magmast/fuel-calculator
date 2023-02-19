import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

const AppPage = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default AppPage;
