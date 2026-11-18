// =====================================================
//  GEO-SPIEL – Finde das Land, Welches Land ist das?, Flaggen (2 Varianten), Hauptstädte, Karteikarten
// =====================================================


// ----- 1. Einstellungen -----
const ANZAHL_RUNDEN = 10;    // wie viele Länder pro Spiel (höchstens)

// Welche Länder abgefragt werden, steht in den Länderdaten:
//   SPIEL = true  → eigenständiges Land, wird abgefragt
//   KLEIN = true  → sehr kleines Land (unter 1000 km²), auf dem Globus kaum anklickbar

// Wohin der Globus schaut, wenn ein Gebiet gewählt wird
// lat = Breitengrad (Nord/Süd), lng = Längengrad (Ost/West), altitude = Abstand (kleiner = näher)
const GEBIET_ANSICHT = {
  'Welt':          { lat: 20,  lng: 10,   altitude: 2.5 },
  'Europe':        { lat: 52,  lng: 15,   altitude: 1.1 },
  'Africa':        { lat: 2,   lng: 20,   altitude: 1.6 },
  'Asia':          { lat: 35,  lng: 90,   altitude: 1.8 },
  'North America': { lat: 40,  lng: -95,  altitude: 1.6 },
  'South America': { lat: -18, lng: -60,  altitude: 1.5 },
  'Oceania':       { lat: -22, lng: 150,  altitude: 1.5 }
};

// Farben
const FARBE_NORMAL  = 'rgba(255, 255, 255, 0.05)';
const FARBE_INAKTIV = 'rgba(0, 0, 0, 0.55)';      // abgedunkelt = gehört nicht zum Spiel
const FARBE_MAUS    = 'rgba(255, 200, 0, 0.7)';   // gelb
const FARBE_RICHTIG = 'rgba(40, 200, 90, 0.9)';   // grün
const FARBE_FALSCH  = 'rgba(230, 50, 50, 0.9)';   // rot
const FARBE_FRAGE   = 'rgba(0, 170, 255, 0.85)';  // blau = das Land, um das es geht
const FARBE_STADT   = '#ffd400';                   // gelber Punkt = Hauptstadt
const FARBE_GRUPPE  = 'rgba(160, 90, 255, 0.75)';  // lila = gehört zur Gruppe
const FARBE_MEER    = 'rgba(0, 140, 255, 0.22)';   // Meere: leicht blau
const FARBE_MEER_AN = 'rgba(0, 220, 255, 0.6)';    // ausgewähltes Meer: hell
const FARBE_MEER_MAUS = 'rgba(255, 220, 80, 0.35)';// Meer unter der Maus


// ----- 2. Die "Gedächtnis-Schachteln" (Variablen) des Spiels -----
let sprache = 'de';        // gewählte Sprache: 'de', 'en', 'fr' oder 'ar'
let spiel = 'finden';      // 'finden' = Finde das Land, 'erkennen' = Welches Land ist das?,
                           // 'flagge' = Flagge auf dem Globus, 'flaggeMC' = Flagge mit 4 Antworten,
                           // 'hauptstadt' = Hauptstädte-Quiz, 'karten' = Karteikarten,
                           // 'entdecken' = freies Entdecken ohne Fragen, 'gruppen' = Regionen & Gruppen
let aktiveGruppe = null;   // Regionen & Gruppen: die gerade gezeigte Gruppe
let gruppenSet = new Set();// Regionen & Gruppen: Ländercodes der Mitglieder
let alleMeere = [];        // Meeresflächen aus meere.geojson
let aktivesMeer = null;    // Meere & Ozeane: das ausgewählte Meer
let entdecktesMeer = null; // Entdecken: angetipptes Meer (leuchtet hell)
let wlSchritt = 'name';    // Worldle: 'name', 'nachbarn', 'hauptstadt' oder 'punkt'
let wlMax = 0;             // Worldle: so viele Punkte waren bisher möglich
let fkSchritt = 'name';    // Flagge → Name → Karte: 'name' (Schritt 1) oder 'karte' (Schritt 2)
let zielMeer = null;       // Finde das Meer: das gesuchte Meer
let meerRichtig = null;    // Finde das Meer: wird grün angezeigt
let meerFalsch = null;     // Finde das Meer: wird rot angezeigt (Lernmodus)
let falscheMeere = new Set(); // Finde das Meer: falsch geklickte Meere (Profi-Modus, bleiben rot)
let hauptstaedte = {};     // Hauptstädte aus der Datei hauptstaedte.json
let laenderInfo = {};      // Einwohner, Fläche, Sprachen, Währung, Religion (laenderinfo.json)
let kartenStapel = [];     // Karteikarten: die Länder in (gemischter) Reihenfolge
let kartenNummer = 0;      // Karteikarten: welche Karte gerade angezeigt wird
let karteUmgedreht = false;// Karteikarten: sieht man gerade die Rückseite?
let alleLaender = [];      // alle Länder aus der Datei
let gebiet = 'Welt';       // gewählter Kontinent
let spielLaender = [];     // die Länder für dieses Spiel
let rundenNummer = 0;      // in welcher Runde sind wir?
let modus = 'lernen';      // 'lernen' = mit Hilfe, 'profi' = ohne Hilfe
let punkte = 0;            // wie viele richtig (beim ersten Versuch)?
let fehler = 0;            // Profi-Modus: wie viele falsche Klicks insgesamt?
let aufgegeben = 0;        // Profi-Modus: wie oft "Zeig es mir" gedrückt?
let schonFalsch = false;   // Profi-Modus: in dieser Runde schon einmal falsch geklickt?
let gesuchtesLand = null;  // welches Land soll gefunden werden?
let landUnterMaus = null;  // über welchem Land ist die Maus?
let richtigesLand = null;  // wird grün angezeigt
let falschesLand = null;   // wird rot angezeigt (Lernmodus)
let falscheLaender = new Set();  // Profi-Modus: alle falsch geklickten Länder bleiben rot
let tonAn = true;          // sollen die Fragen vorgelesen werden?
let warten = true;         // true = gerade keine Klicks annehmen
let menueGebiet = 'Welt';  // im Menü gewähltes Gebiet (gestartet wird mit "Los")
let quizAktiv = false;     // läuft gerade ein Quiz? (dann fragt der 🏠-Knopf nach)
let nochmalFunktion = null;// startet das letzte Spiel noch einmal
let falscheListe = [];     // Länder, die in diesem Spiel nicht ganz richtig waren
let uebungsSpiel = false;  // "Fehler üben": zählt nicht für den Bestwert
let rundenStartPunkte = 0; // Punkte zu Beginn der Runde (um Fehler zu erkennen)
let rundenStartMax = 0;    // Worldle: mögliche Punkte zu Beginn der Runde
let sitzung = 0;           // zählt hoch, wenn ein Spiel abgebrochen wird → alte Zeitschaltungen verfallen

// Wie setTimeout, aber nach einem Abbruch (🏠) passiert nichts mehr
function spaeter(funktion, ms) {
  const meineSitzung = sitzung;
  return setTimeout(() => { if (meineSitzung === sitzung) funktion(); }, ms);
}


// ----- 3. Elemente der Seite, die wir verändern wollen -----
const aufgabeBox    = document.getElementById('aufgabe');
const rundeAnzeige  = document.getElementById('runde');
const punkteAnzeige = document.getElementById('punkte');
const fenster       = document.getElementById('fenster');
const fensterTitel  = document.getElementById('fenster-titel');
const fensterText   = document.getElementById('fenster-text');
const gebietKnoepfe = document.querySelectorAll('.gebiet-knopf');
const sprachKnoepfe = document.querySelectorAll('.sprach-knopf');
const modusKnoepfe  = document.querySelectorAll('.modus-knopf');
const modusInfo     = document.getElementById('modus-info');
const aufgebenKnopf = document.getElementById('aufgeben-knopf');
const seiten        = { start: document.getElementById('seite-start'), spiel: document.getElementById('seite-spiel'), ende: document.getElementById('seite-ende') };
const endeTitel     = document.getElementById('ende-titel');
const endeText      = document.getElementById('ende-text');
const endeFehler    = document.getElementById('ende-fehler');
const losKnopf      = document.getElementById('los-knopf');
const frageBox      = document.getElementById('frage-box');
const antwortenBox  = document.getElementById('antworten');
const gebietFrage   = document.getElementById('gebiet-frage');
const tonKnopf      = document.getElementById('ton-knopf');
const leiste        = document.getElementById('leiste');
const modusAuswahl  = document.getElementById('modus-auswahl');
const karte         = document.getElementById('karte');
const karteInnen    = document.getElementById('karte-innen');
const menueKnopf    = document.getElementById('menue-knopf');
const gruppenAuswahl = document.getElementById('gruppen-auswahl');
const gruppenTafel  = document.getElementById('gruppen-tafel');
const gebietAuswahl = document.getElementById('gebiet-auswahl');


// ----- 4. Den Globus bauen -----
const globus = new Globe(document.getElementById('globus'))
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
  .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
  .polygonStrokeColor(flaeche => flaeche.properties.MEER ? 'rgba(120, 200, 255, 0.35)' : 'rgba(255, 255, 255, 0.6)')
  .polygonsTransitionDuration(0)   // keine Übergangs-Animation = weniger Rechenarbeit
  .onPolygonHover(land => {
    if (!istKlickSpiel()) return;   // nur bei Klick-Spielen leuchten Länder unter der Maus auf
    // Nur Länder aus dem gewählten Gebiet leuchten auf
    let neuesLand = (warten || !imGebiet(land)) ? null : land;
    if (istMeerSpiel() && neuesLand && !neuesLand.properties.MEER) neuesLand = null;   // bei Meeren nur Meere
    if (spiel === 'regionen' && neuesLand && (!rAktiv || !neuesLand.properties.REGION || !rKlickErlaubt())) neuesLand = null;
    if (neuesLand === landUnterMaus) return;   // nichts geändert → nichts tun (spart Rechenarbeit)
    landUnterMaus = neuesLand;
    globus.polygonCapColor(farbeFuerLand);     // beim Drüberfahren NUR die Farbe ändern
  })
  .onPolygonClick(landAngeklickt)
  // Punkte (für die Hauptstadt): gelbe Säule an der Stelle der Stadt
  .pointColor(punkt => punkt.farbe || FARBE_STADT)
  .onPointClick(punkt => {
    // Entdecken: Klick auf den Punkt eines sehr kleinen Landes
    if (spiel === 'entdecken' && punkt.land) landEntdeckt(punkt.land);
    if (spiel === 'gruppen' && punkt.land) gruppenLandGewaehlt(punkt.land);
    if (spiel === 'regionen' && rAktiv) regionPunktGeklickt(punkt);
    if (spiel === 'worldle') wlPunktGeklickt(punkt);
  })
  .pointAltitude(punkt => punkt.radius ? 0.015 : 0.06)
  .pointRadius(punkt => punkt.radius || 0.35);

globusNeuFaerben();
globus.controls().autoRotate = true;

// Schärfe begrenzen: sieht fast gleich aus, läuft aber deutlich flüssiger
// Schärfe: am Handy/Tablet etwas schärfer (1,5), am Computer 1 (schont den Rechner)
const istTouchGeraet = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
globus.renderer().setPixelRatio(Math.min(window.devicePixelRatio, istTouchGeraet ? 1.5 : 1));
globus.controls().autoRotateSpeed = 0.5;

// Globus immer so groß wie das Browserfenster machen
function globusGroesseAnpassen() {
  globus.width(window.innerWidth).height(window.innerHeight);
}
globusGroesseAnpassen();                                   // einmal beim Start
window.addEventListener('resize', globusGroesseAnpassen);  // und wenn sich das Fenster ändert

// Die Aufgabe oben immer direkt unter die Leisten setzen (Mehrspieler-Leiste ist z. B. höher)
function aufgabePlatzieren() {
  let unten = 0;
  ['leiste', 'mp-leiste', 'menue-knopf'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getClientRects().length > 0) unten = Math.max(unten, el.getBoundingClientRect().bottom);
  });
  aufgabeBox.style.top = Math.round((unten || 60) + 10) + 'px';
}
if (window.ResizeObserver) {
  const beobachter = new ResizeObserver(aufgabePlatzieren);
  ['leiste', 'mp-leiste', 'menue-knopf'].forEach(id => beobachter.observe(document.getElementById(id)));
}
window.addEventListener('resize', aufgabePlatzieren);

