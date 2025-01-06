const { counter } = require('./counter');


globalThis.currentValue ??= 0;

const main = async () => {
  while(true) {
    const newValue = await counter(globalThis.currentValue);
    globalThis.currentValue = newValue;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (globalThis.currentValue !== newValue) {
      break;
    }
  }
};

main().then(() => null);