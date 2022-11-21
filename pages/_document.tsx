import Document, { DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";

declare global {
  interface Window {
    grecaptcha: ReCaptchaInstance;
  }
}

interface ReCaptchaInstance {
  ready: (cb: () => any) => void;
  execute: (id: string, options: ReCaptchaExecuteOptions) => Promise<string>;
  render: (id: string, options: ReCaptchaRenderOptions) => any;
}

interface ReCaptchaExecuteOptions {
  action: string;
}

interface ReCaptchaRenderOptions {
  sitekey: string;
  size: "invisible";
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }
}
