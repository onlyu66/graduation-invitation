"use client";
import { useState, useCallback, useEffect } from "react";

function FlowerIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1C8 1,10.5 4.5,8 8C5.5 4.5 8 1 8 1Z" fill="#c9956c" opacity="0.85" />
      <path d="M8 8C8 8,12 9,10.5 13C7.5 11 8 8 8 8Z" fill="#e8b0c8" opacity="0.85" />
      <path d="M8 8C8 8,4 9,5.5 13C8.5 11 8 8 8 8Z" fill="#d4a0c0" opacity="0.8" />
      <path d="M8 8C8 8,12.5 6,15 9C12.5 10 8 8 8 8Z" fill="#c9956c" opacity="0.6" />
      <path d="M8 8C8 8,3.5 6,1 9C3.5 10 8 8 8 8Z" fill="#c9956c" opacity="0.6" />
      <circle cx="8" cy="8" r="2" fill="#c9956c" />
      <circle cx="8" cy="8" r="1" fill="#fff8f2" />
    </svg>
  );
}

const BG_FLOWERS = [
  { x: "5%", y: "8%", r: 38, opacity: 0.13, dur: 9 },
  { x: "90%", y: "5%", r: 50, opacity: 0.10, dur: 12 },
  { x: "2%", y: "85%", r: 44, opacity: 0.10, dur: 11 },
  { x: "95%", y: "88%", r: 36, opacity: 0.12, dur: 10 },
  { x: "50%", y: "2%", r: 30, opacity: 0.07, dur: 14 },
  { x: "15%", y: "50%", r: 25, opacity: 0.06, dur: 13 },
  { x: "85%", y: "50%", r: 28, opacity: 0.06, dur: 15 },
];

type BgFlowerProps = {
  x: string | number;
  y: string | number;
  r: number;
  opacity: number;
  dur: number;
  delay: number;
};

function BgFlower({ x, y, r, opacity, dur, delay }: BgFlowerProps) {
  const cx = r * 1.1, cy = r * 1.1;
  return (
    <div className="absolute pointer-events-none"
      style={{
        left: x, top: y, transform: "translate(-50%,-50%)",
        animation: `bgFlowerSpin ${dur}s linear infinite`, animationDelay: `${delay}s`
      }}>
      <svg width={r * 2.2} height={r * 2.2} viewBox={`0 0 ${r * 2.2} ${r * 2.2}`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const px = cx + Math.cos(a) * r * 0.55, py = cy + Math.sin(a) * r * 0.55;
          return <ellipse key={i} cx={px} cy={py} rx={r * 0.45} ry={r * 0.25}
            transform={`rotate(${a * 180 / Math.PI},${px},${py})`} fill={`rgba(220,150,180,${opacity})`} />;
        })}
        <circle cx={cx} cy={cy} r={r * 0.18} fill={`rgba(200,140,100,${opacity * 1.5})`} />
      </svg>
    </div>
  );
}

// Envelope width & height
const ENV_W = 440;
const ENV_H = 290;
// Card width (narrower than envelope)
const CARD_W = 384;

