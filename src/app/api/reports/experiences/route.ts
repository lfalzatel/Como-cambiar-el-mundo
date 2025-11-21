import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'rating'; // 'rating', 'date'
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
      case 'date':
      default:
        orderBy = {
          createdAt: sortOrder,
        };
        break;
    }

    const experiences = await db.experience.findMany({
      include: {
        ratings: true,
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    // Calculate additional metrics for each experience
    const experiencesWithMetrics = experiences.map(experience => {
      const averageRating = experience.ratings.length > 0 
        ? experience.ratings.reduce((sum, rating) => sum + rating.rating, 0) / experience.ratings.length
        : 0;

      return {
        id: experience.id,
        title: experience.title,
        description: experience.description,
        createdAt: experience.createdAt,
        updatedAt: experience.updatedAt,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingCount: experience.ratings.length,
      };
    });

    // Get total count for pagination
    const totalCount = await db.experience.count();

    return NextResponse.json({
      experiences: experiencesWithMetrics,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching experiences report:', error);
    return NextResponse.json(
      { error: 'Error fetching experiences report' },
      { status: 500 }
    );
  }
}