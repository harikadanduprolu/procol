exports.calculateSimilarity = (userTags, projectTags) => {
    const setA = new Set(userTags.map(tag => tag.toLowerCase()));
    const setB = new Set(projectTags.map(tag => tag.toLowerCase()));
    const intersection = new Set([...setA].filter(tag => setB.has(tag)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  };
  