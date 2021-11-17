function deleteTimeEntry(id) {
  const uri = TOGGL_API_HOSTNAME + "/api/v8/time_entries/" + id
  try {
    var response = UrlFetchApp.fetch(
      uri,
      {
        'method': 'DELETE',
        'headers': { 'Authorization': ' Basic ' + authData },
        'muteHttpExceptions': true,
      }
    );
    response = JSON.parse(response);
    console.log("Delete:", response)
  } catch (e) {
    Logger.log([e])
  }

}
function updateTimeEntry(id, updateItem) {
  const uri = TOGGL_API_HOSTNAME + "/api/v8/time_entries/" + id
  const payload = {
    'time_entry': {
      ...updateItem
    }
  }
  try {
    var response = UrlFetchApp.fetch(
      uri,
      {
        'method': 'PUT',
        'headers': { 'Authorization': ' Basic ' + authData, 'Content-Type': 'application/json' },
        'muteHttpExceptions': true,
        'payload': JSON.stringify(payload)
      }
    );
    response = JSON.parse(response);
    console.log("UPDATE:", response)
  } catch (e) {
    Logger.log([e])
  }
}

function createTimeEntry(description, start, end, pid) {
  const uri = TOGGL_API_HOSTNAME + "/api/v8/time_entries"
  const payload = {
    'time_entry': {
      'description': description,
      'start': start,
      'duration': (new Date(end) - new Date(start)) / 1000,
      'pid': pid,
      'created_with': 'gas_api'
    }
  }
  try {
    var response = UrlFetchApp.fetch(
      uri,
      {
        'method': 'POST',
        'headers': { 'Authorization': ' Basic ' + authData, 'Content-Type': 'application/json' },
        'muteHttpExceptions': true,
        'payload': JSON.stringify(payload)
      }
    );
    response = JSON.parse(response);
    console.log("Create:", [description, start, end, pid, response])
  } catch (e) {
    Logger.log([e])
  }
}

function getWorkReportsDetaileds(date) {
  var work_data = []
  const datas = getReportsDetaileds(date);
  for (var i = 0; i < datas.length; i++) {
    var data = datas[i];
    //time entryのデータにクライアントが設定されていないものは、skipする
    if(data.client==undefined){
      console.log("skip:no client",data)
      continue
    }
    //仕事中のデータを抽出するためにフィルタリングする
    if (data.client.indexOf("xxxx") != -1) {
      work_data.push(data)
    }
  }
  work_data.sort((a, b) => new Date(a.start) - new Date(b.start))
  return work_data;
}

function getReportsDetaileds(date) {
  const workspace_ids = getWorkspaceId();
  const api = "/reports/api/v2/details?workspace_id=" + workspace_ids[0].id + "&since=" + date + "&until=" + date + "&user_agent=api_test";
  const datas = getToggleRequest(api);
  return datas.data;

}

function getWorkspaceId() {
  const api = "/api/v8/workspaces"
  const datas = getToggleRequest(api)
  return datas;
}

function getToggleRequest(api) {
  const uri = TOGGL_API_HOSTNAME + api;
  try {
    var response = JSON.parse(UrlFetchApp.fetch(
      uri,
      {
        'method': 'GET',
        'headers': { "Authorization": " Basic " + authData },
        'muteHttpExceptions': true
      }
    ));
    return response;
  }
  catch (e) {
    Logger.log([e]);
  }

}
