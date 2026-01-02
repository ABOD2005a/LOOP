import { Leaf, Recycle, TrendingUp, Sparkles } from "lucide-react";
import recyclingHero from "@/assets/recycling-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl mb-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={recyclingHero}
          alt="Eco-friendly recycling"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-12 md:py-16 md:px-12">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Earn money by recycling</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4 leading-tight animate-slide-up">
            Turn Your Recyclables
            <br />
            <span className="text-primary-foreground/90">Into Cash</span>
          </h2>

          {/* Subtitle */}
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-md animate-slide-up" style={{ animationDelay: "100ms" }}>
            Schedule a free pickup and get paid instantly. Help save the planet while earning money.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="bg-primary-foreground/15 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Recycle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-primary-foreground">500+</div>
              <div className="text-xs text-primary-foreground/80">Tons Recycled</div>
            </div>
            <div className="bg-primary-foreground/15 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-primary-foreground">2K+</div>
              <div className="text-xs text-primary-foreground/80">Trees Saved</div>
            </div>
            <div className="bg-primary-foreground/15 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-primary-foreground">50K+</div>
              <div className="text-xs text-primary-foreground/80">EGP Paid</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl animate-pulse-soft" />
      <div className="absolute bottom-10 right-20 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: "500ms" }} />
    </section>
  );
};

export default HeroSection;
