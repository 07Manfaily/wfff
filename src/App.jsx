import { useState, useEffect, useRef } from "react";

const ORANGE = "#FF6B00";
const ORANGE2 = "#FF8C00";
const GREEN = "#1C6B3A";
const BLACK = "#0A0A0A";
const DARK = "#111111";
const CARD = "rgba(255,255,255,0.04)";

/* ── Hook largeur écran ── */
const useWindowWidth = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
};

/* ── Reveal on scroll ── */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
};

/* ══════════════════════════════
   NAV
══════════════════════════════ */
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 768;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Vision", "Expériences", "Calendrier", "Contact"];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled || menuOpen ? "rgba(10,10,10,0.97)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(255,107,0,0.15)` : "none",
        transition: "all 0.4s ease",
        padding: isMobile ? "0 20px" : "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE2})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
          }}>⚽</div>
          <div>
            <div style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? 14 : 17, letterSpacing: 2, lineHeight: 1 }}>WORLD FOOTBALL</div>
            <div style={{ color: ORANGE, fontFamily: "'Bebas Neue', sans-serif", fontSize: 10, letterSpacing: 3, lineHeight: 1.3 }}>FAN FESTIVAL</div>
          </div>
        </div>

        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                style={{ color: "#aaa", textDecoration: "none", fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = ORANGE}
                onMouseLeave={e => e.target.style.color = "#aaa"}
              >{l}</a>
            ))}
            <a href="#contact" style={{
              background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE2})`,
              color: "#fff", padding: "9px 20px", borderRadius: 4,
              fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5,
              textTransform: "uppercase", textDecoration: "none", fontWeight: 700
            }}>Devenir Partenaire</a>
          </div>
        )}

        {isMobile && (
          <button onClick={() => setMenuOpen(p => !p)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 5, padding: 4
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 24, height: 2,
                background: menuOpen && i === 1 ? "transparent" : ORANGE,
                borderRadius: 2, transition: "all 0.3s",
                transform: menuOpen && i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : menuOpen && i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "none"
              }} />
            ))}
          </button>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 998,
          background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid rgba(255,107,0,0.15)`,
          padding: "24px 20px 32px", display: "flex", flexDirection: "column", gap: 20
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#ccc", textDecoration: "none",
                fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 500,
                letterSpacing: 2, textTransform: "uppercase",
                paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)"
              }}
            >{l}</a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{
            background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE2})`,
            color: "#fff", padding: "14px", borderRadius: 6, textAlign: "center",
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", textDecoration: "none"
          }}>Devenir Partenaire</a>
        </div>
      )}
    </>
  );
};

