import { db } from "../libs/db.js";

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

  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    console.log("UserID", userId);
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
    console.error("Error creatng playlist :", error);
    return res.status(500).json({
      success: false,
      error: "Error while creating playlist :: createPlaylist",
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body; // Accept an array of problem IDs

  console.log(req.params, req.body);

  try {
    // Ensure problemIds is an array
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    console.log(
      problemIds.map((problemId) => ({
        playlistId,
        problemId,
      }))
    );

    // Create records for each problem in the playlist
    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId: playlistId, // ✅ match your Prisma field name exactly
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problems to playlist:", error.message);
    res.status(500).json({ error: "Failed to add problems to playlist" });
  }
};

export const deletePlaylist = async (req, res) => {
  //   console.log(" 🔨 deletePlaylist controller Hit");
  const { playlistId } = req.params;

  try {
    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
    });

    res.status(200).jsonl({
      success: true,
      message: "Playlist deleted successfully",
      deletedPlaylist,
    });
  } catch (error) {
    console.error("Error deleteing playlist : ", error);
    return res.status(500).json({
      success: false,
      error: "Error while delete playlist :: deletePlaylist",
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  //   console.log(" 🔨 removeProblemFromPlaylist controller Hit");
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(404).json({
        error: "Please provide problem to remove from the playlist",
      });
    }

    const deletedProblem = db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error deleteing problem from playlist : ", error);
    return res.status(500).json({
      success: false,
      error:
        "Error while delete problem from playlist :: removeProblemFromPlaylist",
    });
  }
};
