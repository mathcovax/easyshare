import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://root:root@mongo:27017");
const database = client.db("easyshare");
await client.connect();
console.log("easyshare successfully connect to mongo.");

export class Ref{
	/**
     * @param {String} collection 
     * @param {String} id 
     * @param {import("mongodb").Document[]} project
     */
	constructor(collection, id, project=false){
		if(typeof collection !== "string" || typeof id !== "string")throw new Error("");
		this._id = ObjectId(id);
		this.collection = collection;
		this.project = project;
	}
    
	/**
     * @private
     */
	__REF__ = true;

	/**
     * @private
     */
	_id = "";

	/**
     * @private
     */
	collection = "";

	/**
     * @private
     */
	project = false;

	/**
     * @private
     */
	static async search(document){
		if(typeof document !== "object")return null;
		return await (async function fnc(obj){
			for(const item in obj){
				if(obj[item].__REF__ === true){
					obj[item] = (await database.collection(obj[item].collection).aggregate([
						{ $match: {_id: obj[item]._id} }, 
						{ $limit: 1 }, 
						...(obj[item].project !== false? [{ $project: obj[item].project }] : []) 
					]).toArray())[0] || {};
				}
				else if(typeof obj[item] === "object") obj[item] = await fnc(obj[item]);
			}
			return obj;
		})(document);
	}
}

export default class db{
	/**
     * @param {String} collection 
     * @param {import("mongodb").Document[]} pipeline 
     * @param {import("mongodb").AggregateOptions} option 
     * @return {Promise<import("mongodb").Document[]>}
     */
	static async aggregate(collection, pipeline=[], option=undefined){
		return await Ref.search(await database.collection(collection).aggregate(pipeline, option).toArray());
	}

	/**
     * @param {String} collection 
     * @param {import("mongodb").Filter<import("mongodb").Document>} filter
     * @param {import("mongodb").FindOptions} option 
     * @return {Promise<import("mongodb").Document[]>}
     */
	static async find(collection, filter={}, option=undefined){
		return await Ref.search(await database.collection(collection).find(filter, option).toArray());
	}

	/**
     * @param {String} collection 
     * @param {import("mongodb").Filter<import("mongodb").Document>} filter
     * @param {import("mongodb").FindOptions} option 
     * @return {Promise<import("mongodb").Document>}
     */
	static async findOne(collection, filter={}, option=undefined){
		return await Ref.search(await database.collection(collection).findOne(filter, option));
	}

	/**
     * @param {String} collection 
     * @param {import("mongodb").Document} document
     * @return {Promise<import("mongodb").InsertManyResult<import("mongodb").Document>>}
     */
	static async insertOne(collection, document={}){
		return await database.collection(collection).insertOne(document);
	}

	/**
     * @param {String} collection
     * @param {import("mongodb").Filter<import("mongodb").Document>} filter
     * @param {Partial<import("mongodb").Document>} update
     * @param {Partial<import("mongodb").UpdateOptions>} option
     * @return {Promise<import("mongodb").UpdateResult>}
     */
	static async updateOne(collection, filter={}, update={}, option=undefined){
		return await database.collection(collection).updateOne(filter, update, option);
	}

	/**
     * @param {String} collection
     * @param {import("mongodb").Filter<import("mongodb").Document>} filter
     * @param {Partial<import("mongodb").DeleteOptions>} option
     * @return {Promise<import("mongodb").UpdateResult>}
     */
	static async deleteOne(collection, filter={}, option=undefined){
		return await database.collection(collection).deleteOne(filter, option);
	}
}
