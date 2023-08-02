using System.Text.Json;
using System.Text.Json.Serialization;
using Ecommerce.Api.Options;
using LibraryManagement.API.DBConfig;
using LibraryManagement.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
#region Postgres DbContext
builder.Services.Configure<DatabaseConfig>(builder.Configuration.GetSection(OptionsConst.DATABASE_CONFIG));
builder.Services.AddDbContext<AppDbContext>();
#endregion
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapGet("/Authors/", async ([FromServices]AppDbContext appDbContext) =>
{
    var query = await appDbContext.Authors.ToListAsync();
    return query;
});
app.MapGet("/Users/", async ([FromServices]AppDbContext appDbContext) =>
{
    var query = await appDbContext.Users.ToListAsync();
    return query;
});
app.MapGet("/Books/", async ([FromServices]AppDbContext appDbContext) =>
{

    var query = await appDbContext.Books.Include(x => x.Author)
        //.Select(x => new { x.Id, x.Author.AuthorName, x.BookName, x.AuthorId})
        .ToListAsync();
    return query;
});
app.MapGet("/UserBooks/", async ([FromServices]AppDbContext appDbContext) =>
{
    var query = await appDbContext.UserBooks.ToListAsync();
    return query;
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();