  function CustomForm(){
    this.init = function(elements, options){
      var self = this, options = $.extend({ 
        file_button:"Choose file",
        file_label:"No file chosen",
        responsive_select:false,
        responsive_file:false
      },(options || {}));
      return elements.each(function(){ 
        // Don't initialize if it is is a select and it's size is not 0 or if the plugin has already been initalized in this element
        if ((this.nodeName == 'SELECT' && this.size > 0) || this.$$custom_form_initialized) return true;
        this.$$custom_form_identifier = self.new_element(this).init(options).identifier;      
      });
    };
    this.execute = function execute(elements,arguments){
      var method = arguments[0];
      var args = Array.prototype.slice.call(arguments,1);
      if(method in OVERRIDES) return  OVERRIDES[method].apply(elements,args);
      return elements.each(function(){
        if(this.$$custom_form_identifier){
          var form_element_instance = $$[this.$$custom_form_identifier].instance;
          form_element_instance[method].apply(form_element_instance,args);
        }
      })
    };
    this.new_element = function(element,options){
      var $element = $(element),
          instance = FormElement.build($element,options), 
          id = instance.get_id();
      this.register_instance(id,instance,$element);
      return instance;
    }
    this.register_instance = function(id,instance,element){
      $$[id] = {
        element:element,
        instance:instance,
        children:{}
      };
    }
    this.unregister_instance = function(instance){
      var label = instance.get_id();
      instance = instance.kill();
      delete $$[label];
    }
  }
  
  CustomForm.get_custom_form_instance = function(){
    if(!this.instance) this.instance = new CustomForm();
    return this.instance;
  }