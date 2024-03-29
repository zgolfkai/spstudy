var checkArray;
var checkContainer;
var similarContainer=[];
var finalReport={
    "Parent":0,
    "Child":0,
    "Processed":0,
    "NR-Parent":0,
    "NR-Child":0,
    "Ignore":0,
    "Obstruction":0,
    "Tag found-Gate not open":0,
    "Temp Tag":0,
    "Emergency Vehicle":0,
    "Preauthorized Vendor":0,
    "Other Lane Captured":0,
    "Opted out of LPR":0,
    "Translation Issue":0,
    "Total Records":0,
    "Total Cars Not Processed":0,
    "Total Cars Processed":0,
    "Accuracy":0
  }

function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).replace(/"/g, '').replace(/-/g, '').replace(/:/g, '').replace(/ /g, '').trim().split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).replace(/"/g, '').replace(/\r/g, '').split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

function createReport(sourcefilePath){
  console.log(sourcefilePath);
  $("#downloadReportFile").html('Processing files..')
  
  var filesToLoad=sourcefilePath.srcElement.files
  var finalArray=[];

  var filext;
  console.log(filesToLoad);
  for (i=0;i<filesToLoad.length;i++){
    filext=filesToLoad[i].name.split('.').pop();
    var reader = new FileReader();
    if((filext.toLowerCase()=='xlsm')||(filext.toLowerCase()=='xlsx')){
      reader.readAsBinaryString(filesToLoad[i]);
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Summary']);
        finalArray=XL_row_object;
        console.log('process')
        processReport(finalArray);
        
      };
    
      reader.onerror = function(ex) {
        console.log(ex);
      };
    }
  }
  
}

