import PageHeader from '../../components/layout/PageHeader';
import { useStore } from '../../context/StoreContext';

const sections = [
  {
    title: '1. About these terms',
    body: [
      'These terms govern your use of the Queen Terry website and the order inquiries you create through it. By using the website you agree to these terms. If you do not agree, please do not use the website.',
    ],
  },
  {
    title: '2. Products and information',
    body: [
      'We aim to describe products accurately, but specifications, images, availability and prices can change. Some catalogue listings are marked as demo and must be confirmed with our team. Where there is a conflict, the details confirmed by our team on WhatsApp take priority.',
      'Colours and visuals may appear differently on different screens. Generated product visuals are illustrative and may not represent the exact product appearance.',
    ],
  },
  {
    title: '3. Prices and orders',
    body: [
      'Prices are displayed in Nigerian Naira (₦) and may change without notice. Creating an order inquiry on this website does not create a binding sale, confirm stock or reserve a product.',
      'Your order is confirmed only after our team verifies availability, delivery details and payment arrangements with you on WhatsApp. We may decline or cancel an inquiry where a product is unavailable, a price was listed in error, or we suspect fraud.',
    ],
  },
  {
    title: '4. Payment',
    body: [
      'We do not collect online payments through this website. Payment is arranged directly with Queen Terry after confirmation. Only use payment details confirmed by our official channel, and never send money to an unverified account.',
    ],
  },
  {
    title: '5. Delivery',
    body: [
      'Delivery timelines and costs vary by location and product. Estimates are confirmed before your order is finalised. Risk in the goods passes to you on delivery, subject to applicable consumer law.',
    ],
  },
  {
    title: '6. Returns and warranty',
    body: [
      'Returns, warranty and fault claims are handled under our returns policy and the terms provided by the relevant manufacturer. Report damage or incorrect items promptly and keep your packaging and proof of purchase.',
    ],
  },
  {
    title: '7. Accounts',
    body: [
      'You are responsible for keeping your account password secure and for activity under your account. Provide accurate information and let us know if you believe your account has been compromised.',
    ],
  },
  {
    title: '8. Acceptable use',
    body: [
      'Do not misuse the website, attempt to gain unauthorised access, interfere with its operation, scrape it at scale or use it for unlawful purposes.',
    ],
  },
  {
    title: '9. Limitation of liability',
    body: [
      'To the extent permitted by law, Queen Terry is not liable for indirect or consequential losses arising from use of the website. Nothing in these terms limits rights you have under applicable consumer protection law.',
    ],
  },
  {
    title: '10. Changes and contact',
    body: [
      'We may update these terms from time to time. Continued use of the website after changes means you accept the updated terms. For questions, contact us through the contact page.',
    ],
  },
];

export default function Terms() {
  const { settings } = useStore();

  return (
    <div>
      <PageHeader
        kicker="Legal"
        title="Terms & conditions"
        description="The rules that apply when you use the Queen Terry website and create an order inquiry."
      />

      <div className="shell py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs text-smoke">Last updated: November 2026</p>
          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-smoke">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-cloud p-5 text-xs leading-relaxed text-smoke">
            <p className="font-semibold text-ink">Business details</p>
            {settings.supportEmail && <p className="mt-1">Email: {settings.supportEmail}</p>}
            {settings.supportPhone && <p>Phone: {settings.supportPhone}</p>}
            {settings.address && <p>Address: {settings.address}</p>}
            <p className="mt-2">
              These terms are a general template and should be reviewed against your final business
              practices and applicable Nigerian law before launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
