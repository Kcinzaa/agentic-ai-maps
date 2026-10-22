// ============================================================
// src/pages/ReportPage.tsx — Full report (SkillBench overview style)
// ============================================================
import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHAPTERS, FINDINGS, REFERENCES, META } from '../data/report';
import type { CategoryId, ContentRow } from '../types';
import '../styles/global.css';
import '../styles/report.css';

// ── Syntax highlighter (simple) ──────────────────────────────
function escHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function highlight(raw: string, lang: string): string {
  // Step 1: escape HTML so injected <span> tags won't double-escape
  const code = escHtml(raw);

  if (lang === 'json') {
    return code
      .replace(/(&quot;[\w\s-]+&quot;)\s*:/g,'<span class="c-key">$1</span>:')
      .replace(/:\s*(&quot;[^&]*&quot;)/g,': <span class="c-str">$1</span>')
      .replace(/:\s*(\d+(?:\.\d+)?)/g,': <span class="c-num">$1</span>')
      .replace(/:\s*(true|false|null)\b/g,': <span class="c-kw">$1</span>');
  }
  if (lang === 'bash') {
    return code
      .replace(/(#[^\n]*)/g,'<span class="c-comment">$1</span>')
      .replace(/\b(npm|npx|export|echo)\b/g,'<span class="c-kw">$1</span>')
      .replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g,'<span class="c-str">$1</span>');
  }
  // TypeScript / JS
  let r = code;
  // Comments first (protect from further replacement)
  r = r.replace(/(\/\/[^\n]*)/g,'<span class="c-comment">$1</span>');
  // Template literals
  r = r.replace(/(`[^`]*`)/g,'<span class="c-tmpl">$1</span>');
  // Quoted strings (already HTML-escaped quotes become &quot; or &#39;)
  r = r.replace(/(&quot;(?:[^&]|&(?!quot;))*&quot;)/g,'<span class="c-str">$1</span>');
  r = r.replace(/(&#39;(?:[^&]|&(?!#39;))*&#39;)/g,'<span class="c-str">$1</span>');
  // Numbers
  r = r.replace(/\b(\d+(?:\.\d+)?)\b/g,'<span class="c-num">$1</span>');
  // Keywords
  const kws = ['interface','type','class','const','let','var','function','async','await','return','new','import','from','export','if','else','throw','private','public','readonly','string','number','boolean','void','unknown'];
  kws.forEach(k => { r = r.replace(new RegExp(`\\b(${k})\\b`,'g'),'<span class="c-kw">$1</span>'); });
  // Function calls
  r = r.replace(/\b([a-z_]\w*)\s*\(/g,'<span class="c-fn">$1</span>(');
  // PascalCase types
  r = r.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g,'<span class="c-type">$1</span>');
  return r;
}

// ── CodeBlock ────────────────────────────────────────────────
const CodeBlock: FC<{code:{lang:string;label?:string;code:string}}> = ({code}) => (
  <div className="code-block">
    <div className="cb-header">
      <div className="cb-dots"><span className="cb-dot cb-dot-r"/><span className="cb-dot cb-dot-y"/><span className="cb-dot cb-dot-g"/></div>
      {code.label && <span className="cb-label">{code.label}</span>}
      <span className="cb-lang">{code.lang}</span>
    </div>
    <pre className="cb-body" dangerouslySetInnerHTML={{__html: highlight(code.code, code.lang)}} />
  </div>
);

// ── RowDetail ───────────────────────────────────────────────
const RowDetail: FC<{row: ContentRow}> = ({row}) => (
  <div className="ct-detail">
    {row.list && <ul className="detail-list">{row.list.map((item,i)=><li key={i}>{item}</li>)}</ul>}
    {row.components && (
      <div className="comp-grid">{row.components.map(c=>(
        <div key={c.name} className="comp-item"><span className="comp-icon">{c.icon}</span><strong className="comp-name">{c.name}</strong><span className="comp-desc">{c.desc}</span></div>
      ))}</div>
    )}
    {row.mcpFlow && (
      <div className="mcp-flow">{row.mcpFlow.map((n,i)=>(
        <span key={n.label} style={{display:'inline-flex',alignItems:'center',gap:'.5rem'}}>
          <span className={`mcp-nd${n.highlight?' accent':''}`}>{n.label}<small>{n.sublabel}</small></span>
          {i<row.mcpFlow!.length-1&&<span className="mcp-arr">→</span>}
        </span>
      ))}</div>
    )}
    {row.code && <CodeBlock code={row.code}/>}
  </div>
);

// ── TableRow ────────────────────────────────────────────────
const TableRow: FC<{row: ContentRow; compareMode?: boolean}> = ({row, compareMode}) => {
  const [open, setOpen] = useState(false);
  const hasDetail = !!(row.list||row.code||row.components||row.mcpFlow);
  const CAT_CLASS: Record<string,string> = {'AI Agent':'cat-agent','MCP':'cat-mcp','Context':'cat-context','Maps AI':'cat-maps','สำเร็จ':'badge-pos','แก้ไขแล้ว':'badge-warn'};

  return (
    <div className="ct-row">
      <div className={`ct-row-main ${compareMode?'cols-compare':'cols-4'}`} onClick={()=>hasDetail&&setOpen(!open)}>
        <div><span className="ct-tag">{row.tag}</span></div>
        <div>
          <span className="ct-item-title">{row.title}</span>
          {row.subtitle && <span className="ct-item-sub">{row.subtitle}</span>}
          {row.chips && <div className="chips">{row.chips.map(c=><span key={c} className="chip">{c}</span>)}</div>}
        </div>
        {compareMode ? (
          <>
            <div><span className="score-neg">{row.colLeft}</span></div>
            <div><span className="score-pos">{row.colRight}</span></div>
          </>
        ) : (
          <>
            <div>{row.body && <p>{row.body}</p>}</div>
            <div>
              {row.badge && <span className={`cat-badge ${CAT_CLASS[row.badge]||''}`}>{row.badge}</span>}
              {hasDetail && <button className="expand-btn" aria-label="expand">{open?'▲':'▼'}</button>}
            </div>
          </>
        )}
      </div>
      {open && <RowDetail row={row}/>}
      {compareMode && (row.list||row.code) && <RowDetail row={row}/>}
    </div>
  );
};

// ── FilterPills ─────────────────────────────────────────────
const Pills: FC<{pills:{id:CategoryId;label:string;count?:number}[];active:CategoryId;onSelect:(id:CategoryId)=>void}> = ({pills,active,onSelect}) => (
  <div className="filter-bar">
    {pills.map(p=>(
      <button key={p.id} className={`pill${active===p.id?' active':''}`} onClick={()=>onSelect(p.id)}>
        {p.label}{p.count!==undefined&&<span className="pill-count">{p.count}</span>}
      </button>
    ))}
  </div>
);

// ── ChapterSection ───────────────────────────────────────────
const ChapterSection: FC<{ch: typeof CHAPTERS[0]}> = ({ch}) => {
  const [active, setActive] = useState<CategoryId>('all');
  const rows = ch.rows.filter(r=>active==='all'||r.category===active);

  const THEAD_COMPARE = ['หัวข้อ','ด้าน','Rule-Based','Agentic AI + MCP'];
  const THEAD_NORMAL  = ['หัวข้อ','เนื้อหา','รายละเอียด','หมวด'];

  return (
    <section className="ch-section" id={ch.id}>
      <div className="container-wide">
        <div className="ch-eyebrow">{ch.num}</div>
        <h2 className="ch-title">{ch.title}</h2>
        <p className="ch-desc">{ch.desc}</p>

        <Pills pills={ch.pills} active={active} onSelect={setActive}/>

        <div className="ct-table">
          <div className={`ct-thead ${ch.compareMode?'cols-compare':'cols-4'}`}>
            {(ch.compareMode?THEAD_COMPARE:THEAD_NORMAL).map(h=><div key={h}>{h}</div>)}
          </div>
          {rows.length>0 ? rows.map(r=><TableRow key={r.id} row={r} compareMode={ch.compareMode}/>) : <div style={{padding:'2rem',textAlign:'center',color:'var(--text-3)'}}>ไม่มีข้อมูลในหมวดนี้</div>}
        </div>
      </div>
    </section>
  );
};

// ── NAV TABS ────────────────────────────────────────────────
const TABS = [
  {id:'ch1',label:'บทที่ 1',sublabel:'บทนำ'},
  {id:'ch2',label:'บทที่ 2',sublabel:'ทฤษฎี'},
  {id:'ch3',label:'บทที่ 3',sublabel:'วิธีการ'},
  {id:'ch4',label:'บทที่ 4',sublabel:'ผลการทดลอง'},
  {id:'refs',label:'อ้างอิง',sublabel:''},
];

// ── ReportPage ───────────────────────────────────────────────
export default function ReportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ch1');

  useEffect(() => {
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) setActiveTab(e.target.id); });
    },{rootMargin:'-30% 0px -60% 0px'});
    TABS.forEach(({id})=>{ const el=document.getElementById(id); if(el) obs.observe(el); });
    return ()=>obs.disconnect();
  },[]);

  const scrollTo = (id:string) => {
    const el = document.getElementById(id);
    if(!el) return;
    const navH = 56;
    window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-navH-8,behavior:'smooth'});
    setActiveTab(id);
  };

  return (
    <>
      {/* ── STICKY NAV ── */}
      <nav className="r-nav">
        <div className="r-nav-inner">
          <div className="r-nav-logo">477-401 <span>สัมมนา</span></div>
          <div className="r-nav-tabs">
            {TABS.map(t=>(
              <button key={t.id} className={`r-nav-tab${activeTab===t.id?' active':''}`} onClick={()=>scrollTo(t.id)}>
                <span className="r-nav-tab-label">{t.label}</span>
                {t.sublabel&&<span className="r-nav-tab-sub">{t.sublabel}</span>}
              </button>
            ))}
          </div>
          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
            <button className="r-back-btn" style={{background:'#1de9b6',color:'#002820',borderColor:'#1de9b6',fontWeight:700}} onClick={()=>navigate('/demo')}>🗺️ Live Demo</button>
            <button className="r-back-btn" onClick={()=>navigate('/')}>← หน้าแรก</button>
          </div>
        </div>
      </nav>

      {/* ── REPORT HEADER ── */}
      <header className="report-header" id="top">
        <div className="container-wide">
          <div className="rh-eyebrow">รายงานสัมมนาวิชาการ</div>
          <h1 className="rh-title">{META.title.split('\n').map((l,i)=><span key={i}>{l}{i===0&&<br/>}</span>)}</h1>
          <p className="rh-desc">{META.subtitle.split('\n').map((l,i)=><span key={i}>{l}{i===0&&<br/>}</span>)}</p>
          <div className="rh-meta">
            <div className="rh-meta-item"><strong>ผู้จัดทำ:</strong> {META.authors.map(a=>a.name).join(' · ')}</div>
            <div className="rh-meta-item"><strong>อาจารย์ที่ปรึกษา:</strong> {META.advisor}</div>
            <div className="rh-meta-item"><strong>รายวิชา:</strong> {META.course}</div>
            <div className="rh-meta-item"><strong>ภาคเรียน:</strong> {META.semester}</div>
          </div>
        </div>
      </header>

      {/* ── CHAPTERS ── */}
      {CHAPTERS.map(ch=><ChapterSection key={ch.id} ch={ch}/>)}

      {/* ── FINDINGS ── */}
      <section className="findings-section">
        <div className="container-wide">
          <div className="fs-eyebrow">ข้อค้นพบสำคัญ</div>
          <h2 className="fs-title">ผลลัพธ์จากการทดลอง</h2>
          <div className="findings-grid">
            {FINDINGS.map(f=>(
              <div key={f.label} className="fc">
                <div className="fc-val">{f.value}</div>
                <div className="fc-lbl">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFERENCES ── */}
      <section className="ch-section" id="refs">
        <div className="container-wide">
          <div className="ch-eyebrow">บทที่ 5</div>
          <h2 className="ch-title">เอกสารอ้างอิง</h2>
          <p className="ch-desc">แหล่งข้อมูลทางวิชาการและเอกสารอย่างเป็นทางการที่ใช้ในการจัดทำรายงาน</p>
          <div className="refs-list">
            {REFERENCES.map(r=>(
              <div key={r.num} className="ref-item">
                <span className="ref-num">{r.num}</span>
                <span className="ref-text">{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="r-footer">
        <div className="container-wide r-footer-inner">
          <div>
            <div className="f-title">477-401 สัมมนาระบบสารสนเทศทางธุรกิจ</div>
            <div className="f-sub">{META.authors.map(a=>a.name).join(' · ')} · ปรึกษา: {META.advisor}</div>
          </div>
          <div className="f-right">
            <div className="f-teal">Vite + React + TypeScript</div>
            <div>{META.semester}</div>
          </div>
        </div>
      </footer>
    </>
  );
}
