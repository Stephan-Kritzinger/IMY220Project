import { usersCollection } from "../db";

//CRUD operations export
export class User{
    async create(userData){
        return await usersCollection.insertOne(userData);
    }

    async getByField(field, value){
        return await usersCollection.findOne({[field]: value}, {projection: {password: 0}})
    }

    async update(id, data){
        return await usersCollection.updateOne({_id: id}, {$set: data});
    }

    async delete(id) {
        return await usersCollection.deleteOne({_id: id})
    }
}
