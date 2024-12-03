export const enhancePrompt = (prompt: string): string => {
  const enhancementStrategies = [
    (p: string) => `Ultra-detailed, cinematic ${p} with intricate details`,
    (p: string) =>
      `Hyper-realistic, photographic quality ${p} with dramatic lighting`,
    (p: string) => `Stylized, avant-garde interpretation of ${p}`,
  ];

  return enhancementStrategies[
    Math.floor(Math.random() * enhancementStrategies.length)
  ](prompt);
};

export const generateRandomSeed = (): number =>
  Math.floor(Math.random() * 1000000);
