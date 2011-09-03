(function( $ ){
  
  var methods = {
    init:init,
    check:check
  }
  
  $._mixin = {
    include:function(mixin,target){
      mixin.call(target.prototype);
    }
  }
  
  var FormElement = (function(element){
    function init(options){
      this.element_id = this.element.attr("id");
      this.element_name = this.element.attr("name");
      
      this.replacement = (options.select_replacement || this.get_replacement).apply(this)
      this.replace_elements();
      if(this["init_replacement"]) this.init_replacement();
      this.init_mouse_events();
    }
    
    function replace_elements(){
      this.element.after(this.replacement);
      this.replacement.append(this.element);
    }
    
    function hover(hover){
      hover ?
        this.replacement.addClass("hover_"+this.element_type) :
        this.replacement.removeClass("hover_"+this.element_type)
    }
    
    function init_mouse_events(){
      var mouse_trigger = this.mouse_trigger();
      mouse_trigger.bind("mouseenter",this,this.hover_handler)
      mouse_trigger.bind("mouseleave",this,this.out_handler)
      mouse_trigger.bind("click",this,this.click_handler)
      
      var label = $("label[for="+this.element_id+"]");
      if(label.length != 0){
        label.bind("click",this,label_handler)
      }
    }
    
    function hover_handler(event){ event.data.hover(true)  }
    function out_handler(event){ event.data.hover(false) }
    
    function active_replacement_class(condition){
      this.replacement[condition ? "addClass" : "removeClass"]("active_"+this.element_type)
    }
    
    function label_handler(e){ 
      e.preventDefault();  
      e.data.replacement.trigger("click");
    }
    
    return function(){
      this.init = init;
      this.replace_elements = replace_elements;
      this.hover = hover;
      this.init_mouse_events = init_mouse_events;
      this.hover_handler = hover_handler;
      this.out_handler = out_handler;
      this.active_replacement_class = active_replacement_class;
      this.label_handler = label_handler;
    }
  })()
  
  // style='height:"+Select.select_height+"px;'
  function Select(element){ this.element = element; this.element_type = "select"; }
  Select.prototype.mouse_trigger = function(){
    return $(".select_content", this.replacement)
  }
  Select.prototype.get_replacement = function(){
    var def_option = $("option:selected",this.element);
    (def_option.length != 0) ||(def_option = $("option:first-child",this.element))
    console.log(def_option,this.element)
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
    var styles = {width:(this.element.outerWidth()-parseInt(this.replacement.css("border-left-width"))-parseInt(this.replacement.css("border-right-width")))};
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
  
  Checkbox.prototype.get_replacement = function(){
    return $("<span class='"+this.element_type+"'></span>");
  }
  
  Checkbox.prototype.click_handler = function (event){
    event.data.check_input();
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
  
  Checkbox.prototype.check_input = function (checked){
    var input = this.element; 
    checked = checked == undefined ? !input.is(":checked") : checked;
     if(!this.uncheckeable || (this.uncheckeable && checked)){ 
      input.attr("checked",checked);
      this.active_replacement_class(checked)
    }
    if(checked) input.triggerHandler("change")
    input.triggerHandler("click")
  }
  
  Radio.prototype = new Checkbox();
  Radio.prototype.check_input = function(checked){
    var input = this.element;
    checked_radios = $("[name="+this.element_name+"]:checked").not(input)
    if(checked_radios.length != 0)
        checked_radios.parent().removeClass("active_"+this.element_type)
    Checkbox.prototype.check_input.call(this,checked == undefined ? undefined : checked);
  }
  
  $._mixin.include(FormElement,Checkbox);
  $._mixin.include(FormElement,Radio);
  $._mixin.include(FormElement,Select);
  
  FormElement.get = function(element){
    var element = $(element);
    if(element.is("select")){
      return Select.create(element)
    }
    else{
      var input_type = element.attr("type");
      switch(input_type){
        case "checkbox": return new Checkbox(element);
        case "radio": return new Radio(element);
      }
    }
  }
  
  function init(options){
    options = options || {}
    return $(this).each(function(){
      var element = FormElement.get(this)
      element.init(options);
    })
  }
  
  
  function check(checked){
    return $(this).each(function(){
      check_input.apply($(this).parent()[0],[checked])
    })
  }
  
  $.fn.custom_form = function( method ) {
  
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  
  };

})( jQuery );