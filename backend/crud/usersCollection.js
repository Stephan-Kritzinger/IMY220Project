import { getUsersCollection } from "../db";

//CRUD operations export
export class User{
    async create(userData){
        const usersCollection = getUsersCollection();
        return await usersCollection.insertOne(userData);
    }

    async getByField(field, value){
        const usersCollection = getUsersCollection();
        return await usersCollection.findOne({[field]: value}, {projection: {password: 0}})
    }

    async getPassword(id){
        const usersCollection = getUsersCollection();
        return await usersCollection.findOne({_id: id}, {projection: {password: 1}})
    }

    async update(id, data){
        const usersCollection = getUsersCollection();
        return await usersCollection.updateOne({_id: id}, {$set: data});
    }

    async delete(id) {
        const usersCollection = getUsersCollection();
        return await usersCollection.deleteOne({_id: id})
    }
}