/* ══════════════════════════════
   HERO
══════════════════════════════ */
const Hero = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 60);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{
      minHeight: "100vh", position: "relative", background: BLACK,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", padding: "80px 24px 60px"
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,107,0,0.12) 0%, transparent 70%),
                     radial-gradient(ellipse 40% 40% at 80% 80%, rgba(28,107,58,0.08) 0%, transparent 60%)`,
      }} />

      {!isMobile && [...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: [120,80,60,100,70,90][i], height: [120,80,60,100,70,90][i],
          borderRadius: "50%",
          background: i % 2 === 0
            ? `radial-gradient(circle, rgba(255,107,0,0.15), transparent)`
            : `radial-gradient(circle, rgba(28,107,58,0.1), transparent)`,
          left: ["10%","85%","20%","70%","5%","90%"][i],
          top: ["20%","15%","75%","70%","50%","55%"][i],
          transform: `translateY(${Math.sin((tick / 60 + i) * 0.5) * 20}px)`,
          filter: "blur(20px)"
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "100%", maxWidth: 900 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,107,0,0.12)", border: `1px solid rgba(255,107,0,0.3)`,
          borderRadius: 100, padding: isMobile ? "5px 14px" : "6px 18px", marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE, display: "inline-block" }} />
          <span style={{ color: ORANGE, fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 10 : 11, letterSpacing: 2, textTransform: "uppercase" }}>
            Abidjan • Coupe du Monde 2026
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: isMobile ? "clamp(60px, 20vw, 100px)" : "clamp(80px, 12vw, 160px)",
          lineHeight: 0.85, margin: "0 0 8px",
        }}>
          <span style={{ display: "block", color: "#fff", letterSpacing: 4 }}>WORLD</span>
          <span style={{ display: "block", WebkitTextStroke: `2px ${ORANGE}`, color: "transparent", letterSpacing: 2 }}>FOOTBALL</span>
          <span style={{ display: "block", color: ORANGE, letterSpacing: isMobile ? 4 : 8, fontSize: isMobile ? "clamp(18px, 6vw, 36px)" : "clamp(24px, 5vw, 56px)", marginTop: 8 }}>
            FAN FESTIVAL
          </span>
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 14 : 16,
          color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "28px auto 40px",
          lineHeight: 1.8, padding: "0 8px"
        }}>
          L'ultime célébration du football à Abidjan. Une fan zone immersive mêlant sport, culture, musique et gastronomie pendant toute la durée du Mondial.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#vision" style={{
            background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE2})`,
            color: "#fff", padding: isMobile ? "13px 22px" : "15px 32px", borderRadius: 4,
            fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 11 : 12, fontWeight: 700,
            letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none",
            boxShadow: `0 0 40px rgba(255,107,0,0.35)`
          }}>Découvrir le Projet</a>
          <a href="#contact" style={{
            border: `1px solid rgba(255,255,255,0.2)`, color: "#fff",
            padding: isMobile ? "13px 22px" : "15px 32px", borderRadius: 4,
            fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 11 : 12, fontWeight: 700,
            letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none",
            background: "rgba(255,255,255,0.04)"
          }}>Devenir Partenaire</a>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? 16 : 0,
          marginTop: 52, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 36
        }}>
          {[["104", "Matchs"], ["48", "Nations"], ["200K+", "Visiteurs"], ["39", "Jours"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center", padding: "0 16px", borderRight: !isMobile ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? 34 : 44, color: ORANGE, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════
   VISION
══════════════════════════════ */
const Vision = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <section id="vision" style={{ background: DARK, padding: isMobile ? "72px 20px" : "120px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 2, background: ORANGE }} />
            <span style={{ color: ORANGE, fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Notre Vision</span>
          </div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? "clamp(38px, 11vw, 65px)" : "clamp(48px, 7vw, 90px)",
            color: "#fff", margin: "0 0 16px", lineHeight: 0.92, letterSpacing: 2
          }}>
            VIVRE LA COUPE DU MONDE<br />
            <span style={{ color: ORANGE }}>ENSEMBLE, À ABIDJAN</span>
          </h2>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 36 : 60, marginTop: 48, alignItems: "center"
        }}>
          <Reveal delay={0.1}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Outfit', sans-serif", fontSize: isMobile ? 14 : 16, lineHeight: 1.9 }}>
              Tous les quatre ans, la Coupe du Monde fait vibrer la planète entière. Le{" "}
              <strong style={{ color: "#fff" }}>World Football Fan Festival</strong> est un concept d'événements immersifs permettant aux fans de vivre la compétition dans une atmosphère festive unique au cœur d'Abidjan.
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.9, marginTop: 16 }}>
              La Côte d'Ivoire, avec sa population jeune et passionnée de football, est le terrain idéal pour rassembler supporters locaux, diaspora africaine et européenne, touristes et fans du monde entier.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["⚽", "Football", "Retransmission sur écrans géants avec ambiance stade"],
                ["🎵", "Musique", "Concerts live, DJs et performances culturelles chaque semaine"],
                ["🍽️", "Gastronomie", "Village culinaire : cuisine africaine, européenne, street food"],
                ["🎮", "Gaming", "Mega Gaming Zone, tournois e-sport et expériences VR"],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{
                  background: CARD, border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: isMobile ? 16 : 20,
                  transition: "border-color 0.3s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(255,107,0,0.3)`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                  <div style={{ color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{title}</div>
                  <div style={{ color: "#555", fontFamily: "'Outfit', sans-serif", fontSize: 11, lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════
   EXPÉRIENCES
══════════════════════════════ */
const experiences = [
  { icon: "📺", tag: "LIVE MATCHES", title: "Diffusion des Matchs", color: ORANGE,
    desc: "Écrans géants, ambiance stade authentique, zones supporters dédiées, animations avant et après chaque match." },
  { icon: "🏪", tag: "BRAND EXPERIENCE", title: "Brand Experience Village", color: GREEN,
    desc: "Chaque marque partenaire dispose de son espace d'activation : jeux interactifs, challenges, expériences immersives." },
  { icon: "🎮", tag: "E-SPORT & GAMING", title: "Mega Gaming Zone", color: ORANGE,
    desc: "Zone dédiée au gaming : tournois FIFA, compétitions entre supporters, expériences VR football." },
  { icon: "🍽️", tag: "FOOD & CULTURE", title: "Food & Culture Festival", color: GREEN,
    desc: "Village culinaire et culturel : cuisine africaine, gastronomie européenne, street food internationale." },
  { icon: "🎤", tag: "LIVE ENTERTAINMENT", title: "Concerts & Live Shows", color: ORANGE,
    desc: "Chaque semaine : concerts d'artistes, DJs sets, spectacles live et shows culturels." },
  { icon: "🎁", tag: "REWARDS", title: "Jeux & Récompenses", color: GREEN,
    desc: "Pronostics, défis football, challenges gaming, tirages au sort avec récompenses VIP." },
];

const Experiences = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;
  const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)";

  return (
    <section id="experiences" style={{ background: BLACK, padding: isMobile ? "72px 20px" : "120px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 2, background: ORANGE }} />
            <span style={{ color: ORANGE, fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Ce Que Nous Offrons</span>
          </div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? "clamp(38px, 11vw, 65px)" : "clamp(48px, 7vw, 90px)",
            color: "#fff", margin: 0, lineHeight: 0.92, letterSpacing: 2
          }}>
            LES EXPÉRIENCES<br /><span style={{ color: ORANGE }}>DU FESTIVAL</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 14, marginTop: 48 }}>
          {experiences.map((exp, i) => (
            <Reveal key={exp.title} delay={isMobile ? 0 : i * 0.06}>
              <div style={{
                background: CARD, border: `1px solid rgba(255,255,255,0.06)`,
                borderRadius: 14, padding: isMobile ? 22 : 26,
                position: "relative", overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${exp.color}44`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  position: "absolute", top: 0, right: 0, width: 90, height: 90,
                  background: `radial-gradient(circle at 100% 0%, ${exp.color}18, transparent 70%)`,
                }} />
                <div style={{
                  display: "inline-block", background: `${exp.color}18`,
                  border: `1px solid ${exp.color}33`, borderRadius: 5,
                  padding: "3px 9px", marginBottom: 14,
                  color: exp.color, fontFamily: "'Outfit', sans-serif",
                  fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700
                }}>{exp.tag}</div>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{exp.icon}</div>
                <h3 style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1.5, margin: "0 0 10px" }}>{exp.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.75, margin: 0 }}>{exp.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════
   CALENDRIER
══════════════════════════════ */
const phases = [
  { phase: "PHASE 1", label: "Préparation", dates: "1 mai — 5 juin 2026", color: ORANGE,
    items: ["Installation & tests techniques", "Conférence de presse", "Soirée de lancement", "RDV Partenaires & Institutionnels", "Billetterie & Communication", "Espace jeux enfants", "Tournoi e-sport", "Soirées VIP thématiques"] },
  { phase: "PHASE 2", label: "Phase de Poules", dates: "11 — 27 juin 2026", color: GREEN,
    items: ["Visionnage matchs sur tribunes géantes", "Brand Experience Village actif", "Food & Culture Festival", "Concerts & Live Entertainment", "Jeux concours & récompenses", "Activations digitales quotidiennes"] },
  { phase: "PHASE 3", label: "Finales", dates: "Début juillet — 19 juillet 2026", color: ORANGE,
    items: ["1/16 de finale à la Finale", "Soirées VIP thématiques", "Concerts & shows d'exception", "Grand tirage final & récompenses VIP", "Billetterie & Communication continue"] },
];

const Calendrier = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;
  const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)";

  return (
    <section id="calendrier" style={{ background: DARK, padding: isMobile ? "72px 20px" : "120px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 2, background: ORANGE }} />
            <span style={{ color: ORANGE, fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Organisation</span>
          </div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? "clamp(38px, 11vw, 65px)" : "clamp(48px, 7vw, 90px)",
            color: "#fff", margin: 0, lineHeight: 0.92, letterSpacing: 2
          }}>
            CALENDRIER<br /><span style={{ color: ORANGE }}>DES ACTIVITÉS</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 14, marginTop: 48 }}>
          {phases.map((ph, i) => (
            <Reveal key={ph.phase} delay={isMobile ? 0 : i * 0.1}>
              <div style={{
                background: CARD, border: `1px solid ${ph.color}22`,
                borderRadius: 14, overflow: "hidden",
                transition: "transform 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ background: `linear-gradient(135deg, ${ph.color}, ${ph.color}88)`, padding: "20px 22px" }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", marginBottom: 4 }}>{ph.phase}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "#fff", letterSpacing: 2, lineHeight: 1 }}>{ph.label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{ph.dates}</div>
                </div>
                <div style={{ padding: "18px 22px" }}>
                  {ph.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: ph.color, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════
   CONTACT
══════════════════════════════ */
const Contact = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", societe: "", message: "" });

  return (
    <section id="contact" style={{ background: BLACK, padding: isMobile ? "72px 20px" : "120px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 48 : 80, alignItems: "start"
        }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 2, background: ORANGE }} />
              <span style={{ color: ORANGE, fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Partnership</span>
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: isMobile ? "clamp(38px, 11vw, 65px)" : "clamp(48px, 6vw, 80px)",
              color: "#fff", margin: "0 0 18px", lineHeight: 0.92, letterSpacing: 2
            }}>
              REJOIGNEZ<br /><span style={{ color: ORANGE }}>L'AVENTURE</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.9 }}>
              Vous souhaitez devenir partenaire du World Football Fan Festival ? Contactez-nous pour découvrir nos offres de sponsoring et d'activation de marque.
            </p>
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                ["📧", "Email", "infos@ala.ci"],
                ["📞", "France", "+33 6 21 32 00 94"],
                ["📞", "Côte d'Ivoire", "+225 05 94 70 80 17"],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `rgba(255,107,0,0.1)`, border: `1px solid rgba(255,107,0,0.2)`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                  }}>{icon}</div>
                  <div>
                    <div style={{ color: "#555", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
                    <div style={{ color: "#ddd", fontFamily: "'Outfit', sans-serif", fontSize: 13, marginTop: 2 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: "#444", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Organisé par</div>
              <div style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3 }}>AFRICAN LEGACY AGENCY</div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: isMobile ? 22 : 34
            }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: 44, marginBottom: 16 }}>✅</div>
                  <h3 style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 2, margin: "0 0 10px" }}>MESSAGE ENVOYÉ !</h3>
                  <p style={{ color: "#555", fontFamily: "'Outfit', sans-serif", fontSize: 13 }}>Notre équipe vous contactera dans les plus brefs délais.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, margin: "0 0 22px" }}>DEMANDE DE PARTENARIAT</h3>
                  {[
                    { key: "nom", label: "Nom & Prénom", type: "text", placeholder: "Jean Dupont" },
                    { key: "email", label: "Email professionnel", type: "email", placeholder: "contact@entreprise.com" },
                    { key: "societe", label: "Société / Organisation", type: "text", placeholder: "Nom de votre entreprise" },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", color: "#555", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 7 }}>{label}</label>
                      <input type={type} placeholder={placeholder}
                        value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                          padding: "13px 14px", color: "#fff",
                          fontFamily: "'Outfit', sans-serif", fontSize: 14,
                          outline: "none", boxSizing: "border-box"
                        }}
                        onFocus={e => e.target.style.borderColor = ORANGE}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: 22 }}>
                    <label style={{ display: "block", color: "#555", fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 7 }}>Message</label>
                    <textarea rows={4} placeholder="Décrivez votre intérêt pour un partenariat..."
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                        padding: "13px 14px", color: "#fff",
                        fontFamily: "'Outfit', sans-serif", fontSize: 14,
                        outline: "none", boxSizing: "border-box", resize: "vertical"
                      }}
                      onFocus={e => e.target.style.borderColor = ORANGE}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </div>
                  <button onClick={() => setSent(true)} style={{
                    width: "100%", background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE2})`,
                    color: "#fff", border: "none", borderRadius: 8, padding: "15px",
                    fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700,
                    letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
                    boxShadow: `0 0 30px rgba(255,107,0,0.25)`
                  }}>Envoyer ma Demande →</button>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════
   FOOTER
══════════════════════════════ */
const Footer = () => (
  <footer style={{
    background: "#080808", borderTop: "1px solid rgba(255,255,255,0.05)",
    padding: "32px 20px", textAlign: "center"
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚽</div>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#fff", fontSize: 14, letterSpacing: 3 }}>WORLD FOOTBALL FAN FESTIVAL</span>
    </div>
    <p style={{ color: "#333", fontFamily: "'Outfit', sans-serif", fontSize: 11, margin: 0, letterSpacing: 1 }}>
      © 2026 African Legacy Agency — Tous droits réservés. Document confidentiel.
    </p>
  </footer>
);

/* ══════════════════════════════
   APP
══════════════════════════════ */
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0A0A0A; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(255,107,0,0.3); color: #fff; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #FF6B00; border-radius: 2px; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        input, textarea, button { -webkit-appearance: none; font-family: inherit; }
        a { -webkit-tap-highlight-color: transparent; }
      `}</style>
      <Nav />
      <Hero />
      <Vision />
      <Experiences />
      <Calendrier />
      <Contact />
      <Footer />
    </>
  );
}