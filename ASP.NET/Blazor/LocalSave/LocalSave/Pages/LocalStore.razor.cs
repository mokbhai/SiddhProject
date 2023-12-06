using System;
using Blazored.LocalStorage;
using LocalSave.Data;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace LocalSave.Pages;

public partial class  LocalStore
{
    #region ctor

    [Inject]
    private ILocalStorageService LocalStorage { get; set; } = default!;

    private string inputValue = "";

    private ImportanceEnum selectedImportance { get; set; }

    private List<Note> notes = new List<Note>();
    private List<string> keys = new List<string>();

    #endregion

    #region Store

    private void StoreNote()
    {
        if (!string.IsNullOrWhiteSpace(inputValue))
        {
            var key = Guid.NewGuid().ToString();
            var note = new Note {
                Id = key, Text = inputValue, Importance = selectedImportance,
                CreatedAtUtc = DateTime.UtcNow, CreatedBy = "Admin",
                UpdatedAtUtc = DateTime.UtcNow, Updatedby = "Admin",
                IsDeleted = false
            };
            //notes.Add(note);
            LocalStorage.SetItemAsync(key, note);
            inputValue = string.Empty;
        }
    }
    private void StoreNoteOnEnter(KeyboardEventArgs e)
    {
        if (e.Key == "Enter")
        {
            StoreNote();
        }
    }

    #endregion

    #region RetriveData

    private async Task RetrieveNotes()
    {
        try
        {
            keys = (await LocalStorage.KeysAsync()).Where(k => k != "notes_").ToList();
            notes.Clear();

            foreach (var key in keys)
            {
                var note = await LocalStorage.GetItemAsync<Note>(key);
                notes.Add(note);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error Retriving item: {ex.Message}");

        }

    }

    #endregion

    #region Delete

    private async Task DeleteNoteByKey(string key)
    {
        try
        {
            await LocalStorage.RemoveItemAsync(key);
            notes.RemoveAll(n => n.Id == key);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error Deleting item: {ex.Message}");
        }
    }

    private async Task DeleteAllNotes()
    {
        try
        {
            keys = (await LocalStorage.KeysAsync()).Where(k => k != "notes_").ToList();
            notes.Clear();

            foreach (var key in keys)
            {
                await DeleteNoteByKey(key);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error Deleting items: {ex.Message}");
        }

    }

    #endregion

    private void OnImportanceChange(ChangeEventArgs e)
    {
        if (Enum.TryParse<ImportanceEnum>(e.Value?.ToString(), out var selectedValue))
        {
            selectedImportance = selectedValue;
        }
    }
}

