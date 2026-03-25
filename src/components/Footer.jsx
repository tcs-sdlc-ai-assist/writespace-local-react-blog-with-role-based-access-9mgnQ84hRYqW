import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Branding */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              WriteSpace
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              A local blog platform with role-based access.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a
              href="#about"
              className="text-gray-500 hover:text-indigo-600 text-sm font-medium"
            >
              About
            </a>
            <a
              href="#privacy"
              className="text-gray-500 hover:text-indigo-600 text-sm font-medium"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="text-gray-500 hover:text-indigo-600 text-sm font-medium"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}