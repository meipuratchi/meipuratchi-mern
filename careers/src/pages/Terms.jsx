import './Legal.css';

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="container legal-inner">
        <h1>Terms &amp; Conditions</h1>
        <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="legal-body">
          <section>
            <h2>1. About Meipuratchi Careers</h2>
            <p>
              Meipuratchi (மெய் புரட்சி) is a non-commercial student career guidance initiative
              serving Tamil Nadu government school students. This Careers portal allows volunteers
              and interns to apply for open roles within the Meipuratchi team.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>To apply for positions listed on this portal, you must:</p>
            <ul>
              <li>Be at least 16 years of age.</li>
              <li>Provide accurate personal and professional information.</li>
              <li>Have access to the tools required for the role (e.g., internet connection, laptop).</li>
            </ul>
          </section>

          <section>
            <h2>3. Internship Nature</h2>
            <p>
              Most roles listed are unpaid or stipend-based internships. Unless explicitly stated,
              applying does not guarantee selection. All positions are voluntary contributions
              to a social initiative. Interns will receive:
            </p>
            <ul>
              <li>An official <strong>Internship Offer Letter</strong> upon selection.</li>
              <li>An <strong>Internship Completion Letter</strong> upon successful completion of the agreed duration.</li>
              <li>Mentorship and real-world project experience on a live platform.</li>
            </ul>
          </section>

          <section>
            <h2>4. Application Process</h2>
            <p>
              By submitting an application, you confirm that all information provided is truthful
              and accurate. Meipuratchi reserves the right to reject applications without providing
              a reason. Applying does not create any employment or contractual relationship.
            </p>
          </section>

          <section>
            <h2>5. Code of Conduct</h2>
            <p>All interns and volunteers are expected to:</p>
            <ul>
              <li>Maintain professional conduct in all communications.</li>
              <li>Respect student privacy — never share student data outside the platform.</li>
              <li>Complete agreed tasks within the committed timeline.</li>
              <li>Notify the team in advance if unable to continue the internship.</li>
            </ul>
            <p>
              Violation of these norms may result in removal from the team without a completion letter.
            </p>
          </section>

          <section>
            <h2>6. Intellectual Property</h2>
            <p>
              Any work product created during your internship (code, designs, content) remains
              the property of Meipuratchi. You may include the work in your portfolio with
              appropriate credit.
            </p>
          </section>

          <section>
            <h2>7. Account Responsibility</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials.
              Do not share your password with others. Notify us immediately if you suspect
              unauthorized access.
            </p>
          </section>

          <section>
            <h2>8. Termination</h2>
            <p>
              Meipuratchi reserves the right to remove any volunteer or intern from the program
              for breach of conduct, inactivity, or any other reason at its sole discretion.
            </p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Careers portal
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              For questions about these Terms, contact us through the{' '}
              <a href="https://meipuratchi.in/contact" target="_blank" rel="noreferrer">Meipuratchi Contact Page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
