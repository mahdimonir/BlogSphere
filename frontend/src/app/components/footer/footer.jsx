import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-500 mb-4">
              BlogSphere
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              BlogSphere is your personal space to share stories, ideas, and
              experiences. Join our community to explore diverse posts and
              connect with others.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-6">
            {/* Social Media & Contact */}
            <div>
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Connect With Us
              </h3>
              <div className="flex space-x-4 mb-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Email:{" "}
                <a
                  href="mailto:support@blogsphere.com"
                  className="hover:text-blue-500 dark:hover:text-blue-400"
                >
                  support@blogsphere.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} BlogSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
