import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <style
          >{`html, body { margin: 0; height: 100%; width: 100%; background-color: #fafafa; } ::placeholder { color: #9399a5; }`}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
