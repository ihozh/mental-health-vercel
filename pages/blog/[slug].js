import Head from 'next/head';
import Link from 'next/link';
import Nav from '../../components/Nav';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function PostPage({ title, date, tag, content }) {
  return (
    <>
      <Head>
        <title>{title} | MHDash</title>
      </Head>
      <Nav />

      <style>{`
        .post-body { line-height: 1.75; color: var(--text); }
        .post-body h1 { font-size: 26px; font-weight: 700; margin: 32px 0 12px; }
        .post-body h2 { font-size: 21px; font-weight: 700; margin: 28px 0 10px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
        .post-body h3 { font-size: 17px; font-weight: 600; margin: 22px 0 8px; }
        .post-body p  { margin: 12px 0; }
        .post-body ul, .post-body ol { padding-left: 24px; margin: 12px 0; }
        .post-body li { margin: 4px 0; }
        .post-body a  { color: var(--blue); text-decoration: none; }
        .post-body a:hover { text-decoration: underline; }
        .post-body blockquote {
          border-left: 4px solid var(--brand);
          margin: 16px 0;
          padding: 8px 16px;
          background: #fdecea;
          border-radius: 0 4px 4px 0;
          color: var(--text-muted);
        }
        .post-body code {
          background: #f0f0f0;
          border-radius: 3px;
          padding: 2px 5px;
          font-size: 13px;
          font-family: 'SFMono-Regular', Consolas, monospace;
        }
        .post-body pre {
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 8px;
          padding: 16px 20px;
          overflow-x: auto;
          margin: 16px 0;
        }
        .post-body pre code {
          background: none;
          padding: 0;
          font-size: 13.5px;
          color: inherit;
        }
        .post-body table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
          font-size: 14px;
        }
        .post-body th, .post-body td {
          border: 1px solid var(--border);
          padding: 8px 12px;
          text-align: left;
        }
        .post-body th { background: var(--surface); font-weight: 600; }
        .post-body tr:nth-child(even) { background: #fafafa; }
        .post-body img { max-width: 100%; border-radius: 6px; margin: 8px 0; }
        .post-body hr { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
        @media (max-width: 600px) {
          .post-main { padding: 12px !important; padding-top: 64px !important; }
        }
      `}</style>

      <main
        className="post-main"
        style={{ width: '100%', maxWidth: 760, margin: '0 auto', padding: 24, paddingTop: 72, minHeight: '100vh' }}
      >
        {/* Back link */}
        <Link
          href="/blog"
          style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}
        >
          ← Blog
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          {tag && (
            <span style={{
              display: 'inline-block', background: '#fdecea', color: 'var(--brand)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: 4, marginBottom: 10,
            }}>
              {tag}
            </span>
          )}
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.3 }}>{title}</h1>
          {date && <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{date}</p>}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 28 }} />

        {/* Markdown body */}
        <article className="post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        </article>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const postsDir = path.join(process.cwd(), 'blog');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  return {
    paths: files.map((f) => ({ params: { slug: f.replace(/\.md$/, '') } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'blog', `${params.slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    props: {
      title: data.title || params.slug,
      date: data.date || '',
      tag: data.tag || '',
      content,
    },
  };
}
