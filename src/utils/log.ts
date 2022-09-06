import chalk from "chalk";

/**
 * Displays a error log in the console.
 */
export function logError(message: string): void {
  console.error(chalk.red(message));
}

/**
 * Displays a rainbow log in the console.
 */
export function logRainbow(message: string): void {
  const letters = message.split("");
  const colors = ["red", "yellow", "green", "cyan", "blue", "magenta"];
  const colorsCount = colors.length;

  const rainbowLetters = letters
    .map((letter, index) => {
      const color = colors[index % colorsCount];
      return chalk[color](letter);
    })
    .join("");

  console.log(`🎉 ${rainbowLetters}`);
}
