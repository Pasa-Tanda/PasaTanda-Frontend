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
      tos: "Términos",
      privacy: "Privacidad",
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
      title: "Pago de cuota",
      subtitle: "Selecciona tu método de pago preferido",
      connect: "Conectar Freighter",
      payWithWallet: "Pagar con wallet",
      confirmFiat: "Confirmar pago QR",
      claimSent: "Confirmación enviada. Verificaremos tu pago.",
      missingAgent: "Configura NEXT_PUBLIC_AGENT_BE_URL para continuar.",
      walletReady: "Wallet conectada",
      selectMethod: "Método de pago",
      qrSimple: "QR Bancario",
      stellarWallet: "Wallet Stellar",
      orderDetails: "Detalles de la orden",
      amount: "Monto",
      status: "Estado",
      group: "Grupo",
      round: "Ronda",
      dueDate: "Fecha límite",
      bank: "Banco",
      reference: "Referencia",
      proofUrl: "URL del comprobante",
      trustlineRequired: "Trustline requerido",
      trustlineDesc: "Necesitas agregar el token USDC a tu wallet para continuar.",
      addTrustline: "Agregar Trustline",
      trustlineAdded: "Trustline USDC agregado correctamente",
      connectWalletFirst: "Conecta tu wallet primero",
      paymentPending: "Pago pendiente",
      paymentCompleted: "Pago completado",
      paymentFailed: "Pago fallido",
      walletConnected: "Wallet conectada",
      walletDisconnected: "Wallet desconectada",
      disconnect: "Desconectar",
      errorConnecting: "Error al conectar wallet",
      errorProcessing: "Error procesando pago",
    },
    tos: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización",
      intro: "Estos términos de servicio regulan el uso de la plataforma PasaTanda. Por favor, léelos cuidadosamente antes de utilizar nuestros servicios.",
      sections: {
        acceptance: {
          title: "1. Aceptación de los Términos",
          content: "Al utilizar PasaTanda, aceptas cumplir con estos términos de servicio y todas las leyes aplicables. Si no estás de acuerdo con alguno de estos términos, no debes usar la plataforma.",
        },
        description: {
          title: "2. Descripción del Servicio",
          content: "PasaTanda es una plataforma que facilita la gestión de tandas (ROSCA/Pasanaku) utilizando la blockchain de Stellar. Proporcionamos herramientas para organizar grupos, gestionar pagos y automatizar la distribución de fondos.",
        },
        responsibilities: {
          title: "3. Responsabilidades del Usuario",
          items: [
            "Mantener la seguridad de sus wallets y claves privadas",
            "Proporcionar información veraz durante el registro",
            "Cumplir con los pagos acordados dentro del grupo",
            "No utilizar la plataforma para actividades ilegales",
          ],
        },
        participation: {
          title: "4. Participación en Tandas",
          content: "Al unirte a una tanda, te comprometes a realizar los pagos según el calendario establecido. El incumplimiento puede resultar en la pérdida de tu turno y restricciones en la plataforma.",
        },
        liability: {
          title: "5. Limitación de Responsabilidad",
          content: "PasaTanda actúa únicamente como facilitador tecnológico. No somos responsables de disputas entre participantes, pérdidas por errores de usuario o fluctuaciones en el valor de activos digitales.",
        },
        modifications: {
          title: "6. Modificaciones",
          content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al ser publicados en la plataforma. El uso continuado del servicio después de las modificaciones constituye la aceptación de los nuevos términos.",
        },
      },
      contact: "Para consultas sobre estos términos, contacta a:",
    },
    privacy: {
      title: "Políticas de Privacidad",
      lastUpdated: "Última actualización",
      intro: "En PasaTanda, valoramos tu privacidad y nos comprometemos a proteger tus datos. Esta política describe cómo recopilamos, usamos y protegemos tu información.",
      sections: {
        collection: {
          title: "1. Información que Recopilamos",
          content: "PasaTanda minimiza la recopilación de datos personales. No almacenamos información personal sensible. Las direcciones de wallet y transacciones son registradas en la blockchain de Stellar de forma pública y transparente.",
        },
        usage: {
          title: "2. Uso de la Información",
          content: "La información de las transacciones es pública en la blockchain de Stellar y se utiliza únicamente para verificar pagos, gestionar turnos de la tanda y mantener el registro del contrato inteligente.",
        },
        security: {
          title: "3. Seguridad",
          content: "Nos comprometemos a proteger la seguridad de tu información mediante el uso de tecnología blockchain y contratos inteligentes auditables. Las llaves privadas nunca son almacenadas en nuestros servidores.",
        },
        rights: {
          title: "4. Tus Derechos",
          content: "Tienes derecho a acceder, rectificar y eliminar tus datos personales (cuando no estén en blockchain). Para ejercer estos derechos, contacta a nuestro equipo de soporte.",
        },
      },
      contact: "Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos, puedes contactarnos a través de nuestro canal de WhatsApp o por correo electrónico.",
    },
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      confirm: "Confirmar",
      back: "Volver",
      next: "Siguiente",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      close: "Cerrar",
      retry: "Reintentar",
      copied: "¡Copiado!",
      copyToClipboard: "Copiar al portapapeles",
    },
    footer: {
      tagline: "Ahorro colaborativo sobre Stellar",
      links: "Enlaces",
      legal: "Legal",
      contact: "Contacto",
      copyright: "Todos los derechos reservados.",
    },
  },
  en: {
    nav: {
      home: "Home",
      pay: "Payments",
      onboarding: "Onboarding",
      docs: "Docs",
      tos: "Terms",
      privacy: "Privacy",
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
      title: "Payment",
      subtitle: "Select your preferred payment method",
      connect: "Connect Freighter",
      payWithWallet: "Pay with wallet",
      confirmFiat: "Confirm QR payment",
      claimSent: "Confirmation sent. We will verify your payment.",
      missingAgent: "Set NEXT_PUBLIC_AGENT_BE_URL to continue.",
      walletReady: "Wallet connected",
      selectMethod: "Payment method",
      qrSimple: "Bank QR",
      stellarWallet: "Stellar Wallet",
      orderDetails: "Order details",
      amount: "Amount",
      status: "Status",
      group: "Group",
      round: "Round",
      dueDate: "Due date",
      bank: "Bank",
      reference: "Reference",
      proofUrl: "Proof URL",
      trustlineRequired: "Trustline required",
      trustlineDesc: "You need to add the USDC token to your wallet to continue.",
      addTrustline: "Add Trustline",
      trustlineAdded: "USDC trustline added successfully",
      connectWalletFirst: "Connect your wallet first",
      paymentPending: "Payment pending",
      paymentCompleted: "Payment completed",
      paymentFailed: "Payment failed",
      walletConnected: "Wallet connected",
      walletDisconnected: "Wallet disconnected",
      disconnect: "Disconnect",
      errorConnecting: "Error connecting wallet",
      errorProcessing: "Error processing payment",
    },
    tos: {
      title: "Terms of Service",
      lastUpdated: "Last updated",
      intro: "These terms of service govern the use of the PasaTanda platform. Please read them carefully before using our services.",
      sections: {
        acceptance: {
          title: "1. Acceptance of Terms",
          content: "By using PasaTanda, you agree to comply with these terms of service and all applicable laws. If you do not agree with any of these terms, you should not use the platform.",
        },
        description: {
          title: "2. Service Description",
          content: "PasaTanda is a platform that facilitates the management of tandas (ROSCA/Pasanaku) using the Stellar blockchain. We provide tools to organize groups, manage payments, and automate fund distribution.",
        },
        responsibilities: {
          title: "3. User Responsibilities",
          items: [
            "Maintain the security of your wallets and private keys",
            "Provide truthful information during registration",
            "Comply with agreed payments within the group",
            "Not use the platform for illegal activities",
          ],
        },
        participation: {
          title: "4. Tanda Participation",
          content: "By joining a tanda, you commit to making payments according to the established schedule. Non-compliance may result in loss of your turn and platform restrictions.",
        },
        liability: {
          title: "5. Limitation of Liability",
          content: "PasaTanda acts solely as a technology facilitator. We are not responsible for disputes between participants, losses due to user errors, or fluctuations in the value of digital assets.",
        },
        modifications: {
          title: "6. Modifications",
          content: "We reserve the right to modify these terms at any time. Changes will take effect upon publication on the platform. Continued use of the service after modifications constitutes acceptance of the new terms.",
        },
      },
      contact: "For inquiries about these terms, contact:",
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated",
      intro: "At PasaTanda, we value your privacy and are committed to protecting your data. This policy describes how we collect, use, and protect your information.",
      sections: {
        collection: {
          title: "1. Information We Collect",
          content: "PasaTanda minimizes the collection of personal data. We do not store sensitive personal information. Wallet addresses and transactions are recorded on the Stellar blockchain publicly and transparently.",
        },
        usage: {
          title: "2. Use of Information",
          content: "Transaction information is public on the Stellar blockchain and is used solely to verify payments, manage tanda turns, and maintain the smart contract registry.",
        },
        security: {
          title: "3. Security",
          content: "We are committed to protecting the security of your information through the use of blockchain technology and auditable smart contracts. Private keys are never stored on our servers.",
        },
        rights: {
          title: "4. Your Rights",
          content: "You have the right to access, rectify, and delete your personal data (when not on blockchain). To exercise these rights, contact our support team.",
        },
      },
      contact: "If you have questions about this privacy policy or how we handle your data, you can contact us through our WhatsApp channel or by email.",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      retry: "Retry",
      copied: "Copied!",
      copyToClipboard: "Copy to clipboard",
    },
    footer: {
      tagline: "Collaborative savings on Stellar",
      links: "Links",
      legal: "Legal",
      contact: "Contact",
      copyright: "All rights reserved.",
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
