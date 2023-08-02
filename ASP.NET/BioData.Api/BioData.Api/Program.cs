using System;
using System.IO;
using CsvHelper;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace CSVtoPDFConverter
{
    class Program
    {
        static void Main(string[] args)
        {
            // Path to the input CSV file
            string csvFilePath = "/home/mok/Music/BioData.csv";

            // Create a PDF directory to save the generated PDF files
            string pdfDirectory = "PDFs";
            Directory.CreateDirectory(pdfDirectory);

            using (var reader = new StreamReader(csvFilePath))
            using (var csv = new CsvReader(reader, System.Globalization.CultureInfo.CurrentCulture))
            {
                csv.Read(); // Read the header row
                csv.ReadHeader();

                // Get the index of each column based on the header names
                int fileNameIndex = csv.GetFieldIndex("File Name");
                int nameIndex = csv.GetFieldIndex("Name");
                int dobIndex = csv.GetFieldIndex("Date Of Birth");

                while (csv.Read())
                {
                    // Get the data for each person
                    string fileName = csv.GetField(fileNameIndex);
                    string name = csv.GetField(nameIndex);
                    string dob = csv.GetField(dobIndex);

                    // Create a new PDF document
                    Document document = new Document();
                    string pdfFilePath = Path.Combine(pdfDirectory, $"/home/mok/Music/{fileName}.pdf");
                    PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(pdfFilePath, FileMode.Create));

                    document.Open();

                    // Add the person's data to the PDF document
                    Paragraph paragraph = new Paragraph();
                    paragraph.Add(new Chunk($"Name: {name}\n"));
                    paragraph.Add(new Chunk($"Date of Birth: {dob}"));

                    document.Add(paragraph);

                    document.Close();
                    writer.Close();

                    Console.WriteLine($"PDF file generated for {name}.");
                }
            }

            Console.WriteLine("Conversion complete. Press any key to exit.");
            Console.ReadKey();
        }
    }
}
