
/* RestStorageService Class template*/
/* Use this template as a starter and complete the items that say 'TODO' */
import StorageService from './storage_service.js'
export default class RestStorageService extends StorageService {
    constructor(entity, entitySingle, options = {}, host) {
        super(null, null, entity, entitySingle, options);
        this.host = 'localhost:8080';    //e.g, localhost:8080, from 'endPoint' in appViewModel
    }
    get apiName() { return this.entity; }
    get hostPrefix() {
        return `http://${this.host}`
    }
    get apiUrl() {
        return `${this.hostPrefix}/${this.apiName}`;
    }

    async list(options = this.model.options) {
        let url = `${this.hostPrefix}/${this.entity}/${this.utils.getQueryString(options)}`;
        try {
            const response = await fetch(url);
            this.model.data = await response.json();
            return this.model.data;
        }
        catch (msg) {
            console.log(msg);
            throw (msg);
        }
    }

    async read(id) {
        try {
            //TODO
            const response = await fetch(`${this.apiUrl}/${id}`);
            return await response.json();
        }
        catch (err) {
            console.log(err);
            throw (err);
        }
    }
    async update(id, postData) {
        let durl = `${this.hostPrefix}/${this.entity}/${id.id}`;

        const response = await fetch(durl, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(id)
          });
        
        return await response.json(); 
    }


    async create(postData) {
        postData.coach_id = 1;
        postData.league_id = 1;
        let durl = `${this.hostPrefix}/${this.entity}`;

        const response = await fetch(durl, {
            method: 'Post',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(postData)
          });
        
        return await response.json(); 
    }
    async delete(id) {
        //TODO
        let durl = `${this.hostPrefix}/${this.entity}/${id}`;

        const response = await fetch(durl, {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json'
            },
            //body: JSON.stringify(id)
          });
        
        return await response.json(); 
    }

    async getLookup(lookupName) {
        let url = `${this.hostPrefix}/lookups/${lookupName}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json'
            },
            //body: JSON.stringify(id)
          });
        this.model.lookups = await response.json();
        return this.model.lookups; 

    }   

}