// Bildschirm-Tastatur am Handy: Eingabefeld darüber schieben
if (window.visualViewport) {
  const tastaturAnpassen = () => {
    const vv = window.visualViewport;
    const hoehe = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty('--tastatur', Math.round(hoehe) + 'px');
  };
  window.visualViewport.addEventListener('resize', tastaturAnpassen);
  window.visualViewport.addEventListener('scroll', tastaturAnpassen);
}


// ----- 5. Daten laden -----

// Hauptstädte (Namen in 4 Sprachen + Position), sortiert nach Ländercode, z. B. "DEU"
fetch('hauptstaedte.json')
  .then(antwort => antwort.json())
  .then(daten => { hauptstaedte = daten; });

// Länder-Infos für die Karteikarten
fetch('laenderinfo.json')
  .then(antwort => antwort.json())
  .then(daten => { laenderInfo = daten; });

// Meeresflächen (für "Meere & Ozeane")
fetch('meere.geojson')
  .then(antwort => antwort.json())
  .then(daten => { alleMeere = daten.features; });

// Länder
fetch('laender.geojson')
  .then(antwort => antwort.json())
  .then(daten => {
    alleLaender = daten.features;
    globus.polygonsData(alleLaender);
    startfensterTexte();   // Ladeanzeige weg, "Los" freigeben, Länderauswahl bauen
  });


// ----- 6. Hilfs-Funktionen -----

// Kurzform: t() gibt alle Texte der gewählten Sprache zurück
function t() {
  return TEXTE[sprache];
}

// Gibt den Namen eines Landes in der gewählten Sprache zurück
// (in den Daten heißen die Felder NAME_DE, NAME_EN, NAME_FR, NAME_AR)
function landName(land) {
  return land.properties['NAME_' + sprache.toUpperCase()] || land.properties.NAME;
}

// Gehört dieses Land zum gewählten Gebiet?
function imGebiet(land) {
  if (!land) return false;   // kein Land (z. B. Maus über dem Meer) → nein
  if (spiel === 'entdecken' || spiel === 'gruppen' || spiel === 'regionen' || istMeerSpiel()) return true;   // hier ist alles anklickbar
  return gebiet === 'Welt' || land.properties.CONTINENT === gebiet;
}

// Entscheidet, welche Farbe ein Land gerade hat
function farbeFuerLand(land) {
  if (spiel === 'worldle' && wlSchritt !== 'name') return wlFarbe(land);   // Worldle: Land, Nachbarn
  // Entdecken: Meere leicht blau, angetipptes Meer hell
  if (spiel === 'entdecken' && land.properties.MEER) {
    if (entdecktesMeer && entdecktesMeer.teile.includes(land.properties.TEIL)) return FARBE_MEER_AN;
    if (land === landUnterMaus) return FARBE_MEER_MAUS;
    return FARBE_MEER;
  }
  if (spiel === 'regionen' && rAktiv) return regionFarbe(land);   // Bundesländer & Regionen
  // Finde das Meer: richtig grün, falsch rot, Maus gelb, sonst leicht blau
  if (spiel === 'meereFinden') {
    if (!land.properties.MEER) return FARBE_NORMAL;
    const teil = land.properties.TEIL;
    if (meerRichtig && meerRichtig.teile.includes(teil)) return FARBE_RICHTIG;
    if (meerFalsch && meerFalsch.teile.includes(teil))   return FARBE_FALSCH;
    if (falscheMeere.has(land.properties.MEER))          return FARBE_FALSCH;
    if (land === landUnterMaus) return FARBE_MEER_MAUS;
    return FARBE_MEER;
  }
  // Meere & Ozeane: Meere blau (ausgewählt hell), Länder neutral
  if (spiel === 'meere') {
    if (!land.properties.MEER) return FARBE_NORMAL;
    if (aktivesMeer && aktivesMeer.teile.includes(land.properties.TEIL)) return FARBE_MEER_AN;
    if (land === landUnterMaus) return FARBE_MEER_MAUS;
    return FARBE_MEER;
  }
  // Regionen & Gruppen: Mitglieder lila, ausgewähltes Land blau, Rest dunkel
  if (spiel === 'gruppen' && aktiveGruppe) {
    if (land === gesuchtesLand) return FARBE_FRAGE;
    if (land === landUnterMaus) return FARBE_MAUS;
    return gruppenSet.has(land.properties.ADM0_A3) ? FARBE_GRUPPE : FARBE_INAKTIV;
  }
  if (land === richtigesLand) return FARBE_RICHTIG;
  if (land === falschesLand)  return FARBE_FALSCH;
  if (falscheLaender.has(land)) return FARBE_FALSCH;
  if (zeigtLandBlau() && land === gesuchtesLand) return FARBE_FRAGE;
  if (land === landUnterMaus) return FARBE_MAUS;
  if (!imGebiet(land))        return FARBE_INAKTIV;
  return FARBE_NORMAL;
}

// Sagt dem Globus: "Färbe alle Länder neu"
// (Anheben nur bei richtig/falsch – das Anheben ist für den Computer viel Arbeit)
function globusNeuFaerben() {
  if (spiel === 'regionen' && rAktiv) { regionenNeuFaerben(); return; }
  if (istMeerSpiel()) {   // Meere liegen knapp unter den Ländern, damit die Küsten sichtbar bleiben
    globus.polygonCapColor(farbeFuerLand).polygonAltitude(f => f.properties.MEER ? 0.005 : 0.01);
    return;
  }
  globus
    .polygonCapColor(farbeFuerLand)
    .polygonAltitude(land => land.properties.MEER ? 0.005 :   // Meere knapp unter den Ländern
      (land === richtigesLand || land === falschesLand || falscheLaender.has(land) ||
       (zeigtLandBlau() && land === gesuchtesLand)) ? 0.03 :
      (spiel === 'gruppen' && gruppenSet.has(land.properties.ADM0_A3)) ? 0.02 : 0.01
    );
}

// Mischt eine Liste zufällig (wie Karten mischen)
function mischen(liste) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

// Dreht den Globus sanft zu einem Land
function fliegeZu(land, abstand = 1.8) {
  if (land.properties.KLEIN) abstand = Math.min(abstand, 0.7);   // winzige Länder: näher heranfliegen
  globus.pointOfView(
    { lat: land.properties.LABEL_Y, lng: land.properties.LABEL_X, altitude: abstand },
    1000  // Dauer in Millisekunden (1000 = 1 Sekunde)
  );
}

// Wird bei diesem Spiel mit Antwort-Knöpfen gespielt? (sonst: Klick auf den Globus)
function istAntwortSpiel() {
  return spiel === 'erkennen' || spiel === 'flaggeMC' || spiel === 'hauptstadt' || spiel === 'formMC';
}

// Darf dieses Land im aktuellen Spiel abgefragt werden?
// Sehr kleine Länder (z. B. Monaco, Vatikan) kommen nicht bei Spielen vor,
// in denen man sie auf dem Globus anklicken müsste – sie wären zu winzig.
function istAbfragbar(land) {
  if (!land.properties.SPIEL) return false;
  // auch bei Form-Spielen: die Umrisse winziger Länder kann man nicht erkennen
  if (land.properties.KLEIN && (istKlickSpiel() || spiel === 'flaggeKarte' || spiel === 'formMC' || spiel === 'worldle')) return false;
  return true;
}

// Wird bei diesem Spiel durch Klick auf den Globus geantwortet?
function istKlickSpiel() {
  return spiel === 'finden' || spiel === 'flagge' || spiel === 'entdecken' || spiel === 'gruppen' ||
    spiel === 'regionen' || istMeerSpiel() || (spiel === 'flaggeKarte' && fkSchritt === 'karte');
}

// Geht es in diesem Spiel um Meere? (Lernen oder Quiz)
function istMeerSpiel() {
  return spiel === 'meere' || spiel === 'meereFinden';
}

// Wird bei diesem Spiel das gefragte Land blau auf dem Globus gezeigt?
function zeigtLandBlau() {
  return spiel === 'erkennen' || spiel === 'hauptstadt' || spiel === 'entdecken' ||
    (spiel === 'karten' && karteUmgedreht);
}

// Hauptstadt eines Landes (oder undefined, wenn keine gespeichert ist)
function hauptstadtVon(land) {
  return hauptstaedte[land.properties.ADM0_A3];
}

// Name der Hauptstadt in der gewählten Sprache
function hauptstadtName(land) {
  return hauptstadtVon(land)[sprache];
}

// Was steht auf einem Antwort-Knopf? Beim Hauptstädte-Quiz die Stadt, sonst das Land
function antwortName(land) {
  return spiel === 'hauptstadt' ? hauptstadtName(land) : landName(land);
}

// Sehr kleine Länder sieht man auf dem Globus kaum → zusätzlich ein runder Punkt
// laender = Liste der Länder, farbe = Farbe der Punkte, klick = was beim Antippen passiert (oder nichts)
function kleineLaenderMarken(laender, farbe, klick) {
  globus
    .htmlLat(land => land.properties.LABEL_Y)
    .htmlLng(land => land.properties.LABEL_X)
    .htmlAltitude(0.012)
    .htmlElement(land => {
      const punkt = document.createElement('div');
      punkt.className = 'klein-punkt' + (klick ? ' klickbar' : '') + (land === gesuchtesLand ? ' aktiv' : '');
      punkt.style.setProperty('--farbe', farbe);
      punkt.land = land;
      const name = document.createElement('span');
      name.className = 'kp-name';
      name.textContent = landName(land);
      punkt.appendChild(name);
      if (klick) punkt.addEventListener('click', ereignis => { ereignis.stopPropagation(); klick(land); });
      return punkt;
    })
    .htmlElementsData(laender);   // Daten erst NACH den Einstellungen übergeben
}

// Den angetippten Punkt gelb machen und seinen Namen zeigen
function kleineMarkenAktualisieren() {
  document.querySelectorAll('.klein-punkt').forEach(el => el.classList.toggle('aktiv', el.land === gesuchtesLand));
}

// Quiz: das gesuchte Land ist sehr klein → blauen Punkt zeigen (ohne Namen)
function kleinesLandMarke(land) {
  if (land && land.properties.KLEIN) kleineLaenderMarken([land], FARBE_FRAGE, null);
}

// Zeigt die Hauptstadt als gelben Punkt auf dem Globus
function hauptstadtZeigen() {
  if (spiel !== 'hauptstadt') return;
  const stadt = hauptstadtVon(gesuchtesLand);
  globus.pointsData([{ lat: stadt.lat, lng: stadt.lng }]);
  kleinesLandMarke(gesuchtesLand);
}

// Pfad zum Flaggen-Bild eines Landes, z. B. "flaggen/de.svg"
// (ISO_A2_EH ist der 2-Buchstaben-Ländercode, z. B. DE für Deutschland)
function flaggenBild(land) {
  return 'flaggen/' + land.properties.ISO_A2_EH.toLowerCase() + '.svg';
}

// Der Aufgaben-Text oben (je nach Spiel)
function aufgabeText() {
  if (spiel === 'flaggeKarte') {   // Schritt 1: Name schreiben, Schritt 2: auf der Karte finden
    if (fkSchritt === 'name') {
      return '<img class="flagge" src="' + flaggenBild(gesuchtesLand) + '"><br>' + t().frageLandName;
    }
    return '<img class="flagge klein" src="' + flaggenBild(gesuchtesLand) + '"> ' + t().frageWoLiegt(landName(gesuchtesLand));
  }
  if (spiel === 'worldle') return wlAufgabeText();
  if (spiel === 'formMC') return formBild(gesuchtesLand) + t().frageForm;
  if (spiel === 'erkennen') return t().frageErkennen;
  if (spiel === 'hauptstadt') return t().frageHauptstadt(landName(gesuchtesLand));
  if (spiel === 'flagge' || spiel === 'flaggeMC') {
    return '<img class="flagge" src="' + flaggenBild(gesuchtesLand) + '"><br>' + t().frageFlagge;
  }
  return t().finde + ' <b>' + landName(gesuchtesLand) + '</b>';
}

