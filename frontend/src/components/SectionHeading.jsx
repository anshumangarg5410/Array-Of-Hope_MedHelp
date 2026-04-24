export default function SectionHeading({ eyebrow, title, body, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <span className="mb-3 inline-flex rounded-full border border-sky-200/60 bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">{title}</h2>
      {body ? <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{body}</p> : null}
    </div>
  );
}
