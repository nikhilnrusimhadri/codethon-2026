import { db } from '@/lib/db';
import { PageTitle } from '@/components/site';

function getPhotoUrl(photoUrl?: string | null) {
  if (!photoUrl) return null;

  if (!photoUrl.startsWith('jury-photos/')) {
    return null;
  }

  return `/api/jury/photo?pathname=${encodeURIComponent(photoUrl)}`;
}

export default async function Jury() {
  const jury = await db.juryMember.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });

  return (
    <main>
      <PageTitle
        eyebrow="Jury Panel"
        title="The people behind the verdict."
        description="Meet the experts who will evaluate the CODE THON 2k26 participants."
      />

      <section
        className="section"
        style={{ paddingTop: 20 }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(250px,1fr))',
            gap: 16,
          }}
        >
          {jury.length ? (
            jury.map((j) => {
              const photoUrl = getPhotoUrl(j.photoUrl);

              return (
                <div
                  className="card"
                  key={j.id}
                  style={{
                    padding: 24,
                    textAlign: 'center',
                  }}
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={j.name}
                      style={{
                        width: 110,
                        height: 110,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        margin: '0 auto 18px',
                        border:
                          '2px solid rgba(255,255,255,0.12)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: '50%',
                        background: '#ffffff0a',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 34,
                        fontWeight: 800,
                        margin: '0 auto 18px',
                      }}
                    >
                      {j.name
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                  )}

                  <h3 style={{ marginBottom: 4 }}>
                    {j.name}
                  </h3>

                  <div className="eyebrow">
                    {j.designation}
                  </div>

                  {(j.organization ||
                    j.department) && (
                    <p className="muted">
                      {j.organization}
                      {j.organization &&
                      j.department
                        ? ' · '
                        : ''}
                      {j.department}
                    </p>
                  )}

                  {j.bio && (
                    <p
                      className="muted"
                      style={{
                        lineHeight: 1.7,
                        marginTop: 12,
                      }}
                    >
                      {j.bio}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div
              className="card"
              style={{
                padding: 50,
                textAlign: 'center',
                gridColumn: '1/-1',
              }}
            >
              <div className="eyebrow">
                COMING SOON
              </div>

              <h2>
                Jury Panel — To Be Announced
              </h2>

              <p className="muted">
                Names, designations, organizations
                and bios will appear here once
                published by the admin.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}