import { usersCollection } from "../db";

//CRUD operations export
export class User{
    async create(userData){
        return await usersCollection.insertOne(userData);
    }

    async getById(id){
        return await usersCollection.findOne({_id: id});
    }

    async getByUsername(username){
        return await usersCollection.findOne({username: username});
    }

    async update(id, data){
        return await usersCollection.updateOne({_id: id}, {$set: data});
    }

    async delete(id) {
        return await usersCollection.deleteOne({_id: id})
    }
}
