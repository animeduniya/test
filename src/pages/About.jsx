import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCode, faServer, faDatabase, faCloud, faSkull, faScroll, faBookDead } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';

const About = () => {
  const sectionRefs = useRef([]);
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    sectionRefs.current.forEach((section, i) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        delay: i * 0.2
      });
    });

    // Floating animation for the avatar
    gsap.to(".avatar-container", {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Blood drip effect on title
    const title = document.querySelector('.title-text');
    if (title) {
      const letters = title.textContent.split('');
      title.textContent = '';
      letters.forEach((letter, i) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        gsap.from(span, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.05,
          ease: "back.out"
        });
        title.appendChild(span);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated blood particles background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 80, density: { enable: true, value_area: 800 } },
              color: { value: "#ff0000" },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: true },
              size: { value: 3, random: true },
              line_linked: { enable: false },
              move: {
                enable: true,
                speed: 1,
                direction: "bottom",
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: { enable: false }
              }
            },
            interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "repulse" } } }
          }}
        />
      </div>

      {/* Animated parchment overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto p-6 md:p-10 space-y-16">
        {/* The Cursed Archive Section */}
        <section 
          ref={el => sectionRefs.current[0] = el}
          className="space-y-8 relative"
        >
          {/* Animated title with blood drip effect */}
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-red-600 to-red-400 title-text">
              The Cursed Archive
            </h1>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-900 to-transparent w-full"></div>
          </div>

          <p className="text-xl text-white/90 leading-relaxed font-serif tracking-wide">
            Welcome to SkyAnime, a forbidden repository of anime and manga knowledge. 
            This cursed archive was created to preserve and share the dark arts of Japanese animation 
            and storytelling with those brave enough to venture into its depths.
          </p>

          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 text-red-900/20 text-8xl">
            <FontAwesomeIcon icon={faSkull} />
          </div>
          <div className="absolute -bottom-10 -right-10 text-red-900/20 text-8xl">
            <FontAwesomeIcon icon={faBookDead} />
          </div>
        </section>

        {/* The Creator Section */}
        <section 
          ref={el => sectionRefs.current[1] = el}
          className="space-y-8 relative"
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-400">
            The Creator
          </h2>

          <div className="bg-gradient-to-br from-black via-gray-900 to-black p-8 rounded-xl border-l-4 border-red-900 shadow-2xl relative overflow-hidden">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-red-900/10 animate-pulse"></div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start relative z-10">
              <div className="avatar-container w-48 h-48 rounded-full overflow-hidden border-4 border-red-900/50 shadow-lg relative group">
                <img 
                  src="/creator.jpg" 
                  alt="SkyAnime Creator" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Hover effect */}
                <div className="absolute inset-0 bg-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="flex-1 space-y-6">
                <p className="text-lg text-white/90 leading-relaxed font-serif italic">
                  "A solitary developer who dared to create this repository of forbidden knowledge. 
                  Driven by a passion for anime and the dark arts of web development, this creator 
                  continues to expand the archive's collection and power."
                </p>
                
                <div className="flex gap-6 justify-center lg:justify-start">
                  {[
                    { icon: faGithub, url: "https://github.com/skyanime", color: "hover:text-red-400" },
                    { icon: faTwitter, url: "https://twitter.com/skyanime", color: "hover:text-blue-400" },
                    { icon: faDiscord, url: "https://discord.gg/skyanime", color: "hover:text-purple-400" }
                  ].map((item, index) => (
                    <a 
                      key={index}
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`text-white/70 ${item.color} transition-colors duration-300 transform hover:scale-125`}
                    >
                      <FontAwesomeIcon icon={item.icon} size="2x" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Arts & Technologies Section */}
        <section 
          ref={el => sectionRefs.current[2] = el}
          className="space-y-8"
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-400">
            Dark Arts & Technologies
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { 
                icon: faCode, 
                title: "Frontend Sorcery", 
                description: "React, TailwindCSS, and custom animations to create an immersive dark experience.",
                color: "from-red-900/50 to-black"
              },
              { 
                icon: faServer, 
                title: "Backend Magic", 
                description: "Node.js, Express, and various APIs to power the archive's dark capabilities.",
                color: "from-purple-900/50 to-black"
              },
              { 
                icon: faDatabase, 
                title: "Data Necromancy", 
                description: "MongoDB and Redis to store and retrieve the forbidden knowledge.",
                color: "from-blue-900/50 to-black"
              },
              { 
                icon: faCloud, 
                title: "Cloud Enchantments", 
                description: "AWS services and CDN integration for powerful content delivery.",
                color: "from-green-900/50 to-black"
              }
            ].map((tech, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${tech.color} p-6 rounded-xl border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="text-red-400 group-hover:text-white transition-colors duration-300">
                    <FontAwesomeIcon icon={tech.icon} className="text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors duration-300">
                    {tech.title}
                  </h3>
                </div>
                <p className="text-white/80 group-hover:text-white/90 transition-colors duration-300 relative z-10">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Return to Home Link */}
        <div 
          ref={el => sectionRefs.current[3] = el}
          className="text-center pt-12"
        >
          <Link 
            to="/" 
            className="inline-block px-8 py-3 bg-gradient-to-r from-red-900 to-black rounded-full border border-red-900/50 text-white/90 hover:text-white hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 group"
          >
            <span className="relative">
              <span className="block group-hover:translate-x-2 transition-transform duration-300">
                Return to the Archive
              </span>
              <span className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300">
                &larr;
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* Animated floating runes in the background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-red-900 text-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            <FontAwesomeIcon icon={faScroll} />
          </div>
        ))}
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default About;