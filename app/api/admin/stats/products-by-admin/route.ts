import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await requireAuth()
    
    // Get products grouped by admin who made them
    const productsByAdmin = await prisma.product.groupBy({
      by: ['madeBy'],
      where: {
        madeBy: {
          not: null
        }
      },
      _count: {
        id: true
      }
    })

    // Get admin details for each admin ID
    const adminIds = productsByAdmin.map(item => item.madeBy).filter(Boolean)
    const admins = await prisma.adminUser.findMany({
      where: {
        id: {
          in: adminIds as string[]
        }
      },
      select: {
        id: true,
        email: true
      }
    })

    // Create a map of admin ID to email
    const adminEmailMap = admins.reduce((map, admin) => {
      map[admin.id] = admin.email
      return map
    }, {} as Record<string, string>)

    // Format data for the pie chart
    const chartData = productsByAdmin.map((item, index) => ({
      name: adminEmailMap[item.madeBy!] || 'Unknown Admin',
      value: item._count.id,
      color: [
        "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
        "#82CA9D", "#FFC658", "#FF7C7C", "#8DD1E1", "#D084D0"
      ][index % 10]
    })).sort((a, b) => b.value - a.value) // Sort by value (descending)

    return NextResponse.json({ data: chartData })
  } catch (error) {
    console.error("Failed to fetch products by admin:", error)
    return NextResponse.json(
      { error: "Failed to fetch products by admin" },
      { status: 500 }
    )
  }
}
