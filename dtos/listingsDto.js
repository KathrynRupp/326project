export const toListingDto = (listing) => ({
  id: listing._id.toString(),
  title: listing.title,
  listerName: listing.listerName,
  category: listing.category,
  description: listing.description,
});
