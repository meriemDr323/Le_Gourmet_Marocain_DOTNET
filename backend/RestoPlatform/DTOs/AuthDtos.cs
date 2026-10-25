namespace RestoPlatform.DTOs
{
    // Pour la connexion
    public class LoginDto
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }

    // Pour l'inscription
    public class RegisterDto
    {
        public string Nom { get; set; } = default!;
        public string Prenom { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Telephone { get; set; } = default!;
        public string Password { get; set; } = default!;
    }

    // Pour la récupération de mot de passe
    public class ForgotPasswordDto
    {
        public string Email { get; set; } = default!;
    }

    // Réponse après connexion/inscription
    public class AuthResponseDto
    {
        public int UserId { get; set; }
        public string Nom { get; set; } = default!;
        public string Prenom { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? PhotoProfil { get; set; }
        public string Role { get; set; } = default!;
        public bool EstVerifie { get; set; }
        public string Token { get; set; } = default!;
        public string Message { get; set; } = default!;
    }
}
