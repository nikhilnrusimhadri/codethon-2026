import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const levels = [
  {
    level: 1,
    title: 'Conditions & Loops',
    description: 'Official results for Level 1 — Conditions and Loops.',
  },
  {
    level: 2,
    title: 'Arrays & Strings',
    description: 'Results for this level have not been published yet.',
  },
  {
    level: 3,
    title: 'Advanced Arrays & Strings',
    description: 'Results for this level have not been published yet.',
  },
  {
    level: 4,
    title: 'Data Structures & Algorithms',
    description: 'Results for this level have not been published yet.',
  },
];

export default async function ResultsPage() {
  const results = await db.resultPdf.findMany({
    where: {
      published: true,
    },
    orderBy: {
      level: 'asc',
    },
  });

  return (
    <main>
      <section className="section">
        <div className="container">
          <div
            style={{
              maxWidth: 760,
              marginBottom: 48,
            }}
          >
            <div className="eyebrow">RESULTS</div>

            <h1
              style={{
                marginTop: 14,
                marginBottom: 18,
              }}
            >
              Official results.
              <br />
              <span className="gradient-text">Level by level.</span>
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: 'var(--muted)',
              }}
            >
              Results will be published by the organizing team after each
              competition level.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 22,
            }}
          >
            {levels.map((level) => {
              const result = results.find(
                (item) => item.level === level.level,
              );

              return (
                <article
                  key={level.level}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 390,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 20,
                    }}
                  >
                    <div>
                      <div className="eyebrow">
                        LEVEL {String(level.level).padStart(2, '0')}
                      </div>

                      <h2
                        style={{
                          marginTop: 12,
                          marginBottom: 0,
                        }}
                      >
                        {level.title}
                      </h2>
                    </div>

                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        background:
                          'linear-gradient(135deg, rgba(0,229,255,.10), rgba(124,92,255,.10))',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 26,
                          color: 'var(--accent)',
                        }}
                      >
                        {String(level.level).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      marginTop: 26,
                      fontSize: 17,
                      lineHeight: 1.7,
                      color: 'var(--muted)',
                    }}
                  >
                    {result
                      ? level.description
                      : 'Results for this level have not been published yet.'}
                  </p>

                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 22,
                    }}
                  >
                    {!result && (
                      <div
                        className="status"
                        style={{
                          display: 'inline-flex',
                        }}
                      >
                        Results Not Published
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}