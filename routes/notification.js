const express = require("express");
const Bookings = require("./../models/bookings/bookings");
const router = express.Router();




router.get("/", async(req,res)=> {

    try {
        const result = await Bookings.find();

        let events = []
        result.forEach((e)=> e.events.filter((f)=> f.type === "ADD_AMENITY").forEach((event)=> events.push({...event, booking_reference: e.booking_reference, guest: e.guest,  id: e._id})))

        const formatEvents = events.map((e)=> ({...e, message: `Guest added ${e.additional_type}`,}))
        return res.json(formatEvents)
    } catch (error) {
        return res.status(400).json({error})
    }
})

module.exports = router;