// Aktualisiert die Anzeigen oben
// Wie viele Fragen hat ein Spiel? Alleine 10, im Mehrspieler-Modus gleich viele pro Spieler
function rundenZiel(poolGroesse) {
  if (mpAktiv()) return mpRunden(poolGroesse);
  return spiel === 'worldle' ? 5 : ANZAHL_RUNDEN;   // Worldle hat 4 Schritte pro Land → 5 Länder
}

function anzeigenAktualisieren() {
  if (mpLaeuft()) { mpLeisteZeigen(); return; }   // Mehrspieler: eigene Anzeige
  if (spielLaender.length === 0) {   // noch kein Spiel gestartet → leer lassen
    rundeAnzeige.textContent = '';
    punkteAnzeige.textContent = '';
    return;
  }
  rundeAnzeige.textContent = t().runde(rundenNummer, spielLaender.length);
  punkteAnzeige.textContent = t().punkte(punkte);
  if (modus === 'profi') {
    punkteAnzeige.textContent += '  ·  ' + t().fehler(fehler);
  }
}


// ----- Vorlesen (Ton) -----

// Macht aus HTML reinen Text, z. B. "Finde: <b>Peru</b>" → "Finde: Peru"
function ohneHtml(html) {
  const box = document.createElement('div');
  box.innerHTML = html;
  return box.textContent;
}

// Liest einen Text in der gewählten Sprache vor (nur wenn der Ton an ist)
function vorlesen(text) {
  if (!tonAn || !('speechSynthesis' in window)) return;

  speechSynthesis.cancel();   // falls gerade noch etwas gesprochen wird: abbrechen
  const sprechen = new SpeechSynthesisUtterance(text);
  sprechen.lang = STIMMEN_SPRACHE[sprache];
  sprechen.rate = 0.95;       // etwas langsamer als normal

  // Passende Stimme suchen (z. B. eine deutsche Stimme für Deutsch)
  const stimme = speechSynthesis.getVoices().find(v => v.lang.startsWith(sprache));
  if (stimme) sprechen.voice = stimme;

  speechSynthesis.speak(sprechen);
}

// ----- Klänge für richtig (grün) und falsch (rot) -----
// Die Töne werden direkt im Browser erzeugt – dafür braucht man keine Ton-Dateien.

let audioKontext = null;   // der "Lautsprecher" des Browsers (wird beim ersten Klang erstellt)

// Spielt mehrere Töne nacheinander.
// noten = Liste mit { frequenz (Tonhöhe in Hertz), start (Sekunden), dauer (Sekunden) }
function klangSpielen(noten, wellenform, lautstaerke) {
  if (!tonAn) return;
  try {
    if (!audioKontext) audioKontext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioKontext.state === 'suspended') audioKontext.resume();
    const jetzt = audioKontext.currentTime;

    noten.forEach(note => {
      const ton = audioKontext.createOscillator();   // erzeugt den Ton
      const regler = audioKontext.createGain();      // regelt die Lautstärke
      ton.type = wellenform;                         // 'sine' = weich, 'triangle' = etwas runder
      ton.frequency.value = note.frequenz;

      // Sanft einblenden und langsam ausklingen lassen (klingt angenehm, nicht hart)
      const anfang = jetzt + note.start;
      regler.gain.setValueAtTime(0.0001, anfang);
      regler.gain.exponentialRampToValueAtTime(lautstaerke, anfang + 0.02);
      regler.gain.exponentialRampToValueAtTime(0.0001, anfang + note.dauer);

      ton.connect(regler);
      regler.connect(audioKontext.destination);
      ton.start(anfang);
      ton.stop(anfang + note.dauer + 0.05);
    });
  } catch (e) {
    // Falls der Browser keine Klänge kann: einfach still bleiben
  }
}

// ✅ Richtig: drei helle, aufsteigende Töne (C – E – G), wie ein kleines Glockenspiel
function richtigKlang() {
  klangSpielen([
    { frequenz: 523.25, start: 0.00, dauer: 0.45 },
    { frequenz: 659.25, start: 0.09, dauer: 0.45 },
    { frequenz: 783.99, start: 0.18, dauer: 0.60 }
  ], 'sine', 0.18);
}

// ❌ Falsch: zwei weiche, absteigende Töne – freundlich, nicht schrill
function falschKlang() {
  klangSpielen([
    { frequenz: 329.63, start: 0.00, dauer: 0.30 },
    { frequenz: 261.63, start: 0.14, dauer: 0.45 }
  ], 'triangle', 0.15);
}

// Ton an/aus umschalten
function tonUmschalten() {
  tonAn = !tonAn;
  try { localStorage.setItem('geo-ton', tonAn ? 'an' : 'aus'); } catch (e) {}
  if (!tonAn && 'speechSynthesis' in window) speechSynthesis.cancel();
  tonKnopfAnzeigen();
  if (tonAn && !warten && gesuchtesLand) vorlesen(ohneHtml(aufgabeText()));   // aktuelle Frage gleich vorlesen
}

// Symbol und Hinweis-Text des Ton-Knopfs
function tonKnopfAnzeigen() {
  [tonKnopf, document.getElementById('ton-menue')].forEach(knopf => {
    knopf.textContent = tonAn ? '🔊' : '🔇';
    knopf.title = tonAn ? t().tonAn : t().tonAus;
  });
}


// ----- 7. Der Spielablauf -----

// Wird beim Klick auf einen Gebiet-Knopf ausgeführt
function spielStarten(gewaehltesGebiet, uebungsListe) {
  if (alleLaender.length === 0) return;   // Daten noch nicht geladen
  sitzung++;
  if (spiel === 'hauptstadt' && Object.keys(hauptstaedte).length === 0) return;

  gebiet = gewaehltesGebiet;

  // Entdecken und Karteikarten haben einen eigenen Ablauf
  if (spiel === 'entdecken') {
    entdeckenStarten();
    return;
  }
  if (spiel === 'karten') {
    kartenStarten();
    return;
  }

  // Nur Länder aus dem Gebiet, ohne die Ausnahmen
  // Beim Hauptstädte-Quiz nur Länder, deren Hauptstadt wir kennen
  const abfragbar = alleLaender.filter(land =>
    imGebiet(land) && istAbfragbar(land) &&
    (spiel !== 'hauptstadt' || hauptstadtVon(land))
  );
  mpSpielBeginnt(() => spielStarten(gewaehltesGebiet));
  uebungsSpiel = !!uebungsListe;
  if (uebungsListe) spielLaender = mischen(uebungsListe);   // "Fehler üben": nur die falschen Länder
  else spielLaender = mischen(abfragbar).slice(0, rundenZiel(abfragbar.length));
  nochmalFunktion = () => spielStarten(gewaehltesGebiet, uebungsListe);
  quizAktiv = true;
  falscheListe = [];
  wlMax = 0;

  rundenNummer = 0;
  punkte = 0;
  fehler = 0;
  aufgegeben = 0;
  fenster.classList.add('versteckt');
  globus.controls().autoRotate = false;
  if (!zeigtLandBlau()) {
    globus.pointOfView(GEBIET_ANSICHT[gebiet], 1500);   // zum Kontinent drehen
  }

  naechsteRunde();
}

// Startet die nächste Runde (oder beendet das Spiel)
function naechsteRunde() {
  rundeAuswerten();   // war die letzte Runde ganz richtig? Sonst für "Fehler üben" merken
  mpZugBeendet();
  richtigesLand = null;
  falschesLand = null;
  falscheLaender.clear();   // rote Länder der letzten Runde wieder normal
  globus.pointsData([]);    // Hauptstadt-Punkt der letzten Runde entfernen
  globus.htmlElementsData([]);
  globusNeuFaerben();
  aufgabeBox.className = '';

  if (rundenNummer >= spielLaender.length) {
    spielBeenden();
    return;
  }

  // Finde das Land: nach einer falschen Antwort zurück zur Kontinent-Ansicht
  if (!zeigtLandBlau() && rundenNummer > 0 && gebiet !== 'Welt') {
    globus.pointOfView(GEBIET_ANSICHT[gebiet], 1000);
  }

  schonFalsch = false;
  gesuchtesLand = spielLaender[rundenNummer];
  rundenNummer++;
  rundenStartPunkte = punkte;
  rundenStartMax = wlMax;
  anzeigenAktualisieren();
  if (spiel === 'flaggeKarte') fkNameStarten();   // Schritt 1: Eingabefeld zeigen
  if (spiel === 'worldle') wlRundeStarten();       // Worldle: mit der Form beginnen

  // Welches Land ist das? / Hauptstädte: Land blau zeigen und hinfliegen
  if (zeigtLandBlau()) {
    globusNeuFaerben();
    kleinesLandMarke(gesuchtesLand);
    fliegeZu(gesuchtesLand, spiel === 'hauptstadt' ? 1.6 : 1.4);
  }
  // Spiele mit Antwort-Knöpfen: 4 Antworten anbieten
  if (istAntwortSpiel()) {
    antwortenZeigen();
  }

  aufgabeBox.innerHTML = aufgabeText();
  vorlesen(ohneHtml(aufgabeText()));   // Frage vorlesen
  warten = false;
  aufgebenKnopfZeigen(true);
  mpZugStart();   // Mehrspieler: nächster Spieler ist dran
}

// Nach jeder Runde: nicht alle Punkte geholt? → Land für "Fehler üben" merken
function rundeAuswerten() {
  if (!gesuchtesLand || rundenNummer === 0 || mpLaeuft()) return;
  const moeglich = spiel === 'worldle' ? wlMax - rundenStartMax : (spiel === 'flaggeKarte' ? 2 : 1);
  if (punkte - rundenStartPunkte < moeglich && !falscheListe.includes(gesuchtesLand)) falscheListe.push(gesuchtesLand);
}

// Wird ausgeführt, wenn ein Land angeklickt wird
function landAngeklickt(land) {
  if (spiel === 'entdecken') {   // Entdecken: keine Frage, nur Namen zeigen und vorlesen
    landEntdeckt(land);
    return;
  }
  if (spiel === 'gruppen') {     // Regionen & Gruppen: zeigen, ob das Land dazugehört
    gruppenLandGewaehlt(land);
    return;
  }
  if (spiel === 'regionen') {    // Bundesländer & Regionen: eigene Regeln
    if (rAktiv) regionFlaecheGeklickt(land);
    return;
  }
  if (spiel === 'meereFinden') {  // Finde das Meer: eigene Spielregeln
    meerGeklickt(land);
    return;
  }
  if (spiel === 'meere') {       // Meere & Ozeane: nur Meeresflächen zählen
    if (land && land.properties.MEER) meerWaehlen(MEERE.find(m => m.id === land.properties.MEER));
    return;
  }
  if (!istKlickSpiel()) return;   // nur bei Klick-Spielen zählen Klicks auf den Globus
  if (warten) return;            // gerade keine Klicks erlaubt
  if (!imGebiet(land)) return;   // Länder außerhalb des Gebiets zählen nicht
  if (falscheLaender.has(land)) return;   // schon rot → zählt nicht nochmal als Fehler
  warten = true;
  landUnterMaus = null;
  aufgebenKnopfZeigen(false);

  if (land === gesuchtesLand) {
    // ✅ RICHTIG
    // Punkt nur, wenn es beim ersten Versuch geklappt hat
    if (!schonFalsch) punkte++;
    richtigesLand = land;
    aufgabeBox.className = 'richtig';
    richtigKlang();
    aufgabeBox.innerHTML = '✅ ' + t().richtig + ' <b>' + landName(land) + '</b>';
    anzeigenAktualisieren();
    globusNeuFaerben();
    spaeter(naechsteRunde, 1500);
  } else if (modus === 'profi') {
    // ❌ FALSCH im Profi-Modus: keine Hilfe, nochmal versuchen!
    fehler++;
    schonFalsch = true;
    falscheLaender.add(land);   // bleibt rot, bis das richtige Land gefunden ist
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().falschNochmal +
      '<br>' + t().finde + ' <b>' + landName(gesuchtesLand) + '</b>';
    anzeigenAktualisieren();
    globusNeuFaerben();

    // Nach 1 Sekunde: Meldung weg, gleiche Aufgabe nochmal (rote Länder bleiben rot)
    spaeter(() => {
      aufgabeBox.className = '';
      aufgabeBox.innerHTML = aufgabeText();
      globusNeuFaerben();
      warten = false;
      aufgebenKnopfZeigen(true);
    }, 1000);
  } else {
    // ❌ FALSCH im Lernmodus: richtiges Land zeigen
    falschesLand = land;
    richtigesLand = gesuchtesLand;
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().dasWar + ' ' + landName(land) +
      '.<br>' + t().gesuchtWar + ' <b>' + landName(gesuchtesLand) + '</b>';
    globusNeuFaerben();
    fliegeZu(gesuchtesLand);
    spaeter(naechsteRunde, 3000);
  }
}

