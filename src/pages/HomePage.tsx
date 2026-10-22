// ============================================================
// src/pages/HomePage.tsx — Full storytelling with rich animations
// ============================================================
import { useEffect, useRef, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/home.css';
import '../styles/animations.css';

/* ══════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════ */

/** Canvas particle network */
function useParticleCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    type P = { x: number; y: number; vx: number; vy: number; r: number; phase: number };
    const pts: P[] = [];
    let W = 0, H = 0;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    const init = () => {
      pts.length = 0;
      for (let i = 0; i < 60; i++)
        pts.push({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35, r:Math.random()*1.8+.8, phase:Math.random()*Math.PI*2 });
    };
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if (d<130) { ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(29,233,182,${(1-d/130)*.2})`; ctx.lineWidth=.6; ctx.stroke(); }
      }
      pts.forEach(p => {
        p.phase+=.022;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r+Math.sin(p.phase)*.5,0,Math.PI*2); ctx.fillStyle='rgba(29,233,182,.8)'; ctx.fill();
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W) p.vx*=-1;
        if(p.y<0||p.y>H) p.vy*=-1;
      });
      animId=requestAnimationFrame(draw);
    };
    const ro=new ResizeObserver(resize); ro.observe(canvas);
    resize(); init(); draw();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [ref]);
}

/** Reading progress + parallax + scroll reveal */
function useScrollEffects() {
  useEffect(() => {
    // --- Reading progress bar ---
    const fill = document.querySelector<HTMLElement>('.reading-progress-fill');
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? scrolled / total : 0;
      if (fill) fill.style.transform = `scaleX(${pct})`;
    };

    // --- Scroll reveal ---
    const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal],[data-reveal-left],[data-reveal-right],[data-reveal-scale]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));

    // --- Chat bubbles stagger ---
    const chatObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const msgs = e.target.querySelectorAll<HTMLElement>('.ps-msg');
          msgs.forEach((msg, i) => {
            setTimeout(() => msg.classList.add('chat-visible'), i * 300);
          });
          chatObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    const chatContainer = document.querySelector('.ps-chat');
    if (chatContainer) chatObs.observe(chatContainer);

    // --- Hero parallax ---
    const heroGrid = document.querySelector<HTMLElement>('.hero-grid');
    const handleScroll = () => {
      updateProgress();
      if (heroGrid) {
        const y = window.scrollY;
        heroGrid.style.transform = `translateY(${y * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      obs.disconnect();
      chatObs.disconnect();
    };
  }, []);
}

/** Animate compare bars when they scroll into view */
function useBarAnimation() {
  useEffect(() => {
    const bars = document.querySelectorAll<HTMLElement>('.compare-bar');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target as HTMLElement;
          const target = bar.dataset.width ?? '0%';
          setTimeout(() => { bar.style.width = target; }, 200);
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => obs.observe(b));
    return () => obs.disconnect();
  }, []);
}

