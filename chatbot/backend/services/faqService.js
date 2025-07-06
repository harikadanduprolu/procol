// services/faqService.js

exports.getFAQ = (topic) => {
  switch (topic) {
    case 'login':
      return {
        answer: [
          "🔐 Login Help:",
          "• Make sure your email and password are correct.",
          "• Try resetting your password from the login page.",
          "• Still stuck? Contact support@procollab.com.",
        ].join("\n"),
      };

    case 'upload':
      return {
        answer: [
          "📤 File Upload Help:",
          "• Check your internet connection.",
          "• Ensure the file size is under 10MB.",
          "• Use supported formats: PDF, DOCX, PNG, JPG.",
          "• Try using a different browser or device.",
        ].join("\n"),
      };

    case 'reset':
    case 'password':
      return {
        answer: [
          "🔑 Password Reset Instructions:",
          "• Go to the login page and click 'Forgot Password'.",
          "• Enter your registered email to receive a reset link.",
          "• Follow the instructions in the email.",
          "• Still having issues? Email support@procollab.com.",
        ].join("\n"),
      };

    case 'project':
      return {
        answer: [
          "🆕 How to Create a New Project:",
          "• Navigate to your dashboard.",
          "• Click on 'Create New Project'.",
          "• Fill in the title, domain, description, tags, and team preferences.",
          "• Click 'Submit'. Your project will be listed.",
        ].join("\n"),
      };

    case 'general':
    default:
      return {
        answer: "❓ We couldn't find help for that topic yet. Try asking about login, upload, or password issues.",
      };
  }
};
