// ===================================================================
// Service Worker: speichert das Spiel auf dem Gerät,
// damit es wie eine App startet und auch ohne Internet läuft.
// Bei jeder neuen Version die Nummer erhöhen → alte Speicher werden gelöscht.
// ===================================================================

const VERSION = 'geo-v36';

// Diese Dateien werden sofort beim Installieren gespeichert
const GRUNDDATEIEN = [
  './', 'index.html', 'style.css?v=36',
  'gruppen.js?v=36', 'meere.js?v=36', 'sprachen.js?v=36', 'mehrspieler.js?v=36',
  'spiel.js?v=36', 'regionen.js?v=36', 'worldle.js?v=36',
  'laender.geojson', 'meere.geojson', 'hauptstaedte.json', 'laenderinfo.json', 'worldle.json',
  'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
    'flaggen/ad.svg',   'flaggen/ae.svg',   'flaggen/af.svg',   'flaggen/ag.svg',   'flaggen/al.svg',   'flaggen/am.svg',   'flaggen/ao.svg',   'flaggen/ar.svg',   'flaggen/at.svg',   'flaggen/au.svg',   'flaggen/az.svg',   'flaggen/ba.svg',   'flaggen/bb.svg',   'flaggen/bd.svg',   'flaggen/be.svg',   'flaggen/bf.svg',   'flaggen/bg.svg',   'flaggen/bh.svg',   'flaggen/bi.svg',   'flaggen/bj.svg',   'flaggen/bn.svg',   'flaggen/bo.svg',   'flaggen/br.svg',   'flaggen/bs.svg',   'flaggen/bt.svg',   'flaggen/bw.svg',   'flaggen/by.svg',   'flaggen/bz.svg',   'flaggen/ca.svg',   'flaggen/cd.svg',   'flaggen/cf.svg',   'flaggen/cg.svg',   'flaggen/ch.svg',   'flaggen/ci.svg',   'flaggen/cl.svg',   'flaggen/cm.svg',   'flaggen/cn.svg',   'flaggen/co.svg',   'flaggen/cr.svg',   'flaggen/cu.svg',   'flaggen/cv.svg',   'flaggen/cy.svg',   'flaggen/cz.svg',   'flaggen/de.svg',   'flaggen/dj.svg',   'flaggen/dk.svg',   'flaggen/dm.svg',   'flaggen/do.svg',   'flaggen/dz.svg',   'flaggen/ec.svg',   'flaggen/ee.svg',   'flaggen/eg.svg',   'flaggen/eh.svg',   'flaggen/er.svg',   'flaggen/es.svg',   'flaggen/et.svg',   'flaggen/fi.svg',   'flaggen/fj.svg',   'flaggen/fm.svg',   'flaggen/fr.svg',   'flaggen/ga.svg',   'flaggen/gb.svg',   'flaggen/gd.svg',   'flaggen/ge.svg',   'flaggen/gh.svg',   'flaggen/gl.svg',   'flaggen/gm.svg',   'flaggen/gn.svg',   'flaggen/gq.svg',   'flaggen/gr.svg',   'flaggen/gt.svg',   'flaggen/gw.svg',   'flaggen/gy.svg',   'flaggen/hn.svg',   'flaggen/hr.svg',   'flaggen/ht.svg',   'flaggen/hu.svg',   'flaggen/id.svg',   'flaggen/ie.svg',   'flaggen/il.svg',   'flaggen/in.svg',   'flaggen/iq.svg',   'flaggen/ir.svg',   'flaggen/is.svg',   'flaggen/it.svg',   'flaggen/jm.svg',   'flaggen/jo.svg',   'flaggen/jp.svg',   'flaggen/ke.svg',   'flaggen/kg.svg',   'flaggen/kh.svg',   'flaggen/ki.svg',   'flaggen/km.svg',   'flaggen/kn.svg',   'flaggen/kp.svg',   'flaggen/kr.svg',   'flaggen/kw.svg',   'flaggen/kz.svg',   'flaggen/la.svg',   'flaggen/lb.svg',   'flaggen/lc.svg',   'flaggen/li.svg',   'flaggen/lk.svg',   'flaggen/lr.svg',   'flaggen/ls.svg',   'flaggen/lt.svg',   'flaggen/lu.svg',   'flaggen/lv.svg',   'flaggen/ly.svg',   'flaggen/ma.svg',   'flaggen/mc.svg',   'flaggen/md.svg',   'flaggen/me.svg',   'flaggen/mg.svg',   'flaggen/mh.svg',   'flaggen/mk.svg',   'flaggen/ml.svg',   'flaggen/mm.svg',   'flaggen/mn.svg',   'flaggen/mr.svg',   'flaggen/mt.svg',   'flaggen/mu.svg',   'flaggen/mv.svg',   'flaggen/mw.svg',   'flaggen/mx.svg',   'flaggen/my.svg',   'flaggen/mz.svg',   'flaggen/na.svg',   'flaggen/ne.svg',   'flaggen/ng.svg',   'flaggen/ni.svg',   'flaggen/nl.svg',   'flaggen/no.svg',   'flaggen/np.svg',   'flaggen/nr.svg',   'flaggen/nz.svg',   'flaggen/om.svg',   'flaggen/pa.svg',   'flaggen/pe.svg',   'flaggen/pg.svg',   'flaggen/ph.svg',   'flaggen/pk.svg',   'flaggen/pl.svg',   'flaggen/ps.svg',   'flaggen/pt.svg',   'flaggen/pw.svg',   'flaggen/py.svg',   'flaggen/qa.svg',   'flaggen/ro.svg',   'flaggen/rs.svg',   'flaggen/ru.svg',   'flaggen/rw.svg',   'flaggen/sa.svg',   'flaggen/sb.svg',   'flaggen/sc.svg',   'flaggen/sd.svg',   'flaggen/se.svg',   'flaggen/sg.svg',   'flaggen/si.svg',   'flaggen/sk.svg',   'flaggen/sl.svg',   'flaggen/sm.svg',   'flaggen/sn.svg',   'flaggen/so.svg',   'flaggen/sr.svg',   'flaggen/ss.svg',   'flaggen/st.svg',   'flaggen/sv.svg',   'flaggen/sy.svg',   'flaggen/sz.svg',   'flaggen/td.svg',   'flaggen/tg.svg',   'flaggen/th.svg',   'flaggen/tj.svg',   'flaggen/tl.svg',   'flaggen/tm.svg',   'flaggen/tn.svg',   'flaggen/to.svg',   'flaggen/tr.svg',   'flaggen/tt.svg',   'flaggen/tv.svg',   'flaggen/tw.svg',   'flaggen/tz.svg',   'flaggen/ua.svg',   'flaggen/ug.svg',   'flaggen/us.svg',   'flaggen/uy.svg',   'flaggen/uz.svg',   'flaggen/va.svg',   'flaggen/vc.svg',   'flaggen/ve.svg',   'flaggen/vn.svg',   'flaggen/vu.svg',   'flaggen/ws.svg',   'flaggen/xk.svg',   'flaggen/ye.svg',   'flaggen/za.svg',   'flaggen/zm.svg',   'flaggen/zw.svg', 
];

