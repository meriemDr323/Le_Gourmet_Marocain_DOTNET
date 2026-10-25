using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestoPlatform.Data;
using RestoPlatform.DTOs;
using RestoPlatform.Models;

namespace RestoPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ReservationResponseDto>> CreateReservation(CreateReservationDto dto)
        {
            // Vérifier que le restaurant existe
            var restaurant = await _context.Restaurants.FindAsync(dto.RestaurantId);
            if (restaurant == null)
            {
                return NotFound(new { message = "Restaurant non trouvé" });
            }

            // TODO: Récupérer l'utilisateur connecté (pour l'instant, utilisateur ID = 1)
            int utilisateurId = 1; // À remplacer par l'ID de l'utilisateur connecté via JWT

            // Générer un code de confirmation unique
            string codeConfirmation = GenerateConfirmationCode();

            // Créer la réservation
            var reservation = new Reservation
            {
                RestaurantId = dto.RestaurantId,
                UtilisateurId = utilisateurId,
                DateReservation = DateTime.Parse(dto.DateReservation),
                HeureReservation = TimeSpan.Parse(dto.HeureReservation),
                NombrePersonnes = dto.NombrePersonnes,
                NomContact = dto.NomContact,
                TelephoneContact = dto.TelephoneContact,
                EmailContact = dto.EmailContact,
                Commentaire = dto.Commentaire,
                Statut = "en_attente",
                CodeConfirmation = codeConfirmation,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            // TODO: Envoyer un email de confirmation

            return Ok(new ReservationResponseDto
            {
                Id = reservation.Id,
                RestaurantNom = restaurant.Nom,
                DateReservation = reservation.DateReservation,
                HeureReservation = reservation.HeureReservation,
                NombrePersonnes = reservation.NombrePersonnes,
                NomContact = reservation.NomContact,
                Statut = reservation.Statut,
                CodeConfirmation = codeConfirmation,
                Message = $"Réservation confirmée ! Code de confirmation: {codeConfirmation}"
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Restaurant)
                .Include(r => r.Utilisateur)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }

        private string GenerateConfirmationCode()
        {
            return $"RES{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";
        }
    }
}
