using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.API.Entities;

public record BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; } = default!;
}
public record Book : BaseEntity
{
    public int AuthorId { get; set; } = default!;
    public string BookName { get; set; } = default!;
    //[ForeignKey("AuthorId")]
    public virtual Author Author { get; set; } = default!;
    public ICollection<UserBook> UserBooks { get; set; } = default!;
}

public record Author : BaseEntity
{
    public string AuthorName { get; set; } = default!;
    public ICollection<Book> Books { get; set; } = default!;
}

public record User : BaseEntity
{
    public string UserName { get; set; } = default!;
    public ICollection<UserBook> UserBooks { get; set; } = default!;
}

public record UserBook : BaseEntity
{
    [ForeignKey("Book")]
    public int BookId { get; set; } = default!;
    [ForeignKey("User")]
    public int UserId { get; set; } = default!;
    public DateTime IssueDate { get; set; } = default!;
    public bool IsReturned { get; set; } = default!;
    public virtual Book Book { get; set; } = default!;
    public virtual User User { get; set; } = default!;
}