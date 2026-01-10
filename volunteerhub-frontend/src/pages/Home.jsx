import HomeNavbar from "../components/common/HomeNavbar";
import Footer from "../components/common/Footer";

import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorks from "../components/home/HowItWorks";
import CTASection from "../components/home/CTASection";

const Home = () => {
  return (
    <>
      <HomeNavbar />

      {/* spacing because navbar is fixed */}
      <div className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
      </div>

      <Footer />
    </>
  );
};

export default Home;
