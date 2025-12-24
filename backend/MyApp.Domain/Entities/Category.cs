using MyApp.Domain.Exceptions;

public class Category
{
    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public bool IsLocked { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Category() { } 

    public Category(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new SecurityViolationException("Invalid category name");

        Name = name.Trim();
        IsLocked = false;
        CreatedAt = DateTime.UtcNow; 
    }

    public void Lock() => IsLocked = true;
}

