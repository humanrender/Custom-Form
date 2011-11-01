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
  }
  
<%= include_js :form_element %>

<%= include_js :checkbox_and_radio %>

<%= include_js :select %>

<%= include_js :file %>

<%= include_js :engine %>
  
  
  $.fn.custom_form = function( method ) {
    var instance = CustomForm.get_custom_form_instance();
    if((typeof method != "string") || !method)
      return instance.init(this,method /*options*/);
    else 
      return instance.execute(this,arguments);
  };
  
})(jQuery)