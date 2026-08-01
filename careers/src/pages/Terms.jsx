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
              Meipuratchi (மெய் புரட்சி) is a student career guidance initiative serving Tamil Nadu.
              This Careers portal is for <strong>software internships only</strong> — full stack development,
              mobile app development, UI/UX design, and related technical roles.
              Guidance and counseling roles are not listed here and will be handled separately.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>To apply for software internship positions listed on this portal, you must:</p>
            <ul>
              <li>Be at least 16 years of age.</li>
              <li>Have relevant technical skills for the role (e.g., React, Node.js, React Native, Flutter, etc.).</li>
              <li>Provide accurate personal, academic, and professional information.</li>
              <li>Have access to a laptop/PC and a reliable internet connection.</li>
            </ul>
          </section>

          <section>
            <h2>3. Internship Nature</h2>
            <p>
              All software roles are internship positions (paid or unpaid as specified per role).
              Applying does not guarantee selection. Interns will receive:
            </p>
            <ul>
              <li>An official <strong>Internship Offer Letter</strong> upon selection.</li>
              <li>An <strong>Internship Completion Letter</strong> upon successful completion.</li>
              <li>Real-world experience on a live, production MERN stack platform.</li>
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
            <p>All software interns are expected to:</p>
            <ul>
              <li>Maintain professional conduct in all communications with the team.</li>
              <li>Keep any internal code, data, or platform access confidential.</li>
              <li>Complete agreed tasks and raise blockers early — don&apos;t go silent.</li>
              <li>Follow Git workflow and code review guidelines set by the team.</li>
              <li>Notify the team at least 3 days in advance if unable to continue.</li>
            </ul>
            <p>
              Violation of these norms may result in removal from the program without a completion letter.
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
