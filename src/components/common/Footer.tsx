import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", to: "/features" },
        { name: "How it works", to: "/how-it-works" },
        { name: "Documentation", to: "/docs" },
        { name: "Roadmap", to: "/roadmap" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", to: "/about" },
        { name: "News", to: "/news" },
        { name: "Team", to: "/team" },
        { name: "Contact", to: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Support", to: "/support" },
        { name: "Privacy Policy", to: "/privacy" },
        { name: "Terms of Service", to: "/terms" },
        { name: "FAQ", to: "/faq" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/MohdAqdasAsim/Kryva",
      icon: Github,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/kryva",
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/kryva",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:contact@kryva.com",
      icon: Mail,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <footer className="border-t border-white/20 backdrop-blur-md">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand section */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img src="/logo.svg" alt="Kryva logo" className="h-10 w-10" />
              <span className="font-plus-jakarta font-bold text-2xl text-[--color-text-primary] group-hover:text-[--color-accent-primary] transition-colors duration-200">
                Kryva
              </span>
            </Link>
            <p className="text-sm text-[--color-text-secondary] leading-relaxed mb-6 max-w-xs">
              Empowering first-semester students with consequence-aware skill
              gap analysis for academic success.
            </p>
            <div className="flex items-center gap-1 text-xs text-[--color-text-tertiary]">
              <span>Built by</span>
              <span className="font-semibold text-[--color-accent-primary]">
                Team Pixel
              </span>
              <span>for AMUHACKS 5.0</span>
            </div>
          </motion.div>

          {/* Links sections */}
          {footerSections.map((section) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="md:col-span-2 md:col-start-auto"
            >
              <h3 className="font-inter font-semibold mb-4 text-[--color-text-primary]">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-sm text-[--color-text-secondary] hover:text-[--color-accent-primary] transition-colors duration-200 inline-block hover:translate-x-1 transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Social section */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <h3 className="font-inter font-semibold mb-4 text-[--color-text-primary]">
              Connect
            </h3>
            <div className="flex flex-col gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-sm text-[--color-text-secondary] hover:text-[--color-accent-primary] transition-colors duration-200"
                >
                  <social.icon size={16} />
                  <span>{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={itemVariants}
          className="pt-4 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Kryva. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-xs text-white/70 hover:text-[#588FE7] font-inter font-semibold transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-white/70 hover:text-[#588FE7] font-inter font-semibold transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
