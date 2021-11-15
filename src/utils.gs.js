var rest_time_list = [
  // {
  //   start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 30, 0),
  //   end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 45, 0)
  // },
  {
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 15, 0),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 0, 0)
  },
  {
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 15, 0),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 30, 0)
  },
]

//休憩開始時間でソートを行う。あとの処理で重要になる
rest_time_list.sort((a, b) => a.start - b.start);

//toISOStringだと日本時間の表記じゃなくなる？ので自作
function toISOStringJST(formatdate) {
  return Utilities.formatDate(formatdate, 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ss'+09:00'");

}


function createTimeEntryRemoveRestTime(work_data_n_1, work_data_n) {

  const noCountTimeStartDateTime = new Date(work_data_n_1.end)
  const noCountTimeEndDateTime = new Date(work_data_n.start)

  //作成しようとしているtime_entryが休憩を跨いだり、一部被る場合の処理
  for (var i = 0; i < rest_time_list.length; i++) {
    var referenceStartDateTime = rest_time_list[i].start
    var referenceEndDateTime = rest_time_list[i].end
    console.log("first",i,referenceStartDateTime,"-",referenceEndDateTime)

    
    if (noCountTimeStartDateTime < referenceStartDateTime && referenceStartDateTime < noCountTimeEndDateTime && noCountTimeEndDateTime <= referenceEndDateTime) {
      console.log(`No1: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
      //change end time
      createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(referenceStartDateTime), pid)

    } else if (referenceStartDateTime <= noCountTimeStartDateTime && noCountTimeStartDateTime <= referenceEndDateTime && referenceStartDateTime <= noCountTimeEndDateTime && noCountTimeEndDateTime < referenceEndDateTime) {
      console.log(`No2: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
      //remove this time entry<=つまり、作成しないでスルー

    } else if (referenceStartDateTime <= noCountTimeStartDateTime && noCountTimeStartDateTime < referenceEndDateTime && referenceEndDateTime < noCountTimeEndDateTime) {
      console.log(`No3: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
      //change start time
      createTimeEntry(i_description, toISOStringJST(referenceEndDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
    } else if (noCountTimeStartDateTime < referenceStartDateTime && referenceEndDateTime < noCountTimeEndDateTime) {
      console.log(`No4: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
      //セパレート
      createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(referenceStartDateTime), pid)
      createTimeEntry(i_description, toISOStringJST(referenceEndDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
    }
  }
    //開始と終了が共に、一日の休憩の最初のスタート時間より前
  if (noCountTimeStartDateTime < rest_time_list[0].start && noCountTimeEndDateTime < rest_time_list[0].start) {
    console.log(`No5: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
    createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
  }
  //開始と終了が共に、一日の休憩の最後のスタート時間より後の隙間時間は足す
  if (rest_time_list[rest_time_list.length - 1].end < noCountTimeStartDateTime && rest_time_list[rest_time_list.length - 1].end < noCountTimeEndDateTime) {
    console.log(`No8: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
    createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
  }

  // 一番最初の休憩終了時間から、最後の休憩終了時間まで
  for (var i = 1; i < rest_time_list.length; i++) {
    console.log(JSON.stringify(rest_time_list))
    const referenceStartTime = rest_time_list[i - 1].end//referenceのstarttimeね
    const referenceEndTime = rest_time_list[i].start//referenceのendtimeね
    console.log("second",i,referenceStartTime,"-",referenceEndTime)

//休憩と休憩の間
    if (referenceStartTime <= noCountTimeStartDateTime && noCountTimeStartDateTime < referenceEndTime && referenceStartTime < noCountTimeEndDateTime && noCountTimeEndDateTime <= referenceEndTime) {
      console.log(`No6 or No7: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
      createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
      break
    } else {
      console.log(`それ以外: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
    }
  }
}