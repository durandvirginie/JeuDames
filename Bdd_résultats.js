db.createCollection("résultats", {
	validator:{
		$jsonSchema:{
			bsonType: "object",
			required:["date", "player1", "player2", "winner"],
			properties: {
				date: {
					bsonType: "object",
					required: ["day", "month", "year"],
					properties: {
						day: {
							bsonType: "int",
							minimum: 1, // voir pour noter 01 si possible 
							maximum: 31, 
							description: " must be an integer in [01,31] and is required"
						},
						month: {
							bsonType: "int",
							minimum: 1,
							maximum: 12, 
							description: " must be an integer in [01,12] and is required"
						},
						year: {
							bsonType: "int",
							minimum: 2019,
							maximum: 3019, 
							description: " must be an integer in [2019,3019] and is required"
						}
					}
				},
				player1: {
					bsonType: "string",
					description: " name of player1"
				},
				player2: {
					bsonType: "string",
					description: " name of player2"
				},
				winner: {
					bsonType: "string",
					description: " winner's name"
				}
			}
		}
	}
})