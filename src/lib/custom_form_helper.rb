module CustomFormHelper
  def include_js js
    render "js/#{js.to_s}"
  end
  
  def include_css css
    render "css/#{css.to_s}"
  end
end

