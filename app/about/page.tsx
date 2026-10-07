import { PageTitle } from '@/components/site';
import { Terminal, Users, Trophy } from 'lucide-react';

const highlights = [
  {
    title: 'Individual first',
    Icon: Terminal,
    description:
      'Rounds 1 and 2 test students individually through CodeTantra.',
  },
  {
    title: 'Teams next',
    Icon: Users,
    description:
      'Qualifiers are organized into teams of 4–6 by the event admin.',
  },
  {
    title: 'Final pressure',
    Icon: Trophy,
    description:
      'Rounds 3 and 4 are the pre-final and final team challenges.',
  },
];

export default function About() {
  return (
    <main>
      <PageTitle
        eyebrow="About CODETHON"
        title="Where code meets competition."
        description="CODETHON 2026 is a four-round coding challenge conducted by the Abhiruchi Club of Mother Teresa Institute of Science and Technology."
      />

      <section className="section" style={{ paddingTop: 20 }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
            gap: 16,
          }}
        >
          {highlights.map(({ title, Icon, description }) => (
            <div
              className="card"
              key={title}
              style={{ padding: 25 }}
            >
              <Icon color="var(--cyan)" />

              <h3>{title}</h3>

              <p
                className="muted"
                style={{ lineHeight: 1.7 }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}