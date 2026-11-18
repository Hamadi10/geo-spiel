// =====================================================
//  MEHRSPIELER – mehrere Spieler am selben Gerät, abwechselnd
//  2 Spieler (1 gegen 1), 3 oder 4 Spieler (jeder gegen jeden), 4 Spieler (2 gegen 2)
//  Funktioniert mit allen Quiz-Spielen. Zeitlimit wählbar.
// =====================================================

const MP_FARBEN = ['#2b8cff', '#ff4d4d', '#2ecc71', '#ffd400'];   // blau, rot, grün, gelb
const MP_FARB_IDS = ['blau', 'rot', 'gruen', 'gelb'];
const QUIZ_SPIELE = ['finden', 'erkennen', 'flagge', 'flaggeMC', 'flaggeKarte', 'formMC', 'worldle', 'hauptstadt', 'meereFinden', 'regionen'];

const mp = {
  an: false,              // Mehrspieler gewählt?
  anzahl: 2,              // 2, 3 oder 4 Spieler
  teams: false,           // nur bei 4 Spielern: 2 gegen 2
  namen: ['', '', '', ''],
  fragenProSpieler: 5,
  zeitlimit: 0,           // 0 = kein Zeitlimit, sonst Sekunden
  // während des Spiels:
  spieler: [],            // { name, farbe, team, punkte }
  teilnehmer: [],         // wer in dieser Runde mitspielt (Index in spieler) – beim Stechen nur die Gleichen
  zug: -1,                // wie viele Züge schon gespielt
  punkteVorher: 0,        // Punktestand vor dem aktuellen Zug
  gespeicherterModus: 'lernen',
  neustart: null,         // Funktion, um dasselbe Spiel nochmal zu starten (Stechen)
  laeuft: false,
  stechen: false,         // läuft gerade ein Stechen?
  timer: null,
  zeitEnde: 0
};

function mpAktiv() { return mp.an && QUIZ_SPIELE.includes(spiel); }   // Mehrspieler nur bei Quiz-Spielen
function mpLaeuft() { return mp.an && mp.laeuft; }

// ---------- Einstellungen im Startfenster ----------

function mpEinstellungenBauen() {
  const box = document.getElementById('mp-einstellungen');
  const wahl = document.getElementById('mp-wahl');
  wahl.innerHTML = '';
  [[false, t().alleine], [true, t().mehrspieler]].forEach(([an, text]) => {
    const knopf = document.createElement('button');
    knopf.className = 'modus-knopf mp-knopf' + (mp.an === an ? ' aktiv' : '');
    knopf.textContent = text;
    knopf.addEventListener('click', () => { mp.an = an; startfensterTexte(); });
    wahl.appendChild(knopf);
  });

  box.classList.toggle('versteckt', !mp.an);
  if (!mp.an) return;
  box.innerHTML = '';

  // Anzahl Spieler
  box.appendChild(mpZeile(t().anzahlSpieler, [2, 3, 4].map(n => [n, n + ' 👤', mp.anzahl === n, () => {
    mp.anzahl = n; if (n !== 4) mp.teams = false; mpEinstellungenBauen();
  }])));

  // Bei 4 Spielern: jeder gegen jeden oder 2 gegen 2
  if (mp.anzahl === 4) {
    box.appendChild(mpZeile('', [
      [false, t().jederGegenJeden, !mp.teams, () => { mp.teams = false; mpEinstellungenBauen(); }],
      [true, t().zweiGegenZwei, mp.teams, () => { mp.teams = true; mpEinstellungenBauen(); }]
    ]));
  }

  // Namen eingeben (mit Farbe)
  const namenBox = document.createElement('div');
  namenBox.className = 'mp-namen';
  for (let i = 0; i < mp.anzahl; i++) {
    const feld = document.createElement('input');
    feld.type = 'text';
    feld.maxLength = 14;
    feld.placeholder = t().spielerStandard(i + 1);
    feld.value = mp.namen[i];
    feld.style.borderColor = mpSpielerFarbe(i);
    feld.addEventListener('input', () => { mp.namen[i] = feld.value.trim(); });
    namenBox.appendChild(feld);
  }
  box.appendChild(mpTitel(mp.teams ? t().namenTeams : t().namen));
  box.appendChild(namenBox);

  // Fragen pro Spieler
  box.appendChild(mpZeile(t().fragenProSpieler, [3, 5, 10].map(n => [n, String(n), mp.fragenProSpieler === n, () => {
    mp.fragenProSpieler = n; mpEinstellungenBauen();
  }])));

  // Zeitlimit
  box.appendChild(mpZeile('⏱️ ' + t().zeitlimit, [0, 10, 15, 30].map(s => [s, s ? t().sekunden(s) : t().zeitAus, mp.zeitlimit === s, () => {
    mp.zeitlimit = s; mpEinstellungenBauen();
  }])));
}

