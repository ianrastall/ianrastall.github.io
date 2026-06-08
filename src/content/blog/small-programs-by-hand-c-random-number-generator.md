---
title: "Small Programs by Hand: A C Random Number Generator"
description: "A beginner-friendly C version of the small random number generator, moving from standard-library console input to a Windows-native GUI."
published: "2026-06-07T20:05:00-05:00"
slug: "small-programs-by-hand-c-random-number-generator"
category: "Programming"
tags:
  - C
  - VS Code
  - Small programs
draft: false
featured: false
aiAssisted: true
aiDisclosure: "This post was drafted with AI assistance and reviewed before publication."
---

C is a different kind of teacher from Python.

Python lets us think about the program almost immediately. C makes us notice the floorboards: memory, buffers, conversion, return codes, platform APIs, and the fact that a graphical interface is not part of the language.

The shared program is still small. Ask for a minimum, ask for a maximum, then produce a random whole number in that range.

## The Core Technologies

C gives us a language and a standard library. The standard library includes terminal input and output, text conversion, time, and a simple pseudo-random number function.

For the console version, this post uses:

- `stdio.h`, for `printf()` and `fgets()`
- `stdlib.h`, for `strtol()`, `srand()`, and `rand()`
- `time.h`, for `time()`
- `errno.h` and `limits.h`, for safer number conversion

C does not include a standard GUI toolkit. That is an important lesson by itself. If we want a graphical program, we have to choose a platform or a third-party library.

For the GUI version here, the platform is Windows and the toolkit is Win32:

- `CreateWindowExA`, to create the window and controls
- `GetWindowTextA`, to read text from edit boxes
- `SetWindowTextA`, to update the result label
- a window procedure, to receive messages
- a message loop, to keep the GUI alive

That sounds like a lot because it is. C does not hide the windowing system from us.

## The Console Version

Create a folder:

```text
small-c-random-console
```

Inside it, create one file:

```text
random_console.c
```

Here is the complete program:

```c
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int read_whole_number(const char *prompt, int *value)
{
    char line[100];
    char *end = NULL;
    long number;

    printf("%s", prompt);

    if (fgets(line, sizeof line, stdin) == NULL) {
        return 0;
    }

    errno = 0;
    number = strtol(line, &end, 10);

    if (end == line || errno == ERANGE || number < INT_MIN || number > INT_MAX) {
        return 0;
    }

    while (*end == ' ' || *end == '\t' || *end == '\n') {
        end++;
    }

    if (*end != '\0') {
        return 0;
    }

    *value = (int)number;
    return 1;
}

int main(void)
{
    int minimum;
    int maximum;

    if (!read_whole_number("Minimum: ", &minimum)) {
        printf("Please enter a whole number.\n");
        return 1;
    }

    if (!read_whole_number("Maximum: ", &maximum)) {
        printf("Please enter a whole number.\n");
        return 1;
    }

    if (minimum > maximum) {
        printf("Minimum must be less than or equal to maximum.\n");
        return 1;
    }

    srand((unsigned int)time(NULL));

    long long span = (long long)maximum - (long long)minimum + 1;
    int number = minimum + (int)(rand() % span);

    printf("Random number: %d\n", number);
    return 0;
}
```

With GCC:

```powershell
gcc random_console.c -o random_console
.\random_console.exe
```

With Microsoft's compiler from a Developer PowerShell:

```powershell
cl random_console.c
.\random_console.exe
```

The most C-shaped part is the input function:

```c
int read_whole_number(const char *prompt, int *value)
```

The function returns `1` for success or `0` for failure. The actual number comes back through `int *value`, which is a pointer to the caller's variable.

This line reads text into a fixed-size buffer:

```c
fgets(line, sizeof line, stdin)
```

This line converts the text:

```c
number = strtol(line, &end, 10);
```

`strtol()` gives us more information than `atoi()`. We can tell whether conversion failed, whether the number overflowed, and whether extra junk was left after the number.

The random line is intentionally simple:

```c
int number = minimum + (int)(rand() % span);
```

For a tiny learning program, this is acceptable. It is not the right technique for cryptography, gambling, simulation, or statistical work.

## The GUI Version

Now we build the same tool as a small native Windows program.

Create another file:

```text
random_gui.c
```

Here is the complete program:

```c
#define WIN32_LEAN_AND_MEAN

#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>

#define ID_GENERATE 100

static HWND minimum_box;
static HWND maximum_box;
static HWND result_label;

static int read_box(HWND box, int *value)
{
    char text[64];
    char *end = NULL;
    long number;

    GetWindowTextA(box, text, sizeof text);

    errno = 0;
    number = strtol(text, &end, 10);

    if (end == text || errno == ERANGE || number < INT_MIN || number > INT_MAX) {
        return 0;
    }

    while (*end == ' ' || *end == '\t') {
        end++;
    }

    if (*end != '\0') {
        return 0;
    }

    *value = (int)number;
    return 1;
}

static void generate_number(HWND window)
{
    int minimum;
    int maximum;
    char message[80];

    if (!read_box(minimum_box, &minimum) || !read_box(maximum_box, &maximum)) {
        MessageBoxA(window, "Please enter whole numbers.", "Invalid input", MB_OK | MB_ICONERROR);
        return;
    }

    if (minimum > maximum) {
        MessageBoxA(window, "Minimum must be less than or equal to maximum.", "Invalid range", MB_OK | MB_ICONERROR);
        return;
    }

    long long span = (long long)maximum - (long long)minimum + 1;
    int number = minimum + (int)(rand() % span);

    snprintf(message, sizeof message, "Random number: %d", number);
    SetWindowTextA(result_label, message);
}

static LRESULT CALLBACK window_proc(HWND window, UINT message, WPARAM wparam, LPARAM lparam)
{
    switch (message) {
    case WM_CREATE:
        CreateWindowExA(0, "STATIC", "Minimum", WS_CHILD | WS_VISIBLE,
            20, 24, 80, 24, window, NULL, NULL, NULL);

        minimum_box = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "1",
            WS_CHILD | WS_VISIBLE | WS_TABSTOP,
            110, 20, 120, 26, window, NULL, NULL, NULL);

        CreateWindowExA(0, "STATIC", "Maximum", WS_CHILD | WS_VISIBLE,
            20, 64, 80, 24, window, NULL, NULL, NULL);

        maximum_box = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "100",
            WS_CHILD | WS_VISIBLE | WS_TABSTOP,
            110, 60, 120, 26, window, NULL, NULL, NULL);

        CreateWindowExA(0, "BUTTON", "Generate",
            WS_CHILD | WS_VISIBLE | WS_TABSTOP | BS_DEFPUSHBUTTON,
            20, 104, 210, 30, window, (HMENU)ID_GENERATE, NULL, NULL);

        result_label = CreateWindowExA(0, "STATIC", "Random number: -",
            WS_CHILD | WS_VISIBLE,
            20, 150, 240, 24, window, NULL, NULL, NULL);

        return 0;

    case WM_COMMAND:
        if (LOWORD(wparam) == ID_GENERATE) {
            generate_number(window);
            return 0;
        }
        break;

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }

    return DefWindowProcA(window, message, wparam, lparam);
}

int WINAPI WinMain(HINSTANCE instance, HINSTANCE previous, LPSTR command_line, int show_command)
{
    const char class_name[] = "SmallCRandomWindow";

    WNDCLASSA window_class = {0};
    window_class.lpfnWndProc = window_proc;
    window_class.hInstance = instance;
    window_class.lpszClassName = class_name;
    window_class.hCursor = LoadCursor(NULL, IDC_ARROW);

    srand((unsigned int)time(NULL));

    RegisterClassA(&window_class);

    HWND window = CreateWindowExA(
        0,
        class_name,
        "Random Number Generator",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX,
        CW_USEDEFAULT, CW_USEDEFAULT,
        280, 230,
        NULL, NULL, instance, NULL);

    ShowWindow(window, show_command);

    MSG message;
    while (GetMessageA(&message, NULL, 0, 0) > 0) {
        TranslateMessage(&message);
        DispatchMessageA(&message);
    }

    return 0;
}
```

Build it with Microsoft's compiler:

```powershell
cl random_gui.c user32.lib /link /subsystem:windows
.\random_gui.exe
```

Or with MinGW GCC:

```powershell
gcc random_gui.c -mwindows -o random_gui
.\random_gui.exe
```

The GUI version has the same core logic, but it is surrounded by Windows machinery.

`CreateWindowExA` is used for the main window and for child controls. The class name `"EDIT"` creates a text box. `"BUTTON"` creates a button. `"STATIC"` creates a label.

The window procedure receives messages:

```c
static LRESULT CALLBACK window_proc(HWND window, UINT message, WPARAM wparam, LPARAM lparam)
```

When the button is clicked, Windows sends `WM_COMMAND`. The program checks the button ID and calls `generate_number(window)`.

The message loop keeps the program alive:

```c
while (GetMessageA(&message, NULL, 0, 0) > 0) {
    TranslateMessage(&message);
    DispatchMessageA(&message);
}
```

That is the biggest shift from the console version. The console program runs top to bottom. The GUI program waits for messages and responds to them.

## The Shape Of The Lesson

C is small, but not soft.

The console version makes input conversion and pointer output visible. The GUI version makes the operating system visible. There is no magic layer saying "make me a button." There is a window class, a message loop, a window procedure, and a control ID.

That friction is part of the education. C teaches by refusing to cushion the edges.
