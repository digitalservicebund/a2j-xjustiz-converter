declare global {
  var crypto: {
    randomUUID(): string;
  };
}

export {}; // oxlint-disable-line unicorn/require-module-specifiers
