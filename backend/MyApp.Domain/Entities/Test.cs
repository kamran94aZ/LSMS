using MyApp.Domain.Exceptions;

namespace MyApp.Domain.Entities;

public class Test
{
    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public int CategoryId { get; private set; }
    public bool IsLocked { get; private set; }

    private Test() { } 

    public Test(string name, int categoryId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new SecurityViolationException("Invalid name");

        Name = name.Trim();
        CategoryId = categoryId;
        IsLocked = false;
    }

    public void Lock() => IsLocked = true;
}
