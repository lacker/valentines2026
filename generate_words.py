#!/usr/bin/env python3
"""Generate a list of common one-syllable English words.

Uses the CMU Pronouncing Dictionary for syllable counting and
the wordfreq library for frequency filtering.
"""

from nltk.corpus import cmudict
from wordfreq import zipf_frequency

MIN_ZIPF = 2.0  # Minimum zipf frequency (tune this)
ALLOWED_SINGLE_LETTERS = {"a", "i", "o"}
SYSTEM_DICT = "/usr/share/dict/words"

def count_syllables(phonemes):
    """Count syllables by counting vowel phonemes (they end with a digit)."""
    return sum(1 for p in phonemes if p[-1].isdigit())

def load_dictionary_words():
    """Load lowercase-only words from system dictionary to filter out proper nouns."""
    with open(SYSTEM_DICT) as f:
        return {w for w in f.read().split() if w[0].islower() and w.isalpha()}

def main():
    entries = cmudict.dict()
    dict_words = load_dictionary_words()
    print(f"System dictionary lowercase words: {len(dict_words)}")

    one_syllable = set()
    for word, pronunciations in entries.items():
        # Skip non-alpha words and single letters (except a, i, o)
        if not word.isalpha():
            continue
        if len(word) == 1 and word not in ALLOWED_SINGLE_LETTERS:
            continue

        # Must be in system dictionary (filters out proper nouns and junk)
        if word not in dict_words:
            continue

        # A word is one-syllable if ANY of its pronunciations has 1 syllable
        if any(count_syllables(pron) == 1 for pron in pronunciations):
            one_syllable.add(word)

    print(f"One-syllable words in cmudict ∩ dictionary: {len(one_syllable)}")

    # Filter by frequency
    common = []
    for word in sorted(one_syllable):
        freq = zipf_frequency(word, "en")
        if freq >= MIN_ZIPF:
            common.append(word)

    print(f"After frequency filter (zipf >= {MIN_ZIPF}): {len(common)}")

    # Write output
    with open("words.txt", "w") as f:
        for word in common:
            f.write(word + "\n")

    print(f"Wrote {len(common)} words to words.txt")

    # Show some stats
    print(f"\nSample words (first 20): {common[:20]}")
    print(f"Sample words (last 20): {common[-20:]}")

    # Spot checks
    for check_word in ["schlepped", "crwth", "cat", "dog", "thought", "strengths"]:
        in_list = check_word in common
        freq = zipf_frequency(check_word, "en")
        in_cmu = check_word in one_syllable
        print(f"  {check_word}: in_list={in_list}, zipf={freq:.2f}, in_cmudict={in_cmu}")

if __name__ == "__main__":
    main()
