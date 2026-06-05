const ICONS = {
  LEFT: "/common/arrows/turn_left.png",
  RIGHT: "/common/arrows/turn_right.png",
  SLIGHT_LEFT: "/common/arrows/turn_slight_left.png",
  SLIGHT_RIGHT: "/common/arrows/turn_slight_right.png",
  SHARP_LEFT: "/common/arrows/turn_sharp_left.png",
  SHARP_RIGHT: "/common/arrows/turn_sharp_right.png",
  STRAIGHT: "/common/arrows/straight.png",
  UTURN: "/common/arrows/u_turn_left.png",
  UTURN_LEFT: "/common/arrows/u_turn_left.png",
  UTURN_RIGHT: "/common/arrows/u_turn_right.png",
  MERGE: "/common/arrows/merge.png",
  RAMP_LEFT: "/common/arrows/turn_slight_left.png",
  RAMP_RIGHT: "/common/arrows/turn_slight_right.png",
  FORK_LEFT: "/common/arrows/fork_left.png",
  FORK_RIGHT: "/common/arrows/fork_right.png",
  ROUNDABOUT_LEFT: "/common/arrows/roundabout_v2.png",
  ROUNDABOUT_RIGHT: "/common/arrows/roundabout_v2.png",
  ROUNDABOUT_EXIT_1: "/common/arrows/roundabout_v2.png",
  ROUNDABOUT_EXIT_2: "/common/arrows/roundabout_v2.png",
  ROUNDABOUT_EXIT_3: "/common/arrows/roundabout_v2.png",
  ROUNDABOUT: "/common/arrows/roundabout_v2.png",
  ARRIVE: "/common/arrows/straight.png",
  UNKNOWN: "/common/arrows/straight.png"
}

export function iconForDirection(direction) {
  const key = String(direction || "UNKNOWN").toUpperCase()
  return ICONS[key] || ICONS.UNKNOWN
}

export function parseNavigationPayload(raw) {
  if (raw === null || raw === undefined) return null

  if (raw instanceof ArrayBuffer) {
    raw = arrayBufferToString(raw)
  }

  if (raw && raw.buffer instanceof ArrayBuffer) {
    raw = arrayBufferToString(raw.buffer)
  }

  if (typeof raw === "object") {
    return normalizeObject(raw)
  }

  const text = String(raw).trim()
  if (!text) return null

  if (text.charAt(0) === "{") {
    try {
      return normalizeObject(JSON.parse(text))
    } catch (e) {
      console.log("json parse fail " + e.message)
    }
  }

  const parts = text.split("|")
  return normalizeObject({
    direction: parts[0],
    distance: parts[1],
    street: parts[2],
    eta: parts.slice(3).join("|")
  })
}

export function shortDeviceName(info) {
  if (!info) return "Mi Band 10"
  const type = info.deviceType || info.type || "band"
  const model = info.model || info.productModel || "Mi Band 10"
  return String(type) + " " + String(model)
}

function normalizeObject(input) {
  const direction = normalizeDirection(
    input.direction || input.dir || input.turn || input.action
  )
  return {
    direction,
    distance: trimText(input.distance || input.dist || input.meters || "--", 10),
    street: trimText(input.street || input.road || input.name || input.title || "", 28),
    source: trimText(input.source || input.app || "Navigating", 18),
    eta: trimText(input.eta || input.arrival || input.arrive || "--:--", 12)
  }
}

function normalizeDirection(value) {
  const text = String(value || "UNKNOWN").toUpperCase()
  if (text.indexOf("SLIGHT_LEFT") >= 0 || text.indexOf("SLIGHT LEFT") >= 0) return "SLIGHT_LEFT"
  if (text.indexOf("SLIGHT_RIGHT") >= 0 || text.indexOf("SLIGHT RIGHT") >= 0) return "SLIGHT_RIGHT"
  if (text.indexOf("SHARP_LEFT") >= 0 || text.indexOf("SHARP LEFT") >= 0) return "SHARP_LEFT"
  if (text.indexOf("SHARP_RIGHT") >= 0 || text.indexOf("SHARP RIGHT") >= 0) return "SHARP_RIGHT"
  if (text.indexOf("ROUNDABOUT_LEFT") >= 0) return "ROUNDABOUT_LEFT"
  if (text.indexOf("ROUNDABOUT_RIGHT") >= 0) return "ROUNDABOUT_RIGHT"
  if (text.indexOf("ROUNDABOUT_EXIT_1") >= 0) return "ROUNDABOUT_EXIT_1"
  if (text.indexOf("ROUNDABOUT_EXIT_2") >= 0) return "ROUNDABOUT_EXIT_2"
  if (text.indexOf("ROUNDABOUT_EXIT_3") >= 0) return "ROUNDABOUT_EXIT_3"
  if (text.indexOf("UTURN_RIGHT") >= 0 || text.indexOf("U_TURN_RIGHT") >= 0 || text.indexOf("U-TURN RIGHT") >= 0) return "UTURN_RIGHT"
  if (text.indexOf("UTURN_LEFT") >= 0 || text.indexOf("U_TURN_LEFT") >= 0 || text.indexOf("U-TURN LEFT") >= 0) return "UTURN_LEFT"
  if (text.indexOf("RAMP_LEFT") >= 0 || text.indexOf("RAMP LEFT") >= 0) return "RAMP_LEFT"
  if (text.indexOf("RAMP_RIGHT") >= 0 || text.indexOf("RAMP RIGHT") >= 0) return "RAMP_RIGHT"
  if (text.indexOf("FORK_LEFT") >= 0 || text.indexOf("FORK LEFT") >= 0) return "FORK_LEFT"
  if (text.indexOf("FORK_RIGHT") >= 0 || text.indexOf("FORK RIGHT") >= 0) return "FORK_RIGHT"
  if (text.indexOf("MERGE") >= 0 || text.indexOf("NHAP") >= 0) return "MERGE"
  if (text.indexOf("LEFT") >= 0 || text.indexOf("TRAI") >= 0) return "LEFT"
  if (text.indexOf("RIGHT") >= 0 || text.indexOf("PHAI") >= 0) return "RIGHT"
  if (text.indexOf("STRAIGHT") >= 0 || text.indexOf("THANG") >= 0) return "STRAIGHT"
  if (text.indexOf("UTURN") >= 0 || text.indexOf("QUAY") >= 0) return "UTURN"
  if (text.indexOf("ROUND") >= 0 || text.indexOf("VONG") >= 0) return "ROUNDABOUT"
  if (text.indexOf("ARRIVE") >= 0 || text.indexOf("DEN") >= 0) return "ARRIVE"
  return text || "UNKNOWN"
}

function trimText(value, maxLength) {
  const text = String(value === undefined || value === null ? "" : value).trim()
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 1) + "."
}

function arrayBufferToString(buffer) {
  const bytes = new Uint8Array(buffer)
  let text = ""
  for (let i = 0; i < bytes.length; i++) {
    text += String.fromCharCode(bytes[i])
  }
  return decodeURIComponent(escape(text))
}
