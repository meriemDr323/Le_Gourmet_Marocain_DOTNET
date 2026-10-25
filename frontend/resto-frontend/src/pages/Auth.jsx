import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { register as registerUser, login as loginUser } from '../services/authService';
import '../styles/Auth.css';

export default function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // États pour le formulaire de connexion
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // États pour le formulaire d'inscription
    const [registerData, setRegisterData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        password: '',
        confirmPassword: ''
    });

    // État pour récupération de mot de passe
    const [forgotEmail, setForgotEmail] = useState('');

    // Gestion de la soumission - Connexion
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(loginData);
            alert(response.message);
            // Sauvegarder le token et rediriger
            localStorage.setItem('user', JSON.stringify(response));
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la connexion');
        }
    };

    // Gestion de la soumission - Inscription
    const handleRegister = async (e) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const response = await registerUser(registerData);
            alert(response.message);
            // Rediriger ou changer vers l'onglet connexion
            setIsLogin(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    };

    // Gestion de la soumission - Mot de passe oublié
    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log('Recuperation mot de passe:', forgotEmail);
        // TODO: Appel API de récupération
    };

    return (
        <div className="auth-container">
            {/* Décorations en arrière-plan */}
            <div className="auth-decoration decoration-1"></div>
            <div className="auth-decoration decoration-2"></div>
            <div className="auth-decoration decoration-3"></div>

            {/* Navbar */}
            <nav className="auth-navbar">
                <div className="auth-nav-content">
                    <div className="auth-nav-wrapper">
                        <button onClick={() => navigate('/')} className="auth-logo">
                            Food<span className="logo-highlight">Vista</span>
                        </button>

                        <div className="auth-nav-links">
                            <a href="/#accueil" className="auth-nav-link">Accueil</a>
                            <a href="/#restaurants" className="auth-nav-link">Restaurants</a>
                            <a href="/#comment-ca-marche" className="auth-nav-link">Comment ca marche</a>
                            <a href="/#contact" className="auth-nav-link">Contact</a>
                            <button className="auth-nav-button">Devenir Partenaire</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenu principal */}
            <div className="auth-content">
                <div className="auth-box">
                    {/* Formulaire Mot de passe oublié */}
                    {showForgotPassword ? (
                        <div className="auth-form-container">
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                className="back-button"
                            >
                                <ArrowLeft size={20} />
                                Retour
                            </button>

                            <h2 className="auth-title">Mot de passe oublie ?</h2>
                            <p className="auth-subtitle">
                                Entrez votre adresse email et nous vous enverrons un lien pour reinitialiser votre mot de passe.
                            </p>

                            <form className="auth-form" onSubmit={handleForgotPassword}>
                                <div className="input-group">
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Adresse email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        className="auth-input"
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-submit">
                                    Envoyer le lien
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* Onglets Connexion/Inscription */}
                            <div className="auth-tabs">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`auth-tab ${isLogin ? 'active' : ''}`}
                                >
                                    Connexion
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`auth-tab ${!isLogin ? 'active' : ''}`}
                                >
                                    Inscription
                                </button>
                            </div>

                            {/* Formulaire de Connexion */}
                            {isLogin ? (
                                <div className="auth-form-container">
                                    <h2 className="auth-title">Bon retour !</h2>
                                    <p className="auth-subtitle">Connectez-vous pour decouvrir les meilleurs restaurants</p>

                                    <form className="auth-form" onSubmit={handleLogin}>
                                        <div className="input-group">
                                            <Mail className="input-icon" size={20} />
                                            <input
                                                type="email"
                                                placeholder="Adresse email"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                                className="auth-input"
                                                required
                                            />
                                        </div>

                                        <div className="input-group">
                                            <Lock className="input-icon" size={20} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Mot de passe"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                className="auth-input"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-toggle"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="forgot-password"
                                        >
                                            Mot de passe oublie ?
                                        </button>

                                        <button type="submit" className="btn-submit">
                                            Se connecter
                                        </button>

                                        <div className="divider">
                                            <span>OU</span>
                                        </div>

                                        <button type="button" className="btn-google">
                                            <img src="https://www.google.com/favicon.ico" alt="Google" />
                                            Continuer avec Google
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                /* Formulaire d'Inscription */
                                <div className="auth-form-container">
                                    <h2 className="auth-title">Creer un compte</h2>
                                    <p className="auth-subtitle">Rejoignez FoodVista et explorez les saveurs de votre ville</p>

                                    <form className="auth-form" onSubmit={handleRegister}>
                                        <div className="input-row">
                                            <div className="input-group">
                                                <User className="input-icon" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Nom"
                                                    value={registerData.nom}
                                                    onChange={(e) => setRegisterData({ ...registerData, nom: e.target.value })}
                                                    className="auth-input"
                                                    required
                                                />
                                            </div>

                                            <div className="input-group">
                                                <User className="input-icon" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Prenom"
                                                    value={registerData.prenom}
                                                    onChange={(e) => setRegisterData({ ...registerData, prenom: e.target.value })}
                                                    className="auth-input"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <Mail className="input-icon" size={20} />
                                            <input
                                                type="email"
                                                placeholder="Adresse email"
                                                value={registerData.email}
                                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                                className="auth-input"
                                                required
                                            />
                                        </div>

                                        <div className="input-group">
                                            <Phone className="input-icon" size={20} />
                                            <input
                                                type="tel"
                                                placeholder="Numero de telephone"
                                                value={registerData.telephone}
                                                onChange={(e) => setRegisterData({ ...registerData, telephone: e.target.value })}
                                                className="auth-input"
                                                required
                                            />
                                        </div>

                                        <div className="input-group">
                                            <Lock className="input-icon" size={20} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Mot de passe"
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                className="auth-input"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-toggle"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>

                                        <div className="input-group">
                                            <Lock className="input-icon" size={20} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Confirmer le mot de passe"
                                                value={registerData.confirmPassword}
                                                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                                className="auth-input"
                                                required
                                            />
                                        </div>

                                        <button type="submit" className="btn-submit">
                                            S'inscrire
                                        </button>

                                        <div className="divider">
                                            <span>OU</span>
                                        </div>

                                        <button type="button" className="btn-google">
                                            <img src="https://www.google.com/favicon.ico" alt="Google" />
                                            Continuer avec Google
                                        </button>

                                        <p className="terms-text">
                                            En vous inscrivant, vous acceptez nos{' '}
                                            <a href="#" className="terms-link">Conditions d'utilisation</a>
                                            {' '}et notre{' '}
                                            <a href="#" className="terms-link">Politique de confidentialite</a>
                                        </p>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}