// Zeigt das Ergebnis am Ende
function spielBeenden() {
  warten = true;
  aufgebenKnopfZeigen(false);
  antwortenBox.classList.add('versteckt');
  namensBox.classList.add('versteckt');
  globus.pointsData([]);
  globus.htmlElementsData([]);
  gesuchtesLand = null;
  if (spiel === 'regionen') regionenAufraeumen();   // Regionen wieder entfernen
  if (spiel === 'worldle') wlAufraeumen();          // Schilder und Punkte entfernen
  if (spiel === 'meereFinden') {   // Meeresflächen wieder entfernen
    globus.polygonsData(alleLaender);
    zielMeer = null; meerRichtig = null; meerFalsch = null; falscheMeere.clear();
  }
  aufgabeBox.textContent = t().vorbei;
  quizAktiv = false;

  // Höchstpunktzahl: bei "Flagge → Name → Karte" 2 Punkte pro Land
  // bei Worldle: so viele Punkte, wie es Schritte gab
  const maxPunkte = spiel === 'worldle' ? Math.max(1, wlMax) : spielLaender.length * (spiel === 'flaggeKarte' ? 2 : 1);
  const anteil = punkte / maxPunkte;   // z. B. 7 von 10 = 0.7
  let lob = t().lob[0];
  if (anteil >= 0.5) lob = t().lob[1];
  if (anteil >= 0.8) lob = t().lob[2];

  // Bestwert speichern (nur alleine, nicht beim Fehler-Üben)
  const rekord = !mpLaeuft() && !uebungsSpiel && bestwertEintragen(punkte, maxPunkte);

  endeTitel.textContent = t().ergebnis(punkte, maxPunkte);
  let text = (rekord ? '<p class="rekord">' + t().neuerRekord + '</p>' : '') + '<p>' + lob + '</p>';
  if (modus === 'profi') {
    text += '<p class="klein-info">' + t().fehlerGesamt(fehler) + '<br>' + t().aufgegebenGesamt(aufgegeben) + '</p>';
  }
  endeText.innerHTML = text;
  endeFehlerZeigen();
  if (mpLaeuft()) mpErgebnis();   // Mehrspieler: Siegertreppchen statt Einzel-Ergebnis
  seiteZeigen('ende');
  if (rekord) richtigKlang();

  gebiet = 'Welt';               // Abdunkeln aufheben
  globusNeuFaerben();
  globus.controls().autoRotate = true;
}


// ----- Flagge → Name → Karte -----

const namensBox = document.getElementById('namens-box');
const namensEingabe = document.getElementById('namens-eingabe');
const namensVorschlaege = document.getElementById('namens-vorschlaege');

// Text vergleichbar machen: klein, ohne Akzente/Umlaute/Leerzeichen; Arabisch ohne Vokalzeichen
function vergleichsText(text) {
  return (text || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')                // é → e, ö → o
    .replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u')      // Oesterreich = Österreich
    .replace(/ß/g, 'ss')
    .replace(/[\u064B-\u065F\u0670]/g, '')                            // arabische Vokalzeichen
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')       // arabische Schreibvarianten
    .replace(/^ال/, '')                                                // "الكويت" = "كويت"
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '');                           // Leerzeichen, Bindestriche …
}

// Alle Namen, unter denen ein Land als richtig gilt (alle 4 Sprachen)
function landNamenVarianten(land) {
  const p = land.properties;
  return [p.NAME, p.NAME_DE, p.NAME_EN, p.NAME_FR, p.NAME_AR].filter(Boolean).map(vergleichsText);
}

// Eingabefeld zeigen (leer), mit passendem Hinweistext
// unten = true: Feld unten am Bildschirm, damit man den Globus in der Mitte sieht
function eingabeZeigen(platzhalter, unten) {
  namensEingabe.value = '';
  namensEingabe.placeholder = platzhalter;
  document.getElementById('namens-knopf').textContent = t().antwortenKnopf;
  namensVorschlaege.innerHTML = '';
  namensBox.classList.toggle('unten', !!unten);
  namensBox.classList.remove('versteckt');
  spaeter(() => namensEingabe.focus(), 50);
}

// Schritt 1 beginnt: Eingabefeld zeigen
function fkNameStarten() {
  fkSchritt = 'name';
  eingabeZeigen(t().eingabePlatzhalter);
}

// Welche Vorschläge passen? Normalerweise Länder, bei Worldle-Hauptstädten Städte
function eingabeKandidaten() {
  if (spiel === 'worldle' && wlSchritt === 'hauptstadt') return wlHauptstadtKandidaten();
  return alleLaender.filter(l => l.properties.SPIEL).map(l => ({ text: landName(l) }));
}

// Antwort abschicken (Knopf, Enter oder Vorschlag)
function eingabeAbschicken() {
  if (spiel === 'worldle') wlEingabe();
  else fkNamePruefen();
}

// Vorschläge beim Tippen (Länder in der gewählten Sprache)
let vorschlagListe = [];
let vorschlagMarkiert = -1;
function fkVorschlaegeZeigen() {
  const eingabe = vergleichsText(namensEingabe.value);
  namensVorschlaege.innerHTML = '';
  vorschlagMarkiert = -1;
  if (eingabe.length < 1) { vorschlagListe = []; return; }
  vorschlagListe = eingabeKandidaten()
    .filter(k => vergleichsText(k.text).includes(eingabe))
    .sort((a, b) => vergleichsText(a.text).indexOf(eingabe) - vergleichsText(b.text).indexOf(eingabe) ||
                    a.text.localeCompare(b.text, sprache))
    .slice(0, 6);
  vorschlagListe.forEach(k => {
    const zeile = document.createElement('div');
    zeile.className = 'vorschlag';
    zeile.textContent = k.text;
    zeile.addEventListener('mousedown', ereignis => {   // mousedown: vor dem Verlassen des Eingabefelds
      ereignis.preventDefault();
      namensEingabe.value = k.text;
      eingabeAbschicken();
    });
    namensVorschlaege.appendChild(zeile);
  });
}

// Name prüfen (Knopf "Antworten", Enter-Taste oder Vorschlag angetippt)
function fkNamePruefen() {
  if (warten || fkSchritt !== 'name') return;
  const eingabe = vergleichsText(namensEingabe.value);
  if (!eingabe) return;
  namensVorschlaege.innerHTML = '';
  const richtig = landNamenVarianten(gesuchtesLand).includes(eingabe);

  if (richtig) {
    warten = true;
    aufgebenKnopfZeigen(false);
    if (!schonFalsch) punkte++;
    aufgabeBox.className = 'richtig';
    richtigKlang();
    aufgabeBox.innerHTML = '✅ ' + t().richtig + ' <b>' + landName(gesuchtesLand) + '</b>';
    anzeigenAktualisieren();
    spaeter(fkKarteStarten, 1300);
  } else if (modus === 'profi') {
    fehler++;
    schonFalsch = true;
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().falschNochmal + '<br>' + aufgabeText();
    anzeigenAktualisieren();
    namensEingabe.value = '';
    spaeter(() => { if (fkSchritt === 'name' && !warten) { aufgabeBox.className = ''; aufgabeBox.innerHTML = aufgabeText(); } }, 1500);
  } else {
    warten = true;
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().richtigIst + ' <b>' + landName(gesuchtesLand) + '</b>';
    spaeter(fkKarteStarten, 2500);
  }
}

// "Zeig es mir" in Schritt 1: Namen verraten, weiter zur Karte
function fkNameAufgeben() {
  warten = true;
  aufgebenKnopfZeigen(false);
  aufgegeben++;
  aufgabeBox.className = 'falsch';
  aufgabeBox.innerHTML = t().aufgegebenMeldung + '<br>' + t().richtigIst + ' <b>' + landName(gesuchtesLand) + '</b>';
  spaeter(fkKarteStarten, 2500);
}

// Schritt 2 beginnt: Land auf der Karte antippen
function fkKarteStarten() {
  fkSchritt = 'karte';
  schonFalsch = false;
  namensBox.classList.add('versteckt');
  namensEingabe.blur();
  aufgabeBox.className = '';
  aufgabeBox.innerHTML = aufgabeText();
  vorlesen(ohneHtml(aufgabeText()));
  warten = false;
  aufgebenKnopfZeigen(true);
  if (typeof mpLaeuft === 'function' && mpLaeuft() && mp.zeitlimit) mpTimerStart();   // Zeitlimit gilt pro Schritt
}

namensEingabe.addEventListener('input', fkVorschlaegeZeigen);
namensEingabe.addEventListener('keydown', taste => {
  const zeilen = [...namensVorschlaege.querySelectorAll('.vorschlag')];
  if (taste.key === 'ArrowDown' || taste.key === 'ArrowUp') {   // mit Pfeiltasten durch die Vorschläge
    taste.preventDefault();
    if (!zeilen.length) return;
    vorschlagMarkiert = (vorschlagMarkiert + (taste.key === 'ArrowDown' ? 1 : -1) + zeilen.length) % zeilen.length;
    zeilen.forEach((z, i) => z.classList.toggle('markiert', i === vorschlagMarkiert));
  }
  if (taste.key === 'Enter') {
    taste.preventDefault();
    if (vorschlagMarkiert >= 0 && vorschlagListe[vorschlagMarkiert]) namensEingabe.value = vorschlagListe[vorschlagMarkiert].text;
    else if (vorschlagListe.length === 1) namensEingabe.value = vorschlagListe[0].text;   // nur ein Vorschlag → den nehmen
    eingabeAbschicken();
  }
});
document.getElementById('namens-knopf').addEventListener('click', eingabeAbschicken);


// ----- Umriss eines Landes als Bild (für "Welches Land ist diese Form?" und Worldle) -----

// Baut aus den Grenzen des Landes ein SVG-Bild (Karte wie in einem Atlas, "Mercator")
function formSvg(land) {
  if (land.formSvg) return land.formSvg;   // schon einmal gebaut → wiederverwenden
  const geo = land.geometry;
  const polygone = geo.type === 'Polygon' ? [geo.coordinates] : geo.coordinates;
  const mitteLng = land.properties.LABEL_X;
  const umrechnen = ([lng, lat]) => {
    const x = ((lng - mitteLng + 540) % 360) - 180;   // um das Land herum, auch über die Datumsgrenze
    const phi = Math.max(-85, Math.min(85, lat)) * Math.PI / 180;
    return [x, -Math.log(Math.tan(Math.PI / 4 + phi / 2)) * 180 / Math.PI];
  };

  // Jede Teilfläche (z. B. Inseln) mit Größe und Lage
  const teile = polygone.map(polygon => {
    const ringe = polygon.map(ring => ring.map(umrechnen));
    const aussen = ringe[0];
    const xs = aussen.map(p => p[0]), ys = aussen.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    // echte Größe (flächentreu gerechnet): die Atlas-Karte macht Flächen nahe den Polen zu groß
    const roh = polygon[0];
    let echt = 0;
    for (let i = 0, j = roh.length - 1; i < roh.length; j = i++) {
      const xj = ((roh[j][0] - mitteLng + 540) % 360) - 180, xi = ((roh[i][0] - mitteLng + 540) % 360) - 180;
      echt += (xj + xi) * (Math.sin(roh[j][1] * Math.PI / 180) - Math.sin(roh[i][1] * Math.PI / 180));
    }
    return { ringe, flaeche: Math.abs(echt / 2), x0, x1, y0, y1, mx: (x0 + x1) / 2, my: (y0 + y1) / 2 };
  });

  // Weit entfernte kleine Inseln weglassen (z. B. Französisch-Guayana bei Frankreich)
  const haupt = teile.reduce((a, b) => (b.flaeche > a.flaeche ? b : a));
  const diagonale = Math.hypot(haupt.x1 - haupt.x0, haupt.y1 - haupt.y0);
  const behalten = teile.filter(tl => tl === haupt || tl.flaeche >= haupt.flaeche * 0.17 ||
    Math.hypot(tl.mx - haupt.mx, tl.my - haupt.my) <= diagonale * 0.7);

  const x0 = Math.min(...behalten.map(tl => tl.x0)), x1 = Math.max(...behalten.map(tl => tl.x1));
  const y0 = Math.min(...behalten.map(tl => tl.y0)), y1 = Math.max(...behalten.map(tl => tl.y1));
  const massstab = 100 / Math.max(x1 - x0, y1 - y0, 0.0001);   // größte Seite = 100
  const pfad = behalten.map(tl => tl.ringe.map(ring =>
    'M' + ring.map(([x, y]) => ((x - x0) * massstab).toFixed(1) + ',' + ((y - y0) * massstab).toFixed(1)).join('L') + 'Z'
  ).join('')).join('');
  const breite = (x1 - x0) * massstab, hoehe = (y1 - y0) * massstab;
  land.formSvg = '<svg class="form" xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 ' +
    (breite + 6).toFixed(1) + ' ' + (hoehe + 6).toFixed(1) + '"><path fill-rule="evenodd" d="' + pfad + '"/></svg>';
  return land.formSvg;
}

