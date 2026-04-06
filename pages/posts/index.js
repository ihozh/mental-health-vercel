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
          gap: 20px;
        }
        .post-card {
          aspect-ratio: 1 / 1;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.15s, transform 0.15s;
          overflow: hidden;
        }
        .post-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
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
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.4;
          flex: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .post-date {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 12px;
        }
        @media (max-width: 600px) {
          .posts-main { padding: 12px !important; padding-top: 64px !important; }
          .posts-grid { grid-template-columns: 1fr; gap: 12px; }
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
                <div>
                  {post.tag && <span className="post-tag">{post.tag}</span>}
                  <div className="post-title">{post.title}</div>
                  {post.excerpt && (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="post-date">{post.date}</div>
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
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return { props: { posts } };
}
