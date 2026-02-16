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
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 group"
            >
              <img
                src="/logo.svg"
                alt="Kryva logo"
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="font-plus-jakarta font-bold text-xl sm:text-2xl text-[--color-text-primary] group-hover:text-[--color-accent-primary] transition-colors duration-200">
                Kryva
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[--color-text-secondary] leading-relaxed mb-4 sm:mb-6 max-w-xs">
              Empowering first-semester students with consequence-aware skill
              gap analysis for academic success.
            </p>
            <div className="flex items-center gap-1 text-xs text-[--color-text-tertiary] flex-wrap">
              <span>Built by</span>
              <span className="font-semibold text-[--color-accent-primary]">
                Team Pixel
              </span>
              <span>for AMUHACKS 5.0</span>
            </div>
          </motion.div>

          <div className="flex flex-row gap-8 sm:gap-10 lg:contents">
            <motion.div
              variants={itemVariants}
              className="flex-1 lg:col-span-2"
            >
              <h3 className="font-inter font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-[--color-text-primary]">
                {footerSections[0].title}
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {footerSections[0].links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-xs sm:text-sm text-[--color-text-secondary] opacity-70 hover:opacity-100 hover:text-[--color-accent-primary] transition-all duration-200 inline-block hover:translate-x-1 transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex-1 lg:col-span-2"
            >
              <h3 className="font-inter font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-[--color-text-primary]">
                {footerSections[1].title}
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {footerSections[1].links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-xs sm:text-sm text-[--color-text-secondary] opacity-70 hover:opacity-100 hover:text-[--color-accent-primary] transition-all duration-200 inline-block hover:translate-x-1 transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="flex flex-row gap-8 sm:gap-10 lg:contents">
            <motion.div
              variants={itemVariants}
              className="flex-1 lg:col-span-2"
            >
              <h3 className="font-inter font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-[--color-text-primary]">
                {footerSections[2].title}
              </h3>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {footerSections[2].links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-xs sm:text-sm text-[--color-text-secondary] opacity-70 hover:opacity-100 hover:text-[--color-accent-primary] transition-all duration-200 inline-block hover:translate-x-1 transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex-1 lg:col-span-2"
            >
              <h3 className="font-inter font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-[--color-text-primary]">
                Connect
              </h3>
              <div className="flex flex-col gap-2 sm:gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-xs sm:text-sm text-[--color-text-secondary] opacity-70 hover:opacity-100 hover:text-[--color-accent-primary] transition-all duration-200"
                  >
                    <social.icon size={16} className="shrink-0" />
                    <span>{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="pt-4 sm:pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
        >
          <p className="text-xs sm:text-sm text-white/70 text-center sm:text-left">
            © {new Date().getFullYear()} Kryva. All rights reserved.
          </p>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <Link
              to="/privacy-policy"
              className="text-xs text-white/70 hover:text-[#588FE7] font-inter font-semibold transition-colors duration-200 whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-xs text-white/70 hover:text-[#588FE7] font-inter font-semibold transition-colors duration-200 whitespace-nowrap"
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
