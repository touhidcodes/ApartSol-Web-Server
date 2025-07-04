import { Prisma } from "@prisma/client";

// for all searching
export const propertySearchableFields: string[] = [
  "state",
  "city",
  "street",
  "country",
  "title",
  "description",
];

// for all filtering
export const propertyFilterableFields: string[] = [
  "availability",
  "searchTerm",
  "location",
  "description",
  "amenities",
  "title",
  "minPrice",
  "maxPrice",
  "totalBedrooms",
  "purpose",
  "sortBy",
];

export const mapSortOptionToOrderBy = (
  sortValue: string
): Prisma.PropertyOrderByWithRelationInput => {
  switch (sortValue) {
    case "newest":
      return { createdAt: "desc" };
    case "oldest":
      return { createdAt: "asc" };
    case "rent-high":
      return { rent: "desc" };
    case "rent-low":
      return { rent: "asc" };
    case "title-az":
      return { title: "asc" };
    case "title-za":
      return { title: "desc" };
    default:
      return { createdAt: "desc" };
  }
};