function processReport(dataArray){
 



  console.log(dataArray);
  
    finalReport["Parent"]+=parseInt(dataArray[1].undefined);
    finalReport["Child"]+=parseInt(dataArray[2].undefined);
    finalReport["Processed"]+=parseInt(dataArray[3].undefined);
    finalReport["NR-Parent"]+=parseInt(dataArray[4].undefined);
    finalReport["NR-Child"]+=parseInt(dataArray[5].undefined);
    finalReport["Ignore"]+=parseInt(dataArray[6].undefined);
    finalReport["Obstruction"]+=parseInt(dataArray[7].undefined);
    finalReport["Tag found-Gate not open"]+=parseInt(dataArray[8].undefined);
    finalReport["Temp Tag"]+=parseInt(dataArray[9].undefined);
    finalReport["Emergency Vehicle"]+=parseInt(dataArray[10].undefined);
    finalReport["Preauthorized Vendor"]+=parseInt(dataArray[11].undefined);
    finalReport["Other Lane Captured"]+=parseInt(dataArray[12].undefined);
    finalReport["Opted out of LPR"]+=parseInt(dataArray[13].undefined);
    finalReport["Translation Issue"]+=parseInt(dataArray[14].undefined);
    finalReport["Total Records"]+=parseInt(dataArray[15].undefined);
    finalReport["Total Cars Not Processed"]+=parseInt(dataArray[8].undefined);
    finalReport["Total Cars Processed"]+=parseInt(dataArray[17].undefined);
    
    
    $('<td>'+dataArray[0].Community.substring(dataArray[0].Community.indexOf('for')+4,dataArray[0].Community.indexOf(','))+'</td>').insertBefore("#Date_Header");
    $('<td>'+parseInt(dataArray[1].undefined)+'</td>').insertBefore("#Parent");
    $('<td>'+parseInt(dataArray[2].undefined)+'</td>').insertBefore("#Child");
    $('<td>'+parseInt(dataArray[3].undefined)+'</td>').insertBefore("#Processed");
    $('<td>'+parseInt(dataArray[4].undefined)+'</td>').insertBefore("#NR-Parent");
    $('<td>'+parseInt(dataArray[5].undefined)+'</td>').insertBefore("#NR-Child");
    $('<td>'+parseInt(dataArray[6].undefined)+'</td>').insertBefore("#Ignore");
    $('<td>'+parseInt(dataArray[7].undefined)+'</td>').insertBefore("#Obstruction");
    $('<td>'+parseInt(dataArray[8].undefined)+'</td>').insertBefore("#Tagfound-Gatenotopen");
    $('<td>'+parseInt(dataArray[9].undefined)+'</td>').insertBefore("#TempTag");
    $('<td>'+parseInt(dataArray[10].undefined)+'</td>').insertBefore("#EmergencyVehicle");
    $('<td>'+parseInt(dataArray[11].undefined)+'</td>').insertBefore("#PreauthorizedVendor");
    $('<td>'+parseInt(dataArray[12].undefined)+'</td>').insertBefore("#OtherLaneCaptured");
    $('<td>'+parseInt(dataArray[13].undefined)+'</td>').insertBefore("#OptedoutofLPR");
    $('<td>'+parseInt(dataArray[14].undefined)+'</td>').insertBefore("#TranslationIssue");
    $('<td>'+parseInt(dataArray[15].undefined)+'</td>').insertBefore("#TotalRecords");
    $('<td>'+parseInt(dataArray[8].undefined)+'</td>').insertBefore("#TotalCarsNotProcessed");
    $('<td>'+parseInt(dataArray[17].undefined)+'</td>').insertBefore("#TotalCarsProcessed");
    $('<td>'+((parseInt(dataArray[17].undefined)/parseInt(dataArray[15].undefined))*100).toLocaleString(
    undefined, // leave undefined to use the visitor's browser 
               // locale or a string like 'en-US' to override it.
    { minimumFractionDigits: 2 })+'</td>').insertBefore("#Accuracy");

  console.log(finalReport);
  $("#Parent").html(finalReport["Parent"]);
  $("#Child").html(finalReport["Child"]);
  $("#Processed").html(finalReport["Processed"]);
  $("#NR-Parent").html(finalReport["NR-Parent"]);
  $("#NR-Child").html(finalReport["NR-Child"]);
  $("#Ignore").html(finalReport["Ignore"]);
  $("#Obstruction").html(finalReport["Obstruction"]);
  $("#Tagfound-Gatenotopen").html(finalReport["Tag found-Gate not open"]);
  $("#TempTag").html(finalReport["Temp Tag"]);
  $("#EmergencyVehicle").html(finalReport["Emergency Vehicle"]);
  $("#PreauthorizedVendor").html(finalReport["Preauthorized Vendor"]);
  $("#OtherLaneCaptured").html(finalReport["Other Lane Captured"]);
  $("#OptedoutofLPR").html(finalReport["Opted out of LPR"]);
  $("#TranslationIssue").html(finalReport["Translation Issue"]);
  $("#TotalRecords").html(finalReport["Total Records"]);
  $("#TotalCarsNotProcessed").html(finalReport["Total Cars Not Processed"]);
  $("#TotalCarsProcessed").html(finalReport["Total Cars Processed"]);
  $("#Accuracy").html(((finalReport["Total Cars Processed"]/finalReport["Total Records"])*100).toLocaleString(
    undefined, // leave undefined to use the visitor's browser 
               // locale or a string like 'en-US' to override it.
    { minimumFractionDigits: 2 }));
    $("#downloadReportFile").html('')
    $(".reportTable").css('display','block')
}
function newCommunity(csvFilePath){
  $("#downloadFile").html('Processing file..')
  var reader = new FileReader();

  var fileToLoad=csvFilePath.srcElement.files[0]
  console.log(fileToLoad.name);
  var finalArray;
  var current;

  var filext=fileToLoad.name.split('.').pop();

  if(filext.toLowerCase()=='xlsx'){
    reader.readAsBinaryString(fileToLoad);
    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        finalArray = XL_row_object;
        
      })
      console.log(finalArray);
      processComm(finalArray,fileToLoad)
    };
  
    reader.onerror = function(ex) {
      console.log(ex);
    };
  
    
  }else if(filext.toLowerCase()=='csv'){
    reader.readAsText(fileToLoad);
    reader.onload = function(e) {
      finalArray = csvToArray(e.target.result);
      console.log(finalArray);
      processComm(finalArray,fileToLoad)
    }
    
  }
}