function mpTitel(text) {
  const el = document.createElement('div');
  el.className = 'gruppen-kategorie';
  el.textContent = text;
  return el;
}

// Eine Zeile mit Titel und Auswahl-Knöpfen
function mpZeile(titel, optionen) {
  const zeile = document.createElement('div');
  if (titel) zeile.appendChild(mpTitel(titel));
  const knoepfe = document.createElement('div');
  knoepfe.className = 'gruppen-knoepfe';
  optionen.forEach(([wert, text, aktiv, aktion]) => {
    const knopf = document.createElement('button');
    knopf.className = 'gruppe-knopf mp-option' + (aktiv ? ' aktiv' : '');
    knopf.textContent = text;
    knopf.addEventListener('click', aktion);
    knoepfe.appendChild(knopf);
  });
  zeile.appendChild(knoepfe);
  return zeile;
}

// Farbe eines Spielers (bei 2 gegen 2: Spieler 1+3 blau, Spieler 2+4 rot)
function mpSpielerFarbe(i) {
  if (mp.teams) return MP_FARBEN[i % 2];
  return MP_FARBEN[i];
}

// ---------- Spiel starten ----------

// Wird von den Spielen beim Start aufgerufen: merkt sich, wie man das Spiel neu startet
function mpSpielBeginnt(neustartFunktion) {
  if (!mp.an) {   // alleine spielen: evtl. übrig gebliebenes Mehrspieler-Spiel aufräumen
    if (mp.laeuft) mpAufraeumen();
    return;
  }
  mp.neustart = neustartFunktion;
  if (mp.laeuft && mp.stechen) return;   // Stechen: Spieler und Punkte behalten
  if (mp.laeuft) modus = mp.gespeicherterModus;   // altes, nicht beendetes Spiel (z. B. Gleichstand ohne Stechen)
  mp.stechen = false;

  mp.spieler = [];
  for (let i = 0; i < mp.anzahl; i++) {
    mp.spieler.push({
      name: mp.namen[i] || t().spielerStandard(i + 1),
      farbe: mpSpielerFarbe(i),
      team: mp.teams ? i % 2 : i,
      punkte: 0
    });
  }
  // Reihenfolge: bei 2 gegen 2 abwechselnd Team A, Team B (Spieler 1, 2, 3, 4 sind schon so verteilt)
  mp.teilnehmer = mp.spieler.map((s, i) => i);
  mp.gespeicherterModus = modus;
  modus = 'lernen';        // jeder hat einen Versuch pro Frage
  mp.laeuft = true;
  mp.zug = -1;
  leiste.classList.add('versteckt');
  document.getElementById('mp-leiste').classList.remove('versteckt');
}

// Wie viele Fragen hat dieses Spiel? (jeder Spieler gleich viele)
function mpRunden(poolGroesse) {
  const n = mp.teilnehmer.length;
  const wunsch = mp.stechen ? 1 : mp.fragenProSpieler;
  const proSpieler = Math.max(1, Math.min(wunsch, Math.floor(poolGroesse / n)));
  return proSpieler * n;
}

// Wer ist gerade dran?
function mpAktuellerSpieler() {
  return mp.spieler[mp.teilnehmer[mp.zug % mp.teilnehmer.length]];
}

