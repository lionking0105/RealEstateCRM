const RoleAccess = require('../../model/schema/roleAccess');
const User = require('../../model/schema/user');

const index = async (req, res) => {
    try {
        const query = req.query;
        let result = await RoleAccess.find(query);
        res.send(result);
    } catch (err) {
        console.error('Error :', err);
        res.status(400).json({ err, error: 'Something wents wrong' });
    }
}

const add = async (req, res) => {
    try {
        const { roleName, description } = req.body;

        const existingRole = await RoleAccess.findOne({ roleName: { $regex: new RegExp(`^${roleName}$`, 'i') } }).exec();

        if (existingRole) {
            return res.status(400).json({ message: `${roleName} Role already exist` });
        }
        else {
            const createdDate = new Date();
            const titles = ['Email', 'Call', 'Meeting', 'Task', 'Property', 'Contacts', 'Lead'];
            const access = [];

            titles?.forEach((item) => {
                access.push({ title: item, create: false, update: false, delete: false, view: false });
            })

            const role = new RoleAccess({ roleName: roleName, description, access, createdDate });
            await role.save();
            return res.status(200).json({ message: `${roleName} Role created successfully` });
        }
    } catch (err) {
        console.error('Failed to create role:', err);
        return res.status(400).json({ message: `Failed to create role`, err: err.toString() });
    }
}

const edit = async (req, res) => {
    try {
        req.body.modifyDate = new Date();
        let result = await RoleAccess.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Role Access:', err);
        res.status(400).json({ error: 'Failed to Update Role Access' });
    }
}

const roleAssignedUsers = async (req, res) => {
    try {
        let result = await User.find({ roles: { $in: [req.params.id] } });
        res.send(result);

    } catch (err) {
        console.error('Error :', err);
        res.status(400).json({ err, error: 'Something wents wrong' });
    }
}

module.exports = { index, add, edit, roleAssignedUsers }