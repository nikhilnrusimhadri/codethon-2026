'use client';

import { useEffect, useState } from 'react';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';

type JuryMember = {
  id: string;
  name: string;
  designation: string;
  photoUrl?: string | null;
  organization?: string | null;
  department?: string | null;
  bio?: string | null;
  displayOrder: number;
  isPublished: boolean;
};

type JuryForm = {
  name: string;
  designation: string;
  organization: string;
  department: string;
  bio: string;
  photoUrl: string;
  isPublished: boolean;
};

const initialForm: JuryForm = {
  name: '',
  designation: '',
  organization: '',
  department: '',
  bio: '',
  photoUrl: '',
  isPublished: false,
};

export default function AdminJuryPage() {
  const [jury, setJury] = useState<JuryMember[]>([]);
  const [f, setF] = useState<JuryForm>(initialForm);

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/admin/jury', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to load jury members.',
        );
      }

      setJury(data.jury || data.items || []);
    } catch (err: any) {
      setError(
        err?.message || 'Unable to load jury members.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowed.includes(file.type)) {
      setError(
        'Only JPG, PNG, and WebP images are allowed.',
      );
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setError('');
    setPhoto(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
  }

  async function uploadPhoto() {
    if (!photo) {
      return null;
    }

    setUploading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('photo', photo);

      const response = await fetch(
        '/api/admin/jury/upload',
        {
          method: 'POST',
          body: fd,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to upload photo.',
        );
      }

      /*
       * IMPORTANT:
       * Store the private Blob pathname in the database,
       * not the full Blob URL.
       *
       * Example:
       * jury-photos/abc123.webp
       */
      return data.pathname as string;
    } catch (err: any) {
      setError(
        err?.message || 'Unable to upload photo.',
      );
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function add() {
    if (!f.name.trim()) {
      setError('Name is required.');
      return;
    }

    if (!f.designation.trim()) {
      setError('Designation is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let photoUrl = f.photoUrl;

      /*
       * Upload the selected photo first.
       */
      if (photo) {
        const uploadedPathname =
          await uploadPhoto();

        if (!uploadedPathname) {
          return;
        }

        photoUrl = uploadedPathname;
      }

      const response = await fetch(
        '/api/admin/jury',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: f.name.trim(),
            designation: f.designation.trim(),
            organization:
              f.organization.trim() || null,
            department:
              f.department.trim() || null,
            bio: f.bio.trim() || null,
            photoUrl: photoUrl || null,
            isPublished: f.isPublished,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to add jury member.',
        );
      }

      setF(initialForm);
      setPhoto(null);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview('');

      await load();
    } catch (err: any) {
      setError(
        err?.message || 'Unable to add jury member.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this jury member?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `/api/admin/jury?id=${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to delete jury member.',
        );
      }

      await load();
    } catch (err: any) {
      setError(
        err?.message || 'Unable to delete jury member.',
      );
    }
  }

  function getPhotoUrl(
    photoUrl?: string | null,
  ) {
    if (!photoUrl) {
      return null;
    }

    if (!photoUrl.startsWith('jury-photos/')) {
      return null;
    }

    return `/api/jury/photo?pathname=${encodeURIComponent(
      photoUrl,
    )}`;
  }

  return (
    <main
      className="section"
      style={{ paddingTop: 40 }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
            marginBottom: 28,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div className="eyebrow">
              ADMIN PANEL
            </div>

            <h1 style={{ marginBottom: 8 }}>
              Jury Panel
            </h1>

            <p className="muted">
              Add and manage the experts who will
              evaluate CODE THON 2k26 participants.
            </p>
          </div>
        </div>

        {error && (
          <div
            className="card"
            style={{
              padding: 16,
              marginBottom: 20,
              borderColor:
                'rgba(255,80,80,0.35)',
              color: '#ff8f8f',
            }}
          >
            {error}
          </div>
        )}

        {/* ADD JURY MEMBER */}
        <section
          className="card"
          style={{
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <ImageIcon size={20} />

            <h2 style={{ margin: 0 }}>
              Add Jury Member
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            <label>
              <div className="muted">
                Name *
              </div>

              <input
                className="input"
                value={f.name}
                onChange={(e) =>
                  setF({
                    ...f,
                    name: e.target.value,
                  })
                }
                placeholder="Dr. John Doe"
              />
            </label>

            <label>
              <div className="muted">
                Designation *
              </div>

              <input
                className="input"
                value={f.designation}
                onChange={(e) =>
                  setF({
                    ...f,
                    designation: e.target.value,
                  })
                }
                placeholder="Professor / Industry Expert"
              />
            </label>

            <label>
              <div className="muted">
                Organization
              </div>

              <input
                className="input"
                value={f.organization}
                onChange={(e) =>
                  setF({
                    ...f,
                    organization: e.target.value,
                  })
                }
                placeholder="Organization name"
              />
            </label>

            <label>
              <div className="muted">
                Department
              </div>

              <input
                className="input"
                value={f.department}
                onChange={(e) =>
                  setF({
                    ...f,
                    department: e.target.value,
                  })
                }
                placeholder="Department"
              />
            </label>
          </div>

          <div style={{ marginTop: 16 }}>
            <label>
              <div className="muted">
                Bio
              </div>

              <textarea
                className="input"
                value={f.bio}
                onChange={(e) =>
                  setF({
                    ...f,
                    bio: e.target.value,
                  })
                }
                placeholder="Short professional bio..."
                rows={5}
                style={{
                  resize: 'vertical',
                }}
              />
            </label>
          </div>

          {/* PHOTO */}
          <div style={{ marginTop: 20 }}>
            <div className="muted">
              Jury Photo
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap',
                marginTop: 10,
              }}
            >
              <label
                className="btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <Upload size={16} />

                {uploading
                  ? 'Uploading Photo...'
                  : 'Choose Photo'}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  disabled={
                    uploading || saving
                  }
                  style={{ display: 'none' }}
                />
              </label>

              {preview && (
                <img
                  src={preview}
                  alt="Jury preview"
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border:
                      '2px solid rgba(255,255,255,0.12)',
                  }}
                />
              )}
            </div>

            <p
              className="muted"
              style={{
                fontSize: 13,
                marginTop: 8,
              }}
            >
              JPG, PNG or WebP · Maximum 5 MB
            </p>
          </div>

          {/* PUBLISH */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={f.isPublished}
              onChange={(e) =>
                setF({
                  ...f,
                  isPublished:
                    e.target.checked,
                })
              }
              disabled={saving}
            />

            <span>
              Publish this jury member
              immediately
            </span>
          </label>

          {/* SAVE */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 24,
            }}
          >
            <button
              className="btn"
              onClick={add}
              disabled={
                saving || uploading
              }
              style={{
                minWidth: 150,
              }}
            >
              {saving
                ? 'Saving...'
                : 'Add Jury Member'}
            </button>
          </div>
        </section>

        {/* JURY LIST */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div>
              <div className="eyebrow">
                CURRENT PANEL
              </div>

              <h2 style={{ margin: 0 }}>
                Jury Members
              </h2>
            </div>

            <div className="muted">
              {jury.length}{' '}
              {jury.length === 1
                ? 'member'
                : 'members'}
            </div>
          </div>

          {loading ? (
            <div
              className="card"
              style={{
                padding: 40,
                textAlign: 'center',
              }}
            >
              Loading jury members...
            </div>
          ) : jury.length === 0 ? (
            <div
              className="card"
              style={{
                padding: 50,
                textAlign: 'center',
              }}
            >
              <div className="eyebrow">
                EMPTY
              </div>

              <h3>
                No jury members yet
              </h3>

              <p className="muted">
                Add the first jury member using
                the form above.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {jury.map((j) => {
                const photoUrl =
                  getPhotoUrl(j.photoUrl);

                return (
                  <div
                    className="card"
                    key={j.id}
                    style={{
                      padding: 22,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 16,
                      }}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={j.name}
                          style={{
                            width: 72,
                            height: 72,
                            objectFit: 'cover',
                            borderRadius:
                              '50%',
                            flexShrink: 0,
                            border:
                              '2px solid rgba(255,255,255,0.12)',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background:
                              '#ffffff0a',
                            display: 'grid',
                            placeItems:
                              'center',
                            fontSize: 26,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {j.name
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>
                      )}

                      <div
                        style={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            marginBottom: 4,
                          }}
                        >
                          {j.name}
                        </h3>

                        <div className="eyebrow">
                          {j.designation}
                        </div>

                        {(j.organization ||
                          j.department) && (
                          <p
                            className="muted"
                            style={{
                              marginTop: 8,
                            }}
                          >
                            {j.organization}

                            {j.organization &&
                            j.department
                              ? ' · '
                              : ''}

                            {j.department}
                          </p>
                        )}
                      </div>
                    </div>

                    {j.bio && (
                      <p
                        className="muted"
                        style={{
                          lineHeight: 1.65,
                          marginTop: 16,
                        }}
                      >
                        {j.bio}
                      </p>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                          'space-between',
                        gap: 12,
                        marginTop: 18,
                        paddingTop: 14,
                        borderTop:
                          '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          padding:
                            '5px 10px',
                          borderRadius: 999,
                          background:
                            j.isPublished
                              ? 'rgba(34,197,94,0.12)'
                              : 'rgba(255,255,255,0.06)',
                          color:
                            j.isPublished
                              ? '#86efac'
                              : 'rgba(255,255,255,0.65)',
                        }}
                      >
                        {j.isPublished
                          ? 'Published'
                          : 'Draft'}
                      </span>

                      <button
                        className="btn"
                        onClick={() =>
                          remove(j.id)
                        }
                        style={{
                          display: 'inline-flex',
                          alignItems:
                            'center',
                          gap: 7,
                        }}
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}