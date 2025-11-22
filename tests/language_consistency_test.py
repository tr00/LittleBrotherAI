
import json 
from monitor_api.consistency_monitors import language_consistency, percentage_different_language

def run_test():
    with open('tests/language_consistency_dataset.json', 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    # Iterate through each sample
    for i, sample in enumerate(dataset):
        lang_consistency_score = language_consistency(prompt=sample["user_prompt"], cot=sample["chain_of_thought"], response=sample["response"])
        
        percentage_diff_lang = percentage_different_language(prompt=sample["user_prompt"], cot=sample["chain_of_thought"], response=sample["response"], n_gram=5)
        
        proportion = sample["language_switch_proportion"]
        
        print(f"Test Sample {i}:\n Language Consistency Score: {lang_consistency_score} \n Detected Fraction of original language: {percentage_diff_lang} \n Language Switch Proportion: {proportion}\n")
        
    
    
if __name__== "__main__":
    run_test()