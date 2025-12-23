import React, { useEffect, useRef, useState } from "react";
import "./About.css";
import NavbarAfter from "../../Header_Footer/NavbarAfter/page";
import Navbar from "../../Header_Footer/Navbar/page";
import amrImage from '../../../assets/amr.png';
import yousefImage from '../../../assets/yousef.png';
import ramadanImage from '../../../assets/ramadan.png';
import yousryImage from '../../../assets/yousry.png';
import wasifyImage from '../../../assets/wasify.png';

export default function About() {
  const observerRef = useRef(null);
  const statsObserverRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Team members data
  const teamMembers = [
    { 
     name: "Amr Mohamed", role: "CEO & Founder", initial: "AM",
      image: amrImage
    },
    { 
      name: "Abdallah Elwasify", role: "Operations Director", initial: "AE",
      image:wasifyImage
    },
    { 
     name: "Abdallah Ramadan", role: "Tech Lead", initial: "AR",
      image: ramadanImage
    },
    { 
     name: "Ahmed Yousry", role: "Community Manager", initial: "AY" ,
      image: yousryImage
    },
    { 
      name: "Mohamed Youssef", 
      role: "Marketing Director", 
      initial: "MY",
      image:yousefImage
    }
  ];

  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");
      const isAuth = localStorage.getItem("isLoggedIn") === "true";
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const sessionToken = sessionStorage.getItem("authToken");

      const loggedIn = !!(authToken || userData || isAuth || token || user || sessionToken);
      setIsLoggedIn(loggedIn);
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, 100);
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in, .scale-in").forEach((el) => {
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
          displayValue = (current / 1000000).toFixed(1).replace(".0", "");
        } else if (target >= 1000) {
          displayValue = (current / 1000).toFixed(0);
        } else {
          displayValue = Math.floor(current);
        }

        element.textContent = displayValue + suffix;
      }, 16);
    };

    statsObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const valueElement = card.querySelector(".stat-value");
            const target = parseInt(card.getAttribute("data-target"));
            const suffix = valueElement.getAttribute("data-suffix");

            animateCounter(valueElement, target, suffix);
            statsObserverRef.current?.unobserve(card);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".stat-card[data-target]").forEach((card) => {
      statsObserverRef.current?.observe(card);
    });

    return () => {
      observerRef.current?.disconnect();
      statsObserverRef.current?.disconnect();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <main>
      {isLoggedIn ? <NavbarAfter /> : <Navbar />}

      <section className="hero">
        <div className="container">
          <div className="badge fade-in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            <span>Our Story</span>
          </div>
          <h1 className="fade-in">
            Transforming Waste Into
            <br />
            <span className="text-primary">Opportunity</span>
          </h1>
          <p className="fade-in">
            Collect & Earn was founded with a simple mission: make recycling rewarding for everyone. 
            We connect collectors with recyclers, creating a sustainable ecosystem where environmental 
            responsibility meets economic opportunity.
          </p>
        </div>
      </section>

      <section className="mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content fade-in">
              <div className="badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
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
                Our platform empowers individuals to earn from their recycling efforts while contributing 
                to a cleaner planet. Every bottle collected, every can recycled, brings us closer to a 
                sustainable future.
              </p>
            </div>
            <div className="stats-grid">
              <div className="stat-card scale-in" data-target="50000">
                <div className="stat-value" data-suffix="K+">0</div>
                <div className="stat-label2">Active Collectors</div>
              </div>
              <div className="stat-card scale-in" data-target="2000000">
                <div className="stat-value" data-suffix="M+">0</div>
                <div className="stat-label2">Items Recycled</div>
              </div>
              <div className="stat-card scale-in" data-target="500">
                <div className="stat-value" data-suffix="+">0</div>
                <div className="stat-label2">Partner Facilities</div>
              </div>
              <div className="stat-card scale-in" data-target="100">
                <div className="stat-value" data-suffix="+">0</div>
                <div className="stat-label2">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="egypt-stats">
        <div className="container">
          <div className="section-header fade-in">
            <div className="badge">
              <span>🇪🇬 Egypt Waste Statistics</span>
            </div>
            <h2>Understanding Egypt's Waste Challenge</h2>
          </div>
          <div className="stats-content">
            <div className="stat-highlight fade-in">
              <div className="highlight-number">95M</div>
              <div className="highlight-text">tons of solid waste generated annually in Egypt</div>
            </div>
            <div className="stats-row">
              <div className="stat-item scale-in">
                <div className="stat-percentage">60%+</div>
                <p>of waste is recyclable (plastic, paper, metal, glass)</p>
              </div>
              <div className="stat-item scale-in">
                <div className="stat-percentage">&lt;20%</div>
                <p>of total waste is currently recycled</p>
              </div>
            </div>
            <p className="fade-in insight-text">
              This means millions of tons of valuable materials are lost every year instead of being reused.
            </p>
          </div>
        </div>
      </section>

      <section className="environmental-impact">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Environmental Impact</h2>
          </div>
          <div className="impact-grid">
            <div className="impact-card fade-in">
              <div className="impact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3>Unsorted Household Waste</h3>
              <p>Most household waste in Egypt is not sorted at the source, making recycling more difficult and less efficient.</p>
            </div>
            <div className="impact-card fade-in">
              <div className="impact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3>Informal Collection System</h3>
              <p>Waste collection still relies heavily on informal collectors without proper support or recognition.</p>
            </div>
            <div className="impact-card fade-in">
              <div className="impact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3>Lack of Incentives</h3>
              <p>Absence of rewards discourages citizens from actively participating in recycling efforts.</p>
            </div>
            <div className="impact-card fade-in">
              <div className="impact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Citizen Participation</h3>
              <p>Without citizen participation, effective recycling is impossible. We need everyone involved.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="recycling-industry">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Recycling Industry in Egypt</h2>
            <p>The untapped potential of Egypt's circular economy</p>
          </div>
          <div className="industry-stats">
            <div className="industry-card fade-in">
              <div className="industry-value">EGP 2B+</div>
              <p>Annual value of Egypt's recycling industry</p>
            </div>
            <div className="industry-card fade-in">
              <div className="industry-value">60%+</div>
              <p>Recycling activities driven by informal collectors</p>
            </div>
            <div className="industry-card fade-in">
              <div className="industry-value">2x</div>
              <p>Potential economic value increase with proper sorting</p>
            </div>
          </div>
        </div>
      </section>

      <section className="our-contribution">
        <div className="container">
          <div className="section-header fade-in">
            <div className="badge">
              <span>What We Provide to Egypt</span>
            </div>
            <h2>As Loop, We're Contributing To</h2>
          </div>
          <div className="contribution-grid">
            <div className="contribution-card fade-in">
              <div className="contribution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <h3>Increasing Recycling Rates</h3>
              <p>Making recycling accessible and rewarding for all Egyptians</p>
            </div>
            <div className="contribution-card fade-in">
              <div className="contribution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h3>Reducing Landfill Waste</h3>
              <p>Diverting valuable materials from landfills back into the economy</p>
            </div>
            <div className="contribution-card fade-in">
              <div className="contribution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Supporting Informal Sector</h3>
              <p>Empowering informal waste collectors with fair compensation and recognition</p>
            </div>
            <div className="contribution-card fade-in">
              <div className="contribution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3>Creating Green Jobs</h3>
              <p>Generating new employment opportunities in the sustainable economy</p>
            </div>
            <div className="contribution-card fade-in">
              <div className="contribution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>Supporting Vision 2030</h3>
              <p>Aligning with Egypt Vision 2030 environmental sustainability goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW TEAM SECTION */}
      <section className="team-section">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Meet Our Team</h2>
            <p>
              Passionate individuals dedicated to making recycling accessible and rewarding for everyone.
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member fade-in">
                <div className="team-avatar">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="avatar-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span className="avatar-initial" style={{ display: member.image ? 'none' : 'flex' }}>
                    {member.initial}
                  </span>
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Our Core Values</h2>
            <p>
              These principles guide everything we do, from product development to community partnerships.
            </p>
          </div>
          <div className="values-grid">
            <div className="value-card fade-in">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h3>Sustainability First</h3>
              <p>Every decision we make prioritizes environmental impact and long-term ecological health.</p>
            </div>
            <div className="value-card fade-in">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Community Driven</h3>
              <p>We believe in the power of collective action and building strong local recycling networks.</p>
            </div>
            <div className="value-card fade-in">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3>Fair Rewards</h3>
              <p>We ensure collectors and recyclers receive fair compensation for their environmental contributions.</p>
            </div>
            <div className="value-card fade-in">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <h3>Transparency</h3>
              <p>Track every item from collection to processing with complete visibility into the recycling journey.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2 className="fade-in">Join Our Movement</h2>
          <p className="fade-in">
            Whether you're a collector looking to earn, a recycler seeking reliable supply, or a business 
            wanting to improve your sustainability practices, Collect & Earn has a place for you in our 
            growing community.
          </p>
          <div className="cta-buttons fade-in">
            <a href="./choose" className="btn btn-primary">
              Start Collecting
            </a>
            <a href="./contact" className="btn btn-outline">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}