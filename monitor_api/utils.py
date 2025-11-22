import random

random.seed(42)

def sample_random_snippets(input_string:str, number_snippets:int = 5, min_length:int = 10) -> list[str]:
    """Given a string (eg chain-of-thought) returns a list with random substrings (always whole words) of the given input string. 

    Args:
        input_string (str): string to be sampled from
        number_strings (int): desired number of sampled sub-strings
        min_length(int): minimum snippet length

    Returns:
        list[str]: list containing whole-word substrings of the input
    """
    words = input_string.split()
    
    text_length = len(words)
 
    
    if text_length == 0:
        return []
    
    snippets = []
    for _ in range(number_snippets):
        
        start_pos = random.randint(0, text_length-min_length)
        
        snippet_length = random.randint(min_length, text_length-start_pos)
        
        snippet_words = words[start_pos:start_pos+snippet_length]
        snippet = " ".join(snippet_words)
        snippets.append(snippet)
    
    return snippets