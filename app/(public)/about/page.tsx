const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'The Ledger';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="label-sans text-muted mb-3">Colophon</div>
        <h1 className="display-serif text-5xl md:text-7xl font-black tracking-tight leading-none">
          About {SITE_NAME}
        </h1>
      </div>

      <div className="prose-article">
        <p>
          {SITE_NAME} is an independent journal covering markets, money, and the
          global economy. It is written for readers who want sharp, considered
          commentary — not the firehose.
        </p>
        <h2>What you'll find here</h2>
        <p>
          Coverage spans equities and indices, personal finance, digital assets,
          macroeconomics, and investing strategy. Each piece earns its place by
          saying something worth saying.
        </p>
        <h2>Who writes it</h2>
        <p>
          One editor. One desk. The byline on every piece is the person who
          wrote it.
        </p>
        <h2>How to reach us</h2>
        <p>
          Tips, corrections, and reader letters are welcome. The newsletter is
          the best way to stay current.
        </p>
      </div>
    </div>
  );
}
