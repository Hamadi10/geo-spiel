// ===================================================================
// Worldle (wie im Video): pro Land 4 Schritte
//   1. Form erkennen  → Namen schreiben
//   2. Nachbarländer  → alle Nachbarn schreiben (werden auf dem Globus grün)
//   3. Hauptstadt     → Namen der Hauptstadt schreiben
//   4. Hauptstadt antippen → unter mehreren Punkten den richtigen finden
// Jeder Schritt bringt 1 Punkt.
// ===================================================================

let worldleDaten = {};      // aus worldle.json: Nachbarn (n) und große Städte (s) pro Land
let wlNachbarn = [];        // Nachbarländer des gesuchten Landes
const wlGefunden = new Set();   // schon richtig genannte Nachbarn
const wlFalsch = new Set();     // genannte Länder, die keine Nachbarn sind
let wlAufgedeckt = false;   // Nachbarn-Schritt vorbei → fehlende Nachbarn orange zeigen
let wlFehlversucheUebrig = 0;
let wlStadtPunkte = [];     // die Punkte beim "Hauptstadt antippen"
let wlMeldungNummer = 0;    // damit alte Meldungen keine neuen überschreiben

const FARBE_NACHBAR  = 'rgba(190, 190, 190, 0.8)';   // grau = Nachbar, noch nicht gefunden
const FARBE_VERPASST = 'rgba(255, 150, 0, 0.9)';     // orange = Nachbar, den man nicht gefunden hat

fetch('worldle.json')
  .then(antwort => antwort.json())
  .then(daten => { worldleDaten = daten; });

// ---------- Hilfen ----------

function wlDaten() {
  return worldleDaten[gesuchtesLand.properties.ADM0_A3] || { n: [], s: [] };
}

// Wie weit weg soll die Kamera sein? (je größer das Land, desto weiter)
function wlHoehe() {
  const info = laenderInfo[gesuchtesLand.properties.ADM0_A3];
  if (!info || !info.flaeche) return 1.2;
  return Math.min(2.5, Math.max(0.35, Math.sqrt(info.flaeche) / 1100));
}

// Wie groß sind die Punkte beim Hauptstadt-Antippen?
function wlPunktGroesse() {
  const info = laenderInfo[gesuchtesLand.properties.ADM0_A3];
  if (!info || !info.flaeche) return 0.2;
  return Math.min(0.55, Math.max(0.07, Math.sqrt(info.flaeche) / 6000));
}

// Im Mehrspieler-Modus mit Zeitlimit: Zeit für jeden Schritt neu starten
function wlZeitStarten() {
  if (mpLaeuft() && mp.zeitlimit) mpTimerStart();
}

// Kurze Meldung oben zeigen, danach wieder die Aufgabe
function wlMeldung(html, klasse, dauer) {
  const nummer = ++wlMeldungNummer;
  const schritt = wlSchritt;
  aufgabeBox.className = klasse;
  aufgabeBox.innerHTML = html + '<br>' + wlAufgabeText();
  spaeter(() => {
    if (nummer !== wlMeldungNummer || wlSchritt !== schritt || warten) return;
    aufgabeBox.className = '';
    aufgabeBox.innerHTML = wlAufgabeText();
  }, dauer || 1400);
}

// Text der Aufgabe oben (je nach Schritt)
function wlAufgabeText() {
  if (!gesuchtesLand) return '';
  const land = landName(gesuchtesLand);
  if (wlSchritt === 'name') return formBild(gesuchtesLand) + t().frageForm;
  if (wlSchritt === 'nachbarn') {
    return t().frageNachbarn(land, wlNachbarn.length) + '<br><small>' +
      t().nachbarnStand(wlGefunden.size, wlNachbarn.length, wlFehlversucheUebrig) + '</small>';
  }
  if (wlSchritt === 'hauptstadt') return t().frageHauptstadt(land);
  const stadt = hauptstadtVon(gesuchtesLand);
  return t().frageWoHauptstadt(stadt ? stadt[sprache] : '', land);
}

// Farben auf dem Globus (ab Schritt 2)
function wlFarbe(land) {
  if (land === gesuchtesLand) return FARBE_FRAGE;
  if (wlSchritt === 'nachbarn') {
    if (wlGefunden.has(land)) return FARBE_RICHTIG;
    if (wlNachbarn.includes(land)) return wlAufgedeckt ? FARBE_VERPASST : FARBE_NACHBAR;
    if (wlFalsch.has(land)) return FARBE_FALSCH;
  }
  return FARBE_INAKTIV;
}

