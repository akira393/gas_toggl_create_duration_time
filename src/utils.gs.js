i_description = "No Count"
pid = "xxxxxxxx"

//toISOStringだと日本時間の表記じゃなくなる？ので自作
function toISOStringJST(formatdate) {
  return Utilities.formatDate(formatdate, 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ss'+09:00'");

}
function createTimeEntryInWorkTime(work_data_n, rest_time_list) {
  // duration timeとして入力する情報

  var noCountTimeStartDateTime = new Date(work_data_n.start)
  var noCountTimeEndDateTime = new Date(work_data_n.end)
  for (var i = 0; rest_time_list.length; i++) {
    const referenceStartTime = rest_time_list[i - 1].end//referenceのstarttimeね
    const referenceEndTime = rest_time_list[i].start//referenceのendtimeね

    //開始と終了が共に、一日の休憩の最初のスタート時間より前
    if (i = 0) {
      if (noCountTimeStartDateTime < rest_time_list[i].start && noCountTimeEndDateTime < rest_time_list[i].start) {
        console.log(`No5 or No8: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
        createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
      }
      //開始と終了が共に、一日の休憩の最後のスタート時間より後の隙間時間は足す
    } else if (i = rest_time_list.length) {
      if (rest_time_list[-1].end < noCountTimeStartDateTime && rest_time_list[-1].end < noCountTimeEndDateTime) {
        console.log(`No8: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
        createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
      }
    }
    // 一番最初の休憩終了時間から、最後の休憩終了時間まで
    else if (referenceStartTime <= noCountTimeStartDateTime <= referenceEndTime && referenceStartTime <= noCountTimeEndDateTime <= referenceEndTime) {
      console.log(`No6 or No7: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
      createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
      break
    } else {
      console.log(`それ以外: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
    }
  }

  //開始と終了が共に、一日の休憩の最後のスタート時間より後の隙間時間は足す

}


function createTimeEntryRemoveRestTime(work_data_n_1, work_data_n, referenceStartDateTime, referenceEndDateTime) {
  var noCountTimeStartDateTime = new Date(work_data_n_1.end)
  var noCountTimeEndDateTime = new Date(work_data_n.start)

  if (noCountTimeStartDateTime < referenceStartDateTime && referenceStartDateTime < noCountTimeEndDateTime && noCountTimeEndDateTime < referenceEndDateTime) {
    console.log(`No1: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
    //change end time
    noCountTimeEndDateTime = referenceStartDateTime
    createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(noCountTimeEndDateTime), pid)

  } else if (referenceStartDateTime < noCountTimeStartDateTime && noCountTimeStartDateTime < referenceEndDateTime && referenceStartDateTime < noCountTimeEndDateTime && noCountTimeEndDateTime < referenceEndDateTime) {
    console.log(`No2: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
    //remove this time entry<=つまり、作成しないでスルー

  } else if (referenceStartDateTime < noCountTimeStartDateTime && noCountTimeStartDateTime < referenceEndDateTime && referenceEndDateTime < noCountTimeEndDateTime) {
    console.log(`No3: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
    //change start time
    noCountTimeStartDateTime = referenceEndDateTime


    createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
  } else if (noCountTimeStartDateTime < referenceStartDateTime && referenceEndDateTime < noCountTimeEndDateTime) {
    console.log(`No4: ${noCountTimeStartDateTime}-${noCountTimeEndDateTime}`)
    //セパレート
    createTimeEntry(i_description, toISOStringJST(noCountTimeStartDateTime), toISOStringJST(referenceStartDateTime), pid)
    createTimeEntry(i_description, toISOStringJST(referenceEndDateTime), toISOStringJST(noCountTimeEndDateTime), pid)
  }
}