//courseInfo
const courseInfo = {
  id: 1,
  name: "Intro to Javascript"
};
//assignmentGroup
const assignmentGroup = {
  id: 123,
  name: "Fundamentals of JavaScript",
  course_id: 1,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2024-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2024-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: " Coding essentials",
      due_at: "2024-03-04",
      points_possible: 0 //potential error you cannot didvide by 0
    },
    {
      id: 4,
      name: "Code the World",
      due_at: "2026-11-15",
      points_possible: 500
    }
  ]
}

//learnerSubmission
const learnerSubmission = [
  {
    learner_id: 888,
    assignment_id: 1,
    submission: {
      submitted_at: "2024-01-25",
      score: 47
    }
  },
  {
    learner_id: 888,
    assignment_id: 2,
    submission: {
      submitted_at: "2024-02-12",
      score: 150
    }
  },
  {
    learner_id: 888,
    assignment_id: 3,
    submission: {
      submitted_at: "2024-03-08",
      score: "test"//what if a value that you are expecting to be a number is instead a string?
    }
  },
  {
    learner_id: 888,
    assignment_id: 4,
    submission: {
      submitted_at: "2025-01-25",
      score: 400
    }
  },
  {
    learner_id: 777,
    assignment_id: 1,
    submission: {
      submitted_at: "2024-01-24",
      score: 39
    }
  },
  {
    learner_id: 777,
    assignment_id: 2,
    submission: {
      submitted_at: "2024-03-07",
      score: 140
    }
  },
  {
    learner_id: 777,
    assignment_id: 3,
    submission: {
      submitted_at: "2024-03-01",
      score: 20
    }
  }
];

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  try {
    if (assignmentGroup.course_id !== courseInfo.id) {
      throw new Error("Assignment group does not belong to the course.");
    }
  } catch (error) {
    console.error(error.message)
    return; // exit if there is an error
  }
  const assignmentLookup = assignmentGroup.assignments.reduce((lookup, assignment) => {
    const isPastDue = new Date(assignment.due_at) < new Date();
    lookup[assignment.id] = { 
      isPastDue, 
      points_possible: assignment.points_possible 
    };
    return lookup;
  }, {});
  
  const learnerAverages = {};
for (let submission of learnerSubmissions) {
  const learnerId = submission.learner_id;
  const assignmentId = submission.assignment_id;
  const assignment = assignmentLookup[assignmentId];
  const score = typeof submission.submission.score === "number" ? submission.submission.score : 0;
  const isLate = assignment?.isPastDue || false;
  const latePenalty = isLate ? 15 : 0;
  const adjustedScore = Math.max(0, score - latePenalty);

  if (!learnerAverages[learnerId]) {
    learnerAverages[learnerId] = { totalScore: 0, totalPoints: 0, scores: {} };
  }

  learnerAverages[learnerId].totalScore += adjustedScore;
  learnerAverages[learnerId].totalPoints += assignment?.points_possible || 0;
  learnerAverages[learnerId].scores[assignmentId] = (adjustedScore / (assignment?.points_possible || 1)) * 100; // Percentage
}

  function calculateScore(submission, assignment) {
    const score = submission.submission.score || 0;
    const points = assignment.points_possible || 1; // Avoid divide by zero
    return (score / points) * 100; // Percentage
  }
  const learnerData = learnerSubmissions.map((submission) => {
    const score = typeof submission.submission.score === "number" ? submission.submission.score : 0;
    const isLate = assignmentLookup[submission.assignment_id]?.isPastDue || false; // Check late submission
    const latePenalty = isLate ? 15 : 0;
    const adjustedScore = Math.max(0, score - latePenalty); // Deduct penalty but avoid negative scores
  
    return {
      learnerId: submission.learner_id,
      assignmentId: submission.assignment_id,
      adjustedScore, // Add adjusted score
      passed: adjustedScore >= 90 // Pass/fail logic
    };
  });
  
  //passed a boolean if the student has a grade of 90 and above i want it to be true
  //otherwise false 
  //passed: (learnerSubmissions.avg) >= 90? true:false}

  // here, we would process this data to achieve the desired result.
  const result = [
    {
      id: 888,
      avg: 98.5, // (47 + 150 ) / (50 + 150 + 500)
      1: 94.0, // 47 / 50
      2: 100.0, // 150 / 150
      //still not due assignment_id3: 80.0 //400 / 500
    },
    {
      id: 777,
      avg: 82.0, // (39 + 125) / (50 + 150 + 500)
      1: 78.0, // 39 / 50
      2: 83.0, // late: (140 - 15) / 150
      //not due yet assignment_id3:0//not turned in 
    }
  ];

  return result;
}


// Call the function
const result = getLearnerData(courseInfo, assignmentGroup, learnerSubmission);
console.log(result);