function processComm(checkArray,fileToLoad){
 /* checkArray = cleanBlanks(checkArray);
  checkArray.forEach(function(check){
    check.similarity=0;
    check.plateSim='';
  })
  
  for(i=0;i<checkArray.length;i++){
    for(j=0;j<checkArray.length;j++){
      if(i!=j){
        currentSim=similarity(checkArray[i].Plate,checkArray[j].Plate)
        if(currentSim>checkArray[i].similarity){
          checkArray[i].similarity=currentSim;
          checkArray[i].plateSim=checkArray[j].Plate;
        }
      }
    }
  }
  console.log($("#plateMatch").prop("checked"));
  if($("#plateMatch").prop("checked")){
    checkArray.sort((a, b) => {
        var fa = a.plateSim.toLowerCase(), fb = b.plateSim.toLowerCase();
      if (fa < fb) {
          return -1;
      }
      if (fa > fb) {
          return 1;
      }
      return 0;
    });
  }
  console.log(checkArray)
  
  data={
    filename:fileToLoad.name.substring(0,fileToLoad.name.length-4),
    message:checkArray
  }

  try{
    $.ajax({
      type:"POST",
      url:"/api/createxls" ,
      data:JSON.stringify(data),
      headers:{
        "Content-Type":"application/json"
      },
      //dataType:"json",
      success:function(data){
        $("#downloadFile").html('Click to download: <a href="'+data.location+'">'+data.filename+'</a>')
        return;
      },
      error:function(error){
        console.log(error);
      }
    });
  }catch(error){
    console.log(error)
  }*/
}


function parseData(csvFilePath){
  //check csvFilePath
  $("#downloadFile").html('Processing file..')
  var reader = new FileReader();

  var fileToLoad=csvFilePath.srcElement.files[0]
  console.log(fileToLoad.name);
  var finalArray;
  var current;

  var filext=fileToLoad.name.split('.').pop();

  if(filext.toLowerCase()=='xlsx'){
    reader.readAsBinaryString(fileToLoad);
    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        finalArray = XL_row_object;
        
      })
      processData(finalArray,fileToLoad)
    };
  
    reader.onerror = function(ex) {
      console.log(ex);
    };
  
    
  }else if(filext.toLowerCase()=='csv'){
    reader.readAsText(fileToLoad);
    reader.onload = function(e) {
      finalArray = csvToArray(e.target.result);
      console.log(finalArray);
      processData(finalArray,fileToLoad)
    }
    
  }
  
  
    //displayCheckData(similarContainer);
};

function processData(checkArray,fileToLoad){
  checkArray = cleanBlanks(checkArray);
  checkArray.forEach(function(check){
    check.similarity=0;
    check.plateSim='';
  })
  
  for(i=0;i<checkArray.length;i++){
    for(j=0;j<checkArray.length;j++){
      if(i!=j){
        currentSim=similarity(checkArray[i].Plate,checkArray[j].Plate)
        if(currentSim>checkArray[i].similarity){
          checkArray[i].similarity=currentSim;
          checkArray[i].plateSim=checkArray[j].Plate;
        }
      }
    }
  }
  console.log($("#plateMatch").prop("checked"));
  if($("#plateMatch").prop("checked")){
    checkArray.sort((a, b) => {
        var fa = a.plateSim.toLowerCase(), fb = b.plateSim.toLowerCase();
      if (fa < fb) {
          return -1;
      }
      if (fa > fb) {
          return 1;
      }
      return 0;
    });
  }
  console.log(checkArray)
  
  data={
    filename:fileToLoad.name.substring(0,fileToLoad.name.length-4),
    message:checkArray
  }

  try{
    $.ajax({
      type:"POST",
      url:"/api/createxls" ,
      data:JSON.stringify(data),
      headers:{
        "Content-Type":"application/json"
      },
      //dataType:"json",
      success:function(data){
        $("#downloadFile").html('Click to download: <a href="'+data.location+'">'+data.filename+'</a>')
        return;
      },
      error:function(error){
        console.log(error);
      }
    });
  }catch(error){
    console.log(error)
  }
}


function cleanBlanks(data){
  var cleanData=data.filter(row => row.Plate !== undefined).filter(row => row.Plate.length > 0);
  return cleanData;
}

