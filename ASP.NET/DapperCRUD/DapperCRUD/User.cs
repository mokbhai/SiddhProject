using System;

namespace IntroDapper;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string Email { get; set; } = default!;
}