// Umriss mit Rahmen für die Aufgabe oben
function formBild(land) {
  return '<div class="form-bild">' + formSvg(land) + '</div>';
}


// ----- Aufgeben (nur Profi-Modus) -----

// Zeigt oder versteckt den "Zeig es mir"-Knopf
function aufgebenKnopfZeigen(sichtbar) {
  aufgebenKnopf.classList.toggle('versteckt', !(sichtbar && modus === 'profi'));
}

// Wird beim Klick auf "Zeig es mir" ausgeführt
function aufgeben() {
  if (warten) return;
  if (spiel === 'meereFinden') { meerAufgeben(); return; }
  if (spiel === 'regionen') { rAufgeben(); return; }
  if (spiel === 'flaggeKarte' && fkSchritt === 'name') { fkNameAufgeben(); return; }
  if (spiel === 'worldle') { wlAufgeben(); return; }
  warten = true;
  aufgebenKnopfZeigen(false);
  aufgegeben++;
  landUnterMaus = null;

  // Richtiges Land grün zeigen und hinfliegen (kein Punkt)
  richtigesLand = gesuchtesLand;
  richtigenKnopfMarkieren();
  antwortenSperren();
  hauptstadtZeigen();
  aufgabeBox.className = 'falsch';
  aufgabeBox.innerHTML = t().aufgegebenMeldung + '<br>' +
    (istAntwortSpiel() ? t().richtigIst : t().gesuchtWar) +
    ' <b>' + antwortName(gesuchtesLand) + '</b>';
  globusNeuFaerben();
  fliegeZu(gesuchtesLand);
  spaeter(naechsteRunde, 3000);
}


// ----- Spiel "Welches Land ist das?": die 4 Antwort-Knöpfe -----

function antwortenZeigen() {
  // 3 falsche Antworten aus demselben Gebiet aussuchen
  const andere = alleLaender.filter(land =>
    imGebiet(land) && land !== gesuchtesLand && istAbfragbar(land) &&
    (spiel !== 'hauptstadt' || hauptstadtVon(land))
  );
  const auswahl = mischen([gesuchtesLand, ...mischen(andere).slice(0, 3)]);

  // Für jede Antwort einen Knopf bauen
  antwortenBox.innerHTML = '';
  auswahl.forEach(land => {
    const knopf = document.createElement('button');
    knopf.className = 'antwort-knopf';
    knopf.textContent = antwortName(land);
    knopf.land = land;   // der Knopf "merkt" sich sein Land
    knopf.addEventListener('click', () => antwortGewaehlt(knopf));
    antwortenBox.appendChild(knopf);
  });
  antwortenBox.classList.remove('versteckt');
}

// Färbt den Knopf mit der richtigen Antwort grün
function richtigenKnopfMarkieren() {
  antwortenBox.querySelectorAll('.antwort-knopf').forEach(knopf => {
    if (knopf.land === gesuchtesLand) knopf.classList.add('richtig');
  });
}

// Alle Antwort-Knöpfe sperren (nicht mehr klickbar)
function antwortenSperren() {
  antwortenBox.querySelectorAll('.antwort-knopf').forEach(knopf => knopf.disabled = true);
}

// Wird ausgeführt, wenn ein Antwort-Knopf gedrückt wird
function antwortGewaehlt(knopf) {
  if (warten || knopf.disabled) return;
  warten = true;
  aufgebenKnopfZeigen(false);

  if (knopf.land === gesuchtesLand) {
    // ✅ RICHTIG
    if (!schonFalsch) punkte++;
    knopf.classList.add('richtig');
    antwortenSperren();
    richtigesLand = gesuchtesLand;
    aufgabeBox.className = 'richtig';
    richtigKlang();
    aufgabeBox.innerHTML = '✅ ' + t().richtig + ' <b>' + antwortName(gesuchtesLand) + '</b>';
    anzeigenAktualisieren();
    globusNeuFaerben();
    hauptstadtZeigen();
    if (spiel === 'flaggeMC' || spiel === 'formMC') {   // zeigen, wo das Land liegt
      fliegeZu(gesuchtesLand);
      kleinesLandMarke(gesuchtesLand);
    }
    spaeter(naechsteRunde, (spiel === 'flaggeMC' || spiel === 'formMC') ? 2500 : 1500);
  } else if (modus === 'profi') {
    // ❌ FALSCH im Profi-Modus: Knopf bleibt rot, nochmal versuchen
    fehler++;
    schonFalsch = true;
    knopf.classList.add('falsch');
    knopf.disabled = true;
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().falschNochmal + '<br>' + aufgabeText();
    anzeigenAktualisieren();
    spaeter(() => {
      aufgabeBox.className = '';
      aufgabeBox.innerHTML = aufgabeText();
      warten = false;
      aufgebenKnopfZeigen(true);
    }, 1000);
  } else {
    // ❌ FALSCH im Lernmodus: richtige Antwort zeigen
    knopf.classList.add('falsch');
    richtigenKnopfMarkieren();
    antwortenSperren();
    richtigesLand = gesuchtesLand;
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().richtigIst + ' <b>' + antwortName(gesuchtesLand) + '</b>';
    globusNeuFaerben();
    hauptstadtZeigen();
    if (spiel === 'flaggeMC' || spiel === 'formMC') {   // zeigen, wo das Land liegt
      fliegeZu(gesuchtesLand);
      kleinesLandMarke(gesuchtesLand);
    }
    spaeter(naechsteRunde, 3000);
  }
}


// ----- Entdecken (ohne Fragen) -----

function entdeckenStarten() {
  fenster.classList.add('versteckt');
  leiste.classList.add('versteckt');
  globus.controls().autoRotate = false;
  globus.pointOfView(GEBIET_ANSICHT[gebiet], 1500);

  gesuchtesLand = null;
  entdecktesMeer = null;
  warten = false;
  aufgabeBox.className = '';
  aufgabeBox.textContent = t().entdeckenHinweis;

  // Meere und Ozeane zusätzlich auf den Globus legen (zum Antippen)
  if (alleMeere.length > 0) globus.polygonsData([...alleLaender, ...alleMeere]);

  // Sehr kleine Länder als anklickbare blaue Punkte zeigen
  const kleine = alleLaender.filter(land => land.properties.SPIEL && land.properties.KLEIN);
  kleineLaenderMarken(kleine, '#00b4ff', landEntdeckt);
  globusNeuFaerben();
}

// Ein Land wurde angetippt: blau färben, Namen (mit Flagge und Hauptstadt) zeigen und vorlesen
function landEntdeckt(land) {
  if (!land) return;

  // Ein Meer oder Ozean wurde angetippt
  if (land.properties.MEER) {
    const meer = MEERE.find(m => m.id === land.properties.MEER);
    gesuchtesLand = null;
    entdecktesMeer = meer;
    globusNeuFaerben();
    aufgabeBox.innerHTML = '<span class="entdeckt-name">🌊 ' + meer.name[sprache] + '</span>' +
      '<br><span class="entdeckt-info">' + (meer.typ === 'ozean' ? t().typOzean : t().typMeer) + '</span>';
    vorlesen(meer.name[sprache]);
    return;
  }

  gesuchtesLand = land;
  entdecktesMeer = null;
  globusNeuFaerben();
  kleineMarkenAktualisieren();   // angetippten Punkt gelb färben

  let html = '';
  if (land.properties.SPIEL) {   // Flaggen gibt es nur für eigenständige Länder
    html += '<img class="flagge" src="' + flaggenBild(land) + '"><br>';
  }
  html += '<span class="entdeckt-name">' + landName(land) + '</span>';
  const stadt = hauptstadtVon(land);
  if (stadt) {
    html += '<br><span class="entdeckt-info">🏛️ ' + t().kHauptstadt + ': ' + stadt[sprache] + '</span>';
  }
  aufgabeBox.innerHTML = html;
  vorlesen(landName(land));
}

function entdeckenBeenden() {
  zumMenue('start');
}


// ----- Regionen & Gruppen (ohne Fragen) -----

// Baut im Startfenster die Knöpfe für alle Gruppen, sortiert nach Kategorie
function gruppenAuswahlBauen() {
  gruppenAuswahl.innerHTML = '';
  ['region', 'buendnis', 'sprache', 'besonders'].forEach(kategorie => {
    const titel = document.createElement('div');
    titel.className = 'gruppen-kategorie';
    titel.textContent = t().kategorien[kategorie];
    gruppenAuswahl.appendChild(titel);

    const knoepfe = document.createElement('div');
    knoepfe.className = 'gruppen-knoepfe';
    GRUPPEN.filter(g => g.kategorie === kategorie).forEach(gruppe => {
      const knopf = document.createElement('button');
      knopf.className = 'gruppe-knopf';
      knopf.textContent = gruppe.name[sprache];
      knopf.addEventListener('click', () => gruppeStarten(gruppe));
      knoepfe.appendChild(knopf);
    });
    gruppenAuswahl.appendChild(knoepfe);
  });
}

// Findet zu einem Ländercode (z. B. "DEU") das Land aus den Kartendaten
function landMitCode(code) {
  return alleLaender.find(land => land.properties.ADM0_A3 === code);
}

// Berechnet, wohin der Globus schauen soll, damit man alle Mitglieder sieht
function gruppenAnsicht(laender) {
  const breiten = laender.map(l => l.properties.LABEL_Y);
  const laengen = laender.map(l => l.properties.LABEL_X);
  const ausdehnung = Math.max(Math.max(...breiten) - Math.min(...breiten),
                              Math.max(...laengen) - Math.min(...laengen));
  if (ausdehnung > 110) return { lat: 20, lng: 10, altitude: 2.5 };   // über die halbe Welt verteilt
  const mitte = (liste) => liste.reduce((a, b) => a + b, 0) / liste.length;
  return {
    lat: mitte(breiten),
    lng: mitte(laengen),
    altitude: Math.min(2.5, Math.max(0.8, ausdehnung / 28))
  };
}

