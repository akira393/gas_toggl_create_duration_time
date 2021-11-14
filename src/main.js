//月毎にシートを分けて、id	client	project	description	tagを記入した方がよさそう

var CACHE_KEY = 'toggl_exporter:lastmodify_datetime';
var TIME_OFFSET = 9 * 60 * 60; // JST
var TOGGL_API_HOSTNAME = 'https://api.track.toggl.com';
var TOGGL_BASIC_AUTH = 'yourtogglapi';
var authData = Utilities.base64Encode(TOGGL_BASIC_AUTH + ":api_token");
var now = new Date();
var date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
date.setDate(date.getDate() - 1);
var date = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy-MM-dd');
var arr = []
var work_data = []


function main() {
  //指定した日付の仕事に関する詳細レポートを取得
  const work_data = getWorkReportsDetaileds(date);

  //空白の時間にNo Countを雑間接で登録する処理。ただし、休憩時間は除く
  const work_data_length = work_data.length;
  for (var i = 1; i < work_data_length; i++) {
    //時間の差が120秒以上あった場合処理を行う
    const startDateTime = new Date(work_data[i].start)
    if (startDateTime - new Date(work_data[i - 1].end) > 120 * 1000) {
      var rest_time_list = [
        {
          "start": new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 8, 30, 0),
          "end": new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 8, 45, 0)
        },
        {
          "start": new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 12, 15, 0),
          "end": new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 13, 0, 0)
        },
        {
          "start": new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 17, 15, 0),
          "end": new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 17, 30, 0)
        },
      ]
      //休憩開始時間でソートを行う。あとの処理で重要になる
      rest_time_list.sort((a, b) => a.start - b.start);

      for (var j = 0; j < rest_time_list.length; j++) {
        createTimeEntryRemoveRestTime(work_data[i - 1], work_data[i], rest_time_list[j].start, rest_time_list[j].end)
      }
      createTimeEntryInWorkTime(work_data[i - 1], work_data[i], rest_time_list)

    }
  }
}



