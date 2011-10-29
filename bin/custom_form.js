(function($){

  var $$ = {},
  DEFAULTS = { 
    file_button:"Choose file",
    file_label:"No file chosen",
    responsive_select:false,
    responsive_file:false
  };
  
  // ===============
  // = FormElement =
  // ===============
  
  // ==================
  // = Static Methods =
  // ==================
  FormElement.total_instances = 0;
  FormElement.build = function(element,options){
    var type, klass;
    if(element.is("select")) type = "select";
    else type = "input_"+element.attr("type");
    
    if(!(klass = this.available_classes[type])) throw("No class available to build element of type "+type)
    return new klass(element,options,(type+"_"+FormElement.total_instances++));
  }
  
  FormElement.available_classes = {};
  FormElement.register_class = function(identifier,klass){
    this.available_classes[identifier] = klass
  }
  
  // =================
  // = Class Methods =
  // =================
  function FormElement(element,options,identifier){
    if(element){
      this.$$custom_form_identifier = identifier;
      this.set_parameters(element,options);
    }
  }
  
  var f = FormElement.prototype;
  
  $.extend(f,{
    get_element:function(){return $$[this.$$custom_form_identifier].element;},
    get:function(label){return $$[this.$$custom_form_identifier].children[label];},
    set:function(object,label){ $$[this.$$custom_form_identifier].children[label] = object; return object; },
    get_id:function(){return this.$$custom_form_identifier;},
    kill:function(){return this.$$custom_form_identifier;},
    
    active_replacement_class:function(condition){
      this.replacement[condition ? "addClass" : "removeClass"]("checked_"+this.element_type)
    },
    
    init:function(){
      var element = this.get_element(), replacement = this.set_replacement();
      this.replace_elements(element,replacement);
      this.init_replacement(element,replacement);
      this.init_mouse_events(element,replacement);
    },
    set_replacement:function(){
      return this.set(this.get_replacement(),"replacement")
    },
    init_mouse_events:function(element,replacement){
      this.mouse_trigger().bind("mouseenter",this,this.hover_handler)
       .bind("mouseleave",this,this.out_handler)
       .bind("click",this,this.click_handler)
       .bind("mouseup",this,this.mouse_up_handler)
       .bind("mousedown",this,this.mouse_down_handler)
      
      var label = $("label[for="+this.element_id+"]");
      if(label.length != 0){
        label.bind("click",this,this.label_handler)
      }else{
        label = replacement.parent("label")
        if(label.length != 0)
          label.bind("click",this,this.label_handler)
      }
    },
    label_handler:function(event){ 
      if(event.target != this) return;
      event.preventDefault();  
      event.data.get("replacement").triggerHandler("click");
    },
    hover_handler:     function(event){ event.data.hover(true)      },
    out_handler:       function(event){ event.data.hover(false)     },
    mouse_up_handler:  function(event){ event.data.mouse_in(false)  },
    mouse_down_handler:function(event){ event.data.mouse_in(true)   },
    
    hover:function(hover){ this.get("replacement")[hover ? "addClass" : "removeClass"]("hover_"+this.element_type) },
    mouse_in:function(down){
      this.get("replacement")[down ? "addClass" : "removeClass"]("active_"+this.element_type)
    },
    
    disabled:function(option,element,replacement){
      var element = (element) || (this.get_element()), replacement; 
      switch(option){
        case true:
        case false:
          replacement = (replacement) || (this.get("replacement"))
          element.attr("disabled",option);
          replacement[option ? "addClass" : "removeClass"]("disabled_"+this.element_type); 
          this.is_disabled = option;
          return option;
        case "none":
          return !element.is(":disabled");
        default:
          return element.is(":disabled");
      }
    }
  })
  function Checkbox(element,options,identifier){this.constructor.call(this,element,options,identifier);}
  Checkbox.IDENTIFIER = "input_checkbox";

  var c = Checkbox.prototype = new FormElement();
  c.constructor = FormElement.prototype.constructor;
  $.extend(c,{
    element_type:"checkbox",
    uncheckeable:false,
    set_parameters:function(element,options){
      this.element_id = element.attr("id");
      this.element_name = element.attr("name");
    },
    get_replacement:function(){
      return $("<span class='"+this.element_type+"'></span>");
    },
    replace_elements:function(element,replacement){
      element.after(replacement);
      replacement.append(element);
    },
    init_replacement:function(element,replacement){
      if(element.is(":checked")) this.checked(true,element,replacement);
      if(element.is(":disabled")) this.disabled(true,element,replacement);
    },
    checked:function(checked,element,replacement){
      var input = (element) || (this.get_element()), replacement = (replacement) || (this.get("replacement"));
      checked = checked == undefined ? !input.is(":checked") : checked;
      if(!this.uncheckeable || (this.uncheckeable && checked)){ 
        input.attr("checked",checked);
        replacement[checked ? "addClass" : "removeClass"]("checked_"+this.element_type);
        if(checked) input.trigger("change");
      }
    },
    mouse_trigger:function(){ return this.get("replacement") },
    click_handler:function(event){
      event.data.checked();
      event.data.get_element().triggerHandler("click");
    }
  });

  FormElement.register_class(Checkbox.IDENTIFIER,Checkbox)
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
  
  
  $.fn.custom_form = function( method ) {
    var instance = CustomForm.get_custom_form_instance();
    if((typeof method != "string") || !method)
      return instance.init(this,method /*options*/);
    else 
      return instance.execute(this,arguments);
  };
  
})(jQuery)