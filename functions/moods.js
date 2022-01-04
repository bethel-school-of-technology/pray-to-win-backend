// January 1 to january 14
// only 9 of those days have data
// add up the numbers of the days that have data and divide by 9

exports.getMoodAvg = () => {
    let data = []
    let totalMoods = moods.length;
    let moodValue = 0;
    moods.forEach(mood => {
        moodValue = moodValue + mood.mood
    });
    let avgMoodVal = moodValue / totalMoods;

    let data = [
        {avg: avgMoodVal}, moods
    ]
    console.log(moods);
    console.log('Date Check Ran')

    return data;
}

// var divider = 0;
// var datesWithDataARray = []

// if(submittedDay Hasdata) {
//   sum of the mood total
//   Do math stuff
//   divider = divider + 1;
//   datesWithDataArray.push(submittedDay)
// } else {
//   don't do antyhing
// }

// avgPercent = sum of moods / divider

// return back that data

// array of the dates WITH data.
// []