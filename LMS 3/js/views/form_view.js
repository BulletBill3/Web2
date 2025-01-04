
import View from './view.js'

export default class FormView extends View {
  constructor(storageService, viewModel, parentView) {
    super(storageService, viewModel)
    this.entityViewModel = viewModel;
    this.currentItemId = null;
    //this.viewModel = viewModel;
    //this.templateUrl = "js/views/partials/form_view.ejs";
    this.templateUrl = "js/views/partials/form.ejs";

    this.wrapperTemplateUrl = null;
    this.parentView = parentView; //reference to parent list view
    //this.$container = "#formModal"
    this.formChanged = false; //tracks if form changed
  }
  /* GETTERS AND SETTERS */
  get fields() {
    return this.viewModel.fields
  }
  get formId() {
    return this.viewModel.id;
  }
  get $form() {
    return $("#" + this.formId);
  }
  get $container(){
    return $("#" + this.viewModel.list.editModalContainerId)
  }
  get form() {
    return this.$form.get(0);
  }
  get formValid() {
    return this.form.checkValidity();
  }
  get $inputs() {
    return $("#" + this.formId + " :input");
  }

  /*NOTE:  render is handled fully in the inherited View class*/

  /* getViewData-overrides parent method */
  async getViewData() {
    if (!this.lookupsPopulated){    //add lookupsPopulated=false to the constructor
      await this.populateLookups();
    }
    if(this.currentItemId){
        this._data = await this.storage.read(this.currentItemId);
    }
    else{
        this._data = {};
    }
  }
    async populateLookups() {
      for (let field of this.fields) {
        if ("lookupName" in field) {
          await this.storage.getLookup(field.lookupName);
        }
      }
      this.lookupsPopulated=true;
  
    }
  

  /*bindItemEvents()-override-bind form submit and cancel events*/
  async bindItemEvents(data) {
  
    $("#submitButton").click(this.submit);
    $("#closeForm").click(e=>{
      this.$container.hide();
    });
    $("#cancelButton").click(e=>{
        e.preventDefault();
        e.stopPropagation();
        if(this.formChanged ){
          confirm("Are you sure you want to exit?")
        }
        this.$container.hide();
    });
    this.$inputs.change(this.change);
    //this.form.attr('action', this.formAction);
    //this.form.attr('method', this.method);

    }
  async bindWrapperEvents() {  //needed for now so parent class doesn't complain.  
  }
  /*submit method-handle the form submit event.  Must be an arrow function to 
  inherit the 'this' from the class*/
  submit = ev => {
   ev.preventDefault();
   ev.stopPropagation();

    //check for validity
    let formValid = this.form.checkValidity();
    if(!formValid){
      ev.preventDefault();
      ev.stopPropagation();
      console.log("form not valid");
    }else{
      this.formValidated();
      let formData = this.getFormData();
      if(formData.id === ''){
        formData.id = this.viewModel.list.nextID;
        this.viewModel.list.nextId = formData.id + 1;
        this.storage.create(formData);
      }else {
        this.storage.update(formData);
      }
    this.parentView.renderItem();
    this.$container.modal('hide');
    this.$container.hide();

    }
  }

  /*getFormData()-get the data from the form an package as a normal object for submit*/
  getFormData() {
    return Object.fromEntries(new FormData(this.form));
    //reference: https://gomakethings.com/serializing-form-data-with-the-vanilla-js-formdata-object/

  }

  /*change()-change event handler for inputs.  call fieldValidated to set the bootstrap classes. Set formChanged*/
  change = ev => {
  }

  getEventEl(ev) {
    return $(ev.currentTarget);
  }

  fieldValidated($el) {

  }

  formValidated() {
    this.form.classList.add('was-validated');
  }

}