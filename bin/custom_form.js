(function($){

  var $$ = {fn:{}},  
  METHODS = ["init","checked","update","select","disabled"],
  OVERRIDES = {
    disabled:function(option){
      (option != undefined) || (option = "all");
      if(this.length == 1) return $$[this[0].$$custom_form_identifier].instance.disabled(option);
      var result = option == "any" ? false : true;
      var self = this;
      this.each(function(){
        var tmp = $$[this.$$custom_form_identifier].instance.disabled(option);
        switch(option){
          case "all": if(result && !tmp) {result = false; return false;}; break;
          case "any": if(tmp){result = true; return false}; break;
          case "none": if(!tmp){result = false; return false}; break;
        }
      });
      return result
    }
  };
  
  $$._browser = $.browser || (function(){
    var a,c,b;
    b=function(e){e=e.toLowerCase();var d=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:d[1]||"",version:d[2]||"0"}};
    a=b(navigator.userAgent);c={};
    if(a.browser){c[a.browser]=true;c.version=a.version}
    if(c.chrome){c.webkit=true}
    else{if(c.webkit){c.safari=true}}
    return c;
  })();
  
  // =========
  // = Utils =
  // =========

  function css_num(element,property){
    property = parseFloat(element.css(property));
    if(isNaN(property)) return 0;
    return property;
  }

  // ===============
  // = FormElement =
  // ===============
  
  // ==================
  // = Static Methods =
  // ==================
  FormElement.total_instances = 0;
  FormElement.browser_string = function(){
    var key, version, browser, b = $$._browser;
    for(key in b){
      if(key == "version") version = parseInt(b.version)
      else browser = key;
    }
   return browser+" "+browser+version+(b.msie ? "" : " not_msie"); 
  }();
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
      var element = this.get_element(), replacement, element_id = element.attr("id");
      this.set_parameters(element,options);
      replacement = this.set_replacement(element);
      replacement.addClass(FormElement.browser_string)
      if(element_id.match(/\S/))
         replacement.addClass("custom-form_"+element_id)
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
      var mouse_trigger = this.mouse_trigger(), label;
      mouse_trigger.bind("mouseenter",this,this.hover_handler)
       .bind("mouseleave",this,this.out_handler)
       .bind("mouseup",this,this.mouse_up_handler)
       .bind("mousedown",this,this.mouse_down_handler);
      label = replacement.parent("label");
      if(label.length == 0)
        mouse_trigger.bind("click",this,this.click_handler)
      element.bind("focusin",this,this.focus_in)
        .bind("focusout",this,this.focus_out)
        .bind("change",this,this.change);
    },
    focus_in:function(event){
      event.data.focus(true);
    },
    focus_out:function(event){
      event.data.focus(false);
    },
    focus:function(focus){
      if(this.is_disabled) return;
      this.get("replacement")[focus ? "addClass" : "removeClass"]("focus_"+this.element_type);
    },
    change:function(){
      
    },
    label_handler:function(event){ 
      if(event.target != this) return;
      event.preventDefault();  
      event.data.get_element().triggerHandler("change");
    },
    hover_handler:     function(event){ 
      event.data.hover(true)      
    },
    out_handler:       function(event){ event.data.hover(false)     },
    mouse_up_handler:  function(event){ event.data.mouse_in(false)  },
    mouse_down_handler:function(event){ event.data.mouse_in(true)   },
    
    hover:function(hover){ 
      if(this.is_disabled) return;
      this.get("replacement")[hover ? "addClass" : "removeClass"]("hover_"+this.element_type);
    },
    mouse_in:function(down){
      if(this.is_disabled) return;
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
        element.prop("checked",checked);
        element.trigger("change");
        // if(checked) element.trigger("change");
        // else this.update(element,replacement)
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
        var checked_radios = element.closest("form").find("." + klass).has("[name='" + this.element_name + "']").not(this.element_id);
        if(checked_radios.length != 0)
            checked_radios.removeClass(klass)
        replacement.addClass(klass)
      } 
    }
  })
  
  FormElement.register_class(Radio.IDENTIFIER,Radio)

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
      this.update_label();
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

  // ========
  // = File =
  // ========
  function File(identifier){this.constructor.call(this,identifier);}
  File.IDENTIFIER = "input_file";

  var fp = File.prototype = new FormElement();
  fp.constructor = FormElement.prototype.constructor;
  $.extend(fp,{
    click_handler:$.noop,
    element_type:"file",
    set_parameters:function(element,options){
      this.label = options.file_label;
      this.button_label = options.file_button;
      this.responsive = options.responsive_file;
    },
    get_replacement:function(){
      return $("<span class='file'><span class='file_content'><span class='file_button'><span></span>"+this.button_label+"</span><span class='file_label'><span>"+this.label+"</span></span></span></span>")
    },
    replace_elements:function(element,replacement){
      if(!this.responsive){
        this.element_width = element.outerWidth();
        this.element_margin = element.css("margin-left");
        this.element_padding = element.css("padding-left");
      }
      element.after(replacement);
      var wrap = $("<span class='file_wrap'></span>");
      replacement.append(wrap);
      wrap.append(element);
    },
    init_replacement:function(element,replacement){
      var file_label = file_label = this.set($(".file_label",replacement),"file_label");
      element.bind("change",this,this.file_change);
      if(!this.responsive){
        var styles = {width:this.element_width-parseInt(replacement.css("border-left-width"))-parseInt(replacement.css("border-right-width"))};
        element.css(styles);
        replacement.css(styles);
        // file_label.css("width",styles.width-$(".file_button",replacement).outerWidth())
      }else{
        replacement.addClass("responsive_file")
      }
    },
    mouse_trigger:function(){ return this.get_element(); },
    file_change:function(event){ event.data.update_label(); },  
    update_label:function(){
      var text = this.get_element().val()
      if(!text.match(/\S/)) text = this.label;
      this.get("file_label").html("<span>"+text+"</span>");
    },
    update:function(){
      var element = this.get_element();
      this.disable_if_disabled(element);
      element.trigger("change");
    }
  });
  
  FormElement.register_class(File.IDENTIFIER,File)

  $$.fn.ie6 = function(){return $$._browser.msie && parseInt($$._browser.version) <= 6}
  
  $$.fn.ie6_instance = function(){
    return new function(){
      this.init = this.execute = function(elements){return elements};
    }()
  }

  function CustomForm(){
    this.init = function(elements, options){
      var self = this, options = $.extend({ 
        file_button:"Choose file",
        file_label:"No file chosen",
        responsive_select:false,
        responsive_file:false
      },(options || {}));
      elements = elements.each(function(){ 
        // Don't initialize if it is is a select and it's size is not 0 or if the plugin has already been initalized in this element
        if ((this.nodeName == 'SELECT' && this.size > 0) || this.$$custom_form_identifier) return true;
        this.$$custom_form_identifier = self.new_element(this).init(options).identifier;      
      });
      
      return elements;
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
    if(!this.instance)
      this.instance = !$$.fn.ie6() ? new CustomForm() : $$.fn.ie6_instance();
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