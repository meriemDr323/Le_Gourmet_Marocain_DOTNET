using System;
namespace RestoPlatform.Models

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestoPlatform.Models
{
    // Modèle Avis
    public class Avis
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int RestaurantId { get; set; }

        [Required]
        public int UtilisateurId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Note { get; set; }

        [MaxLength(200)]
        public string? Titre { get; set; }

        [Required]
        public string Commentaire { get; set; } = string.Empty;

        [Range(1, 5)]
        public int? NoteNourriture { get; set; }

        [Range(1, 5)]
        public int? NoteService { get; set; }

        [Range(1, 5)]
        public int? NoteAmbiance { get; set; }

        [Range(1, 5)]
        public int? NoteRapportQualitePrix { get; set; }

        public DateTime? VisiteDate { get; set; }

        [Required]
        [MaxLength(20)]
        public string Statut { get; set; } = "en_attente"; // en_attente, approuve, rejete

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("RestaurantId")]
        public Restaurant Restaurant { get; set; } = null!;

        [ForeignKey("UtilisateurId")]
        public User Utilisateur { get; set; } = null!;

        public ICollection<PhotoAvis> Photos { get; set; } = new List<PhotoAvis>();
        public ICollection<ReponseAvis> Reponses { get; set; } = new List<ReponseAvis>();
    }