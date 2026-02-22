import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { prisma } from "./prisma"

const SESSION_COOKIE_NAME = "admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // seconds (7 days)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex")
}

export async function createSession(adminUserId: string) {
  const cookieStore = await cookies()
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  // Create session record in DB
  await prisma.session.create({
    data: {
      token,
      adminUserId,
      expires: expiresAt,
    },
  })

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)
  if (!session?.value) return null

  try {
    const dbSession = await prisma.session.findUnique({
      where: { token: session.value },
    })
    if (!dbSession) return null
    if (dbSession.expires.getTime() < Date.now()) {
      // expired - clean up
      try { await prisma.session.delete({ where: { id: dbSession.id } }) } catch {}
      return null
    }
    return dbSession.adminUserId
  } catch {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)
  if (session?.value) {
    try {
      await prisma.session.deleteMany({ where: { token: session.value } })
    } catch (e) {
      // ignore
    }
  }
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentAdmin() {
  const sessionId = await getSession()
  if (!sessionId) return null

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: sessionId },
      select: { id: true, email: true },
    })
    return admin
  } catch {
    return null
  }
}

export async function requireAuth() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect("/admin-login")
  }
  return admin
}
