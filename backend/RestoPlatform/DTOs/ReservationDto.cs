namespace RestoPlatform.DTOs
{
    public class CreateReservationDto
    {
        public int RestaurantId { get; set; }
        public string DateReservation { get; set; } = default!;
        public string HeureReservation { get; set; } = default!;
        public int NombrePersonnes { get; set; }
        public string NomContact { get; set; } = default!;
        public string TelephoneContact { get; set; } = default!;
        public string EmailContact { get; set; } = default!;
        public string? Commentaire { get; set; }
    }

    public class ReservationResponseDto
    {
        public int Id { get; set; }
        public string RestaurantNom { get; set; } = default!;
        public DateTime DateReservation { get; set; }
        public TimeSpan HeureReservation { get; set; }
        public int NombrePersonnes { get; set; }
        public string NomContact { get; set; } = default!;
        public string Statut { get; set; } = default!;
        public string CodeConfirmation { get; set; } = default!;
        public string Message { get; set; } = default!;
    }
}
