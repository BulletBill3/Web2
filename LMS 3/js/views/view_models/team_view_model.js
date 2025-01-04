import teamData from '../../models/mock/team_data.js'

/* view_model.js -Review this file and the notes I've added to understand how these are used.
As you integrate this pattern into your LMS1 code base, you may make some changes or add your own meta data.  This is just an example showing how I did it
*/
var teamViewModel = {
    entity: "teams",           //key used for LocalStorage
    entitySingle: "team",      //singular in case you need for alert message
    wrapperContainerId: "teamPageWrapper",
    wrapperTemplateUrl: "js/views/partials/list_page_wrapper.ejs",
    listContainerId:"tableContainer",  
    listTemplateUrl: "js/views/partials/list_view.ejs",
    id:"myForm",

    modalContainerId:"myModal", 
    data: teamData,          //mock data we are going to use for now, global (included from js/models/mock_team_data.js)
    list: {
        options: {                 //default options sent to LocalStorageService
            sortCol: "name",
            sortDir: "asc",
            limit: "",
            offset: "",
            filterCol: "",
            filterStr: ""
        },
        listTitle: "Teams",
       
        id: "my-list",
        enablePopovers: true,
        tableClasses: "table table-dark table-hover mt-2",   //classes for table tag
        thClasses:"bg-black bg-gradient",                    //classes for my th tags (you may not need)
       
        logoCol: "teamPhoto",                                //what data column holds the path to the team logo (if used in your code)
        nameCol: "name",                                     //what data column do we use to display the item 'name'
        /*Columns to be displayed in your bootstrap table.  I used 'popover=true' to indicate I wanted to include that colum in my popover.
        This allowed me to keep my code 'generic'*/
        columns: [
            {
                label: "Team Name",
                name: "name",
                popover: "true"            //true if you want to show in popover
            },
            {
                label: "Coach",
                name: "coach_id",
                lookupName: "coaches",     //lookup name to use for /lookups/:lookupName  API
                tag: "select",
                defaultVal: "-1", //default value for dropdown, usually the value that matches 'Select a Coach'
                attributes: {
                   id: "coach_id",
                   name: "coach_id",
                   placeholder: "Select a Coach"
                   
                }
            },

            {
                label: "Team Motto",
                name: "motto",
                popover: "true"
            },           
            {
                label: "Notes",
                name: "notes",
                popover: "true"
            }
            
        ],
        searchInputId: "searchInput",
        clearSearchButtonId:"clearSearch",
        newButtonId:"addItem",
        resetButtonId:"resetView",
        deleteModalContainerId:"myModal",
        editModalContainerId:"formModal",
        alertContainerId: "alertDiv",   //container to store dismissible alert
        nextID: 65,

        
    },
    form: {
        id: "team-form",
        wrapperContainerId:"",

    },
    fields: [   
        {
            label: "Team ID",
            tag: "text",
            defaultVal: "team name", //default value for dropdown, usually the value that matches 'Select a Coach'
            attributes: {
               id: "id",
               name: "id",
               placeholder: "team id",
               readOnly: "readonly",
            },
            validation: {
              required: true,
              requiredMessage: "ID is required"
              }
        },
        {
            label: "Team Name",
            tag: "text",
            defaultVal: "team name", //default value for dropdown, usually the value that matches 'Select a Coach'
            attributes: {
               id: "name",
               name: "name",
               placeholder: "Select a Coach",
               readOnly: "",

            },
            validation: {
              required: true,
              requiredMessage: "Coach is required"
              }
        },
        
        {
            label: "Coach",
            lookupName: "coaches",     //lookup name to use for /lookups/:lookupName  API
            tag: "select",
            defaultVal: "-1", //default value for dropdown, usually the value that matches 'Select a Coach'
            attributes: {
               id: "coach_id",
               name: "coach_id",
               placeholder: "Select a Coach",
               readOnly: "",

            },
            validation: {
              required: true,
              requiredMessage: "Coach is required"
              }
        },
        {
            label: "League ID",
            //lookupName: "coaches",     //lookup name to use for /lookups/:lookupName  API
            tag: "text",
            defaultVal: "-1", //default value for dropdown, usually the value that matches 'Select a Coach'
            attributes: {
               id: "league_id",
               name: "league_id",
               placeholder: "",
               readOnly: "readonly",
            },
            validation: {
              required: true,
              requiredMessage: "league id is required"
              }
        },
        {
            label: "Motto",
            tag: "text",
            //defaultVal: "team name", //default value for dropdown, usually the value that matches 'Select a Coach'
            attributes: {
               id: "motto",
               name: "motto",
               placeholder: "motto",
               readOnly: "",

            },
            validation: {
              required: false,
              }
        },
        {
            label: "Notes",
            tag: "text",
            //defaultVal: "team name", //default value for dropdown, usually the value that matches 'Select a Coach'
            attributes: {
               id: "notes",
               name: "notes",
               placeholder: "notes",
               readOnly: "",

            },
            validation: {
              required: false,
              }
        },
    ]
    
    
}
export default teamViewModel;