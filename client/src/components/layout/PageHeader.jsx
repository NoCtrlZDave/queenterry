export default function PageHeader({ kicker, title, description, children }) {
  return (
    <section className="border-b border-line bg-cloud">
      <div className="shell py-10 sm:py-14">
        {kicker && <p className="section-kicker">{kicker}</p>}
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-smoke sm:text-base">
            {description}
          </p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