// Schilder auf dem Globus: "1. ?" oder "1. Österreich"
function wlSchilderZeigen(daten) {
  globus
    .htmlLat(d => d.lat)
    .htmlLng(d => d.lng)
    .htmlAltitude(0.02)
    .htmlElement(d => {
      const anker = document.createElement('div');
      anker.className = 'wl-anker';
      const schild = document.createElement('span');
      schild.className = 'wl-schild ' + (d.art || '');
      schild.textContent = d.text;
      anker.appendChild(schild);
      return anker;
    })
    .htmlElementsData(daten);   // Daten erst NACH den Einstellungen übergeben
}

function wlNachbarSchilder() {
  const p = gesuchtesLand.properties;
  wlSchilderZeigen([
    { lat: p.LABEL_Y, lng: p.LABEL_X, text: landName(gesuchtesLand), art: 'ziel' },
    ...wlNachbarn.map((land, i) => {
      const bekannt = wlGefunden.has(land) || wlAufgedeckt;
      return {
        lat: land.properties.LABEL_Y, lng: land.properties.LABEL_X,
        text: (i + 1) + '. ' + (bekannt ? landName(land) : '?'),
        art: wlGefunden.has(land) ? 'gefunden' : (wlAufgedeckt ? 'verpasst' : '')
      };
    })
  ]);
}

function wlAufraeumen() {
  globus.htmlElementsData([]);
  globus.pointsData([]);
  wlSchritt = 'name';
  namensBox.classList.add('versteckt');
  namensBox.classList.remove('unten');
}

// Ein Schritt ist richtig/falsch beantwortet (Name und Hauptstadt funktionieren gleich)
function wlTextAntwort(richtig, loesung, weiter) {
  if (richtig) {
    warten = true;
    aufgebenKnopfZeigen(false);
    if (!schonFalsch) punkte++;
    aufgabeBox.className = 'richtig';
    richtigKlang();
    aufgabeBox.innerHTML = '✅ ' + t().richtig + ' <b>' + loesung + '</b>';
    anzeigenAktualisieren();
    spaeter(weiter, 1300);
  } else if (modus === 'profi') {
    // Profi: nochmal versuchen
    fehler++;
    schonFalsch = true;
    falschKlang();
    namensEingabe.value = '';
    anzeigenAktualisieren();
    wlMeldung('❌ ' + t().falschNochmal, 'falsch', 1500);
  } else {
    // Lernmodus: Lösung zeigen und weiter
    warten = true;
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().richtigIst + ' <b>' + loesung + '</b>';
    spaeter(weiter, 2500);
  }
}

// ---------- Schritt 1: Form → Name ----------

function wlRundeStarten() {
  wlSchritt = 'name';
  wlNachbarn = [];
  wlGefunden.clear();
  wlFalsch.clear();
  wlAufgedeckt = false;
  wlStadtPunkte = [];
  wlMax++;
  globus.htmlElementsData([]);
  globus.pointsData([]);
  globusNeuFaerben();
  globus.pointOfView(GEBIET_ANSICHT[gebiet], 1000);   // Globus verrät das Land nicht
  eingabeZeigen(t().eingabePlatzhalter, false);
}

// Text aus dem Eingabefeld prüfen
function wlEingabe() {
  if (warten) return;
  const eingabe = vergleichsText(namensEingabe.value);
  if (!eingabe) return;
  namensVorschlaege.innerHTML = '';
  if (wlSchritt === 'name') {
    wlTextAntwort(landNamenVarianten(gesuchtesLand).includes(eingabe), landName(gesuchtesLand), wlNachbarnStarten);
  } else if (wlSchritt === 'nachbarn') {
    wlNachbarPruefen(eingabe);
  } else if (wlSchritt === 'hauptstadt') {
    const stadt = hauptstadtVon(gesuchtesLand);
    const richtig = ['de', 'en', 'fr', 'ar'].some(k => vergleichsText(stadt[k]) === eingabe);
    wlTextAntwort(richtig, stadt[sprache], wlPunktStarten);
  }
}

// ---------- Schritt 2: Nachbarländer ----------

