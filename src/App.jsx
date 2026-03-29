import { useState, useEffect, useRef } from "react";
// ─── Design Tokens ───────────────────────────────────────────────────────────
// Palette: warm sand, deep ocean navy, sun gold, fresh sage
// Fonts: Playfair Display (display) + DM Sans (body)
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:   #0f2240;
    --navy2:  #1a3358;
    --gold:   #f5a800;
    --gold2:  #ffc130;
    --orange: #e85d00;
    --blue:   #1a8fc1;
    --sand:   #f7f4ef;
    --sand2:  #ede8de;
    --sage:   #1a8fc1;
    --sage2:  #3aa8d8;
    --white:  #ffffff;
    --text:   #0f2240;
    --muted:  #5a6e82;
    --radius: 16px;
    --radius-sm: 8px;
  }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--sand);
    color: var(--text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 {
    font-family: 'Playfair Display', serif;
    line-height: 1.2;
  }
  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px;
    height: 68px;
    background: rgba(247,242,234,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(26,46,68,0.08);
    transition: box-shadow 0.3s;
  }
  .nav.scrolled { box-shadow: 0 2px 24px rgba(26,46,68,0.1); }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 900;
    color: var(--navy);
    cursor: pointer;
    letter-spacing: -0.02em;
  }
  .nav-logo span { color: var(--gold); }
  .nav-links { display: flex; gap: 8px; align-items: center; }
  .nav-link {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    color: var(--muted); padding: 8px 14px; border-radius: 99px;
    transition: color 0.2s, background 0.2s;
  }
  .nav-link:hover { color: var(--navy); background: var(--sand2); }
  .nav-link.active { color: var(--navy); font-weight: 600; }
  .nav-cta {
    background: var(--navy); color: var(--white);
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
    padding: 10px 22px; border-radius: 99px;
    transition: background 0.2s, transform 0.15s;
  }
  .nav-cta:hover { background: var(--navy2); transform: translateY(-1px); }
  .nav-mobile-toggle {
    display: none; background: none; border: none; cursor: pointer;
    font-size: 1.4rem; color: var(--navy);
  }
  /* ── Page wrapper ── */
  .page { min-height: 100vh; padding-top: 68px; }
  /* ── Hero ── */
  .hero {
    position: relative; overflow: hidden;
    background: var(--navy);
    padding: 100px 40px 80px;
    min-height: 88vh;
    display: flex; align-items: center;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 70% 40%, rgba(232,93,0,0.22) 0%, transparent 65%),
                radial-gradient(ellipse 50% 80% at 10% 80%, rgba(26,143,193,0.2) 0%, transparent 60%);
  }
  .hero-net {
    position: absolute; right: -40px; top: 0; bottom: 0; width: 55%;
    opacity: 0.06;
    background-image: repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 48px),
                      repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 48px);
  }
  .hero-content { position: relative; max-width: 640px; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,160,32,0.15); border: 1px solid rgba(232,160,32,0.3);
    color: var(--gold2); font-size: 0.8rem; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 99px; margin-bottom: 24px;
  }
  .hero h1 {
    font-size: clamp(2.8rem, 6vw, 5rem);
    color: var(--white); margin-bottom: 24px;
    font-style: italic;
  }
  .hero h1 em { font-style: normal; color: var(--gold); }
  .hero-sub {
    font-size: 1.15rem; color: rgba(255,255,255,0.75);
    max-width: 500px; margin-bottom: 40px; font-weight: 300;
  }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
  .btn-primary {
    background: var(--gold); color: var(--navy);
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700;
    padding: 15px 32px; border-radius: 99px;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(232,160,32,0.35);
  }
  .btn-primary:hover { background: var(--gold2); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(232,160,32,0.45); }
  .btn-outline {
    background: transparent; color: var(--white);
    border: 2px solid rgba(255,255,255,0.3); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
    padding: 13px 30px; border-radius: 99px;
    transition: border-color 0.2s, background 0.2s;
  }
  .btn-outline:hover { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.07); }
  .hero-stats {
    display: flex; gap: 40px; margin-top: 64px; flex-wrap: wrap;
  }
  .hero-stat { }
  .hero-stat-num {
    font-family: 'Playfair Display', serif; font-size: 2.2rem;
    color: var(--gold); font-weight: 900;
  }
  .hero-stat-label { font-size: 0.82rem; color: rgba(255,255,255,0.55); font-weight: 500; margin-top: 2px; }
  /* ── Section shells ── */
  .section { padding: 88px 40px; max-width: 1160px; margin: 0 auto; }
  .section-full { padding: 88px 40px; }
  .section-label {
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--sage); margin-bottom: 16px;
  }
  .section-title { font-size: clamp(2rem, 4vw, 3rem); color: var(--navy); margin-bottom: 20px; }
  .section-sub { font-size: 1.05rem; color: var(--muted); max-width: 560px; margin-bottom: 48px; font-weight: 300; }
  /* ── Why strip ── */
  .why-strip {
    background: var(--navy);
    padding: 72px 40px;
  }
  .why-inner { max-width: 1160px; margin: 0 auto; }
  .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px; margin-top: 48px; }
  .why-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--radius);
    padding: 32px 28px;
    transition: background 0.2s, transform 0.2s;
  }
  .why-card:hover { background: rgba(255,255,255,0.09); transform: translateY(-3px); }
  .why-icon { font-size: 2rem; margin-bottom: 16px; }
  .why-card h3 { font-family: 'Playfair Display', serif; color: var(--white); font-size: 1.2rem; margin-bottom: 10px; }
  .why-card p { color: rgba(255,255,255,0.6); font-size: 0.92rem; font-weight: 300; line-height: 1.65; }
  .why-title { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem,4vw,2.8rem); color: var(--white); }
  .why-title em { color: var(--gold); font-style: italic; }
  /* ── Clinics page ── */
  .clinics-hero {
    background: var(--sand2);
    padding: 64px 40px 48px;
    border-bottom: 1px solid rgba(26,46,68,0.08);
  }
  .clinics-hero-inner { max-width: 1160px; margin: 0 auto; }
  .clinics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 0; }
  .clinic-card {
    background: var(--white);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(26,46,68,0.07);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; flex-direction: column;
  }
  .clinic-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(26,46,68,0.12); }
  .clinic-card-header { padding: 20px 24px 16px; position: relative; }
  .clinic-tag {
    display: inline-block; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 99px; margin-bottom: 12px;
  }
  .tag-beginner { background: #e8f5ed; color: #2d7a50; }
  .tag-intermediate { background: #fff4e0; color: #b07000; }
  .tag-advanced { background: #e8eeff; color: #2d4db8; }
  .tag-position { background: #f5e8ff; color: #6b30a8; }
  .clinic-card h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: var(--navy); margin-bottom: 6px; }
  .clinic-card-meta { display: flex; gap: 16px; flex-wrap: wrap; padding: 0 24px 16px; }
  .clinic-meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.83rem; color: var(--muted); font-weight: 500; }
  .clinic-card-body { padding: 0 24px 20px; flex: 1; }
  .clinic-card-body p { font-size: 0.9rem; color: var(--muted); font-weight: 300; line-height: 1.65; }
  .clinic-card-footer { padding: 16px 24px; border-top: 1px solid rgba(26,46,68,0.07); display: flex; justify-content: space-between; align-items: center; }
  .clinic-price { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--navy); }
  .clinic-price span { font-size: 0.8rem; font-family: 'DM Sans', sans-serif; color: var(--muted); font-weight: 400; }
  .btn-register {
    background: var(--navy); color: var(--white);
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    padding: 10px 20px; border-radius: 99px;
    transition: background 0.2s;
    text-decoration: none; display: inline-block;
  }
  .btn-register:hover { background: var(--navy2); }
  .filter-bar { display: flex; gap: 10px; flex-wrap: wrap; margin: 32px 0; }
  .filter-btn {
    background: var(--white); border: 2px solid rgba(26,46,68,0.12);
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    padding: 8px 20px; border-radius: 99px; color: var(--muted);
    transition: all 0.2s;
  }
  .filter-btn.active, .filter-btn:hover { background: var(--navy); color: var(--white); border-color: var(--navy); }
  /* ── How it works ── */
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; }
  .step-card {
    background: var(--white); border-radius: var(--radius);
    padding: 40px 32px;
    box-shadow: 0 2px 16px rgba(26,46,68,0.06);
    position: relative; overflow: hidden;
  }
  .step-num {
    font-family: 'Playfair Display', serif; font-size: 5rem;
    color: rgba(26,46,68,0.05); font-weight: 900;
    position: absolute; top: 12px; right: 20px; line-height: 1;
  }
  .step-icon { font-size: 2.2rem; margin-bottom: 20px; }
  .step-card h3 { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: var(--navy); margin-bottom: 12px; }
  .step-card p { font-size: 0.92rem; color: var(--muted); font-weight: 300; line-height: 1.7; }
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 40px; }
  .skill-chip {
    background: var(--white); border: 1px solid rgba(26,46,68,0.1);
    border-radius: var(--radius-sm); padding: 16px 20px;
    display: flex; align-items: center; gap: 12px;
    font-size: 0.9rem; font-weight: 500; color: var(--navy);
    box-shadow: 0 1px 6px rgba(26,46,68,0.05);
  }
  .skill-chip span:first-child { font-size: 1.4rem; }
  /* ── About ── */
  .about-founder {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  .founder-visual {
    border-radius: var(--radius);
    overflow: hidden;
  }
  .founder-monogram {
    font-family: 'Playfair Display', serif; font-size: 6rem;
    color: rgba(255,255,255,0.08); font-style: italic; line-height: 1;
    position: absolute; bottom: 16px; right: 24px;
  }
  .founder-badge {
    background: var(--gold); color: var(--navy);
    padding: 8px 20px; border-radius: 99px;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; z-index: 1; margin-bottom: 16px;
  }
  .founder-detail {
    color: rgba(255,255,255,0.9); font-size: 1rem; font-weight: 300;
    text-align: center; z-index: 1; line-height: 1.7;
  }
  .founder-detail strong { font-weight: 600; color: var(--white); }
  .about-text h2 { margin-bottom: 24px; }
  .about-text p { color: var(--muted); font-size: 1rem; font-weight: 300; line-height: 1.8; margin-bottom: 20px; }
  .cred-list { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
  .cred-item {
    display: flex; align-items: flex-start; gap: 14px;
    background: var(--sand2); border-radius: var(--radius-sm); padding: 14px 18px;
  }
  .cred-icon { font-size: 1.2rem; flex-shrink: 0; }
  .cred-text { font-size: 0.9rem; color: var(--navy); font-weight: 500; line-height: 1.4; }
  .cred-text span { display: block; font-weight: 300; color: var(--muted); font-size: 0.85rem; margin-top: 2px; }
  .board-section { margin-top: 80px; }
  .board-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 32px; }
  .board-card {
    background: var(--white); border-radius: var(--radius); padding: 28px 24px;
    box-shadow: 0 2px 12px rgba(26,46,68,0.06); border: 1px solid rgba(26,46,68,0.07);
    display: flex; flex-direction: column; gap: 6px;
  }
  .board-card-header { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
  .board-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--blue)); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
  }
  .board-card h4 { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 2px; }
  .board-role { font-size: 0.78rem; color: var(--gold); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .board-bio { font-size: 0.85rem; color: var(--muted); line-height: 1.65; font-weight: 300; }
  /* ── Donate ── */
  .donate-hero {
    background: var(--navy);
    padding: 88px 40px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .donate-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(26,143,193,0.3), transparent 60%),
                radial-gradient(ellipse at 100% 100%, rgba(232,93,0,0.2), transparent 50%);
  }
  .donate-hero h1 { color: var(--white); margin-bottom: 20px; font-size: clamp(2.2rem,5vw,4rem); }
  .donate-hero p { color: rgba(255,255,255,0.8); font-size: 1.1rem; font-weight: 300; max-width: 580px; margin: 0 auto 40px; }
  .donate-amounts { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 16px; }
  .donate-amount-btn {
    background: rgba(255,255,255,0.12); border: 2px solid rgba(255,255,255,0.2);
    color: var(--white); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 700;
    padding: 16px 32px; border-radius: var(--radius);
    transition: all 0.2s; min-width: 100px;
  }
  .donate-amount-btn:hover, .donate-amount-btn.selected {
    background: var(--white); color: var(--sage); border-color: var(--white);
  }
  .donate-impact { max-width: 1160px; margin: 64px auto 0; padding: 0 40px; }
  .impact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
  .impact-card {
    background: var(--white); border-radius: var(--radius); padding: 32px 28px;
    box-shadow: 0 2px 12px rgba(26,46,68,0.07);
    border-top: 4px solid var(--orange);
  }
  .impact-amount { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--gold); margin-bottom: 8px; }
  .impact-card h4 { font-size: 1rem; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
  .impact-card p { font-size: 0.87rem; color: var(--muted); font-weight: 300; line-height: 1.6; }
  .donate-form-section { max-width: 560px; margin: 64px auto; padding: 0 40px; }
  .donate-form {
    background: var(--white); border-radius: var(--radius);
    padding: 40px; box-shadow: 0 4px 24px rgba(26,46,68,0.1);
  }
  .form-group { margin-bottom: 20px; }
  .form-label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
  .form-input {
    width: 100%; padding: 12px 16px; border-radius: var(--radius-sm);
    border: 2px solid rgba(26,46,68,0.12); background: var(--sand);
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--navy);
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--sage); }
  .btn-donate {
    width: 100%; background: var(--gold); color: var(--navy);
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 1.05rem; font-weight: 700;
    padding: 16px; border-radius: var(--radius-sm);
    transition: background 0.2s, transform 0.15s;
    margin-top: 8px;
  }
  .btn-donate:hover { background: var(--gold2); transform: translateY(-1px); }
  /* ── Testimonial band ── */
  .testimonial-band { background: var(--sand2); padding: 72px 40px; }
  .testimonial-inner { max-width: 1160px; margin: 0 auto; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 40px; }
  .testimonial-card {
    background: var(--white); border-radius: var(--radius); padding: 32px 28px;
    box-shadow: 0 2px 12px rgba(26,46,68,0.06);
  }
  .testimonial-quote { font-size: 2.5rem; color: var(--gold); line-height: 1; margin-bottom: 12px; font-family: serif; }
  .testimonial-card p { font-size: 0.93rem; color: var(--navy); font-style: italic; line-height: 1.75; margin-bottom: 20px; font-weight: 300; }
  .testimonial-author { display: flex; align-items: center; gap: 12px; }
  .testimonial-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--sand2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
  .testimonial-name { font-size: 0.87rem; font-weight: 600; color: var(--navy); }
  .testimonial-role { font-size: 0.78rem; color: var(--muted); }
  /* ── Footer ── */
  .footer { background: var(--navy); padding: 64px 40px 40px; color: rgba(255,255,255,0.7); }
  .footer-inner { max-width: 1160px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .footer-brand h3 { font-family: 'Playfair Display', serif; color: var(--white); font-size: 1.4rem; margin-bottom: 12px; }
  .footer-brand h3 span { color: var(--gold); }
  .footer-brand p { font-size: 0.88rem; font-weight: 300; line-height: 1.7; max-width: 300px; }
  .footer-col h4 { color: var(--white); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; font-family: 'DM Sans', sans-serif; font-weight: 700; }
  .footer-link { display: block; font-size: 0.88rem; color: rgba(255,255,255,0.6); margin-bottom: 10px; cursor: pointer; transition: color 0.2s; background: none; border: none; font-family: 'DM Sans', sans-serif; text-align: left; }
  .footer-link:hover { color: var(--gold); }
  .footer-bottom { padding-top: 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .footer-bottom p { font-size: 0.82rem; }
  .footer-tagline { font-family: 'Playfair Display', serif; color: var(--gold); font-style: italic; font-size: 0.88rem; }
  /* ── Responsive ── */
  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .nav-links { display: none; }
    .nav-mobile-toggle { display: block; }
    .nav-links.open {
      display: flex; flex-direction: column; align-items: flex-start;
      position: fixed; top: 68px; left: 0; right: 0;
      background: var(--sand); padding: 20px; gap: 4px;
      box-shadow: 0 8px 24px rgba(26,46,68,0.12);
    }
    .hero { padding: 72px 20px 56px; min-height: auto; }
    .section, .section-full { padding: 64px 20px; }
    .about-founder { grid-template-columns: 1fr; gap: 40px; }
    .footer-top { grid-template-columns: 1fr; gap: 32px; }
    .donate-hero { padding: 64px 20px; }
    .why-strip { padding: 56px 20px; }
    .clinics-hero { padding: 48px 20px 32px; }
  }
`;
// ─── Data ────────────────────────────────────────────────────────────────────
const CLINICS = [
  { id: 3, title: "All Skills", tag: "intermediate", tagLabel: "Intermediate", date: "Sat, Apr 11", time: "3:45–5:15 PM", grade: "4th–8th Grade (co-ed)", location: "Lincoln Middle School", focus: "All Skills", registrations: [{ price: 25, priceUnit: "SMMUSD athlete", href: "https://form.jotform.com/260528534420048" }, { price: 30, priceUnit: "Non-district athlete", href: "https://form.jotform.com/smzbaker/volleyball-clinic-registration---pr" }], description: "Perfect entry point for middle schoolers building on core volleyball skills. We'll cover platform passing and serve receive positioning, as well as approach footwork and arm swing mechanics. We'll also integrate some fun games like queen of the court.", spotsLeft: true, icon: "🏐" },
  { id: 1, title: "All Skills", tag: "intermediate", tagLabel: "Intermediate", date: "Sat, May 9", time: "3:45–5:15 PM", grade: "4th–8th Grade (co-ed)", location: "Lincoln Middle School", focus: "All Skills", price: 35, description: "Perfect entry point for middle schoolers building on core volleyball skills. We'll cover platform passing and serve receive positioning, as well as approach footwork and arm swing mechanics. We'll also integrate some fun games like queen of the court.", boldSuffix: "This session will include OCAA Coach Patrick Gallagher, as well as Coach Olivier Ged who played as an Opposite at the college level for Université de Lyon and is a current head coach at a westside volleyball club.", icon: "🏐", buttonLabel: "Register →" },
  { id: 7, title: "All Skills", tag: "intermediate", tagLabel: "Intermediate", date: "Sat, May 30", time: "3:45–5:15 PM", grade: "4th–8th Grade (co-ed)", location: "Lincoln Middle School", focus: "All Skills", price: 35, description: "Perfect entry point for middle schoolers building on core volleyball skills. We'll cover platform passing and serve receive positioning, as well as approach footwork and arm swing mechanics. We'll also integrate some fun games like queen of the court.", boldSuffix: "This session will include OCAA Coach Patrick Gallagher, as well as Coach Olivier Ged who played as an Opposite at the college level for Université de Lyon and is a current head coach at a westside volleyball club.", icon: "🏐", buttonLabel: "Register →" },
  { id: 8, title: "All Skills", tag: "intermediate", tagLabel: "Intermediate", date: "Sat, June 6", time: "3:45–5:15 PM", grade: "4th–8th Grade (co-ed)", location: "Lincoln Middle School", focus: "All Skills", price: 35, description: "Perfect entry point for middle schoolers building on core volleyball skills. We'll cover platform passing and serve receive positioning, as well as approach footwork and arm swing mechanics. We'll also integrate some fun games like queen of the court.", boldSuffix: "This session will include OCAA Coach Patrick Gallagher, as well as Coach Olivier Ged who played as an Opposite at the college level for Université de Lyon and is a current head coach at a westside volleyball club.", icon: "🏐", buttonLabel: "Register →" },
  { id: 4, title: "Elementary Intro", tag: "beginner", tagLabel: "Beginner", date: "Not Yet Scheduled", time: "3:45–5:15 PM", grade: "2nd–5th Grade", location: "Lincoln Middle School", focus: "Basic Skills & Fun", price: 25, description: "A fun, welcoming introduction to volleyball for younger athletes. Emphasis on enthusiasm, basic ball control, and building a love for the sport.", icon: "⭐", buttonLabel: "Express Interest →" },
  { id: 5, title: "Pre-Season Prep", tag: "advanced", tagLabel: "Advanced", date: "Not Yet Scheduled", time: "3:45–5:15 PM", grade: "6th–8th Grade", location: "Lincoln Middle School", focus: "Full Skill Integration", price: 50, description: "High-intensity session designed for players preparing for tryouts or upcoming school seasons. Competitive drills, serving mechanics, and game IQ.", icon: "🎯", buttonLabel: "Express Interest →" },
  { id: 6, title: "Parent & Me", tag: "intermediate", tagLabel: "Intermediate", date: "Not Yet Scheduled", time: "3:45–5:15 PM", grade: "All Ages", location: "Lincoln Middle School", focus: "Basic Skills & Fun", price: 15, priceUnit: "person", description: "A fun opportunity for parents who love volleyball to share the game with their kids through relaxed play and simple drills.", icon: "👨‍👩‍👧", buttonLabel: "Express Interest →" },
];
const TESTIMONIALS = [
  { quote: "My daughter has gained so much confidence since attending Open Court clinics. The coaches really break things down in a way that clicks.", name: "Michal O.", role: "Parent" },
  { quote: "Quality coaching that fits our schedule and budget. No pressure, just real skill development.", name: "Katie S.", role: "Parent" },
];
const BOARD = [
  { name: "Patrick Gallagher", role: "Board President", icon: "🏆", bio: "Patrick played at Windward High School, where he earned multiple Team MVP awards, League MVP honors, three All-League selections, and an All-CIF selection. He went on to compete with SMBC, winning a Junior Olympics gold medal and earning First Team All-American recognition." },
  { name: "Sarah Gallagher", role: "Co-Founder & Board Member", icon: "🏐", bio: "Sarah played competitively in high school and has played in several local indoor and beach volleyball leagues. As a parent of current youth athletes, she brings a player's perspective and a strong background in leadership, communications, and nonprofit strategy." },
  { name: "Sarah Ballog Smith", role: "Secretary", icon: "⚖️", bio: "Sarah played volleyball at Northwestern (Chicago) and has played in several local indoor and beach volleyball leagues. As a seasoned local attorney, she also brings strong governance and organizational leadership experience to the board." },
  { name: "Jennifer Anderson", role: "Board Member", icon: "🎓", bio: "Jennifer played at Crossroads High School and now teaches there, where she coaches the 6th grade girls volleyball team. She has also played in several local indoor and beach volleyball leagues, bringing valuable insight into youth development and school athletics." },
  { name: "Wes Larmore", role: "Treasurer", icon: "📊", bio: "Wes has competed in multiple Westside volleyball leagues and brings financial oversight and community engagement experience to the organization. He ensures Open Court operates with transparency and fiscal responsibility." },
];
// ─── Components ──────────────────────────────────────────────────────────────
function Nav({ currentPage, setCurrentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["Home", "Clinics", "How It Works", "About", "Donate"];
  const keys = ["home", "clinics", "howitworks", "about", "donate"];
  const go = (key) => { setCurrentPage(key); setMobileOpen(false); window.scrollTo(0,0); };
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-logo" onClick={() => go("home")}>Open <span>Court</span></div>
      <div className={`nav-links${mobileOpen ? " open" : ""}`}>
        {links.map((l, i) => (
          <button key={l} className={`nav-link${currentPage === keys[i] ? " active" : ""}`} aria-current={currentPage === keys[i] ? "page" : undefined} onClick={() => go(keys[i])}>{l}</button>
        ))}
        <button className="nav-cta" onClick={() => go("clinics")}>Register Now</button>
      </div>
      <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? "✕" : "☰"}
      </button>
    </nav>
  );
}
function Home({ setPage }) {
  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-net" />
        <div className="hero-content">
          <h1>
            Open Access.<br/>
            <em>Open Court.</em><br/>
            Open Opportunity.
          </h1>
          <div className="hero-eyebrow">🏐 Santa Monica–Malibu Public School Athletes</div>
          <p className="hero-sub">
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => { setPage("clinics"); window.scrollTo(0,0); }}>View Upcoming Clinics</button>
            <button className="btn-outline" onClick={() => { setPage("howitworks"); window.scrollTo(0,0); }}>How It Works</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">$25</div>
              <div className="hero-stat-label">Starting per clinic</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">15</div>
              <div className="hero-stat-label">Attendees per clinic</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">0</div>
              <div className="hero-stat-label">Year-long commitments</div>
            </div>
          </div>
        </div>
      </div>
      {/* Why strip */}
      <div className="why-strip">
        <div className="why-inner">
          <div className="section-label" style={{color: "rgba(245,168,0,0.9)"}}>Why Open Court</div>
          <h2 className="why-title">Talent is everywhere.<br/><em>Opportunity should be too.</em></h2>
          <div className="why-grid">
            {[
              { icon: "🔓", title: "Open Access", desc: "Designed for Santa Monica–Malibu public school students. Lower cost than traditional club models, with no barriers to entry." },
              { icon: "📈", title: "Real Development", desc: "We focus on fundamentals done correctly — passing, setting, hitting, footwork, and volleyball IQ. Strong fundamentals build confident players." },
              { icon: "🗓️", title: "Flexible Scheduling", desc: "Register for the clinics that fit your schedule. No year-round obligation. Works alongside school teams and other activities." },
              { icon: "🤝", title: "Community-Rooted", desc: "Built by volleyball families for volleyball families. Our coaches and board members are local athletes invested in giving back to this community." },
            ].map(c => (
              <div className="why-card" key={c.title}>
                <div className="why-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* A Message from Our Board */}
      {/* SAVED: Testimonials section — restore when ready
      <div className="testimonial-band">
        <div className="testimonial-inner">
          <div className="section-label">What Families Say</div>
          <h2 className="section-title">Built on Trust. Driven by Results.</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div className="testimonial-card" key={t.name}>
                <div className="testimonial-quote">"</div>
                <p>{t.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">👤</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      END SAVED TESTIMONIALS */}
      <div className="testimonial-band">
        <div className="testimonial-inner">
          <div className="section-label">A Message from Our Board</div>
          <p style={{fontSize:"1.1rem", fontWeight:300, color:"var(--navy)", marginBottom:24, maxWidth:720}}>
            We started Open Court to create more opportunities for local public school students to step onto the court, build confidence, and fall in love with the game.
          </p>
          <button className="btn-primary" onClick={() => { setPage("about"); window.scrollTo(0,0); }}>Learn More About Us</button>
        </div>
      </div>
      {/* CTA band */}
      <div style={{background: "var(--gold)", padding: "72px 40px", textAlign: "center"}}>
        <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "var(--navy)", marginBottom: 16}}>
          Ready to Step Onto the Court?
        </h2>
        <p style={{color: "rgba(26,46,68,0.7)", fontSize: "1.05rem", marginBottom: 32, fontWeight: 300}}>
          Explore our upcoming clinic schedule and secure your athlete's spot today.<br/>Advance registration required.
        </p>
        <button className="btn-primary" style={{background: "var(--navy)", color: "var(--white)", boxShadow: "none"}}
          onClick={() => { setPage("clinics"); window.scrollTo(0,0); }}>
          View Schedule & Register
        </button>
      </div>
    </div>
  );
}
function Clinics() {
  const [filter, setFilter] = useState("all");
  const filters = [
    { key: "all", label: "All Clinics" },
    { key: "beginner", label: "Beginner" },
    { key: "intermediate", label: "Intermediate" },
    { key: "advanced", label: "Advanced" },
    { key: "position", label: "Position-Specific" },
  ];
  const visible = filter === "all" ? CLINICS : CLINICS.filter(c => c.tag === filter);
  return (
    <div className="page">
      <div className="clinics-hero">
        <div className="clinics-hero-inner">
          <div className="section-label">2026 Schedule</div>
          <h1 className="section-title">Upcoming Saturday Clinics</h1>
          <p className="section-sub" style={{marginBottom: 0}}>
            All sessions require advance registration. Enrollment is intentionally limited to maintain quality coaching and strong coach-to-athlete ratios.
          </p>
        </div>
      </div>
      <div className="section">
        <div className="filter-bar">
          {filters.map(f => (
            <button key={f.key} className={`filter-btn${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>
        <div className="clinics-grid">
          {visible.map(c => (
            <div className="clinic-card" key={c.id}>
              <div className="clinic-card-header">
                <div className={`clinic-tag tag-${c.tag}`}>{c.tagLabel}</div>
                <h3>{c.icon} {c.title}</h3>
              </div>
              <div className="clinic-card-meta">
                <div className="clinic-meta-item">📅 {c.date}</div>
                <div className="clinic-meta-item">🕐 {c.time}</div>
                <div className="clinic-meta-item">🎒 {c.grade}</div>
                {c.location && <div className="clinic-meta-item">📍 {c.location}</div>}
                <div className="clinic-meta-item">🎯 {c.focus}</div>
              </div>
              <div className="clinic-card-body"><p>{c.description}{c.boldSuffix && <> <strong>{c.boldSuffix}</strong></>}</p>{c.spotsLeft && <p><strong><em>Only a few spots left!</em></strong></p>}</div>
              <div className="clinic-card-footer">
                {c.registrations ? (
                  <div style={{display:"flex", flexDirection:"column", gap:12, width:"100%"}}>
                    {c.registrations.map((r, i) => (
                      <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <div className="clinic-price">${r.price} <span>/ {r.priceUnit}</span></div>
                        <a className="btn-register" href={r.href} target="_blank" rel="noopener noreferrer">Register →</a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="clinic-price">{c.price != null ? `$${c.price}` : ""} <span>{c.price != null ? `/ ${c.priceUnit || "athlete"}` : ""}</span></div>
                    <a
                      className="btn-register"
                      href={c.buttonLabel === "Express Interest →" ? "mailto:opencourtathleticassociation@gmail.com" : "https://form.jotform.com/260528534420048"}
                      target={c.buttonLabel === "Express Interest →" ? undefined : "_blank"}
                      rel={c.buttonLabel === "Express Interest →" ? undefined : "noopener noreferrer"}
                    >{c.buttonLabel || "Register →"}</a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {visible.length === 0 && (
          <div style={{textAlign:"center", padding:"64px 0", color:"var(--muted)"}}>
            <div style={{fontSize:"3rem", marginBottom:16}}>🏐</div>
            <p>No clinics in this category right now. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
function HowItWorks() {
  const skills = [
    ["🎯", "Passing Precision"], ["✋", "Setting Consistency"], ["💥", "Hitting Mechanics"],
    ["👣", "Footwork & Positioning"], ["🧠", "Volleyball IQ"],
  ];
  return (
    <div className="page">
      <div className="clinics-hero">
        <div className="clinics-hero-inner">
          <div className="section-label">The Process</div>
          <h1 className="section-title">Simple. Structured.<br/>Focused on Development.</h1>
          <p className="section-sub" style={{marginBottom: 0}}>
            We've designed the experience to be as easy as possible for families — from first registration to game-day confidence.
          </p>
        </div>
      </div>
      <div className="section">
        <div className="steps">
          {[
            { num: "1", icon: "🔍", title: "Choose the Right Clinic", desc: "Browse upcoming Saturday clinics and review the grade band, skill level, training focus, and date. Each session clearly outlines who it's designed for, so families can select the best fit. Advance registration is required for all clinics." },
            { num: "2", icon: "🏐", title: "Show Up Ready to Train", desc: "Athletes arrive prepared to work in a focused, supportive environment. Athletes must come wearing proper footwear and knee pads, a refillable water bottle, and be ready to focus. Enrollment is intentionally limited." },
            { num: "3", icon: "📈", title: "Build Skills & Confidence", desc: "With consistent training, athletes gain stronger fundamentals, improved court awareness, greater consistency, and increased confidence. Our clinics complement school seasons and help athletes feel more prepared every time they step on the court." },
          ].map(s => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop: 80}}>
          <div className="section-label">What We Train</div>
          <h2 className="section-title">Fundamentals Done Right</h2>
          <p className="section-sub">
            Every clinic is built around the skills that translate directly to better performance on school and club courts.
          </p>
          <div className="skills-grid">
            {skills.map(([icon, label]) => (
              <div className="skill-chip" key={label}><span>{icon}</span><span>{label}</span></div>
            ))}
          </div>
        </div>
        <div style={{marginTop: 80, background:"var(--navy)", borderRadius:"var(--radius)", padding:"48px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center"}}>
          <div>
            <div className="section-label" style={{color:"rgba(232,160,32,0.7)"}}>Who Is This For?</div>
            <h2 style={{fontFamily:"'Playfair Display',serif", color:"var(--white)", fontSize:"1.8rem", marginBottom:16}}>Athletes Who Want to Improve</h2>
            <p style={{color:"rgba(255,255,255,0.65)", fontSize:"0.93rem", fontWeight:300, lineHeight:1.8}}>
              Open Court is designed for motivated athletes who want more structured repetition, benefit from focused skill breakdown, are preparing for upcoming school seasons, or simply love the game and want more touches on the ball.
            </p>
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:12}}>
            {["Are motivated to improve", "Benefit from focused skill breakdown", "Are preparing for school tryouts", "Love the game and want more touches"].map(item => (
              <div key={item} style={{display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 16px"}}>
                <span style={{color:"var(--gold)", fontSize:"1rem"}}>✓</span>
                <span style={{color:"rgba(255,255,255,0.8)", fontSize:"0.9rem", fontWeight:400}}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function About({ setPage }) {
  return (
    <div className="page">
      <div className="clinics-hero">
        <div className="clinics-hero-inner">
          <div className="section-label">Our Story</div>
          <h1 className="section-title">Built by Volleyball Families.<br/>For Volleyball Families.</h1>
          <p className="section-sub" style={{marginBottom: 0}}>
            Open Court was created to give back to the community and expand opportunity for public school athletes who are eager to improve.
          </p>
        </div>
      </div>
      <div className="section">
        <div className="about-founder">
          <div className="founder-visual">
            <img src="https://image.education.trccompanies.com/EloquaImages/clients/GNA/%7Bec3bfe3b-9658-432c-939b-4491c6e5ba6a%7D_OOCA_Logo_%281%29.png" alt="Founded by Santa Monica volleyball families, Open Court Athletic Association expands access to youth volleyball for SMMUSD public school students. 501(c)(3) nonprofit." style={{width:"100%", borderRadius:"var(--radius)", display:"block"}} />
          </div>
          <div className="about-text">
            <div className="section-label">The Founders</div>
            <h2 className="section-title">Creating More Opportunities to Play</h2>
            <p>
              Open Court began with a simple question: why was it so hard for local public school students to find a place to play indoor volleyball?
            </p>
            <p>
              Santa Monica has great sports opportunities — beach programs, recreation leagues, and competitive club teams. But many families discover that rec leagues fill quickly, club volleyball requires a major financial and time commitment, and beach volleyball is a very different experience than indoor team play.
            </p>
            <p>
              At the same time, many of our public school gyms were regularly rented to outside organizations, leaving local students with limited access to play in their own school community.
            </p>
            <p>
              We created Open Court to change that.
            </p>
            <p>
              Our goal is to provide accessible indoor volleyball clinics for Santa Monica–Malibu public school students — a place where kids can learn the fundamentals, build confidence, and develop a love for the game.
            </p>
            <p>
              We believe every student should have the opportunity to step onto the court, improve their skills, and experience the joy of being part of a team.
            </p>
          </div>
        </div>
        <div className="board-section">
          <div className="section-label">Meet Our Board</div>
          <h2 className="section-title">Leadership Rooted in Experience & Community</h2>
          <p className="section-sub">
            Open Court Athletic Association is guided by former competitive athletes, coaches, educators, and community professionals deeply invested in youth sports and public school athletics. Our board brings together collegiate playing experience, local coaching leadership, and professional expertise — all united by a shared commitment to expanding opportunity for young athletes.
          </p>
          <div className="board-grid">
            {BOARD.map(b => (
              <div className="board-card" key={b.name}>
                <div className="board-card-header">
                  <div className="board-avatar">{b.icon}</div>
                  <div>
                    <h4>{b.name}</h4>
                    <div className="board-role">{b.role}</div>
                  </div>
                </div>
                <p className="board-bio">{b.bio}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{marginTop:80, background:"var(--sage)", borderRadius:"var(--radius)", padding:"48px 40px", textAlign:"center"}}>
          <div style={{fontSize:"2.5rem", marginBottom:16}}>🌱</div>
          <h2 style={{fontFamily:"'Playfair Display',serif", color:"var(--white)", fontSize:"1.8rem", marginBottom:16}}>More Than Just Volleyball</h2>
          <p style={{color:"rgba(255,255,255,0.8)", fontSize:"1rem", fontWeight:300, maxWidth:560, margin:"0 auto 32px", lineHeight:1.8}}>
            We're beginning with volleyball skill development and plan to thoughtfully expand into additional sports over time — always guided by our commitment to affordability, access, and community-based training.
          </p>
          <button className="btn-primary" onClick={() => { setPage("donate"); window.scrollTo(0,0); }}>Support Our Mission</button>
        </div>
      </div>
    </div>
  );
}
function Donate() {
  const [selected, setSelected] = useState(25);
  const [custom, setCustom] = useState("");
  const amounts = [15, 25, 100, 250];
  const paypalAmount = selected === "custom" ? custom : selected;
  const paypalUrl = `https://www.paypal.com/donate?business=opencourtathleticassociation%40gmail.com${paypalAmount ? `&amount=${paypalAmount}` : ""}&currency_code=USD&item_name=Open+Court+Athletic+Association`;
  return (
    <div className="page">
      <div className="donate-hero">
        <div style={{position:"relative", zIndex:1}}>
          <div className="section-label" style={{color:"rgba(255,255,255,0.7)", justifyContent:"center", display:"flex"}}>Support the Mission</div>
          <p style={{color:"rgba(255,255,255,0.65)", fontSize:"0.85rem", fontWeight:400, marginBottom:4, marginTop:4}}>Open Court Athletic Association is a 501(c)(3) nonprofit. All donations are tax-deductible.</p>
          <h1>Help Us Expand<br/>Opportunity</h1>
          <p>Open Court is a nonprofit committed to keeping skill development accessible to public school athletes. Your support ensures that cost never determines whether a motivated athlete can improve.</p>
          <div className="donate-amounts">
            {amounts.map(a => (
              <button key={a} className={`donate-amount-btn${selected === a ? " selected" : ""}`}
                onClick={() => { setSelected(a); setCustom(""); }}>${a}</button>
            ))}
            <button className={`donate-amount-btn${selected === "custom" ? " selected" : ""}`}
              onClick={() => setSelected("custom")}>Custom</button>
          </div>
        </div>
      </div>
      <div className="donate-impact">
        <div className="section-label" style={{textAlign:"center"}}>Your Impact</div>
        <h2 className="section-title" style={{textAlign:"center"}}>Every Dollar Expands Access</h2>
        <div className="impact-grid" style={{marginTop:40}}>
          {[
            { amount: "$15", title: "Offsets Gym Costs", desc: "Helps cover a portion of weekly facility rental so we can keep clinic pricing accessible for all families." },
            { amount: "$25", title: "Full Clinic Scholarship", desc: "Funds one complete scholarship, giving a motivated athlete full access to a Saturday skills clinic at no cost." },
            { amount: "$100", title: "Expand Programming", desc: "Helps us add new clinic dates and grow into new grade bands and skill levels." },
            { amount: "$250", title: "Focused Coaching", desc: "Helps us bring in additional coaches and expand the quality and depth of instruction at every clinic." },
          ].map(i => (
            <div className="impact-card" key={i.amount}>
              <div className="impact-amount">{i.amount}</div>
              <h4>{i.title}</h4>
              <p>{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="donate-form-section">
        <div className="donate-form">
          <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:"var(--navy)", marginBottom:8}}>Make a Donation</h3>
          <p style={{color:"var(--muted)", fontSize:"0.9rem", marginBottom:28, fontWeight:300}}>Open Court Athletic Association is a 501(c)(3) nonprofit. All donations are tax-deductible.</p>
          <div style={{display:"flex", gap:10, marginBottom:20, flexWrap:"wrap"}}>
            {amounts.map(a => (
              <button key={a} onClick={() => { setSelected(a); setCustom(""); }}
                style={{flex:"1 1 60px", padding:"10px 0", borderRadius:8,
                  background: selected === a ? "var(--navy)" : "var(--sand2)",
                  color: selected === a ? "var(--white)" : "var(--navy)",
                  border: "2px solid " + (selected === a ? "var(--navy)" : "transparent"),
                  fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer", fontSize:"0.95rem"}}>
                ${a}
              </button>
            ))}
            <button onClick={() => setSelected("custom")}
              style={{flex:"1 1 60px", padding:"10px 0", borderRadius:8,
                background: selected === "custom" ? "var(--navy)" : "var(--sand2)",
                color: selected === "custom" ? "var(--white)" : "var(--navy)",
                border: "2px solid " + (selected === "custom" ? "var(--navy)" : "transparent"),
                fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer", fontSize:"0.95rem"}}>
              Custom
            </button>
          </div>
          {selected === "custom" && (
            <div className="form-group">
              <label className="form-label">Custom Amount ($)</label>
              <input className="form-input" type="number" placeholder="Enter amount" value={custom} onChange={e => setCustom(e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Note (Optional)</label>
            <input className="form-input" type="text" placeholder="e.g. In honor of my athlete" />
          </div>
          <a
            className="btn-donate"
            href={paypalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{display:"block", textAlign:"center", textDecoration:"none"}}
          >
            Donate ${selected === "custom" ? (custom || "—") : selected} →
          </a>
          <p style={{textAlign:"center", fontSize:"0.78rem", color:"var(--muted)", marginTop:12}}>
            Secure payment via PayPal. Tax receipt provided automatically.
          </p>
        </div>
      </div>
      <div style={{background:"var(--sand2)", padding:"64px 40px", textAlign:"center"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:"var(--navy)", marginBottom:12}}>Want to Get Involved Another Way?</h2>
        <p style={{color:"var(--muted)", fontSize:"0.95rem", marginBottom:28, fontWeight:300}}>
          We're always looking for volunteers, coaches, and community partners who share our mission.
        </p>
        <a href="mailto:opencourtathleticassociation@gmail.com" style={{textDecoration:"none"}}>
          <button style={{background:"var(--navy)", color:"var(--white)", border:"none", padding:"14px 36px", borderRadius:"99px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:"0.95rem", cursor:"pointer"}}>
            Volunteer & Partner With Us
          </button>
        </a>
      </div>
    </div>
  );
}
function Footer({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo(0,0); };
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Open <span>Court</span></h3>
            <p>Affordable, high-quality volleyball skill development for Santa Monica–Malibu public school athletes. Open access. Open opportunity.</p>
          </div>
          <div className="footer-col">
            <h4>Navigate</h4>
            {[["Home","home"],["Clinics","clinics"],["How It Works","howitworks"],["About","about"],["Donate","donate"]].map(([l,k]) => (
              <button key={k} className="footer-link" onClick={() => go(k)}>{l}</button>
            ))}
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a className="footer-link" href="mailto:opencourtathleticassociation@gmail.com">opencourtathleticassociation@gmail.com</a>
            <button className="footer-link">Santa Monica, CA</button>
            <button className="footer-link" onClick={() => go("donate")}>Support Us →</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Open Court Athletic Association. 501(c)(3) Nonprofit.</p>
          <div className="footer-tagline">Talent is everywhere. Opportunity should be too.</div>
        </div>
      </div>
    </footer>
  );
}
// ─── App ─────────────────────────────────────────────────────────────────────
const PAGE_META = {
  home:       { title: "Open Court Athletics | Santa Monica Youth Volleyball Clinics", description: "Affordable youth volleyball clinics in Santa Monica for grades 2–8. Saturday skill sessions at Lincoln Middle School. 501(c)(3) nonprofit." },
  clinics:    { title: "Saturday Volleyball Clinics Santa Monica | Open Court Athletics", description: "Browse upcoming Saturday volleyball clinics in Santa Monica for grades 2–8. Beginner, intermediate & advanced sessions. $25/clinic. Limited enrollment — register today." },
  howitworks: { title: "How Youth Volleyball Training Works | Open Court Athletics", description: "Learn how Open Court volleyball clinics work — choose a session, show up ready to train, and build real skills. Serving Santa Monica–Malibu public school athletes." },
  about:      { title: "About Us | Open Court Athletic Association Santa Monica", description: "Founded by Santa Monica volleyball families, Open Court Athletic Association expands access to youth volleyball for SMMUSD public school students. 501(c)(3) nonprofit." },
  donate:     { title: "Donate | Support Youth Volleyball in Santa Monica | Open Court", description: "Support Open Court Athletic Association's mission to make youth volleyball accessible for Santa Monica public school athletes. Tax-deductible donation via PayPal." },
};
export default function App() {
  const [page, setPage] = useState("home");
  useEffect(() => {
    const meta = PAGE_META[page];
    if (!meta) return;
    document.title = meta.title;
    let el = document.querySelector('meta[name="description"]');
    if (!el) { el = document.createElement("meta"); el.setAttribute("name", "description"); document.head.appendChild(el); }
    el.setAttribute("content", meta.description);
  }, [page]);
  const pages = {
    home: <Home setPage={setPage} />,
    clinics: <Clinics />,
    howitworks: <HowItWorks />,
    about: <About setPage={setPage} />,
    donate: <Donate />,
  };
  return (
    <>
      <style>{STYLES}</style>
      <Nav currentPage={page} setCurrentPage={(p) => { setPage(p); window.scrollTo(0,0); }} />
      {pages[page]}
      <Footer setPage={(p) => { setPage(p); window.scrollTo(0,0); }} />
    </>
  );
}
