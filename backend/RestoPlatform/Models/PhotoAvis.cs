using System;
namespace RestoPlatform.Models



public class PhotoAvis
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AvisId { get; set; }

    [Required]
    [MaxLength(255)]
    public string Url { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Legende { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navigation property
    [ForeignKey("AvisId")]
    public Avis Avis { get; set; } = null!;
}
