export default class Utilities {

    constructor() {
        this.files = {}
    }
    async getFileContents(url) {
        if (!(url in this.files)) {
            this.files[url] = await $.get(url);
        }

        return this.files[url]

    }

    cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    //Add the following utility method 'getQueryString'
    getQueryString(options = this.options) {
        let string = '?';
        let prev = false;
        if(options.sortCol){
            string += `sortCol=${options.sortCol}&sortDir=${options.sortDir}`;
            prev = true;
        }else{
            prev = false;
        }
        if(options.filterCol){
            if(prev){
                string += '&';
            }
            string += `filterCol=${options.filterCol}&filterStr=${options.filterStr}`;
            prev = false;
        }
        if(options.limit){
            if(prev){
                string += '&'
            }
            string += `limit=${options.limit}&filterStr=${options.offset}`;
        }
        return string;
    }
}