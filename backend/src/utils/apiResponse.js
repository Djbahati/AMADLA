export function ok(res, data, message = "Success", status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function fail(res, message = "Error", status = 400, details = null) {
  return res.status(status).json({ success: false, message, details });
}
