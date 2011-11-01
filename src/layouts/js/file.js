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