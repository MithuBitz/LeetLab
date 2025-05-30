import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  const [streakAnimation, setStreakAnimation] = useState(false);

  console.log("USer in PRofile ", authUser);

  useEffect(() => {
    // Trigger streak animation on mount
    setTimeout(() => setStreakAnimation(true), 500);
  }, []);

  const profileData = {
    name: "Alex Johnson",
    username: "@alexcodes",
    bio: "Senior Software Engineer • Problem Solver • Algorithm Enthusiast",
    stats: {
      problemsSolved: 247,
      contestRating: 89,
      daysStreak: 45,
      badges: 12,
    },
    progress: {
      easy: { solved: 89, total: 156 },
      medium: { solved: 124, total: 234 },
      hard: { solved: 34, total: 89 },
    },
  };

  const recentActivities = [
    {
      icon: "✅",
      title: 'Solved "Two Sum" - Easy',
      time: "2 hours ago",
      type: "solve",
    },
    {
      icon: "🏆",
      title: 'Earned "30 Day Streak" badge',
      time: "1 day ago",
      type: "badge",
    },
    {
      icon: "✅",
      title: 'Solved "Binary Tree Inorder" - Medium',
      time: "2 days ago",
      type: "solve",
    },
    {
      icon: "📝",
      title: "Participated in Weekly Contest 234",
      time: "3 days ago",
      type: "contest",
    },
    {
      icon: "✅",
      title: 'Solved "Merge Intervals" - Medium',
      time: "4 days ago",
      type: "solve",
    },
  ];

  const skills = [
    { name: "Arrays", level: "Advanced", color: "bg-green-500" },
    {
      name: "Dynamic Programming",
      level: "Intermediate",
      color: "bg-yellow-500",
    },
    { name: "Trees", level: "Advanced", color: "bg-green-500" },
    { name: "Graphs", level: "Intermediate", color: "bg-yellow-500" },
    { name: "Hash Tables", level: "Advanced", color: "bg-green-500" },
    { name: "Backtracking", level: "Beginner", color: "bg-red-500" },
  ];

  const achievements = [
    { icon: "🔥", title: "30 Day Streak", date: "Jan 15, 2025" },
    { icon: "⭐", title: "100 Problems", date: "Jan 10, 2025" },
    { icon: "🎯", title: "Array Master", date: "Jan 8, 2025" },
    { icon: "🏅", title: "Contest Participant", date: "Jan 5, 2025" },
  ];

  const ProgressCircle = ({ value, total, difficulty, color }) => {
    const percentage = Math.round((value / total) * 100);

    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div
          className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg ${color} transform hover:scale-105 transition-transform`}
        >
          {value}
        </div>
        <div className="font-medium text-gray-800">{difficulty}</div>
        <div className="text-sm text-gray-500">
          {value}/{total}
        </div>
        <div className="text-xs text-blue-600 font-medium">{percentage}%</div>
      </div>
    );
  };

  const StatCard = ({ number, label, icon }) => (
    <div className="text-center group cursor-pointer">
      <div className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
        {icon && <span className="mr-2">{icon}</span>}
        {number}
      </div>
      <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
        {label}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-6xl border-4 border-white shadow-lg">
                <img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {authUser.name}
              </h1>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard number="33" label="Problems Solved" icon="🧩" />
                <StatCard number="90" label="Contest Rating" icon="🏆" />
                <StatCard number="2" label="Badges" icon="🏅" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Spans 2 columns */}
          <div className="xl:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-2xl">📈</span>
                Progress Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ProgressCircle
                  value={profileData.progress.easy.solved}
                  total={profileData.progress.easy.total}
                  difficulty="Easy"
                  color="bg-green-500"
                />
                <ProgressCircle
                  value={profileData.progress.medium.solved}
                  total={profileData.progress.medium.total}
                  difficulty="Medium"
                  color="bg-yellow-500"
                />
                <ProgressCircle
                  value={profileData.progress.hard.solved}
                  total={profileData.progress.hard.total}
                  difficulty="Hard"
                  color="bg-red-500"
                />
              </div>

              {/* Chart Placeholder with Enhanced Design */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-dashed border-blue-200">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Submission Activity Chart
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Interactive chart showing daily submission patterns
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                Recent Activity
              </h2>

              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        activity.type === "solve"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "badge"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      } group-hover:scale-110 transition-transform`}
                    >
                      {activity.icon}
                    </div>

                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Skills
              </h2>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-800">
                      {skill.name}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                        skill.level === "Advanced"
                          ? "bg-green-500"
                          : skill.level === "Intermediate"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {skill.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                Recent Achievements
              </h2>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-content text-xl shadow-lg">
                      {achievement.icon}
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {achievement.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
