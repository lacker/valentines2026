#!/usr/bin/env python3
"""Verify that puzzle files are valid.

Checks:
1. File has exactly 11 lines (1 secret + 10 clues)
2. The secret word is a one-syllable word (in words.txt)
3. Every word in every clue is a one-syllable word (in words.txt)
4. The secret word does not appear in any clue
5. Variants of the secret word (plurals, inflections) do not appear in clues
"""

import glob
import re
import sys

WORDS_FILE = "words.txt"
PUZZLES_DIR = "puzzles"


def load_valid_words():
    with open(WORDS_FILE) as f:
        return set(f.read().split())


def variants_of(word):
    """Generate common inflectional variants of a word."""
    vs = {word}

    # Add suffixes
    for suffix in ["s", "es", "ed", "d", "er", "ers", "est", "ing", "ly"]:
        vs.add(word + suffix)

    # Remove suffixes (in case the secret is already inflected)
    if word.endswith("s") and len(word) > 2:
        vs.add(word[:-1])
    if word.endswith("es") and len(word) > 3:
        vs.add(word[:-2])
    if word.endswith("ed") and len(word) > 3:
        vs.add(word[:-2])
        vs.add(word[:-1])  # e.g., "baked" -> "bake"
    if word.endswith("d") and len(word) > 2:
        vs.add(word[:-1])
    if word.endswith("er") and len(word) > 3:
        vs.add(word[:-2])
    if word.endswith("ing") and len(word) > 4:
        vs.add(word[:-3])
        vs.add(word[:-3] + "e")  # e.g., "baking" -> "bake"
    if word.endswith("ly") and len(word) > 3:
        vs.add(word[:-2])

    return vs


def extract_words(line):
    """Extract lowercase words from a clue line."""
    return re.findall(r"[a-z]+", line.lower())


def verify_puzzle(filepath, valid_words):
    errors = []
    with open(filepath) as f:
        lines = [line.strip() for line in f.readlines()]

    # Check line count
    if len(lines) != 11:
        errors.append(f"Expected 11 lines, got {len(lines)}")
        if len(lines) < 2:
            return errors

    # Check secret word
    secret = lines[0].lower()
    if not secret.isalpha():
        errors.append(f"Secret word '{secret}' contains non-alpha characters")
    if secret not in valid_words:
        errors.append(f"Secret word '{secret}' is not in words.txt")

    # Build variant set for the secret
    banned = variants_of(secret)

    # Check each clue
    for i, clue in enumerate(lines[1:], start=1):
        clue_words = extract_words(clue)
        if not clue_words:
            errors.append(f"Clue {i}: empty clue")
            continue

        for w in clue_words:
            if w not in valid_words:
                errors.append(f"Clue {i}: '{w}' is not in words.txt")
            if w in banned:
                errors.append(f"Clue {i}: '{w}' is the secret or a variant of it")

    return errors


def main():
    valid_words = load_valid_words()
    puzzle_files = sorted(glob.glob(f"{PUZZLES_DIR}/*.txt"))

    if not puzzle_files:
        print(f"No puzzle files found in {PUZZLES_DIR}/")
        sys.exit(1)

    total_errors = 0
    seen_secrets = {}  # secret -> filepath
    for filepath in puzzle_files:
        errors = verify_puzzle(filepath, valid_words)

        # Check for duplicate secret words across puzzles
        with open(filepath) as f:
            secret = f.readline().strip().lower()
        if secret in seen_secrets:
            errors.append(f"Duplicate secret '{secret}' (also in {seen_secrets[secret]})")
        else:
            seen_secrets[secret] = filepath

        if errors:
            print(f"\n{filepath}: FAIL")
            for e in errors:
                print(f"  - {e}")
            total_errors += len(errors)
        else:
            print(f"{filepath}: OK")

    print(f"\n{len(puzzle_files)} puzzles checked, {total_errors} errors")
    sys.exit(1 if total_errors else 0)


if __name__ == "__main__":
    main()
