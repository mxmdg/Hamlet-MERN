module.exports = async function resolveTenant(req, res, next) {
  if (!req.user) return next();

  const membership = await Membership.findOne({
    userId: req.user._id,
    status: "active",
  });

  if (!membership) {
    return res.status(403).json({ error: "No tenant assigned" });
  }

  req.tenantId = membership.tenantId;
  next();
};
