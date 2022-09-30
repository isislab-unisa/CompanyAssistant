package dao

// func GetGroupResourceById(id string) (model.Resource, error) {

// 	var result model.Resource

// 	cursor, err := db.GetDBCollection(groupCollectionName).Find(context.TODO(), bson.D{{Key: "resource.id", Value: id}})
// 	if err != nil {
// 		return result, err
// 	}
// 	defer cursor.Close(context.TODO())

// 	resultNum := cursor.RemainingBatchLength()
// 	var resultArray = make([]model.Group, resultNum)
// 	i := 0
// 	for cursor.Next(context.TODO()) {
// 		err := cursor.Decode(&resultArray[i])
// 		if err != nil {

// 			fmt.Println()
// 			fmt.Println("error query")
// 			fmt.Println(err.Error())
// 			fmt.Println()

// 			return result, err
// 		}
// 		i++
// 	}
// 	return resultArray[0].Resource, nil
// }
