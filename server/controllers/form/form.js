const mongoose = require("mongoose");
const CustomField = require("../../model/schema/customField");

const add = async (req, res) => {
    try {
        if (!req?.body?.moduleId) {
            return res.status(400).send({ success: false, message: "moduleId is required" })
        }

        const customField = await CustomField.findOne({ _id: req.body?.moduleId }).select("moduleName");

        if (!customField) {
            return res.status(404).send({ success: false, message: "Module not found" });
        }

        const collectionExists = await mongoose.connection.db.listCollections({ name: (`${customField?.moduleName}`) }).hasNext();

        if (!collectionExists) {
            return res.status(404).send({ success: false, message: "Collection not exists" })
        }

        const ExistingModel = mongoose.model(`${customField?.moduleName}`);

        if (typeof ExistingModel !== 'function') {
            return res.status(500).send({ success: false, message: 'Invalid model' });
        }

        req.body.createdDate = new Date();
        const newDocument = new ExistingModel(req.body);
        await newDocument.save();
        return res.status(200).json({ message: 'Record added successfully', data: newDocument });

    } catch (err) {
        console.error(`Failed to create document`, err);
        return res.status(400).json({ success: false, message: `Failed to Add Record`, error: err.toString() });
    }
};

const edit = async (req, res) => {
    try {
        if (!req?.body?.moduleId) {
            return res.status(400).send({ success: false, message: "moduleId is required" });
        }

        const customField = await CustomField.findOne({ _id: req.body?.moduleId }).select("moduleName");

        if (!customField) {
            return res.status(404).send({ success: false, message: "Module not found" });
        }

        const collectionName = customField?.moduleName;

        const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();

        if (!collectionExists) {
            return res.status(404).send({ success: false, message: `Collection '${collectionName}' not exists` });
        }

        const ExistingModel = mongoose.model(collectionName);

        if (typeof ExistingModel !== 'function') {
            return res.status(500).send({ success: false, message: 'Invalid model' });
        }

        const result = await ExistingModel.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );

        if (result) {
            return res.status(200).json({ success: true, message: 'Record updated successfully', data: result });
        } else {
            return res.status(404).json({ success: false, message: 'Record not found for the given id' });
        }
    } catch (err) {
        console.error(`Failed to Update document`, err);
        return res.status(400).json({ success: false, message: `Failed to Update Record`, error: err.toString() });
    }
};

module.exports = { add, edit };