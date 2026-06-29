import { readFileSync, writeFileSync, existsSync } from "fs";

const RSS_URL = process.env.NEWSLETTER_RSS_FEED;
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL;
const STATE_PATH = ".github/state/last-post.json";

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return "";
  return match[1].replace("<![CDATA[", "").replace("]]>", "").trim();
}

async function getLatestPost() {
  const res = await fetch(RSS_URL);
  const xml = await res.text();
  const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/);
  if (!itemMatch) return null;
  const block = itemMatch[1];
  return {
    title: extractTag(block, "title"),
    link: extractTag(block, "link"),
    guid: extractTag(block, "guid"),
    excerpt: extractTag(block, "description").slice(0, 280),
  };
}

function getLastSentGuid() {
  if (!existsSync(STATE_PATH)) return null;
  return JSON.parse(readFileSync(STATE_PATH, "utf-8")).lastGuid;
}

function saveLastSentGuid(guid) {
  writeFileSync(STATE_PATH, JSON.stringify({ lastGuid: guid }, null, 2));
}

async function getActiveSubscribers() {
  const subscribers = [];
let url = `https://connect.mailerlite.com/api/subscribers?filter[group]=${MAILERLITE_GROUP_ID}&filter[status]=active&limit=100`;
  while (url) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        Accept: "application/json",
      },
    });
    const json = await res.json();
    console.log("MailerLite response:", JSON.stringify(json, null, 2)); // ADD THIS
    subscribers.push(...json.data.map((s) => s.email));
    url = json.links?.next || null;
  }

  return subscribers;
}

function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size));
  return out;
}

async function sendViaResend(post, emails) {
  const html = `
    <h2>${post.title}</h2>
    <p>${post.excerpt}</p>
    <p><a href="${post.link}">Read the full essay →</a></p>
  `;

  const batches = chunk(emails, 100);

  for (const batch of batches) {
    const payload = batch.map((to) => ({
      from: RESEND_FROM,
      to,
      subject: post.title,
      html,
    }));

    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Resend batch failed:", await res.text());
      process.exit(1);
    }
  }
}

async function main() {
  const post = await getLatestPost();
  if (!post) {
    console.log("No posts found in feed.");
    return;
  }

  const lastSentGuid = getLastSentGuid();
  if (post.guid === lastSentGuid) {
    console.log("No new post since last check.");
    return;
  }

  console.log(`New post found: ${post.title}`);
  const subscribers = await getActiveSubscribers();
  console.log(`Sending to ${subscribers.length} subscribers...`);

  if (subscribers.length > 0) {
    await sendViaResend(post, subscribers);
    }

  saveLastSentGuid(post.guid);
  console.log("Done.");
}

main();