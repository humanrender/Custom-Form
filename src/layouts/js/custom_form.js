  function CustomForm(){}

  $.extend(CustomForm.prototype,{
    init:function(elements, options){
      var self = this, options = $.extend(DEFAULTS,(options || {}));
      return elements.each(function(){ 
        // Don't initialize if it is is a select and it's size is not 0 or if the plugin has already been initalized in this element
        if ((this.nodeName == 'SELECT' && this.size > 0) || this.$$custom_form_initialized) return true;
        self.new_element(this).init(options);      
      });
    },
    execute:function execute(method){
      var self = this, args = Array.prototype.slice.call(arguments,1);
      // if(method in OVERRIDES) return  OVERRIDES[method].apply(this,args);
      return self.each(function(){
        // if(this.custom_form_instance)
          // this.custom_form_instance[method].apply(this.custom_form_instance,args);
      })
    },
    new_element:function(element,options){
      var $element = $(element),
          instance = FormElement.build($element,options), 
          id = instance.get_id();
      this.register_instance(id,instance,$element);
      return instance;
    },
    register_instance:function(id,instance,element){
      $$[id] = {
        element:element,
        instance:instance,
        children:{}
      };
    },
    unregister_instance:function(instance){
      var label = instance.get_id();
      instance = instance.kill();
      delete $$[label];
    }
  });
  
  CustomForm.get_custom_form_instance = function(){
    if(!this.instance) this.instance = new CustomForm();
    return this.instance;
  }