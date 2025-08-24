// src/components/OmniWidget.jsx
import { useEffect } from "react";

export default function OmniWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "omnidimension-web-widget";
    script.src =
      "https://backend.omnidim.io/web_widget.js?secret_key=ce72bc3af8a82b019ba39af03bc124dd";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById("omnidimension-web-widget")?.remove();
    };
  }, []);

  return null; // This component doesn’t render any UI
}