function gruppeStarten(gruppe) {
  if (alleLaender.length === 0) return;
  aktiveGruppe = gruppe;
  gruppenSet = new Set(gruppe.laender);
  const mitglieder = gruppe.laender.map(landMitCode).filter(Boolean);

  fenster.classList.add('versteckt');
  leiste.classList.add('versteckt');
  gruppenTafel.classList.remove('versteckt');
  globus.controls().autoRotate = false;
  globus.pointOfView(gruppenAnsicht(mitglieder), 1500);

  gesuchtesLand = null;
  landUnterMaus = null;
  warten = false;
  aufgabeBox.className = '';
  aufgabeBox.textContent = t().entdeckenHinweis;

  // Info-Tafel füllen
  document.getElementById('gt-titel').textContent = gruppe.name[sprache];
  document.getElementById('gt-anzahl').textContent = t().anzahlLaender(mitglieder.length);
  document.getElementById('gt-info').textContent = gruppe.info[sprache];
  document.getElementById('gt-fakt').textContent = t().wusstest + ' ' + gruppe.fakt[sprache];
  document.getElementById('gt-dazu').textContent = t().dazu;

  // Liste der Mitglieder (alphabetisch in der gewählten Sprache) mit kleiner Flagge
  const liste = document.getElementById('gt-liste');
  liste.innerHTML = '';
  [...mitglieder].sort((a, b) => landName(a).localeCompare(landName(b), sprache)).forEach(land => {
    const knopf = document.createElement('button');
    knopf.className = 'mitglied-knopf';
    knopf.land = land;
    const flagge = document.createElement('img');
    flagge.src = flaggenBild(land);
    knopf.appendChild(flagge);
    knopf.appendChild(document.createTextNode(landName(land)));
    knopf.addEventListener('click', () => { gruppenLandGewaehlt(land); fliegeZu(land, 1.2); });
    liste.appendChild(knopf);
  });

  // Sehr kleine Mitglieder (z. B. Malta, Bahrain) als lila Punkte zeigen
  kleineLaenderMarken(mitglieder.filter(l => l.properties.KLEIN), '#b47cff', gruppenLandGewaehlt);

  globusNeuFaerben();
  vorlesen(gruppe.name[sprache] + '. ' + gruppe.info[sprache]);
}

// Ein Land wurde angetippt (auf dem Globus oder in der Liste)
function gruppenLandGewaehlt(land) {
  if (!land || !aktiveGruppe) return;
  gesuchtesLand = land;
  globusNeuFaerben();
  kleineMarkenAktualisieren();   // angetippten Punkt gelb färben

  const dabei = gruppenSet.has(land.properties.ADM0_A3);
  let html = '';
  if (land.properties.SPIEL) html += '<img class="flagge" src="' + flaggenBild(land) + '"><br>';
  html += '<span class="entdeckt-name">' + landName(land) + '</span><br>';
  html += '<span class="entdeckt-info">' + (dabei ? t().gehoertDazu : '✖ ' + t().gehoertNicht) + '</span>';
  aufgabeBox.innerHTML = html;

  // Land in der Liste hervorheben
  document.querySelectorAll('.mitglied-knopf').forEach(knopf => {
    knopf.classList.toggle('aktiv', knopf.land === land);
  });

  vorlesen(landName(land));
}

function gruppenBeenden() {
  zumMenue('start');
}


// ----- Meere & Ozeane (ohne Fragen) -----

// Baut im Startfenster die Knöpfe: erst die Ozeane, dann die Meere
function meereAuswahlBauen() {
  gruppenAuswahl.innerHTML = '';
  [['ozean', t().ozeane], ['meer', t().meereTitel]].forEach(([typ, titelText]) => {
    const titel = document.createElement('div');
    titel.className = 'gruppen-kategorie';
    titel.textContent = titelText;
    gruppenAuswahl.appendChild(titel);
    const knoepfe = document.createElement('div');
    knoepfe.className = 'gruppen-knoepfe';
    MEERE.filter(m => m.typ === typ).forEach(meer => {
      const knopf = document.createElement('button');
      knopf.className = 'gruppe-knopf meer-knopf';
      knopf.textContent = meer.name[sprache];
      knopf.addEventListener('click', () => meereStarten(meer));
      knoepfe.appendChild(knopf);
    });
    gruppenAuswahl.appendChild(knoepfe);
  });
}

// Meere-Modus starten: Meeresflächen zusätzlich zu den Ländern auf den Globus legen
function meereStarten(meer) {
  if (alleLaender.length === 0 || alleMeere.length === 0) return;
  fenster.classList.add('versteckt');
  leiste.classList.add('versteckt');
  globus.controls().autoRotate = false;
  warten = false;
  landUnterMaus = null;
  gesuchtesLand = null;
  aufgabeBox.className = '';
  aufgabeBox.textContent = t().meerHinweis;

  globus.polygonsData([...alleLaender, ...alleMeere]);
  meerWaehlen(meer);
}

// Ein Meer auswählen: hell färben, hinfliegen, Info-Tafel füllen, vorlesen
function meerWaehlen(meer) {
  if (!meer) return;
  aktivesMeer = meer;
  globusNeuFaerben();
  globus.pointOfView(meer.ansicht, 1500);

  gruppenTafel.classList.remove('versteckt');
  document.getElementById('gt-titel').textContent = meer.name[sprache];
  document.getElementById('gt-anzahl').textContent = meer.typ === 'ozean' ? t().typOzean : t().typMeer;
  document.getElementById('gt-info').textContent = meer.info[sprache];
  document.getElementById('gt-fakt').textContent = t().wusstest + ' ' + meer.fakt[sprache];
  document.getElementById('gt-dazu').textContent = '';
  document.getElementById('gt-liste').innerHTML = '';

  aufgabeBox.innerHTML = '<span class="entdeckt-name">' + meer.name[sprache] + '</span>';
  vorlesen(meer.name[sprache] + '. ' + meer.info[sprache]);
}

function meereBeenden() {
  zumMenue('start');
}


// ----- Finde das Meer (Quiz) -----

const WELT_ANSICHT = { lat: 20, lng: 20, altitude: 2.5 };
let meerAuswahl = 'alle';   // Finde das Meer: alle / nur Ozeane / nur Meere

// Auswahl im Startfenster: alle / nur Ozeane / nur Meere
function meereFindenAuswahlBauen() {
  gruppenAuswahl.innerHTML = '';
  const titel = document.createElement('div');
  titel.className = 'gruppen-kategorie';
  titel.textContent = t().meereUeben;
  gruppenAuswahl.appendChild(titel);
  const knoepfe = document.createElement('div');
  knoepfe.className = 'gruppen-knoepfe';
  [['alle', t().meereAlle], ['ozean', t().ozeane], ['meer', t().meereTitel]].forEach(([auswahl, text]) => {
    const knopf = document.createElement('button');
    knopf.className = 'gruppe-knopf meer-knopf';
    knopf.textContent = text;
    knopf.addEventListener('click', () => meereFindenStarten(auswahl));
    knoepfe.appendChild(knopf);
  });
  gruppenAuswahl.appendChild(knoepfe);
}

function meereFindenStarten(auswahl) {
  if (alleLaender.length === 0 || alleMeere.length === 0) return;
  sitzung++;
  meerAuswahl = auswahl;
  nochmalFunktion = () => meereFindenStarten(auswahl);
  quizAktiv = true;
  uebungsSpiel = false;
  falscheListe = [];
  const pool = MEERE.filter(m => auswahl === 'alle' || m.typ === auswahl);
  mpSpielBeginnt(() => meereFindenStarten(auswahl));
  spielLaender = mischen(pool).slice(0, rundenZiel(pool.length));   // hier sind es Meere statt Länder
  rundenNummer = 0;
  punkte = 0;
  fehler = 0;
  aufgegeben = 0;

  fenster.classList.add('versteckt');
  globus.controls().autoRotate = false;
  globus.polygonsData([...alleLaender, ...alleMeere]);
  globus.pointOfView(WELT_ANSICHT, 1500);
  meerNaechsteRunde();
}

function meerNaechsteRunde() {
  mpZugBeendet();
  meerRichtig = null;
  meerFalsch = null;
  falscheMeere.clear();
  landUnterMaus = null;
  globusNeuFaerben();
  aufgabeBox.className = '';

  if (rundenNummer >= spielLaender.length) {
    spielBeenden();
    return;
  }
  if (rundenNummer > 0) globus.pointOfView(WELT_ANSICHT, 1000);   // zurück zur Weltansicht

  schonFalsch = false;
  zielMeer = spielLaender[rundenNummer];
  rundenNummer++;
  anzeigenAktualisieren();

  aufgabeBox.innerHTML = meerAufgabeText();
  vorlesen(ohneHtml(meerAufgabeText()));
  warten = false;
  aufgebenKnopfZeigen(true);
  mpZugStart();
}

function meerAufgabeText() {
  return t().finde + ' <b>' + zielMeer.name[sprache] + '</b>';
}

// Eine Fläche wurde angeklickt
function meerGeklickt(flaeche) {
  if (warten || !flaeche || !flaeche.properties.MEER) return;   // nur Meere zählen
  const geklickt = MEERE.find(m => m.id === flaeche.properties.MEER);
  if (falscheMeere.has(geklickt.id)) return;   // schon rot → zählt nicht nochmal
  warten = true;
  landUnterMaus = null;
  aufgebenKnopfZeigen(false);

  if (zielMeer.teile.includes(flaeche.properties.TEIL)) {
    // ✅ RICHTIG (z. B. zählt beim Mittelmeer auch ein Klick auf die Adria)
    if (!schonFalsch) punkte++;
    meerRichtig = zielMeer;
    aufgabeBox.className = 'richtig';
    richtigKlang();
    aufgabeBox.innerHTML = '✅ ' + t().richtig + ' <b>' + zielMeer.name[sprache] + '</b>';
    anzeigenAktualisieren();
    globusNeuFaerben();
    spaeter(meerNaechsteRunde, 1500);
  } else if (modus === 'profi') {
    // ❌ FALSCH im Profi-Modus: bleibt rot, nochmal versuchen
    fehler++;
    schonFalsch = true;
    falscheMeere.add(geklickt.id);
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().falschNochmal + '<br>' + meerAufgabeText();
    anzeigenAktualisieren();
    globusNeuFaerben();
    spaeter(() => {
      aufgabeBox.className = '';
      aufgabeBox.innerHTML = meerAufgabeText();
      warten = false;
      aufgebenKnopfZeigen(true);
    }, 1000);
  } else {
    // ❌ FALSCH im Lernmodus: richtiges Meer zeigen und hinfliegen
    meerFalsch = geklickt;
    meerRichtig = zielMeer;
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().dasWar + ' ' + geklickt.name[sprache] +
      '.<br>' + t().gesuchtWar + ' <b>' + zielMeer.name[sprache] + '</b>';
    globusNeuFaerben();
    globus.pointOfView(zielMeer.ansicht, 1000);
    spaeter(meerNaechsteRunde, 3000);
  }
}

// "Zeig es mir" im Profi-Modus
function meerAufgeben() {
  warten = true;
  aufgebenKnopfZeigen(false);
  aufgegeben++;
  meerRichtig = zielMeer;
  aufgabeBox.className = 'falsch';
  aufgabeBox.innerHTML = t().aufgegebenMeldung + '<br>' + t().gesuchtWar + ' <b>' + zielMeer.name[sprache] + '</b>';
  globusNeuFaerben();
  globus.pointOfView(zielMeer.ansicht, 1000);
  spaeter(meerNaechsteRunde, 3000);
}


// ----- Karteikarten -----

function kartenStarten() {
  const laender = alleLaender.filter(land =>
    imGebiet(land) && istAbfragbar(land)
  );
  kartenStapel = mischen(laender);

  fenster.classList.add('versteckt');
  aufgabeBox.classList.add('versteckt');
  leiste.classList.add('versteckt');
  karte.classList.remove('versteckt');
  globus.controls().autoRotate = false;
  globus.pointOfView(GEBIET_ANSICHT[gebiet], 1500);

  karteZeigen(0);
}

// Zeigt die Karte Nummer "nummer" (Vorderseite mit Flagge)
function karteZeigen(nummer) {
  // Am Ende wieder von vorne anfangen (und umgekehrt)
  kartenNummer = (nummer + kartenStapel.length) % kartenStapel.length;
  gesuchtesLand = kartenStapel[kartenNummer];

  // Ohne Animation auf die Vorderseite drehen, damit man die neue Antwort nicht kurz sieht
  karteInnen.style.transition = 'none';
  karteInnen.classList.remove('umgedreht');
  void karteInnen.offsetWidth;   // Browser kurz "nachdenken" lassen
  karteInnen.style.transition = '';
  karteUmgedreht = false;

  document.getElementById('karte-flagge').src = flaggenBild(gesuchtesLand);
  document.getElementById('karte-hinweis').textContent = t().umdrehen;
  document.getElementById('karte-zaehler').textContent = (kartenNummer + 1) + ' / ' + kartenStapel.length;
  rueckseiteFuellen();

  globus.pointsData([]);
  globusNeuFaerben();
}

