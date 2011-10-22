(function( $ ){
    
  $._mixin = {
    include:function(mixin,target){
      mixin.call(target.prototype);
    }
  }
  
  var FormElement = (function(){
    function init(options){
      this.element_id = this.element.attr("id");
      this.element_name = this.element.attr("name");
      if(this.set_properties) this.set_properties(options);
      this.replacement = (options.select_replacement || this.get_replacement).apply(this)
      this.replace_elements();
      this.init_replacement();
      this.init_mouse_events();
    }
    
    function hover(hover){
      hover ?
        this.replacement.addClass("hover_"+this.element_type) :
        this.replacement.removeClass("hover_"+this.element_type)
    }
    
    function mouse_in(down){
      down ?
        this.replacement.addClass("active_"+this.element_type) :
        this.replacement.removeClass("active_"+this.element_type)
    }
    
    function init_mouse_events(){
      var mouse_trigger = this.mouse_trigger();
      mouse_trigger.bind("mouseenter",this,this.hover_handler)
        .bind("mouseleave",this,this.out_handler)
        .bind("click",this,this.click_handler)
        .bind("mouseup",this,this.mouse_up_handler)
        .bind("mousedown",this,this.mouse_down_handler)
      
      var label = $("label[for="+this.element_id+"]") ;
      if(label.length != 0){
        label.bind("click",this,label_handler)
      }else{
        label = this.replacement.parent("label")
        if(label.length != 0)
          label.bind("click",this,label_handler)
      }
    }
    
    function hover_handler(event){ event.data.hover(true)  }
    function out_handler(event){ event.data.hover(false) }
    function mouse_up_handler(event){ event.data.mouse_in(false)  }
    function mouse_down_handler(event){ event.data.mouse_in(true) }
    
    function active_replacement_class(condition){
      this.replacement[condition ? "addClass" : "removeClass"]("active_"+this.element_type)
    }
    
    function label_handler(e){ 
      if(e.target != this) return;
      e.preventDefault();  
      e.data.replacement.triggerHandler("click");
      
    }
    
    function disabled(option){
      switch(option){
        case true:
        case false:
          this.element.attr("disabled",option);
          this.replacement[option ? "addClass" : "removeClass"]("disabled_"+this.element_type); 
          this.is_disabled = option;
          return option;
        case "none":
          return !this.element.is(":disabled");
        default:
          return this.element.is(":disabled");
      }
    }
    
    return function(){
      this.init = init;
      this.hover = hover;
      this.init_mouse_events = init_mouse_events;
      this.hover_handler = hover_handler;
      this.out_handler = out_handler;
      this.active_replacement_class = active_replacement_class;
      this.mouse_up_handler = mouse_up_handler;
      this.mouse_down_handler = mouse_down_handler;
      this.mouse_in = mouse_in;
      this.label_handler = label_handler;
      this.disabled = disabled;
    }
  })()
  
  // style='height:"+Select.select_height+"px;'
  
  function File(element){
    this.element = element; this.element_type = "file";
  }
  
  File.prototype.set_properties = function(options){
    this.file_label = options.file_label;
    this.file_button = options.file_button;
  }
  
  File.prototype.get_replacement = function(){
    return $("<span class='file'>\
      <span class='file_content'>\
        <span class='file_button'>"+this.file_button+"</span><p class='file_label'>"+this.file_label+"</p>\
      </span>\
    </span>")
  }
  
  File.prototype.replace_elements = function(){
    this.element_width = this.element.outerWidth();
    this.element_margin = this.element.css("margin-left");
    this.element_padding = this.element.css("padding-left");
    this.element.after(this.replacement);
    this.replacement.append(this.element);
  }
  
  File.prototype.init_replacement = function(){
    var element = this.element, styles = {width:this.element_width};
    element.css(styles);
    this.replacement.css(styles);
    this.file_label = $(".file_label",this.replacement);
    this.element.bind("change",this,this.file_change)
  }
  
  File.prototype.file_change = function(event){
    event.data.update_label();
  }
  
  File.prototype.update_label = function(){
    this.file_label.text(this.element.val());
  }
  
  function Select(element){ this.element = element; this.element_type = "select";  }
  File.prototype.mouse_trigger = Select.prototype.mouse_trigger = function(){return this.element;}
  Select.prototype.get_replacement = function(){
    var def_option = $("option:selected",this.element);
    (def_option.length != 0) ||(def_option = $("option:first-child",this.element))
    return $("<span class='select'>\
      <span class='select_content' >\
        <span class='select_button'>\
          <span class='select_button_icon'></span>\
        </span>\
        <p class='select_label'>"+def_option.text()+"</p>\
      </span>\
    </span>")
  }
  
  Select.prototype.init_replacement = function(){
    var styles = {width:(this.element_width-parseInt(this.replacement.css("border-left-width"))-parseInt(this.replacement.css("border-right-width")))};
    this.element.css(styles);
    this.replacement.css(styles);
    
    var select_button = $(".select_button",this.replacement);
    this.select_label = $(".select_label",this.replacement);
    this.select_label.css({ 
      width: (styles.width-select_button.outerWidth()-parseInt(this.select_label.css("padding-left"))-parseInt(this.select_label.css("padding-right"))),
      "padding-right":0
    });
    
    this.element.bind("change",this,this.select_change)
  }
  
  Select.prototype.replace_elements = function(){
    this.element_width = this.element.outerWidth();
    this.element.after(this.replacement);
    this.replacement.append(this.element);
  }
  
  Select.prototype.select_change = function(event){
    event.data.update_label();
  }
  
  Select.prototype.update_label = function(){
    this.select_label.text($("option:selected",this.element).text());
  }
  
  Select.prototype.show_options = function(){
    this.element.trigger("click")
  }
  
  function Radio(element){ this.element = element; this.element_type = "radio"; this.uncheckeable = true; }
  function Checkbox(element){ this.element = element; this.element_type = "checkbox"; this.uncheckeable = false; }
  Checkbox.prototype.mouse_trigger = function(){
    return this.replacement
  }
  
  Checkbox.prototype.replace_elements = function(){
    this.element.after(this.replacement);
    this.replacement.append(this.element);
  }
  
  Checkbox.prototype.get_replacement = function(){
    return $("<span class='"+this.element_type+"'></span>");
  }
  
  Checkbox.prototype.click_handler = function (event){
    event.data.checked();
    event.data.element.triggerHandler("click");
  }
  
  Checkbox.prototype.init_replacement = function(){
    var element = this.element;
    if(element.is(":checked")) this.checked(true);
    if(element.is(":disabled")) this.disabled(true);
  }
  
  Select.prototype.click_handler = function (event){
    event.data.show_options();
  }
  
  Select.initialized = false;
  Select.button_width = 0;
  
  Select.create = function(element){
    if(!Select.initialized){
      var select = new Select(element)
      Select.select_height || (Select.select_height = select.element.outerHeight())
      return select;
    }else
      return new Select(element)
    
  }
  
  Select.prototype.update = function(){
    this.element.trigger("change")
  }
  
  Select.prototype.select = function(selected){
    var selected_type = typeof selected;
    switch(selected_type){
      case "number": this.element.val(selected); break;
      case "function": selected.apply(this.element); break;
      default:
        (selected_type == "string") || (selected = selected.to_s);
        this.element.find("option:contains('"+selected+"')").attr("selected",true);
    }
    this.update();
  }
  
  Checkbox.prototype.checked = function (checked){
    var input = this.element; 
    checked = checked == undefined ? !input.is(":checked") : checked;
    if(!this.uncheckeable || (this.uncheckeable && checked)){ 
      input.attr("checked",checked);
      this.active_replacement_class(checked)
      if(checked) input.trigger("change")
    }
  }
  
  Checkbox.prototype.update = function(){
    this.checked(this.element.is(":checked"))
  }
  
  Radio.prototype = new Checkbox();
  Radio.prototype.update = function(){
    this.checked(this.element.is(":checked"),true)
  }
  
  Radio.prototype.checked = function(checked,updating){
    (checked != undefined) || (checked = true)
    if(checked || updating){
      var input = this.element;
      checked_radios = $(".active_radio").has("[name='"+this.element_name+"']").not(this.element_id);
      if(checked_radios.length != 0)
          checked_radios.removeClass("active_"+this.element_type)
    }
    Checkbox.prototype.checked.call(this,checked == undefined ? undefined : checked);
  }
  
  $._mixin.include(FormElement,Checkbox);
  $._mixin.include(FormElement,Radio);
  $._mixin.include(FormElement,Select);
  $._mixin.include(FormElement,File);
  
  FormElement.get = function(_element){
    var element = $(_element),
        element_type = element.is("select") ? "select" : element.attr('type');
      switch( element_type ){
        case "select": return Select.create(element);
        case "checkbox": return new Checkbox(element);
        case "radio": return new Radio(element);
        case "file": return new File(element);
      }
  }
  
  function init(options){
    options = $.extend({
      file_button:"Browse",
      file_label:"No file chosen"
    },(options || {}))
    
    
    
    return this.each(function(){      
      var element = FormElement.get(this);
      if ((this.nodeName == 'SELECT' && this.size > 0) || this.custom_form_instance) return true;
      element.init(options);
      this.custom_form_instance = element;
    })
  }
  
  var METHODS = ["init","checked","update","select","disabled"];
  var OVERRIDES = {
    disabled:function(option){
      (option != undefined) || (option = "all");
      if(this.length == 1) return this[0].custom_form_instance.disabled(option);
      var result = option == "any" ? false : true;
      this.each(function(){
        var tmp = this.custom_form_instance.disabled(option);
        switch(option){
          case "all": if(result && !tmp) {result = false; return false;}; break;
          case "any": if(tmp){result = true; return false}; break;
          case "none": if(!tmp){result = false; return false}; break;
        }
      });
      return result
    }
  }
  
  function execute(method){
    var self = this, args = Array.prototype.slice.call(arguments,1);
    if(method in OVERRIDES) return  OVERRIDES[method].apply(this,args);
    return self.each(function(){
      this.custom_form_instance[method].apply(this.custom_form_instance,args)
    })
  }
  
  $.fn.custom_form = function( method ) {
    if(method == "init" || (typeof method != "string") || !method){
      return init.apply( this, arguments );
    }else{
      try{
        return execute.apply(this,arguments)
      }catch(e){
        $.error( 'Method ' +  method + ' does not exist on jQuery.custom_form');
      }
    }
  };

})( jQuery );