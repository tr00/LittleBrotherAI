import openai
import langid



def language_consistency(prompt: str, cot:str, response:str, sampling:bool = True) -> float:
    """_Language Consistency Monitor_
    Detects if chain-of-thought uses other languages than used in user prompt or response. 
    Args:
        prompt (str): user prompt to the model
        cot (str): chain of thought of the model
        response (str): final response of the model
        sampling (bool): whether the score is based on random sampling from the chain of thought in addition to full cot.
    """
    
    
    
    
    
    return 