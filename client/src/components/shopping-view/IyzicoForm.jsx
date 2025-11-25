import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const KNOWN_GLOBALS = [
  "Iyzico",
  "iyzico",
  "iyzicoPayment",
  "iyzicoPaymentForm",
  "Iyzipay",
];

export const SPOTLIGHT_OVERLAY_Z = 2147483600; // stay within 32-bit safe range
export const SPOTLIGHT_FORM_Z = SPOTLIGHT_OVERLAY_Z + 1;

const IyzicoForm = ({ checkoutFormContent }) => {
  const formContainerRef = useRef(null);

  useEffect(() => {
    // checkoutFormContent her yenilendiğinde scriptleri manuel enjekte edip SPA temizliği uygularız
    const container = formContainerRef.current;
    if (!container) return undefined;

    const mountedScripts = [];

    const cleanupDomArtifacts = () => {
      mountedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      mountedScripts.length = 0;
      container.innerHTML = "";

      KNOWN_GLOBALS.forEach((key) => {
        if (window[key]) {
          try {
            delete window[key];
          } catch {
            window[key] = undefined;
          }
        }
      });

      document
        .querySelectorAll('iframe[src*="iyzico"], iframe[id*="iyzico"]')
        .forEach((iframe) => iframe.remove());
    };

    if (!checkoutFormContent) {
      cleanupDomArtifacts();
      return cleanupDomArtifacts;
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = checkoutFormContent;

    const scriptTags = Array.from(wrapper.querySelectorAll("script"));
    scriptTags.forEach((script) => script.parentNode?.removeChild(script));

    container.innerHTML = "";
    container.appendChild(wrapper);

    scriptTags.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }
      container.appendChild(newScript);
      mountedScripts.push(newScript);
    });

    return cleanupDomArtifacts;
  }, [checkoutFormContent]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !checkoutFormContent ||
      !formContainerRef.current
    ) {
      return undefined;
    }

    const target = formContainerRef.current;
    const frameId = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [checkoutFormContent]);

  // Iyzico formu için minimum boyutlandırma, scriptlerin absolute positioning kullanmasına hazırlık yapar
  const containerStyle = {
    position: "relative",
    minHeight: "500px",
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px",
    overflow: "hidden",
    zIndex: SPOTLIGHT_FORM_Z,
  };

  const renderOverlay = () => {
    if (
      typeof document === "undefined" ||
      typeof window === "undefined" ||
      !checkoutFormContent
    ) {
      return null;
    }

    return createPortal(
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        style={{
          zIndex: SPOTLIGHT_OVERLAY_Z,
          pointerEvents: "auto",
        }}
      />,
      document.body
    );
  };

  return (
    <>
      {renderOverlay()}
      <div
        className="relative"
        style={{ zIndex: checkoutFormContent ? SPOTLIGHT_FORM_Z : undefined }}
      >
        <div
          ref={formContainerRef}
          id="iyzipay-checkout-form"
          style={containerStyle}
        />
      </div>
    </>
  );
};

IyzicoForm.propTypes = {
  checkoutFormContent: PropTypes.string,
};

export default IyzicoForm;
