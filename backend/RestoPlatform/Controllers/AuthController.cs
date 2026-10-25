using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestoPlatform.Data;
using RestoPlatform.DTOs;
using RestoPlatform.Models;
using RestoPlatform.Services;

namespace RestoPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordService _passwordService;

        public AuthController(AppDbContext context, IPasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            // Vérifier si l'email existe déjà
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Cet email est déjà utilisé" });
            }

            // Créer le nouvel utilisateur
            var user = new User
            {
                Nom = registerDto.Nom,
                Prenom = registerDto.Prenom,
                Email = registerDto.Email,
                Telephone = registerDto.Telephone,
                MotDePasse = _passwordService.HashPassword(registerDto.Password),
                Role = "client",
                EstVerifie = false,
                DateInscription = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Retourner la réponse
            return Ok(new AuthResponseDto
            {
                UserId = user.Id,
                Nom = user.Nom,
                Prenom = user.Prenom,
                Email = user.Email,
                PhotoProfil = user.PhotoProfil,
                Role = user.Role,
                EstVerifie = user.EstVerifie,
                Token = "", // À implémenter plus tard avec JWT
                Message = "Inscription réussie !"
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !_passwordService.VerifyPassword(loginDto.Password, user.MotDePasse))
            {
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });
            }

            // Mettre à jour la dernière connexion
            user.DerniereConnexion = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDto
            {
                UserId = user.Id,
                Nom = user.Nom,
                Prenom = user.Prenom,
                Email = user.Email,
                PhotoProfil = user.PhotoProfil,
                Role = user.Role,
                EstVerifie = user.EstVerifie,
                Token = "",
                Message = "Connexion réussie !"
            });
        }
    }
}
