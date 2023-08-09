using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntroDapper;

internal class User
{
    public int Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string Email { get; set; } = default!;
}