// ---------- Züge ----------

// Am Anfang jeder neuen Runde: Punkt des letzten Zugs gutschreiben
function mpZugBeendet() {
  if (!mpLaeuft()) return;
  mpTimerStopp();
  if (mp.zug >= 0) {
    const gewonnen = punkte - mp.punkteVorher;
    if (gewonnen > 0) mpAktuellerSpieler().punkte += gewonnen;
  }
}

// Nach dem Stellen der Frage: nächster Spieler ist dran
function mpZugStart() {
  if (!mpLaeuft()) return;
  mp.zug++;
  mp.punkteVorher = punkte;
  const s = mpAktuellerSpieler();
  mpLeisteZeigen();
  vorlesen(t().istDran(s.name) + ' ' + ohneHtml(aufgabeBox.innerHTML));
  if (mp.zeitlimit) mpTimerStart();
}

// Obere Leiste: wer ist dran, Punkte aller Spieler
function mpLeisteZeigen() {
  if (mp.zug < 0) return;   // erster Zug hat noch nicht begonnen
  const s = mpAktuellerSpieler();
  document.getElementById('mp-dran').innerHTML =
    '<span class="mp-punkt" style="background:' + s.farbe + '"></span> ' + t().istDran(s.name);
  document.getElementById('mp-runde').textContent = t().runde(rundenNummer, spielLaender.length);

  const tafel = document.getElementById('mp-tafel');
  tafel.innerHTML = '';
  if (mp.teams) {
    [0, 1].forEach(team => {
      const summe = mp.spieler.filter(x => x.team === team).reduce((a, x) => a + x.punkte, 0);
      tafel.appendChild(mpChip(t().team(team), MP_FARBEN[team], summe, false));
    });
  }
  mp.spieler.forEach((x, i) => {
    if (!mp.teilnehmer.includes(i)) return;
    tafel.appendChild(mpChip(x.name, x.farbe, x.punkte, x === s));
  });
}

function mpChip(name, farbe, punkte, aktiv) {
  const chip = document.createElement('span');
  chip.className = 'mp-chip' + (aktiv ? ' aktiv' : '');
  chip.style.borderColor = farbe;
  chip.innerHTML = '<span class="mp-punkt" style="background:' + farbe + '"></span>' + name + ' <b>' + punkte + '</b>';
  return chip;
}

// ---------- Zeitlimit ----------

function mpTimerStart() {
  mpTimerStopp();
  mp.zeitEnde = performance.now() + mp.zeitlimit * 1000;
  const balken = document.getElementById('mp-zeit');
  balken.classList.remove('versteckt');
  mp.timer = setInterval(() => {
    const rest = mp.zeitEnde - performance.now();
    if (warten) { mpTimerStopp(); return; }   // schon geantwortet
    balken.style.width = Math.max(0, rest / (mp.zeitlimit * 1000) * 100) + '%';
    balken.classList.toggle('knapp', rest < 4000);
    document.getElementById('mp-sekunden').textContent = '⏱️ ' + Math.ceil(Math.max(0, rest) / 1000);
    if (rest <= 0) {
      mpTimerStopp();
      // Zeit abgelaufen → wie "Zeig es mir": richtige Antwort zeigen, kein Punkt
      const merke = modus;
      modus = 'profi';           // damit "Aufgeben" erlaubt ist
      aufgeben();
      modus = merke;
      aufgegeben--;              // zählt nicht als Aufgeben
      aufgabeBox.innerHTML = aufgabeBox.innerHTML.replace(t().aufgegebenMeldung, '⏰ ' + t().zeitAbgelaufen);
      falschKlang();
    }
  }, 100);
}

function mpTimerStopp() {
  clearInterval(mp.timer);
  mp.timer = null;
  document.getElementById('mp-zeit').classList.add('versteckt');
  const sek = document.getElementById('mp-sekunden');
  if (sek) sek.textContent = '';
}

// ---------- Ergebnis ----------

