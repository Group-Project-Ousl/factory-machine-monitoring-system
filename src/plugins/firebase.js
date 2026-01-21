import { reactive } from 'vue'
import { auth, db, storage } from '../firebase'
import { onAuthStateChanged, updateProfile as fbUpdateProfile } from 'firebase/auth'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const firebaseState = reactive({
  user: auth.currentUser || null,
  ready: false
})

/* guard to avoid repeated auto-uploads per uid during session */
const ensuredAvatars = new Set()
/* guard to avoid repeated displayName updates per uid during session */
const ensuredDisplayName = new Set()

onAuthStateChanged(auth, (user) => {
  console.log('[firebase] onAuthStateChanged', { uid: user?.uid, displayName: user?.displayName, photoURL: user?.photoURL })
  firebaseState.user = user
  firebaseState.ready = true

  // auto-generate and upload initials avatar if user has no photoURL
  if (user && !user.photoURL && !ensuredAvatars.has(user.uid)) {
    ensuredAvatars.add(user.uid)
    // defer to next tick (safe) — function is hoisted below
    ensureAvatarForUser(user).catch((e) => {
      // if error, allow retry later by removing guard
      console.error('ensureAvatarForUser error', e)
      ensuredAvatars.delete(user.uid)
    })
  }

  // auto-populate displayName from email local-part when missing
  if (user && !user.displayName && !ensuredDisplayName.has(user.uid)) {
    ensuredDisplayName.add(user.uid)
    ensureDisplayNameForUser(user).catch((e) => {
      console.error('ensureDisplayNameForUser error', e)
      ensuredDisplayName.delete(user.uid)
    })
  }
})

async function uploadAvatar(file, onProgress, targetUser = null) {
  const currentUser = targetUser || auth.currentUser
  if (!currentUser) throw new Error('Not authenticated')
  const uid = currentUser.uid
  const path = `avatars/${uid}/${Date.now()}_${file.name}`
  const sRef = storageRef(storage, path)
  const uploadTask = uploadBytesResumable(sRef, file)

  return await new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress(Math.round(percent))
        }
      },
      (err) => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          // update Firebase Auth profile photoURL on the provided user object
          await fbUpdateProfile(currentUser, { photoURL: url })
          // ensure the user object is refreshed
          if (currentUser?.reload) await currentUser.reload()
          // reflect change in reactive state (prefer auth.currentUser if available)
          firebaseState.user = auth.currentUser || currentUser
          resolve(url)
        } catch (e) {
          reject(e)
        }
      }
    )
  })
}

// generate simple initials (1-3 chars)
function getInitialsFromName(name = '') {
  const cleaned = (name || '').trim()
  if (!cleaned) return 'U'
  const parts = cleaned.split(/\s+/)
  const first = parts[0]?.charAt(0) || ''
  const second = parts[1]?.charAt(0) || ''
  return (first + second).slice(0, 3).toUpperCase()
}

// create SVG string for given initials
function createInitialsSVG(initials) {
  const size = 512
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#eff6ff"/>
        <stop offset="1" stop-color="#2563eb"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="${Math.floor(size * 0.45)}" fill="#ffffff" text-anchor="middle" dominant-baseline="central" font-weight="700">${initials}</text>
  </svg>`
}

// ensure the user has a photoURL by uploading initials SVG automatically
async function ensureAvatarForUser(user) {
  if (!user || user.photoURL) return false
  try {
    // build initials from displayName or email
    const nameSrc = user.displayName || (user.email ? user.email.split('@')[0] : 'User')
    const initials = getInitialsFromName(nameSrc)
    const svg = createInitialsSVG(initials)
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const file = new File([blob], `${initials}_auto_${Date.now()}.svg`, { type: 'image/svg+xml' })

    // upload via uploadAvatar and pass the user object
    await uploadAvatar(file, () => {}, user)
    console.log('[firebase] ensureAvatarForUser: uploaded avatar for', user.uid)
    return true
  } catch (err) {
    console.error('[firebase] ensureAvatarForUser failed', err)
    throw err
  }
}

// ensure user.displayName exists (use email local-part) and update reactive state
async function ensureDisplayNameForUser(user) {
  if (!user || user.displayName) return false
  const name = user.displayName || (user.email ? user.email.split('@')[0] : 'User')
  try {
    await fbUpdateProfile(user, { displayName: name })
    if (user?.reload) await user.reload()
    firebaseState.user = auth.currentUser || user
    console.log('[firebase] ensureDisplayNameForUser: set displayName for', user.uid, '=>', name)
    return true
  } catch (err) {
    console.error('[firebase] ensureDisplayNameForUser failed', err)
    throw err
  }
}

async function updateUserProfile(fields = {}) {
  if (!auth.currentUser) throw new Error('Not authenticated')
  await fbUpdateProfile(auth.currentUser, fields)
  if (auth.currentUser?.reload) await auth.currentUser.reload()
  firebaseState.user = auth.currentUser
  return firebaseState.user
}

async function signOut() {
  await auth.signOut()
  firebaseState.user = null
}

export default {
  install(app) {
    const api = {
      auth,
      db,
      storage,
      state: firebaseState,
      uploadAvatar,
      updateUserProfile,
      signOut,
      // exposed helpers for debugging / manual trigger
      ensureAvatarForUser,
      ensureDisplayNameForUser
    }
    app.provide('firebase', api)
    app.config.globalProperties.$firebase = api
  }
}