export default function ThiepMoi() {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [sealGone, setSealGone] = useState(false);
  const [triOpen, setTriOpen] = useState(false);
  const [triBOpen, setTriBOpen] = useState(false);
  const [cardRisen, setCardRisen] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [petals, setPetals] = useState<any[]>([]);
  const [sparkles, setSparkles] = useState<any[]>([]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setScale(w / 480);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const spawnPetals = useCallback(() => {
    const cols = ["#f4c0d0", "#e8b4cc", "#d8c4e8", "#fbe0d0", "#e8d0c0", "#f0d0e0", "#fce8d8", "#dcc8e8"];
    const shapes = ["50% 0 50% 0", "50%", "50% 50% 0 50%", "0 50% 50% 50%"];
    const list = Array.from({ length: 36 }, (_, i) => {
      const sz = 7 + Math.random() * 9, left = 5 + Math.random() * 90, dur = 3.5 + Math.random() * 4.5;
      const r0 = Math.random() * 360, r1 = r0 + 180 + Math.random() * 360, dx = (Math.random() - 0.5) * 120;
      return {
        id: Date.now() + i, style: {
          position: "absolute", left: `${left}%`, top: "-20px",
          width: `${sz}px`, height: `${sz * 1.3}px`,
          background: cols[Math.floor(Math.random() * cols.length)],
          borderRadius: shapes[Math.floor(Math.random() * shapes.length)],
          "--r0": `${r0}deg`, "--r1": `${r1}deg`, "--dx": `${dx}px`,
          animation: `petalFall ${dur}s ease-in forwards`,
          animationDelay: `${i * 0.1}s`,
        }
      };
    });
    setPetals(list);
    setTimeout(() => setPetals([]), 36 * 100 + 9000);
  }, []);

  const spawnSparkles = useCallback(() => {
    const cols = ["#c9956c", "#e8a0c0", "#d4b0e0", "#f9d4c0", "#e8c0d8"];
    const list = Array.from({ length: 28 }, (_, i) => {
      const a = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 130;
      const x = ENV_W / 2 + Math.cos(a) * dist, y = ENV_H / 2 + Math.sin(a) * dist;
      const sz = 3 + Math.random() * 5, dur = 0.5 + Math.random() * 0.8;
      return {
        id: Date.now() + i, style: {
          left: `${x}px`, top: `${y}px`, width: `${sz}px`, height: `${sz}px`,
          background: cols[Math.floor(Math.random() * cols.length)],
          animation: `sparkle ${dur}s ease-in-out forwards`,
          animationDelay: `${i * 0.04}s`,
        }
      };
    });
    setSparkles(list);
    setTimeout(() => setSparkles([]), 28 * 40 + 1500);
  }, []);

  const doOpen = useCallback(() => {
    if (animating) return;
    setAnimating(true); setIsOpen(true);
    setFlapOpen(true); setSealGone(true);
    setTimeout(() => setTriOpen(true), 200);
    setTimeout(() => setTriBOpen(true), 380);
    setTimeout(() => {
      setCardRisen(true);
      spawnSparkles(); spawnPetals();
      setBtnVisible(true); setAnimating(false);
    }, 650);
  }, [animating, spawnSparkles, spawnPetals]);

  const doClose = useCallback(() => {
    if (animating) return;
    setAnimating(true); setIsOpen(false);
    setCardRisen(false);
    setTimeout(() => setTriBOpen(false), 300);
    setTimeout(() => setTriOpen(false), 480);
    setTimeout(() => { setFlapOpen(false); setSealGone(false); setAnimating(false); }, 700);
  }, [animating]);

  const handleToggle = (e?: React.MouseEvent) => {
    if (e?.stopPropagation) e.stopPropagation();
    isOpen ? doClose() : doOpen();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&display=swap');

        @keyframes petalFall {
          0%  { opacity:0; transform:translateY(-20px) rotate(var(--r0,0deg)) scale(1); }
          6%  { opacity:.9; }
          80% { opacity:.7; }
          100%{ opacity:0; transform:translateY(870px) rotate(var(--r1,180deg)) translateX(var(--dx,0px)) scale(.6); }
        }
        @keyframes sparkle {
          0%,100%{ opacity:0; transform:scale(0); }
          50%    { opacity:1; transform:scale(1); }
        }
        @keyframes blink       { 0%,100%{opacity:.5}  50%{opacity:1} }
        @keyframes floatup     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bgFlowerSpin{ from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes flowerPulse { 0%,100%{transform:scale(1) rotate(0deg);opacity:.7} 50%{transform:scale(1.2) rotate(15deg);opacity:1} }
        @keyframes sealGlow    { 0%,100%{filter:drop-shadow(0 0 0px rgba(200,130,170,0))} 50%{filter:drop-shadow(0 0 8px rgba(200,130,170,.6))} }
        @keyframes ribbonShimmer{ 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes cardFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .font-cormorant  { font-family:'Cormorant Garamond',serif; }
        .font-playfair   { font-family:'Playfair Display',serif; }
        .font-greatvibes { font-family:'Great Vibes',cursive; }

        /* ── Envelope flaps ── */
        .env-tri-l{position:absolute;left:0;top:0;width:0;height:0;border-left:220px solid #fde8f2;border-top:145px solid transparent;border-bottom:145px solid transparent;transform-origin:left center;transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .55s}
        .env-tri-l.open{transform:rotateY(-170deg);opacity:.25}
        .env-tri-r{position:absolute;right:0;top:0;width:0;height:0;border-right:220px solid #fad8ec;border-top:145px solid transparent;border-bottom:145px solid transparent;transform-origin:right center;transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .55s}
        .env-tri-r.open{transform:rotateY(170deg);opacity:.25}
        .env-tri-b{position:absolute;bottom:0;left:0;width:0;height:0;border-left:220px solid #fce0ee;border-bottom:145px solid transparent;transform-origin:bottom left;transition:transform .5s cubic-bezier(.4,0,.2,1),opacity .5s}
        .env-tri-b.open{transform:rotateX(170deg);opacity:.25}
        .env-tri-b2{position:absolute;bottom:0;right:0;width:0;height:0;border-right:220px solid #f8d4e8;border-bottom:145px solid transparent;transform-origin:bottom right;transition:transform .5s cubic-bezier(.4,0,.2,1),opacity .5s}
        .env-tri-b2.open{transform:rotateX(170deg);opacity:.25}

        .flap-group{position:absolute;top:0;left:0;width:440px;transform-origin:top center;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.4,0,.2,1),opacity .55s;z-index:20;pointer-events:none}
        .flap-group.open{transform:rotateX(-175deg);opacity:.25}

        /* ── Card: sits at bottom of envelope, slides UP to cover it ── */
        /*
          The envelope container is position:relative, ENV_H=290px tall.
          Card is position:absolute, bottom-aligned (top = ENV_H - card visible peek = ~260px).
          Closed  → translateY(0)   : card tucked inside envelope (only tiny peek or fully hidden)
          Open    → translateY(-cardHeight) : card rises above envelope, overlapping it
          We don't know card height at build time so we use a large negative value (-520px)
          and clip overflow on the envelope so it's invisible when closed.
        */
        .card-slot{
          position:absolute;
          left:50%;
          top:50%;
          width:384px;
          z-index:15;
          pointer-events:none;
          transition:transform 1.3s cubic-bezier(.16,1,.3,1), opacity .6s ease;
          transform:translateX(-50%) translateY(10%);
          opacity:0;
        }
        .card-slot.risen{
          transform:translateX(-50%) translateY(-50%);
          z-index:35;
          opacity:1;
          pointer-events:auto;
        }
        @media (max-width: 480px) {
          .card-slot.risen{
            transform:translateX(-50%) translateY(-50%) scale(1.18);
          }
        }
        .card-float{ animation:cardFloat 4s ease-in-out infinite; animation-delay:1.5s; }

        .ribbon-shimmer{background:linear-gradient(90deg,#e8a0c0,#c9956c,#fff8f0,#e0b0d0,#c9956c,#e8a0c0);background-size:200% auto;animation:ribbonShimmer 3s linear infinite}
        .seal-anim{animation:sealGlow 2.5s ease-in-out infinite}
        .hint-blink{animation:blink 2s ease-in-out infinite}
        .btn-floatup{animation:floatup .6s ease both}
      `}</style>

      {/* Stage */}
      <div className="relative w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "100dvh", background: "#fdf0f5", padding: "50px 20px 40px" }}>

        {/* Background flowers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {BG_FLOWERS.map((f, i) => <BgFlower key={i} {...f} delay={i * 1.3} />)}
          {[{ x: "12%", y: "18%", d: 0 }, { x: "78%", y: "22%", d: 1.5 }, { x: "6%", y: "65%", d: 3 }, { x: "92%", y: "68%", d: 2.2 }].map((f, i) => (
            <div key={i} className="absolute pointer-events-none"
              style={{ left: f.x, top: f.y, animation: `flowerPulse ${3.5 + i * .8}s ease-in-out infinite`, animationDelay: `${f.d}s` }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                {Array.from({ length: 5 }).map((_, p) => {
                  const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
                  return <ellipse key={p} cx={18 + Math.cos(a) * 10} cy={18 + Math.sin(a) * 10} rx="8" ry="4.5"
                    transform={`rotate(${a * 180 / Math.PI},${18 + Math.cos(a) * 10},${18 + Math.sin(a) * 10})`}
                    fill="rgba(220,150,180,0.35)" />;
                })}
                <circle cx="18" cy="18" r="3.5" fill="rgba(200,140,100,0.45)" />
              </svg>
            </div>
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                left: `${(i * 6.25 + 3) % 100}%`, top: `${(i * 7.3 + 5) % 100}%`,
                width: `${2 + i % 3}px`, height: `${2 + i % 3}px`, background: "rgba(200,140,170,0.2)"
              }} />
          ))}
        </div>

        {/* Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {petals.map(p => <div key={p.id} className="absolute pointer-events-none" style={p.style} />)}
        </div>
        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {sparkles.map(s => <div key={s.id} className="absolute rounded-full pointer-events-none" style={s.style} />)}
        </div>

        {/* ── Main scene ── */}
        <div className="relative flex flex-col items-center transition-transform duration-300 cursor-pointer" 
          style={{ width: ENV_W, transform: `scale(${scale})`, transformOrigin: "center center", WebkitTapHighlightColor: "transparent" }}
          onClick={handleToggle} role="button" tabIndex={0}>

          {/* Envelope — the single positioned container; card is absolute inside it */}
          <div className="relative" style={{ width: ENV_W, height: ENV_H }}>

            {/* ── Card slot: absolute, rises UP out of envelope ── */}
            <div className={`card-slot ${cardRisen ? "risen" : ""}`} onClick={handleToggle} role="button" tabIndex={0}>
              <div className={`bg-[#fffcf8] rounded-[3px] relative overflow-hidden cursor-pointer ${cardRisen ? "card-float" : ""}`}
                style={{ width: CARD_W, boxShadow: "0 24px 80px rgba(180,100,140,0.22),0 4px 16px rgba(180,100,140,0.12),0 0 0 1px rgba(200,150,170,0.3)" }}>
                <div className="h-[5px] w-full ribbon-shimmer" />
                <div className="absolute pointer-events-none z-[4]" style={{ inset: 14, border: "0.8px solid rgba(200,150,170,0.4)" }} />
                <div className="absolute pointer-events-none z-[4]" style={{ inset: 18, border: "0.4px solid rgba(200,150,170,0.2)" }} />
                <div className="relative z-[5] px-[34px] pt-[30px] pb-[28px]">
                  <span className="font-cormorant block text-center text-[10px] tracking-[4px] text-[#c090a8] uppercase mb-3">✦ Trân trọng kính mời ✦</span>
                  <div className="flex items-center justify-center gap-[6px] mb-[10px]">
                    <div className="flex-1 h-[0.6px]" style={{ background: "linear-gradient(90deg,transparent,#d4a0bc)" }} />
                    <svg width="140" height="28" viewBox="0 0 140 28" fill="none">
                      <path d="M8 22L22 6L38 16L70 3L102 16L118 6L132 22" stroke="#d4a0bc" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="70" cy="3" r="2.5" fill="#c9956c" />
                      <circle cx="8" cy="22" r="1.5" fill="#d4a0bc" opacity="0.7" />
                      <circle cx="132" cy="22" r="1.5" fill="#d4a0bc" opacity="0.7" />
                      <circle cx="38" cy="16" r="1.5" fill="#c9956c" opacity="0.6" />
                      <circle cx="102" cy="16" r="1.5" fill="#c9956c" opacity="0.6" />
                      <path d="M60 22 Q70 16 80 22" stroke="#d4a0bc" strokeWidth="0.6" fill="none" opacity="0.6" />
                    </svg>
                    <div className="flex-1 h-[0.6px]" style={{ background: "linear-gradient(90deg,#d4a0bc,transparent)" }} />
                  </div>
                  <p className="font-cormorant italic text-[15.5px] text-[#8a6070] text-center leading-[1.6] mb-[14px]">
                    Con trân trọng kính mời gia đình mình<br />đến tham dự cùng
                  </p>
                  <div className="text-center mb-[18px]">
                    <span className="font-greatvibes text-[40px] text-[#b06080] leading-[1.1] block"
                      style={{ textShadow: "0 1px 0 rgba(255,255,255,0.9)" }}>Ngọc Mai</span>
                    <div className="flex items-center justify-center gap-[10px] mt-[6px]">
                      <div className="flex-1 max-w-[60px] h-[0.5px]" style={{ background: "rgba(200,140,170,0.5)" }} />
                      <FlowerIcon />
                      <span className="font-cormorant text-[11px] tracking-[3.5px] text-[#c090a8] uppercase">trong lễ tốt nghiệp</span>
                      <FlowerIcon />
                      <div className="flex-1 max-w-[60px] h-[0.5px]" style={{ background: "rgba(200,140,170,0.5)" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px] my-[16px]">
                    <div className="flex-1 h-[0.5px]" style={{ background: "linear-gradient(90deg,transparent,rgba(200,150,170,0.5),transparent)" }} />
                    <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
                      <path d="M14 2 Q18 6 14 10 Q10 6 14 2Z" fill="#e8a0c0" opacity="0.7" />
                      <path d="M14 10 Q18 12 16 16 Q13 14 14 10Z" fill="#c9956c" opacity="0.6" />
                      <path d="M14 10 Q10 12 12 16 Q15 14 14 10Z" fill="#c9956c" opacity="0.6" />
                      <circle cx="14" cy="10" r="1.8" fill="#c9956c" />
                    </svg>
                    <div className="flex-1 h-[0.5px]" style={{ background: "linear-gradient(90deg,transparent,rgba(200,150,170,0.5),transparent)" }} />
                  </div>
                  <div className="font-playfair text-[20px] text-[#5a2840] text-center tracking-[0.4px] mb-1">Lễ Tốt Nghiệp Đại Học</div>
                  <div className="font-cormorant italic text-[13.5px] text-[#9a7080] text-center mb-4">Học viện Báo chí và Tuyên truyền, Hà Nội</div>
                  <div className="flex flex-col gap-[10px] my-[10px]">
                    <div className="flex items-start gap-[12px]">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-[2px]"
                        style={{ border: "0.7px solid rgba(200,140,170,0.5)", background: "rgba(255,240,248,0.8)" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="5.5" stroke="#c090a8" strokeWidth="0.8" />
                          <path d="M7 4V7L9 9" stroke="#c090a8" strokeWidth="0.8" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-cormorant block text-[10px] tracking-[2.5px] uppercase text-[#c090a8]">Thời gian</span>
                        <span className="font-cormorant block text-[15.5px] text-[#4a2030] font-semibold leading-[1.3]">Chủ Nhật, 28 tháng 06 năm 2026</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[12px]">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-[2px]"
                        style={{ border: "0.7px solid rgba(200,140,170,0.5)", background: "rgba(255,240,248,0.8)" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1.5C5 1.5 3.5 3 3.5 5c0 3 3.5 7 3.5 7s3.5-4 3.5-7c0-2-1.5-3.5-3.5-3.5z" stroke="#c090a8" strokeWidth="0.8" />
                          <circle cx="7" cy="5" r="1.2" stroke="#c090a8" strokeWidth="0.7" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-cormorant block text-[10px] tracking-[2.5px] uppercase text-[#c090a8]">Địa điểm</span>
                        <span className="font-cormorant block text-[15.5px] text-[#4a2030] font-semibold leading-[1.3]">Học viện Báo chí và Tuyên truyền</span>
                        <span className="font-cormorant italic text-[13px] text-[#9a7080] block">36 Xuân Thuỷ, Cầu Giấy, Hà Nội</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[0.5px] my-[14px]" style={{ background: "linear-gradient(90deg,transparent,rgba(200,140,170,0.4),transparent)" }} />
                  <p className="font-cormorant italic text-[15px] text-[#7a5060] text-center leading-[1.7] mb-[10px]">
                    Sự hiện diện của gia đình<br />là món quà quý giá nhất của con trong ngày đặc biệt này 🌸
                  </p>
                </div>
              </div>
            </div>

            {/* ── Envelope body (renders ON TOP of card bottom via z-index) ── */}
            <div className="absolute inset-0 cursor-pointer" onClick={handleToggle} role="button" tabIndex={0}
              style={{
                background: "#fff8fb", borderRadius: "4px 4px 18px 18px",
                border: "1px solid #e8c0d0", overflow: "hidden", zIndex: 25,
                boxShadow: "0 8px 40px rgba(200,120,160,0.18),0 2px 8px rgba(200,120,160,0.10),inset 0 1px 0 rgba(255,255,255,0.9)"
              }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 110%,#fde8f0 0%,transparent 60%)" }} />
              <div className="absolute" style={{ left: "50%", top: 0, bottom: 0, width: "0.5px", background: "rgba(220,160,180,0.25)" }} />
              <div className="absolute" style={{ top: "50%", left: 0, right: 0, height: "0.5px", background: "rgba(220,160,180,0.15)" }} />

              <div className={`env-tri-l ${triOpen ? "open" : ""}`} />
              <div className={`env-tri-r ${triOpen ? "open" : ""}`} />
              <div className={`env-tri-b ${triBOpen ? "open" : ""}`} />
              <div className={`env-tri-b2 ${triBOpen ? "open" : ""}`} />

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 440 290" preserveAspectRatio="none">
                <path d="M0 0 L220 145 L440 0" fill="none" stroke="rgba(210,150,180,0.2)" strokeWidth="0.8" />
                <path d="M0 290 L220 145 L440 290" fill="none" stroke="rgba(210,150,180,0.15)" strokeWidth="0.6" />
                <rect x="20" y="20" width="400" height="250" rx="2" fill="none" stroke="rgba(210,150,180,0.2)" strokeWidth="0.5" />
                <circle cx="220" cy="145" r="30" fill="none" stroke="rgba(210,150,180,0.12)" strokeWidth="0.5" />
              </svg>

              {/* Flap */}
              <div className={`flap-group ${flapOpen ? "open" : ""}`}>
                <div style={{ width: 0, height: 0, borderLeft: "220px solid transparent", borderRight: "220px solid transparent", borderTop: "145px solid #fbe0ee" }} />
                <div className="absolute" style={{ top: 0, left: 60, width: 0, height: 0, borderLeft: "160px solid transparent", borderRight: "160px solid transparent", borderTop: "80px solid rgba(255,255,255,0.3)" }} />
              </div>

              {/* Seal */}
              <div className="absolute cursor-pointer transition-all duration-[400ms]"
                onClick={handleToggle} role="button" tabIndex={0}
                style={{
                  top: "50%", left: "50%", zIndex: 30,
                  transform: sealGone ? "translate(-50%,-50%) scale(0)" : "translate(-50%,-50%)",
                  opacity: sealGone ? 0 : 1, pointerEvents: sealGone ? "none" : "auto",
                  WebkitTapHighlightColor: "transparent"
                }}>
                <svg width="62" height="62" viewBox="0 0 62 62" className="seal-anim pointer-events-none">
                  <circle cx="31" cy="31" r="29" fill="#fff0f6" stroke="#d4a0bc" strokeWidth="1" />
                  <circle cx="31" cy="31" r="24" fill="none" stroke="#e8c0d4" strokeWidth="0.5" />
                  <path d="M31 12C31 12,34 18,31 24C28 18 31 12 31 12Z" fill="#e8a0c0" />
                  <path d="M31 24C31 24,38 25.5,36 31C32 29 31 24 31 24Z" fill="#f4c0d4" />
                  <path d="M31 24C31 24,24 25.5,26 31C30 29 31 24 31 24Z" fill="#e8b0cc" />
                  <path d="M31 24C31 24,38 20,42 24C39 28 31 24 31 24Z" fill="#e8a0c0" opacity="0.7" />
                  <path d="M31 24C31 24,24 20,20 24C23 28 31 24 31 24Z" fill="#e8a0c0" opacity="0.7" />
                  <circle cx="31" cy="24" r="3" fill="#c9956c" />
                  <circle cx="31" cy="24" r="1.4" fill="#fff8f2" />
                  <text x="31" y="46" textAnchor="middle" fontFamily="Cormorant Garamond,serif" fontSize="7" fill="#c090a8" letterSpacing="1.5">BẤM ĐỂ MỞ</text>
                </svg>
              </div>

              {/* Hint */}
              <div className="absolute bottom-[18px] left-1/2 font-cormorant text-[13px] tracking-[2px] text-[#c090a8] whitespace-nowrap hint-blink pointer-events-none transition-opacity duration-[400ms]"
                style={{ transform: "translateX(-50%)", opacity: sealGone ? 0 : 1 }}>
                ✦ Bấm vào phong bì để mở thiệp ✦
              </div>
            </div>
          </div>

          {/* Toggle button */}
          {btnVisible && (
            <button onClick={handleToggle}
              className="mt-7 flex items-center gap-[10px] px-7 py-[11px] font-cormorant text-[14px] tracking-[2px] text-[#b06080] rounded-full cursor-pointer btn-floatup transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.97]"
              style={{ background: "#fff8fb", border: "1px solid #e0b0c8", boxShadow: "0 2px 12px rgba(200,120,160,0.13)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fde8f2"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(200,120,160,0.22)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff8fb"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(200,120,160,0.13)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {isOpen
                  ? <path d="M4 4l8 8M12 4l-8 8" stroke="#b06080" strokeWidth="1.2" strokeLinecap="round" />
                  : <path d="M2 8h12M8 3l5 5-5 5" stroke="#b06080" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />}
              </svg>
              <span>{isOpen ? "Đóng thiệp lại" : "Mở thiệp ra"}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}