# =====================
# = Custom Forms v0.1 =
# =====================

I wrote this after trying a lot of form beautifiers. 

Don't get me wrong, plugins like Uniform.js are great. However, I'm lazy and I don't like building complicated sprites or giving fixed widths to every element.

I know it's not the most lightweight plugin out there;  it requires a full 20kb between js, styles and a png. But it does the job for me :D 

I'm not a very good designer so I took the designs from the Yahoo! developer network.
http://developer.yahoo.com/ypatterns/about/stencils/fireworks.html

More method and customization options are on the way.

Feel free to use it or send feedback.

# ============
# = Features =
# ============
  
  - Checkbox & Radios
    - Painless styling, no arcane mark-up or anything. Your checkbox gets subtituted for an inline-block span.
    
  - Selects
    - Full CSS styling, no more complicated sprites. 
    - Seamless subtitution, the replacement mark-up will have the same size as your original selects.
    - Native select behavior

# =========
# = Usage =
# =========
  
  <input type="checkbox" id="custom_checkbox_0" name="ids[]" value="0"/>
  <label for="custom_checkbox_0">Checkbox 0</label>
  
  <input type="radio" id="name_0" name="name" value="0"/>
  <label for="name_0">Radio 0</label>
  
  <select id='select_1' name="select_1" class="custom_select">
    ...
  </select>
  
  <script type="text/javascript" charset="utf-8">
    var inputs = $("input[type=checkbox],input[type=radio], select").custom_form();
  </script>
  
  # Replacement mark-up
  
  <span class="checkbox"><input type="checkbox" id="custom_checkbox_0" name="ids[]" value="0"></span>
  <label for="custom_checkbox_0">Checkbox 0</label>
  
  <span class="radio"><input type="radio" id="name_0" name="name" value="0"></span>
  <label for="name_0">Radio 0</label>
  
  <span class="select" style="width: 76px; ">      
    <span class="select_content">
      <span class="select_button">
        <span class="select_button_icon"></span>        
      </span>        
      <p class="select_label" style="width: 50px; padding-right: 0px; ">Option 1</p>
    </span>    
    <select id="select_1" name="select_1" class="checkboxes" style="width: 76px; ">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
      <option value="4">Option 4</option>
      <option value="5">Option 5</option>
      <option value="6">Option 6</option>
    </select>
  </span>

# ============
# = Browsers =
# ============
  
  IE7+, FF5, Chrome 13.0.782.220, Safari 5
  
# ===========
# = Roadmap =
# ===========

  - Style refactoring to remove duplicates
  - JS refactoring to reduce file size