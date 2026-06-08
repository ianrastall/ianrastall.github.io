---
title: "Small Programs by Hand: A Rust Random Number Generator"
description: "A Rust version of the small random number generator, moving from Cargo console input to an egui desktop interface."
published: "2026-06-07T21:45:00-05:00"
slug: "small-programs-by-hand-rust-random-number-generator"
category: "Programming"
tags:
  - Rust
  - Cargo
  - VS Code
  - Small programs
draft: false
featured: false
aiAssisted: true
aiDisclosure: "This post was drafted with AI assistance and reviewed before publication."
---

Rust makes this tiny program feel serious in a useful way.

The shared program is still simple: ask for a minimum, ask for a maximum, then produce a random whole number in that range.

But Rust asks us to be honest about input, parsing, mutability, dependencies, and failure. That makes it a very good language for seeing where the edges of a small program really are.

## The Core Technologies

Rust projects are usually managed with Cargo. Cargo creates the project, runs the compiler, runs the program, and manages dependencies.

The console version uses:

- `std::io`, for terminal input and output
- `String`, for input storage
- `parse::<i32>()`, for conversion
- `match`, for handling success and failure
- the `rand` crate, because random-number generation is not in Rust's standard library

The GUI version uses two crates:

- `rand`, for random numbers
- `eframe`, which runs `egui` as a native desktop application

`egui` is an immediate-mode GUI library. That means the interface is described repeatedly each frame. Instead of creating a button once and waiting for it forever, the code says "draw this button now, and tell me if it was clicked."

## The Console Version

Create a project:

```powershell
cargo new small-rust-random-console
cd small-rust-random-console
```

Add the random-number crate:

```powershell
cargo add rand
```

Open `src/main.rs` and replace its contents with this:

```rust
use rand::Rng;
use std::io::{self, Write};

fn read_whole_number(prompt: &str) -> i32 {
    loop {
        print!("{prompt}");
        io::stdout().flush().expect("failed to flush prompt");

        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("failed to read line");

        match input.trim().parse::<i32>() {
            Ok(value) => return value,
            Err(_) => println!("Please enter a whole number."),
        }
    }
}

fn main() {
    let minimum = read_whole_number("Minimum: ");
    let maximum = read_whole_number("Maximum: ");

    if minimum > maximum {
        println!("Minimum must be less than or equal to maximum.");
        return;
    }

    let mut rng = rand::rng();
    let number = rng.random_range(minimum..=maximum);

    println!("Random number: {number}");
}
```

Run it:

```powershell
cargo run
```

The helper function borrows the prompt:

```rust
fn read_whole_number(prompt: &str) -> i32
```

`&str` means the function can read the prompt text without owning it.

The input string is mutable:

```rust
let mut input = String::new();
```

Rust variables are immutable by default, so `mut` is an explicit signal that this string will change.

Reading from standard input requires a mutable borrow:

```rust
io::stdin()
    .read_line(&mut input)
    .expect("failed to read line");
```

Parsing returns a `Result`, so the code handles both cases:

```rust
match input.trim().parse::<i32>() {
    Ok(value) => return value,
    Err(_) => println!("Please enter a whole number."),
}
```

The random line uses an inclusive range:

```rust
let number = rng.random_range(minimum..=maximum);
```

The `..=` range includes the maximum value.

## The GUI Version

Now create a separate GUI project:

```powershell
cargo new small-rust-random-gui
cd small-rust-random-gui
```

Add the dependencies:

```powershell
cargo add eframe rand
```

Open `src/main.rs` and replace it with this:

```rust
use eframe::egui;
use rand::Rng;

struct RandomApp {
    minimum: i32,
    maximum: i32,
    result: String,
}

impl Default for RandomApp {
    fn default() -> Self {
        Self {
            minimum: 1,
            maximum: 100,
            result: "Random number: -".to_owned(),
        }
    }
}

impl eframe::App for RandomApp {
    fn update(&mut self, context: &egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(context, |ui| {
            ui.heading("Random Number Generator");

            ui.horizontal(|ui| {
                ui.label("Minimum");
                ui.add(egui::DragValue::new(&mut self.minimum));
            });

            ui.horizontal(|ui| {
                ui.label("Maximum");
                ui.add(egui::DragValue::new(&mut self.maximum));
            });

            if ui.button("Generate").clicked() {
                if self.minimum > self.maximum {
                    self.result = "Minimum must be less than or equal to maximum.".to_owned();
                } else {
                    let mut rng = rand::rng();
                    let number = rng.random_range(self.minimum..=self.maximum);
                    self.result = format!("Random number: {number}");
                }
            }

            ui.label(&self.result);
        });
    }
}

fn main() -> eframe::Result<()> {
    let options = eframe::NativeOptions::default();

    eframe::run_native(
        "Random Number Generator",
        options,
        Box::new(|_creation_context| Ok(Box::new(RandomApp::default()))),
    )
}
```

Run it:

```powershell
cargo run
```

The application state is a struct:

```rust
struct RandomApp {
    minimum: i32,
    maximum: i32,
    result: String,
}
```

The GUI is drawn inside `update`:

```rust
fn update(&mut self, context: &egui::Context, _frame: &mut eframe::Frame)
```

The `&mut self` is important. The GUI is allowed to change the app state.

These lines create numeric controls:

```rust
ui.add(egui::DragValue::new(&mut self.minimum));
```

The button reports whether it was clicked during this frame:

```rust
if ui.button("Generate").clicked() {
```

Inside that block, the logic is almost the same as the console version. Validate the range, generate the number, update the result.

The app starts here:

```rust
eframe::run_native(
    "Random Number Generator",
    options,
    Box::new(|_creation_context| Ok(Box::new(RandomApp::default()))),
)
```

That call creates a native window and runs the GUI event loop.

## The Shape Of The Lesson

Rust is strict in the console and strict in the GUI, but the strictness is consistent.

The console version teaches parsing, `Result`, mutable strings, borrowed prompts, and inclusive ranges. The GUI version adds application state, mutable UI updates, and an external crate for the graphical layer.

The tiny program does not become trivial in Rust. It becomes explicit.
