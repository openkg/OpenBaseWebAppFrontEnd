const DEFAULT_DEBOUNCE_DURATION = 300;

export function debounce(method, duration = DEFAULT_DEBOUNCE_DURATION) {
  let timeoutId;

  function debounceWrapper(...args) {
    debounceWrapper.clear();

    timeoutId = setTimeout(() => {
      timeoutId = null;
      method.apply(this, args);
    }, duration);
  }

  debounceWrapper.clear = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounceWrapper;
}

export default function bebounceDecorator(duration) {
  return function innerDecorator(target, key, descriptor) {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter() {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: debounce(descriptor.value, duration),
        });

        return this[key];
      },
    };
  };
}
