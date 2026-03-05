import { prisma } from "@/lib/prisma"

export async function createMysteryBoxNotification(
  mysteryBoxId: number,
  type: 'created' | 'updated' | 'deleted',
  title?: string,
  body?: string
) {
  try {
    const notificationTitle = title || `Mystery Box ${type}`
    const notificationBody = body || `A mystery box order was ${type}`

    await prisma.notification.create({
      data: {
        type: `mystery_box_${type}`,
        referenceId: mysteryBoxId.toString(),
        title: notificationTitle,
        body: notificationBody,
      },
    })

    console.log(`Notification created: ${notificationTitle}`)
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function createMysteryBoxStatusChangeNotification(
  mysteryBoxId: number,
  oldStatus: string,
  newStatus: string,
  username?: string
) {
  try {
    const title = 'Mystery Box Status Updated'
    const body = username 
      ? `Order for ${username} changed from ${oldStatus} to ${newStatus}`
      : `Order status changed from ${oldStatus} to ${newStatus}`

    await prisma.notification.create({
      data: {
        type: 'mystery_box_status_change',
        referenceId: mysteryBoxId.toString(),
        title,
        body,
      },
    })

    console.log(`Status change notification created: ${title}`)
  } catch (error) {
    console.error('Failed to create status change notification:', error)
  }
}
