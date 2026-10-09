import Link from 'next/link';
import { PageTitle } from '@/components/site';
import { db } from '@/lib/db';
import { FileText, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

const levels = [
  {
    level: 1,
    label: 'LEVEL 01',
    title: 'Conditions & Loops',
    description:
      'Official results for Level 1 — Conditions and Loops.',
  },
  {
    level: 2,
    label: 'LEVEL 02',
    title: 'Arrays & Strings',
    description:
      'Official results for Level 2 — Arrays and Strings.',
  },
  {
    level: 3,
    label: 'LEVEL 03',
    title: 'Advanced Arrays & Strings',
    description:
      'Official results for Level 3 — Advanced Arrays and Strings.',
  },
  {
    level: 4,
    label: 'LEVEL 04',
    title: 'Data Structures & Algorithms',
    description:
      'Official results for Level 4 — Data Structures and Algorithms.',
  },
];

export default async function Results() {
  const resultPdfs = await db.resultPdf.findMany({
    where: {
      published: true,
    },
    orderBy: {
      level: 'asc',
    },
  });

  const publishedLevels = new Map(
    resultPdfs.map((result) => [result.level, result]),
  );

  return (
    <main>
      <PageTitle
        eyebrow="Official Results"
        title="The results are in."
        description="Official Level-wise results released by the CODE THON 2k26 organizing team."
      />

      <section className="section" style={{ paddingTop: 20 }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
          }}
        >
          {levels.map((level) => {
            const result = publishedLevels.get(level.level);

            return (
              <article
                className="card"
                key={level.level}
                style={{
                  padding: 26,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 250,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 15,
                  }}
                >
                  <div>
                    <div className="eyebrow">{level.label}</div>

                    <h2
                      style={{
                        fontSize: 25,
                        letterSpacing: '-.03em',
                        margin: '8px 0 0',
                      }}
                    >
                      {level.title}
                    </h2>
                  </div>

                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      display: 'grid',
                      placeItems: 'center',
                      background: '#ffffff08',
                      border: '1px solid #ffffff12',
                      flexShrink: 0,
                    }}
                  >
                    <FileText
                      size={21}
                      color="var(--cyan)"
                    />
                  </div>
                </div>

                <p
                  className="muted"
                  style={{
                    lineHeight: 1.7,
                    marginTop: 18,
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
                  {result ? (
                    <Link
                      href={`/api/results/${level.level}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      View Official Results
                      <ExternalLink size={16} />
                    </Link>
                  ) : (
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
      </section>
    </main>
  );
}