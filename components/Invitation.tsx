"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";
import Countdown from "./Countdown";
import CalendarButton from "./CalendarButton";
import RsvpForm from "./RsvpForm";
import PalmDrive from "./PalmDrive";
import { coupleNames, mapsEmbed, mapsLink, wedding } from "@/lib/wedding";

type Phase = "closed" | "opening" | "gone" | "removed";

const parents = wedding.parents.filter((p) => p.names.trim());

export default function Invitation({ guest = "" }: { guest?: string }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  const playMusic = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    el.volume = 0.5;
    el.play().then(() => setPlaying(true), () => setPlaying(false));
  }, []);

  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) playMusic();
    else { el.pause(); setPlaying(false); }
  }

  function openInvite() {
    if (phase !== "closed") return;
    playMusic(); // tapping the button counts as the user gesture browsers require for audio
    setPhase("opening");
    setTimeout(() => setPhase("gone"), 650);
    setTimeout(() => setPhase("removed"), 1600);
  }

  // Lock scrolling behind the cover; #open skips it (handy while editing)
  useEffect(() => {
    if (location.hash === "#open") { setPhase("removed"); return; }
    document.body.classList.add("locked");
    return () => document.body.classList.remove("locked");
  }, []);

  const introDone = phase === "gone" || phase === "removed";

  useEffect(() => {
    if (introDone) document.body.classList.remove("locked");
  }, [introDone]);

  // Reveal-on-scroll starts once the cover is out of the way
  useEffect(() => {
    if (!introDone) return;
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [introDone]);

  const introClass = [phase !== "closed" && "opening", introDone && "gone"].filter(Boolean).join(" ");

  return (
    <>
      {/* ============ COVER ============ */}
      {phase !== "removed" && (
        <div id="intro" className={introClass} role="dialog" aria-label="Start the drive to open your invitation">
          <div className="cover-card">
            <p className="intro-kicker">You are invited</p>
            <p className="intro-names">{coupleNames}</p>
            {guest && <p className="intro-guest">Especially for {guest}</p>}
            <p className="intro-date">{wedding.dateShort}</p>
            <button type="button" className="btn" onClick={openInvite}>
              Start the drive <Icon name="arrow" size={16} stroke={1.6} />
            </button>
          </div>
        </div>
      )}

      <main id="main">
        <PalmDrive>
          {/* ============ HERO ============ */}
          <section className="pd-hero pd-paint" aria-labelledby="pd-names">
            <p className="pd-script">Save the date</p>
            <p className="pd-eyebrow">Together with our families</p>
            <h1 id="pd-names" className="pd-names">
              <span>{wedding.partner1}</span>
              <span className="pd-amp" aria-hidden="true">&amp;</span>
              <span className="pd-sr">and</span>
              <span>{wedding.partner2}</span>
            </h1>
            <p className="pd-si-names" lang="si">{wedding.namesSi}</p>
            <p className="pd-hero-msg">we invite you to celebrate our {wedding.eventName.toLowerCase()}</p>            <p className="pd-date">
              <span className="pd-date-wd">{wedding.weekday}</span>
              <span className="pd-date-big">
                {wedding.dateParts.map((part, i) => (
                  <span key={part}>{i > 0 && <span className="pd-date-dot">·</span>}{part}</span>
                ))}
              </span>
              <span className="pd-date-si" lang="si">{wedding.dateSi}</span>
              <span className="pd-date-venue">{wedding.venue.name}</span>
              <span className="pd-date-si" lang="si">{wedding.venue.areaSi}</span>
            </p>
            {parents.length > 0 && (
              <div className="pd-parents">
                {parents.map((p) => (
                  <p key={p.label}><span className="pd-label">{p.label}</span><span lang="si">{p.names}</span></p>
                ))}
              </div>
            )}
            {guest && (
              <p className="pd-guest">
                <span className="pd-label">Especially for</span>
                <span className="pd-guest-line">We cordially invite</span>
                <span className="pd-guest-name">{guest}</span>
                <span className="pd-guest-line">to celebrate our special day with us.</span>
              </p>
            )}
            <p className="pd-cue" aria-hidden="true">
              <span>Scroll to drive</span>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </p>
          </section>

          {/* ============ COUNTDOWN ============ */}
          <section className="pd-section pd-paint" aria-labelledby="pd-count">
            <h2 id="pd-count" className="pd-eyebrow">Counting down</h2>
            <p className="pd-title">Until we hit the road together</p>
            <Countdown to={wedding.start} />
          </section>

          {/* ============ THE DAY ============ */}
          <section id="events" className="pd-section" aria-labelledby="pd-day">
            <div className="pd-paint">
              <h2 id="pd-day" className="pd-eyebrow">The day</h2>
              <p className="pd-title">Order of the day</p>
            </div>
            <ol className="pd-signs">
              {wedding.events.map((ev, i) => (
                <li className="pd-sign reveal" key={ev.title}>
                  <span className="pd-sign-num">{i + 1}</span>
                  <span className="pd-sign-body">
                    <span className="pd-sign-title">{ev.title}</span>
                    {ev.time && <span className="pd-sign-time">{ev.time}</span>}
                    <span className="pd-sign-note" lang="si">{ev.note}</span>
                  </span>
                  <span className="pd-sign-icon"><Icon name={ev.icon as IconName} size={22} stroke={1.5} /></span>
                </li>
              ))}
            </ol>

            {wedding.dressCode.colors.length > 0 && <div className="pd-card pd-dress reveal">
              <h3 className="pd-eyebrow pd-eyebrow-dark">Dress code</h3>
              <p className="pd-card-title pd-card-title-sm">{wedding.dressCode.title}</p>
              <ul className="swatches">
                {wedding.dressCode.colors.map((c) => (
                  <li key={c.name}>
                    <span className="swatch" style={{ background: c.hex }} />
                    <span className="sw-name">{c.name}</span>
                  </li>
                ))}
              </ul>
              <p className="pd-card-note">{wedding.dressCode.note}</p>
            </div>}
          </section>

          {/* ============ VENUE ============ */}
          <section id="venue" className="pd-section" aria-labelledby="pd-venue">
            <div className="pd-card">
              <h2 id="pd-venue" className="pd-eyebrow pd-eyebrow-dark">The venue</h2>
              <p className="pd-card-title">{wedding.venue.name}</p>
              <p className="pd-card-sub">{wedding.venue.area} · <span lang="si">{wedding.venue.areaSi}</span></p>
              <p className="pd-card-note">{wedding.weekday}, {wedding.dateLong}{wedding.timeLabel && ` · from ${wedding.timeLabel}`}</p>
              <p className="pd-addr">{wedding.venue.address}</p>
              <figure className="pd-map">
                <iframe src={mapsEmbed} title={`Map showing ${wedding.venue.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </figure>
              <div className="pd-actions">
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="btn">Directions</a>
                <CalendarButton />
              </div>
            </div>
          </section>

          {/* ============ RSVP ============ */}
          <section id="rsvp" className="pd-section" aria-labelledby="pd-rsvp">
            <div className="pd-card pd-rsvp">
              <h2 id="pd-rsvp" className="pd-eyebrow pd-eyebrow-dark">RSVP</h2>
              <p className="pd-card-title">Will you ride with us?</p>
              <p className="pd-card-italic">
                {wedding.rsvpBy ? `Kindly respond by ${wedding.rsvpBy}` : "Kindly respond at your earliest convenience"}
              </p>
              <RsvpForm defaultName={guest} />
            </div>
          </section>

          {/* ============ CLOSING ============ */}
          <section id="footer" className="pd-section pd-paint pd-closing" aria-labelledby="pd-closing">
            <h2 id="pd-closing" className="pd-sr">Closing</h2>
            <p className="pd-script">Drive safe.</p>
            <p className="pd-hero-msg">We will see you there.</p>
            <p className="pd-closing-names">{coupleNames}</p>
            <p className="pd-date-wd">{wedding.dateLong}</p>
            {wedding.contacts.length > 0 && (
              <div className="pd-phones">
                {wedding.contacts.map((c) => (
                  <a key={c.href} href={c.href} {...(c.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <Icon name={c.whatsapp ? "whatsapp" : "phone"} size={15} stroke={1.6} /> {c.label}
                  </a>
                ))}
              </div>
            )}
            <div className="stop-line" aria-hidden="true" />
          </section>
        </PalmDrive>

        <div className="credit">
          <p>Made with love for {coupleNames}</p>
          <p className="credit-promo">
            Want a beautiful wedding website like this? Create yours with{" "}
            <a href="https://wa.me/94707819074" target="_blank" rel="noreferrer">invitemint</a>
          </p>
        </div>
      </main>

      {/* Background music: "Ordinary" (violin cover) by ViOLiNiA Zhanna Stelmakh */}
      <audio ref={audio} src="/assets/music.mp3" loop preload="auto" />
      {phase !== "closed" && (
        <button type="button" className="music-btn" onClick={toggleMusic}
          aria-label={playing ? "Pause music" : "Play music"} aria-pressed={playing}>
          <Icon name="music" className="ic-on" />
          <Icon name="musicOff" className="ic-off" />
        </button>
      )}
    </>
  );
}
