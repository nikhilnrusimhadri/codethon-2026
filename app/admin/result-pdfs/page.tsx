'use client';

import { useEffect, useState } from 'react';
import { AdminTitle } from '@/components/admin';
import { FileText, Upload, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

type ResultPdf = {
  id: string;
  level: number;
  title: string;
  fileUrl: string;
  fileName: string;
  published: boolean;
  uploadedAt: string;
  updatedAt: string;
};

const levels = [
  {
    level: 1,
    title: 'Level 1',
    subtitle: 'Conditions & Loops',
    questions: '10 Questions',
    duration: '3 Hours',
  },
  {
    level: 2,
    title: 'Level 2',
    subtitle: 'Arrays & Strings',
    questions: '8 Questions',
    duration: '3 Hours',
  },
  {
    level: 3,
    title: 'Level 3',
    subtitle: 'Advanced Arrays & Strings',
    questions: '4 Questions',
    duration: '2 Hours',
  },
  {
    level: 4,
    title: 'Level 4',
    subtitle: 'Data Structures & Algorithms',
    questions: '3 Questions',
    duration: '2 Hours',
  },
];

export default function ResultPdfsAdmin() {
  const [items, setItems] = useState<ResultPdf[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/result-pdfs', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Unable to load result PDFs.');
      }

      const data = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to load result PDFs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function getItem(level: number) {
    return items.find((item) => item.level === level);
  }

  async function uploadPdf(level: number, file: File | undefined) {
    if (!file) return;

    setError('');
    setMessage('');

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('PDF must be 10 MB or smaller.');
      return;
    }

    try {
      setUploading(level);

      const formData = new FormData();
      formData.append('level', String(level));
      formData.append('file', file);

      const response = await fetch('/api/admin/result-pdfs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Upload failed.');
      }

      setMessage(`Level ${level} PDF uploaded successfully.`);
      await load();
    } catch (err: any) {
      setError(err?.message || 'Upload failed.');
    } finally {
      setUploading(null);
    }
  }

  async function togglePublished(item: ResultPdf) {
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/result-pdfs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: item.level,
          published: !item.published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to update publication status.');
      }

      setMessage(
        !item.published
          ? `Level ${item.level} results published.`
          : `Level ${item.level} results unpublished.`,
      );

      await load();
    } catch (err: any) {
      setError(
        err?.message || 'Unable to update publication status.',
      );
    }
  }

  return (
    <>
      <AdminTitle
        eyebrow="Competition Outcomes"
        title="Result PDFs"
        description="Upload the official result PDF for each competition level, review it, and publish it when ready."
      />

      {(message || error) && (
        <div
          className="card"
          style={{
            padding: 16,
            marginBottom: 18,
            borderColor: error
              ? 'rgba(255,80,80,.35)'
              : 'rgba(0,255,200,.25)',
          }}
        >
          <div
            style={{
              color: error ? '#ff7777' : 'var(--cyan)',
              fontSize: 14,
            }}
          >
            {error || message}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
        }}
      >
        {levels.map((level) => {
          const item = getItem(level.level);
          const isUploading = uploading === level.level;

          return (
            <div
              className="card"
              key={level.level}
              style={{
                padding: 22,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    className="mono"
                    style={{
                      color: 'var(--cyan)',
                      fontSize: 12,
                      marginBottom: 7,
                    }}
                  >
                    LEVEL {level.level}
                  </div>

                  <h2
                    style={{
                      fontSize: 22,
                      margin: 0,
                      letterSpacing: '-.03em',
                    }}
                  >
                    {level.title}
                  </h2>

                  <p
                    className="muted"
                    style={{
                      margin: '5px 0 0',
                      lineHeight: 1.5,
                    }}
                  >
                    {level.subtitle}
                  </p>
                </div>

                <FileText
                  size={25}
                  color="var(--cyan)"
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 20,
                }}
              >
                <span className="badge">
                  {level.questions}
                </span>

                <span className="badge">
                  {level.duration}
                </span>
              </div>

              {item ? (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: '#ffffff06',
                    border: '1px solid #ffffff10',
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      marginBottom: 8,
                    }}
                  >
                    <CheckCircle2
                      size={16}
                      color="var(--cyan)"
                    />

                    <strong
                      style={{
                        fontSize: 13,
                      }}
                    >
                      PDF uploaded
                    </strong>
                  </div>

                  <div
                    className="muted"
                    style={{
                      fontSize: 12,
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.fileName}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color: item.published
                        ? 'var(--cyan)'
                        : 'var(--muted)',
                    }}
                  >
                    {item.published
                      ? '● Published publicly'
                      : '● Draft — not public'}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: '#ffffff04',
                    border: '1px dashed #ffffff18',
                    marginBottom: 16,
                    color: 'var(--muted)',
                    fontSize: 13,
                  }}
                >
                  No result PDF uploaded yet.
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: 9,
                  flexWrap: 'wrap',
                }}
              >
                <label
                  className="btn btn-primary"
                  style={{
                    cursor: isUploading
                      ? 'wait'
                      : 'pointer',
                    opacity: isUploading ? 0.6 : 1,
                  }}
                >
                  <Upload size={15} />

                  {isUploading
                    ? 'Uploading...'
                    : item
                      ? 'Replace PDF'
                      : 'Upload PDF'}

                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    disabled={isUploading}
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0];

                      uploadPdf(level.level, file);

                      event.currentTarget.value = '';
                    }}
                  />
                </label>

                {item && (
                  <>
                    <a
                      className="btn btn-ghost"
                      href={`/api/results/${level.level}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye size={15} />
                      View
                    </a>

                    <button
                      className="btn btn-ghost"
                      onClick={() =>
                        togglePublished(item)
                      }
                    >
                      {item.published ? (
                        <>
                          <EyeOff size={15} />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} />
                          Publish
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="card"
        style={{
          marginTop: 20,
          padding: 18,
        }}
      >
        <div
          className="mono"
          style={{
            color: 'var(--cyan)',
            fontSize: 11,
            marginBottom: 7,
          }}
        >
          ADMIN NOTE
        </div>

        <p
          className="muted"
          style={{
            margin: 0,
            lineHeight: 1.7,
            fontSize: 13,
          }}
        >
          The uploaded PDF is the official source of truth.
          Students will see the complete PDF only after you
          publish it. Replacing a PDF automatically returns it
          to draft status.
        </p>
      </div>

      {loading && (
        <div
          className="muted"
          style={{
            marginTop: 18,
            fontSize: 13,
          }}
        >
          Loading result PDFs...
        </div>
      )}
    </>
  );
}