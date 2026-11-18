// =====================================================
//  BUNDESLÄNDER & REGIONEN – für alle Länder der Welt
//  Lernen + 4 Spiele: Finde die Region, Welche Region ist das?,
//  Hauptstädte der Regionen, Wo liegt die Stadt?
//  Die Daten liegen pro Land im Ordner "regionen" (z. B. regionen/DEU.json)
// =====================================================

const LIEBLINGSLAENDER = ['DEU', 'USA', 'RUS', 'CHN', 'FRA', 'IND', 'MRT', 'SAU'];

let rLand = null;          // gewähltes Land (Feature aus laender.geojson)
let rDaten = null;         // geladene Regionen + Städte des Landes
let rFlaechen = [];        // Regionen als Flächen für den Globus
let rAktivitaet = 'lernen';// 'lernen', 'finden', 'erkennen', 'hauptstadt', 'stadt'
let rGewaehlt = null;      // Lernen: angetippte Region
let rZiel = null;          // Spiel: gesuchte Region
let rZielStadt = null;     // Spiel "Wo liegt die Stadt?": gefragte Stadt
let rRichtig = null;       // grün
let rFalsch = null;        // rot (Lernmodus)
let rFalscheSet = new Set();// rot (Profi-Modus, bleiben rot)
const rCache = {};         // schon geladene Länder merken

// ---------- Hilfen ----------

function rName(obj) { return obj[sprache] || obj.en || obj.de; }          // Name einer Region oder Stadt
function rRegionWort() { return t().regionWort[rLand.properties.ADM0_A3] || t().regionWort._; }
function rHauptstadt(region) { return rDaten.s.find(s => s.r === region.id && s.hs); }
function rGroesste(region) { return rDaten.s.find(s => s.r === region.id && s.gr); }
function rZahl(n) { return new Intl.NumberFormat(sprache).format(n); }
function rIstSpiel() { return rAktivitaet !== 'lernen'; }

// Farbe für jede Region (verschiedene Farbtöne, damit man die Grenzen gut sieht)
function rGrundfarbe(id) { return 'hsla(' + ((id * 47) % 360) + ', 65%, 55%, 0.45)'; }

// ---------- Startfenster: Land und Aktivität wählen ----------

function regionenAuswahlBauen() {
  gruppenAuswahl.innerHTML = '';

  const titel = document.createElement('div');
  titel.className = 'gruppen-kategorie';
  titel.textContent = t().waehleLand;
  gruppenAuswahl.appendChild(titel);

  // Schnellwahl: deine Lieblingsländer mit Flagge
  const schnell = document.createElement('div');
  schnell.className = 'gruppen-knoepfe';
  LIEBLINGSLAENDER.forEach(code => {
    const land = alleLaender.find(l => l.properties.ADM0_A3 === code);
    if (!land) return;
    const knopf = document.createElement('button');
    knopf.className = 'gruppe-knopf land-knopf' + (rLand === land ? ' aktiv' : '');
    knopf.innerHTML = '<img src="' + flaggenBild(land) + '"> ' + landName(land);
    knopf.addEventListener('click', () => rLandWaehlen(land));
    schnell.appendChild(knopf);
  });
  gruppenAuswahl.appendChild(schnell);

  // Alle anderen Länder in einer Liste (alphabetisch in der gewählten Sprache)
  const liste = document.createElement('select');
  liste.id = 'land-liste';
  const leer = document.createElement('option');
  leer.value = ''; leer.textContent = t().alleLaenderListe;
  liste.appendChild(leer);
  alleLaender.filter(l => l.properties.SPIEL && !['SAH', 'MCO', 'VAT', 'TUV', 'KIR'].includes(l.properties.ADM0_A3))
    .sort((a, b) => landName(a).localeCompare(landName(b), sprache))
    .forEach(land => {
      const opt = document.createElement('option');
      opt.value = land.properties.ADM0_A3;
      opt.textContent = landName(land);
      if (rLand === land) opt.selected = true;
      liste.appendChild(opt);
    });
  liste.addEventListener('change', () => {
    rLandWaehlen(alleLaender.find(l => l.properties.ADM0_A3 === liste.value) || null);
  });
  gruppenAuswahl.appendChild(liste);

  // Aktivitäten (erst klickbar, wenn ein Land gewählt ist)
  const titel2 = document.createElement('div');
  titel2.className = 'gruppen-kategorie';
  titel2.textContent = t().waehleAktivitaet;
  gruppenAuswahl.appendChild(titel2);
  const akt = document.createElement('div');
  akt.className = 'gruppen-knoepfe';
  [['lernen', t().aktLernen], ['finden', t().aktFinden], ['erkennen', t().aktErkennen],
   ['hauptstadt', t().aktHauptstadt], ['stadt', t().aktStadt]].forEach(([id, text]) => {
    const knopf = document.createElement('button');
    knopf.className = 'gruppe-knopf meer-knopf';
    knopf.textContent = text;
    const moeglich = rAktivitaetMoeglich(id);
    knopf.disabled = !moeglich;
    knopf.style.opacity = moeglich ? 1 : 0.4;
    knopf.addEventListener('click', () => regionenStarten(id));
    akt.appendChild(knopf);
  });
  gruppenAuswahl.appendChild(akt);
}

