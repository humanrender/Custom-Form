(function($){
  
  var $$ = {};
  
  var DEFAULTS = {
    file_button:"Choose file",
    file_label:"No file chosen",
    responsive_select:false,
    responsive_file:false
  }
  
  function get_options(options){ $.extend(DEFAULTS,(options || {})) }
  
  function CustomForm(){}
  
  $.extend(CustomForm.prototype,{
    init:function(elements, options){
      var self = this, options = $.extend(DEFAULTS,(options || {}));
      return elements.each(function(){ 
        // Don't initialize if it is is a select and it's size is not 0 or if the plugin has already been initalized in this element
        if ((this.nodeName == 'SELECT' && this.size > 0) || this.$$custom_form_initialized) return true;
        self.new_element(this,options);      
      });
    },
    new_element:function(){
      
      //var element = FormElement.get(this);
      
      //element.init(options);
      //this.custom_form_instance = element;
    }
  });
  
  CustomForm.get_instance = function(){
    if(!this.instance) this.instance = new CustomForm();
    console.log(this,this.instance)
    return this.instance;
  }
  
  CustomForm.decorators = 
  
  CustomForm.register_element_decorator = function(){
    
  }
  
  $.fn.custom_form = function( method ) {
      var instance = CustomForm.get_instance();
    if((typeof method != "string") || !method)
      return instance.init(this,method /*options*/);
    else{
      // return execute.apply(this,arguments)
    }
  };
  
})(jQuery)