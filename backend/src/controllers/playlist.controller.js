export const getAllListDetails = async (req, res) => {
  //   console.log(" 🔨 getAllListDetails controller Hit");
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error fetching playlists : ", error);
    return res.status(500).json({
      success: false,
      error: "Error while fetching playlists :: getAllListDetails",
    });
  }
};

export const getPlaylistDetails = async (req, res) => {
  //   console.log(" 🔨 getPlaylistDetails controller Hit");
  const { playlistId } = req.params;

  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error fetching a playlist : ", error);
    return res.status(500).json({
      success: false,
      error: "Error while fetching a playlist :: getPlaylistDetails",
    });
  }
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
      error: "Error while creating playlist :: createPlaylist",
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
