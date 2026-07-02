# THE SALT — Handoff tecnico

Sito vetrina / piattaforma editoriale di **Paolo Santoro** (Maître du Sel).
Non è un e-commerce: è un sito **statico** che usa il sale come chiave narrativa
per raccontare persone, territori, cultura e identità.

Dominio: **thesalt.it** — Email: psantoro@thesalt.it

---

## 1. Stack & principi

- **Sito 100% statico**: solo HTML + un CSS + immagini. Nessun build, nessun
  framework, nessuna dipendenza npm. Vanilla JS minimo (menu mobile, scroll
  reveal, cookie banner, conferma form).
- Font via Google Fonts: **Archivo** (titoli/logo, pesi 800–900) e **Inter** (testo).
- Nessun backend. Il form usa un servizio esterno (vedi §6).
- Tutti i percorsi sono **relativi** (`assets/...`, `pagina.html`): il sito
  funziona sia in root che in sottocartella, su qualsiasi host.

## 2. Struttura file

```
/
├── index.html                       Home (hero, The Salt, Maître, Journal,
│                                     Format overview, Eventi, Podcast, Libri, CTA)
├── format.html                      I 6 format in dettaglio
├── journal.html                     The Salt Journal — indice magazine
├── journal-tra-destino-e-caso.html  Articolo 01 (con archivio per anno a lato)
├── libri.html                       Il Sale del Führer + Elogio al Sale
├── gallery.html                     Galleria immagini (masonry B/N)
├── contatti.html                    Form contatti + poster Fleur de Sel
├── privacy.html                     Privacy Policy
├── cookie.html                      Cookie Policy
└── assets/
    ├── style.css                    UNICO foglio di stile (design system)
    └── img/                         Immagini (jpg/png) + favicon
```

## 3. Design system (assets/style.css)

Variabili CSS in `:root`:
- `--ink #141414` (testo), `--ink-soft`, `--muted`
- `--paper #ffffff` (sfondo), `--line` (bordi)
- `--teal #2f5d52` e `--sage #8aa899` — accento (usato con parsimonia: occhielli,
  link, poster Fleur de Sel). NB: le "fasce" colorate sono state rimosse su
  richiesta → ora la classe `.band` è **grigia** (`#f4f3f0`), non verde.
- Menu e occhiello hero: grigio `#8f8f8f`.

Componenti/classi principali:
- `.hero` (a tutta altezza, contenuto in alto), `.hero-strip` (4 immagini B/N)
- `.editorial` / `.editorial.rev` (blocco immagine + testo alternato)
- `.shead` (intestazione sezione con `.kicker`)
- `.format-list` / `.format-row` (elenco format numerato)
- `.grid` + `.card` (griglia eventi/gallery; `.tag`, `h5`, `.cap`)
- `.book` (scheda libro), `.journal-grid` / `.jcard` (magazine)
- `.article` + `.archive` (pagina articolo con sidebar archivio per anno)
- `.legal` (pagine privacy/cookie)
- `#cookie-banner` (banner consenso)
- Utility: `.snap-full` (sezione a tutta altezza con scroll-snap), `.band`, `.btn`
- Scroll: `html{scroll-snap-type:y proximity; scroll-padding-top:74px}` così le
  sezioni si centrano e non "sborda" la successiva.

Header/menu e footer sono **duplicati in ogni pagina** (sito statico, niente
include). Se modifichi la nav o il footer, aggiornali in tutte le pagine.

Nav attuale: The Salt · Format · Eventi · Journal · Podcast · Libri · Gallery · Contatti.

## 4. Immagini (assets/img)

Estratte dal PowerPoint del cliente e ottimizzate (max 1600px, jpg q82).
- `spoonbill.png` = mascotte (spatola rosa), usata in footer e favicon.
- `fleur.jpg` = poster "Fleur de Sel" (contatti).
- `book-fuhrer.jpg`, `book-elogio.jpg` = copertine.
- `hero-paolo.jpg`, `maitre.jpg`, `podcast.jpg`, `extravisionary.jpg`, `bio.jpg`.
- `f-*.jpg` = foto format; `ev-*.jpg` = foto eventi; `hero1..4.jpg` = strip hero.
- `ev-soon.jpg` = **placeholder** "foto in arrivo" (dove manca la foto reale).
- favicon: `favicon.ico`, `favicon-16/32.png`, `apple-touch-icon.png`.

