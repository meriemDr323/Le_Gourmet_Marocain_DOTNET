namespace RestoPlatform.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; }
        public int UtilisateurId { get; set; }
        public DateTime DateReservation { get; set; }
        public TimeSpan HeureReservation { get; set; }
        public int NombrePersonnes { get; set; }
        public string NomContact { get; set; } = default!;
        public string TelephoneContact { get; set; } = default!;
        public string EmailContact { get; set; } = default!;
        public string? Commentaire { get; set; }
        public string Statut { get; set; } = "en_attente";
        public string CodeConfirmation { get; set; } = default!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public Restaurant? Restaurant { get; set; }
        public User? Utilisateur { get; set; }
    }
}
