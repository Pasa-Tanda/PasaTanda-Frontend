"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export type Locale = "es" | "en";

const translations = {
  es: {
    nav: {
      home: "Inicio",
      pay: "Pagos",
      onboarding: "Onboarding",
      docs: "Documentación",
    },
    hero: {
      title: "PasaTanda, ahorro rotativo sobre Stellar",
      subtitle:
        "Organiza tandas confiables con on/off ramp bancario, contratos Soroban y flujos guiados por WhatsApp.",
      primaryCta: "Crear tanda",
      secondaryCta: "Ver pagos",
      metrics: [
        { label: "Liquidaciones 24/7", value: "Stellar + XDR" },
        { label: "On/Off ramp", value: "QR bancario" },
        { label: "Custodia", value: "Soroban" },
      ],
    },
    valueProps: {
      stellar: {
        title: "Seguridad sobre Stellar",
        body:
          "Firmas con Freighter y x402 para validar pagos sin exponer llaves. Los contratos Soroban registran turnos y fondos.",
      },
      onramp: {
        title: "On-ramp / Off-ramp local",
        body:
          "Pagos vía QR bancario o USDC. El backend verifica comprobantes y genera órdenes con links dinámicos.",
      },
      automation: {
        title: "Automatización por WhatsApp",
        body:
          "El bot guía a los miembros: recordatorios, verificación de pagos y activación de la tanda desde el chat.",
      },
    },
    howItWorks: {
      title: "Cómo funciona",
      steps: [
        "Solicita código de verificación y crea el grupo en estado DRAFT.",
        "El admin escribe 'iniciar tanda' o usa el panel para desplegar contrato y orden inicial.",
        "Cada pago genera un link /pagos/{id} con QR, XDR y seguimiento en tiempo real.",
      ],
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        {
          q: "¿Necesito cripto para empezar?",
          a: "No. Puedes iniciar solo con pagos en banco (QR). La wallet Stellar es opcional para cobrar en USDC.",
        },
        {
          q: "¿Dónde se guarda el dinero?",
          a: "La custodia se maneja en contratos Soroban y la verificación de fiat se realiza con el backend PayBE.",
        },
        {
          q: "¿Qué wallets soportan?",
          a: "Freighter en navegador para firmas XDR y flujos x402. Pronto se sumarán más wallets con SEP-30.",
        },
        {
          q: "¿Cómo se calculan las cuotas en USDC?",
          a: "El backend calcula el monto en USDC dinámicamente al generar cada orden, sin fijar un tipo de cambio en UI.",
        },
      ],
    },
    docs: {
      title: "Documentación del proyecto",
      intro:
        "Revisa la arquitectura, flujos y endpoints públicos sin exponer secretos. Ideal para handoff y soporte.",
      sections: [
        {
          title: "Arquitectura",
          items: [
            "Frontend Next.js con MUI monocromático y soporte bilingüe.",
            "AgentBE orquesta WhatsApp, verificación y creación de órdenes.",
            "PayBE gestiona on/off ramp y envía webhooks a AgentBE.",
          ],
        },
        {
          title: "Flujos",
          items: [
            "Onboarding: verificación por WhatsApp, creación de grupo DRAFT, activación con contrato Soroban.",
            "Pagos: link /pagos/{id} con QR, XDR challenge y claim fiat/crypto.",
            "X402: firma con Freighter para generar X-PAYMENT seguro sin compartir llaves.",
          ],
        },
        {
          title: "Integraciones",
          items: [
            "Freighter API para obtener address, red y firmar XDR.",
            "x402-stellar-client para crear headers X-PAYMENT.",
            "Endpoints AgentBE: /api/onboarding, /api/orders/:id, /api/orders/:id/claim.",
          ],
        },
      ],
    },
    onboarding: {
      title: "Onboarding y verificación",
      subtitle:
        "Solicita código, crea el grupo y opcionalmente despliega la tanda sin salir del navegador.",
      requestCode: "Enviar código",
      createDraft: "Crear grupo DRAFT",
      activateGroup: "Activar tanda",
      phone: "WhatsApp (código país)",
      code: "Código de verificación",
      username: "Usuario",
      groupName: "Nombre del grupo",
      amountBs: "Monto en Bs",
      usdc: "Monto en USDC (opcional)",
      freq: "Frecuencia (días)",
      yieldLabel: "Repartir rendimiento con miembros",
      statusDraft: "Grupo creado, revisa tu WhatsApp para validar.",
      statusActivated: "Contrato desplegado y orden inicial lista.",
      verifyHint: "El bot valida el código cuando respondes en WhatsApp.",
    },
    payment: {
      connect: "Conectar Freighter",
      payWithWallet: "Pagar con wallet",
      confirmFiat: "Confirmar pago QR",
      claimSent: "Confirmación enviada. Verificaremos tu pago.",
      missingAgent: "Configura NEXT_PUBLIC_AGENT_BE_URL para continuar.",
      walletReady: "Wallet conectada",
    },
  },
  en: {
    nav: {
      home: "Home",
      pay: "Payments",
      onboarding: "Onboarding",
      docs: "Docs",
    },
    hero: {
      title: "PasaTanda, rotating savings on Stellar",
      subtitle:
        "Run trusted ROSCAs with local on/off ramps, Soroban contracts, and WhatsApp automation.",
      primaryCta: "Start a tanda",
      secondaryCta: "Open payments",
      metrics: [
        { label: "24/7 settlement", value: "Stellar + XDR" },
        { label: "On/Off ramp", value: "Bank QR" },
        { label: "Custody", value: "Soroban" },
      ],
    },
    valueProps: {
      stellar: {
        title: "Security on Stellar",
        body:
          "Freighter + x402 signatures validate payments without exposing keys. Soroban contracts track rounds and funds.",
      },
      onramp: {
        title: "Local on/off ramp",
        body:
          "Pay with bank QR or USDC. The backend verifies proofs and issues dynamic order links.",
      },
      automation: {
        title: "WhatsApp automation",
        body:
          "The bot onboards members, reminds payments, and lets the admin activate the tanda from chat.",
      },
    },
    howItWorks: {
      title: "How it works",
      steps: [
        "Request a verification code and create the group in DRAFT state.",
        "Admin types 'iniciar tanda' or uses the panel to deploy the contract and first order.",
        "Each payment issues a /pagos/{id} link with QR, XDR challenge, and live tracking.",
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Do I need crypto to start?",
          a: "No. You can begin with bank QR payments only. Stellar wallet is optional for USDC payouts.",
        },
        {
          q: "Where are funds held?",
          a: "Custody lives in Soroban contracts and fiat proofs are validated by PayBE.",
        },
        {
          q: "Which wallets are supported?",
          a: "Freighter in browser for XDR and x402 signatures. More wallets coming soon with SEP-30.",
        },
        {
          q: "How do you convert to USDC?",
          a: "The backend computes the USDC amount on each order; no fixed FX is set in the UI.",
        },
      ],
    },
    docs: {
      title: "Project documentation",
      intro:
        "Review architecture, flows, and public endpoints without exposing secrets. Perfect for handoff and support.",
      sections: [
        {
          title: "Architecture",
          items: [
            "Next.js frontend with monochrome MUI and bilingual copy.",
            "AgentBE orchestrates WhatsApp, verification, and order creation.",
            "PayBE handles on/off ramp and sends webhooks back to AgentBE.",
          ],
        },
        {
          title: "Flows",
          items: [
            "Onboarding: WhatsApp verification, DRAFT group creation, activation with Soroban contract.",
            "Payments: /pagos/{id} link with QR, XDR challenge, and fiat/crypto claims.",
            "x402: Freighter signatures to build secure X-PAYMENT headers.",
          ],
        },
        {
          title: "Integrations",
          items: [
            "Freighter API to request address, network, and sign XDR.",
            "x402-stellar-client to create X-PAYMENT headers.",
            "AgentBE endpoints: /api/onboarding, /api/orders/:id, /api/orders/:id/claim.",
          ],
        },
      ],
    },
    onboarding: {
      title: "Onboarding and verification",
      subtitle:
        "Request a code, create the group, and optionally deploy the tanda without leaving the browser.",
      requestCode: "Send code",
      createDraft: "Create DRAFT group",
      activateGroup: "Activate tanda",
      phone: "WhatsApp (country code)",
      code: "Verification code",
      username: "Username",
      groupName: "Group name",
      amountBs: "Amount in Bs",
      usdc: "Amount in USDC (optional)",
      freq: "Frequency (days)",
      yieldLabel: "Share yield with members",
      statusDraft: "Group created, check WhatsApp to validate.",
      statusActivated: "Contract deployed and first order ready.",
      verifyHint: "The bot validates the code when you reply on WhatsApp.",
    },
    payment: {
      connect: "Connect Freighter",
      payWithWallet: "Pay with wallet",
      confirmFiat: "Confirm QR payment",
      claimSent: "Confirmation sent. We will verify your payment.",
      missingAgent: "Set NEXT_PUBLIC_AGENT_BE_URL to continue.",
      walletReady: "Wallet connected",
    },
  },
};

