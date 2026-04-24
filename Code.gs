var SHEET_ID = '1_HCRVLnd02aj_VzHHFJCEC69cmXh77NIcpZi5VhT3IY';

function getSheet(name) {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name);
}

function sheetToObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  return data.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function respond(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

function appendLog(action, nodeOrEdge, id, userNote) {
  var log = getSheet('Log');
  log.appendRow([new Date().toISOString(), action, nodeOrEdge, id, userNote || '']);
}

function doGet(e) {
  var action = e.parameter.action;
  var nodesSheet = getSheet('Nodes');
  var edgesSheet = getSheet('Edges');

  if (action === 'getNodes') {
    return respond({ success: true, data: sheetToObjects(nodesSheet) });
  }
  if (action === 'getEdges') {
    return respond({ success: true, data: sheetToObjects(edgesSheet) });
  }
  if (action === 'getAll') {
    return respond({
      success: true,
      nodes: sheetToObjects(nodesSheet),
      edges: sheetToObjects(edgesSheet)
    });
  }
  return respond({ success: false, error: 'Unknown action: ' + action });
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var action = body.action;

  if (action === 'addNode') {
    var sheet = getSheet('Nodes');
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headers.map(function(h) { return body.data[h] !== undefined ? body.data[h] : ''; });
    sheet.appendRow(row);
    appendLog('addNode', 'node', body.data.id, body.data.notes);
    return respond({ success: true });
  }

  if (action === 'addEdge') {
    var sheet = getSheet('Edges');
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headers.map(function(h) { return body.data[h] !== undefined ? body.data[h] : ''; });
    sheet.appendRow(row);
    appendLog('addEdge', 'edge', body.data.id, body.data.notes);
    return respond({ success: true });
  }

  if (action === 'updateNode') {
    var sheet = getSheet('Nodes');
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idCol = headers.indexOf('id');
    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] === body.data.id) {
        var row = headers.map(function(h) { return body.data[h] !== undefined ? body.data[h] : data[i][headers.indexOf(h)]; });
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
        appendLog('updateNode', 'node', body.data.id, '');
        return respond({ success: true });
      }
    }
    return respond({ success: false, error: 'Node not found: ' + body.data.id });
  }

  if (action === 'updateEdge') {
    var sheet = getSheet('Edges');
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idCol = headers.indexOf('id');
    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] === body.data.id) {
        var row = headers.map(function(h) { return body.data[h] !== undefined ? body.data[h] : data[i][headers.indexOf(h)]; });
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
        appendLog('updateEdge', 'edge', body.data.id, '');
        return respond({ success: true });
      }
    }
    return respond({ success: false, error: 'Edge not found: ' + body.data.id });
  }

  if (action === 'deleteNode') {
    var sheet = getSheet('Nodes');
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idCol = headers.indexOf('id');
    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] === body.id) {
        sheet.deleteRow(i + 1);
        appendLog('deleteNode', 'node', body.id, '');
        return respond({ success: true });
      }
    }
    return respond({ success: false, error: 'Node not found: ' + body.id });
  }

  if (action === 'deleteEdge') {
    var sheet = getSheet('Edges');
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idCol = headers.indexOf('id');
    for (var i = 1; i < data.length; i++) {
      if (data[i][idCol] === body.id) {
        sheet.deleteRow(i + 1);
        appendLog('deleteEdge', 'edge', body.id, '');
        return respond({ success: true });
      }
    }
    return respond({ success: false, error: 'Edge not found: ' + body.id });
  }

  return respond({ success: false, error: 'Unknown action: ' + action });
}
