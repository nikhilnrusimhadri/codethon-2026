import { PageTitle } from '@/components/site';
import {
  Code2,
  Braces,
  BrainCircuit,
  Database,
  Clock3,
  CircleHelp,
  Utensils,
  Trophy,
} from 'lucide-react';

const levels = [
  {
    no: '01',
    label: 'LEVEL 1 · EASY',
    title: 'Conditions & Loops',
    description:
      'The foundation level focuses on programming fundamentals, conditions, and loops. Participants solve 10 questions during the first three-hour challenge.',
    questions: '10',
    duration: '3 hours',
    time: '10:00 AM – 1:00 PM',
    topics: 'Conditions, Loops',
    Icon: Code2,
    accent: 'var(--green)',
  },
  {
    no: '02',
    label: 'LEVEL 2 · EASY TO MEDIUM',
    title: 'Arrays & Strings',
    description:
      'The second level moves into data handling and logical thinking through arrays and strings. Participants solve 8 questions in three hours.',
    questions: '8',
    duration: '3 hours',
    time: '1:30 PM – 4:30 PM',
    topics: 'Arrays, Strings',
    Icon: Braces,
    accent: 'var(--cyan)',
  },
  {
    no: '03',
    label: 'LEVEL 3 · MEDIUM',
    title: 'Advanced Arrays & Strings',
    description:
      'Qualified participants face more advanced problem-solving challenges involving advanced arrays and advanced strings, with an emphasis on optimization.',
    questions: '4',
    duration: '2 hours',
    time: '4:30 PM – 6:30 PM',
    topics: 'Advanced Arrays, Advanced Strings',
    Icon: BrainCircuit,
    accent: '#a78bfa',
  },
  {
    no: '04',
    label: 'LEVEL 4 · HARD',
    title: 'Data Structures & Algorithms',
    description:
      'The final and most challenging level tests depth of algorithmic skill through Data Structures and Algorithms.',
    questions: '3',
    duration: '2 hours',
    time: '8:00 PM – 10:00 PM',
    topics: 'Data Structures & Algorithms (DSA)',
    Icon: Database,
    accent: '#f97316',
  },
];

