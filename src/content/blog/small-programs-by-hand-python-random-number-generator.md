---
title: "Small Programs by Hand: A Python Random Number Generator GUI"
description: "The first entry in a series on learning programming languages by writing tiny useful programs by hand, beginning with a Python Tkinter GUI."
published: 2026-06-07T19:45:00-05:00
updated: 2026-06-07T19:45:00-05:00
slug: "small-programs-by-hand-python-random-number-generator"
category: "Programming"
tags:
  - Python
  - Tkinter
  - VS Code
  - Small programs
draft: false
featured: true
---

This is the first post in a small experiment: learn programming languages by writing tiny programs by hand.

Not by assembling a whole application framework first. Not by asking an AI to produce a finished thing. Just by opening VS Code, making one source file, typing the code, running it, and understanding what each line is doing.

The program for this first round is a random number generator GUI. It is small enough to fit in one file, but it still teaches useful ideas:

- importing a library
- creating a window
- placing labels, text boxes, and buttons
- converting text into numbers
- handling invalid input
- connecting a button click to a function
- running a graphical program

The first language is Python.

## The Goal

The finished program should let me type a minimum and maximum number, press a button, and see a random number in that range.

That is all. The smallness is the point.

Small programs make the mechanics visible. There is nowhere for the basic ideas to hide.

## Create the File

In VS Code, create a folder for the project. Mine would be something like this:

```text
small-python-random-gui
```

Inside that folder, create one file:

```text
random_gui.py
```

Python filenames usually use lowercase letters and underscores. The `.py` extension tells Python and VS Code that this is a Python source file.

## The Whole Program

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

Run it from the VS Code terminal:

```powershell
python random_gui.py
```

On Windows, this may also work:

```powershell
py random_gui.py
```

If everything is set up correctly, a small window appears with two boxes, a button, and a result label.

## What the Imports Mean

The first three lines bring in code that Python already knows how to use:

```python
import random
import tkinter as tk
from tkinter import messagebox
```

`random` is Python's standard random-number module. We use it for `random.randint()`.

`tkinter` is Python's standard GUI toolkit. The `as tk` part gives it a short nickname, so we can write `tk.Label` instead of `tkinter.Label`.

`messagebox` gives us simple pop-up error messages.

## The Button Function

This function runs whenever the button is clicked:

```python
def generate_number():
    try:
        minimum = int(minimum_entry.get())
        maximum = int(maximum_entry.get())
    except ValueError:
        messagebox.showerror("Invalid input", "Please enter whole numbers.")
        return
```

`minimum_entry.get()` reads the text from the first input box. That text is still text, even if it looks like a number, so `int(...)` converts it into an integer.

If the user types `cat` instead of `12`, Python cannot convert it. That raises a `ValueError`. The `try` and `except` block catches that mistake and shows an error instead of crashing the program.

Then the program checks that the range makes sense:

```python
if minimum > maximum:
    messagebox.showerror("Invalid range", "Minimum must be less than or equal to maximum.")
    return
```

After that, the useful part is only two lines:

```python
number = random.randint(minimum, maximum)
result_label.config(text=f"Random number: {number}")
```

`random.randint(minimum, maximum)` chooses a whole number in the range. The `.config(...)` call changes the label on the screen.

## Building the Window

This line creates the main application window:

```python
window = tk.Tk()
```

Then we give it a title:

```python
window.title("Random Number Generator")
```

The labels, entry boxes, and button are called widgets. Each widget is created first, then placed in the window with `.grid(...)`.

For example:

```python
minimum_label = tk.Label(window, text="Minimum")
minimum_label.grid(row=0, column=0, padx=10, pady=10, sticky="e")
```

That says:

- make a label
- put it in the window
- set its visible text to `Minimum`
- place it in row `0`, column `0`
- add a little padding around it
- align it to the east side of its grid cell

The input box next to it is similar:

```python
minimum_entry = tk.Entry(window, width=12)
minimum_entry.grid(row=0, column=1, padx=10, pady=10)
minimum_entry.insert(0, "1")
```

`insert(0, "1")` puts the default value `1` into the box.

## Connecting the Button

This line is one of the most important:

```python
generate_button = tk.Button(window, text="Generate", command=generate_number)
```

The button says `Generate`. The `command=generate_number` part tells Tkinter what function to run when the button is clicked.

Notice that it is not written as `generate_number()`. The parentheses would run the function immediately. Without parentheses, we are handing the function to Tkinter so Tkinter can call it later.

That distinction matters in many programming languages: sometimes you call a function now, and sometimes you pass the function around so something else can call it later.

## Starting the Program

The final line starts the GUI event loop:

```python
window.mainloop()
```

That loop waits for events: clicks, typing, window movement, closing the window. Without `mainloop()`, the program would create the window and immediately exit.

## What This Teaches

This tiny program is not impressive as software. That is fine. It is useful as a learning object.

It teaches how Python names things, how functions work, how text becomes numbers, how errors are handled, how GUI widgets are created, and how a button triggers code.

The same program can now be rewritten in other languages:

- C#
- C++
- C
- JavaScript
- Java
- maybe more

The goal is not to memorize every library. The goal is to see the same small idea through different languages until the similarities and differences become obvious.

Python starts gently. That makes it a good first language for the series.

The next step is to make the same small thing somewhere less forgiving.