type Messages = (typeof translations)[Locale];

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

// Create a simple store for locale
let localeListeners: Array<() => void> = [];
let currentLocale: Locale = "es";

const localeStore = {
  getSnapshot: () => currentLocale,
  getServerSnapshot: () => "es" as Locale,
  subscribe: (listener: () => void) => {
    localeListeners.push(listener);
    return () => {
      localeListeners = localeListeners.filter(l => l !== listener);
    };
  },
  setLocale: (newLocale: Locale) => {
    currentLocale = newLocale;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pt-lang", newLocale);
      document.documentElement.lang = newLocale;
    }
    localeListeners.forEach(listener => listener());
  },
  initialize: () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("pt-lang");
    if (stored === "en" || stored === "es") {
      currentLocale = stored;
    } else {
      const lang = navigator.language?.toLowerCase() || "es";
      currentLocale = lang.startsWith("en") ? "en" : "es";
    }
    document.documentElement.lang = currentLocale;
  }
};

// Initialize on module load (client-side only)
if (typeof window !== "undefined") {
  localeStore.initialize();
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    localeStore.subscribe,
    localeStore.getSnapshot,
    localeStore.getServerSnapshot
  );

  const setLocale = useCallback((newLocale: Locale) => {
    localeStore.setLocale(newLocale);
  }, []);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    t: translations[locale],
  }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n debe usarse dentro de I18nProvider");
  return ctx;
}
