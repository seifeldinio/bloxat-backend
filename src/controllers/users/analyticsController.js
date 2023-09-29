const {
  // users,
  // enrollments,
  courses,
  // modules,
  // lessons,
  // progress_users,
  sequelize,
} = require("../../../models");
// const { Op } = require("sequelize");
// const { genSaltSync, hashSync } = require("bcrypt");

exports.compareCourses = async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Query the database to fetch courses associated with the teacher's user_id
    const teacherCourses = await courses.findAll({
      where: {
        user_id: userId, // Assuming user_id represents the teacher's ID
      },
      limit: 9,
    });

    // Calculate the total earnings and total sales for each teacher's course
    const courseEarnings = await Promise.all(
      teacherCourses.map(async (course) => {
        const total = await sequelize.query(
          `
          SELECT
            SUM(e.price) AS total
          FROM enrollments e
          WHERE e.course_id = :courseId
          `,
          {
            replacements: { courseId: course.id },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        const sales = await sequelize.query(
          `
          SELECT
            COUNT(*) AS sales
          FROM enrollments e
          WHERE e.course_id = :courseId
          `,
          {
            replacements: { courseId: course.id },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        return {
          name: course.title,
          total: parseInt(total[0]?.total || 0), // Parse the total as an integer
          sales: parseInt(sales[0]?.sales || 0), // Parse sales as an integer
        };
      })
    );

    const totalRevenue = courseEarnings.reduce(
      (acc, curr) => acc + curr.total,
      0
    );

    const totalSales = courseEarnings.reduce(
      (acc, curr) => acc + curr.sales,
      0
    );

    return res.json({
      data: courseEarnings,
      totalRevenue: parseInt(totalRevenue), // Parse totalRevenue as an integer
      totalSales,
    });
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return res.status(500).json({
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    });
  }
};
