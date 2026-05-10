import { useState } from 'react';
import { FaPhone, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { submitContact } from '../api';
import { useCMS } from '../hooks/useCMS';
import './Contact.css';

export default function Contact() {
  const { c } = useCMS('contact');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      toast.success('Message sent! We will reply within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>{c('hero_title','Contact Us')}</h1>
          <p>{c('hero_desc',"We're here to help. Reach out to us anytime.")}</p>
        </div>
      </div>

      <div className="container contact-container">
        <div className="contact-info">
          <h3>{c('contact_title','Get In Touch')}</h3>
          <p>{c('contact_desc',"Have questions about career guidance, registration, or volunteering? We'd love to hear from you.")}</p>

          <div className="contact-items">
            <a href={`tel:${c('phone','+917200282924').replace(/\s/g,'')}`} className="contact-item">
              <div className="ci-icon"><FaPhone /></div>
              <div>
                <h4>{c('phone_label','Phone')}</h4>
                <p>{c('phone','+91 72002 82924')}</p>
              </div>
            </a>
            <a href={c('whatsapp_link','https://chat.whatsapp.com/LM8lhAO5wReB5V4Yes1DXq')} target="_blank" rel="noreferrer" className="contact-item">
              <div className="ci-icon whatsapp"><FaWhatsapp /></div>
              <div>
                <h4>{c('whatsapp_label','WhatsApp Community')}</h4>
                <p>{c('whatsapp_desc','Join our community')}</p>
              </div>
            </a>
          </div>

          {/* WhatsApp QR Code */}
          <div className="whatsapp-qr-box">
            <p className="qr-label"><FaWhatsapp /> Scan to Join WhatsApp Community</p>
            <a href={c('whatsapp_link','https://chat.whatsapp.com/LM8lhAO5wReB5V4Yes1DXq')} target="_blank" rel="noreferrer">
              <img src="/qrwhatsapp.png" alt="Scan QR to join WhatsApp Community" className="whatsapp-qr-img" />
            </a>
            <p className="qr-hint">Point your phone camera at the QR code to join instantly</p>
          </div>

          <div className="social-section">
            <h4>{c('social_label','Follow Us')}</h4>
            <div className="social-row">
              <a href={c('facebook','https://www.facebook.com/people/Mei-Puratchi/pfbid02CebTu4BGTjdLaneMEbRXa7QQwAxpHQ4tVukDr9XCAzokawjEC28d8YSeeang6JGFl/')} target="_blank" rel="noreferrer" className="social-btn fb"><FaFacebook /></a>
              <a href={c('twitter','https://x.com/meipuratchi')} target="_blank" rel="noreferrer" className="social-btn tw"><FaTwitter /></a>
              <a href={c('instagram','https://www.instagram.com/meipuratchi/')} target="_blank" rel="noreferrer" className="social-btn ig"><FaInstagram /></a>
              <a href={c('linkedin','https://www.linkedin.com/in/%E0%AE%AE%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%AA%E0%AF%81%E0%AE%B0%E0%AE%9F%E0%AF%8D%E0%AE%9A%E0%AE%BF/')} target="_blank" rel="noreferrer" className="social-btn li"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className="contact-form-wrap card">
          <h3><FaEnvelope /> Send Us a Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Your Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="What is this about?" required />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." required />
            </div>
            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Sending...' : '📨 Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
