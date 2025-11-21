import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'all', 'month', 'year'

    // Get date range based on period
    const now = new Date();
    let dateFilter = {};
    
    if (period === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = {
        createdAt: {
          gte: startOfMonth,
        },
      };
    } else if (period === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = {
        createdAt: {
          gte: startOfYear,
        },
      };
    }

    // Get total events and events this period
    const [totalEvents, eventsThisPeriod] = await Promise.all([
      db.event.count(),
      db.event.count({
        where: dateFilter,
      }),
    ]);

    // Get total attendees and attendees this period
    const [totalAttendees, attendeesThisPeriod] = await Promise.all([
      db.attendee.count(),
      db.attendee.count({
        where: dateFilter,
      }),
    ]);

    // Get total experiences and experiences this period
    const [totalExperiences, experiencesThisPeriod] = await Promise.all([
      db.experience.count(),
      db.experience.count({
        where: dateFilter,
      }),
    ]);

    // Calculate average ratings
    const [eventRatings, experienceRatings] = await Promise.all([
      db.eventRating.findMany(),
      db.experienceRating.findMany(),
    ]);

    const averageEventRating = eventRatings.length > 0
      ? eventRatings.reduce((sum, rating) => sum + rating.rating, 0) / eventRatings.length
      : 0;

    const averageExperienceRating = experienceRatings.length > 0
      ? experienceRatings.reduce((sum, rating) => sum + rating.rating, 0) / experienceRatings.length
      : 0;

    const overallAverageRating = (averageEventRating + averageExperienceRating) / 2;

    const summary = {
      totalEvents,
      eventsThisPeriod,
      totalAttendees,
      attendeesThisPeriod,
      totalExperiences,
      experiencesThisPeriod,
      averageRating: parseFloat(overallAverageRating.toFixed(1)),
      averageEventRating: parseFloat(averageEventRating.toFixed(1)),
      averageExperienceRating: parseFloat(averageExperienceRating.toFixed(1)),
      period,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error generating report summary:', error);
    return NextResponse.json(
      { error: 'Error generating report summary' },
      { status: 500 }
    );
  }
}