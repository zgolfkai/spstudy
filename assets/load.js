<<<<<<< HEAD
var checkArray;
var checkContainer;
var similarContainer=[];

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

function parseData(csvFilePath){
  //check csvFilePath
  var reader = new FileReader();

  var fileToLoad=csvFilePath.srcElement.files[0]
  console.log(fileToLoad.name);

  reader.readAsText(fileToLoad);
  reader.onload = function (e) {
      var checkArray = csvToArray(e.target.result);
      var finalArray=[];
      var current;
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
      checkArray.sort((a, b) => {
        let fa = a.plateSim.toLowerCase(), fb = b.plateSim.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
      });
      console.log(checkArray)
      /*while(checkArray.length>0){
        current=checkArray.splice(0,1);
        console.log(current);
        console.log(checkArray.length);
        finalArray.push(current[0]);
        checkArray.forEach(function(check){
          if(similarity(current[0].Plate,check.Plate)>0.5){
            finalArray.push(checkArray.splice(checkArray.indexOf(check),1)[0])
          }
        })
      }*/

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
            $("#downloadFile").html('<a href="'+data.location+'">'+data.filename+'</a>')
            return;
          },
          error:function(error){
            console.log(error);
          }
        });
      }catch(error){
        console.log(error)
      }

      //displayCheckData(similarContainer);
  };
}

function cleanBlanks(data){
  var cleanData=data.filter(row => row.PartitionKey.length > 0);
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
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
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
=======
var checkArray;
var checkContainer;
var similarContainer=[];

$(document).ready(function () {

  $(window).on('resize', function (){
    $('.img-zoom-lens').remove();
    imageZoom("plate_img", "plate_zoom")
  })


  
});


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

function parseData(csvFilePath){
  //check csvFilePath
  var reader = new FileReader();

  var fileToLoad=csvFilePath.srcElement.files[0]
  console.log(fileToLoad);

  reader.readAsText(fileToLoad);
  reader.onload = function (e) {
      checkArray = csvToArray(e.target.result);
      console.log(checkArray);
      var notFound00 = checkArray.filter(obj => {
        return (obj.ResidentFoundCount == 0) && (obj.VisitorFoundCount == 0); 
      })
      console.log(notFound00);
      var similarTemp=[]
      notFound00.forEach((row,index)=>{
        counter=0;
        do {
          counter++;
          var similar=similarity(row.Plate,checkArray[checkArray.findIndex(x => x.Timestamp == row.Timestamp)-counter].Plate);
          console.log("Similarity: " + similar);
          if (similar > 0.50){
            if (counter==1){
              similarTemp.push(checkArray.findIndex(x => x.Timestamp == row.Timestamp));
            }
            similarTemp.push(checkArray.findIndex(x => x.Timestamp == row.Timestamp)-counter)
          }
        } while (similar>0.50);
        do {
          counter--;
          var similar=similarity(row.Plate,checkArray[checkArray.findIndex(x => x.Timestamp == row.Timestamp)-counter].Plate);
          console.log("Similarity: " + similar);
          if (similar > 0.50){
            if (counter==-1){
              similarTemp.push(checkArray.findIndex(x => x.Timestamp == row.Timestamp));
            }
            similarTemp.push(checkArray.findIndex(x => x.Timestamp == row.Timestamp)-counter)
          }
        } while (similar>0.50);
        if (similarTemp.length>0){
          var duplicate=false;
          similarTemp=[...new Set(similarTemp.sort())];
          if(!isArrayInArray(similarContainer,similarTemp)){
            similarContainer.push(similarTemp);
          };
          similarTemp=[];
        }
      })
      displayCheckData(similarContainer);
  };
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
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
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
>>>>>>> a60495a739c01180e9af63ba6c7b8dcd464ecb24
}