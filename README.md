# VietNav Vela Quick App

Slave app for Xiaomi Smart Band 10 / Xiaomi Vela OS.

Transport:

- Vela receives navigation payloads with `@system.interconnect`.
- Android sends bytes with Xiaomi Wearable SDK `MessageApi.sendMessage`.
- Payload format: `DIRECTION|DISTANCE|STREET|ETA`.

Build:

```bash
npm install
npm run build
```

Install the generated `.rpk` with AIOT IDE, then open VietNav Companion on Android.