function wlNachbarnStarten() {
  schonFalsch = false;
  wlNachbarn = (wlDaten().n || []).map(landMitCode).filter(Boolean);
  wlSchritt = 'nachbarn';
  globusNeuFaerben();
  namensEingabe.value = '';
  namensVorschlaege.innerHTML = '';

  // Inseln wie Japan oder Island haben keine Nachbarn → gleich weiter zur Hauptstadt
  if (wlNachbarn.length === 0) {
    globus.htmlElementsData([]);
    fliegeZu(gesuchtesLand, wlHoehe());
    aufgabeBox.className = '';
    aufgabeBox.innerHTML = t().keineNachbarn(landName(gesuchtesLand));
    vorlesen(ohneHtml(aufgabeBox.innerHTML));
    warten = true;
    spaeter(wlHauptstadtStarten, 2500);
    return;
  }

  wlMax++;
  wlFehlversucheUebrig = modus === 'profi' ? 2 : 4;
  wlNachbarSchilder();
  globus.pointOfView(gruppenAnsicht([gesuchtesLand, ...wlNachbarn]), 1200);
  eingabeZeigen(t().eingabePlatzhalter, true);
  aufgabeBox.className = '';
  aufgabeBox.innerHTML = wlAufgabeText();
  vorlesen(ohneHtml(t().frageNachbarn(landName(gesuchtesLand), wlNachbarn.length)));
  warten = false;
  aufgebenKnopfZeigen(true);
  wlZeitStarten();
}

function wlNachbarPruefen(eingabe) {
  namensEingabe.value = '';
  const land = alleLaender.find(l => l.properties.SPIEL && landNamenVarianten(l).includes(eingabe));
  if (!land) { wlMeldung('🤔 ' + t().unbekanntesLand, '', 1600); return; }   // kostet keinen Versuch
  if (land === gesuchtesLand || wlGefunden.has(land) || wlFalsch.has(land)) {
    wlMeldung('🔁 ' + t().schonGeraten, '', 1400);
    return;
  }

  if (wlNachbarn.includes(land)) {
    // ✅ ein Nachbar mehr gefunden
    wlGefunden.add(land);
    richtigKlang();
    globusNeuFaerben();
    wlNachbarSchilder();
    if (wlGefunden.size === wlNachbarn.length) {   // alle gefunden → 1 Punkt
      warten = true;
      aufgebenKnopfZeigen(false);
      punkte++;
      anzeigenAktualisieren();
      aufgabeBox.className = 'richtig';
      aufgabeBox.innerHTML = '🎉 ' + t().alleNachbarn;
      vorlesen(t().alleNachbarn);
      spaeter(wlHauptstadtStarten, 2200);
      return;
    }
    wlMeldung('✅ <b>' + landName(land) + '</b>', 'richtig', 1100);
  } else {
    // ❌ kein Nachbar
    wlFalsch.add(land);
    wlFehlversucheUebrig--;
    if (modus === 'profi') fehler++;
    falschKlang();
    globusNeuFaerben();
    anzeigenAktualisieren();
    if (wlFehlversucheUebrig <= 0) { wlNachbarnAufdecken(''); return; }
    wlMeldung('❌ ' + t().keinNachbar(landName(land)), 'falsch', 1400);
  }
}

// Fehlende Nachbarn orange zeigen und weiter zur Hauptstadt
function wlNachbarnAufdecken(vorne) {
  warten = true;
  aufgebenKnopfZeigen(false);
  wlAufgedeckt = true;
  globusNeuFaerben();
  wlNachbarSchilder();
  aufgabeBox.className = 'falsch';
  aufgabeBox.innerHTML = vorne + t().nachbarnVerpasst;
  spaeter(wlHauptstadtStarten, 4000);
}

// ---------- Schritt 3: Hauptstadt schreiben ----------

// Vorschläge: alle Hauptstädte in der gewählten Sprache
function wlHauptstadtKandidaten() {
  const namen = new Set();
  alleLaender.forEach(land => {
    const stadt = land.properties.SPIEL && hauptstadtVon(land);
    if (stadt) namen.add(stadt[sprache]);
  });
  return [...namen].map(text => ({ text }));
}

function wlHauptstadtStarten() {
  if (!hauptstadtVon(gesuchtesLand)) { naechsteRunde(); return; }   // keine Hauptstadt gespeichert
  wlSchritt = 'hauptstadt';
  wlMax++;
  schonFalsch = false;
  globus.htmlElementsData([]);
  globusNeuFaerben();
  fliegeZu(gesuchtesLand, wlHoehe() * 1.3);
  eingabeZeigen(t().eingabeStadt, true);
  aufgabeBox.className = '';
  aufgabeBox.innerHTML = wlAufgabeText();
  vorlesen(ohneHtml(wlAufgabeText()));
  warten = false;
  aufgebenKnopfZeigen(true);
  wlZeitStarten();
}

// ---------- Schritt 4: Hauptstadt auf der Karte antippen ----------

