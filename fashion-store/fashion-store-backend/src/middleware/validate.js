// src/middleware/validate.js
// Lightweight Zod-compatible middleware wrapper.
// If you pass a schema object with parse method (zod), it validates req.body.
export default function validate(schema) {
  return (req, res, next) => {
    if (!schema) return next();
    try {
      if (typeof schema.parse === 'function') {
        schema.parse(req.body);
        return next();
      }
      return next();
    } catch (err) {
      // zod throws a ZodError; send friendly validation response
      return res.status(400).json({ success:false, message: 'Validation failed', errors: err.errors || err.message || String(err) });
    }
  };
}
