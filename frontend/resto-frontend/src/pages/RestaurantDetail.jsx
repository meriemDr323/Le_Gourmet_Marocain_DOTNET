import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Clock, Star, Heart, Car, Wifi, Wind, Utensils, Calendar, Share2, ChevronLeft, Info, Users, Award, X, ThumbsUp, MessageSquare, Filter } from 'lucide-react';
import { createReservation } from '../services/reservationService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import '../styles/RestaurantDetail.css';

export default function RestaurantDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const restaurantFromState = location.state?.restaurant || null;

    const [restaurant, setRestaurant] = useState(restaurantFromState);
    const [loading, setLoading] = useState(!restaurantFromState);
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState('infos');

    // États pour la section avis
    const [activeFilter, setActiveFilter] = useState('recent');
    const [showAvisForm, setShowAvisForm] = useState(false);
    const [newAvis, setNewAvis] = useState({
        note: 5,
        titre: '',
        commentaire: '',
        noteNourriture: 5,
        noteService: 5,
        noteAmbiance: 5,
        noteRapportQualitePrix: 5
    });

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

    const activeTheme = restaurant ? (themeColors[restaurant.typeCuisine] || "#D64545") : "#D64545";

    const [showReservationModal, setShowReservationModal] = useState(false);
    const [reservationData, setReservationData] = useState({
        dateReservation: '',
        heureReservation: '',
        nombrePersonnes: 2,
        nomContact: '',
        telephoneContact: '',
        emailContact: '',
        commentaire: ''
    });

    // Données pour les avis (à remplacer par un appel API)
    const statistiques = {
        noteMoyenne: 4.7,
        totalAvis: 342,
        repartitionNotes: { 5: 220, 4: 85, 3: 25, 2: 8, 1: 4 },
        moyenneNourriture: 4.8,
        moyenneService: 4.6,
        moyenneAmbiance: 4.7,
        moyenneRapportQualitePrix: 4.5
    };

    const avisListe = [
        {
            id: 1,
            utilisateurPrenom: 'Mohammed',
            utilisateurNom: 'Alami',
            note: 5,
            titre: 'Excellente expérience culinaire',
            commentaire: 'J\'ai adoré ce restaurant! La cuisine marocaine est authentique et délicieuse. Le tajine d\'agneau aux pruneaux était exceptionnel.',
            noteNourriture: 5,
            noteService: 5,
            noteAmbiance: 4,
            noteRapportQualitePrix: 5,
            photos: [
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'
            ],
            createdAt: '2024-12-07'
        },
        {
            id: 2,
            utilisateurPrenom: 'Fatima',
            utilisateurNom: 'Benali',
            note: 4,
            titre: 'Très bon restaurant',
            commentaire: 'Bonne cuisine et cadre agréable. Le couscous était savoureux.',
            noteNourriture: 4,
            noteService: 5,
            noteAmbiance: 4,
            noteRapportQualitePrix: 4,
            photos: [],
            createdAt: '2024-12-03'
        }
    ];

    useEffect(() => {
        if (!restaurantFromState) {
            const fetchRestaurantDetails = async () => {
                try {
                    setLoading(true);
                    setRestaurant({
                        id: 1,
                        nom: "Le Jardin Secret",
                        slug,
                        description: "Un restaurant exceptionnel offrant une cuisine marocaine authentique dans un cadre élégant et raffiné.",
                        adresse: "123 Avenue Mohammed V",
                        ville: "Casablanca",
                        codePostal: "20000",
                        quartier: "Maarif",
                        telephone: "+212 522-123456",
                        email: "contact@jardinsecret.ma",
                        siteWeb: "www.jardinsecret.ma",
                        typeCuisine: "Marocain",
                        specialites: "Tajine d'agneau aux pruneaux, Couscous royal, Pastilla au poulet",
                        prixMoyen: 250,
                        noteMoyenne: 4.7,
                        nombreAvis: 342,
                        imagePrincipale: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
                        imageCouverture: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
                        horaires: {
                            lundi: { ouvert: true, heures: "12:00 - 15:00, 19:00 - 23:00" },
                            mardi: { ouvert: true, heures: "12:00 - 15:00, 19:00 - 23:00" },
                            mercredi: { ouvert: true, heures: "12:00 - 15:00, 19:00 - 23:00" },
                            jeudi: { ouvert: true, heures: "12:00 - 15:00, 19:00 - 23:00" },
                            vendredi: { ouvert: true, heures: "12:00 - 15:00, 19:00 - 23:30" },
                            samedi: { ouvert: true, heures: "12:00 - 15:00, 19:00 - 23:30" },
                            dimanche: { ouvert: true, heures: "12:00 - 15:00, 19:00 - 23:00" }
                        },
                        capacite: 80,
                        parking: true,
                        wifi: true,
                        terrasse: true,
                        climatisation: true,
                        reservationEnLigne: true,
                        livraison: true,
                        aEmporter: true
                    });
                    setLoading(false);
                } catch (error) {
                    console.error("Erreur lors du chargement:", error);
                    setLoading(false);
                }
            };
            fetchRestaurantDetails();
        } else {
            if (restaurantFromState.horaires && !restaurantFromState.horaires.lundi) {
                const horairesNormalises = {
                    lundi: { ouvert: restaurantFromState.horaires.ouvert, heures: restaurantFromState.horaires.horaire || "12:00 - 23:00" },
                    mardi: { ouvert: restaurantFromState.horaires.ouvert, heures: restaurantFromState.horaires.horaire || "12:00 - 23:00" },
                    mercredi: { ouvert: restaurantFromState.horaires.ouvert, heures: restaurantFromState.horaires.horaire || "12:00 - 23:00" },
                    jeudi: { ouvert: restaurantFromState.horaires.ouvert, heures: restaurantFromState.horaires.horaire || "12:00 - 23:00" },
                    vendredi: { ouvert: restaurantFromState.horaires.ouvert, heures: restaurantFromState.horaires.horaire || "12:00 - 23:00" },
                    samedi: { ouvert: restaurantFromState.horaires.ouvert, heures: restaurantFromState.horaires.horaire || "12:00 - 23:00" },
                    dimanche: { ouvert: restaurantFromState.horaires.ouvert, heures: restaurantFromState.horaires.horaire || "12:00 - 23:00" }
                };
                setRestaurant({ ...restaurantFromState, horaires: horairesNormalises });
            }
        }
    }, [slug, restaurantFromState]);

    const getPrixSymbol = (prix) => {
        if (prix < 100) return '€';
        if (prix < 250) return '€€';
        if (prix < 500) return '€€€';
        return '€€€€';
    };

    const getCurrentDay = () => {
        const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        return days[new Date().getDay()];
    };

    const handleOpenReservation = () => {
        setShowReservationModal(true);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseReservation = () => {
        setShowReservationModal(false);
        document.body.style.overflow = 'unset';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReservationData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitReservation = async (e) => {
        e.preventDefault();
        if (!reservationData.dateReservation || !reservationData.heureReservation || !reservationData.nomContact || !reservationData.telephoneContact || !reservationData.emailContact) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
        try {
            const response = await createReservation({
                restaurantId: restaurant.id,
                dateReservation: reservationData.dateReservation,
                heureReservation: reservationData.heureReservation,
                nombrePersonnes: reservationData.nombrePersonnes,
                nomContact: reservationData.nomContact,
                telephoneContact: reservationData.telephoneContact,
                emailContact: reservationData.emailContact,
                commentaire: reservationData.commentaire
            });
            alert(`${response.message}\n\nCode de confirmation: ${response.codeConfirmation}`);
            setReservationData({
                dateReservation: '',
                heureReservation: '',
                nombrePersonnes: 2,
                nomContact: '',
                telephoneContact: '',
                emailContact: '',
                commentaire: ''
            });
            handleCloseReservation();
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
            alert(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return maxDate.toISOString().split('T')[0];
    };

    // Fonctions pour les avis
    const chartData = Object.entries(statistiques.repartitionNotes)
        .map(([note, count]) => ({
            note: `${note} ⭐`,
            count: count
        }))
        .reverse();

    const getColorForRating = (index) => {
        const colors = ['#10b981', '#22c55e', '#eab308', '#f59e0b', '#ef4444'];
        return colors[index];
    };

    const renderStars = (rating, interactive = false, field = 'note', size = 20) => {
        return (
            <div className="stars-input">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        fill={star <= rating ? '#FFD700' : 'none'}
                        stroke={star <= rating ? '#FFD700' : '#d1d5db'}
                        className={interactive ? 'star-clickable' : ''}
                        onClick={() => interactive && setNewAvis({ ...newAvis, [field]: star })}
                    />
                ))}
            </div>
        );
    };

    if (loading || !restaurant) {
        return (
            <div className="loading-container">
                <div className="loading-text">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="restaurant-detail-container">
            {/* En-tête avec image de couverture */}
            <div className="cover-section">
                <img
                    src={restaurant.imageCouverture}
                    alt={restaurant.nom}
                    className="cover-image"
                />
                <div className="cover-overlay" />

                {/* Bouton retour */}
                <button onClick={() => navigate(-1)} className="back-button">
                    <ChevronLeft size={24} color="#1f2937" />
                </button>

                {/* Boutons actions */}
                <div className="action-buttons">
                    <button onClick={() => setIsFavorite(!isFavorite)} className="action-button">
                        <Heart size={24} color={isFavorite ? '#D64545' : '#1f2937'} fill={isFavorite ? '#D64545' : 'none'} />
                    </button>
                    <button className="action-button">
                        <Share2 size={24} color="#1f2937" />
                    </button>
                </div>

                {/* Informations principales */}
                <div className="cover-info">
                    <div className="cuisine-badge" style={{ backgroundColor: activeTheme }}>
                        {restaurant.typeCuisine}
                    </div>
                    <h1 className="restaurant-name">{restaurant.nom}</h1>
                    <div className="restaurant-meta">
                        <div className="meta-item">
                            <Star size={20} fill="#FFD700" stroke="#FFD700" />
                            <span className="meta-rating">{restaurant.noteMoyenne}</span>
                            <span>({restaurant.nombreAvis} avis)</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-price">{getPrixSymbol(restaurant.prixMoyen)}</span>
                        </div>
                        <div className="meta-item">
                            <MapPin size={18} />
                            <span>{restaurant.quartier}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="main-content">
                {/* Onglets */}
                <div className="tabs-container">
                    {['infos', 'menu', 'horaires', 'avis'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`tab-button ${activeTab === tab ? 'tab-button-active' : 'tab-button-inactive'}`}
                            style={{ backgroundColor: activeTab === tab ? activeTheme : 'transparent' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Contenu des onglets */}
                {activeTab === 'infos' && (
                    <div className="tab-content two-column-grid">
                        <div className="content-card">
                            <h2 className="section-title">
                                <Info size={24} color={activeTheme} />
                                À propos
                            </h2>
                            <p className="description-text">{restaurant.description}</p>

                            <h3 className="section-subtitle">
                                <Award size={20} color={activeTheme} />
                                Spécialités
                            </h3>
                            <p className="description-text">{restaurant.specialites}</p>

                            <div className="divider">
                                <h3 className="section-subtitle">Prix moyen</h3>
                                <div className="price-badge" style={{ color: activeTheme }}>
                                    {restaurant.prixMoyen} MAD par personne
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="content-card">
                                <h2 className="section-title">Services & Équipements</h2>
                                <div className="services-grid">
                                    {restaurant.parking && (
                                        <div className="service-item">
                                            <Car size={20} color={activeTheme} />
                                            <span className="service-text">Stationnement gratuit</span>
                                        </div>
                                    )}
                                    {restaurant.wifi && (
                                        <div className="service-item">
                                            <Wifi size={20} color={activeTheme} />
                                            <span className="service-text">WiFi gratuit</span>
                                        </div>
                                    )}
                                    {restaurant.terrasse && (
                                        <div className="service-item">
                                            <Users size={20} color={activeTheme} />
                                            <span className="service-text">Terrasse disponible</span>
                                        </div>
                                    )}
                                    {restaurant.climatisation && (
                                        <div className="service-item">
                                            <Wind size={20} color={activeTheme} />
                                            <span className="service-text">Confort garanti</span>
                                        </div>
                                    )}
                                    {restaurant.livraison && (
                                        <div className="service-item">
                                            <Car size={20} color={activeTheme} />
                                            <span className="service-text">Livraison à domicile</span>
                                        </div>
                                    )}
                                    {restaurant.aEmporter && (
                                        <div className="service-item">
                                            <Utensils size={20} color={activeTheme} />
                                            <span className="service-text">À emporter disponible</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="content-card">
                                <h2 className="section-title">Contact & Localisation</h2>
                                <div className="contact-list">
                                    <div className="contact-item">
                                        <MapPin size={20} color={activeTheme} style={{ marginTop: '0.25rem' }} />
                                        <div className="contact-details">
                                            <div className="contact-label">Adresse</div>
                                            <div className="contact-value">{restaurant.adresse}, {restaurant.ville}</div>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <Phone size={20} color={activeTheme} />
                                        <a href={`tel:${restaurant.telephone}`} className="contact-link" style={{ color: activeTheme }}>
                                            {restaurant.telephone}
                                        </a>
                                    </div>
                                    <div className="contact-item">
                                        <Mail size={20} color={activeTheme} />
                                        <a href={`mailto:${restaurant.email}`} className="contact-link" style={{ color: activeTheme }}>
                                            {restaurant.email}
                                        </a>
                                    </div>
                                    {restaurant.siteWeb && (
                                        <div className="contact-item">
                                            <Globe size={20} color={activeTheme} />
                                            <a href={`https://${restaurant.siteWeb}`} target="_blank" rel="noopener noreferrer" className="contact-link" style={{ color: activeTheme }}>
                                                {restaurant.siteWeb}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'horaires' && (
                    <div className="content-card">
                        <h2 className="section-title">
                            <Clock size={24} color={activeTheme} />
                            Horaires d'ouverture
                        </h2>
                        <div className="horaires-list">
                            {Object.entries(restaurant.horaires).map(([jour, info]) => (
                                <div
                                    key={jour}
                                    className={`horaire-item ${jour === getCurrentDay() ? 'horaire-item-current' : 'horaire-item-normal'}`}
                                    style={jour === getCurrentDay() ? { borderLeftColor: activeTheme } : {}}
                                >
                                    <span className={`horaire-jour ${jour === getCurrentDay() ? 'horaire-jour-bold' : ''}`}>
                                        {jour}
                                    </span>
                                    <span className={`horaire-heures ${info.ouvert ? 'horaire-heures-open' : 'horaire-heures-closed'}`}>
                                        {info.ouvert ? info.heures : 'Fermé'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'avis' && (
                    <div>
                        {/* En-tête des avis */}
                        <div className="avis-card">
                            <div className="avis-header">
                                <div>
                                    <h2 className="section-title">Avis des clients</h2>
                                    <div className="avis-summary">
                                        <div className="avis-note-display">
                                            <Star size={24} fill="#FFD700" stroke="#FFD700" />
                                            <span className="avis-note-number">{statistiques.noteMoyenne}</span>
                                        </div>
                                        <span className="avis-count">sur 5 ({statistiques.totalAvis} avis)</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowAvisForm(!showAvisForm)}
                                    className="add-avis-button"
                                    style={{ backgroundColor: activeTheme }}
                                >
                                    <MessageSquare size={18} />
                                    Laisser un avis
                                </button>
                            </div>

                            {/* Graphique de satisfaction */}
                            <div className="chart-container">
                                <h3 className="chart-title">Répartition des notes</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="note" stroke="#6b7280" style={{ fontSize: '0.875rem' }} />
                                        <YAxis stroke="#6b7280" style={{ fontSize: '0.875rem' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getColorForRating(index)} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Notes détaillées */}
                            <div className="notes-grid">
                                {[
                                    { label: 'Nourriture', value: statistiques.moyenneNourriture },
                                    { label: 'Service', value: statistiques.moyenneService },
                                    { label: 'Ambiance', value: statistiques.moyenneAmbiance },
                                    { label: 'Qualité/Prix', value: statistiques.moyenneRapportQualitePrix }
                                ].map((item, idx) => (
                                    <div key={idx} className="note-card">
                                        <div className="note-label">{item.label}</div>
                                        <div className="note-value">
                                            <Star size={18} fill="#FFD700" stroke="#FFD700" />
                                            <span className="note-number">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Formulaire d'ajout d'avis */}
                        {showAvisForm && (
                            <div className="avis-card avis-form-container">
                                <h3 className="avis-form-title">Partagez votre expérience</h3>

                                <div className="form-group">
                                    <label className="form-label">Note globale *</label>
                                    {renderStars(newAvis.note, true, 'note', 32)}
                                </div>

                                <div className="notes-grid">
                                    {[
                                        { label: 'Nourriture', field: 'noteNourriture' },
                                        { label: 'Service', field: 'noteService' },
                                        { label: 'Ambiance', field: 'noteAmbiance' },
                                        { label: 'Qualité/Prix', field: 'noteRapportQualitePrix' }
                                    ].map((item) => (
                                        <div key={item.field}>
                                            <label className="form-label">{item.label}</label>
                                            {renderStars(newAvis[item.field], true, item.field, 20)}
                                        </div>
                                    ))}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Titre de votre avis</label>
                                    <input
                                        type="text"
                                        value={newAvis.titre}
                                        onChange={(e) => setNewAvis({ ...newAvis, titre: e.target.value })}
                                        placeholder="Résumez votre expérience"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Votre commentaire *</label>
                                    <textarea
                                        value={newAvis.commentaire}
                                        onChange={(e) => setNewAvis({ ...newAvis, commentaire: e.target.value })}
                                        placeholder="Partagez les détails de votre expérience..."
                                        className="form-textarea"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button onClick={() => setShowAvisForm(false)} className="cancel-button">
                                        Annuler
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('Avis:', newAvis);
                                            alert('Avis soumis!');
                                            setShowAvisForm(false);
                                        }}
                                        className="submit-button"
                                        style={{ backgroundColor: activeTheme }}
                                    >
                                        Publier l'avis
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Filtres */}
                        <div className="filters-container">
                            <Filter size={18} color="#6b7280" />
                            <span className="filter-label">Trier par:</span>
                            {['recent', 'note_haute', 'avec_photos'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`filter-button ${activeFilter === filter ? 'filter-button-active' : 'filter-button-inactive'}`}
                                    style={activeFilter === filter ? { backgroundColor: activeTheme } : {}}
                                >
                                    {filter === 'recent' && 'Plus récents'}
                                    {filter === 'note_haute' && 'Note élevée'}
                                    {filter === 'avec_photos' && 'Avec photos'}
                                </button>
                            ))}
                        </div>

                        {/* Liste des avis */}
                        {avisListe.map((avis) => (
                            <div key={avis.id} className="avis-item-card">
                                <div className="avis-item-header">
                                    <div className="avis-user-info">
                                        <div className="avis-avatar" style={{ backgroundColor: activeTheme }}>
                                            {avis.utilisateurPrenom[0]}{avis.utilisateurNom[0]}
                                        </div>
                                        <div className="avis-user-details">
                                            <div className="avis-user-name">
                                                {avis.utilisateurPrenom} {avis.utilisateurNom}
                                            </div>
                                            <div className="avis-date">
                                                {new Date(avis.createdAt).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="avis-note-badge">
                                        <Star size={20} fill="#FFD700" stroke="#FFD700" />
                                        <span className="avis-note-badge-number">{avis.note}</span>
                                    </div>
                                </div>

                                <h4 className="avis-title">{avis.titre}</h4>
                                <p className="avis-comment">{avis.commentaire}</p>

                                {avis.photos.length > 0 && (
                                    <div className="avis-photos">
                                        {avis.photos.map((photo, idx) => (
                                            <img
                                                key={idx}
                                                src={photo}
                                                alt={`Photo ${idx + 1}`}
                                                className="avis-photo"
                                            />
                                        ))}
                                    </div>
                                )}

                                <button className="avis-action-button">
                                    <ThumbsUp size={16} />
                                    Utile
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bouton de réservation flottant */}
                {restaurant.reservationEnLigne && (
                    <div className="floating-reservation">
                        <button
                            onClick={handleOpenReservation}
                            className="reservation-button"
                            style={{ backgroundColor: activeTheme }}
                        >
                            <Calendar size={24} />
                            Réserver une table
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de réservation */}
            {showReservationModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Réserver une table</h2>
                            <button onClick={handleCloseReservation} className="modal-close">
                                <X size={24} color="#6b7280" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReservation} className="modal-body">
                            <div className="modal-form-grid">
                                <div className="modal-form-row">
                                    <div className="modal-form-group">
                                        <label className="modal-form-label">Date *</label>
                                        <input
                                            type="date"
                                            name="dateReservation"
                                            value={reservationData.dateReservation}
                                            onChange={handleInputChange}
                                            min={getMinDate()}
                                            max={getMaxDate()}
                                            required
                                            className="modal-form-input"
                                        />
                                    </div>

                                    <div className="modal-form-group">
                                        <label className="modal-form-label">Heure *</label>
                                        <input
                                            type="time"
                                            name="heureReservation"
                                            value={reservationData.heureReservation}
                                            onChange={handleInputChange}
                                            required
                                            className="modal-form-input"
                                        />
                                    </div>
                                </div>

                                <div className="modal-form-group">
                                    <label className="modal-form-label">Nombre de personnes *</label>
                                    <select
                                        name="nombrePersonnes"
                                        value={reservationData.nombrePersonnes}
                                        onChange={handleInputChange}
                                        required
                                        className="modal-form-select"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'personne' : 'personnes'}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="modal-form-group">
                                    <label className="modal-form-label">Nom complet *</label>
                                    <input
                                        type="text"
                                        name="nomContact"
                                        value={reservationData.nomContact}
                                        onChange={handleInputChange}
                                        placeholder="Votre nom"
                                        required
                                        className="modal-form-input"
                                    />
                                </div>

                                <div className="modal-form-group">
                                    <label className="modal-form-label">Téléphone *</label>
                                    <input
                                        type="tel"
                                        name="telephoneContact"
                                        value={reservationData.telephoneContact}
                                        onChange={handleInputChange}
                                        placeholder="+212 6XX-XXXXXX"
                                        required
                                        className="modal-form-input"
                                    />
                                </div>

                                <div className="modal-form-group">
                                    <label className="modal-form-label">Email *</label>
                                    <input
                                        type="email"
                                        name="emailContact"
                                        value={reservationData.emailContact}
                                        onChange={handleInputChange}
                                        placeholder="votre@email.com"
                                        required
                                        className="modal-form-input"
                                    />
                                </div>

                                <div className="modal-form-group">
                                    <label className="modal-form-label">Commentaire (optionnel)</label>
                                    <textarea
                                        name="commentaire"
                                        value={reservationData.commentaire}
                                        onChange={handleInputChange}
                                        placeholder="Demandes spéciales, allergies..."
                                        rows={3}
                                        className="modal-form-textarea"
                                    />
                                </div>
                            </div>

                            <div className="modal-form-buttons">
                                <button
                                    type="button"
                                    onClick={handleCloseReservation}
                                    className="modal-button-secondary"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="modal-button-primary"
                                    style={{ backgroundColor: activeTheme }}
                                >
                                    <Calendar size={18} />
                                    Confirmer la réservation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
