/**
 * On Windows, Node child_process defaults to a VISIBLE console for console-subsystem
 * children unless windowsHide/CREATE_NO_WINDOW is set. Cursor agent shell + some
 * hooks forget this → flashing/stuck CMD windows.
 *
 * Patch once at AZTODEV process start so SDK/MCP/shell children stay hidden.
 */
import childProcess from "node:child_process";

let applied = false;

export function forceWindowsHideConsole() {
  if (applied) return;
  if (process.platform !== "win32") {
    applied = true;
    return;
  }
  applied = true;

  const patchOpts = (options) => {
    if (options == null || typeof options !== "object") {
      return { windowsHide: true };
    }
    if (Array.isArray(options)) return options;
    return { ...options, windowsHide: true };
  };

  for (const name of ["spawn", "spawnSync", "execFile", "execFileSync", "fork"]) {
    const orig = childProcess[name];
    if (typeof orig !== "function") continue;
    childProcess[name] = function patched(...args) {
      // spawn(cmd, args?, options?)
      // execFile(file, args?, options?, cb?)
      // fork(module, args?, options?)
      if (args.length >= 2 && args[1] && typeof args[1] === "object" && !Array.isArray(args[1])) {
        args[1] = patchOpts(args[1]);
      } else if (
        args.length >= 3 &&
        args[2] &&
        typeof args[2] === "object" &&
        !Array.isArray(args[2])
      ) {
        args[2] = patchOpts(args[2]);
      } else if (name === "spawn" || name === "spawnSync") {
        if (args.length === 1) args.push([], { windowsHide: true });
        else if (args.length === 2 && Array.isArray(args[1])) args.push({ windowsHide: true });
      }
      return orig.apply(this, args);
    };
  }

  for (const name of ["exec", "execSync"]) {
    const orig = childProcess[name];
    if (typeof orig !== "function") continue;
    childProcess[name] = function patched(command, options, callback) {
      if (typeof options === "function") {
        return orig.call(this, command, { windowsHide: true }, options);
      }
      return orig.call(this, command, patchOpts(options), callback);
    };
  }
}

forceWindowsHideConsole();
