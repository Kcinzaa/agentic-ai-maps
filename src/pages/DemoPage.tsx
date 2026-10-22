// @ts-nocheck
// ============================================================
// src/pages/DemoPage.tsx — Real Google Maps API interactive demo
// Loads Maps JS API dynamically, uses Places + Directions API
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/demo.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const PSU     = { lat: 7.0066, lng: 100.5018 };
const sleep   = (ms) => new Promise(r => setTimeout(r, ms));

// ── Load Google Maps script dynamically ──────────────────────
let mapsLoaded = false;
let mapsLoadCallbacks = [];

function loadGoogleMaps(): Promise<void> {
  if (mapsLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    mapsLoadCallbacks.push(resolve);
    if (document.getElementById('gmap-script')) return;
    const s = document.createElement('script');
    s.id  = 'gmap-script';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=__gmapsReady`;
    s.async = true;
    s.defer = true;
    window.__gmapsReady = () => {
      mapsLoaded = true;
      mapsLoadCallbacks.forEach(cb => cb());
      mapsLoadCallbacks = [];
    };
    document.head.appendChild(s);
  });
}

const DARK_STYLE = [
  { elementType: 'geometry',           stylers: [{ color: '#0d1f35' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#8ec4d8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1628' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1a3150' }] },
  { featureType: 'poi',            stylers: [{ visibility: 'off' }] },
  { featureType: 'road',           elementType: 'geometry', stylers: [{ color: '#1a3555' }] },
  { featureType: 'road',           elementType: 'labels.text.fill', stylers: [{ color: '#7ab5cf' }] },
  { featureType: 'road.highway',   elementType: 'geometry', stylers: [{ color: '#1e4778' }] },
  { featureType: 'transit',        stylers: [{ visibility: 'off' }] },
  { featureType: 'water',          elementType: 'geometry', stylers: [{ color: '#050f1e' }] },
  { featureType: 'water',          elementType: 'labels.text.fill', stylers: [{ color: '#4b8cb8' }] },
];

const SEARCH_JSON = `{
  "tool": "maps_search_places",
  "arguments": {
    "query": "ร้านกาแฟ cafe",
    "location": "7.0066, 100.5018",
    "radius": 1500,
    "type": "cafe"
  }
}`;

const ROUTE_JSON = `{
  "tool": "maps_directions",
  "arguments": {
    "origin": "PSU Hat Yai",
    "destination": "ร้านแรกในผลค้นหา",
    "mode": "driving"
  }
}`;

export default function DemoPage() {
  const navigate     = useNavigate();
  const mapDivRef    = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);
  const circleRef    = useRef(null);
  const dirRef       = useRef(null);
  const infoWinRef   = useRef(null);

  const [phase, setPhase]        = useState('idle');
  const [cafes, setCafes]        = useState([]);
  const [selected, setSel]       = useState(null);
  const [status, setStatus]      = useState('พร้อมใช้งาน · กด "ค้นหาร้านกาแฟ" เพื่อเริ่ม');
  const [dur, setDur]            = useState('');
  const [dist, setDist]          = useState('');
  const [overlay, setOverlay]    = useState(true);

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!mapDivRef.current || mapRef.current) return;
      const gm   = window.google.maps;
      const map  = new gm.Map(mapDivRef.current, {
        center: PSU, zoom: 15, styles: DARK_STYLE,
        zoomControl: true, mapTypeControl: false,
        streetViewControl: false, fullscreenControl: true,
      });
      // PSU marker
      new gm.Marker({
        position: PSU, map,
        title: '🎓 ม.อ. หาดใหญ่',
        icon: { path: gm.SymbolPath.CIRCLE, scale: 14, fillColor: '#1de9b6', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2.5 },
      });
      infoWinRef.current = new gm.InfoWindow();
      mapRef.current     = map;
    });
  }, []);

  const handleSearch = async () => {
    const map = mapRef.current;
    if (!map) return;
    const gm = window.google.maps;
    setPhase('searching');
    setOverlay(false);
    setStatus('กำลังเรียก maps_search_places...');
    setCafes([]);
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    circleRef.current?.setMap(null);
    dirRef.current?.setMap(null);
    await sleep(600);
    setStatus('ค้นหาร้านกาแฟรัศมี 1.5 กม. รอบ ม.อ. หาดใหญ่...');

    circleRef.current = new gm.Circle({
      center: PSU, radius: 1500, map,
      strokeColor: '#1de9b6', strokeOpacity: 0.6, strokeWeight: 1.5,
      fillColor: '#1de9b6', fillOpacity: 0.04,
    });

    await sleep(400);

    new gm.places.PlacesService(map).nearbySearch(
      { location: PSU, radius: 1500, type: 'cafe' },
      (results, s) => {
        if (s !== gm.places.PlacesServiceStatus.OK || !results) {
          setStatus('⚠ Places API: ' + s); setPhase('found'); return;
        }
        const list = results.slice(0, 12).map((p, i) => ({
          id: p.place_id ?? `p${i}`,
          name: p.name ?? 'ไม่ทราบชื่อ',
          lat: p.geometry?.location?.lat() ?? 0,
          lng: p.geometry?.location?.lng() ?? 0,
          rating: p.rating, vicinity: p.vicinity,
          isOpen: p.opening_hours?.isOpen(),
        }));
        setCafes(list);
        list.forEach((cafe, i) => {
          setTimeout(() => {
            const mk = new gm.Marker({
              position: { lat: cafe.lat, lng: cafe.lng }, map,
              title: cafe.name, animation: gm.Animation.DROP,
              icon: {
                path: gm.SymbolPath.CIRCLE, scale: 11,
                fillColor: i === 0 ? '#ef4444' : '#f59e0b',
                fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2,
              },
            });
            mk.addListener('click', () => {
              infoWinRef.current?.setContent(
                `<div style="font-family:'Sarabun',sans-serif;padding:4px;min-width:150px">
                   <b style="font-size:.9rem">${cafe.name}</b>
                   <div style="color:#1de9b6;font-size:.72rem;font-family:monospace;margin-top:2px">☕ Cafe</div>
                   ${cafe.rating ? `<div style="color:#d97706;font-size:.78rem;margin-top:4px">★ ${cafe.rating}</div>` : ''}
                   ${cafe.vicinity ? `<div style="color:#6b7280;font-size:.7rem;margin-top:4px">${cafe.vicinity}</div>` : ''}
                 </div>`
              );
              infoWinRef.current?.open(map, mk);
            });
            markersRef.current.push(mk);
          }, i * 100);
        });
        setPhase('found');
        setStatus(`maps_search_places → พบ ${list.length} ร้านกาแฟ ในรัศมี 1.5 กม.`);
        map.fitBounds(circleRef.current.getBounds());
      }
    );
  };

  const handleRoute = async () => {
    const map = mapRef.current;
    if (!map || cafes.length === 0) return;
    const gm  = window.google.maps;
    setPhase('routing');
    setStatus('กำลังเรียก maps_directions...');
    dirRef.current?.setMap(null);
    await sleep(700);

    const renderer = new gm.DirectionsRenderer({
      polylineOptions: { strokeColor: '#1de9b6', strokeOpacity: 0.9, strokeWeight: 5 },
    });
    renderer.setMap(map);
    dirRef.current = renderer;

    const dest = cafes[0];
    new gm.DirectionsService().route(
      { origin: PSU, destination: { lat: dest.lat, lng: dest.lng }, travelMode: gm.TravelMode.DRIVING, provideRouteAlternatives: true },
      (result, s) => {
        if (s === gm.DirectionsStatus.OK) {
          renderer.setDirections(result);
          const leg = result.routes[0]?.legs[0];
          setDur(leg?.duration?.text ?? ''); setDist(leg?.distance?.text ?? '');
          setStatus(`maps_directions → ${dest.name} · ${leg?.duration?.text} · ${leg?.distance?.text}`);
        } else {
          setStatus('⚠ Directions error: ' + s);
        }
        setPhase('done');
      }
    );
  };

  const handleSelect = (cafe) => {
    const map = mapRef.current; if (!map) return;
    const gm  = window.google.maps;
    setSel(cafe);
    map.setCenter({ lat: cafe.lat, lng: cafe.lng }); map.setZoom(17);
    const idx = cafes.findIndex(c => c.id === cafe.id);
    const mk  = markersRef.current[idx];
    if (mk) gm.event.trigger(mk, 'click');
  };

  return (
    <div className="demo-page">
      <nav className="demo-nav">
        <div className="demo-nav-inner">
          <div className="demo-nav-logo">Agentic<span>Map</span> · Live Demo</div>
          <button className="demo-back" onClick={() => navigate('/')}>← กลับหน้าแรก</button>
        </div>
      </nav>

      <div className="demo-header">
        <div className="demo-eyebrow">Google Maps JavaScript API · Places API · Directions API</div>
        <h1 className="demo-title">ทดลองสั่ง AI ค้นหาแผนที่จริงๆ</h1>
        <p className="demo-subtitle">
          กด "ค้นหาร้านกาแฟ" → เรียก <code style={{fontFamily:'var(--font-mono)',color:'var(--teal)'}}>PlacesService.nearbySearch()</code> จริง ·
          กด "หาเส้นทาง" → เรียก <code style={{fontFamily:'var(--font-mono)',color:'var(--teal)'}}>DirectionsService.route()</code> จริง
        </p>
      </div>

      <div className="stats-strip" style={{borderBottom:'1px solid rgba(29,233,182,0.1)'}}>
        <div className="stat-box"><div className="stat-val">{cafes.length || '—'}</div><div className="stat-lbl">ร้านกาแฟ</div></div>
        <div className="stat-box"><div className="stat-val">1.5</div><div className="stat-lbl">กม. รัศมี</div></div>
        <div className="stat-box"><div className="stat-val">{dur || '—'}</div><div className="stat-lbl">เวลาขับรถ</div></div>
        <div className="stat-box"><div className="stat-val">{dist || '—'}</div><div className="stat-lbl">ระยะทาง</div></div>
      </div>

      <div className="demo-layout">
        <div className="demo-panel">
          <div className="panel-section">
            <div className="panel-title">MCP Tool Call · Places API</div>
            <div className="tool-call-box">
              <div className="tcb-header">
                <span className="tcb-name">maps_search_places</span>
                <span className="tcb-badge">TOOL CALL</span>
              </div>
              <div className="tcb-body">{SEARCH_JSON}</div>
            </div>
            <button className="demo-btn demo-btn-teal" onClick={handleSearch} disabled={phase === 'searching'}>
              <span>{phase === 'searching' ? '⟳' : '🔍'}</span>
              {phase === 'searching' ? 'กำลังค้นหาจาก Places API...' : 'ค้นหาร้านกาแฟรอบ ม.อ.'}
            </button>
          </div>

          <div className="panel-section">
            <div className="panel-title">MCP Tool Call · Directions API</div>
            <div className="tool-call-box">
              <div className="tcb-header">
                <span className="tcb-name">maps_directions</span>
                <span className="tcb-badge">TOOL CALL</span>
              </div>
              <div className="tcb-body">{ROUTE_JSON}</div>
            </div>
            <button className="demo-btn demo-btn-outline" onClick={handleRoute} disabled={phase !== 'found' && phase !== 'done'}>
              <span>🗺️</span>
              หาเส้นทาง ม.อ. → ร้านแรกในผล
            </button>
          </div>

          {cafes.length > 0 && (
            <div className="panel-section" style={{flex:1,overflowY:'auto'}}>
              <div className="panel-title">ผลลัพธ์ Places API · {cafes.length} ร้าน</div>
              <div className="result-list">
                {cafes.map(c => (
                  <div key={c.id} className={`result-item${selected?.id === c.id ? ' active' : ''}`} onClick={() => handleSelect(c)}>
                    <div className="ri-name">☕ {c.name}</div>
                    <div className="ri-info">
                      {c.vicinity?.split(',')[0]}
                      {c.rating ? <span className="ri-rating"> · ★ {c.rating}</span> : null}
                      {c.isOpen !== undefined && (
                        <span style={{color: c.isOpen ? '#34d399' : '#f87171', marginLeft:'4px'}}>
                          · {c.isOpen ? 'เปิดอยู่' : 'ปิดแล้ว'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'done' && dur && (
            <div className="panel-section">
              <div className="panel-title">ผลลัพธ์ Directions API</div>
              <div style={{display:'flex',gap:'0.75rem',margin:'0.5rem 0'}}>
                <div className="stat-box" style={{background:'rgba(29,233,182,0.06)',border:'1px solid rgba(29,233,182,0.15)',borderRadius:'8px',flex:1}}>
                  <div className="stat-val">{dur}</div><div className="stat-lbl">ขับรถ</div>
                </div>
                <div className="stat-box" style={{background:'rgba(29,233,182,0.06)',border:'1px solid rgba(29,233,182,0.15)',borderRadius:'8px',flex:1}}>
                  <div className="stat-val">{dist}</div><div className="stat-lbl">ระยะทาง</div>
                </div>
              </div>
              <p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',fontFamily:'var(--font-mono)',marginTop:'0.5rem'}}>
                เส้นทางสีเขียวแสดงบนแผนที่ทางขวา →
              </p>
            </div>
          )}
        </div>

        <div className="demo-map-wrap">
          {overlay && (
            <div className="map-overlay">
              <span className="overlay-icon">🗺️</span>
              <span className="overlay-text">Google Maps · กำลังโหลด...</span>
            </div>
          )}
          <div ref={mapDivRef} id="demo-map" onMouseEnter={() => setOverlay(false)} />
          <div className="status-bar">
            <div className={`status-dot${phase === 'searching' || phase === 'routing' ? ' loading' : ''}`} />
            <span className="status-text"><span>Google Maps API</span> · {status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
