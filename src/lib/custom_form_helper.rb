require "singleton"

module CustomFormHelper
  def include_js js
    render "js/#{js.to_s}"
  end
  
  def include_css css
    render "css/#{css.to_s}"
  end
  
  def tabindex
    " tabindex='{Tabindex.instance.tabindex}'"
  end
end

class Tabindex
  @@index = 0
  
  include Singleton
  
  def self.tabindex
    return @@index = @@index + 1
  end
end