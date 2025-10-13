import ContactHero from "./hero";
import ContactFormSection from "./FormSec"
import LocationsSection from "./LocationSec"
import FAQSection from "./Faqs"
const ContactPage = () => {
  return (
    <div>
      <ContactHero />
      <ContactFormSection />
      <LocationsSection />
      <FAQSection />
    </div>
  );
};

export default ContactPage;