const express  = require('express');
const router   = express.Router();
const Ticket   = require('../models/Ticket');
const Employee = require('../models/Employee');
const { adminAuth } = require('../middleware/auth');

const ORG_KEY = process.env.ORG_TICKETS_KEY || 'mei@tickets2025';

// ── Org key auth middleware (for /tickets page)
const orgAuth = (req, res, next) => {
  const key = req.headers['x-org-key'] || req.query.orgKey;
  if (key !== ORG_KEY) return res.status(401).json({ success: false, message: 'Invalid organisation key' });
  next();
};

// ── Employee auth middleware (for careers /tickets)
const employeeAuth = async (req, res, next) => {
  const { username, authKey } = req.headers;
  if (!username || !authKey) return res.status(401).json({ success: false, message: 'Missing credentials' });
  const emp = await Employee.findOne({ username: username.toLowerCase(), authKey, isActive: true });
  if (!emp) return res.status(401).json({ success: false, message: 'Invalid username or key' });
  emp.lastLogin = new Date();
  await emp.save();
  req.employee = emp;
  next();
};

// ────────────────────────────────
// PUBLIC — raise a ticket (no auth)
// POST /api/tickets/public
// ────────────────────────────────
router.post('/public', async (req, res) => {
  try {
    const { title, description, raisedBy, email, phone, type } = req.body;
    if (!title || !description || !raisedBy)
      return res.status(400).json({ success: false, message: 'title, description and raisedBy required' });

    const ticket = await Ticket.create({
      title, description,
      raisedBy, email: email || '', phone: phone || '',
      raisedByType: 'public',
      type: type || 'query',
      status: 'open',
    });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────
// ADMIN — create task ticket
// POST /api/tickets/admin   (adminAuth)
// ────────────────────────────────
router.post('/admin', adminAuth, async (req, res) => {
  try {
    const { title, description, assignee, deadline, priority, type } = req.body;
    if (!title || !description)
      return res.status(400).json({ success: false, message: 'title and description required' });

    let assigneeId = null;
    if (assignee) {
      const emp = await Employee.findOne({ username: assignee.toLowerCase() });
      if (emp) assigneeId = emp._id;
    }

    const ticket = await Ticket.create({
      title, description,
      raisedBy: 'admin', raisedByType: 'admin',
      assignee: assignee || '',
      assigneeId,
      deadline: deadline || null,
      priority: priority || 'medium',
      type: type || 'task',
      status: 'open',
    });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────
// ADMIN — list all tickets
// GET /api/tickets/admin  (adminAuth)
// ────────────────────────────────
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { status, assignee, type } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (assignee) filter.assignee = assignee;
    if (type)     filter.type     = type;
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────
// ADMIN — update a ticket
// PATCH /api/tickets/admin/:id  (adminAuth)
// ────────────────────────────────
router.patch('/admin/:id', adminAuth, async (req, res) => {
  try {
    const { status, assignee, note, priority, deadline } = req.body;
    const update = { updatedAt: new Date() };
    if (status)   update.status   = status;
    if (assignee !== undefined) {
      update.assignee = assignee;
      const emp = await Employee.findOne({ username: assignee.toLowerCase() });
      update.assigneeId = emp?._id || null;
    }
    if (note !== undefined)     update.note     = note;
    if (priority)               update.priority = priority;
    if (deadline !== undefined) update.deadline = deadline;

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────
// ADMIN — delete a ticket
// DELETE /api/tickets/admin/:id  (adminAuth)
// ────────────────────────────────
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────
// ORG KEY — view all tickets
// GET /api/tickets/org  (orgAuth via header x-org-key)
// ────────────────────────────────
router.get('/org', orgAuth, async (req, res) => {
  try {
    const { status, assignee, type } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (assignee) filter.assignee = assignee;
    if (type)     filter.type     = type;
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    const employees = await Employee.find({ isActive: true }).select('username displayName department');
    res.json({ success: true, tickets, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────
// ORG KEY — verify key only
// POST /api/tickets/org/verify
// ────────────────────────────────
router.post('/org/verify', (req, res) => {
  const { key } = req.body;
  if (key !== ORG_KEY) return res.status(401).json({ success: false, message: 'Invalid key' });
  res.json({ success: true });
});

// ────────────────────────────────
// EMPLOYEE — login verify
// POST /api/tickets/employee/login
// ────────────────────────────────
router.post('/employee/login', async (req, res) => {
  try {
    const { username, authKey } = req.body;
    if (!username || !authKey)
      return res.status(400).json({ success: false, message: 'username and authKey required' });
    const emp = await Employee.findOne({ username: username.toLowerCase(), authKey, isActive: true });
    if (!emp) return res.status(401).json({ success: false, message: 'Invalid username or key' });
    emp.lastLogin = new Date();
    await emp.save();
    res.json({ success: true, employee: { id: emp._id, username: emp.username, displayName: emp.displayName, department: emp.department, role: emp.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────
// EMPLOYEE — get my tickets
// GET /api/tickets/employee/mine  (employeeAuth)
// ────────────────────────────────
router.get('/employee/mine', employeeAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignee: req.employee.username }).sort({ createdAt: -1 });
    res.json({ success: true, tickets, employee: { displayName: req.employee.displayName, username: req.employee.username } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────
// EMPLOYEE — update ticket status
// PATCH /api/tickets/employee/:id  (employeeAuth)
// ────────────────────────────────
router.patch('/employee/:id', employeeAuth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const ticket = await Ticket.findOne({ _id: req.params.id, assignee: req.employee.username });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found or not assigned to you' });
    if (status) ticket.status = status;
    if (note !== undefined) ticket.note = note;
    ticket.updatedAt = new Date();
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
