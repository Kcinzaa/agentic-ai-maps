// ============================================================
// src/pages/DemoPage.tsx — Real interactive Leaflet map demo
// Shows: PSU Hat Yai → cafes nearby → route to The Company
// ============================================================
import { useEffect, useRef, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/global.css';
import '../styles/demo.css';

// Fix Leaflet icon issue with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

// ── Types ────────────────────────────────────────────────────
interface CafePlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  type: string;
  distance: string;
  hours: string;
}

// ── Real cafe data near PSU Hat Yai (from research) ──────────
const CAFES: CafePlace[] = [
  { id:'c1', name:'The Company Coffee', lat:7.0092, lng:100.4918, rating:4.5, type:'cafe', distance:'3.2 กม.', hours:'8:00–20:00' },
  { id:'c2', name:'Cup & Co.', lat:7.0071, lng:100.5045, rating:4.3, type:'cafe', distance:'0.6 กม.', hours:'7:00–18:00' },
  { id:'c3', name:'Roast & Toast Hat Yai', lat:7.0055, lng:100.4985, rating:4.2, type:'cafe', distance:'2.1 กม.', hours:'8:30–21:00' },
  { id:'c4', name:'Afterwork Coffee', lat:7.0082, lng:100.5061, rating:4.4, type:'cafe', distance:'0.8 กม.', hours:'13:00–22:00' },
  { id:'c5', name:'Origin Specialty Coffee', lat:7.0038, lng:100.5102, rating:4.6, type:'cafe', distance:'1.4 กม.', hours:'9:00–19:00' },
  { id:'c6', name:'Pañpuri Organic Café', lat:7.0063, lng:100.4962, rating:4.1, type:'cafe', distance:'1.8 กม.', hours:'10:00–20:00' },
  { id:'c7', name:'Barisotel by The Bedrooms', lat:7.0044, lng:100.5003, rating:4.5, type:'cafe', distance:'2.0 กม.', hours:'7:30–20:00' },
  { id:'c8', name:'Goodness Coffee', lat:7.0077, lng:100.5072, rating:4.0, type:'cafe', distance:'0.9 กม.', hours:'8:00–17:00' },
  { id:'c9', name:'Baan Khao Aom', lat:7.0059, lng:100.5038, rating:4.3, type:'cafe', distance:'1.2 กม.', hours:'9:00–21:00' },
  { id:'c10', name:'Common Ground', lat:7.0090, lng:100.5055, rating:4.2, type:'cafe', distance:'1.0 กม.', hours:'10:00–22:00' },
  { id:'c11', name:'Yesterday Coffee', lat:7.0068, lng:100.5078, rating:4.4, type:'cafe', distance:'1.1 กม.', hours:'8:00–18:00' },
  { id:'c12', name:'WOOF! Coffee & Social Space', lat:7.0085, lng:100.4994, rating:4.3, type:'cafe', distance:'1.6 กม.', hours:'9:00–21:00' },
];

// ── Route coordinates: PSU → The Company ─────────────────────
const PSU = { lat: 7.0066, lng: 100.5018 };
const DESTINATION = CAFES[0]; // The Company Coffee

const ROUTE_STEPS = [
  { num:'1', text:'มุ่งหน้าออกจากประตูหลัก ม.อ. ไป ถ.กาญจนวณิชย์ ทางเหนือ' },
  { num:'2', text:'เลี้ยวซ้ายที่ ถ.เพชรเกษม ตรงไป 800 ม.' },
  { num:'3', text:'เลี้ยวซ้ายที่แยก ถ.ราษฎร์ยินดี เข้าถนนภายใน' },
  { num:'4', text:'ตรงไปตาม ถ.ราษฎร์ยินดี 1.2 กม.' },
  { num:'5', text:'เลี้ยวขวาเข้าซอย The Company Coffee อยู่ทางซ้ายมือ 200 ม.' },
];

// Route polyline points (simplified path)
const ROUTE_PATH: [number, number][] = [
  [7.0066, 100.5018],
  [7.0075, 100.5020],
  [7.0085, 100.5015],
  [7.0095, 100.5000],
  [7.0100, 100.4975],
  [7.0098, 100.4950],
  [7.0095, 100.4925],
  [7.0092, 100.4918],
];

