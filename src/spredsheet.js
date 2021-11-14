// var ss = SpreadsheetApp.openById("xxxxx")
// var sheet = ss.getSheetByName("データ3")
// var lastRow = sheet.getLastRow();
// var lastCol = sheet.getLastColumn();
// var p_names = sheet.getRange(1, 2, 1, lastCol - 1).getValues();

function addtoggldatas(datas) {

  for (var i = 0; i < datas.length; i++) {
    var data = datas[i];
    arr.push([date, data.id, data.pid, data.project, data.client, data.dur / 1000 / 60, data.description, data.start, data.end, data.updated, data.tags]);
  }

  const startRow = lastRow + 1
  const startColumn = 1
  const numOfRow = arr.length
  const numOfColumn = arr[0].length
  sheet.getRange(startRow, startColumn, numOfRow, numOfColumn).setValues(arr);
}
