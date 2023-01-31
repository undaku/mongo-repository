import { ObjectId } from "mongodb";
import { Copy } from "./Copy";

export class Model {
    
    _id?: ObjectId;
    active:boolean;
    createdOn: Date;
    updatedOn: Date;    
    set id(v : string) {
        this._id = new ObjectId(v);
    }    

    get id(): string {
        if (this._id)
        {
            const newId=this._id.toString();
            return newId;
        }
            
        else
            return '';
    }    

    constructor(data?: any) {
        Copy(this, data, "_id");
        if (data && data.id && data.id.length > 0) {
            this.id = data.id;
        }
       
        Copy(this, data, "updatedOn");
        Copy(this, data, "createdOn");
        Copy(this, data, "active");
    }

    OnCreate() {
        this.createdOn = new Date();
    }
    OnUpdate(){
        this.updatedOn = new Date();
    }

}