/** Animated number counter */
function useCounters() {
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('.counter-val');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const raw = el.dataset.target ?? '0';
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        const suffix = raw.replace(/[0-9.]/g, '');
        const duration = 1400;
        const start = performance.now();
        const animate = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(num * eased) + suffix;
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════════════════ */

const CompareBar: FC<{label:string; pairs:{side:string;cls:string;width:string;text:string}[]}> = ({label,pairs}) => (
  <div className="compare-item" data-reveal>
    <div className="compare-label">{label}</div>
    {pairs.map((p) => (
      <div key={p.side} className="compare-row">
        <span className={`compare-side ${p.cls}`}>{p.side}</span>
        <div className="compare-bar-wrap">
          <div className={`compare-bar ${p.cls==='old'?'bar-old':'bar-new'}`} data-width={p.width} style={{width:'0%'}}>
            <span className="bar-label">{p.text}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useParticleCanvas(canvasRef);
  useScrollEffects();
  useBarAnimation();
  useCounters();

  return (
    <>
      {/* ── Reading progress ── */}
      <div className="reading-progress">
        <div className="reading-progress-fill" />
      </div>

      {/* ──────────────────── NAV ──────────────────── */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">Agentic<span>AI</span> × Maps</div>
          <div className="nav-links">
            <a className="nav-link" href="#problem">ปัญหา</a>
            <a className="nav-link" href="#solution">วิธีแก้</a>
            <a className="nav-link" href="#demo">ทดลองจริง</a>
            <a className="nav-link" href="#result">ผลลัพธ์</a>
            <button className="nav-cta" onClick={() => navigate('/report')}>สำรวจรายงาน →</button>
          </div>
        </div>
      </nav>

      {/* ──────────────────── HERO ──────────────────── */}
      <section className="hero" id="top">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            สัมมนา 477-401 · มหาวิทยาลัยสงขลานครินทร์
          </div>

          <h1 className="hero-title">
            เมื่อ <span className="hero-title-accent">AI Agent</span><br />
            มาช่วยนักพัฒนา<br />
            สร้างแผนที่อัจฉริยะ
          </h1>

          <p className="hero-desc">
            จาก Google Maps API ที่ต้องเขียนโค้ดเองทุกบรรทัด<br />
            สู่ระบบ Builder Agent ที่สั่งด้วยภาษาธรรมชาติ<br />
            และ MCP Server ที่เชื่อม AI เข้ากับข้อมูลเรียลไทม์
          </p>

          <div className="hero-divider" />

          <div className="hero-meta-row">
            <div className="hero-meta-item">
              <div className="hero-meta-label">ผู้จัดทำ</div>
              <div className="hero-meta-val">นาย คมกฤช โพธิ์นิ่มแดง<span className="id-chip">6610510043</span></div>
              <div className="hero-meta-val">นางสาว ณัฎฐณิชา เมฆปลัด<span className="id-chip">6610510095</span></div>
            </div>
            <div className="hero-meta-item">
              <div className="hero-meta-label">อาจารย์ที่ปรึกษา</div>
              <div className="hero-meta-val">ผศ.ดร.รุชดี บิลหมัด</div>
            </div>
          </div>

          <div className="hero-btns">
            <button className="btn-teal" onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior:'smooth' })}>
              เลื่อนดูเรื่องทั้งหมด ↓
            </button>
            <button className="btn-outline" onClick={() => navigate('/demo')}>
              🗺️ ทดลอง Live Demo
            </button>
            <button className="btn-outline" style={{borderColor:'rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.6)'}} onClick={() => navigate('/report')}>
              ดูรายงาน →
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-chevron" />
        </div>
      </section>

      {/* ──────────────────── SECTION 1: ปัญหา ──────────────────── */}
      <section className="story-section dark" id="problem">
        <div className="container">
          <div className="section-label teal-label" data-reveal>ปัญหาที่เจอ</div>
          <h2 className="section-title" data-reveal>
            "แก้ code ถูก<br />แต่ข้อมูลพิกัดผิดไปเอง"
          </h2>
          <p className="section-body" data-reveal>
            นักพัฒนา Full-stack ที่ต้องจัดการ Google Maps API หลายตัวพร้อมกัน
            มักเจอปัญหาคลาสสิค: <strong>ส่ง prompt ให้ AI แล้วบอกให้แก้ฟีเจอร์หนึ่ง
            แต่ AI ดันไปแก้ไฟล์ที่ไม่เกี่ยวด้วย</strong> เพราะไม่รู้ context ของระบบ
          </p>

          {/* ── Chat simulation ── */}
          <div className="problem-scenario" data-reveal>
            <div className="ps-header">
              <div className="ps-dots"><span className="ps-dot ps-dot-r"/><span className="ps-dot ps-dot-y"/><span className="ps-dot ps-dot-g"/></div>
              <span className="ps-title">Builder Agent · Context Window</span>
            </div>
            <div className="ps-body">
              <div className="ps-chat">
                <div className="ps-msg">
                  <div className="ps-avatar avatar-user">US</div>
                  <div className="ps-bubble">
                    <p>เพิ่มฟีเจอร์แสดงร้านอาหารใกล้เคียงบนแผนที่ด้วย Google Maps Places API หน่อย</p>
                  </div>
                </div>
                <div className="ps-msg">
                  <div className="ps-avatar avatar-agent">AI</div>
                  <div className="ps-bubble">
                    <p>กำลังเขียนโค้ด → เพิ่ม <code>nearbySearch()</code> ใน <code>map.component.ts</code></p>
                    <p className="ps-status status-ok">✓ เพิ่มฟังก์ชันสำเร็จ · ไม่มี error</p>
                  </div>
                </div>
                <div className="ps-msg">
                  <div className="ps-avatar avatar-warn">!</div>
                  <div className="ps-bubble">
                    <p>⚠ ปัญหา: AI เพิ่ม Places Search สำเร็จ แต่<strong style={{color:'#f87171'}}> ดันรีเซต center coordinates ของแผนที่ทุกหน้า กลับเป็น (0, 0) ทั้งหมด</strong> เพราะ context ไม่รู้ว่าไฟล์ map config เชื่อมกับ component อื่นด้วย</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="highlight-quote" data-reveal>
            <p>นี่คือปัญหาของ AI ที่ขาด <strong style={{color:'var(--teal)'}}>Spatial Context</strong> —
            รู้แค่ว่าต้องแก้อะไร แต่ไม่รู้ว่าข้อมูลเชิงพื้นที่ทำงานยังไง
            จึงต้องการ <strong style={{color:'var(--teal)'}}>MCP + Context Engineering</strong> มาช่วย</p>
          </div>

          <div className="tools-row" data-stagger>
            <span className="tool-chip" data-reveal><span className="tool-chip-icon">🗺️</span>Google Maps API</span>
            <span className="tool-chip" data-reveal><span className="tool-chip-icon">🏗️</span>Builder Agent</span>
            <span className="tool-chip" data-reveal><span className="tool-chip-icon">🔌</span>MCP Server</span>
            <span className="tool-chip" data-reveal><span className="tool-chip-icon">🤖</span>Cline (VS Code)</span>
            <span className="tool-chip" data-reveal><span className="tool-chip-icon">✨</span>Google AI Studio</span>
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 2: วิธีแก้ ──────────────────── */}
      <section className="story-section" id="solution">
        <div className="container">
          <div className="section-label" data-reveal>แนวทางแก้ไข</div>
          <h2 className="section-title" data-reveal>
            MCP Server เชื่อม AI<br />เข้ากับ Google Maps โดยตรง
          </h2>
          <p className="section-body" data-reveal>
            <strong>Model Context Protocol (MCP)</strong> คือมาตรฐานเปิดที่ช่วยให้ LLM เรียกใช้
            เครื่องมือภายนอกได้อย่างปลอดภัยและมีโครงสร้าง แทนที่จะ copy-paste URL ลงใน prompt
            AI สามารถเรียก <code style={{fontFamily:'var(--font-mono)',color:'var(--accent-dark)',background:'var(--accent-bg)',padding:'1px 5px',borderRadius:'3px'}}>maps_search_places()</code>{' '}
            และได้ผลลัพธ์เป็น structured data กลับมาทันที
          </p>

          <div className="compare-section">
            <CompareBar
              label="เวลาที่ใช้พัฒนาฟีเจอร์ Places Search"
              pairs={[
                { side:'แบบเดิม', cls:'old', width:'87%', text:'หลายวัน (เขียน code + debug API)' },
                { side:'MCP Agent', cls:'new', width:'13%', text:'ไม่กี่นาที' },
              ]}
            />
            <CompareBar
              label="จำนวน Boilerplate Code ที่ต้องเขียนเอง"
              pairs={[
                { side:'แบบเดิม', cls:'old', width:'90%', text:'100% (ทุกบรรทัด)' },
                { side:'MCP Agent', cls:'new', width:'20%', text:'ลด 70–80%' },
              ]}
            />
            <CompareBar
              label="โอกาสเกิด Context Error / Hallucination"
              pairs={[
                { side:'แบบเดิม', cls:'old', width:'78%', text:'สูง (manual copy-paste)' },
                { side:'MCP Agent', cls:'new', width:'15%', text:'ต่ำมาก (structured call)' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 3: ทดลองจริง ──────────────────── */}
      <section className="story-section dark" id="demo">
        <div className="container">
          <div className="section-label teal-label" data-reveal>การทดลองจริง</div>
          <h2 className="section-title" data-reveal>
            ค้นหาร้านกาแฟรอบ ม.อ. หาดใหญ่<br />
            ด้วย 1 บรรทัด
          </h2>
          <p className="section-body" data-reveal>
            ทดลองใช้ MCP Google Maps Server ผ่าน Cline ใน VS Code
            สั่งค้นหาร้านกาแฟรอบมหาวิทยาลัยสงขลานครินทร์ หาดใหญ่
            ด้วยภาษาธรรมชาติ และดูผลลัพธ์เรียลไทม์
          </p>

          <div className="mcp-demo">
            <div className="mcp-tool-card" data-reveal>
              <div className="mcp-tool-header">
                <span className="mcp-tool-name">maps_search_places</span>
                <span className="mcp-tool-badge">MCP TOOL CALL</span>
              </div>
              <div className="mcp-tool-body">
                <pre>{`// คำสั่งที่ส่งให้ AI:
// "หาร้านกาแฟรอบ ม.อ. หาดใหญ่ รัศมี 1.5 กม."

// AI เรียก MCP tool โดยอัตโนมัติ:
{
  "tool": "maps_search_places",
  "arguments": {
    "query": "coffee cafe ร้านกาแฟ",
    "location": "7.0066, 100.5018",
    "radius": 1500,
    "type": "cafe"
  }
}`}</pre>
                <div className="mcp-result">
                  <div className="mcp-result-label">✓ ผลลัพธ์</div>
                  <p>พบ <strong style={{color:'var(--teal)'}}>12 ร้านกาแฟ</strong> ในรัศมี 1.5 กม. รอบ ม.อ. หาดใหญ่<br />
                  ข้อมูลครบ: ชื่อ, พิกัด GPS, เวลาเปิด-ปิด, คะแนน Google Maps</p>
                </div>
              </div>
            </div>

            <div className="mcp-tool-card" data-reveal>
              <div className="mcp-tool-header">
                <span className="mcp-tool-name">maps_directions + maps_distance_matrix</span>
                <span className="mcp-tool-badge">MCP TOOL CALL</span>
              </div>
              <div className="mcp-tool-body">
                <pre>{`// คำสั่ง: "หาเส้นทางจาก ม.อ. หาดใหญ่ ไป ร้าน The Company"

{
  "tool": "maps_directions",
  "arguments": {
    "origin": "Prince of Songkla University Hat Yai",
    "destination": "The Company Coffee Hat Yai",
    "mode": "driving",
    "alternatives": true
  }
}`}</pre>
                <div className="mcp-result">
                  <div className="mcp-result-label">✓ ผลลัพธ์</div>
                  <p>พบ <strong style={{color:'var(--teal)'}}>9 เส้นทาง</strong> พร้อม <strong style={{color:'var(--teal)'}}>91 step-by-step directions</strong><br />
                  ทั้งรถยนต์, เดิน, และขนส่งสาธารณะ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 4: Route Result ──────────────────── */}
      <section className="story-section alt" id="route">
        <div className="container">
          <div className="section-label" data-reveal>ตัวอย่างผลลัพธ์</div>
          <h2 className="section-title" data-reveal>
            ม.อ. หาดใหญ่ → ร้าน The Company
          </h2>
          <p className="section-body" data-reveal>
            เส้นทางที่ AI คำนวณผ่าน MCP <code style={{fontFamily:'var(--font-mono)',color:'var(--accent-dark)',background:'var(--accent-bg)',padding:'1px 5px',borderRadius:'3px'}}>maps_distance_matrix</code>{' '}
            และ <code style={{fontFamily:'var(--font-mono)',color:'var(--accent-dark)',background:'var(--accent-bg)',padding:'1px 5px',borderRadius:'3px'}}>maps_directions</code> ได้ผลลัพธ์แบบ real-time
          </p>

          <div className="route-demo" data-reveal-scale>
            <div className="route-header">
              <span className="route-title">📍 ม.อ. หาดใหญ่ → The Company Coffee</span>
              <span className="route-badge">maps_distance_matrix</span>
            </div>
            <div className="route-body" data-stagger>
              <div className="route-stat">
                <div className="route-stat-val"><span className="counter-val" data-target="8">0</span></div>
                <div className="route-stat-label">นาที 🚗 ขับรถ</div>
              </div>
              <div className="route-stat">
                <div className="route-stat-val"><span className="counter-val" data-target="30">0</span></div>
                <div className="route-stat-label">นาที 🚶 เดิน</div>
              </div>
              <div className="route-stat">
                <div className="route-stat-val">3.2</div>
                <div className="route-stat-label">กิโลเมตร</div>
              </div>
            </div>
            <div className="route-steps">
              {[
                ['1','มุ่งหน้าไปทาง ถ.กาญจนวณิชย์ ออกจากประตู ม.อ. ฝั่งเหนือ'],
                ['2','เลี้ยวซ้ายที่แยกไฟแดง ถ.ราษฎร์ยินดี ตรงไป 1.2 กม.'],
                ['3','เลี้ยวขวาเข้า ซอยโรบินสัน The Company อยู่ทางซ้ายมือ'],
              ].map(([num, text]) => (
                <div key={num} className="route-step">
                  <span className="step-num">{num}</span>
                  <span className="step-text">{text}</span>
                </div>
              ))}
              <div className="route-step" style={{borderColor:'var(--accent)',background:'rgba(0,168,107,0.03)'}}>
                <span className="step-num">+6</span>
                <span className="step-text" style={{color:'var(--accent-dark)'}}>อีก 6 ขั้นตอน (91 directions จากระบบ MCP)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 5: ผลลัพธ์ ──────────────────── */}
      <section className="story-section dark" id="result">
        <div className="container">
          <div className="section-label teal-label" data-reveal>ผลการทดลอง</div>
          <h2 className="section-title" data-reveal>คำตอบสั้นๆ: ได้ผลมากกว่า</h2>
          <p className="section-body" data-reveal>
            การใช้ Builder Agent + MCP Server ช่วยลด overhead การพัฒนาได้อย่างมีนัยสำคัญ
            และยังได้ข้อมูล real-time จาก Google Maps API โดยตรงผ่าน structured tool calls
            แทนการ copy-paste ผลลัพธ์ให้ AI วิเคราะห์เอง
          </p>

          <div className="findings-bar" data-reveal>
            <div className="finding-cell">
              <div className="finding-num">70–80%</div>
              <div className="finding-lbl">ลด Boilerplate Code ที่ต้องเขียนเอง</div>
            </div>
            <div className="finding-cell">
              <div className="finding-num"><span className="counter-val" data-target="9">0</span></div>
              <div className="finding-lbl">เส้นทางจาก maps_directions</div>
            </div>
            <div className="finding-cell">
              <div className="finding-num"><span className="counter-val" data-target="12">0</span></div>
              <div className="finding-lbl">ร้านกาแฟพบในรัศมี 1.5 กม.</div>
            </div>
            <div className="finding-cell">
              <div className="finding-num">5 API</div>
              <div className="finding-lbl">MCP Tools ที่ใช้ในการทดลอง</div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── CTA ──────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="section-label teal-label" style={{textAlign:'center'}} data-reveal>อยากรู้รายละเอียด?</div>
          <h2 className="cta-title" data-reveal>สำรวจรายงานฉบับเต็ม</h2>
          <p className="cta-sub" data-reveal>
            ครอบคลุม 5 บท: บทนำ · ทฤษฎี · วิธีการ · ผลการทดลอง · เอกสารอ้างอิง<br />
            พร้อม code ตัวอย่าง TypeScript ทุก section
          </p>
          <div className="cta-btns" data-reveal>
            <button className="btn-teal" onClick={() => navigate('/report')}>
              สำรวจรายงานทั้งหมด →
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────── FOOTER ──────────────────── */}
      <footer className="footer">
        <div className="container-wide footer-inner">
          <div className="footer-left">
            <div className="f-title">Agentic AI × Google Maps</div>
            <div className="f-sub">477-401 สัมมนาระบบสารสนเทศทางธุรกิจ · ม.อ. หาดใหญ่</div>
          </div>
          <div className="footer-right">
            <div className="f-teal">Built with Vite + React + TypeScript</div>
            <div>คมกฤช โพธิ์นิ่มแดง · ณัฎฐณิชา เมฆปลัด</div>
          </div>
        </div>
      </footer>
    </>
  );
}
