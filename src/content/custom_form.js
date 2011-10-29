(function($){

  var $$ = {},
  DEFAULTS = { 
    file_button:"Choose file",
    file_label:"No file chosen",
    responsive_select:false,
    responsive_file:false
  };
  
<%= include_js :form_element %>
<%= include_js :checkbox %>
<%= include_js :custom_form %>
  
  
  $.fn.custom_form = function( method ) {
    var instance = CustomForm.get_custom_form_instance();
    if((typeof method != "string") || !method)
      return instance.init(this,method /*options*/);
    else 
      return instance.execute(this,arguments);
  };
  
})(jQuery)