import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('ID không hợp lệ');
  }

  const reservations = await getReservations({ listingId });

  if (reservations.length > 0) {
    throw new Error('Không thể xóa mục có đặt chỗ liên quan');
  }

  // Nếu không có đặt chỗ liên quan, tiếp tục xử lý xóa
  const deletedListing = await prisma.listing.delete({
    where: { id: listingId }
  });

  return NextResponse.json(deletedListing);
}
