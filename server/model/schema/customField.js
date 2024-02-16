const mongoose = require("mongoose");

const typeValidator = (val) => {
    const allowedTypes = ['String', 'Number', 'RegExp', 'Date']
    const isValidType = allowedTypes.some(type => val instanceof mongoose.Schema.Types[type]);
    return isValidType;
}

const validationSchema = new mongoose.Schema({
    require: {
        type: Boolean,
    },
    max: {
        type: Boolean,
    },
    min: {
        type: Boolean,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        validate: [typeValidator, 'Invalid data type for "value" field.']
    },
    message: {
        type: String
    },
    match: {
        type: Boolean,
    },
    formikType: {
        type: String
    }
});

const radioSelctboxSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    value: {
        type: String,
    }
});

const fieldsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // unique: true, 
        trim: true
    },
    label: {
        type: String,
    },
    type: {
        type: String,
        default: 'text'
    },
    fixed: {
        type: Boolean,
        default: false
    },
    delete: {
        type: Boolean,
        default: false
    },
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
    },
    backendType: {
        type: String,
        default: 'Mixed',
        required: true
    },
    isTableField: {
        type: Boolean,
        default: false
    },
    // options: [radioSelctboxSchema],
    options: {
        type: [radioSelctboxSchema],
        default: undefined
    },
    validation: [validationSchema],
});

const headingsSchema = new mongoose.Schema({
    heading: {
        type: String
    }
});

const customFieldSchema = new mongoose.Schema({
    moduleName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    no: {
        type: Number
    },
    headings: [headingsSchema],
    fields: [fieldsSchema]
});

module.exports = mongoose.model("CustomField", customFieldSchema, 'CustomField');