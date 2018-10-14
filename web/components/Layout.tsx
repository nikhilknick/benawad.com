import * as React from "react";
import Head from "next/head";

type Props = {
  title?: string;
};

const Layout: React.SFC<Props> = ({
  children,
  title = "Ben Awad YouTube Autocomplete"
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        href="https://fonts.googleapis.com/css?family=Oswald"
        rel="stylesheet"
      />
    </Head>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 900
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

export default Layout;
