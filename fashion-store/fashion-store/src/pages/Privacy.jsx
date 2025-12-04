import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="opacity-90 mb-6">
        It is Aura Lifestyle’s policy to respect your privacy regarding any information we may
        collect while operating our website. This Privacy Policy applies to{" "}
        <span className="font-medium">theauralifestyle.org</span> (“Aura Lifestyle”, “we”, “us”).
        It explains what information we collect, how we use it, and when we may disclose it.
        This policy applies only to information collected through the website and not from other sources.
      </p>

      <section className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold">1. Website Visitors</h2>
        <p>
          Like most website operators, we collect non-personally identifying information typically made available by browsers and servers,
          such as browser type, language preference, referring site, and the date/time of each request. We use this to understand usage trends
          and may publish aggregated, non-identifying statistics.
        </p>
      </section>

      <section className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold">2. Personally-Identifying Information</h2>
        <p>
          Certain interactions require personally-identifying information (e.g., comments or account creation). The type and amount of data
          depends on the interaction. For example, commenters may be asked for a username and email address.
        </p>
      </section>

      <section className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold">3. Security</h2>
        <p>
          We use commercially acceptable means to protect your Personal Information, but no method of transmission or electronic storage is 100% secure.
        </p>
      </section>

      <section className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold">4. Protection of Information</h2>
        <p>
          We disclose potentially personally-identifying information only to employees, contractors, and affiliated organizations that need it to
          process it on our behalf or provide website services—and who have agreed not to disclose it to others. Some may be located outside your
          country; by using our website you consent to such transfer. We do not rent or sell such information.
        </p>
        <p>
          We may disclose information in response to a subpoena, court order, or other governmental request, or when we believe in good faith
          that disclosure is reasonably necessary to protect our rights, third parties, or the public.
        </p>
        <p>
          Registered users may occasionally receive emails about new features, feedback requests, or updates. You may opt out as provided in those emails.
          Requests you send to us (e.g., support) may be published to help clarify or respond to your query or assist other users.
        </p>
      </section>

      <section className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold">5. Aggregated Statistics</h2>
        <p>
          We may collect and display aggregated statistics about visitor behavior; these do not include personally-identifying information.
        </p>
      </section>

      <section className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold">6. Cookies</h2>
        <p>
          We use cookies and similar technologies to store preferences, serve relevant content, and analyze traffic. You can set your browser
          to refuse cookies; some site features may not function properly without them. By continuing to use the site without changing settings,
          you consent to our use of cookies.
        </p>
      </section>

      <section className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold">7. E-commerce</h2>
        <p>
          When purchasing products or services, we may collect additional personal and financial information necessary to process the transaction.
          You may refuse to supply information, but it may prevent you from engaging in certain activities. Contact:{" "}
          <a className="underline" href="mailto:contact@theauralifestyle.org">contact@theauralifestyle.org</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time at our sole discretion. Please check this page frequently for changes. Your continued
          use of the site after any change constitutes acceptance of the updated policy.
        </p>
      </section>
    </div>
  );
}
