import json

# Eingabedaten
with open("./helper/en.json", encoding="UTF8") as file:
    data = json.load(file)

# Umwandlung in JSON-Format
items = {}

# Temporäre Speicherung von Einträgen, um sie später zu prüfen
temp_items = {}

for key, value in data.items():
    # Trenne den Schlüssel in ID und Attribut
    id_part, attribute = key.split(" ", 1)
    
    # Prüfe, ob die ID 24-stellig ist
    if len(id_part) == 24 and id_part.isalnum():
        if id_part not in temp_items:
            temp_items[id_part] = {}
        temp_items[id_part][attribute.lower()] = value
    else:
        break  # Abbruch, wenn eine nicht passende ID gefunden wird

# Filterung der IDs, die 'Item' als ShortName oder Description haben
for id_part, attributes in temp_items.items():
    if not (
        attributes.get("ShortName") == "Item" or 
        attributes.get("Description") == "Item"
    ):
        items[id_part] = attributes

# Ausgabe als JSON
json_output = json.dumps(items, indent=4)
# print(json_output)

# Optional: Speichern in einer Datei
with open("./src/data/item.json", "w") as json_file:
    json_file.write(json_output)
