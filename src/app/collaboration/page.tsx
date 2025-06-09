import CollaborationForm from '@/components/CollaborationForm';
import React from 'react';
import { Mail, Phone, MapPin, Handshake, Lightbulb, Code, TrendingUp, Users, BookOpen, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from 'next/link'; // Import Link for the map link

export default function CollaborationPage() {
  const address = "Gurugram, Haryana"; // Updated address
  const googleMapsSearchUrl = `https://www.google.com/maps/search/Juris.Ai+${encodeURIComponent(address)}`; // Search link using updated address
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`; // Directions link using updated address

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl professional-gradient flex items-center justify-center shadow-lg animate-bounce-gentle">
              <Users className="h-8 w-8 text-white dark:text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-high-contrast text-shadow mb-6">Contact & Collaboration</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connect with us to explore partnership opportunities and build the future of legal technology together
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Open for Partnerships</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Global Reach</span>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Get in Touch</h2>
          <p className="text-muted-foreground">
            We value your input and are here to assist you. Whether you have questions about our AI legal assistant, need technical support, want to provide feedback, or have general inquiries, please don&apos;t hesitate to contact us. Our team is ready to help you navigate your legal tech journey.
          </p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="h-5 w-5 text-primary" />
            <span>itisaddy7@gmail.com</span> {/* Updated email */}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="h-5 w-5 text-primary" />
            <span>+1 (123) 456-7890</span>
          </div>
          <div className="flex items-start gap-3 text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <span>
              {address} {/* Display updated address */}
            </span>
          </div>
        </div>

        {/* Collaboration Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Collaboration Opportunities</h2>
          <p className="text-muted-foreground">
            At Juris.Ai, we believe in the power of collaboration to drive innovation and create impactful solutions in the legal tech space. We are actively seeking partnerships with individuals and organizations who share our vision for a more accessible and efficient legal future. Let&apos;s build something great together.
          </p>
          <p className="text-muted-foreground">
            Interested in partnering with Juris.Ai? We are always looking for exciting collaboration opportunities with legal professionals, tech companies, and research institutions.
          </p>
          <p className="text-muted-foreground">
            Whether you have an idea for a joint venture, a research project, or want to integrate our AI capabilities, please use the form to tell us more about your proposal.
          </p>
          <p className="text-muted-foreground">
            We look forward to exploring how we can work together to advance the field of legal technology.
          </p>

          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-semibold">Types of Collaboration</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <Handshake className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Joint Ventures:</strong> Partner with us on new products, services, or market initiatives.</span>
              </li>
              <li className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Research & Development:</strong> Collaborate on cutting-edge research in AI and legal tech.</span>
              </li>
              <li className="flex items-start gap-3">
                <Code className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>API Integrations:</strong> Integrate Juris.Ai&apos;s capabilities into your existing platforms or services.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-semibold">Benefits of Collaborating with Juris.Ai</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Innovation:</strong> Access our advanced AI technology and expertise to drive innovation in your field.</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Expanded Reach:</strong> Tap into our user base and network within the legal and tech communities.</span>
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Mutual Growth:</strong> Achieve shared success through synergistic projects and knowledge exchange.</span>
              </li>
            </ul>
          </div>

          <p className="text-muted-foreground mt-6">
            Ready to collaborate? Fill out the form below with your details and proposal, and we will get back to you shortly. We are excited to hear from you and explore potential synergies!
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Send us a Message</h2>
        <CollaborationForm />
      </div>

      {/* Map Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Find Us</h2>
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
          {/* Google Maps embed for Gurugram */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224391.0406010351!2d76.83028184453125!3d28.423203500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2f27b0aa5395998d!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1716056710000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen={true}
            referrerPolicy="no-referrer-when-downgrade"
            aria-label="Map of Gurugram"
          ></iframe>
        </div>
        <p className="text-center text-muted-foreground mt-4">
          Visit our office in Gurugram, Haryana at: <strong>{address}</strong>
        </p>
        <div className="text-center mt-2 space-x-4">
          <Link
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View on Google Maps
          </Link>
          <span className="text-muted-foreground">|</span>
           <Link
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Get Directions
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger><HelpCircle className="h-5 w-5 text-primary mr-2" /> What is Juris.Ai?</AccordionTrigger>
            <AccordionContent>
              Juris.Ai is an AI-powered legal assistant platform that provides comprehensive legal advice, case studies, and win probability estimations by leveraging multiple AI models.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger><HelpCircle className="h-5 w-5 text-primary mr-2" /> What AI models does Juris.Ai use?</AccordionTrigger>
            <AccordionContent>
              Juris.Ai compares legal advice from multiple AI models, including GPT-4, Claude, Gemini, and Mistral.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger><HelpCircle className="h-5 w-5 text-primary mr-2" /> Is the advice provided by Juris.Ai a substitute for professional legal advice?</AccordionTrigger>
            <AccordionContent>
              No, the information provided by Juris.Ai is not a substitute for professional legal advice. Always consult with a qualified attorney for your specific legal needs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger><HelpCircle className="h-5 w-5 text-primary mr-2" /> How can I collaborate with Juris.Ai?</AccordionTrigger>
            <AccordionContent>
              We are open to various collaboration opportunities, including joint ventures, research and development projects, and API integrations. Please use the contact form above to submit your proposal.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      </div>
    </div>
  );
};