export default function Rounds() {
  return (
    <main>
      <PageTitle
        eyebrow="Competition Architecture"
        title="Four levels. One coding journey."
        description="CODE THON 2k26 takes participants through four progressively challenging levels, beginning with programming fundamentals and culminating in Data Structures & Algorithms."
      />

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          {/* Event summary */}
          <div
            className="card"
            style={{
              padding: 'clamp(18px, 4vw, 28px)',
              marginBottom: 22,
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
            }}
          >
            <div>
              <div className="eyebrow">TOTAL QUESTIONS</div>
              <div
                className="mono"
                style={{
                  fontSize: 'clamp(28px, 6vw, 40px)',
                  fontWeight: 800,
                  marginTop: 6,
                }}
              >
                25
              </div>
            </div>

            <div>
              <div className="eyebrow">EVENT DURATION</div>
              <div
                style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  fontWeight: 800,
                  marginTop: 6,
                }}
              >
                12 Hours
              </div>
            </div>

            <div>
              <div className="eyebrow">PLATFORM</div>
              <div
                style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  fontWeight: 800,
                  marginTop: 6,
                }}
              >
                CodeTantra
              </div>
            </div>

            <div>
              <div className="eyebrow">DATE</div>
              <div
                style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  fontWeight: 800,
                  marginTop: 6,
                }}
              >
                14 Oct 2026
              </div>
            </div>
          </div>

          {/* Levels */}
          <div
            style={{
              display: 'grid',
              gap: 18,
            }}
          >
            {levels.map((level) => {
              const Icon = level.Icon;

              return (
                <article
                  key={level.no}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'clamp(64px, 10vw, 90px) 1fr',
                    }}
                  >
                    {/* Level number */}
                    <div
                      style={{
                        padding: '26px 12px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        borderRight: '1px solid var(--line)',
                        color: level.accent,
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          fontSize: 'clamp(22px, 5vw, 32px)',
                          fontWeight: 800,
                        }}
                      >
                        {level.no}
                      </span>
                    </div>

                    {/* Content */}
                    <div
                      style={{
                        padding: 'clamp(20px, 4vw, 30px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Icon
                          size={22}
                          strokeWidth={2}
                          color={level.accent}
                        />

                        <div
                          className="eyebrow"
                          style={{ color: level.accent }}
                        >
                          {level.label}
                        </div>
                      </div>

                      <h2
                        style={{
                          margin: '10px 0 8px',
                          fontSize: 'clamp(24px, 5vw, 34px)',
                          lineHeight: 1.1,
                        }}
                      >
                        {level.title}
                      </h2>

                      <p
                        className="muted"
                        style={{
                          lineHeight: 1.75,
                          maxWidth: 760,
                          marginBottom: 22,
                        }}
                      >
                        {level.description}
                      </p>

                      {/* Level information */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            padding: 14,
                            border: '1px solid var(--line)',
                            borderRadius: 12,
                          }}
                        >
                          <div className="eyebrow">
                            TOPICS
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              fontWeight: 700,
                              lineHeight: 1.5,
                            }}
                          >
                            {level.topics}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: 14,
                            border: '1px solid var(--line)',
                            borderRadius: 12,
                          }}
                        >
                          <div className="eyebrow">
                            QUESTIONS
                          </div>

                          <div
                            className="mono"
                            style={{
                              marginTop: 6,
                              fontSize: 20,
                              fontWeight: 800,
                            }}
                          >
                            {level.questions}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: 14,
                            border: '1px solid var(--line)',
                            borderRadius: 12,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <Clock3
                              size={14}
                              color="var(--cyan)"
                            />
                            <div className="eyebrow">
                              DURATION
                            </div>
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              fontWeight: 800,
                            }}
                          >
                            {level.duration}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: 14,
                            border: '1px solid var(--line)',
                            borderRadius: 12,
                          }}
                        >
                          <div className="eyebrow">
                            TIME SLOT
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              fontWeight: 700,
                              lineHeight: 1.5,
                            }}
                          >
                            {level.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Lunch break */}
          <div
            className="card"
            style={{
              marginTop: 18,
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <Utensils size={22} color="#f59e0b" />

            <div style={{ flex: 1, minWidth: 200 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                Lunch Break
              </div>

              <div
                className="muted"
                style={{
                  marginTop: 4,
                  fontSize: 14,
                }}
              >
                1:00 PM – 1:30 PM
              </div>
            </div>
          </div>

          {/* Activity & Dinner break */}
          <div
            className="card"
            style={{
              marginTop: 10,
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <Utensils size={22} color="#f59e0b" />

            <div style={{ flex: 1, minWidth: 200 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                Activity & Dinner Break
              </div>

              <div
                className="muted"
                style={{
                  marginTop: 4,
                  fontSize: 14,
                }}
              >
                6:30 PM – 8:00 PM
              </div>
            </div>
          </div>

          {/* Qualification note */}
          <div
            style={{
              marginTop: 22,
              padding: '18px 20px',
              borderRadius: 14,
              border: '1px solid var(--line)',
              background: 'rgba(0, 255, 200, 0.04)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            <Trophy
              size={23}
              color="var(--cyan)"
              style={{ flexShrink: 0, marginTop: 2 }}
            />

            <div>
              <div
                style={{
                  fontWeight: 800,
                  marginBottom: 5,
                }}
              >
                Level 2 qualification
              </div>

              <p
                className="muted"
                style={{
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Students who qualify for Level 2 are eligible
                to participate in Level 3.
              </p>
            </div>
          </div>

          {/* Final note */}
          <div
            className="muted"
            style={{
              marginTop: 18,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              lineHeight: 1.7,
              fontSize: 13,
            }}
          >
            <CircleHelp
              size={17}
              style={{
                flexShrink: 0,
                marginTop: 3,
              }}
            />

            <span>
              All levels are conducted through CodeTantra as part
              of the CODE THON 2k26 competition.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}