import { memo } from "react";
import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black pt-16 md:pt-20 pb-8 px-4 sm:px-6 md:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">

          {/* Brand */}
          <div>
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Hassan<span className="text-cyan-400">Editz</span>
            </span>

            <p className="text-gray-400 max-w-md mt-4 leading-relaxed text-sm md:text-base">
              Premium cinematic video editing crafted for creators, brands, and businesses who want luxury-level visual storytelling.
            </p>
          </div>

          {/* Social icons removed */}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} Hassan Shakeel. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm text-center md:text-right">
            Designed by <span className="text-cyan-400">Team DEVTIMIZE</span>
          </p>

          <a
            href="/blog/"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Read Blog
          </a>

        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);  