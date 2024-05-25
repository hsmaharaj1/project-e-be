const {addEvent, updateEvent, deleteEvent} = require("../Controllers/AddEvent")
const {joinEvent} = require("../Controllers/JoinEvents")
const {acceptRequest} = require("../Controllers/AcceptRequest")
const {fetchCreatedEvents, fetchRequestedEvents, fetchRequestsForEvent, eventDetails} = require("../Controllers/FetchEvents")
const router = require("express").Router()
const verifyToken = require('../Middlewares/VerifyToken')

router.post("/addevent", verifyToken, addEvent)
router.post('/joinevent', verifyToken, joinEvent)
router.post('/acceptrequest', verifyToken, acceptRequest)
router.get('/createdevents', verifyToken, fetchCreatedEvents)
router.get('/requestedevents', verifyToken, fetchRequestedEvents)
router.get('/requests/:eventId', verifyToken, fetchRequestsForEvent)
router.get('/:eventId', verifyToken, eventDetails)
router.put('/update/:eventId', verifyToken, updateEvent)
router.delete('/delete/:eventId', verifyToken, deleteEvent)

module.exports = router