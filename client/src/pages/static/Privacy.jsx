import PageHeader from '../../components/layout/PageHeader';
import { useStore } from '../../context/StoreContext';

const sections = [
  {
    title: '1. Information we collect',
    body: [
      'When you create an account, place an order inquiry, subscribe to updates or contact us, we may collect your name, phone number, email address, delivery address and the products you are interested in.',
      'We also collect basic technical information needed to operate the website securely, such as your browser type and approximate usage data. We do not collect card details on this website because online payments are not processed here.',
    ],
  },
  {
    title: '2. How we use your information',
    body: [
      'We use your information to prepare and confirm orders, arrange delivery, respond to your questions, provide support, prevent fraud and improve the store experience.',
      'If you subscribe to our updates, we use your email to share product news and offers. You can ask us to stop sending these at any time.',
    ],
  },
  {
    title: '3. WhatsApp orders',
    body: [
      'When you proceed to WhatsApp, you leave this website and continue the conversation on WhatsApp. Messages you send there are handled under WhatsApp’s own terms and privacy policy as well as our own commitment to use your details only for your order and support.',
    ],
  },
  {
    title: '4. Sharing your information',
    body: [
      'We do not sell your personal information. We may share the details needed to fulfil your order with delivery partners and service providers, and where required by law.',
    ],
  },
  {
    title: '5. Storage and security',
    body: [
      'We take reasonable steps to protect your information, including hashed passwords and restricted access to administrative tools. No system is completely secure, so please use a strong, unique password and tell us promptly if you suspect unauthorised access.',
    ],
  },
  {
    title: '6. Your choices',
    body: [
      'You can review and update your profile and addresses in your account. You may ask us to correct or delete your personal information, or to stop marketing messages, by contacting us. Some records may need to be kept for legal or accounting reasons.',
    ],
  },
  {
    title: '7. Cookies and local storage',
    body: [
      'We use local storage to remember your cart and wishlist on your device. We may use essential cookies to keep you signed in and to operate the website securely.',
    ],
  },
  {
    title: '8. Contact',
    body: [
      'For privacy questions or requests, contact us using the details on our contact page. We will respond as soon as reasonably possible.',
    ],
  },
];

export default function Privacy() {
  const { settings } = useStore();

  return (
    <div>
      <PageHeader
        kicker="Legal"
        title="Privacy policy"
        description="How Queen Terry handles the personal information you share with us when you browse, create an account or place an order inquiry."
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
            <p className="font-semibold text-ink">Contact details</p>
            {settings.supportEmail && <p className="mt-1">Email: {settings.supportEmail}</p>}
            {settings.supportPhone && <p>Phone: {settings.supportPhone}</p>}
            {settings.address && <p>Address: {settings.address}</p>}
            <p className="mt-2">
              This policy is a general summary and should be reviewed against your final business
              practices and applicable Nigerian data protection requirements before launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
