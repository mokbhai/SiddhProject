using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Dapper;

namespace IntroDapper;

class Program
{
    static void Main()
    {
        string connectionString = "Server=localhost\\SQLEXPRESS;Database=IntroDapper;Trusted_Connection=True;";

        using (var connection = new SqlConnection(connectionString))
        {
            connection.Open();

            string sqlQuery = "SELECT Id, Name, Email FROM [Users]";
            IEnumerable<User> users = connection.Query<User>(sqlQuery);

            foreach (User user in users)
            {
                Console.WriteLine($"ID: {user.Id}, Name: {user.Name}, Email: {user.Email}");
            }
        }
    }
}
