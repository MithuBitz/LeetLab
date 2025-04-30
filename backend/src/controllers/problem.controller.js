export const createProblem = async (req, res) => {
  res.send("Problem controller hit");
};

export const getAllProblems = async (req, res) => {
  res.send("Get all problems controller hit");
};

export const getProblemById = async (req, res) => {
  res.send("Get PRoblem by ID controller hit");
};

export const updateProblem = async (req, res) => {
  res.send("updateProblem controller hit");
};

export const deleteProblem = async (req, res) => {
  res.send("deleteProblem controller hit");
};

export const getAllProblemSolvedByUser = async (req, res) => {
    res.send("getAllProblemSolvedByUser controller hit");
  };