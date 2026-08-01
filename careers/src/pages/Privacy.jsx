import './Legal.css';

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="container legal-inner">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="legal-body">
          <section>
            <h2>1. Information We Collect</h2>
            <p>When you use Meipuratchi Careers, we collect:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email, phone number, password (stored hashed).</li>
              <li><strong>Application Information:</strong> College, degree, year of study, skills, resume link, LinkedIn/portfolio URL, and cover letter.</li>
              <li><strong>Usage Data:</strong> Application timestamps and status changes.</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>Your information is used exclusively to:</p>
            <ul>
              <li>Process and evaluate your internship application.</li>
              <li>Communicate with you about your application status.</li>
              <li>Generate offer letters and completion certificates.</li>
              <li>Improve the hiring process and platform experience.</li>
            </ul>
            <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2>3. Resume &amp; Portfolio Links</h2>
            <p>
              We only ask for a link to your resume (e.g., Google Drive, Dropbox). We do not store
              or process resume files directly. Ensure your shared link has the appropriate access
              settings. We are not responsible for the privacy of content hosted on third-party platforms.
            </p>
          </section>

          <section>
            <h2>4. Data Storage</h2>
            <p>
              Your data is stored on MongoDB Atlas cloud infrastructure. Passwords are hashed
              using bcrypt and are never stored in plaintext. Access to the database is restricted
              to authorized team members only.
            </p>
          </section>

          <section>
            <h2>5. Data Retention</h2>
            <p>
              Application data is retained for up to 12 months after the conclusion of a hiring cycle.
              You may request deletion of your account and data by contacting us.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your account and associated data.</li>
            </ul>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              This portal uses browser localStorage to store your session token.
              No third-party cookies or tracking scripts are used.
            </p>
          </section>

          <section>
            <h2>8. Children&apos;s Privacy</h2>
            <p>
              This portal is intended for users 16 years of age and older.
              We do not knowingly collect data from children under 16.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              For privacy-related requests, contact us via the{' '}
              <a href="https://meipuratchi.in/contact" target="_blank" rel="noreferrer">Meipuratchi Contact Page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
