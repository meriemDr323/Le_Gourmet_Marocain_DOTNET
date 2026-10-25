using Microsoft.EntityFrameworkCore;
using RestoPlatform.Data;
using RestoPlatform.DTOs;
using RestoPlatform.Models;

namespace RestoPlatform.Services
{
    public class AvisService
    {
        private readonly AppDbContext _context;

        public AvisService(AppDbContext context)
        {
            _context = context;
        }

        // Récupérer les avis d'un restaurant avec pagination et filtres
        public async Task<AvisPaginatedResponse> GetAvisByRestaurantAsync(int restaurantId, AvisFilterDto filter)
        {
            var query = _context.Avis
                .Include(a => a.Utilisateur)
                .Include(a => a.Photos)
                .Include(a => a.Reponses)
                    .ThenInclude(r => r.Utilisateur)
                .Where(a => a.RestaurantId == restaurantId && a.Statut == "approuve");

            // Filtrer par note
            if (filter.Note.HasValue)
            {
                query = query.Where(a => a.Note == filter.Note.Value);
            }

            if (filter.NoteMin.HasValue)
            {
                query = query.Where(a => a.Note >= filter.NoteMin.Value);
            }

            // Filtrer avis avec photos seulement
            if (filter.AvecPhotos)
            {
                query = query.Where(a => a.Photos.Any());
            }

            // Tri
            query = filter.TriPar?.ToLower() switch
            {
                "ancien" => query.OrderBy(a => a.CreatedAt),
                "note_haute" => query.OrderByDescending(a => a.Note).ThenByDescending(a => a.CreatedAt),
                "note_basse" => query.OrderBy(a => a.Note).ThenByDescending(a => a.CreatedAt),
                _ => query.OrderByDescending(a => a.CreatedAt) // "recent" par défaut
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize);

            var avis = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(a => new AvisDto
                {
                    Id = a.Id,
                    RestaurantId = a.RestaurantId,
                    UtilisateurId = a.UtilisateurId,
                    UtilisateurNom = a.Utilisateur.Nom,
                    UtilisateurPrenom = a.Utilisateur.Prenom,
                    UtilisateurPhoto = a.Utilisateur.PhotoProfil,
                    Note = a.Note,
                    Titre = a.Titre,
                    Commentaire = a.Commentaire,
                    NoteNourriture = a.NoteNourriture,
                    NoteService = a.NoteService,
                    NoteAmbiance = a.NoteAmbiance,
                    NoteRapportQualitePrix = a.NoteRapportQualitePrix,
                    VisiteDate = a.VisiteDate,
                    Statut = a.Statut,
                    Photos = a.Photos.Select(p => new PhotoAvisDto
                    {
                        Id = p.Id,
                        Url = p.Url,
                        Legende = p.Legende
                    }).ToList(),
                    Reponses = a.Reponses.Select(r => new ReponseAvisDto
                    {
                        Id = r.Id,
                        AvisId = r.AvisId,
                        UtilisateurNom = r.Utilisateur.Nom + " " + r.Utilisateur.Prenom,
                        Contenu = r.Contenu,
                        CreatedAt = r.CreatedAt
                    }).ToList(),
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .ToListAsync();

            return new AvisPaginatedResponse
            {
                Avis = avis,
                TotalCount = totalCount,
                PageNumber = filter.Page,
                PageSize = filter.PageSize,
                TotalPages = totalPages,
                HasPrevious = filter.Page > 1,
                HasNext = filter.Page < totalPages
            };
        }

        // Récupérer les statistiques d'un restaurant
        public async Task<StatistiquesAvisDto> GetStatistiquesAsync(int restaurantId)
        {
            var avis = await _context.Avis
                .Include(a => a.Photos)
                .Where(a => a.RestaurantId == restaurantId && a.Statut == "approuve")
                .ToListAsync();

            if (!avis.Any())
            {
                return new StatistiquesAvisDto();
            }

            var stats = new StatistiquesAvisDto
            {
                NoteMoyenne = Math.Round(avis.Average(a => a.Note), 2),
                TotalAvis = avis.Count,
                RepartitionNotes = avis.GroupBy(a => a.Note)
                    .ToDictionary(g => g.Key, g => g.Count()),
                MoyenneNourriture = Math.Round(avis.Where(a => a.NoteNourriture.HasValue).Average(a => a.NoteNourriture!.Value), 2),
                MoyenneService = Math.Round(avis.Where(a => a.NoteService.HasValue).Average(a => a.NoteService!.Value), 2),
                MoyenneAmbiance = Math.Round(avis.Where(a => a.NoteAmbiance.HasValue).Average(a => a.NoteAmbiance!.Value), 2),
                MoyenneRapportQualitePrix = Math.Round(avis.Where(a => a.NoteRapportQualitePrix.HasValue).Average(a => a.NoteRapportQualitePrix!.Value), 2),
                TotalPhotos = avis.Sum(a => a.Photos.Count)
            };

            // S'assurer que tous les notes de 1 à 5 existent dans RepartitionNotes
            for (int i = 1; i <= 5; i++)
            {
                if (!stats.RepartitionNotes.ContainsKey(i))
                {
                    stats.RepartitionNotes[i] = 0;
                }
            }

            return stats;
        }

        // Créer un avis
        public async Task<AvisDto> CreateAvisAsync(CreateAvisDto createDto, int userId)
        {
            // Vérifier si l'utilisateur a déjà laissé un avis pour ce restaurant
            var existingAvis = await _context.Avis
                .FirstOrDefaultAsync(a => a.RestaurantId == createDto.RestaurantId && a.UtilisateurId == userId);

            if (existingAvis != null)
            {
                throw new InvalidOperationException("Vous avez déjà laissé un avis pour ce restaurant");
            }

            // Créer l'avis
            var avis = new Avis
            {
                RestaurantId = createDto.RestaurantId,
                UtilisateurId = userId,
                Note = createDto.Note,
                Titre = createDto.Titre,
                Commentaire = createDto.Commentaire,
                NoteNourriture = createDto.NoteNourriture,
                NoteService = createDto.NoteService,
                NoteAmbiance = createDto.NoteAmbiance,
                NoteRapportQualitePrix = createDto.NoteRapportQualitePrix,
                VisiteDate = createDto.VisiteDate,
                Statut = "approuve", // Auto-approuvé pour l'instant
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Avis.Add(avis);
            await _context.SaveChangesAsync();

            // Ajouter les photos si présentes
            if (createDto.PhotosUrls != null && createDto.PhotosUrls.Any())
            {
                foreach (var photoUrl in createDto.PhotosUrls)
                {
                    var photo = new PhotoAvis
                    {
                        AvisId = avis.Id,
                        Url = photoUrl,
                        CreatedAt = DateTime.Now
                    };
                    _context.PhotosAvis.Add(photo);
                }
                await _context.SaveChangesAsync();
            }

            // Mettre à jour la note moyenne du restaurant
            await UpdateRestaurantRatingAsync(createDto.RestaurantId);

            // Retourner l'avis créé
            return await GetAvisByIdAsync(avis.Id);
        }

        // Récupérer un avis par ID
        public async Task<AvisDto?> GetAvisByIdAsync(int id)
        {
            return await _context.Avis
                .Include(a => a.Utilisateur)
                .Include(a => a.Photos)
                .Include(a => a.Reponses)
                    .ThenInclude(r => r.Utilisateur)
                .Where(a => a.Id == id)
                .Select(a => new AvisDto
                {
                    Id = a.Id,
                    RestaurantId = a.RestaurantId,
                    UtilisateurId = a.UtilisateurId,
                    UtilisateurNom = a.Utilisateur.Nom,
                    UtilisateurPrenom = a.Utilisateur.Prenom,
                    UtilisateurPhoto = a.Utilisateur.PhotoProfil,
                    Note = a.Note,
                    Titre = a.Titre,
                    Commentaire = a.Commentaire,
                    NoteNourriture = a.NoteNourriture,
                    NoteService = a.NoteService,
                    NoteAmbiance = a.NoteAmbiance,
                    NoteRapportQualitePrix = a.NoteRapportQualitePrix,
                    VisiteDate = a.VisiteDate,
                    Statut = a.Statut,
                    Photos = a.Photos.Select(p => new PhotoAvisDto
                    {
                        Id = p.Id,
                        Url = p.Url,
                        Legende = p.Legende
                    }).ToList(),
                    Reponses = a.Reponses.Select(r => new ReponseAvisDto
                    {
                        Id = r.Id,
                        AvisId = r.AvisId,
                        UtilisateurNom = r.Utilisateur.Nom + " " + r.Utilisateur.Prenom,
                        Contenu = r.Contenu,
                        CreatedAt = r.CreatedAt
                    }).ToList(),
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        // Mettre à jour un avis
        public async Task<bool> UpdateAvisAsync(int id, CreateAvisDto updateDto, int userId)
        {
            var avis = await _context.Avis.FindAsync(id);
            if (avis == null || avis.UtilisateurId != userId)
            {
                return false;
            }

            avis.Note = updateDto.Note;
            avis.Titre = updateDto.Titre;
            avis.Commentaire = updateDto.Commentaire;
            avis.NoteNourriture = updateDto.NoteNourriture;
            avis.NoteService = updateDto.NoteService;
            avis.NoteAmbiance = updateDto.NoteAmbiance;
            avis.NoteRapportQualitePrix = updateDto.NoteRapportQualitePrix;
            avis.VisiteDate = updateDto.VisiteDate;
            avis.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            await UpdateRestaurantRatingAsync(avis.RestaurantId);

            return true;
        }

        // Supprimer un avis
        public async Task<bool> DeleteAvisAsync(int id, int userId)
        {
            var avis = await _context.Avis.FindAsync(id);
            if (avis == null || avis.UtilisateurId != userId)
            {
                return false;
            }

            var restaurantId = avis.RestaurantId;
            _context.Avis.Remove(avis);
            await _context.SaveChangesAsync();
            await UpdateRestaurantRatingAsync(restaurantId);

            return true;
        }

        // Récupérer les avis d'un utilisateur
        public async Task<List<AvisDto>> GetAvisByUserAsync(int userId)
        {
            return await _context.Avis
                .Include(a => a.Restaurant)
                .Include(a => a.Photos)
                .Where(a => a.UtilisateurId == userId)
                .Select(a => new AvisDto
                {
                    Id = a.Id,
                    RestaurantId = a.RestaurantId,
                    UtilisateurId = a.UtilisateurId,
                    UtilisateurNom = a.Utilisateur.Nom,
                    UtilisateurPrenom = a.Utilisateur.Prenom,
                    Note = a.Note,
                    Titre = a.Titre,
                    Commentaire = a.Commentaire,
                    Photos = a.Photos.Select(p => new PhotoAvisDto
                    {
                        Id = p.Id,
                        Url = p.Url
                    }).ToList(),
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();
        }

        // Mettre à jour la note moyenne d'un restaurant
        private async Task UpdateRestaurantRatingAsync(int restaurantId)
        {
            var restaurant = await _context.Restaurants.FindAsync(restaurantId);
            if (restaurant == null) return;

            var avis = await _context.Avis
                .Where(a => a.RestaurantId == restaurantId && a.Statut == "approuve")
                .ToListAsync();

            if (avis.Any())
            {
                restaurant.NoteMoyenne = (decimal)Math.Round(avis.Average(a => a.Note), 2);
                restaurant.NombreAvis = avis.Count;
            }
            else
            {
                restaurant.NoteMoyenne = 0;
                restaurant.NombreAvis = 0;
            }

            await _context.SaveChangesAsync();
        }
    }
}