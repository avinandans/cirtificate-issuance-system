import { Link } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav container">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/course/create" className="nav-link">Create Course</Link>
        <Link to="/certificate/fill-details" className="nav-link">Create Certificate</Link>
      </nav>
    </header>
  );
};

export default Header;
