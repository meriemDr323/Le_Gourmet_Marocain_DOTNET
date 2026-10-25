using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestoPlatform.Data;
using RestoPlatform.Models;

namespace RestoPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RestaurantsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/restaurants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurants(
            [FromQuery] string? ville = null,
            [FromQuery] string? typeCuisine = null,
            [FromQuery] decimal? prixMin = null,
            [FromQuery] decimal? prixMax = null,
            [FromQuery] decimal? noteMin = null)
        {
            var query = _context.Restaurants.AsQueryable();

            if (!string.IsNullOrEmpty(ville))
                query = query.Where(r => r.Ville == ville);

            if (!string.IsNullOrEmpty(typeCuisine))
                query = query.Where(r => r.TypeCuisine == typeCuisine);

            if (prixMin.HasValue)
                query = query.Where(r => r.PrixMoyen >= prixMin.Value);

            if (prixMax.HasValue)
                query = query.Where(r => r.PrixMoyen <= prixMax.Value);

            if (noteMin.HasValue)
                query = query.Where(r => r.NoteMoyenne >= noteMin.Value);

            var restaurants = await query.ToListAsync();
            return Ok(restaurants);
        }

        // GET: api/restaurants/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Restaurant>> GetRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);

            if (restaurant == null)
            {
                return NotFound();
            }

            return Ok(restaurant);
        }

        // GET: api/restaurants/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<Restaurant>> GetRestaurantBySlug(string slug)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.Slug == slug);

            if (restaurant == null)
            {
                return NotFound();
            }

            return Ok(restaurant);
        }
    }
}
