import Card from "./Card";

export default function Timeline({ items }) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400" />
              {index !== items.length - 1 ? <div className="mt-2 h-full w-px bg-slate-200 dark:bg-white/10" /> : null}
            </div>
            <div className="pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.date}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-sky-700 dark:text-sky-300">{item.subtitle}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