function displayCheckData(data){
  var html='';
  var highlight='#fff7bf';
  data.forEach(row=>{
    if(highlight=='#fff7bf'){
      highlight='#bfffd7'
    } else {
      highlight='#fff7bf'
    }
    row.forEach(row2=>{
      html+='<tr style="background-color:'+highlight+'">';
      html+='<td>'+checkArray[row2].Timestamp+'</td>';
      html+="<td><select class='comments-group' id='"+checkArray[row2].Timestamp.replace(/[^\w\s]/gi, '')+checkArray[row2].Plate+"'><option value='0' >Select Comment</option><option value='Master LPR'>Master LPR</option><option value='Common LPR'>Common LPR</option>      <option value='Obstruction'>Obstruction</option>      <option value='Not entered into the system'>Not entered into the system</option>      <option value='Undetected but shows in the system'>Undetected but shows in the system</option>      <option value='Temp Tag'>Temp Tag</option>      <option value='Not recognized by the system'>Not recognized by the system</option>      <option value='Translation Issue'>Translation Issue</option>      <option value='Resolved-Not recognized by the system'>Resolved-Not recognized by the system</option>      </select></td>";
      html+='<td>'+checkArray[row2].IsVisitorAccessAllowed+'</td>';
      html+='<td class="plate_num" onclick=displayImage("'+checkArray[row2].TagImage+'",this)>'+checkArray[row2].Plate+'</td>';
      html+='<td>'+checkArray[row2].ResidentFoundCount+'</td>';
      html+='<td>'+checkArray[row2].VisitorFoundCount+'</td>';
      html+='</tr>';
    })
  })
  $('#check_data_body').html(html);
  var ids = $('.comments-group').map(function(index) {
    // this callback function will be called once for each matching element
    return this.id; 
  });
  console.log(ids.toArray());
  ids.toArray().forEach(id=>{
    console.log(id);
    if(id!=''){
      console.log(checkArray[checkArray.findIndex(x => x.Timestamp.replace(/[^\w\s]/gi, '') + "" + x.Plate == id)].Comment);
      console.log(id);
      console.log($('#'+id).val());
      $('#'+id).val(checkArray[checkArray.findIndex(x => x.Timestamp.replace(/[^\w\s]/gi, '') + "" + x.Plate == id)].Comment);
    }
  })
}

function displayImage(src,e){
  $('.plate_num').css('border','none');
  $(e).css('border','1px solid black');
  $('.img_container').attr("src","");
  $('#plate_zoom').css("background-image","none");
  $('.img_container').attr("src",src);

  

  $("img").on("load", function() {
    $('.img-zoom-lens').remove();
      imageZoom("plate_img", "plate_zoom");

  }).each(function() {
    if(this.complete) {
      $(this).trigger('load');
      $('.img-zoom-lens').remove();
      imageZoom("plate_img", "plate_zoom");
    }
  });

  

}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return ((longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)*100);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function isArrayInArray(x, check) {
  var result = x.find(function(ele) {
    return (JSON.stringify(ele) === JSON.stringify(check));
  }) 
  return result !=null
}

function imageZoom(imgID, resultID) {
  var img, lens, result, cx, cy;
  img = document.getElementById(imgID);
  result = document.getElementById(resultID);
  /* Create lens: */
  lens = document.createElement("DIV");
  lens.setAttribute("class", "img-zoom-lens");
  /* Insert lens: */
  img.parentElement.insertBefore(lens, img);
  /* Calculate the ratio between result DIV and lens: */
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;
  /* Set background properties for the result DIV */
  result.style.backgroundImage = "url('" + img.src + "')";
  result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
  /* Execute a function when someone moves the cursor over the image, or the lens: */
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mousemove", moveLens);
  /* And also for touch screens: */
  lens.addEventListener("touchmove", moveLens);
  img.addEventListener("touchmove", moveLens);
  function moveLens(e) {
    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    /* Calculate the position of the lens: */
    x = pos.x - (lens.offsetWidth / 2);
    y = pos.y - (lens.offsetHeight / 2);
    /* Prevent the lens from being positioned outside the image: */
    if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
    if (x < 0) {x = 0;}
    if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
    if (y < 0) {y = 0;}
    /* Set the position of the lens: */
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    /* Display what the lens "sees": */
    result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
  }
  function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    a = img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
  }
}

function ExcelToJSON(){

  this.parseExcel = function(file) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });

      workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        console.log(json_object);

      })

    };

    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};