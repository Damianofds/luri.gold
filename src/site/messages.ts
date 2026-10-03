import { localizeValue } from "./i18n";
import type { Locale } from "./types";

const messages = {
  navHome: { en: "Home", de: "Home", it: "Home" },
  navCollection: { en: "Shop", de: "Shop", it: "Shop" },
  navMenu: { en: "Menu", de: "Menue", it: "Menu" },
  navClose: { en: "Close", de: "Schliessen", it: "Chiudi" },
  navAbout: { en: "About", de: "About", it: "Chi siamo" },
  navBespoke: { en: "Bespoke", de: "Bespoke", it: "Su misura" },
  navHeirloom: { en: "Heirloom Transformation", de: "Heirloom Transformation", it: "Trasformazione di cimeli" },
  carouselLabel: { en: "Slideshow about our brand", de: "Slideshow über unsere Marke", it: "Presentazione del nostro marchio" },
  carouselPrevious: { en: "Previous slide", de: "Vorherige Folie", it: "Slide precedente" },
  carouselNext: { en: "Next slide", de: "Nächste Folie", it: "Slide successiva" },
  carouselPause: { en: "Pause slideshow", de: "Slideshow pausieren", it: "Metti in pausa" },
  carouselPlay: { en: "Play slideshow", de: "Slideshow abspielen", it: "Avvia presentazione" },
  carouselGoTo: { en: "Load slide", de: "Folie laden", it: "Carica slide" },
  footerDiscover: { en: "Discover", de: "Entdecken", it: "Scopri" },
  footerAllProducts: { en: "All products", de: "Alle Produkte", it: "Tutti i prodotti" },
  footerPages: { en: "Pages", de: "Seiten", it: "Pagine" },
  footerContact: { en: "Contact", de: "Kontakt", it: "Contatti" },
  footerPayment: { en: "Payment", de: "Zahlung", it: "Pagamento" },
  footerFollow: { en: "Follow", de: "Folgen", it: "Segui" },
  footerContactIntro: {
    en: "Reach out directly for bespoke commissions, heirloom transformation, and product enquiries.",
    de: "Direkter Kontakt fuer Massanfertigungen, Erbstueck-Verwandlungen und Produktanfragen.",
    it: "Contatto diretto per creazioni su misura, trasformazioni di cimeli e richieste sui prodotti."
  },
  footerPrivacy: { en: "Privacy policy", de: "Datenschutz", it: "Privacy" },
  footerShipping: { en: "Payment & Shipping", de: "Zahlung & Versand", it: "Pagamento e spedizione" },
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
  allProductsTitle: { en: "Products", de: "Produkte", it: "Prodotti" },
  collectionsTitle: { en: "Collections", de: "Kollektionen", it: "Collezioni" },
  collectionsDescription: {
    en: "Browse the current LURI collections by material language, form, and story.",
    de: "Entdecke die aktuellen LURI Kollektionen nach Materialsprache, Form und Erzaehlung.",
    it: "Esplora le collezioni LURI per linguaggio materico, forma e racconto."
  },
  productsCount: { en: "products", de: "Produkte", it: "prodotti" },
  filterCollection: { en: "Collection", de: "Kollektion", it: "Collezione" },
  filterAll: { en: "All", de: "Alle", it: "Tutte" },
  filterMinPrice: { en: "Minimum price", de: "Mindestpreis", it: "Prezzo minimo" },
  filterMaxPrice: { en: "Maximum price", de: "Höchstpreis", it: "Prezzo massimo" },
  sortBy: { en: "Sort by", de: "Sortieren nach", it: "Ordina per" },
  sortFeatured: { en: "Featured", de: "Ausgewählt", it: "In evidenza" },
  sortTitleAsc: { en: "Alphabetically, A-Z", de: "Alphabetisch, A-Z", it: "Alfabetico, A-Z" },
  sortTitleDesc: { en: "Alphabetically, Z-A", de: "Alphabetisch, Z-A", it: "Alfabetico, Z-A" },
  sortPriceAsc: { en: "Price, low to high", de: "Preis, aufsteigend", it: "Prezzo crescente" },
  sortPriceDesc: { en: "Price, high to low", de: "Preis, absteigend", it: "Prezzo decrescente" },
  collectionOverviewEyebrow: { en: "Collections", de: "Kollektionen", it: "Collezioni" },
  collectionDetailEyebrow: { en: "Collection", de: "Kollektion", it: "Collezione" },
  productRelatedEyebrow: { en: "Related pieces", de: "Passende Stücke", it: "Pezzi correlati" },
  productRelatedTitle: { en: "More from the collection", de: "Mehr aus der Kollektion", it: "Altri pezzi della collezione" },
  productImages: { en: "Product images", de: "Produktbilder", it: "Immagini del prodotto" },
  productImagePrevious: { en: "Previous image", de: "Vorheriges Bild", it: "Immagine precedente" },
  productImageNext: { en: "Next image", de: "Nächstes Bild", it: "Immagine successiva" },
  productTaxes: { en: "Taxes included.", de: "Steuern inklusive.", it: "Imposte incluse." },
  contactWhatsapp: { en: "WhatsApp", de: "WhatsApp", it: "WhatsApp" },
  contactWhatsappAction: { en: "Chat on WhatsApp", de: "Auf WhatsApp schreiben", it: "Scrivi su WhatsApp" },
  contactWhatsappPrompt: {
    en: "Start a direct conversation about a jewel, bespoke piece, or heirloom transformation.",
    de: "Beginne ein persönliches Gespräch über ein Schmuckstück, eine Maßanfertigung oder die Umarbeitung eines Erbstücks.",
    it: "Inizia una conversazione diretta su un gioiello, una creazione su misura o la trasformazione di un gioiello di famiglia."
  },
  contactEmail: { en: "Email", de: "E-Mail", it: "Email" },
  contactEmailAction: { en: "Send an email", de: "E-Mail senden", it: "Invia un'email" },
  contactEmailPrompt: {
    en: "Share your ideas and questions by email and I will reply as soon as possible.",
    de: "Sende mir deine Ideen und Fragen per E-Mail – ich antworte so bald wie möglich.",
    it: "Condividi le tue idee e domande via email: ti risponderò il prima possibile."
  },
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
    en: "You can browse the luri.gold website without creating an account. LURI receives personal information only when you choose to get in touch by WhatsApp or email, or when you complete a payment through PayPal. The information you share is used to answer your request and coordinate your order or bespoke work.",
    de: "Du kannst die Website luri.gold ohne Benutzerkonto besuchen. LURI erhält persönliche Angaben nur, wenn du über WhatsApp oder E-Mail Kontakt aufnimmst oder eine Zahlung über PayPal abschließt. Deine Angaben werden verwendet, um deine Anfrage zu beantworten und deine Bestellung oder Maßanfertigung abzustimmen.",
    it: "Puoi visitare il sito luri.gold senza creare un account. LURI riceve dati personali solo quando scegli di contattarmi via WhatsApp o email oppure quando completi un pagamento tramite PayPal. Le informazioni che condividi vengono usate per rispondere alla tua richiesta e organizzare il tuo ordine o una creazione su misura."
  },
  privacyBodyTwo: {
    en: "The website is hosted on GitHub Pages. GitHub logs visitors' IP addresses for security purposes. If you follow a link to WhatsApp or PayPal, those services handle your information under their own privacy policies.",
    de: "Die Website wird über GitHub Pages bereitgestellt. GitHub protokolliert die IP-Adressen von Besucherinnen und Besuchern zu Sicherheitszwecken. Wenn du einem Link zu WhatsApp oder PayPal folgst, verarbeiten diese Dienste deine Daten nach ihren eigenen Datenschutzbestimmungen.",
    it: "Il sito è ospitato su GitHub Pages. GitHub registra gli indirizzi IP dei visitatori per motivi di sicurezza. Se segui un link a WhatsApp o PayPal, questi servizi trattano i tuoi dati secondo le proprie informative sulla privacy."
  },
  privacyBodyThree: {
    en: "For questions about your privacy or to request access, correction, or deletion of information you shared with LURI, please contact",
    de: "Bei Fragen zum Datenschutz oder wenn du deine bei LURI gespeicherten Angaben einsehen, berichtigen oder löschen lassen möchtest, schreibe bitte an",
    it: "Per domande sulla privacy o per chiedere l'accesso, la correzione o la cancellazione dei dati condivisi con LURI, scrivi a"
  }
} as const;

export function t(locale: Locale, key: keyof typeof messages): string {
  return localizeValue(messages[key], locale);
}
