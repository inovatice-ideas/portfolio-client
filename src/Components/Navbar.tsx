import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import dp from '../assets/dp2.png';
import './Components.css';

const tabs = [
  { name: 'About Me', path: '/aboutme' },
  { name: 'Projects', path: '/projects' },
  { name: 'Experiences', path: '/experiences' },
  { name: 'Publications', path: '/publications' },
  { name: 'CV', path: '/resume' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact Me', path: '/contactme' },
];

interface NavbarProps {
  onLogoClick?: () => void;
}

function Navbar({ onLogoClick }: NavbarProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (location.pathname === '/') return null;
  return (
    <nav className='navbar-glass'>
      <div className='navbar-left'>
        <Link to='/'>
          <img src={dp} alt='Ritam Pradhan' className='navbar-icon' onClick={onLogoClick} />
        </Link>
      </div>
      {/* Hamburger for mobile/tablet */}
      <div className='navbar-hamburger' onClick={() => setMenuOpen(!menuOpen)}>
        <div className='hamburger-box'>
          <div className='hamburger-line'></div>
          <div className='hamburger-line'></div>
          <div className='hamburger-line'></div>
        </div>
      </div>
      {/* Full navbar for desktop */}
      <div className='navbar-right'>
        {tabs.map(tab => (
          <Link 
            key={tab.path} 
            to={tab.path} 
            className={`navbar-tab ${isActive(tab.path) ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      {/* Dropdown menu for mobile/tablet */}
      {menuOpen && (
        <div className='navbar-dropdown' ref={menuRef}>
          {tabs.map(tab => (
            <Link 
              key={tab.path} 
              to={tab.path} 
              className={`navbar-dropdown-tab ${isActive(tab.path) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar; 