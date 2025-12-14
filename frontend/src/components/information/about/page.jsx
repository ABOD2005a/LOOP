import React, { useEffect, useRef } from 'react';
import "./About.css"


export default function About() {
  const observerRef = useRef(null);
  const statsObserverRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 100);
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .scale-in').forEach((el) => {
      observerRef.current?.observe(el);
    });

    // Counter animation for stats
    const animateCounter = (element, target, suffix) => {
      const duration = 2000;
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        let displayValue;
        if (target >= 1000000) {
          displayValue = (current / 1000000).toFixed(1).replace('.0', '');
        } else if (target >= 1000) {
          displayValue = (current / 1000).toFixed(0);
        } else {
          displayValue = Math.floor(current);
        }

        element.textContent = displayValue + suffix;
      }, 16);
    };

    // Observe stat cards for counter animation
    statsObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const valueElement = card.querySelector('.stat-value');
          const target = parseInt(card.getAttribute('data-target'));
          const suffix = valueElement.getAttribute('data-suffix');
          
          animateCounter(valueElement, target, suffix);
          statsObserverRef.current?.unobserve(card);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card[data-target]').forEach((card) => {
      statsObserverRef.current?.observe(card);
    });

    return () => {
      observerRef.current?.disconnect();
      statsObserverRef.current?.disconnect();
    };
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="badge fade-in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            <span>Our Story</span>
          </div>
          <h1 className="fade-in">
            Transforming Waste Into<br/>
            <span className="text-primary">Opportunity</span>
          </h1>
          <p className="fade-in">
            Collect & Earn was founded with a simple mission: make recycling rewarding for everyone. 
            We connect collectors with recyclers, creating a sustainable ecosystem where environmental 
            responsibility meets economic opportunity.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content fade-in">
              <div className="badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
                <span>Our Mission</span>
              </div>
              <h2>Building a Circular Economy</h2>
              <p>
                We're on a mission to revolutionize how communities handle recyclable materials. 
                By creating direct connections between collectors and certified recycling facilities, 
                we're building a more efficient and rewarding recycling ecosystem.
              </p>
              <p>
                Our platform empowers individuals to earn from their recycling efforts while 
                contributing to a cleaner planet. Every bottle collected, every can recycled, 
                brings us closer to a sustainable future.
              </p>
            </div>
            <div className="stats-grid">
              <div className="stat-card scale-in" data-target="50000">
                <div className="stat-value" data-suffix="K+">0</div>
                <div className="stat-label">Active Collectors</div>
              </div>
              <div className="stat-card scale-in" data-target="2000000">
                <div className="stat-value" data-suffix="M+">0</div>
                <div className="stat-label">Items Recycled</div>
              </div>
              <div className="stat-card scale-in" data-target="500">
                <div className="stat-value" data-suffix="+">0</div>
                <div className="stat-label">Partner Facilities</div>
              </div>
              <div className="stat-card scale-in" data-target="100">
                <div className="stat-value" data-suffix="+">0</div>
                <div className="stat-label2">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Our Core Values</h2>
            <p>These principles guide everything we do, from product development to community partnerships.</p>
          </div>
          <div className="values-grid">
            <div className="value-card fade-in">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <h3>Sustainability First</h3>
              <p>Every decision we make prioritizes environmental impact and long-term ecological health.</p>
            </div>
            <div className="value-card fade-in">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Community Driven</h3>
              <p>We believe in the power of collective action and building strong local recycling networks.</p>
            </div>
            <div className="value-card fade-in">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <h3>Fair Rewards</h3>
              <p>We ensure collectors and recyclers receive fair compensation for their environmental contributions.</p>
            </div>
            <div className="value-card fade-in">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>
              <h3>Transparency</h3>
              <p>Track every item from collection to processing with complete visibility into the recycling journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2 className="fade-in">Join Our Movement</h2>
          <p className="fade-in">
            Whether you're a collector looking to earn, a recycler seeking reliable supply, 
            or a business wanting to improve your sustainability practices, Collect & Earn 
            has a place for you in our growing community.
          </p>
          <div className="cta-buttons fade-in">
            <a href="/booking.html" className="btn btn-primary">Start Collecting</a>
            <a href="/contact.html" className="btn btn-outline">Contact Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}