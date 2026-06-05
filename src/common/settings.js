import storage from "@system.storage"
import brightness from "@system.brightness"

export const DEFAULT_SETTINGS = {
  highContrast: false,
  keepScreenOn: false,
  screenMode: "system",
  brightnessPercent: 70,
  vibrationIntensity: "medium",
  vibrationPattern: "smart",
  refreshMode: "realtime",
  autoExitMinutes: 10
}

const KEY = "BANDNAV_SETTINGS"

export function loadSettings(callback) {
  storage.get({
    key: KEY,
    success: (data) => {
      callback(normalizeSettings(data))
    },
    fail: () => {
      callback(copyDefaults())
    }
  })
}

export function saveSettings(settings, callback) {
  const next = normalizeSettings(settings)
  storage.set({
    key: KEY,
    value: JSON.stringify(next),
    success: () => {
      if (callback) callback(next)
    },
    fail: () => {
      if (callback) callback(next)
    }
  })
}

export function applyKeepScreenOn(mode, percent) {
  const screenMode = mode === true ? "on" : mode === "on" || mode === "auto" ? mode : "system"
  try {
    brightness.setKeepScreenOn({
      keepScreenOn: screenMode !== "system"
    })
  } catch (e) {
    console.log("keep screen unsupported " + e.message)
  }

  if (screenMode === "system") return

  try {
    brightness.setMode({
      mode: screenMode === "auto" ? 1 : 0,
      fail: (data, code) => {
        console.log("brightness mode fail " + code)
      }
    })
  } catch (e) {
    console.log("brightness mode unsupported " + e.message)
  }

  if (screenMode !== "on") return

  try {
    const brightnessPercent = normalizeBrightnessPercent(percent)
    brightness.setValue({
      value: Math.round(brightnessPercent * 255 / 100),
      fail: (data, code) => {
        console.log("brightness set fail " + code)
      }
    })
  } catch (e) {
    console.log("brightness value unsupported " + e.message)
  }
}

export function normalizeSettings(value) {
  let obj = value
  if (typeof value === "string" && value) {
    try {
      obj = JSON.parse(value)
    } catch (e) {
      obj = {}
    }
  }
  obj = obj || {}
  return {
    highContrast: obj.highContrast === true || obj.highContrast === "true",
    keepScreenOn: obj.keepScreenOn === true || obj.keepScreenOn === "true",
    screenMode: pick(obj.screenMode, ["system", "on", "auto"], obj.keepScreenOn === true || obj.keepScreenOn === "true" ? "on" : "system"),
    brightnessPercent: normalizeBrightnessPercent(obj.brightnessPercent),
    vibrationIntensity: pick(obj.vibrationIntensity, ["strong", "medium", "light"], "medium"),
    vibrationPattern: pick(obj.vibrationPattern, ["smart", "long", "double"], "smart"),
    refreshMode: pick(obj.refreshMode, ["realtime", "changes"], "realtime"),
    autoExitMinutes: Number(obj.autoExitMinutes) === 5 ? 5 : Number(obj.autoExitMinutes) === 0 ? 0 : 10
  }
}

function pick(value, allowed, fallback) {
  const text = String(value || "")
  return allowed.indexOf(text) >= 0 ? text : fallback
}

function normalizeBrightnessPercent(value) {
  const number = Math.round(Number(value) / 10) * 10
  if (isNaN(number)) return 70
  if (number < 10) return 10
  if (number > 100) return 100
  return number
}

function copyDefaults() {
  return normalizeSettings(DEFAULT_SETTINGS)
}