// Land auswählen: Daten gleich laden, damit wir wissen, welche Spiele möglich sind
function rLandWaehlen(land) {
  rLand = land;
  regionenAuswahlBauen();
  if (land) regionenLaden(land.properties.ADM0_A3).then(() => regionenAuswahlBauen());
}

// Geht diese Aktivität mit dem gewählten Land? (manche kleine Länder haben zu wenig Daten)
function rAktivitaetMoeglich(id) {
  if (!rLand) return false;
  const daten = rCache[rLand.properties.ADM0_A3];
  if (!daten) return false;   // wird noch geladen
  const mitHauptstadt = daten.r.filter(r => daten.s.some(s => s.r === r.id && s.hs)).length;
  if (id === 'lernen') return daten.r.length >= 2 && !mpAktiv();   // Lernen nicht im Mehrspieler-Modus
  if (id === 'finden' || id === 'erkennen') return daten.r.length >= 3;
  if (id === 'hauptstadt') return mitHauptstadt >= 4;
  if (id === 'stadt') return daten.s.length >= 3 && new Set(daten.s.map(s => s.r)).size >= 2;
  return true;
}

// ---------- Daten laden und Globus vorbereiten ----------

async function regionenLaden(code) {
  if (!rCache[code]) {
    const antwort = await fetch('regionen/' + code + '.json');
    rCache[code] = await antwort.json();
  }
  return rCache[code];
}

async function regionenStarten(aktivitaet) {
  if (!rLand || !rAktivitaetMoeglich(aktivitaet)) return;
  rAktivitaet = aktivitaet;
  rDaten = await regionenLaden(rLand.properties.ADM0_A3);

  // Regionen als Flächen; das Land selbst wird durch seine Regionen ersetzt
  rFlaechen = rDaten.r.map(r => ({ type: 'Feature', properties: { REGION: 1, id: r.id }, geometry: r.g, region: r }));
  const andere = alleLaender.filter(l => l !== rLand);
  rAktiv = true;
  globus.polygonsData([...andere, ...rFlaechen]);

  // Zum Land fliegen (Höhe passend zur Größe des Landes)
  const flaeche = rDaten.r.reduce((s, r) => s + r.km2, 0);
  const hoehe = Math.min(2.5, Math.max(0.35, Math.sqrt(flaeche) / 1100));
  rStartHoehe = hoehe;
  globus.pointOfView({ lat: rLand.properties.LABEL_Y, lng: rLand.properties.LABEL_X, altitude: hoehe }, 1500);
  rPunktGroesse = Math.min(0.4, Math.max(0.06, Math.sqrt(flaeche) / 8000));

  fenster.classList.add('versteckt');
  globus.controls().autoRotate = false;
  rGewaehlt = null; rZiel = null; rZielStadt = null;
  rRichtig = null; rFalsch = null; rFalscheSet.clear();
  landUnterMaus = null;
  aufgabeBox.className = '';

  if (aktivitaet === 'lernen') {
    rLernenStarten();
  } else {
    rSpielStarten();
  }
}
let rPunktGroesse = 0.15;
let rStartHoehe = 1;       // Zoomstufe beim Öffnen des Landes (für die Anzahl der Stadtnamen)
let rAktiv = false;        // sind gerade Regionen auf dem Globus?

