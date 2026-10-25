using Microsoft.EntityFrameworkCore;
using RestoPlatform.Models;

namespace RestoPlatform.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Restaurant> Restaurants { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Reservation> Reservations { get; set; } = default!;
        public DbSet<Avis> Avis { get; set; }
        public DbSet<PhotoAvis> PhotosAvis { get; set; }
        public DbSet<ReponseAvis> ReponsesAvis { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Statut)
                    .HasDefaultValue("en_attente");

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("GETDATE()");

                // Relations
                entity.HasOne(r => r.Restaurant)
                    .WithMany()
                    .HasForeignKey(r => r.RestaurantId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.Utilisateur)
                    .WithMany()
                    .HasForeignKey(r => r.UtilisateurId)
                    .OnDelete(DeleteBehavior.NoAction);
            });



            // Configuration Avis
            modelBuilder.Entity<Avis>()
                .HasOne(a => a.Restaurant)
                .WithMany()
                .HasForeignKey(a => a.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Avis>()
                .HasOne(a => a.Utilisateur)
                .WithMany()
                .HasForeignKey(a => a.UtilisateurId)
                .OnDelete(DeleteBehavior.Cascade);

            // Un utilisateur ne peut laisser qu'un seul avis par restaurant
            modelBuilder.Entity<Avis>()
                .HasIndex(a => new { a.RestaurantId, a.UtilisateurId })
                .IsUnique();

            // Configuration PhotoAvis
            modelBuilder.Entity<PhotoAvis>()
                .HasOne(p => p.Avis)
                .WithMany(a => a.Photos)
                .HasForeignKey(p => p.AvisId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuration ReponseAvis
            modelBuilder.Entity<ReponseAvis>()
                .HasOne(r => r.Avis)
                .WithMany(a => a.Reponses)
                .HasForeignKey(r => r.AvisId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReponseAvis>()
                .HasOne(r => r.Utilisateur)
                .WithMany()
                .HasForeignKey(r => r.UtilisateurId)
                .OnDelete(DeleteBehavior.NoAction);




            // Mapper vers la table existante "Utilisateurs"
            modelBuilder.Entity<User>()
                .ToTable("Utilisateurs");

            // Index unique sur l'email (déjà créé dans SQL)
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configuration du Role avec valeur par défaut
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasDefaultValue("client");

            // Configuration EstVerifie avec valeur par défaut
            modelBuilder.Entity<User>()
                .Property(u => u.EstVerifie)
                .HasDefaultValue(false);

            // Configuration DateInscription avec valeur par défaut
            modelBuilder.Entity<User>()
                .Property(u => u.DateInscription)
                .HasDefaultValueSql("GETDATE()");
        }
    }
}
