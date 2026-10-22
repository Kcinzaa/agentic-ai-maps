// ============================================================
// Hero.tsx — SkillBench-style dark hero section
// ============================================================
import { useEffect, useRef, type FC } from 'react';
import type { ReportMeta } from '../types';

interface HeroProps {
  meta: ReportMeta;
  onNavigate: (id: string) => void;
}

const Hero: FC<HeroProps> = ({ meta, onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; pulse: number;
    }

    const particles: Particle[] = [];
    const NUM = 50;
    const MAX_DIST = 130;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < NUM; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(29,233,182,${(1 - dist / MAX_DIST) * 0.2})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.pulse += 0.03;
        const r = p.r + Math.sin(p.pulse) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(29,233,182,0.8)';
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    init();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-grid" />

      <div className="hero-inner">
        {/* Badge */}
        <div className="hero-badge">
          <span className="badge-dot" />
          {meta.course}
        </div>

        {/* Main title */}
        <h1 className="hero-title">
          {meta.title.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < meta.title.split('\n').length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p className="hero-subtitle">
          {meta.subtitle.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < meta.subtitle.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>

        <div className="hero-divider" />

        {/* Meta grid */}
        <div className="hero-meta">
          <div className="hero-meta-block">
            <div className="hero-meta-label">ผู้จัดทำ</div>
            {meta.authors.map((a) => (
              <div key={a.studentId} className="hero-meta-val">
                {a.name}
                <span className="id-pill">{a.studentId}</span>
              </div>
            ))}
          </div>
          <div className="hero-meta-block">
            <div className="hero-meta-label">อาจารย์ที่ปรึกษา</div>
            <div className="hero-meta-val">{meta.advisor}</div>
          </div>
          <div className="hero-meta-block">
            <div className="hero-meta-label">หลักสูตร</div>
            <div className="hero-meta-val">{meta.semester}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="hero-tags">
          {meta.tags.map((tag) => (
            <span key={tag} className="hero-tag">{tag}</span>
          ))}
        </div>

        {/* CTAs */}
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => onNavigate('ch1')}>
            เริ่มอ่านรายงาน →
          </button>
          <button className="btn-ghost" onClick={() => onNavigate('ch3')}>
            ดูกรณีศึกษา
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint">
        <div className="scroll-arrow" />
      </div>
    </section>
  );
};

export default Hero;
