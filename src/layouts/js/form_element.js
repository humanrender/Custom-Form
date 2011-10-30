  // ===============
  // = FormElement =
  // ===============
  
  // ==================
  // = Static Methods =
  // ==================
  FormElement.total_instances = 0;
  FormElement.build = function(element){
    var type, klass;
    if(element.is("select")) type = "select";
    else type = "input_"+element.attr("type");
    
    if(!(klass = this.available_classes[type])) throw("No class available to build element of type "+type)
    return new klass(type+"_"+FormElement.total_instances++);
  }
  
  FormElement.available_classes = {};
  FormElement.register_class = function(identifier,klass){
    this.available_classes[identifier] = klass
  }
  
  // =================
  // = Class Methods =
  // =================
  function FormElement(identifier){this.identifier = identifier;}
  
  var f = FormElement.prototype;
  
  $.extend(f,{
    is_disabled:false,
    get_element:function(){return $$[this.identifier].element;},
    get:function(label){return $$[this.identifier].children[label];},
    set:function(object,label){ $$[this.identifier].children[label] = object; return object; },
    get_id:function(){return this.identifier;},
    kill:function(){return this.identifier;},
    
    active_replacement_class:function(condition){
      this.replacement[condition ? "addClass" : "removeClass"]("checked_"+this.element_type)
    },
    
    init:function(options){
      var element = this.get_element(), replacement;
      this.set_parameters(element,options);
      replacement = this.set_replacement(element);
      this.replace_elements(element,replacement);
      this.init_replacement(element,replacement);
      this.disable_if_disabled(element);
      this.init_mouse_events(element,replacement);
      return this;
    },
    set_replacement:function(element){
      return this.set(this.get_replacement(element),"replacement")
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
    },
    disable_if_disabled:function(element){
      if(this.is_disabled != element.is(":disabled")) this.disabled(!this.is_disabled,element);
    }
  })