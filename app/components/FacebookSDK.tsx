"use client";
import { useEffect } from "react";

const FacebookSDK: React.FC = () => {
  useEffect(() => {
    // Check if FB is already defined to avoid reinitializing
    if (typeof window !== "undefined" && !window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!, // Use environment variable for your App ID
          cookie: true,
          xfbml: true,
          version: process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION!, // Use environment variable for API version
        });

        window.FB.AppEvents.logPageView();
      };

      // Load the SDK asynchronously
      (function (d, s, id) {
        const js = d.createElement(s) as HTMLScriptElement;
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode?.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, []);

  return null; // No UI component needed
};

export default FacebookSDK;
