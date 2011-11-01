class YuiCompressorFilter < Nanoc3::Filter
  identifier :yui
  type :text
  
  def run content, params
    compressed = case @item[:extension]
      when "js"
        YUI::JavaScriptCompressor.new(:munge=>true).compress(content)
      when "css"
        YUI::CssCompressor.new().compress(content)
      else
        raise "Invalid extension for yui compression"
    end
    File.open("../bin/"+@item.identifier.chop+".min."+@item[:extension], 'w') {|f| f.write(compressed) }
    content
  end
end