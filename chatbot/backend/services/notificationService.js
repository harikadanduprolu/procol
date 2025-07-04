// services/notificationService.js

exports.getPendingInvites = async (userId = '') => {
  const allInvites = [
    {
      from: "Anika",
      to: "user123",
      project: "Collaborative Music Platform",
      status: "pending",
      message: "We’d love to have you onboard!"
    },
    {
      from: "Rahul",
      to: "user456",
      project: "Smart Farming IoT",
      status: "accepted",
    },
    {
      from: "Priya",
      to: "user123",
      project: "AI Chatbot for Campus",
      status: "pending",
    }
  ];

  // Return only pending invites for the given userId
  return allInvites.filter(invite =>
    invite.status === "pending" &&
    (invite.to === userId || !userId)
  );
};
