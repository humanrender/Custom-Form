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
      if(element.is(":checked")) this.checked(true,element,replacement);
      if(element.is(":disabled")) this.disabled(true,element,replacement);
    },
    checked:function(checked,element,replacement){
      element = (element) || (this.get_element()); replacement = (replacement) || (this.get("replacement"));
      checked = checked == undefined ? !element.is(":checked") : checked;
      if(!this.uncheckeable || (this.uncheckeable && checked)){ 
        element.attr("checked",checked);
        replacement[checked ? "addClass" : "removeClass"]("checked_"+this.element_type);
        if(checked) element.trigger("change");
      }
    },
    mouse_trigger:function(){ return this.get("replacement") },
    click_handler:function(event){
      event.data.checked();
      event.data.get_element().triggerHandler("click");
    },
    update:function(){
      var element = this.get_element();
      this.disable_if_disabled(element);
      this.checked(element.is(":checked"),element);
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
    update:function(){
      var element = this.get_element();
      this.disable_if_disabled(element);
      this.checked(element.is(":checked"),element,null,true)
    },
    checked:function(checked,element,replacement,updating){
      element = (element) || (this.get_element()); replacement = (replacement) || (this.get("replacement"));
      (checked != undefined) || (checked = true);
      if(checked || updating){
        var checked_radios = $(".checked_radio").has("[name='"+this.element_name+"']").not(this.element_id);
        if(checked_radios.length != 0)
            checked_radios.removeClass("checked_"+this.element_type)
      }
      Checkbox.prototype.checked.call(this,checked); // == undefined ? undefined : checked
    }
  })
  
  FormElement.register_class(Radio.IDENTIFIER,Radio)