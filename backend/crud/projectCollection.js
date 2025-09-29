import { getProjectCollection } from "../db";

//CRUD operations export
export class Project{
    async create(projectData){
        const projectCollection = getProjectCollection();
        return await projectCollection.insertOne(projectData);
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
