import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Search, Utensils, Coffee, Droplet, Cake, Sandwich, MapPin, Star, Users, Phone, Mail, Facebook, Instagram, Twitter, Zap, Pizza, Fish, ChevronLeft, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import '../styles/Accueil.css';

export default function Accueil() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const userMenuRef = useRef(null);

    const categories = [
        { icon: Utensils, name: 'Restaurant', color: 'restaurants', count: '250+' },
        { icon: Coffee, name: 'Cafe', color: 'cafes', count: '180+' },
        { icon: Droplet, name: 'Magasin de Jus', color: 'jus', count: '90+' },
        { icon: Cake, name: 'Patisserie', color: 'patisseries', count: '120+' },
        { icon: Sandwich, name: 'Petit Dejeuner', color: 'dejeuner', count: '150+' },
        { icon: Zap, name: 'Fast Food', color: 'fastfood', count: '200+' },
        { icon: Pizza, name: 'Pizza', color: 'pizza', count: '85+' },
        { icon: Fish, name: 'Sushi', color: 'sushi', count: '65+' },
        { icon: Star, name: 'Marocain', color: 'marocain', count: '140+' },
        { icon: Utensils, name: 'Italien', color: 'italien', count: '95+' },
        { icon: Utensils, name: 'Francais', color: 'francais', count: '75+' },
        { icon: Utensils, name: 'Asiatique', color: 'asiatique', count: '110+' }
    ];

    const steps = [
        {
            number: '1',
            title: 'Recherchez',
            description: 'Utilisez notre barre de recherche pour trouver des restaurants près de chez vous',
            icon: Search
        },
        {
            number: '2',
            title: 'Découvrez',
            description: 'Consultez les menus, photos et avis authentiques des restaurants',
            icon: Star
        },
        {
            number: '3',
            title: 'Profitez',
            description: 'Réservez votre table et vivez une expérience culinaire inoubliable',
            icon: Utensils
        }
    ];

    // Auto-scroll continu
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => prev + 1);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isPaused]);

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    // Fermer le menu utilisateur si on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getSlidesPerView = () => {
        if (typeof window === 'undefined') return 5;
        if (window.innerWidth >= 1024) return 5;
        if (window.innerWidth >= 768) return 3;
        return 1;
    };

    const nextSlide = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => prev - 1);
    };

    const getTranslateX = () => {
        const slidesPerView = getSlidesPerView();
        const slideWidth = 100 / slidesPerView;
        return -(currentIndex * slideWidth);
    };

    const handleSearch = () => {
        console.log('Recherche:', searchQuery);
        navigate('/restaurants', { state: { searchQuery } });
    };

    const handleCategoryClick = (categoryName) => {
        console.log('Catégorie sélectionnée:', categoryName);
        navigate('/restaurants', {
            state: {
                category: categoryName,
                categoryColor: themeColors[categoryName] || '#D64545'
            }
        });
    };

    const themeColors = {
        "Restaurant": "#D64545",
        "Cafe": "#A67B5B",
        "Magasin de Jus": "#FF8C42",
        "Patisserie": "#FF4D8D",
        "Petit Dejeuner": "#FFD93D",
        "Fast Food": "#E63946",
        "Pizza": "#FF5733",
        "Sushi": "#1E90FF",
        "Marocain": "#B8860B",
        "Italien": "#2ECC71",
        "Francais": "#2E4A7D",
        "Asiatique": "#8E44AD",
    };

    const handleLoginClick = () => {
        navigate('/auth');
    };

    const handleRestaurantsClick = () => {
        navigate('/restaurants');
    };

    const handleDiscoverClick = () => {
        navigate('/restaurants');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const handleProfileClick = () => {
        setIsUserMenuOpen(false);
        navigate('/profile');
    };

    const getInitials = (prenom) => {
        return prenom ? prenom.charAt(0).toUpperCase() : 'U';
    };

    const extendedCategories = [...categories, ...categories, ...categories];

    return (
        <div className="accueil-container">
            {/* Section Hero avec Background */}
            <div className="hero-section">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="nav-content">
                        <div className="nav-wrapper">
                            {/* Logo */}
                            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                                <span className="logo-text">
                                    Food<span className="logo-highlight">Vista</span>
                                </span>
                            </div>

                            {/* Menu Desktop */}
                            <div className="nav-menu-desktop">
                                <a href="#accueil" className="nav-link">Accueil</a>
                                <a onClick={handleRestaurantsClick} className="nav-link" style={{ cursor: 'pointer' }}>Restaurants</a>
                                <a href="#comment-ca-marche" className="nav-link">Comment ça marche</a>
                                <a href="#contact" className="nav-link">Contact</a>
                            </div>

                            {/* Boutons Desktop */}
                            <div className="nav-buttons-desktop">
                                <button className="btn btn-primary">Devenir Partenaire</button>
                                {user ? (
                                    <div className="user-menu-container" ref={userMenuRef}>
                                        <button
                                            className="btn-user-profile"
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        >
                                            <div className="user-avatar">
                                                {user.photo ? (
                                                    <img src={user.photo} alt={user.prenom} className="user-avatar-img" />
                                                ) : (
                                                    <span className="user-avatar-initial">{getInitials(user.prenom)}</span>
                                                )}
                                            </div>
                                            <span className="user-name">{user.prenom}</span>
                                        </button>

                                        {isUserMenuOpen && (
                                            <div className="user-dropdown-menu">
                                                <button className="dropdown-item" onClick={handleProfileClick}>
                                                    <UserIcon size={18} />
                                                    <span>Mon Profil</span>
                                                </button>
                                                <div className="dropdown-divider"></div>
                                                <button className="dropdown-item logout" onClick={handleLogout}>
                                                    <LogOut size={18} />
                                                    <span>Déconnexion</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button className="btn btn-secondary" onClick={handleLoginClick}>Connexion</button>
                                )}
                            </div>

                            {/* Menu Mobile Toggle */}
                            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>

                    {/* Menu Mobile Dropdown */}
                    {isMenuOpen && (
                        <div className="nav-menu-mobile">
                            <div className="nav-menu-mobile-content">
                                <a href="#accueil" className="nav-link-mobile">Accueil</a>
                                <a onClick={handleRestaurantsClick} className="nav-link-mobile" style={{ cursor: 'pointer' }}>Restaurants</a>
                                <a href="#comment-ca-marche" className="nav-link-mobile">Comment ça marche</a>
                                <a href="#contact" className="nav-link-mobile">Contact</a>
                                <button className="btn btn-primary btn-mobile">Devenir Partenaire</button>
                                {user ? (
                                    <>
                                        <button className="btn btn-secondary btn-mobile" onClick={handleProfileClick}>
                                            Mon Profil
                                        </button>
                                        <button className="btn btn-logout btn-mobile" onClick={handleLogout}>
                                            Déconnexion
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn-secondary btn-mobile" onClick={handleLoginClick}>Connexion</button>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Content */}
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Découvrez les meilleurs restaurants près de chez vous
                        </h1>
                        <p className="hero-description">
                            Bienvenue chez FoodVista, où chaque repas devient une expérience mémorable !
                            Que tu sois amateur de gastronomie ou simple gourmand, notre plateforme te
                            connecte aux meilleurs restaurants, cafés et pâtisseries de ta ville. Avec
                            des milliers d'avis authentiques, des photos alléchantes et des menus détaillés,
                            trouve l'endroit parfait pour chaque occasion. Rejoins-nous et transforme
                            chaque sortie en découverte culinaire !
                        </p>
                        <button className="btn btn-hero" onClick={handleDiscoverClick}>
                            Découvrir Maintenant !
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Catégories avec Slider Infini */}
            <section className="section-categories">
                <div className="container">
                    <h2 className="section-title">Nos Catégories</h2>
                    <p className="section-subtitle">
                        Explorez une variété de lieux pour tous vos besoins culinaires
                    </p>

                    <div
                        className="slider-container"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Bouton Précédent */}
                        <button className="slider-btn slider-btn-prev" onClick={prevSlide}>
                            <ChevronLeft size={30} />
                        </button>

                        {/* Slider */}
                        <div className="categories-slider">
                            <div
                                className="categories-track-infinite"
                                style={{
                                    transform: `translateX(${getTranslateX()}%)`,
                                    transition: 'transform 0.5s ease-in-out'
                                }}
                            >
                                {extendedCategories.map((category, index) => {
                                    const IconComponent = category.icon;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleCategoryClick(category.name)}
                                            className={`category-card category-${category.color}`}
                                        >
                                            <div className="category-content">
                                                <div className="category-icon-wrapper">
                                                    <IconComponent size={40} />
                                                </div>
                                                <h3 className="category-name">{category.name}</h3>
                                                <p className="category-count">{category.count} établissements</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bouton Suivant */}
                        <button className="slider-btn slider-btn-next" onClick={nextSlide}>
                            <ChevronRight size={30} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Section Recherche */}
            <section className="section-search">
                <div className="container-search">
                    <h2 className="search-title">
                        Que ce soit pour un brunch en famille, un dîner romantique ou une pause café entre amis,
                        trouve l'endroit parfait pour chaque moment
                    </h2>

                    <div className="search-wrapper">
                        <div className="search-bar-container">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={24} />
                                <input
                                    type="text"
                                    placeholder="Nom du restaurant, ville, type de cuisine..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="search-input"
                                />
                            </div>
                            <button onClick={handleSearch} className="btn btn-search">
                                Rechercher
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Comment ça marche */}
            <section id="comment-ca-marche" className="section-how-it-works">
                <div className="container">
                    <h2 className="section-title">Comment ça marche ?</h2>
                    <p className="section-subtitle">
                        Trois étapes simples pour découvrir votre prochain restaurant préféré
                    </p>

                    <div className="steps-grid">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <div key={index} className="step-card">
                                    <div className="step-icon-container">
                                        <div className="step-icon-circle">
                                            <IconComponent size={40} className="step-icon" />
                                        </div>
                                        <div className="step-number-badge">
                                            <span className="step-number">{step.number}</span>
                                        </div>
                                    </div>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="section-cta">
                        <button className="btn btn-cta" onClick={handleDiscoverClick}>
                            Commencer Maintenant
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        {/* Colonne 1 - À propos */}
                        <div className="footer-column">
                            <h3 className="footer-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                                Food<span className="footer-logo-highlight">Vista</span>
                            </h3>
                            <p className="footer-description">
                                Votre plateforme de découverte culinaire. Trouvez les meilleurs restaurants,
                                cafés et pâtisseries près de chez vous.
                            </p>
                        </div>

                        {/* Colonne 2 - Liens rapides */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Liens Rapides</h4>
                            <ul className="footer-links">
                                <li><a href="#accueil" className="footer-link">Accueil</a></li>
                                <li><a onClick={handleRestaurantsClick} className="footer-link" style={{ cursor: 'pointer' }}>Restaurants</a></li>
                                <li><a href="#comment-ca-marche" className="footer-link">Comment ça marche</a></li>
                                <li><a href="#contact" className="footer-link">Contact</a></li>
                            </ul>
                        </div>

                        {/* Colonne 3 - Pour les restaurants */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Pour les Restaurants</h4>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link">Devenir Partenaire</a></li>
                                <li><a href="#" className="footer-link">Espace Restaurant</a></li>
                                <li><a href="#" className="footer-link">Tarifs</a></li>
                                <li><a href="#" className="footer-link">Support</a></li>
                            </ul>
                        </div>

                        {/* Colonne 4 - Contact */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Contact</h4>
                            <ul className="footer-contact">
                                <li className="footer-contact-item">
                                    <Phone size={18} className="footer-icon" />
                                    +212 5XX-XXXXXX
                                </li>
                                <li className="footer-contact-item">
                                    <Mail size={18} className="footer-icon" />
                                    contact@foodvista.ma
                                </li>
                                <li className="footer-contact-item">
                                    <MapPin size={18} className="footer-icon" />
                                    Casablanca, Maroc
                                </li>
                            </ul>

                            {/* Réseaux sociaux */}
                            <div className="footer-social">
                                <a href="#" className="social-link">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="social-link">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="social-link">
                                    <Twitter size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Ligne de séparation */}
                    <div className="footer-bottom">
                        <div className="footer-bottom-content">
                            <p className="footer-copyright">
                                © 2025 FoodVista. Tous droits réservés.
                            </p>
                            <div className="footer-legal">
                                <a href="#" className="footer-legal-link">Politique de confidentialité</a>
                                <a href="#" className="footer-legal-link">Conditions d'utilisation</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}