// Punkte auf dem Globus: Städte und sehr kleine Regionen
function rPunkteSetzen(staedte) {
  const punkte = staedte.map(s => ({
    lat: s.lat, lng: s.lng, stadt: s,
    farbe: s.hs ? FARBE_STADT : 'rgba(255, 255, 255, 0.9)',
    radius: rPunktGroesse * (s.hs ? 1.6 : 1)
  }));
  // Sehr kleine Regionen (z. B. Berlin, Hamburg, Bremen) zusätzlich als blauer Punkt zum Antippen
  if (rAktivitaet !== 'erkennen' && rAktivitaet !== 'hauptstadt') {
    rDaten.r.filter(r => r.klein).forEach(r => punkte.push({
      lat: r.lat, lng: r.lng, region: r, farbe: 'rgba(0, 170, 255, 0.9)', radius: rPunktGroesse * 2.2
    }));
  }
  globus.pointsData(punkte);
}

// ---------- Stadtnamen neben den Punkten (nur im Lernmodus) ----------

const MAX_NAMEN = 80;   // höchstens so viele Namen, sonst wird es bei großen Ländern zu voll

function rNamenZeigen() {
  // Wichtigste Städte zuerst: Hauptstädte, größte Städte, dann nach Einwohnern
  const wichtig = [...rDaten.s].sort((a, b) =>
    ((b.lh ? 4 : 0) + (b.hs ? 2 : 0) + (b.gr ? 1 : 0)) - ((a.lh ? 4 : 0) + (a.hs ? 2 : 0) + (a.gr ? 1 : 0)) ||
    (b.ew || 0) - (a.ew || 0)
  ).slice(0, MAX_NAMEN);

  globus
    .htmlLat(s => s.lat)
    .htmlLng(s => s.lng)
    .htmlAltitude(0.016)
    .htmlElement(s => {
      // Ein unsichtbarer "Anker" genau auf dem Punkt, der Name steht rechts daneben
      const anker = document.createElement('div');
      anker.className = 'stadt-anker';
      const name = document.createElement('span');
      name.className = 'stadt-name' + (s.hs ? ' hauptstadt' : '');
      name.textContent = rName(s);
      name.dataset.rang = wichtig.indexOf(s);   // 0 = wichtigste Stadt
      anker.appendChild(name);
      return anker;
    })
    .htmlElementsData(wichtig);   // Daten erst NACH den Einstellungen übergeben

  // Beim Zoomen/Drehen: je näher man heranzoomt, desto mehr Namen
  globus.onZoom(() => rNamenFiltern());
  spaeter(rNamenFiltern, 50);
}

// Zeigt nur so viele Namen, wie bei der aktuellen Zoomstufe gut lesbar sind
function rNamenFiltern() {
  if (!rAktiv || rAktivitaet !== 'lernen') return;
  const hoehe = globus.pointOfView().altitude;
  const anzahl = Math.round(20 * Math.pow(rStartHoehe / hoehe, 2));   // Start: 20 Namen, doppelt so nah: 80
  document.querySelectorAll('.stadt-name').forEach(el => {
    el.style.visibility = Number(el.dataset.rang) < anzahl ? 'visible' : 'hidden';
  });
}

function rNamenWeg() {
  globus.htmlElementsData([]);
}

// ---------- Farben ----------

function regionFarbe(flaeche) {
  if (!flaeche.properties.REGION) return 'rgba(0, 0, 0, 0.55)';   // andere Länder dunkel
  const r = flaeche.region;
  if (rRichtig === r) return FARBE_RICHTIG;
  if (rFalsch === r || rFalscheSet.has(r)) return FARBE_FALSCH;
  if (rGewaehlt === r) return FARBE_FRAGE;
  if (rZiel === r && (rAktivitaet === 'erkennen' || rAktivitaet === 'hauptstadt')) return FARBE_FRAGE;
  if (landUnterMaus === flaeche) return FARBE_MAUS;
  return rGrundfarbe(r.id);
}

function regionenNeuFaerben() {
  globus.polygonCapColor(regionFarbe)
    .polygonAltitude(f => f.properties.REGION ? 0.012 : 0.006);
}

// Darf man in dieser Aktivität Regionen auf dem Globus anklicken?
function rKlickErlaubt() {
  return rAktivitaet === 'lernen' || rAktivitaet === 'finden' || rAktivitaet === 'stadt';
}

// ---------- LERNEN ----------

