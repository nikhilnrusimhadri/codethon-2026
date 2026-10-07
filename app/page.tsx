import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Users,
  Trophy,
  Terminal,
  ShieldCheck,
} from 'lucide-react';

import { Countdown } from '@/components/site';
import { rounds } from '@/lib/event';

export default function Home() {
  return (
    <main>
      <section
        className="noise grid-bg"
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 70px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          className="container"
          style={{
            padding: '90px 0',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="eyebrow">ABHIRUCHI CLUB × MIST</div>

          <h1
            className="hero-title"
            style={{
              fontSize: 'clamp(64px, 11vw, 150px)',
              letterSpacing: '-.08em',
              lineHeight: 0.82,
              margin: '20px 0 28px',
              fontWeight: 800,
            }}
          >
            CODE<span className="gradient-text">THON</span>
            <br />
            <span style={{ fontSize: '.55em' }}>2026</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(18px, 2.2vw, 27px)',
              maxWidth: 650,
              lineHeight: 1.5,
              color: '#c5ced9',
            }}
          >
            Think. Code. Conquer. A four-round coding challenge built for the
            third-year student community of Mother Teresa Institute of Science
            and Technology.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 12,
              margin: '30px 0',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/register" className="btn btn-primary">
              Register Now <ArrowRight size={17} />
            </Link>

            <Link href="/rounds" className="btn btn-ghost">
              Explore Rounds
            </Link>
          </div>

          <div style={{ maxWidth: 620 }}>
            <Countdown />
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 18,
            }}
          >
            {['14 OCT 2026', '10:00 AM — 10:00 PM', 'CODETANTRA'].map((item) => (
              <span key={item} className="status published mono">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: '-12vw',
            top: '8%',
            width: '55vw',
            height: '55vw',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #4de7ff18, transparent 65%)',
          }}
        />
      </section>

      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))',
              gap: 14,
            }}
          >
            {[
  { number: '06', title: 'Eligible Branches', Icon: Users },
  { number: '04', title: 'Competition Rounds', Icon: Terminal },
  { number: '01', title: 'Day of Code', Icon: CalendarDays },
  { number: '4–6', title: 'Members / Team', Icon: Trophy },
].map(({ number, title, Icon: IconComponent }) => (
  <div
    className="card"
    key={title}
    style={{ padding: 24 }}
  >
    <IconComponent size={18} color="var(--cyan)" />

    <div
      style={{
        fontSize: 36,
        fontWeight: 800,
        marginTop: 18,
      }}
    >
      {number}
    </div>

    <div className="muted">{title}</div>
  </div>
))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="eyebrow">THE CHALLENGE</div>

          <h2
            style={{
              fontSize: 'clamp(34px,5vw,62px)',
              letterSpacing: '-.05em',
              margin: '12px 0 45px',
            }}
          >
            Four rounds. One champion.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
              gap: 16,
            }}
          >
            {rounds.map((round) => (
              <div
                className="card"
                key={round.no}
                style={{
                  padding: 25,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 46,
                    color: '#ffffff18',
                    fontWeight: 700,
                  }}
                >
                  0{round.no}
                </div>

                <div className="eyebrow" style={{ marginTop: 14 }}>
                  {round.label}
                </div>

                <h3 style={{ fontSize: 24, margin: '8px 0' }}>
                  {round.type} Challenge
                </h3>

                <p className="muted" style={{ lineHeight: 1.7 }}>
                  {round.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div
          className="container card glow"
          style={{
            padding: '50px 30px',
            textAlign: 'center',
          }}
        >
          <ShieldCheck size={28} color="var(--cyan)" />

          <div className="eyebrow" style={{ marginTop: 16 }}>
            ELIGIBILITY
          </div>

          <h2
            style={{
              fontSize: 'clamp(34px,5vw,58px)',
              margin: '10px 0',
            }}
          >
            Third-year MIST students only.
          </h2>

          <p className="muted">
            CSE · CSM · EEE · ECE · Mechanical · Civil
          </p>

          <Link
            href="/register"
            className="btn btn-primary"
            style={{ marginTop: 20 }}
          >
            Secure Your Spot <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}