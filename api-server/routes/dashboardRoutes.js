const express = require('express');
const router = express.Router();
const { userService } = require('../dataService');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const allUsers = await userService.find({});

    // User statistics
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(user => user.isActive).length;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersThisMonth = allUsers.filter(user =>
      new Date(user.createdAt) >= thirtyDaysAgo
    ).length;

    // Role distribution
    const students = allUsers.filter(user => user.role === 'student').length;
    const faculty = allUsers.filter(user => user.role === 'faculty').length;
    const admins = allUsers.filter(user => user.role === 'admin').length;

    // Department distribution
    const departmentMap = {};
    allUsers.forEach(user => {
      if (user.department) {
        departmentMap[user.department] = (departmentMap[user.department] || 0) + 1;
      }
    });
    const departmentStats = Object.entries(departmentMap)
      .map(([department, count]) => ({ _id: department, count }))
      .sort((a, b) => b.count - a.count);

    // Recent users
    const recentUsers = allUsers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(user => ({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt
      }));

    // Monthly user registration trend (simplified)
    const monthlyMap = {};
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    allUsers.forEach(user => {
      if (new Date(user.createdAt) >= oneYearAgo) {
        const date = new Date(user.createdAt);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + 1;
      }
    });
    const monthlyStats = Object.entries(monthlyMap)
      .map(([month, count]) => ({ _id: { year: parseInt(month.split('-')[0]), month: parseInt(month.split('-')[1]) }, count }))
      .sort((a, b) => {
        if (a._id.year !== b._id.year) return a._id.year - b._id.year;
        return a._id.month - b._id.month;
      });

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        newUsersThisMonth
      },
      roleDistribution: {
        students,
        faculty,
        admins
      },
      departmentStats,
      recentUsers,
      monthlyStats: monthlyStats.map(stat => ({
        month: `${stat._id.year}-${stat._id.month.toString().padStart(2, '0')}`,
        count: stat.count
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dashboard/activity - Get recent activity data
router.get('/activity', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const allUsers = await userService.find({});

    // Get recent user activities (logins, registrations)
    const recentRegistrations = allUsers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(user => ({
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }));

    const recentLogins = allUsers
      .filter(user => user.lastLogin)
      .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
      .slice(0, limit)
      .map(user => ({
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }));

    const activities = [
      ...recentRegistrations.map(user => ({
        type: 'registration',
        user: user.name,
        email: user.email,
        role: user.role,
        timestamp: user.createdAt,
        description: `${user.name} registered as ${user.role}`
      })),
      ...recentLogins.map(user => ({
        type: 'login',
        user: user.name,
        email: user.email,
        role: user.role,
        timestamp: user.lastLogin,
        description: `${user.name} logged in`
      }))
    ];

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivities = activities.slice(0, limit);

    res.json(limitedActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dashboard/department-breakdown - Get department-wise statistics
router.get('/department-breakdown', async (req, res) => {
  try {
    const allUsers = await userService.find({ department: { $ne: null } });

    const departmentMap = {};
    allUsers.forEach(user => {
      if (user.department) {
        if (!departmentMap[user.department]) {
          departmentMap[user.department] = {
            department: user.department,
            totalStudents: 0,
            activeStudents: 0,
            studentsByYear: []
          };
        }
        departmentMap[user.department].totalStudents++;
        if (user.isActive) {
          departmentMap[user.department].activeStudents++;
        }
        if (user.year) {
          departmentMap[user.department].studentsByYear.push(user.year);
        }
      }
    });

    const departmentData = Object.values(departmentMap).map(dept => {
      const yearDistribution = { '1': 0, '2': 0, '3': 0, '4': 0 };
      dept.studentsByYear.forEach(year => {
        if (yearDistribution[year.toString()] !== undefined) {
          yearDistribution[year.toString()]++;
        }
      });

      return {
        department: dept.department,
        totalStudents: dept.totalStudents,
        activeStudents: dept.activeStudents,
        inactiveStudents: dept.totalStudents - dept.activeStudents,
        yearDistribution
      };
    }).sort((a, b) => b.totalStudents - a.totalStudents);

    res.json(departmentData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dashboard/system-health - Get system health metrics
router.get('/system-health', async (req, res) => {
  try {
    const allUsers = await userService.find({});
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(user => user.isActive).length;
    const usersWithLogin = allUsers.filter(user => user.lastLogin).length;

    // Calculate user engagement rate
    const engagementRate = totalUsers > 0 ? (usersWithLogin / totalUsers) * 100 : 0;

    // Get users who haven't logged in for 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const inactiveUsers30Days = allUsers.filter(user =>
      !user.lastLogin || new Date(user.lastLogin) < thirtyDaysAgo
    ).length;

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersWithLogin,
      engagementRate: Math.round(engagementRate * 100) / 100,
      inactiveUsers30Days,
      systemStatus: 'healthy'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
