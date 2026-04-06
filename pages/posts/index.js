import Head from 'next/head';
import Link from 'next/link';
import Nav from '../../components/Nav';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function PostsIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Posts | MHDash</title>
      </Head>
      <Nav />

      <style>{`
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .post-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.15s, transform 0.15s;
          overflow: hidden;
        }
        .post-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .post-card-preview {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: #f3f4f6;
          flex-shrink: 0;
        }
        .post-card-preview iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 860px;
          height: 520px;
          transform: scale(0.355);
          transform-origin: top left;
          pointer-events: none;
          border: none;
        }
        .post-card-preview-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fdecea 0%, #fff5f5 100%);
        }
        .post-card-placeholder-icon {
          font-size: 36px;
          opacity: 0.25;
        }
        .post-card-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .post-tag {
          display: inline-block;
          background: #fdecea;
          color: var(--brand);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 10px;
          align-self: flex-start;
        }
        .post-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.45;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .post-excerpt {
          font-size: 12.5px;
          color: var(--text-muted);
          margin-top: 8px;
          line-height: 1.55;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          flex: 1;
        }
        .post-date {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 12px;
        }
        @media (max-width: 600px) {
          .posts-main { padding: 12px !important; padding-top: 64px !important; }
          .posts-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      <main
        className="posts-main"
        style={{ width: '100%', maxWidth: 960, margin: '0 auto', padding: 24, paddingTop: 72, minHeight: '100vh' }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--text)' }}>
          Posts
        </h1>

        {posts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="post-card">
                {/* Preview thumbnail */}
                <div className="post-card-preview">
                  {post.vizSrc ? (
                    <iframe src={post.vizSrc} title={`Preview: ${post.title}`} />
                  ) : (
                    <div className="post-card-preview-placeholder">
                      <span className="post-card-placeholder-icon">📄</span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="post-card-body">
                  {post.tag && <span className="post-tag">{post.tag}</span>}
                  <div className="post-title">{post.title}</div>
                  {post.excerpt && (
                    <p className="post-excerpt">{post.excerpt}</p>
                  )}
                  <div className="post-date">{post.date}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  const posts = files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
      const { data } = matter(raw);
      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title || filename.replace(/\.md$/, ''),
        date: data.date || '',
        tag: data.tag || '',
        excerpt: data.excerpt || '',
        vizSrc: data.vizSrc || null,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return { props: { posts } };
}