function rLernenStarten() {
  warten = false;
  leiste.classList.add('versteckt');
  aufgabeBox.textContent = t().regionHinweis;
  rPunkteSetzen(rDaten.s);
  rNamenZeigen();
  regionenNeuFaerben();

  // Tafel mit allen Regionen zum Antippen
  gruppenTafel.classList.remove('versteckt');
  document.getElementById('gt-titel').innerHTML = '<img src="' + flaggenBild(rLand) + '" style="height:22px;vertical-align:middle"> ' + landName(rLand);
  document.getElementById('gt-anzahl').textContent = rDaten.r.length + ' ' + rRegionWort();
  document.getElementById('gt-info').textContent = '';
  document.getElementById('gt-fakt').textContent = '';
  document.getElementById('gt-fakt').style.display = 'none';
  document.getElementById('gt-dazu').textContent = '';
  const liste = document.getElementById('gt-liste');
  liste.innerHTML = '';
  [...rDaten.r].sort((a, b) => rName(a).localeCompare(rName(b), sprache)).forEach(r => {
    const knopf = document.createElement('button');
    knopf.className = 'mitglied-knopf';
    knopf.textContent = rName(r);
    knopf.region = r;
    knopf.addEventListener('click', () => {
      rRegionZeigen(r);
      globus.pointOfView({ lat: r.lat, lng: r.lng, altitude: Math.max(0.25, globus.pointOfView().altitude * 0.8) }, 1000);
    });
    liste.appendChild(knopf);
  });
}

// Region antippen (Lernen): blau, Name + Hauptstadt + größte Stadt zeigen und vorlesen
function rRegionZeigen(r) {
  rGewaehlt = r;
  regionenNeuFaerben();
  const hs = rHauptstadt(r), gr = rGroesste(r);
  let html = '<span class="entdeckt-name">' + rName(r) + '</span>';
  if (hs) html += '<br><span class="entdeckt-info">🏛️ ' + t().kHauptstadt + ': ' + rName(hs) + '</span>';
  if (gr && gr !== hs) html += '<br><span class="entdeckt-info">' + t().groessteStadt + ': ' + rName(gr) + '</span>';
  html += '<br><span class="entdeckt-info">📐 ' + rZahl(r.km2) + ' ' + t().km2 + '</span>';
  aufgabeBox.innerHTML = html;
  document.querySelectorAll('.mitglied-knopf').forEach(k => k.classList.toggle('aktiv', k.region === r));
  vorlesen(rName(r));
}

// Stadt antippen (Lernen): Name, Region, Einwohner zeigen und vorlesen
function rStadtZeigen(s) {
  const r = rDaten.r[s.r];
  rGewaehlt = r;
  regionenNeuFaerben();
  let html = '<span class="entdeckt-name">' + (s.hs ? '🏛️ ' : '🏙️ ') + rName(s) + '</span>';
  html += '<br><span class="entdeckt-info">' + (s.hs ? t().hauptstadtVon + ' ' : '📍 ') + rName(r) + '</span>';
  if (s.ew) html += '<br><span class="entdeckt-info">👥 ' + t().einwohner + ': ' + rZahl(s.ew) + '</span>';
  aufgabeBox.innerHTML = html;
  document.querySelectorAll('.mitglied-knopf').forEach(k => k.classList.toggle('aktiv', k.region === r));
  vorlesen(rName(s));
}

// ---------- SPIELE ----------

function rSpielStarten() {
  rNamenWeg();   // in den Spielen keine Namen – sonst wäre es zu leicht
  leiste.classList.remove('versteckt');
  gruppenTafel.classList.add('versteckt');

  // Was wird abgefragt?
  let pool;
  if (rAktivitaet === 'hauptstadt') pool = rDaten.r.filter(r => rHauptstadt(r));
  else if (rAktivitaet === 'stadt') pool = rDaten.s.filter(s => s.hs || s.gr || s.ew > 200000);
  else pool = rDaten.r;
  if (rAktivitaet === 'stadt' && pool.length < 4) pool = rDaten.s;

  const aktivitaet = rAktivitaet;
  mpSpielBeginnt(() => regionenStarten(aktivitaet));
  sitzung++;
  nochmalFunktion = () => regionenStarten(aktivitaet);
  quizAktiv = true;
  uebungsSpiel = false;
  falscheListe = [];
  spielLaender = mischen(pool).slice(0, rundenZiel(pool.length));   // die Runden dieses Spiels
  rundenNummer = 0; punkte = 0; fehler = 0; aufgegeben = 0;
  rNaechsteRunde();
}

