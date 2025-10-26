import { getUsersCollection, levenshtein } from "../db";

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
    async search(term, limit = 10, threshold = 2){
        const usersCollection = getUsersCollection();
        
        const regex = new RegExp(term.split('').join('.*'), 'i');

        const candidates = await usersCollection.find({username: {$regex: regex}}).limit(50).toArray();
        const fuzzy = candidates.map(user => ({
            user,
            score: levenshtein(user.username.toLowerCase(), term.toLowerCase())
        })).filter(e => e.score <= threshold).sort((a,b) => a.score - b.score).slice(0, limit).map(e => e.user);

        return fuzzy;
    }

    async getPassword(id){
        const usersCollection = getUsersCollection();
        return await usersCollection.findOne({_id: id}, {projection: {password: 1}})
    }

    async update(id, data){
        const usersCollection = getUsersCollection();
        return await usersCollection.updateOne({_id: id}, data);
    }

    async delete(id) {
        const usersCollection = getUsersCollection();
        return await usersCollection.deleteOne({_id: id})
    }
}
