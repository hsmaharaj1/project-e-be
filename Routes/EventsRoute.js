const {addEvent} = require("../Controllers/AddEvent")
const {joinEvent} = require("../Controllers/JoinEvents")
const {acceptRequest} = require("../Controllers/AcceptRequest")
const {fetchCreatedEvents, fetchRequestedEvents, fetchRequestsForEvent} = require("../Controllers/FetchEvents")
const router = require("express").Router()

router.post("/addevent", addEvent)
router.post('/joinevent', joinEvent)
router.post('/acceptrequest', acceptRequest)
router.get('/createdevents', fetchCreatedEvents)
router.get('/requestedevents', fetchRequestedEvents)
router.get('/requests/:eventId', fetchRequestsForEvent)

module.exports = router