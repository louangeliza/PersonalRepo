type WordPressSubscribeCtaProps = {
  className?: string;
};

export function WordPressSubscribeCta({ className = "" }: WordPressSubscribeCtaProps) {
  const subscribeUrl =
    process.env.NEWSLETTER_SUBSCRIBE_URL ?? "https://lizanotes6.wordpress.com/subscribe/";

  return (
    <div className={`w-full sm:max-w-md ${className}`}>
      <a
        href={subscribeUrl}
        className="flex min-h-12 w-full items-center justify-center rounded-md bg-[#f0b08d] px-5 text-center text-sm font-semibold text-[#1e1d1a] transition hover:bg-[#ffc2a3]"
        target="_blank"
        rel="noreferrer"
      >
        Subscribe on WordPress
      </a>
      <p className="mt-3 text-sm leading-6 text-white/75">
        WordPress will email you whenever a new essay is published.
      </p>
    </div>
  );
}
