export function uploadImages(req, res) {
  const files = req.files || [];
  res.status(201).json({
    urls: files.map((file) => `/uploads/${file.filename}`),
  });
}