// Installieren: Grunddateien speichern
self.addEventListener('install', ereignis => {
  ereignis.waitUntil(
    caches.open(VERSION).then(speicher => speicher.addAll(GRUNDDATEIEN)).then(() => self.skipWaiting())
  );
});

// Aktivieren: Speicher alter Versionen löschen
self.addEventListener('activate', ereignis => {
  ereignis.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== VERSION).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Laden: die Startseite zuerst aus dem Internet (damit Updates ankommen),
// alles andere zuerst aus dem Speicher (schnell und offline)
self.addEventListener('fetch', ereignis => {
  const anfrage = ereignis.request;
  if (anfrage.method !== 'GET') return;

  if (anfrage.mode === 'navigate') {
    ereignis.respondWith(
      fetch(anfrage)
        .then(antwort => {
          const kopie = antwort.clone();
          caches.open(VERSION).then(speicher => speicher.put('index.html', kopie));
          return antwort;
        })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  ereignis.respondWith(
    caches.match(anfrage).then(gespeichert => {
      if (gespeichert) return gespeichert;
      return fetch(anfrage).then(antwort => {
        // Erfolgreiche Antworten merken (auch Globus-Bibliothek und Erdbild von unpkg.com)
        if (antwort && (antwort.ok || antwort.type === 'opaque')) {
          const kopie = antwort.clone();
          caches.open(VERSION).then(speicher => speicher.put(anfrage, kopie));
        }
        return antwort;
      });
    })
  );
});
