//月毎にシートを分けて、id	client	project	description	tagを記入した方がよさそう

var CACHE_KEY = 'toggl_exporter:lastmodify_datetime';
var TOGGL_API_HOSTNAME = 'https://api.track.toggl.com';
var TOGGL_BASIC_AUTH = 'yourtogglapi';
var authData = Utilities.base64Encode(TOGGL_BASIC_AUTH + ":api_token");
var now = new Date();
var date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
date.setDate(date.getDate() - 1);
var arr = []
var work_data = []

var date_str = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy-MM-dd');


i_description = "No Count"
pid = "yourprojectud" //'w間接'


function main() {
  //指定した日付の仕事に関する詳細レポートを取得
  const work_data = getWorkReportsDetaileds(date_str);
  if (work_data.length != 0) {
    //空白の時間にNo Countを雑間接で登録する処理。ただし、休憩時間は除く
    const work_data_length = work_data.length;
    for (var i = 1; i < work_data_length; i++) {
      //時間の差が120秒以上あった場合処理を行う
      const startDateTime = new Date(work_data[i].start)
      const endDateTime = new Date(work_data[i - 1].end)
      if (startDateTime - endDateTime > 120 * 1000) {
        console.log("---start---", startDateTime, "-", endDateTime)
        createTimeEntryRemoveRestTime(work_data[i - 1], work_data[i])
      }
    }
  } else {
    console.log("nodata")
  }

}



