// src/index.tsx

// 🛑 INVISIBLE POLYFILL
// This stops ratt-lib from crashing, and the frontend dev never has to know!
const _global = global as any;
if (typeof _global.window === 'undefined') _global.window = _global;
if (!_global.window.addEventListener) {
  _global.window.addEventListener = () => {};
  _global.window.removeEventListener = () => {};
}

// Export the Hook and the Config Type so apps can use them
export * from './UseRattStormee';
