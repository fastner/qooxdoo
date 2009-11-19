qx.Class.define("performance.test.element.Element",
{
  extend : qx.dev.unit.TestCase,
  include : performance.test.MMeasure,
  
  members :
  {
  
    setUp : function()
    {
      var helper = document.createElement("div");
      document.body.appendChild(helper);
  
      this._doc = new qx.html.Root(helper);
      this._doc.setAttribute("id", "doc");
    },
  
  
    tearDown : function()
    {
      qx.html.Element.flush();
      var div = document.getElementById("doc");
      document.body.removeChild(div);
      
      this.children = this._doc.getChildren();
      qx.util.DisposeUtil.disposeArray(this, "children");
      
      this._doc.dispose();
    },
    
  
    CREATE_ITERATIONS : 3000,
    RESIZE_ITERATIONS : 1000,
    DISPOSE_ITERATIONS : 3000,
    
  
    _createElement : function() {
      return new qx.html.Element("div");
    },
    
    
    testCreate : function()
    {
      var elements = [];
      var that = this;
      this.measureRepeated("create element instance", function() {
        elements.push(that._createElement());
      }, this.CREATE_ITERATIONS);
      
      for (var i=0; i<elements.length; i++) {
        elements[i].dispose();
      }
      this.flush();
    },
    
    
    flush : function() {
      qx.html.Element.flush();
    },
    
    
    testRender : function()
    {     
      for (var i=0; i<this.CREATE_ITERATIONS; i++) {
        this._doc.add(this._createElement());
      }
      
      var that = this;
      this.measureRepeated("render/flush elements", function() {
        that.flush();
      }, 1, this.CREATE_ITERATIONS);
    },
    
    
    testResizeAndFlush : function()
    {
      var elements = [];
      for (var i=0; i<this.DISPOSE_ITERATIONS; i++)
      {
        var element = this._createElement();
        this._doc.add(element);
        elements.push(element);
      }
      this.flush();
      
      var l = elements.length;
      var that = this;
      this.measureRepeated("resize/flush elements", function() {
        for (i=0; i<l; i++) {
          elements[i].setStyles({
            width: "300px",
            height: "100px"
          });
        }
        that.flush();
        
        for (i=0; i<l; i++) {
          elements[i].setStyles({
            width: "100px",
            height: "30px"
          });
        }
        that.flush();
      }, 1, this.RESIZE_ITERATIONS);
    },
    
    
    testRemove : function()
    {
      for (var i=0; i<this.CREATE_ITERATIONS; i++) {
        this._doc.add(this._createElement());
      }
      this.elements = qx.lang.Array.clone(this._doc.getChildren());
      
      var that = this;
      this.measureRepeated("remove/flush elements", function() {
        that._doc.removeAll();
        that.flush();
      }, 1, this.CREATE_ITERATIONS);
      
      qx.util.DisposeUtil.disposeArray(this, "elements");
    },
    
    
    testDisposeNonRendered : function()
    {
      var elements = [];
      for (var i=0; i<this.DISPOSE_ITERATIONS; i++) {
        elements.push(this._createElement());
      }
      
      this.measureRepeated("dispose not rendered elements", function() {
        for (var i=0; i<elements.length; i++) {
          elements[i].dispose();
        }
      }, 1, this.DISPOSE_ITERATIONS);

      this.flush();
    },
    
    
    testDisposeRendered : function()
    {
      var elements = [];
      for (var i=0; i<this.DISPOSE_ITERATIONS; i++)
      {
        elements.push(this._createElement());
        this._doc.add(elements[i]);
      }
      this.flush();
      
      var that = this;
      this.measureRepeated("dispose rendered elements", function() {
        for (var i=0; i<elements.length; i++) {
          elements[i].dispose();
        }
        that.flush();
      }, 1, this.DISPOSE_ITERATIONS);

      this.flush();      
    }
  }  
});