## 5. Contenuti / cosa manca (TODO)

Foto **non ancora fornite** dal cliente (ora placeholder `ev-soon.jpg`):
- Format → Degustazioni: foto giusta (l'attuale era di altro tipo di evento).
- Format → Talk Dinner: foto giusta.
- Evento **Vetreria**: foto corretta.
- Nuovi eventi (in `index.html`, sezione `#eventi`): Palmarola, Switch Explorer
  (Tempio di Adriano, pOsti per AgroCamera), "Sua Maestà il Cuore", Talk Dinner
  Gaggenau, Mondadori (Il Sale del Führer), Masterclass Intrecci, Locanda
  Ruggieri, Taverna Paradiso (masterclass + cocktails), Commissione Intrecci,
  Ponza. Per i più recenti sono previste **più foto**.
- **Sequenza 4 immagini hero** in home: da definire con il cliente.
- Sezione **"SALE"** del deck originale: non ancora realizzata (mancano i contenuti).

Ordine eventi: **lista piatta, il più recente in cima** (no categorie). Il primo
è Palmarola.

Journal: struttura pronta per **archivio per anno**. Per aggiungere un articolo:
1. duplica `journal-tra-destino-e-caso.html`, rinomina, cambia testo/immagine;
2. aggiungi la card in `journal.html` (`.journal-grid`);
3. aggiungi la voce nell'`.archive` (sidebar) dell'articolo, sotto l'anno giusto.

## 6. Form contatti (contatti.html)

Attualmente usa **FormSubmit** (https://formsubmit.co):
```
<form action="https://formsubmit.co/psantoro@thesalt.it" method="POST">
```
Al PRIMO invio reale FormSubmit manda una mail di **attivazione** a
psantoro@thesalt.it: va confermata una sola volta. Poi le richieste arrivano
in casella. Dopo l'invio l'utente torna con `?ok=1` e vede il messaggio "Grazie".

**Alternativa preferita dal cliente: Brevo.** Per passare a Brevo: creare un
Form in Brevo (campi Email/Nome/Messaggio), prendere l'URL `https://sibforms.com/serve/XXXX`
e sostituire l'`action` del form (+ eventuale endpoint AJAX per non lasciare la pagina).

## 7. Cookie / Privacy

- Banner cookie (`#cookie-banner`) su tutte le pagine principali, scelta salvata
  in `localStorage` (`ts-cookie`). Solo cookie tecnici/analitici, no profilazione.
- Pagine `privacy.html` e `cookie.html` con i testi forniti dal cliente.

## 8. Deploy

### A) Stato attuale — Register (hosting WordPress gestito, teamblue)
Il vecchio WordPress è stato **disattivato** (rinominati `index.php` → `index.php.bck`
e `.htaccess` → `.htaccess.bck` nella docroot `www`). I file statici sono stati
caricati in `www`. Attenzione a eventuale **cache lato hosting**: dopo l'upload va
svuotata dal pannello Register (Hosting → Impostazioni Hosting → Cache) o via
assistenza (cod. cliente PS41176-EURO).
Docroot: `/data/sites/web/thesaltit/www`. Le immagini vecchie stanno ancora in
`wp-content/uploads` (innocue).

### B) Preferito dal cliente — Vercel collegato a GitHub
Il cliente ha **Vercel collegato a GitHub**. Flusso: push dei file nel repo →
Vercel fa il deploy automatico. Sito statico → Framework Preset "Other", nessun
build command, output dir = root. Dominio thesalt.it dai Domains di Vercel.
**Le email restano su Register**: NON toccare i record MX del dominio.

Suggerimento: un solo `vercel.json` opzionale se si vogliono URL puliti
(`"cleanUrls": true`), altrimenti nessuna config necessaria.

## 9. Idee evolutive

- Il cliente vuole poter **inserire da solo** articoli (Journal) ed eventi.
  Su sito statico si può fare con un **CMS git-based headless** (es. Decap/Netlify
  CMS o TinaCMS) sopra il repo GitHub+Vercel: pannello web, commit automatici,
  deploy automatico. Valutare in fase 2.
- Podcast "The Salt People" (da ottobre 2026): predisporre sezione episodi.

---
Generato come handoff del progetto THE SALT. Sito statico, pronto al deploy.
