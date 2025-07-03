// services/mentorService.js

exports.getAvailableMentors = async (domain = '') => {
  const allMentors = [
    {
      name: 'Dr. Meera',
      domain: 'ML',
      available_slots: ['Friday 3PM', 'Saturday 10AM'],
      available: true,
    },
    {
      name: 'Prof. Raj',
      domain: 'AI',
      available_slots: ['Wednesday 2PM'],
      available: true,
    },
    {
      name: 'Dr. Anita',
      domain: 'Web Development',
      available_slots: ['Monday 5PM'],
      available: false,
    },
    {
      name: 'Mr. Sanjay',
      domain: 'Blockchain',
      available_slots: ['Thursday 1PM', 'Friday 11AM'],
      available: true,
    }
  ];

  // If domain is passed, filter mentors by domain match (case insensitive)
  const matchedMentors = allMentors.filter(
    mentor =>
      mentor.available &&
      mentor.domain.toLowerCase().includes(domain.toLowerCase())
  );

  return matchedMentors.length > 0 ? matchedMentors : allMentors.filter(m => m.available);
};
