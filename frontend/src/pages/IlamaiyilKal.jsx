import { useMemo, useState } from 'react';
import { FaArrowRight, FaBookOpen, FaBrain, FaClock, FaGraduationCap, FaSearch, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import './IlamaiyilKal.css';

const categories = [
  'அனைத்தும்',
  'தமிழ் & இலக்கியம்',
  'கல்வி',
  'போட்டித் தேர்வுகள்',
  'வாழ்க்கைத் திறன்கள்',
  'நல்ல பழக்கங்கள்',
  'தொழில்நுட்பம்',
  'பொது அறிவு',
  'தொழில் & எதிர்காலம்',
];

const contents = [
  {
    id: 1,
    icon: <FaBookOpen />,
    title: 'திருக்குறளும் பரிமேலழகனும்',
    category: 'தமிழ் & இலக்கியம்',
    description: 'திருவள்ளுவரின் திருக்குறளையும், அதற்கு பரிமேலழகர் வழங்கிய சிறப்பான உரையையும் அறிந்துகொள்ளும் பயணம். திருக்குறளின் ஆழமான கருத்துகளை எளிமையாகப் புரிந்துகொள்ள இந்தப் பகுதி உதவும்.',
    tags: ['திருக்குறள்', 'பரிமேலழகர்', 'திருவள்ளுவர்', 'தமிழ்', 'இலக்கியம்', 'அறிவு'],
    externalUrl: 'https://parimelazgan.onrender.com',
  },
  {
    id: 2,
    icon: <FaBrain />,
    title: 'நல்ல பழக்கங்கள் — சிறிய மாற்றங்கள், பெரிய பலன்கள்',
    category: 'நல்ல பழக்கங்கள்',
    description: 'தினசரி வாழ்க்கையில் சிறிய நல்ல பழக்கங்களை உருவாக்குவதன் மூலம் கல்வி, உடல், மனம் மற்றும் எதிர்கால வாழ்க்கையில் எவ்வாறு முன்னேறலாம் என்பதை அறிந்துகொள்ளுங்கள்.',
    tags: ['பழக்கங்கள்', 'ஒழுக்கம்', 'முன்னேற்றம்'],
  },
  {
    id: 3,
    icon: <FaGraduationCap />,
    title: 'போட்டித் தேர்வுகளுக்கு எப்படித் தயாராக வேண்டும்?',
    category: 'போட்டித் தேர்வுகள்',
    description: 'போட்டித் தேர்வுகளுக்கான திட்டமிடல், தொடர்ச்சியான பயிற்சி, நேர மேலாண்மை மற்றும் சரியான படிப்பு முறைகளைப் பற்றி அறிந்துகொள்ளுங்கள்.',
    tags: ['தேர்வு', 'பயிற்சி', 'படிப்பு'],
  },
  {
    id: 4,
    icon: <FaClock />,
    title: 'நேரத்தைச் சரியாகப் பயன்படுத்துவது எப்படி?',
    category: 'வாழ்க்கைத் திறன்கள்',
    description: 'மாணவர்கள் தங்களுடைய தினசரி நேரத்தைத் திட்டமிட்டு பயன்படுத்தி படிப்பிலும் வாழ்க்கையிலும் முன்னேறுவதற்கான எளிய வழிமுறைகள்.',
    tags: ['நேர மேலாண்மை', 'திட்டமிடல்', 'வாழ்க்கை'],
  },
  {
    id: 5,
    icon: <FaBookOpen />,
    title: 'புத்தகம் வாசிப்போம்; அறிவை வளர்ப்போம்',
    category: 'கல்வி',
    description: 'புத்தகம் வாசிக்கும் பழக்கம் மாணவர்களின் சிந்தனை, மொழித்திறன், அறிவு மற்றும் கற்பனைத் திறனை எவ்வாறு மேம்படுத்துகிறது என்பதை அறிந்துகொள்ளுங்கள்.',
    tags: ['வாசிப்பு', 'சிந்தனை', 'மொழித்திறன்'],
  },
  {
    id: 6,
    icon: <FaBrain />,
    title: 'மாணவர்கள் தெரிந்துகொள்ள வேண்டிய அடிப்படை நிதி அறிவு',
    category: 'வாழ்க்கைத் திறன்கள்',
    description: 'பணம், சேமிப்பு, செலவு மற்றும் பொறுப்பான நிதி பழக்கங்களைப் பற்றிய அடிப்படை அறிவை மாணவர்கள் அறிந்துகொள்ள உதவும் தகவல்கள்.',
    tags: ['பணம்', 'சேமிப்பு', 'பொறுப்பு'],
  },
];

function matchesContent(content, query) {
  const searchableText = [content.title, content.description, content.category, ...content.tags].join(' ').toLocaleLowerCase();
  return searchableText.includes(query.trim().toLocaleLowerCase());
}

export default function IlamaiyilKal() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('அனைத்தும்');

  const filteredContents = useMemo(() => contents.filter((content) => {
    const categoryMatches = selectedCategory === 'அனைத்தும்' || content.category === selectedCategory;
    return categoryMatches && (!query || matchesContent(content, query));
  }), [query, selectedCategory]);

  const clearSearch = () => setQuery('');

  return (
    <main className="ilamai-page">
      <section className="ilamai-hero">
        <div className="container ilamai-hero-inner">
          <AnimatedSection className="ilamai-hero-copy" variant="fadeInLeft">
            <span className="ilamai-eyebrow">மெய் புரட்சியின் அறிவுப் பயணம்</span>
            <h1>இளமையில் கல்</h1>
            <p className="ilamai-hero-subtitle">இளமையில் கற்றுக்கொள்வோம்; வாழ்நாள் முழுவதும் பயன்பெறுவோம்.</p>
            <p className="ilamai-hero-description">மாணவர்களின் கல்வி, அறிவு, பழக்கவழக்கம், போட்டித் தேர்வு, வாழ்க்கைத் திறன் மற்றும் எதிர்கால வளர்ச்சிக்கு உதவும் பயனுள்ள தகவல்களை ஒரே இடத்தில் அறிந்துகொள்ளுங்கள்.</p>
          </AnimatedSection>
          <motion.div className="ilamai-hero-symbol" initial={{ opacity: 0, scale: 0.7, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2 }} aria-hidden="true">
            <FaGraduationCap />
          </motion.div>
        </div>
      </section>

      <section className="ilamai-content container" aria-labelledby="ilamai-resources-title">
        <AnimatedSection className="ilamai-toolbar" variant="fadeInUp">
          <div className="ilamai-search-wrap">
            <label htmlFor="ilamai-search">தேடல்</label>
            <FaSearch aria-hidden="true" />
            <input id="ilamai-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="உங்களுக்குத் தேவையான தகவலைத் தேடுங்கள்..." />
            {query && <button type="button" className="ilamai-clear" onClick={clearSearch} aria-label="தேடலை அழிக்க"><FaTimes /> <span>தேடலை அழிக்க</span></button>}
          </div>
          <div className="ilamai-filters" aria-label="வகைத் தேர்வு">
            {categories.map((category) => (
              <button key={category} type="button" className={selectedCategory === category ? 'selected' : ''} aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)}>{category}</button>
            ))}
          </div>
        </AnimatedSection>

        <div className="ilamai-heading-row">
          <div>
            <span className="ilamai-section-kicker">அறிவுக் களஞ்சியம்</span>
            <h2 id="ilamai-resources-title">உங்கள் வளர்ச்சிக்கான பயனுள்ள தகவல்கள்</h2>
          </div>
          <span className="ilamai-count">{filteredContents.length} பதிவுகள்</span>
        </div>

        {filteredContents.length > 0 ? (
          <div className="ilamai-grid">
            {filteredContents.map((content, index) => {
              const cardBody = (
                <>
                  <div className="ilamai-card-top"><span className="ilamai-card-icon">{content.icon}</span><span className="ilamai-category">{content.category}</span></div>
                  <h3>{content.title}</h3>
                  <p>{content.description}</p>
                  <div className="ilamai-tags">{content.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <span className="ilamai-read-link">மேலும் அறிய <FaArrowRight aria-hidden="true" /></span>
                </>
              );

              return (
                <AnimatedSection key={content.id} className="ilamai-card card" variant="fadeInUp" delay={index * 0.05}>
                  {content.externalUrl ? <a href={content.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`${content.title} — மேலும் அறிய`}>{cardBody}</a> : <div>{cardBody}</div>}
                </AnimatedSection>
              );
            })}
          </div>
        ) : (
          <div className="ilamai-empty" role="status">
            <FaSearch aria-hidden="true" />
            <p>உள்ளடக்கம் எதுவும் கிடைக்கவில்லை. வேறு சொல்லைத் தேடிப் பாருங்கள்.</p>
            <button type="button" className="btn btn-primary" onClick={() => { clearSearch(); setSelectedCategory('அனைத்தும்'); }}>தேடலை அழிக்க</button>
          </div>
        )}
      </section>
    </main>
  );
}