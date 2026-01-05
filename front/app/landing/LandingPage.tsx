import React, { useState, useEffect } from 'react';
import { 
  FaStethoscope, 
  FaUserMd, 
  FaHospital, 
  FaCalendarCheck,
  FaXRay,
  FaHeartbeat,
  FaPills,
  FaMicroscope,
  FaAmbulance,
  FaClock,
  FaShieldAlt,
  FaStar,
  FaArrowRight,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope
} from 'react-icons/fa';
import './LandingPage.css';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  rating: number;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Hassan Alami",
      specialty: "Médecin Généraliste",
      experience: "15 ans d'expérience",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.9
    },
    {
      id: 2,
      name: "Dr. Fatima Zahra",
      specialty: "Cardiologue",
      experience: "12 ans d'expérience",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.8
    },
    {
      id: 3,
      name: "Dr. Mohammed Benjelloun",
      specialty: "Radiologue",
      experience: "10 ans d'expérience",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.7
    },
    {
      id: 4,
      name: "Dr. Amina Chakir",
      specialty: "Pédiatre",
      experience: "8 ans d'expérience",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4.9
    }
  ];

  const services: Service[] = [
    {
      id: 1,
      title: "Consultation Générale",
      description: "Consultations médicales complètes pour tous types de pathologies",
      icon: <FaStethoscope />,
      color: "#84cc16"
    },
    {
      id: 2,
      title: "Radiologie",
      description: "Examens radiologiques avec équipements de dernière génération",
      icon: <FaXRay />,
      color: "#22c55e"
    },
    {
      id: 3,
      title: "Cardiologie",
      description: "Diagnostic et suivi des maladies cardiovasculaires",
      icon: <FaHeartbeat />,
      color: "#10b981"
    },
    {
      id: 4,
      title: "Analyses Médicales",
      description: "Laboratoire d'analyses biologiques et biochimiques",
      icon: <FaMicroscope />,
      color: "#14b8a6"
    },
    {
      id: 5,
      title: "Pharmacie",
      description: "Délivrance de médicaments et conseils pharmaceutiques",
      icon: <FaPills />,
      color: "#06b6d4"
    },
    {
      id: 6,
      title: "Urgences",
      description: "Service d'urgence disponible 24h/24 et 7j/7",
      icon: <FaAmbulance />,
      color: "#0ea5e9"
    }
  ];

  const features = [
    {
      icon: <FaClock />,
      title: "Disponibilité 24/7",
      description: "Service d'urgence disponible à tout moment"
    },
    {
      icon: <FaShieldAlt />,
      title: "Sécurité & Confidentialité",
      description: "Vos données médicales sont protégées"
    },
    {
      icon: <FaUserMd />,
      title: "Équipe Qualifiée",
      description: "Médecins expérimentés et certifiés"
    },
    {
      icon: <FaHospital />,
      title: "Équipements Modernes",
      description: "Technologies médicales de pointe"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <FaStethoscope />
            </div>
            <span className="logo-text">Noble Cabinet</span>
          </div>

          <div className="nav-links">
            <a 
              href="#home" 
              className={activeSection === 'home' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            >
              Accueil
            </a>
            <a 
              href="#services"
              className={activeSection === 'services' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
            >
              Services
            </a>
            <a 
              href="#doctors"
              className={activeSection === 'doctors' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('doctors'); }}
            >
              Médecins
            </a>
            <a 
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            >
              Contact
            </a>
          </div>

          <button className="login-btn" onClick={handleLoginClick}>
            <span>Espace Professionnel</span>
            <FaArrowRight />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <FaStar className="badge-icon" />
              <span>Cabinet Médical de Confiance</span>
            </div>
            
            <h1 className="hero-title">
              Votre Santé, <br />
              <span className="gradient-text">Notre Priorité</span>
            </h1>
            
            <p className="hero-description">
              Solutions simples pour piloter votre cabinet et votre activité avec clarté. 
              Des soins de qualité, une équipe dévouée, et des technologies modernes 
              pour votre bien-être.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollToSection('services')}>
                <span>Découvrir nos services</span>
                <FaArrowRight />
              </button>
              <button className="btn-secondary" onClick={() => scrollToSection('contact')}>
                <FaPhone />
                <span>Nous contacter</span>
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Années d'expérience</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Patients satisfaits</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">20+</div>
                <div className="stat-label">Médecins experts</div>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600" 
                alt="Medical professionals"
                className="hero-img"
              />
              <div className="floating-card card-1">
                <FaCalendarCheck className="card-icon" />
                <div className="card-content">
                  <div className="card-title">Rendez-vous facile</div>
                  <div className="card-subtitle">En ligne 24/7</div>
                </div>
              </div>
              <div className="floating-card card-2">
                <FaHeartbeat className="card-icon" />
                <div className="card-content">
                  <div className="card-title">Suivi personnalisé</div>
                  <div className="card-subtitle">Par nos experts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <FaHospital />
              <span>Nos Services</span>
            </div>
            <h2 className="section-title">
              Des Services <span className="gradient-text">Complets</span>
            </h2>
            <p className="section-description">
              Nous offrons une gamme complète de services médicaux pour répondre à tous vos besoins de santé
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="service-icon" style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <button className="service-link" style={{ color: service.color }}>
                  En savoir plus
                  <FaArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="doctors-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <FaUserMd />
              <span>Notre Équipe</span>
            </div>
            <h2 className="section-title">
              Rencontrez Nos <span className="gradient-text">Médecins</span>
            </h2>
            <p className="section-description">
              Une équipe de professionnels qualifiés et dévoués à votre santé
            </p>
          </div>

          <div className="doctors-grid">
            {doctors.map((doctor, index) => (
              <div 
                key={doctor.id} 
                className="doctor-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="doctor-image-wrapper">
                  <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                  <div className="doctor-overlay">
                    <button className="doctor-contact-btn">
                      Prendre RDV
                    </button>
                  </div>
                </div>
                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                  <p className="doctor-experience">{doctor.experience}</p>
                  <div className="doctor-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(doctor.rating) ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                    <span className="rating-value">{doctor.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">Prêt à prendre soin de votre santé ?</h2>
              <p className="cta-description">
                Rejoignez des milliers de patients satisfaits qui nous font confiance
              </p>
            </div>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => scrollToSection('contact')}>
                <FaCalendarCheck />
                <span>Prendre rendez-vous</span>
              </button>
              <button className="btn-outline">
                <FaPhone />
                <span>Appelez-nous</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <FaEnvelope />
              <span>Contact</span>
            </div>
            <h2 className="section-title">
              Contactez <span className="gradient-text">Nous</span>
            </h2>
            <p className="section-description">
              Nous sommes là pour répondre à toutes vos questions
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-details">
                  <h4>Adresse</h4>
                  <p>123 Rue Principale, Casablanca<br />Maroc, 20000</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-details">
                  <h4>Téléphone</h4>
                  <p>+212 5XX-XXXXXX<br />+212 6XX-XXXXXX</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>contact@noblecabinet.ma<br />info@noblecabinet.ma</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FaClock />
                </div>
                <div className="contact-details">
                  <h4>Horaires</h4>
                  <p>Lun - Ven: 8h - 20h<br />Sam: 9h - 17h</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Votre nom" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Votre email" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Votre téléphone" className="form-input" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Votre message" rows={5} className="form-input"></textarea>
                </div>
                <button type="submit" className="btn-submit">
                  <span>Envoyer le message</span>
                  <FaArrowRight />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <FaStethoscope />
                <span>Noble Cabinet</span>
              </div>
              <p className="footer-description">
                Solutions simples pour piloter votre cabinet et votre activité avec clarté.
              </p>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Liens Rapides</h4>
              <ul className="footer-links">
                <li><a href="#home">Accueil</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#doctors">Médecins</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Services</h4>
              <ul className="footer-links">
                <li><a href="#services">Consultation</a></li>
                <li><a href="#services">Radiologie</a></li>
                <li><a href="#services">Cardiologie</a></li>
                <li><a href="#services">Analyses</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Contact</h4>
              <ul className="footer-contacts">
                <li><FaMapMarkerAlt /> Casablanca, Maroc</li>
                <li><FaPhone /> +212 5XX-XXXXXX</li>
                <li><FaEnvelope /> contact@noblecabinet.ma</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Noble Cabinet. Tous droits réservés.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Politique de confidentialité</a>
              <a href="#terms">Conditions d'utilisation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
