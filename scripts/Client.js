
/**
 * current row and final row of the specified name globally know
 */
var CURR_ROW = 0;
var START_ROW = 0;
var END_ROW = 0;
var OOPS = "Oops!";
var OOPS_CONTENT = "We can't find your name! "+ 
        "try to re-enter your name (first and last) and make sure to choose the correct campaign. "+
        "Otherwise, if you're sure you entered your name correctly but still getting an error, "+
        "please talk to your campaign coordinator.";

var OOPS_CONTENT_PREV = "There's nothing to go back to!";
var DONE = "Done!";
var DONE_CONTENT = "Looks like you're all done with the contacts assigned to you! Click 'GOT IT!', "+ 
                   "close this window, and enjoy the rest of your day :)";

var UPDATE = "Updated!";
var UPDATE_CONTENT = "You've successfully updated this record!";


/**
 * ID of spreadsheet with sample data.
 */
var SPREADSHEET_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
/*
* Campaign chosen by caller/texter.
*/
var CHOSEN_CAMPAIGN = "";

/**
 * Page attach event handler.
 * @param {Page} page - application start page.
 */
function onPageAttach(page) {
  var props = page.properties;
  props.Ready = false;
  props.SpreadsheetId = SPREADSHEET_ID;
}




function getRow(row) {
  
  var props = app.currentPage.properties;  
  props.Loading = true;
  props.Error = null;
  props.Ready = false;
      props.CurrentContact =  (CURR_ROW - START_ROW) + 1;

  google.script.run.withFailureHandler(function(error) {    
      props.Loading = false;
      props.Error = "Cannot find name";
      props.PopTitle = OOPS;
      props.PopText = OOPS_CONTENT;
      app.popups.NotificationDialog.visible = true;

  }).withSuccessHandler(function(values) {

    props.CalleeFName = values[0][0];
    props.CalleeLName = values[0][1]; 
    props.CalleeEmail = values[0][3];
    props.CalleeNumber = values[0][2];
    props.ContactOption = values[0][4];
    props.CalleeNote = values[0][5];
    props.ContactDate = (new Date(values[0][6]));
   
    props.Loading = false;
    props.Ready = true;

  }).getRow(SPREADSHEET_ID, row, CHOSEN_CAMPAIGN);
}



function getRange(row) { 
  
  var props = app.currentPage.properties;  
   props.Loading = true;
   props.Error = null;
   props.Ready = false;
  
  var name = props.Name.toUpperCase();
  CHOSEN_CAMPAIGN = props.ChosenCampaign;
    
  google.script.run.withFailureHandler(function(error) {
      props.Loading = false;
      props.Error = "Cannot find name";
  }).withSuccessHandler(function(result1) {
    google.script.run.withFailureHandler(function(error) {
      props.Loading = false;
      props.Error = "Something went wrong";
    }).withSuccessHandler(function(result2) {
      
      props.TotalContacts = result2 - result1;
      props.CurrentContact = START_ROW - CURR_ROW ;

      CURR_ROW = result1;
      START_ROW = result1;
      END_ROW = result2;
      getRow(CURR_ROW);
    }).getEndRow(name, SPREADSHEET_ID, CHOSEN_CAMPAIGN);
  }).getStartRow(name, SPREADSHEET_ID, CHOSEN_CAMPAIGN);

}


/*
* loads next row of spreadsheet
*/
function Next() {
  var props = app.currentPage.properties;  
  
    if (CURR_ROW == END_ROW-1) {
      props.PopTitle = DONE;
      props.PopText = DONE_CONTENT;
      app.popups.NotificationDialog.visible = true;
   //   props.Ready = false;
      return;
      }
  
  if(CURR_ROW < END_ROW-1) {
     CURR_ROW += 1;  
  }
  getRow(CURR_ROW, CHOSEN_CAMPAIGN);
}


/*
* loads previous row of spreadsheet
*/
function Prev() { 
    var props = app.currentPage.properties;  

  if (CURR_ROW == START_ROW) {
      props.PopTitle = OOPS;
      props.PopText = OOPS_CONTENT_PREV;
      app.popups.NotificationDialog.visible = true;
    }
  
  if(CURR_ROW <= END_ROW && CURR_ROW > START_ROW) {
    CURR_ROW-=1;
    getRow(CURR_ROW, CHOSEN_CAMPAIGN);
  }
}

function setCell(cellRange, value) {
  
  var props = app.currentPage.properties;  
  props.Loading = true;
  props.Error = null;

  google.script.run.withFailureHandler(function(error) {
      props.Loading = false;
      props.Error = "Something went wrong: " + error.toString();
  }).withSuccessHandler(function() { 
      props.PopTitle = UPDATE;
      props.PopText = UPDATE_CONTENT;
      app.popups.NotificationDialog.visible = true;
    
      props.Loading = false;
  }).setCellValue(SPREADSHEET_ID, CHOSEN_CAMPAIGN, cellRange, value);
}



/**
 * Updates cell value by spreadsheet ID, sheet name and cell range.
 */
function updateCellValue() {
  var props = app.currentPage.properties;

  var cell_num = CURR_ROW;
  //0-f-name, 1-l-name, 2-number, 3-email, 4-camp, 5-contact-status, 6-notes
  var cells = ["B"+cell_num , "C"+cell_num, "D"+cell_num, "E"+cell_num, "F"+cell_num, "G"+cell_num, "H"+cell_num, "I"+cell_num];
//    setCell(cells[0], props.CalleeFName);
//    setCell(cells[1], props.CalleeLName);
//    setCell(cells[3], props.CalleeEmail);
//    setCell(cells[2], props.CalleeNumber);
    setCell(cells[4], props.ContactOption);
    setCell(cells[5], props.CalleeNote);
    setCell(cells[6], (props.ContactDate).toISOString());
}












