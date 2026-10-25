import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import {
    Search, Filter, Star, MapPin, Clock, Phone,
    ChevronDown, Grid, List, X, SlidersHorizontal,
    Utensils, Wifi, Car, Wind, Calendar, ArrowUpDown,
    ChevronLeft, ChevronRight, Heart, ExternalLink
} from 'lucide-react';
import { getRestaurants } from '../services/restaurantService';
import '../styles/ListeRestaurants.css';

export default function ListeRestaurants() {
    const navigate = useNavigate();
    const location = useLocation();

    // États principaux
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Récupérer la catégorie et la couleur depuis la navigation
    const selectedCategory = location.state?.category || null;
    const categoryColor = location.state?.categoryColor || "#D64545";

    // États de recherche et filtres
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVille, setSelectedVille] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [selectedPrix, setSelectedPrix] = useState('');
    const [selectedNote, setSelectedNote] = useState('');
    const [servicesFilters, setServicesFilters] = useState({
        parking: false,
        wifi: false,
        terrasse: false,
        livraison: false,
        climatisation: false
    });

    // États UI
    const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('pertinence');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

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

    const activeTheme = themeColors[selectedCategory] || "#D64545";

    const mapCuisineType = (typeCuisine) => {
        if (!typeCuisine) return 'Restaurant';

        const type = typeCuisine.toLowerCase();

        // Mapping des différents types vers les catégories standardisées
        if (type.includes('marocain') || type.includes('marocaine')) return 'Marocain';
        if (type.includes('italien') || type.includes('italienne')) return 'Italien';
        if (type.includes('français') || type.includes('francais')) return 'Francais';
        if (type.includes('asiatique') || type.includes('chinois')) return 'Asiatique';
        if (type.includes('café') || type.includes('cafe')) return 'Cafe';
        if (type.includes('jus') || type.includes('juice')) return 'Magasin de Jus';
        if (type.includes('pâtisserie') || type.includes('patisserie')) return 'Patisserie';
        if (type.includes('petit') || type.includes('dejeuner')) return 'Petit Dejeuner';
        if (type.includes('fast') || type.includes('burger')) return 'Fast Food';
        if (type.includes('pizza')) return 'Pizza';
        if (type.includes('sushi') || type.includes('japonais')) return 'Sushi';

        return 'Restaurant'; // Par défaut
    };


    // Données de filtres (à remplacer par vos vraies données)
    const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'];
    const cuisines = [
        'Restaurant',
        'Cafe',
        'Magasin de Jus',
        'Patisserie',
        'Petit Dejeuner',
        'Fast Food',
        'Pizza',
        'Sushi',
        'Marocain',
        'Italien',
        'Francais',
        'Asiatique'
    ];
    const prixRanges = [
        { label: '€ - Économique', value: 'economique', min: 0, max: 100 },
        { label: '€€ - Moyen', value: 'moyen', min: 100, max: 250 },
        { label: '€€€ - Élevé', value: 'eleve', min: 250, max: 500 },
        { label: '€€€€ - Luxe', value: 'luxe', min: 500, max: 9999 }
    ];

    // Simulation de chargement des données
    // Simulation de chargement des données
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                const data = await getRestaurants();

                // Normaliser les données pour correspondre au format attendu
                const normalizedData = data.map(r => ({
                    ...r,
                    typeCuisine: mapCuisineType(r.typeCuisine),
                    horaires: r.horaires ? JSON.parse(r.horaires) : {
                        ouvert: true,
                        horaire: '12:00 - 23:00'
                    }
                }));

                setRestaurants(normalizedData);
                setFilteredRestaurants(normalizedData);
            } catch (error) {
                console.error('Erreur lors du chargement des restaurants:', error);
                // En cas d'erreur, utiliser les données fictives
                const mockRestaurants = generateMockRestaurants();
                setRestaurants(mockRestaurants);
                setFilteredRestaurants(mockRestaurants);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Fonction pour générer des restaurants fictifs
    const generateMockRestaurants = () => {
        const noms = [
            'Le Jardin Secret', 'Casa Délice', 'La Table du Marché', 'Chez Fouad',
            'Le Riad Bleu', 'Restaurant Alhambra', 'La Perle d\'Orient', 'Le Petit Zinc',
            'Dar Zellij', 'Le Foundouk', 'Nomad', 'Al Fassia', 'Le Tanjia',
            'Café Clock', 'Le Comptoir Darna', 'La Maison Arabe', 'Le Tobsil',
            'Restaurant Ruined Garden', 'Café des Épices', 'Le Jardin'
        ];

        const mock = [];
        for (let i = 0; i < 48; i++) {
            mock.push({
                id: i + 1,
                nom: noms[i % noms.length] + (i >= noms.length ? ` ${Math.floor(i / noms.length) + 1}` : ''),
                slug: `restaurant-${i + 1}`,
                ville: villes[Math.floor(Math.random() * villes.length)],
                quartier: ['Maarif', 'Gauthier', 'Ain Diab', 'Anfa', 'Belvédère'][Math.floor(Math.random() * 5)],
                adresse: `${Math.floor(Math.random() * 200) + 1} Avenue Mohammed V`,
                typeCuisine: cuisines[Math.floor(Math.random() * cuisines.length)],
                prixMoyen: Math.floor(Math.random() * 400) + 50,
                noteMoyenne: (Math.random() * 2 + 3).toFixed(1),
                nombreAvis: Math.floor(Math.random() * 500) + 10,
                description: 'Un restaurant exceptionnel offrant une cuisine authentique dans un cadre élégant et chaleureux.',
                imagePrincipale: `https://images.unsplash.com/photo-${['1414235077428-338989a2e8c0', '1517248135467-4c7edcad34c4', '1555396273-367ea4eb4db5', '1552566626-52f8b828c2ab'][Math.floor(Math.random() * 4)]}?w=800&q=80`,
                telephone: '+212 5XX-XXXXXX',
                parking: Math.random() > 0.5,
                wifi: Math.random() > 0.3,
                terrasse: Math.random() > 0.6,
                livraison: Math.random() > 0.4,
                climatisation: Math.random() > 0.4,
                reservationEnLigne: Math.random() > 0.2,
                horaires: {
                    ouvert: Math.random() > 0.3,
                    horaire: '12:00 - 23:00'
                },
                specialites: ['Tajine', 'Couscous', 'Pastilla'][Math.floor(Math.random() * 3)]
            });
        }
        return mock;
    };

    // Fonction de filtrage
    useEffect(() => {
        let filtered = [...restaurants];

        if (selectedCategory) {
            filtered = filtered.filter(r =>
                r.typeCuisine === selectedCategory
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(r =>
                r.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.typeCuisine.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedVille) {
            filtered = filtered.filter(r => r.ville === selectedVille);
        }

        if (selectedCuisine) {
            filtered = filtered.filter(r => r.typeCuisine === selectedCuisine);
        }

        if (selectedPrix) {
            const range = prixRanges.find(p => p.value === selectedPrix);
            if (range) {
                filtered = filtered.filter(r => r.prixMoyen >= range.min && r.prixMoyen < range.max);
            }
        }

        if (selectedNote) {
            filtered = filtered.filter(r => parseFloat(r.noteMoyenne) >= parseFloat(selectedNote));
        }

        if (servicesFilters.parking) filtered = filtered.filter(r => r.parking);
        if (servicesFilters.wifi) filtered = filtered.filter(r => r.wifi);
        if (servicesFilters.terrasse) filtered = filtered.filter(r => r.terrasse);
        if (servicesFilters.livraison) filtered = filtered.filter(r => r.livraison);
        if (servicesFilters.climatisation) filtered = filtered.filter(r => r.climatisation);

        switch (sortBy) {
            case 'note':
                filtered.sort((a, b) => parseFloat(b.noteMoyenne) - parseFloat(a.noteMoyenne));
                break;
            case 'prix-asc':
                filtered.sort((a, b) => a.prixMoyen - b.prixMoyen);
                break;
            case 'prix-desc':
                filtered.sort((a, b) => b.prixMoyen - a.prixMoyen);
                break;
            case 'avis':
                filtered.sort((a, b) => b.nombreAvis - a.nombreAvis);
                break;
            default:
                break;
        }

        setFilteredRestaurants(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedVille, selectedCuisine, selectedPrix, selectedNote, servicesFilters, sortBy, restaurants, selectedCategory]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRestaurants = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedVille('');
        setSelectedCuisine('');
        setSelectedPrix('');
        setSelectedNote('');
        setServicesFilters({
            parking: false,
            wifi: false,
            terrasse: false,
            livraison: false,
            climatisation: false
        });
        setSortBy('pertinence');
    };

    // Compter les filtres actifs
    const activeFiltersCount = () => {
        let count = 0;
        if (selectedVille) count++;
        if (selectedCuisine) count++;
        if (selectedPrix) count++;
        if (selectedNote) count++;
        count += Object.values(servicesFilters).filter(Boolean).length;
        return count;
    };

    return (
        <div className="liste-restaurants-container" style={{
            "--color-primary": categoryColor,
            "--color-primary-dark": categoryColor,
            "--color-primary-light": categoryColor + "99"
        }}>
            {selectedCategory && (
                <div className="category-filter-badge" >
                    <span>Filtré par : {selectedCategory}</span>
                    <button
                        onClick={() => {
                            navigate('/restaurants');
                        }}
                        className="clear-category-btn"
                    >
                        ✕
                    </button>
                </div>
            )}

            <nav className="navbar">
                <div className="nav-content">
                    <div className="nav-wrapper">
                        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <span className="logo-text">
                                Food<span className="logo-highlight">Vista</span>
                            </span>
                        </div>

                        <div className="nav-menu-desktop">
                            <a onClick={() => navigate('/')} className="nav-link">Accueil</a>
                            <a onClick={() => navigate('/restaurants')} className="nav-link">Restaurants</a>
                            <a href="#comment" className="nav-link">Comment ça marche</a>
                            <a href="#contact" className="nav-link">Contact</a>
                        </div>

                        <div className="nav-buttons-desktop">
                            <button className="btn btn-primary">Devenir Partenaire</button>
                            <button className="btn btn-secondary" onClick={() => navigate('/auth')}>Connexion</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="search-header">
                <div className="search-header-content">
                    <h1 className="page-title">Découvrez nos Restaurants</h1>
                    <p className="page-subtitle">
                        {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? 's' : ''} disponible{filteredRestaurants.length > 1 ? 's' : ''}
                    </p>

                    <div className="main-search-bar">
                        <div className="search-input-group">
                            <Search className="search-icon-input" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher un restaurant, une ville, un type de cuisine..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input-main"
                            />
                            {searchQuery && (
                                <button
                                    className="clear-search-btn"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <button
                            className="filters-toggle-btn"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={20} />
                            Filtres
                            {activeFiltersCount() > 0 && (
                                <span className="filters-badge">{activeFiltersCount()}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="filters-section">
                    <div className="filters-container">
                        <div className="filters-header">
                            <h3 className="filters-title">
                                <Filter size={20} />
                                Filtres avancés
                            </h3>
                            {activeFiltersCount() > 0 && (
                                <button className="reset-filters-btn" onClick={resetFilters}>
                                    <X size={16} />
                                    Réinitialiser
                                </button>
                            )}
                        </div>

                        <div className="filters-grid">
                            <div className="filter-group">
                                <label className="filter-label">
                                    <MapPin size={16} />
                                    Ville
                                </label>
                                <select
                                    value={selectedVille}
                                    onChange={(e) => setSelectedVille(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Toutes les villes</option>
                                    {villes.map(ville => (
                                        <option key={ville} value={ville}>{ville}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">
                                    <Utensils size={16} />
                                    Type de Cuisine
                                </label>
                                <select
                                    value={selectedCuisine}
                                    onChange={(e) => setSelectedCuisine(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Tous les types</option>
                                    {cuisines.map(cuisine => (
                                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">
                                    <span>💰</span>
                                    Gamme de Prix
                                </label>
                                <select
                                    value={selectedPrix}
                                    onChange={(e) => setSelectedPrix(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Tous les prix</option>
                                    {prixRanges.map(range => (
                                        <option key={range.value} value={range.value}>{range.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">
                                    <Star size={16} />
                                    Note Minimum
                                </label>
                                <select
                                    value={selectedNote}
                                    onChange={(e) => setSelectedNote(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">Toutes les notes</option>
                                    <option value="4">4+ étoiles</option>
                                    <option value="3.5">3.5+ étoiles</option>
                                    <option value="3">3+ étoiles</option>
                                </select>
                            </div>
                        </div>

                        <div className="services-filters">
                            <label className="filter-label">Services disponibles</label>
                            <div className="services-checkboxes">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={servicesFilters.parking}
                                        onChange={(e) => setServicesFilters({ ...servicesFilters, parking: e.target.checked })}
                                    />
                                    <Car size={16} />
                                    Parking
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={servicesFilters.wifi}
                                        onChange={(e) => setServicesFilters({ ...servicesFilters, wifi: e.target.checked })}
                                    />
                                    <Wifi size={16} />
                                    WiFi
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={servicesFilters.terrasse}
                                        onChange={(e) => setServicesFilters({ ...servicesFilters, terrasse: e.target.checked })}
                                    />
                                    <Utensils size={16} />
                                    Terrasse
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={servicesFilters.livraison}
                                        onChange={(e) => setServicesFilters({ ...servicesFilters, livraison: e.target.checked })}
                                    />
                                    <span>🚚</span>
                                    Livraison
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={servicesFilters.climatisation}
                                        onChange={(e) => setServicesFilters({ ...servicesFilters, climatisation: e.target.checked })}
                                    />
                                    <Wind size={16} />
                                    Climatisation
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="toolbar">
                <div className="toolbar-content">
                    <div className="sort-controls">
                        <label className="sort-label">
                            <ArrowUpDown size={16} />
                            Trier par:
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="pertinence">Pertinence</option>
                            <option value="note">Note (élevée à faible)</option>
                            <option value="avis">Nombre d'avis</option>
                            <option value="prix-asc">Prix (croissant)</option>
                            <option value="prix-desc">Prix (décroissant)</option>
                        </select>
                    </div>

                    <div className="view-controls">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Vue grille"
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="Vue liste"
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="results-section">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Chargement des restaurants...</p>
                    </div>
                ) : filteredRestaurants.length === 0 ? (
                    <div className="no-results">
                        <Search size={64} className="no-results-icon" />
                        <h3>Aucun restaurant trouvé</h3>
                        <p>Essayez de modifier vos critères de recherche</p>
                        <button className="btn btn-primary" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={`restaurants-${viewMode}`}>
                            {currentRestaurants.map(restaurant => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="pagination-numbers">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="pagination-dots">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Composant Carte Restaurant
function RestaurantCard({ restaurant, viewMode }) {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    const getPrixSymbol = (prix) => {
        if (prix < 100) return '€';
        if (prix < 250) return '€€';
        if (prix < 500) return '€€€';
        return '€€€€';
    };

    const handleCardClick = () => {
        navigate(`/restaurants/${restaurant.slug}`, {
            state: { restaurant }
        });
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    const handleButtonClick = (e) => {
        e.stopPropagation();
        navigate(`/restaurants/${restaurant.slug}`, {
            state: { restaurant }
        });
    };

    if (viewMode === 'list') {
        return (
            <div
                className="restaurant-card-list"
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
            >
                <div className="restaurant-image-container-list">
                    <img src={restaurant.imagePrincipale} alt={restaurant.nom} />
                    <button
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={handleFavoriteClick}
                    >
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                </div>

                <div className="restaurant-info-list">
                    <div className="restaurant-header-list">
                        <div>
                            <h3 className="restaurant-name">{restaurant.nom}</h3>
                            <div className="restaurant-meta">
                                <span className="restaurant-cuisine">{restaurant.typeCuisine}</span>
                                <span className="separator">•</span>
                                <span className="restaurant-prix">{getPrixSymbol(restaurant.prixMoyen)}</span>
                                <span className="separator">•</span>
                                <span className="restaurant-location">
                                    <MapPin size={14} />
                                    {restaurant.ville}, {restaurant.quartier}
                                </span>
                            </div>
                        </div>

                        <div className="restaurant-rating-large">
                            <Star size={20} fill="#FFD700" stroke="#FFD700" />
                            <span className="rating-number">{restaurant.noteMoyenne}</span>
                            <span className="rating-reviews">({restaurant.nombreAvis} avis)</span>
                        </div>
                    </div>

                    <p className="restaurant-description">{restaurant.description}</p>

                    <div className="restaurant-services">
                        {restaurant.parking && (
                            <span className="service-badge">
                                <Car size={14} /> Parking
                            </span>
                        )}
                        {restaurant.wifi && (
                            <span className="service-badge">
                                <Wifi size={14} /> WiFi
                            </span>
                        )}
                        {restaurant.terrasse && (
                            <span className="service-badge">
                                <Utensils size={14} /> Terrasse
                            </span>
                        )}
                        {restaurant.livraison && (
                            <span className="service-badge">
                                🚚 Livraison
                            </span>
                        )}
                    </div>

                    <div className="restaurant-actions-list">
                        <button className="btn btn-primary" onClick={handleButtonClick}>
                            <Calendar size={16} />
                            Réserver
                        </button>
                        <button className="btn btn-outline" onClick={handleButtonClick}>
                            <ExternalLink size={16} />
                            Voir Détails
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="restaurant-card-grid"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="restaurant-image-container">
                <img src={restaurant.imagePrincipale} alt={restaurant.nom} />
                <button
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                {restaurant.horaires.ouvert ? (
                    <span className="status-badge open">Ouvert</span>
                ) : (
                    <span className="status-badge closed">Fermé</span>
                )}
            </div>

            <div className="restaurant-content">
                <div className="restaurant-header">
                    <h3 className="restaurant-name">{restaurant.nom}</h3>
                    <div className="restaurant-rating">
                        <Star size={16} fill="#FFD700" stroke="#FFD700" />
                        <span>{restaurant.noteMoyenne}</span>
                    </div>
                </div>

                <div className="restaurant-details">
                    <span className="restaurant-cuisine">{restaurant.typeCuisine}</span>
                    <span className="separator">•</span>
                    <span className="restaurant-prix">{getPrixSymbol(restaurant.prixMoyen)}</span>
                </div>

                <div className="restaurant-location">
                    <MapPin size={14} />
                    <span>{restaurant.ville}, {restaurant.quartier}</span>
                </div>

                <div className="restaurant-reviews">
                    {restaurant.nombreAvis} avis
                </div>

                <div className="restaurant-services-compact">
                    {restaurant.parking && <Car size={14} />}
                    {restaurant.wifi && <Wifi size={14} />}
                    {restaurant.terrasse && <Utensils size={14} />}
                    {restaurant.climatisation && <Wind size={14} />}
                </div>

                <button className="btn btn-primary btn-block" onClick={handleButtonClick}>
                    Réserver une table
                </button>
            </div>
        </div>
    );
}
