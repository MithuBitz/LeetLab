export const getAllListDetails = async (req, res) => {
  console.log(" 🔨 getAllListDetails controller Hit");
};

export const getPlaylistDetails = async (req, res) => {
  console.log(" 🔨 getPlaylistDetails controller Hit");
};

export const createPlaylist = async (req, res) => {
  // console.log(" 🔨 createPlaylist controller Hit");
  const { name, description } = req.body;
  const { userId } = req.user.id;

  try {
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({
      success: false,
      error:
        "Error while executing code for geting submission count for problem",
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  console.log(" 🔨 addProblemToPlaylist controller Hit");
};

export const deletePlaylist = async (req, res) => {
  console.log(" 🔨 deletePlaylist controller Hit");
};

export const removeProblemFromPlaylist = async (req, res) => {
  console.log(" 🔨 removeProblemFromPlaylist controller Hit");
};
