import { PageTitle } from '@/components/site';
import { CalendarDays, Clock } from 'lucide-react';

const scheduleItems = [
  {
    value: '14 OCT',
    label: 'Event Day',
    Icon: CalendarDays,
  },
  {
    value: '10:00 AM',
    label: 'Starts',
    Icon: Clock,
  },
  {
    value: '10:00 PM',
    label: 'Concludes',
    Icon: Clock,
  },
];

export default function Schedule() {
  return (
    <main>
      <PageTitle
        eyebrow="Event Schedule"
        title="One day. Four rounds."
        description="All four CODETHON 2026 rounds take place on 14 October 2026. Individual round timings will be communicated by the organizers."
      />

      <section className="section" style={{ paddingTop: 20 }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: 16,
          }}
        >
          {scheduleItems.map(({ value, label, Icon }) => (
            <div
              className="card"
              key={label}
              style={{ padding: 28 }}
            >
              <Icon color="var(--cyan)" />

              <div
                className="mono"
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  marginTop: 22,
                }}
              >
                {value}
              </div>

              <div className="muted">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}