const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()

// HTTP endpoint for machines to create alerts (POST JSON)
exports.createAlert = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  try {
    const { title, description, severity, machineId } = req.body
    if (!title || !machineId) return res.status(400).send('Missing fields')

    const docRef = await db.collection('alerts').add({
      title,
      description: description || '',
      severity: severity || 'warning',
      machineId,
      status: 'Active',
      timeStamp: admin.firestore.FieldValue.serverTimestamp()
    })

    return res.status(201).json({ id: docRef.id })
  } catch (err) {
    console.error(err)
    return res.status(500).send('Server error')
  }
})

// Firestore trigger: runs when a new alert is created
exports.onNewAlert = functions.firestore.document('alerts/{alertId}').onCreate(async (snap, ctx) => {
  const alert = snap.data()
  // TODO: integrate FCM or email to notify operators
  console.log('New alert created:', ctx.params.alertId, alert)
  // Example: write to a logs collection
  await db.collection('alertLogs').add({
    alertId: ctx.params.alertId,
    action: 'created',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  })
})
