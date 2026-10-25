using System;
using System.Collections.Generic;

namespace RestoPlatform.DTOs
{
    // DTO pour créer un avis
    public class CreateAvisDto
    {
        public int RestaurantId { get; set; }
        public int Note { get; set; } // 1-5
        public string? Titre { get; set; }
        public string Commentaire { get; set; } = string.Empty;
        public int? NoteNourriture { get; set; }
        public int? NoteService { get; set; }
        public int? NoteAmbiance { get; set; }
        public int? NoteRapportQualitePrix { get; set; }
        public DateTime? VisiteDate { get; set; }
        public List<string>? PhotosUrls { get; set; } // URLs des photos uploadées
    }

    // DTO pour la réponse d'un avis
    public class AvisDto
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; }
        public int UtilisateurId { get; set; }
        public string UtilisateurNom { get; set; } = string.Empty;
        public string UtilisateurPrenom { get; set; } = string.Empty;
        public string? UtilisateurPhoto { get; set; }
        public int Note { get; set; }
        public string? Titre { get; set; }
        public string Commentaire { get; set; } = string.Empty;
        public int? NoteNourriture { get; set; }
        public int? NoteService { get; set; }
        public int? NoteAmbiance { get; set; }
        public int? NoteRapportQualitePrix { get; set; }
        public DateTime? VisiteDate { get; set; }
        public string Statut { get; set; } = "en_attente";
        public List<PhotoAvisDto> Photos { get; set; } = new List<PhotoAvisDto>();
        public List<ReponseAvisDto>? Reponses { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // DTO pour les photos d'avis
    public class PhotoAvisDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? Legende { get; set; }
    }

    // DTO pour les réponses aux avis
    public class ReponseAvisDto
    {
        public int Id { get; set; }
        public int AvisId { get; set; }
        public string UtilisateurNom { get; set; } = string.Empty;
        public string Contenu { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // DTO pour les statistiques de satisfaction
    public class StatistiquesAvisDto
    {
        public double NoteMoyenne { get; set; }
        public int TotalAvis { get; set; }
        public Dictionary<int, int> RepartitionNotes { get; set; } = new Dictionary<int, int>
        {
            { 5, 0 }, { 4, 0 }, { 3, 0 }, { 2, 0 }, { 1, 0 }
        };
        public double MoyenneNourriture { get; set; }
        public double MoyenneService { get; set; }
        public double MoyenneAmbiance { get; set; }
        public double MoyenneRapportQualitePrix { get; set; }
        public int TotalPhotos { get; set; }
    }

    // DTO pour les filtres d'avis
    public class AvisFilterDto
    {
        public int? Note { get; set; } // Filtrer par note exacte
        public int? NoteMin { get; set; } // Note minimum
        public string? TriPar { get; set; } = "recent"; // recent, ancien, note_haute, note_basse
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public bool AvecPhotos { get; set; } = false;
    }

    // Réponse paginée pour les avis
    public class AvisPaginatedResponse
    {
        public List<AvisDto> Avis { get; set; } = new List<AvisDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasPrevious { get; set; }
        public bool HasNext { get; set; }
    }
}