// using System;
// using System.IO;
// using System.Linq;
// using CsvHelper;
// using iTextSharp.text;
// using iTextSharp.text.pdf;
//
// namespace CSVtoPDFConverter;
//
// class Program
// {
//     static void Main(string[] args)
//     {
//         // Console.WriteLine("Enter the path to the CSV file:");
//         // string csvPath = Console.ReadLine();
//         string csvPath = "/home/mok/Music/BioData.csv";
//
//         using (var reader = new StreamReader(csvPath))
//         using (var csv = new CsvReader(reader, System.Globalization.CultureInfo.CurrentCulture))
//         {
//             var records = csv.GetRecords<Person>();
//
//             foreach (var person in records)
//             {
//                 string pdfPath = $"/home/mok/Music/Pdfs/{person.FileName}.pdf";
//                 using (var document = new Document())
//                 {
//                     PdfWriter.GetInstance(document, new FileStream(pdfPath, FileMode.Create));
//                     document.Open();
//                     document.Add(new Paragraph($"Name: {person.Name}"));
//                     document.Add(new Paragraph($"Age: {person.Age}"));
//                     // document.Add(new Paragraph($"Age: {person.EmailAddress}"));
//                     // document.Add(new Paragraph($"Age: {person.Address}"));
//                     // document.Add(new Paragraph($"Age: {person.PhoneNum}"));
//                     document.Close();
//                 }
//             }
//         }
//
//         Console.WriteLine("PDFs created successfully!");
//         Console.ReadLine();
//     }
// }
//
// public class Person
// {
//     // public string Timestamp { get; set; }
//     // public string EmailAddress { get; set; }
//     public string FileName { get; set; } = default!;
//     public string Name { get; set; } = default!;
//     public int Age { get; set; } = default!;
//     // Add other fields as needed
// }
//
// public sealed class PersonMap : CsvHelper.Configuration.ClassMap<Person>
// {
//     public PersonMap()
//     {
//         Map(m => m.Age).Name("Age000");
//         // Map other fields as needed
//     }
// }