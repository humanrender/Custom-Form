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