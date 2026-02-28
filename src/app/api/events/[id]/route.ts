import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 },
      );
    }

    const body = await request.json();

    // Check slug uniqueness if changing slug
    if (body.slug && body.slug !== event.slug) {
      const slugTaken = await prisma.event.findUnique({
        where: { slug: body.slug },
      });
      if (slugTaken) {
        return NextResponse.json(
          { error: "Ce slug est déjà utilisé par un autre événement." },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description && { description: body.description }),
        ...(body.coverImage !== undefined && {
          coverImage: body.coverImage || null,
        }),
        ...(body.venue && { venue: body.venue }),
        ...(body.address && { address: body.address }),
        ...(body.date && { date: new Date(body.date) }),
        ...(body.endDate !== undefined && {
          endDate: body.endDate ? new Date(body.endDate) : null,
        }),
        ...(body.capacity !== undefined && {
          capacity: parseInt(body.capacity),
        }),
        ...(body.showCapacity !== undefined && {
          showCapacity: body.showCapacity,
        }),
        ...(body.program !== undefined && {
          program: body.program,
        }),
        ...(body.tiers !== undefined && {
          tiers: body.tiers,
        }),
        ...(body.priceEarly !== undefined && {
          priceEarly: parseFloat(body.priceEarly),
        }),
        ...(body.priceStd !== undefined && {
          priceStd: parseFloat(body.priceStd),
        }),
        ...(body.priceVip !== undefined && {
          priceVip: parseFloat(body.priceVip),
        }),
        ...(body.published !== undefined && { published: body.published }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update event error:", error);
    const message =
      error instanceof Error ? error.message : "Erreur interne.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 },
      );
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