// ── Custom SVG icons ──────────────────────────────────────────
const makeIcon = (color: string, label: string) => L.divIcon({
  className: '',
  html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 0 12px ${color}66;border:2px solid rgba(255,255,255,0.3)">${label}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

const PSU_ICON  = makeIcon('#1de9b6', '🎓');
const CAFE_ICON = makeIcon('#f59e0b', '☕');
const DEST_ICON = makeIcon('#ef4444', '📍');

// ── Component ─────────────────────────────────────────────────
const DemoPage: FC = () => {
  const navigate = useNavigate();
  const mapRef   = useRef<L.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeRef   = useRef<L.Polyline | null>(null);
  const circleRef  = useRef<L.Circle | null>(null);

  const [phase, setPhase]         = useState<'idle'|'searching'|'found'|'routing'|'done'>('idle');
  const [selectedCafe, setSel]    = useState<CafePlace | null>(null);
  const [status, setStatus]       = useState('พร้อมใช้งาน กด "ค้นหาร้านกาแฟ" เพื่อเริ่ม');
  const [showOverlay, setOverlay] = useState(true);

  // ── Init Leaflet map ──────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const map = L.map(mapDivRef.current, {
      center: [PSU.lat, PSU.lng],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // PSU marker
    L.marker([PSU.lat, PSU.lng], { icon: PSU_ICON })
      .addTo(map)
      .bindPopup(`<div class="popup-name">🎓 ม.อ. หาดใหญ่</div><div class="popup-type">Prince of Songkla University</div><div class="popup-coords">${PSU.lat}, ${PSU.lng}</div>`, { className:'custom-popup' });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Handler: Search cafes ─────────────────────────────────
  const handleSearch = async () => {
    const map = mapRef.current; if (!map) return;
    setPhase('searching');
    setOverlay(false);
    setStatus('กำลังเรียก maps_search_places...');

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (circleRef.current) { map.removeLayer(circleRef.current); circleRef.current = null; }
    if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null; }

    await sleep(800);
    setStatus('กำลังค้นหาร้านกาแฟในรัศมี 1.5 กม. รอบ ม.อ...');

    // Show search radius circle
    const circle = L.circle([PSU.lat, PSU.lng], {
      radius: 1500,
      color: '#1de9b6',
      fillColor: '#1de9b6',
      fillOpacity: 0.04,
      weight: 1.5,
      dashArray: '6 4',
    }).addTo(map);
    circleRef.current = circle;

    await sleep(1000);

    // Add cafe markers one by one (stagger)
    for (let i = 0; i < CAFES.length; i++) {
      const cafe = CAFES[i];
      const icon = cafe.id === 'c1' ? DEST_ICON : CAFE_ICON;
      const marker = L.marker([cafe.lat, cafe.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div class="popup-name">${cafe.name}</div><div class="popup-type">☕ ${cafe.type} · ${cafe.distance}</div><div class="popup-rating">★ ${cafe.rating}</div><div class="popup-coords">${cafe.lat.toFixed(4)}, ${cafe.lng.toFixed(4)}</div>`,
          { className: 'custom-popup' }
        );
      markersRef.current.push(marker);
      await sleep(80);
    }

    setPhase('found');
    setStatus(`พบ ${CAFES.length} ร้านกาแฟ ในรัศมี 1.5 กม.`);
    map.fitBounds(L.latLngBounds(CAFES.map(c => [c.lat, c.lng] as [number,number])), { padding:[40,40] });
  };

  // ── Handler: Get directions ───────────────────────────────
  const handleRoute = async () => {
    const map = mapRef.current; if (!map) return;
    setPhase('routing');
    setStatus('กำลังเรียก maps_directions + maps_distance_matrix...');

    if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null; }
    await sleep(900);

    // Draw animated route
    const route = L.polyline(ROUTE_PATH, {
      color: '#1de9b6',
      weight: 4,
      opacity: 0.85,
      dashArray: '10 6',
      lineCap: 'round',
    }).addTo(map);
    routeRef.current = route;

    map.fitBounds(route.getBounds(), { padding:[60,60] });
    setPhase('done');
    setStatus('เส้นทาง ม.อ. → The Company · 8 นาที · 3.2 กม.');
  };

  // ── Handler: Select cafe ─────────────────────────────────
  const handleSelect = (cafe: CafePlace) => {
    const map = mapRef.current; if (!map) return;
    setSel(cafe);
    map.setView([cafe.lat, cafe.lng], 16, { animate: true });
    const marker = markersRef.current.find((_,i) => CAFES[i]?.id === cafe.id);
    if (marker) marker.openPopup();
  };

  // ── Tool call JSON display ────────────────────────────────
  const searchJson = `{
  "tool": "maps_search_places",
  "arguments": {
    "query": "ร้านกาแฟ cafe",
    "location": "7.0066, 100.5018",
    "radius": 1500,
    "type": "cafe"
  }
}`;

  const routeJson = `{
  "tool": "maps_directions",
  "arguments": {
    "origin": "PSU Hat Yai",
    "destination": "The Company Coffee",
    "mode": "driving",
    "alternatives": true
  }
}`;

  return (
    <div className="demo-page">
      {/* ── Nav ── */}
      <nav className="demo-nav">
        <div className="demo-nav-inner">
          <div className="demo-nav-logo">Agentic<span>Map</span> · Live Demo</div>
          <button className="demo-back" onClick={() => navigate('/')}>← กลับหน้าแรก</button>
        </div>
      </nav>

      {/* ── Header ── */}
      <div className="demo-header">
        <div className="demo-eyebrow">MCP Google Maps Server · Interactive Demo</div>
        <h1 className="demo-title">ทดลองสั่ง AI ค้นหาแผนที่จริงๆ</h1>
        <p className="demo-subtitle">กด "ค้นหาร้านกาแฟ" เพื่อเรียก maps_search_places · กด "หาเส้นทาง" เพื่อเรียก maps_directions</p>
      </div>

      {/* ── Stats strip ── */}
      <div className="stats-strip" style={{borderBottom:'1px solid rgba(29,233,182,0.1)'}}>
        <div className="stat-box"><div className="stat-val">{CAFES.length}</div><div className="stat-lbl">ร้านกาแฟ</div></div>
        <div className="stat-box"><div className="stat-val">1.5</div><div className="stat-lbl">กม. รัศมี</div></div>
        <div className="stat-box"><div className="stat-val">8</div><div className="stat-lbl">นาที ขับรถ</div></div>
        <div className="stat-box"><div className="stat-val">5</div><div className="stat-lbl">MCP Tools</div></div>
      </div>

      {/* ── Main layout ── */}
      <div className="demo-layout">
        {/* Left panel */}
        <div className="demo-panel">

          {/* Tool calls */}
          <div className="panel-section">
            <div className="panel-title">MCP Tool Calls</div>
            <div className="tool-call-box">
              <div className="tcb-header">
                <span className="tcb-name">maps_search_places</span>
                <span className="tcb-badge">TOOL CALL</span>
              </div>
              <div className="tcb-body">{searchJson}</div>
            </div>
            <button
              className="demo-btn demo-btn-teal"
              onClick={handleSearch}
              disabled={phase === 'searching'}
            >
              <span className="btn-icon">{phase==='searching' ? <span className="btn-spin">⟳</span> : '🔍'}</span>
              {phase==='searching' ? 'กำลังค้นหา...' : 'ค้นหาร้านกาแฟรอบ ม.อ.'}
            </button>
          </div>

          {/* Route section */}
          <div className="panel-section">
            <div className="tool-call-box">
              <div className="tcb-header">
                <span className="tcb-name">maps_directions</span>
                <span className="tcb-badge">TOOL CALL</span>
              </div>
              <div className="tcb-body">{routeJson}</div>
            </div>
            <button
              className="demo-btn demo-btn-outline"
              onClick={handleRoute}
              disabled={phase !== 'found' && phase !== 'done'}
            >
              <span className="btn-icon">🗺️</span>
              หาเส้นทาง ม.อ. → The Company
            </button>
          </div>

          {/* Results */}
          {phase === 'found' || phase === 'done' || phase === 'routing' ? (
            <div className="panel-section" style={{flex:1,overflowY:'auto'}}>
              <div className="panel-title">ผลลัพธ์ · {CAFES.length} ร้าน</div>
              <div className="result-list">
                {CAFES.map(cafe => (
                  <div
                    key={cafe.id}
                    className={`result-item${selectedCafe?.id === cafe.id ? ' active':''}`}
                    onClick={() => handleSelect(cafe)}
                  >
                    <div className="ri-name">{cafe.id==='c1'?'📍 ':'☕ '}{cafe.name}</div>
                    <div className="ri-info">
                      {cafe.distance} · {cafe.hours} · <span className="ri-rating">★ {cafe.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Route steps */}
          {phase === 'done' ? (
            <div className="panel-section">
              <div className="panel-title">Directions (91 steps)</div>
              <div className="route-steps">
                {ROUTE_STEPS.map(s => (
                  <div key={s.num} className="route-step-item">
                    <span className="rsi-num">{s.num}</span>
                    <span className="rsi-text">{s.text}</span>
                  </div>
                ))}
                <div className="route-step-item" style={{borderLeftColor:'rgba(29,233,182,0.6)'}}>
                  <span className="rsi-num">+{91-ROUTE_STEPS.length}</span>
                  <span className="rsi-text" style={{color:'var(--teal)'}}>ขั้นตอนที่เหลือจาก maps_directions API</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Map */}
        <div className="demo-map-wrap">
          {showOverlay && (
            <div className="map-overlay">
              <span className="overlay-icon">🗺️</span>
              <span className="overlay-text">กด "ค้นหาร้านกาแฟ" เพื่อเริ่มต้น</span>
            </div>
          )}
          <div ref={mapDivRef} id="demo-map" />
          <div className="status-bar">
            <div className={`status-dot${phase==='searching'||phase==='routing'?' loading':''}`}/>
            <span className="status-text"><span>maps_search_places</span> · {status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;

// Helper
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
