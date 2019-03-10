# Documentation of ほんものがたり

## Book

A book contains a specific set of characters, chapters, locations and items. It is stored in one file inside the library
folder, for the user to use. This file is a json file. For the structure and contents see the example below.

### Example Book
```json
{
	"characters": [
		{
			"data": [
				{
					"name": "Vorname",
					"type": "string",
					"value": "Max"
				}
			],
			"abilities": [
				{
					"name": "fire",
					"strength": 5
				},
				{
					"name": "smithing",
					"strength": 100
				}
			],
			"items": [
				{
					"name": "dagger",
					"count": "100"
				}
			],
			"relations": []
		}
	],
	"locations": [],
	"items": [],
	"chapters": {}
}
```
