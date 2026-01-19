/**
 * Footer - Shared footer component
 */

import { Github, Twitter, MessageCircle } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/gr8',
    label: '오픈소스 코드',
  },
  {
    name: 'Discord',
    icon: MessageCircle,
    href: 'https://discord.gg/gr8',
    label: '커뮤니티',
  },
  {
    name: 'Twitter/X',
    icon: Twitter,
    href: 'https://twitter.com/gr8',
    label: 'Twitter',
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="text-2xl font-bold text-gray-100">gr8</div>

          {/* Social Links */}
          <div className="flex gap-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  aria-label={link.label}
                  className="text-gray-400 hover:text-gray-100 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={24} />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm">© 2026 gr8. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
