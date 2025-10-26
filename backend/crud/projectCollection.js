import { getProjectCollection, levenshtein } from "../db";

//CRUD operations export
export class Project{
    async create(projectData){
        const projectCollection = getProjectCollection();
        return await projectCollection.insertOne(projectData);
    }

    async get(){
        const projectCollection = getProjectCollection();
        return await projectCollection.find({}).toArray();
    }
    async search(term, limit = 10, threshold = 2){
        const projectCollection = getProjectCollection();
        
        const regex = new RegExp(term.split('').join('.*'), 'i');

        const candidates = await projectCollection.find({"details.name": {$regex: regex}}).limit(50).toArray();
        const fuzzy = candidates.map(repo => ({
            repo,
            score: levenshtein(repo.details.name.toLowerCase(), term.toLowerCase())
        })).filter(e => e.score <= threshold).sort((a,b) => a.score - b.score).slice(0, limit).map(e => e.repo);

        return fuzzy;
    }
    async getByField(field, value){
        const projectCollection = getProjectCollection();
        return await projectCollection.findOne({[field]: value})
    }

    async update(id, data){
        const projectCollection = getProjectCollection();
        return await projectCollection.updateOne({_id: id}, data);
    }
    async contribute(pid, uid, data){
        const projectCollection = getProjectCollection();
        return await projectCollection.updateOne({_id: pid, "contributers.uid": uid}, data);
    }

    async delete(id) {
        const projectCollection = getProjectCollection();
        return await projectCollection.deleteOne({_id: id})
    }
}
