
/* LocalStorageService*/

import StorageService from "./storage_service.js";

export default class LocalStorageService extends StorageService {
    "use strict"
    constructor(data, entity, entitySingle, options={}) {
        super(data, entity, entitySingle, options={}) 

        this._entity = entity;
        this._entitySingle = entitySingle;
       
        this.initModel(data, options);
    }

    //Getters and Setters
    get entitySingle() {return this._entitySingle;}
    get entity() {return this._entity;}
    get sortCol() {
        //super.filterCol = 'asc';
        return this.model.options.sortCol;
    }
    set sortCol(col) {
        this.model.options.sortCol = col;
        this.store();
    }
    get sortDir() {
        return this.model.options.sortDir;
    }
    set sortDir(dir) {
        this.model.options.sortDir = dir;
        this.store();
    }
    set filterStr(filterStr) {
        this.model.options.filterStr = filterStr;
        this.store();
    }
    get filterStr() {
        return this.model.options.filterStr;
    }
    get size() {
        return this.model.data.length;
    }
    set options(opt){
        this.model.options={
            sortCol: "name",
            sortDir: "asc",
            filterCol:"",
            filterStr:""
        };
        //merge any passed in options
        this.model.options = Object.assign(this.model.options, opt);
    }
    //CRUD FUNCTIONS
     initModel(data, options){
        this.model ={};
        this.model.data=[];
        this.options = options;
        if (data!=null){
            this.model.data=data;
        }
        this.origModel = this.cloneObject(this.model);
       
        this.retrieve();
    }

    async list() {
        this.sort(this.sortCol, this.sortDir, true);
        let filterObj={};
        
        if (this.filterStr){
            filterObj[this.sortCol]=this.filterStr;
            return this.filter(filterObj);
        }
        
        return this.model.data;
    } 

     async create(obj) {
        this.model.data.push(obj);
        this.store();
    }
     async read(getId) {
        let data = this.model.data.find(element => element.id == getId);

        if (data === undefined)
            return null;
        else
            return data;
    }
    async update(obj) {

        let index = this.getItemIndex(obj.id);
        if (index != -1) {
            this.model.data[index] = obj;
            this.store();
        }
    }

     async delete(removeId) {
        let index = this.getItemIndex(removeId);
        this.model.data.splice(index, 1)
        this.store();
    }

    //LocalStorage Functions
     async reset() {
        this.model = this.cloneObject(this.origModel);
        this.model.nextID = 5;
        this.clear();
    }
     async clear() {
        localStorage.removeItem(this.key);
        localStorage.clear();
    }
     store() {
        localStorage[this.key] = JSON.stringify(this.model);
    }
     retrieve() {
        if (localStorage.getItem(this.key) !== null) {
            this.model = JSON.parse(localStorage[this.key]);
            return true;
        }
        return false;
    }
    getItem(id) {
        return this.model.data.find(element => element.id == id);

    }

    //Sorting and Filtering Functions
     sort(col, direction, perm = true) {
        let copy = this.cloneObject(this.model.data);
        let sorted = copy.sort((a, b) => {
            if (a[col] == b[col])
                return 0;
            if (a[col] < b[col]) {
                return direction == "asc" ? -1 : 1;
            }
            if (a[col] > b[col]) {
                return direction == "asc" ? 1 : -1;
            }

        });
        if (perm) {
            this.model.data = sorted;
            this.sortCol = col;
            this.sortDir = direction;

            this.store();
        }
        return sorted;
    }

    filter(filterObj) {
 
        function filterFunc(team) {
            for (let entity in filterObj) {
                if ( !team[entity].toLowerCase().includes(filterObj[entity].toLowerCase())) {
                    return false;
                }
            }
            return true;
        }
        let result = this.model.data.filter(filterFunc);
        return this.cloneObject(result);
    }

    //Utility functions
    getItemIndex(id) {
        return this.model.data.findIndex(element => element.id == id);

    }
    cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

}