// Schreibt die Infos auf die Rückseite der Karte
function rueckseiteFuellen() {
  const land = gesuchtesLand;
  const info = laenderInfo[land.properties.ADM0_A3];
  const stadt = hauptstadtVon(land);

  document.getElementById('karte-flagge-klein').src = flaggenBild(land);
  document.getElementById('karte-name').textContent = landName(land);

  // Zahlen und Namen in der gewählten Sprache (das kann der Browser selbst)
  const zahl = (n) => new Intl.NumberFormat(sprache, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
  const ganz = (n) => new Intl.NumberFormat(sprache).format(n);
  const sprachName = new Intl.DisplayNames([sprache], { type: 'language' });
  const geldName = new Intl.DisplayNames([sprache], { type: 'currency' });
  const komma = sprache === 'ar' ? '، ' : ', ';   // Arabisch hat ein eigenes Komma

  const zeilen = [[t().kHauptstadt, stadt ? stadt[sprache] : '–'],
                  [t().kKontinent, t().gebiete[land.properties.CONTINENT] || land.properties.CONTINENT]];

  if (info) {
    // Sprachen: nur die, deren Namen der Browser kennt, höchstens 4
    const sprachen = info.sprachen
      .map(code => { try { return sprachName.of(code); } catch (e) { return code; } })
      .filter((name, i) => name !== info.sprachen[i]);
    let sprachText = sprachen.slice(0, 4).join(komma);
    if (sprachen.length > 4) sprachText += ' …';

    zeilen.push(
      [t().kEinwohner, t().ca + ' ' + zahl(info.einwohner) + ' (' + info.jahr + ')'],
      [t().kFlaeche, ganz(info.flaeche) + ' ' + t().km2],
      [t().kSprachen, sprachText || '–'],
      [t().kWaehrung, info.waehrung.map(code => geldName.of(code)).join(komma)],
      [t().kReligion, info.religion.map(code => t().religionen[code]).join(komma)]
    );
  }

  // Tabelle bauen: links die Bezeichnung, rechts der Wert
  const tabelle = document.getElementById('karte-infos');
  tabelle.innerHTML = '';
  zeilen.forEach(([bezeichnung, wert]) => {
    const zeile = tabelle.insertRow();
    zeile.insertCell().textContent = bezeichnung;
    zeile.insertCell().textContent = wert;
  });
}

// Karte umdrehen (Vorderseite ↔ Rückseite)
function karteUmdrehen() {
  karteUmgedreht = !karteUmgedreht;
  karteInnen.classList.toggle('umgedreht', karteUmgedreht);

  if (karteUmgedreht) {
    // Rückseite: Land blau zeigen, hinfliegen, Hauptstadt-Punkt, Namen vorlesen
    globusNeuFaerben();
    fliegeZu(gesuchtesLand, 1.6);
    const stadt = hauptstadtVon(gesuchtesLand);
    globus.pointsData(stadt ? [{ lat: stadt.lat, lng: stadt.lng }] : []);
    kleinesLandMarke(gesuchtesLand);
    vorlesen(landName(gesuchtesLand));
  } else {
    globus.pointsData([]);
    globusNeuFaerben();
  }
}

// Karteikarten beenden → zurück zur Startseite
function kartenBeenden() {
  zumMenue('start');
}


// ----- 8. Sprache wechseln -----

function spracheSetzen(neueSprache) {
  sprache = neueSprache;

  // Merken, damit beim nächsten Öffnen dieselbe Sprache gewählt ist
  try { localStorage.setItem('geo-sprache', sprache); } catch (e) {}

  // Arabisch: Seite von rechts nach links
  document.documentElement.lang = sprache;
  document.documentElement.dir = RECHTS_NACH_LINKS.includes(sprache) ? 'rtl' : 'ltr';

  // Gewählten Sprach-Knopf hervorheben
  sprachKnoepfe.forEach(knopf => {
    knopf.classList.toggle('aktiv', knopf.dataset.sprache === sprache);
  });

  // Alle Texte im Menü neu schreiben
  startfensterTexte();
  gebietKnoepfe.forEach(knopf => {
    knopf.querySelector('span').textContent = t().gebiete[knopf.dataset.gebiet];
  });
  menueKnopf.title = t().zurStartseite;
  document.getElementById('frage-text').textContent = t().abbrechenFrage;
  document.getElementById('frage-ja').textContent = t().jaAbbrechen;
  document.getElementById('frage-nein').textContent = t().weiterspielen;
  modusKnoepfe.forEach(knopf => {
    knopf.textContent = knopf.dataset.modus === 'profi' ? t().modusProfi : t().modusLernen;
  });
  modusAnzeigen();
  tonKnopfAnzeigen();
  aufgebenKnopf.textContent = t().aufgeben;

  // Obere Anzeigen
  anzeigenAktualisieren();
}


// ----- Das Menü: Startseite, Spiel-Seite, Ergebnis-Seite -----

// Die Spiele auf der Startseite, nach Themen sortiert
const KATEGORIEN = [
  ['lernen',       ['entdecken', 'gruppen', 'karten']],
  ['laender',      ['finden', 'erkennen', 'formMC', 'worldle']],
  ['flaggen',      ['flagge', 'flaggeMC', 'flaggeKarte']],
  ['hauptstaedte', ['hauptstadt', 'regionen']],
  ['meere',        ['meere', 'meereFinden']]
];
const ALLE_SPIELE = KATEGORIEN.flatMap(k => k[1]);

// Spiele mit eigener Auswahl (Gruppe, Meer, Land) statt Kontinent + "Los"
function hatEigeneAuswahl() {
  return ['gruppen', 'meere', 'meereFinden', 'regionen'].includes(spiel);
}

// Spiele mit Punkten (Bestwert, Lern-/Profi-Modus)
function istQuiz(id) {
  return !['karten', 'entdecken', 'gruppen', 'meere'].includes(id);
}

// Name eines Spiels (mit Symbol)
function spielName(id) {
  return {
    finden: t().spielFinden, erkennen: t().spielErkennen,
    flagge: t().spielFlagge, flaggeMC: t().spielFlaggeMC, flaggeKarte: t().spielFlaggeKarte,
    formMC: t().spielFormMC, worldle: t().spielWorldle,
    hauptstadt: t().spielHauptstadt, karten: t().spielKarten, entdecken: t().spielEntdecken,
    gruppen: t().spielGruppen, meere: t().spielMeere, meereFinden: t().spielMeereFinden,
    regionen: t().spielRegionen
  }[id];
}

// Eine Seite des Menüs zeigen (und das Menü öffnen)
function seiteZeigen(name) {
  Object.entries(seiten).forEach(([n, el]) => el.classList.toggle('versteckt', n !== name));
  fenster.classList.remove('versteckt');
  fenster.scrollTop = 0;
}

// Alle Texte im Menü (je nach Spiel und Sprache)
function startfensterTexte() {
  const geladen = alleLaender.length > 0;

  // --- Seite 1: Startseite mit Kärtchen ---
  document.getElementById('start-untertitel').textContent = t().waehleSpiel;
  const ladeHinweis = document.getElementById('lade-hinweis');
  ladeHinweis.textContent = '⏳ ' + t().laden;
  ladeHinweis.classList.toggle('versteckt', geladen);
  const box = document.getElementById('spiel-kategorien');
  box.innerHTML = '';
  KATEGORIEN.forEach(([kategorie, spiele]) => {
    const titel = document.createElement('h2');
    titel.className = 'kategorie-titel';
    titel.textContent = t().spielKategorien[kategorie];
    box.appendChild(titel);
    const raster = document.createElement('div');
    raster.className = 'karten-raster kat-' + kategorie;
    spiele.forEach(id => {
      const karteKnopf = document.createElement('button');
      karteKnopf.className = 'spiel-karte';
      karteKnopf.dataset.spiel = id;
      const best = bestwertFuerKarte(id);
      karteKnopf.innerHTML = '<span class="sk-name"></span><span class="sk-kurz"></span>' +
        (best !== null ? '<span class="sk-best">🏆 ' + best + ' %</span>' : '');
      karteKnopf.querySelector('.sk-name').textContent = spielName(id);
      karteKnopf.querySelector('.sk-kurz').textContent = t().kurz[id];
      karteKnopf.addEventListener('click', () => spielOeffnen(id));
      raster.appendChild(karteKnopf);
    });
    box.appendChild(raster);
  });

  // --- Seite 2: Spiel-Einstellungen ---
  const beschreibung = {
    finden: t().beschreibung, erkennen: t().beschreibungErkennen,
    flagge: t().beschreibungFlagge, flaggeMC: t().beschreibungFlaggeMC, flaggeKarte: t().beschreibungFlaggeKarte,
    formMC: t().beschreibungFormMC, worldle: t().beschreibungWorldle,
    hauptstadt: t().beschreibungHauptstadt, karten: t().beschreibungKarten,
    entdecken: t().beschreibungEntdecken, gruppen: t().beschreibungGruppen, meere: t().beschreibungMeere,
    meereFinden: t().beschreibungMeereFinden, regionen: t().beschreibungRegionen
  };
  document.getElementById('zurueck-knopf').textContent = t().zurueck;
  fensterTitel.textContent = spielName(spiel);
  fensterText.textContent = beschreibung[spiel];
  gebietFrage.textContent = t().frageGebiet;

  // Mehrspieler nur bei Quiz-Spielen anbieten
  mpEinstellungenBauen();
  const mitMehrspieler = QUIZ_SPIELE.includes(spiel);
  document.getElementById('mp-wahl').classList.toggle('versteckt', !mitMehrspieler);
  if (!mitMehrspieler) document.getElementById('mp-einstellungen').classList.add('versteckt');

  // Lern-/Profi-Modus nur bei Quiz-Spielen (im Mehrspieler-Modus nicht)
  const ohneModus = !istQuiz(spiel) || mpAktiv();
  modusAuswahl.classList.toggle('versteckt', ohneModus);
  modusInfo.classList.toggle('versteckt', ohneModus);

  // Gruppen / Meere / Regionen: eigene Auswahl statt Kontinent + "Los"
  const eigeneAuswahl = hatEigeneAuswahl();
  gruppenAuswahl.classList.toggle('versteckt', !eigeneAuswahl);
  gebietAuswahl.classList.toggle('versteckt', eigeneAuswahl);
  gebietFrage.classList.toggle('versteckt', eigeneAuswahl);
  losKnopf.classList.toggle('versteckt', eigeneAuswahl);
  if (spiel === 'gruppen') gruppenAuswahlBauen();
  if (spiel === 'meere') meereAuswahlBauen();
  if (spiel === 'meereFinden') meereFindenAuswahlBauen();
  if (spiel === 'regionen' && typeof regionenAuswahlBauen === 'function' && geladen) regionenAuswahlBauen();

  gebietKnoepfe.forEach(knopf => knopf.classList.toggle('aktiv', knopf.dataset.gebiet === menueGebiet));
  losKnopf.textContent = geladen ? t().los : '⏳ ' + t().laden;
  losKnopf.disabled = !geladen;
  bestwertAnzeigen();

  // --- Seite 3: Knöpfe auf der Ergebnis-Seite ---
  document.getElementById('nochmal-knopf').textContent = t().nochmalKnopf;
  document.getElementById('einstellungen-knopf').textContent = t().einstellungen;
  document.getElementById('startseite-knopf').textContent = t().zurStartseite;
  document.getElementById('fehler-knopf').textContent = t().fehlerUeben(falscheListe.length);
}

// Ein Spiel-Kärtchen wurde angetippt → Spiel-Seite öffnen
function spielOeffnen(neuesSpiel) {
  spiel = neuesSpiel;
  try { localStorage.setItem('geo-spiel', spiel); } catch (e) {}
  startfensterTexte();
  seiteZeigen('spiel');
  verlaufMerken();
}
// (alter Name, wird noch an manchen Stellen benutzt)
function spielSetzen(neuesSpiel) { spielOeffnen(neuesSpiel); }

// Kontinent wählen (gestartet wird mit "Los")
function gebietWaehlen(neuesGebiet) {
  menueGebiet = neuesGebiet;
  try { localStorage.setItem('geo-gebiet', menueGebiet); } catch (e) {}
  gebietKnoepfe.forEach(knopf => knopf.classList.toggle('aktiv', knopf.dataset.gebiet === menueGebiet));
  bestwertAnzeigen();
}

// "Los geht's"
function losGehts() {
  if (alleLaender.length === 0) return;
  spielStarten(menueGebiet);
}


// ----- Bestwerte (werden im Browser gespeichert) -----

let bestwerte = {};
try { bestwerte = JSON.parse(localStorage.getItem('geo-bestwerte')) || {}; } catch (e) {}

// Unter welchem Namen wird der Bestwert gespeichert? (Spiel + Gebiet bzw. Auswahl)
function bestSchluessel(gebietName) {
  if (spiel === 'meereFinden') return spiel + '|' + meerAuswahl;
  if (spiel === 'regionen') return spiel + '|' + (rLand ? rLand.properties.ADM0_A3 : '') + '|' + rAktivitaet;
  return spiel + '|' + gebietName;
}

// Neues Ergebnis eintragen; gibt true zurück, wenn es ein neuer Rekord ist
function bestwertEintragen(p, max) {
  if (!max) return false;
  const schluessel = bestSchluessel(gebiet);
  const alt = bestwerte[schluessel];
  if (alt && alt.p / alt.m >= p / max) return false;
  bestwerte[schluessel] = { p: p, m: max };
  try { localStorage.setItem('geo-bestwerte', JSON.stringify(bestwerte)); } catch (e) {}
  return p > 0;
}

// Bester Prozentwert eines Spiels (egal welches Gebiet) für das Kärtchen
function bestwertFuerKarte(id) {
  const werte = Object.entries(bestwerte).filter(([k]) => k.startsWith(id + '|')).map(([, w]) => w.p / w.m);
  return werte.length ? Math.round(Math.max(...werte) * 100) : null;
}

// Bestwert auf der Spiel-Seite (für das gewählte Gebiet)
function bestwertAnzeigen() {
  const anzeige = document.getElementById('bestwert');
  const wert = istQuiz(spiel) && !hatEigeneAuswahl() && bestwerte[spiel + '|' + menueGebiet];
  anzeige.textContent = wert ? t().bestwert(wert.p + ' / ' + wert.m) : '';
  anzeige.classList.toggle('versteckt', !wert);
}


// ----- Ergebnis-Seite: welche Länder waren falsch? -----

function endeFehlerZeigen() {
  const mitListe = !mpLaeuft() && ['finden', 'erkennen', 'flagge', 'flaggeMC', 'flaggeKarte', 'formMC', 'worldle', 'hauptstadt'].includes(spiel);
  endeFehler.innerHTML = '';
  if (mitListe && falscheListe.length > 0) {
    endeFehler.innerHTML = '<div class="ende-fehler-titel">' + t().falschWaren + '</div>';
    const liste = document.createElement('div');
    liste.className = 'fehler-liste';
    falscheListe.forEach(land => {
      const chip = document.createElement('span');
      chip.className = 'fehler-chip';
      chip.innerHTML = '<img src="' + flaggenBild(land) + '" alt=""> ';
      chip.appendChild(document.createTextNode(landName(land)));
      liste.appendChild(chip);
    });
    endeFehler.appendChild(liste);
  } else if (mitListe) {
    endeFehler.innerHTML = '<div class="ende-fehler-titel">' + t().allesRichtig + '</div>';
  }
  const fehlerKnopf = document.getElementById('fehler-knopf');
  fehlerKnopf.textContent = t().fehlerUeben(falscheListe.length);
  fehlerKnopf.classList.toggle('versteckt', !(mitListe && falscheListe.length > 0));
  document.getElementById('nochmal-knopf').classList.toggle('versteckt', !nochmalFunktion);
}


// ----- Zurück zum Menü (🏠-Knopf, Zurück-Geste, Esc) -----

// Räumt das laufende Spiel auf und öffnet eine Seite des Menüs ('start' oder 'spiel')
function zumMenue(ziel) {
  sitzung++;                       // geplante Schritte des alten Spiels verfallen
  frageBox.classList.add('versteckt');
  mpTimerStopp();
  if (mp.laeuft) mpAufraeumen();
  if ('speechSynthesis' in window) speechSynthesis.cancel();

  // Spiel-spezifisches aufräumen
  if (rAktiv) regionenAufraeumen();
  if (spiel === 'worldle') wlAufraeumen();
  aktiveGruppe = null; gruppenSet = new Set();
  aktivesMeer = null; entdecktesMeer = null;
  zielMeer = null; meerRichtig = null; meerFalsch = null; falscheMeere.clear();
  karte.classList.add('versteckt');
  karteUmgedreht = false;

  // Alles vom Spiel wegräumen
  quizAktiv = false;
  warten = true;
  gruppenTafel.classList.add('versteckt');
  antwortenBox.classList.add('versteckt');
  namensBox.classList.add('versteckt');
  aufgebenKnopfZeigen(false);
  aufgabeBox.classList.remove('versteckt');
  aufgabeBox.className = '';
  aufgabeBox.textContent = '';
  leiste.classList.remove('versteckt');
  document.getElementById('mp-leiste').classList.add('versteckt');
  document.getElementById('mp-zeit').classList.add('versteckt');
  richtigesLand = null; falschesLand = null; falscheLaender.clear();
  gesuchtesLand = null; landUnterMaus = null;
  spielLaender = []; rundenNummer = 0;
  gebiet = 'Welt';
  globus.polygonsData(alleLaender);
  globus.pointsData([]);
  globus.htmlElementsData([]);
  globusNeuFaerben();
  globus.controls().autoRotate = true;
  anzeigenAktualisieren();

  startfensterTexte();   // Bestwerte auf den Kärtchen aktualisieren
  seiteZeigen(ziel || 'start');
}

// 🏠 gedrückt: mitten im Quiz erst nachfragen
function menueKnopfGedrueckt() {
  if (quizAktiv) frageBox.classList.remove('versteckt');
  else zumMenue('start');
}

// Die Zurück-Geste (Handy) bzw. der Zurück-Knopf des Browsers bleibt in der App
function verlaufMerken() {
  try { history.pushState({ geo: true }, ''); } catch (e) {}
}
window.addEventListener('popstate', () => {
  const imSpiel = fenster.classList.contains('versteckt');
  if (imSpiel) {
    if (quizAktiv) { verlaufMerken(); frageBox.classList.remove('versteckt'); }   // erst nachfragen
    else zumMenue('spiel');
  } else if (seiten.start.classList.contains('versteckt')) {
    seiteZeigen('start');
  }
});

// Sobald ein Spiel startet (Menü verschwindet), einen Schritt im Verlauf merken
let fensterWarOffen = true;
new MutationObserver(() => {
  const offen = !fenster.classList.contains('versteckt');
  if (fensterWarOffen && !offen) verlaufMerken();
  fensterWarOffen = offen;
}).observe(fenster, { attributes: true, attributeFilter: ['class'] });


// ----- 9. Modus wechseln (Lernmodus / Profi-Modus) -----

function modusSetzen(neuerModus) {
  modus = neuerModus;
  try { localStorage.setItem('geo-modus', modus); } catch (e) {}
  modusAnzeigen();
}

// Gewählten Modus-Knopf hervorheben und Erklärung darunter schreiben
function modusAnzeigen() {
  modusKnoepfe.forEach(knopf => {
    knopf.classList.toggle('aktiv', knopf.dataset.modus === modus);
  });
  modusInfo.textContent = modus === 'profi' ? t().infoProfi : t().infoLernen;
}


// ----- 10. Knöpfe verbinden -----

modusKnoepfe.forEach(knopf => {
  knopf.addEventListener('click', () => modusSetzen(knopf.dataset.modus));
});

aufgebenKnopf.addEventListener('click', aufgeben);
tonKnopf.addEventListener('click', tonUmschalten);

// Karteikarten: Karte antippen = umdrehen, Pfeile = vor/zurück, ✖ = beenden
karteInnen.addEventListener('click', karteUmdrehen);
document.getElementById('karte-weiter').addEventListener('click', () => karteZeigen(kartenNummer + 1));
document.getElementById('karte-zurueck').addEventListener('click', () => karteZeigen(kartenNummer - 1));
document.getElementById('karte-beenden').addEventListener('click', kartenBeenden);

// 🏠-Knopf und Esc-Taste führen zurück zur Startseite
function zurueckZumMenue() { menueKnopfGedrueckt(); }
menueKnopf.addEventListener('click', menueKnopfGedrueckt);
document.addEventListener('keydown', taste => {
  if (taste.key !== 'Escape') return;
  if (!frageBox.classList.contains('versteckt')) { frageBox.classList.add('versteckt'); return; }
  if (fenster.classList.contains('versteckt') && karte.classList.contains('versteckt')) menueKnopfGedrueckt();
});

// Nachfrage "Spiel abbrechen?"
document.getElementById('frage-ja').addEventListener('click', () => zumMenue('start'));
document.getElementById('frage-nein').addEventListener('click', () => frageBox.classList.add('versteckt'));

// Menü-Knöpfe
document.getElementById('zurueck-knopf').addEventListener('click', () => seiteZeigen('start'));
document.getElementById('ton-menue').addEventListener('click', tonUmschalten);
losKnopf.addEventListener('click', losGehts);
document.getElementById('nochmal-knopf').addEventListener('click', () => { if (nochmalFunktion) nochmalFunktion(); });
document.getElementById('fehler-knopf').addEventListener('click', () => {
  if (falscheListe.length) spielStarten(menueGebiet, [...falscheListe]);
});
document.getElementById('einstellungen-knopf').addEventListener('click', () => zumMenue('spiel'));
document.getElementById('startseite-knopf').addEventListener('click', () => zumMenue('start'));


// Karteikarten mit der Tastatur: Leertaste = umdrehen, Pfeiltasten = vor/zurück, Esc = beenden
document.addEventListener('keydown', taste => {
  if (karte.classList.contains('versteckt')) return;
  const aufKnopf = taste.target.tagName === 'BUTTON';   // Leertaste auf einem Knopf "drückt" den Knopf
  if ((taste.key === ' ' || taste.key === 'Enter') && !aufKnopf) { taste.preventDefault(); karteUmdrehen(); }
  if (taste.key === 'ArrowRight') karteZeigen(kartenNummer + 1);
  if (taste.key === 'ArrowLeft')  karteZeigen(kartenNummer - 1);
  if (taste.key === 'Escape')     kartenBeenden();
});


// Jeder Sprach-Knopf wechselt zu "seiner" Sprache
sprachKnoepfe.forEach(knopf => {
  knopf.addEventListener('click', () => spracheSetzen(knopf.dataset.sprache));
});

// Jeder Gebiet-Knopf wählt "seinen" Kontinent
gebietKnoepfe.forEach(knopf => {
  knopf.addEventListener('click', () => gebietWaehlen(knopf.dataset.gebiet));
});


// ----- 11. Beim Öffnen: gespeicherten Modus und Sprache laden -----
try { modus = localStorage.getItem('geo-modus') === 'profi' ? 'profi' : 'lernen'; } catch (e) {}
try { tonAn = localStorage.getItem('geo-ton') !== 'aus'; } catch (e) {}
try {
  const gespeichertesSpiel = localStorage.getItem('geo-spiel');
  if (ALLE_SPIELE.includes(gespeichertesSpiel)) spiel = gespeichertesSpiel;
  const gespeichertesGebiet = localStorage.getItem('geo-gebiet');
  if (GEBIET_ANSICHT[gespeichertesGebiet]) menueGebiet = gespeichertesGebiet;
} catch (e) {}
let gespeicherteSprache = 'de';
try { gespeicherteSprache = localStorage.getItem('geo-sprache') || 'de'; } catch (e) {}
spracheSetzen(TEXTE[gespeicherteSprache] ? gespeicherteSprache : 'de');
seiteZeigen('start');   // beim Öffnen: Startseite
