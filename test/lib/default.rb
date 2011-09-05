def qunit_gui
  %~
    <h1 id="qunit-header">QUnit Test Suite</h1>
    <h2 id="qunit-banner"></h2>
    <div id="qunit-testrunner-toolbar"></div>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>
    <div id="qunit-fixture">test markup</div>
  ~
end

def mapped_selectors selector_name, collection, options = {}
  options = {:type=>:class}.merge options
  mapped_selector = collection.map{|item| %~#{selector_name}#{item}~}
  %~"#{mapped_selector.join(",").to_s}"~
end