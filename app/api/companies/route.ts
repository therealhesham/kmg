import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    
    const companies = await prisma.company.findMany({
      where: showAll ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST create new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logo, description, website, order, comingSoon } = body;

    const company = await prisma.company.create({
      data: {
        name,
        logo,
        description,
        website,
        order: order || 0,
        comingSoon: comingSoon ?? true,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

