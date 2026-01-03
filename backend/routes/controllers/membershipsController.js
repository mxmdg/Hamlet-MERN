const Membership = require("../../models/memberships");

const membershipsController = {};

membershipsController.getMemberships = async (req, res, next) => {
  try {
    const memberships = await Membership.find()
      .populate("userId", "name email")
      .populate("tenantId", "key name");
    res.json(memberships);
  } catch (e) {
    next(e);
  }
};

membershipsController.getByUser = async (req, res, next) => {
  try {
    const memberships = await Membership.find({
      userId: req.params.userId,
    }).populate("tenantId", "key name status");
    res.json(memberships);
  } catch (e) {
    next(e);
  }
};

membershipsController.getByTenant = async (req, res, next) => {
  try {
    const memberships = await Membership.find({
      tenantId: req.params.tenantId,
    }).populate("userId", "name email");
    res.json(memberships);
  } catch (e) {
    next(e);
  }
};

membershipsController.createMembership = async (req, res, next) => {
  try {
    const { userId, tenantId, role, status } = req.body;
    const newMembership = new Membership({
      userId,
      tenantId,
      role,
      status,
    });
    const membership = await newMembership.save();
    res.status(201).json(membership);

    return await newMembership.save();
  } catch (e) {
    next(e);
  }
};

module.exports = membershipsController;
