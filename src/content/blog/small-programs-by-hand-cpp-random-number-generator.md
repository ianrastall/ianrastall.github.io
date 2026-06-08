---
title: "Small Programs by Hand: A C++ Random Number Generator"
description: "A C++ version of the small random number generator, moving from streams and the standard random library to a Windows-native GUI."
published: "2026-06-07T20:25:00-05:00"
slug: "small-programs-by-hand-cpp-random-number-generator"
category: "Programming"
tags:
  - C++
  - VS Code
  - Small programs
draft: false
featured: false
aiAssisted: true
aiDisclosure: "This post was drafted with AI assistance and reviewed before publication."
---

C++ begins near C, but it immediately starts pulling us toward richer library types.

The shared program stays the same: ask for a minimum, ask for a maximum, then print a random whole number in that range.

In C++, the console version can use streams, strings, and the standard random library. The GUI version still has to choose a platform or toolkit, because C++ does not have a standard GUI library.

## The Core Technologies

For the console version, this post uses:

- `std::cin` and `std::cout`, for terminal input and output
- `std::string`, for prompt text
- `std::numeric_limits`, for clearing bad input
- `std::random_device`, `std::mt19937`, and `std::uniform_int_distribution`, for random numbers

That last part is worth noticing. C has `rand()`. C++ has a more explicit random system made from separate pieces:

- a seed source
- a generator
- a distribution

For the GUI version, this post uses the Windows API directly:

- `CreateWindowExA`, for the window and controls
- `GetWindowTextA`, for reading edit boxes
- `SetWindowTextA`, for updating the label
- a window procedure and message loop, just like the C version

This does not mean Win32 is the only way to write C++ GUIs. Qt, wxWidgets, FLTK, Dear ImGui, JUCE, and many others exist. Win32 is used here because it keeps the example dependency-free on Windows and makes the platform layer visible.

## The Console Version

Create a folder:

```text
small-cpp-random-console
```

Inside it, create one file:

```text
random_console.cpp
```

Here is the complete program:

```cpp
#include <iostream>
#include <limits>
#include <random>
#include <string>

int read_whole_number(const std::string& prompt)
{
    int value;

    while (true) {
        std::cout << prompt;

        if (std::cin >> value) {
            return value;
        }

        std::cout << "Please enter a whole number.\n";
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
}

int main()
{
    int minimum = read_whole_number("Minimum: ");
    int maximum = read_whole_number("Maximum: ");

    if (minimum > maximum) {
        std::cout << "Minimum must be less than or equal to maximum.\n";
        return 1;
    }

    std::random_device seed;
    std::mt19937 generator(seed());
    std::uniform_int_distribution<int> distribution(minimum, maximum);

    int number = distribution(generator);

    std::cout << "Random number: " << number << '\n';
    return 0;
}
```

With GCC:

```powershell
g++ random_console.cpp -o random_console
.\random_console.exe
```

With Microsoft's compiler from a Developer PowerShell:

```powershell
cl /EHsc random_console.cpp
.\random_console.exe
```

The input helper keeps asking until extraction succeeds:

```cpp
if (std::cin >> value) {
    return value;
}
```

If the user types invalid text, the stream enters a failed state. We clear that state and discard the rest of the bad line:

```cpp
std::cin.clear();
std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
```

The random-number code is longer than Python's, but it says more:

```cpp
std::random_device seed;
std::mt19937 generator(seed());
std::uniform_int_distribution<int> distribution(minimum, maximum);
```

The distribution says that the desired result is an integer evenly chosen from the inclusive range.

## The GUI Version

Now create another file:

```text
random_gui.cpp
```

Here is the complete program:

```cpp
#define WIN32_LEAN_AND_MEAN

#include <random>
#include <stdexcept>
#include <string>
#include <windows.h>

#define ID_GENERATE 100

static HWND minimum_box;
static HWND maximum_box;
static HWND result_label;

static std::mt19937 generator(std::random_device{}());

int read_box(HWND box)
{
    char text[64];
    GetWindowTextA(box, text, sizeof text);

    std::string input = text;
    size_t end = 0;
    int value = std::stoi(input, &end);

    while (end < input.size() && (input[end] == ' ' || input[end] == '\t')) {
        end++;
    }

    if (end != input.size()) {
        throw std::invalid_argument("extra characters");
    }

    return value;
}

void generate_number(HWND window)
{
    int minimum;
    int maximum;

    try {
        minimum = read_box(minimum_box);
        maximum = read_box(maximum_box);
    } catch (const std::exception&) {
        MessageBoxA(window, "Please enter whole numbers.", "Invalid input", MB_OK | MB_ICONERROR);
        return;
    }

    if (minimum > maximum) {
        MessageBoxA(window, "Minimum must be less than or equal to maximum.", "Invalid range", MB_OK | MB_ICONERROR);
        return;
    }

    std::uniform_int_distribution<int> distribution(minimum, maximum);
    int number = distribution(generator);

    std::string message = "Random number: " + std::to_string(number);
    SetWindowTextA(result_label, message.c_str());
}

LRESULT CALLBACK window_proc(HWND window, UINT message, WPARAM wparam, LPARAM lparam)
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
    const char class_name[] = "SmallCppRandomWindow";

    WNDCLASSA window_class = {};
    window_class.lpfnWndProc = window_proc;
    window_class.hInstance = instance;
    window_class.lpszClassName = class_name;
    window_class.hCursor = LoadCursor(NULL, IDC_ARROW);

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
cl /EHsc random_gui.cpp user32.lib /link /subsystem:windows
.\random_gui.exe
```

Or with MinGW:

```powershell
g++ random_gui.cpp -mwindows -o random_gui
.\random_gui.exe
```

The GUI version mixes two worlds.

The window, button, text boxes, and labels come from Win32. The parsing and random-number generation come from C++:

```cpp
std::uniform_int_distribution<int> distribution(minimum, maximum);
int number = distribution(generator);
```

That is a useful division. C++ can improve the program's internal expression even when the surrounding GUI API is old and C-shaped.

## The Shape Of The Lesson

C++ adds more vocabulary than C: strings, exceptions, stream state, objects, and distributions.

The console version shows the standard library at work. The GUI version shows a common real-world pattern: C++ code often wraps or cooperates with platform APIs that were not designed in a modern C++ style.

The same little random number generator is now both a language lesson and an API lesson.
