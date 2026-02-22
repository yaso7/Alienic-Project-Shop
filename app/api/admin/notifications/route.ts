import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  await requireAuth()

  try {
    // Fetch unread notifications only (persistent model)
    const notifications = await prisma.notification.findMany({
      where: { isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, type: true, referenceId: true, title: true, body: true, createdAt: true },
    })

    // Transform to match old format for backwards compatibility with UI
    const newMessages = notifications
      .filter(n => n.type === 'contact')
      .map(n => ({
        id: n.id,
        name: n.title || 'Contact',
        subject: n.body || '',
        createdAt: n.createdAt.toISOString(),
      }))

    // Fetch testimonials with actual ratings
    const testimonialNotifications = await prisma.notification.findMany({
      where: { 
        type: 'testimonial',
        isRead: false 
      }
    })

    // Get testimonial IDs and fetch their ratings
    const testimonialIds = testimonialNotifications
      .filter(n => n.referenceId)
      .map(n => n.referenceId!)

    const testimonials = await prisma.testimonial.findMany({
      where: { id: { in: testimonialIds } },
      select: { id: true, rating: true }
    })

    const testimonialMap = new Map(testimonials.map(t => [t.id, t.rating]))

    const pendingTestimonials = testimonialNotifications.map(n => ({
      id: n.id,
      name: n.title || 'Testimonial',
      rating: n.referenceId ? (testimonialMap.get(n.referenceId) || 0) : 0,
      createdAt: n.createdAt.toISOString(),
    }))

    const count = newMessages.length + pendingTestimonials.length

    return NextResponse.json({ count, newMessages, pendingTestimonials })
  } catch (e) {
    console.error('Notifications fetch error', e)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await requireAuth()

  try {
    const body = await request.json()

    // Mark a persistent notification as read
    if (body?.action === 'markRead' && body?.id) {
      await prisma.notification.update({ where: { id: body.id }, data: { isRead: true } })
      return NextResponse.json({ success: true })
    }

    // Mark all notifications as read
    if (body?.action === 'markAllRead') {
      await prisma.notification.updateMany({ where: { isRead: false }, data: { isRead: true } })
      return NextResponse.json({ success: true })
    }

    // Mark underlying contact message as read
    if (body?.action === 'markMessageRead' && body?.messageId) {
      await prisma.contactMessage.update({ where: { id: body.messageId }, data: { status: 'Read' } })
      return NextResponse.json({ success: true })
    }

    // Approve or reject testimonials from the dropdown
    if ((body?.action === 'approveTestimonial' || body?.action === 'rejectTestimonial') && body?.id) {
      const status = body.action === 'approveTestimonial' ? 'Approved' : 'Rejected'
      await prisma.testimonial.update({ where: { id: body.id }, data: { status } })

      // Create a system notification about the review action (optional)
      await prisma.notification.create({ data: {
        type: 'system',
        referenceId: body.id,
        title: `Testimonial ${status}`,
        body: `Testimonial ${body.id} was ${status.toLowerCase()} by admin.`,
      }})

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (e) {
    console.error('Notifications POST error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  await requireAuth()

  try {
    const body = await request.json()
    const { limit = 50, offset = 0 } = body

    // Fetch all notifications for history page
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: { id: true, type: true, referenceId: true, title: true, body: true, isRead: true, createdAt: true },
    })

    const total = await prisma.notification.count()

    return NextResponse.json({ notifications, total })
  } catch (e) {
    console.error('Notifications history fetch error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  await requireAuth()

  try {
    const body = await request.json()
    const { notificationId, type } = body

    if (type === 'contact') {
      // Fetch full contact message
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        select: { referenceId: true },
      })

      if (!notification?.referenceId) {
        return NextResponse.json({ error: 'No reference found' }, { status: 404 })
      }

      const message = await prisma.contactMessage.findUnique({
        where: { id: notification.referenceId },
      })

      return NextResponse.json(message)
    }

    if (type === 'testimonial') {
      // Fetch full testimonial
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        select: { referenceId: true },
      })

      if (!notification?.referenceId) {
        return NextResponse.json({ error: 'No reference found' }, { status: 404 })
      }

      const testimonial = await prisma.testimonial.findUnique({
        where: { id: notification.referenceId },
      })

      return NextResponse.json(testimonial)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (e) {
    console.error('Notification detail fetch error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
