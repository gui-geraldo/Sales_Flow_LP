"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_DEFAULT_SNIPPET, CONSENT_EVENT, hasConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
// Umami Cloud (cloud.umami.is), site "www.talkerflow.me". Público (vai no
// HTML de toda página), então fica no código, não em variável da Vercel.
const UMAMI_WEBSITE_ID = "0772d7f3-4be0-4ebb-817f-677ee73898eb";

// Google carrega sempre, mas em Consent Mode v2: sem consentimento não grava
// cookies (lib/consent.ts). O Pixel da Meta só carrega depois do "Aceitar".
// O Umami (sem cookies) carrega sempre.
export function Analytics() {
  const [metaAllowed, setMetaAllowed] = useState(false);

  useEffect(() => {
    setMetaAllowed(hasConsent());
    const onChange = () => setMetaAllowed(hasConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return (
    <>
      {(GA_ID || GOOGLE_ADS_ID) && (
        <>
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              ${CONSENT_DEFAULT_SNIPPET}
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
              ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
            `}
          </Script>
          <Script
            // Carrega pelo Ads quando há: se o ID do GA estiver com problema
            // (o Google devolve 404), as conversões do Ads seguem funcionando.
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID ?? GA_ID}`}
            strategy="afterInteractive"
          />
        </>
      )}

      {/* Umami Cloud: sem cookies e sem dado pessoal, então mede desde a
          primeira visita (não depende do banner). data-domains: só conta no
          domínio de produção; localhost e prévias da Vercel ficam de fora. */}
      {UMAMI_WEBSITE_ID && (
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains="talkerflow.me,www.talkerflow.me"
          strategy="afterInteractive"
        />
      )}

      {META_PIXEL_ID && metaAllowed && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
