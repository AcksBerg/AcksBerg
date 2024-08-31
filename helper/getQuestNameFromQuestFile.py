import json

# Laden der JSON-Datei
with open('./helper/quests.json', 'r', encoding='utf-8') as file:
    data = json.load(file)


# Durchlaufen des JSON-Inhalts und Extrahieren der IDs und Namen
with open('./src/data/quest.json', "w") as file:
    json.dump({quest_id:quest_details.get('QuestName', "No Name Found") for quest_id, quest_details in data.items()},file)
