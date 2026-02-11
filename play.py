#!/usr/bin/env python3
"""CLI word guessing game. Guess the secret one-syllable word from clues."""

import glob
import random
import sys


def load_puzzles():
    puzzles = []
    for path in sorted(glob.glob("puzzles/*.txt")):
        with open(path) as f:
            lines = [line.strip() for line in f if line.strip()]
        puzzles.append({"secret": lines[0].lower(), "clues": lines[1:]})
    return puzzles


def play():
    puzzles = load_puzzles()
    if not puzzles:
        print("No puzzles found in puzzles/")
        sys.exit(1)

    remaining = list(puzzles)
    random.shuffle(remaining)
    score = 0

    while remaining:
        puzzle = remaining.pop()
        clues = list(puzzle["clues"])
        random.shuffle(clues)
        clue_index = 0

        print(f"\n--- Puzzle ({score} solved) ---")
        print(f"Clue: {clues[clue_index]}")

        while True:
            try:
                guess = input("> ").strip().lower()
            except (EOFError, KeyboardInterrupt):
                print(f"\nYou solved {score} puzzles. Bye!")
                return

            if guess == "":
                clue_index += 1
                if clue_index < len(clues):
                    print(f"Clue: {clues[clue_index]}")
                else:
                    print(f"No more clues! The word was: {puzzle['secret']}")
                    break
            elif guess == puzzle["secret"]:
                score += 1
                print("Yes!")
                break
            else:
                print("Nope.")

    print(f"\nYou solved all {score} puzzles!")


if __name__ == "__main__":
    play()
