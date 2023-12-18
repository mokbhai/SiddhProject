const asyncHandler = require("express-async-handler");
const { statusCodes } = require("../enums/statusCodes");
const Contact = require("../models/contactModel");

class contactController {
    //@desc Get all Contacts
    //@route GET /api/contacts/
    getContacts = asyncHandler(async (req, res) => {
        const contacts = await Contact.find();
        res.status(statusCodes.OK).json(contacts);
    });


    //@desc Get Contact
    //@route GET /api/contacts/:id
    getContact = asyncHandler(async (req, res) => {

        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(statusCodes.NOT_FOUND);
            throw new Error("Contact not found");
        }

        res.status(statusCodes.OK).json(contact);
    });

    //@desc Create Contact
    //@route POST /api/contacts/
    createContact = asyncHandler(async (req, res) => {
        console.log("the req body is ", req.body);
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            res.status(statusCodes.BAD_GATEWAY);
            throw new Error("All feilds are mendatory");
        }

        const contact = await Contact.create({
            name,
            email,
            phone
        });
        res.status(statusCodes.CREATED).json(contact);
    });

    //@desc Update Contact
    //@route PUT /api/contacts/
    updateContact = asyncHandler(async (req, res) => {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(statusCodes.NOT_FOUND);
            throw new Error("Contact not found");
        }

        const updateContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(statusCodes.OK).json(updateContact);
    });

    //@desc Delete Contact
    //@route DELETE /api/contacts/:id
    deleteContact = asyncHandler(async (req, res) => {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(statusCodes.NOT_FOUND);
            throw new Error("Contact not found");
        }
        await contact.deleteOne();
        res.status(statusCodes.OK).json(contact);
    });
}

module.exports = {
    contactController
};