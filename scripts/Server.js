/**
 * Gets spreadsheet range basing on provided spreadsheet ID, sheet name and
 *     cell range.
 * @param {!string} spreadsheetId - spreadsheet ID to get cell range.
 * @param {!string} sheetName - spreadsheet sheet name to get cell range.
 * @param {!string} cellRange - cell range specified as A1 notation.
 * @return {!Range} the range at the location designated.
 */
function getRange_(spreadsheetId, sheetName, cellRange) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  //var sheet = spreadsheet.getSheets()[0];
  var sheet = spreadsheet.getSheetByName(sheetName);
  return sheet.getRange(cellRange);
}



/**
 * Gets all the the start row for the specified name.
 * @param {!string} name - name to be found.
 * @param {!string} spreadsheetId - spreadsheet ID to get sheets list.
 * @return {!integer} an integer of start row position.
 */
function getStartRow(name, spreadsheetId, campaign) {
  var row_from = 1;
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(campaign);
 
  for(row_from = 1; row_from < sheet.getMaxRows(); row_from++){
    var range = sheet.getRange(row_from, 1);

    var values = range.getValues();

    if (values[0][0].toUpperCase() == name){
//      console.log("found: " + values[0][0]);
      return row_from;
    }
  }
}




/**
 * Gets all the the end row for the specified name.
 * @param {!string} name - name to be found.
 * @param {!string} spreadsheetId - spreadsheet ID to get sheets list.
 * @return {!integer} an integer of end row position.
 */
function getEndRow(name, spreadsheetId, campaign) {
  var start_row = getStartRow(name, spreadsheetId, campaign);
  var interval = 0;
  
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(campaign);
  
  for(var i = start_row; i < sheet.getMaxRows(); i++){
    var range = sheet.getRange(i, 1);
    var values = range.getValues();
    if (values[0][0].toUpperCase() == name){
      interval+=1;
    }    
  }
  return {'start':start_row,'end':start_row + interval};
}


/**
 * Gets a row from the sheet with the specified id, name, and row number
 * @param {!string} spreadsheetId - spreadsheet ID to get cell value.
 * @param {!integer} row - row number of content to be returned.
 * @return {!Array<string>}  an array of all the row data.
 */
function getRow(spreadsheetId, row, campaign) { 
//  console.log("server getRow: "+row);
  var ss = SpreadsheetApp.openById(spreadsheetId);
  
  var sheet = ss.getSheetByName(campaign); 
  var range = sheet.getRange(row, 2, 1, 7);
  var values = range.getValues();
  return values;
}




/**
 * Updates spreadsheet cell value basing on provided spreadsheet ID, sheet name
 *     and cell range.
 * @param {!string} spreadsheetId - spreadsheet ID to update cell value.
 * @param {!string} sheetName - spreadsheet sheet name to update cell value.
 * @param {!string} cellRange - cell range specified as A1 natation.
 * @param {!string} value - new cell value.
 */
function setCellValue(spreadsheetId, sheetName, cellRange, value) {
  var range = getRange_(spreadsheetId, sheetName, cellRange);
//  console.log("server range:" + cellRange);
//  console.log("server value: " + value);
  range.setValue(value);
}