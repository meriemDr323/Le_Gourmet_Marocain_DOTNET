namespace RestoPlatform.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nom { get; set; } = default!;
        public string Prenom { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? Telephone { get; set; }
        public string MotDePasse { get; set; } = default!;
        public string? PhotoProfil { get; set; }
        public string Role { get; set; } = "client";
        public bool EstVerifie { get; set; } = false;
        public DateTime DateInscription { get; set; } = DateTime.Now;
        public DateTime? DerniereConnexion { get; set; }
    }
}
