using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestoPlatform.Migrations
{
    /// <inheritdoc />
    public partial class AddReservations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Restaurants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProprietaireId = table.Column<int>(type: "int", nullable: true),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ville = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CodePostal = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Quartier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SiteWeb = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeCuisine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Specialites = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrixMoyen = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NoteMoyenne = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NombreAvis = table.Column<int>(type: "int", nullable: false),
                    ImagePrincipale = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageCouverture = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageMenu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Horaires = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Capacite = table.Column<int>(type: "int", nullable: true),
                    Parking = table.Column<bool>(type: "bit", nullable: false),
                    Wifi = table.Column<bool>(type: "bit", nullable: false),
                    Terrasse = table.Column<bool>(type: "bit", nullable: false),
                    Climatisation = table.Column<bool>(type: "bit", nullable: false),
                    ReservationEnLigne = table.Column<bool>(type: "bit", nullable: false),
                    Livraison = table.Column<bool>(type: "bit", nullable: false),
                    AEmporter = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Restaurants", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MotDePasse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhotoProfil = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "client"),
                    EstVerifie = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DateInscription = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    DerniereConnexion = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RestaurantId = table.Column<int>(type: "int", nullable: false),
                    UtilisateurId = table.Column<int>(type: "int", nullable: false),
                    DateReservation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HeureReservation = table.Column<TimeSpan>(type: "time", nullable: false),
                    NombrePersonnes = table.Column<int>(type: "int", nullable: false),
                    NomContact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TelephoneContact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmailContact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commentaire = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "en_attente"),
                    CodeConfirmation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reservations_Restaurants_RestaurantId",
                        column: x => x.RestaurantId,
                        principalTable: "Restaurants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservations_Utilisateurs_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_RestaurantId",
                table: "Reservations",
                column: "RestaurantId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_UtilisateurId",
                table: "Reservations",
                column: "UtilisateurId");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Email",
                table: "Utilisateurs",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "Restaurants");

            migrationBuilder.DropTable(
                name: "Utilisateurs");
        }
    }
}
