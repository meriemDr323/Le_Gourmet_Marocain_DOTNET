using System;

namespace RestoPlatform.Models
{
    public class Restaurant
    {
        public int Id { get; set; }

        // Relation avec l'utilisateur propriétaire
        public int? ProprietaireId { get; set; }

        // Informations générales
        public string Nom { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public string Adresse { get; set; } = string.Empty;
        public string Ville { get; set; } = string.Empty;
        public string? CodePostal { get; set; }
        public string? Quartier { get; set; }
        public string? Telephone { get; set; }
        public string? Email { get; set; }
        public string? SiteWeb { get; set; }

        // Informations culinaires
        public string? TypeCuisine { get; set; }
        public string? Specialites { get; set; }
        public decimal? PrixMoyen { get; set; }

        // Notations
        public decimal NoteMoyenne { get; set; } = 0.00m;
        public int NombreAvis { get; set; } = 0;

        // Médias
        public string? ImagePrincipale { get; set; }
        public string? ImageCouverture { get; set; }
        public string? ImageMenu { get; set; }

        // Horaires JSON
        public string? Horaires { get; set; }

        // Capacité & services
        public int? Capacite { get; set; }
        public bool Parking { get; set; } = false;
        public bool Wifi { get; set; } = false;
        public bool Terrasse { get; set; } = false;
        public bool Climatisation { get; set; } = false;
        public bool ReservationEnLigne { get; set; } = true;
        public bool Livraison { get; set; } = false;
        public bool AEmporter { get; set; } = false;

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        // public Utilisateur? Proprietaire { get; set; }
    }
}
