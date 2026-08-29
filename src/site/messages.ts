import { localizeValue } from "./i18n";
import type { Locale } from "./types";

const messages = {
  navCollection: { en: "Collection", de: "Kollektion", it: "Collezione" },
  navAbout: { en: "About", de: "About", it: "Chi siamo" },
  navBespoke: { en: "Bespoke", de: "Bespoke", it: "Su misura" },
  navHeirloom: { en: "Heirloom Transformation", de: "Heirloom Transformation", it: "Trasformazione di cimeli" },
  footerDiscover: { en: "Discover", de: "Entdecken", it: "Scopri" },
  footerAllProducts: { en: "All products", de: "Alle Produkte", it: "Tutti i prodotti" },
  footerPages: { en: "Pages", de: "Seiten", it: "Pagine" },
  footerContact: { en: "Contact", de: "Kontakt", it: "Contatti" },
  footerPayment: { en: "Payment", de: "Zahlung", it: "Pagamento" },
  footerPrivacy: { en: "Privacy policy", de: "Datenschutz", it: "Privacy" },
  footerEuroOnly: { en: "EUR only", de: "Nur EUR", it: "Solo EUR" },
  heroExplore: { en: "Explore the collection", de: "Kollektion entdecken", it: "Esplora la collezione" },
  homeCollectionsEyebrow: { en: "Collections", de: "Kollektionen", it: "Collezioni" },
  homeCollectionsTitle: { en: "By shape, story, and material language", de: "Nach Form, Geschichte und Materialsprache", it: "Per forma, storia e linguaggio materico" },
  homeServicesEyebrow: { en: "Services", de: "Services", it: "Servizi" },
  homeServicesTitle: { en: "Personal commissions and heirloom redesign", de: "Persönliche Auftragsarbeiten und Neugestaltung von Erbstücken", it: "Commissioni personali e trasformazione di cimeli" },
  homeServicesBody: {
    en: "Developed one-to-one, with direct conversation through WhatsApp and Instagram and a strong emphasis on traceable materials, symbolism, and hand craftsmanship.",
    de: "Im direkten Austausch über WhatsApp und Instagram entwickelt, mit starkem Fokus auf nachvollziehbare Materialien, Symbolik und handwerkliche Fertigung.",
    it: "Sviluppati uno a uno, con dialogo diretto via WhatsApp e Instagram e una forte attenzione a materiali tracciabili, simbolismo e manifattura artigianale."
  },
  zodiacCollection: { en: "Zodiac Collection", de: "Zodiac Kollektion", it: "Collezione Zodiac" },
  collectionOverviewEyebrow: { en: "Collections", de: "Kollektionen", it: "Collezioni" },
  collectionDetailEyebrow: { en: "Collection", de: "Kollektion", it: "Collezione" },
  productRelatedEyebrow: { en: "Related pieces", de: "Passende Stücke", it: "Pezzi correlati" },
  productRelatedTitle: { en: "More from the collection", de: "Mehr aus der Kollektion", it: "Altri pezzi della collezione" },
  contactWhatsapp: { en: "WhatsApp", de: "WhatsApp", it: "WhatsApp" },
  contactInstagram: { en: "Instagram", de: "Instagram", it: "Instagram" },
  redirectEyebrow: { en: "Redirect", de: "Weiterleitung", it: "Reindirizzamento" },
  redirectTitle: { en: "Page moved", de: "Seite verschoben", it: "Pagina spostata" },
  redirectBody: {
    en: "This route has been normalized in the static rebuild. Continue to",
    de: "Diese Route wurde im statischen Neuaufbau vereinheitlicht. Weiter zu",
    it: "Questo percorso e stato normalizzato nella ricostruzione statica. Continua su"
  },
  privacyEyebrow: { en: "Privacy", de: "Datenschutz", it: "Privacy" },
  privacyTitle: { en: "Privacy policy", de: "Datenschutz", it: "Privacy" },
  privacyBodyOne: {
    en: "This static version of LURI jewels does not provide account login, cart storage, or server-side session handling. If you contact LURI through WhatsApp, Instagram, or email, the information you share is used only to answer your request and coordinate orders or bespoke work.",
    de: "Diese statische Version von LURI jewels bietet kein Login, keinen Warenkorb und keine serverseitigen Sitzungen. Wenn Sie LURI ueber WhatsApp, Instagram oder E-Mail kontaktieren, werden Ihre Angaben nur zur Beantwortung Ihrer Anfrage und zur Abstimmung von Bestellungen oder Massanfertigungen verwendet.",
    it: "Questa versione statica di LURI jewels non offre accesso account, carrello o gestione di sessioni lato server. Se contatti LURI tramite WhatsApp, Instagram o email, le informazioni condivise vengono usate solo per rispondere alla tua richiesta e coordinare ordini o lavori su misura."
  },
  privacyBodyTwo: {
    en: "Product browsing on this site is anonymous aside from standard hosting and analytics logs that may be provided by GitHub Pages or any future CDN configured for asset delivery.",
    de: "Die Produktnavigation auf dieser Website ist anonym, abgesehen von den ueblichen Hosting- und Analyseprotokollen, die von GitHub Pages oder einem kuenftigen CDN fuer die Asset-Auslieferung bereitgestellt werden koennen.",
    it: "La navigazione dei prodotti su questo sito e anonima, salvo i normali log di hosting e analisi eventualmente forniti da GitHub Pages o da un futuro CDN configurato per distribuire gli asset."
  },
  privacyBodyThree: {
    en: "For privacy-related requests, please contact",
    de: "Fuer Datenschutzanfragen kontaktieren Sie bitte",
    it: "Per richieste relative alla privacy, contatta"
  }
} as const;

export function t(locale: Locale, key: keyof typeof messages): string {
  return localizeValue(messages[key], locale);
}
