export interface Repository<T,TId> {
    insert(model: T): Promise<string>;

    find(model: Partial<T>): Promise<T[]>;
    findOne(model: Partial<T>): Promise<T|null>;
    findById(id: TId): Promise<T|null>;
    findByIds(ids: TId[]): Promise<T[]>;
    findByProperty<TProp>(key: keyof T, propertyValues: TProp[]): Promise<T[]>;
    findPaginated(query: T, skip: number, limit: number): Promise<[T[], number]>
    

    count(query: T): Promise<number>;
    
    updatebyId(model: T, id: string): Promise<number>;
    upsert(query: T, model: T): Promise<string|undefined>;

    deleteMany(model: Partial<T>): Promise<number>;
    deletebyId(id: string): Promise<number>;


    addToChildList(id: string, propertyName: string, value: any): Promise<void>;
    removeFromChildList(id: string, propertyName: string, value: any): Promise<void>;
}