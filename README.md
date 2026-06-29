# Personal Blog

A personal blog and developer portfolio frontend built with Next.js, React, and Tailwind CSS.

The current version reads articles from WordPress.com and uses Buttondown for newsletter signups when an API key is configured.

## WordPress Setup

Create a `.env.local` file and add your WordPress.com site URL:

```bash
WORDPRESS_SITE_URL=https://lizanotes6.wordpress.com
```

For WordPress.com sites, the app reads published posts from:

```text
https://public-api.wordpress.com/rest/v1.1/sites/{site}/posts/
```

If `WORDPRESS_SITE_URL` is missing or WordPress is unreachable, the homepage and article pages use local fallback posts.

## Newsletter Setup

The subscribe form posts to `/api/subscribe`. To make it real, add a Buttondown API key:

```bash
BUTTONDOWN_API_KEY=your_buttondown_api_key
NEWSLETTER_RSS_FEED=https://lizanotes6.wordpress.com/feed/
```

In Buttondown, connect the newsletter to the WordPress RSS feed. When a new essay is published in WordPress, Buttondown can send that post to subscribers.

Important: the API key only lets this site add subscribers to Buttondown. It does not automatically turn on new-post emails. In Buttondown, enable RSS-to-email/import for:

```text
https://lizanotes6.wordpress.com/feed/
```

Your WordPress feed is the trigger for new essay emails.

## Comments

WordPress.com comments are displayed on article pages after they are approved. For now, readers leave comments through the WordPress comment form linked from each article. Posting comments directly from this Next.js app into WordPress.com requires a WordPress.com authenticated app/OAuth flow.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

Open `http://localhost:3000` after starting the dev server.

## Next Steps

- Add real portfolio/about content.
- Add `BUTTONDOWN_API_KEY` for real newsletter subscriptions.
- Configure Buttondown RSS-to-email with `https://lizanotes6.wordpress.com/feed/`.
- Deploy the frontend to Vercel or Netlify.
