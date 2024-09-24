// types/facebook.d.ts
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (options: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      AppEvents: {
        logPageView: () => void;
      };
      login: (
        callback: (response: any) => void,
        options?: { scope: string }
      ) => void;
    };
  }
}

export {};
