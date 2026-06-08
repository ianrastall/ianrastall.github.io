---
title: "Small Programs by Hand: A C# Random Number Generator"
description: "A C# version of the small random number generator, moving from a .NET console app to a small Windows Forms GUI."
published: "2026-06-07T21:05:00-05:00"
slug: "small-programs-by-hand-csharp-random-number-generator"
category: "Programming"
tags:
  - C#
  - .NET
  - VS Code
  - Small programs
draft: false
featured: false
aiAssisted: true
aiDisclosure: "This post was drafted with AI assistance and reviewed before publication."
---

C# is a comfortable place to write this small program because the language gives us structure without making the first version feel huge.

The shared program is the same: ask for a minimum, ask for a maximum, then produce a random whole number in that range.

In C#, we can do that first as a console app and then as a small Windows Forms app. Both versions use the same basic validation and random-number idea.

## The Core Technologies

C# usually travels with .NET. For this post, that means we use the `dotnet` command to create and run projects.

The console version uses:

- top-level statements, so the file can start with ordinary code
- `Console.ReadLine()`, for terminal input
- `int.TryParse()`, for safe conversion
- `Random.Shared.NextInt64(...)`, for random numbers

The GUI version uses Windows Forms:

- `Form`, for the window
- `Label`, for visible text
- `NumericUpDown`, for number entry
- `Button`, for the action
- a `Click` event handler, for the button behavior

Windows Forms is Windows-specific, but it is still a useful first GUI step for C# because it is direct, mature, and easy to understand in one file.

## The Console Version

Create a console project:

```powershell
dotnet new console -n SmallCSharpRandomConsole
cd SmallCSharpRandomConsole
```

Open `Program.cs` and replace its contents with this:

```csharp
int minimum = ReadWholeNumber("Minimum: ");
int maximum = ReadWholeNumber("Maximum: ");

if (minimum > maximum)
{
    Console.WriteLine("Minimum must be less than or equal to maximum.");
    return;
}

long number = Random.Shared.NextInt64(minimum, (long)maximum + 1);

Console.WriteLine($"Random number: {number}");

static int ReadWholeNumber(string prompt)
{
    while (true)
    {
        Console.Write(prompt);
        string? text = Console.ReadLine();

        if (int.TryParse(text, out int value))
        {
            return value;
        }

        Console.WriteLine("Please enter a whole number.");
    }
}
```

Run it:

```powershell
dotnet run
```

The program begins with top-level statements:

```csharp
int minimum = ReadWholeNumber("Minimum: ");
```

The compiler still creates an entry point behind the scenes, but we do not have to write a `Program` class and `Main` method for this tiny example.

The input helper uses nullable text:

```csharp
string? text = Console.ReadLine();
```

The question mark means `text` might be a string or it might be `null`. C# asks us to admit that input can fail.

The conversion is safe:

```csharp
if (int.TryParse(text, out int value))
```

If parsing works, `value` contains the integer. If parsing fails, the program asks again.

The random line uses an exclusive upper bound:

```csharp
long number = Random.Shared.NextInt64(minimum, (long)maximum + 1);
```

`minimum` is included. The upper argument is excluded. Adding `1` to the user's maximum makes the user's maximum possible.

## The GUI Version

Now create a Windows Forms project:

```powershell
dotnet new winforms -n SmallCSharpRandomGui
cd SmallCSharpRandomGui
```

Open `Program.cs` and replace it with this:

```csharp
using System.Drawing;
using System.Windows.Forms;

ApplicationConfiguration.Initialize();
Application.Run(new RandomNumberForm());

public sealed class RandomNumberForm : Form
{
    private readonly NumericUpDown minimumBox = new()
    {
        Minimum = int.MinValue,
        Maximum = int.MaxValue,
        Value = 1,
        Location = new Point(110, 20),
        Width = 140
    };

    private readonly NumericUpDown maximumBox = new()
    {
        Minimum = int.MinValue,
        Maximum = int.MaxValue,
        Value = 100,
        Location = new Point(110, 60),
        Width = 140
    };

    private readonly Label resultLabel = new()
    {
        Text = "Random number: -",
        AutoSize = true,
        Location = new Point(20, 145)
    };

    public RandomNumberForm()
    {
        Text = "Random Number Generator";
        ClientSize = new Size(290, 185);
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;
        StartPosition = FormStartPosition.CenterScreen;

        Label minimumLabel = new()
        {
            Text = "Minimum",
            AutoSize = true,
            Location = new Point(20, 24)
        };

        Label maximumLabel = new()
        {
            Text = "Maximum",
            AutoSize = true,
            Location = new Point(20, 64)
        };

        Button generateButton = new()
        {
            Text = "Generate",
            Location = new Point(20, 105),
            Size = new Size(230, 30)
        };

        generateButton.Click += GenerateNumber;
        AcceptButton = generateButton;

        Controls.AddRange(new Control[]
        {
            minimumLabel,
            minimumBox,
            maximumLabel,
            maximumBox,
            generateButton,
            resultLabel
        });
    }

    private void GenerateNumber(object? sender, EventArgs e)
    {
        int minimum = (int)minimumBox.Value;
        int maximum = (int)maximumBox.Value;

        if (minimum > maximum)
        {
            resultLabel.Text = "Minimum must be less than or equal to maximum.";
            return;
        }

        long number = Random.Shared.NextInt64(minimum, (long)maximum + 1);
        resultLabel.Text = $"Random number: {number}";
    }
}
```

Run it:

```powershell
dotnet run
```

The program starts the WinForms application:

```csharp
ApplicationConfiguration.Initialize();
Application.Run(new RandomNumberForm());
```

The form is a class:

```csharp
public sealed class RandomNumberForm : Form
```

Controls are objects with properties:

```csharp
private readonly NumericUpDown minimumBox = new()
{
    Minimum = int.MinValue,
    Maximum = int.MaxValue,
    Value = 1
};
```

The button click is an event:

```csharp
generateButton.Click += GenerateNumber;
```

That line connects the button to the `GenerateNumber` method. The method contains the same logic as the console version, but it reads values from controls and writes the answer into a label.

## The Shape Of The Lesson

C# makes the console version tidy. It also makes the GUI version readable because controls are ordinary objects and events are ordinary language-level concepts.

The biggest difference is not the random number. It is the shape of control flow.

The console version runs top to bottom. The GUI version starts a message loop, waits for the user, and runs `GenerateNumber` only when the button is clicked.
