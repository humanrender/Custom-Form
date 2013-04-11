  // ==========
  // = Select =
  // ==========
  
  FormElement.element_border_width = function(element){
    return parseInt(element.css("border-left-width"))-parseInt(element.css("border-right-width"));
  }
  
  function Select(identifier){this.constructor.call(this,identifier);}
  Select.IDENTIFIER = "select";

  var s = Select.prototype = new FormElement();
  s.constructor = FormElement.prototype.constructor;
  $.extend(s,{
    button_width:0,
    click_handler:$.noop,
    element_type:"select",
    redraw : function(){
      var element = this.get_element();
      element.removeAttr('style');
      this.element_width = element.outerWidth();

      var replacement = this.get('replacement'),
          select_content = replacement.find('.select_content'),
          select_label = this.set($(".select_label",replacement),"select_label"),
          styles = {
            width:this.element_width-css_num(replacement,"border-left-width")-css_num(replacement,"border-right-width")            
         };
      element.css(styles); replacement.css(styles);
      var select_button = $(".select_button",replacement);  
      select_label.css({ 
        width: styles.width-select_button.outerWidth()-css_num(select_content,"border-left-width")-css_num(select_content,"border-right-width")-css_num(select_label,"border-right-width")-css_num(select_label,"border-left-width")
      });
    },
    set_parameters:function(element,options){
      this.responsive = options.responsive_select;
    },
    get_replacement:function(element){
      var def_option = $("option:selected",element);
      (def_option.length != 0) ||(def_option = $("option:first-child",element))
      return $("<span class='select'><span class='select_content' ><span class='select_button'><span class='select_button_icon'></span></span><span class='select_label'><span>"+def_option.text()+"</span></span></span></span>")
    },
    replace_elements:function(element,replacement){
      this.element_width = element.outerWidth();
      element.after(replacement);
      replacement.append(element);
    },
    init_replacement:function(element,replacement){
      var select_label = this.set($(".select_label",replacement),"select_label");
    
      if(!this.responsive){
        this.redraw();
      }else{
        replacement.addClass("responsive_select")
      }
    
      element.bind("change",this,this.select_change)
    },
    init_mouse_events:function(element,replacement){
      FormElement.prototype.init_mouse_events.call(this,element,replacement);
      if($$._browser.mozilla || $$._browser.msie)
        element.bind("keyup",this,this.key_up);
    },
    key_up:function(event){
      if(event.which == 38 || event.which == 40)
        event.data.update();
    },
    select_change:function(event){
      event.data.update_label();
    },
    update_label:function(){
      this.get("select_label").html("<span>"+$("option:selected",this.get_element()).text()+"</span>");
    },
    mouse_trigger:function(){return this.get_element();},
    update:function(){
      var element = this.get_element();
      this.disable_if_disabled(element);
      element.trigger("change");
    },
    select:function(selected){
      var selected_type = typeof selected, element = this.get_element();
      switch(selected_type){
        case "number": element.val($(":nth-child("+selected+")",element).val()); break;
        case "function": selected.apply(element); break;
        default:
          (selected_type == "string") || (selected = selected.to_s);
          element.find("option:contains('"+selected+"')").prop("selected",true);
      }
      this.update();
    }
  });
  
  FormElement.register_class(Select.IDENTIFIER,Select)