function wlPunktStarten() {
  const staedte = wlDaten().s || [];
  if (staedte.length === 0) { naechsteRunde(); return; }   // zu wenige Städte → Runde fertig
  const hauptstadt = hauptstadtVon(gesuchtesLand);
  wlSchritt = 'punkt';
  wlMax++;
  schonFalsch = false;
  namensBox.classList.add('versteckt');
  namensEingabe.blur();
  const groesse = wlPunktGroesse();
  wlStadtPunkte = mischen([
    { stadt: hauptstadt, richtig: true },
    ...staedte.map(stadt => ({ stadt, richtig: false }))
  ]).map(p => ({ ...p, lat: p.stadt.lat, lng: p.stadt.lng, radius: groesse, farbe: 'rgba(255, 255, 255, 0.95)', wl: true }));
  globus.pointsData([...wlStadtPunkte]);
  globusNeuFaerben();
  fliegeZu(gesuchtesLand, wlHoehe());
  aufgabeBox.className = '';
  aufgabeBox.innerHTML = wlAufgabeText();
  vorlesen(ohneHtml(wlAufgabeText()));
  warten = false;
  aufgebenKnopfZeigen(true);
  wlZeitStarten();
}

// Namen aller Städte neben die Punkte schreiben (zum Lernen)
function wlStadtNamenZeigen() {
  wlSchilderZeigen(wlStadtPunkte.map(p => ({
    lat: p.lat, lng: p.lng, text: p.stadt[sprache], art: p.richtig ? 'gefunden stadt' : 'stadt'
  })));
}

function wlPunktGeklickt(punkt) {
  if (warten || wlSchritt !== 'punkt' || !punkt.wl || punkt.farbe === FARBE_FALSCH) return;
  const richtigerPunkt = wlStadtPunkte.find(p => p.richtig);

  if (punkt.richtig) {
    warten = true;
    aufgebenKnopfZeigen(false);
    if (!schonFalsch) punkte++;
    punkt.farbe = FARBE_RICHTIG;
    richtigKlang();
    aufgabeBox.className = 'richtig';
    aufgabeBox.innerHTML = '✅ ' + t().richtig + ' <b>' + punkt.stadt[sprache] + '</b>';
    anzeigenAktualisieren();
    globus.pointsData([...wlStadtPunkte]);
    wlStadtNamenZeigen();
    spaeter(naechsteRunde, 2500);
  } else if (modus === 'profi') {
    fehler++;
    schonFalsch = true;
    punkt.farbe = FARBE_FALSCH;
    falschKlang();
    anzeigenAktualisieren();
    globus.pointsData([...wlStadtPunkte]);
    wlMeldung('❌ ' + t().dasWar + ' ' + punkt.stadt[sprache] + '.', 'falsch', 1500);
  } else {
    warten = true;
    punkt.farbe = FARBE_FALSCH;
    richtigerPunkt.farbe = FARBE_RICHTIG;
    falschKlang();
    aufgabeBox.className = 'falsch';
    aufgabeBox.innerHTML = '❌ ' + t().dasWar + ' ' + punkt.stadt[sprache] + '.<br>' +
      t().richtigIst + ' <b>' + richtigerPunkt.stadt[sprache] + '</b>';
    globus.pointsData([...wlStadtPunkte]);
    wlStadtNamenZeigen();
    spaeter(naechsteRunde, 3500);
  }
}

// ---------- "Zeig es mir" (und Zeit abgelaufen) ----------

function wlAufgeben() {
  warten = true;
  aufgebenKnopfZeigen(false);
  aufgegeben++;
  const meldung = t().aufgegebenMeldung + '<br>';
  if (wlSchritt === 'nachbarn') { wlNachbarnAufdecken(meldung); return; }

  aufgabeBox.className = 'falsch';
  if (wlSchritt === 'name') {
    aufgabeBox.innerHTML = meldung + t().richtigIst + ' <b>' + landName(gesuchtesLand) + '</b>';
    spaeter(wlNachbarnStarten, 2500);
  } else if (wlSchritt === 'hauptstadt') {
    aufgabeBox.innerHTML = meldung + t().richtigIst + ' <b>' + hauptstadtVon(gesuchtesLand)[sprache] + '</b>';
    spaeter(wlPunktStarten, 2500);
  } else {
    const richtigerPunkt = wlStadtPunkte.find(p => p.richtig);
    richtigerPunkt.farbe = FARBE_RICHTIG;
    globus.pointsData([...wlStadtPunkte]);
    wlStadtNamenZeigen();
    aufgabeBox.innerHTML = meldung + t().richtigIst + ' <b>' + richtigerPunkt.stadt[sprache] + '</b>';
    spaeter(naechsteRunde, 3000);
  }
}
