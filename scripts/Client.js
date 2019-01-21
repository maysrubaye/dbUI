/**
 * current row and final row of the specified name globally know
 */
var CURR_ROW = 0;
var START_ROW = 0;
var END_ROW = 0;

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
  props.SpreadsheetId = SPREADSHEET_ID;
}




function getRow(row) {
    var props = app.currentPage.properties;
  google.script.run.withSuccessHandler(function(values) {

    props.CalleeFName = values[0][0];
    props.CalleeLName = values[0][1]; 
    props.CalleeEmail = values[0][2];
    props.CalleeNumber = values[0][3];
    props.Camp = values[0][4];
    props.ContactOption = values[0][5];
    props.CalleeNote = values[0][6];
    props.ContactDate = (new Date(values[0][7]));
  }).getRow(SPREADSHEET_ID, row, CHOSEN_CAMPAIGN);
}



function getRange(row) { 
  
  var props = app.currentPage.properties;
  var name = props.Name.toUpperCase();
  CHOSEN_CAMPAIGN = props.ChosenCampaign;
    
  google.script.run.withSuccessHandler(function(result1) {
    google.script.run.withSuccessHandler(function(result2) {

      CURR_ROW = result1;
      START_ROW = result1;
      END_ROW = result2;
      row = parseInt(result1);
      var e = parseInt(result2);
      getRow(CURR_ROW);
                                         
    }).getEndRow(name, SPREADSHEET_ID, CHOSEN_CAMPAIGN);
  }).getStartRow(name, SPREADSHEET_ID, CHOSEN_CAMPAIGN);

}


/*
* loads next row of spreadsheet
*/
function Next() {
  if(CURR_ROW < END_ROW-1) {
     CURR_ROW += 1;  
  }
  getRow(CURR_ROW, CHOSEN_CAMPAIGN);
}


/*
* loads previous row of spreadsheet
*/
function Prev() { 
  if(CURR_ROW <= END_ROW && CURR_ROW > START_ROW) {
    CURR_ROW-=1;
    getRow(CURR_ROW, CHOSEN_CAMPAIGN);
  }
  
}

function setCell(cellRange, value) {
  google.script.run.withSuccessHandler(function() { 
  }).setCellValue(SPREADSHEET_ID, CHOSEN_CAMPAIGN, cellRange, value);
}



/**
 * Updates cell value by spreadsheet ID, sheet name and cell range.
 */
function updateCellValue() {
  var props = app.currentPage.properties;

  var cell_num = CURR_ROW;
  //0-f-name, 1-l-name, 2-email, 3-number, 4-camp, 5-contact-status, 6-notes
  var cells = ["B"+cell_num , "C"+cell_num, "D"+cell_num, "E"+cell_num, "F"+cell_num, "G"+cell_num, "H"+cell_num, "I"+cell_num];
    setCell(cells[0], props.CalleeFName);
    setCell(cells[1], props.CalleeLName);
    setCell(cells[2], props.CalleeEmail);
    setCell(cells[3], props.CalleeNumber);
    setCell(cells[4], props.Camp);
    setCell(cells[5], props.ContactOption);
    setCell(cells[6], props.CalleeNote);
    setCell(cells[7], (props.ContactDate).toISOString());
}

