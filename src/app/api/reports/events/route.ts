import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'date'; // 'date', 'rating', 'attendees'
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // 'asc', 'desc'

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = {
          ratings: {
            _avg: {
              rating: sortOrder,
            },
          },
        };
        break;
      case 'attendees':
        orderBy = {
          attendees: {
            _count: sortOrder,
          },
        };
        break;
      case 'date':
      default:
        orderBy = {
          date: sortOrder,
        };
        break;
    }

    const events = await db.event.findMany({
      include: {
        attendees: true,
        ratings: true,
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    // Calculate additional metrics for each event
    const eventsWithMetrics = events.map(event => {
      const averageRating = event.ratings.length > 0 
        ? event.ratings.reduce((sum, rating) => sum + rating.rating, 0) / event.ratings.length
        : 0;

      return {
        id: event.id,
        name: event.name,
        date: event.date,
        place: event.place,
        description: event.description,
        imageUrl: event.imageUrl,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingCount: event.ratings.length,
        attendeeCount: event.attendees.length,
      };
    });

    // Get total count for pagination
    const totalCount = await db.event.count();

    return NextResponse.json({
      events: eventsWithMetrics,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching events report:', error);
    return NextResponse.json(
      { error: 'Error fetching events report' },
      { status: 500 }
    );
  }
}