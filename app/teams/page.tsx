import { PageTitle } from '@/components/site';
import { TeamLookup } from './Lookup';
import { db } from '@/lib/db';
import { publicBranch } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Teams() {
  const teams = await db.team.findMany({
    where: {
      published: true,
    },
    include: {
      members: {
        include: {
          participant: true,
        },
        orderBy: {
          participant: {
            fullName: 'asc',
          },
        },
      },
    },
    orderBy: {
      teamNumber: 'asc',
    },
  });

  return (
    <main>
      <PageTitle
        eyebrow="Team Formation"
        title="Find your team."
        description="Teams are created by the organizers after the individual elimination rounds. Only published teams appear here."
      />

      <section className="section" style={{ paddingTop: 20 }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
            gap: 16,
          }}
        >
          {teams.length ? (
            teams.map((team) => (
              <div
                className="card"
                key={team.id}
                style={{ padding: 24 }}
              >
                <div className="eyebrow">
                  TEAM {String(team.teamNumber).padStart(2, '0')}
                </div>

                <h2 style={{ margin: '7px 0 18px' }}>
                  {team.teamName}
                </h2>

                {team.members.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      padding: '11px 0',
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>
                      {member.participant.fullName}
                    </div>

                    <div
                      className="muted mono"
                      style={{ fontSize: 11 }}
                    >
                      {member.participant.rollNumber} ·{' '}
                      {publicBranch(member.participant.branch)}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div
              className="card"
              style={{
                padding: 50,
                textAlign: 'center',
                gridColumn: '1 / -1',
              }}
            >
              <h3>Teams will appear here after Round 2.</h3>

              <p className="muted">
                The admin will publish the final team assignments.
              </p>
            </div>
          )}
        </div>

        <div className="container" style={{ marginTop: 24 }}>
          <TeamLookup />
        </div>
      </section>
    </main>
  );
}