function mpErgebnis() {
  mpTimerStopp();
  mp.stechen = false;
  document.getElementById('mp-leiste').classList.add('versteckt');

  // Rangliste (Spieler oder Teams)
  let eintraege;
  if (mp.teams) {
    eintraege = [0, 1].map(team => ({
      name: t().team(team), farbe: MP_FARBEN[team],
      punkte: mp.spieler.filter(x => x.team === team).reduce((a, x) => a + x.punkte, 0),
      mitglieder: mp.spieler.filter(x => x.team === team).map(x => x.name + ' (' + x.punkte + ')').join(', '),
      ids: mp.spieler.map((x, i) => i).filter(i => mp.spieler[i].team === team)
    }));
  } else {
    eintraege = mp.spieler.map((x, i) => ({ name: x.name, farbe: x.farbe, punkte: x.punkte, ids: [i] }));
  }
  eintraege.sort((a, b) => b.punkte - a.punkte);
  const best = eintraege[0].punkte;
  const sieger = eintraege.filter(e => e.punkte === best);

  // Titel
  if (sieger.length === 1) endeTitel.textContent = t().gewinnt(sieger[0].name);
  else endeTitel.textContent = t().unentschieden;

  // Siegertreppchen
  const medaillen = ['🥇', '🥈', '🥉', '4.'];
  let platz = 0, vorher = null;
  let html = '<div class="mp-ergebnis">';
  eintraege.forEach((e, i) => {
    if (e.punkte !== vorher) platz = i;
    vorher = e.punkte;
    html += '<div class="mp-rang"><span class="mp-medaille">' + medaillen[platz] + '</span>' +
      '<span class="mp-punkt" style="background:' + e.farbe + '"></span>' +
      '<span class="mp-rang-name">' + e.name + (e.mitglieder ? '<br><small>' + e.mitglieder + '</small>' : '') + '</span>' +
      '<b>' + e.punkte + '</b></div>';
  });
  html += '</div>';

  // Bei Gleichstand: Stechen anbieten
  if (sieger.length > 1 && mp.neustart) {
    html += '<p>' + t().stechenInfo + '</p><button id="mp-stechen" class="gruppe-knopf mp-option aktiv">' + t().stechen + '</button>';
  }
  endeText.innerHTML = html;

  const stechenKnopf = document.getElementById('mp-stechen');
  if (stechenKnopf) {
    const gleich = sieger.flatMap(e => e.ids);
    stechenKnopf.addEventListener('click', () => mpStechen(gleich));
    vorlesen(t().unentschieden);
  } else {
    vorlesen(endeTitel.textContent.replace('🏆', ''));
    mpBeenden();
  }
  mpFanfare();
}

// Stechen: nur die Gleichstehenden bekommen je noch eine Frage
function mpStechen(ids) {
  quizAktiv = true;
  mp.teilnehmer = mp.teams ? mp.spieler.map((x, i) => i) : ids;   // bei Teams spielen beide Teams weiter
  mp.stechen = true;
  mp.zug = -1;
  document.getElementById('mp-leiste').classList.remove('versteckt');
  mp.neustart();
}

// Spiel vorbei: Einstellungen bleiben, Zustand zurücksetzen
function mpBeenden() {
  mp.laeuft = false;
  modus = mp.gespeicherterModus;
  mp.teilnehmer = [];
  leiste.classList.remove('versteckt');
}

// Mehrspieler-Spiel abbrechen (z. B. wenn man auf "Alleine" umschaltet)
function mpAufraeumen() {
  mpTimerStopp();
  document.getElementById('mp-leiste').classList.add('versteckt');
  mp.stechen = false;
  mpBeenden();
}

// Kleine Siegesmelodie
function mpFanfare() {
  klangSpielen([
    { frequenz: 523.25, start: 0.00, dauer: 0.25 },
    { frequenz: 659.25, start: 0.15, dauer: 0.25 },
    { frequenz: 783.99, start: 0.30, dauer: 0.25 },
    { frequenz: 1046.5, start: 0.45, dauer: 0.70 }
  ], 'triangle', 0.15);
}
