import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Резюме", href: "/cv" },
  { name: "Дашборд", href: "/dashboard" },
  { name: "Вимоги", href: "/hrrequirements" },
];

export default function Header() {
    const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-white"
        >
          Candidate-Insight
        </motion.h1>

        <nav className="hidden md:flex gap-8 text-gray-300">
          {navLinks.map((link) => (
            <button
            key={link.name}
            onClick={() => navigate(link.href)}
            className="hover:text-white transition"
            >
            {link.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
