import { Quote, Star } from 'lucide-react';

const samples = [
  {
    quote:
      'The ordering process was clear and simple. I sent my cart on WhatsApp and got a quick response with delivery details.',
    name: 'Sample customer',
    detail: 'Placeholder review — Lagos',
  },
  {
    quote:
      'I liked being able to compare products and prices before reaching out. The team confirmed everything before I paid.',
    name: 'Sample customer',
    detail: 'Placeholder review — Abuja',
  },
  {
    quote:
      'A calm, straightforward shopping experience. Product information was easy to find and the support was helpful.',
    name: 'Sample customer',
    detail: 'Placeholder review — Port Harcourt',
  },
];

export default function Testimonials() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {samples.map((item, index) => (
          <figure
            key={index}
            className="flex flex-col rounded-3xl border border-line bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <Quote className="h-6 w-6 text-accent/30" />
              <span className="rounded-full bg-mist px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-smoke">
                Sample
              </span>
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">
              “{item.quote}”
            </blockquote>
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-50 text-xs font-bold text-accent">
                {item.name.charAt(0)}
              </span>
              <div>
                <figcaption className="text-xs font-semibold text-ink">{item.name}</figcaption>
                <p className="text-[10px] text-smoke">{item.detail}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3 w-3 fill-gold text-gold" />
                ))}
              </div>
            </div>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-smoke">
        Illustrative testimonials are shown until verified customer reviews are added.
      </p>
    </div>
  );
}
