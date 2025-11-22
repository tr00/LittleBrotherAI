
import json 
from monitor_api.consistency_monitors import language_consistency

def run_test():
    with open('tests/language_consistency_dataset.json', 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    # Iterate through each sample
    for i, sample in enumerate(dataset):
        lang_consistency_score = language_consistency(prompt=sample["user_prompt"], cot=sample["chain_of_thought"], response=sample["response"])
        
        proportion = sample["language_switch_proportion"]
        
        print(f"Test Sample {i}:\n Language Consistency Score: {lang_consistency_score} \n Language Switch Proportion: {proportion}\n")
    
    
if __name__== "__main__":
    run_test()