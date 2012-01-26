  // ============
  // = Checkbox =
  // ============

  function Checkbox(identifier){this.constructor.call(this,identifier);}
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
    get_replacement:function(element){
      return $("<span class='"+this.element_type+"'></span>");
    },
    replace_elements:function(element,replacement){
      element.after(replacement);
      replacement.append(element);
    },
    init_replacement:function(element,replacement){
      var c,d;
      if((c = element.is(":checked"))) this.checked(true,element,replacement);
      if((d = element.is(":disabled"))) this.disabled(true,element,replacement);
      if(c || d)
        this.update(element,replacement)
    },
    checked:function(checked,element,replacement){
      element = (element) || (this.get_element()); replacement = (replacement) || (this.get("replacement"));
      checked = checked == undefined ? !element.is(":checked") : checked;
      if(!this.uncheckeable || (this.uncheckeable && checked)){ 
        element.attr("checked",checked);
        if(checked) element.trigger("change");
        else this.update(element,replacement)
      }
    },
    mouse_trigger:function(){ return this.get("replacement") },
    click_handler:function(event){
      if(event.data.is_disabled) return;
      var self = event.data;
      self.get_element().focus().triggerHandler("click");
      if(event.target == this)
        self.checked();
    },
    change:function(event){
      event.data.update($(this));
    },
    update:function(element,replacement){
      var element = (element || this.get_element()), 
          klass = "checked_"+this.element_type, checked = element.is(":checked"),
          replacement = (replacement || this.get("replacement"));
      this.disable_if_disabled(element);
      if(checked && !replacement.hasClass(klass)) replacement.addClass(klass)
      else if(!checked && replacement.hasClass(klass)) replacement.removeClass(klass)
    }
  });

  FormElement.register_class(Checkbox.IDENTIFIER,Checkbox)
  
  // =========
  // = Radio =
  // =========
  
  function Radio(identifier){this.constructor.call(this,identifier);}
  Radio.IDENTIFIER = "input_radio";
  var r = Radio.prototype = new Checkbox();
  r.constructor = FormElement.prototype.constructor;
  $.extend(r,{
    uncheckeable:true,
    element_type:"radio",
    update:function(element,replacement){
       var element = (element || this.get_element()), 
          klass = "checked_"+this.element_type, checked = element.is(":checked"),
          replacement = (replacement || this.get("replacement"));
      this.disable_if_disabled(element);
      
      if(checked){
        var checked_radios = $("."+klass).has("[name='"+this.element_name+"']").not(this.element_id);
        if(checked_radios.length != 0)
            checked_radios.removeClass(klass)
        replacement.addClass(klass)
      } 
    }
  })
  
  FormElement.register_class(Radio.IDENTIFIER,Radio)