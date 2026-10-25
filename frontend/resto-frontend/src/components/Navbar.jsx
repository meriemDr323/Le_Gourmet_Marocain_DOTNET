// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">FoodVista</div>
            <ul className="nav-links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/restaurants">Restaurants</Link></li>
                <li><Link to="/restaurants">Comment ca marche</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
