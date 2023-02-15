const { notifications } = require("../../models");

// const { Op } = require("sequelize");

// Send notification to client web app user
module.exports.sendNotificationToUser = async (
  socket,
  title,
  body,
  redirect_url,
  from_name,
  from_profile_pic,
  cb
) => {
  // console.log("User id", userId);

  // const user_id = userId;

  //   Sequelize find the project with the projectId
  const notification = await notifications.create({
    title,
    body,
    redirect_url,
    from_name,
    from_profile_pic,
  });

  //   project.update({
  //     project_progress: progressInt,
  //   });

  // Emit changed data to userId room (Send the returned data to client web app)
  socket
    .to("public")
    .emit(
      "notification_sent_to_client",
      title,
      body,
      redirect_url,
      from_name,
      from_profile_pic
    );

  // console.log(title, body, redirect_url, from_name, from_profile_pic);
  //   console.log("Inside the function", socket.id);

  //   Callback setting done to true
  cb({ done: true });
};
