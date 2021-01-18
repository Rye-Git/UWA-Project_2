// let url = "/api/population/countries";
// d3.json(url, function(response){
//     var table_list = [];
//     let data = response[0]["data"];
//     for (let i=0; i<data.length; i++) {
//         table_list.push(data[i]);
//     }

    // webix.protoUI({
    //     name:"datatable",
    //     $init:function(config){
    //       this.$view.id = config.id;
    //     }
    //   }, webix.ui.template);
      
      
    //   webix.ui({
    //     rows:[
    //       { type:"header", template:"Preview" },
    //       { view:"datatable", id:"aaa", data:[table_list] }
    //     ]
    //   });
      
    //   document.getElementById("aaa").style.color = "red";

    // });


    let url = "/api/population/countries";
d3.json(url, function(response){
    window.country_list = [];
    let data = response[0]["data"];
    for (let i=0; i<data.length; i++) {
        country_list.push(data[i]["Country"]);
    }
    country_list.sort();

    webix.ui({
        rows:[
          { type:"header", template:"Preview" },
          { view:"datatable", id:"aaa", data:[table_list] }
        ]
      });
      
      document.getElementById("aaa").style.color = "red";
});

