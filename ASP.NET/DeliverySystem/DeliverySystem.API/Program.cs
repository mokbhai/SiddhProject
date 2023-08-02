using DeliverySystem.API.DbConfig;
using DeliverySystem.API.Interfaces.Repository;
using DeliverySystem.API.Interfaces.Service;
using DeliverySystem.API.Repositories;
using DeliverySystem.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddDbContext<DeliverySystemDbContext>();

#region Service
builder.Services.AddTransient<IOrderService, OrderService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IPaymentService, PaymentService>();
#endregion

#region Repository
builder.Services.AddTransient<IOrderRepository, OrderRepository>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IPaymentRepository, PaymentRepository>();
#endregion

var app = builder.Build();

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
