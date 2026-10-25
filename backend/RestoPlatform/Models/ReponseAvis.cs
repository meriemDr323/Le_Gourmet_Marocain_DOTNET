using System;
namespace RestoPlatform.Models

public class ReponseAvis
{
	[Key]
	public int Id { get; set; }

	[Required]
	public int AvisId { get; set; }

	[Required]
	public int UtilisateurId { get; set; }

	[Required]
	public string Contenu { get; set; } = string.Empty;

	public DateTime CreatedAt { get; set; } = DateTime.Now;

	// Navigation properties
	[ForeignKey("AvisId")]
	public Avis Avis { get; set; } = null!;

	[ForeignKey("UtilisateurId")]
	public User Utilisateur { get; set; } = null!;
}
}