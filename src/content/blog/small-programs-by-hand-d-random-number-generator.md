---
title: "Small Programs by Hand: A D Random Number Generator"
description: "A D language version of the small random number generator, moving from Phobos console code to a GtkD graphical version."
published: "2026-06-07T20:45:00-05:00"
slug: "small-programs-by-hand-d-random-number-generator"
category: "Programming"
tags:
  - D
  - VS Code
  - Small programs
draft: false
featured: false
aiAssisted: true
aiDisclosure: "This post was drafted with AI assistance and reviewed before publication."
---

D is an interesting stop in this series because it looks familiar and unfamiliar at the same time.

The braces, semicolons, and explicit types feel close to C and C++. But D's standard library, Phobos, gives us friendlier strings, conversion, modules, exceptions, and a compact random-number function.

The shared program is still the same: ask for a minimum, ask for a maximum, then produce a random whole number in that range.

## The Core Technologies

D source files use the `.d` extension. A simple D program can be compiled directly with `dmd` or `ldc2`.

The console version uses Phobos modules:

- `std.stdio`, for `readln`, `write`, and `writeln`
- `std.string`, for `strip`
- `std.conv`, for `to!int` and `ConvException`
- `std.random`, for `uniform`

D has a package manager called DUB. For the GUI version, we use DUB because D does not include a standard GUI toolkit.

The graphical version uses GtkD:

- `MainWindow`, for the application window
- `Grid`, for layout
- `Entry`, for one-line input boxes
- `Button`, for the clickable action
- `Label`, for visible text and the result

GtkD is a D binding and object-oriented wrapper around GTK. It is not part of the D standard library, and on Windows it also requires GTK runtime libraries. That setup cost is part of the lesson: D is pleasant in the middle, but GUI work depends on the ecosystem you choose.

## The Console Version

Create a folder:

```text
small-d-random-console
```

Inside it, create one file:

```text
random_console.d
```

Here is the complete program:

```d
import std.conv : ConvException, to;
import std.random : uniform;
import std.stdio : readln, write, writeln;
import std.string : strip;

int readWholeNumber(string prompt)
{
    while (true) {
        write(prompt);
        string line = readln();

        try {
            return to!int(strip(line));
        } catch (ConvException) {
            writeln("Please enter a whole number.");
        }
    }
}

void main()
{
    int minimum = readWholeNumber("Minimum: ");
    int maximum = readWholeNumber("Maximum: ");

    if (minimum > maximum) {
        writeln("Minimum must be less than or equal to maximum.");
        return;
    }

    int number = uniform!"[]"(minimum, maximum);

    writeln("Random number: ", number);
}
```

With DMD:

```powershell
dmd random_console.d
.\random_console.exe
```

With LDC:

```powershell
ldc2 random_console.d
.\random_console.exe
```

The input helper returns an `int` directly:

```d
int readWholeNumber(string prompt)
```

The conversion line is compact:

```d
return to!int(strip(line));
```

`strip(line)` removes whitespace. `to!int(...)` converts the text to an integer.

If conversion fails, D throws a `ConvException`, and the loop asks again:

```d
catch (ConvException) {
    writeln("Please enter a whole number.");
}
```

The random line is one of the nicest details:

```d
int number = uniform!"[]"(minimum, maximum);
```

The `"[]"` part means both endpoints are included. If the user enters `1` and `100`, both `1` and `100` are possible answers.

## The GUI Version

For the graphical version, create a DUB project:

```powershell
dub init small-d-random-gui
cd small-d-random-gui
```

Edit `dub.json` so it includes GtkD:

```json
{
  "dependencies": {
    "gtk-d": "~>3.10.0"
  },
  "description": "A tiny GtkD random number generator.",
  "license": "MIT",
  "name": "small-d-random-gui"
}
```

Then replace `source/app.d` with this:

```d
import std.conv : ConvException, to;
import std.random : uniform;
import std.string : strip;

import gtk.Button;
import gtk.Entry;
import gtk.Grid;
import gtk.Label;
import gtk.Main;
import gtk.MainWindow;
import gtk.Widget;

void main(string[] args)
{
    Main.init(args);

    auto window = new MainWindow("Random Number Generator");
    window.setDefaultSize(320, 180);
    window.addOnDestroy(delegate void(Widget widget) {
        Main.quit();
    });

    auto grid = new Grid();
    grid.setBorderWidth(12);
    grid.setColumnSpacing(8);
    grid.setRowSpacing(8);

    auto minimumEntry = new Entry("1");
    auto maximumEntry = new Entry("100");
    auto resultLabel = new Label("Random number: -");
    auto button = new Button("Generate");

    grid.attach(new Label("Minimum"), 0, 0, 1, 1);
    grid.attach(minimumEntry, 1, 0, 1, 1);
    grid.attach(new Label("Maximum"), 0, 1, 1, 1);
    grid.attach(maximumEntry, 1, 1, 1, 1);
    grid.attach(button, 0, 2, 2, 1);
    grid.attach(resultLabel, 0, 3, 2, 1);

    button.addOnClicked(delegate void(Button clickedButton) {
        int minimum;
        int maximum;

        try {
            minimum = to!int(strip(minimumEntry.getText()));
            maximum = to!int(strip(maximumEntry.getText()));
        } catch (ConvException) {
            resultLabel.setText("Please enter whole numbers.");
            return;
        }

        if (minimum > maximum) {
            resultLabel.setText("Minimum must be less than or equal to maximum.");
            return;
        }

        int number = uniform!"[]"(minimum, maximum);
        resultLabel.setText("Random number: " ~ to!string(number));
    });

    window.add(grid);
    window.showAll();
    Main.run();
}
```

Run it:

```powershell
dub run
```

The GUI code is still D, but it is now also GTK code.

The layout is a grid:

```d
auto grid = new Grid();
grid.attach(new Label("Minimum"), 0, 0, 1, 1);
```

The button receives a callback:

```d
button.addOnClicked(delegate void(Button clickedButton) {
```

That callback contains almost the same logic as the console version: read text, convert it, validate the range, generate the number, show the result.

The event loop is here:

```d
Main.run();
```

Like every GUI toolkit, GTK spends most of its time waiting for events and dispatching callbacks.

## The Shape Of The Lesson

D feels much friendlier than C for the console version. Strings are strings, conversion has a clear form, and the standard random function can directly express an inclusive range.

The GUI version tells a different story. The language may be comfortable, but desktop GUI work still depends on the surrounding ecosystem.

That makes D a useful reminder: a language can have a lovely core and still need help at the edges.
