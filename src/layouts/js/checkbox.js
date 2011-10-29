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