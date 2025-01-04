import Utils from '../util/utilities.js'

export default class View {
  constructor(storage, viewModel) {
    this.storage = storage;
    this.viewModel = viewModel;
    this.utils = new Utils();
    this.data=null;
    this.templateUrl = null;
  }
  get $alertContainer() {
    return $("#" + this.entityViewModel.alertContainerId);
  } 
/*   get wrapperTemplateUrl() {
    return this.entityViewModel.wrapperTemplateUrl;
  } */
  get hasWrapper() {
    return this.entityViewModel.wrapperTemplateUrl;
  }
   get $wrapperContainer() {
    return $("#" + this.entityViewModel.wrapperContainerId);
  } 
  /* get $container() {
    return $("#" + this.entityViewModel.listContainerId);
  } */
  /* get templateUrl() {
    return this.entityViewModel.wrapperTemplateUrl;
  } */

  async render() {
     this.renderWrapper().then(() => {
        this.renderItem();
    })
  }
  
  async renderTemplate($container, templateUrl, viewData) {

    $container.empty().hide();

    let template = await this.utils.getFileContents(templateUrl);
    let html = await ejs.render(template, viewData);
    $container.html(html);

    $container.show()
  }

  async renderWrapper() {
   if(this.wrapperTemplateUrl){
    this.curData = await this.getViewData();

    await this.renderTemplate(this.$wrapperContainer, this.wrapperTemplateUrl, {
      view: this,
      viewModel: this.viewModel,
      data: this.curData
    });
    this.bindWrapperEvents();
   }
  }

  async renderItem() {
    this.curData = await this.getViewData();
    await this.renderTemplate(this.$container, this.templateUrl,{
      view: this,
      viewModel: this.viewModel,
      data: this.curData
    });
    //this.bindWrapperEvents();
    this.bindItemEvents();
  }
  
  async getViewData() {
    throw new Error("must implement getViewData in sub class!")
  }
  async reset() {
    await this.storage.reset();
    await this.render();
  }
  
  async bindItemEvents() {
    throw new Error("must implement bindItemEvents in sub class!")
  }
  async bindWrapperEvents() {
    throw new Error("must implement bindWrapperEvents in sub class!")
  }
  readCachedItem(id) {   
    return this.storage.getItem(id);
  }
  deleteItem(id) {   
    return this.storage.delete(id);
  }
}