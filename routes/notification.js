const express = require("express");
const Bookings = require("./../models/bookings/bookings");
const Settings = require("./../models/site_settings");
const router = express.Router();




router.get("/", async(req,res)=> {

    try {
        const result = await Bookings.find();

        let events = []
        result.forEach((e)=> e.events.filter((f)=> f.type === "ADD_AMENITY").forEach((event)=> events.push({...event, booking_reference: e.booking_reference, guest: e.guest,  id: e._id})))

        const formatEvents = events.map((e)=> ({...e, message: `Guest added ${e.additional_type}`,}))


        const settings = await Settings.find();
        const settingsId = settings[0];

        
        return res.json({events: formatEvents, notif:settingsId })
    } catch (error) {
        return res.status(400).json({error})
    }
})

module.exports = router;