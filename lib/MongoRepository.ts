import { Collection, Db, Filter, ObjectId } from "mongodb";
import { Model } from "./Model";
import { Repository } from "./Repository";



export class MongoRepository<T extends Model> implements Repository<T,string>{

    constructor(protected db: Db, private collectionName: string, private type: (new (data: any) => T)) {
    }
  
    protected get collection(): Collection<T> {
      if(!this.db){
        throw 'database not found';
      }
      return this.db.collection(this.collectionName);
    }
  
  
    async find(model: Partial<T>): Promise<T[]> {
      model = model || <T>{};
      const dbresult = await this.collection.find(model).toArray();
      const instanced = dbresult.map(x => new this.type(x));
      return instanced;
    }
    async findByProperty<TProp>(  key: keyof T , propertyValues:TProp[]): Promise<T[]>{    
      const query = <Filter<T>>{ [key]: {$in:propertyValues } };
      const dbresult = await this.collection.find(query).toArray();
      const instanced = dbresult.map(x => new this.type(x));
      return instanced;
    }
    async findPaginated(query: T, skip = 0, limit = 50): Promise<[T[], number]> {
      query = query || <T>{};
      const total = await this.collection.countDocuments(query);
      const dbresult = await this.collection.find(query).skip(skip).limit(limit).toArray();
      const instanced = dbresult.map(x => new this.type(x));
      return [instanced, total];
    }
  
    async findByQueryPaginated(query: Filter<T>, skip = 0, limit = 50): Promise<[T[], number]> {
      query = query || <T>{};
  
      const total = await this.collection.countDocuments(query);
  
      const dbresult = await this.collection.find(query).skip(skip).limit(limit).toArray();
      const instancedPaged = dbresult.map(x => new this.type(x));
      return [instancedPaged, total];
    }
    async findByQuery(query: Partial<T>): Promise<T[]> {
      query = query || <T>{};
      const dbresult = await this.collection.find(query).toArray();
      const instanced = dbresult.map(x => new this.type(x));
      return instanced;
    }
  
    async findOne(query: T): Promise<T|null> {
      query = query || <T>{};
      const dbresult = await this.collection.findOne(query);
      if (dbresult) {
        const instanced = new this.type(dbresult);
        return instanced;
      }
      else return null
    }
  
    async findById(id: string): Promise<T|null> {
      const query: T = <T>{ _id: new ObjectId(id) };
      const dbresult = await this.collection.findOne(query);
      const instanced = dbresult ? new this.type(dbresult) : null;
      return instanced;
    }
  
  
    async findByIds(ids:string[]): Promise<T[]>{
      const _ids = ids.map(x => new ObjectId(x));
      const query:any = { _id: {$in:_ids } }; //TODO: Prepare the right type 
      const dbresult = await this.collection.find(query).toArray();
      const instanced = dbresult.map(x => new this.type(x));
      return instanced;
    }
    async UpdateWithQuery(query: Filter<T>, newT: T): Promise<any> {
      return await this.collection.findOneAndUpdate(query, newT);
    }
  
    async  deletebyId(id: string): Promise<number> {
      const query: T = <T>{ _id: new ObjectId(id) };
      const deleteReult = await this.collection.deleteOne(query);
      return deleteReult.deletedCount;
    }
  
    async  deleteMany(query: T): Promise<number> {
      const deleteResult = await this.collection.deleteMany(query);
      return deleteResult.deletedCount;
    }
  
    async insert(model: T): Promise<string> {
      model.OnCreate();
      const result = await this.collection.insertOne(model as any);
      const insertedId=result.insertedId;
      return insertedId.toString();
    }
    async insertMany(models: T[]): Promise<string[]> {
      const result = await this.collection.insertMany(models as any);
      const resultIds: string[] = [];
      for (let index = 0; index < models.length; index++) {
        if (result.insertedIds[index]) {
          resultIds.push(result.insertedIds[index].toString());
        }
        else
          resultIds.push("");
      }
      return resultIds;
    }
  
    async addChild(parentId: string, childName: string, model: any) {
      const ChildId = new ObjectId();
      model._id = ChildId;
      const perparedChild: any = {};
      perparedChild[childName] = model;
      const query: T = <T>{ _id: new ObjectId(parentId) };
      return await this.collection.updateOne(query, { $push: perparedChild });
    }
  
    async  updatebyId(model: T, id: string): Promise<number> {
      model.OnUpdate();
      delete model._id;
      const query: T = <T>{ _id: new ObjectId(id) };
      const result = await this.collection.updateOne(query, { $set: (model as any) });
      return result.modifiedCount;
    }
  
    async count(query?: T): Promise<number> {
      if (query)
        return await this.collection.countDocuments(query);
      else
        return await this.collection.countDocuments();
    }
  
    async  addToChildList(id: string, propertyName: string, value: any): Promise<void> {
      const setObject: any = {};
      setObject[propertyName] = value;
      const query: T = <T>{ _id: new ObjectId(id) };
      await this.collection.updateOne(query, { $addToSet: setObject });
    }
  
    async  removeFromChildList(id: string, propertyName: string, value: any): Promise<void> {
      const setObject: any = {};
      setObject[propertyName] = value;
      const query: T = <T>{ _id: new ObjectId(id) };
      await this.collection.updateOne(query, { $pull: setObject });
    }
  
    async findAndModify(query: Filter<T>, model: T, upsert = true): Promise<T> {
      const updateResult = await this.collection.findOneAndUpdate(query, model, { upsert });
      return new this.type(updateResult.value);
    }
  
    async upsert(query: T, model: T): Promise<string|undefined> {
      
      const result = await this.collection.findOneAndUpdate(query, { $set: (model as any) }, { upsert: true });
      if (result.lastErrorObject?.updatedExisting) {
        return result.value?._id.toHexString();
      }
      else {
        return result.lastErrorObject?.upserted.toHexString();
      }
  
    }
  
  }