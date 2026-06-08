---
title: "Small Programs by Hand: A Python Random Number Generator GUI"
description: "The first entry in a series on learning programming languages by writing tiny useful programs by hand, beginning with Python console input and a Tkinter GUI."
published: "2026-06-07T19:45:00-05:00"
slug: "small-programs-by-hand-python-random-number-generator"
category: "Programming"
tags:
  - Python
  - Tkinter
  - VS Code
  - Small programs
draft: false
featured: true
aiAssisted: true
aiDisclosure: "This post was drafted with AI assistance and reviewed before publication."
---

This is the first post in a small experiment: learn programming languages by writing tiny programs by hand.

Not by assembling a whole application framework first. Not by asking an AI to produce a finished thing. Just by opening VS Code, making one small program, running it, and understanding what each line is doing.

The shared program for the series is a random number generator. Each language version now has the same shape:

- the core technologies involved
- a console or text version
- a GUI or graphical version

That gives the series a useful rhythm. First we learn how the language thinks. Then we make the same idea visible on the screen.

## The Core Technologies

Python is an interpreted, high-level language. For a tiny program, that means the setup is wonderfully direct: write a `.py` file, run it with Python, and read the result.

This post uses two pieces of Python's standard library:

- `random`, for generating pseudo-random numbers
- `tkinter`, for building a small desktop GUI

The console version uses `input()` to read text from the terminal and `print()` to write text back.

The GUI version uses Tkinter widgets:

- `Tk`, the main application window
- `Label`, visible text
- `Entry`, a one-line text box
- `Button`, a clickable button
- `messagebox`, a simple pop-up error dialog

Python is a gentle first stop because both versions can fit in one file without adding dependencies.

## The Console Version

Create a folder:

```text
small-python-random-console
```

Inside that folder, create one file:

```text
random_console.py
```

Here is the complete program:

```python
import random


def read_whole_number(prompt):
    while True:
        text = input(prompt)

        try:
            return int(text)
        except ValueError:
            print("Please enter a whole number.")


minimum = read_whole_number("Minimum: ")
maximum = read_whole_number("Maximum: ")

if minimum > maximum:
    print("Minimum must be less than or equal to maximum.")
else:
    number = random.randint(minimum, maximum)
    print(f"Random number: {number}")
```

Run it from the VS Code terminal:

```powershell
python random_console.py
```

On Windows, this may also work:

```powershell
py random_console.py
```

The helper function keeps asking until the user gives a whole number:

```python
def read_whole_number(prompt):
    while True:
        text = input(prompt)
```

`input(prompt)` prints the prompt and waits for the user to type a line.

The conversion happens here:

```python
return int(text)
```

If the user types `12`, `int(text)` returns the integer `12`.

If the user types `cat`, Python raises a `ValueError`. The `except` block catches that mistake and lets the loop continue:

```python
except ValueError:
    print("Please enter a whole number.")
```

Once the program has two numbers, the random part is only one line:

```python
number = random.randint(minimum, maximum)
```

`randint` includes both ends of the range, so `random.randint(1, 100)` can return `1` or `100`.

## The GUI Version

Now make the same idea visible.

Create another file:

```text
random_gui.py
```

Here is the complete program:

```python
import random
import tkinter as tk
from tkinter import messagebox


def generate_number():
    try:
        minimum = int(minimum_entry.get())
        maximum = int(maximum_entry.get())
    except ValueError:
        messagebox.showerror("Invalid input", "Please enter whole numbers.")
        return

    if minimum > maximum:
        messagebox.showerror("Invalid range", "Minimum must be less than or equal to maximum.")
        return

    number = random.randint(minimum, maximum)
    result_label.config(text=f"Random number: {number}")


window = tk.Tk()
window.title("Random Number Generator")
window.resizable(False, False)

minimum_label = tk.Label(window, text="Minimum")
minimum_label.grid(row=0, column=0, padx=10, pady=10, sticky="e")

minimum_entry = tk.Entry(window, width=12)
minimum_entry.grid(row=0, column=1, padx=10, pady=10)
minimum_entry.insert(0, "1")

maximum_label = tk.Label(window, text="Maximum")
maximum_label.grid(row=1, column=0, padx=10, pady=10, sticky="e")

maximum_entry = tk.Entry(window, width=12)
maximum_entry.grid(row=1, column=1, padx=10, pady=10)
maximum_entry.insert(0, "100")

generate_button = tk.Button(window, text="Generate", command=generate_number)
generate_button.grid(row=2, column=0, columnspan=2, padx=10, pady=10)

result_label = tk.Label(window, text="Random number: -")
result_label.grid(row=3, column=0, columnspan=2, padx=10, pady=10)

window.mainloop()
```

Run it:

```powershell
python random_gui.py
```

The window begins here:

```python
window = tk.Tk()
```

The visible pieces are widgets. Each widget is created, then placed with `.grid(...)`.

For example:

```python
minimum_entry = tk.Entry(window, width=12)
minimum_entry.grid(row=0, column=1, padx=10, pady=10)
minimum_entry.insert(0, "1")
```

That creates a text box, places it in row `0`, column `1`, and puts the default value `1` inside it.

The most important GUI line is the button:

```python
generate_button = tk.Button(window, text="Generate", command=generate_number)
```

`command=generate_number` tells Tkinter which function to run when the button is clicked.

Notice that it is not `generate_number()`. Parentheses would call the function immediately. Without parentheses, we hand the function to Tkinter so Tkinter can call it later.

Finally, this line starts the event loop:

```python
window.mainloop()
```

The event loop waits for clicks, typing, redraws, and the close button. A GUI program is not a straight line in the same way the console version is. It mostly waits, then reacts.

## The Shape Of The Lesson

The console version shows Python's basic flow: read text, convert it, validate it, print a result.

The GUI version keeps the same logic but moves the input and output into widgets. The program is no longer only about values. It is also about events.

That is the first big lesson of the series: the language matters, but so does the surface where the program lives.

The same program can now be rewritten in other languages:

- C
- C++
- D
- C#
- JavaScript
- Rust

The goal is not to memorize every library. The goal is to see the same small idea through different languages until the similarities and differences become obvious.
