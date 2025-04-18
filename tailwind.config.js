/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        "devilish-dark": "#1a1a1a",
        "devilish-darker": "#0f0f0f",
        "devilish-crimson": "#ff0033",
        "devilish-gold": "#ffd700",
        "devilish-purple": "#800080",
        "devilish-red": "#cc0000",
        "devilish-orange": "#ff6600",
        "devilish-pink": "#ff69b4",
        "devilish-blue": "#0066cc",
        "devilish-green": "#00cc66",
        "devilish-yellow": "#ffcc00",
        "devilish-gray": "#666666",
        "devilish-light": "#f5f5f5",
        "devilish-white": "#ffffff",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'text-flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter: 'drop-shadow(0 0 1px rgba(210, 4, 45, 0.8)) drop-shadow(0 0 5px rgba(210, 4, 45, 0.5))'
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none'
          }
        },
        'text-glow': {
          '0%, 100%': {
            textShadow: '0 0 10px rgba(255, 0, 51, 0.5), 0 0 20px rgba(255, 0, 51, 0.3), 0 0 30px rgba(255, 0, 51, 0.2)'
          },
          '50%': {
            textShadow: '0 0 20px rgba(255, 0, 51, 0.8), 0 0 30px rgba(255, 0, 51, 0.6), 0 0 40px rgba(255, 0, 51, 0.4)'
          }
        },
        'text-float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          }
        },
        'button-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 5px rgba(255, 0, 51, 0.5)'
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 15px rgba(255, 0, 51, 0.8)'
          }
        },
        'card-hover': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
          },
          '100%': {
            transform: 'translateY(-10px) scale(1.02)',
            boxShadow: '0 15px 30px rgba(255, 0, 51, 0.2)'
          }
        },
        'card-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(255, 0, 51, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 0, 51, 0.6)'
          }
        },
        'nav-hover': {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(5px)'
          }
        }
      },
      animation: {
        'text-glow': 'text-glow 2s infinite',
        'text-float': 'text-float 3s ease-in-out infinite',
        'button-pulse': 'button-pulse 2s infinite',
        'card-hover': 'card-hover 0.3s forwards',
        'card-glow': 'card-glow 2s infinite',
        'nav-hover': 'nav-hover 0.3s forwards'
      },
      backgroundImage: {
        "devilish-gradient": "linear-gradient(45deg, #ff0033, #800080, #ffd700)",
        "devilish-gradient-dark": "linear-gradient(45deg, #cc0000, #4d004d, #cc9900)",
        "crimson-gradient": "linear-gradient(90deg, #D2042D, #8A0303)",
        "purple-gradient": "linear-gradient(90deg, #8B5CF6, #D946EF)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
