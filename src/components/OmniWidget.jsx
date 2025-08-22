// src/components/OmniWidget.jsx
import { useEffect } from "react";

export default function OmniWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "omnidimension-web-widget";
    script.src =
      "https://backend.omnidim.io/web_widget.js?secret_key=d660b28c07732ced591f62e89a0ad0d2";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById("omnidimension-web-widget")?.remove();
    };
  }, []);

  return null; // This component doesn’t render any UI
}
