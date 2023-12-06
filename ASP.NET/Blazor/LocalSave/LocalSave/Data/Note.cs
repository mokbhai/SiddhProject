using System;
namespace LocalSave.Data;

public class Note : BaseEntity
{
    public string Text { get; set; } = default!;
    public ImportanceEnum Importance { get; set; }
}

public enum  ImportanceEnum
{
    UI, UNI, NUI, NUNI
}