function rNaechsteRunde() {
  mpZugBeendet();
  rRichtig = null; rFalsch = null; rFalscheSet.clear();
  landUnterMaus = null;
  aufgabeBox.className = '';
  antwortenBox.classList.add('versteckt');

  if (rundenNummer >= spielLaender.length) {
    spielBeenden();
    return;
  }
  schonFalsch = false;
  const eintrag = spielLaender[rundenNummer];
  rundenNummer++;
  anzeigenAktualisieren();

  if (rAktivitaet === 'stadt') {
    rZielStadt = eintrag;
    rZiel = rDaten.r[eintrag.r];
    rPunkteSetzen([]);   // Stadt NICHT zeigen (sonst wäre die Antwort zu leicht) – nur blaue Punkte kleiner Regionen
  } else {
    rZiel = eintrag;
    rZielStadt = null;
    if (rAktivitaet === 'finden') {
      rPunkteSetzen([]);   // nur die blauen Punkte für sehr kleine Regionen
    } else {
      // Welche Region / Hauptstädte: kleine gefragte Region zusätzlich als blauer Punkt
      globus.pointsData(rZiel.klein ? [{ lat: rZiel.lat, lng: rZiel.lng, farbe: FARBE_FRAGE, radius: rPunktGroesse * 2.2 }] : []);
    }
  }
  regionenNeuFaerben();

  if (rAktivitaet === 'erkennen' || rAktivitaet === 'hauptstadt') rAntwortenZeigen();

  aufgabeBox.innerHTML = rAufgabeText();
  vorlesen(ohneHtml(rAufgabeText()));
  warten = false;
  aufgebenKnopfZeigen(true);
  mpZugStart();
}

function rAufgabeText() {
  if (rAktivitaet === 'finden') return t().finde + ' <b>' + rName(rZiel) + '</b>';
  if (rAktivitaet === 'erkennen') return t().frageRegionBlau;
  if (rAktivitaet === 'hauptstadt') return t().frageHauptstadt(rName(rZiel));
  return t().frageStadtRegion(rName(rZielStadt));
}

// Text der richtigen Antwort (für Meldungen)
function rRichtigeAntwort() {
  return rAktivitaet === 'hauptstadt' ? rName(rHauptstadt(rZiel)) : rName(rZiel);
}

// 4 Antwort-Knöpfe ("Welche Region ist das?" und "Hauptstädte")
function rAntwortenZeigen() {
  const andere = rDaten.r.filter(r => r !== rZiel && (rAktivitaet !== 'hauptstadt' || rHauptstadt(r)));
  const auswahl = mischen([rZiel, ...mischen(andere).slice(0, 3)]);
  antwortenBox.innerHTML = '';
  auswahl.forEach(r => {
    const knopf = document.createElement('button');
    knopf.className = 'antwort-knopf';
    knopf.textContent = rAktivitaet === 'hauptstadt' ? rName(rHauptstadt(r)) : rName(r);
    knopf.region = r;
    knopf.addEventListener('click', () => rAntwortGewaehlt(knopf));
    antwortenBox.appendChild(knopf);
  });
  antwortenBox.classList.remove('versteckt');
}

function rAntwortGewaehlt(knopf) {
  if (warten || knopf.disabled) return;
  rPruefen(knopf.region, knopf);
}

