
import View from './view.js'
import FormView from './form_view.js';

export default class ListView extends View {  //now inherits from 'View' class
    constructor(storageService, viewModel) {
        super(storageService, viewModel["list"])  //I take full view model and only pass the 'list' view model to the View constructor
        this.entityViewModel = viewModel;
        this.templateUrl = "js/views/partials/list_view.ejs";
        this.wrapperTemplateUrl ="js/views/partials/list_page_wrapper.ejs";
      //this.$container = "#tableContainer"
    }

    get columns() {
        return this.viewModel.columns;
    } 
    get $searchInput() {
        return $("#" + this.viewModel.searchInputId);
    }
    get $container(){
        return $("#" + this.entityViewModel.listContainerId)
      }
    get $clearSearchButton() {
        return $("#" + this.viewModel.clearSearchButtonId);
    }
    get $newButton() {
        return $("#" + this.viewModel.newButtonId);
    }
    get $resetButton() {
        return $("#" + this.viewModel.resetButtonId);
    }
    get $deleteModal() {
        return $("#" + this.viewModel.deleteModalContainerId);
    }
    get $editModal() {
        return $("#" + this.viewModel.editModalContainerId);
    }
    get $headerIcon() {
        return $(`#${this.storage.sortCol}-${this.storage.sortDir}`)
    }
    get $alertContainer() {
        return $("#" + this.viewModel.alertContainerId);
    }
    get popoversEnabled() {
        return this.viewModel.enablePopovers;
    }
    get formView() {return this._formView;}
    get entityName(){  //this getter gives me entity name with first letter capitalized
        let str=this.entityViewModel.entitySingle;
        return str[0].toUpperCase()+ str.substring(1);
    }
    /* getViewData-overrides parent method */
    async getViewData() { //override from View.js
        let returnValue = await this.storage.list();
        return returnValue;
    }

    /*editItem(itemId)-Instantiate form view to edit current item
    This is called from the event handler set in the bindItemEvents*/
    async editItem(itemId) {

       this._formView = new FormView(this.storage, this.entityViewModel, this);
       this._formView.currentItemId = itemId;
       await this._formView.render();
    }

    async createItem() {
       this.editItem(null);  //just call editItem with a null id, that should tell the form view to do an 'add'

    }

    async bindItemEvents(data) {

       let that = this;
       this.hideSortIcons();

       for(let col of this.columns){
        $(`th[data-name='${col.name}']`).off("click").on("click", (e)=> {
            const dataName = $(e.currentTarget).attr('data-name');
            let curDirection = this.storage.sortDir;
            that.hideSortIcon(dataName, that.storage.sortDir)
            that.storage.sortCol = dataName;
            if(curDirection == 'asc'){
                this.storage.sortDir = 'dsc';
            }else{
                this.storage.sortDir = 'asc';
            }
            that.renderItem();
        });
       };
       that.showSortIcon(that.storage.sortCol, that.storage.sortDir);
       $(`#${this.storage.sortCol}-${this.storage.sortDir}`).show();

       if (this.popoversEnabled){
            this.initPopover();
       }
    }

    async bindWrapperEvents() {

       let that = this;
       let $deleteModal = this.$deleteModal;
       let $editModal = this.$editModal;

       $deleteModal.on("shown.bs.modal", function (e) {
        let button = e.relatedTarget;
        let rowItemId = $(button).closest("tr").attr('data-id');
        let dataItem = that.readCachedItem(rowItemId);
        let dataName = dataItem[that.viewModel.nameCol];
        var $modalTitle = $('.modal-title');

        $modalTitle.text(`Delete ${dataName}?`);
        $deleteModal.attr("data-id", rowItemId);
        $deleteModal.attr("data-name", dataName);
       });

       $editModal.on("shown.bs.modal", function (e) {
        let button = e.relatedTarget;
        let rowItemId = $(button).closest("tr").attr('data-id');
        that.editItem(rowItemId);
       });
       

       $("#yesButton").click((e)=> {
        let itemName = $deleteModal.attr("data-name");
        let itemId = $deleteModal.attr("data-id");
        this.renderAlert(this.storage._entity, itemName);
        this.deleteItem(itemId).then((out) => {
            this.renderItem();
        }).catch((e)=>{
            console.error(e);
        });
       })

       $('#resetView').on("click", (e) =>{
        this.reset();
       });
       $("#addItem").on("click", (e) =>{

        that.createItem();
       });

       this.$searchInput.on("input", (e)=>{
        this.searchVal = $(e.target).val();
        if (this.searchVal.length) {
            this.runSearch();
        }else{
            this.clearSearch();
        }
       });

       this.$clearSearchButton.on("click", (e) =>{
        this.clearSearch()
       });
    }
    
    closeEditModal(){
        this.$editModal.modal("hide")
    }

    clearSearch() {
        this.clearSearchInput();
        this.storage.filterStr = "";
        this.renderItem();
    }
    clearSearchInput() {
        this.$searchInput.val("");
    }
    runSearch() {
        clearTimeout(this.searchWaiter);
        this.searchWaiter = setTimeout(()=>{
            if(this.searchVal.length >1){
                this.storage.filterStr = this.searchVal;
                this.storage.filterCol = this.storage.sortCol;
                this.renderItem();
            }
        }, 250);
    }

    renderAlert(itemType, itemName) {
        let alertHtml=`<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>You deleted the following ${itemType}: ${itemName}</span>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
        this.$alertContainer.html(alertHtml);
    }

    renderPopoverTitle(item) {
        return `${item[this.viewModel.nameCol]}`;
      }

    renderPopoverBody(item, that) {
        let htmlContent = "";
        that.columns.forEach((col,idx)=>{
            if (col.popover){
                htmlContent += `<p>${col.label}: ${item[col.name]}</p>`;
            }
        })
        return htmlContent;
    }

    initPopover() {
        let that = this;
        $('[data-bs-toggle="popover"]').popover({
            html: true,
            trigger: 'hover',
            delay: {
                show: 600,
                hide: 200
            },
            placement: 'auto',
            title:function () {
                var index = $(this).closest("tr").attr("data-id");
                let item = that.readCachedItem(index);
                return that.renderPopoverTitle(item);
            },
            content: function() {
                var index = $(this).closest("tr").attr("data-id");
                let item = that.readCachedItem(index);
                return that.renderPopoverBody(item, that);
            }
        });
    }
    hideSortIcons() {
        $(".toggleIcon").hide();
    }
    showSortIcon(col, dir) {
        $(`#${col}-${dir}`).show();
    }
    hideSortIcon(col, dir) {
        $(`#${col}-${dir}`).hide();
    }
    




}