// Gemeinsame Prüfung für Klicks auf den Globus und Antwort-Knöpfe
function rPruefen(region, knopf) {
  if (rFalscheSet.has(region)) return;
  warten = true;
  landUnterMaus = null;
  aufgebenKnopfZeigen(false);
  const knoepfe = [...antwortenBox.querySelectorAll('.antwort-knopf')];
  const richtigerKnopf = knoepfe.find(k => k.region === rZiel);

  if (region === rZiel) {
    // ✅ RICHTIG
    if (!schonFalsch) punkte++;
    rRichtig = rZiel;
    if (richtigerKnopf) richtigerKnopf.classList.add('richtig');
    knoepfe.forEach(k => k.disabled = true);
    aufgabeBox.className = 'richtig';
    richtigKlang();
    aufgabeBox.innerHTML = '✅ ' + t().richtig + ' <b>' + rRichtigeAntwort() + '</b>';
    anzeigenAktualisieren();
    regionenNeuFaerben();
    rHauptstadtPunktZeigen();
    spaeter(rNaechsteRunde, 1700);
  } else if (modus === 'profi') {
    // ❌ FALSCH im Profi-Modus: bleibt rot, nochmal versuchen
    fehler++;
    schonFalsch = true;
    rFalscheSet.add(region);
    if (knopf) { knopf.classList.add('falsch'); knopf.disabled = true; }
    aufgabeBox.className = 'falsch';
    falschKlang();
    aufgabeBox.innerHTML = '❌ ' + t().falschNochmal + '<br>' + rAufgabeText();
    anzeigenAktualisieren();
    regionenNeuFaerben();
    spaeter(() => {
      aufgabeBox.className = '';
      aufgabeBox.innerHTML = rAufgabeText();
      warten = false;
      aufgebenKnopfZeigen(true);
    }, 1000);
  } else {
    // ❌ FALSCH im Lernmodus: richtige Antwort zeigen
    rFalsch = region;
    rRichtig = rZiel;
    if (knopf) knopf.classList.add('falsch');
    if (richtigerKnopf) richtigerKnopf.classList.add('richtig');
    knoepfe.forEach(k => k.disabled = true);
    aufgabeBox.className = 'falsch';
    falschKlang();
    const gewaehlt = rAktivitaet === 'hauptstadt' ? rName(rHauptstadt(region)) : rName(region);
    aufgabeBox.innerHTML = '❌ ' + (knopf ? '' : t().dasWar + ' ' + gewaehlt + '.<br>') +
      t().richtigIst + ' <b>' + rRichtigeAntwort() + '</b>';
    regionenNeuFaerben();
    rHauptstadtPunktZeigen();
    spaeter(rNaechsteRunde, 3000);
  }
}

// Nach der Antwort die Lösung als Punkt zeigen:
// Hauptstädte-Spiel → gelber Punkt der Hauptstadt, "Wo liegt die Stadt?" → Punkt der gefragten Stadt
function rHauptstadtPunktZeigen() {
  let stadt = null;
  if (rAktivitaet === 'hauptstadt') stadt = rHauptstadt(rZiel);
  if (rAktivitaet === 'stadt') stadt = rZielStadt;
  if (!stadt) return;
  globus.pointsData([{ lat: stadt.lat, lng: stadt.lng, farbe: FARBE_STADT, radius: rPunktGroesse * 2 }]);
}

// "Zeig es mir" im Profi-Modus
function rAufgeben() {
  warten = true;
  aufgebenKnopfZeigen(false);
  aufgegeben++;
  rRichtig = rZiel;
  const knoepfe = [...antwortenBox.querySelectorAll('.antwort-knopf')];
  knoepfe.forEach(k => { if (k.region === rZiel) k.classList.add('richtig'); k.disabled = true; });
  aufgabeBox.className = 'falsch';
  aufgabeBox.innerHTML = t().aufgegebenMeldung + '<br>' + t().richtigIst + ' <b>' + rRichtigeAntwort() + '</b>';
  regionenNeuFaerben();
  rHauptstadtPunktZeigen();
  spaeter(rNaechsteRunde, 3000);
}

// ---------- Klicks vom Globus ----------

function regionFlaecheGeklickt(flaeche) {
  if (!flaeche || !flaeche.properties.REGION) return;
  const r = flaeche.region;
  if (rAktivitaet === 'lernen') { rRegionZeigen(r); return; }
  if (warten || !rKlickErlaubt()) return;
  rPruefen(r, null);
}

function regionPunktGeklickt(punkt) {
  if (rAktivitaet === 'lernen') {
    if (punkt.stadt) rStadtZeigen(punkt.stadt);
    else if (punkt.region) rRegionZeigen(punkt.region);
    return;
  }
  if (punkt.region && !warten && rKlickErlaubt()) rPruefen(punkt.region, null);
}

// ---------- Aufräumen ----------

function regionenAufraeumen() {
  rAktiv = false;
  rNamenWeg();
  globus.polygonsData(alleLaender);
  globus.pointsData([]);
  gruppenTafel.classList.add('versteckt');
  document.getElementById('gt-fakt').style.display = '';
  antwortenBox.classList.add('versteckt');
  rGewaehlt = null; rZiel = null; rZielStadt = null; rRichtig = null; rFalsch = null; rFalscheSet.clear();
}

function regionenBeenden() {
  zumMenue('start');
}
